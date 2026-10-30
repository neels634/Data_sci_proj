import React, { useRef, useCallback } from "react";
import type { Lang, Strings } from "./i18n";
import { compressImage } from "./imageUtils";
import { speak } from "./speech";

interface SlotDef {
  id: number;
  label: (t: Strings) => string;
  required: boolean;
}

const SLOT_GROUPS: { title: (t: Strings) => string; slots: SlotDef[] }[] = [
  {
    title: (t) => t.groupCloseup,
    slots: [
      { id: 0, label: (t) => t.slotFront, required: true },
      { id: 1, label: (t) => t.slotBack, required: true },
    ],
  },
  {
    title: (t) => t.groupWhole,
    slots: [
      { id: 2, label: (t) => t.slotPlantFront, required: true },
      { id: 3, label: (t) => t.slotPlantSide, required: true },
    ],
  },
  {
    title: (t) => t.groupExtra,
    slots: [{ id: 4, label: (t) => t.slotExtra, required: false }],
  },
];

const REQUIRED_COUNT = 4;

interface Props {
  t: Strings;
  lang: Lang;
  photos: (string | null)[];
  onPhoto: (index: number, dataUri: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function PhotoScreen({ t, lang, photos, onPhoto, onSubmit, submitting }: Props) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const doneCount = photos.filter((p) => p !== null).length;
  const requiredDone = photos.slice(0, 4).filter((p) => p !== null).length;
  const canSubmit = requiredDone >= REQUIRED_COUNT && !submitting;

  const handleFile = useCallback(
    async (index: number, file: File | undefined) => {
      if (!file) return;
      try {
        const compressed = await compressImage(file);
        onPhoto(index, compressed);
      } catch {
        // silently fail — user can retake
      }
    },
    [onPhoto]
  );

  const handleListen = () => {
    const text = `${t.takePhotos}. ${t.photoInstruction}`;
    speak(text, lang);
  };

  return (
    <div className="screen photo-screen">
      <div className="screen-header">
        <h1 className="screen-title">{t.takePhotos}</h1>
        <button className="btn btn-icon btn-listen" onClick={handleListen} aria-label={t.listenBtn}>
          🔊
        </button>
      </div>

      <p className="instruction">{t.photoInstruction}</p>

      {/* Progress */}
      <div className="progress-section">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(requiredDone / REQUIRED_COUNT) * 100}%` }}
          />
        </div>
        <p className="progress-text">{t.progressText(requiredDone, REQUIRED_COUNT)}</p>
      </div>

      {/* Photo slots */}
      {SLOT_GROUPS.map((group, gi) => (
        <div key={gi} className="photo-group">
          <h2 className="group-title">{group.title(t)}</h2>
          <div className="slots-row">
            {group.slots.map((slot) => {
              const photo = photos[slot.id];
              return (
                <div
                  key={slot.id}
                  className={`photo-slot ${photo ? "has-photo" : ""} ${slot.required ? "" : "optional"}`}
                  onClick={() => inputRefs.current[slot.id]?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label={slot.label(t)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRefs.current[slot.id]?.click(); }}
                >
                  {photo ? (
                    <>
                      <img src={photo} alt={slot.label(t)} className="slot-thumb" />
                      <span className="slot-tick">✅</span>
                      <span className="slot-retake">{t.tapToRetake}</span>
                    </>
                  ) : (
                    <>
                      <span className="slot-camera">📸</span>
                      <span className="slot-label">{slot.label(t)}</span>
                    </>
                  )}
                  <input
                    ref={(el) => { inputRefs.current[slot.id] = el; }}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden-input"
                    onChange={(e) => {
                      handleFile(slot.id, e.target.files?.[0]);
                      e.target.value = ""; // allow same file re-selection
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Submit */}
      <button
        className={`btn btn-primary btn-submit ${canSubmit ? "" : "btn-disabled"}`}
        disabled={!canSubmit}
        onClick={onSubmit}
      >
        {submitting ? (
          <span className="spinner-text">
            <span className="spinner" /> {t.checking}
          </span>
        ) : (
          t.checkBtn
        )}
      </button>
    </div>
  );
}
