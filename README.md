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
| Farmer / entrepreneur | Welcome & profile, Home, Schemes (search, filter, detail, save, track status, ask Mitra, report), Sell (new listing with validation, listing progress, offers with fee breakdown, accept/decline), Business guides + cost calculator + saved plans, **My Farm** (today's tasks across crops with done/skip, my crops with stage and harvest window, add a crop in 3 steps, crop detail with timeline, activity log and spray safety warnings, Crop Library with search for 8 Maharashtra crops), My activity, Help | ✓ |
| Gaon Mandi Mitra | Farmer requests → pool into a lot, lot detail with farmer-wise record and settlement summary, mark dispatched/completed, earnings | ✓ |
| Buyer | Browse pooled lots with filters, make an offer, my offers | ✓ |
| Admin | Activity overview, verify / flag / archive schemes, resolve reports | ✓ |

My Farm demo: log in as the **Farmer** → Home shows **My Farm** with a task badge → open it → tick today's
irrigation task → the log sheet opens prefilled → Save → "Last irrigation: today" → open the onion crop to see
"You are here" on the timeline and the harvest window → **Crop Library** → search "कांदा" → **Grow this crop**
→ add a second onion plot. Sunita's onion and planned chana are demo data with dates relative to today.

Try this path: log in as the **Farmer** → Sell → New listing → log out, log in as the **Mitra** → select
listings → Create pooled lot → log in as the **Buyer** → open the lot → Send offer → log in as the
**Farmer** → Sell → open the listing → Accept.

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
  Saved to localStorage as `udyamsetu-state-v5`; older v4 data is upgraded once, keeping accounts.
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
