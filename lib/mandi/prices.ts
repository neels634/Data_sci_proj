/**
 * Mandi prices: one shape for live (data.gov.in), cached, sample and Mitra-entered rates, and the
 * estimate of a grade's rate from a market's min–max band. Prices are ₹ per quintal.
 * Government data has no local grades, so grade rates are estimates unless a Mitra entered one.
 */
import type { Bi } from "../i18n";
import { gradeFor, gradingFor, UNSURE } from "../grades.ts";
import { marketById } from "./markets.ts";
import sample from "./sample-prices.json" with { type: "json" };

export type PriceSource = "live" | "cached" | "sample" | "mitra";

export interface MarketPrice {
  marketId: string;
  marketName: Bi;
  district: string;
  cropId: string;
  typeCode?: string;
  varietyRaw: string;
  date: string; // YYYY-MM-DD
  minPerQtl: number;
  maxPerQtl: number;
  modalPerQtl: number;
  source: "live" | "cached" | "sample";
}

/** a real grade-wise rate a Mitra entered for one market and day */
export interface MitraRate {
  id: string;
  marketId: string;
  cropId: string;
  typeCode?: string;
  gradeCode: string;
  perQtl: number;
  date: string;
  by: string; // account id
}

export interface PricesResponse {
  cropId: string;
  source: "live" | "sample";
  rows: MarketPrice[];
  /** why sample rates are shown, for the screen */
  note?: "no-key" | "no-rows" | "api-error";
}

type SampleRow = { marketId: string; cropId: string; typeCode?: string; varietyRaw: string; minPerQtl: number; maxPerQtl: number; modalPerQtl: number };

/** sample rows for a crop, dated `today` */
export function samplePrices(cropId: string, today: string): MarketPrice[] {
  return (sample.rows as SampleRow[])
    .filter((r) => r.cropId === cropId)
    .map((r) => {
      const m = marketById(r.marketId)!;
      return { ...r, marketName: m.name, district: m.district, date: today, source: "sample" as const };
    });
}

/** whole days between two YYYY-MM-DD dates */
export const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
/** prices older than this show a "old rates" chip */
export const OLD_AFTER_DAYS = 3;

/** the grade a rate is worked out for: "don't know" is priced at the crop's middle grade */
export function pricedGrade(cropId: string, gradeCode: string) {
  if (gradeCode !== UNSURE) return gradeCode;
  const grades = [...(gradingFor(cropId)?.grades ?? [])].sort((a, b) => a.rank - b.rank);
  return grades[Math.floor((grades.length - 1) / 2)]?.code ?? gradeCode;
}

/** the price row for a market: the farmer's type if given, else the best-paying variety */
export function rowFor(rows: MarketPrice[], marketId: string, typeCode?: string) {
  const here = rows.filter((r) => r.marketId === marketId);
  const typed = typeCode ? here.filter((r) => r.typeCode === typeCode) : [];
  const pool = typed.length ? typed : here;
  return pool.reduce<MarketPrice | undefined>((best, r) => (!best || r.modalPerQtl > best.modalPerQtl ? r : best), undefined);
}

export interface GradeRate {
  perQtl: number;
  source: PriceSource;
  date: string;
  /** the grade actually priced (the middle grade when the farmer didn't know) */
  pricedAs: string;
}

/** a grade's rate at a market: a Mitra's rate for today wins, else the estimate from the band */
export function gradeRate(p: { cropId: string; typeCode?: string; gradeCode: string; marketId: string; rows: MarketPrice[]; mitraRates: MitraRate[]; today: string }): GradeRate | null {
  const pricedAs = pricedGrade(p.cropId, p.gradeCode);
  const mitra = p.mitraRates.find(
    (r) => r.marketId === p.marketId && r.cropId === p.cropId && r.gradeCode === pricedAs && r.date === p.today && (!p.typeCode || !r.typeCode || r.typeCode === p.typeCode),
  );
  if (mitra) return { perQtl: mitra.perQtl, source: "mitra", date: mitra.date, pricedAs };
  const row = rowFor(p.rows, p.marketId, p.typeCode);
  const g = gradeFor(pricedAs);
  if (!row || !g) return null;
  return { perQtl: Math.round(row.minPerQtl + g.pricePosition * (row.maxPerQtl - row.minPerQtl)), source: row.source, date: row.date, pricedAs };
}
