import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "mustard",
  emoji: "🌼",
  name: b("Mustard", "मोहरी"),
  aliases: ["mustard", "mohari", "mohri", "rai", "sarson", "rapeseed", "mustard seed", "मोहरी", "राई", "सरसों"],
  category: "oilseed",
  lifecycle: "seasonal",
  regions: ["vidarbha", "marathwada"],
  tier: 2,
  seasons: [
    { season: "rabi", sowingWindow: b("October to early November", "ऑक्टोबर ते नोव्हेंबरच्या सुरुवातीला"), sowingMonths: [10, 11], durationDays: [110, 130] },
  ],
  method: "direct",
  plantingMaterial: b("Seed (small; mix with sand for even sowing)", "बियाणे (बारीक; एकसारख्या पेरणीसाठी वाळूत मिसळा)"),
  soil: b("Medium, well-drained loamy or black soil.", "मध्यम, पाण्याचा निचरा होणारी पोयट्याची किंवा काळी जमीन."),
  climate: b("Cool, dry winter. Cloudy weather brings aphids; frost at flowering damages pods.", "थंड, कोरडा हिवाळा. ढगाळ हवेत मावा वाढतो; फुलोऱ्यात दव-धुक्याने शेंगांचे नुकसान."),
  seedRate: b("About 1.5–2 kg seed per acre.", "एकरी साधारण 1.5–2 किलो बियाणे."),
  spacing: b("45 cm between rows and 10–15 cm between plants.", "ओळींत 45 सेंमी व रोपांत 10–15 सेंमी."),
  irrigation: b("Give 2–3 irrigations where possible: at branching, flowering and pod filling. Rainfed crop depends on stored moisture.", "शक्य असल्यास 2–3 पाणी द्या: फांद्या फुटताना, फुलोऱ्यात व शेंगा भरताना. कोरडवाहू पीक साठवलेल्या ओलाव्यावर."),
  nutrientGuide: b("Use a soil test. Mustard needs sulphur for oil. Mix farmyard manure and give nitrogen in parts. Ask your agriculture officer for amounts.", "माती परीक्षण करा. तेलासाठी मोहरीला गंधक लागते. शेणखत मिसळा व नत्र विभागून द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."),
  varieties: [
    { name: "Pusa Bold", note: b("Bold-seeded variety from ICAR-IARI, widely grown in India", "ICAR-भारतीय कृषी संशोधन संस्थेचा टपोऱ्या दाण्याचा, देशभर घेतला जाणारा वाण") },
    { name: "Varuna (T-59)", note: b("Old, widely grown variety in India", "देशात मोठ्या प्रमाणावर घेतला जाणारा जुना वाण") },
  ], // TODO: varieties — confirm varieties recommended for Maharashtra with Dr. PDKV Akola
  stages: [
    stage("emergence", ["Sowing & emergence", "पेरणी व उगवण"], 0, 15, ["Seedlings come up in 5–7 days.", "5–7 दिवसांत रोपे वर येतात."], [
      t("ms-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Mix seed with sand and sow 2–3 cm deep in rows.", "बियाणे वाळूत मिसळून ओळीत 2–3 सेंमी खोल पेरा."]),
      t("ms-thin", 12, "other", ["Thin plants", "विरळणी करा"], ["Keep one plant every 10–15 cm.", "दर 10–15 सेंमीवर एक रोप ठेवा."]),
    ], [["Painted bug and leaf-eating sawfly larvae on seedlings", "रोपांवर रंगीत ढेकूण व पाने खाणाऱ्या अळ्या"]]),
    stage("vegetative", ["Branching", "फांद्या फुटणे"], 15, 45, ["Leaves and branches grow.", "पाने व फांद्या वाढतात."], [
      t("ms-weed", 18, "weeding", ["Weeding", "खुरपणी"], ["Weed and hoe once or twice.", "1–2 वेळा खुरपणी व कोळपणी करा."], 15),
      t("ms-irr1", 30, "irrigation", ["First irrigation", "पहिले पाणी"], ["Irrigate at branching if water is available.", "पाणी उपलब्ध असल्यास फांद्या फुटताना पाणी द्या."]),
      t("ms-fert", 30, "fertiliser", ["Second nitrogen part", "नत्राचा दुसरा हप्ता"], ["Give with the first irrigation, as per soil test.", "माती परीक्षणानुसार पहिल्या पाण्यासोबत द्या."]),
    ], [["Aphids starting on tips", "शेंड्यांवर मावा सुरू होणे"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 45, 75, ["Yellow flowers open; bees pollinate.", "पिवळी फुले उमलतात; मधमाश्या परागीभवन करतात."], [
      t("ms-obs1", 45, "observation", ["Check for aphids", "मावा तपासा"], ["Check shoot tips and flower clusters twice a week; aphids multiply fast in cloudy weather.", "आठवड्यातून दोनदा शेंडे व फुलांचे घोस तपासा; ढगाळ हवेत मावा झपाट्याने वाढतो."], 4),
      t("ms-irr2", 50, "irrigation", ["Irrigate at flowering", "फुलोऱ्यात पाणी द्या"], ["Important watering if available.", "उपलब्ध असल्यास महत्त्वाचे पाणी."]),
    ], [["Aphids", "मावा"], ["White rust and leaf blight", "पांढरा तांबेरा व करपा"]]),
    stage("pod-filling", ["Pod filling", "शेंगा भरणे"], 75, 105, ["Pods fill with seed.", "शेंगांत दाणे भरतात."], [
      t("ms-irr3", 75, "irrigation", ["Irrigate at pod filling", "शेंगा भरताना पाणी द्या"], ["Last watering if soil is dry.", "जमीन कोरडी असल्यास शेवटचे पाणी."]),
      t("ms-obs2", 78, "observation", ["Check pods", "शेंगा तपासा"], ["Look for aphids on pods and disease spots.", "शेंगांवर मावा व रोगाचे ठिपके पाहा."], 7),
    ], [["Aphids on pods", "शेंगांवर मावा"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 105, 130, ["Pods turn yellow-brown; seed hardens.", "शेंगा पिवळसर तपकिरी होतात; दाणे टणक होतात."], [
      t("ms-harv", 105, "harvest", ["Harvest", "काढणी करा"], ["Cut when most pods are yellow, early in the morning to avoid shattering.", "बहुतेक शेंगा पिवळ्या झाल्यावर, शेंगा फुटू नयेत म्हणून सकाळी लवकर कापा."]),
      t("ms-dry", 108, "other", ["Dry and thresh", "वाळवून मळणी करा"], ["Stack for a few days, then thresh and dry seed.", "काही दिवस ढीग लावा, मग मळणी करून दाणे वाळवा."]),
    ], [["Pods shattering if harvest is late", "काढणी उशिरा झाल्यास शेंगा फुटणे"]]),
  ],
  commonProblems: [
    {
      name: b("Mustard aphid", "मावा"),
      signs: b("Colonies of small grey-green insects on tips, flowers and pods; plants stunted.", "शेंडे, फुले व शेंगांवर लहान राखाडी-हिरव्या किड्यांचे थवे; झाडे खुरटतात."),
      prevention: prevent("Sow on time (late crop is hit hardest), remove heavily infested tips early and keep checking.", "वेळेवर पेरणी करा (उशिरा पेरणीला जास्त त्रास), जास्त बाधित शेंडे लवकर खुडा व सतत तपासणी करा."),
    },
    {
      name: b("White rust", "पांढरा तांबेरा"),
      signs: b("White raised spots under leaves; swollen, twisted flower stalks.", "पानांखाली पांढरे उठावदार फोड; फुलांचे दांडे सुजून वाकडे होतात."),
      prevention: prevent("Clean seed, crop rotation and removal of affected plant parts.", "स्वच्छ बियाणे, फेरपालट व बाधित भाग काढणे."),
    },
    {
      name: b("Alternaria blight", "करपा"),
      signs: b("Dark round spots with rings on leaves and pods.", "पाने व शेंगांवर वलयांचे काळपट गोल ठिपके."),
      prevention: prevent("Sow on time, use healthy seed and avoid excess irrigation.", "वेळेवर पेरणी, निरोगी बियाणे व जास्त पाणी टाळा."),
    },
  ],
  harvestSigns: b("Most pods turn yellow-brown and seeds rattle inside.", "बहुतेक शेंगा पिवळसर तपकिरी होतात व आत दाणे खुळखुळतात."),
  postHarvest: b("Dry seed fully, clean it and store in dry bags away from damp.", "दाणे पूर्ण वाळवा, स्वच्छ करा व ओलाव्यापासून दूर कोरड्या पोत्यांत साठवा."),
  marketTips: b("Clean seed is sold for oil and as kitchen spice (mohari). Small lots can be cleaned and packed for local sale.", "स्वच्छ दाणे तेलासाठी व स्वयंपाकातील फोडणीसाठी विकले जातात. थोडा माल स्वच्छ करून पॅक करून स्थानिक विक्री करता येते."),
  source: "General practices from ICAR-DRMR (rapeseed-mustard) and Dr. PDKV Akola rabi oilseed guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
