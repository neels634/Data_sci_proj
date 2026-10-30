"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { useStore } from "@/lib/store";
import { CURRENT_BUYER_ID } from "@/lib/data";
import { Badge, Card, Empty, PageHeader, rupees, statusTone } from "@/components/ui";

export default function BuyerOffers() {
  const { state, l, lbl, date } = useStore();
  const mine = state.offers.filter((o) => o.buyerId === CURRENT_BUYER_ID);
  const qtl = l("qtl", "क्विंटल");
  return (
    <div>
      <PageHeader back="/buyer" title={l("My offers", "माझ्या ऑफर")} sub={l("Track offers you sent to village lots.", "गावातील लॉटना पाठवलेल्या ऑफरची स्थिती पाहा.")} />
      {mine.length === 0 ? (
        <Empty icon={<FileText size={32} />} title={l("No offers yet", "अजून ऑफर नाही")} body={l("Open a lot to send your first offer.", "पहिली ऑफर पाठवण्यासाठी एखादा लॉट उघडा.")} />
      ) : (
        <div className="space-y-2">
          {mine.map((o) => {
            const lot = state.lots.find((x) => x.id === o.lotId);
            return (
              <Link key={o.id} href={`/buyer/lots/${o.lotId}`} className="block">
                <Card>
                  <div className="flex items-center justify-between">
                    <p className="font-bold">
                      {lot && lbl(lot.crop)} {l("lot", "लॉट")}
                    </p>
                    <Badge tone={statusTone(o.status)}>{lbl(o.status)}</Badge>
                  </div>
                  <p className="text-[15px]">
                    {rupees(o.pricePerQuintal)}/{qtl} · {o.quantity} {qtl}
                  </p>
                  <p className="text-sm text-muted">
                    {l("Sent", "पाठवली")} {date(o.createdAt)} · {l("lot status", "लॉटची स्थिती")}: {lot && lbl(lot.status)}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
