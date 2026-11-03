import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "green-chilli",
  emoji: "🌶️",
  name: b("Green chilli", "हिरवी मिरची"),
  aliases: ["green chilli", "green chili", "mirchi", "मिरची", "chilli", "chili", "hirvi mirchi", "हिरवी मिरची", "hari mirch", "हरी मिर्च"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada", "vidarbha"],
  majorDistricts: b("Nashik, Pune, Satara", "नाशिक, पुणे, सातारा"),
  tier: 1,
  seasons: [
    { season: "kharif", sowingWindow: b("Nursery in May–June; transplant with the rains", "रोपवाटिका मे–जून; पावसाबरोबर पुनर्लागवड"), sowingMonths: [5, 6], durationDays: [150, 180] },
    { season: "rabi", sowingWindow: b("Nursery in September–October", "रोपवाटिका सप्टेंबर–ऑक्टोबर"), sowingMonths: [9, 10], durationDays: [150, 180] },
    { season: "summer", sowingWindow: b("Nursery in December–January; needs assured irrigation", "रोपवाटिका डिसेंबर–जानेवारी; खात्रीचे पाणी लागते"), sowingMonths: [12, 1], durationDays: [140, 160] },
  ],
  method: "transplant",
  plantingMaterial: b("Seed, raised as seedlings in a nursery", "बियाणे; रोपवाटिकेत रोपे तयार करून"),
  nurseryDays: 35,
  soil: b("Well-drained loamy or medium black soil. Chilli dies quickly in waterlogged soil.", "पाण्याचा चांगला निचरा होणारी पोयट्याची किंवा मध्यम काळी जमीन. पाणी साचल्यास मिरची लवकर मरते."),
  climate: b("Warm, mildly humid weather. Very hot dry winds and heavy rain both drop flowers.", "उबदार, थोडे दमट हवामान. खूप उष्ण कोरडे वारे व मुसळधार पाऊस दोन्हीमुळे फुले गळतात."),
  seedRate: b("About 400–500 g seed per acre for the nursery (100–150 g for hybrids).", "रोपवाटिकेसाठी एकरी साधारण 400–500 ग्रॅम बियाणे (संकरित वाणाला 100–150 ग्रॅम)."),
  spacing: b("60–75 cm between rows, 45–60 cm between plants.", "ओळींत 60–75 सेंमी, रोपांत 45–60 सेंमी."),
  irrigation: b(
    "Water right after transplanting, then every 6–8 days in winter and 4–5 days in summer. Never let water stand around plants. Drip with mulch works well. In kharif, water only in dry spells.",
    "पुनर्लागवडीनंतर लगेच पाणी, नंतर हिवाळ्यात दर 6–8 दिवसांनी व उन्हाळ्यात दर 4–5 दिवसांनी. झाडांभोवती पाणी साचू देऊ नका. आच्छादनासह ठिबक चांगले. खरिपात फक्त पावसाच्या खंडात पाणी द्या.",
  ),
  nutrientGuide: b(
    "Use a soil test. Mix well-rotted farmyard manure before planting. Give nitrogen in 3–4 parts, including during the picking period. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. लागवडीपूर्वी कुजलेले शेणखत मिसळा. नत्र 3–4 हप्त्यांत द्या, तोडणीच्या काळातही. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("nursery", ["Nursery", "रोपवाटिका"], 0, 35, ["Seedlings grow in raised beds or trays.", "गादीवाफ्यावर किंवा ट्रेमध्ये रोपे वाढतात."], [
      t("gc-bed", 0, "sowing", ["Sow the nursery", "रोपवाटिका पेरा"], ["Sow thinly in lines on raised beds or in trays. A net cover keeps whitefly and thrips away from seedlings.", "गादीवाफ्यावर ओळीत विरळ किंवा ट्रेमध्ये पेरा. जाळी झाकल्यास रोपांवर पांढरी माशी व फुलकिडे येत नाहीत."]),
      t("gc-nwater", 1, "irrigation", ["Water the nursery lightly", "रोपवाटिकेला हलके पाणी"], ["Keep moist, not soggy.", "ओलसर ठेवा, चिखल नको."], 3),
      t("gc-harden", 28, "observation", ["Harden the seedlings", "रोपे कणखर करा"], ["Give less water for a week before transplanting.", "पुनर्लागवडीपूर्वी आठवडाभर पाणी कमी द्या."]),
    ], [["Damping off", "रोपे कोलमडणे"]]),
    stage("establishment", ["Transplanting & establishment", "पुनर्लागवड व स्थिरावणे"], 35, 50, ["Seedlings are planted and take root.", "रोपे शेतात लावली जातात व मूळ धरतात."], [
      t("gc-tp", 35, "transplanting", ["Transplant", "पुनर्लागवड करा"], ["Plant 5–6 week old seedlings in the evening on ridges or beds and water right after.", "5–6 आठवड्यांची रोपे संध्याकाळी सरी किंवा गादीवाफ्यावर लावा व लगेच पाणी द्या."]),
      t("gc-irr1", 36, "irrigation", ["Light irrigation", "हलके पाणी"], ["Keep the root zone moist until plants settle.", "रोपे स्थिरावेपर्यंत मुळांजवळ ओलावा ठेवा."], 5),
      t("gc-gap", 42, "other", ["Fill the gaps", "खाडे भरा"], ["Replace dead or curled-leaf seedlings.", "मेलेली किंवा पाने आकसलेली रोपे बदला."]),
    ], [["Seedlings wilting at the base", "रोपे बुंध्याजवळ मलूल होणे"]]),
    stage("vegetative", ["Plant growth", "रोपांची वाढ"], 50, 75, ["Plants branch and grow leaves.", "रोपांना फांद्या फुटतात व पाने वाढतात."], [
      t("gc-irr2", 50, "irrigation", ["Irrigate", "पाणी द्या"], ["Water at the base as needed.", "गरजेनुसार मुळांजवळ पाणी द्या."], 7),
      t("gc-weed", 52, "weeding", ["Weeding and earthing up", "खुरपणी व भर"], ["Remove weeds and pull soil to the plants.", "तण काढा व रोपांना भर लावा."]),
      t("gc-obs1", 54, "observation", ["Check leaves", "पाने तपासा"], ["Look for upward-curled leaves (thrips), downward-curled leaves (mites) and whitefly.", "वर वळलेली पाने (फुलकिडे), खाली वळलेली पाने (कोळी) व पांढरी माशी पाहा."], 7),
      t("gc-fert", 60, "fertiliser", ["Top dressing", "वरखत"], ["Give the next nitrogen part as per soil test.", "माती परीक्षणानुसार नत्राचा पुढचा हप्ता द्या."]),
    ], [["Leaf curl (churda-murda)", "चुरडा-मुरडा (पाने आकसणे)"]]),
    stage("flowering", ["Flowering & fruit set", "फुलोरा व फळधारणा"], 75, 95, ["Flowers open and first chillies set.", "फुले उमलतात व पहिल्या मिरच्या धरतात."], [
      t("gc-irr3", 75, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Water stress now drops flowers.", "आता पाण्याचा ताण आल्यास फुले गळतात."], 6),
      t("gc-obs2", 77, "observation", ["Check flowers and fruit", "फुले व फळे तपासा"], ["Look for flower drop, holes in fruit and leaf curl.", "फुलगळ, फळांना छिद्रे व पाने आकसणे पाहा."], 7),
    ], [["Flower drop in heat or heavy rain", "उष्णता किंवा जोरदार पावसात फुलगळ"], ["Fruit borer", "फळ पोखरणारी अळी"]]),
    stage("harvest", ["Harvest (pickings)", "तोडणी"], 95, 180, ["Green chillies are picked every 7–10 days.", "दर 7–10 दिवसांनी हिरव्या मिरच्यांची तोडणी होते."], [
      t("gc-pick", 95, "harvest", ["Pick green chillies", "हिरव्या मिरच्या तोडा"], ["Pick full-sized, firm green fruits with the stalk.", "पूर्ण वाढलेल्या, टणक हिरव्या मिरच्या देठासह तोडा."], 8),
      t("gc-irr4", 96, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep watering between pickings.", "तोडण्यांच्या मध्ये पाणी देत राहा."], 7),
      t("gc-fert2", 110, "fertiliser", ["Top dressing after pickings", "तोडण्यांनंतर वरखत"], ["Give a nutrient part as per soil test to keep plants bearing.", "झाडे फळे देत राहावीत म्हणून माती परीक्षणानुसार खताचा हप्ता द्या."]),
      t("gc-obs3", 100, "observation", ["Check for fruit rot", "फळकूज तपासा"], ["Remove rotting or bored fruits and dried twigs.", "कुजलेली किंवा पोखरलेली फळे व सुकलेल्या फांद्या काढा."], 10),
    ], [["Check pre-harvest waiting days on any product label before picking", "तोडणीपूर्वी वापरलेल्या औषधाच्या लेबलवरील काढणीपूर्व कालावधी तपासा"], ["Die-back and fruit rot", "फांद्या सुकणे व फळकूज"]]),
  ],
  flushes: {
    everyDays: 8,
    count: 10,
    note: b("Pick every 7–10 days for about 3 months. Regular picking gives more flowers.", "साधारण 3 महिने दर 7–10 दिवसांनी तोडणी. नियमित तोडणीमुळे जास्त फुले येतात."),
  },
  commonProblems: [
    { name: b("Leaf curl (churda-murda)", "चुरडा-मुरडा"), signs: b("Leaves curl up or down, become small and crinkled; plants stop growing. Caused by thrips, mites and whitefly-borne virus.", "पाने वर किंवा खाली वळतात, लहान व सुरकुतलेली होतात; वाढ थांबते. फुलकिडे, कोळी व पांढऱ्या माशीमुळे येणाऱ्या विषाणूमुळे होतो."), prevention: prevent("Raise seedlings under net, remove virus plants early, keep weeds down and use sticky traps.", "जाळीखाली रोपे तयार करा, विषाणूग्रस्त झाडे लवकर काढा, तण कमी ठेवा आणि चिकट सापळे लावा.") },
    { name: b("Fruit borer", "फळ पोखरणारी अळी"), signs: b("Round holes in fruit; fruit rots and falls.", "फळांना गोल छिद्रे; फळ कुजून गळते."), prevention: prevent("Use pheromone traps and pick and destroy bored fruits.", "कामगंध सापळे लावा आणि पोखरलेली फळे तोडून नष्ट करा.") },
    { name: b("Die-back and fruit rot", "फांद्या सुकणे व फळकूज"), signs: b("Twigs dry from the tip downward; fruits get sunken dark spots.", "फांद्या टोकाकडून खाली सुकतात; फळांवर खोलगट काळे डाग."), prevention: prevent("Cut and burn dried twigs, avoid overhead watering and give good spacing.", "सुकलेल्या फांद्या कापून जाळा, वरून पाणी देणे टाळा आणि योग्य अंतर ठेवा.") },
    { name: b("Wilt and root rot", "मर व मूळकूज"), signs: b("Plants wilt and die, often in patches where water stands.", "झाडे मलूल होऊन मरतात, बहुतेक पाणी साचणाऱ्या भागात."), prevention: prevent("Plant on ridges, drain extra water and rotate with non-solanaceous crops.", "सरीवर लागवड करा, जास्तीचे पाणी काढा आणि टोमॅटो-वांगी-बटाटा सोडून इतर पिकांशी फेरपालट करा.") },
  ],
  harvestSigns: b("Fruits are full length, firm and glossy green.", "मिरच्या पूर्ण लांबीच्या, टणक व चकचकीत हिरव्या."),
  postHarvest: b("Pick in cool hours, keep in shade, remove damaged and red fruits, and pack in ventilated bags or crates.", "थंड वेळेत तोडा, सावलीत ठेवा, खराब व लाल मिरच्या वेगळ्या करा आणि हवेशीर पिशव्यांत किंवा क्रेटमध्ये भरा."),
  marketTips: b("Markets differ on how hot, long and dark green they want chillies, so ask buyers before choosing a variety. Fresh, stalked, graded chillies get better rates.", "बाजारानुसार तिखटपणा, लांबी व हिरवा रंग याची मागणी वेगळी असते, म्हणून वाण निवडण्यापूर्वी खरेदीदारांना विचारा. ताज्या, देठासह, प्रतवारी केलेल्या मिरचीला चांगला दर मिळतो."),
  varieties: [
    { name: "Pusa Jwala", note: b("Long, thin, pungent green chilli (ICAR-IARI)", "लांब, बारीक, तिखट हिरवी मिरची (ICAR-IARI)") },
  ], // TODO: varieties — confirm MPKV / Dr. PDKV chilli releases (e.g. Phule Jyoti)
  source: "General practices from MPKV Rahuri, Dr. PDKV Akola and ICAR-IIVR chilli guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
