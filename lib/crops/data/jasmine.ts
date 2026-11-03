import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Jasmine (mogra): a bush pruned once a year in winter; flowers are picked daily in summer. */
const crop: PerennialCrop = {
  id: "jasmine",
  emoji: "🤍",
  name: b("Jasmine (mogra)", "मोगरा"),
  aliases: ["jasmine", "mogra", "mogara", "mogra flower", "motia", "bela", "मोगरा", "मोगऱ्याची फुले", "मोतिया", "बेला"],
  category: "flower",
  lifecycle: "perennial",
  regions: ["western", "konkan", "north"],
  majorDistricts: b("Pune, Thane, Palghar, Nashik, Satara", "पुणे, ठाणे, पालघर, नाशिक, सातारा"),
  tier: 2,
  plantingWindow: b("June–August, at the start of the rains", "जून–ऑगस्ट, पावसाळ्याच्या सुरुवातीला"),
  plantingMonths: [6, 7, 8],
  plantingMaterial: b("Rooted cuttings or layers from healthy, high-yielding bushes", "निरोगी, भरपूर फुले देणाऱ्या झुडपांपासून तयार केलेली मुळे फुटलेली छाट कलमे किंवा दाब कलमे"),
  spacing: b("1.2 m × 1.2 m to 1.5 m × 1.5 m", "1.2 मी × 1.2 मी ते 1.5 मी × 1.5 मी"),
  plantsPerAcre: [1800, 2800],
  yearsToFirstHarvest: [1, 1],
  economicLifeYears: [10, 15],
  soil: b("Well-drained loamy or red soil with organic matter. Avoid soil where water stands.", "सेंद्रिय पदार्थ असलेली, निचरा होणारी पोयट्याची किंवा तांबडी जमीन. पाणी साचणारी जमीन टाळा."),
  climate: b("Warm, sunny weather. Flowers come mainly in summer (March–June); cold winter makes the bush rest.", "उबदार, उन्हाचे हवामान. फुले मुख्यतः उन्हाळ्यात (मार्च–जून) येतात; थंडीत झुडूप विश्रांती घेते."),
  irrigation: b(
    "Water young plants every 4–6 days. After pruning, water regularly; in the summer flowering season water every 3–5 days or by drip. Do not let water stand at the base.",
    "लहान रोपांना दर 4–6 दिवसांनी पाणी द्या. छाटणीनंतर नियमित पाणी द्या; उन्हाळी फुलांच्या हंगामात दर 3–5 दिवसांनी किंवा ठिबकने पाणी द्या. बुंध्याजवळ पाणी साचू देऊ नका.",
  ),
  nutrientGuide: b(
    "Give well-rotted farmyard manure every year after pruning. Split fertiliser into parts after pruning and during flowering, based on a soil test; ask your agriculture officer for amounts.",
    "दरवर्षी छाटणीनंतर चांगले कुजलेले शेणखत द्या. माती परीक्षणानुसार खते छाटणीनंतर व फुलोऱ्यात हप्त्यांनी द्या; प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  // TODO: varieties — confirm mogra selections recommended for Maharashtra with MPKV Rahuri or ICAR-DFR Pune
  varieties: [],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 60, ["Cuttings settle and send out new roots and shoots.", "कलमे रुजतात व नवीन मुळे व फूट येते."], [
      t("js-pits", 0, "other", ["Plant in pits", "खड्ड्यांत लागवड करा"], ["Fill pits with topsoil and well-rotted manure and plant one cutting per pit.", "खड्डे मातीने व कुजलेल्या शेणखताने भरा आणि प्रत्येक खड्ड्यात एक कलम लावा."]),
      t("js-irr0", 2, "irrigation", ["Water young plants", "लहान रोपांना पाणी द्या"], ["Keep soil moist, not wet, if the rains break.", "पावसात खंड पडल्यास माती ओलसर ठेवा, चिखल नको."], 5),
      t("js-gap", 30, "other", ["Fill gaps", "नांगे भरा"], ["Replace cuttings that have died.", "मेलेल्या कलमांच्या जागी नवीन कलमे लावा."]),
    ], [["Cuttings rotting in waterlogged soil", "पाणी साचल्याने कलमे सडणे"]]),
    stage("bush-building", ["Building the bush", "झुडूप तयार होणे"], 60, 365, ["The bush spreads. Light pinching makes more branches, which means more flowers later.", "झुडूप पसरते. हलकी शेंडा खुडणी केल्याने जास्त फांद्या येतात, म्हणजे पुढे जास्त फुले."], [
      t("js-pinch", 75, "other", ["Pinch shoot tips", "शेंडे खुडा"], ["Pinch long shoots to make the bush bushy.", "लांब फांद्यांचे शेंडे खुडून झुडूप दाट करा."], 45),
      t("js-weed", 70, "weeding", ["Weed around plants", "आळ्यातील तण काढा"], ["Keep the basin clean and mulch it.", "आळे स्वच्छ ठेवा व आच्छादन करा."], 30),
      t("js-irr1", 90, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 5–8 days in the dry months.", "कोरड्या महिन्यांत दर 5–8 दिवसांनी पाणी द्या."], 6),
      t("js-obs0", 80, "observation", ["Check leaves", "पाने तपासा"], ["Look for leaf webbers and mites.", "पाने गुंडाळणारी अळी व कोळी पाहा."], 10),
    ], [["Leaf webber", "पाने जाळी करणारी अळी"], ["Mites", "कोळी"]]),
  ],
  cycles: [
    {
      key: "summer-flowering",
      name: b("Summer flowering (after winter pruning)", "उन्हाळी फुलोरा (हिवाळी छाटणीनंतर)"),
      startMonths: [12, 1],
      startEvent: b("Pruning in late December–January", "डिसेंबर अखेर–जानेवारीत छाटणी"),
      harvestMonths: [3, 4, 5, 6],
      note: b("Most mogra flowers come from March to June. Wedding season and Akshaya Tritiya bring good demand.", "बहुतेक मोगऱ्याची फुले मार्च ते जून येतात. लग्नसराई व अक्षय्य तृतीयेला चांगली मागणी असते."),
      stages: [
        stage("pruning", ["Pruning", "छाटणी"], 0, 15, ["Branches are cut back so new flowering shoots come.", "नवीन फुलांच्या फांद्या याव्यात म्हणून फांद्या छाटल्या जातात."], [
          t("jsf-prune", 0, "other", ["Prune the bushes", "झुडपांची छाटणी करा"], ["Cut branches back to about half their height; remove dry and weak branches.", "फांद्या साधारण अर्ध्या उंचीपर्यंत छाटा; वाळलेल्या व कमजोर फांद्या काढा."]),
          t("jsf-fym", 3, "fertiliser", ["Give manure", "शेणखत द्या"], ["Loosen the basin and give well-rotted manure, then the first fertiliser part as planned.", "आळे भुसभुशीत करून कुजलेले शेणखत द्या, मग नियोजनानुसार पहिला खत हप्ता द्या."]),
          t("jsf-irr1", 4, "irrigation", ["Water after manuring", "खतानंतर पाणी द्या"], ["Give a good watering to wake the buds.", "डोळे फुटावेत म्हणून भरपूर पाणी द्या."]),
        ], [["Dieback on cut branches", "छाटलेल्या फांद्या सुकणे"]]),
        stage("new-shoots", ["New shoots", "नवी फूट"], 15, 60, ["Fresh shoots grow; flower buds form at their tips.", "नवी फूट वाढते; टोकांवर कळ्या तयार होतात."], [
          t("jsf-irr2", 15, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 5–7 days.", "दर 5–7 दिवसांनी पाणी द्या."], 6),
          t("jsf-obs1", 20, "observation", ["Check new shoots", "नवी फूट तपासा"], ["Look for bud worm and webbing on tender shoots.", "कोवळ्या फुटीवर कळी अळी व जाळी पाहा."], 7),
          t("jsf-weed", 25, "weeding", ["Weed the basins", "आळी खुरपा"], ["Keep basins clean.", "आळी स्वच्छ ठेवा."]),
        ], [["Bud worm", "कळी अळी"]]),
        stage("picking", ["Flower picking", "फुलांची तोडणी"], 60, 180, ["Buds are picked every day for about 3–4 months.", "साधारण 3–4 महिने रोज कळ्या तोडल्या जातात."], [
          t("jsf-pick", 60, "harvest", ["Pick buds", "कळ्या तोडा"], ["Pick fully grown, unopened buds early in the morning.", "पूर्ण वाढलेल्या, न उमललेल्या कळ्या सकाळी लवकर तोडा."], 1),
          t("jsf-irr3", 61, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 3–5 days in the summer heat.", "उन्हाळ्यात दर 3–5 दिवसांनी पाणी द्या."], 4),
          t("jsf-fert2", 75, "fertiliser", ["Next fertiliser part", "पुढचा खत हप्ता"], ["Give a small part during flowering as planned.", "नियोजनानुसार फुलोऱ्यात छोटा हप्ता द्या."], 30),
          t("jsf-obs2", 65, "observation", ["Check buds", "कळ्या तपासा"], ["Look for bored buds and mites; remove damaged buds.", "पोखरलेल्या कळ्या व कोळी पाहा; खराब कळ्या काढा."], 7),
        ], [["Bud worm", "कळी अळी"], ["Mites", "कोळी"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Bud worm", "कळी अळी"),
      signs: b("Small holes in buds; buds turn brown and drop before opening.", "कळ्यांना लहान छिद्रे; कळ्या तपकिरी होऊन उमलण्याआधीच गळतात."),
      prevention: prevent("Pick and destroy bored buds daily and keep the area clean.", "पोखरलेल्या कळ्या रोज तोडून नष्ट करा व परिसर स्वच्छ ठेवा."),
    },
    {
      name: b("Leaf webber", "पाने जाळी करणारी अळी"),
      signs: b("Leaves webbed together at shoot tips with caterpillars inside.", "शेंड्यांवरील पाने जाळीने एकत्र बांधलेली व आत अळ्या."),
      prevention: prevent("Cut and destroy webbed shoots early.", "जाळी झालेले शेंडे लवकर कापून नष्ट करा."),
    },
    {
      name: b("Mites", "कोळी"),
      signs: b("Leaves turn pale with fine dots and webbing underneath, mostly in hot dry weather.", "पाने फिकट, खालच्या बाजूला बारीक ठिपके व जाळी, मुख्यतः उष्ण कोरड्या हवेत."),
      prevention: prevent("Water regularly, keep dust down and remove badly affected shoots.", "नियमित पाणी द्या, धूळ कमी ठेवा आणि जास्त बाधित फांद्या काढा."),
    },
  ],
  harvestSigns: b("Pick fully grown buds that are still closed, early in the morning before the sun is hot.", "पूर्ण वाढलेल्या पण बंद कळ्या सकाळी लवकर, ऊन तापण्याआधी तोडा."),
  postHarvest: b(
    "Keep picked buds in shade in a wet cloth or bamboo basket; do not press them. Send to market the same morning.",
    "तोडलेल्या कळ्या सावलीत ओल्या कापडात किंवा बांबूच्या टोपलीत ठेवा; दाबू नका. त्याच सकाळी बाजारात पाठवा.",
  ),
  marketTips: b(
    "Prices are best in the wedding season and on festival days. Selling by weight to garland makers and flower traders in Pune, Mumbai and Nashik markets is common; fresh, white, unopened buds get the best rate.",
    "लग्नसराई व सणांच्या दिवशी दर चांगले मिळतात. पुणे, मुंबई व नाशिकच्या बाजारात हार बनवणारे व फूल व्यापारी वजनावर खरेदी करतात; ताज्या, पांढऱ्या, न उमललेल्या कळ्यांना सर्वाधिक दर मिळतो.",
  ),
  source: "General practices from MPKV Rahuri and ICAR-Directorate of Floricultural Research, Pune",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
