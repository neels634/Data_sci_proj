import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "roselle",
  emoji: "🌺",
  name: b("Roselle (ambadi)", "अंबाडी"),
  aliases: ["roselle", "ambadi", "ambaadi", "ambari", "अंबाडी", "आंबाडी", "gongura", "lal ambadi", "sorrel", "hibiscus sabdariffa"],
  category: "leafy",
  lifecycle: "seasonal",
  regions: ["vidarbha", "marathwada", "western", "north"],
  tier: 2,
  seasons: [
    { season: "kharif", label: b("Kharif", "खरीप"), sowingWindow: b("June–July, with the first good rains", "जून–जुलै, पहिल्या चांगल्या पावसानंतर"), sowingMonths: [6, 7], durationDays: [150, 180] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly (often on field borders or as a mixed crop)", "बियाणे; थेट पेरणी (बहुधा बांधावर किंवा मिश्र पीक म्हणून)"),
  // TODO: confirm seed rate for a pure leaf/calyx crop with VNMKV Parbhani / Dr. PDKV Akola
  seedRate: b("About 2–3 kg seed per acre for a pure crop; much less on bunds.", "शुद्ध पिकासाठी एकरी साधारण 2–3 किलो बियाणे; बांधावर खूप कमी."),
  spacing: b("45–60 cm between rows, 30 cm between plants.", "दोन ओळींत 45–60 सेंमी, दोन रोपांत 30 सेंमी."),
  soil: b(
    "Grows on most well-drained soils, including light soils. Avoid waterlogged fields.",
    "हलक्या जमिनीसह पाण्याचा निचरा होणारी बहुतेक जमीन चालते. पाणी साचणारे शेत टाळा.",
  ),
  climate: b(
    "A hardy rainy-season crop. Flowers come as days get shorter in September–October.",
    "पावसाळ्यातील काटक पीक. सप्टेंबर–ऑक्टोबरमध्ये दिवस लहान होऊ लागले की फुले येतात.",
  ),
  irrigation: b(
    "Mostly rainfed. Give protective water during long dry spells and after the rains while calyxes develop.",
    "बहुधा पावसावर. पावसाचा मोठा खंड पडल्यास आणि पाऊस संपल्यावर बोंडे पोसताना संरक्षित पाणी द्या.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure before sowing. A light nitrogen dose after leaf pickings helps regrowth, as per soil test. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी चांगले कुजलेले शेणखत मिसळा. पाने खुडल्यानंतर माती परीक्षणानुसार थोडे नत्र दिल्यास नवी फूट चांगली येते. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("sowing", ["Sowing & establishment", "पेरणी व रोपे स्थिरावणे"], 0, 15, ["Seeds sprout in about a week and seedlings settle.", "साधारण आठवडाभरात बी उगवते व रोपे स्थिरावतात."], [
      t("ab-sow", 0, "sowing", ["Sow seed", "बियाणे पेरा"], ["Sow 2–3 seeds per spot in lines after good rain; cover lightly.", "चांगल्या पावसानंतर ओळीत एका जागी 2–3 बिया पेरा; हलके झाका."]),
      t("ab-gap", 10, "other", ["Fill gaps", "खाडे भरा"], ["Re-sow where seeds did not come up.", "जेथे बी उगवले नाही तेथे पुन्हा पेरा."]),
    ], [["Seed rot in waterlogged spots", "पाणी साचलेल्या जागी बी कुजणे"]]),
    stage("early-growth", ["Early growth", "सुरुवातीची वाढ"], 15, 40, ["Plants grow leaves and branches.", "रोपांना पाने व फांद्या येतात."], [
      t("ab-thin", 18, "other", ["Thin to one plant", "एक रोप ठेवा"], ["Keep the strongest plant at each spot.", "प्रत्येक जागी सर्वात जोमदार रोप ठेवा."]),
      t("ab-weed", 25, "weeding", ["Weeding", "खुरपणी"], ["Weed once or twice by hand or hoe.", "हाताने किंवा कोळप्याने एक-दोन वेळा खुरपणी करा."]),
      t("ab-obs1", 30, "observation", ["Check plants", "रोपे तपासा"], ["Look for white cottony insects on shoots and holes in leaves.", "शेंड्यांवर पांढरे कापसासारखे किडे आणि पानांना छिद्रे आहेत का पाहा."], 10),
    ], [["Flea beetles making small holes in leaves", "पानांना बारीक छिद्रे पाडणारे भुंगेरे"]]),
    stage("leaf-harvest", ["Leaf picking", "पानांची खुडणी"], 40, 100, ["Tender leaves and shoot tips are picked for bhaji.", "भाजीसाठी कोवळी पाने व शेंडे खुडले जातात."], [
      t("ab-pick", 40, "harvest", ["Pick tender leaves", "कोवळी पाने खुडा"], ["Pick tender shoots and leaves; leave enough leaves for the plant to keep growing.", "कोवळे शेंडे व पाने खुडा; झाड वाढत राहावे म्हणून पुरेशी पाने ठेवा."], 15),
      t("ab-obs2", 45, "observation", ["Check for mealybugs", "पिठ्या ढेकूण तपासा"], ["White cottony clusters on shoots cause curling and stunting — remove them early.", "शेंड्यांवरील पांढरे कापसासारखे पुंजके शेंडे वाकडे व खुरटे करतात — लवकर काढा."], 10),
      t("ab-drain", 50, "other", ["Drain rain water", "पावसाचे पाणी काढून द्या"], ["Open channels so water does not stand around the stems.", "खोडांभोवती पाणी साचू नये म्हणून चर काढा."]),
    ], [["Mealybugs", "पिठ्या ढेकूण"], ["Stem rot at the base in waterlogging", "पाणी साचल्यास बुंध्याशी खोडकुज"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 100, 140, ["Yellow flowers open; the red cup (calyx) under each flower starts to swell.", "पिवळी फुले उमलतात; प्रत्येक फुलाखालचे लाल बोंड (पुष्पकोश) फुगू लागते."], [
      t("ab-stoppick", 100, "observation", ["Slow down leaf picking", "पानांची खुडणी कमी करा"], ["If you want calyxes, stop heavy leaf picking so the plant can flower well.", "बोंडे हवी असल्यास जास्त खुडणी थांबवा, म्हणजे झाडाला चांगला फुलोरा येतो."]),
      t("ab-irr1", 110, "irrigation", ["Protective irrigation", "संरक्षित पाणी"], ["If the rains have stopped, give water so calyxes fill well.", "पाऊस थांबला असल्यास बोंडे चांगली भरावीत म्हणून पाणी द्या."], 12),
    ], [["Flower drop in dry stress", "पाण्याच्या ताणाने फुलगळ"]]),
    stage("calyx-harvest", ["Calyx harvest", "बोंडांची तोडणी"], 140, 180, ["Fleshy red calyxes are picked about 2–3 weeks after flowering.", "फुलोऱ्यानंतर साधारण 2–3 आठवड्यांनी मांसल लाल बोंडे तोडली जातात."], [
      t("ab-calyx", 140, "harvest", ["Pick calyxes", "बोंडे तोडा"], ["Pick plump, bright red calyxes while still tender, in several rounds.", "भरलेली, चमकदार लाल व कोवळी बोंडे अनेक फेऱ्यांत तोडा."], 10),
      t("ab-dry", 142, "other", ["Separate and dry", "बोंडे वेगळी करून सुकवा"], ["Remove the seed pod from the calyx and dry the red petals in shade on a clean sheet if you are selling dry.", "सुके विकायचे असल्यास बोंडातील बियांचे बोंड काढून लाल पाकळ्या स्वच्छ कापडावर सावलीत सुकवा."]),
    ], [["Mould on calyxes dried in damp weather", "दमट हवेत सुकवलेल्या बोंडांना बुरशी"]]),
  ],
  flushes: { everyDays: 15, count: 4, note: b("Leaves can be picked every 15 days or so from about 40 days until flowering. Calyxes are picked separately at the end.", "साधारण 40 दिवसांपासून फुलोऱ्यापर्यंत दर 15 दिवसांनी पाने खुडता येतात. शेवटी बोंडे वेगळी तोडली जातात.") },
  commonProblems: [
    { name: b("Mealybugs", "पिठ्या ढेकूण"), signs: b("White cottony clusters on shoots and calyxes; shoots twist and growth stops.", "शेंडे व बोंडांवर पांढरे कापसासारखे पुंजके; शेंडे पिळवटतात व वाढ थांबते."), prevention: prevent("Remove and destroy affected shoots early, control ants, and keep weeds and other host plants away.", "बाधित शेंडे लवकर काढून नष्ट करा, मुंग्यांचा बंदोबस्त करा आणि तण व इतर आश्रय झाडे दूर ठेवा.") },
    { name: b("Stem and root rot", "खोडकुज व मूळकुज"), signs: b("The stem base turns dark and soft and the plant wilts.", "बुंधा काळा व मऊ होतो आणि झाड मलूल होते."), prevention: prevent("Avoid waterlogging, drain fields after heavy rain and rotate the crop.", "पाणी साचू देऊ नका, जोराच्या पावसानंतर पाण्याचा निचरा करा आणि पिकांची फेरपालट करा.") },
    { name: b("Leaf-eating beetles and caterpillars", "पाने खाणारे भुंगेरे व अळ्या"), signs: b("Many small holes or chewed edges on leaves.", "पानांना अनेक बारीक छिद्रे किंवा कडा कुरतडलेल्या."), prevention: prevent("Check plants weekly and hand-pick caterpillars. Leaves are eaten as bhaji, so always respect the waiting period on any label.", "दर आठवड्याला झाडे तपासा आणि अळ्या हाताने वेचा. पाने भाजी म्हणून खाल्ली जातात, त्यामुळे लेबलवरील प्रतीक्षा कालावधी नक्की पाळा.") },
  ],
  harvestSigns: b("Leaves: tender, sour-tasting shoots from 40 days. Calyxes: plump, bright red and fleshy, 2–3 weeks after flowering.", "पाने: 40 दिवसांपासून कोवळे, आंबट शेंडे. बोंडे: फुलोऱ्यानंतर 2–3 आठवड्यांनी भरलेली, चमकदार लाल व मांसल."),
  postHarvest: b(
    "Sell leaves fresh in bunches the same day. Calyxes can be sold fresh, or the seed pod removed and the calyx dried in shade, then stored in clean, dry bags.",
    "पाने जुड्या बांधून त्याच दिवशी ताजी विका. बोंडे ताजी विका, किंवा आतील बियांचे बोंड काढून पुष्पकोश सावलीत सुकवा व स्वच्छ, कोरड्या पिशव्यांत साठवा.",
  ),
  marketTips: b(
    "Ambadi bhaji has steady local demand in the monsoon. Dried red calyxes are bought for sherbet, jam and tea — find a buyer or processor before growing a large area.",
    "पावसाळ्यात अंबाडीच्या भाजीला स्थानिक मागणी असते. सुकवलेली लाल बोंडे सरबत, जॅम व चहासाठी घेतली जातात — मोठ्या क्षेत्रावर लागवडीपूर्वी खरेदीदार किंवा प्रक्रिया उद्योग शोधा.",
  ),
  varieties: [], // TODO: varieties — confirm leaf/calyx types with VNMKV Parbhani / Dr. PDKV Akola
  source: "General practices from VNMKV Parbhani and Dr. PDKV Akola vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
