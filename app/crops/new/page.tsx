"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Search, TriangleAlert } from "lucide-react";
import { CROP_INDEX, cropEntry, monthRuns, searchCrops, seasonFor, seasonName, sortPopular } from "@/lib/crops";
import { useCrop } from "@/lib/crops/load";
import { addDays, daysBetween, expectedHarvestWindow, firstCropYear, monthOf, occurrences } from "@/lib/lifecycle";
import { regionForDistrict } from "@/lib/regions";
import { toAsciiDigits } from "@/lib/marathi-numbers";
import type { CropInfo, FarmCrop, PerennialCrop, SeasonalCrop } from "@/lib/types";
import { ACTIVITY, useFarm } from "@/components/myfarm/ui";
import { Input } from "@/components/voice";
import { Button, Card, Field, PageHeader, cx, inputCls } from "@/components/ui";

export default function AddCropPage() {
  return (
    <Suspense fallback={null}>
      <AddCrop />
    </Suspense>
  );
}

const uid = () => `fc${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const num = (v: string) => toAsciiDigits(v).replace(/[^\d.]/g, "");

function AddCrop() {
  const params = useSearchParams();
  const { l, tx, account, state } = useFarm();
  const lang = state.lang === "mr" ? "mr" : "en";
  const preId = cropEntry(params.get("crop") ?? "")?.id ?? "";
  const [step, setStep] = useState(preId ? 1 : 0);
  const [cropId, setCropId] = useState(preId);
  const [q, setQ] = useState("");
  const crop = useCrop(cropId || null);

  const found = q.trim() ? searchCrops(q) : sortPopular(CROP_INDEX, regionForDistrict(account?.district), lang);
  const labels = [l("Crop", "पीक"), l("Details", "तपशील"), l("Dates", "तारखा")];

  return (
    <div className="pb-28">
      <PageHeader back="/crops" title={l("Add my crop", "माझे पीक जोडा")} sub={labels[step]} />
      <div className="mb-5 flex items-center justify-center gap-2" aria-label={l(`Step ${step + 1} of 3`, `पायरी ${step + 1} / 3`)}>
        {labels.map((_, i) => (
          <span key={i} className={cx("h-3 rounded-full transition-all", i === step ? "w-8 bg-leaf-700" : i < step ? "w-3 bg-leaf-600" : "w-3 bg-line")} />
        ))}
      </div>

      {step === 0 && (
        <>
          <label className="relative block">
            <span className="sr-only">{l("Search a crop", "पीक शोधा")}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={22} />
            <input type="search" className={cx(inputCls, "min-h-14 rounded-2xl pl-12 text-lg")} placeholder={l("Search — e.g. onion / कांदा", "शोधा — उदा. कांदा / onion")} value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {(found.length ? found : CROP_INDEX).slice(0, 60).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCropId(c.id);
                  setStep(1);
                }}
                className={cx("flex min-h-28 flex-col items-center justify-center gap-1 rounded-3xl border-2 bg-white p-3", cropId === c.id ? "border-leaf-700" : "border-line")}
              >
                <span className="text-5xl" aria-hidden>
                  {c.emoji}
                </span>
                <span className="text-lg font-bold leading-tight">{tx(c.name)}</span>
              </button>
            ))}
          </div>
          {q && !found.length && <p className="mt-3 text-center text-muted">{l("No match — showing all crops.", "जुळले नाही — सर्व पिके दाखवत आहे.")}</p>}
        </>
      )}

      {step > 0 && crop === undefined && <div className="h-40 animate-pulse rounded-2xl bg-sand" aria-busy="true" />}
      {step > 0 && crop && (crop.lifecycle === "seasonal" ? <SeasonalForm key={crop.id} crop={crop} step={step} setStep={setStep} /> : <PerennialForm key={crop.id} crop={crop} step={step} setStep={setStep} />)}
      {step > 0 && crop === null && <p className="text-muted">{l("Crop not found.", "पीक सापडले नाही.")}</p>}

      {step === 0 && (
        <div className="fixed inset-x-0 bottom-[65px] z-20 mx-auto flex max-w-md gap-2 border-t border-line bg-white/95 px-3 py-2.5 backdrop-blur">
          <Button className="min-h-12 flex-1" disabled={!cropId} onClick={() => setStep(1)}>
            {l("Next", "पुढे")} <ArrowRight size={20} />
          </Button>
        </div>
      )}
    </div>
  );
}

function ChosenCrop({ crop, onChange }: { crop: CropInfo; onChange: () => void }) {
  const { l, tx } = useFarm();
  return (
    <Card className="flex items-center gap-3">
      <span className="text-4xl" aria-hidden>
        {crop.emoji}
      </span>
      <span className="flex-1 text-xl font-bold">{tx(crop.name)}</span>
      <Button variant="ghost" onClick={onChange}>
        {l("Change", "बदला")}
      </Button>
    </Card>
  );
}

function Footer({ step, setStep, onNext, onSave }: { step: number; setStep: (n: number) => void; onNext: () => void; onSave: () => void }) {
  const { l } = useFarm();
  return (
    <div className="fixed inset-x-0 bottom-[65px] z-20 mx-auto flex max-w-md gap-2 border-t border-line bg-white/95 px-3 py-2.5 backdrop-blur">
      <Button variant="secondary" className="min-h-12 px-4" onClick={() => setStep(step - 1)} aria-label={l("Back", "मागे")}>
        <ArrowLeft size={20} />
      </Button>
      {step === 1 ? (
        <Button className="min-h-12 flex-1" onClick={onNext}>
          {l("Next", "पुढे")} <ArrowRight size={20} />
        </Button>
      ) : (
        <Button className="min-h-12 flex-1" onClick={onSave}>
          <Check size={20} /> {l("Save crop", "पीक जतन करा")}
        </Button>
      )}
    </div>
  );
}

/** Harvest window and the next three tasks for a draft crop. */
function Preview({ fc, crop }: { fc: FarmCrop; crop: CropInfo }) {
  const { l, tx, ctx, today, short, num: n } = useFarm();
  const hw = expectedHarvestWindow(fc, crop);
  const young = crop.lifecycle === "perennial" && !fc.cycleStart ? firstCropYear(fc, crop) : null;
  const next = occurrences({ ...fc, status: "growing", sowingDate: fc.sowingDate ?? fc.plannedSowingDate }, crop)
    .filter((o) => o.date >= today)
    .slice(0, 3);
  return (
    <Card className="space-y-2 bg-leaf-50">
      {young && young > Number(today.slice(0, 4)) ? (
        <p className="font-bold">🌱 {l(`Young orchard — first crop expected in ${young}`, `लहान बाग — पहिले उत्पादन ${n(young)} मध्ये अपेक्षित`)}</p>
      ) : (
        hw && (
          <p className="font-bold">
            🌾 {l("Expected harvest", "अपेक्षित काढणी")}: {short(hw.earliest)} – {short(hw.latest)}
            {hw.estimate ? ` (${l("estimate", "अंदाज")})` : ""}
          </p>
        )
      )}
      {next.length > 0 && (
        <>
          <p className="text-sm font-semibold text-muted">{l("Next tasks", "पुढची कामे")}</p>
          <ul className="space-y-1.5">
            {next.map((o) => (
              <li key={o.key} className="flex items-center gap-2">
                <span className={cx("grid size-9 shrink-0 place-items-center rounded-full", ACTIVITY[o.task.type].tone)}>{ACTIVITY[o.task.type].icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold leading-tight">{ctx(o.task.title)}</span>
                  <span className="text-sm text-muted">{short(o.date)}</span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="sr-only">{tx(crop.name)}</p>
    </Card>
  );
}

const common = (plot: string, variety: string, area: string) => ({ variety: variety.trim().slice(0, 40), plotName: plot.trim().slice(0, 40), areaAcres: Number(area) });

function areaError(area: string, l: (en: string, mr: string) => string) {
  const n = Number(area);
  if (!area.trim()) return l("Enter the area in acres", "क्षेत्र एकरमध्ये लिहा");
  if (!/^\d+(\.\d+)?$/.test(area.trim()) || n <= 0) return l("Enter a number greater than 0", "0 पेक्षा मोठा आकडा लिहा");
  if (n > 100) return l("That is more than 100 acres — please check", "हे 100 एकरपेक्षा जास्त आहे — तपासा");
  return "";
}

// ---- seasonal crops (incl. ratoon) ------------------------------------------------------------

function SeasonalForm({ crop, step, setStep }: { crop: SeasonalCrop; step: number; setStep: (n: number) => void }) {
  const router = useRouter();
  const { l, tx, ctx, today, num: n, addFarmCrop } = useFarm();
  const nowMonth = monthOf(today);
  const [seasonIndex, setSeasonIndex] = useState(seasonFor(crop, nowMonth).index);
  const [method, setMethod] = useState<FarmCrop["method"]>(crop.method === "both" ? "transplant" : crop.method);
  const [variety, setVariety] = useState("");
  const [plot, setPlot] = useState("");
  const [area, setArea] = useState("");
  const [ratoon, setRatoon] = useState(0); // 0 = plant crop
  const [sown, setSown] = useState(true);
  const [date, setDate] = useState(today);
  const [tpDate, setTpDate] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});
  const season = crop.seasons[seasonIndex];
  const isTransplant = method === "transplant";
  const isRatoon = ratoon > 0 && !!crop.ratoon?.allowed;
  const durationDays: [number, number] = isRatoon ? crop.ratoon!.durationDays : season.durationDays;
  const offSeason = !isRatoon && !!date && !season.sowingMonths.includes(monthOf(date));

  const draft: FarmCrop = {
    id: "draft",
    owner: "",
    cropId: crop.id,
    kind: "seasonal",
    season: season.season,
    seasonIndex,
    variety,
    plotName: plot,
    areaAcres: Number(area) || 0,
    method,
    status: sown ? "growing" : "planned",
    plannedSowingDate: sown ? null : date,
    sowingDate: sown ? date : null,
    transplantDate: sown && isTransplant && !isRatoon && tpDate ? tpDate : null,
    durationDays,
    harvestedOn: null,
    notes: "",
    createdAt: today,
    ...(crop.ratoon?.allowed ? { ratoonNumber: ratoon } : {}),
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      const a = areaError(area, l);
      if (a) e.area = a;
    }
    if (step === 2) {
      if (!date) e.date = l("Choose the date", "तारीख निवडा");
      else if (sown && date > today) e.date = l("This date can't be in the future — choose ‘Planning to sow’", "ही तारीख पुढची असू शकत नाही — ‘पेरणी करणार आहे’ निवडा");
      else if (!sown && date < today) e.date = l("Choose today or a later date", "आजची किंवा पुढची तारीख निवडा");
      if (sown && tpDate && (tpDate < date || tpDate > today)) e.tpDate = l("Between the sowing date and today", "पेरणीची तारीख व आज यांच्या दरम्यान");
    }
    setErr(e);
    return !Object.keys(e).length;
  };
  const save = () => {
    if (!validate()) return;
    const id = uid();
    const { id: _d, owner: _o, createdAt: _c, ...rest } = draft;
    void [_d, _o, _c];
    addFarmCrop({ ...rest, id, ...common(plot, variety, area) }, crop);
    router.push(`/crops/my/${id}`);
  };

  return (
    <>
      {step === 1 && (
        <div className="space-y-5">
          <ChosenCrop crop={crop} onChange={() => setStep(0)} />
          {crop.ratoon?.allowed && (
            <fieldset>
              <legend className="mb-2 font-semibold">{l("Plant crop or ratoon?", "नवीन लागवड की खोडवा?")}</legend>
              <div className="grid grid-cols-2 gap-2" role="radiogroup">
                {Array.from({ length: crop.ratoon.cycles + 1 }, (_, i) => i).map((i) => (
                  <button key={i} type="button" role="radio" aria-checked={ratoon === i} onClick={() => setRatoon(i)} className={cx("min-h-12 rounded-2xl border-2 px-3 font-semibold", ratoon === i ? "border-leaf-700 bg-leaf-50" : "border-line bg-white")}>
                    {i === 0 ? l("Plant crop", "नवीन लागवड") : l(`Ratoon ${i}`, `खोडवा ${n(i)}`)}
                  </button>
                ))}
              </div>
              {isRatoon && <p className="mt-2 text-sm text-muted">{ctx(crop.ratoon.note)}</p>}
            </fieldset>
          )}
          {!isRatoon && (
            <fieldset>
              <legend className="mb-2 font-semibold">{l("Season", "हंगाम")}</legend>
              <div className="grid gap-2" role="radiogroup">
                {crop.seasons.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={seasonIndex === i}
                    onClick={() => setSeasonIndex(i)}
                    className={cx("flex min-h-14 items-center justify-between gap-2 rounded-2xl border-2 px-4 text-left", seasonIndex === i ? "border-leaf-700 bg-leaf-50" : "border-line bg-white")}
                  >
                    <span>
                      <span className="block font-bold">{tx(seasonName(crop, i))}</span>
                      <span className="block text-sm text-muted">
                        {ctx(s.sowingWindow)} · {l(`${n(s.durationDays[0])}–${n(s.durationDays[1])} days`, `${n(s.durationDays[0])}–${n(s.durationDays[1])} दिवस`)}
                      </span>
                    </span>
                    {s.sowingMonths.includes(nowMonth) && <span className="shrink-0 text-sm font-semibold text-leaf-700">{l("Now ✓", "आता ✓")}</span>}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {crop.method === "both" && !isRatoon && (
            <fieldset>
              <legend className="mb-2 font-semibold">{l("How will you plant?", "लागवड कशी करणार?")}</legend>
              <div className="grid grid-cols-2 gap-2">
                {(["direct", "transplant"] as const).map((m) => (
                  <button key={m} type="button" aria-pressed={method === m} onClick={() => setMethod(m)} className={cx("min-h-12 rounded-2xl border-2 font-semibold", method === m ? "border-leaf-700 bg-leaf-50" : "border-line bg-white")}>
                    {m === "direct" ? l("Sow directly", "थेट पेरणी") : l("Nursery + transplant", "रोपवाटिका + पुनर्लागवड")}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <Details plot={plot} setPlot={setPlot} variety={variety} setVariety={setVariety} area={area} setArea={setArea} err={err} />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-2" role="radiogroup">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                role="radio"
                aria-checked={sown === v}
                onClick={() => {
                  setSown(v);
                  setErr({});
                }}
                className={cx("min-h-16 rounded-2xl border-2 px-3 text-lg font-bold", sown === v ? "border-leaf-700 bg-leaf-50" : "border-line bg-white")}
              >
                {v ? (isRatoon ? l("Ratoon started", "खोडवा सुरू झाला") : l("Already sown", "पेरणी झाली")) : isRatoon ? l("Starting later", "नंतर सुरू करणार") : l("Planning to sow", "पेरणी करणार आहे")}
              </button>
            ))}
          </div>
          <Field
            label={
              isRatoon
                ? l("Ratoon start date (after the last harvest)", "खोडवा सुरू केल्याची तारीख (मागील तोडणीनंतर)")
                : sown
                  ? isTransplant
                    ? l("Nursery sowing date", "रोपवाटिका पेरणीची तारीख")
                    : method === "vegetative"
                      ? l("Planting date", "लागवडीची तारीख")
                      : l("Sowing date", "पेरणीची तारीख")
                  : l("Planned date", "नियोजित तारीख")
            }
            error={err.date}
          >
            <input type="date" className={inputCls} value={date} max={sown ? today : undefined} min={sown ? undefined : today} onChange={(e) => setDate(e.target.value)} />
          </Field>
          {sown && isTransplant && !isRatoon && (
            <Field label={l("Transplanting date (optional)", "पुनर्लागवडीची तारीख (पर्यायी)")} error={err.tpDate}>
              <input type="date" className={inputCls} value={tpDate} min={date} max={today} onChange={(e) => setTpDate(e.target.value)} />
            </Field>
          )}
          {offSeason && (
            <p className="flex gap-2 rounded-2xl bg-gold-100 p-3 text-[15px] text-[#6b4708]" role="status">
              <TriangleAlert size={20} className="mt-0.5 shrink-0" />
              {l(`This is not the usual sowing time for this season (${ctx(season.sowingWindow)}).`, `या हंगामासाठी ही नेहमीची पेरणीची वेळ नाही (${ctx(season.sowingWindow)}).`)}
            </p>
          )}
          {date && <Preview fc={draft} crop={crop} />}
        </div>
      )}
      <Footer step={step} setStep={setStep} onNext={() => validate() && setStep(2)} onSave={save} />
    </>
  );
}

// ---- perennial crops ---------------------------------------------------------------------------

function PerennialForm({ crop, step, setStep }: { crop: PerennialCrop; step: number; setStep: (n: number) => void }) {
  const router = useRouter();
  const { l, tx, ctx, today, num: n, state, addFarmCrop } = useFarm();
  const lang = state.lang === "mr" ? "mr" : "en";
  const [variety, setVariety] = useState("");
  const [plot, setPlot] = useState("");
  const [area, setArea] = useState("");
  const [plants, setPlants] = useState("");
  const [plantedOn, setPlantedOn] = useState("");
  const [cycleKey, setCycleKey] = useState<string>(""); // "" = not started yet
  const [cycleStart, setCycleStart] = useState(today);
  const [err, setErr] = useState<Record<string, string>>({});
  const planned = !!plantedOn && plantedOn > today;
  const ageYears = plantedOn && !planned ? Math.floor(daysBetween(plantedOn, today) / 365.25) : 0;
  const young = ageYears < crop.yearsToFirstHarvest[0];
  const cycle = crop.cycles.find((c) => c.key === cycleKey);
  const suggestedPlants = area && Number(area) > 0 ? Math.round(((crop.plantsPerAcre[0] + crop.plantsPerAcre[1]) / 2) * Number(area)) : null;

  const draft: FarmCrop = {
    id: "draft",
    owner: "",
    cropId: crop.id,
    kind: "perennial",
    season: "perennial",
    seasonIndex: 0,
    variety,
    plotName: plot,
    areaAcres: Number(area) || 0,
    method: "transplant",
    status: planned ? "planned" : "growing",
    plannedSowingDate: planned ? plantedOn : null,
    sowingDate: null,
    transplantDate: null,
    durationDays: cycle ? [cycle.stages[cycle.stages.length - 1].endDay, cycle.stages[cycle.stages.length - 1].endDay] : [0, 0],
    harvestedOn: null,
    notes: "",
    createdAt: today,
    plantedOn: plantedOn || null,
    plantCount: Number(plants) || suggestedPlants || undefined,
    cycleKey: cycle && !planned ? cycle.key : undefined,
    cycleStart: cycle && !planned ? cycleStart : null,
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      const a = areaError(area, l);
      if (a) e.area = a;
      if (plants && !(Number(plants) > 0 && Number(plants) <= 100000)) e.plants = l("Enter a number of plants, or leave empty", "झाडांची संख्या लिहा किंवा रिकामे ठेवा");
    }
    if (step === 2) {
      if (!plantedOn) e.plantedOn = l("Choose the planting date", "लागवडीची तारीख निवडा");
      else if (plantedOn < addDays(today, -365 * 60)) e.plantedOn = l("Please check the year", "वर्ष तपासा");
      if (cycle && !planned) {
        if (!cycleStart) e.cycleStart = l("Choose the start date", "सुरुवातीची तारीख निवडा");
        else if (cycleStart > today) e.cycleStart = l("Can't be in the future", "तारीख पुढची असू शकत नाही");
        else if (plantedOn && cycleStart < plantedOn) e.cycleStart = l("After the planting date", "लागवडीच्या तारखेनंतर");
      }
    }
    setErr(e);
    return !Object.keys(e).length;
  };
  const save = () => {
    if (!validate()) return;
    const id = uid();
    const { id: _d, owner: _o, createdAt: _c, ...rest } = draft;
    void [_d, _o, _c];
    addFarmCrop({ ...rest, id, ...common(plot, variety, area) }, crop);
    router.push(`/crops/my/${id}`);
  };

  return (
    <>
      {step === 1 && (
        <div className="space-y-5">
          <ChosenCrop crop={crop} onChange={() => setStep(0)} />
          <Details plot={plot} setPlot={setPlot} variety={variety} setVariety={setVariety} area={area} setArea={setArea} err={err} />
          <Field label={l("Number of plants (optional)", "झाडांची संख्या (पर्यायी)")} error={err.plants} hint={suggestedPlants ? l(`About ${suggestedPlants} for this area`, `या क्षेत्रासाठी साधारण ${n(suggestedPlants)}`) : undefined}>
            <Input className={inputCls} inputMode="numeric" value={plants} maxLength={6} onChange={(e) => setPlants(num(e.target.value).replace(".", ""))} />
          </Field>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-5">
          <Field label={l("Planting date (can be years ago)", "लागवडीची तारीख (वर्षांपूर्वीचीही चालेल)")} error={err.plantedOn} hint={l(`Usual planting: ${tx(crop.plantingWindow)}`, `नेहमीची लागवड: ${tx(crop.plantingWindow)}`)}>
            <input type="date" className={inputCls} value={plantedOn} onChange={(e) => setPlantedOn(e.target.value)} />
          </Field>
          {plantedOn && !planned && (
            <fieldset>
              <legend className="mb-1 font-semibold">{l("This year's crop", "या वर्षीचा बहार")}</legend>
              {young && <p className="mb-2 text-sm text-muted">{l(`Young orchard — usually no crop until year ${crop.yearsToFirstHarvest[0]}. You can leave this as ‘Not started yet’.`, `लहान बाग — साधारण ${n(crop.yearsToFirstHarvest[0])} वर्षांपर्यंत बहार घेत नाहीत. ‘अजून सुरू नाही’ ठेवू शकता.`)}</p>}
              <div className="grid gap-2" role="radiogroup">
                {[...crop.cycles.map((c) => c.key), ""].map((k) => {
                  const c = crop.cycles.find((x) => x.key === k);
                  return (
                    <button key={k || "none"} type="button" role="radio" aria-checked={cycleKey === k} onClick={() => setCycleKey(k)} className={cx("min-h-14 rounded-2xl border-2 px-4 text-left", cycleKey === k ? "border-leaf-700 bg-leaf-50" : "border-line bg-white")}>
                      <span className="block font-bold">{c ? tx(c.name) : l("Not started yet", "अजून सुरू नाही")}</span>
                      <span className="block text-sm text-muted">
                        {c
                          ? l(`Starts ${monthRuns(c.startMonths, lang)} · harvest ${monthRuns(c.harvestMonths, lang)}`, `सुरुवात ${monthRuns(c.startMonths, lang)} · काढणी ${monthRuns(c.harvestMonths, lang)}`)
                          : l("Add it later from the crop page", "नंतर पिकाच्या पानावरून सुरू करा")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}
          {cycle && !planned && (
            <Field label={l(`${tx(cycle.name)} — start date`, `${tx(cycle.name)} — सुरुवातीची तारीख`)} error={err.cycleStart} hint={ctx(cycle.startEvent)}>
              <input type="date" className={inputCls} value={cycleStart} max={today} min={plantedOn} onChange={(e) => setCycleStart(e.target.value)} />
            </Field>
          )}
          {plantedOn && <Preview fc={draft} crop={crop} />}
        </div>
      )}
      <Footer step={step} setStep={setStep} onNext={() => validate() && setStep(2)} onSave={save} />
    </>
  );
}

function Details({
  plot,
  setPlot,
  variety,
  setVariety,
  area,
  setArea,
  err,
}: {
  plot: string;
  setPlot: (v: string) => void;
  variety: string;
  setVariety: (v: string) => void;
  area: string;
  setArea: (v: string) => void;
  err: Record<string, string>;
}) {
  const { l } = useFarm();
  return (
    <>
      <Field label={l("Variety (optional)", "वाण (पर्यायी)")}>
        <Input className={inputCls} value={variety} maxLength={40} onChange={(e) => setVariety(e.target.value)} placeholder={l("As on the seed packet or nursery bill", "बियाण्याच्या पाकिटावर / रोपवाटिकेच्या पावतीवर असलेले")} />
      </Field>
      <Field label={l("Plot name (optional)", "शेताचे नाव (पर्यायी)")}>
        <Input className={inputCls} value={plot} maxLength={40} onChange={(e) => setPlot(e.target.value)} placeholder={l("e.g. Field near well", "उदा. विहिरीजवळचे शेत")} />
      </Field>
      <Field label={l("Area in acres *", "क्षेत्र एकरमध्ये *")} error={err.area}>
        <Input className={inputCls} inputMode="decimal" value={area} maxLength={6} onChange={(e) => setArea(num(e.target.value))} />
      </Field>
    </>
  );
}
