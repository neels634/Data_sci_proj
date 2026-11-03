import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "maize",
  emoji: "🌽",
  name: b("Maize", "मका"),
  aliases: ["maize", "maka", "makka", "corn", "makai", "मका", "मक्का", "मकई"],
  category: "cereal",
  lifecycle: "seasonal",
  regions: ["north", "western", "marathwada"],
  majorDistricts: b(
    "Nashik, Jalgaon, Ahilyanagar, Chhatrapati Sambhajinagar, Jalna, Pune, Satara, Sangli",
    "नाशिक, जळगाव, अहिल्यानगर, छत्रपती संभाजीनगर, जालना, पुणे, सातारा, सांगली",
  ),
  tier: 1,
  seasons: [
    { season: "kharif", sowingWindow: b("Mid-June to mid-July, with the monsoon", "जून मध्य ते जुलै मध्य, पावसासोबत"), sowingMonths: [6, 7], durationDays: [95, 110] },
    { season: "rabi", sowingWindow: b("October to mid-November (irrigated)", "ऑक्टोबर ते नोव्हेंबर मध्य (बागायती)"), sowingMonths: [10, 11], durationDays: [110, 125] },
  ],
  method: "direct",
  plantingMaterial: b("Seed (mostly hybrid seed, bought fresh every season)", "बियाणे (बहुतेक संकरित; दर हंगामात नवे घ्या)"),
  soil: b(
    "Medium to deep, well-drained soil rich in organic matter. Maize cannot stand water collecting at the roots.",
    "सेंद्रिय पदार्थ भरपूर असलेली, पाण्याचा चांगला निचरा होणारी मध्यम ते भारी जमीन. मुळांशी पाणी साचलेले मका सहन करत नाही.",
  ),
  climate: b(
    "Warm weather with moderate rain. Very cold nights slow rabi maize; dry heat at tasseling reduces grain set.",
    "उबदार हवा व मध्यम पाऊस. खूप थंड रात्रींमुळे रब्बी मक्याची वाढ मंदावते; तुरे येताना कोरडी उष्णता असल्यास दाणे कमी भरतात.",
  ),
  seedRate: b("About 7–8 kg hybrid seed per acre.", "एकरी साधारण 7–8 किलो संकरित बियाणे."),
  spacing: b("60–75 cm between rows, 20–25 cm between plants; one plant per spot.", "ओळींत 60–75 सेंमी, रोपांत 20–25 सेंमी; एका जागी एक रोप."),
  irrigation: b(
    "Kharif maize is mostly rain-fed; give water in long dry spells. Rabi maize needs water every 10–12 days. Never let the field dry at knee-high, tasseling-silking and grain filling stages. Drain standing water quickly after heavy rain.",
    "खरीप मका मुख्यतः पावसावर; मोठा खंड पडल्यास पाणी द्या. रब्बी मक्याला दर 10–12 दिवसांनी पाणी लागते. गुडघाभर उंची, तुरे-स्त्रीकेसर येणे व दाणे भरणे या अवस्थांत जमीन कोरडी पडू देऊ नका. जोराच्या पावसानंतर साचलेले पाणी लगेच काढा.",
  ),
  nutrientGuide: b(
    "Maize needs good feeding. Use a soil test, mix plenty of farmyard manure, and give nitrogen in 3 parts: at sowing, at knee-high and just before tasseling. Ask your agriculture officer for amounts. Zinc shortage is common — ask about it.",
    "मक्याला भरपूर खत लागते. माती परीक्षण करा, भरपूर शेणखत मिसळा आणि नत्र 3 हप्त्यांत द्या: पेरणीवेळी, गुडघाभर उंचीला व तुरे येण्याआधी. प्रमाण कृषी अधिकाऱ्यांना विचारा. जस्ताची कमतरता सामान्य आहे — त्याबद्दल विचारा.",
  ),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 12, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("mz-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow 4–5 cm deep at 60–75 x 20–25 cm, on ridges in heavy soil so water drains.", "60–75 x 20–25 सेंमी अंतरावर 4–5 सेंमी खोल पेरा; भारी जमिनीत पाणी निघेल अशा सरी-वरंब्यावर पेरा."]),
      t("mz-gap", 8, "other", ["Fill gaps", "खाडे भरा"], ["Re-sow where seeds did not come up, within a week.", "बी न उगवलेल्या जागी आठवड्याच्या आत पुन्हा टोकण करा."]),
    ], [["Birds and rats picking sown seed", "पक्षी व उंदीर पेरलेले बी उकरतात"]]),
    stage("vegetative", ["Leaf growth (knee-high)", "वाढ (गुडघाभर उंची)"], 12, 45, ["Leaves and stem grow fast. The cob size is decided now.", "पाने व खोड झपाट्याने वाढतात. कणसाचा आकार आताच ठरतो."], [
      t("mz-obs1", 13, "observation", ["Check the whorl", "पोंगा तपासा"], ["Look for window-like scraped leaves and sawdust-like droppings in the whorl (fall armyworm).", "पानांवर खरवडलेले खिडकीसारखे डाग व पोंग्यात भुश्यासारखी विष्ठा (लष्करी अळी) पाहा."], 5),
      t("mz-weed", 20, "weeding", ["Weeding and hoeing", "खुरपणी व कोळपणी"], ["Keep the field weed-free for the first 40 days.", "पहिले 40 दिवस शेत तणमुक्त ठेवा."], 12),
      t("mz-fert1", 30, "fertiliser", ["Top dressing and earthing up", "वरखत व भर देणे"], ["Give the second nitrogen part and pull soil up to the plants.", "नत्राचा दुसरा हप्ता द्या व रोपांना मातीची भर द्या."]),
      t("mz-irr1", 35, "irrigation", ["Irrigate at knee-high", "गुडघाभर उंचीला पाणी"], ["If rain is short or for rabi maize.", "पाऊस कमी असल्यास किंवा रब्बी मक्यासाठी."], 10),
    ], [["Fall armyworm", "लष्करी अळी"], ["Stem borer", "खोडकिडा"]]),
    stage("tasseling", ["Tasseling & silking", "तुरे व स्त्रीकेसर येणे"], 45, 70, ["Tassels come out at the top and silks at the cob; pollination happens.", "शेंड्यावर तुरे व कणसावर स्त्रीकेसर (केस) येतात; परागीभवन होते."], [
      t("mz-fert2", 45, "fertiliser", ["Last nitrogen part", "नत्राचा शेवटचा हप्ता"], ["Give the last nitrogen part just before tassels show, as per soil test.", "तुरे दिसण्याआधी माती परीक्षणानुसार नत्राचा शेवटचा हप्ता द्या."]),
      t("mz-irr2", 50, "irrigation", ["Irrigate at tasseling-silking", "तुरे-केस येताना पाणी"], ["The most critical water. Dry soil now gives cobs with missing grains.", "सर्वात महत्त्वाचे पाणी. आता जमीन कोरडी असल्यास कणसात दाणे कमी भरतात."], 8),
      t("mz-obs2", 52, "observation", ["Check leaves and cobs", "पाने व कणसे तपासा"], ["Look for long grey-brown spots on leaves (leaf blight) and caterpillars at the silks.", "पानांवर लांबट राखाडी-तपकिरी ठिपके (करपा) व केसांवर अळ्या पाहा."], 7),
    ], [["Leaf blight", "पानांवरील करपा"]]),
    stage("grain", ["Grain filling", "दाणे भरणे"], 70, 100, ["Grains fill: milky, then doughy, then hard.", "दाणे भरतात: दुधाळ, मग चिकट, मग टणक."], [
      t("mz-irr3", 72, "irrigation", ["Irrigate during grain filling", "दाणे भरताना पाणी"], ["Keep moisture until grains reach the dough stage.", "दाणे चिकट होईपर्यंत ओलावा ठेवा."], 10),
      t("mz-obs3", 75, "observation", ["Check stems and cobs", "खोड व कणसे तपासा"], ["Look for plants wilting suddenly and stems that break at the base (stalk rot).", "अचानक कोमेजणारी झाडे व बुडख्याशी मोडणारे खोड (खोडकूज) पाहा."], 7),
      t("mz-guard", 80, "other", ["Guard against birds and animals", "पक्षी व जनावरांपासून राखण"], ["Parrots, crows and wild pigs damage cobs now.", "पोपट, कावळे व रानडुकरे आता कणसांचे नुकसान करतात."]),
    ], [["Stalk rot and plants falling", "खोडकूज व झाडे लोळणे"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 100, 125, ["Husks turn dry and papery; grains are hard.", "कणसाची आवरणे सुकून कागदासारखी होतात; दाणे टणक होतात."], [
      t("mz-mat", 100, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Husks dry and a black layer at the base of the grain → ready.", "आवरणे सुकलेली व दाण्याच्या तळाशी काळा थर → तयार."]),
      t("mz-harv", 105, "harvest", ["Harvest", "काढणी करा"], ["Pick cobs, dry them in the sun 3–4 days and shell. Dry the grain well before storing.", "कणसे काढून 3–4 दिवस उन्हात वाळवा व दाणे काढा. साठवण्यापूर्वी दाणे चांगले वाळवा."]),
    ], [["Mould on cobs if harvested wet", "ओली कणसे काढल्यास बुरशी"]]),
  ],
  commonProblems: [
    {
      name: b("Fall armyworm", "लष्करी अळी"),
      signs: b("Window-like scraped patches and ragged holes on leaves; wet sawdust-like droppings in the whorl. The caterpillar has an upside-down Y mark on its head.", "पानांवर खरवडलेले खिडकीसारखे डाग व फाटलेली छिद्रे; पोंग्यात ओल्या भुश्यासारखी विष्ठा. अळीच्या डोक्यावर उलट्या Y सारखी खूण असते."),
      prevention: prevent("Deep ploughing in summer, timely sowing in one go across the village, check the whorl twice a week, and use pheromone traps. Put a little sand or ash in the whorl in early attack.", "उन्हाळ्यात खोल नांगरट, गावात एकाच वेळी वेळेवर पेरणी, आठवड्यातून दोनदा पोंगा तपासा आणि कामगंध सापळे लावा. सुरुवातीच्या प्रादुर्भावात पोंग्यात थोडी वाळू किंवा राख टाका."),
    },
    {
      name: b("Stem borer", "खोडकिडा"),
      signs: b("Small holes in a row across leaves; the centre shoot dries (dead heart).", "पानांवर ओळीत लहान छिद्रे; मधला पोंगा वाळतो."),
      prevention: prevent("Destroy stubble and old stalks after harvest. Do not keep stalks lying in the field.", "काढणीनंतर धसकटे व जुने खोड नष्ट करा. शेतात खोड पडून राहू देऊ नका."),
    },
    {
      name: b("Leaf blight", "पानांवरील करपा"),
      signs: b("Long, boat-shaped grey-brown spots on leaves, starting from the lower leaves.", "खालच्या पानांपासून सुरू होणारे लांबट, होडीच्या आकाराचे राखाडी-तपकिरी ठिपके."),
      prevention: prevent("Grow tolerant hybrids, rotate crops and remove crop leftovers.", "सहनशील संकरित वाण घ्या, पिकांची फेरपालट करा व पिकाचे अवशेष काढून टाका."),
    },
    {
      name: b("Stalk rot", "खोडकूज"),
      signs: b("After flowering, plants wilt suddenly, the lower stem turns soft and the plant falls.", "फुलोऱ्यानंतर झाडे अचानक कोमेजतात, खालचे खोड नरम होते व झाड लोळते."),
      prevention: prevent("Avoid water standing in the field and water stress at flowering. Give balanced fertiliser, not only nitrogen.", "शेतात पाणी साचू देऊ नका व फुलोऱ्यात पाण्याचा ताण टाळा. फक्त नत्र नव्हे तर संतुलित खत द्या."),
    },
  ],
  harvestSigns: b("Husks are dry and papery, grains are hard and show a black layer at the base.", "कणसाची आवरणे सुकून कागदासारखी, दाणे टणक व दाण्याच्या तळाशी काळा थर दिसतो."),
  postHarvest: b(
    "Dry cobs in the sun, shell, and dry the grain again until it is hard and rattles. Damp maize grows mould that is harmful to people and poultry. Store in clean, dry bags off the floor.",
    "कणसे उन्हात वाळवा, दाणे काढा आणि दाणे टणक होऊन खुळखुळेपर्यंत पुन्हा वाळवा. ओलसर मक्यावर माणसांना व कोंबड्यांना घातक बुरशी येते. स्वच्छ, कोरड्या पोत्यांत जमिनीपासून उंचावर साठवा.",
  ),
  marketTips: b(
    "Poultry feed and starch factories buy most maize; dry, clean grain without mould gets a better rate. Check the support price. Green stalks are good cattle fodder.",
    "कुक्कुटखाद्य व स्टार्च कारखाने बहुतेक मका घेतात; बुरशी नसलेल्या कोरड्या, स्वच्छ दाण्याला चांगला दर मिळतो. हमीभाव तपासा. हिरवी ताटे जनावरांसाठी चांगला चारा आहेत.",
  ),
  varieties: [], // TODO: varieties — confirm with MPKV Rahuri (Kolhapur maize station) which public hybrids/composites to list; most farmers grow private hybrids
  source: "General practices from MPKV Rahuri, VNMKV Parbhani and ICAR-IIMR (maize) guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
