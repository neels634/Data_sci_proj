import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "fenugreek",
  emoji: "🌿",
  name: b("Fenugreek (methi)", "मेथी"),
  aliases: ["fenugreek", "methi", "methee", "meethi", "menthi", "मेथी", "methi bhaji", "मेथीची भाजी"],
  category: "leafy",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada", "vidarbha", "konkan"],
  majorDistricts: b("Pune, Nashik, Ahilyanagar, Solapur (near city markets)", "पुणे, नाशिक, अहिल्यानगर, सोलापूर (शहरी बाजारांजवळ)"),
  tier: 2,
  seasons: [
    { season: "rabi", label: b("Rabi", "रब्बी"), sowingWindow: b("October–November (best season)", "ऑक्टोबर–नोव्हेंबर (सर्वात चांगला हंगाम)"), sowingMonths: [10, 11], durationDays: [30, 60] },
    { season: "kharif", label: b("Kharif", "खरीप"), sowingWindow: b("June–July, on raised beds", "जून–जुलै, गादीवाफ्यांवर"), sowingMonths: [6, 7], durationDays: [30, 45] },
    { season: "summer", label: b("Summer", "उन्हाळी"), sowingWindow: b("February–March, with regular irrigation", "फेब्रुवारी–मार्च, नियमित पाण्यासह"), sowingMonths: [2, 3], durationDays: [25, 40] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly in the field", "बियाणे; थेट शेतात पेरणी"),
  seedRate: b("10–12 kg seed per acre for leaf bunches.", "भाजीसाठी एकरी 10–12 किलो बियाणे."),
  spacing: b("Sow in lines 15–20 cm apart, or broadcast evenly on small flat beds.", "15–20 सेंमी अंतरावर ओळीत पेरा, किंवा लहान सपाट वाफ्यांत एकसारखे फोकून पेरा."),
  soil: b(
    "Loamy or medium black soil with good drainage. Methi does not like standing water.",
    "पाण्याचा चांगला निचरा होणारी पोयट्याची किंवा मध्यम काळी जमीन. मेथीला साचलेले पाणी आवडत नाही.",
  ),
  climate: b(
    "Cool, dry weather gives the best leaves. Heavy rain causes root rot; strong heat gives small leaves.",
    "थंड, कोरड्या हवेत पाने सर्वात चांगली येतात. जोराच्या पावसात मुळे कुजतात; कडक उन्हात पाने लहान राहतात.",
  ),
  irrigation: b(
    "Water right after sowing, then lightly every 5–7 days. In summer water more often. Avoid waterlogging.",
    "पेरणीनंतर लगेच पाणी, नंतर दर 5–7 दिवसांनी हलके पाणी. उन्हाळ्यात लवकर पाणी द्या. पाणी साचू देऊ नका.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure or compost before sowing. Methi is a legume and needs only a little nitrogen; give a light dose after a cutting if leaves look pale. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी चांगले कुजलेले शेणखत किंवा कंपोस्ट मिसळा. मेथी शेंगवर्गीय असल्याने थोडेच नत्र लागते; कापणीनंतर पाने फिकट दिसल्यास थोडे नत्र द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("sowing", ["Sowing & germination", "पेरणी व उगवण"], 0, 7, ["Seeds sprout in 3–5 days.", "3–5 दिवसांत बी उगवते."], [
      t("mt-sow", 0, "sowing", ["Prepare beds and sow", "वाफे तयार करून पेरणी करा"], ["Make fine, level beds with manure. Soak seed for a few hours, then sow in lines and cover lightly.", "शेणखत मिसळून भुसभुशीत, सपाट वाफे करा. बी काही तास भिजवून ओळीत पेरा व हलके झाका."]),
      t("mt-irr0", 1, "irrigation", ["Water lightly", "हलके पाणी द्या"], ["Keep the top soil moist until seeds sprout.", "बी उगवेपर्यंत वरची माती ओलसर ठेवा."], 3),
    ], [["Seed rot in wet, heavy soil", "ओल्या भारी जमिनीत बी कुजणे"]]),
    stage("early-growth", ["Early growth", "सुरुवातीची वाढ"], 7, 20, ["Seedlings grow their first true leaves.", "रोपांना खरी पाने येऊ लागतात."], [
      t("mt-irr1", 7, "irrigation", ["Irrigate", "पाणी द्या"], ["Light water every 5–7 days.", "दर 5–7 दिवसांनी हलके पाणी."], 6),
      t("mt-weed", 12, "weeding", ["Weeding", "खुरपणी"], ["Remove weeds by hand so bunches stay clean.", "जुड्या स्वच्छ राहाव्यात म्हणून हाताने तण काढा."]),
    ], [["Root rot: plants yellow and dry in patches", "मूळकुज: रोपे पट्ट्यांमध्ये पिवळी पडून सुकतात"]]),
    stage("leaf-growth", ["Leaf growth", "पानांची वाढ"], 20, 30, ["Plants grow fast and fill the bed.", "रोपे झपाट्याने वाढतात आणि वाफा भरतो."], [
      t("mt-irr2", 20, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep moisture even for soft, green leaves.", "कोवळ्या, हिरव्या पानांसाठी ओलावा सारखा ठेवा."], 5),
      t("mt-obs1", 21, "observation", ["Check leaves", "पाने तपासा"], ["Look for white powder on leaves and aphids on shoots.", "पानांवर पांढरी भुकटी आणि शेंड्यांवर मावा आहे का पाहा."], 5),
    ], [["Powdery mildew (white powder on leaves)", "भुरी (पानांवर पांढरी भुकटी)"], ["Aphids", "मावा"]]),
    stage("harvest", ["Harvest & cuttings", "काढणी व कापण्या"], 30, 60, ["Pull whole plants for bunches, or cut and let it regrow for 1–2 more cuttings.", "जुड्यांसाठी पूर्ण रोपे उपटा, किंवा कापून पुन्हा वाढू द्या व आणखी 1–2 कापण्या घ्या."], [
      t("mt-harv", 30, "harvest", ["First harvest", "पहिली काढणी करा"], ["Pull plants with roots, or cut 4–5 cm above the ground if you want regrowth. Harvest in the cool morning.", "मुळांसकट रोपे उपटा, किंवा पुन्हा वाढ हवी असल्यास जमिनीपासून 4–5 सेंमी वर कापा. सकाळी थंड वेळेत काढणी करा."]),
      t("mt-irr3", 31, "irrigation", ["Water after cutting", "कापणीनंतर पाणी द्या"], ["Water soon after cutting so new shoots come quickly.", "कापणीनंतर लगेच पाणी द्या, म्हणजे नवी फूट लवकर येते."], 6),
      t("mt-cut", 42, "harvest", ["Next cutting", "पुढची कापणी करा"], ["Cut again when new shoots are 15–20 cm long.", "नवी फूट 15–20 सेंमी झाली की पुन्हा कापा."], 12),
    ], [["Plants flowering and leaves turning tough", "रोपे फुलावर येऊन पाने जाड होणे"]]),
  ],
  flushes: { everyDays: 12, count: 2, note: b("Most farmers pull whole plants at 25–30 days. If you cut instead, you can take 1–2 more cuttings 10–15 days apart.", "बहुतेक शेतकरी 25–30 दिवसांनी पूर्ण रोपे उपटतात. कापणी केल्यास 10–15 दिवसांच्या अंतराने आणखी 1–2 कापण्या मिळतात.") },
  commonProblems: [
    { name: b("Powdery mildew", "भुरी"), signs: b("White powdery patches on leaves; leaves turn yellow and dry.", "पानांवर पांढरे भुकटीसारखे चट्टे; पाने पिवळी पडून सुकतात."), prevention: prevent("Don't sow too thick, keep good air flow and harvest on time.", "दाट पेरणी करू नका, हवा खेळती ठेवा आणि वेळेवर काढणी करा.") },
    { name: b("Root rot", "मूळकुज"), signs: b("Plants turn yellow, wilt and dry in patches; roots look rotten.", "रोपे पट्ट्यांमध्ये पिवळी पडून मलूल होतात व सुकतात; मुळे कुजलेली दिसतात."), prevention: prevent("Use well-drained raised beds, avoid over-watering and rotate with non-legume crops.", "निचरा होणारे गादीवाफे वापरा, जास्त पाणी देऊ नका आणि बिगर-शेंगवर्गीय पिकांसोबत फेरपालट करा.") },
    { name: b("Aphids", "मावा"), signs: b("Small insects on tender shoots; leaves curl and become sticky.", "कोवळ्या शेंड्यांवर लहान किडे; पाने मुरगळतात व चिकट होतात."), prevention: prevent("Check shoots often and use yellow sticky traps. Leaves are eaten soon after harvest, so always respect the waiting period on any label.", "शेंडे वारंवार तपासा आणि पिवळे चिकट सापळे लावा. काढणीनंतर लगेच भाजी खाल्ली जाते, त्यामुळे लेबलवरील प्रतीक्षा कालावधी नक्की पाळा.") },
  ],
  harvestSigns: b("Plants are 15–20 cm tall with soft, green leaves, about 25–30 days after sowing.", "पेरणीनंतर साधारण 25–30 दिवसांनी रोपे 15–20 सेंमी उंच, कोवळ्या हिरव्या पानांची होतात."),
  postHarvest: b(
    "Wash off soil from roots, remove yellow leaves, tie in bunches and keep in shade with a light sprinkle of water. Sell fresh the same day.",
    "मुळांची माती धुवा, पिवळी पाने काढा, जुड्या बांधा आणि थोडे पाणी शिंपडून सावलीत ठेवा. ताजी भाजी त्याच दिवशी विका.",
  ),
  marketTips: b(
    "Demand is high in winter. Sow small plots every 10–15 days for a steady supply. Fresh, clean bunches of even size fetch better rates.",
    "हिवाळ्यात मागणी जास्त असते. सतत माल मिळावा म्हणून दर 10–15 दिवसांनी लहान वाफ्यांत पेरणी करा. ताज्या, स्वच्छ व एकसारख्या जुड्यांना चांगला दर मिळतो.",
  ),
  varieties: [
    { name: "Pusa Early Bunching", note: b("Quick-growing leaf type (ICAR-IARI)", "लवकर वाढणारा भाजीचा वाण (ICAR-IARI)") },
    { name: "Pusa Kasuri", note: b("Kasuri methi with small, fragrant leaves and several cuttings (ICAR-IARI)", "लहान, सुगंधी पानांची कसुरी मेथी; अनेक कापण्या (ICAR-IARI)") },
  ],
  source: "General practices from MPKV Rahuri and ICAR-IIVR leafy vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
