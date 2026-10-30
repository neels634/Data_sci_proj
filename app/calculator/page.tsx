"use client";

import { useStore } from "@/lib/store";
import CostCalculator from "@/components/CostCalculator";
import { PageHeader } from "@/components/ui";

export default function CalculatorPage() {
  const { l } = useStore();
  return (
    <div>
      <PageHeader
        back="/business"
        title={l("Cost calculator", "खर्च गणक")}
        sub={l("Work out cost per unit and margin for any product idea.", "कोणत्याही उत्पादनासाठी प्रति नग खर्च व नफा काढा.")}
      />
      <CostCalculator
        initial={{ units: 0, rawMaterial: 0, processing: 0, packaging: 0, labour: 0, transport: 0, other: 0, sellingPrice: 0 }}
        product=""
        guideId={null}
      />
    </div>
  );
}
