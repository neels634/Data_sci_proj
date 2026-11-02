"use client";

import { useParams } from "next/navigation";
import { Search, Sprout } from "lucide-react";
import { CATEGORY_LABEL, getCrop, seasonName, sectionsFor, spokenSection, type SectionKey } from "@/lib/crops";
import { monthOf } from "@/lib/lifecycle";
import { useSpeech } from "@/lib/speech";
import type { CropInfo } from "@/lib/types";
import { NotVerified, StageTimeline, useFarm } from "@/components/myfarm/ui";
import { ReadPageButton, SpeakButton } from "@/components/speech";
import { Card, Empty, LinkButton, PageHeader, cx } from "@/components/ui";

export default function CropInfoPage() {
  const { cropId } = useParams<{ cropId: string }>();
  const { l, tx, ctx, num, today, state } = useFarm();
  const crop = getCrop(cropId);
  if (!crop)
    return (
      <div>
        <PageHeader back="/crops?tab=library" title={l("Crop not found", "पीक सापडले नाही")} />
        <Empty icon={<Search size={32} />} title={l("We don't have this crop yet", "हे पीक अजून आमच्याकडे नाही")} body={l("Try the Crop Library search.", "पीक माहितीमध्ये शोधून पाहा.")} />
      </div>
    );

  const lang = state.lang === "mr" ? "mr" : "en";
  const month = monthOf(today);
  const days = crop.seasons.flatMap((s) => s.durationDays);
  const range = (a: number, b: number) => `${num(a)}–${num(b)}`;
  const title: Record<SectionKey, string> = {
    overview: l("Overview", "थोडक्यात"),
    sow: l("When to sow", "पेरणी कधी करावी"),
    soil: l("Soil & climate", "जमीन व हवामान"),
    seed: l("Seed rate & spacing", "बियाणे व अंतर"),
    nursery: l("Nursery & transplanting", "रोपवाटिका व पुनर्लागवड"),
    irrigation: l("Irrigation", "पाणी"),
    nutrients: l("Nutrients (general)", "खते (सर्वसाधारण)"),
    stages: l("Growth stages", "वाढीच्या अवस्था"),
    problems: l("Common problems", "नेहमीच्या समस्या"),
    harvest: l("Harvest signs", "काढणीची लक्षणे"),
    storage: l("Storage & selling tips", "साठवण व विक्री"),
  };
  const keys = sectionsFor(crop);
  const spoken = (k: SectionKey) => `${title[k]}. ${spokenSection(crop, k, lang, month)}`;
  const parts = keys.map((k) => ({ id: `${crop.id}:${k}`, text: spoken(k) }));

  const body: Record<SectionKey, React.ReactNode> = {
    overview: (
      <p className="text-[16px] leading-relaxed">
        {l(
          `${crop.name.en} (${CATEGORY_LABEL[crop.category].en.toLowerCase()}) is ${crop.method === "transplant" ? "raised in a nursery and then transplanted" : crop.method === "both" ? "sown directly or transplanted" : "sown directly in the field"}. It takes about ${range(Math.min(...days), Math.max(...days))} days from sowing to harvest.`,
          `${crop.name.mr} (${CATEGORY_LABEL[crop.category].mr}) ${crop.method === "transplant" ? "रोपवाटिकेत रोपे करून मग पुनर्लागवड केली जाते" : crop.method === "both" ? "थेट पेरणी किंवा पुनर्लागवड करून घेता येते" : "शेतात थेट पेरले जाते"}. पेरणीपासून काढणीपर्यंत साधारण ${range(Math.min(...days), Math.max(...days))} दिवस लागतात.`,
        )}
      </p>
    ),
    sow: (
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
    ),
    soil: <p className="text-[16px] leading-relaxed">{`${ctx(crop.soil)} ${ctx(crop.climate)}`}</p>,
    seed: <p className="text-[16px] leading-relaxed">{`${ctx(crop.seedRate)} ${ctx(crop.spacing)}`}</p>,
    nursery: (
      <p className="text-[16px] leading-relaxed">
        {l(
          `Raise seedlings in a nursery for about ${num(crop.nurseryDays ?? 30)} days, then transplant them to the main field.`,
          `साधारण ${num(crop.nurseryDays ?? 30)} दिवस रोपवाटिकेत रोपे वाढवा, मग मुख्य शेतात पुनर्लागवड करा.`,
        )}
      </p>
    ),
    irrigation: <p className="text-[16px] leading-relaxed">{ctx(crop.irrigation)}</p>,
    nutrients: <p className="text-[16px] leading-relaxed">{ctx(crop.nutrientGuide)}</p>,
    stages: <StageTimeline stages={crop.stages.map((stage) => ({ stage }))} />,
    problems: (
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
    ),
    harvest: <p className="text-[16px]">{ctx(crop.harvestSigns)}</p>,
    storage: (
      <>
        <p className="text-[16px]">{ctx(crop.postHarvest)}</p>
        <p className="mt-2 text-[16px]">{ctx(crop.marketTips)}</p>
      </>
    ),
  };

  return (
    <div className="pb-24">
      <PageHeader back="/crops?tab=library" title={`${crop.emoji} ${tx(crop.name)}`} sub={tx(CATEGORY_LABEL[crop.category])} />
      <NotVerified />
      <div className="mt-3">
        <ReadPageButton parts={parts} groupId={crop.id} />
      </div>

      {keys.map((k) => (
        <Section key={k} crop={crop} id={`${crop.id}:${k}`} title={title[k]} spoken={spoken(k)}>
          {body[k]}
        </Section>
      ))}

      <p className="mt-4 text-sm text-muted">
        {l("Source: ", "स्रोत: ")}
        {crop.source}
      </p>
      <p className="mt-1">
        <NotVerified />
      </p>

      <div className="fixed inset-x-0 bottom-[65px] z-20 mx-auto max-w-md border-t border-line bg-white/95 px-3 py-2.5 backdrop-blur">
        <LinkButton href={`/crops/new?crop=${crop.id}`} full className="min-h-14 text-lg">
          <Sprout size={22} /> {l("Grow this crop", "हे पीक घ्या")}
        </LinkButton>
      </div>
    </div>
  );
}

/** A card with its own speaker; highlighted while it is being read. */
function Section({ id, title, spoken, children }: { crop: CropInfo; id: string; title: string; spoken: string; children: React.ReactNode }) {
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
