import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Acid lime (kagdi limbu): establishment years, then one bahar a year — hasta is preferred for summer prices. */
const crop: PerennialCrop = {
  id: "acid-lime",
  emoji: "🍋",
  name: b("Acid lime", "कागदी लिंबू"),
  aliases: ["acid lime", "lime", "limes", "limbu", "limboo", "lembu", "kagdi limbu", "kagzi lime", "kagzi nimbu", "nimbu", "neembu", "लिंबू", "कागदी लिंबू", "नींबू", "निंबू"],
  category: "fruit",
  lifecycle: "perennial",
  regions: ["western", "marathwada", "vidarbha"],
  majorDistricts: b("Ahilyanagar, Pune, Solapur, Akola, Amravati", "अहिल्यानगर, पुणे, सोलापूर, अकोला, अमरावती"),
  tier: 2,
  plantingWindow: b("June–August, in the monsoon", "जून–ऑगस्ट, पावसाळ्यात"),
  plantingMonths: [6, 7, 8],
  plantingMaterial: b("Healthy seedlings or budded plants of a known variety from a registered nursery", "नोंदणीकृत रोपवाटिकेतील खात्रीच्या वाणाची निरोगी रोपे किंवा कलमे"),
  spacing: b("6 m × 6 m (or 5 m × 5 m on lighter soil)", "6 मीटर × 6 मीटर (हलक्या जमिनीत 5 मीटर × 5 मीटर)"),
  plantsPerAcre: [110, 160],
  yearsToFirstHarvest: [3, 4],
  economicLifeYears: [15, 20],
  soil: b(
    "Light to medium, well-drained soil. Avoid heavy soil where water stands.",
    "हलकी ते मध्यम, पाण्याचा चांगला निचरा होणारी जमीन. पाणी साचणारी भारी जमीन टाळा.",
  ),
  climate: b(
    "Hot, fairly dry weather suits it. Long humid, rainy spells spread canker.",
    "उष्ण, बऱ्यापैकी कोरडे हवामान योग्य. दीर्घ दमट, पावसाळी काळात खैऱ्या पसरतो.",
  ),
  irrigation: b(
    "Drip or the double-ring basin method; keep water off the trunk. Stop water for the rest period before a bahar, then water regularly through fruit growth.",
    "ठिबक किंवा दुहेरी आळे पद्धत; पाणी खोडाला लागू देऊ नका. बहार धरण्यापूर्वी विश्रांतीसाठी पाणी बंद करा, मग फळवाढीत नियमित पाणी द्या.",
  ),
  nutrientGuide: b(
    "Base it on a soil test. Give well-rotted farmyard manure every year and split fertiliser into parts at bahar start and during fruit growth. Ask your agriculture officer for amounts.",
    "माती परीक्षणावर आधारित खत द्या. दरवर्षी कुजलेले शेणखत द्या आणि खत बहार धरताना व फळवाढीत हप्त्यांत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Sai Sharbati", note: b("Released by MPKV Rahuri", "महात्मा फुले कृषी विद्यापीठ, राहुरीचा वाण") },
    { name: "PDKV Lime", note: b("Released by Dr. PDKV Akola", "डॉ. पंजाबराव देशमुख कृषी विद्यापीठ, अकोलाचा वाण") },
    // TODO: varieties — confirm other MPKV / PDKV acid lime releases (e.g. Phule Sharbati) before adding
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Young plants are set in pits and take root.", "लहान रोपे खड्ड्यांत लावली जातात व मूळ धरतात."], [
      t("al-pit", 0, "other", ["Plant in filled pits", "भरलेल्या खड्ड्यांत लागवड करा"], ["Fill pits with topsoil and well-rotted manure, plant and stake.", "खड्डे वरची माती व कुजलेल्या शेणखताने भरा, रोप लावा व काठीचा आधार द्या."]),
      t("al-ring", 3, "other", ["Make a double-ring basin", "दुहेरी आळे करा"], ["Keep an inner ring so water does not touch the trunk.", "पाणी खोडाला लागू नये म्हणून आतले आळे ठेवा."]),
    ], [["Root rot in waterlogged pits", "पाणी साचलेल्या खड्ड्यांत मूळकूज"]]),
    stage("young-plant", ["Young plant care", "लहान झाडाची निगा"], 30, 730, ["The plant grows a single clean trunk and a balanced frame.", "झाडाचे एक स्वच्छ खोड व संतुलित सांगाडा तयार होतो."], [
      t("al-sprout", 45, "other", ["Remove low shoots", "खालची फूट काढा"], ["Keep the trunk clear up to about 50–60 cm.", "खोड साधारण 50–60 सेंमीपर्यंत मोकळे ठेवा."], 60),
      t("al-irr1", 30, "irrigation", ["Water young plants", "लहान झाडांना पाणी द्या"], ["Light, regular water in the dry months.", "कोरड्या महिन्यांत हलके, नियमित पाणी."], 7),
      t("al-obs1", 40, "observation", ["Check new leaves", "नवी पालवी तपासा"], ["Look for leaf miner lines, raised corky spots (canker) and caterpillars.", "पाने पोखरणाऱ्या अळीच्या रेषा, उंचवट्याचे खडबडीत डाग (खैऱ्या) व अळ्या पाहा."], 15),
    ], [["Canker on leaves", "पानांवर खैऱ्या"], ["Leaf miner", "पाने पोखरणारी अळी"]]),
    stage("frame", ["Building the frame", "झाडाचा विस्तार"], 730, 1095, ["The tree spreads and starts to flower. Take only a light crop.", "झाड विस्तारते व फुलू लागते. हलकेच पीक घ्या."], [
      t("al-prune1", 740, "other", ["Remove dry and diseased twigs", "वाळलेल्या व रोगट फांद्या काढा"], ["Cut out twigs with canker and dead wood; burn them.", "खैऱ्या असलेल्या फांद्या व वाळलेले लाकूड काढून जाळा."], 120),
      t("al-irr2", 731, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water in dry months.", "कोरड्या महिन्यांत नियमित पाणी."], 10),
      t("al-fym1", 750, "fertiliser", ["Give manure", "शेणखत द्या"], ["Apply well-rotted manure under the canopy edge.", "झाडाच्या घेराखाली कुजलेले शेणखत द्या."]),
    ], [["Gummosis on the trunk", "खोडावर डिंक्या"]]),
  ],
  cycles: [
    {
      key: "hasta",
      name: b("Hasta bahar", "हस्त बहार"),
      startMonths: [8, 9],
      startEvent: b("Rest in August–September, then manure and irrigation as the rains end", "ऑगस्ट–सप्टेंबरमध्ये विश्रांती, मग पाऊस संपताना शेणखत व पाणी"),
      harvestMonths: [3, 4, 5],
      note: b(
        "The preferred bahar: fruit comes in summer when lime prices are highest. Rain can upset the rest period, so it is harder to get.",
        "सर्वाधिक पसंतीचा बहार: लिंबाचे दर सर्वाधिक असताना उन्हाळ्यात फळे येतात. पावसामुळे विश्रांती बिघडू शकते, त्यामुळे हा बहार धरणे अवघड असते.",
      ),
      stages: bahar("alhs"),
    },
    {
      key: "ambia",
      name: b("Ambia bahar", "आंबिया बहार"),
      startMonths: [12, 1],
      startEvent: b("Rest in December, then irrigation in January", "डिसेंबरमध्ये विश्रांती, मग जानेवारीत पाणी"),
      harvestMonths: [7, 8, 9],
      note: b("Easy to take, but fruit comes in the rainy season when prices are low.", "धरायला सोपा, पण फळे पावसाळ्यात येतात तेव्हा दर कमी असतात."),
      stages: bahar("alam"),
    },
    {
      key: "mrig",
      name: b("Mrig bahar", "मृग बहार"),
      startMonths: [4, 5],
      startEvent: b("Rest in April–May, then flowering with the June rains", "एप्रिल–मे मध्ये विश्रांती, मग जूनच्या पावसाने फुलोरा"),
      harvestMonths: [11, 12, 1],
      note: b("Fruit comes in winter; moderate prices.", "फळे हिवाळ्यात येतात; मध्यम दर."),
      stages: bahar("almr"),
    },
  ],
  commonProblems: [
    {
      name: b("Citrus canker (khairya)", "खैऱ्या (कँकर)"),
      signs: b("Raised, rough, corky brown spots with a yellow ring on leaves, twigs and fruit; spotted fruit sells poorly.", "पाने, फांद्या व फळांवर पिवळ्या कडेचे उंचवट्याचे, खडबडीत, तपकिरी डाग; डाग असलेली फळे कमी दराने विकली जातात."),
      prevention: prevent("Use disease-free plants, prune and burn infected twigs before the rains, control leaf miner, and avoid overhead watering.", "रोगमुक्त रोपे वापरा, पावसाळ्यापूर्वी रोगट फांद्या छाटून जाळा, पाने पोखरणाऱ्या अळीचे नियंत्रण करा आणि वरून पाणी देणे टाळा."),
    },
    {
      name: b("Leaf miner", "पाने पोखरणारी अळी"),
      signs: b("Silvery, winding lines on young leaves; damaged leaves let canker in.", "कोवळ्या पानांवर चंदेरी नागमोडी रेषा; बाधित पानांतून खैऱ्या शिरतो."),
      prevention: prevent("Check every new flush and avoid unwanted flushes with timely irrigation.", "प्रत्येक नवी पालवी तपासा आणि वेळेवर पाणी देऊन नको असलेली पालवी टाळा."),
    },
    {
      name: b("Gummosis and root rot (dinkya)", "डिंक्या व मूळकूज"),
      signs: b("Gum oozing from the trunk base, rotting bark and yellowing leaves.", "खोडाच्या बुंध्यातून डिंक येणे, साल कुजणे व पाने पिवळी पडणे."),
      prevention: prevent("Use the double-ring basin, avoid waterlogging and paint the lower trunk as advised by your KVK.", "दुहेरी आळे करा, पाणी साचू देऊ नका आणि कृषी विज्ञान केंद्राच्या सल्ल्याने खोडाच्या खालच्या भागाला लेप लावा."),
    },
    {
      name: b("Citrus psylla", "सिला"),
      signs: b("Tiny insects on tender shoots; leaves curl and new growth dries.", "कोवळ्या फुटीवर लहान कीटक; पाने मुरडतात व नवी फूट सुकते."),
      prevention: prevent("Check new flushes, especially at bahar start.", "नवी पालवी तपासा, विशेषतः बहार धरताना."),
    },
  ],
  harvestSigns: b(
    "Fruit is full-sized, the skin turns smooth, thin and light green to yellow, and it is juicy. Usually 5–6 months after flowering.",
    "फळ पूर्ण आकाराचे होते, साल गुळगुळीत, पातळ व फिकट हिरवी ते पिवळी होते आणि फळ रसाळ असते. साधारण फुलोऱ्यानंतर 5–6 महिन्यांनी.",
  ),
  postHarvest: b(
    "Pick in rounds by hand or clippers, keep in shade, sort out spotted and damaged fruit, grade by size and pack in ventilated bags or crates.",
    "फेऱ्यांमध्ये हाताने किंवा कात्रीने तोडा, सावलीत ठेवा, डाग असलेली व खराब फळे वेगळी करा, आकारानुसार प्रतवारी करून हवेशीर पिशव्या किंवा क्रेटमध्ये भरा.",
  ),
  marketTips: b(
    "Summer (March–May) brings the highest lime prices, which is why farmers aim for hasta bahar. Clean, canker-free fruit sells best. Selling together through your Mandi Mitra lowers transport cost.",
    "उन्हाळ्यात (मार्च–मे) लिंबाला सर्वाधिक दर मिळतो, म्हणून शेतकरी हस्त बहार धरण्याचा प्रयत्न करतात. स्वच्छ, खैऱ्यामुक्त फळांना चांगला दर मिळतो. मंडी मित्रामार्फत एकत्र विकल्यास वाहतूक खर्च कमी होतो.",
  ),
  source: "General practices from MPKV Rahuri, Dr. PDKV Akola and ICAR-Central Citrus Research Institute, Nagpur",
  lastVerified: null,
  reviewStatus: "draft",
};

/** The yearly bahar: same stages for each bahar; task ids get a per-bahar prefix. */
function bahar(p: string) {
  return [
    stage("rest", ["Rest period", "विश्रांती"], 0, 30, ["Water is stopped so the tree rests and gets ready to flower.", "झाडाला विश्रांती मिळावी व फुलोऱ्यासाठी तयार व्हावे म्हणून पाणी बंद केले जाते."], [
      t(`${p}-rest`, 0, "other", ["Stop irrigation", "पाणी बंद करा"], ["Stop water so the tree rests. Keep the rest shorter on light soil.", "झाडाला विश्रांती मिळावी म्हणून पाणी बंद करा. हलक्या जमिनीत विश्रांती कमी ठेवा."]),
      t(`${p}-prune`, 15, "other", ["Clean the trees", "झाडांची स्वच्छता करा"], ["Cut dry and canker-affected twigs; burn the cuttings.", "वाळलेल्या व खैऱ्या असलेल्या फांद्या छाटा; छाटलेले जाळा."]),
    ], [["Canker on old twigs — prune it out now", "जुन्या फांद्यांवर खैऱ्या — आत्ताच छाटा"]]),
    stage("bahar-start", ["Bahar start", "बहार धरणे"], 30, 45, ["Manure and the first water bring flower buds and new shoots.", "शेणखत व पहिल्या पाण्याने फुलकळ्या व नवी फूट येते."], [
      t(`${p}-fym`, 30, "fertiliser", ["Give manure and fertiliser", "शेणखत व खत द्या"], ["Apply well-rotted manure and the first fertiliser part as per soil test.", "कुजलेले शेणखत व माती परीक्षणानुसार खताचा पहिला हप्ता द्या."]),
      t(`${p}-irr1`, 31, "irrigation", ["First irrigation after rest", "विश्रांतीनंतरचे पहिले पाणी"], ["Light first water, then regular water away from the trunk.", "आधी हलके पाणी, नंतर खोडापासून दूर नियमित पाणी."], 6),
    ], [["Leaf miner on new flush", "नव्या पालवीवर पाने पोखरणारी अळी"]]),
    stage("flowering", ["Flowering and fruit set", "फुलोरा व फळधारणा"], 45, 90, ["Flowers open and small fruits set.", "फुले उमलतात आणि लहान फळे धरतात."], [
      t(`${p}-irr2`, 45, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even moisture helps fruit set.", "सारख्या ओलाव्याने फळधारणा चांगली होते."], 6),
      t(`${p}-obs1`, 47, "observation", ["Check flowers and leaves", "फुले व पाने तपासा"], ["Look for psylla, leaf miner and canker spots.", "सिला, पाने पोखरणारी अळी व खैऱ्याचे डाग पाहा."], 7),
    ], [["Flower drop in hot wind", "उष्ण वाऱ्याने फुलगळ"]]),
    stage("fruit-growth", ["Fruit growth", "फळांची वाढ"], 90, 200, ["Fruits grow and fill with juice.", "फळे वाढतात व रसाने भरतात."], [
      t(`${p}-irr3`, 90, "irrigation", ["Irrigate regularly", "नियमित पाणी द्या"], ["Even water gives juicy fruit and less drop.", "सारख्या पाण्याने फळे रसाळ होतात व गळ कमी होते."], 7),
      t(`${p}-fert2`, 100, "fertiliser", ["Second fertiliser part", "खताचा दुसरा हप्ता"], ["Give the next part as per your plan.", "नियोजनानुसार पुढचा हप्ता द्या."]),
      t(`${p}-obs2`, 95, "observation", ["Check fruit", "फळे तपासा"], ["Look for canker spots on fruit and remove badly affected ones.", "फळांवर खैऱ्याचे डाग पाहा आणि जास्त बाधित फळे काढा."], 10),
    ], [["Canker on fruit", "फळांवर खैऱ्या"]]),
    stage("harvest", ["Harvest", "काढणी"], 200, 270, ["Fruits are picked in rounds as they mature.", "फळे तयार होतील तशी फेऱ्यांमध्ये तोडली जातात."], [
      t(`${p}-mat`, 200, "observation", ["Check maturity", "पक्वता तपासा"], ["Pick full-sized, smooth, juicy fruit. Check spray waiting periods on labels.", "पूर्ण आकाराची, गुळगुळीत, रसाळ फळे तोडा. लेबलवरील फवारणीचा प्रतीक्षा कालावधी तपासा."]),
      t(`${p}-pick`, 202, "harvest", ["Pick fruit", "फळे तोडा"], ["Pick every week or so; keep picked fruit in shade.", "साधारण दर आठवड्याला तोडा; तोडलेली फळे सावलीत ठेवा."], 7),
    ], [["Fruit drop before picking", "तोडणीपूर्वी फळगळ"]]),
  ];
}

export default crop;
