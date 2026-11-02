"use client";

import Link from "next/link";
import { Briefcase, Landmark, MessagesSquare, ShoppingBasket, Sprout, ScanEye } from "lucide-react";
import { useStore } from "@/lib/store";
import { getCrop } from "@/lib/crops";
import { todayISO, todayTasks } from "@/lib/lifecycle";

/** Farmer home: main options, including Crop Check and the Krishi Mitra farming assistant. */
export default function FarmerHome() {
  const { state, l, isMine } = useStore();
  // a small count on Sell when buyers have sent offers, so they aren't missed
  const offers = state.listings.filter((x) => isMine(x) && x.status === "Offer received").length;
  // My Farm: tasks due today (and overdue ones) across the farmer's crops
  const farmTasks = todayTasks(state.myFarmCrops, getCrop, state.myTaskStates, todayISO()).length;

  const tiles: { href: string; label: string; icon: React.ReactNode; tone: string; wide?: boolean; badge?: number; badgeLabel?: string }[] = [
    { href: "/crop-check", label: l("Crop Check", "पीक तपासणी"), icon: <ScanEye size={36} strokeWidth={1.75} />, tone: "bg-emerald-100 text-emerald-800", wide: true },
    { href: "/schemes", label: l("Schemes", "योजना"), icon: <Landmark size={44} strokeWidth={1.75} />, tone: "bg-leaf-100 text-leaf-700" },
    { href: "/sell", label: l("Sell produce", "माल विका"), icon: <ShoppingBasket size={44} strokeWidth={1.75} />, tone: "bg-soil-100 text-soil", badge: offers, badgeLabel: l(`${offers} new offers`, `${offers} नवीन ऑफर`) },
    { href: "/business", label: l("Business", "व्यवसाय"), icon: <Briefcase size={44} strokeWidth={1.75} />, tone: "bg-gold-100 text-gold" },
    { href: "/crops", label: l("My Farm", "माझी शेती"), icon: <Sprout size={44} strokeWidth={1.75} />, tone: "bg-[#ece4f3] text-[#5d3f7a]", badge: farmTasks, badgeLabel: l(`${farmTasks} farm tasks today`, `आज शेतीची ${farmTasks} कामे`) },
    { href: "/ask", label: l("Ask Krishi Mitra", "कृषी मित्राला विचारा"), icon: <MessagesSquare size={36} strokeWidth={1.75} />, tone: "bg-leaf-700 text-white", wide: true },
  ];

  return (
    <nav aria-label={l("Main options", "मुख्य पर्याय")} className="grid min-h-[calc(100dvh-7rem)] grid-cols-2 grid-rows-[auto_1fr_1fr_auto] gap-3">
      {tiles.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`relative flex items-center gap-3 rounded-3xl border border-line bg-white p-4 shadow-sm active:scale-[0.98] ${
            t.wide ? "col-span-2 flex-row justify-start px-5" : "flex-col justify-center text-center"
          }`}
        >
          <span className={`grid shrink-0 place-items-center rounded-full ${t.wide ? "size-16" : "size-20"} ${t.tone}`}>{t.icon}</span>
          <span className="text-xl font-bold leading-tight text-ink">{t.label}</span>
          {!!t.badge && (
            <span
              className="absolute right-3 top-3 grid min-w-8 place-items-center rounded-full bg-soil px-2 py-1 text-sm font-bold text-white"
              aria-label={t.badgeLabel}
            >
              {t.badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}

