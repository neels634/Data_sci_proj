"use client";

import { useParams } from "next/navigation";
import { Search, Sprout } from "lucide-react";
import { CATEGORY_LABEL, getCrop, seasonName } from "@/lib/crops";
import { monthOf } from "@/lib/lifecycle";
import { NotVerified, StageTimeline, useFarm } from "@/components/myfarm/ui";
import { ReadAloud } from "@/components/voice";
import { Card, Empty, LinkButton, PageHeader } from "@/components/ui";

export default function CropInfoPage() {
  const { cropId } = useParams<{ cropId: string }>();
  const { l, tx, today } = useFarm();
  const crop = getCrop(cropId);
  if (!crop)
    return (
      <div>
        <PageHeader back="/crops?tab=library" title={l("Crop not found", "पीक सापडले नाही")} />
        <Empty icon={<Search size={32} />} title={l("We don't have this crop yet", "हे पीक अजून आमच्याकडे नाही")} body={l("Try the Crop Library search.", "पीक माहितीमध्ये शोधून पाहा.")} />
      </div>
    );

  const month = monthOf(today);
  const days = crop.seasons.flatMap((s) => s.durationDays);
  const overview = l(
    `${crop.name.en} (${CATEGORY_LABEL[crop.category].en.toLowerCase()}) is ${crop.method === "transplant" ? "raised in a nursery and then transplanted" : crop.method === "both" ? "sown directly or transplanted" : "sown directly in the field"}. It takes about ${Math.min(...days)}–${Math.max(...days)} days from sowing to harvest.`,
    `${crop.name.mr} (${CATEGORY_LABEL[crop.category].mr}) ${crop.method === "transplant" ? "रोपवाटिकेत रोपे करून मग पुनर्लागवड केली जाते" : crop.method === "both" ? "थेट पेरणी किंवा पुनर्लागवड करून घेता येते" : "शेतात थेट पेरले जाते"}. पेरणीपासून काढणीपर्यंत साधारण ${Math.min(...days)}–${Math.max(...days)} दिवस लागतात.`,
  );
  const sections: { title: string; body: string }[] = [
    { title: l("Soil & climate", "जमीन व हवामान"), body: `${tx(crop.soil)} ${tx(crop.climate)}` },
    { title: l("Seed rate & spacing", "बियाणे व अंतर"), body: `${tx(crop.seedRate)} ${tx(crop.spacing)}` },
    ...(crop.method !== "direct"
      ? [
          {
            title: l("Nursery & transplanting", "रोपवाटिका व पुनर्लागवड"),
            body: l(
              `Raise seedlings in a nursery for about ${crop.nurseryDays ?? 30} days, then transplant them to the main field.`,
              `साधारण ${crop.nurseryDays ?? 30} दिवस रोपवाटिकेत रोपे वाढवा, मग मुख्य शेतात पुनर्लागवड करा.`,
            ),
          },
        ]
      : []),
    { title: l("Irrigation", "पाणी"), body: tx(crop.irrigation) },
    { title: l("Nutrients (general)", "खते (सर्वसाधारण)"), body: tx(crop.nutrientGuide) },
  ];

  return (
    <div className="pb-24">
      <PageHeader back="/crops?tab=library" title={`${crop.emoji} ${tx(crop.name)}`} sub={tx(CATEGORY_LABEL[crop.category])} />
      <NotVerified />

      <Section title={l("Overview", "थोडक्यात")} speak={overview}>
        <p className="text-[16px] leading-relaxed">{overview}</p>
      </Section>

      <Section title={l("When to sow", "पेरणी कधी करावी")} speak={crop.seasons.map((s, i) => `${tx(seasonName(crop, i))}: ${tx(s.sowingWindow)}`).join(". ")}>
        <div className="space-y-2">
          {crop.seasons.map((s, i) => {
            const now = s.sowingMonths.includes(month);
            return (
              <div key={i} className="flex items-center justify-between gap-2 rounded-xl bg-leaf-50 p-3">
                <span>
                  <span className="block font-bold">{tx(seasonName(crop, i))}</span>
                  <span className="block text-sm">{tx(s.sowingWindow)}</span>
                  <span className="block text-sm text-muted">{l(`${s.durationDays[0]}–${s.durationDays[1]} days to harvest`, `काढणीपर्यंत ${s.durationDays[0]}–${s.durationDays[1]} दिवस`)}</span>
                </span>
                {now && <span className="shrink-0 rounded-full bg-leaf-700 px-3 py-1 text-sm font-semibold text-white">{l("Good time to sow now ✓", "आता पेरणीची योग्य वेळ ✓")}</span>}
              </div>
            );
          })}
        </div>
      </Section>

      {sections.map((s) => (
        <Section key={s.title} title={s.title} speak={s.body}>
          <p className="text-[16px] leading-relaxed">{s.body}</p>
        </Section>
      ))}

      <h2 className="mb-2 mt-6 text-lg font-bold">{l("Growth stages", "वाढीच्या अवस्था")}</h2>
      <StageTimeline stages={crop.stages.map((stage) => ({ stage }))} />

      <Section title={l("Common problems", "नेहमीच्या समस्या")} speak={crop.commonProblems.map((p) => `${tx(p.name)}. ${tx(p.signs)}. ${tx(p.prevention)}`).join(" ")}>
        <div className="space-y-3">
          {crop.commonProblems.map((p) => (
            <div key={p.name.en}>
              <p className="font-bold">{tx(p.name)}</p>
              <p className="text-[15px]">
                <span className="font-semibold">{l("Signs: ", "लक्षणे: ")}</span>
                {tx(p.signs)}
              </p>
              <p className="text-[15px]">
                <span className="font-semibold">{l("Prevention: ", "प्रतिबंध: ")}</span>
                {tx(p.prevention)}
              </p>
            </div>
          ))}
        </div>
      </Section>
      <Section title={l("Harvest signs", "काढणीची लक्षणे")} speak={tx(crop.harvestSigns)}>
        <p className="text-[16px]">{tx(crop.harvestSigns)}</p>
      </Section>
      <Section title={l("Storage & selling tips", "साठवण व विक्री")} speak={`${tx(crop.postHarvest)} ${tx(crop.marketTips)}`}>
        <p className="text-[16px]">{tx(crop.postHarvest)}</p>
        <p className="mt-2 text-[16px]">{tx(crop.marketTips)}</p>
      </Section>

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

function Section({ title, speak, children }: { title: string; speak: string; children: React.ReactNode }) {
  return (
    <Card className="mt-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <ReadAloud text={`${title}. ${speak}`} />
      </div>
      {children}
    </Card>
  );
}
