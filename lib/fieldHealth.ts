/**
 * Turns a satellite analysis into the plain answer a farmer sees: is any part of this field behind
 * the rest of it? Each part is compared with the same field's own middle value, so crop type and
 * growth stage cancel out. That also means it can't tell when the whole field is doing badly, and
 * the screen says so.
 *
 * The cut-offs below are product choices for telling a real difference from sensor noise. They are
 * not agronomic standards, so the wording stays "go and look", never a diagnosis.
 */
import type { AnalysisResult, PolygonGeometry } from "./satellite";
import type { FarmCrop } from "./types";

const WEAK_BELOW_MEDIAN = 0.1;
const MILD_BELOW_MEDIAN = 0.05;
const SOME_WEAK_SHARE = 0.1;
const MUCH_WEAK_SHARE = 0.25;
const MIN_POINTS = 12;
/** below this share of the field seen clearly, clouds decide the answer more than the crop does */
const MIN_COVERAGE = 0.6;
/** how far the weak part's centre must sit from the field's centre to call it one side */
const SIDE_OFFSET = 0.2;
const METRES_PER_DEGREE = 111_320;

/** Before this many days in the ground the satellite mostly sees soil, so nothing is judged yet. */
export const YOUNG_CROP_DAYS = 21;
const LOOKBACK_STEPS = [30, 60, 90];
const SHORTEST_LOOKBACK = 7;

export type Side = "north" | "north_east" | "east" | "south_east" | "south" | "south_west" | "west" | "north_west" | "scattered";

export type FieldAssessment =
  | { kind: "too_small" }
  | { kind: "clouded" }
  | {
      kind: "compared";
      verdict: "even" | "some" | "much";
      /** share of the field's inner part that is well behind */
      weakShare: number;
      median: number;
      side: Side;
    };

export type FieldReadiness = { kind: "not_sown" } | { kind: "finished" } | { kind: "young"; daysLeft: number } | { kind: "ready"; lookbacks: number[] };

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

/** Metres from a point to the nearest edge of the field. */
function distanceToEdge([lng, lat]: number[], boundary: PolygonGeometry) {
  const scaleX = METRES_PER_DEGREE * Math.cos((lat * Math.PI) / 180);
  let best = Infinity;
  for (const ring of boundary.coordinates) {
    for (let i = 0; i + 1 < ring.length; i++) {
      const ax = (ring[i][0] - lng) * scaleX;
      const ay = (ring[i][1] - lat) * METRES_PER_DEGREE;
      const bx = (ring[i + 1][0] - lng) * scaleX;
      const by = (ring[i + 1][1] - lat) * METRES_PER_DEGREE;
      const dx = bx - ax;
      const dy = by - ay;
      const t = dx || dy ? Math.min(1, Math.max(0, -(ax * dx + ay * dy) / (dx * dx + dy * dy))) : 0;
      best = Math.min(best, Math.hypot(ax + t * dx, ay + t * dy));
    }
  }
  return best;
}

/** Which side of the field the weak points lean to, or "scattered" if they don't lean. */
function sideOf(weak: number[][], all: number[][]): Side {
  const mean = (points: number[][], axis: number) => points.reduce((sum, p) => sum + p[axis], 0) / points.length;
  const extent = (axis: number) => {
    const values = all.map((p) => p[axis]);
    return Math.max((Math.max(...values) - Math.min(...values)) / 2, 1e-9);
  };
  const x = (mean(weak, 0) - mean(all, 0)) / extent(0);
  const y = (mean(weak, 1) - mean(all, 1)) / extent(1);
  const ns = y > SIDE_OFFSET ? "north" : y < -SIDE_OFFSET ? "south" : "";
  const ew = x > SIDE_OFFSET ? "east" : x < -SIDE_OFFSET ? "west" : "";
  return ((ns && ew ? `${ns}_${ew}` : ns || ew) || "scattered") as Side;
}

export function assessField({ features, farm_boundary, farm_summary }: Pick<AnalysisResult, "features" | "farm_boundary" | "farm_summary">): FieldAssessment {
  const scale = farm_summary.sample_scale_m;
  const points = features.flatMap((f) => (typeof f.properties.ndvi === "number" ? [{ at: f.geometry.coordinates as number[], ndvi: f.properties.ndvi }] : []));
  const expected = (farm_summary.area_hectares * 10_000) / (scale * scale);
  if (expected < MIN_POINTS) return { kind: "too_small" };
  if (points.length / expected < MIN_COVERAGE) return { kind: "clouded" };
  if (points.length < MIN_POINTS) return { kind: "too_small" };

  // a point on the edge also sees the road or the neighbour's land, which would read as a weak crop
  const inner = points.filter((p) => distanceToEdge(p.at, farm_boundary) >= scale);
  const judged = inner.length >= MIN_POINTS ? inner : points;

  const middle = median(judged.map((p) => p.ndvi));
  const weak = judged.filter((p) => p.ndvi <= middle - WEAK_BELOW_MEDIAN);
  const weakShare = weak.length / judged.length;
  const verdict = weakShare >= MUCH_WEAK_SHARE ? "much" : weakShare >= SOME_WEAK_SHARE ? "some" : "even";
  return {
    kind: "compared",
    verdict,
    weakShare,
    median: middle,
    side: weak.length ? sideOf(weak.map((p) => p.at), judged.map((p) => p.at)) : "scattered",
  };
}

/** Green, amber or red for one point on the map, compared with the field's middle value. */
export function zoneColor(value: number, middle: number): [number, number, number] {
  if (value <= middle - WEAK_BELOW_MEDIAN) return [225, 29, 72];
  if (value <= middle - MILD_BELOW_MEDIAN) return [245, 158, 11];
  return [5, 150, 105];
}

/** Can this crop be checked today, and over which time windows (shortest first, widened if clouds hide the field)? */
export function fieldReadiness(fc: Pick<FarmCrop, "status" | "sowingDate" | "transplantDate">, today: string): FieldReadiness {
  if (fc.status === "harvested" || fc.status === "abandoned") return { kind: "finished" };
  // a transplanted crop's early days are in the nursery, not in this field
  const start = fc.transplantDate ?? fc.sowingDate;
  if (fc.status === "planned" || !start) return { kind: "not_sown" };
  const days = Math.round((Date.parse(today) - Date.parse(start)) / 86_400_000);
  if (days < YOUNG_CROP_DAYS) return { kind: "young", daysLeft: YOUNG_CROP_DAYS - Math.max(days, 0) };
  // never look further back than the crop has been there, or bare soil gets counted as a weak crop
  const fit = LOOKBACK_STEPS.filter((d) => d < days);
  const lookbacks = days <= LOOKBACK_STEPS[LOOKBACK_STEPS.length - 1] ? [...fit, days] : LOOKBACK_STEPS;
  return { kind: "ready", lookbacks: lookbacks.filter((d) => d >= SHORTEST_LOOKBACK) };
}
