"use client";

import Link from "next/link";
import { ChevronRight, Inbox, Pencil, Plus, Store } from "lucide-react";
import { useStore } from "@/lib/store";
import { seedGuides } from "@/lib/data";
import { ROLE_HOME } from "@/components/AppShell";
import { Badge, Button, Card, LinkButton, PageHeader, SectionTitle, rupees, statusTone } from "@/components/ui";

export default function Women() {
  const { state, l, tx, lbl, date, setEnquiryStatus, isMine } = useStore();
  const isBuyer = state.role === "buyer";
  const mine = state.enterprises.find(isMine);
  const showcase = state.enterprises.filter((e) => !isMine(e) && e.consentToShowcase);
  const myEnquiries = mine ? state.enquiries.filter((q) => q.enterpriseId === mine.id) : [];
  const womenSchemes = state.schemes.filter((s) => s.tags.includes("women") && s.status !== "archived");

  return (
    <div>
      <PageHeader
        back={ROLE_HOME[state.role]}
        title={isBuyer ? l("Products from women-led enterprises", "महिला उद्योगांची उत्पादने") : l("Women & SHG enterprise", "महिला व बचत गट उद्योग")}
        sub={
          isBuyer
            ? l("Send an enquiry — contact details are shared only when the group agrees.", "चौकशी पाठवा — गटाने होकार दिल्यावरच संपर्क तपशील दिले जातात.")
            : l("Build and grow your business — as an owner, producer and decision-maker.", "मालकीण, उत्पादक व निर्णयकर्ती म्हणून तुमचा व्यवसाय उभा करा आणि वाढवा.")
        }
      />

      {!isBuyer && (
        <>
          {mine ? (
            <Card className="border-leaf-700/30 bg-leaf-50">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-leaf-700">{l("My enterprise", "माझा उद्योग")}</p>
                  <p className="text-lg font-bold">{tx(mine.name)}</p>
                  <p className="text-sm text-muted">
                    {tx(mine.group)} · {l(`${mine.products.length} products`, `${mine.products.length} उत्पादने`)}
                  </p>
                </div>
                <LinkButton href="/women/profile" variant="secondary" className="min-h-10 px-3 text-sm">
                  <Pencil size={14} /> {l("Edit", "बदला")}
                </LinkButton>
              </div>
            </Card>
          ) : (
            <Card className="bg-leaf-700 text-white">
              <p className="text-lg font-bold">{l("Put your group’s products in front of buyers", "तुमच्या गटाची उत्पादने खरेदीदारांपर्यंत पोहोचवा")}</p>
              <p className="mt-1 text-sm text-white/85">
                {l(
                  "Create a free profile for your SHG or enterprise. Buyers contact you through Shet Samruddhi — your phone number stays private.",
                  "तुमच्या बचत गटाचे किंवा उद्योगाचे मोफत प्रोफाइल तयार करा. खरेदीदार शेत समृद्धीमार्फत संपर्क करतात — तुमचा फोन नंबर गोपनीय राहतो.",
                )}
              </p>
              <LinkButton href="/women/profile" variant="secondary" full className="mt-3">
                <Plus size={18} /> {l("Create enterprise profile", "उद्योग प्रोफाइल तयार करा")}
              </LinkButton>
            </Card>
          )}

          {mine && (
            <>
              <SectionTitle>
                <span className="flex items-center gap-2">
                  <Inbox size={18} /> {l("Buyer enquiries", "खरेदीदारांच्या चौकशा")}
                </span>
              </SectionTitle>
              {myEnquiries.length === 0 ? (
                <p className="text-sm text-muted">{l("No enquiries yet. Enquiries from buyers will appear here.", "अजून चौकशी नाही. खरेदीदारांच्या चौकशा इथे दिसतील.")}</p>
              ) : (
                <div className="space-y-2">
                  {myEnquiries.map((q) => (
                    <Card key={q.id}>
                      <div className="flex items-center justify-between">
                        <p className="font-bold">{tx(q.from)}</p>
                        <Badge tone={statusTone(q.status)}>{lbl(q.status)}</Badge>
                      </div>
                      <p className="mt-1 text-[15px]">“{tx(q.message)}”</p>
                      <p className="text-xs text-muted">{date(q.createdAt)}</p>
                      {q.status === "New" && (
                        <Button variant="secondary" className="mt-2 min-h-10" onClick={() => setEnquiryStatus(q.id, "Replied")}>
                          {l("Mark as replied", "उत्तर दिले म्हणून नोंदवा")}
                        </Button>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      <SectionTitle>{isBuyer ? l("Enterprises", "उद्योग") : l("Women-led enterprises near you", "तुमच्या जवळचे महिला उद्योग")}</SectionTitle>
      <div className="space-y-2">
        {(isBuyer ? state.enterprises.filter((e) => e.consentToShowcase) : showcase).map((e) => (
          <Link key={e.id} href={`/women/${e.id}`} className="block">
            <Card className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#ece4f3] text-[#5d3f7a]">
                <Store size={22} />
              </span>
              <div className="flex-1">
                <p className="font-bold">{tx(e.name)}</p>
                <p className="text-sm text-muted">
                  {tx(e.group)} · {l(`${e.members} members`, `${e.members} सदस्या`)} · {tx(e.village)}
                </p>
                <p className="mt-0.5 text-sm">{e.products.map((p) => `${tx(p.name)} ${rupees(p.price)}`).join(" · ")}</p>
              </div>
              <ChevronRight className="text-muted" />
            </Card>
          </Link>
        ))}
      </div>

      {!isBuyer && (
        <>
          <SectionTitle>{l("Business ideas from local crops", "स्थानिक पिकांपासून व्यवसाय कल्पना")}</SectionTitle>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {seedGuides.map((g) => (
              <Link key={g.id} href={`/business/${g.id}`} className="w-44 shrink-0 rounded-2xl border border-line bg-white p-3">
                <p className="font-bold leading-snug">{tx(g.title)}</p>
                <p className="mt-1 line-clamp-3 text-sm text-muted">{tx(g.summary)}</p>
              </Link>
            ))}
          </div>

          <SectionTitle>{l("Schemes for women & SHGs", "महिला व बचत गटांसाठी योजना")}</SectionTitle>
          <div className="space-y-2">
            {womenSchemes.map((s) => (
              <Link key={s.id} href={`/schemes/${s.id}`} className="block">
                <Card className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{tx(s.name)}</span>
                  <ChevronRight className="shrink-0 text-muted" />
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
