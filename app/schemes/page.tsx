"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Bookmark,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Search,
  SearchX,
  Sparkles,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import type { SchemeCategory } from "@/lib/types";
import { Badge, Button, Card, Empty, PageHeader, cx, inputCls } from "@/components/ui";
import { Input } from "@/components/voice";
import {
  evaluateSchemeEligibility,
  SCHEME_QUESTIONS,
  type SchemeEligibilityResult,
} from "@/lib/eligibility";

const CATS: ("All" | SchemeCategory)[] = [
  "All",
  "Income support",
  "Crop insurance",
  "Credit",
  "Irrigation",
  "Women & SHG",
  "Food processing",
];

const ELIGIBILITY_STORAGE_KEY = "udyamsetu-scheme-eligibility-v1";

export default function Schemes() {
  const { state, account, l, tx, lbl, toggleBookmark } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [view, setView] = useState<"all" | "eligible" | "saved">("all");
  const [userAnswers, setUserAnswers] = useState<Record<string, boolean>>({});
  const [activeCheckSchemeId, setActiveCheckSchemeId] = useState<string | null>(null);

  // Load saved eligibility answers
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

  const schemeEvaluations = new Map<string, SchemeEligibilityResult>();
  state.schemes.forEach((s) => {
    schemeEvaluations.set(s.id, evaluateSchemeEligibility(s.id, account, userAnswers));
  });

  const eligibleCount = Array.from(schemeEvaluations.values()).filter((e) => e.status === "eligible").length;

  const list = state.schemes
    .filter((s) => s.status !== "archived")
    .filter((s) => cat === "All" || s.category === cat)
    .filter((s) => {
      const evalResult = schemeEvaluations.get(s.id);
      if (view === "eligible") return evalResult?.status === "eligible";
      if (view === "saved") return state.bookmarks.includes(s.id);
      return true;
    })
    .filter((s) => {
      const k = q.trim().toLowerCase();
      return (
        !k ||
        [s.name.en, s.name.mr, s.summary.en, s.summary.mr, s.department.en, s.department.mr].some((f) =>
          f.toLowerCase().includes(k)
        )
      );
    });

  const activeScheme = activeCheckSchemeId ? state.schemes.find((s) => s.id === activeCheckSchemeId) : null;
  const activeEval = activeCheckSchemeId ? schemeEvaluations.get(activeCheckSchemeId) : null;
  const activeQuestions = activeCheckSchemeId ? SCHEME_QUESTIONS[activeCheckSchemeId] || [] : [];

  return (
    <div className="pb-16">
      <PageHeader
        back="/home"
        title={l("Schemes", "शासकीय योजना")}
        sub={l(
          "Central and Maharashtra schemes with personalized eligibility & direct application.",
          "केंद्र व महाराष्ट्र शासनाच्या योजना — थेट पात्रता पडताळणी व अर्जाची लिंक."
        )}
      />

      {/* Search Input */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <Input
          className={cx(inputCls, "pl-10")}
          placeholder={l("Search schemes", "योजना शोधा")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label={l("Search schemes", "योजना शोधा")}
        />
      </div>

      {/* Clean 3 Filter Tabs */}
      <div className="mt-3 grid grid-cols-3 rounded-xl bg-sand p-1 text-center" role="tablist">
        {[
          ["all", l("All", "सर्व")],
          ["eligible", `${l("Eligible", "पात्र योजना")} (${eligibleCount})`],
          ["saved", `${l("Saved", "जतन")} (${state.bookmarks.length})`],
        ].map(([v, text]) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v as typeof view)}
            className={cx(
              "min-h-10 rounded-lg text-xs font-bold transition",
              view === v
                ? "bg-white text-leaf-900 shadow-sm"
                : "text-muted hover:text-ink"
            )}
          >
            {text}
          </button>
        ))}
      </div>

      {/* Category Horizontal Scroll */}
      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cx(
              "min-h-9 shrink-0 rounded-full border px-3.5 text-xs font-semibold transition",
              cat === c
                ? "border-leaf-700 bg-leaf-700 text-white"
                : "border-line bg-white text-ink hover:bg-cream"
            )}
          >
            {lbl(c)}
          </button>
        ))}
      </div>

      {/* Clean Schemes List */}
      <div className="mt-4 space-y-2.5">
        {list.length === 0 ? (
          <Empty
            icon={<SearchX size={32} />}
            title={
              view === "eligible"
                ? l("No eligible schemes under this filter", "या प्रकारात पात्र योजना नाहीत")
                : view === "saved"
                ? l("No saved schemes yet", "अजून एकही योजना जतन केलेली नाही")
                : l("No schemes match", "जुळणारी योजना नाही")
            }
            body={l("Try selecting 'All' or another category.", "सर्व किंवा इतर प्रकार निवडून पहा.")}
          />
        ) : (
          list.map((s) => {
            const ev = schemeEvaluations.get(s.id)!;
            const isEligible = ev.status === "eligible";
            const needsCheck = ev.status === "check_needed";
            const isSaved = state.bookmarks.includes(s.id);

            return (
              <Card
                key={s.id}
                className={cx(
                  "p-4 transition hover:shadow-sm",
                  isEligible ? "border-emerald-600/30 bg-emerald-50/15" : "border-line bg-white"
                )}
              >
                {/* Title & Bookmark */}
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/schemes/${s.id}`} className="flex-1 group">
                    <h3 className="text-[15px] font-bold text-ink leading-snug group-hover:text-leaf-700">
                      {tx(s.name)}
                    </h3>
                  </Link>

                  <button
                    onClick={() => toggleBookmark(s.id)}
                    className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-cream transition"
                    aria-label={isSaved ? l("Remove bookmark", "काढा") : l("Save scheme", "जतन करा")}
                  >
                    <Bookmark
                      size={17}
                      className={cx(
                        isSaved ? "fill-leaf-700 text-leaf-700" : "text-muted hover:text-ink"
                      )}
                    />
                  </button>
                </div>

                <p className="mt-1 line-clamp-2 text-xs text-muted leading-relaxed">
                  {tx(s.summary)}
                </p>

                {/* Clean Bottom Action Row (Status badge on left, Action button on right) */}
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-line/60 pt-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge tone="green">{lbl(s.category)}</Badge>
                    {isEligible ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                        <CheckCircle2 size={12} />
                        <span>{l("Eligible", "पात्र")}</span>
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    {isEligible ? (
                      <a
                        href={ev.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition"
                      >
                        <span>{l("Apply Here", "येथे अर्ज करा")}</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : needsCheck ? (
                      <button
                        type="button"
                        onClick={() => setActiveCheckSchemeId(s.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-gold/70 bg-gold-100/60 px-3 py-1.5 text-xs font-bold text-[#6b4708] hover:bg-gold-100 transition shadow-xs"
                      >
                        <HelpCircle size={13} />
                        <span>{l("Check For Me", "पात्रता तपासा")}</span>
                      </button>
                    ) : (
                      <Link
                        href={`/schemes/${s.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-leaf-700 hover:underline"
                      >
                        <span>{l("Details", "तपशील")}</span>
                        <ChevronRight size={13} />
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Interactive Check For Me Modal (Rich Questionnaire) */}
      {activeCheckSchemeId && activeScheme && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4 backdrop-blur-xs"
          onClick={() => setActiveCheckSchemeId(null)}
        >
          <div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-cream p-5 pb-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
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
                    {tx(activeScheme.name)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveCheckSchemeId(null)}
                className="grid size-9 place-items-center rounded-full text-muted hover:bg-line/40 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Info Summary */}
            {account && (
              <div className="mt-3 rounded-2xl bg-white p-3 border border-line">
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider">
                  {l("Your Profile / तुमची माहिती:", "तुमची माहिती:")}
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-ink font-semibold">
                  <span className="rounded-lg bg-cream px-2 py-0.5">👤 {account.name}</span>
                  <span className="rounded-lg bg-cream px-2 py-0.5">📍 {account.district || "Maharashtra"}</span>
                  <span className="rounded-lg bg-cream px-2 py-0.5">🌾 {account.landOwnedAcres || "0"} {l("acres", "एकर")}</span>
                  {account.crops.length > 0 && (
                    <span className="rounded-lg bg-cream px-2 py-0.5">🌱 {account.crops.slice(0, 2).join(", ")}</span>
                  )}
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="mt-4 space-y-3">
              <p className="text-xs font-bold text-leaf-900">
                {l(
                  "Answer to verify and unlock the direct 'Apply Here' link:",
                  "थेट 'येथे अर्ज करा' पर्याय मिळवण्यासाठी खालील प्रश्नांची उत्तरे द्या:"
                )}
              </p>

              {activeQuestions.map((q, idx) => {
                const currentAnswer = userAnswers[q.id];
                return (
                  <div key={q.id} className="rounded-2xl border border-line bg-white p-3.5 shadow-xs">
                    <p className="text-[11px] font-bold text-muted mb-0.5">
                      {l(`Question ${idx + 1} of ${activeQuestions.length}`, `प्रश्न ${idx + 1} / ${activeQuestions.length}`)}
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

            {/* Dynamic Result in Modal */}
            {activeEval && (
              <div className="mt-5">
                {activeEval.status === "eligible" ? (
                  <div className="rounded-2xl border border-emerald-500 bg-emerald-50 p-4 text-center">
                    <span className="inline-grid size-12 place-items-center rounded-full bg-emerald-700 text-white mb-2 shadow-sm">
                      <Sparkles size={24} />
                    </span>
                    <h4 className="text-base font-bold text-emerald-950">
                      {l("🎉 You are Eligible to Apply!", "🎉 तुम्ही पात्र आहात — अर्ज करा!")}
                    </h4>
                    <p className="text-xs text-emerald-800 mt-1">
                      {l(
                        "Your answers confirm you qualify for this scheme.",
                        "तुमच्या उत्तरांनुसार तुम्ही अधिकृत पोर्टलवर अर्ज करू शकता."
                      )}
                    </p>
                    <a
                      href={activeEval.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 font-bold text-white text-base shadow hover:bg-emerald-800"
                    >
                      <Sparkles size={18} />
                      <span>{l("Apply Here on Official Portal", "अधिकृत पोर्टलवर येथे अर्ज करा")}</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                ) : activeEval.status === "ineligible" ? (
                  <div className="rounded-2xl border border-soil/40 bg-soil-100/40 p-4 text-center">
                    <h4 className="text-base font-bold text-soil">
                      {l("Not Currently Eligible", "सध्या पात्र नाही")}
                    </h4>
                    <p className="text-xs text-muted mt-1">
                      {activeEval.unmatchedCriteria[0]
                        ? tx(activeEval.unmatchedCriteria[0])
                        : l("One or more eligibility conditions did not match.", "काही अटींची पूर्तता होत नाही.")}
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => setActiveCheckSchemeId(null)}
                      className="mt-3 w-full min-h-11 text-xs"
                    >
                      {l("Close / View Other Schemes", "बंद करा / इतर योजना पहा")}
                    </Button>
                  </div>
                ) : (
                  <Button full onClick={() => setActiveCheckSchemeId(null)} className="min-h-12">
                    {l("Done Answering", "पूर्ण झाले")}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
