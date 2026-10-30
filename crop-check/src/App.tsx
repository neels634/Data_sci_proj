import React, { useState, useCallback } from "react";
import { translations, type Lang, type Strings } from "./i18n";
import { analyzeCrop, type AnalysisResult } from "./api";
import { stopSpeaking } from "./speech";
import { LanguageScreen } from "./LanguageScreen";
import { PhotoScreen } from "./PhotoScreen";
import { ResultScreen } from "./ResultScreen";

type Screen = "language" | "photo" | "result" | "error";

export default function App() {
  const [lang, setLang] = useState<Lang | null>(null);
  const [screen, setScreen] = useState<Screen>("language");
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null, null]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorType, setErrorType] = useState<"offline" | "server" | null>(null);

  const t: Strings = lang ? translations[lang] : translations.en;

  const handleLangSelect = useCallback((l: Lang) => {
    setLang(l);
    setScreen("photo");
    stopSpeaking();
  }, []);

  const handlePhoto = useCallback((index: number, dataUri: string) => {
    setPhotos((prev) => {
      const next = [...prev];
      next[index] = dataUri;
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!lang) return;
    setSubmitting(true);
    setErrorType(null);
    stopSpeaking();

    try {
      if (!navigator.onLine) throw new Error("offline");

      const images = photos.filter((p): p is string => p !== null);
      const res = await analyzeCrop({ images, language: lang });
      setResult(res);
      setScreen("result");
    } catch (err: any) {
      if (err?.message === "offline" || !navigator.onLine) {
        setErrorType("offline");
      } else {
        setErrorType("server");
      }
      setScreen("error");
    } finally {
      setSubmitting(false);
    }
  }, [lang, photos]);

  const handleReset = useCallback(() => {
    setPhotos([null, null, null, null, null]);
    setResult(null);
    setErrorType(null);
    setScreen("photo");
    stopSpeaking();
  }, []);

  const handleExpert = useCallback(() => {
    // ── PLUG: Connect to your expert-chat / helpline system ──
    alert("Expert contact feature coming soon!");
  }, []);

  const handleRetry = useCallback(() => {
    setErrorType(null);
    setScreen("photo");
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <span className="app-title">{t.appTitle}</span>
        {lang && screen !== "language" && (
          <button
            className="btn btn-icon btn-lang-switch"
            onClick={() => { setScreen("language"); stopSpeaking(); }}
            aria-label="Change language"
          >
            🌐
          </button>
        )}
      </header>

      <main className="app-main">
        {screen === "language" && <LanguageScreen onSelect={handleLangSelect} />}

        {screen === "photo" && (
          <PhotoScreen
            t={t}
            lang={lang!}
            photos={photos}
            onPhoto={handlePhoto}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}

        {screen === "result" && result && (
          <ResultScreen
            t={t}
            lang={lang!}
            result={result}
            onReset={handleReset}
            onExpert={handleExpert}
          />
        )}

        {screen === "error" && (
          <div className="screen error-screen">
            <div className="error-card">
              <div className="error-icon">
                {errorType === "offline" ? "📡" : "⚠️"}
              </div>
              <p className="error-text">
                {errorType === "offline" ? t.noInternet : t.serverError}
              </p>
              <button className="btn btn-primary" onClick={handleRetry}>
                {t.retry}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
