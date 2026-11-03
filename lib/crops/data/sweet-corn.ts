import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "sweet-corn",
  emoji: "🌽",
  name: b("Sweet corn", "स्वीट कॉर्न"),
  aliases: ["sweet corn", "sweetcorn", "sweet maize", "स्वीट कॉर्न", "स्वीटकॉर्न", "गोड मका"],
  category: "cereal",
  lifecycle: "seasonal",
  regions: ["western", "north"],
  majorDistricts: b("Pune, Nashik", "पुणे, नाशिक"),
  tier: 2,
  seasons: [
    { season: "kharif", sowingWindow: b("June–July", "जून–जुलै"), sowingMonths: [6, 7], durationDays: [75, 85] },
    { season: "rabi", sowingWindow: b("October–November (irrigated)", "ऑक्टोबर–नोव्हेंबर (बागायती)"), sowingMonths: [10, 11], durationDays: [85, 95] },
    { season: "summer", sowingWindow: b("January–February (irrigated)", "जानेवारी–फेब्रुवारी (बागायती)"), sowingMonths: [1, 2], durationDays: [75, 85] },
  ],
  method: "direct",
  plantingMaterial: b("Hybrid seed, bought fresh every season", "संकरित बियाणे; दर हंगामात नवे घ्या"),
  soil: b("Well-drained medium soil rich in organic matter. No water standing at the roots.", "सेंद्रिय पदार्थ भरपूर असलेली, निचरा होणारी मध्यम जमीन. मुळांशी पाणी साचू देऊ नका."),
  climate: b("Warm days and mild nights. Grown round the year with irrigation; very cold nights slow it.", "उबदार दिवस व सौम्य रात्री. पाणी असल्यास वर्षभर घेता येतो; खूप थंड रात्रींत वाढ मंदावते."),
  seedRate: b("About 3–4 kg seed per acre (sweet corn seed is light and shrivelled).", "एकरी साधारण 3–4 किलो बियाणे (स्वीट कॉर्नचे बी हलके व सुरकुतलेले असते)."),
  spacing: b("60 cm between rows, 20–25 cm between plants.", "ओळींत 60 सेंमी, रोपांत 20–25 सेंमी."),
  irrigation: b(
    "Needs steady moisture. Water every 7–10 days (every 5–7 days in summer). Never let the field dry at tasseling, silking and cob filling. Grow it at least 250–300 m away from field maize, or sow 2–3 weeks apart, so cobs stay sweet.",
    "सतत ओलावा लागतो. दर 7–10 दिवसांनी (उन्हाळ्यात 5–7 दिवसांनी) पाणी द्या. तुरे, केस व कणीस भरताना जमीन कोरडी पडू देऊ नका. कणसे गोड राहावीत म्हणून साध्या मक्यापासून किमान 250–300 मीटर दूर लावा किंवा 2–3 आठवड्यांच्या अंतराने पेरा.",
  ),
  nutrientGuide: b(
    "Use a soil test. Mix well-rotted farmyard manure; give nitrogen in 3 parts: at sowing, at knee-high and before tasseling. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. चांगले कुजलेले शेणखत मिसळा; नत्र 3 हप्त्यांत द्या: पेरणीवेळी, गुडघाभर उंचीला व तुरे येण्याआधी. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 10, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("sc-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow 3–4 cm deep on ridges at 60 x 20–25 cm, in moist soil.", "ओलसर जमिनीत सरी-वरंब्यावर 60 x 20–25 सेंमी अंतरावर 3–4 सेंमी खोल टोकण करा."]),
      t("sc-irr0", 1, "irrigation", ["Light irrigation", "हलके पाणी"], ["Keep the soil moist until seedlings come up; sweet corn seed rots in very wet soil.", "रोपे येईपर्यंत जमीन ओलसर ठेवा; खूप ओल्या जमिनीत बी कुजते."]),
    ], [["Seed rotting in wet, cold soil", "ओल्या, थंड जमिनीत बी कुजणे"]]),
    stage("vegetative", ["Leaf growth", "पानांची वाढ"], 10, 40, ["Leaves and stem grow fast.", "पाने व खोड झपाट्याने वाढतात."], [
      t("sc-gap", 10, "other", ["Fill gaps", "खाडे भरा"], ["Re-sow where seeds did not come up.", "बी न उगवलेल्या जागी पुन्हा टोकण करा."]),
      t("sc-obs1", 12, "observation", ["Check the whorl", "पोंगा तपासा"], ["Look for scraped leaves and sawdust-like droppings in the whorl (fall armyworm).", "खरवडलेली पाने व पोंग्यात भुश्यासारखी विष्ठा (लष्करी अळी) पाहा."], 5),
      t("sc-irr1", 15, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 7–10 days, more often in summer.", "दर 7–10 दिवसांनी, उन्हाळ्यात लवकर पाणी द्या."], 8),
      t("sc-fert", 25, "fertiliser", ["Top dressing and earthing up", "वरखत व भर देणे"], ["Give the second nitrogen part, weed and pull soil to the plants.", "नत्राचा दुसरा हप्ता द्या, खुरपणी करा व रोपांना मातीची भर द्या."]),
    ], [["Fall armyworm", "लष्करी अळी"]]),
    stage("tasseling", ["Tasseling & silking", "तुरे व केस येणे"], 40, 55, ["Tassels and silks come out; pollination happens.", "तुरे व केस बाहेर येतात; परागीभवन होते."], [
      t("sc-fert2", 40, "fertiliser", ["Last nitrogen part", "नत्राचा शेवटचा हप्ता"], ["Give it before tassels show, as per soil test.", "तुरे दिसण्याआधी माती परीक्षणानुसार द्या."]),
      t("sc-irr2", 42, "irrigation", ["Irrigate at silking", "केस येताना पाणी"], ["Most critical water; dry soil gives cobs with missing grains.", "सर्वात महत्त्वाचे पाणी; जमीन कोरडी असल्यास कणसात दाणे कमी भरतात."], 6),
      t("sc-silk", 48, "observation", ["Note the silking date", "केस आलेली तारीख नोंदवा"], ["Cobs are usually ready 18–22 days after silks appear.", "केस आल्यापासून साधारण 18–22 दिवसांत कणसे तयार होतात."]),
    ], [["Caterpillars feeding on silks", "केसांवर अळ्या"]]),
    stage("cob-filling", ["Cob filling", "कणीस भरणे"], 55, 75, ["Kernels fill with sweet, milky juice.", "दाणे गोड दुधाळ रसाने भरतात."], [
      t("sc-irr3", 55, "irrigation", ["Keep moisture even", "ओलावा सारखा ठेवा"], ["Even water gives full, sweet cobs.", "सारखे पाणी दिल्यास भरलेली, गोड कणसे मिळतात."], 6),
      t("sc-obs2", 58, "observation", ["Check cob tips", "कणसाचे टोक तपासा"], ["Look for caterpillars eating grains at the cob tip, and for birds and animals.", "कणसाच्या टोकाला दाणे खाणाऱ्या अळ्या, पक्षी व जनावरे पाहा."], 5),
    ], [["Cob borer at the cob tip", "कणसाच्या टोकाला अळी"]]),
    stage("harvest", ["Green cob harvest", "हिरव्या कणसांची काढणी"], 75, 95, ["Cobs are at the milky stage — the right time to pick.", "कणसे दुधाळ अवस्थेत — तोडणीची योग्य वेळ."], [
      t("sc-mat", 75, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Silks brown and dry, husk still green; a pressed kernel gives milky juice → pick.", "केस तपकिरी व कोरडे, आवरण हिरवे; दाणा दाबल्यावर दुधाळ रस → तोडा."]),
      t("sc-harv", 77, "harvest", ["Pick cobs", "कणसे तोडा"], ["Pick in the cool morning and send to market the same day. A few days late and cobs turn starchy.", "थंड सकाळी तोडा व त्याच दिवशी बाजारात पाठवा. काही दिवस उशीर झाल्यास कणसे पिठूळ होतात."], 3),
    ], [["Cobs losing sweetness if kept in heat", "उन्हात ठेवल्यास कणसांचा गोडवा कमी होणे"]]),
  ],
  commonProblems: [
    {
      name: b("Fall armyworm", "लष्करी अळी"),
      signs: b("Scraped, window-like patches and ragged holes on leaves; wet sawdust-like droppings in the whorl.", "पानांवर खरवडलेले खिडकीसारखे डाग व फाटलेली छिद्रे; पोंग्यात ओल्या भुश्यासारखी विष्ठा."),
      prevention: prevent("Check the whorl twice a week, use pheromone traps and destroy egg masses and young caterpillars by hand early.", "आठवड्यातून दोनदा पोंगा तपासा, कामगंध सापळे लावा आणि अंडीपुंज व लहान अळ्या सुरुवातीलाच हाताने नष्ट करा."),
    },
    {
      name: b("Cob borer", "कणसातील अळी"),
      signs: b("Caterpillars eat silks and grains at the cob tip; droppings at the tip.", "अळ्या कणसाच्या टोकाचे केस व दाणे खातात; टोकाला विष्ठा."),
      prevention: prevent("Use pheromone traps and remove damaged cobs. Plough after harvest to expose pupae in the soil.", "कामगंध सापळे लावा व खराब कणसे काढा. काढणीनंतर नांगरट करून जमिनीतील कोश उघडे पाडा."),
    },
    {
      name: b("Leaf blight", "पानांवरील करपा"),
      signs: b("Long grey-brown spots on leaves, starting from the lower leaves.", "खालच्या पानांपासून सुरू होणारे लांबट राखाडी-तपकिरी ठिपके."),
      prevention: prevent("Rotate crops, remove crop leftovers and avoid very dense planting.", "पिकांची फेरपालट करा, पिकाचे अवशेष काढा व खूप दाट लागवड टाळा."),
    },
  ],
  harvestSigns: b("Silks brown and dry, husk green and tight, kernels give milky juice when pressed — about 18–22 days after silking.", "केस तपकिरी व कोरडे, आवरण हिरवे व घट्ट, दाणा दाबल्यावर दुधाळ रस — केस आल्यापासून साधारण 18–22 दिवस."),
  postHarvest: b(
    "Sweetness drops within hours in heat. Keep cobs in shade, with husk on, and sell the same day or keep them cool. Grade by cob size.",
    "उष्णतेत काही तासांत गोडवा कमी होतो. कणसे आवरणासकट सावलीत ठेवा आणि त्याच दिवशी विका किंवा थंड जागी ठेवा. कणसाच्या आकारानुसार प्रतवारी करा.",
  ),
  marketTips: b(
    "Sell fresh to city markets, hotels, malls and roadside stalls. Stagger sowing every 2–3 weeks so you have cobs to sell steadily. Green stalks are sold as cattle fodder.",
    "शहरी बाजार, हॉटेल, मॉल व रस्त्याकडेच्या स्टॉलवर ताजी विक्री करा. सतत विक्रीसाठी दर 2–3 आठवड्यांनी टप्प्याटप्प्याने पेरणी करा. हिरवी ताटे जनावरांच्या चाऱ्यासाठी विकली जातात.",
  ),
  varieties: [], // TODO: varieties — confirm with MPKV Rahuri which sweet corn varieties/hybrids to list; most farmers grow private hybrids
  source: "General practices from MPKV Rahuri and ICAR-IIMR (maize) sweet corn guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
