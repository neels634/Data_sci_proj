"use client";

/**
 * The one place that speaks text aloud (client only). Every read-aloud button uses `useSpeech()`.
 *
 * - Voices load asynchronously in most browsers, so `loadVoices()` waits for `voiceschanged`.
 * - Marathi is read by a Marathi voice, else a Hindi voice (it reads Devanagari), never an English
 *   voice. Numbers, money, units and dates are turned into Marathi words first.
 * - Text is split into short chunks: Chrome cuts long utterances and some Android engines stop
 *   after ~15 s.
 * - Only one thing speaks at a time across the app; speech stops on route or language change.
 * - With NEXT_PUBLIC_TTS_CLOUD=1 and "Natural voice" on, Marathi/Hindi use the online neural voice
 *   (/api/tts → Sarvam Bulbul, key on the server) first. Clips are kept in Cache Storage so a
 *   second play works offline; pre-generated clips (public/tts/manifest.json) are used first.
 *   If the online voice fails or is slower than 4 s, the phone's voice is used for that playback.
 */
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { useStore } from "./store";

export type SpeechLang = "en" | "mr" | "hi";
export type VoiceQuality = "native" | "fallback-hindi" | "none";

const supported = () => typeof window !== "undefined" && "speechSynthesis" in window;
export const CLOUD_TTS = process.env.NEXT_PUBLIC_TTS_CLOUD === "1";

// ---- voices -------------------------------------------------------------------------------

let voiceCache: SpeechSynthesisVoice[] | null = null;

/** All voices on the device. Waits up to 2 s for them to load. */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!supported()) return Promise.resolve([]);
  // the live list wins: voices can be installed or loaded after we first looked
  const now = window.speechSynthesis.getVoices();
  if (now.length) return Promise.resolve((voiceCache = now));
  if (voiceCache?.length) return Promise.resolve(voiceCache);
  return new Promise((resolve) => {
    const done = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", done);
      clearTimeout(timer);
      resolve((voiceCache = window.speechSynthesis.getVoices()));
    };
    const timer = setTimeout(done, 2000);
    window.speechSynthesis.addEventListener("voiceschanged", done);
  });
}

const starts = (v: SpeechSynthesisVoice, p: string) => v.lang.toLowerCase().replace("_", "-").startsWith(p);
/** local voices first, then Google ones, then the rest */
const rank = (v: SpeechSynthesisVoice) => (v.localService ? 0 : /google/i.test(v.name) ? 1 : 2);
const best = (list: SpeechSynthesisVoice[]) => [...list].sort((a, b) => rank(a) - rank(b))[0] ?? null;

export function pickVoice(lang: SpeechLang, voices: SpeechSynthesisVoice[]): { voice: SpeechSynthesisVoice | null; quality: VoiceQuality } {
  if (lang === "mr") {
    const mr = best(voices.filter((v) => starts(v, "mr")));
    if (mr) return { voice: mr, quality: "native" };
    const hi = best(voices.filter((v) => starts(v, "hi")));
    if (hi) return { voice: hi, quality: "fallback-hindi" };
    return { voice: null, quality: "none" };
  }
  if (lang === "hi") {
    const hi = best(voices.filter((v) => starts(v, "hi")));
    return hi ? { voice: hi, quality: "native" } : { voice: null, quality: "none" };
  }
  const en = best(voices.filter((v) => starts(v, "en-in"))) ?? best(voices.filter((v) => starts(v, "en")));
  return en ? { voice: en, quality: "native" } : { voice: null, quality: "none" };
}

// ---- text preparation (lib/speech-text.ts, shared with scripts/pregen-tts.ts) ------------------

export { chunkText, cleanForSpeech, prepareSpeech } from "./speech-text";
import { chunkText, cloudChunks, prepareSpeech } from "./speech-text";

// ---- one speaker for the whole app -----------------------------------------------------------

export interface SpeechController {
  stop(): void;
  onEnd(cb: () => void): void;
}

type Current = { id: string | null; controller: SpeechController } | null;
let current: Current = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const speakingIdNow = () => current?.id ?? null;

/** Stop whatever is speaking, anywhere in the app. */
export function stopSpeech() {
  generation++;
  setLoading(null);
  const c = current;
  current = null;
  c?.controller.stop();
  emit();
}

function makeController(stopImpl: () => void): SpeechController & { finish(): void } {
  const ends: (() => void)[] = [];
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    ends.forEach((cb) => cb());
  };
  return {
    stop() {
      stopImpl();
      finish();
    },
    onEnd(cb) {
      if (done) cb();
      else ends.push(cb);
    },
    finish,
  };
}

export type SpeakResult =
  | { ok: true; controller: SpeechController; quality: VoiceQuality; source: AudioSource; fellBack: boolean; busy?: boolean }
  | { ok: false; reason: "unsupported" | "no-marathi-voice" | "error"; quality: VoiceQuality; fellBack: boolean; busy?: boolean };

/** Where the audio came from: pre-generated file, this phone's cache, the server, or the phone's own voice. */
export type AudioSource = "manifest" | "cache" | "network" | "phone";
export interface SpeakInfo {
  source: AudioSource;
  /** tap → first sound, in ms */
  firstAudioMs: number;
}

let generation = 0;

/**
 * Speak `text` in `lang`. Cancels anything already speaking. Resolves once audio has started (or
 * failed). Marathi and Hindi use the online neural voice first when `cloud` is on, then the phone's
 * Marathi voice, then its Hindi voice; never an English voice.
 */
export async function speak(text: string, lang: SpeechLang, opts: { id?: string; cloud?: boolean; onInfo?: (i: SpeakInfo) => void } = {}): Promise<SpeakResult> {
  stopSpeech();
  const gen = ++generation;
  const t0 = performance.now();
  const id = opts.id ?? null;
  const spoken = prepareSpeech(text, lang);
  let fellBack = false;
  let busy = false;
  if (!spoken) return { ok: false, reason: "error", quality: "none", fellBack };

  if (lang !== "en" && CLOUD_TTS && opts.cloud !== false) {
    setLoading(id);
    const r = await speakCloud(spoken, lang, id, gen, t0, opts.onInfo);
    if (gen !== generation) return { ok: false, reason: "error", quality: "native", fellBack };
    setLoading(null);
    if (r && r !== "busy") return { ok: true, controller: r, quality: "native", source: "network", fellBack };
    fellBack = true;
    busy = r === "busy";
  }

  const voices = await loadVoices();
  const { voice, quality } = pickVoice(lang, voices);
  // never read Marathi (or Hindi) with an English voice
  if ((lang === "mr" || lang === "hi") && quality === "none") return { ok: false, reason: "no-marathi-voice", quality, fellBack, busy };
  if (!supported()) return { ok: false, reason: "unsupported", quality, fellBack, busy };
  if (gen !== generation) return { ok: false, reason: "error", quality, fellBack, busy };

  const synth = window.speechSynthesis;
  synth.cancel();
  const controller = makeController(() => synth.cancel());
  const chunks = chunkText(spoken);
  chunks.forEach((chunk, i) => {
    const u = new SpeechSynthesisUtterance(chunk);
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    } else u.lang = lang === "en" ? "en-IN" : `${lang}-IN`;
    u.rate = 0.9;
    u.pitch = 1;
    if (i === 0) u.onstart = () => opts.onInfo?.({ source: "phone", firstAudioMs: Math.round(performance.now() - t0) });
    if (i === chunks.length - 1) u.onend = () => controller.finish();
    u.onerror = (e) => {
      if (e.error !== "interrupted" && e.error !== "canceled") controller.finish();
    };
    synth.speak(u);
  });
  track(id, controller);
  return { ok: true, controller, quality, source: "phone", fellBack, busy };
}

function track(id: string | null, controller: SpeechController) {
  current = { id, controller };
  controller.onEnd(() => {
    if (current?.controller === controller) {
      current = null;
      emit();
    }
  });
  emit();
}

// ---- loading state (tap → first audio) --------------------------------------------------------

let loadingId: string | null = null;
function setLoading(id: string | null) {
  if (loadingId === id) return;
  loadingId = id;
  emit();
}
const loadingIdNow = () => loadingId;

// ---- online neural voice (/api/tts) ------------------------------------------------------------

// defaults; the server's provider sets its own (Gemini: 800 characters, 6 s)
const FIRST_CHUNK_MS = 4000;
const CLOUD_CHUNK = 600;
const CACHE_NAME = "shet-tts-v1";
const CACHE_MAX_ENTRIES = 300;
const CACHE_MAX_BYTES = 40 * 1024 * 1024;
const INDEX_KEY = "shet-tts-index"; // [{ k, n }] oldest first: cache key and size
const VOICE_KEY = "shet-tts-voice:"; // last known server voice per language, for offline replay
const STATIC_BASE = process.env.NEXT_PUBLIC_TTS_STATIC_BASE || "/tts";

let sharedAudio: HTMLAudioElement | null = null;
const audioEl = () => (sharedAudio ??= new Audio());

/** Same key as scripts/pregen-tts.ts: sha256 of "voice\nlang\ntext", hex. */
export async function clipKey(voice: string, lang: SpeechLang, text: string): Promise<string | null> {
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${voice}\n${lang}\n${text}`));
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return null;
  }
}

type CloudVoice = { voice: string; chunkChars: number; firstChunkMs: number };
const voiceIds = new Map<SpeechLang, CloudVoice>();
/** The server's voice (provider|model|speaker), so clips of an old voice are never replayed, and its chunking. */
export async function cloudVoice(lang: SpeechLang): Promise<CloudVoice | null> {
  if (voiceIds.has(lang)) return voiceIds.get(lang)!;
  let saved: CloudVoice | null = null;
  try {
    const raw = localStorage.getItem(VOICE_KEY + lang);
    if (raw) saved = raw.startsWith("{") ? JSON.parse(raw) : { voice: raw, chunkChars: CLOUD_CHUNK, firstChunkMs: FIRST_CHUNK_MS };
  } catch {}
  if (!navigator.onLine) return saved;
  try {
    const res = await fetch(`/api/tts?lang=${lang}`, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) return null;
    const j = (await res.json()) as Partial<CloudVoice>;
    if (!j.voice) return null;
    const v: CloudVoice = { voice: j.voice, chunkChars: j.chunkChars ?? CLOUD_CHUNK, firstChunkMs: j.firstChunkMs ?? FIRST_CHUNK_MS };
    voiceIds.set(lang, v);
    try {
      localStorage.setItem(VOICE_KEY + lang, JSON.stringify(v));
    } catch {}
    return v;
  } catch {
    return saved;
  }
}

let manifest: Promise<Record<string, string>> | null = null;
const loadManifest = () =>
  (manifest ??= fetch(`${STATIC_BASE}/manifest.json`)
    .then((r) => (r.ok ? (r.json() as Promise<{ files?: Record<string, string> }>) : {}))
    .then((m: { files?: Record<string, string> }) => m.files ?? {})
    .catch((): Record<string, string> => ({})));

async function cacheGet(key: string): Promise<Blob | null> {
  try {
    const c = await caches.open(CACHE_NAME);
    const hit = await c.match(`/__tts/${key}`);
    return hit ? await hit.blob() : null;
  } catch {
    return null;
  }
}

async function cachePut(key: string, blob: Blob) {
  try {
    const c = await caches.open(CACHE_NAME);
    await c.put(`/__tts/${key}`, new Response(blob, { headers: { "Content-Type": blob.type || "audio/mpeg" } }));
    let index: { k: string; n: number }[] = [];
    try {
      index = JSON.parse(localStorage.getItem(INDEX_KEY) ?? "[]");
    } catch {}
    index = [...index.filter((e) => e.k !== key), { k: key, n: blob.size }];
    let total = index.reduce((a, e) => a + e.n, 0);
    while (index.length > CACHE_MAX_ENTRIES || total > CACHE_MAX_BYTES) {
      const old = index.shift()!;
      total -= old.n;
      await c.delete(`/__tts/${old.k}`);
    }
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
  } catch {}
}

/** One clip: pre-generated file → phone cache → server. */
async function fetchClip(text: string, lang: SpeechLang, voice: string, signal: AbortSignal): Promise<{ blob: Blob; source: AudioSource }> {
  const key = await clipKey(voice, lang, text);
  if (key) {
    const file = (await loadManifest())[key];
    const cached = await cacheGet(key);
    if (cached) return { blob: cached, source: file ? "manifest" : "cache" };
    if (file) {
      const res = await fetch(`${STATIC_BASE}/${file}`, { signal }).catch(() => null);
      if (res?.ok) {
        const blob = await res.blob();
        void cachePut(key, blob);
        return { blob, source: "manifest" };
      }
    }
  }
  if (!navigator.onLine) throw new Error("offline");
  const res = await fetch("/api/tts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, lang }), signal });
  if (!res.ok) throw new Error(res.status === 429 ? "busy" : String(res.status));
  const blob = await res.blob();
  if (key) void cachePut(key, blob);
  return { blob, source: "network" };
}

/**
 * Plays prepared text with the online voice: chunk 1 first, chunk 2 fetched while 1 plays (never
 * more than 2 requests in flight). Returns null (or "busy" on 429) — so the caller uses the phone's
 * voice — when chunk 1 fails or takes longer than the provider's wait (4 s Sarvam, 6 s Gemini).
 */
async function speakCloud(spoken: string, lang: SpeechLang, id: string | null, gen: number, t0: number, onInfo?: (i: SpeakInfo) => void): Promise<SpeechController | "busy" | null> {
  const cv = await cloudVoice(lang);
  if (!cv) return null;
  const { voice } = cv;
  const parts = cloudChunks(spoken, cv.chunkChars);
  const abort = new AbortController();
  const get = (i: number) => fetchClip(parts[i], lang, voice, abort.signal);
  if (!navigator.onLine) {
    // offline: only when every part is already on the phone, so playback never stops halfway
    const files = await loadManifest();
    const have = await Promise.all(parts.map(async (p) => {
      const k = await clipKey(voice, lang, p);
      return !!k && (!!(await cacheGet(k)) || !!files[k]);
    }));
    if (!have.every(Boolean)) return null;
  }
  let first: { blob: Blob; source: AudioSource };
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    first = await Promise.race([get(0), new Promise<never>((_, rej) => (timer = setTimeout(() => rej(new Error("slow")), cv.firstChunkMs)))]);
  } catch (e) {
    abort.abort();
    return (e as Error).message === "busy" ? "busy" : null;
  } finally {
    clearTimeout(timer);
  }
  if (gen !== generation) {
    abort.abort();
    return null;
  }

  const audio = audioEl();
  let stopped = false;
  let wake: (() => void) | null = null;
  const controller = makeController(() => {
    stopped = true;
    abort.abort();
    audio.pause();
    wake?.();
  });
  track(id, controller);

  void (async () => {
    let clip = first;
    let next = parts.length > 1 ? get(1) : null;
    next?.catch(() => {});
    for (let i = 0; i < parts.length && !stopped; i++) {
      const url = URL.createObjectURL(clip.blob);
      try {
        audio.src = url;
        await audio.play();
        if (i === 0) onInfo?.({ source: clip.source, firstAudioMs: Math.round(performance.now() - t0) });
        await new Promise<void>((r) => {
          wake = r;
          audio.onended = audio.onerror = () => r();
        });
      } catch {
        stopped = true;
      } finally {
        URL.revokeObjectURL(url);
      }
      if (stopped || !next) break;
      try {
        clip = await next;
      } catch {
        break;
      }
      next = i + 2 < parts.length ? get(i + 2) : null;
      next?.catch(() => {});
    }
    controller.finish();
  })();
  return controller;
}

// ---- voice help (the sheet is rendered by <VoiceHelpHost/> in the app shell) ------------------

export type VoiceHelpKind = "none" | "fallback-hindi";
const helpListeners = new Set<(k: VoiceHelpKind) => void>();
export const onVoiceHelp = (l: (k: VoiceHelpKind) => void) => {
  helpListeners.add(l);
  return () => {
    helpListeners.delete(l);
  };
};
export const openVoiceHelp = (k: VoiceHelpKind) => helpListeners.forEach((l) => l(k));

/** Current voice quality for a language, once voices have loaded. */
export function useVoiceQuality(lang: SpeechLang): VoiceQuality | null {
  const q = useSyncExternalStore(
    voiceSubscribe,
    () => (voicesLoaded ? pickVoice(lang, currentVoices()).quality : null),
    () => null,
  );
  useEffect(() => {
    void loadVoices().then(() => {
      voicesLoaded = true;
      voiceEmit();
    });
  }, []);
  return q;
}
let voicesLoaded = false;
/** voices can arrive or change after the first look (voiceschanged), so always read the live list */
function currentVoices(): SpeechSynthesisVoice[] {
  if (!supported()) return [];
  const v = window.speechSynthesis.getVoices();
  if (v.length) voiceCache = v;
  return v.length ? v : (voiceCache ?? []);
}
const voiceListeners = new Set<() => void>();
const voiceEmit = () => voiceListeners.forEach((l) => l());
const voiceSubscribe = (l: () => void) => {
  voiceListeners.add(l);
  if (supported()) window.speechSynthesis.addEventListener?.("voiceschanged", l);
  return () => {
    voiceListeners.delete(l);
    if (supported()) window.speechSynthesis.removeEventListener?.("voiceschanged", l);
  };
};

let fallbackToastShown = false;
let busyToastShown = false;

// ---- React hook ------------------------------------------------------------------------------

/**
 * `speak(id, text)` toggles: tapping the same id again stops it. `speakAll` reads several parts in
 * order (e.g. a whole page), updating `speakingId` as it goes so the part being read can be
 * highlighted. Speech also stops on unmount (and, via <VoiceHelpHost/>, on route/language change).
 */
export function useSpeech() {
  const { state, l, toast, markVoiceTip } = useStore();
  const appLang: SpeechLang = state.lang === "mr" ? "mr" : "en";
  const speakingId = useSyncExternalStore(subscribe, speakingIdNow, () => null);
  const loadingId = useSyncExternalStore(subscribe, loadingIdNow, () => null);
  const quality = useVoiceQuality(appLang);
  const mine = useRef(new Set<string>());
  const queue = useRef(0);

  // route and language changes stop speech in <VoiceHelpHost/>; here, stop on unmount only if
  // this component started the speech
  useEffect(() => {
    const ids = mine.current;
    return () => {
      if (current?.id && ids.has(current.id)) stopSpeech();
    };
  }, []);

  const run = useCallback(
    async (id: string, text: string, lang: SpeechLang): Promise<boolean> => {
      mine.current.add(id);
      const r = await speak(text, lang, { id, cloud: state.naturalVoice });
      if (r.busy && !busyToastShown) {
        busyToastShown = true;
        toast({ en: "Online voice is busy", mr: "ऑनलाइन आवाज सध्या व्यस्त आहे" });
      } else if (r.fellBack && !r.busy && !fallbackToastShown) {
        fallbackToastShown = true;
        toast({ en: "Online voice unavailable, using phone voice", mr: "ऑनलाइन आवाज उपलब्ध नाही, फोनचा आवाज वापरत आहे" });
      }
      if (!r.ok) {
        if (r.reason === "no-marathi-voice") {
          if (!state.voiceHelpDismissed) openVoiceHelp("none");
          else toast({ en: "No Marathi voice on this phone.", mr: "या फोनमध्ये मराठी आवाज नाही." });
        } else if (r.reason === "unsupported") toast({ en: "This browser can't read aloud.", mr: "या ब्राउझरमध्ये वाचून दाखवण्याची सोय नाही." });
        return false;
      }
      if (lang === "mr" && r.quality === "fallback-hindi" && !state.voiceTipSeen) {
        markVoiceTip();
        openVoiceHelp("fallback-hindi");
      }
      return new Promise((res) => r.controller.onEnd(() => res(true)));
    },
    [state.voiceHelpDismissed, state.voiceTipSeen, state.naturalVoice, toast, markVoiceTip],
  );

  const speakOne = useCallback(
    (id: string, text: string, lang: SpeechLang = appLang) => {
      queue.current++;
      if (speakingIdNow() === id || loadingIdNow() === id) return stopSpeech();
      void run(id, text, lang);
    },
    [appLang, run],
  );

  const speakAll = useCallback(
    async (items: { id: string; text: string }[], lang: SpeechLang = appLang) => {
      const token = ++queue.current;
      for (const it of items) {
        if (queue.current !== token) return;
        const ok = await run(it.id, it.text, lang);
        if (!ok || queue.current !== token || speakingIdNow() !== null) return;
      }
    },
    [appLang, run],
  );

  const stop = useCallback(() => {
    queue.current++;
    stopSpeech();
  }, []);

  return {
    supported: typeof window === "undefined" ? true : supported() || CLOUD_TTS,
    speaking: speakingId !== null,
    speakingId,
    /** tapped, waiting for the first audio */
    loadingId,
    quality,
    /** Marathi can't be spoken on this device (and no cloud voice) */
    unavailable: appLang === "mr" && quality === "none" && !CLOUD_TTS,
    speak: speakOne,
    speakAll,
    stop,
    lang: appLang,
    l,
  };
}
