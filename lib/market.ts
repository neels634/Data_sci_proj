/**
 * Mandi Mitra decision engine: where, when and how should a farmer sell for the most money in hand?
 *
 *   Net per quintal = market price (adjusted for grade) − transport − loading and market charges
 *                     − produce lost on the way
 *
 * All prices, arrivals, distances and rates here are SAMPLE figures for the prototype, not real
 * market data, and the app labels them as sample. Replace MARKETS / CROPS with a real source
 * (for example AGMARKNET) to go live; the calculations don't need to change.
 */
import { MITRA_FEE_PER_QUINTAL } from "./data";
import { bi, type Bi } from "./i18n";
import type { Option } from "./account";

export type CropId = "Soybean" | "Tomato" | "Onion";
export type Grade = "A" | "B" | "C" | "Ungraded";
export type TownId = "phaltan" | "lonand" | "satara" | "baramati" | "pune";
type Arrivals = "low" | "normal" | "high";

export const CROP_OPTIONS: Option[] = [
  { value: "Soybean", label: bi("Soybean", "सोयाबीन") },
  { value: "Tomato", label: bi("Tomato", "टोमॅटो") },
  { value: "Onion", label: bi("Onion", "कांदा") },
];

export const GRADE_OPTIONS: Option[] = [
  { value: "A", label: bi("A — best", "अ — उत्तम") },
  { value: "B", label: bi("B — medium", "ब — मध्यम") },
  { value: "C", label: bi("C — lower", "क — कमी") },
  { value: "Ungraded", label: bi("Not sure", "माहीत नाही") },
];

export const TOWN_OPTIONS: { value: TownId; label: Bi }[] = [
  { value: "phaltan", label: bi("Phaltan", "फलटण") },
  { value: "lonand", label: bi("Lonand", "लोणंद") },
  { value: "satara", label: bi("Satara", "सातारा") },
  { value: "baramati", label: bi("Baramati", "बारामती") },
  { value: "pune", label: bi("Pune", "पुणे") },
];

export const townName = (id: TownId) => TOWN_OPTIONS.find((t) => t.value === id)!.label;

/** Approximate road distance in km (sample). */
const KM: Record<string, number> = {
  "baramati-lonand": 55,
  "baramati-phaltan": 30,
  "baramati-pune": 100,
  "baramati-satara": 85,
  "lonand-phaltan": 30,
  "lonand-pune": 75,
  "lonand-satara": 50,
  "phaltan-pune": 110,
  "phaltan-satara": 60,
  "pune-satara": 110,
};

export function distanceKm(a: TownId, b: TownId) {
  if (a === b) return 5; // local trip to the market yard
  return KM[[a, b].sort().join("-")];
}

/** Sample market price (₹ per quintal, grade A) and today's arrivals, by crop and market. */
const MARKETS: Record<CropId, Partial<Record<TownId, { price: number; arrivals: Arrivals }>>> = {
  Soybean: {
    phaltan: { price: 4480, arrivals: "normal" },
    satara: { price: 4550, arrivals: "normal" },
    baramati: { price: 4520, arrivals: "low" },
    pune: { price: 4700, arrivals: "normal" },
  },
  Tomato: {
    phaltan: { price: 1150, arrivals: "normal" },
    lonand: { price: 1200, arrivals: "normal" },
    satara: { price: 1250, arrivals: "high" },
    pune: { price: 1500, arrivals: "normal" },
  },
  Onion: {
    phaltan: { price: 1750, arrivals: "normal" },
    lonand: { price: 1820, arrivals: "high" },
    satara: { price: 1780, arrivals: "normal" },
    baramati: { price: 1800, arrivals: "normal" },
    pune: { price: 2050, arrivals: "normal" },
  },
};

type CropRules = {
  handling: number; // loading + unloading, ₹ per quintal
  baseLossPct: number; // produce lost in any trip
  lossPerKmPct: number; // extra loss per km travelled
  shelfDays: number;
  /** expected price change if stored, as a range rather than one exact number; null = don't store */
  store: { days: number; change: [number, number]; costPerDay: number; lossPerDayPct: number } | null;
};

const CROPS: Record<CropId, CropRules> = {
  Soybean: { handling: 25, baseLossPct: 0, lossPerKmPct: 0, shelfDays: 180, store: { days: 7, change: [0, 150], costPerDay: 1.5, lossPerDayPct: 0 } },
  Onion: { handling: 25, baseLossPct: 0.5, lossPerKmPct: 0.005, shelfDays: 30, store: { days: 7, change: [-120, 200], costPerDay: 2, lossPerDayPct: 0.3 } },
  Tomato: { handling: 30, baseLossPct: 1.5, lossPerKmPct: 0.03, shelfDays: 3, store: null },
};

const GRADE_FACTOR: Record<Grade, number> = { A: 1, B: 0.92, C: 0.82, Ungraded: 0.9 };
const MARKET_CHARGE_PCT = 1;

const VEHICLES = [
  { capacity: 15, perKm: 16 }, // pickup
  { capacity: 40, perKm: 24 }, // tempo
  { capacity: 100, perKm: 36 }, // truck
];
const TRIP_FIXED = 300;

/** Hire cost of carrying a load: the smallest vehicle that fits, or several trucks. */
function tripCost(quantity: number, km: number) {
  const v = VEHICLES.find((x) => quantity <= x.capacity);
  if (v) return TRIP_FIXED + v.perKm * km;
  const truck = VEHICLES[VEHICLES.length - 1];
  return Math.ceil(quantity / truck.capacity) * (TRIP_FIXED + truck.perKm * km);
}

export type Input = { crop: CropId; quantity: number; grade: Grade; from: TownId };

export type Quote = {
  market: TownId;
  km: number;
  arrivals: Arrivals;
  price: number;
  transport: number;
  charges: number;
  loss: number;
  net: number; // per quintal
  total: number; // for the whole lot
};

export function quoteAll(input: Input): Quote[] {
  const rules = CROPS[input.crop];
  const markets = Object.entries(MARKETS[input.crop]) as [TownId, { price: number; arrivals: Arrivals }][];
  return markets
    .map(([market, m]) => {
      const km = distanceKm(input.from, market);
      const price = Math.round(m.price * GRADE_FACTOR[input.grade]);
      const transport = Math.round(tripCost(input.quantity, km) / input.quantity);
      const charges = Math.round(rules.handling + (price * MARKET_CHARGE_PCT) / 100);
      const loss = Math.round((price * (rules.baseLossPct + rules.lossPerKmPct * km)) / 100);
      const net = price - transport - charges - loss;
      return { market, km, arrivals: m.arrivals, price, transport, charges, loss, net, total: net * input.quantity };
    })
    .sort((a, b) => b.net - a.net);
}

export type Confidence = "high" | "medium" | "low";

/** How sure the recommendation is: a clear lead scores higher; crowded markets and unknown quality lower it. */
export function confidenceOf(quotes: Quote[], grade: Grade): Confidence {
  const [best, second] = quotes;
  const lead = second ? (best.net - second.net) / Math.max(best.net, 1) : 1;
  let level = lead >= 0.03 ? 2 : lead >= 0.01 ? 1 : 0;
  if (best.arrivals === "high") level -= 1;
  if (grade === "Ungraded") level -= 1;
  return level >= 2 ? "high" : level === 1 ? "medium" : "low";
}

export type Timing = {
  /** the suggestion: sell at the best market today, or store and sell later */
  advice: "sell" | "store";
  shelfDays: number;
  /** extra ₹ per quintal from storing, after storage cost and loss; null when storing isn't sensible */
  store: { days: number; low: number; high: number } | null;
  /** ₹ per quintal saved by pooling through a Gaon Mandi Mitra, after the Mitra's fee */
  poolSaving: number;
};

export function timingFor(input: Input, best: Quote): Timing {
  const rules = CROPS[input.crop];
  const s = rules.store;
  let store: Timing["store"] = null;
  if (s) {
    const cost = s.costPerDay * s.days + (best.price * s.lossPerDayPct * s.days) / 100;
    store = { days: s.days, low: Math.round(s.change[0] - cost), high: Math.round(s.change[1] - cost) };
  }
  // store only if even the low case doesn't lose money and the likely gain is worth the wait
  const worthIt = !!store && store.low > 0 && (store.low + store.high) / 2 >= best.price * 0.02;

  const pooledLoad = Math.max(input.quantity, 40);
  const pooledTransport = tripCost(pooledLoad, best.km) / pooledLoad;
  const poolSaving = Math.round(best.transport - pooledTransport - MITRA_FEE_PER_QUINTAL);

  return { advice: worthIt ? "store" : "sell", shelfDays: rules.shelfDays, store, poolSaving };
}

const NUMBER_WORDS: Record<string, number> = {
  पाच: 5, दहा: 10, पंधरा: 15, वीस: 20, पंचवीस: 25, तीस: 30, चाळीस: 40, पन्नास: 50, शंभर: 100,
  five: 5, ten: 10, fifteen: 15, twenty: 20, thirty: 30, forty: 40, fifty: 50, hundred: 100,
};

/** Understand a spoken sentence such as "माझ्याकडे 40 क्विंटल सोयाबीन आहे". */
export function parseSpoken(text: string): { crop?: CropId; quantity?: number } {
  const t = text.toLowerCase().replace(/[०-९]/g, (d) => String("०१२३४५६७८९".indexOf(d)));
  const crop: CropId | undefined = /soy|सोया/.test(t) ? "Soybean" : /tomato|टोम|टमाट/.test(t) ? "Tomato" : /onion|कांद/.test(t) ? "Onion" : undefined;
  const digits = t.match(/\d+(\.\d+)?/);
  const word = t.split(/[\s,.]+/).find((w) => w in NUMBER_WORDS);
  return { crop, quantity: digits ? Number(digits[0]) : word ? NUMBER_WORDS[word] : undefined };
}
