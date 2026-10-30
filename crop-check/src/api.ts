/**
 * api.ts — Single point of contact with the backend.
 *
 * PLUG: To switch from mock to real, set USE_MOCK = false below
 *       and update API_URL to your backend.
 */

import type { Lang } from "./i18n";

// ── PLUG: Toggle mock / real here ──────────────────────────────
const USE_MOCK = true;
const API_URL = "/api/analyze"; // Change to full URL for production
// ── PLUG: Auth token hook — inject your JWT here ───────────────
// const AUTH_TOKEN = "";

export interface AnalysisResult {
  type: "disease" | "pest" | "healthy";
  name: Record<Lang, string>;
  severity: "low" | "medium" | "high";
  explanation: Record<Lang, string>;
  steps: Record<Lang, string[]>;
  confidence: number;
}

export interface AnalyzeRequest {
  images: string[]; // base64 data URIs (4 required + 1 optional)
  language: Lang;
  crop?: string;    // ── PLUG: Optional crop picker value (tomato, cotton, soybean, other)
}

/** Mock data — returned when USE_MOCK is true */
const MOCK_RESULTS: AnalysisResult[] = [
  {
    type: "disease",
    name:        { en: "Early Blight",                        hi: "आगाऊ झुलसा",              mr: "आगाऊ करपा" },
    severity: "medium",
    explanation: { en: "Fungal spots with rings on leaves.",  hi: "पत्तों पर गोल फफूंद धब्बे।", mr: "पानांवर गोलाकार बुरशीचे डाग." },
    steps: {
      en: ["Remove affected leaves", "Spray copper fungicide", "Water at the base, not on leaves", "Rotate crops next season"],
      hi: ["प्रभावित पत्ते हटाएँ", "ताँबा फफूंदनाशक छिड़कें", "जड़ में पानी दें, पत्तों पर नहीं", "अगले मौसम में फसल बदलें"],
      mr: ["प्रभावित पाने काढा", "तांब्याचे बुरशीनाशक फवारा", "मुळाशी पाणी द्या, पानांवर नाही", "पुढील हंगामात पीक फेरबदल करा"],
    },
    confidence: 0.82,
  },
  {
    type: "pest",
    name:        { en: "Aphids",                              hi: "माहू (एफिड्स)",               mr: "मावा (ॲफिड्स)" },
    severity: "low",
    explanation: { en: "Small green insects under leaves.",    hi: "पत्तों के नीचे छोटे हरे कीड़े।", mr: "पानांच्या खाली लहान हिरवे कीटक." },
    steps: {
      en: ["Spray neem oil solution", "Introduce ladybugs", "Wash leaves with water jet"],
      hi: ["नीम तेल का घोल छिड़कें", "लेडीबग छोड़ें", "पानी की धार से पत्ते धोएँ"],
      mr: ["कडुलिंब तेलाचा फवारा करा", "लेडीबग सोडा", "पाण्याच्या फवाऱ्याने पाने धुवा"],
    },
    confidence: 0.75,
  },
  {
    type: "healthy",
    name:        { en: "Healthy Plant",         hi: "स्वस्थ पौधा",        mr: "निरोगी झाड" },
    severity: "low",
    explanation: { en: "Your plant looks healthy!", hi: "आपका पौधा स्वस्थ है!", mr: "तुमचे झाड निरोगी दिसते!" },
    steps: {
      en: ["Keep watering regularly", "Watch for any changes", "Good farming practice!"],
      hi: ["नियमित पानी दें", "बदलावों पर नज़र रखें", "अच्छी खेती जारी रखें!"],
      mr: ["नियमित पाणी द्या", "बदलांवर लक्ष ठेवा", "चांगली शेती सुरू ठेवा!"],
    },
    confidence: 0.91,
  },
];

/** Send images for analysis — mock or real */
export async function analyzeCrop(req: AnalyzeRequest): Promise<AnalysisResult> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const pick = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
        resolve(pick);
      }, 1500);
    });
  }

  // ── Real API call ────────────────────────────────────────────
  const form = new FormData();
  req.images.forEach((dataUri, i) => {
    const blob = dataUriToBlob(dataUri);
    form.append(`image${i + 1}`, blob, `photo${i + 1}.jpg`);
  });
  form.append("language", req.language);
  if (req.crop) form.append("crop", req.crop);

  const res = await fetch(API_URL, {
    method: "POST",
    body: form,
    // headers: AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {},
  });

  if (!res.ok) {
    if (!navigator.onLine) throw new Error("offline");
    throw new Error("server");
  }

  return res.json();
}

function dataUriToBlob(dataUri: string): Blob {
  const [header, b64] = dataUri.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
  const bytes = atob(b64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}
