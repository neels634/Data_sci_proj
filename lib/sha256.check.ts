// Assertion examples for lib/sha256.ts. No test runner needed:
//   npm run check:sha256
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { sha256Hex } from "./sha256.ts";

const real = (text: string) => createHash("sha256").update(text).digest("hex");

// the standard's own test values
assert.equal(sha256Hex(""), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
assert.equal(sha256Hex("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");

// every length around the block edges, Marathi text, and long text all match Node's own
for (let n = 0; n < 200; n++) assert.equal(sha256Hex("x".repeat(n)), real("x".repeat(n)), `length ${n}`);
assert.equal(sha256Hex("शेत समृद्धी"), real("शेत समृद्धी"));
assert.equal(sha256Hex("शेत".repeat(5000)), real("शेत".repeat(5000)));

// THE POINT: existing accounts still log in. This is the sample farmer's stored hash for PIN 1234
assert.equal(sha256Hex("udyamsetu:9876500001:1234"), "efae020f919fc05161ed04e90751ed85f963888871ffb55a29f38cb9f2b8e3e0");

console.log("sha256 checks passed");
