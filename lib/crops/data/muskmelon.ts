import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "muskmelon",
  emoji: "🍈",
  name: b("Muskmelon", "खरबूज"),
  aliases: ["muskmelon", "musk melon", "kharbuj", "kharbuja", "kharbooja", "kharbuza", "cantaloupe", "खरबूज", "खरबूजा", "खरबुज"],
  category: "fruit",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada", "vidarbha"],
  tier: 2,
  seasons: [
    { season: "summer", label: b("Summer", "उन्हाळी"), sowingWindow: b("January–February", "जानेवारी–फेब्रुवारी"), sowingMonths: [1, 2], durationDays: [80, 100] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly on beds (or seedlings raised in trays)", "बियाणे, थेट वाफ्यावर टोकण (किंवा ट्रेमध्ये तयार केलेली रोपे)"),
  soil: b(
    "Sandy loam or medium soil with good drainage. River-bank sandy soils suit it well. Avoid heavy, waterlogged soils.",
    "पाण्याचा चांगला निचरा होणारी रेताड पोयट्याची किंवा मध्यम जमीन. नदीकाठची रेताड जमीन चांगली. भारी, पाणी साचणारी जमीन टाळा.",
  ),
  climate: b(
    "Hot, dry, sunny weather. Dry heat at ripening gives sweet, scented fruit; humid or rainy weather brings mildew and tasteless fruit.",
    "उष्ण, कोरडे, सूर्यप्रकाशाचे हवामान. पिकताना कोरडी उष्णता असल्यास फळे गोड व सुवासिक होतात; दमट किंवा पावसाळी हवेत भुरी-केवडा येतो व फळांना चव राहत नाही.",
  ),
  seedRate: b("About 1 kg per acre for open-pollinated varieties; much less for hybrids — follow the packet.", "सरळ वाणांसाठी एकरी साधारण 1 किलो; संकरित वाणांसाठी खूप कमी — पाकिटावरील सूचना पाळा."),
  spacing: b("Beds 1.5–2 m apart, with plants 45–60 cm apart along the bed.", "दोन वाफ्यांत 1.5–2 मीटर, वाफ्यावर दोन रोपांत 45–60 सेंमी."),
  irrigation: b(
    "Drip with mulch is best. Water every 4–6 days. Keep moisture even until fruits are full size, then reduce water in the last 7–10 days — too much water near harvest makes fruit bland and cracked.",
    "आच्छादनासह ठिबक उत्तम. दर 4–6 दिवसांनी पाणी द्या. फळे पूर्ण आकाराची होईपर्यंत ओलावा सारखा ठेवा, मग शेवटच्या 7–10 दिवसांत पाणी कमी करा — काढणीजवळ जास्त पाणी दिल्यास फळे बेचव होतात व तडकतात.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure into the beds before sowing. Give fertiliser as per soil test, part at sowing and the rest in 2–3 parts until fruit set. Ask your agriculture officer for amounts.",
    "पेरणीपूर्वी वाफ्यात चांगले कुजलेले शेणखत मिसळा. माती परीक्षणानुसार खत द्या — काही पेरणीवेळी, उरलेले फळधारणेपर्यंत 2–3 हप्त्यांत. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Pusa Sharbati", note: b("Early variety with netted skin and orange flesh (ICAR-IARI)", "जाळीदार साल व नारिंगी गराचा लवकर वाण (ICAR-IARI)") },
    { name: "Hara Madhu", note: b("Sweet, green-flesh variety (PAU Ludhiana)", "गोड, हिरव्या गराचा वाण (PAU लुधियाना)") },
    { name: "Arka Rajhans", note: b("From ICAR-IIHR Bengaluru; keeps and travels well", "ICAR-IIHR बंगळुरूचा वाण; चांगला टिकतो व वाहतुकीत खराब होत नाही") },
  ],
  stages: [
    stage("sowing", ["Sowing & germination", "टोकण व उगवण"], 0, 10, ["Seeds sprout in 5–7 days.", "बिया 5–7 दिवसांत उगवतात."], [
      t("mm-sow", 0, "sowing", ["Prepare beds and sow", "वाफे करून टोकण करा"], ["Make raised beds with manure, lay drip and mulch, and sow 2 seeds per spot about 2–3 cm deep.", "शेणखत मिसळून गादीवाफे करा, ठिबक व आच्छादन टाका आणि एका जागी 2 बिया साधारण 2–3 सेंमी खोल टोका."]),
      t("mm-irr0", 1, "irrigation", ["Water lightly", "हलके पाणी द्या"], ["Keep the seed zone moist until seedlings come up.", "रोपे उगवेपर्यंत बियांजवळ ओलावा ठेवा."], 2),
    ], [["Ants and birds taking seed", "मुंग्या व पक्ष्यांनी बिया नेणे"]]),
    stage("vine-growth", ["Vine growth", "वेलांची वाढ"], 10, 35, ["Seedlings grow into spreading vines.", "रोपे वाढून पसरणारे वेल होतात."], [
      t("mm-thin", 12, "other", ["Thin and fill gaps", "विरळणी करा व खाडे भरा"], ["Keep one healthy seedling per spot; fill gaps.", "एका जागी एक निरोगी रोप ठेवा; खाडे भरा."]),
      t("mm-irr1", 10, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 4–6 days as per weather.", "हवामानानुसार दर 4–6 दिवसांनी पाणी द्या."], 5),
      t("mm-fert1", 20, "fertiliser", ["First top dressing", "पहिला वरखत हप्ता"], ["Give a fertiliser part as per your plan.", "नियोजनानुसार खताचा हप्ता द्या."]),
      t("mm-obs1", 12, "observation", ["Check leaves", "पाने तपासा"], ["Look for red beetles on young leaves and for aphids and whitefly.", "कोवळ्या पानांवर लाल भुंगेरे, मावा व पांढरी माशी पाहा."], 5),
    ], [["Red pumpkin beetle", "लाल भुंगेरे"]]),
    stage("flowering", ["Flowering & fruit set", "फुलोरा व फळधारणा"], 35, 55, ["Flowers open; bees pollinate and fruits set.", "फुले उमलतात; मधमाश्या परागीभवन करतात व फळे लागतात."], [
      t("mm-irr2", 35, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Avoid water stress at flowering.", "फुलोऱ्यात पाण्याचा ताण पडू देऊ नका."], 4),
      t("mm-bees", 36, "observation", ["Keep bees safe", "मधमाश्यांचे संरक्षण करा"], ["Bees are needed for fruit set. Avoid spraying in the morning when flowers are open.", "फळधारणेसाठी मधमाश्या आवश्यक. सकाळी फुले उमललेली असताना फवारणी टाळा."]),
      t("mm-fert2", 40, "fertiliser", ["Second top dressing", "दुसरा वरखत हप्ता"], ["Give the last fertiliser part as per your plan.", "नियोजनानुसार खताचा शेवटचा हप्ता द्या."]),
      t("mm-obs2", 38, "observation", ["Check leaves", "पाने तपासा"], ["Look for powdery or downy mildew.", "भुरी किंवा केवडा पाहा."], 5),
    ], [["Powdery mildew", "भुरी"], ["Downy mildew", "केवडा"]]),
    stage("fruit-growth", ["Fruit growth", "फळांची वाढ"], 55, 80, ["Fruits swell and the netting on the skin develops.", "फळे फुगतात व सालीवर जाळी तयार होते."], [
      t("mm-irr3", 55, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even water until fruits reach full size.", "फळे पूर्ण आकाराची होईपर्यंत सारखे पाणी."], 4),
      t("mm-cushion", 60, "other", ["Cushion the fruit", "फळांखाली आधार द्या"], ["Put straw under fruit so they do not touch wet soil.", "फळे ओल्या मातीला लागू नयेत म्हणून खाली गवत ठेवा."]),
      t("mm-obs3", 57, "observation", ["Check fruit", "फळे तपासा"], ["Look for fruit fly stings and rot; remove affected fruit.", "फळमाशीचे डंख व सड पाहा; बाधित फळे काढा."], 5),
    ], [["Fruit fly", "फळमाशी"]]),
    stage("harvest", ["Ripening & harvest", "पिकणे व काढणी"], 80, 100, ["Fruits ripen and are picked every 2–3 days.", "फळे पिकतात व दर 2–3 दिवसांनी तोडली जातात."], [
      t("mm-reduce", 80, "irrigation", ["Reduce water", "पाणी कमी करा"], ["Cut back water for sweeter fruit.", "गोड फळांसाठी पाणी कमी करा."]),
      t("mm-pick", 82, "harvest", ["Pick at half slip", "देठ सुटू लागताच तोडा"], ["Pick when a crack forms around the stalk and it comes off with light pressure; for distant markets pick a little earlier.", "देठाभोवती भेग पडून हलक्या दाबाने देठ सुटू लागला की तोडा; लांबच्या बाजारासाठी थोडे आधी तोडा."], 2),
    ], [["Fruit cracking from late heavy watering", "उशिराच्या भरपूर पाण्याने फळे तडकणे"]]),
  ],
  commonProblems: [
    {
      name: b("Powdery and downy mildew", "भुरी व केवडा"),
      signs: b("White powder on leaves, or yellow angular patches with grey growth underneath; leaves dry and fruit loses sweetness.", "पानांवर पांढरी भुकटी, किंवा पिवळे कोनाकार डाग व खाली राखाडी बुरशी; पाने सुकतात व फळांची गोडी कमी होते."),
      prevention: prevent("Use drip instead of overhead water, keep good spacing and remove badly affected leaves.", "वरून पाण्याऐवजी ठिबक वापरा, योग्य अंतर ठेवा आणि जास्त बाधित पाने काढा."),
    },
    {
      name: b("Fruit fly", "फळमाशी"),
      signs: b("Sting marks on fruit; maggots inside and rotting.", "फळांवर डंखांचे ठिपके; आत अळ्या व सड."),
      prevention: prevent("Collect and destroy stung fruit, use fruit fly traps and keep the field clean.", "डंख मारलेली फळे गोळा करून नष्ट करा, फळमाशी सापळे लावा आणि शेत स्वच्छ ठेवा."),
    },
    {
      name: b("Red pumpkin beetle", "लाल भुंगेरे"),
      signs: b("Orange-red beetles make holes in young leaves.", "नारिंगी-लाल भुंगेरे कोवळ्या पानांना छिद्रे पाडतात."),
      prevention: prevent("Check seedlings daily in the first weeks and hand-pick beetles early in the morning.", "पहिल्या आठवड्यांत रोज रोपे तपासा आणि सकाळी लवकर भुंगेरे वेचून काढा."),
    },
  ],
  harvestSigns: b(
    "Skin colour changes from green to yellowish, netting stands out, a sweet smell comes, and a crack forms around the stalk so it separates with light pressure (slip).",
    "सालीचा रंग हिरव्यावरून पिवळसर होतो, जाळी उठून दिसते, गोड वास येतो आणि देठाभोवती भेग पडून हलक्या दाबाने देठ सुटतो.",
  ),
  postHarvest: b(
    "Pick in the cool morning, keep in shade, grade by size and pack in ventilated crates or boxes with padding. Ripe muskmelon lasts only 2–4 days.",
    "थंड सकाळी तोडा, सावलीत ठेवा, आकारानुसार प्रतवारी करा आणि गादी घातलेल्या हवेशीर क्रेट किंवा खोक्यांत भरा. पिकलेले खरबूज फक्त 2–4 दिवस टिकते.",
  ),
  marketTips: b(
    "Demand is high in summer (March–May). Sweet, well-netted, uniform fruit gets the best price. Arrange buyers before harvest because the fruit does not keep.",
    "उन्हाळ्यात (मार्च–मे) मागणी जास्त असते. गोड, चांगल्या जाळीची, एकसारखी फळे चांगला दर मिळवतात. फळे टिकत नाहीत म्हणून काढणीपूर्वीच खरेदीदार ठरवा.",
  ),
  source: "General practices from MPKV Rahuri and ICAR-IIHR cucurbit guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
