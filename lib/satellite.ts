/** Shapes shared by the satellite analysis screens, and the colour scale for its heatmap. */
import { bi, type Bi } from "./i18n";

export type IndexId = "ndvi" | "evi" | "savi" | "ndmi" | "ndwi" | "cvi";

export type PolygonGeometry = { type: "Polygon"; coordinates: number[][][] };

export type SampleFeature = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: Partial<Record<IndexId | "gndvi", number>>;
};

export type IndexStats = { min: number | null; max: number | null; mean: number | null; std: number | null };

export type AnalysisResult = {
  type: "FeatureCollection";
  features: SampleFeature[];
  farm_summary: {
    field_name: string;
    area_hectares: number;
    sample_count: number;
    sample_scale_m: number;
    scene_count: number;
    date_from: string;
    date_to: string;
    indices: Record<IndexId | "gndvi", IndexStats>;
  };
  farm_boundary: PolygonGeometry;
};

export type ClearDate = { date: string; cloud_cover: number };

/**
 * NDVI, EVI, SAVI and CVI use the colour bands directly. NDMI and NDWI sit on a different natural
 * range (NDWI over healthy crops is usually negative), so `domain` stretches them onto the same
 * scale; otherwise every green field would look red and "stressed".
 */
export const INDICES: { id: IndexId; name: string; about: Bi; domain: [number, number] }[] = [
  { id: "ndvi", name: "NDVI", about: bi("Crop greenness", "पिकाचा हिरवेपणा"), domain: [0, 0.8] },
  { id: "evi", name: "EVI", about: bi("Greenness in dense crops", "दाट पिकातील हिरवेपणा"), domain: [0, 0.8] },
  { id: "savi", name: "SAVI", about: bi("Greenness where soil shows", "माती दिसणाऱ्या शेतातील हिरवेपणा"), domain: [0, 0.8] },
  { id: "ndmi", name: "NDMI", about: bi("Moisture in the crop", "पिकातील ओलावा"), domain: [-0.2, 0.4] },
  { id: "ndwi", name: "NDWI", about: bi("Water at the surface", "पृष्ठभागावरील पाणी"), domain: [-0.7, 0.1] },
  { id: "cvi", name: "CVI", about: bi("Overall crop vigour", "पिकाचा एकूण जोम"), domain: [0, 0.8] },
];

export const indexInfo = (id: IndexId) => INDICES.find((x) => x.id === id)!;

const RAMP: { at: number; rgb: [number, number, number] }[] = [
  { at: 0.1, rgb: [225, 29, 72] }, // #e11d48 low or stressed
  { at: 0.3, rgb: [245, 158, 11] }, // #f59e0b moderate or emerging
  { at: 0.5, rgb: [132, 204, 22] }, // #84cc16 good vegetation
  { at: 0.7, rgb: [5, 150, 105] }, // #059669 dense, healthy canopy
];

/** Colour for a position on the 0–0.8 scale, blended smoothly between the bands. */
function rampColor(position: number): [number, number, number] {
  if (position <= RAMP[0].at) return RAMP[0].rgb;
  for (let i = 1; i < RAMP.length; i++) {
    if (position <= RAMP[i].at) {
      const a = RAMP[i - 1];
      const b = RAMP[i];
      const t = (position - a.at) / (b.at - a.at);
      return [0, 1, 2].map((c) => Math.round(a.rgb[c] + (b.rgb[c] - a.rgb[c]) * t)) as [number, number, number];
    }
  }
  return RAMP[RAMP.length - 1].rgb;
}

/** Where a value sits on the 0–0.8 colour scale for this index. */
function toPosition(id: IndexId, value: number) {
  const [lo, hi] = indexInfo(id).domain;
  return ((value - lo) / (hi - lo)) * 0.8;
}

export function colorFor(id: IndexId, value: number) {
  return rampColor(toPosition(id, value));
}

/** The four bands, with the index values each one covers, for the legend. */
export function legendFor(id: IndexId): { color: string; label: string; meaning: Bi }[] {
  const [lo, hi] = indexInfo(id).domain;
  const at = (position: number) => (lo + (position / 0.8) * (hi - lo)).toFixed(2);
  const low = id === "ndwi" ? bi("Dry", "कोरडे") : id === "ndmi" ? bi("Low moisture", "कमी ओलावा") : bi("Low or stressed", "कमी किंवा ताणलेले");
  const mid = id === "ndwi" || id === "ndmi" ? bi("Moderate", "मध्यम") : bi("Emerging", "वाढणारे");
  const good = id === "ndwi" || id === "ndmi" ? bi("Good moisture", "चांगला ओलावा") : bi("Good", "चांगले");
  const top = id === "ndwi" ? bi("Very wet", "खूप ओले") : id === "ndmi" ? bi("High moisture", "जास्त ओलावा") : bi("Dense, healthy", "दाट, निरोगी");
  return [
    { color: "#e11d48", label: `< ${at(0.2)}`, meaning: low },
    { color: "#f59e0b", label: `${at(0.2)} – ${at(0.4)}`, meaning: mid },
    { color: "#84cc16", label: `${at(0.4)} – ${at(0.6)}`, meaning: good },
    { color: "#059669", label: `> ${at(0.6)}`, meaning: top },
  ];
}

/** Every ring has at least 3 corners and every position is a real longitude and latitude. */
function isUsablePolygon(rings: unknown): rings is number[][][] {
  return (
    Array.isArray(rings) &&
    rings.length > 0 &&
    rings.every(
      (ring) =>
        Array.isArray(ring) &&
        ring.length >= 3 &&
        ring.every((p) => Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1]) && Math.abs(p[0]) <= 180 && Math.abs(p[1]) <= 90),
    )
  );
}

/** Read an uploaded GeoJSON file into one polygon. Returns null if it doesn't hold exactly one usable one. */
export function polygonFromGeoJson(data: unknown): { polygon: PolygonGeometry; name?: string } | null {
  const node = data as { type?: string; coordinates?: unknown; geometry?: unknown; features?: unknown[]; properties?: { name?: unknown } } | null;
  if (!node || typeof node !== "object") return null;
  if (node.type === "FeatureCollection") {
    const features = Array.isArray(node.features) ? node.features : [];
    return features.length === 1 ? polygonFromGeoJson(features[0]) : null;
  }
  if (node.type === "Feature") {
    const inner = polygonFromGeoJson(node.geometry);
    const name = node.properties?.name;
    return inner && typeof name === "string" && name.trim() ? { ...inner, name: name.trim().slice(0, 80) } : inner;
  }
  if (node.type === "MultiPolygon" && Array.isArray(node.coordinates) && node.coordinates.length === 1 && isUsablePolygon(node.coordinates[0])) {
    return { polygon: { type: "Polygon", coordinates: node.coordinates[0] } };
  }
  if (node.type === "Polygon" && isUsablePolygon(node.coordinates)) {
    return { polygon: { type: "Polygon", coordinates: node.coordinates } };
  }
  return null;
}

const FAILURES: Record<string, Bi> = {
  not_polygon: bi("The field boundary must be a single polygon.", "शेताची सीमा एकच बहुभुज असावी."),
  invalid_polygon: bi("That boundary isn’t valid. Draw it again.", "ही सीमा योग्य नाही. पुन्हा काढा."),
  too_many_vertices: bi("That boundary has too many points. Use a simpler outline.", "या सीमेत खूप बिंदू आहेत. सोपी सीमा वापरा."),
  self_intersecting: bi("The boundary crosses itself. Draw it again.", "सीमा स्वतःला ओलांडते. पुन्हा काढा."),
  field_too_large: bi("This field is too large. Draw an area under 200 hectares.", "हे शेत खूप मोठे आहे. 200 हेक्टरपेक्षा कमी क्षेत्र काढा."),
  no_imagery: bi("No satellite images of this field in the last 90 days.", "गेल्या 90 दिवसांत या शेताची उपग्रह छायाचित्रे नाहीत."),
  no_clear_pixels: bi(
    "No clear view of this field in the last 90 days, or it’s too small to measure.",
    "गेल्या 90 दिवसांत या शेताचे स्वच्छ दृश्य मिळाले नाही, किंवा ते मोजण्यासाठी खूप लहान आहे.",
  ),
  earth_engine_unavailable: bi("Couldn’t connect to Earth Engine. Try again shortly.", "अर्थ इंजिनशी जोडणी झाली नाही. थोड्या वेळाने पुन्हा प्रयत्न करा."),
  earth_engine_error: bi("Earth Engine couldn’t finish this analysis. Try again.", "अर्थ इंजिन हे विश्लेषण पूर्ण करू शकले नाही. पुन्हा प्रयत्न करा."),
};

export const SERVICE_DOWN = bi("The satellite service isn’t reachable right now. Try again shortly.", "उपग्रह सेवा सध्या उपलब्ध नाही. थोड्या वेळाने पुन्हा प्रयत्न करा.");

/** A failure shown to the farmer; `retry` means trying the same field again could work. */
export type SatelliteProblem = Bi & { retry?: boolean; code?: string };

const TEMPORARY = new Set(["earth_engine_unavailable", "earth_engine_error"]);

/** Call the satellite service. Throws a bilingual message the screen can show as is. */
export async function satelliteRequest<T>(path: "analyze" | "analyze-dates", body: unknown, signal: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/satellite/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw { ...SERVICE_DOWN, retry: true } satisfies SatelliteProblem;
  }
  const json = await res.json().catch(() => null);
  if (!res.ok || !json) {
    const code = json?.detail?.code;
    const known = FAILURES[code];
    throw (known ? { ...known, retry: TEMPORARY.has(code), code } : { ...SERVICE_DOWN, retry: true }) satisfies SatelliteProblem;
  }
  return json as T;
}
