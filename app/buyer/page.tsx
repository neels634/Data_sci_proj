"use client";

/** Buyer: pooled, Mitra-checked lots, filtered by crop / type / grade chips. */
import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, Droplets } from "lucide-react";
import { buyerById, lotQuantity, useStore } from "@/lib/store";
import { CURRENT_BUYER_ID } from "@/lib/data";
import { gradingFor, marketName, UNSURE } from "@/lib/grades";
import type { Lot } from "@/lib/types";
import { EmptyState, cardCls, useMandiText } from "@/components/mandi";
import { Badge, Note, cx } from "@/components/ui";

const ALL = "";

export default function BuyerBrowse() {
  const { state, account, l, tx, lbl, num, date } = useStore();
  const t = useMandiText();
  const me = buyerById(CURRENT_BUYER_ID)!;
  const [crop, setCrop] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [grade, setGrade] = useState(ALL);

  const open = state.lots.filter((x) => x.status === "Open for offers");
  const byCrop = open.filter((x) => !crop || x.crop === crop);
  const byType = byCrop.filter((x) => !type || x.typeCode === type);
  const lots = byType.filter((x) => !grade || x.gradeCode === grade);
  const members = (lot: Lot) => state.listings.filter((x) => lot.listingIds.includes(x.id));
  const moistureOf = (lot: Lot) => {
    const m = members(lot)
      .map((x) => x.mitraMoisture)
      .filter((v): v is number => v != null);
    return m.length ? Math.max(...m) : null;
  };

  const chip = (on: boolean) => cx("min-h-11 shrink-0 rounded-full border-2 px-4 text-[15px] font-bold", on ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white");
  const row = (label: string, values: string[], value: string, set: (v: string) => void, name: (v: string) => string) =>
    values.length > 0 && (
      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label={label}>
        <button type="button" className={chip(value === ALL)} aria-pressed={value === ALL} onClick={() => set(ALL)}>
          {l("All", "सर्व")}
        </button>
        {values.map((v) => (
          <button key={v} type="button" className={chip(value === v)} aria-pressed={value === v} onClick={() => set(v)}>
            {name(v)}
          </button>
        ))}
      </div>
    );

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-[23px] font-bold">{l("Village produce", "गावातील माल")}</h1>
        <p className="text-sm text-muted">
          {(() => {
            const biz = account?.businessName || tx(me.name);
            const type = lbl(account?.businessType || me.type);
            return l(`Signed in as ${biz} (${type})`, `${biz} (${type}) म्हणून लॉग इन`);
          })()}
        </p>
      </div>
      <Note>{l("Your business is not yet verified. Farmers will see a “not verified” label on your offers.", "तुमच्या व्यवसायाची अजून पडताळणी झालेली नाही. शेतकऱ्यांना तुमच्या ऑफरवर ‘पडताळलेला नाही’ असे दिसेल.")}</Note>

      {row(l("Crop", "पीक"), Array.from(new Set(open.map((x) => x.crop))), crop, (v) => {
        setCrop(v);
        setType(ALL);
        setGrade(ALL);
      }, (v) => `${gradingFor(v)?.emoji ?? ""} ${t.crop(v)}`)}
      {row(l("Type", "प्रकार"), Array.from(new Set(byCrop.map((x) => x.typeCode).filter((v): v is string => !!v))), type, (v) => {
        setType(v);
        setGrade(ALL);
      }, t.type)}
      {row(l("Grade", "प्रत"), Array.from(new Set(byType.map((x) => x.gradeCode))), grade, setGrade, t.grade)}

      {lots.length === 0 ? (
        <EmptyState title={l("No lots match", "जुळणारे लॉट नाहीत")} />
      ) : (
        <div className="space-y-3">
          {lots.map((lot) => {
            const g = gradingFor(lot.crop);
            const qty = lotQuantity(lot, state.listings);
            const moisture = moistureOf(lot);
            const local = marketName(lot.crop, "lasalgaon", lot.gradeCode);
            const mineOffer = state.offers.find((o) => o.lotId === lot.id && o.buyerId === CURRENT_BUYER_ID);
            const n = lot.listingIds.length;
            return (
              <div key={lot.id} className={cx(cardCls, "overflow-hidden")}>
                <div className="flex items-center gap-3 px-4 py-3" style={{ background: g?.color ?? "#f1e8d8" }}>
                  <span className="text-4xl" aria-hidden="true">
                    {g?.emoji ?? "🌱"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xl font-bold text-ink">
                      {t.crop(lot.crop)}
                      {lot.typeCode ? ` · ${t.type(lot.typeCode)}` : ""}
                    </span>
                    <span className="block text-sm text-ink/80">
                      {tx(lot.village)} · {l(`${n} farmer${n === 1 ? "" : "s"}`, `${num(n)} शेतकरी`)}
                    </span>
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-leaf-100 px-2.5 py-1 text-sm font-bold text-leaf-900">
                      {t.grade(lot.gradeCode)}
                      {local && local !== t.grade(lot.gradeCode) ? ` (${local})` : ""}
                    </span>
                    {lot.gradeCode !== UNSURE && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-sm font-bold text-indigo-900">
                        <BadgeCheck size={15} /> {l("Mitra-checked", "मित्र-तपासणी")}
                      </span>
                    )}
                    {moisture != null && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-sm font-bold text-sky-900">
                        <Droplets size={15} /> {l("Moisture", "ओलावा")} {num(moisture)}%
                      </span>
                    )}
                    {mineOffer && <Badge tone="gold">{l("Your offer", "तुमची ऑफर")}: {lbl(mineOffer.status)}</Badge>}
                  </div>
                  <p className="mt-2 text-3xl font-bold text-leaf-900">{t.qty(qty, lot.unit)}</p>
                  <p className="text-sm text-muted">
                    {l("Ready", "तयार")} {date(lot.availableFrom)} · {l("Mitra", "मित्र")} {tx(lot.mitra)}
                  </p>
                  <Link href={`/buyer/lots/${lot.id}`} className="mt-3 flex min-h-12 items-center justify-center rounded-xl bg-leaf-700 font-bold text-white active:scale-95">
                    {l("Make an offer", "ऑफर द्या")}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
