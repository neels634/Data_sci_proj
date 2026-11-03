"use client";

import Link from "next/link";
import { Satellite } from "lucide-react";
import { fieldReadiness, fieldStart } from "@/lib/fieldHealth";
import type { FarmCrop } from "@/lib/types";
import { useFarm } from "./ui";

/** The way into the satellite field check from a crop's page. */
export function FieldCard({ fc }: { fc: FarmCrop }) {
  const { l, num, today } = useFarm();
  const readiness = fieldReadiness(fc, today);
  const marked = !!fc.boundary;
  if (readiness.kind === "finished" && !marked) return null;

  const href = `/crops/my/${fc.id}/field`;
  const body = readiness.kind === "finished"
    ? l("See how this field did through the season.", "हंगामभर हे शेत कसे होते ते पाहा.")
    : !marked
    ? l("Mark your field on the map once. After that, one tap shows which part of it is behind.", "नकाशावर शेताच्या खुणा एकदा करा. त्यानंतर एका दाबावर कळेल की शेताचा कोणता भाग मागे आहे.")
    : readiness.kind === "young"
      ? l(`Your field is saved. Your crop is still small, so check in ${num(readiness.daysLeft)} days.`, `तुमचे शेत जतन झाले आहे. पीक अजून लहान आहे, ${num(readiness.daysLeft)} दिवसांनी तपासा.`)
      : readiness.kind === "not_sown"
        ? l("Your field is saved. You can check it about three weeks after sowing.", "तुमचे शेत जतन झाले आहे. पेरणीनंतर साधारण तीन आठवड्यांनी तपासता येईल.")
        : l("See from the satellite which part of your field is behind.", "शेताचा कोणता भाग मागे आहे ते उपग्रहातून पाहा.");
  const canCheck = marked && readiness.kind === "ready";

  return (
    <div className="mt-3 rounded-2xl border border-leaf-700/30 bg-white p-3.5 shadow-xs">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-leaf-50 text-leaf-700" aria-hidden="true">
          <Satellite size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-ink">{l("My field from the satellite", "उपग्रहातून माझे शेत")}</p>
          <p className="mt-0.5 text-sm text-muted">{body}</p>
        </div>
      </div>
      {(!marked || canCheck) && (
        <Link href={href} className="mt-3 flex min-h-12 items-center justify-center rounded-xl bg-leaf-700 font-bold text-white">
          {canCheck ? l("Check this field", "हे शेत तपासा") : l("Mark my field", "माझ्या शेताच्या खुणा करा")}
        </Link>
      )}
      {marked && fieldStart(fc) && (
        <Link href={`/crops/my/${fc.id}/record`} className="mt-2 flex min-h-11 items-center justify-center rounded-xl border border-leaf-700/40 text-sm font-bold text-leaf-800">
          {l("Season record for insurance", "विम्यासाठी हंगामाची नोंद")}
        </Link>
      )}
    </div>
  );
}
