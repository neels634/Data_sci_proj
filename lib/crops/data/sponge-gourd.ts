import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "sponge-gourd",
  emoji: "🥒",
  name: b("Sponge gourd", "घोसाळे"),
  aliases: ["sponge gourd", "smooth gourd", "ghosale", "ghosali", "ghosavale", "घोसाळे", "घोसाळी", "घोसावळे", "gilki", "गिलकी", "nenua"],
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
  climate: b("Warm and humid weather; mainly a rainy-season crop.", "उबदार व दमट हवामान; मुख्यतः पावसाळी पीक."),
  seedRate: b("About 1.5–2 kg seed per acre; 2–3 seeds per pit.", "एकरी साधारण 1.5–2 किलो बियाणे; एका खड्ड्यात 2–3 बिया."),
  spacing: b("On a trellis: 1.5–2 m between rows and 60–90 cm between pits.", "मांडवावर: ओळींत 1.5–2 मीटर व खड्ड्यांत 60–90 सेंमी."),
  irrigation: b(
    "Kharif crop needs water only in dry spells; do not let water stand. Summer crop: every 4–5 days, ideally by drip.",
    "खरीप पिकाला फक्त पावसाच्या खंडात पाणी; पाणी साचू देऊ नका. उन्हाळी पिकाला दर 4–5 दिवसांनी, शक्यतो ठिबकने.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure in pits before sowing. Give fertiliser as per soil test, splitting nitrogen into 2–3 parts. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी खड्ड्यांत चांगले कुजलेले शेणखत मिसळा. माती परीक्षणानुसार खत द्या; नत्र 2–3 हप्त्यांत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Sowing & germination", "टोकणी व उगवण"], 0, 12, ["Seeds sprout in about a week.", "साधारण आठवड्यात बी उगवते."], [
      t("sg-sow", 0, "sowing", ["Sow seeds in pits", "खड्ड्यांत बी टोका"], ["Soak seed overnight in plain water and sow 2–3 seeds per pit.", "बी रात्रभर साध्या पाण्यात भिजवून एका खड्ड्यात 2–3 बिया टोका."]),
      t("sg-irr0", 1, "irrigation", ["Light irrigation", "हलके पाणी द्या"], ["Keep pits moist until seeds come up.", "बी उगवेपर्यंत खड्डे ओलसर ठेवा."], 4),
      t("sg-thin", 10, "other", ["Fill gaps and thin", "खाडे भरा व विरळणी करा"], ["Resow empty pits and keep 2 plants per pit.", "रिकामे खड्डे भरा व एका खड्ड्यात 2 रोपे ठेवा."]),
    ], [["Red pumpkin beetle on seedlings", "रोपांवर लाल भुंगेरे"]]),
    stage("vine-growth", ["Vine growth", "वेलांची वाढ"], 12, 40, ["Vines grow fast and climb the trellis.", "वेल झपाट्याने वाढून मांडवावर चढतात."], [
      t("sg-irr1", 12, "irrigation", ["Irrigate", "पाणी द्या"], ["Water at the base when the top soil dries.", "वरची माती कोरडी झाल्यावर मुळांजवळ पाणी द्या."], 5),
      t("sg-obs1", 15, "observation", ["Check leaves", "पाने तपासा"], ["Look for beetles, yellow patches and mottled leaves.", "भुंगेरे, पिवळे चट्टे व चट्टेदार पाने पाहा."], 7),
      t("sg-weed", 18, "weeding", ["Weeding and earthing up", "खुरपणी व भर देणे"], ["Weed around pits and add soil to the base.", "खड्ड्यांभोवती खुरपणी करा व बुंध्याला माती लावा."]),
      t("sg-trellis", 20, "other", ["Train vines on the trellis", "वेल मांडवावर चढवा"], ["Guide vines with string to the mandav.", "दोरीने वेल मांडवावर चढवा."]),
      t("sg-fert1", 28, "fertiliser", ["Top dressing", "वरखत द्या"], ["Give the next nitrogen part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार नत्राचा पुढचा हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Downy mildew in humid weather", "दमट हवामानात केवडा"]]),
    stage("flowering", ["Flowering & fruit set", "फुलोरा व फळधारणा"], 40, 50, ["Yellow flowers open; bees set the fruit.", "पिवळी फुले उमलतात; मधमाश्यांमुळे फळधारणा होते."], [
      t("sg-irr2", 40, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even moisture prevents flower and fruit drop.", "सारख्या ओलाव्याने फुले व फळे गळत नाहीत."], 4),
      t("sg-trap", 41, "observation", ["Set fruit fly traps", "फळमाशीसाठी सापळे लावा"], ["Hang traps before fruits form. Ask your KVK which trap to use.", "फळे लागण्यापूर्वी सापळे लावा. कोणता सापळा ते कृषी विज्ञान केंद्राला विचारा."]),
    ], [["Fruit fly on young fruit", "कोवळ्या फळांवर फळमाशी"]]),
    stage("harvest", ["Harvest (pickings)", "तोडणी"], 50, 110, ["Tender fruits are picked every 3–4 days.", "दर 3–4 दिवसांनी कोवळी फळे तोडली जातात."], [
      t("sg-pick", 50, "harvest", ["Pick tender fruits", "कोवळी फळे तोडा"], ["Pick when fruits are smooth, green and soft. Older fruits become spongy and fibrous.", "फळे गुळगुळीत, हिरवी व मऊ असताना तोडा. जुनी फळे जाळीदार व शिरेदार होतात."], 3),
      t("sg-irr3", 51, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep watering regularly between pickings.", "तोडण्यांच्या मध्ये नियमित पाणी द्या."], 5),
      t("sg-obs2", 53, "observation", ["Remove damaged fruits", "खराब फळे काढा"], ["Pick and bury fly-stung or rotting fruits.", "फळमाशीचे डंख किंवा सड असलेली फळे तोडून पुरा."], 7),
      t("sg-fert2", 65, "fertiliser", ["Last top dressing", "शेवटचा वरखत हप्ता"], ["A small last nitrogen part keeps the vines bearing. Ask your agriculture officer for the amount.", "शेवटचा लहान नत्र हप्ता दिल्यास वेल फळे देत राहतात. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Check pre-harvest waiting days on any product label before picking", "तोडणीपूर्वी वापरलेल्या औषधाच्या लेबलवरील काढणीपूर्व कालावधी तपासा"]]),
    stage("last-pickings", ["Last pickings & cleanup", "शेवटच्या तोडण्या व शेत स्वच्छता"], 110, 120, ["The crop finishes and the field is cleaned.", "पीक संपते व शेत स्वच्छ केले जाते."], [
      t("sg-pick2", 110, "harvest", ["Last pickings", "शेवटच्या तोडण्या"], ["Pick the remaining good fruits.", "उरलेली चांगली फळे तोडा."], 4),
      t("sg-clean", 116, "other", ["Remove old vines", "जुने वेल काढा"], ["Pull out vines and destroy diseased ones.", "वेल उपटा व रोगट वेल नष्ट करा."]),
    ], [["Pests carrying over to the next crop", "पुढच्या पिकात कीड जाणे"]]),
  ],
  flushes: { everyDays: 3, count: 18, note: b("Pick tender fruits every 3–4 days.", "दर 3–4 दिवसांनी कोवळी फळे तोडा.") },
  commonProblems: [
    { name: b("Fruit fly", "फळमाशी"), signs: b("Stings on young fruit; fruit rots and drops.", "कोवळ्या फळांवर डंख; फळ सडून गळते."), prevention: prevent("Use fruit fly traps, pick on time, and bury damaged fruits.", "फळमाशीचे सापळे लावा, वेळेवर तोडा आणि खराब फळे पुरा.") },
    { name: b("Downy mildew", "केवडा"), signs: b("Yellow angular patches on top of leaves; leaves dry.", "पानांवर वरून पिवळे कोनाकृती चट्टे; पाने सुकतात."), prevention: prevent("Grow on a trellis, keep spacing and remove affected leaves.", "मांडवावर घ्या, योग्य अंतर ठेवा व बाधित पाने काढा.") },
    { name: b("Mosaic virus", "मोझॅक (विषाणू)"), signs: b("Mottled, crinkled leaves; small, misshapen fruits.", "चट्टेदार, सुरकुतलेली पाने; लहान, वेडीवाकडी फळे."), prevention: prevent("Remove infected plants early and keep weeds and sucking pests down.", "बाधित वेल लवकर काढा आणि तण व रसशोषक किडी कमी ठेवा.") },
  ],
  harvestSigns: b("Fruits are smooth, green, tender and soft to press.", "फळे गुळगुळीत, हिरवी, कोवळी व दाबल्यास मऊ लागतात."),
  postHarvest: b("Pick in cool hours, keep in shade, grade by size and send the same day — it wilts quickly.", "थंड वेळेत तोडा, सावलीत ठेवा, आकारानुसार प्रतवारी करा आणि त्याच दिवशी पाठवा — लवकर मलूल होते."),
  marketTips: b("Fresh, tender, uniform fruits sell best in local markets. Small regular lots are easier to sell than one big lot.", "ताज्या, कोवळ्या, एकसारख्या फळांना स्थानिक बाजारात चांगली मागणी. एकदम मोठ्या मालापेक्षा नियमित थोडा-थोडा माल विकणे सोपे."),
  varieties: [
    { name: "Pusa Chikni", note: b("Smooth-fruited variety from ICAR-IARI", "ICAR-IARI चा गुळगुळीत फळांचा वाण") },
  ], // TODO: varieties — confirm Maharashtra releases with MPKV Rahuri / Dr. BSKKV Dapoli
  source: "General practices from MPKV Rahuri and ICAR-IIVR cucurbit vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
