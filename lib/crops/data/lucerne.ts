import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

/** Lucerne lives 3–4 years; this plan covers the first year of cuttings (repeat cutting tasks via `flushes`). */
const crop: SeasonalCrop = {
  id: "lucerne",
  emoji: "🌱",
  name: b("Lucerne (alfalfa)", "लसूण घास"),
  aliases: ["lucerne", "lucern", "alfalfa", "lasun ghas", "lasunghas", "lasun gavat", "rijka", "लसूण घास", "लसूणघास", "लसुण घास", "रिजका"],
  category: "fodder",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada"],
  majorDistricts: b("Pune, Ahilyanagar, Satara, Kolhapur, Nashik", "पुणे, अहिल्यानगर, सातारा, कोल्हापूर, नाशिक"),
  tier: 2,
  seasons: [
    { season: "rabi", sowingWindow: b("October–November is best; needs assured irrigation all year", "ऑक्टोबर–नोव्हेंबर सर्वोत्तम; वर्षभर खात्रीचे पाणी लागते"), sowingMonths: [10, 11], durationDays: [300, 365] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b(
    "Deep, well-drained medium black or loamy soil. Does not like acidic soil or standing water — roots rot.",
    "खोल, पाण्याचा निचरा होणारी मध्यम काळी किंवा पोयट्याची जमीन. आम्लयुक्त जमीन व साचलेले पाणी चालत नाही — मुळे कुजतात.",
  ),
  climate: b(
    "Grows best in the cool, dry season; growth slows in heavy monsoon. Gives green fodder for 3–4 years with care.",
    "थंड, कोरड्या हंगामात उत्तम वाढ; जोरदार पावसाळ्यात वाढ मंदावते. निगा राखल्यास 3–4 वर्षे हिरवा चारा देते.",
  ),
  seedRate: b("8–10 kg seed per acre, sown in lines.", "एकरी 8–10 किलो बियाणे, ओळीत पेरणी."),
  spacing: b("25–30 cm between rows, seed sown thinly in a continuous line.", "दोन ओळींत 25–30 सेंमी, ओळीत बी सलग व विरळ पेरा."),
  irrigation: b(
    "Light, regular water: every 8–10 days in winter, every 5–7 days in summer. Give water soon after each cutting. Drain rain water quickly.",
    "हलके व नियमित पाणी: हिवाळ्यात दर 8–10 दिवसांनी, उन्हाळ्यात दर 5–7 दिवसांनी. प्रत्येक कापणीनंतर लगेच पाणी द्या. पावसाचे पाणी लगेच बाहेर काढा.",
  ),
  nutrientGuide: b(
    "Use a soil test. Mix plenty of well-rotted farmyard manure before sowing. Being a legume it needs little nitrogen, but phosphorus at sowing and a yearly top-up keeps it productive. Bio-fertiliser seed treatment helps. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. पेरणीपूर्वी भरपूर कुजलेले शेणखत मिसळा. शेंगवर्गीय असल्याने नत्र कमी लागते, पण पेरणीवेळी स्फुरद व दरवर्षी थोडे वरखत दिल्यास उत्पादन टिकते. जैविक खताची बीजप्रक्रिया उपयोगी. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 15, ["Tiny seeds sprout; seedlings are weak at first.", "बारीक बी रुजते; सुरुवातीला रोपे नाजूक असतात."], [
      t("lc-sow", 0, "sowing", ["Sow in lines", "ओळीत पेरणी करा"], ["Make fine, level beds. Sow seed shallow (1–2 cm) in lines; mixing seed with fine sand helps spread it evenly.", "बारीक, सपाट वाफे करा. बी उथळ (1–2 सेंमी) ओळीत पेरा; बी बारीक वाळूत मिसळल्यास सारखे पडते."]),
      t("lc-irr0", 1, "irrigation", ["Light watering", "हलके पाणी"], ["Keep the top soil moist with light water until seedlings are up; heavy water washes seed away.", "रोपे येईपर्यंत हलके पाणी देऊन वरची माती ओलसर ठेवा; जास्त पाण्याने बी वाहून जाते."], 4),
    ], [["Seed washed away by heavy irrigation", "जास्त पाण्याने बी वाहून जाणे"]]),
    stage("establishment", ["Early growth", "सुरुवातीची वाढ"], 15, 55, ["Plants grow roots and stems. Weeds can choke the young crop.", "रोपांची मुळे व खोड वाढतात. तण कोवळ्या पिकाला दाबू शकते."], [
      t("lc-weed", 20, "weeding", ["Hand weeding", "हाताने खुरपणी"], ["Weed carefully once or twice; remove any yellow thread-like dodder vines with the plants they wrap.", "एक-दोन वेळा काळजीपूर्वक खुरपणी करा; पिवळ्या दोऱ्यासारखी अमरवेल दिसल्यास ती गुंडाळलेल्या झाडांसह काढा."], 15),
      t("lc-irr1", 16, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 8–10 days in winter.", "हिवाळ्यात दर 8–10 दिवसांनी पाणी द्या."], 9),
      t("lc-obs1", 25, "observation", ["Check plants", "रोपे तपासा"], ["Look for aphids on tips and caterpillars eating leaves.", "शेंड्यांवर मावा व पाने खाणाऱ्या अळ्या पाहा."], 10),
    ], [["Dodder (amarvel)", "अमरवेल"], ["Weeds choking young crop", "तणांमुळे कोवळे पीक दबणे"]]),
    stage("first-cut", ["First cutting", "पहिली कापणी"], 55, 70, ["The crop is ready for the first cut at about 55–65 days.", "साधारण 55–65 दिवसांत पहिल्या कापणीस पीक तयार होते."], [
      t("lc-cut1", 55, "harvest", ["Take the first cut", "पहिली कापणी करा"], ["Cut 5–8 cm above the ground with a sharp sickle when the first flowers appear.", "पहिली फुले दिसू लागल्यावर धारदार विळ्याने जमिनीपासून 5–8 सेंमी वर कापा."]),
      t("lc-irr2", 57, "irrigation", ["Water after cutting", "कापणीनंतर पाणी द्या"], ["Irrigate within 2–3 days of cutting so new shoots come quickly.", "कापणीनंतर 2–3 दिवसांत पाणी द्या, म्हणजे नवे फुटवे लवकर येतात."]),
    ], [["Cutting too low damages the crown", "खूप खाली कापल्यास बुंध्याला इजा"]]),
    stage("winter-cuts", ["Winter cuttings", "हिवाळी कापण्या"], 70, 150, ["Fast regrowth in cool weather; a cut every 25–30 days.", "थंड हवेत जोमाने पुनर्वाढ; दर 25–30 दिवसांनी कापणी."], [
      t("lc-cutw", 82, "harvest", ["Cut fodder", "चारा कापा"], ["Cut every 25–30 days at the start of flowering.", "फुलोरा सुरू होताच दर 25–30 दिवसांनी कापा."], 27),
      t("lc-irrw", 70, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 8–10 days and after each cut.", "दर 8–10 दिवसांनी व प्रत्येक कापणीनंतर पाणी द्या."], 9),
      t("lc-obsw", 75, "observation", ["Check for aphids and dodder", "मावा व अमरवेल तपासा"], ["Aphids and dodder spread fast; act early.", "मावा व अमरवेल झपाट्याने पसरतात; लवकर उपाय करा."], 14),
    ], [["Aphids", "मावा"], ["Dodder", "अमरवेल"]]),
    stage("summer-cuts", ["Summer cuttings", "उन्हाळी कापण्या"], 150, 270, ["Growth continues if water is enough; heat raises water need.", "पुरेसे पाणी असल्यास वाढ सुरू राहते; उष्णतेत पाण्याची गरज वाढते."], [
      t("lc-cuts", 155, "harvest", ["Cut fodder", "चारा कापा"], ["Cut every 25–30 days.", "दर 25–30 दिवसांनी कापा."], 27),
      t("lc-irrs", 150, "irrigation", ["Irrigate more often", "जास्त वेळा पाणी द्या"], ["Water every 5–7 days in summer.", "उन्हाळ्यात दर 5–7 दिवसांनी पाणी द्या."], 6),
      t("lc-fert", 160, "fertiliser", ["Yearly top-up", "वार्षिक वरखत"], ["Give manure or a phosphorus top-up as per soil test after a cut. Ask your agriculture officer for the amount.", "कापणीनंतर माती परीक्षणानुसार शेणखत किंवा स्फुरदाचा वरखत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Caterpillars eating leaves", "पाने खाणाऱ्या अळ्या"]]),
    stage("monsoon-cuts", ["Monsoon cuttings & care", "पावसाळी कापण्या व निगा"], 270, 365, ["Growth slows in heavy rain; keep the field drained to save the stand for next year.", "जोरदार पावसात वाढ मंदावते; पुढच्या वर्षासाठी पीक टिकवण्यासाठी पाण्याचा निचरा ठेवा."], [
      t("lc-cutm", 275, "harvest", ["Cut fodder", "चारा कापा"], ["Cut every 30–35 days in the monsoon.", "पावसाळ्यात दर 30–35 दिवसांनी कापा."], 32),
      t("lc-drain", 270, "other", ["Keep drainage open", "पाण्याचा निचरा ठेवा"], ["Open the furrows after rain; standing water rots the crowns.", "पावसानंतर चर मोकळे करा; साचलेल्या पाण्याने बुंधे कुजतात."], 15),
      t("lc-gap", 330, "other", ["Check the stand", "पिकाची दाटी तपासा"], ["If many plants have died, plan to resow gaps or a new field in October.", "बरीच झाडे मेली असल्यास ऑक्टोबरमध्ये खाडे भरण्याचे किंवा नवीन पेरणीचे नियोजन करा."]),
    ], [["Root rot in water-logged patches", "पाणी साचलेल्या भागात मूळकूज"]]),
  ],
  flushes: {
    everyDays: 27,
    count: 11,
    note: b(
      "After the first cut at 55–65 days, cut every 25–30 days (30–35 days in monsoon). About 10–12 cuts a year; the crop lasts 3–4 years.",
      "55–65 दिवसांच्या पहिल्या कापणीनंतर दर 25–30 दिवसांनी (पावसाळ्यात 30–35 दिवसांनी) कापा. वर्षाला साधारण 10–12 कापण्या; पीक 3–4 वर्षे टिकते.",
    ),
  },
  commonProblems: [
    {
      name: b("Dodder (amarvel)", "अमरवेल"),
      signs: b("Yellow-orange thread-like vines wrap around plants and suck them; patches turn weak and yellow.", "पिवळसर नारिंगी दोऱ्यासारखी वेल झाडांभोवती गुंडाळून रस शोषते; पट्टे कमजोर व पिवळे पडतात."),
      prevention: prevent("Use clean seed free of dodder seed. Cut and burn infested patches before the dodder flowers.", "अमरवेलीचे बी नसलेले स्वच्छ बियाणे वापरा. अमरवेल फुलण्यापूर्वी बाधित पट्टे कापून जाळा."),
    },
    {
      name: b("Aphids", "मावा"),
      signs: b("Small insects on shoot tips; leaves sticky and plants stunted.", "शेंड्यांवर लहान किडी; पाने चिकट व झाडे खुरटी."),
      prevention: prevent("Take an early cut when aphids build up — this removes most of them. Feed fodder only after any spray's waiting period on the label.", "मावा वाढल्यास लवकर कापणी करा — त्याने बहुतेक मावा निघून जातो. फवारणी केल्यास लेबलवरील प्रतीक्षा कालावधीनंतरच चारा जनावरांना द्या."),
    },
    {
      name: b("Root and crown rot", "मूळ व बुंधा कूज"),
      signs: b("Plants wilt and die in patches after water stands; crowns turn dark and soft.", "पाणी साचल्यानंतर झाडे गटागटाने मलूल होऊन मरतात; बुंधे काळे व मऊ पडतात."),
      prevention: prevent("Choose well-drained land, never let water stand and avoid cutting too low.", "निचरा होणारी जमीन निवडा, पाणी कधीही साचू देऊ नका आणि खूप खाली कापू नका."),
    },
    {
      name: b("Bloat in cattle", "जनावरांची पोटफुगी"),
      signs: b("Animals' left belly swells after eating a lot of fresh, wet lucerne.", "भरपूर ताजा, ओला लसूण घास खाल्ल्यानंतर जनावराची डावी कूस फुगते."),
      prevention: b("Never feed only lucerne. Wilt it for a few hours and mix with dry fodder or grass fodder. Call a veterinarian if an animal bloats.", "फक्त लसूण घास कधीही देऊ नका. काही तास सुकवून सुक्या चाऱ्यात किंवा गवती चाऱ्यात मिसळून द्या. पोटफुगी झाल्यास पशुवैद्यकाला बोलवा."),
    },
  ],
  harvestSigns: b("First flowers (about one in ten stems) have appeared and new shoots are coming from the base.", "पहिली फुले (साधारण दहापैकी एका फांदीला) दिसू लागली आहेत आणि बुंध्यातून नवे फुटवे येत आहेत."),
  postHarvest: b(
    "Feed fresh after wilting a little, mixed with dry fodder. Extra fodder can be sun-dried in thin layers into hay and stored in a dry shed.",
    "थोडा सुकवून सुक्या चाऱ्यात मिसळून ताजा द्या. जास्तीचा चारा पातळ थरात उन्हात वाळवून सुका घास करा व कोरड्या शेडमध्ये साठवा.",
  ),
  marketTips: b(
    "Lucerne is protein-rich fodder that can cut the cattle-feed bill for milk animals. Extra green fodder sells locally in bundles to dairy farmers.",
    "लसूण घास हा प्रथिनयुक्त चारा आहे; दुभत्या जनावरांच्या पशुखाद्याचा खर्च कमी होतो. जास्तीचा हिरवा चारा पेंढ्या बांधून स्थानिक दूध उत्पादकांना विकता येतो.",
  ),
  varieties: [
    { name: "RL-88", note: b("Lucerne variety from MPKV Rahuri", "मफुकृवि राहुरीचा लसूण घास वाण") },
  ],
  source: "General practices from MPKV Rahuri forage guidance and ICAR-IGFRI (Jhansi)",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
