// Assertion examples for lib/dryness.ts. No test runner needed:
//   npm run check:dryness
import assert from "node:assert/strict";
import { changeColor, drynessLevel, drynessLines, readMoisture, readRain, type DrynessPoint, type DrynessResult } from "./dryness.ts";

// a square field with sample points every 10 m, and a border wide enough to have an inner part
const STEP = 0.00009;
const SIDE = 20;
const LNG = 74.43;
const LAT = 17.99;
const end = STEP * (SIDE + 1);
const boundary = {
  type: "Polygon" as const,
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

function field(changeAt: ((col: number, row: number) => number | undefined) | null, rain: DrynessResult["rain"] = null): DrynessResult {
  const features: DrynessPoint[] = [];
  for (let col = 0; col < SIDE; col++)
    for (let row = 0; row < SIDE; row++) {
      const change = changeAt?.(col, row);
      features.push({ type: "Feature", geometry: { type: "Point", coordinates: [LNG + col * STEP, LAT + row * STEP] }, properties: { ndmi: 0.1, ...(change === undefined ? {} : { change }) } });
    }
  return { from: "2026-10-04", to: "2026-11-03", current: { ndmi: 0.1, ndvi: 0.4 }, past: [2025, 2024, 2023].map((year) => ({ year, ndmi: 0.2, ndvi: 0.5 })), rain, features, sample_scale_m: 10, boundary };
}
const rain = (mm: number, normal_mm: number) => ({ from: "2026-07-03", to: "2026-09-30", mm, normal_mm });

// the rain bands: no comparison is made when usual rain is too small for a percentage to mean anything
assert.deepEqual(readRain(null), { kind: "unknown" });
assert.deepEqual(readRain(rain(2, 10)), { kind: "dry_season" });
assert.deepEqual(readRain(rain(300, 300)), { kind: "normal", departure: 0 });
assert.deepEqual(readRain(rain(242, 300)), { kind: "normal", departure: -19 });
assert.deepEqual(readRain(rain(240, 300)), { kind: "deficient", departure: -20 });
assert.deepEqual(readRain(rain(120, 300)), { kind: "large_deficient", departure: -60 });

// the field is judged spot by spot against its own past
assert.equal(readMoisture(field(() => 0), true).kind, "usual");
assert.equal(readMoisture(field(() => -0.08), true).kind, "drier");
assert.equal(readMoisture(field(() => -0.2), true).kind, "much_drier");
// a small dry patch does not change the whole field's answer, but it is still counted
{
  const m = readMoisture(field((col, row) => (col > 15 && row > 15 ? -0.2 : 0)), true);
  assert.equal(m.kind, "usual");
  assert.ok("drierShare" in m && m.drierShare > 0);
}
// half the field dry is named by its side
{
  const m = readMoisture(field((_, row) => (row >= 10 ? -0.2 : 0)), true);
  assert.equal(m.kind, "much_drier");
  assert.ok("side" in m && m.side === "north");
}
// a road along the edge doesn't count
assert.equal(readMoisture(field((col) => (col === 0 ? -0.5 : 0)), true).kind, "usual");
// without past years to compare, or without a grown crop, there is no reading
assert.equal(readMoisture(field(null), true).kind, "no_history");
assert.equal(readMoisture(field(() => -0.2), false).kind, "unusable");

// THE POINT: two neighbouring fields under the same rain get different answers
{
  const short = readRain(rain(100, 300));
  assert.equal(drynessLevel(readMoisture(field(() => 0), true), short), "usual");
  assert.equal(drynessLevel(readMoisture(field(() => -0.08), true), short), "much_drier");
  assert.equal(drynessLevel(readMoisture(field(() => -0.08), true), readRain(rain(300, 300))), "drier");
}
// rain alone speaks only about the area, in its own words, and never as a field verdict
assert.equal(drynessLevel({ kind: "unusable" }, readRain(rain(100, 300))), "area_short");
assert.equal(drynessLevel({ kind: "no_history" }, readRain(rain(300, 300))), "area_usual");
assert.equal(drynessLevel({ kind: "unusable" }, { kind: "dry_season" }), "unknown");
assert.equal(drynessLevel({ kind: "no_history" }, { kind: "unknown" }), "unknown");

// map colours follow the same cut-offs
assert.deepEqual(changeColor(0.1), [5, 150, 105]);
assert.deepEqual(changeColor(-0.08), [245, 158, 11]);
assert.deepEqual(changeColor(-0.2), [225, 29, 72]);

// the officer's text gives its sources and never claims to be a declaration
{
  const r = field(() => -0.2, rain(100, 300));
  const text = drynessLines(r, readMoisture(r, true), readRain(r.rain)).join(" | ");
  assert.match(text, /Sentinel-2/);
  assert.match(text, /CHIRPS/);
  assert.match(text, /-67%/);
  assert.match(text, /100%/);
  assert.match(text, /not a drought declaration/);
}

console.log("dryness checks passed");
