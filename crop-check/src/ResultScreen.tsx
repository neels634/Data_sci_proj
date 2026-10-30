import React from "react";
import type { AnalysisResult } from "./api";
import type { Lang, Strings } from "./i18n";
import { speak } from "./speech";

interface Props {
  t: Strings;
  lang: Lang;
  result: AnalysisResult;
  onReset: () => void;
  onExpert: () => void; // ── PLUG: Hook for "Talk to an expert" action
}

const SEVERITY_COLORS: Record<string, string> = {
  low: "#2E7D32",
  medium: "#B26A00",
  high: "#B3261E",
};

const TYPE_LABELS: Record<string, (t: Strings) => string> = {
  disease: (t) => t.resultDisease,
  pest: (t) => t.resultPest,
  healthy: (t) => t.resultHealthy,
};

const SEVERITY_LABELS: Record<string, (t: Strings) => string> = {
  low: (t) => t.severityLow,
  medium: (t) => t.severityMedium,
  high: (t) => t.severityHigh,
};

export function ResultScreen({ t, lang, result, onReset, onExpert }: Props) {
  const lowConfidence = result.confidence < 0.6;

  const handleListen = () => {
    if (lowConfidence) {
      speak(t.notSure, lang);
      return;
    }
    const name = result.name[lang] || result.name.en;
    const explanation = result.explanation[lang] || result.explanation.en;
    const steps = (result.steps[lang] || result.steps.en).join(". ");
    speak(`${name}. ${explanation}. ${t.whatToDo}: ${steps}`, lang);
  };

  if (lowConfidence) {
    return (
      <div className="screen result-screen">
        <div className="result-card not-sure-card">
          <div className="not-sure-icon">🤔</div>
          <p className="not-sure-text">{t.notSure}</p>
          <button className="btn btn-primary" onClick={onReset}>
            {t.checkAnother}
          </button>
        </div>
      </div>
    );
  }

  const name = result.name[lang] || result.name.en;
  const explanation = result.explanation[lang] || result.explanation.en;
  const steps = result.steps[lang] || result.steps.en;
  const severityColor = SEVERITY_COLORS[result.severity] || "#666";
  const typeLabel = (TYPE_LABELS[result.type] || TYPE_LABELS.healthy)(t);
  const severityLabel = (SEVERITY_LABELS[result.severity] || SEVERITY_LABELS.low)(t);

  return (
    <div className="screen result-screen">
      <div className="result-card">
        {/* Header with listen */}
        <div className="screen-header">
          <h1 className="screen-title">{name}</h1>
          <button className="btn btn-icon btn-listen" onClick={handleListen} aria-label={t.listenBtn}>
            🔊
          </button>
        </div>

        {/* Tags */}
        <div className="tags-row">
          <span className={`tag tag-type tag-${result.type}`}>{typeLabel}</span>
          <span className="tag tag-severity" style={{ backgroundColor: severityColor, color: "#fff" }}>
            {severityLabel}
          </span>
        </div>

        {/* Explanation */}
        <p className="explanation">{explanation}</p>

        {/* Steps */}
        <div className="steps-section">
          <h2 className="steps-title">{t.whatToDo}</h2>
          <ol className="steps-list">
            {steps.map((step, i) => (
              <li key={i} className="step-item">
                <span className="step-num">{i + 1}</span>
                <span className="step-text">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Confidence bar */}
        <div className="confidence-section">
          <div className="confidence-bar">
            <div
              className="confidence-fill"
              style={{ width: `${result.confidence * 100}%` }}
            />
          </div>
          <p className="confidence-text">
            {Math.round(result.confidence * 100)}%
          </p>
        </div>

        {/* Actions */}
        <div className="result-actions">
          <button className="btn btn-primary" onClick={onReset}>
            {t.checkAnother}
          </button>
          {result.severity === "high" && (
            <button className="btn btn-expert" onClick={onExpert}>
              {t.talkExpert}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
