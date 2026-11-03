"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CheckCheck, ChevronRight, CloudRain, Copy, Droplets, Plus, Sprout, TriangleAlert } from "lucide-react";
import { useFarm } from "@/components/myfarm/ui";
import { SpeakButton } from "@/components/speech";
import { Button, Card, Note, PageHeader, cx } from "@/components/ui";
import { drynessLevel, drynessLines, readMoisture, readRain, type DrynessLevel, type DrynessResult } from "@/lib/dryness";
import { cropEntry } from "@/lib/crops";
import { fieldReadiness, type Side } from "@/lib/fieldHealth";
import { satelliteRequest, type SatelliteProblem } from "@/lib/satellite";
import type { FarmCrop } from "@/lib/types";
import { copyText } from "@/lib/copy";

// Leaflet needs the browser, so the map can't be rendered on the server.
const DrynessMap = dynamic(() => import("./DrynessMap"), { ssr: false, loading: () => <div className="h-64 rounded-2xl bg-slate-900" aria-busy="true" /> });

/** Existing schemes that can help in a dry year, and how. */
const HELPFUL = [
  { id: "pmfby", en: "Crop insurance against drought loss", mr: "दुष्काळातील पीक नुकसानीसाठी पीक विमा" },
  { id: "pmksy-pdmc", en: "Drip and sprinkler, to use less water", mr: "कमी पाणी वापरासाठी ठिबक व तुषार सिंचन" },
  { id: "kcc", en: "Crop loan for farming costs", mr: "शेती खर्चासाठी पीक कर्ज" },
];

const SIDE_TEXT: Record<Side, { en: string; mr: string }> = {
  north: { en: "mostly on the north side", mr: "बहुतेक उत्तर बाजूला" },
  north_east: { en: "mostly towards the north-east", mr: "बहुतेक उत्तर-पूर्व बाजूला" },
  east: { en: "mostly on the east side", mr: "बहुतेक पूर्व बाजूला" },
  south_east: { en: "mostly towards the south-east", mr: "बहुतेक दक्षिण-पूर्व बाजूला" },
  south: { en: "mostly on the south side", mr: "बहुतेक दक्षिण बाजूला" },
  south_west: { en: "mostly towards the south-west", mr: "बहुतेक दक्षिण-पश्चिम बाजूला" },
  west: { en: "mostly on the west side", mr: "बहुतेक पश्चिम बाजूला" },
  north_west: { en: "mostly towards the north-west", mr: "बहुतेक उत्तर-पश्चिम बाजूला" },
  scattered: { en: "scattered around the field", mr: "शेतात इकडे-तिकडे" },
};

/** The way in from the Schemes page. */
export function DrynessEntry() {
  const { l } = useFarm();
  return (
    <Link href="/schemes/dryness" className="mb-3 flex min-h-16 items-center gap-3 rounded-2xl border border-gold/60 bg-gold-100/50 p-3.5">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-[#6b4708]" aria-hidden="true">
        <Droplets size={22} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold text-ink">{l("Field Dryness Check", "शेताची कोरडेपणा तपासणी")}</span>
        <span className="block text-sm text-muted">{l("See on a map which parts of your field are drier than usual, and which schemes can help.", "शेताचा कोणता भाग नेहमीपेक्षा कोरडा आहे ते नकाशावर पाहा, आणि कोणत्या योजना मदत करू शकतात ते जाणून घ्या.")}</span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-muted" />
    </Link>
  );
}

const TONES: Record<DrynessLevel, string> = {
  unknown: "bg-slate-50 text-slate-900",
  usual: "bg-emerald-50 text-emerald-950",
  drier: "bg-amber-50 text-amber-950",
  much_drier: "bg-rose-50 text-rose-950",
  area_short: "bg-amber-50 text-amber-950",
  area_usual: "bg-slate-50 text-slate-900",
};
const MARKS: Record<DrynessLevel, string> = { unknown: "bg-slate-500", usual: "bg-emerald-600", drier: "bg-amber-500", much_drier: "bg-rose-600", area_short: "bg-amber-500", area_usual: "bg-slate-500" };

/** Pick a field, see how dry it is against its own past years on a heat map, and find schemes that can help. */
export default function FieldDryness() {
  const { state, l, tx, cropTitle } = useFarm();
  const [cropId, setCropId] = useState<string | null>(null);
  const crops = state.myFarmCrops;
  const picked = crops.find((c) => c.id === cropId && c.boundary);

  return (
    <div className="pb-16">
      <PageHeader back="/schemes" title={l("Field Dryness Check", "शेताची कोरडेपणा तपासणी")} sub={l("Is your field drier than it usually is at this time of year?", "वर्षाच्या या वेळी असते त्यापेक्षा तुमचे शेत जास्त कोरडे आहे का?")} />

      <div className="space-y-1.5">
        {crops.map((fc) => {
          const label = (
            <>
              <span className="text-xl" aria-hidden="true">
                {cropEntry(fc.cropId)?.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold text-ink">{tx(fc.plotName) || cropTitle(fc)}</span>
                <span className="block text-xs font-semibold text-leaf-800">{fc.boundary ? l("Check dryness", "कोरडेपणा तपासा") : l("Mark this field first", "आधी या शेताच्या खुणा करा")}</span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-muted" />
            </>
          );
          const row = cx("flex min-h-14 w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left", picked?.id === fc.id ? "bg-leaf-50 ring-2 ring-leaf-700" : "bg-leaf-50");
          return fc.boundary ? (
            <button key={fc.id} type="button" onClick={() => setCropId(fc.id)} aria-pressed={picked?.id === fc.id} className={row}>
              {label}
            </button>
          ) : (
            <Link key={fc.id} href={`/crops/my/${fc.id}/field`} className={row}>
              {label}
            </Link>
          );
        })}
        {crops.length === 0 && (
          <Link href="/crops/new" className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-leaf-700 px-3 text-sm font-bold text-white">
            <Plus size={16} /> {l("Add your crop to My Farm first", "आधी तुमचे पीक माझ्या शेतीत जोडा")}
          </Link>
        )}
      </div>

      {picked && <DrynessCheck key={picked.id} fc={picked} />}

      <h2 className="mt-5 font-bold text-ink">{l("Schemes that can help", "मदत करू शकणाऱ्या योजना")}</h2>
      <div className="mt-2 space-y-1.5">
        {HELPFUL.map((help) => {
          const scheme = state.schemes.find((s) => s.id === help.id && s.status !== "archived");
          return (
            scheme && (
              <Link key={help.id} href={`/schemes/${help.id}`} className="flex min-h-14 items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2">
                <span className="min-w-0 flex-1">
                  <span className="block font-bold leading-snug text-ink">{tx(scheme.name)}</span>
                  <span className="block text-xs text-muted">{l(help.en, help.mr)}</span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-muted" />
              </Link>
            )
          );
        })}
      </div>

      <div className="mt-4">
        <Note>{l("Only the government declares a drought and decides relief. Ask your Talathi or Taluka Agriculture Office whether any relief applies to your village.", "दुष्काळ जाहीर करणे व मदत ठरवणे हे फक्त शासनच करते. तुमच्या गावाला कोणती मदत लागू आहे का, हे तलाठी किंवा तालुका कृषी कार्यालयाकडे विचारा.")}</Note>
      </div>
    </div>
  );
}

function DrynessCheck({ fc }: { fc: FarmCrop }) {
  const { l, tx, num, short, today, toast } = useFarm();
  const [result, setResult] = useState<DrynessResult | null>(null);
  const [problem, setProblem] = useState<SatelliteProblem | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [copied, setCopied] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const boundary = fc.boundary;

  useEffect(() => {
    if (!boundary) return;
    const controller = new AbortController();
    setResult(null);
    setProblem(null);
    satelliteRequest<DrynessResult>("dryness", { geometry: boundary }, controller.signal)
      .then(setResult)
      .catch((e) => {
        if (!(e instanceof DOMException && e.name === "AbortError")) setProblem(e as SatelliteProblem);
      });
    panel.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return () => controller.abort();
  }, [boundary, attempt]);

  if (problem)
    return (
      <div role="alert" className="mt-3 flex gap-2 rounded-xl bg-soil-100 p-3 text-sm text-soil">
        <TriangleAlert size={18} className="mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p>{tx(problem)}</p>
          {problem.retry && (
            <button type="button" onClick={() => setAttempt((n) => n + 1)} className="mt-1 min-h-10 font-bold underline">
              {l("Try again", "पुन्हा प्रयत्न करा")}
            </button>
          )}
        </div>
      </div>
    );

  if (!result)
    return (
      <div ref={panel}>
        <Card className="mt-3 text-center">
          <div role="status" aria-live="polite">
            <span className="mx-auto block size-10 animate-spin rounded-full border-4 border-leaf-50 border-t-leaf-700" aria-hidden="true" />
            <p className="mt-3 font-bold text-ink">{l("Comparing with past years…", "मागील वर्षांशी तुलना करत आहे…")}</p>
            <p className="mt-1 text-sm text-muted">{l("This can take up to two minutes. Please wait.", "याला दोन मिनिटांपर्यंत वेळ लागू शकतो. कृपया थांबा.")}</p>
          </div>
        </Card>
      </div>
    );

  // a young or absent crop has low moisture because of bare soil, not because of drought
  const standing = fieldReadiness(fc, today).kind === "ready";
  const moisture = readMoisture(result, standing);
  const rain = readRain(result.rain);
  const level = drynessLevel(moisture, rain);
  const compared = moisture.kind === "usual" || moisture.kind === "drier" || moisture.kind === "much_drier";

  const title = {
    unknown: l("Can’t compare this field yet", "या शेताची अजून तुलना करता येत नाही"),
    usual: l("This field is not drier than usual", "हे शेत नेहमीपेक्षा जास्त कोरडे नाही"),
    drier: l("This field is drier than usual", "हे शेत नेहमीपेक्षा कोरडे आहे"),
    much_drier: l("This field is much drier than usual", "हे शेत नेहमीपेक्षा खूप कोरडे आहे"),
    area_short: l("Rain has been short in your area", "तुमच्या भागात पाऊस कमी झाला आहे"),
    area_usual: l("Rain in your area is close to usual", "तुमच्या भागात पाऊस नेहमीइतका आहे"),
  }[level];

  const moistureLine = (n: (x: number) => string) => {
    if (moisture.kind === "unusable") return l("This field: not compared, because there is no grown crop on it now.", "हे शेत: तुलना केली नाही, कारण सध्या त्यात वाढलेले पीक नाही.");
    if (moisture.kind === "no_history") return l("This field: too few clear photos from past years to compare.", "हे शेत: तुलनेसाठी मागील वर्षांची स्पष्ट छायाचित्रे खूप कमी आहेत.");
    const parts = Math.round(moisture.drierShare * 10);
    const side = SIDE_TEXT[moisture.side];
    if (parts === 0) return l(`This field: moisture is about usual everywhere, compared with the last ${n(moisture.years)} years.`, `हे शेत: मागील ${n(moisture.years)} वर्षांच्या तुलनेत ओलावा सगळीकडे नेहमीसारखा आहे.`);
    return l(`This field: about ${n(parts)} ${parts === 1 ? "part" : "parts"} in ${n(10)} ${parts === 1 ? "is" : "are"} drier than usual, ${side.en}, compared with the last ${n(moisture.years)} years.`, `हे शेत: मागील ${n(moisture.years)} वर्षांच्या तुलनेत साधारण ${n(10)} पैकी ${n(parts)} भाग नेहमीपेक्षा कोरडे आहेत, ${side.mr}.`);
  };
  const rainLine = (n: (x: number) => string) => {
    if (!result.rain || rain.kind === "unknown") return l("Rain in your area: data is not available right now.", "तुमच्या भागातील पाऊस: माहिती सध्या उपलब्ध नाही.");
    if (rain.kind === "dry_season") return l("Rain in your area: this is the dry season, so little rain is normal.", "तुमच्या भागातील पाऊस: हा कोरडा हंगाम आहे, त्यामुळे कमी पाऊस सामान्य आहे.");
    const to = short(result.rain.to);
    const { mm, normal_mm: usual } = result.rain;
    if (rain.kind === "normal") return l(`Rain in your area: close to usual or more in the ${n(3)} months up to ${to} (${n(mm)} mm, usually ${n(usual)} mm).`, `तुमच्या भागातील पाऊस: ${to} पर्यंतच्या ${n(3)} महिन्यांत नेहमीइतका किंवा जास्त (${n(mm)} मिमी, नेहमी ${n(usual)} मिमी).`);
    return l(`Rain in your area: ${n(Math.abs(rain.departure))}% less than usual in the ${n(3)} months up to ${to} (${n(mm)} mm, usually ${n(usual)} mm).`, `तुमच्या भागातील पाऊस: ${to} पर्यंतच्या ${n(3)} महिन्यांत नेहमीपेक्षा ${n(Math.abs(rain.departure))}% कमी (${n(mm)} मिमी, नेहमी ${n(usual)} मिमी).`);
  };
  const next = level === "drier" || level === "much_drier" ? l("Go and look at the red and yellow parts and your water source. Tell your Krishi Sahayak if your crop is suffering.", "लाल व पिवळे भाग आणि पाण्याचा स्रोत जाऊन पाहा. पिकाला त्रास होत असेल तर कृषी सहाय्यकाला सांगा.") : level === "area_short" ? l("Plan your water carefully. This is about your area, not this field.", "पाण्याचे काळजीपूर्वक नियोजन करा. ही माहिती तुमच्या भागाची आहे, या शेताची नव्हे.") : "";
  const limits = l("This compares each part of your field with itself in past years, which may have grown other crops. Irrigation also changes it. It is an early sign, not a drought declaration.", "ही तुमच्या शेताच्या प्रत्येक भागाची स्वतःच्याच मागील वर्षांशी तुलना आहे, त्या वर्षी वेगळी पिके असू शकतात. सिंचनामुळेही फरक पडतो. हा एक प्राथमिक संकेत आहे, दुष्काळ जाहीर झाल्याचे नव्हे.");

  const copy = async () => {
    try {
      const heading = [`Plot: ${tx(fc.plotName) || "My field"}`, `Area: ${fc.areaAcres} acres`, `Date of check: ${today}`, ""];
      await copyText([...heading, ...drynessLines(result, moisture, rain)].join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast(l("Failed to copy. Please try again.", "कॉपी करता आले नाही. पुन्हा प्रयत्न करा."));
    }
  };

  const plain = (x: number) => String(x);
  const shownNum = (x: number) => num(x);
  const legend: [string, string][] = compared
    ? [
        ["bg-emerald-600", l("Usual or wetter", "नेहमीसारखे किंवा ओले")],
        ["bg-amber-500", l("A bit drier", "थोडे कोरडे")],
        ["bg-rose-600", l("Much drier", "खूप कोरडे")],
      ]
    : [
        ["bg-rose-600", l("Dry now", "सध्या कोरडे")],
        ["bg-amber-500", l("Some moisture", "थोडा ओलावा")],
        ["bg-emerald-600", l("Moist now", "सध्या ओले")],
      ];

  return (
    <div className="mt-3">
      <div className={cx("rounded-2xl p-3.5", TONES[level])}>
        <div className="flex items-center gap-3">
          <span className={cx("grid size-12 shrink-0 place-items-center rounded-full text-white", MARKS[level])} aria-hidden="true">
            {level === "usual" ? <Sprout size={26} /> : level === "unknown" || level === "area_usual" ? <CloudRain size={26} /> : <TriangleAlert size={26} />}
          </span>
          <p className="min-w-0 flex-1 text-[19px] font-bold leading-snug">{title}</p>
          <SpeakButton id={`dryness:${fc.id}`} text={[`${title}.`, moistureLine(plain), rainLine(plain), next, limits].filter(Boolean).join(" ")} size="sm" className="bg-white text-slate-800" />
        </div>
      </div>

      {result.features.length > 0 && (
        <div className="mt-2">
          <DrynessMap result={result} compared={compared} />
          <p className="mt-1.5 text-center text-[13px] font-semibold text-ink">{compared ? l("Each part compared with its own past years", "प्रत्येक भागाची स्वतःच्या मागील वर्षांशी तुलना") : l("Moisture as it is now, not compared with the past", "सध्याचा ओलावा, मागील वर्षांशी तुलना नाही")}</p>
          <ul className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-700">
            {legend.map(([mark, name]) => (
              <li key={name} className="flex items-center gap-1">
                <span className={cx("size-3 rounded-full", mark)} aria-hidden="true" /> {name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="mt-3 space-y-1.5 text-[15px] leading-snug text-ink">
        <li className="flex gap-2">
          <Droplets size={18} className="mt-0.5 shrink-0 text-leaf-700" aria-hidden="true" /> <span>{moistureLine(shownNum)}</span>
        </li>
        <li className="flex gap-2">
          <CloudRain size={18} className="mt-0.5 shrink-0 text-leaf-700" aria-hidden="true" /> <span>{rainLine(shownNum)}</span>
        </li>
      </ul>
      {next && <p className="mt-2 text-[15px] font-semibold leading-snug text-ink">{next}</p>}

      <p className="mt-2 text-[13px] leading-snug text-muted">{limits}</p>
      <p className="mt-1 text-[13px] leading-snug text-muted">{l(`Field moisture from satellite photos of ${short(result.from)} to ${short(result.to)}.`, `शेतातील ओलावा ${short(result.from)} ते ${short(result.to)} या काळातील उपग्रह छायाचित्रांवरून.`)}</p>

      {result.past.length > 0 && (
        <details className="mt-2 text-sm">
          <summary className="min-h-10 cursor-pointer font-semibold text-leaf-800">{l("See the numbers (for officers)", "आकडे पाहा (अधिकाऱ्यांसाठी)")}</summary>
          <table className="mt-1 w-full text-left text-xs">
            <thead>
              <tr className="text-muted">
                <th className="py-1 font-semibold">{l("Same dates in", "याच तारखा, वर्ष")}</th>
                <th className="py-1 text-right font-semibold">{l("Field average moisture (NDMI)", "शेताचा सरासरी ओलावा (NDMI)")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-line font-bold">
                <td className="py-1">{l("This year", "हे वर्ष")}</td>
                <td className="py-1 text-right">{num(result.current.ndmi, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
              {result.past.map((p) => (
                <tr key={p.year} className="border-t border-line">
                  <td className="py-1">{num(p.year, { useGrouping: false })}</td>
                  <td className="py-1 text-right">{num(p.ndmi, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}

      <Button full variant="secondary" className="mt-2 min-h-12" onClick={copy}>
        {copied ? <CheckCheck size={18} /> : <Copy size={18} />} {copied ? l("Copied", "कॉपी झाले") : l("Copy for Mitra or officer", "मित्र किंवा अधिकाऱ्यासाठी कॉपी करा")}
      </Button>
    </div>
  );
}
