"use client";

/**
 * Lazy loading of full crop data. Each crop lives in its own chunk (static import paths in
 * loaders.generated.ts), so the library grid stays light and a crop page loads one file.
 */
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { LOADERS } from "./loaders.generated";
import type { CropInfo } from "../types";

const cache = new Map<string, CropInfo>();
const pending = new Map<string, Promise<CropInfo | null>>();
const listeners = new Set<() => void>();
let version = 0;
const emit = () => {
  version++;
  listeners.forEach((l) => l());
};

/** Full crop data, loaded once and cached. null for an unknown id. */
export function loadCrop(id: string): Promise<CropInfo | null> {
  const hit = cache.get(id);
  if (hit) return Promise.resolve(hit);
  const inFlight = pending.get(id);
  if (inFlight) return inFlight;
  const loader = LOADERS[id];
  if (!loader) return Promise.resolve(null);
  const p = loader()
    .then((m) => {
      cache.set(id, m.default);
      pending.delete(id);
      emit();
      return m.default;
    })
    .catch(() => {
      pending.delete(id);
      return null;
    });
  pending.set(id, p);
  return p;
}

/** The crop if it is already loaded (synchronous); undefined otherwise. */
export const peekCrop = (id: string): CropInfo | undefined => cache.get(id);

export const hasCrop = (id: string) => id in LOADERS;

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const snapshot = () => version;

/** Load one crop; `undefined` while loading, `null` if the id is unknown. */
export function useCrop(id: string | null | undefined): CropInfo | null | undefined {
  useSyncExternalStore(subscribe, snapshot, () => 0);
  useEffect(() => {
    if (id) void loadCrop(id);
  }, [id]);
  if (!id) return null;
  if (cache.has(id)) return cache.get(id)!;
  return hasCrop(id) ? undefined : null;
}

/**
 * Load several crops (e.g. everything on the farm). Returns a lookup that gives the crop once it
 * has loaded, and whether all of them have.
 */
export function useCrops(ids: string[]): { get: (id: string) => CropInfo | undefined; ready: boolean } {
  const v = useSyncExternalStore(subscribe, snapshot, () => 0);
  const key = Array.from(new Set(ids)).sort().join(",");
  useEffect(() => {
    for (const id of key.split(",")) if (id) void loadCrop(id);
  }, [key]);
  return useMemo(() => {
    void v;
    const list = key ? key.split(",") : [];
    return { get: (id: string) => cache.get(id), ready: list.every((id) => cache.has(id) || !hasCrop(id)) };
  }, [key, v]);
}
