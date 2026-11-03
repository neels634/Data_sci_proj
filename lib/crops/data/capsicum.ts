import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "capsicum",
  emoji: "🫑",
  name: b("Capsicum (bell pepper)", "ढोबळी मिरची"),
  aliases: ["capsicum", "ढोबळी मिरची", "dhobli mirchi", "dhobali mirchi", "bell pepper", "shimla mirch", "simla mirchi", "शिमला मिर्च", "sweet pepper"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["western", "north"],
  majorDistricts: b("Pune, Satara, Nashik", "पुणे, सातारा, नाशिक"),
  tier: 2,
  protectedCultivation: true,
  seasons: [
    { season: "kharif", label: b("Open field, kharif", "उघड्या शेतात, खरीप"), sowingWindow: b("Nursery in May–June", "रोपवाटिका मे–जून"), sowingMonths: [5, 6], durationDays: [120, 150] },
    { season: "rabi", label: b("Open field, rabi", "उघड्या शेतात, रब्बी"), sowingWindow: b("Nursery in August–September", "रोपवाटिका ऑगस्ट–सप्टेंबर"), sowingMonths: [8, 9], durationDays: [120, 150] },
    { season: "kharif", label: b("Polyhouse / shade net (long crop)", "पॉलीहाऊस / शेडनेट (लांब कालावधी)"), sowingWindow: b("Nursery in July–August; plants bear for 6–8 months under cover", "रोपवाटिका जुलै–ऑगस्ट; आच्छादनाखाली 6–8 महिने फळे मिळतात"), sowingMonths: [7, 8], durationDays: [240, 300] },
  ],
  method: "transplant",
  plantingMaterial: b("Seed (mostly hybrids), raised as seedlings in trays", "बियाणे (बहुतेक संकरित); ट्रेमध्ये रोपे तयार करून"),
  nurseryDays: 35,
  soil: b("Well-drained loamy soil rich in organic matter. In polyhouses, raised beds with good drainage.", "सेंद्रिय पदार्थ भरपूर असलेली, पाण्याचा निचरा होणारी पोयट्याची जमीन. पॉलीहाऊसमध्ये चांगला निचरा असलेले गादीवाफे."),
  climate: b("Mild weather. Hot sun and dry wind drop flowers and scald fruit; that is why many farmers grow it in polyhouses or shade nets.", "सौम्य हवामान. कडक ऊन व कोरड्या वाऱ्याने फुले गळतात व फळे भाजतात; म्हणून अनेक शेतकरी पॉलीहाऊस किंवा शेडनेटमध्ये घेतात."),
  seedRate: b("About 80–100 g seed per acre for open field (hybrid seed is sown one per tray cell).", "उघड्या शेतासाठी एकरी साधारण 80–100 ग्रॅम बियाणे (संकरित बी ट्रेच्या प्रत्येक कप्प्यात एक)."),
  spacing: b("Open field: 60 cm between rows, 45 cm between plants. Polyhouse: paired rows on raised beds, about 30–45 cm between plants.", "उघडे शेत: ओळींत 60 सेंमी, रोपांत 45 सेंमी. पॉलीहाऊस: गादीवाफ्यावर जोड ओळी, रोपांत साधारण 30–45 सेंमी."),
  irrigation: b(
    "Open field: light water every 5–7 days, never waterlogged; drip with mulch is best. Polyhouse: drip irrigation in small amounts daily or on alternate days, with nutrients given through the drip as advised by your agriculture officer.",
    "उघडे शेत: दर 5–7 दिवसांनी हलके पाणी, पाणी साचू देऊ नका; आच्छादनासह ठिबक उत्तम. पॉलीहाऊस: ठिबकने रोज किंवा एक दिवसाआड थोडे पाणी, कृषी अधिकाऱ्यांच्या सल्ल्याने ठिबकमधून खते.",
  ),
  nutrientGuide: b(
    "Use a soil test. Mix plenty of well-rotted farmyard manure before planting. Give nutrients in small parts throughout the crop — in polyhouses through the drip. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. लागवडीपूर्वी भरपूर कुजलेले शेणखत मिसळा. पिकाच्या संपूर्ण काळात खते थोडी-थोडी द्या — पॉलीहाऊसमध्ये ठिबकमधून. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("nursery", ["Nursery", "रोपवाटिका"], 0, 35, ["Seedlings grow in trays, best under a net.", "ट्रेमध्ये रोपे वाढतात, शक्यतो जाळीखाली."], [
      t("cp-tray", 0, "sowing", ["Sow in trays", "ट्रेमध्ये पेरा"], ["Sow one seed per cell in trays filled with clean growing mix.", "स्वच्छ माध्यम भरलेल्या ट्रेच्या प्रत्येक कप्प्यात एक बी पेरा."]),
      t("cp-nwater", 1, "irrigation", ["Water lightly", "हलके पाणी"], ["Keep moist, not soggy.", "ओलसर ठेवा, चिखल नको."], 2),
      t("cp-harden", 28, "observation", ["Harden seedlings", "रोपे कणखर करा"], ["Reduce water for a week before transplanting.", "पुनर्लागवडीपूर्वी आठवडाभर पाणी कमी करा."]),
    ], [["Damping off", "रोपे कोलमडणे"], ["Thrips and whitefly on seedlings", "रोपांवर फुलकिडे व पांढरी माशी"]]),
    stage("establishment", ["Transplanting & establishment", "पुनर्लागवड व स्थिरावणे"], 35, 50, ["Seedlings are planted on beds and take root.", "रोपे गादीवाफ्यावर लावली जातात व मूळ धरतात."], [
      t("cp-tp", 35, "transplanting", ["Transplant", "पुनर्लागवड करा"], ["Plant on raised beds with drip and mulch, in the evening, and water right after.", "ठिबक व आच्छादन असलेल्या गादीवाफ्यावर संध्याकाळी लावा व लगेच पाणी द्या."]),
      t("cp-irr1", 36, "irrigation", ["Light irrigation", "हलके पाणी"], ["Keep the root zone moist until plants settle.", "रोपे स्थिरावेपर्यंत मुळांजवळ ओलावा ठेवा."], 3),
    ], [["Seedlings wilting at the base", "रोपे बुंध्याजवळ मलूल होणे"]]),
    stage("vegetative", ["Growth & training", "वाढ व वळण"], 50, 80, ["Plants branch. Polyhouse plants are trained on strings to 2–4 main stems.", "झाडांना फांद्या फुटतात. पॉलीहाऊसमध्ये झाडांना दोरीवर 2–4 मुख्य फांद्यांवर वळण देतात."], [
      t("cp-irr2", 50, "irrigation", ["Irrigate", "पाणी द्या"], ["Drip regularly; avoid wetting leaves.", "ठिबकने नियमित पाणी द्या; पाने ओली करू नका."], 4),
      t("cp-train", 55, "other", ["Support and pruning", "आधार व छाटणी"], ["Polyhouse: tie stems to strings and remove extra side shoots. Open field: give stake support.", "पॉलीहाऊस: फांद्या दोरीला बांधा व जास्तीच्या फुटी काढा. उघडे शेत: काठीचा आधार द्या."], 10),
      t("cp-obs1", 56, "observation", ["Check leaves", "पाने तपासा"], ["Look for curled leaves, thrips, mites and whitefly.", "आकसलेली पाने, फुलकिडे, कोळी व पांढरी माशी पाहा."], 7),
    ], [["Thrips and mites: curled leaves", "फुलकिडे व कोळी: आकसलेली पाने"]]),
    stage("flowering", ["Flowering & fruit set", "फुलोरा व फळधारणा"], 80, 100, ["Flowers open and fruits set.", "फुले उमलतात व फळे धरतात."], [
      t("cp-irr3", 80, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Uneven water now drops flowers and causes black patches at the fruit bottom.", "आता अनियमित पाण्याने फुलगळ होते व फळाच्या तळाशी काळे डाग येतात."], 4),
      t("cp-obs2", 82, "observation", ["Check flowers and young fruit", "फुले व कोवळी फळे तपासा"], ["Look for flower drop, rot and holes.", "फुलगळ, कूज व छिद्रे पाहा."], 7),
    ], [["Flower drop in heat", "उष्णतेत फुलगळ"]]),
    stage("harvest", ["Harvest (pickings)", "तोडणी"], 100, 300, ["Fruits are picked every 5–7 days — for about 1–2 months in open field and 5–6 months in a polyhouse.", "दर 5–7 दिवसांनी तोडणी — उघड्या शेतात साधारण 1–2 महिने, पॉलीहाऊसमध्ये 5–6 महिने."], [
      t("cp-pick", 100, "harvest", ["Pick fruits", "फळे तोडा"], ["Cut firm, full-sized, glossy fruits with a short stalk using a knife or scissors.", "टणक, पूर्ण आकाराची, चकचकीत फळे लहान देठासह चाकू किंवा कात्रीने कापा."], 6),
      t("cp-irr4", 101, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep regular drip watering and feeding between pickings.", "तोडण्यांच्या मध्ये नियमित ठिबक पाणी व खते देत राहा."], 4),
      t("cp-obs3", 105, "observation", ["Check for pests and rot", "कीड व कूज तपासा"], ["Remove rotten or sun-scalded fruit and diseased leaves.", "कुजलेली किंवा उन्हाने भाजलेली फळे व रोगट पाने काढा."], 7),
    ], [["Check pre-harvest waiting days on any product label before picking", "तोडणीपूर्वी वापरलेल्या औषधाच्या लेबलवरील काढणीपूर्व कालावधी तपासा"]]),
  ],
  flushes: {
    everyDays: 6,
    count: 10,
    note: b("Pick every 5–7 days: about 6–10 pickings in open field, many more in a polyhouse.", "दर 5–7 दिवसांनी तोडणी: उघड्या शेतात साधारण 6–10 तोडण्या, पॉलीहाऊसमध्ये त्याहून बऱ्याच जास्त."),
  },
  commonProblems: [
    { name: b("Thrips and mites", "फुलकिडे व कोळी"), signs: b("Leaves curl up or down and turn leathery; fruits get scars.", "पाने वर किंवा खाली वळतात व जाड होतात; फळांवर ओरखडे."), prevention: prevent("Use net-raised seedlings, blue and yellow sticky traps, and remove badly affected leaves.", "जाळीखाली तयार केलेली रोपे, निळे व पिवळे चिकट सापळे वापरा आणि जास्त बाधित पाने काढा.") },
    { name: b("Powdery mildew", "भुरी"), signs: b("Yellow patches on top of leaves with white powder underneath; leaves drop.", "पानांच्या वरच्या बाजूला पिवळे चट्टे व खाली पांढरी भुकटी; पाने गळतात."), prevention: prevent("Keep air moving in the polyhouse and avoid crowding plants.", "पॉलीहाऊसमध्ये हवा खेळती ठेवा आणि झाडांची गर्दी टाळा.") },
    { name: b("Fruit rot and blossom-end rot", "फळकूज व फळाच्या तळाशी काळे डाग"), signs: b("Sunken dark patches on fruit; black leathery bottom end.", "फळांवर खोलगट काळे चट्टे; फळाचा तळ काळा व चामड्यासारखा."), prevention: prevent("Water evenly, avoid wetting fruit and give balanced nutrition as per soil test.", "सारखे पाणी द्या, फळे ओली करू नका आणि माती परीक्षणानुसार संतुलित खत द्या.") },
  ],
  harvestSigns: b("Green fruits are full-sized, firm and glossy. For red or yellow fruit, pick when most of the fruit has coloured.", "हिरवी फळे पूर्ण आकाराची, टणक व चकचकीत. लाल किंवा पिवळ्या फळांसाठी बहुतेक फळ रंगल्यावर तोडा."),
  postHarvest: b("Pick in cool hours, keep in shade, grade by size and colour, and pack in crates or cartons. Coloured fruit for cities is often wrapped or packed in boxes.", "थंड वेळेत तोडा, सावलीत ठेवा, आकार व रंगानुसार प्रतवारी करा आणि क्रेट किंवा खोक्यांत भरा. शहरांसाठी रंगीत फळे बहुतेक वेळा गुंडाळून किंवा बॉक्समध्ये पाठवतात."),
  marketTips: b("Polyhouse red and yellow capsicum sells mainly in city markets and to hotels; plan buyers before planting. Even-sized, glossy, unmarked fruit gets the best rate.", "पॉलीहाऊसमधील लाल व पिवळी ढोबळी मिरची मुख्यतः शहरी बाजार व हॉटेलना विकली जाते; लागवडीपूर्वी खरेदीदार ठरवा. एकसारख्या, चकचकीत, डाग नसलेल्या फळांना सर्वात चांगला दर मिळतो."),
  varieties: [
    { name: "California Wonder", note: b("Old open-pollinated green variety for open field", "उघड्या शेतासाठी जुना सरळ (मुक्त परागीभवन) हिरवा वाण") },
    { name: "Arka Mohini", note: b("Open-pollinated variety (ICAR-IIHR)", "सरळ वाण (ICAR-IIHR)") },
  ], // TODO: varieties — confirm polyhouse hybrids commonly recommended by MPKV / ICAR-IIHR
  source: "General practices from MPKV Rahuri and ICAR-IIHR capsicum and protected cultivation guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
