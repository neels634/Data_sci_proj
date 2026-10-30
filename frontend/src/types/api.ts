import type { Lang } from "./i18n";

export interface TreatmentInfo {
  chemical: string;
  cultural: string;
  preventive: string;
}

export interface PredictionResult {
  label: string;
  confidence: number;
  class_name: string;
  plant: string;
  disease: string;
  severity: string;
  severity_level: number;
  severity_color: string;
  treatment: TreatmentInfo;
  symptoms?: string[];
  causes?: string;
  urgency?: string;
  economic_impact?: string;
  timestamp?: string;
}

export interface PredictionResponse {
  mode: "ai_prediction" | "symptom_guide";
  crop: string;
  predictions: PredictionResult[];
  top_prediction: PredictionResult | null;
  confidence_level: string;
  model_info: { name: string; version: string; framework: string };
  inference_ms: number;
  timestamp: string;
  uncertainty_detected?: boolean;
  max_confidence?: number;
  guide?: any; // onion symptom guide
}

export interface CropInfo {
  key: string;
  label: string;
  label_mr: string;
  emoji: string;
  has_ai_model: boolean;
}

export interface ModelInfo {
  name: string;
  version: string;
  type: "tensorflow" | "pytorch" | "onnx";
  classes: string[];
  accuracy?: number;
  input_shape?: number[];
  description?: string;
}

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  checks: { database: boolean; ml_model: boolean; dependencies: boolean };
  info: { model: ModelInfo; uptime: number; version: string };
}

export interface ApiError {
  detail: string;
  type?: string;
  code?: string;
}
