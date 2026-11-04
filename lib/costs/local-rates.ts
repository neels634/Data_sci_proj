/**
 * The few local prices most of an estimate depends on. The farmer types their village rate once;
 * every estimate uses it. Defaults are drafts.
 * TODO: confirm with local Mitra / KVK
 */
import type { Bi } from "../i18n";

export type LocalRateKey =
  | "labour_day_male"
  | "labour_day_female"
  | "tractor_hour"
  | "rotavator_acre"
  | "sprayer_day"
  | "fym_trolley"
  | "electricity_month"
  | "diesel_litre"
  | "bag_empty"
  | "crate_rent"
  | "vehicle_km";

export interface LocalRateInfo {
  key: LocalRateKey;
  name: Bi;
  /** what one unit is */
  per: Bi;
  /** ₹, draft */
  default: number;
}

export const LOCAL_RATES: LocalRateInfo[] = [
  { key: "labour_day_male", name: { en: "Labour (man), per day", mr: "मजुरी (पुरुष), प्रति दिवस" }, per: { en: "day", mr: "दिवस" }, default: 450 },
  { key: "labour_day_female", name: { en: "Labour (woman), per day", mr: "मजुरी (महिला), प्रति दिवस" }, per: { en: "day", mr: "दिवस" }, default: 300 },
  { key: "tractor_hour", name: { en: "Tractor hire, per hour", mr: "ट्रॅक्टर भाडे, प्रति तास" }, per: { en: "hour", mr: "तास" }, default: 900 },
  { key: "rotavator_acre", name: { en: "Rotavator, per acre", mr: "रोटावेटर, प्रति एकर" }, per: { en: "acre", mr: "एकर" }, default: 1800 },
  { key: "sprayer_day", name: { en: "Spray pump / sprayer, per day", mr: "फवारणी पंप, प्रति दिवस" }, per: { en: "day", mr: "दिवस" }, default: 400 },
  { key: "fym_trolley", name: { en: "Farmyard manure, per trolley", mr: "शेणखत, प्रति ट्रॉली" }, per: { en: "trolley", mr: "ट्रॉली" }, default: 3000 },
  { key: "electricity_month", name: { en: "Electricity for the pump, per month", mr: "पंपाचे वीज बिल, प्रति महिना" }, per: { en: "month", mr: "महिना" }, default: 600 },
  { key: "diesel_litre", name: { en: "Diesel, per litre", mr: "डिझेल, प्रति लिटर" }, per: { en: "litre", mr: "लिटर" }, default: 95 },
  { key: "bag_empty", name: { en: "Empty bag, each", mr: "रिकामे पोते, प्रति नग" }, per: { en: "bag", mr: "पोते" }, default: 18 },
  { key: "crate_rent", name: { en: "Crate, each", mr: "क्रेट, प्रति नग" }, per: { en: "crate", mr: "क्रेट" }, default: 10 },
  { key: "vehicle_km", name: { en: "Vehicle hire, per km", mr: "गाडी भाडे, प्रति किमी" }, per: { en: "km", mr: "किमी" }, default: 25 },
];

export type LocalRates = Partial<Record<LocalRateKey, number>>;
export const rateDefault = (k: LocalRateKey) => LOCAL_RATES.find((r) => r.key === k)!.default;
/** the farmer's rate, else the default */
export const rateOf = (rates: LocalRates, k: LocalRateKey) => rates[k] ?? rateDefault(k);
