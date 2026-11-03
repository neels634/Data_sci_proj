import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "potato",
  emoji: "🥔",
  name: b("Potato", "बटाटा"),
  aliases: ["potato", "potatoes", "batata", "batate", "बटाटा", "बटाटे", "aloo", "alu", "आलू"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["western", "north"],
  majorDistricts: b("Pune, Satara, Nashik", "पुणे, सातारा, नाशिक"),
  tier: 1,
  seasons: [
    { season: "rabi", sowingWindow: b("Plant in October–November, after the rains, under irrigation", "पावसाळ्यानंतर ऑक्टोबर–नोव्हेंबरमध्ये, पाण्याची सोय असताना लागवड"), sowingMonths: [10, 11], durationDays: [90, 120] },
    { season: "kharif", sowingWindow: b("Plant in June–July with the monsoon (mainly rainfed, in the hilly parts of Pune district)", "जून–जुलैमध्ये पावसाबरोबर लागवड (मुख्यतः पावसावर, पुणे जिल्ह्याच्या डोंगरी भागात)"), sowingMonths: [6, 7], durationDays: [80, 100] },
  ],
  method: "vegetative",
  plantingMaterial: b("Healthy seed tubers, whole or cut pieces with 2–3 eyes", "निरोगी बेणे बटाटे; पूर्ण किंवा 2–3 डोळे असलेले तुकडे"),
  soil: b(
    "Loose, well-drained sandy loam or medium soil. Tubers do not grow well in heavy clay where water stands.",
    "भुसभुशीत, पाण्याचा चांगला निचरा होणारी हलकी ते मध्यम जमीन. पाणी साचणाऱ्या भारी चिकण जमिनीत बटाटे नीट पोसत नाहीत.",
  ),
  climate: b(
    "Cool nights help tubers form. Hot weather or frost both reduce yield.",
    "थंड रात्री बटाटे धरायला मदत करतात. जास्त उष्णता किंवा कडाक्याची थंडी (दव/हिम) दोन्हीमुळे उत्पन्न घटते.",
  ),
  seedRate: b(
    "About 8–12 quintal seed tubers per acre, depending on tuber size.",
    "बेण्याच्या आकारानुसार एकरी साधारण 8–12 क्विंटल बेणे बटाटे.",
  ),
  spacing: b("45–60 cm between ridges, 15–20 cm between tubers.", "दोन सऱ्यांत 45–60 सेंमी, दोन बटाट्यांत 15–20 सेंमी."),
  irrigation: b(
    "Rabi crop: light watering in furrows every 7–10 days; keep moisture even while tubers swell. Never let water rise over the ridges. Stop 10–15 days before harvest. Kharif crop is mostly rainfed — drain extra rainwater quickly.",
    "रब्बी पीक: दर 7–10 दिवसांनी सरीतून हलके पाणी; बटाटे पोसताना ओलावा सारखा ठेवा. पाणी वरंब्यावर चढू देऊ नका. काढणीपूर्वी 10–15 दिवस पाणी बंद करा. खरीप पीक बहुतेक पावसावर — जास्तीचे पावसाचे पाणी लगेच बाहेर काढा.",
  ),
  nutrientGuide: b(
    "Use a soil test. Mix plenty of well-rotted farmyard manure before planting. Give part of the nitrogen at planting and the rest at earthing up. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. लागवडीपूर्वी भरपूर कुजलेले शेणखत मिसळा. नत्राचा काही भाग लागवडीवेळी व उरलेला भर देताना द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("planting", ["Planting & sprouting", "लागवड व उगवण"], 0, 20, ["Seed tubers sprout under the soil and shoots come up.", "बेणे बटाट्यांना मातीत कोंब फुटतात आणि रोपे वर येतात."], [
      t("pt-seed", 0, "sowing", ["Plant seed tubers", "बेणे बटाटे लावा"], ["Use sprouted, healthy tubers from a trusted source. Plant on ridges and cover with soil.", "विश्वासू ठिकाणचे, कोंब आलेले निरोगी बेणे वापरा. वरंब्यावर लावून मातीने झाका."]),
      t("pt-irr1", 2, "irrigation", ["First light watering", "पहिले हलके पाणी"], ["Give light water in furrows (rabi crop). Do not flood the ridges.", "सरीतून हलके पाणी द्या (रब्बी पीक). वरंबे पाण्याखाली जाऊ देऊ नका."], 8),
      t("pt-gap", 15, "observation", ["Check sprouting", "उगवण तपासा"], ["Look for tubers that did not sprout or rotted, and note gaps.", "न उगवलेले किंवा कुजलेले बेणे पाहा व खाडे नोंदवा."]),
    ], [["Seed tubers rotting in wet soil", "ओल्या जमिनीत बेणे कुजणे"]]),
    stage("vegetative", ["Plant growth", "रोपांची वाढ"], 20, 35, ["Stems and leaves grow fast.", "खोड व पाने वेगाने वाढतात."], [
      t("pt-weed", 20, "weeding", ["Weeding", "खुरपणी"], ["Remove weeds before earthing up.", "भर देण्यापूर्वी तण काढा."]),
      t("pt-obs1", 22, "observation", ["Check leaves", "पाने तपासा"], ["Look for aphids under leaves and curled or mottled leaves (virus).", "पानांखाली मावा आणि आकसलेली किंवा चट्टेदार पाने (विषाणू) आहेत का पाहा."], 7),
      t("pt-earth", 30, "fertiliser", ["Earthing up and top dressing", "भर देणे व वरखत"], ["Give the second nitrogen part as per soil test, then pull soil up onto the ridges so tubers stay covered.", "माती परीक्षणानुसार नत्राचा दुसरा हप्ता द्या, मग वरंब्यांना माती लावा म्हणजे बटाटे झाकलेले राहतात."]),
    ], [["Aphids spreading virus", "विषाणू पसरवणारा मावा"], ["Cutworms cutting young stems", "कोवळी खोडे कापणाऱ्या अळ्या"]]),
    stage("tuber-initiation", ["Tubers start forming", "बटाटे धरू लागतात"], 35, 55, ["Small tubers form on underground stems.", "जमिनीखालील फांद्यांवर लहान बटाटे धरतात."], [
      t("pt-irr2", 35, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even moisture now gives more tubers. Avoid long dry gaps.", "आता सारख्या ओलाव्याने जास्त बटाटे धरतात. मोठा खंड टाळा."], 7),
      t("pt-obs2", 38, "observation", ["Watch for blight", "करपा पाहा"], ["In cloudy, cool, humid weather look for dark wet patches on leaves.", "ढगाळ, थंड, दमट हवामानात पानांवर काळपट ओले चट्टे पाहा."], 5),
    ], [["Late blight in cloudy, cool weather", "ढगाळ थंड हवामानात उशिरा करपा"], ["Early blight: brown spots with rings", "लवकर करपा: वर्तुळांचे तपकिरी ठिपके"]]),
    stage("tuber-bulking", ["Tuber bulking", "बटाटे पोसणे"], 55, 90, ["Tubers fill and grow in size.", "बटाटे भरतात आणि आकाराने वाढतात."], [
      t("pt-irr3", 55, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep watering lightly and regularly. Dry then wet soil makes tubers crack.", "हलके व नियमित पाणी देत राहा. आधी कोरडी व मग ओली जमीन झाल्यास बटाटे तडकतात."], 8),
      t("pt-obs3", 60, "observation", ["Check for exposed tubers", "उघडे बटाटे तपासा"], ["Cover tubers showing above soil; sun turns them green and bitter.", "मातीबाहेर दिसणारे बटाटे झाका; उन्हाने ते हिरवे व कडू होतात."], 10),
    ], [["Green tubers from sun", "उन्हामुळे हिरवे बटाटे"], ["Tuber moth in exposed tubers", "उघड्या बटाट्यांत पतंगाची अळी"]]),
    stage("maturity", ["Maturity", "पक्वता"], 90, 110, ["Leaves turn yellow and dry; tuber skin hardens.", "पाने पिवळी पडून सुकतात; बटाट्याची साल घट्ट होते."], [
      t("pt-stop", 90, "other", ["Stop irrigation", "पाणी बंद करा"], ["Stop watering 10–15 days before harvest.", "काढणीपूर्वी 10–15 दिवस पाणी बंद करा."]),
      t("pt-haulm", 98, "other", ["Cut the tops (haulms)", "वेल/पाला कापा"], ["Cut the green tops about 10 days before digging so the skin sets and tubers keep better.", "खणण्यापूर्वी साधारण 10 दिवस हिरवा पाला कापा, म्हणजे साल घट्ट होऊन बटाटे जास्त टिकतात."]),
    ], [["Skin peeling if dug too early", "लवकर खणल्यास साल सोलवटणे"]]),
    stage("harvest", ["Harvest & curing", "काढणी व सुकवणी"], 110, 120, ["Tubers are dug, dried in shade and sorted.", "बटाटे खणून सावलीत सुकवले जातात व वेगळे केले जातात."], [
      t("pt-dig", 110, "harvest", ["Dig the tubers", "बटाटे खणा"], ["Dig carefully on a dry day so tubers are not cut.", "कोरड्या दिवशी काळजीपूर्वक खणा, बटाटे कापले जाऊ नयेत."]),
      t("pt-grade", 112, "other", ["Cure and grade", "सुकवून प्रतवारी करा"], ["Keep in shade for a few days, then sort by size. Remove cut, green and rotten tubers.", "काही दिवस सावलीत ठेवा, मग आकारानुसार वेगळे करा. कापलेले, हिरवे व सडके बटाटे काढा."]),
    ], [["Rotting from cut or bruised tubers", "कापलेले किंवा दबलेले बटाटे सडणे"]]),
  ],
  commonProblems: [
    { name: b("Late blight", "उशिरा करपा"), signs: b("Dark, water-soaked patches on leaves, white growth under them in the morning; whole plants can collapse in a few days.", "पानांवर काळपट, पाणथळ चट्टे, सकाळी खालच्या बाजूला पांढरी बुरशी; काही दिवसांत संपूर्ण रोपे कोलमडू शकतात."), prevention: prevent("Use healthy seed tubers, keep good earthing up and watch closely in cloudy, cool weather.", "निरोगी बेणे वापरा, चांगली भर द्या आणि ढगाळ थंड हवामानात बारकाईने लक्ष ठेवा.") },
    { name: b("Early blight", "लवकर करपा"), signs: b("Brown spots with rings on older leaves.", "जुन्या पानांवर वर्तुळांचे तपकिरी ठिपके."), prevention: prevent("Give balanced nutrition, rotate crops and remove badly affected leaves.", "संतुलित खत द्या, पिकांची फेरपालट करा आणि जास्त बाधित पाने काढा.") },
    { name: b("Aphids and virus", "मावा व विषाणू"), signs: b("Small insects under leaves; leaves curl, roll or show yellow-green patches.", "पानांखाली लहान कीटक; पाने आकसतात, गुंडाळतात किंवा पिवळे-हिरवे चट्टे दिसतात."), prevention: prevent("Use certified seed tubers and pull out virus-affected plants early.", "प्रमाणित बेणे वापरा आणि विषाणूग्रस्त रोपे लवकर उपटून टाका.") },
    { name: b("Potato tuber moth", "बटाट्यावरील पतंग (बटाटा पोखरणारी अळी)"), signs: b("Thin tunnels and dark holes in tubers, in the field and in storage.", "शेतात व साठवणीत बटाट्यांत बारीक बोगदे व काळी छिद्रे."), prevention: prevent("Keep tubers well covered with soil, harvest on time and store only clean, sorted tubers.", "बटाटे मातीने नीट झाका, वेळेवर काढणी करा आणि फक्त स्वच्छ, निवडलेले बटाटे साठवा.") },
    { name: b("Cutworm", "कटवर्म (खोड कापणारी अळी)"), signs: b("Young stems cut at soil level; grey caterpillars in the soil nearby.", "कोवळी खोडे जमिनीलगत कापलेली; जवळच मातीत करड्या अळ्या."), prevention: prevent("Plough deep in summer, keep the field clean and pick caterpillars from the soil near cut plants.", "उन्हाळ्यात खोल नांगरट करा, शेत स्वच्छ ठेवा आणि कापलेल्या रोपांजवळील मातीतून अळ्या वेचा.") },
  ],
  harvestSigns: b("Leaves yellow and dry, and tuber skin does not rub off with the thumb.", "पाने पिवळी होऊन सुकतात आणि अंगठ्याने घासल्यास बटाट्याची साल निघत नाही."),
  postHarvest: b(
    "Cure in shade for a few days. Grade by size, remove cut and green tubers, and pack in airy bags or crates. Store in a cool, dark, airy place or a cold store.",
    "काही दिवस सावलीत सुकवा. आकारानुसार प्रतवारी करा, कापलेले व हिरवे बटाटे काढा आणि हवेशीर पोत्यांत किंवा क्रेटमध्ये भरा. थंड, अंधाऱ्या, हवेशीर जागी किंवा शीतगृहात साठवा.",
  ),
  marketTips: b(
    "Graded, clean tubers fetch better rates. If prices are low at harvest, cold storage lets you wait. Selling together through your Mandi Mitra cuts transport cost.",
    "प्रतवारी केलेल्या स्वच्छ बटाट्यांना चांगला दर मिळतो. काढणीवेळी दर कमी असल्यास शीतगृहात ठेवून थांबता येते. मंडी मित्रामार्फत एकत्र विक्री केल्यास वाहतूक खर्च कमी होतो.",
  ),
  varieties: [
    { name: "Kufri Jyoti", note: b("Widely grown, medium duration (ICAR-CPRI Shimla)", "मोठ्या प्रमाणावर घेतला जाणारा, मध्यम कालावधीचा (ICAR-CPRI शिमला)") },
    { name: "Kufri Pukhraj", note: b("Early, high-yielding (ICAR-CPRI Shimla)", "लवकर तयार होणारा, जास्त उत्पन्न देणारा (ICAR-CPRI शिमला)") },
  ],
  source: "General practices from ICAR-CPRI and MPKV Rahuri potato guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
