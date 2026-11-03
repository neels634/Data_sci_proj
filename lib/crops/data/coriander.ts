import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "coriander",
  emoji: "🌿",
  name: b("Coriander leaves (kothimbir)", "कोथिंबीर"),
  aliases: ["kothimbir", "kothimbeer", "kotimbir", "कोथिंबीर", "कोथिंबिर", "coriander leaves", "coriander", "dhaniya patta", "dhania patta", "cilantro", "हरा धनिया"],
  category: "leafy",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada", "vidarbha", "konkan"],
  majorDistricts: b("Pune, Nashik, Ahilyanagar, Solapur (near city markets)", "पुणे, नाशिक, अहिल्यानगर, सोलापूर (शहरी बाजारांजवळ)"),
  tier: 2,
  seasons: [
    { season: "kharif", label: b("Kharif", "खरीप"), sowingWindow: b("June–July, on raised beds", "जून–जुलै, गादीवाफ्यांवर"), sowingMonths: [6, 7], durationDays: [35, 50] },
    { season: "rabi", label: b("Rabi", "रब्बी"), sowingWindow: b("October–December (easiest season)", "ऑक्टोबर–डिसेंबर (सर्वात सोपा हंगाम)"), sowingMonths: [10, 11, 12], durationDays: [35, 55] },
    { season: "summer", label: b("Summer", "उन्हाळी"), sowingWindow: b("February–April; needs frequent water, prices are often high", "फेब्रुवारी–एप्रिल; वारंवार पाणी लागते, दर बहुधा जास्त असतात"), sowingMonths: [2, 3, 4], durationDays: [35, 45] },
  ],
  method: "direct",
  plantingMaterial: b("Seed (dhane), split into halves before sowing", "बियाणे (धणे); पेरणीपूर्वी दोन भाग करून"),
  seedRate: b("25–30 kg seed per acre for leaf bunches (much more than for a seed crop).", "कोथिंबिरीसाठी एकरी 25–30 किलो बियाणे (धण्याच्या पिकापेक्षा बरेच जास्त)."),
  spacing: b("Sow in lines 15–20 cm apart, or broadcast evenly on small flat beds.", "15–20 सेंमी अंतरावर ओळीत पेरा, किंवा लहान सपाट वाफ्यांत एकसारखे फोकून पेरा."),
  soil: b(
    "Loamy or medium black soil with good drainage and plenty of organic matter.",
    "पाण्याचा चांगला निचरा होणारी, सेंद्रिय पदार्थ भरपूर असलेली पोयट्याची किंवा मध्यम काळी जमीन.",
  ),
  climate: b(
    "Grows best in cool weather. In summer it needs frequent water and light shade helps; heavy rain causes rot.",
    "थंड हवेत सर्वात चांगली वाढते. उन्हाळ्यात वारंवार पाणी लागते व हलकी सावली उपयोगी पडते; जोराच्या पावसात सड होते.",
  ),
  irrigation: b(
    "Water right after sowing and keep the top soil moist until seeds sprout (8–12 days). Then light water every 4–6 days; more often in summer. Never let water stand.",
    "पेरणीनंतर लगेच पाणी द्या आणि बी उगवेपर्यंत (8–12 दिवस) वरची माती ओलसर ठेवा. नंतर दर 4–6 दिवसांनी हलके पाणी; उन्हाळ्यात लवकर. पाणी कधीही साचू देऊ नका.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure or compost before sowing. Give a light nitrogen dose about 15–20 days after sprouting if leaves look pale, as per soil test. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी चांगले कुजलेले शेणखत किंवा कंपोस्ट मिसळा. उगवणीनंतर 15–20 दिवसांनी पाने फिकट दिसल्यास माती परीक्षणानुसार थोडे नत्र द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("sowing", ["Sowing & germination", "पेरणी व उगवण"], 0, 12, ["Split seeds sprout slowly, in 8–12 days.", "दोन भाग केलेले बी हळू, 8–12 दिवसांत उगवते."], [
      t("kt-split", 0, "sowing", ["Split seed and sow", "बी फोडून पेरणी करा"], ["Rub seed gently to split each into two halves. Soak overnight, dry in shade, then sow in lines and cover lightly.", "बी हलके चोळून दोन भाग करा. रात्रभर भिजवा, सावलीत सुकवा, मग ओळीत पेरा व हलके झाका."]),
      t("kt-irr0", 1, "irrigation", ["Keep beds moist", "वाफे ओलसर ठेवा"], ["Light water every 2–3 days until seeds sprout. A dry crust on top stops sprouting.", "बी उगवेपर्यंत दर 2–3 दिवसांनी हलके पाणी. वरची माती कडक झाल्यास उगवण होत नाही."], 3),
    ], [["Poor or uneven sprouting", "उगवण कमी किंवा असमान"]]),
    stage("early-growth", ["Early growth", "सुरुवातीची वाढ"], 12, 25, ["Seedlings grow their first leaves.", "रोपांना पहिली पाने येतात."], [
      t("kt-irr1", 12, "irrigation", ["Irrigate", "पाणी द्या"], ["Light water every 4–6 days.", "दर 4–6 दिवसांनी हलके पाणी."], 5),
      t("kt-weed", 16, "weeding", ["Weeding", "खुरपणी"], ["Weed carefully by hand; weeds in bunches lower the price.", "हाताने काळजीपूर्वक तण काढा; जुडीत तण असल्यास दर कमी मिळतो."]),
      t("kt-fert", 22, "fertiliser", ["Light feeding if pale", "पाने फिकट असल्यास थोडे खत"], ["Give a little nitrogen only if leaves look pale, then water. Ask your agriculture officer for the amount.", "पाने फिकट दिसली तरच थोडे नत्र देऊन पाणी द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Damping off in wet soil", "ओल्या जमिनीत रोपे कोलमडणे"]]),
    stage("leaf-growth", ["Leaf growth", "पानांची वाढ"], 25, 35, ["Plants grow bushy and fragrant.", "रोपे झुडपासारखी वाढतात व सुगंधी होतात."], [
      t("kt-irr2", 25, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep moisture even; stress makes plants flower early.", "ओलावा सारखा ठेवा; ताण पडल्यास रोपे लवकर फुलावर येतात."], 5),
      t("kt-obs1", 26, "observation", ["Check plants", "रोपे तपासा"], ["Look for white powder on leaves, aphids and wilting plants.", "पानांवर पांढरी भुकटी, मावा व मलूल रोपे आहेत का पाहा."], 5),
    ], [["Powdery mildew", "भुरी"], ["Wilt", "मर रोग"]]),
    stage("harvest", ["Harvest", "काढणी"], 35, 55, ["Plants are ready for bunches before they start flowering.", "फुलावर येण्यापूर्वी रोपे जुड्यांसाठी तयार होतात."], [
      t("kt-harv", 35, "harvest", ["Harvest", "काढणी करा"], ["Pull whole plants with roots in the cool morning, or cut 4–5 cm above the ground for a second cut.", "सकाळी थंड वेळेत मुळांसकट रोपे उपटा, किंवा दुसऱ्या कापणीसाठी जमिनीपासून 4–5 सेंमी वर कापा."]),
      t("kt-irr3", 36, "irrigation", ["Water after cutting", "कापणीनंतर पाणी द्या"], ["If you cut instead of pulling, water soon so new shoots come.", "उपटण्याऐवजी कापले असल्यास लगेच पाणी द्या, म्हणजे नवी फूट येते."], 5),
      t("kt-cut2", 50, "harvest", ["Second cutting (if regrown)", "दुसरी कापणी (पुन्हा वाढली असल्यास)"], ["Cut the regrowth before flower stalks appear.", "फुलांचे दांडे येण्यापूर्वी नवी वाढ कापा."]),
    ], [["Plants flowering early in heat", "उष्णतेमुळे लवकर फुलावर येणे"]]),
  ],
  flushes: { everyDays: 15, count: 1, note: b("Most farmers pull the whole crop at 35–45 days. In cool weather one more cutting is possible about 15 days after the first.", "बहुतेक शेतकरी 35–45 दिवसांनी संपूर्ण पीक उपटतात. थंड हवेत पहिल्या कापणीनंतर साधारण 15 दिवसांनी आणखी एक कापणी मिळू शकते.") },
  commonProblems: [
    { name: b("Powdery mildew", "भुरी"), signs: b("White powder on leaves and stems; leaves turn pale and the bunch looks dull.", "पानांवर व खोडांवर पांढरी भुकटी; पाने फिकट होतात व जुडी निस्तेज दिसते."), prevention: prevent("Don't sow too thick, keep good air flow and harvest on time.", "दाट पेरणी करू नका, हवा खेळती ठेवा आणि वेळेवर काढणी करा.") },
    { name: b("Wilt", "मर रोग"), signs: b("Plants droop and dry, often in patches; roots look brown.", "रोपे मलूल होऊन सुकतात, बहुधा पट्ट्यांमध्ये; मुळे तपकिरी दिसतात."), prevention: prevent("Use raised beds with good drainage, avoid over-watering and don't grow coriander on the same plot again and again.", "चांगला निचरा होणारे गादीवाफे वापरा, जास्त पाणी देऊ नका आणि त्याच जागी पुन्हा पुन्हा कोथिंबीर घेऊ नका.") },
    { name: b("Aphids", "मावा"), signs: b("Small insects on tender shoots; leaves curl and become sticky.", "कोवळ्या शेंड्यांवर लहान किडे; पाने मुरगळतात व चिकट होतात."), prevention: prevent("Check shoots often and use yellow sticky traps. Leaves are eaten fresh, so always respect the waiting period on any label.", "शेंडे वारंवार तपासा आणि पिवळे चिकट सापळे लावा. कोथिंबीर ताजी खाल्ली जाते, त्यामुळे लेबलवरील प्रतीक्षा कालावधी नक्की पाळा.") },
  ],
  harvestSigns: b("Plants are 15–20 cm tall, bushy and fragrant, before any flower stalks — about 35–45 days after sowing.", "पेरणीनंतर साधारण 35–45 दिवसांनी, फुलांचे दांडे येण्यापूर्वी, रोपे 15–20 सेंमी उंच, झुडपासारखी व सुगंधी होतात."),
  postHarvest: b(
    "Wash soil off the roots, remove yellow leaves, tie in bunches and keep in shade, lightly sprinkled with water. Coriander wilts fast — sell the same day.",
    "मुळांची माती धुवा, पिवळी पाने काढा, जुड्या बांधा आणि थोडे पाणी शिंपडून सावलीत ठेवा. कोथिंबीर लवकर सुकते — त्याच दिवशी विका.",
  ),
  marketTips: b(
    "Prices swing a lot: high in summer and heavy rain, low in winter gluts. Sowing small plots every 10–15 days spreads the risk. Fresh, green, fragrant bunches sell first.",
    "दरात खूप चढउतार होतात: उन्हाळ्यात व जोराच्या पावसात जास्त, हिवाळ्यात आवक वाढल्यावर कमी. दर 10–15 दिवसांनी लहान वाफ्यांत पेरणी केल्यास धोका कमी होतो. ताज्या, हिरव्या, सुगंधी जुड्या आधी विकल्या जातात.",
  ),
  varieties: [], // TODO: varieties — confirm leaf-type coriander varieties with MPKV Rahuri / ICAR-NRC Seed Spices
  source: "General practices from MPKV Rahuri and ICAR-IIVR leafy vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
