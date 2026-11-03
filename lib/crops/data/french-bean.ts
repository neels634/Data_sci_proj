import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "french-bean",
  emoji: "🫛",
  name: b("French bean", "फरसबी (घेवडा)"),
  aliases: ["french bean", "french beans", "farasbi", "farasbee", "pharasbi", "फरसबी", "ghevda", "ghevada", "घेवडा", "green beans", "beans"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["western", "north"],
  tier: 2,
  seasons: [
    { season: "kharif", sowingWindow: b("June–July", "जून–जुलै"), sowingMonths: [6, 7], durationDays: [75, 90] },
    { season: "rabi", sowingWindow: b("October–November", "ऑक्टोबर–नोव्हेंबर"), sowingMonths: [10, 11], durationDays: [75, 90] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly on ridges or flat beds", "बियाणे; सरीवर किंवा सपाट वाफ्यात थेट पेरणी"),
  soil: b("Well-drained loamy soil with good organic matter. Does not like salty soil or standing water.", "सेंद्रिय पदार्थ असलेली, पाण्याचा निचरा होणारी पोयट्याची जमीन. क्षारयुक्त जमीन व साचलेले पाणी सहन होत नाही."),
  climate: b("Mild, cool weather. Very hot days and frost both drop flowers.", "सौम्य, थंड हवामान. खूप उष्ण दिवस व थंडीची लाट दोन्हींमुळे फुलगळ होते."),
  seedRate: b("About 25–35 kg seed per acre for bush types (pole types need less).", "झुडूप जातींसाठी एकरी साधारण 25–35 किलो बियाणे (वेलीच्या जातींना कमी)."),
  spacing: b("Bush types: 30–45 cm between rows and 10–15 cm between plants. Pole types on a trellis: wider.", "झुडूप जाती: ओळींत 30–45 सेंमी व रोपांत 10–15 सेंमी. मांडवावरील वेली जाती: जास्त अंतर."),
  irrigation: b(
    "Light, regular water every 6–8 days (less in kharif). Keep moisture even at flowering and pod filling; never flood the field.",
    "दर 6–8 दिवसांनी हलके, नियमित पाणी (खरिपात कमी). फुलोरा व शेंगा भरताना ओलावा सारखा ठेवा; शेतात पाणी तुंबवू नका.",
  ),
  nutrientGuide: b(
    "Add well-rotted farmyard manure before sowing. Give fertiliser as per soil test, with a small nitrogen top dressing before flowering. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी कुजलेले शेणखत द्या. माती परीक्षणानुसार खत द्या, फुलोऱ्यापूर्वी नत्राचा लहान वरखत हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Sowing & germination", "पेरणी व उगवण"], 0, 12, ["Seeds sprout in 5–7 days.", "5–7 दिवसांत बी उगवते."], [
      t("fb-sow", 0, "sowing", ["Sow seed", "बी पेरा"], ["Sow in moist soil, 3–4 cm deep. Do not irrigate heavily right after sowing — seeds rot.", "ओलसर जमिनीत 3–4 सेंमी खोल पेरा. पेरणीनंतर लगेच जास्त पाणी देऊ नका — बी सडते."]),
      t("fb-irr0", 3, "irrigation", ["Light irrigation", "हलके पाणी द्या"], ["Give light water only if the soil dries.", "जमीन कोरडी झाल्यासच हलके पाणी द्या."]),
      t("fb-gap", 10, "other", ["Fill gaps", "खाडे भरा"], ["Resow where seeds did not come up.", "बी न उगवलेल्या जागी पुन्हा पेरा."]),
    ], [["Seed rot in wet soil", "ओल्या जमिनीत बी सडणे"]]),
    stage("vegetative", ["Plant growth", "रोपांची वाढ"], 12, 30, ["Leaves and branches grow.", "पाने व फांद्या वाढतात."], [
      t("fb-irr1", 12, "irrigation", ["Irrigate", "पाणी द्या"], ["Light water every 6–8 days.", "दर 6–8 दिवसांनी हलके पाणी."], 7),
      t("fb-weed", 18, "weeding", ["Weeding and earthing up", "खुरपणी व भर देणे"], ["Weed and pull soil to the base so plants stand firm.", "खुरपणी करा व झाडे मजबूत उभी राहावीत म्हणून बुंध्याला माती लावा."]),
      t("fb-obs1", 15, "observation", ["Check leaves", "पाने तपासा"], ["Look for aphids, whitefly, leaf miner trails and rust spots.", "मावा, पांढरी माशी, पाने पोखरणाऱ्या अळीच्या रेषा व तांबेरा ठिपके पाहा."], 7),
      t("fb-fert", 25, "fertiliser", ["Top dressing", "वरखत द्या"], ["Give a small nitrogen part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार नत्राचा लहान हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Aphids and whitefly", "मावा व पांढरी माशी"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 30, 45, ["White or purple flowers open and pods start.", "पांढरी किंवा जांभळी फुले उमलतात व शेंगा लागू लागतात."], [
      t("fb-irr2", 30, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Water stress now drops flowers.", "आता पाण्याचा ताण आल्यास फुलगळ होते."], 6),
      t("fb-obs2", 32, "observation", ["Check flowers", "फुले तपासा"], ["Look for pod borer caterpillars in flowers and young pods.", "फुले व कोवळ्या शेंगांमध्ये शेंगा पोखरणाऱ्या अळ्या पाहा."], 7),
    ], [["Flower drop in heat or cold", "उष्णता किंवा थंडीमुळे फुलगळ"]]),
    stage("harvest", ["Harvest (pickings)", "तोडणी"], 45, 80, ["Tender pods are picked every 4–5 days.", "दर 4–5 दिवसांनी कोवळ्या शेंगा तोडल्या जातात."], [
      t("fb-pick", 45, "harvest", ["Pick tender pods", "कोवळ्या शेंगा तोडा"], ["Pick when pods are full-sized, snap easily and seeds are still small.", "शेंगा पूर्ण आकाराच्या, सहज मोडणाऱ्या आणि बिया अजून लहान असताना तोडा."], 4),
      t("fb-irr3", 46, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep moisture even between pickings.", "तोडण्यांच्या मध्ये ओलावा सारखा ठेवा."], 6),
      t("fb-obs3", 48, "observation", ["Remove bored pods", "पोखरलेल्या शेंगा काढा"], ["Remove pods with holes and destroy them.", "छिद्रे असलेल्या शेंगा काढून नष्ट करा."], 7),
    ], [["Check pre-harvest waiting days on any product label before picking", "तोडणीपूर्वी वापरलेल्या औषधाच्या लेबलवरील काढणीपूर्व कालावधी तपासा"]]),
    stage("last-pickings", ["Last pickings & cleanup", "शेवटच्या तोडण्या व शेत स्वच्छता"], 80, 90, ["The crop finishes.", "पीक संपते."], [
      t("fb-pick2", 80, "harvest", ["Last pickings", "शेवटच्या तोडण्या"], ["Pick the remaining tender pods.", "उरलेल्या कोवळ्या शेंगा तोडा."], 4),
      t("fb-clean", 86, "other", ["Clear the field", "शेत मोकळे करा"], ["Plough in healthy plant remains; remove diseased ones.", "निरोगी अवशेष जमिनीत गाडा; रोगट काढून टाका."]),
    ], [["Diseased plant remains", "रोगट अवशेष"]]),
  ],
  flushes: { everyDays: 4, count: 8, note: b("Pick tender pods every 4–5 days.", "दर 4–5 दिवसांनी कोवळ्या शेंगा तोडा.") },
  commonProblems: [
    { name: b("Pod borer", "शेंगा पोखरणारी अळी"), signs: b("Holes in flowers and pods; caterpillars inside.", "फुले व शेंगांना छिद्रे; आत अळ्या."), prevention: prevent("Check flowers weekly, use pheromone traps, and pick and destroy bored pods.", "दर आठवड्याला फुले तपासा, कामगंध सापळे लावा आणि पोखरलेल्या शेंगा तोडून नष्ट करा.") },
    { name: b("Aphids and whitefly", "मावा व पांढरी माशी"), signs: b("Insects under leaves; leaves curl, sticky and yellow.", "पानांखाली किडी; पाने आकसलेली, चिकट व पिवळी."), prevention: prevent("Use yellow sticky traps and keep weeds down.", "पिवळे चिकट सापळे लावा व तण कमी ठेवा.") },
    { name: b("Rust and anthracnose", "तांबेरा व करपा"), signs: b("Rusty brown powdery spots under leaves; dark sunken spots on pods.", "पानांखाली तांबूस भुकटीसारखे ठिपके; शेंगांवर काळसर खोलगट डाग."), prevention: prevent("Use healthy seed, rotate crops and avoid wetting leaves late in the day.", "निरोगी बियाणे वापरा, पिकांची फेरपालट करा व संध्याकाळी पाने ओली करणे टाळा.") },
  ],
  harvestSigns: b("Pods are full-sized, smooth, bright green and snap cleanly; seeds are not bulging.", "शेंगा पूर्ण आकाराच्या, गुळगुळीत, चमकदार हिरव्या व सहज मोडणाऱ्या; बिया फुगलेल्या नाहीत."),
  postHarvest: b("Pick in cool hours, keep in shade, sort out damaged and over-mature pods and pack in ventilated bags or crates.", "थंड वेळेत तोडा, सावलीत ठेवा, खराब व जून शेंगा वेगळ्या करा आणि हवेशीर पिशव्या किंवा क्रेटमध्ये भरा."),
  marketTips: b("Straight, tender, stringless pods get the best rate in city markets. Rabi beans are usually better quality. Sell together through your Mandi Mitra to reach city buyers.", "सरळ, कोवळ्या, शिरा नसलेल्या शेंगांना शहरी बाजारात चांगला दर. रब्बी फरसबीचा दर्जा बहुधा चांगला असतो. शहरातील खरेदीदारांपर्यंत पोहोचण्यासाठी मंडी मित्रामार्फत एकत्र विका."),
  varieties: [
    { name: "Arka Komal", note: b("Bush type with straight, tender pods (ICAR-IIHR)", "सरळ, कोवळ्या शेंगांची झुडूप जात (ICAR-IIHR)") },
    { name: "Arka Suvidha", note: b("Bush type with stringless pods (ICAR-IIHR)", "शिरा नसलेल्या शेंगांची झुडूप जात (ICAR-IIHR)") },
  ], // TODO: varieties — confirm MPKV Rahuri French bean releases
  source: "General practices from MPKV Rahuri and ICAR-IIHR vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
