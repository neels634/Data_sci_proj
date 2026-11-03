// Checks the spoken "Today on your farm" briefing, before and after toSpokenMarathi:
//   npm run check:briefing
import assert from "node:assert/strict";
import { buildBriefing } from "./farm-briefing.ts";
import { toSpokenMarathi } from "./marathi-numbers.ts";
import { addDays } from "./lifecycle.ts";
import onion from "./crops/data/onion.ts";
import pomegranate from "./crops/data/pomegranate.ts";
import type { CropInfo, FarmActivity, FarmCrop } from "./types.ts";

const TODAY = "2026-11-02";
const NOW = new Date(2026, 10, 2, 8); // 8 am → "सुप्रभात"
const LIB: Record<string, CropInfo> = { onion, pomegranate };

const base = { owner: "acc", variety: "", plotName: "", areaAcres: 1, transplantDate: null, harvestedOn: null, notes: "", createdAt: TODAY, plannedSowingDate: null } as const;
// onion: day 45, rabi; its day-45 weeding task is due today and one irrigation is overdue
const onionFc: FarmCrop = { ...base, id: "fc-on", cropId: "onion", kind: "seasonal", season: "rabi", seasonIndex: 2, variety: "N-2-4-1", plotName: { en: "Field near well", mr: "विहिरीजवळचे शेत" }, method: "transplant", status: "growing", sowingDate: addDays(TODAY, -45), durationDays: [150, 170] };
// pomegranate: planted 3 years ago, mrig bahar day 60
const pomFc: FarmCrop = { ...base, id: "fc-pm", cropId: "pomegranate", kind: "perennial", season: "perennial", seasonIndex: 0, plotName: { en: "Orchard", mr: "बाग" }, method: "transplant", status: "growing", sowingDate: null, durationDays: [0, 0], plantedOn: "2023-11-01", cycleKey: "mrig", cycleStart: addDays(TODAY, -60) };
// spray 6 days ago with a 10-day waiting period before harvest
const spray: FarmActivity = { id: "a1", farmCropId: "fc-on", type: "pesticide", date: addDays(TODAY, -6), productName: "X", preHarvestIntervalDays: 10, notes: "", createdAt: TODAY };

const parts = buildBriefing({ crops: [onionFc, pomFc], activities: [spray], taskStates: [], firstName: "सुरेश", getCrop: (id) => LIB[id] }, TODAY, "mr", NOW.getHours());
const text = Object.fromEntries(parts.map((p) => [p.id, p.text]));
const spoken = Object.fromEntries(parts.map((p) => [p.id, toSpokenMarathi(p.text, NOW)]));

if (process.argv.includes("--print")) {
  for (const p of parts) console.log(`${p.id}\n  ${p.text}\n  ${toSpokenMarathi(p.text, NOW)}`);
  process.exit(0);
}

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`✓ ${name}`);
};

check("greeting and summary", () => {
  assert.equal(text.greeting, "सुप्रभात सुरेश।");
  assert.match(text.summary, /^आज तुमच्या 2 पिकांसाठी \d+ कामे आहेत।$/);
  assert.match(spoken.summary, /^आज तुमच्या दोन पिकांसाठी [ऀ-ॿ ]+ कामे आहेत।$/);
});

check("onion: day 45, stage, spray waiting period", () => {
  assert.ok(text["fc-on"].startsWith("कांदा एन दोन चार एक, विहिरीजवळचे शेत: लागवडीपासून आज 45 दिवस झाले आहेत। पीक आता "));
  assert.ok(text["fc-on"].includes("शेवटची फवारणी 6 दिवसांपूर्वी झाली। 2026-11-06 पर्यंत काढणी करू नका।"));
  assert.ok(spoken["fc-on"].includes("लागवडीपासून आज पंचेचाळीस दिवस झाले आहेत।"));
  assert.ok(spoken["fc-on"].includes("शेवटची फवारणी सहा दिवसांपूर्वी झाली। सहा नोव्हेंबर पर्यंत काढणी करू नका।"));
});

check("pomegranate: orchard age and mrig bahar day 60", () => {
  assert.ok(text["fc-pm"].startsWith("डाळिंब बाग 3 वर्षांची आहे। मृग बहार सुरू होऊन 60 दिवस झाले। पीक आता "));
  assert.ok(spoken["fc-pm"].startsWith("डाळिंब बाग तीन वर्षांची आहे। मृग बहार सुरू होऊन साठ दिवस झाले।"));
  assert.match(spoken["fc-pm"], /काढणी साधारण [ऀ-ॿ ]+ ते [ऀ-ॿ ]+ दरम्यान अपेक्षित आहे।/);
  assert.ok(!/\d/.test(spoken["fc-pm"]), "no digits left after verbalizing");
});

check("exact Marathi text, before and after verbalizing", () => {
  assert.equal(text["fc-on"], "कांदा एन दोन चार एक, विहिरीजवळचे शेत: लागवडीपासून आज 45 दिवस झाले आहेत। पीक आता पुनर्लागवड टप्प्यात आहे। रोपवाटिकेला हलके पाणी द्या हे काम 5 दिवसांपासून बाकी आहे। रोपे तयार आहेत का ते पाहा हे काम 5 दिवसांपासून बाकी आहे। आज मुख्य शेत तयार करा। शेवटची फवारणी 6 दिवसांपूर्वी झाली। 2026-11-06 पर्यंत काढणी करू नका। काढणी साधारण 2027-02-15 ते 2027-03-07 दरम्यान अपेक्षित आहे।");
  assert.equal(spoken["fc-on"], "कांदा एन दोन चार एक, विहिरीजवळचे शेत: लागवडीपासून आज पंचेचाळीस दिवस झाले आहेत। पीक आता पुनर्लागवड टप्प्यात आहे। रोपवाटिकेला हलके पाणी द्या हे काम पाच दिवसांपासून बाकी आहे। रोपे तयार आहेत का ते पाहा हे काम पाच दिवसांपासून बाकी आहे। आज मुख्य शेत तयार करा। शेवटची फवारणी सहा दिवसांपूर्वी झाली। सहा नोव्हेंबर पर्यंत काढणी करू नका। काढणी साधारण पंधरा फेब्रुवारी ते सात मार्च दोन हजार सत्तावीस दरम्यान अपेक्षित आहे।");
  assert.equal(text["fc-pm"], "डाळिंब बाग 3 वर्षांची आहे। मृग बहार सुरू होऊन 60 दिवस झाले। पीक आता फुलोरा टप्प्यात आहे। सारखे पाणी द्या हे काम 7 दिवसांपासून बाकी आहे। फुले व पाने तपासा हे काम 6 दिवसांपासून बाकी आहे। काढणी साधारण 2027-04-01 ते 2027-04-30 दरम्यान अपेक्षित आहे।");
  assert.equal(spoken["fc-pm"], "डाळिंब बाग तीन वर्षांची आहे। मृग बहार सुरू होऊन साठ दिवस झाले। पीक आता फुलोरा टप्प्यात आहे। सारखे पाणी द्या हे काम सात दिवसांपासून बाकी आहे। फुले व पाने तपासा हे काम सहा दिवसांपासून बाकी आहे। काढणी साधारण एक ते तीस एप्रिल दोन हजार सत्तावीस दरम्यान अपेक्षित आहे।");
});

check("closing", () => assert.equal(text.closing, "काम झाले की ॲपमध्ये नोंद करा।"));

console.log(`\n${passed} checks passed`);
