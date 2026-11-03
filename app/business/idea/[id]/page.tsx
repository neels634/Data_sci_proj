"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, RotateCcw, Store } from "lucide-react";
import { SpeakButton } from "@/components/speech";
import { useFarm } from "@/components/myfarm/ui";
import { NumberField } from "@/components/enterprise/ui";
import { Card, Empty, Note, PageHeader, SectionTitle, cx, rupees } from "@/components/ui";
import { enterpriseById, withSlowSales, type Enterprise, type ScenarioInputs } from "@/lib/enterprise";
import type { Bi } from "@/lib/i18n";

/** A loss reads as −₹500, not ₹-500. */
const money = (n: number) => (n < 0 ? `−${rupees(-n)}` : rupees(n));

export default function IdeaPage() {
  const { id } = useParams<{ id: string }>();
  const { hydrated, l } = useFarm();
  if (!hydrated) return null;
  const e = enterpriseById(id);
  if (!e) return <Empty icon={<Store size={32} />} title={l("Idea not found", "कल्पना सापडली नाही")} body={l("It may have been removed.", "ती काढली असू शकते.")} />;
  return <Plan e={e} />;
}

function Points({ title, items, numbered }: { title: string; items: Bi[]; numbered?: boolean }) {
  const { ctx, num } = useFarm();
  return (
    <>
      <SectionTitle>{title}</SectionTitle>
      <Card>
        <ul className="space-y-2">
          {items.map((x, i) => (
            <li key={x.en} className="flex gap-2 text-[15px] leading-snug">
              {numbered ? <span className="grid size-6 shrink-0 place-items-center rounded-full bg-leaf-700 text-xs font-bold text-white">{num(i + 1)}</span> : <span className="mt-2 size-1.5 shrink-0 rounded-full bg-leaf-600" aria-hidden="true" />}
              <span>{ctx(x)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

function Plan({ e }: { e: Enterprise }) {
  const { state, l, tx, num, saveEnterprise } = useFarm();
  const record = state.enterprise;
  const inputs = record.ideas[e.id] ?? e.guess;
  const change = (key: keyof ScenarioInputs) => (value: number | null) => saveEnterprise({ ideas: { ...record.ideas, [e.id]: { ...inputs, [key]: value ?? 0 } } });
  const reset = () => {
    const ideas = { ...record.ideas };
    delete ideas[e.id];
    saveEnterprise({ ideas });
  };

  const { planned, slow } = withSlowSales(inputs);
  const unit = tx(e.unit);
  const earning = planned.left > 0;
  const headline = earning ? l(`About ${money(planned.left)} a month in hand`, `दरमहा साधारण ${money(planned.left)} हातात`) : l("This loses money at these prices", "या दरांवर यात तोटा होतो");
  const slowLine = l(`If you sell only half: ${money(slow.left)} a month.`, `फक्त निम्मे विकले तर: दरमहा ${money(slow.left)}.`);
  const start = l(`Start with about ${rupees(e.investment[0])} to ${rupees(e.investment[1])}.`, `साधारण ${rupees(e.investment[0])} ते ${rupees(e.investment[1])} मध्ये सुरू करा.`);
  const guess = l("These are our rough guesses, not a promise. Put in the real prices near you.", "हे आमचे ढोबळ अंदाज आहेत, हमी नव्हे. तुमच्या भागातील खरे दर भरा.");
  const speech = [`${tx(e.name)}.`, tx(e.summary), start, `${headline}.`, slowLine, guess].join(" ");

  return (
    <div className="pb-16">
      <PageHeader back="/business/discover" title={`${e.emoji} ${tx(e.name)}`} sub={tx(e.summary)} action={<SpeakButton id={`plan:${e.id}`} text={speech} />} />

      <div className={cx("rounded-3xl p-4", earning ? "bg-leaf-50" : "bg-soil-100")}>
        <p className="text-sm font-semibold text-muted">{l("What you could earn", "तुम्हाला किती मिळू शकते")}</p>
        <p className={cx("mt-0.5 text-2xl font-bold leading-tight", earning ? "text-leaf-900" : "text-soil")}>{headline}</p>
        <p className="mt-2 text-[15px] text-ink">{slowLine}</p>
        {planned.breakEven !== null && planned.breakEven > 0 && <p className="text-[15px] text-ink">{l(`Sell at least ${num(planned.breakEven)} ${planned.breakEven === 1 || e.unit.en === "kg" ? unit : `${unit}s`} a month to cover costs.`, `खर्च निघण्यासाठी दरमहा किमान ${num(planned.breakEven)} ${unit} विका.`)}</p>}
        {planned.paybackMonths !== null && <p className="text-[15px] text-ink">{l(`Your starting money could come back in about ${num(planned.paybackMonths)} ${planned.paybackMonths === 1 ? "month" : "months"}.`, `सुरुवातीचे पैसे साधारण ${num(planned.paybackMonths)} महिन्यांत परत मिळू शकतात.`)}</p>}
        <p className="mt-2 text-xs leading-snug text-muted">{l("Your own work is not counted as a cost, and loan payments and tax are not included. These are rough guesses, not a promise.", "तुमच्या स्वतःच्या कामाचा खर्च धरलेला नाही, तसेच कर्जाचे हप्ते व कर यात नाहीत. हे ढोबळ अंदाज आहेत, हमी नव्हे.")}</p>
      </div>
      <p className="mt-2 font-bold text-ink">{start}</p>

      <Points title={l("How to start", "कशी सुरुवात करावी")} items={e.steps} numbered />
      <Points title={l("What you need", "काय लागेल")} items={e.needed} />
      <Points title={l("Who may buy", "कोण घेऊ शकते")} items={e.buyers} />
      <Points title={l("Be careful", "काळजी घ्या")} items={e.careful} />

      <SectionTitle>{l("Put in your real prices", "तुमचे खरे दर भरा")}</SectionTitle>
      <Card className="space-y-3">
        <p className="text-sm text-muted">{l("The earning above changes as you type.", "तुम्ही लिहिताच वरील कमाई बदलते.")}</p>
        <div className="grid grid-cols-2 gap-3">
          <NumberField label={l(`How many in a month (${unit})`, `महिन्याला किती (${unit})`)} value={inputs.production} onChange={change("production")} />
          <NumberField label={l(`Selling price per ${unit} (₹)`, `विक्री किंमत प्रति ${unit} (₹)`)} value={inputs.price} onChange={change("price")} />
          <NumberField label={l(`Cost to make one ${unit} (₹)`, `एक ${unit} बनवण्याचा खर्च (₹)`)} value={inputs.rawCost} onChange={change("rawCost")} />
          <NumberField label={l("Other costs a month (₹)", "इतर मासिक खर्च (₹)")} value={inputs.other} onChange={change("other")} />
          <NumberField label={l("Money to start (₹)", "सुरुवातीचे पैसे (₹)")} value={inputs.setupCost} onChange={change("setupCost")} />
        </div>
        {record.ideas[e.id] && (
          <button type="button" onClick={reset} className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-leaf-800">
            <RotateCcw size={14} /> {l("Go back to our guesses", "आमच्या अंदाजांवर परत जा")}
          </button>
        )}
      </Card>

      <Note>{e.permissions.map((p) => tx(p)).join(" ")}</Note>

      {e.schemes.length > 0 && (
        <>
          <SectionTitle>{l("Schemes to read about", "वाचण्याजोग्या योजना")}</SectionTitle>
          <div className="space-y-1.5">
            {e.schemes.map((id) => {
              const scheme = state.schemes.find((s) => s.id === id && s.status !== "archived");
              return (
                scheme && (
                  <Link key={id} href={`/schemes/${id}`} className="flex min-h-12 items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 font-semibold">
                    <span className="min-w-0 flex-1 leading-snug">{tx(scheme.name)}</span> <ChevronRight size={18} className="shrink-0 text-muted" />
                  </Link>
                )
              );
            })}
          </div>
          <p className="mt-1.5 text-xs text-muted">{l("A scheme or loan is never promised. The department or bank decides.", "योजना किंवा कर्जाची हमी नाही. निर्णय विभाग किंवा बँक घेते.")}</p>
        </>
      )}
    </div>
  );
}
