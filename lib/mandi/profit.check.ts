// Checks for lib/mandi/profit.ts. No test runner needed:
//   npm run check:profit            (add --print to see the demo plans)
import assert from "node:assert/strict";
import { marketById, type Market } from "./markets.ts";
import { pricedGrade, samplePrices, type MarketPrice, type MitraRate } from "./prices.ts";
import { legFor, pickVehicle, recommend, singlePlans, type PlanInput } from "./profit.ts";

const today = "2026-11-04";
const phaltan = { lat: 17.99, lng: 74.43 };
const onion = samplePrices("onion", today);
const base: PlanInput = {
  cropId: "onion",
  items: [
    { gradeCode: "onion.super_gole", qtyQtl: 1 },
    { gradeCode: "onion.golti", qtyQtl: 10 },
  ],
  from: phaltan,
  rows: onion,
  mitraRates: [],
  today,
  vehicle: { vehicleId: "auto" },
};

// demo case: one market vs a split that earns more
const rec = recommend(base);
if (process.argv.includes("--print")) {
  for (const p of [...rec.top, ...(rec.split ? [rec.split] : [])])
    console.log(p.kind, p.legs.map((l) => `${l.market.id}(${l.distanceKm}km ${l.items.map((i) => i.gradeCode.split(".")[1]).join("+")} ${l.vehicle.id}×${l.trips})`).join(" + "), "net", p.net, "transport", p.transport);
}
assert.equal(rec.top.length, 3, "top 3 single markets");
assert.ok(rec.top[0].net >= rec.top[1].net && rec.top[1].net >= rec.top[2].net, "ranked by net");
assert.ok(rec.split, "the demo split plan beats one market");
assert.ok(rec.split!.legs.length > 1, "a split uses more than one market");
assert.ok(rec.split!.net - rec.top[0].net >= 500, "split gains at least ₹500");
assert.equal(rec.top[0].anySample, true, "sample data is flagged");

// vehicle sharing: two grades to one market share one vehicle trip
const leg = legFor(base, marketById("phaltan")!, base.items)!;
assert.equal(leg.trips, 1);
assert.equal(leg.vehicle.id, "tempo", "11 qtl needs the tempo");
assert.equal(leg.transport, 1 * leg.distanceKm * 2 * 28);
assert.equal(leg.fees, 11 * 15);

// trips over capacity
assert.deepEqual([pickVehicle(30, { vehicleId: "pickup" }).trips, pickVehicle(30, { vehicleId: "pickup" }).vehicle.id], [3, "pickup"]);
const big = pickVehicle(100, { vehicleId: "auto" });
assert.deepEqual([big.vehicle.id, big.trips], ["truck", 2], "100 qtl: two truck trips are cheapest");
assert.equal(pickVehicle(5, { vehicleId: "auto", perKm: 25 }).perKm, 25, "the farmer's ₹/km is used");

// unsure grade is priced at the middle grade
assert.equal(pricedGrade("onion", "unsure"), "onion.no3");
const unsure = legFor({ ...base, items: [{ gradeCode: "unsure", qtyQtl: 1 }] }, marketById("phaltan")!, [{ gradeCode: "unsure", qtyQtl: 1 }])!;
assert.equal(unsure.items[0].pricedAs, "onion.no3");

// a Mitra rate for today wins over the estimate
const mitra: MitraRate[] = [{ id: "r1", marketId: "phaltan", cropId: "onion", gradeCode: "onion.golti", perQtl: 1777, date: today, by: "acc-mitra" }];
const withMitra = legFor({ ...base, mitraRates: mitra }, marketById("phaltan")!, base.items)!;
assert.equal(withMitra.items[1].source, "mitra");
assert.equal(withMitra.items[1].perQtl, 1777);
assert.equal(withMitra.items[0].source, "sample");

// no price for a grade at a market → that market is left out
assert.equal(legFor(base, marketById("dadar")!, base.items), null);

// ties: the nearer market comes first
const twin = (id: string, lat: number): Market => ({ ...marketById("phaltan")!, id, lat });
const row = (id: string): MarketPrice => ({ ...onion.find((r) => r.marketId === "phaltan")!, marketId: id });
const tie = singlePlans({ ...base, rows: [row("far"), row("near")] }, [twin("far", 18.3), twin("near", 18.0)]);
assert.deepEqual(tie.map((p) => p.legs[0].market.id), ["near", "far"]);

console.log("profit: all checks passed");
