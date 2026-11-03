import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "onion",
  emoji: "🧅",
  name: b("Onion", "कांदा"),
  aliases: ["onion", "kanda", "kaanda", "pyaz", "pyaj", "कांदा", "कांदे", "प्याज"],
  category: "vegetable",
  lifecycle: "seasonal",
  regions: ["north", "western", "marathwada"],
  majorDistricts: b("Nashik, Ahilyanagar, Pune, Solapur, Satara", "नाशिक, अहिल्यानगर, पुणे, सोलापूर, सातारा"),
  tier: 1,
  seasons: [
    { season: "kharif", label: b("Kharif", "खरीप"), sowingWindow: b("Nursery in May–June", "रोपवाटिका मे–जून"), sowingMonths: [5, 6], durationDays: [135, 150] },
    { season: "kharif", label: b("Late kharif (rangda)", "उशिरा खरीप (रांगडा)"), sowingWindow: b("Nursery in August–September", "रोपवाटिका ऑगस्ट–सप्टेंबर"), sowingMonths: [8, 9], durationDays: [145, 165] },
    { season: "rabi", label: b("Rabi", "रब्बी"), sowingWindow: b("Nursery in October–November", "रोपवाटिका ऑक्टोबर–नोव्हेंबर"), sowingMonths: [10, 11], durationDays: [150, 170] },
  ],
  method: "transplant",
  plantingMaterial: b("Seed, raised as seedlings in a nursery", "बियाणे; रोपवाटिकेत रोपे तयार करून"),
  nurseryDays: 45,
  soil: b(
    "Well-drained medium black or loamy soil. Avoid fields where water stands after rain.",
    "पाण्याचा चांगला निचरा होणारी मध्यम काळी किंवा पोयट्याची जमीन. पावसानंतर पाणी साचणारे शेत टाळा.",
  ),
  climate: b(
    "Cool weather for leaf growth, warmer days for bulbs. Rabi onion stores the longest.",
    "पानांच्या वाढीसाठी थंड हवा, कांदा पोसण्यासाठी उबदार दिवस. रब्बी कांदा सर्वात जास्त दिवस टिकतो.",
  ),
  seedRate: b("3–4 kg seed per acre, sown in a nursery.", "एकरी 3–4 किलो बियाणे, रोपवाटिकेत पेरणी."),
  spacing: b("15 cm between rows, 10 cm between plants.", "दोन ओळींत 15 सेंमी, दोन रोपांत 10 सेंमी."),
  irrigation: b(
    "Light and regular. Water right after transplanting, then every 6–8 days (more often in heat). Keep moisture even while bulbs grow. Stop 10–15 days before harvest.",
    "हलके व नियमित पाणी. पुनर्लागवडीनंतर लगेच पाणी, नंतर दर 6–8 दिवसांनी (उन्हाळ्यात लवकर). कांदा पोसताना ओलावा सारखा ठेवा. काढणीपूर्वी 10–15 दिवस पाणी बंद करा.",
  ),
  nutrientGuide: b(
    "Base it on a soil test. Mix well-rotted compost or farmyard manure before transplanting. Give nitrogen in parts — some at transplanting, the rest within about 45 days. Late nitrogen makes onions rot in storage. Ask your agriculture officer for the amounts.",
    "माती परीक्षणावर आधारित खत द्या. पुनर्लागवडीपूर्वी चांगले कुजलेले कंपोस्ट किंवा शेणखत मिसळा. नत्र विभागून द्या — काही लागवडीवेळी, उरलेले साधारण 45 दिवसांच्या आत. उशिरा नत्र दिल्यास साठवणीत कांदा सडतो. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("nursery", ["Nursery", "रोपवाटिका"], 0, 45, ["Seeds sprout in raised beds and grow into seedlings.", "गादीवाफ्यावर बी उगवते आणि रोपे तयार होतात."], [
      t("on-bed", 0, "sowing", ["Prepare nursery beds and sow", "रोपवाटिका तयार करून पेरणी करा"], ["Make raised beds about 1 m wide, mix compost, sow seed thinly in lines and cover lightly.", "साधारण 1 मीटर रुंद गादीवाफे करा, कंपोस्ट मिसळा, ओळीत विरळ बी पेरा व हलके झाका."]),
      t("on-nwater", 1, "irrigation", ["Water the nursery lightly", "रोपवाटिकेला हलके पाणी द्या"], ["Use a can or light sprinkle. Don't let beds stay soggy — seedlings rot.", "झारीने हलके पाणी द्या. वाफे सतत ओले ठेवू नका — रोपे कुजतात."], 3),
      t("on-nweed", 20, "weeding", ["Weed the nursery", "रोपवाटिकेतील तण काढा"], ["Pull weeds by hand gently so seedlings are not disturbed.", "रोपांना धक्का न लागता हाताने तण काढा."]),
      t("on-ready", 40, "observation", ["Check seedlings are ready", "रोपे तयार आहेत का ते पाहा"], ["Ready at 6–7 weeks: about 15 cm tall and pencil-thick. Older seedlings bolt; younger ones die more.", "6–7 आठवड्यांत तयार: साधारण 15 सेंमी उंच व पेन्सिलएवढी जाड. जुनी रोपे लवकर फुलावर येतात; लहान रोपे जास्त मरतात."]),
    ], [["Damping off: seedlings fall over at the base", "रोपे कोलमडणे: रोपे खोडाजवळून पडतात"]]),
    stage("transplanting", ["Transplanting", "पुनर्लागवड"], 45, 50, ["Seedlings move from the nursery to the main field.", "रोपे रोपवाटिकेतून मुख्य शेतात लावली जातात."], [
      t("on-field", 45, "other", ["Prepare the main field", "मुख्य शेत तयार करा"], ["Plough, level, add compost, and make flat beds or ridges so water spreads evenly.", "नांगरट, सपाटीकरण करा, कंपोस्ट मिसळा आणि पाणी सारखे पसरेल असे सपाट वाफे किंवा सरी करा."]),
      t("on-tp", 46, "transplanting", ["Transplant seedlings", "रोपांची पुनर्लागवड करा"], ["15 cm between rows, 10 cm between plants. Water the field right after planting.", "ओळींत 15 सेंमी, रोपांत 10 सेंमी. लावल्यानंतर लगेच पाणी द्या."]),
    ], [["Seedlings drying in hot sun after planting", "लागवडीनंतर उन्हात रोपे सुकणे"]]),
    stage("establishment", ["Establishment", "रोपे स्थिरावणे"], 50, 65, ["Seedlings take root and start growing again.", "रोपे मूळ धरतात आणि पुन्हा वाढू लागतात."], [
      t("on-irr1", 50, "irrigation", ["Irrigate lightly", "हलके पाणी द्या"], ["Roots are shallow now. Give light water so the top soil stays moist.", "मुळे उथळ आहेत. वरची माती ओलसर राहील एवढे हलके पाणी द्या."], 6),
      t("on-gap", 54, "other", ["Fill the gaps", "खाडे भरा"], ["Replant where seedlings died, using spare seedlings, so the crop ripens evenly.", "मेलेल्या रोपांच्या जागी उरलेली रोपे लावा, म्हणजे पीक एकसारखे तयार होईल."]),
      t("on-obs1", 58, "observation", ["Walk the field", "शेतात फेरी मारा"], ["Look for cut or dead seedlings and caterpillars in the soil near them.", "कापलेली किंवा मेलेली रोपे आणि त्यांच्या जवळ मातीत अळ्या आहेत का ते पाहा."]),
    ], [["Cutworm: seedlings cut at the base", "कटवर्म: रोपे खोडाजवळ कापलेली"]]),
    stage("vegetative", ["Leaf growth", "पानांची वाढ"], 65, 95, ["Leaves grow fast. Healthy leaves now mean bigger onions later.", "पाने झपाट्याने वाढतात. आता निरोगी पाने म्हणजे नंतर मोठा कांदा."], [
      t("on-irr2", 66, "irrigation", ["Irrigate", "पाणी द्या"], ["Water when the top soil is dry. Light and regular — don't flood the field.", "वरची माती कोरडी झाल्यावर पाणी द्या. हलके व नियमित — शेतात पाणी तुंबवू नका."], 8),
      t("on-obs2", 67, "observation", ["Check leaves", "पाने तपासा"], ["Look for silvery streaks (thrips) and purple spots (purple blotch) on leaves.", "पानांवर चंदेरी रेषा (फुलकिडे) आणि जांभळे ठिपके (करपा) आहेत का ते पाहा."], 7),
      t("on-weed", 70, "weeding", ["Weeding", "खुरपणी"], ["Weeds take water and food from onion. Weed by hand or hoe; don't damage bulbs.", "तण कांद्याचे पाणी व अन्न घेतात. हाताने किंवा कोळप्याने खुरपणी करा; कांद्याला इजा करू नका."], 15),
      t("on-fert", 75, "fertiliser", ["Top dressing of nitrogen", "नत्राचा वरखत हप्ता"], ["Give the last nitrogen part now, as per your soil test. Ask your agriculture officer for the amount. No nitrogen after this.", "माती परीक्षणानुसार नत्राचा शेवटचा हप्ता आता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा. यानंतर नत्र देऊ नका."]),
    ], [["Thrips: silvery streaks, leaf tips dry", "फुलकिडे: चंदेरी रेषा, पानांचे शेंडे सुकतात"], ["Purple blotch: purple spots with yellow edges", "करपा: पिवळ्या कडांचे जांभळे ठिपके"]]),
    stage("bulb-initiation", ["Bulb starts forming", "कांदा धरू लागतो"], 95, 110, ["The base of the plant starts to swell into a bulb.", "रोपाचा बुंधा फुगून कांदा तयार होऊ लागतो."], [
      t("on-irr3", 96, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Keep moisture even. Dry, then very wet soil makes bulbs split.", "ओलावा सारखा ठेवा. आधी कोरडी व मग खूप ओली जमीन झाल्यास कांदा फुटतो."], 7),
      t("on-obs3", 98, "observation", ["Check for thrips and blotch", "फुलकिडे व करपा तपासा"], ["Damage to leaves now directly reduces bulb size.", "आता पानांचे नुकसान झाल्यास थेट कांद्याचा आकार कमी होतो."], 7),
    ], [["Thrips and purple blotch", "फुलकिडे व करपा"]]),
    stage("bulb-development", ["Bulb development", "कांदा पोसणे"], 110, 140, ["Bulbs fill and grow to full size.", "कांदा भरतो आणि पूर्ण आकाराचा होतो."], [
      t("on-irr4", 110, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water is most important now. Avoid long gaps.", "आता नियमित पाणी सर्वात महत्त्वाचे. मोठा खंड पडू देऊ नका."], 7),
      t("on-obs4", 112, "observation", ["Check the crop", "पीक तपासा"], ["Look at leaves for pests and spots. Don't add nitrogen now — it spoils storage.", "पानांवर कीड व ठिपके पाहा. आता नत्र देऊ नका — साठवण खराब होते."], 7),
    ], [["Stemphylium blight in cloudy, humid weather", "ढगाळ, दमट हवामानात स्टेमफिलियम करपा"], ["Split or double bulbs from uneven watering", "अनियमित पाण्याने फुटलेले किंवा जोड कांदे"]]),
    stage("maturity", ["Maturity (neck fall)", "पक्वता (मान पडणे)"], 140, 150, ["Necks go soft and leaves start falling over.", "मान नरम होते आणि पात पडू लागते."], [
      t("on-stop", 140, "other", ["Stop irrigation", "पाणी बंद करा"], ["Stop watering 10–15 days before harvest. Bulbs then store better.", "काढणीपूर्वी 10–15 दिवस पाणी बंद करा. मग कांदा जास्त दिवस टिकतो."]),
      t("on-neck", 144, "observation", ["Check neck fall", "मान पडली का पाहा"], ["When about half the tops have fallen over, plan the harvest.", "साधारण निम्मी पात पडली की काढणीचे नियोजन करा."]),
    ], [["Neck rot if it rains at harvest time", "काढणीच्या वेळी पाऊस आल्यास मान कुजणे"]]),
    stage("harvest", ["Harvest", "काढणी"], 150, 158, ["Bulbs are pulled out of the field.", "कांदे शेतातून काढले जातात."], [
      t("on-harv", 150, "harvest", ["Harvest the onions", "कांदा काढा"], ["Pull bulbs and leave them in the field 3–4 days, with leaves covering the bulbs from sun.", "कांदे उपटून 3–4 दिवस शेतातच ठेवा; पातीने कांदा उन्हापासून झाका."]),
      t("on-hsort", 154, "observation", ["Sort out damaged bulbs", "खराब कांदे वेगळे करा"], ["Remove cut, bruised and rotting bulbs before curing so they don't spoil the rest.", "सुकवणीपूर्वी कापलेले, दबलेले व सडके कांदे काढा, म्हणजे बाकीचे खराब होत नाहीत."]),
    ], [["Sunburn on bulbs left uncovered", "उघड्या कांद्याला ऊन लागणे"]]),
    stage("curing", ["Curing & storage", "सुकवणी व साठवण"], 158, 170, ["Bulbs dry their necks and skins so they keep for months.", "कांद्याची मान व साल सुकते, म्हणजे तो महिनोन्महिने टिकतो."], [
      t("on-cure", 158, "other", ["Cut tops and cure in shade", "पात कापून सावलीत सुकवा"], ["Cut leaves leaving 2–3 cm of neck. Keep in shade until necks are fully dry.", "मानेचा 2–3 सेंमी भाग ठेवून पात कापा. मान पूर्ण सुकेपर्यंत सावलीत ठेवा."]),
      t("on-grade", 166, "other", ["Grade and store", "प्रतवारी करून साठवा"], ["Remove damaged, double and sprouted bulbs. Store in an airy onion store (kanda chawl), not in heaps.", "खराब, जोड व मोड आलेले कांदे वेगळे करा. ढीग न करता हवेशीर कांदा चाळीत साठवा."]),
    ], [["Rotting from damaged or wet bulbs", "खराब किंवा ओल्या कांद्यांमुळे सडणे"]]),
  ],
  commonProblems: [
    { name: b("Thrips", "फुलकिडे"), signs: b("Silvery streaks on leaves, tips dry and twist.", "पानांवर चंदेरी रेषा, शेंडे सुकतात व पिळवटतात."), prevention: prevent("Check leaves weekly. Keep the field weed-free. Sticky blue traps help you see them early.", "दर आठवड्याला पाने तपासा. शेत तणमुक्त ठेवा. निळे चिकट सापळे लवकर ओळखायला मदत करतात.") },
    { name: b("Purple blotch", "करपा (जांभळा)"), signs: b("Small white spots that turn purple with yellow edges.", "लहान पांढरे ठिपके जे पिवळ्या कडांसह जांभळे होतात."), prevention: prevent("Avoid wetting leaves late in the day and give balanced nutrition.", "संध्याकाळी पाने ओली करणे टाळा व संतुलित खत द्या.") },
    { name: b("Bolting (flower stalks)", "फुलांचे दांडे येणे"), signs: b("A hard flower stalk grows from the centre.", "मधोमध कडक फुलांचा दांडा येतो."), prevention: b("Use seedlings of the right age and sow in the right season.", "योग्य वयाची रोपे वापरा व योग्य हंगामात पेरणी करा.") },
    { name: b("Stemphylium blight", "स्टेमफिलियम करपा"), signs: b("Yellow to brown, long patches on one side of the leaves; leaves dry from the tip, mostly in cloudy, humid weather.", "पानांच्या एका बाजूला पिवळसर ते तपकिरी लांबट चट्टे; पाने टोकाकडून सुकतात, बहुतेक ढगाळ, दमट हवामानात."), prevention: prevent("Keep the field well drained, avoid excess nitrogen, remove crop leftovers and rotate with non-onion crops.", "शेतात पाण्याचा चांगला निचरा ठेवा, जास्त नत्र टाळा, पिकाचे अवशेष काढा आणि कांदा-लसूण सोडून इतर पिकांशी फेरपालट करा.") },
  ],
  harvestSigns: b("About half the tops have fallen over and necks are soft.", "साधारण निम्मी पात पडली आहे आणि माना नरम झाल्या आहेत."),
  postHarvest: b(
    "Cure in shade until necks are dry. Cut tops leaving 2–3 cm. Grade by size, remove damaged bulbs, and store in an airy kanda chawl.",
    "मान सुकेपर्यंत सावलीत सुकवा. 2–3 सेंमी मान ठेवून पात कापा. आकारानुसार प्रतवारी करा, खराब कांदे काढा आणि हवेशीर कांदा चाळीत साठवा.",
  ),
  marketTips: b(
    "Graded, well-cured onions get better prices. Rabi onion stores for months, so you can wait for a better rate. Selling together with other farmers through your Mandi Mitra lowers transport cost.",
    "प्रतवारी केलेल्या व चांगल्या सुकवलेल्या कांद्याला जास्त दर मिळतो. रब्बी कांदा महिनोन्महिने टिकतो, त्यामुळे चांगल्या दरासाठी थांबता येते. मंडी मित्रामार्फत इतर शेतकऱ्यांसोबत विकल्यास वाहतूक खर्च कमी होतो.",
  ),
  varieties: [
    { name: "N-2-4-1", spoken: b("N two four one", "एन दोन चार एक"), note: b("Rabi onion with good storage life (MPKV)", "चांगली साठवण क्षमता असलेला रब्बी कांदा (मफुकृवि)") },
    { name: "Bhima Super", spoken: b("Bheema Super", "भीमा सुपर"), note: b("Red onion for kharif and late kharif (ICAR-DOGR)", "खरीप व उशिरा खरीपासाठी लाल कांदा (ICAR-DOGR)") },
    { name: "Bhima Shakti", spoken: b("Bheema Shakti", "भीमा शक्ती"), note: b("Rabi and late kharif; stores well (ICAR-DOGR)", "रब्बी व उशिरा खरीप; चांगला टिकतो (ICAR-DOGR)") },
    { name: "Phule Samarth", spoken: b("Phoolay Samarth", "फुले समर्थ"), note: b("Kharif and late kharif onion (MPKV)", "खरीप व उशिरा खरीप कांदा (मफुकृवि)") },
  ],
  source: "General practices from ICAR-DOGR and MPKV Rahuri onion guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
