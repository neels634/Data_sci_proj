import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "chana",
  emoji: "🟤",
  name: b("Chana (gram)", "हरभरा"),
  aliases: ["chana", "gram", "chickpea", "harbhara", "harbara", "हरभरा", "चना"],
  category: "pulse",
  lifecycle: "seasonal",
  regions: ["marathwada", "vidarbha", "western", "north"],
  majorDistricts: b("Latur, Beed, Akola, Ahilyanagar, Pune", "लातूर, बीड, अकोला, अहिल्यानगर, पुणे"),
  tier: 1,
  seasons: [{ season: "rabi", sowingWindow: b("October–November", "ऑक्टोबर–नोव्हेंबर"), sowingMonths: [10, 11], durationDays: [95, 115] }],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b("Medium to deep black soil that holds moisture after the rains.", "पावसानंतर ओलावा धरून ठेवणारी मध्यम ते भारी काळी जमीन."),
  climate: b("Cool, dry winter. Heavy rain or cloudy weather at flowering harms the crop.", "थंड, कोरडा हिवाळा. फुलोऱ्यात जास्त पाऊस किंवा ढगाळ हवामान नुकसानकारक."),
  seedRate: b("25–35 kg seed per acre (more for bold-seeded varieties).", "एकरी 25–35 किलो बियाणे (टपोऱ्या दाण्याच्या वाणाला जास्त)."),
  spacing: b("30 cm between rows, about 10 cm between plants.", "ओळींत 30 सेंमी, रोपांत साधारण 10 सेंमी."),
  irrigation: b("Grows on stored soil moisture. If irrigated, give light water at branching and pod filling; avoid heavy water at flowering.", "जमिनीतील ओलाव्यावर येते. बागायती असल्यास फांद्या फुटताना व घाटे भरताना हलके पाणी; फुलोऱ्यात जास्त पाणी टाळा."),
  nutrientGuide: b("Use a soil test. A pulse needs little nitrogen; bio-fertiliser seed treatment helps — ask your KVK.", "माती परीक्षण करा. कडधान्याला कमी नत्र लागते; जैविक खताची बीजप्रक्रिया उपयोगी — कृषी विज्ञान केंद्राला विचारा."),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 15, ["Seeds sprout in moist soil.", "ओलसर जमिनीत बी रुजते."], [
      t("ch-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow in moist soil, 30 cm rows, 8–10 cm deep. Ask your KVK about seed treatment.", "ओलसर जमिनीत 30 सेंमी ओळीत, 8–10 सेंमी खोल पेरा. बीजप्रक्रियेबद्दल कृषी विज्ञान केंद्राला विचारा."]),
      t("ch-count", 10, "observation", ["Check germination", "उगवण तपासा"], ["Count plants and note big gaps.", "रोपे मोजा व मोठे खाडे नोंदवा."]),
    ], [["Poor germination in dry soil", "कोरड्या जमिनीत कमी उगवण"]]),
    stage("vegetative", ["Branching", "फांद्या फुटणे"], 15, 45, ["Plants branch out.", "रोपांना फांद्या फुटतात."], [
      t("ch-weed", 20, "weeding", ["Weeding", "खुरपणी"], ["Keep the field weed-free for the first 45 days.", "पहिले 45 दिवस शेत तणमुक्त ठेवा."], 15),
      t("ch-obs1", 21, "observation", ["Check plants", "रोपे तपासा"], ["Look for wilting yellow plants (wilt) and small caterpillars.", "पिवळी मलूल रोपे (मर) व लहान अळ्या पाहा."], 7),
      t("ch-nip", 30, "other", ["Nip the tops", "शेंडे खुडा"], ["Nipping tops (khudni) gives more branches and pods.", "शेंडे खुडल्याने (खुडणी) जास्त फांद्या व घाटे येतात."]),
      t("ch-irr1", 40, "irrigation", ["Light irrigation if dry", "कोरडे असल्यास हलके पाणी"], ["Only if irrigated and the soil is dry.", "बागायती असल्यास व जमीन कोरडी असल्यासच."]),
    ], [["Wilt", "मर रोग"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 45, 70, ["Flowers open and pods start.", "फुले उमलतात व घाटे लागू लागतात."], [
      t("ch-perch", 45, "other", ["Put up bird perches", "पक्षी थांबे लावा"], ["T-shaped sticks let birds sit and eat caterpillars.", "T आकाराच्या काठ्यांवर पक्षी बसून अळ्या खातात."]),
      t("ch-obs2", 46, "observation", ["Check for pod borer", "घाटेअळी तपासा"], ["Look for caterpillars and eaten leaves and pods.", "अळ्या व खाल्लेली पाने व घाटे पाहा."], 7),
    ], [["Pod borer (ghate ali)", "घाटेअळी"]]),
    stage("pod", ["Pod filling", "घाटे भरणे"], 70, 95, ["Seeds fill inside the pods.", "घाट्यांत दाणे भरतात."], [
      t("ch-obs3", 71, "observation", ["Check pods", "घाटे तपासा"], ["Look for holes in pods.", "घाट्यांना छिद्रे आहेत का पाहा."], 7),
      t("ch-irr3", 72, "irrigation", ["Light irrigation if dry", "कोरडे असल्यास हलके पाणी"], ["Light water helps pods fill.", "हलक्या पाण्याने घाटे भरतात."]),
    ], [["Pod borer", "घाटेअळी"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 95, 115, ["Leaves turn yellow and pods dry.", "पाने पिवळी होतात व घाटे वाळतात."], [
      t("ch-mat", 95, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Leaves yellow and pods dry → plan the harvest.", "पाने पिवळी व घाटे कोरडे → काढणीचे नियोजन करा."]),
      t("ch-harv", 100, "harvest", ["Harvest", "काढणी करा"], ["Cut or pull plants, dry and thresh.", "झाडे कापा किंवा उपटा, वाळवा व मळणी करा."]),
    ], [["Storage beetles", "साठवणीतील भुंगेरे"]]),
  ],
  commonProblems: [
    { name: b("Pod borer (ghate ali)", "घाटेअळी"), signs: b("Green caterpillars eat leaves and make holes in pods.", "हिरव्या अळ्या पाने खातात व घाट्यांना छिद्रे पाडतात."), prevention: prevent("Use bird perches and pheromone traps; check plants weekly.", "पक्षी थांबे व कामगंध सापळे वापरा; दर आठवड्याला तपासा.") },
    { name: b("Wilt", "मर रोग"), signs: b("Plants droop and dry in patches.", "रोपे गटागटाने मलूल होऊन वाळतात."), prevention: b("Use resistant varieties and rotate crops.", "प्रतिकारक वाण वापरा व पिकांची फेरपालट करा.") },
  ],
  harvestSigns: b("Leaves turn yellow-brown and pods are dry and rattle.", "पाने पिवळसर तपकिरी होतात आणि घाटे कोरडे होऊन खुळखुळतात."),
  postHarvest: b("Dry seed well and store in clean, airtight containers.", "दाणे चांगले वाळवा आणि स्वच्छ, हवाबंद डब्यांत साठवा."),
  marketTips: b("Clean, graded chana gets a better rate. Check the support price.", "स्वच्छ, प्रतवारी केलेल्या हरभऱ्याला चांगला दर मिळतो. हमीभाव तपासा."),
  varieties: [
    { name: "Vijay (Phule G-81-1-1)", note: b("Widely grown, released by MPKV Rahuri", "मोठ्या प्रमाणावर घेतला जाणारा, मफुकृवि राहुरीचा वाण") },
    { name: "Digvijay", note: b("Released by MPKV Rahuri", "मफुकृवि राहुरीचा वाण") },
    { name: "Vishal", note: b("Bold-seeded, released by MPKV Rahuri", "टपोऱ्या दाण्याचा, मफुकृवि राहुरीचा वाण") },
    { name: "JAKI 9218", note: b("Widely grown in Maharashtra", "महाराष्ट्रात मोठ्या प्रमाणावर घेतला जातो") },
  ],
  source: "General practices from ICAR-IIPR and MPKV Rahuri gram guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
