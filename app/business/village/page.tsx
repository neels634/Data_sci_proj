"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Chips, NumberField, YesNoField } from "@/components/enterprise/ui";
import { Button, Card, PageHeader, cx } from "@/components/ui";
import { ANIMAL_OPTIONS, CAPITAL_OPTIONS, CROP_OPTIONS, EMPTY_ASSETS, EXAMPLE_ASSETS, SKILL_OPTIONS, type FarmerAssets } from "@/lib/enterprise";
import { useStore } from "@/lib/store";

export default function AssetsPage() {
  const { state, hydrated } = useStore();
  if (!hydrated) return null;
  // the form starts from what was saved, so it mounts only once that is known
  return <AssetsForm saved={state.enterprise.assets} />;
}

function AssetsForm({ saved }: { saved: FarmerAssets | null }) {
  const { l, tx, saveEnterprise } = useStore();
  const router = useRouter();
  // the example's answers must never carry over and be saved as the farmer's own
  const [a, setA] = useState<FarmerAssets>(saved?.source === "entered" ? saved : EMPTY_ASSETS);
  const set = (patch: Partial<FarmerAssets>) => setA((old) => ({ ...old, ...patch }));

  const submit = (assets: FarmerAssets) => {
    saveEnterprise({ assets });
    router.push("/business/discover");
  };

  return (
    <div className="pb-16">
      <PageHeader back="/business" title={l("What do you have?", "तुमच्याकडे काय आहे?")} sub={l("Tap what you have. Skip what you don’t know.", "जे आहे त्यावर दाबा. माहीत नसेल ते सोडून द्या.")} />

      <Card className="space-y-4">
        <Chips label={l("Animals at home", "घरची जनावरे")} options={ANIMAL_OPTIONS} value={a.animals} onChange={(animals) => set({ animals })} />
        <Chips label={l("Crops you grow", "तुम्ही घेता ती पिके")} options={CROP_OPTIONS} value={a.crops} onChange={(crops) => set({ crops })} />
        <Chips label={l("Work you know", "तुम्हाला येणारे काम")} options={SKILL_OPTIONS} value={a.skills} onChange={(skills) => set({ skills })} />

        <div role="group" aria-label={l("Money to start with", "सुरुवातीसाठी पैसे")}>
          <p className="mb-1 text-[15px] font-semibold text-ink">{l("Money to start with", "सुरुवातीसाठी पैसे")}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {CAPITAL_OPTIONS.map((o) => (
              <button key={o.amount} type="button" aria-pressed={a.capital === o.amount} onClick={() => set({ capital: a.capital === o.amount ? null : o.amount })} className={cx("min-h-12 rounded-xl border text-sm font-semibold", a.capital === o.amount ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white text-ink")}>
                {tx(o.name)}
              </button>
            ))}
          </div>
        </div>

        <YesNoField label={l("A small free place at home or in the yard?", "घरी किंवा अंगणात थोडी मोकळी जागा आहे का?")} value={a.space} onChange={(space) => set({ space })} />
        <NumberField label={l("How many people have you asked about buying?", "विकत घेण्याबद्दल किती लोकांना विचारले?")} hint={l("Leave empty if none yet", "अजून कोणाला विचारले नसेल तर रिकामे ठेवा")} value={a.buyersSpokenTo} onChange={(buyersSpokenTo) => set({ buyersSpokenTo })} />
      </Card>

      <Button full className="mt-3 min-h-14 text-lg" onClick={() => submit({ ...a, source: "entered" })}>
        {l("Show me small business ideas", "लहान व्यवसाय कल्पना दाखवा")}
      </Button>
      <Button full variant="secondary" className="mt-2 min-h-12" onClick={() => submit(EXAMPLE_ASSETS)}>
        <Sparkles size={18} /> {l("Just show me an example", "फक्त उदाहरण दाखवा")}
      </Button>
    </div>
  );
}
