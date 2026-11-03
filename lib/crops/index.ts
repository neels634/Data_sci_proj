/**
 * Crop Library — light index for search, filters and the library grid. Never imports a full crop;
 * use loadCrop() (lib/crops/load.ts) for that. The index itself is generated from lib/crops/data
 * by `npm run crops:index`.
 */
import { CROP_INDEX } from "./index.generated.ts";
import { CATEGORY_LABEL } from "./labels.ts";
import type { CropIndexEntry } from "./index-entry.ts";
import type { CropCategory, Region } from "../types.ts";

export type { CropIndexEntry };
export { CROP_INDEX };
export * from "./labels.ts";

const byId = new Map(CROP_INDEX.map((c) => [c.id, c]));
export const cropEntry = (id: string): CropIndexEntry | undefined => byId.get(id);

/**
 * Normalise for matching: NFC, lower case, no spaces/zero-width characters, Latin diacritics
 * removed, Devanagari nukta dropped and chandrabindu treated as anusvara.
 */
export function normalizeQuery(s: string): string {
  return s
    .normalize("NFC")
    .toLowerCase()
    .replace(/[​-‍﻿]/g, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // Latin accents only (Devanagari matras are kept)
    .replace(/़/g, "") // nukta
    .replace(/ँ/g, "ं") // chandrabindu → anusvara
    .normalize("NFC")
    .replace(/[\s.\-_'’()]/g, "");
}

const keysOf = (c: CropIndexEntry) => {
  const names = [c.name.en, c.name.mr].map(normalizeQuery);
  const aliases = c.aliases.map(normalizeQuery);
  const cat = [CATEGORY_LABEL[c.category].en, CATEGORY_LABEL[c.category].mr, c.category].map(normalizeQuery);
  return { names, aliases, cat };
};
const KEYS = new Map(CROP_INDEX.map((c) => [c.id, keysOf(c)]));

/** Score of one crop for a query; 0 = no match. Exact name > alias prefix > alias substring > category. */
function score(c: CropIndexEntry, q: string): number {
  const k = KEYS.get(c.id)!;
  if (k.names.includes(q)) return 100;
  if (k.aliases.includes(q)) return 90;
  if (k.names.some((n) => n.startsWith(q))) return 80;
  if (k.aliases.some((a) => a.startsWith(q))) return 70;
  if (q.length >= 3 && [...k.names, ...k.aliases].some((a) => a.includes(q))) return 50;
  if (q.length >= 3 && k.cat.some((a) => a.startsWith(q))) return 20;
  return 0;
}

/** Search names and aliases in English, Marathi, Hindi and romanized forms, best match first. */
export function searchCrops(query: string, list: CropIndexEntry[] = CROP_INDEX): CropIndexEntry[] {
  const q = normalizeQuery(query);
  if (!q) return list;
  return list
    .map((c) => ({ c, s: score(c, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.c.tier - b.c.tier || a.c.name.en.localeCompare(b.c.name.en))
    .map((x) => x.c);
}

export const cropsByCategory = (category: CropCategory, list: CropIndexEntry[] = CROP_INDEX) => list.filter((c) => c.category === category);

/** Crops whose sowing or planting months include this month (1–12). */
export const goodToSowNow = (month: number, list: CropIndexEntry[] = CROP_INDEX) => list.filter((c) => c.months.includes(month));

export const cropsForRegion = (region: Region, list: CropIndexEntry[] = CROP_INDEX) => list.filter((c) => c.regions.includes(region));

/** Category counts for the chip row. */
export function categoryCounts(list: CropIndexEntry[] = CROP_INDEX): Partial<Record<CropCategory, number>> {
  const out: Partial<Record<CropCategory, number>> = {};
  for (const c of list) out[c.category] = (out[c.category] ?? 0) + 1;
  return out;
}

/** "Popular in my region": crops grown in the region first, then tier, then name. */
export function sortPopular(list: CropIndexEntry[], region: Region | null, lang: "en" | "mr"): CropIndexEntry[] {
  const coll = new Intl.Collator(lang === "mr" ? "mr" : "en");
  return [...list].sort(
    (a, b) =>
      Number(!!region && b.regions.includes(region)) - Number(!!region && a.regions.includes(region)) ||
      a.tier - b.tier ||
      coll.compare(a.name[lang], b.name[lang]),
  );
}

export function sortAZ(list: CropIndexEntry[], lang: "en" | "mr"): CropIndexEntry[] {
  const coll = new Intl.Collator(lang === "mr" ? "mr" : "en");
  return [...list].sort((a, b) => coll.compare(a.name[lang], b.name[lang]));
}
