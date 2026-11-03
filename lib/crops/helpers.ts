/**
 * Small builders used by every file in lib/crops/data. No runtime imports, so crop files also run
 * under plain `node` (validator, index generator, review export).
 *
 * Content rules (see lib/crops/README in the repo docs and the validator): simple words, local units,
 * general practices only. NEVER a pesticide/fungicide/herbicide name with an amount — describe signs
 * and prevention, then use `prevent()` which adds the "ask your KVK" line.
 */
import type { Bi } from "../i18n.ts";
import type { CropStage, StageTask } from "../types.ts";

/** Bilingual text: English, Marathi. */
export const b = (en: string, mr: string): Bi => ({ en, mr });

/** Added to every pest/disease prevention note. */
export const ASK = b(
  "Ask your KVK or agriculture officer for the right product and dose, follow the label, and wear protection while spraying.",
  "योग्य औषध व मात्रा कृषी विज्ञान केंद्र किंवा कृषी अधिकाऱ्यांना विचारा, लेबलवरील सूचना पाळा आणि फवारणी करताना संरक्षक कपडे घाला.",
);

/** Prevention text with the standard "ask your KVK" line appended. */
export const prevent = (en: string, mr: string): Bi => b(`${en} ${ASK.en}`, `${mr} ${ASK.mr}`);

/** A task inside a stage. `dayOffset` counts from day 0 of the plan (sowing, planting or cycle start). */
export const t = (id: string, dayOffset: number, type: StageTask["type"], title: [string, string], detail: [string, string], repeatEveryDays?: number): StageTask => ({
  id,
  dayOffset,
  type,
  title: b(...title),
  detail: b(...detail),
  ...(repeatEveryDays ? { repeatEveryDays } : {}),
});

/** A growth stage. Stages must be continuous: each starts on the previous one's endDay. */
export const stage = (key: string, name: [string, string], startDay: number, endDay: number, whatHappens: [string, string], tasks: StageTask[], watchFor: [string, string][]): CropStage => ({
  key,
  name: b(...name),
  startDay,
  endDay,
  whatHappens: b(...whatHappens),
  tasks,
  watchFor: watchFor.map((w) => b(...w)),
});
