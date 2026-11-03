"use client";

/**
 * Mitra quality check (and recheck): confirm type and grade, read the moisture meter, choose the
 * result. The suggested result is pre-selected: too damp → needs drying; lowest grade → low grade.
 */
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useStore } from "@/lib/store";
import { addDays, todayISO } from "@/lib/lifecycle";
import { gradingFor, isLowestGrade, UNSURE } from "@/lib/grades";
import type { Listing, ListingStatus } from "@/lib/types";
import { SpeakButton } from "@/components/speech";
import { BigChoice, CropAvatar, EmptyState, GradeCard, StickyAction, cardCls, useMandiText } from "@/components/mandi";
import { cx } from "@/components/ui";

const toAscii = (s: string) => s.replace(/[०-९]/g, (d) => String("०१२३४५६७८९".indexOf(d))).replace(/[^\d.]/g, "");

export default function MitraCheck() {
  const { id } = useParams<{ id: string }>();
  const { state, hydrated, l } = useStore();
  const x = state.listings.find((y) => y.id === id);
  // the form starts from the saved listing, so wait until saved data has loaded
  if (!hydrated) return null;
  if (!x || !gradingFor(x.crop)) return <EmptyState title={l("Listing not found", "नोंद सापडली नाही")} />;
  if (x.lotId || x.status === "cancelled") return <EmptyState title={l("This listing can't be checked now", "ही नोंद आता तपासता येत नाही")} />;
  return <CheckForm key={x.id} x={x} />;
}

function CheckForm({ x }: { x: Listing }) {
  const router = useRouter();
  const { l, tx, num, date, checkListing } = useStore();
  const t = useMandiText();
  const g = gradingFor(x.crop)!;
  const last = x.checkHistory.at(-1);
  const [typeCode, setTypeCode] = useState(x.typeCode ?? "");
  const [gradeCode, setGradeCode] = useState(x.mitraGradeCode ?? (x.gradeCode !== UNSURE ? x.gradeCode : ""));
  const [moistureText, setMoistureText] = useState("");
  const [picked, setPicked] = useState<ListingStatus | null>(null);
  const [recheckDays, setRecheckDays] = useState(3);
  const [tried, setTried] = useState(false);

  const limit = g.moistureLimit;
  const askMoisture = limit != null;
  const moisture = moistureText === "" ? undefined : Number(toAscii(moistureText));
  const moistureBad = moisture != null && (Number.isNaN(moisture) || moisture < 0 || moisture > 40);
  const suggested: ListingStatus = moisture != null && limit != null && moisture > limit ? "needs_drying" : gradeCode && isLowestGrade(gradeCode) ? "low_grade" : "ready";
  const result = picked ?? suggested;
  const missing = {
    type: !!g.typeOptions && !typeCode,
    grade: !gradeCode,
    moisture: (g.moistureRequired && moisture == null) || moistureBad,
  };
  const ok = !missing.type && !missing.grade && !missing.moisture;
  const today = todayISO();
  const title = l("Check this crop", "माल तपासा");

  const save = () => {
    setTried(true);
    if (!ok) return;
    checkListing(x.id, { typeCode: typeCode || undefined, gradeCode, moisture, result, recheckOn: result === "needs_drying" ? addDays(today, recheckDays) : undefined });
    router.push("/mitra");
  };

  const answers = [
    `${l("Grade", "प्रत")}: ${x.gradeCode === UNSURE ? l("don't know", "माहीत नाही") : t.grade(x.gradeCode)}`,
    x.typeCode ? `${l("Type", "प्रकार")}: ${t.type(x.typeCode)}` : null,
    x.dryness ? `${l("Dry", "वाळलेला")}: ${x.dryness === "dry" ? l("yes", "हो") : x.dryness === "damp" ? l("a bit damp", "थोडा ओला") : l("don't know", "माहीत नाही")}` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/mitra" aria-label={l("Back", "मागे")} className="grid size-12 place-items-center rounded-full bg-white text-leaf-700">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="flex-1 text-[23px] font-bold">{title}</h1>
        <SpeakButton id="mitra-check" text={`${title}. ${tx(x.farmer)}, ${t.crop(x.crop)}, ${t.qty(x.quantity, x.unit)}`} />
      </div>

      <div className="rounded-2xl bg-sand p-3">
        <div className="flex items-center gap-3">
          <CropAvatar cropId={x.crop} />
          <div>
            <p className="font-bold">{tx(x.farmer)}</p>
            <p className="text-[15px] text-muted">
              {t.crop(x.crop)} · {t.qty(x.quantity, x.unit)}
            </p>
          </div>
        </div>
        <p className="mt-2 text-sm font-semibold text-muted">{l("Farmer's answers", "शेतकऱ्याची उत्तरे")}</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {answers.map((a) => (
            <span key={a} className="rounded-full bg-white px-2.5 py-1 text-sm">
              {a}
            </span>
          ))}
        </div>
        {last && (
          <p className="mt-2 text-sm">
            {l("Last check", "मागील तपासणी")}: {date(last.at)} · {t.grade(last.gradeCode)}
            {last.moisture != null && ` · ${num(last.moisture)}%`}
          </p>
        )}
      </div>

      {g.typeOptions && (
        <section>
          <h2 className="mb-2 text-lg font-bold">{l("Type", "प्रकार")}</h2>
          <div className="flex flex-wrap gap-2" role="radiogroup">
            {g.typeOptions.map((o) => (
              <button
                key={o.code}
                type="button"
                role="radio"
                aria-checked={typeCode === o.code}
                onClick={() => setTypeCode(o.code)}
                className={cx("min-h-12 rounded-full border-2 px-4 text-[17px] font-bold active:scale-95", typeCode === o.code ? "border-leaf-700 bg-leaf-700 text-white" : "border-line bg-white")}
              >
                {tx(o.name)}
              </button>
            ))}
          </div>
          {tried && missing.type && <p className="mt-1 text-sm font-semibold text-soil">{l("Choose the type", "प्रकार निवडा")}</p>}
        </section>
      )}

      <section>
        <h2 className="mb-2 text-lg font-bold">{l("Grade", "प्रत")}</h2>
        <div className="space-y-3" role="radiogroup">
          {[...g.grades]
            .sort((a, b) => a.rank - b.rank)
            .map((o) => (
              <GradeCard key={o.code} grade={o} emoji={g.emoji} selected={gradeCode === o.code} onSelect={() => setGradeCode(o.code)} />
            ))}
        </div>
        {tried && missing.grade && <p className="mt-1 text-sm font-semibold text-soil">{l("Choose the grade", "प्रत निवडा")}</p>}
      </section>

      {askMoisture && (
        <section className={cx(cardCls, "p-4")}>
          <label htmlFor="moisture" className="text-lg font-bold">
            {l("Moisture % (meter)", "ओलावा % (मीटर)")} {!g.moistureRequired && <span className="text-sm font-normal text-muted">({l("optional", "ऐच्छिक")})</span>}
          </label>
          <div className="mt-2 flex items-center gap-2">
            <input
              id="moisture"
              inputMode="decimal"
              value={moistureText}
              onChange={(e) => setMoistureText(e.target.value)}
              placeholder={num(12)}
              className="h-16 w-32 rounded-2xl border-2 border-line bg-white text-center text-4xl font-bold outline-none focus:border-leaf-700"
            />
            <span className="text-3xl font-bold text-muted">%</span>
          </div>
          {/* gauge: green up to the limit, blue above; the limit is marked */}
          <div className="relative mt-4 h-4 rounded-full" style={{ background: `linear-gradient(to right, #2b6a4f ${(limit! / 40) * 100}%, #0284c7 ${(limit! / 40) * 100}%)` }}>
            <span className="absolute -top-1 h-6 w-0.5 bg-ink" style={{ left: `${(limit! / 40) * 100}%` }} />
            {moisture != null && !moistureBad && <span className="absolute -top-1.5 size-7 -translate-x-1/2 rounded-full border-4 border-white bg-ink shadow" style={{ left: `${(moisture / 40) * 100}%` }} />}
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>{num(0)}%</span>
            <span>
              {l("limit", "मर्यादा")} {num(limit!)}%
            </span>
            <span>{num(40)}%</span>
          </div>
          {tried && missing.moisture && (
            <p className="mt-1 text-sm font-semibold text-soil">{moistureBad ? l("Enter 0 to 40", "० ते ४० लिहा") : l("Meter reading is required for this crop", "या पिकासाठी मीटर वाचन आवश्यक")}</p>
          )}
        </section>
      )}

      <section>
        <h2 className="mb-2 text-lg font-bold">{l("Result", "निकाल")}</h2>
        <div className="space-y-2" role="radiogroup">
          <BigChoice icon="✓" title={l("Ready", "तयार")} sub={suggested === "ready" ? l("Suggested", "सुचवलेले") : undefined} selected={result === "ready"} onClick={() => setPicked("ready")} />
          <BigChoice icon="💧" tone="sky" title={l("Needs drying", "वाळवायला हवे")} sub={suggested === "needs_drying" ? l("Suggested", "सुचवलेले") : undefined} selected={result === "needs_drying"} onClick={() => setPicked("needs_drying")} />
          <BigChoice icon="⚠️" tone="soil" title={l("Lower grade", "कमी प्रत")} sub={suggested === "low_grade" ? l("Suggested", "सुचवलेले") : undefined} selected={result === "low_grade"} onClick={() => setPicked("low_grade")} />
        </div>
      </section>

      {result === "needs_drying" && (
        <section className="mm-step">
          <h2 className="mb-2 text-lg font-bold">{l("Check again", "पुन्हा तपासणी")}</h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              [1, l("Tomorrow", "उद्या")],
              [3, l("In 3 days", "३ दिवसांनी")],
              [5, l("In 5 days", "५ दिवसांनी")],
            ].map(([d, label]) => (
              <button
                key={d}
                type="button"
                onClick={() => setRecheckDays(d as number)}
                aria-pressed={recheckDays === d}
                className={cx("min-h-12 rounded-xl border-2 font-bold", recheckDays === d ? "border-sky-600 bg-sky-50 text-sky-900" : "border-line bg-white")}
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      )}

      <StickyAction onClick={save}>
        <Save size={20} /> {l("Save check", "तपासणी जतन करा")}
      </StickyAction>
    </div>
  );
}
