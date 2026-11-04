"use client";

/** My local rates: the village prices every cost estimate uses. */
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/ui";
import { SpeakButton } from "@/components/speech";
import { AreaToggle, LocalRatesEditor } from "@/components/costs";

export default function LocalRatesPage() {
  const { l } = useStore();
  const title = l("My local rates", "माझे स्थानिक दर");
  const sub = l("Type your village's rates once. Every cost estimate uses them at once.", "तुमच्या गावचे दर एकदा टाका. प्रत्येक खर्च अंदाज लगेच बदलतो.");
  return (
    <div className="space-y-3 pb-8">
      <PageHeader back="/crops" title={title} sub={sub} action={<SpeakButton id="local-rates" text={`${title}. ${sub}`} />} />
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold">{l("Show costs", "खर्च दाखवा")}</span>
        <AreaToggle />
      </div>
      <LocalRatesEditor />
    </div>
  );
}
