"use client";

import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { useStore } from "@/lib/store";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function Card({ className, children, ...rest }: ComponentProps<"div">) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-line p-4 shadow-[0_1px_2px_rgba(30,42,36,0.04)]",
        // default white unless the caller sets its own background
        !/(^|\s)bg-/.test(className ?? "") && "bg-white",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "soil";
const btn: Record<BtnVariant, string> = {
  primary: "bg-leaf-700 text-white hover:bg-leaf-900 disabled:bg-leaf-700/40",
  soil: "bg-soil text-white hover:bg-soil/90 disabled:bg-soil/40",
  secondary: "bg-white text-leaf-700 border border-leaf-700/30 hover:bg-leaf-50",
  ghost: "text-leaf-700 hover:bg-leaf-50",
  danger: "bg-white text-soil border border-soil/40 hover:bg-soil-100",
};

export function Button({
  variant = "primary",
  className,
  full,
  ...rest
}: ComponentProps<"button"> & { variant?: BtnVariant; full?: boolean }) {
  return (
    <button
      className={cx(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed",
        btn[variant],
        full && "w-full",
        className,
      )}
      {...rest}
    />
  );
}

export function LinkButton({
  href,
  variant = "primary",
  className,
  full,
  children,
}: {
  href: string;
  variant?: BtnVariant;
  className?: string;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-[15px] font-semibold transition-colors",
        btn[variant],
        full && "w-full",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export type Tone = "green" | "soil" | "gold" | "grey" | "blue";
const tones: Record<Tone, string> = {
  green: "bg-leaf-100 text-leaf-900",
  soil: "bg-soil-100 text-soil",
  gold: "bg-gold-100 text-gold",
  grey: "bg-sand text-muted",
  blue: "bg-[#e3ecf5] text-[#28507a]",
};

export function Badge({ tone = "grey", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}

/** Reusable badge to visibly mark all simulated, sample, or demo data */
export function DemoBadge({ className }: { className?: string }) {
  const { l } = useStore();
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-900 tracking-wide",
        className
      )}
    >
      <span className="inline-block size-1.5 rounded-full bg-amber-500" />
      <span>{l("Demo data", "नमुना माहिती")}</span>
    </span>
  );
}

export function PageHeader({ title, back, sub, action }: { title: string; back?: string; sub?: string; action?: ReactNode }) {
  const { l } = useStore();
  return (
    <div className="mb-4">
      {back && (
        <Link href={back} className="-ml-1 mb-1 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-leaf-700">
          <ChevronLeft size={18} /> {l("Back", "मागे")}
        </Link>
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold leading-tight text-ink">{title}</h1>
          {sub && <p className="mt-1 text-[15px] text-muted">{sub}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2 mt-6 flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold text-ink">{children}</h2>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Note({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "green" }) {
  return (
    <div
      className={cx(
        "flex gap-2 rounded-xl p-3 text-sm leading-snug",
        tone === "gold" ? "bg-gold-100 text-[#6b4708]" : "bg-leaf-50 text-leaf-900",
      )}
    >
      <Info size={18} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[15px] font-semibold text-ink">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-sm text-muted">{hint}</span>}
      {error && <span className="mt-1 block text-sm font-semibold text-soil">{error}</span>}
    </label>
  );
}

export const inputCls =
  "block min-h-12 w-full rounded-xl border border-line bg-white px-3 text-ink placeholder:text-muted/70 focus:border-leaf-600 focus:outline-none";

export function Empty({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white/60 px-6 py-8 text-center">
      <div className="mb-2 text-leaf-600">{icon}</div>
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Term({ word, meaning }: { word: string; meaning: string }) {
  return (
    <abbr title={meaning} className="cursor-help underline decoration-dotted underline-offset-2">
      {word}
    </abbr>
  );
}

export const rupees = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export function statusTone(status: string): Tone {
  if (["Accepted", "Completed", "Approved", "Resolved"].includes(status)) return "green";
  if (["Offer received", "Open for offers", "Offer accepted", "Applied"].includes(status)) return "gold";
  if (["Cancelled", "Declined", "Rejected", "Open"].includes(status)) return "soil";
  if (["Dispatched", "In lot", "With Mitra", "Preparing documents"].includes(status)) return "blue";
  return "grey";
}
