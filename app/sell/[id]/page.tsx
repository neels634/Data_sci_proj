"use client";

import { useParams } from "next/navigation";
import { Check, Flag, PackageOpen, Users } from "lucide-react";
import { buyerById, lotQuantity, useStore } from "@/lib/store";
import { bi } from "@/lib/i18n";
import { MITRA_FEE_PER_QUINTAL, TRANSPORT_SHARE_PER_QUINTAL } from "@/lib/data";
import type { ListingStatus } from "@/lib/types";
import { Badge, Button, Card, Empty, Note, PageHeader, cx, rupees, statusTone } from "@/components/ui";

const FLOW: ListingStatus[] = ["Submitted", "In lot", "Offer received", "Accepted", "Dispatched", "Completed"];

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { state, l, tx, lbl, date, respondToOffer, cancelListing, addReport } = useStore();
  const x = state.listings.find((y) => y.id === id);
  if (!x) return <Empty icon={<PackageOpen size={32} />} title={l("Listing not found", "नोंद सापडली नाही")} body={l("It may have been removed.", "ती काढून टाकली असू शकते.")} />;

  const qtl = l("qtl", "क्विंटल");
  const lot = x.lotId ? state.lots.find((y) => y.id === x.lotId) : undefined;
  const offers = lot ? state.offers.filter((o) => o.lotId === lot.id) : [];
  const stepIndex = FLOW.indexOf(x.status === "With Mitra" ? "Submitted" : x.status);
  const fee = x.quantity * MITRA_FEE_PER_QUINTAL;
  const transport = x.quantity * TRANSPORT_SHARE_PER_QUINTAL;
  const others = lot ? lot.listingIds.length - 1 : 0;

  return (
    <div>
      <PageHeader
        back="/sell"
        title={`${lbl(x.crop)} · ${x.quantity} ${qtl}`}
        sub={`${l("Grade", "श्रेणी")} ${lbl(x.grade)} · ${l("ready from", "तयार")} ${date(x.availableFrom)} · ${tx(x.village)}`}
      />
      <Badge tone={statusTone(x.status)} className="text-sm">
        {lbl(x.status)}
      </Badge>

      {x.status !== "Cancelled" && (
        <Card className="mt-4">
          <p className="mb-3 font-bold">{l("Progress", "प्रगती")}</p>
          <ol>
            {FLOW.map((step, i) => {
              const done = i <= stepIndex;
              return (
                <li key={step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={cx("grid size-6 place-items-center rounded-full text-white", done ? "bg-leaf-700" : "bg-line")}>{done && <Check size={14} />}</span>
                    {i < FLOW.length - 1 && <span className={cx("h-5 w-0.5", i < stepIndex ? "bg-leaf-700" : "bg-line")} />}
                  </div>
                  <span className={cx("text-[15px]", done ? "font-semibold text-ink" : "text-muted")}>
                    {step === "Submitted" ? (x.wantsMitra ? l("Sent to Mitra", "मित्राकडे पाठवले") : l("Listed", "नोंदवले")) : lbl(step)}
                  </span>
                </li>
              );
            })}
          </ol>
        </Card>
      )}

      {lot && (
        <Card className="mt-3 bg-leaf-50">
          <p className="flex items-center gap-2 font-bold text-leaf-900">
            <Users size={18} /> {l(`Pooled lot by ${tx(lot.mitra)}`, `${tx(lot.mitra)} यांचा एकत्रित लॉट`)}
          </p>
          <p className="mt-1 text-[15px]">
            {l(
              `Your ${x.quantity} qtl is combined with ${others} other farmer${others === 1 ? "" : "s"} — ${lotQuantity(lot, state.listings)} qtl total. Bigger lots attract more buyers and share transport cost.`,
              `तुमचा ${x.quantity} क्विंटल माल इतर ${others} शेतकऱ्यांच्या मालासोबत एकत्र केला आहे — एकूण ${lotQuantity(lot, state.listings)} क्विंटल. मोठ्या लॉटला जास्त खरेदीदार मिळतात व वाहतूक खर्च वाटला जातो.`,
            )}
          </p>
        </Card>
      )}

      {offers.length > 0 && (
        <>
          <h2 className="mb-2 mt-6 text-lg font-bold">{l("Buyer offers", "खरेदीदारांच्या ऑफर")}</h2>
          <div className="space-y-3">
            {offers.map((o) => {
              const b = buyerById(o.buyerId);
              const gross = o.pricePerQuintal * x.quantity;
              const net = gross - fee - transport;
              return (
                <Card key={o.id} className={cx(o.status === "Declined" && "opacity-60")}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold">{tx(b?.name)}</p>
                      <p className="text-sm text-muted">
                        {b && lbl(b.type)} · {tx(b?.location)}
                      </p>
                    </div>
                    <Badge tone={statusTone(o.status)}>{lbl(o.status)}</Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge tone="gold">{l("Buyer-submitted price", "खरेदीदाराने सुचवलेली किंमत")}</Badge>
                    {!b?.verified && <Badge tone="soil">{l("Buyer not verified", "खरेदीदार पडताळलेला नाही")}</Badge>}
                  </div>
                  <p className="mt-3 text-3xl font-bold text-leaf-900">
                    {rupees(o.pricePerQuintal)}
                    <span className="text-base font-semibold text-muted"> / {l("quintal", "क्विंटल")}</span>
                  </p>
                  <p className="text-sm text-muted">
                    {l(`For ${o.quantity} qtl of the lot`, `लॉटमधील ${o.quantity} क्विंटलसाठी`)} · {tx(o.terms)}
                  </p>

                  <div className="mt-3 rounded-xl bg-cream p-3 text-[15px]">
                    <p className="mb-1 font-semibold">{l(`For your ${x.quantity} qtl`, `तुमच्या ${x.quantity} क्विंटलसाठी`)}</p>
                    <dl className="grid grid-cols-[1fr_auto] gap-y-1">
                      <dt>{l("Price × quantity", "किंमत × प्रमाण")}</dt>
                      <dd className="text-right">{rupees(gross)}</dd>
                      <dt>{l(`Mitra service fee (₹${MITRA_FEE_PER_QUINTAL}/qtl)`, `मित्र सेवा शुल्क (₹${MITRA_FEE_PER_QUINTAL}/क्विं.)`)}</dt>
                      <dd className="text-right text-soil">− {rupees(fee)}</dd>
                      <dt>{l(`Shared transport (₹${TRANSPORT_SHARE_PER_QUINTAL}/qtl)`, `वाहतूक वाटा (₹${TRANSPORT_SHARE_PER_QUINTAL}/क्विं.)`)}</dt>
                      <dd className="text-right text-soil">− {rupees(transport)}</dd>
                      <dt className="border-t border-line pt-1 font-bold">{l("You receive (estimate)", "तुम्हाला मिळेल (अंदाजे)")}</dt>
                      <dd className="border-t border-line pt-1 text-right font-bold text-leaf-900">{rupees(net)}</dd>
                    </dl>
                    <p className="mt-2 text-xs text-muted">
                      {l("Final amount depends on weight and grade at weighing. No other charges.", "अंतिम रक्कम वजन व श्रेणीनुसार ठरेल. इतर कोणतेही शुल्क नाही.")}
                    </p>
                  </div>

                  {o.status === "Submitted" && lot?.status === "Open for offers" && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button variant="danger" onClick={() => respondToOffer(o.id, false)}>
                        {l("Decline", "नाकारा")}
                      </Button>
                      <Button onClick={() => respondToOffer(o.id, true)}>{l("Accept", "स्वीकारा")}</Button>
                    </div>
                  )}
                  <button
                    onClick={() => addReport(bi(`Buyer: ${b?.name.en}`, `खरेदीदार: ${b?.name.mr}`), bi("Reported from an offer", "ऑफरमधून तक्रार"))}
                    className="mt-2 flex min-h-10 items-center gap-1.5 text-sm font-semibold text-muted"
                  >
                    <Flag size={14} /> {l("Report this buyer", "या खरेदीदाराची तक्रार करा")}
                  </button>
                </Card>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-muted">
            {l("An offer is not a confirmed sale until weighing and payment are complete.", "वजन व पेमेंट पूर्ण होईपर्यंत ऑफर म्हणजे पक्की विक्री नाही.")}
          </p>
        </>
      )}

      {!lot && x.status !== "Cancelled" && (
        <div className="mt-4">
          <Note tone="green">
            {x.wantsMitra
              ? l("Your Mitra has your listing and will add it to a lot with nearby farmers.", "तुमची नोंद मित्राकडे आहे; तो ती जवळच्या शेतकऱ्यांसोबत लॉटमध्ये जोडेल.")
              : l("Your listing is visible to buyers. You can still ask your Mitra for help.", "तुमची नोंद खरेदीदारांना दिसत आहे. तुम्ही अजूनही मित्राची मदत घेऊ शकता.")}
          </Note>
        </div>
      )}

      {["Submitted", "With Mitra"].includes(x.status) && (
        <Button variant="danger" full className="mt-6" onClick={() => cancelListing(x.id)}>
          {l("Cancel listing", "नोंद रद्द करा")}
        </Button>
      )}
    </div>
  );
}
