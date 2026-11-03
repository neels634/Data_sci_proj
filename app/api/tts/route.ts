/**
 * Text-to-speech for read-aloud (Marathi first). The provider and its key live on the server
 * (lib/tts/providers.ts); the browser only sends crop/task text that is already verbalized by
 * toSpokenMarathi (numbers as words). Never send phone numbers, addresses or full names here.
 *
 * GET  /api/tts?lang=mr → { provider, voice, chunkChars, firstChunkMs } for the client's cache key and chunking
 * POST /api/tts { text, lang } → audio/mpeg
 */
import { createHash } from "node:crypto";
import { getProvider, TtsError, type TtsLang } from "@/lib/tts/providers";

export const dynamic = "force-dynamic";

const PER_MINUTE = 30; // requests per visitor per minute
const CACHE_MAX = 200; // synthesized clips kept in memory
// part of every cache key: bump it to drop all cached clips (v2: Gemini without a spoken instruction)
const CACHE_VERSION = "v2";

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

/** LRU: a hit moves the clip to the end; the oldest leaves first */
const cache = new Map<string, { audio: Uint8Array; mime: string }>();
const remember = (key: string, v: { audio: Uint8Array; mime: string }) => {
  cache.delete(key);
  cache.set(key, v);
  if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value as string);
};

const fail = (error: string, status: number) => Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
const audioResponse = (v: { audio: Uint8Array; mime: string }, source: string) =>
  new Response(new Uint8Array(v.audio), { headers: { "Content-Type": v.mime, "Cache-Control": "private, max-age=604800", "X-TTS-Source": source } });
const LANGS = new Set<TtsLang>(["mr", "hi", "en"]);

export function GET(req: Request) {
  const p = getProvider();
  if (!p) return fail("Cloud voice is not configured", 503);
  const lang = (new URL(req.url).searchParams.get("lang") ?? "mr") as TtsLang;
  return Response.json({ provider: p.name, voice: p.voiceId(LANGS.has(lang) ? lang : "mr"), maxChars: p.maxChars, chunkChars: p.chunkChars, firstChunkMs: p.firstChunkMs }, { headers: { "Cache-Control": "no-store" } });
}

const DEV = process.env.NODE_ENV !== "production";
const str = (v: unknown) => (typeof v === "string" && v.length < 80 ? v : undefined);

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { text?: unknown; lang?: unknown; provider?: unknown; model?: unknown; speaker?: unknown };
  // provider / model / speaker overrides exist only for the /dev/voice test page
  const speaker = DEV ? str(body.speaker) : undefined;
  const provider = DEV && (body.provider || body.model) ? getProvider(str(body.provider), str(body.model)) : getProvider();
  if (!provider) return fail("Cloud voice is not configured", 503);

  const lang = body.lang as TtsLang;
  if (!LANGS.has(lang)) return fail("Unsupported language", 400);
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) return fail("No text", 400);
  if (text.length > provider.maxChars) return fail(`Text longer than ${provider.maxChars} characters`, 413);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return fail("Too many requests — please wait a minute", 429);

  const hash = createHash("sha256").update(`${CACHE_VERSION}|${provider.voiceId(lang)}|${speaker ?? ""}\n${lang}\n${text}`).digest("hex");
  const hit = cache.get(hash);
  if (hit) {
    remember(hash, hit);
    return audioResponse(hit, "server-cache");
  }
  try {
    const v = await provider.synthesize(text, lang, speaker);
    remember(hash, v);
    return audioResponse(v, provider.name);
  } catch (e) {
    if (e instanceof TtsError) return fail(e.publicMessage, e.status);
    console.error("tts: request failed", e);
    return fail("Voice service unreachable", 502);
  }
}
