import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** China aster: short nursery-raised flower crop for loose flowers and cut flowers. */
const crop: SeasonalCrop = {
  id: "aster",
  emoji: "🌸",
  name: b("China aster", "ॲस्टर"),
  aliases: ["aster", "china aster", "aster flower", "ॲस्टर", "अॅस्टर", "एस्टर", "ऍस्टर"],
  category: "flower",
  lifecycle: "seasonal",
  regions: ["western", "north"],
  majorDistricts: b("Pune, Satara, Nashik", "पुणे, सातारा, नाशिक"),
  tier: 2,
  seasons: [
    { season: "rabi", label: b("Rabi (main)", "रब्बी (मुख्य)"), sowingWindow: b("Nursery in September–October; flowers December–February", "रोपवाटिका सप्टेंबर–ऑक्टोबर; डिसेंबर–फेब्रुवारी फुले"), sowingMonths: [9, 10], durationDays: [110, 130] },
    { season: "kharif", label: b("Kharif", "खरीप"), sowingWindow: b("Nursery in June–July for flowers around Ganesh festival and Navratri; needs good drainage", "गणेशोत्सव व नवरात्रीसाठी रोपवाटिका जून–जुलै; चांगला निचरा आवश्यक"), sowingMonths: [6, 7], durationDays: [100, 120] },
  ],
  method: "transplant",
  plantingMaterial: b("Seed, raised as seedlings in a nursery", "बियाणे; रोपवाटिकेत रोपे तयार करून"),
  nurseryDays: 30,
  soil: b(
    "Well-drained, light to medium soil with good organic matter. Avoid fields where aster or wilt was a problem last season.",
    "चांगले सेंद्रिय पदार्थ असलेली, निचरा होणारी हलकी ते मध्यम जमीन. मागील हंगामात ॲस्टर किंवा मर रोग आलेले शेत टाळा.",
  ),
  climate: b(
    "Mild winter weather gives the best flowers. Heavy rain spoils flowers and spreads wilt.",
    "सौम्य हिवाळी हवामानात सर्वोत्तम फुले येतात. जोरदार पावसात फुले खराब होतात व मर रोग पसरतो.",
  ),
  seedRate: b("A few hundred grams of seed per acre is enough; follow the seed packet.", "एकरी काहीशे ग्रॅम बियाणे पुरेसे; पाकिटावरील सूचना पाहा."),
  spacing: b("30 cm × 30 cm, or 45 cm × 30 cm for taller cut-flower types.", "30 सेंमी × 30 सेंमी, उंच कट-फ्लॉवर वाणांसाठी 45 सेंमी × 30 सेंमी."),
  irrigation: b(
    "Water right after transplanting, then every 5–7 days in rabi. Avoid waterlogging at any stage.",
    "पुनर्लागवडीनंतर लगेच पाणी, नंतर रब्बीत दर 5–7 दिवसांनी. कोणत्याही अवस्थेत पाणी साचू देऊ नका.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure or compost before transplanting. Give nitrogen in 2 parts — at transplanting and about a month later. Ask your agriculture officer for amounts.",
    "पुनर्लागवडीपूर्वी चांगले कुजलेले शेणखत किंवा कंपोस्ट मिसळा. नत्र 2 हप्त्यांत द्या — पुनर्लागवडीवेळी व साधारण महिन्याने. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("nursery", ["Nursery", "रोपवाटिका"], 0, 30, ["Seeds sprout on raised beds and grow into seedlings.", "गादीवाफ्यावर बी उगवून रोपे तयार होतात."], [
      t("as-bed", 0, "sowing", ["Prepare beds and sow", "वाफे तयार करून पेरणी करा"], ["Sow thinly in lines on raised beds and cover with fine soil.", "गादीवाफ्यावर ओळीत विरळ बी पेरा व बारीक मातीने झाका."]),
      t("as-nwater", 1, "irrigation", ["Water lightly", "हलके पाणी द्या"], ["Use a can; don't keep beds soggy.", "झारीने पाणी द्या; वाफे सतत ओले ठेवू नका."], 2),
      t("as-ready", 25, "observation", ["Check seedlings", "रोपे तपासा"], ["Seedlings with 3–4 leaves are ready to plant.", "3–4 पानांची रोपे लागवडीस तयार."]),
    ], [["Damping off", "रोपे कोलमडणे"]]),
    stage("transplanting", ["Transplanting and growth", "पुनर्लागवड व वाढ"], 30, 70, ["Seedlings are planted out and grow into bushy plants.", "रोपे शेतात लावली जातात व झुडपासारखी वाढतात."], [
      t("as-tp", 30, "transplanting", ["Transplant seedlings", "रोपांची पुनर्लागवड करा"], ["Plant in the evening on ridges or beds and water right away.", "संध्याकाळी सरी-वरंब्यावर किंवा वाफ्यांत लावा व लगेच पाणी द्या."]),
      t("as-irr1", 33, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 5–7 days.", "दर 5–7 दिवसांनी पाणी द्या."], 6),
      t("as-weed", 45, "weeding", ["Weed and earth up", "खुरपणी व भर देणे"], ["Weed and push soil to plant bases.", "खुरपणी करून बुंध्याला माती लावा."], 20),
      t("as-fert", 60, "fertiliser", ["Second nitrogen part", "नत्राचा दुसरा हप्ता"], ["Give the second part as planned.", "नियोजनानुसार दुसरा हप्ता द्या."]),
    ], [["Wilt", "मर रोग"], ["Aphids", "मावा"]]),
    stage("budding", ["Bud formation", "कळी येणे"], 70, 90, ["Buds form on branch tips.", "फांद्यांच्या टोकांवर कळ्या येतात."], [
      t("as-obs1", 70, "observation", ["Check buds and leaves", "कळ्या व पाने तपासा"], ["Look for aphids, thrips and wilting plants.", "मावा, फुलकिडे व मलूल झाडे पाहा."], 7),
      t("as-irr2", 71, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Steady moisture gives good flowers.", "सारख्या ओलाव्याने चांगली फुले येतात."], 6),
      t("as-stake", 75, "other", ["Support tall plants", "उंच झाडांना आधार द्या"], ["Earth up or stake cut-flower types.", "कट-फ्लॉवर वाणांना भर द्या किंवा आधार द्या."]),
    ], [["Thrips and aphids", "फुलकिडे व मावा"]]),
    stage("flowering", ["Flowering and picking", "फुलोरा व तोडणी"], 90, 130, ["Flowers open and are picked for 4–6 weeks.", "फुले उमलतात व 4–6 आठवडे तोडली जातात."], [
      t("as-pick", 90, "harvest", ["Pick flowers", "फुले तोडा"], ["Pick fully open loose flowers, or cut whole plants or stems when most flowers are open.", "पूर्ण उमललेली सुटी फुले तोडा किंवा बहुतेक फुले उमलल्यावर संपूर्ण झाड किंवा फांद्या कापा."], 4),
      t("as-irr3", 91, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep moisture even through picking.", "तोडणीच्या काळात ओलावा सारखा ठेवा."], 6),
      t("as-obs2", 95, "observation", ["Remove wilted plants", "मर लागलेली झाडे काढा"], ["Pull out and destroy wilted plants so the disease does not spread.", "रोग पसरू नये म्हणून मर लागलेली झाडे उपटून नष्ट करा."], 7),
    ], [["Flower rot in rain", "पावसात फुले कुजणे"]]),
  ],
  flushes: {
    everyDays: 4,
    count: 8,
    note: b("Pick every 3–5 days for about a month once flowering starts.", "फुलोरा सुरू झाल्यावर साधारण महिनाभर दर 3–5 दिवसांनी तोडणी करा."),
  },
  varieties: [
    { name: "Phule Ganesh White", note: b("White China aster released by MPKV Rahuri", "मफुकृवि राहुरीचा पांढरा ॲस्टर वाण") },
    { name: "Phule Ganesh Pink", note: b("Pink China aster released by MPKV Rahuri", "मफुकृवि राहुरीचा गुलाबी ॲस्टर वाण") },
  ],
  commonProblems: [
    {
      name: b("Wilt", "मर रोग"),
      signs: b("Plants droop suddenly, the stem base turns dark and the plant dries.", "झाडे अचानक मलूल होतात, बुंधा काळा पडतो व झाड सुकते."),
      prevention: prevent("Rotate fields (do not grow aster in the same field every year), use raised beds with drainage and remove wilted plants.", "शेताची फेरपालट करा (दरवर्षी त्याच शेतात ॲस्टर घेऊ नका), निचऱ्यासह गादीवाफे वापरा आणि मर लागलेली झाडे काढा."),
    },
    {
      name: b("Aphids and thrips", "मावा व फुलकिडे"),
      signs: b("Curled, sticky leaves and streaked, deformed flowers.", "वाकडी, चिकट पाने आणि रेषा असलेली, विकृत फुले."),
      prevention: prevent("Use yellow and blue sticky traps and check plants weekly.", "पिवळे व निळे चिकट सापळे लावा आणि दर आठवड्याला झाडे तपासा."),
    },
  ],
  harvestSigns: b("Loose flowers are picked when fully open; for cut flowers, cut stems when the first flowers on them are open.", "सुटी फुले पूर्ण उमलल्यावर तोडतात; कट-फ्लॉवरसाठी फांदीवरील पहिली फुले उमलल्यावर कापतात."),
  postHarvest: b(
    "Pick in cool hours, keep in shade and pack loosely in baskets. Put cut stems in water and bunch them.",
    "थंड वेळेत तोडा, सावलीत ठेवा आणि टोपल्यांत सैल भरा. कापलेल्या फांद्या पाण्यात ठेवून जुड्या बांधा.",
  ),
  marketTips: b(
    "Used widely in garlands, veni and bouquets; white, pink and violet colours sell well together. Prices rise in the wedding season and festivals.",
    "हार, वेणी व गुच्छांमध्ये मोठ्या प्रमाणात वापर; पांढरा, गुलाबी व जांभळा रंग एकत्र चांगले विकतात. लग्नसराई व सणांना दर वाढतात.",
  ),
  source: "General practices from MPKV Rahuri and ICAR-Directorate of Floricultural Research, Pune flower crop guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
