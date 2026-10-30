"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Badge, Card, PageHeader, SectionTitle, statusTone } from "@/components/ui";

export default function Activity() {
  const { state, l, tx, lbl, date } = useStore();
  const tracked = Object.entries(state.tracker);

  return (
    <div>
      <PageHeader back="/home" title={l("My activity", "माझे काम")} />

      <SectionTitle>{l("Scheme applications", "योजना अर्ज")}</SectionTitle>
      {tracked.length === 0 ? (
        <p className="text-sm text-muted">{l("Use “Track my application” on a scheme to follow it here.", "योजनेवरील ‘माझ्या अर्जाची स्थिती’ वापरून ती इथे पाहा.")}</p>
      ) : (
        <div className="space-y-2">
          {tracked.map(([id, status]) => {
            const s = state.schemes.find((x) => x.id === id);
            return (
              <Link key={id} href={`/schemes/${id}`} className="block">
                <Card className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{tx(s?.name)}</span>
                  <Badge tone={statusTone(status)}>{lbl(status)}</Badge>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <SectionTitle>{l("Recent activity", "अलीकडील काम")}</SectionTitle>
      <Card>
        <ul className="divide-y divide-line">
          {state.activity.slice(0, 10).map((a) => (
            <li key={a.id} className="flex justify-between gap-3 py-2 text-[15px]">
              <span>{tx(a.text)}</span>
              <span className="shrink-0 text-sm text-muted">{date(a.at)}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Link href="/profile" className="mt-6 flex min-h-12 items-center justify-center rounded-xl border border-line bg-white font-semibold text-leaf-700">
        {l("View my profile", "माझे प्रोफाइल पाहा")}
      </Link>
    </div>
  );
}
