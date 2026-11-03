/**
 * Maharashtra APMCs (mandis) used for rates and the best-market plan.
 * TODO verify: coordinates are approximate town centres, not the market yard gate.
 * TODO: confirm farmer-side charges (hamali, weighing…) with each APMC; feesPerQtl is a draft default.
 * `crops` lists what is commonly traded there (draft); `agmarknetNames` are the market names the
 * data.gov.in mandi dataset uses for this APMC.
 */
import type { Bi } from "../i18n";

export interface Market {
  id: string;
  name: Bi;
  district: string;
  lat: number;
  lng: number;
  /** Crop Library ids commonly traded there */
  crops: string[];
  /** farmer-side charges per quintal (draft) */
  feesPerQtl: number;
  notes?: Bi;
  agmarknetNames: string[];
}

const FEES = 15; // ₹ per quintal, draft default

const GRAINS = ["soybean", "tur", "chana", "jowar"];
const VEG = ["onion", "tomato"];

export const MARKETS: Market[] = [
  { id: "lasalgaon", name: { en: "Lasalgaon", mr: "लासलगाव" }, district: "Nashik", lat: 20.15, lng: 74.23, crops: ["onion", "soybean"], feesPerQtl: FEES, notes: { en: "Asia's biggest onion market; auctions in the morning.", mr: "आशियातील सर्वात मोठा कांदा बाजार; सकाळी लिलाव." }, agmarknetNames: ["Lasalgaon", "Lasalgaon(Niphad)", "Lasalgaon(Vinchur)"] },
  { id: "pimpalgaon", name: { en: "Pimpalgaon Baswant", mr: "पिंपळगाव बसवंत" }, district: "Nashik", lat: 20.17, lng: 73.99, crops: ["onion", "tomato", "pomegranate"], feesPerQtl: FEES, agmarknetNames: ["Pimpalgaon", "Pimpalgaon Baswant(Saykheda)"] },
  { id: "nashik", name: { en: "Nashik", mr: "नाशिक" }, district: "Nashik", lat: 20.0, lng: 73.79, crops: [...VEG, "pomegranate", "marigold"], feesPerQtl: FEES, agmarknetNames: ["Nashik"] },
  { id: "manchar", name: { en: "Manchar", mr: "मंचर" }, district: "Pune", lat: 19.0, lng: 73.94, crops: [...VEG], feesPerQtl: FEES, agmarknetNames: ["Manchar"] },
  { id: "pune", name: { en: "Pune (Gultekdi)", mr: "पुणे (गुलटेकडी)" }, district: "Pune", lat: 18.49, lng: 73.87, crops: [...VEG, "pomegranate", "marigold", "chana", "tur"], feesPerQtl: FEES, notes: { en: "Big vegetable, fruit and flower yard.", mr: "भाजीपाला, फळे व फुलांचा मोठा बाजार." }, agmarknetNames: ["Pune", "Pune(Moshi)", "Pune(Manjri)"] },
  { id: "narayangaon", name: { en: "Junnar (Narayangaon)", mr: "जुन्नर (नारायणगाव)" }, district: "Pune", lat: 19.11, lng: 73.97, crops: ["tomato", "onion"], feesPerQtl: FEES, notes: { en: "Large tomato market.", mr: "टोमॅटोचा मोठा बाजार." }, agmarknetNames: ["Junnar", "Junnar(Narayangaon)", "Junnar(Otur)"] },
  { id: "rahata", name: { en: "Rahata", mr: "राहाता" }, district: "Ahilyanagar", lat: 19.71, lng: 74.48, crops: ["onion", "pomegranate", "soybean"], feesPerQtl: FEES, agmarknetNames: ["Rahata"] },
  { id: "ahilyanagar", name: { en: "Ahilyanagar", mr: "अहिल्यानगर" }, district: "Ahilyanagar", lat: 19.09, lng: 74.74, crops: [...VEG, ...GRAINS, "pomegranate"], feesPerQtl: FEES, agmarknetNames: ["Ahmednagar", "Ahilyanagar"] },
  { id: "solapur", name: { en: "Solapur", mr: "सोलापूर" }, district: "Solapur", lat: 17.66, lng: 75.91, crops: [...VEG, ...GRAINS, "pomegranate"], feesPerQtl: FEES, agmarknetNames: ["Solapur"] },
  { id: "sangola", name: { en: "Sangola", mr: "सांगोला" }, district: "Solapur", lat: 17.44, lng: 75.19, crops: ["pomegranate"], feesPerQtl: FEES, notes: { en: "Pomegranate auctions.", mr: "डाळिंबाचे लिलाव." }, agmarknetNames: ["Sangola"] },
  { id: "pandharpur", name: { en: "Pandharpur", mr: "पंढरपूर" }, district: "Solapur", lat: 17.68, lng: 75.33, crops: ["pomegranate", "onion", "jowar"], feesPerQtl: FEES, agmarknetNames: ["Pandharpur"] },
  { id: "phaltan", name: { en: "Phaltan", mr: "फलटण" }, district: "Satara", lat: 17.99, lng: 74.43, crops: [...VEG, ...GRAINS, "pomegranate"], feesPerQtl: FEES, agmarknetNames: ["Phaltan"] },
  { id: "lonand", name: { en: "Lonand", mr: "लोणंद" }, district: "Satara", lat: 18.04, lng: 74.18, crops: ["onion", "soybean", "jowar"], feesPerQtl: FEES, agmarknetNames: ["Lonand"] },
  { id: "satara", name: { en: "Satara", mr: "सातारा" }, district: "Satara", lat: 17.69, lng: 74.0, crops: [...VEG, ...GRAINS, "turmeric"], feesPerQtl: FEES, agmarknetNames: ["Satara"] },
  { id: "baramati", name: { en: "Baramati", mr: "बारामती" }, district: "Pune", lat: 18.15, lng: 74.58, crops: [...VEG, ...GRAINS, "cotton"], feesPerQtl: FEES, agmarknetNames: ["Baramati"] },
  { id: "sangli", name: { en: "Sangli", mr: "सांगली" }, district: "Sangli", lat: 16.85, lng: 74.58, crops: ["turmeric", "soybean", "chana", "jowar"], feesPerQtl: FEES, notes: { en: "Big turmeric market.", mr: "हळदीचा मोठा बाजार." }, agmarknetNames: ["Sangli"] },
  { id: "kolhapur", name: { en: "Kolhapur", mr: "कोल्हापूर" }, district: "Kolhapur", lat: 16.7, lng: 74.24, crops: [...VEG, "soybean", "jowar", "turmeric"], feesPerQtl: FEES, agmarknetNames: ["Kolhapur"] },
  { id: "latur", name: { en: "Latur", mr: "लातूर" }, district: "Latur", lat: 18.4, lng: 76.56, crops: [...GRAINS], feesPerQtl: FEES, notes: { en: "Big pulses and soybean market.", mr: "डाळी व सोयाबीनचा मोठा बाजार." }, agmarknetNames: ["Latur"] },
  { id: "akola", name: { en: "Akola", mr: "अकोला" }, district: "Akola", lat: 20.71, lng: 77.0, crops: ["cotton", "soybean", "tur", "chana"], feesPerQtl: FEES, agmarknetNames: ["Akola"] },
  { id: "amravati", name: { en: "Amravati", mr: "अमरावती" }, district: "Amravati", lat: 20.93, lng: 77.75, crops: ["cotton", "soybean", "tur", "chana"], feesPerQtl: FEES, agmarknetNames: ["Amrawati", "Amravati"] },
  { id: "washim", name: { en: "Washim", mr: "वाशिम" }, district: "Washim", lat: 20.11, lng: 77.13, crops: ["soybean", "tur", "chana"], feesPerQtl: FEES, agmarknetNames: ["Washim"] },
  { id: "yavatmal", name: { en: "Yavatmal", mr: "यवतमाळ" }, district: "Yavatmal", lat: 20.39, lng: 78.12, crops: ["cotton", "soybean", "tur"], feesPerQtl: FEES, agmarknetNames: ["Yeotmal", "Yavatmal"] },
  { id: "hingoli", name: { en: "Hingoli", mr: "हिंगोली" }, district: "Hingoli", lat: 19.72, lng: 77.15, crops: ["turmeric", "soybean", "tur"], feesPerQtl: FEES, notes: { en: "Big turmeric market (Basmat nearby).", mr: "हळदीचा मोठा बाजार (जवळ वसमत)." }, agmarknetNames: ["Hingoli"] },
  { id: "jalna", name: { en: "Jalna", mr: "जालना" }, district: "Jalna", lat: 19.84, lng: 75.88, crops: ["cotton", "soybean", "tur", "chana", "jowar"], feesPerQtl: FEES, agmarknetNames: ["Jalna"] },
  { id: "sambhajinagar", name: { en: "Chhatrapati Sambhajinagar", mr: "छत्रपती संभाजीनगर" }, district: "Chhatrapati Sambhajinagar", lat: 19.88, lng: 75.34, crops: [...VEG, "cotton", "soybean", "jowar"], feesPerQtl: FEES, agmarknetNames: ["Aurangabad", "Chhatrapati Sambhajinagar"] },
  { id: "jalgaon", name: { en: "Jalgaon", mr: "जळगाव" }, district: "Jalgaon", lat: 21.0, lng: 75.56, crops: ["cotton", "jowar", "chana", "tur"], feesPerQtl: FEES, agmarknetNames: ["Jalgaon"] },
  { id: "nagpur", name: { en: "Nagpur", mr: "नागपूर" }, district: "Nagpur", lat: 21.15, lng: 79.09, crops: [...VEG, "cotton", "soybean", "tur", "chana"], feesPerQtl: FEES, agmarknetNames: ["Nagpur"] },
  { id: "vashi", name: { en: "Mumbai (Vashi APMC)", mr: "मुंबई (वाशी एपीएमसी)" }, district: "Thane", lat: 19.08, lng: 73.0, crops: [...VEG, "pomegranate", "chana", "tur", "turmeric"], feesPerQtl: FEES, notes: { en: "Mumbai wholesale market.", mr: "मुंबईचा घाऊक बाजार." }, agmarknetNames: ["Mumbai", "Vashi New Mumbai"] },
  { id: "dadar", name: { en: "Dadar flower market", mr: "दादर फूल बाजार" }, district: "Mumbai", lat: 19.02, lng: 72.84, crops: ["marigold"], feesPerQtl: FEES, notes: { en: "Flowers sold early morning.", mr: "फुले पहाटे विकली जातात." }, agmarknetNames: ["Dadar"] },
];

export const marketById = (id: string) => MARKETS.find((m) => m.id === id);

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
/** match a data.gov.in market name to ours; unmatched names get a slug id */
export function matchMarket(apiName: string): { id: string; market?: Market } {
  const n = apiName.trim().toLowerCase();
  const m = MARKETS.find((x) => x.agmarknetNames.some((a) => a.toLowerCase() === n) || x.name.en.toLowerCase() === n);
  return m ? { id: m.id, market: m } : { id: slug(apiName) };
}
