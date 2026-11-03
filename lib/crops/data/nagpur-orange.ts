import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Nagpur mandarin: establishment years, then one bahar a year — ambia or mrig. */
const crop: PerennialCrop = {
  id: "nagpur-orange",
  emoji: "🍊",
  name: b("Nagpur orange (mandarin)", "संत्री"),
  aliases: ["nagpur orange", "orange", "oranges", "mandarin", "nagpur mandarin", "santra", "santre", "santri", "संत्री", "संत्रा", "संत्रे", "नागपुरी संत्री", "संतरा"],
  category: "fruit",
  lifecycle: "perennial",
  regions: ["vidarbha"],
  majorDistricts: b("Nagpur, Amravati, Wardha, Akola", "नागपूर, अमरावती, वर्धा, अकोला"),
  tier: 1,
  plantingWindow: b("June–August, in the monsoon", "जून–ऑगस्ट, पावसाळ्यात"),
  plantingMonths: [6, 7, 8],
  plantingMaterial: b(
    "Budded plants on a rootstock recommended by ICAR-CCRI, from a registered, disease-free nursery",
    "ICAR-केंद्रीय लिंबूवर्गीय फळ संशोधन संस्थेने शिफारस केलेल्या खुंटावरील डोळा भरलेली कलमे, नोंदणीकृत व रोगमुक्त रोपवाटिकेतून",
  ),
  spacing: b("6 m × 6 m is common; closer spacing only with expert advice", "6 मीटर × 6 मीटर सामान्य; कमी अंतर फक्त तज्ज्ञांच्या सल्ल्याने"),
  plantsPerAcre: [110, 120],
  yearsToFirstHarvest: [4, 5],
  economicLifeYears: [20, 30],
  soil: b(
    "Medium, well-drained soil about 1–1.5 m deep. Avoid heavy soil where water stands — it causes root rot and gummosis. Avoid soil with a hard lime layer.",
    "साधारण 1–1.5 मीटर खोल, पाण्याचा चांगला निचरा होणारी मध्यम जमीन. पाणी साचणारी भारी जमीन टाळा — त्यामुळे मूळकूज व डिंक्या होतो. चुनखडीचा कडक थर असलेली जमीन टाळा.",
  ),
  climate: b(
    "Hot dry summers and cool winters of Vidarbha suit it; the winter cold gives the fruit its colour and taste. Hot winds in summer cause fruit drop.",
    "विदर्भाचा कडक कोरडा उन्हाळा व थंड हिवाळा योग्य; हिवाळ्यातील थंडीमुळे फळाला रंग व चव येते. उन्हाळ्यातील उष्ण वाऱ्यामुळे फळगळ होते.",
  ),
  irrigation: b(
    "Drip or the double-ring basin method keeps water away from the trunk — never let water touch the trunk. Stop water for the rest period before a bahar, then give regular water through fruit growth. Uneven water causes fruit drop and splitting.",
    "ठिबक किंवा दुहेरी आळे पद्धतीने पाणी खोडापासून दूर ठेवा — पाणी खोडाला कधीही लागू देऊ नका. बहार धरण्यापूर्वी विश्रांतीसाठी पाणी बंद करा, मग फळवाढीत नियमित पाणी द्या. अनियमित पाण्याने फळगळ व फळे तडकतात.",
  ),
  nutrientGuide: b(
    "Base it on soil and leaf tests. Give well-rotted farmyard manure every year and split fertiliser into parts — at bahar start and during fruit growth. Citrus often shows lack of zinc and other micronutrients; ask your agriculture officer before giving them.",
    "माती व पान परीक्षणावर आधारित खत द्या. दरवर्षी कुजलेले शेणखत द्या आणि खत हप्त्यांत द्या — बहार धरताना व फळवाढीत. लिंबूवर्गीय झाडांत जस्त व इतर सूक्ष्म अन्नद्रव्यांची कमतरता दिसते; ती देण्यापूर्वी कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Nagpur Santra", note: b("The traditional Nagpur mandarin grown across Vidarbha", "संपूर्ण विदर्भात लागवड होणारी पारंपरिक नागपुरी संत्री") },
    // TODO: varieties — confirm seedless / improved Nagpur mandarin selections with ICAR-CCRI Nagpur and Dr. PDKV Akola
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Budded plants are set in pits and take root.", "कलमे खड्ड्यांत लावली जातात व मूळ धरतात."], [
      t("ng-pit", 0, "other", ["Plant in filled pits", "भरलेल्या खड्ड्यांत लागवड करा"], ["Fill pits with topsoil and well-rotted manure. Keep the bud joint well above the soil and stake the plant.", "खड्डे वरची माती व कुजलेल्या शेणखताने भरा. डोळ्याचा जोड मातीच्या बराच वर ठेवा व रोपाला काठीचा आधार द्या."]),
      t("ng-ring", 3, "other", ["Make a double-ring basin", "दुहेरी आळे करा"], ["Make a small inner ring around the trunk so water never touches it.", "खोडाभोवती लहान आतले आळे करा म्हणजे पाणी खोडाला लागणार नाही."]),
      t("ng-gap0", 25, "other", ["Replace dead plants", "मेलेली कलमे बदला"], ["Fill gaps in the same season.", "त्याच हंगामात खाडे भरा."]),
    ], [["Root rot in waterlogged pits", "पाणी साचलेल्या खड्ड्यांत मूळकूज"]]),
    stage("young-plant", ["Young plant care", "लहान झाडाची निगा"], 30, 730, ["The plant builds a strong single trunk and a balanced frame.", "झाडाचे एक मजबूत खोड व संतुलित सांगाडा तयार होतो."], [
      t("ng-sprout", 45, "other", ["Remove rootstock sprouts", "खुंटावरील फूट काढा"], ["Cut shoots below the bud joint and keep the trunk clear up to about 60 cm.", "डोळ्याच्या जोडाखालील फूट काढा आणि खोड साधारण 60 सेंमीपर्यंत मोकळे ठेवा."], 45),
      t("ng-irr1", 30, "irrigation", ["Water young plants", "लहान झाडांना पाणी द्या"], ["Light, regular water in the dry months, away from the trunk.", "कोरड्या महिन्यांत खोडापासून दूर हलके, नियमित पाणी."], 7),
      t("ng-obs1", 40, "observation", ["Check new leaves", "नवी पालवी तपासा"], ["Look for silvery zig-zag lines (leaf miner), curling leaves with tiny insects (psylla) and caterpillars.", "पानांवर चंदेरी नागमोडी रेषा (पाने पोखरणारी अळी), लहान कीटकांसह मुरडलेली पाने (सिला) व अळ्या पाहा."], 15),
      t("ng-weed1", 60, "weeding", ["Keep basins clean", "आळी स्वच्छ ठेवा"], ["Weed the basin and keep mulch a little away from the trunk.", "आळ्यातील तण काढा आणि आच्छादन खोडापासून थोडे दूर ठेवा."], 45),
    ], [["Leaf miner on new flush", "नव्या पालवीवर पाने पोखरणारी अळी"], ["Citrus psylla", "सिला"]]),
    stage("frame", ["Building the frame", "झाडाचा विस्तार"], 730, 1460, ["The tree spreads. Flowers that come now are removed so the tree grows.", "झाड विस्तारते. आता येणारी फुले काढली जातात म्हणजे झाड वाढते."], [
      t("ng-deflower", 760, "other", ["Remove early flowers", "लवकरची फुले काढा"], ["Do not take a crop before the tree is 4–5 years old.", "झाड 4–5 वर्षांचे होण्यापूर्वी फळ घेऊ नका."], 180),
      t("ng-prune1", 740, "other", ["Remove dry and crossing twigs", "वाळलेल्या व घुसणाऱ्या फांद्या काढा"], ["Cut dead wood and water shoots; seal big cuts.", "वाळलेले लाकूड व पाणफुटवे काढा; मोठ्या कापांना लेप लावा."], 180),
      t("ng-fym1", 750, "fertiliser", ["Give manure every year", "दरवर्षी शेणखत द्या"], ["Apply well-rotted manure in a ring under the canopy edge; ask about fertiliser amounts for the tree's age.", "झाडाच्या घेराखाली गोलाकार कुजलेले शेणखत द्या; वयानुसार खताचे प्रमाण विचारा."], 365),
      t("ng-irr2", 731, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water in dry months; never touch the trunk.", "कोरड्या महिन्यांत नियमित पाणी; खोडाला पाणी लागू देऊ नका."], 10),
    ], [["Gummosis: gum oozing from trunk", "डिंक्या: खोडातून डिंक येणे"]]),
  ],
  cycles: [
    {
      key: "ambia",
      name: b("Ambia bahar", "आंबिया बहार"),
      startMonths: [12, 1],
      startEvent: b("Water stopped for rest in December, then manure and first irrigation in January", "डिसेंबरमध्ये विश्रांतीसाठी पाणी बंद, मग जानेवारीत शेणखत व पहिले पाणी"),
      harvestMonths: [10, 11, 12],
      note: b(
        "Flowering in January–February; fruit grows through summer and monsoon, so assured summer water is needed. Fruit is ready in October–December.",
        "जानेवारी–फेब्रुवारीत फुलोरा; फळे उन्हाळा व पावसाळ्यात वाढतात, त्यामुळे उन्हाळ्यात खात्रीचे पाणी लागते. ऑक्टोबर–डिसेंबरमध्ये फळे तयार होतात.",
      ),
      stages: bahar("ngam"),
    },
    {
      key: "mrig",
      name: b("Mrig bahar", "मृग बहार"),
      startMonths: [4, 5],
      startEvent: b("Water stopped for rest in April–May, then flowering with the June rains", "एप्रिल–मे मध्ये विश्रांतीसाठी पाणी बंद, मग जूनच्या पावसाने फुलोरा"),
      harvestMonths: [2, 3, 4],
      note: b(
        "Suits orchards without enough summer water. Flowering in June–July; fruit is ready in February–April.",
        "उन्हाळ्यात पुरेसे पाणी नसलेल्या बागांसाठी योग्य. जून–जुलैमध्ये फुलोरा; फेब्रुवारी–एप्रिलमध्ये फळे तयार.",
      ),
      stages: bahar("ngmr"),
    },
  ],
  commonProblems: [
    {
      name: b("Phytophthora gummosis and root rot (dinkya)", "डिंक्या व मूळकूज (फायटोफ्थोरा)"),
      signs: b("Gum oozes from cracks at the trunk base, bark rots, leaves turn yellow and the tree slowly declines.", "खोडाच्या बुंध्यावरील भेगांतून डिंक येतो, साल कुजते, पाने पिवळी पडतात आणि झाड हळूहळू खंगते."),
      prevention: prevent("Use the double-ring basin so water never touches the trunk, avoid waterlogging, keep the bud joint above soil, and paint the lower trunk as advised by your KVK.", "पाणी खोडाला लागू नये म्हणून दुहेरी आळे करा, पाणी साचू देऊ नका, डोळ्याचा जोड मातीवर ठेवा आणि कृषी विज्ञान केंद्राच्या सल्ल्याने खोडाच्या खालच्या भागाला लेप लावा."),
    },
    {
      name: b("Citrus psylla", "सिला"),
      signs: b("Tiny insects suck sap from tender shoots; leaves curl and new growth dries. It also spreads greening disease.", "लहान कीटक कोवळ्या फुटीतील रस शोषतात; पाने मुरडतात व नवी फूट सुकते. ते ग्रीनिंग रोगही पसरवतात."),
      prevention: prevent("Check every new flush, especially at bahar start, and remove badly affected shoots.", "प्रत्येक नवी पालवी तपासा, विशेषतः बहार धरताना, आणि जास्त बाधित फुटी काढा."),
    },
    {
      name: b("Leaf miner", "पाने पोखरणारी अळी"),
      signs: b("Silvery, winding lines on young leaves; leaves curl and growth of young plants slows.", "कोवळ्या पानांवर चंदेरी नागमोडी रेषा; पाने मुरडतात व लहान झाडांची वाढ मंदावते."),
      prevention: prevent("Watch young plants and new flushes closely; avoid unwanted flushes with timely irrigation.", "लहान झाडे व नव्या पालवीवर बारीक लक्ष ठेवा; वेळेवर पाणी देऊन नको असलेली पालवी टाळा."),
    },
    {
      name: b("Fruit drop", "फळगळ"),
      signs: b("Many young or near-ripe fruits fall, especially after hot winds, water stress, sudden heavy water or disease.", "उष्ण वारे, पाण्याचा ताण, अचानक जास्त पाणी किंवा रोगानंतर बरीच कोवळी किंवा पिकत आलेली फळे गळतात."),
      prevention: prevent("Keep water even, give balanced nutrition, remove dry twigs and collect fallen fruit. Growth regulators are used to reduce drop — ask your KVK before using any.", "सारखे पाणी द्या, संतुलित खत द्या, वाळलेल्या फांद्या काढा व गळलेली फळे गोळा करा. फळगळ कमी करण्यासाठी संजीवक वापरतात — वापरण्यापूर्वी कृषी विज्ञान केंद्राला विचारा."),
    },
    {
      name: b("Fruit sucking moth", "फळातील रस शोषणारा पतंग"),
      signs: b("Pin-sized holes on near-ripe fruit (mostly ambia fruit in August–October); fruit turns yellow around the hole, rots and drops.", "पिकत आलेल्या फळांवर टाचणीएवढी छिद्रे (मुख्यतः ऑगस्ट–ऑक्टोबरमधील आंबिया फळांवर); छिद्राभोवती फळ पिवळे होऊन सडते व गळते."),
      prevention: prevent("Collect and destroy fallen fruit, remove weeds and creepers around the orchard where the moth breeds, and use light traps as advised.", "गळलेली फळे गोळा करून नष्ट करा, पतंगांची उत्पत्ती होणारे बागेभोवतीचे तण व वेली काढा आणि सल्ल्यानुसार प्रकाश सापळे वापरा."),
    },
  ],
  harvestSigns: b(
    "Fruit turns orange-yellow, the skin becomes smooth and slightly loose, and the taste is sweet with mild sourness. Usually about 9–10 months after flowering.",
    "फळ नारिंगी-पिवळे होते, साल गुळगुळीत व थोडी सैल होते आणि चव गोड व किंचित आंबट लागते. साधारण फुलोऱ्यानंतर 9–10 महिन्यांनी.",
  ),
  postHarvest: b(
    "Pick with a short stalk using clippers, not by pulling. Keep fruit in shade, sort out damaged and spotted fruit, grade by size, and pack in ventilated crates or boxes.",
    "फळे ओढून न तोडता कात्रीने थोडा देठ ठेवून काढा. फळे सावलीत ठेवा, खराब व डाग असलेली फळे वेगळी करा, आकारानुसार प्रतवारी करा आणि हवेशीर क्रेट किंवा खोक्यांत भरा.",
  ),
  marketTips: b(
    "Nagpur orange is GI-registered. Graded, waxed and well-coloured fruit gets better prices in distant markets. Many farmers sell the whole orchard to traders before harvest — compare offers and know your expected yield before agreeing. Selling together through your Mandi Mitra improves bargaining power.",
    "नागपुरी संत्र्याला भौगोलिक मानांकन (GI) आहे. प्रतवारी केलेल्या, चांगल्या रंगाच्या फळांना लांबच्या बाजारात जास्त दर मिळतो. अनेक शेतकरी काढणीपूर्वीच संपूर्ण बाग व्यापाऱ्यांना विकतात — करार करण्यापूर्वी अपेक्षित उत्पादन माहिती करून घ्या व दरांची तुलना करा. मंडी मित्रामार्फत एकत्र विकल्यास वाटाघाटीची ताकद वाढते.",
  ),
  source: "General practices from ICAR-Central Citrus Research Institute, Nagpur and Dr. PDKV Akola",
  lastVerified: null,
  reviewStatus: "draft",
};

/** The yearly bahar: same stages for ambia and mrig; task ids get a per-bahar prefix. */
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
    stage("fruit-growth", ["Fruit growth", "फळांची वाढ"], 150, 300, ["Fruits grow to full size and fill with juice.", "फळे पूर्ण आकाराची होतात व रसाने भरतात."], [
      t(`${p}-irr4`, 150, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even water prevents splitting and drop; drain water in the monsoon.", "सारख्या पाण्याने फळे तडकत नाहीत व गळत नाहीत; पावसाळ्यात पाण्याचा निचरा करा."], 8),
      t(`${p}-obs3`, 155, "observation", ["Check fruit and trunk", "फळे व खोड तपासा"], ["Look for fruit sucking moth holes, fallen fruit, and gum on the trunk.", "रस शोषणाऱ्या पतंगाची छिद्रे, गळलेली फळे व खोडावर डिंक पाहा."], 10),
      t(`${p}-collect`, 160, "other", ["Collect fallen fruit", "गळलेली फळे गोळा करा"], ["Pick up and destroy fallen fruit every week so pests do not build up.", "किडी वाढू नयेत म्हणून दर आठवड्याला गळलेली फळे गोळा करून नष्ट करा."], 7),
      t(`${p}-fert3`, 180, "fertiliser", ["Last fertiliser part", "खताचा शेवटचा हप्ता"], ["Give the last part as per your plan.", "नियोजनानुसार शेवटचा हप्ता द्या."]),
    ], [["Fruit sucking moth", "रस शोषणारा पतंग"], ["Fruit splitting", "फळे तडकणे"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 300, 360, ["Fruits colour up, turn sweet and are picked in rounds.", "फळे रंग धरतात, गोड होतात आणि फेऱ्यांमध्ये काढली जातात."], [
      t(`${p}-mat`, 300, "observation", ["Check maturity", "पक्वता तपासा"], ["Taste a few fruits; pick when colour and sweetness are right. Check spray waiting periods on labels.", "काही फळे चाखून पाहा; रंग व गोडी योग्य असताना काढा. लेबलवरील फवारणीचा प्रतीक्षा कालावधी तपासा."]),
      t(`${p}-pick`, 305, "harvest", ["Pick ripe fruit", "पिकलेली फळे काढा"], ["Cut with clippers keeping a short stalk; do not pull or drop fruit.", "कात्रीने थोडा देठ ठेवून काढा; फळे ओढू किंवा आपटू नका."], 7),
    ], [["Fruit fly and moth on ripe fruit", "पिकलेल्या फळांवर फळमाशी व पतंग"]]),
  ];
}

export default crop;
