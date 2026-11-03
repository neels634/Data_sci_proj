import type { GradeOption } from "@/lib/grades";

/**
 * A picture of a grade so size is understood without numbers: a fruit sized against a ₹5 coin,
 * 1–3 stars for grains, turmeric fingers vs bulbs vs pieces, or a big / small flower.
 */
export function GradeVisual({ grade, emoji, className }: { grade: Pick<GradeOption, "visual">; emoji?: string; className?: string }) {
  const v = grade.visual;
  return (
    <svg viewBox="0 0 64 64" className={className ?? "size-16 shrink-0"} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#fbf7ef" />
      {!v ? (
        <text x="32" y="40" textAnchor="middle" fontSize="24">
          {emoji}
        </text>
      ) : v.kind === "size" ? (
        <Size level={v.level} />
      ) : v.kind === "stars" ? (
        <Stars level={v.level} />
      ) : v.kind === "turmeric" ? (
        <Turmeric level={v.level} />
      ) : (
        <Flower level={v.level} />
      )}
    </svg>
  );
}

/** circle sized by grade, next to a faint ₹5 coin outline */
function Size({ level }: { level: number }) {
  const r = 5 + level * 3.8;
  return (
    <>
      <circle cx={27} cy={30} r={r} fill="#b5532e" opacity={0.85} />
      <circle cx={27 - r * 0.35} cy={30 - r * 0.35} r={Math.max(1.5, r * 0.2)} fill="#fff" opacity={0.35} />
      <circle cx={54} cy={54} r={6.5} fill="none" stroke="#a86f0c" strokeWidth={1.2} strokeDasharray="2 2" opacity={0.7} />
      <text x={54} y={56.5} textAnchor="middle" fontSize={6} fill="#a86f0c" opacity={0.85}>
        ₹5
      </text>
    </>
  );
}

const STAR = "M0,-9 L2.6,-3 9,-2.8 4,1.4 5.6,8 0,4.4 -5.6,8 -4,1.4 -9,-2.8 -2.6,-3Z";
function Stars({ level }: { level: number }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <path key={i} d={STAR} transform={`translate(${14 + i * 18} 33)`} fill={i < level ? "#a86f0c" : "none"} stroke="#a86f0c" strokeWidth={1.4} />
      ))}
    </>
  );
}

/** level 3: long fingers · 2: medium · 1: short bulb · 0: broken pieces */
function Turmeric({ level }: { level: number }) {
  const c = "#d48a12";
  if (level >= 3)
    return (
      <>
        <rect x={10} y={22} width={44} height={9} rx={4.5} fill={c} transform="rotate(-12 32 26)" />
        <rect x={12} y={36} width={40} height={9} rx={4.5} fill={c} transform="rotate(-6 32 40)" />
      </>
    );
  if (level === 2)
    return (
      <>
        <rect x={16} y={24} width={30} height={9} rx={4.5} fill={c} transform="rotate(-10 31 28)" />
        <rect x={20} y={38} width={26} height={9} rx={4.5} fill={c} />
      </>
    );
  if (level === 1) return <ellipse cx={32} cy={34} rx={13} ry={11} fill={c} />;
  return (
    <>
      {[
        [20, 26],
        [36, 22],
        [28, 38],
        [44, 36],
        [18, 44],
        [40, 48],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={7} height={5} rx={1.5} fill={c} transform={`rotate(${i * 30} ${x} ${y})`} />
      ))}
    </>
  );
}

function Flower({ level }: { level: number }) {
  const r = 5 + level * 3.2;
  return (
    <g transform="translate(32 33)">
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx={0} cy={-r} rx={r * 0.45} ry={r * 0.7} fill="#f2a516" transform={`rotate(${i * 45})`} />
      ))}
      <circle r={r * 0.55} fill="#c46a08" />
    </g>
  );
}
