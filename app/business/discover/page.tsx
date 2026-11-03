"use client";

import Link from "next/link";
import { Ban, Check, ChevronRight, HelpCircle, Pencil, UserRound } from "lucide-react";
import { SpeakButton } from "@/components/speech";
import { useFarm } from "@/components/myfarm/ui";
import { Badge, Card, LinkButton, Note, PageHeader, SectionTitle, rupees } from "@/components/ui";
import { discover, type Fit, type Recommendation } from "@/lib/enterprise";

export default function DiscoverPage() {
  const { state, hydrated, l } = useFarm();
  if (!hydrated) return null;
  const village = state.enterprise.village;
  if (!village)
    return (
      <div>
        <PageHeader back="/business" title={l("Business ideas", "व्यवसाय कल्पना")} />
        <LinkButton href="/business/village" full>
          {l("Tell us about your village first", "आधी तुमच्या गावाची माहिती द्या")}
        </LinkButton>
      </div>
    );

  const { top, others } = discover(village);
  const example = village.source === "example";

  return (
    <div className="pb-16">
      <PageHeader back="/business" title={l("Ideas for your village", "तुमच्या गावासाठी कल्पना")} sub={example ? l("Using an example village, not a real survey.", "उदाहरणार्थ गाव वापरले आहे, प्रत्यक्ष सर्वेक्षण नाही.") : village.name} />

      <div className="grid grid-cols-2 gap-2">
        <LinkButton href="/business/village" variant="secondary">
          <Pencil size={16} /> {l("Change details", "माहिती बदला")}
        </LinkButton>
        <LinkButton href="/business/me" variant="secondary">
          <UserRound size={16} /> {l("My profile", "माझी माहिती")}
        </LinkButton>
      </div>

      <div className="mt-3">
        <Note>{l("These are ideas worth checking, not advice to invest. Don’t buy any machine until real buyers say yes.", "या तपासून पाहण्याजोग्या कल्पना आहेत, गुंतवणुकीचा सल्ला नव्हे. प्रत्यक्ष खरेदीदार हो म्हणेपर्यंत कोणतेही यंत्र घेऊ नका.")}</Note>
      </div>

      {top.length === 0 ? (
        <Card className="mt-3">
          <p className="font-bold">{l("No idea fits your details yet", "तुमच्या माहितीत अजून कोणतीही कल्पना बसत नाही")}</p>
          <p className="mt-1 text-sm text-muted">{l("See below what is stopping each one.", "प्रत्येक कल्पनेला काय अडथळा आहे ते खाली पाहा.")}</p>
        </Card>
      ) : (
        <div className="mt-3 space-y-3">
          {top.map((r, i) => (
            <IdeaCard key={r.enterprise.id} r={r} rank={i + 1} />
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

      <p className="mt-4 text-xs leading-relaxed text-muted">{l("Ideas are ranked by a simple score of raw material, buyers, money, skills, facilities, distance and local jobs. A high score is not proof that a business will make money.", "कच्चा माल, खरेदीदार, पैसा, कौशल्य, सुविधा, अंतर व स्थानिक रोजगार यांच्या साध्या गुणांवरून क्रम लावला आहे. जास्त गुण म्हणजे व्यवसाय नफ्यात चालेल याचा पुरावा नव्हे.")}</p>
    </div>
  );
}

function fitBadge(fit: Fit, l: (en: string, mr: string) => string) {
  if (fit === "worth_checking") return <Badge tone="green">{l("Worth checking", "तपासण्याजोगी")}</Badge>;
  if (fit === "possible") return <Badge tone="gold">{l("Possible", "शक्य")}</Badge>;
  return <Badge>{l("Weak fit", "कमी जुळणारी")}</Badge>;
}

function IdeaCard({ r, rank }: { r: Recommendation; rank: number }) {
  const { l, tx, ctx, num } = useFarm();
  const e = r.enterprise;
  const speech = [tx(e.name), tx(e.summary), ...r.reasons.map(tx), r.missing.length ? l("Still to find out:", "अजून शोधायचे:") : "", ...r.missing.map(tx)].filter(Boolean).join(". ");
  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="text-3xl" aria-hidden="true">
          {e.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-muted">{l(`Idea ${rank}`, `कल्पना ${num(rank)}`)}</p>
          <h2 className="text-lg font-bold leading-snug text-ink">{tx(e.name)}</h2>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {fitBadge(r.fit, l)}
            <Badge>{r.confidence === "medium" ? l("Some evidence", "काही पुरावा") : l("Little evidence yet", "अजून कमी पुरावा")}</Badge>
          </div>
        </div>
        <SpeakButton id={`idea:${e.id}`} text={speech} size="sm" />
      </div>

      <p className="mt-2 text-[15px] leading-snug">{tx(e.summary)}</p>
      <p className="mt-2 text-sm font-semibold text-ink">
        {l("Rough setup cost", "अंदाजे सुरुवातीचा खर्च")}: {rupees(e.investment[0])} – {rupees(e.investment[1])}
      </p>

      {r.reasons.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm">
          {r.reasons.map((x) => (
            <li key={x.en} className="flex gap-1.5">
              <Check size={16} className="mt-0.5 shrink-0 text-leaf-700" aria-hidden="true" /> <span>{ctx(x)}</span>
            </li>
          ))}
        </ul>
      )}
      {r.missing.length > 0 && (
        <>
          <p className="mt-2 text-sm font-bold text-ink">{l("Still to find out", "अजून शोधायचे")}</p>
          <ul className="mt-1 space-y-1 text-sm text-muted">
            {r.missing.map((x) => (
              <li key={x.en} className="flex gap-1.5">
                <HelpCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> <span>{ctx(x)}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <Link href={`/business/idea/${e.id}`} className="mt-3 flex min-h-12 items-center justify-center gap-1 rounded-xl bg-leaf-700 font-bold text-white">
        {l("See the full plan and money", "पूर्ण आराखडा व हिशोब पाहा")} <ChevronRight size={18} />
      </Link>
    </Card>
  );
}

function Other({ r }: { r: Recommendation }) {
  const { l, tx, ctx } = useFarm();
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
            <span className="text-sm text-muted">{l("Fits less well than the ideas above.", "वरील कल्पनांपेक्षा कमी जुळते.")}</span>
          )}
        </span>
        <ChevronRight size={18} className="shrink-0 text-muted" />
      </Card>
    </Link>
  );
}
