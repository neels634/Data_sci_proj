"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Bookmark, CheckCircle2, ExternalLink, FileText, Flag, HandHelping, ListChecks, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { bi } from "@/lib/i18n";
import type { TrackerStatus } from "@/lib/types";
import { Badge, Button, Card, Empty, Note, PageHeader, cx, inputCls } from "@/components/ui";

const STATUSES: TrackerStatus[] = ["Interested", "Preparing documents", "Applied", "Approved", "Rejected", "Needs follow-up"];

const REASONS = [
  bi("Information may be outdated", "माहिती जुनी असू शकते"),
  bi("Link does not work", "लिंक चालत नाही"),
  bi("Someone asked me for money", "कोणीतरी माझ्याकडे पैसे मागितले"),
];

function Section({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <Card className="mt-3">
      <h2 className="mb-2 flex items-center gap-2 font-bold text-leaf-900">
        {icon} {title}
      </h2>
      <ul className="space-y-1.5">
        {items.map((x) => (
          <li key={x} className="flex gap-2 text-[15px] leading-snug">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-leaf-600" />
            {x}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function SchemeDetail() {
  const { id } = useParams<{ id: string }>();
  const { state, l, tx, lbl, date, toggleBookmark, setTracker, requestSchemeHelp, addReport } = useStore();
  const [reporting, setReporting] = useState(false);
  const s = state.schemes.find((x) => x.id === id);

  if (!s || s.status === "archived")
    return (
      <Empty
        icon={<FileText size={32} />}
        title={l("Scheme not available", "योजना उपलब्ध नाही")}
        body={l("It may have been archived by the admin team.", "प्रशासन टीमने ती संग्रहित केली असू शकते.")}
      />
    );

  const saved = state.bookmarks.includes(s.id);

  return (
    <div>
      <PageHeader back="/schemes" title={tx(s.name)} sub={tx(s.department)} />
      <div className="flex flex-wrap gap-1.5">
        <Badge tone="green">{lbl(s.category)}</Badge>
        <Badge>{lbl(s.level)}</Badge>
        {s.lastVerified ? (
          <Badge tone="green">
            {l("Verified", "पडताळणी")} {date(s.lastVerified)}
          </Badge>
        ) : (
          <Badge tone="gold">{l("Not yet verified", "पडताळणी बाकी")}</Badge>
        )}
      </div>

      <div className="mt-3">
        {s.status === "flagged" ? (
          <Note>{l("This scheme is being re-checked by our team. Confirm every detail on the official website before applying.", "आमची टीम ही योजना पुन्हा तपासत आहे. अर्ज करण्यापूर्वी अधिकृत संकेतस्थळावर सर्व तपशील खात्री करा.")}</Note>
        ) : !s.lastVerified ? (
          <Note>{l("Not yet checked against the official source. Confirm details on the official website before applying.", "अधिकृत स्रोताशी अजून पडताळणी झालेली नाही. अर्ज करण्यापूर्वी अधिकृत संकेतस्थळावर तपशील खात्री करा.")}</Note>
        ) : null}
      </div>

      <p className="mt-3 text-[17px] leading-relaxed">{tx(s.summary)}</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant={saved ? "primary" : "secondary"} onClick={() => toggleBookmark(s.id)} aria-pressed={saved}>
          <Bookmark size={18} className={cx(saved && "fill-white")} /> {saved ? l("Saved", "जतन केली") : l("Save", "जतन करा")}
        </Button>
        <Button variant="secondary" onClick={() => requestSchemeHelp(s.id)}>
          <HandHelping size={18} /> {l("Ask Mitra", "मित्राला विचारा")}
        </Button>
      </div>

      <Section icon={<Sparkles size={18} />} title={l("What you get", "काय मिळते")} items={s.benefits.map(tx)} />
      <Section icon={<CheckCircle2 size={18} />} title={l("Who can apply", "कोण अर्ज करू शकतो")} items={s.eligibility.map(tx)} />
      <Section icon={<FileText size={18} />} title={l("Documents needed", "आवश्यक कागदपत्रे")} items={s.documents.map(tx)} />
      <Section icon={<ListChecks size={18} />} title={l("How to apply", "अर्ज कसा करावा")} items={s.steps.map((x, i) => `${i + 1}. ${tx(x)}`)} />

      <Card className="mt-3 bg-leaf-50">
        <h2 className="font-bold text-leaf-900">{l("Official source", "अधिकृत स्रोत")}</h2>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
          <dt className="text-muted">{l("Source", "स्रोत")}</dt>
          <dd className="font-semibold">{s.source}</dd>
          <dt className="text-muted">{l("Last verified", "शेवटची पडताळणी")}</dt>
          <dd className="font-semibold">{s.lastVerified ? date(s.lastVerified) : l("Not yet verified", "पडताळणी बाकी")}</dd>
        </dl>
        <a href={s.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-leaf-700 font-semibold text-white">
          {l("Open official website", "अधिकृत संकेतस्थळ उघडा")} <ExternalLink size={16} />
        </a>
      </Card>

      <Card className="mt-3">
        <h2 className="font-bold">{l("Track my application", "माझ्या अर्जाची स्थिती")}</h2>
        <p className="text-sm text-muted">{l("Only you can see this. It helps your Mitra follow up.", "हे फक्त तुम्हाला दिसते. यामुळे मित्राला पाठपुरावा करता येतो.")}</p>
        <select
          className={cx(inputCls, "mt-2")}
          value={state.tracker[s.id] ?? ""}
          onChange={(e) => setTracker(s.id, e.target.value as TrackerStatus | "")}
          aria-label={l("Application status", "अर्जाची स्थिती")}
        >
          <option value="">{l("Not started", "सुरू केले नाही")}</option>
          {STATUSES.map((x) => (
            <option key={x} value={x}>
              {lbl(x)}
            </option>
          ))}
        </select>
      </Card>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        {l(
          "Shet Samruddhi is not a government website. Eligibility shown here is indicative; final approval rests with the department. Never share OTPs, passwords or bank PINs with anyone claiming to help with a scheme.",
          "शेत समृद्धी हे शासकीय संकेतस्थळ नाही. येथे दाखवलेली पात्रता केवळ अंदाज आहे; अंतिम मंजुरी संबंधित विभागाची असते. योजनेत मदत करतो म्हणणाऱ्या कोणालाही OTP, पासवर्ड किंवा बँक PIN कधीही सांगू नका.",
        )}
      </p>

      {reporting ? (
        <Card className="mt-3">
          <p className="font-semibold">{l("What is wrong?", "काय चुकीचे आहे?")}</p>
          <div className="mt-2 grid gap-2">
            {REASONS.map((r) => (
              <Button
                key={r.en}
                variant="secondary"
                onClick={() => {
                  addReport(bi(`Scheme: ${s.name.en}`, `योजना: ${s.name.mr}`), r);
                  setReporting(false);
                }}
              >
                {tx(r)}
              </Button>
            ))}
          </div>
        </Card>
      ) : (
        <button onClick={() => setReporting(true)} className="mt-3 flex min-h-12 items-center gap-2 text-sm font-semibold text-soil">
          <Flag size={16} /> {l("Report incorrect information", "चुकीच्या माहितीची तक्रार करा")}
        </button>
      )}
    </div>
  );
}
