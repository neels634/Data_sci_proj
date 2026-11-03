"use client";

import Link from "next/link";
import { ChevronRight, Layers } from "lucide-react";
import { lotQuantity, useStore } from "@/lib/store";
import { Badge, Card, Empty, PageHeader, statusTone } from "@/components/ui";
import { CropAvatar, useMandiText } from "@/components/mandi";

export default function MitraLots() {
  const { state, l, lbl, num, date } = useStore();
  const t = useMandiText();
  return (
    <div>
      <PageHeader back="/mitra" title={l("My lots", "माझे लॉट")} sub={l("Pooled produce from several farmers, ready for buyers.", "अनेक शेतकऱ्यांचा एकत्र केलेला माल, खरेदीदारांसाठी तयार.")} />
      {state.lots.length === 0 ? (
        <Empty icon={<Layers size={32} />} title={l("No lots yet", "अजून लॉट नाहीत")} body={l("Pool farmer requests from the Home tab.", "मुख्यपृष्ठावरून शेतकऱ्यांच्या विनंत्या एकत्र करा.")} />
      ) : (
        <div className="space-y-2">
          {state.lots.map((lot) => {
            const offers = state.offers.filter((o) => o.lotId === lot.id && o.status === "Submitted").length;
            const n = lot.listingIds.length;
            return (
              <Link key={lot.id} href={`/mitra/lots/${lot.id}`} className="block">
                <Card className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="flex items-center gap-2 text-lg font-bold"><CropAvatar cropId={lot.crop} size="sm" /> {t.crop(lot.crop)} · {t.grade(lot.gradeCode)}</p>
                      <Badge tone={statusTone(lot.status)}>{lbl(lot.status)}</Badge>
                    </div>
                    <p className="text-sm text-muted">
                      {t.qty(lotQuantity(lot, state.listings), lot.unit)} · {l(`${n} farmer${n === 1 ? "" : "s"}`, `${num(n)} शेतकरी`)} · {l("created", "तयार")} {date(lot.createdAt)}
                    </p>
                    {offers > 0 && <p className="text-sm font-semibold text-soil">{l(`${offers} offer${offers > 1 ? "s" : ""} waiting for farmers`, `शेतकऱ्यांच्या निर्णयासाठी ${offers} ऑफर`)}</p>}
                  </div>
                  <ChevronRight className="text-muted" />
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
