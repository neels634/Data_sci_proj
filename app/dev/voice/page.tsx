"use client";

import { notFound } from "next/navigation";
import { useState } from "react";
import { Play, Square } from "lucide-react";
import { CLOUD_TTS, prepareSpeech, speak, stopSpeech, type AudioSource } from "@/lib/speech";
import { useStore } from "@/lib/store";
import { Button, Card, Field, PageHeader, inputCls } from "@/components/ui";

// Same lists as MARATHI_SPEAKERS / GEMINI_VOICES in lib/tts/providers.ts (kept here so no server code is bundled).
const SPEAKERS: Record<string, string[]> = {
  "bulbul:v4-flash": ["ishita_mr_conversational", "nilesh_mr_conversation", "neha_mr_narration", "soham_mr_narration", "mrunal_mr_narration", "ritu_mr_narration", "rupali_mr_stories", "mukul_mr_stories"],
  "bulbul:v3": ["rupali", "soham", "ritu", "shubh", "ishita", "neha"],
  // Gemini prebuilt voices (same list as GEMINI_VOICES)
  "gemini-3.8-flash-lite-tts": ["Kore", "Aoede", "Leda", "Callirrhoe", "Autonoe", "Puck", "Charon", "Fenrir", "Orus", "Zephyr"],
  "gemini-3.8-flash-tts": ["Kore", "Aoede", "Leda", "Callirrhoe", "Autonoe", "Puck", "Charon", "Fenrir", "Orus", "Zephyr"],
  "gemini-2.5-flash-preview-tts": ["Kore", "Aoede", "Leda", "Callirrhoe", "Autonoe", "Puck", "Charon", "Fenrir", "Orus", "Zephyr"],
};
const MODELS: Record<string, string[]> = { sarvam: ["bulbul:v4-flash", "bulbul:v3"], gemini: ["gemini-3.8-flash-lite-tts", "gemini-3.8-flash-tts", "gemini-2.5-flash-preview-tts"], google: [] };
const SAMPLE = "कांदा, विहिरीजवळचे शेत: लागवडीपासून आज 45 दिवस झाले आहेत। शेवटची फवारणी 6 दिवसांपूर्वी झाली। काढणी साधारण 2027-03-12 ते 2027-03-25 दरम्यान अपेक्षित आहे। खर्च ₹1,500 प्रति एकर, 1.5 एकर.";

/** Dev-only voice test page: app pipeline (manifest / cache / network / phone) or a raw provider call. */
export default function DevVoicePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <DevVoice />;
}

function DevVoice() {
  const { state } = useStore();
  const [text, setText] = useState(SAMPLE);
  const [lang, setLang] = useState<"mr" | "hi" | "en">("mr");
  const [provider, setProvider] = useState("sarvam");
  const [model, setModel] = useState("bulbul:v4-flash");
  const [speaker, setSpeaker] = useState(SPEAKERS["bulbul:v4-flash"][0]);
  const [result, setResult] = useState<{ source: AudioSource | "raw"; ms: number; note?: string } | null>(null);
  const [audio] = useState(() => (typeof window === "undefined" ? null : new Audio()));

  const playApp = async () => {
    setResult(null);
    const r = await speak(text, lang, { id: "dev-voice", cloud: state.naturalVoice, onInfo: (i) => setResult({ source: i.source, ms: i.firstAudioMs }) });
    if (!r.ok) setResult({ source: "phone", ms: 0, note: `failed: ${r.reason}` });
    else if (r.fellBack) setResult((x) => x ?? { source: "phone", ms: 0, note: "online voice failed — fell back" });
  };

  const playRaw = async () => {
    stopSpeech();
    setResult(null);
    const t0 = performance.now();
    const res = await fetch("/api/tts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: prepareSpeech(text, lang), lang, provider, speaker: provider === "google" ? undefined : speaker, model: provider === "google" ? undefined : model }) });
    if (!res.ok) return setResult({ source: "raw", ms: Math.round(performance.now() - t0), note: `HTTP ${res.status}: ${(await res.json().catch(() => ({}))).error ?? ""}` });
    const url = URL.createObjectURL(await res.blob());
    audio!.src = url;
    await audio!.play();
    setResult({ source: "raw", ms: Math.round(performance.now() - t0), note: res.headers.get("X-TTS-Source") ?? "" });
    audio!.onended = () => URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <PageHeader back="/profile" title="Voice test (dev)" sub={`NEXT_PUBLIC_TTS_CLOUD=${CLOUD_TTS ? "1" : "off"} · natural voice ${state.naturalVoice ? "on" : "off"}`} />
      <Card className="space-y-3">
        <Field label="Text">
          <textarea className={`${inputCls} min-h-32`} value={text} onChange={(e) => setText(e.target.value)} />
        </Field>
        <p className="rounded-xl bg-sand p-2 text-sm">{prepareSpeech(text, lang)}</p>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Language">
            <select className={inputCls} value={lang} onChange={(e) => setLang(e.target.value as "mr" | "hi" | "en")}>
              <option value="mr">mr</option>
              <option value="hi">hi</option>
              <option value="en">en</option>
            </select>
          </Field>
          <Field label="Provider (raw)">
            <select
              className={inputCls}
              value={provider}
              onChange={(e) => {
                const pr = e.target.value;
                setProvider(pr);
                const m = MODELS[pr][0];
                if (m) {
                  setModel(m);
                  setSpeaker(SPEAKERS[m][0]);
                }
              }}
            >
              <option value="sarvam">sarvam</option>
              <option value="gemini">gemini</option>
              <option value="google">google</option>
            </select>
          </Field>
          <Field label="Model (raw)">
            <select
              className={inputCls}
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                setSpeaker(SPEAKERS[e.target.value][0]);
              }}
            >
              {(MODELS[provider].length ? MODELS[provider] : Object.keys(SPEAKERS)).map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </Field>
          <Field label="Speaker (raw)">
            <select className={inputCls} value={speaker} onChange={(e) => setSpeaker(e.target.value)}>
              {SPEAKERS[model].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={playApp}>
            <Play size={18} /> App
          </Button>
          <Button variant="secondary" onClick={playRaw}>
            <Play size={18} /> Raw
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              stopSpeech();
              audio?.pause();
            }}
          >
            <Square size={16} /> Stop
          </Button>
        </div>
        {result && (
          <p className="font-mono text-sm" role="status">
            source: {result.source} · first audio: {result.ms} ms {result.note ? `· ${result.note}` : ""}
          </p>
        )}
      </Card>
    </div>
  );
}
