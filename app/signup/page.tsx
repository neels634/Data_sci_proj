"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BarChart3, Check, Pencil, ShoppingBasket, Truck, Wheat } from "lucide-react";
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
  emptyAccount,
  hashPin,
  optionLabel,
  type Option,
} from "@/lib/account";
import type { Role } from "@/lib/types";
import Chips from "@/components/Chips";
import { ROLE_HOME } from "@/components/AppShell";
import { Button, Card, Field, cx, inputCls } from "@/components/ui";

type Draft = ReturnType<typeof emptyAccount>;
type StepId = "role" | "about" | "place" | "details" | "contact" | "review";
const STEPS: StepId[] = ["role", "about", "place", "details", "contact", "review"];

const ROLE_ICON: Record<Role, React.ReactNode> = {
  farmer: <Wheat size={26} />,
  mitra: <Truck size={26} />,
  buyer: <ShoppingBasket size={26} />,
  admin: <BarChart3 size={26} />,
};

export default function SignUp() {
  const { state, account, l, tx, setLang, register } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Draft>(emptyAccount);
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // pre-fill the number typed on the login page
  useEffect(() => {
    const m = new URLSearchParams(window.location.search).get("m");
    if (m && /^\d{10}$/.test(m)) setD((x) => ({ ...x, mobile: m }));
  }, []);

  useEffect(() => {
    if (account && !saving) router.replace(ROLE_HOME[account.role]);
  }, [account, router, saving]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setD((x) => ({ ...x, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };
  const req = l("Please answer this", "कृपया हे भरा");
  const pick = l("Choose at least one", "किमान एक निवडा");
  const id = STEPS[step];

  const titles: Record<StepId, [string, string]> = {
    role: [l("How will you use Shet Samruddhi?", "तुम्ही शेत समृद्धी कसे वापरणार?"), l("Choose one. You can ask your Mitra if unsure.", "एक निवडा. खात्री नसल्यास मित्राला विचारा.")],
    about: [l("About you", "तुमच्याबद्दल"), l("So we can address you correctly and suggest the right schemes.", "तुम्हाला योग्य योजना सुचवण्यासाठी.")],
    place: [l("Where you live", "तुम्ही कुठे राहता"), l("Schemes, buyers and your Mitra depend on your location.", "योजना, खरेदीदार व मित्र तुमच्या ठिकाणावर अवलंबून असतात.")],
    details:
      d.role === "farmer"
        ? [l("Your farm and work", "तुमची शेती व काम"), l("Helps us match schemes, buyers and business ideas.", "योजना, खरेदीदार व व्यवसाय कल्पना जुळवण्यासाठी.")]
        : d.role === "mitra"
          ? [l("Your Mitra work", "तुमचे मित्र म्हणून काम"), l("Helps us connect you with farmers nearby.", "जवळच्या शेतकऱ्यांशी जोडण्यासाठी.")]
          : d.role === "buyer"
            ? [l("Your business", "तुमचा व्यवसाय"), l("Farmers and Mitras see your business name, not your phone number.", "शेतकऱ्यांना तुमच्या व्यवसायाचे नाव दिसते, फोन नंबर नाही.")]
            : [l("Your organisation", "तुमची संस्था"), l("For admin and coordinator access.", "प्रशासक व समन्वयक प्रवेशासाठी.")],
    contact: [l("Contact & security", "संपर्क व सुरक्षा"), l("How we reach you, and a PIN to log in.", "आम्ही संपर्क कसा करावा, आणि लॉग इनसाठी PIN.")],
    review: [l("Check your details", "तुमची माहिती तपासा"), l("Tap Edit to change anything.", "बदलण्यासाठी ‘बदला’ दाबा.")],
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const num = (v: string) => v.trim() !== "" && !Number.isNaN(Number(v)) && Number(v) >= 0;
    if (id === "role") {
      if (!/^[6-9]\d{9}$/.test(d.mobile)) e.mobile = l("Enter a valid 10-digit mobile number", "योग्य 10 अंकी मोबाईल नंबर लिहा");
      else if (state.accounts.some((a) => a.mobile === d.mobile)) e.mobile = l("This number already has an account — log in instead", "या नंबरवर आधीच खाते आहे — लॉग इन करा");
    }
    if (id === "about") {
      if (d.name.trim().length < 2) e.name = l("Enter your full name", "तुमचे पूर्ण नाव लिहा");
      if (!d.gender) e.gender = req;
      if (!d.ageGroup) e.ageGroup = req;
      if (!d.education) e.education = req;
      if (d.altMobile && !/^[6-9]\d{9}$/.test(d.altMobile)) e.altMobile = l("Enter a valid 10-digit number or leave empty", "योग्य 10 अंकी नंबर लिहा किंवा रिकामे ठेवा");
    }
    if (id === "place") {
      if (!d.district) e.district = req;
      if (!d.taluka.trim()) e.taluka = req;
      if (!d.village.trim()) e.village = req;
      if (!/^\d{6}$/.test(d.pincode)) e.pincode = l("Enter the 6-digit PIN code", "6 अंकी पिन कोड लिहा");
    }
    if (id === "details") {
      if (d.role === "farmer") {
        if (!num(d.landOwnedAcres)) e.landOwnedAcres = l("Enter acres (0 if none)", "एकर लिहा (नसल्यास 0)");
        if (d.landLeasedAcres && !num(d.landLeasedAcres)) e.landLeasedAcres = l("Enter a number", "आकडा लिहा");
        if (!d.irrigation.length) e.irrigation = pick;
        if (!d.crops.length) e.crops = pick;
        if (!d.livestock.length) e.livestock = pick;
        if (d.shgMember && !d.shgName.trim()) e.shgName = req;
        if (d.fpoMember && !d.fpoName.trim()) e.fpoName = req;
        if (!d.sellsVia.length) e.sellsVia = pick;
        if (!d.interests.length) e.interests = pick;
        if (!d.phoneAccess) e.phoneAccess = req;
      }
      if (d.role === "mitra") {
        if (!num(d.experienceYears)) e.experienceYears = req;
        if (!num(d.villagesServed) || Number(d.villagesServed) < 1) e.villagesServed = req;
        if (!d.vehicle.length) e.vehicle = pick;
      }
      if (d.role === "buyer") {
        if (!d.businessName.trim()) e.businessName = req;
        if (!d.businessType) e.businessType = req;
        if (d.gstin && !/^[0-9]{2}[A-Z0-9]{13}$/i.test(d.gstin)) e.gstin = l("GSTIN has 15 characters — check it or leave empty", "GSTIN 15 अक्षरी असतो — तपासा किंवा रिकामे ठेवा");
        if (!d.commodities.length) e.commodities = pick;
        if (!num(d.monthlyVolumeQtl)) e.monthlyVolumeQtl = req;
      }
      if (d.role === "admin") {
        if (!d.organisation.trim()) e.organisation = req;
        if (!d.designation.trim()) e.designation = req;
      }
    }
    if (id === "contact") {
      if (!d.languages.length) e.languages = pick;
      if (!d.contactVia.length) e.contactVia = pick;
      if (!d.bestTime) e.bestTime = req;
      if (!/^\d{4}$/.test(pin)) e.pin = l("PIN must be 4 digits", "PIN 4 अंकी असावा");
      else if (/^(\d)\1{3}$/.test(pin) || ["1234", "4321", "0123"].includes(pin)) e.pin = l("Choose a PIN that is harder to guess", "सहज ओळखता येणार नाही असा PIN निवडा");
      if (pin2 !== pin) e.pin2 = l("PINs do not match", "दोन्ही PIN जुळत नाहीत");
      if (!d.consentData) e.consentData = l("Needed to create your account", "खाते तयार करण्यासाठी आवश्यक");
    }
    setErrors(e);
    const ok = Object.keys(e).length === 0;
    // bring the first problem into view on long steps
    if (!ok) setTimeout(() => document.querySelector("main .text-soil")?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
    return ok;
  };

  const next = () => {
    if (!validate()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => (step === 0 ? router.push("/") : setStep((s) => s - 1));

  const create = async () => {
    setSaving(true);
    const pinHash = await hashPin(d.mobile, pin);
    const acc = { ...d, name: d.name.trim(), id: `acc-${Date.now().toString(36)}`, pinHash, createdAt: new Date().toISOString().slice(0, 10) };
    register(acc);
    router.push(ROLE_HOME[acc.role]);
  };

  const opt = (opts: Option[], v: string) => tx(optionLabel(opts, v)) || v;
  const opts = (o: Option[], vs: string[]) => vs.map((v) => opt(o, v)).join(", ");
  const yes = (b: boolean) => (b ? l("Yes", "हो") : l("No", "नाही"));

  return (
    <div className="pb-32">
      {/* top bar */}
      <div className="sticky top-0 z-20 -mx-4 border-b border-line bg-cream/95 px-4 pb-3 pt-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <button onClick={back} className="-ml-2 flex min-h-11 items-center gap-1 rounded-xl px-2 font-semibold text-leaf-700">
            <ArrowLeft size={20} /> {step === 0 ? l("Log in", "लॉग इन") : l("Back", "मागे")}
          </button>
          <button
            onClick={() => setLang(state.lang === "en" ? "mr" : "en")}
            className="min-h-10 rounded-full border border-line bg-white px-3 text-sm font-semibold text-leaf-700"
          >
            {state.lang === "en" ? "मराठी" : "English"}
          </button>
        </div>
        <p className="mt-1 text-sm font-semibold text-muted">
          {l(`Step ${step + 1} of ${STEPS.length}`, `पायरी ${step + 1} / ${STEPS.length}`)}
        </p>
        <div className="mt-1.5 flex gap-1" aria-hidden>
          {STEPS.map((s, i) => (
            <span key={s} className={cx("h-1.5 flex-1 rounded-full", i <= step ? "bg-leaf-700" : "bg-line")} />
          ))}
        </div>
      </div>

      <h1 className="mt-5 text-2xl font-bold leading-tight">{titles[id][0]}</h1>
      <p className="mt-1 text-[15px] text-muted">{titles[id][1]}</p>

      <div className="mt-5 space-y-5">
        {id === "role" && (
          <>
            <Field label={l("Mobile number", "मोबाईल नंबर")} error={errors.mobile} hint={l("You will log in with this number.", "या नंबरने तुम्ही लॉग इन कराल.")}>
              <div className="flex">
                <span className="grid min-h-12 place-items-center rounded-l-xl border border-r-0 border-line bg-sand px-3 font-semibold text-muted">+91</span>
                <input
                  inputMode="numeric"
                  maxLength={10}
                  className={cx(inputCls, "rounded-l-none text-lg tracking-wider")}
                  value={d.mobile}
                  onChange={(e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                />
              </div>
            </Field>
            <div className="space-y-2" role="radiogroup" aria-label={titles.role[0]}>
              {ROLES.map((r) => {
                const on = d.role === r.value;
                return (
                  <button
                    type="button"
                    key={r.value}
                    role="radio"
                    aria-checked={on}
                    onClick={() => set("role", r.value as Role)}
                    className={cx(
                      "flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left",
                      on ? "border-leaf-700 ring-2 ring-leaf-700/20" : "border-line",
                    )}
                  >
                    <span className={cx("grid size-12 shrink-0 place-items-center rounded-full", on ? "bg-leaf-700 text-white" : "bg-leaf-100 text-leaf-700")}>
                      {ROLE_ICON[r.value as Role]}
                    </span>
                    <span className="flex-1 font-bold">{tx(r.label)}</span>
                    {on && <Check className="text-leaf-700" />}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {id === "about" && (
          <>
            <Field label={l("Full name", "पूर्ण नाव")} error={errors.name}>
              <input className={inputCls} autoComplete="name" value={d.name} onChange={(e) => set("name", e.target.value)} placeholder={l("e.g. Sunita Pawar", "उदा. सुनीता पवार")} />
            </Field>
            <Chips label={l("Gender", "लिंग")} options={GENDERS} value={d.gender} onChange={(v) => set("gender", v)} error={errors.gender} />
            <Chips label={l("Age", "वय")} options={AGE_GROUPS} value={d.ageGroup} onChange={(v) => set("ageGroup", v)} error={errors.ageGroup} />
            <Chips label={l("Education", "शिक्षण")} options={EDUCATION} value={d.education} onChange={(v) => set("education", v)} error={errors.education} />
            <Field label={l("Another phone number (optional)", "दुसरा फोन नंबर (ऐच्छिक)")} error={errors.altMobile} hint={l("A family member we can call if we can’t reach you.", "तुमच्याशी संपर्क न झाल्यास घरातील व्यक्तीचा नंबर.")}>
              <input inputMode="numeric" maxLength={10} className={inputCls} value={d.altMobile} onChange={(e) => set("altMobile", e.target.value.replace(/\D/g, "").slice(0, 10))} />
            </Field>
          </>
        )}

        {id === "place" && (
          <>
            <Field label={l("State", "राज्य")}>
              <input className={cx(inputCls, "bg-sand text-muted")} value={l("Maharashtra", "महाराष्ट्र")} readOnly />
            </Field>
            <Field label={l("District", "जिल्हा")} error={errors.district}>
              <select className={inputCls} value={d.district} onChange={(e) => set("district", e.target.value)}>
                <option value="">{l("Choose district", "जिल्हा निवडा")}</option>
                {DISTRICTS.map((x) => (
                  <option key={x.value} value={x.value}>
                    {tx(x.label)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={l("Taluka", "तालुका")} error={errors.taluka}>
              <input className={inputCls} value={d.taluka} onChange={(e) => set("taluka", e.target.value)} />
            </Field>
            <Field label={l("Village / town", "गाव / शहर")} error={errors.village}>
              <input className={inputCls} value={d.village} onChange={(e) => set("village", e.target.value)} />
            </Field>
            <Field label={l("PIN code", "पिन कोड")} error={errors.pincode}>
              <input inputMode="numeric" maxLength={6} className={inputCls} value={d.pincode} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} />
            </Field>
          </>
        )}

        {id === "details" && d.role === "farmer" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label={l("Land you own (acres)", "स्वतःची जमीन (एकर)")} error={errors.landOwnedAcres}>
                <input inputMode="decimal" className={inputCls} value={d.landOwnedAcres} onChange={(e) => set("landOwnedAcres", e.target.value)} placeholder="0" />
              </Field>
              <Field label={l("Leased land (acres)", "भाड्याची जमीन (एकर)")} error={errors.landLeasedAcres}>
                <input inputMode="decimal" className={inputCls} value={d.landLeasedAcres} onChange={(e) => set("landLeasedAcres", e.target.value)} placeholder="0" />
              </Field>
            </div>
            <Chips multi label={l("Water for your farm", "शेतीसाठी पाणी")} options={IRRIGATION} value={d.irrigation} onChange={(v) => set("irrigation", v)} error={errors.irrigation} />
            <Chips multi label={l("Crops you grow", "तुम्ही घेत असलेली पिके")} options={CROP_OPTIONS} value={d.crops} onChange={(v) => set("crops", v)} error={errors.crops} />
            <Chips multi label={l("Animals", "जनावरे")} options={LIVESTOCK} value={d.livestock} onChange={(v) => set("livestock", v.includes("none") && !d.livestock.includes("none") ? ["none"] : v.filter((x) => x !== "none"))} error={errors.livestock} />
            <Chips multi label={l("Where do you sell today?", "सध्या माल कुठे विकता?")} options={SELLS_VIA} value={d.sellsVia} onChange={(v) => set("sellsVia", v)} error={errors.sellsVia} />
            <Card className="space-y-3">
              <label className="flex min-h-11 items-center gap-3">
                <input type="checkbox" className="size-5 accent-leaf-700" checked={d.shgMember} onChange={(e) => set("shgMember", e.target.checked)} />
                <span className="font-semibold">{l("I am a member of a Self-Help Group (SHG)", "मी बचत गटाची सदस्य आहे")}</span>
              </label>
              {d.shgMember && (
                <Field label={l("SHG name", "बचत गटाचे नाव")} error={errors.shgName}>
                  <input className={inputCls} value={d.shgName} onChange={(e) => set("shgName", e.target.value)} />
                </Field>
              )}
              <label className="flex min-h-11 items-center gap-3">
                <input type="checkbox" className="size-5 accent-leaf-700" checked={d.fpoMember} onChange={(e) => set("fpoMember", e.target.checked)} />
                <span className="font-semibold">{l("I am a member of an FPO / cooperative", "मी शेतकरी उत्पादक कंपनी / सहकारी संस्थेचा सदस्य आहे")}</span>
              </label>
              {d.fpoMember && (
                <Field label={l("FPO / cooperative name", "कंपनी / संस्थेचे नाव")} error={errors.fpoName}>
                  <input className={inputCls} value={d.fpoName} onChange={(e) => set("fpoName", e.target.value)} />
                </Field>
              )}
            </Card>
            <Chips multi label={l("What help do you want?", "तुम्हाला कोणती मदत हवी आहे?")} options={INTERESTS} value={d.interests} onChange={(v) => set("interests", v)} error={errors.interests} />
            <Chips label={l("Which phone will you use?", "कोणता फोन वापराल?")} options={PHONE_ACCESS} value={d.phoneAccess} onChange={(v) => set("phoneAccess", v)} error={errors.phoneAccess} />
          </>
        )}

        {id === "details" && d.role === "mitra" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label={l("Years of experience", "अनुभव (वर्षे)")} error={errors.experienceYears}>
                <input inputMode="numeric" className={inputCls} value={d.experienceYears} onChange={(e) => set("experienceYears", e.target.value)} />
              </Field>
              <Field label={l("Villages you can serve", "किती गावांत काम कराल")} error={errors.villagesServed}>
                <input inputMode="numeric" className={inputCls} value={d.villagesServed} onChange={(e) => set("villagesServed", e.target.value)} />
              </Field>
            </div>
            <Chips multi label={l("Transport you can arrange", "तुम्ही करू शकणारी वाहतूक")} options={VEHICLES} value={d.vehicle} onChange={(v) => set("vehicle", v)} error={errors.vehicle} />
            <label className="flex min-h-12 items-center gap-3 rounded-xl border border-line bg-white px-3">
              <input type="checkbox" className="size-5 accent-leaf-700" checked={d.mitraTrained} onChange={(e) => set("mitraTrained", e.target.checked)} />
              <span className="font-semibold">{l("I have completed Mandi Mitra training", "मी मंडी मित्र प्रशिक्षण पूर्ण केले आहे")}</span>
            </label>
          </>
        )}

        {id === "details" && d.role === "buyer" && (
          <>
            <Field label={l("Business name", "व्यवसायाचे नाव")} error={errors.businessName}>
              <input className={inputCls} value={d.businessName} onChange={(e) => set("businessName", e.target.value)} />
            </Field>
            <Chips label={l("Type of business", "व्यवसायाचा प्रकार")} options={BUSINESS_TYPES} value={d.businessType} onChange={(v) => set("businessType", v)} error={errors.businessType} />
            <Field label={l("GSTIN (optional)", "GSTIN (ऐच्छिक)")} error={errors.gstin} hint={l("Helps us verify your business later.", "नंतर तुमच्या व्यवसायाची पडताळणी करण्यास मदत होते.")}>
              <input className={cx(inputCls, "uppercase")} maxLength={15} value={d.gstin} onChange={(e) => set("gstin", e.target.value.toUpperCase())} />
            </Field>
            <Chips multi label={l("What do you buy?", "तुम्ही काय खरेदी करता?")} options={CROP_OPTIONS} value={d.commodities} onChange={(v) => set("commodities", v)} error={errors.commodities} />
            <Field label={l("How much per month? (quintals)", "दरमहा किती? (क्विंटल)")} error={errors.monthlyVolumeQtl}>
              <input inputMode="numeric" className={inputCls} value={d.monthlyVolumeQtl} onChange={(e) => set("monthlyVolumeQtl", e.target.value)} />
            </Field>
          </>
        )}

        {id === "details" && d.role === "admin" && (
          <>
            <Field label={l("Organisation", "संस्था")} error={errors.organisation}>
              <input className={inputCls} value={d.organisation} onChange={(e) => set("organisation", e.target.value)} />
            </Field>
            <Field label={l("Designation", "पद")} error={errors.designation}>
              <input className={inputCls} value={d.designation} onChange={(e) => set("designation", e.target.value)} />
            </Field>
          </>
        )}

        {id === "contact" && (
          <>
            <Chips multi label={l("Languages you speak", "तुम्ही बोलता त्या भाषा")} options={LANGUAGES} value={d.languages} onChange={(v) => set("languages", v)} error={errors.languages} />
            <Chips multi label={l("How should we contact you?", "आम्ही संपर्क कसा करावा?")} options={CONTACT_VIA} value={d.contactVia} onChange={(v) => set("contactVia", v)} error={errors.contactVia} />
            <Chips label={l("Best time to call", "फोनसाठी योग्य वेळ")} options={BEST_TIME} value={d.bestTime} onChange={(v) => set("bestTime", v)} error={errors.bestTime} />
            <Card className="space-y-3 bg-leaf-50">
              <p className="font-bold">{l("Create a 4-digit PIN", "4 अंकी PIN तयार करा")}</p>
              <p className="text-sm text-muted">{l("You will use it to log in. Don’t share it with anyone.", "लॉग इनसाठी वापराल. कोणालाही सांगू नका.")}</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label={l("PIN", "PIN")} error={errors.pin}>
                  <input type="password" inputMode="numeric" autoComplete="new-password" maxLength={4} className={cx(inputCls, "text-center text-2xl tracking-[0.5em]")} value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setErrors((x) => ({ ...x, pin: "" })); }} />
                </Field>
                <Field label={l("Repeat PIN", "PIN पुन्हा")} error={errors.pin2}>
                  <input type="password" inputMode="numeric" autoComplete="new-password" maxLength={4} className={cx(inputCls, "text-center text-2xl tracking-[0.5em]")} value={pin2} onChange={(e) => { setPin2(e.target.value.replace(/\D/g, "").slice(0, 4)); setErrors((x) => ({ ...x, pin2: "" })); }} />
                </Field>
              </div>
            </Card>
            <div className="space-y-2">
              <label className="flex items-start gap-3 rounded-xl border border-line bg-white p-3 text-sm">
                <input type="checkbox" className="mt-0.5 size-5 accent-leaf-700" checked={d.consentData} onChange={(e) => set("consentData", e.target.checked)} />
                <span>
                  {l(
                    "I agree that Shet Samruddhi stores these details to suggest schemes and connect me with Mitras and buyers. My phone number is never shown publicly and my data is never sold. I can ask for it to be deleted.",
                    "योजना सुचवण्यासाठी व मित्र आणि खरेदीदारांशी जोडण्यासाठी शेत समृद्धीने ही माहिती जतन करण्यास माझी संमती आहे. माझा फोन नंबर कधीही सार्वजनिक केला जात नाही आणि माहिती विकली जात नाही. मी ती हटवण्याची मागणी करू शकते/शकतो.",
                  )}
                </span>
              </label>
              {errors.consentData && <p className="text-sm font-semibold text-soil">{errors.consentData}</p>}
              <label className="flex items-start gap-3 rounded-xl border border-line bg-white p-3 text-sm">
                <input type="checkbox" className="mt-0.5 size-5 accent-leaf-700" checked={d.consentContact} onChange={(e) => set("consentContact", e.target.checked)} />
                <span>{l("Send me updates about schemes, buyers and training (optional).", "योजना, खरेदीदार व प्रशिक्षणाबद्दल मला माहिती पाठवा (ऐच्छिक).")}</span>
              </label>
            </div>
          </>
        )}

        {id === "review" && (
          <>
            <Review
              title={l("Account", "खाते")}
              onEdit={() => setStep(0)}
              rows={[
                [l("Mobile", "मोबाईल"), `+91 ${d.mobile}`],
                [l("Role", "भूमिका"), opt(ROLES, d.role)],
              ]}
            />
            <Review
              title={titles.about[0]}
              onEdit={() => setStep(1)}
              rows={[
                [l("Name", "नाव"), d.name],
                [l("Gender", "लिंग"), opt(GENDERS, d.gender)],
                [l("Age", "वय"), opt(AGE_GROUPS, d.ageGroup)],
                [l("Education", "शिक्षण"), opt(EDUCATION, d.education)],
                [l("Other phone", "दुसरा फोन"), d.altMobile || "—"],
              ]}
            />
            <Review
              title={titles.place[0]}
              onEdit={() => setStep(2)}
              rows={[
                [l("District", "जिल्हा"), opt(DISTRICTS, d.district)],
                [l("Taluka", "तालुका"), d.taluka],
                [l("Village", "गाव"), d.village],
                [l("PIN code", "पिन कोड"), d.pincode],
              ]}
            />
            <Review
              title={titles.details[0]}
              onEdit={() => setStep(3)}
              rows={
                d.role === "farmer"
                  ? [
                      [l("Land", "जमीन"), l(`${d.landOwnedAcres || 0} acres own, ${d.landLeasedAcres || 0} leased`, `${d.landOwnedAcres || 0} एकर स्वतःची, ${d.landLeasedAcres || 0} भाड्याची`)],
                      [l("Water", "पाणी"), opts(IRRIGATION, d.irrigation)],
                      [l("Crops", "पिके"), opts(CROP_OPTIONS, d.crops)],
                      [l("Animals", "जनावरे"), opts(LIVESTOCK, d.livestock)],
                      [l("Sells via", "विक्री"), opts(SELLS_VIA, d.sellsVia)],
                      [l("SHG", "बचत गट"), d.shgMember ? d.shgName : yes(false)],
                      [l("FPO", "शेतकरी कंपनी"), d.fpoMember ? d.fpoName : yes(false)],
                      [l("Wants help with", "हवी असलेली मदत"), opts(INTERESTS, d.interests)],
                      [l("Phone", "फोन"), opt(PHONE_ACCESS, d.phoneAccess)],
                    ]
                  : d.role === "mitra"
                    ? [
                        [l("Experience", "अनुभव"), l(`${d.experienceYears} years`, `${d.experienceYears} वर्षे`)],
                        [l("Villages", "गावे"), d.villagesServed],
                        [l("Transport", "वाहतूक"), opts(VEHICLES, d.vehicle)],
                        [l("Trained", "प्रशिक्षित"), yes(d.mitraTrained)],
                      ]
                    : d.role === "buyer"
                      ? [
                          [l("Business", "व्यवसाय"), d.businessName],
                          [l("Type", "प्रकार"), opt(BUSINESS_TYPES, d.businessType)],
                          [l("GSTIN", "GSTIN"), d.gstin || "—"],
                          [l("Buys", "खरेदी"), opts(CROP_OPTIONS, d.commodities)],
                          [l("Per month", "दरमहा"), l(`${d.monthlyVolumeQtl} quintals`, `${d.monthlyVolumeQtl} क्विंटल`)],
                        ]
                      : [
                          [l("Organisation", "संस्था"), d.organisation],
                          [l("Designation", "पद"), d.designation],
                        ]
              }
            />
            <Review
              title={titles.contact[0]}
              onEdit={() => setStep(4)}
              rows={[
                [l("Languages", "भाषा"), opts(LANGUAGES, d.languages)],
                [l("Contact by", "संपर्क"), opts(CONTACT_VIA, d.contactVia)],
                [l("Best time", "योग्य वेळ"), opt(BEST_TIME, d.bestTime)],
                [l("PIN", "PIN"), "••••"],
                [l("Updates", "माहिती पाठवणे"), yes(d.consentContact)],
              ]}
            />
          </>
        )}
      </div>

      {/* bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-line bg-white/95 p-3 backdrop-blur">
        {id === "review" ? (
          <Button full className="min-h-14 text-lg" onClick={create} disabled={saving}>
            <Check size={20} /> {saving ? l("Creating…", "तयार करत आहे…") : l("Create my account", "माझे खाते तयार करा")}
          </Button>
        ) : (
          <Button full className="min-h-14 text-lg" onClick={next}>
            {l("Next", "पुढे")} <ArrowRight size={20} />
          </Button>
        )}
        {step === 0 && (
          <p className="mt-2 text-center text-sm text-muted">
            {l("Already registered?", "आधीच नोंदणी केली आहे?")}{" "}
            <Link href="/" className="font-semibold text-leaf-700 underline">
              {l("Log in", "लॉग इन करा")}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

function Review({ title, rows, onEdit }: { title: string; rows: [string, string][]; onEdit: () => void }) {
  const { l } = useStore();
  return (
    <Card>
      <div className="mb-2 flex items-center justify-between">
        <p className="font-bold">{title}</p>
        <button onClick={onEdit} className="flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-leaf-700">
          <Pencil size={14} /> {l("Edit", "बदला")}
        </button>
      </div>
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
