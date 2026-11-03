import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "carrot",
  emoji: "🥕",
  name: b("Carrot", "गाजर"),
  aliases: ["carrot", "carrots", "gajar", "gaajar", "गाजर"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["western", "north"],
  majorDistricts: b("Pune, Nashik", "पुणे, नाशिक"),
  tier: 2,
  seasons: [
    { season: "rabi", sowingWindow: b("Sow in August–November (Asiatic red types early, European types in cooler months)", "ऑगस्ट–नोव्हेंबरमध्ये पेरणी (देशी लाल प्रकार लवकर, युरोपियन प्रकार थंड महिन्यांत)"), sowingMonths: [8, 9, 10, 11], durationDays: [90, 110] },
  ],
  method: "direct",
  plantingMaterial: b("Seed, sown directly in lines", "बियाणे; थेट ओळीत पेरणी"),
  soil: b("Deep, loose, well-drained sandy loam. Stones and hard clods make roots forked and crooked.", "खोल, भुसभुशीत, पाण्याचा निचरा होणारी हलकी पोयट्याची जमीन. दगड व ढेकळांमुळे गाजरे फाटे फुटलेली व वाकडी होतात."),
  climate: b("Cool weather gives good colour and sweetness. Heat gives pale, fibrous roots.", "थंड हवामानात चांगला रंग व गोडी येते. उष्णतेत गाजरे फिकी व रेषाळ होतात."),
  seedRate: b("About 2–2.5 kg seed per acre.", "एकरी साधारण 2–2.5 किलो बियाणे."),
  spacing: b("30–45 cm between rows or ridges; thin plants to 7–10 cm apart.", "ओळींत किंवा सऱ्यांत 30–45 सेंमी; विरळणी करून रोपांत 7–10 सेंमी."),
  irrigation: b(
    "Keep the topsoil moist until seeds sprout (light water every 3–4 days). Then water every 7–10 days. Uneven watering cracks roots; stop a week before harvest.",
    "बी उगवेपर्यंत वरची माती ओलसर ठेवा (दर 3–4 दिवसांनी हलके पाणी). नंतर दर 7–10 दिवसांनी पाणी. अनियमित पाण्याने गाजरे तडकतात; काढणीपूर्वी आठवडाभर पाणी बंद करा.",
  ),
  nutrientGuide: b(
    "Use a soil test. Use only well-rotted manure — fresh manure makes roots forked. Give nitrogen in 2 parts. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. फक्त चांगले कुजलेले खत वापरा — ताज्या शेणखतामुळे गाजरांना फाटे फुटतात. नत्र 2 हप्त्यांत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Sowing & germination", "पेरणी व उगवण"], 0, 15, ["Seeds sprout slowly, in 8–12 days.", "बी हळू, 8–12 दिवसांत उगवते."], [
      t("ca-sow", 0, "sowing", ["Prepare a fine bed and sow", "भुसभुशीत वाफा करून पेरा"], ["Plough deep, break clods, and sow thinly in lines about 1 cm deep. Mixing seed with fine sand helps even sowing.", "खोल नांगरट करा, ढेकळे फोडा आणि साधारण 1 सेंमी खोल ओळीत विरळ पेरा. बी बारीक वाळूत मिसळल्यास पेरणी एकसारखी होते."]),
      t("ca-irr1", 1, "irrigation", ["Light watering", "हलके पाणी"], ["Keep the top soil moist; a crust stops seedlings coming up.", "वरची माती ओलसर ठेवा; कडक पापुद्रा आल्यास रोपे वर येत नाहीत."], 3),
    ], [["Poor sprouting under soil crust", "कडक पापुद्र्यामुळे कमी उगवण"]]),
    stage("seedling", ["Seedling & thinning", "रोप अवस्था व विरळणी"], 15, 35, ["Young plants grow feathery leaves.", "लहान रोपांना पिसासारखी पाने येतात."], [
      t("ca-thin", 20, "other", ["Thin the plants", "विरळणी करा"], ["Keep plants 7–10 cm apart so roots have room.", "गाजरांना जागा मिळावी म्हणून रोपांत 7–10 सेंमी अंतर ठेवा."]),
      t("ca-weed", 22, "weeding", ["Weeding", "खुरपणी"], ["Weed carefully by hand; young carrots can't compete.", "हाताने काळजीपूर्वक खुरपणी करा; लहान रोपे तणांशी स्पर्धा करू शकत नाहीत."]),
    ], [["Weeds smothering seedlings", "तण रोपे दाबून टाकणे"]]),
    stage("root-development", ["Root development", "गाजर पोसणे"], 35, 80, ["Roots thicken and take colour.", "गाजरे जाड होतात व रंग धरतात."], [
      t("ca-irr2", 35, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 7–10 days; keep moisture even.", "दर 7–10 दिवसांनी पाणी; ओलावा सारखा ठेवा."], 8),
      t("ca-earth", 40, "fertiliser", ["Top dressing and earthing up", "वरखत व भर"], ["Give the second nitrogen part as per soil test and cover root tops with soil so they don't turn green.", "माती परीक्षणानुसार नत्राचा दुसरा हप्ता द्या व गाजरांचे वरचे टोक मातीने झाका, म्हणजे ते हिरवे होत नाही."]),
      t("ca-obs", 45, "observation", ["Check the crop", "पीक तपासा"], ["Look for leaf spots and cracked or green-topped roots.", "पानांवरील ठिपके व तडकलेली किंवा हिरव्या टोकाची गाजरे पाहा."], 10),
    ], [["Root cracking from uneven water", "अनियमित पाण्याने गाजरे तडकणे"], ["Leaf blight spots", "पानांवर करप्याचे ठिपके"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 80, 110, ["Roots reach full size and colour and are pulled.", "गाजरे पूर्ण आकार व रंग धरतात व उपटली जातात."], [
      t("ca-check", 80, "observation", ["Check root size", "गाजरांचा आकार पाहा"], ["Pull a few roots to check size and colour.", "आकार व रंग पाहण्यासाठी काही गाजरे उपटून पाहा."]),
      t("ca-harv", 85, "harvest", ["Harvest", "काढणी करा"], ["Water lightly a day before, then pull or dig roots. Don't leave too long — roots become woody.", "आदल्या दिवशी हलके पाणी द्या, मग गाजरे उपटा किंवा खणा. जास्त दिवस ठेवू नका — गाजरे कडक होतात."], 5),
      t("ca-wash", 86, "other", ["Wash and grade", "धुऊन प्रतवारी करा"], ["Wash, trim leaves and sort by size; remove forked and cracked roots.", "धुवा, पाने छाटा व आकारानुसार वेगळी करा; फाटे फुटलेली व तडकलेली गाजरे काढा."], 5),
    ], [["Roots turning woody if harvest is late", "उशिरा काढणीत गाजरे कडक होणे"]]),
  ],
  commonProblems: [
    { name: b("Forked and cracked roots", "फाटे फुटलेली व तडकलेली गाजरे"), signs: b("Roots split into two or more legs, or crack lengthwise.", "गाजरांना दोन-तीन फाटे फुटतात किंवा उभी तडे जातात."), prevention: b("Prepare a deep, clod-free bed, use only well-rotted manure, and water evenly.", "खोल, ढेकळे नसलेला वाफा तयार करा, फक्त कुजलेले खत वापरा आणि सारखे पाणी द्या.") },
    { name: b("Leaf blight", "पानांवरील करपा"), signs: b("Dark brown spots on leaves; leaves dry from the edges.", "पानांवर गडद तपकिरी ठिपके; पाने कडेपासून सुकतात."), prevention: prevent("Use healthy seed, rotate crops and avoid wetting leaves in the evening.", "निरोगी बियाणे वापरा, पिकांची फेरपालट करा आणि संध्याकाळी पाने ओली करू नका.") },
    { name: b("Aphids", "मावा"), signs: b("Small insects on leaves and crowns; leaves curl and yellow.", "पाने व मानेवर लहान कीटक; पाने आकसून पिवळी पडतात."), prevention: prevent("Check plants regularly and use yellow sticky traps.", "झाडे नियमित तपासा आणि पिवळे चिकट सापळे लावा.") },
  ],
  harvestSigns: b("Roots are full length and deep in colour; the top of the root is about 2–3 cm wide.", "गाजरे पूर्ण लांबीची व गडद रंगाची; वरच्या टोकाची जाडी साधारण 2–3 सेंमी."),
  postHarvest: b("Wash, trim leaves, grade by size and pack in gunny bags or crates. Keep cool and moist so roots don't go limp.", "धुवा, पाने छाटा, आकारानुसार प्रतवारी करा आणि बारदान किंवा क्रेटमध्ये भरा. गाजरे मऊ पडू नयेत म्हणून थंड व ओलसर ठेवा."),
  marketTips: b("Straight, smooth, well-coloured carrots of even size fetch better rates. Washed carrots sell faster.", "सरळ, गुळगुळीत, चांगल्या रंगाच्या, एकसारख्या आकाराच्या गाजरांना चांगला दर मिळतो. धुतलेली गाजरे लवकर विकली जातात."),
  varieties: [
    { name: "Pusa Kesar", note: b("Red Asiatic type for early sowing (ICAR-IARI)", "लवकर पेरणीसाठी लाल देशी प्रकार (ICAR-IARI)") },
    { name: "Nantes", note: b("Orange European type for cool weather", "थंड हवामानासाठी नारिंगी युरोपियन प्रकार") },
  ],
  source: "General practices from MPKV Rahuri, ICAR-IARI and ICAR-IIVR root vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
