/**
 * "Today on your farm": a spoken briefing built from fixed templates (no AI), so it is always
 * correct. Numbers and dates stay as digits / ISO dates here; lib/speech.ts runs toSpokenMarathi,
 * which turns "45 दिवस" into "पंचेचाळीस दिवस" and "2026-03-12 ते 2026-03-25" into
 * "बारा ते पंचवीस मार्च".
 *
 * Marathi wording is in REVIEW (below) for a native speaker. Short sentences, spoken style.
 * Privacy: only a first name goes in the greeting — never phone, address or full name.
 */
import { tx, type Text } from "./i18n.ts";
import { addDays, currentStage, cycleOf, daysBetween, expectedHarvestWindow, orchardAgeYears, sprayStatus, todayTasks, type DueTask } from "./lifecycle.ts";
import type { CropInfo, FarmActivity, FarmCrop, TaskState } from "./types.ts";

export interface SpeakPart {
  /** "greeting" | "summary" | farm crop id | "closing"; the crop card with this id is highlighted */
  id: string;
  text: string;
}

export interface BriefingInput {
  crops: FarmCrop[];
  activities: FarmActivity[];
  taskStates: TaskState[];
  /** first name only, optional */
  firstName?: string;
  getCrop: (id: string) => CropInfo | undefined;
}

type L = "en" | "mr";

/** The briefing sentences in both languages; `{x}` are filled in by `fill`. */
export const REVIEW = {
  morning: { en: "Good morning", mr: "सुप्रभात" },
  afternoon: { en: "Hello", mr: "नमस्कार" },
  evening: { en: "Good evening", mr: "शुभ संध्याकाळ" },
  summary: { en: "Today there are {tasks} tasks for your {crops} crops.", mr: "आज तुमच्या {crops} पिकांसाठी {tasks} कामे आहेत।" },
  summaryOne: { en: "Today there is 1 task for your {crops} crops.", mr: "आज तुमच्या {crops} पिकांसाठी एक काम आहे।" },
  noTasks: { en: "There is no work today.", mr: "आज कोणतेही काम नाही।" },
  noCrops: { en: "You have not added a crop yet.", mr: "तुम्ही अजून पीक जोडलेले नाही।" },
  cropDay: { en: "{crop}, {plot}: {day} days since planting.", mr: "{crop}, {plot}: लागवडीपासून आज {day} दिवस झाले आहेत।" },
  stage: { en: "The crop is now in the {stage} stage.", mr: "पीक आता {stage} टप्प्यात आहे।" },
  orchard: { en: "Your {crop} orchard is {years} years old.", mr: "{crop} बाग {years} वर्षांची आहे।" },
  cycleDay: { en: "{cycle} started {day} days ago.", mr: "{cycle} सुरू होऊन {day} दिवस झाले।" },
  noCycle: { en: "No crop cycle is running now.", mr: "सध्या बहार सुरू नाही।" },
  planned: { en: "{crop}, {plot}: sowing is planned for {date}.", mr: "{crop}, {plot}: पेरणी {date} ला नियोजित आहे।" },
  task: { en: "Today: {task}.", mr: "आज {task}।" },
  overdue: { en: "{task} has been pending for {n} days.", mr: "{task} हे काम {n} दिवसांपासून बाकी आहे।" },
  spray: { en: "The last spray was {n} days ago. Do not harvest until {date}.", mr: "शेवटची फवारणी {n} दिवसांपूर्वी झाली। {date} पर्यंत काढणी करू नका।" },
  harvest: { en: "Harvest is expected between {start} and {end}.", mr: "काढणी साधारण {start} ते {end} दरम्यान अपेक्षित आहे।" },
  closing: { en: "Once the work is done, record it in the app.", mr: "काम झाले की ॲपमध्ये नोंद करा।" },
} as const;

const fill = (t: string, v: Record<string, string | number>) => t.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
const say = (key: keyof typeof REVIEW, lang: L, v: Record<string, string | number> = {}) => fill(REVIEW[key][lang], v);
const end = (lang: L) => (lang === "mr" ? "।" : ".");

/** How a variety is spoken: the crop file's `spoken` form when the farmer's variety matches it. */
function varietyName(fc: FarmCrop, crop: CropInfo, lang: L): string {
  const v = tx(lang, fc.variety as Text).trim();
  if (!v) return "";
  const known = crop.varieties.find((x) => x.name.toLowerCase() === v.toLowerCase());
  return known?.spoken ? known.spoken[lang] : v;
}

function greeting(hour: number, lang: L, firstName?: string) {
  const g = say(hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening", lang);
  return `${g}${firstName ? ` ${firstName}` : ""}${end(lang)}`;
}

/** One crop's part of the briefing (also read by the small speaker button on its card). */
export function cropBriefing(fc: FarmCrop, crop: CropInfo, due: DueTask[], input: Pick<BriefingInput, "activities">, today: string, lang: L): string {
  const out: string[] = [];
  const variety = varietyName(fc, crop, lang);
  const name = `${crop.name[lang]}${variety ? ` ${variety}` : ""}`;
  const plot = tx(lang, fc.plotName as Text).trim() || (lang === "mr" ? "माझे शेत" : "my field");

  if (fc.status === "planned") {
    out.push(say("planned", lang, { crop: name, plot, date: fc.plannedSowingDate ?? "" }));
    return out.join(" ");
  }
  const now = currentStage(fc, crop, today);
  if (crop.lifecycle === "perennial") {
    const age = orchardAgeYears(fc, today);
    if (age != null) out.push(say("orchard", lang, { crop: crop.name[lang], years: age }));
    const cycle = cycleOf(fc, crop);
    if (cycle && fc.cycleStart && fc.status === "growing") out.push(say("cycleDay", lang, { cycle: cycle.name[lang], day: daysBetween(fc.cycleStart, today) }));
    else if (!now) out.push(say("noCycle", lang));
  } else if (fc.sowingDate) {
    out.push(say("cropDay", lang, { crop: name, plot, day: daysBetween(fc.sowingDate, today) }));
  }
  if (now && !now.pastLastStage) out.push(say("stage", lang, { stage: now.stage.name[lang] }));

  // a repeating task that is late more than once is said once: "today" if due today, else its oldest delay
  const byTask = new Map<string, DueTask[]>();
  for (const d of due) byTask.set(d.task.id, [...(byTask.get(d.task.id) ?? []), d]);
  for (const list of byTask.values()) {
    const title = list[0].task.title[lang];
    const late = list.filter((d) => d.overdue);
    out.push(late.length === list.length ? say("overdue", lang, { task: title, n: Math.max(...late.map((d) => daysBetween(d.date, today))) }) : say("task", lang, { task: title }));
  }
  const hw = expectedHarvestWindow(fc, crop);
  const spray = fc.status === "growing" ? sprayStatus(input.activities, fc.id, today, hw) : null;
  // still inside the spray's waiting period before harvest (from the label, as the farmer entered it)
  const phiDays = spray?.last.preHarvestIntervalDays;
  if (spray && phiDays != null && phiDays > 0 && spray.daysSince < phiDays) out.push(say("spray", lang, { n: spray.daysSince, date: addDays(spray.last.date, phiDays) }));
  if (hw && !hw.estimate && fc.status === "growing") out.push(say("harvest", lang, { start: hw.earliest, end: hw.latest }));
  return out.join(" ");
}

/** The whole briefing: greeting, summary, one part per current crop, closing. */
export function buildBriefing(input: BriefingInput, today: string, lang: L, hour = new Date().getHours()): SpeakPart[] {
  const current = input.crops.filter((c) => c.status === "growing" || c.status === "planned");
  const due = todayTasks(current, input.getCrop, input.taskStates, today);
  const taskCount = new Set(due.map((d) => `${d.farmCropId}:${d.task.id}`)).size;
  const parts: SpeakPart[] = [{ id: "greeting", text: greeting(hour, lang, input.firstName) }];
  parts.push({
    id: "summary",
    text: !current.length ? say("noCrops", lang) : !taskCount ? say("noTasks", lang) : taskCount === 1 ? say("summaryOne", lang, { crops: current.length }) : say("summary", lang, { crops: current.length, tasks: taskCount }),
  });
  for (const fc of current) {
    const crop = input.getCrop(fc.cropId);
    if (!crop) continue;
    parts.push({ id: fc.id, text: cropBriefing(fc, crop, due.filter((d) => d.farmCropId === fc.id), input, today, lang) });
  }
  if (current.length) parts.push({ id: "closing", text: say("closing", lang) });
  return parts;
}
