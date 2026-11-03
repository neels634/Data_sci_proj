import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/**
 * Papaya is treated as a short-lived perennial: first fruit about 9–10 months after planting,
 * then about 1–1.5 years of continuous picking before the orchard is replaced.
 */
const crop: PerennialCrop = {
  id: "papaya",
  emoji: "🟠",
  name: b("Papaya", "पपई"),
  aliases: ["papaya", "papaiya", "papai", "papita", "papeeta", "पपई", "पपया", "पपीता"],
  category: "fruit",
  lifecycle: "perennial",
  regions: ["western", "north", "marathwada", "vidarbha"],
  tier: 2,
  plantingWindow: b("June–July, September–October or February–March (seedlings 45–60 days old)", "जून–जुलै, सप्टेंबर–ऑक्टोबर किंवा फेब्रुवारी–मार्च (45–60 दिवसांची रोपे)"),
  plantingMonths: [6, 7, 9, 10, 2, 3],
  plantingMaterial: b("Seedlings raised in bags or trays from good seed (buy from a licensed dealer)", "चांगल्या बियाण्यापासून पिशवीत किंवा ट्रेमध्ये तयार केलेली रोपे (परवानाधारक विक्रेत्याकडून बियाणे घ्या)"),
  spacing: b("1.8–2 m between rows and 1.8–2 m between plants", "दोन ओळींत 1.8–2 मीटर व दोन रोपांत 1.8–2 मीटर"),
  plantsPerAcre: [1000, 1250],
  yearsToFirstHarvest: [1, 1],
  economicLifeYears: [2, 3],
  soil: b(
    "Light to medium, very well-drained soil. Papaya dies quickly if water stands at the stem even for a day; plant on raised beds.",
    "हलकी ते मध्यम, पाण्याचा उत्तम निचरा होणारी जमीन. खोडाजवळ एक दिवस जरी पाणी साचले तरी पपई लवकर मरते; गादीवाफ्यावर लागवड करा.",
  ),
  climate: b(
    "Warm weather without frost. Strong wind breaks plants; cold winters slow growth and sweetness.",
    "धुके-गारठा नसलेले उबदार हवामान. जोरदार वाऱ्याने झाडे मोडतात; थंड हिवाळ्यात वाढ व गोडी कमी होते.",
  ),
  irrigation: b(
    "Drip irrigation on raised beds is best. Give light water often — every 3–4 days in summer and 8–10 days in winter. Never let water touch or stand at the stem.",
    "गादीवाफ्यावर ठिबक सिंचन उत्तम. हलके व वारंवार पाणी द्या — उन्हाळ्यात दर 3–4 दिवसांनी, हिवाळ्यात दर 8–10 दिवसांनी. पाणी खोडाला लागू किंवा साचू देऊ नका.",
  ),
  nutrientGuide: b(
    "Papaya feeds heavily. Mix well-rotted farmyard manure in the pit and give fertiliser in small parts every 1–2 months, as per soil test. Ask your agriculture officer for amounts.",
    "पपईला अन्नद्रव्ये जास्त लागतात. खड्ड्यात चांगले कुजलेले शेणखत मिसळा आणि माती परीक्षणानुसार दर 1–2 महिन्यांनी थोडे थोडे खत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Red Lady (Taiwan 786)", note: b("Widely grown hybrid; plants bear fruit without needing male trees", "सर्वाधिक लागवडीचा संकरित वाण; नर झाडांची गरज न पडता फळे लागतात") },
    { name: "Pusa Nanha", note: b("Dwarf variety from ICAR-IARI New Delhi", "ICAR-IARI नवी दिल्लीचा बुटका वाण") },
    { name: "Coorg Honey Dew", note: b("From ICAR-IIHR; plants bear fruit without needing male trees", "ICAR-IIHR चा वाण; नर झाडांची गरज न पडता फळे लागतात") },
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Seedlings are planted on raised beds and take root.", "रोपे गादीवाफ्यावर लावली जातात व मूळ धरतात."], [
      t("pp-plant", 0, "transplanting", ["Plant seedlings on raised beds", "गादीवाफ्यावर रोपे लावा"], ["Plant 45–60 day old seedlings in the evening. For varieties with male and female trees, plant 2–3 seedlings per spot.", "45–60 दिवसांची रोपे संध्याकाळी लावा. नर-मादी झाडे होणाऱ्या वाणात एका जागी 2–3 रोपे लावा."]),
      t("pp-irr0", 1, "irrigation", ["Water lightly", "हलके पाणी द्या"], ["Keep soil moist; do not let water stand near the stem.", "माती ओलसर ठेवा; खोडाजवळ पाणी साचू देऊ नका."], 3),
      t("pp-gap", 15, "other", ["Replace dead seedlings", "मेलेली रोपे बदला"], ["Fill gaps quickly so all plants fruit together.", "सर्व झाडांना एकाच वेळी फळे यावीत म्हणून खाडे लवकर भरा."]),
    ], [["Seedlings rotting at the base", "रोपे बुंध्याजवळ कुजणे"], ["Aphids and whitefly carrying virus", "विषाणू पसरवणारा मावा व पांढरी माशी"]]),
    stage("vegetative", ["Leaf and stem growth", "पाने व खोडाची वाढ"], 30, 120, ["The plant grows fast and builds a thick stem.", "झाड झपाट्याने वाढते व खोड जाड होते."], [
      t("pp-irr1", 30, "irrigation", ["Irrigate", "पाणी द्या"], ["Light, regular drip water.", "हलके, नियमित ठिबक पाणी."], 5),
      t("pp-fert1", 45, "fertiliser", ["Give fertiliser part", "खताचा हप्ता द्या"], ["Give a small part every 1–2 months as per your plan.", "नियोजनानुसार दर 1–2 महिन्यांनी थोडा हप्ता द्या."], 45),
      t("pp-obs1", 35, "observation", ["Check leaves", "पाने तपासा"], ["Look for mottled, curled leaves (virus) and white mealybugs. Pull out and destroy virus plants early.", "चट्टेदार, आकसलेली पाने (विषाणू) व पांढरे पिठ्या ढेकूण पाहा. विषाणूग्रस्त झाडे लवकर उपटून नष्ट करा."], 7),
      t("pp-weed", 40, "weeding", ["Weed the beds", "वाफे खुरपा"], ["Weeds harbour virus-carrying insects. Keep beds clean.", "तणांवर विषाणू पसरवणाऱ्या किडी राहतात. वाफे स्वच्छ ठेवा."], 30),
    ], [["Ring spot virus", "पपई रिंग स्पॉट विषाणू"], ["Mealybugs", "पिठ्या ढेकूण"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 120, 180, ["Flowers appear at the leaf joints. In male-female varieties you can now tell the trees apart.", "पानांच्या बेचक्यात फुले येतात. नर-मादी वाणात आता झाडे ओळखता येतात."], [
      t("pp-sex", 125, "other", ["Keep one plant per spot", "एका जागी एकच झाड ठेवा"], ["In male-female varieties, keep one female plant per spot and about one male for every 10 females; remove the rest.", "नर-मादी वाणात एका जागी एक मादी झाड ठेवा आणि साधारण 10 मादी झाडांमागे एक नर ठेवा; बाकीची काढा."]),
      t("pp-irr2", 120, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Water stress now makes flowers drop.", "आता पाण्याचा ताण पडल्यास फुले गळतात."], 4),
      t("pp-stake", 150, "other", ["Support plants against wind", "वाऱ्यापासून झाडांना आधार द्या"], ["Stake plants or plant a windbreak on the windy side.", "झाडांना काठीचा आधार द्या किंवा वाऱ्याच्या बाजूला वारा-अडथळा लावा."]),
    ], [["Flower drop in heat or water stress", "उष्णता किंवा पाण्याच्या ताणाने फुलगळ"]]),
    stage("fruit-set", ["Fruit set and growth", "फळधारणा व वाढ"], 180, 280, ["Fruits form on the stem and grow until the first ones ripen.", "खोडावर फळे लागतात व पहिली फळे पिकेपर्यंत वाढतात."], [
      t("pp-irr3", 180, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water for fruit growth; keep the stem dry.", "फळवाढीसाठी नियमित पाणी; खोड कोरडे ठेवा."], 4),
      t("pp-thin", 200, "other", ["Thin crowded fruit", "दाटीची फळे विरळ करा"], ["Remove misshapen fruit and some fruit where they are pressed together.", "वेडीवाकडी फळे आणि एकमेकांवर दाबलेल्या ठिकाणची काही फळे काढा."]),
      t("pp-obs2", 185, "observation", ["Check fruit and stem", "फळे व खोड तपासा"], ["Look for virus, mealybugs and rot at the stem base.", "विषाणू, पिठ्या ढेकूण व बुंध्याजवळील सड पाहा."], 7),
    ], [["Stem base rot after rain", "पावसानंतर बुंधा कुजणे"]]),
  ],
  cycles: [
    {
      key: "picking",
      name: b("Continuous picking", "सलग तोडणी"),
      startMonths: [3, 4, 6, 7, 11, 12],
      startEvent: b("First fruits turn yellow, about 9–10 months after planting", "पहिली फळे पिवळी होतात, लागवडीनंतर साधारण 9–10 महिन्यांनी"),
      harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      note: b("Fruits are picked every week for about a year or more. Yield and quality fall in the second year, and virus spreads, so most farmers replace the orchard after 2–3 years.", "साधारण वर्षभर किंवा जास्त दर आठवड्याला फळे तोडली जातात. दुसऱ्या वर्षी उत्पादन व दर्जा घटतो आणि विषाणू वाढतो, त्यामुळे बहुतेक शेतकरी 2–3 वर्षांनी बाग बदलतात."),
      stages: [
        stage("early-picking", ["First pickings", "सुरुवातीची तोडणी"], 0, 90, ["The lowest fruits ripen first; new fruits keep setting above.", "सर्वात खालची फळे आधी पिकतात; वर नवी फळे लागत राहतात."], [
          t("ppc-pick1", 0, "harvest", ["Pick ripening fruit", "पिकू लागलेली फळे तोडा"], ["Pick when yellow streaks appear on the fruit.", "फळावर पिवळ्या रेषा दिसू लागल्या की तोडा."], 7),
          t("ppc-irr1", 0, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep watering regularly while picking.", "तोडणी चालू असताना नियमित पाणी द्या."], 4),
          t("ppc-fert1", 15, "fertiliser", ["Keep feeding", "खत देत राहा"], ["Continue small fertiliser parts every 1–2 months.", "दर 1–2 महिन्यांनी थोडे खत देत राहा."], 45),
        ], [["Fruit fly on ripening fruit", "पिकणाऱ्या फळांवर फळमाशी"]]),
        stage("peak-picking", ["Peak picking", "मुख्य तोडणी"], 90, 270, ["Most of the crop is picked now.", "बहुतेक उत्पादन आता तोडले जाते."], [
          t("ppc-pick2", 90, "harvest", ["Pick every week", "दर आठवड्याला तोडणी करा"], ["Pick at the yellow-streak stage and handle gently.", "पिवळ्या रेषांच्या अवस्थेत तोडा व हळुवार हाताळा."], 7),
          t("ppc-obs1", 92, "observation", ["Check for virus and mealybug", "विषाणू व पिठ्या ढेकूण तपासा"], ["Remove badly infected plants so the disease does not spread.", "रोग पसरू नये म्हणून जास्त बाधित झाडे काढा."], 14),
          t("ppc-irr2", 90, "irrigation", ["Irrigate", "पाणी द्या"], ["Even, regular water.", "सारखे, नियमित पाणी."], 4),
        ], [["Ring spot virus", "पपई रिंग स्पॉट विषाणू"], ["Mealybugs", "पिठ्या ढेकूण"]]),
        stage("late-picking", ["Late picking", "शेवटची तोडणी"], 270, 365, ["Plants are tall, fruits get smaller; plan the next orchard.", "झाडे उंच होतात, फळे लहान होतात; पुढच्या बागेचे नियोजन करा."], [
          t("ppc-pick3", 270, "harvest", ["Pick remaining fruit", "उरलेली फळे तोडा"], ["Continue weekly picking.", "दर आठवड्याची तोडणी सुरू ठेवा."], 7),
          t("ppc-plan", 300, "observation", ["Plan replanting", "नवी लागवड नियोजित करा"], ["Raise new seedlings for a fresh orchard on a different plot.", "दुसऱ्या शेतात नव्या बागेसाठी रोपे तयार करा."]),
        ], [["Falling yield and virus spread", "घटते उत्पादन व विषाणूचा प्रसार"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Papaya ring spot virus", "पपई रिंग स्पॉट विषाणू"),
      signs: b("Leaves mottled, curled and narrow; oily streaks on the stem; ring spots on fruit. Spread by aphids.", "पाने चट्टेदार, आकसलेली व अरुंद; खोडावर तेलकट रेषा; फळांवर गोल ठिपके. मावा हा रोग पसरवतो."),
      prevention: prevent("Raise seedlings under insect net, keep the field weed-free, avoid planting next to cucurbits, and pull out and destroy infected plants early.", "रोपे कीटकरोधक जाळीखाली तयार करा, शेत तणमुक्त ठेवा, वेलवर्गीय पिकांशेजारी लागवड टाळा आणि विषाणूग्रस्त झाडे लवकर उपटून नष्ट करा."),
    },
    {
      name: b("Papaya mealybug", "पिठ्या ढेकूण"),
      signs: b("White cottony insects on leaves, stem and fruit; leaves curl and fruit is spoiled by sooty mould.", "पाने, खोड व फळांवर पांढरे कापसासारखे किडे; पाने आकसतात व काळ्या बुरशीने फळे खराब होतात."),
      prevention: prevent("Check plants weekly, remove and destroy affected leaves, and keep weeds down.", "दर आठवड्याला झाडे तपासा, बाधित पाने काढून नष्ट करा आणि तण नियंत्रणात ठेवा."),
    },
    {
      name: b("Stem and root rot", "खोड व मूळ कुजणे"),
      signs: b("Water-soaked rot at the stem base; leaves droop and the plant falls over.", "खोडाच्या बुडाशी पाणथळ सड; पाने मलूल होतात व झाड कोसळते."),
      prevention: prevent("Plant on raised beds, never let water touch the stem, and remove rotted plants with their roots.", "गादीवाफ्यावर लागवड करा, पाणी खोडाला लागू देऊ नका आणि कुजलेली झाडे मुळांसकट काढा."),
    },
  ],
  harvestSigns: b(
    "Yellow streaks appear on the green fruit and the latex becomes watery. For distant markets pick at this stage; for local sale pick when a quarter of the skin is yellow.",
    "हिरव्या फळावर पिवळ्या रेषा येतात आणि चीक पाण्यासारखा पातळ होतो. लांबच्या बाजारासाठी याच अवस्थेत तोडा; स्थानिक विक्रीसाठी साल एक चतुर्थांश पिवळी झाल्यावर तोडा.",
  ),
  postHarvest: b(
    "Wrap each fruit in newspaper, pack in a single layer in crates with padding, and keep in shade. Fruits ripen in 3–5 days at room temperature.",
    "प्रत्येक फळ वर्तमानपत्रात गुंडाळा, गादी घालून क्रेटमध्ये एका थरात भरा आणि सावलीत ठेवा. खोलीच्या तापमानात फळे 3–5 दिवसांत पिकतात.",
  ),
  marketTips: b(
    "Uniform, unmarked fruit sells best. Prices swing a lot; selling to city traders or juice and jam makers through your Mandi Mitra helps avoid gluts.",
    "एकसारख्या, डागरहित फळांना चांगला दर मिळतो. दर खूप चढउतार होतात; मंडी मित्रामार्फत शहरातील व्यापारी किंवा ज्यूस-जॅम उद्योगांना विकल्यास आवक जास्त असतानाचा तोटा टळतो.",
  ),
  source: "General practices from MPKV Rahuri and ICAR-IIHR papaya guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
