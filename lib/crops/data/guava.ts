import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Guava: establishment years, then one bahar a year — mrig, hasta or ambia. */
const crop: PerennialCrop = {
  id: "guava",
  emoji: "🍐",
  name: b("Guava", "पेरू"),
  aliases: ["guava", "guavas", "peru", "peroo", "amrood", "amrud", "jamphal", "पेरू", "पेरु", "अमरूद", "जांभफळ"],
  category: "fruit",
  lifecycle: "perennial",
  regions: ["western", "marathwada"],
  majorDistricts: b("Pune, Ahilyanagar, Solapur", "पुणे, अहिल्यानगर, सोलापूर"),
  tier: 2,
  plantingWindow: b("June–August, in the monsoon", "जून–ऑगस्ट, पावसाळ्यात"),
  plantingMonths: [6, 7, 8],
  plantingMaterial: b("Air-layers (gootee) or grafts of a known variety from a registered nursery", "नोंदणीकृत रोपवाटिकेतील खात्रीच्या वाणाची गुटी कलमे किंवा कलमे"),
  spacing: b("6 m × 6 m traditionally; closer spacing (such as 3 m × 2 m) in high-density orchards with regular pruning", "पारंपरिक 6 मीटर × 6 मीटर; नियमित छाटणी करणाऱ्या घन लागवडीत कमी अंतर (उदा. 3 मीटर × 2 मीटर)"),
  plantsPerAcre: [110, 670],
  yearsToFirstHarvest: [2, 3],
  economicLifeYears: [20, 30],
  soil: b(
    "Grows on many soils, from light to medium black, if drainage is good. Avoid waterlogged and very saline soil.",
    "निचरा चांगला असल्यास हलक्या ते मध्यम काळ्या अशा अनेक जमिनींत येतो. पाणी साचणारी व जास्त क्षारयुक्त जमीन टाळा.",
  ),
  climate: b(
    "Hardy and drought-tolerant. Winter fruit (from mrig and hasta bahar) has the best taste and fewest pests; rainy-season fruit is poorer and attracts fruit fly.",
    "काटक व दुष्काळ सहन करणारे झाड. हिवाळ्यातील फळे (मृग व हस्त बहार) चवीला उत्तम व कमी किडीची; पावसाळ्यातील फळे कमी दर्जाची असून त्यांना फळमाशी लागते.",
  ),
  irrigation: b(
    "Stop water for the rest period before a bahar, then water regularly from flowering to harvest; drip is best. Young plants need water in summer.",
    "बहार धरण्यापूर्वी विश्रांतीसाठी पाणी बंद करा, मग फुलोऱ्यापासून काढणीपर्यंत नियमित पाणी द्या; ठिबक उत्तम. उन्हाळ्यात लहान झाडांना पाणी लागते.",
  ),
  nutrientGuide: b(
    "Base it on a soil test. Give well-rotted farmyard manure at the start of each bahar and split fertiliser into parts. Ask your agriculture officer for amounts.",
    "माती परीक्षणावर आधारित खत द्या. प्रत्येक बहाराच्या सुरुवातीला कुजलेले शेणखत द्या आणि खत हप्त्यांत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Sardar (L-49)", note: b("Widely grown; large, sweet fruit", "मोठ्या प्रमाणावर लागवड; मोठे, गोड फळ") },
    { name: "Allahabad Safeda", note: b("Popular white-fleshed variety", "पांढऱ्या गराचा लोकप्रिय वाण") },
    { name: "Lalit", note: b("Pink-fleshed variety released by ICAR-CISH, Lucknow", "ICAR-केंद्रीय उपोष्ण बागायत संस्था, लखनौचा गुलाबी गराचा वाण") },
    // TODO: varieties — confirm MPKV Rahuri guava releases before adding
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Young plants are set in pits and take root.", "लहान रोपे खड्ड्यांत लावली जातात व मूळ धरतात."], [
      t("gv-pit", 0, "other", ["Plant in filled pits", "भरलेल्या खड्ड्यांत लागवड करा"], ["Fill pits with topsoil and well-rotted manure, plant and stake.", "खड्डे वरची माती व कुजलेल्या शेणखताने भरा, रोप लावा व काठीचा आधार द्या."]),
      t("gv-gap0", 25, "other", ["Replace dead plants", "मेलेली रोपे बदला"], ["Fill gaps in the same monsoon.", "त्याच पावसाळ्यात खाडे भरा."]),
    ], [["Termites at the roots", "मुळांना वाळवी"]]),
    stage("training", ["Training the young tree", "झाडाला आकार देणे"], 30, 365, ["The plant is shaped with a short trunk and 3–4 well-spaced main branches.", "झाडाला कमी उंचीचे खोड व चांगल्या अंतरावरील 3–4 मुख्य फांद्यांचा आकार दिला जातो."], [
      t("gv-top", 60, "other", ["Top and shape the plant", "शेंडा छाटून आकार द्या"], ["Cut the top at about 60–90 cm and keep 3–4 side branches around the stem.", "साधारण 60–90 सेंमीवर शेंडा छाटा आणि खोडाभोवती 3–4 बाजूच्या फांद्या ठेवा."]),
      t("gv-irr1", 30, "irrigation", ["Water young plants", "लहान झाडांना पाणी द्या"], ["Light, regular water in the dry months.", "कोरड्या महिन्यांत हलके, नियमित पाणी."], 7),
      t("gv-obs1", 45, "observation", ["Check leaves", "पाने तपासा"], ["Look for mealybugs, whitefly and wilting.", "पिठ्या ढेकूण, पांढरी माशी व झाड मलूल होणे पाहा."], 30),
    ], [["Wilt", "मर रोग"]]),
    stage("frame", ["Building the frame", "झाडाचा विस्तार"], 365, 730, ["The tree spreads. Flowers are removed in the first year so the tree grows.", "झाड विस्तारते. पहिल्या वर्षी फुले काढली जातात म्हणजे झाड वाढते."], [
      t("gv-deflower", 380, "other", ["Remove early flowers", "लवकरची फुले काढा"], ["Pick off flowers until the tree is strong enough for a first crop.", "झाड पहिल्या पिकासाठी पुरेसे मजबूत होईपर्यंत फुले खुडा."], 90),
      t("gv-prune1", 370, "other", ["Light pruning", "हलकी छाटणी"], ["Remove crossing, dry and low branches.", "घुसणाऱ्या, वाळलेल्या व खालच्या फांद्या काढा."], 180),
      t("gv-irr2", 366, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water in the dry months.", "कोरड्या महिन्यांत नियमित पाणी."], 10),
    ], [["Mealybug on shoots", "फुटीवर पिठ्या ढेकूण"]]),
  ],
  cycles: [
    {
      key: "mrig",
      name: b("Mrig bahar", "मृग बहार"),
      startMonths: [4, 5],
      startEvent: b("Water stopped in April–May, then flowering with the June rains", "एप्रिल–मे मध्ये पाणी बंद, मग जूनच्या पावसाने फुलोरा"),
      harvestMonths: [10, 11, 12],
      note: b("The most common bahar in Maharashtra; uses monsoon rain and gives good winter fruit.", "महाराष्ट्रात सर्वाधिक प्रचलित बहार; पावसाचा उपयोग होतो आणि हिवाळ्यात चांगली फळे मिळतात."),
      stages: bahar("gvmr"),
    },
    {
      key: "hasta",
      name: b("Hasta bahar", "हस्त बहार"),
      startMonths: [8, 9],
      startEvent: b("Rest in August–September, then irrigation as the rains end", "ऑगस्ट–सप्टेंबरमध्ये विश्रांती, मग पाऊस संपताना पाणी"),
      harvestMonths: [2, 3, 4],
      note: b("Fruit in late winter and early summer; good quality and prices, but needs assured water.", "उशिरा हिवाळ्यात व उन्हाळ्याच्या सुरुवातीला फळे; दर्जा व दर चांगले, पण खात्रीचे पाणी लागते."),
      stages: bahar("gvhs"),
    },
    {
      key: "ambia",
      name: b("Ambia bahar", "आंबिया बहार"),
      startMonths: [12, 1],
      startEvent: b("Rest in December, then irrigation in January–February", "डिसेंबरमध्ये विश्रांती, मग जानेवारी–फेब्रुवारीत पाणी"),
      harvestMonths: [6, 7, 8],
      note: b("Fruit comes in the rainy season — poorer taste and more fruit fly. Generally not advised.", "फळे पावसाळ्यात येतात — चव कमी व फळमाशी जास्त. सहसा शिफारस नाही."),
      stages: bahar("gvam"),
    },
  ],
  commonProblems: [
    {
      name: b("Fruit fly", "फळमाशी"),
      signs: b("Small punctures on ripening fruit; soft rotting patches with maggots inside.", "पिकणाऱ्या फळांवर लहान छिद्रे; आत अळ्या असलेले मऊ, सडके डाग."),
      prevention: prevent("Avoid rainy-season fruit, collect and bury fallen fruit, use fruit fly traps advised by your KVK, and bag fruits where practical.", "पावसाळ्यातील बहार टाळा, गळलेली फळे गोळा करून पुरा, कृषी विज्ञान केंद्राने सुचवलेले फळमाशी सापळे लावा आणि शक्य असल्यास फळांना पिशव्या घाला."),
    },
    {
      name: b("Wilt", "मर रोग"),
      signs: b("Leaves turn yellow and droop, branches dry one by one and the tree may die.", "पाने पिवळी पडून मलूल होतात, फांद्या एकेक करून सुकतात आणि झाड मरू शकते."),
      prevention: prevent("Avoid waterlogging, do not injure roots, add plenty of organic manure, and remove dead trees with their roots.", "पाणी साचू देऊ नका, मुळांना इजा करू नका, भरपूर सेंद्रिय खत द्या आणि मेलेली झाडे मुळांसकट काढा."),
    },
    {
      name: b("Mealybug", "पिठ्या ढेकूण"),
      signs: b("White cottony insects on shoots, flowers and fruit; sticky honeydew and black mould.", "फुटी, फुले व फळांवर पांढरे कापसासारखे कीटक; चिकट गोड स्राव व काळी बुरशी."),
      prevention: prevent("Keep ants away, remove weeds and affected shoots, and check trees often.", "मुंग्यांचा बंदोबस्त करा, तण व बाधित फुटी काढा आणि झाडे वारंवार तपासा."),
    },
    {
      name: b("Anthracnose (fruit rot)", "करपा (फळकूज)"),
      signs: b("Dark sunken spots on fruit that spread in humid weather; twigs dry from the tip.", "फळांवर काळपट खोलगट डाग जे दमट हवामानात पसरतात; फांद्या टोकाकडून सुकतात."),
      prevention: prevent("Prune and burn dried twigs, remove spotted fruit and keep the canopy open.", "सुकलेल्या फांद्या छाटून जाळा, डाग असलेली फळे काढा आणि झाड मोकळे ठेवा."),
    },
  ],
  harvestSigns: b(
    "Fruit turns from dark green to light green or yellowish, becomes slightly soft and smells sweet. Usually 4–5 months after flowering.",
    "फळाचा रंग गडद हिरव्यावरून फिकट हिरवा किंवा पिवळसर होतो, फळ किंचित नरम होते व गोड वास येतो. साधारण फुलोऱ्यानंतर 4–5 महिन्यांनी.",
  ),
  postHarvest: b(
    "Pick every 2–3 days with a short stalk, handle gently, grade by size and pack in ventilated crates lined with paper or leaves. Guava spoils fast, so sell quickly.",
    "दर 2–3 दिवसांनी थोडा देठ ठेवून तोडा, हळुवार हाताळा, आकारानुसार प्रतवारी करा आणि कागद किंवा पाने अंथरलेल्या हवेशीर क्रेटमध्ये भरा. पेरू लवकर खराब होतो, म्हणून लवकर विका.",
  ),
  marketTips: b(
    "Winter fruit from mrig and hasta bahar gets the best price. Clean, unspotted, evenly graded fruit sells better. Selling together through your Mandi Mitra lowers transport cost; extra fruit can go for pulp and jelly making.",
    "मृग व हस्त बहारातील हिवाळी फळांना सर्वाधिक दर मिळतो. स्वच्छ, डागरहित, एकसारख्या प्रतवारीच्या फळांना चांगला दर मिळतो. मंडी मित्रामार्फत एकत्र विकल्यास वाहतूक खर्च कमी होतो; जास्तीची फळे गर व जेली बनवण्यासाठी देता येतात.",
  ),
  source: "General practices from MPKV Rahuri guava guidance and ICAR-CISH, Lucknow",
  lastVerified: null,
  reviewStatus: "draft",
};

/** The yearly bahar: same stages for mrig, hasta and ambia; task ids get a per-bahar prefix. */
function bahar(p: string) {
  return [
    stage("rest", ["Rest period", "विश्रांती"], 0, 30, ["Water is stopped so the tree rests and gets ready to flower.", "झाडाला विश्रांती मिळावी व फुलोऱ्यासाठी तयार व्हावे म्हणून पाणी बंद केले जाते."], [
      t(`${p}-rest`, 0, "other", ["Stop irrigation", "पाणी बंद करा"], ["Stop water so the tree rests; leaves may drop. Keep the rest shorter on light soil.", "झाडाला विश्रांती मिळावी म्हणून पाणी बंद करा; पाने गळू शकतात. हलक्या जमिनीत विश्रांती कमी ठेवा."]),
      t(`${p}-prune`, 20, "other", ["Prune shoot tips", "फांद्यांचे शेंडे छाटा"], ["Lightly cut back last season's shoots — guava flowers on new shoots. Remove dry and crossing branches.", "मागील हंगामाच्या फुटींचे शेंडे हलके छाटा — पेरूला नव्या फुटीवर फुले येतात. वाळलेल्या व घुसणाऱ्या फांद्या काढा."]),
    ], [["Dry twigs with anthracnose — cut them now", "करपा असलेल्या सुकलेल्या फांद्या — आत्ताच छाटा"]]),
    stage("bahar-start", ["Bahar start", "बहार धरणे"], 30, 45, ["Manure and the first water bring new shoots with flower buds.", "शेणखत व पहिल्या पाण्याने फुलकळ्यांसह नवी फूट येते."], [
      t(`${p}-fym`, 30, "fertiliser", ["Give manure and fertiliser", "शेणखत व खत द्या"], ["Apply well-rotted manure and the first fertiliser part as per soil test.", "कुजलेले शेणखत व माती परीक्षणानुसार खताचा पहिला हप्ता द्या."]),
      t(`${p}-irr1`, 31, "irrigation", ["First irrigation after rest", "विश्रांतीनंतरचे पहिले पाणी"], ["Give a good first water, then regular light water.", "पहिले भरपूर पाणी द्या, नंतर नियमित हलके पाणी."], 6),
    ], [["Mealybug on new shoots", "नव्या फुटीवर पिठ्या ढेकूण"]]),
    stage("flowering", ["Flowering and fruit set", "फुलोरा व फळधारणा"], 45, 90, ["Flowers open on new shoots and small fruits set.", "नव्या फुटीवर फुले उमलतात व लहान फळे धरतात."], [
      t(`${p}-irr2`, 45, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even moisture helps fruit set.", "सारख्या ओलाव्याने फळधारणा चांगली होते."], 6),
      t(`${p}-obs1`, 47, "observation", ["Check flowers and shoots", "फुले व फुटी तपासा"], ["Look for mealybug and sucking pests; protect bees.", "पिठ्या ढेकूण व रसशोषक किडी पाहा; मधमाश्यांचे संरक्षण करा."], 7),
    ], [["Flower drop", "फुलगळ"]]),
    stage("fruit-growth", ["Fruit growth", "फळांची वाढ"], 90, 180, ["Fruits grow to full size.", "फळे पूर्ण आकाराची होतात."], [
      t(`${p}-irr3`, 90, "irrigation", ["Irrigate regularly", "नियमित पाणी द्या"], ["Even water gives good size.", "सारख्या पाण्याने फळांना चांगला आकार येतो."], 7),
      t(`${p}-thin`, 95, "other", ["Thin the fruit", "फळांची विरळणी करा"], ["Remove extra, small and damaged fruit so the rest grow bigger.", "जास्तीची, लहान व खराब फळे काढा म्हणजे उरलेली मोठी होतात."]),
      t(`${p}-fert2`, 100, "fertiliser", ["Second fertiliser part", "खताचा दुसरा हप्ता"], ["Give the next part as per your plan.", "नियोजनानुसार पुढचा हप्ता द्या."]),
      t(`${p}-obs2`, 110, "observation", ["Check fruit", "फळे तपासा"], ["Look for fruit fly punctures and spots; hang traps and collect fallen fruit.", "फळमाशीची छिद्रे व डाग पाहा; सापळे लावा व गळलेली फळे गोळा करा."], 7),
    ], [["Fruit fly", "फळमाशी"], ["Anthracnose spots on fruit", "फळांवर करप्याचे डाग"]]),
    stage("harvest", ["Harvest", "काढणी"], 180, 240, ["Fruits mature and are picked every few days.", "फळे तयार होतात व दर काही दिवसांनी तोडली जातात."], [
      t(`${p}-mat`, 180, "observation", ["Check maturity", "पक्वता तपासा"], ["Pick when colour turns light green or yellowish. Check spray waiting periods on labels.", "रंग फिकट हिरवा किंवा पिवळसर झाल्यावर तोडा. लेबलवरील फवारणीचा प्रतीक्षा कालावधी तपासा."]),
      t(`${p}-pick`, 182, "harvest", ["Pick fruit", "फळे तोडा"], ["Pick every 2–3 days in cool hours; handle gently.", "दर 2–3 दिवसांनी थंड वेळेत तोडा; हळुवार हाताळा."], 3),
    ], [["Fruit fly in ripe fruit", "पिकलेल्या फळांत फळमाशी"]]),
  ];
}

export default crop;
