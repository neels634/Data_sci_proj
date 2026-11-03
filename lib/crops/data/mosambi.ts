import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Mosambi (sweet orange): establishment years, then one bahar a year — ambia, mrig or hasta. */
const crop: PerennialCrop = {
  id: "mosambi",
  emoji: "🍊",
  name: b("Mosambi (sweet orange)", "मोसंबी"),
  aliases: ["mosambi", "mosambee", "musambi", "mosumbi", "sweet lime", "sweet orange", "मोसंबी", "मोसंबे", "मौसंबी", "मुसंबी"],
  category: "fruit",
  lifecycle: "perennial",
  regions: ["marathwada", "western"],
  majorDistricts: b("Jalna, Chhatrapati Sambhajinagar, Ahilyanagar, Beed", "जालना, छत्रपती संभाजीनगर, अहिल्यानगर, बीड"),
  tier: 1,
  plantingWindow: b("June–August, in the monsoon", "जून–ऑगस्ट, पावसाळ्यात"),
  plantingMonths: [6, 7, 8],
  plantingMaterial: b(
    "Budded plants on a recommended rootstock, from a registered, disease-free nursery",
    "शिफारस केलेल्या खुंटावरील डोळा भरलेली कलमे, नोंदणीकृत व रोगमुक्त रोपवाटिकेतून",
  ),
  spacing: b("6 m × 6 m is common", "6 मीटर × 6 मीटर सामान्य"),
  plantsPerAcre: [110, 120],
  yearsToFirstHarvest: [4, 5],
  economicLifeYears: [20, 25],
  soil: b(
    "Medium, well-drained soil about 1–1.5 m deep. Avoid heavy soil where water stands and soil with a hard lime layer.",
    "साधारण 1–1.5 मीटर खोल, पाण्याचा चांगला निचरा होणारी मध्यम जमीन. पाणी साचणारी भारी जमीन व चुनखडीचा कडक थर असलेली जमीन टाळा.",
  ),
  climate: b(
    "Hot, dry Marathwada weather suits it, but it needs assured water in summer. Hot winds cause fruit drop; rain at maturity can split fruit.",
    "मराठवाड्याचे उष्ण, कोरडे हवामान योग्य, पण उन्हाळ्यात खात्रीचे पाणी लागते. उष्ण वाऱ्यामुळे फळगळ होते; पक्वतेच्या वेळी पावसाने फळे तडकू शकतात.",
  ),
  irrigation: b(
    "Drip or the double-ring basin method; never let water touch the trunk. Stop water for the rest period before a bahar, then give regular water through fruit growth. Mulch basins in summer to save water.",
    "ठिबक किंवा दुहेरी आळे पद्धत; पाणी खोडाला कधीही लागू देऊ नका. बहार धरण्यापूर्वी विश्रांतीसाठी पाणी बंद करा, मग फळवाढीत नियमित पाणी द्या. उन्हाळ्यात पाणी वाचवण्यासाठी आळ्यात आच्छादन करा.",
  ),
  nutrientGuide: b(
    "Base it on soil and leaf tests. Give well-rotted farmyard manure every year and split fertiliser into parts at bahar start and during fruit growth. Ask your agriculture officer about amounts and micronutrients such as zinc.",
    "माती व पान परीक्षणावर आधारित खत द्या. दरवर्षी कुजलेले शेणखत द्या आणि खत बहार धरताना व फळवाढीत हप्त्यांत द्या. प्रमाण व जस्तासारख्या सूक्ष्म अन्नद्रव्यांबद्दल कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [], // TODO: varieties — confirm mosambi selections with VNMKV Parbhani, MPKV Rahuri and ICAR-CCRI Nagpur
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Budded plants are set in pits and take root.", "कलमे खड्ड्यांत लावली जातात व मूळ धरतात."], [
      t("ms-pit", 0, "other", ["Plant in filled pits", "भरलेल्या खड्ड्यांत लागवड करा"], ["Fill pits with topsoil and well-rotted manure. Keep the bud joint well above the soil and stake the plant.", "खड्डे वरची माती व कुजलेल्या शेणखताने भरा. डोळ्याचा जोड मातीच्या बराच वर ठेवा व रोपाला काठीचा आधार द्या."]),
      t("ms-ring", 3, "other", ["Make a double-ring basin", "दुहेरी आळे करा"], ["Make a small inner ring around the trunk so water never touches it.", "खोडाभोवती लहान आतले आळे करा म्हणजे पाणी खोडाला लागणार नाही."]),
      t("ms-gap0", 25, "other", ["Replace dead plants", "मेलेली कलमे बदला"], ["Fill gaps in the same season.", "त्याच हंगामात खाडे भरा."]),
    ], [["Root rot in waterlogged pits", "पाणी साचलेल्या खड्ड्यांत मूळकूज"]]),
    stage("young-plant", ["Young plant care", "लहान झाडाची निगा"], 30, 730, ["The plant builds a strong single trunk and a balanced frame.", "झाडाचे एक मजबूत खोड व संतुलित सांगाडा तयार होतो."], [
      t("ms-sprout", 45, "other", ["Remove rootstock sprouts", "खुंटावरील फूट काढा"], ["Cut shoots below the bud joint and keep the trunk clear up to about 60 cm.", "डोळ्याच्या जोडाखालील फूट काढा आणि खोड साधारण 60 सेंमीपर्यंत मोकळे ठेवा."], 45),
      t("ms-irr1", 30, "irrigation", ["Water young plants", "लहान झाडांना पाणी द्या"], ["Light, regular water in the dry months, away from the trunk.", "कोरड्या महिन्यांत खोडापासून दूर हलके, नियमित पाणी."], 7),
      t("ms-obs1", 40, "observation", ["Check new leaves", "नवी पालवी तपासा"], ["Look for leaf miner lines, psylla on tender shoots and leaf-eating caterpillars.", "पाने पोखरणाऱ्या अळीच्या रेषा, कोवळ्या फुटीवर सिला व पाने खाणाऱ्या अळ्या पाहा."], 15),
      t("ms-intercrop", 60, "other", ["Grow a short intercrop", "कमी उंचीचे आंतरपीक घ्या"], ["In the first years, short legumes or vegetables between rows give income; keep them away from the basins.", "पहिल्या वर्षांत ओळींमध्ये कमी उंचीची कडधान्ये किंवा भाज्या घेतल्यास उत्पन्न मिळते; ती आळ्यांपासून दूर ठेवा."]),
    ], [["Leaf miner on new flush", "नव्या पालवीवर पाने पोखरणारी अळी"], ["Citrus psylla", "सिला"]]),
    stage("frame", ["Building the frame", "झाडाचा विस्तार"], 730, 1460, ["The tree spreads. Early flowers are removed so the tree grows.", "झाड विस्तारते. लवकरची फुले काढली जातात म्हणजे झाड वाढते."], [
      t("ms-deflower", 760, "other", ["Remove early flowers", "लवकरची फुले काढा"], ["Do not take a crop before the tree is 4–5 years old.", "झाड 4–5 वर्षांचे होण्यापूर्वी फळ घेऊ नका."], 180),
      t("ms-prune1", 740, "other", ["Remove dry and crossing twigs", "वाळलेल्या व घुसणाऱ्या फांद्या काढा"], ["Cut dead wood and water shoots.", "वाळलेले लाकूड व पाणफुटवे काढा."], 180),
      t("ms-fym1", 750, "fertiliser", ["Give manure every year", "दरवर्षी शेणखत द्या"], ["Apply well-rotted manure in a ring under the canopy edge; ask about fertiliser amounts for the tree's age.", "झाडाच्या घेराखाली गोलाकार कुजलेले शेणखत द्या; वयानुसार खताचे प्रमाण विचारा."], 365),
      t("ms-irr2", 731, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water in dry months; never touch the trunk.", "कोरड्या महिन्यांत नियमित पाणी; खोडाला पाणी लागू देऊ नका."], 10),
    ], [["Gummosis: gum oozing from trunk", "डिंक्या: खोडातून डिंक येणे"]]),
  ],
  cycles: [
    {
      key: "ambia",
      name: b("Ambia bahar", "आंबिया बहार"),
      startMonths: [12, 1],
      startEvent: b("Water stopped for rest in December, then manure and first irrigation in January", "डिसेंबरमध्ये विश्रांतीसाठी पाणी बंद, मग जानेवारीत शेणखत व पहिले पाणी"),
      harvestMonths: [9, 10, 11],
      note: b("Flowering in January–February; needs assured summer water. Fruit is ready in September–November.", "जानेवारी–फेब्रुवारीत फुलोरा; उन्हाळ्यात खात्रीचे पाणी लागते. सप्टेंबर–नोव्हेंबरमध्ये फळे तयार."),
      stages: bahar("msam"),
    },
    {
      key: "mrig",
      name: b("Mrig bahar", "मृग बहार"),
      startMonths: [4, 5],
      startEvent: b("Water stopped for rest in April–May, then flowering with the June rains", "एप्रिल–मे मध्ये विश्रांतीसाठी पाणी बंद, मग जूनच्या पावसाने फुलोरा"),
      harvestMonths: [1, 2, 3],
      note: b("Common in Marathwada where summer water is short. Flowering in June–July; fruit is ready in January–March.", "उन्हाळ्यात पाणी कमी असलेल्या मराठवाड्यात सामान्य. जून–जुलैमध्ये फुलोरा; जानेवारी–मार्चमध्ये फळे तयार."),
      stages: bahar("msmr"),
    },
    {
      key: "hasta",
      name: b("Hasta bahar", "हस्त बहार"),
      startMonths: [8, 9],
      startEvent: b("Rest in August–September, then first irrigation as the rains end", "ऑगस्ट–सप्टेंबरमध्ये विश्रांती, मग पाऊस संपताना पहिले पाणी"),
      harvestMonths: [6, 7, 8],
      note: b("Less common; rain often spoils the rest period. Fruit is ready in June–August when supply is low.", "कमी प्रमाणात; पावसामुळे विश्रांती अनेकदा बिघडते. पुरवठा कमी असताना जून–ऑगस्टमध्ये फळे तयार होतात."),
      stages: bahar("mshs"),
    },
  ],
  commonProblems: [
    {
      name: b("Phytophthora gummosis and root rot (dinkya)", "डिंक्या व मूळकूज (फायटोफ्थोरा)"),
      signs: b("Gum oozes from cracks at the trunk base, bark rots, leaves turn yellow and the tree declines.", "खोडाच्या बुंध्यावरील भेगांतून डिंक येतो, साल कुजते, पाने पिवळी पडतात आणि झाड खंगते."),
      prevention: prevent("Use the double-ring basin, avoid waterlogging, keep the bud joint above soil, and paint the lower trunk as advised by your KVK.", "दुहेरी आळे करा, पाणी साचू देऊ नका, डोळ्याचा जोड मातीवर ठेवा आणि कृषी विज्ञान केंद्राच्या सल्ल्याने खोडाच्या खालच्या भागाला लेप लावा."),
    },
    {
      name: b("Citrus psylla", "सिला"),
      signs: b("Tiny insects on tender shoots; leaves curl and new growth dries.", "कोवळ्या फुटीवर लहान कीटक; पाने मुरडतात व नवी फूट सुकते."),
      prevention: prevent("Check every new flush, especially at bahar start, and remove badly affected shoots.", "प्रत्येक नवी पालवी तपासा, विशेषतः बहार धरताना, आणि जास्त बाधित फुटी काढा."),
    },
    {
      name: b("Leaf miner", "पाने पोखरणारी अळी"),
      signs: b("Silvery, winding lines on young leaves; leaves curl.", "कोवळ्या पानांवर चंदेरी नागमोडी रेषा; पाने मुरडतात."),
      prevention: prevent("Watch young plants and new flushes closely.", "लहान झाडे व नव्या पालवीवर बारीक लक्ष ठेवा."),
    },
    {
      name: b("Fruit drop", "फळगळ"),
      signs: b("Young or near-ripe fruits fall after hot winds, water stress, sudden heavy water or disease.", "उष्ण वारे, पाण्याचा ताण, अचानक जास्त पाणी किंवा रोगानंतर कोवळी किंवा पिकत आलेली फळे गळतात."),
      prevention: prevent("Keep water even, give balanced nutrition, remove dry twigs and collect fallen fruit. Ask your KVK before using any growth regulator.", "सारखे पाणी द्या, संतुलित खत द्या, वाळलेल्या फांद्या काढा व गळलेली फळे गोळा करा. कोणतेही संजीवक वापरण्यापूर्वी कृषी विज्ञान केंद्राला विचारा."),
    },
    {
      name: b("Fruit sucking moth", "फळातील रस शोषणारा पतंग"),
      signs: b("Pin-sized holes on near-ripe fruit; the fruit yellows around the hole, rots and drops.", "पिकत आलेल्या फळांवर टाचणीएवढी छिद्रे; छिद्राभोवती फळ पिवळे होऊन सडते व गळते."),
      prevention: prevent("Collect and destroy fallen fruit, clear weeds and creepers around the orchard, and use light traps as advised.", "गळलेली फळे गोळा करून नष्ट करा, बागेभोवतीचे तण व वेली काढा आणि सल्ल्यानुसार प्रकाश सापळे वापरा."),
    },
  ],
  harvestSigns: b(
    "Fruit turns from dark green to light green or yellowish-green, the skin becomes smooth, and juice is sweet. Usually 8–9 months after flowering.",
    "फळाचा रंग गडद हिरव्यावरून फिकट हिरवा किंवा पिवळसर हिरवा होतो, साल गुळगुळीत होते आणि रस गोड लागतो. साधारण फुलोऱ्यानंतर 8–9 महिन्यांनी.",
  ),
  postHarvest: b(
    "Pick with clippers keeping a short stalk. Keep fruit in shade, remove damaged and spotted fruit, grade by size, and pack in ventilated crates.",
    "कात्रीने थोडा देठ ठेवून फळे काढा. फळे सावलीत ठेवा, खराब व डाग असलेली फळे वेगळी करा, आकारानुसार प्रतवारी करा आणि हवेशीर क्रेटमध्ये भरा.",
  ),
  marketTips: b(
    "Jalna is a big mosambi market. Large, clean fruit sells best for juice centres and city markets. Many farmers sell the orchard to traders before harvest — know your expected yield and compare offers first. Selling together through your Mandi Mitra helps.",
    "जालना ही मोसंबीची मोठी बाजारपेठ आहे. मोठी, स्वच्छ फळे रसवंती व शहरी बाजारात चांगल्या दराने विकली जातात. अनेक शेतकरी काढणीपूर्वीच बाग व्यापाऱ्यांना विकतात — आधी अपेक्षित उत्पादन जाणून घ्या व दरांची तुलना करा. मंडी मित्रामार्फत एकत्र विक्री फायदेशीर ठरते.",
  ),
  source: "General practices from VNMKV Parbhani, MPKV Rahuri and ICAR-Central Citrus Research Institute, Nagpur",
  lastVerified: null,
  reviewStatus: "draft",
};

/** The yearly bahar: same stages for ambia, mrig and hasta; task ids get a per-bahar prefix. */
function bahar(p: string) {
  return [
    stage("rest", ["Rest period", "विश्रांती"], 0, 30, ["Water is stopped so the tree rests and gets ready to flower.", "झाडाला विश्रांती मिळावी व फुलोऱ्यासाठी तयार व्हावे म्हणून पाणी बंद केले जाते."], [
      t(`${p}-rest`, 0, "other", ["Stop irrigation", "पाणी बंद करा"], ["Stop water so the tree rests; leaves may droop slightly. Keep the rest shorter on light soil.", "झाडाला विश्रांती मिळावी म्हणून पाणी बंद करा; पाने थोडी मलूल होऊ शकतात. हलक्या जमिनीत विश्रांती कमी ठेवा."]),
      t(`${p}-prune`, 15, "other", ["Clean the trees", "झाडांची स्वच्छता करा"], ["Cut dry, diseased and crossing twigs and water shoots; burn the cuttings.", "वाळलेल्या, रोगट, घुसणाऱ्या फांद्या व पाणफुटवे छाटा; छाटलेले जाळा."]),
    ], [["Gummosis on the trunk — treat now", "खोडावर डिंक्या — आत्ताच उपाय करा"]]),
    stage("bahar-start", ["Bahar start", "बहार धरणे"], 30, 45, ["Manure and the first water wake the tree; flower buds and new shoots come.", "शेणखत व पहिल्या पाण्याने झाड जागे होते; फुलकळ्या व नवी फूट येते."], [
      t(`${p}-fym`, 30, "fertiliser", ["Give manure and fertiliser", "शेणखत व खत द्या"], ["Apply well-rotted manure in the basin and the first fertiliser part as per soil test.", "आळ्यात कुजलेले शेणखत व माती परीक्षणानुसार खताचा पहिला हप्ता द्या."]),
      t(`${p}-irr1`, 31, "irrigation", ["First irrigation after rest", "विश्रांतीनंतरचे पहिले पाणी"], ["Give a light first water, then a full one; afterwards water regularly, away from the trunk.", "आधी हलके पाणी, मग भरपूर पाणी; नंतर खोडापासून दूर नियमित पाणी द्या."], 6),
    ], [["Psylla and leaf miner on new flush", "नव्या पालवीवर सिला व पाने पोखरणारी अळी"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 45, 75, ["Flowers open and small fruits set.", "फुले उमलतात आणि लहान फळे धरतात."], [
      t(`${p}-irr2`, 45, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even moisture helps fruit set; avoid flooding.", "सारख्या ओलाव्याने फळधारणा चांगली होते; पाणी तुंबवू नका."], 6),
      t(`${p}-obs1`, 47, "observation", ["Check flowers and new leaves", "फुले व नवी पालवी तपासा"], ["Look for psylla, thrips and leaf miner. Protect bees — avoid spraying open flowers.", "सिला, फुलकिडे व पाने पोखरणारी अळी पाहा. मधमाश्यांचे संरक्षण करा — उमललेल्या फुलांवर फवारणी टाळा."], 7),
    ], [["Thrips on flowers", "फुलांवर फुलकिडे"]]),
    stage("fruit-set", ["Fruit set and natural drop", "फळधारणा व नैसर्गिक गळ"], 75, 150, ["Many small fruits drop naturally; the tree keeps a load it can carry.", "बरीच लहान फळे नैसर्गिकरीत्या गळतात; झाड पेलेल एवढी फळे राहतात."], [
      t(`${p}-irr3`, 75, "irrigation", ["Irrigate regularly", "नियमित पाणी द्या"], ["Water stress now causes heavy fruit drop.", "आता पाण्याचा ताण पडल्यास जास्त फळगळ होते."], 7),
      t(`${p}-fert2`, 90, "fertiliser", ["Second fertiliser part", "खताचा दुसरा हप्ता"], ["Give the next part as per plan; ask your agriculture officer about micronutrients.", "नियोजनानुसार पुढचा हप्ता द्या; सूक्ष्म अन्नद्रव्यांबद्दल कृषी अधिकाऱ्यांना विचारा."]),
      t(`${p}-obs2`, 80, "observation", ["Check fruit drop and pests", "फळगळ व किडी तपासा"], ["Note how much fruit drops and look for psylla and mites on young fruit.", "किती फळगळ होते ते नोंदवा आणि कोवळ्या फळांवर सिला व कोळी पाहा."], 10),
    ], [["Fruit drop", "फळगळ"], ["Mites on young fruit", "कोवळ्या फळांवर कोळी"]]),
    stage("fruit-growth", ["Fruit growth", "फळांची वाढ"], 150, 270, ["Fruits grow to full size and fill with juice.", "फळे पूर्ण आकाराची होतात व रसाने भरतात."], [
      t(`${p}-irr4`, 150, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even water prevents splitting and drop; drain water in the monsoon.", "सारख्या पाण्याने फळे तडकत नाहीत व गळत नाहीत; पावसाळ्यात पाण्याचा निचरा करा."], 8),
      t(`${p}-obs3`, 155, "observation", ["Check fruit and trunk", "फळे व खोड तपासा"], ["Look for fruit sucking moth holes, fallen fruit, and gum on the trunk.", "रस शोषणाऱ्या पतंगाची छिद्रे, गळलेली फळे व खोडावर डिंक पाहा."], 10),
      t(`${p}-collect`, 160, "other", ["Collect fallen fruit", "गळलेली फळे गोळा करा"], ["Pick up and destroy fallen fruit every week.", "दर आठवड्याला गळलेली फळे गोळा करून नष्ट करा."], 7),
      t(`${p}-fert3`, 180, "fertiliser", ["Last fertiliser part", "खताचा शेवटचा हप्ता"], ["Give the last part as per your plan.", "नियोजनानुसार शेवटचा हप्ता द्या."]),
    ], [["Fruit sucking moth", "रस शोषणारा पतंग"], ["Fruit splitting", "फळे तडकणे"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 270, 330, ["Fruits turn light green, juice turns sweet, and they are picked in rounds.", "फळे फिकट हिरवी होतात, रस गोड होतो आणि फेऱ्यांमध्ये काढणी होते."], [
      t(`${p}-mat`, 270, "observation", ["Check maturity", "पक्वता तपासा"], ["Taste a few fruits; pick when colour and sweetness are right. Check spray waiting periods on labels.", "काही फळे चाखून पाहा; रंग व गोडी योग्य असताना काढा. लेबलवरील फवारणीचा प्रतीक्षा कालावधी तपासा."]),
      t(`${p}-pick`, 275, "harvest", ["Pick ripe fruit", "पिकलेली फळे काढा"], ["Cut with clippers keeping a short stalk; do not pull or drop fruit.", "कात्रीने थोडा देठ ठेवून काढा; फळे ओढू किंवा आपटू नका."], 7),
    ], [["Fruit fly and moth on ripe fruit", "पिकलेल्या फळांवर फळमाशी व पतंग"]]),
  ];
}

export default crop;
