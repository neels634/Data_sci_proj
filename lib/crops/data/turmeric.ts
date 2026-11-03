import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "turmeric",
  emoji: "🟡",
  name: b("Turmeric", "हळद"),
  aliases: ["turmeric", "halad", "halada", "halad pik", "हळद", "हळदी", "haldi", "hardi", "हल्दी", "tumeric", "termeric"],
  category: "spice",
  lifecycle: "seasonal",
  regions: ["western", "marathwada", "vidarbha"],
  majorDistricts: b("Sangli, Satara, Hingoli, Washim, Nanded", "सांगली, सातारा, हिंगोली, वाशिम, नांदेड"),
  tier: 1,
  seasons: [
    { season: "kharif", label: b("Kharif", "खरीप"), sowingWindow: b("Mid-May to mid-June (with irrigation); rainfed crop with the first rains in June", "मे मध्य ते जून मध्य (पाण्याची सोय असल्यास); कोरडवाहू पीक जूनमध्ये पहिल्या पावसावर"), sowingMonths: [5, 6], durationDays: [240, 270] },
  ],
  method: "vegetative",
  plantingMaterial: b("Healthy seed rhizomes — mother rhizomes (bulbs) or fingers — from a disease-free crop", "रोगमुक्त पिकातील निरोगी बेणे — मातृकंद (गड्डे) किंवा हळकुंडे (बोटे)"),
  seedRate: b("8–10 quintal seed rhizomes per acre (mother rhizomes need more weight than fingers).", "एकरी 8–10 क्विंटल बेणे (हळकुंडांपेक्षा मातृकंद वजनाने जास्त लागतात)."),
  spacing: b("Raised beds (gadi vafa) or ridges; 30–45 cm between rows and 15–20 cm between plants.", "गादीवाफे किंवा सरी-वरंबे; दोन ओळींत 30–45 सेंमी, दोन कंदांत 15–20 सेंमी."),
  soil: b(
    "Well-drained medium black or loamy soil, rich in organic matter. Standing water rots the rhizomes — avoid heavy, waterlogged fields.",
    "सेंद्रिय पदार्थ भरपूर असलेली, पाण्याचा चांगला निचरा होणारी मध्यम काळी किंवा पोयट्याची जमीन. साचलेल्या पाण्याने कंद कुजतात — भारी, पाणथळ जमीन टाळा.",
  ),
  climate: b(
    "Warm, humid weather during growth and a cool, dry period near harvest. Grows as a rainfed crop with good rain, or irrigated.",
    "वाढीच्या काळात उबदार, दमट हवा आणि काढणीच्या वेळी थंड, कोरडी हवा. चांगला पाऊस असल्यास कोरडवाहू, नाहीतर बागायती पीक.",
  ),
  irrigation: b(
    "Drip on raised beds saves water and reduces rot. Irrigate right after planting, then every 7–10 days in dry weather; in the rains only drain extra water. After the rains water every 10–15 days. Stop 3–4 weeks before harvest.",
    "गादीवाफ्यावर ठिबक दिल्यास पाणी वाचते व कंदकूज कमी होते. लागवडीनंतर लगेच पाणी, नंतर कोरड्या हवेत दर 7–10 दिवसांनी; पावसात फक्त जास्तीचे पाणी काढून द्या. पाऊस संपल्यावर दर 10–15 दिवसांनी पाणी. काढणीपूर्वी 3–4 आठवडे पाणी बंद करा.",
  ),
  nutrientGuide: b(
    "Turmeric is a heavy feeder. Mix plenty of well-rotted farmyard manure or compost before planting. Base fertiliser on a soil test and split nitrogen into 2–3 doses, given with earthing up. Mulching with leaves or crop residue adds organic matter. Ask your agriculture officer for amounts.",
    "हळद जास्त अन्नद्रव्ये घेणारे पीक आहे. लागवडीपूर्वी भरपूर चांगले कुजलेले शेणखत किंवा कंपोस्ट मिसळा. खत माती परीक्षणावर आधारित द्या आणि नत्र 2–3 हप्त्यांत भरणीसोबत द्या. पाचट किंवा पानांचे आच्छादन केल्यास सेंद्रिय पदार्थ वाढतात. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Seed rhizomes are planted and begin to sprout in 2–4 weeks.", "बेणे लावले जाते आणि 2–4 आठवड्यांत कोंब फुटू लागतात."], [
      t("hl-bed", 0, "other", ["Prepare raised beds", "गादीवाफे तयार करा"], ["Plough deep, mix well-rotted manure, and make raised beds or ridges so water never stands around rhizomes.", "खोल नांगरट करा, कुजलेले शेणखत मिसळा आणि कंदांभोवती पाणी साचणार नाही असे गादीवाफे किंवा सरी-वरंबे करा."]),
      t("hl-seed", 1, "sowing", ["Treat and plant seed rhizomes", "बेणे प्रक्रिया करून लागवड करा"], ["Pick healthy, firm rhizomes with no rot. Treat them as advised by your KVK, dry in shade and plant 5–7 cm deep with the buds facing up.", "कुज नसलेले निरोगी, टणक कंद निवडा. कृषी विज्ञान केंद्राच्या सल्ल्यानुसार बेणे प्रक्रिया करा, सावलीत सुकवा आणि डोळे वर ठेवून 5–7 सेंमी खोल लावा."]),
      t("hl-mulch", 3, "other", ["Mulch the beds", "वाफ्यांवर आच्छादन करा"], ["Cover beds with leaves, sugarcane trash or straw to keep moisture and help sprouting.", "ओलावा टिकावा व कोंब चांगले फुटावेत म्हणून पाने, उसाचे पाचट किंवा गवताने वाफे झाका."]),
      t("hl-irr0", 2, "irrigation", ["Irrigate after planting", "लागवडीनंतर पाणी द्या"], ["Keep soil moist, not wet, until sprouts come. Skip if it is raining.", "कोंब येईपर्यंत माती ओलसर ठेवा, चिखल नको. पाऊस असल्यास पाणी देऊ नका."], 7),
    ], [["Seed rhizomes rotting in wet soil", "ओल्या जमिनीत बेणे कुजणे"]]),
    stage("sprouting", ["Sprouting & early growth", "उगवण व सुरुवातीची वाढ"], 30, 60, ["Shoots come up and the first leaves open.", "कोंब बाहेर येतात व पहिली पाने उघडतात."], [
      t("hl-gap", 35, "other", ["Fill gaps", "खाडे भरा"], ["Replant where rhizomes did not sprout, using spare sprouted rhizomes.", "जेथे कोंब आले नाहीत तेथे राखीव कोंब फुटलेले कंद लावा."]),
      t("hl-weed1", 40, "weeding", ["First weeding", "पहिली खुरपणी"], ["Weed by hand carefully; young shoots break easily.", "हाताने काळजीपूर्वक खुरपणी करा; कोवळे कोंब सहज मोडतात."]),
      t("hl-irr1", 30, "irrigation", ["Irrigate in dry spells", "पावसाच्या खंडात पाणी द्या"], ["Give water every 7–10 days if there is no rain; drain any standing water.", "पाऊस नसल्यास दर 7–10 दिवसांनी पाणी द्या; साचलेले पाणी काढून द्या."], 8),
    ], [["Shoot borer: central shoot dries (dead heart)", "खोडकिडा: मधला कोंब सुकतो"]]),
    stage("vegetative", ["Leaf growth", "पानांची वाढ"], 60, 120, ["Plants grow tall and put out many leaves and side shoots.", "झाडे उंच वाढतात आणि भरपूर पाने व फुटवे येतात."], [
      t("hl-fert1", 60, "fertiliser", ["First top dressing", "पहिला वरखत हप्ता"], ["Give the first nitrogen part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार नत्राचा पहिला हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
      t("hl-earth1", 62, "other", ["First earthing up", "पहिली भरणी"], ["Pull soil up around the plants after feeding so rhizomes stay covered.", "खत दिल्यानंतर झाडांभोवती माती चढवा, म्हणजे कंद झाकलेले राहतात."]),
      t("hl-weed2", 75, "weeding", ["Weeding", "खुरपणी"], ["Keep beds weed-free; weeds compete strongly now.", "वाफे तणमुक्त ठेवा; आता तण जोरदार स्पर्धा करतात."]),
      t("hl-obs1", 65, "observation", ["Check leaves and shoots", "पाने व कोंब तपासा"], ["Look for brown spots or blotches on leaves, dried central shoots and yellowing plants.", "पानांवर तपकिरी ठिपके किंवा करपा, सुकलेले मधले कोंब आणि पिवळी पडणारी झाडे आहेत का पाहा."], 10),
      t("hl-irr2", 61, "irrigation", ["Irrigate or drain", "पाणी द्या किंवा निचरा करा"], ["Water in dry spells; in heavy rain open channels so water drains fast.", "पावसाच्या खंडात पाणी द्या; जोराच्या पावसात चर काढून पाणी लवकर बाहेर काढा."], 10),
    ], [["Leaf spot and leaf blotch (karpa)", "पानांवरील ठिपके व करपा"], ["Rhizome rot in waterlogged spots", "पाणी साचलेल्या जागी कंदकूज"]]),
    stage("tillering", ["Tillering & rhizome start", "फुटवे व कंद धरणे"], 120, 180, ["Side shoots increase and rhizomes start to branch and grow under the soil.", "फुटवे वाढतात आणि जमिनीखाली कंदांना फाटे फुटून वाढ सुरू होते."], [
      t("hl-fert2", 120, "fertiliser", ["Second top dressing", "दुसरा वरखत हप्ता"], ["Give the last nitrogen part now as per your plan. No nitrogen after this.", "नियोजनानुसार नत्राचा शेवटचा हप्ता आता द्या. यानंतर नत्र देऊ नका."]),
      t("hl-earth2", 122, "other", ["Second earthing up", "दुसरी भरणी"], ["Earth up again so growing rhizomes are not exposed to sun.", "वाढणारे कंद उन्हात उघडे पडू नयेत म्हणून पुन्हा भरणी करा."]),
      t("hl-irr3", 121, "irrigation", ["Irrigate", "पाणी द्या"], ["After the rains, water every 10–12 days. Even moisture builds bigger rhizomes.", "पाऊस संपल्यावर दर 10–12 दिवसांनी पाणी द्या. सारख्या ओलाव्याने कंद मोठे होतात."], 10),
      t("hl-obs2", 125, "observation", ["Check for rot and pests", "कंदकूज व कीड तपासा"], ["Yellow, drooping plants with soft, smelly rhizomes mean rot — remove them with soil around.", "पिवळी, मलूल झाडे व मऊ, वास येणारे कंद म्हणजे कंदकूज — अशी झाडे भोवतालच्या मातीसह काढा."], 10),
    ], [["Rhizome rot", "कंदकूज"], ["Rhizome fly maggots in rotting rhizomes", "कुजलेल्या कंदांत कंदमाशीच्या अळ्या"]]),
    stage("bulking", ["Rhizome bulking", "कंद पोसणे"], 180, 240, ["Rhizomes fill out and gain weight and colour.", "कंद भरतात, वजन व रंग वाढतो."], [
      t("hl-irr4", 180, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 12–15 days; don't let the soil crack.", "दर 12–15 दिवसांनी पाणी द्या; जमीन भेगाळू देऊ नका."], 12),
      t("hl-obs3", 182, "observation", ["Walk the field", "शेतात फेरी मारा"], ["Remove rotting plants and keep an eye on leaf spots.", "कुजणारी झाडे काढा आणि पानांवरील ठिपक्यांवर लक्ष ठेवा."], 14),
      t("hl-seedplan", 220, "observation", ["Mark plants for next year's seed", "पुढच्या वर्षीच्या बेण्यासाठी झाडे निवडा"], ["Tag healthy, vigorous, disease-free plants to keep their rhizomes as seed.", "बेणे म्हणून ठेवण्यासाठी निरोगी, जोमदार, रोगमुक्त झाडांना खूण करा."]),
    ], [["Scale insects on rhizomes", "कंदांवर खवले कीड"]]),
    stage("maturity", ["Maturity", "पक्वता"], 240, 255, ["Leaves turn yellow and dry from the tips; the crop is nearly ready.", "पाने शेंड्यांकडून पिवळी पडून सुकतात; पीक तयार होत आले."], [
      t("hl-stop", 240, "other", ["Stop irrigation", "पाणी बंद करा"], ["Stop watering 3–4 weeks before harvest so rhizomes harden and dig out clean.", "काढणीपूर्वी 3–4 आठवडे पाणी बंद करा, म्हणजे कंद टणक होतात व स्वच्छ निघतात."]),
      t("hl-mat", 245, "observation", ["Check maturity", "पक्वता तपासा"], ["Ready when most leaves and stems have dried. Dig a few plants to check rhizome size.", "बहुतेक पाने व खोडे सुकली की पीक तयार. काही झाडे खणून कंदांचा आकार पाहा."]),
    ], [["Rain at maturity delays harvest and causes rot", "पक्वतेच्या वेळी पावसाने काढणी लांबते व कंदकूज होते"]]),
    stage("harvest", ["Harvest", "काढणी"], 255, 270, ["Rhizomes are dug out, cleaned and sorted.", "कंद खणून काढले जातात, स्वच्छ करून वेगळे केले जातात."], [
      t("hl-cut", 255, "other", ["Cut the dry tops", "सुकलेला पाला कापा"], ["Cut dry leaves and stems close to the ground a few days before digging.", "खणणीपूर्वी काही दिवस सुकलेली पाने व खोडे जमिनीलगत कापा."]),
      t("hl-dig", 258, "harvest", ["Dig the rhizomes", "हळद खणा"], ["Dig carefully with a pick or plough, lift clumps whole and shake off soil.", "कुदळ किंवा नांगराने काळजीपूर्वक खणा, गड्डे पूर्ण उचला आणि माती झटका."]),
      t("hl-sort", 262, "other", ["Separate mother rhizomes and fingers", "गड्डे व हळकुंडे वेगळी करा"], ["Separate bulbs (gadde) from fingers. Keep healthy seed rhizomes in a shaded pit or heap covered with leaves; send the rest for boiling.", "गड्डे व हळकुंडे वेगळी करा. निरोगी बेणे सावलीतील खड्ड्यात किंवा पानांनी झाकलेल्या ढिगात ठेवा; उरलेली हळद शिजवण्यासाठी पाठवा."]),
    ], [["Cut or bruised rhizomes rot in storage", "कापलेले किंवा दबलेले कंद साठवणीत कुजतात"]]),
  ],
  commonProblems: [
    {
      name: b("Rhizome rot (kandkuj)", "कंदकूज"),
      signs: b("Leaves yellow from the edges, plants droop and the shoot base turns soft. Rhizomes become soft, brown and smelly.", "पाने कडांपासून पिवळी पडतात, झाडे मलूल होतात व कोंबाचा बुंधा मऊ होतो. कंद मऊ, तपकिरी होऊन वास येतो."),
      prevention: prevent("Use healthy seed from a rot-free field, plant on raised beds, never let water stand, and remove affected plants with the soil around them.", "कंदकूज नसलेल्या शेतातील निरोगी बेणे वापरा, गादीवाफ्यावर लागवड करा, पाणी कधीही साचू देऊ नका आणि बाधित झाडे भोवतालच्या मातीसह काढा."),
    },
    {
      name: b("Leaf spot and leaf blotch (karpa)", "पानांवरील ठिपके व करपा"),
      signs: b("Brown oval spots with a grey centre, or many small yellowish-brown spots that join; leaves dry early.", "राखाडी मध्य असलेले तपकिरी लंबगोल ठिपके, किंवा एकमेकांत मिसळणारे अनेक लहान पिवळसर-तपकिरी ठिपके; पाने लवकर सुकतात."),
      prevention: prevent("Use clean seed, remove and burn badly spotted leaves, and avoid planting turmeric on the same field year after year.", "स्वच्छ बेणे वापरा, जास्त ठिपके असलेली पाने काढून जाळा आणि दरवर्षी त्याच शेतात हळद घेणे टाळा."),
    },
    {
      name: b("Shoot borer", "खोडकिडा"),
      signs: b("A hole in the stem with frass; the central shoot dries (dead heart).", "खोडाला छिद्र व त्याजवळ विष्ठा; मधला कोंब सुकतो."),
      prevention: prevent("Check shoots regularly from July to October and cut out and destroy affected shoots.", "जुलै ते ऑक्टोबर नियमित कोंब तपासा आणि बाधित कोंब कापून नष्ट करा."),
    },
    {
      name: b("Rhizome fly", "कंदमाशी"),
      signs: b("Maggots inside rotting rhizomes; plants yellow and wilt.", "कुजलेल्या कंदांत अळ्या; झाडे पिवळी पडून मलूल होतात."),
      prevention: prevent("Use clean seed, remove rotting plants early and keep the field well drained.", "स्वच्छ बेणे वापरा, कुजणारी झाडे लवकर काढा आणि शेतात पाण्याचा चांगला निचरा ठेवा."),
    },
    {
      name: b("Scale insects on rhizomes", "कंदांवरील खवले कीड"),
      signs: b("Small grey-brown scales on rhizomes in the field and in seed storage; rhizomes shrivel.", "शेतात व बेणे साठवणीत कंदांवर लहान राखाडी-तपकिरी खवले; कंद सुरकुततात."),
      prevention: prevent("Store only clean, healthy seed rhizomes and throw away badly infested ones.", "फक्त स्वच्छ, निरोगी बेणे साठवा आणि जास्त प्रादुर्भाव असलेले कंद फेकून द्या."),
    },
  ],
  harvestSigns: b("Leaves and stems turn yellow and dry, 8–9 months after planting (usually January–March).", "लागवडीनंतर 8–9 महिन्यांनी (साधारण जानेवारी–मार्च) पाने व खोडे पिवळी पडून सुकतात."),
  postHarvest: b(
    "Cure the fresh rhizomes within 2–3 days of digging. Boil them in water (in pans or a steam boiler) until soft — a stick pierces them easily. Spread on a clean floor or tarpaulin and sun-dry for 10–15 days until hard and they break with a metallic snap. Polish in a rotating drum to remove skin and roots, keep fingers and bulbs separate, grade, and store in clean, dry bags.",
    "खणल्यानंतर 2–3 दिवसांत ओली हळद शिजवा. कढईत किंवा वाफेच्या बॉयलरमध्ये कंद मऊ होईपर्यंत — काडी सहज घुसेपर्यंत — शिजवा. स्वच्छ खळ्यावर किंवा ताडपत्रीवर पसरून 10–15 दिवस उन्हात वाळवा, कंद टणक होऊन मोडताना खट्ट आवाज येईपर्यंत. फिरत्या ड्रममध्ये पॉलिश करून साल व मुळ्या काढा, हळकुंडे व गड्डे वेगळे ठेवा, प्रतवारी करा आणि स्वच्छ, कोरड्या पोत्यांत साठवा.",
  ),
  marketTips: b(
    "Sangli is a major turmeric market; Hingoli and Nanded also have big turmeric trade. Well-polished, bright yellow, hard fingers get the best price, and fingers sell above bulbs. Dry turmeric stores well, so you can hold it for a better rate.",
    "सांगली ही हळदीची मोठी बाजारपेठ आहे; हिंगोली व नांदेड येथेही हळदीचा मोठा व्यापार होतो. चांगली पॉलिश केलेली, चमकदार पिवळी, टणक हळकुंडे यांना सर्वाधिक दर मिळतो आणि हळकुंडांना गड्ड्यांपेक्षा जास्त दर मिळतो. वाळलेली हळद चांगली टिकते, त्यामुळे चांगल्या दरासाठी थांबता येते.",
  ),
  varieties: [
    { name: "Salem", note: b("Widely grown in Sangli and Satara; good yield and colour", "सांगली व सातारा भागात मोठ्या प्रमाणात लागवड; चांगले उत्पादन व रंग") },
    { name: "Rajapuri", note: b("Traditional Maharashtra turmeric with bright colour and plump fingers", "चमकदार रंग व जाड हळकुंडांची महाराष्ट्रातील पारंपरिक हळद") },
    { name: "Phule Swarupa", note: b("Released by MPKV Rahuri (Turmeric Research Station, Kasbe Digraj)", "मफुकृवि राहुरीचा वाण (हळद संशोधन केंद्र, कसबे डिग्रज)") },
  ],
  source: "General practices from MPKV Rahuri (Turmeric Research Station, Kasbe Digraj), VNMKV Parbhani and ICAR-IISR turmeric guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
