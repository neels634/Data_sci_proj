import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "sesame",
  emoji: "🌱",
  name: b("Sesame", "तीळ"),
  aliases: ["sesame", "sesamum", "til", "teel", "teel seed", "gingelly", "तीळ", "तिळ", "तिल"],
  category: "oilseed",
  lifecycle: "seasonal",
  regions: ["north", "vidarbha", "marathwada"],
  majorDistricts: b("Jalgaon, Dhule, Nandurbar", "जळगाव, धुळे, नंदुरबार"),
  tier: 2,
  seasons: [
    { season: "kharif", label: b("Kharif", "खरीप"), sowingWindow: b("Late June–July", "जूनच्या शेवटी–जुलै"), sowingMonths: [6, 7], durationDays: [80, 95] },
    { season: "summer", label: b("Summer (irrigated)", "उन्हाळी (बागायती)"), sowingWindow: b("February", "फेब्रुवारी"), sowingMonths: [2], durationDays: [85, 95] },
  ],
  method: "direct",
  plantingMaterial: b("Seed (very small; mix with fine sand or sieved manure for even sowing)", "बियाणे (खूप बारीक; एकसारख्या पेरणीसाठी बारीक वाळू किंवा चाळलेल्या शेणखतात मिसळा)"),
  soil: b("Light to medium, well-drained soil. Sesame cannot stand waterlogging even for a day.", "हलकी ते मध्यम, पाण्याचा निचरा होणारी जमीन. तिळाला एक दिवसही साचलेले पाणी सहन होत नाही."),
  climate: b("Warm weather. Continuous heavy rain or cloudy, humid weather increases diseases; summer sesame has fewer diseases.", "उबदार हवामान. सततचा जोरदार पाऊस किंवा ढगाळ, दमट हवेत रोग वाढतात; उन्हाळी तिळात रोग कमी."),
  seedRate: b("About 1–1.5 kg seed per acre.", "एकरी साधारण 1–1.5 किलो बियाणे."),
  spacing: b("30–45 cm between rows and 10–15 cm between plants.", "ओळींत 30–45 सेंमी व रोपांत 10–15 सेंमी."),
  irrigation: b(
    "Kharif crop is rainfed; make drainage furrows so water does not stand. Summer crop needs irrigation every 8–10 days; flowering and capsule filling are critical.",
    "खरीप पीक पावसावर; पाणी साचू नये म्हणून चर काढा. उन्हाळी पिकाला 8–10 दिवसांनी पाणी लागते; फुलोरा व बोंडे भरणे महत्त्वाचे.",
  ),
  nutrientGuide: b("Use a soil test. Mix farmyard manure before sowing and give nitrogen in two parts. Ask your agriculture officer for amounts.", "माती परीक्षण करा. पेरणीपूर्वी शेणखत मिसळा व नत्र दोन हप्त्यांत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."),
  varieties: [
    { name: "AKT 101", note: b("Released by Dr. PDKV Akola", "डॉ. पंदेकृवि अकोलाचा वाण") },
  ], // TODO: varieties — confirm JLT varieties with MPKV (Jalgaon oilseed station)
  stages: [
    stage("emergence", ["Sowing & emergence", "पेरणी व उगवण"], 0, 15, ["Tiny seedlings come up in 4–6 days.", "4–6 दिवसांत बारीक रोपे वर येतात."], [
      t("ss-sow", 0, "sowing", ["Sow shallow", "उथळ पेरणी करा"], ["Mix seed with fine sand and sow only 2–3 cm deep.", "बियाणे बारीक वाळूत मिसळून फक्त 2–3 सेंमी खोल पेरा."]),
      t("ss-drain", 2, "other", ["Make drainage furrows", "निचऱ्यासाठी चर काढा"], ["In kharif, open furrows every few rows so rainwater drains.", "खरिपात काही ओळींनंतर चर काढा, म्हणजे पावसाचे पाणी निघून जाते."]),
      t("ss-thin", 12, "other", ["Thin plants", "विरळणी करा"], ["Keep one plant every 10–15 cm.", "दर 10–15 सेंमीवर एक रोप ठेवा."]),
    ], [["Seedlings dying in waterlogged patches", "पाणी साचलेल्या जागी रोपे मरणे"]]),
    stage("vegetative", ["Plant growth", "रोपांची वाढ"], 15, 35, ["The stem grows and branches come.", "खोड वाढते व फांद्या फुटतात."], [
      t("ss-weed", 15, "weeding", ["Weeding and hoeing", "खुरपणी व कोळपणी"], ["Keep the crop weed-free for the first 30 days.", "पहिले 30 दिवस पीक तणमुक्त ठेवा."], 12),
      t("ss-fert", 25, "fertiliser", ["Second nitrogen part", "नत्राचा दुसरा हप्ता"], ["As per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
      t("ss-obs1", 18, "observation", ["Check tips and leaves", "शेंडे व पाने तपासा"], ["Look for leaf webber (leaves tied together at the tip).", "शेंड्याची पाने जाळ्याने बांधणारी अळी पाहा."], 7),
    ], [["Leaf webber and capsule borer", "पाने गुंडाळणारी व बोंड पोखरणारी अळी"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 35, 60, ["White to pink flowers open up the stem.", "खोडावर पांढरी ते गुलाबी फुले येतात."], [
      t("ss-irr1", 35, "irrigation", ["Irrigate (summer)", "पाणी द्या (उन्हाळी)"], ["Summer crop: water every 8–10 days; do not stress at flowering.", "उन्हाळी पीक: 8–10 दिवसांनी पाणी; फुलोऱ्यात ताण पडू देऊ नका."], 9),
      t("ss-obs2", 36, "observation", ["Check flowers", "फुले तपासा"], ["Flowers turning into leafy green structures mean phyllody — pull out those plants.", "फुलांच्या जागी हिरवी पानांसारखी वाढ म्हणजे फायलोडी — अशी झाडे उपटा."], 7),
    ], [["Phyllody (leafy flowers)", "फायलोडी (फुलांची पाने होणे)"], ["Leaf spot and blight in humid weather", "दमट हवेत पानांवर ठिपके व करपा"]]),
    stage("capsule", ["Capsule filling", "बोंडे भरणे"], 60, 80, ["Capsules fill with seed and start to turn yellow.", "बोंडांत दाणे भरतात व ती पिवळी होऊ लागतात."], [
      t("ss-irr2", 60, "irrigation", ["Irrigate at capsule filling (summer)", "बोंडे भरताना पाणी (उन्हाळी)"], ["Give water if soil is dry.", "जमीन कोरडी असल्यास पाणी द्या."], 9),
      t("ss-obs3", 62, "observation", ["Check capsules", "बोंडे तपासा"], ["Look for capsule borer holes.", "बोंडांवर छिद्रे पाहा."], 7),
    ], [["Capsule borer", "बोंड पोखरणारी अळी"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 80, 95, ["Leaves fall, capsules turn yellow and must be cut before they burst.", "पाने गळतात, बोंडे पिवळी होतात; ती फुटण्यापूर्वी कापावी लागतात."], [
      t("ss-mat", 80, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Lower capsules yellow and leaves dropping → ready.", "खालची बोंडे पिवळी व पाने गळू लागली → तयार."]),
      t("ss-harv", 83, "harvest", ["Cut and stack upright", "कापून उभ्या पेंढ्या लावा"], ["Cut plants, tie in bundles and stand them upright on a clean sheet to dry; shake out seed after a few days.", "झाडे कापून पेंढ्या बांधा व स्वच्छ कापडावर उभ्या ठेवून वाळवा; काही दिवसांनी झटकून दाणे काढा."]),
    ], [["Seed loss if capsules burst in the field", "बोंडे शेतात फुटल्यास दाणे गळणे"]]),
  ],
  commonProblems: [
    {
      name: b("Leaf webber and capsule borer", "पाने गुंडाळणारी व बोंड पोखरणारी अळी"),
      signs: b("Top leaves are tied with silk; flowers and capsules have holes.", "शेंड्याची पाने जाळ्याने बांधलेली; फुले व बोंडांना छिद्रे."),
      prevention: prevent("Remove webbed tips early and keep the field clean.", "जाळी असलेले शेंडे लवकर खुडून नष्ट करा व शेत स्वच्छ ठेवा."),
    },
    {
      name: b("Phyllody", "फायलोडी"),
      signs: b("Flowers turn into green leafy growth; no capsules form. Spread by jassids.", "फुलांच्या जागी हिरवी पानांसारखी वाढ; बोंडे लागत नाहीत. तुडतुड्यांमुळे पसरतो."),
      prevention: prevent("Pull out and destroy affected plants early and control jassids.", "बाधित झाडे लवकर उपटून नष्ट करा व तुडतुड्यांवर नियंत्रण ठेवा."),
    },
    {
      name: b("Root and stem rot", "मूळ व खोड कुजणे"),
      signs: b("Plants wilt and dry; the stem base is black.", "झाडे मलूल होऊन वाळतात; खोडाचा तळ काळा पडतो."),
      prevention: prevent("Good drainage, seed treatment and crop rotation.", "पाण्याचा चांगला निचरा, बीजप्रक्रिया व फेरपालट."),
    },
  ],
  harvestSigns: b("Leaves turn yellow and fall, and most capsules turn yellow but have not yet burst.", "पाने पिवळी होऊन गळतात व बहुतेक बोंडे पिवळी होतात पण अजून फुटलेली नसतात."),
  postHarvest: b("Shake dried bundles over a clean sheet, clean the seed, dry it fully and store in tight bags.", "वाळलेल्या पेंढ्या स्वच्छ कापडावर झटका, दाणे स्वच्छ करा, पूर्ण वाळवा व घट्ट पिशव्यांत साठवा."),
  marketTips: b("Clean, bold, uniform seed (white or black as per local demand) gets the best rate. Demand rises before Makar Sankranti.", "स्वच्छ, टपोऱ्या व एकसारख्या (स्थानिक मागणीनुसार पांढरा किंवा काळा) तिळाला चांगला दर मिळतो. मकर संक्रांतीपूर्वी मागणी वाढते."),
  source: "General practices from MPKV Rahuri (Oilseeds Research Station, Jalgaon) and Dr. PDKV Akola sesame guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
