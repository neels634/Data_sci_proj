import React from "react";
import { LANG_META, type Lang } from "./i18n";

interface Props {
  onSelect: (lang: Lang) => void;
}

export function LanguageScreen({ onSelect }: Props) {
  const langs = Object.entries(LANG_META) as [Lang, (typeof LANG_META)[Lang]][];

  return (
    <div className="screen language-screen">
      <div className="logo">🌿</div>
      <h1 className="screen-title">Crop Check</h1>
      <p className="subtitle">फसल जाँच · पीक तपासणी</p>
      <div className="lang-buttons">
        {langs.map(([key, meta]) => (
          <button
            key={key}
            className="btn btn-lang"
            onClick={() => onSelect(key)}
          >
            {meta.label}
          </button>
        ))}
      </div>
    </div>
  );
}
