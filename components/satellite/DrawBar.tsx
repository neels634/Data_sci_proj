"use client";

import { Check, Undo2, X } from "lucide-react";
import { useStore } from "@/lib/store";

type Props = {
  points: number;
  onCancel: () => void;
  onUndo: () => void;
  onFinish: () => void;
};

/** Cancel, undo and finish controls shown while a field is being marked on the map. */
export default function DrawBar({ points, onCancel, onUndo, onFinish }: Props) {
  const { l } = useStore();
  return (
    <div className="absolute inset-x-3 bottom-6 z-[900] mx-auto max-w-sm rounded-2xl bg-white p-3 shadow-2xl">
      <p className="text-center text-sm font-semibold text-slate-800">{points >= 3 ? l(`${points} corners marked`, `${points} कोपरे झाले`) : l("Tap at least 3 corners of your field", "शेताचे किमान 3 कोपरे दाबा")}</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <button type="button" onClick={onCancel} className="flex min-h-11 items-center justify-center gap-1 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700">
          <X size={15} /> {l("Cancel", "रद्द")}
        </button>
        <button type="button" onClick={onUndo} disabled={points === 0} className="flex min-h-11 items-center justify-center gap-1 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 disabled:opacity-40">
          <Undo2 size={15} /> {l("Undo", "मागे")}
        </button>
        <button type="button" onClick={onFinish} disabled={points < 3} className="flex min-h-11 items-center justify-center gap-1 rounded-xl bg-emerald-700 text-sm font-semibold text-white disabled:opacity-40">
          <Check size={15} /> {l("Finish", "पूर्ण")}
        </button>
      </div>
    </div>
  );
}
