// Assertion examples for lib/enterprise.ts. No test runner needed:
//   npm run check:enterprise
import assert from "node:assert/strict";
import { calcScenario, discover, EMPTY_VILLAGE, ENTERPRISES, EXAMPLE_VILLAGE, scenarioSet, type ScenarioInputs, type VillageProfile } from "./enterprise.ts";

const inputs: ScenarioInputs = { production: 100, price: 100, rawCost: 40, wastagePct: 0, labour: 1000, electricity: 500, transport: 300, other: 200, setupCost: 24000, creditDays: 30, idleMonths: 0 };

// the formulas from the project document
{
  const r = calcScenario(inputs);
  assert.equal(r.revenue, 10000);
  assert.equal(r.grossProfit, 6000);
  assert.equal(r.fixedCosts, 2000);
  assert.equal(r.surplus, 4000);
  assert.equal(r.contribution, 60);
  assert.equal(r.breakEven, 34); // 2000 / 60, rounded up: 33 units would fall short
  assert.equal(r.workingCapital, 10000 + 2000 + 2000);
  assert.equal(r.yearlySurplus, 48000);
  assert.equal(r.paybackMonths, 6);
}
// wastage lowers what can be sold but not what must be paid for
{
  const r = calcScenario({ ...inputs, wastagePct: 10 });
  assert.equal(r.sold, 90);
  assert.equal(r.revenue, 9000);
  assert.equal(r.directCost, 4000);
}
// idle months earn nothing, and "other" costs carry on through them
assert.equal(calcScenario({ ...inputs, idleMonths: 6 }).yearlySurplus, 4000 * 6 - 200 * 6);
// a unit that loses money has no break-even, and a losing year has no payback
{
  const r = calcScenario({ ...inputs, price: 30 });
  assert.equal(r.breakEven, null);
  assert.equal(r.paybackMonths, null);
  assert.ok(r.surplus < 0);
}
// silly input can't break the sums
assert.ok(Number.isFinite(calcScenario({ ...inputs, wastagePct: 100 }).contribution));
assert.ok(Number.isFinite(calcScenario({ ...inputs, production: 0 }).revenue));

// the three scenarios are ordered, and the base is exactly the farmer's own numbers
{
  const s = scenarioSet(inputs);
  assert.ok(s.conservative.surplus < s.base.surplus && s.base.surplus < s.optimistic.surplus);
  assert.deepEqual(s.base, calcScenario(inputs));
}

// every guessed business loses or earns modestly: none promises a fortune, and none is broken
for (const e of ENTERPRISES) {
  const r = calcScenario(e.guess);
  assert.ok(e.guess.setupCost >= e.investment[0] && e.guess.setupCost <= e.investment[1], `${e.id} setup is inside its range`);
  assert.ok(r.surplus < r.revenue, `${e.id} surplus is below revenue`);
  assert.ok(r.breakEven !== null, `${e.id} has a break-even`);
  assert.ok(e.validation.length >= 3 && e.risks.length >= 3 && e.licences.length >= 3, `${e.id} has checks, risks and licences`);
}

// the document's example village gets its three example ideas, all unproven
{
  const { top } = discover(EXAMPLE_VILLAGE);
  assert.equal(top.length, 3);
  for (const r of top) {
    assert.equal(r.confidence, "low");
    assert.ok(r.missing.length > 0);
    assert.ok(r.reasons.length > 0);
  }
  assert.ok(top.some((r) => r.enterprise.id === "dairy"));
}

const village = (over: Partial<VillageProfile>): VillageProfile => ({ ...EXAMPLE_VILLAGE, source: "entered", ...over });

// an idea with no raw material, an impossible need, or too little money is held back and says why
{
  const { top, others } = discover(village({ dairyHouseholds: 0 }));
  assert.ok(!top.some((r) => r.enterprise.id === "dairy"));
  assert.match(others.find((r) => r.enterprise.id === "dairy")!.blockers[0].en, /raw material/);
}
{
  const { others } = discover(village({ power: "no" }));
  assert.match(others.find((r) => r.enterprise.id === "dairy")!.blockers[0].en, /electricity/);
}
{
  const { top, others } = discover(village({ capital: 50000 }));
  assert.deepEqual(top.map((r) => r.enterprise.id), ["tailoring"]);
  assert.match(others.find((r) => r.enterprise.id === "machinery")!.blockers[0].en, /at least/);
}

// talking to buyers raises both the score and the confidence; nothing ever claims high confidence
{
  const before = discover(village({})).top[0];
  const after = discover(village({ buyersSpokenTo: 5, marketKm: 10, power: "yes", water: "yes", space: "yes" })).top[0];
  assert.ok(after.score > before.score);
  assert.equal(after.confidence, "medium");
}
// an example village never earns more than low confidence, however complete it looks
assert.equal(discover({ ...EXAMPLE_VILLAGE, buyersSpokenTo: 5, marketKm: 10, power: "yes", water: "yes", space: "yes" }).top[0].confidence, "low");

// an empty profile recommends nothing confidently and doesn't crash
assert.ok(discover(EMPTY_VILLAGE).top.every((r) => r.fit !== "worth_checking"));

console.log("enterprise checks passed");
