"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Chips } from "@/components/enterprise/ui";
import { useFarm } from "@/components/myfarm/ui";
import { Input } from "@/components/voice";
import { Button, Card, Field, PageHeader, SectionTitle, cx, inputCls } from "@/components/ui";
import { SKILL_OPTIONS, enterpriseById, type EntrepreneurProfile } from "@/lib/enterprise";

const EMPTY: EntrepreneurProfile = { skills: [], experience: "", investment: "", training: "", working: "" };

export default function EntrepreneurPage() {
  const { state, hydrated } = useFarm();
  if (!hydrated) return null;
  return <Form saved={state.enterprise.entrepreneur ?? EMPTY} />;
}

function Form({ saved }: { saved: EntrepreneurProfile }) {
  const { state, account, l, tx, num, saveEnterprise, toast } = useFarm();
  const [p, setP] = useState(saved);
  const set = (patch: Partial<EntrepreneurProfile>) => setP((old) => ({ ...old, ...patch }));

  const ways: [EntrepreneurProfile["working"], string][] = [
    ["alone", l("On my own", "एकटा / एकटी")],
    ["family", l("With family", "कुटुंबासोबत")],
    ["shg", l("With an SHG", "बचत गटासोबत")],
    ["fpo", l("With an FPO", "शेतकरी कंपनीसोबत")],
  ];
  const ideas = Object.entries(state.enterprise.ideas).flatMap(([id, idea]) => {
    const e = enterpriseById(id);
    return e ? [{ e, idea }] : [];
  });

  return (
    <div className="pb-16">
      <PageHeader back="/business/discover" title={l("My entrepreneur profile", "माझी उद्योजक माहिती")} sub={account?.name} />

      <Card className="space-y-4">
        <Chips label={l("My skills", "माझी कौशल्ये")} options={SKILL_OPTIONS} value={p.skills} onChange={(skills) => set({ skills })} />
        <Field label={l("My work experience", "माझा कामाचा अनुभव")}>
          <Input className={inputCls} maxLength={200} value={p.experience} onChange={(e) => set({ experience: e.target.value })} />
        </Field>
        <Field label={l("Money I can invest", "मी गुंतवू शकतो ती रक्कम")}>
          <select className={inputCls} value={p.investment} onChange={(e) => set({ investment: e.target.value })}>
            <option value="">{l("Not sure yet", "अजून ठरले नाही")}</option>
            <option value="under-1l">{l("Under ₹1 lakh", "₹१ लाखापेक्षा कमी")}</option>
            <option value="1-3l">{l("₹1 to 3 lakh", "₹१ ते ३ लाख")}</option>
            <option value="3-5l">{l("₹3 to 5 lakh", "₹३ ते ५ लाख")}</option>
            <option value="over-5l">{l("Over ₹5 lakh", "₹५ लाखांपेक्षा जास्त")}</option>
          </select>
        </Field>
        <Field label={l("Training I need", "मला लागणारे प्रशिक्षण")}>
          <Input className={inputCls} maxLength={200} value={p.training} onChange={(e) => set({ training: e.target.value })} />
        </Field>
        <div role="group" aria-label={l("How I want to work", "मला कसे काम करायचे आहे")}>
          <p className="mb-1 text-[15px] font-semibold text-ink">{l("How I want to work", "मला कसे काम करायचे आहे")}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {ways.map(([v, name]) => (
              <button key={v} type="button" aria-pressed={p.working === v} onClick={() => set({ working: p.working === v ? "" : v })} className={cx("min-h-11 rounded-xl border text-sm font-semibold", p.working === v ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white text-ink")}>
                {name}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Button
        full
        className="mt-3 min-h-14 text-lg"
        onClick={() => {
          saveEnterprise({ entrepreneur: p });
          toast(l("Profile saved", "माहिती जतन झाली"));
        }}
      >
        {l("Save my profile", "माझी माहिती जतन करा")}
      </Button>
      <p className="mt-1.5 text-xs text-muted">{l("Saved only on this phone. No one else can see it.", "फक्त या फोनवर जतन होते. इतर कोणाला दिसत नाही.")}</p>

      <SectionTitle>{l("My business ideas", "माझ्या व्यवसाय कल्पना")}</SectionTitle>
      {ideas.length === 0 ? (
        <p className="text-sm text-muted">{l("Ideas you work on appear here with your progress.", "तुम्ही काम करत असलेल्या कल्पना प्रगतीसह येथे दिसतील.")}</p>
      ) : (
        <div className="space-y-1.5">
          {ideas.map(({ e, idea }) => (
            <Link key={e.id} href={`/business/idea/${e.id}`} className="flex min-h-14 items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2">
              <span className="text-xl" aria-hidden="true">
                {e.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold leading-snug">{tx(e.name)}</span>
                <span className="block text-xs text-muted">{l(`${num(idea.checked.length)} of ${num(e.validation.length)} checks done`, `${num(e.validation.length)} पैकी ${num(idea.checked.length)} तपासण्या झाल्या`)}</span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-muted" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
