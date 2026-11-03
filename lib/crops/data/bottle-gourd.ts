import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "bottle-gourd",
  emoji: "🥒",
  name: b("Bottle gourd", "दुधी भोपळा"),
  aliases: ["bottle gourd", "dudhi", "दुधी", "दुधी भोपळा", "dudhi bhopla", "lauki", "लौकी", "ghiya", "घीया", "doodhi"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["konkan", "western", "north", "marathwada", "vidarbha"],
  tier: 2,
  seasons: [
    { season: "kharif", sowingWindow: b("June–July", "जून–जुलै"), sowingMonths: [6, 7], durationDays: [120, 150] },
    { season: "summer", sowingWindow: b("January–February (with irrigation)", "जानेवारी–फेब्रुवारी (पाण्याची सोय असल्यास)"), sowingMonths: [1, 2], durationDays: [110, 130] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly in pits or on ridges", "बियाणे; खड्ड्यांत किंवा सरीवर थेट टोकणी"),
  soil: b(
    "Well-drained loamy or medium black soil rich in organic matter. Avoid fields where water stands.",
    "सेंद्रिय पदार्थ भरपूर असलेली, पाण्याचा निचरा होणारी पोयट्याची किंवा मध्यम काळी जमीन. पाणी साचणारे शेत टाळा.",
  ),
  climate: b(
    "Warm weather. Grows well in kharif and summer. Cold nights slow growth; heavy continuous rain spreads leaf diseases.",
    "उबदार हवामान. खरीप व उन्हाळ्यात चांगले येते. थंड रात्री वाढ मंदावते; सतत जोरदार पावसात पानांचे रोग वाढतात.",
  ),
  seedRate: b("About 1.5–2 kg seed per acre; 2–3 seeds per pit.", "एकरी साधारण 1.5–2 किलो बियाणे; एका खड्ड्यात 2–3 बिया."),
  spacing: b(
    "On a trellis (mandav): 2–2.5 m between rows and about 1 m between pits. On the ground: 2.5–3 m between rows and 60–90 cm between pits.",
    "मांडवावर: ओळींत 2–2.5 मीटर व खड्ड्यांत साधारण 1 मीटर. जमिनीवर: ओळींत 2.5–3 मीटर व खड्ड्यांत 60–90 सेंमी.",
  ),
  irrigation: b(
    "Kharif crop needs water only in dry spells. Summer crop: every 4–6 days; drip works very well. Keep moisture even at flowering and fruiting. Do not let water touch the vines and fruit.",
    "खरीप पिकाला फक्त पावसाच्या खंडात पाणी लागते. उन्हाळी पिकाला दर 4–6 दिवसांनी; ठिबक खूप चांगले. फुलोरा व फळधारणेत ओलावा सारखा ठेवा. वेल व फळांना पाणी लागू देऊ नका.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure or compost in each pit before sowing. Give fertiliser as per soil test, with nitrogen split into 2–3 parts — at sowing, at vine growth and at flowering. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी प्रत्येक खड्ड्यात चांगले कुजलेले शेणखत किंवा कंपोस्ट मिसळा. माती परीक्षणानुसार खत द्या; नत्र 2–3 हप्त्यांत — पेरणीवेळी, वेल वाढताना व फुलोऱ्यात. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Sowing & germination", "टोकणी व उगवण"], 0, 15, ["Seeds sprout in 6–8 days and the first leaves open.", "6–8 दिवसांत बी उगवते व पहिली पाने उघडतात."], [
      t("bg-sow", 0, "sowing", ["Sow seeds in pits", "खड्ड्यांत बी टोका"], ["Soak seed in plain water overnight. Sow 2–3 seeds per pit, 2–3 cm deep, in moist soil.", "बी रात्रभर साध्या पाण्यात भिजवा. ओलसर मातीत एका खड्ड्यात 2–3 बिया, 2–3 सेंमी खोल टोका."]),
      t("bg-irr0", 1, "irrigation", ["Light irrigation", "हलके पाणी द्या"], ["Keep the pits moist until seeds come up. Skip if it rains.", "बी उगवेपर्यंत खड्डे ओलसर ठेवा. पाऊस असल्यास गरज नाही."], 4),
      t("bg-thin", 12, "other", ["Fill gaps and thin", "खाडे भरा व विरळणी करा"], ["Resow empty pits. Keep 2 healthy plants per pit.", "रिकाम्या खड्ड्यांत पुन्हा बी टोका. एका खड्ड्यात 2 निरोगी रोपे ठेवा."]),
    ], [["Red pumpkin beetle eating young leaves", "लाल भुंगेरे कोवळी पाने खातात"]]),
    stage("vine-growth", ["Vine growth", "वेलांची वाढ"], 15, 45, ["Vines spread fast and climb the trellis.", "वेल झपाट्याने वाढतात व मांडवावर चढतात."], [
      t("bg-irr1", 15, "irrigation", ["Irrigate", "पाणी द्या"], ["Water at the base when the top soil dries.", "वरची माती कोरडी झाल्यावर मुळांजवळ पाणी द्या."], 6),
      t("bg-obs1", 18, "observation", ["Check leaves", "पाने तपासा"], ["Look for beetles, yellow patches on top of leaves (downy mildew) and white powder (powdery mildew).", "भुंगेरे, पानांवर वरून पिवळे चट्टे (केवडा) व पांढरी भुकटी (भुरी) आहे का ते पाहा."], 7),
      t("bg-weed", 20, "weeding", ["Weeding and earthing up", "खुरपणी व भर देणे"], ["Remove weeds around pits and pull a little soil to the base.", "खड्ड्यांभोवतीचे तण काढा व बुंध्याला थोडी माती लावा."]),
      t("bg-trellis", 25, "other", ["Train vines on the trellis", "वेल मांडवावर चढवा"], ["Guide vines up with string to a mandav about 1.5–2 m high. Fruits on a trellis grow straight and clean.", "दोरीने वेल साधारण 1.5–2 मीटर उंच मांडवावर चढवा. मांडवावरील फळे सरळ व स्वच्छ येतात."]),
      t("bg-fert1", 30, "fertiliser", ["Top dressing", "वरखत द्या"], ["Give the second nitrogen part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार नत्राचा दुसरा हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Downy mildew in humid weather", "दमट हवामानात केवडा"], ["Mosaic virus: mottled, curled leaves", "मोझॅक विषाणू: चट्टेदार, आकसलेली पाने"]]),
    stage("flowering", ["Flowering & fruit set", "फुलोरा व फळधारणा"], 45, 60, ["White flowers open in the evening; bees carry pollen from male to female flowers.", "संध्याकाळी पांढरी फुले उमलतात; मधमाश्या नर फुलांतून मादी फुलांपर्यंत परागकण नेतात."], [
      t("bg-irr2", 45, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Water stress now drops flowers and small fruits.", "आता पाण्याचा ताण आल्यास फुले व लहान फळे गळतात."], 5),
      t("bg-trap", 46, "observation", ["Set fruit fly traps", "फळमाशीसाठी सापळे लावा"], ["Hang fruit fly traps in the field before fruits form. Ask your KVK which trap to use.", "फळे लागण्यापूर्वी शेतात फळमाशीचे सापळे लावा. कोणता सापळा वापरायचा ते कृषी विज्ञान केंद्राला विचारा."]),
      t("bg-bees", 48, "observation", ["Protect bees", "मधमाश्यांचे संरक्षण करा"], ["Bees are needed for fruit set. Avoid spraying when flowers are open.", "फळधारणेसाठी मधमाश्या आवश्यक. फुले उमललेली असताना फवारणी टाळा."]),
    ], [["Fruit fly stinging young fruit", "फळमाशी कोवळ्या फळांना डंख मारते"]]),
    stage("harvest", ["Harvest (pickings)", "तोडणी"], 60, 135, ["Tender fruits are picked every 3–4 days.", "कोवळी फळे दर 3–4 दिवसांनी तोडली जातात."], [
      t("bg-pick", 60, "harvest", ["Pick tender fruits", "कोवळी फळे तोडा"], ["Pick while the skin is soft and shiny and a nail goes in easily. Cut with a knife, leaving a bit of stalk.", "साल मऊ व चमकदार असताना आणि नख सहज रुतते तेव्हा तोडा. चाकूने थोडा देठ ठेवून कापा."], 3),
      t("bg-irr3", 61, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep watering regularly between pickings.", "तोडण्यांच्या मध्ये नियमित पाणी देत राहा."], 5),
      t("bg-obs2", 63, "observation", ["Remove damaged fruits", "खराब फळे काढा"], ["Pick and bury fruits with fly stings or rot so the pest does not multiply.", "फळमाशीचे डंख किंवा सड असलेली फळे तोडून खड्ड्यात पुरा, म्हणजे कीड वाढत नाही."], 7),
      t("bg-fert2", 75, "fertiliser", ["Last top dressing", "शेवटचा वरखत हप्ता"], ["A last small nitrogen part keeps the vines bearing. Ask your agriculture officer for the amount.", "शेवटचा लहान नत्र हप्ता दिल्यास वेल फळे देत राहतात. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Check pre-harvest waiting days on any product label before picking", "तोडणीपूर्वी वापरलेल्या औषधाच्या लेबलवरील काढणीपूर्व कालावधी तपासा"], ["Powdery mildew on old leaves", "जुन्या पानांवर भुरी"]]),
    stage("last-pickings", ["Last pickings & cleanup", "शेवटच्या तोडण्या व शेत स्वच्छता"], 135, 150, ["Yield drops; the crop is finished and the field is cleaned.", "उत्पादन कमी होते; पीक संपते व शेत स्वच्छ केले जाते."], [
      t("bg-pick2", 135, "harvest", ["Last pickings", "शेवटच्या तोडण्या"], ["Pick the remaining good fruits.", "उरलेली चांगली फळे तोडा."], 4),
      t("bg-clean", 145, "other", ["Remove old vines", "जुने वेल काढा"], ["Pull out and compost or burn diseased vines. Do not grow another gourd in the same field next.", "रोगट वेल उपटून कंपोस्ट करा किंवा जाळा. त्याच शेतात लगेच दुसरे वेलवर्गीय पीक घेऊ नका."]),
    ], [["Pests carrying over to the next crop", "पुढच्या पिकात कीड जाणे"]]),
  ],
  flushes: { everyDays: 3, count: 20, note: b("Pick tender fruits every 3–4 days; regular picking keeps the vine bearing.", "दर 3–4 दिवसांनी कोवळी फळे तोडा; नियमित तोडणीमुळे वेल फळे देत राहतो.") },
  commonProblems: [
    { name: b("Fruit fly", "फळमाशी"), signs: b("Small stings on young fruit; fruit becomes crooked, rots and drops; maggots inside.", "कोवळ्या फळांवर लहान डंख; फळ वाकडे होऊन सडते व गळते; आत अळ्या."), prevention: prevent("Use fruit fly traps, pick fruits on time, and collect and bury damaged fruits.", "फळमाशीचे सापळे लावा, फळे वेळेवर तोडा आणि खराब फळे गोळा करून पुरा.") },
    { name: b("Red pumpkin beetle", "लाल भुंगेरे"), signs: b("Orange-red beetles make holes in young leaves; small plants can die.", "नारिंगी-लाल भुंगेरे कोवळ्या पानांना छिद्रे पाडतात; लहान रोपे मरू शकतात."), prevention: prevent("Check seedlings daily in the first 3 weeks and remove beetles by hand early in the morning.", "पहिल्या 3 आठवड्यांत रोज रोपे तपासा व सकाळी लवकर भुंगेरे हाताने वेचून नष्ट करा.") },
    { name: b("Downy and powdery mildew", "केवडा व भुरी"), signs: b("Yellow angular patches on top of leaves (downy) or white powder on leaves (powdery).", "पानांवर वरून पिवळे कोनाकृती चट्टे (केवडा) किंवा पानांवर पांढरी भुकटी (भुरी)."), prevention: prevent("Grow on a trellis for air, water at the base, and remove badly affected leaves.", "हवा खेळती राहावी म्हणून मांडवावर घ्या, मुळांजवळ पाणी द्या व जास्त बाधित पाने काढा.") },
  ],
  harvestSigns: b("Fruit is tender, light green and shiny, with soft skin. Over-mature fruits become hard and seedy.", "फळ कोवळे, फिकट हिरवे व चमकदार, साल मऊ. जून फळे कडक व बियांनी भरलेली होतात."),
  postHarvest: b("Pick in the cool morning, keep in shade, wipe clean, grade by size and shape, and pack without scratching the skin.", "सकाळी थंड वेळेत तोडा, सावलीत ठेवा, पुसून स्वच्छ करा, आकार व ठेवणीनुसार प्रतवारी करा आणि साल खरचटणार नाही असे भरा."),
  marketTips: b("Straight, medium-sized, tender fruits sell best. Pick the evening before or early on market day. Planning pickings with nearby farmers through your Mandi Mitra saves transport.", "सरळ, मध्यम आकाराच्या, कोवळ्या फळांना चांगला दर मिळतो. बाजाराच्या आदल्या संध्याकाळी किंवा पहाटे तोडा. मंडी मित्रामार्फत शेजारच्या शेतकऱ्यांसोबत तोडणीचे नियोजन केल्यास वाहतूक खर्च वाचतो."),
  varieties: [
    { name: "Samrat", note: b("Long-fruited variety released by MPKV Rahuri", "मफुकृवि राहुरीचा लांब फळांचा वाण") },
    { name: "Pusa Naveen", note: b("Straight cylindrical fruits (ICAR-IARI)", "सरळ दंडगोलाकार फळे (ICAR-IARI)") },
  ],
  source: "General practices from MPKV Rahuri and ICAR-IIVR cucurbit vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
