"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Sprout } from "lucide-react";
import { Empty, PageHeader } from "@/components/ui";
import { useFarm } from "@/components/myfarm/ui";
import FieldRecord from "@/components/satellite/FieldRecord";
import { getCrop } from "@/lib/crops";

export default function FieldRecordPage() {
  return (
    <Suspense fallback={null}>
      <FieldRecordInner />
    </Suspense>
  );
}

function FieldRecordInner() {
  const scheme = useSearchParams().get("scheme");
  const { id } = useParams<{ id: string }>();
  const { state, hydrated, l } = useFarm();
  if (!hydrated) return null;
  // only the signed-in farmer's crops are visible here
  const fc = state.myFarmCrops.find((c) => c.id === id);
  const crop = fc ? getCrop(fc.cropId) : undefined;
  if (!fc || !crop)
    return (
      <div>
        <PageHeader back="/crops" title={l("Crop not found", "पीक सापडले नाही")} />
        <Empty icon={<Sprout size={32} />} title={l("This crop is not in your farm", "हे पीक तुमच्या शेतीत नाही")} body={l("It may have been removed.", "ते काढले असू शकते.")} />
      </div>
    );
  const known = scheme && state.schemes.some((s) => s.id === scheme);
  return <FieldRecord fc={fc} crop={crop} back={known ? `/schemes/${scheme}` : `/crops/my/${fc.id}`} />;
}
