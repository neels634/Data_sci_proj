import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "snake-gourd",
  emoji: "🥒",
  name: b("Snake gourd", "पडवळ"),
  aliases: ["snake gourd", "padval", "padwal", "padaval", "पडवळ", "chichinda", "chichinga", "चिचिंडा"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["konkan", "western", "north"],
  tier: 2,
  seasons: [
    { season: "kharif", sowingWindow: b("June–July", "जून–जुलै"), sowingMonths: [6, 7], durationDays: [110, 140] },
    { season: "summer", sowingWindow: b("January–February (with irrigation)", "जानेवारी–फेब्रुवारी (पाण्याची सोय असल्यास)"), sowingMonths: [1, 2], durationDays: [100, 125] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly in pits", "बियाणे; खड्ड्यांत थेट टोकणी"),
  soil: b("Well-drained loamy soil rich in organic matter; also does well in Konkan lateritic soils with manure.", "सेंद्रिय पदार्थ भरपूर असलेली, पाण्याचा निचरा होणारी पोयट्याची जमीन; शेणखत दिल्यास कोकणातील जांभ्या जमिनीतही चांगले येते."),
  climate: b("Warm and humid weather. A favourite rainy-season vegetable in Konkan.", "उबदार व दमट हवामान. कोकणात पावसाळ्यातील आवडती भाजी."),
  seedRate: b("About 1.5–2 kg seed per acre; 2–3 seeds per pit.", "एकरी साधारण 1.5–2 किलो बियाणे; एका खड्ड्यात 2–3 बिया."),
  spacing: b("On a tall trellis: 1.5–2 m between rows and about 1 m between pits. Long fruits need a trellis to hang straight.", "उंच मांडवावर: ओळींत 1.5–2 मीटर व खड्ड्यांत साधारण 1 मीटर. लांब फळे सरळ लटकण्यासाठी मांडव आवश्यक."),
  irrigation: b(
    "Kharif crop needs water only in dry spells; drain extra water. Summer crop: every 4–6 days, ideally by drip.",
    "खरीप पिकाला फक्त पावसाच्या खंडात पाणी; जास्तीचे पाणी काढून द्या. उन्हाळी पिकाला दर 4–6 दिवसांनी, शक्यतो ठिबकने.",
  ),
  nutrientGuide: b(
    "Mix plenty of well-rotted farmyard manure in pits before sowing. Give fertiliser as per soil test, splitting nitrogen into 2–3 parts. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी खड्ड्यांत भरपूर कुजलेले शेणखत मिसळा. माती परीक्षणानुसार खत द्या; नत्र 2–3 हप्त्यांत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Sowing & germination", "टोकणी व उगवण"], 0, 15, ["Seeds sprout in 8–10 days.", "8–10 दिवसांत बी उगवते."], [
      t("sn-sow", 0, "sowing", ["Sow seeds in pits", "खड्ड्यांत बी टोका"], ["Soak seed overnight in plain water and sow 2–3 seeds per pit.", "बी रात्रभर साध्या पाण्यात भिजवून एका खड्ड्यात 2–3 बिया टोका."]),
      t("sn-irr0", 1, "irrigation", ["Light irrigation", "हलके पाणी द्या"], ["Keep pits moist until seeds come up.", "बी उगवेपर्यंत खड्डे ओलसर ठेवा."], 4),
      t("sn-thin", 12, "other", ["Fill gaps and thin", "खाडे भरा व विरळणी करा"], ["Resow empty pits and keep 2 plants per pit.", "रिकामे खड्डे भरा व एका खड्ड्यात 2 रोपे ठेवा."]),
    ], [["Red pumpkin beetle on seedlings", "रोपांवर लाल भुंगेरे"]]),
    stage("vine-growth", ["Vine growth", "वेलांची वाढ"], 15, 50, ["Vines climb and spread over the trellis.", "वेल चढून मांडवावर पसरतात."], [
      t("sn-irr1", 15, "irrigation", ["Irrigate", "पाणी द्या"], ["Water at the base when the top soil dries.", "वरची माती कोरडी झाल्यावर मुळांजवळ पाणी द्या."], 6),
      t("sn-obs1", 18, "observation", ["Check leaves", "पाने तपासा"], ["Look for beetles, leaf-eating caterpillars and yellow patches.", "भुंगेरे, पाने खाणाऱ्या अळ्या व पिवळे चट्टे पाहा."], 7),
      t("sn-weed", 20, "weeding", ["Weeding and earthing up", "खुरपणी व भर देणे"], ["Weed around pits and add soil to the base.", "खड्ड्यांभोवती खुरपणी करा व बुंध्याला माती लावा."]),
      t("sn-trellis", 22, "other", ["Train vines on the trellis", "वेल मांडवावर चढवा"], ["Guide vines to a mandav about 2 m high so long fruits hang freely.", "लांब फळे मोकळी लटकावीत म्हणून वेल साधारण 2 मीटर उंच मांडवावर चढवा."]),
      t("sn-fert1", 32, "fertiliser", ["Top dressing", "वरखत द्या"], ["Give the next nitrogen part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार नत्राचा पुढचा हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Downy mildew in humid weather", "दमट हवामानात केवडा"]]),
    stage("flowering", ["Flowering & fruit set", "फुलोरा व फळधारणा"], 50, 65, ["Lacy white flowers open in the evening and fruits set.", "संध्याकाळी झालरदार पांढरी फुले उमलतात व फळे लागतात."], [
      t("sn-irr2", 50, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even moisture prevents flower and fruit drop.", "सारख्या ओलाव्याने फुले व फळे गळत नाहीत."], 5),
      t("sn-trap", 51, "observation", ["Set fruit fly traps", "फळमाशीसाठी सापळे लावा"], ["Hang traps before fruits form. Ask your KVK which trap to use.", "फळे लागण्यापूर्वी सापळे लावा. कोणता सापळा ते कृषी विज्ञान केंद्राला विचारा."]),
      t("sn-stone", 58, "other", ["Tie a small weight to young fruits (optional)", "कोवळ्या फळाला लहान वजन बांधा (ऐच्छिक)"], ["Many farmers tie a small stone to the tip of young fruits so they grow straight and long.", "फळ सरळ व लांब वाढावे म्हणून अनेक शेतकरी कोवळ्या फळाच्या टोकाला लहान दगड बांधतात."]),
    ], [["Fruit fly on young fruit", "कोवळ्या फळांवर फळमाशी"]]),
    stage("harvest", ["Harvest (pickings)", "तोडणी"], 65, 125, ["Tender fruits are picked every 3–4 days.", "दर 3–4 दिवसांनी कोवळी फळे तोडली जातात."], [
      t("sn-pick", 65, "harvest", ["Pick tender fruits", "कोवळी फळे तोडा"], ["Pick when fruits are full-length but still tender, before seeds harden.", "फळे पूर्ण लांबीची पण कोवळी असताना, बिया कडक होण्यापूर्वी तोडा."], 3),
      t("sn-irr3", 66, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep watering regularly between pickings.", "तोडण्यांच्या मध्ये नियमित पाणी द्या."], 5),
      t("sn-obs2", 68, "observation", ["Remove damaged fruits", "खराब फळे काढा"], ["Pick and bury fly-stung or rotting fruits.", "फळमाशीचे डंख किंवा सड असलेली फळे तोडून पुरा."], 7),
      t("sn-fert2", 80, "fertiliser", ["Last top dressing", "शेवटचा वरखत हप्ता"], ["A small last nitrogen part keeps the vines bearing. Ask your agriculture officer for the amount.", "शेवटचा लहान नत्र हप्ता दिल्यास वेल फळे देत राहतात. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Check pre-harvest waiting days on any product label before picking", "तोडणीपूर्वी वापरलेल्या औषधाच्या लेबलवरील काढणीपूर्व कालावधी तपासा"]]),
    stage("last-pickings", ["Last pickings & cleanup", "शेवटच्या तोडण्या व शेत स्वच्छता"], 125, 140, ["The crop finishes and the field is cleaned.", "पीक संपते व शेत स्वच्छ केले जाते."], [
      t("sn-pick2", 125, "harvest", ["Last pickings", "शेवटच्या तोडण्या"], ["Pick the remaining good fruits.", "उरलेली चांगली फळे तोडा."], 4),
      t("sn-clean", 135, "other", ["Remove old vines", "जुने वेल काढा"], ["Pull out vines and destroy diseased ones.", "वेल उपटा व रोगट वेल नष्ट करा."]),
    ], [["Pests carrying over to the next crop", "पुढच्या पिकात कीड जाणे"]]),
  ],
  flushes: { everyDays: 3, count: 18, note: b("Pick tender fruits every 3–4 days.", "दर 3–4 दिवसांनी कोवळी फळे तोडा.") },
  commonProblems: [
    { name: b("Fruit fly", "फळमाशी"), signs: b("Stings on young fruit; fruit bends, rots and drops.", "कोवळ्या फळांवर डंख; फळ वाकते, सडते व गळते."), prevention: prevent("Use fruit fly traps, pick on time, and bury damaged fruits.", "फळमाशीचे सापळे लावा, वेळेवर तोडा आणि खराब फळे पुरा.") },
    { name: b("Downy mildew", "केवडा"), signs: b("Yellow angular patches on top of leaves; leaves dry.", "पानांवर वरून पिवळे कोनाकृती चट्टे; पाने सुकतात."), prevention: prevent("Keep good spacing on the trellis and remove affected leaves.", "मांडवावर योग्य अंतर ठेवा व बाधित पाने काढा.") },
    { name: b("Red pumpkin beetle", "लाल भुंगेरे"), signs: b("Holes in seedling leaves.", "रोपांच्या पानांना छिद्रे."), prevention: prevent("Check seedlings daily and remove beetles by hand in the morning.", "रोज रोपे तपासा व सकाळी भुंगेरे हाताने वेचा.") },
  ],
  harvestSigns: b("Fruits are full-length, tender and the skin is soft; seeds inside are still soft.", "फळे पूर्ण लांबीची, कोवळी व साल मऊ; आतील बिया अजून मऊ."),
  postHarvest: b("Pick in cool hours, keep in shade, and pack straight fruits carefully so they do not break.", "थंड वेळेत तोडा, सावलीत ठेवा आणि सरळ फळे मोडणार नाहीत अशी काळजीपूर्वक भरा."),
  marketTips: b("Long, straight, tender fruits sell best. Demand is good in Konkan and city markets during the rainy season.", "लांब, सरळ, कोवळ्या फळांना चांगला दर. पावसाळ्यात कोकण व शहरी बाजारात चांगली मागणी असते."),
  varieties: [], // TODO: varieties — confirm with Dr. BSKKV Dapoli (Konkan snake gourd releases)
  source: "General practices from Dr. BSKKV Dapoli and ICAR-IIVR cucurbit vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
