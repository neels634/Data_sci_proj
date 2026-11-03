"use client";

import { Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { cx } from "@/components/ui";

export const STEP_COUNT = 5;

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  fieldName: string;
  /** 0–100 */
  progress: number;
  /** steps finished so far; the next one is shown as active */
  stepsDone: number;
};

/** The 5-stage calibration card shown over the map while a field is analysed. */
export default function LoadingOverlay({ fieldName, progress, stepsDone }: Props) {
  const { l } = useStore();
  const steps = [
    l("Connecting to Earth Engine", "अर्थ इंजिनशी जोडणी करत आहे"),
    l("Filtering cloud-free scenes", "ढगविरहित छायाचित्रे निवडत आहे"),
    l("Generating multi-band composite", "बहु-बँड संमिश्र तयार करत आहे"),
    l("Computing vegetation indices", "वनस्पती निर्देशांक मोजत आहे"),
    l("Fusing statistical metrics", "सांख्यिकीय मापे एकत्र करत आहे"),
  ];
  const current = Math.min(stepsDone + 1, STEP_COUNT);

  return (
    <div className="absolute inset-0 z-[1000] grid place-items-center overflow-y-auto bg-black/25 p-4" role="status" aria-live="polite">
      <div className="w-full max-w-[380px] rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl">
        <div className="relative mx-auto size-32">
          <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#f1f5f9" strokeWidth="9" />
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke="#059669"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress / 100)}
              className="transition-[stroke-dashoffset] duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[28px] font-bold leading-none text-slate-900">
              {Math.round(progress)}
              <span className="text-emerald-600">%</span>
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">{l(`${current} of ${STEP_COUNT}`, `${STEP_COUNT} पैकी ${current}`)}</p>
          </div>
        </div>

        <h2 className="mt-4 text-center text-[18px] font-bold text-slate-900">{l(`Analyzing ${fieldName}`, `${fieldName} चे विश्लेषण`)}</h2>
        <p className="text-center text-[13px] text-slate-500">{l("Calibrating Copernicus Sentinel-2 Telemetry", "कोपर्निकस सेंटिनेल-2 माहिती जुळवत आहे")}</p>

        <ol className="mt-4 space-y-2">
          {steps.map((text, i) => {
            const state = i < stepsDone ? "done" : i === stepsDone ? "active" : "pending";
            return (
              <li
                key={text}
                aria-current={state === "active" ? "step" : undefined}
                className={cx(
                  "flex items-center gap-2.5 rounded-xl border px-3 py-2 text-[13px]",
                  state === "done" && "border-slate-200/90 bg-slate-50/80 text-slate-700",
                  state === "active" && "border-2 border-emerald-600 bg-emerald-50/70 font-bold text-emerald-950 shadow-xs ring-3 ring-emerald-500/10",
                  state === "pending" && "border-slate-200/60 bg-white font-normal text-slate-400",
                )}
              >
                {state === "done" && <Check size={16} className="shrink-0 text-emerald-600" aria-hidden="true" />}
                {state === "active" && <span className="size-4 shrink-0 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" aria-hidden="true" />}
                {state === "pending" && <span className="size-4 shrink-0 rounded-full border-2 border-slate-200" aria-hidden="true" />}
                <span className="min-w-0 flex-1">{text}</span>
                {state === "done" && <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">{l("Done", "झाले")}</span>}
                {state === "active" && <span className="animate-pulse text-[10px] font-bold uppercase tracking-wide text-emerald-800">{l("Active", "सुरू")}</span>}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
