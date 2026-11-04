"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  AlertTriangle,
  Camera,
  Check,
  CheckCheck,
  Copy,
  EllipsisVertical,
  FileText,
  Lock,
  MessageCircleQuestion,
  Pencil,
  Plus,
  RefreshCw,
  ShieldAlert,
  SkipForward,
  Sprout,
  Trash2,
  Wheat,
  X,
} from "lucide-react";
import { monthRuns, seasonName } from "@/lib/crops";
import { useCrop } from "@/lib/crops/load";
import {
  currentStage,
  cycleOf,
  dayNumber,
  isYoungOrchard,
  orchardAgeYears,
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
import type { ActivityType, CropInfo, FarmCrop, PerennialCrop, StressObservation } from "@/lib/types";
import { ACTIVITY, LogActivitySheet, NotVerified, SprayBanner, StageTimeline, TaskRow, useFarm } from "@/components/myfarm/ui";
import { FieldCard } from "@/components/myfarm/FieldCard";
import { lastStageStart, readFieldHistory, recordLines } from "@/lib/fieldHistory";
import { Input } from "@/components/voice";
import { SpeakButton } from "@/components/speech";
import { ordinalMr, toAsciiDigits } from "@/lib/marathi-numbers";
import { Button, Card, DemoBadge, Empty, Field, LinkButton, PageHeader, SectionTitle, cx, inputCls } from "@/components/ui";
import { CropMoney } from "@/components/costs/money";

import { copyText } from "@/lib/copy";

function compressObservationPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode failed"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        const maxDim = 600; // compact thumbnail to ensure localStorage never overflows
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function FarmCropPage() {
  const { id } = useParams<{ id: string }>();
  const { state, l } = useFarm();
  // only the signed-in farmer's crops are visible here
  const fc = state.myFarmCrops.find((c) => c.id === id);
  const crop = useCrop(fc?.cropId ?? null);
  if (fc && crop === undefined) return <div className="h-60 animate-pulse rounded-3xl bg-sand" aria-busy="true" />;
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
  const {
    state,
    account,
    l,
    tx,
    ctx,
    num,
    today,
    short,
    ago,
    cropTitle,
    markSown,
    markHarvested,
    removeFarmCrop,
    setTaskState,
    addStressObservation,
    deleteStressObservation,
    toast,
  } = useFarm();

  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [log, setLog] = useState<{ type?: ActivityType; linkedTaskId?: string } | null>(null);
  const [tab, setTab] = useState<"crop" | "money">(() => (typeof window !== "undefined" && window.location.hash === "#money" ? "money" : "crop"));

  // Crop stress recording sheet & preview
  const [showStressForm, setShowStressForm] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const acts = state.myFarmActivities.filter((a) => a.farmCropId === fc.id);
  const plotStressObservations = (state.myStressObservations || []).filter((o) => o.farmCropId === fc.id);

  const day = dayNumber(fc, today, crop);
  const now = currentStage(fc, crop, today);
  const hw = expectedHarvestWindow(fc, crop);
  const perennial = crop.lifecycle === "perennial";
  const cycle = crop.lifecycle === "perennial" ? cycleOf(fc, crop) : null;
  // e.g. "Mrig bahar" for a running cycle, else the season of a seasonal crop
  const seasonLabel = cycle && fc.cycleStart ? cycle.name : seasonName(crop, fc.seasonIndex);
  const spray = fc.status === "growing" ? sprayStatus(acts, fc.id, today, hw) : null;
  const due = todayTasks([fc], (id) => (id === crop.id ? crop : undefined), state.myTaskStates, today);
  const soon = upcomingTasks(fc, crop, state.myTaskStates, addDays(today, 1), 6);
  const growing = fc.status === "growing";
  const planned = fc.status === "planned";

  const villageName = tx(state.profile.village) || account?.village || l("Navgaon", "नवगाव");
  const districtName = tx(state.profile.district) || account?.district || l("Satara", "सातारा");
  const farmerName = tx(state.profile.name) || account?.name || l("Farmer", "शेतकरी");

  const lastOf = (types: ActivityType[]) => lastActivity(acts, fc.id, types);
  const chips: [string, ReturnType<typeof lastOf>][] = [
    [l("Last irrigation", "शेवटचे पाणी"), lastOf(["irrigation"])],
    [l("Last fertiliser", "शेवटचे खत"), lastOf(["fertiliser"])],
    [l("Last spray", "शेवटची फवारणी"), lastOf(["pesticide", "fungicide"])],
  ];

  const lastSprayText = spray ? `${spray.last.productName ?? tx(ACTIVITY[spray.last.type].label)}, ${spray.daysSince} days ago` : "none recorded";
  const askQ = l(
    `My crop: ${crop.name.en}${tx(fc.variety) ? `, variety ${tx(fc.variety)}` : ""}, ${seasonLabel.en} season${day != null ? (perennial ? `, day ${day} of the cycle` : `, day ${day} after sowing`) : perennial ? "" : ", not sown yet"}${now ? `, stage: ${now.stage.name.en}` : ""}. Last spray: ${lastSprayText}. My question: `,
    `माझे पीक: ${crop.name.mr}${tx(fc.variety) ? `, वाण ${tx(fc.variety)}` : ""}, ${seasonLabel.mr} हंगाम${day != null ? (perennial ? `, बहार सुरू होऊन ${day} वा दिवस` : `, पेरणीनंतर ${day} वा दिवस`) : perennial ? "" : ", अजून पेरणी नाही"}${now ? `, अवस्था: ${now.stage.name.mr}` : ""}. शेवटची फवारणी: ${spray ? `${spray.last.productName ?? ACTIVITY[spray.last.type].label.mr}, ${spray.daysSince} दिवसांपूर्वी` : "नोंद नाही"}. माझा प्रश्न: `,
  );

  const mr = state.lang === "mr";
  const statusSpeech = [
    growing && now && day != null
      ? mr
        ? `${day === 0 ? "पेरणीचा दिवस" : `${ordinalMr(day)} दिवस`}, टप्पा: ${tx(now.stage.name)}. ${now.pastLastStage ? "अपेक्षित काढणी कालावधी संपला आहे." : `या टप्प्याचे ${now.daysLeft} दिवस बाकी.`}`
        : `Day ${day}, ${tx(now.stage.name)} stage. ${now.pastLastStage ? "Past the expected harvest window." : `${now.daysLeft} days left in this stage.`}`
      : "",
    hw ? (mr ? `काढणी ${hw.earliest} ते ${hw.latest}${hw.estimate ? ", अंदाजे" : ""}.` : `Harvest ${short(hw.earliest)} to ${short(hw.latest)}${hw.estimate ? ", estimated" : ""}.`) : "",
    growing ? (spray ? (mr ? `शेवटची फवारणी ${spray.daysSince} दिवसांपूर्वी.` : `Last spray ${spray.daysSince} days ago.`) : mr ? "फवारणीची नोंद नाही." : "No spray recorded.") : "",
  ]
    .filter(Boolean)
    .join(" ");

  // ── Stage 3: Generate Plain Text Case Summary for Mitra / Officials ────────
  const generateCaseSummaryText = () => {
    const lines: string[] = [];
    lines.push("==================================================");
    lines.push("SHET SAMRUDDHI — CROP STRESS CASE SUMMARY");
    lines.push("==================================================");
    lines.push(`Date of Summary: ${today}`);
    lines.push(`Farmer Name: ${farmerName}`);
    lines.push(`Location: Village ${villageName}, District ${districtName}`);
    lines.push("");
    lines.push("PLOT CONTEXT:");
    lines.push(`- Crop: ${crop.name.en} (${crop.name.mr})`);
    if (tx(fc.variety)) lines.push(`- Variety: ${tx(fc.variety)}`);
    lines.push(`- Plot / Field: ${tx(fc.plotName) || "My Field"}`);
    lines.push(`- Area: ${fc.areaAcres} Acres`);
    lines.push(`- Season: ${seasonLabel.en} (${seasonLabel.mr})`);
    lines.push(`- Sowing Date: ${fc.sowingDate || (fc.plannedSowingDate ? `Planned ${fc.plannedSowingDate}` : "Not recorded")}`);
    if (now && day != null) {
      lines.push(`- Current Stage: Day ${day} (${now.stage.name.en} / ${now.stage.name.mr})`);
    }
    lines.push("");
    lines.push("FARMER-ENTERED STRESS OBSERVATIONS:");
    if (plotStressObservations.length === 0) {
      lines.push("  (No specific stress observations logged yet)");
    } else {
      plotStressObservations.forEach((obs, idx) => {
        const cat = obs.stressCategory ? ` [${obs.stressCategory.toUpperCase()}]` : "";
        const photoNote = obs.photoDataUrl ? " (Photo on farmer's device)" : "";
        lines.push(`  ${idx + 1}. Date: ${obs.date}${cat}`);
        lines.push(`     Notes: ${obs.symptomNotes}${photoNote}`);
      });
    }
    lines.push("");
    if (fc.fieldHistory) {
      lines.push(...recordLines(fc, fc.fieldHistory, readFieldHistory(fc.fieldHistory, lastStageStart(fc, crop))));
      lines.push("");
    }
    lines.push("AREA-LEVEL CONTEXT:");
    lines.push("- Live Area Weather/Moisture: No live taluka-level feed connected.");
    lines.push("- Note: Area-level signals support awareness only; they do not prove plot-level damage or determine insurance eligibility.");
    lines.push("");
    lines.push("OFFICIAL NEXT STEPS & REPORTING:");
    lines.push("- Suggested action: Share this case summary with your Gaon Mandi Mitra or local Krishi Sahayak (कृषी सहाय्यक).");
    lines.push("- Reporting Window: [Verify current deadlines with your local Taluka Agriculture Office before use]");
    lines.push("- Official Contact/Helpline: [Verify official MahaDBT / PMFBY helpline before use]");
    lines.push("");
    lines.push("DISCLAIMER:");
    lines.push("This summary is record-keeping support prepared by the farmer for advisory discussion. It is not an official damage assessment or insurance claim decision.");
    lines.push("==================================================");
    return lines.join("\n");
  };

  const copySummaryToClipboard = async () => {
    try {
      const text = generateCaseSummaryText();
      await copyText(text);
      setCopiedSummary(true);
      toast(l("Case summary copied to clipboard!", "केस सारांश क्लिपबोर्डवर कॉपी झाला!"));
      setTimeout(() => setCopiedSummary(false), 3000);
    } catch {
      toast(l("Failed to copy. Please select and copy manually.", "कॉपी करता आले नाही. कृपया स्वतः कॉपी करा."));
    }
  };

  return (
    <div className="pb-16">
      <PageHeader
        back="/crops"
        title={`${crop.emoji} ${cropTitle(fc)}`}
        sub={`${tx(fc.plotName) || l("My field", "माझे शेत")} · ${num(fc.areaAcres)} ${l("acre", "एकर")} · ${tx(seasonLabel)}`}
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
                      if (window.confirm(perennial ? l("Mark this cycle's harvest as finished today?", "या बहाराची काढणी आज पूर्ण झाली अशी नोंद करायची?") : l("Mark this crop as harvested today?", "आज काढणी झाली अशी नोंद करायची?"))) markHarvested(fc.id, today);
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
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-2xl bg-sand p-1" role="tablist" aria-label={l("Crop or money", "पीक किंवा खर्च")}>
        {(["crop", "money"] as const).map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cx("min-h-12 rounded-xl text-[17px] font-bold", tab === t ? "bg-white text-leaf-900 shadow" : "text-muted")}>
            {t === "crop" ? l("Crop", "पीक") : l("Expenses", "खर्च")}
          </button>
        ))}
      </div>
      {tab === "money" ? (
        <CropMoney fc={fc} crop={crop} />
      ) : (
        <>

      {editing && <EditCrop fc={fc} onDone={() => setEditing(false)} />}

      {/* Stage 2: Plot Details Strip (Crop, Sowing Date, Area, Village, Season) */}
      <Card className="mb-3 border-line bg-white p-3.5 shadow-xs">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
          {l("Plot Details", "शेताचा तपशील")}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div>
            <span className="text-muted block text-[11px]">{l("Crop & Variety", "पीक व वाण")}</span>
            <span className="font-bold text-ink truncate block">
              {crop.emoji} {cropTitle(fc)}
            </span>
          </div>
          <div>
            <span className="text-muted block text-[11px]">{perennial ? l("Planted on", "लागवड तारीख") : l("Sowing Date", "पेरणी तारीख")}</span>
            <span className="font-bold text-ink block">
              {perennial && fc.plantedOn ? short(fc.plantedOn) : fc.sowingDate ? short(fc.sowingDate) : fc.plannedSowingDate ? `${short(fc.plannedSowingDate)} (${l("Plan", "नियोजन")})` : l("Not set", "नोंद नाही")}
            </span>
          </div>
          <div>
            <span className="text-muted block text-[11px]">{l("Area", "क्षेत्र")}</span>
            <span className="font-bold text-ink block">{num(fc.areaAcres)} {l("acre", "एकर")}</span>
          </div>
          <div>
            <span className="text-muted block text-[11px]">{l("Village & Season", "गाव व हंगाम")}</span>
            <span className="font-bold text-ink block truncate">
              {villageName} · {tx(seasonLabel)}
            </span>
          </div>
        </div>
      </Card>

      {/* Status banner */}
      <div className="rounded-3xl bg-gradient-to-br from-leaf-700 to-leaf-900 p-4 text-white">
        {growing && now ? (
          <>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-white/80">{l(`Day ${num(day ?? 0)}`, `दिवस ${num(day ?? 0)}`)}</p>
              <SpeakButton id={`status:${fc.id}`} text={statusSpeech} label={l("Read crop status", "पिकाची स्थिती वाचून दाखवा")} size="sm" className="bg-white/15 text-white hover:bg-white hover:text-leaf-900" />
            </div>
            <p className="text-2xl font-bold">{tx(now.stage.name)}</p>
            <p className="text-sm text-white/85">{now.pastLastStage ? l("Past the expected harvest window", "अपेक्षित काढणी कालावधी संपला") : l(`${num(now.daysLeft)} days left in this stage`, `या अवस्थेचे ${num(now.daysLeft)} दिवस बाकी`)}</p>
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
                return n > 0 ? l(`Sowing in ${num(n)} days`, `${num(n)} दिवसांनी पेरणी`) : n === 0 ? l("Sowing today", "आज पेरणी") : l(`Planned date passed ${num(-n)} days ago`, `नियोजित तारीख ${num(-n)} दिवसांपूर्वी गेली`);
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

      {crop.lifecycle === "perennial" && <OrchardPanel fc={fc} crop={crop} />}

      <FieldCard fc={fc} />

      {planned && (
        <>
          <Button full className="mt-3 min-h-14 text-lg" onClick={() => markSown(fc.id, today, crop)}>
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

          <SectionTitle action={due.length > 0 ? <SpeakButton id={`today:${fc.id}`} text={due.map((o) => `${tx(o.task.title)}${o.overdue ? l(", overdue", ", राहिलेले") : ""}`).join(". ")} label={l("Read today's tasks", "आजची कामे वाचून दाखवा")} /> : undefined}>{l("Today", "आज")}</SectionTitle>
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
                    <span className="min-w-0 flex-1 font-semibold leading-tight">{ctx(o.task.title)}</span>
                    <span className="shrink-0 text-sm text-muted">{short(o.date)}</span>
                  </div>
                ))}
              </Card>
            </>
          )}
        </>
      )}

      {/* ── STAGE 2: Crop Stress & Support Section ────────────────────────────── */}
      <SectionTitle
        action={
          <Button
            className="min-h-10 text-xs px-3"
            onClick={() => setShowStressForm(true)}
          >
            <Plus size={16} />
            <span>{l("Record Stress", "ताण नोंदवा")}</span>
          </Button>
        }
      >
        <span className="flex items-center gap-1.5">
          <ShieldAlert size={20} className="text-soil" />
          <span>{l("Crop Stress & Support", "पीक ताण व मदत")}</span>
        </span>
      </SectionTitle>

      {/* Privacy Notice Banner */}
      <div className="mb-3 flex items-start gap-2.5 rounded-xl border border-line bg-cream p-3 text-xs text-muted leading-relaxed">
        <Lock size={15} className="mt-0.5 shrink-0 text-leaf-700" />
        <div>
          <span className="font-semibold text-ink">
            {l("Device Privacy Notice: ", "फोनवरील सुरक्षितता: ")}
          </span>
          {l(
            "Photos and notes stay private on this device. They are not uploaded to a public ledger or public server. Note: if this phone is shared with others, local files can be viewed.",
            "फोटो व नोंदी फक्त या फोनवर खाजगी राहतात. ते कोणत्याही सार्वजनिक सर्व्हरवर पाठवले जात नाहीत. हा फोन इतरांनी वापरल्यास ते फोनवरील माहिती पाहू शकतात."
          )}
        </div>
      </div>

      {/* Stress Observations List */}
      {plotStressObservations.length === 0 ? (
        <Card className="p-4 text-center border-dashed">
          <p className="text-sm font-semibold text-ink">
            {l("No crop stress recorded yet for this plot", "या शेतासाठी अजून कोणताही ताण नोंदवलेला नाही")}
          </p>
          <p className="text-xs text-muted mt-1">
            {l(
              "When you notice yellowing, wilting, pest spotting or water stress, record a dated observation here to build a timeline case for your Mitra.",
              "पाने पिवळी पडणे, कीड, पाणीटंचाई किंवा कोमेजणे दिसल्यास तारीखवार नोंद करा, जेणेकरून मित्राला किंवा अधिकाऱ्याला दाखवता येईल."
            )}
          </p>
          <Button
            variant="secondary"
            className="mt-3 min-h-10 text-xs"
            onClick={() => setShowStressForm(true)}
          >
            <Plus size={14} />
            <span>{l("Record First Observation", "पहिली ताण नोंद करा")}</span>
          </Button>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {plotStressObservations.map((obs) => (
            <Card key={obs.id} className="p-3.5 flex items-start gap-3 border-soil/20 bg-white">
              {obs.photoDataUrl ? (
                <button
                  type="button"
                  onClick={() => setPreviewPhoto(obs.photoDataUrl)}
                  className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-line hover:opacity-90 transition"
                  title={l("Tap to expand photo", "फोटो मोठा करून पहा")}
                >
                  <img
                    src={obs.photoDataUrl}
                    alt="Observation thumbnail"
                    className="size-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white py-0.5 text-center">
                    {l("View", "पहा")}
                  </span>
                </button>
              ) : (
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-soil-100 text-soil">
                  <AlertTriangle size={20} />
                </span>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-ink">{short(obs.date)}</span>
                    {obs.stressCategory && (
                      <span className="rounded-md bg-sand px-2 py-0.5 text-[10px] font-semibold text-muted uppercase">
                        {obs.stressCategory}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(l("Delete this stress observation?", "ही नोंद काढून टाकायची का?"))) {
                        deleteStressObservation(obs.id);
                      }
                    }}
                    className="grid size-8 place-items-center rounded-full text-muted hover:text-soil transition"
                    title={l("Delete observation", "काढून टाका")}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <p className="text-xs text-ink/90 leading-relaxed break-words whitespace-pre-wrap">
                  {obs.symptomNotes}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── STAGE 3: Area-level Signal Context (Honest, Demo Labeled) ────────── */}
      <div className="mt-6 rounded-2xl border border-line bg-white p-4 shadow-xs">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-ink">
                {l("Area-level Signal Context", "परिसरातील माहिती")}
              </h3>
              <DemoBadge />
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              {l(
                "Source: Area signal integration point (Offline / Demo) · Resolution: Taluka level",
                "स्रोत: परिसरातील माहिती एकत्रीकरण बिंदू (ऑफलाइन / नमुना) · व्याप्ती: तालुका पातळी"
              )}
            </p>
          </div>
        </div>

        {/* Strictly neutral illustrative text — NO numbers, NO gauges, NO colors */}
        <div className="rounded-xl bg-sand/50 p-3 text-xs text-muted leading-relaxed">
          <p className="font-semibold text-ink mb-1">
            {l("No live taluka-level weather or moisture feed connected", "तालुका पातळीवरील थेट हवामान किंवा ओलावा माहिती जोडलेली नाही")}
          </p>
          <p>
            {l(
              "Area-level signals support awareness only; they do not prove plot-level damage or determine insurance eligibility. When official satellite feeds are integrated in the future, block-level moisture and rainfall trends will appear here with verification stamps.",
              "परिसरातील माहिती केवळ संदर्भासाठी आहे; यावरून वैयक्तिक नुकसान सिद्ध होत नाही किंवा विमा मंजुरी ठरत नाही. भविष्यात अधिकृत डेटा जोडल्यावर तालुका पातळीवरील पाऊस व ओलावा नोंदी येथे दिसतील."
            )}
          </p>
        </div>
      </div>

      {/* ── STAGE 3: Plain-Text Case Summary Generator ──────────────────────── */}
      <div className="mt-4 rounded-2xl border border-leaf-700/30 bg-leaf-50/50 p-4 shadow-xs">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="text-sm font-bold text-leaf-950 flex items-center gap-1.5">
              <FileText size={17} className="text-leaf-700" />
              <span>{l("Case Summary for Mitra / Officials", "मित्र किंवा अधिकाऱ्यांसाठी केस सारांश")}</span>
            </h3>
            <p className="text-xs text-leaf-900 mt-0.5">
              {l(
                "One-click copyable plain text with your plot details & stress notes.",
                "शेताचा तपशील व तुमच्या नोंदींचा एक-क्लिक कॉपी करता येणारा मजकूर."
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={copySummaryToClipboard}
            className={cx(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold shadow-sm transition",
              copiedSummary
                ? "bg-emerald-700 text-white"
                : "bg-leaf-700 text-white hover:bg-leaf-800"
            )}
          >
            {copiedSummary ? <CheckCheck size={16} /> : <Copy size={16} />}
            <span>{copiedSummary ? l("Copied!", "कॉपी झाले!") : l("Copy Summary", "सारांश कॉपी करा")}</span>
          </button>
        </div>

        {/* Copyable text container preview */}
        <div className="mt-2 rounded-xl border border-line bg-white p-3 font-mono text-[11px] leading-relaxed text-ink/80 max-h-44 overflow-y-auto whitespace-pre-wrap select-all">
          {generateCaseSummaryText()}
        </div>

        {/* Official Reporting Instructions & Next Step */}
        <div className="mt-3 space-y-1.5 border-t border-line/60 pt-2.5 text-xs text-muted">
          <p className="font-bold text-ink">
            {l("Suggested Next Steps & Official Reporting:", "पुढील पायऱ्या व अधिकृत नोंदणी:")}
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              {l(
                "Share this text with your local Gaon Mandi Mitra or Agriculture Assistant (कृषी सहाय्यक) via WhatsApp / SMS.",
                "हा मजकूर आपल्या गाव मंडी मित्राला किंवा कृषी सहाय्यकाला व्हॉट्सॲप / एसएमएसद्वारे पाठवा."
              )}
            </li>
            <li>
              <span className="font-semibold text-ink">
                {l("Official window: ", "अधिकृत मुदत: ")}
              </span>
              <span>
                {l(
                  "[Verify current reporting deadlines with your local Taluka Agriculture Office before use].",
                  "[वापरण्यापूर्वी स्थानिक तालुका कृषी कार्यालयाशी मुदतीची खात्री करा]."
                )}
              </span>
            </li>
            <li>
              <span className="font-semibold text-ink">
                {l("Official Portal / Helpline: ", "अधिकृत पोर्टल / मदत क्रमांक: ")}
              </span>
              <span>
                {l(
                  "[Verify official PMFBY / MahaDBT helpline before use].",
                  "[वापरण्यापूर्वी अधिकृत महाडीबीटी किंवा पीक विमा संपर्क तपासा]."
                )}
              </span>
            </li>
          </ul>
          <p className="text-[10px] text-muted italic mt-1">
            {l(
              "Note: This tool provides record-keeping support. It does not determine or approve an insurance claim.",
              "टीप: हे साधन केवळ शेतकरी नोंदींसाठी आहे. यावरून विम्याची मंजुरी किंवा निर्णय होत नाही."
            )}
          </p>
        </div>
      </div>

      {/* Crop growth timeline */}
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

      {/* Activity log */}
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
                      {a.preHarvestIntervalDays != null && l(`Wait ${num(a.preHarvestIntervalDays)} days before harvest`, `काढणीपूर्वी ${num(a.preHarvestIntervalDays)} दिवस थांबा`)}
                      {a.preHarvestIntervalDays != null && a.reEntryHours != null && " · "}
                      {a.reEntryHours != null && l(`${num(a.reEntryHours)} h before entering`, `शेतात जाण्यापूर्वी ${num(a.reEntryHours)} तास`)}
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

      {/* Activity Sheet */}
      {log && <LogActivitySheet fc={fc} initial={log} onClose={() => setLog(null)} />}

      {/* ── STAGE 2: Record Stress Observation Sheet ─────────────────────────── */}
      {showStressForm && (
        <RecordStressSheet
          fc={fc}
          today={today}
          onSave={(obs) => {
            addStressObservation(obs);
            setShowStressForm(false);
          }}
          onClose={() => setShowStressForm(false)}
        />
      )}

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div className="relative max-w-sm w-full bg-white rounded-3xl overflow-hidden p-3" onClick={(e) => e.stopPropagation()}>
            <img src={previewPhoto} alt="Stress observation preview" className="w-full rounded-2xl object-contain max-h-[70vh]" />
            <Button full onClick={() => setPreviewPhoto(null)} className="mt-3 min-h-11">
              {l("Close", "बंद करा")}
            </Button>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

/** Form sheet to record dated stress observation */
function RecordStressSheet({
  fc,
  today,
  onSave,
  onClose,
}: {
  fc: FarmCrop;
  today: string;
  onSave: (obs: Omit<StressObservation, "id" | "createdAt">) => void;
  onClose: () => void;
}) {
  const { l, toast } = useFarm();
  const [date, setDate] = useState(today);
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState<StressObservation["stressCategory"]>("disease");
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoSelect = async (file?: File) => {
    if (!file) return;
    setCompressing(true);
    try {
      const b64 = await compressObservationPhoto(file);
      setPhotoData(b64);
    } catch {
      toast(l("Failed to process photo.", "फोटो लोड करता आला नाही."));
    } finally {
      setCompressing(false);
    }
  };

  const handleSave = () => {
    if (!notes.trim()) {
      toast(l("Please enter notes describing the stress symptoms.", "कृपया लक्षणांचे वर्णन लिहा."));
      return;
    }
    onSave({
      farmCropId: fc.id,
      date,
      symptomNotes: notes.trim(),
      stressCategory: category,
      photoDataUrl: photoData,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-cream p-5 pb-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-soil text-white">
              <ShieldAlert size={18} />
            </span>
            <h3 className="text-lg font-bold text-ink">
              {l("Record Crop Stress", "पीक ताण नोंदवा")}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full text-muted hover:bg-line/40 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Privacy Note */}
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-sand/60 p-2.5 text-xs text-muted">
          <Lock size={14} className="mt-0.5 shrink-0 text-leaf-700" />
          <span>
            {l(
              "Notes & photos remain strictly on this phone. If this phone is shared, local files can be viewed.",
              "नोंदी व फोटो फक्त या फोनवर राहतात. फोन इतरांनी वापरल्यास ते पाहू शकतात."
            )}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {/* Date */}
          <Field label={l("Observation Date", "तपासणी तारीख")}>
            <input
              type="date"
              max={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
            />
          </Field>

          {/* Stress Category */}
          <Field label={l("Stress Type", "ताणाचा प्रकार")}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as StressObservation["stressCategory"])}
              className={inputCls}
            >
              <option value="disease">{l("Disease / Blight (रोग / करपा)", "रोग / करपा")}</option>
              <option value="pest">{l("Pest Attack (कीड / अळी / मावा)", "कीड / अळी / मावा")}</option>
              <option value="water">{l("Water Stress / Drought (पाणीटंचाई / ओलावा कमी)", "पाणीटंचाई / ओलावा कमी")}</option>
              <option value="weather">{l("Weather / Heat / Hail (उष्णता / गारपीट / अवकाळी)", "उष्णता / गारपीट / अवकाळी")}</option>
              <option value="other">{l("Other Problem (इतर समस्या)", "इतर समस्या")}</option>
            </select>
          </Field>

          {/* Notes description */}
          <Field
            label={l("Symptom Notes", "लक्षणांचे वर्णन")}
            hint={l("Describe what you observed (leaves yellowing, wilting, insect spotting...)", "तुम्हाला काय दिसले ते लिहा (उदा. पाने पिवळी पडली, डाग, कीड...)")}
          >
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={l(
                "E.g., Yellow rings on lower leaves, spread to 4-5 plants since yesterday...",
                "उदा. खालच्या पानांवर पिवळे डाग, कालपासून ४-५ झाडे कोमेजली आहेत..."
              )}
              className={cx(inputCls, "h-auto py-2")}
            />
          </Field>

          {/* Optional Photo Attachment */}
          <Field label={l("Attach Photo (Optional)", "फोटो जोडा (ऐच्छिक)")}>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cx(
                "flex h-24 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-3 text-center transition",
                photoData
                  ? "border-leaf-700 bg-white"
                  : "border-line bg-white/60 hover:bg-white"
              )}
            >
              {compressing ? (
                <div className="flex items-center gap-2 text-xs text-muted">
                  <RefreshCw size={16} className="animate-spin" />
                  <span>{l("Compressing image...", "फोटो आकार कमी करत आहे...")}</span>
                </div>
              ) : photoData ? (
                <div className="flex items-center gap-3 w-full">
                  <img src={photoData} alt="Attached thumbnail" className="size-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 text-left">
                    <span className="block text-xs font-bold text-leaf-800">
                      {l("Photo attached (compressed)", "फोटो जोडला (आकार कमी केला)")}
                    </span>
                    <span className="text-[11px] text-muted">
                      {l("Tap to change", "बदलण्यासाठी टॅप करा")}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoData(null);
                    }}
                    className="grid size-8 place-items-center rounded-full text-muted hover:text-soil"
                    title={l("Remove photo", "फोटो काढा")}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-muted font-medium">
                  <Camera size={20} className="text-leaf-700" />
                  <span>{l("Take or upload photo (stored locally)", "फोटो काढा किंवा निवडा (फोनवर राहील)")}</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  handlePhotoSelect(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </div>
          </Field>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={onClose} className="min-h-12">
            {l("Cancel", "रद्द")}
          </Button>
          <Button onClick={handleSave} className="min-h-12">
            {l("Save to Plot", "शेतावर जतन करा")}
          </Button>
        </div>
      </div>
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
        <Input className={inputCls} inputMode="decimal" value={area} maxLength={6} onChange={(e) => setArea(toAsciiDigits(e.target.value).replace(/[^\d.]/g, ""))} />
      </Field>
      <Field label={l("Days to harvest (from – to)", "काढणीपर्यंतचे दिवस (पासून – पर्यंत)")} error={err.dur} hint={l("Change this if your variety is shorter or longer.", "तुमचा वाण कमी-जास्त दिवसांचा असल्यास बदला.")}>
        <div className="flex items-center gap-2">
          <Input className={inputCls} inputMode="numeric" value={min} maxLength={3} onChange={(e) => setMin(toAsciiDigits(e.target.value).replace(/\D/g, ""))} />
          <span>–</span>
          <Input className={inputCls} inputMode="numeric" value={max} maxLength={3} onChange={(e) => setMax(toAsciiDigits(e.target.value).replace(/\D/g, ""))} />
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

/** Perennial crops: orchard age, young-orchard note, and starting this year's bahar / pruning. */
function OrchardPanel({ fc, crop }: { fc: FarmCrop; crop: PerennialCrop }) {
  const { l, tx, ctx, num, today, short, state, startCycle } = useFarm();
  const lang = state.lang === "mr" ? "mr" : "en";
  const age = orchardAgeYears(fc, today);
  const young = isYoungOrchard(fc, crop, today);
  const running = !!fc.cycleKey && !!fc.cycleStart && fc.status === "growing";
  const [open, setOpen] = useState(false);
  const month = Number(today.slice(5, 7));
  const [key, setKey] = useState(() => (crop.cycles.find((c) => c.startMonths.includes(month)) ?? crop.cycles[0]).key);
  const [start, setStart] = useState(today);
  const [err, setErr] = useState("");
  const save = () => {
    if (!start || start > today) return setErr(l("Choose today or an earlier date", "आजची किंवा मागची तारीख निवडा"));
    if (fc.plantedOn && start < fc.plantedOn) return setErr(l("After the planting date", "लागवडीच्या तारखेनंतर"));
    startCycle(fc.id, key, start);
    setOpen(false);
  };
  return (
    <Card className="mt-3 space-y-2">
      <p className="font-bold">
        🌳 {age != null ? l(`Orchard is ${num(age)} year${age === 1 ? "" : "s"} old`, `बाग ${num(age)} वर्षांची आहे`) : l("Orchard", "बाग")}
        {fc.plantCount ? ` · ${l(`${num(fc.plantCount)} plants`, `${num(fc.plantCount)} झाडे`)}` : ""}
      </p>
      {young && <p className="text-sm text-muted">{l(`Young orchard — usually no crop is taken until year ${crop.yearsToFirstHarvest[0]}. Follow the establishment care below.`, `लहान बाग — साधारण ${num(crop.yearsToFirstHarvest[0])} वर्षांपर्यंत बहार घेत नाहीत. खालील निगा पाळा.`)}</p>}
      {running ? (
        <p className="text-sm">
          {(() => {
            const c = crop.cycles.find((x) => x.key === fc.cycleKey)!;
            return l(`${c.name.en} started ${short(fc.cycleStart!)} · harvest ${monthRuns(c.harvestMonths, "en")}`, `${c.name.mr} सुरू ${short(fc.cycleStart!)} · काढणी ${monthRuns(c.harvestMonths, "mr")}`);
          })()}
        </p>
      ) : (
        !young && <p className="text-sm text-muted">{l("No cycle running now.", "सध्या कोणताही बहार सुरू नाही.")}</p>
      )}
      {!running && !open && (
        <Button full className="min-h-12" onClick={() => setOpen(true)}>
          <Plus size={18} /> {l("Start next cycle", "पुढचा बहार सुरू करा")}
        </Button>
      )}
      {open && (
        <div className="space-y-3 pt-1">
          <div className="grid gap-2" role="radiogroup" aria-label={l("Which cycle?", "कोणता बहार?")}>
            {crop.cycles.map((c) => (
              <button key={c.key} type="button" role="radio" aria-checked={key === c.key} onClick={() => setKey(c.key)} className={cx("min-h-12 rounded-2xl border-2 px-3 text-left", key === c.key ? "border-leaf-700 bg-leaf-50" : "border-line bg-white")}>
                <span className="block font-bold">{tx(c.name)}</span>
                <span className="block text-sm text-muted">
                  {l(`Starts ${monthRuns(c.startMonths, lang)} · harvest ${monthRuns(c.harvestMonths, lang)}`, `सुरुवात ${monthRuns(c.startMonths, lang)} · काढणी ${monthRuns(c.harvestMonths, lang)}`)}
                </span>
              </button>
            ))}
          </div>
          <Field label={l("Start date", "सुरुवातीची तारीख")} error={err} hint={ctx(crop.cycles.find((c) => c.key === key)!.startEvent)}>
            <input type="date" className={inputCls} value={start} max={today} onChange={(e) => setStart(e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {l("Cancel", "रद्द")}
            </Button>
            <Button onClick={save}>{l("Start", "सुरू करा")}</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
