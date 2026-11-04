// Checks for lib/costs/templates.ts. No test runner needed:
//   npm run check:costs
import assert from "node:assert/strict";
import { loadAllCropFiles } from "../../scripts/gen-crop-index.ts";
import { isCategory } from "./categories.ts";
import { estimate } from "./estimate.ts";
import { GENERAL, TEMPLATES, templateFor, type CostTemplate } from "./templates.ts";

const crops = (await loadAllCropFiles()).map((x) => x.crop);
const byId = new Map(crops.map((c) => [c.id, c]));
const stagesOf = (id: string) => {
  const c = byId.get(id);
  if (!c) return new Set<string>();
  return new Set(c.lifecycle === "seasonal" ? c.stages.map((s) => s.key) : [...c.establishment.map((s) => s.key), ...c.cycles.flatMap((cy) => cy.stages.map((s) => s.key))]);
};
// "Product 2 ml per litre", "500 g/acre"… — doses never belong in a cost line
const DOSE = /\d+(\.\d+)?\s*(ml|gm?|kg|l|litre|लिटर|मिली|ग्रॅम)\s*(\/|per|प्रति)/i;

const warnings: string[] = [];
const ids = new Set<string>();
function checkTemplate(t: CostTemplate) {
  assert.ok(!ids.has(t.id), `${t.id}: duplicate template id`);
  ids.add(t.id);
  assert.ok(t.source.trim() && t.year > 2000, `${t.id}: needs source and year`);
  assert.ok(t.expectedYieldPerAcre[0] > 0 && t.expectedYieldPerAcre[1] >= t.expectedYieldPerAcre[0], `${t.id}: yield range`);
  const stages = stagesOf(t.cropId);
  const lineIds = new Set<string>();
  for (const l of t.lines) {
    const at = `${t.id}/${l.id}`;
    assert.ok(!lineIds.has(l.id), `${at}: duplicate line id`);
    lineIds.add(l.id);
    assert.ok(isCategory(l.category), `${at}: unknown category ${l.category}`);
    assert.ok(l.item.en.trim() && l.item.mr.trim(), `${at}: needs English and Marathi`);
    if (l.unit) assert.ok(l.unit.en && l.unit.mr, `${at}: unit needs both languages`);
    if (l.note) assert.ok(l.note.en && l.note.mr, `${at}: note needs both languages`);
    for (const v of [l.qtyPerAcre, l.defaultRate, l.amountPerAcre]) assert.ok(v === undefined || v >= 0, `${at}: negative number`);
    if (l.driver === "fixed") assert.ok(l.amountPerAcre !== undefined, `${at}: fixed line needs amountPerAcre`);
    else assert.ok(l.qtyPerAcre !== undefined && (l.rateKey || l.defaultRate !== undefined), `${at}: qty line needs qty and a rate`);
    if (l.stageKey && !t.general) assert.ok(stages.has(l.stageKey), `${at}: stage "${l.stageKey}" is not a stage of ${t.cropId}`);
    assert.ok(!DOSE.test(l.item.en) && !DOSE.test(l.item.mr), `${at}: looks like a product dose`);
  }
  const perAcre = estimate({ template: t, areaAcres: 1, rates: {} }).recurringTotal;
  if (perAcre < 8000 || perAcre > 250000) warnings.push(`${t.id}: ₹${perAcre}/acre looks unusual`);
}

for (const t of TEMPLATES) {
  assert.ok(byId.has(t.cropId), `${t.cropId}: not a Crop Library id`);
  checkTemplate(t);
}
for (const t of Object.values(GENERAL)) checkTemplate(t);

// every crop that can be added in My Farm gets a template or a category fallback
for (const c of crops) assert.ok(templateFor(c.id, c.category).lines.length > 0, `${c.id}: no estimate`);
for (const first of ["onion", "tomato", "soybean", "cotton", "tur", "chana", "jowar", "wheat", "sugarcane", "pomegranate", "turmeric", "marigold"])
  assert.ok(TEMPLATES.some((t) => t.cropId === first), `${first}: needs its own template`);
assert.ok(TEMPLATES.every((t) => t.reviewStatus === "draft"), "templates stay draft until a Mitra / KVK reviews them");

for (const w of warnings) console.warn("warning:", w);
console.log(`templates: ${TEMPLATES.length} crop templates + ${Object.keys(GENERAL).length} general, ${crops.length} crops covered — all checks passed`);
