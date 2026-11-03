import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Planted once, cut every 45–60 days for 3–5 years. One cycle = one cutting interval. */
const crop: PerennialCrop = {
  id: "hybrid-napier",
  emoji: "🌾",
  name: b("Hybrid Napier grass", "संकरित नेपियर"),
  aliases: ["hybrid napier", "napier", "napier grass", "elephant grass", "bajra napier", "sankarit napier", "संकरित नेपियर", "नेपियर", "नेपियर गवत", "हत्ती गवत"],
  category: "fodder",
  lifecycle: "perennial",
  regions: ["western", "north", "konkan", "marathwada", "vidarbha"],
  tier: 2,
  plantingWindow: b("June–August with the rains; February–March where irrigation is assured", "जून–ऑगस्ट पावसाळ्यात; खात्रीचे पाणी असल्यास फेब्रुवारी–मार्च"),
  plantingMonths: [6, 7, 8, 2, 3],
  plantingMaterial: b("Two-node stem cuttings or rooted slips from a healthy, true-to-type plot", "निरोगी, खात्रीच्या वाणाच्या प्लॉटमधील दोन डोळ्यांच्या कांड्या किंवा मुळे असलेले ठोंब"),
  spacing: b("90 cm between rows and 60 cm between plants (or 120 cm × 60 cm)", "दोन ओळींत 90 सेंमी व दोन ठोंबांत 60 सेंमी (किंवा 120 सेंमी × 60 सेंमी)"),
  plantsPerAcre: [5500, 7500],
  yearsToFirstHarvest: [0, 0],
  economicLifeYears: [3, 5],
  soil: b(
    "Grows on most soils with good drainage; deep, fertile soil gives the most fodder. Avoid fields where water stands for long.",
    "पाण्याचा निचरा होणाऱ्या बहुतेक जमिनीत येते; खोल, सुपीक जमिनीत सर्वाधिक चारा. जास्त काळ पाणी साचणारी जमीन टाळा.",
  ),
  climate: b(
    "Warm, humid weather gives fast growth. Growth slows in cold winter nights but picks up again in spring.",
    "उबदार, दमट हवामानात जोमाने वाढ. हिवाळ्यातील थंड रात्री वाढ मंदावते, पण वसंतात पुन्हा जोर धरते.",
  ),
  irrigation: b(
    "Irrigate every 8–10 days in winter and every 6–8 days in summer, and right after each cut. Rainfed plots give fodder mainly in the monsoon.",
    "हिवाळ्यात दर 8–10 दिवसांनी व उन्हाळ्यात दर 6–8 दिवसांनी आणि प्रत्येक कापणीनंतर लगेच पाणी द्या. कोरडवाहू प्लॉटमध्ये चारा मुख्यतः पावसाळ्यात मिळतो.",
  ),
  nutrientGuide: b(
    "Use a soil test. Mix plenty of farmyard manure at planting. A heavy feeder: give nitrogen in small parts after each cut, and manure once a year. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. लागवडीवेळी भरपूर शेणखत मिसळा. खत जास्त लागणारे पीक: प्रत्येक कापणीनंतर नत्राचा थोडा हप्ता व वर्षातून एकदा शेणखत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Phule Jaywant (RBN-13)", note: b("Hybrid napier released by MPKV Rahuri", "मफुकृवि राहुरीचा संकरित नेपियर वाण") },
    { name: "CO-4", note: b("Widely grown hybrid napier from TNAU, Coimbatore", "मोठ्या प्रमाणावर लावला जाणारा, तमिळनाडू कृषी विद्यापीठ (कोईम्बतूर) चा वाण") },
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Cuttings or slips are planted and send out roots and shoots.", "कांड्या किंवा ठोंब लावले जातात व त्यांना मुळे व फुटवे येतात."], [
      t("hn-plant", 0, "other", ["Plant cuttings", "कांड्यांची लागवड करा"], ["Plant two-node cuttings at a slant with one node in the soil, or plant rooted slips, on ridges 90–120 cm apart.", "90–120 सेंमी अंतरावरील सरीवर दोन डोळ्यांची कांडी तिरकी, एक डोळा मातीत राहील अशी लावा, किंवा मुळे असलेले ठोंब लावा."]),
      t("hn-irr0", 1, "irrigation", ["Water after planting", "लागवडीनंतर पाणी"], ["Give light water right after planting and keep the soil moist.", "लागवडीनंतर लगेच हलके पाणी द्या व जमीन ओलसर ठेवा."], 7),
      t("hn-gap", 21, "other", ["Fill gaps", "खाडे भरा"], ["Replant where cuttings failed to sprout.", "न फुटलेल्या कांड्यांच्या जागी पुन्हा लावा."]),
    ], [["Termites eating cuttings", "वाळवी कांड्या खाते"]]),
    stage("growth", ["Growth to first cut", "पहिल्या कापणीपर्यंत वाढ"], 30, 75, ["Clumps form many tillers and grow tall.", "ठोंबांना अनेक फुटवे येऊन ते उंच वाढतात."], [
      t("hn-weed", 30, "weeding", ["Weeding", "खुरपणी"], ["Weed once or twice until the clumps cover the ground.", "ठोंब जमीन झाकेपर्यंत एक-दोन वेळा खुरपणी करा."], 20),
      t("hn-fert0", 35, "fertiliser", ["Nitrogen top dressing", "नत्राचा वरखत"], ["Give a nitrogen part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार नत्राचा हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
      t("hn-irr1", 31, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 8–10 days if there is no rain.", "पाऊस नसल्यास दर 8–10 दिवसांनी पाणी द्या."], 9),
      t("hn-cut0", 65, "harvest", ["First cut", "पहिली कापणी"], ["Take the first cut at 65–75 days, 10–15 cm above the ground.", "65–75 दिवसांनी जमिनीपासून 10–15 सेंमी वर पहिली कापणी करा."]),
    ], [["Leaf spots in humid weather", "दमट हवेत पानांवर ठिपके"]]),
  ],
  cycles: [
    {
      key: "cutting",
      name: b("Cutting cycle", "कापणी चक्र"),
      startMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      startEvent: b("The previous cut", "मागील कापणी"),
      harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      note: b(
        "Repeat every 45–60 days (longer in winter). 6–8 cuts a year for 3–5 years; replant when clumps thin out.",
        "दर 45–60 दिवसांनी (हिवाळ्यात जास्त दिवस) पुन्हा करा. वर्षाला 6–8 कापण्या, 3–5 वर्षे; ठोंब विरळ झाल्यावर नवीन लागवड करा.",
      ),
      stages: [
        stage("after-cut", ["After cutting", "कापणीनंतर"], 0, 10, ["Clumps rest and start new shoots from the base.", "ठोंब विसावतात व बुंध्यातून नवे फुटवे येऊ लागतात."], [
          t("hnc-irr", 1, "irrigation", ["Water after cutting", "कापणीनंतर पाणी द्या"], ["Irrigate within 2 days of the cut.", "कापणीनंतर 2 दिवसांत पाणी द्या."]),
          t("hnc-fert", 3, "fertiliser", ["Feed after cutting", "कापणीनंतर खत द्या"], ["Give a nitrogen part (or slurry/manure) as per your plan. Ask your agriculture officer for the amount.", "नियोजनानुसार नत्राचा हप्ता (किंवा शेणस्लरी/शेणखत) द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
        ], [["Clumps drying if water is late after cutting", "कापणीनंतर पाणी उशिरा दिल्यास ठोंब वाळणे"]]),
        stage("regrowth", ["Regrowth", "पुनर्वाढ"], 10, 40, ["New tillers grow fast into leafy fodder.", "नवे फुटवे भराभर वाढून पालेदार चारा तयार होतो."], [
          t("hnc-irr2", 10, "irrigation", ["Irrigate", "पाणी द्या"], ["Every 6–10 days depending on season.", "हंगामानुसार दर 6–10 दिवसांनी."], 8),
          t("hnc-weed", 15, "weeding", ["Clean between rows", "ओळींमधील तण काढा"], ["Remove weeds and earth up clumps once or twice a year.", "तण काढा व वर्षातून एक-दोन वेळा ठोंबांना भर द्या."]),
          t("hnc-obs", 20, "observation", ["Check the clumps", "ठोंब तपासा"], ["Look for leaf spots, termites at the base and dead clumps to replace.", "पानांवर ठिपके, बुंध्याला वाळवी व बदलायचे मेलेले ठोंब पाहा."]),
        ], [["Leaf spot", "पानांवरील ठिपके"]]),
        stage("ready", ["Ready to cut", "कापणीस तयार"], 40, 55, ["Plants are about 1.5 m tall and leafy — best time to cut.", "झाडे साधारण 1.5 मीटर उंच व पालेदार — कापणीची उत्तम वेळ."], [
          t("hnc-cut", 45, "harvest", ["Cut fodder", "चारा कापा"], ["Cut 10–15 cm above the ground. Cut in parts so you have fresh fodder every day.", "जमिनीपासून 10–15 सेंमी वर कापा. रोज ताजा चारा मिळावा म्हणून टप्प्याटप्प्याने कापा."]),
          t("hnc-chaff", 46, "other", ["Chop before feeding", "कुट्टी करून द्या"], ["Chop with a chaff cutter and mix with legume fodder so animals waste less.", "कडबा कुट्टी यंत्राने कुट्टी करा व शेंगवर्गीय चाऱ्यात मिसळा, म्हणजे वाया जात नाही."]),
        ], [["Hard, fibrous fodder if cut late", "उशिरा कापल्यास कडक, धाग्याचा चारा"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Termites", "वाळवी"),
      signs: b("Cuttings fail to sprout; clumps dry from the base in dry, light soil.", "कांड्या फुटत नाहीत; हलक्या कोरड्या जमिनीत ठोंब बुंध्यापासून वाळतात."),
      prevention: prevent("Use only well-rotted manure, remove old stumps and crop waste, and keep the field irrigated.", "फक्त चांगले कुजलेले शेणखत वापरा, जुने खुंट व पिकाचे अवशेष काढा आणि शेताला नियमित पाणी द्या."),
    },
    {
      name: b("Leaf spot and leaf blight", "पानांवरील ठिपके व करपा"),
      signs: b("Brown or reddish spots and streaks on leaves in humid weather.", "दमट हवेत पानांवर तपकिरी किंवा लालसर ठिपके व रेषा."),
      prevention: prevent("Cut on time, remove badly spotted leaves, and avoid very dense planting.", "वेळेवर कापणी करा, जास्त ठिपके असलेली पाने काढा आणि खूप दाट लागवड टाळा."),
    },
    {
      name: b("Low-quality fodder from late cutting", "उशिरा कापणीने निकृष्ट चारा"),
      signs: b("Thick, hard stems that animals leave; fewer new shoots after the cut.", "जाड, कडक खोड जे जनावरे खात नाहीत; कापणीनंतर फुटवे कमी."),
      prevention: b("Cut every 45–60 days at about 1.5 m height, and always feed with some legume fodder such as lucerne.", "दर 45–60 दिवसांनी साधारण 1.5 मीटर उंचीवर कापा आणि नेहमी लसूण घासासारख्या शेंगवर्गीय चाऱ्यासोबत द्या."),
    },
  ],
  harvestSigns: b("Plants are about 1.5 m tall and leafy, 45–60 days after the last cut.", "मागील कापणीनंतर 45–60 दिवसांनी झाडे साधारण 1.5 मीटर उंच व पालेदार."),
  postHarvest: b(
    "Chop and feed fresh, mixed with legume and dry fodder. Extra fodder in the rains can be made into silage in a pit or bags.",
    "कुट्टी करून शेंगवर्गीय व सुक्या चाऱ्यात मिसळून ताजा द्या. पावसाळ्यातील जास्तीच्या चाऱ्याचा खड्ड्यात किंवा पिशव्यांत मुरघास करता येतो.",
  ),
  marketTips: b(
    "One acre gives green fodder all year for several milk animals. Extra fodder and planting cuttings both sell locally to dairy farmers.",
    "एका एकरातून अनेक दुभत्या जनावरांना वर्षभर हिरवा चारा मिळतो. जास्तीचा चारा व लागवडीच्या कांड्या दोन्ही स्थानिक दूध उत्पादकांना विकता येतात.",
  ),
  source: "General practices from MPKV Rahuri forage guidance and ICAR-IGFRI (Jhansi)",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
