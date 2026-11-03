"use client";

/**
 * Pooling: choose crop → type → grade, then tick from only the listings that match and are checked
 * ready and accepted. Mixing grades is impossible because nothing else is shown.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Layers } from "lucide-react";
import { poolable, poolKey, useStore } from "@/lib/store";
import { convert, gradingFor, marketName } from "@/lib/grades";
import { MARKETS, marketById } from "@/lib/mandi/markets";
import { SpeakButton } from "@/components/speech";
import { CropAvatar, EmptyState, cardCls, useMandiText } from "@/components/mandi";
import { cx } from "@/components/ui";

export default function Pool() {
  const router = useRouter();
  const { state, l, tx, createLot } = useStore();
  const t = useMandiText();
  const eligible = state.listings.filter(poolable);
  const crops = Array.from(new Set(eligible.map((x) => x.crop)));
  const [cropSel, setCrop] = useState("");
  const crop = crops.includes(cropSel) ? cropSel : (crops[0] ?? "");
  const forCrop = eligible.filter((x) => x.crop === crop);
  const types = Array.from(new Set(forCrop.map((x) => x.typeCode ?? "")));
  const [typeCode, setTypeCode] = useState<string | null>(null);
  const type = typeCode ?? types[0] ?? "";
  const forType = forCrop.filter((x) => (x.typeCode ?? "") === type);
  const grades = Array.from(new Set(forType.map((x) => x.mitraGradeCode ?? x.gradeCode)));
  const [gradeCode, setGradeCode] = useState<string | null>(null);
  const grade = gradeCode && grades.includes(gradeCode) ? gradeCode : (grades[0] ?? "");
  const key = poolKey({ crop, typeCode: type || undefined, gradeCode: grade });
  const matching = eligible.filter((x) => poolKey(x) === key);
  const [sel, setSel] = useState<string[]>([]);
  const chosen = matching.filter((x) => sel.includes(x.id));
  const unit = gradingFor(crop)?.saleUnit ?? "quintal";
  const total = chosen.reduce((a, x) => a + convert(x.quantity, x.unit, unit), 0);
  // default: the market most of the chosen farmers preferred
  const counts = new Map<string, number>();
  for (const x of chosen) if (x.preferredMarketId) counts.set(x.preferredMarketId, (counts.get(x.preferredMarketId) ?? 0) + 1);
  const suggested = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
  const [targetSel, setTarget] = useState("");
  const target = targetSel || suggested;
  const title = l("Make a lot", "लॉट तयार करा");

  const chip = (on: boolean) => cx("min-h-12 shrink-0 rounded-full border-2 px-4 font-bold active:scale-95", on ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white");
  const pick = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setSel([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/mitra" aria-label={l("Back", "मागे")} className="grid size-12 place-items-center rounded-full bg-white text-leaf-700">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="flex-1 text-[23px] font-bold">{title}</h1>
        <SpeakButton id="mitra-pool" text={`${title}. ${l("Only checked, accepted crop of the same grade is shown.", "फक्त तपासलेला, मान्य केलेला, एकाच प्रतीचा माल दिसतो.")}`} />
      </div>

      {eligible.length === 0 ? (
        <EmptyState title={l("No checked, accepted crop to pool yet", "लॉटसाठी तपासलेला, मान्य माल अजून नाही")} />
      ) : (
        <>
          <section>
            <h2 className="mb-2 font-bold">{l("Crop", "पीक")}</h2>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {crops.map((c) => (
                <button key={c} type="button" onClick={() => pick(setCrop)(c)} aria-pressed={crop === c} className={chip(crop === c)}>
                  {gradingFor(c)?.emoji} {t.crop(c)}
                </button>
              ))}
            </div>
          </section>
          {types.some(Boolean) && (
            <section>
              <h2 className="mb-2 font-bold">{l("Type", "प्रकार")}</h2>
              <div className="flex flex-wrap gap-2">
                {types.map((c) => (
                  <button key={c || "none"} type="button" onClick={() => pick(setTypeCode)(c)} aria-pressed={type === c} className={chip(type === c)}>
                    {c ? t.type(c) : l("Not given", "दिलेला नाही")}
                  </button>
                ))}
              </div>
            </section>
          )}
          <section>
            <h2 className="mb-2 font-bold">{l("Grade", "प्रत")}</h2>
            <div className="flex flex-wrap gap-2">
              {grades.map((c) => {
                const local = [marketName(crop, "lasalgaon", c), marketName(crop, "pune", c)].filter(Boolean);
                return (
                  <button key={c} type="button" onClick={() => pick(setGradeCode)(c)} aria-pressed={grade === c} className={chip(grade === c)}>
                    {t.grade(c)}
                    {local.length > 0 && <span className="ml-1 text-xs font-semibold opacity-80">({local.join(" / ")})</span>}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="mb-2 font-bold">{l("Farmers", "शेतकरी")}</h2>
            <div className="space-y-2">
              {matching.map((x) => {
                const on = sel.includes(x.id);
                return (
                  <label key={x.id} className={cx(cardCls, "flex min-h-16 cursor-pointer items-center gap-3 p-3", on && "border-leaf-700 ring-2 ring-leaf-700/20")}>
                    <input type="checkbox" className="size-6 accent-leaf-700" checked={on} onChange={() => setSel(on ? sel.filter((y) => y !== x.id) : [...sel, x.id])} />
                    <CropAvatar cropId={x.crop} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold">{tx(x.farmer)}</span>
                      <span className="block text-sm text-muted">{tx(x.village)}</span>
                      {x.preferredMarketId && (
                        <span className="block text-sm font-semibold text-indigo-800">
                          📍 {l("Wants", "पसंती")}: {tx(marketById(x.preferredMarketId)?.name)}
                        </span>
                      )}
                    </span>
                    <span className="text-lg font-bold text-leaf-900">{t.qty(x.quantity, x.unit)}</span>
                  </label>
                );
              })}
            </div>
          </section>

          <div className="sticky bottom-20 z-20 rounded-2xl bg-leaf-900 p-3 text-white shadow-lg">
            <p className="text-[17px]">
              {l("Total", "एकूण")}: <b>{t.qty(total, unit)}</b>
            </p>
            <label className="mt-2 flex items-center gap-2 text-sm">
              {l("Sell at", "विक्रीचा बाजार")}
              <select value={target} onChange={(e) => setTarget(e.target.value)} className="min-h-11 min-w-0 flex-1 rounded-xl px-2 text-[15px] text-ink">
                <option value="">{l("Decide later", "नंतर ठरवू")}</option>
                {MARKETS.filter((m) => m.crops.includes(crop)).map((m) => (
                  <option key={m.id} value={m.id}>
                    {tx(m.name)}
                    {m.id === suggested ? ` ★` : ""}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={chosen.length === 0}
              onClick={() => {
                createLot(
                  chosen.map((x) => x.id),
                  target || undefined,
                );
                router.push("/mitra/lots");
              }}
              className="mt-2 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white text-lg font-bold text-leaf-900 active:scale-95 disabled:opacity-50"
            >
              <Layers size={20} /> {l("Create lot", "लॉट तयार करा")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
