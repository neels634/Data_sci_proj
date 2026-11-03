"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Loader2,
  PhoneCall,
  RefreshCw,
  Sparkles,
  Square,
  Sun,
  Volume2,
  X,
  ZoomIn,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useSpeech, stopSpeech } from "@/lib/speech";
import { SpeakButton } from "@/components/speech";
import CropCheckFields from "@/components/satellite/CropCheckFields";
import { Card, Badge, PageHeader, Button, DemoBadge, cx } from "@/components/ui";

const CROP_TRANSLATIONS: Record<string, { en: string; mr: string }> = {
  Tomato: { en: "Tomato", mr: "टोमॅटो" },
  Corn: { en: "Corn / Maize", mr: "मका" },
  Maize: { en: "Maize", mr: "मका" },
  Potato: { en: "Potato", mr: "बटाटा" },
  Grape: { en: "Grape", mr: "द्राक्ष" },
  Pepper: { en: "Bell Pepper / Chilli", mr: "मिरची / ढोबळी मिरची" },
  Apple: { en: "Apple", mr: "सफरचंद" },
  Soybean: { en: "Soybean", mr: "सोयाबीन" },
  Cotton: { en: "Cotton", mr: "कापूस" },
  Onion: { en: "Onion", mr: "कांदा" },
  Sugarcane: { en: "Sugarcane", mr: "ऊस" },
  Peach: { en: "Peach", mr: "पीच" },
  Orange: { en: "Orange / Citrus", mr: "संत्री / मोसंबी" },
  Cherry: { en: "Cherry", mr: "चेरी" },
  Strawberry: { en: "Strawberry", mr: "स्ट्रॉबेरी" },
  Squash: { en: "Squash / Pumpkin", mr: "भोपळा" },
  Blueberry: { en: "Blueberry", mr: "ब्लूबेरी" },
  Raspberry: { en: "Raspberry", mr: "रास्पबेरी" },
};

/** The 14 crops supported by the MobileNetV2 38-class plant disease model */
const SUPPORTED_MODEL_CROPS = [
  "Apple",
  "Blueberry",
  "Cherry",
  "Corn",
  "Grape",
  "Orange",
  "Peach",
  "Pepper",
  "Potato",
  "Raspberry",
  "Soybean",
  "Squash",
  "Strawberry",
  "Tomato",
];

function isCropSupported(plant: string): boolean {
  const p = plant.toLowerCase();
  return SUPPORTED_MODEL_CROPS.some(
    (c) => p.includes(c.toLowerCase()) || (c === "Corn" && p.includes("maize"))
  );
}

function translatePlant(plant: string, lang: "en" | "mr"): string {
  const match = Object.entries(CROP_TRANSLATIONS).find(
    ([k]) => k.toLowerCase() === plant.toLowerCase()
  );
  if (match) return lang === "mr" ? match[1].mr : match[1].en;
  return plant;
}

function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode failed"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        const maxDim = 1024;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

interface DiagnosisResult {
  plant: string;
  disease: string;
  severity: "low" | "medium" | "high";
  confidence: number;
  explanation: { en: string; mr: string };
  cultural: { en: string; mr: string } | null;
  chemical: { en: string; mr: string } | null;
  preventive: { en: string; mr: string } | null;
  verifiedSource?: string;
  isUncertain?: boolean;
  isCropMismatch?: boolean;
  unsupportedCrop?: boolean;
}

export default function CropCheckPage() {
  const { state, l, toast } = useStore();
  const lang = state.lang === "mr" ? "mr" : "en";

  // Slot 0: Primary Leaf Close-up (Sent to model)
  // Slot 1: Optional Whole Plant / Context (Saved for records)
  const [photos, setPhotos] = useState<(string | null)[]>([null, null]);
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [apiError, setApiError] = useState<{ title: string; detail: string } | null>(null);
  const { speak: sayText, speakingId } = useSpeech();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // The model takes 1 leaf image, so exactly 1 photo is required to submit
  const hasPrimaryPhoto = Boolean(photos[0]);
  const canSubmit = hasPrimaryPhoto && !analyzing;

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handlePhotoUpload = useCallback(async (index: number, file?: File) => {
    if (!file) return;
    try {
      const b64 = await compressImageFile(file);
      setPhotos((prev) => {
        const next = [...prev];
        next[index] = b64;
        return next;
      });
      setResult(null);
      setApiError(null);
    } catch {
      toast(l("Failed to process photo. Please try again.", "फोटो लोड करता आला नाही. कृपया पुन्हा प्रयत्न करा."));
    }
  }, [l, toast]);

  const loadDemoSet = async (cropType: "tomato" | "maize") => {
    setApiError(null);
    setResult(null);
    if (cropType === "tomato") {
      setPhotos([
        "/demo-images/tomato-leaf-disease.jpg",
        "/demo-images/farm-overview-1.jpg",
      ]);
      toast(l("Loaded sample Tomato photos! Tap 'Check My Crop' to run AI analysis.", "टोमॅटोचे नमुना फोटो लोड झाले! 'माझे पीक तपासा' वर टॅप करा."));
    } else {
      setPhotos([
        "/demo-images/maize-leaf-disease.jpg",
        "/demo-images/farm-overview-2.jpg",
      ]);
      toast(l("Loaded sample Maize photos! Tap 'Check My Crop' to run AI analysis.", "मक्याचे नमुना फोटो लोड झाले! 'माझे पीक तपासा' वर टॅप करा."));
    }
  };

  const guideSpeechText =
    lang === "mr"
      ? "फोटो काढण्यासाठी सोप्या पायऱ्या: १. दिवसाच्या सूर्यप्रकाशात फोटो काढा. २. रोगट पान मध्यभागी ठेवून १० ते १५ सेंटीमीटर अंतरावरून स्पष्ट जवळचा फोटो घ्या. पानावरील डाग स्पष्ट दिसले पाहिजेत."
      : "How to take a photo for crop check: Step 1. Take a clear close-up photo in natural daylight. Step 2. Keep the affected leaf in the center, about 10 to 15 centimeters away, ensuring the disease spots are in sharp focus.";

  const diagnosisSpeechText = useCallback(() => {
    if (!result) return "";
    const plantName = translatePlant(result.plant, lang);

    if (result.isUncertain || result.unsupportedCrop) {
      return lang === "mr" ? result.explanation.mr : result.explanation.en;
    }

    return lang === "mr"
      ? `पीक: ${plantName}. रोग: ${result.disease}. तीव्रता: ${
          result.severity === "high"
            ? "गंभीर"
            : result.severity === "medium"
            ? "मध्यम"
            : "कमी"
        }. ${result.explanation.mr}. ${
          result.cultural ? `उपाय: ${result.cultural.mr}.` : ""
        } ${result.chemical ? `${result.chemical.mr}.` : ""}`
      : `Crop: ${plantName}. Diagnosis: ${result.disease}. Severity: ${result.severity}. ${result.explanation.en}. ${
          result.cultural ? `Actions: ${result.cultural.en}.` : ""
        } ${result.chemical ? `${result.chemical.en}.` : ""}`;
  }, [result, lang]);

  const runDiagnosis = async () => {
    if (!hasPrimaryPhoto) {
      toast(
        l(
          "Please add a close-up photo of the affected leaf.",
          "कृपया बाधित पानाचा स्पष्ट जवळून फोटो जोडा."
        )
      );
      return;
    }

    setAnalyzing(true);
    setApiError(null);
    setResult(null);

    try {
      const primaryPhoto = photos[0];
      if (!primaryPhoto) throw new Error("No leaf image provided");

      let imageBlob: Blob;
      if (primaryPhoto.startsWith("data:")) {
        const [header, b64] = primaryPhoto.split(",");
        const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
        const byteChars = atob(b64);
        const byteArr = new Uint8Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          byteArr[i] = byteChars.charCodeAt(i);
        }
        imageBlob = new Blob([byteArr], { type: mime });
      } else {
        const res = await fetch(primaryPhoto);
        imageBlob = await res.blob();
      }

      const formData = new FormData();
      formData.append("image", imageBlob, "crop_leaf.jpg");

      // Connect to local ONNX FastAPI backend (MobileNetV2 38-class model)
      const res = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server status ${res.status}`);
      }

      const data = await res.json();
      const top = data.top_prediction || (data.predictions && data.predictions[0]);

      if (!top) {
        throw new Error("No prediction returned from model");
      }

      const rawPlant = top.plant || "Crop";
      const confidence = top.confidence ?? 0;

      // ── 1. Explicit Crop Mismatch Check ─────────────────────────────────────
      if (data.crop_mismatch) {
        setResult({
          plant: data.selected_crop || rawPlant,
          disease: l("Crop Mismatch Detected", "निवडलेले पीक व फोटोमध्ये तफावत"),
          severity: "low",
          confidence,
          isCropMismatch: true,
          isUncertain: true,
          explanation: {
            en: `The uploaded leaf features most closely resemble ${data.detected_crop || "a different species"}, but ${data.selected_crop || "another crop"} was selected. The prototype classifier cannot provide a reliable screening when crop species conflict. Please confirm your crop or retake a clear leaf photo.`,
            mr: `अपलोड केलेले पान ${translatePlant(data.detected_crop || "", "mr")} सारखे दिसते, परंतु आपण ${translatePlant(data.selected_crop || "", "mr")} निवडले आहे. पीक प्रकार जुळत नसल्यामुळे मॉडेल खात्रीशीर तपासणी करू शकत नाही. कृपया पीक तपासा किंवा स्वच्छ फोटो पुन्हा काढा.`,
          },
          cultural: null,
          chemical: null,
          preventive: null,
        });
        toast(l("Crop mismatch detected.", "पीक प्रकार जुळत नाही."));
        return;
      }

      // ── 2. Unsupported Crop check ───────────────────────────────────────────
      if (!isCropSupported(rawPlant)) {
        setResult({
          plant: rawPlant,
          disease: l("Unsupported Crop Type", "असमर्थित पीक प्रकार"),
          severity: "low",
          confidence,
          unsupportedCrop: true,
          explanation: {
            en: `The prototype model detected this as ${rawPlant}. This local model is only trained for 14 specific crops (${SUPPORTED_MODEL_CROPS.slice(0, 7).join(", ")}, etc.). For crops like onion, sugarcane, or cotton, please consult a local agriculture officer.`,
            mr: `AI मॉडेलने हे पीक ${translatePlant(rawPlant, "mr")} म्हणून ओळखले. हे स्थानिक मॉडेल फक्त १४ ठराविक पिकांसाठी प्रशिक्षित आहे. इतर पिकांसाठी (कांदा, कापूस, ऊस इ.) कृपया स्थानिक कृषी अधिकाऱ्यांशी संपर्क साधा.`,
          },
          cultural: null,
          chemical: null,
          preventive: null,
        });
        toast(l("Unsupported crop detected.", "या पिकासाठी AI मॉडेल उपलब्ध नाही."));
        return;
      }

      // ── 3. Low Confidence / Uncertainty Check ────────────────────────────────
      if (confidence < 0.60 || data.uncertainty_detected) {
        setResult({
          plant: rawPlant,
          disease: l("Cannot Identify with Confidence", "खात्रीशीर निदान करता आले नाही"),
          severity: "low",
          confidence,
          isUncertain: true,
          explanation: {
            en: `The prototype model confidence score is ${Math.round(confidence * 100)}% (below demonstration threshold). Note: this score reflects model output probability and is not a calibrated probability of correctness. Please retake a sharp, well-lit close-up in natural daylight or consult a local Krishi Kendra.`,
            mr: `AI मॉडेलचा विश्वास गुणांक ${Math.round(confidence * 100)}% आहे (डेमो निकषापेक्षा कमी). हा केवळ मॉडेलचा संभाव्यता गुणांक असून प्रत्यक्ष अचूकतेची खात्री नाही. कृपया चांगल्या उजेडात स्पष्ट फोटो पुन्हा काढा किंवा स्थानिक कृषी केंद्राचा सल्ला घ्या.`,
          },
          cultural: null,
          chemical: null,
          preventive: null,
        });
        toast(l("Low confidence. Retake photo or ask an expert.", "खात्रीशीर निदान झाले नाही. कृपया पुन्हा फोटो काढा."));
        return;
      }

      const isHealthy =
        top.disease.toLowerCase() === "none" ||
        top.disease.toLowerCase() === "healthy";
      const cleanDisease = isHealthy
        ? l("Healthy Foliage (No Disease Detected)", "निरोगी झाड (कोणताही रोग नाही)")
        : top.disease.replace(/_/g, " ");

      // ── 4. Verified Treatment Text only ────────────────────────────────────
      const hasVerifiedTreatment = Boolean(top.treatment?.cultural || top.treatment?.chemical);
      const culturalEn = top.treatment?.cultural || null;
      const chemicalEn = top.treatment?.chemical || null;
      const preventiveEn = top.treatment?.preventive || null;

      const culturalMr = top.treatment?.cultural_mr || top.treatment?.cultural || null;
      const chemicalMr = top.treatment?.chemical_mr || top.treatment?.chemical || null;
      const preventiveMr = top.treatment?.preventive_mr || top.treatment?.preventive || null;

      setResult({
        plant: rawPlant,
        disease: cleanDisease,
        severity:
          top.severity === "high"
            ? "high"
            : top.severity === "medium"
            ? "medium"
            : "low",
        confidence,
        explanation: {
          en:
            top.causes ||
            `Visual pattern matches ${cleanDisease} with ${(confidence * 100).toFixed(1)}% prototype model confidence score. This is an uncalibrated classifier probability, not a definitive laboratory diagnosis.`,
          mr:
            `पानाच्या प्राथमिक तपासणीवरून मॉडेलचा विश्वास गुणांक ${(confidence * 100).toFixed(1)}% आहे ('${cleanDisease}'). हे प्राथमिक मॉडेल अनुमान असून अधिकृत प्रयोगशाळा चाचणी नाही.`,
        },
        cultural: culturalEn ? { en: culturalEn, mr: culturalMr || culturalEn } : null,
        chemical: chemicalEn ? { en: chemicalEn, mr: chemicalMr || chemicalEn } : null,
        preventive: preventiveEn ? { en: preventiveEn, mr: preventiveMr || preventiveEn } : null,
        verifiedSource: hasVerifiedTreatment ? "Verified project disease guide (disease_config.json)" : undefined,
      });

      toast(l("AI leaf diagnosis completed!", "पानाची AI तपासणी यशस्वीरित्या पूर्ण झाली!"));
    } catch (err: unknown) {
      console.warn("Backend API unavailable or error:", err);
      // Honest error reporting — NEVER fabricate a diagnosis
      const msg = err instanceof Error ? err.message : String(err);
      setApiError({
        title: l("AI Diagnosis Service Unavailable", "AI निदान सेवा उपलब्ध नाही"),
        detail: l(
          `Could not connect to the local disease detection model (${msg}). Please verify the local backend server is running on port 8000, or consult your local agriculture officer directly.`,
          `स्थानिक पीक निदान मॉडेलशी संपर्क होऊ शकला नाही (${msg}). स्थानिक बॅकएंड सर्व्हर (port 8000) सुरू असल्याची खात्री करा किंवा स्थानिक कृषी अधिकाऱ्यांशी थेट संपर्क साधा.`
        ),
      });
      setResult(null);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 pb-16">
      <PageHeader
        back="/home"
        title={l("Crop Disease Check", "पीक रोग तपासणी")}
        sub={l(
          "Take 1 clear close-up leaf photo for AI diagnosis. Optional second photo for your records.",
          "AI निदानासाठी बाधित पानाचा १ स्पष्ट फोटो काढा. नोंदीसाठी दुसरा ऐच्छिक फोटो जोडू शकता."
        )}
      />

      {/* Satellite farm analysis */}
      <CropCheckFields />

      {/* Guide Banner */}
      <div className="flex items-center justify-between rounded-2xl border border-leaf-700/30 bg-leaf-50 p-3.5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-leaf-700 text-white shadow-sm">
            <Lightbulb size={20} />
          </span>
          <div>
            <p className="text-sm font-bold text-leaf-950">
              {l("Photo Guidelines", "फोटो काढण्याचे मार्गदर्शन")}
            </p>
            <p className="text-xs text-leaf-800">
              {l("Best results with natural daylight & sharp focus", "सूर्यप्रकाशात व स्पष्ट फोकसने सर्वोत्तम परिणाम मिळतात")}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowHelpGuide(true)}
          className="flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-leaf-700 border border-leaf-700/30 shadow-sm transition hover:bg-leaf-100"
        >
          <HelpCircle size={15} />
          <span>{l("Photo Guide", "मार्गदर्शन")}</span>
        </button>
      </div>

      {/* Photo Capture Section */}
      <Card className="p-4 sm:p-5">
        <div className="border-b border-line pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink">
                {l("Crop Photos", "पिकाचे फोटो")}
              </h2>
              <p className="text-xs text-muted">
                {l(
                  "The AI model inspects 1 close-up leaf photo.",
                  "AI मॉडेल १ जवळच्या पानाचे विश्लेषण करते."
                )}
              </p>
            </div>
            <SpeakButton
              id="crop-check-guide"
              text={guideSpeechText}
              size="sm"
              label={l("Listen to instructions", "सूचना ऐका")}
            />
          </div>
        </div>

        {/* 1-Tap Quick Sample Fill with visible DemoBadge */}
        <div className="mt-3 rounded-xl bg-sand/60 p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-muted">
              {l("Test with sample photos:", "नमुना फोटोंसह तपासा:")}
            </span>
            <DemoBadge />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => loadDemoSet("tomato")}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-line bg-white py-1.5 px-2 text-xs font-semibold text-leaf-900 shadow-sm hover:bg-leaf-50 transition"
            >
              <span>🍅</span>
              <span>{l("Tomato Leaf Sample", "टोमॅटो पान नमुना")}</span>
            </button>
            <button
              type="button"
              onClick={() => loadDemoSet("maize")}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-line bg-white py-1.5 px-2 text-xs font-semibold text-leaf-900 shadow-sm hover:bg-leaf-50 transition"
            >
              <span>🌽</span>
              <span>{l("Maize Leaf Sample", "मका पान नमुना")}</span>
            </button>
          </div>
        </div>

        {/* 2 Honest Slots: 1 Required (Leaf Close-up), 1 Optional (Context) */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Slot 0: Primary Leaf Close-up (Required) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink flex items-center gap-1">
                <span>📷</span>
                <span>{l("1. Leaf Close-up", "१. पानाचा जवळून फोटो")}</span>
              </span>
              <span className="text-[11px] font-bold text-soil">{l("Required for AI", "AI साठी आवश्यक")}</span>
            </div>

            <div
              onClick={() => inputRefs.current[0]?.click()}
              className={cx(
                "relative flex aspect-video sm:aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 p-2 text-center transition overflow-hidden active:scale-[0.98]",
                photos[0]
                  ? "border-leaf-700 bg-white shadow-sm"
                  : "border-dashed border-leaf-700/40 bg-leaf-50/40 hover:border-leaf-700 hover:bg-leaf-50"
              )}
            >
              {photos[0] ? (
                <>
                  <img src={photos[0]!} alt="Leaf closeup" className="absolute inset-0 size-full object-cover" />
                  <span className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-white text-leaf-700 shadow">
                    <CheckCircle2 size={16} />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 bg-black/65 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                    {l("Tap to change photo", "फोटो बदलण्यासाठी टॅप करा")}
                  </span>
                </>
              ) : (
                <>
                  <span className="grid size-12 place-items-center rounded-full bg-leaf-100 text-leaf-700 mb-1.5 shadow-xs">
                    <Camera size={24} />
                  </span>
                  <span className="text-xs font-bold text-ink leading-tight">
                    {l("Tap to take leaf photo", "पानाचा फोटो काढण्यासाठी टॅप करा")}
                  </span>
                  <span className="text-[10px] text-muted mt-0.5">
                    {l("Center the symptom 10-15 cm away", "रोगट भाग १०-१५ सेमी अंतरावर ठेवा")}
                  </span>
                </>
              )}
              <input
                ref={(el) => { inputRefs.current[0] = el; }}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  handlePhotoUpload(0, e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </div>
          </div>

          {/* Slot 1: Whole Plant / Context (Optional) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted flex items-center gap-1">
                <span>🌱</span>
                <span>{l("2. Whole Plant View", "२. संपूर्ण झाडाचा फोटो")}</span>
              </span>
              <span className="text-[11px] font-semibold text-muted">{l("Optional (Records)", "पर्यायी (नोंदीसाठी)")}</span>
            </div>

            <div
              onClick={() => inputRefs.current[1]?.click()}
              className={cx(
                "relative flex aspect-video sm:aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 p-2 text-center transition overflow-hidden active:scale-[0.98]",
                photos[1]
                  ? "border-leaf-700 bg-white shadow-sm"
                  : "border-dashed border-line bg-cream/50 hover:bg-cream"
              )}
            >
              {photos[1] ? (
                <>
                  <img src={photos[1]!} alt="Whole plant" className="absolute inset-0 size-full object-cover" />
                  <span className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-white text-leaf-700 shadow">
                    <CheckCircle2 size={16} />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 bg-black/65 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                    {l("Tap to change photo", "फोटो बदलण्यासाठी टॅप करा")}
                  </span>
                </>
              ) : (
                <>
                  <span className="grid size-12 place-items-center rounded-full bg-sand text-muted mb-1.5 shadow-xs">
                    <Camera size={24} />
                  </span>
                  <span className="text-xs font-bold text-ink leading-tight">
                    {l("Add whole plant (optional)", "संपूर्ण झाडाचा फोटो (पर्यायी)")}
                  </span>
                  <span className="text-[10px] text-muted mt-0.5">
                    {l("Context for your record keeping", "तुमच्या वैयक्तिक नोंदीसाठी")}
                  </span>
                </>
              )}
              <input
                ref={(el) => { inputRefs.current[1] = el; }}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  handlePhotoUpload(1, e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </div>
          </div>
        </div>

        {/* Submit Action Button */}
        <Button
          full
          disabled={!canSubmit}
          onClick={runDiagnosis}
          className={cx(
            "mt-5 min-h-14 text-base shadow-sm transition",
            !canSubmit && "opacity-60 cursor-not-allowed"
          )}
        >
          {analyzing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>{l("Analyzing Leaf with AI Model...", "AI मॉडेलद्वारे पान तपासत आहे...")}</span>
            </>
          ) : canSubmit ? (
            <>
              <Sparkles size={20} />
              <span>{l("Check My Crop (Analyze Leaf)", "माझे पीक तपासा (पान तपासा)")}</span>
            </>
          ) : (
            <span>{l("Add 1 leaf photo to check crop", "तपासण्यासाठी पानाचा १ फोटो जोडा")}</span>
          )}
        </Button>
      </Card>

      {/* Honest Error State Card (When Backend API fails) */}
      {apiError && (
        <Card className="border-soil/50 bg-soil-100/30 p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-soil text-white">
              <AlertCircle size={22} />
            </span>
            <div className="flex-1">
              <h3 className="text-base font-bold text-soil">{apiError.title}</h3>
              <p className="mt-1 text-sm text-ink/90 leading-relaxed">{apiError.detail}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={runDiagnosis}
                  className="min-h-10 text-xs"
                >
                  <RefreshCw size={14} />
                  <span>{l("Retry Connection", "पुन्हा प्रयत्न करा")}</span>
                </Button>
                <Link
                  href="/ask"
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-leaf-700 px-3 text-xs font-bold text-white hover:bg-leaf-800 transition"
                >
                  <PhoneCall size={14} />
                  <span>{l("Consult Krishi Mitra", "कृषी मित्राशी चर्चा करा")}</span>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Diagnosis Results Section */}
      {result && (
        <div className="flex flex-col space-y-3 pt-2">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="green">{translatePlant(result.plant, lang)}</Badge>

                  {result.isUncertain ? (
                    <Badge tone="gold">{l("Low Confidence", "कमी अचूकता")}</Badge>
                  ) : result.unsupportedCrop ? (
                    <Badge tone="soil">{l("Unsupported", "असमर्थित")}</Badge>
                  ) : (
                    <Badge
                      tone={
                        result.severity === "high"
                          ? "soil"
                          : result.severity === "medium"
                          ? "gold"
                          : "green"
                      }
                    >
                      {result.severity === "high"
                        ? l("High Severity", "गंभीर तीव्रता")
                        : result.severity === "medium"
                        ? l("Moderate Severity", "मध्यम तीव्रता")
                        : l("Low / Healthy", "कमी / निरोगी")}
                    </Badge>
                  )}

                  <span className="text-xs font-semibold text-muted">
                    {Math.round(result.confidence * 100)}% {l("confidence", "अचूकता")}
                  </span>
                </div>

                <h2 className="mt-2 text-2xl font-bold leading-tight text-ink">
                  {result.disease}
                </h2>
              </div>

              {/* Speech Voice Button */}
              <SpeakButton
                id="diagnosis-result"
                text={diagnosisSpeechText}
                label={l("Listen to diagnosis", "निदान ऐका")}
                className="border border-line shadow-sm"
              />
            </div>

            <p className="mt-3 text-sm leading-relaxed text-ink/80">
              {lang === "mr" ? result.explanation.mr : result.explanation.en}
            </p>

            {/* If Low Confidence or Unsupported: Explicit Advisory Callout */}
            {(result.isUncertain || result.unsupportedCrop) && (
              <div className="mt-4 rounded-xl border border-gold/40 bg-gold-100/30 p-3 text-xs text-[#6b4708] leading-relaxed">
                <p className="font-bold flex items-center gap-1.5 mb-1">
                  <AlertTriangle size={15} />
                  <span>{l("Recommended Next Step:", "पुढील शिफारस:")}</span>
                </p>
                <p>
                  {l(
                    "Do not apply chemical sprays based on an uncertain reading. Consult your village Krishi Sahayak or visit the nearest Taluka Krishi Kendra with a physical sample.",
                    "अस्पष्ट निदानावरून कोणतीही रासायनिक फवारणी करू नका. स्थानिक कृषी सहाय्यक किंवा नजीकच्या कृषी केंद्रात प्रत्यक्ष पान दाखवून सल्ला घ्या."
                  )}
                </p>
              </div>
            )}

            {/* Treatment Steps: Shown ONLY if verified in project data */}
            {!result.isUncertain && !result.unsupportedCrop && (
              <div className="mt-5 space-y-3 border-t border-line pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-ink">
                    {l("Treatment & Action Plan", "उपाय व कृती योजना")}
                  </h3>
                  {result.verifiedSource ? (
                    <span className="text-[11px] font-semibold text-leaf-700">
                      ✓ {l("Verified Source", "पडताळणी झालेली माहिती")}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-muted">
                      {l("Advisory guidance", "मार्गदर्शक माहिती")}
                    </span>
                  )}
                </div>

                {result.cultural || result.chemical || result.preventive ? (
                  <div className="space-y-2">
                    {/* Cultural Care */}
                    {result.cultural && (
                      <div className="flex items-start gap-3 rounded-xl bg-leaf-50/70 p-3">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-leaf-700 text-xs font-bold text-white">
                          1
                        </span>
                        <div>
                          <p className="text-xs font-bold text-leaf-900">
                            {l("Field Sanitation & Cultural Care", "शेतातील स्वच्छता व निगा")}
                          </p>
                          <p className="text-sm text-ink/90 mt-0.5">
                            {lang === "mr" ? result.cultural.mr : result.cultural.en}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Chemical Reference (Non-prescriptive) */}
                    {result.chemical && (
                      <div className="flex items-start gap-3 rounded-xl bg-soil-100/50 p-3">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-soil text-xs font-bold text-white">
                          2
                        </span>
                        <div>
                          <p className="text-xs font-bold text-soil">
                            {l("Reference Chemical Information (Non-prescriptive)", "संदर्भ फवारणी माहिती (तज्ञांचा सल्ला आवश्यक)")}
                          </p>
                          <p className="text-sm text-ink/90 mt-0.5">
                            {lang === "mr" ? result.chemical.mr : result.chemical.en}
                          </p>
                          <p className="text-[11px] text-soil-700/80 mt-1 italic leading-tight">
                            {l(
                              "Advisory notice: Never apply chemicals based solely on an automated prototype. Consult a qualified local agriculture officer or KVK agronomist, and read the product label for authorized dosage and waiting periods.",
                              "मार्गदर्शक सूचना: केवळ डिजिटल अनुमानावरून रासायनिक फवारणी करू नका. खरेदी किंवा वापरापूर्वी कृषी अधिकारी किंवा कृषी केंद्राचा सल्ला घ्या आणि लेबलवरील सूचना वाचा."
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Preventive Care */}
                    {result.preventive && (
                      <div className="flex items-start gap-3 rounded-xl bg-sand p-3">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold text-white">
                          3
                        </span>
                        <div>
                          <p className="text-xs font-bold text-muted">
                            {l("Preventive Practice", "भविष्यातील काळजी")}
                          </p>
                          <p className="text-sm text-ink/90 mt-0.5">
                            {lang === "mr" ? result.preventive.mr : result.preventive.en}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-line bg-cream p-3 text-xs text-muted leading-relaxed">
                    <p className="font-semibold text-ink mb-1">
                      {l("No verified chemical spray in database", "डेटाबेसमध्ये विशिष्ट फवारणी नोंद नाही")}
                    </p>
                    <p>
                      {l(
                        "Please ask a local agriculture officer or Krishi Kendra for dosage specific to your soil and stage.",
                        "तुमच्या जमिनीच्या प्रकारानुसार व पीक अवस्थेनुसार अचूक मात्रा मिळवण्यासाठी स्थानिक कृषी अधिकाऱ्यांचा सल्ला घ्या."
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Action Links */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setPhotos([null, null]);
                setResult(null);
                setApiError(null);
                stopSpeech();
              }}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white font-semibold text-leaf-700 shadow-sm transition hover:bg-leaf-50"
            >
              <RefreshCw size={16} />
              <span>{l("Check Another Plant", "दुसरे पीक तपासा")}</span>
            </button>

            <Link
              href="/ask"
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-leaf-700 font-semibold text-white shadow-sm transition hover:bg-leaf-800"
            >
              <PhoneCall size={16} />
              <span>{l("Ask Krishi Mitra", "कृषी मित्राला विचारा")}</span>
            </Link>
          </div>
        </div>
      )}

      {/* How to Take Photos Help Modal */}
      {showHelpGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4 backdrop-blur-xs"
          onClick={() => setShowHelpGuide(false)}
        >
          <div
            className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-cream p-5 pb-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-leaf-700 text-white">
                  <Lightbulb size={18} />
                </span>
                <h3 className="text-lg font-bold text-ink">
                  {l("How to Take Photos", "फोटो कसा काढायचा? मार्गदर्शन")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpGuide(false)}
                className="grid size-9 place-items-center rounded-full text-muted hover:bg-line/40 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Audio Listen Button */}
            <button
              type="button"
              onClick={() => sayText("crop-guide-modal", guideSpeechText)}
              className={cx(
                "mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition",
                speakingId === "crop-guide-modal"
                  ? "bg-soil text-white animate-pulse"
                  : "bg-leaf-100 text-leaf-700 hover:bg-leaf-200"
              )}
            >
              {speakingId === "crop-guide-modal" ? <Square size={16} fill="currentColor" /> : <Volume2 size={16} />}
              <span>
                {speakingId === "crop-guide-modal"
                  ? l("Stop reading", "वाचन थांबवा")
                  : l("Listen to Photo Guide in Marathi / English", "फोटो काढण्याचे मार्गदर्शन ऐका")}
              </span>
            </button>

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5 border border-line shadow-xs">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gold-100 text-gold font-bold">
                  <Sun size={18} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-ink">
                    {l("1. Use Bright Natural Daylight", "१. सूर्यप्रकाशात फोटो काढा")}
                  </h4>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">
                    {l(
                      "Take photos outdoors during daytime. Avoid night flash or deep shadows.",
                      "दिवसाच्या चांगल्या प्रकाशात फोटो घ्या. सावलीत किंवा फ्लॅशच्या झोतात फोटो काढू नका."
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5 border border-line shadow-xs">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-leaf-100 text-leaf-700 font-bold">
                  <ZoomIn size={18} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-ink">
                    {l("2. Center the Problem Leaf (10-15 cm)", "२. पान मध्यभागी व १०-१५ सेमी अंतरावर ठेवा")}
                  </h4>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">
                    {l(
                      "Hold camera steady. Tap the screen to focus on the yellow spot, blight, or pest.",
                      "कॅमेरा स्थिर ठेवा. पानातील पिवळा किंवा काळा डाग स्पष्ट दिसेल असा फोकस करा."
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Dos and Don'ts */}
            <div className="mt-4 rounded-2xl border border-line bg-white p-3.5">
              <h4 className="text-xs font-bold text-ink mb-2">
                {l("Tips for best diagnosis:", "महत्त्वाच्या टिप्स:")}
              </h4>
              <ul className="space-y-1.5 text-xs text-muted">
                <li className="flex items-center gap-1.5 text-leaf-800 font-medium">
                  <CheckCircle2 size={14} className="text-leaf-700 shrink-0" />
                  <span>{l("Wipe camera lens clean before clicking", "फोटो काढण्यापूर्वी कॅमेरा लेन्स पुसून घ्या")}</span>
                </li>
                <li className="flex items-center gap-1.5 text-leaf-800 font-medium">
                  <CheckCircle2 size={14} className="text-leaf-700 shrink-0" />
                  <span>{l("Keep hand or finger away from the spot", "रोगाच्या डागावर बोट किंवा हात येऊ देऊ नका")}</span>
                </li>
                <li className="flex items-center gap-1.5 text-soil font-medium">
                  <X size={14} className="text-soil shrink-0" />
                  <span>{l("Avoid blurry or shaking photos", "हालणारे किंवा अस्पष्ट फोटो टाळा")}</span>
                </li>
              </ul>
            </div>

            <Button full onClick={() => setShowHelpGuide(false)} className="mt-5 min-h-12">
              {l("Understood / Got It", "समजले, फोटो काढा")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
