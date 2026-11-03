"use client";

import Link from "next/link";
import { ChevronRight, Plus, Satellite } from "lucide-react";
import { useFarm } from "@/components/myfarm/ui";
import { cropEntry } from "@/lib/crops";
import { fieldReadiness } from "@/lib/fieldHealth";
import type { FarmCrop } from "@/lib/types";

/** Crop Check's way into the satellite: the farmer picks one of their own crops, so no field is drawn twice. */
export default function CropCheckFields() {
  const { state, l, tx, num, today, cropTitle } = useFarm();
  const crops = state.myFarmCrops.filter((c) => fieldReadiness(c, today).kind !== "finished");

  const hint = (fc: FarmCrop) => {
    if (!fc.boundary) return l("Mark this field once", "या शेताच्या खुणा एकदा करा");
    const readiness = fieldReadiness(fc, today);
    if (readiness.kind === "young") return l(`Field saved. Check in ${num(readiness.daysLeft)} days`, `शेत जतन झाले. ${num(readiness.daysLeft)} दिवसांनी तपासा`);
    if (readiness.kind === "not_sown") return l("Field saved. Check after sowing", "शेत जतन झाले. पेरणीनंतर तपासा");
    return l("Check this field", "हे शेत तपासा");
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-3.5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
          <Satellite size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink">{l("Check my whole field by satellite", "उपग्रहाने संपूर्ण शेत तपासा")}</p>
          <p className="text-xs text-muted">{l("See which part of the field is behind, then photograph a leaf there.", "शेताचा कोणता भाग मागे आहे ते पाहा, मग तिथल्या पानाचा फोटो घ्या.")}</p>
        </div>
      </div>

      <div className="mt-2.5 space-y-1.5">
        {crops.map((fc) => (
          <Link key={fc.id} href={`/crops/my/${fc.id}/field?from=crop-check`} className="flex min-h-14 items-center gap-2.5 rounded-xl bg-leaf-50 px-3 py-2">
            <span className="text-xl" aria-hidden="true">
              {cropEntry(fc.cropId)?.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-bold text-ink">{tx(fc.plotName) || cropTitle(fc)}</span>
              <span className="block text-xs font-semibold text-leaf-800">{hint(fc)}</span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-muted" />
          </Link>
        ))}
        {crops.length === 0 && (
          <Link href="/crops/new" className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-leaf-700 px-3 text-sm font-bold text-white">
            <Plus size={16} /> {l("Add your crop to My Farm first", "आधी तुमचे पीक माझ्या शेतीत जोडा")}
          </Link>
        )}
      </div>

      <Link href="/crop-check/satellite" className="mt-1.5 flex min-h-10 items-center justify-center text-xs font-semibold text-muted underline">
        {l("Detailed map with satellite numbers", "उपग्रह आकड्यांसह सविस्तर नकाशा")}
      </Link>
    </div>
  );
}
