/**
 * Pre-generates read-aloud audio for the Crop Library, which is the same for every user:
 *   SARVAM_API_KEY=... npm run tts:pregen            (Marathi; add --lang=mr,en for more)
 *   npm run tts:pregen -- --only=onion,pomegranate --dry-run
 *
 * For every crop × section × language it builds the text exactly as the app does
 * (sectionSpeech → prepareSpeech → the provider's chunks), hashes each chunk with the server's voice
 * id, and writes public/tts/<hash>.mp3 when missing, plus public/tts/manifest.json. The client
 * looks in the manifest first. Unchanged clips are skipped. To serve from S3/CloudFront instead,
 * upload public/tts/ and set NEXT_PUBLIC_TTS_STATIC_BASE to that base URL.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadAllCropFiles } from "./gen-crop-index.ts";
import { sectionSpeech, sectionsFor } from "../lib/crop-speech.ts";
import { cloudChunks, prepareSpeech } from "../lib/speech-text.ts";
import { getProvider, type TtsLang } from "../lib/tts/providers.ts";


const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const langs = (arg("lang") ?? "mr").split(",") as TtsLang[];
const only = arg("only")?.split(",");
const dry = process.argv.includes("--dry-run");
// your plan's price per 10,000 characters, e.g. --price=15 (₹); without it no cost is printed
const price = Number(arg("price") ?? process.env.TTS_PRICE_PER_10K ?? NaN);

const provider = getProvider();
if (!provider && !dry) {
  console.error("No TTS provider: set TTS_PROVIDER (sarvam | gemini | google) and its key (see .env.example).");
  process.exit(1);
}
const outDir = join(process.cwd(), "public", "tts");
if (!dry) mkdirSync(outDir, { recursive: true });
const manifestPath = join(outDir, "manifest.json");
const manifest: { files: Record<string, string> } = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : { files: {} };

const crops = (await loadAllCropFiles()).map((x) => x.crop).filter((c) => !only || only.includes(c.id));
let made = 0;
let skipped = 0;
let chars = 0;
let failed = 0;

for (const lang of langs) {
  if (lang === "hi") continue; // the library is read in Marathi or English
  const voice = provider?.voiceId(lang) ?? "dry-run";
  const seen = new Set<string>();
  for (const crop of crops) {
    for (const key of sectionsFor(crop)) {
      // "now is a good time to sow" depends on the month: generate each distinct variant
      for (const month of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
        const spoken = prepareSpeech(sectionSpeech(crop, key, lang as "en" | "mr", month), lang);
        // same split as the client (lib/speech.ts → cloudChunks with the provider's chunk size)
        for (const text of cloudChunks(spoken, provider?.chunkChars ?? 600)) {
          const hash = createHash("sha256").update(`${voice}\n${lang}\n${text}`).digest("hex");
          if (seen.has(hash)) continue;
          seen.add(hash);
          const file = `${hash}.mp3`;
          if (existsSync(join(outDir, file))) {
            manifest.files[hash] = file;
            skipped++;
            continue;
          }
          chars += text.length;
          if (dry) continue;
          try {
            const { audio } = await provider!.synthesize(text, lang);
            writeFileSync(join(outDir, file), audio);
            manifest.files[hash] = file;
            made++;
            if (made % 25 === 0) writeFileSync(manifestPath, JSON.stringify(manifest));
          } catch (e) {
            failed++;
            console.error(`✖ ${crop.id} ${key} (${lang}):`, (e as Error).message);
          }
        }
      }
    }
  }
}

if (!dry) writeFileSync(manifestPath, JSON.stringify(manifest));
console.log(`${dry ? "[dry run] " : ""}${made} new clips, ${skipped} unchanged, ${failed} failed`);
console.log(`characters ${dry ? "to send" : "sent"}: ${chars.toLocaleString("en-IN")}${Number.isFinite(price) ? ` · estimated cost ≈ ₹${Math.ceil((chars / 10_000) * price)}` : " (pass --price=<₹ per 10,000 characters> for a cost estimate)"}`);
