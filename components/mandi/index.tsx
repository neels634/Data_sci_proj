"use client";

/**
 * Shared pieces for every Mandi Mitra screen (farmer, Mitra, buyer): crop pictures, grade cards,
 * status pills, the quantity stepper, big choices and listing / check-result cards.
 */
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Check, ChevronDown, Minus, Phone, Plus, UserCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { MITRA_PHONE } from "@/lib/data";
import { convert, cropName, gradeFor, gradingFor, typeFor, UNIT_NAME, UNIT_SHORT, UNSURE, type GradeOption, type Unit } from "@/lib/grades";
import { STATUS_UI, statusLine } from "@/lib/status-ui";
import type { Listing, ListingStatus } from "@/lib/types";
import { SpeakButton } from "@/components/speech";
import { cx } from "@/components/ui";
import { GradeVisual } from "./GradeVisual";

export { GradeVisual };

export const cardCls = "rounded-2xl border border-line bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]";

/** words for crops, grades and quantities in the current language */
export function useMandiText() {
  const { l, tx, num } = useStore();
  const crop = (id: string) => tx(cropName(id));
  const grade = (code: string | undefined) => (!code || code === UNSURE ? l("Not graded yet", "प्रत ठरायची") : tx(gradeFor(code)?.name) || code);
  const type = (code: string | undefined) => (code ? tx(typeFor(code)?.name) : "");
  const unit = (u: Unit, short = false) => tx((short ? UNIT_SHORT : UNIT_NAME)[u]);
  const n = (q: number) => num(q, { maximumFractionDigits: 2 });
  // onion in 10 kg bags also shows quintals, so "30 10 kg" never reads as one number
  const qty = (q: number, u: Unit) => (u === "10kg" ? `${n(q)} × ${unit(u, true)} (${n(convert(q, u, "quintal"))} ${unit("quintal", true)})` : `${n(q)} ${unit(u, true)}`);
  const money = (n: number) => `₹${num(Math.round(n))}`;
  /** the grade that counts: the Mitra's once checked */
  const listingGrade = (x: Pick<Listing, "gradeCode" | "mitraGradeCode">) => grade(x.mitraGradeCode ?? x.gradeCode);
  return { crop, grade, type, unit, qty, money, listingGrade };
}

export function CropAvatar({ cropId, size = "md" }: { cropId: string; size?: "sm" | "md" | "lg" }) {
  const g = gradingFor(cropId);
  const dim = size === "lg" ? "size-16 text-4xl" : size === "sm" ? "size-10 text-xl" : "size-12 text-2xl";
  return (
    <span aria-hidden="true" className={cx("grid shrink-0 place-items-center rounded-2xl", dim)} style={{ background: g?.color ?? "#f1e8d8" }}>
      {g?.emoji ?? "🌱"}
    </span>
  );
}

export function StatusPill({ status, className }: { status: ListingStatus; className?: string }) {
  const { tx } = useStore();
  const s = STATUS_UI[status];
  const Icon = s.icon;
  return (
    <span className={cx("inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold", s.tint, className)}>
      <Icon size={15} aria-hidden="true" /> {tx(s.pill)}
    </span>
  );
}

export function StepDots({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-1.5" aria-label={steps.join(" · ")}>
      {steps.map((s, i) => (
        <li key={s} className="flex min-w-0 flex-1 flex-col items-center gap-1" aria-current={i === current ? "step" : undefined}>
          <span className={cx("h-2 w-full rounded-full transition-colors", i < current ? "bg-leaf-600" : i === current ? "bg-leaf-700" : "bg-line")} />
          <span className={cx("truncate text-[11px]", i === current ? "font-bold text-leaf-900" : "text-muted")}>{s}</span>
        </li>
      ))}
    </ol>
  );
}

/** one big tap target with a picture, a word and an optional line under it */
export function BigChoice({
  icon,
  title,
  sub,
  selected,
  onClick,
  tone = "leaf",
  dashed,
}: {
  icon: ReactNode;
  title: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
  tone?: "leaf" | "sky" | "soil" | "gold";
  dashed?: boolean;
}) {
  const ring = { leaf: "border-leaf-700 bg-leaf-50", sky: "border-sky-600 bg-sky-50", soil: "border-soil bg-soil-100", gold: "border-gold bg-gold-100" }[tone];
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={sub ? `${title}, ${sub}` : title}
      onClick={onClick}
      className={cx(
        "flex min-h-16 w-full items-center gap-3 rounded-2xl border-2 bg-white p-3 text-left transition active:scale-95",
        selected ? ring : "border-line",
        dashed && !selected && "border-dashed",
      )}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream text-2xl" aria-hidden="true">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-bold leading-snug">{title}</span>
        {sub && <span className="block text-sm text-muted">{sub}</span>}
      </span>
      {selected && (
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-leaf-700 text-white mm-pop">
          <Check size={16} />
        </span>
      )}
    </button>
  );
}

/** a grade to pick: picture, name, local names, how to tell, read-aloud */
export function GradeCard({ grade, emoji, selected, onSelect, best }: { grade: GradeOption; emoji?: string; selected: boolean; onSelect: () => void; best?: boolean }) {
  const { tx, l } = useStore();
  const name = tx(grade.name);
  const how = tx(grade.howToIdentify);
  return (
    <div className={cx("relative flex items-center gap-3 rounded-2xl border-2 bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)]", selected ? "border-leaf-700 bg-leaf-50" : "border-line")}>
      {best && (
        <span className="absolute -top-2.5 left-3 rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-white">{l("Best rate", "सर्वोत्तम दर")}</span>
      )}
      <button type="button" role="radio" aria-checked={selected} aria-label={`${name}. ${how}`} onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-3 text-left active:scale-[0.98]">
        <GradeVisual grade={grade} emoji={emoji} />
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-bold leading-snug">{name}</span>
          {grade.localNames.length > 0 && (
            <span className="mt-0.5 flex flex-wrap gap-1">
              {grade.localNames.map((n) => (
                <span key={n} className="rounded-full bg-sand px-2 py-0.5 text-xs text-muted">
                  {n}
                </span>
              ))}
            </span>
          )}
          <span className="mt-1 block text-[15px] leading-snug text-ink/80">{how}</span>
        </span>
      </button>
      <SpeakButton id={`grade-${grade.code}`} size="sm" text={`${name}. ${how}`} />
    </div>
  );
}

/** "don't know — the Mitra will decide": always a valid answer */
export function UnsureCard({ selected, onSelect, title, sub }: { selected: boolean; onSelect: () => void; title: string; sub?: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={title}
      onClick={onSelect}
      className={cx("flex min-h-16 w-full items-center gap-3 rounded-2xl border-2 border-dashed bg-white p-3 text-left active:scale-[0.98]", selected ? "border-leaf-700 bg-leaf-50" : "border-line")}
    >
      <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-cream text-leaf-700" aria-hidden="true">
        <UserCheck size={28} />
      </span>
      <span>
        <span className="block text-lg font-bold">🤷 {title}</span>
        {sub && <span className="block text-sm text-muted">{sub}</span>}
      </span>
    </button>
  );
}

const QUICK = [10, 20, 50, 100];
export function QuantityStepper({ value, onChange, unit }: { value: number; onChange: (n: number) => void; unit: Unit }) {
  const { l, num } = useStore();
  const t = useMandiText();
  const step = unit === "kg" ? 10 : 1;
  return (
    <div className={cx(cardCls, "p-4")}>
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => onChange(Math.max(0, value - step))} aria-label={l("Less", "कमी")} className="grid size-14 place-items-center rounded-2xl bg-sand active:scale-95">
          <Minus size={26} />
        </button>
        <div className="min-w-0 text-center">
          <input
            inputMode="numeric"
            aria-label={l("Quantity", "प्रमाण")}
            value={value ? num(value, { useGrouping: false }) : ""}
            placeholder={num(0)}
            onChange={(e) => {
              const ascii = e.target.value.replace(/[०-९]/g, (d) => String("०१२३४५६७८९".indexOf(d))).replace(/[^\d.]/g, "");
              onChange(Number(ascii) || 0);
            }}
            className="w-28 bg-transparent text-center text-5xl font-bold text-leaf-900 outline-none"
          />
          <p className="text-lg font-semibold text-muted">{t.unit(unit)}</p>
        </div>
        <button type="button" onClick={() => onChange(value + step)} aria-label={l("More", "जास्त")} className="grid size-14 place-items-center rounded-2xl bg-leaf-700 text-white active:scale-95">
          <Plus size={26} />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {QUICK.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onChange(q)}
            className={cx("min-h-12 rounded-xl border text-lg font-bold active:scale-95", value === q ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white")}
          >
            {num(q)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StatCard({ label, value, icon, tint, href }: { label: string; value: number; icon: ReactNode; tint: string; href?: string }) {
  const { num } = useStore();
  const body = (
    <div className={cx(cardCls, "flex h-full flex-col items-start gap-1 p-3")}>
      <span className={cx("grid size-9 place-items-center rounded-full", tint)}>{icon}</span>
      <span className="text-3xl font-bold leading-none text-ink">{num(value)}</span>
      <span className="text-sm font-semibold leading-tight text-muted">{label}</span>
    </div>
  );
  return href ? (
    <Link href={href} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}

export function EmptyState({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className={cx(cardCls, "flex flex-col items-center gap-3 p-6 text-center")}>
      <svg viewBox="0 0 120 80" className="h-20 w-32" aria-hidden="true">
        <ellipse cx="60" cy="70" rx="50" ry="6" fill="#f1e8d8" />
        <path d="M30 66 L38 34 H82 L90 66Z" fill="#e2ede5" stroke="#2b6a4f" strokeWidth="2" />
        <path d="M38 34 Q60 22 82 34" fill="none" stroke="#2b6a4f" strokeWidth="2" />
        <path d="M60 30 V12 M60 18 Q50 10 46 16 M60 22 Q70 14 74 20" fill="none" stroke="#2b6a4f" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <p className="text-[17px] font-semibold">{title}</p>
      {action}
    </div>
  );
}

/** the one main action of a screen, stuck above the bottom bar */
export function StickyAction({ children, onClick, disabled, type = "button" }: { children: ReactNode; onClick?: () => void; disabled?: boolean; type?: "button" | "submit" }) {
  return (
    <div className="sticky bottom-20 z-20 mt-4 bg-gradient-to-t from-cream via-cream/90 to-transparent pt-3">
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-leaf-700 px-4 text-lg font-bold text-white shadow-lg transition active:scale-95 disabled:bg-leaf-700/40"
      >
        {children}
      </button>
    </div>
  );
}

export function CallMitra({ className }: { className?: string }) {
  const { l } = useStore();
  return (
    <a
      href={`tel:+91${MITRA_PHONE}`}
      className={cx("inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-leaf-700/40 bg-white px-4 font-semibold text-leaf-700 active:scale-95", className)}
    >
      <Phone size={18} /> {l("Call Mitra", "मित्राला फोन करा")}
    </a>
  );
}

/** moisture in words only; the number shows under "see details" */
export function moistureWords(l: (en: string, mr: string) => string, x: Pick<Listing, "crop" | "mitraMoisture">) {
  if (x.mitraMoisture == null) return null;
  const limit = gradingFor(x.crop)?.moistureLimit;
  if (limit == null) return null;
  return x.mitraMoisture <= limit ? l("Moisture OK", "ओलावा योग्य") : l("A little too much moisture", "थोडा ओलावा जास्त");
}

/** what the Mitra found, with the farmer's answer to it */
export function MitraResultCard({ listing: x }: { listing: Listing }) {
  const { l, tx, num, date, acceptCheck, markDried, cancelListing } = useStore();
  const t = useMandiText();
  const [open, setOpen] = useState(false);
  const s = STATUS_UI[x.status];
  const moisture = moistureWords(l, x);
  const needsAnswer = !x.farmerAccepted && (x.status === "ready" || x.status === "low_grade");
  return (
    <div className={cx("mt-3 rounded-2xl border-2 bg-white p-3", s.border)}>
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 font-bold">
          <UserCheck size={18} className={s.fg} /> {l("Checked by your Mitra", "मित्रांनी तपासले")}
        </p>
        <SpeakButton
          id={`result-${x.id}`}
          size="sm"
          text={[l("Checked by your Mitra", "मित्रांनी तपासले"), t.listingGrade(x), moisture ?? "", tx(s.line)].filter(Boolean).join(". ")}
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-leaf-100 px-2.5 py-1 text-sm font-bold text-leaf-900">{t.listingGrade(x)}</span>
        {moisture && <span className="rounded-full bg-sky-100 px-2.5 py-1 text-sm font-bold text-sky-900">💧 {moisture}</span>}
      </div>
      {x.status === "needs_drying" && (
        <p className="mt-2 text-[15px]">
          {x.dryRequestedAt ? l("Your Mitra will check it again soon.", "मित्र लवकरच पुन्हा तपासतील.") : x.recheckOn ? `${l("Next check", "पुढील तपासणी")}: ${date(x.recheckOn)}` : null}
        </p>
      )}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {needsAnswer ? (
          <button type="button" onClick={() => acceptCheck(x.id)} className="min-h-12 rounded-xl bg-leaf-700 font-bold text-white active:scale-95">
            {x.status === "low_grade" ? l("Continue", "पुढे जा") : l("Accept", "मान्य")}
          </button>
        ) : x.status === "needs_drying" && !x.dryRequestedAt ? (
          <button type="button" onClick={() => markDried(x.id)} className="min-h-12 rounded-xl bg-sky-700 font-bold text-white active:scale-95">
            ☀️ {l("I've dried it", "मी वाळवले")}
          </button>
        ) : (
          <span className="grid min-h-12 place-items-center rounded-xl bg-leaf-50 text-sm font-semibold text-leaf-900">
            {x.farmerAccepted ? `✓ ${l("Accepted", "मान्य केले")}` : l("Waiting for the Mitra", "मित्रांची वाट")}
          </span>
        )}
        {x.status === "low_grade" && !x.farmerAccepted ? (
          <button type="button" onClick={() => cancelListing(x.id)} className="min-h-12 rounded-xl border border-soil/40 bg-white font-semibold text-soil active:scale-95">
            {l("Cancel", "रद्द करा")}
          </button>
        ) : (
          <CallMitra />
        )}
      </div>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="mt-2 flex min-h-11 items-center gap-1 text-sm font-semibold text-leaf-700">
        <ChevronDown size={16} className={cx("transition-transform", open && "rotate-180")} /> {l("See details", "तपशील पहा")}
      </button>
      {open && (
        <ul className="mm-step space-y-1 rounded-xl bg-cream p-3 text-sm">
          {x.checkHistory.map((c, i) => (
            <li key={i}>
              {date(c.at)} · {tx(c.by)} · {t.grade(c.gradeCode)}
              {c.moisture != null && ` · ${l("meter", "मीटर")} ${num(c.moisture)}%`} · {tx(STATUS_UI[c.result].pill)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** a farmer's listing: picture, crop + grade, status, the one thing to do next */
export function ListingCard({ listing: x }: { listing: Listing }) {
  const { state, l, tx, date, cancelListing } = useStore();
  const t = useMandiText();
  const lot = x.lotId ? state.lots.find((y) => y.id === x.lotId) : undefined;
  const newOffers = lot ? state.offers.filter((o) => o.lotId === lot.id && o.status === "Submitted").length : 0;
  const line = tx(statusLine(x.status, x.gradeCode));
  const typeName = t.type(x.typeCode);
  const title = `${t.crop(x.crop)}${typeName ? ` (${typeName})` : ""} · ${t.listingGrade(x)}`;
  const showResult = x.gradeConfirmedByMitra && x.status !== "pooled" && x.status !== "cancelled" && x.status !== "waiting_check";
  return (
    <div className={cx(cardCls, "p-3")}>
      <div className="flex items-start gap-3">
        <CropAvatar cropId={x.crop} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[17px] font-bold leading-snug">{title}</p>
            <StatusPill status={x.status} />
          </div>
          <p className="text-[15px] text-muted">
            {t.qty(x.quantity, x.unit)} · {date(x.createdAt)}
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <p className="flex-1 text-[15px] font-semibold">{line}</p>
        <SpeakButton id={`listing-${x.id}`} size="sm" text={`${title}. ${t.qty(x.quantity, x.unit)}. ${line}`} />
      </div>
      {showResult && <MitraResultCard listing={x} />}
      {x.status === "pooled" && lot && (
        <Link href={`/sell/${x.id}`} className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-700 font-bold text-white active:scale-95">
          {newOffers > 0 ? l(`See ${newOffers} offer${newOffers > 1 ? "s" : ""}`, `${newOffers} ऑफर पाहा`) : l("View lot", "लॉट पाहा")}
        </Link>
      )}
      {(x.status === "waiting_check" || x.status === "needs_drying" || (x.status === "ready" && x.farmerAccepted)) && (
        <button type="button" onClick={() => cancelListing(x.id)} className="mt-1 min-h-11 text-sm font-semibold text-soil">
          {l("Cancel", "रद्द करा")}
        </button>
      )}
    </div>
  );
}
