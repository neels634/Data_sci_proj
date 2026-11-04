"use client";

/**
 * My Farm costs: category icons, the estimate card (big number, bar by category, lines, yield and
 * break-even), and the line editor. Every figure is labelled an estimate with its source and year.
 */
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ChevronDown, CircleEllipsis, Cog, Droplets, FlaskConical, LandPlot, Leaf, Package, Pencil, Plus, SprayCan, Sprout, Tractor, Trash2, Truck, Users, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { AREA_NAME, CATEGORIES, categoryInfo, fromAcres, perAreaFromPerAcre, type AreaUnit, type CostCategory } from "@/lib/costs/categories";
import { estimate, type Estimate, type LineOverride } from "@/lib/costs/estimate";
import { templateById, templateFor, type CostLine, type CostTemplate } from "@/lib/costs/templates";
import { UNIT_NAME } from "@/lib/grades";
import { toAsciiDigits } from "@/lib/marathi-numbers";
import { LOCAL_RATES } from "@/lib/costs/local-rates";
import { Input } from "@/components/voice";
import type { CropInfo, FarmCrop } from "@/lib/types";
import { SpeakButton } from "@/components/speech";
import { cx } from "@/components/ui";

export const CAT_ICON: Record<CostCategory, ReactNode> = {
  land_prep: <Tractor size={20} />,
  seed: <Sprout size={20} />,
  manure: <Leaf size={20} />,
  fertiliser: <FlaskConical size={20} />,
  plant_protection: <SprayCan size={20} />,
  irrigation: <Droplets size={20} />,
  labour: <Users size={20} />,
  machinery: <Cog size={20} />,
  harvest_post: <Package size={20} />,
  transport_market: <Truck size={20} />,
  land_rent: <LandPlot size={20} />,
  other: <CircleEllipsis size={20} />,
};

export const card = "rounded-2xl border border-line bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]";
/** whole rupees, Devanagari digits in Marathi */
export const parseMoney = (s: string) => Number(toAsciiDigits(s).replace(/[^\d.]/g, "")) || 0;

export function useMoney() {
  const { num, l, tx, state } = useStore();
  const unit = state.myAreaUnit;
  return {
    unit,
    rs: (n: number) => `₹${num(Math.round(n))}`,
    /** an area in the farmer's unit, e.g. "१.५ एकर" */
    area: (acres: number, u: AreaUnit = unit) => `${num(Math.round(fromAcres(acres, u) * 100) / 100)} ${tx(AREA_NAME[u])}`,
    perArea: (perAcre: number, u: AreaUnit = unit) => `₹${num(Math.round(perAreaFromPerAcre(perAcre, u)))} / ${tx(AREA_NAME[u])}`,
    est: l("estimate", "अंदाजे"),
  };
}

/** the crop's saved template (stable), else today's template for it */
export function cropTemplate(fc: Pick<FarmCrop, "costTemplateId" | "cropId" | "season">, crop: Pick<CropInfo, "category">): CostTemplate {
  return (fc.costTemplateId && templateById(fc.costTemplateId)) || templateFor(fc.cropId, crop.category, fc.season);
}

export function useCropEstimate(fc: FarmCrop, crop: CropInfo): { template: CostTemplate; est: Estimate; changed: boolean } {
  const { state } = useStore();
  const template = cropTemplate(fc, crop);
  const latest = templateFor(fc.cropId, crop.category, fc.season);
  const est = estimate({ template, areaAcres: fc.areaAcres, rates: state.myLocalRates, overrides: fc.estimateOverrides, customLines: fc.customCostLines, yieldOverride: fc.expectedYieldOverride });
  return { template, est, changed: latest.id !== template.id };
}

/** "per acre | per hectare" */
export function AreaToggle() {
  const { state, l, setAreaUnit } = useStore();
  const u = state.myAreaUnit;
  return (
    <div className="inline-grid grid-cols-2 gap-1 rounded-xl bg-sand p-1" role="radiogroup" aria-label={l("Area unit", "क्षेत्राचे एकक")}>
      {(["acre", "hectare"] as const).map((x) => (
        <button key={x} type="button" role="radio" aria-checked={u === x} onClick={() => setAreaUnit(x)} className={cx("min-h-10 rounded-lg px-3 text-sm font-bold", u === x ? "bg-white text-leaf-900 shadow" : "text-muted")}>
          {x === "acre" ? l("per acre", "प्रति एकर") : l("per hectare", "प्रति हेक्टर")}
        </button>
      ))}
    </div>
  );
}

export function EstimateChips({ template }: { template: CostTemplate }) {
  const { l, num } = useStore();
  return (
    <div className="flex flex-wrap gap-1.5 text-xs font-bold">
      <span className="rounded-full bg-sand px-2 py-0.5 text-muted">{l("Estimate", "अंदाजे")}</span>
      {template.general && <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[#7a5108]">{l("General estimate", "सामान्य अंदाज")}</span>}
      {template.reviewStatus === "draft" && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-900">{l("Draft — not yet checked by KVK", "मसुदा — कृषी विज्ञान केंद्राने तपासायचा")}</span>}
      <span className="rounded-full bg-sand px-2 py-0.5 text-muted" title={template.source}>
        {l("Source", "स्रोत")}: {l("draft figures", "मसुदा आकडे")} · {num(template.year, { useGrouping: false })}
      </span>
    </div>
  );
}

/** one bar split by category */
export function StackedBar({ parts, total }: { parts: { category: CostCategory; amount: number }[]; total: number }) {
  return (
    <div className="flex h-4 w-full overflow-hidden rounded-full bg-sand" aria-hidden="true">
      {parts
        .filter((p) => p.amount > 0)
        .map((p) => (
          <span key={p.category} style={{ width: `${(p.amount / Math.max(1, total)) * 100}%`, background: categoryInfo(p.category).color }} />
        ))}
    </div>
  );
}

/** categories with amount and %, tap to see each line (qty × rate = amount) */
export function CategoryBreakdown({ est }: { est: Estimate }) {
  const { tx, num, l } = useStore();
  const m = useMoney();
  const [open, setOpen] = useState<CostCategory | null>(null);
  const rows = CATEGORIES.map((c) => ({ c, amount: est.byCategory[c.code] ?? 0 }))
    .filter((r) => r.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  return (
    <ul className="divide-y divide-line">
      {rows.map(({ c, amount }) => (
        <li key={c.code}>
          <button type="button" onClick={() => setOpen(open === c.code ? null : c.code)} aria-expanded={open === c.code} className="flex min-h-12 w-full items-center gap-3 py-2 text-left">
            <span className="grid size-9 shrink-0 place-items-center rounded-full text-white" style={{ background: c.color }}>
              {CAT_ICON[c.code]}
            </span>
            <span className="min-w-0 flex-1 font-semibold">{tx(c.name)}</span>
            <span className="text-right font-bold">
              {m.rs(amount)} <span className="text-xs font-semibold text-muted">{num(Math.round((amount / Math.max(1, est.total)) * 100))}%</span>
            </span>
            <ChevronDown size={16} className={cx("shrink-0 text-muted transition-transform", open === c.code && "rotate-180")} />
          </button>
          {open === c.code && (
            <ul className="mm-step mb-2 space-y-1 rounded-xl bg-cream p-2 text-sm">
              {est.lines
                .filter((x) => x.line.category === c.code && x.cash)
                .map((x) => (
                  <li key={x.line.id} className="flex justify-between gap-2">
                    <span>
                      {tx(x.line.item)}
                      {x.qtyPerAcre != null && x.rate != null && x.line.unit && (
                        <span className="text-muted">
                          {" "}
                          · {num(x.qtyPerAcre)} {tx(x.line.unit)}/{l("acre", "एकर")} × ₹{num(x.rate)}
                        </span>
                      )}
                      {x.line.oneTime && <span className="text-muted"> · {l("once", "एकदाच")}</span>}
                    </span>
                    <span className="shrink-0 font-semibold">{m.rs(x.total)}</span>
                  </li>
                ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

/** the estimate for a crop's area: big number, per area, bar, categories, yield and break-even */
export function EstimateCard({ est, template, areaAcres, cropName, perennial, children }: { est: Estimate; template: CostTemplate; areaAcres: number; cropName: string; perennial?: boolean; children?: ReactNode }) {
  const { l, tx, num } = useStore();
  const m = useMoney();
  const parts = CATEGORIES.map((c) => ({ category: c.code, amount: est.byCategory[c.code] ?? 0 }));
  const top = [...parts].sort((a, b) => b.amount - a.amount)[0];
  const yu = tx(UNIT_NAME[template.yieldUnit]);
  const main = perennial ? est.recurringTotal : est.total;
  const speech = l(
    `For ${m.area(areaAcres)} of ${cropName}, the estimated cost is ${Math.round(main)} rupees. The biggest cost is ${tx(categoryInfo(top.category).name)}.${est.breakEven ? ` You need at least ${est.breakEven[1]} rupees per ${yu} to cover costs.` : ""}`,
    `${m.area(areaAcres)} ${cropName}साठी अंदाजे ${Math.round(main)} रुपये खर्च येईल. सर्वात जास्त खर्च ${tx(categoryInfo(top.category).name)} वर.${est.breakEven ? ` किमान ${est.breakEven[1]} रुपये प्रति ${yu} मिळाल्यास खर्च निघेल.` : ""}`,
  );
  return (
    <div className={cx(card, "space-y-3 p-4")}>
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-muted">
            {perennial ? l(`Yearly cost for your ${m.area(areaAcres)}`, `तुमच्या ${m.area(areaAcres)}साठी वार्षिक खर्च`) : l(`Estimated cost for your ${m.area(areaAcres)}`, `तुमच्या ${m.area(areaAcres)}साठी अंदाजे खर्च`)}
          </p>
          <p className="text-4xl font-bold text-leaf-900">{m.rs(main)}</p>
          <p className="font-semibold">{m.perArea(perennial ? est.recurringTotal / Math.max(areaAcres, 0.01) : est.perAcre)}</p>
        </div>
        <SpeakButton id={`estimate-${cropName}`} text={speech} />
      </div>
      <AreaToggle />
      {perennial && est.oneTimeTotal > 0 && (
        <p className="rounded-xl bg-sand p-2 text-sm font-semibold">
          {l("Orchard set-up (once)", "बाग उभारणी खर्च (एकदाच)")}: {m.rs(est.oneTimeTotal)}
        </p>
      )}
      <StackedBar parts={perennial ? CATEGORIES.map((c) => ({ category: c.code, amount: est.lines.filter((x) => x.cash && !x.line.oneTime && x.line.category === c.code).reduce((a, x) => a + x.total, 0) })) : parts} total={main} />
      <CategoryBreakdown est={est} />
      <div className="rounded-xl bg-leaf-50 p-3">
        <p className="font-semibold">
          {l("Expected yield", "अपेक्षित उत्पादन")}: {num(est.yieldRange[0])}–{num(est.yieldRange[1])} {yu}
        </p>
        {est.breakEven && (
          <p className="mt-1 text-[16px] font-bold text-leaf-900">
            {l(`You need at least ₹${num(est.breakEven[1])} per ${yu} to cover costs`, `किमान ₹${num(est.breakEven[1])} प्रति ${yu} मिळाल्यास खर्च निघेल`)}
          </p>
        )}
        {est.breakEven && est.breakEven[0] !== est.breakEven[1] && (
          <p className="text-sm text-muted">{l(`(₹${num(est.breakEven[0])} if the yield is good)`, `(उत्पादन चांगले आल्यास ₹${num(est.breakEven[0])})`)}</p>
        )}
      </div>
      <EstimateChips template={template} />
      {children}
    </div>
  );
}

/** change a line's qty / rate / amount, remove it, or add your own line */
export function EstimateEditor({
  template,
  areaAcres,
  overrides,
  customLines,
  onChange,
  onClose,
}: {
  template: CostTemplate;
  areaAcres: number;
  overrides: Record<string, LineOverride>;
  customLines: CostLine[];
  onChange: (o: Record<string, LineOverride>, c: CostLine[]) => void;
  onClose: () => void;
}) {
  const { state, l, tx, num } = useStore();
  const m = useMoney();
  const est = estimate({ template, areaAcres, rates: state.myLocalRates, overrides, customLines });
  const [cat, setCat] = useState<CostCategory>("other");
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const set = (id: string, patch: LineOverride) => onChange({ ...overrides, [id]: { ...overrides[id], ...patch } }, customLines);
  const removed = template.lines.filter((x) => overrides[x.id]?.removed);
  const input = "h-11 w-20 rounded-lg border border-line bg-white px-2 text-center font-bold";
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={l("Change the estimate", "अंदाज बदला")} className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-cream p-4 pb-8" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-bold">{l("Change the estimate", "अंदाज बदला")}</h2>
          <button onClick={onClose} className="grid size-12 place-items-center rounded-full" aria-label={l("Close", "बंद करा")}>
            <X size={22} />
          </button>
        </div>
        <p className="mb-3 text-sm text-muted">{l("Per acre. Changes apply to this crop only.", "प्रति एकर. बदल फक्त या पिकासाठी.")}</p>
        <ul className="space-y-2">
          {est.lines.map((x) => (
            <li key={x.line.id} className={cx(card, "p-3")}>
              <div className="flex items-center gap-2">
                <span className="grid size-8 shrink-0 place-items-center rounded-full text-white" style={{ background: categoryInfo(x.line.category).color }}>
                  {CAT_ICON[x.line.category]}
                </span>
                <span className="min-w-0 flex-1 font-semibold">{tx(x.line.item)}</span>
                <button
                  type="button"
                  aria-label={l("Remove", "काढा")}
                  onClick={() => (x.custom ? onChange(overrides, customLines.filter((c) => c.id !== x.line.id)) : set(x.line.id, { removed: true }))}
                  className="grid size-10 place-items-center rounded-full text-soil"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                {x.line.driver === "qty" && overrides[x.line.id]?.amount == null ? (
                  <>
                    <input aria-label={l("Quantity", "प्रमाण")} inputMode="decimal" className={input} defaultValue={num(x.qtyPerAcre ?? 0, { useGrouping: false })} onBlur={(e) => set(x.line.id, { qtyPerAcre: Number(toAsciiDigits(e.target.value)) || 0 })} />
                    <span>{x.line.unit ? tx(x.line.unit) : ""} ×</span>
                    <span>₹</span>
                    <input aria-label={l("Rate", "दर")} inputMode="decimal" className={input} defaultValue={num(x.rate ?? 0, { useGrouping: false })} onBlur={(e) => set(x.line.id, { rate: Number(toAsciiDigits(e.target.value)) || 0 })} />
                  </>
                ) : (
                  <>
                    <span>₹</span>
                    <input
                      aria-label={l("Amount per acre", "प्रति एकर रक्कम")}
                      inputMode="numeric"
                      className={cx(input, "w-28")}
                      defaultValue={num(x.perAcre, { useGrouping: false })}
                      onBlur={(e) => (x.custom ? onChange(overrides, customLines.map((c) => (c.id === x.line.id ? { ...c, amountPerAcre: parseMoney(e.target.value) } : c))) : set(x.line.id, { amount: parseMoney(e.target.value) }))}
                    />
                    <span>/ {l("acre", "एकर")}</span>
                  </>
                )}
                <span className="ml-auto font-bold">{m.rs(x.total)}</span>
              </div>
            </li>
          ))}
        </ul>
        {removed.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {removed.map((x) => (
              <button key={x.id} type="button" onClick={() => set(x.id, { removed: false })} className="min-h-10 rounded-full border border-line bg-white px-3 text-sm font-semibold">
                + {tx(x.item)}
              </button>
            ))}
          </div>
        )}
        <div className={cx(card, "mt-4 space-y-2 p-3")}>
          <p className="font-bold">{l("Add my own line", "माझी ओळ जोडा")}</p>
          <select value={cat} onChange={(e) => setCat(e.target.value as CostCategory)} className="min-h-11 w-full rounded-lg border border-line bg-white px-2" aria-label={l("Category", "प्रकार")}>
            {CATEGORIES.map((c) => (
              <option key={c.code} value={c.code}>
                {tx(c.name)}
              </option>
            ))}
          </select>
          <input value={item} onChange={(e) => setItem(e.target.value)} placeholder={l("What is it?", "काय आहे?")} className="min-h-11 w-full rounded-lg border border-line bg-white px-3" maxLength={60} />
          <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" placeholder={l("₹ per acre", "₹ प्रति एकर")} className="min-h-11 w-full rounded-lg border border-line bg-white px-3" />
          <button
            type="button"
            disabled={!item.trim() || !parseMoney(amount)}
            onClick={() => {
              onChange(overrides, [...customLines, { id: `custom-${Date.now().toString(36)}`, category: cat, item: { en: item.trim(), mr: item.trim() }, driver: "fixed", amountPerAcre: parseMoney(amount) }]);
              setItem("");
              setAmount("");
            }}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-leaf-700 font-bold text-white disabled:opacity-40"
          >
            <Plus size={18} /> {l("Add", "जोडा")}
          </button>
        </div>
        <button type="button" onClick={onClose} className="mt-4 min-h-14 w-full rounded-2xl bg-leaf-700 text-lg font-bold text-white">
          {l("Done", "झाले")}
        </button>
      </div>
    </div>
  );
}

/** the two buttons under an estimate: my local rates · change the estimate */
export function EstimateActions({ onEdit, onRates }: { onEdit: () => void; onRates?: () => void }) {
  const { l } = useStore();
  const cls = "flex min-h-12 items-center justify-center rounded-xl border border-leaf-700/40 bg-white px-2 text-center text-sm font-bold text-leaf-700";
  return (
    <div className="grid grid-cols-2 gap-2">
      {onRates ? (
        <button type="button" onClick={onRates} className={cls}>
          {l("Enter my local rates", "माझे स्थानिक दर टाका")}
        </button>
      ) : (
        <Link href="/crops/rates" className={cls}>
          {l("Enter my local rates", "माझे स्थानिक दर टाका")}
        </Link>
      )}
      <button type="button" onClick={onEdit} className="flex min-h-12 items-center justify-center gap-1 rounded-xl border border-leaf-700/40 bg-white px-2 text-sm font-bold text-leaf-700">
        <Pencil size={16} /> {l("Change the estimate", "अंदाज बदला")}
      </button>
    </div>
  );
}

/** my village's rates; every estimate uses them at once */
export function LocalRatesEditor() {
  const { state, l, tx, num, setLocalRates } = useStore();
  const rates = state.myLocalRates;
  return (
    <ul className="space-y-2">
      {LOCAL_RATES.map((r) => (
        <li key={r.key} className={cx(card, "flex items-center gap-3 p-3")}>
          <span className="min-w-0 flex-1 font-semibold leading-snug">{tx(r.name)}</span>
          <span className="font-bold text-muted">₹</span>
          <Input
            aria-label={tx(r.name)}
            inputMode="numeric"
            className="h-12 w-24 rounded-xl border border-line bg-white px-2 text-center text-lg font-bold"
            placeholder={num(r.default, { useGrouping: false })}
            value={rates[r.key] != null ? num(rates[r.key]!, { useGrouping: false }) : ""}
            onChange={(e) => {
              const v = parseMoney(e.target.value);
              const next = { ...rates };
              if (v > 0) next[r.key] = v;
              else delete next[r.key];
              setLocalRates(next);
            }}
          />
        </li>
      ))}
      <li className="text-sm text-muted">{l("Grey numbers are draft defaults — type your village's rate.", "राखाडी आकडे मसुदा दर आहेत — तुमच्या गावचा दर टाका.")}</li>
    </ul>
  );
}

export function LocalRatesSheet({ onClose }: { onClose: () => void }) {
  const { l } = useStore();
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={l("My local rates", "माझे स्थानिक दर")} className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-cream p-4 pb-8" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">{l("My local rates", "माझे स्थानिक दर")}</h2>
          <button onClick={onClose} className="grid size-12 place-items-center rounded-full" aria-label={l("Close", "बंद करा")}>
            <X size={22} />
          </button>
        </div>
        <LocalRatesEditor />
        <button type="button" onClick={onClose} className="mt-4 min-h-14 w-full rounded-2xl bg-leaf-700 text-lg font-bold text-white">
          {l("Done", "झाले")}
        </button>
      </div>
    </div>
  );
}
