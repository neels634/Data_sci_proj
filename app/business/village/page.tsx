"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Chips, NumberField, YesNoField } from "@/components/enterprise/ui";
import { Input } from "@/components/voice";
import { Button, Card, Field, Note, PageHeader, inputCls } from "@/components/ui";
import { CROP_OPTIONS, EMPTY_VILLAGE, EXAMPLE_VILLAGE, RESIDUE_OPTIONS, SKILL_OPTIONS, type VillageProfile } from "@/lib/enterprise";
import { useStore } from "@/lib/store";

export default function VillagePage() {
  const { state, hydrated } = useStore();
  if (!hydrated) return null;
  // the form starts from what was saved, so it mounts only once that is known
  return <VillageForm saved={state.enterprise.village} />;
}

function VillageForm({ saved }: { saved: VillageProfile | null }) {
  const { state, account, l, tx, saveEnterprise } = useStore();
  const router = useRouter();
  // the example's numbers must never carry over and be saved as the farmer's own
  const [v, setV] = useState<VillageProfile>(saved?.source === "entered" ? saved : { ...EMPTY_VILLAGE, name: tx(state.profile.village) || account?.village || "" });
  const set = (patch: Partial<VillageProfile>) => setV((old) => ({ ...old, ...patch }));

  const submit = (profile: VillageProfile) => {
    saveEnterprise({ village: profile });
    router.push("/business/discover");
  };

  return (
    <div className="pb-16">
      <PageHeader back="/business" title={l("My village profile", "माझ्या गावाची माहिती")} sub={l("Fill in what you know. Leave the rest empty: we will tell you what still needs finding out.", "जे माहीत आहे ते भरा. बाकी रिकामे ठेवा: अजून काय शोधायचे ते आम्ही सांगू.")} />

      <Button full variant="secondary" className="min-h-12" onClick={() => submit(EXAMPLE_VILLAGE)}>
        <Sparkles size={18} /> {l("Just show me with an example village", "उदाहरणार्थ गाव वापरून दाखवा")}
      </Button>

      <Card className="mt-3 space-y-4">
        <Field label={l("Village name", "गावाचे नाव")}>
          <Input className={inputCls} maxLength={80} value={v.name} onChange={(e) => set({ name: e.target.value, source: "entered" })} />
        </Field>
        <NumberField label={l("Farming households", "शेतकरी कुटुंबे")} hint={l("A rough number is fine", "साधारण आकडा चालेल")} value={v.households} onChange={(households) => set({ households })} />
        <NumberField label={l("Dairy households", "दुग्ध उत्पादक कुटुंबे")} value={v.dairyHouseholds} onChange={(dairyHouseholds) => set({ dairyHouseholds })} />
        <Chips label={l("Main crops", "मुख्य पिके")} options={CROP_OPTIONS} value={v.crops} onChange={(crops) => set({ crops })} />
        <Chips label={l("Crop waste available", "उपलब्ध पीक अवशेष")} options={RESIDUE_OPTIONS} value={v.residues} onChange={(residues) => set({ residues })} />
        <Chips label={l("Skills in the village", "गावातील कौशल्ये")} options={SKILL_OPTIONS} value={v.skills} onChange={(skills) => set({ skills })} />
        <NumberField label={l("Money you can invest (₹)", "तुम्ही गुंतवू शकता ती रक्कम (₹)")} value={v.capital} onChange={(capital) => set({ capital })} />
        <YesNoField label={l("Steady electricity?", "स्थिर वीज आहे का?")} value={v.power} onChange={(power) => set({ power })} />
        <YesNoField label={l("Steady water?", "स्थिर पाणी आहे का?")} value={v.water} onChange={(water) => set({ water })} />
        <YesNoField label={l("A room or shed you can use?", "वापरता येईल अशी खोली किंवा शेड आहे का?")} value={v.space} onChange={(space) => set({ space })} />
        <NumberField label={l("Distance to the nearest market (km)", "जवळच्या बाजारपेठेचे अंतर (किमी)")} value={v.marketKm} onChange={(marketKm) => set({ marketKm })} />
        <NumberField label={l("Possible buyers you have spoken to", "तुम्ही बोललेले संभाव्य खरेदीदार")} hint={l("This counts the most. Real buyers matter more than anything else here.", "याला सर्वात जास्त महत्त्व आहे. प्रत्यक्ष खरेदीदार सर्वात महत्त्वाचे.")} value={v.buyersSpokenTo} onChange={(buyersSpokenTo) => set({ buyersSpokenTo })} />
      </Card>

      <div className="mt-3">
        <Note>{l("This is what you told us, not a survey. A field survey would make these ideas more reliable.", "ही तुम्ही दिलेली माहिती आहे, सर्वेक्षण नव्हे. प्रत्यक्ष सर्वेक्षणाने या कल्पना अधिक खात्रीच्या होतील.")}</Note>
      </div>
      <Button full className="mt-3 min-h-14 text-lg" onClick={() => submit({ ...v, source: "entered" })}>
        {l("See business ideas", "व्यवसाय कल्पना पाहा")}
      </Button>
    </div>
  );
}
