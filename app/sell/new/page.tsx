"use client";

/**
 * Sell wizard: crop → type → grades and quantity (several grades, one quantity each) → dry? →
 * best market (top 3 by estimated net after transport and charges, plus a split plan when it earns
 * clearly more) → what next: Mandi Mitra's help (one listing per grade, checked by the Mitra) or
 * "I'll sell myself" (a saved plan with map links, no listing). "Don't know" is always allowed.
 */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { ArrowLeft, Check, Map as MapIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { convert, gradingFor, UNSURE, VARIES_NOTE, type Unit } from "@/lib/grades";
import { recommend, type Plan, type PlanItem } from "@/lib/mandi/profit";
import { usePrices } from "@/lib/mandi/use-prices";
import { todayISO } from "@/lib/lifecycle";
import type { Listing } from "@/lib/types";
import { SpeakButton } from "@/components/speech";
import { BigChoice, GradeCard, QuantityStepper, StepDots, StickyAction, UnsureCard, cardCls, useMandiText } from "@/components/mandi";
import { CropPicker, EstimateNote, LocationPrompt, PlanCard, SplitPlanCard, VehicleSelector, useFarmPlace } from "@/components/mandi/rates";
import { cx } from "@/components/ui";

type Step = "crop" | "type" | "grades" | "dry" | "best" | "next";

export default function SellWizardPage() {
  return (
    <Suspense>
      <SellWizard />
    </Suspense>
  );
}

function SellWizard() {
  const { state, l, tx, num, addListing, saveSellPlan, setVehicle } = useStore();
  const t = useMandiText();
  const router = useRouter();
  const params = useSearchParams();
  const preset = gradingFor(params.get("crop") ?? "") ? (params.get("crop") as string) : "";
  const [step, setStep] = useState<Step>(preset ? (gradingFor(preset)?.typeOptions ? "type" : "grades") : "crop");
  const [crop, setCrop] = useState(preset);
  const [typeCode, setTypeCode] = useState<string | undefined>();
  /** grade → quantity in `unit` */
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [dryness, setDryness] = useState<Listing["dryness"]>();
  const [unit, setUnit] = useState<Unit>(gradingFor(preset)?.saleUnit ?? "quintal");
  const [planKey, setPlanKey] = useState<string | null>(null);
  const [done, setDone] = useState<null | "mitra" | "self">(null);
  const prices = usePrices(crop || undefined);
  const { place } = useFarmPlace();

  const g = gradingFor(crop);
  const flow: Step[] = ["crop", ...(g?.typeOptions ? (["type"] as const) : []), "grades", ...(g?.needsDryness ? (["dry"] as const) : []), "best", "next"];
  const names: Record<Step, string> = {
    crop: l("Crop", "पीक"),
    type: l("Type", "प्रकार"),
    grades: l("Grade & qty", "प्रत व वजन"),
    dry: l("Dry?", "वाळलेला?"),
    best: l("Best market", "सर्वोत्तम बाजार"),
    next: l("Next", "पुढे काय?"),
  };
  const at = flow.indexOf(step);
  const go = (s: Step) => {
    setStep(s);
    window.scrollTo(0, 0);
  };
  const back = () => (at === 0 ? router.push("/sell") : go(flow[at - 1]));

  const type = typeCode === UNSURE ? undefined : typeCode;
  const chosen = Object.entries(picks).filter(([, q]) => q > 0);
  const items: PlanItem[] = chosen.map(([gradeCode, q]) => ({ gradeCode, qtyQtl: convert(q, unit, "quintal") }));
  const totalQtl = items.reduce((a, x) => a + x.qtyQtl, 0);

  const rec = useMemo(
    () => (place && items.length && !prices.loading ? recommend({ cropId: crop, typeCode: type, items, from: place, rows: prices.rows, mitraRates: state.mitraRates, today: todayISO(), vehicle: state.myVehicle }) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [place?.lat, place?.lng, JSON.stringify(items), prices.rows, prices.loading, state.mitraRates, state.myVehicle, crop, type],
  );
  const plans: { key: string; plan: Plan }[] = rec ? [...rec.top.map((p) => ({ key: `single:${p.legs[0].market.id}`, plan: p })), ...(rec.split ? [{ key: "split", plan: rec.split }] : [])] : [];
  const selected = plans.find((p) => p.key === planKey) ?? plans.find((p) => p.key === "split") ?? plans[0];

  const pickCrop = (id: string) => {
    if (id !== crop) {
      setTypeCode(undefined);
      setPicks({});
      setDryness(undefined);
      setPlanKey(null);
    }
    setCrop(id);
    setUnit(gradingFor(id)?.saleUnit ?? "quintal");
  };
  const toggleGrade = (code: string) =>
    setPicks((p) => {
      if (code in p) return Object.fromEntries(Object.entries(p).filter(([k]) => k !== code));
      // "don't know" is one row on its own; picking a grade removes it
      if (code === UNSURE) return { [UNSURE]: 0 };
      return { ...Object.fromEntries(Object.entries(p).filter(([k]) => k !== UNSURE)), [code]: 0 };
    });

  const marketFor = (gradeCode: string) => selected?.plan.legs.find((leg) => leg.items.some((i) => i.gradeCode === gradeCode));

  const askMitra = () => {
    for (const [gradeCode, q] of chosen) {
      const leg = marketFor(gradeCode);
      const it = leg?.items.find((i) => i.gradeCode === gradeCode);
      addListing({
        crop,
        typeCode: type,
        gradeCode,
        dryness: g?.needsDryness ? (dryness ?? "unsure") : undefined,
        quantity: q,
        unit,
        preferredMarketId: leg?.market.id,
        planSnapshot: leg && it && selected ? { marketId: leg.market.id, ratePerQtl: it.perQtl, rateSource: it.source, estNet: selected.plan.net, date: it.date } : undefined,
      });
    }
    setDone("mitra");
    setTimeout(() => router.push("/sell/my"), 1800);
  };
  const sellMyself = () => {
    if (selected) {
      const v = selected.plan.legs[0];
      saveSellPlan({
        cropId: crop,
        typeCode: type,
        items: items.map((it) => ({ ...it, marketId: marketFor(it.gradeCode)!.market.id })),
        vehicleId: v.vehicle.id,
        perKm: v.perKm,
        estNet: selected.plan.net,
      });
    }
    setDone("self");
    window.scrollTo(0, 0);
  };

  const question: Record<Step, string> = {
    crop: l("Which crop do you want to sell?", "कोणते पीक विकायचे आहे?"),
    type: l("Which type is it?", "कोणता प्रकार आहे?"),
    grades: l("Which grades, and how much of each?", "कोणती प्रत आणि किती माल?"),
    dry: l("Is the crop fully dry?", "माल पूर्ण वाळला आहे का?"),
    best: l("Best market for you", "तुमच्यासाठी सर्वोत्तम बाजार"),
    next: l("What next?", "पुढे काय?"),
  };

  // read-aloud for a plan
  const planSpeech = (p: Plan) => {
    const leg = p.legs[0];
    return l(
      `Taking everything to ${tx(leg.market.name)} would give about ${p.net} rupees net. Distance about ${leg.distanceKm} km, vehicle hire ${p.transport} rupees.`,
      `${tx(leg.market.name)}ला सर्व माल नेल्यास अंदाजे निव्वळ ${p.net} रुपये मिळतील. अंतर सुमारे ${leg.distanceKm} किलोमीटर, गाडी भाडे ${p.transport} रुपये.`,
    );
  };
  const splitSpeech = (p: Plan, gain: number) =>
    l(
      `${p.legs.map((leg) => `${leg.items.map((i) => t.grade(i.gradeCode)).join(", ")} to ${tx(leg.market.name)}`).join(" and ")} would give ${gain} rupees more.`,
      `${p.legs.map((leg) => `${leg.items.map((i) => t.grade(i.gradeCode)).join(", ")} ${tx(leg.market.name)}ला`).join(" आणि ")} नेल्यास ${gain} रुपये जास्त मिळतील.`,
    );

  if (done === "mitra")
    return (
      <div className="grid min-h-[60vh] place-items-center text-center" role="status">
        <div>
          <span className="mx-auto grid size-24 place-items-center rounded-full bg-leaf-700 text-white mm-pop">
            <Check size={52} strokeWidth={3} />
          </span>
          <p className="mt-4 text-2xl font-bold">{l("Your crop is listed for sale.", "तुमचा माल विक्रीसाठी नोंदवला.")}</p>
          <p className="mt-1 text-[17px] text-muted">{l("Your Mitra will contact you soon.", "मित्र लवकरच संपर्क करतील.")}</p>
        </div>
      </div>
    );

  if (done === "self" && selected)
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h1 className="flex-1 text-[23px] font-bold">{l("My plan", "माझे नियोजन")}</h1>
          <SpeakButton id="self-plan" text={selected.plan.kind === "split" ? splitSpeech(selected.plan, rec?.top[0] ? selected.plan.net - rec.top[0].net : 0) : planSpeech(selected.plan)} />
        </div>
        {selected.plan.legs.map((leg) => (
          <div key={leg.market.id} className={cx(cardCls, "p-4")}>
            <p className="text-xl font-bold">{tx(leg.market.name)}</p>
            <p className="text-sm text-muted">{l(`about ${leg.distanceKm} km`, `सुमारे ${num(leg.distanceKm)} किमी`)}</p>
            {leg.items.map((it) => (
              <p key={it.gradeCode} className="mt-1 text-[16px]">
                {t.grade(it.gradeCode)} · {num(it.qtyQtl, { maximumFractionDigits: 2 })} {t.unit("quintal", true)}
              </p>
            ))}
            <p className="mt-1 font-bold text-leaf-900">
              {l("Net", "निव्वळ")} ₹{num(leg.net)} <span className="text-xs text-muted">({l("estimate", "अंदाजे")})</span>
            </p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${leg.market.lat},${leg.market.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl border border-leaf-700/40 font-bold text-leaf-700"
            >
              <MapIcon size={18} /> 📍 {l("See the road", "रस्ता पहा")}
            </a>
          </div>
        ))}
        <p className="rounded-xl bg-gold-100 p-3 text-[15px] font-semibold text-[#6b4708]">💡 {l("Keep each grade separate — mixed loads get the lower rate.", "प्रत वेगवेगळी ठेवा — मिसळलेल्या मालाला कमी दर मिळतो.")}</p>
        <EstimateNote />
        <StickyAction onClick={() => router.push("/sell")}>{l("Done", "झाले")}</StickyAction>
      </div>
    );

  // "example calculation" only when no rate at all is live, last available or a Mitra's
  const allSample = plans.length > 0 && plans.every((p) => p.plan.legs.every((leg) => leg.items.every((i) => i.source === "sample")));
  const unsure = UNSURE in picks;
  const best = rec?.top[0];

  return (
    <div className="pb-2">
      <div className="mb-3 flex items-center gap-2">
        <button type="button" onClick={back} aria-label={l("Back", "मागे")} className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-leaf-700 active:scale-95">
          <ArrowLeft size={22} />
        </button>
        <div className="min-w-0 flex-1">
          <StepDots steps={flow.map((s) => names[s])} current={at} />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <h1 className="flex-1 text-[23px] font-bold leading-tight">{step === "best" && allSample ? `${question.best} · ${l("example calculation", "उदाहरण गणना")}` : question[step]}</h1>
        <SpeakButton id={`sell-${step}`} text={question[step]} />
      </div>

      <div key={step} className="mm-step">
        {step === "crop" && <CropPicker value={crop} onPick={pickCrop} label={question.crop} />}

        {step === "type" && g?.typeOptions && (
          <div className="space-y-3" role="radiogroup" aria-label={question.type}>
            {g.typeOptions.map((o) => (
              <BigChoice key={o.code} icon={g.emoji} title={tx(o.name)} selected={typeCode === o.code} onClick={() => setTypeCode(o.code)} />
            ))}
            <BigChoice icon="🤷" title={l("Don't know", "माहीत नाही")} selected={typeCode === UNSURE} onClick={() => setTypeCode(UNSURE)} dashed />
          </div>
        )}

        {step === "grades" && g && (
          <div className="space-y-3">
            <p className="rounded-2xl bg-gold-100 p-3 text-[15px] font-semibold text-[#6b4708]">
              💡 {l("Tap each grade you have and set its quantity. Sorting grades gets a better price.", "तुमच्याकडील प्रत्येक प्रत निवडा आणि वजन टाका. प्रत वेगळी केल्यास जास्त दर मिळतो.")}
            </p>
            {crop === "onion" && (
              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-sand p-1" role="radiogroup" aria-label={l("Unit", "एकक")}>
                {(["10kg", "quintal"] as const).map((u) => (
                  <button key={u} type="button" role="radio" aria-checked={unit === u} onClick={() => setUnit(u)} className={cx("min-h-12 rounded-xl text-[17px] font-bold", unit === u ? "bg-white text-leaf-900 shadow" : "text-muted")}>
                    {t.unit(u)}
                  </button>
                ))}
              </div>
            )}
            {[...g.grades]
              .sort((a, b) => a.rank - b.rank)
              .map((x) => (
                <div key={x.code}>
                  <GradeCard grade={x} emoji={g.emoji} best={x.rank === 1} selected={x.code in picks} onSelect={() => toggleGrade(x.code)} />
                  {x.code in picks && (
                    <div className="mm-step mt-2">
                      <QuantityStepper value={picks[x.code]} onChange={(n) => setPicks((p) => ({ ...p, [x.code]: n }))} unit={unit} />
                    </div>
                  )}
                </div>
              ))}
            <UnsureCard selected={unsure} onSelect={() => toggleGrade(UNSURE)} title={l("Don't know — the Mitra will decide", "माहीत नाही — मित्र ठरवतील")} />
            {unsure && (
              <div className="mm-step">
                <QuantityStepper value={picks[UNSURE]} onChange={(n) => setPicks({ [UNSURE]: n })} unit={unit} />
              </div>
            )}
            <p className="text-sm text-muted">
              {tx(VARIES_NOTE)}
              {g.notes.en !== VARIES_NOTE.en && ` ${tx(g.notes)}`}
            </p>
          </div>
        )}

        {step === "dry" && (
          <div className="space-y-3" role="radiogroup" aria-label={question.dry}>
            <BigChoice icon="☀️" title={l("Yes, it's dry", "हो, वाळला")} selected={dryness === "dry"} onClick={() => setDryness("dry")} />
            <BigChoice icon="💧" tone="sky" title={l("A bit damp", "थोडा ओला")} selected={dryness === "damp"} onClick={() => setDryness("damp")} />
            <BigChoice icon="🤷" title={l("Don't know", "माहीत नाही")} selected={dryness === "unsure"} onClick={() => setDryness("unsure")} dashed />
            {dryness === "damp" && (
              <p className="mm-step rounded-2xl bg-sky-50 p-3 text-[15px] font-semibold text-sky-900">☀️ {l("Dry it in the sun for 2–3 days for a better rate", "२–३ दिवस उन्हात वाळवा, चांगला दर मिळेल")}</p>
            )}
            <p className="text-sm text-muted">{l("You can skip this. Your Mitra will check.", "हे वगळू शकता. मित्र तपासतील.")}</p>
          </div>
        )}

        {step === "best" && (
          <div className="space-y-3">
            {!place ? (
              <LocationPrompt />
            ) : prices.loading ? (
              [0, 1, 2].map((i) => <div key={i} className={cx(cardCls, "h-32 animate-pulse bg-sand")} />)
            ) : (
              <>
                <VehicleSelector loadQtl={totalQtl} value={state.myVehicle} onChange={setVehicle} />
                {rec?.smallLoad && (
                  <p className="rounded-xl bg-gold-100 p-3 text-[15px] font-semibold text-[#6b4708]">
                    🚜 {l("For a small load, a nearby market or pooling with your Mandi Mitra pays better.", "कमी मालासाठी जवळचा बाजार किंवा मंडी मित्र फायदेशीर.")}
                  </p>
                )}
                {plans.length === 0 ? (
                  <p className={cx(cardCls, "p-4 text-[16px]")}>{l("No market with rates for this crop near you. Your Mandi Mitra can help.", "तुमच्या जवळ या पिकाचे दर असलेला बाजार नाही. मंडी मित्र मदत करतील.")}</p>
                ) : (
                  <div className="space-y-4" role="radiogroup" aria-label={question.best}>
                    {rec!.split && best && <SplitPlanCard plan={rec!.split} gain={rec!.split.net - best.net} selected={selected?.key === "split"} onSelect={() => setPlanKey("split")} speech={splitSpeech(rec!.split, rec!.split.net - best.net)} />}
                    {rec!.top.map((p, i) => (
                      <PlanCard
                        key={p.legs[0].market.id}
                        plan={p}
                        rank={i + 1}
                        selected={selected?.key === `single:${p.legs[0].market.id}`}
                        onSelect={() => setPlanKey(`single:${p.legs[0].market.id}`)}
                        speech={planSpeech(p)}
                        unsureNote={unsure}
                      />
                    ))}
                  </div>
                )}
                <EstimateNote />
              </>
            )}
          </div>
        )}

        {step === "next" && (
          <div className="space-y-3" role="radiogroup" aria-label={question.next}>
            <button type="button" onClick={askMitra} className="flex min-h-20 w-full items-center gap-3 rounded-2xl bg-leaf-700 p-4 text-left text-white shadow-lg active:scale-[0.98]">
              <span className="text-3xl" aria-hidden="true">
                🤝
              </span>
              <span>
                <span className="block text-xl font-bold">{l("Take Mandi Mitra's help", "मंडी मित्राची मदत घ्या")}</span>
                <span className="block text-sm text-white/85">{l("The Mitra checks your crop and pools it with neighbours'.", "मित्र माल तपासून शेजाऱ्यांच्या मालासोबत लॉट करतील.")}</span>
              </span>
            </button>
            <button type="button" onClick={sellMyself} disabled={!selected} className="flex min-h-20 w-full items-center gap-3 rounded-2xl border-2 border-line bg-white p-4 text-left active:scale-[0.98] disabled:opacity-50">
              <span className="text-3xl" aria-hidden="true">
                🚜
              </span>
              <span>
                <span className="block text-xl font-bold">{l("I'll sell myself", "मी स्वतः विकेन")}</span>
                <span className="block text-sm text-muted">{l("Save this plan with the road to each market.", "प्रत्येक बाजाराच्या रस्त्यासह हे नियोजन जतन करा.")}</span>
              </span>
            </button>
            <SpeakButton id="sell-next-choices" text={`${l("Take Mandi Mitra's help", "मंडी मित्राची मदत घ्या")}. ${l("Or: I'll sell myself", "किंवा: मी स्वतः विकेन")}.`} />
          </div>
        )}
      </div>

      {step === "grades" ? (
        <div className="sticky bottom-20 z-20 mt-4 rounded-2xl bg-leaf-900 p-3 text-white shadow-lg">
          <p className="text-[16px]">
            {l("Total", "एकूण")}: <b>{t.qty(chosen.reduce((a, [, q]) => a + q, 0), unit)}</b> · {l(`${chosen.length} grade${chosen.length === 1 ? "" : "s"}`, `${num(chosen.length)} प्रती`)}
          </p>
          <button
            type="button"
            disabled={chosen.length === 0}
            onClick={() => go(flow[at + 1])}
            className="mt-2 flex min-h-14 w-full items-center justify-center rounded-2xl bg-white text-lg font-bold text-leaf-900 active:scale-95 disabled:opacity-50"
          >
            {l("Next", "पुढे")}
          </button>
        </div>
      ) : step !== "next" ? (
        <StickyAction onClick={() => go(flow[at + 1])} disabled={(step === "crop" && !crop) || (step === "type" && !typeCode) || (step === "best" && !place)}>
          {step === "dry" && !dryness ? l("Skip", "वगळा") : l("Next", "पुढे")}
        </StickyAction>
      ) : null}
    </div>
  );
}
