import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Chrysanthemum (shevanti): planted in the monsoon, flowers as days get shorter, October–December. */
const crop: SeasonalCrop = {
  id: "chrysanthemum",
  emoji: "🏵️",
  name: b("Chrysanthemum", "शेवंती"),
  aliases: ["chrysanthemum", "chrysanthimum", "chrysanthemam", "shevanti", "shewanti", "shevati", "guldaudi", "शेवंती", "शेवती", "गुलदाउदी"],
  category: "flower",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada"],
  majorDistricts: b("Pune, Satara, Sangli, Ahilyanagar, Nashik", "पुणे, सातारा, सांगली, अहिल्यानगर, नाशिक"),
  tier: 1,
  seasons: [
    {
      season: "kharif",
      label: b("Kharif (main)", "खरीप (मुख्य)"),
      sowingWindow: b("Plant rooted cuttings or suckers in June–July; flowers come October–December as the days get shorter", "जून–जुलैमध्ये मुळे फुटलेली छाटकलमे किंवा फुटवे लावा; दिवस लहान होताना ऑक्टोबर–डिसेंबरमध्ये फुले येतात"),
      sowingMonths: [6, 7],
      durationDays: [150, 180],
    },
  ],
  method: "vegetative",
  plantingMaterial: b("Rooted cuttings or suckers taken from healthy, disease-free mother plants", "निरोगी, रोगमुक्त मातृ झाडांपासून घेतलेली मुळे फुटलेली छाटकलमे किंवा फुटवे"),
  soil: b(
    "Well-drained, light to medium soil rich in organic matter. Waterlogging quickly causes root rot and wilt.",
    "सेंद्रिय पदार्थांनी समृद्ध, निचरा होणारी हलकी ते मध्यम जमीन. पाणी साचल्यास लगेच मुळकूज व मर होते.",
  ),
  climate: b(
    "A short-day plant: it grows leaves in the long days of the monsoon and flowers when days shorten in autumn. Cool nights give the best colour.",
    "लहान दिवसाचे पीक: पावसाळ्यातील मोठ्या दिवसांत पाने वाढतात व शरद ऋतूत दिवस लहान झाल्यावर फुले येतात. थंड रात्रींमध्ये सर्वोत्तम रंग येतो.",
  ),
  seedRate: b("About 30,000–45,000 rooted cuttings or suckers per acre, depending on spacing.", "अंतरानुसार एकरी साधारण 30,000–45,000 छाटकलमे किंवा फुटवे."),
  spacing: b("45 cm × 30 cm, or 30 cm × 30 cm for small-flowered types, on ridges or raised beds.", "सरी-वरंब्यावर किंवा गादीवाफ्यावर 45 सेंमी × 30 सेंमी, लहान फुलांच्या वाणांसाठी 30 सेंमी × 30 सेंमी."),
  irrigation: b(
    "Kharif rain is usually enough at first, but drains are a must. After the rains, water every 5–7 days; drip works well. Keep moisture steady during flowering.",
    "सुरुवातीला खरीपाचा पाऊस सहसा पुरेसा असतो, पण चर आवश्यक. पाऊस थांबल्यावर दर 5–7 दिवसांनी पाणी द्या; ठिबक चांगले. फुलोऱ्यात ओलावा सारखा ठेवा.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure or compost before planting. Give part of the nitrogen at planting and the rest in 1–2 parts before buds form. Base it on a soil test; ask your agriculture officer for amounts.",
    "लागवडीपूर्वी चांगले कुजलेले शेणखत किंवा कंपोस्ट मिसळा. नत्राचा काही भाग लागवडीवेळी व उरलेला कळी येण्यापूर्वी 1–2 हप्त्यांत द्या. माती परीक्षणावर आधारित खत द्या; प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("planting", ["Planting", "लागवड"], 0, 20, ["Rooted cuttings are planted and settle in.", "छाटकलमे लावली जातात व स्थिरावतात."], [
      t("ch-field", 0, "transplanting", ["Plant rooted cuttings", "छाटकलमे लावा"], ["Make ridges or raised beds with drains, mix manure and plant cuttings in the evening; water right away.", "चरांसह सरी-वरंबे किंवा गादीवाफे करा, शेणखत मिसळा आणि संध्याकाळी कलमे लावून लगेच पाणी द्या."]),
      t("ch-drain", 5, "other", ["Open drains", "चर मोकळे करा"], ["Make sure rainwater leaves the field within hours.", "पावसाचे पाणी काही तासांत शेताबाहेर जाईल याची खात्री करा."]),
      t("ch-gap", 12, "other", ["Fill the gaps", "खाडे भरा"], ["Replace dead cuttings so the crop flowers together.", "पीक एकत्र फुलावे म्हणून मेलेल्या कलमांच्या जागी नवी लावा."]),
    ], [["Cuttings rotting in waterlogged soil", "पाणी साचल्याने कलमे कुजणे"]]),
    stage("vegetative", ["Growth and pinching", "वाढ व शेंडा खुडणे"], 20, 75, ["Plants grow leaves and branches. Pinching makes them bushy with more flowers.", "झाडांना पाने व फांद्या येतात. शेंडा खुडल्याने झाड झुडपासारखे होऊन जास्त फुले येतात."], [
      t("ch-pinch1", 25, "other", ["First pinching", "पहिली शेंडा खुडणी"], ["Nip off the growing tip 3–4 weeks after planting.", "लागवडीनंतर 3–4 आठवड्यांनी वाढणारा शेंडा खुडा."]),
      t("ch-pinch2", 50, "other", ["Second pinching", "दुसरी शेंडा खुडणी"], ["Pinch the side shoots once more for a bushy plant. Do not pinch after this — it delays flowering.", "झुडपासारख्या झाडासाठी बाजूच्या फांद्यांचे शेंडे पुन्हा एकदा खुडा. यानंतर खुडू नका — फुले उशिरा येतात."]),
      t("ch-weed", 30, "weeding", ["Weeding and earthing up", "खुरपणी व भर देणे"], ["Weed and push soil to the base of plants.", "खुरपणी करून झाडांच्या बुंध्याला माती लावा."], 20),
      t("ch-fert", 45, "fertiliser", ["Second fertiliser part", "दुसरा खत हप्ता"], ["Give the next nitrogen part as per your plan.", "नियोजनानुसार नत्राचा पुढचा हप्ता द्या."]),
      t("ch-obs1", 22, "observation", ["Check leaves and roots", "पाने व मुळे तपासा"], ["Look for aphids, leaf miner trails and wilting plants.", "मावा, पाने पोखरणाऱ्या अळीच्या रेषा व मलूल झाडे पाहा."], 7),
    ], [["Wilt and root rot", "मर व मुळकूज"], ["Aphids", "मावा"]]),
    stage("budding", ["Bud formation", "कळी येणे"], 75, 110, ["As days shorten, buds form at shoot tips.", "दिवस लहान होताना फांद्यांच्या टोकांवर कळ्या येतात."], [
      t("ch-stake", 75, "other", ["Support the plants", "झाडांना आधार द्या"], ["Give bamboo stakes or a string net so plants do not fall with the weight of flowers.", "फुलांच्या वजनाने झाडे पडू नयेत म्हणून बांबूचा आधार किंवा दोरीची जाळी द्या."]),
      t("ch-disbud", 85, "other", ["Disbud large-flowered types", "मोठ्या फुलांच्या वाणांच्या कळ्या कमी करा"], ["For big show flowers keep only the top bud; leave loose-flower types as they are.", "मोठ्या फुलांसाठी फक्त वरची कळी ठेवा; सुट्या फुलांच्या वाणांच्या कळ्या तशाच ठेवा."]),
      t("ch-irr1", 76, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 5–7 days once the rains stop.", "पाऊस थांबल्यावर दर 5–7 दिवसांनी पाणी द्या."], 6),
      t("ch-obs2", 80, "observation", ["Check buds", "कळ्या तपासा"], ["Look for thrips and caterpillars in buds.", "कळ्यांत फुलकिडे व अळ्या पाहा."], 7),
    ], [["Thrips in buds", "कळ्यांत फुलकिडे"], ["Bud borer", "कळी पोखरणारी अळी"]]),
    stage("flowering", ["Flowering and picking", "फुलोरा व तोडणी"], 110, 180, ["Flowers open and are picked every 5–7 days.", "फुले उमलतात व दर 5–7 दिवसांनी तोडली जातात."], [
      t("ch-pick", 110, "harvest", ["Pick flowers", "फुले तोडा"], ["Pick fully open flowers in the morning for loose-flower sale; cut sprays when a few flowers are open.", "सुट्या फुलांसाठी पूर्ण उमललेली फुले सकाळी तोडा; स्प्रेसाठी काही फुले उमलल्यावर फांदी कापा."], 6),
      t("ch-irr2", 111, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep moisture steady; avoid wetting flowers.", "ओलावा सारखा ठेवा; फुले ओली करू नका."], 6),
      t("ch-obs3", 115, "observation", ["Check flowers", "फुले तपासा"], ["Remove rotten flowers and keep an eye on aphids.", "कुजलेली फुले काढा व माव्यावर लक्ष ठेवा."], 7),
      t("ch-mother", 160, "other", ["Keep mother plants", "मातृ झाडे राखून ठेवा"], ["Mark healthy plants and keep their suckers for next year's planting.", "निरोगी झाडे खूण करून पुढच्या वर्षीच्या लागवडीसाठी त्यांचे फुटवे राखून ठेवा."]),
    ], [["Flower rot in late rain", "उशिराच्या पावसात फुले कुजणे"]]),
  ],
  flushes: {
    everyDays: 6,
    count: 10,
    note: b("Pick every 5–7 days from October to December; a crop usually gives 8–12 pickings.", "ऑक्टोबर ते डिसेंबर दर 5–7 दिवसांनी तोडणी करा; साधारण 8–12 तोडण्या होतात."),
  },
  varieties: [], // TODO: varieties — confirm Maharashtra-recommended chrysanthemum varieties with MPKV Rahuri / ICAR-DFR Pune
  commonProblems: [
    {
      name: b("Aphids", "मावा"),
      signs: b("Clusters of small soft insects on tender shoots and buds; leaves curl and get sticky.", "कोवळ्या फुटीवर व कळ्यांवर लहान मऊ किड्यांचे थवे; पाने वाकडी व चिकट होतात."),
      prevention: prevent("Check shoots weekly, use yellow sticky traps and remove badly infested tips.", "दर आठवड्याला फूट तपासा, पिवळे चिकट सापळे लावा आणि जास्त बाधित शेंडे काढा."),
    },
    {
      name: b("Thrips", "फुलकिडे"),
      signs: b("Silvery or brown streaks on petals and leaves; flowers look dull and deformed.", "पाकळ्या व पानांवर चंदेरी किंवा तपकिरी रेषा; फुले निस्तेज व विकृत दिसतात."),
      prevention: prevent("Use blue sticky traps, keep the field weed-free and check buds weekly.", "निळे चिकट सापळे लावा, शेत तणमुक्त ठेवा आणि दर आठवड्याला कळ्या तपासा."),
    },
    {
      name: b("Wilt and root rot", "मर व मुळकूज"),
      signs: b("Plants droop, leaves yellow from below, roots and stem base turn brown.", "झाडे मलूल होतात, पाने खालून पिवळी पडतात, मुळे व बुंधा तपकिरी होतो."),
      prevention: prevent("Plant on ridges with good drainage, take cuttings only from healthy plants, rotate the field and remove wilted plants.", "चांगल्या निचऱ्याच्या सरी-वरंब्यावर लागवड करा, फक्त निरोगी झाडांची कलमे घ्या, शेताची फेरपालट करा आणि मर लागलेली झाडे काढा."),
    },
    {
      name: b("Leaf spot", "पानांवरील ठिपके"),
      signs: b("Brown to black spots on lower leaves that spread upwards in humid weather.", "खालच्या पानांवर तपकिरी ते काळे ठिपके, दमट हवेत वर पसरतात."),
      prevention: prevent("Remove spotted lower leaves, keep spacing for air flow and avoid overhead watering.", "ठिपके असलेली खालची पाने काढा, हवा खेळती राहील असे अंतर ठेवा आणि वरून पाणी देणे टाळा."),
    },
  ],
  harvestSigns: b("Loose flowers are picked fully open; cut-flower sprays are cut when the top flowers are open.", "सुटी फुले पूर्ण उमललेली तोडतात; कट-फ्लॉवर स्प्रे वरची फुले उमलल्यावर कापतात."),
  postHarvest: b(
    "Pick in the cool morning, keep in shade and pack loosely in baskets or cartons with air gaps. Cut sprays go into clean water right after cutting and are bunched by length.",
    "सकाळी थंड वेळेत तोडा, सावलीत ठेवा आणि हवा खेळेल अशा प्रकारे टोपल्यांत किंवा खोक्यांत सैल भरा. कापलेले स्प्रे लगेच स्वच्छ पाण्यात ठेवा व लांबीनुसार जुड्या बांधा.",
  ),
  marketTips: b(
    "Demand is high from Dasara to Diwali and through the wedding season. White and yellow loose flowers for garlands sell in bulk in Pune and Mumbai markets; clean, fresh, uniform flowers fetch more.",
    "दसऱ्यापासून दिवाळीपर्यंत व लग्नसराईत मागणी जास्त असते. हारांसाठी पांढरी व पिवळी सुटी फुले पुणे व मुंबईच्या बाजारात मोठ्या प्रमाणात विकली जातात; स्वच्छ, ताज्या, एकसारख्या फुलांना जास्त दर मिळतो.",
  ),
  source: "General practices from ICAR-Directorate of Floricultural Research, Pune and MPKV Rahuri flower crop guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
