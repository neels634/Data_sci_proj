import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "ginger",
  emoji: "🫚",
  name: b("Ginger", "आले"),
  aliases: ["ginger", "ale", "aale", "aley", "आले", "आलं", "adrak", "adarak", "अदरक", "sunth", "सुंठ", "gingar"],
  category: "spice",
  lifecycle: "seasonal",
  regions: ["western", "marathwada"],
  majorDistricts: b("Satara, Chhatrapati Sambhajinagar, Pune", "सातारा, छत्रपती संभाजीनगर, पुणे"),
  tier: 1,
  seasons: [
    { season: "kharif", label: b("Kharif", "खरीप"), sowingWindow: b("Mid-May to mid-June with irrigation. Green ginger from about 6 months; dry ginger (sunth) at 8–9 months.", "पाण्याची सोय असल्यास मे मध्य ते जून मध्य. ओले आले साधारण 6 महिन्यांपासून; सुंठेसाठी 8–9 महिने."), sowingMonths: [5, 6], durationDays: [180, 270] },
  ],
  method: "vegetative",
  plantingMaterial: b("Healthy seed rhizome pieces (2–3 buds each) from a disease-free crop", "रोगमुक्त पिकातील निरोगी बेणे तुकडे (प्रत्येकी 2–3 डोळे)"),
  seedRate: b("6–8 quintal seed rhizomes per acre.", "एकरी 6–8 क्विंटल बेणे."),
  spacing: b("Raised beds; 30 cm between rows and 20–25 cm between plants.", "गादीवाफे; दोन ओळींत 30 सेंमी, दोन कंदांत 20–25 सेंमी."),
  soil: b(
    "Light to medium, well-drained loamy soil rich in organic matter. Ginger rots quickly in standing water — avoid heavy, waterlogged soil. Don't grow ginger on the same field every year.",
    "सेंद्रिय पदार्थ भरपूर असलेली, पाण्याचा चांगला निचरा होणारी हलकी ते मध्यम पोयट्याची जमीन. साचलेल्या पाण्यात आले लवकर कुजते — भारी, पाणथळ जमीन टाळा. दरवर्षी त्याच शेतात आले घेऊ नका.",
  ),
  climate: b(
    "Warm, humid weather with light shade suits it. Moderate rain during growth and dry weather before harvest are best.",
    "उबदार, दमट हवा व हलकी सावली योग्य. वाढीच्या काळात मध्यम पाऊस आणि काढणीपूर्वी कोरडी हवा उत्तम.",
  ),
  irrigation: b(
    "Drip on raised beds is best. Irrigate right after planting, then every 5–7 days in dry weather. In the rains only drain extra water. After the rains water every 8–10 days. Stop about 3 weeks before harvest for dry ginger.",
    "गादीवाफ्यावर ठिबक उत्तम. लागवडीनंतर लगेच पाणी, नंतर कोरड्या हवेत दर 5–7 दिवसांनी. पावसात फक्त जास्तीचे पाणी काढून द्या. पाऊस संपल्यावर दर 8–10 दिवसांनी पाणी. सुंठेसाठी काढणीपूर्वी साधारण 3 आठवडे पाणी बंद करा.",
  ),
  nutrientGuide: b(
    "Mix plenty of well-rotted farmyard manure or compost before planting. Base fertiliser on a soil test and split nitrogen into 2–3 doses with earthing up. Mulching with green leaves adds organic matter. Ask your agriculture officer for amounts.",
    "लागवडीपूर्वी भरपूर चांगले कुजलेले शेणखत किंवा कंपोस्ट मिसळा. खत माती परीक्षणावर आधारित द्या आणि नत्र 2–3 हप्त्यांत भरणीसोबत द्या. हिरव्या पानांच्या आच्छादनाने सेंद्रिय पदार्थ वाढतात. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Seed pieces are planted and sprout in 2–4 weeks.", "बेणे लावले जाते आणि 2–4 आठवड्यांत कोंब येतात."], [
      t("al-bed", 0, "other", ["Prepare raised beds", "गादीवाफे तयार करा"], ["Plough deep, mix well-rotted manure, and make raised beds with drains between them.", "खोल नांगरट करा, कुजलेले शेणखत मिसळा आणि मधे चर ठेवून गादीवाफे करा."]),
      t("al-seed", 1, "sowing", ["Treat and plant seed pieces", "बेणे प्रक्रिया करून लागवड करा"], ["Cut healthy rhizomes into pieces with 2–3 buds. Treat them as advised by your KVK, dry in shade and plant 4–5 cm deep.", "निरोगी कंदांचे 2–3 डोळे असलेले तुकडे करा. कृषी विज्ञान केंद्राच्या सल्ल्यानुसार बेणे प्रक्रिया करा, सावलीत सुकवा आणि 4–5 सेंमी खोल लावा."]),
      t("al-mulch", 3, "other", ["Mulch the beds", "वाफ्यांवर आच्छादन करा"], ["Cover beds with green leaves or straw to keep moisture and protect sprouts from heat.", "ओलावा टिकावा व कोंबांचे उन्हापासून संरक्षण व्हावे म्हणून हिरवी पाने किंवा गवताने वाफे झाका."]),
      t("al-irr0", 2, "irrigation", ["Irrigate after planting", "लागवडीनंतर पाणी द्या"], ["Keep soil moist, not wet, until sprouts come.", "कोंब येईपर्यंत माती ओलसर ठेवा, चिखल नको."], 6),
    ], [["Seed pieces rotting in wet soil", "ओल्या जमिनीत बेणे कुजणे"]]),
    stage("sprouting", ["Sprouting & early growth", "उगवण व सुरुवातीची वाढ"], 30, 60, ["Shoots come up and the first leaves open.", "कोंब बाहेर येतात व पहिली पाने उघडतात."], [
      t("al-gap", 35, "other", ["Fill gaps", "खाडे भरा"], ["Replant missing spots with spare sprouted pieces.", "राखीव कोंब फुटलेल्या तुकड्यांनी खाडे भरा."]),
      t("al-weed1", 40, "weeding", ["First weeding", "पहिली खुरपणी"], ["Weed gently by hand; don't disturb the shallow rhizomes.", "हाताने हळुवार खुरपणी करा; उथळ कंदांना धक्का लावू नका."]),
      t("al-irr1", 30, "irrigation", ["Irrigate or drain", "पाणी द्या किंवा निचरा करा"], ["Water in dry spells; in heavy rain clear drains so water leaves quickly.", "पावसाच्या खंडात पाणी द्या; जोराच्या पावसात चर मोकळे करून पाणी लवकर बाहेर काढा."], 7),
    ], [["Shoot borer: central shoot dries", "खोडकिडा: मधला कोंब सुकतो"]]),
    stage("vegetative", ["Leaf growth & tillering", "पानांची वाढ व फुटवे"], 60, 120, ["Plants put out many shoots and leaves; rhizomes start branching.", "झाडांना भरपूर फुटवे व पाने येतात; कंदांना फाटे फुटू लागतात."], [
      t("al-fert1", 60, "fertiliser", ["First top dressing", "पहिला वरखत हप्ता"], ["Give the first nitrogen part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार नत्राचा पहिला हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
      t("al-earth1", 62, "other", ["Earthing up and fresh mulch", "भरणी व नवे आच्छादन"], ["Pull soil up around plants and add another layer of mulch.", "झाडांभोवती माती चढवा आणि आच्छादनाचा आणखी एक थर द्या."]),
      t("al-obs1", 65, "observation", ["Check for yellowing and rot", "पिवळेपणा व कुज तपासा"], ["Yellow, drooping shoots that pull out easily with a rotten base mean soft rot — remove them with soil around.", "पिवळे, मलूल कोंब जे सहज उपटतात व बुंधा कुजलेला असतो म्हणजे कंदकूज — अशी झाडे भोवतालच्या मातीसह काढा."], 7),
      t("al-irr2", 61, "irrigation", ["Irrigate or drain", "पाणी द्या किंवा निचरा करा"], ["Keep the beds moist but never waterlogged.", "वाफे ओलसर ठेवा, पण पाणी कधीही साचू देऊ नका."], 7),
    ], [["Soft rot (kandkuj)", "कंदकूज"], ["Leaf spot", "पानांवरील ठिपके"]]),
    stage("rhizome-growth", ["Rhizome growth", "कंद वाढ"], 120, 180, ["Rhizomes grow fast under the soil.", "जमिनीखाली कंद झपाट्याने वाढतात."], [
      t("al-fert2", 120, "fertiliser", ["Second top dressing", "दुसरा वरखत हप्ता"], ["Give the last nitrogen part as per plan, then earth up.", "नियोजनानुसार नत्राचा शेवटचा हप्ता देऊन भरणी करा."]),
      t("al-earth2", 121, "other", ["Second earthing up", "दुसरी भरणी"], ["Cover any exposed rhizomes with soil.", "उघडे पडलेले कंद मातीने झाका."]),
      t("al-irr3", 122, "irrigation", ["Irrigate", "पाणी द्या"], ["After the rains, water every 8–10 days.", "पाऊस संपल्यावर दर 8–10 दिवसांनी पाणी द्या."], 9),
      t("al-obs2", 125, "observation", ["Walk the field", "शेतात फेरी मारा"], ["Remove rotting plants early so rot doesn't spread with water.", "कुजणारी झाडे लवकर काढा, म्हणजे पाण्यासोबत कुज पसरत नाही."], 7),
    ], [["Soft rot spreading along water channels", "पाण्याच्या पाटासोबत पसरणारी कंदकूज"]]),
    stage("green-harvest", ["Bulking (green ginger harvest window)", "कंद पोसणे (ओल्या आल्याची काढणी)"], 180, 240, ["Rhizomes are big enough for green ginger; left longer they fill and toughen for dry ginger.", "ओल्या आल्यासाठी कंद पुरेसे मोठे होतात; जास्त दिवस ठेवल्यास सुंठेसाठी भरतात व टणक होतात."], [
      t("al-green", 180, "harvest", ["Harvest green ginger (if selling fresh)", "ओले आले काढा (ताजे विकायचे असल्यास)"], ["Dig when the market rate is good; fresh ginger should be plump with thin skin.", "बाजारभाव चांगला असताना खणा; ताजे आले भरलेले व पातळ सालीचे असावे."]),
      t("al-irr4", 181, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep watering every 10–12 days if keeping the crop for dry ginger or seed.", "सुंठ किंवा बेण्यासाठी पीक ठेवत असल्यास दर 10–12 दिवसांनी पाणी देत राहा."], 10),
      t("al-seedplan", 210, "observation", ["Mark plants for seed", "बेण्यासाठी झाडे निवडा"], ["Tag healthy, rot-free clumps to keep as next year's seed.", "पुढच्या वर्षीच्या बेण्यासाठी निरोगी, कुज नसलेल्या गड्ड्यांना खूण करा."]),
    ], [["Rhizome scale and rot in late crop", "उशिराच्या पिकात कंदांवर खवले कीड व कुज"]]),
    stage("maturity", ["Maturity & harvest", "पक्वता व काढणी"], 240, 270, ["Leaves turn yellow and dry; rhizomes are mature for dry ginger and seed.", "पाने पिवळी पडून सुकतात; सुंठ व बेण्यासाठी कंद पक्व होतात."], [
      t("al-stop", 240, "other", ["Stop irrigation", "पाणी बंद करा"], ["Stop watering about 3 weeks before digging.", "खणणीपूर्वी साधारण 3 आठवडे पाणी बंद करा."]),
      t("al-dig", 255, "harvest", ["Dig the rhizomes", "आले खणा"], ["Lift clumps carefully, shake off soil and cut off dry stems and roots.", "गड्डे काळजीपूर्वक उचला, माती झटका आणि सुकलेली खोडे व मुळ्या कापा."]),
      t("al-store", 260, "other", ["Store seed rhizomes", "बेणे साठवा"], ["Keep healthy seed in a shaded pit lined and covered with dry leaves; check now and then and remove rotting pieces.", "निरोगी बेणे सावलीतील खड्ड्यात सुक्या पानांचा थर देऊन व झाकून ठेवा; मधूनमधून तपासून कुजलेले तुकडे काढा."]),
    ], [["Bruised rhizomes rot in storage", "दबलेले कंद साठवणीत कुजतात"]]),
  ],
  commonProblems: [
    {
      name: b("Soft rot (kandkuj)", "कंदकूज"),
      signs: b("Leaves yellow from the tips, shoots droop and pull out easily; the base and rhizome turn soft, watery and smelly.", "पाने शेंड्यांकडून पिवळी पडतात, कोंब मलूल होऊन सहज उपटतात; बुंधा व कंद मऊ, पाणीदार होऊन वास येतो."),
      prevention: prevent("Use seed from a rot-free field, plant on raised beds, never let water stand, rotate the field, and remove affected clumps with the soil around them.", "कुज नसलेल्या शेतातील बेणे वापरा, गादीवाफ्यावर लागवड करा, पाणी कधीही साचू देऊ नका, पिकांची फेरपालट करा आणि बाधित गड्डे भोवतालच्या मातीसह काढा."),
    },
    {
      name: b("Bacterial wilt", "जिवाणूजन्य मर"),
      signs: b("Leaves curl and the whole plant wilts quickly while still green; a cut stem oozes milky liquid.", "पाने गुंडाळतात आणि हिरवे असतानाच झाड लवकर मलूल होते; कापलेल्या खोडातून दुधासारखा स्राव येतो."),
      prevention: prevent("Use clean seed, avoid fields where ginger, tomato or brinjal had wilt, and don't let water flow from affected patches to healthy ones.", "स्वच्छ बेणे वापरा, जेथे आले, टोमॅटो किंवा वांग्यात मर आली होती ते शेत टाळा आणि बाधित भागातील पाणी निरोगी भागात जाऊ देऊ नका."),
    },
    {
      name: b("Shoot borer", "खोडकिडा"),
      signs: b("A hole in the stem with frass; the central shoot dries.", "खोडाला छिद्र व त्याजवळ विष्ठा; मधला कोंब सुकतो."),
      prevention: prevent("Check shoots regularly from July to October and cut out and destroy affected shoots.", "जुलै ते ऑक्टोबर नियमित कोंब तपासा आणि बाधित कोंब कापून नष्ट करा."),
    },
    {
      name: b("Leaf spot", "पानांवरील ठिपके"),
      signs: b("Small oval spots with a white centre and dark edge; leaves dry early.", "पांढरा मध्य व गडद कडा असलेले लहान लंबगोल ठिपके; पाने लवकर सुकतात."),
      prevention: prevent("Remove and burn badly spotted leaves, keep good drainage and use light shade where possible.", "जास्त ठिपके असलेली पाने काढून जाळा, पाण्याचा चांगला निचरा ठेवा आणि शक्य असल्यास हलकी सावली द्या."),
    },
  ],
  harvestSigns: b("Green ginger: from about 6 months, when rhizomes are plump. Dry ginger and seed: 8–9 months, when leaves turn yellow and dry.", "ओले आले: साधारण 6 महिन्यांपासून, कंद भरलेले असताना. सुंठ व बेणे: 8–9 महिन्यांनी, पाने पिवळी पडून सुकल्यावर."),
  postHarvest: b(
    "Green ginger: wash, remove roots, dry the surface in shade and pack in airy bags. Dry ginger (sunth): soak, scrape off the skin, wash and sun-dry for about 7–10 days until hard. Seed: store in a shaded pit with dry leaves.",
    "ओले आले: धुवा, मुळ्या काढा, सावलीत वरचा ओलावा सुकवा आणि हवेशीर पोत्यांत भरा. सुंठ: भिजवून साल खरवडा, धुवा आणि टणक होईपर्यंत साधारण 7–10 दिवस उन्हात वाळवा. बेणे: सावलीतील खड्ड्यात सुक्या पानांसह साठवा.",
  ),
  marketTips: b(
    "Green ginger prices change a lot from year to year. Watch rates and dig in parts if you can. Clean, plump, unbruised rhizomes sell better; selling together through your Mandi Mitra lowers transport cost.",
    "ओल्या आल्याचे दर वर्षानुवर्षे खूप बदलतात. दरावर लक्ष ठेवा आणि शक्य असल्यास टप्प्याटप्प्याने खणा. स्वच्छ, भरलेले, न दबलेले आले चांगल्या दराने विकले जाते; मंडी मित्रामार्फत एकत्र विकल्यास वाहतूक खर्च कमी होतो.",
  ),
  varieties: [
    { name: "Mahim", note: b("Traditional Maharashtra ginger, widely grown", "महाराष्ट्रातील पारंपरिक आले, मोठ्या प्रमाणात लागवड") },
    { name: "IISR Varada", note: b("High-yielding variety released by ICAR-IISR, Kozhikode", "ICAR-IISR, कोझिकोडचा जास्त उत्पादन देणारा वाण") },
  ],
  source: "General practices from MPKV Rahuri, VNMKV Parbhani and ICAR-IISR ginger guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
