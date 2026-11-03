import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "okra",
  emoji: "🫛",
  name: b("Okra (lady's finger)", "भेंडी"),
  aliases: ["okra", "bhendi", "bhindi", "bhendee", "भेंडी", "भिंडी", "ladyfinger", "lady finger", "ladies finger", "lady's finger"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada", "vidarbha"],
  majorDistricts: b("Pune, Nashik, Satara", "पुणे, नाशिक, सातारा"),
  tier: 1,
  seasons: [
    { season: "kharif", sowingWindow: b("Sow in June–July with the rains", "जून–जुलैमध्ये पावसाबरोबर पेरणी"), sowingMonths: [6, 7], durationDays: [100, 120] },
    { season: "summer", sowingWindow: b("Sow in January–February under irrigation", "जानेवारी–फेब्रुवारीमध्ये पाण्याखाली पेरणी"), sowingMonths: [1, 2], durationDays: [90, 110] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly in the field", "बियाणे; थेट शेतात टोकणी"),
  soil: b("Well-drained loamy or medium black soil. Avoid fields where water stands.", "पाण्याचा निचरा होणारी पोयट्याची किंवा मध्यम काळी जमीन. पाणी साचणारे शेत टाळा."),
  climate: b("Warm weather. Seed does not sprout well in cold soil.", "उबदार हवामान. थंड जमिनीत बी नीट उगवत नाही."),
  seedRate: b("About 3–4 kg seed per acre in kharif, 5–6 kg in summer (closer spacing).", "खरिपात एकरी साधारण 3–4 किलो, उन्हाळ्यात 5–6 किलो बियाणे (जवळचे अंतर)."),
  spacing: b("Kharif: 60 cm between rows, 30 cm between plants. Summer: 45 cm × 20–30 cm.", "खरीप: ओळींत 60 सेंमी, रोपांत 30 सेंमी. उन्हाळी: 45 × 20–30 सेंमी."),
  irrigation: b(
    "Kharif crop is mostly rainfed — water only in dry spells and drain extra water. Summer crop needs water every 4–6 days. Keep moisture even during flowering and picking.",
    "खरीप पीक बहुतेक पावसावर — फक्त पावसाच्या खंडात पाणी द्या व जास्तीचे पाणी काढा. उन्हाळी पिकाला दर 4–6 दिवसांनी पाणी लागते. फुलोरा व तोडणीत ओलावा सारखा ठेवा.",
  ),
  nutrientGuide: b(
    "Use a soil test. Mix well-rotted farmyard manure before sowing. Give nitrogen in parts: at sowing, about a month later, and again when picking starts. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. पेरणीपूर्वी कुजलेले शेणखत मिसळा. नत्र विभागून द्या: पेरणीवेळी, साधारण महिन्याने आणि तोडणी सुरू झाल्यावर. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Sowing & germination", "पेरणी व उगवण"], 0, 10, ["Seeds sprout and seedlings come up.", "बी उगवून रोपे वर येतात."], [
      t("ok-sow", 0, "sowing", ["Sow the seed", "बी टोकणी करा"], ["Soak seed overnight for faster sprouting. Sow 2 seeds per spot, 2–3 cm deep.", "लवकर उगवणीसाठी बी रात्रभर भिजवा. एका जागी 2 बिया, 2–3 सेंमी खोल टोका."]),
      t("ok-irr1", 1, "irrigation", ["Light irrigation", "हलके पाणी"], ["Keep the soil moist until seedlings come up (summer crop).", "रोपे वर येईपर्यंत जमीन ओलसर ठेवा (उन्हाळी पीक)."], 4),
    ], [["Poor sprouting in cold or crusted soil", "थंड किंवा कडक झालेल्या जमिनीत कमी उगवण"]]),
    stage("seedling", ["Seedling", "रोप अवस्था"], 10, 25, ["Young plants form their first leaves.", "लहान रोपांना पहिली पाने येतात."], [
      t("ok-thin", 12, "other", ["Thin and fill gaps", "विरळणी व खाडे भरणे"], ["Keep one healthy plant per spot; re-sow where none came up.", "एका जागी एक निरोगी रोप ठेवा; न उगवलेल्या जागी पुन्हा टोका."]),
      t("ok-weed1", 18, "weeding", ["First weeding", "पहिली खुरपणी"], ["Weed by hand or hoe.", "हाताने किंवा कोळप्याने खुरपणी करा."]),
      t("ok-obs1", 15, "observation", ["Check leaves", "पाने तपासा"], ["Look under leaves for jassids and whitefly.", "पानांखाली तुडतुडे व पांढरी माशी पाहा."], 7),
    ], [["Jassids: leaf edges yellow and curl", "तुडतुडे: पानांच्या कडा पिवळ्या व वळलेल्या"]]),
    stage("vegetative", ["Plant growth", "रोपांची वाढ"], 25, 40, ["Plants grow tall and leafy.", "रोपे उंच व पानांनी भरलेली होतात."], [
      t("ok-irr2", 25, "irrigation", ["Irrigate", "पाणी द्या"], ["Water as needed; drain any standing water.", "गरजेनुसार पाणी द्या; साचलेले पाणी काढा."], 6),
      t("ok-fert", 30, "fertiliser", ["Top dressing and earthing up", "वरखत व भर"], ["Give the second nitrogen part as per soil test and pull soil to the plants.", "माती परीक्षणानुसार नत्राचा दुसरा हप्ता द्या व रोपांना भर लावा."]),
      t("ok-yvm", 32, "observation", ["Remove virus plants", "विषाणूग्रस्त रोपे काढा"], ["Pull out plants with yellow-veined leaves at once.", "पिवळ्या शिरांची पाने असलेली रोपे लगेच उपटा."], 7),
    ], [["Yellow vein mosaic virus", "पिवळा शिरा रोग (केवडा)"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 40, 50, ["Yellow flowers open; pods start to form.", "पिवळी फुले उमलतात; भेंडी धरू लागते."], [
      t("ok-irr3", 40, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Water stress now drops flowers.", "आता पाण्याचा ताण आल्यास फुले गळतात."], 5),
      t("ok-obs2", 42, "observation", ["Check for borer", "पोखरणारी अळी तपासा"], ["Look for drooping shoot tips and holes in buds.", "लोंबलेले शेंडे व कळ्यांना छिद्रे पाहा."], 5),
    ], [["Shoot and fruit borer", "शेंडा व फळ पोखरणारी अळी"]]),
    stage("harvest", ["Harvest (pickings)", "तोडणी"], 50, 120, ["Tender pods are picked every 2–3 days.", "दर 2–3 दिवसांनी कोवळी भेंडी तोडली जाते."], [
      t("ok-pick", 50, "harvest", ["Pick tender pods", "कोवळी भेंडी तोडा"], ["Pick pods 6–8 days after flowering, when tender. Old pods turn hard and lose value.", "फूल आल्यानंतर 6–8 दिवसांनी, कोवळी असताना तोडा. जून भेंडी कडक होते व किंमत मिळत नाही."], 3),
      t("ok-irr4", 51, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep watering between pickings.", "तोडण्यांच्या मध्ये पाणी देत राहा."], 5),
      t("ok-bored", 52, "observation", ["Remove bored pods", "पोखरलेली भेंडी काढा"], ["Destroy pods with holes so the pest doesn't spread.", "कीड पसरू नये म्हणून छिद्र असलेली भेंडी नष्ट करा."], 6),
      t("ok-fert2", 60, "fertiliser", ["Top dressing", "वरखत"], ["Give the last nutrient part as per soil test to keep pods coming.", "भेंडी येत राहावी म्हणून माती परीक्षणानुसार शेवटचा हप्ता द्या."]),
    ], [["Check pre-harvest waiting days on any product label before picking", "तोडणीपूर्वी वापरलेल्या औषधाच्या लेबलवरील काढणीपूर्व कालावधी तपासा"], ["Powdery mildew in dry weather", "कोरड्या हवामानात भुरी"]]),
  ],
  flushes: {
    everyDays: 3,
    count: 20,
    note: b("Pick every 2–3 days for about 2 months. Missing a picking gives hard, unsaleable pods.", "साधारण 2 महिने दर 2–3 दिवसांनी तोडणी. एक तोडणी चुकल्यास भेंडी कडक होऊन विकली जात नाही."),
  },
  commonProblems: [
    { name: b("Yellow vein mosaic virus", "पिवळा शिरा रोग (केवडा)"), signs: b("Leaf veins turn bright yellow, then whole leaves; pods are small and pale. Spread by whitefly.", "पानांच्या शिरा पिवळ्या होतात, मग संपूर्ण पान; भेंडी लहान व फिकी. पांढऱ्या माशीमुळे पसरतो."), prevention: prevent("Grow tolerant varieties, pull out affected plants early and keep weeds down.", "सहनशील वाण लावा, बाधित रोपे लवकर उपटा आणि तण कमी ठेवा.") },
    { name: b("Shoot and fruit borer", "शेंडा व फळ पोखरणारी अळी"), signs: b("Shoot tips droop; pods have holes and are bent.", "शेंडे लोंबतात; भेंडीला छिद्रे व ती वाकडी होते."), prevention: prevent("Cut and destroy damaged shoots and pods regularly, and use pheromone traps.", "खराब शेंडे व भेंडी नियमित काढून नष्ट करा आणि कामगंध सापळे लावा.") },
    { name: b("Jassids and whitefly", "तुडतुडे व पांढरी माशी"), signs: b("Leaf edges yellow and curl upward; plants weak.", "पानांच्या कडा पिवळ्या होऊन वर वळतात; रोपे कमकुवत."), prevention: prevent("Check under leaves weekly and use yellow sticky traps.", "दर आठवड्याला पानांखाली तपासा आणि पिवळे चिकट सापळे लावा.") },
    { name: b("Powdery mildew", "भुरी"), signs: b("White powder on leaves, which later dry.", "पानांवर पांढरी भुकटी, नंतर पाने सुकतात."), prevention: prevent("Give proper spacing and remove badly affected leaves.", "योग्य अंतर ठेवा आणि जास्त बाधित पाने काढा.") },
  ],
  harvestSigns: b("Pods are full length, tender and snap easily at the tip — usually 6–8 days after the flower.", "भेंडी पूर्ण लांबीची, कोवळी व टोकाशी सहज मोडते — साधारण फूल आल्यानंतर 6–8 दिवसांनी."),
  postHarvest: b("Pick in the morning, keep in shade, remove bored and over-mature pods, and pack loosely in ventilated bags or crates.", "सकाळी तोडा, सावलीत ठेवा, पोखरलेली व जून भेंडी काढा आणि हवेशीर पिशव्यांत किंवा क्रेटमध्ये सैल भरा."),
  marketTips: b("Tender, straight, green pods of even size sell best. Okra wilts fast, so send it to market the same day.", "कोवळ्या, सरळ, हिरव्या, एकसारख्या आकाराच्या भेंडीला चांगला दर मिळतो. भेंडी लवकर सुकते, म्हणून त्याच दिवशी बाजारात पाठवा."),
  varieties: [
    { name: "Parbhani Kranti", note: b("Tolerant to yellow vein mosaic (VNMKV Parbhani)", "पिवळा शिरा रोगाला सहनशील (वनामकृवि परभणी)") },
    { name: "Arka Anamika", note: b("Tolerant to yellow vein mosaic (ICAR-IIHR)", "पिवळा शिरा रोगाला सहनशील (ICAR-IIHR)") },
  ],
  source: "General practices from VNMKV Parbhani, MPKV Rahuri and ICAR-IIHR okra guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
