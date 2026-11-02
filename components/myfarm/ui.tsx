"use client";

import { useEffect, useState } from "react";
import { Bug, Check, ChevronDown, CircleDot, Droplets, Eye, FlaskConical, Scissors, ShieldCheck, Shovel, SkipForward, Sprout, TriangleAlert, Wheat, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { getCrop } from "@/lib/crops";
import { todayISO, type DueTask, type SprayStatus, type TaskOccurrence } from "@/lib/lifecycle";
import type { ActivityType, CropStage, FarmCrop } from "@/lib/types";
import { Badge, Button, Field, cx, inputCls } from "../ui";
import { Input, ReadAloud, TextArea } from "../voice";

type B = { en: string; mr: string };

export const ACTIVITY: Record<ActivityType, { label: B; icon: React.ReactNode; tone: string }> = {
  sowing: { label: { en: "Sowing", mr: "पेरणी" }, icon: <Sprout size={22} />, tone: "bg-leaf-100 text-leaf-700" },
  transplanting: { label: { en: "Transplanting", mr: "पुनर्लागवड" }, icon: <Shovel size={22} />, tone: "bg-leaf-100 text-leaf-700" },
  irrigation: { label: { en: "Irrigation", mr: "पाणी" }, icon: <Droplets size={22} />, tone: "bg-[#e3ecf5] text-[#28507a]" },
  fertiliser: { label: { en: "Fertiliser", mr: "खत" }, icon: <FlaskConical size={22} />, tone: "bg-gold-100 text-gold" },
  pesticide: { label: { en: "Pesticide", mr: "कीटकनाशक" }, icon: <Bug size={22} />, tone: "bg-soil-100 text-soil" },
  fungicide: { label: { en: "Fungicide", mr: "बुरशीनाशक" }, icon: <ShieldCheck size={22} />, tone: "bg-soil-100 text-soil" },
  weeding: { label: { en: "Weeding", mr: "खुरपणी" }, icon: <Scissors size={22} />, tone: "bg-leaf-100 text-leaf-700" },
  observation: { label: { en: "Observation", mr: "पाहणी" }, icon: <Eye size={22} />, tone: "bg-sand text-ink" },
  harvest: { label: { en: "Harvest", mr: "काढणी" }, icon: <Wheat size={22} />, tone: "bg-gold-100 text-gold" },
  other: { label: { en: "Other", mr: "इतर" }, icon: <CircleDot size={22} />, tone: "bg-sand text-ink" },
};

/** Task types whose "Done" opens the log sheet, so the record stays accurate. */
export const LOG_ON_DONE: ActivityType[] = ["irrigation", "fertiliser", "pesticide", "fungicide", "weeding"];

export function useFarm() {
  const store = useStore();
  const today = todayISO();
  const cropOf = (fc: Pick<FarmCrop, "cropId">) => getCrop(fc.cropId);
  /** "Onion · N-2-4-1" */
  const cropTitle = (fc: FarmCrop) => {
    const c = cropOf(fc);
    const v = store.tx(fc.variety);
    return `${c ? store.tx(c.name) : fc.cropId}${v ? ` · ${v}` : ""}`;
  };
  /** "12 Mar" (short, no year) */
  const short = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(store.state.lang === "mr" ? "mr-IN" : "en-IN", { day: "numeric", month: "short" });
  };
  const ago = (days: number) => (days <= 0 ? store.l("today", "आज") : days === 1 ? store.l("yesterday", "काल") : store.l(`${days} days ago`, `${days} दिवसांपूर्वी`));
  return { ...store, today, cropOf, cropTitle, short, ago };
}

export function NotVerified() {
  const { l } = useStore();
  return <Badge tone="gold">{l("Not yet verified — general guidance", "अजून पडताळलेले नाही — सर्वसाधारण मार्गदर्शन")}</Badge>;
}

/** One task with Done and Skip. */
export function TaskRow({ o, fc, showCrop, onLog }: { o: DueTask | TaskOccurrence; fc: FarmCrop; showCrop?: boolean; onLog: (o: TaskOccurrence) => void }) {
  const { tx, l, short, cropOf, setTaskState } = useFarm();
  const crop = cropOf(fc);
  const overdue = "overdue" in o && o.overdue;
  const a = ACTIVITY[o.task.type];
  return (
    <div className={cx("rounded-2xl border bg-white p-3", overdue ? "border-soil/40" : "border-line")}>
      <div className="flex items-start gap-3">
        <span className={cx("grid size-12 shrink-0 place-items-center rounded-2xl", a.tone)} aria-hidden>
          {a.icon}
        </span>
        <div className="min-w-0 flex-1">
          {showCrop && crop && (
            <p className="text-sm font-semibold text-leaf-700">
              {crop.emoji} {tx(crop.name)}
              {tx(fc.plotName) ? ` · ${tx(fc.plotName)}` : ""}
            </p>
          )}
          <p className="text-[17px] font-bold leading-snug">{tx(o.task.title)}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-sm text-muted">
            {overdue ? <Badge tone="soil">{l(`Overdue · ${short(o.date)}`, `राहिलेले · ${short(o.date)}`)}</Badge> : <span>{short(o.date)}</span>}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <Button className="min-h-12" onClick={() => (LOG_ON_DONE.includes(o.task.type) ? onLog(o) : setTaskState(fc.id, o.key, "done"))}>
          <Check size={20} /> {l("Done", "झाले")}
        </Button>
        <Button variant="secondary" className="min-h-12 px-4" onClick={() => setTaskState(fc.id, o.key, "skipped")} aria-label={l(`Skip ${o.task.title.en}`, `${o.task.title.mr} वगळा`)}>
          <SkipForward size={18} /> {l("Skip", "वगळा")}
        </Button>
      </div>
    </div>
  );
}

/** Vertical stage timeline. With dates for a farmer's crop, or "Day X–Y" for the library. */
export function StageTimeline({
  stages,
  currentIndex = -1,
  daysLeft,
  harvest,
}: {
  stages: { stage: CropStage; start?: string; end?: string }[];
  currentIndex?: number;
  daysLeft?: number;
  harvest?: { earliest: string; latest: string; estimate: boolean } | null;
}) {
  const { tx, l, short } = useFarm();
  const [open, setOpen] = useState<number | null>(currentIndex >= 0 ? currentIndex : null);
  return (
    <ol className="space-y-2">
      {stages.map(({ stage, start, end }, i) => {
        const past = currentIndex >= 0 && i < currentIndex;
        const now = i === currentIndex;
        const isOpen = open === i;
        const range = start && end ? `${short(start)} – ${short(end)}` : l(`Day ${stage.startDay}–${stage.endDay}`, `दिवस ${stage.startDay}–${stage.endDay}`);
        const speech = [tx(stage.name), tx(stage.whatHappens), ...stage.tasks.map((t) => tx(t.title)), ...stage.watchFor.map((w) => tx(w))].join(". ");
        return (
          <li key={stage.key} className="relative pl-9">
            <span
              aria-hidden
              className={cx(
                "absolute left-0 top-3.5 grid size-7 place-items-center rounded-full border-2",
                past ? "border-leaf-600 bg-leaf-600 text-white" : now ? "border-leaf-700 bg-white" : "border-line bg-white",
              )}
            >
              {past ? <Check size={14} strokeWidth={3} /> : now ? <span className="size-3 rounded-full bg-leaf-700" /> : null}
            </span>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={cx(
                "flex min-h-14 w-full items-center gap-2 rounded-2xl border p-3 text-left",
                now ? "border-leaf-700 bg-leaf-50" : "border-line bg-white",
                !now && !past && currentIndex >= 0 && "opacity-70",
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2 font-bold">
                  {tx(stage.name)}
                  {now && <Badge tone="green">{daysLeft != null ? l(`You are here · ${daysLeft} days left`, `तुम्ही येथे · ${daysLeft} दिवस बाकी`) : l("You are here", "तुम्ही येथे")}</Badge>}
                </span>
                <span className="block text-sm text-muted">{range}</span>
              </span>
              <ChevronDown size={18} className={cx("shrink-0 text-muted transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
              <div className="mt-2 rounded-2xl bg-white p-3 text-[15px] shadow-[0_1px_2px_rgba(30,42,36,0.06)]">
                <div className="flex items-start gap-2">
                  <p className="flex-1">{tx(stage.whatHappens)}</p>
                  <ReadAloud text={speech} />
                </div>
                {stage.tasks.length > 0 && (
                  <>
                    <p className="mt-2 font-semibold">{l("What to do", "काय करायचे")}</p>
                    <ul className="mt-1 space-y-1.5">
                      {stage.tasks.map((t) => (
                        <li key={t.id} className="flex gap-2">
                          <span className="mt-0.5 shrink-0 text-leaf-700" aria-hidden>
                            {ACTIVITY[t.type].icon}
                          </span>
                          <span>
                            <span className="font-semibold">{tx(t.title)}</span>
                            {t.repeatEveryDays ? <span className="text-muted"> · {l(`every ${t.repeatEveryDays} days`, `दर ${t.repeatEveryDays} दिवसांनी`)}</span> : null}
                            <span className="block text-sm text-muted">{tx(t.detail)}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {stage.watchFor.length > 0 && (
                  <>
                    <p className="mt-2 font-semibold">{l("Watch for", "लक्ष ठेवा")}</p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm">
                      {stage.watchFor.map((w, k) => (
                        <li key={k}>{tx(w)}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </li>
        );
      })}
      {harvest && (
        <li className="relative pl-9">
          <span aria-hidden className="absolute left-0 top-2.5 text-2xl">
            🌾
          </span>
          <div className="rounded-2xl border border-gold/40 bg-gold-100 p-3">
            <p className="font-bold text-[#6b4708]">{harvest.estimate ? l("Harvest window (estimate)", "काढणीचा कालावधी (अंदाज)") : l("Harvest window", "काढणीचा कालावधी")}</p>
            <p className="text-sm text-[#6b4708]">
              {short(harvest.earliest)} – {short(harvest.latest)}
            </p>
          </div>
        </li>
      )}
    </ol>
  );
}

/** Yellow/red banner from the label details of the last spray. */
export function SprayBanner({ status }: { status: SprayStatus | null }) {
  const { l, short } = useFarm();
  if (!status) return null;
  return (
    <div className="space-y-2">
      {status.warnings.map((w) => (
        <div key={w.kind} role="alert" className={cx("flex gap-2 rounded-2xl p-3 text-[15px]", w.kind === "no-phi" ? "bg-gold-100 text-[#6b4708]" : "bg-soil-100 text-soil")}>
          <TriangleAlert size={20} className="mt-0.5 shrink-0" />
          <span>
            {w.kind === "reentry"
              ? l(`Don't enter the field yet — wait until ${short(w.until)}.`, `अजून शेतात जाऊ नका — ${short(w.until)} पर्यंत थांबा.`)
              : w.kind === "phi"
                ? l(`The safe waiting period before harvest isn't over until ${short(w.until)}. Don't harvest before then.`, `काढणीपूर्वीचा सुरक्षित कालावधी ${short(w.until)} पर्यंत आहे. त्याआधी काढणी करू नका.`)
                : l(
                    "Check the product label for the waiting days before harvest, and add them to your spray record.",
                    "काढणीपूर्वी किती दिवस थांबायचे ते औषधाच्या लेबलवर पाहा आणि फवारणीच्या नोंदीत लिहा.",
                  )}
          </span>
        </div>
      ))}
    </div>
  );
}

const TYPES: ActivityType[] = ["irrigation", "fertiliser", "pesticide", "fungicide", "weeding", "observation", "sowing", "transplanting", "harvest", "other"];
const SPRAY: ActivityType[] = ["pesticide", "fungicide"];
const PRODUCT: ActivityType[] = ["fertiliser", "pesticide", "fungicide"];

/** Bottom sheet to record what was done on the farm. Never suggests products or doses. */
export function LogActivitySheet({
  fc,
  initial,
  onClose,
}: {
  fc: FarmCrop;
  initial?: { type?: ActivityType; linkedTaskId?: string };
  onClose: () => void;
}) {
  const { l, tx, today, logFarmActivity } = useFarm();
  const [type, setType] = useState<ActivityType>(initial?.type ?? "irrigation");
  const [date, setDate] = useState(today);
  const [product, setProduct] = useState("");
  const [qty, setQty] = useState("");
  const [phi, setPhi] = useState("");
  const [rei, setRei] = useState("");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});
  const earliest = fc.sowingDate ?? fc.plannedSowingDate ?? undefined;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = () => {
    const e: Record<string, string> = {};
    if (!date) e.date = l("Choose the date", "तारीख निवडा");
    else if (date > today) e.date = l("The date can't be in the future", "तारीख पुढची असू शकत नाही");
    else if (fc.sowingDate && date < fc.sowingDate && type !== "other" && type !== "observation")
      e.date = l("This is before the sowing date", "ही तारीख पेरणीच्या आधीची आहे");
    const whole = (v: string) => v === "" || (/^\d+$/.test(v) && Number(v) <= 365 * 24);
    if (!whole(phi) || Number(phi) > 365) e.phi = l("Enter whole days, or leave empty", "पूर्ण दिवस लिहा किंवा रिकामे ठेवा");
    if (!whole(rei)) e.rei = l("Enter whole hours, or leave empty", "पूर्ण तास लिहा किंवा रिकामे ठेवा");
    setErr(e);
    if (Object.keys(e).length) return;
    const clean = (s: string, n: number) => s.replace(/[<>]/g, "").trim().slice(0, n);
    logFarmActivity({
      farmCropId: fc.id,
      type,
      date,
      ...(PRODUCT.includes(type) && product.trim() ? { productName: clean(product, 80) } : {}),
      ...(qty.trim() ? { quantity: clean(qty, 60) } : {}),
      ...(SPRAY.includes(type) && phi ? { preHarvestIntervalDays: Number(phi) } : {}),
      ...(SPRAY.includes(type) && rei ? { reEntryHours: Number(rei) } : {}),
      ...(initial?.linkedTaskId ? { linkedTaskId: initial.linkedTaskId } : {}),
      notes: clean(notes, 300),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={l("Log activity", "कामाची नोंद")}
        className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-cream p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">{l("Log activity", "कामाची नोंद")}</h2>
          <button onClick={onClose} className="grid size-12 place-items-center rounded-full" aria-label={l("Close", "बंद करा")}>
            <X size={22} />
          </button>
        </div>
        <fieldset>
          <legend className="mb-2 font-semibold">{l("What did you do?", "काय केले?")}</legend>
          <div className="grid grid-cols-3 gap-2" role="radiogroup">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={type === t}
                onClick={() => setType(t)}
                className={cx("flex min-h-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2 text-sm font-semibold", type === t ? "border-leaf-700 bg-leaf-50" : "border-line bg-white")}
              >
                <span className={cx("grid size-10 place-items-center rounded-full", ACTIVITY[t].tone)}>{ACTIVITY[t].icon}</span>
                {tx(ACTIVITY[t].label)}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="mt-4 space-y-4">
          <Field label={l("Date", "तारीख")} error={err.date}>
            <input type="date" className={inputCls} value={date} max={today} min={earliest} onChange={(e) => setDate(e.target.value)} />
          </Field>
          {PRODUCT.includes(type) && (
            <Field label={l("Product name (as on the bag or bottle)", "उत्पादनाचे नाव (पिशवी / बाटलीवरचे)")}>
              <Input className={inputCls} value={product} maxLength={80} onChange={(e) => setProduct(e.target.value)} />
            </Field>
          )}
          <Field label={l("Quantity (optional)", "प्रमाण (पर्यायी)")} hint={l("As you measured it, e.g. 2 bags, 500 ml in 200 L", "तुम्ही मोजले तसे, उदा. 2 पिशव्या, 200 लिटरमध्ये 500 मिली")}>
            <Input className={inputCls} value={qty} maxLength={60} onChange={(e) => setQty(e.target.value)} />
          </Field>
          {SPRAY.includes(type) && (
            <div className="rounded-2xl bg-gold-100 p-3">
              <p className="text-sm text-[#6b4708]">{l("Read these two numbers from the product label. They keep you and your buyers safe.", "हे दोन आकडे औषधाच्या लेबलवर वाचा. यामुळे तुम्ही व खरेदीदार सुरक्षित राहता.")}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Field label={l("Waiting days before harvest", "काढणीपूर्वी थांबायचे दिवस")} error={err.phi}>
                  <Input className={inputCls} inputMode="numeric" value={phi} maxLength={3} onChange={(e) => setPhi(e.target.value.replace(/\D/g, ""))} />
                </Field>
                <Field label={l("Hours before entering the field", "शेतात जाण्यापूर्वीचे तास")} error={err.rei}>
                  <Input className={inputCls} inputMode="numeric" value={rei} maxLength={3} onChange={(e) => setRei(e.target.value.replace(/\D/g, ""))} />
                </Field>
              </div>
            </div>
          )}
          <Field label={l("Notes", "टीप")}>
            <TextArea className={cx(inputCls, "min-h-20 py-2")} value={notes} maxLength={300} onChange={(e) => setNotes(e.target.value)} />
          </Field>
        </div>
        <Button full className="mt-5 min-h-14 text-lg" onClick={save}>
          <Check size={20} /> {l("Save", "जतन करा")}
        </Button>
      </div>
    </div>
  );
}

