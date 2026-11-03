# Writing a crop file (lib/crops/data/&lt;id&gt;.ts)

One file per crop, default-exporting a full `CropInfo` (see `SeasonalCrop` / `PerennialCrop` in
`lib/types.ts`). Build text with the helpers in `lib/crops/helpers.ts`: `b(en, mr)`, `t(...)`,
`stage(...)`, `prevent(en, mr)`.

Reference files — copy their style exactly:
- seasonal: `lib/crops/data/onion.ts` (also `jowar.ts` for two seasons)
- perennial: `lib/crops/data/pomegranate.ts` (establishment + three bahar cycles)

Imports must use `.ts` extensions (the files also run under plain `node`):
```ts
import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";
```
Import only the helpers you use (lint fails on unused imports).

## Content rules (mandatory)

1. **Sources.** General practices from Maharashtra's agricultural universities and ICAR institutes:
   Dr. BSKKV Dapoli (Konkan), MPKV Rahuri (western Maharashtra), VNMKV Parbhani (Marathwada),
   Dr. PDKV Akola (Vidarbha); ICAR-NRC Grapes (Pune), ICAR-NRC Pomegranate (Solapur), ICAR-DOGR
   (onion, garlic; Rajgurunagar), ICAR-CCRI (citrus, Nagpur), ICAR-CICR (cotton, Nagpur), ICAR-DFR
   (flowers, Pune), Vasantdada Sugar Institute (sugarcane, Pune), ICAR-IIHR, ICAR-IIVR, etc.
   `source` names the institution(s) in words, e.g. "General practices from Dr. BSKKV Dapoli mango
   guidance". NEVER a URL. NEVER invent a variety or a statistic.
2. **Varieties.** Only varieties you are confident were released or are widely grown in
   Maharashtra, with a short note naming who released them if you know. If unsure:
   `varieties: [], // TODO: varieties — confirm with <institution>`. A short correct list beats a
   long invented one.
3. **No chemical doses.** Never a pesticide/fungicide/herbicide name with an amount, and no
   product names at all in advice. Fertiliser advice stays general ("well-rotted farmyard manure",
   "split nitrogen into 2–3 doses", "as per soil test; ask your agriculture officer for amounts").
   For every pest/disease: signs + prevention via `prevent(...)` (adds the KVK/label line).
4. **Plain language.** Short sentences a new farmer understands. acre, kg, litre, quintal, cm, m;
   months by name. Marathi must be natural Marathi as spoken by Maharashtra farmers (not word-by-word
   translation); use common market names (e.g. वांगी, भेंडी, कोबी, फुलकोबी, शेवगा, केळी, द्राक्षे).
5. **Region honesty.** `regions` lists only where the crop is commonly grown (konkan, western,
   north, marathwada, vidarbha). `majorDistricts` only districts you are confident about.
   Rainfed vs irrigated differences go into `irrigation` and the season `sowingWindow` text.
6. **Numbers.** Ranges where practice varies ("3–4 kg", "45–60 cm"). ASCII digits in data
   (display and speech convert them).
7. **Structure.**
   - Seasonal: ≥4 stages (tier 1: aim 5–8), continuous from day 0, each `startDay` = previous
     `endDay`, the last `endDay` = the LONGEST `durationDays[1]` among the seasons. ≥2 tasks per
     stage; every task `dayOffset` inside its stage (`startDay ≤ d < endDay`); repeating tasks use
     `repeatEveryDays` (irrigation, inspection, picking). Task ids unique within the crop, short
     prefix per crop (e.g. "bj-sow").
   - Multi-pick crops (okra, chilli, flowers, leafy cuttings): add `flushes: { everyDays, count, note }`.
   - Ratoon crops (sugarcane, fodder sorghum…): add `ratoon: { allowed, cycles, durationDays, note }`.
   - Perennial: `establishment` stages from planting (day 0) to first crop, continuous; ≥1 entry in
     `cycles` (each with its own continuous stages from day 0 = cycle start, `startMonths`,
     `harvestMonths`, `startEvent`, `note`). Use several cycles only where farmers really choose
     (bahar types, two prunings). Task ids unique across establishment AND all cycles (use a
     per-cycle prefix like pomegranate's `bahar(p)` helper).
   - 2–4 `commonProblems` (tier 1: 4+), `harvestSigns`, `postHarvest`, `marketTips`.
   - `aliases`: English, Marathi, Hindi, romanized Marathi/Hindi, common misspellings. An alias
     must not be used by any other crop (the validator checks).
   - `lastVerified: null`, `reviewStatus: "draft"`.
8. **Every Bi has non-empty English and Marathi**, and the Marathi side must contain Devanagari.

## Checking your files

```bash
npm run -s check:crops -- --only rice,bajra,maize
```
Fix every ERROR. Do not run `npm run crops:index` and do not edit any file outside your assigned
crop files (other people are editing the rest at the same time).
