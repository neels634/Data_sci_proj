"use client";

/** One listing: its status and Mitra check, and — once pooled — the lot and buyer offers to decide on. */
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Flag, PackageOpen, Users } from "lucide-react";
import { buyerById, lotQuantity, useStore } from "@/lib/store";
import { bi } from "@/lib/i18n";
import { convert } from "@/lib/grades";
import { MITRA_FEE_PER_QUINTAL, TRANSPORT_SHARE_PER_QUINTAL } from "@/lib/data";
import { statusLine } from "@/lib/status-ui";
import { SpeakButton } from "@/components/speech";
import { CropAvatar, EmptyState, MitraResultCard, StatusPill, cardCls, useMandiText } from "@/components/mandi";
import { Badge, Button, Note, cx, statusTone } from "@/components/ui";

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { state, l, tx, lbl, num, date, respondToOffer, addReport } = useStore();
  const t = useMandiText();
  const x = state.listings.find((y) => y.id === id);
  if (!x) return <EmptyState title={l("Listing not found", "नोंद सापडली नाही")} action={<PackageOpen className="text-muted" />} />;

  const lot = x.lotId ? state.lots.find((y) => y.id === x.lotId) : undefined;
  const offers = lot ? state.offers.filter((o) => o.lotId === lot.id) : [];
  const qtl = convert(x.quantity, x.unit, "quintal");
  const fee = qtl * MITRA_FEE_PER_QUINTAL;
  const transport = qtl * TRANSPORT_SHARE_PER_QUINTAL;
  const others = lot ? lot.listingIds.length - 1 : 0;
  const title = `${t.crop(x.crop)} · ${t.listingGrade(x)}`;
  const line = tx(statusLine(x.status, x.gradeCode));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Link href="/sell/my" aria-label={l("Back", "मागे")} className="grid size-12 place-items-center rounded-full bg-white text-leaf-700">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-[22px] font-bold">{title}</h1>
        <SpeakButton id={`detail-${x.id}`} text={`${title}. ${t.qty(x.quantity, x.unit)}. ${line}`} />
      </div>

      <div className={cx(cardCls, "flex items-center gap-3 p-4")}>
        <CropAvatar cropId={x.crop} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-bold text-leaf-900">{t.qty(x.quantity, x.unit)}</p>
          <p className="text-sm text-muted">
            {date(x.createdAt)} · {tx(x.village)}
          </p>
        </div>
        <StatusPill status={x.status} />
      </div>
      <p className="text-[17px] font-semibold">{line}</p>
      {x.notes && <p className="text-sm text-muted">{x.notes}</p>}

      {x.gradeConfirmedByMitra && !lot && x.status !== "cancelled" && x.status !== "waiting_check" && <MitraResultCard listing={x} />}

      {lot && (
        <div className="rounded-2xl bg-indigo-50 p-4">
          <p className="flex items-center gap-2 font-bold text-indigo-900">
            <Users size={18} /> {l(`Lot by ${tx(lot.mitra)}`, `${tx(lot.mitra)} यांचा लॉट`)} · {lbl(lot.status)}
          </p>
          <p className="mt-1 text-[15px]">
            {l(
              `Your crop is pooled with ${others} other farmer${others === 1 ? "" : "s"} of the same grade — ${t.qty(lotQuantity(lot, state.listings), lot.unit)} in all.`,
              `तुमचा माल त्याच प्रतीच्या इतर ${num(others)} शेतकऱ्यांसोबत एकत्र केला आहे — एकूण ${t.qty(lotQuantity(lot, state.listings), lot.unit)}.`,
            )}
          </p>
        </div>
      )}

      {offers.length > 0 && lot && (
        <section>
          <h2 className="mb-2 mt-3 text-xl font-bold">{l("Buyer offers", "खरेदीदारांच्या ऑफर")}</h2>
          <div className="space-y-3">
            {offers.map((o) => {
              const b = buyerById(o.buyerId);
              const gross = o.pricePerUnit * convert(x.quantity, x.unit, o.unit);
              const net = gross - fee - transport;
              const per = t.unit(o.unit, true);
              return (
                <div key={o.id} className={cx(cardCls, "p-4", o.status === "Declined" && "opacity-60")}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold">{tx(b?.name)}</p>
                      <p className="text-sm text-muted">
                        {b && lbl(b.type)} · {tx(b?.location)}
                      </p>
                    </div>
                    <Badge tone={statusTone(o.status)}>{lbl(o.status)}</Badge>
                  </div>
                  {!b?.verified && (
                    <Badge tone="soil" className="mt-2">
                      {l("Buyer not verified", "खरेदीदार पडताळलेला नाही")}
                    </Badge>
                  )}
                  <p className="mt-2 text-3xl font-bold text-leaf-900">
                    {t.money(o.pricePerUnit)}
                    <span className="text-base font-semibold text-muted"> / {per}</span>
                  </p>
                  <div className="mt-3 rounded-xl bg-cream p-3 text-[15px]">
                    <p className="mb-1 font-semibold">{l(`For your ${t.qty(x.quantity, x.unit)}`, `तुमच्या ${t.qty(x.quantity, x.unit)} साठी`)}</p>
                    <dl className="grid grid-cols-[1fr_auto] gap-y-1">
                      <dt>{l("Price × quantity", "किंमत × प्रमाण")}</dt>
                      <dd className="text-right">{t.money(gross)}</dd>
                      <dt>{l("Mitra service fee", "मित्र सेवा शुल्क")}</dt>
                      <dd className="text-right text-soil">− {t.money(fee)}</dd>
                      <dt>{l("Shared transport", "वाहतूक वाटा")}</dt>
                      <dd className="text-right text-soil">− {t.money(transport)}</dd>
                      <dt className="border-t border-line pt-1 font-bold">{l("You receive (estimate)", "तुम्हाला मिळेल (अंदाजे)")}</dt>
                      <dd className="border-t border-line pt-1 text-right font-bold text-leaf-900">{t.money(net)}</dd>
                    </dl>
                  </div>
                  {o.status === "Submitted" && lot.status === "Open for offers" && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button variant="danger" onClick={() => respondToOffer(o.id, false)}>
                        {l("Decline", "नाकारा")}
                      </Button>
                      <Button onClick={() => respondToOffer(o.id, true)}>{l("Accept", "स्वीकारा")}</Button>
                    </div>
                  )}
                  <button
                    onClick={() => addReport(bi(`Buyer: ${b?.name.en}`, `खरेदीदार: ${b?.name.mr}`), bi("Reported from an offer", "ऑफरमधून तक्रार"))}
                    className="mt-2 flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted"
                  >
                    <Flag size={14} /> {l("Report this buyer", "या खरेदीदाराची तक्रार करा")}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-2">
            <Note>{l("An offer is not a sale until weighing and payment are done. Only you decide.", "वजन व पेमेंट होईपर्यंत ऑफर म्हणजे विक्री नाही. निर्णय फक्त तुमचा.")}</Note>
          </div>
        </section>
      )}
    </div>
  );
}
