import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "green-peas",
  emoji: "🫛",
  name: b("Green peas", "वाटाणा"),
  aliases: ["green peas", "green pea", "peas", "pea", "vatana", "vatane", "watana", "वाटाणा", "वाटाणे", "matar", "mattar", "मटार", "मटर", "hirva vatana", "हिरवा वाटाणा"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["western", "north"],
  tier: 2,
  seasons: [
    { season: "rabi", sowingWindow: b("October–November", "ऑक्टोबर–नोव्हेंबर"), sowingMonths: [10, 11], durationDays: [75, 100] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly in lines", "बियाणे; ओळीत थेट पेरणी"),
  soil: b("Well-drained loamy or medium black soil. Does not tolerate standing water or salty soil.", "पाण्याचा निचरा होणारी पोयट्याची किंवा मध्यम काळी जमीन. साचलेले पाणी व क्षारयुक्त जमीन सहन होत नाही."),
  climate: b("Cool winter weather. Heat at flowering reduces pod set; frost damages flowers and pods.", "थंड हिवाळी हवामान. फुलोऱ्यात उष्णता असल्यास शेंगा कमी लागतात; कडाक्याच्या थंडीत फुले व शेंगा खराब होतात."),
  seedRate: b("About 30–40 kg seed per acre (bigger seeds need more).", "एकरी साधारण 30–40 किलो बियाणे (मोठ्या दाण्याला जास्त)."),
  spacing: b("30 cm between rows and 5–10 cm between plants.", "ओळींत 30 सेंमी व रोपांत 5–10 सेंमी."),
  irrigation: b(
    "Light irrigation every 10–12 days. Most important at flowering and pod filling. Avoid heavy water — roots rot.",
    "दर 10–12 दिवसांनी हलके पाणी. फुलोरा व शेंगा भरताना सर्वात महत्त्वाचे. जास्त पाणी टाळा — मुळे कुजतात.",
  ),
  nutrientGuide: b(
    "A legume, so it needs little nitrogen. Add well-rotted farmyard manure and give fertiliser as per soil test, all at sowing. Ask your agriculture officer for amounts.",
    "द्विदल पीक असल्याने नत्र कमी लागते. कुजलेले शेणखत द्या आणि माती परीक्षणानुसार सर्व खत पेरणीवेळी द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Sowing & germination", "पेरणी व उगवण"], 0, 15, ["Seeds sprout in 7–10 days in cool weather.", "थंड हवामानात 7–10 दिवसांत बी उगवते."], [
      t("gp-sow", 0, "sowing", ["Sow in lines", "ओळीत पेरणी करा"], ["Sow in moist soil, 4–5 cm deep. Seed treatment with rhizobium culture helps; ask your KVK.", "ओलसर जमिनीत 4–5 सेंमी खोल पेरा. रायझोबियम संवर्धनाची बीजप्रक्रिया उपयोगी; कृषी विज्ञान केंद्राला विचारा."]),
      t("gp-irr0", 3, "irrigation", ["Light irrigation if dry", "कोरडे असल्यास हलके पाणी"], ["Give light water only if the soil dries before seeds come up.", "बी उगवण्यापूर्वी जमीन कोरडी झाल्यासच हलके पाणी द्या."]),
      t("gp-gap", 12, "other", ["Check germination", "उगवण तपासा"], ["Resow large gaps early.", "मोठे खाडे लवकर पुन्हा पेरा."]),
    ], [["Seed rot in wet soil", "ओल्या जमिनीत बी सडणे"]]),
    stage("vegetative", ["Plant growth", "रोपांची वाढ"], 15, 35, ["Plants grow and send out tendrils.", "रोपे वाढतात व ताणे फुटतात."], [
      t("gp-weed", 20, "weeding", ["Weeding", "खुरपणी"], ["Weed once or twice before the crop covers the ground.", "पीक जमीन झाकण्यापूर्वी एक-दोनदा खुरपणी करा."], 14),
      t("gp-irr1", 18, "irrigation", ["Irrigate", "पाणी द्या"], ["Light water every 10–12 days.", "दर 10–12 दिवसांनी हलके पाणी."], 11),
      t("gp-obs1", 22, "observation", ["Check leaves", "पाने तपासा"], ["Look for white powder on leaves and winding trails (leaf miner).", "पानांवर पांढरी भुकटी व नागमोडी रेषा (पाने पोखरणारी अळी) पाहा."], 7),
      t("gp-stake", 28, "other", ["Give support to tall types", "उंच जातींना आधार द्या"], ["Tall varieties give better pods with dry twigs or string support.", "उंच जातींना वाळलेल्या काड्या किंवा दोरीचा आधार दिल्यास चांगल्या शेंगा येतात."]),
    ], [["Powdery mildew", "भुरी"], ["Leaf miner", "पाने पोखरणारी अळी"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 35, 55, ["White flowers open and pods set.", "पांढरी फुले उमलतात व शेंगा लागतात."], [
      t("gp-irr2", 35, "irrigation", ["Irrigate at flowering", "फुलोऱ्यात पाणी द्या"], ["Do not let the soil dry now.", "आता जमीन कोरडी पडू देऊ नका."], 10),
      t("gp-obs2", 37, "observation", ["Check flowers and pods", "फुले व शेंगा तपासा"], ["Look for pod borer caterpillars and powdery mildew.", "शेंगा पोखरणाऱ्या अळ्या व भुरी पाहा."], 7),
    ], [["Pod borer", "शेंगा पोखरणारी अळी"]]),
    stage("pod-filling", ["Pod filling", "शेंगा भरणे"], 55, 70, ["Seeds swell inside the pods.", "शेंगांत दाणे भरतात."], [
      t("gp-irr3", 55, "irrigation", ["Irrigate", "पाणी द्या"], ["Even water now fills the pods.", "आता सारख्या पाण्याने शेंगा भरतात."], 10),
      t("gp-obs3", 57, "observation", ["Check pods", "शेंगा तपासा"], ["Remove pods with holes and watch for mildew on pods.", "छिद्रे असलेल्या शेंगा काढा व शेंगांवर भुरी पाहा."], 7),
    ], [["Powdery mildew on pods", "शेंगांवर भुरी"]]),
    stage("harvest", ["Green pod pickings", "हिरव्या शेंगांची तोडणी"], 70, 100, ["Green pods are picked in 2–4 rounds.", "हिरव्या शेंगा 2–4 फेऱ्यांत तोडल्या जातात."], [
      t("gp-pick", 70, "harvest", ["Pick green pods", "हिरव्या शेंगा तोडा"], ["Pick when pods are well filled, bright green and still soft.", "शेंगा चांगल्या भरलेल्या, चमकदार हिरव्या व अजून मऊ असताना तोडा."], 7),
      t("gp-irr4", 72, "irrigation", ["Light irrigation", "हलके पाणी"], ["Light water between pickings keeps later pods filling.", "तोडण्यांच्या मध्ये हलके पाणी दिल्यास पुढच्या शेंगा भरतात."], 10),
      t("gp-phi", 71, "observation", ["Check spray waiting periods", "फवारणीचा प्रतीक्षा कालावधी तपासा"], ["Do not pick before the waiting period on the label of any product you sprayed.", "फवारलेल्या औषधाच्या लेबलवरील प्रतीक्षा कालावधीपूर्वी तोडणी करू नका."]),
    ], [["Pods turning yellow and hard if picked late", "उशिरा तोडल्यास शेंगा पिवळ्या व कडक होणे"]]),
  ],
  flushes: { everyDays: 7, count: 4, note: b("Pick green pods in 2–4 rounds about a week apart.", "हिरव्या शेंगा साधारण आठवड्याच्या अंतराने 2–4 फेऱ्यांत तोडा.") },
  commonProblems: [
    { name: b("Powdery mildew", "भुरी"), signs: b("White powder on leaves, stems and pods; plants dry early.", "पाने, खोड व शेंगांवर पांढरी भुकटी; झाडे लवकर सुकतात."), prevention: prevent("Sow on time (early sowing escapes late-season mildew) and keep proper spacing.", "वेळेवर पेरणी करा (लवकर पेरणीत उशिराची भुरी टळते) व योग्य अंतर ठेवा.") },
    { name: b("Pod borer", "शेंगा पोखरणारी अळी"), signs: b("Holes in pods; caterpillar eats the seeds inside.", "शेंगांना छिद्रे; अळी आतील दाणे खाते."), prevention: prevent("Use pheromone traps, check pods weekly, and remove bored pods.", "कामगंध सापळे लावा, दर आठवड्याला शेंगा तपासा व पोखरलेल्या शेंगा काढा.") },
    { name: b("Leaf miner", "पाने पोखरणारी अळी"), signs: b("White winding trails inside leaves.", "पानांच्या आत पांढऱ्या नागमोडी रेषा."), prevention: prevent("Pick and destroy heavily mined leaves early.", "जास्त बाधित पाने लवकर तोडून नष्ट करा.") },
    { name: b("Wilt and root rot", "मर व मूळकूज"), signs: b("Plants yellow and wilt in patches.", "पट्ट्यांत झाडे पिवळी पडून मलूल होतात."), prevention: prevent("Avoid heavy irrigation and waterlogging, and rotate crops.", "जास्त पाणी व पाणी साचणे टाळा आणि पिकांची फेरपालट करा.") },
  ],
  harvestSigns: b("Pods are full, bright green and the seeds are plump but still sweet and soft.", "शेंगा भरलेल्या, चमकदार हिरव्या आणि दाणे टपोरे पण अजून गोड व मऊ."),
  postHarvest: b("Pick in the cool morning, keep in shade, remove yellow or damaged pods and pack in jute or mesh bags. Send quickly — peas lose sweetness fast.", "सकाळी थंड वेळेत तोडा, सावलीत ठेवा, पिवळ्या किंवा खराब शेंगा काढा आणि ज्यूट किंवा जाळीच्या पिशव्यांत भरा. लवकर पाठवा — वाटाण्याचा गोडवा लवकर कमी होतो."),
  marketTips: b("Early-season peas get higher prices before the big northern arrivals. Bright green, well-filled pods sell best. Processors buy shelled peas in bulk in some areas.", "उत्तरेकडील मोठी आवक येण्यापूर्वी लवकरच्या वाटाण्याला जास्त दर मिळतो. चमकदार हिरव्या, भरलेल्या शेंगांना चांगली मागणी. काही भागांत प्रक्रिया उद्योग सोललेला वाटाणा मोठ्या प्रमाणात घेतात."),
  varieties: [
    { name: "Arkel", note: b("Early, dwarf variety widely grown for green pods", "लवकर येणारी, बुटकी, हिरव्या शेंगांसाठी मोठ्या प्रमाणावर घेतली जाणारी जात") },
    { name: "Bonneville", note: b("Mid-season variety widely grown for green pods", "मध्यम कालावधीची, हिरव्या शेंगांसाठी मोठ्या प्रमाणावर घेतली जाणारी जात") },
  ], // TODO: varieties — confirm MPKV Rahuri pea releases
  source: "General practices from MPKV Rahuri and ICAR-IIVR vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
