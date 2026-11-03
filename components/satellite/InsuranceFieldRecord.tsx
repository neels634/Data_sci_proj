"use client";

import Link from "next/link";
import { ChevronRight, Plus, Satellite } from "lucide-react";
import { useFarm } from "@/components/myfarm/ui";
import { Card } from "@/components/ui";
import { getCrop } from "@/lib/crops";
import { fieldStart } from "@/lib/fieldHealth";

/** On an insurance scheme: the way to the farmer's own field records. */
export default function InsuranceFieldRecord({ schemeId }: { schemeId: string }) {
  const { state, l, tx, cropTitle } = useFarm();
  const crops = state.myFarmCrops.filter((c) => fieldStart(c));

  return (
    <Card className="mt-3">
      <h2 className="flex items-center gap-2 font-bold text-leaf-900">
        <Satellite size={18} /> {l("Your field’s satellite record", "तुमच्या शेताची उपग्रह नोंद")}
      </h2>
      <p className="mt-1 text-sm text-muted">{l("See how green your field was through the season, with dates, to show your Mitra or officer. It does not decide insurance.", "हंगामभर तुमचे शेत किती हिरवे होते ते तारखांसह पाहा आणि मित्राला किंवा अधिकाऱ्याला दाखवा. यावरून विमा ठरत नाही.")}</p>
      <div className="mt-2.5 space-y-1.5">
        {crops.map((fc) => (
          <Link key={fc.id} href={`/crops/my/${fc.id}/record?scheme=${schemeId}`} className="flex min-h-14 items-center gap-2.5 rounded-xl bg-leaf-50 px-3 py-2">
            <span className="text-xl" aria-hidden="true">
              {getCrop(fc.cropId)?.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-bold text-ink">{tx(fc.plotName) || cropTitle(fc)}</span>
              <span className="block text-xs font-semibold text-leaf-800">{fc.boundary ? l("See the season record", "हंगामाची नोंद पाहा") : l("Mark this field first", "आधी या शेताच्या खुणा करा")}</span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-muted" />
          </Link>
        ))}
        {crops.length === 0 && (
          <Link href="/crops/new" className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-leaf-700 px-3 text-sm font-bold text-white">
            <Plus size={16} /> {l("Add your sown crop to My Farm first", "आधी तुमचे पेरलेले पीक माझ्या शेतीत जोडा")}
          </Link>
        )}
      </div>
    </Card>
  );
}
