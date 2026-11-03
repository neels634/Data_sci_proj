import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "cucumber",
  emoji: "🥒",
  name: b("Cucumber", "काकडी"),
  aliases: ["cucumber", "kakdi", "kakadi", "काकडी", "kheera", "khira", "खीरा"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["western", "north", "konkan"],
  majorDistricts: b("Pune, Nashik", "पुणे, नाशिक"),
  tier: 2,
  seasons: [
    { season: "kharif", sowingWindow: b("Sow in June–July with the rains", "जून–जुलैमध्ये पावसाबरोबर पेरणी"), sowingMonths: [6, 7], durationDays: [80, 100] },
    { season: "summer", sowingWindow: b("Sow in January–February under irrigation", "जानेवारी–फेब्रुवारीमध्ये पाण्याखाली पेरणी"), sowingMonths: [1, 2], durationDays: [70, 90] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly on beds or pits (or tray seedlings for hybrids)", "बियाणे; थेट वाफ्यावर किंवा आळ्यात टोकणी (संकरित वाणासाठी ट्रेमधील रोपेही)"),
  soil: b("Well-drained loamy soil rich in organic matter. Water must not stand.", "सेंद्रिय पदार्थ भरपूर असलेली, पाण्याचा निचरा होणारी पोयट्याची जमीन. पाणी साचू नये."),
  climate: b("Warm weather. Cold stops growth; very heavy rain spreads leaf diseases.", "उबदार हवामान. थंडीत वाढ थांबते; मुसळधार पावसात पानांचे रोग पसरतात."),
  seedRate: b("About 1–1.5 kg seed per acre (much less for hybrids).", "एकरी साधारण 1–1.5 किलो बियाणे (संकरित वाणाला बरेच कमी)."),
  spacing: b("1.5–2 m between rows, 45–60 cm between plants. Trellising on a pandal or wire saves space and gives straight fruit.", "ओळींत 1.5–2 मीटर, रोपांत 45–60 सेंमी. मांडव किंवा तारेवर वेल चढवल्यास जागा वाचते व फळे सरळ मिळतात."),
  irrigation: b(
    "Summer crop: water every 4–5 days, drip is best. Kharif crop: water only in dry spells and drain extra rainwater. Keep moisture even during fruiting — stress gives bitter, crooked fruit.",
    "उन्हाळी पीक: दर 4–5 दिवसांनी पाणी, ठिबक उत्तम. खरीप पीक: फक्त पावसाच्या खंडात पाणी व जास्तीचे पाणी काढा. फळधारणेत ओलावा सारखा ठेवा — ताण पडल्यास फळे कडू व वाकडी होतात.",
  ),
  nutrientGuide: b("Use a soil test. Mix well-rotted farmyard manure in beds or pits. Give nitrogen in 2–3 parts up to the start of picking. Ask your agriculture officer for amounts.", "माती परीक्षण करा. वाफ्यात किंवा आळ्यात कुजलेले शेणखत मिसळा. तोडणी सुरू होईपर्यंत नत्र 2–3 हप्त्यांत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."),
  stages: [
    stage("germination", ["Sowing & germination", "पेरणी व उगवण"], 0, 10, ["Seeds sprout in 4–6 days.", "बी 4–6 दिवसांत उगवते."], [
      t("cu-sow", 0, "sowing", ["Sow the seed", "बी टोका"], ["Sow 2 seeds per spot, 2–3 cm deep, on beds or pits.", "वाफ्यावर किंवा आळ्यात एका जागी 2 बिया, 2–3 सेंमी खोल टोका."]),
      t("cu-irr1", 1, "irrigation", ["Light watering", "हलके पाणी"], ["Keep moist until seedlings come up.", "रोपे वर येईपर्यंत ओलसर ठेवा."], 3),
    ], [["Red pumpkin beetle eating seedling leaves", "रोपांची पाने खाणारे लाल भुंगे"]]),
    stage("vine-growth", ["Vine growth", "वेलांची वाढ"], 10, 35, ["Vines grow and spread or climb.", "वेल वाढतात व पसरतात किंवा चढतात."], [
      t("cu-thin", 12, "other", ["Thin and fill gaps", "विरळणी व खाडे भरणे"], ["Keep 1–2 healthy plants per spot; re-sow gaps.", "एका जागी 1–2 निरोगी रोपे ठेवा; खाडे पुन्हा टोका."]),
      t("cu-weed", 18, "weeding", ["Weeding and top dressing", "खुरपणी व वरखत"], ["Weed and give the next nitrogen part as per soil test.", "खुरपणी करा व माती परीक्षणानुसार नत्राचा पुढचा हप्ता द्या."]),
      t("cu-trellis", 20, "other", ["Train on support", "आधारावर चढवा"], ["Guide vines onto a pandal or wire trellis.", "वेल मांडव किंवा तारेच्या आधारावर चढवा."]),
      t("cu-obs1", 14, "observation", ["Check leaves", "पाने तपासा"], ["Look for beetles, leaf miner trails and white powder on leaves.", "भुंगे, पानांवर नागमोडी रेषा (पाने पोखरणारी अळी) व पांढरी भुकटी पाहा."], 7),
      t("cu-irr2", 10, "irrigation", ["Irrigate", "पाणी द्या"], ["Water at the base; avoid wetting leaves.", "मुळांजवळ पाणी द्या; पाने ओली करू नका."], 5),
    ], [["Downy mildew in humid weather", "दमट हवामानात केवडा"], ["Powdery mildew in dry weather", "कोरड्या हवामानात भुरी"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 35, 45, ["Male and female flowers open; small fruits form behind female flowers.", "नर व मादी फुले उमलतात; मादी फुलामागे लहान फळ असते."], [
      t("cu-irr3", 35, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Stress now drops female flowers.", "आता ताण पडल्यास मादी फुले गळतात."], 4),
      t("cu-obs2", 36, "observation", ["Check flowers and young fruit", "फुले व कोवळी फळे तपासा"], ["Look for fruit fly stings and rotting young fruit. Fruit fly traps help; ask your KVK.", "फळमाशीचे डंख व कुजणारी कोवळी फळे पाहा. फळमाशी सापळे उपयोगी; कृषी विज्ञान केंद्राला विचारा."], 5),
    ], [["Fruit fly", "फळमाशी"]]),
    stage("harvest", ["Harvest (pickings)", "तोडणी"], 45, 100, ["Fruits are picked every 2–3 days.", "दर 2–3 दिवसांनी फळांची तोडणी होते."], [
      t("cu-pick", 45, "harvest", ["Pick tender fruit", "कोवळी फळे तोडा"], ["Pick green, tender fruits before seeds harden and colour fades.", "बिया कडक होण्यापूर्वी व रंग फिका पडण्यापूर्वी हिरवी, कोवळी फळे तोडा."], 3),
      t("cu-irr4", 46, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep moisture even between pickings.", "तोडण्यांच्या मध्ये ओलावा सारखा ठेवा."], 4),
      t("cu-remove", 48, "observation", ["Remove damaged fruit", "खराब फळे काढा"], ["Destroy fruit-fly-damaged and rotting fruits; bury them deep.", "फळमाशीने खराब व कुजलेली फळे नष्ट करा; खोल पुरा."], 5),
    ], [["Check pre-harvest waiting days on any product label before picking", "तोडणीपूर्वी वापरलेल्या औषधाच्या लेबलवरील काढणीपूर्व कालावधी तपासा"]]),
  ],
  flushes: {
    everyDays: 3,
    count: 15,
    note: b("Pick every 2–3 days for 6–8 weeks. Over-mature fruit left on the vine reduces new fruiting.", "6–8 आठवडे दर 2–3 दिवसांनी तोडणी. वेलावर जून फळे राहिल्यास नवी फळे कमी लागतात."),
  },
  commonProblems: [
    { name: b("Downy mildew", "केवडा"), signs: b("Yellow angular patches on top of leaves, grey-purple growth underneath; leaves dry.", "पानांच्या वरच्या बाजूला पिवळे कोनाकृती चट्टे, खाली करडी-जांभळी बुरशी; पाने सुकतात."), prevention: prevent("Give wide spacing, use trellis for airflow, and water at the base, not on leaves.", "जास्त अंतर ठेवा, हवा खेळती राहण्यासाठी मांडव वापरा आणि पानांवर नव्हे तर मुळांजवळ पाणी द्या.") },
    { name: b("Powdery mildew", "भुरी"), signs: b("White powder on leaves and stems.", "पाने व खोडावर पांढरी भुकटी."), prevention: prevent("Remove badly affected leaves and avoid crowding.", "जास्त बाधित पाने काढा आणि गर्दी टाळा.") },
    { name: b("Fruit fly", "फळमाशी"), signs: b("Small stings on fruit; fruit rots from inside with maggots.", "फळांवर लहान डंख; फळ आतून अळ्यांसह कुजते."), prevention: prevent("Use fruit fly traps, pick regularly and destroy damaged fruit.", "फळमाशी सापळे लावा, नियमित तोडणी करा आणि खराब फळे नष्ट करा.") },
    { name: b("Red pumpkin beetle", "लाल भुंगा"), signs: b("Orange-red beetles eat holes in young leaves.", "नारिंगी-लाल भुंगे कोवळ्या पानांना छिद्रे पाडतात."), prevention: prevent("Check seedlings daily in the first weeks and hand-pick beetles in the morning.", "पहिले काही आठवडे रोज रोपे तपासा आणि सकाळी भुंगे हाताने वेचा.") },
  ],
  harvestSigns: b("Fruits are full-sized for the variety, green, firm and tender, with soft seeds.", "फळे वाणानुसार पूर्ण आकाराची, हिरवी, टणक व कोवळी, बिया मऊ."),
  postHarvest: b("Pick in cool hours, keep in shade, grade by size and shape, and pack in crates. Handle gently to avoid bruises.", "थंड वेळेत तोडा, सावलीत ठेवा, आकार व ठेवणीनुसार प्रतवारी करा आणि क्रेटमध्ये भरा. खरचटू नये म्हणून हळुवार हाताळा."),
  marketTips: b("Straight, green, uniform cucumbers get better rates. Summer cucumber is in high demand; plan sowing so pickings fall in March–May.", "सरळ, हिरव्या, एकसारख्या काकडीला चांगला दर मिळतो. उन्हाळ्यात काकडीला मोठी मागणी असते; तोडणी मार्च–मेमध्ये येईल अशी पेरणी करा."),
  varieties: [], // TODO: varieties — confirm with MPKV Rahuri (e.g. Himangi, Phule Shubhangi) and ICAR-IIVR
  source: "General practices from MPKV Rahuri and ICAR-IIVR cucurbit guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
