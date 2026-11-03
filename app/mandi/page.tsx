"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, Check, ClipboardList, Info, Pencil, Truck, TriangleAlert, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { bi } from "@/lib/i18n";
import { UNSURE } from "@/lib/grades";
import {
  CROP_OPTIONS,
  GRADE_OPTIONS,
  TOWN_OPTIONS,
  confidenceOf,
  parseSpoken,
  quoteAll,
  timingFor,
  townName,
  type Confidence,
  type CropId,
  type Grade,
  type Input as MarketInput,
  type TownId,
} from "@/lib/market";
import Chips from "@/components/Chips";
import { Badge, Button, Card, Field, LinkButton, PageHeader, SectionTitle, cx, inputCls, rupees, type Tone } from "@/components/ui";
import { Input, TextArea } from "@/components/voice";

const CONFIDENCE: Record<Confidence, { tone: Tone; en: string; mr: string }> = {
  high: { tone: "green", en: "High confidence", mr: "जास्त खात्री" },
  medium: { tone: "gold", en: "Medium confidence", mr: "मध्यम खात्री" },
  low: { tone: "soil", en: "Close call: check before you go", mr: "फरक कमी: जाण्यापूर्वी तपासा" },
};

export default function MandiMitra() {
  const { state, l, tx, lbl, isMine, addListing, planSale } = useStore();
  const router = useRouter();
  const [crop, setCrop] = useState<CropId | "">("");
  const [quantity, setQuantity] = useState("");
  const [grade, setGrade] = useState<Grade>("A");
  const [from, setFrom] = useState<TownId>(() => {
    const village = tx(state.profile.village).toLowerCase();
    return TOWN_OPTIONS.find((t) => village.includes(t.label.en.toLowerCase()) || village.includes(t.label.mr))?.value ?? "phaltan";
  });
  const [spoken, setSpoken] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [input, setInput] = useState<MarketInput | null>(null);
  const [picked, setPicked] = useState<TownId | null>(null);
  const [decided, setDecided] = useState<TownId | null>(null);

  const mine = state.listings.filter(isMine);
  const myLots = new Set(mine.map((x) => x.lotId));
  const offersWaiting = state.offers.filter((o) => myLots.has(o.lotId) && o.status === "Submitted").length;

  const quotes = useMemo(() => (input ? quoteAll(input) : []), [input]);
  const qtl = l("quintal", "क्विंटल");

  const hear = (text: string) => {
    setSpoken(text);
    const heard = parseSpoken(text);
    if (heard.crop) setCrop(heard.crop);
    if (heard.quantity) setQuantity(String(heard.quantity));
    setErrors({});
  };

  const compare = () => {
    const e: Record<string, string> = {};
    const qty = Number(quantity);
    if (!crop) e.crop = l("Choose a crop", "पीक निवडा");
    if (!quantity || !(qty > 0)) e.quantity = l("Enter quantity in quintals", "क्विंटलमध्ये प्रमाण लिहा");
    else if (qty > 1000) e.quantity = l("That looks too large. Check the number.", "हे खूप जास्त वाटते. आकडा तपासा.");
    setErrors(e);
    if (Object.keys(e).length) return;
    setInput({ crop: crop as CropId, quantity: qty, grade, from });
    setPicked(null);
    setDecided(null);
    window.scrollTo(0, 0);
  };

  const sampleNote = (
    <div className="flex gap-2 rounded-xl bg-gold-100 p-3 text-sm text-[#6b4708]">
      <Info size={18} className="mt-0.5 shrink-0" />
      <p>
        {l(
          "Sample prices and costs for trying out the app. These are not today’s real mandi rates, so check the actual rate before you travel.",
          "ॲप वापरून पाहण्यासाठी नमुना दर व खर्च. हे आजचे खरे बाजारभाव नाहीत, त्यामुळे जाण्यापूर्वी प्रत्यक्ष दर तपासा.",
        )}
      </p>
    </div>
  );

  // ---- step 1: tell us about the produce ------------------------------------
  if (!input) {
    return (
      <div>
        <PageHeader back="/home" title={l("Mandi Mitra", "मंडी मित्र")} sub={l("Where should I sell to keep the most money?", "जास्तीत जास्त पैसे हाती येण्यासाठी कुठे विकू?")} />
        {sampleNote}

        <div className="mt-4 space-y-5">
          <Field
            label={l("Say it in one line (optional)", "एका वाक्यात सांगा (ऐच्छिक)")}
            hint={l("Tap the mic and say your crop and quantity.", "माइक दाबा आणि पीक व प्रमाण सांगा.")}
          >
            <TextArea
              rows={2}
              className={cx(inputCls, "min-h-16 resize-none py-2")}
              value={spoken}
              onChange={(e) => hear(e.target.value)}
              placeholder={l("I have 40 quintal soybean", "माझ्याकडे 40 क्विंटल सोयाबीन आहे")}
            />
          </Field>

          <Chips label={l("Crop", "पीक")} options={CROP_OPTIONS} value={crop} onChange={(v) => { setCrop(v as CropId); setErrors((x) => ({ ...x, crop: "" })); }} error={errors.crop} />

          <Field label={l("Quantity (quintal)", "प्रमाण (क्विंटल)")} hint={l("1 quintal = 100 kg", "1 क्विंटल = 100 किलो")} error={errors.quantity}>
            <Input inputMode="decimal" className={inputCls} value={quantity} onChange={(e) => { setQuantity(e.target.value); setErrors((x) => ({ ...x, quantity: "" })); }} placeholder={l("40", "40")} />
          </Field>

          <Chips label={l("Quality", "दर्जा")} options={GRADE_OPTIONS} value={grade} onChange={(v) => setGrade(v as Grade)} />

          <Field label={l("Nearest town to your farm", "तुमच्या शेताजवळचे शहर")}>
            <select className={inputCls} value={from} onChange={(e) => setFrom(e.target.value as TownId)}>
              {TOWN_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {tx(t.label)}
                </option>
              ))}
            </select>
          </Field>

          <Button full className="min-h-14 text-lg" onClick={compare}>
            {l("Find my best market", "माझा सर्वोत्तम बाजार शोधा")} <ArrowRight size={20} />
          </Button>
        </div>

        <Link href="/sell" className="mt-6 flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-white px-4">
          <ClipboardList size={22} className="shrink-0 text-leaf-700" />
          <span className="flex-1 font-semibold">{l("My listings and buyer offers", "माझ्या नोंदी व खरेदीदारांच्या ऑफर")}</span>
          {offersWaiting > 0 && <Badge tone="soil">{l(`${offersWaiting} offer${offersWaiting > 1 ? "s" : ""} waiting`, `${offersWaiting} ऑफर आल्या`)}</Badge>}
        </Link>
      </div>
    );
  }

  // ---- step 2: the answer --------------------------------------------------
  const best = quotes[0];
  const chosen = quotes.find((q) => q.market === picked) ?? best;
  const highest = quotes.reduce((a, b) => (b.price > a.price ? b : a));
  const confidence = CONFIDENCE[confidenceOf(quotes, input.grade)];
  const timing = timingFor(input, best);
  const cropName = lbl(input.crop);
  const chosenName = tx(townName(chosen.market));

  const takeToMarket = () => {
    setDecided(chosen.market);
    planSale(
      bi(
        `Planned to sell ${input.quantity} qtl ${input.crop} at ${townName(chosen.market).en}`,
        `${input.quantity} क्विंटल ${cropName} ${townName(chosen.market).mr} येथे विकण्याचे ठरवले`,
      ),
    );
  };

  const askMitra = () => {
    // grade is for the price estimate only; the Mitra checks the real grade
    addListing({ crop: input.crop.toLowerCase(), gradeCode: UNSURE, quantity: input.quantity, unit: "quintal" });
    router.push("/sell/my");
  };

  return (
    <div>
      <button onClick={() => setInput(null)} className="mb-2 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-leaf-700">
        <Pencil size={15} /> {l("Change my produce", "माझा माल बदला")}
      </button>
      <p className="text-sm text-muted">
        {input.quantity} {qtl} {cropName} · {l("from", "कुठून:")} {tx(townName(input.from))}
      </p>
      <h1 className="mt-1 text-2xl font-bold leading-tight">
        {l("Best for you:", "तुमच्यासाठी सर्वोत्तम:")} {tx(townName(best.market))}
      </h1>
      <p className="mt-1 text-[15px] text-muted">
        {highest.market !== best.market
          ? l(
              `${townName(highest.market).en} quotes more, but ${townName(best.market).en} leaves ${rupees(best.net - quotes.find((q) => q.market === highest.market)!.net)} more per quintal after costs.`,
              `${townName(highest.market).mr} येथे दर जास्त आहे, पण खर्चानंतर ${townName(best.market).mr} येथे प्रति क्विंटल ${rupees(best.net - quotes.find((q) => q.market === highest.market)!.net)} जास्त मिळतात.`,
            )
          : l("It has the highest price and still leaves the most after costs.", "इथे दर सर्वात जास्त आहे आणि खर्चानंतरही सर्वात जास्त पैसे मिळतात.")}
      </p>
      <Badge tone={confidence.tone} className="mt-2">
        {l(confidence.en, confidence.mr)}
      </Badge>

      <div className="mt-3">{sampleNote}</div>

      <SectionTitle>{l("Compare markets", "बाजारांची तुलना")}</SectionTitle>
      <p className="-mt-1 mb-2 text-sm text-muted">{l("Tap a market to choose it. Amounts are per quintal.", "निवडण्यासाठी बाजारावर दाबा. रक्कम प्रति क्विंटल आहे.")}</p>
      <div className="space-y-2">
        {quotes.map((q, i) => {
          const on = q.market === chosen.market;
          return (
            <button
              key={q.market}
              onClick={() => { setPicked(q.market); setDecided(null); }}
              aria-pressed={on}
              className={cx("block w-full rounded-2xl border bg-white p-3 text-left", on ? "border-leaf-700 ring-2 ring-leaf-700/20" : "border-line")}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-lg font-bold">{tx(townName(q.market))}</span>
                {i === 0 && <Badge tone="green">{l("Recommended", "शिफारस")}</Badge>}
              </span>
              <span className="block text-xs text-muted">{l(`About ${q.km} km away`, `साधारण ${q.km} किमी दूर`)}</span>
              <span className="mt-2 grid grid-cols-[1fr_auto] gap-y-0.5 text-sm">
                <span>{l("Market price", "बाजारभाव")}</span>
                <span className="text-right">{rupees(q.price)}</span>
                <span>{l("Transport", "वाहतूक")}</span>
                <span className="text-right text-soil">− {rupees(q.transport)}</span>
                <span>{l("Loading and market charges", "चढ-उतार व बाजार शुल्क")}</span>
                <span className="text-right text-soil">− {rupees(q.charges)}</span>
                {q.loss > 0 && (
                  <>
                    <span>{l("Produce lost on the way", "वाटेत होणारे नुकसान")}</span>
                    <span className="text-right text-soil">− {rupees(q.loss)}</span>
                  </>
                )}
                <span className="mt-1 border-t border-line pt-1 font-bold">{l("You keep", "तुम्हाला मिळतील")}</span>
                <span className="mt-1 border-t border-line pt-1 text-right text-lg font-bold text-leaf-900">{rupees(q.net)}</span>
              </span>
              <span className="block text-right text-xs text-muted">
                {l(`${rupees(q.total)} for ${input.quantity} quintal`, `${input.quantity} क्विंटलसाठी ${rupees(q.total)}`)}
              </span>
              {q.arrivals === "high" && (
                <span className="mt-1.5 flex items-start gap-1.5 text-xs font-semibold text-gold">
                  <TriangleAlert size={14} className="mt-0.5 shrink-0" />
                  {l("Many arrivals here, so the price could drop.", "इथे आवक जास्त आहे, त्यामुळे दर घसरू शकतो.")}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <SectionTitle>{l("Sell now, store, or pool?", "आता विकू, साठवू की एकत्र करू?")}</SectionTitle>
      <div className="space-y-2">
        <Card className={cx(timing.advice === "sell" && "border-leaf-700/40 bg-leaf-50")}>
          <p className="font-bold">
            {l("Sell today", "आजच विका")} {timing.advice === "sell" && <Badge tone="green">{l("Suggested", "सुचवलेले")}</Badge>}
          </p>
          <p className="text-sm text-muted">
            {timing.shelfDays <= 7
              ? l(`${cropName} lasts only about ${timing.shelfDays} days, so don’t wait for a higher price.`, `${cropName} साधारण ${timing.shelfDays} दिवसच टिकतो, त्यामुळे जास्त दरासाठी थांबू नका.`)
              : l(`About ${rupees(best.net)} per quintal at ${townName(best.market).en}, with no storage risk.`, `${townName(best.market).mr} येथे प्रति क्विंटल साधारण ${rupees(best.net)}, साठवणुकीचा धोका नाही.`)}
          </p>
        </Card>

        <Card className={cx(timing.advice === "store" && "border-leaf-700/40 bg-leaf-50")}>
          <p className="font-bold">
            {timing.store ? l(`Store for ${timing.store.days} days`, `${timing.store.days} दिवस साठवा`) : l("Store", "साठवणूक")}{" "}
            {timing.advice === "store" && <Badge tone="green">{l("Suggested", "सुचवलेले")}</Badge>}
          </p>
          <p className="text-sm text-muted">
            {timing.store
              ? l(
                  `Could change what you keep by ${signed(timing.store.low)} to ${signed(timing.store.high)} per quintal, after storage cost. This is a range, not a promise.`,
                  `साठवणूक खर्चानंतर प्रति क्विंटल ${signed(timing.store.low)} ते ${signed(timing.store.high)} फरक पडू शकतो. हा अंदाज आहे, हमी नाही.`,
                )
              : l("Not suggested: spoilage is likely.", "सुचवलेले नाही: माल खराब होण्याची शक्यता आहे.")}
          </p>
        </Card>

        <Card>
          <p className="font-bold">{l("Pool with neighbours", "शेजाऱ्यांसोबत एकत्र करा")}</p>
          <p className="text-sm text-muted">
            {timing.poolSaving > 0
              ? l(
                  `A Gaon Mandi Mitra can share one vehicle across farmers. Could save about ${rupees(timing.poolSaving)} per quintal, after the Mitra’s fee.`,
                  `गाव मंडी मित्र अनेक शेतकऱ्यांसाठी एकच वाहन करू शकतो. मित्राच्या शुल्कानंतर प्रति क्विंटल साधारण ${rupees(timing.poolSaving)} वाचू शकतात.`,
                )
              : l("Your load already fills a vehicle well, so pooling may not save money. A Mitra can still help find buyers.", "तुमचा माल वाहनासाठी पुरेसा आहे, त्यामुळे एकत्र केल्याने बचत होणार नाही. तरी मित्र खरेदीदार शोधण्यास मदत करू शकतो.")}
          </p>
        </Card>
      </div>

      <div className="mt-5 space-y-2">
        {decided === chosen.market ? (
          <div className="rounded-2xl bg-leaf-100 p-4 text-leaf-900">
            <p className="flex items-center gap-2 font-bold">
              <Check size={18} /> {l(`Plan saved: sell at ${chosenName}`, `योजना जतन केली: ${chosenName} येथे विक्री`)}
            </p>
            <p className="mt-1 text-sm">{l("Check the day’s rate before you load the vehicle.", "वाहन भरण्यापूर्वी त्या दिवसाचा दर तपासा.")}</p>
          </div>
        ) : (
          <Button full className="min-h-14 text-lg" onClick={takeToMarket}>
            <Truck size={20} /> {l(`Take to ${chosenName}`, `${chosenName} येथे घेऊन जा`)}
          </Button>
        )}
        <Button variant="secondary" full className="min-h-14" onClick={askMitra}>
          <Users size={20} /> {l("Ask a Gaon Mandi Mitra to help sell", "विक्रीसाठी गाव मंडी मित्राची मदत घ्या")}
        </Button>
        <LinkButton href="/sell" variant="ghost" full>
          {l("My listings and buyer offers", "माझ्या नोंदी व खरेदीदारांच्या ऑफर")}
        </LinkButton>
      </div>

      <p className="mt-4 text-xs text-muted">{l("This is a guide, not a promise of price. You always make the final choice.", "हे मार्गदर्शन आहे, दराची हमी नाही. अंतिम निर्णय नेहमी तुमचाच असतो.")}</p>
    </div>
  );
}

function signed(n: number) {
  return `${n >= 0 ? "+" : "−"}${rupees(Math.abs(n))}`;
}
