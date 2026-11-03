/**
 * SHA-256 written out, because the browser's crypto.subtle only exists on https and localhost, and a
 * phone reaching a laptop over Wi-Fi uses plain http. Without this, nobody could log in there.
 */
const K = new Uint32Array(64);
const H0 = new Uint32Array(8);
{
  // the standard's constants: fractional parts of the cube and square roots of the first primes
  const primes: number[] = [];
  for (let n = 2; primes.length < 64; n++) if (primes.every((p) => n % p !== 0)) primes.push(n);
  const fraction = (x: number) => ((x - Math.floor(x)) * 2 ** 32) >>> 0;
  primes.forEach((p, i) => (K[i] = fraction(Math.cbrt(p))));
  primes.slice(0, 8).forEach((p, i) => (H0[i] = fraction(Math.sqrt(p))));
}

const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));

/** Lowercase hex digest of the text's UTF-8 bytes; the same answer crypto.subtle would give. */
export function sha256Hex(text: string): string {
  const message = new TextEncoder().encode(text);
  const padded = new Uint8Array((((message.length + 8) >> 6) + 1) * 64);
  padded.set(message);
  padded[message.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, Math.floor((message.length * 8) / 2 ** 32));
  view.setUint32(padded.length - 4, (message.length * 8) >>> 0);

  const h = H0.slice();
  const w = new Uint32Array(64);
  for (let block = 0; block < padded.length; block += 64) {
    for (let t = 0; t < 16; t++) w[t] = view.getUint32(block + t * 4);
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
      const s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, i] = h;
    for (let t = 0; t < 64; t++) {
      const t1 = (i + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[t] + w[t]) >>> 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
      i = g;
      g = f;
      f = e;
      e = (d + t1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) >>> 0;
    }
    [a, b, c, d, e, f, g, i].forEach((v, n) => (h[n] = (h[n] + v) >>> 0));
  }
  return Array.from(h, (v) => v.toString(16).padStart(8, "0")).join("");
}
