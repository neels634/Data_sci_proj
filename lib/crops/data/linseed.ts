import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "linseed",
  emoji: "🌾",
  name: b("Linseed (flax)", "जवस"),
  aliases: ["linseed", "flax", "flaxseed", "flax seed", "javas", "jawas", "alsi", "alasi", "जवस", "अळशी", "अलसी"],
  category: "oilseed",
  lifecycle: "seasonal",
  regions: ["vidarbha", "marathwada"],
  majorDistricts: b("Nagpur, Chandrapur, Bhandara, Latur, Nanded", "नागपूर, चंद्रपूर, भंडारा, लातूर, नांदेड"),
  tier: 2,
  seasons: [
    { season: "rabi", sowingWindow: b("October to early November, on stored moisture or with irrigation", "ऑक्टोबर ते नोव्हेंबरच्या सुरुवातीला, साठवलेल्या ओलाव्यावर किंवा पाण्यावर"), sowingMonths: [10, 11], durationDays: [110, 130] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b("Medium to heavy black soil that holds moisture; also grown after paddy in Vidarbha.", "ओलावा धरणारी मध्यम ते भारी काळी जमीन; विदर्भात भातानंतरही घेतले जाते."),
  climate: b("Cool rabi weather. Frost and cloudy, humid weather at flowering cause damage.", "थंड रब्बी हवामान. फुलोऱ्यात दव-धुके, ढगाळ व दमट हवेने नुकसान होते."),
  seedRate: b("About 10–12 kg seed per acre.", "एकरी साधारण 10–12 किलो बियाणे."),
  spacing: b("30 cm between rows and 5–7 cm between plants.", "ओळींत 30 सेंमी व रोपांत 5–7 सेंमी."),
  irrigation: b("Mostly rainfed on stored moisture. Where water is available, irrigate at branching and at flowering to capsule filling.", "मुख्यतः साठवलेल्या ओलाव्यावर. पाणी असल्यास फांद्या फुटताना व फुलोरा ते बोंडे भरताना पाणी द्या."),
  nutrientGuide: b("Use a soil test. Mix farmyard manure; for a rainfed crop give fertiliser at sowing. Ask your agriculture officer for amounts.", "माती परीक्षण करा. शेणखत मिसळा; कोरडवाहू पिकात खत पेरणीच्या वेळी द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."),
  varieties: [], // TODO: varieties — confirm current linseed varieties with Dr. PDKV Akola (AICRP Linseed, Nagpur)
  stages: [
    stage("emergence", ["Sowing & emergence", "पेरणी व उगवण"], 0, 15, ["Seeds sprout and thin seedlings come up.", "बी रुजून बारीक रोपे वर येतात."], [
      t("ls-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow treated seed 3–4 cm deep in moist soil.", "ओलसर जमिनीत बीजप्रक्रिया केलेले बियाणे 3–4 सेंमी खोल पेरा."]),
      t("ls-gap", 10, "other", ["Check germination", "उगवण तपासा"], ["Note poor patches; thin where plants are too crowded.", "उगवण कमी झालेली जागा पाहा; दाट रोपे विरळ करा."]),
    ], [["Cutworms cutting seedlings", "रोपे कातरणारी अळी"]]),
    stage("vegetative", ["Branching", "फांद्या फुटणे"], 15, 50, ["Plants branch and grow tall.", "झाडे फांद्या फुटून उंच वाढतात."], [
      t("ls-weed", 18, "weeding", ["Weeding", "खुरपणी"], ["Weed once or twice in the first 35 days.", "पहिल्या 35 दिवसांत 1–2 खुरपण्या करा."], 15),
      t("ls-irr1", 35, "irrigation", ["Irrigate at branching (if available)", "फांद्या फुटताना पाणी (उपलब्ध असल्यास)"], ["One light watering helps the crop.", "एक हलके पाणी पिकाला फायदेशीर."]),
      t("ls-obs1", 25, "observation", ["Check leaves", "पाने तपासा"], ["Look for powdery white patches and rust spots.", "पांढरी भुकटी व तांबेऱ्याचे ठिपके पाहा."], 10),
    ], [["Powdery mildew", "भुरी"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 50, 80, ["Blue (or white) flowers open in the morning.", "सकाळी निळी (किंवा पांढरी) फुले उमलतात."], [
      t("ls-irr2", 55, "irrigation", ["Irrigate at flowering (if available)", "फुलोऱ्यात पाणी (उपलब्ध असल्यास)"], ["The most useful watering for linseed.", "जवसासाठी सर्वात उपयोगी पाणी."]),
      t("ls-obs2", 52, "observation", ["Check flower buds", "कळ्या तपासा"], ["Look for bud fly maggots in buds and for alternaria blight.", "कळ्यांतील कळीमाशीच्या अळ्या व करपा पाहा."], 7),
    ], [["Bud fly", "कळीमाशी"], ["Alternaria blight", "करपा"]]),
    stage("capsule", ["Capsule filling", "बोंडे भरणे"], 80, 110, ["Round capsules fill with flat shiny seed.", "गोल बोंडांत चपटे चमकदार दाणे भरतात."], [
      t("ls-obs3", 82, "observation", ["Check capsules", "बोंडे तपासा"], ["Capsules turning brown show seed filling.", "बोंडे तपकिरी होऊ लागली म्हणजे दाणे भरत आहेत."], 10),
      t("ls-irr3", 85, "irrigation", ["Last irrigation (if available)", "शेवटचे पाणी (उपलब्ध असल्यास)"], ["Only if soil is very dry; stop water after this.", "जमीन खूप कोरडी असल्यासच; यानंतर पाणी बंद."]),
    ], [["Rust", "तांबेरा"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 110, 130, ["Plants turn golden brown and capsules rattle.", "झाडे सोनेरी तपकिरी होतात व बोंडे खुळखुळतात."], [
      t("ls-harv", 110, "harvest", ["Harvest", "काढणी करा"], ["Cut or pull plants when capsules are brown; dry and thresh.", "बोंडे तपकिरी झाल्यावर झाडे कापा किंवा उपटा; वाळवून मळणी करा."]),
      t("ls-store", 118, "other", ["Clean and store", "स्वच्छ करून साठवा"], ["Dry seed well and store in dry bags.", "दाणे चांगले वाळवून कोरड्या पोत्यांत साठवा."]),
    ], [["Capsules splitting if harvest is late", "काढणी उशिरा झाल्यास बोंडे फुटणे"]]),
  ],
  commonProblems: [
    {
      name: b("Bud fly", "कळीमाशी"),
      signs: b("Flower buds dry and do not open; a small maggot is inside.", "कळ्या वाळतात व उमलत नाहीत; आत लहान अळी असते."),
      prevention: prevent("Sow on time (early sowing escapes bud fly) and check buds at flowering.", "वेळेवर पेरणी करा (लवकर पेरणीला कळीमाशी कमी) व फुलोऱ्यात कळ्या तपासा."),
    },
    {
      name: b("Powdery mildew", "भुरी"),
      signs: b("White powder on leaves and stems; leaves dry early.", "पाने व खोडावर पांढरी भुकटी; पाने लवकर वाळतात."),
      prevention: prevent("Use tolerant varieties and sow on time.", "सहनशील वाण वापरा व वेळेवर पेरणी करा."),
    },
    {
      name: b("Alternaria blight", "करपा"),
      signs: b("Dark spots on leaves, buds and capsules; buds blacken and fall.", "पाने, कळ्या व बोंडांवर काळे ठिपके; कळ्या काळ्या पडून गळतात."),
      prevention: prevent("Clean seed, seed treatment and crop rotation.", "स्वच्छ बियाणे, बीजप्रक्रिया व फेरपालट."),
    },
  ],
  harvestSigns: b("Plants turn golden brown, leaves dry and capsules are brown and rattle when shaken.", "झाडे सोनेरी तपकिरी, पाने वाळलेली व बोंडे तपकिरी होऊन हलवल्यावर खुळखुळतात."),
  postHarvest: b("Dry seed in the sun, clean it and store in dry, airtight containers or bags.", "दाणे उन्हात वाळवा, स्वच्छ करा व कोरड्या, हवाबंद डब्यांत किंवा पोत्यांत साठवा."),
  marketTips: b("Linseed has growing demand as a health food (flaxseed) and for oil. Clean, bold seed gets a better rate.", "आरोग्यदायी अन्न (फ्लॅक्ससीड) व तेलासाठी जवसाला वाढती मागणी आहे. स्वच्छ, टपोऱ्या दाण्यांना चांगला दर मिळतो."),
  source: "General practices from Dr. PDKV Akola (Nagpur) and VNMKV Parbhani linseed guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
