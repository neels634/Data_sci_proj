/**
 * Best-market engine (pure functions): what each mandi pays for the farmer's grades, minus the
 * vehicle and market charges, for one market or for grades sent to different markets.
 * Every number is an estimate; the screens say so.
 *
 *   transport = trips × distance × 2 (round trip) × ₹ per km
 *   fees      = load (qtl) × market fees per qtl
 *   net       = Σ grade rate × qty − transport − fees
 *
 *   npm run check:profit
 */
import type { Bi } from "../i18n";
import { MARKETS, type Market } from "./markets.ts";
import { gradeRate, type GradeRate, type MarketPrice, type MitraRate } from "./prices.ts";

/** road km ≈ straight-line km × this */
export const ROAD_FACTOR = 1.3;
/** a trip inside the same town still costs something */
export const LOCAL_KM = 5;
/** markets further than this (road km) are not suggested */
export const MAX_KM = 300;
/** a split plan is shown only when it earns at least this much more than the best single market… */
export const SPLIT_MIN_GAIN_RS = 500;
/** …and at least this share more */
export const SPLIT_MIN_GAIN_PCT = 0.03;
/** transport above this share of the gross: suggest a nearby market or pooling with the Mitra */
export const SMALL_LOAD_SHARE = 0.3;
const MAX_COMBINATIONS = 50_000;

export interface Vehicle {
  id: "pickup" | "tempo" | "truck" | "own";
  name: Bi;
  capacityQtl: number;
  /** ₹ per km; a trip costs this × distance × 2 */
  perKm: number;
}

// TODO: confirm local rates — editable on the result screen
export const VEHICLES: Vehicle[] = [
  { id: "pickup", name: { en: "Pickup (1 t)", mr: "पिकअप (१ टन)" }, capacityQtl: 10, perKm: 18 },
  { id: "tempo", name: { en: "Tempo (2.5 t)", mr: "टेम्पो (२.५ टन)" }, capacityQtl: 25, perKm: 28 },
  { id: "truck", name: { en: "Truck (9 t)", mr: "ट्रक (९ टन)" }, capacityQtl: 90, perKm: 45 },
];
/** the farmer's own vehicle: only diesel per km */
export const OWN_VEHICLE: Vehicle = { id: "own", name: { en: "My own vehicle", mr: "माझी स्वतःची गाडी" }, capacityQtl: 10, perKm: 8 };
export const vehicleById = (id: string) => [...VEHICLES, OWN_VEHICLE].find((v) => v.id === id);

/** "auto" picks the smallest vehicle that fits; a chosen vehicle can have its own ₹/km */
export interface VehicleChoice {
  vehicleId: "auto" | Vehicle["id"];
  perKm?: number;
}

export interface Place {
  lat: number;
  lng: number;
}

export function haversineKm(a: Place, b: Place) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
/** approximate road distance in km */
export const roadKm = (from: Place, to: Place) => Math.max(LOCAL_KM, Math.round(haversineKm(from, to) * ROAD_FACTOR));

/** vehicle and trips for a load */
export function pickVehicle(loadQtl: number, choice: VehicleChoice): { vehicle: Vehicle; trips: number; perKm: number } {
  const trips = (v: Vehicle) => Math.max(1, Math.ceil(loadQtl / v.capacityQtl));
  if (choice.vehicleId !== "auto") {
    const v = vehicleById(choice.vehicleId)!;
    return { vehicle: v, trips: trips(v), perKm: choice.perKm ?? v.perKm };
  }
  const fits = VEHICLES.find((v) => v.capacityQtl >= loadQtl);
  // too big for any one vehicle: the cheapest number of trips × ₹/km
  const v = fits ?? [...VEHICLES].sort((a, b) => trips(a) * a.perKm - trips(b) * b.perKm)[0];
  return { vehicle: v, trips: trips(v), perKm: choice.perKm ?? v.perKm };
}

export interface PlanItem {
  gradeCode: string;
  qtyQtl: number;
}

export interface LegItem extends PlanItem, GradeRate {
  amount: number;
}

/** one market and everything sent there (sharing one vehicle) */
export interface Leg {
  market: Market;
  distanceKm: number;
  items: LegItem[];
  loadQtl: number;
  vehicle: Vehicle;
  trips: number;
  perKm: number;
  gross: number;
  transport: number;
  fees: number;
  net: number;
}

export interface Plan {
  kind: "single" | "split";
  legs: Leg[];
  gross: number;
  transport: number;
  fees: number;
  net: number;
  netPerQtl: number;
  totalQtl: number;
  /** any rate from sample data */
  anySample: boolean;
  dates: string[];
}

export interface PlanInput {
  cropId: string;
  typeCode?: string;
  items: PlanItem[];
  from: Place;
  rows: MarketPrice[];
  mitraRates: MitraRate[];
  today: string;
  vehicle: VehicleChoice;
  /** defaults to every market in lib/mandi/markets.ts */
  markets?: Market[];
}

/** one leg: these items to this market; null when a grade has no price there */
export function legFor(input: PlanInput, market: Market, items: PlanItem[]): Leg | null {
  const priced: LegItem[] = [];
  for (const it of items) {
    const r = gradeRate({ cropId: input.cropId, typeCode: input.typeCode, gradeCode: it.gradeCode, marketId: market.id, rows: input.rows, mitraRates: input.mitraRates, today: input.today });
    if (!r) return null;
    priced.push({ ...it, ...r, amount: r.perQtl * it.qtyQtl });
  }
  const loadQtl = items.reduce((a, x) => a + x.qtyQtl, 0);
  const distanceKm = roadKm(input.from, market);
  const { vehicle, trips, perKm } = pickVehicle(loadQtl, input.vehicle);
  const gross = priced.reduce((a, x) => a + x.amount, 0);
  const transport = Math.round(trips * distanceKm * 2 * perKm);
  const fees = Math.round(loadQtl * market.feesPerQtl);
  return { market, distanceKm, items: priced, loadQtl, vehicle, trips, perKm, gross, transport, fees, net: Math.round(gross - transport - fees) };
}

function planOf(kind: Plan["kind"], legs: Leg[]): Plan {
  const sum = (k: "gross" | "transport" | "fees" | "net") => legs.reduce((a, l) => a + l[k], 0);
  const totalQtl = legs.reduce((a, l) => a + l.loadQtl, 0);
  const items = legs.flatMap((l) => l.items);
  return {
    kind,
    legs,
    gross: Math.round(sum("gross")),
    transport: sum("transport"),
    fees: sum("fees"),
    net: sum("net"),
    netPerQtl: totalQtl ? Math.round(sum("net") / totalQtl) : 0,
    totalQtl,
    anySample: items.some((x) => x.source === "sample"),
    dates: Array.from(new Set(items.map((x) => x.date))).sort(),
  };
}

/** markets to consider: priced for this crop, within MAX_KM, the 10 nearest + the 5 best-paying */
export function candidateMarkets(input: Pick<PlanInput, "cropId" | "from" | "rows" | "markets">): Market[] {
  const priced = new Set(input.rows.filter((r) => r.cropId === input.cropId).map((r) => r.marketId));
  const near = (input.markets ?? MARKETS).filter((m) => priced.has(m.id)).map((m) => ({ m, km: roadKm(input.from, m) })).filter((x) => x.km <= MAX_KM);
  const nearest = [...near].sort((a, b) => a.km - b.km).slice(0, 10);
  const modal = (id: string) => Math.max(...input.rows.filter((r) => r.marketId === id).map((r) => r.modalPerQtl));
  const best = [...near].sort((a, b) => modal(b.m.id) - modal(a.m.id)).slice(0, 5);
  return Array.from(new Map([...nearest, ...best].map((x) => [x.m.id, x.m])).values());
}

/** everything to one market, best first; ties go to the nearer market */
export function singlePlans(input: PlanInput, markets = candidateMarkets(input)): Plan[] {
  return markets
    .map((m) => legFor(input, m, input.items))
    .filter((l): l is Leg => !!l)
    .map((l) => planOf("single", [l]))
    .sort((a, b) => b.net - a.net || a.legs[0].distanceKm - b.legs[0].distanceKm);
}

/** grades to markets: each market's grades share one vehicle */
function evaluate(input: PlanInput, markets: Market[], assign: number[]): Plan | null {
  const legs: Leg[] = [];
  for (const mi of Array.from(new Set(assign))) {
    const leg = legFor(input, markets[mi], input.items.filter((_, i) => assign[i] === mi));
    if (!leg) return null;
    legs.push(leg);
  }
  return planOf(legs.length > 1 ? "split" : "single", legs.sort((a, b) => a.distanceKm - b.distanceKm));
}

/** the best way to send each grade to its own market (brute force when small, else greedy + swaps) */
export function bestSplit(input: PlanInput, markets = candidateMarkets(input)): Plan | null {
  const n = input.items.length;
  const k = markets.length;
  if (n < 2 || k < 2) return null;
  let best: Plan | null = null;
  const consider = (assign: number[]) => {
    const p = evaluate(input, markets, assign);
    if (p && (!best || p.net > best.net)) best = p;
    return p;
  };
  if (k ** n <= MAX_COMBINATIONS) {
    const assign = new Array(n).fill(0);
    for (let c = 0; c < k ** n; c++) {
      let x = c;
      for (let i = 0; i < n; i++) {
        assign[i] = x % k;
        x = Math.floor(x / k);
      }
      consider(assign);
    }
  } else {
    // greedy: each grade to its own best market, then move single grades while it helps
    const assign = input.items.map((it) => {
      const one = { ...input, items: [it] };
      let bi = 0;
      let bn = -Infinity;
      markets.forEach((m, mi) => {
        const l = legFor(one, m, [it]);
        if (l && l.net > bn) [bi, bn] = [mi, l.net];
      });
      return bi;
    });
    let current = consider(assign)?.net ?? -Infinity;
    for (let improved = true; improved; ) {
      improved = false;
      for (let i = 0; i < n; i++)
        for (let mi = 0; mi < k; mi++) {
          if (assign[i] === mi) continue;
          const old = assign[i];
          assign[i] = mi;
          const p = consider(assign);
          if (p && p.net > current) {
            current = p.net;
            improved = true;
          } else assign[i] = old;
        }
    }
  }
  const b = best as Plan | null;
  return b && b.kind === "split" ? b : null;
}

/** does a split plan earn enough more than the best single market to be worth the extra trips? */
export const splitWins = (split: Plan | null, single: Plan | undefined) =>
  !!split && !!single && split.net - single.net >= SPLIT_MIN_GAIN_RS && split.net - single.net >= Math.abs(single.net) * SPLIT_MIN_GAIN_PCT;

export interface Recommendation {
  /** top 3 single-market plans */
  top: Plan[];
  /** shown only when it beats top[0] by SPLIT_MIN_GAIN_RS and SPLIT_MIN_GAIN_PCT */
  split: Plan | null;
  /** transport eats more than SMALL_LOAD_SHARE of the gross: suggest a nearby market or the Mitra */
  smallLoad: boolean;
}

export function recommend(input: PlanInput): Recommendation {
  const markets = candidateMarkets(input);
  const singles = singlePlans(input, markets);
  const top = singles.slice(0, 3);
  const split = bestSplit(input, markets);
  const best = top[0];
  return {
    top,
    split: splitWins(split, best) ? split : null,
    smallLoad: !!best && best.gross > 0 && best.transport / best.gross > SMALL_LOAD_SHARE,
  };
}
