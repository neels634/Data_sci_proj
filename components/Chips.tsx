"use client";

import { Check } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Option } from "@/lib/account";
import { cx } from "./ui";

type Props = {
  label: string;
  hint?: string;
  error?: string;
  options: Option[];
} & ({ multi: true; value: string[]; onChange: (v: string[]) => void } | { multi?: false; value: string; onChange: (v: string) => void });

/** Big tap-friendly choice buttons; single or multiple selection. */
export default function Chips(props: Props) {
  const { tx } = useStore();
  const { label, hint, error, options } = props;
  const selected = (v: string) => (props.multi ? props.value.includes(v) : props.value === v);
  const toggle = (v: string) => {
    if (props.multi) props.onChange(props.value.includes(v) ? props.value.filter((x) => x !== v) : [...props.value, v]);
    else props.onChange(v);
  };

  return (
    <fieldset>
      <legend className="mb-2 text-[15px] font-semibold text-ink">{label}</legend>
      <div className="flex flex-wrap gap-2" role={props.multi ? "group" : "radiogroup"}>
        {options.map((o) => {
          const on = selected(o.value);
          return (
            <button
              type="button"
              key={o.value}
              onClick={() => toggle(o.value)}
              role={props.multi ? "checkbox" : "radio"}
              aria-checked={on}
              className={cx(
                "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-[15px] font-semibold",
                on ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white text-ink",
              )}
            >
              {on && <Check size={16} />}
              {tx(o.label)}
            </button>
          );
        })}
      </div>
      {hint && !error && <p className="mt-1 text-sm text-muted">{hint}</p>}
      {error && <p className="mt-1 text-sm font-semibold text-soil">{error}</p>}
    </fieldset>
  );
}
