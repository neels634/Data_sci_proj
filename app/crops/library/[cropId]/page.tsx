"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Search, Sprout } from "lucide-react";
import { CATEGORY_LABEL, cropEntry, monthRuns, seasonName } from "@/lib/crops";
import { useCrop } from "@/lib/crops/load";
import { sectionSpeech, sectionTitle, sectionsFor, type SectionKey } from "@/lib/crop-speech";
import { REGION_LABEL } from "@/lib/regions";
import { monthOf } from "@/lib/lifecycle";
import { useSpeech } from "@/lib/speech";
import type { CropInfo, PerennialCrop } from "@/lib/types";
import { NotVerified, StageTimeline, useFarm } from "@/components/myfarm/ui";
import { ReadPageButton, SpeakButton } from "@/components/speech";
import { Card, Empty, LinkButton, PageHeader, cx } from "@/components/ui";

export default function CropInfoPage() {
  const { cropId } = useParams<{ cropId: string }>();
  const { l, tx } = useFarm();
  const crop = useCrop(cropId);
  const entry = cropEntry(cropId);
  if (crop === null)
    return (
      <div>
        <PageHeader back="/crops?tab=library" title={l("Crop not found", "पीक सापडले नाही")} />
        <Empty icon={<Search size={32} />} title={l("We don't have this crop yet", "हे पीक अजून आमच्याकडे नाही")} body={l("Try the Crop Library search.", "पीक माहितीमध्ये शोधून पाहा.")} />
      </div>
    );
  if (crop === undefined)
    return (
      <div aria-busy="true">
        <PageHeader back="/crops?tab=library" title={entry ? `${entry.emoji} ${tx(entry.name)}` : "…"} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="mt-4 h-28 animate-pulse rounded-2xl bg-sand" />
        ))}
      </div>
    );
  return <CropGuide crop={crop} />;
}

function CropGuide({ crop }: { crop: CropInfo }) {
  const { l, tx, ctx, num, today, state } = useFarm();
  const lang = state.lang === "mr" ? "mr" : "en";
  const month = monthOf(today);
  const range = (a: number, b: number) => (a === b ? num(a) : `${num(a)}–${num(b)}`);
  const keys = sectionsFor(crop);
  const cycleKeys = keys.filter((k) => k.startsWith("cycle:"));
  const title = (k: SectionKey): string => sectionTitle(crop, k, lang);
  const spoken = (k: SectionKey) => sectionSpeech(crop, k, lang, month);
  const parts = keys.map((k) => ({ id: `${crop.id}:${k}`, text: spoken(k) }));
  const regions = crop.regions.map((r) => tx(REGION_LABEL[r])).join(", ");

  const body = (k: SectionKey): React.ReactNode => {
    switch (k) {
      case "overview": {
        const p = (x: { en: string; mr: string }) => x[lang];
        return (
          <div className="space-y-2 text-[16px] leading-relaxed">
            <p>
              {crop.lifecycle === "perennial"
                ? l(
                    `${p(crop.name)} is a perennial ${CATEGORY_LABEL[crop.category].en.toLowerCase()} crop. The first crop comes ${range(...crop.yearsToFirstHarvest)} years after planting.`,
                    `${p(crop.name)} हे ${CATEGORY_LABEL[crop.category].mr} गटातील बहुवर्षीय पीक आहे. लागवडीनंतर ${range(...crop.yearsToFirstHarvest)} वर्षांनी पहिले उत्पादन मिळते.`,
                  )
                : (() => {
                    const days = crop.seasons.flatMap((s) => s.durationDays);
                    return l(
                      `${p(crop.name)} (${CATEGORY_LABEL[crop.category].en.toLowerCase()}) takes about ${range(Math.min(...days), Math.max(...days))} days from sowing to harvest.`,
                      `${p(crop.name)} (${CATEGORY_LABEL[crop.category].mr}) पेरणीपासून काढणीपर्यंत साधारण ${range(Math.min(...days), Math.max(...days))} दिवस घेते.`,
                    );
                  })()}
            </p>
            <p className="text-[15px] text-muted">
              {l("Grown in: ", "कोठे घेतात: ")}
              <span className="font-semibold text-ink">{regions}</span>
              {crop.majorDistricts ? ` · ${tx(crop.majorDistricts)}` : ""}
            </p>
            {crop.protectedCultivation && <p className="text-[15px] font-semibold text-leaf-700">{l("Also grown in polyhouse / shade net", "पॉलीहाऊस / शेडनेटमध्येही घेतात")}</p>}
          </div>
        );
      }
      case "sow":
        if (crop.lifecycle !== "seasonal") return null;
        return (
          <div className="space-y-2">
            {crop.seasons.map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-2 rounded-xl bg-leaf-50 p-3">
                <span>
                  <span className="block font-bold">{tx(seasonName(crop, i))}</span>
                  <span className="block text-sm">{ctx(s.sowingWindow)}</span>
                  <span className="block text-sm text-muted">{l(`${range(...s.durationDays)} days to harvest`, `काढणीपर्यंत ${range(...s.durationDays)} दिवस`)}</span>
                </span>
                {s.sowingMonths.includes(month) && <span className="shrink-0 rounded-full bg-leaf-700 px-3 py-1 text-sm font-semibold text-white">{l("Good time to sow now ✓", "आता पेरणीची योग्य वेळ ✓")}</span>}
              </div>
            ))}
          </div>
        );
      case "planting":
        if (crop.lifecycle !== "perennial") return null;
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Fact label={l("Plants per acre", "एकरी झाडे")} value={range(...crop.plantsPerAcre)} />
              <Fact label={l("First crop after", "पहिले उत्पादन")} value={l(`${range(...crop.yearsToFirstHarvest)} years`, `${range(...crop.yearsToFirstHarvest)} वर्षांनी`)} />
              <Fact label={l("Bears for", "उत्पादन देते")} value={l(`${range(...crop.economicLifeYears)} years`, `${range(...crop.economicLifeYears)} वर्षे`)} />
              <Fact label={l("Planting months", "लागवडीचे महिने")} value={monthRuns(crop.plantingMonths, lang)} />
            </div>
            <p className="text-[16px]">
              <span className="font-semibold">{l("When: ", "केव्हा: ")}</span>
              {ctx(crop.plantingWindow)}
            </p>
            <p className="text-[16px]">
              <span className="font-semibold">{l("Planting material: ", "लागवड साहित्य: ")}</span>
              {ctx(crop.plantingMaterial)}
            </p>
            <p className="text-[16px]">
              <span className="font-semibold">{l("Spacing: ", "अंतर: ")}</span>
              {ctx(crop.spacing)}
            </p>
            {crop.plantingMonths.includes(month) && <p className="inline-block rounded-full bg-leaf-700 px-3 py-1 text-sm font-semibold text-white">{l("Good time to plant now ✓", "आता लागवडीची योग्य वेळ ✓")}</p>}
          </div>
        );
      case "soil":
        return <p className="text-[16px] leading-relaxed">{`${ctx(crop.soil)} ${ctx(crop.climate)}`}</p>;
      case "seed":
        if (crop.lifecycle !== "seasonal") return null;
        return (
          <div className="space-y-1 text-[16px] leading-relaxed">
            <p>
              <span className="font-semibold">{l("Planting material: ", "लागवड साहित्य: ")}</span>
              {ctx(crop.plantingMaterial)}
            </p>
            <p>{`${ctx(crop.seedRate)} ${ctx(crop.spacing)}`}</p>
          </div>
        );
      case "nursery":
        return (
          <p className="text-[16px] leading-relaxed">
            {l(
              `Raise seedlings in a nursery for about ${num(crop.lifecycle === "seasonal" ? (crop.nurseryDays ?? 30) : 30)} days, then transplant them to the main field.`,
              `साधारण ${num(crop.lifecycle === "seasonal" ? (crop.nurseryDays ?? 30) : 30)} दिवस रोपवाटिकेत रोपे वाढवा, मग मुख्य शेतात पुनर्लागवड करा.`,
            )}
          </p>
        );
      case "irrigation":
        return <p className="text-[16px] leading-relaxed">{ctx(crop.irrigation)}</p>;
      case "nutrients":
        return <p className="text-[16px] leading-relaxed">{ctx(crop.nutrientGuide)}</p>;
      case "varieties":
        return (
          <ul className="space-y-1.5 text-[15px]">
            {crop.varieties.map((v) => (
              <li key={v.name}>
                <span className="font-bold">{v.name}</span> — {ctx(v.note)}
              </li>
            ))}
          </ul>
        );
      case "stages":
        return crop.lifecycle === "seasonal" ? <StageTimeline stages={crop.stages.map((stage) => ({ stage }))} /> : null;
      case "establishment":
        return crop.lifecycle === "perennial" ? <StageTimeline stages={crop.establishment.map((stage) => ({ stage }))} /> : null;
      case "ratoon":
        if (crop.lifecycle !== "seasonal") return null;
        return (
          <div className="space-y-2 text-[16px]">
            {crop.ratoon?.allowed && (
              <p>
                <span className="font-semibold">{l("Ratoon: ", "खोडवा: ")}</span>
                {ctx(crop.ratoon.note)}{" "}
                {l(`Usually ${num(crop.ratoon.cycles)} ratoon crops of ${range(...crop.ratoon.durationDays)} days each.`, `साधारण ${num(crop.ratoon.cycles)} वेळा खोडवा; प्रत्येक ${range(...crop.ratoon.durationDays)} दिवसांचा.`)}
              </p>
            )}
            {crop.flushes && (
              <p>
                <span className="font-semibold">{l("Pickings: ", "तोडणी: ")}</span>
                {ctx(crop.flushes.note)} {l(`Every ${num(crop.flushes.everyDays)} days, about ${num(crop.flushes.count)} times.`, `दर ${num(crop.flushes.everyDays)} दिवसांनी, साधारण ${num(crop.flushes.count)} वेळा.`)}
              </p>
            )}
          </div>
        );
      case "problems":
        return (
          <div className="space-y-3">
            {crop.commonProblems.map((p) => (
              <div key={p.name.en}>
                <p className="font-bold">{tx(p.name)}</p>
                <p className="text-[15px]">
                  <span className="font-semibold">{l("Signs: ", "लक्षणे: ")}</span>
                  {ctx(p.signs)}
                </p>
                <p className="text-[15px]">
                  <span className="font-semibold">{l("Prevention: ", "प्रतिबंध: ")}</span>
                  {ctx(p.prevention)}
                </p>
              </div>
            ))}
          </div>
        );
      case "harvest":
        return <p className="text-[16px]">{ctx(crop.harvestSigns)}</p>;
      case "storage":
        return (
          <>
            <p className="text-[16px]">{ctx(crop.postHarvest)}</p>
            <p className="mt-2 text-[16px]">{ctx(crop.marketTips)}</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb-24">
      <PageHeader back="/crops?tab=library" title={`${crop.emoji} ${tx(crop.name)}`} sub={tx(CATEGORY_LABEL[crop.category])} />
      {crop.reviewStatus === "draft" && <NotVerified />}
      <div className="mt-3">
        <ReadPageButton parts={parts} groupId={crop.id} />
      </div>

      {keys
        .filter((k) => !k.startsWith("cycle:"))
        .flatMap((k) => {
          const card = (
            <Section key={k} id={`${crop.id}:${k}`} title={title(k)} spoken={spoken(k)}>
              {body(k)}
            </Section>
          );
          // the yearly cycles come right after establishment, as tabs
          return k === "establishment" && cycleKeys.length && crop.lifecycle === "perennial" ? [card, <Cycles key="cycles" crop={crop} spoken={spoken} />] : [card];
        })}

      <p className="mt-4 text-sm text-muted">
        {l("Source: ", "स्रोत: ")}
        {crop.source}
      </p>
      {crop.reviewStatus === "draft" && (
        <p className="mt-1">
          <NotVerified />
        </p>
      )}

      <div className="fixed inset-x-0 bottom-[65px] z-20 mx-auto max-w-md border-t border-line bg-white/95 px-3 py-2.5 backdrop-blur">
        <LinkButton href={`/crops/new?crop=${crop.id}`} full className="min-h-14 text-lg">
          <Sprout size={22} /> {l("Grow this crop", "हे पीक घ्या")}
        </LinkButton>
      </div>
    </div>
  );
}

/** One tab per bahar / pruning cycle, each with its timeline and harvest months. */
function Cycles({ crop, spoken }: { crop: PerennialCrop; spoken: (k: SectionKey) => string }) {
  const { l, tx, ctx, state } = useFarm();
  const lang = state.lang === "mr" ? "mr" : "en";
  const { speakingId } = useSpeech();
  const [active, setActive] = useState(crop.cycles[0].key);
  const cy = crop.cycles.find((c) => c.key === active)!;
  const id = `${crop.id}:cycle:${cy.key}`;
  const reading = crop.cycles.some((c) => speakingId === `${crop.id}:cycle:${c.key}`);
  return (
    <Card className={cx("mt-4 transition-shadow", reading && "border-leaf-700 ring-4 ring-leaf-100")}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold">{crop.cycles.length > 1 ? l("Yearly crop — choose one", "वार्षिक बहार — एक निवडा") : l("Yearly crop", "वार्षिक उत्पादन")}</h2>
        <SpeakButton id={id} text={spoken(`cycle:${cy.key}`)} label={tx(cy.name)} />
      </div>
      {crop.cycles.length > 1 && (
        <div className="-mx-1 mb-3 flex gap-1 overflow-x-auto rounded-2xl bg-sand p-1" role="tablist">
          {crop.cycles.map((c) => (
            <button key={c.key} role="tab" aria-selected={c.key === active} onClick={() => setActive(c.key)} className={cx("min-h-11 flex-1 whitespace-nowrap rounded-xl px-3 text-sm font-bold", c.key === active ? "bg-white text-leaf-900 shadow" : "text-muted")}>
              {tx(c.name)}
            </button>
          ))}
        </div>
      )}
      <div className="space-y-1 text-[15px]">
        <p>
          <span className="font-semibold">{l("Starts: ", "सुरुवात: ")}</span>
          {monthRuns(cy.startMonths, lang, true)} — {ctx(cy.startEvent)}
        </p>
        <p>
          <span className="font-semibold">{l("Harvest: ", "काढणी: ")}</span>
          {monthRuns(cy.harvestMonths, lang, true)}
        </p>
        <p className="text-muted">{ctx(cy.note)}</p>
      </div>
      <div className="mt-3">
        <StageTimeline key={cy.key} stages={cy.stages.map((stage) => ({ stage }))} />
      </div>
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-leaf-50 p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}

/** A card with its own speaker; highlighted while it is being read. */
function Section({ id, title, spoken, children }: { id: string; title: string; spoken: string; children: React.ReactNode }) {
  const { speakingId } = useSpeech();
  const reading = speakingId === id;
  return (
    <Card className={cx("mt-4 scroll-mt-20 transition-shadow", reading && "border-leaf-700 ring-4 ring-leaf-100")} aria-current={reading ? "true" : undefined}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <SpeakButton id={id} text={spoken} label={title} />
      </div>
      {children}
    </Card>
  );
}
