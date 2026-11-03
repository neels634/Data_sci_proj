import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Tuberose (nishigandh): planted from bulbs, picked for most of the year, kept 2 more years as a ratoon. */
const crop: SeasonalCrop = {
  id: "tuberose",
  emoji: "💐",
  name: b("Tuberose", "निशिगंध"),
  aliases: ["tuberose", "tube rose", "nishigandh", "nishigandha", "gulchadi", "gulchhadi", "rajnigandha", "निशिगंध", "निशिगंधा", "गुलछडी", "रजनीगंधा"],
  category: "flower",
  lifecycle: "seasonal",
  regions: ["western", "north"],
  majorDistricts: b("Pune, Satara, Sangli", "पुणे, सातारा, सांगली"),
  tier: 2,
  seasons: [
    {
      season: "summer",
      label: b("Main planting", "मुख्य लागवड"),
      sowingWindow: b("Plant bulbs in March–May with irrigation; June–July planting also works where summer water is short", "पाण्याची सोय असल्यास मार्च–मे मध्ये कंद लावा; उन्हाळ्यात पाणी कमी असल्यास जून–जुलै लागवडही चालते"),
      sowingMonths: [3, 4, 5, 6],
      durationDays: [330, 365],
    },
  ],
  method: "vegetative",
  plantingMaterial: b("Healthy bulbs 2–3 cm across, taken from a crop at least a year old and stored for a month before planting", "किमान वर्षभराच्या पिकातील 2–3 सेंमी जाडीचे निरोगी कंद, लागवडीपूर्वी महिनाभर साठवलेले"),
  soil: b(
    "Well-drained loamy or medium soil with plenty of organic matter. Waterlogging rots the bulbs.",
    "भरपूर सेंद्रिय पदार्थ असलेली, निचरा होणारी पोयट्याची किंवा मध्यम जमीन. पाणी साचल्यास कंद सडतात.",
  ),
  climate: b(
    "Warm, sunny weather suits it. Flowering slows in cold winter months and picks up again from February.",
    "उबदार, सूर्यप्रकाशाचे हवामान योग्य. थंडीच्या महिन्यांत फुलोरा मंदावतो व फेब्रुवारीपासून पुन्हा वाढतो.",
  ),
  seedRate: b("Roughly 45,000–65,000 bulbs per acre, depending on spacing.", "अंतरानुसार एकरी साधारण 45,000–65,000 कंद."),
  spacing: b("30 cm × 30 cm or 30 cm × 20 cm, 5–7 cm deep, on flat beds or ridges.", "सपाट वाफ्यांत किंवा सरी-वरंब्यावर 30 सेंमी × 30 सेंमी किंवा 30 सेंमी × 20 सेंमी, 5–7 सेंमी खोल."),
  irrigation: b(
    "Water lightly after planting and keep the soil just moist until sprouting. Then water every 5–7 days in summer and 8–10 days in winter; drip suits it well.",
    "लागवडीनंतर हलके पाणी द्या व कोंब येईपर्यंत माती फक्त ओलसर ठेवा. नंतर उन्हाळ्यात दर 5–7 दिवसांनी व हिवाळ्यात दर 8–10 दिवसांनी पाणी द्या; ठिबक चांगले.",
  ),
  nutrientGuide: b(
    "Mix plenty of well-rotted farmyard manure before planting. Split nitrogen into 3 parts — at planting, about 2 months later and at spike emergence. Feed again after each ratoon begins. Ask your agriculture officer for amounts.",
    "लागवडीपूर्वी भरपूर कुजलेले शेणखत मिसळा. नत्र 3 हप्त्यांत द्या — लागवडीवेळी, साधारण 2 महिन्यांनी व दांडा येताना. खोडवा सुरू झाल्यावर पुन्हा खत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("sprouting", ["Planting and sprouting", "लागवड व कोंब येणे"], 0, 30, ["Bulbs are planted and send up shoots.", "कंद लावले जातात व कोंब येतात."], [
      t("tb-plant", 0, "sowing", ["Plant the bulbs", "कंद लावा"], ["Plant bulbs 5–7 cm deep at the chosen spacing and give a light irrigation.", "निवडलेल्या अंतरावर 5–7 सेंमी खोल कंद लावा व हलके पाणी द्या."]),
      t("tb-irr0", 5, "irrigation", ["Keep soil just moist", "माती फक्त ओलसर ठेवा"], ["Too much water now rots bulbs.", "आता जास्त पाणी दिल्यास कंद सडतात."], 7),
      t("tb-gap", 25, "other", ["Fill gaps", "खाडे भरा"], ["Replant where bulbs did not sprout.", "जेथे कोंब आले नाहीत तेथे नवे कंद लावा."]),
    ], [["Bulb rot in wet soil", "ओल्या जमिनीत कंद सडणे"]]),
    stage("vegetative", ["Leaf growth", "पानांची वाढ"], 30, 90, ["Leaves grow in a clump. Strong leaves now mean long spikes later.", "पानांचा पुंजका वाढतो. आता मजबूत पाने म्हणजे नंतर लांब दांडे."], [
      t("tb-irr1", 30, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 5–7 days in summer.", "उन्हाळ्यात दर 5–7 दिवसांनी पाणी द्या."], 6),
      t("tb-weed", 35, "weeding", ["Weeding", "खुरपणी"], ["Weed regularly — weeds compete strongly in the early months.", "नियमित खुरपणी करा — सुरुवातीच्या महिन्यांत तण जोरात स्पर्धा करतात."], 20),
      t("tb-fert", 60, "fertiliser", ["Second nitrogen part", "नत्राचा दुसरा हप्ता"], ["Give the second part and earth up lightly.", "दुसरा हप्ता देऊन हलकी भर द्या."]),
      t("tb-obs1", 40, "observation", ["Check leaves", "पाने तपासा"], ["Look for brown leaf spots and mites.", "पानांवर तपकिरी ठिपके व कोळी पाहा."], 10),
    ], [["Leaf spot", "पानांवरील ठिपके"]]),
    stage("spiking", ["Spike emergence", "दांडा येणे"], 90, 110, ["Flower spikes rise from the centre of the clump.", "पुंजक्याच्या मधोमध फुलांचे दांडे येतात."], [
      t("tb-fert3", 90, "fertiliser", ["Third nitrogen part", "नत्राचा तिसरा हप्ता"], ["Give the last part as spikes appear.", "दांडे दिसू लागल्यावर शेवटचा हप्ता द्या."]),
      t("tb-obs2", 92, "observation", ["Check spikes and buds", "दांडे व कळ्या तपासा"], ["Look for thrips and bud damage.", "फुलकिडे व कळ्यांचे नुकसान पाहा."], 7),
    ], [["Thrips on buds", "कळ्यांवर फुलकिडे"]]),
    stage("flowering", ["Flowering and picking", "फुलोरा व तोडणी"], 110, 365, ["Spikes and loose flowers are picked through most of the year, with a slow period in cold months.", "थंडीतील मंद काळ सोडून वर्षाच्या बहुतेक काळात दांडे व सुटी फुले तोडली जातात."], [
      t("tb-pick", 110, "harvest", ["Pick flowers or cut spikes", "फुले तोडा किंवा दांडे कापा"], ["Pick open loose flowers early in the morning; cut spikes when the lowest 1–2 pairs of flowers open.", "उमललेली सुटी फुले पहाटे तोडा; खालच्या 1–2 जोड्या उमलल्यावर दांडे कापा."], 3),
      t("tb-irr2", 111, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water keeps the spikes coming.", "नियमित पाण्यामुळे दांडे येत राहतात."], 7),
      t("tb-obs3", 120, "observation", ["Check plants", "झाडे तपासा"], ["Watch for stem rot at the base in wet weather and for nematode-stunted clumps.", "ओल्या हवेत बुंधा कुजणे व सूत्रकृमीमुळे खुंटलेले पुंजके पाहा."], 15),
    ], [["Stem rot", "खोड कूज"], ["Root-knot nematodes", "मूळगाठ सूत्रकृमी"]]),
  ],
  ratoon: {
    allowed: true,
    cycles: 2,
    durationDays: [330, 365],
    note: b(
      "After the first year, cut old leaves, give manure and fertiliser and keep the clumps for 2 more years. Yield falls after that as clumps crowd; lift, divide and replant the bulbs.",
      "पहिल्या वर्षानंतर जुनी पाने कापा, शेणखत व खत द्या आणि पुंजके आणखी 2 वर्षे ठेवा. त्यानंतर पुंजके दाट होऊन उत्पादन घटते; कंद काढून वेगळे करा व पुन्हा लावा.",
    ),
  },
  flushes: {
    everyDays: 3,
    count: 60,
    note: b("Loose flowers are picked every 2–3 days in the peak months; fewer pickings in December–January.", "मुख्य महिन्यांत दर 2–3 दिवसांनी सुटी फुले तोडली जातात; डिसेंबर–जानेवारीत तोडण्या कमी."),
  },
  varieties: [
    { name: "Prajwal", note: b("Single-flowered variety from ICAR-IIHR, Bengaluru", "ICAR-भारतीय बागायती संशोधन संस्था, बेंगळुरूचा एकेरी फुलांचा वाण") },
    { name: "Suvasini", note: b("Double-flowered variety from ICAR-IIHR, Bengaluru", "ICAR-भारतीय बागायती संशोधन संस्था, बेंगळुरूचा दुहेरी फुलांचा वाण") },
    // TODO: varieties — confirm MPKV Rahuri tuberose varieties for Maharashtra
  ],
  commonProblems: [
    {
      name: b("Stem and bulb rot", "खोड व कंद कूज"),
      signs: b("Water-soaked patches at the base of leaves, leaves rot and fall; white fungal threads near the soil.", "पानांच्या तळाशी पाणथळ डाग, पाने कुजून पडतात; मातीजवळ पांढरे बुरशीचे धागे."),
      prevention: prevent("Use healthy bulbs, avoid waterlogging, and remove and destroy rotting clumps.", "निरोगी कंद वापरा, पाणी साचू देऊ नका आणि सडणारे पुंजके काढून नष्ट करा."),
    },
    {
      name: b("Root-knot nematodes", "मूळगाठ सूत्रकृमी"),
      signs: b("Plants stay short with yellow leaves; roots show small knots.", "झाडे खुजी राहतात व पाने पिवळी; मुळांवर लहान गाठी."),
      prevention: prevent("Rotate with non-host crops, add plenty of organic manure, and plant marigold nearby or in rotation.", "यजमान नसलेल्या पिकांची फेरपालट करा, भरपूर सेंद्रिय खत द्या आणि जवळ किंवा फेरपालटीत झेंडू लावा."),
    },
    {
      name: b("Thrips", "फुलकिडे"),
      signs: b("Streaks on leaves and buds; flowers are deformed.", "पाने व कळ्यांवर रेषा; फुले विकृत होतात."),
      prevention: prevent("Use blue sticky traps and keep the field weed-free.", "निळे चिकट सापळे लावा व शेत तणमुक्त ठेवा."),
    },
  ],
  harvestSigns: b("Loose flowers: pick fully developed buds or just-opened flowers early in the morning. Spikes: cut when the lowest 1–2 pairs of flowers open.", "सुटी फुले: पूर्ण वाढलेल्या कळ्या किंवा नुकतीच उमललेली फुले पहाटे तोडा. दांडे: खालच्या 1–2 जोड्या उमलल्यावर कापा."),
  postHarvest: b(
    "Keep picked flowers in shade, sprinkle lightly and pack in bamboo baskets or cartons lined with wet cloth. Put cut spikes in clean water and bunch them by length.",
    "तोडलेली फुले सावलीत ठेवा, हलके पाणी शिंपडा आणि ओल्या कापडाचे अस्तर असलेल्या बांबूच्या टोपल्यांत किंवा खोक्यांत भरा. कापलेले दांडे स्वच्छ पाण्यात ठेवा व लांबीनुसार जुड्या बांधा.",
  ),
  marketTips: b(
    "Loose flowers are in demand for garlands and veni, and spikes for bouquets and weddings. Send fresh flowers to market the same morning; prices rise in the festival and wedding seasons.",
    "हार व वेणीसाठी सुट्या फुलांना आणि गुच्छ व लग्नसमारंभासाठी दांड्यांना मागणी असते. ताजी फुले त्याच सकाळी बाजारात पाठवा; सण व लग्नसराईत दर वाढतात.",
  ),
  source: "General practices from ICAR-Directorate of Floricultural Research, Pune, ICAR-IIHR and MPKV Rahuri flower crop guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
