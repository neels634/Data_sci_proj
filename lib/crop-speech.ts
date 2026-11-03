/**
 * Crop Library read-aloud: each section as complete spoken sentences, built from the same
 * bilingual fields shown on screen. Numbers stay as digits; lib/speech.ts turns them into Marathi
 * words when reading Marathi.
 */
import type { CropInfo, CropStage, Region } from "./types.ts";
import { CATEGORY_LABEL, MONTHS_FULL, monthRuns, seasonName } from "./crops/labels.ts";
import { REGION_LABEL } from "./regions.ts";

export type SectionKey =
  | "overview"
  | "sow"
  | "planting"
  | "soil"
  | "seed"
  | "nursery"
  | "irrigation"
  | "nutrients"
  | "varieties"
  | "stages"
  | "establishment"
  | "ratoon"
  | "problems"
  | "harvest"
  | "storage"
  | `cycle:${string}`;

/** Sections that apply to this crop, in display order. */
export function sectionsFor(crop: CropInfo): SectionKey[] {
  if (crop.lifecycle === "perennial")
    return ["overview", "planting", "soil", "irrigation", "nutrients", ...(crop.varieties.length ? (["varieties"] as const) : []), "establishment", ...crop.cycles.map((c) => `cycle:${c.key}` as const), "problems", "harvest", "storage"];
  return [
    "overview",
    "sow",
    "soil",
    "seed",
    ...(crop.method === "transplant" || crop.method === "both" ? (["nursery"] as const) : []),
    "irrigation",
    "nutrients",
    ...(crop.varieties.length ? (["varieties"] as const) : []),
    "stages",
    ...(crop.ratoon?.allowed || crop.flushes ? (["ratoon"] as const) : []),
    "problems",
    "harvest",
    "storage",
  ];
}

const join = (xs: string[], lang: "en" | "mr") => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} ${lang === "mr" ? "आणि" : "and"} ${xs[xs.length - 1]}`);

/** "हे पीक कोकण आणि पश्चिम महाराष्ट्रात घेतले जाते." */
export function regionSentence(regions: Region[], lang: "en" | "mr"): string {
  const names = regions.map((r) => REGION_LABEL[r][lang]);
  if (!names.length) return "";
  return lang === "mr" ? `हे पीक ${join(names, "mr")} भागात घेतले जाते.` : `It is grown in ${join(names, "en")}.`;
}

function stagesText(stages: CropStage[], lang: "en" | "mr", p: (x: { en: string; mr: string }) => string) {
  const mr = lang === "mr";
  return stages.map((s, i) => (mr ? `टप्पा ${i + 1}: ${p(s.name)}, दिवस ${s.startDay} ते ${s.endDay}. ${p(s.whatHappens)}` : `Stage ${i + 1}: ${p(s.name)}, day ${s.startDay} to ${s.endDay}. ${p(s.whatHappens)}`)).join(" ");
}

/**
 * A section as complete spoken sentences in `lang`. `month` (1–12) adds "now is a good time to
 * sow/plant" where it fits.
 */
export function spokenSection(crop: CropInfo, key: SectionKey, lang: "en" | "mr", month?: number): string {
  const p = (x: { en: string; mr: string }) => x[lang];
  const mr = lang === "mr";
  switch (key) {
    case "overview": {
      const cat = p(CATEGORY_LABEL[crop.category]);
      const where = regionSentence(crop.regions, lang);
      if (crop.lifecycle === "perennial")
        return mr
          ? `${p(crop.name)} हे ${cat} गटातील बहुवर्षीय पीक आहे. ${where} लागवडीनंतर साधारण ${crop.yearsToFirstHarvest[0]} ते ${crop.yearsToFirstHarvest[1]} वर्षांनी पहिले उत्पादन मिळते.`
          : `${p(crop.name)} is a perennial ${cat.toLowerCase()} crop. ${where} The first crop comes about ${crop.yearsToFirstHarvest[0]} to ${crop.yearsToFirstHarvest[1]} years after planting.`;
      const days = crop.seasons.flatMap((s) => s.durationDays);
      const how =
        crop.method === "transplant"
          ? mr
            ? "याची रोपे रोपवाटिकेत तयार करून मग शेतात पुनर्लागवड केली जाते"
            : "It is raised in a nursery and then transplanted"
          : crop.method === "both"
            ? mr
              ? "याची थेट पेरणी किंवा पुनर्लागवड करता येते"
              : "It can be sown directly or transplanted"
            : crop.method === "vegetative"
              ? mr
                ? `याची लागवड ${p(crop.plantingMaterial)} वापरून केली जाते`
                : `It is planted from ${p(crop.plantingMaterial).toLowerCase()}`
              : mr
                ? "याची शेतात थेट पेरणी केली जाते"
                : "It is sown directly in the field";
      return mr
        ? `${p(crop.name)} हे ${cat} गटातील पीक आहे. ${where} ${how}. पेरणीपासून काढणीपर्यंत साधारण ${Math.min(...days)} ते ${Math.max(...days)} दिवस लागतात.`
        : `${p(crop.name)} is in ${cat.toLowerCase()}. ${where} ${how}. It takes about ${Math.min(...days)} to ${Math.max(...days)} days from sowing to harvest.`;
    }
    case "sow":
      if (crop.lifecycle !== "seasonal") return "";
      return crop.seasons
        .map((s, i) => {
          const name = p(seasonName(crop, i));
          const now = month != null && s.sowingMonths.includes(month);
          return mr
            ? `${name} हंगाम. पेरणीची वेळ: ${p(s.sowingWindow)}. पीक तयार होण्यास ${s.durationDays[0]} ते ${s.durationDays[1]} दिवस लागतात.${now ? " आत्ता पेरणीसाठी योग्य वेळ आहे." : ""}`
            : `${name} season. Sowing time: ${p(s.sowingWindow)}. The crop takes ${s.durationDays[0]} to ${s.durationDays[1]} days to be ready.${now ? " Now is a good time to sow." : ""}`;
        })
        .join(" ");
    case "planting": {
      if (crop.lifecycle !== "perennial") return "";
      const now = month != null && crop.plantingMonths.includes(month);
      return mr
        ? `लागवडीची वेळ: ${p(crop.plantingWindow)}. लागवड साहित्य: ${p(crop.plantingMaterial)} अंतर: ${p(crop.spacing)}. एकरी ${crop.plantsPerAcre[0]} ते ${crop.plantsPerAcre[1]} झाडे बसतात. पहिले उत्पादन ${crop.yearsToFirstHarvest[0]} ते ${crop.yearsToFirstHarvest[1]} वर्षांनी, आणि बाग ${crop.economicLifeYears[0]} ते ${crop.economicLifeYears[1]} वर्षे उत्पादन देते.${now ? " आत्ता लागवडीसाठी योग्य वेळ आहे." : ""}`
        : `Planting time: ${p(crop.plantingWindow)}. Planting material: ${p(crop.plantingMaterial)}. Spacing: ${p(crop.spacing)}. About ${crop.plantsPerAcre[0]} to ${crop.plantsPerAcre[1]} plants per acre. First crop after ${crop.yearsToFirstHarvest[0]} to ${crop.yearsToFirstHarvest[1]} years; the orchard bears for ${crop.economicLifeYears[0]} to ${crop.economicLifeYears[1]} years.${now ? " Now is a good time to plant." : ""}`;
    }
    case "soil":
      return mr ? `जमीन: ${p(crop.soil)} हवामान: ${p(crop.climate)}` : `Soil: ${p(crop.soil)} Climate: ${p(crop.climate)}`;
    case "seed":
      if (crop.lifecycle !== "seasonal") return "";
      return mr ? `लागवड साहित्य: ${p(crop.plantingMaterial)}. बियाणे: ${p(crop.seedRate)} अंतर: ${p(crop.spacing)}` : `Planting material: ${p(crop.plantingMaterial)}. Seed rate: ${p(crop.seedRate)} Spacing: ${p(crop.spacing)}`;
    case "nursery":
      if (crop.lifecycle !== "seasonal") return "";
      return mr
        ? `साधारण ${crop.nurseryDays ?? 30} दिवस रोपवाटिकेत रोपे वाढवा, मग मुख्य शेतात पुनर्लागवड करा.`
        : `Raise seedlings in a nursery for about ${crop.nurseryDays ?? 30} days, then transplant them to the main field.`;
    case "irrigation":
      return p(crop.irrigation);
    case "nutrients":
      return p(crop.nutrientGuide);
    case "varieties":
      return crop.varieties.map((v) => `${v.name}: ${p(v.note)}`).join(". ");
    case "stages":
      return crop.lifecycle === "seasonal" ? stagesText(crop.stages, lang, p) : "";
    case "establishment":
      return crop.lifecycle === "perennial" ? stagesText(crop.establishment, lang, p) : "";
    case "ratoon": {
      if (crop.lifecycle !== "seasonal") return "";
      const parts: string[] = [];
      if (crop.ratoon?.allowed)
        parts.push(
          mr
            ? `खोडवा: ${p(crop.ratoon.note)} साधारण ${crop.ratoon.cycles} वेळा खोडवा घेता येतो; प्रत्येक खोडवा ${crop.ratoon.durationDays[0]} ते ${crop.ratoon.durationDays[1]} दिवसांचा.`
            : `Ratoon: ${p(crop.ratoon.note)} Usually ${crop.ratoon.cycles} ratoon crops; each takes ${crop.ratoon.durationDays[0]} to ${crop.ratoon.durationDays[1]} days.`,
        );
      if (crop.flushes)
        parts.push(
          mr
            ? `तोडणी: ${p(crop.flushes.note)} दर ${crop.flushes.everyDays} दिवसांनी, साधारण ${crop.flushes.count} वेळा.`
            : `Pickings: ${p(crop.flushes.note)} Every ${crop.flushes.everyDays} days, about ${crop.flushes.count} times.`,
        );
      return parts.join(" ");
    }
    case "problems":
      return crop.commonProblems.map((x) => (mr ? `${p(x.name)}. लक्षणे: ${p(x.signs)} प्रतिबंध: ${p(x.prevention)}` : `${p(x.name)}. Signs: ${p(x.signs)} Prevention: ${p(x.prevention)}`)).join(" ");
    case "harvest":
      return p(crop.harvestSigns);
    case "storage":
      return `${p(crop.postHarvest)} ${p(crop.marketTips)}`;
    default: {
      if (crop.lifecycle !== "perennial") return "";
      const cy = crop.cycles.find((c) => `cycle:${c.key}` === key);
      if (!cy) return "";
      const starts = cy.startMonths.map((m) => MONTHS_FULL[lang][m - 1]);
      const harvest = monthRuns(cy.harvestMonths, lang, true);
      return mr
        ? `${p(cy.name)}. सुरुवात ${join(starts, "mr")} महिन्यात: ${p(cy.startEvent)}. काढणी ${harvest} या काळात. ${p(cy.note)} ${stagesText(cy.stages, lang, p)}`
        : `${p(cy.name)}. Starts in ${join(starts, "en")}: ${p(cy.startEvent)}. Harvest in ${harvest}. ${p(cy.note)} ${stagesText(cy.stages, lang, p)}`;
    }
  }
}

const TITLES: Record<Exclude<SectionKey, `cycle:${string}`>, { en: string; mr: string }> = {
  overview: { en: "Overview", mr: "थोडक्यात" },
  sow: { en: "When to sow", mr: "पेरणी कधी करावी" },
  planting: { en: "Planting", mr: "लागवड" },
  soil: { en: "Soil & climate", mr: "जमीन व हवामान" },
  seed: { en: "Seed rate & spacing", mr: "बियाणे व अंतर" },
  nursery: { en: "Nursery & transplanting", mr: "रोपवाटिका व पुनर्लागवड" },
  irrigation: { en: "Irrigation", mr: "पाणी" },
  nutrients: { en: "Nutrients (general)", mr: "खते (सर्वसाधारण)" },
  varieties: { en: "Varieties", mr: "वाण" },
  stages: { en: "Growth stages", mr: "वाढीच्या अवस्था" },
  establishment: { en: "Establishment (planting to first crop)", mr: "बाग उभारणी (लागवड ते पहिले उत्पादन)" },
  ratoon: { en: "Pickings", mr: "तोडणी" },
  problems: { en: "Common problems", mr: "नेहमीच्या समस्या" },
  harvest: { en: "Harvest signs", mr: "काढणीची लक्षणे" },
  storage: { en: "Storage & selling tips", mr: "साठवण व विक्री" },
};

/** Heading of a section in the crop guide. */
export function sectionTitle(crop: CropInfo, key: SectionKey, lang: "en" | "mr"): string {
  if (key.startsWith("cycle:")) return crop.lifecycle === "perennial" ? (crop.cycles.find((c) => `cycle:${c.key}` === key)?.name[lang] ?? "") : "";
  if (key === "ratoon" && crop.lifecycle === "seasonal" && crop.ratoon?.allowed) return lang === "mr" ? "खोडवा व तोडणी" : "Ratoon & pickings";
  return TITLES[key as keyof typeof TITLES][lang];
}

/** What a section's speaker button reads (also what scripts/pregen-tts.ts pre-generates). */
export const sectionSpeech = (crop: CropInfo, key: SectionKey, lang: "en" | "mr", month?: number) => `${sectionTitle(crop, key, lang)}. ${spokenSection(crop, key, lang, month)}`;
