"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ChevronDown, ChevronRight, LoaderCircle, MessageCircleQuestion, Plus, Search, Square, Volume2 } from "lucide-react";
import { CATEGORY_LABEL, CATEGORY_ORDER, CROP_INDEX, categoryCounts, searchCrops, seasonLine, sortAZ, sortPopular, type CropIndexEntry } from "@/lib/crops";
import { useCrops } from "@/lib/crops/load";
import { REGION_LABEL, regionForDistrict } from "@/lib/regions";
import { currentStage, dayNumber, daysBetween, expectedHarvestWindow, firstCropYear, lastActivity, monthOf, todayTasks, type TaskOccurrence } from "@/lib/lifecycle";
import type { CropCategory, CropInfo, FarmCrop } from "@/lib/types";
import { LogActivitySheet, TaskRow, useFarm } from "@/components/myfarm/ui";
import { SpeakButton } from "@/components/speech";
import { buildBriefing } from "@/lib/farm-briefing";
import { useSpeech } from "@/lib/speech";
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
  const { state, l, tx, num, today, account } = useFarm();
  const [log, setLog] = useState<{ fc: FarmCrop; o: TaskOccurrence } | null>(null);
  const [showPast, setShowPast] = useState(false);
  const crops = state.myFarmCrops;
  // tasks need each crop's stages, so load the farm's crops (a few small files)
  const lib = useCrops(crops.map((c) => c.cropId));
  const tasks = todayTasks(crops, lib.get, state.myTaskStates, today);
  const current = crops.filter((c) => c.status === "growing" || c.status === "planned").sort((a, b) => (a.status === b.status ? 0 : a.status === "growing" ? -1 : 1));
  const past = crops.filter((c) => c.status === "harvested" || c.status === "abandoned");
  const byId = (id: string) => crops.find((c) => c.id === id)!;
  const speech = tasks.map((t) => `${tx(lib.get(byId(t.farmCropId).cropId)?.name)}: ${tx(t.task.title)}${t.overdue ? l(", overdue", ", राहिलेले") : ""}`).join(". ");
  const briefing = () =>
    buildBriefing(
      { crops, activities: state.myFarmActivities, taskStates: state.myTaskStates, firstName: account?.name?.trim().split(/\s+/)[0], getCrop: lib.get },
      today,
      state.lang === "mr" ? "mr" : "en",
    );

  return (
    <div>
      {lib.ready && current.length > 0 && <BriefingButton parts={briefing} />}
      <Card className="border-leaf-600/30">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold">{l("Today's tasks", "आजची कामे")}</h2>
          {tasks.length > 0 && <SpeakButton id="today-tasks" text={`${l("Today's tasks", "आजची कामे")}. ${speech}`} label={l("Read today's tasks", "आजची कामे वाचून दाखवा")} />}
        </div>
        {!lib.ready ? (
          <div className="mt-3 h-24 animate-pulse rounded-2xl bg-sand" aria-label={l("Loading", "लोड होत आहे")} />
        ) : tasks.length ? (
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
          <CropCard key={fc.id} fc={fc} crop={lib.get(fc.cropId)} speech={() => briefing().find((p) => p.id === fc.id)?.text ?? ""} />
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
                <CropCard key={fc.id} fc={fc} crop={lib.get(fc.cropId)} />
              ))}
            </div>
          )}
        </div>
      )}

      {log && <LogActivitySheet fc={log.fc} initial={{ type: log.o.task.type, linkedTaskId: log.o.key }} onClose={() => setLog(null)} />}
    </div>
  );
}

/** Big "Listen to today's work" button: reads the briefing part by part, highlighting each crop card. */
function BriefingButton({ parts }: { parts: () => { id: string; text: string }[] }) {
  const { speakAll, stop, speakingId, loadingId, l } = useSpeech();
  const ids = new Set(["greeting", "summary", "closing"]);
  const active = (speakingId && (ids.has(speakingId) || speakingId.startsWith("fc"))) || (loadingId && ids.has(loadingId));
  return (
    <button
      type="button"
      onClick={() => (active ? stop() : void speakAll(parts()))}
      aria-pressed={!!active}
      className={cx("mb-3 flex min-h-16 w-full items-center justify-center gap-3 rounded-3xl px-4 text-lg font-bold text-white shadow-sm", active ? "bg-soil" : "bg-leaf-700 hover:bg-leaf-900")}
    >
      {loadingId === "greeting" ? <LoaderCircle size={24} className="animate-spin" /> : active ? <Square size={20} fill="currentColor" /> : <Volume2 size={26} />}
      {active ? l("Stop", "थांबवा") : l("Listen to today's work", "आजचे काम ऐका")}
    </button>
  );
}

function CropCard({ fc, crop, speech }: { fc: FarmCrop; crop: CropInfo | undefined; speech?: () => string }) {
  const { state, l, tx, num, today, short, ago, cropOf, cropTitle } = useFarm();
  const { speakingId } = useSpeech();
  const entry = cropOf(fc);
  if (!entry) return null;
  const now = crop ? currentStage(fc, crop, today) : null;
  const hw = crop ? expectedHarvestWindow(fc, crop) : null;
  const spray = lastActivity(state.myFarmActivities, fc.id, ["pesticide", "fungicide"]);
  const day = dayNumber(fc, today, crop);
  const young = crop?.lifecycle === "perennial" && now?.phase === "establishment" ? firstCropYear(fc, crop) : null;
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
          : crop && fc.kind === "perennial" && !now
            ? l("Waiting for the next cycle", "पुढील बहाराची प्रतीक्षा")
            : now && day != null
              ? l(`Day ${num(day)} · ${tx(now.stage.name)}`, `दिवस ${num(day)} · ${tx(now.stage.name)}`)
              : "";
  return (
    <div className="relative">
    <Link href={`/crops/my/${fc.id}`} className="block">
      <Card className={cx("space-y-2.5 transition-shadow", speakingId === fc.id && "ring-4 ring-gold")}>
        <div className="flex items-start gap-3">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-leaf-50 text-3xl" aria-hidden>
            {entry.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold">{cropTitle(fc)}</p>
            <p className="truncate text-sm text-muted">
              {tx(fc.plotName) || l("My field", "माझे शेत")} · {num(fc.areaAcres)} {l("acre", "एकर")}
              {fc.kind === "perennial" && fc.plantCount ? ` · ${l(`${num(fc.plantCount)} plants`, `${num(fc.plantCount)} झाडे`)}` : ""}
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
          {young ? (
            <span>🌱 {l(`Young orchard — first crop expected in ${young}`, `लहान बाग — पहिले उत्पादन ${num(young)} मध्ये अपेक्षित`)}</span>
          ) : (
            hw &&
            fc.status !== "harvested" &&
            fc.status !== "abandoned" && (
              <span>
                🌾 {l("Harvest", "काढणी")}: <span className="font-semibold">{short(hw.earliest)}–{short(hw.latest)}</span>
                {hw.estimate ? ` (${l("estimate", "अंदाज")})` : ""}
              </span>
            )
          )}
          {fc.status === "growing" && (
            <span className="text-muted">
              {spray ? l(`Last spray: ${ago(daysBetween(spray.date, today))}`, `शेवटची फवारणी: ${ago(daysBetween(spray.date, today))}`) : l("No spray recorded", "फवारणीची नोंद नाही")}
            </span>
          )}
        </div>
      </Card>
    </Link>
      {speech && fc.status !== "harvested" && fc.status !== "abandoned" && (
        <div className="absolute right-11 top-3">
          <SpeakButton id={fc.id} text={speech} size="sm" label={l(`Listen: ${tx(entry.name)}`, `ऐका: ${tx(entry.name)}`)} />
        </div>
      )}
    </div>
  );
}

// ---- Crop Library (index only — no crop data file is loaded here) ---------------------------

type Sort = "popular" | "az";

function Library() {
  const { l, tx, num, today, state, account } = useFarm();
  const lang = state.lang === "mr" ? "mr" : "en";
  const myRegion = regionForDistrict(account?.district);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CropCategory | "all">("all");
  const [regionOn, setRegionOn] = useState(!!myRegion);
  const [nowOn, setNowOn] = useState(false);
  const [polyOn, setPolyOn] = useState(false);
  const [sort, setSort] = useState<Sort>("popular");
  const month = monthOf(today);

  // every filter except the category feeds the chip counts, so each chip shows what it would give
  let base: CropIndexEntry[] = q.trim() ? searchCrops(q) : CROP_INDEX;
  if (regionOn && myRegion) base = base.filter((c) => c.regions.includes(myRegion));
  if (nowOn) base = base.filter((c) => c.months.includes(month));
  if (polyOn) base = base.filter((c) => c.protectedCultivation);
  const counts = categoryCounts(base);
  const filtered = cat === "all" ? base : base.filter((c) => c.category === cat);
  // a search keeps its relevance order; otherwise sort
  const shown = q.trim() ? filtered : sort === "popular" ? sortPopular(filtered, myRegion, lang) : sortAZ(filtered, lang);
  const cats = CATEGORY_ORDER.filter((c) => CROP_INDEX.some((x) => x.category === c));

  const toggle = (on: boolean, set: (v: boolean) => void, label: string) => (
    <button onClick={() => set(!on)} aria-pressed={on} className={cx("min-h-11 rounded-full border px-4 text-sm font-semibold", on ? "border-leaf-700 bg-leaf-50 text-leaf-900" : "border-line bg-white text-muted")}>
      {on ? "✓ " : ""}
      {label}
    </button>
  );

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

      <div className="-mx-4 mt-3 overflow-x-auto px-4 [scrollbar-width:none]">
        <div className="flex min-w-max gap-2">
          <button onClick={() => setCat("all")} aria-pressed={cat === "all"} className={cx("min-h-11 rounded-full border px-4 font-semibold", cat === "all" ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white")}>
            {l("All", "सर्व")} <span className="opacity-75">{num(base.length)}</span>
          </button>
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              disabled={!counts[c]}
              className={cx("min-h-11 rounded-full border px-4 font-semibold disabled:opacity-40", cat === c ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white")}
            >
              <span aria-hidden>{CATEGORY_LABEL[c].emoji}</span> {tx(CATEGORY_LABEL[c])} <span className="opacity-75">{num(counts[c] ?? 0)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {myRegion && toggle(regionOn, setRegionOn, l(`My region: ${REGION_LABEL[myRegion].en}`, `माझा भाग: ${REGION_LABEL[myRegion].mr}`))}
        {toggle(nowOn, setNowOn, l("Good to sow/plant now", "आता पेरणी/लागवडीस योग्य"))}
        {toggle(polyOn, setPolyOn, l("Polyhouse", "पॉलीहाऊस"))}
      </div>
      {!q.trim() && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="text-muted">{l("Sort:", "क्रम:")}</span>
          {(["popular", "az"] as const).map((s) => (
            <button key={s} onClick={() => setSort(s)} aria-pressed={sort === s} className={cx("min-h-10 rounded-full px-3 font-semibold", sort === s ? "bg-leaf-100 text-leaf-900" : "text-muted")}>
              {s === "popular" ? (myRegion ? l("Popular in my region", "माझ्या भागात लोकप्रिय") : l("Popular", "लोकप्रिय")) : l("A–Z", "अ–ज्ञ")}
            </button>
          ))}
        </div>
      )}

      {shown.length ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {shown.map((c) => (
            <Link key={c.id} href={`/crops/library/${c.id}`} className="flex min-h-36 flex-col items-center justify-center gap-1 rounded-3xl border border-line bg-white p-3 text-center shadow-sm active:scale-[0.98]">
              <span className="text-5xl" aria-hidden>
                {c.emoji}
              </span>
              <span className="text-lg font-bold leading-tight">{tx(c.name)}</span>
              <span className="text-xs text-muted">{tx(CATEGORY_LABEL[c.category])}</span>
              <span className="text-xs text-leaf-700">{seasonLine(c, lang)}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-line bg-white/60 p-6 text-center">
          <p className="text-4xl" aria-hidden>
            🔍
          </p>
          <p className="mt-2 text-lg font-bold">{q.trim() ? l("We don't have this crop yet", "हे पीक अजून आमच्याकडे नाही") : l("No crops match these filters", "या निवडीत एकही पीक नाही")}</p>
          {q.trim() ? (
            <>
              <p className="mt-1 text-muted">{l("You can ask Krishi Mitra about it.", "तुम्ही कृषी मित्राला याबद्दल विचारू शकता.")}</p>
              <LinkButton
                href={`/ask?q=${encodeURIComponent(l(`How do I grow ${q.trim()} in Maharashtra? When to sow, how long it takes, and what care it needs.`, `महाराष्ट्रात ${q.trim()} कसे घ्यायचे? पेरणी कधी, किती दिवस लागतात आणि काय काळजी घ्यावी?`))}`}
                className="mt-4"
              >
                <MessageCircleQuestion size={20} /> {l("Ask Krishi Mitra", "कृषी मित्राला विचारा")}
              </LinkButton>
            </>
          ) : (
            <p className="mt-1 text-muted">{l("Turn off a filter to see more.", "अधिक पाहण्यासाठी एखादी निवड बंद करा.")}</p>
          )}
        </div>
      )}
    </div>
  );
}
