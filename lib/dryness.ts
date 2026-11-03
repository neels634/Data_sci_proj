/**
 * Answers "is this field drier than it normally is at this time of year?". Each spot in the field is
 * compared with the same spot in past years, because a fixed dryness number would mean something
 * different for every crop and season. This is an early sign for the farmer, not a drought
 * declaration: only the government declares drought.
 *
 * Rainfall covers about 5 km, so it describes the area around a field and can't say anything about
 * the field itself: nearby fields would all get the same answer. It never sets the field's verdict,
 * though it can strengthen one the field has already shown.
 *
 * Rain bands follow the India Meteorological Department's rainfall departure categories. The moisture
 * cut-offs are product choices, not agronomic or official standards.
 */
import { distanceToEdge, sideOf, type Side } from "./fieldHealth.ts";
import type { PolygonGeometry } from "./satellite";

export type DrynessPoint = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  /** `change` is this spot's moisture now minus its usual; missing without enough past years */
  properties: { ndmi?: number; change?: number };
};

export type DrynessResult = {
  from: string;
  to: string;
  current: { ndmi: number; ndvi: number };
  past: { year: number; ndmi: number; ndvi: number }[];
  rain: { from: string; to: string; mm: number; normal_mm: number } | null;
  features: DrynessPoint[];
  sample_scale_m: number;
  boundary: PolygonGeometry;
};

const DRIER_BY = 0.05;
const MUCH_DRIER_BY = 0.12;
/** how much of the field must be affected before the whole answer changes */
const AFFECTED_SHARE = 0.25;
const MIN_POINTS = 12;
const RAIN_DEFICIENT = -20;
const RAIN_LARGE_DEFICIENT = -60;
/** with so little usual rain, a percentage says nothing: it is simply the dry season */
const DRY_SEASON_NORMAL_MM = 25;

export type RainReading = { kind: "unknown" } | { kind: "dry_season" } | { kind: "normal" | "deficient" | "large_deficient"; departure: number };

export type MoistureReading =
  | { kind: "unusable" }
  | { kind: "no_history" }
  | {
      kind: "usual" | "drier" | "much_drier";
      /** past years compared */
      years: number;
      /** share of the field drier than its usual */
      drierShare: number;
      side: Side;
    };

/** The `area_` answers come from rain alone, so they speak about the area and not this field. */
export type DrynessLevel = "unknown" | "usual" | "drier" | "much_drier" | "area_short" | "area_usual";

export function readRain(rain: DrynessResult["rain"]): RainReading {
  if (!rain) return { kind: "unknown" };
  if (rain.normal_mm < DRY_SEASON_NORMAL_MM) return { kind: "dry_season" };
  const departure = Math.round(((rain.mm - rain.normal_mm) / rain.normal_mm) * 100);
  return { kind: departure <= RAIN_LARGE_DEFICIENT ? "large_deficient" : departure <= RAIN_DEFICIENT ? "deficient" : "normal", departure };
}

/** `cropStanding` is false for a young, planned or finished crop, whose low moisture would only mean bare soil. */
export function readMoisture(result: DrynessResult, cropStanding: boolean): MoistureReading {
  if (!cropStanding) return { kind: "unusable" };
  const points = result.features.flatMap((f) => (typeof f.properties.change === "number" ? [{ at: f.geometry.coordinates as number[], change: f.properties.change }] : []));
  if (points.length < MIN_POINTS) return { kind: "no_history" };

  // a point on the edge also sees the road or the neighbour's land
  const inner = points.filter((p) => distanceToEdge(p.at, result.boundary) >= result.sample_scale_m);
  const judged = inner.length >= MIN_POINTS ? inner : points;
  const drier = judged.filter((p) => p.change <= -DRIER_BY);
  const much = judged.filter((p) => p.change <= -MUCH_DRIER_BY);
  const drierShare = drier.length / judged.length;
  return {
    kind: much.length / judged.length >= AFFECTED_SHARE ? "much_drier" : drierShare >= AFFECTED_SHARE ? "drier" : "usual",
    years: result.past.length,
    drierShare,
    side: drier.length ? sideOf(drier.map((p) => p.at), judged.map((p) => p.at)) : "scattered",
  };
}

export function drynessLevel(moisture: MoistureReading, rain: RainReading): DrynessLevel {
  if (moisture.kind === "much_drier") return "much_drier";
  if (moisture.kind === "drier") return rain.kind === "large_deficient" ? "much_drier" : "drier";
  if (moisture.kind === "usual") return "usual";
  if (rain.kind === "deficient" || rain.kind === "large_deficient") return "area_short";
  if (rain.kind === "normal") return "area_usual";
  return "unknown";
}

/** Green, amber or red for one spot on the map, by how far it is below its own usual. */
export function changeColor(change: number): [number, number, number] {
  if (change <= -MUCH_DRIER_BY) return [225, 29, 72];
  if (change <= -DRIER_BY) return [245, 158, 11];
  return [5, 150, 105];
}

/** Plain text for a Mitra or officer. English, like the case summary. */
export function drynessLines(result: DrynessResult, moisture: MoistureReading, rain: RainReading): string[] {
  const rainLine = !result.rain
    ? "Rainfall data not available."
    : `${result.rain.from} to ${result.rain.to}: ${result.rain.mm} mm against ${result.rain.normal_mm} mm usual for the area (CHIRPS, about 5 km detail, average since 2001)${"departure" in rain ? `, ${rain.departure}%` : ""}.`;
  return [
    "SATELLITE DRYNESS CHECK:",
    `- Crop moisture (Sentinel-2 NDMI), field average, ${result.from} to ${result.to}: ${result.current.ndmi.toFixed(2)}`,
    ...result.past.map((p) => `  Same dates in ${p.year}: ${p.ndmi.toFixed(2)}`),
    ...(moisture.kind === "unusable" ? ["- Crop moisture not compared: no standing crop old enough on this field."] : []),
    ...("drierShare" in moisture ? [`- Share of field drier than its own usual: ${Math.round(moisture.drierShare * 100)}%`] : []),
    `- Rainfall: ${rainLine}`,
    "- Note: Compares the field with itself in past years, which may have grown other crops. Field boundary marked by the farmer. This is not a drought declaration or an official assessment.",
  ];
}
