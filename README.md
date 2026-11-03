# Shet Samruddhi (शेत समृद्धी) — Prototype & Architecture Guide

A mobile-first agricultural operating system and record-keeping companion designed for smallholder farmers in Maharashtra.

## Product Promise

> "When a farmer notices crop stress, Shet Samruddhi helps them record what happened, see what area-level information is available, and share a clear case with a Mitra or the right official channel."

*Area-level signals support awareness; they do not prove plot-level damage or guarantee an insurance claim.*

---

## 1. Repository Architecture & Applications

This repository contains multiple frontend workspaces and a Python backend. Below is the verified role and status of each component:

| Directory | Framework & Port | Role & Canonical Status | Details |
|---|---|---|---|
| **`/` (Root)** | Next.js 15, React 19 (Port 3000) | **Canonical User-Facing App** | The unified bilingual (English/Marathi) mobile-first application containing onboarding, Crop Check, My Farm plots, stress timelines, Mandi Mitra, and government schemes. |
| **`backend/`** | FastAPI, Python 3.11 (Port 8000) | **Canonical AI Inference Service** | Serves the 38-class MobileNetV2 ONNX model (`backend/models/plant_disease_model.onnx`), botanical foliage validation, and onion IPM guidance. |
| **`frontend/`** | Vite, React 18 (Port 5173) | *Legacy Sub-App* | Early standalone disease classification UI. Kept for historical reference; not wired to the unified Shet Samruddhi multi-feature workflow. |
| **`crop-check/`** | Vite, React 18 (Port 5174) | *Prototype Sub-App* | Experimental multi-photo capture prototype using mock data (`USE_MOCK = true`). |

---

## 2. Crop Capabilities: AI Model vs. Farm Record vs. Educational

To avoid misleading farmers or extension officers, crop capabilities are partitioned into distinct tiers:

1. **AI Disease Classification (14 Crops):**
   - **Supported Species:** Apple, Blueberry, Cherry, Corn (Maize), Grape, Orange, Peach, Bell Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato.
   - **Model:** 38-class MobileNetV2 ONNX model (`plant_disease_model.onnx`).
   - **Crop Mismatch Protection:** If a user selects a crop (e.g. Tomato) but the model detects a different species (e.g. Corn), the backend returns an explicit crop mismatch advisory rather than forcing a 100% false diagnosis.
2. **Educational Guidance Only (No AI Model):**
   - **Onion (कांदा):** Handled via a verified IPM agronomic symptom guide (`mode: "symptom_guide"`). Does NOT execute AI inference; explicitly instructs farmers to seek physical inspection from a local Krishi Mitra.
3. **Farm-Record & Plot Management (All Crops):**
   - In **My Farm** (`/crops`), farmers can track any crop (including sugarcane, cotton, onion, and pulses) through growth stages, daily tasks, dated stress observations, and case summaries.

---

## 3. Real vs. Demo Data & Privacy Boundaries

| Capability / Module | Status | Privacy & Data Storage | Details |
|---|---|---|---|
| **AI Crop Check (`/crop-check`)** | **REAL LOCAL MODEL** | **Sent to Backend** | Uploaded leaf close-up photos are sent via HTTP POST to the local FastAPI backend (`/api/predict`). Not stored on a public server. |
| **Plot Stress Timeline (`/crops/my/[id]`)** | **REAL LOCAL DATA** | **Device LocalStorage** | Farmer observations (notes, dates, and canvas-compressed photo thumbnails) are stored strictly in browser `localStorage` (`udyamsetu-state-v5`). Photos never leave the device. |
| **Case Summary Generator** | **REAL CLIENT LOGIC** | **Device LocalStorage** | Generates copyable plain text for WhatsApp/SMS with plot metadata and chronological stress logs. Does not embed photos. |
| **Area-level Signal** | **DEMO PLACEHOLDER** | **Client State** | Visibly marked with a `<DemoBadge />`. Neutral illustrative text without numbers or color scales to prevent confusion with official survey damage indices. |
| **Mandi Mitra (`/mandi`)** | **DEMO DATA** | **Client Seed Data** | Wholesale prices, distances, and rates in `lib/market.ts` are sample figures marked as demo data. |
| **Government Schemes (`/schemes`)** | **CURATED SAMPLE DATA** | **Client Seed Data** | Summaries marked **Not yet verified** until cross-checked with official state/central gazettes. Direct links point to official portals (PM-KISAN, MahaDBT, PMFBY). |

---

## 4. Run Instructions

### 1. Start the AI Backend (FastAPI + ONNX Runtime)
```bash
cd backend
./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
```
- Health Check: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Start the Canonical Frontend (Next.js 15)
```bash
# In the repository root
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 5. Sample Accounts (PIN: `1234`)

| Role | Mobile | Name | Primary Demo Journey |
|---|---|---|---|
| **Farmer** | `9876500001` | Sunita Pawar (Navgaon) | My Farm plots, daily tasks, crop stress timeline, Crop Check |
| **Gaon Mandi Mitra** | `9876500002` | Ganesh Shinde | Produce aggregation, lot pooling, settlement summary |
| **Buyer** | `9876500003` | Krushna Agro Traders | Browse pooled lots, submit offers |
| **Admin** | `9876500004` | Meera Kulkarni | Activity overview, scheme verification |

---

## 6. Licensing & Model Card

- **Source Code License:** License not yet selected by repository contributors. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
- **Model Card & Evaluation Protocol:** See [MODEL_CARD.md](MODEL_CARD.md) for architecture specifications, known limitations, and the proposed Phase 3 evaluation protocol.
- **Safety Notice:** Diagnostic results are advisory pattern screenings and must never be treated as confirmed plant pathology diagnoses or proof for insurance claims.
