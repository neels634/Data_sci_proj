"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Search, TriangleAlert } from "lucide-react";
import { CROPS, getCrop, searchCrops, seasonFor, seasonName } from "@/lib/crops";
import { expectedHarvestWindow, monthOf, occurrences } from "@/lib/lifecycle";
import type { CropInfo, FarmCrop } from "@/lib/types";
import { ACTIVITY, useFarm } from "@/components/myfarm/ui";
import { Input } from "@/components/voice";
import { toAsciiDigits } from "@/lib/marathi-numbers";
import { Button, Card, Field, PageHeader, cx, inputCls } from "@/components/ui";

export default function AddCropPage() {
  return (
    <Suspense fallback={null}>
      <AddCrop />
    </Suspense>
  );
}

const uid = () => `fc${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function AddCrop() {
  const params = useSearchParams();
  const router = useRouter();
  const { l, tx, ctx, num, today, short, addFarmCrop } = useFarm();
  const pre = getCrop(params.get("crop") ?? "");
  const [step, setStep] = useState(pre ? 1 : 0);
  const [cropId, setCropId] = useState(pre?.id ?? "");
  const [q, setQ] = useState("");
  const crop = getCrop(cropId);
  const nowMonth = monthOf(today);
  const [seasonIndex, setSeasonIndex] = useState(pre ? seasonFor(pre, nowMonth).index : 0);
  const [method, setMethod] = useState<FarmCrop["method"]>(pre?.method === "direct" ? "direct" : "transplant");
  const [variety, setVariety] = useState("");
  const [plot, setPlot] = useState("");
  const [area, setArea] = useState("");
  const [sown, setSown] = useState(true);
  const [date, setDate] = useState(today);
  const [tpDate, setTpDate] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});

  const pick = (c: CropInfo) => {
    setCropId(c.id);
    setSeasonIndex(seasonFor(c, nowMonth).index);
    setMethod(c.method === "direct" ? "direct" : "transplant");
    setErr({});
    setStep(1);
  };

  const season = crop?.seasons[seasonIndex];
  const offSeason = !!season && !!date && !season.sowingMonths.includes(monthOf(date));
  const isTransplant = method === "transplant";

  // a draft crop for the preview
  const draft: FarmCrop | null =
    crop && season && date
      ? {
          id: "draft",
          owner: "",
          cropId: crop.id,
          season: season.season,
          seasonIndex,
          variety,
          plotName: plot,
          areaAcres: Number(area) || 0,
          method,
          status: sown ? "growing" : "planned",
          plannedSowingDate: sown ? null : date,
          sowingDate: sown ? date : null,
          transplantDate: sown && isTransplant && tpDate ? tpDate : null,
          durationDays: season.durationDays,
          harvestedOn: null,
          notes: "",
          createdAt: today,
        }
      : null;
  const preview = draft && crop ? occurrences({ ...draft, sowingDate: date }, crop).filter((o) => o.date >= today).slice(0, 3) : [];
  const hw = draft ? expectedHarvestWindow(draft) : null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      const n = Number(area);
      if (!area.trim()) e.area = l("Enter the area in acres", "क्षेत्र एकरमध्ये लिहा");
      else if (!/^\d+(\.\d+)?$/.test(area.trim()) || n <= 0) e.area = l("Enter a number greater than 0", "0 पेक्षा मोठा आकडा लिहा");
      else if (n > 100) e.area = l("That is more than 100 acres — please check", "हे 100 एकरपेक्षा जास्त आहे — तपासा");
    }
    if (step === 2) {
      if (!date) e.date = l("Choose the date", "तारीख निवडा");
      else if (sown && date > today) e.date = l("A sowing date can't be in the future — choose ‘Planning to sow’", "पेरणीची तारीख पुढची असू शकत नाही — ‘पेरणी करणार आहे’ निवडा");
      else if (!sown && date < today) e.date = l("Choose today or a later date", "आजची किंवा पुढची तारीख निवडा");
      if (sown && tpDate && (tpDate < date || tpDate > today)) e.tpDate = l("Between the sowing date and today", "पेरणीची तारीख व आज यांच्या दरम्यान");
    }
    setErr(e);
    return !Object.keys(e).length;
  };

  const save = () => {
    if (!validate() || !draft) return;
    const id = uid();
    addFarmCrop({
      id,
      cropId: draft.cropId,
      season: draft.season,
      seasonIndex: draft.seasonIndex,
      variety: variety.trim().slice(0, 40),
      plotName: plot.trim().slice(0, 40),
      areaAcres: Number(area),
      method: draft.method,
      status: draft.status,
      plannedSowingDate: draft.plannedSowingDate,
      sowingDate: draft.sowingDate,
      transplantDate: draft.transplantDate,
      durationDays: draft.durationDays,
      harvestedOn: null,
      notes: "",
    });
    router.push(`/crops/my/${id}`);
  };

  const labels = [l("Crop", "पीक"), l("Details", "तपशील"), l("Sowing", "पेरणी")];
  const found = searchCrops(q);

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
            {(found.length ? found : CROPS).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => pick(c)}
                className={cx("flex min-h-28 flex-col items-center justify-center gap-1 rounded-3xl border-2 bg-white p-3", cropId === c.id ? "border-leaf-700" : "border-line")}
              >
                <span className="text-5xl" aria-hidden>
                  {c.emoji}
                </span>
                <span className="text-lg font-bold">{tx(c.name)}</span>
              </button>
            ))}
          </div>
          {q && !found.length && <p className="mt-3 text-center text-muted">{l("No match — showing all crops.", "जुळले नाही — सर्व पिके दाखवत आहे.")}</p>}
        </>
      )}

      {step === 1 && crop && (
        <div className="space-y-5">
          <Card className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden>
              {crop.emoji}
            </span>
            <span className="flex-1 text-xl font-bold">{tx(crop.name)}</span>
            <Button variant="ghost" onClick={() => setStep(0)}>
              {l("Change", "बदला")}
            </Button>
          </Card>
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
                      {ctx(s.sowingWindow)} · {l(`${num(s.durationDays[0])}–${num(s.durationDays[1])} days`, `${num(s.durationDays[0])}–${num(s.durationDays[1])} दिवस`)}
                    </span>
                  </span>
                  {s.sowingMonths.includes(nowMonth) && <span className="shrink-0 text-sm font-semibold text-leaf-700">{l("Now ✓", "आता ✓")}</span>}
                </button>
              ))}
            </div>
          </fieldset>
          {crop.method === "both" && (
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
          <Field label={l("Variety (optional)", "वाण (पर्यायी)")}>
            <Input className={inputCls} value={variety} maxLength={40} onChange={(e) => setVariety(e.target.value)} placeholder={l("As on the seed packet", "बियाण्याच्या पाकिटावर असलेले")} />
          </Field>
          <Field label={l("Plot name (optional)", "शेताचे नाव (पर्यायी)")}>
            <Input className={inputCls} value={plot} maxLength={40} onChange={(e) => setPlot(e.target.value)} placeholder={l("e.g. Field near well", "उदा. विहिरीजवळचे शेत")} />
          </Field>
          <Field label={l("Area in acres *", "क्षेत्र एकरमध्ये *")} error={err.area}>
            <Input className={inputCls} inputMode="decimal" value={area} maxLength={6} onChange={(e) => setArea(toAsciiDigits(e.target.value).replace(/[^\d.]/g, ""))} />
          </Field>
        </div>
      )}

      {step === 2 && crop && season && (
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
                {v ? l("Already sown", "पेरणी झाली") : l("Planning to sow", "पेरणी करणार आहे")}
              </button>
            ))}
          </div>
          <Field label={sown ? (isTransplant ? l("Nursery sowing date", "रोपवाटिका पेरणीची तारीख") : l("Sowing date", "पेरणीची तारीख")) : l("Planned sowing date", "नियोजित पेरणीची तारीख")} error={err.date}>
            <input type="date" className={inputCls} value={date} max={sown ? today : undefined} min={sown ? undefined : today} onChange={(e) => setDate(e.target.value)} />
          </Field>
          {sown && isTransplant && (
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
          {hw && (
            <Card className="space-y-2 bg-leaf-50">
              <p className="font-bold">
                🌾 {l("Expected harvest", "अपेक्षित काढणी")}: {short(hw.earliest)} – {short(hw.latest)}
                {hw.estimate ? ` (${l("estimate", "अंदाज")})` : ""}
              </p>
              {preview.length > 0 && (
                <>
                  <p className="text-sm font-semibold text-muted">{l("Next tasks", "पुढची कामे")}</p>
                  <ul className="space-y-1.5">
                    {preview.map((o) => (
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
            </Card>
          )}
        </div>
      )}

      <div className="fixed inset-x-0 bottom-[65px] z-20 mx-auto flex max-w-md gap-2 border-t border-line bg-white/95 px-3 py-2.5 backdrop-blur">
        {step > 0 && (
          <Button variant="secondary" className="min-h-12 px-4" onClick={() => setStep((s) => s - 1)} aria-label={l("Back", "मागे")}>
            <ArrowLeft size={20} />
          </Button>
        )}
        {step === 0 ? (
          <Button className="min-h-12 flex-1" disabled={!crop} onClick={() => setStep(1)}>
            {l("Next", "पुढे")} <ArrowRight size={20} />
          </Button>
        ) : step === 1 ? (
          <Button className="min-h-12 flex-1" onClick={() => validate() && setStep(2)}>
            {l("Next", "पुढे")} <ArrowRight size={20} />
          </Button>
        ) : (
          <Button className="min-h-12 flex-1" onClick={save}>
            <Check size={20} /> {l("Save crop", "पीक जतन करा")}
          </Button>
        )}
      </div>
    </div>
  );
}
