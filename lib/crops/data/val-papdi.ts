import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "val-papdi",
  emoji: "🫛",
  name: b("Dolichos bean (val papdi)", "वाल पापडी"),
  aliases: ["val papdi", "valpapdi", "वाल पापडी", "वालपापडी", "papdi", "पापडी", "dolichos", "dolichos bean", "lablab", "sem phali", "सेम"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["konkan", "western", "north"],
  tier: 2,
  seasons: [
    { season: "kharif", sowingWindow: b("June–August (pole types on a trellis)", "जून–ऑगस्ट (मांडवावरील वेली जाती)"), sowingMonths: [6, 7, 8], durationDays: [120, 150] },
    { season: "rabi", sowingWindow: b("September–October (bush types, with irrigation)", "सप्टेंबर–ऑक्टोबर (झुडूप जाती, पाण्याची सोय असल्यास)"), sowingMonths: [9, 10], durationDays: [90, 120] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly in pits or lines", "बियाणे; खड्ड्यांत किंवा ओळीत थेट पेरणी"),
  soil: b("Well-drained loamy or medium black soil. Avoid waterlogged fields.", "पाण्याचा निचरा होणारी पोयट्याची किंवा मध्यम काळी जमीन. पाणी साचणारे शेत टाळा."),
  climate: b(
    "Warm days and cool nights. Many local pole types flower only when days get shorter (from October), whatever the sowing date.",
    "उबदार दिवस व थंड रात्री. अनेक स्थानिक वेली जाती पेरणी कधीही केली तरी दिवस लहान झाल्यावरच (ऑक्टोबरपासून) फुलावर येतात.",
  ),
  seedRate: b("About 8–10 kg seed per acre for bush types; 4–5 kg for pole types in pits.", "झुडूप जातींसाठी एकरी साधारण 8–10 किलो; खड्ड्यांत लावण्याच्या वेली जातींसाठी 4–5 किलो."),
  spacing: b("Pole types: 1.5–2 m between rows and 60–90 cm between pits, on a trellis. Bush types: 45–60 cm × 20–30 cm.", "वेली जाती: मांडवावर ओळींत 1.5–2 मीटर व खड्ड्यांत 60–90 सेंमी. झुडूप जाती: 45–60 × 20–30 सेंमी."),
  irrigation: b(
    "Kharif crop needs water only in dry spells. After the rains, water every 8–10 days; keep the soil moist at flowering and pod filling.",
    "खरीप पिकाला फक्त पावसाच्या खंडात पाणी. पाऊस संपल्यावर दर 8–10 दिवसांनी पाणी; फुलोरा व शेंगा भरताना जमीन ओलसर ठेवा.",
  ),
  nutrientGuide: b(
    "A legume, so it needs little nitrogen. Add well-rotted farmyard manure before sowing and fertiliser as per soil test. Too much nitrogen gives leaves, not pods. Ask your agriculture officer for amounts.",
    "द्विदल पीक असल्याने नत्र कमी लागते. पेरणीपूर्वी कुजलेले शेणखत व माती परीक्षणानुसार खत द्या. जास्त नत्राने पाने वाढतात, शेंगा नाही. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Sowing & germination", "पेरणी व उगवण"], 0, 15, ["Seeds sprout in about a week.", "साधारण आठवड्यात बी उगवते."], [
      t("vp-sow", 0, "sowing", ["Sow seed", "बी पेरा"], ["Sow 2–3 seeds per pit (pole types) or in lines (bush types), in moist soil.", "ओलसर जमिनीत एका खड्ड्यात 2–3 बिया (वेली जाती) किंवा ओळीत (झुडूप जाती) पेरा."]),
      t("vp-irr0", 2, "irrigation", ["Light irrigation if dry", "कोरडे असल्यास हलके पाणी"], ["Give light water only if the soil dries.", "जमीन कोरडी झाल्यासच हलके पाणी द्या."]),
      t("vp-thin", 12, "other", ["Fill gaps and thin", "खाडे भरा व विरळणी करा"], ["Keep 2 plants per pit or proper spacing in lines.", "एका खड्ड्यात 2 रोपे किंवा ओळीत योग्य अंतर ठेवा."]),
    ], [["Seedlings dying in wet soil", "ओल्या जमिनीत रोपे मरणे"]]),
    stage("vine-growth", ["Vine growth", "वेलांची वाढ"], 15, 60, ["Vines grow and climb; bush types branch out.", "वेल वाढून चढतात; झुडूप जातींना फांद्या फुटतात."], [
      t("vp-trellis", 20, "other", ["Give support", "आधार द्या"], ["Train pole types onto a mandav or stakes with string.", "वेली जाती दोरीने मांडवावर किंवा काठ्यांवर चढवा."]),
      t("vp-weed", 22, "weeding", ["Weeding", "खुरपणी"], ["Weed twice in the first 6 weeks.", "पहिल्या 6 आठवड्यांत दोनदा खुरपणी करा."], 20),
      t("vp-obs1", 25, "observation", ["Check leaves", "पाने तपासा"], ["Look for aphids on tender shoots.", "कोवळ्या शेंड्यांवर मावा आहे का ते पाहा."], 7),
      t("vp-irr1", 30, "irrigation", ["Irrigate in dry spells", "पावसाच्या खंडात पाणी"], ["Water when the soil dries.", "जमीन कोरडी झाल्यावर पाणी द्या."], 10),
    ], [["Aphids on shoots", "शेंड्यांवर मावा"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 60, 90, ["Flower spikes come; pods start.", "फुलांचे तुरे येतात; शेंगा लागू लागतात."], [
      t("vp-irr2", 60, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Keep the soil moist; stress drops flowers.", "जमीन ओलसर ठेवा; ताण आल्यास फुलगळ होते."], 8),
      t("vp-obs2", 62, "observation", ["Check flowers", "फुले तपासा"], ["Look for pod borer caterpillars in flowers and aphids on spikes.", "फुलांत शेंगा पोखरणाऱ्या अळ्या व तुऱ्यांवर मावा पाहा."], 7),
    ], [["Pod borer and aphids", "शेंगा पोखरणारी अळी व मावा"]]),
    stage("harvest", ["Harvest (pickings)", "तोडणी"], 90, 140, ["Tender pods are picked every 5–7 days.", "दर 5–7 दिवसांनी कोवळ्या शेंगा तोडल्या जातात."], [
      t("vp-pick", 90, "harvest", ["Pick tender pods", "कोवळ्या शेंगा तोडा"], ["Pick flat, tender pods before seeds bulge.", "बिया फुगण्यापूर्वी चपट्या, कोवळ्या शेंगा तोडा."], 5),
      t("vp-irr3", 91, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep the soil moist between pickings.", "तोडण्यांच्या मध्ये जमीन ओलसर ठेवा."], 8),
      t("vp-obs3", 95, "observation", ["Remove bored pods", "पोखरलेल्या शेंगा काढा"], ["Remove and destroy pods with holes.", "छिद्रे असलेल्या शेंगा काढून नष्ट करा."], 7),
    ], [["Check pre-harvest waiting days on any product label before picking", "तोडणीपूर्वी वापरलेल्या औषधाच्या लेबलवरील काढणीपूर्व कालावधी तपासा"]]),
    stage("last-pickings", ["Last pickings & cleanup", "शेवटच्या तोडण्या व शेत स्वच्छता"], 140, 150, ["The crop finishes.", "पीक संपते."], [
      t("vp-pick2", 140, "harvest", ["Last pickings", "शेवटच्या तोडण्या"], ["Pick remaining tender pods; dry pods can be kept for seed.", "उरलेल्या कोवळ्या शेंगा तोडा; वाळलेल्या शेंगा बियाण्यासाठी ठेवता येतात."], 5),
      t("vp-clean", 146, "other", ["Clear the field", "शेत मोकळे करा"], ["Remove vines; plough in healthy remains.", "वेल काढा; निरोगी अवशेष जमिनीत गाडा."]),
    ], [["Diseased plant remains", "रोगट अवशेष"]]),
  ],
  flushes: { everyDays: 5, count: 10, note: b("Pick tender pods every 5–7 days.", "दर 5–7 दिवसांनी कोवळ्या शेंगा तोडा.") },
  commonProblems: [
    { name: b("Pod borer", "शेंगा पोखरणारी अळी"), signs: b("Holes in flowers and pods; caterpillars inside.", "फुले व शेंगांना छिद्रे; आत अळ्या."), prevention: prevent("Check flowers weekly, use pheromone traps, and remove bored pods.", "दर आठवड्याला फुले तपासा, कामगंध सापळे लावा व पोखरलेल्या शेंगा काढा.") },
    { name: b("Aphids", "मावा"), signs: b("Black insects in groups on shoots, flower spikes and pods.", "शेंडे, फुलांचे तुरे व शेंगांवर समूहात काळ्या किडी."), prevention: prevent("Check shoots often and remove heavily affected tips.", "शेंडे वारंवार तपासा व जास्त बाधित शेंडे खुडून टाका.") },
    { name: b("Yellow mosaic virus", "पिवळा मोझॅक"), signs: b("Yellow and green patches on leaves; few pods.", "पानांवर पिवळे-हिरवे चट्टे; शेंगा कमी."), prevention: prevent("Remove infected plants early and keep whitefly and weeds down.", "बाधित झाडे लवकर काढा व पांढरी माशी व तण कमी ठेवा.") },
  ],
  harvestSigns: b("Pods are full-sized, flat, green and tender; seeds inside are small.", "शेंगा पूर्ण आकाराच्या, चपट्या, हिरव्या व कोवळ्या; आतील बिया लहान."),
  postHarvest: b("Pick in cool hours, keep in shade, remove damaged pods and pack in ventilated bags.", "थंड वेळेत तोडा, सावलीत ठेवा, खराब शेंगा काढा आणि हवेशीर पिशव्यांत भरा."),
  marketTips: b("Winter demand is high, especially for undhiyu and local dishes. Tender, uniform pods sell best.", "हिवाळ्यात, विशेषतः उंधियो व स्थानिक पदार्थांसाठी मागणी जास्त. कोवळ्या, एकसारख्या शेंगांना चांगला दर."),
  varieties: [
    { name: "Arka Jay", note: b("Bush type, not day-length sensitive (ICAR-IIHR)", "झुडूप जात, दिवसाच्या लांबीवर अवलंबून नाही (ICAR-IIHR)") },
  ], // TODO: varieties — confirm Konkan pole-type releases with Dr. BSKKV Dapoli
  source: "General practices from Dr. BSKKV Dapoli, MPKV Rahuri and ICAR-IIHR vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
