/** Cost categories (fixed list, used everywhere) and area units. Money is ₹; area is stored in acres. */
import type { Bi } from "../i18n";

export type CostCategory =
  | "land_prep"
  | "seed"
  | "manure"
  | "fertiliser"
  | "plant_protection"
  | "irrigation"
  | "labour"
  | "machinery"
  | "harvest_post"
  | "transport_market"
  | "land_rent"
  | "other";

export interface CategoryInfo {
  code: CostCategory;
  name: Bi;
  examples: Bi;
  /** chart colour */
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { code: "land_prep", name: { en: "Land preparation", mr: "पूर्वमशागत" }, examples: { en: "Ploughing, rotavator, harrowing", mr: "नांगरणी, रोटावेटर, वखरणी" }, color: "#8a5a2b" },
  { code: "seed", name: { en: "Seed / seedlings", mr: "बियाणे / रोपे" }, examples: { en: "Seed, nursery, grafts", mr: "बियाणे, रोपवाटिका, कलमे" }, color: "#2b6a4f" },
  { code: "manure", name: { en: "Manure / organic", mr: "शेणखत / सेंद्रिय खत" }, examples: { en: "FYM, compost, vermicompost", mr: "शेणखत, कंपोस्ट, गांडूळ खत" }, color: "#6b8e23" },
  { code: "fertiliser", name: { en: "Fertiliser", mr: "रासायनिक खत" }, examples: { en: "As per soil test", mr: "माती परीक्षणानुसार" }, color: "#a86f0c" },
  { code: "plant_protection", name: { en: "Plant protection", mr: "फवारणी / औषधे" }, examples: { en: "Spray rounds, traps", mr: "फवारणी फेऱ्या, सापळे" }, color: "#b5532e" },
  { code: "irrigation", name: { en: "Irrigation", mr: "पाणी / वीज / डिझेल" }, examples: { en: "Electricity, diesel, drip upkeep", mr: "वीज, डिझेल, ठिबक देखभाल" }, color: "#2f6f8f" },
  { code: "labour", name: { en: "Hired labour", mr: "मजुरी" }, examples: { en: "Sowing, weeding, picking", mr: "लागवड, खुरपणी, तोडणी" }, color: "#6d4c9b" },
  { code: "machinery", name: { en: "Machine hire", mr: "यंत्र भाडे" }, examples: { en: "Tractor, sprayer, thresher", mr: "ट्रॅक्टर, फवारणी यंत्र, मळणी यंत्र" }, color: "#4a5a4f" },
  { code: "harvest_post", name: { en: "Harvest & packing", mr: "काढणी व पॅकिंग" }, examples: { en: "Grading, bags, crates", mr: "प्रतवारी, पोती, क्रेट" }, color: "#c08a1e" },
  { code: "transport_market", name: { en: "Transport & market", mr: "वाहतूक व बाजार खर्च" }, examples: { en: "Vehicle hire, hamali, weighing", mr: "गाडी भाडे, हमाली, वजन" }, color: "#28507a" },
  { code: "land_rent", name: { en: "Land rent", mr: "जमीन भाडे" }, examples: { en: "If land is leased", mr: "जमीन भाड्याने असल्यास" }, color: "#7a6a5a" },
  { code: "other", name: { en: "Other", mr: "इतर" }, examples: { en: "Insurance, interest, misc.", mr: "विमा, व्याज, इतर" }, color: "#8a8f8b" },
];

export const categoryInfo = (c: CostCategory) => CATEGORIES.find((x) => x.code === c)!;
export const isCategory = (c: string): c is CostCategory => CATEGORIES.some((x) => x.code === c);

// ---- area -----------------------------------------------------------------------------------

export type AreaUnit = "acre" | "hectare" | "guntha";
export const ACRES_PER_HECTARE = 2.471;
export const GUNTHA_PER_ACRE = 40;
const PER_ACRE: Record<AreaUnit, number> = { acre: 1, hectare: 1 / ACRES_PER_HECTARE, guntha: GUNTHA_PER_ACRE };

/** acres → the unit */
export const fromAcres = (acres: number, unit: AreaUnit) => acres * PER_ACRE[unit];
/** the unit → acres */
export const toAcres = (value: number, unit: AreaUnit) => value / PER_ACRE[unit];
/** ₹ per acre → ₹ per the unit */
export const perAreaFromPerAcre = (perAcre: number, unit: AreaUnit) => perAcre / PER_ACRE[unit];

export const AREA_NAME: Record<AreaUnit, Bi> = {
  acre: { en: "acre", mr: "एकर" },
  hectare: { en: "hectare", mr: "हेक्टर" },
  guntha: { en: "guntha", mr: "गुंठा" },
};
