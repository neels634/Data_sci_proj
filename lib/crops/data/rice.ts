import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "rice",
  emoji: "🌾",
  name: b("Rice (paddy)", "भात"),
  aliases: ["rice", "paddy", "bhat", "bhaat", "dhan", "chawal", "भात", "भातशेती", "धान", "चावल", "तांदूळ", "tandul"],
  category: "cereal",
  lifecycle: "seasonal",
  regions: ["konkan", "vidarbha", "western"],
  majorDistricts: b(
    "Raigad, Ratnagiri, Sindhudurg, Thane, Palghar, Bhandara, Gondia, Chandrapur, Gadchiroli",
    "रायगड, रत्नागिरी, सिंधुदुर्ग, ठाणे, पालघर, भंडारा, गोंदिया, चंद्रपूर, गडचिरोली",
  ),
  tier: 1,
  seasons: [
    {
      season: "kharif",
      sowingWindow: b("Nursery from late May to June, with the first rains; transplant in July", "रोपवाटिका मे अखेर ते जून, पहिल्या पावसासोबत; लावणी जुलैमध्ये"),
      sowingMonths: [5, 6],
      durationDays: [115, 150],
    },
  ],
  method: "transplant",
  plantingMaterial: b("Seed, raised as seedlings in a nursery", "बियाणे; रोपवाटिकेत रोपे तयार करून"),
  nurseryDays: 25,
  soil: b(
    "Clay or clay-loam soil that holds water. Level fields with good bunds (bandh) so water stays in.",
    "पाणी धरून ठेवणारी चिकण किंवा चिकण-पोयट्याची जमीन. पाणी टिकेल अशी सपाट खाचरे व मजबूत बांध हवेत.",
  ),
  climate: b(
    "Warm and humid with heavy monsoon rain. Needs standing water for most of its life.",
    "उष्ण व दमट हवा आणि भरपूर पावसाळी पाऊस. बहुतेक काळ खाचरात पाणी लागते.",
  ),
  seedRate: b(
    "About 16–20 kg seed per acre for transplanting (less for fine-grain varieties).",
    "लावणीसाठी एकरी साधारण 16–20 किलो बियाणे (बारीक दाण्याच्या वाणांना कमी).",
  ),
  spacing: b("20 cm between rows, 15 cm between hills, 2–3 seedlings per hill.", "ओळींत 20 सेंमी, चुडांत 15 सेंमी, एका चुडात 2–3 रोपे."),
  irrigation: b(
    "Mostly rain-fed. Keep 2–5 cm of water in the field from tillering to grain filling. Never let it dry at flowering. Drain the field 7–10 days before harvest. In Vidarbha, give water from tanks or canals if the rain breaks.",
    "मुख्यतः पावसावर. फुटवे ते दाणे भरेपर्यंत खाचरात 2–5 सेंमी पाणी ठेवा. फुलोऱ्यात खाचर कधीही कोरडे पडू देऊ नका. काढणीपूर्वी 7–10 दिवस पाणी काढून टाका. विदर्भात पावसाचा खंड पडल्यास तलाव किंवा कालव्याचे पाणी द्या.",
  ),
  nutrientGuide: b(
    "Base it on a soil test. Mix green leaves of glyricidia (giripushpa) or farmyard manure into the field at puddling. Give nitrogen in 2–3 parts: at transplanting, at tillering and at panicle start. Ask your agriculture officer for the amounts.",
    "माती परीक्षणावर आधारित खत द्या. चिखलणीवेळी गिरिपुष्पाचा हिरवा पाला किंवा शेणखत गाडा. नत्र 2–3 हप्त्यांत द्या: लावणीवेळी, फुटवे येताना व लोंबी धरताना. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("nursery", ["Nursery", "रोपवाटिका"], 0, 25, ["Seeds sprout in raised beds and grow into seedlings.", "गादीवाफ्यावर बी उगवते आणि रोपे तयार होतात."], [
      t("rc-nbed", 0, "sowing", ["Prepare nursery beds and sow", "रोपवाटिका तयार करून पेरणी करा"], ["Make raised beds about 1 m wide, mix well-rotted manure and sow seed thinly in lines.", "साधारण 1 मीटर रुंद गादीवाफे करा, कुजलेले शेणखत मिसळा आणि ओळीत विरळ बी पेरा."]),
      t("rc-nwater", 1, "irrigation", ["Keep beds moist", "वाफे ओलसर ठेवा"], ["If rain is late, water the beds lightly. Do not let water stand on young seedlings.", "पाऊस लांबल्यास वाफ्यांना हलके पाणी द्या. कोवळ्या रोपांवर पाणी साचू देऊ नका."], 3),
      t("rc-nobs", 14, "observation", ["Check the seedlings", "रोपे तपासा"], ["Look for yellow seedlings and leaf spots. Seedlings are ready at 3–4 weeks with 4–5 leaves.", "पिवळी रोपे व पानांवरील ठिपके पाहा. 3–4 आठवड्यांत 4–5 पाने आल्यावर रोपे तयार होतात."]),
    ], [["Blast spots on nursery seedlings", "रोपवाटिकेत करप्याचे ठिपके"]]),
    stage("transplanting", ["Puddling & transplanting", "चिखलणी व लावणी"], 25, 32, ["Seedlings move from the nursery to the puddled main field.", "रोपे रोपवाटिकेतून चिखलणी केलेल्या खाचरात लावली जातात."], [
      t("rc-puddle", 25, "other", ["Puddle and level the field", "चिखलणी करून खाचर सपाट करा"], ["Plough in standing water, mix in green leaves or manure and level so water spreads evenly.", "पाण्यात नांगरट करा, हिरवा पाला किंवा शेणखत गाडा आणि पाणी सारखे पसरेल असे सपाट करा."]),
      t("rc-tp", 26, "transplanting", ["Transplant seedlings", "रोपांची लावणी करा"], ["Plant 2–3 seedlings per hill, 2–3 cm deep, in straight lines 20 x 15 cm.", "एका चुडात 2–3 रोपे, 2–3 सेंमी खोल, 20 x 15 सेंमी अंतरावर सरळ ओळीत लावा."]),
      t("rc-gap", 30, "other", ["Fill the gaps", "नांगे भरा"], ["Replant where seedlings died, using spare seedlings.", "मेलेल्या रोपांच्या जागी उरलेली रोपे लावा."]),
    ], [["Crabs cutting young seedlings", "खेकडे कोवळी रोपे कुरतडतात"]]),
    stage("tillering", ["Tillering", "फुटवे येणे"], 32, 65, ["Each plant makes many side shoots (tillers).", "प्रत्येक चुडाला अनेक फुटवे येतात."], [
      t("rc-water1", 32, "irrigation", ["Keep shallow water", "खाचरात थोडे पाणी ठेवा"], ["Keep 2–5 cm water. Repair bunds so rain water stays in the field.", "2–5 सेंमी पाणी ठेवा. पावसाचे पाणी टिकेल अशी बांधांची दुरुस्ती करा."], 7),
      t("rc-obs1", 35, "observation", ["Walk the field", "खाचरात फेरी मारा"], ["Look for dead centre shoots (stem borer), silver shoots (gall midge) and spots on leaves.", "मधला पोंगा वाळणे (खोडकिडा), चंदेरी पोंगा (गादमाशी) व पानांवरील ठिपके पाहा."], 7),
      t("rc-fert1", 40, "fertiliser", ["Top dressing", "वरखत"], ["Give the second nitrogen part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार नत्राचा दुसरा हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
      t("rc-weed", 45, "weeding", ["Weeding", "बेणणी"], ["Remove weeds by hand or with a weeder between rows.", "हाताने किंवा कोनो वीडरने ओळींतील तण काढा."]),
    ], [["Stem borer: dead centre shoots", "खोडकिडा: मधला पोंगा वाळतो"], ["Gall midge: hollow silver shoots", "गादमाशी: पोकळ चंदेरी पोंगा"]]),
    stage("panicle-initiation", ["Panicle starts & booting", "लोंबी धरणे व पोटरी"], 65, 90, ["The young panicle forms inside the stem and the stem swells.", "खोडाच्या आत लोंबी तयार होते व खोड फुगते."], [
      t("rc-fert2", 65, "fertiliser", ["Last nitrogen part", "नत्राचा शेवटचा हप्ता"], ["Give the last nitrogen part at panicle start, as per soil test.", "लोंबी धरताना माती परीक्षणानुसार नत्राचा शेवटचा हप्ता द्या."]),
      t("rc-obs2", 66, "observation", ["Check leaves and base of plants", "पाने व चुडांचा बुडखा तपासा"], ["Look for blast spots, yellow leaf edges (leaf blight) and hoppers at the base.", "करप्याचे ठिपके, पानांच्या कडा पिवळ्या होणे (कडा करपा) व बुडख्याशी तुडतुडे पाहा."], 7),
      t("rc-water2", 70, "irrigation", ["Keep water in the field", "खाचरात पाणी ठेवा"], ["Water shortage now reduces the number of grains.", "आता पाणी कमी पडल्यास दाण्यांची संख्या कमी होते."], 7),
    ], [["Blast", "करपा"], ["Bacterial leaf blight", "कडा करपा"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 90, 105, ["Panicles come out and flower.", "लोंब्या बाहेर येतात व फुलतात."], [
      t("rc-water3", 90, "irrigation", ["Never let the field dry", "खाचर कोरडे पडू देऊ नका"], ["Dry soil at flowering gives empty grains.", "फुलोऱ्यात जमीन कोरडी पडल्यास पोचट दाणे येतात."], 5),
      t("rc-obs3", 92, "observation", ["Check panicles", "लोंब्या तपासा"], ["Look for neck blast (neck turns black and panicle breaks) and white empty panicles.", "मानेचा करपा (मान काळी पडून लोंबी मोडते) व पांढऱ्या पोचट लोंब्या पाहा."], 5),
    ], [["Neck blast", "मानेचा करपा"], ["Brown planthopper at the base", "बुडख्याशी तपकिरी तुडतुडे"]]),
    stage("grain", ["Grain filling", "दाणे भरणे"], 105, 130, ["Grains fill: milky, then doughy, then hard.", "दाणे भरतात: दुधाळ, मग चिकट, मग टणक."], [
      t("rc-obs4", 106, "observation", ["Check grain and plant base", "दाणे व बुडखा तपासा"], ["Look for hoppers at the base and patches of drying plants (hopper burn).", "बुडख्याशी तुडतुडे व वाळलेल्या चुडांचे पट्टे पाहा."], 7),
      t("rc-bird", 110, "other", ["Protect from birds and rats", "पक्षी व उंदरांपासून संरक्षण"], ["Guard the crop in mornings and evenings; keep bunds clean to reduce rats.", "सकाळ-संध्याकाळ राखण करा; उंदीर कमी होण्यासाठी बांध स्वच्छ ठेवा."]),
      t("rc-drain", 120, "irrigation", ["Drain the field", "खाचरातील पाणी काढा"], ["Drain water 7–10 days before harvest so grains ripen evenly and harvest is easy.", "काढणीपूर्वी 7–10 दिवस पाणी काढा, म्हणजे दाणे एकसारखे पिकतात व कापणी सोपी होते."]),
    ], [["Hopper burn: round patches of dried plants", "तुडतुड्यांमुळे गोल पट्ट्यांत पीक वाळणे"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व कापणी"], 130, 150, ["Grains are hard and panicles turn golden.", "दाणे टणक होतात व लोंब्या सोनेरी होतात."], [
      t("rc-mat", 130, "observation", ["Check if ready", "तयार आहे का पाहा"], ["When 80–85% of grains in the panicle are golden and hard, harvest.", "लोंबीतील 80–85% दाणे सोनेरी व टणक झाल्यावर कापणी करा."]),
      t("rc-harv", 135, "harvest", ["Harvest and thresh", "कापणी व झोडणी करा"], ["Cut, dry the bundles 2–3 days and thresh. Dry the grain well before storing.", "कापून पेंढ्या 2–3 दिवस वाळवा व झोडणी करा. साठवण्यापूर्वी भात चांगला वाळवा."]),
    ], [["Rain at harvest makes grain sprout or turn black", "कापणीच्या वेळी पावसाने दाण्याला मोड येणे किंवा काळे पडणे"]]),
  ],
  commonProblems: [
    {
      name: b("Blast", "करपा"),
      signs: b("Spindle-shaped spots with grey centres on leaves; the panicle neck turns black and breaks.", "पानांवर राखाडी मध्यभाग असलेले डोळ्याच्या आकाराचे ठिपके; लोंबीची मान काळी पडून मोडते."),
      prevention: prevent("Use healthy seed of resistant varieties. Do not give too much nitrogen.", "प्रतिकारक वाणाचे निरोगी बियाणे वापरा. नत्र जास्त देऊ नका."),
    },
    {
      name: b("Stem borer", "खोडकिडा"),
      signs: b("Dead centre shoots in young crop; white empty panicles at flowering.", "लहान पिकात मधला पोंगा वाळतो; फुलोऱ्यात पांढऱ्या पोचट लोंब्या."),
      prevention: prevent("Cut the old crop close to the ground and plough stubble after harvest. Remove egg masses from leaf tips of seedlings before transplanting.", "कापणी जमिनीलगत करा व नंतर धसकटे नांगरून टाका. लावणीपूर्वी रोपांच्या शेंड्यांवरील अंडीपुंज काढा."),
    },
    {
      name: b("Bacterial leaf blight", "कडा करपा"),
      signs: b("Leaf edges turn yellow, then straw coloured, from the tip down.", "पानांच्या कडा शेंड्यापासून खाली पिवळ्या, मग गवतासारख्या होतात."),
      prevention: prevent("Use clean seed, avoid too much nitrogen and do not let water flow from a sick field into others.", "स्वच्छ बियाणे वापरा, नत्र जास्त देऊ नका आणि रोगट खाचरातील पाणी इतर खाचरांत जाऊ देऊ नका."),
    },
    {
      name: b("Gall midge", "गादमाशी"),
      signs: b("The centre shoot becomes a hollow, silver, onion-leaf-like tube and gives no panicle.", "मधला पोंगा कांद्याच्या पातीसारखा पोकळ चंदेरी नळी होतो व त्याला लोंबी येत नाही."),
      prevention: prevent("Transplant on time and grow resistant varieties where gall midge is common (Vidarbha).", "वेळेवर लावणी करा आणि गादमाशी जास्त असलेल्या भागात (विदर्भ) प्रतिकारक वाण घ्या."),
    },
    {
      name: b("Brown planthopper", "तपकिरी तुडतुडे"),
      signs: b("Brown hoppers crowd at the base of plants; plants dry in round patches.", "चुडांच्या बुडख्याशी तपकिरी तुडतुडे जमा होतात; पीक गोल पट्ट्यांत वाळते."),
      prevention: prevent("Do not crowd plants or overuse nitrogen. Leave a gap every few rows so air moves.", "दाट लावणी व जास्त नत्र टाळा. काही ओळींनंतर हवा खेळती राहील अशी पट्टी सोडा."),
    },
  ],
  harvestSigns: b("80–85% of grains in the panicle are golden yellow and hard.", "लोंबीतील 80–85% दाणे सोनेरी पिवळे व टणक झाले आहेत."),
  postHarvest: b(
    "Dry the paddy in the sun until a grain breaks with a click between your teeth. Clean and store in dry bags off the floor. Keep the straw dry for cattle.",
    "दात लावल्यावर दाणा कट्कन तुटेपर्यंत भात उन्हात वाळवा. साफ करून कोरड्या पोत्यांत जमिनीपासून उंचावर साठवा. पेंढा जनावरांसाठी कोरडा ठेवा.",
  ),
  marketTips: b(
    "Well-dried, clean paddy without empty grains gets a better rate. Check the support price and government paddy purchase centres. Fine and scented rice sells at a premium.",
    "पोचट दाणे नसलेल्या, चांगल्या वाळलेल्या स्वच्छ भाताला चांगला दर मिळतो. हमीभाव व शासकीय धान खरेदी केंद्रे तपासा. बारीक व सुगंधी तांदळाला जास्त दर मिळतो.",
  ),
  varieties: [
    { name: "Ratnagiri-1", note: b("Early variety from Dr. BSKKV Dapoli for Konkan", "कोकणासाठी डॉ. बाळासाहेब सावंत कोकण कृषी विद्यापीठ, दापोलीचा हळवा वाण") },
    { name: "Ratnagiri-24", note: b("Konkan variety from Dr. BSKKV Dapoli", "डॉ. बाळासाहेब सावंत कोकण कृषी विद्यापीठ, दापोलीचा कोकणासाठी वाण") },
    { name: "Karjat-3", note: b("From Regional Agricultural Research Station, Karjat (Dr. BSKKV)", "प्रादेशिक कृषी संशोधन केंद्र, कर्जत (कोकण कृषी विद्यापीठ) यांचा वाण") },
    { name: "Indrayani", note: b("Scented variety from MPKV, popular in the Sahyadri foothills", "मफुकृविचा सुगंधी वाण; सह्याद्रीच्या पायथ्याशी लोकप्रिय") },
    { name: "Sakoli-6", note: b("For Vidarbha, from Dr. PDKV rice research station, Sakoli", "विदर्भासाठी, डॉ. पंदेकृवि भात संशोधन केंद्र, साकोली यांचा वाण") },
    { name: "PKV HMT", note: b("Fine-grain variety from Dr. PDKV, Sakoli", "डॉ. पंदेकृवि, साकोली यांचा बारीक दाण्याचा वाण") },
  ],
  source: "General practices from Dr. BSKKV Dapoli, Dr. PDKV Akola (Sakoli station) and MPKV Rahuri rice guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
