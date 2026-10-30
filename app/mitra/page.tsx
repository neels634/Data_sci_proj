"use client";

import Link from "next/link";
import { useState } from "react";
import { Inbox, Layers } from "lucide-react";
import { lotQuantity, useStore } from "@/lib/store";
import { CURRENT_MITRA } from "@/lib/data";
import { Badge, Button, Card, Empty, Note, PageHeader, cx, rupees, statusTone } from "@/components/ui";

export default function MitraRequests() {
  const { state, account, l, tx, lbl, date, createLot } = useStore();
  const [sel, setSel] = useState<string[]>([]);
  const open = state.listings.filter((x) => !x.lotId && (x.status === "With Mitra" || x.status === "Submitted"));
  const crops = Array.from(new Set(open.map((x) => x.crop)));
  const selCrop = state.listings.find((x) => x.id === sel[0])?.crop;
  const selQty = state.listings.filter((x) => sel.includes(x.id)).reduce((a, x) => a + x.quantity, 0);
  const openLots = state.lots.filter((x) => x.status !== "Completed");
  const qtl = l("qtl", "क्विंटल");

  const toggle = (id: string, crop: string) => {
    if (sel.includes(id)) return setSel(sel.filter((x) => x !== id));
    setSel(selCrop && selCrop !== crop ? [id] : [...sel, id]);
  };

  return (
    <div>
      <PageHeader
        title={`${l("Namaskar", "नमस्कार")}, ${(account?.name ?? tx(CURRENT_MITRA)).split(" ")[0]}`}
        sub={l("Farmers waiting for help, and your open lots.", "मदतीची वाट पाहणारे शेतकरी आणि तुमचे चालू लॉट.")}
      />
      <div className="grid grid-cols-3 gap-2">
        {[
          [l("Requests", "विनंत्या"), open.length],
          [l("Open lots", "चालू लॉट"), openLots.length],
          [l("Qtl in lots", "लॉटमधील क्विंटल"), openLots.reduce((a, x) => a + lotQuantity(x, state.listings), 0)],
        ].map(([k, v]) => (
          <Card key={k} className="p-3 text-center">
            <p className="text-2xl font-bold text-leaf-900">{v}</p>
            <p className="text-xs text-muted">{k}</p>
          </Card>
        ))}
      </div>

      <h2 className="mb-1 mt-6 text-lg font-bold">{l("Farmer requests", "शेतकऱ्यांच्या विनंत्या")}</h2>
      <p className="mb-3 text-sm text-muted">{l("Select listings of the same crop to pool them into one lot.", "एकाच पिकाच्या नोंदी निवडा आणि एका लॉटमध्ये एकत्र करा.")}</p>

      {open.length === 0 ? (
        <Empty icon={<Inbox size={32} />} title={l("No open requests", "प्रलंबित विनंत्या नाहीत")} body={l("New farmer listings will appear here.", "शेतकऱ्यांच्या नवीन नोंदी इथे दिसतील.")} />
      ) : (
        crops.map((c) => (
          <div key={c} className="mb-4">
            <p className="mb-2 font-bold text-leaf-900">{lbl(c)}</p>
            <div className="space-y-2">
              {open
                .filter((x) => x.crop === c)
                .map((x) => {
                  const on = sel.includes(x.id);
                  return (
                    <label
                      key={x.id}
                      className={cx("flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border bg-white p-3", on ? "border-leaf-700 ring-2 ring-leaf-700/20" : "border-line")}
                    >
                      <input type="checkbox" className="size-5 accent-leaf-700" checked={on} onChange={() => toggle(x.id, x.crop)} />
                      <span className="flex-1">
                        <span className="block font-semibold">{tx(x.farmer)}</span>
                        <span className="block text-sm text-muted">
                          {x.quantity} {qtl} · {l("Grade", "श्रेणी")} {lbl(x.grade)} · {l("ready", "तयार")} {date(x.availableFrom)}
                          {x.expectedPrice ? ` · ${l("hopes", "अपेक्षा")} ${rupees(x.expectedPrice)}/${qtl}` : ""}
                        </span>
                      </span>
                      <Badge tone={statusTone(x.status)}>{x.wantsMitra ? l("Asked for help", "मदत मागितली") : l("Direct", "थेट")}</Badge>
                    </label>
                  );
                })}
            </div>
          </div>
        ))
      )}

      {sel.length > 0 && (
        <div className="sticky bottom-20 z-20 mt-2 rounded-2xl bg-leaf-900 p-3 text-white shadow-lg">
          <p className="text-sm">
            {l(`${sel.length} listing${sel.length > 1 ? "s" : ""}`, `${sel.length} नोंदी`)} ·{" "}
            <b>
              {selQty} {qtl} {selCrop && lbl(selCrop)}
            </b>
          </p>
          <Button
            variant="secondary"
            full
            className="mt-2"
            onClick={() => {
              createLot(sel);
              setSel([]);
            }}
          >
            <Layers size={18} /> {l("Create pooled lot", "एकत्रित लॉट तयार करा")}
          </Button>
        </div>
      )}

      <div className="mt-6">
        <Note tone="green">
          {l(
            "Record each farmer’s quantity and grade at weighing. Farmers see every charge before they accept — no hidden commission.",
            "वजनाच्या वेळी प्रत्येक शेतकऱ्याचे प्रमाण व श्रेणी नोंदवा. स्वीकारण्यापूर्वी शेतकऱ्यांना प्रत्येक शुल्क दिसते — कोणतेही लपलेले कमिशन नाही.",
          )}
        </Note>
      </div>

      {openLots.length > 0 && (
        <>
          <h2 className="mb-2 mt-6 text-lg font-bold">{l("Open lots", "चालू लॉट")}</h2>
          <div className="space-y-2">
            {openLots.map((lot) => (
              <Link key={lot.id} href={`/mitra/lots/${lot.id}`} className="block">
                <Card className="flex items-center justify-between gap-2">
                  <span>
                    <span className="font-bold">{lbl(lot.crop)}</span>{" "}
                    <span className="text-muted">
                      · {lotQuantity(lot, state.listings)} {qtl} · {l(`${lot.listingIds.length} farmer${lot.listingIds.length === 1 ? "" : "s"}`, `${lot.listingIds.length} शेतकरी`)}
                    </span>
                  </span>
                  <Badge tone={statusTone(lot.status)}>{lbl(lot.status)}</Badge>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
