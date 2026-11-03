import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "coriander-seed",
  emoji: "🟤",
  name: b("Coriander seed (dhane)", "धणे"),
  aliases: ["coriander seed", "coriander seeds", "dhane", "dhaane", "धणे", "dhaniya", "dhania", "धनिया", "sabut dhaniya", "dhane pik"],
  category: "spice",
  lifecycle: "seasonal",
  regions: ["marathwada", "vidarbha", "western"],
  tier: 2,
  seasons: [
    { season: "rabi", label: b("Rabi", "रब्बी"), sowingWindow: b("Mid-October to mid-November; rainfed on stored moisture or with a few irrigations", "ऑक्टोबर मध्य ते नोव्हेंबर मध्य; जमिनीतील ओलाव्यावर किंवा काही पाण्यांसह"), sowingMonths: [10, 11], durationDays: [90, 110] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, split into halves before sowing", "बियाणे; पेरणीपूर्वी दोन भाग करून"),
  seedRate: b("6–8 kg seed per acre.", "एकरी 6–8 किलो बियाणे."),
  spacing: b("30 cm between rows, 10–15 cm between plants.", "दोन ओळींत 30 सेंमी, दोन रोपांत 10–15 सेंमी."),
  soil: b(
    "Medium to heavy black soil that holds moisture, with good drainage.",
    "ओलावा धरून ठेवणारी, पाण्याचा निचरा होणारी मध्यम ते भारी काळी जमीन.",
  ),
  climate: b(
    "Cool, dry winter for growth and flowering. Cloudy, humid weather at flowering brings powdery mildew; frost damages flowers.",
    "वाढ व फुलोऱ्यासाठी थंड, कोरडा हिवाळा. फुलोऱ्यात ढगाळ, दमट हवेमुळे भुरी येते; दवबिंदू गोठल्यास फुलांचे नुकसान होते.",
  ),
  irrigation: b(
    "Can grow on stored soil moisture. With irrigation, give light water at sowing, branching, flowering and seed filling — about 4–5 times. Avoid water standing.",
    "जमिनीतील ओलाव्यावर येऊ शकते. पाणी असल्यास पेरणी, फांद्या फुटणे, फुलोरा व दाणे भरणे या वेळी हलके पाणी — साधारण 4–5 वेळा. पाणी साचू देऊ नका.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure before sowing. Base fertiliser on a soil test and give nitrogen in two parts, at sowing and at branching. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी चांगले कुजलेले शेणखत मिसळा. खत माती परीक्षणावर आधारित द्या आणि नत्र दोन हप्त्यांत — पेरणीवेळी व फांद्या फुटताना — द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("sowing", ["Sowing & germination", "पेरणी व उगवण"], 0, 15, ["Split seeds sprout in 10–15 days.", "दोन भाग केलेले बी 10–15 दिवसांत उगवते."], [
      t("dh-sow", 0, "sowing", ["Split seed and sow", "बी फोडून पेरणी करा"], ["Rub seed gently to split into halves, then sow in lines 30 cm apart, 2–3 cm deep.", "बी हलके चोळून दोन भाग करा, मग 30 सेंमी अंतरावर ओळीत 2–3 सेंमी खोल पेरा."]),
      t("dh-irr0", 1, "irrigation", ["Light irrigation after sowing", "पेरणीनंतर हलके पाणी"], ["If soil moisture is low, give a light watering so seeds sprout evenly.", "जमिनीत ओलावा कमी असल्यास बी एकसारखे उगवावे म्हणून हलके पाणी द्या."]),
    ], [["Patchy sprouting", "उगवण असमान"]]),
    stage("vegetative", ["Vegetative growth", "शाखीय वाढ"], 15, 45, ["Plants grow leaves and branch out.", "झाडांना पाने व फांद्या फुटतात."], [
      t("dh-thin", 20, "other", ["Thin plants", "विरळणी करा"], ["Keep plants 10–15 cm apart in the row.", "ओळीत 10–15 सेंमी अंतरावर रोपे ठेवा."]),
      t("dh-weed", 25, "weeding", ["Weeding and hoeing", "खुरपणी व कोळपणी"], ["Weed once or twice; coriander grows slowly at first and weeds take over.", "एक-दोन वेळा खुरपणी करा; सुरुवातीला धणे हळू वाढतात आणि तण जोर धरतात."], 15),
      t("dh-fert", 30, "fertiliser", ["Second nitrogen part", "नत्राचा दुसरा हप्ता"], ["Give the second part as per soil test, with irrigation. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार दुसरा हप्ता पाण्यासोबत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
      t("dh-irr1", 32, "irrigation", ["Irrigate at branching", "फांद्या फुटताना पाणी द्या"], ["Light water if the soil is drying.", "जमीन कोरडी पडत असल्यास हलके पाणी."]),
    ], [["Wilt in patches", "पट्ट्यांमध्ये मर"], ["Aphids", "मावा"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 45, 70, ["Small white-pink flower umbels open.", "लहान पांढरी-गुलाबी फुलांची छत्री उमलते."], [
      t("dh-irr2", 50, "irrigation", ["Irrigate at flowering", "फुलोऱ्यात पाणी द्या"], ["Moisture at flowering is important for seed set.", "दाणे धरण्यासाठी फुलोऱ्यात ओलावा महत्त्वाचा."]),
      t("dh-obs1", 46, "observation", ["Check for white powder and aphids", "भुरी व मावा तपासा"], ["White powder on leaves and umbels, and aphids on flowers, reduce yield a lot.", "पाने व फुलांवर पांढरी भुकटी आणि फुलांवर मावा यांमुळे उत्पादन खूप घटते."], 7),
      t("dh-bees", 48, "observation", ["Keep bees safe", "मधमाश्यांचे संरक्षण करा"], ["Bees help seed set. Avoid spraying while flowers are open in the day.", "मधमाश्या दाणे धरण्यास मदत करतात. दिवसा फुले उमललेली असताना फवारणी टाळा."]),
    ], [["Powdery mildew", "भुरी"], ["Aphids on flowers", "फुलांवर मावा"]]),
    stage("seed-fill", ["Seed filling", "दाणे भरणे"], 70, 95, ["Green seeds form and fill.", "हिरवे दाणे तयार होऊन भरतात."], [
      t("dh-irr3", 70, "irrigation", ["Irrigate at seed filling", "दाणे भरताना पाणी द्या"], ["One light watering helps seeds fill; stop after that.", "एक हलके पाणी दाणे भरण्यास मदत करते; त्यानंतर पाणी बंद करा."]),
      t("dh-obs2", 75, "observation", ["Check the crop", "पीक तपासा"], ["Look for powdery mildew and swollen galls on stems and seeds.", "भुरी आणि खोड व दाण्यांवर फुगीर गाठी पाहा."], 7),
    ], [["Stem gall (swellings on stems and seeds)", "खोडावरील गाठी (खोड व दाण्यांवर फुगवटे)"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 95, 110, ["Seeds turn from green to straw-brown and the crop is cut.", "दाणे हिरव्यापासून गवती-तपकिरी होतात आणि पीक कापले जाते."], [
      t("dh-mat", 95, "observation", ["Check maturity", "पक्वता तपासा"], ["Harvest when most umbels turn straw-brown. Late harvest makes seeds shatter and lose colour.", "बहुतेक छत्र्या गवती-तपकिरी झाल्यावर काढणी करा. उशिरा काढणी केल्यास दाणे झडतात व रंग जातो."]),
      t("dh-harv", 98, "harvest", ["Cut and stack in shade", "कापणी करून सावलीत ठेवा"], ["Cut plants in the morning, make small bundles and dry in shade for a few days.", "सकाळी झाडे कापा, लहान पेंढ्या बांधा आणि काही दिवस सावलीत वाळवा."]),
      t("dh-thresh", 104, "other", ["Thresh and clean", "मळणी व स्वच्छता"], ["Beat gently with sticks, winnow, and dry the seed in shade.", "काठीने हलके झोडपा, उफणणी करा आणि दाणे सावलीत वाळवा."]),
    ], [["Seed losing colour in strong sun or rain", "कडक ऊन किंवा पावसाने दाण्यांचा रंग जाणे"]]),
  ],
  commonProblems: [
    { name: b("Powdery mildew", "भुरी"), signs: b("White powder on leaves, stems and flower umbels; seeds stay small.", "पाने, खोड व फुलांच्या छत्रीवर पांढरी भुकटी; दाणे लहान राहतात."), prevention: prevent("Sow on time, don't crowd plants, and watch closely in cloudy weather at flowering.", "वेळेवर पेरणी करा, दाटी करू नका आणि फुलोऱ्यात ढगाळ हवेत बारीक लक्ष ठेवा.") },
    { name: b("Wilt", "मर रोग"), signs: b("Plants droop and dry in patches; roots look brown.", "झाडे पट्ट्यांमध्ये मलूल होऊन सुकतात; मुळे तपकिरी दिसतात."), prevention: prevent("Rotate crops, avoid waterlogging, and use seed from a healthy crop.", "पिकांची फेरपालट करा, पाणी साचू देऊ नका आणि निरोगी पिकातील बियाणे वापरा.") },
    { name: b("Aphids", "मावा"), signs: b("Small insects on tender shoots and flowers; flowers dry and seed set is poor.", "कोवळे शेंडे व फुलांवर लहान किडे; फुले सुकतात व दाणे कमी धरतात."), prevention: prevent("Check shoots and flowers weekly and use yellow sticky traps.", "दर आठवड्याला शेंडे व फुले तपासा आणि पिवळे चिकट सापळे लावा.") },
    { name: b("Stem gall", "खोडावरील गाठी"), signs: b("Swollen, blister-like galls on stems, leaves and seeds.", "खोड, पाने व दाण्यांवर फुगीर, फोडासारख्या गाठी."), prevention: prevent("Use clean seed, remove affected plants, and avoid coriander on the same field each year.", "स्वच्छ बियाणे वापरा, बाधित झाडे काढा आणि दरवर्षी त्याच शेतात धणे घेऊ नका.") },
  ],
  harvestSigns: b("Most umbels have turned from green to straw-brown and seeds are hard.", "बहुतेक छत्र्या हिरव्यापासून गवती-तपकिरी झाल्या आहेत आणि दाणे टणक आहेत."),
  postHarvest: b(
    "Dry bundles and seed in shade so they keep their greenish-brown colour and smell. Clean, grade, and store in clean, dry bags off the floor.",
    "धण्यांचा हिरवट-तपकिरी रंग व सुगंध टिकावा म्हणून पेंढ्या व दाणे सावलीत वाळवा. स्वच्छ करून प्रतवारी करा आणि जमिनीपासून उंच, स्वच्छ, कोरड्या पोत्यांत साठवा.",
  ),
  marketTips: b(
    "Bold, greenish, fragrant, clean seed fetches the best price; sun-bleached or rain-spotted seed sells lower. Dry seed stores well, so you can wait for a better rate.",
    "टपोऱ्या, हिरवट, सुगंधी व स्वच्छ धण्यांना सर्वाधिक दर मिळतो; उन्हाने फिकट झालेल्या किंवा पावसाने डागाळलेल्या धण्यांना कमी दर मिळतो. सुके धणे चांगले टिकतात, त्यामुळे चांगल्या दरासाठी थांबता येते.",
  ),
  varieties: [], // TODO: varieties — confirm with VNMKV Parbhani / ICAR-NRC Seed Spices for Maharashtra-grown coriander seed varieties
  source: "General practices from VNMKV Parbhani, Dr. PDKV Akola and ICAR-National Research Centre on Seed Spices coriander guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
