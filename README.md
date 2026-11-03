# Shet Samruddhi — Product & Prototype Guide

A mobile-first agricultural operating system and record-keeping companion for smallholder farmers in Maharashtra.

## Product Promise

> "When a farmer notices crop stress, Shet Samruddhi helps them record what happened, see what area-level information is available, and share a clear case with a Mitra or the right official channel."

Area-level signals support awareness; they do not prove plot-level damage or guarantee an insurance claim.

---

## 1. Real vs. Demo Data

To maintain strict product integrity, every data point in the app is honest about its source:

| Capability / Module | Status | Details |
|---|---|---|
| **AI Crop Check (`/crop-check`)** | **REAL LOCAL MODEL** | Runs an ONNX MobileNetV2 38-class neural network on a local FastAPI backend (port 8000). Inspects **1 close-up leaf photo**. If the backend fails or is unreachable, an honest error card is shown (never a fabricated diagnosis). Low confidence (< 60%) or unsupported crops display a clear "cannot identify" message. |
| **Plot Stress Timeline (`/crops/my/[id]`)** | **REAL LOCAL DATA** | Farmers record dated stress observations (notes + locally compressed photo thumbnail) stored private to the device in browser `localStorage`. Survives page reloads. |
| **Case Summary Generator** | **REAL CLIENT LOGIC** | Generates one-click copyable plain text with plot context and farmer-entered observations. Does not embed binary photos. |
| **Area-level Signal** | **DEMO PLACEHOLDER** | Marked with a visible **Demo data** badge. Displays neutral illustrative context with no numbers, percentages, or green/red gauges so it cannot be mistaken for a live sensor reading. |
| **Mandi Mitra (`/mandi`)** | **DEMO DATA** | Market prices, distances, and rates in `lib/market.ts` are sample figures marked as demo data. |
| **Government Schemes (`/schemes`)** | **CURATED SAMPLE DATA** | Real programmes summarized for prototyping, marked **Not yet verified** until validated against official gazettes. Links directly to official portals (PM-KISAN, MahaDBT, PMFBY). |

---

## 2. Limits & Scope Boundaries

- **Supported Crops for AI Diagnosis:** The local 38-class ONNX model only supports 14 crops: Apple, Blueberry, Cherry, Corn (Maize), Grape, Orange, Peach, Bell Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato. Other Maharashtra crops (e.g., Onion, Sugarcane, Cotton) show an honest "unsupported crop" advisory.
- **Photos & Privacy:** Photos attached to plot stress observations are compressed into local canvas thumbnails and stored in the browser's `localStorage`. No private photos or personal details are uploaded to a public server or ledger.
- **Out of Scope:** No blockchain, tokens, escrow, loan eligibility scoring, automated payouts, or claims that satellite data proves plot damage.

---

## 3. How to Connect a Real Data Source Later

1. **Area-level Satellite / Weather Feeds:**
   - In `app/crops/my/[id]/page.tsx`, replace the illustrative component in `Area-level Signal Context` with an API call to Sentinel-2 (Copernicus API) or ISRO Bhuvan / IMD Weather API using the farmer's taluka/block coordinates.
   - Always display the data source, geographic resolution, and timestamp next to the reading.
2. **APMC Mandi Live Rates:**
   - In `lib/market.ts`, replace the static `MARKETS` array with live price feeds from the AGMARKNET API (data.gov.in).
3. **Database Migration:**
   - Replace the `udyamsetu-state-v5` `localStorage` engine in `lib/store.tsx` with Supabase or PostgreSQL client queries.

---

## 4. Run it

### Frontend (Next.js 15)
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Local AI Backend (FastAPI + ONNX MobileNetV2)
```bash
cd backend
./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
```
API Documentation available at [http://localhost:8000/docs](http://localhost:8000/docs).

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
