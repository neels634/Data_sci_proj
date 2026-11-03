import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "cotton",
  emoji: "☁️",
  name: b("Cotton", "कापूस"),
  aliases: ["cotton", "kapus", "kapas", "कापूस", "कपास"],
  category: "cash",
  lifecycle: "seasonal",
  regions: ["vidarbha", "marathwada", "north"],
  majorDistricts: b("Yavatmal, Amravati, Wardha, Jalgaon, Nanded, Beed", "यवतमाळ, अमरावती, वर्धा, जळगाव, नांदेड, बीड"),
  tier: 1,
  seasons: [{ season: "kharif", sowingWindow: b("May–June (irrigated), June–July (rainfed)", "मे–जून (बागायती), जून–जुलै (कोरडवाहू)"), sowingMonths: [5, 6, 7], durationDays: [150, 180] }],
  method: "direct",
  plantingMaterial: b("Seed (mostly hybrid seed packets)", "बियाणे (बहुतेक संकरित बियाण्याची पाकिटे)"),
  soil: b("Deep black soil that holds water, with good drainage.", "पाणी धरून ठेवणारी, निचरा होणारी खोल काळी जमीन."),
  climate: b("Warm season with enough rain; dry weather at boll opening.", "पुरेसा पाऊस असलेला उबदार हंगाम; बोंडे फुटताना कोरडे हवामान."),
  seedRate: b("As written on the seed packet — hybrids usually 2 packets per acre.", "बियाण्याच्या पाकिटावर लिहिल्याप्रमाणे — संकरित वाणाला सहसा एकरी 2 पाकिटे."),
  spacing: b("90–120 cm between rows, 45–60 cm between plants, as per variety.", "वाणानुसार ओळींत 90–120 सेंमी, रोपांत 45–60 सेंमी."),
  irrigation: b("Rainfed in most areas. If irrigated, water at flowering and boll development when soil is dry.", "बहुतेक भागात कोरडवाहू. बागायती असल्यास फुलोरा व बोंडे वाढताना जमीन कोरडी झाल्यावर पाणी द्या."),
  nutrientGuide: b("Use a soil test. Add farmyard manure before sowing. Give nitrogen in parts. Ask your agriculture officer for amounts.", "माती परीक्षण करा. पेरणीपूर्वी शेणखत मिसळा. नत्र विभागून द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 15, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("ct-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow after good rain on ridges or beds.", "चांगल्या पावसानंतर सरीवर किंवा वाफ्यावर पेरा."]),
      t("ct-gap", 10, "other", ["Fill gaps and thin", "खाडे भरा व विरळणी करा"], ["Resow missing spots; keep one healthy plant per spot.", "उगवण न झालेल्या जागी पुन्हा पेरा; प्रत्येक जागी एक निरोगी रोप ठेवा."]),
    ], [["Poor germination", "कमी उगवण"]]),
    stage("vegetative", ["Plant growth & squares", "वाढ व पात्या"], 15, 55, ["Plants grow and form flower buds (squares).", "रोपे वाढतात आणि पात्या (फुलांच्या कळ्या) येतात."], [
      t("ct-obs1", 18, "observation", ["Check under leaves", "पानांखाली तपासा"], ["Look for sucking pests: aphids, jassids, whitefly.", "रसशोषक किडी पाहा: मावा, तुडतुडे, पांढरी माशी."], 7),
      t("ct-weed", 20, "weeding", ["Weeding", "खुरपणी"], ["Weed or hoe between rows.", "ओळींमध्ये खुरपणी किंवा कोळपणी करा."], 20),
      t("ct-irr1", 25, "irrigation", ["Irrigate if dry", "कोरडे असल्यास पाणी द्या"], ["Only if there is no rain and soil is dry.", "पाऊस नसेल व जमीन कोरडी असेल तरच."], 12),
      t("ct-fert", 30, "fertiliser", ["Top dressing", "वरखत"], ["Next nutrient part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार पुढचा खत हप्ता. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Sucking pests", "रसशोषक किडी"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 55, 90, ["Flowers open and small bolls form.", "फुले उमलतात व लहान बोंडे लागतात."], [
      t("ct-trap", 56, "observation", ["Set pheromone traps", "कामगंध सापळे लावा"], ["Traps show when pink bollworm arrives. Ask your KVK for the right trap.", "गुलाबी बोंडअळी कधी आली ते सापळ्यांमुळे कळते. योग्य सापळ्यासाठी कृषी विज्ञान केंद्राला विचारा."]),
      t("ct-obs2", 57, "observation", ["Check flowers", "फुले तपासा"], ["Flowers that stay closed like a rose (rosette) can hide pink bollworm.", "गुलाबासारखी बंद राहिलेली फुले (डोमकळी) गुलाबी बोंडअळीची असू शकतात."], 7),
      t("ct-irr2", 60, "irrigation", ["Irrigate if dry", "कोरडे असल्यास पाणी द्या"], ["Water stress drops flowers and small bolls.", "पाण्याच्या ताणाने फुले व लहान बोंडे गळतात."], 12),
    ], [["Pink bollworm", "गुलाबी बोंडअळी"], ["Flower and boll drop", "फुले व बोंडे गळणे"]]),
    stage("boll", ["Boll development", "बोंडांची वाढ"], 90, 140, ["Bolls grow and fill with cotton.", "बोंडे वाढतात व कापसाने भरतात."], [
      t("ct-obs3", 91, "observation", ["Check bolls", "बोंडे तपासा"], ["Open a few green bolls and look for larvae inside.", "काही हिरवी बोंडे फोडून आत अळ्या आहेत का पाहा."], 7),
      t("ct-irr3", 95, "irrigation", ["Irrigate if dry", "कोरडे असल्यास पाणी द्या"], ["Light water helps bolls fill in a dry spell.", "पावसाच्या खंडात हलके पाणी बोंडे भरायला मदत करते."], 14),
    ], [["Bollworms", "बोंडअळ्या"]]),
    stage("picking", ["Boll opening & picking", "बोंडे फुटणे व वेचणी"], 140, 180, ["Bolls open and cotton is picked in rounds.", "बोंडे फुटतात आणि फेऱ्यांमध्ये कापूस वेचला जातो."], [
      t("ct-pick", 140, "harvest", ["Pick cotton", "कापूस वेचा"], ["Pick fully opened bolls in dry hours. Keep clean cotton separate from dirty cotton.", "पूर्ण फुटलेली बोंडे कोरड्या वेळेत वेचा. स्वच्छ कापूस खराब कापसापासून वेगळा ठेवा."], 15),
      t("ct-clean", 175, "other", ["Destroy old plants", "जुनी झाडे नष्ट करा"], ["After the last picking, uproot and destroy stalks. This reduces pink bollworm next year.", "शेवटच्या वेचणीनंतर पऱ्हाट्या उपटून नष्ट करा. पुढच्या वर्षी गुलाबी बोंडअळी कमी होते."]),
    ], [["Keeping the crop too long feeds pink bollworm", "पीक जास्त दिवस ठेवल्यास गुलाबी बोंडअळी वाढते"]]),
  ],
  commonProblems: [
    { name: b("Pink bollworm", "गुलाबी बोंडअळी"), signs: b("Rosette flowers, holes in bolls, stained lint.", "डोमकळी, बोंडांना छिद्रे, डागाळलेला कापूस."), prevention: prevent("Use pheromone traps, remove rosette flowers, and destroy stalks after the season.", "कामगंध सापळे वापरा, डोमकळ्या काढा आणि हंगामानंतर पऱ्हाट्या नष्ट करा.") },
    { name: b("Sucking pests", "रसशोषक किडी"), signs: b("Leaves curl and turn yellow or reddish at edges.", "पाने आकसतात व कडांना पिवळी किंवा लालसर होतात."), prevention: prevent("Check under leaves weekly; keep the field weed-free.", "दर आठवड्याला पानांखाली तपासा; शेत तणमुक्त ठेवा.") },
    { name: b("Leaf reddening (lalya)", "लाल्या"), signs: b("Leaves turn red from the edges and dry early, mostly at boll formation on light or nutrient-poor soil or under water stress.", "पाने कडांपासून लाल होऊन लवकर वाळतात; मुख्यतः बोंडे लागताना, हलक्या किंवा कसहीन जमिनीत किंवा पाण्याच्या ताणात."), prevention: b("It is mainly a nutrition and stress problem. Feed as per soil test with enough organic manure, give nitrogen in parts, avoid water stress at boll formation and control sucking pests. Ask your agriculture officer about leaf-feeding nutrients.", "हा मुख्यतः अन्नद्रव्य व ताणाचा प्रश्न आहे. पुरेशा सेंद्रिय खतासह माती परीक्षणानुसार खत द्या, नत्र विभागून द्या, बोंडे लागताना पाण्याचा ताण टाळा व रसशोषक किडींचे नियंत्रण करा. पानांवरून द्यायच्या अन्नद्रव्यांबद्दल कृषी अधिकाऱ्यांना विचारा.") },
    { name: b("Sudden wilt (parawilt)", "आकस्मिक मर"), signs: b("Plants droop suddenly after heavy rain or irrigation following a long dry spell.", "मोठ्या खंडानंतर जोरदार पाऊस किंवा पाणी दिल्यावर झाडे अचानक मलूल होतात."), prevention: prevent("Drain standing water quickly, avoid heavy irrigation after a long dry spell, and act within a day or two of wilting.", "साचलेले पाणी लगेच काढून टाका, मोठ्या खंडानंतर भरपूर पाणी देणे टाळा आणि मर दिसल्यावर एक-दोन दिवसांत उपाय करा.") },
  ],
  harvestSigns: b("Bolls have fully opened and cotton is fluffy and dry.", "बोंडे पूर्ण फुटली आहेत आणि कापूस फुललेला व कोरडा आहे."),
  postHarvest: b("Dry picked cotton in shade, keep it clean and store away from dust and moisture.", "वेचलेला कापूस सावलीत वाळवा, स्वच्छ ठेवा आणि धूळ व ओलाव्यापासून दूर साठवा."),
  marketTips: b("Clean, dry cotton without trash gets a better rate. Check the support price.", "कचरा नसलेल्या स्वच्छ, कोरड्या कापसाला चांगला दर मिळतो. हमीभाव तपासा."),
  varieties: [], // TODO: varieties — most cotton is Bt hybrids; confirm with ICAR-CICR / Dr. PDKV Akola
  source: "General practices from ICAR-CICR Nagpur and Dr. PDKV Akola cotton guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
