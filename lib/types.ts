import type { Bi, Text } from "./i18n";
import type { FieldHistory, PolygonGeometry } from "./satellite";

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

export type ListingStatus =
  | "Submitted"
  | "With Mitra"
  | "In lot"
  | "Offer received"
  | "Accepted"
  | "Dispatched"
  | "Completed"
  | "Cancelled";

export interface Listing {
  id: string;
  farmer: Text;
  /** account id of the farmer who listed it; null for other farmers */
  owner: string | null;
  crop: string;
  quantity: number; // quintals
  grade: "A" | "B" | "C" | "Ungraded";
  village: Text;
  availableFrom: string;
  expectedPrice: number | null; // ₹ per quintal, indicative
  wantsMitra: boolean;
  status: ListingStatus;
  lotId: string | null;
  createdAt: string;
}

export interface Lot {
  id: string;
  crop: string;
  listingIds: string[];
  grades: string[];
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
  pricePerQuintal: number;
  quantity: number;
  terms: Text;
  status: "Submitted" | "Accepted" | "Declined";
  createdAt: string;
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

/** Static, curated crop knowledge (Crop Library) */
export interface CropInfo {
  id: string; // "onion"
  emoji: string;
  name: Bi;
  aliases: string[]; // search terms incl. Marathi + common spellings: ["kanda","कांदा","onion"]
  category: "vegetable" | "cereal" | "pulse" | "oilseed" | "fibre" | "fruit" | "cash";
  seasons: {
    season: Season;
    label?: Bi; // shown instead of the plain season name, e.g. "Late kharif (rangda)"
    sowingWindow: Bi; // e.g. "June–July"
    sowingMonths: number[]; // 1–12, used for "good time to sow now?" check
    durationDays: [number, number]; // min–max days to harvest
  }[];
  method: "direct" | "transplant" | "both";
  nurseryDays?: number;
  soil: Bi;
  climate: Bi;
  seedRate: Bi; // general, per acre
  spacing: Bi;
  irrigation: Bi;
  nutrientGuide: Bi; // general principles only; no exact chemical doses
  stages: CropStage[];
  commonProblems: { name: Bi; signs: Bi; prevention: Bi }[];
  harvestSigns: Bi;
  postHarvest: Bi; // curing, storage, grading
  marketTips: Bi;
  source: string; // e.g. "MPKV Rahuri / ICAR package of practices"
  lastVerified: string | null; // null = "Not yet verified", same rule as Scheme
}

/** A farmer's own crop (My Crops) */
export interface FarmCrop {
  id: string;
  owner: string; // account id
  cropId: string; // -> CropInfo.id
  season: Season;
  /** index into CropInfo.seasons when a crop has two entries for one season (onion kharif / late kharif) */
  seasonIndex: number;
  variety: Text;
  plotName: Text; // "Field near well"
  areaAcres: number;
  /** the field marked on the satellite map; missing until the farmer marks it */
  boundary?: PolygonGeometry | null;
  /** the season's satellite record, kept so it opens without waiting and goes into the case summary */
  fieldHistory?: FieldHistory | null;
  method: "direct" | "transplant";
  status: "planned" | "growing" | "harvested" | "abandoned";
  plannedSowingDate: string | null; // YYYY-MM-DD
  sowingDate: string | null; // actual date; null while planned
  transplantDate: string | null;
  durationDays: [number, number]; // copied from the library, editable by the farmer
  harvestedOn: string | null;
  notes: string;
  createdAt: string;
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
