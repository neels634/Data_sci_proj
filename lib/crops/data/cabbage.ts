import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "cabbage",
  emoji: "🥬",
  name: b("Cabbage", "कोबी"),
  aliases: ["cabbage", "kobi", "कोबी", "patta gobi", "patta gobhi", "पत्ता गोभी", "पानकोबी", "band gobhi"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada"],
  majorDistricts: b("Pune, Nashik, Satara", "पुणे, नाशिक, सातारा"),
  tier: 2,
  seasons: [
    { season: "rabi", sowingWindow: b("Nursery in September–November (main season)", "रोपवाटिका सप्टेंबर–नोव्हेंबर (मुख्य हंगाम)"), sowingMonths: [9, 10, 11], durationDays: [100, 120] },
    { season: "kharif", sowingWindow: b("Nursery in June–July", "रोपवाटिका जून–जुलै"), sowingMonths: [6, 7], durationDays: [95, 115] },
  ],
  method: "transplant",
  plantingMaterial: b("Seed, raised as seedlings in a nursery", "बियाणे; रोपवाटिकेत रोपे तयार करून"),
  nurseryDays: 28,
  soil: b("Well-drained loamy or medium black soil with good organic matter.", "सेंद्रिय पदार्थ असलेली, पाण्याचा निचरा होणारी पोयट्याची किंवा मध्यम काळी जमीन."),
  climate: b("Cool weather gives firm heads. Hot weather gives loose heads and more pests.", "थंड हवामानात गड्डे घट्ट बसतात. उष्ण हवामानात गड्डे सैल राहतात व कीड जास्त येते."),
  seedRate: b("About 150–200 g seed per acre for the nursery (hybrids need less).", "रोपवाटिकेसाठी एकरी साधारण 150–200 ग्रॅम बियाणे (संकरित वाणाला कमी)."),
  spacing: b("45–60 cm between rows and between plants.", "ओळींत व रोपांत 45–60 सेंमी."),
  irrigation: b(
    "Water right after transplanting, then every 8–10 days in winter. Keep moisture even while heads form — a heavy watering after a dry spell splits heads. Kharif crop needs water only in dry spells.",
    "पुनर्लागवडीनंतर लगेच पाणी, नंतर हिवाळ्यात दर 8–10 दिवसांनी. गड्डा भरताना ओलावा सारखा ठेवा — कोरड्या खंडानंतर एकदम जास्त पाणी दिल्यास गड्डे फुटतात. खरीप पिकाला फक्त पावसाच्या खंडात पाणी.",
  ),
  nutrientGuide: b(
    "Use a soil test. Mix well-rotted farmyard manure before planting. Give nitrogen in 2–3 parts up to head formation. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. लागवडीपूर्वी कुजलेले शेणखत मिसळा. गड्डा धरेपर्यंत नत्र 2–3 हप्त्यांत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("nursery", ["Nursery", "रोपवाटिका"], 0, 28, ["Seedlings grow in raised beds or trays.", "गादीवाफ्यावर किंवा ट्रेमध्ये रोपे वाढतात."], [
      t("cb-bed", 0, "sowing", ["Sow the nursery", "रोपवाटिका पेरा"], ["Sow thinly in lines on raised beds or in trays.", "गादीवाफ्यावर ओळीत विरळ किंवा ट्रेमध्ये पेरा."]),
      t("cb-nwater", 1, "irrigation", ["Water lightly", "हलके पाणी"], ["Keep moist, not soggy.", "ओलसर ठेवा, चिखल नको."], 3),
    ], [["Damping off", "रोपे कोलमडणे"]]),
    stage("establishment", ["Transplanting & establishment", "पुनर्लागवड व स्थिरावणे"], 28, 40, ["Seedlings are planted and take root.", "रोपे शेतात लावली जातात व मूळ धरतात."], [
      t("cb-tp", 28, "transplanting", ["Transplant", "पुनर्लागवड करा"], ["Plant 4–5 week old seedlings in the evening and water right after.", "4–5 आठवड्यांची रोपे संध्याकाळी लावा व लगेच पाणी द्या."]),
      t("cb-gap", 34, "other", ["Fill the gaps", "खाडे भरा"], ["Replace dead seedlings.", "मेलेली रोपे बदला."]),
    ], [["Cutworms", "रोपे कापणाऱ्या अळ्या"]]),
    stage("vegetative", ["Leaf growth", "पानांची वाढ"], 40, 65, ["The plant forms a rosette of large outer leaves.", "झाडाला मोठ्या बाहेरील पानांचा घेर तयार होतो."], [
      t("cb-irr", 40, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 8–10 days.", "दर 8–10 दिवसांनी पाणी द्या."], 9),
      t("cb-weed", 45, "weeding", ["Weeding, top dressing and earthing up", "खुरपणी, वरखत व भर"], ["Weed, give the next nitrogen part as per soil test and pull soil to plants.", "खुरपणी करा, माती परीक्षणानुसार नत्राचा पुढचा हप्ता द्या व रोपांना भर लावा."]),
      t("cb-obs1", 42, "observation", ["Check for diamondback moth", "चौकोनी ठिपक्यांचा पतंग तपासा"], ["Look for small green caterpillars and window-like holes in leaves.", "लहान हिरव्या अळ्या व पानांवर खिडकीसारखी छिद्रे पाहा."], 7),
    ], [["Diamondback moth caterpillars", "चौकोनी ठिपक्यांच्या पतंगाची अळी"], ["Aphids", "मावा"]]),
    stage("head-formation", ["Head formation", "गड्डा धरणे"], 65, 100, ["Inner leaves fold into a firm head.", "आतील पाने गुंडाळून घट्ट गड्डा तयार होतो."], [
      t("cb-irr2", 65, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even moisture prevents split heads.", "सारख्या ओलाव्याने गड्डे फुटत नाहीत."], 8),
      t("cb-obs2", 67, "observation", ["Check heads", "गड्डे तपासा"], ["Look for caterpillars boring into heads and rot at the base.", "गड्ड्यात शिरणाऱ्या अळ्या व बुंध्याजवळ कूज पाहा."], 7),
    ], [["Black rot: V-shaped yellow patches from leaf edges", "काळी कूज: पानांच्या कडेपासून V आकाराचे पिवळे चट्टे"]]),
    stage("harvest", ["Harvest", "काढणी"], 100, 120, ["Firm heads are cut, usually in 2–3 rounds.", "घट्ट गड्डे साधारण 2–3 फेऱ्यांत कापले जातात."], [
      t("cb-cut", 100, "harvest", ["Cut firm heads", "घट्ट गड्डे कापा"], ["Cut heads that feel hard when pressed, keeping a few wrapper leaves.", "दाबल्यावर टणक लागणारे गड्डे काही बाहेरील पानांसह कापा."], 6),
      t("cb-grade", 101, "other", ["Grade and pack", "प्रतवारी करून भरा"], ["Sort by size, remove damaged heads.", "आकारानुसार वेगळे करा, खराब गड्डे काढा."], 6),
    ], [["Heads splitting if left too long", "जास्त दिवस ठेवल्यास गड्डे फुटणे"]]),
  ],
  commonProblems: [
    { name: b("Diamondback moth", "चौकोनी ठिपक्यांचा पतंग (डायमंड बॅक मॉथ)"), signs: b("Small green caterpillars; leaves full of small holes and see-through patches.", "लहान हिरव्या अळ्या; पानांवर लहान छिद्रे व पारदर्शक चट्टे."), prevention: prevent("Grow 2 rows of mustard around the field as a trap crop, use pheromone traps and check leaves weekly.", "शेताभोवती मोहरीच्या 2 ओळी सापळा पीक म्हणून लावा, कामगंध सापळे लावा आणि दर आठवड्याला पाने तपासा.") },
    { name: b("Black rot", "काळी कूज"), signs: b("Yellow V-shaped patches from leaf edges with black veins.", "पानांच्या कडेपासून V आकाराचे पिवळे चट्टे व काळ्या शिरा."), prevention: prevent("Use healthy seed and seedlings, rotate with non-cabbage-family crops, and remove affected leaves.", "निरोगी बियाणे व रोपे वापरा, कोबीवर्गीय नसलेल्या पिकांशी फेरपालट करा आणि बाधित पाने काढा.") },
    { name: b("Aphids", "मावा"), signs: b("Clusters of small grey-green insects under leaves and in heads.", "पानांखाली व गड्ड्यात लहान करड्या-हिरव्या कीटकांचे थवे."), prevention: prevent("Check under leaves regularly and use yellow sticky traps.", "पानांखाली नियमित तपासा आणि पिवळे चिकट सापळे लावा.") },
  ],
  harvestSigns: b("Heads are full-sized and feel hard and firm when pressed.", "गड्डे पूर्ण आकाराचे व दाबल्यावर टणक लागतात."),
  postHarvest: b("Cut in cool hours, keep a few wrapper leaves for protection, grade by size, and pack in crates or nets.", "थंड वेळेत कापा, संरक्षणासाठी काही बाहेरील पाने ठेवा, आकारानुसार प्रतवारी करा आणि क्रेट किंवा जाळीच्या पिशव्यांत भरा."),
  marketTips: b("Many farmers plant cabbage at the same time, so prices crash in peak winter. Staggered planting or an off-season crop can fetch better rates.", "अनेक शेतकरी एकाच वेळी कोबी लावतात, म्हणून ऐन हिवाळ्यात दर कोसळतात. टप्प्याटप्प्याने लागवड किंवा बिगरहंगामी पीक घेतल्यास चांगला दर मिळू शकतो."),
  varieties: [
    { name: "Golden Acre", note: b("Early, round-headed open-pollinated variety", "लवकर तयार होणारा, गोल गड्ड्याचा सरळ वाण") },
    { name: "Pride of India", note: b("Early open-pollinated variety", "लवकर तयार होणारा सरळ वाण") },
  ],
  source: "General practices from MPKV Rahuri and ICAR-IIVR cabbage guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
