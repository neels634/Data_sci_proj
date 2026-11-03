import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Sapota (chikoo): flowers and fruits almost all year; one yearly care cycle from the end of the monsoon. */
const crop: PerennialCrop = {
  id: "sapota",
  emoji: "🟤",
  name: b("Sapota (chikoo)", "चिकू"),
  aliases: ["sapota", "chikoo", "chiku", "cheeku", "chikku", "sapodilla", "चिकू", "चिक्कू", "चीकू"],
  category: "fruit",
  lifecycle: "perennial",
  regions: ["konkan"],
  majorDistricts: b("Palghar (Dahanu, Gholvad), Thane", "पालघर (डहाणू, घोलवड), ठाणे"),
  tier: 2,
  plantingWindow: b("June–August, in the monsoon", "जून–ऑगस्ट, पावसाळ्यात"),
  plantingMonths: [6, 7, 8],
  plantingMaterial: b("Grafts of a known variety from a registered nursery", "नोंदणीकृत रोपवाटिकेतील खात्रीच्या वाणाची कलमे"),
  spacing: b("10 m × 10 m (8 m × 8 m on lighter soil)", "10 मीटर × 10 मीटर (हलक्या जमिनीत 8 मीटर × 8 मीटर)"),
  plantsPerAcre: [40, 65],
  yearsToFirstHarvest: [3, 5],
  economicLifeYears: [40, 60],
  soil: b(
    "Deep, well-drained alluvial, sandy-loam or medium black soil. It tolerates some salinity near the coast but not waterlogging.",
    "खोल, पाण्याचा चांगला निचरा होणारी गाळाची, वाळूमिश्रित पोयट्याची किंवा मध्यम काळी जमीन. किनाऱ्याजवळील थोडी क्षारता सहन करतो, पण पाणी साचणे सहन होत नाही.",
  ),
  climate: b(
    "Warm, humid coastal climate suits it best. Very hot, dry winds and cold nights reduce flowering and fruit set.",
    "उबदार, दमट किनारपट्टीचे हवामान उत्तम. खूप उष्ण, कोरडे वारे व थंड रात्रींमुळे फुलोरा व फळधारणा कमी होते.",
  ),
  irrigation: b(
    "Young plants need regular water in the dry months. For bearing trees, water every 1–2 weeks in winter and more often in summer; drip saves water. Do not let water stand around the trunk.",
    "कोरड्या महिन्यांत लहान झाडांना नियमित पाणी लागते. फळधारणा करणाऱ्या झाडांना हिवाळ्यात दर 1–2 आठवड्यांनी व उन्हाळ्यात जास्त वेळा पाणी द्या; ठिबकने पाणी वाचते. खोडाभोवती पाणी साचू देऊ नका.",
  ),
  nutrientGuide: b(
    "Base it on a soil test. Give well-rotted farmyard manure every year after the monsoon and split fertiliser into two parts. Increase amounts with tree age. Ask your agriculture officer for amounts.",
    "माती परीक्षणावर आधारित खत द्या. दरवर्षी पावसाळ्यानंतर कुजलेले शेणखत द्या आणि खत दोन हप्त्यांत द्या. झाडाच्या वयानुसार प्रमाण वाढवा. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Kalipatti", note: b("The most widely grown sapota in Maharashtra; oval fruit, good sweetness", "महाराष्ट्रातील सर्वाधिक लागवड होणारा चिकू; लंबगोल फळ, चांगली गोडी") },
    { name: "Cricket Ball", note: b("Large round fruit", "मोठे गोल फळ") },
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Grafts are planted in pits and take root.", "कलमे खड्ड्यांत लावली जातात व मूळ धरतात."], [
      t("sp-pit", 0, "other", ["Plant in filled pits", "भरलेल्या खड्ड्यांत लागवड करा"], ["Fill pits with topsoil and well-rotted manure; keep the graft joint above the soil and stake the plant.", "खड्डे वरची माती व कुजलेल्या शेणखताने भरा; कलमाचा जोड मातीच्या वर ठेवा व रोपाला काठीचा आधार द्या."]),
      t("sp-gap0", 25, "other", ["Replace dead grafts", "मेलेली कलमे बदला"], ["Fill gaps in the same monsoon.", "त्याच पावसाळ्यात खाडे भरा."]),
    ], [["Rootstock shoots below the graft", "कलमाखालून खुंटाची फूट"]]),
    stage("young-plant", ["Young plant care", "लहान झाडाची निगा"], 30, 1095, ["The tree builds its frame. Remove flowers for the first 2–3 years.", "झाडाचा सांगाडा तयार होतो. पहिली 2–3 वर्षे फुले काढा."], [
      t("sp-sucker", 45, "other", ["Remove rootstock shoots", "खुंटाची फूट काढा"], ["Cut shoots coming from below the graft joint.", "कलम जोडाखालून येणारी फूट काढा."], 60),
      t("sp-irr1", 150, "irrigation", ["Water in the dry months", "कोरड्या महिन्यांत पाणी द्या"], ["Water young plants every 1–2 weeks after the rains.", "पावसाळ्यानंतर लहान झाडांना दर 1–2 आठवड्यांनी पाणी द्या."], 10),
      t("sp-deflower", 400, "other", ["Remove early flowers", "लवकरची फुले काढा"], ["Pick off flowers so the young tree puts energy into growth.", "लहान झाड वाढीकडे जोर देईल म्हणून फुले खुडून टाका."], 120),
      t("sp-obs1", 60, "observation", ["Check new leaves and buds", "नवी पालवी व कळ्या तपासा"], ["Look for webbed leaves and bored buds.", "जाळी केलेली पाने व पोखरलेल्या कळ्या पाहा."], 30),
    ], [["Leaf webber (chikoo moth)", "पाने गुंडाळणारी अळी (चिकू पतंग)"]]),
  ],
  cycles: [
    {
      key: "yearly",
      name: b("Yearly crop", "वार्षिक हंगाम"),
      startMonths: [10],
      startEvent: b("After the monsoon: manure, fertiliser and orchard cleaning in October", "पावसाळ्यानंतर: ऑक्टोबरमध्ये शेणखत, खत व बागेची स्वच्छता"),
      harvestMonths: [11, 12, 1, 2, 3, 4, 5, 6],
      note: b(
        "Sapota flowers and fruits almost all year; fruit takes several months to mature after flowering. The heaviest picking in the Dahanu belt is from winter through early summer.",
        "चिकूला जवळजवळ वर्षभर फुले व फळे येतात; फुलोऱ्यानंतर फळ तयार व्हायला अनेक महिने लागतात. डहाणू भागात हिवाळ्यापासून उन्हाळ्याच्या सुरुवातीपर्यंत सर्वाधिक तोडणी होते.",
      ),
      stages: [
        stage("post-monsoon", ["Post-monsoon care", "पावसाळ्यानंतरची निगा"], 0, 60, ["The tree puts out new leaves and flowers after the rains.", "पावसानंतर झाडाला नवी पालवी व फुले येतात."], [
          t("spy-fym", 0, "fertiliser", ["Give manure and fertiliser", "शेणखत व खत द्या"], ["Apply well-rotted manure in a ring under the canopy edge and the first fertiliser part as per soil test.", "झाडाच्या घेराखाली गोलाकार कुजलेले शेणखत व माती परीक्षणानुसार खताचा पहिला हप्ता द्या."]),
          t("spy-clean", 5, "other", ["Clean and prune lightly", "स्वच्छता व हलकी छाटणी"], ["Remove dry, crowded and low branches; keep the canopy open.", "वाळलेल्या, दाट व खालच्या फांद्या काढा; झाड मोकळे ठेवा."]),
          t("spy-irr1", 30, "irrigation", ["Start irrigation", "पाणी सुरू करा"], ["Once the soil dries after the rains, water every 1–2 weeks.", "पावसानंतर जमीन कोरडी झाल्यावर दर 1–2 आठवड्यांनी पाणी द्या."], 10),
        ], [["Leaf webber on new growth", "नव्या पालवीवर पाने गुंडाळणारी अळी"]]),
        stage("flowering", ["Flowering and fruit set", "फुलोरा व फळधारणा"], 60, 150, ["Flowers open and small fruits set.", "फुले उमलतात व लहान फळे धरतात."], [
          t("spy-irr2", 60, "irrigation", ["Irrigate regularly", "नियमित पाणी द्या"], ["Even moisture helps fruit set.", "सारख्या ओलाव्याने फळधारणा चांगली होते."], 10),
          t("spy-obs1", 62, "observation", ["Check buds and flowers", "कळ्या व फुले तपासा"], ["Look for bud borer holes and webbed leaves.", "कळ्यांवर पोखरल्याची छिद्रे व जाळी केलेली पाने पाहा."], 10),
        ], [["Bud borer", "कळी पोखरणारी अळी"]]),
        stage("fruit-growth", ["Fruit growth", "फळांची वाढ"], 150, 240, ["Fruits grow; older fruits from earlier flowering mature at the same time.", "फळे वाढतात; आधीच्या फुलोऱ्यातील फळे याच काळात तयार होतात."], [
          t("spy-irr3", 150, "irrigation", ["Irrigate", "पाणी द्या"], ["Water more often as summer heats up.", "उन्हाळा वाढेल तसे जास्त वेळा पाणी द्या."], 7),
          t("spy-fert2", 160, "fertiliser", ["Second fertiliser part", "खताचा दुसरा हप्ता"], ["Give the second part as per your plan.", "नियोजनानुसार दुसरा हप्ता द्या."]),
          t("spy-obs2", 152, "observation", ["Check fruit", "फळे तपासा"], ["Look for holes in fruit (seed borer) and black sooty coating on leaves.", "फळांवर छिद्रे (बी पोखरणारी अळी) व पानांवर काळी बुरशी पाहा."], 10),
        ], [["Seed borer", "बी पोखरणारी अळी"], ["Sooty mould", "काळी बुरशी"]]),
        stage("harvest", ["Harvest rounds", "तोडणी"], 240, 365, ["Mature fruits are picked in rounds every few days.", "तयार फळे दर काही दिवसांनी फेऱ्यांमध्ये तोडली जातात."], [
          t("spy-mat", 240, "observation", ["Check maturity", "पक्वता तपासा"], ["Scratch the skin lightly: mature fruit shows yellowish skin under the brown scurf and little milky latex.", "साल हलकेच खरवडा: तयार फळात तपकिरी थराखाली पिवळसर साल दिसते आणि चीक कमी येतो."]),
          t("spy-pick", 242, "harvest", ["Pick mature fruit", "तयार फळे तोडा"], ["Pick with a picker or by hand without bruising; keep in shade.", "झेल्याने किंवा हाताने, फळे न दबता तोडा; सावलीत ठेवा."], 7),
          t("spy-irr4", 245, "irrigation", ["Keep irrigating", "पाणी देत राहा"], ["Regular water in summer; stop during the rains.", "उन्हाळ्यात नियमित पाणी; पावसाळ्यात बंद."], 7),
        ], [["Fruit fly on ripe fruit", "पिकलेल्या फळांवर फळमाशी"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Leaf webber (chikoo moth)", "पाने गुंडाळणारी अळी (चिकू पतंग)"),
      signs: b("Leaves are webbed together and eaten; buds and young shoots dry.", "पाने जाळी करून एकत्र गुंडाळलेली व खाल्लेली; कळ्या व कोवळी फूट सुकते."),
      prevention: prevent("Remove and destroy webbed leaves and keep the canopy open with light pruning.", "जाळी केलेली पाने काढून नष्ट करा आणि हलकी छाटणी करून झाड मोकळे ठेवा."),
    },
    {
      name: b("Bud borer", "कळी पोखरणारी अळी"),
      signs: b("Holes in flower buds; buds dry and drop.", "फुलकळ्यांना छिद्रे; कळ्या सुकून गळतात."),
      prevention: prevent("Check buds regularly and collect and destroy fallen buds.", "कळ्या नियमित तपासा आणि गळलेल्या कळ्या गोळा करून नष्ट करा."),
    },
    {
      name: b("Seed borer", "बी पोखरणारी अळी"),
      signs: b("Small holes in young fruit; the larva feeds on the seed and the fruit drops or rots.", "कोवळ्या फळांवर लहान छिद्रे; अळी बी खाते आणि फळ गळते किंवा सडते."),
      prevention: prevent("Collect and destroy fallen and bored fruit regularly.", "गळलेली व पोखरलेली फळे नियमित गोळा करून नष्ट करा."),
    },
    {
      name: b("Sooty mould", "काळी बुरशी"),
      signs: b("Black coating on leaves and fruit, usually where scale insects or mealybugs leave honeydew.", "पाने व फळांवर काळा थर, सहसा खवले कीड किंवा पिठ्या ढेकूण यांच्या गोड स्रावामुळे."),
      prevention: prevent("Control the sucking insects that cause it and keep the canopy open.", "ही बुरशी निर्माण करणाऱ्या रसशोषक किडींचे नियंत्रण करा आणि झाड मोकळे ठेवा."),
    },
  ],
  harvestSigns: b(
    "The brown scurf on the skin loosens, the skin under it turns potato-brown or yellowish, and very little milky latex comes when you scratch it.",
    "सालीवरचा तपकिरी थर सैल होतो, त्याखालची साल बटाट्यासारखी तपकिरी किंवा पिवळसर होते आणि खरवडल्यावर दुधासारखा चीक फारच कमी येतो.",
  ),
  postHarvest: b(
    "Keep picked fruit in shade, wash off dust and latex, grade by size and pack in ventilated crates or boxes. Fruit ripens in a few days at room temperature, so send it to market quickly.",
    "तोडलेली फळे सावलीत ठेवा, धूळ व चीक धुऊन काढा, आकारानुसार प्रतवारी करून हवेशीर क्रेट किंवा खोक्यांत भरा. फळे खोलीच्या तापमानात काही दिवसांत पिकतात, त्यामुळे लवकर बाजारात पाठवा.",
  ),
  marketTips: b(
    "Gholvad chikoo from the Dahanu belt is GI-registered and well known in Mumbai markets. Large, evenly graded fruit gets better rates. Because chikoo ripens fast, plan transport before picking and sell together through your Mandi Mitra.",
    "डहाणू भागातील घोलवड चिकूला भौगोलिक मानांकन (GI) आहे आणि मुंबईच्या बाजारात तो प्रसिद्ध आहे. मोठ्या, एकसारख्या प्रतवारीच्या फळांना जास्त दर मिळतो. चिकू लवकर पिकतो, म्हणून तोडणीपूर्वी वाहतुकीचे नियोजन करा आणि मंडी मित्रामार्फत एकत्र विक्री करा.",
  ),
  source: "General practices from Dr. BSKKV Dapoli sapota guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
