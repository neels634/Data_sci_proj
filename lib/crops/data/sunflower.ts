import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "sunflower",
  emoji: "🌻",
  name: b("Sunflower", "सूर्यफूल"),
  aliases: ["sunflower", "sun flower", "suryaphul", "suryafool", "suryaphool", "surajmukhi", "सूर्यफूल", "सुर्यफूल", "सूरजमुखी"],
  category: "oilseed",
  lifecycle: "seasonal",
  regions: ["marathwada", "western"],
  majorDistricts: b("Latur, Beed, Dharashiv, Solapur", "लातूर, बीड, धाराशिव, सोलापूर"),
  tier: 2,
  seasons: [
    { season: "kharif", label: b("Kharif", "खरीप"), sowingWindow: b("June–July", "जून–जुलै"), sowingMonths: [6, 7], durationDays: [85, 100] },
    { season: "rabi", label: b("Rabi", "रब्बी"), sowingWindow: b("Late September–October", "सप्टेंबरच्या शेवटी–ऑक्टोबर"), sowingMonths: [9, 10], durationDays: [90, 105] },
    { season: "summer", label: b("Summer (irrigated)", "उन्हाळी (बागायती)"), sowingWindow: b("January–February", "जानेवारी–फेब्रुवारी"), sowingMonths: [1, 2], durationDays: [90, 105] },
  ],
  method: "direct",
  plantingMaterial: b("Seed (hybrid seed must be bought fresh every season)", "बियाणे (संकरित बियाणे दर हंगामाला नवीन घ्यावे)"),
  soil: b("Medium to deep, well-drained black soil. Avoid waterlogged fields.", "मध्यम ते भारी, पाण्याचा निचरा होणारी काळी जमीन. पाणी साचणारे शेत टाळा."),
  climate: b("Grows in all three seasons. Heavy rain or cloudy weather at flowering lowers seed set.", "तिन्ही हंगामांत येते. फुलोऱ्यात जोरदार पाऊस किंवा ढगाळ हवा असल्यास दाणे कमी भरतात."),
  seedRate: b("About 2–3 kg seed per acre for hybrids; a little more for varieties.", "संकरित वाणासाठी एकरी साधारण 2–3 किलो; सरळ वाणासाठी थोडे जास्त."),
  spacing: b("60 cm between rows and 30 cm between plants on medium soil; 45 × 30 cm on lighter soil.", "मध्यम जमिनीत ओळींत 60 सेंमी व रोपांत 30 सेंमी; हलक्या जमिनीत 45 × 30 सेंमी."),
  irrigation: b(
    "Kharif crop is rainfed. In rabi and summer, irrigate at bud formation, flowering and seed filling — these stages must not face water stress.",
    "खरीप पीक पावसावर. रब्बी व उन्हाळी हंगामात कळी येणे, फुलोरा व दाणे भरणे या अवस्थांत पाणी द्या — या वेळी पाण्याचा ताण पडू देऊ नका.",
  ),
  nutrientGuide: b(
    "Use a soil test. Mix farmyard manure before sowing; give nitrogen in two parts. Sulphur helps oil content. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. पेरणीपूर्वी शेणखत मिसळा; नत्र दोन हप्त्यांत द्या. गंधकामुळे तेलाचे प्रमाण वाढते. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Morden", note: b("Old, early, short variety still grown in dry areas", "कोरडवाहू भागात अजूनही घेतला जाणारा जुना, लवकर येणारा, बुटका वाण") },
  ], // TODO: varieties — confirm current hybrids and LSF varieties with VNMKV Parbhani (Latur station)
  stages: [
    stage("emergence", ["Sowing & emergence", "पेरणी व उगवण"], 0, 15, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("sf-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow treated seed 4–5 cm deep at the right spacing.", "बीजप्रक्रिया केलेले बियाणे योग्य अंतरावर 4–5 सेंमी खोल पेरा."]),
      t("sf-thin", 12, "other", ["Thin to one plant per spot", "एका ठिकाणी एकच रोप ठेवा"], ["Keep the healthiest seedling and pull the rest.", "सर्वात निरोगी रोप ठेवून बाकीची उपटा."]),
    ], [["Birds picking seed and seedlings", "पक्ष्यांकडून बी व रोपे टिपली जाणे"]]),
    stage("vegetative", ["Leaf growth", "पानांची वाढ"], 15, 40, ["The stem grows tall and leaves increase.", "खोड उंच वाढते व पाने वाढतात."], [
      t("sf-weed", 18, "weeding", ["Weeding and hoeing", "खुरपणी व कोळपणी"], ["Do 2 hoeings and one hand weeding in the first month.", "पहिल्या महिन्यात 2 कोळपण्या व एक खुरपणी करा."], 15),
      t("sf-fert", 30, "fertiliser", ["Second nitrogen part and earthing up", "नत्राचा दुसरा हप्ता व भर"], ["Give the next part as per soil test and earth up so plants do not fall.", "माती परीक्षणानुसार पुढचा हप्ता द्या व झाडे लोळू नयेत म्हणून भर द्या."]),
      t("sf-obs1", 20, "observation", ["Check leaves", "पाने तपासा"], ["Look for jassids, whitefly and leaf-eating caterpillars.", "तुडतुडे, पांढरी माशी व पाने खाणारी अळी पाहा."], 7),
    ], [["Jassids", "तुडतुडे"], ["Necrosis virus (spread by thrips)", "नेक्रोसिस विषाणू (फुलकिड्यांमुळे पसरतो)"]]),
    stage("flowering", ["Bud & flowering", "कळी व फुलोरा"], 40, 70, ["A bud forms and opens into the flower head; bees pollinate it.", "कळी तयार होऊन फुलात रूपांतर होते; मधमाश्या परागीभवन करतात."], [
      t("sf-irr1", 40, "irrigation", ["Irrigate at bud and flowering", "कळी व फुलोऱ्यात पाणी द्या"], ["The most important waterings; avoid stress.", "सर्वात महत्त्वाचे पाणी; ताण पडू देऊ नका."], 10),
      t("sf-pollinate", 55, "other", ["Help pollination", "परागीभवनास मदत करा"], ["Gently rub flower heads with a soft cloth in the morning for a week, or keep bee boxes nearby. Do not spray when bees are active.", "आठवडाभर सकाळी फुलांवरून मऊ कापड हलके फिरवा किंवा जवळ मधमाशांच्या पेट्या ठेवा. मधमाश्या फिरत असताना फवारणी करू नका."]),
      t("sf-obs2", 45, "observation", ["Check flower heads", "फुले तपासा"], ["Look for head borer caterpillars and leaf spots.", "फुलात शिरणारी घाटेअळी व पानांवरील ठिपके पाहा."], 7),
    ], [["Head borer", "घाटेअळी (फुलातील अळी)"], ["Alternaria leaf spot", "पानांवरील करपा"]]),
    stage("seed-filling", ["Seed filling", "दाणे भरणे"], 70, 90, ["Seeds fill and the back of the head turns yellow.", "दाणे भरतात व फुलाची मागची बाजू पिवळी होते."], [
      t("sf-irr2", 70, "irrigation", ["Irrigate at seed filling", "दाणे भरताना पाणी द्या"], ["Give water if soil is dry; avoid it in strong wind as plants may fall.", "जमीन कोरडी असल्यास पाणी द्या; जोराच्या वाऱ्यात देऊ नका, झाडे लोळू शकतात."], 10),
      t("sf-bird", 72, "other", ["Guard from birds", "पक्ष्यांपासून राखण करा"], ["Parrots damage heads; guard in the mornings and evenings.", "पोपट फुलांचे नुकसान करतात; सकाळ-संध्याकाळ राखण करा."]),
    ], [["Parrot damage", "पोपटांचे नुकसान"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 90, 105, ["Heads dry and seeds harden.", "फुले वाळतात व दाणे टणक होतात."], [
      t("sf-mat", 90, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Back of the head turns lemon-yellow to brown and bracts dry.", "फुलाची मागची बाजू लिंबासारखी पिवळी ते तपकिरी व पाकळ्यांखालची पाने वाळलेली."]),
      t("sf-harv", 93, "harvest", ["Cut heads and thresh", "फुले कापून मळणी करा"], ["Cut heads, dry them in the sun for a few days, then thresh.", "फुले कापा, काही दिवस उन्हात वाळवा व मग मळणी करा."]),
    ], [["Seed mould in rain", "पावसात दाण्यांवर बुरशी"]]),
  ],
  commonProblems: [
    {
      name: b("Necrosis virus", "नेक्रोसिस (विषाणूजन्य रोग)"),
      signs: b("Leaves get dead patches, the stem and head bend and dry; spread by thrips.", "पानांवर करपलेले चट्टे, खोड व फूल वाकून वाळते; फुलकिड्यांमुळे पसरतो."),
      prevention: prevent("Remove weeds like parthenium around the field, pull out sick plants and keep a watch on thrips.", "शेताभोवतीचे गाजर गवतासारखे तण काढा, रोगट झाडे उपटा व फुलकिड्यांवर लक्ष ठेवा."),
    },
    {
      name: b("Head borer", "घाटेअळी"),
      signs: b("Caterpillars feed inside the flower head; seeds are eaten and webbed.", "अळ्या फुलात शिरून दाणे खातात व जाळे करतात."),
      prevention: prevent("Use pheromone traps, bird perches and hand-collect caterpillars.", "कामगंध सापळे, पक्षी थांबे लावा व अळ्या हाताने वेचा."),
    },
    {
      name: b("Alternaria leaf blight", "पानांवरील करपा (अल्टरनेरिया)"),
      signs: b("Dark brown spots with rings on leaves; leaves dry from the bottom.", "पानांवर वलये असलेले गडद तपकिरी ठिपके; खालची पाने वाळतात."),
      prevention: prevent("Sow on time, rotate crops and remove crop debris.", "वेळेवर पेरणी, फेरपालट आणि पिकाचे अवशेष नष्ट करा."),
    },
  ],
  harvestSigns: b("Back of the head turns yellow to brown, bracts dry and seeds are hard and filled.", "फुलाची मागची बाजू पिवळी ते तपकिरी, पाकळ्यांखालची पाने वाळलेली व दाणे टणक व भरलेले."),
  postHarvest: b("Dry seed well, clean it and store in dry bags. Wet seed loses oil quality quickly.", "दाणे चांगले वाळवा, स्वच्छ करा व कोरड्या पोत्यांत साठवा. ओल्या दाण्यांचा तेलाचा दर्जा लवकर खराब होतो."),
  marketTips: b("Clean, well-filled, dry seed sells better to oil mills. Check the support price.", "स्वच्छ, भरलेल्या, कोरड्या दाण्यांना तेल गिरण्यांकडून चांगला दर मिळतो. हमीभाव तपासा."),
  source: "General practices from VNMKV Parbhani (Oilseeds Research Station, Latur) and MPKV Rahuri sunflower guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
