import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "nachni",
  emoji: "🌾",
  name: b("Nachni (ragi, finger millet)", "नाचणी"),
  aliases: ["nachni", "nachani", "ragi", "finger millet", "nagli", "नाचणी", "नागली", "रागी", "मंडुआ"],
  category: "millet",
  lifecycle: "seasonal",
  regions: ["konkan", "western", "north"],
  majorDistricts: b("Kolhapur, Ratnagiri, Sindhudurg, Raigad, Palghar, Thane, Nashik", "कोल्हापूर, रत्नागिरी, सिंधुदुर्ग, रायगड, पालघर, ठाणे, नाशिक"),
  tier: 2,
  seasons: [
    {
      season: "kharif",
      sowingWindow: b("Nursery in June with the first rains; transplant in July. Some hill farmers sow directly.", "जूनमध्ये पहिल्या पावसात रोपवाटिका; जुलैमध्ये लावणी. काही डोंगरी शेतकरी थेट पेरणी करतात."),
      sowingMonths: [6],
      durationDays: [110, 130],
    },
  ],
  method: "both",
  plantingMaterial: b("Seed, mostly raised as seedlings in a nursery", "बियाणे; बहुतेक रोपवाटिकेत रोपे तयार करून"),
  nurseryDays: 25,
  soil: b(
    "Light, red or lateritic hill soils and slopes; must drain well. Does well where rice cannot be grown.",
    "हलकी, तांबडी किंवा जांभ्या दगडाची डोंगरउताराची जमीन; पाण्याचा निचरा हवा. भात न येणाऱ्या वरकस जमिनीत चांगली येते.",
  ),
  climate: b("Monsoon crop of the Sahyadri hills and Konkan; handles heavy rain if the soil drains.", "सह्याद्रीच्या डोंगरी भागाचे व कोकणाचे पावसाळी पीक; निचरा असल्यास जास्त पाऊस सहन करते."),
  seedRate: b("About 2 kg seed per acre for a nursery (transplanting); 4 kg for direct sowing.", "लावणीसाठी रोपवाटिकेस एकरी साधारण 2 किलो बियाणे; थेट पेरणीसाठी 4 किलो."),
  spacing: b("Transplant at about 20–25 cm between rows and 10–15 cm between plants, 2 seedlings per spot.", "ओळींत साधारण 20–25 सेंमी व रोपांत 10–15 सेंमी, एका जागी 2 रोपे लावा."),
  irrigation: b("Rain-fed. Water is needed only if rain stops for long during flowering, where a source is available.", "पावसावर येते. फुलोऱ्यात पावसाचा मोठा खंड पडल्यास व पाण्याची सोय असल्यासच पाणी द्या."),
  nutrientGuide: b(
    "Mix farmyard manure or compost before transplanting. Give nitrogen in two parts — at transplanting and about a month later. Ask your agriculture officer for amounts.",
    "लावणीपूर्वी शेणखत किंवा कंपोस्ट मिसळा. नत्र दोन हप्त्यांत द्या — लावणीवेळी व साधारण महिन्याने. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("nursery", ["Nursery", "रोपवाटिका"], 0, 25, ["Seeds sprout in the nursery and grow into seedlings.", "रोपवाटिकेत बी उगवते आणि रोपे तयार होतात."], [
      t("nc-nbed", 0, "sowing", ["Prepare nursery and sow", "रोपवाटिका तयार करून पेरणी करा"], ["Make raised beds, mix compost and sow seed thinly in lines. Mix the fine seed with sand for even spreading.", "गादीवाफे करा, कंपोस्ट मिसळा व ओळीत विरळ पेरा. बारीक बियाणे सारखे पडावे म्हणून वाळूत मिसळा."]),
      t("nc-nobs", 12, "observation", ["Check seedlings", "रोपे तपासा"], ["Look for spots on leaves and weeds in the beds; pull weeds gently.", "पानांवरील ठिपके व वाफ्यांतील तण पाहा; तण हळुवार काढा."]),
    ], [["Leaf blast spots on seedlings", "रोपांवर करप्याचे ठिपके"]]),
    stage("transplanting", ["Transplanting", "लावणी"], 25, 32, ["Seedlings are planted in the main field.", "रोपे मुख्य शेतात लावली जातात."], [
      t("nc-field", 25, "other", ["Prepare the field", "शेत तयार करा"], ["Plough after good rain, mix manure and level the land.", "चांगल्या पावसानंतर नांगरट करून शेणखत मिसळा व जमीन सपाट करा."]),
      t("nc-tp", 26, "transplanting", ["Transplant", "लावणी करा"], ["Plant 3–4 week old seedlings, 2 per spot, on a rainy day.", "3–4 आठवड्यांची रोपे, एका जागी 2, पावसाळी दिवशी लावा."]),
    ], [["Seedlings drying if rain stops after planting", "लावणीनंतर पाऊस थांबल्यास रोपे सुकणे"]]),
    stage("vegetative", ["Growth & tillering", "वाढ व फुटवे"], 32, 70, ["Plants grow and make tillers.", "रोपे वाढतात व फुटवे येतात."], [
      t("nc-gap", 33, "other", ["Fill gaps", "खाडे भरा"], ["Replant where seedlings died.", "मेलेल्या रोपांच्या जागी रोपे लावा."]),
      t("nc-weed", 40, "weeding", ["Weeding", "खुरपणी"], ["Weed twice in the first 45 days after transplanting.", "लावणीनंतर पहिल्या 45 दिवसांत दोनदा खुरपणी करा."], 15),
      t("nc-fert", 55, "fertiliser", ["Top dressing", "वरखत"], ["Give the second nitrogen part when the soil is moist.", "जमिनीत ओल असताना नत्राचा दुसरा हप्ता द्या."]),
    ], [["Weeds smother the young crop", "तण कोवळ्या पिकाला दाबतात"], ["Stem borer", "खोडकिडा"]]),
    stage("flowering", ["Earhead & flowering", "कणीस व फुलोरा"], 70, 95, ["Finger-like earheads come out and flower.", "बोटांसारखी कणसे बाहेर येतात व फुलतात."], [
      t("nc-obs1", 72, "observation", ["Check earheads", "कणसे तपासा"], ["Look for the neck of the earhead turning black and fingers drying (blast).", "कणसाची मान काळी पडून बोटे वाळणे (करपा) पाहा."], 7),
      t("nc-obs2", 80, "observation", ["Check stems", "खोड तपासा"], ["Look for dead centre shoots and holes in stems.", "मधला पोंगा वाळणे व खोडाला छिद्रे पाहा."]),
    ], [["Neck and finger blast", "मानेचा व बोटांचा करपा"]]),
    stage("grain", ["Grain filling", "दाणे भरणे"], 95, 115, ["Grains fill and turn brown.", "दाणे भरतात व तपकिरी होतात."], [
      t("nc-bird", 96, "other", ["Protect from birds", "पक्ष्यांपासून राखण"], ["Guard the crop in mornings and evenings.", "सकाळ-संध्याकाळ पिकाची राखण करा."]),
      t("nc-obs3", 100, "observation", ["Check grain", "दाणे तपासा"], ["Note which plants have the best earheads; keep them for seed.", "सर्वात चांगली कणसे असलेली झाडे ओळखून बियाण्यासाठी ठेवा."]),
    ], [["Bird damage", "पक्ष्यांचे नुकसान"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 115, 130, ["Earheads turn brown and grains are hard.", "कणसे तपकिरी होतात व दाणे टणक होतात."], [
      t("nc-mat", 115, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Earheads brown and grains hard when pressed → ready.", "कणसे तपकिरी व दाबल्यावर दाणे टणक → तयार."]),
      t("nc-harv", 118, "harvest", ["Harvest earheads", "कणसे खुडा"], ["Cut earheads, dry them in the sun for a few days and thresh.", "कणसे खुडून काही दिवस उन्हात वाळवा व मळणी करा."]),
    ], [["Rain at harvest makes grain sprout", "काढणीच्या वेळी पावसाने दाण्यांना मोड"]]),
  ],
  commonProblems: [
    {
      name: b("Blast", "करपा"),
      signs: b("Eye-shaped spots on leaves; the neck of the earhead turns black and the fingers dry with empty grains.", "पानांवर डोळ्याच्या आकाराचे ठिपके; कणसाची मान काळी पडते व बोटे वाळून दाणे पोचट राहतात."),
      prevention: prevent("Grow tolerant varieties, use seed from healthy plants and remove crop leftovers.", "सहनशील वाण घ्या, निरोगी झाडांचे बियाणे वापरा व पिकाचे अवशेष काढून टाका."),
    },
    {
      name: b("Stem borer", "खोडकिडा"),
      signs: b("The centre shoot dries (dead heart); holes in the stem.", "मधला पोंगा वाळतो; खोडाला छिद्रे."),
      prevention: prevent("Pull out and destroy dead shoots, and clear stubble after harvest.", "वाळलेले पोंगे उपटून नष्ट करा व काढणीनंतर धसकटे वेचा."),
    },
    {
      name: b("Weeds", "तण"),
      signs: b("Weeds grow faster than the young crop and the crop stays thin and yellow.", "कोवळ्या पिकापेक्षा तण जलद वाढते आणि पीक बारीक व पिवळे राहते."),
      prevention: b("Transplant rather than broadcast so you can weed between rows. Weed twice in the first 45 days.", "फेकून पेरणीऐवजी लावणी करा म्हणजे ओळींमध्ये खुरपणी करता येते. पहिल्या 45 दिवसांत दोनदा खुरपणी करा."),
    },
  ],
  harvestSigns: b("Earheads turn brown and the grains are hard.", "कणसे तपकिरी झाली आहेत व दाणे टणक आहेत."),
  postHarvest: b(
    "Dry earheads well in the sun, thresh and clean. Nachni grain stores for years without much insect damage if kept dry.",
    "कणसे उन्हात चांगली वाळवून मळणी करा व स्वच्छ करा. कोरडी ठेवल्यास नाचणी अनेक वर्षे किडीशिवाय टिकते.",
  ),
  marketTips: b(
    "Demand for nachni flour, papad and health foods is rising in towns. Clean, stone-free grain and simple processing (flour, malt) earn more. Check the support price.",
    "शहरांत नाचणीचे पीठ, पापड व आरोग्यदायी पदार्थांना मागणी वाढत आहे. स्वच्छ, खडेविरहित दाणे व साधी प्रक्रिया (पीठ, सत्त्व) केल्यास जास्त दर मिळतो. हमीभाव तपासा.",
  ),
  varieties: [
    { name: "Dapoli-1", note: b("From Dr. BSKKV Dapoli for Konkan", "कोकणासाठी डॉ. बाळासाहेब सावंत कोकण कृषी विद्यापीठ, दापोलीचा वाण") },
    { name: "Phule Nachni", note: b("From MPKV (Kolhapur station) for western Maharashtra hills", "पश्चिम महाराष्ट्राच्या डोंगरी भागासाठी मफुकृवि (कोल्हापूर केंद्र) यांचा वाण") },
  ],
  source: "General practices from Dr. BSKKV Dapoli and MPKV Rahuri (Kolhapur station) finger millet guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
