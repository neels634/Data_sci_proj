import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "dill",
  emoji: "🌿",
  name: b("Dill (shepu)", "शेपू"),
  aliases: ["dill", "shepu", "shepoo", "shepu bhaji", "शेपू", "शेपु", "suva", "sowa", "सोवा", "suwa"],
  category: "leafy",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada", "vidarbha"],
  majorDistricts: b("Pune, Nashik, Ahilyanagar (near city markets)", "पुणे, नाशिक, अहिल्यानगर (शहरी बाजारांजवळ)"),
  tier: 2,
  seasons: [
    { season: "rabi", label: b("Rabi", "रब्बी"), sowingWindow: b("October–December (best season)", "ऑक्टोबर–डिसेंबर (सर्वात चांगला हंगाम)"), sowingMonths: [10, 11, 12], durationDays: [45, 70] },
    { season: "kharif", label: b("Kharif", "खरीप"), sowingWindow: b("June–July, on raised beds", "जून–जुलै, गादीवाफ्यांवर"), sowingMonths: [6, 7], durationDays: [40, 60] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly in the field", "बियाणे; थेट शेतात पेरणी"),
  // TODO: confirm leaf-crop seed rate with MPKV Rahuri
  seedRate: b("About 2–4 kg seed per acre; sow thicker for leaf bunches.", "एकरी साधारण 2–4 किलो बियाणे; भाजीसाठी थोडी दाट पेरणी करा."),
  spacing: b("Sow in lines 20–25 cm apart, or broadcast evenly on flat beds.", "20–25 सेंमी अंतरावर ओळीत पेरा, किंवा सपाट वाफ्यांत एकसारखे फोकून पेरा."),
  soil: b(
    "Loamy or medium black soil with good drainage.",
    "पाण्याचा चांगला निचरा होणारी पोयट्याची किंवा मध्यम काळी जमीन.",
  ),
  climate: b(
    "Cool, dry weather suits it best. In heat it flowers quickly and leaves become few.",
    "थंड, कोरडी हवा सर्वात चांगली. उष्णतेत लवकर फुलावर येते आणि पाने कमी येतात.",
  ),
  irrigation: b(
    "Water right after sowing and keep the top soil moist until seeds sprout. Then light water every 5–7 days, and soon after each cutting.",
    "पेरणीनंतर लगेच पाणी द्या आणि बी उगवेपर्यंत वरची माती ओलसर ठेवा. नंतर दर 5–7 दिवसांनी हलके पाणी आणि प्रत्येक कापणीनंतर लगेच पाणी द्या.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure or compost before sowing. Give a light nitrogen dose after each cutting, as per soil test. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी चांगले कुजलेले शेणखत किंवा कंपोस्ट मिसळा. प्रत्येक कापणीनंतर माती परीक्षणानुसार थोडे नत्र द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("sowing", ["Sowing & germination", "पेरणी व उगवण"], 0, 10, ["Seeds sprout in about a week.", "साधारण आठवडाभरात बी उगवते."], [
      t("sh-sow", 0, "sowing", ["Prepare beds and sow", "वाफे तयार करून पेरणी करा"], ["Make fine, level beds with manure. Mix the small seed with fine soil or sand for even sowing; cover very lightly.", "शेणखत मिसळून भुसभुशीत, सपाट वाफे करा. बारीक बी एकसारखे पडावे म्हणून बारीक माती किंवा वाळूत मिसळून पेरा; अगदी हलके झाका."]),
      t("sh-irr0", 1, "irrigation", ["Water lightly", "हलके पाणी द्या"], ["Use a can or light flow so seeds don't wash away.", "बी वाहून जाऊ नये म्हणून झारीने किंवा हलक्या प्रवाहाने पाणी द्या."], 3),
    ], [["Seeds washed away by heavy watering", "जोराच्या पाण्याने बी वाहून जाणे"]]),
    stage("early-growth", ["Early growth", "सुरुवातीची वाढ"], 10, 30, ["Thin, feathery leaves grow.", "बारीक, पिसासारखी पाने वाढतात."], [
      t("sh-irr1", 10, "irrigation", ["Irrigate", "पाणी द्या"], ["Light water every 5–7 days.", "दर 5–7 दिवसांनी हलके पाणी."], 6),
      t("sh-weed", 15, "weeding", ["Weeding and thinning", "खुरपणी व विरळणी"], ["Remove weeds and pull extra plants where too crowded.", "तण काढा आणि जास्त दाट असेल तेथे जास्तीची रोपे उपटा."]),
      t("sh-obs1", 20, "observation", ["Check plants", "रोपे तपासा"], ["Look for aphids on tender tips.", "कोवळ्या शेंड्यांवर मावा आहे का पाहा."], 7),
    ], [["Aphids on tips", "शेंड्यांवर मावा"]]),
    stage("first-cut", ["First cutting", "पहिली कापणी"], 30, 40, ["Plants are 20–25 cm tall and ready to cut.", "रोपे 20–25 सेंमी उंच होऊन कापणीला तयार होतात."], [
      t("sh-cut1", 30, "harvest", ["First cutting", "पहिली कापणी करा"], ["Cut 5–6 cm above the ground in the cool morning, or pull whole plants if you want one harvest.", "सकाळी थंड वेळेत जमिनीपासून 5–6 सेंमी वर कापा, किंवा एकदाच काढणी हवी असल्यास पूर्ण रोपे उपटा."]),
      t("sh-fert1", 32, "fertiliser", ["Feed after cutting", "कापणीनंतर खत द्या"], ["Give a little nitrogen and water. Ask your agriculture officer for the amount.", "थोडे नत्र देऊन पाणी द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Wilting of cut bunches in sun", "उन्हात कापलेल्या जुड्या सुकणे"]]),
    stage("regrowth", ["Regrowth & more cuttings", "पुनर्वाढ व पुढील कापण्या"], 40, 70, ["New shoots grow; cut again before flower heads form.", "नवी फूट येते; फुलांचे गुच्छ येण्यापूर्वी पुन्हा कापा."], [
      t("sh-irr2", 40, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular light water keeps shoots tender.", "नियमित हलक्या पाण्याने फूट कोवळी राहते."], 6),
      t("sh-cut", 45, "harvest", ["Next cutting", "पुढची कापणी करा"], ["Cut when new shoots are 15–20 cm long.", "नवी फूट 15–20 सेंमी झाली की कापा."], 15),
      t("sh-obs2", 46, "observation", ["Watch for flower heads", "फुलांचे गुच्छ पाहा"], ["Once umbrella-like flower heads appear, leaves get tough — end the crop.", "छत्रीसारखे फुलांचे गुच्छ आले की पाने जाड होतात — पीक संपवा."], 7),
    ], [["Early flowering in heat", "उष्णतेत लवकर फुलावर येणे"]]),
  ],
  flushes: { everyDays: 15, count: 2, note: b("After the first cut at 30–40 days, take 1–2 more cuttings about 15 days apart.", "30–40 दिवसांनी पहिली कापणी, नंतर साधारण 15 दिवसांच्या अंतराने आणखी 1–2 कापण्या.") },
  commonProblems: [
    { name: b("Aphids", "मावा"), signs: b("Small insects crowd on tender tips; shoots curl and turn sticky.", "कोवळ्या शेंड्यांवर लहान किड्यांची गर्दी; फूट मुरगळते व चिकट होते."), prevention: prevent("Check tips weekly and use yellow sticky traps. Leaves are eaten soon after cutting, so always respect the waiting period on any label.", "दर आठवड्याला शेंडे तपासा आणि पिवळे चिकट सापळे लावा. कापणीनंतर लगेच भाजी खाल्ली जाते, त्यामुळे लेबलवरील प्रतीक्षा कालावधी नक्की पाळा.") },
    { name: b("Damping off and root rot", "रोपे कोलमडणे व मूळकुज"), signs: b("Young plants fall over at the base or yellow and dry in patches.", "लहान रोपे खोडाजवळून पडतात किंवा पट्ट्यांमध्ये पिवळी पडून सुकतात."), prevention: prevent("Use well-drained beds, don't over-water and avoid sowing too thick.", "निचरा होणारे वाफे वापरा, जास्त पाणी देऊ नका आणि दाट पेरणी टाळा.") },
  ],
  harvestSigns: b("Plants are 20–25 cm tall with soft, feathery, fragrant leaves, before flower heads appear.", "फुलांचे गुच्छ येण्यापूर्वी रोपे 20–25 सेंमी उंच, कोवळ्या, पिसासारख्या, सुगंधी पानांची होतात."),
  postHarvest: b(
    "Remove yellow leaves, tie in bunches and keep in shade with a light sprinkle of water. Sell fresh the same day.",
    "पिवळी पाने काढा, जुड्या बांधा आणि थोडे पाणी शिंपडून सावलीत ठेवा. ताजी भाजी त्याच दिवशी विका.",
  ),
  marketTips: b(
    "Shepu is a smaller-volume green, so check how much your local market takes before sowing a large area. Fresh, clean bunches sell best in winter.",
    "शेपूची मागणी मर्यादित असते, त्यामुळे मोठ्या क्षेत्रावर पेरणीपूर्वी स्थानिक बाजारात किती खप आहे ते पाहा. हिवाळ्यात ताज्या, स्वच्छ जुड्यांना चांगला दर मिळतो.",
  ),
  varieties: [], // TODO: varieties — confirm with MPKV Rahuri (local strains are mostly used)
  source: "General practices from MPKV Rahuri leafy vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
