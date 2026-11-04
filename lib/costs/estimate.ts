/**
 * Cost estimate engine (pure). Every result is an estimate and the screens say so.
 *
 *   line = fixed ₹ per acre, or qty per acre × (farmer's local rate ?? default rate)
 *   estimate for the crop = Σ lines × area (cash and own-work separately)
 *   break-even price = cash cost ÷ expected yield
 *
 *   npm run check:costs
 */
import type { CostCategory } from "./categories.ts";
import { rateOf, type LocalRates } from "./local-rates.ts";
import type { CostLine, CostTemplate } from "./templates.ts";

export interface LineOverride {
  qtyPerAcre?: number;
  rate?: number;
  amount?: number;
  removed?: boolean;
}

export interface EstimateLine {
  line: CostLine;
  qtyPerAcre?: number;
  rate?: number;
  perAcre: number;
  total: number;
  cash: boolean;
  custom: boolean;
}

export interface Estimate {
  lines: EstimateLine[];
  /** cash cost */
  perAcre: number;
  total: number;
  /** value of own work (not paid in cash) */
  ownTotal: number;
  byCategory: Partial<Record<CostCategory, number>>;
  byStage: Record<string, number>;
  /** perennial establishment (once) vs every cycle */
  oneTimeTotal: number;
  recurringTotal: number;
  /** for the whole area */
  yieldRange: [number, number];
  /** ₹ per yield unit needed to cover the recurring cash cost: [with the best yield, with the lowest] */
  breakEven: [number, number] | null;
}

export interface EstimateInput {
  template: CostTemplate;
  areaAcres: number;
  rates: LocalRates;
  overrides?: Record<string, LineOverride>;
  customLines?: CostLine[];
  /** per acre */
  yieldOverride?: number;
}

/** one line's ₹ per acre with the farmer's rates and edits */
export function linePerAcre(line: CostLine, rates: LocalRates, o: LineOverride = {}): { perAcre: number; qtyPerAcre?: number; rate?: number } {
  if (o.amount != null) return { perAcre: o.amount };
  if (line.driver === "fixed") return { perAcre: line.amountPerAcre ?? 0 };
  const qty = o.qtyPerAcre ?? line.qtyPerAcre ?? 0;
  const rate = o.rate ?? (line.rateKey ? rateOf(rates, line.rateKey) : (line.defaultRate ?? 0));
  return { perAcre: qty * rate, qtyPerAcre: qty, rate };
}

export function estimate(input: EstimateInput): Estimate {
  const area = Math.max(0, input.areaAcres);
  const all = [...input.template.lines.map((l) => ({ l, custom: false })), ...(input.customLines ?? []).map((l) => ({ l, custom: true }))];
  const lines: EstimateLine[] = all
    .filter(({ l }) => !input.overrides?.[l.id]?.removed)
    .map(({ l, custom }) => {
      const v = linePerAcre(l, input.rates, input.overrides?.[l.id]);
      return { line: l, ...v, total: Math.round(v.perAcre * area), perAcre: Math.round(v.perAcre), cash: l.cashPaid !== false, custom };
    });
  const cash = lines.filter((x) => x.cash);
  const sum = (xs: EstimateLine[]) => xs.reduce((a, x) => a + x.total, 0);
  const byCategory: Estimate["byCategory"] = {};
  const byStage: Record<string, number> = {};
  for (const x of cash) {
    byCategory[x.line.category] = (byCategory[x.line.category] ?? 0) + x.total;
    const k = x.line.stageKey ?? "";
    byStage[k] = (byStage[k] ?? 0) + x.total;
  }
  const oneTimeTotal = sum(cash.filter((x) => x.line.oneTime));
  const recurringTotal = sum(cash.filter((x) => !x.line.oneTime));
  const [ymin, ymax] = input.yieldOverride != null ? [input.yieldOverride, input.yieldOverride] : input.template.expectedYieldPerAcre;
  const yieldRange: [number, number] = [Math.round(ymin * area * 10) / 10, Math.round(ymax * area * 10) / 10];
  return {
    lines,
    perAcre: Math.round(cash.reduce((a, x) => a + x.perAcre, 0)),
    total: sum(cash),
    ownTotal: sum(lines.filter((x) => !x.cash)),
    byCategory,
    byStage,
    oneTimeTotal,
    recurringTotal,
    yieldRange,
    breakEven: yieldRange[1] > 0 && yieldRange[0] > 0 ? [Math.round(recurringTotal / yieldRange[1]), Math.round(recurringTotal / yieldRange[0])] : null,
  };
}

/** where a stage sits in the crop's order; lines with no stage happen first */
const indexOf = (order: string[], key?: string) => (key ? Math.max(0, order.indexOf(key)) : 0);

/**
 * Estimated cost still to come: lines of the current and later stages, minus what is already
 * recorded against them. `current` = the crop's current stage key (null before sowing).
 */
export function remainingCost(est: Estimate, order: string[], current: string | null, spentByLine: Record<string, number>, opts: { done?: boolean; recurringOnly?: boolean } = {}) {
  if (opts.done) return 0;
  const now = current ? indexOf(order, current) : -1;
  return est.lines
    .filter((x) => x.cash && (!opts.recurringOnly || !x.line.oneTime) && (current === null || indexOf(order, x.line.stageKey) >= now))
    .reduce((a, x) => a + Math.max(0, x.total - (spentByLine[x.line.id] ?? 0)), 0);
}

/** what the estimate expects to be spent by the end of the current stage */
export function expectedByNow(est: Estimate, order: string[], current: string | null, opts: { recurringOnly?: boolean } = {}) {
  if (current === null) return 0;
  const now = indexOf(order, current);
  return est.lines.filter((x) => x.cash && (!opts.recurringOnly || !x.line.oneTime) && indexOf(order, x.line.stageKey) <= now).reduce((a, x) => a + x.total, 0);
}

export type SpendStatus = "ok" | "ahead" | "over";
/** green within plan, amber > 10% above what's expected by now, red above the whole estimate */
export function spendStatus(spent: number, total: number, byNow: number): SpendStatus {
  if (total > 0 && spent > total) return "over";
  if (byNow > 0 && spent > byNow * 1.1) return "ahead";
  return "ok";
}

export interface Profit {
  income: number;
  cash: number;
  own: number;
  net: number;
  netWithOwn: number;
  /** ₹ cash cost per unit sold; null when nothing is sold */
  costPerUnit: number | null;
}
export function profit(income: number, cash: number, own: number, qtySold: number): Profit {
  return { income, cash, own, net: income - cash, netWithOwn: income - cash - own, costPerUnit: qtySold > 0 ? Math.round(cash / qtySold) : null };
}

/** years to earn back the establishment cost from the average cycle profit (one cycle a year) */
export function recoveryYears(establishment: number, avgCycleProfit: number): number | null {
  if (establishment <= 0) return 0;
  if (avgCycleProfit <= 0) return null;
  return Math.round((establishment / avgCycleProfit) * 10) / 10;
}

/** share a general expense across crops by area */
export function splitByArea(amount: number, crops: { id: string; areaAcres: number }[]): Record<string, number> {
  const total = crops.reduce((a, c) => a + c.areaAcres, 0);
  if (!total) return {};
  const out: Record<string, number> = {};
  let given = 0;
  crops.forEach((c, i) => {
    const share = i === crops.length - 1 ? amount - given : Math.round((amount * c.areaAcres) / total);
    out[c.id] = share;
    given += share;
  });
  return out;
}
