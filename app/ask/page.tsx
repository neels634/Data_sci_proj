"use client";

import { useEffect, useRef, useState } from "react";
import { Info, Loader2, Send, Sprout, Square, Volume2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, cx, inputCls } from "@/components/ui";
import { TextArea } from "@/components/voice";

type Msg = { role: "user" | "assistant"; text: string; offTopic?: boolean };

const SUGGESTIONS = [
  { en: "Yellow spots on my onion leaves — what should I do?", mr: "कांद्याच्या पानांवर पिवळे डाग आहेत, काय करू?" },
  { en: "How can I save water for sugarcane?", mr: "उसासाठी पाणी कसे वाचवू?" },
  { en: "Which crop is good for Rabi on 2 acres?", mr: "2 एकरात रब्बीसाठी कोणते पीक चांगले?" },
  { en: "How do I make compost at home?", mr: "घरी कंपोस्ट खत कसे बनवायचे?" },
];

/** Read an answer aloud in the farmer's language, using the phone's own voice. */
function useSpeak(lang: "en" | "mr") {
  const [speaking, setSpeaking] = useState<number | null>(null);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  useEffect(() => () => void (supported && window.speechSynthesis.cancel()), [supported]);
  const speak = (i: number, text: string) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    if (speaking === i) return setSpeaking(null);
    const u = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, ""));
    u.lang = lang === "mr" ? "mr-IN" : "en-IN";
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang === "mr" ? "mr" : "en-in"));
    if (voice) u.voice = voice;
    u.rate = 0.95;
    u.onend = u.onerror = () => setSpeaking(null);
    setSpeaking(i);
    window.speechSynthesis.speak(u);
  };
  return { supported, speaking, speak };
}

export default function AskKrishiMitra() {
  const { state, l, toast } = useStore();
  const lang = state.lang === "mr" ? "mr" : "en";
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState("");
  const [waiting, setWaiting] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);
  const { supported: canSpeak, speaking, speak } = useSpeak(lang);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, waiting]);

  const ask = async (text: string) => {
    const question = text.trim();
    if (!question || waiting) return;
    const next: Msg[] = [...msgs, { role: "user", text: question }];
    setMsgs(next);
    setQ("");
    setWaiting(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // off-topic refusals aren't useful context, so they're left out
        body: JSON.stringify({ lang, messages: next.filter((m) => !m.offTopic).map(({ role, text }) => ({ role, text })) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.answer) {
        toast(data.error ?? l("Couldn’t get an answer. Please try again.", "उत्तर मिळाले नाही. कृपया पुन्हा प्रयत्न करा."));
        setMsgs(next.slice(0, -1));
        setQ(question);
      } else {
        setMsgs([...next, { role: "assistant", text: data.answer, offTopic: data.onTopic === false }]);
      }
    } catch {
      toast(l("Can’t reach the server. Check your internet.", "सर्व्हरशी संपर्क होत नाही. इंटरनेट तपासा."));
      setMsgs(next.slice(0, -1));
      setQ(question);
    } finally {
      setWaiting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100dvh-12rem)] flex-col">
      <PageHeader
        back="/home"
        title={l("Krishi Mitra", "कृषी मित्र")}
        sub={l("Ask anything about crops, soil, water, pests, animals, schemes or selling.", "पिके, माती, पाणी, कीड-रोग, जनावरे, योजना किंवा विक्रीबद्दल काहीही विचारा.")}
      />

      <div className="flex-1 space-y-3">
        {msgs.length === 0 && (
          <>
            <div className="flex gap-2 rounded-xl bg-gold-100 p-3 text-sm text-[#6b4708]">
              <Info size={18} className="mt-0.5 shrink-0" />
              <p>
                {l(
                  "General farming guidance from AI. For sprays, medicines and doses, confirm with your KVK or agriculture officer. Don’t share personal details like Aadhaar or bank numbers.",
                  "AI कडून शेतीविषयक सामान्य मार्गदर्शन. फवारणी, औषधे व मात्रा यांसाठी KVK किंवा कृषी अधिकाऱ्यांकडून खात्री करा. आधार किंवा बँक नंबरसारखी वैयक्तिक माहिती लिहू नका.",
                )}
              </p>
            </div>
            <p className="pt-2 text-sm font-semibold text-muted">{l("Try asking:", "असे विचारून पाहा:")}</p>
            <div className="space-y-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.en}
                  onClick={() => ask(s[lang])}
                  className="block min-h-12 w-full rounded-xl border border-line bg-white px-4 py-2 text-left text-[15px] font-semibold text-leaf-900 hover:border-leaf-600"
                >
                  {s[lang]}
                </button>
              ))}
            </div>
          </>
        )}

        {msgs.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-leaf-700 px-4 py-2.5 text-[16px] text-white">{m.text}</p>
            </div>
          ) : (
            <div key={i} className="flex gap-2">
              <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-leaf-100 text-leaf-700">
                <Sprout size={18} />
              </span>
              <div className={cx("max-w-[85%] rounded-2xl rounded-bl-md border px-4 py-2.5", m.offTopic ? "border-gold-100 bg-gold-100 text-[#6b4708]" : "border-line bg-white")}>
                <p className="whitespace-pre-wrap text-[16px] leading-relaxed">{m.text}</p>
                {canSpeak && !m.offTopic && (
                  <button
                    onClick={() => speak(i, m.text)}
                    className="mt-2 inline-flex min-h-10 items-center gap-1.5 rounded-full bg-leaf-50 px-3 text-sm font-semibold text-leaf-700"
                    aria-pressed={speaking === i}
                  >
                    {speaking === i ? <Square size={14} fill="currentColor" /> : <Volume2 size={16} />}
                    {speaking === i ? l("Stop", "थांबवा") : l("Listen", "ऐका")}
                  </button>
                )}
              </div>
            </div>
          ),
        )}

        {waiting && (
          <div className="flex items-center gap-2 text-muted">
            <span className="grid size-8 place-items-center rounded-full bg-leaf-100 text-leaf-700">
              <Loader2 size={18} className="animate-spin" />
            </span>
            {l("Krishi Mitra is thinking…", "कृषी मित्र विचार करत आहे…")}
          </div>
        )}
        <div ref={bottom} />
      </div>

      <form
        className="sticky bottom-20 mt-4 flex items-end gap-2 rounded-2xl border border-line bg-cream/95 p-2 backdrop-blur"
        onSubmit={(e) => {
          e.preventDefault();
          ask(q);
        }}
      >
        <TextArea
          rows={1}
          className={cx(inputCls, "max-h-36 min-h-12 resize-none py-3")}
          value={q}
          onChange={(e) => setQ(e.target.value.slice(0, 600))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              ask(q);
            }
          }}
          placeholder={l("Type or tap the mic to speak…", "लिहा किंवा माइक दाबून बोला…")}
          aria-label={l("Your farming question", "तुमचा शेतीविषयक प्रश्न")}
        />
        <button
          type="submit"
          disabled={!q.trim() || waiting}
          className="grid size-12 shrink-0 place-items-center rounded-xl bg-leaf-700 text-white disabled:bg-leaf-700/40"
          aria-label={l("Send", "पाठवा")}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
