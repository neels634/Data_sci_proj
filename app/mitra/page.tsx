"use client";

/** Mitra home: what to check, what to recheck today, what's ready to pool — grouped by village, oldest first. */
import Link from "next/link";
import { CheckCircle2, Clock, Droplets, IndianRupee, Layers } from "lucide-react";
import { dueRecheck, lotQuantity, poolable, useStore } from "@/lib/store";
import { CURRENT_MITRA } from "@/lib/data";
import { todayISO } from "@/lib/lifecycle";
import { UNSURE } from "@/lib/grades";
import type { Listing } from "@/lib/types";
import { SpeakButton } from "@/components/speech";
import { CropAvatar, EmptyState, StatCard, StatusPill, cardCls, useMandiText } from "@/components/mandi";
import { Badge, cx, statusTone } from "@/components/ui";

export default function MitraHome() {
  const { state, account, l, tx, lbl, num } = useStore();
  const t = useMandiText();
  const today = todayISO();
  const toCheck = state.listings.filter((x) => x.status === "waiting_check");
  const recheck = state.listings.filter((x) => dueRecheck(x, today));
  const ready = state.listings.filter(poolable);
  const openLots = state.lots.filter((x) => x.status !== "Completed");
  const first = (account?.name ?? tx(CURRENT_MITRA)).split(" ")[0];
  const queue = [...recheck, ...toCheck].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const villages = Array.from(new Set(queue.map((x) => tx(x.village))));
  const summary = l(`${toCheck.length} to check, ${recheck.length} to recheck today, ${ready.length} ready to pool`, `${num(toCheck.length)} तपासायचे, ${num(recheck.length)} आज पुन्हा तपासा, ${num(ready.length)} तयार`);

  const chips = (x: Listing) => {
    const out = [`${l("Grade", "प्रत")}: ${x.gradeCode === UNSURE ? l("don't know", "माहीत नाही") : t.grade(x.gradeCode)}`];
    if (x.dryness) out.push(`${l("Dry", "वाळलेला")}: ${x.dryness === "dry" ? l("yes", "हो") : x.dryness === "damp" ? l("a bit damp", "थोडा ओला") : l("don't know", "माहीत नाही")}`);
    if (x.dryRequestedAt) out.push(l("Farmer says: dried", "शेतकरी: वाळवले"));
    return out;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-3xl bg-leaf-50 p-4">
        <div className="flex-1">
          <h1 className="text-[23px] font-bold">
            {l("Namaskar", "नमस्कार")}, {first}
          </h1>
          <p className="text-[15px] text-leaf-900">{summary}</p>
        </div>
        <SpeakButton id="mitra-home" text={summary} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatCard label={l("To check", "तपासायचे")} value={toCheck.length} icon={<Clock size={18} />} tint="bg-gold-100 text-gold" />
        <StatCard label={l("Recheck today", "आज पुन्हा तपासा")} value={recheck.length} icon={<Droplets size={18} />} tint="bg-sky-100 text-sky-800" />
        <StatCard label={l("Ready", "तयार")} value={ready.length} icon={<CheckCircle2 size={18} />} tint="bg-leaf-100 text-leaf-700" href="/mitra/pool" />
      </div>

      <section>
        <h2 className="mb-2 text-xl font-bold">{l("To check", "तपासायचे")}</h2>
        {queue.length === 0 ? (
          <EmptyState title={l("Nothing to check right now", "सध्या तपासायला काही नाही")} />
        ) : (
          villages.map((v) => (
            <div key={v} className="mb-4">
              <p className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">{v}</p>
              <div className="space-y-2">
                {queue
                  .filter((x) => tx(x.village) === v)
                  .map((x) => (
                    <div key={x.id} className={cx(cardCls, "p-3")}>
                      <div className="flex items-center gap-3">
                        <CropAvatar cropId={x.crop} />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold">{tx(x.farmer)}</p>
                          <p className="text-[15px] text-muted">
                            {t.crop(x.crop)}
                            {x.typeCode ? ` (${t.type(x.typeCode)})` : ""} · {t.qty(x.quantity, x.unit)}
                          </p>
                        </div>
                        <StatusPill status={x.status} />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {chips(x).map((c) => (
                          <span key={c} className="rounded-full bg-sand px-2.5 py-1 text-sm">
                            {c}
                          </span>
                        ))}
                      </div>
                      <Link href={`/mitra/check/${x.id}`} className="mt-3 flex min-h-12 items-center justify-center rounded-xl bg-leaf-700 font-bold text-white active:scale-95">
                        {x.status === "needs_drying" ? l("Check again", "पुन्हा तपासा") : l("Check", "तपासा")}
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </section>

      <Link href="/mitra/pool" className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-leaf-700 text-lg font-bold text-white active:scale-95">
        <Layers size={20} /> {l("Make a lot", "लॉट तयार करा")}
      </Link>
      <Link href="/mitra/rates" className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-leaf-700/40 bg-white text-lg font-bold text-leaf-700 active:scale-95">
        <IndianRupee size={20} /> {l("Enter today's rates", "आजचे दर नोंदवा")}
      </Link>

      {openLots.length > 0 && (
        <section>
          <h2 className="mb-2 text-xl font-bold">{l("Open lots", "चालू लॉट")}</h2>
          <div className="space-y-2">
            {openLots.map((lot) => (
              <Link key={lot.id} href={`/mitra/lots/${lot.id}`} className={cx(cardCls, "flex items-center gap-3 p-3")}>
                <CropAvatar cropId={lot.crop} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">
                    {t.crop(lot.crop)} · {t.grade(lot.gradeCode)}
                  </span>
                  <span className="block text-sm text-muted">{t.qty(lotQuantity(lot, state.listings), lot.unit)}</span>
                </span>
                <Badge tone={statusTone(lot.status)}>{lbl(lot.status)}</Badge>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
