/**
 * i18n.ts — Every user-visible string in one place.
 * To add a language: add its key (e.g. "ta") and fill every field.
 */

export type Lang = "en" | "hi" | "mr";

export const LANG_META: Record<Lang, { label: string; speechCode: string }> = {
  en: { label: "English",  speechCode: "en-IN" },
  hi: { label: "हिन्दी",    speechCode: "hi-IN" },
  mr: { label: "मराठी",    speechCode: "mr-IN" },
};

export interface Strings {
  appTitle: string;
  chooseLang: string;
  takePhotos: string;
  photoInstruction: string;
  groupCloseup: string;
  slotFront: string;
  slotBack: string;
  groupWhole: string;
  slotPlantFront: string;
  slotPlantSide: string;
  groupExtra: string;
  slotExtra: string;
  progressText: (done: number, total: number) => string;
  checkBtn: string;
  checking: string;
  resultDisease: string;
  resultPest: string;
  resultHealthy: string;
  severityLow: string;
  severityMedium: string;
  severityHigh: string;
  whatToDo: string;
  checkAnother: string;
  talkExpert: string;
  notSure: string;
  retakeTip: string;
  noInternet: string;
  serverError: string;
  retry: string;
  listenBtn: string;
  tapToRetake: string;
}

const en: Strings = {
  appTitle: "🌿 Crop Check",
  chooseLang: "Choose your language",
  takePhotos: "Take 4 photos",
  photoInstruction: "Keep the leaf or fruit in the center. Use daylight. Tap a box to open the camera.",
  groupCloseup: "📷 Close-up of the problem",
  slotFront: "Front of leaf / fruit",
  slotBack: "Other side or closer",
  groupWhole: "🌱 Whole plant",
  slotPlantFront: "Plant from front",
  slotPlantSide: "Plant from side",
  groupExtra: "📎 Extra (optional)",
  slotExtra: "Back of leaf or soil",
  progressText: (done, total) => `${done} of ${total} photos done`,
  checkBtn: "✅ Check my crop",
  checking: "Checking your crop...",
  resultDisease: "🦠 Disease",
  resultPest: "🐛 Pest",
  resultHealthy: "✅ Healthy",
  severityLow: "Low",
  severityMedium: "Medium",
  severityHigh: "High",
  whatToDo: "What to do",
  checkAnother: "🔄 Check another plant",
  talkExpert: "📞 Talk to an expert",
  notSure: "Not sure. Please retake clearer photos.",
  retakeTip: "Photo is too blurry or dark. Please retake.",
  noInternet: "No internet. Please check your connection.",
  serverError: "Something went wrong. Please try again.",
  retry: "🔄 Retry",
  listenBtn: "🔊 Listen",
  tapToRetake: "Tap to retake",
};

const hi: Strings = {
  appTitle: "🌿 फसल जाँच",
  chooseLang: "अपनी भाषा चुनें",
  takePhotos: "4 फ़ोटो लें",
  photoInstruction: "पत्ते या फल को बीच में रखें। दिन की रोशनी में लें। डिब्बे पर टैप करके कैमरा खोलें।",
  groupCloseup: "📷 समस्या की नज़दीकी फ़ोटो",
  slotFront: "पत्ते / फल का आगे का हिस्सा",
  slotBack: "दूसरी तरफ़ या और पास से",
  groupWhole: "🌱 पूरा पौधा",
  slotPlantFront: "पौधा सामने से",
  slotPlantSide: "पौधा बगल से",
  groupExtra: "📎 अतिरिक्त (वैकल्पिक)",
  slotExtra: "पत्ते का पीछे या मिट्टी",
  progressText: (done, total) => `${total} में से ${done} फ़ोटो हो गई`,
  checkBtn: "✅ फसल जाँचें",
  checking: "फसल जाँच हो रही है...",
  resultDisease: "🦠 रोग",
  resultPest: "🐛 कीट",
  resultHealthy: "✅ स्वस्थ",
  severityLow: "कम",
  severityMedium: "मध्यम",
  severityHigh: "गंभीर",
  whatToDo: "क्या करें",
  checkAnother: "🔄 दूसरा पौधा जाँचें",
  talkExpert: "📞 विशेषज्ञ से बात करें",
  notSure: "पक्का नहीं है। कृपया और साफ़ फ़ोटो लें।",
  retakeTip: "फ़ोटो धुँधली या अंधेरी है। कृपया दोबारा लें।",
  noInternet: "इंटरनेट नहीं है। कनेक्शन जाँचें।",
  serverError: "कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।",
  retry: "🔄 दोबारा",
  listenBtn: "🔊 सुनें",
  tapToRetake: "दोबारा लेने के लिए टैप करें",
};

const mr: Strings = {
  appTitle: "🌿 पीक तपासणी",
  chooseLang: "तुमची भाषा निवडा",
  takePhotos: "4 फोटो काढा",
  photoInstruction: "पान किंवा फळ मध्यभागी ठेवा. दिवसाच्या प्रकाशात काढा. बॉक्सवर टॅप करून कॅमेरा उघडा.",
  groupCloseup: "📷 समस्येचा जवळचा फोटो",
  slotFront: "पान / फळ समोरून",
  slotBack: "दुसरी बाजू किंवा अधिक जवळून",
  groupWhole: "🌱 पूर्ण झाड",
  slotPlantFront: "झाड समोरून",
  slotPlantSide: "झाड बाजूने",
  groupExtra: "📎 अतिरिक्त (ऐच्छिक)",
  slotExtra: "पानाची मागची बाजू किंवा माती",
  progressText: (done, total) => `${total} पैकी ${done} फोटो झाले`,
  checkBtn: "✅ माझे पीक तपासा",
  checking: "तुमचे पीक तपासत आहे...",
  resultDisease: "🦠 रोग",
  resultPest: "🐛 कीड",
  resultHealthy: "✅ निरोगी",
  severityLow: "कमी",
  severityMedium: "मध्यम",
  severityHigh: "गंभीर",
  whatToDo: "काय करावे",
  checkAnother: "🔄 दुसरे झाड तपासा",
  talkExpert: "📞 तज्ञांशी बोला",
  notSure: "खात्री नाही. कृपया स्पष्ट फोटो पुन्हा काढा.",
  retakeTip: "फोटो अस्पष्ट किंवा गडद आहे. कृपया पुन्हा काढा.",
  noInternet: "इंटरनेट नाही. कृपया कनेक्शन तपासा.",
  serverError: "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
  retry: "🔄 पुन्हा",
  listenBtn: "🔊 ऐका",
  tapToRetake: "पुन्हा काढण्यासाठी टॅप करा",
};

export const translations: Record<Lang, Strings> = { en, hi, mr };
