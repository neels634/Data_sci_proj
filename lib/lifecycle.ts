/**
 * My Farm lifecycle logic — pure functions, no React, no storage.
 *
 * Dates are local-calendar "YYYY-MM-DD" strings. Never `new Date("YYYY-MM-DD")`: that parses as UTC
 * midnight and shows the previous day in IST. Use the helpers below.
 *
 * Seasonal crops: day 0 is the sowing date (for transplanted crops, the nursery sowing date). A
 * crop's library stages are written for its longest season; for a shorter season (or a ratoon) the
 * stage and task days are scaled to that crop's own `durationDays[1]`.
 * Perennial crops: a young orchard follows the `establishment` stages from its planting date; once
 * the farmer starts a yearly cycle (bahar / pruning), the cycle's stages run from its start date.
 */
import type { ActivityType, CropCycle, CropInfo, CropStage, FarmActivity, FarmCrop, PerennialCrop, SeasonalCrop, StageTask, TaskState } from "./types";

// ---- dates ---------------------------------------------------------------------------

export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Today in the device's local calendar (IST for our users). */
export const todayISO = (now = new Date()) => toISODate(now);

export function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return toISODate(new Date(y, m - 1, d + n));
}

/** Whole days from `from` to `to` (positive when `to` is later). DST-safe. */
export function daysBetween(from: string, to: string): number {
  const [y1, m1, d1] = from.split("-").map(Number);
  const [y2, m2, d2] = to.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
}

export const monthOf = (iso: string) => Number(iso.slice(5, 7));

// ---- the plan: which stages apply now, counted from which date ------------------------------

const lastEnd = (stages: CropStage[]) => (stages.length ? stages[stages.length - 1].endDay : 0);

export const maxDuration = (crop: SeasonalCrop) => Math.max(...crop.seasons.map((s) => s.durationDays[1]));

/** A seasonal crop's stages and tasks, stretched or shrunk to this farm crop's own duration (also ratoon). */
export function scaledStages(fc: Pick<FarmCrop, "durationDays">, crop: SeasonalCrop): CropStage[] {
  const f = fc.durationDays[1] / maxDuration(crop);
  if (f === 1) return crop.stages;
  return crop.stages.map((s) => {
    const startDay = Math.round(s.startDay * f);
    const endDay = Math.round(s.endDay * f);
    return {
      ...s,
      startDay,
      endDay,
      tasks: s.tasks.map((t) => ({ ...t, dayOffset: Math.min(Math.max(Math.round(t.dayOffset * f), startDay), Math.max(startDay, endDay - 1)) })),
    };
  });
}

export interface Plan {
  /** day 0 of the stages (sowing, planting or cycle start); null when nothing has started */
  anchor: string | null;
  stages: CropStage[];
  /** last day of the plan */
  total: number;
  /** seasonal crop | young orchard (planting to first crop) | a yearly cycle | orchard waiting for its next cycle */
  phase: "seasonal" | "establishment" | "cycle" | "waiting";
  cycle?: CropCycle;
}

export const cycleOf = (fc: FarmCrop, crop: PerennialCrop) => crop.cycles.find((c) => c.key === fc.cycleKey) ?? null;

/** Which stages apply to this farm crop, and from which date. */
export function planOf(fc: FarmCrop, crop: CropInfo, today: string = todayISO()): Plan {
  if (crop.lifecycle === "seasonal") {
    const stages = scaledStages(fc, crop);
    return { anchor: fc.sowingDate ?? fc.plannedSowingDate, stages, total: lastEnd(stages), phase: "seasonal" };
  }
  const cycle = cycleOf(fc, crop);
  if (cycle && fc.cycleStart) return { anchor: fc.cycleStart, stages: cycle.stages, total: lastEnd(cycle.stages), phase: "cycle", cycle };
  // young orchard: establishment care from planting, until its first crop is due (or a cycle was already harvested)
  if (fc.plantedOn && !fc.harvestedOn && daysBetween(fc.plantedOn, today) < lastEnd(crop.establishment))
    return { anchor: fc.plantedOn, stages: crop.establishment, total: lastEnd(crop.establishment), phase: "establishment" };
  return { anchor: null, stages: [], total: 0, phase: "waiting" };
}

/** Day 0 date of the current plan (needs the crop for perennials). */
export const anchorDate = (fc: FarmCrop, crop?: CropInfo) => (crop ? planOf(fc, crop).anchor : fc.kind === "perennial" ? (fc.cycleStart ?? fc.plantedOn ?? null) : (fc.sowingDate ?? fc.plannedSowingDate));

/** Days since day 0 of the current plan; null while a seasonal crop is only planned. */
export function dayNumber(fc: FarmCrop, today: string, crop?: CropInfo): number | null {
  if (fc.kind === "perennial") {
    const a = anchorDate(fc, crop);
    return a && fc.status === "growing" ? daysBetween(a, today) : null;
  }
  return fc.sowingDate ? daysBetween(fc.sowingDate, today) : null;
}

export interface StageNow {
  stage: CropStage;
  index: number;
  /** 0–100 within this stage */
  progress: number;
  daysLeft: number;
  /** 0–100 across the whole plan */
  overall: number;
  pastLastStage: boolean;
  phase: Plan["phase"];
}

export function currentStage(fc: FarmCrop, crop: CropInfo, today: string): StageNow | null {
  const day = dayNumber(fc, today, crop);
  if (day == null) return null;
  const plan = planOf(fc, crop);
  const stages = plan.stages;
  if (!stages.length) return null;
  const last = stages[stages.length - 1];
  const total = plan.total;
  if (day >= total) return { stage: last, index: stages.length - 1, progress: 100, daysLeft: 0, overall: 100, pastLastStage: true, phase: plan.phase };
  const d = Math.max(day, 0);
  const index = stages.findIndex((s) => d >= s.startDay && d < s.endDay);
  const stage = stages[index];
  const len = stage.endDay - stage.startDay;
  return {
    stage,
    index,
    progress: Math.round(((d - stage.startDay) / len) * 100),
    daysLeft: stage.endDay - d,
    overall: Math.round((d / total) * 100),
    pastLastStage: false,
    phase: plan.phase,
  };
}

// ---- perennials ------------------------------------------------------------------------------

const yearOf = (iso: string) => Number(iso.slice(0, 4));
const lastDayOfMonth = (y: number, m: number) => toISODate(new Date(y, m, 0));
const firstOfMonth = (y: number, m: number) => `${y}-${String(m).padStart(2, "0")}-01`;

/** Whole years since the orchard was planted. */
export function orchardAgeYears(fc: FarmCrop, today: string): number | null {
  return fc.plantedOn ? Math.max(0, Math.floor(daysBetween(fc.plantedOn, today) / 365.25)) : null;
}

/** Year the first crop is expected (planting year + the shorter years-to-first-harvest). */
export function firstCropYear(fc: FarmCrop, crop: PerennialCrop): number | null {
  return fc.plantedOn ? yearOf(fc.plantedOn) + crop.yearsToFirstHarvest[0] : null;
}

/** Too young to bear: no yearly cycle yet. */
export const isYoungOrchard = (fc: FarmCrop, crop: PerennialCrop, today: string) => {
  const age = orchardAgeYears(fc, today);
  return age != null && age < crop.yearsToFirstHarvest[0];
};

/**
 * Harvest dates of a running cycle, from its own stages: the first stage with a harvest task (else
 * the last stage) up to the end of the cycle. Kept consistent with the stage timeline on screen.
 */
export function cycleHarvestWindow(cycle: CropCycle, start: string): { earliest: string; latest: string } {
  const harvest = cycle.stages.find((st) => st.tasks.some((t) => t.type === "harvest")) ?? cycle.stages[cycle.stages.length - 1];
  return { earliest: addDays(start, harvest.startDay), latest: addDays(start, lastEnd(cycle.stages) - 1) };
}

/** Earliest and latest harvest dates; `estimate` while a seasonal crop is only planned or an orchard is young. */
export function expectedHarvestWindow(fc: FarmCrop, crop?: CropInfo): { earliest: string; latest: string; estimate: boolean } | null {
  if (fc.kind === "perennial") {
    if (!crop || crop.lifecycle !== "perennial") return null;
    const cycle = cycleOf(fc, crop);
    if (cycle && fc.cycleStart) return { ...cycleHarvestWindow(cycle, fc.cycleStart), estimate: false };
    const y = firstCropYear(fc, crop);
    return y ? { earliest: firstOfMonth(y, 1), latest: lastDayOfMonth(y, 12), estimate: true } : null;
  }
  const a = fc.sowingDate ?? fc.plannedSowingDate;
  if (!a) return null;
  return { earliest: addDays(a, fc.durationDays[0]), latest: addDays(a, fc.durationDays[1]), estimate: !fc.sowingDate };
}

export interface TimelineStage {
  stage: CropStage;
  /** first calendar day of the stage */
  start: string;
  /** last calendar day of the stage (inclusive) */
  end: string;
}

export function timeline(fc: FarmCrop, crop: CropInfo): TimelineStage[] {
  const { anchor, stages } = planOf(fc, crop);
  if (!anchor) return [];
  return stages.map((stage) => ({ stage, start: addDays(anchor, stage.startDay), end: addDays(anchor, stage.endDay - 1) }));
}

// ---- tasks -------------------------------------------------------------------------------

export interface TaskOccurrence {
  farmCropId: string;
  task: StageTask;
  stage: CropStage;
  day: number;
  date: string;
  /** `${taskId}:${dueDate}` — repeating tasks are tracked per occurrence */
  key: string;
}

/**
 * Every task occurrence in the current plan, with repeats expanded inside their stage. Multi-pick
 * crops (`flushes`) repeat their first one-off harvest task every `everyDays`, `count` times in all.
 */
export function occurrences(fc: FarmCrop, crop: CropInfo): TaskOccurrence[] {
  if (fc.status !== "growing") return [];
  const plan = planOf(fc, crop);
  const a = plan.anchor;
  if (!a) return [];
  const out: TaskOccurrence[] = [];
  for (const stage of plan.stages)
    for (const task of stage.tasks) {
      const days: number[] = [];
      if (task.repeatEveryDays) for (let d = task.dayOffset; d < stage.endDay; d += task.repeatEveryDays) days.push(d);
      else days.push(task.dayOffset);
      for (const day of days) {
        const date = addDays(a, day);
        out.push({ farmCropId: fc.id, task, stage, day, date, key: `${task.id}:${date}` });
      }
    }
  if (crop.lifecycle === "seasonal" && crop.flushes) {
    const first = out.filter((o) => o.task.type === "harvest" && !o.task.repeatEveryDays).sort((x, y) => x.day - y.day)[0];
    if (first)
      for (let k = 1; k < crop.flushes.count; k++) {
        const day = first.day + k * crop.flushes.everyDays;
        const date = addDays(a, day);
        out.push({ ...first, day, date, key: `${first.task.id}:${date}` });
      }
  }
  return out.sort((x, y) => x.day - y.day);
}

const isClosed = (states: TaskState[], fcId: string, key: string) => states.some((s) => s.farmCropId === fcId && s.taskKey === key);

/** Tasks due on `date` that are not done or skipped. */
export function tasksForDate(fc: FarmCrop, crop: CropInfo, date: string, taskStates: TaskState[]): TaskOccurrence[] {
  return occurrences(fc, crop).filter((o) => o.date === date && !isClosed(taskStates, fc.id, o.key));
}

export interface DueTask extends TaskOccurrence {
  overdue: boolean;
}

/** Days a missed task keeps showing as overdue. */
export const OVERDUE_WINDOW = 7;

/** Today's tasks across all growing crops, plus overdue ones from the last 7 days; overdue first. Crops not loaded yet are skipped. */
export function todayTasks(farmCrops: FarmCrop[], cropById: (id: string) => CropInfo | undefined, taskStates: TaskState[], today: string): DueTask[] {
  const from = addDays(today, -OVERDUE_WINDOW);
  const out: DueTask[] = [];
  for (const fc of farmCrops) {
    const crop = cropById(fc.cropId);
    if (!crop || fc.status !== "growing") continue;
    for (const o of occurrences(fc, crop))
      if (o.date >= from && o.date <= today && !isClosed(taskStates, fc.id, o.key)) out.push({ ...o, overdue: o.date < today });
  }
  return out.sort((a, b) => Number(b.overdue) - Number(a.overdue) || a.date.localeCompare(b.date));
}

/** Open tasks from `from` (inclusive) for `days` days, for one crop. */
export function upcomingTasks(fc: FarmCrop, crop: CropInfo, taskStates: TaskState[], from: string, days: number): TaskOccurrence[] {
  const to = addDays(from, days);
  return occurrences(fc, crop).filter((o) => o.date >= from && o.date <= to && !isClosed(taskStates, fc.id, o.key));
}

type PrepTask = { key: string; date: string; type: ActivityType; title: { en: string; mr: string } };

/** Preparation before a planned sowing / orchard planting. Keys are stable, so done/skip work the same way. */
export function preSowingTasks(fc: FarmCrop, crop: CropInfo): PrepTask[] {
  const a = fc.kind === "perennial" ? (fc.plantedOn ?? fc.plannedSowingDate) : fc.plannedSowingDate;
  if (!a || fc.status !== "planned") return [];
  const list =
    crop.lifecycle === "perennial"
      ? [
          { id: "pre-soil", off: -45, type: "observation" as const, title: { en: "Get a soil and water test for the orchard plot", mr: "बागेच्या जमिनीचे माती व पाणी परीक्षण करा" } },
          { id: "pre-pits", off: -30, type: "other" as const, title: { en: "Dig pits and fill them with topsoil and well-rotted manure", mr: "खड्डे खणून वरची माती व कुजलेल्या शेणखताने भरा" } },
          { id: "pre-plants", off: -15, type: "other" as const, title: { en: "Book healthy plants from a registered nursery", mr: "नोंदणीकृत रोपवाटिकेतून निरोगी कलमे/रोपे आरक्षित करा" } },
        ]
      : [
          { id: "pre-land", off: -10, type: "other" as const, title: { en: "Prepare the land: plough, level, add compost or farmyard manure", mr: "जमीन तयार करा: नांगरट, सपाटीकरण, कंपोस्ट किंवा शेणखत मिसळा" } },
          { id: "pre-soil", off: -14, type: "observation" as const, title: { en: "Get a soil test if you don't have a recent one", mr: "अलीकडचे माती परीक्षण नसल्यास करून घ्या" } },
          {
            id: "pre-seed",
            off: -5,
            type: "other" as const,
            title:
              crop.method === "vegetative"
                ? { en: "Arrange healthy planting material (setts, tubers or cuttings)", mr: "निरोगी लागवड साहित्य आणा (कांडी, कंद किंवा फाटे)" }
                : crop.method === "transplant" || fc.method === "transplant"
                  ? { en: "Arrange good seed and prepare the nursery bed", mr: "चांगले बियाणे आणा व रोपवाटिका तयार करा" }
                  : { en: "Buy good seed from a trusted shop and keep the bill", mr: "विश्वासू दुकानातून चांगले बियाणे घ्या व पावती ठेवा" },
          },
        ];
  return list.map((x) => ({ key: `${x.id}:${addDays(a, x.off)}`, date: addDays(a, x.off), type: x.type, title: x.title })).sort((p, q) => p.date.localeCompare(q.date));
}

// ---- activity log ------------------------------------------------------------------------

const newestFirst = (a: FarmActivity, b: FarmActivity) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);

export function lastActivity(activities: FarmActivity[], farmCropId: string, types: ActivityType[]): FarmActivity | null {
  return activities.filter((a) => a.farmCropId === farmCropId && types.includes(a.type)).sort(newestFirst)[0] ?? null;
}

export type SprayWarning =
  | { kind: "reentry"; until: string } // don't enter the field yet
  | { kind: "phi"; until: string } // safe waiting period before harvest not over
  | { kind: "no-phi" }; // waiting period not entered: check the label

export interface SprayStatus {
  last: FarmActivity;
  daysSince: number;
  warnings: SprayWarning[];
}

/** Last pesticide/fungicide spray and the label-based safety warnings that follow from it. */
export function sprayStatus(
  activities: FarmActivity[],
  farmCropId: string,
  today: string,
  harvestWindow: { earliest: string } | null,
): SprayStatus | null {
  const last = lastActivity(activities, farmCropId, ["pesticide", "fungicide"]);
  if (!last) return null;
  const warnings: SprayWarning[] = [];
  if (last.reEntryHours && last.reEntryHours > 0) {
    // only the date of a spray is known, so count whole days after it
    const until = addDays(last.date, Math.ceil(last.reEntryHours / 24));
    if (today < until) warnings.push({ kind: "reentry", until });
  }
  if (last.preHarvestIntervalDays != null && last.preHarvestIntervalDays >= 0) {
    const until = addDays(last.date, last.preHarvestIntervalDays);
    if (harvestWindow && harvestWindow.earliest < until && today < until) warnings.push({ kind: "phi", until });
  } else warnings.push({ kind: "no-phi" });
  return { last, daysSince: daysBetween(last.date, today), warnings };
}
