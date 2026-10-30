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
| Farmer / entrepreneur | Welcome & profile, Home, Schemes (search, filter, detail, save, track status, ask Mitra, report), Sell (new listing with validation, listing progress, offers with fee breakdown, accept/decline), Business guides + cost calculator + saved plans, Women & SHG (enterprise profile, enquiries), My activity, Help | ✓ |
| Gaon Mandi Mitra | Farmer requests → pool into a lot, lot detail with farmer-wise record and settlement summary, mark dispatched/completed, earnings | ✓ |
| Buyer | Browse pooled lots with filters, make an offer, my offers, SHG products + enquiry | ✓ |
| Admin | Activity overview, verify / flag / archive schemes, resolve reports | ✓ |

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
- `lib/store.tsx` — in-memory store and all actions (stands in for the future Supabase backend)
- `components/` — app shell, shared UI, cost calculator
- `app/` — one folder per screen (Next.js App Router)

## Not in this prototype

Server-side authentication, a database, PIN reset, SMS/WhatsApp, photo upload, weighing
entry, buyer verification, and payments.
