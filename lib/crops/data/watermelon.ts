import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "watermelon",
  emoji: "🍉",
  name: b("Watermelon", "कलिंगड"),
  aliases: ["watermelon", "water melon", "kalingad", "kalingada", "kalingar", "tarbuj", "tarbooz", "tarbuz", "कलिंगड", "कलिंगडं", "तरबूज", "तरबूज़"],
  category: "fruit",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada", "vidarbha", "konkan"],
  tier: 2,
  seasons: [
    { season: "summer", label: b("Summer", "उन्हाळी"), sowingWindow: b("January–February", "जानेवारी–फेब्रुवारी"), sowingMonths: [1, 2], durationDays: [80, 100] },
    { season: "rabi", label: b("Rabi", "रब्बी"), sowingWindow: b("October–November (in the Konkan, on rice fields after harvest)", "ऑक्टोबर–नोव्हेंबर (कोकणात भात काढणीनंतरच्या शेतात)"), sowingMonths: [10, 11], durationDays: [90, 110] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly on beds (or seedlings raised in trays)", "बियाणे, थेट वाफ्यावर टोकण (किंवा ट्रेमध्ये तयार केलेली रोपे)"),
  soil: b(
    "Sandy loam or medium soil with good drainage. River-bank sandy soils suit it well. Avoid heavy soils where water stands.",
    "पाण्याचा चांगला निचरा होणारी रेताड पोयट्याची किंवा मध्यम जमीन. नदीकाठची रेताड जमीन चांगली. पाणी साचणारी भारी जमीन टाळा.",
  ),
  climate: b(
    "Warm, dry, sunny weather. Cold slows growth; cloudy, humid weather brings mildew. Hot dry days at ripening give sweet fruit.",
    "उबदार, कोरडे, सूर्यप्रकाशाचे हवामान. थंडीत वाढ मंदावते; ढगाळ, दमट हवेत भुरी-केवडा येतो. पिकताना उष्ण कोरडे दिवस असल्यास फळे गोड होतात.",
  ),
  seedRate: b("About 1–1.5 kg per acre for open-pollinated varieties; much less for hybrids — follow the packet.", "सरळ वाणांसाठी एकरी साधारण 1–1.5 किलो; संकरित वाणांसाठी खूप कमी — पाकिटावरील सूचना पाळा."),
  spacing: b("Beds 2–3 m apart, with plants 45–60 cm apart along the bed.", "दोन वाफ्यांत 2–3 मीटर, वाफ्यावर दोन रोपांत 45–60 सेंमी."),
  irrigation: b(
    "Drip with mulch is best. Water every 4–6 days in summer, less in rabi. Keep moisture even at fruit growth; reduce water in the last 7–10 days for sweeter fruit and less cracking.",
    "आच्छादनासह ठिबक उत्तम. उन्हाळ्यात दर 4–6 दिवसांनी, रब्बीत कमी पाणी. फळवाढीत ओलावा सारखा ठेवा; शेवटच्या 7–10 दिवसांत पाणी कमी करा, म्हणजे फळे गोड होतात व कमी तडकतात.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure into the beds before sowing. Give fertiliser as per soil test, part at sowing and the rest in 2–3 parts until fruit set. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी वाफ्यात चांगले कुजलेले शेणखत मिसळा. माती परीक्षणानुसार खत द्या — काही पेरणीवेळी, उरलेले फळधारणेपर्यंत 2–3 हप्त्यांत. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Sugar Baby", note: b("Popular early variety with small, round, dark fruit (released by ICAR-IARI)", "लहान, गोल, गडद रंगाच्या फळांचा लोकप्रिय लवकर वाण (ICAR-IARI)") },
    { name: "Arka Manik", note: b("From ICAR-IIHR Bengaluru; tolerates some diseases", "ICAR-IIHR बंगळुरूचा वाण; काही रोग सहन करतो") },
  ],
  stages: [
    stage("sowing", ["Sowing & germination", "टोकण व उगवण"], 0, 10, ["Seeds sprout in 5–7 days.", "बिया 5–7 दिवसांत उगवतात."], [
      t("wm-sow", 0, "sowing", ["Prepare beds and sow", "वाफे करून टोकण करा"], ["Make raised beds with manure, lay drip and mulch, and sow 2 seeds per spot about 2–3 cm deep.", "शेणखत मिसळून गादीवाफे करा, ठिबक व आच्छादन टाका आणि एका जागी 2 बिया साधारण 2–3 सेंमी खोल टोका."]),
      t("wm-irr0", 1, "irrigation", ["Water lightly", "हलके पाणी द्या"], ["Keep the seed zone moist until seedlings come up.", "रोपे उगवेपर्यंत बियांजवळ ओलावा ठेवा."], 2),
    ], [["Ants and birds taking seed", "मुंग्या व पक्ष्यांनी बिया नेणे"]]),
    stage("vine-growth", ["Vine growth", "वेलांची वाढ"], 10, 35, ["Seedlings grow into spreading vines.", "रोपे वाढून पसरणारे वेल होतात."], [
      t("wm-thin", 12, "other", ["Thin and fill gaps", "विरळणी करा व खाडे भरा"], ["Keep one healthy seedling per spot; fill gaps.", "एका जागी एक निरोगी रोप ठेवा; खाडे भरा."]),
      t("wm-irr1", 10, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 4–6 days as per weather.", "हवामानानुसार दर 4–6 दिवसांनी पाणी द्या."], 5),
      t("wm-fert1", 20, "fertiliser", ["First top dressing", "पहिला वरखत हप्ता"], ["Give a fertiliser part as per your plan.", "नियोजनानुसार खताचा हप्ता द्या."]),
      t("wm-obs1", 12, "observation", ["Check leaves", "पाने तपासा"], ["Look for red beetles eating young leaves and for aphids and whitefly.", "कोवळी पाने खाणारे लाल भुंगेरे, मावा व पांढरी माशी पाहा."], 5),
      t("wm-weed", 18, "weeding", ["Weed between beds", "वाफ्यांमधील तण काढा"], ["Weed before vines cover the ground.", "वेल जमीन झाकण्यापूर्वी खुरपणी करा."]),
    ], [["Red pumpkin beetle", "लाल भुंगेरे"], ["Virus (mottled, curled leaves)", "विषाणू (चट्टेदार, आकसलेली पाने)"]]),
    stage("flowering", ["Flowering & fruit set", "फुलोरा व फळधारणा"], 35, 55, ["Male and female flowers open; bees carry pollen and fruits set.", "नर व मादी फुले उमलतात; मधमाश्या परागकण नेतात व फळे लागतात."], [
      t("wm-irr2", 35, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Avoid water stress at flowering.", "फुलोऱ्यात पाण्याचा ताण पडू देऊ नका."], 4),
      t("wm-bees", 36, "observation", ["Keep bees safe", "मधमाश्यांचे संरक्षण करा"], ["Bees are needed for fruit set. Avoid spraying in the morning when flowers are open.", "फळधारणेसाठी मधमाश्या आवश्यक. सकाळी फुले उमललेली असताना फवारणी टाळा."]),
      t("wm-fert2", 40, "fertiliser", ["Second top dressing", "दुसरा वरखत हप्ता"], ["Give the last fertiliser part as per your plan.", "नियोजनानुसार खताचा शेवटचा हप्ता द्या."]),
      t("wm-obs2", 38, "observation", ["Check leaves and flowers", "पाने व फुले तपासा"], ["Look for powdery or downy mildew on leaves.", "पानांवर भुरी किंवा केवडा पाहा."], 5),
    ], [["Powdery mildew", "भुरी"], ["Downy mildew", "केवडा"]]),
    stage("fruit-growth", ["Fruit growth", "फळांची वाढ"], 55, 85, ["Fruits swell quickly and fill.", "फळे झपाट्याने फुगतात व भरतात."], [
      t("wm-irr3", 55, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even water prevents cracking.", "सारख्या पाण्याने फळे तडकत नाहीत."], 4),
      t("wm-turn", 65, "other", ["Turn and cushion fruit", "फळे फिरवा व खाली आधार द्या"], ["Put straw under fruit and turn them gently once so the colour is even.", "फळांखाली गवत ठेवा आणि रंग सारखा यावा म्हणून एकदा हळुवार फिरवा."]),
      t("wm-obs3", 57, "observation", ["Check fruit", "फळे तपासा"], ["Look for fruit fly stings and rotting fruit; remove them.", "फळमाशीचे डंख व सडणारी फळे पाहा; ती काढा."], 5),
    ], [["Fruit fly", "फळमाशी"], ["Fruit cracking", "फळे तडकणे"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 85, 110, ["Fruits ripen and are harvested in 2–3 rounds.", "फळे पिकतात व 2–3 फेऱ्यांत काढली जातात."], [
      t("wm-reduce", 85, "irrigation", ["Reduce water", "पाणी कमी करा"], ["Cut back water in the last week or so for sweeter fruit.", "गोड फळांसाठी शेवटच्या आठवड्याभरात पाणी कमी करा."]),
      t("wm-mat", 86, "observation", ["Check maturity", "पक्वता तपासा"], ["Ground spot turns creamy-yellow, the tendril near the fruit dries, and tapping gives a dull sound.", "जमिनीला टेकलेला भाग पिवळसर होतो, फळाजवळचा तणावा सुकतो आणि ठोकल्यावर बद्द आवाज येतो."]),
      t("wm-pick", 88, "harvest", ["Harvest ripe fruit", "पिकलेली फळे काढा"], ["Cut with a bit of stalk in the cool morning; do not drop or stack in the sun.", "थंड सकाळी थोडा देठ ठेवून कापा; फळे पाडू नका व उन्हात रचू नका."], 5),
    ], [["Sunburn on exposed fruit", "उघड्या फळांना ऊन लागणे"]]),
  ],
  commonProblems: [
    {
      name: b("Red pumpkin beetle", "लाल भुंगेरे"),
      signs: b("Orange-red beetles make holes in young leaves; seedlings can be wiped out.", "नारिंगी-लाल भुंगेरे कोवळ्या पानांना छिद्रे पाडतात; रोपे पूर्ण नष्ट होऊ शकतात."),
      prevention: prevent("Check seedlings daily in the first weeks, hand-pick beetles early in the morning and deep-plough after the crop.", "पहिल्या आठवड्यांत रोज रोपे तपासा, सकाळी लवकर भुंगेरे वेचून काढा आणि पिकानंतर खोल नांगरट करा."),
    },
    {
      name: b("Powdery and downy mildew", "भुरी व केवडा"),
      signs: b("White powder on leaves (powdery) or yellow angular patches with grey growth underneath (downy); leaves dry.", "पानांवर पांढरी भुकटी (भुरी) किंवा पिवळे कोनाकार डाग व खाली राखाडी बुरशी (केवडा); पाने सुकतात."),
      prevention: prevent("Use drip instead of overhead water, keep good spacing and remove badly affected leaves.", "वरून पाण्याऐवजी ठिबक वापरा, योग्य अंतर ठेवा आणि जास्त बाधित पाने काढा."),
    },
    {
      name: b("Fruit fly", "फळमाशी"),
      signs: b("Sting marks on young fruit; fruit rots from inside.", "कोवळ्या फळांवर डंखांचे ठिपके; फळ आतून सडते."),
      prevention: prevent("Collect and destroy stung fruit, use fruit fly traps and keep the field clean.", "डंख मारलेली फळे गोळा करून नष्ट करा, फळमाशी सापळे लावा आणि शेत स्वच्छ ठेवा."),
    },
    {
      name: b("Virus (mosaic)", "विषाणू (केवडा-चट्टे)"),
      signs: b("Mottled, curled, small leaves; plants stunted with few fruit. Spread by aphids and whitefly.", "चट्टेदार, आकसलेली, लहान पाने; रोपे खुंटतात व फळे कमी. मावा व पांढरी माशी पसरवतात."),
      prevention: prevent("Remove infected plants early, control weeds and use yellow sticky traps to watch the insects.", "विषाणूग्रस्त रोपे लवकर काढा, तण नियंत्रणात ठेवा आणि किडी ओळखण्यासाठी पिवळे चिकट सापळे लावा."),
    },
  ],
  harvestSigns: b(
    "The spot touching the ground turns creamy-yellow, the curly tendril nearest the fruit dries, the skin loses its shine, and tapping gives a dull, hollow sound.",
    "जमिनीला टेकलेला भाग पिवळसर होतो, फळाजवळचा तणावा सुकतो, सालीची चमक कमी होते आणि ठोकल्यावर बद्द, पोकळ आवाज येतो.",
  ),
  postHarvest: b(
    "Harvest in the cool morning, keep in shade, grade by size and load with straw padding. Do not throw or drop fruits — internal bruising spoils them.",
    "थंड सकाळी काढणी करा, सावलीत ठेवा, आकारानुसार प्रतवारी करा आणि गवताचा थर घालून भरा. फळे फेकू किंवा पाडू नका — आतून मार लागून खराब होतात.",
  ),
  marketTips: b(
    "Demand and prices peak in March–May. Uniform, well-coloured fruit gets the best rate. Pooling loads through your Mandi Mitra cuts transport cost for this bulky crop.",
    "मार्च–मेमध्ये मागणी व दर सर्वाधिक असतात. एकसारख्या, चांगल्या रंगाच्या फळांना चांगला दर मिळतो. अवजड पीक असल्याने मंडी मित्रामार्फत एकत्र गाडी भरल्यास वाहतूक खर्च कमी होतो.",
  ),
  source: "General practices from MPKV Rahuri and ICAR-IIHR cucurbit guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
