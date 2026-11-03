// Assertion examples for lib/lifecycle.ts and the crop library. No test runner needed:
//   npm run check:lifecycle
import assert from "node:assert/strict";
import { CROP_INDEX, searchCrops, seasonFor } from "./crops/index.ts";
import onionData from "./crops/data/onion.ts";
import wheatData from "./crops/data/wheat.ts";
import pomegranateData from "./crops/data/pomegranate.ts";
import sugarcaneData from "./crops/data/sugarcane.ts";
import {
  addDays,
  currentStage,
  dayNumber,
  daysBetween,
  expectedHarvestWindow,
  occurrences,
  parseLocalDate,
  sprayStatus,
  tasksForDate,
  planOf,
  timeline,
  toISODate,
  todayTasks,
} from "./lifecycle.ts";
import type { CropInfo, FarmActivity, FarmCrop, SeasonalCrop, TaskState } from "./types.ts";

const TODAY = "2026-11-02";
const LIB: Record<string, CropInfo> = { onion: onionData, wheat: wheatData, pomegranate: pomegranateData, sugarcane: sugarcaneData };
const getCrop = (id: string) => LIB[id];
const onion = onionData as SeasonalCrop;
const fc = (over: Partial<FarmCrop>): FarmCrop => ({
  id: "fc1",
  owner: "acc",
  cropId: "onion",
  kind: "seasonal",
  season: "rabi",
  seasonIndex: 2,
  variety: "",
  plotName: "",
  areaAcres: 1,
  method: "transplant",
  status: "growing",
  plannedSowingDate: null,
  sowingDate: null,
  transplantDate: null,
  durationDays: [150, 170],
  harvestedOn: null,
  notes: "",
  createdAt: TODAY,
  ...over,
});
let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`✓ ${name}`);
};


check("local dates: no UTC off-by-one, month and year boundaries", () => {
  assert.equal(toISODate(parseLocalDate("2026-11-01")), "2026-11-01");
  assert.equal(addDays("2026-10-31", 1), "2026-11-01");
  assert.equal(addDays("2026-03-01", -1), "2026-02-28");
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(daysBetween("2026-10-31", "2026-11-01"), 1);
  assert.equal(daysBetween(TODAY, TODAY), 0);
});

check("onion sown 45 days ago is at transplanting, day 45", () => {
  const c = fc({ sowingDate: addDays(TODAY, -45) });
  assert.equal(dayNumber(c, TODAY, onion), 45);
  const s = currentStage(c, onion, TODAY)!;
  assert.equal(s.stage.key, "transplanting");
  assert.equal(s.daysLeft, 5);
  const h = expectedHarvestWindow(c, onion)!;
  assert.equal(h.earliest, addDays(TODAY, 150 - 45));
  assert.equal(h.latest, addDays(TODAY, 170 - 45));
  assert.equal(h.estimate, false);
});

check("sown today and yesterday", () => {
  assert.equal(dayNumber(fc({ sowingDate: TODAY }), TODAY), 0);
  assert.equal(currentStage(fc({ sowingDate: TODAY }), onion, TODAY)!.stage.key, "nursery");
  assert.equal(dayNumber(fc({ sowingDate: addDays(TODAY, -1) }), TODAY), 1);
});

check("a planned crop has no day number but an estimated harvest window", () => {
  const c = fc({ status: "planned", plannedSowingDate: addDays(TODAY, 5) });
  assert.equal(dayNumber(c, TODAY, onion), null);
  assert.equal(currentStage(c, onion, TODAY), null);
  assert.equal(expectedHarvestWindow(c, onion)!.estimate, true);
  assert.deepEqual(tasksForDate(c, onion, TODAY, []), []);
});

check("timeline is continuous and ends on the last harvest day", () => {
  const c = fc({ sowingDate: TODAY });
  const tl = timeline(c, onion);
  for (let i = 1; i < tl.length; i++) assert.equal(tl[i].start, addDays(tl[i - 1].end, 1));
  assert.equal(addDays(tl[tl.length - 1].end, 1), expectedHarvestWindow(c, onion)!.latest);
});

check("a shorter season scales stages to its own duration", () => {
  const c = fc({ season: "kharif", seasonIndex: 0, durationDays: [135, 150], sowingDate: TODAY });
  const tl = timeline(c, onion);
  assert.equal(addDays(tl[tl.length - 1].end, 1), addDays(TODAY, 150));
});

check("repeating irrigation task expands every 3 days inside the nursery", () => {
  const c = fc({ sowingDate: TODAY });
  const water = occurrences(c, onion).filter((o) => o.task.id === "on-nwater");
  assert.deepEqual(water.slice(0, 3).map((o) => o.day), [1, 4, 7]);
  assert.ok(water.every((o) => o.day < 45), "repeats stay inside the stage");
  assert.equal(new Set(water.map((o) => o.key)).size, water.length, "each occurrence has its own key");
});

check("overdue task shows until it is done; done tasks disappear", () => {
  const c = fc({ sowingDate: addDays(TODAY, -3) }); // nursery watering was due on day 1 = 2 days ago
  const due = todayTasks([c], getCrop, [], TODAY);
  const late = due.find((d) => d.task.id === "on-nwater" && d.overdue);
  assert.ok(late, "missed watering is overdue");
  assert.equal(due[0].overdue, true, "overdue first");
  const done: TaskState[] = [{ farmCropId: c.id, taskKey: late!.key, status: "done", at: TODAY }];
  assert.ok(!todayTasks([c], getCrop, done, TODAY).some((d) => d.key === late!.key));
});

check("spray status: waiting period and re-entry warnings", () => {
  const c = fc({ sowingDate: addDays(TODAY, -145) }); // harvest window starts in 5 days
  const spray = (over: Partial<FarmActivity>): FarmActivity => ({ id: "a", farmCropId: c.id, type: "pesticide", date: TODAY, notes: "", createdAt: TODAY, ...over });
  const s1 = sprayStatus([spray({ preHarvestIntervalDays: 10, reEntryHours: 24 })], c.id, TODAY, expectedHarvestWindow(c, onion));
  assert.deepEqual(s1!.warnings.map((w) => w.kind).sort(), ["phi", "reentry"]);
  const s2 = sprayStatus([spray({ date: addDays(TODAY, -6) })], c.id, TODAY, expectedHarvestWindow(c, onion));
  assert.equal(s2!.daysSince, 6);
  assert.deepEqual(s2!.warnings, [{ kind: "no-phi" }]);
});

check("search: English, Marathi, partial and aliases", () => {
  assert.equal(searchCrops("कांदा")[0].id, "onion");
  assert.equal(searchCrops("Oni")[0].id, "onion");
  assert.equal(searchCrops("kanda")[0].id, "onion");
  assert.equal(searchCrops("हरभ")[0].id, "chana");
  assert.equal(searchCrops("zzqx").length, 0);
  assert.equal(searchCrops("").length, CROP_INDEX.length);
  // acceptance searches
  const top = (q: string) => searchCrops(q)[0]?.id;
  for (const q of ["kanda", "कांदा", "pyaz"]) assert.equal(top(q), "onion", q);
  for (const q of ["dalimb", "डाळिंब", "anar"]) assert.equal(top(q), "pomegranate", q);
  for (const q of ["zendu", "झेंडू"]) assert.equal(top(q), "marigold", q);
  for (const q of ["ऊस", "ganna"]) assert.equal(top(q), "sugarcane", q);
  assert.equal(top("hapus"), "mango");
});

check("seasonFor picks the matching season, or the next one", () => {
  assert.deepEqual(seasonFor(onion, 10), { season: "rabi", index: 2, fits: true });
  assert.deepEqual(seasonFor(onion, 8), { season: "kharif", index: 1, fits: true });
  assert.equal(seasonFor(wheatData as SeasonalCrop, 3).fits, false);
});

const pom = (over: Partial<FarmCrop>) =>
  fc({ id: "pm", cropId: "pomegranate", kind: "perennial", season: "perennial", seasonIndex: 0, sowingDate: null, durationDays: [0, 0], plantedOn: addDays(TODAY, -3 * 365), ...over });

check("pomegranate: mrig bahar day 60 drives stage, tasks and harvest", () => {
  const c = pom({ cycleKey: "mrig", cycleStart: addDays(TODAY, -60) });
  assert.equal(planOf(c, pomegranateData, TODAY).phase, "cycle");
  assert.equal(dayNumber(c, TODAY, pomegranateData), 60);
  assert.equal(currentStage(c, pomegranateData, TODAY)!.stage.key, "flowering");
  const h = expectedHarvestWindow(c, pomegranateData)!;
  assert.ok(h.earliest > TODAY);
  assert.ok(todayTasks([c], getCrop, [], TODAY).every((t) => t.task.id.startsWith("mr-")));
});

check("pomegranate: young orchard follows establishment care; old one waits for a cycle", () => {
  const young = pom({ plantedOn: addDays(TODAY, -100) });
  assert.equal(planOf(young, pomegranateData, TODAY).phase, "establishment");
  assert.equal(currentStage(young, pomegranateData, TODAY)!.stage.key, "training");
  assert.equal(planOf(pom({}), pomegranateData, TODAY).phase, "waiting");
  assert.equal(currentStage(pom({}), pomegranateData, TODAY), null);
});

check("sugarcane ratoon uses the ratoon duration", () => {
  const cane = sugarcaneData as SeasonalCrop;
  assert.ok(cane.ratoon?.allowed);
  const c = fc({ cropId: "sugarcane", method: "vegetative", seasonIndex: 0, sowingDate: addDays(TODAY, -30), durationDays: cane.ratoon!.durationDays, ratoonNumber: 1 });
  const h = expectedHarvestWindow(c, cane)!;
  assert.equal(h.latest, addDays(c.sowingDate!, cane.ratoon!.durationDays[1]));
});

console.log(`\n${passed} checks passed`);
