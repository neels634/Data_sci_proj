import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "tomato",
  emoji: "🍅",
  name: b("Tomato", "टोमॅटो"),
  aliases: ["tomato", "tamatar", "tomatar", "टोमॅटो", "टमाटर", "टोमाटो"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["western", "north"],
  majorDistricts: b("Nashik, Pune, Satara, Sangli", "नाशिक, पुणे, सातारा, सांगली"),
  tier: 1,
  seasons: [
    { season: "kharif", sowingWindow: b("Nursery in May–June", "रोपवाटिका मे–जून"), sowingMonths: [5, 6], durationDays: [130, 150] },
    { season: "rabi", sowingWindow: b("Nursery in September–October", "रोपवाटिका सप्टेंबर–ऑक्टोबर"), sowingMonths: [9, 10], durationDays: [130, 150] },
    { season: "summer", sowingWindow: b("Nursery in December–January", "रोपवाटिका डिसेंबर–जानेवारी"), sowingMonths: [12, 1], durationDays: [120, 140] },
  ],
  method: "transplant",
  plantingMaterial: b("Seed, raised as seedlings in a nursery", "बियाणे; रोपवाटिकेत रोपे तयार करून"),
  nurseryDays: 28,
  soil: b("Well-drained loamy or medium black soil with good organic matter.", "सेंद्रिय पदार्थ असलेली, पाण्याचा निचरा होणारी पोयट्याची किंवा मध्यम काळी जमीन."),
  climate: b("Mild weather. Very hot days or frost drop flowers.", "सौम्य हवामान. खूप उष्ण दिवस किंवा थंडीने फुले गळतात."),
  seedRate: b("About 100–150 g seed per acre for the nursery (hybrids need less).", "रोपवाटिकेसाठी एकरी साधारण 100–150 ग्रॅम बियाणे (संकरित वाणाला कमी)."),
  spacing: b("90 cm between rows, 30–45 cm between plants (wider for tall hybrids).", "ओळींत 90 सेंमी, रोपांत 30–45 सेंमी (उंच संकरित वाणासाठी जास्त)."),
  irrigation: b("Light and frequent at first, then every 5–6 days. Even moisture at flowering and fruiting prevents flower drop and fruit cracking.", "सुरुवातीला हलके व वारंवार, नंतर दर 5–6 दिवसांनी. फुलोरा व फळधारणेत सारखा ओलावा ठेवल्यास फुलगळ व फळे तडकणे टळते."),
  nutrientGuide: b("Use a soil test. Add compost before planting. Give nitrogen in parts as the crop grows. Ask your agriculture officer for amounts.", "माती परीक्षण करा. लागवडीपूर्वी कंपोस्ट मिसळा. पीक वाढेल तसे नत्र विभागून द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."),
  stages: [
    stage("nursery", ["Nursery", "रोपवाटिका"], 0, 28, ["Seedlings grow in nursery beds or trays.", "रोपवाटिकेत किंवा ट्रेमध्ये रोपे वाढतात."], [
      t("to-bed", 0, "sowing", ["Sow the nursery", "रोपवाटिका पेरा"], ["Sow in raised beds or trays with clean soil and compost.", "स्वच्छ माती व कंपोस्ट असलेल्या गादीवाफ्यावर किंवा ट्रेमध्ये पेरा."]),
      t("to-water", 1, "irrigation", ["Water the nursery lightly", "रोपवाटिकेला हलके पाणी"], ["Keep moist, not soggy.", "ओलसर ठेवा, चिखल नको."], 3),
      t("to-harden", 21, "observation", ["Harden the seedlings", "रोपे कणखर करा"], ["Give less water for a week before transplanting so seedlings get stronger.", "पुनर्लागवडीपूर्वी आठवडाभर कमी पाणी द्या, म्हणजे रोपे कणखर होतात."]),
    ], [["Damping off", "रोपे कोलमडणे"], ["Whitefly on seedlings", "रोपांवर पांढरी माशी"]]),
    stage("establishment", ["Transplanting & establishment", "पुनर्लागवड व स्थिरावणे"], 28, 42, ["Seedlings are planted in the field and take root.", "रोपे शेतात लावली जातात आणि मूळ धरतात."], [
      t("to-tp", 28, "transplanting", ["Transplant", "पुनर्लागवड करा"], ["Plant in the evening and water right after.", "संध्याकाळी लावा व लगेच पाणी द्या."]),
      t("to-irr1", 29, "irrigation", ["Irrigate lightly", "हलके पाणी द्या"], ["Keep the root zone moist until plants settle.", "रोपे स्थिरावेपर्यंत मुळांजवळ ओलावा ठेवा."], 5),
      t("to-gap", 35, "other", ["Fill the gaps", "खाडे भरा"], ["Replace dead or virus-looking plants.", "मेलेली किंवा विषाणूग्रस्त दिसणारी रोपे बदला."]),
    ], [["Plants with curled, yellow leaves (leaf curl virus)", "आकसलेली पिवळी पाने (पर्णगुच्छ विषाणू)"]]),
    stage("vegetative", ["Plant growth", "रोपांची वाढ"], 42, 60, ["Stems and leaves grow; plants need support.", "खोड व पाने वाढतात; रोपांना आधार लागतो."], [
      t("to-irr2", 42, "irrigation", ["Irrigate", "पाणी द्या"], ["Water at the base, not on the leaves.", "पानांवर नव्हे, मुळांजवळ पाणी द्या."], 6),
      t("to-obs1", 44, "observation", ["Check leaves", "पाने तपासा"], ["Look under leaves for whitefly; remove plants with curled leaves.", "पानांखाली पांढरी माशी पाहा; आकसलेली पाने असलेली रोपे काढा."], 7),
      t("to-stake", 45, "other", ["Give support (staking)", "आधार द्या"], ["Use stakes or wire and string so fruits stay off the soil.", "फळे मातीला लागू नयेत म्हणून काठ्या किंवा तार-दोरीचा आधार द्या."]),
      t("to-weed", 48, "weeding", ["Weeding", "खुरपणी"], ["Remove weeds near plants.", "रोपांजवळील तण काढा."]),
      t("to-fert", 50, "fertiliser", ["Top dressing", "वरखत"], ["Give the next nutrient part as per your soil test. Ask your agriculture officer for amounts.", "माती परीक्षणानुसार पुढचा खत हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Whitefly and leaf curl", "पांढरी माशी व पर्णगुच्छ"], ["Early blight: brown rings on old leaves", "लवकर करपा: जुन्या पानांवर तपकिरी वर्तुळे"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 60, 80, ["Flowers open and first fruits set.", "फुले उमलतात आणि पहिली फळे धरतात."], [
      t("to-irr3", 60, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Water stress now drops flowers.", "आता पाण्याचा ताण आल्यास फुले गळतात."], 5),
      t("to-trap", 62, "observation", ["Set traps for fruit borer", "फळ पोखरणाऱ्या अळीसाठी सापळे"], ["Pheromone traps show when the pest arrives. Ask your KVK which trap to use.", "कामगंध सापळ्यांमुळे कीड कधी आली ते कळते. कोणता सापळा वापरायचा ते कृषी विज्ञान केंद्राला विचारा."]),
      t("to-obs2", 64, "observation", ["Check flowers and young fruit", "फुले व कोवळी फळे तपासा"], ["Look for small holes and caterpillars.", "लहान छिद्रे व अळ्या आहेत का ते पाहा."], 7),
    ], [["Fruit borer", "फळ पोखरणारी अळी"], ["Flower drop in heat", "उष्णतेत फुलगळ"]]),
    stage("fruiting", ["Fruit development", "फळांची वाढ"], 80, 100, ["Fruits grow and start to colour.", "फळे वाढतात व रंग धरू लागतात."], [
      t("to-irr4", 80, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even water stops fruit cracking and black bottoms.", "सारख्या पाण्याने फळे तडकणे व खालून काळी होणे थांबते."], 5),
      t("to-obs3", 82, "observation", ["Remove bored fruits", "पोखरलेली फळे काढा"], ["Pick and destroy fruits with holes so the pest doesn't multiply.", "छिद्र असलेली फळे तोडून नष्ट करा, म्हणजे कीड वाढत नाही."], 7),
    ], [["Fruit cracking", "फळे तडकणे"], ["Late blight in cool, humid weather", "थंड दमट हवामानात उशिरा करपा"]]),
    stage("harvest", ["Harvest (pickings)", "तोडणी"], 100, 150, ["Fruits are picked every few days.", "दर काही दिवसांनी फळांची तोडणी होते."], [
      t("to-pick", 100, "harvest", ["Pick fruits", "फळांची तोडणी करा"], ["Pick at turning colour for far markets, fully red for local sale.", "दूरच्या बाजारासाठी रंग बदलताना, स्थानिक विक्रीसाठी पूर्ण लाल झाल्यावर तोडा."], 4),
      t("to-irr5", 101, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep watering lightly between pickings.", "तोडण्यांच्या मध्ये हलके पाणी देत राहा."], 6),
      t("to-grade", 103, "other", ["Grade fruits", "फळांची प्रतवारी करा"], ["Sort by size and colour; remove damaged fruit.", "आकार व रंगानुसार वेगळी करा; खराब फळे काढा."], 14),
    ], [["Check pre-harvest waiting days on any product label before picking", "तोडणीपूर्वी वापरलेल्या औषधाच्या लेबलवरील काढणीपूर्व कालावधी तपासा"]]),
  ],
  commonProblems: [
    { name: b("Leaf curl virus", "पर्णगुच्छ (लीफ कर्ल)"), signs: b("Leaves curl, plants stay small and yellow. Spread by whitefly.", "पाने आकसतात, रोपे खुजी व पिवळी राहतात. पांढऱ्या माशीमुळे पसरतो."), prevention: prevent("Use healthy seedlings, remove infected plants early and keep weeds down.", "निरोगी रोपे वापरा, बाधित रोपे लवकर काढा व तण कमी ठेवा.") },
    { name: b("Fruit borer", "फळ पोखरणारी अळी"), signs: b("Round holes in fruit with droppings.", "फळांवर गोल छिद्रे व विष्ठा."), prevention: prevent("Use pheromone traps, and pick and destroy bored fruits.", "कामगंध सापळे वापरा आणि पोखरलेली फळे तोडून नष्ट करा.") },
    { name: b("Early and late blight", "लवकर व उशिरा करपा"), signs: b("Brown spots with rings on leaves; dark patches on fruit.", "पानांवर वर्तुळांचे तपकिरी ठिपके; फळांवर काळपट चट्टे."), prevention: prevent("Give space for air, water at the base, and remove badly affected leaves.", "हवा खेळती राहील असे अंतर ठेवा, मुळांजवळ पाणी द्या व जास्त बाधित पाने काढा.") },
    { name: b("Tomato leaf miner (Tuta absoluta)", "टोमॅटो पाने पोखरणारी अळी (टुटा)"), signs: b("Pale blotches (mines) inside leaves, holes in stems and small holes in fruit.", "पानांच्या आत फिकट चट्टे (पोखरलेले भाग), खोडाला व फळांना बारीक छिद्रे."), prevention: prevent("Use healthy seedlings, put up pheromone traps early, and pick and destroy mined leaves and bored fruit.", "निरोगी रोपे वापरा, लवकर कामगंध सापळे लावा आणि पोखरलेली पाने व फळे तोडून नष्ट करा.") },
  ],
  harvestSigns: b("Fruits change from green to pink/red at the bottom.", "फळ खालून हिरव्यापासून गुलाबी/लाल होते."),
  postHarvest: b("Pick in cool hours, keep in shade, grade by size and colour, pack in crates — not sacks.", "थंड वेळेत तोडा, सावलीत ठेवा, आकार व रंगानुसार प्रतवारी करा, पोत्यात नव्हे तर क्रेटमध्ये भरा."),
  marketTips: b("Tomato prices change fast. Crates and grading reduce damage and get better rates. Plan pickings with your Mandi Mitra.", "टोमॅटोचे दर लवकर बदलतात. क्रेट व प्रतवारीमुळे नुकसान कमी होऊन चांगला दर मिळतो. मंडी मित्रासोबत तोडणीचे नियोजन करा."),
  varieties: [], // TODO: varieties — confirm with MPKV Rahuri vegetable package of practices
  source: "General practices from ICAR-IIHR and MPKV Rahuri vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
