import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "vari",
  emoji: "🌾",
  name: b("Vari (little millet)", "वरई"),
  aliases: ["vari", "varai", "vari tandul", "little millet", "samai", "वरई", "वरी", "वरीचे तांदूळ", "भगर", "bhagar"],
  category: "millet",
  lifecycle: "seasonal",
  regions: ["konkan", "western", "north"],
  majorDistricts: b("Nashik, Ahilyanagar, Pune, Thane, Palghar, Kolhapur", "नाशिक, अहिल्यानगर, पुणे, ठाणे, पालघर, कोल्हापूर"),
  tier: 2,
  seasons: [
    {
      season: "kharif",
      sowingWindow: b("June–July with the monsoon; hill farmers sow directly or transplant like nachni", "जून–जुलै, पावसासोबत; डोंगरी शेतकरी थेट पेरतात किंवा नाचणीसारखी लावणी करतात"),
      sowingMonths: [6, 7],
      durationDays: [90, 110],
    },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b(
    "Poor, shallow, light soils on hill slopes (varkas land). Must drain well.",
    "डोंगरउतारावरील हलकी, उथळ, कमी कसाची वरकस जमीन. पाण्याचा निचरा हवा.",
  ),
  climate: b("Monsoon crop of the Sahyadri hills; hardy, takes heavy rain and short dry spells.", "सह्याद्रीच्या डोंगरी भागाचे पावसाळी पीक; काटक, जास्त पाऊस व लहान खंड सहन करते."),
  seedRate: b("About 3–4 kg seed per acre for direct sowing in lines.", "ओळीत थेट पेरणीसाठी एकरी साधारण 3–4 किलो बियाणे."),
  spacing: b("25–30 cm between rows, about 8–10 cm between plants after thinning.", "ओळींत 25–30 सेंमी, विरळणीनंतर रोपांत साधारण 8–10 सेंमी."),
  irrigation: b("Rain-fed. No irrigation is usually needed.", "पावसावर येते. सहसा पाणी द्यावे लागत नाही."),
  nutrientGuide: b(
    "Mix farmyard manure or compost before sowing; give a little nitrogen about a month after sowing if the soil is poor. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी शेणखत किंवा कंपोस्ट मिसळा; जमीन कमी कसाची असल्यास पेरणीनंतर साधारण महिन्याने थोडे नत्र द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 15, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("vr-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow in lines 25–30 cm apart, shallow (2–3 cm), after good rain. Mix the small seed with sand or soil for even sowing.", "चांगल्या पावसानंतर 25–30 सेंमी ओळीत उथळ (2–3 सेंमी) पेरा. बारीक बी सारखे पडावे म्हणून वाळू किंवा मातीत मिसळा."]),
      t("vr-obs0", 8, "observation", ["Check germination", "उगवण तपासा"], ["Re-sow gaps within a week.", "खाडे आठवड्याच्या आत पुन्हा पेरा."]),
    ], [["Seed washed away by heavy rain on slopes", "उतारावर जोराच्या पावसाने बी वाहून जाणे"]]),
    stage("vegetative", ["Growth & tillering", "वाढ व फुटवे"], 15, 45, ["Plants grow and make tillers.", "रोपे वाढतात व फुटवे येतात."], [
      t("vr-thin", 16, "other", ["Thin plants", "विरळणी करा"], ["Keep one plant every 8–10 cm.", "दर 8–10 सेंमीवर एक रोप ठेवा."]),
      t("vr-weed", 20, "weeding", ["Weeding", "खुरपणी"], ["Weed once or twice in the first 40 days.", "पहिल्या 40 दिवसांत एक-दोनदा खुरपणी करा."], 15),
      t("vr-obs1", 25, "observation", ["Check young plants", "कोवळी रोपे तपासा"], ["Look for dead centre shoots (shoot fly).", "मधला पोंगा वाळणे (खोडमाशी) पाहा."], 7),
    ], [["Shoot fly", "खोडमाशी"]]),
    stage("flowering", ["Earhead & flowering", "लोंबी व फुलोरा"], 45, 70, ["Earheads come out and flower.", "लोंब्या बाहेर येतात व फुलतात."], [
      t("vr-obs2", 47, "observation", ["Check earheads", "लोंब्या तपासा"], ["Look for swollen grains full of black powder (grain smut).", "काळ्या भुकटीने भरलेले फुगलेले दाणे (काणी) पाहा."], 7),
      t("vr-rogue", 55, "other", ["Remove sick earheads", "रोगट लोंब्या काढा"], ["Cut smutted earheads into a bag and burn or bury them away from the field.", "काणी झालेल्या लोंब्या पिशवीत कापून शेतापासून दूर जाळा किंवा पुरा."]),
    ], [["Grain smut", "काणी"]]),
    stage("grain", ["Grain filling", "दाणे भरणे"], 70, 95, ["Grains fill and harden.", "दाणे भरतात व टणक होतात."], [
      t("vr-bird", 72, "other", ["Protect from birds", "पक्ष्यांपासून राखण"], ["Guard the crop in mornings and evenings.", "सकाळ-संध्याकाळ पिकाची राखण करा."]),
      t("vr-obs3", 80, "observation", ["Check grain", "दाणे तपासा"], ["Press a grain: when it is hard, harvest is near.", "दाणा दाबून पाहा: टणक झाल्यावर काढणी जवळ आली."]),
    ], [["Bird damage", "पक्ष्यांचे नुकसान"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 95, 110, ["Earheads turn straw coloured and grains are hard.", "लोंब्या पिवळसर होतात व दाणे टणक होतात."], [
      t("vr-mat", 95, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Most earheads straw coloured → harvest before grains shed.", "बहुतेक लोंब्या पिवळसर → दाणे गळण्याआधी काढणी करा."]),
      t("vr-harv", 98, "harvest", ["Harvest", "काढणी करा"], ["Cut plants, dry in the sun a few days and thresh.", "झाडे कापून काही दिवस उन्हात वाळवा व मळणी करा."]),
    ], [["Grain shedding if harvest is late", "उशिरा काढणीने दाणे गळणे"]]),
  ],
  commonProblems: [
    {
      name: b("Shoot fly", "खोडमाशी"),
      signs: b("The centre leaf of young plants dries (dead heart).", "कोवळ्या रोपांचे मधले पान वाळते."),
      prevention: prevent("Sow early with the monsoon; late sowing gets more shoot fly.", "पावसासोबत लवकर पेरणी करा; उशिरा पेरणीला खोडमाशी जास्त."),
    },
    {
      name: b("Grain smut", "काणी"),
      signs: b("Grains swell and are full of black powder.", "दाणे फुगतात व काळ्या भुकटीने भरलेले असतात."),
      prevention: prevent("Use clean seed from a healthy crop and remove smutted earheads early.", "निरोगी पिकाचे स्वच्छ बियाणे वापरा व काणी झालेल्या लोंब्या लवकर काढा."),
    },
    {
      name: b("Grain shedding", "दाणे गळणे"),
      signs: b("Ripe grains fall to the ground before or during harvest.", "पिकलेले दाणे काढणीआधी किंवा काढणीवेळी जमिनीवर गळतात."),
      prevention: b("Harvest as soon as most earheads turn straw coloured, preferably in the morning.", "बहुतेक लोंब्या पिवळसर होताच, शक्यतो सकाळी काढणी करा."),
    },
  ],
  harvestSigns: b("Most earheads are straw coloured and grains are hard.", "बहुतेक लोंब्या पिवळसर व दाणे टणक झाले आहेत."),
  postHarvest: b(
    "Dry the grain well and store in dry bags or bins. Dehusk (polish) it into vari rice (bhagar) only in small lots, because polished grain does not keep as long.",
    "दाणे चांगले वाळवून कोरड्या पोत्यांत किंवा कोठीत साठवा. पॉलिश केलेली वरई (भगर) जास्त टिकत नाही, म्हणून थोडी थोडी सडून घ्या.",
  ),
  marketTips: b(
    "Bhagar is in high demand during fasting days (Ekadashi, Navratri, Shravan). Clean, dehusked bhagar sells for much more than raw grain.",
    "उपवासाच्या दिवसांत (एकादशी, नवरात्र, श्रावण) भगरीला मोठी मागणी असते. स्वच्छ सडलेल्या भगरीला कच्च्या दाण्यापेक्षा खूप जास्त दर मिळतो.",
  ),
  varieties: [], // TODO: varieties — confirm with MPKV Rahuri (Igatpuri hill station) and Dr. BSKKV Dapoli which vari varieties are released
  source: "General practices from MPKV Rahuri (hill zone, Igatpuri) and Dr. BSKKV Dapoli small millet guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
