import type { Lang } from "./types";

// Marathi text should be reviewed by a native speaker during pilot usability testing.

/** Bilingual text. Seed content carries both languages; text a user types is stored as a plain string. */
export type Bi = { en: string; mr: string };
export type Text = string | Bi;

export const bi = (en: string, mr: string): Bi => ({ en, mr });

/** Keep the bilingual original when the user left a pre-filled field unchanged (in either language). */
export function keepText(typed: string, orig: Text): Text {
  if (typeof orig !== "string" && (typed === orig.en || typed === orig.mr)) return orig;
  return typed === orig ? orig : typed;
}

export function tx(lang: Lang, t: Text | undefined | null): string {
  if (t == null) return "";
  return typeof t === "string" ? t : t[lang];
}

/** Display labels for fixed values (statuses, crops, categories…). Stored values stay in English. */
const LABELS: Record<string, string> = {
  // listing / lot / offer statuses
  Submitted: "नोंदवले",
  "With Mitra": "मित्राकडे",
  "In lot": "लॉटमध्ये",
  "Offer received": "ऑफर आली",
  Accepted: "स्वीकारले",
  Dispatched: "रवाना",
  Completed: "पूर्ण",
  Cancelled: "रद्द",
  Declined: "नाकारले",
  "Open for offers": "ऑफरसाठी खुला",
  "Offer accepted": "ऑफर स्वीकारली",
  // scheme tracker
  Interested: "इच्छुक",
  "Preparing documents": "कागदपत्रे तयार करत आहे",
  Applied: "अर्ज केला",
  Approved: "मंजूर",
  Rejected: "नामंजूर",
  "Needs follow-up": "पाठपुरावा आवश्यक",
  // enquiries / reports
  New: "नवीन",
  Replied: "उत्तर दिले",
  Closed: "बंद",
  Open: "प्रलंबित",
  Resolved: "सोडवले",
  // crops
  Onion: "कांदा",
  Tomato: "टोमॅटो",
  Soybean: "सोयाबीन",
  Pomegranate: "डाळिंब",
  Jowar: "ज्वारी",
  Groundnut: "भुईमूग",
  Mango: "आंबा",
  Nachni: "नाचणी",
  Sugarcane: "ऊस",
  Grapes: "द्राक्षे",
  Bajra: "बाजरी",
  Wheat: "गहू",
  Cotton: "कापूस",
  Tur: "तूर",
  Vegetables: "भाजीपाला",
  Exporter: "निर्यातदार",
  // scheme categories and levels
  "Income support": "उत्पन्न सहाय्य",
  "Crop insurance": "पीक विमा",
  Credit: "कर्ज",
  Irrigation: "सिंचन",
  Mechanisation: "यांत्रिकीकरण",
  "Women & SHG": "महिला व बचत गट",
  "Food processing": "अन्न प्रक्रिया",
  Central: "केंद्र सरकार",
  Maharashtra: "महाराष्ट्र शासन",
  All: "सर्व",
  // buyer types
  Trader: "व्यापारी",
  Processor: "प्रक्रिया उद्योग",
  Retailer: "किरकोळ विक्रेता",
  Wholesaler: "घाऊक विक्रेता",
  // grades
  A: "अ",
  B: "ब",
  C: "क",
  Ungraded: "श्रेणी ठरलेली नाही",
};

export function label(lang: Lang, value: string): string {
  return lang === "mr" ? (LABELS[value] ?? value) : value;
}

export function fmtDate(lang: Lang, iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
