import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "safflower",
  emoji: "🌼",
  name: b("Safflower", "करडई"),
  aliases: ["safflower", "kardai", "kardi", "kardee", "kusum", "करडई", "करडी", "कुसुम"],
  category: "oilseed",
  lifecycle: "seasonal",
  regions: ["marathwada", "western"],
  majorDistricts: b("Solapur, Latur, Dharashiv, Beed, Parbhani", "सोलापूर, लातूर, धाराशिव, बीड, परभणी"),
  tier: 2,
  seasons: [
    { season: "rabi", sowingWindow: b("Mid-September to mid-October, on stored moisture", "सप्टेंबरच्या मध्यापासून ऑक्टोबरच्या मध्यापर्यंत, साठवलेल्या ओलाव्यावर"), sowingMonths: [9, 10], durationDays: [120, 135] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b("Deep black soil that holds moisture. It is a hardy rabi crop for dry areas.", "ओलावा धरून ठेवणारी भारी काळी जमीन. कोरडवाहू भागासाठी काटक रब्बी पीक."),
  climate: b("Cool, dry rabi weather. Its deep roots use stored soil moisture; cloudy, humid weather brings aphids and leaf spots.", "थंड, कोरडे रब्बी हवामान. खोल मुळे जमिनीतील साठवलेला ओलावा वापरतात; ढगाळ, दमट हवेत मावा व पानांवरील ठिपके वाढतात."),
  seedRate: b("About 4–5 kg seed per acre.", "एकरी साधारण 4–5 किलो बियाणे."),
  spacing: b("45 cm between rows and 20 cm between plants.", "ओळींत 45 सेंमी व रोपांत 20 सेंमी."),
  irrigation: b(
    "Mostly grown on stored moisture without irrigation. If water is available, one or two light irrigations at stem elongation and flowering raise yield. Avoid waterlogging — it causes root rot.",
    "मुख्यतः पाण्याशिवाय साठवलेल्या ओलाव्यावर घेतले जाते. पाणी असल्यास खोड वाढताना व फुलोऱ्यात 1–2 हलकी पाणी दिल्यास उत्पादन वाढते. पाणी साचू देऊ नका — मुळकूज होते.",
  ),
  nutrientGuide: b("Use a soil test. Apply farmyard manure and all fertiliser at sowing for a rainfed crop. Ask your agriculture officer for amounts.", "माती परीक्षण करा. कोरडवाहू पिकात शेणखत व सर्व खत पेरणीच्या वेळी द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."),
  varieties: [
    { name: "Bhima", note: b("Widely grown variety released by MPKV (Solapur research station)", "मफुकृवि (सोलापूर संशोधन केंद्र) चा मोठ्या प्रमाणावर घेतला जाणारा वाण") },
    { name: "PBNS 12", note: b("Released by VNMKV Parbhani", "वनामकृवि परभणीचा वाण") },
  ], // TODO: varieties — confirm newer (incl. spineless) varieties with MPKV Solapur station / VNMKV Parbhani
  stages: [
    stage("emergence", ["Sowing & emergence", "पेरणी व उगवण"], 0, 20, ["Seeds sprout and a flat rosette of leaves forms near the ground.", "बी रुजते व जमिनीलगत पानांचा गुच्छ (रोझेट) तयार होतो."], [
      t("sa-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow treated seed 5 cm deep while there is good moisture in the soil.", "जमिनीत चांगला ओलावा असताना बीजप्रक्रिया केलेले बियाणे 5 सेंमी खोल पेरा."]),
      t("sa-thin", 15, "other", ["Thin plants", "विरळणी करा"], ["Keep one healthy plant every 20 cm.", "दर 20 सेंमीवर एक निरोगी रोप ठेवा."]),
    ], [["Seedling blight in wet soil", "ओल्या जमिनीत रोपे करपणे"]]),
    stage("rosette", ["Rosette & stem growth", "रोझेट व खोड वाढ"], 20, 55, ["Roots go deep; the stem starts to grow up and branch.", "मुळे खोल जातात; खोड वर वाढून फांद्या फुटतात."], [
      t("sa-weed", 20, "weeding", ["Hoeing and weeding", "कोळपणी व खुरपणी"], ["Do 2–3 hoeings; they also close soil cracks and save moisture.", "2–3 कोळपण्या करा; त्यामुळे भेगा बुजतात व ओलावा टिकतो."], 15),
      t("sa-obs1", 30, "observation", ["Check for aphids", "मावा तपासा"], ["Look for black aphids on shoot tips, especially in cloudy weather.", "विशेषतः ढगाळ हवेत शेंड्यांवर काळा मावा पाहा."], 7),
      t("sa-irr1", 45, "irrigation", ["Light irrigation (if available)", "हलके पाणी (उपलब्ध असल्यास)"], ["One light watering at stem elongation helps; do not flood.", "खोड वाढताना एक हलके पाणी फायदेशीर; पाणी तुंबवू नका."]),
    ], [["Aphids", "मावा"]]),
    stage("branching", ["Branching & bud", "फांद्या व बोंडे"], 55, 80, ["Branches form buds (heads) at their tips.", "फांद्यांच्या टोकांना बोंडे येतात."], [
      t("sa-obs2", 56, "observation", ["Check leaves and buds", "पाने व बोंडे तपासा"], ["Look for aphids, leaf spots and caterpillars on buds.", "मावा, पानांवरील ठिपके व बोंडांवर अळी पाहा."], 7),
      t("sa-fly", 60, "observation", ["Watch for bud fly", "बोंडमाशी पाहा"], ["Rotting buds with maggots inside mean bud fly; remove them.", "आत अळ्या असलेली सडलेली बोंडे म्हणजे बोंडमाशी; ती काढा."]),
    ], [["Alternaria leaf spot", "पानांवरील ठिपके (करपा)"], ["Bud fly", "बोंडमाशी"]]),
    stage("flowering", ["Flowering & seed filling", "फुलोरा व दाणे भरणे"], 80, 115, ["Yellow-orange flowers open; seeds fill inside the heads.", "पिवळी-नारिंगी फुले उमलतात; बोंडात दाणे भरतात."], [
      t("sa-irr2", 80, "irrigation", ["Light irrigation at flowering (if available)", "फुलोऱ्यात हलके पाणी (उपलब्ध असल्यास)"], ["Second protective watering if the soil is dry.", "जमीन कोरडी असल्यास दुसरे संरक्षित पाणी."]),
      t("sa-petals", 85, "other", ["Collect petals (optional)", "पाकळ्या गोळा करा (ऐच्छिक)"], ["Petals can be picked and dried for sale where there is a buyer.", "खरेदीदार असल्यास पाकळ्या खुडून वाळवून विकता येतात."]),
      t("sa-obs3", 90, "observation", ["Check heads", "बोंडे तपासा"], ["Look for caterpillars eating seed and for birds.", "दाणे खाणाऱ्या अळ्या व पक्षी पाहा."], 7),
    ], [["Caterpillars in heads", "बोंडातील अळी"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 115, 135, ["Plants and heads dry and seeds harden.", "झाडे व बोंडे वाळतात व दाणे टणक होतात."], [
      t("sa-mat", 115, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Leaves and heads turn brown and dry.", "पाने व बोंडे तपकिरी होऊन वाळतात."]),
      t("sa-harv", 120, "harvest", ["Harvest early in the morning", "सकाळी लवकर काढणी करा"], ["Spines are softer with morning dew; wear gloves and thick clothes. Dry and thresh.", "सकाळच्या दवाने काटे मऊ असतात; हातमोजे व जाड कपडे घाला. वाळवून मळणी करा."]),
    ], [["Seed shedding if harvest is delayed", "काढणी उशिरा झाल्यास दाणे गळणे"]]),
  ],
  commonProblems: [
    {
      name: b("Aphids", "मावा"),
      signs: b("Black aphids crowd on shoot tips; plants become stunted and sticky.", "शेंड्यांवर काळा मावा जमा होतो; झाडे खुरटी व चिकट होतात."),
      prevention: prevent("Sow on time (late-sown crop gets more aphids) and check tips weekly.", "वेळेवर पेरणी करा (उशिरा पेरणीला मावा जास्त) व दर आठवड्याला शेंडे तपासा."),
    },
    {
      name: b("Alternaria leaf spot", "पानांवरील ठिपके (करपा)"),
      signs: b("Brown spots with rings on leaves and bracts; leaves dry in humid weather.", "पानांवर व बोंडाच्या पाकळ्यांवर वलयांचे तपकिरी ठिपके; दमट हवेत पाने वाळतात."),
      prevention: prevent("Use clean seed, rotate crops and avoid excess irrigation.", "स्वच्छ बियाणे वापरा, फेरपालट करा व जास्त पाणी टाळा."),
    },
    {
      name: b("Wilt and root rot", "मर व मुळकूज"),
      signs: b("Plants droop and dry; roots are dark and rotten.", "झाडे मलूल होऊन वाळतात; मुळे काळी व कुजलेली."),
      prevention: prevent("Crop rotation, seed treatment and no waterlogging.", "फेरपालट, बीजप्रक्रिया व पाणी साचू न देणे."),
    },
  ],
  harvestSigns: b("Leaves and heads turn brown and dry; seeds are hard and white.", "पाने व बोंडे तपकिरी होऊन वाळतात; दाणे टणक व पांढरे होतात."),
  postHarvest: b("Dry seed well in the sun, clean out chaff and spines, and store in dry bags.", "दाणे उन्हात चांगले वाळवा, भुसा व काटे काढून स्वच्छ करा आणि कोरड्या पोत्यांत साठवा."),
  marketTips: b("Safflower oil is valued as a healthy oil. Clean seed fetches a better rate; check the support price.", "करडई तेल आरोग्यदायी म्हणून मागणीत असते. स्वच्छ दाण्यांना चांगला दर; हमीभाव तपासा."),
  source: "General practices from MPKV Rahuri (Solapur research station) and VNMKV Parbhani safflower guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
