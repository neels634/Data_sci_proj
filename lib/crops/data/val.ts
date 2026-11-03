import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "val",
  emoji: "🫘",
  name: b("Val (field bean, dry seed)", "वाल"),
  aliases: ["val", "wal", "vaal", "waal", "field bean", "kadve val", "kadva val", "वाल", "कडवे वाल", "कडवा वाल"],
  category: "pulse",
  lifecycle: "seasonal",
  regions: ["konkan", "western"],
  majorDistricts: b("Raigad, Ratnagiri, Thane, Pune", "रायगड, रत्नागिरी, ठाणे, पुणे"),
  tier: 2,
  seasons: [
    { season: "rabi", sowingWindow: b("October–November, on leftover moisture after rice (Konkan) or with light irrigation", "ऑक्टोबर–नोव्हेंबर, भातानंतर जमिनीतील ओलाव्यावर (कोकण) किंवा हलक्या पाण्यावर"), sowingMonths: [10, 11], durationDays: [110, 130] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b(
    "Medium to heavy soil that holds moisture, such as rice fields after harvest. Avoid water logging at sowing.",
    "ओलावा धरून ठेवणारी मध्यम ते भारी जमीन, उदा. काढणीनंतरची भात खाचरे. पेरणीवेळी पाणी साचलेले नको.",
  ),
  climate: b(
    "Cool winter nights and dew help flowering. Grows mostly on soil moisture and dew.",
    "हिवाळ्यातील थंड रात्री व दव फुलोऱ्यास मदत करतात. मुख्यतः जमिनीतील ओलावा व दवावर येते.",
  ),
  seedRate: b("10–15 kg seed per acre, depending on seed size.", "दाण्याच्या आकारानुसार एकरी 10–15 किलो बियाणे."),
  spacing: b("45 cm between rows, 15–20 cm between plants (bush type).", "दोन ओळींत 45 सेंमी, दोन रोपांत 15–20 सेंमी (झुडूप प्रकार)."),
  irrigation: b(
    "In Konkan it grows on moisture left after rice. Where water is available, give light irrigation at flowering and pod filling.",
    "कोकणात भातानंतर उरलेल्या ओलाव्यावर येते. पाणी उपलब्ध असल्यास फुलोरा व शेंगा भरताना हलके पाणी द्या.",
  ),
  nutrientGuide: b(
    "Needs little fertiliser. A small basal dose as per soil test and bio-fertiliser seed treatment is enough. Ask your agriculture officer for amounts.",
    "खत कमी लागते. माती परीक्षणानुसार पेरणीवेळी थोडे खत व जैविक खताची बीजप्रक्रिया पुरेशी. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 12, ["Seeds sprout in moist soil.", "ओलसर जमिनीत बी रुजते."], [
      t("vl-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow soon after rice harvest while the soil is moist, 4–5 cm deep, in rows or by dibbling.", "भात काढणीनंतर जमीन ओलसर असतानाच 4–5 सेंमी खोल ओळीत किंवा टोकण करून पेरा."]),
      t("vl-count", 9, "observation", ["Check germination", "उगवण तपासा"], ["Look for gaps and fill them early.", "खाडे पाहा व लवकर भरा."]),
    ], [["Poor germination if the soil dries", "जमीन कोरडी झाल्यास कमी उगवण"]]),
    stage("vegetative", ["Leaf growth", "पानांची वाढ"], 12, 50, ["Plants grow leaves and branches.", "रोपांना पाने व फांद्या येतात."], [
      t("vl-weed", 20, "weeding", ["Weeding", "खुरपणी"], ["Weed once or twice in the first 45 days.", "पहिल्या 45 दिवसांत एक-दोन वेळा खुरपणी करा."], 20),
      t("vl-obs1", 21, "observation", ["Check shoots", "शेंडे तपासा"], ["Look for black aphids on tender shoots.", "कोवळ्या शेंड्यांवर काळा मावा पाहा."], 7),
    ], [["Aphids (black mava)", "काळा मावा"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 50, 80, ["Flower bunches appear on long stalks.", "लांब दांड्यांवर फुलांचे घोस येतात."], [
      t("vl-obs2", 51, "observation", ["Check flower bunches", "फुलांचे घोस तपासा"], ["Look for aphids on flower stalks and caterpillars in flowers.", "फुलांच्या दांड्यांवर मावा व फुलांत अळ्या पाहा."], 7),
      t("vl-irr1", 55, "irrigation", ["Light water if available", "पाणी उपलब्ध असल्यास हलके पाणी"], ["One light irrigation at flowering helps pod set.", "फुलोऱ्यात एक हलके पाणी शेंगा लागण्यास मदत करते."]),
    ], [["Aphids on flower stalks", "फुलांच्या दांड्यांवर मावा"], ["Pod borer in flowers", "फुलांत शेंगा पोखरणारी अळी"]]),
    stage("pod", ["Pod filling", "शेंगा भरणे"], 80, 110, ["Pods fill with seed and start to dry.", "शेंगांत दाणे भरतात व शेंगा वाळू लागतात."], [
      t("vl-obs3", 81, "observation", ["Check pods", "शेंगा तपासा"], ["Look for holes in pods.", "शेंगांना छिद्रे आहेत का पाहा."], 7),
      t("vl-irr2", 85, "irrigation", ["Light water at pod filling", "शेंगा भरताना हलके पाणी"], ["If available and the soil is dry.", "पाणी उपलब्ध असल्यास व जमीन कोरडी असल्यास."]),
    ], [["Pod borer", "शेंगा पोखरणारी अळी"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 110, 130, ["Pods dry and turn brown; pick in rounds or pull plants.", "शेंगा वाळून तपकिरी होतात; फेऱ्यांनी तोडा किंवा झाडे उपटा."], [
      t("vl-pick", 110, "harvest", ["Pick dry pods", "वाळलेल्या शेंगा तोडा"], ["Pick dry pods every week, or pull plants when most pods are dry.", "दर आठवड्याला वाळलेल्या शेंगा तोडा, किंवा बहुतेक शेंगा वाळल्यावर झाडे उपटा."], 7),
      t("vl-thresh", 120, "other", ["Dry and thresh", "वाळवून मळणी करा"], ["Dry pods in the sun, thresh and clean the seed.", "शेंगा उन्हात वाळवा, मळणी करून दाणे स्वच्छ करा."]),
    ], [["Storage beetles", "साठवणीतील भुंगेरे"]]),
  ],
  commonProblems: [
    {
      name: b("Aphids (black mava)", "काळा मावा"),
      signs: b("Black insects crowd on shoots, flower stalks and pods; flowers drop.", "शेंडे, फुलांचे दांडे व शेंगांवर काळ्या किडींचे थवे; फुलगळ होते."),
      prevention: prevent("Check shoots and flower stalks weekly, nip heavily infested tips and protect ladybird beetles.", "दर आठवड्याला शेंडे व फुलांचे दांडे तपासा, जास्त बाधित शेंडे खुडा आणि ढालकिड्यांचे संरक्षण करा."),
    },
    {
      name: b("Pod borer", "शेंगा पोखरणारी अळी"),
      signs: b("Holes in pods; seeds eaten inside.", "शेंगांना छिद्रे; आतील दाणे खाल्लेले."),
      prevention: prevent("Check pods weekly and put up bird perches.", "दर आठवड्याला शेंगा तपासा व पक्षी थांबे लावा."),
    },
    {
      name: b("Pulse beetle in storage", "साठवणीतील भुंगेरे"),
      signs: b("Round holes in stored seeds and powder in the bag.", "साठवलेल्या दाण्यांना गोल छिद्रे व पोत्यात भुकटी."),
      prevention: b("Dry seed well before storing and keep it in clean, airtight containers. Check every month.", "साठवण्यापूर्वी दाणे चांगले वाळवा व स्वच्छ, हवाबंद डब्यांत ठेवा. दर महिन्याला तपासा."),
    },
  ],
  harvestSigns: b("Pods are brown and dry and seeds rattle inside.", "शेंगा तपकिरी व कोरड्या असून आत दाणे खुळखुळतात."),
  postHarvest: b(
    "Dry the seed well and store in airtight containers. Kadve val is also sold soaked and peeled (dalimbi) for cooking.",
    "दाणे चांगले वाळवून हवाबंद डब्यांत साठवा. कडवे वाल भिजवून सोलून (डाळिंबी) उसळीसाठीही विकले जातात.",
  ),
  marketTips: b(
    "Local kadve val from Konkan has a loyal demand in Mumbai and Pune; clean, well-dried seed packed in small bags fetches a good price.",
    "कोकणातील गावठी कडव्या वालाला मुंबई-पुण्यात कायम मागणी असते; स्वच्छ, चांगले वाळवलेले दाणे लहान पिशव्यांत भरल्यास चांगला दर मिळतो.",
  ),
  varieties: [], // TODO: varieties — confirm field bean (val) varieties with Dr. BSKKV Dapoli
  source: "General practices from Dr. BSKKV Dapoli and MPKV Rahuri pulse guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
