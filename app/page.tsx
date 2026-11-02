"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Lock, Mic, Phone, ShieldCheck, Sprout, UserPlus } from "lucide-react";
import { useStore } from "@/lib/store";
import { hashPin, type Account } from "@/lib/account";
import { ROLE_HOME } from "@/components/AppShell";
import { Button, cx, inputCls } from "@/components/ui";
import { Input } from "@/components/voice";

const MAX_TRIES = 5;

export default function Login() {
  const { state, account, l, setLang, login, toast } = useStore();
  const router = useRouter();
  const [step, setStep] = useState<"mobile" | "pin">("mobile");
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [found, setFound] = useState<Account | null>(null);
  const [tries, setTries] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const pinRef = useRef<HTMLInputElement>(null);

  // already signed in → straight to the right home
  useEffect(() => {
    if (account) router.replace(ROLE_HOME[account.role]);
  }, [account, router]);

  useEffect(() => {
    if (step === "pin") pinRef.current?.focus();
  }, [step]);

  const checkMobile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) return setErr(l("Enter a valid 10-digit mobile number.", "योग्य 10 अंकी मोबाईल नंबर लिहा."));
    const a = state.accounts.find((x) => x.mobile === mobile);
    setErr("");
    if (!a) {
      setFound(null);
      return setErr("none");
    }
    setFound(a);
    setPin("");
    setStep("pin");
  };

  const checkPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!found) return;
    if (Date.now() < lockedUntil) return setErr(l("Too many wrong tries. Please wait 30 seconds.", "खूप वेळा चुकीचा PIN. कृपया 30 सेकंद थांबा."));
    if (!/^\d{4}$/.test(pin)) return setErr(l("Enter your 4-digit PIN.", "तुमचा 4 अंकी PIN लिहा."));
    const ok = (await hashPin(found.mobile, pin)) === found.pinHash;
    if (!ok) {
      const n = tries + 1;
      setTries(n);
      setPin("");
      if (n >= MAX_TRIES) {
        setLockedUntil(Date.now() + 30_000);
        setTries(0);
        return setErr(l("Too many wrong tries. Please wait 30 seconds.", "खूप वेळा चुकीचा PIN. कृपया 30 सेकंद थांबा."));
      }
      return setErr(l(`Wrong PIN. ${MAX_TRIES - n} tries left.`, `चुकीचा PIN. अजून ${MAX_TRIES - n} प्रयत्न बाकी.`));
    }
    login(found.id);
    toast({ en: `Welcome, ${found.name}`, mr: `स्वागत आहे, ${found.name}` });
    router.push(ROLE_HOME[found.role]);
  };

  return (
    <div className="pb-10">
      <div className="-mx-4 bg-leaf-700 px-6 pb-10 pt-10 text-white">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15">
              <Sprout size={20} />
            </span>
            <p className="text-lg font-bold leading-tight">{l("Shet Samruddhi", "शेत समृद्धी")}</p>
          </div>
          <div className="inline-flex shrink-0 rounded-full bg-white/15 p-1" role="group" aria-label={l("Language", "भाषा")}>
            {(["mr", "en"] as const).map((x) => (
              <button
                key={x}
                onClick={() => setLang(x)}
                className={cx("min-h-9 rounded-full px-2.5 text-sm font-semibold", state.lang === x ? "bg-white text-leaf-900" : "text-white")}
              >
                {x === "mr" ? "मराठी" : "English"}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-6 text-[26px] font-bold leading-tight">{l("Opportunities for your village, in one place", "तुमच्या गावासाठी संधी, एकाच ठिकाणी")}</p>
        <p className="mt-2 text-white/85">
          {l("Schemes, buyers, a local Mandi Mitra and business guidance.", "योजना, खरेदीदार, गावातील मंडी मित्र आणि व्यवसाय मार्गदर्शन.")}
        </p>
      </div>

      <div className="-mt-5 rounded-3xl border border-line bg-white p-5 shadow-sm">
        {step === "mobile" ? (
          <form onSubmit={checkMobile} noValidate>
            <h1 className="text-xl font-bold">{l("Log in", "लॉग इन करा")}</h1>
            <p className="text-sm text-muted">{l("Use the mobile number you registered with.", "नोंदणी केलेला मोबाईल नंबर वापरा.")}</p>
            <p className="mt-2 flex items-center gap-1.5 rounded-xl bg-leaf-50 px-3 py-2 text-sm text-leaf-900">
              <Mic size={16} className="shrink-0" /> {l("Can’t type? Tap the mic in any box and speak.", "टाइप करता येत नाही? कोणत्याही चौकटीतील माइक दाबा आणि बोला.")}
            </p>
            <label className="mt-4 block">
              <span className="mb-1 flex items-center gap-1.5 text-[15px] font-semibold">
                <Phone size={16} /> {l("Mobile number", "मोबाईल नंबर")}
              </span>
              <div className="flex">
                <span className="grid min-h-14 place-items-center rounded-l-xl border border-r-0 border-line bg-sand px-3 text-lg font-semibold text-muted">+91</span>
                <Input
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  className={cx(inputCls, "min-h-14 rounded-l-none text-xl tracking-wider")}
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setErr("");
                  }}
                  placeholder="98765 43210"
                  aria-label={l("Mobile number", "मोबाईल नंबर")}
                />
              </div>
            </label>
            {err === "none" ? (
              <div className="mt-3 rounded-xl bg-gold-100 p-3 text-sm text-[#6b4708]">
                <p className="font-semibold">{l("No account with this number yet.", "या नंबरवर अजून खाते नाही.")}</p>
                <Link href={`/signup?m=${mobile}`} className="mt-1 inline-flex items-center gap-1 font-bold text-leaf-700 underline">
                  {l("Create an account with this number", "या नंबरने खाते तयार करा")} <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              err && <p className="mt-2 text-sm font-semibold text-soil">{err}</p>
            )}
            <Button full type="submit" className="mt-4 min-h-14 text-lg">
              {l("Continue", "पुढे चला")} <ArrowRight size={20} />
            </Button>
            <button
              type="button"
              onClick={() => {
                setMobile("9876500001");
                setErr("");
              }}
              className="mt-2 block w-full text-center text-xs font-semibold text-leaf-700 hover:underline"
            >
              {l("⚡ Quick Demo: Use Sunita Pawar (Farmer)", "⚡ डेमो: सुनिता पवार (शेतकरी) वापरा")}
            </button>
          </form>
        ) : (
          <form onSubmit={checkPin} noValidate>
            <h1 className="text-xl font-bold">{l(`Namaskar, ${found?.name}`, `नमस्कार, ${found?.name}`)}</h1>
            <p className="text-sm text-muted">
              +91 {mobile.slice(0, 5)} {mobile.slice(5)} ·{" "}
              <button
                type="button"
                className="font-semibold text-leaf-700 underline"
                onClick={() => {
                  setStep("mobile");
                  setErr("");
                }}
              >
                {l("change", "बदला")}
              </button>
            </p>
            <label className="mt-4 block">
              <span className="mb-1 flex items-center gap-1.5 text-[15px] font-semibold">
                <Lock size={16} /> {l("Your 4-digit PIN", "तुमचा 4 अंकी PIN")}
              </span>
              <input
                ref={pinRef}
                type="password"
                inputMode="numeric"
                autoComplete="current-password"
                maxLength={4}
                className={cx(inputCls, "min-h-14 text-center text-3xl tracking-[0.8em]")}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                  setErr("");
                }}
                aria-label={l("PIN", "PIN")}
              />
            </label>
            {err && <p className="mt-2 text-sm font-semibold text-soil">{err}</p>}
            <Button full type="submit" className="mt-4 min-h-14 text-lg">
              {l("Log in", "लॉग इन करा")}
            </Button>
            <button
              type="button"
              onClick={() => {
                setPin("1234");
                setErr("");
              }}
              className="mt-2 block w-full text-center text-xs font-semibold text-leaf-700 hover:underline"
            >
              {l("⚡ Quick Demo PIN: 1234", "⚡ डेमो PIN: 1234 वापरा")}
            </button>
            <button
              type="button"
              onClick={() => toast({ en: "Ask your Mandi Mitra or field coordinator to reset your PIN.", mr: "PIN बदलण्यासाठी तुमच्या मंडी मित्राला किंवा समन्वयकाला विचारा." })}
              className="mt-2 min-h-11 w-full text-sm font-semibold text-leaf-700"
            >
              {l("Forgot PIN?", "PIN विसरलात?")}
            </button>
          </form>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted">{l("New to Shet Samruddhi?", "शेत समृद्धीवर नवीन आहात?")}</p>
        <Link
          href="/signup"
          className="mt-2 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-leaf-700 bg-white text-lg font-semibold text-leaf-700"
        >
          <UserPlus size={20} /> {l("Create a new account", "नवीन खाते तयार करा")}
        </Link>
        <p className="mt-2 text-xs text-muted">{l("Takes about 3 minutes. Your Mandi Mitra can help you fill it.", "साधारण 3 मिनिटे लागतात. तुमचा मंडी मित्र भरण्यास मदत करू शकतो.")}</p>
      </div>

      <p className="mt-8 flex items-start gap-2 text-xs text-muted">
        <ShieldCheck size={16} className="shrink-0" />
        {l(
          "We never ask for OTPs, Aadhaar, bank details or passwords over the phone. Your PIN is known only to you.",
          "आम्ही फोनवर कधीही OTP, आधार, बँक तपशील किंवा पासवर्ड मागत नाही. तुमचा PIN फक्त तुम्हालाच माहीत असतो.",
        )}
      </p>
    </div>
  );
}
