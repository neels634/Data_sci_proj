"use client";

import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Sprout } from "lucide-react";
import { Empty, PageHeader } from "@/components/ui";
import { useFarm } from "@/components/myfarm/ui";
import { getCrop } from "@/lib/crops";

// Leaflet needs the browser, so the map can't be rendered on the server.
const FieldCheck = dynamic(() => import("@/components/satellite/FieldCheck"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-40 bg-slate-900" aria-busy="true" />,
});

export default function FieldCheckPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 z-40 bg-slate-900" aria-busy="true" />}>
      <FieldCheckInner />
    </Suspense>
  );
}

function FieldCheckInner() {
  const fromCropCheck = useSearchParams().get("from") === "crop-check";
  const { id } = useParams<{ id: string }>();
  const { state, hydrated, l } = useFarm();
  if (!hydrated) return <div className="fixed inset-0 z-40 bg-slate-900" aria-busy="true" />;
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
  return <FieldCheck fc={fc} crop={crop} fromCropCheck={fromCropCheck} />;
}
