/** Display labels for crop categories, seasons and months. No runtime imports. */
import type { CropCategory, CropInfo, Season, SeasonalCrop } from "../types.ts";

type B = { en: string; mr: string };

/** Category chips, in display order. */
export const CATEGORY_ORDER: CropCategory[] = ["cereal", "millet", "pulse", "oilseed", "cash", "vegetable", "leafy", "spice", "fruit", "plantation", "flower", "fodder", "medicinal", "other"];

export const CATEGORY_LABEL: Record<CropCategory, B & { emoji: string }> = {
  cereal: { en: "Cereals", mr: "तृणधान्ये", emoji: "🌾" },
  millet: { en: "Millets", mr: "भरडधान्ये", emoji: "🌿" },
  pulse: { en: "Pulses", mr: "कडधान्ये", emoji: "🫘" },
  oilseed: { en: "Oilseeds", mr: "तेलबिया", emoji: "🌻" },
  cash: { en: "Cash crops", mr: "नगदी पिके", emoji: "💰" },
  vegetable: { en: "Vegetables", mr: "भाजीपाला", emoji: "🥕" },
  leafy: { en: "Leafy vegetables", mr: "पालेभाज्या", emoji: "🥬" },
  spice: { en: "Spices", mr: "मसाला पिके", emoji: "🌶️" },
  fruit: { en: "Fruits", mr: "फळपिके", emoji: "🍎" },
  plantation: { en: "Plantation", mr: "मळा पिके", emoji: "🥥" },
  flower: { en: "Flowers", mr: "फुलपिके", emoji: "🌼" },
  fodder: { en: "Fodder", mr: "चारा पिके", emoji: "🐄" },
  medicinal: { en: "Medicinal", mr: "औषधी पिके", emoji: "🌱" },
  other: { en: "Other", mr: "इतर", emoji: "🌱" },
};

export const SEASON_LABEL: Record<Season, B> = {
  kharif: { en: "Kharif", mr: "खरीप" },
  rabi: { en: "Rabi", mr: "रब्बी" },
  summer: { en: "Summer", mr: "उन्हाळी" },
  perennial: { en: "Perennial", mr: "बारमाही" },
};

/** Name of one season entry of a seasonal crop, e.g. "Late kharif (rangda)". */
export function seasonName(crop: CropInfo, index: number): B {
  if (crop.lifecycle !== "seasonal") return SEASON_LABEL.perennial;
  const s = crop.seasons[index] ?? crop.seasons[0];
  return s.label ?? SEASON_LABEL[s.season];
}

const MONTHS_SHORT: Record<"en" | "mr", string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  mr: ["जाने", "फेब्रु", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑग", "सप्टें", "ऑक्टो", "नोव्हें", "डिसें"],
};
export const MONTHS_FULL: Record<"en" | "mr", string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  mr: ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"],
};

/**
 * Months as short runs: [10, 11] → "Oct–Nov", [12, 1] → "Dec–Jan", [2, 3, 6, 7, 8] → "Feb–Mar, Jun–Aug".
 * Runs wrap around the year end.
 */
export function monthRuns(months: number[], lang: "en" | "mr", full = false): string {
  const names = (full ? MONTHS_FULL : MONTHS_SHORT)[lang];
  const set = new Set(months);
  if (!set.size) return "";
  if (set.size === 12) return lang === "mr" ? "वर्षभर" : "All year";
  // start each run at a month whose previous month is not in the set
  const starts = [...set].filter((m) => !set.has(m === 1 ? 12 : m - 1)).sort((a, b) => a - b);
  return starts
    .map((s) => {
      let e = s;
      while (set.has(e === 12 ? 1 : e + 1) && (e === 12 ? 1 : e + 1) !== s) e = e === 12 ? 1 : e + 1;
      return s === e ? names[s - 1] : `${names[s - 1]}–${names[e - 1]}`;
    })
    .join(", ");
}

/** The season (and its index) that suits sowing in `month`, else the next one to come. */
export function seasonFor(crop: SeasonalCrop, month: number): { season: Season; index: number; fits: boolean } {
  const i = crop.seasons.findIndex((s) => s.sowingMonths.includes(month));
  if (i >= 0) return { season: crop.seasons[i].season, index: i, fits: true };
  let best = 0;
  let bestGap = 13;
  crop.seasons.forEach((s, idx) =>
    s.sowingMonths.forEach((m) => {
      const gap = (m - month + 12) % 12;
      if (gap < bestGap) {
        bestGap = gap;
        best = idx;
      }
    }),
  );
  return { season: crop.seasons[best].season, index: best, fits: false };
}

/** One line for the library grid: "Rabi · Oct–Nov" or "Planting: Jun–Aug". */
export function seasonLine(e: { lifecycle: "seasonal" | "perennial"; seasons: Season[]; months: number[] }, lang: "en" | "mr"): string {
  const months = monthRuns(e.months, lang);
  if (e.lifecycle === "perennial") return `${lang === "mr" ? "लागवड" : "Planting"}: ${months}`;
  return `${e.seasons.map((x) => SEASON_LABEL[x][lang]).join(", ")} · ${months}`;
}
