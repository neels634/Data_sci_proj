"use client";

import { Check } from "lucide-react";
import { Input } from "@/components/voice";
import { Field, cx, inputCls } from "@/components/ui";
import { useStore } from "@/lib/store";
import type { Bi } from "@/lib/i18n";
import type { YesNo } from "@/lib/enterprise";

/** Big tap targets instead of a form field: most answers here are "which of these do you have?" */
export function Chips({ label, options, value, onChange }: { label: string; options: { id: string; name: Bi }[]; value: string[]; onChange: (next: string[]) => void }) {
  const { tx } = useStore();
  return (
    <div role="group" aria-label={label}>
      <p className="mb-1 text-[15px] font-semibold text-ink">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = value.includes(o.id);
          return (
            <button key={o.id} type="button" aria-pressed={on} onClick={() => onChange(on ? value.filter((x) => x !== o.id) : [...value, o.id])} className={cx("inline-flex min-h-11 items-center gap-1 rounded-full border px-3 text-sm font-semibold", on ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white text-ink")}>
              {on && <Check size={15} aria-hidden="true" />} {tx(o.name)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function YesNoField({ label, value, onChange }: { label: string; value: YesNo; onChange: (next: YesNo) => void }) {
  const { l } = useStore();
  const options: [YesNo, string][] = [
    ["yes", l("Yes", "होय")],
    ["no", l("No", "नाही")],
    [null, l("Don’t know", "माहीत नाही")],
  ];
  return (
    <div role="group" aria-label={label}>
      <p className="mb-1 text-[15px] font-semibold text-ink">{label}</p>
      <div className="grid grid-cols-3 gap-1.5">
        {options.map(([v, name]) => (
          <button key={name} type="button" aria-pressed={value === v} onClick={() => onChange(v)} className={cx("min-h-11 rounded-xl border text-sm font-semibold", value === v ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white text-ink")}>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

/** An empty box means "not known", which is different from zero. */
export function NumberField({ label, hint, value, onChange }: { label: string; hint?: string; value: number | null; onChange: (next: number | null) => void }) {
  return (
    <Field label={label} hint={hint}>
      <Input
        className={inputCls}
        inputMode="numeric"
        value={value ?? ""}
        onChange={(e) => {
          const digits = e.target.value.replace(/[^\d.]/g, "");
          const parsed = Number(digits);
          onChange(digits === "" || !Number.isFinite(parsed) ? null : parsed);
        }}
      />
    </Field>
  );
}
