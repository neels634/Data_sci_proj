"use client";

import Link from "next/link";
import { Calculator, ChevronRight, Store, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { seedGuides } from "@/lib/data";
import { calc } from "@/components/CostCalculator";
import { Badge, Card, LinkButton, PageHeader, SectionTitle, Term, rupees } from "@/components/ui";

export default function Business() {
  const { state, l, tx, lbl, date, deletePlan } = useStore();
  const myCrops = state.profile.crops;
  const myPlans = state.plans.filter((p) => p.owner === state.sessionId);

  return (
    <div>
      <PageHeader
        back="/home"
        title={l("Start a village business", "गावात व्यवसाय सुरू करा")}
        sub={l("Process, pack and sell locally instead of only selling raw produce.", "फक्त कच्चा माल विकण्याऐवजी प्रक्रिया करा, पॅक करा आणि स्थानिक पातळीवर विका.")}
      />
      <Card className="bg-leaf-50 text-[15px]">
        <Term
          word={l("Value addition", "मूल्यवर्धन")}
          meaning={l("Turning a raw crop into a product worth more — e.g. mango into pickle.", "कच्च्या पिकापासून जास्त किमतीचे उत्पादन बनवणे — उदा. आंब्यापासून लोणचे.")}
        />{" "}
        {l(
          "means turning your crop into a product people pay more for. Start small, test with local buyers, then grow.",
          "म्हणजे तुमच्या पिकापासून लोक जास्त पैसे देतील असे उत्पादन बनवणे. लहान सुरुवात करा, स्थानिक ग्राहकांकडून चाचणी घ्या, मग वाढवा.",
        )}
      </Card>

      <Link href={state.enterprise.village ? "/business/discover" : "/business/village"} className="mt-3 block rounded-3xl bg-gradient-to-br from-leaf-700 to-leaf-900 p-4 text-white">
        <p className="flex items-center gap-2 text-xl font-bold">
          <Store size={22} aria-hidden="true" /> {l("Gaon Tithe Udyojak", "गाव तिथे उद्योजक")}
        </p>
        <p className="mt-1 text-[15px] text-white/90">{l("Which business could work in your village? Tell us what your village has. See 3 ideas, the reasons, and the money.", "तुमच्या गावात कोणता व्यवसाय चालू शकतो? गावात काय आहे ते सांगा. ३ कल्पना, त्यामागची कारणे व पैशांचा हिशोब पाहा.")}</p>
        <p className="mt-3 flex min-h-12 items-center justify-center gap-1 rounded-xl bg-white font-bold text-leaf-900">
          {state.enterprise.village ? l("See my village’s ideas", "माझ्या गावाच्या कल्पना पाहा") : l("Find a business for my village", "माझ्या गावासाठी व्यवसाय शोधा")} <ChevronRight size={18} />
        </p>
      </Link>

      <SectionTitle>{l("Business guides", "व्यवसाय मार्गदर्शक")}</SectionTitle>
      <div className="space-y-2">
        {seedGuides.map((g) => (
          <Link key={g.id} href={`/business/${g.id}`} className="block">
            <Card className="flex items-center gap-3">
              <div className="flex-1">
                <p className="font-bold">{tx(g.title)}</p>
                <p className="line-clamp-2 text-sm text-muted">{tx(g.summary)}</p>
                <div className="mt-1.5 flex gap-1.5">
                  <Badge tone="gold">{l(`Uses ${g.crop.toLowerCase()}`, `${lbl(g.crop)} वापरून`)}</Badge>
                  {myCrops.includes(g.crop) && <Badge tone="green">{l("You grow this", "हे तुम्ही पिकवता")}</Badge>}
                </div>
              </div>
              <ChevronRight className="text-muted" />
            </Card>
          </Link>
        ))}
      </div>

      <LinkButton href="/calculator" variant="secondary" full className="mt-4">
        <Calculator size={18} /> {l("Cost calculator for any product", "कोणत्याही उत्पादनासाठी खर्च गणक")}
      </LinkButton>

      <SectionTitle>{l("My business plans", "माझे व्यवसाय आराखडे")}</SectionTitle>
      {myPlans.length === 0 ? (
        <p className="text-sm text-muted">{l("Plans you save from a guide or the calculator appear here.", "मार्गदर्शक किंवा गणकातून जतन केलेले आराखडे इथे दिसतील.")}</p>
      ) : (
        <div className="space-y-2">
          {myPlans.map((p) => {
            const r = calc(p.inputs);
            return (
              <Card key={p.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-bold">{tx(p.product)}</p>
                  <p className="text-sm text-muted">
                    {l(
                      `${p.inputs.units} units · margin ${rupees(r.margin)} (${r.pct.toFixed(0)}%) · saved ${date(p.savedAt)}`,
                      `${p.inputs.units} नग · नफा ${rupees(r.margin)} (${r.pct.toFixed(0)}%) · जतन ${date(p.savedAt)}`,
                    )}
                  </p>
                </div>
                <button onClick={() => deletePlan(p.id)} className="grid size-11 place-items-center rounded-full text-soil" aria-label={l("Delete", "हटवा")}>
                  <Trash2 size={18} />
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
