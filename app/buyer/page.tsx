"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, PackageSearch, Users } from "lucide-react";
import { buyerById, lotQuantity, useStore } from "@/lib/store";
import { CROPS, CURRENT_BUYER_ID } from "@/lib/data";
import { Badge, Button, Card, Empty, Note, PageHeader, inputCls } from "@/components/ui";

export default function BuyerBrowse() {
  const { state, account, l, tx, lbl, date, toast } = useStore();
  const me = buyerById(CURRENT_BUYER_ID)!;
  const [crop, setCrop] = useState("All");
  const [minQty, setMinQty] = useState("");
  const qtl = l("qtl", "क्विंटल");

  const lots = state.lots
    .filter((x) => x.status === "Open for offers")
    .map((x) => ({ lot: x, qty: lotQuantity(x, state.listings) }))
    .filter(({ lot, qty }) => (crop === "All" || lot.crop === crop) && qty >= (Number(minQty) || 0));
  const direct = state.listings
    .filter((x) => !x.lotId && x.status === "Submitted")
    .filter((x) => (crop === "All" || x.crop === crop) && x.quantity >= (Number(minQty) || 0));

  return (
    <div>
      <PageHeader
        title={l("Village produce", "गावातील माल")}
        sub={(() => {
          const biz = account?.businessName || tx(me.name);
          const type = lbl(account?.businessType || me.type);
          return l(`Signed in as ${biz} (${type})`, `${biz} (${type}) म्हणून लॉग इन`);
        })()}
      />
      <Note>{l("Your business is not yet verified. Farmers will see a “not verified” label on your offers.", "तुमच्या व्यवसायाची अजून पडताळणी झालेली नाही. शेतकऱ्यांना तुमच्या ऑफरवर ‘पडताळलेला नाही’ असे दिसेल.")}</Note>

      <div className="mt-4 grid grid-cols-[1fr_8rem] gap-2">
        <select className={inputCls} value={crop} onChange={(e) => setCrop(e.target.value)} aria-label={l("Crop", "पीक")}>
          <option value="All">{l("All crops", "सर्व पिके")}</option>
          {CROPS.map((c) => (
            <option key={c} value={c}>
              {lbl(c)}
            </option>
          ))}
        </select>
        <input className={inputCls} inputMode="numeric" placeholder={l("Min qtl", "किमान क्विं.")} value={minQty} onChange={(e) => setMinQty(e.target.value)} aria-label={l("Minimum quantity", "किमान प्रमाण")} />
      </div>

      <h2 className="mb-2 mt-5 flex items-center gap-2 text-lg font-bold">
        <Users size={18} /> {l("Pooled lots", "एकत्रित लॉट")}
      </h2>
      {lots.length === 0 ? (
        <Empty icon={<PackageSearch size={32} />} title={l("No lots match", "जुळणारे लॉट नाहीत")} body={l("Change the filters or check back later.", "फिल्टर बदला किंवा नंतर पुन्हा पाहा.")} />
      ) : (
        <div className="space-y-2">
          {lots.map(({ lot, qty }) => {
            const mineOffer = state.offers.find((o) => o.lotId === lot.id && o.buyerId === CURRENT_BUYER_ID);
            const n = lot.listingIds.length;
            return (
              <Link key={lot.id} href={`/buyer/lots/${lot.id}`} className="block">
                <Card className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-lg font-bold">{lbl(lot.crop)}</p>
                      <p className="text-lg font-bold text-leaf-900">
                        {qty} {qtl}
                      </p>
                    </div>
                    <p className="text-sm text-muted">
                      {l(`${n} farmer${n === 1 ? "" : "s"}`, `${n} शेतकरी`)} · {l("grade", "श्रेणी")} {lot.grades.map(lbl).join("/")} · {tx(lot.village)} · {l("from", "पासून")}{" "}
                      {date(lot.availableFrom)}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <Badge tone="green">
                        {l("Mitra", "मित्र")}: {tx(lot.mitra)}
                      </Badge>
                      {mineOffer && (
                        <Badge tone="gold">
                          {l("Your offer", "तुमची ऑफर")}: {lbl(mineOffer.status)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="text-muted" />
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <h2 className="mb-2 mt-6 text-lg font-bold">{l("Single-farmer listings", "एका शेतकऱ्याच्या नोंदी")}</h2>
      {direct.length === 0 ? (
        <p className="text-sm text-muted">{l("None right now.", "सध्या एकही नाही.")}</p>
      ) : (
        <div className="space-y-2">
          {direct.map((x) => (
            <Card key={x.id}>
              <div className="flex items-center justify-between">
                <p className="font-bold">{lbl(x.crop)}</p>
                <p className="font-bold text-leaf-900">
                  {x.quantity} {qtl}
                </p>
              </div>
              <p className="text-sm text-muted">
                {l("Grade", "श्रेणी")} {lbl(x.grade)} · {tx(x.village)} · {l("from", "पासून")} {date(x.availableFrom)}
              </p>
              <Button
                variant="secondary"
                className="mt-2 min-h-10 w-full"
                onClick={() => toast({ en: "Callback request sent to the village Mandi Mitra", mr: "गावातील मंडी मित्राला परत फोन करण्याची विनंती पाठवली" })}
              >
                {l("Request callback via Mitra", "मित्रामार्फत संपर्काची विनंती करा")}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
