import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "spinach",
  emoji: "🥬",
  name: b("Spinach", "पालक"),
  aliases: ["spinach", "palak", "paalak", "palakh", "पालक", "पालख"],
  category: "leafy",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada", "vidarbha", "konkan"],
  majorDistricts: b("Pune, Nashik, Ahilyanagar, Thane (near city markets)", "पुणे, नाशिक, अहिल्यानगर, ठाणे (शहरी बाजारांजवळ)"),
  tier: 2,
  seasons: [
    { season: "rabi", label: b("Rabi", "रब्बी"), sowingWindow: b("September–November (best season)", "सप्टेंबर–नोव्हेंबर (सर्वात चांगला हंगाम)"), sowingMonths: [9, 10, 11], durationDays: [75, 90] },
    { season: "kharif", label: b("Kharif", "खरीप"), sowingWindow: b("June–July, on raised beds that drain well", "जून–जुलै, पाण्याचा निचरा होणाऱ्या गादीवाफ्यांवर"), sowingMonths: [6, 7], durationDays: [60, 75] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly in the field", "बियाणे; थेट शेतात पेरणी"),
  seedRate: b("10–12 kg seed per acre.", "एकरी 10–12 किलो बियाणे."),
  spacing: b("Sow in lines 20–25 cm apart, or broadcast evenly on flat beds.", "20–25 सेंमी अंतरावर ओळीत पेरा, किंवा सपाट वाफ्यांत एकसारखे फोकून पेरा."),
  soil: b(
    "Loamy or medium black soil rich in organic matter, with good drainage.",
    "सेंद्रिय पदार्थ भरपूर असलेली, पाण्याचा चांगला निचरा होणारी पोयट्याची किंवा मध्यम काळी जमीन.",
  ),
  climate: b(
    "Likes cool weather. In hot weather it flowers early and leaves become small.",
    "थंड हवामान आवडते. उष्ण हवेत लवकर फुलावर येते आणि पाने लहान होतात.",
  ),
  irrigation: b(
    "Light, frequent water. Water right after sowing, then every 5–7 days in winter and more often in heat. Water soon after each cutting.",
    "हलके व वारंवार पाणी. पेरणीनंतर लगेच पाणी, मग हिवाळ्यात दर 5–7 दिवसांनी आणि उन्हाळ्यात लवकर. प्रत्येक कापणीनंतर लगेच पाणी द्या.",
  ),
  nutrientGuide: b(
    "Mix plenty of well-rotted farmyard manure or compost before sowing. Leafy crops need nitrogen; give a light dose after each cutting, as per soil test. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी भरपूर चांगले कुजलेले शेणखत किंवा कंपोस्ट मिसळा. पालेभाजीला नत्राची गरज असते; प्रत्येक कापणीनंतर माती परीक्षणानुसार थोडे नत्र द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("sowing", ["Sowing & germination", "पेरणी व उगवण"], 0, 10, ["Seeds sprout in 6–8 days.", "6–8 दिवसांत बी उगवते."], [
      t("sp-sow", 0, "sowing", ["Prepare beds and sow", "वाफे तयार करून पेरणी करा"], ["Make fine, level beds with manure. Soak seed in water overnight for faster sprouting, then sow in lines.", "शेणखत मिसळून भुसभुशीत, सपाट वाफे करा. लवकर उगवणीसाठी बी रात्रभर पाण्यात भिजवा, मग ओळीत पेरा."]),
      t("sp-irr0", 1, "irrigation", ["Water lightly", "हलके पाणी द्या"], ["Keep the top soil moist until seeds sprout. Don't let water stand.", "बी उगवेपर्यंत वरची माती ओलसर ठेवा. पाणी साचू देऊ नका."], 4),
    ], [["Poor sprouting in crusted or dry soil", "कडक किंवा कोरड्या मातीत उगवण कमी"]]),
    stage("early-growth", ["Early growth", "सुरुवातीची वाढ"], 10, 30, ["Young plants grow their first leaves.", "लहान रोपांना पहिली पाने येतात."], [
      t("sp-irr1", 10, "irrigation", ["Irrigate", "पाणी द्या"], ["Light water every 5–7 days.", "दर 5–7 दिवसांनी हलके पाणी."], 6),
      t("sp-thin", 12, "other", ["Thin crowded plants", "दाट रोपे विरळ करा"], ["Pull extra plants so each has room to grow big leaves.", "जास्तीची रोपे उपटा, म्हणजे प्रत्येक रोपाला मोठी पाने येण्यास जागा मिळते."]),
      t("sp-weed", 15, "weeding", ["Weeding", "खुरपणी"], ["Remove weeds by hand; weeds mixed in bunches lower the price.", "हाताने तण काढा; जुडीत तण मिसळल्यास दर कमी मिळतो."]),
      t("sp-obs1", 18, "observation", ["Check leaves", "पाने तपासा"], ["Look for aphids under leaves and small brown spots.", "पानांखाली मावा आणि लहान तपकिरी ठिपके आहेत का पाहा."], 7),
    ], [["Aphids under leaves", "पानांखाली मावा"], ["Leaf spots", "पानांवरील ठिपके"]]),
    stage("first-cut", ["First cutting", "पहिली कापणी"], 30, 40, ["Leaves are big enough for the first cutting.", "पहिल्या कापणीसाठी पाने पुरेशी मोठी होतात."], [
      t("sp-cut1", 30, "harvest", ["First cutting", "पहिली कापणी करा"], ["Cut leaves 4–5 cm above the ground so new leaves grow back. Cut in the cool morning.", "जमिनीपासून 4–5 सेंमी वर कापा, म्हणजे पुन्हा पाने येतात. सकाळी थंड वेळेत कापा."]),
      t("sp-fert1", 32, "fertiliser", ["Feed after cutting", "कापणीनंतर खत द्या"], ["Give a light nitrogen dose after cutting, then water. Ask your agriculture officer for the amount.", "कापणीनंतर थोडे नत्र देऊन पाणी द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Wilting of cut plants in hot sun", "उन्हात कापलेली रोपे सुकणे"]]),
    stage("regrowth", ["Regrowth & more cuttings", "पुनर्वाढ व पुढील कापण्या"], 40, 90, ["New leaves grow after each cut; take a cutting every 15 days or so.", "प्रत्येक कापणीनंतर नवी पाने येतात; साधारण दर 15 दिवसांनी कापणी करा."], [
      t("sp-irr2", 40, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular light water keeps leaves soft and green.", "नियमित हलके पाणी दिल्यास पाने कोवळी व हिरवी राहतात."], 6),
      t("sp-obs2", 42, "observation", ["Watch for flower stalks and pests", "फुलांचे दांडे व कीड पाहा"], ["When plants start sending up flower stalks, leaves turn bitter — finish cutting soon.", "रोपांना फुलांचे दांडे येऊ लागले की पाने कडवट होतात — लवकर कापणी संपवा."], 7),
      t("sp-cut", 45, "harvest", ["Next cutting", "पुढची कापणी करा"], ["Cut in the morning, tie bunches and keep them in shade.", "सकाळी कापा, जुड्या बांधा आणि सावलीत ठेवा."], 15),
    ], [["Bolting (early flowering) in heat", "उष्णतेमुळे लवकर फुलावर येणे"], ["Caterpillars eating leaves", "पाने खाणाऱ्या अळ्या"]]),
  ],
  flushes: { everyDays: 15, count: 4, note: b("After the first cutting at about 30 days, take 3–4 more cuttings every 12–15 days.", "साधारण 30 दिवसांनी पहिली कापणी, नंतर दर 12–15 दिवसांनी आणखी 3–4 कापण्या.") },
  commonProblems: [
    { name: b("Leaf spot", "पानांवरील ठिपके"), signs: b("Small round brown or grey spots on leaves; leaves look unclean and don't sell well.", "पानांवर लहान गोल तपकिरी किंवा राखाडी ठिपके; पाने खराब दिसतात व विकली जात नाहीत."), prevention: prevent("Avoid overhead watering in the evening, don't crowd plants, and remove spotted leaves.", "संध्याकाळी वरून पाणी देणे टाळा, रोपे दाट ठेवू नका आणि ठिपके असलेली पाने काढा.") },
    { name: b("Aphids", "मावा"), signs: b("Small soft insects in groups under leaves; leaves curl and get sticky.", "पानांखाली लहान मऊ किड्यांचे थवे; पाने मुरगळतात व चिकट होतात."), prevention: prevent("Check under leaves weekly and use yellow sticky traps. Leafy crops are eaten soon after cutting, so always check the waiting period before any spray.", "दर आठवड्याला पानांखाली तपासा आणि पिवळे चिकट सापळे लावा. पालेभाजी कापणीनंतर लगेच खाल्ली जाते, त्यामुळे कोणत्याही फवारणीपूर्वी प्रतीक्षा कालावधी तपासा.") },
    { name: b("Bolting (early flowering)", "लवकर फुलावर येणे"), signs: b("A flower stalk grows from the centre and leaves become small and bitter.", "मधोमध फुलांचा दांडा येतो आणि पाने लहान व कडवट होतात."), prevention: b("Sow in the cool season and keep moisture even.", "थंड हंगामात पेरणी करा आणि ओलावा सारखा ठेवा.") },
  ],
  harvestSigns: b("Leaves are 15–20 cm long, dark green and soft, about 30 days after sowing.", "पेरणीनंतर साधारण 30 दिवसांनी पाने 15–20 सेंमी लांब, गडद हिरवी व कोवळी होतात."),
  postHarvest: b(
    "Cut in the morning, remove yellow and damaged leaves, tie in bunches, sprinkle a little clean water and keep in shade. Sell the same day if possible.",
    "सकाळी कापा, पिवळी व खराब पाने काढा, जुड्या बांधा, थोडे स्वच्छ पाणी शिंपडा आणि सावलीत ठेवा. शक्यतो त्याच दिवशी विका.",
  ),
  marketTips: b(
    "Fresh, clean, uniform bunches sell best in the morning market. Staggered sowing every 2–3 weeks gives a steady supply instead of a glut.",
    "ताज्या, स्वच्छ, एकसारख्या जुड्यांना सकाळच्या बाजारात चांगला दर मिळतो. दर 2–3 आठवड्यांनी टप्प्याटप्प्याने पेरणी केल्यास एकदम आवक न होता सतत माल मिळतो.",
  ),
  varieties: [
    { name: "All Green", note: b("Widely grown, smooth green leaves, many cuttings", "सर्वत्र लागवड, गुळगुळीत हिरवी पाने, अनेक कापण्या") },
    { name: "Pusa Jyoti", note: b("Large tender leaves (ICAR-IARI)", "मोठी कोवळी पाने (ICAR-IARI)") },
  ],
  source: "General practices from MPKV Rahuri and ICAR-IIVR leafy vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
