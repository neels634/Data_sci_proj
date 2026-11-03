import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "jowar",
  emoji: "🌾",
  name: b("Jowar (sorghum)", "ज्वारी"),
  aliases: ["jowar", "jwari", "jvari", "sorghum", "ज्वारी", "जोवार", "ज्वार"],
  category: "cereal",
  lifecycle: "seasonal",
  regions: ["western", "marathwada", "north"],
  majorDistricts: b("Solapur, Ahilyanagar, Pune, Beed, Dharashiv", "सोलापूर, अहिल्यानगर, पुणे, बीड, धाराशिव"),
  tier: 1,
  seasons: [
    { season: "kharif", sowingWindow: b("June–July", "जून–जुलै"), sowingMonths: [6, 7], durationDays: [100, 115] },
    { season: "rabi", sowingWindow: b("September–October", "सप्टेंबर–ऑक्टोबर"), sowingMonths: [9, 10], durationDays: [110, 125] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b("Medium to deep black soil; rabi jowar grows on stored moisture.", "मध्यम ते भारी काळी जमीन; रब्बी ज्वारी साठवलेल्या ओलाव्यावर येते."),
  climate: b("Kharif rains or rabi stored moisture; tolerates dry spells better than many crops.", "खरीप पाऊस किंवा रब्बीतील साठवलेला ओलावा; अनेक पिकांपेक्षा खंड जास्त सहन करते."),
  seedRate: b("About 4–5 kg seed per acre.", "एकरी साधारण 4–5 किलो बियाणे."),
  spacing: b("45 cm between rows, about 15 cm between plants.", "ओळींत 45 सेंमी, रोपांत साधारण 15 सेंमी."),
  irrigation: b("Rabi jowar benefits from irrigation at knee-high, flowering and grain filling stages if water is available.", "पाणी उपलब्ध असल्यास रब्बी ज्वारीला गुडघाभर उंची, फुलोरा व दाणे भरताना पाणी फायदेशीर."),
  nutrientGuide: b("Use a soil test. Add farmyard manure; give nitrogen in parts. Ask your agriculture officer for amounts.", "माती परीक्षण करा. शेणखत मिसळा; नत्र विभागून द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 12, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("jw-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow in 45 cm rows, 3–4 cm deep.", "45 सेंमी ओळीत, 3–4 सेंमी खोल पेरा."]),
      t("jw-thin", 10, "other", ["Thin the plants", "विरळणी करा"], ["Keep one healthy plant every 15 cm.", "दर 15 सेंमीवर एक निरोगी रोप ठेवा."]),
    ], [["Shoot fly in young plants", "कोवळ्या रोपांवर खोडमाशी"]]),
    stage("vegetative", ["Plant growth", "रोपांची वाढ"], 12, 50, ["Leaves and stem grow.", "पाने व खोड वाढते."], [
      t("jw-obs1", 13, "observation", ["Check young plants", "कोवळी रोपे तपासा"], ["Look for dead centre leaves (shoot fly) and holes in stems (stem borer).", "मधले पान वाळणे (खोडमाशी) व खोडाला छिद्रे (खोडकिडा) पाहा."], 7),
      t("jw-weed", 18, "weeding", ["Weeding", "खुरपणी"], ["Weed or hoe between rows.", "ओळींमध्ये खुरपणी किंवा कोळपणी करा."], 15),
      t("jw-fert", 30, "fertiliser", ["Top dressing", "वरखत"], ["Next nitrogen part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार नत्राचा पुढचा हप्ता. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
      t("jw-irr1", 35, "irrigation", ["Irrigation at knee-high stage", "गुडघाभर उंचीला पाणी"], ["Mainly for rabi jowar, if water is available.", "मुख्यतः रब्बी ज्वारीसाठी, पाणी उपलब्ध असल्यास."]),
    ], [["Stem borer", "खोडकिडा"]]),
    stage("flowering", ["Booting & flowering", "पोटरी व फुलोरा"], 50, 75, ["Earheads come out and flower.", "कणसे बाहेर येऊन फुलतात."], [
      t("jw-obs2", 51, "observation", ["Check earheads", "कणसे तपासा"], ["Look for midge and earhead bugs.", "मिज माशी व कणसावरील ढेकूण पाहा."], 7),
      t("jw-irr2", 55, "irrigation", ["Irrigation at flowering", "फुलोऱ्यात पाणी"], ["The most important irrigation, if water is available.", "पाणी उपलब्ध असल्यास सर्वात महत्त्वाचे पाणी."]),
    ], [["Earhead bugs", "कणसावरील ढेकूण"]]),
    stage("grain", ["Grain filling", "दाणे भरणे"], 75, 105, ["Grains fill and harden.", "दाणे भरतात व टणक होतात."], [
      t("jw-obs3", 78, "observation", ["Check grain", "दाणे तपासा"], ["Look at earheads for pests and mould.", "कणसांवर कीड व बुरशी पाहा."], 10),
      t("jw-irr3", 80, "irrigation", ["Irrigation at grain filling", "दाणे भरताना पाणी"], ["If water is available and soil is dry.", "पाणी उपलब्ध असल्यास व जमीन कोरडी असल्यास."]),
      t("jw-bird", 85, "other", ["Protect from birds", "पक्ष्यांपासून संरक्षण करा"], ["Guard earheads from birds in the mornings and evenings.", "सकाळ-संध्याकाळ कणसांचे पक्ष्यांपासून राखण करा."]),
    ], [["Bird damage", "पक्ष्यांचे नुकसान"], ["Grain mould in rain", "पावसात दाण्यांवर बुरशी"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 105, 125, ["Grains are hard and the crop is ready.", "दाणे टणक होऊन पीक तयार होते."], [
      t("jw-mat", 105, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Grain hard with a black spot at its base → ready.", "दाणा टणक व तळाशी काळा ठिपका → तयार."]),
      t("jw-harv", 110, "harvest", ["Harvest", "काढणी करा"], ["Cut earheads, dry well and thresh. Keep the fodder dry.", "कणसे कापा, चांगली वाळवा व मळणी करा. कडबा कोरडा ठेवा."]),
    ], [["Rain at harvest causes mould", "काढणीच्या वेळी पावसाने बुरशी"]]),
  ],
  commonProblems: [
    { name: b("Shoot fly", "खोडमाशी"), signs: b("The centre leaf of young plants dries (dead heart).", "कोवळ्या रोपांचे मधले पान वाळते."), prevention: prevent("Sow on time; late sowing gets more shoot fly.", "वेळेवर पेरणी करा; उशिरा पेरणीला खोडमाशी जास्त.") },
    { name: b("Stem borer", "खोडकिडा"), signs: b("Holes in stem, dead centre leaf in older plants.", "खोडाला छिद्रे, मोठ्या रोपांचे मधले पान वाळते."), prevention: prevent("Destroy stubble after harvest.", "काढणीनंतर धसकटे नष्ट करा.") },
    { name: b("Charcoal rot (rabi jowar)", "खोडकूज (रब्बी ज्वारी)"), signs: b("Near maturity the stem goes soft and hollow inside with black specks, and plants fall over — worse when the soil dries out.", "पक्वतेजवळ खोड आतून नरम व पोकळ होऊन काळे कण दिसतात आणि झाडे लोळतात — जमीन कोरडी पडल्यास जास्त."), prevention: prevent("Keep soil moisture with mulch or a protective irrigation at grain filling, avoid very dense plants and too much nitrogen, and rotate crops.", "दाणे भरताना आच्छादन किंवा संरक्षित पाण्याने ओल टिकवा, खूप दाट रोपे व जास्त नत्र टाळा आणि पिकांची फेरपालट करा.") },
    { name: b("Grain mould (kharif jowar)", "दाण्यांवरील बुरशी (खरीप ज्वारी)"), signs: b("Rain at grain filling makes grains pink, grey or black and soft; they lose weight and price.", "दाणे भरताना पाऊस पडल्यास दाणे गुलाबी, राखाडी किंवा काळे व मऊ होतात; वजन व दर कमी होतो."), prevention: prevent("Sow early so grains ripen after the heavy rains, harvest at maturity without delay and dry earheads quickly.", "जोराचा पाऊस संपल्यावर दाणे पिकतील अशी लवकर पेरणी करा, पक्व होताच उशीर न करता काढणी करा व कणसे लवकर वाळवा.") },
  ],
  harvestSigns: b("Grains are hard and show a black spot where they join the earhead.", "दाणे टणक असून कणसाला जोडलेल्या ठिकाणी काळा ठिपका दिसतो."),
  postHarvest: b("Dry grain well and store in clean bags. Store fodder (kadba) dry — it is valuable.", "धान्य चांगले वाळवून स्वच्छ पोत्यांत साठवा. कडबा कोरडा साठवा — तो मौल्यवान आहे."),
  marketTips: b("Rabi jowar grain fetches good rates; fodder is a second income. Check the support price.", "रब्बी ज्वारीला चांगला दर मिळतो; कडबा हे दुसरे उत्पन्न आहे. हमीभाव तपासा."),
  varieties: [
    { name: "Maldandi (M 35-1)", note: b("Traditional rabi jowar, prized grain and fodder", "पारंपरिक रब्बी ज्वारी; दाणे व कडबा चांगला") },
    { name: "Phule Vasudha", note: b("Rabi jowar released by MPKV Rahuri", "मफुकृवि राहुरीची रब्बी ज्वारी") },
    { name: "Phule Suchitra", note: b("Rabi jowar released by MPKV Rahuri", "मफुकृवि राहुरीची रब्बी ज्वारी") },
  ],
  source: "General practices from ICAR-IIMR and MPKV Rahuri sorghum guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
