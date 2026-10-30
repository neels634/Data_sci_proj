import {
  PredictionResponse,
  CropInfo,
  ModelInfo,
  HealthStatus,
  ApiError,
} from "@/types/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl || "http://localhost:8000";
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
      });
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.detail || "Request failed");
      }
      return response.json();
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Network error occurred");
    }
  }

  /** Send an image (and optional crop key) to the prediction endpoint. */
  async predict(file: File, crop?: string): Promise<PredictionResponse> {
    const formData = new FormData();
    formData.append("image", file);
    if (crop) formData.append("crop", crop);

    const baseUrl = (this.baseUrl || API_BASE_URL).replace(/\/$/, "");
    const url = `${baseUrl}/api/predict`;

    const response = await fetch(url, { method: "POST", body: formData });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.detail || "Prediction failed");
    }

    const data = await response.json();
    console.log("API Response:", data);
    return data as PredictionResponse;
  }

  async getSupportedCrops(): Promise<{ crops: CropInfo[] }> {
    return this.request<{ crops: CropInfo[] }>("/api/crops");
  }

  async getHealth(): Promise<HealthStatus> {
    return this.request<HealthStatus>("/api/health");
  }

  async getModelInfo(): Promise<ModelInfo> {
    return this.request<ModelInfo>("/api/model/info");
  }
}

export const apiClient = new ApiClient();
export const { predict, getSupportedCrops, getHealth, getModelInfo } = apiClient;
