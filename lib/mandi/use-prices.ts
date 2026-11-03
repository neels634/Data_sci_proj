"use client";

/**
 * Rates for one crop: today's from /api/mandi-prices; if that fails, the last live rates saved on
 * this phone ("last available"); otherwise sample rates. Never mixes sources without saying so.
 */
import { useEffect, useState } from "react";
import { todayISO } from "../lifecycle";
import { samplePrices, type MarketPrice, type PricesResponse } from "./prices";

const KEY = "shet-mandi-last:";

export interface CropPrices {
  rows: MarketPrice[];
  source: "live" | "cached" | "sample";
  note?: PricesResponse["note"] | "offline";
  loading: boolean;
}

export function usePrices(cropId: string | undefined): CropPrices {
  const [state, setState] = useState<CropPrices>({ rows: [], source: "sample", loading: true });
  useEffect(() => {
    if (!cropId) return;
    let live = true;
    setState({ rows: [], source: "sample", loading: true });
    const fallback = (note: CropPrices["note"]) => {
      try {
        const saved = JSON.parse(localStorage.getItem(KEY + cropId) ?? "null") as MarketPrice[] | null;
        if (saved?.length) return { rows: saved.map((r) => ({ ...r, source: "cached" as const })), source: "cached" as const, note, loading: false };
      } catch {}
      return { rows: samplePrices(cropId, todayISO()), source: "sample" as const, note, loading: false };
    };
    fetch(`/api/mandi-prices?crop=${encodeURIComponent(cropId)}`)
      .then((r) => (r.ok ? (r.json() as Promise<PricesResponse>) : Promise.reject(new Error(String(r.status)))))
      .then((body) => {
        if (!live) return;
        if (body.source === "live") {
          try {
            localStorage.setItem(KEY + cropId, JSON.stringify(body.rows));
          } catch {}
          setState({ rows: body.rows, source: "live", loading: false });
        } else if (body.note === "no-key") setState({ rows: body.rows, source: "sample", note: body.note, loading: false });
        else setState(fallback(body.note));
      })
      .catch(() => live && setState(fallback("offline")));
    return () => {
      live = false;
    };
  }, [cropId]);
  return state;
}
