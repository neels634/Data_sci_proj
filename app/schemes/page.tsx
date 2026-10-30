"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookmark, ChevronRight, Search, SearchX } from "lucide-react";
import { matchSchemes, useStore } from "@/lib/store";
import type { SchemeCategory } from "@/lib/types";
import { Badge, Card, Empty, PageHeader, cx, inputCls, statusTone } from "@/components/ui";

const CATS: ("All" | SchemeCategory)[] = ["All", "Income support", "Crop insurance", "Credit", "Irrigation", "Women & SHG", "Food processing"];

export default function Schemes() {
  const { state, l, tx, lbl } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [view, setView] = useState<"all" | "forYou" | "saved">("all");

  const forYou = new Set(matchSchemes(state.schemes, state.profile).map((s) => s.id));
  const list = state.schemes
    .filter((s) => s.status !== "archived")
    .filter((s) => cat === "All" || s.category === cat)
    .filter((s) => view === "all" || (view === "forYou" ? forYou.has(s.id) : state.bookmarks.includes(s.id)))
    .filter((s) => {
      const k = q.trim().toLowerCase();
      return !k || [s.name.en, s.name.mr, s.summary.en, s.summary.mr, s.department.en, s.department.mr].some((f) => f.toLowerCase().includes(k));
    });

  return (
    <div>
      <PageHeader back="/home" title={l("Schemes", "योजना")} sub={l("Central and Maharashtra schemes, with the official source for each.", "केंद्र व महाराष्ट्र शासनाच्या योजना, प्रत्येकीच्या अधिकृत स्रोतासह.")} />
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input className={cx(inputCls, "pl-10")} placeholder={l("Search schemes", "योजना शोधा")} value={q} onChange={(e) => setQ(e.target.value)} aria-label={l("Search schemes", "योजना शोधा")} />
      </div>

      <div className="mt-3 grid grid-cols-3 rounded-xl bg-sand p-1" role="tablist">
        {(
          [
            ["all", l("All", "सर्व")],
            ["forYou", l("For you", "तुमच्यासाठी")],
            ["saved", `${l("Saved", "जतन")} (${state.bookmarks.length})`],
          ] as const
        ).map(([v, text]) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={cx("min-h-10 rounded-lg text-sm font-semibold", view === v ? "bg-white text-leaf-900 shadow-sm" : "text-muted")}
          >
            {text}
          </button>
        ))}
      </div>

      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cx("min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold", cat === c ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white text-ink")}
          >
            {lbl(c)}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {list.length === 0 ? (
          <Empty
            icon={<SearchX size={32} />}
            title={view === "saved" ? l("No saved schemes yet", "अजून एकही योजना जतन केलेली नाही") : l("No schemes match", "जुळणारी योजना नाही")}
            body={view === "saved" ? l("Tap the bookmark on a scheme to keep it here.", "योजना इथे ठेवण्यासाठी ‘जतन करा’ दाबा.") : l("Try another word or category.", "दुसरा शब्द किंवा प्रकार निवडून पहा.")}
          />
        ) : (
          list.map((s) => (
            <Link key={s.id} href={`/schemes/${s.id}`} className="block">
              <Card className="flex gap-3">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold leading-snug">{tx(s.name)}</p>
                    {state.bookmarks.includes(s.id) && <Bookmark size={18} className="shrink-0 fill-leaf-700 text-leaf-700" aria-label={l("Saved", "जतन")} />}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{tx(s.summary)}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge tone="green">{lbl(s.category)}</Badge>
                    <Badge>{lbl(s.level)}</Badge>
                    {s.lastVerified ? <Badge tone="green">{l("Verified", "पडताळलेली")}</Badge> : <Badge tone="gold">{l("Not yet verified", "पडताळणी बाकी")}</Badge>}
                    {s.status === "flagged" && <Badge tone="soil">{l("Under review", "तपासणी सुरू")}</Badge>}
                    {state.tracker[s.id] && <Badge tone={statusTone(state.tracker[s.id])}>{lbl(state.tracker[s.id])}</Badge>}
                  </div>
                </div>
                <ChevronRight className="self-center text-muted" />
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
