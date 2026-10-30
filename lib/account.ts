/**
 * User accounts for the prototype. Accounts live in the browser (localStorage) — there is no
 * server or database. The PIN is stored only as a SHA-256 hash.
 *
 * Per the PRD, no Aadhaar, bank account numbers or OTPs are collected.
 */
import { bi, type Bi } from "./i18n";
import type { FarmerProfile, Role } from "./types";

export type Option = { value: string; label: Bi };
const o = (value: string, en: string, mr: string): Option => ({ value, label: bi(en, mr) });

export interface Account {
  id: string;
  mobile: string; // 10 digits
  pinHash: string;
  createdAt: string;
  role: Role;

  // about you
  name: string;
  gender: string;
  ageGroup: string;
  education: string;
  altMobile: string;

  // where you live
  district: string; // value from DISTRICTS
  taluka: string;
  village: string;
  pincode: string;

  // farmer / entrepreneur
  landOwnedAcres: string;
  landLeasedAcres: string;
  irrigation: string[];
  crops: string[];
  livestock: string[];
  shgMember: boolean;
  shgName: string;
  fpoMember: boolean;
  fpoName: string;
  sellsVia: string[];
  interests: string[];
  phoneAccess: string;

  // mandi mitra
  experienceYears: string;
  villagesServed: string;
  vehicle: string[];
  mitraTrained: boolean;

  // buyer
  businessName: string;
  businessType: string;
  gstin: string;
  commodities: string[];
  monthlyVolumeQtl: string;

  // admin / coordinator
  organisation: string;
  designation: string;

  // contact & consent
  languages: string[];
  contactVia: string[];
  bestTime: string;
  consentData: boolean;
  consentContact: boolean;
}

export const emptyAccount = (): Omit<Account, "id" | "pinHash" | "createdAt"> => ({
  mobile: "",
  role: "farmer",
  name: "",
  gender: "",
  ageGroup: "",
  education: "",
  altMobile: "",
  district: "",
  taluka: "",
  village: "",
  pincode: "",
  landOwnedAcres: "",
  landLeasedAcres: "",
  irrigation: [],
  crops: [],
  livestock: [],
  shgMember: false,
  shgName: "",
  fpoMember: false,
  fpoName: "",
  sellsVia: [],
  interests: [],
  phoneAccess: "",
  experienceYears: "",
  villagesServed: "",
  vehicle: [],
  mitraTrained: false,
  businessName: "",
  businessType: "",
  gstin: "",
  commodities: [],
  monthlyVolumeQtl: "",
  organisation: "",
  designation: "",
  languages: ["mr"],
  contactVia: [],
  bestTime: "",
  consentData: false,
  consentContact: false,
});

export const ROLES: Option[] = [
  o("farmer", "Farmer, SHG or entrepreneur", "शेतकरी, बचत गट किंवा उद्योजक"),
  o("mitra", "Gaon Mandi Mitra", "गाव मंडी मित्र"),
  o("buyer", "Buyer / trader / processor", "खरेदीदार / व्यापारी / प्रक्रिया उद्योग"),
  o("admin", "Admin / field coordinator", "प्रशासक / क्षेत्र समन्वयक"),
];

export const GENDERS: Option[] = [
  o("female", "Woman", "स्त्री"),
  o("male", "Man", "पुरुष"),
  o("other", "Other", "इतर"),
  o("na", "Prefer not to say", "सांगायचे नाही"),
];

export const AGE_GROUPS: Option[] = [
  o("18-25", "18–25", "18–25"),
  o("26-35", "26–35", "26–35"),
  o("36-45", "36–45", "36–45"),
  o("46-60", "46–60", "46–60"),
  o("60+", "Above 60", "60 पेक्षा जास्त"),
];

export const EDUCATION: Option[] = [
  o("none", "No schooling", "शिक्षण नाही"),
  o("primary", "Up to 7th", "7वी पर्यंत"),
  o("10th", "10th", "10वी"),
  o("12th", "12th", "12वी"),
  o("graduate", "Graduate or above", "पदवी किंवा अधिक"),
];

export const DISTRICTS: Option[] = [
  o("Ahilyanagar", "Ahilyanagar", "अहिल्यानगर"),
  o("Akola", "Akola", "अकोला"),
  o("Amravati", "Amravati", "अमरावती"),
  o("Beed", "Beed", "बीड"),
  o("Bhandara", "Bhandara", "भंडारा"),
  o("Buldhana", "Buldhana", "बुलढाणा"),
  o("Chandrapur", "Chandrapur", "चंद्रपूर"),
  o("Chhatrapati Sambhajinagar", "Chhatrapati Sambhajinagar", "छत्रपती संभाजीनगर"),
  o("Dharashiv", "Dharashiv", "धाराशिव"),
  o("Dhule", "Dhule", "धुळे"),
  o("Gadchiroli", "Gadchiroli", "गडचिरोली"),
  o("Gondia", "Gondia", "गोंदिया"),
  o("Hingoli", "Hingoli", "हिंगोली"),
  o("Jalgaon", "Jalgaon", "जळगाव"),
  o("Jalna", "Jalna", "जालना"),
  o("Kolhapur", "Kolhapur", "कोल्हापूर"),
  o("Latur", "Latur", "लातूर"),
  o("Mumbai City", "Mumbai City", "मुंबई शहर"),
  o("Mumbai Suburban", "Mumbai Suburban", "मुंबई उपनगर"),
  o("Nagpur", "Nagpur", "नागपूर"),
  o("Nanded", "Nanded", "नांदेड"),
  o("Nandurbar", "Nandurbar", "नंदुरबार"),
  o("Nashik", "Nashik", "नाशिक"),
  o("Palghar", "Palghar", "पालघर"),
  o("Parbhani", "Parbhani", "परभणी"),
  o("Pune", "Pune", "पुणे"),
  o("Raigad", "Raigad", "रायगड"),
  o("Ratnagiri", "Ratnagiri", "रत्नागिरी"),
  o("Sangli", "Sangli", "सांगली"),
  o("Satara", "Satara", "सातारा"),
  o("Sindhudurg", "Sindhudurg", "सिंधुदुर्ग"),
  o("Solapur", "Solapur", "सोलापूर"),
  o("Thane", "Thane", "ठाणे"),
  o("Wardha", "Wardha", "वर्धा"),
  o("Washim", "Washim", "वाशिम"),
  o("Yavatmal", "Yavatmal", "यवतमाळ"),
];

export const IRRIGATION: Option[] = [
  o("rainfed", "Rain only", "फक्त पावसावर"),
  o("well", "Open well", "विहीर"),
  o("borewell", "Borewell", "बोअरवेल"),
  o("canal", "Canal", "कालवा"),
  o("drip", "Drip / sprinkler", "ठिबक / तुषार"),
  o("farm-pond", "Farm pond", "शेततळे"),
];

export const CROP_OPTIONS: Option[] = [
  o("Onion", "Onion", "कांदा"),
  o("Tomato", "Tomato", "टोमॅटो"),
  o("Soybean", "Soybean", "सोयाबीन"),
  o("Sugarcane", "Sugarcane", "ऊस"),
  o("Pomegranate", "Pomegranate", "डाळिंब"),
  o("Grapes", "Grapes", "द्राक्षे"),
  o("Jowar", "Jowar", "ज्वारी"),
  o("Bajra", "Bajra", "बाजरी"),
  o("Wheat", "Wheat", "गहू"),
  o("Cotton", "Cotton", "कापूस"),
  o("Tur", "Tur", "तूर"),
  o("Groundnut", "Groundnut", "भुईमूग"),
  o("Mango", "Mango", "आंबा"),
  o("Vegetables", "Vegetables", "भाजीपाला"),
];

export const LIVESTOCK: Option[] = [
  o("cow", "Cows", "गायी"),
  o("buffalo", "Buffaloes", "म्हशी"),
  o("goat", "Goats / sheep", "शेळ्या / मेंढ्या"),
  o("poultry", "Poultry", "कोंबड्या"),
  o("none", "None", "काहीही नाही"),
];

export const SELLS_VIA: Option[] = [
  o("apmc", "APMC mandi", "बाजार समिती"),
  o("trader", "Local trader", "स्थानिक व्यापारी"),
  o("direct", "Directly to customers", "थेट ग्राहकांना"),
  o("fpo", "FPO / cooperative", "शेतकरी कंपनी / सहकारी संस्था"),
  o("own-use", "Mostly own use", "बहुतेक घरच्या वापरासाठी"),
];

export const INTERESTS: Option[] = [
  o("schemes", "Government schemes", "शासकीय योजना"),
  o("selling", "Better selling price", "चांगला विक्री दर"),
  o("business", "Starting a business", "व्यवसाय सुरू करणे"),
  o("training", "Training", "प्रशिक्षण"),
  o("loan", "Loans / credit info", "कर्जाची माहिती"),
];

export const PHONE_ACCESS: Option[] = [
  o("own", "My own smartphone", "माझा स्वतःचा स्मार्टफोन"),
  o("family", "Family member’s phone", "घरातील व्यक्तीचा फोन"),
  o("basic", "Basic phone only", "साधा फोन"),
];

export const VEHICLES: Option[] = [
  o("bike", "Two-wheeler", "दुचाकी"),
  o("tempo", "Tempo / pickup", "टेम्पो / पिकअप"),
  o("tractor", "Tractor trolley", "ट्रॅक्टर ट्रॉली"),
  o("hire", "Hire when needed", "गरजेनुसार भाड्याने"),
];

export const BUSINESS_TYPES: Option[] = [
  o("Trader", "Trader", "व्यापारी"),
  o("Processor", "Processor", "प्रक्रिया उद्योग"),
  o("Retailer", "Retailer", "किरकोळ विक्रेता"),
  o("Wholesaler", "Wholesaler", "घाऊक विक्रेता"),
  o("Exporter", "Exporter", "निर्यातदार"),
];

export const LANGUAGES: Option[] = [o("mr", "Marathi", "मराठी"), o("hi", "Hindi", "हिंदी"), o("en", "English", "इंग्रजी")];

export const CONTACT_VIA: Option[] = [
  o("call", "Phone call", "फोन कॉल"),
  o("sms", "SMS", "एसएमएस"),
  o("whatsapp", "WhatsApp", "व्हॉट्सॲप"),
  o("visit", "Mitra visit", "मित्राची भेट"),
];

export const BEST_TIME: Option[] = [
  o("morning", "Morning", "सकाळी"),
  o("afternoon", "Afternoon", "दुपारी"),
  o("evening", "Evening", "संध्याकाळी"),
];

export const optionLabel = (opts: Option[], value: string): Bi | undefined => opts.find((x) => x.value === value)?.label;

export async function hashPin(mobile: string, pin: string): Promise<string> {
  const data = new TextEncoder().encode(`udyamsetu:${mobile}:${pin}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Farmer profile used across the app, derived from the sign-up answers. */
export function profileFromAccount(a: Account): FarmerProfile {
  const acres = (Number(a.landOwnedAcres) || 0) + (Number(a.landLeasedAcres) || 0);
  const district = optionLabel(DISTRICTS, a.district) ?? a.district;
  return {
    name: a.name,
    village: a.village,
    district,
    crops: a.crops,
    landholding: acres <= 0 ? "" : acres < 2.47 ? "under-1ha" : acres <= 4.94 ? "1-2ha" : "over-2ha",
    womenLed: a.gender === "female" || a.shgMember,
    consent: a.consentData,
  };
}
