import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "groundnut",
  emoji: "🥜",
  name: b("Groundnut", "भुईमूग"),
  aliases: ["groundnut", "ground nut", "peanut", "bhuimug", "bhuimoog", "bhuimug sheng", "shengdana", "moongphali", "mungfali", "भुईमूग", "भुईमुग", "शेंगदाणा", "मूंगफली"],
  category: "oilseed",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada", "konkan", "vidarbha"],
  majorDistricts: b("Kolhapur, Satara, Sangli, Pune, Jalgaon, Dhule", "कोल्हापूर, सातारा, सांगली, पुणे, जळगाव, धुळे"),
  tier: 1,
  seasons: [
    { season: "kharif", label: b("Kharif", "खरीप"), sowingWindow: b("June–July, after 75–100 mm of rain", "जून–जुलै, 75–100 मिमी पाऊस झाल्यावर"), sowingMonths: [6, 7], durationDays: [100, 120] },
    { season: "summer", label: b("Summer (irrigated)", "उन्हाळी (बागायती)"), sowingWindow: b("Mid-January to mid-February, with assured irrigation", "जानेवारीच्या मध्यापासून फेब्रुवारीच्या मध्यापर्यंत, खात्रीचे पाणी असल्यास"), sowingMonths: [1, 2], durationDays: [110, 130] },
  ],
  method: "direct",
  plantingMaterial: b("Kernels (seed) shelled from healthy, well-filled pods shortly before sowing", "निरोगी, भरलेल्या शेंगा पेरणीच्या थोडे आधी फोडून काढलेले दाणे"),
  soil: b(
    "Light to medium, well-drained, loose soil so pegs can enter and pods can be pulled out easily. Avoid heavy clay where water stands.",
    "हलकी ते मध्यम, पाण्याचा निचरा होणारी भुसभुशीत जमीन, म्हणजे आऱ्या जमिनीत सहज जातात व शेंगा सहज उपटता येतात. पाणी साचणारी चिकण जमीन टाळा.",
  ),
  climate: b(
    "Warm weather with well-spread rain in kharif. Summer groundnut gives higher yield where irrigation is assured.",
    "खरिपात उबदार हवा व विखुरलेला पाऊस. खात्रीचे पाणी असल्यास उन्हाळी भुईमुगाचे उत्पादन जास्त येते.",
  ),
  seedRate: b("About 40–50 kg kernels per acre for bunch types; bold-seeded varieties need more.", "घडाच्या (उपट्या) वाणांसाठी एकरी साधारण 40–50 किलो दाणे; मोठ्या दाण्याच्या वाणांना जास्त लागतात."),
  spacing: b("30 cm between rows and 10 cm between plants. Raised beds (broad bed and furrow) help in summer.", "ओळींत 30 सेंमी व रोपांत 10 सेंमी. उन्हाळी हंगामात रुंद वरंबा व सरी पद्धत फायदेशीर."),
  irrigation: b(
    "Kharif crop is mostly rainfed; give a protective irrigation in a long dry spell, especially at flowering, pegging and pod filling. Summer crop needs irrigation every 8–12 days depending on soil and heat; sprinkler suits it well. Never let the soil crack at pegging.",
    "खरीप पीक मुख्यतः पावसावर; मोठा खंड पडल्यास फुलोरा, आऱ्या सुटणे व शेंगा भरताना संरक्षित पाणी द्या. उन्हाळी पिकाला जमीन व उन्हानुसार 8–12 दिवसांनी पाणी लागते; तुषार सिंचन चांगले. आऱ्या सुटताना जमीन भेगाळू देऊ नका.",
  ),
  nutrientGuide: b(
    "Base it on a soil test. Mix well-rotted farmyard manure before sowing. Groundnut needs calcium and sulphur for well-filled pods — gypsum is commonly given at flowering. Ask your agriculture officer for amounts.",
    "माती परीक्षणावर आधारित खत द्या. पेरणीपूर्वी कुजलेले शेणखत मिसळा. शेंगा चांगल्या भरण्यासाठी भुईमुगाला कॅल्शियम व गंधक लागते — फुलोऱ्यात जिप्सम देण्याची पद्धत आहे. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "TAG 24", note: b("Early bunch variety from BARC, widely grown in summer and kharif", "भाभा अणुसंशोधन केंद्राचा लवकर येणारा उपट्या वाण; उन्हाळी व खरिपात मोठी लागवड") },
    { name: "JL 24 (Phule Pragati)", note: b("Early bunch variety from MPKV (Jalgaon oilseed station)", "मफुकृवि (जळगाव तेलबिया संशोधन केंद्र) चा लवकर येणारा उपट्या वाण") },
    { name: "SB XI", note: b("Old, widely grown bunch variety in Maharashtra", "महाराष्ट्रात मोठ्या प्रमाणावर घेतला जाणारा जुना उपट्या वाण") },
  ],
  stages: [
    stage("germination", ["Sowing & germination", "पेरणी व उगवण"], 0, 15, ["Seeds sprout and seedlings come up in 7–10 days.", "दाणे रुजून 7–10 दिवसांत रोपे वर येतात."], [
      t("gn-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Treat the seed as advised by your KVK, then sow 4–5 cm deep in rows 30 cm apart.", "कृषी विज्ञान केंद्राच्या सल्ल्याने बीजप्रक्रिया करा, मग 30 सेंमी ओळीत 4–5 सेंमी खोल पेरा."]),
      t("gn-irr0", 1, "irrigation", ["Light irrigation after sowing (summer)", "पेरणीनंतर हलके पाणी (उन्हाळी)"], ["For summer groundnut give a light watering right after sowing and again after 5–6 days.", "उन्हाळी भुईमुगाला पेरणीनंतर लगेच हलके पाणी द्या व 5–6 दिवसांनी पुन्हा द्या."]),
      t("gn-gap", 10, "other", ["Fill gaps", "नांग्या भरा"], ["Resow where seeds did not come up, within 10 days of sowing.", "जेथे उगवण झाली नाही तेथे पेरणीनंतर 10 दिवसांत पुन्हा पेरा."]),
    ], [["Seed rot and collar rot in seedlings", "बी कुजणे व रोपांची कॉलर रॉट"], ["Birds and squirrels digging seed", "पक्षी व खारी दाणे उकरणे"]]),
    stage("vegetative", ["Early growth", "सुरुवातीची वाढ"], 15, 30, ["Leaves and branches grow; roots go deep.", "पाने व फांद्या वाढतात; मुळे खोल जातात."], [
      t("gn-weed1", 15, "weeding", ["Weeding and hoeing", "खुरपणी व कोळपणी"], ["Do 1–2 hoeings and a hand weeding. Finish weeding before pegging starts.", "1–2 कोळपण्या व एक खुरपणी करा. आऱ्या सुटण्यापूर्वी खुरपणी संपवा."]),
      t("gn-obs1", 16, "observation", ["Check leaves", "पाने तपासा"], ["Look for leaf miner, thrips and aphids under leaves.", "पानांखाली पाने पोखरणारी अळी, फुलकिडे व मावा पाहा."], 7),
      t("gn-irr1", 20, "irrigation", ["Irrigate (summer)", "पाणी द्या (उन्हाळी)"], ["Summer crop: water every 8–12 days. Kharif: only in a long dry spell.", "उन्हाळी पीक: 8–12 दिवसांनी पाणी. खरीप: फक्त मोठ्या खंडात."], 10),
    ], [["Leaf miner", "पाने पोखरणारी अळी"], ["Thrips and aphids", "फुलकिडे व मावा"]]),
    stage("flowering", ["Flowering & pegging", "फुलोरा व आऱ्या सुटणे"], 30, 55, ["Yellow flowers come; pegs grow down and enter the soil to form pods.", "पिवळी फुले येतात; आऱ्या खाली वाढून जमिनीत शिरतात व शेंगा तयार होतात."], [
      t("gn-gyp", 35, "fertiliser", ["Give gypsum and earth up", "जिप्सम द्या व भर द्या"], ["Spread gypsum near the plants and lightly earth up so pegs enter the soil easily. Ask your agriculture officer for the amount.", "झाडांजवळ जिप्सम पसरा व हलकी भर द्या, म्हणजे आऱ्या सहज जमिनीत जातात. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
      t("gn-nodisturb", 40, "other", ["Do not disturb the soil", "जमीन हलवू नका"], ["After pegging starts, stop hoeing so pegs are not damaged.", "आऱ्या सुटू लागल्यावर कोळपणी थांबवा, म्हणजे आऱ्यांना इजा होत नाही."]),
      t("gn-irr2", 32, "irrigation", ["Keep soil moist", "जमीन ओलसर ठेवा"], ["Flowering and pegging are critical — do not let the soil dry or crack.", "फुलोरा व आऱ्या सुटणे महत्त्वाचे — जमीन कोरडी किंवा भेगाळू देऊ नका."], 8),
      t("gn-obs2", 31, "observation", ["Check for leaf eaters and spots", "पाने खाणारी अळी व ठिपके तपासा"], ["Look for Spodoptera caterpillars, leaf spots and rust.", "लष्करी अळी, पानांवरील ठिपके व तांबेरा पाहा."], 7),
    ], [["Tikka leaf spot", "टिक्का (पानांवरील ठिपके)"], ["Spodoptera (leaf-eating caterpillar)", "पाने खाणारी लष्करी अळी"]]),
    stage("pod-development", ["Pod development", "शेंगा भरणे"], 55, 90, ["Pods form underground and kernels fill.", "जमिनीखाली शेंगा तयार होतात व दाणे भरतात."], [
      t("gn-irr3", 55, "irrigation", ["Irrigate at pod filling", "शेंगा भरताना पाणी द्या"], ["Even moisture gives well-filled pods. Avoid waterlogging.", "सारख्या ओलाव्याने शेंगा चांगल्या भरतात. पाणी साचू देऊ नका."], 10),
      t("gn-obs3", 56, "observation", ["Check plants", "झाडे तपासा"], ["Look for wilting plants (stem rot), rust and leaf spots; pull out and destroy wilted plants.", "मलूल झाडे (खोड कुजणे), तांबेरा व ठिपके पाहा; मलूल झाडे उपटून नष्ट करा."], 10),
      t("gn-weed2", 60, "weeding", ["Hand-pull big weeds", "मोठे तण हाताने उपटा"], ["Pull weeds by hand without digging.", "न खोदता तण हाताने उपटा."]),
    ], [["Rust", "तांबेरा"], ["Stem rot", "खोड कुजणे"], ["White grub in light soils", "हलक्या जमिनीत हुमणी"]]),
    stage("maturity", ["Maturity", "पक्वता"], 90, 110, ["Leaves turn yellow and pod shells harden.", "पाने पिवळी पडतात व शेंगांचे टरफल टणक होते."], [
      t("gn-mat", 90, "observation", ["Check pods", "शेंगा तपासा"], ["Pull a few plants. Ready when the inside of the shell is dark and the kernel skin has its colour.", "काही झाडे उपटा. टरफलाची आतील बाजू काळपट व दाण्याच्या सालीला रंग आला की तयार."], 5),
      t("gn-irrlast", 95, "irrigation", ["Last irrigation", "शेवटचे पाणी"], ["A light irrigation before harvest makes pulling easier on hard soil.", "काढणीपूर्वी हलके पाणी दिल्यास कडक जमिनीत उपटणी सोपी होते."]),
    ], [["Pods sprouting if rain falls at maturity", "पक्वतेच्या वेळी पाऊस पडल्यास शेंगांना कोंब येणे"]]),
    stage("harvest", ["Harvest & drying", "काढणी व वाळवणी"], 110, 130, ["Plants are pulled and pods are dried.", "झाडे उपटून शेंगा वाळवल्या जातात."], [
      t("gn-harv", 110, "harvest", ["Harvest", "काढणी करा"], ["Pull plants when soil is slightly moist; pick pods left in the soil.", "जमीन थोडी ओलसर असताना झाडे उपटा; जमिनीत राहिलेल्या शेंगा वेचा."]),
      t("gn-dry", 112, "other", ["Dry the pods", "शेंगा वाळवा"], ["Dry pods in thin layers until they rattle; keep them away from rain and dew.", "शेंगा खुळखुळेपर्यंत पातळ थरात वाळवा; पाऊस व दवापासून वाचवा."]),
    ], [["Mould on pods dried in damp conditions", "ओलसर वाळवणीत शेंगांवर बुरशी"]]),
  ],
  commonProblems: [
    {
      name: b("Tikka leaf spot", "टिक्का रोग"),
      signs: b("Brown to black round spots on leaves; leaves fall early.", "पानांवर तपकिरी ते काळे गोल ठिपके; पाने लवकर गळतात."),
      prevention: prevent("Use healthy seed, rotate crops and remove volunteer plants and crop residue.", "निरोगी बियाणे वापरा, पिकांची फेरपालट करा व आधीच्या पिकाचे अवशेष आणि आपोआप उगवलेली रोपे काढा."),
    },
    {
      name: b("Rust", "तांबेरा"),
      signs: b("Orange-brown powdery spots under leaves; leaves dry.", "पानांखाली नारिंगी-तपकिरी भुकटीसारखे ठिपके; पाने वाळतात."),
      prevention: prevent("Sow on time, rotate crops and remove self-grown groundnut plants between seasons.", "वेळेवर पेरणी करा, फेरपालट करा व दोन हंगामांमध्ये आपोआप उगवलेली भुईमुगाची रोपे काढा."),
    },
    {
      name: b("Stem and collar rot", "खोड व मान कुजणे"),
      signs: b("Plants wilt; white fungal growth or dark rot at the stem base.", "झाडे मलूल होतात; खोडाच्या तळाशी पांढरी बुरशी किंवा काळपट कूज."),
      prevention: prevent("Seed treatment before sowing, crop rotation and pulling out affected plants.", "पेरणीपूर्वी बीजप्रक्रिया, फेरपालट आणि बाधित झाडे उपटून काढणे."),
    },
    {
      name: b("Leaf miner and leaf-eating caterpillars", "पाने पोखरणारी अळी व पाने खाणारी अळी"),
      signs: b("Leaves have white blisters or are folded and eaten; patches look burnt.", "पानांवर पांढरे फोड किंवा पाने गुंडाळलेली व खाल्लेली; पट्टे करपल्यासारखे दिसतात."),
      prevention: prevent("Deep summer ploughing, light traps and pheromone traps, and collecting egg masses.", "उन्हाळ्यात खोल नांगरट, प्रकाश सापळे व कामगंध सापळे आणि अंडीपुंज गोळा करणे."),
    },
    {
      name: b("White grub", "हुमणी"),
      signs: b("Plants dry in patches; C-shaped white grubs at the roots.", "झाडे पट्ट्यांत वाळतात; मुळांजवळ इंग्रजी C आकाराच्या पांढऱ्या अळ्या."),
      prevention: prevent("Deep ploughing in summer, collecting beetles after the first rains, and community control in the village.", "उन्हाळ्यात खोल नांगरट, पहिल्या पावसानंतर भुंगे गोळा करणे आणि गावपातळीवर एकत्र नियंत्रण."),
    },
  ],
  harvestSigns: b(
    "Leaves turn yellow and start dropping; the inside of the pod shell turns dark and kernels have full skin colour.",
    "पाने पिवळी पडून गळू लागतात; शेंगेच्या टरफलाची आतील बाजू काळपट होते व दाण्यांच्या सालीला पूर्ण रंग येतो.",
  ),
  postHarvest: b(
    "Dry pods well in the sun until moisture is low, clean and grade them, and store in clean gunny bags on a raised platform away from damp. Keep seed for next year in pods, not shelled.",
    "शेंगा उन्हात चांगल्या वाळवा, स्वच्छ करून प्रतवारी करा आणि ओलाव्यापासून दूर, उंच फळीवर स्वच्छ गोणपाटात साठवा. पुढच्या वर्षीचे बियाणे शेंगांतच ठेवा, फोडू नका.",
  ),
  marketTips: b(
    "Well-dried, clean, bold pods get the best rate. Compare the support price and local oil mill or trader rates before selling.",
    "चांगल्या वाळलेल्या, स्वच्छ व टपोऱ्या शेंगांना सर्वाधिक दर मिळतो. विक्रीपूर्वी हमीभाव आणि स्थानिक तेल गिरणी किंवा व्यापाऱ्यांचे दर तुलना करा.",
  ),
  source: "General practices from MPKV Rahuri (Oilseeds Research Station, Jalgaon) and ICAR groundnut guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
