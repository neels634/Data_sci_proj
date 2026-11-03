"use client";

/**
 * One crop's rates across Maharashtra mandis: modal / min / max per variety, estimated grade rates,
 * sorted by highest rate, nearest, or best net for one quintal of the middle grade.
 */
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ShoppingBasket } from "lucide-react";
import { useStore } from "@/lib/store";
import { gradingFor } from "@/lib/grades";
import { marketById } from "@/lib/mandi/markets";
import { pricedGrade, type MarketPrice } from "@/lib/mandi/prices";
import { legFor } from "@/lib/mandi/profit";
import { usePrices } from "@/lib/mandi/use-prices";
import { todayISO } from "@/lib/lifecycle";
import { SpeakButton } from "@/components/speech";
import { CropAvatar, EmptyState, cardCls, useMandiText } from "@/components/mandi";
import { EstimateNote, LocationPrompt, MarketPriceCard, SourceChip, distanceTo, useFarmPlace, useRateText } from "@/components/mandi/rates";
import { cx } from "@/components/ui";

type Sort = "rate" | "near" | "net";
const ALL = "";
const OTHER = "other";

export default function CropRates() {
  const { cropId } = useParams<{ cropId: string }>();
  const { state, l, tx, num, date } = useStore();
  const t = useMandiText();
  const r = useRateText();
  const g = gradingFor(cropId);
  const prices = usePrices(g ? cropId : undefined);
  const { place } = useFarmPlace();
  const [type, setType] = useState(ALL);
  const [sort, setSort] = useState<Sort>("rate");

  if (!g) return <EmptyState title={l("Crop not found", "पीक सापडले नाही")} />;
  const unit = g.saleUnit;
  const rows = prices.rows.filter((x) => !type || (type === OTHER ? !x.typeCode : x.typeCode === type));
  const km = (x: MarketPrice) => distanceTo(place, x.marketId);
  // best net for 1 quintal of the middle grade, with the farmer's vehicle
  const net1 = (x: MarketPrice) => {
    const m = marketById(x.marketId);
    if (!m || !place) return -Infinity;
    const leg = legFor({ cropId, typeCode: x.typeCode, items: [], from: place, rows: [x], mitraRates: state.mitraRates, today: todayISO(), vehicle: state.myVehicle }, m, [{ gradeCode: pricedGrade(cropId, "unsure"), qtyQtl: 1 }]);
    return leg?.net ?? -Infinity;
  };
  const sorted = [...rows].sort((a, b) =>
    sort === "near" ? (km(a) ?? 1e9) - (km(b) ?? 1e9) : sort === "net" ? net1(b) - net1(a) : b.modalPerQtl - a.modalPerQtl,
  );
  const highest = [...rows].sort((a, b) => b.modalPerQtl - a.modalPerQtl)[0];
  const nearest = place ? [...rows].sort((a, b) => (km(a) ?? 1e9) - (km(b) ?? 1e9))[0] : undefined;
  const latest = rows.map((x) => x.date).sort().at(-1);
  const crop = t.crop(cropId);
  // `n` formats numbers: digits for the voice (it reads them as Marathi words), num() on screen
  const summaryWith = (n: (x: number) => string) =>
    highest
      ? l(
          `Highest ${crop} rate today: ${tx(highest.marketName)} ₹${n(r.per(highest.modalPerQtl, unit))} per ${t.unit(unit)}.${nearest ? ` Market near you: ${tx(nearest.marketName)} ₹${n(r.per(nearest.modalPerQtl, unit))}.` : ""}`,
          `आज ${crop}: सर्वात जास्त दर ${tx(highest.marketName)} येथे ${n(r.per(highest.modalPerQtl, unit))} रुपये प्रति ${t.unit(unit)} आहे.${nearest ? ` तुमच्या जवळचा बाजार ${tx(nearest.marketName)}, दर ${n(r.per(nearest.modalPerQtl, unit))} रुपये.` : ""}`,
        )
      : "";
  const summary = summaryWith(String);
  const summaryShown = summaryWith((x) => num(x));
  const types = [...(g.typeOptions ?? []).map((o) => ({ code: o.code, name: tx(o.name) })), ...(g.typeOptions && prices.rows.some((x) => !x.typeCode) ? [{ code: OTHER, name: l("Other", "इतर") }] : [])];
  const chip = (on: boolean) => cx("min-h-11 shrink-0 rounded-full border-2 px-4 text-[15px] font-bold", on ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white");

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Link href="/mandi/rates" aria-label={l("Back", "मागे")} className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-leaf-700">
          <ArrowLeft size={22} />
        </Link>
        <CropAvatar cropId={cropId} />
        <div className="min-w-0 flex-1">
          <h1 className="text-[22px] font-bold leading-tight">
            {crop} · {l("rates", "भाव")}
          </h1>
          {latest && <p className="text-sm text-muted">{date(latest)}</p>}
        </div>
        <SpeakButton id={`rates-${cropId}`} text={summary || `${crop} ${l("rates", "भाव")}`} />
      </div>
      {!prices.loading && <SourceChip source={prices.source} date={latest} />}

      {g.typeOptions && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
          <button type="button" role="tab" aria-selected={!type} className={chip(!type)} onClick={() => setType(ALL)}>
            {l("All", "सर्व")}
          </button>
          {types.map((o) => (
            <button key={o.code} type="button" role="tab" aria-selected={type === o.code} className={chip(type === o.code)} onClick={() => setType(o.code)}>
              {o.name}
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label={l("Sort", "क्रम")}>
        {(
          [
            ["rate", l("Highest rate", "जास्त दर")],
            ["near", l("Nearest", "जवळचे")],
            ["net", l("Best net", "सर्वोत्तम निव्वळ")],
          ] as const
        ).map(([k, label]) => (
          <button key={k} type="button" aria-pressed={sort === k} className={chip(sort === k)} onClick={() => setSort(k)} disabled={k !== "rate" && !place}>
            {label}
          </button>
        ))}
      </div>

      {!place && <LocationPrompt compact />}

      {prices.loading ? (
        <div className="space-y-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className={cx(cardCls, "h-36 animate-pulse bg-sand")} />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState title={l("No rates for this crop today", "आज या पिकाचे दर उपलब्ध नाहीत")} />
      ) : (
        <>
          {summary && (
            <div className="flex items-start gap-2 rounded-2xl bg-leaf-50 p-3">
              <p className="flex-1 text-[16px] font-semibold text-leaf-900">{summaryShown}</p>
              <SpeakButton id={`rates-summary-${cropId}`} size="sm" text={summary} />
            </div>
          )}
          {sort === "net" && <p className="text-sm text-muted">{l(`Net for 1 quintal of ${t.grade(pricedGrade(cropId, "unsure"))}, after transport and charges (estimate).`, `${t.grade(pricedGrade(cropId, "unsure"))} १ क्विंटलसाठी, वाहतूक व खर्च वजा करून निव्वळ (अंदाजे).`)}</p>}
          <div className="space-y-3">
            {sorted.map((x) => (
              <MarketPriceCard
                key={`${x.marketId}|${x.varietyRaw}`}
                row={x}
                unit={unit}
                distanceKm={km(x)}
                mitraRates={state.mitraRates}
                typeLabel={x.typeCode ? t.type(x.typeCode) : g.typeOptions ? x.varietyRaw : undefined}
              />
            ))}
          </div>
          <EstimateNote />
          <p className="text-xs text-muted">
            {num(rows.length)} {l("rates", "दर")} · {l("Source: data.gov.in (Agmarknet) when available", "स्रोत: उपलब्ध असल्यास data.gov.in (ॲगमार्कनेट)")}
          </p>
        </>
      )}

      <div className="sticky bottom-20 z-20 pt-2">
        <Link href={`/sell/new?crop=${cropId}`} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-leaf-700 text-lg font-bold text-white shadow-lg active:scale-95">
          <ShoppingBasket size={20} /> {l("I want to sell this crop", "हा माल विकायचा आहे")}
        </Link>
      </div>
    </div>
  );
}
