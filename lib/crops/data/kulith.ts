import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "kulith",
  emoji: "🫘",
  name: b("Kulith (horse gram)", "कुळीथ (हुलगा)"),
  aliases: ["kulith", "kulit", "kulthi", "kulthi dal", "hulga", "hulaga", "horse gram", "horsegram", "कुळीथ", "कुळिथ", "हुलगा", "हुलगे", "कुलथी"],
  category: "pulse",
  lifecycle: "seasonal",
  regions: ["konkan", "western", "marathwada"],
  tier: 2,
  seasons: [
    { season: "kharif", label: b("Late kharif", "उशिरा खरीप"), sowingWindow: b("August–September on light uplands (rainfed)", "ऑगस्ट–सप्टेंबर, हलक्या माळरानावर (कोरडवाहू)"), sowingMonths: [8, 9], durationDays: [100, 120] },
    { season: "rabi", sowingWindow: b("October–November on leftover moisture, e.g. after rice in Konkan", "ऑक्टोबर–नोव्हेंबर, जमिनीतील उरलेल्या ओलाव्यावर (उदा. कोकणात भातानंतर)"), sowingMonths: [10, 11], durationDays: [90, 110] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b(
    "Poor, light, gravelly or sandy soil where little else grows. Avoid water-logged land.",
    "हलकी, मुरमाड, वाळूमिश्रित, कमी कसाची जमीन जिथे दुसरे पीक कमी येते. पाणी साचणारी जमीन टाळा.",
  ),
  climate: b(
    "Very drought-hardy. Grows on little rain or leftover soil moisture.",
    "दुष्काळ चांगला सहन करते. कमी पावसावर किंवा जमिनीतील उरलेल्या ओलाव्यावर येते.",
  ),
  seedRate: b("8–10 kg seed per acre (more when broadcast).", "एकरी 8–10 किलो बियाणे (फोकून पेरल्यास जास्त)."),
  spacing: b("30–45 cm between rows, 5–10 cm between plants.", "दोन ओळींत 30–45 सेंमी, दोन रोपांत 5–10 सेंमी."),
  irrigation: b(
    "Grown without irrigation. Rabi crop after rice lives on the moisture left in the soil.",
    "पाण्याशिवाय घेतात. भातानंतरचे रब्बी पीक जमिनीत उरलेल्या ओलाव्यावर येते.",
  ),
  nutrientGuide: b(
    "Needs very little fertiliser. A little farmyard manure and a small basal dose as per soil test is enough; bio-fertiliser seed treatment helps.",
    "खत फार कमी लागते. थोडे शेणखत व माती परीक्षणानुसार पेरणीवेळी थोडे खत पुरेसे; जैविक खताची बीजप्रक्रिया उपयोगी.",
  ),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 12, ["Seeds sprout in moist soil.", "ओलसर जमिनीत बी रुजते."], [
      t("kl-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow in rows while the soil is still moist. In Konkan, sow soon after rice harvest.", "जमीन ओलसर असतानाच ओळीत पेरा. कोकणात भात काढणीनंतर लगेच पेरा."]),
      t("kl-count", 9, "observation", ["Check germination", "उगवण तपासा"], ["Look for big gaps.", "मोठे खाडे आहेत का पाहा."]),
    ], [["Poor germination if the soil dries quickly", "जमीन लवकर कोरडी झाल्यास कमी उगवण"]]),
    stage("vegetative", ["Spreading growth", "पसरणारी वाढ"], 12, 50, ["Thin, spreading stems grow and cover the ground.", "बारीक, पसरणारे वेल वाढून जमीन झाकतात."], [
      t("kl-weed", 18, "weeding", ["Weeding", "खुरपणी"], ["Weed once at 3–4 weeks, before the plants spread.", "झाडे पसरण्यापूर्वी 3–4 आठवड्यांनी एकदा खुरपणी करा."]),
      t("kl-obs1", 20, "observation", ["Check leaves", "पाने तपासा"], ["Look for yellow mosaic and leaf-eating caterpillars.", "पिवळा केवडा व पाने खाणाऱ्या अळ्या पाहा."], 10),
    ], [["Yellow mosaic", "पिवळा केवडा"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 50, 75, ["Small flowers open in leaf joints and pods start.", "पानांच्या बेचक्यात लहान फुले येतात व शेंगा लागू लागतात."], [
      t("kl-obs2", 51, "observation", ["Check flowers", "फुले तपासा"], ["Look for caterpillars and white powder on leaves.", "अळ्या व पानांवर पांढरी भुकटी पाहा."], 7),
      t("kl-obs3", 60, "observation", ["Note flowering for harvest planning", "काढणी नियोजनासाठी फुलोरा नोंदवा"], ["Pods are usually ready about 5–6 weeks after full flowering.", "पूर्ण फुलोऱ्यानंतर साधारण 5–6 आठवड्यांत शेंगा तयार होतात."]),
    ], [["Powdery mildew", "भुरी"]]),
    stage("pod", ["Pod filling", "शेंगा भरणे"], 75, 100, ["Flat pods fill with seed and turn brown.", "चपट्या शेंगांत दाणे भरतात व त्या तपकिरी होतात."], [
      t("kl-obs4", 76, "observation", ["Check pods", "शेंगा तपासा"], ["Look for holes in pods.", "शेंगांना छिद्रे आहेत का पाहा."], 7),
      t("kl-plan", 90, "other", ["Plan the harvest", "काढणीचे नियोजन करा"], ["Arrange labour and a clean threshing floor.", "मजूर व स्वच्छ खळ्याची व्यवस्था करा."]),
    ], [["Pod borer", "शेंगा पोखरणारी अळी"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 100, 120, ["Pods dry and turn brown; they shatter if left too long.", "शेंगा वाळून तपकिरी होतात; जास्त दिवस राहिल्यास फुटतात."], [
      t("kl-harv", 100, "harvest", ["Harvest", "काढणी करा"], ["Cut or pull plants in the morning when most pods are brown.", "बहुतेक शेंगा तपकिरी झाल्यावर सकाळी झाडे कापा किंवा उपटा."]),
      t("kl-thresh", 106, "other", ["Dry and thresh", "वाळवून मळणी करा"], ["Dry in the sun, thresh and clean. The straw is good cattle feed.", "उन्हात वाळवा, मळणी करून स्वच्छ करा. भुसकट जनावरांसाठी चांगला चारा."]),
    ], [["Pods shattering if harvest is late", "उशिरा काढणी केल्यास शेंगा फुटणे"]]),
  ],
  commonProblems: [
    {
      name: b("Yellow mosaic", "पिवळा केवडा"),
      signs: b("Yellow patches on leaves; plants stay small.", "पानांवर पिवळे चट्टे; झाडे खुरटी राहतात."),
      prevention: prevent("Uproot sick plants early and keep whitefly in check.", "रोगट झाडे लवकर उपटा आणि पांढरी माशी आटोक्यात ठेवा."),
    },
    {
      name: b("Powdery mildew", "भुरी"),
      signs: b("White powder on leaves in cool, dry weather; leaves drop.", "थंड, कोरड्या हवेत पानांवर पांढरी भुकटी; पाने गळतात."),
      prevention: prevent("Sow on time and avoid very dense sowing.", "वेळेवर पेरणी करा व खूप दाट पेरणी टाळा."),
    },
    {
      name: b("Pod borer", "शेंगा पोखरणारी अळी"),
      signs: b("Holes in pods; seeds eaten.", "शेंगांना छिद्रे; दाणे खाल्लेले."),
      prevention: prevent("Check pods weekly and put up bird perches.", "दर आठवड्याला शेंगा तपासा व पक्षी थांबे लावा."),
    },
  ],
  harvestSigns: b("Most pods are brown and dry; leaves yellow and fall.", "बहुतेक शेंगा तपकिरी व कोरड्या; पाने पिवळी होऊन गळतात."),
  postHarvest: b(
    "Dry the grain well, clean it and store in airtight containers. Horse gram stores well.",
    "दाणे चांगले वाळवा, स्वच्छ करा व हवाबंद डब्यांत साठवा. कुळीथ चांगला टिकतो.",
  ),
  marketTips: b(
    "Sold locally for kulith pithi, usal and as cattle feed. Clean grain and kulith flour packed in small bags can fetch a better price.",
    "कुळथाचे पिठले, उसळ व जनावरांच्या खाद्यासाठी स्थानिक बाजारात विकला जातो. स्वच्छ दाणे व कुळथाचे पीठ लहान पिशव्यांत भरल्यास जास्त दर मिळू शकतो.",
  ),
  varieties: [], // TODO: varieties — confirm with Dr. BSKKV Dapoli and MPKV Rahuri
  source: "General practices from Dr. BSKKV Dapoli and MPKV Rahuri horse gram guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
