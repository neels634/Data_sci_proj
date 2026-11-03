/**
 * Server-only text-to-speech providers for /api/tts. Keys never leave the server.
 *
 * TTS_PROVIDER=sarvam (default) | gemini | google | off
 * - Sarvam AI Bulbul: POST https://api.sarvam.ai/text-to-speech, header api-subscription-key,
 *   body { text, language_code, model, speaker, pace, speech_sample_rate, output_audio_codec },
 *   response { request_id, audios: [base64] }. Up to 2,500 characters per request.
 * - Gemini speech generation: POST .../v1beta/models/<model>:generateContent with
 *   responseModalities ["AUDIO"] and a prebuilt voice, same GEMINI_API_KEY as /api/chat. Returns
 *   base64 audio in candidates[0].content.parts[0].inlineData: raw 16-bit PCM (e.g.
 *   "audio/L16;codec=pcm;rate=24000", wrapped here in a WAV header) or, on newer models, a WAV.
 * - Google Cloud Text-to-Speech (mr-IN), kept as another option.
 */

export type TtsLang = "mr" | "hi" | "en";

export interface TtsProvider {
  name: "sarvam" | "gemini" | "google";
  maxChars: number;
  /** the client splits text into requests of at most this many characters */
  chunkChars: number;
  /** the client gives up on the first clip after this long and uses the phone's voice */
  firstChunkMs: number;
  /** model + speaker for cache keys and the client's cache key */
  voiceId(lang: TtsLang): string;
  /** `speaker` overrides the configured voice (dev test page only) */
  synthesize(text: string, lang: TtsLang, speaker?: string): Promise<{ audio: Uint8Array; mime: string }>;
}

/** A provider error with a short message that is safe to show the client. */
export class TtsError extends Error {
  status: number;
  publicMessage: string;
  constructor(status: number, publicMessage: string) {
    super(publicMessage);
    this.status = status;
    this.publicMessage = publicMessage;
  }
}

const LANG_CODE: Record<TtsLang, string> = { mr: "mr-IN", hi: "hi-IN", en: "en-IN" };

// Bulbul v3 uses short names; v4-flash uses <name>_<lang>_<style> personas (docs.sarvam.ai, Voices).
const V3_SPEAKERS = new Set("shubh aditya ritu priya neha rahul pooja rohan simran kavya amit dev ishita shreya ratan varun manan sumit roopa kabir aayan ashutosh advait anand tanya tarun sunny mani gokul vijay shruti suhani mohit kavitha rehan soham rupali".split(" "));
const DEFAULT_SPEAKER: Record<string, Partial<Record<TtsLang, string>>> = {
  "bulbul:v4-flash": { mr: "ishita_mr_conversational" },
  "bulbul:v3": { mr: "rupali", hi: "ritu", en: "shubh" },
};

/** Does this speaker name belong to this model? */
export function speakerMatchesModel(model: string, speaker: string) {
  if (model === "bulbul:v3") return V3_SPEAKERS.has(speaker);
  if (model === "bulbul:v4-flash") return /^[a-z]+_[a-z]{2,4}_[a-z]+$/.test(speaker);
  return true;
}

function sarvam(modelOverride?: string): TtsProvider | null {
  const key = process.env.SARVAM_API_KEY;
  if (!key) return null;
  const model = modelOverride || process.env.TTS_MODEL || "bulbul:v4-flash";
  const speakerFor = (lang: TtsLang) =>
    (lang === "mr" ? process.env.TTS_SPEAKER_MR : lang === "hi" ? process.env.TTS_SPEAKER_HI : process.env.TTS_SPEAKER_EN) || DEFAULT_SPEAKER[model]?.[lang] || "";
  for (const lang of ["mr", "hi"] as const) {
    const sp = speakerFor(lang);
    if (sp && !speakerMatchesModel(model, sp))
      console.error(`tts: speaker "${sp}" (${lang}) does not match TTS_MODEL "${model}". bulbul:v3 uses short names like "rupali"; bulbul:v4-flash uses personas like "ishita_mr_conversational".`);
  }
  return {
    name: "sarvam",
    maxChars: 1500, // API allows 2,500; smaller requests start playing sooner
    chunkChars: 600,
    firstChunkMs: 4000,
    voiceId: (lang) => `sarvam|${model}|${speakerFor(lang)}`,
    async synthesize(text, lang, override) {
      const speaker = override || speakerFor(lang);
      const res = await fetch("https://api.sarvam.ai/text-to-speech", {
        method: "POST",
        headers: { "api-subscription-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          language_code: LANG_CODE[lang],
          model,
          ...(speaker ? { speaker } : {}),
          pace: 0.95,
          speech_sample_rate: 22050,
          output_audio_codec: "mp3",
          ...(process.env.SARVAM_DICT_ID ? { dict_id: process.env.SARVAM_DICT_ID } : {}),
        }),
        signal: AbortSignal.timeout(15_000),
      });
      const data = (await res.json().catch(() => ({}))) as { request_id?: string; audios?: string[]; error?: { message?: string; request_id?: string } };
      if (!res.ok) {
        console.error(`tts: Sarvam ${res.status} request_id=${data.error?.request_id ?? data.request_id ?? "-"}: ${data.error?.message ?? ""}`);
        if (res.status === 403) throw new TtsError(502, "Voice service key is not valid");
        if (res.status === 422 || res.status === 400) throw new TtsError(502, "Voice service settings are not valid");
        if (res.status === 429) throw new TtsError(429, "Voice service is busy — please try later");
        throw new TtsError(502, "Voice service error");
      }
      if (!data.audios?.length) throw new TtsError(502, "Voice service returned no audio");
      return { audio: new Uint8Array(Buffer.from(data.audios.join(""), "base64")), mime: "audio/mpeg" };
    },
  };
}

function google(): TtsProvider | null {
  const key = process.env.GOOGLE_TTS_API_KEY;
  if (!key) return null;
  const voice = process.env.GOOGLE_TTS_VOICE;
  return {
    name: "google",
    maxChars: 1000,
    chunkChars: 600,
    firstChunkMs: 4000,
    voiceId: (lang) => `google|${LANG_CODE[lang]}|${voice ?? ""}`,
    async synthesize(text, lang) {
      const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(key)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: LANG_CODE[lang], ...(voice && lang === "mr" ? { name: voice } : {}) },
          audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 },
        }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) {
        console.error("tts: Google returned", res.status, await res.text().catch(() => ""));
        throw new TtsError(res.status === 429 ? 429 : 502, "Voice service error");
      }
      const data = (await res.json()) as { audioContent?: string };
      if (!data.audioContent) throw new TtsError(502, "Voice service returned no audio");
      return { audio: new Uint8Array(Buffer.from(data.audioContent, "base64")), mime: "audio/mpeg" };
    },
  };
}

const LANG_NAME: Record<TtsLang, string> = { mr: "Marathi", hi: "Hindi", en: "Indian English" };

/** A 44-byte RIFF/WAVE header in front of 16-bit little-endian PCM. */
export function pcmToWav(pcm: Uint8Array, sampleRate = 24000, channels = 1): Uint8Array {
  const out = new Uint8Array(44 + pcm.length);
  const v = new DataView(out.buffer);
  const ascii = (at: number, str: string) => [...str].forEach((c, i) => v.setUint8(at + i, c.charCodeAt(0)));
  ascii(0, "RIFF");
  v.setUint32(4, 36 + pcm.length, true);
  ascii(8, "WAVE");
  ascii(12, "fmt ");
  v.setUint32(16, 16, true); // fmt chunk size
  v.setUint16(20, 1, true); // PCM
  v.setUint16(22, channels, true);
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * channels * 2, true); // byte rate
  v.setUint16(32, channels * 2, true); // block align
  v.setUint16(34, 16, true); // bits per sample
  ascii(36, "data");
  v.setUint32(40, pcm.length, true);
  out.set(pcm, 44);
  return out;
}

function gemini(modelOverride?: string): TtsProvider | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  // gemini-2.5-flash-preview-tts also works (raw PCM) but is slower and no longer in Google's model list
  const model = modelOverride || process.env.TTS_MODEL_GEMINI || "gemini-3.8-flash-lite-tts";
  const voice = process.env.TTS_VOICE_GEMINI || "Kore";
  return {
    name: "gemini",
    maxChars: 800,
    chunkChars: 800,
    firstChunkMs: 6000,
    voiceId: () => `gemini|${model}|${voice}`,
    async synthesize(text, lang, override) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Read this aloud in natural, warm ${LANG_NAME[lang]} at a calm pace, exactly as written:\n\n${text}` }] }],
          generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: override || voice } } } },
        }),
        signal: AbortSignal.timeout(20_000),
      });
      const data = (await res.json().catch(() => ({}))) as {
        candidates?: { content?: { parts?: { inlineData?: { mimeType?: string; data?: string } }[] } }[];
        error?: { message?: string; status?: string };
      };
      if (!res.ok) {
        console.error(`tts: Gemini ${res.status} ${data.error?.status ?? ""}: ${data.error?.message ?? ""}`);
        if (res.status === 429) throw new TtsError(429, "Online voice is busy");
        if (res.status === 400 || res.status === 403) throw new TtsError(502, "Voice service settings are not valid");
        throw new TtsError(502, "Voice service error");
      }
      const inline = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData;
      if (!inline?.data) throw new TtsError(502, "Voice service returned no audio");
      const bytes = new Uint8Array(Buffer.from(inline.data, "base64"));
      const mime = (inline.mimeType ?? "").toLowerCase();
      // newer models already send a WAV; older ones send headerless PCM
      if (mime.includes("wav") || Buffer.from(bytes.subarray(0, 4)).toString("latin1") === "RIFF") return { audio: bytes, mime: "audio/wav" };
      const rate = Number(/rate=(\d+)/.exec(mime)?.[1] ?? 24000);
      return { audio: pcmToWav(bytes, rate), mime: "audio/wav" };
    },
  };
}

/** The configured provider (or, on the dev test page, a chosen one); null when off or without a key. */
export function getProvider(which = process.env.TTS_PROVIDER || "sarvam", model?: string): TtsProvider | null {
  if (which === "off") return null;
  return which === "google" ? google() : which === "gemini" ? gemini(model) : sarvam(model);
}

export const GEMINI_VOICES = ["Kore", "Aoede", "Leda", "Callirrhoe", "Autonoe", "Puck", "Charon", "Fenrir", "Orus", "Zephyr"];

/** Speakers offered on the dev test page (docs.sarvam.ai → Text-to-Speech → Voices). */
export const MARATHI_SPEAKERS: Record<string, string[]> = {
  "bulbul:v4-flash": ["ishita_mr_conversational", "nilesh_mr_conversation", "neha_mr_narration", "soham_mr_narration", "mrunal_mr_narration", "ritu_mr_narration", "rupali_mr_stories", "mukul_mr_stories"],
  "bulbul:v3": ["rupali", "soham", "ritu", "shubh", "ishita", "neha"],
};
