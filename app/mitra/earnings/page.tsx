"use client";

import { lotQuantity, useStore } from "@/lib/store";
import { MITRA_FEE_PER_QUINTAL } from "@/lib/data";
import { cropName, toQuintals } from "@/lib/grades";
import { Badge, Card, Note, PageHeader, rupees, statusTone } from "@/components/ui";

export default function MitraEarnings() {
  const { state, l, lbl, tx, num } = useStore();
  const rows = state.lots
    .filter((x) => x.status !== "Open for offers")
    .map((lot) => {
      const qty = Math.round(toQuintals(lotQuantity(lot, state.listings), lot.unit) * 100) / 100;
      return { lot, qty, fee: qty * MITRA_FEE_PER_QUINTAL };
    });
  const confirmed = rows.filter((r) => r.lot.status === "Completed").reduce((a, r) => a + r.fee, 0);
  const pending = rows.filter((r) => r.lot.status !== "Completed").reduce((a, r) => a + r.fee, 0);

  return (
    <div>
      <PageHeader
        back="/mitra"
        title={l("My earnings", "माझी कमाई")}
        sub={l(
          `Service fee: ${rupees(MITRA_FEE_PER_QUINTAL)} per quintal, disclosed to every farmer.`,
          `सेवा शुल्क: प्रति क्विंटल ${rupees(MITRA_FEE_PER_QUINTAL)}, प्रत्येक शेतकऱ्याला आधी सांगितलेले.`,
        )}
      />
      <div className="grid grid-cols-2 gap-2">
        <Card className="bg-leaf-700 text-white">
          <p className="text-sm text-white/80">{l("Earned (completed)", "मिळालेली (पूर्ण)")}</p>
          <p className="text-2xl font-bold">{rupees(confirmed)}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">{l("Expected (in progress)", "अपेक्षित (चालू)")}</p>
          <p className="text-2xl font-bold text-leaf-900">{rupees(pending)}</p>
        </Card>
      </div>

      <h2 className="mb-2 mt-6 text-lg font-bold">{l("By lot", "लॉटनुसार")}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-muted">{l("Fees appear here once farmers accept an offer on one of your lots.", "तुमच्या लॉटवरील ऑफर शेतकऱ्यांनी स्वीकारल्यावर शुल्क इथे दिसेल.")}</p>
      ) : (
        <div className="space-y-2">
          {rows.map(({ lot, qty, fee }) => (
            <Card key={lot.id} className="flex items-center justify-between gap-2">
              <span>
                <span className="font-bold">{tx(cropName(lot.crop))}</span>{" "}
                <span className="text-muted">
                  · {num(qty)} {l("qtl", "क्विंटल")}
                </span>
                <span className="block">
                  <Badge tone={statusTone(lot.status)}>{lbl(lot.status)}</Badge>
                </span>
              </span>
              <span className="text-lg font-bold">{rupees(fee)}</span>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-6">
        <Note tone="green">
          {l(
            "Every fee is recorded per farmer so farmers and coordinators can check it.",
            "प्रत्येक शुल्क शेतकरीनिहाय नोंदवले जाते, त्यामुळे शेतकरी व समन्वयक ते तपासू शकतात.",
          )}
        </Note>
      </div>
    </div>
  );
}
