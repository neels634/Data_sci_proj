"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpenText, Square, Volume2, VolumeX, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { onVoiceHelp, openVoiceHelp, speak, stopSpeech, useSpeech, useVoiceQuality, type VoiceHelpKind } from "@/lib/speech";
import { Button, cx } from "./ui";

/**
 * Speaker button with three states: idle (tap to read), speaking (pulsing, tap to stop) and
 * unavailable (no Marathi voice on the phone — tap for help). Reads in the app's language.
 */
export function SpeakButton({ id, text, label, className, size = "md" }: { id: string; text: string | (() => string); label?: string; className?: string; size?: "sm" | "md" }) {
  const { speak: say, speakingId, unavailable, l } = useSpeech();
  const speaking = speakingId === id;
  const name = label ?? l("Read aloud", "वाचून दाखवा");
  const dim = size === "sm" ? "size-10" : "size-12";
  if (unavailable)
    return (
      <button
        type="button"
        onClick={() => openVoiceHelp("none")}
        aria-label={l("Marathi voice not available — how to fix", "मराठी आवाज उपलब्ध नाही — उपाय पाहा")}
        title={l("Marathi voice not available", "मराठी आवाज उपलब्ध नाही")}
        className={cx("grid shrink-0 place-items-center rounded-full bg-sand text-muted", dim, className)}
      >
        <VolumeX size={20} />
      </button>
    );
  return (
    <button
      type="button"
      onClick={() => say(id, typeof text === "function" ? text() : text)}
      aria-pressed={speaking}
      aria-label={speaking ? l("Stop reading", "वाचन थांबवा") : name}
      title={speaking ? l("Stop reading", "वाचन थांबवा") : name}
      className={cx(
        "grid shrink-0 place-items-center rounded-full transition-colors",
        dim,
        speaking ? "animate-pulse bg-soil text-white" : "bg-leaf-100 text-leaf-700 hover:bg-leaf-700 hover:text-white",
        className,
      )}
    >
      {speaking ? <Square size={16} fill="currentColor" /> : <Volume2 size={22} />}
    </button>
  );
}

/** "Read whole page": reads the parts in order; the part being read is `speakingId`. */
export function ReadPageButton({ parts, groupId = "page" }: { parts: { id: string; text: string }[]; groupId?: string }) {
  const { speakAll, stop, speakingId, unavailable, l } = useSpeech();
  const reading = !!speakingId && parts.some((p) => p.id === speakingId);
  if (unavailable)
    return (
      <Button variant="secondary" full className="min-h-12" onClick={() => openVoiceHelp("none")}>
        <VolumeX size={20} /> {l("Marathi voice not available", "मराठी आवाज उपलब्ध नाही")}
      </Button>
    );
  return (
    <Button variant={reading ? "soil" : "secondary"} full className="min-h-12" onClick={() => (reading ? stop() : void speakAll(parts))} aria-pressed={reading} data-group={groupId}>
      {reading ? <Square size={16} fill="currentColor" /> : <BookOpenText size={20} />}
      {reading ? l("Stop reading", "वाचन थांबवा") : l("Read whole page", "संपूर्ण पान वाचून दाखवा")}
    </Button>
  );
}

const TEST_PHRASE = "नमस्कार, मी मराठीत बोलतो. एक, दोन, तीन.";

/** Plays the test phrase in Marathi. */
export function TestVoiceButton({ className }: { className?: string }) {
  const { l, toast } = useStore();
  const [busy, setBusy] = useState(false);
  return (
    <Button
      variant="secondary"
      className={cx("min-h-12", className)}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const r = await speak(TEST_PHRASE, "mr", { id: "voice-test" });
        if (!r.ok) {
          setBusy(false);
          toast({ en: "No Marathi or Hindi voice found on this phone yet.", mr: "या फोनमध्ये अजून मराठी किंवा हिंदी आवाज नाही." });
        } else r.controller.onEnd(() => setBusy(false));
      }}
    >
      <Volume2 size={18} /> {l("Test voice", "आवाज तपासा")}
    </Button>
  );
}

/** Voice status row for Profile and Help. */
export function VoiceCheck() {
  const { l } = useStore();
  const q = useVoiceQuality("mr");
  const text =
    q === "native"
      ? l("Marathi voice available", "मराठी आवाज उपलब्ध")
      : q === "fallback-hindi"
        ? l("Using a Hindi voice for Marathi", "हिंदी आवाज वापरत आहे")
        : q === "none"
          ? l("No Marathi voice available", "आवाज उपलब्ध नाही")
          : l("Checking…", "तपासत आहे…");
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="font-bold">{l("Voice check", "आवाज तपासणी")}</p>
        <p className={cx("text-sm", q === "native" ? "text-leaf-700" : q === "none" ? "text-soil" : "text-muted")}>{text}</p>
      </div>
      <div className="flex gap-2">
        <TestVoiceButton />
        {q && q !== "native" && (
          <Button variant="ghost" className="min-h-12" onClick={() => openVoiceHelp(q === "none" ? "none" : "fallback-hindi")}>
            {l("How to fix", "उपाय")}
          </Button>
        )}
      </div>
    </div>
  );
}

const STEPS_MR = [
  "फोनच्या Settings (सेटिंग्ज) उघडा.",
  "System (सिस्टम) → Languages & input (भाषा व इनपुट) निवडा.",
  "Text-to-speech output (टेक्स्ट-टू-स्पीच) उघडा.",
  "Google speech engine च्या बाजूचे ⚙ चिन्ह दाबा.",
  "Install voice data (आवाज डेटा इन्स्टॉल करा) → मराठी (भारत) निवडून डाउनलोड करा.",
  "हे ॲप पुन्हा उघडा.",
];
const STEPS_EN = [
  "Open the phone's Settings.",
  "Go to System → Languages & input.",
  "Open Text-to-speech output.",
  "Tap the ⚙ next to Google speech engine.",
  "Install voice data → Marathi (India) → download.",
  "Open this app again.",
];

/**
 * Always mounted in the app shell: stops speech on route or language change, and shows the help
 * sheet when Marathi can't be spoken (or once, as a tip, when a Hindi voice is used instead).
 */
export function VoiceHelpHost() {
  const { state, l, dismissVoiceHelp } = useStore();
  const pathname = usePathname();
  const [kind, setKind] = useState<VoiceHelpKind | null>(null);
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => onVoiceHelp((k) => setKind(k)), []);
  useEffect(() => () => stopSpeech(), [pathname, state.lang]);

  if (!kind) return null;
  const close = () => {
    if (dontShow && kind === "none") dismissVoiceHelp(true);
    setKind(null);
    setDontShow(false);
  };
  const steps = state.lang === "en" ? STEPS_EN : STEPS_MR;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40" onClick={close}>
      <div role="dialog" aria-modal="true" aria-label={l("Marathi voice", "मराठी आवाज")} className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-cream p-5 pb-8" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex items-start justify-between gap-2">
          <h2 className="text-xl font-bold">
            {kind === "none" ? l("Marathi voice is not installed", "फोनमध्ये मराठी आवाज नाही") : l("Tip: install a Marathi voice", "सूचना: मराठी आवाज इन्स्टॉल करा")}
          </h2>
          <button onClick={close} className="grid size-12 shrink-0 place-items-center rounded-full" aria-label={l("Close", "बंद करा")}>
            <X size={22} />
          </button>
        </div>
        <p className="text-[15px] text-muted">
          {kind === "none"
            ? l("We don't read Marathi with an English voice. Install the free Marathi voice once (Android):", "आम्ही मराठी मजकूर इंग्रजी आवाजात वाचत नाही. एकदाच मोफत मराठी आवाज इन्स्टॉल करा (Android):")
            : l("A Hindi voice is reading Marathi now. A Marathi voice sounds more natural (Android):", "सध्या हिंदी आवाज मराठी वाचत आहे. मराठी आवाज जास्त नैसर्गिक वाटतो (Android):")}
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-[16px]">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <TestVoiceButton className="mt-4 w-full" />
        {kind === "none" && (
          <label className="mt-3 flex min-h-12 items-center gap-3 text-[15px]">
            <input type="checkbox" className="size-5" checked={dontShow} onChange={(e) => setDontShow(e.target.checked)} />
            {l("Don't show this again", "हे पुन्हा दाखवू नका")}
          </label>
        )}
        <Button full className="mt-2 min-h-12" onClick={close}>
          {l("OK", "ठीक आहे")}
        </Button>
      </div>
    </div>
  );
}
