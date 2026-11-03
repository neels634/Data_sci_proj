import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "niger",
  emoji: "🌼",
  name: b("Niger (ramtil)", "कारळे"),
  aliases: ["niger", "nigerseed", "niger seed", "ramtil", "ram til", "khurasani", "कारळे", "कारळा", "खुरासणी", "रामतिल"],
  category: "oilseed",
  lifecycle: "seasonal",
  regions: ["north", "western"],
  majorDistricts: b("Nashik (Igatpuri), Ahilyanagar (hilly parts), Pune (western hilly parts)", "नाशिक (इगतपुरी), अहिल्यानगर (डोंगराळ भाग), पुणे (पश्चिम डोंगराळ भाग)"),
  tier: 2,
  seasons: [
    { season: "kharif", label: b("Late kharif", "उशिरा खरीप"), sowingWindow: b("August to early September, mostly rainfed on hill slopes", "ऑगस्ट ते सप्टेंबरच्या सुरुवातीला, मुख्यतः डोंगर उतारावर पावसावर"), sowingMonths: [8, 9], durationDays: [95, 110] },
  ],
  method: "direct",
  plantingMaterial: b("Seed (small; mix with sand or fine soil for even sowing)", "बियाणे (बारीक; एकसारख्या पेरणीसाठी वाळू किंवा बारीक मातीत मिसळा)"),
  soil: b("Grows on light, poor, sloping hill soils where few other crops do well.", "इतर पिके चांगली येत नाहीत अशा हलक्या, कमी कसाच्या डोंगर उताराच्या जमिनीत येते."),
  climate: b("Hilly, high-rainfall tracts; grows in the cool weather after the main rains.", "डोंगराळ, जास्त पावसाचा भाग; मुख्य पावसानंतरच्या थंड हवेत वाढते."),
  seedRate: b("About 2–3 kg seed per acre.", "एकरी साधारण 2–3 किलो बियाणे."),
  spacing: b("30 cm between rows and about 10 cm between plants.", "ओळींत 30 सेंमी व रोपांत साधारण 10 सेंमी."),
  irrigation: b("Grown rainfed on residual monsoon moisture. A light protective irrigation at flowering helps if water is available.", "पावसाळ्यानंतर राहिलेल्या ओलाव्यावर कोरडवाहू घेतले जाते. पाणी असल्यास फुलोऱ्यात एक हलके संरक्षित पाणी फायदेशीर."),
  nutrientGuide: b("Add farmyard manure; it responds to a small dose of nitrogen and phosphorus as per soil test. Ask your agriculture officer for amounts.", "शेणखत द्या; माती परीक्षणानुसार थोड्या नत्र व स्फुरदाला चांगला प्रतिसाद देते. प्रमाण कृषी अधिकाऱ्यांना विचारा."),
  varieties: [
    { name: "IGP 76", note: b("Released from MPKV's Igatpuri research station", "मफुकृविच्या इगतपुरी संशोधन केंद्राचा वाण") },
  ], // TODO: varieties — confirm newer varieties (e.g. Phule Vaitarna) with MPKV Igatpuri station
  stages: [
    stage("emergence", ["Sowing & emergence", "पेरणी व उगवण"], 0, 15, ["Seeds sprout and small seedlings come up.", "बी रुजून लहान रोपे वर येतात."], [
      t("ng-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Mix seed with sand and sow 2–3 cm deep in lines across the slope.", "बियाणे वाळूत मिसळून उताराला आडव्या ओळीत 2–3 सेंमी खोल पेरा."]),
      t("ng-thin", 12, "other", ["Thin plants", "विरळणी करा"], ["Keep one plant every 10 cm.", "दर 10 सेंमीवर एक रोप ठेवा."]),
    ], [["Seedlings washed out by heavy rain", "जोरदार पावसाने रोपे वाहून जाणे"]]),
    stage("vegetative", ["Plant growth", "रोपांची वाढ"], 15, 45, ["Stem grows and branches form.", "खोड वाढते व फांद्या फुटतात."], [
      t("ng-weed", 18, "weeding", ["Weeding", "खुरपणी"], ["One or two weedings in the first month; watch for the dodder (amarvel) creeper.", "पहिल्या महिन्यात 1–2 खुरपण्या; अमरवेलीवर लक्ष ठेवा."], 15),
      t("ng-obs1", 20, "observation", ["Check plants", "झाडे तपासा"], ["Look for caterpillars and leaf spots.", "अळ्या व पानांवरील ठिपके पाहा."], 10),
    ], [["Dodder (amarvel) creeper", "अमरवेल"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 45, 75, ["Bright yellow flowers cover the field; bees pollinate them.", "शेत पिवळ्या धमक फुलांनी भरते; मधमाश्या परागीभवन करतात."], [
      t("ng-bees", 46, "observation", ["Protect bees", "मधमाश्यांचे संरक्षण करा"], ["Niger needs bees for seed set. Keep bee boxes nearby if possible and avoid spraying in flowering.", "कारळ्याचे दाणे भरण्यासाठी मधमाश्या लागतात. शक्य असल्यास मधपेट्या ठेवा व फुलोऱ्यात फवारणी टाळा."]),
      t("ng-obs2", 50, "observation", ["Check flower heads", "फुले तपासा"], ["Look for caterpillars and flies feeding in heads.", "फुलात खाणाऱ्या अळ्या व माश्या पाहा."], 7),
      t("ng-irr", 55, "irrigation", ["Protective irrigation (if available)", "संरक्षित पाणी (उपलब्ध असल्यास)"], ["One light watering if the soil is very dry.", "जमीन खूप कोरडी असल्यास एक हलके पाणी."]),
    ], [["Niger fly and caterpillars in heads", "फुलातील माशी व अळ्या"]]),
    stage("seed-filling", ["Seed filling", "दाणे भरणे"], 75, 95, ["Seeds fill and turn black.", "दाणे भरतात व काळे होतात."], [
      t("ng-obs3", 76, "observation", ["Check heads", "बोंडे तपासा"], ["Heads turning brown show seed is filling.", "बोंडे तपकिरी होऊ लागली म्हणजे दाणे भरत आहेत."], 7),
      t("ng-bird", 80, "other", ["Guard from birds", "पक्ष्यांपासून राखण करा"], ["Birds love niger seed; guard the field.", "पक्ष्यांना कारळे आवडतात; राखण करा."]),
    ], [["Bird damage", "पक्ष्यांचे नुकसान"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 95, 110, ["Leaves dry and heads turn dark brown.", "पाने वाळतात व बोंडे गडद तपकिरी होतात."], [
      t("ng-harv", 95, "harvest", ["Cut and stack", "कापून ढीग लावा"], ["Cut plants, stack them for a few days to dry, then beat to separate seed.", "झाडे कापून काही दिवस ढीग लावून वाळवा, मग झोडपून दाणे वेगळे करा."]),
      t("ng-clean", 100, "other", ["Clean and dry seed", "दाणे स्वच्छ करून वाळवा"], ["Winnow and dry seed well before storing.", "उफणून दाणे चांगले वाळवा, मग साठवा."]),
    ], [["Seed shedding if harvest is delayed", "काढणी उशिरा झाल्यास दाणे गळणे"]]),
  ],
  commonProblems: [
    {
      name: b("Dodder (amarvel)", "अमरवेल"),
      signs: b("Yellow, thread-like leafless creeper wraps around plants and weakens them.", "पिवळ्या दोऱ्यासारखी पानरहित वेल झाडांभोवती गुंडाळून त्यांना कमजोर करते."),
      prevention: prevent("Use clean seed free of dodder seed and pull out and burn affected patches before dodder flowers.", "अमरवेलीच्या बियांविरहित स्वच्छ बियाणे वापरा व अमरवेलीला फुले येण्यापूर्वी बाधित भाग उपटून जाळा."),
    },
    {
      name: b("Leaf-eating caterpillars", "पाने खाणाऱ्या अळ्या"),
      signs: b("Leaves eaten, sometimes the whole field stripped.", "पाने खाल्लेली; कधी कधी संपूर्ण शेत फस्त होते."),
      prevention: prevent("Hand-collect caterpillars early and keep field borders clean.", "अळ्या लवकर हाताने वेचा व बांध स्वच्छ ठेवा."),
    },
  ],
  harvestSigns: b("Leaves dry and fall, and flower heads turn dark brown to black.", "पाने वाळून गळतात व बोंडे गडद तपकिरी ते काळी होतात."),
  postHarvest: b("Dry seed well, clean out dust and dodder seed, and store in dry bags.", "दाणे चांगले वाळवा, धूळ व अमरवेलीचे बी काढून स्वच्छ करा आणि कोरड्या पोत्यांत साठवा."),
  marketTips: b("Clean niger seed has demand for oil and as bird feed. Ask local traders and tribal produce centres for rates.", "स्वच्छ कारळ्याला तेलासाठी व पक्ष्यांच्या खाद्यासाठी मागणी असते. स्थानिक व्यापारी व आदिवासी खरेदी केंद्रांकडे दर विचारा."),
  source: "General practices from MPKV Rahuri (Zonal Agricultural Research Station, Igatpuri) niger guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
