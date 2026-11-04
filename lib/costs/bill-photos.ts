"use client";

/** Bill photos: compressed to ≤ 300 KB and kept in this phone's IndexedDB. Never uploaded. */
const DB = "shet-bills";
const STORE = "photos";
const MAX_BYTES = 300 * 1024;

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const saveBill = (id: string, dataUrl: string) => tx("readwrite", (s) => s.put(dataUrl, id)).then(() => id);
export const loadBill = (id: string) => tx<string | undefined>("readonly", (s) => s.get(id) as IDBRequest<string | undefined>);
export const deleteBill = (id: string) => tx("readwrite", (s) => s.delete(id));

/** shrink a photo until it is ≤ 300 KB (as a JPEG data URL) */
export async function compressBill(file: File): Promise<string> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = URL.createObjectURL(file);
  });
  let side = 1280;
  for (let attempt = 0; attempt < 6; attempt++) {
    const scale = Math.min(1, side / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * scale);
    c.height = Math.round(img.height * scale);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    const url = c.toDataURL("image/jpeg", attempt < 3 ? 0.7 : 0.55);
    if (url.length * 0.75 <= MAX_BYTES) return url;
    side = Math.round(side * 0.75);
  }
  throw new Error("photo too large");
}
