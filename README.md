# Shet Samruddhi (शेत समृद्धी) — Prototype & Architecture Guide

A mobile-first agricultural operating system and record-keeping companion prototype designed for smallholder farmers in Maharashtra.

## Product Promise

> "When a farmer notices crop stress, Shet Samruddhi helps them record what happened, see what area-level information is available, and share a clear case with a Mitra or the right official channel."

*Area-level signals support awareness; they do not prove plot-level damage or guarantee an insurance claim.*

---

## 1. Repository Architecture & Applications

This repository contains multiple frontend workspaces and a Python backend. Below is the verified role and status of each component:

| Directory | Framework & Port | Role & Canonical Status | Details |
|---|---|---|---|
| **`/` (Root)** | Next.js 15, React 19 (Port 3000) | **Canonical User-Facing App** | The unified bilingual (English/Marathi) mobile-first application containing onboarding, Crop Check, My Farm plots, stress timelines, Mandi Mitra, and government schemes. |
| **`backend/`** | FastAPI, Python 3.11 (Port 8000) | **Canonical AI Inference Service** | Serves the 38-class MobileNetV2 ONNX runtime, botanical foliage validation, and onion educational guidance. |
| **`frontend/`** | Vite, React 18 (Port 5173) | *Legacy Sub-App* | Standalone disease classification test UI from an earlier stage. Not wired to the unified Shet Samruddhi multi-feature workflow. |
| **`crop-check/`** | Vite, React 18 (Port 5174) | *Prototype Sub-App* | Experimental multi-photo capture prototype using mock data (`const USE_MOCK = true;` in `crop-check/src/api.ts`). |

---

## 2. Crop Capabilities: AI Model vs. Farm Record vs. Educational

To maintain product integrity, crop capabilities are partitioned into distinct tiers:

1. **AI Disease Classification (14 Crops):**
   - **Supported Species:** Apple, Blueberry, Cherry, Corn (Maize), Grape, Orange, Peach, Bell Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato.
   - **Configured Runtime:** MobileNetV2 ONNX model (`backend/models/plant_disease_model.onnx`).
   - **Crop Mismatch Defense:** If a user selects a crop (e.g. Tomato) but the model detects a different species (e.g. Corn), the backend returns an explicit crop mismatch advisory rather than forcing a 100% false diagnosis.
   - **Uncertainty Abstention:** Softmax outputs below demonstration threshold (0.40) or ambiguous foliage return an inconclusive advisory directing the user to a physical Krishi Mitra inspection.
2. **Educational Guidance Only (No AI Model):**
   - **Onion (कांदा):** Handled via an educational agronomy symptom guide (`mode: "symptom_guide"`). Does NOT execute AI inference; explicitly instructs farmers to seek laboratory or agricultural officer inspection.
3. **Farm-Record & Plot Management (All Crops):**
   - In **My Farm** (`/crops`), farmers can track any crop (including sugarcane, cotton, onion, and pulses) through growth stages, daily tasks, dated stress observations, and case summaries.

---

## 3. Real vs. Demo Data & Privacy Boundaries

| Capability / Module | Status | Privacy & Data Storage | Details |
|---|---|---|---|
| **AI Crop Check (`/crop-check`)** | **REAL LOCAL MODEL (When Present)** | **Sent to Backend** | Uploaded leaf close-up photos are sent via HTTP POST to the local FastAPI backend (`/api/predict`). Photos are not stored on a public server. |
| **Plot Stress Timeline (`/crops/my/[id]`)** | **REAL LOCAL DATA** | **Device LocalStorage** | Farmer observations (notes, dates, and canvas-compressed photo thumbnails) are stored strictly in browser `localStorage` (`udyamsetu-state-v7`). Photos never leave the device. |
| **Case Summary Generator** | **REAL CLIENT LOGIC** | **Device LocalStorage** | Generates copyable plain text for WhatsApp/SMS with plot metadata and chronological stress logs. Does not embed photos. |
| **Area-level Signal** | **DEMO PLACEHOLDER** | **Client State** | Visibly marked with a `<DemoBadge />`. Neutral illustrative text without numbers or color scales to prevent confusion with official survey damage indices. |
| **Mandi Mitra (`/mandi`)** | **DEMO DATA** | **Client Seed Data** | Wholesale prices, distances, and rates in `lib/market.ts` are sample figures marked as demo data. |
| **Government Schemes (`/schemes`)** | **CURATED SAMPLE DATA** | **Client Seed Data** | Summaries marked **Not yet verified** until cross-checked with official state/central gazettes. Direct links point to official portals (PM-KISAN, MahaDBT, PMFBY). |

---

## 4. Setup & Run Instructions (Clean Checkout)

### Note on Clean Checkout vs. Local Workspace
- In this development workspace, a local ONNX model file (`backend/models/plant_disease_model.onnx`) is present.
- In a fresh clone or clean checkout, large binary weights and archives may be excluded from version control if redistribution rights are unresolved. If the model artifact is absent, the backend reports `status: 503 (Model service unavailable)` on `/api/health` and `/api/predict`. The frontend handles this honestly by displaying a connection error card rather than fabricating diagnoses.

### A. Backend Setup (FastAPI + ONNX Runtime)

1. **Create and activate a virtual environment:**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   # Lightweight deployment dependencies (FastAPI + ONNX Runtime + Pillow)
   pip install -r requirements-deploy.txt

   # Or full ML development dependencies (including training tools):
   # pip install -r requirements.txt
   ```

3. **Provide model assets (if missing):**
   - Ensure `plant_disease_model.onnx` is placed in `backend/models/`.
   - Ensure `labels.json` is placed in `backend/`.
   - Default configuration resolves paths relative to `backend/`. You can override paths via environment variables:
     ```bash
     export MODEL_TYPE=onnx
     export MODEL_PATH=models/plant_disease_model.onnx
     export MODEL_LABELS_PATH=labels.json
     ```

4. **Start the API service:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
   - Liveness Probe: `http://localhost:8000/api/health/live` (HTTP 200 if process is running)
   - Readiness Probe: `http://localhost:8000/api/health/ready` (HTTP 200 if model loaded, HTTP 503 if unavailable)
   - Health Status: `http://localhost:8000/api/health`
   - Model Info: `http://localhost:8000/api/model/info`
   - Interactive Docs: `http://localhost:8000/docs`

### B. Frontend Setup (Next.js 15)

1. **Install dependencies and run dev server:**
   ```bash
   # From repository root
   npm install
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

---

## 5. Security & Rate Limiting Overview

- **Authentication:** By default in demo/development mode, `API_KEY` is not set (`None`), allowing open local access. If `API_KEY` is configured in `backend/.env` or the environment, all requests to `/api/predict` must supply a matching HTTP Bearer token (`Authorization: Bearer <API_KEY>`).
- **Rate Limiting:** `/api/predict` is rate-limited via SlowAPI (default: 100 requests / 60 seconds). Client identification uses `request.client.host`. Forwarded headers (`X-Forwarded-For`) are untrusted unless `BEHIND_TRUSTED_PROXY=True` is explicitly configured.
- **Scope Notice:** Basic rate limiting, CORS restrictions, and response security headers provide baseline defensive hygiene for prototyping, but do not constitute an enterprise network perimeter or production security barrier.

---

## 6. Sample Accounts (PIN: `1234`)

| Role | Mobile | Name |
| --- | --- | --- |
| Farmer | `9876500001` | Sunita Pawar (Navgaon, Pune/Satara) |
| Gaon Mandi Mitra | `9876500002` | Ganesh Shinde |
| Buyer | `9876500003` | Krushna Agro Traders |
| Admin | `9876500004` | Meera Kulkarni |

The person icon (top right) opens Home, My profile, Help, **Log out** and **Reset app data** (keeps
accounts). Every role has a Home tab, and the logo also returns to Home.

## What you can click through

| Role | Screens | Works end to end |
| --- | --- | --- |
| Farmer / entrepreneur | Welcome & profile, Home, Schemes (search, filter, detail, save, track status, ask Mitra, report), **Mandi Mitra** (home with what is waiting, a tap-only sell wizard: crop → type → grade → dry? → quantity, "don't know" always allowed, more than one grade at once; My listings by step; the Mitra's check result to accept; "I've dried it"; offers with fee breakdown, accept/decline), Business guides + cost calculator + saved plans, **My Farm** (today's tasks across crops with done/skip, my crops with stage and harvest window, add a crop in 3 steps, crop detail with timeline, activity log and spray safety warnings, Crop Library with search for 8 Maharashtra crops), My activity, Help | ✓ |
| Gaon Mandi Mitra | To check / recheck today / ready, grouped by village → quality check (grade, moisture meter, ready / needs drying / lower grade, recheck date) → pool only matching, accepted listings into a lot, lot detail with farmer-wise record and settlement summary, mark dispatched/completed, earnings | ✓ |
| Buyer | Mitra-checked lots with grade, unit and moisture, crop / type / grade filter chips, offer per lot unit, my offers | ✓ |
| Admin | Activity overview, verify / flag / archive schemes, resolve reports | ✓ |

My Farm demo: log in as the **Farmer** → Home shows **My Farm** with a task badge → open it → tick today's
irrigation task → the log sheet opens prefilled → Save → "Last irrigation: today" → open the onion crop to see
"You are here" on the timeline and the harvest window → **Crop Library** → search "कांदा" → **Grow this crop**
→ add a second onion plot. Sunita's onion and planned chana are demo data with dates relative to today.

Try this path (Mandi Mitra, see `lib/grades.ts`): log in as the **Farmer** → Mandi Mitra → **I want to sell** →
Soybean → "Don't know" for grade → "Don't know" for dry → 15 → Send. It shows "⏳ The Mitra will check your
crop". Log in as the **Mitra** → **Check** the soybean → grade, meter 14% → "Needs drying" is suggested →
Save. Back as the farmer, the result card says "A little too much moisture" (the number only under "See
details") → "I've dried it". As the Mitra, it is in **Recheck today** → meter 11% → Ready → Save. The farmer
taps **Accept**; the Mitra → **Make a lot** → Soybean → it is listed → tick it → Create lot.
As the **Buyer** → the lot shows grade, "Mitra-checked" and moisture → **Make an offer** (₹ per quintal; onion
lots are per 10 kg) → as the farmer → open the listing → Accept.

Grades: 10 crops (onion, tomato, soybean, cotton, tur, chana, jowar, pomegranate, turmeric, marigold) with the
names mandis use and a picture for each. Grade names vary by market, so the Mitra confirms every listing;
turmeric and marigold are drafts to confirm with traders. Unsure, unchecked, damp or not-yet-accepted
listings can't be pooled, and a lot never mixes crop, type or grade. `npm run check:grades` checks the
grade data. Saved data from before grading moves over as "not graded" listings waiting for a check; use
**Reset app data** to load the new demo listings.

## Today's rates and the best market

- **आजचे भाव / Today's rates** (`/mandi/rates`): pick a crop from the same 10-crop grid as "I want to
  sell", then see every mandi's modal / min / max rate per variety, sorted by highest rate, nearest, or
  best net for one quintal. Each market also shows an **estimated** rate per local grade (the grade's
  place in the min–max band, `pricePosition` in `lib/grades.ts`, draft values) or a **Mitra rate** when a
  Mitra entered one today (`/mitra/rates`).
- **माल विकायचा आहे / I want to sell**: choose several grades with a quantity each (e.g. सुपर गोळे 100 kg +
  गोल्टी 1000 kg) → the top 3 mandis by estimated net after vehicle hire (round trip) and market charges,
  plus a split plan when sending grades to different mandis earns at least ₹500 and 3% more → **Take
  Mandi Mitra's help** (one listing per grade with the preferred market) or **I'll sell myself** (a saved
  plan with map links; no listing).
- Engine: `lib/mandi/profit.ts` (road km ≈ straight-line × 1.3; vehicles and ₹/km are editable draft
  defaults), checked by `npm run check:profit`. Markets and coordinates: `lib/mandi/markets.ts`
  (approximate, marked TODO verify); district HQs: `lib/mandi/districts.ts`.
- The farmer's location (GPS rounded to 2 decimals, or a district) stays on the phone; distances are
  worked out on the device.

**Live rates.** Add a free key from [data.gov.in](https://data.gov.in) (sign up → My account → generate
API key) to `.env.local`:

```bash
DATA_GOV_IN_API_KEY=your-key
```

`/api/mandi-prices?crop=onion` then fetches today's Maharashtra rows of the dataset "Current Daily Price
of Various Commodities from Various Markets (Mandi)", keeps them for 3 hours, and the phone keeps the last
live answer for when the network fails ("Last available"). Commodity names are in
`lib/mandi/commodities.ts`; open `/api/mandi-prices?discover=1` once with the key to list the names the
dataset really uses and correct that table. **Without a key, or when the API fails, every number comes
from `lib/mandi/sample-prices.json` and is marked "Sample rates (example)".** The demo farmer is near
Phaltan, so onion सुपर गोळे 1 qtl + गोल्टी 10 qtl shows Phaltan, Lonand and Baramati and a split plan
(super gole to Lonand, golti to Phaltan); Phaltan has one Mitra-entered golti rate today.

## Mandi Mitra (where, when and how to sell)

`/mandi` compares nearby markets by what the farmer keeps: market price (adjusted for grade) minus
transport, loading and market charges, and produce lost on the way. It also advises selling now,
storing, or pooling through a Gaon Mandi Mitra, and the farmer always makes the final choice.

**All prices, arrivals, distances and rates in `lib/market.ts` are sample figures, not real market
data, and the screen says so.** They cover soybean, tomato and onion across Phaltan, Lonand, Satara,
Baramati and Pune. To go live, feed `MARKETS` from a real source such as AGMARKNET; the calculations
stay the same.

## Satellite farm analysis (Crop Check)

`/crop-check/satellite` lets a farmer draw or upload a field and see a crop health map from real
Sentinel-2 imagery of the last 90 days. It needs a second service, `backend/main.py`, which talks
to Google Earth Engine and is separate from the disease model in `backend/app/main.py`:

```bash
cd backend
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements-satellite.txt
earthengine authenticate
.venv/Scripts/python -m uvicorn main:app --reload --port 8001
```

The app reaches it through `/api/satellite/*`. Set `SATELLITE_API_URL` when it isn't on
`http://127.0.0.1:8001`, and `GEE_PROJECT` to use another Earth Engine project. The service has no
login of its own and spends your Earth Engine quota, so don't expose it publicly as it is.

## Demo-data rules followed

- All people, buyers, prices, enterprises and figures are fictional and labelled as demo data.
- Scheme entries name real programmes but are short summaries marked **Not yet verified** until an
  admin verifies them; each links to its official site. Check every scheme against its source
  before showing it to real users.
- No buyer is shown as verified; offers are labelled "buyer-submitted price".
- The Mitra fee (₹30/qtl) and transport share (₹25/qtl) are demo assumptions.
- The whole app switches between English and Marathi, including seed content (schemes, guides,
  enterprises, statuses). Text a user types is shown as typed. The Marathi needs review by a native
  speaker before pilot use.
- The app UI no longer shows "demo" labels; the seed data is still fictional (see above).

## Structure

- `lib/types.ts` — data model (mirrors the PRD entities)
- `lib/data.ts` — seed / demo data
- `lib/store.tsx` — in-memory store and all actions (stands in for the future Supabase backend).
  Saved to localStorage as `udyamsetu-state-v7`; older data (v4–v6) is upgraded once, keeping accounts.
- `lib/crops.ts` — Crop Library: 8 crops with seasons, stages, tasks and care notes. General guidance
  only, marked "Not yet verified" until an agronomist reviews it (no chemical names with doses).
- `lib/speech.ts`, `lib/marathi-numbers.ts`, `components/speech.tsx` — read-aloud (see below).
- `lib/lifecycle.ts` — pure My Farm logic: local-date helpers (no UTC off-by-one in IST), current stage,
  harvest window, timeline, today's and overdue tasks, spray waiting-period warnings.
  `npm run check:lifecycle` runs the assertion examples in `lib/lifecycle.check.ts`.
- `app/crops/` — My Farm: hub (`?tab=library`), `new` (add a crop), `my/[id]` (crop detail),
  `library/[cropId]` (crop guide). `components/myfarm/ui.tsx` holds the shared task row, timeline,
  spray banner and Log activity sheet.
- `components/` — app shell, shared UI, cost calculator
- `app/` — one folder per screen (Next.js App Router)

## Read aloud (Marathi)

All read-aloud goes through `lib/speech.ts` (`useSpeech()`, `<SpeakButton>` in `components/speech.tsx`).
In Marathi, `lib/marathi-numbers.ts` turns numbers, money, ranges, percents, units, dates and phone
numbers into Marathi words before speaking (`npm run check:marathi` runs its checks), and numbers on
screen show in Devanagari digits. Marathi is read by a Marathi voice, else a Hindi voice, never an
English one; with no Indic voice the app shows how to install the Marathi voice (Android). The voice
status and a Test voice button are on Profile and Help.

### Natural Marathi voice (Sarvam AI Bulbul or Gemini)

With `NEXT_PUBLIC_TTS_CLOUD=1` and the profile switch **Natural voice** on (default), Marathi and
Hindi are read by a neural voice from `/api/tts`; otherwise, offline, or if the first clip fails or
takes more than 4 s (6 s with Gemini), the phone's Marathi voice (then Hindi) is used and a toast says so once.
Order of sources for each clip: `public/tts/manifest.json` (pre-generated) → the phone's Cache
Storage (`shet-tts-v1`, ~300 clips / 40 MB) → `/api/tts`. A second play works in airplane mode.
Only crop/task text is sent — never phone numbers, Aadhaar, addresses or full names.

| Variable | Where | Meaning |
| --- | --- | --- |
| `TTS_PROVIDER` | server | `sarvam` (default), `gemini`, `google` or `off` |
| `SARVAM_API_KEY` | server | Sarvam AI key (never sent to the browser) |
| `TTS_MODEL` | server | `bulbul:v4-flash` (default) or `bulbul:v3` |
| `TTS_SPEAKER_MR` | server | must match the model: v4-flash personas like `ishita_mr_conversational`, v3 names like `rupali`; a mismatch is logged at startup |
| `TTS_SPEAKER_HI` | server, optional | Hindi speaker for Crop Check |
| `SARVAM_DICT_ID` | server, optional | Sarvam pronunciation dictionary for crop/variety names |
| `GEMINI_API_KEY` | server | used when `TTS_PROVIDER=gemini` (the same key as the Krishi Mitra chat) |
| `TTS_MODEL_GEMINI` | server, optional | `gemini-3.8-flash-lite-tts` (default, fastest), `gemini-3.8-flash-tts`, or `gemini-2.5-flash-preview-tts` |
| `TTS_VOICE_GEMINI` | server, optional | a Gemini prebuilt voice; default `Kore` |
| `GOOGLE_TTS_API_KEY`, `GOOGLE_TTS_VOICE` | server | Google Cloud Text-to-Speech, when `TTS_PROVIDER=google` |
| `NEXT_PUBLIC_TTS_CLOUD=1` | build time | lets the app use `/api/tts` |
| `NEXT_PUBLIC_TTS_STATIC_BASE` | build time, optional | base URL of pre-generated clips (S3/CloudFront) instead of `/tts` |

With Gemini, only the text (already turned into Marathi words) is sent — no style instruction,
because Gemini reads instructions aloud too; the reply is 24 kHz 16-bit mono audio, which the server returns
as WAV (raw PCM from older models gets a WAV header added). Requests are up to 800 characters, the
first one short so playback starts sooner; if the first clip takes longer than 6 s, or Gemini
answers 400/403, the phone's voice is used; on 429 the app says "Online voice is busy" once.

See `.env.example`. Test page (dev only): `/dev/voice` shows time to first audio and where the audio
came from. `npm run tts:pregen` (needs `SARVAM_API_KEY`) pre-generates Crop Library sections into
`public/tts/`; add `--dry-run` to count characters, `--price=<₹ per 10,000 characters>` for a cost
estimate. **My Farm → "Listen to today's work"** reads a template-built briefing
(`lib/farm-briefing.ts`, checked by `npm run check:briefing`); its Marathi sentences are in `REVIEW`
for a native speaker to check.

## Not in this prototype

Server-side authentication, a database, PIN reset, SMS/WhatsApp, photo upload, weighing
entry, buyer verification, and payments.

---

## 7. Licensing & Model Card

- **Source Code License:** License not yet selected by repository contributors. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
- **Model Card & Evaluation Protocol:** See [MODEL_CARD.md](MODEL_CARD.md) for architecture specifications, known limitations, and the proposed Phase 3 evaluation protocol.
- **Safety Notice:** Diagnostic results are prototype advisory screenings and must never be treated as confirmed plant pathology diagnoses or proof for insurance claims.
