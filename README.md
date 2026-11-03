# Shet Samruddhi — clickable front-end prototype

A mobile-first prototype of the Shet Samruddhi product described in the PRD. It is **front-end only**:
there is no backend, sign-in or real data. All state lives in the browser, starts from hardcoded
demo data in `lib/data.ts`, and is saved to `localStorage` so a click-through survives a reload.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. You land on the **log in** page (mobile number + 4-digit PIN). Tap
**Create a new account** for the 6-step sign-up, which asks about the person, where they live, their
farm / Mitra work / business / organisation, and contact preferences, then shows a review screen.

Accounts are saved in the browser only (localStorage) — there is no server or database. The PIN is
stored as a SHA-256 hash. No Aadhaar, bank details or OTPs are collected.

Sample accounts (PIN `1234` for all):

| Role | Mobile |
| --- | --- |
| Farmer — Sunita Pawar | 9876500001 |
| Gaon Mandi Mitra — Ganesh Shinde | 9876500002 |
| Buyer — Krushna Agro Traders | 9876500003 |
| Admin — Meera Kulkarni | 9876500004 |

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

Optional cloud voice for phones without any Marathi/Hindi voice (Google Cloud Text-to-Speech, mr-IN):

| Variable | Where | Meaning |
| --- | --- | --- |
| `TTS_PROVIDER=google` | server | turns on `app/api/tts` |
| `GOOGLE_TTS_API_KEY` | server | Google Cloud API key with Text-to-Speech enabled (never sent to the browser) |
| `GOOGLE_TTS_VOICE` | server, optional | a specific mr-IN voice name; otherwise Google's default mr-IN voice |
| `NEXT_PUBLIC_TTS_CLOUD=1` | build time | lets the app use `/api/tts` when no device voice exists |

## Not in this prototype

Server-side authentication, a database, PIN reset, SMS/WhatsApp, photo upload, weighing
entry, buyer verification, and payments.
