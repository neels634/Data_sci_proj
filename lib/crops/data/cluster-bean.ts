import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "cluster-bean",
  emoji: "🫛",
  name: b("Cluster bean", "गवार"),
  aliases: ["cluster bean", "guar", "gavar", "gawar", "gavaar", "गवार", "ग्वार", "guar phali", "gavarichya shenga"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada", "vidarbha"],
  tier: 2,
  seasons: [
    { season: "kharif", sowingWindow: b("June–July", "जून–जुलै"), sowingMonths: [6, 7], durationDays: [90, 120] },
    { season: "summer", sowingWindow: b("February–March (with irrigation)", "फेब्रुवारी–मार्च (पाण्याची सोय असल्यास)"), sowingMonths: [2, 3], durationDays: [90, 110] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly in lines", "बियाणे; ओळीत थेट पेरणी"),
  soil: b("Light to medium, well-drained soil. Tolerates poor soils, but not waterlogging.", "हलकी ते मध्यम, पाण्याचा निचरा होणारी जमीन. कमी सुपीक जमिनीतही येते, पण पाणी साचलेले चालत नाही."),
  climate: b("Warm weather; hardy and drought tolerant. Cloudy, humid weather increases leaf diseases.", "उबदार हवामान; काटक व दुष्काळ सहन करणारे. ढगाळ, दमट हवामानात पानांचे रोग वाढतात."),
  seedRate: b("About 6–8 kg seed per acre.", "एकरी साधारण 6–8 किलो बियाणे."),
  spacing: b("45 cm between rows and 15–20 cm between plants.", "ओळींत 45 सेंमी व रोपांत 15–20 सेंमी."),
  irrigation: b(
    "Kharif crop needs water only in long dry spells. Summer crop: every 7–10 days. Keep the soil moist at flowering and pod setting.",
    "खरीप पिकाला फक्त पावसाच्या मोठ्या खंडात पाणी. उन्हाळी पिकाला दर 7–10 दिवसांनी. फुलोरा व शेंगा लागताना जमीन ओलसर ठेवा.",
  ),
  nutrientGuide: b(
    "A legume, so it needs less nitrogen. Add well-rotted farmyard manure before sowing and give fertiliser as per soil test, mostly at sowing. Ask your agriculture officer for amounts.",
    "द्विदल पीक असल्याने नत्र कमी लागते. पेरणीपूर्वी कुजलेले शेणखत द्या आणि माती परीक्षणानुसार खत मुख्यतः पेरणीवेळी द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Sowing & germination", "पेरणी व उगवण"], 0, 15, ["Seeds sprout in 5–7 days.", "5–7 दिवसांत बी उगवते."], [
      t("cb-sow", 0, "sowing", ["Sow in lines", "ओळीत पेरणी करा"], ["Sow in moist soil, 2–3 cm deep, in rows 45 cm apart. Seed treatment with rhizobium culture helps; ask your KVK.", "ओलसर जमिनीत 2–3 सेंमी खोल, 45 सेंमी अंतराच्या ओळीत पेरा. रायझोबियम संवर्धनाची बीजप्रक्रिया उपयोगी; कृषी विज्ञान केंद्राला विचारा."]),
      t("cb-irr0", 2, "irrigation", ["Light irrigation (summer crop)", "हलके पाणी (उन्हाळी पीक)"], ["Give light water if the soil dries before seeds come up.", "बी उगवण्यापूर्वी जमीन कोरडी झाल्यास हलके पाणी द्या."]),
      t("cb-thin", 12, "other", ["Thin the plants", "विरळणी करा"], ["Keep plants 15–20 cm apart.", "रोपांत 15–20 सेंमी अंतर ठेवा."]),
    ], [["Seedlings dying in wet soil", "ओल्या जमिनीत रोपे मरणे"]]),
    stage("vegetative", ["Plant growth", "रोपांची वाढ"], 15, 35, ["Plants grow upright and branch.", "रोपे सरळ वाढतात व फांद्या फुटतात."], [
      t("cb-weed", 18, "weeding", ["Weeding and hoeing", "खुरपणी व कोळपणी"], ["Weed twice in the first 5 weeks; the crop then covers the ground.", "पहिल्या 5 आठवड्यांत दोनदा खुरपणी करा; नंतर पीक जमीन झाकते."], 14),
      t("cb-irr1", 15, "irrigation", ["Irrigate if dry", "कोरडे असल्यास पाणी द्या"], ["Water when the soil dries.", "जमीन कोरडी झाल्यावर पाणी द्या."], 8),
      t("cb-obs1", 20, "observation", ["Check leaves", "पाने तपासा"], ["Look for aphids, jassids and white powder on leaves.", "मावा, तुडतुडे व पानांवर पांढरी भुकटी पाहा."], 7),
    ], [["Aphids and jassids", "मावा व तुडतुडे"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 35, 50, ["Small purple-pink flowers come in clusters.", "घोसांत लहान जांभळट-गुलाबी फुले येतात."], [
      t("cb-irr2", 35, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Water stress now drops flowers.", "आता पाण्याचा ताण आल्यास फुले गळतात."], 7),
      t("cb-obs2", 37, "observation", ["Check flowers and leaves", "फुले व पाने तपासा"], ["Look for powdery mildew and pod borer caterpillars.", "भुरी व शेंगा पोखरणाऱ्या अळ्या पाहा."], 7),
    ], [["Powdery mildew", "भुरी"]]),
    stage("harvest", ["Harvest (pickings)", "तोडणी"], 50, 110, ["Tender pods are picked every 4–5 days.", "दर 4–5 दिवसांनी कोवळ्या शेंगा तोडल्या जातात."], [
      t("cb-pick", 50, "harvest", ["Pick tender pods", "कोवळ्या शेंगा तोडा"], ["Pick pods while tender and before seeds swell. Late pods become fibrous.", "बिया फुगण्यापूर्वी कोवळ्या शेंगा तोडा. उशिरा तोडलेल्या शेंगा जून होतात."], 4),
      t("cb-irr3", 51, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep the soil moist between pickings.", "तोडण्यांच्या मध्ये जमीन ओलसर ठेवा."], 7),
      t("cb-obs3", 55, "observation", ["Check pods", "शेंगा तपासा"], ["Look for bored pods and leaf spots; remove badly affected plants.", "पोखरलेल्या शेंगा व पानांवरील ठिपके पाहा; जास्त बाधित झाडे काढा."], 7),
    ], [["Check pre-harvest waiting days on any product label before picking", "तोडणीपूर्वी वापरलेल्या औषधाच्या लेबलवरील काढणीपूर्व कालावधी तपासा"]]),
    stage("last-pickings", ["Last pickings & cleanup", "शेवटच्या तोडण्या व शेत स्वच्छता"], 110, 120, ["Pods get fewer; plants are removed or ploughed in.", "शेंगा कमी होतात; झाडे काढली किंवा जमिनीत गाडली जातात."], [
      t("cb-pick2", 110, "harvest", ["Last pickings", "शेवटच्या तोडण्या"], ["Pick the remaining tender pods.", "उरलेल्या कोवळ्या शेंगा तोडा."], 4),
      t("cb-clean", 116, "other", ["Plough in the plants", "झाडे जमिनीत गाडा"], ["Plough plant remains into the soil; they add organic matter.", "झाडांचे अवशेष नांगरून जमिनीत मिसळा; सेंद्रिय पदार्थ वाढतो."]),
    ], [["Diseased plant remains", "रोगट अवशेष"]]),
  ],
  flushes: { everyDays: 4, count: 12, note: b("Pick tender pods every 4–5 days.", "दर 4–5 दिवसांनी कोवळ्या शेंगा तोडा.") },
  commonProblems: [
    { name: b("Aphids and jassids", "मावा व तुडतुडे"), signs: b("Tiny insects suck sap from leaves and tender shoots; leaves curl and yellow.", "लहान किडी पाने व कोवळ्या शेंड्यांतून रस शोषतात; पाने आकसून पिवळी पडतात."), prevention: prevent("Check plants weekly, keep weeds down and use yellow sticky traps.", "दर आठवड्याला झाडे तपासा, तण कमी ठेवा आणि पिवळे चिकट सापळे वापरा.") },
    { name: b("Powdery mildew", "भुरी"), signs: b("White powder on leaves and pods; leaves dry.", "पाने व शेंगांवर पांढरी भुकटी; पाने सुकतात."), prevention: prevent("Sow at the right time and keep proper spacing.", "योग्य वेळी पेरणी करा व योग्य अंतर ठेवा.") },
    { name: b("Bacterial leaf blight", "पानांवरील जिवाणू करपा"), signs: b("Water-soaked spots on leaves that turn brown; leaves fall.", "पानांवर पाणथळ ठिपके जे तपकिरी होतात; पाने गळतात."), prevention: prevent("Use healthy seed, rotate crops and remove affected plants.", "निरोगी बियाणे वापरा, पिकांची फेरपालट करा व बाधित झाडे काढा.") },
  ],
  harvestSigns: b("Pods are full-sized, green, tender and snap easily; seeds inside are small.", "शेंगा पूर्ण आकाराच्या, हिरव्या, कोवळ्या व सहज मोडणाऱ्या; आतील बिया लहान."),
  postHarvest: b("Pick in the cool morning, keep in shade, remove damaged pods and pack in ventilated bags. Sell within a day or two.", "सकाळी थंड वेळेत तोडा, सावलीत ठेवा, खराब शेंगा काढा आणि हवेशीर पिशव्यांत भरा. एक-दोन दिवसांत विका."),
  marketTips: b("Tender, straight, uniform pods get the best rate. Summer cluster bean often gets good prices. Regular pickings bring regular cash.", "कोवळ्या, सरळ, एकसारख्या शेंगांना चांगला दर. उन्हाळी गवारीला बहुधा चांगला भाव मिळतो. नियमित तोडणीमुळे नियमित पैसा मिळतो."),
  varieties: [
    { name: "Pusa Navbahar", note: b("Vegetable variety with tender pods (ICAR-IARI)", "कोवळ्या शेंगांचा भाजीचा वाण (ICAR-IARI)") },
    { name: "Pusa Sadabahar", note: b("Vegetable variety for kharif and summer (ICAR-IARI)", "खरीप व उन्हाळ्यासाठी भाजीचा वाण (ICAR-IARI)") },
  ],
  source: "General practices from MPKV Rahuri, VNMKV Parbhani and ICAR-IIVR vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
