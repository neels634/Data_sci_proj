import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "amaranth",
  emoji: "🥬",
  name: b("Amaranth leaves (math)", "माठ"),
  aliases: ["amaranth", "math", "maath", "माठ", "chaulai", "chavli bhaji", "चौलाई", "rajgira leaves", "राजगिरा पाने", "lal math", "लाल माठ"],
  category: "leafy",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada", "vidarbha", "konkan"],
  majorDistricts: b("Pune, Nashik, Thane, Palghar (near city markets)", "पुणे, नाशिक, ठाणे, पालघर (शहरी बाजारांजवळ)"),
  tier: 2,
  seasons: [
    { season: "kharif", label: b("Kharif", "खरीप"), sowingWindow: b("June–August, on raised beds", "जून–ऑगस्ट, गादीवाफ्यांवर"), sowingMonths: [6, 7, 8], durationDays: [25, 70] },
    { season: "summer", label: b("Summer", "उन्हाळी"), sowingWindow: b("February–April, with regular irrigation", "फेब्रुवारी–एप्रिल, नियमित पाण्यासह"), sowingMonths: [2, 3, 4], durationDays: [25, 70] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly (some farmers transplant cutting types)", "बियाणे; थेट पेरणी (काही शेतकरी कापणीच्या वाणांची रोपे लावतात)"),
  seedRate: b("1–1.5 kg seed per acre. The seed is very small — mix it with fine sand to sow evenly.", "एकरी 1–1.5 किलो बियाणे. बी अगदी बारीक असते — एकसारखे पडावे म्हणून बारीक वाळूत मिसळून पेरा."),
  spacing: b("Lines 20–25 cm apart for pulling types; 30 cm × 15–20 cm for cutting types.", "उपटून विकायच्या वाणांसाठी ओळींत 20–25 सेंमी; कापणीच्या वाणांसाठी 30 सेंमी × 15–20 सेंमी."),
  soil: b(
    "Most well-drained soils with plenty of organic matter. Avoid waterlogged fields.",
    "सेंद्रिय पदार्थ भरपूर असलेली, पाण्याचा निचरा होणारी बहुतेक जमीन चालते. पाणी साचणारे शेत टाळा.",
  ),
  climate: b(
    "A warm-season green; grows fast in kharif and summer. Cold slows it down.",
    "उष्ण हंगामातील पालेभाजी; खरीप व उन्हाळ्यात झपाट्याने वाढते. थंडीत वाढ मंदावते.",
  ),
  irrigation: b(
    "Water right after sowing, then every 4–6 days in summer. In kharif water only in dry spells and drain extra rain water. Water after each cutting.",
    "पेरणीनंतर लगेच पाणी, नंतर उन्हाळ्यात दर 4–6 दिवसांनी. खरिपात पावसाचा खंड पडल्यासच पाणी द्या आणि जास्तीचे पावसाचे पाणी काढून द्या. प्रत्येक कापणीनंतर पाणी द्या.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure or compost before sowing. Give a light nitrogen dose after each cutting, as per soil test. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी चांगले कुजलेले शेणखत किंवा कंपोस्ट मिसळा. प्रत्येक कापणीनंतर माती परीक्षणानुसार थोडे नत्र द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("sowing", ["Sowing & germination", "पेरणी व उगवण"], 0, 7, ["Seeds sprout in 3–5 days.", "3–5 दिवसांत बी उगवते."], [
      t("mh-sow", 0, "sowing", ["Prepare beds and sow", "वाफे तयार करून पेरणी करा"], ["Make fine, level beds with manure. Mix seed with fine sand, sow in shallow lines and cover very lightly.", "शेणखत मिसळून भुसभुशीत, सपाट वाफे करा. बी बारीक वाळूत मिसळून उथळ ओळीत पेरा व अगदी हलके झाका."]),
      t("mh-irr0", 1, "irrigation", ["Water lightly", "हलके पाणी द्या"], ["Use a can or gentle flow so the tiny seeds don't wash away.", "बारीक बी वाहून जाऊ नये म्हणून झारीने किंवा हलक्या प्रवाहाने पाणी द्या."], 3),
    ], [["Ants carrying away seed", "मुंग्या बी उचलून नेणे"]]),
    stage("early-growth", ["Early growth", "सुरुवातीची वाढ"], 7, 20, ["Seedlings grow quickly.", "रोपे झपाट्याने वाढतात."], [
      t("mh-irr1", 7, "irrigation", ["Irrigate", "पाणी द्या"], ["Light water every 4–6 days in summer; in rain, only drain the field.", "उन्हाळ्यात दर 4–6 दिवसांनी हलके पाणी; पावसात फक्त पाण्याचा निचरा करा."], 5),
      t("mh-thin", 10, "other", ["Thin and weed", "विरळणी व खुरपणी"], ["Pull extra plants and weeds so the rest grow thick stems and big leaves.", "जास्तीची रोपे व तण काढा, म्हणजे उरलेल्या रोपांना जाड खोड व मोठी पाने येतात."]),
      t("mh-obs1", 14, "observation", ["Check leaves", "पाने तपासा"], ["Look for webbed leaves with caterpillars and white blisters under leaves.", "जाळे करून पाने गुंडाळणाऱ्या अळ्या आणि पानांखाली पांढरे फोड आहेत का पाहा."], 5),
    ], [["Leaf webber caterpillar", "पाने गुंडाळणारी अळी"]]),
    stage("first-harvest", ["First harvest", "पहिली काढणी"], 20, 30, ["Pulling types are ready at 20–30 days; cutting types get their first cut.", "उपटून विकायचे वाण 20–30 दिवसांत तयार होतात; कापणीच्या वाणांची पहिली कापणी होते."], [
      t("mh-harv", 22, "harvest", ["First harvest", "पहिली काढणी करा"], ["Pull young plants with roots for bunches, or cut cutting types 10–15 cm above the ground.", "जुड्यांसाठी कोवळी रोपे मुळांसकट उपटा, किंवा कापणीच्या वाणांची जमिनीपासून 10–15 सेंमी वर कापणी करा."]),
      t("mh-fert1", 24, "fertiliser", ["Feed after cutting", "कापणीनंतर खत द्या"], ["Give a little nitrogen and water. Ask your agriculture officer for the amount.", "थोडे नत्र देऊन पाणी द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Plants turning woody if harvest is late", "काढणी उशिरा झाल्यास खोड जाड व कडक होणे"]]),
    stage("regrowth", ["Regrowth & more cuttings", "पुनर्वाढ व पुढील कापण्या"], 30, 70, ["Side shoots grow after each cut.", "प्रत्येक कापणीनंतर बाजूची फूट येते."], [
      t("mh-irr2", 30, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water keeps shoots soft.", "नियमित पाण्याने फूट कोवळी राहते."], 5),
      t("mh-cut", 35, "harvest", ["Next cutting", "पुढची कापणी करा"], ["Cut tender shoots every 10–15 days.", "दर 10–15 दिवसांनी कोवळी फूट कापा."], 12),
      t("mh-obs2", 36, "observation", ["Watch for flowering", "फुलोरा पाहा"], ["When plants start to flower, leaf quality drops — end the crop.", "रोपे फुलावर आली की पानांचा दर्जा कमी होतो — पीक संपवा."], 7),
    ], [["White rust (white blisters under leaves)", "पांढरा तांबेरा (पानांखाली पांढरे फोड)"]]),
  ],
  flushes: { everyDays: 12, count: 3, note: b("Pulling types give one harvest at 20–30 days. Cutting types give 3–4 cuttings, 10–15 days apart.", "उपटून विकायच्या वाणांची 20–30 दिवसांत एकच काढणी. कापणीच्या वाणांच्या 10–15 दिवसांच्या अंतराने 3–4 कापण्या.") },
  commonProblems: [
    { name: b("Leaf webber caterpillar", "पाने गुंडाळणारी अळी"), signs: b("Leaves webbed together with silk; green caterpillars feed inside.", "पाने रेशमी धाग्यांनी जोडलेली; आत हिरव्या अळ्या पाने खातात."), prevention: prevent("Pick and destroy webbed leaves early and keep the field clean. Leaves are eaten soon after cutting, so always respect the waiting period on any label.", "गुंडाळलेली पाने लवकर तोडून नष्ट करा आणि शेत स्वच्छ ठेवा. कापणीनंतर लगेच भाजी खाल्ली जाते, त्यामुळे लेबलवरील प्रतीक्षा कालावधी नक्की पाळा.") },
    { name: b("White rust", "पांढरा तांबेरा"), signs: b("White raised blisters under leaves, yellow patches on top.", "पानांखाली पांढरे उंचवटलेले फोड, वरच्या बाजूला पिवळे चट्टे."), prevention: prevent("Avoid crowding, don't wet leaves late in the day and remove affected plants.", "दाटी टाळा, संध्याकाळी पाने ओली करू नका आणि बाधित रोपे काढा.") },
    { name: b("Damping off", "रोपे कोलमडणे"), signs: b("Seedlings fall over at the base in wet soil.", "ओल्या जमिनीत रोपे खोडाजवळून पडतात."), prevention: prevent("Sow on raised beds and avoid over-watering.", "गादीवाफ्यावर पेरणी करा आणि जास्त पाणी देऊ नका.") },
  ],
  harvestSigns: b("Plants are 15–25 cm tall with soft, shiny leaves and tender stems, before flowering.", "फुलोऱ्यापूर्वी रोपे 15–25 सेंमी उंच, चमकदार कोवळी पाने व कोवळ्या खोडाची होतात."),
  postHarvest: b(
    "Wash soil off the roots, tie in bunches and keep in shade with a light sprinkle of water. Sell fresh the same day.",
    "मुळांची माती धुवा, जुड्या बांधा आणि थोडे पाणी शिंपडून सावलीत ठेवा. ताजी भाजी त्याच दिवशी विका.",
  ),
  marketTips: b(
    "Math grows fast and sells well in the monsoon and summer when other greens are scarce. Both green and red types have buyers; check what your market prefers.",
    "माठ लवकर तयार होतो आणि पावसाळ्यात व उन्हाळ्यात इतर पालेभाज्या कमी असताना चांगला विकला जातो. हिरवा व लाल दोन्ही माठ विकले जातात; तुमच्या बाजारात कोणता जास्त चालतो ते पाहा.",
  ),
  varieties: [
    { name: "Arka Suguna", note: b("Green, broad-leaved cutting type (ICAR-IIHR)", "हिरवा, रुंद पानांचा कापणीचा वाण (ICAR-IIHR)") },
    { name: "Pusa Lal Chaulai", note: b("Red-leaved type (ICAR-IARI)", "लाल पानांचा वाण (ICAR-IARI)") },
  ],
  source: "General practices from MPKV Rahuri, Dr. BSKKV Dapoli and ICAR-IIHR leafy vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
