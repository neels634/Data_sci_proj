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
 * - Optional: with NEXT_PUBLIC_TTS_CLOUD=1, Marathi with no device voice is synthesized by
 *   /api/tts (Google Cloud Text-to-Speech, key on the server) and played in an <audio> element.
 */
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { useStore } from "./store";
import { toSpokenMarathi } from "./marathi-numbers";

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

// ---- text preparation ----------------------------------------------------------------------

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
export function prepareSpeech(text: string, lang: SpeechLang) {
  const clean = cleanForSpeech(text);
  return lang === "mr" ? toSpokenMarathi(clean) : clean;
}

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

export type SpeakResult = { ok: true; controller: SpeechController; quality: VoiceQuality } | { ok: false; reason: "unsupported" | "no-marathi-voice" | "error"; quality: VoiceQuality };

/** Speak `text` in `lang`. Cancels anything already speaking. */
export async function speak(text: string, lang: SpeechLang, opts: { id?: string } = {}): Promise<SpeakResult> {
  stopSpeech();
  const voices = await loadVoices();
  const { voice, quality } = pickVoice(lang, voices);
  const spoken = prepareSpeech(text, lang);
  if (!spoken) return { ok: false, reason: "error", quality };

  // never read Marathi (or Hindi) with an English voice
  if ((lang === "mr" || lang === "hi") && quality === "none") {
    if (CLOUD_TTS && lang === "mr") return speakCloud(spoken, lang, opts.id ?? null, quality);
    return { ok: false, reason: "no-marathi-voice", quality };
  }
  if (!supported()) return { ok: false, reason: "unsupported", quality };

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
    if (i === chunks.length - 1) u.onend = () => controller.finish();
    u.onerror = (e) => {
      if (e.error !== "interrupted" && e.error !== "canceled") controller.finish();
    };
    synth.speak(u);
  });
  current = { id: opts.id ?? null, controller };
  controller.onEnd(() => {
    if (current?.controller === controller) {
      current = null;
      emit();
    }
  });
  emit();
  return { ok: true, controller, quality };
}

/** Cloud voice (optional): /api/tts returns audio for up to 1,000 characters at a time. */
async function speakCloud(spoken: string, lang: SpeechLang, id: string | null, quality: VoiceQuality): Promise<SpeakResult> {
  const parts: string[] = [];
  let cur = "";
  for (const c of chunkText(spoken, 180)) {
    if ((cur + " " + c).length > 950) {
      parts.push(cur);
      cur = c;
    } else cur = cur ? `${cur} ${c}` : c;
  }
  if (cur) parts.push(cur);
  const audio = new Audio();
  let stopped = false;
  const controller = makeController(() => {
    stopped = true;
    audio.pause();
  });
  current = { id, controller };
  emit();
  controller.onEnd(() => {
    if (current?.controller === controller) {
      current = null;
      emit();
    }
  });
  (async () => {
    for (const text of parts) {
      if (stopped) return;
      try {
        const res = await fetch("/api/tts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, lang }) });
        if (!res.ok) throw new Error(String(res.status));
        const url = URL.createObjectURL(await res.blob());
        if (stopped) return URL.revokeObjectURL(url);
        audio.src = url;
        await audio.play();
        await new Promise<void>((r) => {
          audio.onended = audio.onpause = () => r();
        });
        URL.revokeObjectURL(url);
      } catch {
        break;
      }
    }
    controller.finish();
  })();
  return { ok: true, controller, quality };
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
      const r = await speak(text, lang, { id });
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
    [state.voiceHelpDismissed, state.voiceTipSeen, toast, markVoiceTip],
  );

  const speakOne = useCallback(
    (id: string, text: string, lang: SpeechLang = appLang) => {
      queue.current++;
      if (speakingIdNow() === id) return stopSpeech();
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
