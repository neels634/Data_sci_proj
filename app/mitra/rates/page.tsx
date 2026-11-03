"use client";

/**
 * "Enter today's rates": a Mitra records real grade-wise rates heard at a market today. They
 * replace the estimate for that market and grade, for today only, and show as "Mitra rate".
 */
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useStore } from "@/lib/store";
import { convert, GRADINGS, gradingFor } from "@/lib/grades";
import { MARKETS } from "@/lib/mandi/markets";
import { todayISO } from "@/lib/lifecycle";
import { SpeakButton } from "@/components/speech";
import { GradeVisual, StickyAction, cardCls, useMandiText } from "@/components/mandi";
import { cx } from "@/components/ui";

const toAscii = (s: string) => s.replace(/[०-९]/g, (d) => String("०१२३४५६७८९".indexOf(d))).replace(/[^\d]/g, "");

export default function MitraRates() {
  const { state, account, l, tx, num, date, saveMitraRates } = useStore();
  const t = useMandiText();
  const [market, setMarket] = useState("phaltan");
  const [crop, setCrop] = useState("onion");
  const [typeCode, setTypeCode] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const g = gradingFor(crop)!;
  const unit = g.saleUnit;
  const today = todayISO();
  const mine = state.mitraRates.filter((r) => r.by === account?.id && r.date === today);
  const title = l("Enter today's rates", "आजचे दर नोंदवा");
  const chip = (on: boolean) => cx("min-h-11 shrink-0 rounded-full border-2 px-4 text-[15px] font-bold", on ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white");
  const existing = (gradeCode: string) => state.mitraRates.find((r) => r.marketId === market && r.cropId === crop && r.gradeCode === gradeCode && r.date === today && (r.typeCode ?? "") === typeCode);
  const shown = (gradeCode: string) => values[gradeCode] ?? (existing(gradeCode) ? num(Math.round(convert(1, unit, "quintal") * existing(gradeCode)!.perQtl), { useGrouping: false }) : "");

  const entered = g.grades.map((x) => ({ x, perUnit: Number(toAscii(shown(x.code))) })).filter((e) => e.perUnit > 0);
  const save = () => {
    saveMitraRates(entered.map((e) => ({ marketId: market, cropId: crop, typeCode: typeCode || undefined, gradeCode: e.x.code, perQtl: Math.round(e.perUnit / convert(1, unit, "quintal")) })));
    setValues({});
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/mitra" aria-label={l("Back", "मागे")} className="grid size-12 place-items-center rounded-full bg-white text-leaf-700">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="flex-1 text-[23px] font-bold">{title}</h1>
        <SpeakButton id="mitra-rates" text={`${title}. ${l("Only for the grades you know. Valid for today.", "फक्त माहीत असलेल्या प्रतींचे. फक्त आजसाठी.")}`} />
      </div>

      <section>
        <h2 className="mb-2 font-bold">{l("Market", "बाजार")}</h2>
        <select value={market} onChange={(e) => setMarket(e.target.value)} className="min-h-12 w-full rounded-xl border border-line bg-white px-3 text-[17px]" aria-label={l("Market", "बाजार")}>
          {MARKETS.map((m) => (
            <option key={m.id} value={m.id}>
              {tx(m.name)} ({m.district})
            </option>
          ))}
        </select>
      </section>
      <section>
        <h2 className="mb-2 font-bold">{l("Crop", "पीक")}</h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {GRADINGS.map((c) => (
            <button
              key={c.cropId}
              type="button"
              aria-pressed={crop === c.cropId}
              className={chip(crop === c.cropId)}
              onClick={() => {
                setCrop(c.cropId);
                setTypeCode("");
                setValues({});
              }}
            >
              {c.emoji} {tx(c.name)}
            </button>
          ))}
        </div>
      </section>
      {g.typeOptions && (
        <section>
          <h2 className="mb-2 font-bold">{l("Type", "प्रकार")}</h2>
          <div className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={!typeCode} className={chip(!typeCode)} onClick={() => setTypeCode("")}>
              {l("Any", "कोणताही")}
            </button>
            {g.typeOptions.map((o) => (
              <button key={o.code} type="button" aria-pressed={typeCode === o.code} className={chip(typeCode === o.code)} onClick={() => setTypeCode(o.code)}>
                {tx(o.name)}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="font-bold">
          {l("₹ per", "₹ प्रति")} {t.unit(unit)}
        </h2>
        {[...g.grades]
          .sort((a, b) => a.rank - b.rank)
          .map((x) => (
            <label key={x.code} className={cx(cardCls, "flex items-center gap-3 p-2")}>
              <GradeVisual grade={x} emoji={g.emoji} className="size-12 shrink-0" />
              <span className="min-w-0 flex-1 font-bold">{tx(x.name)}</span>
              <span className="text-lg font-bold text-muted">₹</span>
              <input
                inputMode="numeric"
                value={shown(x.code)}
                onChange={(e) => setValues((v) => ({ ...v, [x.code]: e.target.value }))}
                placeholder={l("unknown", "माहीत नाही")}
                className="h-12 w-28 rounded-xl border border-line bg-white px-2 text-center text-lg font-bold"
              />
            </label>
          ))}
      </section>

      {mine.length > 0 && (
        <section className={cx(cardCls, "p-3")}>
          <p className="font-bold">
            {l("Entered today", "आज नोंदवलेले")} · {date(today)}
          </p>
          {mine.map((r) => (
            <p key={r.id} className="text-sm">
              {tx(MARKETS.find((m) => m.id === r.marketId)?.name)} · {t.crop(r.cropId)} · {t.grade(r.gradeCode)} · ₹{num(r.perQtl)}/{t.unit("quintal", true)}
            </p>
          ))}
        </section>
      )}

      <StickyAction onClick={save} disabled={entered.length === 0}>
        <Save size={20} /> {l("Save today's rates", "आजचे दर जतन करा")}
      </StickyAction>
    </div>
  );
}
