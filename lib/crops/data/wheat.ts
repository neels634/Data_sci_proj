import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "wheat",
  emoji: "🌾",
  name: b("Wheat", "गहू"),
  aliases: ["wheat", "gahu", "gehu", "gehun", "गहू", "गेहूं"],
  category: "cereal",
  lifecycle: "seasonal",
  regions: ["north", "western", "marathwada", "vidarbha"],
  majorDistricts: b("Ahilyanagar, Nashik, Pune, Solapur, Jalgaon", "अहिल्यानगर, नाशिक, पुणे, सोलापूर, जळगाव"),
  tier: 1,
  seasons: [{ season: "rabi", sowingWindow: b("November (irrigated)", "नोव्हेंबर (बागायती)"), sowingMonths: [11], durationDays: [110, 125] }],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b("Medium to deep black or loamy soil with irrigation.", "पाण्याची सोय असलेली मध्यम ते भारी काळी किंवा पोयट्याची जमीन."),
  climate: b("Cool winter for growth; warm, dry days at maturity.", "वाढीसाठी थंड हिवाळा; पक्वतेला उबदार कोरडे दिवस."),
  seedRate: b("40–50 kg seed per acre.", "एकरी 40–50 किलो बियाणे."),
  spacing: b("Rows 22.5 cm apart, seed about 5 cm deep.", "ओळींत 22.5 सेंमी, साधारण 5 सेंमी खोल पेरणी."),
  irrigation: b("Most important at crown root stage (about 21 days), then at tillering, jointing, flowering, milk and dough stages.", "मुकुटमुळे अवस्था (सुमारे 21 दिवस) सर्वात महत्त्वाची, नंतर फुटवे, कांडी, फुलोरा, दुधाळ व चिकट दाणे अवस्थेत पाणी."),
  nutrientGuide: b("Use a soil test. Give some nitrogen at sowing and the rest with the first irrigation. Ask your agriculture officer for amounts.", "माती परीक्षण करा. काही नत्र पेरणीवेळी व उरलेले पहिल्या पाण्यासोबत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 20, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("wh-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow in rows 22.5 cm apart, about 5 cm deep, once cool weather starts.", "थंडी सुरू झाल्यावर 22.5 सेंमी ओळीत, साधारण 5 सेंमी खोल पेरा."]),
      t("wh-irr0", 1, "irrigation", ["Light irrigation after sowing", "पेरणीनंतर हलके पाणी"], ["Only if the soil is dry.", "जमीन कोरडी असेल तरच."]),
    ], [["Termites in dry soil", "कोरड्या जमिनीत वाळवी"]]),
    stage("tillering", ["Crown roots & tillering", "मुकुटमुळे व फुटवे"], 20, 45, ["Crown roots form and the plant makes side shoots.", "मुकुटमुळे तयार होतात व फुटवे येतात."], [
      t("wh-irr1", 21, "irrigation", ["Crown root irrigation", "मुकुटमुळे अवस्थेचे पाणी"], ["The most important irrigation of the season. Don't miss it.", "हंगामातील सर्वात महत्त्वाचे पाणी. चुकवू नका."]),
      t("wh-fert", 22, "fertiliser", ["Top dressing with irrigation", "पाण्यासोबत वरखत"], ["Give the rest of the nitrogen as per your soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार उरलेले नत्र द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
      t("wh-weed", 30, "weeding", ["Weeding", "खुरपणी"], ["Remove weeds while the crop is young.", "पीक लहान असताना तण काढा."]),
      t("wh-irr2", 42, "irrigation", ["Irrigation at late tillering", "फुटव्यांच्या शेवटी पाणी"], ["Water if the soil is drying.", "जमीन सुकत असल्यास पाणी द्या."]),
    ], [["Weeds competing with the young crop", "कोवळ्या पिकाशी स्पर्धा करणारे तण"]]),
    stage("jointing", ["Jointing & booting", "कांडी व पोटरी"], 45, 70, ["Stems grow taller and the ear forms inside.", "खोड उंच वाढते व आत ओंबी तयार होते."], [
      t("wh-obs1", 50, "observation", ["Check leaves", "पाने तपासा"], ["Look for aphids and rust (orange powder on leaves).", "मावा व तांबेरा (पानांवर नारिंगी भुकटी) पाहा."], 7),
      t("wh-irr3", 62, "irrigation", ["Irrigation at jointing", "कांडी अवस्थेत पाणी"], ["Keep moisture as the stem grows.", "खोड वाढताना ओलावा ठेवा."]),
    ], [["Rust", "तांबेरा"], ["Aphids", "मावा"]]),
    stage("heading", ["Heading & flowering", "ओंबी व फुलोरा"], 70, 90, ["Ears come out and flower.", "ओंब्या बाहेर येतात व फुलतात."], [
      t("wh-obs2", 72, "observation", ["Check ears and leaves", "ओंब्या व पाने तपासा"], ["Look for rust and aphids.", "तांबेरा व मावा पाहा."], 7),
      t("wh-irr4", 80, "irrigation", ["Irrigation at flowering", "फुलोऱ्यात पाणी"], ["Avoid watering on windy days — plants can fall.", "जोराच्या वाऱ्यात पाणी देऊ नका — पीक लोळते."]),
    ], [["Lodging (plants falling)", "पीक लोळणे"]]),
    stage("grain", ["Grain filling", "दाणे भरणे"], 90, 110, ["Grains fill: milky, then doughy, then hard.", "दाणे भरतात: दुधाळ, मग चिकट, मग टणक."], [
      t("wh-obs3", 92, "observation", ["Check grain filling", "दाणे भरणे तपासा"], ["Press a grain with your nail to see its stage.", "दाणा नखाने दाबून अवस्था पाहा."], 7),
      t("wh-irr5", 95, "irrigation", ["Milk stage irrigation", "दुधाळ अवस्थेत पाणी"], ["Helps grains fill well.", "दाणे चांगले भरायला मदत."]),
      t("wh-irr6", 105, "irrigation", ["Dough stage irrigation (light)", "चिकट दाणे अवस्थेत हलके पाणी"], ["A light last irrigation.", "शेवटचे हलके पाणी."]),
    ], [["Hot days shrivel grains", "उष्ण दिवसांत दाणे सुरकुततात"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 110, 125, ["Grains are hard and straw turns golden.", "दाणे टणक होतात व काड सोनेरी होते."], [
      t("wh-mat", 110, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Grains hard, straw golden → plan the harvest.", "दाणे टणक, काड सोनेरी → काढणीचे नियोजन करा."]),
      t("wh-harv", 115, "harvest", ["Harvest", "काढणी करा"], ["Harvest and dry the grain well before storing.", "काढणी करून साठवण्यापूर्वी धान्य चांगले वाळवा."]),
    ], [["Rain at harvest", "काढणीच्या वेळी पाऊस"]]),
  ],
  commonProblems: [
    { name: b("Rust", "तांबेरा"), signs: b("Orange or brown powder on leaves that rubs off on your finger.", "पानांवर नारिंगी किंवा तपकिरी भुकटी जी बोटाला लागते."), prevention: prevent("Grow resistant varieties and sow on time.", "प्रतिकारक वाण घ्या व वेळेवर पेरणी करा.") },
    { name: b("Aphids", "मावा"), signs: b("Small green insects on leaves and ears; sticky leaves.", "पानांवर व ओंब्यांवर लहान हिरवे किडे; चिकट पाने."), prevention: prevent("Check weekly; ladybird beetles eat aphids.", "दर आठवड्याला तपासा; ढालकिडे मावा खातात.") },
    { name: b("Termites", "वाळवी"), signs: b("Young plants wilt and dry in patches; roots and stem base are eaten, mostly in dry soil.", "कोवळी रोपे पट्ट्यांत कोमेजून वाळतात; मुळे व खोडाचा बुडखा खाल्लेला दिसतो, मुख्यतः कोरड्या जमिनीत."), prevention: prevent("Use only well-rotted manure, remove old stubble, destroy termite mounds near the field and irrigate on time.", "फक्त चांगले कुजलेले शेणखत वापरा, जुनी धसकटे काढा, शेताजवळची वारुळे नष्ट करा व वेळेवर पाणी द्या.") },
    { name: b("Loose smut", "काणी"), signs: b("At heading, ears come out full of black powder instead of grains; the powder blows away and leaves a bare stalk.", "ओंबी येताना दाण्यांऐवजी काळी भुकटी भरलेली ओंबी निघते; भुकटी उडून जाऊन फक्त दांडा राहतो."), prevention: prevent("Sow certified, treated seed. Pull out smutted plants into a bag before the powder spreads and destroy them.", "प्रमाणित, प्रक्रिया केलेले बियाणे पेरा. भुकटी पसरण्याआधी काणी झालेली झाडे पिशवीत उपटून नष्ट करा.") },
  ],
  harvestSigns: b("Grains are hard and the straw is golden and dry.", "दाणे टणक आहेत आणि काड सोनेरी व कोरडे आहे."),
  postHarvest: b("Dry grain well in the sun and store in clean, dry bags or bins.", "धान्य उन्हात चांगले वाळवा आणि स्वच्छ, कोरड्या पोत्यांत किंवा कोठीत साठवा."),
  marketTips: b("Clean, dry grain without stones gets a better rate. Check the support price.", "खडे नसलेल्या स्वच्छ, कोरड्या धान्याला चांगला दर मिळतो. हमीभाव तपासा."),
  varieties: [
    { name: "NIAW-301 (Trimbak)", note: b("Released by MPKV wheat research station, Niphad", "मफुकृवि गहू संशोधन केंद्र, निफाड यांचा वाण") },
    { name: "NIAW-917 (Tapovan)", note: b("Released by MPKV wheat research station, Niphad", "मफुकृवि गहू संशोधन केंद्र, निफाड यांचा वाण") },
    { name: "NIAW-1994 (Phule Samadhan)", note: b("For timely and late sowing (MPKV)", "वेळेवर व उशिरा पेरणीसाठी (मफुकृवि)") },
  ],
  source: "General practices from ICAR-IIWBR and MPKV Rahuri wheat guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
