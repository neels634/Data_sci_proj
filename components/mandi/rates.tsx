"use client";

/**
 * Today's rates and the best-market plan: crop picker, source chips, market price cards, the
 * farmer's place and vehicle, and plan cards with their breakdown. Every rate shows its source
 * and date; every profit figure is an estimate.
 */
import { useState, type ReactNode } from "react";
import { Check, ChevronDown, LocateFixed, MapPin, Truck } from "lucide-react";
import { useStore } from "@/lib/store";
import { convert, GRADINGS, gradingFor, type Unit } from "@/lib/grades";
import { districtById, DISTRICT_HQ, findDistrict } from "@/lib/mandi/districts";
import { daysBetween, gradeRate, OLD_AFTER_DAYS, type MarketPrice, type MitraRate, type PriceSource } from "@/lib/mandi/prices";
import { OWN_VEHICLE, VEHICLES, roadKm, vehicleById, type Place, type Plan, type VehicleChoice } from "@/lib/mandi/profit";
import { marketById } from "@/lib/mandi/markets";
import { todayISO } from "@/lib/lifecycle";
import { SpeakButton } from "@/components/speech";
import { cx } from "@/components/ui";
import { cardCls, useMandiText } from "./index";

/** the 10-crop grid, shared by the sell wizard and today's rates */
export function CropPicker({ value, onPick, label }: { value?: string; onPick: (cropId: string) => void; label: string }) {
  const { tx } = useStore();
  return (
    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label={label}>
      {GRADINGS.map((c) => {
        const on = value === c.cropId;
        return (
          <button
            key={c.cropId}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={tx(c.name)}
            onClick={() => onPick(c.cropId)}
            className={cx("relative flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-[3px] p-2 active:scale-95", on ? "border-leaf-700" : "border-transparent")}
            style={{ background: c.color }}
          >
            <span className="text-5xl" aria-hidden="true">
              {c.emoji}
            </span>
            <span className="text-xl font-bold text-ink">{tx(c.name)}</span>
            {on && (
              <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-leaf-700 text-white mm-pop">
                <Check size={18} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** where a number comes from: live / last available / sample / Mitra, plus "estimate" for grade rates */
export function SourceChip({ source, date, estimate }: { source: PriceSource | "estimate"; date?: string; estimate?: boolean }) {
  const { l, date: fmt } = useStore();
  const old = date && daysBetween(date, todayISO()) > OLD_AFTER_DAYS;
  const look: Record<PriceSource | "estimate", [string, string]> = {
    live: [l("Today's rate", "आजचा दर"), "bg-leaf-100 text-leaf-900"],
    cached: [date ? `${l("Last available", "शेवटचे उपलब्ध दर")}: ${fmt(date)}` : l("Last available", "शेवटचे उपलब्ध दर"), "bg-gold-100 text-[#7a5108]"],
    sample: [l("Sample rates (example)", "नमुना दर (उदाहरण)"), "bg-sand text-muted"],
    mitra: [l("Mitra rate", "मित्र दर"), "bg-indigo-100 text-indigo-900"],
    estimate: [l("Estimate", "अंदाजे"), "bg-sand text-muted"],
  };
  return (
    <span className="inline-flex flex-wrap gap-1">
      <span className={cx("rounded-full px-2 py-0.5 text-xs font-bold", look[source][1])}>{look[source][0]}</span>
      {estimate && source !== "mitra" && <span className={cx("rounded-full px-2 py-0.5 text-xs font-bold", look.estimate[1])}>{look.estimate[0]}</span>}
      {old && source !== "cached" && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">{l("Old rates", "जुने दर")}</span>}
    </span>
  );
}

/** ₹ per crop unit (onion: per 10 kg and per quintal) */
export function useRateText() {
  const { num } = useStore();
  const t = useMandiText();
  const per = (perQtl: number, unit: Unit) => Math.round(convert(1, unit, "quintal") * perQtl);
  return {
    per,
    main: (perQtl: number, unit: Unit) => `₹${num(per(perQtl, unit))} / ${t.unit(unit, true)}`,
    qtl: (perQtl: number) => `₹${num(Math.round(perQtl))} / ${t.unit("quintal", true)}`,
  };
}

/** estimated (or Mitra) rate for every grade at one market */
export function GradeRateChips({ row, mitraRates, unit, all }: { row: MarketPrice; mitraRates: MitraRate[]; unit: Unit; all?: boolean }) {
  const { tx, num } = useStore();
  const r = useRateText();
  const g = gradingFor(row.cropId);
  if (!g) return null;
  const grades = [...g.grades].sort((a, b) => a.rank - b.rank);
  return (
    <div className={cx("flex gap-2", all ? "flex-col" : "overflow-x-auto pb-1")}>
      {grades.map((x) => {
        const rate = gradeRate({ cropId: row.cropId, typeCode: row.typeCode, gradeCode: x.code, marketId: row.marketId, rows: [row], mitraRates, today: todayISO() });
        if (!rate) return null;
        return (
          <span key={x.code} className={cx("flex shrink-0 items-center gap-1.5 rounded-xl border border-line bg-cream px-2.5 py-1.5", all && "justify-between")}>
            <span className="text-sm font-bold">{tx(x.name)}</span>
            <span className="text-sm font-bold text-leaf-900">₹{num(r.per(rate.perQtl, unit))}</span>
            <SourceChip source={rate.source === "mitra" ? "mitra" : "estimate"} />
          </span>
        );
      })}
    </div>
  );
}

/** one market's rate for the crop, with grade estimates; tap to see every grade and the notes */
export function MarketPriceCard({ row, distanceKm, mitraRates, unit, typeLabel }: { row: MarketPrice; distanceKm?: number; mitraRates: MitraRate[]; unit: Unit; typeLabel?: string }) {
  const { l, tx, num, date } = useStore();
  const r = useRateText();
  const [open, setOpen] = useState(false);
  const market = marketById(row.marketId);
  const name = tx(row.marketName);
  return (
    <div className={cx(cardCls, "p-3")}>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="block w-full text-left">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-lg font-bold leading-tight">{name}</p>
            <p className="text-sm text-muted">
              {tx(findDistrict(row.district)?.name) || row.district}
              {distanceKm != null && ` · ${l(`about ${distanceKm} km`, `सुमारे ${num(distanceKm)} किमी`)}`}
              {typeLabel ? ` · ${typeLabel}` : ""}
            </p>
          </div>
          <ChevronDown size={20} className={cx("mt-1 shrink-0 text-muted transition-transform", open && "rotate-180")} />
        </div>
        <p className="mt-1 text-2xl font-bold text-leaf-900">{r.main(row.modalPerQtl, unit)}</p>
        {unit !== "quintal" && <p className="text-sm font-semibold text-muted">{r.qtl(row.modalPerQtl)}</p>}
        <p className="text-sm text-muted">
          {l("Range", "किमान–कमाल")} ₹{num(r.per(row.minPerQtl, unit))}–₹{num(r.per(row.maxPerQtl, unit))} · {date(row.date)}
        </p>
      </button>
      <div className="mt-1">
        <SourceChip source={row.source} date={row.date} />
      </div>
      <div className="mt-2">
        <GradeRateChips row={row} mitraRates={mitraRates} unit={unit} all={open} />
      </div>
      {open && market?.notes && <p className="mm-step mt-2 text-sm">{tx(market.notes)}</p>}
      {open && row.varietyRaw && <p className="text-xs text-muted">{l("Variety in the data", "माहितीतील जात")}: {row.varietyRaw}</p>}
    </div>
  );
}

/** the farmer's place: saved location, else the profile district's HQ */
export function useFarmPlace(): { place?: Place; label?: string } {
  const { state, account, tx } = useStore();
  const loc = state.myLocation;
  if (loc) return { place: loc, label: loc.districtId ? tx(districtById(loc.districtId)?.name) : undefined };
  const d = findDistrict(account?.district ?? "") ?? findDistrict(tx(state.profile.district));
  return d ? { place: d, label: tx(d.name) } : {};
}

/** one-time "your village / place": GPS (kept on the phone) or a district */
export function LocationPrompt({ compact }: { compact?: boolean }) {
  const { l, tx, setLocation, toast } = useStore();
  const [district, setDistrict] = useState("");
  const [busy, setBusy] = useState(false);
  const useGps = () => {
    if (!navigator.geolocation) return toast({ en: "Location is not available — choose your district", mr: "ठिकाण मिळाले नाही — जिल्हा निवडा" });
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setBusy(false);
        setLocation({ lat: p.coords.latitude, lng: p.coords.longitude, source: "gps" });
      },
      () => {
        setBusy(false);
        toast({ en: "Location not allowed — choose your district", mr: "ठिकाणाची परवानगी नाही — जिल्हा निवडा" });
      },
      { timeout: 10_000, maximumAge: 600_000 },
    );
  };
  const title = l("Your village / place", "तुमचे गाव / ठिकाण");
  return (
    <div className={cx(cardCls, "space-y-3 p-4", compact && "border-gold")}>
      <div className="flex items-center gap-2">
        <MapPin className="text-soil" size={22} />
        <p className="flex-1 text-lg font-bold">{title}</p>
        <SpeakButton id="location-prompt" size="sm" text={`${title}. ${l("Used only on this phone to work out distances.", "अंतर काढण्यासाठी फक्त या फोनवर वापरले जाते.")}`} />
      </div>
      <p className="text-sm text-muted">{l("Used only on this phone to work out distances.", "अंतर काढण्यासाठी फक्त या फोनवर वापरले जाते.")}</p>
      <button type="button" onClick={useGps} disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-leaf-700 font-bold text-white active:scale-95 disabled:opacity-60">
        <LocateFixed size={18} /> {busy ? l("Finding…", "शोधत आहे…") : `📍 ${l("Use my location", "माझे ठिकाण वापरा")}`}
      </button>
      <div className="flex gap-2">
        <select
          aria-label={l("District", "जिल्हा")}
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="min-h-12 min-w-0 flex-1 rounded-xl border border-line bg-white px-3 text-[16px]"
        >
          <option value="">{l("Or choose district", "किंवा जिल्हा निवडा")}</option>
          {DISTRICT_HQ.map((d) => (
            <option key={d.id} value={d.id}>
              {tx(d.name)}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={!district}
          onClick={() => {
            const d = districtById(district)!;
            setLocation({ lat: d.lat, lng: d.lng, source: "district", districtId: d.id });
          }}
          className="min-h-12 rounded-xl border border-leaf-700/40 px-4 font-bold text-leaf-700 disabled:opacity-40"
        >
          {l("Use", "वापरा")}
        </button>
      </div>
    </div>
  );
}

/** vehicle + ₹/km, remembered per farmer; changes re-rank every plan at once */
export function VehicleSelector({ loadQtl, value, onChange }: { loadQtl: number; value: VehicleChoice; onChange: (v: VehicleChoice) => void }) {
  const { l, tx, num } = useStore();
  const [open, setOpen] = useState(false);
  const shown = value.vehicleId === "auto" ? (VEHICLES.find((v) => v.capacityQtl >= loadQtl) ?? VEHICLES[VEHICLES.length - 1]) : vehicleById(value.vehicleId)!;
  const perKm = value.perKm ?? shown.perKm;
  return (
    <div className={cx(cardCls, "p-3")}>
      <div className="flex items-center gap-2">
        <Truck size={20} className="text-leaf-700" />
        <p className="min-w-0 flex-1 font-bold">
          {tx(shown.name)} · ₹{num(perKm)}/{l("km", "किमी")}
        </p>
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="min-h-11 rounded-xl px-3 font-bold text-leaf-700">
          {l("Change", "बदला")}
        </button>
      </div>
      {open && (
        <div className="mm-step mt-2 space-y-2">
          <div className="flex flex-wrap gap-2">
            {[{ id: "auto" as const, name: { en: "Best fit", mr: "योग्य गाडी" } }, ...VEHICLES, OWN_VEHICLE].map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={value.vehicleId === v.id}
                onClick={() => onChange({ vehicleId: v.id })}
                className={cx("min-h-11 rounded-full border-2 px-3 text-sm font-bold", value.vehicleId === v.id ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white")}
              >
                {tx(v.name)}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-[15px] font-semibold">
            {value.vehicleId === "own" ? l("Diesel ₹/km", "डिझेल ₹/किमी") : l("Vehicle hire ₹/km", "गाडी भाडे ₹/किमी")}
            <input
              inputMode="numeric"
              value={value.perKm ?? ""}
              placeholder={num(shown.perKm)}
              onChange={(e) => {
                const n = Number(e.target.value.replace(/[०-९]/g, (d) => String("०१२३४५६७८९".indexOf(d))).replace(/[^\d]/g, ""));
                onChange({ ...value, perKm: n > 0 ? n : undefined });
              }}
              className="h-12 w-24 rounded-xl border border-line bg-white px-3 text-center text-lg font-bold"
            />
          </label>
          <p className="text-xs text-muted">{l("Round trip: ₹/km × distance × 2. Draft rates — change them to yours.", "ये-जा: ₹/किमी × अंतर × २. अंदाजे दर — तुमचे दर टाका.")}</p>
        </div>
      )}
    </div>
  );
}

/** rate × quantity per grade, − transport, − market fees, = net */
export function ProfitBreakdown({ plan, unsureNote }: { plan: Plan; unsureNote?: boolean }) {
  const { l, tx, num, date } = useStore();
  const t = useMandiText();
  const money = (n: number) => `₹${num(Math.round(n))}`;
  return (
    <div className="mm-step mt-2 space-y-2 rounded-xl bg-cream p-3 text-[15px]">
      {plan.legs.map((leg) => (
        <div key={leg.market.id} className="space-y-1">
          {plan.legs.length > 1 && <p className="font-bold">{tx(leg.market.name)}</p>}
          {leg.items.map((it) => (
            <div key={it.gradeCode} className="flex flex-wrap items-center justify-between gap-1">
              <span>
                {t.grade(it.pricedAs)} · {money(it.perQtl)} × {num(it.qtyQtl, { maximumFractionDigits: 2 })} {t.unit("quintal", true)}
              </span>
              <span className="flex items-center gap-1 font-semibold">
                {money(it.amount)} <SourceChip source={it.source === "mitra" ? "mitra" : it.source} estimate />
              </span>
            </div>
          ))}
          <div className="flex justify-between text-soil">
            <span>
              − {l("Transport", "वाहतूक")} ({tx(leg.vehicle.name)} × {num(leg.trips)}, {num(leg.distanceKm)} {l("km", "किमी")})
            </span>
            <span>{money(leg.transport)}</span>
          </div>
          <div className="flex justify-between text-soil">
            <span>− {l("Market charges (estimate)", "बाजार खर्च (अंदाजे)")}</span>
            <span>{money(leg.fees)}</span>
          </div>
        </div>
      ))}
      <div className="flex justify-between border-t border-line pt-1 font-bold">
        <span>= {l("Net (estimate)", "निव्वळ (अंदाजे)")}</span>
        <span className="text-leaf-900">{money(plan.net)}</span>
      </div>
      <p className="text-sm text-muted">
        {money(plan.netPerQtl)} / {t.unit("quintal", true)} · {l("rates of", "दर")} {plan.dates.map(date).join(", ")}
      </p>
      {unsureNote && <p className="text-sm font-semibold">{l("Grade not known — estimated at the middle grade", "प्रत माहीत नाही — मध्यम प्रतीनुसार अंदाज")}</p>}
    </div>
  );
}

/** one market for everything */
export function PlanCard({ plan, rank, selected, onSelect, speech, unsureNote }: { plan: Plan; rank: number; selected: boolean; onSelect: () => void; speech: string; unsureNote?: boolean }) {
  const { l, tx, num } = useStore();
  const [open, setOpen] = useState(false);
  const leg = plan.legs[0];
  return (
    <div className={cx("relative rounded-2xl border-2 bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)]", selected ? "border-leaf-700 bg-leaf-50" : rank === 1 ? "border-gold" : "border-line")}>
      {rank === 1 && <span className="absolute -top-2.5 left-3 rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-white">{l("Most profit", "सर्वात जास्त फायदा")}</span>}
      <div className="flex items-start gap-3">
        <button type="button" role="radio" aria-checked={selected} onClick={onSelect} className="flex min-w-0 flex-1 items-start gap-3 text-left">
          <span className={cx("mt-1 grid size-7 shrink-0 place-items-center rounded-full border-2", selected ? "border-leaf-700 bg-leaf-700 text-white" : "border-line")}>{selected && <Check size={16} />}</span>
          <span className="min-w-0">
            <span className="block text-lg font-bold leading-tight">
              {num(rank)}. {tx(leg.market.name)}
            </span>
            <span className="block text-sm text-muted">{l(`about ${leg.distanceKm} km`, `सुमारे ${num(leg.distanceKm)} किमी`)}</span>
            <span className="mt-1 block text-2xl font-bold text-leaf-900">
              {l("Net", "निव्वळ")} ₹{num(plan.net)}
            </span>
            <span className="text-xs font-bold text-muted">{l("estimate", "अंदाजे")}</span>
          </span>
        </button>
        <SpeakButton id={`plan-${leg.market.id}`} size="sm" text={speech} />
      </div>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="mt-1 flex min-h-11 items-center gap-1 text-sm font-semibold text-leaf-700">
        <ChevronDown size={16} className={cx("transition-transform", open && "rotate-180")} /> {l("How it adds up", "हिशोब पाहा")}
      </button>
      {open && <ProfitBreakdown plan={plan} unsureNote={unsureNote} />}
    </div>
  );
}

/** grades sent to different markets, when that earns clearly more */
export function SplitPlanCard({ plan, gain, selected, onSelect, speech }: { plan: Plan; gain: number; selected: boolean; onSelect: () => void; speech: string }) {
  const { l, tx, num } = useStore();
  const t = useMandiText();
  const [open, setOpen] = useState(false);
  return (
    <div className={cx("rounded-2xl border-2 bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)]", selected ? "border-leaf-700 bg-leaf-50" : "border-indigo-600")}>
      <div className="flex items-start gap-3">
        <button type="button" role="radio" aria-checked={selected} onClick={onSelect} className="flex min-w-0 flex-1 items-start gap-3 text-left">
          <span className={cx("mt-1 grid size-7 shrink-0 place-items-center rounded-full border-2", selected ? "border-leaf-700 bg-leaf-700 text-white" : "border-line")}>{selected && <Check size={16} />}</span>
          <span className="min-w-0">
            <span className="block text-lg font-bold leading-tight">{l("More profit if sent to different markets", "वेगवेगळ्या बाजारात नेल्यास जास्त फायदा")}</span>
            {plan.legs.flatMap((leg) =>
              leg.items.map((it) => (
                <span key={it.gradeCode} className="mt-1 block text-[15px]">
                  {t.grade(it.gradeCode)} {num(it.qtyQtl, { maximumFractionDigits: 2 })} {t.unit("quintal", true)} → <b>{tx(leg.market.name)}</b>
                </span>
              )),
            )}
            <span className="mt-1 block text-2xl font-bold text-leaf-900">
              {l("Net", "निव्वळ")} ₹{num(plan.net)}
            </span>
            <span className="inline-block rounded-full bg-leaf-100 px-2 py-0.5 text-sm font-bold text-leaf-900">
              +₹{num(gain)} {l("more", "जास्त")}
            </span>
            <span className="mt-1 block text-xs text-muted">{l("Needs separate trips. Estimate.", "वेगवेगळ्या फेऱ्या लागतील. अंदाजे.")}</span>
          </span>
        </button>
        <SpeakButton id="plan-split" size="sm" text={speech} />
      </div>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="mt-1 flex min-h-11 items-center gap-1 text-sm font-semibold text-leaf-700">
        <ChevronDown size={16} className={cx("transition-transform", open && "rotate-180")} /> {l("How it adds up", "हिशोब पाहा")}
      </button>
      {open && <ProfitBreakdown plan={plan} />}
    </div>
  );
}

/** "Rates change daily. This is only an estimate." */
export function EstimateNote({ children }: { children?: ReactNode }) {
  const { l } = useStore();
  return (
    <p className="rounded-xl bg-sand p-3 text-sm font-semibold text-muted">
      {l("Rates change daily. This is only an estimate.", "दर रोज बदलतात. हा फक्त अंदाज आहे.")} {children}
    </p>
  );
}

export const distanceTo = (place: Place | undefined, marketId: string) => {
  const m = marketById(marketId);
  return place && m ? roadKm(place, m) : undefined;
};

