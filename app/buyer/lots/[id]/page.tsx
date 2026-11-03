"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Layers } from "lucide-react";
import { lotQuantity, useStore } from "@/lib/store";
import { bi } from "@/lib/i18n";
import { CURRENT_BUYER_ID } from "@/lib/data";
import { Badge, Button, Card, Empty, Field, Note, PageHeader, cx, inputCls, rupees, statusTone } from "@/components/ui";
import { Input, TextArea } from "@/components/voice";
import { useMandiText } from "@/components/mandi";

const DEFAULT_TERMS = bi("Pickup at village collection point; payment within 3 days of weighing", "गावातील संकलन केंद्रावरून उचल; वजनानंतर 3 दिवसांत पेमेंट");

export default function BuyerLot() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { state, l, tx, lbl, date, submitOffer } = useStore();
  const t = useMandiText();
  const lot = state.lots.find((x) => x.id === id);
  const total = lot ? lotQuantity(lot, state.listings) : 0;
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState(String(total || ""));
  const [terms, setTerms] = useState<string | null>(null); // null = default terms in the current language
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!lot) return <Empty icon={<Layers size={32} />} title={l("Lot not found", "लॉट सापडला नाही")} body={l("It may have been sold.", "तो विकला गेला असू शकतो.")} />;
  const per = t.unit(lot.unit, true);
  const members = state.listings.filter((x) => lot.listingIds.includes(x.id));
  const myOffers = state.offers.filter((o) => o.lotId === lot.id && o.buyerId === CURRENT_BUYER_ID);
  const expected = members.map((m) => m.expectedPrice).filter((x): x is number => !!x);
  const shownTerms = terms ?? tx(DEFAULT_TERMS);

  const submit = () => {
    const er: Record<string, string> = {};
    if (!(Number(price) > 0)) er.price = l(`Enter a price per ${per}`, `प्रति ${per} किंमत लिहा`);
    if (!(Number(qty) > 0)) er.qty = l("Enter quantity", "प्रमाण लिहा");
    else if (Number(qty) > total) er.qty = l(`The lot has ${t.qty(total, lot.unit)}`, `लॉटमध्ये ${t.qty(total, lot.unit)} आहे`);
    if (shownTerms.trim().length < 5) er.terms = l("Describe pickup and payment terms", "माल उचलणे व पेमेंटच्या अटी लिहा");
    setErrors(er);
    if (Object.keys(er).length) return;
    submitOffer({ lotId: lot.id, pricePerUnit: Number(price), quantity: Number(qty), terms: terms === null ? DEFAULT_TERMS : terms.trim() });
    router.push("/buyer/offers");
  };

  return (
    <div>
      <PageHeader
        back="/buyer"
        title={`${t.crop(lot.crop)} · ${t.grade(lot.gradeCode)} · ${t.qty(total, lot.unit)}`}
        sub={`${tx(lot.village)} · ${l("ready", "तयार")} ${date(lot.availableFrom)} · ${l("Mitra", "मित्र")} ${tx(lot.mitra)}`}
      />
      <Card>
        <p className="font-bold">{l("Lot details", "लॉटचा तपशील")}</p>
        <ul className="mt-2 divide-y divide-line text-[15px]">
          {members.map((m, i) => (
            <li key={m.id} className="flex justify-between py-1.5">
              <span>
                {l("Farmer", "शेतकरी")} {i + 1}
              </span>
              <span>
                {t.qty(m.quantity, m.unit)} · {t.listingGrade(m)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted">{l("Farmer names and numbers are shared only after an offer is accepted.", "ऑफर स्वीकारल्यानंतरच शेतकऱ्यांची नावे व नंबर दिले जातात.")}</p>
        {expected.length > 0 && (
          <p className="mt-2 text-sm">
            {l("Farmers’ indicative expectation", "शेतकऱ्यांची अंदाजे अपेक्षा")}: {rupees(Math.min(...expected))}–{rupees(Math.max(...expected))} / {l("qtl", "क्विंटल")}
          </p>
        )}
      </Card>

      {myOffers.length > 0 && (
        <Card className="mt-3">
          <p className="font-bold">{l("Your offers on this lot", "या लॉटवरील तुमच्या ऑफर")}</p>
          {myOffers.map((o) => (
            <div key={o.id} className="mt-1 flex items-center justify-between">
              <span>
                {t.money(o.pricePerUnit)}/{t.unit(o.unit, true)} · {t.qty(o.quantity, o.unit)}
              </span>
              <Badge tone={statusTone(o.status)}>{lbl(o.status)}</Badge>
            </div>
          ))}
        </Card>
      )}

      {lot.status === "Open for offers" ? (
        <Card className="mt-3 space-y-3">
          <p className="font-bold">{l("Make an offer", "ऑफर द्या")}</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label={l(`Price / ${per} (₹)`, `किंमत / ${per} (₹)`)} error={errors.price}>
              <Input inputMode="numeric" className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} />
            </Field>
            <Field label={l(`Quantity (${per})`, `प्रमाण (${per})`)} error={errors.qty}>
              <Input inputMode="numeric" className={inputCls} value={qty} onChange={(e) => setQty(e.target.value)} />
            </Field>
          </div>
          <Field label={l("Pickup & payment terms", "माल उचलणे व पेमेंट अटी")} error={errors.terms}>
            <TextArea className={cx(inputCls, "min-h-20 py-2")} value={shownTerms} onChange={(e) => setTerms(e.target.value)} />
          </Field>
          <Note>
            {l(
              "Your offer is shown to farmers as a buyer-submitted price. It becomes a sale only when farmers accept and weighing is done.",
              "तुमची ऑफर शेतकऱ्यांना ‘खरेदीदाराने सुचवलेली किंमत’ म्हणून दिसते. शेतकऱ्यांनी स्वीकारल्यावर व वजन झाल्यावरच विक्री पक्की होते.",
            )}
          </Note>
          <Button full onClick={submit}>
            {l("Send offer", "ऑफर पाठवा")}
          </Button>
        </Card>
      ) : (
        <div className="mt-3">
          <Note>{l("This lot is no longer open for offers.", "हा लॉट आता ऑफरसाठी खुला नाही.")}</Note>
        </div>
      )}
    </div>
  );
}
