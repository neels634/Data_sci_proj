import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Annual-type drumstick (PKM-1/PKM-2): pods in the first year from seed, then cut back once a year for a ratoon crop. */
const crop: PerennialCrop = {
  id: "drumstick",
  emoji: "🌿",
  name: b("Drumstick", "शेवगा"),
  aliases: ["drumstick", "shevga", "shevaga", "shewga", "शेवगा", "शेवग्याच्या शेंगा", "moringa", "sahjan", "sahjana", "सहजन", "munga", "मुनगा"],
  category: "vegetable",
  lifecycle: "perennial",
  regions: ["konkan", "western", "north", "marathwada", "vidarbha"],
  tier: 2,
  plantingWindow: b("June–August (monsoon); with irrigation also in February", "जून–ऑगस्ट (पावसाळा); पाण्याची सोय असल्यास फेब्रुवारीतही"),
  plantingMonths: [6, 7, 8, 2],
  plantingMaterial: b(
    "Seedlings of annual types like PKM-1 raised in polythene bags for 35–45 days, or seed sown directly in pits",
    "PKM-1 सारख्या वार्षिक जातींची पिशवीत 35–45 दिवस वाढवलेली रोपे, किंवा खड्ड्यात थेट बी",
  ),
  spacing: b("2.5–3 m between rows and 2.5–3 m between plants; pits about 45 cm deep and wide.", "ओळींत 2.5–3 मीटर व झाडांत 2.5–3 मीटर; साधारण 45 सेंमी खोल व रुंद खड्डे."),
  plantsPerAcre: [450, 650],
  yearsToFirstHarvest: [1, 1],
  economicLifeYears: [3, 5],
  soil: b("Grows on most well-drained soils, including light and gravelly soils. Waterlogging kills the roots.", "हलक्या व मुरमाड जमिनीसह बहुतेक पाण्याचा निचरा होणाऱ्या जमिनीत येतो. पाणी साचल्यास मुळे कुजतात."),
  climate: b("Hot, dry weather suits it. Tolerates drought; heavy rain and cold at flowering drop flowers.", "उष्ण, कोरडे हवामान योग्य. दुष्काळ सहन करतो; फुलोऱ्यात जोरदार पाऊस व थंडीमुळे फुलगळ होते."),
  irrigation: b(
    "Water young plants every 7–10 days until established. Grown trees need water every 10–15 days in dry months; drip suits well. Even water at flowering reduces flower drop. Never let water stand.",
    "लहान रोपे स्थिरावेपर्यंत दर 7–10 दिवसांनी पाणी द्या. मोठ्या झाडांना कोरड्या महिन्यांत दर 10–15 दिवसांनी पाणी; ठिबक योग्य. फुलोऱ्यात सारखे पाणी दिल्यास फुलगळ कमी होते. पाणी कधीही साचू देऊ नका.",
  ),
  nutrientGuide: b(
    "Fill pits with topsoil and well-rotted farmyard manure. Give manure again after every pruning, and fertiliser as per soil test in 2 parts — after pruning and before flowering. Ask your agriculture officer for amounts.",
    "खड्डे वरची माती व कुजलेल्या शेणखताने भरा. प्रत्येक छाटणीनंतर पुन्हा शेणखत द्या, आणि माती परीक्षणानुसार खत 2 हप्त्यांत — छाटणीनंतर व फुलोऱ्यापूर्वी. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "PKM-1", note: b("Annual type that bears in about 6 months; widely grown in Maharashtra (TNAU, Periyakulam)", "साधारण 6 महिन्यांत शेंगा देणारी वार्षिक जात; महाराष्ट्रात मोठ्या प्रमाणावर लागवड (TNAU, पेरियाकुलम)") },
    { name: "PKM-2", note: b("Annual type with long pods (TNAU, Periyakulam)", "लांब शेंगांची वार्षिक जात (TNAU, पेरियाकुलम)") },
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Seedlings are planted in pits and take root.", "रोपे खड्ड्यांत लावली जातात व मूळ धरतात."], [
      t("dm-plant", 0, "other", ["Plant in prepared pits", "तयार खड्ड्यांत लागवड करा"], ["Fill pits with topsoil and manure, remove the bag carefully and plant without breaking the soil ball.", "खड्डे माती व शेणखताने भरा, पिशवी काळजीपूर्वक काढा आणि मातीचा गोळा न फोडता रोप लावा."]),
      t("dm-irr0", 1, "irrigation", ["Water the young plants", "लहान रोपांना पाणी द्या"], ["Keep soil moist, not wet. Skip in rainy weeks.", "माती ओलसर ठेवा, चिखल नको. पावसाच्या आठवड्यात गरज नाही."], 5),
      t("dm-gap", 25, "other", ["Replace dead plants", "मेलेली रोपे बदला"], ["Replant gaps early.", "खाडे लवकर भरा."]),
    ], [["Root rot where water stands", "पाणी साचल्यास मूळकूज"], ["Termites at the roots", "मुळांना वाळवी"]]),
    stage("growth", ["Growth & pinching", "वाढ व शेंडा खुडणे"], 30, 120, ["The plant grows fast; pinching the top makes it bushy and low.", "झाड झपाट्याने वाढते; शेंडा खुडल्याने झाड डेरेदार व बुटके राहते."], [
      t("dm-irr1", 30, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 7–10 days in dry spells.", "पावसाच्या खंडात दर 7–10 दिवसांनी पाणी द्या."], 8),
      t("dm-pinch", 60, "other", ["Pinch the top", "शेंडा खुडा"], ["When the plant is about 75 cm tall, pinch the growing tip so side branches come. Pods are then easy to pick.", "झाड साधारण 75 सेंमी उंच झाल्यावर शेंडा खुडा, म्हणजे बाजूच्या फांद्या फुटतात. मग शेंगा तोडणे सोपे जाते."]),
      t("dm-weed", 45, "weeding", ["Keep basins weed-free", "आळी तणमुक्त ठेवा"], ["Weed around plants and mulch with dry leaves.", "झाडांभोवती खुरपणी करा व वाळलेल्या पानांचे आच्छादन करा."], 30),
      t("dm-obs1", 50, "observation", ["Check leaves", "पाने तपासा"], ["Look for hairy caterpillars in groups on the trunk and leaves.", "खोडावर व पानांवर समूहात केसाळ अळ्या आहेत का ते पाहा."], 14),
    ], [["Hairy caterpillars eating leaves", "केसाळ अळ्या पाने खातात"]]),
    stage("first-flowering", ["First flowering", "पहिला फुलोरा"], 120, 150, ["Creamy white flowers come in bunches.", "घोसांत पांढरट फुले येतात."], [
      t("dm-fert1", 120, "fertiliser", ["Feed before flowering", "फुलोऱ्यापूर्वी खत"], ["Give manure and fertiliser as per soil test. Ask your agriculture officer for amounts.", "माती परीक्षणानुसार शेणखत व खत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
      t("dm-irr2", 121, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even water reduces flower drop.", "सारख्या पाण्याने फुलगळ कमी होते."], 8),
      t("dm-obs2", 125, "observation", ["Check flower buds", "कळ्या तपासा"], ["Look for bud worm holes and dropping buds.", "कळ्यांना छिद्रे व कळीगळ आहे का ते पाहा."], 7),
    ], [["Bud worm and flower drop", "कळी पोखरणारी अळी व फुलगळ"]]),
    stage("first-harvest", ["First pods & harvest", "पहिल्या शेंगा व तोडणी"], 150, 270, ["Pods grow and are picked tender over 2–3 months.", "शेंगा वाढतात व 2–3 महिने कोवळ्या तोडल्या जातात."], [
      t("dm-irr3", 150, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water helps pods fill.", "नियमित पाण्याने शेंगा भरतात."], 10),
      t("dm-pick0", 175, "harvest", ["Pick tender pods", "कोवळ्या शेंगा तोडा"], ["Pick pods while they snap easily and seeds are not yet bulging.", "शेंगा सहज मोडतात व बिया फुगलेल्या नसतात तेव्हा तोडा."], 5),
      t("dm-obs3", 160, "observation", ["Check pods", "शेंगा तपासा"], ["Look for pods that turn yellow, crack or ooze gum (pod fly). Remove and destroy them.", "पिवळ्या पडणाऱ्या, तडकणाऱ्या किंवा डिंक येणाऱ्या शेंगा (शेंग माशी) पाहा. त्या काढून नष्ट करा."], 7),
    ], [["Pod fly", "शेंग माशी"]]),
  ],
  cycles: [
    {
      key: "ratoon",
      name: b("Yearly cut-back (ratoon crop)", "वार्षिक छाटणी (खोडवा पीक)"),
      startMonths: [4, 5, 6],
      startEvent: b("After the last picking, cut the tree back to about 1 m above ground and give manure", "शेवटच्या तोडणीनंतर झाड जमिनीपासून साधारण 1 मीटरवर छाटून शेणखत द्या"),
      harvestMonths: [11, 12, 1, 2, 3],
      note: b("Annual types like PKM-1 are cut back every year after harvest and give 3–4 ratoon crops before replanting.", "PKM-1 सारख्या वार्षिक जाती दर वर्षी काढणीनंतर छाटल्या जातात आणि नवीन लागवडीपूर्वी 3–4 खोडवा पिके देतात."),
      stages: [
        stage("cut-back", ["Cut-back", "छाटणी"], 0, 30, ["The tree is cut back and new shoots start.", "झाड छाटले जाते व नवी फूट सुरू होते."], [
          t("dmr-prune", 0, "other", ["Cut the tree back", "झाड छाटा"], ["Cut main stems to about 1 m above ground with a clean, sharp tool. Cover big cuts with a paste of cow dung and red soil.", "स्वच्छ, धारदार हत्याराने मुख्य खोड जमिनीपासून साधारण 1 मीटरवर छाटा. मोठ्या कापांवर शेण व तांबड्या मातीचा लेप लावा."]),
          t("dmr-fym", 5, "fertiliser", ["Give manure", "शेणखत द्या"], ["Put well-rotted farmyard manure in the basin and give fertiliser as per soil test.", "आळ्यात कुजलेले शेणखत द्या व माती परीक्षणानुसार खत द्या."]),
          t("dmr-irr0", 6, "irrigation", ["Irrigate", "पाणी द्या"], ["Give water to start new growth if there is no rain.", "पाऊस नसल्यास नवी फूट येण्यासाठी पाणी द्या."], 10),
        ], [["Stem borer entering cut ends", "कापलेल्या टोकातून खोडकिडा"]]),
        stage("regrowth", ["New growth", "नवी फूट"], 30, 120, ["New branches grow; thin them to keep a good frame.", "नव्या फांद्या वाढतात; चांगला आकार राहण्यासाठी विरळणी करा."], [
          t("dmr-thin", 40, "other", ["Thin new shoots", "नवी फूट विरळ करा"], ["Keep 4–6 well-spaced strong shoots; remove weak ones.", "योग्य अंतरावरच्या 4–6 मजबूत फांद्या ठेवा; कमजोर काढा."]),
          t("dmr-weed", 45, "weeding", ["Keep basins weed-free", "आळी तणमुक्त ठेवा"], ["Weed and mulch the basins.", "आळ्यांत खुरपणी व आच्छादन करा."], 30),
          t("dmr-obs1", 50, "observation", ["Check for caterpillars", "अळ्या तपासा"], ["Look for groups of hairy caterpillars on the trunk; scrape and destroy them.", "खोडावर समूहातील केसाळ अळ्या पाहा; खरवडून नष्ट करा."], 14),
        ], [["Hairy caterpillars", "केसाळ अळ्या"]]),
        stage("flowering", ["Flowering", "फुलोरा"], 120, 160, ["Flower bunches appear on the new branches.", "नव्या फांद्यांवर फुलांचे घोस येतात."], [
          t("dmr-fert", 120, "fertiliser", ["Feed before flowering", "फुलोऱ्यापूर्वी खत"], ["Give the second fertiliser part as per soil test.", "माती परीक्षणानुसार खताचा दुसरा हप्ता द्या."]),
          t("dmr-irr1", 121, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even water reduces flower drop.", "सारख्या पाण्याने फुलगळ कमी होते."], 10),
          t("dmr-obs2", 125, "observation", ["Check flower buds", "कळ्या तपासा"], ["Look for bud worm and dropping buds.", "कळी पोखरणारी अळी व कळीगळ पाहा."], 7),
        ], [["Bud worm", "कळी पोखरणारी अळी"]]),
        stage("pod-growth", ["Pod growth", "शेंगांची वाढ"], 160, 200, ["Pods lengthen and fill.", "शेंगा लांब होतात व भरतात."], [
          t("dmr-irr2", 160, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water helps pods fill.", "नियमित पाण्याने शेंगा भरतात."], 10),
          t("dmr-obs3", 165, "observation", ["Check pods", "शेंगा तपासा"], ["Remove pods that yellow, crack or ooze gum.", "पिवळ्या पडणाऱ्या, तडकणाऱ्या किंवा डिंक येणाऱ्या शेंगा काढा."], 7),
        ], [["Pod fly", "शेंग माशी"]]),
        stage("harvest", ["Harvest", "तोडणी"], 200, 300, ["Tender pods are picked every few days.", "दर काही दिवसांनी कोवळ्या शेंगा तोडल्या जातात."], [
          t("dmr-pick", 200, "harvest", ["Pick tender pods", "कोवळ्या शेंगा तोडा"], ["Pick pods while they snap easily; tie in bundles of equal length.", "शेंगा सहज मोडतात तेव्हा तोडा; सारख्या लांबीच्या जुड्या बांधा."], 5),
          t("dmr-irr3", 201, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep watering in dry months.", "कोरड्या महिन्यांत पाणी देत राहा."], 12),
          t("dmr-phi", 202, "observation", ["Check spray waiting periods", "फवारणीचा प्रतीक्षा कालावधी तपासा"], ["Do not pick before the waiting period on the label of any product you sprayed.", "फवारलेल्या औषधाच्या लेबलवरील प्रतीक्षा कालावधीपूर्वी तोडणी करू नका."]),
        ], [["Over-mature, fibrous pods", "जून, शिरेदार शेंगा"]]),
      ],
    },
  ],
  commonProblems: [
    { name: b("Hairy caterpillar", "केसाळ अळी"), signs: b("Groups of hairy caterpillars on the trunk by day; leaves eaten at night.", "दिवसा खोडावर समूहात केसाळ अळ्या; रात्री पाने खातात."), prevention: prevent("Check trunks often, scrape off groups and destroy them; do not touch with bare hands.", "खोड वारंवार तपासा, समूह खरवडून नष्ट करा; उघड्या हाताने स्पर्श करू नका.") },
    { name: b("Bud worm", "कळी पोखरणारी अळी"), signs: b("Holes in flower buds; buds drop.", "कळ्यांना छिद्रे; कळ्या गळतात."), prevention: prevent("Collect and destroy fallen buds and keep the basin clean.", "गळलेल्या कळ्या गोळा करून नष्ट करा व आळे स्वच्छ ठेवा.") },
    { name: b("Pod fly", "शेंग माशी"), signs: b("Pods turn yellow from the tip, crack and ooze gum; maggots inside.", "शेंगा टोकाकडून पिवळ्या पडतात, तडकतात व डिंक येतो; आत अळ्या."), prevention: prevent("Pick and destroy affected pods and dig the soil around the tree lightly after harvest.", "बाधित शेंगा तोडून नष्ट करा व काढणीनंतर झाडाभोवतीची माती हलकी खणा.") },
    { name: b("Root rot", "मूळकूज"), signs: b("Leaves yellow and drop, the tree wilts; roots are dark and soft.", "पाने पिवळी पडून गळतात, झाड मलूल होते; मुळे काळी व मऊ."), prevention: prevent("Plant on well-drained land, never let water stand in basins, and do not injure roots.", "निचरा होणाऱ्या जमिनीत लावा, आळ्यात पाणी साचू देऊ नका व मुळांना इजा करू नका.") },
  ],
  harvestSigns: b("Pods are full length, green and snap easily; seeds inside have not bulged. About 2 months after flowering.", "शेंगा पूर्ण लांबीच्या, हिरव्या व सहज मोडणाऱ्या; आतील बिया फुगलेल्या नाहीत. फुलोऱ्यानंतर साधारण 2 महिने."),
  postHarvest: b("Pick in cool hours, sort by length, tie in bundles and pack in wet gunny or crates so pods stay fresh.", "थंड वेळेत तोडा, लांबीनुसार वेगळ्या करा, जुड्या बांधा आणि शेंगा ताज्या राहाव्यात म्हणून ओल्या गोणपाटात किंवा क्रेटमध्ये भरा."),
  marketTips: b("Long, straight, tender pods fetch the best price. Prices are usually higher when supply is low in summer. Big city markets and pickle makers buy regularly.", "लांब, सरळ, कोवळ्या शेंगांना सर्वाधिक दर. उन्हाळ्यात आवक कमी असताना दर बहुधा जास्त असतात. मोठ्या शहरांचे बाजार व लोणचे उत्पादक नियमित खरेदी करतात."),
  source: "General practices from MPKV Rahuri, Dr. BSKKV Dapoli and TNAU Periyakulam (PKM drumstick) guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
