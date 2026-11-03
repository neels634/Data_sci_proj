"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type L from "leaflet";
import { ArrowLeft, ChevronDown, ChevronUp, Pencil, Play, RotateCcw, Satellite, TriangleAlert, Upload } from "lucide-react";
import { useStore } from "@/lib/store";
import { INDICES, indexInfo, legendFor, polygonFromGeoJson, satelliteRequest, type AnalysisResult, type ClearDate, type IndexId, type PolygonGeometry, type SatelliteProblem } from "@/lib/satellite";
import { cx, inputCls } from "@/components/ui";
import { Input } from "@/components/voice";
import DrawBar from "./DrawBar";
import HeatmapLayer from "./HeatmapLayer";
import LoadingOverlay, { STEP_COUNT } from "./LoadingOverlay";
import MapView, { type MapHandle } from "./MapView";

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
const TICK_MS = 300;
const PROGRESS_WHILE_WAITING = 94; // the bar waits here until the real answer arrives

type Run = { progress: number };

/** Satellite farm analysis in Crop Check: draw or upload a field, then see its crop health map. */
export default function SatelliteAnalysis() {
  const { l, tx, date } = useStore();
  const mapHandle = useRef<MapHandle>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [boundary, setBoundary] = useState<PolygonGeometry | null>(null);
  const [fieldName, setFieldName] = useState("Field 1");
  const [fieldCount, setFieldCount] = useState(1);
  const [index, setIndex] = useState<IndexId>("ndvi");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dates, setDates] = useState<ClearDate[] | null>(null);
  const [run, setRun] = useState<Run | null>(null);
  const [problem, setProblem] = useState<SatelliteProblem | null>(null);
  const [drawPoints, setDrawPoints] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [panelInset, setPanelInset] = useState(0);
  const panel = useRef<HTMLDivElement>(null);

  const active = useRef<AbortController | null>(null);
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);
  const finisher = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTimers = () => {
    if (ticker.current) clearInterval(ticker.current);
    if (finisher.current) clearTimeout(finisher.current);
    ticker.current = null;
    finisher.current = null;
  };

  useEffect(
    () => () => {
      active.current?.abort();
      stopTimers();
    },
    [],
  );

  const analyze = useCallback(async (polygon: PolygonGeometry, name: string) => {
    active.current?.abort();
    stopTimers();
    const controller = new AbortController();
    active.current = controller;
    setProblem(null);
    setResult(null);
    setDates(null);
    setCollapsed(false);
    setRun({ progress: 3 });

    // The service answers once at the end, so these stages are paced by time, not measured.
    ticker.current = setInterval(() => {
      setRun((r) => {
        if (!r) return r;
        const step = Math.max(0.4, (PROGRESS_WHILE_WAITING - r.progress) * 0.045);
        return { progress: Math.min(PROGRESS_WHILE_WAITING, r.progress + step) };
      });
    }, TICK_MS);

    try {
      const body = { geometry: polygon, field_name: name };
      const data = await satelliteRequest<AnalysisResult>("analyze", body, controller.signal);
      stopTimers();
      setRun({ progress: 100 });
      finisher.current = setTimeout(() => {
        setRun(null);
        setResult(data);
      }, 500);
      satelliteRequest<{ dates: ClearDate[] }>("analyze-dates", { geometry: polygon }, controller.signal)
        .then((d) => setDates(d.dates))
        .catch(() => {
          /* the list of dates is extra detail; the analysis still stands without it */
        });
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      stopTimers();
      setRun(null);
      setProblem(e as SatelliteProblem);
    }
  }, []);

  const applyField = (polygon: PolygonGeometry, name?: string) => {
    const next = fieldCount + (boundary ? 1 : 0);
    const finalName = name ?? l(`Field ${next}`, `शेत ${next}`);
    if (!name) setFieldCount(next);
    setFieldName(finalName);
    setBoundary(polygon);
    void analyze(polygon, finalName);
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) return setProblem({ en: "That file is too large. Use a GeoJSON file under 2 MB.", mr: "ही फाइल खूप मोठी आहे. 2 MB पेक्षा लहान GeoJSON फाइल वापरा." });
    try {
      const parsed = polygonFromGeoJson(JSON.parse(await file.text()));
      if (!parsed) return setProblem({ en: "The file must contain exactly one field polygon.", mr: "फाइलमध्ये शेताचा एकच बहुभुज असावा." });
      applyField(parsed.polygon, parsed.name);
    } catch {
      setProblem({ en: "That file couldn’t be read as GeoJSON.", mr: "ही फाइल GeoJSON म्हणून वाचता आली नाही." });
    }
  };

  const startDrawing = () => {
    active.current?.abort();
    stopTimers();
    setRun(null);
    setProblem(null);
    mapHandle.current?.startDrawing();
  };

  const panelShown = drawPoints === null && !run;

  // keep the whole field visible above the details panel, whatever size the panel is
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setPanelInset(el.offsetHeight + 24));
    observer.observe(el);
    return () => observer.disconnect();
  }, [panelShown]);

  const stepsDone = run ? (run.progress >= 100 ? STEP_COUNT : Math.min(STEP_COUNT - 1, Math.floor((run.progress / PROGRESS_WHILE_WAITING) * STEP_COUNT))) : 0;
  const drawing = drawPoints !== null;
  const stats = result?.farm_summary.indices[index];
  const info = indexInfo(index);
  const pillButton = "inline-flex min-h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[13px] font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-40 isolate overflow-hidden bg-slate-900">
      <MapView
        ref={mapHandle}
        boundary={boundary}
        bottomInset={panelInset}
        drawTip={{
          start: l("Tap the corners of your field", "तुमच्या शेताच्या कोपऱ्यांवर दाबा"),
          next: l("Tap the next corner", "पुढच्या कोपऱ्यावर दाबा"),
          finish: l("Tap Finish when all corners are marked", "सर्व कोपरे झाल्यावर पूर्ण करा दाबा"),
        }}
        onMapReady={setMap}
        onDrawn={(p) => applyField(p)}
        onDrawPoints={setDrawPoints}
      />

      {map && result && <HeatmapLayer map={map} features={result.features} boundary={result.farm_boundary} index={index} scaleM={result.farm_summary.sample_scale_m} />}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[900] flex items-start justify-between gap-2 p-3">
        <Link href="/crop-check" aria-label={l("Back to Crop Check", "पीक तपासणीकडे परत")} className="pointer-events-auto grid size-11 shrink-0 place-items-center rounded-full bg-white text-slate-800 shadow-lg">
          <ArrowLeft size={20} />
        </Link>
        <div className="pointer-events-auto flex min-w-0 flex-wrap items-center justify-end gap-0.5 rounded-3xl bg-white p-1 shadow-lg">
          <button type="button" onClick={startDrawing} disabled={drawing} className={pillButton}>
            <Pencil size={15} /> {l("Draw Field", "शेत काढा")}
          </button>
          <button type="button" onClick={() => fileInput.current?.click()} disabled={drawing} className={pillButton}>
            <Upload size={15} /> {l("Upload GeoJSON", "GeoJSON अपलोड")}
          </button>
          <input ref={fileInput} type="file" accept=".geojson,.json,application/geo+json,application/json" onChange={onUpload} className="hidden" aria-label={l("Upload GeoJSON", "GeoJSON अपलोड")} />
          {boundary && !drawing && (
            <button type="button" onClick={() => void analyze(boundary, fieldName)} disabled={!!run} className={cx(pillButton, "bg-emerald-700 text-white hover:bg-emerald-800")}>
              <Play size={14} /> {l("Analyze", "विश्लेषण")}
            </button>
          )}
          <select
            value={index}
            onChange={(e) => setIndex(e.target.value as IndexId)}
            aria-label={l("Vegetation band", "वनस्पती बँड")}
            className="min-h-10 rounded-full bg-slate-100 px-2.5 text-[13px] font-semibold text-slate-800 outline-none"
          >
            {INDICES.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {drawing && <DrawBar points={drawPoints} onCancel={() => mapHandle.current?.cancelDrawing()} onUndo={() => mapHandle.current?.undoPoint()} onFinish={() => mapHandle.current?.finishDrawing()} />}

      {panelShown && (
        <div ref={panel} className="absolute inset-x-3 bottom-6 z-[900] mx-auto max-h-[46dvh] max-w-md overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl">
          {result && stats && (
            <button type="button" onClick={() => setCollapsed((c) => !c)} aria-expanded={!collapsed} className="flex min-h-9 w-full items-center justify-between gap-2 text-left">
              <span className="min-w-0 truncate font-bold text-slate-900">
                {fieldName} · {info.name} {stats.mean === null ? "" : stats.mean.toFixed(2)}
              </span>
              <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-800">
                {collapsed ? l("Show details", "तपशील दाखवा") : l("Hide details", "तपशील लपवा")}
                {collapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>
          )}
          {problem && (
            <div className="flex gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-800" role="alert">
              <TriangleAlert size={18} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p>{tx(problem)}</p>
                {boundary && problem.retry && (
                  <button type="button" onClick={() => void analyze(boundary, fieldName)} className="mt-1.5 inline-flex min-h-9 items-center gap-1.5 font-bold underline">
                    <RotateCcw size={14} /> {l("Try again", "पुन्हा प्रयत्न करा")}
                  </button>
                )}
              </div>
            </div>
          )}

          {!boundary && !problem && (
            <div className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800">
                <Satellite size={20} />
              </span>
              <div>
                <p className="font-bold text-slate-900">{l("See your crop from space", "अवकाशातून तुमचे पीक पाहा")}</p>
                <p className="text-sm text-slate-600">{l("Zoom to your farm, tap Draw Field, and mark its corners. Satellite images from the last 90 days show which parts are doing well.", "तुमच्या शेतावर झूम करा, शेत काढा दाबा आणि कोपरे खुणा करा. गेल्या 90 दिवसांची उपग्रह छायाचित्रे शेताचा कोणता भाग चांगला आहे ते दाखवतात.")}</p>
              </div>
            </div>
          )}

          {boundary && !(collapsed && result) && (
            <label className={cx("block", (problem || result) && "mt-3")}>
              <span className="text-xs font-semibold text-slate-500">{l("Field name", "शेताचे नाव")}</span>
              <Input className={cx(inputCls, "mt-0.5 min-h-10 font-semibold")} maxLength={80} value={fieldName} onChange={(e) => setFieldName(e.target.value)} />
            </label>
          )}

          {result && stats && !collapsed && (
            <>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <p className="font-bold text-slate-900">
                  {info.name} <span className="text-sm font-normal text-slate-500">· {tx(info.about)}</span>
                </p>
              </div>
              <dl className="mt-2 grid grid-cols-4 gap-1.5 text-center">
                {(
                  [
                    [l("Average", "सरासरी"), stats.mean],
                    [l("Lowest", "किमान"), stats.min],
                    [l("Highest", "कमाल"), stats.max],
                    [l("Spread", "फरक"), stats.std],
                  ] as const
                ).map(([name, value]) => (
                  <div key={name} className="rounded-xl bg-slate-50 p-2">
                    <dt className="text-[11px] text-slate-500">{name}</dt>
                    <dd className="text-[15px] font-bold text-slate-900">{value === null ? "—" : value.toFixed(2)}</dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1">
                {legendFor(index).map((band) => (
                  <li key={band.color} className="flex items-center gap-1.5 text-xs text-slate-700">
                    <span className="size-3 shrink-0 rounded-full" style={{ background: band.color }} aria-hidden="true" />
                    <span>
                      <b>{band.label}</b> {tx(band.meaning)}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                {l(
                  `${result.farm_summary.area_hectares} hectares · ${result.farm_summary.sample_count} points every ${result.farm_summary.sample_scale_m} m · Median of ${result.farm_summary.scene_count} Sentinel-2 scenes, ${date(result.farm_summary.date_from)} to ${date(result.farm_summary.date_to)}.`,
                  `${result.farm_summary.area_hectares} हेक्टर · दर ${result.farm_summary.sample_scale_m} मीटरवर ${result.farm_summary.sample_count} बिंदू · ${date(result.farm_summary.date_from)} ते ${date(result.farm_summary.date_to)} मधील ${result.farm_summary.scene_count} सेंटिनेल-2 छायाचित्रांचा मध्यक.`,
                )}
                {dates && dates.length > 0 && <> {l(`Latest image under 60% cloud: ${date(dates[0].date)}.`, `60% पेक्षा कमी ढग असलेले ताजे छायाचित्र: ${date(dates[0].date)}.`)}</>}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{l("A 90-day view, not today’s condition. Walk the field before acting on it.", "हे 90 दिवसांचे चित्र आहे, आजची स्थिती नाही. निर्णय घेण्यापूर्वी शेत प्रत्यक्ष पाहा.")}</p>
            </>
          )}
        </div>
      )}

      {run && <LoadingOverlay fieldName={fieldName} progress={run.progress} stepsDone={stepsDone} />}
    </div>
  );
}
