"use client";

import { ExternalLink } from "lucide-react";
import { useStore } from "@/lib/store";
import { Badge, Button, Card, PageHeader } from "@/components/ui";

export default function AdminSchemes() {
  const { state, l, tx, lbl, date, verifyScheme, setSchemeStatus } = useStore();
  return (
    <div>
      <PageHeader
        back="/admin"
        title={l("Scheme directory", "योजना यादी")}
        sub={l("Only verify after checking the official source. Archived schemes are hidden from users.", "अधिकृत स्रोत तपासल्यानंतरच पडताळणी करा. संग्रहित योजना वापरकर्त्यांना दिसत नाहीत.")}
      />
      <div className="space-y-3">
        {state.schemes.map((s) => (
          <Card key={s.id} className={s.status === "archived" ? "opacity-70" : undefined}>
            <p className="font-bold leading-snug">{tx(s.name)}</p>
            <p className="text-sm text-muted">{tx(s.department)}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge>{lbl(s.level)}</Badge>
              {s.lastVerified ? (
                <Badge tone="green">
                  {l("Verified", "पडताळणी")} {date(s.lastVerified)}
                </Badge>
              ) : (
                <Badge tone="gold">{l("Not verified", "पडताळणी बाकी")}</Badge>
              )}
              {s.status !== "active" && <Badge tone="soil">{s.status === "flagged" ? l("Flagged", "चिन्हांकित") : l("Archived", "संग्रहित")}</Badge>}
            </div>
            <a href={s.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-leaf-700">
              {s.source} <ExternalLink size={14} />
            </a>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {s.status === "archived" ? (
                <Button variant="secondary" className="col-span-3 min-h-10 text-sm" onClick={() => setSchemeStatus(s.id, "active")}>
                  {l("Restore", "पुन्हा सुरू करा")}
                </Button>
              ) : (
                <>
                  <Button className="min-h-10 px-2 text-sm" onClick={() => verifyScheme(s.id)}>
                    {l("Verify", "पडताळा")}
                  </Button>
                  <Button variant="secondary" className="min-h-10 px-2 text-sm" onClick={() => setSchemeStatus(s.id, s.status === "flagged" ? "active" : "flagged")}>
                    {s.status === "flagged" ? l("Unflag", "चिन्ह काढा") : l("Flag", "चिन्हांकित करा")}
                  </Button>
                  <Button variant="danger" className="min-h-10 px-2 text-sm" onClick={() => setSchemeStatus(s.id, "archived")}>
                    {l("Archive", "संग्रहित करा")}
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
