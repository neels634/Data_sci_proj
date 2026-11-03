/**
 * Maharashtra district headquarters, for the farmer's location when GPS is not used.
 * TODO verify: approximate coordinates of each district HQ town.
 */
import type { Bi } from "../i18n";

export interface District {
  id: string;
  name: Bi;
  lat: number;
  lng: number;
}

export const DISTRICT_HQ: District[] = [
  { id: "ahilyanagar", name: { en: "Ahilyanagar", mr: "अहिल्यानगर" }, lat: 19.09, lng: 74.74 },
  { id: "akola", name: { en: "Akola", mr: "अकोला" }, lat: 20.71, lng: 77.0 },
  { id: "amravati", name: { en: "Amravati", mr: "अमरावती" }, lat: 20.93, lng: 77.75 },
  { id: "beed", name: { en: "Beed", mr: "बीड" }, lat: 18.99, lng: 75.76 },
  { id: "bhandara", name: { en: "Bhandara", mr: "भंडारा" }, lat: 21.17, lng: 79.65 },
  { id: "buldhana", name: { en: "Buldhana", mr: "बुलढाणा" }, lat: 20.53, lng: 76.18 },
  { id: "chandrapur", name: { en: "Chandrapur", mr: "चंद्रपूर" }, lat: 19.96, lng: 79.3 },
  { id: "sambhajinagar", name: { en: "Chhatrapati Sambhajinagar", mr: "छत्रपती संभाजीनगर" }, lat: 19.88, lng: 75.34 },
  { id: "dharashiv", name: { en: "Dharashiv", mr: "धाराशिव" }, lat: 18.19, lng: 76.04 },
  { id: "dhule", name: { en: "Dhule", mr: "धुळे" }, lat: 20.9, lng: 74.77 },
  { id: "gadchiroli", name: { en: "Gadchiroli", mr: "गडचिरोली" }, lat: 20.18, lng: 80.0 },
  { id: "gondia", name: { en: "Gondia", mr: "गोंदिया" }, lat: 21.46, lng: 80.2 },
  { id: "hingoli", name: { en: "Hingoli", mr: "हिंगोली" }, lat: 19.72, lng: 77.15 },
  { id: "jalgaon", name: { en: "Jalgaon", mr: "जळगाव" }, lat: 21.0, lng: 75.56 },
  { id: "jalna", name: { en: "Jalna", mr: "जालना" }, lat: 19.84, lng: 75.88 },
  { id: "kolhapur", name: { en: "Kolhapur", mr: "कोल्हापूर" }, lat: 16.7, lng: 74.24 },
  { id: "latur", name: { en: "Latur", mr: "लातूर" }, lat: 18.4, lng: 76.56 },
  { id: "mumbai", name: { en: "Mumbai", mr: "मुंबई" }, lat: 18.96, lng: 72.82 },
  { id: "nagpur", name: { en: "Nagpur", mr: "नागपूर" }, lat: 21.15, lng: 79.09 },
  { id: "nanded", name: { en: "Nanded", mr: "नांदेड" }, lat: 19.15, lng: 77.31 },
  { id: "nandurbar", name: { en: "Nandurbar", mr: "नंदुरबार" }, lat: 21.37, lng: 74.24 },
  { id: "nashik", name: { en: "Nashik", mr: "नाशिक" }, lat: 20.0, lng: 73.79 },
  { id: "palghar", name: { en: "Palghar", mr: "पालघर" }, lat: 19.7, lng: 72.77 },
  { id: "parbhani", name: { en: "Parbhani", mr: "परभणी" }, lat: 19.27, lng: 76.77 },
  { id: "pune", name: { en: "Pune", mr: "पुणे" }, lat: 18.52, lng: 73.86 },
  { id: "raigad", name: { en: "Raigad (Alibag)", mr: "रायगड (अलिबाग)" }, lat: 18.64, lng: 72.87 },
  { id: "ratnagiri", name: { en: "Ratnagiri", mr: "रत्नागिरी" }, lat: 16.99, lng: 73.3 },
  { id: "sangli", name: { en: "Sangli", mr: "सांगली" }, lat: 16.85, lng: 74.58 },
  { id: "satara", name: { en: "Satara", mr: "सातारा" }, lat: 17.69, lng: 74.0 },
  { id: "sindhudurg", name: { en: "Sindhudurg (Oros)", mr: "सिंधुदुर्ग (ओरोस)" }, lat: 16.11, lng: 73.68 },
  { id: "solapur", name: { en: "Solapur", mr: "सोलापूर" }, lat: 17.66, lng: 75.91 },
  { id: "thane", name: { en: "Thane", mr: "ठाणे" }, lat: 19.22, lng: 72.98 },
  { id: "wardha", name: { en: "Wardha", mr: "वर्धा" }, lat: 20.74, lng: 78.6 },
  { id: "washim", name: { en: "Washim", mr: "वाशिम" }, lat: 20.11, lng: 77.13 },
  { id: "yavatmal", name: { en: "Yavatmal", mr: "यवतमाळ" }, lat: 20.39, lng: 78.12 },
];

export const districtById = (id: string) => DISTRICT_HQ.find((d) => d.id === id);
/** match a typed / profile district name (English or Marathi, old names too) */
export function findDistrict(name: string) {
  const n = name.trim().toLowerCase();
  if (!n) return undefined;
  const alias: Record<string, string> = { ahmednagar: "ahilyanagar", aurangabad: "sambhajinagar", osmanabad: "dharashiv" };
  return DISTRICT_HQ.find((d) => d.id === (alias[n] ?? n) || d.name.en.toLowerCase() === n || d.name.mr === name.trim());
}
