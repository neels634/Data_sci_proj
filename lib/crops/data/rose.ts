import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Rose: open-field roses are pruned once or twice a year; polyhouse cut roses are picked all year with bending. */
const crop: PerennialCrop = {
  id: "rose",
  emoji: "🌹",
  name: b("Rose", "गुलाब"),
  aliases: ["rose", "roses", "rose flower", "gulab", "gulaab", "गुलाब", "गुलाबाचे फूल"],
  category: "flower",
  lifecycle: "perennial",
  regions: ["western", "north"],
  majorDistricts: b("Pune (Maval, Talegaon), Nashik, Satara, Sangli", "पुणे (मावळ, तळेगाव), नाशिक, सातारा, सांगली"),
  tier: 1,
  plantingWindow: b("Open field: June–October, best after the heavy rains (September–October). Polyhouse: any time except the hottest months.", "उघड्या शेतात: जून–ऑक्टोबर, जोरदार पावसानंतर (सप्टेंबर–ऑक्टोबर) उत्तम. पॉलीहाऊसमध्ये: कडक उन्हाळ्याचे महिने सोडून कधीही."),
  plantingMonths: [6, 7, 8, 9, 10],
  plantingMaterial: b("Budded or grafted plants on a hardy rootstock from a registered nursery; polyhouse growers use plants of named cut-rose varieties", "नोंदणीकृत रोपवाटिकेतील काटक खुंटावर डोळा भरलेली किंवा कलम केलेली रोपे; पॉलीहाऊससाठी नावाजलेल्या कट-रोज वाणांची रोपे"),
  spacing: b("Open field: 90 cm × 60 cm or 75 cm × 60 cm. Polyhouse: double rows on raised beds, about 6–7 plants per square metre of house.", "उघड्या शेतात: 90 सेंमी × 60 सेंमी किंवा 75 सेंमी × 60 सेंमी. पॉलीहाऊसमध्ये: गादीवाफ्यावर जोडओळ, घराच्या प्रति चौरस मीटर साधारण 6–7 रोपे."),
  plantsPerAcre: [7000, 28000],
  yearsToFirstHarvest: [0, 1],
  economicLifeYears: [5, 10],
  soil: b(
    "Well-drained, loamy or medium soil rich in organic matter. Roses do not like waterlogging or salty water.",
    "सेंद्रिय पदार्थांनी समृद्ध, निचरा होणारी पोयट्याची किंवा मध्यम जमीन. गुलाबाला पाणी साचणे व खारे पाणी आवडत नाही.",
  ),
  climate: b(
    "Sunny days with cool nights give the best flowers; the Pune–Nashik plateau suits it well. Heavy rain and high humidity raise black spot and mildew; very hot weather gives small flowers.",
    "उन्हाचे दिवस व थंड रात्री असल्यास सर्वोत्तम फुले येतात; पुणे–नाशिकचे पठार योग्य. जोरदार पाऊस व जास्त दमटपणात काळे ठिपके व भुरी वाढते; कडक उष्णतेत फुले लहान येतात.",
  ),
  irrigation: b(
    "Drip irrigation is best. Water every 3–4 days in summer and 7–10 days in winter in the open field; in a polyhouse give small amounts daily. Hold water for a few days before pruning.",
    "ठिबक सिंचन उत्तम. उघड्या शेतात उन्हाळ्यात दर 3–4 दिवसांनी व हिवाळ्यात दर 7–10 दिवसांनी पाणी द्या; पॉलीहाऊसमध्ये रोज थोडे पाणी द्या. छाटणीपूर्वी काही दिवस पाणी थांबवा.",
  ),
  nutrientGuide: b(
    "Give well-rotted farmyard manure or compost after each pruning. Split fertiliser into small regular doses through the flowering period (through drip in a polyhouse). Base it on soil and water tests; ask your agriculture officer for amounts.",
    "प्रत्येक छाटणीनंतर चांगले कुजलेले शेणखत किंवा कंपोस्ट द्या. फुलोऱ्याच्या काळात खते थोड्या-थोड्या प्रमाणात नियमित द्या (पॉलीहाऊसमध्ये ठिबकमधून). माती व पाणी परीक्षणावर आधारित खत द्या; प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Gladiator", note: b("Red rose widely grown in the open field for the loose-flower and local cut-flower trade", "सुट्या फुलांसाठी व स्थानिक कट-फ्लॉवरसाठी उघड्या शेतात मोठ्या प्रमाणात घेतला जाणारा लाल गुलाब") },
    { name: "Top Secret", note: b("Red cut-rose variety commonly grown in polyhouses", "पॉलीहाऊसमध्ये सामान्यपणे घेतला जाणारा लाल कट-रोज वाण") },
    // TODO: varieties — confirm current open-field and polyhouse rose varieties for Maharashtra with ICAR-DFR Pune
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Plants are set in beds or pits and start new roots and shoots.", "रोपे वाफ्यांत किंवा खड्ड्यांत लावली जातात व नवीन मुळे व फूट येते."], [
      t("rs-plant", 0, "other", ["Plant in prepared beds", "तयार वाफ्यांत लागवड करा"], ["Mix manure into pits or raised beds. Keep the bud joint just above the soil and press soil firmly.", "खड्ड्यांत किंवा गादीवाफ्यांत शेणखत मिसळा. डोळ्याचा जोड मातीच्या थोडा वर ठेवा व माती घट्ट दाबा."]),
      t("rs-irr0", 1, "irrigation", ["Water young plants", "लहान रोपांना पाणी द्या"], ["Keep the soil moist, not wet, until new shoots come.", "नवीन फूट येईपर्यंत माती ओलसर ठेवा, चिखल नको."], 3),
      t("rs-stock", 20, "other", ["Remove rootstock shoots", "खुंटावरील फूट काढा"], ["Rub off shoots coming from below the bud joint.", "डोळ्याच्या जोडाखालून येणारी फूट काढून टाका."]),
    ], [["Plants drying after planting", "लागवडीनंतर रोपे सुकणे"], ["Termites at roots", "मुळांना वाळवी"]]),
    stage("young-plant", ["Building the plant", "झाडाची बांधणी"], 30, 150, ["The plant builds strong canes. Early buds are pinched (in a polyhouse, weak shoots are bent down) so the bush gets stronger.", "झाडाला मजबूत फांद्या येतात. लवकरच्या कळ्या खुडल्या जातात (पॉलीहाऊसमध्ये कमजोर फांद्या खाली वाकवल्या जातात), म्हणजे झाड मजबूत होते."], [
      t("rs-pinch0", 35, "other", ["Pinch early buds", "लवकरच्या कळ्या खुडा"], ["Remove the first buds so the plant puts energy into canes.", "झाड फांद्यांकडे जोर देईल म्हणून पहिल्या कळ्या काढा."], 15),
      t("rs-irr1", 30, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular drip irrigation; adjust for season.", "हंगामानुसार नियमित ठिबक पाणी."], 4),
      t("rs-weed", 40, "weeding", ["Weed and mulch", "खुरपणी व आच्छादन"], ["Keep beds weed-free; mulch to keep moisture.", "वाफे तणमुक्त ठेवा; ओल टिकवण्यासाठी आच्छादन करा."], 30),
      t("rs-obs0", 45, "observation", ["Check leaves", "पाने तपासा"], ["Look for black spots, white powder and mites under leaves.", "काळे ठिपके, पांढरी भुकटी व पानांखाली कोळी पाहा."], 7),
    ], [["Black spot", "काळे ठिपके"], ["Powdery mildew", "भुरी"]]),
  ],
  cycles: [
    {
      key: "october-pruning",
      name: b("October pruning (main, open field)", "ऑक्टोबर छाटणी (मुख्य, उघडे शेत)"),
      startMonths: [10],
      startEvent: b("Main pruning after the monsoon, in October", "पावसाळ्यानंतर ऑक्टोबरमध्ये मुख्य छाटणी"),
      harvestMonths: [11, 12, 1, 2, 3],
      note: b("The best-quality flowers of the year come in winter, in time for weddings, Valentine's Day and New Year.", "वर्षातील सर्वोत्तम दर्जाची फुले हिवाळ्यात येतात — लग्नसराई, व्हॅलेंटाईन डे व नववर्षासाठी योग्य वेळी."),
      stages: pruning("rso"),
    },
    {
      key: "june-pruning",
      name: b("June pruning (second, open field)", "जून छाटणी (दुसरी, उघडे शेत)"),
      startMonths: [5, 6],
      startEvent: b("Light pruning in late May–June before the monsoon", "पावसाळ्यापूर्वी मे अखेर–जूनमध्ये हलकी छाटणी"),
      harvestMonths: [7, 8, 9, 10],
      note: b("Gives flowers for Ganesh festival, Navratri and Dasara; monsoon crop needs close watch for black spot.", "गणेशोत्सव, नवरात्र व दसऱ्यासाठी फुले मिळतात; पावसाळी पिकात काळ्या ठिपक्यांवर बारीक लक्ष हवे."),
      stages: pruning("rsj"),
    },
    {
      key: "polyhouse",
      name: b("Polyhouse (year-round picking)", "पॉलीहाऊस (वर्षभर तोडणी)"),
      startMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      startEvent: b("Cutting back or bending to start a new flush, timed for festival or export demand", "सण किंवा निर्यातीच्या मागणीनुसार नवीन बहारासाठी कापणी किंवा फांद्या वाकवणे"),
      harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      note: b("Plants are bent and flowers cut continuously. Growers time a flush about 45–55 days before peak demand like Valentine's Day.", "फांद्या वाकवून सतत फुले काढली जातात. व्हॅलेंटाईन डे सारख्या मोठ्या मागणीच्या साधारण 45–55 दिवस आधी बहाराचे नियोजन केले जाते."),
      stages: [
        stage("bending", ["Bending and new shoots", "फांद्या वाकवणे व नवी फूट"], 0, 45, ["Weak shoots are bent down to feed the plant; strong new canes grow from the base.", "कमजोर फांद्या खाली वाकवून झाडाला अन्न मिळते; बुंध्यातून मजबूत नव्या फांद्या येतात."], [
          t("rsp-bend", 0, "other", ["Bend weak shoots", "कमजोर फांद्या वाकवा"], ["Bend thin and blind shoots down into the path; keep them, do not cut.", "बारीक व कळी न येणाऱ्या फांद्या रस्त्याकडे खाली वाकवा; त्या ठेवा, कापू नका."], 15),
          t("rsp-irr", 1, "irrigation", ["Drip irrigation", "ठिबक पाणी"], ["Give small amounts daily with nutrients as planned.", "नियोजनाप्रमाणे खतांसह रोज थोडे पाणी द्या."], 1),
          t("rsp-obs1", 3, "observation", ["Check for mites and thrips", "कोळी व फुलकिडे तपासा"], ["Mites build up fast in polyhouse heat; check leaf undersides twice a week.", "पॉलीहाऊसच्या उष्णतेत कोळी झपाट्याने वाढतात; आठवड्यातून दोनदा पानांची खालची बाजू तपासा."], 4),
        ], [["Red spider mite", "लाल कोळी"], ["Powdery mildew", "भुरी"]]),
        stage("cutting", ["Flower cutting", "फुलांची काढणी"], 45, 365, ["Flowers are cut daily at tight bud stage.", "कळी घट्ट असतानाच रोज फुले काढली जातात."], [
          t("rsp-cut", 45, "harvest", ["Cut flowers", "फुले काढा"], ["Cut at tight bud with colour showing, leaving 2 healthy leaves on the stem; put stems in clean water at once.", "रंग दिसू लागलेल्या घट्ट कळीवर, फांदीवर 2 निरोगी पाने ठेवून काढा; दांडे लगेच स्वच्छ पाण्यात ठेवा."], 1),
          t("rsp-disbud", 46, "other", ["Remove side buds", "बाजूच्या कळ्या काढा"], ["Remove side buds early so the main bud grows large on a long stem.", "मुख्य कळी लांब दांड्यावर मोठी व्हावी म्हणून बाजूच्या कळ्या लवकर काढा."], 3),
          t("rsp-obs2", 50, "observation", ["Check vents and humidity", "हवा खेळती आहे का पाहा"], ["Open vents on humid days to keep mildew down.", "दमट दिवसांत भुरी कमी ठेवण्यासाठी व्हेंट उघडा."], 7),
        ], [["Thrips marking petals", "फुलकिड्यांमुळे पाकळ्यांवर डाग"], ["Botrytis (grey mould) on buds", "कळ्यांवर करडी बुरशी (बोट्रायटिस)"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Black spot", "काळे ठिपके"),
      signs: b("Round black spots with fringed edges on leaves; leaves turn yellow and fall, mostly in the rains.", "पानांवर झालरदार कडांचे गोल काळे ठिपके; पाने पिवळी होऊन गळतात, मुख्यतः पावसाळ्यात."),
      prevention: prevent("Collect and burn fallen leaves, prune for air flow and avoid wetting leaves while watering.", "गळलेली पाने गोळा करून जाळा, हवा खेळती राहील अशी छाटणी करा आणि पाणी देताना पाने ओली करू नका."),
    },
    {
      name: b("Powdery mildew", "भुरी"),
      signs: b("White powder on young leaves, buds and stems; leaves curl.", "कोवळी पाने, कळ्या व फांद्यांवर पांढरी भुकटी; पाने वाकडी होतात."),
      prevention: prevent("Keep plants spaced, ensure ventilation in polyhouses and remove badly affected shoots.", "रोपांत योग्य अंतर ठेवा, पॉलीहाऊसमध्ये हवा खेळती ठेवा आणि जास्त बाधित फांद्या काढा."),
    },
    {
      name: b("Red spider mite", "लाल कोळी"),
      signs: b("Fine yellow dots and webbing under leaves; leaves turn pale and drop, worst in hot dry weather and polyhouses.", "पानांखाली बारीक पिवळे ठिपके व जाळी; पाने फिकट होऊन गळतात, उष्ण कोरड्या हवेत व पॉलीहाऊसमध्ये जास्त."),
      prevention: prevent("Check leaf undersides twice a week, keep humidity balanced and remove heavily infested leaves.", "आठवड्यातून दोनदा पानांची खालची बाजू तपासा, आर्द्रता संतुलित ठेवा आणि जास्त बाधित पाने काढा."),
    },
    {
      name: b("Thrips", "फुलकिडे"),
      signs: b("Brown streaks and deformed petals; buds fail to open properly.", "पाकळ्यांवर तपकिरी रेषा व विकृती; कळ्या नीट उमलत नाहीत."),
      prevention: prevent("Use blue sticky traps to spot them early, remove spent flowers and keep surroundings weed-free.", "लवकर ओळखण्यासाठी निळे चिकट सापळे लावा, जुनी फुले काढा आणि आजूबाजू तणमुक्त ठेवा."),
    },
    {
      name: b("Dieback", "फांद्या वरून खाली सुकणे (डायबॅक)"),
      signs: b("Pruned branches turn black and dry from the cut downwards.", "छाटलेल्या फांद्या कापाच्या जागेपासून खाली काळ्या पडून सुकतात."),
      prevention: prevent("Prune with sharp, clean tools just above an outward bud, and seal or protect large cuts as advised.", "धारदार, स्वच्छ अवजाराने बाहेरच्या डोळ्याच्या थोडे वर छाटणी करा आणि मोठ्या कापांचे सल्ल्यानुसार संरक्षण करा."),
    },
  ],
  harvestSigns: b(
    "Cut roses at tight bud stage when the colour shows and 1–2 outer petals start to loosen. Loose-flower roses for garlands and worship are picked when just opening.",
    "रंग दिसू लागला व बाहेरच्या 1–2 पाकळ्या सैल होऊ लागल्या की कट-रोज काढा. हार व पूजेसाठीची सुटी फुले नुकतीच उमलताना तोडा.",
  ),
  postHarvest: b(
    "Cut in the cool morning or evening and put stems straight into clean water. Remove lower leaves and thorns, grade by stem length, bunch in 10s or 20s, wrap and keep cool until dispatch.",
    "सकाळी किंवा संध्याकाळी थंड वेळेत काढा व दांडे लगेच स्वच्छ पाण्यात ठेवा. खालची पाने व काटे काढा, दांड्याच्या लांबीनुसार प्रतवारी करा, 10 किंवा 20 च्या जुड्या बांधा, गुंडाळा आणि पाठवेपर्यंत थंड ठेवा.",
  ),
  marketTips: b(
    "Demand peaks at Valentine's Day, the wedding season and festivals. Long, straight stems with tight buds get the best rate for cut roses. Pune and Mumbai flower markets and traders for other cities buy in bulk; group dispatch cuts transport cost.",
    "व्हॅलेंटाईन डे, लग्नसराई व सणांना मागणी सर्वाधिक असते. कट-रोजसाठी लांब, सरळ दांडा व घट्ट कळीला सर्वाधिक दर मिळतो. पुणे व मुंबईचे फूल बाजार व इतर शहरांचे व्यापारी मोठ्या प्रमाणात खरेदी करतात; गटाने माल पाठवल्यास वाहतूक खर्च कमी होतो.",
  ),
  source: "General practices from ICAR-Directorate of Floricultural Research, Pune and MPKV Rahuri rose guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

/** Open-field pruning cycle: same stages for October and June pruning; task ids get a per-cycle prefix. */
function pruning(p: string) {
  return [
    stage("pruning", ["Pruning", "छाटणी"], 0, 10, ["Old, weak and diseased canes are cut so the plant sends out strong new shoots.", "जुन्या, कमजोर व रोगट फांद्या छाटल्यामुळे झाडाला मजबूत नवी फूट येते."], [
      t(`${p}-prune`, 0, "other", ["Prune the bushes", "झाडांची छाटणी करा"], ["Keep 4–5 healthy canes and cut them to about 45–60 cm, just above an outward-facing bud. Remove dead and crossing canes.", "4–5 निरोगी फांद्या ठेवून त्या साधारण 45–60 सेंमीवर, बाहेरच्या दिशेच्या डोळ्याच्या थोडे वर छाटा. वाळलेल्या व एकमेकांत घुसणाऱ्या फांद्या काढा."]),
      t(`${p}-fym`, 2, "fertiliser", ["Give manure", "शेणखत द्या"], ["Loosen the soil and give well-rotted manure; plan fertiliser as per soil test.", "माती भुसभुशीत करून कुजलेले शेणखत द्या; माती परीक्षणानुसार खत नियोजन करा."]),
      t(`${p}-irr1`, 3, "irrigation", ["Irrigate after pruning", "छाटणीनंतर पाणी द्या"], ["Give a good watering after manuring to wake the buds.", "डोळे फुटावेत म्हणून खतानंतर भरपूर पाणी द्या."]),
    ], [["Dieback from the cut ends", "कापलेल्या टोकांपासून फांद्या सुकणे"]]),
    stage("sprouting", ["New shoots", "नवी फूट"], 10, 30, ["Buds break and new shoots grow.", "डोळे फुटून नवी फूट वाढते."], [
      t(`${p}-irr2`, 10, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water as per season.", "हंगामानुसार नियमित पाणी."], 5),
      t(`${p}-obs1`, 12, "observation", ["Check new shoots", "नवी फूट तपासा"], ["Look for aphids, thrips and white powder on tender shoots.", "कोवळ्या फुटीवर मावा, फुलकिडे व पांढरी भुकटी पाहा."], 7),
      t(`${p}-stock`, 15, "other", ["Remove suckers", "खुंटाचे फुटवे काढा"], ["Remove shoots from the rootstock below the bud joint.", "डोळ्याच्या जोडाखालील खुंटाचे फुटवे काढा."]),
    ], [["Aphids on tender shoots", "कोवळ्या फुटीवर मावा"], ["Powdery mildew", "भुरी"]]),
    stage("budding", ["Bud formation", "कळी येणे"], 30, 45, ["Buds appear at shoot tips.", "फुटीच्या टोकांवर कळ्या येतात."], [
      t(`${p}-disbud`, 30, "other", ["Remove side buds", "बाजूच्या कळ्या काढा"], ["For cut flowers keep only the top bud on each stem.", "कट-फ्लॉवरसाठी प्रत्येक दांड्यावर फक्त वरची कळी ठेवा."], 5),
      t(`${p}-fert2`, 32, "fertiliser", ["Next fertiliser part", "पुढचा खत हप्ता"], ["Give the next small part as planned.", "नियोजनानुसार पुढचा छोटा हप्ता द्या."]),
      t(`${p}-irr3`, 31, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even moisture gives good bud size.", "सारख्या ओलाव्याने कळीचा आकार चांगला होतो."], 5),
    ], [["Thrips in buds", "कळ्यांत फुलकिडे"]]),
    stage("flowering", ["Flowering and picking", "फुलोरा व तोडणी"], 45, 180, ["Flowers are picked every 1–2 days for about 4 months.", "साधारण 4 महिने दर 1–2 दिवसांनी फुले तोडली जातात."], [
      t(`${p}-pick`, 45, "harvest", ["Pick flowers", "फुले तोडा"], ["Cut at the right bud stage in the cool hours and keep stems in water.", "योग्य कळी अवस्थेत थंड वेळेत काढा व दांडे पाण्यात ठेवा."], 2),
      t(`${p}-irr4`, 46, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water through the picking season.", "तोडणीच्या काळात नियमित पाणी."], 5),
      t(`${p}-obs2`, 50, "observation", ["Check leaves and flowers", "पाने व फुले तपासा"], ["Watch for black spot, mites and thrips; remove fallen leaves.", "काळे ठिपके, कोळी व फुलकिडे पाहा; गळलेली पाने काढा."], 7),
      t(`${p}-fert3`, 75, "fertiliser", ["Feed during picking", "तोडणीच्या काळात खत"], ["Give small fertiliser parts every few weeks as planned.", "नियोजनानुसार दर काही आठवड्यांनी खताचे छोटे हप्ते द्या."], 30),
    ], [["Black spot", "काळे ठिपके"], ["Red spider mite", "लाल कोळी"]]),
  ];
}

export default crop;
