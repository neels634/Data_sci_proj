import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Kokum: hardy Konkan tree; flowers in winter, fruits picked April–May before the monsoon. */
const crop: PerennialCrop = {
  id: "kokum",
  emoji: "🫐",
  name: b("Kokum", "कोकम"),
  aliases: ["kokum", "kokam", "ratamba", "rataamba", "amsul", "aamsul", "कोकम", "रातांबा", "आमसूल"],
  category: "plantation",
  lifecycle: "perennial",
  regions: ["konkan"],
  majorDistricts: b("Ratnagiri, Sindhudurg, Raigad", "रत्नागिरी, सिंधुदुर्ग, रायगड"),
  tier: 2,
  plantingWindow: b("June–August, in the monsoon", "जून–ऑगस्ट, पावसाळ्यात"),
  plantingMonths: [6, 7, 8],
  plantingMaterial: b("Softwood grafts taken from female (fruiting) trees. Seedlings are not advised — about half turn out to be male trees with no fruit.", "फळ देणाऱ्या मादी झाडांपासून तयार केलेली मृदुकाष्ठ कलमे. बियांपासूनची रोपे टाळा — त्यांपैकी साधारण निम्मी नर झाडे निघतात व त्यांना फळे येत नाहीत."),
  spacing: b("6 m × 6 m, or 7 m × 7 m on good soil", "6 मीटर × 6 मीटर, चांगल्या जमिनीत 7 मीटर × 7 मीटर"),
  plantsPerAcre: [80, 110],
  yearsToFirstHarvest: [5, 7],
  economicLifeYears: [40, 60],
  soil: b(
    "Laterite and red soils of Konkan, including slopes, with good drainage. Does well on land where other fruit trees struggle.",
    "कोकणातील जांभी व तांबडी, निचरा होणारी जमीन, उतारावरही चालते. इतर फळझाडे कमी येतात अशा जमिनीतही चांगले येते.",
  ),
  climate: b(
    "Warm, humid coastal climate with heavy monsoon rain. Young grafts like partial shade; grown trees tolerate full sun.",
    "जोरदार पावसाचे उष्ण, दमट किनारी हवामान. लहान कलमांना थोडी सावली आवडते; मोठी झाडे पूर्ण ऊन सहन करतात.",
  ),
  irrigation: b(
    "Grown rainfed. Water young grafts every 8–10 days in their first 2–3 summers. Bearing trees need little water; a few irrigations in summer help fruit size where water is available.",
    "कोरडवाहू पीक. लहान कलमांना पहिले 2–3 उन्हाळे दर 8–10 दिवसांनी पाणी द्या. उत्पादनक्षम झाडांना कमी पाणी लागते; पाणी असल्यास उन्हाळ्यात काही पाळ्या दिल्यास फळांचा आकार वाढतो.",
  ),
  nutrientGuide: b(
    "Give well-rotted farmyard manure or compost every monsoon in a ring around the tree, increasing with age. Fertiliser needs are modest; base it on a soil test and ask your agriculture officer for amounts.",
    "दर पावसाळ्यात झाडाभोवती बांगडी पद्धतीने चांगले कुजलेले शेणखत किंवा कंपोस्ट द्या; वयानुसार प्रमाण वाढवा. खताची गरज मध्यम आहे; माती परीक्षणावर आधारित खत द्या आणि प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Konkan Amruta", note: b("Released by Dr. BSKKV Dapoli; regular bearer", "डॉ. बाळासाहेब सावंत कोकण कृषी विद्यापीठ, दापोलीचा वाण; नियमित फळधारणा") },
    // TODO: varieties — confirm other released kokum varieties (e.g. Konkan Hatis) with Dr. BSKKV Dapoli
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 60, ["Grafts are planted in the monsoon and take root.", "पावसाळ्यात कलमे लावली जातात व मूळ धरतात."], [
      t("kk-pit", 0, "other", ["Plant grafts in pits", "खड्ड्यांत कलमे लावा"], ["Fill pits about 60–90 cm deep with topsoil and manure; keep the graft joint above soil and stake the plant.", "साधारण 60–90 सेंमी खोल खड्डे वरची माती व शेणखताने भरा; कलमाचा जोड मातीच्या वर ठेवा व काठीचा आधार द्या."]),
      t("kk-shade", 5, "other", ["Give light shade", "हलकी सावली करा"], ["Young grafts settle better with some shade for the first year.", "पहिले वर्षभर थोडी सावली दिल्यास लहान कलमे चांगली स्थिरावतात."]),
      t("kk-gap", 45, "other", ["Replace dead grafts", "मेलेली कलमे बदला"], ["Fill gaps while the rains continue.", "पाऊस असतानाच खाडे भरा."]),
    ], [["Waterlogging in the pit", "खड्ड्यात पाणी साचणे"]]),
    stage("young-tree", ["Young tree care", "लहान झाडांची निगा"], 60, 1095, ["Kokum grows slowly in the first years. Protect it from drought, fire and grazing.", "पहिल्या वर्षांत कोकम हळू वाढते. दुष्काळ, आग व जनावरांपासून संरक्षण करा."], [
      t("kk-sprout", 70, "other", ["Remove rootstock shoots", "खुंटावरील फूट काढा"], ["Pinch off shoots that come from below the graft joint.", "कलमाच्या जोडाखालून येणारी फूट खुडून टाका."], 30),
      t("kk-irr1", 180, "irrigation", ["Water in summer", "उन्हाळ्यात पाणी द्या"], ["Water every 8–10 days in the dry months and mulch the basin.", "कोरड्या महिन्यांत दर 8–10 दिवसांनी पाणी द्या व आळ्यात आच्छादन करा."], 10),
      t("kk-fire", 190, "other", ["Protect from fire and cattle", "आग व जनावरांपासून संरक्षण"], ["Clear dry grass around plants and fence young trees.", "झाडांभोवतीचे वाळलेले गवत काढा व लहान झाडांना कुंपण करा."]),
      t("kk-fym1", 365, "fertiliser", ["Yearly manure", "वार्षिक शेणखत"], ["Give manure in the basin every monsoon.", "दर पावसाळ्यात आळ्यात शेणखत द्या."], 365),
    ], [["Drying of young grafts in summer", "उन्हाळ्यात लहान कलमे सुकणे"]]),
    stage("frame", ["Building the frame", "झाडाचा सांगाडा"], 1095, 1825, ["The tree grows into its natural cone shape and starts its first flowers.", "झाड नैसर्गिक शंकूच्या आकारात वाढते व पहिली फुले येऊ लागतात."], [
      t("kk-prune", 1100, "other", ["Light shaping", "हलकी छाटणी"], ["Remove dry, diseased and low branches after the monsoon; kokum needs little pruning.", "पावसाळ्यानंतर वाळलेल्या, रोगट व खालच्या फांद्या काढा; कोकमला फार छाटणी लागत नाही."], 365),
      t("kk-obs1", 1110, "observation", ["Check the tree", "झाड तपासा"], ["Look for drying twigs and leaf-eating caterpillars.", "सुकणाऱ्या फांद्या व पाने खाणाऱ्या अळ्या पाहा."], 60),
    ], [["Twig drying", "फांद्या सुकणे"]]),
  ],
  cycles: [
    {
      key: "yearly",
      name: b("Yearly crop", "वार्षिक हंगाम"),
      startMonths: [10],
      startEvent: b("Orchard cleaning after the monsoon, in October", "पावसाळ्यानंतर ऑक्टोबरमध्ये बागेची साफसफाई"),
      harvestMonths: [3, 4, 5],
      note: b("Flowers appear November–February; fruits ripen March–May and must be picked before the monsoon, or they rot and split.", "फुले नोव्हेंबर–फेब्रुवारीत येतात; फळे मार्च–मे मध्ये पिकतात व पावसाळ्यापूर्वीच काढावी लागतात, नाहीतर ती कुजतात व तडकतात."),
      stages: [
        stage("post-monsoon", ["After-monsoon care", "पावसाळ्यानंतरची निगा"], 0, 45, ["The orchard is cleaned and the tree prepares to flower.", "बाग स्वच्छ केली जाते व झाड फुलण्याची तयारी करते."], [
          t("kk-clean", 0, "other", ["Clean the orchard", "बाग स्वच्छ करा"], ["Cut grass, remove dry branches and clean basins.", "गवत कापा, वाळलेल्या फांद्या काढा व आळी स्वच्छ करा."]),
          t("kk-mulch", 15, "other", ["Mulch basins", "आळ्यांत आच्छादन करा"], ["Spread dry leaves to keep moisture into the dry season.", "कोरड्या हंगामात ओल टिकावी म्हणून वाळलेली पाने पसरा."]),
        ], [["Fire in dry grass", "वाळलेल्या गवताला आग"]]),
        stage("flowering", ["Flowering and fruit set", "फुलोरा व फळधारणा"], 45, 140, ["Small flowers open and fruits set on female trees.", "मादी झाडांवर लहान फुले उमलतात व फळे धरतात."], [
          t("kk-obs2", 45, "observation", ["Check flowering", "फुलोरा तपासा"], ["Note which trees flower and set fruit. Trees with only male flowers can be top-worked with female scions — ask your KVK.", "कोणती झाडे फुलतात व फळ धरतात ते नोंदवा. फक्त नर फुले येणाऱ्या झाडांवर मादी फांदीचे कलम करता येते — कृषी विज्ञान केंद्राला विचारा."], 15),
          t("kk-irr", 60, "irrigation", ["Protective water if available", "शक्य असल्यास संरक्षित पाणी"], ["A few irrigations from fruit set help fruits grow bigger.", "फळधारणेपासून काही पाण्याच्या पाळ्या दिल्यास फळे मोठी होतात."], 15),
        ], [["Flower and young fruit drop", "फुले व कोवळी फळे गळणे"]]),
        stage("fruit-growth", ["Fruit growth", "फळांची वाढ"], 140, 160, ["Fruits grow and turn from green to red-purple.", "फळे वाढतात व हिरव्यावरून लाल-जांभळी होतात."], [
          t("kk-obs3", 140, "observation", ["Check fruits", "फळे तपासा"], ["Look for fruit drop and early colouring.", "फळगळ व लवकर रंग येणे पाहा."], 7),
          t("kk-prep", 150, "other", ["Prepare for harvest", "काढणीची तयारी"], ["Arrange baskets, drying space and buyers before picking starts.", "तोडणी सुरू होण्यापूर्वी टोपल्या, वाळवण्याची जागा व खरेदीदारांची सोय करा."]),
        ], [["Fruit drop", "फळगळ"]]),
        stage("harvest", ["Harvest", "काढणी"], 160, 230, ["Ripe red-purple fruits are picked in several rounds.", "पिकलेली लाल-जांभळी फळे अनेक फेऱ्यांत तोडली जातात."], [
          t("kk-pick", 160, "harvest", ["Pick ripe fruits", "पिकलेली फळे तोडा"], ["Pick fully coloured fruits every 4–5 days; avoid bruising.", "पूर्ण रंग आलेली फळे दर 4–5 दिवसांनी तोडा; फळे दबू देऊ नका."], 5),
          t("kk-process", 161, "other", ["Process quickly", "लगेच प्रक्रिया करा"], ["Cut fruits, separate seeds and dry the rind for amsul, or make syrup — fresh fruit spoils within days.", "फळे कापून बिया वेगळ्या करा व आमसुलासाठी साल वाळवा किंवा सरबत तयार करा — ताजी फळे काही दिवसांतच खराब होतात."], 5),
        ], [["Fruits rotting in early rain", "लवकरच्या पावसात फळे कुजणे"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Fruit rot and splitting in early rain", "लवकरच्या पावसात फळे कुजणे व तडकणे"),
      signs: b("Ripe fruits crack, turn soft and rot on the tree when pre-monsoon showers come.", "पावसाळ्यापूर्वीच्या सरी आल्यावर पिकलेली फळे झाडावरच तडकतात, मऊ होऊन कुजतात."),
      prevention: b("Pick fruits as soon as they colour and finish the harvest before the monsoon arrives.", "फळांना रंग येताच तोडा आणि पाऊस सुरू होण्यापूर्वी काढणी पूर्ण करा."),
    },
    {
      name: b("Male (non-fruiting) trees", "नर (फळ न देणारी) झाडे"),
      signs: b("Trees that flower every year but never set fruit — common in seedling orchards.", "दरवर्षी फुलणारी पण कधीच फळ न धरणारी झाडे — बियांपासूनच्या बागेत सामान्य."),
      prevention: b("Plant grafts from female trees. Keep a few male trees for pollination, and top-work extra male trees with female scions.", "मादी झाडांपासूनची कलमे लावा. परागीभवनासाठी काही नर झाडे ठेवा आणि जास्तीच्या नर झाडांवर मादी फांदीचे कलम करा."),
    },
    {
      name: b("Leaf-eating caterpillars", "पाने खाणाऱ्या अळ्या"),
      signs: b("Tender leaves eaten from the edges, sometimes webbed together.", "कोवळी पाने कडेने खाल्लेली, कधी जाळ्याने एकत्र गुंडाळलेली."),
      prevention: prevent("Check new flushes and pick off and destroy caterpillars by hand on young trees.", "नवी पालवी तपासा आणि लहान झाडांवरील अळ्या हाताने वेचून नष्ट करा."),
    },
  ],
  harvestSigns: b("Fruits turn fully dark red to purple and slightly soft, from March to May.", "मार्च ते मे दरम्यान फळे पूर्ण गडद लाल ते जांभळी व थोडी मऊ होतात."),
  postHarvest: b(
    "Process within 1–2 days. For amsul, cut fruits, remove seeds and pulp, soak rinds in the fruit's own juice and sun-dry them several times. Store dry rind in airtight containers. Seeds give kokum butter.",
    "1–2 दिवसांत प्रक्रिया करा. आमसुलासाठी फळे कापून बिया व गर काढा, साली फळांच्याच रसात भिजवून अनेकदा उन्हात वाळवा. वाळलेले आमसूल हवाबंद डब्यांत ठेवा. बियांपासून कोकम तेल (कोकम बटर) मिळते.",
  ),
  marketTips: b(
    "Selling dried amsul, kokum syrup (sarbat) or agal adds much more value than fresh fruit. Women's groups and small processors in Konkan buy fruit in season; tourist demand is high in summer.",
    "ताज्या फळांपेक्षा वाळलेले आमसूल, कोकम सरबत किंवा आगळ विकल्यास जास्त फायदा होतो. कोकणातील महिला बचत गट व लघु प्रक्रिया उद्योग हंगामात फळे घेतात; उन्हाळ्यात पर्यटकांकडून मागणी जास्त असते.",
  ),
  source: "General practices from Dr. BSKKV Dapoli kokum guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
