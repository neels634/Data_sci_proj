"use client";

import Link from "next/link";
import { Ban, Check, ChevronRight, HelpCircle, Pencil } from "lucide-react";
import { SpeakButton } from "@/components/speech";
import { useFarm } from "@/components/myfarm/ui";
import { Badge, Card, LinkButton, Note, PageHeader, SectionTitle, rupees } from "@/components/ui";
import { discover, type Recommendation } from "@/lib/enterprise";

export default function DiscoverPage() {
  const { state, hydrated, l } = useFarm();
  if (!hydrated) return null;
  const assets = state.enterprise.assets;
  if (!assets)
    return (
      <div>
        <PageHeader back="/business" title={l("Small business ideas", "लहान व्यवसाय कल्पना")} />
        <LinkButton href="/business/village" full>
          {l("First tell us what you have", "आधी तुमच्याकडे काय आहे ते सांगा")}
        </LinkButton>
      </div>
    );

  const { top, others } = discover(assets);

  return (
    <div className="pb-16">
      <PageHeader back="/business" title={l("Small businesses you could try", "तुम्ही करून पाहू शकता असे लहान व्यवसाय")} sub={assets.source === "example" ? l("This is only an example, not your answers.", "हे फक्त उदाहरण आहे, तुमची उत्तरे नव्हेत.") : undefined} />

      <LinkButton href="/business/village" variant="secondary" full>
        <Pencil size={16} /> {assets.source === "example" ? l("Use my own answers", "माझी उत्तरे वापरा") : l("Change my answers", "माझी उत्तरे बदला")}
      </LinkButton>

      <div className="mt-3">
        <Note>{l("Start small and test first. Don’t take a loan or buy costly things until people really buy from you.", "लहान सुरुवात करा व आधी तपासा. लोक प्रत्यक्ष विकत घेईपर्यंत कर्ज काढू नका किंवा महाग वस्तू घेऊ नका.")}</Note>
      </div>

      {top.length === 0 ? (
        <Card className="mt-3">
          <p className="font-bold">{l("Nothing fits your answers yet", "तुमच्या उत्तरांत अजून काही बसत नाही")}</p>
          <p className="mt-1 text-sm text-muted">{l("See below what each idea needs.", "प्रत्येक कल्पनेला काय लागते ते खाली पाहा.")}</p>
        </Card>
      ) : (
        <div className="mt-3 space-y-3">
          {top.map((r) => (
            <IdeaCard key={r.enterprise.id} r={r} />
          ))}
        </div>
      )}

      {others.length > 0 && (
        <>
          <SectionTitle>{l("Other ideas", "इतर कल्पना")}</SectionTitle>
          <div className="space-y-2">
            {others.map((r) => (
              <Other key={r.enterprise.id} r={r} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function IdeaCard({ r }: { r: Recommendation }) {
  const { l, tx, ctx } = useFarm();
  const e = r.enterprise;
  const start = l(`You can start with about ${rupees(e.investment[0])} to ${rupees(e.investment[1])}.`, `साधारण ${rupees(e.investment[0])} ते ${rupees(e.investment[1])} मध्ये सुरू करता येते.`);
  const speech = [`${tx(e.name)}.`, tx(e.summary), start, ...r.reasons.map((x) => tx(x)), ...r.toFind.map((x) => `${tx(x)}.`)].join(" ");
  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="text-4xl" aria-hidden="true">
          {e.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold leading-snug text-ink">{tx(e.name)}</h2>
          {r.fit === "good" && (
            <div className="mt-1">
              <Badge tone="green">{l("Suits you well", "तुम्हाला चांगले जुळते")}</Badge>
            </div>
          )}
        </div>
        <SpeakButton id={`idea:${e.id}`} text={speech} size="sm" />
      </div>

      <p className="mt-2 text-[15px] leading-snug">{tx(e.summary)}</p>
      <p className="mt-2 font-bold text-ink">{start}</p>

      {r.reasons.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm">
          {r.reasons.map((x) => (
            <li key={x.en} className="flex gap-1.5">
              <Check size={16} className="mt-0.5 shrink-0 text-leaf-700" aria-hidden="true" /> <span>{ctx(x)}</span>
            </li>
          ))}
        </ul>
      )}
      {r.toFind.length > 0 && (
        <ul className="mt-1 space-y-1 text-sm text-muted">
          {r.toFind.map((x) => (
            <li key={x.en} className="flex gap-1.5">
              <HelpCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> <span>{ctx(x)}</span>
            </li>
          ))}
        </ul>
      )}

      <Link href={`/business/idea/${e.id}`} className="mt-3 flex min-h-12 items-center justify-center gap-1 rounded-xl bg-leaf-700 font-bold text-white">
        {l("How to start and what I can earn", "कसे सुरू करावे व किती मिळू शकते")} <ChevronRight size={18} />
      </Link>
    </Card>
  );
}

function Other({ r }: { r: Recommendation }) {
  const { tx, ctx, l } = useFarm();
  const e = r.enterprise;
  return (
    <Link href={`/business/idea/${e.id}`} className="block">
      <Card className="flex items-center gap-3 p-3">
        <span className="text-2xl" aria-hidden="true">
          {e.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold leading-snug">{tx(e.name)}</span>
          {r.blockers.length > 0 ? (
            <span className="mt-0.5 flex gap-1 text-sm text-soil">
              <Ban size={15} className="mt-0.5 shrink-0" aria-hidden="true" /> <span>{ctx(r.blockers[0])}</span>
            </span>
          ) : (
            <span className="text-sm text-muted">{l(`From about ${rupees(e.investment[0])}`, `साधारण ${rupees(e.investment[0])} पासून`)}</span>
          )}
        </span>
        <ChevronRight size={18} className="shrink-0 text-muted" />
      </Card>
    </Link>
  );
}
