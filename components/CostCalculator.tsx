"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Text } from "@/lib/i18n";
import type { CostInputs } from "@/lib/types";
import { Button, Card, Field, cx, inputCls, rupees } from "./ui";
import { Input, TextArea } from "./voice";

const ROWS: { key: keyof CostInputs; en: string; mr: string }[] = [
  { key: "rawMaterial", en: "Raw material", mr: "कच्चा माल" },
  { key: "processing", en: "Processing (spices, fuel, milling…)", mr: "प्रक्रिया (मसाले, इंधन, दळण…)" },
  { key: "packaging", en: "Packaging & labels", mr: "पॅकिंग व लेबल" },
  { key: "labour", en: "Labour", mr: "मजुरी" },
  { key: "transport", en: "Transport", mr: "वाहतूक" },
  { key: "other", en: "Other expenses", mr: "इतर खर्च" },
];

export function calc(i: CostInputs) {
  const totalCost = ROWS.reduce((a, r) => a + (Number(i[r.key]) || 0), 0);
  const revenue = (Number(i.units) || 0) * (Number(i.sellingPrice) || 0);
  const margin = revenue - totalCost;
  const costPerUnit = i.units > 0 ? totalCost / i.units : 0;
  const pct = revenue > 0 ? (margin / revenue) * 100 : 0;
  return { totalCost, revenue, margin, costPerUnit, pct };
}

export default function CostCalculator({ initial, product, guideId }: { initial: CostInputs; product: Text; guideId: string | null }) {
  const { l, tx, savePlan } = useStore();
  const [v, setV] = useState<CostInputs>(initial);
  const [name, setName] = useState<string | null>(null); // null = untouched, follow the selected language
  const [notes, setNotes] = useState("");
  const r = calc(v);
  const shownName = name ?? tx(product);
  const set = (k: keyof CostInputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setV({ ...v, [k]: e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)) });

  return (
    <Card>
      <p className="font-bold">{l("Cost calculator — one batch", "खर्च गणक — एक बॅच")}</p>
      <p className="text-sm text-muted">{l("Enter your own numbers. Sample values are only a starting point.", "तुमचे स्वतःचे आकडे टाका. दिलेले आकडे फक्त सुरुवातीसाठी आहेत.")}</p>
      <div className="mt-3 space-y-3">
        <Field label={l("Product name", "उत्पादनाचे नाव")}>
          <Input className={inputCls} value={shownName} onChange={(e) => setName(e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={l("Units made", "किती नग बनवले")}>
            <Input inputMode="numeric" className={inputCls} value={v.units || ""} onChange={set("units")} />
          </Field>
          <Field label={l("Selling price / unit (₹)", "प्रति नग विक्री किंमत (₹)")}>
            <Input inputMode="numeric" className={inputCls} value={v.sellingPrice || ""} onChange={set("sellingPrice")} />
          </Field>
        </div>
        {ROWS.map((row) => (
          <div key={row.key} className="flex items-center gap-3">
            <label htmlFor={row.key} className="flex-1 text-[15px]">
              {l(row.en, row.mr)}
            </label>
            <div className="relative w-32">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">₹</span>
              <Input id={row.key} inputMode="numeric" className={cx(inputCls, "pl-7 text-right")} value={v[row.key] || ""} onChange={set(row.key)} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-cream p-3">
          <p className="text-xs text-muted">{l("Total cost", "एकूण खर्च")}</p>
          <p className="text-lg font-bold">{rupees(r.totalCost)}</p>
        </div>
        <div className="rounded-xl bg-cream p-3">
          <p className="text-xs text-muted">{l("Cost per unit", "प्रति नग खर्च")}</p>
          <p className="text-lg font-bold">{rupees(r.costPerUnit)}</p>
        </div>
        <div className="rounded-xl bg-cream p-3">
          <p className="text-xs text-muted">{l("Sales if all sold", "सर्व विकल्यास विक्री")}</p>
          <p className="text-lg font-bold">{rupees(r.revenue)}</p>
        </div>
        <div className={cx("rounded-xl p-3", r.margin >= 0 ? "bg-leaf-100" : "bg-soil-100")}>
          <p className="text-xs text-muted">{l("Estimated gross margin", "अंदाजे नफा")}</p>
          <p className={cx("text-lg font-bold", r.margin >= 0 ? "text-leaf-900" : "text-soil")}>
            {rupees(r.margin)} <span className="text-sm">({r.pct.toFixed(0)}%)</span>
          </p>
        </div>
      </div>
      {r.margin < 0 && (
        <p className="mt-2 text-sm font-semibold text-soil">
          {l("At this price you would lose money. Try a higher price or lower costs.", "या किमतीत तोटा होईल. किंमत वाढवून किंवा खर्च कमी करून पाहा.")}
        </p>
      )}
      <p className="mt-2 text-xs text-muted">
        {l(
          "This is an estimate from your own assumptions, not a promise of profit. It excludes equipment cost, wastage and unsold stock.",
          "हा तुमच्या स्वतःच्या आकड्यांवर आधारित अंदाज आहे, नफ्याची हमी नाही. यात यंत्रसामग्री, घट व न विकलेला माल धरलेला नाही.",
        )}
      </p>

      <div className="mt-4">
        <Field label={l("Notes (optional)", "टिपा (ऐच्छिक)")}>
          <TextArea className={cx(inputCls, "min-h-20 py-2")} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
      </div>
      <Button
        full
        className="mt-3"
        onClick={() => savePlan({ guideId, product: name === null ? product : name || l("My product", "माझे उत्पादन"), inputs: v, notes })}
      >
        {l("Save as my business plan", "माझा व्यवसाय आराखडा म्हणून जतन करा")}
      </Button>
    </Card>
  );
}
