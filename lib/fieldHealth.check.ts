// Assertion examples for lib/fieldHealth.ts. No test runner needed:
//   npm run check:field
import assert from "node:assert/strict";
import { assessField, fieldReadiness, zoneColor } from "./fieldHealth.ts";
import { readFieldHistory, recordLines } from "./fieldHistory.ts";
import type { AnalysisResult, PolygonGeometry, SampleFeature } from "./satellite.ts";

// a square field about 220 m across, with sample points every 10 m (roughly 0.00009 degrees)
const STEP = 0.00009;
const SIDE = 24;
const LNG = 74.43;
const LAT = 17.99;
const end = STEP * (SIDE + 1);
const boundary: PolygonGeometry = {
  type: "Polygon",
  coordinates: [
    [
      [LNG - STEP, LAT - STEP],
      [LNG + end, LAT - STEP],
      [LNG + end, LAT + end],
      [LNG - STEP, LAT + end],
      [LNG - STEP, LAT - STEP],
    ],
  ],
};

function field(ndviAt: (col: number, row: number) => number | null, areaHectares = 7): Pick<AnalysisResult, "features" | "farm_boundary" | "farm_summary"> {
  const features: SampleFeature[] = [];
  for (let col = 0; col < SIDE; col++)
    for (let row = 0; row < SIDE; row++) {
      const ndvi = ndviAt(col, row);
      if (ndvi !== null) features.push({ type: "Feature", geometry: { type: "Point", coordinates: [LNG + col * STEP, LAT + row * STEP] }, properties: { ndvi } });
    }
  return {
    features,
    farm_boundary: boundary,
    farm_summary: { field_name: "t", area_hectares: areaHectares, sample_count: features.length, sample_scale_m: 10, scene_count: 5, date_from: "", date_to: "", indices: {} as AnalysisResult["farm_summary"]["indices"] },
  };
}

const compared = (f: ReturnType<typeof field>) => {
  const a = assessField(f);
  assert.equal(a.kind, "compared");
  return a as Extract<typeof a, { kind: "compared" }>;
};

// a field that looks the same everywhere is even, however low or high its greenness is
assert.equal(compared(field(() => 0.6)).verdict, "even");
assert.equal(compared(field(() => 0.2)).verdict, "even");

// the weak part is named by its side: north half of the field
{
  const a = compared(field((_, row) => (row >= 16 ? 0.3 : 0.6)));
  assert.equal(a.verdict, "much");
  assert.equal(a.side, "north");
  assert.ok(a.weakShare > 0.25);
}
// a corner, smaller, is "some" and diagonal
{
  const a = compared(field((col, row) => (col >= 16 && row < 10 ? 0.3 : 0.6)));
  assert.equal(a.verdict, "some");
  assert.equal(a.side, "south_east");
}
// weak patches spread evenly don't lean to a side
{
  const a = compared(field((col, row) => (col % 4 === 0 && row % 4 === 0 ? 0.3 : 0.6)));
  assert.equal(a.side, "scattered");
}

// a road along the edge doesn't count against the crop
assert.equal(compared(field((col) => (col === 0 ? 0.1 : 0.6))).verdict, "even");

// small differences are treated as noise
assert.equal(compared(field((_, row) => (row >= 12 ? 0.55 : 0.6))).verdict, "even");

// a field with most points hidden by cloud gets no verdict, and neither does one too small to compare
assert.equal(assessField(field((col) => (col < 8 ? 0.6 : null))).kind, "clouded");
assert.equal(assessField(field((col, row) => (col < 3 && row < 3 ? 0.6 : null), 0.09)).kind, "too_small");

// map colours follow the same cut-offs
assert.deepEqual(zoneColor(0.6, 0.6), [5, 150, 105]);
assert.deepEqual(zoneColor(0.53, 0.6), [245, 158, 11]);
assert.deepEqual(zoneColor(0.4, 0.6), [225, 29, 72]);

// which crops can be checked, and how far back
const TODAY = "2026-11-02";
const crop = (status: "planned" | "growing" | "harvested" | "abandoned", sowingDate: string | null, transplantDate: string | null = null) => ({ status, sowingDate, transplantDate });
assert.equal(fieldReadiness(crop("planned", null), TODAY).kind, "not_sown");
assert.equal(fieldReadiness(crop("harvested", "2026-01-01"), TODAY).kind, "finished");
assert.equal(fieldReadiness(crop("abandoned", "2026-01-01"), TODAY).kind, "finished");
assert.deepEqual(fieldReadiness(crop("growing", "2026-10-23"), TODAY), { kind: "young", daysLeft: 11 });
assert.deepEqual(fieldReadiness(crop("growing", "2026-10-10"), TODAY), { kind: "ready", lookbacks: [23] });
assert.deepEqual(fieldReadiness(crop("growing", "2026-09-18"), TODAY), { kind: "ready", lookbacks: [30, 45] });
assert.deepEqual(fieldReadiness(crop("growing", "2026-08-04"), TODAY), { kind: "ready", lookbacks: [30, 60, 90] });
assert.deepEqual(fieldReadiness(crop("growing", "2026-01-01"), TODAY), { kind: "ready", lookbacks: [30, 60, 90] });
// a transplanted crop counts from the day it reached this field
assert.deepEqual(fieldReadiness(crop("growing", "2026-08-01", "2026-10-25"), TODAY), { kind: "young", daysLeft: 13 });

// reading a season's record
const season = (values: (number | null)[]) => ({ fetchedOn: TODAY, periods: values.map((ndvi, i) => ({ from: `2026-0${i + 1}-01`, to: `2026-0${i + 2}-01`, ndvi })) });
assert.equal(readFieldHistory(season([0.2, null, null]), null).kind, "too_few");
assert.equal(readFieldHistory(season([0.2, 0.4, 0.6, 0.55]), null).kind, "steady");
{
  const r = readFieldHistory(season([0.3, 0.6, 0.35, 0.5]), null);
  assert.equal(r.kind, "fall");
  if (r.kind === "fall") {
    assert.equal(r.before.from, "2026-02-01");
    assert.equal(r.after.to, "2026-04-01");
    assert.equal(r.nearHarvest, false);
  }
}
// a fall hidden behind cloudy periods is still found, and the biggest fall wins
{
  const r = readFieldHistory(season([0.7, null, 0.45, 0.6, 0.42]), null);
  assert.ok(r.kind === "fall" && r.before.from === "2026-01-01" && r.after.from === "2026-03-01");
}
// a fall in the harvest stage is flagged as possibly normal
{
  const r = readFieldHistory(season([0.5, 0.7, 0.4]), "2026-03-01");
  assert.ok(r.kind === "fall" && r.nearHarvest);
}
// the plain-text record names the source, marks cloud, and never claims to be an assessment
{
  const h = season([0.5, null, 0.3, 0.3]);
  const lines = recordLines({ boundary } as never, h, readFieldHistory(h, null)).join(" | ");
  assert.match(lines, /Sentinel-2/);
  assert.match(lines, /no clear view/);
  assert.match(lines, /not an official damage assessment/);
  assert.match(lines, /17\.99/);
}

console.log("fieldHealth checks passed");
