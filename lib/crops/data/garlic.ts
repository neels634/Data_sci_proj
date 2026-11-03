import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "garlic",
  emoji: "🧄",
  name: b("Garlic", "लसूण"),
  aliases: ["garlic", "lasun", "lasoon", "लसूण", "lehsun", "lahsun", "लहसुन"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["western", "north"],
  majorDistricts: b("Pune, Nashik, Satara", "पुणे, नाशिक, सातारा"),
  tier: 1,
  seasons: [
    { season: "rabi", sowingWindow: b("Plant cloves in October–November", "ऑक्टोबर–नोव्हेंबरमध्ये पाकळ्यांची लागवड"), sowingMonths: [10, 11], durationDays: [130, 150] },
  ],
  method: "vegetative",
  plantingMaterial: b("Large, healthy cloves from well-stored bulbs", "चांगल्या साठवलेल्या गड्ड्यांतील मोठ्या, निरोगी पाकळ्या"),
  soil: b(
    "Well-drained medium black or loamy soil rich in organic matter. Avoid heavy soil where water stands.",
    "सेंद्रिय पदार्थ भरपूर असलेली, पाण्याचा चांगला निचरा होणारी मध्यम काळी किंवा पोयट्याची जमीन. पाणी साचणारी भारी जमीन टाळा.",
  ),
  climate: b(
    "Cool weather for leaf growth, then warmer, drier days for bulbs to form and ripen.",
    "पानांच्या वाढीसाठी थंड हवा, नंतर गड्डा धरून पक्व होण्यासाठी उबदार व कोरडे दिवस.",
  ),
  seedRate: b("About 2–2.5 quintal cloves per acre (more for bigger cloves).", "एकरी साधारण 2–2.5 क्विंटल पाकळ्या (मोठ्या पाकळ्यांना जास्त)."),
  spacing: b("15 cm between rows, 7.5–10 cm between cloves, on flat beds.", "सपाट वाफ्यांवर ओळींत 15 सेंमी, पाकळ्यांत 7.5–10 सेंमी."),
  irrigation: b(
    "Water right after planting, again after 3–4 days, then every 8–10 days. Keep moisture even while bulbs form. Stop watering 10–15 days before harvest.",
    "लागवडीनंतर लगेच पाणी, 3–4 दिवसांनी पुन्हा, नंतर दर 8–10 दिवसांनी. गड्डा धरताना ओलावा सारखा ठेवा. काढणीपूर्वी 10–15 दिवस पाणी बंद करा.",
  ),
  nutrientGuide: b(
    "Use a soil test. Mix well-rotted farmyard manure before planting. Give nitrogen in parts, all within about 60 days — late nitrogen spoils storage. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. लागवडीपूर्वी कुजलेले शेणखत मिसळा. नत्र विभागून, साधारण 60 दिवसांच्या आत द्या — उशिरा नत्र दिल्यास साठवण खराब होते. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("planting", ["Planting & sprouting", "लागवड व उगवण"], 0, 15, ["Cloves root and green shoots come up.", "पाकळ्यांना मुळे फुटतात व हिरवे कोंब वर येतात."], [
      t("gl-plant", 0, "sowing", ["Plant the cloves", "पाकळ्या लावा"], ["Separate cloves just before planting. Plant upright, pointed end up, about 2–3 cm deep.", "लागवडीच्या आधीच पाकळ्या वेगळ्या करा. टोक वर ठेवून सरळ, साधारण 2–3 सेंमी खोल लावा."]),
      t("gl-irr1", 1, "irrigation", ["Water after planting", "लागवडीनंतर पाणी"], ["Give light water; repeat after 3–4 days.", "हलके पाणी द्या; 3–4 दिवसांनी पुन्हा द्या."], 4),
    ], [["Cloves rotting in waterlogged beds", "पाणी साचलेल्या वाफ्यात पाकळ्या कुजणे"]]),
    stage("vegetative", ["Leaf growth", "पानांची वाढ"], 15, 60, ["Leaves grow. Good leaf growth now means bigger bulbs.", "पाने वाढतात. आता चांगली पाने म्हणजे नंतर मोठा गड्डा."], [
      t("gl-irr2", 15, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 8–10 days; don't flood.", "दर 8–10 दिवसांनी पाणी द्या; तुंबवू नका."], 9),
      t("gl-weed", 25, "weeding", ["Weeding", "खुरपणी"], ["Garlic grows slowly and cannot fight weeds. Weed by hand 2–3 times.", "लसूण हळू वाढतो व तणांशी स्पर्धा करू शकत नाही. 2–3 वेळा हाताने खुरपणी करा."], 20),
      t("gl-obs1", 30, "observation", ["Check leaves", "पाने तपासा"], ["Look for silvery streaks (thrips) and purple spots (blotch).", "चंदेरी रेषा (फुलकिडे) व जांभळे ठिपके (करपा) पाहा."], 7),
      t("gl-fert", 40, "fertiliser", ["Last nitrogen part", "नत्राचा शेवटचा हप्ता"], ["Give the last part as per soil test. No nitrogen after about 60 days.", "माती परीक्षणानुसार शेवटचा हप्ता द्या. साधारण 60 दिवसांनंतर नत्र देऊ नका."]),
    ], [["Thrips", "फुलकिडे"], ["Purple blotch", "करपा (जांभळा)"]]),
    stage("bulb-initiation", ["Bulb starts forming", "गड्डा धरू लागतो"], 60, 90, ["Cloves begin forming inside the swelling base.", "फुगणाऱ्या बुंध्यात पाकळ्या तयार होऊ लागतात."], [
      t("gl-irr3", 60, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even moisture now; long dry gaps give small bulbs.", "आता ओलावा सारखा ठेवा; मोठा खंड पडल्यास गड्डा लहान राहतो."], 8),
      t("gl-obs2", 62, "observation", ["Check for pests and spots", "कीड व ठिपके तपासा"], ["Leaf damage now directly cuts bulb size.", "आता पानांचे नुकसान थेट गड्ड्याचा आकार कमी करते."], 7),
    ], [["Thrips and blotch", "फुलकिडे व करपा"]]),
    stage("bulb-development", ["Bulb development", "गड्डा पोसणे"], 90, 130, ["Bulbs fill and cloves grow to full size.", "गड्डा भरतो आणि पाकळ्या पूर्ण आकाराच्या होतात."], [
      t("gl-irr4", 90, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep regular water until leaves start yellowing.", "पाने पिवळी पडू लागेपर्यंत नियमित पाणी द्या."], 8),
      t("gl-obs3", 95, "observation", ["Walk the field", "शेतात फेरी मारा"], ["Remove plants with twisted or striped leaves (virus). Check for rot near the base.", "पिळवटलेली किंवा पट्टेदार पाने (विषाणू) असलेली रोपे काढा. बुंध्याजवळ कूज पाहा."], 10),
    ], [["Split bulbs from uneven watering", "अनियमित पाण्याने गड्डे फुटणे"]]),
    stage("maturity", ["Maturity", "पक्वता"], 130, 140, ["Leaves turn yellow and bend; necks go soft.", "पाने पिवळी पडून वाकतात; माना नरम होतात."], [
      t("gl-stop", 130, "other", ["Stop irrigation", "पाणी बंद करा"], ["Stop watering 10–15 days before harvest.", "काढणीपूर्वी 10–15 दिवस पाणी बंद करा."]),
      t("gl-ready", 134, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Ready when most leaves are yellow and drooping.", "बहुतेक पाने पिवळी होऊन लोंबू लागली की तयार."]),
    ], [["Rain at maturity causing rot", "पक्वतेच्या वेळी पावसाने कूज"]]),
    stage("harvest", ["Harvest & curing", "काढणी व सुकवणी"], 140, 150, ["Bulbs are pulled out and dried in shade.", "गड्डे उपटून सावलीत सुकवले जातात."], [
      t("gl-harv", 140, "harvest", ["Harvest", "काढणी करा"], ["Pull plants on a dry day; don't bruise bulbs.", "कोरड्या दिवशी रोपे उपटा; गड्ड्यांना इजा करू नका."]),
      t("gl-cure", 142, "other", ["Cure and tie in bunches", "सुकवून जुड्या बांधा"], ["Dry in shade with leaves for 2–3 weeks, then tie in bunches or cut tops and store in an airy place.", "पानांसह 2–3 आठवडे सावलीत सुकवा, मग जुड्या बांधा किंवा पात कापून हवेशीर जागी साठवा."]),
    ], [["Sunburn on uncovered bulbs", "उघड्या गड्ड्यांना ऊन लागणे"]]),
  ],
  commonProblems: [
    { name: b("Thrips", "फुलकिडे"), signs: b("Silvery streaks on leaves; tips dry and twist.", "पानांवर चंदेरी रेषा; शेंडे सुकतात व पिळवटतात."), prevention: prevent("Check leaves weekly, keep the field weed-free and use blue sticky traps to spot them early.", "दर आठवड्याला पाने तपासा, शेत तणमुक्त ठेवा आणि लवकर ओळखण्यासाठी निळे चिकट सापळे लावा.") },
    { name: b("Purple blotch", "करपा (जांभळा)"), signs: b("White spots that turn purple with yellow edges; leaves dry from the tip.", "पांढरे ठिपके जे पिवळ्या कडांसह जांभळे होतात; पाने टोकाकडून सुकतात."), prevention: prevent("Avoid wetting leaves late in the day, give balanced nutrition and rotate crops.", "संध्याकाळी पाने ओली करू नका, संतुलित खत द्या आणि पिकांची फेरपालट करा.") },
    { name: b("Basal rot", "बुंधा कूज"), signs: b("Leaves yellow from the tip, roots and base of the bulb rot.", "पाने टोकाकडून पिवळी, मुळे व गड्ड्याचा बुंधा कुजतो."), prevention: prevent("Plant only healthy cloves, avoid waterlogging and rotate with non-onion crops.", "फक्त निरोगी पाकळ्या लावा, पाणी साचू देऊ नका आणि कांदा-लसूण सोडून इतर पिकांशी फेरपालट करा.") },
    { name: b("Virus (leaf striping)", "विषाणू (पानांवर पट्टे)"), signs: b("Yellow stripes and twisted leaves; small bulbs.", "पानांवर पिवळे पट्टे व पिळवटलेली पाने; लहान गड्डे."), prevention: b("Use clean planting cloves from healthy fields and remove affected plants early.", "निरोगी शेतातील स्वच्छ पाकळ्या लावा आणि बाधित रोपे लवकर काढा.") },
  ],
  harvestSigns: b("Most leaves have turned yellow and droop; the bulb skin is firm.", "बहुतेक पाने पिवळी होऊन लोंबली आहेत; गड्ड्याची साल घट्ट आहे."),
  postHarvest: b(
    "Cure in shade for 2–3 weeks. Grade by bulb size and remove damaged bulbs. Store in bunches hung in an airy room or in a well-ventilated store.",
    "2–3 आठवडे सावलीत सुकवा. गड्ड्याच्या आकारानुसार प्रतवारी करा व खराब गड्डे काढा. जुड्या बांधून हवेशीर खोलीत टांगून किंवा हवेशीर साठवणगृहात ठेवा.",
  ),
  marketTips: b(
    "Big, well-cured, clean bulbs get the best price. Well-cured garlic keeps for months, so you can wait for a better rate. Keep your best bulbs as next year's planting material.",
    "मोठ्या, चांगल्या सुकवलेल्या, स्वच्छ गड्ड्यांना सर्वात चांगला दर मिळतो. चांगला सुकवलेला लसूण महिनोन्महिने टिकतो, त्यामुळे चांगल्या दरासाठी थांबता येते. पुढच्या वर्षीच्या लागवडीसाठी उत्तम गड्डे राखून ठेवा.",
  ),
  varieties: [
    { name: "Bhima Purple", note: b("Purple-skinned garlic for rabi (ICAR-DOGR Rajgurunagar)", "जांभळ्या सालीचा रब्बी लसूण (ICAR-DOGR राजगुरुनगर)") },
    { name: "Bhima Omkar", note: b("White garlic for rabi (ICAR-DOGR Rajgurunagar)", "पांढरा रब्बी लसूण (ICAR-DOGR राजगुरुनगर)") },
  ],
  source: "General practices from ICAR-DOGR Rajgurunagar and MPKV Rahuri garlic guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
