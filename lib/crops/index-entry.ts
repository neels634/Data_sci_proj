/**
 * The light, always-loaded description of a crop: enough for search, filters and the library grid.
 * Built from the full crop by scripts/gen-crop-index.ts. No runtime imports (runs under node).
 */
import type { Bi } from "../i18n.ts";
import type { CropCategory, CropInfo, Region, Season } from "../types.ts";

export interface CropIndexEntry {
  id: string;
  name: Bi;
  aliases: string[];
  category: CropCategory;
  emoji: string;
  regions: Region[];
  tier: 1 | 2 | 3;
  lifecycle: "seasonal" | "perennial";
  /** sowing months (seasonal) or planting months (perennial), 1–12, sorted, unique */
  months: number[];
  /** seasons for seasonal crops (unique, in order); [] for perennials */
  seasons: Season[];
  protectedCultivation: boolean;
  reviewStatus: "draft" | "reviewed";
}

export function indexEntryOf(c: CropInfo): CropIndexEntry {
  const months = c.lifecycle === "seasonal" ? c.seasons.flatMap((s) => s.sowingMonths) : c.plantingMonths;
  return {
    id: c.id,
    name: c.name,
    aliases: c.aliases,
    category: c.category,
    emoji: c.emoji,
    regions: c.regions,
    tier: c.tier,
    lifecycle: c.lifecycle,
    months: Array.from(new Set(months)).sort((a, b) => a - b),
    seasons: c.lifecycle === "seasonal" ? Array.from(new Set(c.seasons.map((s) => s.season))) : [],
    protectedCultivation: !!c.protectedCultivation,
    reviewStatus: c.reviewStatus,
  };
}
