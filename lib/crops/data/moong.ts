import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "moong",
  emoji: "🫛",
  name: b("Moong (green gram)", "मूग"),
  aliases: ["moong", "mung", "moong dal", "green gram", "greengram", "mung bean", "मूग", "मुग", "मूंग"],
  category: "pulse",
  lifecycle: "seasonal",
  regions: ["marathwada", "vidarbha", "western", "north"],
  majorDistricts: b("Latur, Beed, Jalna, Akola, Buldhana, Ahilyanagar", "लातूर, बीड, जालना, अकोला, बुलढाणा, अहिल्यानगर"),
  tier: 1,
  seasons: [
    { season: "kharif", sowingWindow: b("Late June–mid July, after good rain (rainfed)", "जूनचा शेवटचा आठवडा–जुलैचा मध्य, चांगला पाऊस झाल्यावर (कोरडवाहू)"), sowingMonths: [6, 7], durationDays: [60, 70] },
    { season: "summer", sowingWindow: b("February–early March, only with assured irrigation", "फेब्रुवारी–मार्चचा पहिला आठवडा, फक्त खात्रीचे पाणी असल्यास"), sowingMonths: [2, 3], durationDays: [65, 75] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b(
    "Light to medium soil with good drainage. Moong cannot stand water logging even for a day or two.",
    "पाण्याचा चांगला निचरा होणारी हलकी ते मध्यम जमीन. एक-दोन दिवस पाणी साचले तरी मूग खराब होतो.",
  ),
  climate: b(
    "Warm weather. A short crop that fits before rabi. Continuous rain at pod ripening spoils the grain.",
    "उबदार हवामान. कमी दिवसांचे पीक, रब्बीपूर्वी घेता येते. शेंगा पिकताना सतत पाऊस असल्यास दाणे खराब होतात.",
  ),
  seedRate: b("6–8 kg seed per acre.", "एकरी 6–8 किलो बियाणे."),
  spacing: b("30 cm between rows, about 10 cm between plants.", "दोन ओळींत 30 सेंमी, दोन रोपांत साधारण 10 सेंमी."),
  irrigation: b(
    "Kharif moong is rainfed; drain extra rain water quickly. Summer moong needs water every 8–10 days; flowering and pod filling must not go dry.",
    "खरीप मूग पावसावर येतो; जास्तीचे पावसाचे पाणी लगेच बाहेर काढा. उन्हाळी मुगाला दर 8–10 दिवसांनी पाणी लागते; फुलोरा व शेंगा भरताना ताण पडू देऊ नका.",
  ),
  nutrientGuide: b(
    "Use a soil test. A pulse needs little nitrogen — a small dose at sowing is enough; phosphorus helps root and pod growth. Seed treatment with Rhizobium and PSB bio-fertiliser helps. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. कडधान्याला नत्र कमी लागते — पेरणीवेळी थोडे पुरेसे; स्फुरदामुळे मुळे व शेंगा चांगल्या येतात. रायझोबियम व पीएसबी जैविक खताची बीजप्रक्रिया उपयोगी. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 10, ["Seeds sprout in 4–5 days and seedlings come up.", "4–5 दिवसांत बी रुजते व रोपे वर येतात."], [
      t("mg-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow in moist soil in 30 cm rows, 3–4 cm deep. Treat seed with bio-fertiliser before sowing — ask your KVK.", "ओलसर जमिनीत 30 सेंमी ओळीत, 3–4 सेंमी खोल पेरा. पेरणीपूर्वी जैविक खताची बीजप्रक्रिया करा — कृषी विज्ञान केंद्राला विचारा."]),
      t("mg-count", 7, "observation", ["Check germination", "उगवण तपासा"], ["Look for big gaps and seedlings cut at the base.", "मोठे खाडे व खोडाजवळ कापलेली रोपे आहेत का पाहा."]),
    ], [["Poor germination in very wet or very dry soil", "खूप ओल्या किंवा कोरड्या जमिनीत कमी उगवण"]]),
    stage("vegetative", ["Leaf growth & branching", "पानांची वाढ व फांद्या"], 10, 30, ["Plants make leaves and branches. Weeds compete hardest now.", "रोपांना पाने व फांद्या येतात. या काळात तणांची स्पर्धा सर्वात जास्त."], [
      t("mg-thin", 12, "other", ["Thin the plants", "विरळणी करा"], ["Keep plants about 10 cm apart so each gets light.", "प्रत्येक रोपाला ऊन मिळावे म्हणून रोपांत साधारण 10 सेंमी अंतर ठेवा."]),
      t("mg-weed", 15, "weeding", ["Weeding and hoeing", "खुरपणी व कोळपणी"], ["Keep the field weed-free for the first 30 days: one hoeing and one hand weeding.", "पहिले 30 दिवस शेत तणमुक्त ठेवा: एक कोळपणी व एक खुरपणी."], 12),
      t("mg-obs1", 14, "observation", ["Check leaves", "पाने तपासा"], ["Look for yellow patches on leaves (yellow mosaic) and whiteflies under the leaves.", "पानांवर पिवळे चट्टे (पिवळा केवडा) व पानांखाली पांढरी माशी पाहा."], 7),
      t("mg-irr1", 20, "irrigation", ["Irrigate summer moong", "उन्हाळी मुगाला पाणी द्या"], ["For summer moong, water every 8–10 days. For kharif, drain standing rain water.", "उन्हाळी मुगाला दर 8–10 दिवसांनी पाणी द्या. खरिपात साचलेले पावसाचे पाणी काढून टाका."], 9),
    ], [["Yellow mosaic", "पिवळा केवडा"], ["Whitefly and jassids", "पांढरी माशी व तुडतुडे"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 30, 45, ["Yellow flowers open and the first pods start.", "पिवळी फुले उमलतात व पहिल्या शेंगा लागतात."], [
      t("mg-irr2", 31, "irrigation", ["Do not let it go dry", "ताण पडू देऊ नका"], ["Water stress now drops flowers. Irrigate summer moong; protect kharif moong from water logging.", "आता ताण पडल्यास फुले गळतात. उन्हाळी मुगाला पाणी द्या; खरीप मुगात पाणी साचू देऊ नका."], 8),
      t("mg-obs2", 32, "observation", ["Check flowers and buds", "फुले व कळ्या तपासा"], ["Look for caterpillars in flowers and white powder on leaves (powdery mildew).", "फुलांत अळ्या व पानांवर पांढरी भुकटी (भुरी) पाहा."], 6),
    ], [["Pod borer in flowers", "फुलांत शेंगा पोखरणारी अळी"], ["Powdery mildew", "भुरी"]]),
    stage("pod", ["Pod filling", "शेंगा भरणे"], 45, 60, ["Pods grow long, seeds fill and pods turn black from the bottom.", "शेंगा लांब होतात, दाणे भरतात व खालच्या शेंगा काळ्या होऊ लागतात."], [
      t("mg-obs3", 46, "observation", ["Check pods", "शेंगा तपासा"], ["Look for holes in pods and webbed flower bunches.", "शेंगांना छिद्रे व जाळी लागलेले फुलांचे घोस पाहा."], 6),
      t("mg-irr3", 48, "irrigation", ["Last irrigation (summer crop)", "शेवटचे पाणी (उन्हाळी पीक)"], ["One last light irrigation while pods fill; then stop.", "शेंगा भरताना शेवटचे हलके पाणी द्या; मग बंद करा."]),
    ], [["Pod borer", "शेंगा पोखरणारी अळी"]]),
    stage("harvest", ["Maturity & picking", "पक्वता व तोडणी"], 60, 75, ["Pods turn black and dry. They ripen in 2–3 rounds and burst if left too long.", "शेंगा काळ्या होऊन वाळतात. त्या 2–3 वेळेस पिकतात आणि जास्त दिवस राहिल्यास फुटतात."], [
      t("mg-pick", 60, "harvest", ["Pick ripe pods", "पिकलेल्या शेंगा तोडा"], ["Pick black, dry pods in the morning when they do not burst. Repeat until the field is done.", "काळ्या, वाळलेल्या शेंगा सकाळी तोडा, तेव्हा त्या फुटत नाहीत. शेत संपेपर्यंत पुन्हा तोडा."], 6),
      t("mg-thresh", 68, "other", ["Dry and thresh", "वाळवून मळणी करा"], ["Dry pods in the sun on a clean floor and thresh. Clean the grain well.", "स्वच्छ खळ्यावर शेंगा उन्हात वाळवा व मळणी करा. दाणे चांगले स्वच्छ करा."]),
    ], [["Rain at picking: seeds sprout in pods", "तोडणीवेळी पाऊस: शेंगेतच दाण्यांना मोड"]]),
  ],
  commonProblems: [
    {
      name: b("Yellow mosaic", "पिवळा केवडा"),
      signs: b("Yellow and green patches on leaves; plants stay small with few pods. Spread by whitefly.", "पानांवर पिवळे-हिरवे चट्टे; झाडे खुरटी राहतात व शेंगा कमी. पांढऱ्या माशीमुळे पसरतो."),
      prevention: prevent("Use tolerant varieties, sow on time, pull out and destroy the first sick plants, and keep whitefly in check. Yellow sticky traps help you see whitefly early.", "सहनशील वाण वापरा, वेळेवर पेरणी करा, सुरुवातीची रोगट झाडे उपटून नष्ट करा आणि पांढरी माशी आटोक्यात ठेवा. पिवळे चिकट सापळे माशी लवकर ओळखायला मदत करतात."),
    },
    {
      name: b("Powdery mildew", "भुरी"),
      signs: b("White powder on leaves and pods; leaves dry and fall early.", "पानांवर व शेंगांवर पांढरी भुकटी; पाने लवकर वाळून गळतात."),
      prevention: prevent("Sow on time, avoid very thick sowing, and remove volunteer plants and weeds that carry the disease.", "वेळेवर पेरणी करा, दाट पेरणी टाळा आणि रोग वाहणारी तणे व आपोआप उगवलेली झाडे काढा."),
    },
    {
      name: b("Pod borer and spotted pod borer", "शेंगा पोखरणारी अळी व ठिपक्यांची अळी"),
      signs: b("Caterpillars web flowers together and bore into pods; seeds eaten inside.", "अळ्या फुले जाळ्याने बांधतात व शेंगा पोखरतात; आतील दाणे खाल्लेले."),
      prevention: prevent("Check flowers twice a week, put up T-shaped bird perches, and use pheromone traps where available.", "आठवड्यातून दोनदा फुले तपासा, T आकाराचे पक्षी थांबे लावा आणि मिळत असल्यास कामगंध सापळे वापरा."),
    },
    {
      name: b("Sucking pests (aphids, jassids, whitefly)", "रसशोषक किडी (मावा, तुडतुडे, पांढरी माशी)"),
      signs: b("Leaves curl, turn pale or yellow at the edges; sticky honeydew on leaves.", "पाने आकसतात, फिकट होतात किंवा कडा पिवळ्या पडतात; पानांवर चिकट द्रव."),
      prevention: prevent("Keep the field and bunds weed-free and check the underside of leaves weekly.", "शेत व बांध तणमुक्त ठेवा आणि दर आठवड्याला पानांची खालची बाजू तपासा."),
    },
    {
      name: b("Leaf spot", "पानांवरील ठिपके (करपा)"),
      signs: b("Brown round spots with a pale centre on leaves in humid weather.", "दमट हवामानात पानांवर फिकट मध्य असलेले तपकिरी गोल ठिपके."),
      prevention: prevent("Rotate crops, use clean seed and keep good spacing for air flow.", "पिकांची फेरपालट करा, स्वच्छ बियाणे वापरा आणि हवा खेळती राहील असे अंतर ठेवा."),
    },
  ],
  harvestSigns: b("Most pods have turned black and dry. Pick in 2–3 rounds before they burst.", "बहुतेक शेंगा काळ्या होऊन वाळल्या आहेत. फुटण्यापूर्वी 2–3 तोडण्यांत तोडा."),
  postHarvest: b(
    "Dry the grain well in the sun, clean and grade it, and store in clean, airtight bags or bins to keep pulse beetles away.",
    "दाणे उन्हात चांगले वाळवा, स्वच्छ करून प्रतवारी करा आणि भुंगेरे लागू नयेत म्हणून स्वच्छ, हवाबंद पोत्यांत किंवा कोठीत साठवा.",
  ),
  marketTips: b(
    "Bold, shiny, clean moong gets the best rate. Kharif moong reaches the market early (September). Check the support price before selling.",
    "टपोरे, चमकदार, स्वच्छ मूग सर्वाधिक दराने विकले जातात. खरीप मूग लवकर (सप्टेंबरमध्ये) बाजारात येतो. विक्रीपूर्वी हमीभाव तपासा.",
  ),
  varieties: [
    { name: "BM 2003-2", note: b("Released by VNMKV Parbhani (Badnapur)", "वनामकृवि परभणीचा (बदनापूर) वाण") },
    { name: "Utkarsha (AKM 8803)", note: b("Released by Dr. PDKV Akola", "डॉ. पंदेकृवि अकोलाचा वाण") },
    { name: "Vaibhav", note: b("Released by MPKV Rahuri", "मफुकृवि राहुरीचा वाण") },
  ],
  source: "General practices from VNMKV Parbhani, Dr. PDKV Akola and ICAR-IIPR green gram guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
