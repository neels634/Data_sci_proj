/**
 * Every Mandi Mitra listing status: colour, icon and words, defined once and reused everywhere.
 * A status is never shown by colour alone — always icon + words too.
 */
import { AlertTriangle, CheckCircle2, Clock, Droplets, Package, X, type LucideIcon } from "lucide-react";
import type { Bi } from "./i18n";
import type { ListingStatus } from "./types";

export interface StatusUi {
  icon: LucideIcon;
  /** short pill text */
  pill: Bi;
  /** the plain line under a listing */
  line: Bi;
  /** pill / tint classes */
  tint: string;
  /** border colour class for result cards */
  border: string;
  /** solid dot / icon colour class */
  fg: string;
}

export const STATUS_UI: Record<ListingStatus, StatusUi> = {
  waiting_check: {
    icon: Clock,
    pill: { en: "To be checked", mr: "तपासणी बाकी" },
    line: { en: "The Mitra will check your crop", mr: "मित्र तपासणी करतील" },
    tint: "bg-gold-100 text-[#7a5108]",
    border: "border-gold",
    fg: "text-gold",
  },
  ready: {
    icon: CheckCircle2,
    pill: { en: "Ready", mr: "तयार" },
    line: { en: "Good quality — ready to sell", mr: "चांगला माल — विक्रीसाठी तयार" },
    tint: "bg-leaf-100 text-leaf-900",
    border: "border-leaf-600",
    fg: "text-leaf-700",
  },
  needs_drying: {
    icon: Droplets,
    pill: { en: "Needs drying", mr: "वाळवायला हवे" },
    line: { en: "A bit damp — dry 2–3 days, the Mitra will check again", mr: "थोडा ओला — २–३ दिवस वाळवा, मित्र पुन्हा तपासतील" },
    tint: "bg-sky-100 text-sky-900",
    border: "border-sky-600",
    fg: "text-sky-700",
  },
  low_grade: {
    icon: AlertTriangle,
    pill: { en: "Lower grade", mr: "कमी प्रत" },
    line: { en: "Lower grade — can be sold at this rate", mr: "कमी प्रत — या दराने विकता येईल" },
    tint: "bg-soil-100 text-[#8a3a1d]",
    border: "border-soil",
    fg: "text-soil",
  },
  pooled: {
    icon: Package,
    pill: { en: "In a lot", mr: "लॉटमध्ये" },
    line: { en: "Added to a lot", mr: "लॉटमध्ये जोडले" },
    tint: "bg-indigo-100 text-indigo-900",
    border: "border-indigo-600",
    fg: "text-indigo-700",
  },
  cancelled: {
    icon: X,
    pill: { en: "Cancelled", mr: "रद्द" },
    line: { en: "Cancelled", mr: "रद्द केले" },
    tint: "bg-sand text-muted",
    border: "border-line",
    fg: "text-muted",
  },
};

/** while waiting: whether the farmer chose a grade changes the line */
export const WAITING_WITH_GRADE: Bi = { en: "The Mitra will confirm your grade", mr: "मित्र तुमची प्रत खात्री करतील" };

/** the line under a listing, in its current state */
export function statusLine(status: ListingStatus, gradeCode: string): Bi {
  if (status === "waiting_check" && gradeCode !== "unsure") return WAITING_WITH_GRADE;
  return STATUS_UI[status].line;
}
