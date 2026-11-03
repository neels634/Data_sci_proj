/** What a voice should say: shared by lib/speech.ts (browser) and scripts/pregen-tts.ts (Node). */
import { toSpokenMarathi } from "./marathi-numbers.ts";

export type SpeechTextLang = "en" | "mr" | "hi";

/** Markdown symbols and emojis are never read out. */
export function cleanForSpeech(text: string) {
  return text
    .replace(/[*#_`]/g, "")
    .replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}\u{20E3}]/gu, "")
    .replace(/\s·\s/g, ", ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/** Split at sentence ends (। . ? ! newline) into chunks of at most ~180 characters. */
export function chunkText(text: string, max = 180): string[] {
  const sentences = text.split(/(?<=[।.?!])\s+|\n+/).map((x) => x.trim()).filter(Boolean);
  const out: string[] = [];
  let cur = "";
  const push = (s: string) => {
    if (!s) return;
    if (s.length <= max) return void out.push(s);
    // a very long sentence: break at commas, then spaces
    let rest = s;
    while (rest.length > max) {
      const cut = Math.max(rest.lastIndexOf(",", max), rest.lastIndexOf(" ", max));
      const at = cut > max / 3 ? cut + 1 : max;
      out.push(rest.slice(0, at).trim());
      rest = rest.slice(at).trim();
    }
    if (rest) out.push(rest);
  };
  for (const s of sentences) {
    if (cur && (cur + " " + s).length > max) {
      push(cur);
      cur = s;
    } else cur = cur ? `${cur} ${s}` : s;
  }
  push(cur);
  return out;
}

/** What a voice should actually say, in this language. */
export function prepareSpeech(text: string, lang: SpeechTextLang) {
  const clean = cleanForSpeech(text);
  return lang === "mr" ? toSpokenMarathi(clean) : clean;
}


/**
 * Chunks for the online voice: a short first chunk so audio starts quickly, then up to `max`
 * characters each. scripts/pregen-tts.ts uses the same split so pre-generated clips match.
 */
export function cloudChunks(text: string, max: number, firstMax = 200): string[] {
  const small = chunkText(text, Math.min(firstMax, max));
  if (small.length <= 1) return small;
  return [small[0], ...chunkText(small.slice(1).join(" "), max)];
}
