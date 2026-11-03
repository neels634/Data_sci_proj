/**
 * Maharashtra's five agro-regions and which district belongs to which. District names match the
 * `DISTRICTS` values in lib/account.ts; old names (Ahmednagar, Aurangabad, Osmanabad) are aliases.
 * No runtime imports, so validation scripts can use it under plain `node`.
 */
import type { Region } from "./types.ts";

export const REGIONS: Region[] = ["konkan", "western", "north", "marathwada", "vidarbha"];

export const REGION_LABEL: Record<Region, { en: string; mr: string }> = {
  konkan: { en: "Konkan", mr: "कोकण" },
  western: { en: "Western Maharashtra", mr: "पश्चिम महाराष्ट्र" },
  north: { en: "North Maharashtra", mr: "उत्तर महाराष्ट्र" },
  marathwada: { en: "Marathwada", mr: "मराठवाडा" },
  vidarbha: { en: "Vidarbha", mr: "विदर्भ" },
};

const DISTRICTS_BY_REGION: Record<Region, string[]> = {
  konkan: ["Mumbai City", "Mumbai Suburban", "Thane", "Palghar", "Raigad", "Ratnagiri", "Sindhudurg"],
  western: ["Pune", "Satara", "Sangli", "Kolhapur", "Solapur"],
  north: ["Nashik", "Dhule", "Nandurbar", "Jalgaon", "Ahilyanagar"],
  marathwada: ["Chhatrapati Sambhajinagar", "Jalna", "Beed", "Dharashiv", "Latur", "Nanded", "Parbhani", "Hingoli"],
  vidarbha: ["Nagpur", "Wardha", "Bhandara", "Gondia", "Chandrapur", "Gadchiroli", "Amravati", "Akola", "Washim", "Buldhana", "Yavatmal"],
};

/** older or alternative spellings → the name used in DISTRICTS */
const ALIASES: Record<string, string> = {
  ahmednagar: "Ahilyanagar",
  ahmadnagar: "Ahilyanagar",
  aurangabad: "Chhatrapati Sambhajinagar",
  "sambhajinagar": "Chhatrapati Sambhajinagar",
  osmanabad: "Dharashiv",
  buldana: "Buldhana",
  gondiya: "Gondia",
  bid: "Beed",
  mumbai: "Mumbai City",
};

const key = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
const DISTRICT_REGION = new Map<string, Region>();
for (const r of REGIONS) for (const d of DISTRICTS_BY_REGION[r]) DISTRICT_REGION.set(key(d), r);

/** Region of a district (value or common old name); null when unknown → no region filter. */
export function regionForDistrict(district: string | null | undefined): Region | null {
  if (!district) return null;
  const k = key(district);
  return DISTRICT_REGION.get(k) ?? DISTRICT_REGION.get(key(ALIASES[k] ?? "")) ?? null;
}

export const districtsIn = (r: Region) => DISTRICTS_BY_REGION[r];
