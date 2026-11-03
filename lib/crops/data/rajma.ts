import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "rajma",
  emoji: "🫘",
  name: b("Rajma (kidney bean)", "राजमा"),
  aliases: ["rajma", "rajmah", "rajama", "kidney bean", "kidney beans", "राजमा", "राजमाह"],
  category: "pulse",
  lifecycle: "seasonal",
  regions: ["western"],
  tier: 2,
  seasons: [
    { season: "rabi", sowingWindow: b("Mid October–mid November, with irrigation", "ऑक्टोबरचा मध्य–नोव्हेंबरचा मध्य, पाण्याची सोय असल्यास"), sowingMonths: [10, 11], durationDays: [90, 110] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b(
    "Light to medium loamy soil with very good drainage. Rajma is very sensitive to water logging and salty soil.",
    "पाण्याचा उत्तम निचरा होणारी हलकी ते मध्यम पोयट्याची जमीन. राजम्याला साचलेले पाणी व क्षारपड जमीन अजिबात चालत नाही.",
  ),
  climate: b(
    "Mild winter. Frost and hot days at flowering cause flower drop.",
    "सौम्य हिवाळा. फुलोऱ्यात कडाक्याची थंडी (दंव) किंवा उष्ण दिवस असल्यास फुलगळ होते.",
  ),
  seedRate: b("35–40 kg seed per acre (bold seed).", "एकरी 35–40 किलो बियाणे (टपोरे दाणे)."),
  spacing: b("30–45 cm between rows, about 10 cm between plants.", "दोन ओळींत 30–45 सेंमी, दोन रोपांत साधारण 10 सेंमी."),
  irrigation: b(
    "Irrigated crop. Give light water every 10–12 days; the most important waters are at flowering and pod filling. Never let water stand.",
    "बागायती पीक. दर 10–12 दिवसांनी हलके पाणी द्या; फुलोरा व शेंगा भरताना पाणी सर्वात महत्त्वाचे. पाणी कधीही साचू देऊ नका.",
  ),
  nutrientGuide: b(
    "Use a soil test. Unlike most pulses, rajma makes few root nodules and needs more nitrogen — give it in two parts (at sowing and about a month later). Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. इतर कडधान्यांपेक्षा राजम्याच्या मुळांवर गाठी कमी येतात, त्यामुळे नत्र जास्त लागते — दोन हप्त्यांत द्या (पेरणीवेळी व साधारण महिन्याने). प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 12, ["Large seeds sprout and push up two thick seed leaves.", "मोठे बी रुजून दोन जाड बीजपाने वर येतात."], [
      t("rj-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow in moist soil, 4–5 cm deep. Don't irrigate heavily right after sowing — seeds rot.", "ओलसर जमिनीत 4–5 सेंमी खोल पेरा. पेरणीनंतर लगेच जास्त पाणी देऊ नका — बी कुजते."]),
      t("rj-count", 9, "observation", ["Check germination", "उगवण तपासा"], ["Look for gaps and seedlings dying at the base.", "खाडे व बुंध्याजवळ मरणारी रोपे पाहा."]),
    ], [["Seed rot in wet soil", "ओल्या जमिनीत बी कुजणे"]]),
    stage("vegetative", ["Leaf growth", "पानांची वाढ"], 12, 40, ["Plants grow broad leaves and branches.", "रोपांना रुंद पाने व फांद्या येतात."], [
      t("rj-weed", 15, "weeding", ["Weeding and earthing up", "खुरपणी व भर देणे"], ["Weed and pull a little soil to the base of plants.", "खुरपणी करा व रोपांच्या बुंध्याला थोडी माती लावा."], 15),
      t("rj-irr1", 14, "irrigation", ["Irrigate lightly", "हलके पाणी द्या"], ["Light water every 10–12 days.", "दर 10–12 दिवसांनी हलके पाणी."], 11),
      t("rj-fert", 30, "fertiliser", ["Second nitrogen part", "नत्राचा दुसरा हप्ता"], ["Give the second part of nitrogen as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार नत्राचा दुसरा हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
      t("rj-obs1", 20, "observation", ["Check leaves", "पाने तपासा"], ["Look for yellow mosaic patches, leaf spots and sucking pests.", "पिवळ्या केवड्याचे चट्टे, पानांवरील ठिपके व रसशोषक किडी पाहा."], 7),
    ], [["Bean mosaic", "पिवळा केवडा (मोझॅक)"], ["Root rot", "मूळकूज"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 40, 60, ["Flowers open and pods begin.", "फुले उमलतात व शेंगा लागू लागतात."], [
      t("rj-irr2", 41, "irrigation", ["Water at flowering", "फुलोऱ्यात पाणी द्या"], ["Keep moisture steady to stop flower drop.", "फुलगळ टाळण्यासाठी ओलावा सारखा ठेवा."], 10),
      t("rj-obs2", 42, "observation", ["Check flowers", "फुले तपासा"], ["Look for caterpillars and flower drop.", "अळ्या व फुलगळ पाहा."], 7),
    ], [["Flower drop", "फुलगळ"]]),
    stage("pod", ["Pod filling", "शेंगा भरणे"], 60, 85, ["Seeds fill inside the pods.", "शेंगांत दाणे भरतात."], [
      t("rj-irr3", 61, "irrigation", ["Water at pod filling", "शेंगा भरताना पाणी"], ["Light, regular water until seeds are full.", "दाणे भरेपर्यंत हलके नियमित पाणी."], 10),
      t("rj-obs3", 63, "observation", ["Check pods", "शेंगा तपासा"], ["Look for holes and spots on pods.", "शेंगांवर छिद्रे व डाग पाहा."], 7),
    ], [["Pod borer", "शेंगा पोखरणारी अळी"], ["Anthracnose spots on pods", "शेंगांवर करपा (अँथ्रॅकनोज) डाग"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 85, 110, ["Leaves yellow and fall; pods dry and seeds harden.", "पाने पिवळी होऊन गळतात; शेंगा वाळतात व दाणे टणक होतात."], [
      t("rj-stop", 85, "other", ["Stop irrigation", "पाणी बंद करा"], ["Stop watering when pods begin to turn yellow.", "शेंगा पिवळ्या होऊ लागल्या की पाणी बंद करा."]),
      t("rj-harv", 92, "harvest", ["Harvest", "काढणी करा"], ["Pull plants when most pods are dry, dry them in the sun and thresh.", "बहुतेक शेंगा वाळल्यावर झाडे उपटा, उन्हात वाळवा व मळणी करा."]),
    ], [["Pods splitting in the field if harvest is late", "उशिरा काढणी केल्यास शेतातच शेंगा फुटणे"]]),
  ],
  commonProblems: [
    {
      name: b("Bean mosaic", "पिवळा केवडा (मोझॅक)"),
      signs: b("Leaves show light and dark green or yellow patches and curl; plants stunted.", "पानांवर फिकट-गडद हिरवे किंवा पिवळे चट्टे व पाने मुरडतात; झाडे खुरटी."),
      prevention: prevent("Use healthy seed, uproot sick plants early and keep aphids and whitefly in check.", "निरोगी बियाणे वापरा, रोगट झाडे लवकर उपटा आणि मावा व पांढरी माशी आटोक्यात ठेवा."),
    },
    {
      name: b("Root rot", "मूळकूज"),
      signs: b("Plants turn yellow and wilt; roots and stem base dark and rotten.", "झाडे पिवळी पडून मलूल होतात; मुळे व बुंधा काळा पडून कुजतो."),
      prevention: prevent("Choose well-drained land, never let water stand and rotate crops.", "निचरा होणारी जमीन निवडा, पाणी कधीही साचू देऊ नका आणि पिकांची फेरपालट करा."),
    },
    {
      name: b("Anthracnose", "करपा (अँथ्रॅकनोज)"),
      signs: b("Dark sunken spots on pods and dark lines on leaf veins.", "शेंगांवर काळपट खोलगट डाग व पानांच्या शिरांवर काळ्या रेषा."),
      prevention: prevent("Use clean, disease-free seed and remove crop residue after harvest.", "स्वच्छ, रोगमुक्त बियाणे वापरा व काढणीनंतर पिकाचे अवशेष नष्ट करा."),
    },
  ],
  harvestSigns: b("Most pods are dry and yellow-brown, and seeds are hard and full-coloured.", "बहुतेक शेंगा वाळून पिवळसर तपकिरी झाल्या असून दाणे टणक व पूर्ण रंगाचे आहेत."),
  postHarvest: b(
    "Dry seeds well, sort out broken and spotted seeds, and store in airtight bags or bins.",
    "दाणे चांगले वाळवा, फुटके व डागाळलेले दाणे वेगळे करा आणि हवाबंद पोत्यांत किंवा कोठीत साठवा.",
  ),
  marketTips: b(
    "Bold, shiny, uniform-coloured rajma fetches the best price in city markets. Clean and grade before selling.",
    "टपोऱ्या, चमकदार, एकसारख्या रंगाच्या राजम्याला शहरी बाजारात सर्वाधिक दर मिळतो. विक्रीपूर्वी स्वच्छ करून प्रतवारी करा.",
  ),
  varieties: [], // TODO: varieties — confirm rajma varieties for Maharashtra with MPKV Rahuri
  source: "General practices from MPKV Rahuri and ICAR-IIPR rajma guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
