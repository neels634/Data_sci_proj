// Checks for lib/costs/estimate.ts. No test runner needed:
//   npm run check:costs
import assert from "node:assert/strict";
import { fromAcres, perAreaFromPerAcre, toAcres } from "./categories.ts";
import { estimate, expectedByNow, profit, recoveryYears, remainingCost, spendStatus, splitByArea } from "./estimate.ts";
import { rateDefault } from "./local-rates.ts";
import { templateFor } from "./templates.ts";

// area units
assert.equal(Math.round(fromAcres(1, "hectare") * 1000) / 1000, 0.405);
assert.equal(Math.round(toAcres(1, "hectare") * 1000) / 1000, 2.471);
assert.equal(fromAcres(1, "guntha"), 40);
assert.equal(toAcres(20, "guntha"), 0.5);
assert.equal(Math.round(perAreaFromPerAcre(10000, "hectare")), 24710);

const onion = templateFor("onion", "vegetable");
const base = estimate({ template: onion, areaAcres: 1.5, rates: {} });
assert.equal(base.total, base.lines.filter((l) => l.cash).reduce((a, l) => a + l.total, 0));
assert.ok(Math.abs(base.total - base.perAcre * 1.5) <= base.lines.length, "total ≈ per acre × area");
assert.deepEqual(base.yieldRange, [120, 180]);

// a local rate changes the estimate
const weeding = (e: typeof base) => e.lines.find((l) => l.line.id === "weeding")!;
const dearer = estimate({ template: onion, areaAcres: 1.5, rates: { labour_day_female: 400 } });
assert.equal(weeding(base).rate, rateDefault("labour_day_female"));
assert.equal(weeding(dearer).total, Math.round(20 * 400 * 1.5));
assert.ok(dearer.total > base.total);

// line overrides and removal
const edited = estimate({ template: onion, areaAcres: 1, rates: {}, overrides: { fert: { amount: 5000 }, transport: { removed: true }, seed: { qtyPerAcre: 4 } } });
assert.equal(edited.lines.find((l) => l.line.id === "fert")!.total, 5000);
assert.equal(edited.lines.find((l) => l.line.id === "transport"), undefined);
assert.equal(edited.lines.find((l) => l.line.id === "seed")!.total, 4 * 2500);

// own work is valued apart from cash
const own = estimate({ template: onion, areaAcres: 1, rates: {}, customLines: [{ id: "c1", category: "labour", item: { en: "Family weeding", mr: "घरचे खुरपणी" }, driver: "fixed", amountPerAcre: 3000, cashPaid: false }] });
assert.equal(own.ownTotal, 3000);
assert.equal(own.total, estimate({ template: onion, areaAcres: 1, rates: {} }).total);

// break-even = recurring cash cost ÷ yield
assert.deepEqual(base.breakEven, [Math.round(base.total / 180), Math.round(base.total / 120)]);

// perennial: establishment once vs every cycle
const pom = estimate({ template: templateFor("pomegranate", "fruit"), areaAcres: 1, rates: {} });
assert.ok(pom.oneTimeTotal > 0 && pom.recurringTotal > 0);
assert.equal(pom.oneTimeTotal + pom.recurringTotal, pom.total);
assert.equal(pom.breakEven![0], Math.round(pom.recurringTotal / 6000));

// remaining cost: lines from the current stage on, minus what was spent on them
const order = ["nursery", "transplanting", "establishment", "vegetative", "bulb-initiation", "bulb-development", "maturity", "harvest", "curing"];
const all = remainingCost(base, order, null, {});
assert.equal(all, base.total, "before sowing everything is still to come");
const atVeg = remainingCost(base, order, "vegetative", {});
const laterLines = base.lines.filter((l) => ["vegetative", "bulb-initiation", "bulb-development", "maturity", "harvest", "curing"].includes(l.line.stageKey ?? "")).reduce((a, l) => a + l.total, 0);
assert.equal(atVeg, laterLines);
const spray = base.lines.find((l) => l.line.id === "spray")!.total;
assert.equal(remainingCost(base, order, "vegetative", { spray: 2000 }), atVeg - 2000);
assert.equal(remainingCost(base, order, "vegetative", { spray: spray + 9999 }), atVeg - spray, "overspending a line never makes the rest negative");
assert.equal(remainingCost(base, order, "harvest", {}, { done: true }), 0);
assert.equal(expectedByNow(base, order, "vegetative") + atVeg - base.lines.filter((l) => l.line.stageKey === "vegetative").reduce((a, l) => a + l.total, 0), base.total);

// spend status
assert.equal(spendStatus(50, 100, 60), "ok");
assert.equal(spendStatus(70, 100, 60), "ahead");
assert.equal(spendStatus(120, 100, 100), "over");

// profit and recovery
assert.deepEqual(profit(105000, 72000, 8000, 100), { income: 105000, cash: 72000, own: 8000, net: 33000, netWithOwn: 25000, costPerUnit: 720 });
assert.equal(profit(0, 1000, 0, 0).costPerUnit, null);
assert.equal(recoveryYears(150000, 60000), 2.5);
assert.equal(recoveryYears(150000, -5), null);

// general expenses split by area add up exactly
const split = splitByArea(1000, [
  { id: "a", areaAcres: 1 },
  { id: "b", areaAcres: 2 },
]);
assert.equal(split.a + split.b, 1000);
assert.equal(split.a, 333);

console.log("estimate: all checks passed");
