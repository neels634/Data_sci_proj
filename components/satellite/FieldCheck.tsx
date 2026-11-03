"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type L from "leaflet";
import { ArrowLeft, Camera, Check, CloudSun, LocateFixed, Pencil, RotateCcw, Sprout, TriangleAlert } from "lucide-react";
import { useFarm } from "@/components/myfarm/ui";
import { SpeakButton } from "@/components/speech";
import { cx } from "@/components/ui";
import { assessField, fieldReadiness, zoneColor, type FieldAssessment, type Side } from "@/lib/fieldHealth";
import { currentStage, planOf } from "@/lib/lifecycle";
import { satelliteRequest, type AnalysisResult, type PolygonGeometry, type SatelliteProblem } from "@/lib/satellite";
import type { CropInfo, FarmCrop } from "@/lib/types";
import DrawBar from "./DrawBar";
import HeatmapLayer from "./HeatmapLayer";
import MapView, { type MapHandle } from "./MapView";

const NO_VIEW = new Set(["no_imagery", "no_clear_pixels"]);
const BAD_BOUNDARY = new Set(["not_polygon", "invalid_polygon", "too_many_vertices", "self_intersecting", "field_too_large"]);
const ACRES_PER_HECTARE = 2.471;
/** a marked field this far from the size the farmer entered is probably marked wrongly */
const AREA_MISMATCH = 2;

const SIDE_TEXT: Record<Side, { en: string; mr: string }> = {
  north: { en: "on the north side", mr: "उत्तर बाजूला" },
  north_east: { en: "towards the north-east", mr: "उत्तर-पूर्व बाजूला" },
  east: { en: "on the east side", mr: "पूर्व बाजूला" },
  south_east: { en: "towards the south-east", mr: "दक्षिण-पूर्व बाजूला" },
  south: { en: "on the south side", mr: "दक्षिण बाजूला" },
  south_west: { en: "towards the south-west", mr: "दक्षिण-पश्चिम बाजूला" },
  west: { en: "on the west side", mr: "पश्चिम बाजूला" },
  north_west: { en: "towards the north-west", mr: "उत्तर-पश्चिम बाजूला" },
  scattered: { en: "scattered around the field", mr: "शेतात इकडे-तिकडे" },
};

type Checked = { result: AnalysisResult; assessment: FieldAssessment };

/** My Farm's field check: mark the field once, then get one plain answer about it, read aloud on request. */
export default function FieldCheck({ fc, crop, fromCropCheck }: { fc: FarmCrop; crop: CropInfo; fromCropCheck: boolean }) {
  const { l, tx, num, today, cropTitle, updateFarmCrop, toast } = useFarm();
  const mapHandle = useRef<MapHandle>(null);
  const panel = useRef<HTMLDivElement>(null);
  const active = useRef<AbortController | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [boundary, setBoundary] = useState<PolygonGeometry | null>(fc.boundary ?? null);
  const [checked, setChecked] = useState<Checked | null>(null);
  const [running, setRunning] = useState(false);
  const [problem, setProblem] = useState<SatelliteProblem | null>(null);
  const [drawPoints, setDrawPoints] = useState<number | null>(null);
  const [panelInset, setPanelInset] = useState(0);
  const [locating, setLocating] = useState(false);

  const readiness = fieldReadiness(fc, today);
  const lookbacks = readiness.kind === "ready" ? readiness.lookbacks.join() : "";
  const fieldName = (tx(fc.plotName) || cropTitle(fc)).slice(0, 80);

  const check = useCallback(
    async (polygon: PolygonGeometry, isNew: boolean) => {
      active.current?.abort();
      const controller = new AbortController();
      active.current = controller;
      setProblem(null);
      setChecked(null);
      setRunning(true);
      const save = () => {
        if (isNew) updateFarmCrop(fc.id, { boundary: polygon, fieldHistory: null });
      };
      try {
        const windows = lookbacks.split(",").map(Number);
        let found: Checked | null = null;
        // recent images say most about the crop today; go further back only if clouds hid the field
        for (const [i, days] of windows.entries()) {
          const last = i === windows.length - 1;
          try {
            const result = await satelliteRequest<AnalysisResult>("analyze", { geometry: polygon, field_name: fieldName, lookback_days: days }, controller.signal);
            found = { result, assessment: assessField(result) };
            if (found.assessment.kind !== "clouded") break;
          } catch (e) {
            if (last || !NO_VIEW.has((e as SatelliteProblem).code ?? "")) throw e;
          }
        }
        save();
        setChecked(found);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        const failure = e as SatelliteProblem;
        if (!BAD_BOUNDARY.has(failure.code ?? "")) save();
        setProblem(failure);
      }
      if (active.current === controller) setRunning(false);
    },
    // updateFarmCrop changes every render; only what is sent to the service matters here
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fc.id, fieldName, lookbacks],
  );

  // a saved field is checked as soon as the page opens, so the farmer only taps once
  const saved = useRef(fc.boundary ?? null);
  useEffect(() => {
    if (saved.current && lookbacks) void check(saved.current, false);
    return () => active.current?.abort();
  }, [check, lookbacks]);

  const onDrawn = (polygon: PolygonGeometry) => {
    setBoundary(polygon);
    if (readiness.kind === "ready") return void check(polygon, true);
    updateFarmCrop(fc.id, { boundary: polygon, fieldHistory: null });
  };

  const startDrawing = () => {
    active.current?.abort();
    setRunning(false);
    setProblem(null);
    setChecked(null);
    mapHandle.current?.startDrawing();
  };

  const goToMe = () => {
    if (!navigator.geolocation) return toast(l("This phone can’t share its location. Zoom the map by hand.", "हा फोन ठिकाण दाखवू शकत नाही. नकाशा हाताने झूम करा."));
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        map?.setView([position.coords.latitude, position.coords.longitude], 17, { animate: false });
      },
      () => {
        setLocating(false);
        toast(l("Couldn’t find your location. Zoom the map by hand.", "तुमचे ठिकाण सापडले नाही. नकाशा हाताने झूम करा."));
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const drawing = drawPoints !== null;
  const panelShown = !drawing && !running;

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setPanelInset(el.offsetHeight + 24));
    observer.observe(el);
    return () => observer.disconnect();
  }, [panelShown]);

  const compared = checked?.assessment.kind === "compared" ? checked.assessment : null;
  const middle = compared?.median;
  const color = useMemo(() => (middle === undefined ? null : (value: number) => zoneColor(value, middle)), [middle]);

  const backHref = fromCropCheck ? "/crop-check" : `/crops/my/${fc.id}`;
  const secondary = "flex min-h-12 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700";

  return (
    <div className="fixed inset-0 z-40 isolate overflow-hidden bg-slate-900">
      <MapView
        ref={mapHandle}
        boundary={boundary}
        bottomInset={panelInset}
        drawTip={{
          start: l("Tap one corner of your field", "तुमच्या शेताच्या एका कोपऱ्यावर दाबा"),
          next: l("Tap the next corner", "पुढच्या कोपऱ्यावर दाबा"),
          finish: l("Tap Finish when all corners are marked", "सर्व कोपरे झाल्यावर पूर्ण दाबा"),
        }}
        onMapReady={setMap}
        onDrawn={onDrawn}
        onDrawPoints={setDrawPoints}
      />

      {map && checked && color && <HeatmapLayer map={map} features={checked.result.features} boundary={checked.result.farm_boundary} index="ndvi" scaleM={checked.result.farm_summary.sample_scale_m} color={color} />}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[900] flex items-center gap-2 p-3">
        <Link href={backHref} aria-label={fromCropCheck ? l("Back to Crop Check", "पीक तपासणीकडे परत") : l("Back to my crop", "माझ्या पिकाकडे परत")} className="pointer-events-auto grid size-11 shrink-0 place-items-center rounded-full bg-white text-slate-800 shadow-lg">
          <ArrowLeft size={20} />
        </Link>
        <p className="min-w-0 truncate rounded-full bg-white px-4 py-2.5 text-sm font-bold text-slate-900 shadow-lg">
          {crop.emoji} {fieldName}
        </p>
      </div>

      {drawing && <DrawBar points={drawPoints} onCancel={() => mapHandle.current?.cancelDrawing()} onUndo={() => mapHandle.current?.undoPoint()} onFinish={() => mapHandle.current?.finishDrawing()} />}

      {running && (
        <div className="absolute inset-0 z-[1000] grid place-items-center bg-black/30 p-6" role="status" aria-live="polite">
          <div className="w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl">
            <span className="mx-auto block size-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" aria-hidden="true" />
            <p className="mt-4 text-lg font-bold text-slate-900">{l("Looking at your field…", "तुमचे शेत पाहत आहे…")}</p>
            <p className="mt-1 text-sm text-slate-600">{l("Satellite photos take about a minute. Please wait.", "उपग्रह छायाचित्रांना साधारण एक मिनिट लागतो. कृपया थांबा.")}</p>
          </div>
        </div>
      )}

      {panelShown && (
        <div ref={panel} className="absolute inset-x-3 bottom-6 z-[900] mx-auto max-h-[58dvh] max-w-md overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl">
          {!boundary && (
            <>
              <p className="text-lg font-bold text-slate-900">{l("Mark your field once", "तुमच्या शेताच्या खुणा एकदाच करा")}</p>
              <p className="mt-1 text-[15px] text-slate-600">{l("Find your field on the map, then tap its corners one by one. We will remember it, so you never have to do this again.", "नकाशावर तुमचे शेत शोधा, मग त्याच्या कोपऱ्यांवर एकेक करून दाबा. आम्ही ते लक्षात ठेवू, हे पुन्हा करावे लागणार नाही.")}</p>
              <div className="mt-3 grid gap-2">
                <button type="button" onClick={goToMe} disabled={locating} className={cx(secondary, "disabled:opacity-50")}>
                  <LocateFixed size={18} /> {locating ? l("Finding you…", "ठिकाण शोधत आहे…") : l("I am at my field: show this place", "मी शेतात आहे: हे ठिकाण दाखवा")}
                </button>
                <button type="button" onClick={startDrawing} className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-emerald-700 text-lg font-bold text-white">
                  <Pencil size={20} /> {l("Start marking corners", "कोपऱ्यांवर खुणा करायला सुरू करा")}
                </button>
              </div>
            </>
          )}

          {boundary && problem && (
            <div role="alert">
              <Answer tone="neutral" icon={<TriangleAlert size={28} />} speechId={`field-problem:${fc.id}`} title={NO_VIEW.has(problem.code ?? "") ? l("Clouds are hiding your field", "ढगांमुळे तुमचे शेत दिसत नाही") : l("Couldn’t check your field", "शेत तपासता आले नाही")} body={NO_VIEW.has(problem.code ?? "") ? l("The satellite has no clear photo of it yet. Try again after a few days.", "उपग्रहाकडे अजून त्याचे स्पष्ट छायाचित्र नाही. काही दिवसांनी पुन्हा तपासा.") : tx(problem)} />
              {problem.retry && (
                <button type="button" onClick={() => void check(boundary, false)} className="mt-3 flex min-h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-700 font-bold text-white">
                  <RotateCcw size={16} /> {l("Try again", "पुन्हा प्रयत्न करा")}
                </button>
              )}
            </div>
          )}

          {boundary && !problem && readiness.kind === "young" && <Answer tone="neutral" icon={<Sprout size={28} />} speechId={`field-young:${fc.id}`} title={l("Your crop is still small", "तुमचे पीक अजून लहान आहे")} body={l(`From space, a small crop still looks like soil, so this is not a problem. Your field is saved. Check again in ${num(readiness.daysLeft)} days.`, `लहान पीक अवकाशातून मातीसारखेच दिसते, त्यामुळे यात काळजीचे कारण नाही. तुमचे शेत जतन झाले आहे. ${num(readiness.daysLeft)} दिवसांनी पुन्हा तपासा.`)} />}

          {boundary && !problem && readiness.kind === "not_sown" && <Answer tone="neutral" icon={<Sprout size={28} />} speechId={`field-plan:${fc.id}`} title={l("Your field is saved", "तुमचे शेत जतन झाले")} body={l("You can check it about three weeks after sowing.", "पेरणीनंतर साधारण तीन आठवड्यांनी ते तपासता येईल.")} />}

          {boundary && !problem && readiness.kind === "finished" && <Answer tone="neutral" icon={<Sprout size={28} />} speechId={`field-done:${fc.id}`} title={l("This crop is finished", "हे पीक संपले आहे")} body={l("There is nothing to check in the field now.", "आता शेतात तपासण्यासारखे काही नाही.")} />}

          {checked && <Result fc={fc} crop={crop} checked={checked} />}

          {boundary && (
            <button type="button" onClick={startDrawing} className={cx(secondary, "mt-2 min-h-11 w-full border-0 font-semibold text-slate-500")}>
              <Pencil size={14} /> {l("Field marked wrongly? Mark it again", "शेताच्या खुणा चुकल्या? पुन्हा खुणा करा")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const TONES = {
  good: "bg-emerald-50 text-emerald-950 [&_[data-mark]]:bg-emerald-600",
  watch: "bg-amber-50 text-amber-950 [&_[data-mark]]:bg-amber-500",
  bad: "bg-rose-50 text-rose-950 [&_[data-mark]]:bg-rose-600",
  neutral: "bg-slate-50 text-slate-900 [&_[data-mark]]:bg-slate-500",
};

function Answer({ tone, icon, title, body, speechId, speech }: { tone: keyof typeof TONES; icon: React.ReactNode; title: string; body: string; speechId: string; speech?: string }) {
  const { l } = useFarm();
  return (
    <div className={cx("rounded-2xl p-3.5", TONES[tone])}>
      <div className="flex items-center gap-3">
        <span data-mark className="grid size-12 shrink-0 place-items-center rounded-full text-white" aria-hidden="true">
          {icon}
        </span>
        <p className="min-w-0 flex-1 text-[19px] font-bold leading-snug">{title}</p>
        <SpeakButton id={speechId} text={speech ?? `${title}. ${body}`} label={l("Read aloud", "वाचून दाखवा")} size="sm" className="bg-white text-slate-800" />
      </div>
      <p className="mt-2 text-[15px] leading-snug">{body}</p>
    </div>
  );
}

function Result({ fc, crop, checked }: { fc: FarmCrop; crop: CropInfo; checked: Checked }) {
  const { l, num, short, today } = useFarm();
  const { assessment, result } = checked;
  const summary = result.farm_summary;
  const from = short(summary.date_from);
  const to = short(summary.date_to);

  if (assessment.kind === "clouded") return <Answer tone="neutral" icon={<CloudSun size={28} />} speechId={`field-cloud:${fc.id}`} title={l("Clouds are hiding your field", "ढगांमुळे तुमचे शेत दिसत नाही")} body={l("The satellite saw too little of it to compare. Try again after a few days.", "उपग्रहाला शेताचा थोडाच भाग दिसला, त्यामुळे तुलना करता येत नाही. काही दिवसांनी पुन्हा तपासा.")} />;
  if (assessment.kind === "too_small") return <Answer tone="neutral" icon={<TriangleAlert size={28} />} speechId={`field-small:${fc.id}`} title={l("This field is too small to compare", "तुलना करण्यासाठी हे शेत खूप लहान आहे")} body={l("The satellite sees squares of 10 metres, which is too coarse for a field this size.", "उपग्रहाला 10 मीटरचे चौरस दिसतात. एवढ्या लहान शेतासाठी ते पुरेसे बारीक नाहीत.")} />;

  const stage = currentStage(fc, crop, today);
  const nearHarvest = !!stage && stage.index === planOf(fc, crop, today).stages.length - 1;
  const markedAcres = summary.area_hectares * ACRES_PER_HECTARE;
  const wrongSize = fc.areaAcres > 0 && (markedAcres > fc.areaAcres * AREA_MISMATCH || markedAcres < fc.areaAcres / AREA_MISMATCH);

  // `n` is the app's digit style on screen, and plain digits for the voice
  const words = (n: (x: number) => string) => {
    if (assessment.verdict === "even")
      return {
        title: l("Your field looks even", "तुमचे शेत सगळीकडे सारखे दिसत आहे"),
        body: l("No part of the field is far behind the rest.", "शेताचा कोणताही भाग बाकी शेतापेक्षा खूप मागे दिसत नाही."),
      };
    const parts = Math.max(1, Math.round(assessment.weakShare * 10));
    const side = SIDE_TEXT[assessment.side];
    return {
      title: assessment.verdict === "much" ? l("A big part of the field is behind", "शेताचा मोठा भाग मागे दिसत आहे") : l("A small part of the field is behind", "शेताचा थोडा भाग मागे दिसत आहे"),
      body: l(`About ${n(parts)} parts in ${n(10)} are less green than the rest, ${side.en}. Go and look: is water reaching there? Are there pests or disease?`, `साधारण ${n(10)} पैकी ${n(parts)} भाग बाकी शेतापेक्षा कमी हिरवे आहेत, ${side.mr}. तिथे जाऊन पाहा: पाणी पोहोचते का? कीड किंवा रोग आहे का?`),
    };
  };
  const shown = words((x) => num(x));
  const voice = words(String);
  const limits = l("This compares parts of your field with each other. If the whole field is weak, it can’t tell.", "ही तुमच्या शेताच्या भागांची आपसातील तुलना आहे. संपूर्ण शेतच कमकुवत असेल तर यातून कळणार नाही.");
  const ripening = l("Your crop is near harvest, so some yellowing can be normal.", "तुमचे पीक काढणीजवळ आहे, त्यामुळे थोडे पिवळे पडणे सामान्य असू शकते.");
  const when = l(`From satellite photos of ${from} to ${to}, not today’s photo.`, `${from} ते ${to} या काळातील उपग्रह छायाचित्रांवरून, आजचे छायाचित्र नव्हे.`);

  const look = assessment.verdict !== "even";
  return (
    <>
      <Answer
        tone={assessment.verdict === "even" ? "good" : assessment.verdict === "some" ? "watch" : "bad"}
        icon={look ? <TriangleAlert size={26} /> : <Check size={28} />}
        speechId={`field-result:${fc.id}`}
        title={shown.title}
        body={shown.body}
        speech={[`${voice.title}.`, voice.body, nearHarvest ? ripening : "", limits, when].filter(Boolean).join(" ")}
      />
      {look && (
        <Link href="/crop-check" className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 font-bold text-white">
          <Camera size={18} /> {l("Take a photo of the leaf there", "तिथल्या पानाचा फोटो घ्या")}
        </Link>
      )}
      <ul className="mt-3 grid grid-cols-3 gap-1 text-center text-xs font-semibold text-slate-700">
        <li className="flex items-center justify-center gap-1"><span className="size-3 rounded-full bg-emerald-600" aria-hidden="true" /> {l("Like the rest", "बाकीसारखे")}</li>
        <li className="flex items-center justify-center gap-1"><span className="size-3 rounded-full bg-amber-500" aria-hidden="true" /> {l("Slightly behind", "थोडे मागे")}</li>
        <li className="flex items-center justify-center gap-1"><span className="size-3 rounded-full bg-rose-600" aria-hidden="true" /> {l("Well behind", "जास्त मागे")}</li>
      </ul>
      <div className="mt-2 space-y-1 text-[13px] leading-snug text-slate-500">
        {nearHarvest && <p>{ripening}</p>}
        <p>{limits}</p>
        <p>{when}</p>
        {wrongSize && <p className="font-semibold text-amber-800">{l(`You marked about ${num(Math.round(markedAcres * 10) / 10)} acres, but this crop is entered as ${num(fc.areaAcres)} acres. Please check the marking.`, `तुम्ही साधारण ${num(Math.round(markedAcres * 10) / 10)} एकरावर खुणा केल्या, पण या पिकाची नोंद ${num(fc.areaAcres)} एकर आहे. कृपया खुणा तपासा.`)}</p>}
      </div>
    </>
  );
}
