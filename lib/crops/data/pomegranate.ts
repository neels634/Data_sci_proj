import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Reference perennial: establishment years, then one bahar (yearly crop) chosen by the farmer. */
const crop: PerennialCrop = {
  id: "pomegranate",
  emoji: "🍎",
  name: b("Pomegranate", "डाळिंब"),
  aliases: ["pomegranate", "dalimb", "dalimba", "dalim", "anar", "anaar", "डाळिंब", "डाळिंबा", "अनार"],
  category: "fruit",
  lifecycle: "perennial",
  regions: ["western", "north", "marathwada"],
  majorDistricts: b("Solapur, Sangli, Nashik, Ahilyanagar, Pune", "सोलापूर, सांगली, नाशिक, अहिल्यानगर, पुणे"),
  tier: 1,
  plantingWindow: b("June–August (monsoon); February–March where irrigation is assured", "जून–ऑगस्ट (पावसाळा); खात्रीचे पाणी असल्यास फेब्रुवारी–मार्च"),
  plantingMonths: [6, 7, 8, 2, 3],
  plantingMaterial: b("Rooted cuttings or air-layers (gootee) from a registered, disease-free nursery", "नोंदणीकृत, रोगमुक्त रोपवाटिकेतील मुळे फुटलेली कलमे किंवा गुटी कलमे"),
  spacing: b("4.5 m between rows and 3 m between plants (or 5 m × 3 m)", "दोन ओळींत 4.5 मीटर व दोन झाडांत 3 मीटर (किंवा 5 मीटर × 3 मीटर)"),
  plantsPerAcre: [270, 300],
  yearsToFirstHarvest: [2, 3],
  economicLifeYears: [12, 20],
  soil: b(
    "Grows on light, gravelly and medium soils with good drainage. Avoid heavy soils where water stands.",
    "हलकी, मुरमाड व मध्यम, पाण्याचा चांगला निचरा होणारी जमीन चालते. पाणी साचणारी भारी जमीन टाळा.",
  ),
  climate: b(
    "Hot, dry summers and mild winters suit it best. Rain and humidity at fruiting raise disease risk.",
    "कडक, कोरडा उन्हाळा व सौम्य हिवाळा उत्तम. फळधारणेत पाऊस व दमटपणा असल्यास रोगांचा धोका वाढतो.",
  ),
  irrigation: b(
    "Drip irrigation is best. Stop water for the rest period before a bahar, then give regular, even water from flowering to harvest. Uneven watering cracks fruit.",
    "ठिबक सिंचन उत्तम. बहार धरण्यापूर्वी विश्रांतीसाठी पाणी बंद ठेवा, मग फुलोऱ्यापासून काढणीपर्यंत नियमित व सारखे पाणी द्या. अनियमित पाण्याने फळे तडकतात.",
  ),
  nutrientGuide: b(
    "Base it on a soil and leaf test. Give well-rotted farmyard manure at the start of each bahar and split the fertiliser into parts during the bahar. Ask your agriculture officer for amounts.",
    "माती व पान परीक्षणावर आधारित खत द्या. प्रत्येक बहाराच्या सुरुवातीला चांगले कुजलेले शेणखत द्या आणि बहारात खत विभागून द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Bhagwa", note: b("Most widely grown; deep red arils, good for export (MPKV)", "सर्वाधिक लागवड; गडद लाल दाणे, निर्यातीसाठी चांगला (मफुकृवि)") },
    { name: "Ganesh", note: b("Older popular variety with soft seeds (MPKV)", "मऊ बियांचा जुना लोकप्रिय वाण (मफुकृवि)") },
    { name: "Phule Arakta", note: b("Released by MPKV Rahuri", "मफुकृवि राहुरीचा वाण") },
    { name: "Solapur Lal", note: b("Released by ICAR-NRC Pomegranate, Solapur", "ICAR-राष्ट्रीय डाळिंब संशोधन केंद्र, सोलापूरचा वाण") },
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Young plants are set in pits and take root.", "लहान रोपे खड्ड्यांत लावली जातात व मूळ धरतात."], [
      t("pm-pit", 0, "other", ["Plant in prepared pits", "तयार खड्ड्यांत लागवड करा"], ["Fill pits with topsoil and well-rotted manure, plant, and give support to the stem.", "खड्डे वरची माती व कुजलेल्या शेणखताने भरा, रोप लावा व खोडाला आधार द्या."]),
      t("pm-irr0", 1, "irrigation", ["Water the young plants", "लहान रोपांना पाणी द्या"], ["Keep the soil around new plants moist, not wet.", "नवीन रोपांभोवती माती ओलसर ठेवा, चिखल नको."], 4),
      t("pm-gap0", 25, "other", ["Replace dead plants", "मेलेली रोपे बदला"], ["Replant gaps early so the orchard grows evenly.", "बाग एकसारखी वाढावी म्हणून खाडे लवकर भरा."]),
    ], [["Plants drying in hot wind", "उष्ण वाऱ्याने रोपे सुकणे"], ["Termites at the roots", "मुळांना वाळवी"]]),
    stage("training", ["Training the young plant", "रोपाला आकार देणे"], 30, 365, ["The plant is shaped to 3–4 strong main stems.", "झाडाला 3–4 मजबूत मुख्य फांद्यांचा आकार दिला जातो."], [
      t("pm-train", 60, "other", ["Shape the plant", "झाडाला आकार द्या"], ["Keep 3–4 healthy stems; remove suckers from the base regularly.", "3–4 निरोगी फांद्या ठेवा; बुंध्यातील फुटवे नियमित काढा."], 60),
      t("pm-irr1", 30, "irrigation", ["Irrigate young plants", "लहान झाडांना पाणी द्या"], ["Give light, regular water; more in summer.", "हलके व नियमित पाणी द्या; उन्हाळ्यात जास्त."], 7),
      t("pm-weed1", 45, "weeding", ["Keep basins weed-free", "आळी तणमुक्त ठेवा"], ["Weed around plants; mulch with crop residue to keep moisture.", "झाडांभोवती खुरपणी करा; ओलावा टिकवण्यासाठी आच्छादन करा."], 45),
      t("pm-obs1", 40, "observation", ["Check leaves and stems", "पाने व खोड तपासा"], ["Look for oily spots on leaves and for stem borer holes.", "पानांवर तेलकट डाग व खोडावर छिद्रे आहेत का पाहा."], 30),
    ], [["Bacterial blight (oily spots)", "तेल्या (तेलकट डाग)"], ["Stem borer", "खोडकिडा"]]),
    stage("canopy", ["Building the canopy", "झाडाचा विस्तार"], 365, 730, ["The plant grows its frame. Do not take a full crop yet; remove early flowers.", "झाडाचा सांगाडा तयार होतो. अजून पूर्ण बहार घेऊ नका; लवकरची फुले काढा."], [
      t("pm-flowerrm", 400, "other", ["Remove early flowers", "लवकरची फुले काढा"], ["Pick off flowers so the plant puts energy into growth.", "झाड वाढीकडे जोर देईल म्हणून फुले खुडून टाका."], 60),
      t("pm-irr2", 365, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular drip irrigation; adjust for season.", "हंगामानुसार नियमित ठिबक पाणी."], 7),
      t("pm-obs2", 370, "observation", ["Check for oily spot disease", "तेल्या रोग तपासा"], ["Remove and burn infected twigs; keep tools clean.", "रोगट फांद्या काढून जाळा; अवजारे स्वच्छ ठेवा."], 30),
    ], [["Bacterial blight (oily spots)", "तेल्या (तेलकट डाग)"], ["Wilt", "मर रोग"]]),
    stage("first-bahar", ["Preparing for the first crop", "पहिल्या बहाराची तयारी"], 730, 1095, ["The orchard is ready to take its first bahar.", "बाग पहिला बहार घेण्यास तयार होते."], [
      t("pm-plan", 730, "observation", ["Choose your first bahar", "पहिला बहार निवडा"], ["Pick ambia, mrig or hasta bahar based on water and rain in your area. Mrig and hasta avoid the hottest months.", "पाणी व पावसानुसार आंबिया, मृग किंवा हस्त बहार निवडा. मृग व हस्त बहारात कडक उन्हाळा टळतो."]),
      t("pm-irr3", 731, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep the orchard healthy until the rest period starts.", "विश्रांती सुरू होईपर्यंत बाग निरोगी ठेवा."], 7),
      t("pm-obs3", 735, "observation", ["Check the orchard", "बाग तपासा"], ["Look for oily spots and wilting plants.", "तेलकट डाग व मलूल झाडे पाहा."], 30),
    ], [["Bacterial blight", "तेल्या"]]),
  ],
  cycles: [
    {
      key: "ambia",
      name: b("Ambia bahar", "आंबिया बहार"),
      startMonths: [1, 2],
      startEvent: b("Rest without water, light pruning, then first irrigation in January–February", "पाणी बंद ठेवून विश्रांती, हलकी छाटणी, मग जानेवारी–फेब्रुवारीत पहिले पाणी"),
      harvestMonths: [6, 7, 8],
      note: b("Needs assured summer water; fruits grow in the hottest months.", "उन्हाळ्यात खात्रीचे पाणी लागते; फळे कडक उन्हाळ्यात वाढतात."),
      stages: bahar("am"),
    },
    {
      key: "mrig",
      name: b("Mrig bahar", "मृग बहार"),
      startMonths: [5, 6],
      startEvent: b("Rest in April–May, then first irrigation or rain in June", "एप्रिल–मे मध्ये विश्रांती, मग जूनमध्ये पहिले पाणी किंवा पाऊस"),
      harvestMonths: [11, 12, 1],
      note: b("Common where summer water is short; monsoon humidity needs close watch for oily spot.", "उन्हाळ्यात पाणी कमी असेल तेथे सामान्य; पावसाळ्यातील दमटपणात तेल्या रोगावर बारीक लक्ष हवे."),
      stages: bahar("mr"),
    },
    {
      key: "hasta",
      name: b("Hasta bahar", "हस्त बहार"),
      startMonths: [9, 10],
      startEvent: b("Rest in August–September, then first irrigation in September–October", "ऑगस्ट–सप्टेंबरमध्ये विश्रांती, मग सप्टेंबर–ऑक्टोबरमध्ये पहिले पाणी"),
      harvestMonths: [2, 3, 4],
      note: b("Fruits grow in the dry winter; less disease, good quality.", "फळे कोरड्या हिवाळ्यात वाढतात; रोग कमी, दर्जा चांगला."),
      stages: bahar("hs"),
    },
  ],
  commonProblems: [
    {
      name: b("Bacterial blight (oily spot, telya)", "तेल्या (बॅक्टेरियल ब्लाइट)"),
      signs: b("Dark, oily-looking spots on leaves, stems and fruit; fruits crack along the spots.", "पाने, फांद्या व फळांवर काळपट तेलकट डाग; डागांवर फळे तडकतात."),
      prevention: prevent("Use disease-free planting material, remove and burn infected parts, disinfect pruning tools, and avoid a bahar during heavy rain.", "रोगमुक्त कलमे वापरा, रोगट भाग काढून जाळा, छाटणीची अवजारे निर्जंतुक करा आणि जोरदार पावसात बहार घेणे टाळा."),
    },
    {
      name: b("Fruit borer (anar butterfly)", "फळ पोखरणारी अळी (डाळिंब फुलपाखरू)"),
      signs: b("Holes in fruit with rotting inside; frass at the hole.", "फळांना छिद्रे व आत सडणे; छिद्राजवळ विष्ठा."),
      prevention: prevent("Collect and destroy affected fruit; bag fruits with paper or cloth bags where practical.", "बाधित फळे गोळा करून नष्ट करा; शक्य असल्यास फळांना कागदी किंवा कापडी पिशव्या घाला."),
    },
    {
      name: b("Wilt", "मर रोग"),
      signs: b("Leaves turn yellow and the plant dries branch by branch.", "पाने पिवळी पडून झाड फांदी-फांदीने वाळते."),
      prevention: prevent("Avoid waterlogging, do not injure roots while digging, and remove dead plants with their roots.", "पाणी साचू देऊ नका, खोदताना मुळांना इजा करू नका आणि मेलेली झाडे मुळांसकट काढा."),
    },
    {
      name: b("Fruit cracking", "फळे तडकणे"),
      signs: b("Fruits split open, often after irregular watering or sudden rain.", "अनियमित पाणी किंवा अचानक पावसानंतर फळे फुटतात."),
      prevention: b("Give even water through drip and mulch the basins to keep moisture steady.", "ठिबकने सारखे पाणी द्या आणि ओलावा टिकवण्यासाठी आळ्यांत आच्छादन करा."),
    },
  ],
  harvestSigns: b(
    "Fruit skin turns its variety colour and shiny, the fruit feels heavy, and tapping gives a metallic sound. Pick about 5–6 months after flowering.",
    "फळाची साल वाणाच्या रंगाची व चमकदार होते, फळ जड लागते आणि ठोकल्यावर धातूसारखा आवाज येतो. फुलोऱ्यानंतर साधारण 5–6 महिन्यांनी तोडणी करा.",
  ),
  postHarvest: b(
    "Pick with secateurs, keep fruits in shade, sort out cracked and spotted fruit, grade by size and pack in ventilated boxes.",
    "सिकेटरने फळे तोडा, सावलीत ठेवा, तडकलेली व डाग असलेली फळे वेगळी करा, आकारानुसार प्रतवारी करा व हवेशीर खोक्यांत भरा.",
  ),
  marketTips: b(
    "Large, unblemished, deep-coloured fruit fetches the best price and can go to export. Register your orchard if you plan to export, and keep spray records.",
    "मोठ्या, डागरहित, गडद रंगाच्या फळांना सर्वाधिक दर मिळतो व ती निर्यात होऊ शकतात. निर्यात करायची असल्यास बागेची नोंदणी करा आणि फवारणीच्या नोंदी ठेवा.",
  ),
  source: "General practices from MPKV Rahuri and ICAR-National Research Centre on Pomegranate, Solapur",
  lastVerified: null,
  reviewStatus: "draft",
};

/** The yearly bahar: same stages for ambia, mrig and hasta; task ids get a per-bahar prefix. */
function bahar(p: string) {
  return [
    stage("rest", ["Rest period", "विश्रांती"], 0, 30, ["Water is stopped so the tree rests and gets ready to flower.", "झाडाला विश्रांती मिळावी व फुलोऱ्यासाठी तयार व्हावे म्हणून पाणी बंद केले जाते."], [
      t(`${p}-rest`, 0, "other", ["Stop irrigation for the rest period", "विश्रांतीसाठी पाणी बंद करा"], ["Stop water so leaves slow down. On light soils keep the rest shorter.", "पाने मंदावण्यासाठी पाणी बंद करा. हलक्या जमिनीत विश्रांती कमी ठेवा."]),
      t(`${p}-prune`, 20, "other", ["Light pruning and cleaning", "हलकी छाटणी व स्वच्छता"], ["Cut dry, diseased and crossing branches; burn the cuttings; disinfect tools.", "वाळलेल्या, रोगट व एकमेकांत घुसणाऱ्या फांद्या छाटा; छाटलेले जाळा; अवजारे निर्जंतुक करा."]),
    ], [["Oily spots on old branches — remove them now", "जुन्या फांद्यांवर तेलकट डाग — आत्ताच काढा"]]),
    stage("bahar-start", ["Bahar start", "बहार धरणे"], 30, 45, ["Manure and first irrigation wake the tree; new shoots and buds come.", "शेणखत व पहिल्या पाण्याने झाड जागे होते; नवी फूट व कळ्या येतात."], [
      t(`${p}-fym`, 30, "fertiliser", ["Give manure and start feeding", "शेणखत द्या व खत सुरू करा"], ["Apply well-rotted farmyard manure in the basin; plan fertiliser as per soil and leaf test.", "आळ्यात कुजलेले शेणखत द्या; माती व पान परीक्षणानुसार खताचे नियोजन करा."]),
      t(`${p}-irr1`, 31, "irrigation", ["First irrigation after rest", "विश्रांतीनंतरचे पहिले पाणी"], ["Give a good first irrigation, then light regular water.", "पहिले भरपूर पाणी द्या, मग हलके नियमित पाणी."], 5),
    ], [["Sucking pests on new shoots", "नव्या फुटीवर रसशोषक किडी"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 45, 90, ["Flowers open; the bell-shaped ones set fruit.", "फुले उमलतात; घंटेच्या आकाराच्या फुलांना फळे लागतात."], [
      t(`${p}-irr2`, 45, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Steady moisture helps fruit set.", "सारख्या ओलाव्याने फळधारणा चांगली होते."], 4),
      t(`${p}-obs1`, 47, "observation", ["Check flowers and leaves", "फुले व पाने तपासा"], ["Look for thrips, aphids and the first oily spots.", "फुलकिडे, मावा व तेल्याचे पहिले डाग पाहा."], 7),
      t(`${p}-bees`, 50, "observation", ["Keep bees safe", "मधमाश्यांचे संरक्षण करा"], ["Bees help fruit set. Avoid spraying when flowers are open in the morning.", "मधमाश्या फळधारणेस मदत करतात. सकाळी फुले उमललेली असताना फवारणी टाळा."]),
    ], [["Thrips scarring young fruit", "फुलकिड्यांमुळे कोवळ्या फळांवर व्रण"]]),
    stage("fruit-growth", ["Fruit growth", "फळांची वाढ"], 90, 210, ["Fruits grow in size and arils fill and colour.", "फळे मोठी होतात व दाणे भरून रंग धरतात."], [
      t(`${p}-irr3`, 90, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even water prevents cracking.", "सारख्या पाण्याने फळे तडकत नाहीत."], 4),
      t(`${p}-obs2`, 92, "observation", ["Check fruit", "फळे तपासा"], ["Look for borer holes, oily spots and cracks; remove affected fruit.", "छिद्रे, तेलकट डाग व तडे पाहा; बाधित फळे काढा."], 7),
      t(`${p}-thin`, 100, "other", ["Thin the fruit", "फळांची विरळणी करा"], ["Keep a fruit load the tree can carry so fruits reach good size.", "झाड पेलू शकेल एवढीच फळे ठेवा, म्हणजे फळांना चांगला आकार येतो."]),
      t(`${p}-fert2`, 120, "fertiliser", ["Review nutrition", "खत नियोजनाचा आढावा"], ["Give the next fertiliser part as per your plan; ask your agriculture officer if unsure.", "नियोजनानुसार पुढचा खत हप्ता द्या; खात्री नसल्यास कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Fruit borer", "फळ पोखरणारी अळी"], ["Fruit cracking", "फळे तडकणे"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 210, 240, ["Fruits reach full colour and are picked in rounds.", "फळे पूर्ण रंग धरतात व फेऱ्यांमध्ये तोडली जातात."], [
      t(`${p}-mat`, 210, "observation", ["Check maturity", "पक्वता तपासा"], ["Colour, shine and a metallic sound on tapping show readiness.", "रंग, चमक व ठोकल्यावर धातूसारखा आवाज म्हणजे फळ तयार."]),
      t(`${p}-pick`, 212, "harvest", ["Pick ripe fruit", "पिकलेली फळे तोडा"], ["Pick in cool hours with secateurs; keep fruit in shade.", "थंड वेळेत सिकेटरने तोडा; फळे सावलीत ठेवा."], 7),
      t(`${p}-phi`, 211, "observation", ["Check spray waiting periods", "फवारणीचा प्रतीक्षा कालावधी तपासा"], ["Do not pick before the waiting period on the label of any product you sprayed.", "फवारलेल्या औषधाच्या लेबलवरील प्रतीक्षा कालावधीपूर्वी तोडणी करू नका."]),
    ], [["Birds and fruit flies on ripe fruit", "पिकलेल्या फळांवर पक्षी व फळमाशी"]]),
  ];
}

export default crop;
