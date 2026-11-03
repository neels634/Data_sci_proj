import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "matki",
  emoji: "🫘",
  name: b("Matki (moth bean)", "मटकी"),
  aliases: ["matki", "mataki", "matky", "moth bean", "mothbean", "moth dal", "मटकी", "मटकि", "मोठ"],
  category: "pulse",
  lifecycle: "seasonal",
  regions: ["western", "marathwada", "north"],
  majorDistricts: b("Ahilyanagar, Pune, Solapur, Beed", "अहिल्यानगर, पुणे, सोलापूर, बीड"),
  tier: 2,
  seasons: [
    { season: "kharif", sowingWindow: b("July, after the first good rains; suits light, rainfed land", "जुलै, पहिल्या चांगल्या पावसानंतर; हलक्या कोरडवाहू जमिनीसाठी योग्य"), sowingMonths: [6, 7], durationDays: [75, 95] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b(
    "Light, sandy or gravelly soil with good drainage. Grows where other pulses fail; avoid heavy, water-logged land.",
    "हलकी, वाळूमिश्रित किंवा मुरमाड, निचरा होणारी जमीन. इतर कडधान्ये येत नाहीत तेथेही येते; भारी, पाणी साचणारी जमीन टाळा.",
  ),
  climate: b(
    "Very hardy in heat and dry spells. The spreading plants cover the soil and save moisture.",
    "उष्णता व पावसाचा खंड चांगला सहन करते. पसरणारी झाडे जमीन झाकून ओलावा टिकवतात.",
  ),
  seedRate: b("4–5 kg seed per acre.", "एकरी 4–5 किलो बियाणे."),
  spacing: b("30–45 cm between rows, 10–15 cm between plants.", "दोन ओळींत 30–45 सेंमी, दोन रोपांत 10–15 सेंमी."),
  irrigation: b(
    "Grown rainfed. Usually needs no irrigation; if a long dry spell comes at flowering, one light irrigation helps.",
    "पावसावर घेतात. सहसा पाणी लागत नाही; फुलोऱ्यात पावसाचा मोठा खंड पडल्यास एक हलके पाणी उपयोगी.",
  ),
  nutrientGuide: b(
    "Needs very little fertiliser. Add some well-rotted farmyard manure and a small basal dose as per soil test. Bio-fertiliser seed treatment helps.",
    "खत फार कमी लागते. थोडे कुजलेले शेणखत व माती परीक्षणानुसार पेरणीवेळी थोडे खत द्या. जैविक खताची बीजप्रक्रिया उपयोगी.",
  ),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 12, ["Seeds sprout and small plants come up.", "बी रुजते व लहान रोपे वर येतात."], [
      t("mt-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow in moist soil, 3–4 cm deep, in 30–45 cm rows.", "ओलसर जमिनीत 3–4 सेंमी खोल, 30–45 सेंमी ओळीत पेरा."]),
      t("mt-count", 9, "observation", ["Check germination", "उगवण तपासा"], ["Look for gaps and seedlings eaten by insects.", "खाडे व किडींनी खाल्लेली रोपे पाहा."]),
    ], [["Poor germination if rain stops after sowing", "पेरणीनंतर पाऊस थांबल्यास कमी उगवण"]]),
    stage("vegetative", ["Spreading growth", "वेलासारखी पसरणारी वाढ"], 12, 40, ["Plants branch and spread over the ground, covering the soil.", "झाडांना फांद्या फुटून ती जमिनीवर पसरतात व जमीन झाकतात."], [
      t("mt-weed", 15, "weeding", ["Weeding", "खुरपणी"], ["Weed once or twice before the plants cover the soil.", "झाडे जमीन झाकण्यापूर्वी एक-दोन वेळा खुरपणी करा."], 15),
      t("mt-obs1", 16, "observation", ["Check leaves", "पाने तपासा"], ["Look for yellow mosaic patches and for hairy caterpillars eating leaves.", "पिवळ्या केवड्याचे चट्टे व पाने खाणाऱ्या केसाळ अळ्या पाहा."], 10),
    ], [["Yellow mosaic", "पिवळा केवडा"], ["Hairy caterpillar", "केसाळ अळी"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 40, 60, ["Small yellow flowers open and pods begin to set.", "लहान पिवळी फुले उमलतात व शेंगा लागू लागतात."], [
      t("mt-obs2", 41, "observation", ["Check flowers", "फुले तपासा"], ["Look for caterpillars and sucking pests on flowers.", "फुलांवर अळ्या व रसशोषक किडी पाहा."], 7),
      t("mt-irr1", 45, "irrigation", ["Light irrigation if very dry", "खूप कोरडे असल्यास हलके पाणी"], ["Only if there has been no rain for a long time and water is available.", "बरेच दिवस पाऊस नसेल व पाणी उपलब्ध असेल तरच."]),
    ], [["Flower drop in long dry spell", "पावसाच्या मोठ्या खंडात फुलगळ"]]),
    stage("pod", ["Pod filling", "शेंगा भरणे"], 60, 80, ["Small pods fill with seed and turn brown.", "लहान शेंगांत दाणे भरतात व शेंगा तपकिरी होतात."], [
      t("mt-obs3", 61, "observation", ["Check pods", "शेंगा तपासा"], ["Look for holes in pods and pods drying early.", "शेंगांना छिद्रे व लवकर वाळणाऱ्या शेंगा पाहा."], 7),
      t("mt-plan", 70, "other", ["Plan the harvest", "काढणीचे नियोजन करा"], ["Arrange labour and a clean threshing floor before pods dry fully.", "शेंगा पूर्ण वाळण्यापूर्वी मजूर व स्वच्छ खळ्याची व्यवस्था करा."]),
    ], [["Pod borer", "शेंगा पोखरणारी अळी"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 80, 95, ["Pods turn brown and dry; leaves fall.", "शेंगा तपकिरी होऊन वाळतात; पाने गळतात."], [
      t("mt-harv", 80, "harvest", ["Harvest", "काढणी करा"], ["Pull or cut plants when most pods are brown, early in the morning so pods do not burst.", "बहुतेक शेंगा तपकिरी झाल्यावर सकाळी लवकर झाडे उपटा किंवा कापा, म्हणजे शेंगा फुटत नाहीत."]),
      t("mt-thresh", 85, "other", ["Dry and thresh", "वाळवून मळणी करा"], ["Dry plants in the sun, thresh, and clean the grain. Keep the dry plants as fodder.", "झाडे उन्हात वाळवा, मळणी करा व दाणे स्वच्छ करा. वाळलेले भुसकट चाऱ्यासाठी ठेवा."]),
    ], [["Pods bursting in the field if harvest is late", "उशिरा काढणी केल्यास शेतातच शेंगा फुटणे"]]),
  ],
  commonProblems: [
    {
      name: b("Yellow mosaic", "पिवळा केवडा"),
      signs: b("Yellow patches on leaves; plants stay small with few pods.", "पानांवर पिवळे चट्टे; झाडे खुरटी राहतात व शेंगा कमी."),
      prevention: prevent("Sow on time, uproot sick plants early and keep whitefly in check.", "वेळेवर पेरणी करा, रोगट झाडे लवकर उपटा आणि पांढरी माशी आटोक्यात ठेवा."),
    },
    {
      name: b("Hairy caterpillar", "केसाळ अळी"),
      signs: b("Groups of hairy caterpillars eat leaves fast, leaving only veins.", "केसाळ अळ्यांचे थवे पाने भराभर खातात, फक्त शिरा उरतात."),
      prevention: prevent("Collect and destroy egg masses and young caterpillar groups; dig a trench around the field to stop them moving in.", "अंडीपुंज व लहान अळ्यांचे थवे गोळा करून नष्ट करा; अळ्या शेतात येऊ नयेत म्हणून शेताभोवती चर खणा."),
    },
    {
      name: b("Pod borer", "शेंगा पोखरणारी अळी"),
      signs: b("Holes in pods and seeds eaten inside.", "शेंगांना छिद्रे व आतील दाणे खाल्लेले."),
      prevention: prevent("Check pods weekly and put up bird perches.", "दर आठवड्याला शेंगा तपासा व पक्षी थांबे लावा."),
    },
  ],
  harvestSigns: b("Most pods are brown and dry and leaves have fallen.", "बहुतेक शेंगा तपकिरी व कोरड्या झाल्या असून पाने गळली आहेत."),
  postHarvest: b(
    "Dry the grain well, clean it and store in airtight bags or bins. Matki stores well and is also sold for sprouts (usal).",
    "दाणे चांगले वाळवा, स्वच्छ करा व हवाबंद पोत्यांत किंवा कोठीत साठवा. मटकी चांगली टिकते आणि मोड आणून उसळीसाठीही विकली जाते.",
  ),
  marketTips: b(
    "Clean, uniform matki sells well in local markets for sprouts and misal. Small packed lots of cleaned grain can fetch a better price.",
    "स्वच्छ, एकसारखी मटकी मोड व मिसळीसाठी स्थानिक बाजारात चांगली विकली जाते. स्वच्छ दाण्यांची लहान पाकिटे केल्यास जास्त दर मिळू शकतो.",
  ),
  varieties: [], // TODO: varieties — confirm with MPKV Rahuri dryland research (Solapur)
  source: "General practices from MPKV Rahuri and VNMKV Parbhani dryland pulse guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
