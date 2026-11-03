"use client";

/** Farmer's Mandi Mitra home: what's waiting, one big "I want to sell", and the latest listings. */
import Link from "next/link";
import { BadgeIndianRupee, ClipboardList, Phone, Plus, TrendingUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { MITRA_PHONE } from "@/lib/data";
import { SpeakButton } from "@/components/speech";
import { ListingCard, cardCls, useMandiText } from "@/components/mandi";
import { marketById } from "@/lib/mandi/markets";
import { cx } from "@/components/ui";

export default function MandiHome() {
  const { state, l, tx, num, date, isMine } = useStore();
  const mine = state.listings.filter(isMine);
  const active = mine.filter((x) => x.status !== "cancelled");
  const toCheck = mine.filter((x) => x.status === "waiting_check" || x.status === "needs_drying").length;
  const myLots = new Set(mine.map((x) => x.lotId).filter(Boolean));
  const offers = state.offers.filter((o) => myLots.has(o.lotId) && o.status === "Submitted").length;
  const recent = [...active].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);
  const first = tx(state.profile.name).split(" ")[0];
  const t = useMandiText();

  const summary = [
    toCheck > 0 && l(`${toCheck} to be checked`, `${num(toCheck)} माल तपासणीसाठी`),
    offers > 0 && l(`${offers} offer${offers > 1 ? "s" : ""} received`, `${num(offers)} ऑफर आली आहे`),
  ]
    .filter(Boolean)
    .join(", ");
  const summaryText = summary || l("Nothing waiting right now", "सध्या काही बाकी नाही");

  const tiles = [
    { href: "/sell/my", label: l("My listings", "माझा माल"), icon: <ClipboardList size={24} />, tint: "bg-leaf-100 text-leaf-700", count: active.length },
    { href: "/sell/my?tab=lot", label: l("Offers", "ऑफर्स"), icon: <BadgeIndianRupee size={24} />, tint: "bg-gold-100 text-gold", count: offers, dot: offers > 0 },
    { href: "/mandi/rates", label: l("Today's rates", "आजचे भाव"), icon: <TrendingUp size={24} />, tint: "bg-sky-100 text-sky-800" },
    { href: `tel:+91${MITRA_PHONE}`, label: l("Call Mitra", "मित्राला फोन"), icon: <Phone size={24} />, tint: "bg-indigo-100 text-indigo-800" },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-leaf-50 p-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-[23px] font-bold leading-tight">
              {l("Namaskar", "नमस्कार")}, {first}
            </h1>
            <p className="mt-1 text-[17px] text-leaf-900">{summaryText}</p>
          </div>
          <SpeakButton id="mandi-home" text={`${l("Namaskar", "नमस्कार")} ${first}. ${summaryText}`} />
        </div>
      </div>

      <Link href="/sell/new" className="flex min-h-24 items-center gap-3 rounded-3xl bg-leaf-700 p-4 text-white shadow-lg active:scale-[0.98]">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/15">
          <Plus size={30} />
        </span>
        <span className="flex-1 text-2xl font-bold leading-tight">{l("I want to sell", "माल विकायचा आहे")}</span>
        <svg viewBox="0 0 64 64" className="size-16 shrink-0" aria-hidden="true">
          <path d="M8 52 L14 30 H50 L56 52Z" fill="#f8ecd2" />
          <circle cx="24" cy="26" r="9" fill="#d9826a" />
          <circle cx="38" cy="24" r="10" fill="#c45d43" />
          <path d="M38 14 q2 -6 6 -7 M24 17 q-1 -5 -5 -6" stroke="#9fd0a8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </Link>

      <div className="grid grid-cols-2 gap-3">
        {tiles.map((t) => {
          const Tag = t.href.startsWith("tel:") ? "a" : Link;
          return (
          <Tag key={t.href} href={t.href} className={cx(cardCls, "relative flex min-h-24 flex-col items-start gap-2 p-3 active:scale-[0.98]")}>
            <span className={cx("grid size-11 place-items-center rounded-full", t.tint)}>{t.icon}</span>
            <span className="text-[17px] font-bold leading-tight">{t.label}</span>
            {t.count != null && t.count > 0 && (
              <span className="absolute right-3 top-3 grid min-w-7 place-items-center rounded-full bg-ink px-2 text-sm font-bold text-white">{num(t.count)}</span>
            )}
            {t.dot && <span className="absolute right-2 top-2 size-3 rounded-full bg-red-600" aria-label={l("New", "नवीन")} />}
          </Tag>
          );
        })}
      </div>

      {recent.length > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold">{l("My crop for sale", "विक्रीसाठी माझा माल")}</h2>
            <Link href="/sell/my" className="min-h-11 content-center text-sm font-bold text-leaf-700">
              {l("See all", "सर्व पाहा")}
            </Link>
          </div>
          <div className="space-y-3">
            {recent.map((x) => (
              <ListingCard key={x.id} listing={x} />
            ))}
          </div>
        </section>
      )}

      {state.mySellPlans.length > 0 && (
        <section>
          <h2 className="mb-2 text-xl font-bold">{l("My plans", "माझे नियोजन")}</h2>
          <div className="space-y-3">
            {state.mySellPlans.slice(0, 3).map((p) => (
              <div key={p.id} className={cx(cardCls, "p-3")}>
                <p className="font-bold">
                  {t.crop(p.cropId)} · {date(p.createdAt)}
                </p>
                {p.items.map((it) => (
                  <p key={it.gradeCode} className="text-[15px]">
                    {t.grade(it.gradeCode)} {num(it.qtyQtl, { maximumFractionDigits: 2 })} {t.unit("quintal", true)} → {tx(marketById(it.marketId)?.name)}
                  </p>
                ))}
                <p className="font-bold text-leaf-900">
                  {l("Net", "निव्वळ")} ₹{num(p.estNet)} <span className="text-xs text-muted">({l("estimate", "अंदाजे")})</span>
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.from(new Set(p.items.map((it) => it.marketId))).map((id) => {
                    const m = marketById(id);
                    return m ? (
                      <a key={id} href={`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-leaf-700/40 px-3 text-sm font-bold text-leaf-700">
                        📍 {tx(m.name)}
                      </a>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
