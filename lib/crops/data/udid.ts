import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "udid",
  emoji: "⚫",
  name: b("Udid (black gram)", "उडीद"),
  aliases: ["udid", "udad", "urad", "urd", "urid", "black gram", "blackgram", "उडीद", "उडिद", "उडद", "उड़द"],
  category: "pulse",
  lifecycle: "seasonal",
  regions: ["marathwada", "vidarbha", "western", "north"],
  majorDistricts: b("Latur, Dharashiv, Beed, Nanded, Akola, Jalgaon", "लातूर, धाराशिव, बीड, नांदेड, अकोला, जळगाव"),
  tier: 1,
  seasons: [
    { season: "kharif", sowingWindow: b("Late June–mid July, after good rain", "जूनचा शेवटचा आठवडा–जुलैचा मध्य, चांगला पाऊस झाल्यावर"), sowingMonths: [6, 7], durationDays: [70, 85] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b(
    "Medium to heavy soil that holds moisture but drains well. Udid tolerates heavier soil than moong, but not standing water.",
    "ओलावा धरून ठेवणारी पण निचरा होणारी मध्यम ते भारी जमीन. उडीद मुगापेक्षा भारी जमिनीत चालतो, पण साचलेले पाणी चालत नाही.",
  ),
  climate: b(
    "Warm and humid kharif weather. Continuous rain at maturity spoils pods.",
    "उबदार व दमट खरीप हवामान. पक्वतेच्या वेळी सतत पाऊस झाल्यास शेंगा खराब होतात.",
  ),
  seedRate: b("6–8 kg seed per acre.", "एकरी 6–8 किलो बियाणे."),
  spacing: b("30 cm between rows, about 10 cm between plants.", "दोन ओळींत 30 सेंमी, दोन रोपांत साधारण 10 सेंमी."),
  irrigation: b(
    "Grown rainfed in kharif. Make drainage furrows so rain water does not stand. If a long dry spell comes at flowering, one protective irrigation helps.",
    "खरिपात पावसावर घेतात. पावसाचे पाणी साचू नये म्हणून चर काढा. फुलोऱ्यात पावसाचा मोठा खंड पडल्यास एक संरक्षित पाणी उपयोगी.",
  ),
  nutrientGuide: b(
    "Use a soil test. Needs little nitrogen; phosphorus at sowing helps. Seed treatment with Rhizobium and PSB bio-fertiliser improves nodules. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. नत्र कमी लागते; पेरणीवेळी स्फुरद उपयोगी. रायझोबियम व पीएसबी जैविक खताच्या बीजप्रक्रियेने गाठी चांगल्या येतात. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 10, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("ud-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow after 75–100 mm of rain, in 30 cm rows, 3–4 cm deep. Treat seed with bio-fertiliser — ask your KVK.", "75–100 मिमी पाऊस झाल्यावर 30 सेंमी ओळीत, 3–4 सेंमी खोल पेरा. जैविक खताची बीजप्रक्रिया करा — कृषी विज्ञान केंद्राला विचारा."]),
      t("ud-count", 7, "observation", ["Check germination", "उगवण तपासा"], ["Look for gaps and resow early if many seeds failed.", "खाडे पाहा; जास्त बी उगवले नसल्यास लवकर पुन्हा पेरा."]),
    ], [["Seed rot in water-logged patches", "पाणी साचलेल्या भागात बी सडणे"]]),
    stage("vegetative", ["Leaf growth & branching", "पानांची वाढ व फांद्या"], 10, 35, ["Plants grow leaves and branches and make root nodules.", "रोपांना पाने व फांद्या येतात आणि मुळांवर गाठी तयार होतात."], [
      t("ud-weed", 15, "weeding", ["Weeding and hoeing", "खुरपणी व कोळपणी"], ["Keep weeds out for the first 30–35 days with hoeing and hand weeding.", "पहिले 30–35 दिवस कोळपणी व खुरपणी करून तण काढा."], 12),
      t("ud-obs1", 14, "observation", ["Check leaves", "पाने तपासा"], ["Look for yellow patches (yellow mosaic), crinkled leaves (leaf crinkle) and whitefly.", "पिवळे चट्टे (पिवळा केवडा), सुरकुतलेली पाने (पाने आकसणे) व पांढरी माशी पाहा."], 7),
      t("ud-drain", 20, "other", ["Clear drainage", "पाण्याचा निचरा करा"], ["After heavy rain, open the furrows so water leaves the field within a day.", "जोरदार पावसानंतर चर मोकळे करा, म्हणजे एका दिवसात पाणी बाहेर जाईल."]),
      t("ud-rogue", 25, "other", ["Pull out virus-affected plants", "विषाणूग्रस्त झाडे उपटा"], ["Uproot plants with yellow mosaic early and destroy them away from the field.", "पिवळा केवडा झालेली झाडे लवकर उपटून शेताबाहेर नष्ट करा."]),
    ], [["Yellow mosaic", "पिवळा केवडा"], ["Leaf crinkle", "पाने आकसणे (चुरडा)"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 35, 50, ["Flowers open and pods begin to set.", "फुले उमलतात व शेंगा लागू लागतात."], [
      t("ud-obs2", 36, "observation", ["Check flowers", "फुले तपासा"], ["Look for caterpillars webbing flowers and for white powder on leaves.", "फुले जाळ्याने बांधणाऱ्या अळ्या व पानांवर पांढरी भुकटी पाहा."], 6),
      t("ud-irr1", 40, "irrigation", ["Protective irrigation if dry", "कोरडे असल्यास संरक्षित पाणी"], ["If there has been no rain for 2 weeks and the soil is dry, give one light irrigation.", "2 आठवडे पाऊस नसेल व जमीन कोरडी असेल तर एक हलके पाणी द्या."]),
    ], [["Pod borer", "शेंगा पोखरणारी अळी"], ["Powdery mildew", "भुरी"]]),
    stage("pod", ["Pod filling", "शेंगा भरणे"], 50, 70, ["Hairy pods fill with seed and start turning black.", "केसाळ शेंगांत दाणे भरतात व शेंगा काळ्या होऊ लागतात."], [
      t("ud-obs3", 51, "observation", ["Check pods", "शेंगा तपासा"], ["Look for holes in pods and for leaf spots.", "शेंगांना छिद्रे व पानांवरील ठिपके पाहा."], 7),
      t("ud-perch", 52, "other", ["Keep bird perches", "पक्षी थांबे ठेवा"], ["T-shaped sticks in the field let birds pick caterpillars.", "शेतातील T आकाराच्या काठ्यांवर बसून पक्षी अळ्या टिपतात."]),
    ], [["Pod borer", "शेंगा पोखरणारी अळी"], ["Leaf spot in humid weather", "दमट हवामानात पानांवरील ठिपके"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 70, 85, ["Pods turn black, leaves yellow and fall. Most pods ripen together.", "शेंगा काळ्या होतात, पाने पिवळी होऊन गळतात. बहुतेक शेंगा एकत्र पिकतात."], [
      t("ud-mat", 70, "observation", ["Check if ready", "तयार आहे का पाहा"], ["When about 80% of pods are black, plan the harvest.", "साधारण 80% शेंगा काळ्या झाल्या की काढणीचे नियोजन करा."]),
      t("ud-harv", 74, "harvest", ["Harvest", "काढणी करा"], ["Cut or pull plants, dry in the sun on a clean floor and thresh.", "झाडे कापा किंवा उपटा, स्वच्छ खळ्यावर उन्हात वाळवा व मळणी करा."]),
    ], [["Rain at harvest: grains turn dull and mouldy", "काढणीच्या वेळी पाऊस: दाणे निस्तेज व बुरशीयुक्त"]]),
  ],
  commonProblems: [
    {
      name: b("Yellow mosaic", "पिवळा केवडा"),
      signs: b("Bright yellow patches on leaves; plants stay small with few pods. Spread by whitefly.", "पानांवर भडक पिवळे चट्टे; झाडे खुरटी राहतात व शेंगा कमी. पांढऱ्या माशीमुळे पसरतो."),
      prevention: prevent("Use tolerant varieties, sow on time, uproot and destroy sick plants early, and watch for whitefly with yellow sticky traps.", "सहनशील वाण वापरा, वेळेवर पेरणी करा, रोगट झाडे लवकर उपटून नष्ट करा आणि पिवळ्या चिकट सापळ्यांनी पांढऱ्या माशीवर लक्ष ठेवा."),
    },
    {
      name: b("Leaf crinkle", "पाने आकसणे (चुरडा-मुरडा)"),
      signs: b("Leaves become large, thick and wrinkled; flowers do not form pods.", "पाने मोठी, जाड व सुरकुतलेली होतात; फुलांना शेंगा लागत नाहीत."),
      prevention: prevent("Use healthy seed from a trusted source and remove affected plants as soon as you see them.", "विश्वासू ठिकाणचे निरोगी बियाणे वापरा आणि बाधित झाडे दिसताच काढून टाका."),
    },
    {
      name: b("Powdery mildew", "भुरी"),
      signs: b("White powder on leaves; leaves dry and drop early.", "पानांवर पांढरी भुकटी; पाने लवकर वाळून गळतात."),
      prevention: prevent("Avoid late sowing and very dense crop; keep the field clean.", "उशिरा पेरणी व दाट पीक टाळा; शेत स्वच्छ ठेवा."),
    },
    {
      name: b("Pod borer", "शेंगा पोखरणारी अळी"),
      signs: b("Caterpillars web flowers and bore holes in pods.", "अळ्या फुले जाळ्याने बांधतात व शेंगांना छिद्रे पाडतात."),
      prevention: prevent("Check flowers and pods weekly, put up bird perches and pheromone traps.", "दर आठवड्याला फुले व शेंगा तपासा, पक्षी थांबे व कामगंध सापळे लावा."),
    },
    {
      name: b("Root rot", "मूळकूज"),
      signs: b("Plants wilt and dry in patches; roots are dark and rotten.", "झाडे गटागटाने मलूल होऊन वाळतात; मुळे काळी पडून कुजलेली."),
      prevention: prevent("Do not let water stand, rotate crops and ask your KVK about bio-agent seed treatment.", "पाणी साचू देऊ नका, पिकांची फेरपालट करा आणि जैविक बुरशीच्या बीजप्रक्रियेबद्दल कृषी विज्ञान केंद्राला विचारा."),
    },
  ],
  harvestSigns: b("About 80% of pods are black and dry and leaves are falling.", "साधारण 80% शेंगा काळ्या व कोरड्या झाल्या आहेत आणि पाने गळत आहेत."),
  postHarvest: b(
    "Dry the grain well, clean and grade it, and store in clean, airtight bags or bins. Check stored grain each month for beetles.",
    "दाणे चांगले वाळवा, स्वच्छ करून प्रतवारी करा आणि स्वच्छ, हवाबंद पोत्यांत किंवा कोठीत साठवा. दर महिन्याला साठवलेल्या दाण्यांत भुंगेरे तपासा.",
  ),
  marketTips: b(
    "Bold, black, shiny and clean grain gets the best price; dal mills buy in bulk. Check the support price and sell together through your Mandi Mitra.",
    "टपोऱ्या, काळ्या, चमकदार व स्वच्छ दाण्यांना सर्वाधिक दर मिळतो; डाळ मिल मोठ्या प्रमाणात खरेदी करतात. हमीभाव तपासा आणि मंडी मित्रामार्फत एकत्र विक्री करा.",
  ),
  varieties: [
    { name: "TAU-1", note: b("Widely grown; released by Dr. PDKV Akola with BARC", "मोठ्या प्रमाणावर घेतला जातो; डॉ. पंदेकृवि अकोला व भाभा अणुसंशोधन केंद्राचा वाण") },
    { name: "BDU-1", note: b("Released by VNMKV Parbhani (Badnapur)", "वनामकृवि परभणीचा (बदनापूर) वाण") },
  ],
  source: "General practices from Dr. PDKV Akola, VNMKV Parbhani and ICAR-IIPR black gram guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
