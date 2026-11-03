import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "brinjal",
  emoji: "🍆",
  name: b("Brinjal", "वांगी"),
  aliases: ["brinjal", "eggplant", "aubergine", "vangi", "wangi", "vange", "वांगी", "वांगे", "वांग", "baingan", "baigan", "बैंगन"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada", "vidarbha"],
  majorDistricts: b("Pune, Satara, Jalgaon, Nashik", "पुणे, सातारा, जळगाव, नाशिक"),
  tier: 1,
  seasons: [
    { season: "kharif", sowingWindow: b("Nursery in May–June; transplant with the rains", "रोपवाटिका मे–जून; पावसाबरोबर पुनर्लागवड"), sowingMonths: [5, 6], durationDays: [150, 180] },
    { season: "rabi", sowingWindow: b("Nursery in September–October", "रोपवाटिका सप्टेंबर–ऑक्टोबर"), sowingMonths: [9, 10], durationDays: [150, 180] },
    { season: "summer", sowingWindow: b("Nursery in December–January; needs assured irrigation", "रोपवाटिका डिसेंबर–जानेवारी; खात्रीचे पाणी लागते"), sowingMonths: [12, 1], durationDays: [140, 160] },
  ],
  method: "transplant",
  plantingMaterial: b("Seed, raised as seedlings in a nursery", "बियाणे; रोपवाटिकेत रोपे तयार करून"),
  nurseryDays: 30,
  soil: b("Well-drained loamy or medium black soil with good organic matter.", "सेंद्रिय पदार्थ असलेली, पाण्याचा निचरा होणारी पोयट्याची किंवा मध्यम काळी जमीन."),
  climate: b("Warm weather. Grows most of the year in Maharashtra; heavy cold slows growth.", "उबदार हवामान. महाराष्ट्रात वर्षभर बहुतेक वेळा घेता येते; कडक थंडीत वाढ मंदावते."),
  seedRate: b("About 120–160 g seed per acre for the nursery (hybrids need less).", "रोपवाटिकेसाठी एकरी साधारण 120–160 ग्रॅम बियाणे (संकरित वाणाला कमी)."),
  spacing: b("75–90 cm between rows, 60–75 cm between plants (wider for spreading hybrids).", "ओळींत 75–90 सेंमी, रोपांत 60–75 सेंमी (पसरणाऱ्या संकरित वाणाला जास्त)."),
  irrigation: b(
    "Water right after transplanting, then every 7–8 days in winter and 4–5 days in summer. In kharif, give water only in dry spells and drain extra rainwater. Drip saves water and keeps leaves dry.",
    "पुनर्लागवडीनंतर लगेच पाणी, नंतर हिवाळ्यात दर 7–8 दिवसांनी व उन्हाळ्यात दर 4–5 दिवसांनी. खरिपात फक्त पावसाच्या खंडात पाणी द्या व जास्तीचे पाणी काढून टाका. ठिबकने पाणी वाचते व पाने कोरडी राहतात.",
  ),
  nutrientGuide: b(
    "Use a soil test. Mix well-rotted farmyard manure before planting. Give nitrogen in 3–4 parts, including after the first few pickings, because the crop bears for months. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. लागवडीपूर्वी कुजलेले शेणखत मिसळा. पीक महिनोन्महिने फळे देते, म्हणून नत्र 3–4 हप्त्यांत, पहिल्या काही तोडण्यांनंतरही द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("nursery", ["Nursery", "रोपवाटिका"], 0, 30, ["Seedlings grow in raised beds or trays.", "गादीवाफ्यावर किंवा ट्रेमध्ये रोपे वाढतात."], [
      t("bj-bed", 0, "sowing", ["Sow the nursery", "रोपवाटिका पेरा"], ["Sow thinly in lines on raised beds with compost, or in trays.", "कंपोस्ट मिसळलेल्या गादीवाफ्यावर ओळीत विरळ किंवा ट्रेमध्ये पेरा."]),
      t("bj-nwater", 1, "irrigation", ["Water the nursery lightly", "रोपवाटिकेला हलके पाणी"], ["Keep moist, not soggy.", "ओलसर ठेवा, चिखल नको."], 3),
      t("bj-harden", 24, "observation", ["Harden the seedlings", "रोपे कणखर करा"], ["Reduce water for a few days before transplanting.", "पुनर्लागवडीपूर्वी काही दिवस पाणी कमी करा."]),
    ], [["Damping off", "रोपे कोलमडणे"]]),
    stage("establishment", ["Transplanting & establishment", "पुनर्लागवड व स्थिरावणे"], 30, 45, ["Seedlings are planted out and take root.", "रोपे शेतात लावली जातात व मूळ धरतात."], [
      t("bj-tp", 30, "transplanting", ["Transplant", "पुनर्लागवड करा"], ["Plant 4–5 week old seedlings in the evening and water right after.", "4–5 आठवड्यांची रोपे संध्याकाळी लावा व लगेच पाणी द्या."]),
      t("bj-irr1", 31, "irrigation", ["Light irrigation", "हलके पाणी"], ["Keep the root zone moist until plants settle.", "रोपे स्थिरावेपर्यंत मुळांजवळ ओलावा ठेवा."], 5),
      t("bj-gap", 38, "other", ["Fill the gaps", "खाडे भरा"], ["Replace dead seedlings.", "मेलेली रोपे बदला."]),
    ], [["Cutworms cutting seedlings", "रोपे कापणाऱ्या अळ्या"]]),
    stage("vegetative", ["Plant growth", "रोपांची वाढ"], 45, 70, ["Plants branch and grow leaves.", "रोपांना फांद्या फुटतात व पाने वाढतात."], [
      t("bj-irr2", 45, "irrigation", ["Irrigate", "पाणी द्या"], ["Water at the base as needed.", "गरजेनुसार मुळांजवळ पाणी द्या."], 7),
      t("bj-weed", 48, "weeding", ["Weeding and earthing up", "खुरपणी व भर"], ["Remove weeds and pull soil to the base of plants.", "तण काढा व रोपांच्या बुंध्याला माती लावा."]),
      t("bj-obs1", 50, "observation", ["Check shoots and leaves", "शेंडे व पाने तपासा"], ["Look for wilted shoot tips (borer) and tiny insects under leaves.", "सुकलेले शेंडे (पोखरणारी अळी) व पानांखाली बारीक कीटक पाहा."], 7),
      t("bj-fert", 55, "fertiliser", ["Top dressing", "वरखत"], ["Give the next nitrogen part as per soil test.", "माती परीक्षणानुसार नत्राचा पुढचा हप्ता द्या."]),
    ], [["Shoot and fruit borer: wilted tips", "शेंडा व फळ पोखरणारी अळी: सुकलेले शेंडे"], ["Jassids and whitefly", "तुडतुडे व पांढरी माशी"]]),
    stage("flowering", ["Flowering & fruit set", "फुलोरा व फळधारणा"], 70, 90, ["Flowers open and first fruits set.", "फुले उमलतात व पहिली फळे धरतात."], [
      t("bj-irr3", 70, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Water stress now drops flowers.", "आता पाण्याचा ताण आल्यास फुले गळतात."], 6),
      t("bj-trap", 70, "observation", ["Set pheromone traps", "कामगंध सापळे लावा"], ["Traps for shoot and fruit borer show when moths arrive. Ask your KVK which trap to use.", "शेंडा व फळ पोखरणाऱ्या अळीचे सापळे पतंग कधी आले ते दाखवतात. कोणता सापळा ते कृषी विज्ञान केंद्राला विचारा."]),
      t("bj-cut", 72, "observation", ["Cut wilted shoots", "सुकलेले शेंडे कापा"], ["Cut and destroy wilted tips with the caterpillar inside.", "आत अळी असलेले सुकलेले शेंडे कापून नष्ट करा."], 7),
    ], [["Little leaf: tiny leaves, no fruit", "पर्णगुच्छ (लहान पाने): बारीक पाने, फळे नाहीत"]]),
    stage("harvest", ["Harvest (pickings)", "तोडणी"], 90, 180, ["Fruits are picked every few days for months.", "महिनोन्महिने दर काही दिवसांनी फळांची तोडणी होते."], [
      t("bj-pick", 90, "harvest", ["Pick fruits", "फळे तोडा"], ["Pick tender, shiny fruits before seeds harden.", "बिया कडक होण्यापूर्वी कोवळी, चकचकीत फळे तोडा."], 5),
      t("bj-irr4", 91, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep watering between pickings.", "तोडण्यांच्या मध्ये पाणी देत राहा."], 7),
      t("bj-bored", 93, "observation", ["Remove bored fruits", "पोखरलेली फळे काढा"], ["Pick and destroy fruits with holes; do not leave them in the field.", "छिद्र असलेली फळे तोडून नष्ट करा; शेतात टाकू नका."], 7),
      t("bj-fert2", 110, "fertiliser", ["Top dressing after pickings", "तोडण्यांनंतर वरखत"], ["Give a nutrient part as per soil test to keep the plants bearing.", "झाडे फळे देत राहावीत म्हणून माती परीक्षणानुसार खताचा हप्ता द्या."]),
    ], [["Check pre-harvest waiting days on any product label before picking", "तोडणीपूर्वी वापरलेल्या औषधाच्या लेबलवरील काढणीपूर्व कालावधी तपासा"]]),
  ],
  flushes: {
    everyDays: 5,
    count: 15,
    note: b("Pick every 4–6 days for 3 months or more. Regular picking keeps the plant bearing.", "3 महिने किंवा जास्त काळ दर 4–6 दिवसांनी तोडणी. नियमित तोडणीने झाड फळे देत राहते."),
  },
  commonProblems: [
    { name: b("Shoot and fruit borer", "शेंडा व फळ पोखरणारी अळी"), signs: b("Shoot tips wilt and droop; fruits have holes with droppings.", "शेंडे सुकून लोंबतात; फळांना छिद्रे व विष्ठा."), prevention: prevent("Cut and destroy wilted shoots and bored fruits every week, use pheromone traps, and don't plant brinjal after brinjal.", "दर आठवड्याला सुकलेले शेंडे व पोखरलेली फळे काढून नष्ट करा, कामगंध सापळे लावा आणि वांग्यानंतर पुन्हा वांगी घेऊ नका.") },
    { name: b("Jassids and whitefly", "तुडतुडे व पांढरी माशी"), signs: b("Leaf edges turn yellow and curl up; tiny insects fly when leaves are shaken.", "पानांच्या कडा पिवळ्या होऊन वर वळतात; पाने हलवल्यास बारीक कीटक उडतात."), prevention: prevent("Check under leaves weekly, keep weeds down and use yellow sticky traps.", "दर आठवड्याला पानांखाली तपासा, तण कमी ठेवा आणि पिवळे चिकट सापळे लावा.") },
    { name: b("Little leaf", "पर्णगुच्छ (लहान पाने)"), signs: b("Very small, crowded leaves; plants bushy and bear no fruit. Spread by leafhoppers.", "अतिशय लहान, दाटीवाटीची पाने; झाड झुडपासारखे होते व फळे लागत नाहीत. तुडतुड्यांमुळे पसरतो."), prevention: prevent("Pull out and destroy affected plants as soon as you see them and control leafhoppers.", "बाधित झाडे दिसताच उपटून नष्ट करा आणि तुडतुड्यांचे नियंत्रण करा.") },
    { name: b("Bacterial wilt", "मर रोग (जिवाणूजन्य)"), signs: b("Whole plant wilts suddenly while still green.", "हिरवे असतानाच संपूर्ण झाड अचानक मलूल होते."), prevention: prevent("Rotate with non-solanaceous crops, avoid waterlogging and remove wilted plants with their roots.", "टोमॅटो-मिरची-बटाटा सोडून इतर पिकांशी फेरपालट करा, पाणी साचू देऊ नका आणि मलूल झाडे मुळासकट काढा.") },
  ],
  harvestSigns: b("Fruits are full-sized, shiny and tender; the skin springs back when pressed.", "फळे पूर्ण आकाराची, चकचकीत व कोवळी; दाबल्यावर साल पुन्हा वर येते."),
  postHarvest: b("Pick in cool hours, keep in shade, remove bored and damaged fruit, grade by size and colour, and pack in crates or ventilated bags.", "थंड वेळेत तोडा, सावलीत ठेवा, पोखरलेली व खराब फळे काढा, आकार व रंगानुसार प्रतवारी करा आणि क्रेट किंवा हवेशीर पिशव्यांत भरा."),
  marketTips: b("Local buyers often prefer a particular colour and shape, so check before choosing a variety. Shiny, graded fruit without holes gets better rates.", "स्थानिक बाजारात बहुतेक वेळा ठराविक रंग व आकाराची वांगी पसंत केली जातात, म्हणून वाण निवडण्यापूर्वी चौकशी करा. छिद्र नसलेल्या, चकचकीत, प्रतवारी केलेल्या वांग्यांना चांगला दर मिळतो."),
  varieties: [], // TODO: varieties — confirm with MPKV Rahuri vegetable package of practices (e.g. Phule Arjun, Manjari Gota)
  source: "General practices from MPKV Rahuri and ICAR-IIVR vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
