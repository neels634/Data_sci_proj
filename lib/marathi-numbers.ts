/**
 * Marathi numbers for display and for speech. Pure functions — no React, no browser APIs — so the
 * checks in lib/marathi-numbers.check.ts run under plain `node`.
 *
 * TODO(pilot): a native Marathi speaker must review the number words, ordinals and fraction words.
 */

// ---- digits for display ----------------------------------------------------------------

const DEVANAGARI_DIGITS = "०१२३४५६७८९";

/** "१२.५" → "12.5" so number fields understand Marathi digits (typed or spoken). */
export function toAsciiDigits(s: string) {
  return s.replace(/[०-९]/g, (d) => String(DEVANAGARI_DIGITS.indexOf(d)));
}

/** "12.5" → "१२.५" */
export function toDevanagariDigits(s: string) {
  return s.replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

/** Number for display: Devanagari digits and Indian grouping in Marathi (१,२५,०००). */
export function fmtNum(lang: "en" | "mr", n: number, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(lang === "mr" ? "mr-IN-u-nu-deva" : "en-IN", opts).format(n);
}

// ---- numbers → words ---------------------------------------------------------------------

/** Marathi 0–99 are irregular, so they are listed one by one (index = number). */
// prettier-ignore
const ONES_TO_99 = ["शून्य","एक","दोन","तीन","चार","पाच","सहा","सात","आठ","नऊ","दहा",
"अकरा","बारा","तेरा","चौदा","पंधरा","सोळा","सतरा","अठरा","एकोणीस","वीस",
"एकवीस","बावीस","तेवीस","चोवीस","पंचवीस","सव्वीस","सत्तावीस","अठ्ठावीस","एकोणतीस","तीस",
"एकतीस","बत्तीस","तेहेतीस","चौतीस","पस्तीस","छत्तीस","सदतीस","अडतीस","एकोणचाळीस","चाळीस",
"एक्केचाळीस","बेचाळीस","त्रेचाळीस","चव्वेचाळीस","पंचेचाळीस","सेहेचाळीस","सत्तेचाळीस","अठ्ठेचाळीस","एकोणपन्नास","पन्नास",
"एक्कावन्न","बावन्न","त्रेपन्न","चोपन्न","पंचावन्न","छप्पन्न","सत्तावन्न","अठ्ठावन्न","एकोणसाठ","साठ",
"एकसष्ट","बासष्ट","त्रेसष्ट","चौसष्ट","पासष्ट","सहासष्ट","सदुसष्ट","अडुसष्ट","एकोणसत्तर","सत्तर",
"एकाहत्तर","बाहत्तर","त्र्याहत्तर","चौऱ्याहत्तर","पंच्याहत्तर","शहात्तर","सत्याहत्तर","अठ्ठ्याहत्तर","एकोणऐंशी","ऐंशी",
"एक्याऐंशी","ब्याऐंशी","त्र्याऐंशी","चौऱ्याऐंशी","पंच्याऐंशी","शहाऐंशी","सत्त्याऐंशी","अठ्ठ्याऐंशी","एकोणनव्वद","नव्वद",
"एक्याण्णव","ब्याण्णव","त्र्याण्णव","चौऱ्याण्णव","पंच्याण्णव","शहाण्णव","सत्त्याण्णव","अठ्ठ्याण्णव","नव्व्याण्णव"];
// TODO: native Marathi speaker to review spellings before pilot.

if (typeof process !== "undefined" && process.env.NODE_ENV !== "production" && ONES_TO_99.length !== 100)
  console.warn(`[marathi-numbers] ONES_TO_99 has ${ONES_TO_99.length} entries, expected 100`);

function below1000(n: number): string {
  if (n < 100) return ONES_TO_99[n];
  const h = Math.floor(n / 100);
  const r = n % 100;
  const head = h === 1 ? (r === 0 ? "शंभर" : "एकशे") : `${ONES_TO_99[h]}शे`;
  return r ? `${head} ${ONES_TO_99[r]}` : head;
}

export const MAX_WORDS = 99_99_99_999;

/** Integer 0 – 99,99,99,999 in Marathi words, Indian system (हजार, लाख, कोटी). */
export function numberToMarathiWords(n: number): string {
  if (!Number.isFinite(n)) return "";
  if (n < 0) return `उणे ${numberToMarathiWords(-n)}`;
  n = Math.floor(n);
  if (n > MAX_WORDS) return digitsToWords(String(n));
  if (n === 0) return ONES_TO_99[0];
  const crore = Math.floor(n / 1e7);
  const lakh = Math.floor((n % 1e7) / 1e5);
  const thousand = Math.floor((n % 1e5) / 1e3);
  const rest = n % 1000;
  const parts: string[] = [];
  if (crore) parts.push(`${ONES_TO_99[crore]} कोटी`);
  if (lakh) parts.push(`${ONES_TO_99[lakh]} लाख`);
  if (thousand) parts.push(`${ONES_TO_99[thousand]} हजार`);
  if (rest) parts.push(below1000(rest));
  return parts.join(" ");
}

/** "1551" → "एक पाच पाच एक" — for phone numbers and very long numbers. */
export function digitsToWords(digits: string): string {
  return digits
    .replace(/\D/g, "")
    .split("")
    .map((d) => ONES_TO_99[Number(d)])
    .join(" ");
}

/**
 * A number as farmers say it. Quarters and halves use their own words (पाव, अर्धा, पाऊण, सव्वा,
 * दीड, अडीच, साडे…, पावणे…); other decimals are read "<int> पूर्णांक <digit by digit>".
 * Takes the number as written so "12.30" keeps its digits.
 */
export function spokenNumber(written: string): string {
  const clean = written.replace(/,/g, "");
  if (!/^\d+(\.\d+)?$/.test(clean)) return written;
  const [intPart, decPart = ""] = clean.split(".");
  const int = Number(intPart);
  const frac = decPart ? Number(`0.${decPart}`) : 0;
  if (!frac) return numberToMarathiWords(int);
  const w = numberToMarathiWords(int);
  const single = !w.includes(" "); // "साडेतीन" reads naturally; "साडे एकशे पंचवीस" does not
  if (frac === 0.5) {
    if (int === 0) return "अर्धा";
    if (int === 1) return "दीड";
    if (int === 2) return "अडीच";
    if (single) return `साडे${w}`;
  }
  if (frac === 0.25) {
    if (int === 0) return "पाव";
    if (int === 1) return "सव्वा";
    if (single) return `सव्वा ${w}`;
  }
  if (frac === 0.75) {
    if (int === 0) return "पाऊण";
    const next = numberToMarathiWords(int + 1);
    if (!next.includes(" ")) return `पावणे${next}`;
  }
  return `${w} पूर्णांक ${digitsToWords(decPart)}`;
}

const ORDINAL_1_TO_10 = ["", "पहिला", "दुसरा", "तिसरा", "चौथा", "पाचवा", "सहावा", "सातवा", "आठवा", "नववा", "दहावा"];

/**
 * "45" → "पंचेचाळिसावा" (45th). Rule-based for numbers above 10; reviewed forms only.
 * TODO(pilot): native speaker to confirm forms above 100.
 */
export function ordinalMr(n: number): string {
  if (n >= 1 && n <= 10) return ORDINAL_1_TO_10[n];
  const words = numberToMarathiWords(n).split(" ");
  let last = words.pop()!;
  if (/ीस$/.test(last)) last = `${last.replace(/ीस$/, "िस")}ावा`; // वीस → विसावा, चाळीस → चाळिसावा
  else if (/[ािीुूृेैोौ]$|[अआइईउऊएऐओऔ]$/.test(last)) last = `${last}वा`; // बारा → बारावा, ऐंशी → ऐंशीवा
  else last = `${last}ावा`; // पन्नास → पन्नासावा, साठ → साठावा, शंभर → शंभरावा
  return [...words, last].join(" ");
}

// ---- making Marathi text speakable -----------------------------------------------------------

const MONTHS_MR = ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"];
const MONTHS_EN = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
/** Short Marathi month names that Intl produces ("ऑक्टो", "नोव्हें") → full names. */
const MONTH_SHORT_MR: Record<string, string> = {
  "जाने": "जानेवारी",
  "फेब्रु": "फेब्रुवारी",
  "एप्रि": "एप्रिल",
  "ऑग": "ऑगस्ट",
  "सप्टें": "सप्टेंबर",
  "ऑक्टो": "ऑक्टोबर",
  "नोव्हें": "नोव्हेंबर",
  "डिसें": "डिसेंबर",
};

/** Units after a number, longest spellings first. Matched case-insensitively. */
const UNITS: [string, string][] = [
  ["°c", "अंश सेल्सिअस"],
  ["quintals", "क्विंटल"],
  ["quintal", "क्विंटल"],
  ["qtl", "क्विंटल"],
  ["hectares", "हेक्टर"],
  ["hectare", "हेक्टर"],
  ["ha", "हेक्टर"],
  ["acres", "एकर"],
  ["acre", "एकर"],
  ["litres", "लिटर"],
  ["litre", "लिटर"],
  ["liters", "लिटर"],
  ["liter", "लिटर"],
  ["ltr", "लिटर"],
  ["l", "लिटर"],
  ["ml", "मिली"],
  ["kg", "किलो"],
  ["gm", "ग्रॅम"],
  ["g", "ग्रॅम"],
  ["cm", "सेंटिमीटर"],
  ["mm", "मिलिमीटर"],
  ["m", "मीटर"],
  ["days", "दिवस"],
  ["day", "दिवस"],
  ["hours", "तास"],
  ["hour", "तास"],
  ["hrs", "तास"],
  ["hr", "तास"],
  ["h", "तास"],
];

/** Latin abbreviations that appear in the app. Extend as needed. */
export const ABBREVIATIONS_MR: Record<string, string> = {
  KVK: "कृषी विज्ञान केंद्र",
  NPK: "एन पी के",
  SHG: "बचत गट",
  FPO: "शेतकरी उत्पादक कंपनी",
  APMC: "बाजार समिती",
  PIN: "पिन",
};

const NUM = String.raw`\d+(?:,\d+)*(?:\.\d+)?`;
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Turn Marathi UI text into what a speech engine should say: numbers, money, ranges, percents,
 * units, dates, phone numbers and abbreviations become Marathi words.
 *
 * Order differs slightly from the spec list on purpose: phone numbers and ISO dates are handled
 * before ranges, otherwise "1800-180-1551" and "2026-03-12" would be read as ranges.
 */
export function toSpokenMarathi(text: string, now: Date = new Date()): string {
  const year = now.getFullYear();
  // lists → sentences first, so "1." step numbers are dropped rather than read out
  let s = toAsciiDigits(text)
    .split(/\n+/)
    .map((line) => line.replace(/^\s*(?:[-•*·]|\d+[.)])\s+/, "").trim())
    .filter(Boolean)
    .join("। ");

  // phone numbers / helplines: digit by digit, never as one big number
  s = s.replace(/\b1800[-\s]?\d{3}[-\s]?\d{4}\b/g, (m) => ` ${digitsToWords(m)} `);
  s = s.replace(/\b\d{7,}\b/g, (m) => ` ${digitsToWords(m)} `);

  // dates
  s = s.replace(/\b(\d{4})-(\d{2})-(\d{2})\b/g, (_, y, m, d) => `${Number(d)} ${MONTHS_MR[Number(m) - 1] ?? m}${Number(y) === year ? "" : ` ${y}`}`);
  s = s.replace(new RegExp(String.raw`\b(\d{1,2})\s+(${MONTHS_EN.join("|")})[a-z]*\.?(?:,?\s+(\d{4}))?(?![a-z])`, "gi"), (_, d, m, y) => {
    const month = MONTHS_MR[MONTHS_EN.indexOf(String(m).toLowerCase().slice(0, 3))];
    return `${d} ${month}${y && Number(y) !== year ? ` ${y}` : ""}`;
  });
  for (const [short, full] of Object.entries(MONTH_SHORT_MR)) s = s.replace(new RegExp(`${escape(short)}(?![\\u0900-\\u097F])`, "g"), full);
  s = s.replace(new RegExp(`(${MONTHS_MR.join("|")}),?\\s+(\\d{4})\\b`, "g"), (_, m, y) => (Number(y) === year ? m : `${m} ${y}`));
  // "1 जानेवारी 2027 ते 21 जानेवारी 2027" → say the shared year once, at the end
  s = s.replace(new RegExp(`(\\d{1,2} (?:${MONTHS_MR.join("|")})) (\\d{4}) ते (\\d{1,2} (?:${MONTHS_MR.join("|")})) \\2\\b`, "g"), "$1 ते $3 $2");

  // "12 मार्च ते 25 मार्च" → "12 ते 25 मार्च"
  s = s.replace(new RegExp(`(\\d{1,2}) (${MONTHS_MR.join("|")}) ते (\\d{1,2}) \\2(?![\\u0900-\\u097F])`, "g"), "$1 ते $3 $2");

  // Marathi unit abbreviations used in the content
  s = s.replace(/सेंमी/g, "सेंटिमीटर").replace(/(?<![ऀ-ॿ])मिमी/g, "मिलिमीटर").replace(/क्विं\./g, "क्विंटल");
  // currency, optionally per unit: "₹30/qtl" → "30 रुपये प्रति क्विंटल"
  const unitAlt = UNITS.map(([u]) => escape(u)).join("|");
  s = s.replace(new RegExp(String.raw`(?:₹|\bRs\.?|\bINR)\s?(${NUM})(?:\s?\/\s?(${unitAlt}|क्विंटल|किलो|एकर|लिटर|हेक्टर))?(?![a-z])`, "gi"), (_, n, per) => {
    const unit = per ? (UNITS.find(([u]) => u === String(per).toLowerCase())?.[1] ?? per) : "";
    return `${n} रुपये${unit ? ` प्रति ${unit}` : ""}`;
  });

  // percent
  s = s.replace(new RegExp(String.raw`(${NUM})\s?%`, "g"), "$1 टक्के");

  // units after a number
  s = s.replace(new RegExp(String.raw`(${NUM})\s?(${unitAlt})(?![a-z])`, "gi"), (_, n, u) => `${n} ${UNITS.find(([x]) => x === String(u).toLowerCase())![1]}`);
  s = s.replace(/(\d)\s?°\s?C\b/g, "$1 अंश सेल्सिअस");

  // ranges: "12–25", "12-25", "12 ते 25" (not inside codes like N-2-4-1)
  s = s.replace(new RegExp(String.raw`(?<![\w\-./])(${NUM})\s?(?:–|—|-|\bto\b|ते)\s?(${NUM})(?![\w\-/])`, "g"), "$1 ते $2");

  // remaining numbers, with fractions read the way farmers say them
  s = s.replace(new RegExp(NUM, "g"), (m) => spokenNumber(m));

  // word–word dashes ("ऑक्टोबर–नोव्हेंबर") read as "ते"; spaced dashes are a pause
  s = s.replace(/([ऀ-ॿ])[–—]([ऀ-ॿ])/g, "$1 ते $2").replace(/\s[–—]\s/g, ", ");

  // abbreviations
  for (const [abbr, word] of Object.entries(ABBREVIATIONS_MR)) s = s.replace(new RegExp(String.raw`\b${abbr}\b`, "g"), word);

  return s.replace(/\s+/g, " ").replace(/\s+([,.।?!])/g, "$1").trim();
}
