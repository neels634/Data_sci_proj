"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { lotQuantity, useStore } from "@/lib/store";
import type { ListingStatus } from "@/lib/types";
import { Card, Note, PageHeader, SectionTitle } from "@/components/ui";

const STATUSES: ListingStatus[] = ["With Mitra", "Submitted", "In lot", "Offer received", "Accepted", "Dispatched", "Completed", "Cancelled"];

export default function AdminOverview() {
  const { state: s, l, lbl } = useStore();
  const verified = s.schemes.filter((x) => x.lastVerified && x.status === "active").length;
  const live = s.schemes.filter((x) => x.status !== "archived");
  const unverified = live.filter((x) => !x.lastVerified).length;
  const openReports = s.reports.filter((r) => r.status === "Open").length;
  const accepted = s.offers.filter((o) => o.status === "Accepted").length;
  const withOffer = s.listings.filter((x) => x.lotId && s.offers.some((o) => o.lotId === x.lotId)).length;
  const aggregated = s.lots.reduce((a, x) => a + lotQuantity(x, s.listings), 0);

  const kpis: [string, string | number, string][] = [
    [l("Produce listings", "मालाच्या नोंदी"), s.listings.length, l("farmer-entered", "शेतकऱ्यांनी नोंदवलेल्या")],
    [l("Listings with a buyer offer", "ऑफर मिळालेल्या नोंदी"), `${s.listings.length ? Math.round((withOffer / s.listings.length) * 100) : 0}%`, l("meaningful response", "खरेदीदारांचा प्रतिसाद")],
    [l("Buyer offers", "खरेदीदारांच्या ऑफर"), s.offers.length, l(`${accepted} accepted`, `${accepted} स्वीकारल्या`)],
    [l("Qtl in pooled lots", "लॉटमधील क्विंटल"), aggregated, l(`${s.lots.length} lots`, `${s.lots.length} लॉट`)],
    [l("Schemes verified", "पडताळलेल्या योजना"), `${verified}/${live.length}`, l("with source date", "स्रोत व तारखेसह")],
    [l("Enterprise profiles", "उद्योग प्रोफाइल"), s.enterprises.length, l(`${s.enquiries.length} buyer enquiries`, `${s.enquiries.length} चौकशा`)],
  ];
  const counts = STATUSES.map((st) => [st, s.listings.filter((x) => x.status === st).length] as const).filter(([, n]) => n > 0);
  const max = Math.max(1, ...counts.map(([, n]) => n));

  return (
    <div>
      <PageHeader title={l("Pilot overview", "प्रकल्प आढावा")} sub={l("Platform activity in the pilot village.", "प्रकल्प गावातील ॲपचा वापर.")} />
      <Note>
        {l(
          "These are usage counts, not proof of impact. Impact needs a baseline and measurement over the pilot.",
          "हे वापराचे आकडे आहेत, परिणामाचा पुरावा नाहीत. परिणाम मोजण्यासाठी सुरुवातीची स्थिती व प्रकल्पकाळातील मोजमाप आवश्यक आहे.",
        )}
      </Note>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {kpis.map(([k, v, sub]) => (
          <Card key={k} className="p-3">
            <p className="text-2xl font-bold text-leaf-900">{v}</p>
            <p className="text-sm font-semibold leading-tight">{k}</p>
            <p className="text-xs text-muted">{sub}</p>
          </Card>
        ))}
      </div>

      <SectionTitle>{l("Listings by status", "स्थितीनुसार नोंदी")}</SectionTitle>
      <Card className="space-y-2">
        {counts.map(([st, n]) => (
          <div key={st} className="grid grid-cols-[7.5rem_1fr_1.5rem] items-center gap-2 text-sm">
            <span className="text-muted">{lbl(st)}</span>
            <span className="h-3 rounded-full bg-sand">
              <span className="block h-3 rounded-full bg-leaf-600" style={{ width: `${(n / max) * 100}%` }} />
            </span>
            <span className="text-right font-semibold">{n}</span>
          </div>
        ))}
      </Card>

      <SectionTitle>{l("Needs attention", "लक्ष देण्याजोगे")}</SectionTitle>
      <div className="space-y-2">
        <Link href="/admin/schemes" className="block">
          <Card className="flex items-center justify-between">
            <span>
              <span className="font-bold">{l("Schemes not yet verified", "पडताळणी बाकी असलेल्या योजना")}</span>
              <span className="block text-sm text-muted">{l(`${unverified} need checking against official sources`, `${unverified} योजना अधिकृत स्रोतांशी तपासायच्या आहेत`)}</span>
            </span>
            <ChevronRight className="text-muted" />
          </Card>
        </Link>
        <Link href="/admin/reports" className="block">
          <Card className="flex items-center justify-between">
            <span>
              <span className="font-bold">{l("Open reports", "प्रलंबित तक्रारी")}</span>
              <span className="block text-sm text-muted">{l(`${openReports} from users`, `वापरकर्त्यांकडून ${openReports}`)}</span>
            </span>
            <ChevronRight className="text-muted" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
