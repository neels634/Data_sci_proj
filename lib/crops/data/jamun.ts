import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Jamun: large tree; flowers after winter, fruits ripen just before or with the first rains. */
const crop: PerennialCrop = {
  id: "jamun",
  emoji: "🫐",
  name: b("Jamun (Indian blackberry)", "जांभूळ"),
  aliases: ["jamun", "jambhul", "jambul", "jamboo", "java plum", "black plum", "indian blackberry", "जांभूळ", "जांभळं", "जामुन"],
  category: "fruit",
  lifecycle: "perennial",
  regions: ["konkan", "western"],
  majorDistricts: b("Palghar, Thane, Raigad", "पालघर, ठाणे, रायगड"),
  tier: 2,
  plantingWindow: b("June–August, with the monsoon", "जून–ऑगस्ट, पावसाळ्यात"),
  plantingMonths: [6, 7, 8],
  plantingMaterial: b("Soft-wood or veneer grafts of a known variety; seedlings take many more years to bear", "खात्रीच्या वाणाची मृदुकाष्ठ किंवा व्हिनियर कलमे; बियांपासूनची रोपे फळावर यायला खूप वर्षे घेतात"),
  spacing: b("8–10 m between rows and 8–10 m between plants", "दोन ओळींत 8–10 मीटर व दोन झाडांत 8–10 मीटर"),
  plantsPerAcre: [40, 65],
  yearsToFirstHarvest: [4, 6],
  economicLifeYears: [40, 60],
  soil: b(
    "Deep, well-drained loamy or lateritic soil. Tolerates some waterlogging and saltiness better than most fruit trees.",
    "खोल, पाण्याचा चांगला निचरा होणारी पोयट्याची किंवा जांभ्या दगडाची जमीन. इतर फळझाडांपेक्षा थोडे साचलेले पाणी व खारवटपणा जास्त सहन करते.",
  ),
  climate: b(
    "Warm, humid climate. Dry weather at flowering helps fruit set; early rain at ripening spoils fruit.",
    "उबदार, दमट हवामान. फुलोऱ्यात कोरडी हवा फळधारणेस मदत करते; पिकताना लवकर पाऊस आल्यास फळे खराब होतात.",
  ),
  irrigation: b(
    "Water young trees every 7–10 days in winter and summer for the first 3–4 years. Bearing trees need water from fruit set to ripening in dry areas; stop water in October–November so the tree rests before flowering.",
    "पहिली 3–4 वर्षे हिवाळा-उन्हाळ्यात लहान झाडांना दर 7–10 दिवसांनी पाणी द्या. कोरड्या भागात फळे देणाऱ्या झाडांना फळधारणेपासून पिकेपर्यंत पाणी लागते; फुलोऱ्यापूर्वी विश्रांतीसाठी ऑक्टोबर–नोव्हेंबरमध्ये पाणी बंद करा.",
  ),
  nutrientGuide: b(
    "Give well-rotted farmyard manure in the basin at the start of the rains and fertiliser as per soil test. Too much nitrogen makes the tree leafy with few fruits. Ask your agriculture officer for amounts.",
    "पावसाच्या सुरुवातीला आळ्यात चांगले कुजलेले शेणखत द्या आणि माती परीक्षणानुसार खत द्या. जास्त नत्राने झाड पानांनी भरते पण फळे कमी येतात. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Konkan Bahadoli", note: b("Large-fruited variety released by Dr. BSKKV Dapoli", "डॉ. बाळासाहेब सावंत कोकण कृषी विद्यापीठ, दापोलीचा मोठ्या फळांचा वाण") },
  ], // TODO: varieties — confirm other recommended varieties with Dr. BSKKV Dapoli
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Grafts are planted in pits and take root.", "कलमे खड्ड्यांत लावली जातात व मूळ धरतात."], [
      t("jm-pit", 0, "other", ["Plant grafts in prepared pits", "तयार खड्ड्यांत कलमे लावा"], ["Fill large pits with topsoil and well-rotted manure, plant with the graft joint above soil and tie to a stick.", "मोठे खड्डे वरची माती व कुजलेल्या शेणखताने भरा, कलमाचा जोड जमिनीच्या वर ठेवून लावा व काठीला बांधा."]),
      t("jm-drain", 5, "other", ["Make sure water drains", "पाण्याचा निचरा होतो का पाहा"], ["In heavy rain areas, make a small channel so water does not stand in the pit.", "जास्त पावसाच्या भागात खड्ड्यात पाणी साचू नये म्हणून लहान चर काढा."]),
      t("jm-gap", 25, "other", ["Replace dead grafts", "मेलेली कलमे बदला"], ["Fill gaps while the rains last.", "पाऊस असतानाच खाडे भरा."]),
    ], [["Graft joint breaking in wind", "वाऱ्याने कलमाचा जोड तुटणे"]]),
    stage("training", ["Training the young tree", "झाडाला आकार देणे"], 30, 730, ["The young tree is shaped with a clean stem and well-spaced branches.", "लहान झाडाला स्वच्छ खोड व सारख्या अंतरावरच्या फांद्यांचा आकार दिला जातो."], [
      t("jm-sprout", 45, "other", ["Remove rootstock shoots", "खुंटावरील फुटवे काढा"], ["Rub off shoots from below the graft joint.", "कलमाच्या जोडाखालचे फुटवे काढा."], 45),
      t("jm-irr1", 150, "irrigation", ["Water in the dry months", "कोरड्या महिन्यांत पाणी द्या"], ["Water young trees every 7–10 days from November to May.", "नोव्हेंबर ते मे लहान झाडांना दर 7–10 दिवसांनी पाणी द्या."], 8),
      t("jm-train", 200, "other", ["Shape the tree", "झाडाला आकार द्या"], ["Keep the stem clean up to about 1 m and keep 4–5 well-spaced branches.", "खोड साधारण 1 मीटरपर्यंत स्वच्छ ठेवा व 4–5 सारख्या अंतरावरच्या फांद्या ठेवा."]),
      t("jm-weed1", 60, "weeding", ["Weed and mulch the basin", "आळे खुरपून आच्छादन करा"], ["Keep basins clean and mulched.", "आळी स्वच्छ ठेवा व आच्छादन करा."], 60),
    ], [["Leaf-eating caterpillars", "पाने खाणाऱ्या अळ्या"]]),
    stage("frame", ["Building the frame", "झाडाचा विस्तार"], 730, 1460, ["The tree grows tall and wide; first flowers come in year 4–6 for grafts.", "झाड उंच व विस्तारते; कलमांना 4–6 व्या वर्षी पहिली फुले येतात."], [
      t("jm-fym2", 1060, "fertiliser", ["Give manure", "शेणखत द्या"], ["Apply well-rotted farmyard manure at the start of the rains.", "पावसाच्या सुरुवातीला कुजलेले शेणखत द्या."]),
      t("jm-obs2", 735, "observation", ["Check the trees", "झाडे तपासा"], ["Look for borer holes in the trunk and leaf spots.", "खोडावर छिद्रे व पानांवरील ठिपके पाहा."], 30),
      t("jm-irr2", 880, "irrigation", ["Water in the dry months", "कोरड्या महिन्यांत पाणी द्या"], ["Continue dry-season water until the tree bears.", "झाड फळावर येईपर्यंत कोरड्या हंगामात पाणी चालू ठेवा."], 10),
    ], [["Bark borer", "साल पोखरणारी कीड"]]),
  ],
  cycles: [
    {
      key: "yearly",
      name: b("Yearly crop", "वार्षिक बहार"),
      startMonths: [1, 2, 3],
      startEvent: b("Flowering after the dry winter rest", "कोरड्या हिवाळी विश्रांतीनंतर फुलोरा"),
      harvestMonths: [4, 5, 6, 7],
      note: b("In the Konkan fruits ripen April–June; inland a little later. Try to finish picking before heavy rain.", "कोकणात फळे एप्रिल–जूनमध्ये पिकतात; घाटावर थोडी उशिरा. जोरदार पावसापूर्वी तोडणी संपवण्याचा प्रयत्न करा."),
      stages: [
        stage("flowering", ["Flowering", "फुलोरा"], 0, 35, ["Clusters of small, scented flowers open on older branches.", "जुन्या फांद्यांवर लहान, सुवासिक फुलांचे घोस उमलतात."], [
          t("jmy-irr1", 0, "irrigation", ["Give light water if very dry", "खूप कोरडे असल्यास हलके पाणी द्या"], ["Light water helps flowers hold; avoid heavy watering.", "हलक्या पाण्याने फुले टिकतात; भरपूर पाणी टाळा."], 10),
          t("jmy-obs1", 3, "observation", ["Check flowers", "फुले तपासा"], ["Look for flower drop and webbing caterpillars.", "फुलगळ व जाळी करणाऱ्या अळ्या पाहा."], 7),
          t("jmy-bees", 5, "observation", ["Keep bees safe", "मधमाश्यांचे संरक्षण करा"], ["Bees pollinate jamun. Avoid spraying on open flowers.", "मधमाश्या जांभळाचे परागीभवन करतात. उमललेल्या फुलांवर फवारणी टाळा."]),
        ], [["Flower drop in hot dry wind", "उष्ण कोरड्या वाऱ्याने फुलगळ"]]),
        stage("fruit-set", ["Fruit set", "फळधारणा"], 35, 65, ["Small green fruits form; many drop naturally.", "लहान हिरवी फळे लागतात; बरीच नैसर्गिकरीत्या गळतात."], [
          t("jmy-irr2", 35, "irrigation", ["Irrigate regularly", "नियमित पाणी द्या"], ["Even moisture reduces fruit drop.", "सारख्या ओलाव्याने फळगळ कमी होते."], 8),
          t("jmy-obs2", 38, "observation", ["Check young fruit", "कोवळी फळे तपासा"], ["Look for spots and dropping fruit.", "ठिपके व गळणारी फळे पाहा."], 7),
        ], [["Heavy fruit drop", "जास्त फळगळ"]]),
        stage("fruit-growth", ["Fruit growth", "फळांची वाढ"], 65, 100, ["Fruits swell and turn from green to pink to purple.", "फळे फुगतात आणि हिरव्यावरून गुलाबी, मग जांभळी होतात."], [
          t("jmy-irr3", 65, "irrigation", ["Irrigate regularly", "नियमित पाणी द्या"], ["Water stress now gives small fruit.", "आता पाण्याचा ताण पडल्यास फळे लहान राहतात."], 8),
          t("jmy-obs3", 70, "observation", ["Check for fruit fly", "फळमाशी तपासा"], ["Collect and destroy fallen and stung fruit.", "गळलेली व डंख मारलेली फळे गोळा करून नष्ट करा."], 5),
        ], [["Fruit fly", "फळमाशी"]]),
        stage("harvest", ["Ripening & picking", "पिकणे व तोडणी"], 100, 140, ["Fruits turn deep purple-black and soft and are picked in rounds.", "फळे गडद जांभळी-काळी व मऊ होऊन फेऱ्यांमध्ये तोडली जातात."], [
          t("jmy-pick", 100, "harvest", ["Pick ripe fruit", "पिकलेली फळे तोडा"], ["Pick by hand or shake branches over a clean sheet in the morning; jamun bruises easily.", "सकाळी हाताने तोडा किंवा स्वच्छ कापडावर फांद्या हलवा; जांभूळ लगेच दबते."], 2),
          t("jmy-sort", 101, "other", ["Sort and pack quickly", "लगेच वर्गवारी करून भरा"], ["Remove crushed fruit and pack in small baskets lined with leaves.", "दबलेली फळे काढा आणि पानांचे अस्तर असलेल्या लहान टोपल्यांत भरा."], 2),
        ], [["Fruit rot after rain", "पावसानंतर फळकूज"], ["Birds and bats", "पक्षी व वटवाघळे"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Fruit fly", "फळमाशी"),
      signs: b("Ripening fruit has small stings, maggots inside and drops.", "पिकणाऱ्या फळांवर लहान डंख, आत अळ्या व फळगळ."),
      prevention: prevent("Collect and destroy fallen fruit daily, use fruit fly traps and keep the area under the tree clean.", "गळलेली फळे रोज गोळा करून नष्ट करा, फळमाशी सापळे लावा आणि झाडाखालची जागा स्वच्छ ठेवा."),
    },
    {
      name: b("Leaf and fruit spot (anthracnose)", "पाने व फळांवरील डाग (करपा)"),
      signs: b("Brown spots on leaves and sunken dark spots on fruit in humid weather.", "दमट हवेत पानांवर तपकिरी ठिपके व फळांवर खोलगट काळे डाग."),
      prevention: prevent("Prune crowded branches for air flow and remove fallen leaves and diseased fruit.", "हवा खेळती राहण्यासाठी दाटीच्या फांद्या छाटा आणि गळलेली पाने व रोगट फळे काढा."),
    },
    {
      name: b("Flower and fruit drop", "फुलगळ व फळगळ"),
      signs: b("Many flowers and small fruits fall, especially in hot wind or water stress.", "उष्ण वाऱ्यात किंवा पाण्याच्या ताणात बरीच फुले व लहान फळे गळतात."),
      prevention: b("Keep soil moisture even from fruit set, mulch the basin and avoid too much nitrogen.", "फळधारणेपासून जमिनीतील ओलावा सारखा ठेवा, आळ्यात आच्छादन करा आणि जास्त नत्र टाळा."),
    },
  ],
  harvestSigns: b(
    "Fruit turns deep purple to black, becomes soft and sweet. Fruits on a tree ripen over 3–4 weeks, so pick in rounds.",
    "फळ गडद जांभळे ते काळे, मऊ व गोड होते. एका झाडावरची फळे 3–4 आठवड्यांत पिकतात, त्यामुळे फेऱ्यांमध्ये तोडा.",
  ),
  postHarvest: b(
    "Jamun spoils within 1–2 days. Pack in small baskets or crates lined with leaves, keep cool and sell the same day. Extra fruit can go for juice, vinegar or seed powder.",
    "जांभूळ 1–2 दिवसांत खराब होते. पानांचे अस्तर असलेल्या लहान टोपल्या किंवा क्रेटमध्ये भरा, थंड ठेवा आणि त्याच दिवशी विका. जादा फळांपासून रस, व्हिनेगर किंवा बियांची पावडर बनवता येते.",
  ),
  marketTips: b(
    "Big, glossy fruit sells well in Mumbai and Pune markets. Because it spoils fast, arrange transport before picking; selling through your Mandi Mitra with other growers helps.",
    "मोठ्या, चमकदार फळांना मुंबई व पुणे बाजारात चांगला दर मिळतो. फळे लवकर खराब होतात म्हणून तोडणीपूर्वीच वाहतुकीची सोय करा; मंडी मित्रामार्फत इतर उत्पादकांसोबत विकल्यास फायदा होतो.",
  ),
  source: "General practices from Dr. BSKKV Dapoli jamun guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
