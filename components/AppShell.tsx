"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Briefcase,
  ClipboardList,
  FileText,
  Flag,
  HandCoins,
  Home,
  Landmark,
  Layers,
  LifeBuoy,
  LogOut,
  UserCircle,
  RotateCcw,
  ScanEye,
  Scale,
  ShoppingBasket,
  Sprout,
  Sun,
  Moon,
  UserRound,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";
import { cx } from "./ui";
import { VoiceHelpHost } from "./speech";

export const ROLE_HOME: Record<Role, string> = { farmer: "/home", mitra: "/mitra", buyer: "/buyer", admin: "/admin" };

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { state, account, hydrated, toastMsg, l, setLang, setTheme, toggleTheme, resetAll, logout } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const isWelcome = pathname === "/" || pathname === "/signup";
  const blocked = hydrated && !account && !isWelcome;
  // the farmer home is only the four big options, so the bottom bar would just repeat them
  const showNav = !isWelcome && pathname !== "/home";

  // every screen except log in / sign up needs a signed-in account
  useEffect(() => {
    if (blocked) router.replace("/");
  }, [blocked, router]);

  useEffect(() => {
    document.documentElement.lang = state.lang === "mr" ? "mr" : "en";
  }, [state.lang]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state.theme]);

  const roleLabel: Record<Role, string> = {
    farmer: l("Farmer / entrepreneur", "शेतकरी / उद्योजक"),
    mitra: l("Gaon Mandi Mitra", "गाव मंडी मित्र"),
    buyer: l("Buyer", "खरेदीदार"),
    admin: l("Admin / coordinator", "प्रशासक / समन्वयक"),
  };

  const nav: { href: string; label: string; icon: React.ReactNode; match?: string[] }[] =
    state.role === "farmer"
      ? [
          { href: "/home", label: l("Home", "मुख्यपृष्ठ"), icon: <Home size={22} />, match: ["/activity"] },
          { href: "/crops", label: l("My Farm", "माझी शेती"), icon: <Sprout size={22} /> },
          { href: "/crop-check", label: l("Crop Check", "पीक तपासणी"), icon: <ScanEye size={22} /> },
          { href: "/schemes", label: l("Schemes", "योजना"), icon: <Landmark size={22} /> },
          { href: "/sell", label: l("Mandi Mitra", "मंडी मित्र"), icon: <Scale size={22} />, match: ["/mandi"] },
          { href: "/business", label: l("Business", "व्यवसाय"), icon: <Briefcase size={22} />, match: ["/calculator"] },
        ]
      : state.role === "mitra"
        ? [
            { href: "/mitra", label: l("Home", "मुख्यपृष्ठ"), icon: <ClipboardList size={22} /> },
            { href: "/mitra/lots", label: l("Lots", "लॉट"), icon: <Layers size={22} /> },
            { href: "/mitra/earnings", label: l("Earnings", "कमाई"), icon: <HandCoins size={22} /> },
            { href: "/help", label: l("Help", "मदत"), icon: <LifeBuoy size={22} /> },
          ]
        : state.role === "buyer"
          ? [
              { href: "/buyer", label: l("Home", "मुख्यपृष्ठ"), icon: <ShoppingBasket size={22} /> },
              { href: "/buyer/offers", label: l("My offers", "माझ्या ऑफर"), icon: <FileText size={22} /> },
            ]
          : [
              { href: "/admin", label: l("Home", "मुख्यपृष्ठ"), icon: <BarChart3 size={22} /> },
              { href: "/admin/schemes", label: l("Schemes", "योजना"), icon: <Landmark size={22} /> },
              { href: "/admin/reports", label: l("Reports", "तक्रारी"), icon: <Flag size={22} /> },
            ];

  const isActive = (href: string, match?: string[]) =>
    pathname === href ||
    (!["/mitra", "/buyer", "/admin"].includes(href) && pathname.startsWith(href + "/")) ||
    (match ?? []).some((m) => pathname.startsWith(m));

  const go = (href: string) => {
    setMenu(false);
    router.push(href);
  };


  return (
    <div className={cx("mx-auto flex min-h-dvh max-w-md flex-col bg-cream shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_10px_40px_rgba(30,42,36,0.08)]", state.theme === "dark" && "dark")}>
      {!isWelcome && (
        <header className="sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur">
          <div className="flex items-center justify-between gap-2 px-4 py-2.5">
            <Link href={ROLE_HOME[state.role]} className="flex min-w-0 items-center gap-2" aria-label={l("Go to home", "मुख्यपृष्ठावर जा")}>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-leaf-700 text-white">
                <Sprout size={20} />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block text-lg font-bold text-leaf-900">{l("Shet Samruddhi", "शेत समृद्धी")}</span>
                <span className="block truncate text-xs text-muted">
                  {account ? `${account.name} · ` : ""}
                  {roleLabel[state.role]}
                </span>
              </span>
            </Link>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                onClick={() => setLang(state.lang === "en" ? "mr" : "en")}
                className="min-h-10 rounded-full border border-line bg-white px-3 text-sm font-semibold text-leaf-700"
                aria-label={l("Change language", "भाषा बदला")}
              >
                {state.lang === "en" ? "मराठी" : "English"}
              </button>
              <button
                onClick={() => toggleTheme()}
                className="flex min-h-10 items-center gap-1.5 rounded-full border border-line bg-white px-3 text-sm font-semibold text-leaf-700"
                aria-label={l("Toggle bright and dark mode", "दिवस / रात्र मोड बदला")}
                title={state.theme === "dark" ? l("Switch to Bright Mode", "दिवस मोड") : l("Switch to Dark Mode", "रात्र मोड")}
              >
                {state.theme === "dark" ? (
                  <>
                    <Sun size={17} className="text-amber-500" />
                    <span>{l("Bright", "दिवस")}</span>
                  </>
                ) : (
                  <>
                    <Moon size={17} />
                    <span>{l("Dark", "रात्र")}</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setMenu(true)}
                className="grid size-10 place-items-center rounded-full border border-line bg-white text-leaf-700"
                aria-label={l("Menu", "मेनू")}
              >
                <UserRound size={20} />
              </button>
            </div>
          </div>
        </header>
      )}

      <main className={cx("flex-1 px-4", isWelcome ? "py-0" : showNav ? "pb-28 pt-4" : "pb-4 pt-4")}>
        {!blocked ? children : null}
      </main>

      {showNav && (
        <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-line bg-white/95 backdrop-blur">
          <ul className="flex">
            {nav.map((n) => {
              const active = isActive(n.href, n.match);
              return (
                <li key={n.href} className="min-w-0 flex-1">
                  <Link
                    href={n.href}
                    className={cx(
                      "flex min-h-16 flex-col items-center justify-center gap-0.5 px-1 text-[12px] font-semibold",
                      active ? "text-leaf-700" : "text-muted",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className={cx("rounded-full px-4 py-1", active && "bg-leaf-100")}>{n.icon}</span>
                    <span className="max-w-full truncate">{n.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {menu && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setMenu(false)}>
          <div className="w-full max-w-md rounded-t-3xl bg-cream p-5 pb-8" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold">{account?.name}</h2>
                <p className="text-sm text-muted">{roleLabel[state.role]}</p>
              </div>
              <button onClick={() => setMenu(false)} className="grid size-10 place-items-center rounded-full" aria-label={l("Close", "बंद करा")}>
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => go(ROLE_HOME[state.role])} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white font-semibold text-leaf-700">
                <Home size={18} /> {l("Home", "मुख्यपृष्ठ")}
              </button>
              <button onClick={() => go("/profile")} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white font-semibold text-leaf-700">
                <UserCircle size={18} /> {l("My profile", "माझे प्रोफाइल")}
              </button>
              {state.role === "farmer" && (
                <button onClick={() => go("/activity")} className="flex min-h-12 items-center justify-center rounded-xl border border-line bg-white font-semibold text-leaf-700">
                  {l("My activity", "माझे काम")}
                </button>
              )}
              <button
                onClick={() => go("/help")}
                className={cx("flex min-h-12 items-center justify-center rounded-xl border border-line bg-white font-semibold text-leaf-700", state.role !== "farmer" && "col-span-2")}
              >
                {l("Help", "मदत")}
              </button>
              <button
                onClick={() => {
                  logout();
                  go("/");
                }}
                className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-leaf-700 font-semibold text-white"
              >
                <LogOut size={18} /> {l("Log out", "लॉग आउट")}
              </button>
              <button
                onClick={() => {
                  resetAll();
                  setMenu(false);
                }}
                className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-soil"
              >
                <RotateCcw size={16} /> {l("Reset app data (keeps accounts)", "ॲपमधील माहिती पुन्हा सुरू करा (खाती राहतील)")}
              </button>
            </div>
          </div>
        </div>
      )}

      <VoiceHelpHost />

      {toastMsg && (
        <div role="status" className="fixed inset-x-0 bottom-20 z-50 mx-auto w-fit max-w-[90%] rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-lg">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
