import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "rala",
  emoji: "🌾",
  name: b("Rala (foxtail millet)", "राळा"),
  aliases: ["rala", "raala", "foxtail millet", "kangni","राळा", "राळे", "कांगणी", "कंगनी"],
  category: "millet",
  lifecycle: "seasonal",
  regions: ["western", "marathwada"],
  tier: 2,
  seasons: [
    { season: "kharif", sowingWindow: b("Late June to July, after good rain (rain-fed)", "जून अखेर ते जुलै, चांगल्या पावसानंतर (कोरडवाहू)"), sowingMonths: [6, 7], durationDays: [75, 90] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b("Light to medium, well-drained soil. Grows on poor soils; avoid waterlogged fields.", "हलकी ते मध्यम, निचरा होणारी जमीन. कमी कसाच्या जमिनीतही येते; पाणी साचणारे शेत टाळा."),
  climate: b("Short, hardy crop for low-rain areas; useful as a late or contingency crop when rains start late.", "कमी पावसाच्या भागासाठी कमी कालावधीचे काटक पीक; पाऊस उशिरा आल्यास पर्यायी पीक म्हणून उपयोगी."),
  seedRate: b("About 3–4 kg seed per acre.", "एकरी साधारण 3–4 किलो बियाणे."),
  spacing: b("25–30 cm between rows, 8–10 cm between plants after thinning.", "ओळींत 25–30 सेंमी, विरळणीनंतर रोपांत 8–10 सेंमी."),
  irrigation: b("Rain-fed. If a long dry spell comes at flowering and water is available, give one irrigation.", "पावसावर येते. फुलोऱ्यात मोठा खंड पडल्यास व पाणी उपलब्ध असल्यास एक पाणी द्या."),
  nutrientGuide: b("Mix farmyard manure before sowing. Give a little nitrogen at sowing and some about a month later if soil is poor. Ask your agriculture officer for amounts.", "पेरणीपूर्वी शेणखत मिसळा. जमीन कमी कसाची असल्यास थोडे नत्र पेरणीवेळी व थोडे महिन्याने द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 12, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("rl-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow shallow (2–3 cm) in rows 25–30 cm apart. Mix the small seed with sand for even sowing.", "25–30 सेंमी ओळीत उथळ (2–3 सेंमी) पेरा. बारीक बी सारखे पडावे म्हणून वाळूत मिसळा."]),
      t("rl-obs0", 7, "observation", ["Check germination", "उगवण तपासा"], ["Re-sow gaps within a week.", "खाडे आठवड्याच्या आत पुन्हा पेरा."]),
    ], [["Crust on soil after heavy rain stops seedlings", "जोराच्या पावसानंतर जमिनीवर कडक थर आल्याने रोपे वर येत नाहीत"]]),
    stage("vegetative", ["Growth & tillering", "वाढ व फुटवे"], 12, 40, ["Plants grow and make tillers.", "रोपे वाढतात व फुटवे येतात."], [
      t("rl-thin", 15, "other", ["Thin plants", "विरळणी करा"], ["Keep one plant every 8–10 cm.", "दर 8–10 सेंमीवर एक रोप ठेवा."]),
      t("rl-weed", 18, "weeding", ["Weeding and hoeing", "खुरपणी व कोळपणी"], ["One hoeing and one hand weeding in the first 35 days.", "पहिल्या 35 दिवसांत एक कोळपणी व एक खुरपणी करा."], 15),
      t("rl-obs1", 20, "observation", ["Check young plants", "कोवळी रोपे तपासा"], ["Look for dead centre shoots (shoot fly) and spots on leaves.", "मधला पोंगा वाळणे (खोडमाशी) व पानांवरील ठिपके पाहा."], 7),
    ], [["Shoot fly", "खोडमाशी"]]),
    stage("flowering", ["Earhead & flowering", "कणीस व फुलोरा"], 40, 60, ["Bristly, tail-like earheads come out and flower.", "कोल्ह्याच्या शेपटीसारखी केसाळ कणसे बाहेर येतात व फुलतात."], [
      t("rl-obs2", 42, "observation", ["Check earheads", "कणसे तपासा"], ["Look for grains full of black powder (smut) and grey spots on leaves (blast).", "काळ्या भुकटीचे दाणे (काणी) व पानांवर राखाडी ठिपके (करपा) पाहा."], 7),
      t("rl-irr", 45, "irrigation", ["Protective irrigation", "संरक्षित पाणी"], ["Only if there is a long dry spell and water is available.", "मोठा खंड पडल्यास व पाणी उपलब्ध असल्यासच."]),
    ], [["Smut", "काणी"], ["Blast", "करपा"]]),
    stage("grain", ["Grain filling", "दाणे भरणे"], 60, 75, ["Grains fill and harden.", "दाणे भरतात व टणक होतात."], [
      t("rl-bird", 60, "other", ["Protect from birds", "पक्ष्यांपासून राखण"], ["Birds love rala; guard in mornings and evenings.", "पक्ष्यांना राळा फार आवडतो; सकाळ-संध्याकाळ राखण करा."]),
      t("rl-obs3", 65, "observation", ["Check grain", "दाणे तपासा"], ["Press a grain: when it is hard, harvest is near.", "दाणा दाबून पाहा: टणक झाल्यावर काढणी जवळ आली."]),
    ], [["Bird damage", "पक्ष्यांचे नुकसान"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 75, 90, ["Earheads turn yellow and grains are hard.", "कणसे पिवळी होतात व दाणे टणक होतात."], [
      t("rl-mat", 75, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Earheads yellow and dry → harvest before grains shed.", "कणसे पिवळी व कोरडी → दाणे गळण्याआधी काढणी करा."]),
      t("rl-harv", 78, "harvest", ["Harvest", "काढणी करा"], ["Cut earheads, dry in the sun and thresh.", "कणसे कापून उन्हात वाळवा व मळणी करा."]),
    ], [["Grain shedding if harvest is late", "उशिरा काढणीने दाणे गळणे"]]),
  ],
  commonProblems: [
    {
      name: b("Shoot fly", "खोडमाशी"),
      signs: b("The centre leaf of young plants dries (dead heart).", "कोवळ्या रोपांचे मधले पान वाळते."),
      prevention: prevent("Sow on time with the first good rains and use a little extra seed, then thin.", "पहिल्या चांगल्या पावसात वेळेवर पेरणी करा, थोडे जास्त बियाणे वापरून नंतर विरळणी करा."),
    },
    {
      name: b("Blast", "करपा"),
      signs: b("Grey, eye-shaped spots with brown edges on leaves.", "पानांवर तपकिरी कडांचे राखाडी, डोळ्याच्या आकाराचे ठिपके."),
      prevention: prevent("Use clean seed and remove crop leftovers; rotate with pulses.", "स्वच्छ बियाणे वापरा, पिकाचे अवशेष काढा; कडधान्यांसोबत फेरपालट करा."),
    },
    {
      name: b("Smut", "काणी"),
      signs: b("Grains swell and are full of black powder.", "दाणे फुगतात व काळ्या भुकटीने भरलेले असतात."),
      prevention: prevent("Use clean seed and remove smutted earheads early.", "स्वच्छ बियाणे वापरा व काणी झालेली कणसे लवकर काढा."),
    },
  ],
  harvestSigns: b("Earheads are yellow and dry, grains are hard.", "कणसे पिवळी व कोरडी, दाणे टणक झाले आहेत."),
  postHarvest: b("Dry the grain well, clean and store in dry bags. Dehusk in small lots as needed.", "दाणे चांगले वाळवून स्वच्छ करा व कोरड्या पोत्यांत साठवा. गरजेनुसार थोडे थोडे सडून घ्या."),
  marketTips: b(
    "Rala is mostly sold in small lots; dehusked grain and millet products (flakes, flour) earn more. Demand from health-food buyers is growing.",
    "राळा बहुतेक थोड्या प्रमाणात विकला जातो; सडलेले दाणे व तृणधान्य उत्पादने (पोहे, पीठ) केल्यास जास्त दर मिळतो. आरोग्यदायी अन्नाच्या खरेदीदारांकडून मागणी वाढत आहे.",
  ),
  varieties: [], // TODO: varieties — confirm with MPKV Rahuri / VNMKV Parbhani which foxtail millet varieties are recommended for Maharashtra
  source: "General practices from MPKV Rahuri, VNMKV Parbhani and ICAR-IIMR (small millets) guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
