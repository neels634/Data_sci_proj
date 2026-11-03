import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Marigold: multi-pick flower; the money is in timing the flush for Ganesh festival, Dasara and Diwali. */
const crop: SeasonalCrop = {
  id: "marigold",
  emoji: "🌼",
  name: b("Marigold", "झेंडू"),
  aliases: ["marigold", "marigold flower", "zendu", "zhendu", "jhendu", "genda", "gainda", "झेंडू", "झेंडु", "गेंदा"],
  category: "flower",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada", "vidarbha"],
  majorDistricts: b("Pune, Satara, Sangli, Ahilyanagar, Nashik", "पुणे, सातारा, सांगली, अहिल्यानगर, नाशिक"),
  tier: 1,
  seasons: [
    {
      season: "kharif",
      label: b("Kharif (Ganesh festival)", "खरीप (गणेशोत्सव)"),
      sowingWindow: b("Nursery in June; transplant in July for flowers from late August to September", "रोपवाटिका जूनमध्ये; जुलैमध्ये पुनर्लागवड केल्यास ऑगस्टअखेर ते सप्टेंबर फुले"),
      sowingMonths: [6],
      durationDays: [120, 140],
    },
    {
      season: "kharif",
      label: b("Festival crop (Dasara–Diwali)", "सणांचे पीक (दसरा–दिवाळी)"),
      sowingWindow: b(
        "Time it backwards from the festival: transplant about 2–2.5 months (60–75 days) before Dasara or Diwali, so sow the nursery about 3 months before. That usually means nursery in July for Dasara and in late July–August for Diwali. Check the festival dates for the year.",
        "सणापासून मागे मोजून नियोजन करा: दसरा किंवा दिवाळीच्या साधारण 2–2.5 महिने (60–75 दिवस) आधी पुनर्लागवड करा, म्हणजे रोपवाटिका साधारण 3 महिने आधी टाका. साधारणपणे दसऱ्यासाठी जुलैमध्ये व दिवाळीसाठी जुलैअखेर–ऑगस्टमध्ये रोपवाटिका. त्या वर्षीच्या सणांच्या तारखा पाहून नियोजन करा.",
      ),
      sowingMonths: [7, 8],
      durationDays: [120, 140],
    },
    {
      season: "rabi",
      label: b("Rabi (winter)", "रब्बी (हिवाळी)"),
      sowingWindow: b("Nursery in September–October; flowers December–February for weddings and Sankranti", "रोपवाटिका सप्टेंबर–ऑक्टोबर; लग्नसराई व संक्रांतीसाठी डिसेंबर–फेब्रुवारी फुले"),
      sowingMonths: [9, 10],
      durationDays: [130, 150],
    },
    {
      season: "summer",
      label: b("Summer", "उन्हाळी"),
      sowingWindow: b("Nursery in January–February with assured irrigation; flowers April–May", "खात्रीचे पाणी असल्यास रोपवाटिका जानेवारी–फेब्रुवारी; एप्रिल–मे फुले"),
      sowingMonths: [1, 2],
      durationDays: [110, 130],
    },
  ],
  method: "transplant",
  plantingMaterial: b("Seed (open-pollinated or hybrid), raised as seedlings in a nursery", "बियाणे (सरळ किंवा संकरित), रोपवाटिकेत रोपे तयार करून"),
  nurseryDays: 25,
  soil: b(
    "Most well-drained soils with good organic matter; medium black or loamy soil is best. Avoid fields where water stands.",
    "सेंद्रिय पदार्थ असलेली, निचरा होणारी बहुतेक जमीन चालते; मध्यम काळी किंवा पोयट्याची जमीन उत्तम. पाणी साचणारे शेत टाळा.",
  ),
  climate: b(
    "Mild weather gives the best flowers. Heavy continuous rain spoils open flowers and spreads disease; very hot summer reduces flower size.",
    "सौम्य हवामानात सर्वोत्तम फुले येतात. सततच्या जोरदार पावसात उमललेली फुले खराब होतात व रोग वाढतात; कडक उन्हाळ्यात फुलांचा आकार कमी होतो.",
  ),
  seedRate: b("About 400–600 g seed per acre for open-pollinated types; less for hybrids — follow the packet.", "सरळ वाणांसाठी एकरी साधारण 400–600 ग्रॅम बियाणे; संकरित वाणांसाठी कमी — पाकिटावरील सूचना पाहा."),
  spacing: b("African (tall) marigold 60 cm × 45 cm; French (dwarf) marigold 45 cm × 30 cm.", "आफ्रिकन (उंच) झेंडू 60 सेंमी × 45 सेंमी; फ्रेंच (बुटका) झेंडू 45 सेंमी × 30 सेंमी."),
  irrigation: b(
    "Water right after transplanting and then every 6–8 days in winter, 4–5 days in summer. Kharif crops need water only in dry spells, but drains are a must. Keep moisture steady during flowering.",
    "पुनर्लागवडीनंतर लगेच पाणी, नंतर हिवाळ्यात दर 6–8 दिवसांनी व उन्हाळ्यात दर 4–5 दिवसांनी. खरीपात फक्त पावसाच्या खंडात पाणी, पण चर आवश्यक. फुलोऱ्यात ओलावा सारखा ठेवा.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure or compost before transplanting. Give part of the nitrogen at planting and the rest at pinching, about a month later. Too much nitrogen gives leaves, not flowers. Base it on a soil test; ask your agriculture officer for amounts.",
    "पुनर्लागवडीपूर्वी चांगले कुजलेले शेणखत किंवा कंपोस्ट मिसळा. नत्राचा काही भाग लागवडीवेळी व उरलेला साधारण महिन्याने शेंडा खुडताना द्या. जास्त नत्राने पाने वाढतात, फुले कमी येतात. माती परीक्षणावर आधारित खत द्या; प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("nursery", ["Nursery", "रोपवाटिका"], 0, 25, ["Seeds sprout on raised beds and grow into seedlings with 3–4 leaves.", "गादीवाफ्यावर बी उगवून 3–4 पानांची रोपे तयार होतात."], [
      t("mg-bed", 0, "sowing", ["Prepare beds and sow", "वाफे तयार करून पेरणी करा"], ["Make raised beds, mix compost, sow seed thinly in lines and cover lightly with fine soil.", "गादीवाफे करा, कंपोस्ट मिसळा, ओळीत विरळ बी पेरा व बारीक मातीने हलके झाका."]),
      t("mg-nwater", 1, "irrigation", ["Water the nursery lightly", "रोपवाटिकेला हलके पाणी द्या"], ["Water with a can; don't keep beds soggy or seedlings rot.", "झारीने पाणी द्या; वाफे सतत ओले ठेवू नका, नाहीतर रोपे कुजतात."], 2),
      t("mg-nweed", 15, "weeding", ["Weed the nursery", "रोपवाटिकेतील तण काढा"], ["Pull weeds gently by hand.", "हाताने हलकेच तण काढा."]),
    ], [["Damping off: seedlings fall over at the base", "रोपे कोलमडणे: रोपे बुंध्याजवळून पडतात"]]),
    stage("transplanting", ["Transplanting", "पुनर्लागवड"], 25, 30, ["3–4 week old seedlings are moved to the main field. For a festival crop this is the key date — about 2–2.5 months before the festival.", "3–4 आठवड्यांची रोपे मुख्य शेतात लावली जातात. सणाच्या पिकासाठी हीच महत्त्वाची तारीख — सणाच्या साधारण 2–2.5 महिने आधी."], [
      t("mg-field", 25, "other", ["Prepare the field", "शेत तयार करा"], ["Plough, mix manure and make ridges and furrows or beds with drains.", "नांगरट करा, शेणखत मिसळा आणि सरी-वरंबे किंवा चरांसह वाफे करा."]),
      t("mg-tp", 26, "transplanting", ["Transplant in the evening", "संध्याकाळी पुनर्लागवड करा"], ["Plant at the spacing for your type and water immediately.", "वाणाच्या प्रकारानुसार अंतरावर लावा व लगेच पाणी द्या."]),
    ], [["Seedlings wilting in hot sun after planting", "लागवडीनंतर उन्हात रोपे मलूल होणे"]]),
    stage("vegetative", ["Growth and pinching", "वाढ व शेंडा खुडणे"], 30, 55, ["Plants grow branches. Pinching the top makes more branches and more flowers.", "झाडांना फांद्या फुटतात. शेंडा खुडल्यास जास्त फांद्या व जास्त फुले येतात."], [
      t("mg-gap", 32, "other", ["Fill gaps", "खाडे भरा"], ["Replant dead seedlings within a week so the crop flowers together.", "पीक एकत्र फुलावर यावे म्हणून आठवड्याभरात मेलेल्या रोपांच्या जागी नवी रोपे लावा."]),
      t("mg-irr1", 31, "irrigation", ["Irrigate", "पाणी द्या"], ["Water when the top soil is dry; avoid waterlogging.", "वरची माती कोरडी झाल्यावर पाणी द्या; पाणी साचू देऊ नका."], 7),
      t("mg-pinch", 40, "other", ["Pinch the growing tip", "शेंडा खुडा"], ["About 30–40 days after transplanting, nip off the top of tall types to get more side branches.", "पुनर्लागवडीनंतर साधारण 30–40 दिवसांनी उंच वाणांचा शेंडा खुडा, म्हणजे बाजूच्या फांद्या जास्त येतात."]),
      t("mg-fert", 41, "fertiliser", ["Second nitrogen part and earthing up", "नत्राचा दुसरा हप्ता व भर देणे"], ["Give the rest of the nitrogen and push soil to the plant base for support.", "उरलेले नत्र द्या आणि आधारासाठी झाडाच्या बुंध्याला माती लावा."]),
      t("mg-weed", 35, "weeding", ["Weeding", "खुरपणी"], ["Keep the field clean for the first 6 weeks.", "पहिले 6 आठवडे शेत स्वच्छ ठेवा."], 15),
    ], [["Leaf spot in humid weather", "दमट हवामानात पानांवर ठिपके"], ["Collar rot in wet soil", "ओल्या जमिनीत बुंधा कुजणे"]]),
    stage("budding", ["Bud formation", "कळी येणे"], 55, 75, ["Flower buds form at branch tips.", "फांद्यांच्या टोकांवर कळ्या येतात."], [
      t("mg-irr2", 55, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Do not let plants wilt now — buds drop.", "आता झाडे मलूल होऊ देऊ नका — कळ्या गळतात."], 6),
      t("mg-obs1", 56, "observation", ["Check buds and leaves", "कळ्या व पाने तपासा"], ["Look for mites (bronzed leaves), thrips and bud borer holes.", "कोळी (तांबूस पाने), फुलकिडे व कळीतील छिद्रे पाहा."], 7),
      t("mg-stake", 60, "other", ["Support tall plants", "उंच झाडांना आधार द्या"], ["Earth up again or tie plants in windy fields so they do not fall.", "वाऱ्याच्या शेतात झाडे पडू नयेत म्हणून पुन्हा भर द्या किंवा बांधा."]),
    ], [["Red spider mite", "लाल कोळी"], ["Bud borer", "कळी पोखरणारी अळी"]]),
    stage("flowering", ["Flowering and picking", "फुलोरा व तोडणी"], 75, 150, ["Flowers open in flushes and are picked every 3–5 days for 6–10 weeks.", "फुले बहराने उमलतात व 6–10 आठवडे दर 3–5 दिवसांनी तोडली जातात."], [
      t("mg-pick", 75, "harvest", ["Pick open flowers", "उमललेली फुले तोडा"], ["Pick fully open flowers in the cool morning or evening; regular picking brings more flowers.", "पूर्ण उमललेली फुले सकाळी किंवा संध्याकाळी थंड वेळेत तोडा; नियमित तोडणीने जास्त फुले येतात."], 4),
      t("mg-irr3", 76, "irrigation", ["Irrigate", "पाणी द्या"], ["Light, regular water after each picking.", "प्रत्येक तोडणीनंतर हलके, नियमित पाणी."], 6),
      t("mg-obs2", 80, "observation", ["Check flowers", "फुले तपासा"], ["Remove flowers with grey mould or rot and look for borer damage.", "करडी बुरशी किंवा कूज असलेली फुले काढा व अळीचे नुकसान पाहा."], 7),
      t("mg-fest", 78, "other", ["Plan festival sales", "सणाची विक्री नियोजित करा"], ["Talk to traders a week before Dasara or Diwali and plan the biggest picking for 1–2 days before the festival.", "दसरा किंवा दिवाळीच्या आठवडाभर आधी व्यापाऱ्यांशी बोला आणि सर्वात मोठी तोडणी सणाच्या 1–2 दिवस आधी ठेवा."]),
    ], [["Flower rot in rain", "पावसात फुले कुजणे"], ["Thrips and mites", "फुलकिडे व कोळी"]]),
  ],
  flushes: {
    everyDays: 4,
    count: 15,
    note: b(
      "Pick every 3–5 days once flowers open; a healthy crop gives 12–18 pickings. Bring the peak picking to 1–2 days before Dasara or Diwali, when rates are highest.",
      "फुले उमलू लागल्यावर दर 3–5 दिवसांनी तोडणी करा; निरोगी पिकात 12–18 तोडण्या होतात. दर सर्वाधिक असतात तेव्हा, दसरा किंवा दिवाळीच्या 1–2 दिवस आधी, सर्वात मोठी तोडणी येईल असे नियोजन करा.",
    ),
  },
  varieties: [
    { name: "Pusa Narangi Gainda", note: b("Orange African marigold from ICAR-IARI, New Delhi", "ICAR-भारतीय कृषी संशोधन संस्था, नवी दिल्लीचा नारिंगी आफ्रिकन झेंडू") },
    { name: "Pusa Basanti Gainda", note: b("Yellow African marigold from ICAR-IARI, New Delhi", "ICAR-भारतीय कृषी संशोधन संस्था, नवी दिल्लीचा पिवळा आफ्रिकन झेंडू") },
    // TODO: varieties — confirm Maharashtra-recommended marigold varieties with MPKV Rahuri / ICAR-DFR Pune
  ],
  commonProblems: [
    {
      name: b("Red spider mite", "लाल कोळी"),
      signs: b("Leaves turn dull, bronzed and dry, with fine webs underneath; common in hot, dry weather.", "पाने निस्तेज, तांबूस होऊन सुकतात, खाली बारीक जाळी; उष्ण कोरड्या हवेत जास्त."),
      prevention: prevent("Check leaf undersides weekly, keep the crop well watered and remove badly affected plants.", "दर आठवड्याला पानांच्या खालची बाजू तपासा, पिकाला पुरेसे पाणी द्या आणि जास्त बाधित झाडे काढा."),
    },
    {
      name: b("Bud and flower borer", "कळी व फूल पोखरणारी अळी"),
      signs: b("Holes in buds and flowers; caterpillars inside eat the petals.", "कळ्या व फुलांना छिद्रे; आतल्या अळ्या पाकळ्या खातात."),
      prevention: prevent("Pick and destroy damaged buds, use pheromone or light traps, and keep the field weed-free.", "बाधित कळ्या तोडून नष्ट करा, कामगंध किंवा प्रकाश सापळे लावा आणि शेत तणमुक्त ठेवा."),
    },
    {
      name: b("Collar rot and wilt", "बुंधा कूज व मर"),
      signs: b("Plants wilt and the stem base turns dark and soft, mostly in wet, poorly drained soil.", "झाडे मलूल होतात व बुंधा काळा व मऊ पडतो, मुख्यतः ओल्या, निचरा नसलेल्या जमिनीत."),
      prevention: prevent("Use raised beds or ridges with drains, avoid over-watering, rotate crops and remove wilted plants.", "चरांसह गादीवाफे किंवा सरी-वरंबे वापरा, जास्त पाणी टाळा, पिकांची फेरपालट करा आणि मर लागलेली झाडे काढा."),
    },
    {
      name: b("Leaf spot and flower blight", "पानांवरील ठिपके व फुलांचा करपा"),
      signs: b("Brown spots on leaves; flowers turn brown and rot, especially in rain and dew.", "पानांवर तपकिरी ठिपके; फुले तपकिरी होऊन कुजतात, विशेषतः पाऊस व दवात."),
      prevention: prevent("Keep proper spacing for air, remove spotted leaves and rotten flowers, and avoid overhead watering.", "हवा खेळती राहील असे अंतर ठेवा, ठिपके असलेली पाने व कुजलेली फुले काढा आणि वरून पाणी देणे टाळा."),
    },
  ],
  harvestSigns: b("Flowers are fully open with bright colour; pick before the outer petals start drying.", "फुले पूर्ण उमललेली व चमकदार रंगाची असतात; बाहेरच्या पाकळ्या सुकू लागण्यापूर्वी तोडा."),
  postHarvest: b(
    "Pick in the cool hours, keep flowers in shade, sprinkle lightly with water and pack in bamboo baskets or gunny bags with air gaps. Send to market the same day; for garlands, keep the stalk short.",
    "थंड वेळेत तोडा, फुले सावलीत ठेवा, थोडे पाणी शिंपडा आणि हवा खेळेल अशा बांबूच्या टोपल्यांत किंवा पोत्यांत भरा. त्याच दिवशी बाजारात पाठवा; हारांसाठी देठ आखूड ठेवा.",
  ),
  marketTips: b(
    "Prices jump at Ganesh festival, Dasara and Diwali and can fall sharply a day after. Plan transplanting about 2–2.5 months before the festival so peak picking lands 1–2 days before it. Bright, uniform orange and yellow flowers sell best; sell together through your Mandi Mitra to big flower markets like Pune or Mumbai.",
    "गणेशोत्सव, दसरा व दिवाळीत दर खूप वाढतात आणि सणानंतर एका दिवसात कोसळू शकतात. सर्वात मोठी तोडणी सणाच्या 1–2 दिवस आधी यावी म्हणून सणाच्या साधारण 2–2.5 महिने आधी पुनर्लागवड करा. चमकदार, एकसारखी नारिंगी व पिवळी फुले चांगली विकतात; मंडी मित्रामार्फत एकत्रितपणे पुणे किंवा मुंबईसारख्या मोठ्या फूल बाजारात विका.",
  ),
  source: "General practices from ICAR-Directorate of Floricultural Research, Pune and MPKV Rahuri flower crop guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
