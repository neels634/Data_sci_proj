import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "bajra",
  emoji: "🌾",
  name: b("Bajra (pearl millet)", "बाजरी"),
  aliases: ["bajra", "bajri", "bajara", "pearl millet", "बाजरी", "बाजरा"],
  category: "millet",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada"],
  majorDistricts: b("Ahilyanagar, Nashik, Dhule, Jalgaon, Pune, Beed", "अहिल्यानगर, नाशिक, धुळे, जळगाव, पुणे, बीड"),
  tier: 1,
  seasons: [
    { season: "kharif", sowingWindow: b("Mid-June to mid-July, after 75–100 mm of rain (rain-fed)", "जून मध्य ते जुलै मध्य, 75–100 मिमी पाऊस झाल्यावर (कोरडवाहू)"), sowingMonths: [6, 7], durationDays: [80, 90] },
    { season: "summer", sowingWindow: b("Mid-January to February (irrigated only)", "जानेवारी मध्य ते फेब्रुवारी (फक्त बागायती)"), sowingMonths: [1, 2], durationDays: [85, 95] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b(
    "Light to medium, well-drained soil. Does well on shallow and sandy soils where other crops fail. Avoid waterlogged fields.",
    "हलकी ते मध्यम, पाण्याचा निचरा होणारी जमीन. इतर पिके न येणाऱ्या हलक्या व वाळूमिश्रित जमिनीतही चांगली येते. पाणी साचणारे शेत टाळा.",
  ),
  climate: b(
    "Hot and dry. Handles low rain and dry spells well, but rain at flowering spoils grain setting.",
    "उष्ण व कोरडी हवा. कमी पाऊस व खंड चांगला सहन करते, पण फुलोऱ्यात पाऊस पडल्यास दाणे कमी भरतात.",
  ),
  seedRate: b("About 1.5–2 kg seed per acre.", "एकरी साधारण 1.5–2 किलो बियाणे."),
  spacing: b("45 cm between rows, 10–15 cm between plants.", "ओळींत 45 सेंमी, रोपांत 10–15 सेंमी."),
  irrigation: b(
    "Kharif bajra is rain-fed; if water is available give protective irrigation in a long dry spell, especially at flowering and grain filling. Summer bajra needs water every 8–12 days.",
    "खरीप बाजरी पावसावर येते; पावसाचा मोठा खंड पडल्यास, विशेषतः फुलोरा व दाणे भरताना, पाणी उपलब्ध असल्यास संरक्षित पाणी द्या. उन्हाळी बाजरीला दर 8–12 दिवसांनी पाणी लागते.",
  ),
  nutrientGuide: b(
    "Use a soil test. Mix farmyard manure before sowing. Give half the nitrogen at sowing and the rest about a month later when the soil is moist. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. पेरणीपूर्वी शेणखत मिसळा. निम्मे नत्र पेरणीवेळी व उरलेले साधारण महिन्याने जमिनीत ओल असताना द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 12, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("bj-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow in 45 cm rows, 2–3 cm deep, once there is good moisture. Use fresh, treated seed of a known variety.", "चांगली ओल झाल्यावर 45 सेंमी ओळीत, 2–3 सेंमी खोल पेरा. ओळखीच्या वाणाचे नवे, प्रक्रिया केलेले बियाणे वापरा."]),
      t("bj-obs0", 6, "observation", ["Check germination", "उगवण तपासा"], ["If many gaps, re-sow them within a week.", "खाडे जास्त असल्यास आठवड्याच्या आत पुन्हा पेरा."]),
    ], [["Poor germination if seed is sown too deep", "बी खोल पडल्यास उगवण कमी"]]),
    stage("vegetative", ["Plant growth & tillering", "वाढ व फुटवे"], 12, 40, ["Leaves grow and the plant makes side tillers.", "पाने वाढतात व फुटवे येतात."], [
      t("bj-thin", 14, "other", ["Thin and fill gaps", "विरळणी व खाडे भरणे"], ["Keep one plant every 10–15 cm. Use pulled seedlings to fill gaps on a rainy day.", "दर 10–15 सेंमीवर एक रोप ठेवा. काढलेली रोपे पावसाळी दिवशी खाड्यांत लावा."]),
      t("bj-obs1", 15, "observation", ["Check plants", "रोपे तपासा"], ["Look for yellow striped leaves with white growth below (downy mildew). Pull out and destroy such plants.", "पिवळ्या रेषांची पाने व खाली पांढरी बुरशी (गोसावी) पाहा. अशी रोपे उपटून नष्ट करा."], 7),
      t("bj-weed", 20, "weeding", ["Weeding and hoeing", "खुरपणी व कोळपणी"], ["Do 1–2 hoeings and one hand weeding by about 30 days.", "साधारण 30 दिवसांपर्यंत 1–2 कोळपण्या व एक खुरपणी करा."], 12),
      t("bj-fert", 30, "fertiliser", ["Top dressing", "वरखत"], ["Give the rest of the nitrogen when the soil is moist. Ask your agriculture officer for the amount.", "जमिनीत ओल असताना उरलेले नत्र द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Downy mildew (gosavi)", "गोसावी (केवडा)"], ["Shoot fly in late-sown crop", "उशिरा पेरणीत खोडमाशी"]]),
    stage("flowering", ["Earhead & flowering", "कणीस व फुलोरा"], 40, 60, ["Earheads come out and flower.", "कणसे बाहेर येतात व फुलतात."], [
      t("bj-obs2", 42, "observation", ["Check earheads", "कणसे तपासा"], ["Look for honey-like sticky drops on earheads (ergot) and green leafy earheads (gosavi).", "कणसांवर मधासारखे चिकट थेंब (अरगट) व पानांसारखी हिरवी कणसे (गोसावी) पाहा."], 7),
      t("bj-irr1", 45, "irrigation", ["Irrigation at flowering", "फुलोऱ्यात पाणी"], ["If the soil is dry and water is available, irrigate now — it matters most.", "जमीन कोरडी असल्यास व पाणी उपलब्ध असल्यास आता पाणी द्या — हे सर्वात महत्त्वाचे."]),
    ], [["Ergot (chikta)", "अरगट (चिकटा)"]]),
    stage("grain", ["Grain filling", "दाणे भरणे"], 60, 80, ["Grains fill and harden.", "दाणे भरतात व टणक होतात."], [
      t("bj-irr2", 62, "irrigation", ["Irrigation at grain filling", "दाणे भरताना पाणी"], ["If water is available and the soil is dry.", "पाणी उपलब्ध असल्यास व जमीन कोरडी असल्यास."]),
      t("bj-bird", 65, "other", ["Protect from birds", "पक्ष्यांपासून राखण करा"], ["Guard earheads in the mornings and evenings.", "सकाळ-संध्याकाळ कणसांची राखण करा."]),
      t("bj-obs3", 66, "observation", ["Check grain", "दाणे तपासा"], ["Look for black powdery grains (smut) and remove sick earheads.", "काळ्या भुकटीचे दाणे (काणी) पाहा व रोगट कणसे काढा."], 7),
    ], [["Smut", "काणी"], ["Bird damage", "पक्ष्यांचे नुकसान"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 80, 95, ["Grains are hard and the plant dries.", "दाणे टणक होतात व झाड वाळू लागते."], [
      t("bj-mat", 80, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Grain hard with a black spot at its base → ready.", "दाणा टणक व तळाशी काळा ठिपका → तयार."]),
      t("bj-harv", 83, "harvest", ["Harvest", "काढणी करा"], ["Cut earheads, dry them in the sun and thresh. Stack the stalks (sarmad) for fodder.", "कणसे खुडून उन्हात वाळवा व मळणी करा. सरमाड चाऱ्यासाठी रचून ठेवा."]),
    ], [["Rain on cut earheads causes mould and sprouting", "कापलेल्या कणसांवर पाऊस पडल्यास बुरशी व मोड"]]),
  ],
  commonProblems: [
    {
      name: b("Downy mildew / green ear (gosavi)", "गोसावी (केवडा)"),
      signs: b("Yellow streaks on leaves with white growth underneath; the earhead turns into a green, leafy mass.", "पानांवर पिवळ्या रेषा व खालच्या बाजूला पांढरी बुरशी; कणसाचे हिरव्या पानांसारख्या गुच्छात रूपांतर होते."),
      prevention: prevent("Grow resistant varieties, use treated seed, and pull out and destroy sick plants early. Do not grow bajra in the same field every year.", "प्रतिकारक वाण घ्या, प्रक्रिया केलेले बियाणे वापरा व रोगट रोपे लवकर उपटून नष्ट करा. एकाच शेतात दरवर्षी बाजरी घेऊ नका."),
    },
    {
      name: b("Ergot", "अरगट (चिकटा)"),
      signs: b("Pink, honey-like sticky drops ooze from flowers; later hard dark bodies form in place of grains. These are poisonous.", "फुलांतून गुलाबी, मधासारखा चिकट द्राव येतो; नंतर दाण्यांच्या जागी कडक काळसर गाठी तयार होतात. त्या विषारी असतात."),
      prevention: prevent("Sow on time so flowering misses heavy rain. Before sowing, float seed in salt water and throw away the floating ergot pieces.", "फुलोऱ्यात जोराचा पाऊस टळेल अशी वेळेवर पेरणी करा. पेरणीपूर्वी बियाणे मिठाच्या पाण्यात टाकून वर तरंगणाऱ्या अरगटाच्या गाठी फेकून द्या."),
    },
    {
      name: b("Smut", "काणी"),
      signs: b("Some grains become larger, green then black, and burst with black powder.", "काही दाणे मोठे होतात, हिरवे मग काळे होऊन फुटतात व काळी भुकटी निघते."),
      prevention: prevent("Use clean seed, remove sick earheads and rotate crops.", "स्वच्छ बियाणे वापरा, रोगट कणसे काढा व पिकांची फेरपालट करा."),
    },
    {
      name: b("Shoot fly", "खोडमाशी"),
      signs: b("The centre leaf of young plants dries (dead heart).", "कोवळ्या रोपांचे मधले पान वाळते."),
      prevention: prevent("Sow early with the first good rains; late sowing gets more shoot fly. Use a slightly higher seed rate and thin later.", "पहिल्या चांगल्या पावसात लवकर पेरणी करा; उशिरा पेरणीला खोडमाशी जास्त. थोडे जास्त बियाणे वापरून नंतर विरळणी करा."),
    },
  ],
  harvestSigns: b("Grains are hard, earheads and leaves turn dry, and a black spot shows at the base of the grain.", "दाणे टणक, कणसे व पाने वाळलेली आणि दाण्याच्या तळाशी काळा ठिपका दिसतो."),
  postHarvest: b(
    "Dry the grain well in the sun and store in clean, dry bags or bins. Bajra grain flour goes stale quickly, so grind small amounts at a time. Keep the stalks dry for fodder.",
    "धान्य उन्हात चांगले वाळवून स्वच्छ, कोरड्या पोत्यांत किंवा कोठीत साठवा. बाजरीचे पीठ लवकर खवट होते, म्हणून थोडे थोडे दळा. सरमाड चाऱ्यासाठी कोरडे ठेवा.",
  ),
  marketTips: b(
    "Clean, bold, well-dried grain gets a better rate. Check the support price. Demand rises in winter. Iron-rich varieties and millet products are a growing market.",
    "स्वच्छ, टपोऱ्या व चांगल्या वाळलेल्या धान्याला चांगला दर मिळतो. हमीभाव तपासा. हिवाळ्यात मागणी वाढते. लोहयुक्त वाण व तृणधान्य उत्पादनांची बाजारपेठ वाढत आहे.",
  ),
  varieties: [
    { name: "Dhanshakti", note: b("Iron-rich variety from ICRISAT, released through MPKV", "इक्रिसॅटचा लोहयुक्त वाण, मफुकृवि मार्फत प्रसारित") },
    { name: "Phule Adishakti", note: b("Iron-rich variety from MPKV Rahuri", "मफुकृवि राहुरीचा लोहयुक्त वाण") },
  ],
  source: "General practices from MPKV Rahuri, VNMKV Parbhani and ICAR-AICRP on pearl millet guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
