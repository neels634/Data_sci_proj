import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "bitter-gourd",
  emoji: "🥒",
  name: b("Bitter gourd", "कारले"),
  aliases: ["bitter gourd", "bitter melon", "karle", "karli", "karela", "kareli", "कारले", "कारली", "करेला", "karale"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["konkan", "western", "north", "marathwada", "vidarbha"],
  tier: 2,
  seasons: [
    { season: "kharif", sowingWindow: b("June–July", "जून–जुलै"), sowingMonths: [6, 7], durationDays: [110, 140] },
    { season: "summer", sowingWindow: b("January–February (with irrigation)", "जानेवारी–फेब्रुवारी (पाण्याची सोय असल्यास)"), sowingMonths: [1, 2], durationDays: [100, 125] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly in pits or on ridges", "बियाणे; खड्ड्यांत किंवा सरीवर थेट टोकणी"),
  soil: b(
    "Well-drained sandy loam to medium black soil with plenty of organic matter.",
    "भरपूर सेंद्रिय पदार्थ असलेली, पाण्याचा निचरा होणारी रेताड पोयट्याची ते मध्यम काळी जमीन.",
  ),
  climate: b(
    "Warm and moderately humid weather. Very heavy rain and cloudy days increase downy mildew and fruit fly.",
    "उबदार व मध्यम दमट हवामान. जास्त पाऊस व ढगाळ दिवसांत केवडा व फळमाशी वाढते.",
  ),
  seedRate: b("About 2–2.5 kg seed per acre; 2–3 seeds per pit.", "एकरी साधारण 2–2.5 किलो बियाणे; एका खड्ड्यात 2–3 बिया."),
  spacing: b(
    "On a trellis: 1.5–2 m between rows and 60–90 cm between pits. Bitter gourd gives much better fruit on a mandav than on the ground.",
    "मांडवावर: ओळींत 1.5–2 मीटर व खड्ड्यांत 60–90 सेंमी. कारल्याला जमिनीपेक्षा मांडवावर खूप चांगली फळे येतात.",
  ),
  irrigation: b(
    "Kharif crop needs water in dry spells only. Summer crop: every 4–5 days, ideally by drip. Even moisture at flowering and fruiting stops fruit drop.",
    "खरीप पिकाला फक्त पावसाच्या खंडात पाणी. उन्हाळी पिकाला दर 4–5 दिवसांनी, शक्यतो ठिबकने. फुलोरा व फळधारणेत सारखा ओलावा ठेवल्यास फळगळ थांबते.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure or compost in pits before sowing. Give fertiliser as per soil test, with nitrogen split into 2–3 parts during vine growth and flowering. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी खड्ड्यांत चांगले कुजलेले शेणखत किंवा कंपोस्ट मिसळा. माती परीक्षणानुसार खत द्या; नत्र वेल वाढताना व फुलोऱ्यात 2–3 हप्त्यांत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Sowing & germination", "टोकणी व उगवण"], 0, 15, ["Hard seeds take 7–10 days to sprout.", "कडक बियांना उगवायला 7–10 दिवस लागतात."], [
      t("bt-sow", 0, "sowing", ["Sow seeds in pits", "खड्ड्यांत बी टोका"], ["Soak seed in plain water for 12–24 hours for faster sprouting. Sow 2–3 seeds per pit in moist soil.", "लवकर उगवणीसाठी बी 12–24 तास साध्या पाण्यात भिजवा. ओलसर मातीत एका खड्ड्यात 2–3 बिया टोका."]),
      t("bt-irr0", 1, "irrigation", ["Light irrigation", "हलके पाणी द्या"], ["Keep pits moist until seeds come up.", "बी उगवेपर्यंत खड्डे ओलसर ठेवा."], 4),
      t("bt-thin", 12, "other", ["Fill gaps and thin", "खाडे भरा व विरळणी करा"], ["Resow empty pits. Keep 2 healthy plants per pit.", "रिकाम्या खड्ड्यांत पुन्हा बी टोका. एका खड्ड्यात 2 निरोगी रोपे ठेवा."]),
    ], [["Red pumpkin beetle on young leaves", "कोवळ्या पानांवर लाल भुंगेरे"]]),
    stage("vine-growth", ["Vine growth", "वेलांची वाढ"], 15, 40, ["Vines grow side shoots and climb the trellis.", "वेलांना फांद्या फुटतात व ते मांडवावर चढतात."], [
      t("bt-irr1", 15, "irrigation", ["Irrigate", "पाणी द्या"], ["Water at the base when the top soil dries.", "वरची माती कोरडी झाल्यावर मुळांजवळ पाणी द्या."], 5),
      t("bt-obs1", 18, "observation", ["Check leaves", "पाने तपासा"], ["Look for beetles, yellow patches on top of leaves and mottled leaves.", "भुंगेरे, पानांवर वरून पिवळे चट्टे व चट्टेदार पाने पाहा."], 7),
      t("bt-weed", 20, "weeding", ["Weeding and earthing up", "खुरपणी व भर देणे"], ["Remove weeds near the pits and add soil to the base.", "खड्ड्यांजवळचे तण काढा व बुंध्याला माती लावा."]),
      t("bt-trellis", 22, "other", ["Train vines on the trellis", "वेल मांडवावर चढवा"], ["Guide vines up with string to the mandav. Remove side shoots on the lower 1 m of the stem.", "दोरीने वेल मांडवावर चढवा. खोडाच्या खालच्या 1 मीटरवरील फांद्या काढा."]),
      t("bt-fert1", 28, "fertiliser", ["Top dressing", "वरखत द्या"], ["Give the next nitrogen part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार नत्राचा पुढचा हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Downy mildew in humid weather", "दमट हवामानात केवडा"]]),
    stage("flowering", ["Flowering & fruit set", "फुलोरा व फळधारणा"], 40, 55, ["Yellow flowers appear; bees pollinate the female flowers.", "पिवळी फुले येतात; मधमाश्या मादी फुलांचे परागीभवन करतात."], [
      t("bt-irr2", 40, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Avoid water stress now — flowers and small fruits drop.", "आता पाण्याचा ताण टाळा — फुले व लहान फळे गळतात."], 4),
      t("bt-trap", 41, "observation", ["Set fruit fly traps", "फळमाशीसाठी सापळे लावा"], ["Hang fruit fly traps before fruits form. Ask your KVK which trap to use.", "फळे लागण्यापूर्वी फळमाशीचे सापळे लावा. कोणता सापळा ते कृषी विज्ञान केंद्राला विचारा."]),
      t("bt-bees", 43, "observation", ["Protect bees", "मधमाश्यांचे संरक्षण करा"], ["Avoid spraying in the morning when flowers are open.", "सकाळी फुले उमललेली असताना फवारणी टाळा."]),
    ], [["Fruit fly on young fruit", "कोवळ्या फळांवर फळमाशी"]]),
    stage("harvest", ["Harvest (pickings)", "तोडणी"], 55, 125, ["Green, tender fruits are picked every 3–4 days.", "हिरवी कोवळी फळे दर 3–4 दिवसांनी तोडली जातात."], [
      t("bt-pick", 55, "harvest", ["Pick tender fruits", "कोवळी फळे तोडा"], ["Pick when fruits are full-sized, green and the bumps are well formed, before they turn yellow.", "फळे पूर्ण आकाराची, हिरवी व काटे (उंचवटे) भरलेले असताना, पिवळी होण्यापूर्वी तोडा."], 3),
      t("bt-irr3", 56, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep watering regularly between pickings.", "तोडण्यांच्या मध्ये नियमित पाणी देत राहा."], 5),
      t("bt-obs2", 58, "observation", ["Remove damaged fruits", "खराब फळे काढा"], ["Pick and bury fruits with fly stings or rot.", "फळमाशीचे डंख किंवा सड असलेली फळे तोडून पुरा."], 7),
      t("bt-fert2", 70, "fertiliser", ["Last top dressing", "शेवटचा वरखत हप्ता"], ["A small last nitrogen part keeps the vines bearing. Ask your agriculture officer for the amount.", "शेवटचा लहान नत्र हप्ता दिल्यास वेल फळे देत राहतात. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Check pre-harvest waiting days on any product label before picking", "तोडणीपूर्वी वापरलेल्या औषधाच्या लेबलवरील काढणीपूर्व कालावधी तपासा"], ["Powdery mildew", "भुरी"]]),
    stage("last-pickings", ["Last pickings & cleanup", "शेवटच्या तोडण्या व शेत स्वच्छता"], 125, 140, ["Fruits get smaller and the vines dry.", "फळे लहान होतात व वेल सुकू लागतात."], [
      t("bt-pick2", 125, "harvest", ["Last pickings", "शेवटच्या तोडण्या"], ["Pick the remaining good fruits.", "उरलेली चांगली फळे तोडा."], 4),
      t("bt-clean", 135, "other", ["Remove old vines", "जुने वेल काढा"], ["Pull out vines and destroy diseased ones. Keep the trellis for the next crop if it is sound.", "वेल उपटा व रोगट वेल नष्ट करा. मांडव मजबूत असल्यास पुढच्या पिकासाठी ठेवा."]),
    ], [["Pests carrying over to the next crop", "पुढच्या पिकात कीड जाणे"]]),
  ],
  flushes: { everyDays: 3, count: 18, note: b("Pick every 3–4 days; fruits left too long turn yellow and stop new fruiting.", "दर 3–4 दिवसांनी तोडा; जास्त दिवस ठेवलेली फळे पिवळी होतात आणि नवीन फळे कमी लागतात.") },
  commonProblems: [
    { name: b("Fruit fly", "फळमाशी"), signs: b("Stings on young fruit; fruit becomes twisted, rots and drops.", "कोवळ्या फळांवर डंख; फळ वाकडे होऊन सडते व गळते."), prevention: prevent("Use fruit fly traps, pick on time, and bury damaged fruits.", "फळमाशीचे सापळे लावा, वेळेवर तोडा आणि खराब फळे पुरा.") },
    { name: b("Downy mildew", "केवडा"), signs: b("Yellow angular patches on top of leaves with grey-purple growth below; leaves dry.", "पानांवर वरून पिवळे कोनाकृती चट्टे व खाली राखाडी-जांभळी बुरशी; पाने सुकतात."), prevention: prevent("Grow on a trellis, keep good spacing, avoid overhead watering and remove affected leaves.", "मांडवावर घ्या, योग्य अंतर ठेवा, वरून पाणी देणे टाळा व बाधित पाने काढा.") },
    { name: b("Red pumpkin beetle", "लाल भुंगेरे"), signs: b("Orange-red beetles eat holes in seedlings' leaves.", "नारिंगी-लाल भुंगेरे रोपांच्या पानांना छिद्रे पाडतात."), prevention: prevent("Check seedlings daily for the first 3 weeks and remove beetles by hand in the morning.", "पहिले 3 आठवडे रोज रोपे तपासा व सकाळी भुंगेरे हाताने वेचा.") },
    { name: b("Mosaic virus", "मोझॅक (विषाणू)"), signs: b("Leaves become mottled yellow-green and crinkled; plants stay small.", "पाने पिवळी-हिरवी चट्टेदार व सुरकुतलेली; वेल खुजे राहतात."), prevention: prevent("Remove infected plants early and keep weeds and sucking pests down.", "बाधित वेल लवकर काढा आणि तण व रसशोषक किडी कमी ठेवा.") },
  ],
  harvestSigns: b("Fruits are full-sized, green and glossy with well-formed bumps. Yellowing means it is too late.", "फळे पूर्ण आकाराची, हिरवी व चमकदार, उंचवटे भरलेले. पिवळे पडणे म्हणजे उशीर झाला."),
  postHarvest: b("Pick in cool hours, keep in shade, grade by size and colour, and pack in crates or ventilated bags. Bitter gourd ripens fast, so send it quickly.", "थंड वेळेत तोडा, सावलीत ठेवा, आकार व रंगानुसार प्रतवारी करा आणि क्रेट किंवा हवेशीर पिशव्यांत भरा. कारले लवकर पिकते, त्यामुळे लगेच पाठवा."),
  marketTips: b("Dark green, medium-long fruits get the best price in most markets. Prices are often better in the rainy season. Sell graded produce together through your Mandi Mitra.", "बहुतेक बाजारांत गडद हिरव्या, मध्यम लांब फळांना चांगला दर मिळतो. पावसाळ्यात दर बहुधा चांगले असतात. प्रतवारी केलेला माल मंडी मित्रामार्फत एकत्र विका."),
  varieties: [
    { name: "Phule Green Gold", note: b("Long, dark green fruits (MPKV Rahuri)", "लांब, गडद हिरवी फळे (मफुकृवि राहुरी)") },
    { name: "Hirkani", note: b("Released by MPKV Rahuri", "मफुकृवि राहुरीचा वाण") },
    { name: "Konkan Tara", note: b("Released by Dr. BSKKV Dapoli for Konkan", "कोकणासाठी डॉ. बासाकोकृवि दापोलीचा वाण") },
  ],
  source: "General practices from MPKV Rahuri, Dr. BSKKV Dapoli and ICAR-IIVR cucurbit vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
