"use client";

import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import {
  AGE_GROUPS,
  BEST_TIME,
  BUSINESS_TYPES,
  CONTACT_VIA,
  CROP_OPTIONS,
  DISTRICTS,
  EDUCATION,
  GENDERS,
  INTERESTS,
  IRRIGATION,
  LANGUAGES,
  LIVESTOCK,
  PHONE_ACCESS,
  ROLES,
  SELLS_VIA,
  VEHICLES,
  optionLabel,
  type Option,
} from "@/lib/account";
import { ROLE_HOME } from "@/components/AppShell";
import { Button, Card, PageHeader } from "@/components/ui";
import { VoiceCheck } from "@/components/speech";

function Section({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <Card className="mt-3">
      <p className="mb-2 font-bold text-leaf-900">{title}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[15px]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt>
            <dd className="font-semibold">{v || "—"}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

export default function Profile() {
  const { account: a, state, l, tx, date, logout, toast } = useStore();
  const router = useRouter();
  if (!a) return null;

  const opt = (o: Option[], v: string) => tx(optionLabel(o, v)) || v;
  const opts = (o: Option[], vs: string[]) => vs.map((v) => opt(o, v)).join(", ");
  const yes = (b: boolean) => (b ? l("Yes", "हो") : l("No", "नाही"));
  const initials = a.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div>
      <PageHeader back={ROLE_HOME[state.role]} title={l("My profile", "माझे प्रोफाइल")} />
      <Card className="flex items-center gap-4 bg-leaf-700 text-white">
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-white/15 text-2xl font-bold">{initials}</span>
        <div className="min-w-0">
          <p className="truncate text-xl font-bold">{a.name}</p>
          <p className="text-sm text-white/85">{opt(ROLES, a.role)}</p>
          <p className="text-sm text-white/85">
            +91 {a.mobile.slice(0, 5)} {a.mobile.slice(5)}
          </p>
        </div>
      </Card>

      <Section
        title={l("About you", "तुमच्याबद्दल")}
        rows={[
          [l("Gender", "लिंग"), opt(GENDERS, a.gender)],
          [l("Age", "वय"), opt(AGE_GROUPS, a.ageGroup)],
          [l("Education", "शिक्षण"), opt(EDUCATION, a.education)],
          [l("Other phone", "दुसरा फोन"), a.altMobile ? `+91 ${a.altMobile}` : "—"],
          [l("Member since", "सदस्य कधीपासून"), date(a.createdAt)],
        ]}
      />
      <Section
        title={l("Where you live", "तुम्ही कुठे राहता")}
        rows={[
          [l("State", "राज्य"), l("Maharashtra", "महाराष्ट्र")],
          [l("District", "जिल्हा"), opt(DISTRICTS, a.district)],
          [l("Taluka", "तालुका"), a.taluka],
          [l("Village", "गाव"), a.village],
          [l("PIN code", "पिन कोड"), a.pincode],
        ]}
      />
      {a.role === "farmer" && (
        <Section
          title={l("Your farm and work", "तुमची शेती व काम")}
          rows={[
            [l("Land", "जमीन"), l(`${a.landOwnedAcres || 0} acres own, ${a.landLeasedAcres || 0} leased`, `${a.landOwnedAcres || 0} एकर स्वतःची, ${a.landLeasedAcres || 0} भाड्याची`)],
            [l("Water", "पाणी"), opts(IRRIGATION, a.irrigation)],
            [l("Crops", "पिके"), opts(CROP_OPTIONS, a.crops)],
            [l("Animals", "जनावरे"), opts(LIVESTOCK, a.livestock)],
            [l("Sells via", "विक्री"), opts(SELLS_VIA, a.sellsVia)],
            [l("SHG", "बचत गट"), a.shgMember ? a.shgName : yes(false)],
            [l("FPO", "शेतकरी कंपनी"), a.fpoMember ? a.fpoName : yes(false)],
            [l("Wants help with", "हवी असलेली मदत"), opts(INTERESTS, a.interests)],
            [l("Phone", "फोन"), opt(PHONE_ACCESS, a.phoneAccess)],
          ]}
        />
      )}
      {a.role === "mitra" && (
        <Section
          title={l("Your Mitra work", "तुमचे मित्र म्हणून काम")}
          rows={[
            [l("Experience", "अनुभव"), l(`${a.experienceYears} years`, `${a.experienceYears} वर्षे`)],
            [l("Villages", "गावे"), a.villagesServed],
            [l("Transport", "वाहतूक"), opts(VEHICLES, a.vehicle)],
            [l("Trained", "प्रशिक्षित"), yes(a.mitraTrained)],
          ]}
        />
      )}
      {a.role === "buyer" && (
        <Section
          title={l("Your business", "तुमचा व्यवसाय")}
          rows={[
            [l("Business", "व्यवसाय"), a.businessName],
            [l("Type", "प्रकार"), opt(BUSINESS_TYPES, a.businessType)],
            [l("GSTIN", "GSTIN"), a.gstin || "—"],
            [l("Buys", "खरेदी"), opts(CROP_OPTIONS, a.commodities)],
            [l("Per month", "दरमहा"), l(`${a.monthlyVolumeQtl} quintals`, `${a.monthlyVolumeQtl} क्विंटल`)],
          ]}
        />
      )}
      {a.role === "admin" && (
        <Section
          title={l("Your organisation", "तुमची संस्था")}
          rows={[
            [l("Organisation", "संस्था"), a.organisation],
            [l("Designation", "पद"), a.designation],
          ]}
        />
      )}
      <Section
        title={l("Contact", "संपर्क")}
        rows={[
          [l("Languages", "भाषा"), opts(LANGUAGES, a.languages)],
          [l("Contact by", "संपर्क"), opts(CONTACT_VIA, a.contactVia)],
          [l("Best time", "योग्य वेळ"), opt(BEST_TIME, a.bestTime)],
          [l("Updates", "माहिती पाठवणे"), yes(a.consentContact)],
        ]}
      />

      <p className="mt-4 flex items-start gap-2 text-xs text-muted">
        <ShieldCheck size={16} className="shrink-0" />
        {l(
          "To change these details, ask your Mandi Mitra or field coordinator. Your phone number is never shown to buyers.",
          "ही माहिती बदलण्यासाठी तुमच्या मंडी मित्राला किंवा समन्वयकाला विचारा. तुमचा फोन नंबर खरेदीदारांना कधीही दाखवला जात नाही.",
        )}
      </p>

      <Card className="mt-4">
        <VoiceCheck />
      </Card>

      <Button
        variant="secondary"
        full
        className="mt-5"
        onClick={() => {
          logout();
          router.push("/");
        }}
      >
        <LogOut size={18} /> {l("Log out", "लॉग आउट")}
      </Button>
      <button onClick={() => toast({ en: "Deletion request recorded", mr: "माहिती हटवण्याची विनंती नोंदवली" })} className="mt-2 min-h-11 w-full text-sm font-semibold text-soil">
        {l("Request deletion of my data", "माझी माहिती हटवण्याची विनंती करा")}
      </button>
    </div>
  );
}
