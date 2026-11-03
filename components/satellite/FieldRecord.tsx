"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, CheckCheck, Cloud, Copy, Pencil, RefreshCw, TriangleAlert } from "lucide-react";
import { useFarm } from "@/components/myfarm/ui";
import { SpeakButton } from "@/components/speech";
import { Button, Card, Note, PageHeader, cx } from "@/components/ui";
import { fieldStart } from "@/lib/fieldHealth";
import { addDays } from "@/lib/lifecycle";
import { lastStageStart, readFieldHistory, recordLines } from "@/lib/fieldHistory";
import { satelliteRequest, type HistoryPeriod, type SatelliteProblem } from "@/lib/satellite";
import type { CropInfo, FarmCrop } from "@/lib/types";
import { copyText } from "@/lib/copy";

/** Bars are drawn against this greenness, near the top of what a dense crop reaches. */
const CHART_TOP = 0.8;
const MIN_BAR_PERCENT = 4;
/** An orchard can be many years old; the record covers its last year, which is all the service accepts. */
const RECORD_MAX_DAYS = 365;
const latestDate = (a: string, b: string) => (a > b ? a : b);

/** A field's season seen from the satellite, to show a Mitra, an insurer or an agriculture officer. */
export default function FieldRecord({ fc, crop, back }: { fc: FarmCrop; crop: CropInfo; back: string }) {
  const { l, tx, short, today, cropTitle, saveFieldHistory, toast } = useFarm();
  const [running, setRunning] = useState(false);
  const [problem, setProblem] = useState<SatelliteProblem | null>(null);
  const [copied, setCopied] = useState(false);
  const active = useRef<AbortController | null>(null);

  const start = fieldStart(fc);
  const history = fc.fieldHistory ?? null;
  const boundary = fc.boundary ?? null;

  const fetchHistory = useCallback(async () => {
    if (!boundary || !start) return;
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    setProblem(null);
    setRunning(true);
    try {
      const { periods } = await satelliteRequest<{ periods: HistoryPeriod[] }>("field-history", { geometry: boundary, start_date: latestDate(start, addDays(fc.harvestedOn ?? today, -RECORD_MAX_DAYS)), end_date: fc.harvestedOn }, controller.signal);
      saveFieldHistory(fc.id, { fetchedOn: today, periods });
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setProblem(e as SatelliteProblem);
    }
    if (active.current === controller) setRunning(false);
    // saveFieldHistory changes every render; only what is sent to the service matters here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundary, start, fc.id, fc.harvestedOn, today]);

  // the first visit builds the record; after that it opens straight away from what was saved
  const firstVisit = useRef(!history);
  useEffect(() => {
    if (firstVisit.current) void fetchHistory();
    return () => active.current?.abort();
  }, [fetchHistory]);

  const reading = history ? readFieldHistory(history, lastStageStart(fc, crop)) : null;

  const copy = async () => {
    if (!history || !reading) return;
    const heading = [`Crop: ${crop.name.en}`, `Plot: ${tx(fc.plotName) || "My field"}`, `Area: ${fc.areaAcres} acres`, `Sowing date: ${fc.sowingDate ?? "Not recorded"}`, ""];
    try {
      await copyText([...heading, ...recordLines(fc, history, reading)].join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast(l("Failed to copy. Please try again.", "कॉपी करता आले नाही. पुन्हा प्रयत्न करा."));
    }
  };

  const message = () => {
    if (!reading || reading.kind === "too_few")
      return {
        title: l("Too few clear photos so far", "आतापर्यंत स्पष्ट छायाचित्रे खूप कमी आहेत"),
        body: l("Clouds hid the field too often, or the crop is still new. Look again after some days.", "ढगांमुळे शेत वारंवार झाकले गेले, किंवा पीक अजून नवीन आहे. काही दिवसांनी पुन्हा पाहा."),
      };
    if (reading.kind === "steady")
      return {
        title: l("No sudden fall in greenness", "हिरवेपणात अचानक घट दिसत नाही"),
        body: l("The satellite did not see this field’s greenness fall sharply this season.", "या हंगामात या शेताचा हिरवेपणा एकदम कमी झालेला उपग्रहाला दिसला नाही."),
      };
    const from = short(reading.before.from);
    const to = short(reading.after.to);
    return {
      title: l(`Greenness fell between ${from} and ${to}`, `${from} ते ${to} दरम्यान हिरवेपणा कमी झाला`),
      body: reading.nearHarvest
        ? l("This was close to harvest, when a fall can be normal.", "हे काढणीच्या जवळ होते, तेव्हा हिरवेपणा कमी होणे सामान्य असू शकते.")
        : l("If your crop suffered a loss then, tell your Krishi Sahayak or insurance company and ask about the reporting deadline.", "त्या काळात पिकाचे नुकसान झाले असेल, तर कृषी सहाय्यकाला किंवा विमा कंपनीला सांगा आणि नोंदीची अंतिम मुदत विचारा."),
    };
  };
  const shown = message();
  const limits = l("This is for your own reference. It shows what the satellite saw, not the cause. It does not prove damage or decide insurance.", "ही नोंद तुमच्या संदर्भासाठी आहे. उपग्रहाला काय दिसले ते यात आहे, कारण नाही. यावरून नुकसान सिद्ध होत नाही किंवा विमा ठरत नाही.");

  return (
    <div className="pb-16">
      <PageHeader back={back} title={l("Season record of your field", "तुमच्या शेताची हंगामाची नोंद")} sub={`${crop.emoji} ${tx(fc.plotName) || cropTitle(fc)}`} />

      {!boundary && (
        <Card>
          <p className="font-bold text-ink">{l("Mark your field first", "आधी तुमच्या शेताच्या खुणा करा")}</p>
          <p className="mt-1 text-sm text-muted">{l("The record needs to know where your field is. You only do this once.", "तुमचे शेत कुठे आहे हे नोंदीसाठी माहीत असावे लागते. हे एकदाच करायचे आहे.")}</p>
          <Link href={`/crops/my/${fc.id}/field`} className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-leaf-700 font-bold text-white">
            <Pencil size={16} /> {l("Mark my field", "माझ्या शेताच्या खुणा करा")}
          </Link>
        </Card>
      )}

      {boundary && !start && <Note>{l("The record starts after sowing. Record your sowing date first.", "नोंद पेरणीनंतर सुरू होते. आधी पेरणीची तारीख नोंदवा.")}</Note>}

      {running && !history && (
        <Card className="text-center">
          <div role="status" aria-live="polite">
            <span className="mx-auto block size-10 animate-spin rounded-full border-4 border-leaf-50 border-t-leaf-700" aria-hidden="true" />
            <p className="mt-3 font-bold text-ink">{l("Gathering this season’s satellite photos…", "या हंगामाची उपग्रह छायाचित्रे गोळा करत आहे…")}</p>
            <p className="mt-1 text-sm text-muted">{l("This can take up to two minutes. Please wait.", "याला दोन मिनिटांपर्यंत वेळ लागू शकतो. कृपया थांबा.")}</p>
          </div>
        </Card>
      )}

      {problem && (
        <div role="alert" className="mb-3 flex gap-2 rounded-xl bg-soil-100 p-3 text-sm text-soil">
          <TriangleAlert size={18} className="mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p>{tx(problem)}</p>
            {problem.retry && (
              <button type="button" onClick={() => void fetchHistory()} className="mt-1 min-h-10 font-bold underline">
                {l("Try again", "पुन्हा प्रयत्न करा")}
              </button>
            )}
          </div>
        </div>
      )}

      {history && reading && (
        <>
          <Card>
            <div className="flex items-start gap-3">
              <p className="min-w-0 flex-1 text-[19px] font-bold leading-snug text-ink">{shown.title}</p>
              <SpeakButton id={`field-record:${fc.id}`} text={`${shown.title}. ${shown.body} ${limits}`} size="sm" />
            </div>
            <p className="mt-1 text-[15px] leading-snug text-ink">{shown.body}</p>
          </Card>

          <SeasonChart periods={history.periods} fallAfter={reading.kind === "fall" ? reading.after : null} />

          <Note>{limits}</Note>

          <div className="mt-3 grid gap-2">
            <Button full className="min-h-12" onClick={copy}>
              {copied ? <CheckCheck size={18} /> : <Copy size={18} />} {copied ? l("Copied", "कॉपी झाले") : l("Copy record for Mitra or officer", "मित्र किंवा अधिकाऱ्यासाठी नोंद कॉपी करा")}
            </Button>
            {history.fetchedOn !== today && !fc.harvestedOn && (
              <Button full variant="secondary" className="min-h-12" disabled={running} onClick={() => void fetchHistory()}>
                <RefreshCw size={16} className={cx(running && "animate-spin")} /> {running ? l("Updating… up to two minutes", "अद्ययावत करत आहे… दोन मिनिटांपर्यंत") : l("Update with new photos", "नवीन छायाचित्रांसह अद्ययावत करा")}
              </Button>
            )}
          </div>
          <p className="mt-2 text-xs text-muted">{l(`Record prepared on ${short(history.fetchedOn)}. Field boundary marked by you. Sentinel-2 satellite.`, `नोंद ${short(history.fetchedOn)} रोजी तयार केली. शेताच्या खुणा तुम्ही केल्या. सेंटिनेल-2 उपग्रह.`)}</p>
        </>
      )}
    </div>
  );
}

function SeasonChart({ periods, fallAfter }: { periods: HistoryPeriod[]; fallAfter: HistoryPeriod | null }) {
  const { l, short, num } = useFarm();
  const [picked, setPicked] = useState<number | null>(null);
  const current = picked === null ? null : periods[picked];
  const value = (n: number) => num(n, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Card className="mt-3">
      <h2 className="font-bold text-ink">{l("How green the field was", "शेत किती हिरवे होते")}</h2>
      <p className="min-h-10 text-sm text-muted" aria-live="polite">
        {current
          ? `${short(current.from)} – ${short(current.to)}: ${current.ndvi === null ? l("clouds, no clear photo", "ढग, स्पष्ट छायाचित्र नाही") : `${l("greenness", "हिरवेपणा")} ${value(current.ndvi)}`}`
          : l("Taller bars mean greener. Tap a bar to see its dates.", "उंच खांब म्हणजे जास्त हिरवे. तारखा पाहण्यासाठी खांबावर दाबा.")}
      </p>
      <div className="mt-1 flex h-36 items-end gap-0.5 border-b border-line">
        {periods.map((p, i) => {
          const height = p.ndvi === null ? 0 : Math.max(MIN_BAR_PERCENT, Math.min(100, (p.ndvi / CHART_TOP) * 100));
          const isFall = fallAfter?.from === p.from;
          return (
            <button key={p.from} type="button" onClick={() => setPicked(i)} aria-pressed={picked === i} aria-label={`${short(p.from)} – ${short(p.to)}`} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end">
              {isFall && <ArrowDown size={14} className="mb-0.5 shrink-0 text-ink" aria-hidden="true" />}
              {p.ndvi === null ? <Cloud size={13} className="mb-1 shrink-0 text-muted" aria-hidden="true" /> : <span className={cx("block w-full max-w-5 rounded-t", picked === i ? "bg-leaf-900" : "bg-leaf-600")} style={{ height: `${height}%` }} />}
            </button>
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-xs text-muted">
        <span>{short(periods[0].from)}</span>
        <span>{short(periods[periods.length - 1].to)}</span>
      </div>
      <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1"><Cloud size={12} aria-hidden="true" /> {l("Clouds, no clear photo", "ढग, स्पष्ट छायाचित्र नाही")}</span>
        {fallAfter && <span className="inline-flex items-center gap-1"><ArrowDown size={12} aria-hidden="true" /> {l("Greenness fell", "हिरवेपणा कमी झाला")}</span>}
      </p>

      <details className="mt-2 text-sm">
        <summary className="min-h-10 cursor-pointer font-semibold text-leaf-800">{l("See the numbers (for officers)", "आकडे पाहा (अधिकाऱ्यांसाठी)")}</summary>
        <table className="mt-1 w-full text-left text-xs">
          <thead>
            <tr className="text-muted">
              <th className="py-1 font-semibold">{l("Dates", "तारखा")}</th>
              <th className="py-1 text-right font-semibold">{l("Greenness (NDVI)", "हिरवेपणा (NDVI)")}</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((p) => (
              <tr key={p.from} className="border-t border-line">
                <td className="py-1">{short(p.from)} – {short(p.to)}</td>
                <td className="py-1 text-right font-semibold">{p.ndvi === null ? l("Cloud", "ढग") : value(p.ndvi)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </Card>
  );
}
