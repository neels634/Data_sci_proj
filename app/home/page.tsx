"use client";

import Link from "next/link";
import { ArrowRight, BellRing, Briefcase, ChevronRight, Landmark, MapPin, MessageCircle, Phone, ShoppingBasket, Users } from "lucide-react";
import { matchSchemes, useStore } from "@/lib/store";
import { CURRENT_MITRA, seedBuyers } from "@/lib/data";
import { Badge, Card, SectionTitle, statusTone } from "@/components/ui";

export default function FarmerHome() {
  const { state, l, tx, lbl, toast, isMine } = useStore();
  const { profile } = state;
  const suggestions = matchSchemes(state.schemes, profile).slice(0, 3);
  const mine = state.listings.filter((x) => isMine(x) && x.status !== "Cancelled");
  const offersWaiting = mine.filter((x) => x.status === "Offer received");
  const demand = seedBuyers.flatMap((b) => b.commodities.map((c) => ({ c, b })));
  const demandCrops = Array.from(new Set(demand.map((d) => d.c)));
  const soon = () => toast({ en: "This will connect you to your Mitra in the full app", mr: "पूर्ण ॲपमध्ये यातून तुमच्या मित्राशी थेट संपर्क होईल" });

  const tiles = [
    { href: "/schemes", label: l("Schemes", "योजना"), icon: <Landmark size={26} />, tone: "bg-leaf-100 text-leaf-700" },
    { href: "/sell", label: l("Sell produce", "माल विका"), icon: <ShoppingBasket size={26} />, tone: "bg-soil-100 text-soil" },
    { href: "/business", label: l("Business", "व्यवसाय"), icon: <Briefcase size={26} />, tone: "bg-gold-100 text-gold" },
    { href: "/women", label: l("Women & SHG", "महिला व बचत गट"), icon: <Users size={26} />, tone: "bg-[#ece4f3] text-[#5d3f7a]" },
  ];

  return (
    <div>
      <p className="text-muted">{l("Namaskar", "नमस्कार")},</p>
      <h1 className="text-2xl font-bold">{tx(profile.name)}</h1>
      <p className="mt-1 flex items-center gap-1 text-sm text-muted">
        <MapPin size={15} /> {tx(profile.village)}, {l(`${tx(profile.district)} district`, `जि. ${tx(profile.district)}`)}
      </p>

      {offersWaiting.length > 0 && (
        <Link href={`/sell/${offersWaiting[0].id}`} className="mt-4 flex items-center gap-3 rounded-2xl bg-soil p-4 text-white">
          <BellRing size={24} className="shrink-0" />
          <span className="flex-1">
            <span className="block font-bold">{l("Buyer offers waiting", "खरेदीदारांच्या ऑफर आल्या आहेत")}</span>
            <span className="block text-sm text-white/90">
              {l(
                `Your ${offersWaiting[0].crop.toLowerCase()} lot has offers. Review the price and charges.`,
                `तुमच्या ${lbl(offersWaiting[0].crop)} लॉटसाठी ऑफर आल्या आहेत. किंमत व खर्च पाहा.`,
              )}
            </span>
          </span>
          <ChevronRight />
        </Link>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        {tiles.map((x) => (
          <Link key={x.href} href={x.href} className="flex min-h-24 flex-col justify-between rounded-2xl border border-line bg-white p-4">
            <span className={`grid size-11 place-items-center rounded-full ${x.tone}`}>{x.icon}</span>
            <span className="mt-2 font-bold">{x.label}</span>
          </Link>
        ))}
      </div>

      <SectionTitle action={<Link href="/schemes" className="text-sm font-semibold text-leaf-700">{l("See all", "सर्व पहा")}</Link>}>
        {l("Schemes you may be eligible for", "तुम्हाला लागू होऊ शकतील अशा योजना")}
      </SectionTitle>
      <div className="space-y-2">
        {suggestions.map((s) => (
          <Link key={s.id} href={`/schemes/${s.id}`} className="block">
            <Card className="flex items-center gap-3">
              <div className="flex-1">
                <p className="font-semibold leading-snug">{tx(s.name)}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Badge tone="green">{lbl(s.category)}</Badge>
                  <Badge>{lbl(s.level)}</Badge>
                  {state.tracker[s.id] && <Badge tone={statusTone(state.tracker[s.id])}>{lbl(state.tracker[s.id])}</Badge>}
                </div>
              </div>
              <ChevronRight className="text-muted" />
            </Card>
          </Link>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">
        {l(
          "Suggestions are based on your answers and are indicative only. Final eligibility is decided by the department.",
          "सूचना तुमच्या उत्तरांवर आधारित असून केवळ अंदाज आहेत. अंतिम पात्रता संबंधित विभाग ठरवतो.",
        )}
      </p>

      <SectionTitle>{l("Sell your produce", "तुमचा माल विका")}</SectionTitle>
      <Card>
        {mine.length ? (
          <ul className="divide-y divide-line">
            {mine.slice(0, 3).map((x) => (
              <li key={x.id}>
                <Link href={`/sell/${x.id}`} className="flex min-h-12 items-center justify-between gap-2 py-2">
                  <span>
                    <span className="font-semibold">{lbl(x.crop)}</span>{" "}
                    <span className="text-muted">
                      · {x.quantity} {l("qtl", "क्विंटल")}
                    </span>
                  </span>
                  <Badge tone={statusTone(x.status)}>{lbl(x.status)}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">{l("List a crop or ask your Mandi Mitra for help", "पीक नोंदवा किंवा मंडी मित्राची मदत घ्या")}</p>
        )}
        <Link href="/sell/new" className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-leaf-700 font-semibold text-white">
          {l("New listing", "नवीन नोंद")} <ArrowRight size={18} />
        </Link>
      </Card>

      <SectionTitle>{l("Your Mandi Mitra", "तुमचा मंडी मित्र")}</SectionTitle>
      <Card className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-full bg-leaf-700 text-lg font-bold text-white">{l("GS", "गशि")}</span>
        <div className="flex-1">
          <p className="font-bold">{tx(CURRENT_MITRA)}</p>
          <p className="text-sm text-muted">
            {l("Trained Mandi Mitra", "प्रशिक्षित मंडी मित्र")} · {tx(profile.village)}
          </p>
        </div>
        <button onClick={soon} className="grid size-11 place-items-center rounded-full bg-leaf-100 text-leaf-700" aria-label={l("Call Mitra", "मित्राला फोन करा")}>
          <Phone size={20} />
        </button>
        <button onClick={soon} className="grid size-11 place-items-center rounded-full bg-leaf-100 text-leaf-700" aria-label={l("Message Mitra", "मित्राला संदेश पाठवा")}>
          <MessageCircle size={20} />
        </button>
      </Card>

      <SectionTitle>{l("Buyers looking for", "खरेदीदारांना हवे आहे")}</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {demandCrops.map((c) => {
          const n = demand.filter((d) => d.c === c).length;
          return (
            <span key={c} className="rounded-full border border-line bg-white px-3 py-1.5 text-sm">
              <span className="font-semibold">{lbl(c)}</span>{" "}
              <span className="text-muted">· {l(`${n} buyer${n > 1 ? "s" : ""}`, `${n} खरेदीदार`)}</span>
            </span>
          );
        })}
      </div>

      <SectionTitle>{l("Start a village business", "गावात व्यवसाय सुरू करा")}</SectionTitle>
      <Link href="/business" className="block rounded-2xl bg-leaf-700 p-4 text-white">
        <p className="font-bold">{l("Turn your crop into a product", "तुमच्या पिकापासून उत्पादन बनवा")}</p>
        <p className="text-sm text-white/85">
          {l(
            "Pickle, millet flour, chikki, dried onion — step-by-step guides and a cost calculator.",
            "लोणचे, नाचणी पीठ, चिक्की, सुका कांदा — टप्प्याटप्प्याने मार्गदर्शन व खर्च गणक.",
          )}
        </p>
      </Link>
    </div>
  );
}
