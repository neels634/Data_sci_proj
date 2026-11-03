/**
 * Our Crop Library ids → commodity names in the data.gov.in / Agmarknet mandi price dataset.
 * The exact names could not be checked without an API key, so each crop lists candidate names;
 * /api/mandi-prices tries them in order, uses those that return Maharashtra rows, and logs a
 * warning for a crop where none match. When a key is set, the route's `?discover=1` lists the
 * commodity names actually present for Maharashtra so this table can be corrected.
 */

export const COMMODITIES: Record<string, string[]> = {
  onion: ["Onion"],
  tomato: ["Tomato"],
  soybean: ["Soyabean", "Soybean"],
  cotton: ["Cotton"],
  tur: ["Arhar (Tur/Red Gram)(Whole)", "Arhar(Tur/Red Gram)(Whole)", "Arhar (Tur/Red Gram)"],
  chana: ["Bengal Gram(Gram)(Whole)", "Bengal Gram (Gram)(Whole)", "Gram"],
  jowar: ["Jowar(Sorghum)", "Jowar (Sorghum)"],
  pomegranate: ["Pomegranate"],
  turmeric: ["Turmeric", "Turmeric (raw)"],
  marigold: ["Marigold(Calcutta)", "Marigold(loose)", "Marigold"],
};

/** API variety text → our typeCode; anything else stays as the raw text under "other" */
const VARIETY_TO_TYPE: Record<string, Record<string, string>> = {
  tomato: { hybrid: "tomato.hybrid", local: "tomato.gavthi", deshi: "tomato.gavthi" },
  tur: { red: "tur.lal", white: "tur.pandhari" },
  chana: { "chafa": "chana.chafa", "kabuli": "chana.katya", red: "chana.lal", hybrid: "chana.sankarit" },
  jowar: { maldandi: "jowar.maldandi", hybrid: "jowar.hybrid", "talki": "jowar.talki", white: "jowar.pandhari" },
  turmeric: { rajapuri: "turmeric.rajapuri", local: "turmeric.rajapuri" },
  marigold: { yellow: "marigold.pivla", orange: "marigold.keshri" },
};

export function typeFromVariety(cropId: string, variety: string): string | undefined {
  const v = variety.trim().toLowerCase();
  const map = VARIETY_TO_TYPE[cropId];
  if (!map) return undefined;
  const key = Object.keys(map).find((k) => v.includes(k));
  return key ? map[key] : undefined;
}
