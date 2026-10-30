"use client";

import Link from "next/link";
import { Briefcase, Landmark, ShoppingBasket, Users, ScanEye } from "lucide-react";
import { useStore } from "@/lib/store";

/** Farmer home: main options, including direct Crop Check access. */
export default function FarmerHome() {
  const { state, l, isMine } = useStore();
  // a small count on Sell when buyers have sent offers, so they aren't missed
  const offers = state.listings.filter((x) => isMine(x) && x.status === "Offer received").length;

  const tiles = [
    { href: "/crop-check", label: l("Crop Check", "पीक तपासणी"), icon: <ScanEye size={48} strokeWidth={1.75} />, tone: "bg-emerald-100 text-emerald-800", span: "col-span-2 py-5" },
    { href: "/schemes", label: l("Schemes", "योजना"), icon: <Landmark size={44} strokeWidth={1.75} />, tone: "bg-leaf-100 text-leaf-700" },
    { href: "/sell", label: l("Sell produce", "माल विका"), icon: <ShoppingBasket size={44} strokeWidth={1.75} />, tone: "bg-soil-100 text-soil", badge: offers },
    { href: "/business", label: l("Business", "व्यवसाय"), icon: <Briefcase size={44} strokeWidth={1.75} />, tone: "bg-gold-100 text-gold" },
    { href: "/women", label: l("Women & SHG", "महिला व बचत गट"), icon: <Users size={44} strokeWidth={1.75} />, tone: "bg-[#ece4f3] text-[#5d3f7a]" },
  ];

  return (
    <nav aria-label={l("Main options", "मुख्य पर्याय")} className="grid min-h-[calc(100dvh-7rem)] grid-cols-2 auto-rows-fr gap-3">
      {tiles.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-3xl border border-line bg-white p-4 text-center shadow-sm active:scale-[0.98] ${
            t.span || ""
          }`}
        >
          <span className={`grid size-20 place-items-center rounded-full ${t.tone}`}>{t.icon}</span>
          <span className="text-xl font-bold leading-tight text-ink">{t.label}</span>
          {!!t.badge && (
            <span
              className="absolute right-3 top-3 grid min-w-8 place-items-center rounded-full bg-soil px-2 py-1 text-sm font-bold text-white"
              aria-label={l(`${t.badge} new offers`, `${t.badge} नवीन ऑफर`)}
            >
              {t.badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}

