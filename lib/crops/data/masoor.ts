import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "masoor",
  emoji: "🟠",
  name: b("Masoor (lentil)", "मसूर"),
  aliases: ["masoor", "masur", "masoor dal", "lentil", "lentils", "मसूर", "मसुर"],
  category: "pulse",
  lifecycle: "seasonal",
  regions: ["vidarbha", "marathwada"],
  tier: 2,
  seasons: [
    { season: "rabi", sowingWindow: b("Mid October–mid November, on stored moisture or with light irrigation", "ऑक्टोबरचा मध्य–नोव्हेंबरचा मध्य, साठवलेल्या ओलाव्यावर किंवा हलक्या पाण्यावर"), sowingMonths: [10, 11], durationDays: [100, 120] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b(
    "Medium to heavy, well-drained soil that holds moisture. Avoid salty and water-logged land.",
    "ओलावा धरून ठेवणारी, निचरा होणारी मध्यम ते भारी जमीन. क्षारपड व पाणी साचणारी जमीन टाळा.",
  ),
  climate: b(
    "Needs a cool winter. Late sowing pushes pod filling into heat and lowers yield.",
    "थंड हिवाळा लागतो. उशिरा पेरणी केल्यास शेंगा भरताना उष्णता लागते व उत्पादन घटते.",
  ),
  seedRate: b("14–18 kg seed per acre (more for bold seed).", "एकरी 14–18 किलो बियाणे (टपोऱ्या दाण्याला जास्त)."),
  spacing: b("25–30 cm between rows, 5 cm between plants.", "दोन ओळींत 25–30 सेंमी, दोन रोपांत 5 सेंमी."),
  irrigation: b(
    "Often grown on stored moisture. If irrigated, give light water at branching and at pod filling; avoid heavy flooding.",
    "बहुधा जमिनीतील ओलाव्यावर घेतात. बागायती असल्यास फांद्या फुटताना व शेंगा भरताना हलके पाणी द्या; जास्त पाणी देऊ नका.",
  ),
  nutrientGuide: b(
    "Use a soil test. Needs little nitrogen; phosphorus at sowing helps. Bio-fertiliser seed treatment improves nodules. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. नत्र कमी लागते; पेरणीवेळी स्फुरद उपयोगी. जैविक खताच्या बीजप्रक्रियेने गाठी चांगल्या येतात. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 15, ["Small seeds sprout slowly in cool soil.", "थंड जमिनीत लहान बी हळूहळू रुजते."], [
      t("ms-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow in moist soil, 3–4 cm deep, in 25–30 cm rows. Treat seed with bio-fertiliser — ask your KVK.", "ओलसर जमिनीत 3–4 सेंमी खोल, 25–30 सेंमी ओळीत पेरा. जैविक खताची बीजप्रक्रिया करा — कृषी विज्ञान केंद्राला विचारा."]),
      t("ms-count", 12, "observation", ["Check germination", "उगवण तपासा"], ["Look for gaps and wilting seedlings.", "खाडे व मलूल रोपे पाहा."]),
    ], [["Seedling wilt", "रोपांची मर"]]),
    stage("vegetative", ["Branching", "फांद्या फुटणे"], 15, 50, ["Thin, bushy plants branch out.", "बारीक, झुडूपासारख्या रोपांना फांद्या फुटतात."], [
      t("ms-weed", 20, "weeding", ["Weeding", "खुरपणी"], ["Keep the field weed-free for the first 40–45 days.", "पहिले 40–45 दिवस शेत तणमुक्त ठेवा."], 15),
      t("ms-obs1", 21, "observation", ["Check plants", "रोपे तपासा"], ["Look for plants drying in patches (wilt) and aphids on shoots.", "गटागटाने वाळणारी झाडे (मर) व शेंड्यांवर मावा पाहा."], 7),
      t("ms-irr1", 35, "irrigation", ["Light irrigation if dry", "कोरडे असल्यास हलके पाणी"], ["Only if irrigated and the soil is dry.", "बागायती असल्यास व जमीन कोरडी असल्यासच."]),
    ], [["Wilt", "मर रोग"], ["Aphids", "मावा"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 50, 75, ["Small white-violet flowers open and pods set.", "लहान पांढरी-जांभळी फुले येतात व शेंगा लागतात."], [
      t("ms-obs2", 51, "observation", ["Check leaves and flowers", "पाने व फुले तपासा"], ["Look for rust (brown powdery spots) and caterpillars.", "तांबेरा (तपकिरी भुकटीचे ठिपके) व अळ्या पाहा."], 7),
      t("ms-perch", 52, "other", ["Put up bird perches", "पक्षी थांबे लावा"], ["T-shaped sticks let birds pick caterpillars.", "T आकाराच्या काठ्यांवर बसून पक्षी अळ्या टिपतात."]),
    ], [["Rust", "तांबेरा"]]),
    stage("pod", ["Pod filling", "शेंगा भरणे"], 75, 100, ["Small flat pods fill with 1–2 seeds each.", "लहान चपट्या शेंगांत 1–2 दाणे भरतात."], [
      t("ms-irr2", 76, "irrigation", ["Light irrigation at pod filling", "शेंगा भरताना हलके पाणी"], ["If irrigated and the soil is dry, give one light water.", "बागायती असल्यास व जमीन कोरडी असल्यास एक हलके पाणी द्या."]),
      t("ms-obs3", 78, "observation", ["Check pods", "शेंगा तपासा"], ["Look for holes in pods.", "शेंगांना छिद्रे आहेत का पाहा."], 7),
    ], [["Pod borer", "शेंगा पोखरणारी अळी"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 100, 120, ["Plants turn yellow-brown and pods dry.", "झाडे पिवळसर तपकिरी होतात व शेंगा वाळतात."], [
      t("ms-mat", 100, "observation", ["Check if ready", "तयार आहे का पाहा"], ["When pods are brown and dry, plan the harvest.", "शेंगा तपकिरी व कोरड्या झाल्या की काढणीचे नियोजन करा."]),
      t("ms-harv", 104, "harvest", ["Harvest", "काढणी करा"], ["Cut plants in the morning, dry in the sun and thresh.", "सकाळी झाडे कापा, उन्हात वाळवा व मळणी करा."]),
    ], [["Pods shattering if harvest is late", "उशिरा काढणी केल्यास शेंगा फुटणे"]]),
  ],
  commonProblems: [
    {
      name: b("Wilt", "मर रोग"),
      signs: b("Plants droop, turn yellow and dry in patches.", "झाडे मलूल होऊन पिवळी पडतात व गटागटाने वाळतात."),
      prevention: prevent("Rotate crops, sow on time and ask your KVK about bio-agent seed treatment.", "पिकांची फेरपालट करा, वेळेवर पेरणी करा आणि जैविक बुरशीच्या बीजप्रक्रियेबद्दल कृषी विज्ञान केंद्राला विचारा."),
    },
    {
      name: b("Rust", "तांबेरा"),
      signs: b("Brown, powdery spots on leaves and stems; plants dry early.", "पाने व खोडावर तपकिरी भुकटीचे ठिपके; झाडे लवकर वाळतात."),
      prevention: prevent("Sow on time and remove volunteer plants; check leaves weekly from flowering.", "वेळेवर पेरणी करा व आपोआप उगवलेली झाडे काढा; फुलोऱ्यापासून दर आठवड्याला पाने तपासा."),
    },
    {
      name: b("Aphids", "मावा"),
      signs: b("Small insects on tender shoots; shoots curl and plants weaken.", "कोवळ्या शेंड्यांवर लहान किडी; शेंडे आकसतात व झाडे कमजोर होतात."),
      prevention: prevent("Check shoots weekly and protect ladybird beetles.", "दर आठवड्याला शेंडे तपासा आणि ढालकिड्यांचे संरक्षण करा."),
    },
  ],
  harvestSigns: b("Plants turn yellow-brown, pods are dry and seeds rattle.", "झाडे पिवळसर तपकिरी, शेंगा कोरड्या व दाणे खुळखुळतात."),
  postHarvest: b(
    "Dry the grain well, clean and grade it, and store in airtight bags or bins.",
    "दाणे चांगले वाळवा, स्वच्छ करून प्रतवारी करा आणि हवाबंद पोत्यांत किंवा कोठीत साठवा.",
  ),
  marketTips: b(
    "Clean, uniform grain gets a better rate from dal mills. Check the support price before selling.",
    "स्वच्छ, एकसारख्या दाण्यांना डाळ मिलकडून चांगला दर मिळतो. विक्रीपूर्वी हमीभाव तपासा.",
  ),
  varieties: [], // TODO: varieties — confirm lentil varieties for Maharashtra with Dr. PDKV Akola / ICAR-IIPR
  source: "General practices from ICAR-IIPR and Dr. PDKV Akola rabi pulse guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
