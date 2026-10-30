"use client";

/**
 * Client-side store. Holds all prototype state in memory and mirrors it to localStorage so a
 * click-through survives page reloads. "Reset" restores the seed. There is no backend: this
 * stands in for the Supabase tables described in the PRD.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  CURRENT_BUYER_ID,
  CURRENT_MITRA,
  SEED_FARMER_ACCOUNT,
  seedAccounts,
  seedBuyers,
  seedEnquiries,
  seedEnterprises,
  seedGuides,
  seedListings,
  seedLots,
  seedOffers,
  seedProfile,
  seedReports,
  seedSchemes,
} from "./data";
import { bi, fmtDate, label, tx, type Bi, type Text } from "./i18n";
import { profileFromAccount, type Account } from "./account";
import type {
  ActivityItem,
  BusinessPlan,
  Enquiry,
  Enterprise,
  FarmerProfile,
  Lang,
  Listing,
  Lot,
  Offer,
  Report,
  Role,
  Scheme,
  TrackerStatus,
} from "./types";

interface AppState {
  role: Role;
  lang: Lang;
  /** accounts registered in this browser; there is no server */
  accounts: Account[];
  /** id of the signed-in account, or null when signed out */
  sessionId: string | null;
  profile: FarmerProfile;
  schemes: Scheme[];
  /** per-account data, keyed by account id */
  bookmarksBy: Record<string, string[]>;
  trackerBy: Record<string, Record<string, TrackerStatus>>;
  listings: Listing[];
  lots: Lot[];
  offers: Offer[];
  plans: BusinessPlan[];
  enterprises: Enterprise[];
  enquiries: Enquiry[];
  reports: Report[];
  activityBy: Record<string, ActivityItem[]>;
}

const initialState = (): AppState => ({
  role: "farmer",
  lang: "en",
  accounts: seedAccounts,
  sessionId: null,
  profile: seedProfile,
  schemes: seedSchemes,
  bookmarksBy: { [SEED_FARMER_ACCOUNT]: ["pm-kisan"] },
  trackerBy: { [SEED_FARMER_ACCOUNT]: { "pm-kisan": "Applied" } },
  listings: seedListings,
  lots: seedLots,
  offers: seedOffers,
  plans: [],
  enterprises: seedEnterprises,
  enquiries: seedEnquiries,
  reports: seedReports,
  activityBy: {
    [SEED_FARMER_ACCOUNT]: [
    { id: "a1", text: bi("Onion listing added to Mandi Mitra lot", "कांद्याची नोंद मंडी मित्राच्या लॉटमध्ये जोडली"), at: "2026-10-24" },
    { id: "a2", text: bi("Marked PM-KISAN as Applied", "पीएम-किसान: अर्ज केला"), at: "2026-10-20" },
    ],
  },
});

const STORAGE_KEY = "udyamsetu-state-v4";
const today = () => new Date().toISOString().slice(0, 10);
const uid = (p: string) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
/** key for per-account data */
const who = (s: AppState) => s.sessionId ?? "guest";
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
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState(), ...JSON.parse(raw) });
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

      addListing: (l: Omit<Listing, "id" | "farmer" | "owner" | "status" | "lotId" | "createdAt">) =>
        setState((s) => {
          const listing: Listing = {
            ...l,
            id: uid("p"),
            farmer: s.profile.name,
            owner: s.sessionId,
            status: l.wantsMitra ? "With Mitra" : "Submitted",
            lotId: null,
            createdAt: today(),
          };
          later(l.wantsMitra ? bi("Listing sent to your Mandi Mitra", "नोंद तुमच्या मंडी मित्राला पाठवली") : bi("Listing published", "नोंद प्रसिद्ध केली"));
          return {
            ...s,
            listings: [listing, ...s.listings],
            activityBy: log(s, bi(`Listed ${l.quantity} qtl ${l.crop}`, `${l.quantity} क्विंटल ${label("mr", l.crop)} नोंदवला`)),
          };
        }),
      cancelListing: (id: string) =>
        setState((s) => {
          later(bi("Listing cancelled", "नोंद रद्द केली"));
          return { ...s, listings: s.listings.map((l) => (l.id === id ? { ...l, status: "Cancelled" } : l)) };
        }),

      createLot: (listingIds: string[]) =>
        setState((s) => {
          const picked = s.listings.filter((l) => listingIds.includes(l.id));
          if (!picked.length) return s;
          const qty = picked.reduce((a, p) => a + p.quantity, 0);
          const lot: Lot = {
            id: uid("l"),
            crop: picked[0].crop,
            listingIds,
            grades: Array.from(new Set(picked.map((p) => p.grade))),
            village: picked[0].village,
            availableFrom: picked.map((p) => p.availableFrom).sort().at(-1)!,
            mitra: CURRENT_MITRA,
            status: "Open for offers",
            createdAt: today(),
          };
          later(bi(`Lot created: ${qty} qtl ${lot.crop}`, `लॉट तयार: ${qty} क्विंटल ${label("mr", lot.crop)}`));
          return {
            ...s,
            lots: [lot, ...s.lots],
            listings: s.listings.map((l) => (listingIds.includes(l.id) ? { ...l, status: "In lot", lotId: lot.id } : l)),
          };
        }),
      advanceLot: (lotId: string) =>
        setState((s) => {
          const lot = s.lots.find((l) => l.id === lotId);
          if (!lot) return s;
          const next = lot.status === "Offer accepted" ? "Dispatched" : lot.status === "Dispatched" ? "Completed" : lot.status;
          const listingStatus = next === "Dispatched" ? "Dispatched" : next === "Completed" ? "Completed" : undefined;
          later(bi(`Lot marked ${next}`, `लॉट: ${label("mr", next)}`));
          return {
            ...s,
            lots: s.lots.map((l) => (l.id === lotId ? { ...l, status: next } : l)),
            listings: listingStatus ? s.listings.map((l) => (l.lotId === lotId ? { ...l, status: listingStatus } : l)) : s.listings,
          };
        }),

      submitOffer: (o: Pick<Offer, "lotId" | "pricePerQuintal" | "quantity" | "terms">) =>
        setState((s) => {
          const offer: Offer = { ...o, id: uid("o"), buyerId: CURRENT_BUYER_ID, status: "Submitted", createdAt: today() };
          later(bi("Offer sent. Farmers will review it with their Mitra.", "ऑफर पाठवली. शेतकरी मित्रासोबत ती पाहतील."));
          return {
            ...s,
            offers: [offer, ...s.offers],
            listings: s.listings.map((l) =>
              l.lotId === o.lotId && (l.status === "In lot" || l.status === "With Mitra") ? { ...l, status: "Offer received" } : l,
            ),
          };
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
              listings: s.listings.map((l) => (l.lotId === offer.lotId ? { ...l, status: "Accepted" } : l)),
              activityBy: log(s, bi(`Accepted offer of ₹${offer.pricePerQuintal}/qtl`, `₹${offer.pricePerQuintal}/क्विंटल ची ऑफर स्वीकारली`)),
            };
          }
          const offers = s.offers.map((o) => (o.id === offerId ? { ...o, status: "Declined" as const } : o));
          const stillOpen = offers.some((o) => o.lotId === offer.lotId && o.status === "Submitted");
          later(bi("Offer declined", "ऑफर नाकारली"));
          return {
            ...s,
            offers,
            listings: stillOpen ? s.listings : s.listings.map((l) => (l.lotId === offer.lotId ? { ...l, status: "In lot" } : l)),
          };
        }),

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
      requestSupport: (topic: Text) =>
        setState((s) => {
          later(bi("Request sent to the field coordinator", "विनंती क्षेत्र समन्वयकाला पाठवली"));
          return { ...s, activityBy: log(s, bi(`Requested support: ${en(topic)}`, `मदतीची विनंती: ${mr(topic)}`)) };
        }),

      saveEnterprise: (e: Omit<Enterprise, "id" | "owner">) =>
        setState((s) => {
          const existing = s.enterprises.find((x) => x.owner !== null && x.owner === s.sessionId);
          later(existing ? bi("Profile updated", "प्रोफाइल अद्ययावत केले") : bi("Enterprise profile published", "उद्योग प्रोफाइल प्रसिद्ध केले"));
          const ent: Enterprise = { ...e, id: existing?.id ?? uid("e"), owner: s.sessionId };
          return { ...s, enterprises: existing ? s.enterprises.map((x) => (x.id === existing.id ? ent : x)) : [ent, ...s.enterprises] };
        }),
      sendEnquiry: (enterpriseId: string, from: Text, message: string) =>
        setState((s) => {
          later(bi("Enquiry sent through Shet Samruddhi", "चौकशी शेत समृद्धीमार्फत पाठवली"));
          return { ...s, enquiries: [{ id: uid("q"), enterpriseId, from, message, status: "New", createdAt: today() }, ...s.enquiries] };
        }),
      setEnquiryStatus: (id: string, status: Enquiry["status"]) =>
        setState((s) => ({ ...s, enquiries: s.enquiries.map((q) => (q.id === id ? { ...q, status } : q)) })),

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
      activity: state.activityBy[key] ?? [],
    }),
    [state, key],
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

export function lotQuantity(lot: Lot, listings: Listing[]) {
  return listings.filter((l) => lot.listingIds.includes(l.id)).reduce((a, l) => a + l.quantity, 0);
}

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
