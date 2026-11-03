import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Sugarcane: three planting seasons (adsali, preseasonal, suru) of very different length, plus ratoon (khodva). */
const crop: SeasonalCrop = {
  id: "sugarcane",
  emoji: "🎋",
  name: b("Sugarcane", "ऊस"),
  aliases: ["sugarcane", "sugar cane", "us", "oos", "ganna", "ganne", "ऊस", "उस", "गन्ना"],
  category: "cash",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada"],
  majorDistricts: b("Kolhapur, Sangli, Satara, Pune, Solapur, Ahilyanagar", "कोल्हापूर, सांगली, सातारा, पुणे, सोलापूर, अहिल्यानगर"),
  tier: 1,
  seasons: [
    { season: "kharif", label: b("Adsali", "आडसाली"), sowingWindow: b("July–August", "जुलै–ऑगस्ट"), sowingMonths: [7, 8], durationDays: [480, 540] },
    { season: "rabi", label: b("Preseasonal", "पूर्वहंगामी"), sowingWindow: b("October–November", "ऑक्टोबर–नोव्हेंबर"), sowingMonths: [10, 11], durationDays: [420, 450] },
    { season: "summer", label: b("Suru", "सुरू"), sowingWindow: b("January–February", "जानेवारी–फेब्रुवारी"), sowingMonths: [1, 2], durationDays: [345, 375] },
  ],
  method: "vegetative",
  plantingMaterial: b(
    "Setts (pieces of cane with one to three buds) from a healthy, 9–11 month old seed plot; or single-bud seedlings raised in trays",
    "निरोगी, 9–11 महिन्यांच्या बेणे मळ्यातील एक ते तीन डोळ्यांची कांडी (बेणे); किंवा ट्रेमध्ये तयार केलेली एक डोळा रोपे",
  ),
  soil: b(
    "Deep, well-drained medium to heavy soil with good organic matter. Avoid saline and waterlogged land, or improve drainage first.",
    "सेंद्रिय पदार्थ चांगले असलेली खोल, पाण्याचा निचरा होणारी मध्यम ते भारी जमीन. क्षारपड व पाणथळ जमीन टाळा किंवा आधी निचरा सुधारा.",
  ),
  climate: b(
    "Warm, humid growing season and a cool, dry spell before harvest for good sugar. Adsali gets the longest growing time and the highest yield.",
    "वाढीसाठी उबदार, दमट हवामान आणि साखर चांगली भरण्यासाठी काढणीपूर्वी थंड, कोरडा काळ. आडसालीला वाढीचा काळ सर्वात जास्त व उत्पादनही सर्वाधिक.",
  ),
  seedRate: b(
    "About 3–4 tonnes of seed cane per acre as two-eye setts, depending on row spacing; much less when planting single-bud seedlings.",
    "ओळींतील अंतरानुसार दोन डोळ्यांच्या कांड्यांसाठी एकरी साधारण 3–4 टन बेणे; एक डोळा रोपे लावल्यास खूपच कमी.",
  ),
  spacing: b(
    "Wide rows of 120–150 cm (4–5 feet), wider for adsali; or paired rows. Wide rows suit drip irrigation and machines.",
    "120–150 सेंमी (4–5 फूट) रुंद सरी, आडसालीसाठी जास्त; किंवा जोड ओळ पद्धत. रुंद सरी ठिबक सिंचन व यंत्रांसाठी सोयीची.",
  ),
  irrigation: b(
    "Drip irrigation saves a lot of water and gives better cane; use it wherever possible. With furrow irrigation give water every 8–10 days in summer and 12–15 days in winter, with light, frequent water in the early months. Never let water stand. Reduce water as the cane ripens and stop it 15–20 days before harvest.",
    "ठिबक सिंचनाने भरपूर पाणी वाचते व ऊस चांगला येतो; शक्य तेथे ठिबक वापरा. पाटपाण्याने उन्हाळ्यात 8–10 दिवसांनी व हिवाळ्यात 12–15 दिवसांनी पाणी द्या; सुरुवातीच्या महिन्यांत हलके व वारंवार. पाणी साचू देऊ नका. ऊस पक्व होताना पाणी कमी करा व तोडणीपूर्वी 15–20 दिवस बंद करा.",
  ),
  nutrientGuide: b(
    "Plan on a soil test. Add well-rotted farmyard manure or pressmud compost and, if possible, grow and bury a green manure crop before planting. Give fertiliser in several parts, mostly in the first 4–5 months, and add micronutrients if the soil test shows a need. Ask your agriculture officer or the sugar factory's field staff for amounts.",
    "माती परीक्षणावर नियोजन करा. लागणीपूर्वी कुजलेले शेणखत किंवा प्रेसमड कंपोस्ट द्या आणि शक्य असल्यास हिरवळीचे पीक घेऊन गाडा. खत अनेक हप्त्यांत, मुख्यतः पहिल्या 4–5 महिन्यांत द्या, आणि माती परीक्षणात गरज दिसल्यास सूक्ष्म अन्नद्रव्ये द्या. प्रमाण कृषी अधिकारी किंवा साखर कारखान्याच्या शेती विभागाला विचारा.",
  ),
  varieties: [
    { name: "Co 86032", note: b("Very widely grown mid-late variety; from ICAR-Sugarcane Breeding Institute, Coimbatore", "मोठ्या प्रमाणावर घेतला जाणारा मध्यम-उशिरा वाण; ICAR-ऊस प्रजनन संस्था, कोईम्बतूरचा") },
    { name: "CoM 0265 (Phule 265)", note: b("High-yielding variety from MPKV (Central Sugarcane Research Station, Padegaon)", "मफुकृवि (मध्यवर्ती ऊस संशोधन केंद्र, पाडेगाव) चा जास्त उत्पादन देणारा वाण") },
    { name: "Co 92005", note: b("Variety from ICAR-Sugarcane Breeding Institute, grown in Maharashtra", "ICAR-ऊस प्रजनन संस्थेचा, महाराष्ट्रात घेतला जाणारा वाण") },
    { name: "CoC 671", note: b("Older early-maturing variety with high sugar", "लवकर पक्व होणारा, जास्त साखरेचा जुना वाण") },
  ],
  stages: [
    stage("germination", ["Planting & germination", "लागण व उगवण"], 0, 45, ["Buds on the setts sprout and shoots come up in 3–5 weeks.", "कांड्यांवरील डोळे फुटून 3–5 आठवड्यांत कोंब वर येतात."], [
      t("sc-plant", 0, "transplanting", ["Plant setts", "ऊस लागण करा"], ["Use setts from a healthy seed plot. Treat them as advised by your KVK or factory, and place them in moist furrows with buds facing sideways.", "निरोगी बेणे मळ्यातील कांड्या वापरा. कृषी विज्ञान केंद्र किंवा कारखान्याच्या सल्ल्याने बेणेप्रक्रिया करा व डोळे बाजूला येतील अशा ओलसर सरीत कांड्या ठेवा."]),
      t("sc-irr0", 3, "irrigation", ["Light irrigation", "हलके पाणी"], ["Keep the soil moist, not flooded, until shoots come up.", "कोंब येईपर्यंत जमीन ओलसर ठेवा, पाणी तुंबवू नका."], 7),
      t("sc-gap", 30, "other", ["Fill gaps", "नांग्या भरा"], ["Where no shoots came, plant pre-sprouted setts or seedlings kept ready for this.", "जेथे कोंब आले नाहीत तेथे आधीच तयार ठेवलेली फुटलेली कांडी किंवा रोपे लावा."]),
      t("sc-intercrop", 5, "other", ["Short intercrop (optional)", "आंतरपीक (ऐच्छिक)"], ["In wide rows a short crop like onion, groundnut, or green manure can be grown in the first 3 months.", "रुंद सरीत पहिल्या 3 महिन्यांत कांदा, भुईमूग किंवा हिरवळीचे पीक आंतरपीक म्हणून घेता येते."]),
    ], [["Poor sprouting from old or dry setts", "जुन्या किंवा सुकलेल्या बेण्यामुळे उगवण कमी"], ["Termites eating setts", "वाळवी कांड्या खाणे"]]),
    stage("tillering", ["Tillering", "फुटवे येणे"], 45, 120, ["Each plant sends out several tillers; the number of canes is decided now.", "प्रत्येक बेटाला अनेक फुटवे येतात; उसांची संख्या याच काळात ठरते."], [
      t("sc-weed", 45, "weeding", ["Weeding and hoeing", "खुरपणी व कोळपणी"], ["Keep the field weed-free for the first 3–4 months.", "पहिले 3–4 महिने शेत तणमुक्त ठेवा."], 20),
      t("sc-fert1", 45, "fertiliser", ["Fertiliser part and light earthing up", "खताचा हप्ता व बाळबांधणी"], ["Give the next fertiliser part as per your plan and lightly earth up the rows.", "नियोजनानुसार खताचा पुढचा हप्ता द्या व सरीला हलकी भर (बाळबांधणी) द्या."]),
      t("sc-irr1", 46, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water; drip or furrow every 8–12 days depending on season.", "नियमित पाणी; हंगामानुसार ठिबक किंवा 8–12 दिवसांनी पाटपाणी."], 10),
      t("sc-obs1", 50, "observation", ["Check for early shoot borer", "खोडकिडा तपासा"], ["Dry central leaf (dead heart) that pulls out easily and smells bad means borer; cut and destroy such shoots.", "मधले पान वाळून सहज उपसले जाते व वास येतो म्हणजे खोडकिडा; असे कोंब कापून नष्ट करा."], 10),
    ], [["Early shoot borer", "खोडकिडा"], ["Weeds competing", "तणांची स्पर्धा"]]),
    stage("grand-growth", ["Grand growth", "जोमदार वाढ"], 120, 240, ["Canes grow fast — several cm a day in warm, moist weather.", "ऊस झपाट्याने वाढतो — उबदार, ओलसर हवेत दररोज काही सेंमी."], [
      t("sc-earth", 120, "other", ["Main earthing up", "मोठी बांधणी करा"], ["Earth up the rows well so canes do not fall; give the last main fertiliser part before this.", "ऊस लोळू नये म्हणून सरीला चांगली भर द्या; त्याआधी खताचा शेवटचा मुख्य हप्ता द्या."]),
      t("sc-irr2", 121, "irrigation", ["Irrigate", "पाणी द्या"], ["Most water is needed now; do not let the crop face stress.", "याच काळात सर्वाधिक पाणी लागते; पिकाला ताण पडू देऊ नका."], 10),
      t("sc-obs2", 130, "observation", ["Check leaves for woolly aphid", "लोकरी मावा तपासा"], ["White woolly patches under leaves and black sooty leaves mean woolly aphid. Tell the factory field staff or KVK early.", "पानांखाली पांढरे लोकरीसारखे पुंजके व काळी पडलेली पाने म्हणजे लोकरी मावा. कारखान्याच्या शेती विभागाला किंवा कृषी विज्ञान केंद्राला लवकर कळवा."], 15),
      t("sc-trash1", 180, "other", ["Remove dry leaves", "वाळलेली पाने काढा"], ["Strip dry and lower leaves and leave them between rows as mulch; do not burn.", "वाळलेली व खालची पाने काढून सरीत आच्छादन म्हणून ठेवा; जाळू नका."]),
    ], [["Woolly aphid", "लोकरी मावा"], ["White grub", "हुमणी"]]),
    stage("late-growth", ["Late growth", "उत्तर वाढ"], 240, 330, ["Canes keep gaining length and weight; adsali cane continues growing through this period.", "ऊसाची लांबी व वजन वाढत राहते; आडसाली ऊस या काळात वाढतच राहतो."], [
      t("sc-irr3", 240, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water; less in winter.", "नियमित पाणी; हिवाळ्यात कमी."], 12),
      t("sc-prop", 250, "other", ["Tie canes (where tall)", "ऊस बांधा (उंच असल्यास)"], ["Tie cane clumps together so they do not fall in wind.", "वाऱ्याने लोळू नये म्हणून बेटे एकत्र बांधा."]),
      t("sc-obs3", 255, "observation", ["Check canes", "ऊस तपासा"], ["Look for red, sour-smelling split cane (red rot), whip-like shoots (smut) and grassy clumps; uproot and destroy them.", "लाल, आंबट वासाचा आतून फुटलेला ऊस (लाल कूज), चाबकासारखा शेंडा (काणी) व गवतासारखी बेटे पाहा; उपटून नष्ट करा."], 20),
    ], [["Red rot", "लाल कूज"], ["Smut (whip)", "काणी"]]),
    stage("maturity", ["Ripening", "पक्वता"], 330, 450, ["Sugar builds up in the cane. Suru cane is ready around 12 months and preseasonal around 14–15 months.", "उसात साखर भरते. सुरू ऊस साधारण 12 महिन्यांत व पूर्वहंगामी 14–15 महिन्यांत तयार होतो."], [
      t("sc-brix", 330, "observation", ["Check ripeness", "पक्वता तपासा"], ["Ask the factory field staff to test sugar (brix) at the top and bottom of the cane; equal readings mean ripe.", "कारखान्याच्या शेती कर्मचाऱ्यांकडून उसाच्या शेंड्याकडील व बुडख्याकडील साखर (ब्रिक्स) तपासून घ्या; दोन्ही सारखे म्हणजे ऊस पक्व."], 15),
      t("sc-irr4", 331, "irrigation", ["Reduce irrigation", "पाणी कमी करा"], ["Give lighter water as cane ripens; stop 15–20 days before the harvest date.", "ऊस पक्व होताना पाणी कमी करा; तोडणीच्या 15–20 दिवस आधी बंद करा."], 15),
      t("sc-slip", 335, "other", ["Get your harvest slip", "तोडणी पावती घ्या"], ["Confirm your cane registration and harvest programme with the factory.", "कारखान्याकडे ऊस नोंदणी व तोडणी कार्यक्रम निश्चित करा."]),
    ], [["Flowering (turra) lowers cane weight in some varieties", "काही वाणांत तुरा आल्याने वजन घटते"]]),
    stage("harvest", ["Harvest (adsali)", "तोडणी (आडसाली)"], 450, 540, ["Adsali cane is ripe and harvested at about 16–18 months.", "आडसाली ऊस साधारण 16–18 महिन्यांत पक्व होऊन तोडला जातो."], [
      t("sc-harv", 450, "harvest", ["Harvest close to the ground", "जमिनीलगत तोडणी करा"], ["Cut at ground level with a sharp tool, remove the green top and send cane to the factory within 24 hours.", "धारदार हत्याराने जमिनीलगत तोडा, वाडे काढा व 24 तासांच्या आत ऊस कारखान्यात पाठवा."]),
      t("sc-trash2", 460, "other", ["Keep the trash, do not burn", "पाचट जाळू नका"], ["Spread the trash in the field as mulch; it adds organic matter and saves water, especially if you keep a ratoon.", "पाचट शेतात आच्छादन म्हणून पसरा; सेंद्रिय पदार्थ वाढतात व पाणी वाचते, विशेषतः खोडवा ठेवल्यास."]),
      t("sc-ratoon", 465, "observation", ["Decide on ratoon", "खोडवा ठेवायचा का ठरवा"], ["If the crop was healthy and well spread, keep a ratoon (khodva); otherwise plough out and rotate with another crop.", "पीक निरोगी व दाट असल्यास खोडवा ठेवा; नाहीतर नांगरून दुसरे पीक घ्या."]),
    ], [["Delay between cutting and crushing reduces sugar and weight", "तोडणी व गाळप यात उशीर झाल्यास साखर व वजन घटते"]]),
  ],
  ratoon: {
    allowed: true,
    cycles: 2,
    durationDays: [330, 365],
    note: b(
      "A ratoon (khodva) grows from the stubble after harvest, saves planting cost and matures in about 12 months. Keep 1–2 ratoons from a healthy crop. Right after harvest: shave stubbles to ground level, do not burn the trash — spread it as mulch, break the ridges (off-baring) to loosen soil, fill gaps with seedlings, then start irrigation and fertiliser as per soil test. Ratoons from cane harvested in November–February do best.",
      "तोडणीनंतर बुडख्यांपासून येणारे पीक म्हणजे खोडवा; लागणीचा खर्च वाचतो व साधारण 12 महिन्यांत तयार होतो. निरोगी पिकाचे 1–2 खोडवे घ्या. तोडणीनंतर लगेच: बुडखे जमिनीलगत छाटा, पाचट जाळू नका — आच्छादन म्हणून पसरा, बगला फोडून माती मोकळी करा, नांग्या रोपांनी भरा, मग माती परीक्षणानुसार पाणी व खत सुरू करा. नोव्हेंबर–फेब्रुवारीत तोडलेल्या उसाचा खोडवा चांगला येतो.",
    ),
  },
  commonProblems: [
    {
      name: b("Early shoot borer", "खोडकिडा"),
      signs: b("Central leaf of young shoots dries (dead heart), pulls out easily and smells bad.", "कोवळ्या कोंबांचे मधले पान वाळते, सहज उपसले जाते व वास येतो."),
      prevention: prevent("Plant on time, earth up lightly, cut out and destroy dead hearts, and use trash mulch to keep moisture.", "वेळेवर लागण, हलकी भर, वाळलेले कोंब कापून नष्ट करणे आणि ओलावा टिकवण्यासाठी पाचट आच्छादन."),
    },
    {
      name: b("Woolly aphid", "लोकरी मावा"),
      signs: b("White woolly patches under leaves; leaves turn sticky and black with sooty mould.", "पानांखाली पांढरे लोकरीसारखे पुंजके; पाने चिकट होऊन काळी पडतात."),
      prevention: prevent("Use clean seed cane, remove badly affected leaves, and protect natural enemies (ladybird beetles and others) by avoiding unneeded sprays.", "स्वच्छ बेणे वापरा, जास्त बाधित पाने काढा आणि अनावश्यक फवारणी टाळून मित्रकीटकांचे (ढालकिडे वगैरे) संरक्षण करा."),
    },
    {
      name: b("White grub", "हुमणी"),
      signs: b("Clumps turn yellow and dry; canes pull out easily; C-shaped white grubs at the roots.", "बेटे पिवळी पडून वाळतात; ऊस सहज उपटतो; मुळांजवळ इंग्रजी C आकाराच्या पांढऱ्या अळ्या."),
      prevention: prevent("Deep ploughing in summer, collecting and destroying beetles after the first rains, and village-level control together with neighbours.", "उन्हाळ्यात खोल नांगरट, पहिल्या पावसानंतर भुंगे गोळा करून नष्ट करणे आणि शेजाऱ्यांसोबत गावपातळीवर एकत्र नियंत्रण."),
    },
    {
      name: b("Smut (whip)", "काणी"),
      signs: b("A long black whip comes out of the top of the shoot instead of leaves.", "शेंड्यातून पानांऐवजी लांब काळा चाबूक बाहेर येतो."),
      prevention: prevent("Use healthy seed cane, bag and uproot affected clumps before the whip bursts, and avoid ratooning a badly affected crop.", "निरोगी बेणे वापरा, चाबूक फुटण्यापूर्वी त्याला पिशवी घालून बाधित बेटे उपटा, आणि जास्त बाधित पिकाचा खोडवा घेऊ नका."),
    },
    {
      name: b("Red rot", "लाल कूज"),
      signs: b("Leaves dry from the top; split cane is red inside with white bands and a sour smell.", "पाने शेंड्याकडून वाळतात; ऊस उभा चिरल्यास आतून लाल, पांढरे पट्टे व आंबट वास."),
      prevention: prevent("Plant only healthy setts of resistant varieties, avoid waterlogging, uproot and burn affected clumps, and rotate crops.", "प्रतिकारक वाणांचे निरोगी बेणेच लावा, पाणी साचू देऊ नका, बाधित बेटे उपटून जाळा व फेरपालट करा."),
    },
  ],
  harvestSigns: b(
    "Leaves turn yellowish and growth slows, the cane gives a metallic sound when tapped, and sugar (brix) at the top and bottom of the cane is nearly equal.",
    "पाने पिवळसर होतात व वाढ मंदावते, ऊस ठोकल्यावर धातूसारखा आवाज येतो आणि शेंड्याकडील व बुडख्याकडील साखर (ब्रिक्स) जवळपास सारखी असते.",
  ),
  postHarvest: b(
    "Cane loses weight and sugar quickly after cutting — crush within 24 hours. Cut only as much as can be transported. Green tops make good cattle fodder.",
    "तोडल्यानंतर ऊसाचे वजन व साखर झपाट्याने घटते — 24 तासांत गाळप व्हावे. वाहतूक होईल तेवढाच ऊस तोडा. वाडे जनावरांसाठी चांगला चारा आहे.",
  ),
  marketTips: b(
    "Most cane goes to the sugar factory you are registered with at the government-fixed FRP. Register your area on time, keep your harvest slip, and check the factory's payment record before choosing. Jaggery (gul) making is another option for small lots.",
    "बहुतेक ऊस शासनाने ठरवलेल्या एफआरपीनुसार आपल्या नोंदणी असलेल्या साखर कारखान्याला जातो. क्षेत्राची वेळेवर नोंदणी करा, तोडणी पावती जपून ठेवा आणि कारखाना निवडण्यापूर्वी त्याचा पेमेंटचा इतिहास तपासा. थोड्या मालासाठी गूळनिर्मिती हा दुसरा पर्याय आहे.",
  ),
  source: "General practices from Vasantdada Sugar Institute, Pune and MPKV Rahuri (Central Sugarcane Research Station, Padegaon) sugarcane guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
