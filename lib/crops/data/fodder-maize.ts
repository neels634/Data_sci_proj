import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "fodder-maize",
  emoji: "🌽",
  name: b("Fodder maize", "चारा मका"),
  aliases: ["fodder maize", "maize fodder", "green maize fodder", "chara maka", "charamaka", "maka chara", "चारा मका", "मका चारा", "हिरवा मका चारा"],
  category: "fodder",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada", "vidarbha"],
  tier: 2,
  seasons: [
    { season: "kharif", sowingWindow: b("June–July", "जून–जुलै"), sowingMonths: [6, 7], durationDays: [60, 75] },
    { season: "rabi", sowingWindow: b("October–November, with irrigation", "ऑक्टोबर–नोव्हेंबर, पाण्याची सोय असल्यास"), sowingMonths: [10, 11], durationDays: [70, 85] },
    { season: "summer", sowingWindow: b("February–March, with irrigation", "फेब्रुवारी–मार्च, पाण्याची सोय असल्यास"), sowingMonths: [2, 3], durationDays: [60, 70] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b(
    "Medium to deep, well-drained fertile soil. Standing water yellows and stunts the crop.",
    "पाण्याचा निचरा होणारी मध्यम ते खोल सुपीक जमीन. पाणी साचल्यास पीक पिवळे पडून खुंटते.",
  ),
  climate: b(
    "Grows in all three seasons with water; fastest in warm weather.",
    "पाणी असल्यास तिन्ही हंगामांत येतो; उबदार हवेत सर्वात जलद वाढ.",
  ),
  seedRate: b("30–40 kg seed per acre (sown thicker than grain maize).", "एकरी 30–40 किलो बियाणे (दाण्याच्या मक्यापेक्षा दाट पेरणी)."),
  spacing: b("30 cm between rows, about 10 cm between plants.", "दोन ओळींत 30 सेंमी, दोन रोपांत साधारण 10 सेंमी."),
  irrigation: b(
    "Kharif crop mostly on rain; drain extra water. Rabi crop every 10–12 days; summer crop every 7–8 days.",
    "खरीप पीक मुख्यतः पावसावर; जास्तीचे पाणी काढा. रब्बीत दर 10–12 दिवसांनी; उन्हाळ्यात दर 7–8 दिवसांनी पाणी.",
  ),
  nutrientGuide: b(
    "Use a soil test. Mix farmyard manure before sowing. Give nitrogen in two parts — at sowing and about a month later. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. पेरणीपूर्वी शेणखत मिसळा. नत्र दोन हप्त्यांत द्या — पेरणीवेळी व साधारण महिन्याने. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 10, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("fm-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow thickly in 30 cm rows, 4–5 cm deep.", "30 सेंमी ओळीत 4–5 सेंमी खोल दाट पेरा."]),
      t("fm-count", 7, "observation", ["Check germination", "उगवण तपासा"], ["Look for gaps and seedlings cut or eaten.", "खाडे व कापलेली किंवा खाल्लेली रोपे पाहा."]),
    ], [["Birds picking seed", "पक्षी बी टिपतात"]]),
    stage("vegetative", ["Leaf growth", "पानांची वाढ"], 10, 40, ["Plants grow fast and make many leaves.", "रोपे जोमाने वाढतात व भरपूर पाने येतात."], [
      t("fm-weed", 15, "weeding", ["Weeding", "खुरपणी"], ["One weeding or hoeing at 2–3 weeks; the thick crop then shades out weeds.", "2–3 आठवड्यांनी एक खुरपणी किंवा कोळपणी; नंतर दाट पीक तणांना दाबते."]),
      t("fm-obs1", 14, "observation", ["Check the whorl", "पोंगा तपासा"], ["Look for ragged holes in leaves and sawdust-like droppings in the whorl (fall armyworm).", "पानांना फाटकी छिद्रे व पोंग्यात भुशासारखी विष्ठा (लष्करी अळी) पाहा."], 5),
      t("fm-fert", 28, "fertiliser", ["Second nitrogen part", "नत्राचा दुसरा हप्ता"], ["Give the second part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार दुसरा हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
      t("fm-irr1", 20, "irrigation", ["Irrigate", "पाणी द्या"], ["Rabi: every 10–12 days; summer: every 7–8 days. Kharif: only in a dry spell.", "रब्बी: दर 10–12 दिवसांनी; उन्हाळी: दर 7–8 दिवसांनी. खरीप: फक्त पावसाच्या खंडात."], 9),
    ], [["Fall armyworm", "लष्करी अळी"], ["Stem borer", "खोडकिडा"]]),
    stage("tasseling", ["Tasselling & silking", "तुरा व स्त्रीकेसर येणे"], 40, 60, ["Tassels come out on top and silks appear on young cobs.", "शेंड्यावर तुरा येतो व कोवळ्या कणसांना केसर (रेशमी धागे) येतात."], [
      t("fm-irr2", 40, "irrigation", ["Do not let it go dry", "ताण पडू देऊ नका"], ["Water stress now lowers fodder yield.", "आता ताण पडल्यास चाऱ्याचे उत्पादन घटते."], 8),
      t("fm-obs2", 42, "observation", ["Check the crop", "पीक तपासा"], ["Look for leaf blight and armyworm damage.", "पानांवरील करपा व लष्करी अळीचे नुकसान पाहा."], 7),
    ], [["Leaf blight", "पानांवरील करपा"]]),
    stage("harvest", ["Harvest for fodder", "चाऱ्यासाठी कापणी"], 60, 85, ["Best fodder from 50% silking to the milk stage of cobs.", "50% केसर आल्यापासून कणसे दुधाळ अवस्थेत असेपर्यंत उत्तम चारा."], [
      t("fm-cut", 60, "harvest", ["Cut green fodder", "हिरवा चारा कापा"], ["Cut close to the ground. Cut in parts over 1–2 weeks so animals get fresh fodder daily.", "जमिनीलगत कापा. जनावरांना रोज ताजा चारा मिळावा म्हणून 1–2 आठवड्यांत टप्प्याटप्प्याने कापा."], 4),
      t("fm-silage", 65, "other", ["Make silage from the extra", "जास्तीच्या चाऱ्याचा मुरघास करा"], ["At the milk-dough stage, chop and press tightly into a pit or bags, and seal from air.", "कणसे दुधाळ-चिकट अवस्थेत असताना कुट्टी करून खड्ड्यात किंवा पिशव्यांत घट्ट दाबून भरा व हवाबंद करा."]),
    ], [["Fodder turning hard if cut late", "उशिरा कापल्यास चारा कडक होणे"]]),
  ],
  commonProblems: [
    {
      name: b("Fall armyworm", "लष्करी अळी (फॉल आर्मीवर्म)"),
      signs: b("Ragged holes in leaves, sawdust-like droppings in the whorl.", "पानांना फाटकी छिद्रे, पोंग्यात भुशासारखी विष्ठा."),
      prevention: prevent("Check the whorl twice a week in the first month, crush egg masses, and use pheromone traps. Feed fodder only after any spray's waiting period on the label.", "पहिल्या महिन्यात आठवड्यातून दोनदा पोंगा तपासा, अंडीपुंज चिरडा व कामगंध सापळे लावा. फवारणी केल्यास लेबलवरील प्रतीक्षा कालावधीनंतरच चारा जनावरांना द्या."),
    },
    {
      name: b("Stem borer", "खोडकिडा"),
      signs: b("Holes in leaves in a row and dead centre shoot in young plants.", "पानांवर ओळीने छिद्रे व कोवळ्या रोपांचा मधला कोंब वाळतो."),
      prevention: prevent("Destroy stubble after harvest and pull out dead-heart plants early.", "काढणीनंतर धसकटे नष्ट करा आणि मधला कोंब वाळलेली रोपे लवकर उपटा."),
    },
    {
      name: b("Leaf blight", "पानांवरील करपा"),
      signs: b("Long, grey-brown, boat-shaped spots on leaves in humid weather.", "दमट हवेत पानांवर लांबट, राखाडी-तपकिरी, होडीच्या आकाराचे ठिपके."),
      prevention: prevent("Rotate crops and avoid very dense sowing in the rainy season.", "पिकांची फेरपालट करा आणि पावसाळ्यात खूप दाट पेरणी टाळा."),
    },
  ],
  harvestSigns: b("About half the plants show silks, up to the milk stage of cobs (about 60–75 days).", "साधारण निम्म्या झाडांना केसर आले आहेत, ते कणसे दुधाळ होईपर्यंत (साधारण 60–75 दिवस)."),
  postHarvest: b(
    "Chop and feed fresh, mixed with legume fodder. Fodder maize makes the best silage — store extra fodder as silage for summer.",
    "कुट्टी करून शेंगवर्गीय चाऱ्यात मिसळून ताजा द्या. चारा मक्याचा मुरघास उत्तम होतो — जास्तीचा चारा उन्हाळ्यासाठी मुरघास करून ठेवा.",
  ),
  marketTips: b(
    "Green maize and silage sell well to dairy farmers, especially in summer when green fodder is short. Selling silage in sealed bags fetches a better price.",
    "हिरवा मका व मुरघासाला दूध उत्पादकांकडून चांगली मागणी असते, विशेषतः उन्हाळ्यात हिरवा चारा कमी असताना. हवाबंद पिशव्यांतील मुरघासाला जास्त दर मिळतो.",
  ),
  varieties: [
    { name: "African Tall", note: b("Tall, leafy fodder maize widely grown for green fodder and silage", "हिरवा चारा व मुरघासासाठी मोठ्या प्रमाणावर घेतला जाणारा उंच, पालेदार चारा मका") },
  ],
  source: "General practices from MPKV Rahuri forage guidance and ICAR-IGFRI (Jhansi)",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
