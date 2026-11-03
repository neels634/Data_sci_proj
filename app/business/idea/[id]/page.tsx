"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Check, ChevronRight, ListChecks, RotateCcw, Store } from "lucide-react";
import { SpeakButton } from "@/components/speech";
import { useFarm } from "@/components/myfarm/ui";
import { NumberField } from "@/components/enterprise/ui";
import { Card, Empty, Note, PageHeader, SectionTitle, cx, rupees } from "@/components/ui";
import { calcScenario, enterpriseById, scenarioSet, type Enterprise, type ScenarioInputs, type ScenarioName } from "@/lib/enterprise";
import type { Bi } from "@/lib/i18n";

export default function IdeaPage() {
  const { id } = useParams<{ id: string }>();
  const { hydrated, l } = useFarm();
  if (!hydrated) return null;
  const e = enterpriseById(id);
  if (!e) return <Empty icon={<Store size={32} />} title={l("Idea not found", "कल्पना सापडली नाही")} body={l("It may have been removed.", "ती काढली असू शकते.")} />;
  return <Blueprint e={e} />;
}

function List({ title, items }: { title: string; items: Bi[] }) {
  const { ctx } = useFarm();
  return (
    <details className="group rounded-2xl border border-line bg-white p-3.5">
      <summary className="flex min-h-8 cursor-pointer items-center justify-between font-bold text-leaf-900">
        {title} <ChevronRight size={18} className="transition-transform group-open:rotate-90" aria-hidden="true" />
      </summary>
      <ul className="mt-2 space-y-1.5">
        {items.map((x) => (
          <li key={x.en} className="flex gap-2 text-[15px] leading-snug">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-leaf-600" aria-hidden="true" /> {ctx(x)}
          </li>
        ))}
      </ul>
    </details>
  );
}

function Blueprint({ e }: { e: Enterprise }) {
  const { state, l, tx, ctx, num, saveEnterprise } = useFarm();
  const record = state.enterprise;
  const saved = record.ideas[e.id];
  const inputs = saved?.inputs ?? e.guess;
  const checked = saved?.checked ?? [];

  const update = (patch: Partial<{ inputs: ScenarioInputs; checked: number[] }>) => saveEnterprise({ ideas: { ...record.ideas, [e.id]: { inputs, checked, ...patch } } });
  const change = (key: keyof ScenarioInputs) => (value: number | null) => update({ inputs: { ...inputs, [key]: value ?? 0 } });
  const toggle = (i: number) => update({ checked: checked.includes(i) ? checked.filter((x) => x !== i) : [...checked, i] });

  const r = calcScenario(inputs);
  const scenarios = scenarioSet(inputs);
  const unit = tx(e.unit);
  const edited = saved && JSON.stringify(saved.inputs) !== JSON.stringify(e.guess);

  const names: [ScenarioName, string][] = [
    ["conservative", l("If it goes slowly", "मंद चालल्यास")],
    ["base", l("Your numbers", "तुमचे आकडे")],
    ["optimistic", l("If it goes well", "चांगले चालल्यास")],
  ];
  const lines: [string, (s: (typeof scenarios)["base"]) => string][] = [
    [l("Money coming in", "येणारे पैसे"), (s) => money(s.revenue)],
    [l("Left after raw material", "कच्च्या मालानंतर उरणारे"), (s) => money(s.grossProfit)],
    [l("Left after all monthly costs", "सर्व मासिक खर्चानंतर उरणारे"), (s) => money(s.surplus)],
  ];

  const surplusWord = r.surplus >= 0 ? l(`about ${rupees(r.surplus)} is left each active month`, `दर कामाच्या महिन्याला सुमारे ${rupees(r.surplus)} उरतात`) : l(`this loses about ${rupees(-r.surplus)} each month`, `दर महिन्याला सुमारे ${rupees(-r.surplus)} तोटा होतो`);
  const speech = [`${tx(e.name)}.`, tx(e.summary), l(`With these numbers, ${surplusWord}, before loan payments and tax.`, `या आकड्यांनुसार ${surplusWord}, कर्जाचे हप्ते व कर सोडून.`), l("These are starting guesses. Replace them with real quotes.", "हे सुरुवातीचे अंदाज आहेत. प्रत्यक्ष दरपत्रकाचे आकडे भरा.")].join(" ");

  return (
    <div className="pb-16">
      <PageHeader back="/business/discover" title={`${e.emoji} ${tx(e.name)}`} sub={tx(e.summary)} action={<SpeakButton id={`plan:${e.id}`} text={speech} />} />

      <Note>{l("Every figure below starts as our rough guess, not a market price. Replace them with quotes you get. Money is never guaranteed.", "खालील प्रत्येक आकडा सुरुवातीला आमचा ढोबळ अंदाज आहे, बाजारभाव नव्हे. तुम्हाला मिळालेले दर भरा. पैशांची कोणतीही हमी नाही.")}</Note>

      <SectionTitle>{l("Why people may buy", "लोक का घेतील")}</SectionTitle>
      <p className="text-[15px] leading-snug">{tx(e.need)}</p>

      <SectionTitle>{l("The money each month", "दर महिन्याचा हिशोब")}</SectionTitle>
      <Card className="p-3.5">
        <div className="grid grid-cols-[1fr_repeat(3,minmax(0,1fr))] gap-x-2 gap-y-2 text-sm">
          <span />
          {names.map(([key, name]) => (
            <span key={key} className={cx("text-right text-xs font-semibold", key === "base" ? "text-ink" : "text-muted")}>
              {name}
            </span>
          ))}
          {lines.map(([label, read]) => (
            <div key={label} className="contents">
              <span className="border-t border-line pt-1.5 text-xs leading-tight text-muted">{label}</span>
              {names.map(([key]) => (
                <span key={key} className={cx("border-t border-line pt-1.5 text-right text-[13px] tabular-nums", key === "base" && "font-bold", scenarios[key].surplus < 0 && read(scenarios[key]) === money(scenarios[key].surplus) && "text-soil")}>
                  {read(scenarios[key])}
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs leading-snug text-muted">{l("“Left” is before loan payments and tax. Money coming in is not profit.", "“उरणारे” हे कर्जाचे हप्ते व कर यांच्या आधीचे आहेत. येणारे पैसे म्हणजे नफा नव्हे.")}</p>
      </Card>

      <dl className="mt-2 grid grid-cols-2 gap-2">
        <Stat label={l("Sell this much to cover monthly costs", "मासिक खर्च भरून निघण्यासाठी एवढे विका")} value={r.breakEven === null ? l("Each unit loses money", "प्रत्येक नगात तोटा") : `${num(r.breakEven)} ${unit}`} />
        <Stat label={l("Cash needed to keep running", "चालू ठेवण्यासाठी लागणारी रोकड")} value={rupees(r.workingCapital)} />
        <Stat label={l("Rough setup cost", "अंदाजे सुरुवातीचा खर्च")} value={rupees(inputs.setupCost)} />
        <Stat label={l("Time to earn back setup, if all goes to plan", "सर्व नियोजनाप्रमाणे झाल्यास खर्च निघण्याचा वेळ")} value={r.paybackMonths === null ? l("Not at these numbers", "या आकड्यांवर नाही") : l(`${num(r.paybackMonths)} months`, `${num(r.paybackMonths)} महिने`)} />
      </dl>

      <SectionTitle>{l("Change the numbers", "आकडे बदला")}</SectionTitle>
      <Card className="space-y-3">
        <p className="text-sm text-muted">{l("The money above changes as you type.", "तुम्ही लिहिताच वरील हिशोब बदलतो.")}</p>
        <div className="grid grid-cols-2 gap-3">
          <NumberField label={l(`Made per month (${unit})`, `दरमहा उत्पादन (${unit})`)} value={inputs.production} onChange={change("production")} />
          <NumberField label={l(`Selling price per ${unit} (₹)`, `विक्री किंमत प्रति ${unit} (₹)`)} value={inputs.price} onChange={change("price")} />
          <NumberField label={l(`Raw material per ${unit} (₹)`, `कच्चा माल प्रति ${unit} (₹)`)} value={inputs.rawCost} onChange={change("rawCost")} />
          <NumberField label={l("Wastage (%)", "वाया जाणारे (%)")} value={inputs.wastagePct} onChange={change("wastagePct")} />
          <NumberField label={l("Labour per month (₹)", "मजुरी दरमहा (₹)")} value={inputs.labour} onChange={change("labour")} />
          <NumberField label={l("Electricity per month (₹)", "वीज दरमहा (₹)")} value={inputs.electricity} onChange={change("electricity")} />
          <NumberField label={l("Transport per month (₹)", "वाहतूक दरमहा (₹)")} value={inputs.transport} onChange={change("transport")} />
          <NumberField label={l("Other costs per month (₹)", "इतर खर्च दरमहा (₹)")} value={inputs.other} onChange={change("other")} />
          <NumberField label={l("Setup cost (₹)", "सुरुवातीचा खर्च (₹)")} value={inputs.setupCost} onChange={change("setupCost")} />
          <NumberField label={l("Days buyers take to pay", "खरेदीदार पैसे देण्याचे दिवस")} value={inputs.creditDays} onChange={change("creditDays")} />
          <NumberField label={l("Months a year with no work", "वर्षातील बिनकामाचे महिने")} value={inputs.idleMonths} onChange={change("idleMonths")} />
        </div>
        {edited && (
          <button type="button" onClick={() => update({ inputs: e.guess })} className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-leaf-800">
            <RotateCcw size={14} /> {l("Go back to our starting guesses", "आमच्या सुरुवातीच्या अंदाजांवर परत जा")}
          </button>
        )}
      </Card>

      <SectionTitle>{l("Check these before spending money", "पैसे खर्च करण्यापूर्वी हे तपासा")}</SectionTitle>
      <Card className="divide-y divide-line p-0">
        {e.validation.map((step, i) => {
          const done = checked.includes(i);
          return (
            <button key={step.en} type="button" aria-pressed={done} onClick={() => toggle(i)} className="flex min-h-14 w-full items-center gap-3 p-3 text-left">
              <span className={cx("grid size-7 shrink-0 place-items-center rounded-full border-2", done ? "border-leaf-700 bg-leaf-700 text-white" : "border-line")} aria-hidden="true">
                {done && <Check size={16} />}
              </span>
              <span className={cx("text-[15px] leading-snug", done && "text-muted line-through")}>{ctx(step)}</span>
            </button>
          );
        })}
      </Card>
      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
        <ListChecks size={16} aria-hidden="true" /> {l(`${num(checked.length)} of ${num(e.validation.length)} checked`, `${num(e.validation.length)} पैकी ${num(checked.length)} तपासले`)}
      </p>

      <SectionTitle>{l("The full plan", "संपूर्ण आराखडा")}</SectionTitle>
      <div className="space-y-2">
        <List title={l("First 30 days", "पहिले ३० दिवस")} items={e.firstMonth} />
        <List title={l("Who may buy", "कोण घेऊ शकतो")} items={e.customers} />
        <List title={l("Raw material", "कच्चा माल")} items={e.rawMaterials} />
        <List title={l("Machines and tools", "यंत्रे व साधने")} items={e.equipment} />
        <List title={l("Place needed", "लागणारी जागा")} items={[e.space]} />
        <List title={l("Risks", "जोखीम")} items={e.risks} />
        <List title={l("Permissions to check", "तपासायच्या परवानग्या")} items={e.licences} />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted">{l("Rules depend on your product, place and size. Check current official sources or a qualified person. We can’t give legal, tax or food-safety approval.", "नियम तुमचे उत्पादन, ठिकाण व आकार यांवर अवलंबून असतात. सध्याचे अधिकृत स्रोत तपासा किंवा पात्र व्यक्तीला विचारा. आम्ही कायदेशीर, कर किंवा अन्न सुरक्षा मंजुरी देऊ शकत नाही.")}</p>

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

/** A loss reads as −₹500, not ₹-500. */
const money = (n: number) => (n < 0 ? `−${rupees(-n)}` : rupees(n));

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-3">
      <dt className="text-xs leading-tight text-muted">{label}</dt>
      <dd className="mt-1 text-[17px] font-bold leading-tight text-ink">{value}</dd>
    </div>
  );
}
