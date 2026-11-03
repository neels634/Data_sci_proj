import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "field-pea",
  emoji: "🫛",
  name: b("Field pea (dry pea)", "वाटाणा (कडधान्य)"),
  aliases: ["dry pea", "dry peas", "field pea", "field peas", "fieldpea", "सुका वाटाणा", "वाटाणा कडधान्य"],
  category: "pulse",
  lifecycle: "seasonal",
  regions: ["vidarbha", "marathwada", "western"],
  tier: 2,
  seasons: [
    { season: "rabi", sowingWindow: b("Mid October–mid November", "ऑक्टोबरचा मध्य–नोव्हेंबरचा मध्य"), sowingMonths: [10, 11], durationDays: [100, 120] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b(
    "Medium, well-drained loamy or black soil. Water logging causes root rot.",
    "पाण्याचा निचरा होणारी मध्यम पोयट्याची किंवा काळी जमीन. पाणी साचल्यास मुळे कुजतात.",
  ),
  climate: b(
    "Cool winter crop. Frost at flowering and heat at pod filling both lower yield.",
    "थंड हिवाळ्यातील पीक. फुलोऱ्यात कडाक्याची थंडी (दंव) व शेंगा भरताना उष्णता — दोन्हीमुळे उत्पादन घटते.",
  ),
  seedRate: b("25–32 kg seed per acre, depending on seed size.", "दाण्याच्या आकारानुसार एकरी 25–32 किलो बियाणे."),
  spacing: b("30 cm between rows, about 10 cm between plants.", "दोन ओळींत 30 सेंमी, दोन रोपांत साधारण 10 सेंमी."),
  irrigation: b(
    "Grows on stored moisture with 1–2 light irrigations: one at flowering and one at pod filling. Do not flood the field.",
    "साठवलेल्या ओलाव्यावर 1–2 हलक्या पाण्यांसह येते: एक फुलोऱ्यात व एक शेंगा भरताना. शेतात पाणी तुंबवू नका.",
  ),
  nutrientGuide: b(
    "Use a soil test. Needs little nitrogen; phosphorus at sowing helps. Bio-fertiliser seed treatment improves nodules. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. नत्र कमी लागते; पेरणीवेळी स्फुरद उपयोगी. जैविक खताच्या बीजप्रक्रियेने गाठी चांगल्या येतात. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 15, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("fp-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow in moist soil, 4–5 cm deep, in 30 cm rows. Treat seed with bio-fertiliser — ask your KVK.", "ओलसर जमिनीत 4–5 सेंमी खोल, 30 सेंमी ओळीत पेरा. जैविक खताची बीजप्रक्रिया करा — कृषी विज्ञान केंद्राला विचारा."]),
      t("fp-count", 12, "observation", ["Check germination", "उगवण तपासा"], ["Look for gaps and seedlings dying at the base.", "खाडे व बुंध्याजवळ मरणारी रोपे पाहा."]),
    ], [["Seed and root rot in wet soil", "ओल्या जमिनीत बी व मुळे कुजणे"]]),
    stage("vegetative", ["Vine growth", "वेलांची वाढ"], 15, 50, ["Plants grow soft stems with tendrils and branch.", "रोपांना ताणे असलेले मऊ खोड व फांद्या येतात."], [
      t("fp-weed", 20, "weeding", ["Weeding and hoeing", "खुरपणी व कोळपणी"], ["Keep the field weed-free for the first 40 days.", "पहिले 40 दिवस शेत तणमुक्त ठेवा."], 15),
      t("fp-obs1", 22, "observation", ["Check leaves", "पाने तपासा"], ["Look for white powder on leaves (powdery mildew) and tunnels in leaves (leaf miner).", "पानांवर पांढरी भुकटी (भुरी) व पानांत नागमोडी रेषा (पाने पोखरणारी अळी) पाहा."], 7),
    ], [["Powdery mildew", "भुरी"], ["Leaf miner", "पाने पोखरणारी अळी"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 50, 75, ["White or purple flowers open and pods begin.", "पांढरी किंवा जांभळी फुले येतात व शेंगा लागू लागतात."], [
      t("fp-irr1", 52, "irrigation", ["Irrigate at flowering", "फुलोऱ्यात पाणी द्या"], ["Give one light irrigation if the soil is dry.", "जमीन कोरडी असल्यास एक हलके पाणी द्या."]),
      t("fp-obs2", 53, "observation", ["Check for mildew and pod borer", "भुरी व शेंगा अळी तपासा"], ["Powdery mildew spreads fast now in cool, dry weather.", "थंड, कोरड्या हवेत आता भुरी झपाट्याने पसरते."], 7),
    ], [["Powdery mildew", "भुरी"]]),
    stage("pod", ["Pod filling", "शेंगा भरणे"], 75, 100, ["Seeds fill inside the pods and then harden.", "शेंगांत दाणे भरतात व नंतर टणक होतात."], [
      t("fp-irr2", 76, "irrigation", ["Light irrigation at pod filling", "शेंगा भरताना हलके पाणी"], ["One light water if the soil is dry; then stop.", "जमीन कोरडी असल्यास एक हलके पाणी; मग बंद करा."]),
      t("fp-obs3", 78, "observation", ["Check pods", "शेंगा तपासा"], ["Look for holes in pods.", "शेंगांना छिद्रे आहेत का पाहा."], 7),
    ], [["Pod borer", "शेंगा पोखरणारी अळी"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 100, 120, ["Plants and pods dry; seeds become hard.", "झाडे व शेंगा वाळतात; दाणे टणक होतात."], [
      t("fp-mat", 100, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Pods dry and seeds hard → plan the harvest.", "शेंगा कोरड्या व दाणे टणक → काढणीचे नियोजन करा."]),
      t("fp-harv", 105, "harvest", ["Harvest", "काढणी करा"], ["Cut plants, dry in the sun and thresh.", "झाडे कापा, उन्हात वाळवा व मळणी करा."]),
    ], [["Storage beetles", "साठवणीतील भुंगेरे"]]),
  ],
  commonProblems: [
    {
      name: b("Powdery mildew", "भुरी"),
      signs: b("White powder on leaves, stems and pods; plants dry early.", "पाने, खोड व शेंगांवर पांढरी भुकटी; झाडे लवकर वाळतात."),
      prevention: prevent("Sow on time (early sowing escapes it), use tolerant varieties and avoid very dense sowing.", "वेळेवर पेरणी करा (लवकर पेरणीत कमी येते), सहनशील वाण वापरा व दाट पेरणी टाळा."),
    },
    {
      name: b("Pod borer", "शेंगा पोखरणारी अळी"),
      signs: b("Caterpillars bore into pods and eat seeds.", "अळ्या शेंगा पोखरून दाणे खातात."),
      prevention: prevent("Check pods weekly and put up bird perches and pheromone traps.", "दर आठवड्याला शेंगा तपासा, पक्षी थांबे व कामगंध सापळे लावा."),
    },
    {
      name: b("Wilt and root rot", "मर व मूळकूज"),
      signs: b("Plants turn yellow, droop and dry; roots rotten.", "झाडे पिवळी पडून मलूल होतात व वाळतात; मुळे कुजलेली."),
      prevention: prevent("Avoid water logging, rotate crops and ask your KVK about bio-agent seed treatment.", "पाणी साचू देऊ नका, पिकांची फेरपालट करा आणि जैविक बुरशीच्या बीजप्रक्रियेबद्दल कृषी विज्ञान केंद्राला विचारा."),
    },
  ],
  harvestSigns: b("Pods are dry and papery and seeds are hard.", "शेंगा कागदासारख्या कोरड्या आणि दाणे टणक झाले आहेत."),
  postHarvest: b(
    "Dry the seed well, clean and grade it, and store in airtight bags or bins to keep beetles away.",
    "दाणे चांगले वाळवा, स्वच्छ करून प्रतवारी करा आणि भुंगेरे लागू नयेत म्हणून हवाबंद पोत्यांत किंवा कोठीत साठवा.",
  ),
  marketTips: b(
    "Clean, uniform dry peas sell to dal mills and for snacks. Sell graded lots together through your Mandi Mitra.",
    "स्वच्छ, एकसारखा सुका वाटाणा डाळ मिल व फरसाणासाठी विकला जातो. प्रतवारी केलेला माल मंडी मित्रामार्फत एकत्र विका.",
  ),
  varieties: [], // TODO: varieties — confirm dry pea varieties for Maharashtra with ICAR-IIPR / Dr. PDKV Akola
  source: "General practices from ICAR-IIPR and Dr. PDKV Akola rabi pulse guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
