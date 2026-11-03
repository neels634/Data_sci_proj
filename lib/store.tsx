"use client";

/**
 * Client-side store. Holds all prototype state in memory and mirrors it to localStorage so a
 * click-through survives page reloads. "Reset" restores the seed. There is no backend: this
 * stands in for the Supabase tables described in the PRD.
 */
import { EMPTY_RECORD, type EnterpriseRecord } from "./enterprise";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  CURRENT_BUYER_ID,
  CURRENT_MITRA,
  SEED_FARMER_ACCOUNT,
  seedAccounts,
  seedBuyers,
  seedGuides,
  seedMandi,
  SEED_FARMER_LOCATION,
  seedProfile,
  seedReports,
  seedSchemes,
  seedFarm,
} from "./data";
import { bi, fmtDate, label, tx, type Bi, type Text } from "./i18n";
import { fmtNum } from "./marathi-numbers";
import { profileFromAccount, type Account } from "./account";
import { occurrences, todayISO } from "./lifecycle";
import { convert, gradingFor, UNSURE, type Unit } from "./grades";
import type { MitraRate } from "./mandi/prices";
import type { VehicleChoice } from "./mandi/profit";
import type {
  ActivityItem,
  BusinessPlan,
  FarmActivity,
  FarmCrop,
  FarmerProfile,
  Lang,
  Listing,
  Lot,
  Offer,
  CheckRecord,
  FarmLocation,
  SellPlan,
  Report,
  Role,
  Scheme,
  StressObservation,
  CropInfo,
  TaskState,
  TrackerStatus,
} from "./types";

interface AppState {
  role: Role;
  lang: Lang;
  theme: "bright" | "dark";
  /** accounts registered in this browser; there is no server */
  accounts: Account[];
  /** id of the signed-in account, or null when signed out */
  sessionId: string | null;
  profile: FarmerProfile;
  schemes: Scheme[];
  /** per-account data, keyed by account id */
  bookmarksBy: Record<string, string[]>;
  trackerBy: Record<string, Record<string, TrackerStatus>>;
  /** Gaon Tithe Udyojak: each account's village, entrepreneur profile and saved business ideas */
  enterpriseBy: Record<string, EnterpriseRecord>;
  listings: Listing[];
  lots: Lot[];
  offers: Offer[];
  plans: BusinessPlan[];
  reports: Report[];
  activityBy: Record<string, ActivityItem[]>;
  /** My Farm: every farmer's crops, their activity log and done/skipped task occurrences */
  /** read-aloud: "don't show again" on the no-Marathi-voice help, and the one-time Hindi-voice tip */
  voiceHelpDismissed: boolean;
  voiceTipSeen: boolean;
  /** read-aloud: use the online neural voice when available (else the phone's voice) */
  naturalVoice: boolean;
  farmCrops: FarmCrop[];
  farmActivities: FarmActivity[];
  taskStates: TaskState[];
  stressObservations: StressObservation[];
  /** Mandi Mitra: grade-wise rates a Mitra entered for one market and day */
  mitraRates: MitraRate[];
  /** "I'll sell myself" plans */
  sellPlans: SellPlan[];
  /** each account's location for distances (on this phone only) and vehicle choice */
  locationBy: Record<string, FarmLocation>;
  vehicleBy: Record<string, VehicleChoice>;
}

const initialState = (): AppState => {
  const farm = seedFarm(todayISO());
  const mandi = seedMandi(todayISO());
  return {
  role: "farmer",
  lang: "en",
  theme: "bright",
  accounts: seedAccounts,
  sessionId: null,
  profile: seedProfile,
  schemes: seedSchemes,
  bookmarksBy: { [SEED_FARMER_ACCOUNT]: ["pm-kisan"] },
  trackerBy: { [SEED_FARMER_ACCOUNT]: { "pm-kisan": "Applied" } },
  enterpriseBy: {},
  listings: mandi.listings,
  lots: mandi.lots,
  offers: mandi.offers,
  plans: [],
  reports: seedReports,
  activityBy: {
    [SEED_FARMER_ACCOUNT]: [
    { id: "a1", text: bi("Onion listing added to Mandi Mitra lot", "कांद्याची नोंद मंडी मित्राच्या लॉटमध्ये जोडली"), at: "2026-10-24" },
    { id: "a2", text: bi("Marked PM-KISAN as Applied", "पीएम-किसान: अर्ज केला"), at: "2026-10-20" },
    ],
  },
  voiceHelpDismissed: false,
  voiceTipSeen: false,
  naturalVoice: true,
  farmCrops: farm.crops,
  farmActivities: farm.activities,
  taskStates: farm.taskStates,
  stressObservations: [],
  mitraRates: mandi.mitraRates,
  sellPlans: [],
  locationBy: { [SEED_FARMER_ACCOUNT]: SEED_FARMER_LOCATION },
  vehicleBy: {},
  };
};

const STORAGE_KEY = "udyamsetu-state-v7";
const V6_STORAGE_KEY = "udyamsetu-state-v6";
const V5_STORAGE_KEY = "udyamsetu-state-v5";
const V4_STORAGE_KEY = "udyamsetu-state-v4";
/** What survives the v4 → v5 upgrade. Women & SHG data (enterprises, enquiries) is dropped. */
const V4_KEEP = ["lang", "theme", "role", "profile", "accounts", "sessionId", "schemes", "listings", "lots", "offers", "plans", "bookmarksBy", "trackerBy", "reports", "activityBy"] as const;

/** v5 → v6: My Farm crops gain `kind`; every existing crop is seasonal. */
const toV6 = (saved: Partial<AppState>): Partial<AppState> => ({
  ...saved,
  farmCrops: (saved.farmCrops ?? []).map((c) => ({ ...c, kind: c.kind ?? "seasonal" })),
});

/**
 * v6 → v7: Mandi Mitra grades. Old listings keep their quality as a note, become "not graded" and
 * wait for the Mitra's check (pooled ones stay pooled); quantities were quintals; crops become
 * Crop Library ids; offers become per lot unit.
 */
type Old = Record<string, unknown>;
const toV7 = (saved: Partial<AppState>): Partial<AppState> => ({
  ...saved,
  listings: (saved.listings ?? []).map((x) => {
    const o = x as unknown as Old;
    if ("gradeCode" in o) return x;
    const grade = o.grade as string | undefined;
    return {
      id: o.id as string,
      farmer: o.farmer as Text,
      owner: (o.owner as string | null) ?? null,
      crop: String(o.crop).toLowerCase(),
      gradeCode: UNSURE,
      quantity: Number(o.quantity) || 0,
      unit: "quintal",
      village: o.village as Text,
      availableFrom: (o.availableFrom as string) ?? today(),
      expectedPrice: (o.expectedPrice as number | null) ?? null,
      notes: grade && grade !== "Ungraded" ? `Grade ${grade}` : undefined,
      status: o.lotId ? "pooled" : o.status === "Cancelled" ? "cancelled" : "waiting_check",
      lotId: (o.lotId as string | null) ?? null,
      createdAt: (o.createdAt as string) ?? today(),
      gradeConfirmedByMitra: false,
      farmerAccepted: false,
      checkHistory: [],
    } satisfies Listing;
  }),
  lots: (saved.lots ?? []).map((x) => {
    const o = x as unknown as Old;
    return "gradeCode" in o ? x : ({ ...(o as unknown as Lot), crop: String(o.crop).toLowerCase(), gradeCode: UNSURE, unit: "quintal" } as Lot);
  }),
  offers: (saved.offers ?? []).map((x) => {
    const o = x as unknown as Old;
    return "pricePerUnit" in o ? x : ({ ...(o as unknown as Offer), pricePerUnit: Number(o.pricePerQuintal) || 0, unit: "quintal" } as Offer);
  }),
});

/** Saved data from before dark mode, or a damaged value, opens in the bright theme. */
const withValidTheme = (saved: Partial<AppState>): Partial<AppState> => ({ ...saved, theme: saved.theme === "dark" ? "dark" : "bright" });

/** Read saved state; upgrades older versions once without losing accounts or crops. */
function loadSaved(): Partial<AppState> | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return withValidTheme(JSON.parse(raw));
  const v6 = localStorage.getItem(V6_STORAGE_KEY);
  if (v6) {
    localStorage.removeItem(V6_STORAGE_KEY);
    return withValidTheme(toV7(toV6(JSON.parse(v6))));
  }
  const v5 = localStorage.getItem(V5_STORAGE_KEY);
  if (v5) {
    localStorage.removeItem(V5_STORAGE_KEY);
    return withValidTheme(toV7(toV6(JSON.parse(v5))));
  }
  const old = localStorage.getItem(V4_STORAGE_KEY);
  if (!old) return null;
  const v4 = JSON.parse(old) as Record<string, unknown>;
  const kept: Record<string, unknown> = { farmCrops: [], farmActivities: [], taskStates: [] };
  for (const k of V4_KEEP) if (k in v4) kept[k] = v4[k];
  localStorage.removeItem(V4_STORAGE_KEY);
  return toV7(kept as Partial<AppState>);
}
const today = () => new Date().toISOString().slice(0, 10);
const uid = (p: string) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
/** key for per-account data */
const who = (s: AppState) => s.sessionId ?? "guest";
/** Sowing/transplanting tasks are already done when the farmer records those dates. */
function closedByDates(c: FarmCrop, info: CropInfo | null | undefined): TaskState[] {
  if (!info || info.lifecycle !== "seasonal" || !c.sowingDate) return [];
  return occurrences(c, info)
    .filter((o) => (o.task.type === "sowing" && o.date <= (c.sowingDate as string)) || (o.task.type === "transplanting" && !!c.transplantDate && o.date <= c.transplantDate))
    .map((o) => ({ farmCropId: c.id, taskKey: o.key, status: "done" as const, at: todayISO() }));
}
/** add an entry to the signed-in account's activity */
const log = (s: AppState, text: Bi): AppState["activityBy"] => ({
  ...s.activityBy,
  [who(s)]: [{ id: uid("a"), text, at: today() }, ...(s.activityBy[who(s)] ?? [])],
});

function useAppStore() {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const langRef = useRef<Lang>(state.lang);
  langRef.current = state.lang;

  useEffect(() => {
    try {
      const saved = loadSaved();
      if (saved) setState({ ...initialState(), ...saved });
    } catch {
      /* storage unavailable — keep seed */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  /** Show a short message; accepts bilingual text and shows it in the current language. */
  const toast = useCallback((msg: Text) => {
    setToastMsg(tx(langRef.current, msg));
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2800);
  }, []);


  const actions = useMemo(() => {
    // toasts are deferred so they never fire from inside a state updater
    const later = (msg: Text) => setTimeout(() => toast(msg), 0);
    const en = (t: Text) => tx("en", t);
    const mr = (t: Text) => tx("mr", t);
    return {
      setRole: (role: Role) => setState((s) => ({ ...s, role })),
      setLang: (lang: Lang) => setState((s) => ({ ...s, lang })),
      setTheme: (theme: "bright" | "dark") => setState((s) => ({ ...s, theme })),
      toggleTheme: () =>
        setState((s) => {
          const next = s.theme === "dark" ? "bright" : "dark";
          later(next === "dark" ? bi("Dark mode on", "रात्र मोड सुरू") : bi("Bright mode on", "दिवस मोड सुरू"));
          return { ...s, theme: next };
        }),
      /** create an account and sign in with it */
      register: (account: Account) =>
        setState((s) => {
          later(bi("Account created. Welcome!", "खाते तयार झाले. स्वागत आहे!"));
          return { ...s, accounts: [...s.accounts, account], sessionId: account.id, role: account.role, profile: profileFromAccount(account) };
        }),
      /** sign in with an account whose PIN has already been checked */
      login: (id: string) =>
        setState((s) => {
          const a = s.accounts.find((x) => x.id === id);
          if (!a) return s;
          return { ...s, sessionId: a.id, role: a.role, profile: a.id === SEED_FARMER_ACCOUNT ? seedProfile : profileFromAccount(a) };
        }),
      logout: () => setState((s) => ({ ...s, sessionId: null })),
      updateAccount: (account: Account) =>
        setState((s) => ({
          ...s,
          accounts: s.accounts.map((x) => (x.id === account.id ? account : x)),
          profile: account.id === SEED_FARMER_ACCOUNT ? s.profile : profileFromAccount(account),
        })),
      updateProfile: (profile: FarmerProfile) => setState((s) => ({ ...s, profile })),
      resetAll: () => {
        // keeps accounts and the current sign-in; resets everything else
        setState((s) => ({ ...initialState(), lang: s.lang, accounts: s.accounts, sessionId: s.sessionId, role: s.role, profile: s.profile }));
        toast(bi("App data reset", "माहिती पुन्हा सुरुवातीला आणली"));
      },

      toggleBookmark: (id: string) =>
        setState((s) => {
          const mine = s.bookmarksBy[who(s)] ?? [];
          const on = mine.includes(id);
          later(on ? bi("Removed from saved schemes", "जतन केलेल्या योजनांमधून काढले") : bi("Scheme saved", "योजना जतन केली"));
          return { ...s, bookmarksBy: { ...s.bookmarksBy, [who(s)]: on ? mine.filter((b) => b !== id) : [...mine, id] } };
        }),
      setTracker: (id: string, status: TrackerStatus | "") =>
        setState((s) => {
          const tracker = { ...(s.trackerBy[who(s)] ?? {}) };
          const name = s.schemes.find((x) => x.id === id)?.name ?? bi(id, id);
          if (status) tracker[id] = status;
          else delete tracker[id];
          return {
            ...s,
            trackerBy: { ...s.trackerBy, [who(s)]: tracker },
            activityBy: status ? log(s, bi(`Marked ${name.en} as ${status}`, `${name.mr}: ${label("mr", status)}`)) : s.activityBy,
          };
        }),
      requestSchemeHelp: (id: string) =>
        setState((s) => {
          const name = s.schemes.find((x) => x.id === id)?.name ?? bi(id, id);
          later(bi("Request sent to your Mandi Mitra", "विनंती तुमच्या मंडी मित्राला पाठवली"));
          return {
            ...s,
            activityBy: log(s, bi(`Asked ${CURRENT_MITRA.en} for help with ${name.en}`, `${name.mr} साठी ${CURRENT_MITRA.mr} यांची मदत मागितली`)),
          };
        }),

      /** the farmer sends a crop for sale; the Mitra checks every listing before pooling */
      addListing: (l: Pick<Listing, "crop" | "typeCode" | "gradeCode" | "dryness" | "quantity" | "unit" | "preferredMarketId" | "planSnapshot">) =>
        setState((s) => {
          const listing: Listing = {
            ...l,
            id: uid("p"),
            farmer: s.profile.name,
            owner: s.sessionId,
            village: s.profile.village,
            availableFrom: today(),
            status: "waiting_check",
            lotId: null,
            createdAt: today(),
            gradeConfirmedByMitra: false,
            farmerAccepted: false,
            checkHistory: [],
          };
          const name = gradingFor(l.crop)?.name ?? bi(l.crop, l.crop);
          return {
            ...s,
            listings: [listing, ...s.listings],
            activityBy: log(s, bi(`Sent ${l.quantity} × ${l.unit} ${name.en} for sale`, `${fmtNum("mr", l.quantity)} ${name.mr} विक्रीसाठी पाठवला`)),
          };
        }),
      cancelListing: (id: string) =>
        setState((s) => {
          if (!s.listings.some((l) => l.id === id && !l.lotId)) return s;
          later(bi("Listing cancelled", "नोंद रद्द केली"));
          return { ...s, listings: s.listings.map((l) => (l.id === id ? { ...l, status: "cancelled" } : l)) };
        }),
      /** "I've dried it": the listing shows in the Mitra's recheck list now */
      markDried: (id: string) =>
        setState((s) => {
          later(bi("Your Mitra will check it again", "मित्र पुन्हा तपासतील"));
          return { ...s, listings: s.listings.map((l) => (l.id === id && l.status === "needs_drying" ? { ...l, dryRequestedAt: today() } : l)) };
        }),
      /** the farmer accepts the Mitra's check; a lower grade becomes ready to sell at that grade */
      acceptCheck: (id: string) =>
        setState((s) => {
          later(bi("Accepted", "मान्य केले"));
          return {
            ...s,
            listings: s.listings.map((l) => (l.id === id && !l.lotId ? { ...l, farmerAccepted: true, status: l.status === "low_grade" ? "ready" : l.status } : l)),
          };
        }),
      /** the Mitra's quality check (also a recheck) */
      checkListing: (id: string, c: { typeCode?: string; gradeCode: string; moisture?: number; result: Listing["status"]; recheckOn?: string }) =>
        setState((s) => {
          const rec: CheckRecord = { at: today(), by: s.accounts.find((a) => a.id === s.sessionId)?.name || CURRENT_MITRA, gradeCode: c.gradeCode, moisture: c.moisture, result: c.result };
          later(bi("Check saved. The farmer can see it now.", "तपासणी जतन केली. शेतकऱ्याला आता दिसेल."));
          return {
            ...s,
            listings: s.listings.map((l) =>
              l.id === id && !l.lotId
                ? {
                    ...l,
                    typeCode: c.typeCode ?? l.typeCode,
                    mitraGradeCode: c.gradeCode,
                    mitraMoisture: c.moisture,
                    gradeConfirmedByMitra: true,
                    farmerAccepted: false,
                    status: c.result,
                    recheckOn: c.result === "needs_drying" ? c.recheckOn : undefined,
                    dryRequestedAt: undefined,
                    checkHistory: [...l.checkHistory, rec],
                  }
                : l,
            ),
          };
        }),

      /** pool checked, accepted listings of one crop / type / grade; anything else is left out */
      createLot: (listingIds: string[], targetMarketId?: string) =>
        setState((s) => {
          const picked = s.listings.filter((l) => listingIds.includes(l.id) && poolable(l));
          if (!picked.length) return s;
          const key = poolKey(picked[0]);
          const same = picked.filter((p) => poolKey(p) === key);
          const unit: Unit = gradingFor(same[0].crop)?.saleUnit ?? same[0].unit;
          const lot: Lot = {
            id: uid("l"),
            crop: same[0].crop,
            typeCode: same[0].typeCode,
            gradeCode: same[0].mitraGradeCode ?? same[0].gradeCode,
            unit,
            targetMarketId: targetMarketId ?? mostCommon(same.map((p) => p.preferredMarketId)),
            listingIds: same.map((p) => p.id),
            village: same[0].village,
            availableFrom: same.map((p) => p.availableFrom).sort().at(-1)!,
            mitra: CURRENT_MITRA,
            status: "Open for offers",
            createdAt: today(),
          };
          const ids = new Set(lot.listingIds);
          later(bi("Lot created", "लॉट तयार झाला"));
          return {
            ...s,
            lots: [lot, ...s.lots],
            listings: s.listings.map((l) => (ids.has(l.id) ? { ...l, status: "pooled", lotId: lot.id } : l)),
          };
        }),
      advanceLot: (lotId: string) =>
        setState((s) => {
          const lot = s.lots.find((l) => l.id === lotId);
          if (!lot) return s;
          const next = lot.status === "Offer accepted" ? "Dispatched" : lot.status === "Dispatched" ? "Completed" : lot.status;
          later(bi(`Lot marked ${next}`, `लॉट: ${label("mr", next)}`));
          return { ...s, lots: s.lots.map((l) => (l.id === lotId ? { ...l, status: next } : l)) };
        }),

      submitOffer: (o: Pick<Offer, "lotId" | "pricePerUnit" | "quantity" | "terms">) =>
        setState((s) => {
          const lot = s.lots.find((x) => x.id === o.lotId);
          if (!lot) return s;
          const offer: Offer = { ...o, unit: lot.unit, id: uid("o"), buyerId: CURRENT_BUYER_ID, status: "Submitted", createdAt: today() };
          later(bi("Offer sent. Farmers will review it with their Mitra.", "ऑफर पाठवली. शेतकरी मित्रासोबत ती पाहतील."));
          return { ...s, offers: [offer, ...s.offers] };
        }),
      respondToOffer: (offerId: string, accept: boolean) =>
        setState((s) => {
          const offer = s.offers.find((o) => o.id === offerId);
          if (!offer) return s;
          if (accept) {
            later(bi("Offer accepted. Your Mitra will arrange pickup.", "ऑफर स्वीकारली. तुमचा मित्र माल उचलण्याची व्यवस्था करेल."));
            return {
              ...s,
              offers: s.offers.map((o) =>
                o.id === offerId ? { ...o, status: "Accepted" } : o.lotId === offer.lotId && o.status === "Submitted" ? { ...o, status: "Declined" } : o,
              ),
              lots: s.lots.map((l) => (l.id === offer.lotId ? { ...l, status: "Offer accepted" } : l)),
              activityBy: log(s, bi(`Accepted offer of ₹${offer.pricePerUnit} per ${offer.unit}`, `₹${fmtNum("mr", offer.pricePerUnit)} ची ऑफर स्वीकारली`)),
            };
          }
          later(bi("Offer declined", "ऑफर नाकारली"));
          return { ...s, offers: s.offers.map((o) => (o.id === offerId ? { ...o, status: "Declined" as const } : o)) };
        }),

      /** location stays in this browser; rounded so it is never more precise than ~1 km */
      setLocation: (loc: FarmLocation) =>
        setState((s) => ({ ...s, locationBy: { ...s.locationBy, [who(s)]: { ...loc, lat: Math.round(loc.lat * 100) / 100, lng: Math.round(loc.lng * 100) / 100 } } })),
      setVehicle: (v: VehicleChoice) => setState((s) => ({ ...s, vehicleBy: { ...s.vehicleBy, [who(s)]: v } })),
      saveSellPlan: (plan: Omit<SellPlan, "id" | "owner" | "createdAt">) =>
        setState((s) => {
          later(bi("Saved to My plans", "माझे नियोजन मध्ये जतन केले"));
          return { ...s, sellPlans: [{ ...plan, id: uid("sp"), owner: who(s), createdAt: today() }, ...s.sellPlans] };
        }),
      /** a Mitra's grade-wise rates for one market and crop, for today; replaces their earlier ones */
      saveMitraRates: (rates: Omit<MitraRate, "id" | "by" | "date">[]) =>
        setState((s) => {
          const d = todayISO(); // local date, same as the rate screens
          const by = who(s);
          const fresh = rates.map((x) => ({ ...x, id: uid("mr"), by, date: d }));
          const same = (a: MitraRate) => fresh.some((f) => f.marketId === a.marketId && f.cropId === a.cropId && f.gradeCode === a.gradeCode && (f.typeCode ?? "") === (a.typeCode ?? "") && a.date === d);
          later(bi("Today's rates saved", "आजचे दर जतन केले"));
          return { ...s, mitraRates: [...fresh, ...s.mitraRates.filter((a) => !same(a))] };
        }),
      setLotTarget: (lotId: string, marketId: string) => setState((s) => ({ ...s, lots: s.lots.map((l) => (l.id === lotId ? { ...l, targetMarketId: marketId } : l)) })),

      savePlan: (plan: Omit<BusinessPlan, "id" | "savedAt" | "owner">) =>
        setState((s) => {
          later(bi("Business plan saved", "व्यवसाय आराखडा जतन केला"));
          return {
            ...s,
            plans: [{ ...plan, id: uid("bp"), owner: s.sessionId, savedAt: today() }, ...s.plans],
            activityBy: log(s, bi(`Saved business plan: ${en(plan.product)}`, `व्यवसाय आराखडा जतन: ${mr(plan.product)}`)),
          };
        }),
      deletePlan: (id: string) => setState((s) => ({ ...s, plans: s.plans.filter((p) => p.id !== id) })),
      /** record the market a farmer chose in Mandi Mitra */
      planSale: (text: Bi) =>
        setState((s) => {
          later(bi("Plan saved", "योजना जतन केली"));
          return { ...s, activityBy: log(s, text) };
        }),
      requestSupport: (topic: Text) =>
        setState((s) => {
          later(bi("Request sent to the field coordinator", "विनंती क्षेत्र समन्वयकाला पाठवली"));
          return { ...s, activityBy: log(s, bi(`Requested support: ${en(topic)}`, `मदतीची विनंती: ${mr(topic)}`)) };
        }),


      dismissVoiceHelp: (dismissed = true) => setState((s) => ({ ...s, voiceHelpDismissed: dismissed })),
      setNaturalVoice: (on: boolean) => setState((s) => ({ ...s, naturalVoice: on })),
      markVoiceTip: () => setState((s) => (s.voiceTipSeen ? s : { ...s, voiceTipSeen: true })),

      // ---- My Farm: every action checks the crop belongs to the signed-in farmer
      /** `info` is the loaded library crop; it lets tasks already done (sowing, transplanting) be closed */
      addFarmCrop: (c: Omit<FarmCrop, "owner" | "createdAt">, info?: CropInfo | null) =>
        setState((s) => {
          if (!s.sessionId) return s;
          const crop: FarmCrop = { ...c, owner: s.sessionId, createdAt: todayISO() };
          later(bi("Crop added to My Farm", "पीक माझ्या शेतीत जोडले"));
          const activities: FarmActivity[] =
            crop.kind === "perennial"
              ? crop.plantedOn && crop.status === "growing"
                ? [{ id: uid("fa"), farmCropId: crop.id, type: "transplanting", date: crop.plantedOn, notes: "Orchard planted", createdAt: new Date().toISOString() }]
                : []
              : crop.sowingDate && crop.status === "growing"
                ? [{ id: uid("fa"), farmCropId: crop.id, type: "sowing", date: crop.sowingDate, notes: "", createdAt: new Date().toISOString() }]
                : [];
          if (crop.transplantDate && crop.status === "growing")
            activities.push({ id: uid("fa"), farmCropId: crop.id, type: "transplanting", date: crop.transplantDate, notes: "", createdAt: new Date().toISOString() });
          return {
            ...s,
            farmCrops: [crop, ...s.farmCrops],
            farmActivities: [...activities, ...s.farmActivities],
            taskStates: crop.status === "growing" ? [...s.taskStates, ...closedByDates(crop, info)] : s.taskStates,
            activityBy: log(s, bi("Added a crop to My Farm", "माझ्या शेतीत पीक जोडले")),
          };
        }),
      updateFarmCrop: (id: string, patch: Partial<Omit<FarmCrop, "id" | "owner" | "createdAt">>) =>
        setState((s) => {
          if (!s.farmCrops.some((c) => c.id === id && c.owner === s.sessionId)) return s;
          later(bi("Crop updated", "पीक अद्ययावत केले"));
          return { ...s, farmCrops: s.farmCrops.map((c) => (c.id === id ? { ...c, ...patch } : c)) };
        }),
      /** saved as the farmer types, so no "updated" message */
      saveEnterprise: (patch: Partial<EnterpriseRecord>) =>
        setState((s) => ({ ...s, enterpriseBy: { ...s.enterpriseBy, [who(s)]: { ...EMPTY_RECORD, ...s.enterpriseBy[who(s)], ...patch } } })),
      /** refreshed in the background of the record screen, so no "updated" message */
      saveFieldHistory: (id: string, fieldHistory: FarmCrop["fieldHistory"]) =>
        setState((s) => ({ ...s, farmCrops: s.farmCrops.map((c) => (c.id === id && c.owner === s.sessionId ? { ...c, fieldHistory } : c)) })),
      /** planned → growing, with the sowing recorded in the log */
      markSown: (id: string, date: string, info?: CropInfo | null) =>
        setState((s) => {
          if (!s.farmCrops.some((c) => c.id === id && c.owner === s.sessionId)) return s;
          later(bi("Sowing recorded. Your crop calendar has started.", "पेरणीची नोंद झाली. पिकाचे वेळापत्रक सुरू झाले."));
          const sown = s.farmCrops.find((c) => c.id === id)!;
          return {
            ...s,
            farmCrops: s.farmCrops.map((c) => (c.id === id ? { ...c, status: "growing", sowingDate: date } : c)),
            taskStates: [...s.taskStates, ...closedByDates({ ...sown, status: "growing", sowingDate: date }, info)],
            farmActivities: [{ id: uid("fa"), farmCropId: id, type: "sowing", date, notes: "", createdAt: new Date().toISOString() }, ...s.farmActivities],
          };
        }),
      /** perennial: start this year's bahar / pruning cycle (after the previous one is harvested) */
      startCycle: (id: string, cycleKey: string, start: string) =>
        setState((s) => {
          const fc = s.farmCrops.find((c) => c.id === id && c.owner === s.sessionId);
          if (!fc) return s;
          later(bi("New cycle started. Its tasks are now in your list.", "नवा बहार/हंगाम सुरू झाला. त्याची कामे यादीत आली."));
          return {
            ...s,
            farmCrops: s.farmCrops.map((c) => (c.id === id ? { ...c, status: "growing", cycleKey, cycleStart: start, harvestedOn: null } : c)),
            farmActivities: [{ id: uid("fa"), farmCropId: id, type: "other", date: start, notes: `Cycle started: ${cycleKey}`, createdAt: new Date().toISOString() }, ...s.farmActivities],
          };
        }),
      markHarvested: (id: string, date: string) =>
        setState((s) => {
          if (!s.farmCrops.some((c) => c.id === id && c.owner === s.sessionId)) return s;
          later(bi("Marked as harvested", "काढणी झाल्याची नोंद केली"));
          return {
            ...s,
            // an orchard keeps growing: harvest ends this year's cycle and waits for the next one
            farmCrops: s.farmCrops.map((c) => (c.id === id ? (c.kind === "perennial" ? { ...c, cycleStart: null, harvestedOn: date } : { ...c, status: "harvested", harvestedOn: date }) : c)),
            farmActivities: [{ id: uid("fa"), farmCropId: id, type: "harvest", date, notes: "", createdAt: new Date().toISOString() }, ...s.farmActivities],
          };
        }),
      removeFarmCrop: (id: string) =>
        setState((s) => {
          if (!s.farmCrops.some((c) => c.id === id && c.owner === s.sessionId)) return s;
          later(bi("Crop removed", "पीक काढून टाकले"));
          return {
            ...s,
            farmCrops: s.farmCrops.filter((c) => c.id !== id),
            farmActivities: s.farmActivities.filter((a) => a.farmCropId !== id),
            taskStates: s.taskStates.filter((t) => t.farmCropId !== id),
          };
        }),
      /** save a log entry; when it came from a task, that task occurrence is marked done too */
      logFarmActivity: (a: Omit<FarmActivity, "id" | "createdAt">) =>
        setState((s) => {
          if (!s.farmCrops.some((c) => c.id === a.farmCropId && c.owner === s.sessionId)) return s;
          later(bi("Saved to the activity log", "कामांच्या नोंदीत जतन केले"));
          const entry: FarmActivity = { ...a, id: uid("fa"), createdAt: new Date().toISOString() };
          const linked = a.linkedTaskId;
          const taskStates =
            linked && !s.taskStates.some((t) => t.farmCropId === a.farmCropId && t.taskKey === linked)
              ? [...s.taskStates, { farmCropId: a.farmCropId, taskKey: linked, status: "done" as const, at: todayISO() }]
              : s.taskStates;
          return { ...s, farmActivities: [entry, ...s.farmActivities], taskStates };
        }),
      setTaskState: (farmCropId: string, taskKey: string, status: TaskState["status"]) =>
        setState((s) => {
          if (!s.farmCrops.some((c) => c.id === farmCropId && c.owner === s.sessionId)) return s;
          later(status === "done" ? bi("Task done", "काम झाले") : bi("Task skipped", "काम वगळले"));
          return {
            ...s,
            taskStates: [...s.taskStates.filter((t) => !(t.farmCropId === farmCropId && t.taskKey === taskKey)), { farmCropId, taskKey, status, at: todayISO() }],
          };
        }),

      addStressObservation: (obs: Omit<StressObservation, "id" | "createdAt">) =>
        setState((s) => {
          if (!s.farmCrops.some((c) => c.id === obs.farmCropId && c.owner === s.sessionId)) return s;
          later(bi("Stress observation saved to plot timeline", "पिकाच्या ताणाची नोंद जतन केली"));
          const entry: StressObservation = {
            ...obs,
            id: uid("so"),
            createdAt: new Date().toISOString(),
          };
          return {
            ...s,
            stressObservations: [entry, ...(s.stressObservations || [])],
          };
        }),
      deleteStressObservation: (id: string) =>
        setState((s) => {
          later(bi("Observation removed", "नोंद काढून टाकली"));
          return {
            ...s,
            stressObservations: (s.stressObservations || []).filter((o) => o.id !== id),
          };
        }),

      addReport: (about: Text, reason: Text) =>
        setState((s) => {
          later(bi("Report sent to the admin team", "तक्रार प्रशासन टीमला पाठवली"));
          return { ...s, reports: [{ id: uid("r"), about, reason, status: "Open", createdAt: today() }, ...s.reports] };
        }),
      resolveReport: (id: string) => setState((s) => ({ ...s, reports: s.reports.map((r) => (r.id === id ? { ...r, status: "Resolved" } : r)) })),
      setSchemeStatus: (id: string, status: Scheme["status"]) =>
        setState((s) => {
          later(
            status === "active"
              ? bi("Scheme restored", "योजना पुन्हा सुरू केली")
              : status === "flagged"
                ? bi("Scheme flagged for review", "योजना तपासणीसाठी चिन्हांकित")
                : bi("Scheme archived", "योजना संग्रहित केली"),
          );
          return { ...s, schemes: s.schemes.map((x) => (x.id === id ? { ...x, status } : x)) };
        }),
      verifyScheme: (id: string) =>
        setState((s) => {
          later(bi("Marked as verified today", "आज पडताळणी झाल्याची नोंद केली"));
          return { ...s, schemes: s.schemes.map((x) => (x.id === id ? { ...x, lastVerified: today(), status: "active" } : x)) };
        }),
    };
  }, [toast]);

  const lang = state.lang;
  const i18n = useMemo(
    () => ({
      /** pick the English or Marathi version of an inline string */
      l: (en: string, mr: string) => (lang === "mr" ? mr : en),
      /** render stored text (bilingual seed text or a plain string the user typed) */
      tx: (t: Text | undefined | null) => tx(lang, t),
      /** label for a fixed value such as a status, crop or category */
      lbl: (v: string) => label(lang, v),
      date: (iso: string) => fmtDate(lang, iso),
      /** number for display: Devanagari digits and Indian grouping in Marathi */
      num: (n: number, opts?: Intl.NumberFormatOptions) => fmtNum(lang, n, opts),
    }),
    [lang],
  );

  const sessionId = state.sessionId;
  const account = state.accounts.find((a) => a.id === sessionId) ?? null;
  /** true when the item belongs to the signed-in account */
  const isMine = useCallback((x: { owner: string | null }) => x.owner !== null && x.owner === sessionId, [sessionId]);

  // what pages read: the signed-in account's own saved schemes, tracker and activity
  const key = sessionId ?? "guest";
  const view = useMemo(
    () => ({
      ...state,
      bookmarks: state.bookmarksBy[key] ?? [],
      tracker: state.trackerBy[key] ?? {},
      enterprise: state.enterpriseBy[key] ?? EMPTY_RECORD,
      activity: state.activityBy[key] ?? [],
      // My Farm: only the signed-in farmer's own crops and their records
      myFarmCrops: state.farmCrops.filter((c) => c.owner === sessionId),
      myFarmActivities: state.farmActivities.filter((a) => state.farmCrops.some((c) => c.id === a.farmCropId && c.owner === sessionId)),
      myTaskStates: state.taskStates.filter((t) => state.farmCrops.some((c) => c.id === t.farmCropId && c.owner === sessionId)),
      myLocation: state.locationBy[key] as FarmLocation | undefined,
      myVehicle: state.vehicleBy[key] ?? ({ vehicleId: "auto" } as VehicleChoice),
      mySellPlans: state.sellPlans.filter((p) => p.owner === key),
      myStressObservations: (state.stressObservations || []).filter((o) => state.farmCrops.some((c) => c.id === o.farmCropId && c.owner === sessionId)),
    }),
    [state, key, sessionId],
  );

  return { state: view, hydrated, toastMsg, toast, account, isMine, ...i18n, ...actions };
}

export type Store = ReturnType<typeof useAppStore>;
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = useAppStore();
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}

// ---- derived helpers -------------------------------------------------------

export const buyerById = (id: string) => seedBuyers.find((b) => b.id === id);
export const guideById = (id: string) => seedGuides.find((g) => g.id === id);

/** total of a lot, in the lot's unit */
export function lotQuantity(lot: Lot, listings: Listing[]) {
  return listings.filter((l) => lot.listingIds.includes(l.id)).reduce((a, l) => a + convert(l.quantity, l.unit, lot.unit), 0);
}

/** only listings the Mitra checked as ready and the farmer accepted can be pooled */
export const poolable = (l: Listing) => l.status === "ready" && l.farmerAccepted && !l.lotId && l.gradeConfirmedByMitra && (l.mitraGradeCode ?? l.gradeCode) !== UNSURE;
/** the value seen most often (first on a tie) */
function mostCommon<T>(xs: (T | undefined)[]): T | undefined {
  const n = new Map<T, number>();
  for (const x of xs) if (x !== undefined) n.set(x, (n.get(x) ?? 0) + 1);
  return [...n.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}

/** due for a Mitra recheck: the date has come, or the farmer says it's dried */
export const dueRecheck = (x: Listing, today: string) => x.status === "needs_drying" && (!!x.dryRequestedAt || (!!x.recheckOn && x.recheckOn <= today));
/** listings pool together only with the same crop, type and grade */
export const poolKey = (l: Pick<Listing, "crop" | "typeCode" | "gradeCode" | "mitraGradeCode">) => `${l.crop}|${l.typeCode ?? ""}|${l.mitraGradeCode ?? l.gradeCode}`;

/** Indicative only: matches profile answers to scheme tags. Never a guarantee of eligibility. */
export function matchSchemes(schemes: Scheme[], p: FarmerProfile) {
  return schemes
    .filter((s) => s.status !== "archived")
    .filter(
      (s) =>
        s.tags.includes("all-farmers") ||
        (s.tags.includes("landholding") && p.landholding !== "") ||
        (s.tags.includes("women") && p.womenLed) ||
        s.tags.includes("irrigation"),
    );
}
