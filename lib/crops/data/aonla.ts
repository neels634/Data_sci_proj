import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Aonla: flowers with new leaves in spring, small fruits stay dormant through summer, grow in the rains. */
const crop: PerennialCrop = {
  id: "aonla",
  emoji: "🟢",
  name: b("Aonla (Indian gooseberry)", "आवळा"),
  aliases: ["aonla", "amla", "awla", "awala", "avla", "aamla", "indian gooseberry", "आवळा", "आवळे", "आंवला", "आमला"],
  category: "fruit",
  lifecycle: "perennial",
  regions: ["western", "marathwada", "vidarbha", "north"],
  tier: 2,
  plantingWindow: b("June–August, with the monsoon", "जून–ऑगस्ट, पावसाळ्यात"),
  plantingMonths: [6, 7, 8],
  plantingMaterial: b("Grafted or budded plants of a known variety; plant two or more varieties together for better fruit set", "खात्रीच्या वाणाची कलमे; चांगल्या फळधारणेसाठी दोन किंवा जास्त वाण एकत्र लावा"),
  spacing: b("7–8 m between rows and 7–8 m between plants", "दोन ओळींत 7–8 मीटर व दोन झाडांत 7–8 मीटर"),
  plantsPerAcre: [60, 85],
  yearsToFirstHarvest: [3, 4],
  economicLifeYears: [30, 50],
  soil: b(
    "Very hardy. Grows on light, stony, and even slightly salty or alkaline soils; best on well-drained medium soil.",
    "खूप काटक. हलकी, मुरमाड व थोडी खारवट-चोपण जमिनीतही येते; चांगला निचरा होणारी मध्यम जमीन उत्तम.",
  ),
  climate: b(
    "Dry tropical climate. Tolerates drought and hot summers well once established.",
    "कोरडे उष्ण हवामान. एकदा स्थिरावल्यावर दुष्काळ व कडक उन्हाळा चांगला सहन करते.",
  ),
  irrigation: b(
    "Mostly rainfed. Water young trees in summer for the first 2–3 years. In bearing trees, avoid water in March–June when tiny fruits are dormant, and give protective water in long dry spells from July onwards.",
    "बहुतेक कोरडवाहू. पहिली 2–3 वर्षे उन्हाळ्यात लहान झाडांना पाणी द्या. फळे देणाऱ्या झाडांना मार्च–जूनमध्ये लहान फळे सुप्त असताना पाणी देऊ नका, आणि जुलैपासून पावसाच्या मोठ्या खंडात संरक्षित पाणी द्या.",
  ),
  nutrientGuide: b(
    "Give well-rotted farmyard manure in the basin at the start of the rains and fertiliser in two parts as per soil test. Aonla is sensitive to lack of micronutrients; ask your agriculture officer about a soil test and amounts.",
    "पावसाच्या सुरुवातीला आळ्यात चांगले कुजलेले शेणखत द्या आणि माती परीक्षणानुसार खत दोन हप्त्यांत द्या. आवळ्याला सूक्ष्म अन्नद्रव्यांची कमतरता लगेच जाणवते; माती परीक्षण व प्रमाणाबद्दल कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "NA-7 (Neelam)", note: b("Heavy-bearing variety from NDUAT Faizabad; widely grown", "NDUAT फैजाबादचा भरपूर उत्पादन देणारा वाण; सर्वाधिक लागवड") },
    { name: "Krishna (NA-5)", note: b("Early variety from NDUAT Faizabad", "NDUAT फैजाबादचा लवकर येणारा वाण") },
    { name: "Kanchan (NA-4)", note: b("From NDUAT Faizabad; good for processing", "NDUAT फैजाबादचा वाण; प्रक्रियेसाठी चांगला") },
    { name: "Chakaiya", note: b("Old variety, good for pickle and preserves", "जुना वाण, लोणचे व मुरंब्यासाठी चांगला") },
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Grafts are planted in pits and take root.", "कलमे खड्ड्यांत लावली जातात व मूळ धरतात."], [
      t("ao-pit", 0, "other", ["Plant grafts in prepared pits", "तयार खड्ड्यांत कलमे लावा"], ["Fill pits with topsoil and well-rotted manure; plant two or more varieties in alternate rows.", "खड्डे वरची माती व कुजलेल्या शेणखताने भरा; दोन किंवा जास्त वाण आलटून पालटून ओळींत लावा."]),
      t("ao-irr0", 2, "irrigation", ["Water if rain stops", "पाऊस थांबल्यास पाणी द्या"], ["Keep soil moist in dry spells.", "पावसाच्या खंडात माती ओलसर ठेवा."], 7),
      t("ao-gap", 25, "other", ["Replace dead grafts", "मेलेली कलमे बदला"], ["Fill gaps while the rains last.", "पाऊस असतानाच खाडे भरा."]),
    ], [["Termites", "वाळवी"]]),
    stage("training", ["Training the young tree", "झाडाला आकार देणे"], 30, 365, ["The tree is shaped with 4–5 main branches on a clean stem.", "स्वच्छ खोडावर 4–5 मुख्य फांद्या ठेवून आकार दिला जातो."], [
      t("ao-sprout", 45, "other", ["Remove rootstock shoots", "खुंटावरील फुटवे काढा"], ["Rub off shoots from below the graft joint.", "कलमाच्या जोडाखालचे फुटवे काढा."], 45),
      t("ao-train", 180, "other", ["Shape the tree", "झाडाला आकार द्या"], ["Keep the stem clean up to about 75–100 cm and keep 4–5 well-spaced branches.", "खोड साधारण 75–100 सेंमीपर्यंत स्वच्छ ठेवा व 4–5 सारख्या अंतरावरच्या फांद्या ठेवा."]),
      t("ao-irr1", 210, "irrigation", ["Water young trees in summer", "उन्हाळ्यात लहान झाडांना पाणी द्या"], ["Light water every 10–15 days in summer.", "उन्हाळ्यात दर 10–15 दिवसांनी हलके पाणी."], 12),
    ], [["Shoot gall maker (swellings on shoots)", "फांद्यांवर गाठी करणारी कीड"]]),
    stage("frame", ["Building the frame", "झाडाचा विस्तार"], 365, 1095, ["The tree grows its frame; first fruits come in year 3–4.", "झाडाचा सांगाडा तयार होतो; 3–4 व्या वर्षी पहिली फळे येतात."], [
      t("ao-fym2", 700, "fertiliser", ["Give manure", "शेणखत द्या"], ["Apply well-rotted farmyard manure at the start of the rains.", "पावसाच्या सुरुवातीला कुजलेले शेणखत द्या."]),
      t("ao-obs2", 370, "observation", ["Check the trees", "झाडे तपासा"], ["Look for bark-eating caterpillar webs on the trunk and galls on shoots.", "खोडावर साल खाणाऱ्या अळीची जाळी व फांद्यांवरील गाठी पाहा."], 30),
      t("ao-irr2", 500, "irrigation", ["Summer water for young trees", "लहान झाडांना उन्हाळी पाणी"], ["Continue light summer water until the trees start bearing.", "झाडे फळावर येईपर्यंत उन्हाळ्यात हलके पाणी चालू ठेवा."], 15),
    ], [["Bark-eating caterpillar", "साल खाणारी अळी"]]),
  ],
  cycles: [
    {
      key: "yearly",
      name: b("Yearly crop", "वार्षिक बहार"),
      startMonths: [2, 3],
      startEvent: b("New leaves and flowers come together in February–March", "फेब्रुवारी–मार्चमध्ये नवी पालवी व फुले एकत्र येतात"),
      harvestMonths: [11, 12, 1, 2],
      note: b("Tiny fruits set in spring, stay dormant in summer, then grow fast in the rains. Early varieties are ready by November, late ones by January–February.", "वसंतात लहान फळे लागतात, उन्हाळ्यात सुप्त राहतात आणि पावसाळ्यात झपाट्याने वाढतात. लवकर वाण नोव्हेंबरपर्यंत, उशिरा वाण जानेवारी–फेब्रुवारीपर्यंत तयार होतात."),
      stages: [
        stage("flowering", ["New leaves & flowering", "नवी पालवी व फुलोरा"], 0, 40, ["New shoots come with tiny greenish flowers.", "नव्या फुटीबरोबर लहान हिरवट फुले येतात."], [
          t("aoy-prune", 0, "other", ["Remove dry and crossing branches", "वाळलेल्या व घुसलेल्या फांद्या काढा"], ["Light cleaning only; aonla needs little pruning.", "फक्त हलकी स्वच्छता; आवळ्याला कमी छाटणी लागते."]),
          t("aoy-obs1", 5, "observation", ["Check new shoots", "नवी फूट तपासा"], ["Look for galls on shoots and webs of bark-eating caterpillar on the trunk.", "फांद्यांवरील गाठी व खोडावर साल खाणाऱ्या अळीची जाळी पाहा."], 10),
        ], [["Shoot gall maker", "फांद्यांवर गाठी करणारी कीड"]]),
        stage("dormant-fruit", ["Fruit set & summer rest", "फळधारणा व उन्हाळी सुप्तावस्था"], 40, 120, ["Tiny fruits set and stay small through the hot months.", "लहान फळे लागतात व कडक उन्हाळ्यात लहानच राहतात."], [
          t("aoy-basin", 60, "other", ["Clean and mulch basins", "आळी स्वच्छ करून आच्छादन करा"], ["Keep basins clean and mulched to save moisture.", "ओलावा टिकवण्यासाठी आळी स्वच्छ ठेवा व आच्छादन करा."]),
          t("aoy-fym", 110, "fertiliser", ["Give manure before the rains", "पावसापूर्वी शेणखत द्या"], ["Apply well-rotted farmyard manure in the basin.", "आळ्यात कुजलेले शेणखत द्या."]),
        ], [["Bark-eating caterpillar", "साल खाणारी अळी"]]),
        stage("fruit-growth", ["Fruit growth", "फळांची वाढ"], 120, 250, ["With the rains, fruits grow fast and fill.", "पावसाबरोबर फळे झपाट्याने वाढतात व भरतात."], [
          t("aoy-fert1", 125, "fertiliser", ["Fertiliser parts", "खताचे हप्ते"], ["Give fertiliser in two parts as per soil test while soil is moist.", "जमिनीत ओल असताना माती परीक्षणानुसार खत दोन हप्त्यांत द्या."], 45),
          t("aoy-obs2", 130, "observation", ["Check leaves and fruit", "पाने व फळे तपासा"], ["Look for rusty spots on leaves and fruit and for brown patches inside fruit.", "पाने व फळांवर तांबूस ठिपके आणि फळांच्या आत तपकिरी भाग पाहा."], 14),
          t("aoy-irr", 180, "irrigation", ["Protective water in dry spells", "खंडात संरक्षित पाणी"], ["If rains stop for long, give water to avoid fruit drop.", "पावसाचा मोठा खंड पडल्यास फळगळ टाळण्यासाठी पाणी द्या."], 15),
        ], [["Rust", "तांबेरा"], ["Fruit browning inside (necrosis)", "फळ आतून तपकिरी होणे"]]),
        stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 250, 340, ["Fruits turn light greenish-yellow and shiny and are picked.", "फळे फिकट हिरवट-पिवळी व चमकदार होऊन तोडली जातात."], [
          t("aoy-mat", 250, "observation", ["Check maturity", "पक्वता तपासा"], ["Mature fruit is shiny, light greenish-yellow and the seed inside turns brown.", "तयार फळ चमकदार, फिकट हिरवट-पिवळे असते आणि आतील बी तपकिरी होते."]),
          t("aoy-pick", 255, "harvest", ["Pick mature fruit", "तयार फळे तोडा"], ["Pick by hand or shake gently over a sheet; avoid bruising.", "हाताने तोडा किंवा खाली कापड पसरून हलके हलवा; फळांना मार लागू देऊ नका."], 10),
        ], [["Bruised fruit turning black", "मार लागलेली फळे काळी पडणे"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Rust", "तांबेरा"),
      signs: b("Rusty-brown spots on leaves and black-brown rings on fruit during the rains.", "पावसाळ्यात पानांवर तांबूस-तपकिरी ठिपके व फळांवर काळपट-तपकिरी वर्तुळे."),
      prevention: prevent("Collect and destroy fallen leaves and fruit, prune for air flow, and prefer less susceptible varieties.", "गळलेली पाने व फळे गोळा करून नष्ट करा, हवा खेळती राहील अशी छाटणी करा आणि कमी बळी पडणारे वाण निवडा."),
    },
    {
      name: b("Bark-eating caterpillar", "साल खाणारी अळी"),
      signs: b("Ribbon-like webs of chewed bark and droppings on the trunk and branch joints; holes in the wood.", "खोड व फांद्यांच्या बेचक्यात चावलेल्या सालीची व विष्ठेची फितीसारखी जाळी; लाकडात छिद्रे."),
      prevention: prevent("Remove the webs, clean the holes with a wire and keep the trunk clean.", "जाळी काढा, तारेने छिद्रे साफ करा आणि खोड स्वच्छ ठेवा."),
    },
    {
      name: b("Fruit necrosis (internal browning)", "फळ आतून तपकिरी होणे"),
      signs: b("Brown, corky patches inside the fruit, often starting near the stone; linked to lack of a micronutrient.", "फळाच्या आत तपकिरी, बुचासारखे भाग, बहुतेक बीच्या जवळून सुरू; सूक्ष्म अन्नद्रव्याच्या कमतरतेशी संबंधित."),
      prevention: b("Get a soil test and ask your agriculture officer which micronutrient to give and how much.", "माती परीक्षण करा आणि कोणते सूक्ष्म अन्नद्रव्य किती द्यायचे ते कृषी अधिकाऱ्यांना विचारा."),
    },
  ],
  harvestSigns: b(
    "Fruit turns from green to light greenish-yellow, becomes shiny, and the seed inside turns brown.",
    "फळ हिरव्यावरून फिकट हिरवट-पिवळे होते, चमकदार होते आणि आतील बी तपकिरी होते.",
  ),
  postHarvest: b(
    "Handle gently — bruised fruit turns black. Grade by size and sell or process within a few days. Aonla is made into murabba, candy, pickle, juice and powder.",
    "हळुवार हाताळा — मार लागलेली फळे काळी पडतात. आकारानुसार प्रतवारी करा व काही दिवसांत विका किंवा प्रक्रिया करा. आवळ्यापासून मुरंबा, कँडी, लोणचे, रस व पावडर बनते.",
  ),
  marketTips: b(
    "Much of the crop goes to processors (ayurvedic, candy, juice). Agree on price and grade with a processor before harvest, or process it yourself through a women's group.",
    "बहुतेक उत्पादन प्रक्रिया उद्योगांना (आयुर्वेदिक, कँडी, रस) जाते. काढणीपूर्वीच प्रक्रिया उद्योगाशी दर व प्रत ठरवा, किंवा महिला बचत गटामार्फत स्वतः प्रक्रिया करा.",
  ),
  source: "General practices from MPKV Rahuri and Dr. PDKV Akola aonla guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
