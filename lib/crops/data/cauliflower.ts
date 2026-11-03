import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "cauliflower",
  emoji: "🥦",
  name: b("Cauliflower", "फुलकोबी"),
  aliases: ["cauliflower", "fulkobi", "phulkobi", "फुलकोबी", "फूलकोबी", "phool gobhi", "phool gobi", "फूलगोभी"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada"],
  majorDistricts: b("Pune, Nashik, Satara", "पुणे, नाशिक, सातारा"),
  tier: 2,
  seasons: [
    { season: "kharif", label: b("Early (kharif)", "लवकर (खरीप)"), sowingWindow: b("Nursery in May–June; use early varieties", "रोपवाटिका मे–जून; लवकर येणारे वाण वापरा"), sowingMonths: [5, 6], durationDays: [90, 110] },
    { season: "rabi", label: b("Mid / late (rabi)", "मध्यम / उशिरा (रब्बी)"), sowingWindow: b("Nursery in August–October; use mid or late varieties", "रोपवाटिका ऑगस्ट–ऑक्टोबर; मध्यम किंवा उशिरा येणारे वाण वापरा"), sowingMonths: [8, 9, 10], durationDays: [110, 130] },
  ],
  method: "transplant",
  plantingMaterial: b("Seed, raised as seedlings in a nursery", "बियाणे; रोपवाटिकेत रोपे तयार करून"),
  nurseryDays: 28,
  soil: b("Well-drained loamy or medium black soil with plenty of organic matter.", "भरपूर सेंद्रिय पदार्थ असलेली, पाण्याचा निचरा होणारी पोयट्याची किंवा मध्यम काळी जमीन."),
  climate: b("Each variety needs its own season: early varieties tolerate warmth, late ones need cold. A wrong-season variety gives small, loose or leafy curds.", "प्रत्येक वाणाला ठराविक हंगाम लागतो: लवकरचे वाण उष्णता सहन करतात, उशिराच्यांना थंडी लागते. चुकीच्या हंगामातील वाणाचा गड्डा लहान, सैल किंवा पानेदार होतो."),
  seedRate: b("About 150–200 g seed per acre for the nursery (hybrids need less).", "रोपवाटिकेसाठी एकरी साधारण 150–200 ग्रॅम बियाणे (संकरित वाणाला कमी)."),
  spacing: b("Early: 45 × 45 cm. Mid and late: 60 × 45–60 cm.", "लवकर: 45 × 45 सेंमी. मध्यम व उशिरा: 60 × 45–60 सेंमी."),
  irrigation: b(
    "Water right after transplanting, then every 7–10 days. Never let the crop face water stress during curd formation. Kharif crop needs water only in dry spells; drain extra rainwater.",
    "पुनर्लागवडीनंतर लगेच पाणी, नंतर दर 7–10 दिवसांनी. गड्डा धरताना पाण्याचा ताण अजिबात पडू देऊ नका. खरीप पिकाला फक्त पावसाच्या खंडात पाणी; जास्तीचे पावसाचे पाणी काढा.",
  ),
  nutrientGuide: b(
    "Use a soil test. Mix well-rotted farmyard manure before planting. Give nitrogen in 2–3 parts. Cauliflower also needs micronutrients like boron and molybdenum — ask your agriculture officer whether your soil needs them and how much.",
    "माती परीक्षण करा. लागवडीपूर्वी कुजलेले शेणखत मिसळा. नत्र 2–3 हप्त्यांत द्या. फुलकोबीला बोरॉन व मॉलिब्डेनम यांसारखी सूक्ष्म अन्नद्रव्येही लागतात — तुमच्या जमिनीत त्यांची गरज आहे का व किती, ते कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("nursery", ["Nursery", "रोपवाटिका"], 0, 28, ["Seedlings grow in raised beds or trays.", "गादीवाफ्यावर किंवा ट्रेमध्ये रोपे वाढतात."], [
      t("cf-bed", 0, "sowing", ["Sow the nursery", "रोपवाटिका पेरा"], ["Sow thinly in lines on raised beds or in trays.", "गादीवाफ्यावर ओळीत विरळ किंवा ट्रेमध्ये पेरा."]),
      t("cf-nwater", 1, "irrigation", ["Water lightly", "हलके पाणी"], ["Keep moist, not soggy.", "ओलसर ठेवा, चिखल नको."], 3),
    ], [["Damping off", "रोपे कोलमडणे"]]),
    stage("establishment", ["Transplanting & establishment", "पुनर्लागवड व स्थिरावणे"], 28, 40, ["Seedlings are planted and take root.", "रोपे शेतात लावली जातात व मूळ धरतात."], [
      t("cf-tp", 28, "transplanting", ["Transplant", "पुनर्लागवड करा"], ["Plant 4–5 week old seedlings in the evening and water right after. Older seedlings form early, small curds.", "4–5 आठवड्यांची रोपे संध्याकाळी लावा व लगेच पाणी द्या. जुनी रोपे लवकर लहान गड्डा धरतात."]),
      t("cf-gap", 34, "other", ["Fill the gaps", "खाडे भरा"], ["Replace dead seedlings.", "मेलेली रोपे बदला."]),
    ], [["Cutworms", "रोपे कापणाऱ्या अळ्या"]]),
    stage("vegetative", ["Leaf growth", "पानांची वाढ"], 40, 65, ["Big leaves grow. A strong leaf frame is needed for a good curd.", "मोठी पाने वाढतात. चांगल्या गड्ड्यासाठी पानांचा मजबूत घेर लागतो."], [
      t("cf-irr", 40, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 7–10 days.", "दर 7–10 दिवसांनी पाणी द्या."], 8),
      t("cf-weed", 45, "weeding", ["Weeding, top dressing and earthing up", "खुरपणी, वरखत व भर"], ["Weed, give the next nitrogen part as per soil test and pull soil to plants.", "खुरपणी करा, माती परीक्षणानुसार नत्राचा पुढचा हप्ता द्या व रोपांना भर लावा."]),
      t("cf-obs1", 42, "observation", ["Check leaves", "पाने तपासा"], ["Look for small green caterpillars (diamondback moth) and aphids.", "लहान हिरव्या अळ्या (डायमंड बॅक मॉथ) व मावा पाहा."], 7),
    ], [["Diamondback moth", "चौकोनी ठिपक्यांचा पतंग"], ["Whiptail: narrow, strap-like leaves", "चाबकासारखी अरुंद पाने (व्हिपटेल)"]]),
    stage("curd-formation", ["Curd formation", "गड्डा (फूल) धरणे"], 65, 110, ["A white curd forms in the centre and grows.", "मधोमध पांढरा गड्डा तयार होऊन वाढतो."], [
      t("cf-irr2", 65, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["No water stress now.", "आता पाण्याचा ताण नको."], 7),
      t("cf-blanch", 75, "other", ["Cover the curd (blanching)", "गड्डा झाका"], ["When the curd is egg-sized, tie the inner leaves over it so the sun doesn't turn it yellow.", "गड्डा अंड्याएवढा झाल्यावर आतील पाने त्यावर बांधा, म्हणजे उन्हाने तो पिवळा पडत नाही."]),
      t("cf-obs2", 70, "observation", ["Check curds", "गड्डे तपासा"], ["Look for brown patches, rot and caterpillars in curds.", "गड्ड्यांवर तपकिरी डाग, कूज व अळ्या पाहा."], 7),
    ], [["Brown, hollow curds (boron shortage)", "तपकिरी, पोकळ गड्डे (बोरॉनची कमतरता)"], ["Loose, leafy or yellow curds", "सैल, पानेदार किंवा पिवळे गड्डे"]]),
    stage("harvest", ["Harvest", "काढणी"], 110, 130, ["Compact white curds are cut in a few rounds.", "घट्ट पांढरे गड्डे काही फेऱ्यांत कापले जातात."], [
      t("cf-cut", 110, "harvest", ["Cut ready curds", "तयार गड्डे कापा"], ["Cut while the curd is compact and white, with a few leaves around it.", "गड्डा घट्ट व पांढरा असतानाच भोवतीच्या काही पानांसह कापा."], 4),
      t("cf-grade", 111, "other", ["Grade and pack", "प्रतवारी करून भरा"], ["Sort by size and whiteness; remove damaged curds.", "आकार व पांढरेपणानुसार वेगळे करा; खराब गड्डे काढा."], 4),
    ], [["Curds turning loose and grainy if harvest is late", "उशिरा काढणीत गड्डे सैल व दाणेदार होणे"]]),
  ],
  commonProblems: [
    { name: b("Diamondback moth", "चौकोनी ठिपक्यांचा पतंग (डायमंड बॅक मॉथ)"), signs: b("Small green caterpillars; leaves full of holes; caterpillars in curds.", "लहान हिरव्या अळ्या; पानांवर भरपूर छिद्रे; गड्ड्यांत अळ्या."), prevention: prevent("Grow mustard rows around the field as a trap crop, use pheromone traps and check leaves weekly.", "शेताभोवती मोहरीच्या ओळी सापळा पीक म्हणून लावा, कामगंध सापळे लावा आणि दर आठवड्याला पाने तपासा.") },
    { name: b("Black rot", "काळी कूज"), signs: b("Yellow V-shaped patches from leaf edges with black veins.", "पानांच्या कडेपासून V आकाराचे पिवळे चट्टे व काळ्या शिरा."), prevention: prevent("Use healthy seed and seedlings, rotate crops and remove affected leaves.", "निरोगी बियाणे व रोपे वापरा, पिकांची फेरपालट करा आणि बाधित पाने काढा.") },
    { name: b("Browning and hollow stem", "गड्डा तपकिरी होणे व पोकळ दांडा"), signs: b("Brown, water-soaked patches on curds and a hollow stem — usually a boron shortage.", "गड्ड्यांवर तपकिरी, पाणथळ डाग व दांडा पोकळ — बहुतेक बोरॉनच्या कमतरतेमुळे."), prevention: b("Get a soil test and ask your agriculture officer about micronutrients before planting.", "माती परीक्षण करा आणि लागवडीपूर्वी सूक्ष्म अन्नद्रव्यांबद्दल कृषी अधिकाऱ्यांना विचारा.") },
  ],
  harvestSigns: b("Curds are full-sized, compact, white and smooth.", "गड्डे पूर्ण आकाराचे, घट्ट, पांढरे व गुळगुळीत."),
  postHarvest: b("Cut in cool hours, keep some leaves around the curd for protection, keep in shade, and pack in crates.", "थंड वेळेत कापा, संरक्षणासाठी गड्ड्याभोवती काही पाने ठेवा, सावलीत ठेवा आणि क्रेटमध्ये भरा."),
  marketTips: b("White, compact curds get the best price. Early (kharif) cauliflower often sells higher because supply is low. Send to market the same day.", "पांढऱ्या, घट्ट गड्ड्यांना सर्वात चांगला दर मिळतो. लवकरच्या (खरीप) फुलकोबीला आवक कमी असल्याने बहुतेक वेळा जास्त दर मिळतो. त्याच दिवशी बाजारात पाठवा."),
  varieties: [
    { name: "Pusa Deepali", note: b("Early variety for warmer months (ICAR-IARI)", "उबदार महिन्यांसाठी लवकरचा वाण (ICAR-IARI)") },
    { name: "Pusa Snowball 1", note: b("Late variety for cold winter (ICAR-IARI)", "थंड हिवाळ्यासाठी उशिराचा वाण (ICAR-IARI)") },
  ],
  source: "General practices from MPKV Rahuri, ICAR-IARI and ICAR-IIVR cauliflower guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
