import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "soybean",
  emoji: "🫘",
  name: b("Soybean", "सोयाबीन"),
  aliases: ["soybean", "soyabean", "soya", "सोयाबीन", "सोयाबिन"],
  category: "oilseed",
  lifecycle: "seasonal",
  regions: ["marathwada", "vidarbha", "western"],
  majorDistricts: b("Latur, Washim, Amravati, Nanded, Kolhapur", "लातूर, वाशिम, अमरावती, नांदेड, कोल्हापूर"),
  tier: 1,
  seasons: [{ season: "kharif", sowingWindow: b("June–July, after good rain", "जून–जुलै, चांगल्या पावसानंतर"), sowingMonths: [6, 7], durationDays: [95, 110] }],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b("Well-drained medium to deep black soil. Soybean dislikes standing water.", "पाण्याचा निचरा होणारी मध्यम ते भारी काळी जमीन. सोयाबीनला साचलेले पाणी चालत नाही."),
  climate: b("Warm and rainy kharif season.", "उबदार व पावसाळी खरीप हंगाम."),
  seedRate: b("25–30 kg seed per acre, depending on seed size.", "बियाण्याच्या आकारानुसार एकरी 25–30 किलो."),
  spacing: b("45 cm between rows, about 5 cm between plants.", "ओळींत 45 सेंमी, रोपांत साधारण 5 सेंमी."),
  irrigation: b("Mostly rainfed. If there is a long dry spell at flowering or pod filling, give protective irrigation if you can.", "मुख्यतः पावसावर. फुलोरा किंवा शेंगा भरताना पावसाचा मोठा खंड पडल्यास शक्य असल्यास संरक्षित पाणी द्या."),
  nutrientGuide: b("Use a soil test. Soybean makes some of its own nitrogen; seed treatment with bio-fertiliser helps — ask your KVK.", "माती परीक्षण करा. सोयाबीन काही नत्र स्वतः तयार करते; जैविक खताची बीजप्रक्रिया उपयोगी — कृषी विज्ञान केंद्राला विचारा."),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 12, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("sb-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow after 75–100 mm of rain, 3–5 cm deep. Ask your KVK about seed treatment.", "75–100 मिमी पावसानंतर 3–5 सेंमी खोल पेरा. बीजप्रक्रियेबद्दल कृषी विज्ञान केंद्राला विचारा."]),
      t("sb-count", 8, "observation", ["Check germination", "उगवण तपासा"], ["Count plants in a metre of row; resow big gaps quickly.", "ओळीतील एका मीटरमध्ये रोपे मोजा; मोठे खाडे लगेच पुन्हा पेरा."]),
    ], [["Poor germination after dry spell", "पावसाच्या खंडानंतर कमी उगवण"]]),
    stage("vegetative", ["Plant growth", "रोपांची वाढ"], 12, 40, ["Leaves and branches grow.", "पाने व फांद्या वाढतात."], [
      t("sb-obs1", 14, "observation", ["Check the plants", "रोपे तपासा"], ["Look for ring cuts on stems (girdle beetle) and leaf-eating caterpillars.", "खोडावर कड्या (चक्रभुंगा) व पाने खाणाऱ्या अळ्या पाहा."], 7),
      t("sb-weed", 15, "weeding", ["Weeding", "खुरपणी"], ["Keep the field weed-free for the first 45 days.", "पहिले 45 दिवस शेत तणमुक्त ठेवा."], 15),
      t("sb-drain", 20, "other", ["Keep drains open", "चर मोकळे ठेवा"], ["Make sure rain water doesn't stand in the field.", "पावसाचे पाणी शेतात साचणार नाही याची काळजी घ्या."]),
    ], [["Girdle beetle", "चक्रभुंगा"], ["Leaf-eating caterpillars", "पाने खाणाऱ्या अळ्या"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 40, 60, ["Small flowers appear at the joints.", "पेऱ्यांवर लहान फुले येतात."], [
      t("sb-obs2", 42, "observation", ["Check for yellow mosaic", "पिवळा मोझॅक तपासा"], ["Yellow patches on leaves; remove such plants early.", "पानांवर पिवळे चट्टे; अशी रोपे लवकर काढा."], 7),
      t("sb-irr1", 45, "irrigation", ["Protective irrigation if dry", "कोरडे असल्यास संरक्षित पाणी"], ["Only if there has been no rain for 10–15 days and the soil is dry.", "10–15 दिवस पाऊस नसेल व जमीन कोरडी असेल तरच."]),
    ], [["Yellow mosaic", "पिवळा मोझॅक"]]),
    stage("pod", ["Pod formation & filling", "शेंगा लागणे व भरणे"], 60, 95, ["Pods form and seeds fill.", "शेंगा लागतात व दाणे भरतात."], [
      t("sb-obs3", 62, "observation", ["Check pods", "शेंगा तपासा"], ["Look for pod borers and pod blight.", "शेंगा पोखरणारी अळी व शेंगा करपा पाहा."], 7),
      t("sb-irr2", 70, "irrigation", ["Protective irrigation if dry", "कोरडे असल्यास संरक्षित पाणी"], ["Seed filling needs moisture during a long dry spell.", "पावसाच्या मोठ्या खंडात दाणे भरण्यासाठी ओलावा लागतो."]),
    ], [["Pod borer", "शेंगा पोखरणारी अळी"]]),
    stage("maturity", ["Maturity", "पक्वता"], 95, 103, ["Leaves turn yellow and drop; pods turn brown.", "पाने पिवळी होऊन गळतात; शेंगा तपकिरी होतात."], [
      t("sb-mat", 95, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Most pods brown and dry → plan the harvest.", "बहुतेक शेंगा तपकिरी व कोरड्या → काढणीचे नियोजन करा."]),
      t("sb-arrange", 98, "other", ["Arrange labour or a harvester", "मजूर किंवा हार्वेस्टर ठरवा"], ["Delayed harvest makes pods shatter; book help in advance.", "उशिरा काढणी केल्यास शेंगा तडकतात; मदत आधीच ठरवा."]),
    ], [["Pods shattering if harvest is late", "उशिरा काढणी केल्यास शेंगा तडकणे"]]),
    stage("harvest", ["Harvest", "काढणी"], 103, 110, ["The crop is cut, dried and threshed.", "पीक कापून, वाळवून मळणी केली जाते."], [
      t("sb-harv", 103, "harvest", ["Harvest", "काढणी करा"], ["Cut, dry in the sun, thresh gently and store dry seed.", "कापा, उन्हात वाळवा, हळू मळणी करा व कोरडे दाणे साठवा."]),
      t("sb-store", 107, "other", ["Dry and store the seed", "दाणे वाळवून साठवा"], ["Dry grain well before bagging; keep seed for next year separate and away from moisture.", "पोत्यात भरण्यापूर्वी दाणे चांगले वाळवा; पुढील वर्षाचे बियाणे वेगळे व ओलाव्यापासून दूर ठेवा."]),
    ], [["Rain at harvest spoils seed", "काढणीच्या वेळी पावसाने दाणे खराब होतात"]]),
  ],
  commonProblems: [
    { name: b("Girdle beetle", "चक्रभुंगा"), signs: b("Two ring cuts on the stem; top of plant wilts.", "खोडावर दोन कड्या; शेंडा मलूल होतो."), prevention: prevent("Remove and destroy affected plants early.", "बाधित रोपे लवकर काढून नष्ट करा.") },
    { name: b("Yellow mosaic", "पिवळा मोझॅक"), signs: b("Bright yellow patches on leaves; spread by whitefly.", "पानांवर पिवळे चट्टे; पांढऱ्या माशीमुळे पसरतो."), prevention: prevent("Use tolerant varieties and remove sick plants.", "सहनशील वाण वापरा व आजारी रोपे काढा.") },
    { name: b("Leaf-eating caterpillars (semilooper, Spodoptera)", "पाने खाणाऱ्या अळ्या (उंटअळी, लष्करी अळी)"), signs: b("Holes in leaves; in bad cases only veins are left and pods are eaten.", "पानांना छिद्रे; जास्त प्रादुर्भावात फक्त शिरा उरतात व शेंगा खाल्ल्या जातात."), prevention: prevent("Put up bird perches and pheromone traps, collect egg masses and young caterpillars, and check the crop weekly.", "पक्षी थांबे व कामगंध सापळे लावा, अंडीपुंज व लहान अळ्या गोळा करून नष्ट करा आणि दर आठवड्याला पीक तपासा.") },
    { name: b("Stem fly", "खोडमाशी"), signs: b("Young plants wilt; splitting the stem shows a reddish tunnel with a small maggot.", "कोवळी रोपे मलूल होतात; खोड चिरल्यास आत लालसर बोगदा व लहान अळी दिसते."), prevention: prevent("Sow on time with treated seed, and pull out and destroy wilted plants early.", "बीजप्रक्रिया करून वेळेवर पेरणी करा आणि मलूल रोपे लवकर उपटून नष्ट करा.") },
  ],
  harvestSigns: b("Most pods turn brown and leaves fall.", "बहुतेक शेंगा तपकिरी होतात व पाने गळतात."),
  postHarvest: b("Dry seed well in the sun before storing in clean bags.", "स्वच्छ पोत्यांत साठवण्यापूर्वी दाणे उन्हात चांगले वाळवा."),
  marketTips: b("Clean, dry soybean gets a better rate. Check the support price before selling.", "स्वच्छ, कोरड्या सोयाबीनला चांगला दर मिळतो. विक्रीपूर्वी हमीभाव तपासा."),
  varieties: [
    { name: "JS 335", note: b("Widely grown older variety", "मोठ्या प्रमाणावर घेतला जाणारा जुना वाण") },
    { name: "MAUS-71", note: b("Released by VNMKV Parbhani", "वनामकृवि परभणीचा वाण") },
    { name: "MAUS-158", note: b("Released by VNMKV Parbhani", "वनामकृवि परभणीचा वाण") },
    { name: "KDS-726 (Phule Sangam)", note: b("Released by MPKV Rahuri", "मफुकृवि राहुरीचा वाण") },
  ],
  source: "General practices from ICAR-IISR and VNMKV Parbhani soybean guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
