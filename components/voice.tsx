"use client";

/**
 * Speech-to-text for every typing field, so farmers who find typing hard can speak instead.
 *
 * Uses the browser's built-in speech recognition (Chrome / Android Chrome / Edge; needs HTTPS or
 * localhost and microphone permission). Where the browser has no speech recognition the mic button
 * is simply not shown and the field works as a normal text box.
 */
import { forwardRef, useEffect, useRef, useState, type ComponentProps } from "react";
import { Mic, Square, Volume2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { cx } from "./ui";

// Minimal typing for the Web Speech API (not in TypeScript's DOM lib).
type RecognitionResultList = ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((e: { resultIndex: number; results: RecognitionResultList }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type RecognitionCtor = new () => Recognition;

function getRecognition(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const DEVANAGARI_DIGITS = "०१२३४५६७८९";
/** "१२.५" → "12.5" so number fields understand spoken Marathi numbers. */
export function toAsciiDigits(s: string) {
  return s.replace(/[०-९]/g, (d) => String(DEVANAGARI_DIGITS.indexOf(d)));
}

/** Only one field listens at a time. */
let active: Recognition | null = null;

type MicProps = {
  /** current field value, read when listening starts */
  getValue: () => string;
  /** called with the new full value (live while speaking, then final) */
  onText: (value: string) => void;
  /** numbers replace the field; text is added after what is already there */
  numeric?: boolean;
  className?: string;
};

export function MicButton({ getValue, onText, numeric, className }: MicProps) {
  const { state, l, toast } = useStore();
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<Recognition | null>(null);

  useEffect(() => setSupported(!!getRecognition()), []);
  useEffect(() => () => recRef.current?.abort(), []);

  if (!supported) return null;

  const stop = () => recRef.current?.stop();

  const start = () => {
    const Ctor = getRecognition();
    if (!Ctor) return;
    active?.abort();
    const rec = new Ctor();
    rec.lang = state.lang === "mr" ? "mr-IN" : "en-IN";
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    const base = numeric ? "" : getValue().trimEnd();
    rec.onresult = (e) => {
      let heard = "";
      for (let i = 0; i < e.results.length; i++) heard += e.results[i][0].transcript;
      heard = heard.trim();
      if (numeric) {
        const n = toAsciiDigits(heard).replace(/[^\d.]/g, "");
        if (n) onText(n);
      } else {
        onText(base ? `${base} ${heard}` : heard);
      }
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed")
        toast({ en: "Allow microphone access to speak instead of typing.", mr: "बोलून लिहिण्यासाठी मायक्रोफोनला परवानगी द्या." });
      else if (e.error === "no-speech") toast({ en: "Didn’t hear anything. Tap the mic and speak again.", mr: "काहीच ऐकू आले नाही. माइक दाबून पुन्हा बोला." });
      else if (e.error === "network") toast({ en: "Speech needs an internet connection.", mr: "बोलून लिहिण्यासाठी इंटरनेट लागते." });
    };
    rec.onend = () => {
      setListening(false);
      if (active === rec) active = null;
    };

    recRef.current = rec;
    active = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={listening ? stop : start}
      aria-label={listening ? l("Stop listening", "ऐकणे थांबवा") : l("Speak instead of typing", "टाइप करण्याऐवजी बोला")}
      aria-pressed={listening}
      title={listening ? l("Listening… tap to stop", "ऐकत आहे… थांबवण्यासाठी दाबा") : l("Tap and speak", "दाबा आणि बोला")}
      className={cx(
        "grid size-10 shrink-0 place-items-center rounded-full transition-colors",
        listening ? "animate-pulse bg-soil text-white" : "bg-leaf-100 text-leaf-700 hover:bg-leaf-700 hover:text-white",
        className,
      )}
    >
      {listening ? <Square size={16} fill="currentColor" /> : <Mic size={20} />}
    </button>
  );
}

/** Fire the field's own onChange with a new value, so existing handlers (and their clean-up rules) still apply. */
function emit(onChange: ComponentProps<"input">["onChange"] | ComponentProps<"textarea">["onChange"], value: string) {
  (onChange as ((e: { target: { value: string } }) => void) | undefined)?.({ target: { value } });
}

/** Text box with a built-in mic button. Use it anywhere a person would type. */
export const Input = forwardRef<HTMLInputElement, ComponentProps<"input"> & { wrapClassName?: string }>(function Input(
  { className, wrapClassName, ...props },
  ref,
) {
  const numeric = props.inputMode === "numeric" || props.inputMode === "decimal";
  const max = props.maxLength;
  return (
    <div className={cx("relative w-full min-w-0 flex-1", wrapClassName)}>
      <input ref={ref} {...props} className={cx(className, "pr-12")} />
      {!props.readOnly && !props.disabled && (
        <MicButton
          numeric={numeric}
          className="absolute right-1 top-1/2 -translate-y-1/2"
          getValue={() => String(props.value ?? "")}
          onText={(v) => emit(props.onChange, max ? v.slice(0, max) : v)}
        />
      )}
    </div>
  );
});

/** Multi-line text box with a built-in mic button. */
export function TextArea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <div className="relative w-full">
      <textarea {...props} className={cx(className, "pr-12")} />
      <MicButton className="absolute bottom-2 right-1" getValue={() => String(props.value ?? "")} onText={(v) => emit(props.onChange, v)} />
    </div>
  );
}

/** Reads text aloud in the app's language with the phone's own voice; hidden where unsupported. */
export function ReadAloud({ text, className }: { text: string; className?: string }) {
  const { state, l } = useStore();
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => setSupported(typeof window !== "undefined" && "speechSynthesis" in window), []);
  useEffect(() => () => void (typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.cancel()), []);
  if (!supported) return null;
  const toggle = () => {
    window.speechSynthesis.cancel();
    if (speaking) return setSpeaking(false);
    const u = new SpeechSynthesisUtterance(text);
    const lang = state.lang === "mr" ? "mr" : "en";
    u.lang = lang === "mr" ? "mr-IN" : "en-IN";
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang === "mr" ? "mr" : "en-in"));
    if (voice) u.voice = voice;
    u.rate = 0.95;
    u.onend = u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={speaking}
      aria-label={speaking ? l("Stop reading", "वाचन थांबवा") : l("Read aloud", "मोठ्याने वाचा")}
      title={speaking ? l("Stop reading", "वाचन थांबवा") : l("Read aloud", "मोठ्याने वाचा")}
      className={cx(
        "grid size-12 shrink-0 place-items-center rounded-full transition-colors",
        speaking ? "animate-pulse bg-soil text-white" : "bg-leaf-100 text-leaf-700 hover:bg-leaf-700 hover:text-white",
        className,
      )}
    >
      {speaking ? <Square size={16} fill="currentColor" /> : <Volume2 size={22} />}
    </button>
  );
}
