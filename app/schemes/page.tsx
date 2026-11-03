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
import { Badge, Button, Card, Empty, PageHeader, cx, inputCls, statusTone } from "@/components/ui";
import { DrynessEntry } from "@/components/satellite/FieldDryness";
import { Input } from "@/components/voice";
import {
  evaluateSchemeEligibility,
  SCHEME_QUESTIONS,
  type EligibilityStatus,
  type SchemeEligibilityResult,
} from "@/lib/eligibility";

const CATS: ("All" | SchemeCategory)[] = [
  "All",
  "Income support",
  "Crop insurance",
  "Irrigation",
];

/** Icon image path for each scheme category */
const CATEGORY_ICON_IMG: Record<SchemeCategory, string> = {
  "Income support": "/icons/income-support.png",
  "Crop insurance": "/icons/crop-insurance.png",
  "Credit": "/icons/credit.png",
  "Irrigation": "/icons/irrigation.png",
  "Mechanisation": "/icons/irrigation.png",
  "Women & SHG": "/icons/women-shg.png",
  "Food processing": "/icons/food-processing.png",
};

const ELIGIBILITY_STORAGE_KEY = "udyamsetu-scheme-eligibility-v1";

export default function Schemes() {
  const { state, account, l, tx, lbl, toggleBookmark } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [view, setView] = useState<"all" | "eligible" | "check" | "saved">("all");
  const [userAnswers, setUserAnswers] = useState<Record<string, boolean>>({});
  const [activeCheckSchemeId, setActiveCheckSchemeId] = useState<string | null>(null);

  // Load saved eligibility answers from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ELIGIBILITY_STORAGE_KEY);
      if (raw) setUserAnswers(JSON.parse(raw));
    } catch {
      /* ignore storage error */
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
  const checkNeededCount = Array.from(schemeEvaluations.values()).filter((e) => e.status === "check_needed").length;

  const list = state.schemes
    .filter((s) => s.status !== "archived")
    .filter((s) => cat === "All" || s.category === cat)
    .filter((s) => {
      const evalResult = schemeEvaluations.get(s.id);
      if (view === "eligible") return evalResult?.status === "eligible";
      if (view === "check") return evalResult?.status === "check_needed";
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
        title={l("Schemes & Eligibility", "योजना व तुमची पात्रता")}
        sub={l(
          "Personalized schemes based on your land, crops and farm profile. Check eligibility and apply directly.",
          "तुमची जमीन, पिके व नोंदीनुसार थेट लागू होणाऱ्या योजना. पात्रता तपासा व अर्ज करा."
        )}
      />

      {account?.role === "farmer" && <DrynessEntry />}

      {/* Search Input */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <Input
          className={cx(inputCls, "pl-10")}
          placeholder={l("Search schemes by name or department", "नाव किंवा विभागानुसार योजना शोधा")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label={l("Search schemes", "योजना शोधा")}
        />
      </div>

      {/* Main Filter Tabs - Side by Side */}
      <div
        className="mt-3 flex w-full flex-row items-center justify-between gap-1 rounded-xl bg-sand p-1 text-center"
        style={{ display: "flex", flexDirection: "row" }}
        role="tablist"
      >
        {[
          ["all", l("All", "सर्व")],
          ["eligible", `${l("Eligible", "पात्र")} (${eligibleCount})`],
          ["check", `${l("Check", "तपासा")} (${checkNeededCount})`],
          ["saved", `${l("Saved", "जतन")} (${state.bookmarks.length})`],
        ].map(([v, text]) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v as typeof view)}
            style={{ flex: 1 }}
            className={cx(
              "flex-1 min-h-10 rounded-lg text-xs font-bold transition px-1 py-2 flex items-center justify-center whitespace-nowrap text-center",
              view === v
                ? "bg-white text-leaf-900 shadow-sm"
                : "text-muted hover:text-ink"
            )}
          >
            {text}
          </button>
        ))}
      </div>

      {/* Category Pills: Exactly 4 Clean Types */}
      <div className="mt-3 flex flex-row items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cx(
              "shrink-0 inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors",
              cat === c
                ? "border-leaf-700 bg-leaf-700 text-white shadow-xs"
                : "border-line bg-white text-ink hover:bg-cream"
            )}
          >
            {lbl(c)}
          </button>
        ))}
      </div>

      {/* Schemes List */}
      <div className="mt-4 space-y-3">
        {list.length === 0 ? (
          <Empty
            icon={<SearchX size={32} />}
            title={
              view === "eligible"
                ? l("No verified eligible schemes yet", "अजून पात्र योजना नाहीत")
                : view === "check"
                ? l("No pending eligibility checks", "तपासणी बाकी असलेली योजना नाही")
                : view === "saved"
                ? l("No saved schemes yet", "अजून एकही योजना जतन केलेली नाही")
                : l("No schemes match", "जुळणारी योजना नाही")
            }
            body={
              view === "eligible"
                ? l("Tap 'Check' to answer 1-2 quick questions and unlock your eligible schemes.", "पात्रता निश्चित करण्यासाठी 'तपासा' टॅबवर जाऊन १-२ सोप्या प्रश्नांची उत्तरे द्या.")
                : l("Try another search keyword or category filter.", "दुसरा शब्द किंवा प्रकार निवडून पहा.")
            }
          />
        ) : (
          list.map((s) => {
            const ev = schemeEvaluations.get(s.id)!;
            const isEligible = ev.status === "eligible";
            const needsCheck = ev.status === "check_needed";
            const isSaved = state.bookmarks.includes(s.id);
            const iconSrc = CATEGORY_ICON_IMG[s.category];

            return (
              <div
                key={s.id}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Card Header: Icon + Department + Status Badge + Bookmark */}
                <div className="flex items-start justify-between gap-3 p-4 pb-0">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <img
                      src={iconSrc}
                      alt={s.category}
                      width={44}
                      height={44}
                      className="shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-muted truncate leading-tight">
                        {tx(s.department)}
                      </p>
                      <Link href={`/schemes/${s.id}`} className="group">
                        <h3 className="text-[15px] font-bold leading-snug text-ink group-hover:text-leaf-700 mt-0.5">
                          {tx(s.name)}
                        </h3>
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Status Badge */}
                    {isEligible ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 size={12} className="shrink-0" />
                        {l("Eligible", "पात्र")}
                      </span>
                    ) : needsCheck ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                        <HelpCircle size={12} className="shrink-0" />
                        {l("Check", "तपासा")}
                      </span>
                    ) : null}
                    {/* Bookmark */}
                    <button
                      onClick={() => toggleBookmark(s.id)}
                      className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-gray-100 transition"
                      aria-label={isSaved ? l("Remove bookmark", "काढा") : l("Save scheme", "जतन करा")}
                    >
                      <Bookmark
                        size={16}
                        className={cx(
                          isSaved ? "fill-leaf-700 text-leaf-700" : "text-gray-400 hover:text-ink"
                        )}
                      />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="line-clamp-2 text-[13px] text-gray-500 leading-relaxed px-4 mt-2">
                  {tx(s.summary)}
                </p>

                {/* Metadata Pills */}
                <div className="flex flex-wrap gap-1.5 px-4 mt-3">
                  <span className="inline-flex items-center gap-1 text-[11px] bg-gray-100 text-gray-600 font-medium px-2.5 py-1 rounded-md">
                    {lbl(s.category)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] bg-gray-100 text-gray-600 font-medium px-2.5 py-1 rounded-md">
                    {lbl(s.level)}
                  </span>
                  {s.benefits[0] && (
                    <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 font-medium px-2.5 py-1 rounded-md">
                      💰 {tx(s.benefits[0]).slice(0, 40)}{tx(s.benefits[0]).length > 40 ? "…" : ""}
                    </span>
                  )}
                  {state.tracker[s.id] && (
                    <Badge tone={statusTone(state.tracker[s.id])}>{lbl(state.tracker[s.id])}</Badge>
                  )}
                </div>

                {/* Eligibility Explainer */}
                {isEligible && ev.matchedCriteria.length > 0 && (
                  <div className="mx-4 mt-3 rounded-xl bg-emerald-50 p-2.5 text-xs text-emerald-800">
                    <p className="font-semibold flex items-center gap-1 mb-0.5">
                      <span>✓</span>
                      <span>{l("Why you qualify:", "पात्रतेची कारणे:")}</span>
                    </p>
                    <p className="leading-normal text-emerald-700">
                      {ev.matchedCriteria.map((c) => tx(c)).slice(0, 2).join(" • ")}
                    </p>
                  </div>
                )}

                {needsCheck && (
                  <div className="mx-4 mt-3 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-800">
                    <p className="font-semibold flex items-center gap-1 mb-0.5">
                      <span>🔍</span>
                      <span>{l("1-2 quick questions needed:", "१-२ सोपे प्रश्न बाकी:")}</span>
                    </p>
                    <p className="leading-normal text-amber-700">
                      {l(
                        "Answer to verify if you qualify and get the direct 'Apply Here' link.",
                        "प्रश्नांची उत्तरे देऊन थेट अर्ज करण्याची लिंक मिळवा."
                      )}
                    </p>
                  </div>
                )}

                {ev.status === "ineligible" && ev.unmatchedCriteria.length > 0 && (
                  <div className="mx-4 mt-3 rounded-xl bg-red-50 p-2 text-xs text-red-700 font-medium">
                    ⚠️ {tx(ev.unmatchedCriteria[0])}
                  </div>
                )}

                {/* Card Action Footer */}
                <div className="flex items-center gap-2 px-4 py-3 mt-3 border-t border-gray-100">
                  <Link
                    href={`/schemes/${s.id}`}
                    className="text-sm font-semibold text-leaf-700 hover:underline"
                  >
                    {l("View Details", "माहिती पहा")}
                  </Link>

                  <div className="flex-1" />

                  {isEligible ? (
                    <a
                      href={ev.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-emerald-800 transition"
                    >
                      <Sparkles size={14} />
                      <span>{l("Apply Now", "अर्ज करा")}</span>
                      <ExternalLink size={12} className="opacity-80" />
                    </a>
                  ) : needsCheck ? (
                    <Button
                      variant="primary"
                      onClick={() => setActiveCheckSchemeId(s.id)}
                      className="rounded-xl text-sm bg-leaf-700 hover:bg-leaf-800 px-4 py-2"
                    >
                      <HelpCircle size={14} />
                      <span>{l("Check Eligibility", "पात्रता तपासा")}</span>
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Check For Me Modal */}
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

            {/* Profile Context */}
            {account && (
              <div className="mt-3 rounded-2xl bg-white p-3 border border-line">
                <p className="text-xs font-bold text-muted uppercase tracking-wider">
                  {l("Your Registration Details / तुमची नोंदणी:", "तुमची माहिती:")}
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-ink font-semibold">
                  <span className="rounded-lg bg-cream px-2 py-1">
                    👤 {account.name}
                  </span>
                  <span className="rounded-lg bg-cream px-2 py-1">
                    📍 {account.district || "Maharashtra"}
                  </span>
                  <span className="rounded-lg bg-cream px-2 py-1">
                    🌾 {account.landOwnedAcres || "0"} {l("acres land", "एकर जमीन")}
                  </span>
                  {account.crops.length > 0 && (
                    <span className="rounded-lg bg-cream px-2 py-1">
                      🌱 {account.crops.slice(0, 2).join(", ")}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="mt-4 space-y-4">
              <p className="text-xs font-bold text-leaf-900">
                {l(
                  "Answer these specific questions to unlock 'Apply Here':",
                  "थेट 'येथे अर्ज करा' पर्याय मिळवण्यासाठी खालील प्रश्नांची उत्तरे द्या:"
                )}
              </p>

              {activeQuestions.map((q, idx) => {
                const currentAnswer = userAnswers[q.id];
                return (
                  <div key={q.id} className="rounded-2xl border border-line bg-white p-3.5 shadow-xs">
                    <p className="text-xs font-bold text-muted mb-1">
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

            {/* Result Status after answering */}
            {activeEval && (
              <div className="mt-5">
                {activeEval.status === "eligible" ? (
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
                      {activeEval.unmatchedCriteria[0] ? tx(activeEval.unmatchedCriteria[0]) : l("One or more eligibility conditions did not match.", "काही अटींची पूर्तता होत नाही.")}
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
