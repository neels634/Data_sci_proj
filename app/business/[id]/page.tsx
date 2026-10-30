"use client";

import { useParams } from "next/navigation";
import { BookOpen, HandHelping, ShieldAlert, Wrench } from "lucide-react";
import { guideById, useStore } from "@/lib/store";
import CostCalculator from "@/components/CostCalculator";
import { Button, Card, Empty, Note, PageHeader, SectionTitle } from "@/components/ui";

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const { l, tx, requestSupport } = useStore();
  const g = guideById(id);
  if (!g) return <Empty icon={<BookOpen size={32} />} title={l("Guide not found", "मार्गदर्शक सापडला नाही")} body={l("Go back to see all guides.", "सर्व मार्गदर्शक पाहण्यासाठी मागे जा.")} />;

  return (
    <div>
      <PageHeader back="/business" title={tx(g.title)} sub={tx(g.summary)} />

      <ol className="space-y-2">
        {g.steps.map((s, i) => (
          <Card key={s.heading.en} className="flex gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-leaf-700 font-bold text-white">{i + 1}</span>
            <div>
              <p className="font-bold">{tx(s.heading)}</p>
              <p className="text-[15px] leading-snug text-muted">{tx(s.body)}</p>
            </div>
          </Card>
        ))}
      </ol>

      <SectionTitle>
        <span className="flex items-center gap-2">
          <Wrench size={18} /> {l("Equipment", "साधनसामग्री")}
        </span>
      </SectionTitle>
      <div className="flex flex-wrap gap-2">
        {g.equipment.map((e) => (
          <span key={e.en} className="rounded-full border border-line bg-white px-3 py-1.5 text-sm">
            {tx(e)}
          </span>
        ))}
      </div>

      <div className="mt-4 flex gap-2 rounded-xl bg-soil-100 p-3 text-sm text-[#7a3519]">
        <ShieldAlert size={18} className="mt-0.5 shrink-0" />
        <p>
          <b>{l("Food safety & licences.", "अन्न सुरक्षा व परवाने.")}</b> {tx(g.compliance)}{" "}
          {l("This guide is general information, not legal, tax or food-safety advice.", "हा मार्गदर्शक सामान्य माहिती आहे; कायदेशीर, कर किंवा अन्न-सुरक्षा सल्ला नाही.")}
        </p>
      </div>

      <SectionTitle>{l("Will it pay?", "परवडेल का?")}</SectionTitle>
      <CostCalculator initial={g.defaults} product={g.title} guideId={g.id} />

      <div className="mt-4">
        <Note tone="green">
          {l("Need help with FSSAI, packaging or finding buyers? A field coordinator can visit or call.", "FSSAI, पॅकिंग किंवा खरेदीदार शोधण्यात मदत हवी आहे? क्षेत्र समन्वयक भेट देऊ शकतात किंवा फोन करू शकतात.")}
        </Note>
        <Button variant="secondary" full className="mt-2" onClick={() => requestSupport(g.title)}>
          <HandHelping size={18} /> {l("Request support", "मदत मागा")}
        </Button>
      </div>
    </div>
  );
}
