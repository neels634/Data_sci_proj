/**
 * speech.ts — Text-to-speech helper using Web Speech API.
 */

import { LANG_META, type Lang } from "./i18n";

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, lang: Lang) {
  // Stop any ongoing speech first
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG_META[lang].speechCode;
  utterance.rate = 0.9;
  utterance.pitch = 1;
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  window.speechSynthesis.cancel();
  currentUtterance = null;
}
