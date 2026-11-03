// Checks for lib/grades.ts. No test runner needed:
//   npm run check:grades
import assert from "node:assert/strict";
import { CROP_INDEX } from "./crops/index.ts";
import { convert, GRADINGS, isLowestGrade, VARIES_NOTE } from "./grades.ts";

const bi = (x: { en: string; mr: string } | undefined, where: string) => {
  assert.ok(x && x.en.trim() && x.mr.trim(), `${where}: needs English and Marathi text`);
};

const libraryIds = new Set(CROP_INDEX.map((c) => c.id));
const codes = new Set<string>();

assert.equal(GRADINGS.length, 10, "10 crops");
bi(VARIES_NOTE, "VARIES_NOTE");
for (const g of GRADINGS) {
  const at = g.cropId;
  assert.ok(libraryIds.has(g.cropId), `${at}: not a Crop Library id`);
  assert.ok(!codes.has(g.cropId), `${at}: listed twice`);
  codes.add(g.cropId);
  bi(g.name, at);
  bi(g.notes, `${at} notes`);
  if (g.moistureRequired) assert.ok(typeof g.moistureLimit === "number" && g.moistureLimit > 0, `${at}: moistureRequired needs moistureLimit`);
  for (const t of g.typeOptions ?? []) {
    assert.ok(t.code.startsWith(`${g.cropId}.`), `${t.code}: type code must start with the crop id`);
    assert.ok(!codes.has(t.code), `${t.code}: duplicate code`);
    codes.add(t.code);
    bi(t.name, t.code);
  }
  assert.ok(g.grades.length > 0, `${at}: no grades`);
  const ranks = g.grades.map((x) => x.rank).sort((a, b) => a - b);
  assert.deepEqual(ranks, ranks.map((_, i) => i + 1), `${at}: ranks must be 1..${ranks.length} without gaps`);
  for (const x of g.grades) {
    assert.ok(x.code.startsWith(`${g.cropId}.`), `${x.code}: grade code must start with the crop id`);
    assert.ok(!codes.has(x.code), `${x.code}: duplicate code`);
    codes.add(x.code);
    bi(x.name, x.code);
    bi(x.howToIdentify, `${x.code} howToIdentify`);
  }
}

// spot checks
assert.equal(isLowestGrade("onion.jod"), true);
assert.equal(isLowestGrade("onion.super_gole"), false);
assert.equal(isLowestGrade("soybean.non_faq"), true);
assert.equal(convert(1, "quintal", "10kg"), 10);
assert.equal(convert(5, "crate20kg", "kg"), 100);

console.log(`grades: ${GRADINGS.length} crops, ${codes.size} codes — all checks passed`);
