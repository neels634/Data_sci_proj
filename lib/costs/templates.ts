/**
 * Cost-of-cultivation estimate templates, per acre.
 *
 * TODO: verify — every figure here is a DRAFT placeholder of a reasonable round size, written to be
 * checked against published cost-of-cultivation data (CACP price-policy reports for Maharashtra,
 * MPKV Rahuri / VNMKV Parbhani / Dr. PDKV Akola / Dr. BSKKV Dapoli estimates, NHB / ICAR economics
 * for horticulture) and reviewed by a Mitra or KVK. They are not taken from those sources yet, so
 * every template is reviewStatus "draft" and the app labels the numbers "estimate".
 * Plant protection is costed only as spray rounds × average cost per round: no product names or doses.
 *
 *   npm run check:costs
 */
import type { Bi } from "../i18n";
import type { CropCategory, Season } from "../types";
import type { Unit } from "../grades.ts";
import type { CostCategory } from "./categories.ts";
import type { LocalRateKey } from "./local-rates.ts";

export interface CostLine {
  id: string;
  category: CostCategory;
  item: Bi;
  /** fixed ₹ per acre, or quantity × rate */
  driver: "fixed" | "qty";
  qtyPerAcre?: number;
  unit?: Bi;
  rateKey?: LocalRateKey;
  defaultRate?: number;
  amountPerAcre?: number;
  /** growth stage this cost usually falls in */
  stageKey?: string;
  /** perennial establishment cost (paid once) */
  oneTime?: boolean;
  /** false = own work / own machine, valued but not paid in cash */
  cashPaid?: boolean;
  note?: Bi;
}

export interface CostTemplate {
  id: string;
  cropId: string;
  season?: Season;
  irrigated: boolean;
  lines: CostLine[];
  /** per acre, in yieldUnit */
  expectedYieldPerAcre: [number, number];
  yieldUnit: Unit;
  source: string;
  year: number;
  reviewStatus: "draft" | "reviewed";
  /** a category fallback ("general estimate"), not crop-specific */
  general?: boolean;
}

// units
const U = {
  kg: { en: "kg", mr: "किलो" },
  hr: { en: "hours", mr: "तास" },
  acre: { en: "acre", mr: "एकर" },
  manDay: { en: "man-days", mr: "पुरुष मजूर-दिवस" },
  womanDay: { en: "woman-days", mr: "महिला मजूर-दिवस" },
  trolley: { en: "trolleys", mr: "ट्रॉली" },
  round: { en: "spray rounds", mr: "फवारणी फेऱ्या" },
  month: { en: "months", mr: "महिने" },
  bag: { en: "bags", mr: "पोती" },
  crate: { en: "crates", mr: "क्रेट" },
  plant: { en: "plants", mr: "रोपे" },
  km: { en: "km", mr: "किमी" },
} satisfies Record<string, Bi>;

type Opt = Omit<CostLine, "id" | "category" | "item" | "driver">;
const q = (id: string, category: CostCategory, en: string, mr: string, o: Opt): CostLine => ({ id, category, item: { en, mr }, driver: "qty", ...o });
const f = (id: string, category: CostCategory, en: string, mr: string, amountPerAcre: number, o: Omit<Opt, "amountPerAcre"> = {}): CostLine => ({ id, category, item: { en, mr }, driver: "fixed", amountPerAcre, ...o });

// common lines
const plough = (h: number, stageKey?: string) => q("plough", "land_prep", "Ploughing (tractor)", "नांगरणी (ट्रॅक्टर)", { qtyPerAcre: h, unit: U.hr, rateKey: "tractor_hour", stageKey });
const rotavator = (stageKey?: string) => q("rotavator", "land_prep", "Rotavator / harrowing", "रोटावेटर / वखरणी", { qtyPerAcre: 1, unit: U.acre, rateKey: "rotavator_acre", stageKey });
const fym = (n: number, stageKey?: string) => q("fym", "manure", "Farmyard manure", "शेणखत", { qtyPerAcre: n, unit: U.trolley, rateKey: "fym_trolley", stageKey });
const fert = (amount: number, stageKey?: string) => f("fert", "fertiliser", "Fertilisers (as per soil test)", "रासायनिक खते (माती परीक्षणानुसार)", amount, { stageKey });
const sprays = (n: number, perRound: number, stageKey?: string) =>
  q("spray", "plant_protection", "Spray rounds (product + spraying)", "फवारणी फेऱ्या (औषध + फवारणी)", { qtyPerAcre: n, unit: U.round, defaultRate: perRound, stageKey, note: { en: "Average cost per round; choose products with your KVK.", mr: "प्रति फेरी सरासरी खर्च; औषधे कृषी विज्ञान केंद्राच्या सल्ल्याने." } });
const power = (months: number, stageKey?: string) => q("power", "irrigation", "Pump electricity", "पंपाचे वीज बिल", { qtyPerAcre: months, unit: U.month, rateKey: "electricity_month", stageKey });
const women = (id: string, en: string, mr: string, days: number, stageKey?: string) => q(id, "labour", en, mr, { qtyPerAcre: days, unit: U.womanDay, rateKey: "labour_day_female", stageKey });
const men = (id: string, en: string, mr: string, days: number, stageKey?: string) => q(id, "labour", en, mr, { qtyPerAcre: days, unit: U.manDay, rateKey: "labour_day_male", stageKey });
const bags = (n: number, stageKey?: string) => q("bags", "harvest_post", "Bags", "पोती", { qtyPerAcre: n, unit: U.bag, rateKey: "bag_empty", stageKey });
const transport = (amount: number, stageKey?: string) => f("transport", "transport_market", "Transport to market, hamali, weighing", "बाजारापर्यंत वाहतूक, हमाली, वजन", amount, { stageKey });

const DRAFT = "Draft placeholder — to verify against CACP cost of cultivation (Maharashtra) and state agricultural university estimates";
const DRAFT_HORT = "Draft placeholder — to verify against MPKV / NHB horticulture economics";
const YEAR = 2025;
const t = (o: Omit<CostTemplate, "source" | "year" | "reviewStatus" | "irrigated" | "id"> & { irrigated?: boolean; source?: string }): CostTemplate => ({
  id: `${o.cropId}${o.season ? `-${o.season}` : ""}`,
  irrigated: o.irrigated ?? true,
  source: o.source ?? DRAFT,
  year: YEAR,
  reviewStatus: "draft",
  ...o,
});

export const TEMPLATES: CostTemplate[] = [
  t({
    cropId: "onion",
    expectedYieldPerAcre: [80, 120],
    yieldUnit: "quintal",
    lines: [
      plough(3),
      rotavator(),
      men("beds", "Bed making", "वाफे तयार करणे", 4, "transplanting"),
      q("seed", "seed", "Onion seed", "कांदा बियाणे", { qtyPerAcre: 3, unit: U.kg, defaultRate: 2500, stageKey: "nursery" }),
      women("nursery", "Nursery care", "रोपवाटिका निगा", 6, "nursery"),
      fym(4),
      fert(9000, "establishment"),
      sprays(6, 1200, "vegetative"),
      power(4, "vegetative"),
      women("planting", "Transplanting", "लागवड", 25, "transplanting"),
      women("weeding", "Weeding", "खुरपणी", 20, "vegetative"),
      women("harvest", "Harvesting", "काढणी", 20, "harvest"),
      women("grading", "Grading", "प्रतवारी", 6, "curing"),
      bags(200, "curing"),
      transport(4000, "curing"),
    ],
  }),
  t({
    cropId: "tomato",
    expectedYieldPerAcre: [1000, 1500],
    yieldUnit: "crate20kg",
    lines: [
      plough(3),
      rotavator(),
      q("seedlings", "seed", "Seedlings", "रोपे", { qtyPerAcre: 6000, unit: U.plant, defaultRate: 1.5, stageKey: "nursery" }),
      fym(5),
      fert(12000, "establishment"),
      f("staking", "other", "Staking (bamboo, wire, string)", "आधार (बांबू, तार, सुतळी)", 15000, { stageKey: "vegetative" }),
      sprays(10, 1300, "fruiting"),
      power(4, "vegetative"),
      women("planting", "Transplanting", "लागवड", 10, "establishment"),
      women("weeding", "Weeding & tying", "खुरपणी व बांधणी", 25, "vegetative"),
      women("picking", "Picking", "तोडणी", 40, "harvest"),
      q("crates", "harvest_post", "Crates", "क्रेट", { qtyPerAcre: 1200, unit: U.crate, rateKey: "crate_rent", stageKey: "harvest" }),
      transport(12000, "harvest"),
    ],
  }),
  t({
    cropId: "soybean",
    irrigated: false,
    expectedYieldPerAcre: [6, 10],
    yieldUnit: "quintal",
    lines: [
      plough(2),
      rotavator(),
      q("seed", "seed", "Seed", "बियाणे", { qtyPerAcre: 30, unit: U.kg, defaultRate: 90, stageKey: "germination" }),
      q("sowing", "machinery", "Sowing (seed drill)", "पेरणी (पेरणी यंत्र)", { qtyPerAcre: 1, unit: U.hr, rateKey: "tractor_hour", stageKey: "germination" }),
      fym(1),
      fert(3500, "germination"),
      sprays(3, 900, "vegetative"),
      women("weeding", "Weeding", "खुरपणी", 10, "vegetative"),
      men("harvest", "Harvesting", "काढणी", 8, "harvest"),
      q("threshing", "machinery", "Threshing", "मळणी", { qtyPerAcre: 2, unit: U.hr, rateKey: "tractor_hour", stageKey: "harvest" }),
      bags(18, "harvest"),
      transport(1200, "harvest"),
    ],
  }),
  t({
    cropId: "cotton",
    irrigated: false,
    expectedYieldPerAcre: [6, 10],
    yieldUnit: "quintal",
    lines: [
      plough(2),
      rotavator(),
      q("seed", "seed", "Seed packets", "बियाणे पाकिटे", { qtyPerAcre: 2, unit: { en: "packets", mr: "पाकिटे" }, defaultRate: 900, stageKey: "germination" }),
      women("sowing", "Dibbling seed", "टोकणी", 4, "germination"),
      fym(2),
      fert(6000, "vegetative"),
      sprays(5, 1100, "flowering"),
      women("weeding", "Weeding", "खुरपणी", 15, "vegetative"),
      women("picking", "Picking", "वेचणी", 30, "picking"),
      transport(2000, "picking"),
    ],
  }),
  t({
    cropId: "tur",
    irrigated: false,
    expectedYieldPerAcre: [4, 7],
    yieldUnit: "quintal",
    lines: [
      plough(2),
      rotavator(),
      q("seed", "seed", "Seed", "बियाणे", { qtyPerAcre: 5, unit: U.kg, defaultRate: 150, stageKey: "germination" }),
      fym(1),
      fert(2500, "germination"),
      sprays(3, 1000, "pod"),
      women("weeding", "Weeding", "खुरपणी", 10, "vegetative"),
      men("harvest", "Harvesting", "काढणी", 6, "harvest"),
      q("threshing", "machinery", "Threshing", "मळणी", { qtyPerAcre: 1.5, unit: U.hr, rateKey: "tractor_hour", stageKey: "harvest" }),
      bags(12, "harvest"),
      transport(1000, "harvest"),
    ],
  }),
  t({
    cropId: "chana",
    irrigated: false,
    expectedYieldPerAcre: [5, 8],
    yieldUnit: "quintal",
    lines: [
      plough(2),
      rotavator(),
      q("seed", "seed", "Seed", "बियाणे", { qtyPerAcre: 30, unit: U.kg, defaultRate: 90, stageKey: "germination" }),
      fym(1),
      fert(2500, "germination"),
      sprays(2, 1000, "pod"),
      women("weeding", "Weeding", "खुरपणी", 8, "vegetative"),
      men("harvest", "Harvesting", "काढणी", 6, "harvest"),
      q("threshing", "machinery", "Threshing", "मळणी", { qtyPerAcre: 1.5, unit: U.hr, rateKey: "tractor_hour", stageKey: "harvest" }),
      bags(14, "harvest"),
      transport(1000, "harvest"),
    ],
  }),
  t({
    cropId: "jowar",
    irrigated: false,
    expectedYieldPerAcre: [6, 10],
    yieldUnit: "quintal",
    lines: [
      plough(2),
      rotavator(),
      q("seed", "seed", "Seed", "बियाणे", { qtyPerAcre: 4, unit: U.kg, defaultRate: 120, stageKey: "germination" }),
      fym(1),
      fert(2500, "vegetative"),
      sprays(1, 900, "vegetative"),
      women("weeding", "Weeding", "खुरपणी", 8, "vegetative"),
      men("harvest", "Harvesting", "काढणी", 8, "harvest"),
      q("threshing", "machinery", "Threshing", "मळणी", { qtyPerAcre: 2, unit: U.hr, rateKey: "tractor_hour", stageKey: "harvest" }),
      bags(18, "harvest"),
      transport(1000, "harvest"),
    ],
  }),
  t({
    cropId: "wheat",
    expectedYieldPerAcre: [12, 18],
    yieldUnit: "quintal",
    lines: [
      plough(2),
      rotavator(),
      q("seed", "seed", "Seed", "बियाणे", { qtyPerAcre: 40, unit: U.kg, defaultRate: 45, stageKey: "germination" }),
      q("sowing", "machinery", "Sowing (seed drill)", "पेरणी (पेरणी यंत्र)", { qtyPerAcre: 1, unit: U.hr, rateKey: "tractor_hour", stageKey: "germination" }),
      fym(1),
      fert(4500, "tillering"),
      sprays(1, 900, "heading"),
      power(3, "tillering"),
      women("weeding", "Weeding", "खुरपणी", 6, "tillering"),
      f("harvester", "machinery", "Combine harvester", "हार्वेस्टर", 2500, { stageKey: "harvest" }),
      bags(30, "harvest"),
      transport(1500, "harvest"),
    ],
  }),
  t({
    cropId: "sugarcane",
    expectedYieldPerAcre: [350, 500],
    yieldUnit: "quintal",
    lines: [
      plough(4),
      rotavator(),
      men("furrows", "Furrows and planting", "सरी काढणे व लागवड", 12, "germination"),
      q("setts", "seed", "Seed setts", "बेणे", { qtyPerAcre: 40, unit: { en: "quintals", mr: "क्विंटल" }, defaultRate: 350, stageKey: "germination" }),
      fym(6),
      fert(16000, "tillering"),
      sprays(2, 1200, "grand-growth"),
      power(12, "grand-growth"),
      women("weeding", "Weeding and earthing up", "खुरपणी व भरणी", 25, "tillering"),
      f("harvest", "harvest_post", "Cutting and loading (usually paid to the factory's crew)", "तोडणी व भरणी (सहसा कारखान्याच्या टोळीला)", 15000, { stageKey: "harvest" }),
    ],
  }),
  t({
    cropId: "turmeric",
    expectedYieldPerAcre: [18, 28],
    yieldUnit: "quintal",
    lines: [
      plough(3),
      rotavator(),
      men("beds", "Raised beds", "गादी वाफे", 6, "planting"),
      q("rhizomes", "seed", "Seed rhizomes", "बेणे (हळकुंड)", { qtyPerAcre: 900, unit: U.kg, defaultRate: 30, stageKey: "planting" }),
      women("planting", "Planting", "लागवड", 12, "planting"),
      fym(6),
      fert(12000, "vegetative"),
      sprays(4, 1100, "vegetative"),
      power(9, "vegetative"),
      women("weeding", "Weeding and earthing up", "खुरपणी व भरणी", 30, "tillering"),
      men("digging", "Digging out", "काढणी", 20, "harvest"),
      f("boiling", "harvest_post", "Boiling, drying and polishing", "उकळणे, वाळवणे व पॉलिश", 15000, { stageKey: "harvest" }),
      bags(50, "harvest"),
      transport(3000, "harvest"),
    ],
  }),
  t({
    cropId: "marigold",
    expectedYieldPerAcre: [3000, 5000],
    yieldUnit: "kg",
    lines: [
      plough(2),
      rotavator(),
      q("seedlings", "seed", "Seedlings", "रोपे", { qtyPerAcre: 9000, unit: U.plant, defaultRate: 1.2, stageKey: "nursery" }),
      fym(3),
      fert(6000, "vegetative"),
      sprays(5, 1000, "flowering"),
      power(4, "vegetative"),
      women("planting", "Transplanting", "लागवड", 8, "transplanting"),
      women("weeding", "Weeding", "खुरपणी", 12, "vegetative"),
      women("picking", "Flower picking", "फुले तोडणी", 40, "flowering"),
      transport(6000, "flowering"),
    ],
  }),
  // perennial: establishment (one-time) + one bahar cycle (yearly)
  t({
    cropId: "pomegranate",
    source: DRAFT_HORT,
    expectedYieldPerAcre: [3000, 6000],
    yieldUnit: "kg",
    lines: [
      q("pits", "land_prep", "Pits and planting", "खड्डे व लागवड", { qtyPerAcre: 25, unit: U.manDay, rateKey: "labour_day_male", stageKey: "planting", oneTime: true }),
      q("plants", "seed", "Grafted plants", "कलमे", { qtyPerAcre: 450, unit: U.plant, defaultRate: 45, stageKey: "planting", oneTime: true }),
      f("drip", "irrigation", "Drip system", "ठिबक संच", 45000, { stageKey: "planting", oneTime: true }),
      f("firstyears", "other", "First-years care (training, manure, sprays)", "सुरुवातीच्या वर्षांची निगा (छाटणी, खत, फवारणी)", 30000, { stageKey: "training", oneTime: true }),
      men("pruning", "Pruning and bahar treatment", "छाटणी व बहार धरणे", 10, "bahar-start"),
      fym(4, "bahar-start"),
      fert(15000, "bahar-start"),
      sprays(12, 1500, "fruit-growth"),
      power(6, "fruit-growth"),
      women("care", "Thinning, bagging and care", "विरळणी, पिशव्या व निगा", 30, "fruit-growth"),
      women("harvest", "Harvesting and grading", "काढणी व प्रतवारी", 20, "harvest"),
      q("crates", "harvest_post", "Crates", "क्रेट", { qtyPerAcre: 250, unit: U.crate, rateKey: "crate_rent", stageKey: "harvest" }),
      transport(8000, "harvest"),
    ],
  }),
];

// ---- category fallbacks ("general estimate") --------------------------------------------------

const general = (key: string, yieldPerAcre: [number, number], yieldUnit: Unit, perAcre: Record<string, number>, perennial = false): CostTemplate => ({
  id: `general-${key}`,
  cropId: `general-${key}`,
  irrigated: true,
  general: true,
  source: DRAFT,
  year: YEAR,
  reviewStatus: "draft",
  expectedYieldPerAcre: yieldPerAcre,
  yieldUnit,
  lines: [
    plough(2),
    rotavator(),
    ...(perennial ? [f("plants", "seed", "Plants and planting", "रोपे व लागवड", perAcre.seed, { oneTime: true })] : [f("seed", "seed", "Seed / seedlings", "बियाणे / रोपे", perAcre.seed)]),
    fym(perAcre.fym ?? 2),
    fert(perAcre.fert),
    sprays(perAcre.sprays, 1100),
    ...(perAcre.power ? [power(perAcre.power)] : []),
    women("weeding", "Weeding", "खुरपणी", perAcre.weeding),
    women("harvest", "Harvesting", "काढणी", perAcre.harvest),
    transport(perAcre.transport),
  ],
});

export const GENERAL: Record<string, CostTemplate> = {
  vegetable: general("vegetable", [60, 100], "quintal", { seed: 8000, fym: 4, fert: 9000, sprays: 6, power: 4, weeding: 20, harvest: 30, transport: 6000 }),
  cereal: general("cereal", [10, 16], "quintal", { seed: 1800, fym: 1, fert: 3500, sprays: 1, power: 2, weeding: 8, harvest: 8, transport: 1200 }),
  pulse: general("pulse", [4, 7], "quintal", { seed: 1800, fym: 1, fert: 2500, sprays: 2, weeding: 8, harvest: 6, transport: 1000 }),
  oilseed: general("oilseed", [5, 9], "quintal", { seed: 2500, fym: 1, fert: 3000, sprays: 2, weeding: 10, harvest: 8, transport: 1200 }),
  fruit: general("fruit", [3000, 6000], "kg", { seed: 25000, fym: 4, fert: 12000, sprays: 8, power: 6, weeding: 20, harvest: 20, transport: 6000 }, true),
  flower: general("flower", [2000, 4000], "kg", { seed: 9000, fym: 3, fert: 6000, sprays: 5, power: 4, weeding: 12, harvest: 40, transport: 5000 }),
  spice: general("spice", [10, 20], "quintal", { seed: 15000, fym: 4, fert: 9000, sprays: 4, power: 6, weeding: 20, harvest: 20, transport: 3000 }),
};

const FALLBACK: Record<CropCategory, keyof typeof GENERAL> = {
  vegetable: "vegetable",
  leafy: "vegetable",
  cereal: "cereal",
  millet: "cereal",
  fodder: "cereal",
  pulse: "pulse",
  oilseed: "oilseed",
  cash: "oilseed",
  fruit: "fruit",
  plantation: "fruit",
  flower: "flower",
  spice: "spice",
  medicinal: "spice",
  other: "vegetable",
};

/** the crop's template, else its category's general estimate */
export function templateFor(cropId: string, category: CropCategory, season?: Season): CostTemplate {
  return TEMPLATES.find((x) => x.cropId === cropId && (!x.season || x.season === season)) ?? GENERAL[FALLBACK[category]];
}
export const templateById = (id: string) => TEMPLATES.find((x) => x.id === id) ?? Object.values(GENERAL).find((x) => x.id === id);
