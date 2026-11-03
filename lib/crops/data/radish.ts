import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "radish",
  emoji: "🌱",
  name: b("Radish", "मुळा"),
  aliases: ["radish", "mula", "moola", "mooli", "muli", "मुळा", "मुळे", "मूली"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada", "vidarbha"],
  tier: 2,
  seasons: [
    { season: "rabi", sowingWindow: b("Sow in September–January (main season)", "सप्टेंबर–जानेवारीमध्ये पेरणी (मुख्य हंगाम)"), sowingMonths: [9, 10, 11, 12, 1], durationDays: [45, 60] },
    { season: "kharif", sowingWindow: b("Sow in June–August with heat-tolerant varieties", "जून–ऑगस्टमध्ये उष्णता सहन करणाऱ्या वाणांची पेरणी"), sowingMonths: [6, 7, 8], durationDays: [40, 50] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly on ridges or beds", "बियाणे; थेट सरी किंवा वाफ्यावर पेरणी"),
  soil: b("Loose, well-drained loamy soil. Hard or stony soil gives forked roots.", "भुसभुशीत, पाण्याचा निचरा होणारी पोयट्याची जमीन. कडक किंवा दगडाळ जमिनीत मुळ्याला फाटे फुटतात."),
  climate: b("Cool weather is best. In heat, roots turn pungent and pithy quickly.", "थंड हवामान उत्तम. उष्णतेत मुळा लवकर तिखट व पोकळ होतो."),
  seedRate: b("About 3–4 kg seed per acre.", "एकरी साधारण 3–4 किलो बियाणे."),
  spacing: b("30–45 cm between rows or ridges; thin to 8–10 cm between plants.", "ओळींत किंवा सऱ्यांत 30–45 सेंमी; विरळणी करून रोपांत 8–10 सेंमी."),
  irrigation: b("Light water every 5–7 days; more often in heat. Even moisture keeps roots tender; dry spells make them hot and pithy.", "दर 5–7 दिवसांनी हलके पाणी; उष्णतेत लवकर. सारख्या ओलाव्याने मुळा कोवळा राहतो; ताण पडल्यास तिखट व पोकळ होतो."),
  nutrientGuide: b("Use a soil test. Use only well-rotted manure. Give a small nitrogen top dressing about 3 weeks after sowing. Ask your agriculture officer for amounts.", "माती परीक्षण करा. फक्त कुजलेले खत वापरा. पेरणीनंतर साधारण 3 आठवड्यांनी नत्राचा थोडा वरखत हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."),
  stages: [
    stage("germination", ["Sowing & germination", "पेरणी व उगवण"], 0, 7, ["Seeds sprout in 3–5 days.", "बी 3–5 दिवसांत उगवते."], [
      t("rd-sow", 0, "sowing", ["Sow the seed", "बी पेरा"], ["Sow in lines on ridges or beds, about 1–2 cm deep.", "सरी किंवा वाफ्यावर ओळीत साधारण 1–2 सेंमी खोल पेरा."]),
      t("rd-irr1", 1, "irrigation", ["Light watering", "हलके पाणी"], ["Keep the soil moist until seedlings come up.", "रोपे वर येईपर्यंत जमीन ओलसर ठेवा."], 3),
    ], [["Flea beetles making small holes in seedling leaves", "कोवळ्या पानांना बारीक छिद्रे पाडणारे भुंगे"]]),
    stage("seedling", ["Seedling & thinning", "रोप अवस्था व विरळणी"], 7, 20, ["Young plants form leaves.", "लहान रोपांना पाने येतात."], [
      t("rd-thin", 10, "other", ["Thin the plants", "विरळणी करा"], ["Keep plants 8–10 cm apart.", "रोपांत 8–10 सेंमी अंतर ठेवा."]),
      t("rd-weed", 14, "weeding", ["Weeding", "खुरपणी"], ["Weed by hand or hoe.", "हाताने किंवा कोळप्याने खुरपणी करा."]),
    ], [["Aphids on young leaves", "कोवळ्या पानांवर मावा"]]),
    stage("root-growth", ["Root growth", "मुळा पोसणे"], 20, 40, ["The root swells quickly.", "मुळा वेगाने फुगतो."], [
      t("rd-irr2", 20, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 5–7 days; keep moisture even.", "दर 5–7 दिवसांनी पाणी; ओलावा सारखा ठेवा."], 6),
      t("rd-fert", 21, "fertiliser", ["Top dressing and earthing up", "वरखत व भर"], ["Give a small nitrogen part as per soil test and pull soil to the roots.", "माती परीक्षणानुसार नत्राचा थोडा हप्ता द्या व मुळांना भर लावा."]),
    ], [["Cracked roots from uneven water", "अनियमित पाण्याने मुळा तडकणे"]]),
    stage("harvest", ["Harvest", "काढणी"], 40, 60, ["Tender roots are pulled in a few rounds.", "कोवळे मुळे काही फेऱ्यांत उपटले जातात."], [
      t("rd-harv", 40, "harvest", ["Pull tender roots", "कोवळे मुळे उपटा"], ["Pull roots as soon as they reach market size; late roots turn pithy.", "बाजारयोग्य आकार आल्यावर लगेच उपटा; उशिरा मुळा पोकळ होतो."], 4),
      t("rd-wash", 41, "other", ["Wash and bunch", "धुऊन जुड्या बांधा"], ["Wash, sort by size and tie in bunches with fresh leaves.", "धुवा, आकारानुसार वेगळे करा आणि ताज्या पानांसह जुड्या बांधा."], 4),
    ], [["Pithy, hollow roots if left too long", "जास्त दिवस ठेवल्यास पोकळ मुळे"]]),
  ],
  commonProblems: [
    { name: b("Aphids", "मावा"), signs: b("Clusters of small insects under leaves; leaves curl and yellow.", "पानांखाली लहान कीटकांचे थवे; पाने आकसून पिवळी होतात."), prevention: prevent("Check under leaves regularly and use yellow sticky traps.", "पानांखाली नियमित तपासा आणि पिवळे चिकट सापळे लावा.") },
    { name: b("Pithy and forked roots", "पोकळ व फाटे फुटलेले मुळे"), signs: b("Roots hollow or spongy inside, or split into legs.", "मुळा आतून पोकळ किंवा स्पंजसारखा, किंवा फाटे फुटलेला."), prevention: b("Harvest on time, keep moisture even and prepare a loose, clod-free bed.", "वेळेवर काढणी करा, ओलावा सारखा ठेवा आणि भुसभुशीत, ढेकळे नसलेला वाफा करा.") },
    { name: b("Leaf spot", "पानांवरील ठिपके"), signs: b("Brown or black spots on leaves, which then dry.", "पानांवर तपकिरी किंवा काळे ठिपके, नंतर पाने सुकतात."), prevention: prevent("Rotate crops and avoid wetting leaves late in the day.", "पिकांची फेरपालट करा आणि संध्याकाळी पाने ओली करू नका.") },
  ],
  harvestSigns: b("Roots are market size, smooth and tender — usually 40–50 days after sowing.", "मुळे बाजारयोग्य आकाराचे, गुळगुळीत व कोवळे — साधारण पेरणीनंतर 40–50 दिवसांनी."),
  postHarvest: b("Wash, grade by size, tie in bunches with leaves and keep in shade. Sprinkle water to keep leaves fresh.", "धुवा, आकारानुसार प्रतवारी करा, पानांसह जुड्या बांधा आणि सावलीत ठेवा. पाने ताजी राहावीत म्हणून पाणी शिंपडा."),
  marketTips: b("Fresh, white, tender radish with green leaves sells best. Staggered sowing every 2 weeks gives a steady supply.", "हिरव्या पानांसह ताज्या, पांढऱ्या, कोवळ्या मुळ्याला चांगला दर मिळतो. दर 2 आठवड्यांनी टप्प्याटप्प्याने पेरणी केल्यास सतत माल मिळतो."),
  varieties: [
    { name: "Pusa Chetki", note: b("Heat-tolerant variety for summer and kharif (ICAR-IARI)", "उन्हाळी व खरिपासाठी उष्णता सहन करणारा वाण (ICAR-IARI)") },
    { name: "Japanese White", note: b("Long white radish for the cool season", "थंड हंगामासाठी लांब पांढरा मुळा") },
  ],
  source: "General practices from MPKV Rahuri, ICAR-IARI and ICAR-IIVR root vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
