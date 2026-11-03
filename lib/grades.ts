/**
 * Mandi Mitra crop grades: the market grade names farmers already use, with a plain way to check
 * each at home. The farmer picks a grade (or "don't know"); the Mitra confirms it before pooling.
 * Grade names and order vary by market — every crop screen says so. "draft" crops still need
 * confirming with traders. Sizes are shown as pictures, never asked as numbers.
 *
 *   npm run check:grades
 */
import type { Bi } from "./i18n";

export type Unit = "quintal" | "kg" | "10kg" | "crate20kg";

export interface GradeOption {
  /** stable forever, `${cropId}.${grade}`, e.g. "onion.super_gole" */
  code: string;
  name: Bi;
  /** other names heard in mandis */
  localNames: string[];
  /** 1–2 plain sentences a farmer can check at home */
  howToIdentify: Bi;
  /** 1 = best */
  rank: number;
  visual?: { kind: "size" | "stars" | "turmeric" | "flower"; level: number };
  /**
   * where this grade sits in a market's min–max band: estimated rate = min + pricePosition × (max − min).
   * TODO: draft values — tune with real auction data
   */
  pricePosition: number;
}

export interface CropGrading {
  /** matches the Crop Library id */
  cropId: string;
  name: Bi;
  emoji: string;
  /** card background tint */
  color: string;
  saleUnit: Unit;
  typeOptions?: { code: string; name: Bi }[];
  grades: GradeOption[];
  /** ask the farmer the one-tap "is it fully dry?" question */
  needsDryness: boolean;
  /** the Mitra must enter a moisture meter reading before pooling */
  moistureRequired: boolean;
  /** % — above this the Mitra screen suggests "needs drying" */
  moistureLimit?: number;
  notes: Bi;
  reviewStatus: "draft" | "confirmed";
  /** marketId → gradeCode → the name that market uses */
  marketNames?: Record<string, Record<string, string>>;
}

const b = (en: string, mr: string): Bi => ({ en, mr });

/** FAQ / non-FAQ for grains and pulses */
const faq = (crop: string, good: Bi, low: Bi): GradeOption[] => [
  { code: `${crop}.faq`, name: b("Good quality (FAQ)", "चांगला माल"), localNames: ["FAQ"], howToIdentify: good, pricePosition: 0.6, rank: 1, visual: { kind: "stars", level: 3 } },
  { code: `${crop}.non_faq`, name: b("Lower quality (non-FAQ)", "कमी प्रत"), localNames: ["Non-FAQ"], howToIdentify: low, pricePosition: 0.2, rank: 2, visual: { kind: "stars", level: 1 } },
];

export const GRADINGS: CropGrading[] = [
  {
    cropId: "onion",
    name: b("Onion", "कांदा"),
    emoji: "🧅",
    color: "#f6e2ea",
    saleUnit: "10kg",
    grades: [
      { code: "onion.super_gole", name: b("Super gole", "सुपर गोळे"), localNames: ["नंबर १", "गोळा", "Super"], howToIdentify: b("Big, round, firm, with a dry neck (about 5.5 cm or more).", "मोठा, गोल, टणक, मान वाळलेली (साधारण ५.५ सेमी किंवा जास्त)."), pricePosition: 0.9, rank: 1, visual: { kind: "size", level: 5 } },
      { code: "onion.super_mukkal", name: b("Super mukkal", "सुपर मुक्कल"), localNames: [], howToIdentify: b("Good quality, a little smaller.", "चांगला माल, थोडा लहान."), pricePosition: 0.75, rank: 2, visual: { kind: "size", level: 4 } },
      { code: "onion.no2", name: b("No. 2 / medium", "नंबर २ / मध्यम"), localNames: ["अवरेज-मेडियम"], howToIdentify: b("Medium size (about 4.5–5.5 cm).", "मध्यम आकार (साधारण ४.५–५.५ सेमी)."), pricePosition: 0.55, rank: 3, visual: { kind: "size", level: 3 } },
      { code: "onion.no3", name: b("No. 3", "नंबर ३"), localNames: [], howToIdentify: b("Smaller or uneven.", "लहान किंवा असमान."), pricePosition: 0.35, rank: 4, visual: { kind: "size", level: 2 } },
      { code: "onion.golti", name: b("Golti", "गोल्टी / गोल्टा"), localNames: ["नंबर ४"], howToIdentify: b("Small (about 2.5–4.5 cm).", "लहान (साधारण २.५–४.५ सेमी)."), pricePosition: 0.25, rank: 5, visual: { kind: "size", level: 1 } },
      { code: "onion.chingli", name: b("Badla / chingli", "बदला / चिंगळी"), localNames: [], howToIdentify: b("Very small or damaged.", "खूप लहान किंवा खराब."), pricePosition: 0.1, rank: 6, visual: { kind: "size", level: 0 } },
      { code: "onion.jod", name: b("Jod (double)", "जोड कांदा"), localNames: ["Joint", "Double"], howToIdentify: b("Double or split bulbs.", "जोडलेले किंवा फुटलेले कांदे."), pricePosition: 0.05, rank: 7, visual: { kind: "size", level: 3 } },
    ],
    needsDryness: false,
    moistureRequired: false,
    // TODO: confirm "फणगड" and "दागी" with Mitras
    notes: b("Sort grades separately before selling.", "विकण्यापूर्वी प्रत वेगवेगळी करा."),
    reviewStatus: "confirmed",
    marketNames: { lasalgaon: { "onion.golti": "गोल्टी" }, pune: { "onion.golti": "नंबर ४" } },
  },
  {
    cropId: "tomato",
    name: b("Tomato", "टोमॅटो"),
    emoji: "🍅",
    color: "#fbe1dc",
    saleUnit: "crate20kg",
    typeOptions: [
      { code: "tomato.hybrid", name: b("Hybrid", "हायब्रीड") },
      { code: "tomato.gavthi", name: b("Local (gavthi)", "गावठी") },
    ],
    grades: [
      { code: "tomato.no1", name: b("No. 1", "नंबर १"), localNames: [], howToIdentify: b("Red, firm, thick skin, even size.", "लाल, टणक, जाड साल, एकसारखा आकार."), pricePosition: 0.9, rank: 1, visual: { kind: "size", level: 4 } },
      { code: "tomato.no2", name: b("No. 2", "नंबर २"), localNames: [], howToIdentify: b("Mixed size or softer.", "मिश्र आकार किंवा थोडा मऊ."), pricePosition: 0.475, rank: 2, visual: { kind: "size", level: 3 } },
      { code: "tomato.no3", name: b("No. 3", "नंबर ३"), localNames: [], howToIdentify: b("Small, cracked or over-ripe.", "लहान, तडकलेला किंवा जास्त पिकलेला."), pricePosition: 0.05, rank: 3, visual: { kind: "size", level: 1 } },
    ],
    needsDryness: false,
    moistureRequired: false,
    notes: b("Pack each grade in its own crates.", "प्रत्येक प्रत वेगळ्या क्रेटमध्ये भरा."),
    reviewStatus: "confirmed",
  },
  {
    cropId: "soybean",
    name: b("Soybean", "सोयाबीन"),
    emoji: "🫘",
    color: "#f3ecd2",
    saleUnit: "quintal",
    grades: faq("soybean", b("Clean, dry, few damaged or green seeds.", "स्वच्छ, कोरडा, खराब किंवा हिरवे दाणे कमी."), b("More dirt, damaged or green seeds.", "जास्त माती, खराब किंवा हिरवे दाणे.")),
    needsDryness: true,
    moistureRequired: true,
    moistureLimit: 12,
    notes: b("Dry soybean gets a better rate.", "वाळलेल्या सोयाबीनला चांगला दर मिळतो."),
    reviewStatus: "confirmed",
  },
  {
    cropId: "cotton",
    name: b("Cotton", "कापूस"),
    emoji: "☁️",
    color: "#eef1f5",
    saleUnit: "quintal",
    grades: faq("cotton", b("Clean, white and dry.", "स्वच्छ, पांढरा व कोरडा."), b("Stained, with trash, or damp.", "डागाळलेला, कचरा असलेला किंवा ओलसर.")),
    needsDryness: true,
    moistureRequired: true,
    moistureLimit: 12,
    notes: b("To sell to CCI, register on the Kapas Kisan app; dry cotton gets the full rate.", "CCI ला विकण्यासाठी कपास किसान ॲपवर नोंदणी करा; कोरड्या कापसाला पूर्ण दर मिळतो."),
    reviewStatus: "confirmed",
  },
  {
    cropId: "tur",
    name: b("Tur", "तूर"),
    emoji: "🟤",
    color: "#f4e6d4",
    saleUnit: "quintal",
    typeOptions: [
      { code: "tur.lal", name: b("Red", "लाल") },
      { code: "tur.pandhari", name: b("White", "पांढरी") },
    ],
    grades: faq("tur", b("Clean, dry, bold grains, few damaged.", "स्वच्छ, कोरडे, टपोरे दाणे, खराब कमी."), b("More dirt, broken or damaged grains.", "जास्त माती, तुटलेले किंवा खराब दाणे.")),
    needsDryness: true,
    moistureRequired: false,
    moistureLimit: 12,
    notes: b("Grade names vary by market — your Mitra will confirm.", "प्रतीची नावे बाजारानुसार बदलतात — मित्र खात्री करतील."),
    reviewStatus: "confirmed",
  },
  {
    cropId: "chana",
    name: b("Chana", "हरभरा"),
    emoji: "🟡",
    color: "#f7edcf",
    saleUnit: "quintal",
    typeOptions: [
      { code: "chana.chafa", name: b("Chafa", "चाफा") },
      { code: "chana.katya", name: b("Katya", "काट्या") },
      { code: "chana.lal", name: b("Red", "लाल") },
      { code: "chana.sankarit", name: b("Hybrid", "संकरित") },
    ],
    grades: faq("chana", b("Clean, dry, bold grains, few damaged.", "स्वच्छ, कोरडे, टपोरे दाणे, खराब कमी."), b("More dirt, broken or damaged grains.", "जास्त माती, तुटलेले किंवा खराब दाणे.")),
    needsDryness: true,
    moistureRequired: false,
    moistureLimit: 12,
    notes: b("Grade names vary by market — your Mitra will confirm.", "प्रतीची नावे बाजारानुसार बदलतात — मित्र खात्री करतील."),
    reviewStatus: "confirmed",
  },
  {
    cropId: "jowar",
    name: b("Jowar", "ज्वारी"),
    emoji: "🌾",
    color: "#f3ead6",
    saleUnit: "quintal",
    typeOptions: [
      { code: "jowar.maldandi", name: b("Maldandi", "मालदांडी") },
      { code: "jowar.hybrid", name: b("Hybrid", "हायब्रीड") },
      { code: "jowar.talki", name: b("Talki", "टालकी") },
      { code: "jowar.pandhari", name: b("White", "पांढरी") },
    ],
    grades: [
      { code: "jowar.no1", name: b("No. 1", "नंबर १"), localNames: [], howToIdentify: b("Bold, clean, even grains.", "टपोरे, स्वच्छ, एकसारखे दाणे."), pricePosition: 0.6, rank: 1, visual: { kind: "stars", level: 3 } },
      { code: "jowar.no2", name: b("No. 2", "नंबर २"), localNames: [], howToIdentify: b("Mixed or slightly discoloured grains.", "मिश्र किंवा थोडे रंग बदललेले दाणे."), pricePosition: 0.2, rank: 2, visual: { kind: "stars", level: 1 } },
    ],
    needsDryness: true,
    moistureRequired: false,
    moistureLimit: 12,
    notes: b("Grade names vary by market — your Mitra will confirm.", "प्रतीची नावे बाजारानुसार बदलतात — मित्र खात्री करतील."),
    reviewStatus: "confirmed",
  },
  {
    cropId: "pomegranate",
    name: b("Pomegranate", "डाळिंब"),
    emoji: "🔴",
    color: "#f8dcdc",
    saleUnit: "kg",
    grades: [
      { code: "pomegranate.no1", name: b("No. 1", "नंबर १"), localNames: ["Super", "King"], howToIdentify: b("Large, deep red, no spots.", "मोठे, गडद लाल, डाग नाहीत."), pricePosition: 0.9, rank: 1, visual: { kind: "size", level: 5 } },
      { code: "pomegranate.no2", name: b("No. 2", "नंबर २"), localNames: ["Queen"], howToIdentify: b("Medium, good colour.", "मध्यम, चांगला रंग."), pricePosition: 0.6, rank: 2, visual: { kind: "size", level: 4 } },
      { code: "pomegranate.no3", name: b("No. 3", "नंबर ३"), localNames: ["Prince", "12-A"], howToIdentify: b("Smaller, or 1–2 spots.", "लहान, किंवा १–२ डाग."), pricePosition: 0.3, rank: 3, visual: { kind: "size", level: 2 } },
      { code: "pomegranate.no4", name: b("No. 4", "नंबर ४"), localNames: ["12-B"], howToIdentify: b("Small, spotted or cracked.", "लहान, डाग असलेले किंवा तडकलेले."), pricePosition: 0.05, rank: 4, visual: { kind: "size", level: 1 } },
    ],
    needsDryness: false,
    moistureRequired: false,
    notes: b("Grade names vary by market — your Mitra will confirm.", "प्रतीची नावे बाजारानुसार बदलतात — मित्र खात्री करतील."),
    reviewStatus: "confirmed",
  },
  {
    cropId: "turmeric",
    name: b("Turmeric", "हळद"),
    emoji: "🟠",
    color: "#fbe9c8",
    saleUnit: "quintal",
    typeOptions: [
      { code: "turmeric.rajapuri", name: b("Rajapuri (local)", "राजापुरी") },
      { code: "turmeric.parpeth", name: b("Parpeth (from outside)", "परपेठ") },
    ],
    grades: [
      { code: "turmeric.lagdi", name: b("Lagdi", "लगडी"), localNames: [], howToIdentify: b("Long, bold, polished fingers.", "लांब, टपोरे, पॉलिश केलेले हळकुंड."), pricePosition: 0.9, rank: 1, visual: { kind: "turmeric", level: 3 } },
      { code: "turmeric.madhyam", name: b("Medium", "मध्यम"), localNames: [], howToIdentify: b("Medium fingers.", "मध्यम हळकुंड."), pricePosition: 0.73, rank: 2, visual: { kind: "turmeric", level: 2 } },
      { code: "turmeric.mukra_gattha", name: b("Mukra gattha", "मुक्रा गठ्ठा"), localNames: [], howToIdentify: b("Short, round bulbs.", "आखूड, गोल गठ्ठे."), pricePosition: 0.56, rank: 3, visual: { kind: "turmeric", level: 1 } },
      { code: "turmeric.gattha_2", name: b("Gattha No. 2", "गठ्ठा नं २"), localNames: [], howToIdentify: b("Smaller or mixed bulbs.", "लहान किंवा मिश्र गठ्ठे."), pricePosition: 0.39, rank: 4, visual: { kind: "turmeric", level: 1 } },
      { code: "turmeric.kani", name: b("Kani", "कणी"), localNames: [], howToIdentify: b("Broken small pieces.", "तुटलेले लहान तुकडे."), pricePosition: 0.22, rank: 5, visual: { kind: "turmeric", level: 0 } },
      { code: "turmeric.powder", name: b("Powder quality", "पावडर क्वालिटी"), localNames: [], howToIdentify: b("Fit only for grinding into powder.", "फक्त पावडर करण्यायोग्य."), pricePosition: 0.05, rank: 6, visual: { kind: "turmeric", level: 0 } },
    ],
    needsDryness: true,
    moistureRequired: false,
    moistureLimit: 10,
    // draft: confirm the order with Sangli / Hingoli traders
    notes: b("Also sold in 50 kg bags (pote). Grade order still being confirmed with traders.", "५० किलोच्या पोत्यातही विकली जाते. प्रतींचा क्रम व्यापाऱ्यांकडून अजून खात्री करायचा आहे."),
    reviewStatus: "draft",
  },
  {
    cropId: "marigold",
    name: b("Marigold", "झेंडू"),
    emoji: "🌼",
    color: "#fdeccb",
    saleUnit: "kg",
    typeOptions: [
      { code: "marigold.pivla", name: b("Yellow", "पिवळा") },
      { code: "marigold.keshri", name: b("Orange", "केशरी") },
    ],
    grades: [
      { code: "marigold.no1", name: b("No. 1", "नंबर १"), localNames: [], howToIdentify: b("Big, fresh, bright, picked the same day.", "मोठी, ताजी, चमकदार, त्याच दिवशी तोडलेली."), pricePosition: 0.9, rank: 1, visual: { kind: "flower", level: 3 } },
      { code: "marigold.no2", name: b("No. 2", "नंबर २"), localNames: [], howToIdentify: b("Medium or slightly wilted.", "मध्यम किंवा थोडी कोमेजलेली."), pricePosition: 0.475, rank: 2, visual: { kind: "flower", level: 2 } },
      { code: "marigold.no3", name: b("No. 3", "नंबर ३"), localNames: [], howToIdentify: b("Small or old.", "लहान किंवा जुनी."), pricePosition: 0.05, rank: 3, visual: { kind: "flower", level: 1 } },
    ],
    needsDryness: false,
    moistureRequired: false,
    // draft: confirm with Pune Gultekdi / Dadar flower traders
    notes: b("Grade names still being confirmed with flower traders.", "प्रतीची नावे फूल व्यापाऱ्यांकडून अजून खात्री करायची आहेत."),
    reviewStatus: "draft",
  },
];

export const VARIES_NOTE = b("Grade names vary by market — your Mitra will confirm.", "प्रतीची नावे बाजारानुसार बदलतात — मित्र खात्री करतील.");
export const UNSURE = "unsure";

export const gradingFor = (cropId: string) => GRADINGS.find((g) => g.cropId === cropId);
export const gradeFor = (code: string | undefined) => (code ? GRADINGS.flatMap((g) => g.grades).find((x) => x.code === code) : undefined);
export const typeFor = (code: string | undefined) => (code ? GRADINGS.flatMap((g) => g.typeOptions ?? []).find((x) => x.code === code) : undefined);
/** crops in the library but not in GRADINGS (old listings) still get a name */
export const cropName = (cropId: string): Bi => gradingFor(cropId)?.name ?? b(cropId.charAt(0).toUpperCase() + cropId.slice(1), cropId);
/** the lowest grade of its crop: the Mitra screen suggests "low grade" for it */
export const isLowestGrade = (code: string) => {
  const g = GRADINGS.find((c) => c.grades.some((x) => x.code === code));
  return !!g && g.grades.length > 1 && Math.max(...g.grades.map((x) => x.rank)) === gradeFor(code)?.rank;
};
/** the name a market uses for a grade, when it differs */
export const marketName = (cropId: string, market: string, code: string) => gradingFor(cropId)?.marketNames?.[market]?.[code];

const KG: Record<Unit, number> = { quintal: 100, kg: 1, "10kg": 10, crate20kg: 20 };
/** convert a quantity between units (via kg) */
export const convert = (qty: number, from: Unit, to: Unit) => (qty * KG[from]) / KG[to];
export const toQuintals = (qty: number, unit: Unit) => convert(qty, unit, "quintal");

export const UNIT_NAME: Record<Unit, Bi> = {
  quintal: b("quintal", "क्विंटल"),
  kg: b("kg", "किलो"),
  "10kg": b("10 kg", "१० किलो"),
  crate20kg: b("crate (20 kg)", "क्रेट (२० किलो)"),
};
export const UNIT_SHORT: Record<Unit, Bi> = {
  quintal: b("qtl", "क्विं."),
  kg: b("kg", "किलो"),
  "10kg": b("10 kg", "१० किलो"),
  crate20kg: b("crate", "क्रेट"),
};
