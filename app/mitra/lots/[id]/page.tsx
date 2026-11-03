"use client";

import { useParams } from "next/navigation";
import { Layers, Truck } from "lucide-react";
import { buyerById, lotQuantity, useStore } from "@/lib/store";
import { MITRA_FEE_PER_QUINTAL, TRANSPORT_SHARE_PER_QUINTAL } from "@/lib/data";
import { Badge, Button, Card, Empty, Note, PageHeader, rupees, statusTone } from "@/components/ui";
import { useMandiText } from "@/components/mandi";
import { convert, toQuintals } from "@/lib/grades";
import { MARKETS } from "@/lib/mandi/markets";

export default function MitraLot() {
  const { id } = useParams<{ id: string }>();
  const { state, l, tx, lbl, num, date, advanceLot, toast, setLotTarget } = useStore();
  const t = useMandiText();
  const lot = state.lots.find((x) => x.id === id);
  if (!lot) return <Empty icon={<Layers size={32} />} title={l("Lot not found", "लॉट सापडला नाही")} body={l("Go back to your lots.", "तुमच्या लॉटकडे परत जा.")} />;

  const unit = t.unit(lot.unit, true);
  const members = state.listings.filter((x) => lot.listingIds.includes(x.id));
  const total = lotQuantity(lot, state.listings);
  const offers = state.offers.filter((o) => o.lotId === lot.id);
  const accepted = offers.find((o) => o.status === "Accepted");

  return (
    <div>
      <PageHeader back="/mitra/lots" title={`${t.crop(lot.crop)} · ${t.grade(lot.gradeCode)} · ${t.qty(total, lot.unit)}`} sub={`${tx(lot.village)} · ${l("ready", "तयार")} ${date(lot.availableFrom)}`} />
      <Badge tone={statusTone(lot.status)} className="text-sm">
        {lbl(lot.status)}
      </Badge>
      <label className="mt-3 flex items-center gap-2 text-[15px] font-semibold">
        📍 {l("Sell at", "विक्रीचा बाजार")}
        <select value={lot.targetMarketId ?? ""} onChange={(e) => setLotTarget(lot.id, e.target.value)} className="min-h-11 min-w-0 flex-1 rounded-xl border border-line bg-white px-2">
          <option value="">{l("Not decided", "ठरलेले नाही")}</option>
          {MARKETS.filter((m) => m.crops.includes(lot.crop)).map((m) => (
            <option key={m.id} value={m.id}>
              {tx(m.name)}
            </option>
          ))}
        </select>
      </label>

      <h2 className="mb-2 mt-5 text-lg font-bold">{l("Farmer-wise record", "शेतकरीनिहाय नोंद")}</h2>
      <Card className="p-0">
        <table className="w-full text-left text-[15px]">
          <thead className="border-b border-line text-sm text-muted">
            <tr>
              <th className="px-4 py-2 font-semibold">{l("Farmer", "शेतकरी")}</th>
              <th className="px-2 py-2 font-semibold">{l("Grade", "श्रेणी")}</th>
              <th className="px-4 py-2 text-right font-semibold">{unit}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {members.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-2.5">{tx(m.farmer)}</td>
                <td className="px-2 py-2.5">{t.listingGrade(m)}</td>
                <td className="px-4 py-2.5 text-right font-semibold">{num(convert(m.quantity, m.unit, lot.unit), { maximumFractionDigits: 2 })}</td>
              </tr>
            ))}
            <tr className="bg-leaf-50 font-bold">
              <td className="px-4 py-2.5" colSpan={2}>
                {l("Total", "एकूण")}
              </td>
              <td className="px-4 py-2.5 text-right">{num(total, { maximumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
      </Card>
      <Button variant="ghost" className="mt-1" onClick={() => toast({ en: "Weighing entry is coming soon", mr: "वजन नोंद लवकरच उपलब्ध होईल" })}>
        {l("Record weighing & deductions", "वजन व कपात नोंदवा")}
      </Button>

      <h2 className="mb-2 mt-5 text-lg font-bold">{l("Buyer offers", "खरेदीदारांच्या ऑफर")}</h2>
      {offers.length === 0 ? (
        <p className="text-sm text-muted">{l("No offers yet. The lot is visible to buyers in the app.", "अजून ऑफर नाही. हा लॉट ॲपमध्ये खरेदीदारांना दिसत आहे.")}</p>
      ) : (
        <div className="space-y-2">
          {offers.map((o) => {
            const b = buyerById(o.buyerId);
            return (
              <Card key={o.id}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold">{tx(b?.name)}</p>
                  <Badge tone={statusTone(o.status)}>{lbl(o.status)}</Badge>
                </div>
                <p className="text-xl font-bold text-leaf-900">
                  {t.money(o.pricePerUnit)}{" "}
                  <span className="text-sm font-semibold text-muted">
                    / {t.unit(o.unit, true)} · {t.qty(o.quantity, o.unit)}
                  </span>
                </p>
                <p className="text-sm text-muted">{tx(o.terms)}</p>
                {!b?.verified && (
                  <Badge tone="soil" className="mt-1">
                    {l("Buyer not verified", "खरेदीदार पडताळलेला नाही")}
                  </Badge>
                )}
              </Card>
            );
          })}
          {lot.status === "Open for offers" && (
            <Note>{l("Farmers accept or decline offers from their own phones, or you can help them do it in person.", "शेतकरी स्वतःच्या फोनवरून ऑफर स्वीकारतात किंवा नाकारतात; तुम्ही प्रत्यक्ष मदतही करू शकता.")}</Note>
          )}
        </div>
      )}

      {accepted && (
        <>
          <h2 className="mb-2 mt-5 text-lg font-bold">{l("Settlement summary (estimate)", "हिशोब सारांश (अंदाजे)")}</h2>
          <Card className="p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-muted">
                <tr>
                  <th className="px-3 py-2 font-semibold">{l("Farmer", "शेतकरी")}</th>
                  <th className="px-2 py-2 text-right font-semibold">{l("Gross", "एकूण")}</th>
                  <th className="px-2 py-2 text-right font-semibold">{l("Charges", "शुल्क")}</th>
                  <th className="px-3 py-2 text-right font-semibold">{l("Net", "निव्वळ")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {members.map((m) => {
                  const gross = convert(m.quantity, m.unit, accepted.unit) * accepted.pricePerUnit;
                  const charges = toQuintals(m.quantity, m.unit) * (MITRA_FEE_PER_QUINTAL + TRANSPORT_SHARE_PER_QUINTAL);
                  return (
                    <tr key={m.id}>
                      <td className="px-3 py-2">{tx(m.farmer)}</td>
                      <td className="px-2 py-2 text-right">{rupees(gross)}</td>
                      <td className="px-2 py-2 text-right text-soil">−{rupees(charges)}</td>
                      <td className="px-3 py-2 text-right font-bold">{rupees(gross - charges)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
          <p className="mt-1 text-xs text-muted">
            {l(
              "Final figures depend on weighed quantity and grade. Payments are made by the buyer; Shet Samruddhi does not hold money.",
              "अंतिम आकडे वजन व श्रेणीवर अवलंबून. पेमेंट खरेदीदार करतो; शेत समृद्धी पैसे स्वतःकडे ठेवत नाही.",
            )}
          </p>
        </>
      )}

      {(lot.status === "Offer accepted" || lot.status === "Dispatched") && (
        <Button full className="mt-5" onClick={() => advanceLot(lot.id)}>
          <Truck size={18} /> {lot.status === "Offer accepted" ? l("Mark as dispatched", "रवाना झाला म्हणून नोंदवा") : l("Mark as delivered & completed", "पोहोचला व पूर्ण झाला म्हणून नोंदवा")}
        </Button>
      )}
    </div>
  );
}
