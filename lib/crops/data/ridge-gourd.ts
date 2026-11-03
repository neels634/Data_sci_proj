import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "ridge-gourd",
  emoji: "🥒",
  name: b("Ridge gourd", "दोडका"),
  aliases: ["ridge gourd", "dodka", "dodaka", "dodke", "दोडका", "दोडके", "turai", "tori", "torai", "तोरई", "तुरई"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["konkan", "western", "north", "marathwada", "vidarbha"],
  tier: 2,
  seasons: [
    { season: "kharif", sowingWindow: b("June–July", "जून–जुलै"), sowingMonths: [6, 7], durationDays: [100, 120] },
    { season: "summer", sowingWindow: b("January–February (with irrigation)", "जानेवारी–फेब्रुवारी (पाण्याची सोय असल्यास)"), sowingMonths: [1, 2], durationDays: [95, 115] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly in pits or on ridges", "बियाणे; खड्ड्यांत किंवा सरीवर थेट टोकणी"),
  soil: b("Well-drained loamy or medium black soil with good organic matter.", "सेंद्रिय पदार्थ असलेली, पाण्याचा निचरा होणारी पोयट्याची किंवा मध्यम काळी जमीन."),
  climate: b("Warm, moderately humid weather. Grows well in the rainy season and in summer with irrigation.", "उबदार, मध्यम दमट हवामान. पावसाळ्यात व पाण्याची सोय असल्यास उन्हाळ्यात चांगले येते."),
  seedRate: b("About 1.5–2 kg seed per acre; 2–3 seeds per pit.", "एकरी साधारण 1.5–2 किलो बियाणे; एका खड्ड्यात 2–3 बिया."),
  spacing: b("On a trellis: 1.5–2 m between rows and 60–90 cm between pits.", "मांडवावर: ओळींत 1.5–2 मीटर व खड्ड्यांत 60–90 सेंमी."),
  irrigation: b(
    "Kharif crop needs water only in dry spells; drain extra rain water. Summer crop: every 4–5 days, ideally by drip.",
    "खरीप पिकाला फक्त पावसाच्या खंडात पाणी; जास्तीचे पावसाचे पाणी काढून द्या. उन्हाळी पिकाला दर 4–5 दिवसांनी, शक्यतो ठिबकने.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure in pits before sowing. Give fertiliser as per soil test, splitting nitrogen into 2–3 parts. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी खड्ड्यांत चांगले कुजलेले शेणखत मिसळा. माती परीक्षणानुसार खत द्या; नत्र 2–3 हप्त्यांत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Sowing & germination", "टोकणी व उगवण"], 0, 12, ["Seeds sprout in about a week.", "साधारण आठवड्यात बी उगवते."], [
      t("rg-sow", 0, "sowing", ["Sow seeds in pits", "खड्ड्यांत बी टोका"], ["Soak seed overnight in plain water and sow 2–3 seeds per pit in moist soil.", "बी रात्रभर साध्या पाण्यात भिजवून ओलसर मातीत एका खड्ड्यात 2–3 बिया टोका."]),
      t("rg-irr0", 1, "irrigation", ["Light irrigation", "हलके पाणी द्या"], ["Keep pits moist until seeds come up.", "बी उगवेपर्यंत खड्डे ओलसर ठेवा."], 4),
      t("rg-thin", 10, "other", ["Fill gaps and thin", "खाडे भरा व विरळणी करा"], ["Resow empty pits and keep 2 plants per pit.", "रिकामे खड्डे भरा व एका खड्ड्यात 2 रोपे ठेवा."]),
    ], [["Red pumpkin beetle on seedlings", "रोपांवर लाल भुंगेरे"]]),
    stage("vine-growth", ["Vine growth", "वेलांची वाढ"], 12, 40, ["Vines grow quickly and climb.", "वेल झपाट्याने वाढून चढतात."], [
      t("rg-irr1", 12, "irrigation", ["Irrigate", "पाणी द्या"], ["Water at the base when the top soil dries.", "वरची माती कोरडी झाल्यावर मुळांजवळ पाणी द्या."], 5),
      t("rg-obs1", 15, "observation", ["Check leaves", "पाने तपासा"], ["Look for beetles, leaf spots and yellow patches.", "भुंगेरे, पानांवरील ठिपके व पिवळे चट्टे पाहा."], 7),
      t("rg-weed", 18, "weeding", ["Weeding and earthing up", "खुरपणी व भर देणे"], ["Weed around pits and add soil to the base.", "खड्ड्यांभोवती खुरपणी करा व बुंध्याला माती लावा."]),
      t("rg-trellis", 20, "other", ["Train vines on the trellis", "वेल मांडवावर चढवा"], ["Use string to guide vines to the mandav so fruits hang straight.", "फळे सरळ लटकावीत म्हणून दोरीने वेल मांडवावर चढवा."]),
      t("rg-fert1", 28, "fertiliser", ["Top dressing", "वरखत द्या"], ["Give the next nitrogen part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार नत्राचा पुढचा हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Downy mildew in humid weather", "दमट हवामानात केवडा"]]),
    stage("flowering", ["Flowering & fruit set", "फुलोरा व फळधारणा"], 40, 50, ["Yellow flowers open in the evening; bees set the fruit.", "संध्याकाळी पिवळी फुले उमलतात; मधमाश्यांमुळे फळधारणा होते."], [
      t("rg-irr2", 40, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even moisture prevents flower and fruit drop.", "सारख्या ओलाव्याने फुले व फळे गळत नाहीत."], 4),
      t("rg-trap", 41, "observation", ["Set fruit fly traps", "फळमाशीसाठी सापळे लावा"], ["Hang traps before fruits form. Ask your KVK which trap to use.", "फळे लागण्यापूर्वी सापळे लावा. कोणता सापळा ते कृषी विज्ञान केंद्राला विचारा."]),
    ], [["Fruit fly on young fruit", "कोवळ्या फळांवर फळमाशी"]]),
    stage("harvest", ["Harvest (pickings)", "तोडणी"], 50, 110, ["Tender fruits are picked every 3–4 days.", "दर 3–4 दिवसांनी कोवळी फळे तोडली जातात."], [
      t("rg-pick", 50, "harvest", ["Pick tender fruits", "कोवळी फळे तोडा"], ["Pick when fruits are tender and the ridges are soft. Fibrous fruits do not sell.", "फळे कोवळी व धारा मऊ असताना तोडा. शिरा भरलेली (जून) फळे विकली जात नाहीत."], 3),
      t("rg-irr3", 51, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep watering regularly between pickings.", "तोडण्यांच्या मध्ये नियमित पाणी द्या."], 5),
      t("rg-obs2", 53, "observation", ["Remove damaged fruits", "खराब फळे काढा"], ["Pick and bury fly-stung or rotting fruits.", "फळमाशीचे डंख किंवा सड असलेली फळे तोडून पुरा."], 7),
      t("rg-fert2", 65, "fertiliser", ["Last top dressing", "शेवटचा वरखत हप्ता"], ["A small last nitrogen part keeps the vines bearing. Ask your agriculture officer for the amount.", "शेवटचा लहान नत्र हप्ता दिल्यास वेल फळे देत राहतात. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Check pre-harvest waiting days on any product label before picking", "तोडणीपूर्वी वापरलेल्या औषधाच्या लेबलवरील काढणीपूर्व कालावधी तपासा"]]),
    stage("last-pickings", ["Last pickings & cleanup", "शेवटच्या तोडण्या व शेत स्वच्छता"], 110, 120, ["The crop finishes and the field is cleaned.", "पीक संपते व शेत स्वच्छ केले जाते."], [
      t("rg-pick2", 110, "harvest", ["Last pickings", "शेवटच्या तोडण्या"], ["Pick the remaining good fruits.", "उरलेली चांगली फळे तोडा."], 4),
      t("rg-clean", 116, "other", ["Remove old vines", "जुने वेल काढा"], ["Pull out vines and destroy diseased ones.", "वेल उपटा व रोगट वेल नष्ट करा."]),
    ], [["Pests carrying over to the next crop", "पुढच्या पिकात कीड जाणे"]]),
  ],
  flushes: { everyDays: 3, count: 18, note: b("Pick tender fruits every 3–4 days; late picking makes them fibrous.", "दर 3–4 दिवसांनी कोवळी फळे तोडा; उशिरा तोडल्यास फळे जून होतात.") },
  commonProblems: [
    { name: b("Fruit fly", "फळमाशी"), signs: b("Stings on young fruit; fruit rots and drops.", "कोवळ्या फळांवर डंख; फळ सडून गळते."), prevention: prevent("Use fruit fly traps, pick on time, and bury damaged fruits.", "फळमाशीचे सापळे लावा, वेळेवर तोडा आणि खराब फळे पुरा.") },
    { name: b("Downy mildew", "केवडा"), signs: b("Yellow angular patches on top of leaves; leaves dry from the edges.", "पानांवर वरून पिवळे कोनाकृती चट्टे; पाने कडेने सुकतात."), prevention: prevent("Grow on a trellis, keep spacing, water at the base and remove affected leaves.", "मांडवावर घ्या, योग्य अंतर ठेवा, मुळांजवळ पाणी द्या व बाधित पाने काढा.") },
    { name: b("Red pumpkin beetle", "लाल भुंगेरे"), signs: b("Holes in seedling leaves; young plants can die.", "रोपांच्या पानांना छिद्रे; लहान रोपे मरू शकतात."), prevention: prevent("Check seedlings daily and remove beetles by hand in the morning.", "रोज रोपे तपासा व सकाळी भुंगेरे हाताने वेचा.") },
  ],
  harvestSigns: b("Fruits are tender, green and full-length, and bend slightly when pressed.", "फळे कोवळी, हिरवी, पूर्ण लांबीची असून दाबल्यास थोडी वाकतात."),
  postHarvest: b("Pick in cool hours, keep in shade, grade by length, and pack loosely in crates. Ridge gourd wilts fast — send it the same day.", "थंड वेळेत तोडा, सावलीत ठेवा, लांबीनुसार प्रतवारी करा आणि क्रेटमध्ये सैल भरा. दोडका लवकर मलूल होतो — त्याच दिवशी पाठवा."),
  marketTips: b("Straight, tender, uniform fruits fetch the best rate. Sell fresh on the day of picking.", "सरळ, कोवळ्या, एकसारख्या फळांना चांगला दर मिळतो. तोडणीच्या दिवशीच ताजे विका."),
  varieties: [
    { name: "Konkan Harita", note: b("Released by Dr. BSKKV Dapoli", "डॉ. बासाकोकृवि दापोलीचा वाण") },
    { name: "Pusa Nasdar", note: b("Widely grown variety from ICAR-IARI", "ICAR-IARI चा मोठ्या प्रमाणावर घेतला जाणारा वाण") },
  ],
  source: "General practices from Dr. BSKKV Dapoli, MPKV Rahuri and ICAR-IIVR cucurbit vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
