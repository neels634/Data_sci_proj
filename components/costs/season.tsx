"use client";

/**
 * Whole farm: this season's cash spent, income and net across crops, general farm expenses (with a
 * share by area), and a summary to share or a CSV to download. Built on the phone; nothing is sent.
 */
import { useState } from "react";
import { Download, Share2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { CATEGORIES, categoryInfo } from "@/lib/costs/categories";
import { splitByArea } from "@/lib/costs/estimate";
import { todayISO } from "@/lib/lifecycle";
import type { FarmCrop } from "@/lib/types";
import { SpeakButton } from "@/components/speech";
import { cx } from "@/components/ui";
import { CAT_ICON, card, useMoney } from "./index";

type Season = "kharif" | "rabi" | "summer" | "year";

/** this agricultural year's (Jun–May) date range for a season */
export function seasonRange(season: Season, today: string): [string, string] {
  const y = Number(today.slice(0, 4));
  const start = Number(today.slice(5, 7)) >= 6 ? y : y - 1;
  const r: Record<Season, [string, string]> = {
    kharif: [`${start}-06-01`, `${start}-10-31`],
    rabi: [`${start}-11-01`, `${start + 1}-02-${(start + 1) % 4 === 0 ? 29 : 28}`],
    summer: [`${start + 1}-03-01`, `${start + 1}-05-31`],
    year: [`${start}-06-01`, `${start + 1}-05-31`],
  };
  return r[season];
}

const csvCell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

export function SeasonCosts({ crops, nameOf }: { crops: FarmCrop[]; nameOf: (fc: FarmCrop) => string }) {
  const { state, l, tx, num, date, toast } = useStore();
  const m = useMoney();
  const today = todayISO();
  const month = Number(today.slice(5, 7));
  const [season, setSeason] = useState<Season>(month >= 6 && month <= 10 ? "kharif" : month >= 3 && month <= 5 ? "summer" : "rabi");
  const [split, setSplit] = useState(false);
  const [from, to] = seasonRange(season, today);
  const [yearFrom, yearTo] = seasonRange("year", today);
  // a crop belongs to the season it was grown in (a rabi onion's nursery can start in August);
  // its costs count from a few months before the agricultural year, for land preparation
  const prepFrom = `${Number(yearFrom.slice(0, 4))}-03-01`;
  const inSeason = (fc: FarmCrop | undefined) => !!fc && (season === "year" || fc.season === season);
  const cropOf = (id: string | null) => crops.find((c) => c.id === id);
  const expenses = state.myExpenses.filter((e) =>
    e.farmCropId ? inSeason(cropOf(e.farmCropId)) && e.date >= (season === "year" ? yearFrom : prepFrom) && e.date <= yearTo : e.date >= from && e.date <= to,
  );
  const sales = state.mySales.filter((x) => inSeason(cropOf(x.farmCropId)) && x.date >= (season === "year" ? yearFrom : prepFrom) && x.date <= yearTo);
  const cash = expenses.filter((e) => e.cashPaid).reduce((a, e) => a + e.amount, 0);
  const income = sales.reduce((a, x) => a + x.amount, 0);
  const general = expenses.filter((e) => !e.farmCropId && e.cashPaid).reduce((a, e) => a + e.amount, 0);
  const active = crops.filter((c) => expenses.some((e) => e.farmCropId === c.id) || sales.some((x) => x.farmCropId === c.id));
  const share = split ? splitByArea(general, active) : {};
  const perCrop = active
    .map((c) => ({ c, spent: expenses.filter((e) => e.farmCropId === c.id && e.cashPaid).reduce((a, e) => a + e.amount, 0) + (share[c.id] ?? 0), income: sales.filter((x) => x.farmCropId === c.id).reduce((a, x) => a + x.amount, 0) }))
    .sort((a, b) => b.spent - a.spent);
  const maxSpent = Math.max(1, ...perCrop.map((x) => x.spent));
  const byCat = CATEGORIES.map((c) => ({ c, amount: expenses.filter((e) => e.cashPaid && e.category === c.code).reduce((a, e) => a + e.amount, 0) })).filter((x) => x.amount > 0);
  const names: Record<Season, string> = { kharif: l("Kharif", "खरीप"), rabi: l("Rabi", "रब्बी"), summer: l("Summer", "उन्हाळी"), year: l("Year", "वर्ष") };
  const summary = l(
    `${names[season]} ${yearFrom.slice(0, 4)}: spent ${cash} rupees, income ${income} rupees, net ${income - cash} rupees.`,
    `${names[season]} ${yearFrom.slice(0, 4)}: खर्च ${cash} रुपये, उत्पन्न ${income} रुपये, निव्वळ ${income - cash} रुपये.`,
  );

  const shareSummary = async () => {
    const lines = [summary, ...perCrop.map((x) => `${nameOf(x.c)}: ${l("spent", "खर्च")} ₹${x.spent}, ${l("income", "उत्पन्न")} ₹${x.income}`), general ? `${l("Whole farm", "पूर्ण शेती")}: ₹${general}` : ""].filter(Boolean).join("\n");
    try {
      if (navigator.share) await navigator.share({ title: l("Farm costs", "शेती खर्च"), text: lines });
      else {
        await navigator.clipboard.writeText(lines);
        toast({ en: "Summary copied", mr: "सारांश कॉपी केला" });
      }
    } catch {
      /* the farmer closed the share sheet */
    }
  };
  const downloadCsv = () => {
    const rows = [
      ["type", "date", "crop", "category", "item", "amount", "cash_paid", "qty", "unit", "note"],
      ...expenses.map((e) => ["expense", e.date, e.farmCropId ? nameOf(crops.find((c) => c.id === e.farmCropId) ?? ({} as FarmCrop)) : "farm", e.category, e.item, e.amount, e.cashPaid ? "yes" : "no", e.qty ?? "", e.unit ?? "", e.note ?? ""]),
      ...sales.map((x) => ["sale", x.date, nameOf(crops.find((c) => c.id === x.farmCropId) ?? ({} as FarmCrop)), "", x.gradeCode ?? "", x.amount, "", x.qty, x.unit, x.marketId ?? ""]),
    ];
    const blob = new Blob(["﻿" + rows.map((r) => r.map(csvCell).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `farm-costs-${season}-${from.slice(0, 4)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <section className={cx(card, "mt-4 space-y-3 p-4")}>
      <div className="flex items-center gap-2">
        <h2 className="flex-1 text-lg font-bold">{l("This season's costs", "या हंगामाचा खर्च")}</h2>
        <SpeakButton id="season-costs" text={summary} />
      </div>
      <div className="grid grid-cols-4 gap-1 rounded-xl bg-sand p-1" role="radiogroup">
        {(["kharif", "rabi", "summer", "year"] as const).map((s) => (
          <button key={s} type="button" role="radio" aria-checked={season === s} onClick={() => setSeason(s)} className={cx("min-h-10 rounded-lg text-sm font-bold", season === s ? "bg-white shadow" : "text-muted")}>
            {names[s]}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted">
        {season === "year" ? `${date(yearFrom)} – ${date(yearTo)}` : l(`${names[season]} crops of ${yearFrom.slice(0, 4)}–${yearTo.slice(2, 4)}`, `${yearFrom.slice(0, 4)}–${yearTo.slice(2, 4)} मधील ${names[season]} पिके`)}
      </p>
      <div className="grid grid-cols-3 gap-2 text-center">
        <p className="rounded-xl bg-sand p-2 text-xs font-semibold">
          {l("Cash spent", "खर्च")}
          <b className="block text-base">{m.rs(cash)}</b>
        </p>
        <p className="rounded-xl bg-sand p-2 text-xs font-semibold">
          {l("Income", "उत्पन्न")}
          <b className="block text-base">{m.rs(income)}</b>
        </p>
        <p className={cx("rounded-xl p-2 text-xs font-semibold", income - cash >= 0 ? "bg-leaf-50 text-leaf-900" : "bg-soil-100 text-[#8a3a1d]")}>
          {l("Net", "निव्वळ")}
          <b className="block text-base">
            {income - cash >= 0 ? "▲" : "▼"} {m.rs(Math.abs(income - cash))}
          </b>
        </p>
      </div>
      {perCrop.length > 0 && (
        <ul className="space-y-2">
          {perCrop.map((x) => (
            <li key={x.c.id}>
              <span className="flex justify-between text-sm">
                <span className="font-semibold">{nameOf(x.c)}</span>
                <b>{m.rs(x.spent)}</b>
              </span>
              <span className="block h-2.5 overflow-hidden rounded-full bg-sand">
                <span className="block h-full rounded-full bg-leaf-600" style={{ width: `${(x.spent / maxSpent) * 100}%` }} />
              </span>
            </li>
          ))}
        </ul>
      )}
      {byCat.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {byCat.map(({ c, amount }) => (
            <span key={c.code} className="inline-flex items-center gap-1 rounded-full bg-cream px-2 py-1 text-xs font-bold">
              <span className="grid size-5 place-items-center rounded-full text-white [&>svg]:size-3" style={{ background: categoryInfo(c.code).color }}>
                {CAT_ICON[c.code]}
              </span>
              {tx(c.name)} {m.rs(amount)}
            </span>
          ))}
        </div>
      )}
      {general > 0 && (
        <div className="rounded-xl bg-sand p-2 text-sm">
          <p>
            {l("Whole-farm expenses", "पूर्ण शेतीचा खर्च")}: <b>{m.rs(general)}</b>
          </p>
          <label className="mt-1 flex min-h-10 items-center gap-2 font-semibold">
            <input type="checkbox" className="size-5 accent-leaf-700" checked={split} onChange={(e) => setSplit(e.target.checked)} />
            {l("Share it across crops by area", "क्षेत्रानुसार वाटा")}
          </label>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={shareSummary} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-leaf-700/40 font-bold text-leaf-700">
          <Share2 size={18} /> {l("Share summary", "सारांश शेअर करा")}
        </button>
        <button type="button" onClick={downloadCsv} disabled={!expenses.length && !sales.length} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-leaf-700/40 font-bold text-leaf-700 disabled:opacity-40">
          <Download size={18} /> {l("Download CSV", "CSV डाउनलोड")}
        </button>
      </div>
      <p className="text-xs text-muted">
        {num(expenses.length)} {l("expenses", "खर्च नोंदी")} · {num(sales.length)} {l("sales", "विक्री")}
      </p>
    </section>
  );
}
