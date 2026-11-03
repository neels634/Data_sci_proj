import type { Bi, Text } from "./i18n";
import type { FieldHistory, PolygonGeometry } from "./satellite";
import type { Unit } from "./grades";

export type Role = "farmer" | "mitra" | "buyer" | "admin";
export type Lang = "en" | "mr";

export type SchemeCategory =
  | "Income support"
  | "Crop insurance"
  | "Credit"
  | "Irrigation"
  | "Mechanisation"
  | "Women & SHG"
  | "Food processing";

export type TrackerStatus =
  | "Interested"
  | "Preparing documents"
  | "Applied"
  | "Approved"
  | "Rejected"
  | "Needs follow-up";

export interface Scheme {
  id: string;
  name: Bi;
  department: Bi;
  level: "Central" | "Maharashtra";
  category: SchemeCategory;
  summary: Bi;
  benefits: Bi[];
  eligibility: Bi[];
  documents: Bi[];
  steps: Bi[];
  officialUrl: string;
  source: string;
  /** ISO date set by an admin after checking the official source; null = not yet verified */
  lastVerified: string | null;
  status: "active" | "flagged" | "archived";
  /** used for indicative profile matching only */
  tags: ("all-farmers" | "landholding" | "women" | "processing" | "irrigation" | "credit")[];
}

export interface FarmerProfile {
  name: Text;
  village: Text;
  district: Text;
  crops: string[];
  landholding: "" | "under-1ha" | "1-2ha" | "over-2ha";
  womenLed: boolean;
  consent: boolean;
}

/** Where a farmer's listing is. Once pooled, the lot's status carries offers and dispatch. */
export type ListingStatus = "waiting_check" | "ready" | "needs_drying" | "low_grade" | "pooled" | "cancelled";

/** One quality check by the Mitra */
export interface CheckRecord {
  at: string; // YYYY-MM-DD
  by: Text; // Mitra name
  gradeCode: string;
  moisture?: number; // % from the meter
  result: ListingStatus;
}

export interface Listing {
  id: string;
  farmer: Text;
  /** account id of the farmer who listed it; null for other farmers */
  owner: string | null;
  /** Crop Library id, e.g. "onion" */
  crop: string;
  /** जात / प्रत, e.g. "tomato.hybrid"; missing when the crop has none or the farmer doesn't know */
  typeCode?: string;
  /** farmer's choice, e.g. "onion.super_gole", or "unsure" */
  gradeCode: string;
  dryness?: "dry" | "damp" | "unsure";
  quantity: number;
  unit: Unit;
  village: Text;
  availableFrom: string;
  expectedPrice?: number | null; // ₹ per unit, indicative (older listings)
  /** older listings: the quality text they were saved with */
  notes?: string;
  status: ListingStatus;
  lotId: string | null;
  createdAt: string;
  mitraMoisture?: number;
  mitraGradeCode?: string;
  gradeConfirmedByMitra: boolean;
  farmerAccepted: boolean;
  recheckOn?: string; // YYYY-MM-DD
  /** the farmer tapped "I've dried it" */
  dryRequestedAt?: string;
  checkHistory: CheckRecord[];
  /** the market chosen in the farmer's best-market plan */
  preferredMarketId?: string;
  /** the estimate the farmer saw when listing */
  planSnapshot?: { marketId: string; ratePerQtl: number; rateSource: "live" | "cached" | "sample" | "mitra"; estNet: number; date: string };
}

export interface Lot {
  id: string;
  crop: string;
  typeCode?: string;
  /** every listing in a lot has this grade; "unsure" only on lots from before grading */
  gradeCode: string;
  unit: Unit;
  /** where the Mitra plans to sell this lot */
  targetMarketId?: string;
  listingIds: string[];
  village: Text;
  availableFrom: string;
  mitra: Text;
  status: "Open for offers" | "Offer accepted" | "Dispatched" | "Completed";
  createdAt: string;
}

export interface Offer {
  id: string;
  lotId: string;
  buyerId: string;
  /** ₹ per lot unit (quintal, 10 kg, crate or kg) */
  pricePerUnit: number;
  unit: Unit;
  /** in the lot unit */
  quantity: number;
  terms: Text;
  status: "Submitted" | "Accepted" | "Declined";
  createdAt: string;
}

/** "I'll sell myself": the farmer's saved best-market plan (no listing) */
export interface SellPlan {
  id: string;
  owner: string;
  cropId: string;
  typeCode?: string;
  items: { gradeCode: string; qtyQtl: number; marketId: string }[];
  vehicleId: string;
  perKm: number;
  estNet: number;
  createdAt: string;
}

/** where the farmer is, for distances; kept on the phone only, rounded to 2 decimals */
export interface FarmLocation {
  lat: number;
  lng: number;
  source: "gps" | "district";
  districtId?: string;
}

export interface Buyer {
  id: string;
  name: Bi;
  type: "Trader" | "Processor" | "Retailer" | "Wholesaler";
  location: Bi;
  commodities: string[];
  verified: boolean;
}

export interface Guide {
  id: string;
  title: Bi;
  crop: string;
  summary: Bi;
  steps: { heading: Bi; body: Bi }[];
  equipment: Bi[];
  compliance: Bi;
  defaults: CostInputs;
}

export interface CostInputs {
  units: number;
  rawMaterial: number;
  processing: number;
  packaging: number;
  labour: number;
  transport: number;
  other: number;
  sellingPrice: number;
}

export interface BusinessPlan {
  id: string;
  owner: string | null;
  guideId: string | null;
  product: Text;
  inputs: CostInputs;
  notes: string;
  savedAt: string;
}

export interface Report {
  id: string;
  about: Text;
  reason: Text;
  status: "Open" | "Resolved";
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  text: Bi;
  at: string;
}

// ---- My Farm: crop library and the farmer's own crops ----------------------------

export type Season = "kharif" | "rabi" | "summer" | "perennial";
export type ActivityType =
  | "sowing"
  | "transplanting"
  | "irrigation"
  | "fertiliser"
  | "pesticide"
  | "fungicide"
  | "weeding"
  | "observation"
  | "harvest"
  | "other";

/** One growth stage in the static crop library */
export interface CropStage {
  key: string; // "nursery", "vegetative", "bulb-formation"...
  name: Bi;
  startDay: number; // days after sowing/transplanting
  endDay: number;
  whatHappens: Bi; // plain-language description for a new farmer
  tasks: StageTask[]; // what to do in this stage
  watchFor: Bi[]; // common pests/diseases/problems in this stage
}

export interface StageTask {
  id: string;
  title: Bi;
  detail: Bi;
  dayOffset: number; // day after sowing this task becomes due
  repeatEveryDays?: number; // e.g. irrigation every 7 days within the stage
  type: ActivityType;
}

export type CropCategory =
  | "cereal"
  | "millet"
  | "pulse"
  | "oilseed"
  | "cash"
  | "vegetable"
  | "leafy"
  | "spice"
  | "fruit"
  | "plantation"
  | "flower"
  | "fodder"
  | "medicinal"
  | "other";

/** Maharashtra's five agro-regions; see lib/regions.ts for the district map. */
export type Region = "konkan" | "western" | "north" | "marathwada" | "vidarbha";

export interface CropProblem {
  name: Bi;
  signs: Bi;
  prevention: Bi;
}

/** Fields every crop in the Crop Library has. */
interface CropBase {
  id: string; // kebab-case, stable forever (My Farm stores it)
  name: Bi;
  /** English, Marathi, Hindi, local names, common misspellings, romanized Marathi */
  aliases: string[];
  category: CropCategory;
  emoji: string; // one emoji used as the crop icon
  regions: Region[]; // where it is commonly grown
  majorDistricts?: Bi; // e.g. "Nashik, Pune, Ahilyanagar"
  tier: 1 | 2 | 3; // content priority
  protectedCultivation?: boolean; // polyhouse / shade-net crops
  soil: Bi;
  climate: Bi;
  irrigation: Bi;
  nutrientGuide: Bi; // general principles only; no exact chemical doses
  /** only real released / widely grown varieties; [] when unsure */
  /** `spoken`: how a voice should say a code-like name, e.g. "N-2-4-1" → "एन दोन चार एक" */
  varieties: { name: string; note: Bi; spoken?: Bi }[];
  commonProblems: CropProblem[];
  harvestSigns: Bi;
  postHarvest: Bi; // curing, storage, grading
  marketTips: Bi;
  source: string; // institution + "package of practices"; never a URL
  lastVerified: string | null; // null = "Not yet verified"
  reviewStatus: "draft" | "reviewed";
}

export interface CropSeason {
  season: Season;
  label?: Bi; // shown instead of the plain season name, e.g. "Late kharif (rangda)"
  sowingWindow: Bi; // e.g. "June–July"
  sowingMonths: number[]; // 1–12, used for "good time to sow now?"
  durationDays: [number, number]; // min–max days from sowing to harvest
}

/** Seasonal crops: sown, harvested, done (most field crops, vegetables, many flowers). */
export interface SeasonalCrop extends CropBase {
  lifecycle: "seasonal";
  seasons: CropSeason[];
  method: "direct" | "transplant" | "both" | "vegetative"; // vegetative = sets/tubers/cuttings
  plantingMaterial: Bi; // "seed", "tubers", "setts", "seedlings", "suckers"…
  nurseryDays?: number;
  seedRate: Bi; // general, per acre
  spacing: Bi;
  /** day ranges from sowing, continuous, last end = longest duration */
  stages: CropStage[];
  /** sugarcane, banana, fodder sorghum…: the next crop grows from the stubble */
  ratoon?: { allowed: boolean; cycles: number; durationDays: [number, number]; note: Bi };
  /** multi-pick crops (flowers, okra, chilli, leafy cuttings): repeat the harvest task */
  flushes?: { everyDays: number; count: number; note: Bi };
}

/** One way farmers take the yearly crop of a perennial (a bahar or a pruning). */
export interface CropCycle {
  key: string;
  name: Bi;
  startMonths: number[]; // months when this cycle starts (pruning / bahar treatment)
  startEvent: Bi; // "Fruit pruning", "Water stress then irrigation"…
  stages: CropStage[]; // day ranges from cycle start, continuous
  harvestMonths: number[];
  note: Bi;
}

/** Perennial crops: planted once, crop every year (fruit trees, plantation crops, some flowers). */
export interface PerennialCrop extends CropBase {
  lifecycle: "perennial";
  plantingWindow: Bi;
  plantingMonths: number[];
  plantingMaterial: Bi; // "grafts", "tissue culture plants", "rooted cuttings"…
  spacing: Bi;
  plantsPerAcre: [number, number];
  yearsToFirstHarvest: [number, number];
  economicLifeYears: [number, number];
  /** planting to first crop: training, pruning, intercrops in early years (days from planting) */
  establishment: CropStage[];
  /** several options where farmers choose one, e.g. pomegranate bahar or grape pruning */
  cycles: CropCycle[];
}

/** Static, curated crop knowledge (Crop Library) */
export type CropInfo = SeasonalCrop | PerennialCrop;

/** A farmer's own crop (My Crops) */
export interface FarmCrop {
  id: string;
  owner: string; // account id
  cropId: string; // -> CropInfo.id
  kind: "seasonal" | "perennial";
  season: Season;
  /** index into SeasonalCrop.seasons when a crop has two entries for one season (onion kharif / late kharif) */
  seasonIndex: number;
  variety: Text;
  plotName: Text; // "Field near well"
  areaAcres: number;
  /** the field marked on the satellite map; missing until the farmer marks it */
  boundary?: PolygonGeometry | null;
  /** the season's satellite record, kept so it opens without waiting and goes into the case summary */
  fieldHistory?: FieldHistory | null;
  method: "direct" | "transplant" | "vegetative";
  status: "planned" | "growing" | "harvested" | "abandoned";
  plannedSowingDate: string | null; // YYYY-MM-DD
  sowingDate: string | null; // actual date; null while planned
  transplantDate: string | null;
  durationDays: [number, number]; // copied from the library, editable by the farmer
  harvestedOn: string | null;
  notes: string;
  createdAt: string;
  // perennial only
  plantedOn?: string | null; // orchard planting date
  plantCount?: number; // trees / plants
  cycleKey?: string; // chosen bahar / pruning cycle
  cycleStart?: string | null; // this year's pruning / bahar start date
  // seasonal crops with ratoon
  ratoonNumber?: number; // 0 = plant crop, 1 = first ratoon…
}

export interface FarmActivity {
  id: string;
  farmCropId: string;
  type: ActivityType;
  date: string; // YYYY-MM-DD
  productName?: string; // what the farmer actually used, as typed
  quantity?: string; // as typed, e.g. "2 bags", "500 ml in 200 L"
  preHarvestIntervalDays?: number; // from the product label, optional
  reEntryHours?: number; // from the product label, optional
  linkedTaskId?: string; // set when logged by completing a task
  notes: string;
  createdAt: string;
}

export interface TaskState {
  farmCropId: string;
  taskKey: string; // `${taskId}:${dueDate}` so repeating tasks are tracked per occurrence
  status: "done" | "skipped";
  at: string;
}

/** Dated observation of crop stress recorded by the farmer on a specific plot */
export interface StressObservation {
  id: string;
  farmCropId: string;
  date: string; // YYYY-MM-DD
  symptomNotes: string;
  stressCategory?: "pest" | "disease" | "water" | "weather" | "other";
  /** Compressed client-side data URL stored locally on device; null if no photo */
  photoDataUrl: string | null;
  createdAt: string;
}
