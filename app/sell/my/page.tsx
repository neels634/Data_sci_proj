"use client";

/** My listings, by step: all · being checked · ready · in a lot. */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Listing } from "@/lib/types";
import { SpeakButton } from "@/components/speech";
import { EmptyState, ListingCard } from "@/components/mandi";
import { cx } from "@/components/ui";

const TABS = ["all", "check", "ready", "lot"] as const;
type Tab = (typeof TABS)[number];
const inTab: Record<Tab, (x: Listing) => boolean> = {
  all: (x) => x.status !== "cancelled",
  check: (x) => x.status === "waiting_check" || x.status === "needs_drying" || x.status === "low_grade",
  ready: (x) => x.status === "ready",
  lot: (x) => x.status === "pooled",
};

export default function MyListingsPage() {
  return (
    <Suspense>
      <MyListings />
    </Suspense>
  );
}

function MyListings() {
  const { state, l, num, isMine } = useStore();
  const params = useSearchParams();
  const tab = (TABS as readonly string[]).includes(params.get("tab") ?? "") ? (params.get("tab") as Tab) : "all";
  const mine = state.listings.filter(isMine).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const shown = mine.filter(inTab[tab]);
  const names: Record<Tab, string> = { all: l("All", "सर्व"), check: l("Checking", "तपासणी"), ready: l("Ready", "तयार"), lot: l("In lot", "लॉटमध्ये") };
  const title = l("My crop for sale", "माझा माल");

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Link href="/sell" aria-label={l("Back", "मागे")} className="grid size-12 place-items-center rounded-full bg-white text-leaf-700">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="flex-1 text-[23px] font-bold">{title}</h1>
        <SpeakButton id="my-listings" text={`${title}. ${names[tab]}: ${num(shown.length)}`} />
      </div>

      <div className="mb-4 grid grid-cols-4 gap-1 rounded-2xl bg-sand p-1" role="tablist">
        {TABS.map((t) => (
          <Link
            key={t}
            href={t === "all" ? "/sell/my" : `/sell/my?tab=${t}`}
            role="tab"
            aria-selected={tab === t}
            replace
            className={cx("flex min-h-12 flex-col items-center justify-center rounded-xl px-1 text-center text-sm font-bold leading-tight", tab === t ? "bg-white text-leaf-900 shadow" : "text-muted")}
          >
            {names[t]}
            <span className="text-xs font-semibold">{num(mine.filter(inTab[t]).length)}</span>
          </Link>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState
          title={l("Nothing here yet", "इथे अजून काही नाही")}
          action={
            <Link href="/sell/new" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-leaf-700 px-4 font-bold text-white">
              <Plus size={18} /> {l("I want to sell", "माल विकायचा आहे")}
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {shown.map((x) => (
            <ListingCard key={x.id} listing={x} />
          ))}
        </div>
      )}
    </div>
  );
}
