import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "pumpkin",
  emoji: "🎃",
  name: b("Pumpkin (red pumpkin)", "लाल भोपळा"),
  aliases: ["pumpkin", "red pumpkin", "bhopla", "bhopala", "भोपळा", "lal bhopla", "लाल भोपळा", "kaddu", "कद्दू", "kashiphal", "काशीफळ", "dangar", "डांगर"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["konkan", "western", "north", "marathwada", "vidarbha"],
  tier: 2,
  seasons: [
    { season: "kharif", sowingWindow: b("June–July", "जून–जुलै"), sowingMonths: [6, 7], durationDays: [120, 150] },
    { season: "summer", sowingWindow: b("January–February (with irrigation)", "जानेवारी–फेब्रुवारी (पाण्याची सोय असल्यास)"), sowingMonths: [1, 2], durationDays: [110, 140] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly in pits or on ridges", "बियाणे; खड्ड्यांत किंवा सरीवर थेट टोकणी"),
  soil: b("Well-drained loamy or medium black soil rich in organic matter.", "सेंद्रिय पदार्थ भरपूर असलेली, पाण्याचा निचरा होणारी पोयट्याची किंवा मध्यम काळी जमीन."),
  climate: b("Warm weather; grows well in kharif and summer. Hardy crop, but waterlogging rots vines and fruit.", "उबदार हवामान; खरीप व उन्हाळ्यात चांगले येते. काटक पीक, पण पाणी साचल्यास वेल व फळे सडतात."),
  seedRate: b("About 1–1.5 kg seed per acre; 2–3 seeds per pit.", "एकरी साधारण 1–1.5 किलो बियाणे; एका खड्ड्यात 2–3 बिया."),
  spacing: b("Grown on the ground: 2.5–3 m between rows and 60–90 cm between pits.", "जमिनीवर पसरवून: ओळींत 2.5–3 मीटर व खड्ड्यांत 60–90 सेंमी."),
  irrigation: b(
    "Kharif crop needs water only in dry spells. Summer crop: every 6–8 days. Water in furrows; keep fruits off wet soil. Reduce water as fruits mature.",
    "खरीप पिकाला फक्त पावसाच्या खंडात पाणी. उन्हाळी पिकाला दर 6–8 दिवसांनी. सरीतून पाणी द्या; फळे ओल्या मातीवर राहू देऊ नका. फळे पक्व होताना पाणी कमी करा.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure in pits before sowing. Give fertiliser as per soil test, with nitrogen split into 2 parts — at sowing and at vine growth. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी खड्ड्यांत चांगले कुजलेले शेणखत मिसळा. माती परीक्षणानुसार खत द्या; नत्र 2 हप्त्यांत — पेरणीवेळी व वेल वाढताना. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Sowing & germination", "टोकणी व उगवण"], 0, 15, ["Seeds sprout in about a week.", "साधारण आठवड्यात बी उगवते."], [
      t("pk-sow", 0, "sowing", ["Sow seeds in pits", "खड्ड्यांत बी टोका"], ["Sow 2–3 seeds per pit in moist soil, 2–3 cm deep.", "ओलसर मातीत एका खड्ड्यात 2–3 बिया, 2–3 सेंमी खोल टोका."]),
      t("pk-irr0", 1, "irrigation", ["Light irrigation", "हलके पाणी द्या"], ["Keep pits moist until seeds come up.", "बी उगवेपर्यंत खड्डे ओलसर ठेवा."], 4),
      t("pk-thin", 12, "other", ["Fill gaps and thin", "खाडे भरा व विरळणी करा"], ["Resow empty pits and keep 2 plants per pit.", "रिकामे खड्डे भरा व एका खड्ड्यात 2 रोपे ठेवा."]),
    ], [["Red pumpkin beetle on seedlings", "रोपांवर लाल भुंगेरे"]]),
    stage("vine-growth", ["Vine growth", "वेलांची वाढ"], 15, 45, ["Vines spread over the ground and cover it.", "वेल जमिनीवर पसरून ती झाकतात."], [
      t("pk-irr1", 15, "irrigation", ["Irrigate", "पाणी द्या"], ["Water in furrows when the top soil dries.", "वरची माती कोरडी झाल्यावर सरीतून पाणी द्या."], 7),
      t("pk-obs1", 18, "observation", ["Check leaves", "पाने तपासा"], ["Look for beetles, white powder and yellow patches on leaves.", "भुंगेरे, पानांवर पांढरी भुकटी व पिवळे चट्टे पाहा."], 7),
      t("pk-weed", 20, "weeding", ["Weeding", "खुरपणी"], ["Weed before vines cover the ground; after that weeds are few.", "वेल जमीन झाकण्यापूर्वी खुरपणी करा; नंतर तण कमी येते."]),
      t("pk-fert1", 30, "fertiliser", ["Top dressing", "वरखत द्या"], ["Give the second nitrogen part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार नत्राचा दुसरा हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Powdery mildew", "भुरी"]]),
    stage("flowering", ["Flowering & fruit set", "फुलोरा व फळधारणा"], 45, 65, ["Big yellow flowers open in the morning; bees set the fruit.", "सकाळी मोठी पिवळी फुले उमलतात; मधमाश्यांमुळे फळधारणा होते."], [
      t("pk-irr2", 45, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Avoid water stress now so fruits set well.", "फळधारणा चांगली व्हावी म्हणून आता पाण्याचा ताण टाळा."], 6),
      t("pk-bees", 47, "observation", ["Protect bees", "मधमाश्यांचे संरक्षण करा"], ["Pumpkin flowers close by noon. Do not spray in the morning when bees are working.", "भोपळ्याची फुले दुपारपर्यंत मिटतात. सकाळी मधमाश्या काम करत असताना फवारणी करू नका."]),
      t("pk-trap", 50, "observation", ["Set fruit fly traps", "फळमाशीसाठी सापळे लावा"], ["Hang traps when small fruits appear. Ask your KVK which trap to use.", "लहान फळे दिसू लागली की सापळे लावा. कोणता सापळा ते कृषी विज्ञान केंद्राला विचारा."]),
    ], [["Fruit fly on young fruit", "कोवळ्या फळांवर फळमाशी"]]),
    stage("fruit-development", ["Fruit development", "फळांची वाढ"], 65, 110, ["Fruits grow big and the skin slowly hardens.", "फळे मोठी होतात व साल हळूहळू कडक होते."], [
      t("pk-irr3", 65, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water helps fruits fill.", "नियमित पाण्याने फळे भरतात."], 7),
      t("pk-straw", 70, "other", ["Put dry straw under fruits", "फळांखाली वाळलेले गवत ठेवा"], ["A layer of straw or dry leaves under fruits stops rot from wet soil.", "फळांखाली गवत किंवा वाळलेल्या पानांचा थर ठेवल्यास ओल्या मातीमुळे होणारी सड थांबते."]),
      t("pk-obs2", 72, "observation", ["Check fruits", "फळे तपासा"], ["Remove and bury fly-stung or rotting fruits.", "फळमाशीचे डंख किंवा सड असलेली फळे काढून पुरा."], 10),
    ], [["Fruit rot on wet soil", "ओल्या मातीवर फळकूज"]]),
    stage("maturity", ["Maturity & harvest", "पक्वता व काढणी"], 110, 150, ["Fruits turn their full colour, skin hardens and stalks dry. Harvest in 2–3 rounds.", "फळे पूर्ण रंग धरतात, साल कडक होते व देठ सुकतात. 2–3 फेऱ्यांत काढणी."], [
      t("pk-less", 110, "irrigation", ["Reduce irrigation", "पाणी कमी करा"], ["Give less water so fruits ripen and store well.", "फळे पक्व होऊन चांगली टिकावीत म्हणून पाणी कमी करा."]),
      t("pk-harv", 115, "harvest", ["Harvest mature fruits", "पक्व फळे काढा"], ["Cut mature fruits with 5–8 cm of stalk. Tender fruits can also be picked earlier for local sale.", "पक्व फळे 5–8 सेंमी देठ ठेवून कापा. स्थानिक विक्रीसाठी कोवळी फळेही आधी तोडता येतात."], 10),
      t("pk-cure", 118, "other", ["Cure fruits in shade", "फळे सावलीत सुकवा"], ["Keep harvested fruits in a dry, airy shade for about 10 days so the skin hardens.", "काढलेली फळे साधारण 10 दिवस कोरड्या, हवेशीर सावलीत ठेवा, म्हणजे साल कडक होते."]),
    ], [["Fruits rotting in storage when cut without stalk", "देठाशिवाय कापलेली फळे साठवणीत सडणे"]]),
  ],
  commonProblems: [
    { name: b("Red pumpkin beetle", "लाल भुंगेरे"), signs: b("Orange-red beetles eat holes in leaves; seedlings can die.", "नारिंगी-लाल भुंगेरे पानांना छिद्रे पाडतात; रोपे मरू शकतात."), prevention: prevent("Check seedlings daily for the first 3 weeks and remove beetles by hand in the morning.", "पहिले 3 आठवडे रोज रोपे तपासा व सकाळी भुंगेरे हाताने वेचा.") },
    { name: b("Fruit fly", "फळमाशी"), signs: b("Stings on young fruit; fruit rots from inside.", "कोवळ्या फळांवर डंख; फळ आतून सडते."), prevention: prevent("Use fruit fly traps and bury damaged fruits.", "फळमाशीचे सापळे लावा व खराब फळे पुरा.") },
    { name: b("Powdery mildew", "भुरी"), signs: b("White powder on leaves; leaves yellow and dry.", "पानांवर पांढरी भुकटी; पाने पिवळी पडून सुकतात."), prevention: prevent("Keep good spacing and remove badly affected leaves.", "योग्य अंतर ठेवा व जास्त बाधित पाने काढा.") },
  ],
  harvestSigns: b("Skin turns its full colour and hard enough that a nail does not go in; the stalk near the fruit dries.", "साल पूर्ण रंगाची व नख न रुतेल एवढी कडक होते; फळाजवळचा देठ सुकतो."),
  postHarvest: b("Cut with a stalk, cure in shade, and store in a dry, airy place on a dry floor or racks. Well-cured pumpkins keep for 2–3 months.", "देठासह कापा, सावलीत सुकवा आणि कोरड्या, हवेशीर जागी कोरड्या जमिनीवर किंवा मांडणीवर साठवा. चांगले सुकवलेले भोपळे 2–3 महिने टिकतात."),
  marketTips: b("Pumpkin stores well, so you can wait for a better rate. Demand rises during festivals and fasts. Medium-sized fruits are easier to sell in retail.", "भोपळा चांगला टिकतो, त्यामुळे चांगल्या दरासाठी थांबता येते. सण व उपवासाच्या काळात मागणी वाढते. किरकोळ विक्रीसाठी मध्यम आकाराची फळे सोपी."),
  varieties: [
    { name: "Arka Chandan", note: b("Medium-sized fruits with orange flesh (ICAR-IIHR)", "मध्यम आकाराची, नारिंगी गराची फळे (ICAR-IIHR)") },
    { name: "Arka Suryamukhi", note: b("Small round fruits (ICAR-IIHR)", "लहान गोल फळे (ICAR-IIHR)") },
  ],
  source: "General practices from ICAR-IIHR, ICAR-IIVR and MPKV Rahuri cucurbit vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
