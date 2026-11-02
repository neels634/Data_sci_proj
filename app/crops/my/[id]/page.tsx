"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Check, EllipsisVertical, MessageCircleQuestion, Pencil, Plus, SkipForward, Sprout, Trash2, Wheat } from "lucide-react";
import { getCrop, seasonName } from "@/lib/crops";
import {
  currentStage,
  dayNumber,
  daysBetween,
  expectedHarvestWindow,
  lastActivity,
  preSowingTasks,
  sprayStatus,
  timeline,
  todayTasks,
  upcomingTasks,
  addDays,
  type TaskOccurrence,
} from "@/lib/lifecycle";
import type { ActivityType, CropInfo, FarmCrop } from "@/lib/types";
import { ACTIVITY, LogActivitySheet, NotVerified, SprayBanner, StageTimeline, TaskRow, useFarm } from "@/components/myfarm/ui";
import { Input, ReadAloud } from "@/components/voice";
import { Button, Card, Empty, Field, LinkButton, PageHeader, SectionTitle, cx, inputCls } from "@/components/ui";

export default function FarmCropPage() {
  const { id } = useParams<{ id: string }>();
  const { state, l } = useFarm();
  // only the signed-in farmer's crops are visible here
  const fc = state.myFarmCrops.find((c) => c.id === id);
  const crop = fc ? getCrop(fc.cropId) : undefined;
  if (!fc || !crop)
    return (
      <div>
        <PageHeader back="/crops" title={l("Crop not found", "पीक सापडले नाही")} />
        <Empty icon={<Sprout size={32} />} title={l("This crop is not in your farm", "हे पीक तुमच्या शेतीत नाही")} body={l("It may have been removed.", "ते काढले असू शकते.")} />
      </div>
    );
  return <Detail fc={fc} crop={crop} />;
}

function Detail({ fc, crop }: { fc: FarmCrop; crop: CropInfo }) {
  const { state, l, tx, today, short, ago, cropTitle, markSown, markHarvested, removeFarmCrop, setTaskState } = useFarm();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [log, setLog] = useState<{ type?: ActivityType; linkedTaskId?: string } | null>(null);
  const acts = state.myFarmActivities.filter((a) => a.farmCropId === fc.id);
  const day = dayNumber(fc, today);
  const now = currentStage(fc, crop, today);
  const hw = expectedHarvestWindow(fc);
  const spray = fc.status === "growing" ? sprayStatus(acts, fc.id, today, hw) : null;
  const due = todayTasks([fc], getCrop, state.myTaskStates, today);
  const soon = upcomingTasks(fc, crop, state.myTaskStates, addDays(today, 1), 6);
  const growing = fc.status === "growing";
  const planned = fc.status === "planned";

  const lastOf = (types: ActivityType[]) => lastActivity(acts, fc.id, types);
  const chips: [string, ReturnType<typeof lastOf>][] = [
    [l("Last irrigation", "शेवटचे पाणी"), lastOf(["irrigation"])],
    [l("Last fertiliser", "शेवटचे खत"), lastOf(["fertiliser"])],
    [l("Last spray", "शेवटची फवारणी"), lastOf(["pesticide", "fungicide"])],
  ];

  const lastSprayText = spray ? `${spray.last.productName ?? tx(ACTIVITY[spray.last.type].label)}, ${spray.daysSince} days ago` : "none recorded";
  const askQ = l(
    `My crop: ${crop.name.en}${tx(fc.variety) ? `, variety ${tx(fc.variety)}` : ""}, ${seasonName(crop, fc.seasonIndex).en} season${day != null ? `, day ${day} after sowing` : ", not sown yet"}${now ? `, stage: ${now.stage.name.en}` : ""}. Last spray: ${lastSprayText}. My question: `,
    `माझे पीक: ${crop.name.mr}${tx(fc.variety) ? `, वाण ${tx(fc.variety)}` : ""}, ${seasonName(crop, fc.seasonIndex).mr} हंगाम${day != null ? `, पेरणीनंतर ${day} वा दिवस` : ", अजून पेरणी नाही"}${now ? `, अवस्था: ${now.stage.name.mr}` : ""}. शेवटची फवारणी: ${spray ? `${spray.last.productName ?? ACTIVITY[spray.last.type].label.mr}, ${spray.daysSince} दिवसांपूर्वी` : "नोंद नाही"}. माझा प्रश्न: `,
  );

  return (
    <div>
      <PageHeader
        back="/crops"
        title={`${crop.emoji} ${cropTitle(fc)}`}
        sub={`${tx(fc.plotName) || l("My field", "माझे शेत")} · ${fc.areaAcres} ${l("acre", "एकर")} · ${tx(seasonName(crop, fc.seasonIndex))}`}
        action={
          <div className="relative flex gap-1">
            <button onClick={() => setEditing((x) => !x)} className="grid size-12 place-items-center rounded-full border border-line bg-white text-leaf-700" aria-label={l("Edit crop", "पीक बदला")}>
              <Pencil size={18} />
            </button>
            <button onClick={() => setMenu((x) => !x)} className="grid size-12 place-items-center rounded-full border border-line bg-white text-leaf-700" aria-label={l("More options", "अधिक पर्याय")} aria-expanded={menu}>
              <EllipsisVertical size={20} />
            </button>
            {menu && (
              <div className="absolute right-0 top-14 z-20 w-56 overflow-hidden rounded-2xl border border-line bg-white shadow-lg" role="menu">
                {growing && (
                  <button
                    role="menuitem"
                    className="flex min-h-12 w-full items-center gap-2 px-4 text-left font-semibold hover:bg-leaf-50"
                    onClick={() => {
                      setMenu(false);
                      if (window.confirm(l("Mark this crop as harvested today?", "आज काढणी झाली अशी नोंद करायची?"))) markHarvested(fc.id, today);
                    }}
                  >
                    <Wheat size={18} /> {l("Mark harvested", "काढणी झाली")}
                  </button>
                )}
                <button
                  role="menuitem"
                  className="flex min-h-12 w-full items-center gap-2 px-4 text-left font-semibold text-soil hover:bg-soil-100"
                  onClick={() => {
                    setMenu(false);
                    if (window.confirm(l("Remove this crop and its activity log? This can't be undone.", "हे पीक व त्याच्या नोंदी काढायच्या? हे परत आणता येणार नाही."))) {
                      removeFarmCrop(fc.id);
                      router.push("/crops");
                    }
                  }}
                >
                  <Trash2 size={18} /> {l("Remove crop", "पीक काढून टाका")}
                </button>
              </div>
            )}
          </div>
        }
      />

      {editing && <EditCrop fc={fc} onDone={() => setEditing(false)} />}

      {/* status line */}
      <div className="rounded-3xl bg-gradient-to-br from-leaf-700 to-leaf-900 p-4 text-white">
        {growing && now ? (
          <>
            <p className="text-sm text-white/80">{l(`Day ${day}`, `दिवस ${day}`)}</p>
            <p className="text-2xl font-bold">{tx(now.stage.name)}</p>
            <p className="text-sm text-white/85">{now.pastLastStage ? l("Past the expected harvest window", "अपेक्षित काढणी कालावधी संपला") : l(`${now.daysLeft} days left in this stage`, `या अवस्थेचे ${now.daysLeft} दिवस बाकी`)}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-[#f2c14e]" style={{ width: `${now.overall}%` }} />
            </div>
          </>
        ) : planned && fc.plannedSowingDate ? (
          <>
            <p className="text-sm text-white/80">{l("Planned", "नियोजित")}</p>
            <p className="text-2xl font-bold">
              {(() => {
                const n = daysBetween(today, fc.plannedSowingDate);
                return n > 0 ? l(`Sowing in ${n} days`, `${n} दिवसांनी पेरणी`) : n === 0 ? l("Sowing today", "आज पेरणी") : l(`Planned date passed ${-n} days ago`, `नियोजित तारीख ${-n} दिवसांपूर्वी गेली`);
              })()}
            </p>
            <p className="text-sm text-white/85">{short(fc.plannedSowingDate)}</p>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold">{fc.status === "harvested" ? l("Harvested", "काढणी झाली") : l("Stopped", "बंद")}</p>
            {fc.harvestedOn && <p className="text-sm text-white/85">{short(fc.harvestedOn)}</p>}
          </>
        )}
      </div>

      {planned && (
        <>
          <Button full className="mt-3 min-h-14 text-lg" onClick={() => markSown(fc.id, today)}>
            <Sprout size={22} /> {l("I sowed today", "आज पेरणी केली")}
          </Button>
          <SectionTitle>{l("Before sowing", "पेरणीपूर्वी")}</SectionTitle>
          <div className="space-y-2">
            {preSowingTasks(fc, crop).map((p) => {
              const st = state.myTaskStates.find((s) => s.farmCropId === fc.id && s.taskKey === p.key);
              return (
                <Card key={p.key} className={cx("p-3", st && "opacity-60")}>
                  <div className="flex items-start gap-3">
                    <span className={cx("grid size-11 shrink-0 place-items-center rounded-2xl", ACTIVITY[p.type].tone)}>{ACTIVITY[p.type].icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold leading-snug">{tx(p.title)}</span>
                      <span className="text-sm text-muted">{st ? (st.status === "done" ? l("Done", "झाले") : l("Skipped", "वगळले")) : l(`By ${short(p.date)}`, `${short(p.date)} पर्यंत`)}</span>
                    </span>
                  </div>
                  {!st && (
                    <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
                      <Button className="min-h-12" onClick={() => setTaskState(fc.id, p.key, "done")}>
                        <Check size={18} /> {l("Done", "झाले")}
                      </Button>
                      <Button variant="secondary" className="min-h-12" onClick={() => setTaskState(fc.id, p.key, "skipped")}>
                        <SkipForward size={18} /> {l("Skip", "वगळा")}
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}

      {growing && (
        <>
          <div className="mt-3">
            <SprayBanner status={spray} />
          </div>
          <div className="-mx-4 mt-3 overflow-x-auto px-4">
            <div className="flex min-w-max gap-2">
              {chips.map(([label, a]) => (
                <span key={label} className="rounded-2xl border border-line bg-white px-3 py-2 text-sm">
                  <span className="block text-muted">{label}</span>
                  <span className="font-bold">{a ? ago(daysBetween(a.date, today)) : l("None yet", "नोंद नाही")}</span>
                </span>
              ))}
            </div>
          </div>

          <SectionTitle action={due.length > 0 ? <ReadAloud text={due.map((o) => tx(o.task.title)).join(". ")} /> : undefined}>{l("Today", "आज")}</SectionTitle>
          {due.length ? (
            <div className="space-y-2">
              {due.map((o) => (
                <TaskRow key={o.key} o={o} fc={fc} onLog={(x: TaskOccurrence) => setLog({ type: x.task.type, linkedTaskId: x.key })} />
              ))}
            </div>
          ) : (
            <p className="text-muted">{l("No tasks today 🌱", "आज काही काम नाही 🌱")}</p>
          )}
          {soon.length > 0 && (
            <>
              <p className="mb-2 mt-4 font-semibold text-muted">{l("Next 7 days", "पुढील 7 दिवस")}</p>
              <Card className="divide-y divide-line p-0">
                {soon.map((o) => (
                  <div key={o.key} className="flex min-h-14 items-center gap-3 px-4 py-2">
                    <span className={cx("grid size-9 shrink-0 place-items-center rounded-full", ACTIVITY[o.task.type].tone)}>{ACTIVITY[o.task.type].icon}</span>
                    <span className="min-w-0 flex-1 font-semibold leading-tight">{tx(o.task.title)}</span>
                    <span className="shrink-0 text-sm text-muted">{short(o.date)}</span>
                  </div>
                ))}
              </Card>
            </>
          )}
        </>
      )}

      <SectionTitle>{l("Crop timeline", "पिकाचे वेळापत्रक")}</SectionTitle>
      <StageTimeline
        stages={timeline(fc, crop)}
        currentIndex={fc.status === "harvested" ? timeline(fc, crop).length : now?.index ?? -1}
        daysLeft={now && !now.pastLastStage ? now.daysLeft : undefined}
        harvest={hw}
      />
      <p className="mt-2">
        <NotVerified />
      </p>

      <SectionTitle
        action={
          fc.status !== "abandoned" && (
            <Button className="min-h-12" onClick={() => setLog({})}>
              <Plus size={18} /> {l("Log activity", "नोंद करा")}
            </Button>
          )
        }
      >
        {l("Activity log", "कामांच्या नोंदी")}
      </SectionTitle>
      {acts.length ? (
        <ol className="space-y-2">
          {acts.map((a) => (
            <li key={a.id}>
              <Card className="flex items-start gap-3 p-3">
                <span className={cx("grid size-11 shrink-0 place-items-center rounded-2xl", ACTIVITY[a.type].tone)}>{ACTIVITY[a.type].icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-bold">{tx(ACTIVITY[a.type].label)}</span>
                    <span className="shrink-0 text-sm text-muted">{short(a.date)}</span>
                  </span>
                  {a.productName && <span className="block text-sm">{a.productName}</span>}
                  {a.quantity && <span className="block text-sm text-muted">{a.quantity}</span>}
                  {(a.preHarvestIntervalDays != null || a.reEntryHours != null) && (
                    <span className="block text-sm text-muted">
                      {a.preHarvestIntervalDays != null && l(`Wait ${a.preHarvestIntervalDays} days before harvest`, `काढणीपूर्वी ${a.preHarvestIntervalDays} दिवस थांबा`)}
                      {a.preHarvestIntervalDays != null && a.reEntryHours != null && " · "}
                      {a.reEntryHours != null && l(`${a.reEntryHours} h before entering`, `शेतात जाण्यापूर्वी ${a.reEntryHours} तास`)}
                    </span>
                  )}
                  {a.notes && <span className="block text-sm text-muted">{a.notes}</span>}
                </span>
              </Card>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-muted">{l("Nothing recorded yet.", "अजून काही नोंद नाही.")}</p>
      )}

      <LinkButton href={`/ask?q=${encodeURIComponent(askQ)}`} variant="secondary" full className="mt-6 min-h-14">
        <MessageCircleQuestion size={20} /> {l("Ask Krishi Mitra about this crop", "या पिकाबद्दल कृषी मित्राला विचारा")}
      </LinkButton>
      <Link href={`/crops/library/${crop.id}`} className="mt-2 flex min-h-12 items-center justify-center font-semibold text-leaf-700 underline">
        {l(`About ${crop.name.en} — crop guide`, `${crop.name.mr} — पीक माहिती`)}
      </Link>

      {log && <LogActivitySheet fc={fc} initial={log} onClose={() => setLog(null)} />}
    </div>
  );
}

function EditCrop({ fc, onDone }: { fc: FarmCrop; onDone: () => void }) {
  const { l, tx, updateFarmCrop } = useFarm();
  const [variety, setVariety] = useState(tx(fc.variety));
  const [plot, setPlot] = useState(tx(fc.plotName));
  const [area, setArea] = useState(String(fc.areaAcres));
  const [min, setMin] = useState(String(fc.durationDays[0]));
  const [max, setMax] = useState(String(fc.durationDays[1]));
  const [err, setErr] = useState<Record<string, string>>({});
  const save = () => {
    const e: Record<string, string> = {};
    const a = Number(area);
    if (!(a > 0) || a > 100) e.area = l("Enter 0–100 acres", "0–100 एकर लिहा");
    const lo = Number(min);
    const hi = Number(max);
    if (!Number.isInteger(lo) || !Number.isInteger(hi) || lo < 30 || hi > 400 || lo > hi) e.dur = l("Enter whole days; the first must not be more than the second", "पूर्ण दिवस लिहा; पहिला आकडा दुसऱ्यापेक्षा जास्त नसावा");
    setErr(e);
    if (Object.keys(e).length) return;
    updateFarmCrop(fc.id, {
      // keep the bilingual seed text when the farmer didn't change it
      variety: variety === tx(fc.variety) ? fc.variety : variety.trim().slice(0, 40),
      plotName: plot === tx(fc.plotName) ? fc.plotName : plot.trim().slice(0, 40),
      areaAcres: a,
      durationDays: [lo, hi],
    });
    onDone();
  };
  return (
    <Card className="mb-3 space-y-3 border-leaf-600/40">
      <Field label={l("Variety", "वाण")}>
        <Input className={inputCls} value={variety} maxLength={40} onChange={(e) => setVariety(e.target.value)} />
      </Field>
      <Field label={l("Plot name", "शेताचे नाव")}>
        <Input className={inputCls} value={plot} maxLength={40} onChange={(e) => setPlot(e.target.value)} />
      </Field>
      <Field label={l("Area in acres", "क्षेत्र एकरमध्ये")} error={err.area}>
        <Input className={inputCls} inputMode="decimal" value={area} maxLength={6} onChange={(e) => setArea(e.target.value.replace(/[^\d.]/g, ""))} />
      </Field>
      <Field label={l("Days to harvest (from – to)", "काढणीपर्यंतचे दिवस (पासून – पर्यंत)")} error={err.dur} hint={l("Change this if your variety is shorter or longer.", "तुमचा वाण कमी-जास्त दिवसांचा असल्यास बदला.")}>
        <div className="flex items-center gap-2">
          <Input className={inputCls} inputMode="numeric" value={min} maxLength={3} onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))} />
          <span>–</span>
          <Input className={inputCls} inputMode="numeric" value={max} maxLength={3} onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))} />
        </div>
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={onDone}>
          {l("Cancel", "रद्द")}
        </Button>
        <Button onClick={save}>{l("Save", "जतन करा")}</Button>
      </div>
    </Card>
  );
}
