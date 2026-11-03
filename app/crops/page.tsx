"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ChevronDown, ChevronRight, MessageCircleQuestion, Plus, Search } from "lucide-react";
import { CATEGORIES, CATEGORY_LABEL, CROPS, getCrop, searchCrops } from "@/lib/crops";
import { currentStage, dayNumber, daysBetween, expectedHarvestWindow, lastActivity, todayTasks, type TaskOccurrence } from "@/lib/lifecycle";
import type { CropInfo, FarmCrop } from "@/lib/types";
import { LogActivitySheet, TaskRow, useFarm } from "@/components/myfarm/ui";
import { SpeakButton } from "@/components/speech";
import { Card, LinkButton, PageHeader, SectionTitle, cx, inputCls } from "@/components/ui";

type Tab = "mine" | "library";

export default function MyFarmPage() {
  return (
    <Suspense fallback={null}>
      <MyFarm />
    </Suspense>
  );
}

function MyFarm() {
  const { l } = useFarm();
  const params = useSearchParams();
  const router = useRouter();
  const tab: Tab = params.get("tab") === "library" ? "library" : "mine";
  const setTab = (t: Tab) => router.replace(t === "library" ? "/crops?tab=library" : "/crops", { scroll: false });

  return (
    <div>
      <PageHeader title={l("My Farm", "माझी शेती")} />
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-2xl bg-sand p-1" role="tablist" aria-label={l("My Farm sections", "माझी शेती विभाग")}>
        {(["mine", "library"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cx("min-h-12 rounded-xl text-[16px] font-bold", tab === t ? "bg-white text-leaf-900 shadow" : "text-muted")}
          >
            {t === "mine" ? l("My Crops", "माझी पिके") : l("Crop Library", "पीक माहिती")}
          </button>
        ))}
      </div>
      {tab === "mine" ? <MyCrops /> : <Library />}
    </div>
  );
}

// ---- My Crops ------------------------------------------------------------------------------

function MyCrops() {
  const { state, l, tx, num, today } = useFarm();
  const [log, setLog] = useState<{ fc: FarmCrop; o: TaskOccurrence } | null>(null);
  const [showPast, setShowPast] = useState(false);
  const crops = state.myFarmCrops;
  const tasks = todayTasks(crops, getCrop, state.myTaskStates, today);
  const current = crops.filter((c) => c.status === "growing" || c.status === "planned").sort((a, b) => (a.status === b.status ? 0 : a.status === "growing" ? -1 : 1));
  const past = crops.filter((c) => c.status === "harvested" || c.status === "abandoned");
  const byId = (id: string) => crops.find((c) => c.id === id)!;
  const speech = tasks.map((t) => `${tx(getCrop(byId(t.farmCropId).cropId)?.name)}: ${tx(t.task.title)}${t.overdue ? l(", overdue", ", राहिलेले") : ""}`).join(". ");

  return (
    <div>
      <Card className="border-leaf-600/30">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold">{l("Today's tasks", "आजची कामे")}</h2>
          {tasks.length > 0 && <SpeakButton id="today-tasks" text={`${l("Today's tasks", "आजची कामे")}. ${speech}`} label={l("Read today's tasks", "आजची कामे वाचून दाखवा")} />}
        </div>
        {tasks.length ? (
          <div className="mt-3 space-y-2">
            {tasks.map((o) => (
              <TaskRow key={`${o.farmCropId}:${o.key}`} o={o} fc={byId(o.farmCropId)} showCrop onLog={(x) => setLog({ fc: byId(o.farmCropId), o: x })} />
            ))}
          </div>
        ) : (
          <p className="mt-2 py-4 text-center text-lg text-muted">{l("No tasks today 🌱", "आज काही काम नाही 🌱")}</p>
        )}
      </Card>

      <SectionTitle>{l("My crops", "माझी पिके")}</SectionTitle>
      <div className="space-y-3">
        {current.map((fc) => (
          <CropCard key={fc.id} fc={fc} />
        ))}
        {!current.length && <p className="text-muted">{l("You haven't added a crop yet.", "तुम्ही अजून पीक जोडलेले नाही.")}</p>}
      </div>
      <LinkButton href="/crops/new" full className="mt-4 min-h-14 text-lg">
        <Plus size={22} /> {l("Add my crop", "माझे पीक जोडा")}
      </LinkButton>

      {past.length > 0 && (
        <div className="mt-6">
          <button className="flex min-h-12 w-full items-center justify-between font-bold" onClick={() => setShowPast((x) => !x)} aria-expanded={showPast}>
            {l(`Past crops (${num(past.length)})`, `मागील पिके (${num(past.length)})`)}
            <ChevronDown className={cx("transition-transform", showPast && "rotate-180")} />
          </button>
          {showPast && (
            <div className="space-y-3">
              {past.map((fc) => (
                <CropCard key={fc.id} fc={fc} />
              ))}
            </div>
          )}
        </div>
      )}

      {log && <LogActivitySheet fc={log.fc} initial={{ type: log.o.task.type, linkedTaskId: log.o.key }} onClose={() => setLog(null)} />}
    </div>
  );
}

function CropCard({ fc }: { fc: FarmCrop }) {
  const { state, l, tx, num, today, short, ago, cropOf, cropTitle } = useFarm();
  const crop = cropOf(fc);
  if (!crop) return null;
  const now = currentStage(fc, crop, today);
  const hw = expectedHarvestWindow(fc);
  const spray = lastActivity(state.myFarmActivities, fc.id, ["pesticide", "fungicide"]);
  const chip =
    fc.status === "planned" && fc.plannedSowingDate
      ? (() => {
          const n = daysBetween(today, fc.plannedSowingDate);
          return n > 0 ? l(`Sowing in ${num(n)} days`, `${num(n)} दिवसांनी पेरणी`) : n === 0 ? l("Sowing today", "आज पेरणी") : l("Sowing date passed", "पेरणीची तारीख गेली");
        })()
      : fc.status === "harvested"
        ? l("Harvested", "काढणी झाली")
        : fc.status === "abandoned"
          ? l("Stopped", "बंद")
          : now
            ? l(`Day ${num(dayNumber(fc, today) ?? 0)} · ${tx(now.stage.name)}`, `दिवस ${num(dayNumber(fc, today) ?? 0)} · ${tx(now.stage.name)}`)
            : "";
  return (
    <Link href={`/crops/my/${fc.id}`} className="block">
      <Card className="space-y-2.5">
        <div className="flex items-start gap-3">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-leaf-50 text-3xl" aria-hidden>
            {crop.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold">{cropTitle(fc)}</p>
            <p className="truncate text-sm text-muted">
              {tx(fc.plotName) || l("My field", "माझे शेत")} · {num(fc.areaAcres)} {l("acre", "एकर")}
            </p>
            {chip && <span className="mt-1 inline-block rounded-full bg-leaf-100 px-2.5 py-0.5 text-sm font-semibold text-leaf-900">{chip}</span>}
          </div>
          <ChevronRight className="mt-4 shrink-0 text-muted" />
        </div>
        {fc.status === "growing" && now && (
          <div className="h-2 overflow-hidden rounded-full bg-leaf-100" role="progressbar" aria-valuenow={now.overall} aria-valuemin={0} aria-valuemax={100} aria-label={l("Crop progress", "पिकाची प्रगती")}>
            <div className="h-full rounded-full bg-leaf-600" style={{ width: `${now.overall}%` }} />
          </div>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {hw && fc.status !== "harvested" && fc.status !== "abandoned" && (
            <span>
              🌾 {l("Harvest", "काढणी")}: <span className="font-semibold">{short(hw.earliest)}–{short(hw.latest)}</span>
              {hw.estimate ? ` (${l("estimate", "अंदाज")})` : ""}
            </span>
          )}
          {fc.status === "growing" && (
            <span className="text-muted">
              {spray ? l(`Last spray: ${ago(daysBetween(spray.date, today))}`, `शेवटची फवारणी: ${ago(daysBetween(spray.date, today))}`) : l("No spray recorded", "फवारणीची नोंद नाही")}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}

// ---- Crop Library --------------------------------------------------------------------------

function Library() {
  const { l, tx } = useFarm();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CropInfo["category"] | "all">("all");
  const found = searchCrops(q).filter((c) => cat === "all" || c.category === cat);
  const cats = CATEGORIES.filter((c) => CROPS.some((x) => x.category === c));

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">{l("Search a crop", "पीक शोधा")}</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={22} />
        <input
          type="search"
          className={cx(inputCls, "min-h-14 rounded-2xl pl-12 text-lg")}
          placeholder={l("Search a crop — e.g. onion / कांदा", "पीक शोधा — उदा. कांदा / onion")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </label>
      <div className="-mx-4 mt-3 overflow-x-auto px-4">
        <div className="flex min-w-max gap-2">
          {(["all", ...cats] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={cx("min-h-11 rounded-full border px-4 font-semibold", cat === c ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white")}
            >
              {c === "all" ? l("All", "सर्व") : tx(CATEGORY_LABEL[c])}
            </button>
          ))}
        </div>
      </div>

      {found.length ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {found.map((c) => (
            <Link key={c.id} href={`/crops/library/${c.id}`} className="flex min-h-32 flex-col items-center justify-center gap-1 rounded-3xl border border-line bg-white p-3 text-center shadow-sm active:scale-[0.98]">
              <span className="text-5xl" aria-hidden>
                {c.emoji}
              </span>
              <span className="text-lg font-bold leading-tight">{tx(c.name)}</span>
              <span className="text-sm text-muted">{tx(CATEGORY_LABEL[c.category])}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-line bg-white/60 p-6 text-center">
          <p className="text-4xl" aria-hidden>
            🔍
          </p>
          <p className="mt-2 text-lg font-bold">{l("We don't have this crop yet", "हे पीक अजून आमच्याकडे नाही")}</p>
          <p className="mt-1 text-muted">{l("You can ask Krishi Mitra about it.", "तुम्ही कृषी मित्राला याबद्दल विचारू शकता.")}</p>
          <LinkButton
            href={`/ask?q=${encodeURIComponent(l(`How do I grow ${q.trim()} in Maharashtra? When to sow, how long it takes, and what care it needs.`, `महाराष्ट्रात ${q.trim()} कसे घ्यायचे? पेरणी कधी, किती दिवस लागतात आणि काय काळजी घ्यावी?`))}`}
            className="mt-4"
          >
            <MessageCircleQuestion size={20} /> {l("Ask Krishi Mitra", "कृषी मित्राला विचारा")}
          </LinkButton>
        </div>
      )}
    </div>
  );
}
