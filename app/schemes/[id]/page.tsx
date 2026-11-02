"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Bookmark,
  CheckCircle2,
  ExternalLink,
  FileText,
  Flag,
  HandHelping,
  HelpCircle,
  ListChecks,
  Sparkles,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { bi } from "@/lib/i18n";
import type { TrackerStatus } from "@/lib/types";
import { Badge, Button, Card, Empty, Note, PageHeader, cx, inputCls } from "@/components/ui";
import {
  evaluateSchemeEligibility,
  SCHEME_QUESTIONS,
} from "@/lib/eligibility";

const STATUSES: TrackerStatus[] = [
  "Interested",
  "Preparing documents",
  "Applied",
  "Approved",
  "Rejected",
  "Needs follow-up",
];

const REASONS = [
  bi("Information may be outdated", "माहिती जुनी असू शकते"),
  bi("Link does not work", "लिंक चालत नाही"),
  bi("Someone asked me for money", "कोणीतरी माझ्याकडे पैसे मागितले"),
];

const ELIGIBILITY_STORAGE_KEY = "udyamsetu-scheme-eligibility-v1";

function Section({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <Card className="mt-3">
      <h2 className="mb-2 flex items-center gap-2 font-bold text-leaf-900">
        {icon} {title}
      </h2>
      <ul className="space-y-1.5">
        {items.map((x) => (
          <li key={x} className="flex gap-2 text-[15px] leading-snug">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-leaf-600" />
            {x}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function SchemeDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    state,
    account,
    l,
    tx,
    lbl,
    date,
    toggleBookmark,
    setTracker,
    requestSchemeHelp,
    addReport,
  } = useStore();

  const [reporting, setReporting] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ELIGIBILITY_STORAGE_KEY);
      if (raw) setUserAnswers(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const saveAnswer = (questionId: string, answer: boolean) => {
    const next = { ...userAnswers, [questionId]: answer };
    setUserAnswers(next);
    try {
      localStorage.setItem(ELIGIBILITY_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const s = state.schemes.find((x) => x.id === id);

  if (!s || s.status === "archived")
    return (
      <Empty
        icon={<FileText size={32} />}
        title={l("Scheme not available", "योजना उपलब्ध नाही")}
        body={l("It may have been archived by the admin team.", "प्रशासन टीमने ती संग्रहित केली असू शकते.")}
      />
    );

  const saved = state.bookmarks.includes(s.id);
  const ev = evaluateSchemeEligibility(s.id, account, userAnswers);
  const questions = SCHEME_QUESTIONS[s.id] || [];

  return (
    <div className="pb-16">
      <PageHeader back="/schemes" title={tx(s.name)} sub={tx(s.department)} />

      <div className="flex flex-wrap items-center gap-1.5">
        {ev.status === "eligible" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 shadow-xs">
            <CheckCircle2 size={14} />
            <span>{l("Eligible — Apply Here", "तुम्ही पात्र आहात — येथे अर्ज करा")}</span>
          </span>
        ) : ev.status === "check_needed" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-3 py-1 text-xs font-bold text-[#6b4708] shadow-xs">
            <HelpCircle size={14} />
            <span>{l("Check For Me", "पात्रता तपासा")}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-sand px-3 py-1 text-xs font-semibold text-muted">
            {l("Not Eligible", "सध्या अपात्र")}
          </span>
        )}

        <Badge tone="green">{lbl(s.category)}</Badge>
        <Badge>{lbl(s.level)}</Badge>
        {s.lastVerified ? (
          <Badge tone="green">
            {l("Verified", "पडताळणी")} {date(s.lastVerified)}
          </Badge>
        ) : (
          <Badge tone="gold">{l("Not yet verified", "पडताळणी बाकी")}</Badge>
        )}
      </div>

      {/* Prominent Eligibility Card */}
      <div className="mt-3">
        {ev.status === "eligible" ? (
          <Card className="border-emerald-500 bg-emerald-50/70 p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-700 text-white shadow-sm">
                <Sparkles size={20} />
              </span>
              <div className="flex-1">
                <h2 className="text-base font-bold text-emerald-950">
                  {l("You are Eligible to Apply!", "तुम्ही या योजनेसाठी पात्र आहात!")}
                </h2>
                <p className="text-xs text-emerald-900 mt-0.5 leading-relaxed">
                  {l(
                    "Your farm size, location and crop details meet the criteria for this scheme.",
                    "तुमची शेतजमीन, पिके व नोंदीनुसार तुम्ही थेट अर्ज करू शकता."
                  )}
                </p>

                {ev.matchedCriteria.length > 0 && (
                  <div className="mt-2 text-[11px] text-emerald-900 font-semibold space-y-0.5">
                    {ev.matchedCriteria.map((c, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span>✓</span>
                        <span>{tx(c)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <a
                  href={ev.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 font-bold text-white text-sm shadow hover:bg-emerald-800 transition"
                >
                  <Sparkles size={16} />
                  <span>{l("Apply Here on Official Portal", "अधिकृत पोर्टलवर येथे थेट अर्ज करा")}</span>
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>
          </Card>
        ) : ev.status === "check_needed" ? (
          <Card className="border-gold/60 bg-gold-100/40 p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold text-[#6b4708] shadow-sm">
                <HelpCircle size={20} />
              </span>
              <div className="flex-1">
                <h2 className="text-base font-bold text-leaf-950">
                  {l("Check Eligibility for Me", "माझ्यासाठी पात्रता तपासा")}
                </h2>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">
                  {l(
                    "We need 1-2 quick details (such as e-KYC or crop status) to confirm if you qualify.",
                    "पात्रता निश्चित करण्यासाठी आणि 'येथे अर्ज करा' लिंक मिळवण्यासाठी १-२ प्रश्नांची उत्तरे द्या."
                  )}
                </p>

                <Button
                  variant="primary"
                  onClick={() => setShowCheckModal(true)}
                  className="mt-3 w-full min-h-11 text-sm bg-leaf-700 hover:bg-leaf-800"
                >
                  <HelpCircle size={16} />
                  <span>{l("Check For Me (Takes 1 min)", "माझ्यासाठी तपासा (१ मिनिट)")}</span>
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="border-soil/40 bg-soil-100/30 p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-soil text-white">
                ✕
              </span>
              <div className="flex-1">
                <h2 className="text-sm font-bold text-soil">
                  {l("Not Currently Eligible", "सध्या पात्र नाही")}
                </h2>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">
                  {ev.unmatchedCriteria[0]
                    ? tx(ev.unmatchedCriteria[0])
                    : l("One of the criteria does not match your farm profile.", "काही अटींची पूर्तता होत नाही.")}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="mt-3">
        {s.status === "flagged" ? (
          <Note>
            {l(
              "This scheme is being re-checked by our team. Confirm every detail on the official website before applying.",
              "आमची टीम ही योजना पुन्हा तपासत आहे. अर्ज करण्यापूर्वी अधिकृत संकेतस्थळावर सर्व तपशील खात्री करा."
            )}
          </Note>
        ) : !s.lastVerified ? (
          <Note>
            {l(
              "Not yet checked against the official source. Confirm details on the official website before applying.",
              "अधिकृत स्रोताशी अजून पडताळणी झालेली नाही. अर्ज करण्यापूर्वी अधिकृत संकेतस्थळावर तपशील खात्री करा."
            )}
          </Note>
        ) : null}
      </div>

      <p className="mt-3 text-[17px] leading-relaxed">{tx(s.summary)}</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant={saved ? "primary" : "secondary"} onClick={() => toggleBookmark(s.id)} aria-pressed={saved}>
          <Bookmark size={18} className={cx(saved && "fill-white")} /> {saved ? l("Saved", "जतन केली") : l("Save", "जतन करा")}
        </Button>
        <Button variant="secondary" onClick={() => requestSchemeHelp(s.id)}>
          <HandHelping size={18} /> {l("Ask Mitra", "मित्राला विचारा")}
        </Button>
      </div>

      <Section icon={<Sparkles size={18} />} title={l("What you get", "काय मिळते")} items={s.benefits.map(tx)} />
      <Section icon={<CheckCircle2 size={18} />} title={l("Who can apply", "कोण अर्ज करू शकतो")} items={s.eligibility.map(tx)} />
      <Section icon={<FileText size={18} />} title={l("Documents needed", "आवश्यक कागदपत्रे")} items={s.documents.map(tx)} />
      <Section icon={<ListChecks size={18} />} title={l("How to apply", "अर्ज कसा करावा")} items={s.steps.map((x, i) => `${i + 1}. ${tx(x)}`)} />

      <Card className="mt-3 bg-leaf-50">
        <h2 className="font-bold text-leaf-900">{l("Official source", "अधिकृत स्रोत")}</h2>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
          <dt className="text-muted">{l("Source", "स्रोत")}</dt>
          <dd className="font-semibold">{s.source}</dd>
          <dt className="text-muted">{l("Last verified", "शेवटची पडताळणी")}</dt>
          <dd className="font-semibold">{s.lastVerified ? date(s.lastVerified) : l("Not yet verified", "पडताळणी बाकी")}</dd>
        </dl>
        <a
          href={s.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-leaf-700 font-semibold text-white hover:bg-leaf-800 transition"
        >
          {l("Open official website", "अधिकृत संकेतस्थळ उघडा")} <ExternalLink size={16} />
        </a>
      </Card>

      <Card className="mt-3">
        <h2 className="font-bold">{l("Track my application", "माझ्या अर्जाची स्थिती")}</h2>
        <p className="text-sm text-muted">
          {l("Only you can see this. It helps your Mitra follow up.", "हे फक्त तुम्हाला दिसते. यामुळे मित्राला पाठपुरावा करता येतो.")}
        </p>
        <select
          className={cx(inputCls, "mt-2")}
          value={state.tracker[s.id] ?? ""}
          onChange={(e) => setTracker(s.id, e.target.value as TrackerStatus | "")}
          aria-label={l("Application status", "अर्जाची स्थिती")}
        >
          <option value="">{l("Not started", "सुरू केले नाही")}</option>
          {STATUSES.map((x) => (
            <option key={x} value={x}>
              {lbl(x)}
            </option>
          ))}
        </select>
      </Card>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        {l(
          "Shet Samruddhi is not a government website. Eligibility shown here is indicative; final approval rests with the department. Never share OTPs, passwords or bank PINs with anyone claiming to help with a scheme.",
          "शेत समृद्धी हे शासकीय संकेतस्थळ नाही. येथे दाखवलेली पात्रता केवळ अंदाज आहे; अंतिम मंजुरी संबंधित विभागाची असते. योजनेत मदत करतो म्हणणाऱ्या कोणालाही OTP, पासवर्ड किंवा बँक PIN कधीही सांगू नका."
        )}
      </p>

      {reporting ? (
        <Card className="mt-3">
          <p className="font-semibold">{l("What is wrong?", "काय चुकीचे आहे?")}</p>
          <div className="mt-2 grid gap-2">
            {REASONS.map((r) => (
              <Button
                key={r.en}
                variant="secondary"
                onClick={() => {
                  addReport(bi(`Scheme: ${s.name.en}`, `योजना: ${s.name.mr}`), r);
                  setReporting(false);
                }}
              >
                {tx(r)}
              </Button>
            ))}
          </div>
        </Card>
      ) : (
        <button onClick={() => setReporting(true)} className="mt-3 flex min-h-12 items-center gap-2 text-sm font-semibold text-soil">
          <Flag size={16} /> {l("Report an issue with this scheme", "या योजनेबद्दल तक्रार नोंदवा")}
        </button>
      )}

      {/* Check For Me Modal on Scheme Detail */}
      {showCheckModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4 backdrop-blur-xs"
          onClick={() => setShowCheckModal(false)}
        >
          <div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-cream p-5 pb-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-leaf-700 text-white">
                  <HelpCircle size={18} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink leading-tight">
                    {l("Check Eligibility", "पात्रता पडताळणी")}
                  </h3>
                  <p className="text-xs text-muted truncate max-w-[240px]">
                    {tx(s.name)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckModal(false)}
                className="grid size-9 place-items-center rounded-full text-muted hover:bg-line/40 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Questions List */}
            <div className="mt-4 space-y-4">
              {questions.map((q, idx) => {
                const currentAnswer = userAnswers[q.id];
                return (
                  <div key={q.id} className="rounded-2xl border border-line bg-white p-3.5 shadow-xs">
                    <p className="text-xs font-bold text-muted mb-1">
                      {l(`Question ${idx + 1} of ${questions.length}`, `प्रश्न ${idx + 1} / ${questions.length}`)}
                    </p>
                    <h4 className="text-sm font-bold text-ink leading-snug">
                      {tx(q.question)}
                    </h4>
                    <p className="text-xs text-muted mt-1 leading-normal">
                      {tx(q.hint)}
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => saveAnswer(q.id, true)}
                        className={cx(
                          "flex min-h-11 items-center justify-center gap-1.5 rounded-xl border text-sm font-bold transition",
                          currentAnswer === true
                            ? "border-emerald-600 bg-emerald-700 text-white shadow-xs"
                            : "border-line bg-cream text-ink hover:bg-emerald-50"
                        )}
                      >
                        <span>✓</span>
                        <span>{l("Yes / होय", "होय")}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => saveAnswer(q.id, false)}
                        className={cx(
                          "flex min-h-11 items-center justify-center gap-1.5 rounded-xl border text-sm font-bold transition",
                          currentAnswer === false
                            ? "border-soil bg-soil text-white shadow-xs"
                            : "border-line bg-cream text-ink hover:bg-soil-100"
                        )}
                      >
                        <span>✕</span>
                        <span>{l("No / नाही", "नाही")}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Outcome */}
            <div className="mt-5">
              {ev.status === "eligible" ? (
                <div className="rounded-2xl border border-emerald-500 bg-emerald-50 p-4 text-center">
                  <span className="inline-grid size-12 place-items-center rounded-full bg-emerald-700 text-white mb-2 shadow-sm">
                    <Sparkles size={24} />
                  </span>
                  <h4 className="text-base font-bold text-emerald-950">
                    {l("🎉 You are Eligible to Apply!", "🎉 तुम्ही या योजनेसाठी पूर्ण पात्र आहात!")}
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    {l(
                      "Your registration details and answers qualify you for this scheme.",
                      "तुमची नोंदणी व उत्तरांनुसार तुम्ही अधिकृत पोर्टलवर अर्ज करू शकता."
                    )}
                  </p>
                  <a
                    href={ev.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 font-bold text-white text-base shadow hover:bg-emerald-800"
                  >
                    <Sparkles size={18} />
                    <span>{l("Apply Here on Official Portal", "अधिकृत पोर्टलवर येथे थेट अर्ज करा")}</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              ) : (
                <Button full onClick={() => setShowCheckModal(false)} className="min-h-12">
                  {l("Done Answering", "पूर्ण झाले")}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
