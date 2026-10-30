import type { Bi, Text } from "./i18n";

export type Role = "farmer" | "mitra" | "buyer" | "admin";
export type Lang = "en" | "mr";

export type SchemeCategory =
  | "Income support"
  | "Crop insurance"
  | "Credit"
  | "Irrigation"
  | "Mechanisation"
  | "Women & SHG"
  | "Food processing";

export type TrackerStatus =
  | "Interested"
  | "Preparing documents"
  | "Applied"
  | "Approved"
  | "Rejected"
  | "Needs follow-up";

export interface Scheme {
  id: string;
  name: Bi;
  department: Bi;
  level: "Central" | "Maharashtra";
  category: SchemeCategory;
  summary: Bi;
  benefits: Bi[];
  eligibility: Bi[];
  documents: Bi[];
  steps: Bi[];
  officialUrl: string;
  source: string;
  /** ISO date set by an admin after checking the official source; null = not yet verified */
  lastVerified: string | null;
  status: "active" | "flagged" | "archived";
  /** used for indicative profile matching only */
  tags: ("all-farmers" | "landholding" | "women" | "processing" | "irrigation" | "credit")[];
}

export interface FarmerProfile {
  name: Text;
  village: Text;
  district: Text;
  crops: string[];
  landholding: "" | "under-1ha" | "1-2ha" | "over-2ha";
  womenLed: boolean;
  consent: boolean;
}

export type ListingStatus =
  | "Submitted"
  | "With Mitra"
  | "In lot"
  | "Offer received"
  | "Accepted"
  | "Dispatched"
  | "Completed"
  | "Cancelled";

export interface Listing {
  id: string;
  farmer: Text;
  /** account id of the farmer who listed it; null for other farmers */
  owner: string | null;
  crop: string;
  quantity: number; // quintals
  grade: "A" | "B" | "C" | "Ungraded";
  village: Text;
  availableFrom: string;
  expectedPrice: number | null; // ₹ per quintal, indicative
  wantsMitra: boolean;
  status: ListingStatus;
  lotId: string | null;
  createdAt: string;
}

export interface Lot {
  id: string;
  crop: string;
  listingIds: string[];
  grades: string[];
  village: Text;
  availableFrom: string;
  mitra: Text;
  status: "Open for offers" | "Offer accepted" | "Dispatched" | "Completed";
  createdAt: string;
}

export interface Offer {
  id: string;
  lotId: string;
  buyerId: string;
  pricePerQuintal: number;
  quantity: number;
  terms: Text;
  status: "Submitted" | "Accepted" | "Declined";
  createdAt: string;
}

export interface Buyer {
  id: string;
  name: Bi;
  type: "Trader" | "Processor" | "Retailer" | "Wholesaler";
  location: Bi;
  commodities: string[];
  verified: boolean;
}

export interface Guide {
  id: string;
  title: Bi;
  crop: string;
  summary: Bi;
  steps: { heading: Bi; body: Bi }[];
  equipment: Bi[];
  compliance: Bi;
  defaults: CostInputs;
}

export interface CostInputs {
  units: number;
  rawMaterial: number;
  processing: number;
  packaging: number;
  labour: number;
  transport: number;
  other: number;
  sellingPrice: number;
}

export interface BusinessPlan {
  id: string;
  owner: string | null;
  guideId: string | null;
  product: Text;
  inputs: CostInputs;
  notes: string;
  savedAt: string;
}

export interface Enterprise {
  id: string;
  name: Text;
  group: Text;
  members: number;
  village: Text;
  products: { name: Text; unit: Text; price: number }[];
  story: Text;
  owner: string | null;
  consentToShowcase: boolean;
}

export interface Enquiry {
  id: string;
  enterpriseId: string;
  from: Text;
  message: Text;
  status: "New" | "Replied" | "Closed";
  createdAt: string;
}

export interface Report {
  id: string;
  about: Text;
  reason: Text;
  status: "Open" | "Resolved";
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  text: Bi;
  at: string;
}
