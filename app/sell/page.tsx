"use client";

import Link from "next/link";
import { ChevronRight, Plus, Sprout } from "lucide-react";
import { useStore } from "@/lib/store";
import { Badge, Card, Empty, LinkButton, PageHeader, Term, rupees, statusTone } from "@/components/ui";

export default function Sell() {
  const { state, l, lbl, date, isMine } = useStore();
  const mine = state.listings.filter(isMine);
  const active = mine.filter((x) => !["Completed", "Cancelled"].includes(x.status));
  const closed = mine.filter((x) => ["Completed", "Cancelled"].includes(x.status));
  const qtl = l("qtl", "क्विंटल");

  return (
    <div>
      <PageHeader back="/mandi" title={l("My listings", "माझ्या नोंदी")} sub={l("List a crop, ask a Gaon Mandi Mitra for help, and see buyer offers.", "पीक नोंदवा, गाव मंडी मित्राची मदत घ्या आणि खरेदीदारांच्या ऑफर पाहा.")} />
      <LinkButton href="/sell/new" full>
        <Plus size={20} /> {l("New listing", "नवीन नोंद")}
      </LinkButton>

      <Card className="mt-4 bg-leaf-50">
        <p className="font-bold text-leaf-900">{l("How selling with a Mandi Mitra works", "मंडी मित्रामार्फत विक्री कशी होते")}</p>
        <ol className="mt-2 space-y-1.5 text-[15px]">
          <li>{l("1. You list your crop, quantity and date.", "1. तुम्ही पीक, प्रमाण व तारीख नोंदवता.")}</li>
          <li>
            {l("2. Your Mitra combines it with neighbours’ lots (", "2. तुमचा मित्र शेजाऱ्यांच्या मालासोबत तो एकत्र करतो (")}
            <Term
              word={l("aggregation", "एकत्रीकरण")}
              meaning={l(
                "Pooling small quantities from several farmers into one larger lot so buyers and transport are cheaper per quintal.",
                "अनेक शेतकऱ्यांचा थोडा थोडा माल एका मोठ्या लॉटमध्ये एकत्र करणे, ज्यामुळे क्विंटलमागे वाहतूक स्वस्त पडते व खरेदीदार मिळतात.",
              )}
            />
            ).
          </li>
          <li>{l("3. Buyers send offers. You see the price and every charge first.", "3. खरेदीदार ऑफर पाठवतात. किंमत व प्रत्येक खर्च तुम्हाला आधी दिसतो.")}</li>
          <li>{l("4. Only you decide to accept. Nothing is sold without your yes.", "4. स्वीकारायचे की नाही हे फक्त तुम्ही ठरवता. तुमच्या होकाराशिवाय काहीही विकले जात नाही.")}</li>
        </ol>
      </Card>

      <h2 className="mb-2 mt-6 text-lg font-bold">{l("My listings", "माझ्या नोंदी")}</h2>
      {active.length === 0 ? (
        <Empty icon={<Sprout size={32} />} title={l("No active listings", "सध्या एकही नोंद नाही")} body={l("List a crop and your Mitra will help you find buyers.", "पीक नोंदवा, तुमचा मित्र खरेदीदार शोधण्यास मदत करेल.")} />
      ) : (
        <div className="space-y-2">
          {active.map((x) => {
            const offers = x.lotId ? state.offers.filter((o) => o.lotId === x.lotId && o.status === "Submitted").length : 0;
            return (
              <Link key={x.id} href={`/sell/${x.id}`} className="block">
                <Card className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-lg font-bold">{lbl(x.crop)}</p>
                      <Badge tone={statusTone(x.status)}>{lbl(x.status)}</Badge>
                    </div>
                    <p className="text-sm text-muted">
                      {x.quantity} {qtl} · {l("Grade", "श्रेणी")} {lbl(x.grade)} · {l("from", "पासून")} {date(x.availableFrom)}
                    </p>
                    <p className="text-sm text-muted">
                      {x.expectedPrice
                        ? `${l("Your expected price", "तुमची अपेक्षित किंमत")}: ${rupees(x.expectedPrice)}/${qtl}`
                        : l("No expected price given", "अपेक्षित किंमत दिलेली नाही")}
                    </p>
                    {offers > 0 && <p className="mt-1 text-sm font-semibold text-soil">{l(`${offers} offer${offers > 1 ? "s" : ""} to review`, `पाहण्यासाठी ${offers} ऑफर`)}</p>}
                  </div>
                  <ChevronRight className="text-muted" />
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {closed.length > 0 && (
        <>
          <h2 className="mb-2 mt-6 text-lg font-bold">{l("Past listings", "जुन्या नोंदी")}</h2>
          <div className="space-y-2">
            {closed.map((x) => (
              <Link key={x.id} href={`/sell/${x.id}`} className="block">
                <Card className="flex items-center justify-between">
                  <span>
                    <span className="font-semibold">{lbl(x.crop)}</span>{" "}
                    <span className="text-muted">
                      · {x.quantity} {qtl}
                    </span>
                  </span>
                  <Badge tone={statusTone(x.status)}>{lbl(x.status)}</Badge>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
