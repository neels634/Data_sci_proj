"use client";

import { Flag } from "lucide-react";
import { useStore } from "@/lib/store";
import { Badge, Button, Card, Empty, PageHeader, statusTone } from "@/components/ui";

export default function AdminReports() {
  const { state, l, tx, lbl, date, resolveReport } = useStore();
  const sorted = [...state.reports].sort((a, b) => (a.status === b.status ? 0 : a.status === "Open" ? -1 : 1));
  return (
    <div>
      <PageHeader
        back="/admin"
        title={l("Reports", "तक्रारी")}
        sub={l("Incorrect information, suspicious buyers and disputes raised by users.", "वापरकर्त्यांनी कळवलेली चुकीची माहिती, संशयास्पद खरेदीदार व वाद.")}
      />
      {sorted.length === 0 ? (
        <Empty icon={<Flag size={32} />} title={l("No reports", "तक्रारी नाहीत")} body={l("Reports from users appear here.", "वापरकर्त्यांच्या तक्रारी इथे दिसतील.")} />
      ) : (
        <div className="space-y-2">
          {sorted.map((r) => (
            <Card key={r.id}>
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold leading-snug">{tx(r.about)}</p>
                <Badge tone={statusTone(r.status)}>{lbl(r.status)}</Badge>
              </div>
              <p className="text-sm text-muted">
                {tx(r.reason)} · {date(r.createdAt)}
              </p>
              {r.status === "Open" && (
                <Button variant="secondary" className="mt-2 min-h-10 text-sm" onClick={() => resolveReport(r.id)}>
                  {l("Mark resolved", "सोडवली म्हणून नोंदवा")}
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
