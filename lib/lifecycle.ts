/**
 * My Farm lifecycle logic — pure functions, no React, no storage.
 *
 * Dates are local-calendar "YYYY-MM-DD" strings. Never `new Date("YYYY-MM-DD")`: that parses as UTC
 * midnight and shows the previous day in IST. Use the helpers below.
 *
 * Day 0 is the sowing date (for transplanted crops, the nursery sowing date). A crop's library
 * stages are written for its longest season; for a shorter season the stage and task days are
 * scaled to that crop's own `durationDays[1]`, so the last stage always ends on the last harvest day.
 */
import type { ActivityType, CropInfo, CropStage, FarmActivity, FarmCrop, StageTask, TaskState } from "./types";

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

// ---- stages ------------------------------------------------------------------------------

export const maxDuration = (crop: CropInfo) => Math.max(...crop.seasons.map((s) => s.durationDays[1]));

/** The crop's stages and tasks, stretched or shrunk to this farm crop's own duration. */
export function scaledStages(fc: Pick<FarmCrop, "durationDays">, crop: CropInfo): CropStage[] {
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

/** Date day 0 falls on: the real sowing date, or the planned one. */
export const anchorDate = (fc: FarmCrop) => fc.sowingDate ?? fc.plannedSowingDate;

/** Days since sowing (day 0 = sowing day); null while the crop is only planned. */
export function dayNumber(fc: FarmCrop, today: string): number | null {
  return fc.sowingDate ? daysBetween(fc.sowingDate, today) : null;
}

export interface StageNow {
  stage: CropStage;
  index: number;
  /** 0–100 within this stage */
  progress: number;
  daysLeft: number;
  /** 0–100 across the whole lifecycle */
  overall: number;
  pastLastStage: boolean;
}

export function currentStage(fc: FarmCrop, crop: CropInfo, today: string): StageNow | null {
  const day = dayNumber(fc, today);
  if (day == null) return null;
  const stages = scaledStages(fc, crop);
  const last = stages[stages.length - 1];
  const total = last.endDay;
  if (day >= total) return { stage: last, index: stages.length - 1, progress: 100, daysLeft: 0, overall: 100, pastLastStage: true };
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
  };
}

/** Earliest and latest harvest dates; `estimate` is true while the crop is only planned. */
export function expectedHarvestWindow(fc: FarmCrop): { earliest: string; latest: string; estimate: boolean } | null {
  const a = anchorDate(fc);
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
  const a = anchorDate(fc);
  if (!a) return [];
  return scaledStages(fc, crop).map((stage) => ({ stage, start: addDays(a, stage.startDay), end: addDays(a, stage.endDay - 1) }));
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

/** Every task occurrence in the crop's life, with repeats expanded inside their stage. */
export function occurrences(fc: FarmCrop, crop: CropInfo): TaskOccurrence[] {
  const a = fc.sowingDate;
  if (!a) return [];
  const out: TaskOccurrence[] = [];
  for (const stage of scaledStages(fc, crop))
    for (const task of stage.tasks) {
      const days: number[] = [];
      if (task.repeatEveryDays) for (let d = task.dayOffset; d < stage.endDay; d += task.repeatEveryDays) days.push(d);
      else days.push(task.dayOffset);
      for (const day of days) {
        const date = addDays(a, day);
        out.push({ farmCropId: fc.id, task, stage, day, date, key: `${task.id}:${date}` });
      }
    }
  return out.sort((x, y) => x.day - y.day);
}

const isClosed = (states: TaskState[], fcId: string, key: string) => states.some((s) => s.farmCropId === fcId && s.taskKey === key);

/** Tasks due on `date` that are not done or skipped. */
export function tasksForDate(fc: FarmCrop, crop: CropInfo, date: string, taskStates: TaskState[]): TaskOccurrence[] {
  if (fc.status !== "growing") return [];
  return occurrences(fc, crop).filter((o) => o.date === date && !isClosed(taskStates, fc.id, o.key));
}

export interface DueTask extends TaskOccurrence {
  overdue: boolean;
}

/** Days a missed task keeps showing as overdue. */
export const OVERDUE_WINDOW = 7;

/** Today's tasks across all growing crops, plus overdue ones from the last 7 days; overdue first. */
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
  if (fc.status !== "growing") return [];
  const to = addDays(from, days);
  return occurrences(fc, crop).filter((o) => o.date >= from && o.date <= to && !isClosed(taskStates, fc.id, o.key));
}

/** Preparation before a planned sowing date. Keys are stable, so done/skip work the same way. */
export function preSowingTasks(fc: FarmCrop, crop: CropInfo): { key: string; date: string; type: ActivityType; title: { en: string; mr: string } }[] {
  const a = fc.plannedSowingDate;
  if (!a || fc.status !== "planned") return [];
  const list = [
    { id: "pre-land", off: -10, type: "other" as const, title: { en: "Prepare the land: plough, level, add compost or farmyard manure", mr: "जमीन तयार करा: नांगरट, सपाटीकरण, कंपोस्ट किंवा शेणखत मिसळा" } },
    { id: "pre-soil", off: -14, type: "observation" as const, title: { en: "Get a soil test if you don't have a recent one", mr: "अलीकडचे माती परीक्षण नसल्यास करून घ्या" } },
    {
      id: "pre-seed",
      off: -5,
      type: "other" as const,
      title:
        crop.method === "transplant" || fc.method === "transplant"
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
