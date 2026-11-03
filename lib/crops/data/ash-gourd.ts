import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "ash-gourd",
  emoji: "🍈",
  name: b("Ash gourd", "कोहळा"),
  aliases: ["ash gourd", "white pumpkin", "winter melon", "kohla", "kohala", "कोहळा", "कोहळे", "petha", "पेठा"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["konkan", "western", "north", "marathwada", "vidarbha"],
  tier: 2,
  seasons: [
    { season: "kharif", sowingWindow: b("June–July", "जून–जुलै"), sowingMonths: [6, 7], durationDays: [130, 160] },
    { season: "summer", sowingWindow: b("January–February (with irrigation)", "जानेवारी–फेब्रुवारी (पाण्याची सोय असल्यास)"), sowingMonths: [1, 2], durationDays: [120, 150] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly in pits", "बियाणे; खड्ड्यांत थेट टोकणी"),
  soil: b("Well-drained loamy or medium black soil with plenty of organic matter.", "भरपूर सेंद्रिय पदार्थ असलेली, पाण्याचा निचरा होणारी पोयट्याची किंवा मध्यम काळी जमीन."),
  climate: b("Warm weather. A hardy, long-duration vine; waterlogging rots fruits lying on the ground.", "उबदार हवामान. काटक, जास्त दिवसांचा वेल; पाणी साचल्यास जमिनीवरील फळे सडतात."),
  seedRate: b("About 1–1.5 kg seed per acre; 2–3 seeds per pit.", "एकरी साधारण 1–1.5 किलो बियाणे; एका खड्ड्यात 2–3 बिया."),
  spacing: b("On the ground: 2.5–3 m between rows and about 1 m between pits. Can also be grown on a strong trellis.", "जमिनीवर: ओळींत 2.5–3 मीटर व खड्ड्यांत साधारण 1 मीटर. मजबूत मांडवावरही घेता येतो."),
  irrigation: b(
    "Kharif crop needs water only in dry spells. Summer crop: every 6–8 days. Reduce water as fruits mature.",
    "खरीप पिकाला फक्त पावसाच्या खंडात पाणी. उन्हाळी पिकाला दर 6–8 दिवसांनी. फळे पक्व होताना पाणी कमी करा.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure in pits before sowing. Give fertiliser as per soil test, splitting nitrogen into 2 parts. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी खड्ड्यांत चांगले कुजलेले शेणखत मिसळा. माती परीक्षणानुसार खत द्या; नत्र 2 हप्त्यांत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Sowing & germination", "टोकणी व उगवण"], 0, 15, ["Seeds sprout in 7–10 days.", "7–10 दिवसांत बी उगवते."], [
      t("ag-sow", 0, "sowing", ["Sow seeds in pits", "खड्ड्यांत बी टोका"], ["Soak seed overnight in plain water and sow 2–3 seeds per pit.", "बी रात्रभर साध्या पाण्यात भिजवून एका खड्ड्यात 2–3 बिया टोका."]),
      t("ag-irr0", 1, "irrigation", ["Light irrigation", "हलके पाणी द्या"], ["Keep pits moist until seeds come up.", "बी उगवेपर्यंत खड्डे ओलसर ठेवा."], 4),
      t("ag-thin", 12, "other", ["Fill gaps and thin", "खाडे भरा व विरळणी करा"], ["Resow empty pits and keep 2 plants per pit.", "रिकामे खड्डे भरा व एका खड्ड्यात 2 रोपे ठेवा."]),
    ], [["Red pumpkin beetle on seedlings", "रोपांवर लाल भुंगेरे"]]),
    stage("vine-growth", ["Vine growth", "वेलांची वाढ"], 15, 50, ["Vines spread widely.", "वेल मोठ्या प्रमाणात पसरतात."], [
      t("ag-irr1", 15, "irrigation", ["Irrigate", "पाणी द्या"], ["Water in furrows when the top soil dries.", "वरची माती कोरडी झाल्यावर सरीतून पाणी द्या."], 7),
      t("ag-obs1", 18, "observation", ["Check leaves", "पाने तपासा"], ["Look for beetles, white powder and yellow patches.", "भुंगेरे, पांढरी भुकटी व पिवळे चट्टे पाहा."], 7),
      t("ag-weed", 20, "weeding", ["Weeding", "खुरपणी"], ["Weed before vines cover the ground.", "वेल जमीन झाकण्यापूर्वी खुरपणी करा."]),
      t("ag-fert1", 32, "fertiliser", ["Top dressing", "वरखत द्या"], ["Give the second nitrogen part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार नत्राचा दुसरा हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Powdery and downy mildew", "भुरी व केवडा"]]),
    stage("flowering", ["Flowering & fruit set", "फुलोरा व फळधारणा"], 50, 70, ["Yellow flowers open; bees set the fruit.", "पिवळी फुले उमलतात; मधमाश्यांमुळे फळधारणा होते."], [
      t("ag-irr2", 50, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Avoid water stress so fruits set well.", "फळधारणा चांगली व्हावी म्हणून पाण्याचा ताण टाळा."], 6),
      t("ag-bees", 52, "observation", ["Protect bees", "मधमाश्यांचे संरक्षण करा"], ["Do not spray in the morning when flowers are open.", "सकाळी फुले उमललेली असताना फवारणी करू नका."]),
      t("ag-trap", 55, "observation", ["Set fruit fly traps", "फळमाशीसाठी सापळे लावा"], ["Hang traps when small fruits appear. Ask your KVK which trap to use.", "लहान फळे दिसू लागली की सापळे लावा. कोणता सापळा ते कृषी विज्ञान केंद्राला विचारा."]),
    ], [["Fruit fly on young fruit", "कोवळ्या फळांवर फळमाशी"]]),
    stage("fruit-development", ["Fruit development", "फळांची वाढ"], 70, 120, ["Fruits grow large and get a white, waxy coating.", "फळे मोठी होतात व त्यांच्यावर पांढरा मेणासारखा थर येतो."], [
      t("ag-irr3", 70, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water helps fruits fill.", "नियमित पाण्याने फळे भरतात."], 7),
      t("ag-straw", 75, "other", ["Put dry straw under fruits", "फळांखाली वाळलेले गवत ठेवा"], ["Straw under fruits stops rot from wet soil.", "फळांखाली गवत ठेवल्यास ओल्या मातीमुळे होणारी सड थांबते."]),
      t("ag-obs2", 78, "observation", ["Check fruits", "फळे तपासा"], ["Remove and bury rotting or fly-stung fruits.", "सडलेली किंवा फळमाशीचे डंख असलेली फळे काढून पुरा."], 10),
    ], [["Fruit rot on wet soil", "ओल्या मातीवर फळकूज"]]),
    stage("maturity", ["Maturity & harvest", "पक्वता व काढणी"], 120, 160, ["Fruits are fully covered with white powder and the stalk dries.", "फळांवर पूर्ण पांढरी भुकटी येते व देठ सुकतो."], [
      t("ag-less", 120, "irrigation", ["Reduce irrigation", "पाणी कमी करा"], ["Give less water so fruits mature and store well.", "फळे पक्व होऊन चांगली टिकावीत म्हणून पाणी कमी करा."]),
      t("ag-harv", 125, "harvest", ["Harvest mature fruits", "पक्व फळे काढा"], ["Cut mature fruits with a piece of stalk. Handle gently so the waxy coat stays on.", "पक्व फळे देठासह कापा. मेणासारखा थर निघू नये म्हणून हळुवार हाताळा."], 10),
      t("ag-store", 130, "other", ["Store in a dry, airy place", "कोरड्या, हवेशीर जागी साठवा"], ["Keep fruits on straw or racks in shade. Mature ash gourd keeps for several months.", "फळे सावलीत गवतावर किंवा मांडणीवर ठेवा. पक्व कोहळा अनेक महिने टिकतो."]),
    ], [["Damaged fruits rotting in storage", "इजा झालेली फळे साठवणीत सडणे"]]),
  ],
  commonProblems: [
    { name: b("Red pumpkin beetle", "लाल भुंगेरे"), signs: b("Holes in seedling leaves; young plants can die.", "रोपांच्या पानांना छिद्रे; लहान रोपे मरू शकतात."), prevention: prevent("Check seedlings daily and remove beetles by hand in the morning.", "रोज रोपे तपासा व सकाळी भुंगेरे हाताने वेचा.") },
    { name: b("Fruit fly", "फळमाशी"), signs: b("Stings on young fruit; fruit rots and drops.", "कोवळ्या फळांवर डंख; फळ सडून गळते."), prevention: prevent("Use fruit fly traps and bury damaged fruits.", "फळमाशीचे सापळे लावा व खराब फळे पुरा.") },
    { name: b("Powdery and downy mildew", "भुरी व केवडा"), signs: b("White powder or yellow angular patches on leaves.", "पानांवर पांढरी भुकटी किंवा पिवळे कोनाकृती चट्टे."), prevention: prevent("Keep good spacing and remove badly affected leaves.", "योग्य अंतर ठेवा व जास्त बाधित पाने काढा.") },
  ],
  harvestSigns: b("Fruit is fully covered with white waxy powder, the hairs are gone and the stalk has dried.", "फळावर पूर्ण पांढरा मेणासारखा थर, लव निघून गेलेली व देठ सुकलेला."),
  postHarvest: b("Cut with stalk, handle gently and store on straw or racks in a dry, airy shed. It keeps for months.", "देठासह कापा, हळुवार हाताळा आणि कोरड्या, हवेशीर शेडमध्ये गवतावर किंवा मांडणीवर साठवा. महिनोन्महिने टिकतो."),
  marketTips: b("Sweet makers (petha) and religious uses create steady demand. Because it stores long, sell when rates are good. Ask nearby sweet makers about direct buying.", "पेठा बनवणारे व धार्मिक कार्यांमुळे स्थिर मागणी असते. जास्त दिवस टिकत असल्याने दर चांगला असताना विका. जवळच्या मिठाई उत्पादकांना थेट खरेदीबद्दल विचारा."),
  varieties: [], // TODO: varieties — confirm with MPKV Rahuri / Dr. BSKKV Dapoli
  source: "General practices from ICAR-IIVR and MPKV Rahuri cucurbit vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
