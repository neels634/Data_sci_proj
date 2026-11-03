import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "berseem",
  emoji: "☘️",
  name: b("Berseem (Egyptian clover)", "बरसीम"),
  aliases: ["berseem", "barseem", "barsim", "bersim", "egyptian clover", "बरसीम", "बरसिम", "बर्सीम"],
  category: "fodder",
  lifecycle: "seasonal",
  regions: ["western", "north", "vidarbha"],
  tier: 2,
  seasons: [
    { season: "rabi", sowingWindow: b("Mid October–mid November, with assured irrigation", "ऑक्टोबरचा मध्य–नोव्हेंबरचा मध्य, खात्रीचे पाणी असल्यास"), sowingMonths: [10, 11], durationDays: [140, 170] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b(
    "Medium to heavy loamy or clay soil that holds water. Tolerates slightly salty soil better than lucerne.",
    "पाणी धरून ठेवणारी मध्यम ते भारी पोयट्याची किंवा चिकण जमीन. लसूण घासापेक्षा थोडी क्षारयुक्त जमीन जास्त सहन करते.",
  ),
  climate: b(
    "A winter crop. Cool weather gives many cuts; growth stops once summer heat starts.",
    "हिवाळी पीक. थंड हवेत अनेक कापण्या मिळतात; उन्हाळा सुरू झाला की वाढ थांबते.",
  ),
  seedRate: b("10–12 kg seed per acre, broadcast in standing water or sown in lines.", "एकरी 10–12 किलो बियाणे, वाफ्यातील पाण्यात फोकून किंवा ओळीत पेरणी."),
  spacing: b("Broadcast evenly, or lines 25–30 cm apart.", "सारखे फोकून, किंवा 25–30 सेंमी अंतरावर ओळी."),
  irrigation: b(
    "Needs frequent water: every 6–8 days at first, then every 10–12 days in winter, and after every cut. More often as it gets warm in February–March.",
    "वारंवार पाणी लागते: सुरुवातीला दर 6–8 दिवसांनी, हिवाळ्यात दर 10–12 दिवसांनी व प्रत्येक कापणीनंतर. फेब्रुवारी–मार्चमध्ये उष्णता वाढल्यावर लवकर-लवकर.",
  ),
  nutrientGuide: b(
    "Use a soil test. Mix farmyard manure before sowing. A legume — a small nitrogen starter dose and phosphorus at sowing are enough. Bio-fertiliser seed treatment helps. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. पेरणीपूर्वी शेणखत मिसळा. शेंगवर्गीय पीक — पेरणीवेळी थोडे नत्र व स्फुरद पुरेसे. जैविक खताची बीजप्रक्रिया उपयोगी. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 15, ["Small seeds sprout in moist beds.", "ओलसर वाफ्यांत बारीक बी रुजते."], [
      t("bs-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Make small level beds, fill with shallow water and broadcast seed evenly, or sow in lines in moist soil.", "लहान सपाट वाफे करा, त्यात थोडे पाणी भरून बी सारखे फोका, किंवा ओलसर जमिनीत ओळीत पेरा."]),
      t("bs-irr0", 5, "irrigation", ["Light irrigation", "हलके पाणी"], ["Give light water every 6–8 days until the crop is up.", "पीक वर येईपर्यंत दर 6–8 दिवसांनी हलके पाणी द्या."], 7),
    ], [["Uneven stand from uneven beds", "वाफे सपाट नसल्यास असमान उगवण"]]),
    stage("early-growth", ["Early growth", "सुरुवातीची वाढ"], 15, 50, ["Plants branch and cover the ground.", "रोपांना फांद्या फुटून जमीन झाकली जाते."], [
      t("bs-irr1", 16, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 8–10 days.", "दर 8–10 दिवसांनी पाणी द्या."], 9),
      t("bs-weed", 22, "weeding", ["Remove weeds", "तण काढा"], ["Pull weeds early, especially chicory-like weeds whose seed mixes with berseem seed.", "तण लवकर उपटा, विशेषतः ज्याचे बी बरसीमच्या बियाण्यात मिसळते असे तण."]),
      t("bs-obs1", 25, "observation", ["Check plants", "रोपे तपासा"], ["Look for caterpillars eating leaves and rotting at the stem base.", "पाने खाणाऱ्या अळ्या व खोडाच्या बुडाशी कुजणे पाहा."], 10),
    ], [["Caterpillars", "पाने खाणाऱ्या अळ्या"]]),
    stage("first-cut", ["First cutting", "पहिली कापणी"], 50, 60, ["The crop is ready for the first cut at 45–55 days.", "45–55 दिवसांत पहिल्या कापणीस पीक तयार होते."], [
      t("bs-cut1", 50, "harvest", ["Take the first cut", "पहिली कापणी करा"], ["Cut 5–7 cm above the ground with a sharp sickle.", "धारदार विळ्याने जमिनीपासून 5–7 सेंमी वर कापा."]),
      t("bs-irr2", 52, "irrigation", ["Water after cutting", "कापणीनंतर पाणी"], ["Irrigate within 2–3 days of cutting.", "कापणीनंतर 2–3 दिवसांत पाणी द्या."]),
    ], [["Slow regrowth if cut too low", "खूप खाली कापल्यास पुनर्वाढ मंद"]]),
    stage("cutting", ["Repeated cuttings", "पुढील कापण्या"], 60, 140, ["Fast regrowth in winter; a cut every 25–30 days.", "हिवाळ्यात जोमाने पुनर्वाढ; दर 25–30 दिवसांनी कापणी."], [
      t("bs-cut", 78, "harvest", ["Cut fodder", "चारा कापा"], ["Cut every 25–30 days.", "दर 25–30 दिवसांनी कापा."], 28),
      t("bs-irr3", 60, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 10–12 days and after each cut.", "दर 10–12 दिवसांनी व प्रत्येक कापणीनंतर पाणी द्या."], 11),
      t("bs-obs2", 65, "observation", ["Check the crop", "पीक तपासा"], ["Look for stem rot patches and caterpillars.", "खोडकुजीचे पट्टे व अळ्या पाहा."], 14),
    ], [["Stem rot in wet, crowded patches", "ओल्या, दाट पट्ट्यांत खोडकूज"]]),
    stage("last-cuts", ["Last cuttings", "शेवटच्या कापण्या"], 140, 170, ["Warm weather slows growth; take the last cut or leave it for seed.", "उष्णतेने वाढ मंदावते; शेवटची कापणी करा किंवा बियाण्यासाठी ठेवा."], [
      t("bs-cutl", 140, "harvest", ["Last cut", "शेवटची कापणी"], ["Take the last cut before plants turn hard and stemmy.", "झाडे कडक व काडीदार होण्यापूर्वी शेवटची कापणी करा."]),
      t("bs-next", 150, "other", ["Plan the next crop", "पुढच्या पिकाचे नियोजन"], ["Plough in the stubble — berseem roots leave nitrogen for the next crop.", "धसकटे नांगरून गाडा — बरसीमच्या मुळांतील नत्र पुढच्या पिकाला मिळते."]),
    ], [["Hard, stemmy fodder late in the season", "हंगामाच्या शेवटी कडक, काडीदार चारा"]]),
  ],
  flushes: {
    everyDays: 28,
    count: 5,
    note: b(
      "First cut at 45–55 days, then every 25–30 days. Usually 4–6 cuts from November to March.",
      "पहिली कापणी 45–55 दिवसांनी, नंतर दर 25–30 दिवसांनी. नोव्हेंबर ते मार्च साधारण 4–6 कापण्या.",
    ),
  },
  commonProblems: [
    {
      name: b("Stem and root rot", "खोड व मूळकूज"),
      signs: b("Plants rot at the base in patches, especially where water stands.", "विशेषतः पाणी साचलेल्या ठिकाणी झाडे बुडाशी गटागटाने कुजतात."),
      prevention: prevent("Level the beds, avoid over-watering and rotate the field.", "वाफे सपाट करा, जास्त पाणी टाळा आणि शेताची फेरपालट करा."),
    },
    {
      name: b("Leaf-eating caterpillars", "पाने खाणाऱ्या अळ्या"),
      signs: b("Leaves eaten with holes; green caterpillars on plants.", "पानांना छिद्रे; झाडांवर हिरव्या अळ्या."),
      prevention: prevent("Cut the crop a little early when caterpillars appear. Feed fodder only after any spray's waiting period on the label.", "अळ्या दिसल्यास थोडी लवकर कापणी करा. फवारणी केल्यास लेबलवरील प्रतीक्षा कालावधीनंतरच चारा जनावरांना द्या."),
    },
    {
      name: b("Bloat in cattle", "जनावरांची पोटफुगी"),
      signs: b("Animals' left belly swells after eating a lot of fresh berseem.", "भरपूर ताजा बरसीम खाल्ल्यानंतर जनावराची डावी कूस फुगते."),
      prevention: b("Never feed only berseem. Mix with dry fodder or straw. Call a veterinarian if an animal bloats.", "फक्त बरसीम कधीही देऊ नका. सुका चारा किंवा कडब्यात मिसळून द्या. पोटफुगी झाल्यास पशुवैद्यकाला बोलवा."),
    },
  ],
  harvestSigns: b("Plants are 30–45 cm tall and lush, about 25–30 days after the last cut.", "मागील कापणीनंतर साधारण 25–30 दिवसांनी झाडे 30–45 सेंमी उंच व हिरवीगार."),
  postHarvest: b(
    "Feed fresh, wilted a little and mixed with dry fodder. Extra fodder can be dried as hay in thin layers.",
    "थोडा सुकवून सुक्या चाऱ्यात मिसळून ताजा द्या. जास्तीचा चारा पातळ थरात वाळवून सुका चारा करता येतो.",
  ),
  marketTips: b(
    "Berseem is soft, protein-rich winter fodder that raises milk and cuts the cattle-feed bill. Extra fodder sells locally to dairy farmers.",
    "बरसीम हा मऊ, प्रथिनयुक्त हिवाळी चारा आहे; दूध वाढते व पशुखाद्याचा खर्च कमी होतो. जास्तीचा चारा स्थानिक दूध उत्पादकांना विकता येतो.",
  ),
  varieties: [
    { name: "Wardan", note: b("Widely grown multi-cut variety from ICAR-IGFRI, Jhansi", "मोठ्या प्रमाणावर घेतला जाणारा, अनेक कापण्या देणारा ICAR-IGFRI झाशीचा वाण") },
  ],
  source: "General practices from ICAR-IGFRI (Jhansi) and MPKV Rahuri forage guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
