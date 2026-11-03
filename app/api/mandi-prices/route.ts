/**
 * Today's mandi prices for one crop in Maharashtra, from data.gov.in ("Current Daily Price of
 * Various Commodities from Various Markets (Mandi)"). The key (DATA_GOV_IN_API_KEY) stays here.
 * Without a key, on an API error, or when a crop has no rows, sample rates are returned and
 * marked as sample. Cached per crop for 3 hours.
 *
 * GET /api/mandi-prices?crop=onion → PricesResponse (lib/mandi/prices.ts)
 * GET /api/mandi-prices?discover=1 → commodity names present for Maharashtra (needs the key)
 */
import { GRADINGS } from "@/lib/grades";
import { COMMODITIES, typeFromVariety } from "@/lib/mandi/commodities";
import { matchMarket } from "@/lib/mandi/markets";
import { samplePrices, type MarketPrice, type PricesResponse } from "@/lib/mandi/prices";

export const dynamic = "force-dynamic";

const RESOURCE = "9ef84268-d588-465a-a308-a864a43d0070";
const PAGE = 1000;
const MAX_PAGES = 5;
const CACHE_MS = 3 * 60 * 60 * 1000;
const PER_MINUTE = 30; // requests per visitor per minute

// same simple per-visitor limit as app/api/chat/route.ts
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > PER_MINUTE;
}

const cache = new Map<string, { at: number; body: PricesResponse }>();
const today = () => new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10); // IST

type ApiRecord = { state?: string; district?: string; market?: string; commodity?: string; variety?: string; grade?: string; arrival_date?: string; min_price?: string | number; max_price?: string | number; modal_price?: string | number };

async function fetchRecords(key: string, filters: Record<string, string>): Promise<ApiRecord[]> {
  const out: ApiRecord[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const url = new URL(`https://api.data.gov.in/resource/${RESOURCE}`);
    url.searchParams.set("api-key", key);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", String(PAGE));
    url.searchParams.set("offset", String(page * PAGE));
    for (const [k, v] of Object.entries(filters)) url.searchParams.set(`filters[${k}]`, v);
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000), cache: "no-store" });
    if (!res.ok) throw new Error(`data.gov.in ${res.status}`);
    const data = (await res.json()) as { records?: ApiRecord[]; total?: number };
    const recs = data.records ?? [];
    out.push(...recs);
    if (recs.length < PAGE) break;
  }
  return out;
}

/** DD/MM/YYYY → YYYY-MM-DD */
const isoDate = (d = "") => {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(d.trim());
  return m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : today();
};

function normalise(cropId: string, recs: ApiRecord[]): MarketPrice[] {
  const rows = recs
    .map((r): MarketPrice | null => {
      const min = Number(r.min_price);
      const max = Number(r.max_price);
      const modal = Number(r.modal_price);
      if (!r.market || !(modal > 0)) return null;
      const { id, market } = matchMarket(r.market);
      return {
        marketId: id,
        marketName: market?.name ?? { en: r.market, mr: r.market },
        district: r.district ?? market?.district ?? "",
        cropId,
        typeCode: typeFromVariety(cropId, r.variety ?? ""),
        varietyRaw: r.variety ?? "",
        date: isoDate(r.arrival_date),
        minPerQtl: min > 0 ? min : modal,
        maxPerQtl: max > 0 ? max : modal,
        modalPerQtl: modal,
        source: "live",
      };
    })
    .filter((r): r is MarketPrice => !!r);
  // keep the latest row per market + variety
  const latest = new Map<string, MarketPrice>();
  for (const r of rows) {
    const k = `${r.marketId}|${r.varietyRaw}`;
    const old = latest.get(k);
    if (!old || r.date > old.date) latest.set(k, r);
  }
  return [...latest.values()];
}

const sampleBody = (cropId: string, note: PricesResponse["note"]): PricesResponse => ({ cropId, source: "sample", rows: samplePrices(cropId, today()), note });

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return Response.json({ error: "Too many requests — please wait a minute" }, { status: 429 });
  const params = new URL(req.url).searchParams;
  const key = process.env.DATA_GOV_IN_API_KEY;

  if (params.get("discover")) {
    if (!key) return Response.json({ error: "DATA_GOV_IN_API_KEY is not set" }, { status: 503 });
    try {
      const recs = await fetchRecords(key, { state: "Maharashtra" });
      return Response.json({ commodities: Array.from(new Set(recs.map((r) => r.commodity).filter(Boolean))).sort() });
    } catch (e) {
      console.error("mandi-prices: discover failed", e);
      return Response.json({ error: "Price service unreachable" }, { status: 502 });
    }
  }

  const cropId = params.get("crop") ?? "";
  if (!GRADINGS.some((g) => g.cropId === cropId)) return Response.json({ error: "Unknown crop" }, { status: 400 });
  if (!key) return Response.json(sampleBody(cropId, "no-key"));

  const hit = cache.get(cropId);
  if (hit && Date.now() - hit.at < CACHE_MS) return Response.json(hit.body);
  try {
    let rows: MarketPrice[] = [];
    for (const name of COMMODITIES[cropId] ?? []) {
      rows = normalise(cropId, await fetchRecords(key, { state: "Maharashtra", commodity: name }));
      if (rows.length) break;
    }
    if (!rows.length) {
      console.warn(`mandi-prices: no Maharashtra rows for ${cropId} (tried ${COMMODITIES[cropId]?.join(", ")}); check the names with ?discover=1`);
      return Response.json(sampleBody(cropId, "no-rows"));
    }
    const body: PricesResponse = { cropId, source: "live", rows };
    cache.set(cropId, { at: Date.now(), body });
    return Response.json(body);
  } catch (e) {
    console.error("mandi-prices: fetch failed", e);
    return Response.json(sampleBody(cropId, "api-error"));
  }
}
