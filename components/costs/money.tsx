"use client";

/**
 * A crop's money: spent vs estimate, what is still to come, the expense list and quick add sheet,
 * sales and profit, the price needed to cover costs, and an orchard's set-up cost recovery.
 * Everything stays on this phone.
 */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Camera, Check, ChevronDown, Pencil, Plus, Receipt, Trash2, TrendingDown, TrendingUp, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { CATEGORIES, categoryInfo, type CostCategory } from "@/lib/costs/categories";
import { expectedByNow, profit, recoveryYears, remainingCost, spendStatus } from "@/lib/costs/estimate";
import { rateOf } from "@/lib/costs/local-rates";
import { compressBill, loadBill, saveBill } from "@/lib/costs/bill-photos";
import { convert, gradingFor, UNIT_NAME, type Unit } from "@/lib/grades";
import { addDays, currentStage, daysBetween, planOf, todayISO } from "@/lib/lifecycle";
import { usePrices } from "@/lib/mandi/use-prices";
import { marketById } from "@/lib/mandi/markets";
import { distanceTo, useFarmPlace } from "@/components/mandi/rates";
import type { CropInfo, Expense, FarmCrop, Sale } from "@/lib/types";
import { SpeakButton } from "@/components/speech";
import { Input } from "@/components/voice";
import { cx } from "@/components/ui";
import { CAT_ICON, EstimateActions, EstimateCard, EstimateEditor, card, cropTemplate, parseMoney, useCropEstimate, useMoney } from "./index";

// ---- the numbers for one crop -----------------------------------------------------------------

export function useCropMoney(fc: FarmCrop, crop: CropInfo) {
  const { state } = useStore();
  const today = todayISO();
  const { template, est, changed } = useCropEstimate(fc, crop);
  const perennial = crop.lifecycle === "perennial";
  const oneTimeIds = new Set(est.lines.filter((x) => x.line.oneTime).map((x) => x.line.id));
  const all = state.myExpenses.filter((e) => e.farmCropId === fc.id);
  const sales = state.mySales.filter((x) => x.farmCropId === fc.id);
  const isSetUp = (e: Expense) => perennial && !!e.templateLineId && oneTimeIds.has(e.templateLineId);
  const cycleFrom = perennial ? (fc.cycleStart ?? null) : null;
  // perennials: this cycle's costs are compared with the yearly estimate; set-up costs are kept apart
  const current = perennial ? all.filter((e) => !isSetUp(e) && (!cycleFrom || e.date >= cycleFrom)) : all;
  const setUp = all.filter(isSetUp);
  const earlier = perennial && cycleFrom ? all.filter((e) => !isSetUp(e) && e.date < cycleFrom) : [];
  const currentSales = perennial && cycleFrom ? sales.filter((x) => x.date >= cycleFrom) : sales;
  const earlierSales = perennial && cycleFrom ? sales.filter((x) => x.date < cycleFrom) : [];

  const cash = current.filter((e) => e.cashPaid).reduce((a, e) => a + e.amount, 0);
  const own = current.filter((e) => !e.cashPaid).reduce((a, e) => a + e.amount, 0);
  const spentByLine: Record<string, number> = {};
  const spentByCat: Partial<Record<CostCategory, number>> = {};
  for (const e of current.filter((x) => x.cashPaid)) {
    if (e.templateLineId) spentByLine[e.templateLineId] = (spentByLine[e.templateLineId] ?? 0) + e.amount;
    spentByCat[e.category] = (spentByCat[e.category] ?? 0) + e.amount;
  }
  const plan = planOf(fc, crop, today);
  const order = plan.stages.map((s) => s.key);
  const now = currentStage(fc, crop, today);
  const stageKey = now ? now.stage.key : null;
  const done = fc.status === "harvested" || (now?.pastLastStage ?? false) || (perennial && !!fc.harvestedOn && !fc.cycleStart);
  const target = perennial ? est.recurringTotal : est.total;
  const remaining = remainingCost(est, order, stageKey, spentByLine, { done, recurringOnly: perennial });
  const byNow = expectedByNow(est, order, stageKey, { recurringOnly: perennial });
  const status = spendStatus(cash, target, byNow);
  /** expense date → stage key */
  const stageOf = (date: string) => {
    if (!plan.anchor) return "";
    const d = daysBetween(plan.anchor, date);
    return plan.stages.find((s) => d >= s.startDay && d < s.endDay)?.key ?? (d < 0 ? plan.stages[0]?.key : plan.stages.at(-1)?.key) ?? "";
  };
  const yu = template.yieldUnit;
  const soldQty = currentSales.reduce((a, s) => a + convert(s.qty, s.unit, yu), 0);
  const income = currentSales.reduce((a, s) => a + s.amount, 0);
  const pr = profit(income, cash, own, soldQty);
  // orchard: cost recovery from earlier cycles' profit (about one bahar a year)
  const setUpSpent = setUp.reduce((a, e) => a + e.amount, 0);
  const earlierCycles = new Set(earlierSales.map((x) => x.date.slice(0, 4))).size;
  const earlierProfit = earlierSales.reduce((a, s) => a + s.amount, 0) - earlier.filter((e) => e.cashPaid).reduce((a, e) => a + e.amount, 0);
  // what is still to earn back after earlier cycles' profit, at the average cycle profit
  const setUpCost = setUpSpent || est.oneTimeTotal;
  const recovered = perennial && earlierCycles > 0 && earlierProfit >= setUpCost;
  const recovery = perennial && earlierCycles > 0 && !recovered ? recoveryYears(setUpCost - earlierProfit, earlierProfit / earlierCycles) : null;
  return { template, est, changed, perennial, all, current, sales: currentSales, allSales: sales, cash, own, spentByCat, order, plan, now, stageKey, done, target, remaining, byNow, status, stageOf, yu, soldQty, income, pr, setUpSpent, earlierCycles, earlierProfit, recovery, recovered, today };
}

// ---- small pieces -----------------------------------------------------------------------------

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <span className="block h-2.5 w-full overflow-hidden rounded-full bg-sand" aria-hidden="true">
      <span className="block h-full rounded-full" style={{ width: `${Math.min(100, (value / Math.max(1, max)) * 100)}%`, background: color }} />
    </span>
  );
}

/** a bill photo from this phone (the demo one is a placeholder) */
export function BillThumb({ id, big }: { id: string; big?: boolean }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    if (id.startsWith("demo")) return;
    loadBill(id)
      .then((s) => setSrc(s ?? null))
      .catch(() => setSrc(null));
  }, [id]);
  const size = big ? "h-48 w-full" : "size-10";
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element -- local data URL from IndexedDB
    <img src={src} alt="" className={cx(size, "rounded-lg object-cover")} />
  ) : (
    <span className={cx(size, "grid place-items-center rounded-lg bg-sand text-muted")} aria-hidden="true">
      <Receipt size={big ? 40 : 18} />
    </span>
  );
}

// ---- the crop's money tab ---------------------------------------------------------------------

export function CropMoney({ fc, crop }: { fc: FarmCrop; crop: CropInfo }) {
  const { state, l, tx, num, date, deleteExpense, deleteSale } = useStore();
  const m = useMoney();
  const c = useCropMoney(fc, crop);
  const [adding, setAdding] = useState<null | { expense?: Expense; category?: CostCategory }>(null);
  const [selling, setSelling] = useState(false);
  const [view, setView] = useState<"category" | "stage">("category");
  const [filter, setFilter] = useState<{ cat?: CostCategory; cash?: boolean; from?: string }>({});
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [showEstimate, setShowEstimate] = useState(false);
  const { updateFarmCrop } = useStore();
  const cropName = tx(crop.name);
  const pct = c.target > 0 ? Math.round((c.cash / c.target) * 100) : 0;
  const tone = { ok: "#2b6a4f", ahead: "#c08a1e", over: "#b5532e" }[c.status];
  const yu = tx(UNIT_NAME[c.yu]);

  const summary = l(
    `Spent so far on ${cropName}: ${c.cash} rupees, ${pct} percent of the estimate of ${c.target}. About ${c.remaining} rupees more to come.`,
    `${cropName}वर आत्तापर्यंत ${c.cash} रुपये खर्च झाले, अंदाजाच्या ${pct} टक्के. पुढील अंदाजे खर्च ${c.remaining} रुपये.`,
  );

  // one nudge at most
  const recentDone = state.myTaskStates.some((t) => t.farmCropId === fc.id && t.status === "done" && t.at >= addDays(c.today, -10));
  const lastExpense = c.all.map((e) => e.date).sort().at(-1);
  const nudge: ReactNode =
    (c.done || fc.harvestedOn) && c.sales.length === 0 ? (
      <Nudge text={l("Record your sale to see your profit", "विक्री नोंदवा म्हणजे नफा कळेल")} action={l("Record sale", "विक्री नोंदवा")} onClick={() => setSelling(true)} />
    ) : recentDone && (!lastExpense || lastExpense < addDays(c.today, -10)) ? (
      <Nudge text={l("Did you record the cost of recent work?", "अलीकडच्या कामांचा खर्च नोंदवला का?")} action={l("+ Expense", "+ खर्च")} onClick={() => setAdding({})} />
    ) : null;

  const listed = c.all
    .filter((e) => (!filter.cat || e.category === filter.cat) && (filter.cash === undefined || e.cashPaid === filter.cash) && (!filter.from || e.date >= filter.from))
    .sort((a, b) => b.date.localeCompare(a.date));
  const months = Array.from(new Set(listed.map((e) => e.date.slice(0, 7))));
  const monthName = (ym: string) => new Date(`${ym}-01T00:00:00`).toLocaleDateString(state.lang === "mr" ? "mr-IN-u-nu-deva" : "en-IN", { month: "long", year: "numeric" });

  return (
    <div className="space-y-4 pb-20">
      {nudge}

      {/* summary */}
      <section className={cx(card, "space-y-2 p-4")}>
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-muted">{c.perennial ? l("Spent this cycle (cash)", "या बहारात खिशातून खर्च") : l("Spent so far (cash)", "आत्तापर्यंत खर्च (खिशातून)")}</p>
            <p className="text-4xl font-bold text-ink">{m.rs(c.cash)}</p>
          </div>
          <SpeakButton id={`money-${fc.id}`} text={summary} />
        </div>
        <Bar value={c.cash} max={c.target} color={tone} />
        <p className="text-[15px] font-semibold" style={{ color: tone }}>
          {c.status === "over" ? "▲ " : c.status === "ahead" ? "● " : "✓ "}
          {l(`${pct}% of the ${m.rs(c.target)} estimate`, `अंदाज ${m.rs(c.target)} पैकी ${num(pct)}%`)}
          {c.status === "over" && ` · ${l("above the estimate", "अंदाजापेक्षा जास्त")}`}
          {c.status === "ahead" && ` · ${l("ahead of plan for this stage", "या टप्प्यासाठी अपेक्षेपेक्षा जास्त")}`}
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p className="rounded-xl bg-sand p-2">
            {l("Still to come (estimate)", "पुढील अंदाजे खर्च")}
            <b className="block text-base">{m.rs(c.remaining)}</b>
          </p>
          <p className="rounded-xl bg-sand p-2">
            {l("Per", "प्रति")} {l(m.unit === "hectare" ? "hectare" : "acre", m.unit === "hectare" ? "हेक्टर" : "एकर")}
            <b className="block text-base">{m.perArea(c.cash / Math.max(fc.areaAcres, 0.01)).split(" / ")[0]}</b>
          </p>
        </div>
        <p className="text-sm text-muted">
          {l("Value of own work (not paid)", "घरच्या कामाची किंमत (पैसे दिले नाहीत)")}: <b>{m.rs(c.own)}</b>
        </p>
        {fc.budget ? (
          <p className="text-sm">
            {l("My budget", "माझे बजेट")}: <b>{m.rs(fc.budget)}</b> · {fc.budget - c.cash >= 0 ? l(`${m.rs(fc.budget - c.cash)} left`, `${m.rs(fc.budget - c.cash)} शिल्लक`) : l(`${m.rs(c.cash - fc.budget)} over`, `${m.rs(c.cash - fc.budget)} जास्त`)}
          </p>
        ) : null}
      </section>

      {/* profit or the price needed */}
      {c.sales.length > 0 ? <ProfitCard c={c} fc={fc} cropName={cropName} /> : <PriceNeeded c={c} crop={crop} />}
      <button type="button" onClick={() => setSelling(true)} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-leaf-700/40 bg-white font-bold text-leaf-700">
        <TrendingUp size={18} /> {l("Record sale", "विक्री नोंदवा")}
      </button>

      {/* orchard set-up */}
      {c.perennial && (
        <section className={cx(card, "space-y-1 p-4")}>
          <p className="font-bold">{l("Orchard set-up cost", "बाग उभारणी खर्च")}</p>
          <p className="text-2xl font-bold">{m.rs(c.setUpSpent)}</p>
          <p className="text-sm text-muted">
            {l("Estimate", "अंदाज")}: {m.rs(c.est.oneTimeTotal)}
          </p>
          {c.recovered ? (
            <p className="font-semibold text-leaf-900">✓ {l("Set-up cost earned back from earlier cycles", "मागील बहारांतून बाग उभारणी खर्च वसूल झाला")}</p>
          ) : c.recovery != null ? (
            <p className="font-semibold text-leaf-900">
              {l(`About ${c.recovery} more years to earn back the set-up cost (estimate)`, `बाग उभारणी खर्च वसूल होण्यास अंदाजे आणखी ${num(c.recovery)} वर्षे`)}
            </p>
          ) : (
            <p className="text-sm text-muted">{l("Record a cycle's sales to see how long recovery takes.", "बहाराची विक्री नोंदवल्यावर खर्च वसुलीचा अंदाज दिसेल.")}</p>
          )}
          {c.earlierCycles > 0 && (
            <p className="text-sm">
              {l("Earlier cycles' profit", "मागील बहारांचा नफा")}: <b>{m.rs(c.earlierProfit)}</b>
            </p>
          )}
        </section>
      )}

      {/* breakdown */}
      <section className={cx(card, "p-4")}>
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-lg font-bold">{l("Where the money went", "खर्च कुठे झाला")}</h3>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-sand p-1" role="radiogroup">
            {(["category", "stage"] as const).map((v) => (
              <button key={v} type="button" role="radio" aria-checked={view === v} onClick={() => setView(v)} className={cx("min-h-9 rounded-lg px-2 text-sm font-bold", view === v ? "bg-white shadow" : "text-muted")}>
                {v === "category" ? l("Type", "प्रकार") : l("Stage", "टप्पा")}
              </button>
            ))}
          </div>
        </div>
        {view === "category" ? (
          <ul className="space-y-2.5">
            {CATEGORIES.map((x) => ({ x, spent: c.spentByCat[x.code] ?? 0, planned: c.est.lines.filter((ln) => ln.cash && ln.line.category === x.code && (!c.perennial || !ln.line.oneTime)).reduce((a, ln) => a + ln.total, 0) }))
              .filter((r) => r.spent > 0 || r.planned > 0)
              .map(({ x, spent, planned }) => {
              const diff = spent - planned;
              return (
                <li key={x.code}>
                  <button type="button" onClick={() => setFilter({ cat: x.code })} className="w-full text-left">
                    <span className="flex items-center gap-2">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full text-white" style={{ background: x.color }}>
                        {CAT_ICON[x.code]}
                      </span>
                      <span className="min-w-0 flex-1 font-semibold">{tx(x.name)}</span>
                      <span className="text-right text-sm">
                        <b>{m.rs(spent)}</b> / {m.rs(planned)}
                      </span>
                    </span>
                    <span className="mt-1 flex items-center gap-2">
                      <Bar value={spent} max={Math.max(planned, spent)} color={x.color} />
                      <span className={cx("shrink-0 text-xs font-bold", diff > 0 ? "text-soil" : "text-leaf-700")}>
                        {diff > 0 ? l(`+${m.rs(diff)} more`, `+${m.rs(diff)} जास्त`) : diff < 0 ? l(`${m.rs(-diff)} less`, `${m.rs(-diff)} कमी`) : ""}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="space-y-2">
            {c.plan.stages.map((s) => {
              const spent = c.current.filter((e) => e.cashPaid && c.stageOf(e.date) === s.key).reduce((a, e) => a + e.amount, 0);
              const planned = c.est.byStage[s.key] ?? 0;
              return (
                <li key={s.key} className={cx("rounded-xl p-2", c.stageKey === s.key && "bg-leaf-50")}>
                  <span className="flex justify-between text-sm">
                    <span className="font-semibold">{tx(s.name)}</span>
                    <span>
                      <b>{m.rs(spent)}</b> / {m.rs(planned)}
                    </span>
                  </span>
                  <Bar value={spent} max={Math.max(planned, spent)} color="#2b6a4f" />
                </li>
              );
            })}
            {!c.plan.stages.length && <li className="text-sm text-muted">{l("Stages start once the crop is sown.", "पेरणीनंतर टप्पे दिसतील.")}</li>}
          </ul>
        )}
      </section>

      {/* expense list */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold">{l("Expenses", "खर्च नोंदी")}</h3>
          <SpeakButton id={`money-list-${fc.id}`} size="sm" text={listed.slice(0, 5).map((e) => `${e.item} ${e.amount} ${l("rupees", "रुपये")}`).join(". ")} />
        </div>
        <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
          <FilterChip on={!filter.cat && filter.cash === undefined && !filter.from} onClick={() => setFilter({})}>
            {l("All", "सर्व")}
          </FilterChip>
          <FilterChip on={filter.cash === false} onClick={() => setFilter({ ...filter, cash: filter.cash === false ? undefined : false })}>
            {l("Own work", "घरचे काम")}
          </FilterChip>
          <FilterChip on={!!filter.from} onClick={() => setFilter({ ...filter, from: filter.from ? undefined : addDays(c.today, -30) })}>
            {l("Last 30 days", "मागील ३० दिवस")}
          </FilterChip>
          {filter.cat && (
            <FilterChip on onClick={() => setFilter({ ...filter, cat: undefined })}>
              {tx(categoryInfo(filter.cat).name)} ✕
            </FilterChip>
          )}
        </div>
        {listed.length === 0 ? (
          <p className={cx(card, "p-4 text-center text-muted")}>{l("No expenses yet. Tap “+ Expense”.", "अजून खर्च नाही. “+ खर्च” दाबा.")}</p>
        ) : (
          months.map((ym) => (
            <div key={ym} className="mb-3">
              <p className="mb-1 text-sm font-bold text-muted">{monthName(ym)}</p>
              <ul className={cx(card, "divide-y divide-line")}>
                {listed
                  .filter((e) => e.date.startsWith(ym))
                  .map((e) => (
                    <li key={e.id}>
                      <button type="button" onClick={() => setOpenRow(openRow === e.id ? null : e.id)} aria-expanded={openRow === e.id} className="flex min-h-14 w-full items-center gap-3 p-3 text-left">
                        <span className="grid size-9 shrink-0 place-items-center rounded-full text-white" style={{ background: categoryInfo(e.category).color }}>
                          {CAT_ICON[e.category]}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold">{e.item}</span>
                          <span className="block text-xs text-muted">
                            {date(e.date)}
                            {e.qty ? ` · ${num(e.qty)} ${e.unit ?? ""}` : ""}
                          </span>
                        </span>
                        {!e.cashPaid && <span className="rounded-full bg-sand px-2 py-0.5 text-xs font-bold text-muted">{l("own", "घरचे")}</span>}
                        {e.billPhotoId && <BillThumb id={e.billPhotoId} />}
                        <span className="font-bold">{m.rs(e.amount)}</span>
                      </button>
                      {openRow === e.id && (
                        <div className="mm-step space-y-2 px-3 pb-3">
                          {e.note && <p className="text-sm">{e.note}</p>}
                          {e.billPhotoId && <BillThumb id={e.billPhotoId} big />}
                          <div className="grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => setAdding({ expense: e })} className="flex min-h-11 items-center justify-center gap-1 rounded-xl border border-line font-semibold">
                              <Pencil size={16} /> {l("Edit", "बदला")}
                            </button>
                            <button
                              type="button"
                              onClick={() => window.confirm(l("Delete this expense?", "हा खर्च काढून टाकायचा?")) && deleteExpense(e.id)}
                              className="flex min-h-11 items-center justify-center gap-1 rounded-xl border border-soil/40 font-semibold text-soil"
                            >
                              <Trash2 size={16} /> {l("Delete", "काढा")}
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ))
        )}
      </section>

      {/* sales */}
      {c.allSales.length > 0 && (
        <section>
          <h3 className="mb-2 text-lg font-bold">{l("Sales", "विक्री")}</h3>
          <ul className={cx(card, "divide-y divide-line")}>
            {c.allSales.map((x) => (
              <li key={x.id} className="flex items-center gap-3 p-3">
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">
                    {num(x.qty)} {tx(UNIT_NAME[x.unit])} × ₹{num(x.ratePerUnit)}
                  </span>
                  <span className="block text-xs text-muted">
                    {date(x.date)}
                    {x.marketId ? ` · ${tx(marketById(x.marketId)?.name) || x.marketId}` : ""}
                  </span>
                </span>
                <span className="font-bold text-leaf-900">{m.rs(x.amount)}</span>
                <button type="button" aria-label={l("Delete sale", "विक्री काढा")} onClick={() => window.confirm(l("Delete this sale?", "ही विक्री काढून टाकायची?")) && deleteSale(x.id)} className="grid size-10 place-items-center text-soil">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* the estimate */}
      <section>
        <button type="button" onClick={() => setShowEstimate(!showEstimate)} aria-expanded={showEstimate} className="flex min-h-12 w-full items-center justify-between rounded-xl bg-sand px-3 font-bold">
          {l("Cost estimate", "खर्च अंदाज")} <ChevronDown size={18} className={cx("transition-transform", showEstimate && "rotate-180")} />
        </button>
        {showEstimate && (
          <div className="mm-step mt-2">
            <EstimateCard est={c.est} template={c.template} areaAcres={fc.areaAcres} cropName={cropName} perennial={c.perennial}>
              <EstimateActions onEdit={() => setEditing(true)} />
              {c.changed && (
                <button type="button" onClick={() => updateFarmCrop(fc.id, { costTemplateId: cropTemplate({ ...fc, costTemplateId: undefined }, crop).id })} className="min-h-11 w-full rounded-xl bg-gold-100 font-bold text-[#7a5108]">
                  {l("New estimate available — update", "नवीन अंदाज उपलब्ध — अद्ययावत करा")}
                </button>
              )}
            </EstimateCard>
          </div>
        )}
      </section>
      <p className="text-xs text-muted">{l("Your money records stay on this phone.", "तुमच्या खर्चाच्या नोंदी फक्त या फोनवर राहतात.")}</p>

      <button
        type="button"
        onClick={() => setAdding({})}
        className="fixed bottom-24 right-[max(1rem,calc(50%-14rem+1rem))] z-30 flex min-h-14 items-center gap-2 rounded-full bg-leaf-700 px-5 text-lg font-bold text-white shadow-lg active:scale-95"
      >
        <Plus size={22} /> {l("Expense", "खर्च")}
      </button>

      {adding && <AddExpenseSheet fc={fc} crop={crop} initial={adding.expense} onClose={() => setAdding(null)} />}
      {selling && <SaleSheet fc={fc} crop={crop} onClose={() => setSelling(false)} />}
      {editing && (
        <EstimateEditor
          template={c.template}
          areaAcres={fc.areaAcres}
          overrides={fc.estimateOverrides ?? {}}
          customLines={fc.customCostLines ?? []}
          onChange={(o, cl) => updateFarmCrop(fc.id, { estimateOverrides: o, customCostLines: cl })}
          onClose={() => setEditing(false)}
        />
      )}
      <p className="sr-only">{yu}</p>
    </div>
  );
}

function FilterChip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={cx("min-h-10 shrink-0 rounded-full border-2 px-3 text-sm font-bold", on ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white")}>
      {children}
    </button>
  );
}

function Nudge({ text, action, onClick }: { text: string; action: string; onClick: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-gold-100 p-3 text-[#6b4708]" role="status">
      <p className="min-w-0 flex-1 font-semibold">{text}</p>
      <button type="button" onClick={onClick} className="min-h-11 shrink-0 rounded-xl bg-white px-3 font-bold text-leaf-700">
        {action}
      </button>
    </div>
  );
}

// ---- profit and the price needed ----------------------------------------------------------------

type Money = ReturnType<typeof useCropMoney>;

function ProfitCard({ c, fc, cropName }: { c: Money; fc: FarmCrop; cropName: string }) {
  const { l, tx, num } = useStore();
  const m = useMoney();
  const gain = c.pr.net >= 0;
  const yu = tx(UNIT_NAME[c.yu]);
  const speech = l(
    `${c.pr.cash} rupees spent on this ${cropName}, ${c.pr.income} rupees from sales, net ${gain ? "profit" : "loss"} ${Math.abs(c.pr.net)} rupees.`,
    `या ${cropName}वर ${c.pr.cash} रुपये खर्च झाले, विक्रीतून ${c.pr.income} रुपये मिळाले, निव्वळ ${gain ? "नफा" : "तोटा"} ${Math.abs(c.pr.net)} रुपये.`,
  );
  return (
    <section className={cx(card, "space-y-2 p-4")} style={{ borderColor: gain ? "#2b6a4f" : "#b5532e" }}>
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-muted">{l("Net profit / loss", "निव्वळ नफा / तोटा")}</p>
          <p className={cx("flex items-center gap-2 text-4xl font-bold", gain ? "text-leaf-700" : "text-soil")}>
            {gain ? <TrendingUp size={30} /> : <TrendingDown size={30} />} {gain ? "" : "−"}
            {m.rs(Math.abs(c.pr.net))}
          </p>
          <p className="font-semibold">{gain ? l("Profit", "नफा") : l("Loss", "तोटा")}</p>
        </div>
        <SpeakButton id={`profit-${fc.id}`} text={speech} />
      </div>
      <dl className="grid grid-cols-[1fr_auto] gap-y-1 text-[15px]">
        <dt>{l("Income from sales", "विक्रीतून उत्पन्न")}</dt>
        <dd className="text-right font-bold">{m.rs(c.pr.income)}</dd>
        <dt>{l("Cash spent", "खिशातून खर्च")}</dt>
        <dd className="text-right font-bold text-soil">− {m.rs(c.pr.cash)}</dd>
        <dt>{l("Profit including own work", "घरच्या कामासह नफा")}</dt>
        <dd className="text-right font-bold">{m.rs(c.pr.netWithOwn)}</dd>
        <dt>{l("Profit per", "नफा प्रति")} {l(m.unit === "hectare" ? "hectare" : "acre", m.unit === "hectare" ? "हेक्टर" : "एकर")}</dt>
        <dd className="text-right font-bold">{m.perArea(c.pr.net / Math.max(fc.areaAcres, 0.01)).split(" / ")[0]}</dd>
        {c.pr.costPerUnit != null && (
          <>
            <dt>{l(`Cost per ${yu} (actual break-even)`, `प्रति ${yu} खर्च (प्रत्यक्ष खर्च निघण्याचा दर)`)}</dt>
            <dd className="text-right font-bold">₹{num(c.pr.costPerUnit)}</dd>
          </>
        )}
        {c.est.breakEven && (
          <>
            <dt className="text-muted">{l("Estimated break-even", "अंदाजे खर्च निघण्याचा दर")}</dt>
            <dd className="text-right text-muted">₹{num(c.est.breakEven[1])}</dd>
          </>
        )}
      </dl>
    </section>
  );
}

/** before selling: the price that covers spent + remaining cost, next to today's nearest market rate */
function PriceNeeded({ c, crop }: { c: Money; crop: CropInfo }) {
  const { l, tx, num } = useStore();
  const sellable = !!gradingFor(crop.id);
  const prices = usePrices(sellable ? crop.id : undefined);
  const { place } = useFarmPlace();
  const total = c.cash + c.remaining;
  const mid = (c.est.yieldRange[0] + c.est.yieldRange[1]) / 2;
  const need = mid > 0 ? Math.round(total / mid) : null;
  const yu = tx(UNIT_NAME[c.yu]);
  const near = useMemo(() => (place ? [...prices.rows].sort((a, b) => (distanceTo(place, a.marketId) ?? 1e9) - (distanceTo(place, b.marketId) ?? 1e9))[0] : undefined), [prices.rows, place]);
  if (need == null) return null;
  const nearRate = near ? Math.round(convert(1, c.yu, "quintal") * near.modalPerQtl) : null;
  const text = l(`To cover your costs you need about ₹${need} per ${yu}.`, `खर्च निघण्यासाठी सुमारे ₹${need} प्रति ${yu} दर हवा.`);
  return (
    <section className={cx(card, "space-y-1 p-4")}>
      <div className="flex items-center gap-2">
        <p className="flex-1 font-bold">{l("What price do I need?", "किती दराला विकावे?")}</p>
        <SpeakButton id={`need-${crop.id}`} size="sm" text={text} />
      </div>
      <p className="text-3xl font-bold text-leaf-900">
        ₹{num(need)} <span className="text-base font-semibold text-muted">/ {yu}</span>
      </p>
      <p className="text-sm text-muted">{l("Spent + still to come ÷ expected yield (estimate)", "झालेला + पुढील खर्च ÷ अपेक्षित उत्पादन (अंदाजे)")}</p>
      {near && nearRate != null && (
        <p className={cx("mt-1 rounded-xl p-2 text-[15px] font-semibold", nearRate >= need ? "bg-leaf-50 text-leaf-900" : "bg-soil-100 text-[#8a3a1d]")}>
          {l(`Today's ${tx(near.marketName)} rate`, `आजचा ${tx(near.marketName)} दर`)} ₹{num(nearRate)} / {yu}
          {near.source === "sample" ? ` · ${l("sample", "नमुना")}` : ""}
        </p>
      )}
    </section>
  );
}

// ---- add / edit an expense ----------------------------------------------------------------------

const UNIT_CHIPS: Partial<Record<CostCategory, string[]>> = {
  seed: ["किलो", "पाकिटे", "रोपे"],
  manure: ["ट्रॉली", "पोती"],
  fertiliser: ["पोती", "किलो"],
  plant_protection: ["फेरी", "लिटर"],
  harvest_post: ["पोती", "क्रेट"],
};

/** fast entry: category → item → amount (with workers × days × wage, hours × rate, qty × price) */
export function AddExpenseSheet({ fc, crop, initial, crops, nameOf, onClose }: { fc?: FarmCrop; crop?: CropInfo; initial?: Expense; crops?: FarmCrop[]; nameOf?: (fc: FarmCrop) => string; onClose: () => void }) {
  const { state, l, tx, num, addExpense, updateExpense, toast } = useStore();
  const today = todayISO();
  const [cropId, setCropId] = useState<string | null>(initial ? initial.farmCropId : (fc?.id ?? crops?.[0]?.id ?? null));
  const [cat, setCat] = useState<CostCategory | null>(initial?.category ?? null);
  const [item, setItem] = useState(initial?.item ?? "");
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [d, setD] = useState(initial?.date ?? today);
  const [cash, setCash] = useState(initial?.cashPaid ?? true);
  const [note, setNote] = useState(initial?.note ?? "");
  const [photo, setPhoto] = useState<string | undefined>(initial?.billPhotoId);
  const [lineId, setLineId] = useState<string | undefined>(initial?.templateLineId);
  const [qty, setQty] = useState<{ qty?: number; unit?: string }>({ qty: initial?.qty, unit: initial?.unit });
  const [saved, setSaved] = useState(false);
  const chosen = fc ?? state.myFarmCrops.find((x) => x.id === cropId);
  const lines = useMemo(() => {
    if (!chosen || !cat) return [];
    const info = crop ?? { category: "vegetable" as const };
    const t = cropTemplate(chosen, info as CropInfo);
    return [...t.lines, ...(chosen.customCostLines ?? [])].filter((x) => x.category === cat);
  }, [chosen, cat, crop]);

  const save = () => {
    const a = parseMoney(amount);
    if (!cat || !(a > 0) || !item.trim()) return;
    if (d > today) return toast({ en: "The date can't be in the future", mr: "तारीख पुढची असू शकत नाही" });
    const x = { farmCropId: fc ? fc.id : cropId, category: cat, item: item.trim().slice(0, 80), amount: Math.round(a), date: d, cashPaid: cash, ...(qty.qty ? { qty: qty.qty, unit: qty.unit } : {}), ...(lineId ? { templateLineId: lineId } : {}), ...(photo ? { billPhotoId: photo } : {}), ...(note.trim() ? { note: note.trim().slice(0, 200) } : {}) };
    if (initial) updateExpense(initial.id, x);
    else addExpense(x);
    setSaved(true);
    setTimeout(onClose, 700);
  };

  const onPhoto = async (f: File | undefined) => {
    if (!f) return;
    try {
      const url = await compressBill(f);
      const id = `bill-${Date.now().toString(36)}`;
      await saveBill(id, url);
      setPhoto(id);
    } catch {
      toast({ en: "Couldn't save the photo", mr: "फोटो जतन करता आला नाही" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={l("Add expense", "खर्च नोंदवा")} className="max-h-[94dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-cream p-4 pb-8" onClick={(e) => e.stopPropagation()}>
        {saved ? (
          <div className="grid min-h-60 place-items-center" role="status">
            <span className="grid size-20 place-items-center rounded-full bg-leaf-700 text-white mm-pop">
              <Check size={44} strokeWidth={3} />
            </span>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold">{initial ? l("Edit expense", "खर्च बदला") : l("Add expense", "खर्च नोंदवा")}</h2>
              <button onClick={onClose} className="grid size-12 place-items-center rounded-full" aria-label={l("Close", "बंद करा")}>
                <X size={22} />
              </button>
            </div>

            {!fc && (
              <label className="mb-3 block">
                <span className="mb-1 block font-semibold">{l("For which crop?", "कोणत्या पिकासाठी?")}</span>
                <select value={cropId ?? ""} onChange={(e) => setCropId(e.target.value || null)} className="min-h-12 w-full rounded-xl border border-line bg-white px-3">
                  {(crops ?? state.myFarmCrops).map((x) => (
                    <option key={x.id} value={x.id}>
                      {nameOf ? nameOf(x) : `${tx(gradingFor(x.cropId)?.name) || x.cropId} · ${tx(x.plotName)}`}
                    </option>
                  ))}
                  <option value="">{l("Whole farm (e.g. pump repair)", "पूर्ण शेती (उदा. पंप दुरुस्ती)")}</option>
                </select>
              </label>
            )}

            <p className="mb-2 font-semibold">{l("What for?", "कशासाठी?")}</p>
            <div className="grid grid-cols-3 gap-2" role="radiogroup">
              {CATEGORIES.map((x) => (
                <button
                  key={x.code}
                  type="button"
                  role="radio"
                  aria-checked={cat === x.code}
                  onClick={() => {
                    setCat(x.code);
                    setLineId(undefined);
                  }}
                  className={cx("flex min-h-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 p-1 text-center text-xs font-bold leading-tight", cat === x.code ? "border-leaf-700 bg-leaf-50" : "border-line bg-white")}
                >
                  <span className="grid size-9 place-items-center rounded-full text-white" style={{ background: x.color }}>
                    {CAT_ICON[x.code]}
                  </span>
                  {tx(x.name)}
                </button>
              ))}
            </div>

            {cat && (
              <div className="mm-step mt-4 space-y-3">
                {lines.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {lines.map((x) => (
                      <button
                        key={x.id}
                        type="button"
                        aria-pressed={lineId === x.id}
                        onClick={() => {
                          setItem(tx(x.item));
                          setLineId(x.id);
                        }}
                        className={cx("min-h-10 rounded-full border-2 px-3 text-sm font-semibold", lineId === x.id ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white")}
                      >
                        {tx(x.item)}
                      </button>
                    ))}
                  </div>
                )}
                <Input className="min-h-12 w-full rounded-xl border border-line bg-white px-3 text-[17px]" placeholder={l("What was it? (e.g. weeding)", "काय होते? (उदा. खुरपणी)")} value={item} maxLength={80} onChange={(e) => setItem(e.target.value)} aria-label={l("Item", "काय")} />
                <AmountHelper key={cat} category={cat} rates={state.myLocalRates} onUse={(a, q) => {
                  setAmount(String(a));
                  setQty(q);
                }} />
                <label className="block">
                  <span className="mb-1 block font-semibold">{l("Amount (₹)", "रक्कम (₹)")}</span>
                  <Input className="h-16 w-full rounded-2xl border-2 border-line bg-white px-4 text-3xl font-bold" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} aria-label={l("Amount", "रक्कम")} />
                </label>
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-sand p-1" role="radiogroup">
                  <button type="button" role="radio" aria-checked={cash} onClick={() => setCash(true)} className={cx("min-h-12 rounded-lg text-sm font-bold", cash ? "bg-white shadow" : "text-muted")}>
                    {l("Paid in cash", "पैसे दिले")}
                  </button>
                  <button type="button" role="radio" aria-checked={!cash} onClick={() => setCash(false)} className={cx("min-h-12 rounded-lg text-sm font-bold", !cash ? "bg-white shadow" : "text-muted")}>
                    {l("Own work (not paid)", "घरचे काम")}
                  </button>
                </div>
                <label className="block">
                  <span className="mb-1 block font-semibold">{l("Date", "तारीख")}</span>
                  <input type="date" max={today} value={d} onChange={(e) => setD(e.target.value)} className="min-h-12 w-full rounded-xl border border-line bg-white px-3" />
                </label>
                <Input className="min-h-12 w-full rounded-xl border border-line bg-white px-3" placeholder={l("Note (optional)", "टीप (पर्यायी)")} value={note} maxLength={200} onChange={(e) => setNote(e.target.value)} aria-label={l("Note", "टीप")} />
                <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-white font-semibold text-muted">
                  {photo ? <BillThumb id={photo} /> : <Camera size={18} />} {photo ? l("Bill photo added", "पावतीचा फोटो जोडला") : l("Bill photo (optional)", "पावतीचा फोटो (पर्यायी)")}
                  <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => onPhoto(e.target.files?.[0])} />
                </label>
                <button type="button" onClick={save} disabled={!item.trim() || !(parseMoney(amount) > 0)} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-leaf-700 text-lg font-bold text-white disabled:opacity-40">
                  <Check size={20} /> {l("Save", "जतन करा")} {parseMoney(amount) > 0 ? `· ₹${num(parseMoney(amount))}` : ""}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** workers × days × wage · hours × rate · bags/kg × price → amount */
export function AmountHelper({ category, rates, onUse }: { category: CostCategory; rates: ReturnType<typeof useStore>["state"]["myLocalRates"]; onUse: (amount: number, q: { qty?: number; unit?: string }) => void }) {
  const { l, num } = useStore();
  const kind = category === "labour" ? "labour" : category === "machinery" || category === "land_prep" ? "machine" : UNIT_CHIPS[category] ? "inputs" : null;
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [r, setR] = useState("");
  const [unit, setUnit] = useState(UNIT_CHIPS[category]?.[0] ?? "");
  const [woman, setWoman] = useState(true);
  if (!kind) return null;
  const wage = rateOf(rates, woman ? "labour_day_female" : "labour_day_male");
  const rate = parseMoney(r) || (kind === "labour" ? wage : kind === "machine" ? rateOf(rates, "tractor_hour") : 0);
  const total = kind === "labour" ? (parseMoney(a) || 0) * (parseMoney(b) || 0) * rate : (parseMoney(a) || 0) * rate;
  const box = "h-12 w-full rounded-xl border border-line bg-white px-2 text-center text-lg font-bold";
  return (
    <div className="space-y-2 rounded-2xl bg-white p-3">
      <p className="text-sm font-bold text-muted">
        {kind === "labour" ? l("Workers × days × wage", "मजूर × दिवस × मजुरी") : kind === "machine" ? l("Hours × rate", "तास × दर") : l("Quantity × price", "पोती/किलो × दर")}
      </p>
      {kind === "labour" && (
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-sand p-1 text-sm" role="radiogroup">
          <button type="button" role="radio" aria-checked={woman} onClick={() => setWoman(true)} className={cx("min-h-10 rounded-md font-bold", woman ? "bg-white" : "text-muted")}>
            {l("Women", "महिला")}
          </button>
          <button type="button" role="radio" aria-checked={!woman} onClick={() => setWoman(false)} className={cx("min-h-10 rounded-md font-bold", !woman ? "bg-white" : "text-muted")}>
            {l("Men", "पुरुष")}
          </button>
        </div>
      )}
      {kind === "inputs" && (
        <div className="flex gap-2">
          {UNIT_CHIPS[category]!.map((u) => (
            <button key={u} type="button" aria-pressed={unit === u} onClick={() => setUnit(u)} className={cx("min-h-10 rounded-full border-2 px-3 text-sm font-bold", unit === u ? "border-leaf-700 bg-leaf-700 text-white" : "border-line")}>
              {u}
            </button>
          ))}
        </div>
      )}
      <div className={cx("grid items-center gap-1", kind === "labour" ? "grid-cols-[1fr_auto_1fr_auto_1fr]" : "grid-cols-[1fr_auto_1fr]")}>
        <Input className={box} inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} placeholder={kind === "labour" ? l("workers", "मजूर") : kind === "machine" ? l("hours", "तास") : unit} aria-label={kind === "labour" ? l("Workers", "मजूर") : kind === "machine" ? l("Hours", "तास") : l("Quantity", "प्रमाण")} />
        <span className="font-bold">×</span>
        {kind === "labour" && (
          <>
            <Input className={box} inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} placeholder={l("days", "दिवस")} aria-label={l("Days", "दिवस")} />
            <span className="font-bold">×</span>
          </>
        )}
        <Input className={box} inputMode="numeric" value={r} onChange={(e) => setR(e.target.value)} placeholder={rate ? `₹${num(rate)}` : "₹"} aria-label={l("Rate", "दर")} />
      </div>
      <button
        type="button"
        disabled={!(total > 0)}
        onClick={() => onUse(Math.round(total), kind === "labour" ? { qty: (parseMoney(a) || 0) * (parseMoney(b) || 0), unit: l("worker-days", "मजूर-दिवस") } : { qty: parseMoney(a), unit: kind === "machine" ? l("hours", "तास") : unit })}
        className="min-h-11 w-full rounded-xl bg-leaf-100 font-bold text-leaf-900 disabled:opacity-40"
      >
        = ₹{num(Math.round(total))} · {l("Use", "वापरा")}
      </button>
    </div>
  );
}

// ---- record a sale --------------------------------------------------------------------------------

/** a sale, prefilled from an accepted Mandi Mitra offer when there is one */
export function SaleSheet({ fc, crop, onClose }: { fc: FarmCrop; crop: CropInfo; onClose: () => void }) {
  const { state, l, tx, num, isMine, addSale } = useStore();
  const today = todayISO();
  const g = gradingFor(crop.id);
  const unit0: Unit = cropTemplate(fc, crop).yieldUnit;
  // an accepted offer on a lot holding this farmer's listing of this crop
  const fromMitra = useMemo(() => {
    for (const x of state.listings.filter((y) => isMine(y) && y.crop === crop.id && y.lotId)) {
      const offer = state.offers.find((o) => o.lotId === x.lotId && o.status === "Accepted");
      const lot = state.lots.find((t) => t.id === x.lotId);
      if (offer && lot) return { listing: x, offer, lot };
    }
    return null;
  }, [state.listings, state.offers, state.lots, isMine, crop.id]);
  const [unit, setUnit] = useState<Unit>(fromMitra ? fromMitra.offer.unit : unit0);
  const [qty, setQty] = useState(fromMitra ? String(convert(fromMitra.listing.quantity, fromMitra.listing.unit, fromMitra.offer.unit)) : "");
  const [rate, setRate] = useState(fromMitra ? String(fromMitra.offer.pricePerUnit) : "");
  const [ded, setDed] = useState("");
  const [grade, setGrade] = useState(fromMitra?.listing.mitraGradeCode ?? "");
  const [market, setMarket] = useState(fromMitra?.lot.targetMarketId ?? "");
  const [d, setD] = useState(today);
  const amount = Math.round((parseMoney(qty) || 0) * (parseMoney(rate) || 0) - (parseMoney(ded) || 0));
  const units: Unit[] = Array.from(new Set<Unit>([unit0, "quintal", "kg", ...(g ? [g.saleUnit] : [])]));
  const box = "min-h-12 w-full rounded-xl border border-line bg-white px-3 text-lg";
  const save = () => {
    if (!(parseMoney(qty) > 0) || !(parseMoney(rate) > 0) || d > today) return;
    const x: Omit<Sale, "id" | "owner"> = {
      farmCropId: fc.id,
      date: d,
      qty: parseMoney(qty),
      unit,
      ratePerUnit: parseMoney(rate),
      amount,
      ...(parseMoney(ded) ? { deductions: parseMoney(ded) } : {}),
      ...(grade ? { gradeCode: grade } : {}),
      ...(market ? { marketId: market } : {}),
      ...(fromMitra ? { listingId: fromMitra.listing.id, lotId: fromMitra.lot.id } : {}),
    };
    addSale(x);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={l("Record sale", "विक्री नोंदवा")} className="max-h-[94dvh] w-full max-w-md space-y-3 overflow-y-auto rounded-t-3xl bg-cream p-4 pb-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{l("Record sale", "विक्री नोंदवा")}</h2>
          <button onClick={onClose} className="grid size-12 place-items-center rounded-full" aria-label={l("Close", "बंद करा")}>
            <X size={22} />
          </button>
        </div>
        {fromMitra && <p className="rounded-xl bg-indigo-50 p-2 text-sm font-semibold text-indigo-900">{l("Filled from your Mandi Mitra sale — check and save.", "मंडी मित्र विक्रीवरून भरले — तपासा व जतन करा.")}</p>}
        <label className="block">
          <span className="mb-1 block font-semibold">{l("Quantity", "प्रमाण")}</span>
          <div className="flex gap-2">
            <Input className={box} wrapClassName="min-w-0 flex-1" inputMode="decimal" value={qty} onChange={(e) => setQty(e.target.value)} aria-label={l("Quantity", "प्रमाण")} />
            <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)} className="min-h-12 rounded-xl border border-line bg-white px-2" aria-label={l("Unit", "एकक")}>
              {units.map((u) => (
                <option key={u} value={u}>
                  {tx(UNIT_NAME[u])}
                </option>
              ))}
            </select>
          </div>
        </label>
        <label className="block">
          <span className="mb-1 block font-semibold">
            {l("Rate ₹ per", "दर ₹ प्रति")} {tx(UNIT_NAME[unit])}
          </span>
          <Input className={box} inputMode="numeric" value={rate} onChange={(e) => setRate(e.target.value)} aria-label={l("Rate", "दर")} />
        </label>
        <label className="block">
          <span className="mb-1 block font-semibold">{l("Deductions — hamali, commission (optional)", "कपात — हमाली, कमिशन (पर्यायी)")}</span>
          <Input className={box} inputMode="numeric" value={ded} onChange={(e) => setDed(e.target.value)} aria-label={l("Deductions", "कपात")} />
        </label>
        {g && (
          <label className="block">
            <span className="mb-1 block font-semibold">{l("Grade (optional)", "प्रत (पर्यायी)")}</span>
            <select value={grade} onChange={(e) => setGrade(e.target.value)} className={box}>
              <option value="">{l("Not given", "दिलेली नाही")}</option>
              {g.grades.map((x) => (
                <option key={x.code} value={x.code}>
                  {tx(x.name)}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="block">
          <span className="mb-1 block font-semibold">{l("Market (optional)", "बाजार (पर्यायी)")}</span>
          <Input className={box} value={tx(marketById(market)?.name) || market} onChange={(e) => setMarket(e.target.value)} aria-label={l("Market", "बाजार")} />
        </label>
        <label className="block">
          <span className="mb-1 block font-semibold">{l("Date", "तारीख")}</span>
          <input type="date" max={today} value={d} onChange={(e) => setD(e.target.value)} className={box} />
        </label>
        <p className="text-2xl font-bold text-leaf-900">= ₹{num(Math.max(0, amount))}</p>
        <button type="button" onClick={save} disabled={!(amount > 0)} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-leaf-700 text-lg font-bold text-white disabled:opacity-40">
          <Check size={20} /> {l("Save sale", "विक्री जतन करा")}
        </button>
      </div>
    </div>
  );
}
