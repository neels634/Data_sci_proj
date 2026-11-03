import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "beetroot",
  emoji: "🟣",
  name: b("Beetroot", "बीट"),
  aliases: ["beetroot", "beet", "beet root", "बीट", "बीटरूट", "chukandar", "चुकंदर"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["western", "north"],
  tier: 2,
  seasons: [
    { season: "rabi", sowingWindow: b("Sow in October–December", "ऑक्टोबर–डिसेंबरमध्ये पेरणी"), sowingMonths: [10, 11, 12], durationDays: [70, 90] },
  ],
  method: "direct",
  plantingMaterial: b("Seed (each 'seed' is a cluster that gives 2–4 seedlings), sown directly", "बियाणे (प्रत्येक 'बी' म्हणजे 2–4 रोपे देणारा गुच्छ); थेट पेरणी"),
  soil: b("Loose, well-drained loamy soil. Tolerates slightly salty soil better than most vegetables.", "भुसभुशीत, पाण्याचा निचरा होणारी पोयट्याची जमीन. बहुतेक भाज्यांपेक्षा थोडी क्षारयुक्त जमीन जास्त सहन करते."),
  climate: b("Cool weather gives deep colour and sweetness. Heat gives pale rings inside the root.", "थंड हवामानात गडद रंग व गोडी येते. उष्णतेत आतून फिकट वर्तुळे दिसतात."),
  seedRate: b("About 3–4 kg seed per acre.", "एकरी साधारण 3–4 किलो बियाणे."),
  spacing: b("30–45 cm between rows; thin to 8–10 cm between plants.", "ओळींत 30–45 सेंमी; विरळणी करून रोपांत 8–10 सेंमी."),
  irrigation: b("Light water every 6–8 days. Keep moisture even; dry then wet soil cracks roots.", "दर 6–8 दिवसांनी हलके पाणी. ओलावा सारखा ठेवा; आधी कोरडी व मग ओली जमीन झाल्यास बीट तडकते."),
  nutrientGuide: b("Use a soil test. Mix well-rotted manure before sowing. Give nitrogen in 2 parts. Beetroot can suffer from boron shortage — ask your agriculture officer.", "माती परीक्षण करा. पेरणीपूर्वी कुजलेले खत मिसळा. नत्र 2 हप्त्यांत द्या. बीटला बोरॉनची कमतरता भासू शकते — कृषी अधिकाऱ्यांना विचारा."),
  stages: [
    stage("germination", ["Sowing & germination", "पेरणी व उगवण"], 0, 12, ["Seed clusters sprout in 7–10 days.", "बियांचे गुच्छ 7–10 दिवसांत उगवतात."], [
      t("bt-sow", 0, "sowing", ["Sow the seed", "बी पेरा"], ["Soak seed for a few hours, then sow in lines about 2 cm deep.", "बी काही तास भिजवा, मग ओळीत साधारण 2 सेंमी खोल पेरा."]),
      t("bt-irr1", 1, "irrigation", ["Light watering", "हलके पाणी"], ["Keep the soil moist until seedlings come up.", "रोपे वर येईपर्यंत जमीन ओलसर ठेवा."], 3),
    ], [["Poor sprouting in crusted soil", "कडक पापुद्र्यामुळे कमी उगवण"]]),
    stage("seedling", ["Seedling & thinning", "रोप अवस्था व विरळणी"], 12, 30, ["Several seedlings come from each cluster and need thinning.", "प्रत्येक गुच्छातून अनेक रोपे येतात, त्यांची विरळणी करावी लागते."], [
      t("bt-thin", 15, "other", ["Thin the plants", "विरळणी करा"], ["Keep one strong plant every 8–10 cm. Thinned leaves can be used as greens.", "दर 8–10 सेंमीवर एक मजबूत रोप ठेवा. काढलेली रोपे भाजीसाठी वापरता येतात."]),
      t("bt-weed", 20, "weeding", ["Weeding", "खुरपणी"], ["Weed by hand.", "हाताने खुरपणी करा."]),
    ], [["Leaf-eating caterpillars", "पाने खाणाऱ्या अळ्या"]]),
    stage("root-growth", ["Root growth", "बीट पोसणे"], 30, 65, ["The root swells and colours.", "बीट फुगते व रंग धरते."], [
      t("bt-irr2", 30, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 6–8 days.", "दर 6–8 दिवसांनी पाणी द्या."], 7),
      t("bt-fert", 32, "fertiliser", ["Top dressing and earthing up", "वरखत व भर"], ["Give the second nitrogen part as per soil test and pull soil to the plants.", "माती परीक्षणानुसार नत्राचा दुसरा हप्ता द्या व रोपांना भर लावा."]),
      t("bt-obs", 35, "observation", ["Check leaves", "पाने तपासा"], ["Look for round spots with purple edges on leaves.", "पानांवर जांभळ्या कडांचे गोल ठिपके पाहा."], 10),
    ], [["Cercospora leaf spot", "पानांवरील ठिपके (सर्कोस्पोरा)"]]),
    stage("harvest", ["Harvest", "काढणी"], 65, 90, ["Roots are pulled when they reach market size.", "बाजारयोग्य आकार आल्यावर बीट उपटले जाते."], [
      t("bt-harv", 65, "harvest", ["Pull the roots", "बीट उपटा"], ["Pull when roots are 5–8 cm across; bigger roots get woody.", "बीट 5–8 सेंमी रुंद झाल्यावर उपटा; जास्त मोठे बीट कडक होते."], 5),
      t("bt-wash", 66, "other", ["Clean and grade", "स्वच्छ करून प्रतवारी करा"], ["Twist off leaves leaving a short stalk, wash and grade by size.", "थोडा देठ ठेवून पाने पिळून काढा, धुवा व आकारानुसार वेगळे करा."], 5),
    ], [["Woody roots if harvest is late", "उशिरा काढणीत बीट कडक होणे"]]),
  ],
  commonProblems: [
    { name: b("Leaf spot", "पानांवरील ठिपके"), signs: b("Small round spots with purple-red edges; leaves dry.", "जांभळट-लाल कडांचे लहान गोल ठिपके; पाने सुकतात."), prevention: prevent("Rotate crops, give proper spacing and remove affected leaves.", "पिकांची फेरपालट करा, योग्य अंतर ठेवा आणि बाधित पाने काढा.") },
    { name: b("Leaf-eating caterpillars", "पाने खाणाऱ्या अळ्या"), signs: b("Holes in leaves; caterpillars under leaves.", "पानांना छिद्रे; पानांखाली अळ्या."), prevention: prevent("Check plants weekly and hand-pick caterpillars early.", "दर आठवड्याला झाडे तपासा आणि अळ्या लवकर हाताने वेचा.") },
    { name: b("Heart rot and cracking", "आतून काळे पडणे व तडकणे"), signs: b("Dark patches inside the root or cracks on the surface — often a boron shortage or uneven water.", "बीटच्या आत काळे डाग किंवा वर तडे — बहुतेक बोरॉनची कमतरता किंवा अनियमित पाणी."), prevention: b("Water evenly and ask your agriculture officer about boron based on a soil test.", "सारखे पाणी द्या आणि माती परीक्षणाच्या आधारे बोरॉनबद्दल कृषी अधिकाऱ्यांना विचारा.") },
  ],
  harvestSigns: b("Roots are 5–8 cm across, smooth and deep red.", "बीट 5–8 सेंमी रुंद, गुळगुळीत व गडद लाल."),
  postHarvest: b("Leave a short stalk, wash, grade by size and pack in bags or crates. Keep cool.", "थोडा देठ ठेवा, धुवा, आकारानुसार प्रतवारी करा आणि पिशव्यांत किंवा क्रेटमध्ये भरा. थंड ठिकाणी ठेवा."),
  marketTips: b("Medium-sized, round, deep red beetroot sells best in city markets. Ask buyers about demand before sowing a large area.", "मध्यम आकाराच्या, गोल, गडद लाल बीटला शहरी बाजारात चांगला दर मिळतो. मोठ्या क्षेत्रावर पेरणीपूर्वी खरेदीदारांकडे मागणीची चौकशी करा."),
  varieties: [
    { name: "Detroit Dark Red", note: b("Round, deep red, widely grown", "गोल, गडद लाल, मोठ्या प्रमाणावर घेतला जाणारा वाण") },
    { name: "Crimson Globe", note: b("Round, dark red root", "गोल, गडद लाल बीट") },
  ],
  source: "General practices from MPKV Rahuri and ICAR-IIVR root vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
