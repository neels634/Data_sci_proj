/**
 * Reads a field's season of satellite greenness for the farmer and for officials. It describes what
 * was seen and when, never why: a fall could be drought, pests, a cut crop or the natural end of the
 * season. The cut-off below is a product choice, not an agronomic or insurance standard.
 */
import { addDays, planOf } from "./lifecycle.ts";
import type { FieldHistory, HistoryPeriod } from "./satellite";
import type { CropInfo, FarmCrop } from "./types";

const CLEAR_FALL = 0.15;
const MIN_CLEAR_PERIODS = 3;

export type HistoryReading =
  | { kind: "too_few" }
  | { kind: "steady" }
  | {
      kind: "fall";
      /** the clear period before the fall, and the first one after it */
      before: HistoryPeriod;
      after: HistoryPeriod;
      nearHarvest: boolean;
    };

/** The date the crop's last stage begins, when greenness falling is expected. */
export function lastStageStart(fc: FarmCrop, crop: CropInfo): string | null {
  const { anchor, stages } = planOf(fc, crop);
  if (!anchor || !stages.length) return null;
  return addDays(anchor, stages[stages.length - 1].startDay);
}

/** Finds the biggest clear fall between one clear period and the next, skipping cloudy ones. */
export function readFieldHistory(history: FieldHistory, harvestStageFrom: string | null): HistoryReading {
  const clear = history.periods.filter((p): p is HistoryPeriod & { ndvi: number } => p.ndvi !== null);
  if (clear.length < MIN_CLEAR_PERIODS) return { kind: "too_few" };
  let worst: { before: HistoryPeriod; after: HistoryPeriod; drop: number } | null = null;
  for (let i = 1; i < clear.length; i++) {
    const drop = clear[i - 1].ndvi - clear[i].ndvi;
    if (drop >= CLEAR_FALL && (!worst || drop > worst.drop)) worst = { before: clear[i - 1], after: clear[i], drop };
  }
  if (!worst) return { kind: "steady" };
  return { kind: "fall", before: worst.before, after: worst.after, nearHarvest: !!harvestStageFrom && worst.after.to > harvestStageFrom };
}

/** The middle of the field, so an official can find it. */
function fieldCentre(fc: FarmCrop) {
  const ring = fc.boundary?.coordinates[0].slice(0, -1) ?? [];
  if (!ring.length) return null;
  const mean = (axis: number) => (ring.reduce((sum, p) => sum + p[axis], 0) / ring.length).toFixed(5);
  return `${mean(1)}, ${mean(0)}`;
}

/** Plain text for the case summary. English, like the rest of that document. */
export function recordLines(fc: FarmCrop, history: FieldHistory, reading: HistoryReading): string[] {
  const centre = fieldCentre(fc);
  const summary =
    reading.kind === "too_few"
      ? "Too few clear satellite views to read a pattern."
      : reading.kind === "steady"
        ? "No sudden fall in greenness was seen."
        : `Greenness fell clearly between ${reading.before.from} and ${reading.after.to}${reading.nearHarvest ? " (close to the harvest stage, when a fall can be normal)" : ""}.`;
  return [
    "SATELLITE FIELD RECORD:",
    "- Source: Copernicus Sentinel-2. Field average NDVI (greenness) for each 15-day period.",
    ...(centre ? [`- Field centre (lat, lng): ${centre}`] : []),
    ...history.periods.map((p) => `  ${p.from} to ${p.to}: ${p.ndvi === null ? "no clear view (cloud)" : p.ndvi.toFixed(2)}`),
    `- Reading: ${summary}`,
    `- Record prepared: ${history.fetchedOn}`,
    "- Note: The field boundary was marked by the farmer. This shows what the satellite saw, not the cause. It is not an official damage assessment.",
  ];
}
