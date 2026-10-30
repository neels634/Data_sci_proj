"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Camera } from "lucide-react";
import { useStore } from "@/lib/store";
import { keepText } from "@/lib/i18n";
import { CROPS, MITRA_FEE_PER_QUINTAL, TRANSPORT_SHARE_PER_QUINTAL } from "@/lib/data";
import type { Listing } from "@/lib/types";
import { Button, Field, Note, PageHeader, Term, cx, inputCls } from "@/components/ui";
import { Input } from "@/components/voice";

export default function NewListing() {
  const { state, l, tx, lbl, addListing, toast } = useStore();
  const router = useRouter();
  const [f, setF] = useState({
    crop: state.profile.crops[0] ?? "",
    quantity: "",
    grade: "Ungraded" as Listing["grade"],
    availableFrom: "",
    expectedPrice: "",
    village: tx(state.profile.village),
    wantsMitra: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    const qty = Number(f.quantity);
    if (!f.crop) er.crop = l("Choose a crop", "पीक निवडा");
    if (!f.quantity || !(qty > 0)) er.quantity = l("Enter quantity in quintals (more than 0)", "क्विंटलमध्ये प्रमाण लिहा (0 पेक्षा जास्त)");
    else if (qty > 1000) er.quantity = l("That looks too large — check the number", "हे खूप जास्त वाटते — आकडा तपासा");
    if (!f.availableFrom) er.availableFrom = l("Choose when the produce will be ready", "माल कधी तयार होईल ती तारीख निवडा");
    if (f.expectedPrice && !(Number(f.expectedPrice) > 0)) er.expectedPrice = l("Enter a price above 0, or leave it empty", "0 पेक्षा जास्त किंमत लिहा किंवा रिकामे ठेवा");
    setErrors(er);
    if (Object.keys(er).length) return;
    addListing({
      crop: f.crop,
      quantity: qty,
      grade: f.grade,
      village: keepText(f.village, state.profile.village),
      availableFrom: f.availableFrom,
      expectedPrice: f.expectedPrice ? Number(f.expectedPrice) : null,
      wantsMitra: f.wantsMitra,
    });
    router.push("/sell");
  };

  return (
    <form onSubmit={submit} noValidate>
      <PageHeader back="/sell" title={l("New listing", "नवीन नोंद")} sub={l("Takes about a minute. Your Mitra can also fill this for you.", "साधारण एक मिनिट लागतो. तुमचा मित्रही हे भरून देऊ शकतो.")} />
      <div className="space-y-4">
        <fieldset>
          <legend className="mb-2 text-[15px] font-semibold">{l("Crop", "पीक")}</legend>
          <div className="flex flex-wrap gap-2">
            {CROPS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setF({ ...f, crop: c })}
                aria-pressed={f.crop === c}
                className={cx("min-h-11 rounded-full border px-4 font-semibold", f.crop === c ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white")}
              >
                {lbl(c)}
              </button>
            ))}
          </div>
          {errors.crop && <p className="mt-1 text-sm font-semibold text-soil">{errors.crop}</p>}
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <Field label={l("Quantity (quintal)", "प्रमाण (क्विंटल)")} error={errors.quantity} hint={l("1 quintal = 100 kg", "1 क्विंटल = 100 किलो")}>
            <Input inputMode="decimal" className={inputCls} value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} placeholder={l("e.g. 10", "उदा. 10")} />
          </Field>
          <Field label={l("Grade", "श्रेणी")}>
            <select className={inputCls} value={f.grade} onChange={(e) => setF({ ...f, grade: e.target.value as Listing["grade"] })}>
              <option value="Ungraded">{l("Not sure", "माहीत नाही")}</option>
              <option value="A">{l("A — best", "अ — उत्तम")}</option>
              <option value="B">{l("B — medium", "ब — मध्यम")}</option>
              <option value="C">{l("C — lower", "क — कमी")}</option>
            </select>
          </Field>
        </div>
        <p className="-mt-2 text-sm text-muted">
          <Term
            word={l("Grade", "श्रेणी")}
            meaning={l("Quality class based on size, colour and damage.", "आकार, रंग व खराबीवरून ठरणारा मालाचा दर्जा.")}
          />{" "}
          {l("is checked again by your Mitra at weighing.", "वजनाच्या वेळी तुमचा मित्र पुन्हा तपासतो.")}
        </p>

        <Field label={l("Ready from", "कधीपासून तयार")} error={errors.availableFrom}>
          <input type="date" className={inputCls} value={f.availableFrom} onChange={(e) => setF({ ...f, availableFrom: e.target.value })} />
        </Field>

        <Field
          label={l("Expected price per quintal (optional)", "प्रति क्विंटल अपेक्षित किंमत (ऐच्छिक)")}
          error={errors.expectedPrice}
          hint={l("Only a guide for buyers — not a fixed price.", "खरेदीदारांसाठी फक्त अंदाज — ठरलेली किंमत नाही.")}
        >
          <Input inputMode="numeric" className={inputCls} value={f.expectedPrice} onChange={(e) => setF({ ...f, expectedPrice: e.target.value })} placeholder="₹" />
        </Field>

        <Field label={l("Pickup village", "माल उचलण्याचे गाव")}>
          <Input className={inputCls} value={f.village} onChange={(e) => setF({ ...f, village: e.target.value })} />
        </Field>

        <button
          type="button"
          onClick={() => toast({ en: "Photo upload is coming soon", mr: "फोटो अपलोड लवकरच उपलब्ध होईल" })}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-white text-muted"
        >
          <Camera size={18} /> {l("Add photo (optional)", "फोटो जोडा (ऐच्छिक)")}
        </button>

        <label className="flex items-start gap-3 rounded-xl border border-line bg-white p-3">
          <input type="checkbox" className="mt-0.5 size-5 accent-leaf-700" checked={f.wantsMitra} onChange={(e) => setF({ ...f, wantsMitra: e.target.checked })} />
          <span>
            <span className="block font-semibold">{l("Ask my Mandi Mitra to help sell this", "विक्रीसाठी माझ्या मंडी मित्राची मदत घ्या")}</span>
            <span className="block text-sm text-muted">
              {l(
                "The Mitra may pool it with neighbours’ produce to get better buyers and shared transport.",
                "चांगले खरेदीदार व एकत्रित वाहतुकीसाठी मित्र तो शेजाऱ्यांच्या मालासोबत एकत्र करू शकतो.",
              )}
            </span>
          </span>
        </label>

        <Note tone="green">
          {l(
            `Mitra charges: ₹${MITRA_FEE_PER_QUINTAL} per quintal service fee + about ₹${TRANSPORT_SHARE_PER_QUINTAL} per quintal shared transport. You will see the exact amount before you accept any offer.`,
            `मित्राचे शुल्क: प्रति क्विंटल ₹${MITRA_FEE_PER_QUINTAL} सेवा शुल्क + साधारण ₹${TRANSPORT_SHARE_PER_QUINTAL} वाहतूक वाटा. कोणतीही ऑफर स्वीकारण्यापूर्वी नेमकी रक्कम तुम्हाला दिसेल.`,
          )}
        </Note>

        <Button full type="submit">
          {f.wantsMitra ? l("Send to my Mitra", "माझ्या मित्राला पाठवा") : l("Publish listing", "नोंद प्रसिद्ध करा")}
        </Button>
      </div>
    </form>
  );
}
