/**
 * Optional cloud voice for Marathi, used only when the phone has no Marathi or Hindi voice.
 *
 * Off unless the server has TTS_PROVIDER=google and GOOGLE_TTS_API_KEY (the key stays here), and
 * the client is built with NEXT_PUBLIC_TTS_CLOUD=1. Uses Google Cloud Text-to-Speech with
 * languageCode "mr-IN"; set GOOGLE_TTS_VOICE (e.g. an mr-IN voice name from Google's voice list)
 * to pick a specific voice, otherwise Google chooses its default mr-IN voice.
 * The text arrives already verbalized by toSpokenMarathi (numbers as words).
 */
import { createHash } from "node:crypto";

export const dynamic = "force-dynamic";

const ENDPOINT = "https://texttospeech.googleapis.com/v1/text:synthesize";
const MAX_TEXT = 1000; // characters per request
const PER_MINUTE = 30; // requests per visitor per minute
const CACHE_MAX = 200; // synthesized clips kept in memory

// same simple per-visitor limit as app/api/chat/route.ts
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > PER_MINUTE;
}

/** the same crop section isn't synthesized twice; oldest entries leave first */
const cache = new Map<string, Buffer>();
const remember = (key: string, audio: Buffer) => {
  cache.set(key, audio);
  if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value as string);
};

const fail = (error: string, status: number) => Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
const mp3 = (audio: Buffer) => new Response(new Uint8Array(audio), { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  const key = process.env.GOOGLE_TTS_API_KEY;
  if (process.env.TTS_PROVIDER !== "google" || !key) return fail("Cloud voice is not configured", 503);

  const body = (await req.json().catch(() => ({}))) as { text?: unknown; lang?: unknown };
  if (body.lang !== "mr") return fail("Only Marathi is supported", 400);
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) return fail("No text", 400);
  if (text.length > MAX_TEXT) return fail(`Text longer than ${MAX_TEXT} characters`, 413);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return fail("Too many requests — please wait a minute", 429);

  const hash = createHash("sha256").update(`mr\n${text}`).digest("hex");
  const cached = cache.get(hash);
  if (cached) return mp3(cached);

  try {
    const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: "mr-IN", ...(process.env.GOOGLE_TTS_VOICE ? { name: process.env.GOOGLE_TTS_VOICE } : {}) },
        audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 },
      }),
    });
    if (!res.ok) {
      console.error("tts: Google returned", res.status, await res.text().catch(() => ""));
      return fail("Voice service error", 502);
    }
    const data = (await res.json()) as { audioContent?: string };
    if (!data.audioContent) return fail("Voice service returned no audio", 502);
    const audio = Buffer.from(data.audioContent, "base64");
    remember(hash, audio);
    return mp3(audio);
  } catch (e) {
    console.error("tts: request failed", e);
    return fail("Voice service unreachable", 502);
  }
}
