import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Fig: one pruning a year starts the crop; farmers choose khatta (rainy) or meetha (winter–summer) bahar. */
const crop: PerennialCrop = {
  id: "fig",
  emoji: "🟣",
  name: b("Fig", "अंजीर"),
  aliases: ["fig", "figs", "anjeer", "anjir", "anjeer fruit", "अंजीर", "अंजिर"],
  category: "fruit",
  lifecycle: "perennial",
  regions: ["western"],
  majorDistricts: b("Pune (Purandar)", "पुणे (पुरंदर)"),
  tier: 2,
  plantingWindow: b("June–August, with the monsoon", "जून–ऑगस्ट, पावसाळ्यात"),
  plantingMonths: [6, 7, 8],
  plantingMaterial: b("Rooted cuttings or air-layers from healthy, high-yielding trees", "निरोगी, भरपूर उत्पादन देणाऱ्या झाडांची मुळे फुटलेली छाट कलमे किंवा गुटी कलमे"),
  spacing: b("4.5–5 m between rows and 3–4.5 m between plants", "दोन ओळींत 4.5–5 मीटर व दोन झाडांत 3–4.5 मीटर"),
  plantsPerAcre: [180, 300],
  yearsToFirstHarvest: [2, 3],
  economicLifeYears: [20, 30],
  soil: b(
    "Light to medium, well-drained soil. Murmad (gravelly) soils of Purandar suit it. Avoid heavy, waterlogged and salty soils.",
    "हलकी ते मध्यम, पाण्याचा चांगला निचरा होणारी जमीन. पुरंदरसारखी मुरमाड जमीन योग्य. भारी, पाणी साचणारी व खारवट जमीन टाळा.",
  ),
  climate: b(
    "Dry, warm climate. Fruits ripening in dry weather are sweet; rain at ripening makes them crack, sour and rot.",
    "कोरडे, उबदार हवामान. कोरड्या हवेत पिकणारी फळे गोड होतात; पिकताना पाऊस आल्यास फळे तडकतात, आंबट होतात व सडतात.",
  ),
  irrigation: b(
    "Drip irrigation is best. Give no water during the rest before pruning, then regular light water through fruit growth. Water evenly while fruits ripen — a sudden heavy watering cracks them.",
    "ठिबक सिंचन उत्तम. छाटणीपूर्वीच्या विश्रांतीत पाणी देऊ नका, मग फळवाढीत नियमित हलके पाणी द्या. फळे पिकताना सारखे पाणी द्या — अचानक भरपूर पाणी दिल्यास फळे तडकतात.",
  ),
  nutrientGuide: b(
    "Give well-rotted farmyard manure in the basin right after pruning. Add fertiliser as per soil test, split into 2–3 parts during fruit growth. Ask your agriculture officer for amounts.",
    "छाटणीनंतर लगेच आळ्यात चांगले कुजलेले शेणखत द्या. माती परीक्षणानुसार खत फळवाढीच्या काळात 2–3 हप्त्यांत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Poona Fig", note: b("The traditional fig of Pune district (Purandar); grown for fresh fruit", "पुणे जिल्ह्याचे (पुरंदर) पारंपरिक अंजीर; ताज्या फळांसाठी") },
    { name: "Dinkar", note: b("Selection from Poona Fig grown in Purandar; larger fruit", "पुरंदरमध्ये घेतली जाणारी पूना फिगमधील निवड; मोठी फळे") },
  ], // TODO: varieties — confirm MPKV Rahuri fig releases (e.g. from its Purandar/Jadhavwadi station) before adding
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Cuttings or layers are planted and take root.", "कलमे लावली जातात व मूळ धरतात."], [
      t("fg-pit", 0, "other", ["Plant in prepared pits", "तयार खड्ड्यांत लागवड करा"], ["Fill pits with topsoil and well-rotted manure and plant at the same depth as in the bag.", "खड्डे वरची माती व कुजलेल्या शेणखताने भरा आणि पिशवीत होते तेवढ्याच खोलीवर लावा."]),
      t("fg-irr0", 2, "irrigation", ["Water if rain stops", "पाऊस थांबल्यास पाणी द्या"], ["Keep soil moist, not wet; fig roots rot in standing water.", "माती ओलसर ठेवा, चिखल नको; साचलेल्या पाण्यात अंजिराची मुळे कुजतात."], 5),
      t("fg-gap", 25, "other", ["Replace dead plants", "मेलेली रोपे बदला"], ["Fill gaps early so the orchard grows evenly.", "बाग एकसारखी वाढावी म्हणून खाडे लवकर भरा."]),
    ], [["Termites at the roots", "मुळांना वाळवी"]]),
    stage("training", ["Training the young tree", "झाडाला आकार देणे"], 30, 365, ["The plant is headed back and shaped to 3–4 main branches.", "झाडाचा शेंडा मारून 3–4 मुख्य फांद्यांचा आकार दिला जातो."], [
      t("fg-head", 60, "other", ["Head back and select branches", "शेंडा मारून फांद्या निवडा"], ["Cut the main stem at about 60–75 cm and keep 3–4 well-spaced branches.", "मुख्य खोड साधारण 60–75 सेंमीवर छाटा व 3–4 सारख्या अंतरावरच्या फांद्या ठेवा."]),
      t("fg-sucker", 90, "other", ["Remove suckers", "फुटवे काढा"], ["Remove shoots from the base regularly.", "बुंध्यातील फुटवे नियमित काढा."], 60),
      t("fg-irr1", 120, "irrigation", ["Irrigate young plants", "लहान झाडांना पाणी द्या"], ["Light, regular water in the dry months.", "कोरड्या महिन्यांत हलके, नियमित पाणी."], 7),
      t("fg-obs1", 45, "observation", ["Check leaves", "पाने तपासा"], ["Look for rusty spots under leaves and stem borer holes.", "पानांखाली तांबूस ठिपके व खोडावर छिद्रे पाहा."], 30),
    ], [["Rust", "तांबेरा"], ["Stem borer", "खोडकिडा"]]),
    stage("canopy", ["Building the canopy", "झाडाचा विस्तार"], 365, 730, ["The tree builds its frame; take only a light first crop.", "झाडाचा सांगाडा तयार होतो; पहिले पीक हलकेच घ्या."], [
      t("fg-prune2", 400, "other", ["Yearly shaping cut", "वार्षिक आकार छाटणी"], ["Shorten last season's shoots to build more fruiting branches.", "मागील हंगामातील फांद्या कमी करून फळफांद्या वाढवा."]),
      t("fg-irr2", 365, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular drip irrigation; adjust for season.", "हंगामानुसार नियमित ठिबक पाणी."], 7),
      t("fg-obs2", 370, "observation", ["Check the trees", "झाडे तपासा"], ["Look for rust, borer and dry branches.", "तांबेरा, खोडकिडा व वाळलेल्या फांद्या पाहा."], 30),
    ], [["Rust", "तांबेरा"]]),
  ],
  cycles: [
    {
      key: "meetha",
      name: b("Meetha bahar (sweet season)", "मीठा बहार"),
      startMonths: [9, 10],
      startEvent: b("Rest in the rains, then pruning and first irrigation in September–October", "पावसाळ्यात विश्रांती, मग सप्टेंबर–ऑक्टोबरमध्ये छाटणी व पहिले पाणी"),
      harvestMonths: [2, 3, 4, 5],
      note: b("The main bahar in Purandar. Fruits ripen in dry weather and are sweet; needs assured summer water.", "पुरंदरमधील मुख्य बहार. फळे कोरड्या हवेत पिकतात व गोड होतात; उन्हाळ्यात खात्रीचे पाणी लागते."),
      stages: bahar("fgm"),
    },
    {
      key: "khatta",
      name: b("Khatta bahar (rainy season)", "खट्टा बहार"),
      startMonths: [5, 6],
      startEvent: b("Rest in summer, then pruning and water in May–June", "उन्हाळ्यात विश्रांती, मग मे–जूनमध्ये छाटणी व पाणी"),
      harvestMonths: [8, 9, 10],
      note: b("Fruits ripen in the rains: more cracking, rot and rust, and less sweet. Taken by fewer farmers, mainly where summer water is short.", "फळे पावसाळ्यात पिकतात: तडकणे, सड व तांबेरा जास्त आणि गोडी कमी. उन्हाळ्यात पाणी कमी असेल तेथेच मोजके शेतकरी घेतात."),
      stages: bahar("fgk"),
    },
  ],
  commonProblems: [
    {
      name: b("Rust", "तांबेरा"),
      signs: b("Small rusty-brown spots under the leaves; leaves turn yellow and fall early.", "पानांखाली लहान तांबूस-तपकिरी ठिपके; पाने पिवळी पडून लवकर गळतात."),
      prevention: prevent("Collect and destroy fallen leaves, prune for air flow and check leaves weekly in humid weather.", "गळलेली पाने गोळा करून नष्ट करा, हवा खेळती राहील अशी छाटणी करा आणि दमट हवेत दर आठवड्याला पाने तपासा."),
    },
    {
      name: b("Stem borer", "खोडकिडा"),
      signs: b("Holes in stems and branches with sawdust-like waste; branches dry.", "खोड व फांद्यांवर छिद्रे व भुशासारखी विष्ठा; फांद्या वाळतात."),
      prevention: prevent("Cut and burn badly affected branches and keep the trunk and basin clean.", "जास्त बाधित फांद्या कापून जाळा आणि खोड व आळे स्वच्छ ठेवा."),
    },
    {
      name: b("Fruit cracking and souring", "फळे तडकणे व आंबणे"),
      signs: b("Ripe fruits split, go sour and attract flies, mostly after rain or uneven watering.", "पिकलेली फळे फुटतात, आंबतात व माशा येतात; बहुतेक पावसानंतर किंवा अनियमित पाण्याने."),
      prevention: b("Water evenly by drip, mulch the basins, pick daily in the ripening season and choose meetha bahar where you can.", "ठिबकने सारखे पाणी द्या, आळ्यांत आच्छादन करा, पिकण्याच्या काळात रोज तोडणी करा आणि शक्य असल्यास मीठा बहार घ्या."),
    },
  ],
  harvestSigns: b(
    "Fruit softens, turns from green to its ripe colour and the neck droops. Pick ripe fruit every day — figs do not ripen further after picking.",
    "फळ मऊ होते, हिरव्यावरून पिकलेल्या रंगात येते व देठाजवळ झुकते. रोज पिकलेली फळे तोडा — तोडल्यानंतर अंजीर पुढे पिकत नाही.",
  ),
  postHarvest: b(
    "Pick in the early morning, keep in shade, sort out cracked fruit and pack in small boxes lined with leaves or soft paper. Fresh figs last only 1–2 days; sell the same day if you can.",
    "पहाटे तोडा, सावलीत ठेवा, तडकलेली फळे वेगळी करा आणि पाने किंवा मऊ कागदाचे अस्तर असलेल्या लहान खोक्यांत भरा. ताजे अंजीर फक्त 1–2 दिवस टिकते; शक्य असल्यास त्याच दिवशी विका.",
  ),
  marketTips: b(
    "Pune and Mumbai markets pay well for fresh, unbroken Purandar figs. Cracked or extra fruit can be dried or sold for processing.",
    "ताज्या, न फुटलेल्या पुरंदर अंजिराला पुणे व मुंबई बाजारात चांगला दर मिळतो. तडकलेली किंवा जादा फळे सुकवून किंवा प्रक्रियेसाठी विकता येतात.",
  ),
  source: "General practices from MPKV Rahuri fig guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

/** The yearly bahar: same stages for meetha and khatta; task ids get a per-bahar prefix. */
function bahar(p: string) {
  return [
    stage("pruning", ["Pruning", "छाटणी"], 0, 20, ["After the rest, the tree is pruned and watered so new shoots come.", "विश्रांतीनंतर छाटणी करून पाणी दिले जाते, म्हणजे नवी फूट येते."], [
      t(`${p}-prune`, 0, "other", ["Prune the tree", "झाडाची छाटणी करा"], ["Shorten last season's shoots and remove dry, diseased and crowded branches; burn the cuttings.", "मागील हंगामातील फांद्या कमी करा आणि वाळलेल्या, रोगट व दाटीच्या फांद्या काढा; छाटलेले जाळा."]),
      t(`${p}-fym`, 2, "fertiliser", ["Give manure", "शेणखत द्या"], ["Apply well-rotted farmyard manure in the basin and the first fertiliser part as per soil test.", "आळ्यात कुजलेले शेणखत व माती परीक्षणानुसार खताचा पहिला हप्ता द्या."]),
      t(`${p}-irr1`, 3, "irrigation", ["First irrigation", "पहिले पाणी"], ["Give a good first watering, then light regular water.", "पहिले भरपूर पाणी द्या, मग हलके नियमित पाणी."], 6),
    ], [["Borer holes in old wood", "जुन्या लाकडात खोडकिड्याची छिद्रे"]]),
    stage("shoots", ["New shoots & fruit buds", "नवी फूट व फळे लागणे"], 20, 60, ["New shoots grow and small fruits appear at each leaf joint.", "नवी फूट वाढते आणि प्रत्येक पानाच्या बेचक्यात लहान फळे लागतात."], [
      t(`${p}-irr2`, 20, "irrigation", ["Irrigate", "पाणी द्या"], ["Light, regular water through drip.", "ठिबकने हलके, नियमित पाणी."], 5),
      t(`${p}-obs1`, 25, "observation", ["Check new leaves", "नवी पाने तपासा"], ["Look for rust spots, thrips and mites on young leaves.", "कोवळ्या पानांवर तांबेरा, फुलकिडे व कोळी पाहा."], 7),
    ], [["Rust on new leaves", "नव्या पानांवर तांबेरा"]]),
    stage("fruit-growth", ["Fruit growth", "फळांची वाढ"], 60, 120, ["Fruits grow in size along the shoots.", "फांद्यांवर फळे आकाराने वाढतात."], [
      t(`${p}-irr3`, 60, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even water now prevents cracking later.", "आता सारखे पाणी दिल्यास नंतर फळे तडकत नाहीत."], 5),
      t(`${p}-fert2`, 70, "fertiliser", ["Next fertiliser part", "खताचा पुढचा हप्ता"], ["Give the next part as per your plan.", "नियोजनानुसार पुढचा हप्ता द्या."]),
      t(`${p}-obs2`, 62, "observation", ["Check leaves and fruit", "पाने व फळे तपासा"], ["Look for rust, borer and damaged fruit.", "तांबेरा, खोडकिडा व खराब फळे पाहा."], 7),
    ], [["Rust", "तांबेरा"], ["Leaf fall before fruits ripen", "फळे पिकण्यापूर्वी पानगळ"]]),
    stage("harvest", ["Ripening & picking", "पिकणे व तोडणी"], 120, 165, ["Fruits ripen from the base of the shoot upward and are picked daily.", "फांदीच्या बुडापासून वर फळे पिकत जातात व रोज तोडली जातात."], [
      t(`${p}-pick`, 120, "harvest", ["Pick ripe fruit daily", "रोज पिकलेली फळे तोडा"], ["Pick in the early morning; keep fruit in shade.", "पहाटे तोडा; फळे सावलीत ठेवा."], 1),
      t(`${p}-birds`, 121, "observation", ["Protect from birds", "पक्ष्यांपासून संरक्षण करा"], ["Birds eat ripe figs. Use nets or scaring where practical.", "पक्षी पिकलेले अंजीर खातात. शक्य असल्यास जाळी लावा किंवा हुसकावा."]),
      t(`${p}-phi`, 120, "observation", ["Check spray waiting periods", "फवारणीचा प्रतीक्षा कालावधी तपासा"], ["Do not pick before the waiting period on the label of any product you sprayed.", "फवारलेल्या औषधाच्या लेबलवरील प्रतीक्षा कालावधीपूर्वी तोडणी करू नका."]),
    ], [["Cracking and souring after rain", "पावसानंतर फळे तडकणे व आंबणे"], ["Birds", "पक्षी"]]),
  ];
}

export default crop;
