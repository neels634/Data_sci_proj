// Assertion examples for lib/enterprise.ts. No test runner needed:
//   npm run check:enterprise
import assert from "node:assert/strict";
import { calcScenario, discover, EMPTY_ASSETS, ENTERPRISES, EXAMPLE_ASSETS, withSlowSales, type FarmerAssets, type ScenarioInputs } from "./enterprise.ts";

const inputs: ScenarioInputs = { production: 100, price: 100, rawCost: 40, wastagePct: 0, other: 2000, setupCost: 24000, idleMonths: 0 };

// the sums
{
  const r = calcScenario(inputs);
  assert.equal(r.revenue, 10000);
  assert.equal(r.left, 4000);
  assert.equal(r.breakEven, 34); // 2000 / 60, rounded up: 33 would fall short
  assert.equal(r.paybackMonths, 6);
}
// what spoils can't be sold but was still paid for
{
  const r = calcScenario({ ...inputs, wastagePct: 10 });
  assert.equal(r.revenue, 9000);
  assert.equal(r.left, 9000 - 4000 - 2000);
}
// idle months make the money take longer to come back
assert.equal(calcScenario({ ...inputs, idleMonths: 6 }).paybackMonths, 12);
// a piece that loses money has no break-even, and a losing month has no payback
{
  const r = calcScenario({ ...inputs, price: 30 });
  assert.equal(r.breakEven, null);
  assert.equal(r.paybackMonths, null);
  assert.ok(r.left < 0);
}
// silly input can't break the sums
assert.ok(Number.isFinite(calcScenario({ ...inputs, wastagePct: 100 }).left));
assert.ok(Number.isFinite(calcScenario({ ...inputs, production: 0 }).left));
// slow sales leave less, and the planned figure is the family's own numbers
{
  const { planned, slow } = withSlowSales(inputs);
  assert.deepEqual(planned, calcScenario(inputs));
  assert.equal(slow.left, 5000 - 2000 - 2000);
}

// THE POINT: every idea is small enough for a farming family to start
for (const e of ENTERPRISES) {
  assert.ok(e.investment[1] <= 25000, `${e.id} starts for ₹25,000 or less`);
  assert.ok(e.investment[0] <= 5000, `${e.id} can begin at ₹5,000 or less`);
  assert.ok(e.guess.setupCost >= e.investment[0] && e.guess.setupCost <= e.investment[1], `${e.id} guess is inside its range`);
  const r = calcScenario(e.guess);
  assert.ok(r.left > 0 && r.left < 15000, `${e.id} guess stays modest, promising no fortune: ${r.left}`);
  assert.ok(r.breakEven !== null, `${e.id} has a break-even`);
  assert.ok(e.needed.length && e.buyers.length && e.steps.length >= 3 && e.careful.length && e.permissions.length, `${e.id} has its plan`);
}

const family = (over: Partial<FarmerAssets>): FarmerAssets => ({ ...EMPTY_ASSETS, ...over });

// the example family gets three ideas it could really start, with reasons
{
  const { top } = discover(EXAMPLE_ASSETS);
  assert.equal(top.length, 3);
  for (const r of top) assert.ok(r.reasons.length > 0);
  assert.ok(top.some((r) => r.enterprise.id === "home-dairy" || r.enterprise.id === "vermicompost"));
}
// no milk means no dairy idea, and it says why
{
  const { top, others } = discover(family({ crops: ["wheat"], capital: 15000 }));
  assert.ok(!top.some((r) => r.enterprise.id === "home-dairy"));
  assert.match(others.find((r) => r.enterprise.id === "home-dairy")!.blockers[0].en, /cow or buffalo/);
}
// ₹5,000 still leaves something to try; ideas beyond it say what they need
{
  const { top, others } = discover(family({ animals: ["cattle"], capital: 5000 }));
  assert.ok(top.length > 0);
  for (const r of others) if (r.enterprise.investment[0] > 5000) assert.match(r.blockers[0].en, /to start/);
}
// no space at home holds back only the ideas that need it
{
  const { top } = discover(family({ animals: ["cattle"], space: "no", capital: 15000 }));
  assert.ok(top.every((r) => !r.enterprise.needsSpace));
}
// what the family knows moves the ideas around
assert.equal(discover(family({ skills: ["tailoring"], capital: 15000, space: "yes" })).top[0].enterprise.id, "home-stitching");
// asking buyers raises an idea's score
{
  const before = discover(family({ animals: ["cattle"], capital: 15000 })).top[0].score;
  const after = discover(family({ animals: ["cattle"], capital: 15000, buyersSpokenTo: 5 })).top[0].score;
  assert.ok(after > before);
}
// an empty form still suggests things to try, and doesn't crash or call any "good"
{
  const { top } = discover(EMPTY_ASSETS);
  assert.ok(top.length > 0);
  assert.ok(top.every((r) => r.fit === "possible"));
}

console.log("enterprise checks passed");
