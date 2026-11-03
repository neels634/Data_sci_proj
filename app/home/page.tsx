"use client";

import Link from "next/link";
import Image from "next/image";
import { MessagesSquare } from "lucide-react";
import { useStore } from "@/lib/store";
import { useCrops } from "@/lib/crops/load";
import { todayISO, todayTasks } from "@/lib/lifecycle";

/** Farmer home: main options, including Crop Check and the Krishi Mitra farming assistant. */
export default function FarmerHome() {
  const { state, l, isMine } = useStore();
  // a small count on Mandi Mitra when buyers have sent offers, so they aren't missed
  const offers = state.listings.filter((x) => isMine(x) && x.status === "Offer received").length;
  // My Farm: tasks due today (and overdue ones) across the farmer's crops
  const farmLib = useCrops(state.myFarmCrops.map((c) => c.cropId));
  const farmTasks = todayTasks(state.myFarmCrops, farmLib.get, state.myTaskStates, todayISO()).length;

  const isDark = state.theme === "dark";

  const tiles = [
    {
      href: "/crop-check",
      label: l("Crop Check", "पीक तपासणी"),
      icon: <Image src="/icons/art_crop_check.png" alt={l("Crop Check", "पीक तपासणी")} width={44} height={44} className="object-contain" />,
      bg: isDark ? "#13261c" : "#E5F5ED",
      border: isDark ? "#1e442f" : "#c4e8d5",
      iconBg: isDark ? "#1b3829" : "#CFF0DF",
      wide: true,
    },
    {
      href: "/schemes",
      label: l("Schemes", "योजना"),
      icon: <Image src="/icons/art_scheme.png" alt={l("Schemes", "योजना")} width={44} height={44} className="object-contain" />,
      bg: isDark ? "#142230" : "#EAF3FA",
      border: isDark ? "#203d57" : "#c7def0",
      iconBg: isDark ? "#1b344a" : "#D5E8F7",
    },
    {
      href: "/mandi",
      label: l("Mandi Mitra", "मंडी मित्र"),
      icon: <Image src="/icons/art_mandi.png" alt={l("Mandi Mitra", "मंडी मित्र")} width={44} height={44} className="object-contain" />,
      bg: isDark ? "#281e10" : "#FFF4DC",
      border: isDark ? "#473618" : "#f5e0b3",
      iconBg: isDark ? "#3b2e15" : "#FCE8B2",
      badge: offers,
      badgeLabel: l(`${offers} new offers`, `${offers} नवीन ऑफर`),
    },
    {
      href: "/business",
      label: l("Business", "व्यवसाय"),
      icon: <Image src="/icons/art_business.png" alt={l("Business", "व्यवसाय")} width={44} height={44} className="object-contain" />,
      bg: isDark ? "#1d1b2d" : "#EEF0FA",
      border: isDark ? "#383359" : "#d4dbf2",
      iconBg: isDark ? "#2b2744" : "#DDE2F5",
    },
    {
      href: "/crops",
      label: l("My Farm", "माझी शेती"),
      icon: <Image src="/icons/art_my_farm.png" alt={l("My Farm", "माझी शेती")} width={44} height={44} className="object-contain" />,
      bg: isDark ? "#152615" : "#EAF5E8",
      border: isDark ? "#274727" : "#cde5c8",
      iconBg: isDark ? "#1f381f" : "#D5EBD0",
      badge: farmTasks,
      badgeLabel: l(`${farmTasks} farm tasks today`, `आज शेतीची ${farmTasks} कामे`),
    },
    {
      href: "/ask",
      label: l("Ask Krishi Mitra", "कृषी मित्राला विचारा"),
      icon: <MessagesSquare size={34} strokeWidth={2} className="text-white" />,
      bg: isDark ? "#16241c" : "#F2F7F4",
      border: isDark ? "#22382c" : "#d0e2d7",
      iconBg: "#205744",
      wide: true,
    },
  ];

  return (
    <nav aria-label={l("Main options", "मुख्य पर्याय")} className="grid min-h-[calc(100dvh-7rem)] grid-cols-2 grid-rows-[auto_1fr_1fr_auto] gap-3">
      {tiles.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          style={{ backgroundColor: t.bg, borderColor: t.border }}
          className={`relative flex items-center gap-3 rounded-3xl border p-4 shadow-xs transition active:scale-[0.98] ${
            t.wide ? "col-span-2 flex-row justify-start px-5" : "flex-col justify-center text-center"
          }`}
        >
          <span
            style={{ backgroundColor: t.iconBg }}
            className={`grid shrink-0 place-items-center rounded-full ${t.wide ? "size-16" : "size-20"}`}
          >
            {t.icon}
          </span>
          <span className="text-xl font-bold leading-tight text-ink">{t.label}</span>
          {!!t.badge && (
            <span
              className="absolute right-3 top-3 grid min-w-8 place-items-center rounded-full bg-soil px-2 py-1 text-xs font-bold text-white shadow-xs"
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

