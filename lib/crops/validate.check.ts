// Validates every crop in lib/crops/data. Exits 1 on any error.
//   npm run check:crops                       — all crops, plus index consistency and a summary
//   npm run check:crops -- --only onion,garlic — only these files (for work in progress)
import { existsSync } from "node:fs";
import { join } from "node:path";
import { loadAllCropFiles } from "../../scripts/gen-crop-index.ts";
import { indexEntryOf } from "./index-entry.ts";
import type { CropInfo, CropStage, Region } from "../types.ts";

type Bi = { en: string; mr: string };
const errors: string[] = [];
const warnings: string[] = [];
const err = (id: string, msg: string) => errors.push(`${id}: ${msg}`);

const DEVANAGARI = /[ऀ-ॿ]/;
const isBi = (x: unknown): x is Bi => !!x && typeof x === "object" && Object.keys(x).length === 2 && "en" in x && "mr" in x;

/** visit every Bi in a crop, with a readable path */
function eachBi(x: unknown, path: string, fn: (b: Bi, path: string) => void) {
  if (isBi(x)) return fn(x, path);
  if (Array.isArray(x)) x.forEach((v, i) => eachBi(v, `${path}[${i}]`, fn));
  else if (x && typeof x === "object") for (const [k, v] of Object.entries(x)) eachBi(v, path ? `${path}.${k}` : k, fn);
}

// a number + dose unit, then within a few words a per-volume/area phrase, near spray words
const DOSE = /\d+(?:[.,]\d+)?\s*(?:ml|g|gm|kg|ग्रॅम|मिली|किलो)\b[^.।]{0,40}?(?:per\s+lit(?:re|er)|\/\s*l\b|प्रति\s*लिटर|per\s+acre|प्रति\s*एकर|एकरी)/i;
const SPRAY = /spray|फवार|insecticid|कीटकनाशक|fungicid|बुरशीनाशक|herbicid|तणनाशक|pesticid/i;

function checkStages(id: string, label: string, stages: CropStage[], end: number | null) {
  if (!stages.length) return err(id, `${label}: no stages`);
  if (stages[0].startDay !== 0) err(id, `${label}: first stage must start on day 0`);
  stages.forEach((s, i) => {
    if (s.endDay <= s.startDay) err(id, `${label}/${s.key}: endDay must be after startDay`);
    if (i > 0 && s.startDay !== stages[i - 1].endDay) err(id, `${label}/${s.key}: starts on ${s.startDay}, previous ends on ${stages[i - 1].endDay}`);
    if (s.tasks.length < 2) err(id, `${label}/${s.key}: needs at least 2 tasks (has ${s.tasks.length})`);
    for (const t of s.tasks) {
      if (t.dayOffset < s.startDay || t.dayOffset >= s.endDay) err(id, `${label}/${t.id}: day ${t.dayOffset} is outside ${s.key} (${s.startDay}–${s.endDay})`);
      if (t.repeatEveryDays != null && t.repeatEveryDays <= 0) err(id, `${label}/${t.id}: repeatEveryDays must be > 0`);
    }
  });
  if (end != null && stages[stages.length - 1].endDay !== end) err(id, `${label}: last stage ends on ${stages[stages.length - 1].endDay}, expected ${end}`);
}

const months = (id: string, label: string, m: number[]) => {
  if (!m.length) err(id, `${label}: empty months`);
  for (const x of m) if (!Number.isInteger(x) || x < 1 || x > 12) err(id, `${label}: month ${x} outside 1–12`);
};
const range = (id: string, label: string, r: [number, number] | undefined) => {
  if (r && (r.length !== 2 || r[0] > r[1] || r[0] < 0)) err(id, `${label}: bad range ${JSON.stringify(r)}`);
};

function checkCrop(c: CropInfo, file: string) {
  const id = c.id || file;
  if (`${c.id}.ts` !== file) err(id, `file name ${file} must be ${c.id}.ts`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.id)) err(id, "id must be kebab-case");
  if (!c.emoji) err(id, "missing emoji");
  if (!c.regions.length) err(id, "regions is empty");
  if (!c.aliases.length) err(id, "aliases is empty");
  if (!c.source.trim()) err(id, "source is empty");
  if (/https?:|www\./i.test(c.source)) err(id, "source must not contain a link");
  const problems = c.commonProblems.length;
  if (problems < 2) err(id, `needs at least 2 common problems (has ${problems})`);
  if (c.tier === 1 && problems < 4) warnings.push(`${id}: tier 1 crop has ${problems} problems (aim for 4+)`);

  eachBi(c, "", (b, path) => {
    if (!b.en.trim()) err(id, `${path}: empty English`);
    if (!b.mr.trim()) err(id, `${path}: empty Marathi`);
    else if (!DEVANAGARI.test(b.mr)) err(id, `${path}: Marathi has no Devanagari ("${b.mr.slice(0, 40)}")`);
    for (const text of [b.en, b.mr])
      if (DOSE.test(text) && SPRAY.test(text)) err(id, `${path}: looks like a chemical dose — "${text.slice(0, 120)}"`);
  });

  if (c.lifecycle === "seasonal") {
    if (!c.seasons.length) err(id, "no seasons");
    c.seasons.forEach((s, i) => {
      months(id, `seasons[${i}]`, s.sowingMonths);
      range(id, `seasons[${i}].durationDays`, s.durationDays);
    });
    const max = Math.max(...c.seasons.map((s) => s.durationDays[1]));
    if (c.stages.length < 4) err(id, `needs at least 4 stages (has ${c.stages.length})`);
    checkStages(id, "stages", c.stages, max);
    if (c.ratoon) range(id, "ratoon.durationDays", c.ratoon.durationDays);
    if (c.flushes && (c.flushes.everyDays <= 0 || c.flushes.count < 1)) err(id, "flushes needs everyDays > 0 and count ≥ 1");
    const ids = c.stages.flatMap((s) => s.tasks.map((t) => t.id));
    if (new Set(ids).size !== ids.length) err(id, "duplicate task ids");
  } else {
    months(id, "plantingMonths", c.plantingMonths);
    range(id, "plantsPerAcre", c.plantsPerAcre);
    range(id, "yearsToFirstHarvest", c.yearsToFirstHarvest);
    range(id, "economicLifeYears", c.economicLifeYears);
    checkStages(id, "establishment", c.establishment, null);
    if (!c.cycles.length) err(id, "needs at least one cycle");
    const keys = new Set<string>();
    for (const cy of c.cycles) {
      if (keys.has(cy.key)) err(id, `duplicate cycle key ${cy.key}`);
      keys.add(cy.key);
      months(id, `cycles.${cy.key}.startMonths`, cy.startMonths);
      months(id, `cycles.${cy.key}.harvestMonths`, cy.harvestMonths);
      checkStages(id, `cycles.${cy.key}`, cy.stages, null);
    }
    const ids = [...c.establishment, ...c.cycles.flatMap((cy) => cy.stages)].flatMap((s) => s.tasks.map((t) => t.id));
    if (new Set(ids).size !== ids.length) err(id, "duplicate task ids across establishment and cycles");
  }
}

const norm = (s: string) => s.normalize("NFC").toLowerCase().replace(/[\s​-‍]/g, "");

async function main() {
  const only = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1]?.split(",").map((s) => s.trim()) : null;
  let all = await loadAllCropFiles();
  if (only) {
    const missing = only.filter((id) => !all.some((x) => x.file === `${id}.ts`));
    for (const m of missing) err(m, "no data file");
    all = all.filter((x) => only.includes(x.file.replace(/\.ts$/, "")));
  }

  for (const { file, crop } of all) {
    try {
      checkCrop(crop, file);
    } catch (e) {
      err(file, `crashed while checking: ${(e as Error).message}`);
    }
  }

  // duplicate ids / aliases across all crops (aliases are checked against every crop, even in --only mode)
  const everything = only ? await loadAllCropFiles() : all;
  const seenId = new Map<string, string>();
  const seenAlias = new Map<string, string>();
  for (const { crop } of everything) {
    if (seenId.has(crop.id)) err(crop.id, "duplicate id");
    seenId.set(crop.id, crop.id);
    for (const a of new Set([...crop.aliases.map(norm)])) {
      const other = seenAlias.get(a);
      if (other && other !== crop.id && (!only || only.includes(crop.id) || only.includes(other))) err(crop.id, `alias "${a}" is also used by ${other}`);
      seenAlias.set(a, crop.id);
    }
  }

  if (!only) {
    const gen = join(import.meta.dirname, "index.generated.ts");
    if (!existsSync(gen)) err("index", "lib/crops/index.generated.ts missing — run `npm run crops:index`");
    else {
      const { CROP_INDEX } = (await import(`./index.generated.ts?${Date.now()}`)) as { CROP_INDEX: ReturnType<typeof indexEntryOf>[] };
      const byId = new Map(CROP_INDEX.map((e) => [e.id, e]));
      for (const { crop } of all) {
        const e = byId.get(crop.id);
        if (!e) err(crop.id, "not in the index — run `npm run crops:index`");
        else if (JSON.stringify(e) !== JSON.stringify(indexEntryOf(crop))) err(crop.id, "index entry is out of date — run `npm run crops:index`");
      }
      for (const e of CROP_INDEX) if (!all.some((x) => x.crop.id === e.id)) err(e.id, "in the index but has no data file");
    }

    const count = <K extends string>(f: (c: CropInfo) => K[]) =>
      Object.entries(
        all.reduce<Record<string, number>>((acc, { crop }) => {
          for (const k of f(crop)) acc[k] = (acc[k] ?? 0) + 1;
          return acc;
        }, {}),
      )
        .map(([k, n]) => `${k} ${n}`)
        .join(", ");
    console.log(`\n${all.length} crops`);
    console.log(`  by category: ${count((c) => [c.category])}`);
    console.log(`  by tier:     ${count((c) => [`tier${c.tier}`])}`);
    console.log(`  by region:   ${count((c) => c.regions as Region[])}`);
    console.log(`  lifecycle:   ${count((c) => [c.lifecycle])}`);
    console.log(`  draft:       ${all.filter(({ crop }) => crop.reviewStatus === "draft").length}`);
  }

  for (const w of warnings) console.log(`warning  ${w}`);
  for (const e of errors) console.log(`ERROR    ${e}`);
  console.log(errors.length ? `\n✖ ${errors.length} error(s)` : `\n✓ ${only ? `${all.length} crop file(s)` : "all crops"} valid`);
  process.exit(errors.length ? 1 : 0);
}

await main();
