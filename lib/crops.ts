/**
 * Crop Library — static, curated crop knowledge for Maharashtra.
 *
 * TODO(pilot): an agronomist must review all of this content, including the stage day ranges and
 * the Marathi text, before pilot use. Until then every crop has `lastVerified: null` and the UI
 * shows "Not yet verified — general guidance".
 *
 * Content rules: simple words, local units, general practices only. Never a chemical name with a
 * dose — pests and diseases say what to look for and how to prevent them, then send the farmer to
 * the KVK / agriculture officer and the product label.
 *
 * Day numbers count from sowing (for transplanted crops, from sowing the nursery). Stages are
 * written for the crop's longest season; lib/lifecycle.ts scales them for shorter seasons.
 */
import type { CropInfo, CropStage, Season, StageTask } from "./types";

// no runtime imports, so this file also runs under `node` for lib/lifecycle.check.ts
const b = (en: string, mr: string) => ({ en, mr });

/** Added to every pest/disease prevention note. */
const ASK = b(
  "Ask your KVK or agriculture officer for the right product and dose, follow the label, and wear protection while spraying.",
  "योग्य औषध व मात्रा कृषी विज्ञान केंद्र किंवा कृषी अधिकाऱ्यांना विचारा, लेबलवरील सूचना पाळा आणि फवारणी करताना संरक्षक कपडे घाला.",
);
const prevent = (en: string, mr: string) => b(`${en} ${ASK.en}`, `${mr} ${ASK.mr}`);

const t = (id: string, dayOffset: number, type: StageTask["type"], title: [string, string], detail: [string, string], repeatEveryDays?: number): StageTask => ({
  id,
  dayOffset,
  type,
  title: b(...title),
  detail: b(...detail),
  ...(repeatEveryDays ? { repeatEveryDays } : {}),
});
const stage = (key: string, name: [string, string], startDay: number, endDay: number, whatHappens: [string, string], tasks: StageTask[], watchFor: [string, string][]): CropStage => ({
  key,
  name: b(...name),
  startDay,
  endDay,
  whatHappens: b(...whatHappens),
  tasks,
  watchFor: watchFor.map((w) => b(...w)),
});

// ---- Onion (most detailed reference entry) -----------------------------------------------------

const onion: CropInfo = {
  id: "onion",
  emoji: "🧅",
  name: b("Onion", "कांदा"),
  aliases: ["onion", "kanda", "kaanda", "pyaz", "pyaj", "कांदा", "कांदे", "प्याज"],
  category: "vegetable",
  seasons: [
    { season: "kharif", label: b("Kharif", "खरीप"), sowingWindow: b("Nursery in May–June", "रोपवाटिका मे–जून"), sowingMonths: [5, 6], durationDays: [135, 150] },
    { season: "kharif", label: b("Late kharif (rangda)", "उशिरा खरीप (रांगडा)"), sowingWindow: b("Nursery in August–September", "रोपवाटिका ऑगस्ट–सप्टेंबर"), sowingMonths: [8, 9], durationDays: [145, 165] },
    { season: "rabi", label: b("Rabi", "रब्बी"), sowingWindow: b("Nursery in October–November", "रोपवाटिका ऑक्टोबर–नोव्हेंबर"), sowingMonths: [10, 11], durationDays: [150, 170] },
  ],
  method: "transplant",
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
  source: "General practices from ICAR-DOGR and MPKV Rahuri onion guidance",
  lastVerified: null,
};

// ---- Tomato -----------------------------------------------------------------------------------

const tomato: CropInfo = {
  id: "tomato",
  emoji: "🍅",
  name: b("Tomato", "टोमॅटो"),
  aliases: ["tomato", "tamatar", "tomatar", "टोमॅटो", "टमाटर", "टोमाटो"],
  category: "vegetable",
  seasons: [
    { season: "kharif", sowingWindow: b("Nursery in May–June", "रोपवाटिका मे–जून"), sowingMonths: [5, 6], durationDays: [130, 150] },
    { season: "rabi", sowingWindow: b("Nursery in September–October", "रोपवाटिका सप्टेंबर–ऑक्टोबर"), sowingMonths: [9, 10], durationDays: [130, 150] },
    { season: "summer", sowingWindow: b("Nursery in December–January", "रोपवाटिका डिसेंबर–जानेवारी"), sowingMonths: [12, 1], durationDays: [120, 140] },
  ],
  method: "transplant",
  nurseryDays: 28,
  soil: b("Well-drained loamy or medium black soil with good organic matter.", "सेंद्रिय पदार्थ असलेली, पाण्याचा निचरा होणारी पोयट्याची किंवा मध्यम काळी जमीन."),
  climate: b("Mild weather. Very hot days or frost drop flowers.", "सौम्य हवामान. खूप उष्ण दिवस किंवा थंडीने फुले गळतात."),
  seedRate: b("About 100–150 g seed per acre for the nursery (hybrids need less).", "रोपवाटिकेसाठी एकरी साधारण 100–150 ग्रॅम बियाणे (संकरित वाणाला कमी)."),
  spacing: b("90 cm between rows, 30–45 cm between plants (wider for tall hybrids).", "ओळींत 90 सेंमी, रोपांत 30–45 सेंमी (उंच संकरित वाणासाठी जास्त)."),
  irrigation: b("Light and frequent at first, then every 5–6 days. Even moisture at flowering and fruiting prevents flower drop and fruit cracking.", "सुरुवातीला हलके व वारंवार, नंतर दर 5–6 दिवसांनी. फुलोरा व फळधारणेत सारखा ओलावा ठेवल्यास फुलगळ व फळे तडकणे टळते."),
  nutrientGuide: b("Use a soil test. Add compost before planting. Give nitrogen in parts as the crop grows. Ask your agriculture officer for amounts.", "माती परीक्षण करा. लागवडीपूर्वी कंपोस्ट मिसळा. पीक वाढेल तसे नत्र विभागून द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."),
  stages: [
    stage("nursery", ["Nursery", "रोपवाटिका"], 0, 28, ["Seedlings grow in nursery beds or trays.", "रोपवाटिकेत किंवा ट्रेमध्ये रोपे वाढतात."], [
      t("to-bed", 0, "sowing", ["Sow the nursery", "रोपवाटिका पेरा"], ["Sow in raised beds or trays with clean soil and compost.", "स्वच्छ माती व कंपोस्ट असलेल्या गादीवाफ्यावर किंवा ट्रेमध्ये पेरा."]),
      t("to-water", 1, "irrigation", ["Water the nursery lightly", "रोपवाटिकेला हलके पाणी"], ["Keep moist, not soggy.", "ओलसर ठेवा, चिखल नको."], 3),
      t("to-harden", 21, "observation", ["Harden the seedlings", "रोपे कणखर करा"], ["Give less water for a week before transplanting so seedlings get stronger.", "पुनर्लागवडीपूर्वी आठवडाभर कमी पाणी द्या, म्हणजे रोपे कणखर होतात."]),
    ], [["Damping off", "रोपे कोलमडणे"], ["Whitefly on seedlings", "रोपांवर पांढरी माशी"]]),
    stage("establishment", ["Transplanting & establishment", "पुनर्लागवड व स्थिरावणे"], 28, 42, ["Seedlings are planted in the field and take root.", "रोपे शेतात लावली जातात आणि मूळ धरतात."], [
      t("to-tp", 28, "transplanting", ["Transplant", "पुनर्लागवड करा"], ["Plant in the evening and water right after.", "संध्याकाळी लावा व लगेच पाणी द्या."]),
      t("to-irr1", 29, "irrigation", ["Irrigate lightly", "हलके पाणी द्या"], ["Keep the root zone moist until plants settle.", "रोपे स्थिरावेपर्यंत मुळांजवळ ओलावा ठेवा."], 5),
      t("to-gap", 35, "other", ["Fill the gaps", "खाडे भरा"], ["Replace dead or virus-looking plants.", "मेलेली किंवा विषाणूग्रस्त दिसणारी रोपे बदला."]),
    ], [["Plants with curled, yellow leaves (leaf curl virus)", "आकसलेली पिवळी पाने (पर्णगुच्छ विषाणू)"]]),
    stage("vegetative", ["Plant growth", "रोपांची वाढ"], 42, 60, ["Stems and leaves grow; plants need support.", "खोड व पाने वाढतात; रोपांना आधार लागतो."], [
      t("to-irr2", 42, "irrigation", ["Irrigate", "पाणी द्या"], ["Water at the base, not on the leaves.", "पानांवर नव्हे, मुळांजवळ पाणी द्या."], 6),
      t("to-obs1", 44, "observation", ["Check leaves", "पाने तपासा"], ["Look under leaves for whitefly; remove plants with curled leaves.", "पानांखाली पांढरी माशी पाहा; आकसलेली पाने असलेली रोपे काढा."], 7),
      t("to-stake", 45, "other", ["Give support (staking)", "आधार द्या"], ["Use stakes or wire and string so fruits stay off the soil.", "फळे मातीला लागू नयेत म्हणून काठ्या किंवा तार-दोरीचा आधार द्या."]),
      t("to-weed", 48, "weeding", ["Weeding", "खुरपणी"], ["Remove weeds near plants.", "रोपांजवळील तण काढा."]),
      t("to-fert", 50, "fertiliser", ["Top dressing", "वरखत"], ["Give the next nutrient part as per your soil test. Ask your agriculture officer for amounts.", "माती परीक्षणानुसार पुढचा खत हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Whitefly and leaf curl", "पांढरी माशी व पर्णगुच्छ"], ["Early blight: brown rings on old leaves", "लवकर करपा: जुन्या पानांवर तपकिरी वर्तुळे"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 60, 80, ["Flowers open and first fruits set.", "फुले उमलतात आणि पहिली फळे धरतात."], [
      t("to-irr3", 60, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Water stress now drops flowers.", "आता पाण्याचा ताण आल्यास फुले गळतात."], 5),
      t("to-trap", 62, "observation", ["Set traps for fruit borer", "फळ पोखरणाऱ्या अळीसाठी सापळे"], ["Pheromone traps show when the pest arrives. Ask your KVK which trap to use.", "कामगंध सापळ्यांमुळे कीड कधी आली ते कळते. कोणता सापळा वापरायचा ते कृषी विज्ञान केंद्राला विचारा."]),
      t("to-obs2", 64, "observation", ["Check flowers and young fruit", "फुले व कोवळी फळे तपासा"], ["Look for small holes and caterpillars.", "लहान छिद्रे व अळ्या आहेत का ते पाहा."], 7),
    ], [["Fruit borer", "फळ पोखरणारी अळी"], ["Flower drop in heat", "उष्णतेत फुलगळ"]]),
    stage("fruiting", ["Fruit development", "फळांची वाढ"], 80, 100, ["Fruits grow and start to colour.", "फळे वाढतात व रंग धरू लागतात."], [
      t("to-irr4", 80, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even water stops fruit cracking and black bottoms.", "सारख्या पाण्याने फळे तडकणे व खालून काळी होणे थांबते."], 5),
      t("to-obs3", 82, "observation", ["Remove bored fruits", "पोखरलेली फळे काढा"], ["Pick and destroy fruits with holes so the pest doesn't multiply.", "छिद्र असलेली फळे तोडून नष्ट करा, म्हणजे कीड वाढत नाही."], 7),
    ], [["Fruit cracking", "फळे तडकणे"], ["Late blight in cool, humid weather", "थंड दमट हवामानात उशिरा करपा"]]),
    stage("harvest", ["Harvest (pickings)", "तोडणी"], 100, 150, ["Fruits are picked every few days.", "दर काही दिवसांनी फळांची तोडणी होते."], [
      t("to-pick", 100, "harvest", ["Pick fruits", "फळांची तोडणी करा"], ["Pick at turning colour for far markets, fully red for local sale.", "दूरच्या बाजारासाठी रंग बदलताना, स्थानिक विक्रीसाठी पूर्ण लाल झाल्यावर तोडा."], 4),
      t("to-irr5", 101, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep watering lightly between pickings.", "तोडण्यांच्या मध्ये हलके पाणी देत राहा."], 6),
      t("to-grade", 103, "other", ["Grade fruits", "फळांची प्रतवारी करा"], ["Sort by size and colour; remove damaged fruit.", "आकार व रंगानुसार वेगळी करा; खराब फळे काढा."], 14),
    ], [["Check pre-harvest waiting days on any product label before picking", "तोडणीपूर्वी वापरलेल्या औषधाच्या लेबलवरील काढणीपूर्व कालावधी तपासा"]]),
  ],
  commonProblems: [
    { name: b("Leaf curl virus", "पर्णगुच्छ (लीफ कर्ल)"), signs: b("Leaves curl, plants stay small and yellow. Spread by whitefly.", "पाने आकसतात, रोपे खुजी व पिवळी राहतात. पांढऱ्या माशीमुळे पसरतो."), prevention: prevent("Use healthy seedlings, remove infected plants early and keep weeds down.", "निरोगी रोपे वापरा, बाधित रोपे लवकर काढा व तण कमी ठेवा.") },
    { name: b("Fruit borer", "फळ पोखरणारी अळी"), signs: b("Round holes in fruit with droppings.", "फळांवर गोल छिद्रे व विष्ठा."), prevention: prevent("Use pheromone traps, and pick and destroy bored fruits.", "कामगंध सापळे वापरा आणि पोखरलेली फळे तोडून नष्ट करा.") },
    { name: b("Early and late blight", "लवकर व उशिरा करपा"), signs: b("Brown spots with rings on leaves; dark patches on fruit.", "पानांवर वर्तुळांचे तपकिरी ठिपके; फळांवर काळपट चट्टे."), prevention: prevent("Give space for air, water at the base, and remove badly affected leaves.", "हवा खेळती राहील असे अंतर ठेवा, मुळांजवळ पाणी द्या व जास्त बाधित पाने काढा.") },
  ],
  harvestSigns: b("Fruits change from green to pink/red at the bottom.", "फळ खालून हिरव्यापासून गुलाबी/लाल होते."),
  postHarvest: b("Pick in cool hours, keep in shade, grade by size and colour, pack in crates — not sacks.", "थंड वेळेत तोडा, सावलीत ठेवा, आकार व रंगानुसार प्रतवारी करा, पोत्यात नव्हे तर क्रेटमध्ये भरा."),
  marketTips: b("Tomato prices change fast. Crates and grading reduce damage and get better rates. Plan pickings with your Mandi Mitra.", "टोमॅटोचे दर लवकर बदलतात. क्रेट व प्रतवारीमुळे नुकसान कमी होऊन चांगला दर मिळतो. मंडी मित्रासोबत तोडणीचे नियोजन करा."),
  source: "General practices from ICAR-IIHR and MPKV Rahuri vegetable guidance",
  lastVerified: null,
};

// ---- Soybean ----------------------------------------------------------------------------------

const soybean: CropInfo = {
  id: "soybean",
  emoji: "🫘",
  name: b("Soybean", "सोयाबीन"),
  aliases: ["soybean", "soyabean", "soya", "सोयाबीन", "सोयाबिन"],
  category: "oilseed",
  seasons: [{ season: "kharif", sowingWindow: b("June–July, after good rain", "जून–जुलै, चांगल्या पावसानंतर"), sowingMonths: [6, 7], durationDays: [95, 110] }],
  method: "direct",
  soil: b("Well-drained medium to deep black soil. Soybean dislikes standing water.", "पाण्याचा निचरा होणारी मध्यम ते भारी काळी जमीन. सोयाबीनला साचलेले पाणी चालत नाही."),
  climate: b("Warm and rainy kharif season.", "उबदार व पावसाळी खरीप हंगाम."),
  seedRate: b("25–30 kg seed per acre, depending on seed size.", "बियाण्याच्या आकारानुसार एकरी 25–30 किलो."),
  spacing: b("45 cm between rows, about 5 cm between plants.", "ओळींत 45 सेंमी, रोपांत साधारण 5 सेंमी."),
  irrigation: b("Mostly rainfed. If there is a long dry spell at flowering or pod filling, give protective irrigation if you can.", "मुख्यतः पावसावर. फुलोरा किंवा शेंगा भरताना पावसाचा मोठा खंड पडल्यास शक्य असल्यास संरक्षित पाणी द्या."),
  nutrientGuide: b("Use a soil test. Soybean makes some of its own nitrogen; seed treatment with bio-fertiliser helps — ask your KVK.", "माती परीक्षण करा. सोयाबीन काही नत्र स्वतः तयार करते; जैविक खताची बीजप्रक्रिया उपयोगी — कृषी विज्ञान केंद्राला विचारा."),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 12, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("sb-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow after 75–100 mm of rain, 3–5 cm deep. Ask your KVK about seed treatment.", "75–100 मिमी पावसानंतर 3–5 सेंमी खोल पेरा. बीजप्रक्रियेबद्दल कृषी विज्ञान केंद्राला विचारा."]),
      t("sb-count", 8, "observation", ["Check germination", "उगवण तपासा"], ["Count plants in a metre of row; resow big gaps quickly.", "ओळीतील एका मीटरमध्ये रोपे मोजा; मोठे खाडे लगेच पुन्हा पेरा."]),
    ], [["Poor germination after dry spell", "पावसाच्या खंडानंतर कमी उगवण"]]),
    stage("vegetative", ["Plant growth", "रोपांची वाढ"], 12, 40, ["Leaves and branches grow.", "पाने व फांद्या वाढतात."], [
      t("sb-obs1", 14, "observation", ["Check the plants", "रोपे तपासा"], ["Look for ring cuts on stems (girdle beetle) and leaf-eating caterpillars.", "खोडावर कड्या (चक्रभुंगा) व पाने खाणाऱ्या अळ्या पाहा."], 7),
      t("sb-weed", 15, "weeding", ["Weeding", "खुरपणी"], ["Keep the field weed-free for the first 45 days.", "पहिले 45 दिवस शेत तणमुक्त ठेवा."], 15),
      t("sb-drain", 20, "other", ["Keep drains open", "चर मोकळे ठेवा"], ["Make sure rain water doesn't stand in the field.", "पावसाचे पाणी शेतात साचणार नाही याची काळजी घ्या."]),
    ], [["Girdle beetle", "चक्रभुंगा"], ["Leaf-eating caterpillars", "पाने खाणाऱ्या अळ्या"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 40, 60, ["Small flowers appear at the joints.", "पेऱ्यांवर लहान फुले येतात."], [
      t("sb-obs2", 42, "observation", ["Check for yellow mosaic", "पिवळा मोझॅक तपासा"], ["Yellow patches on leaves; remove such plants early.", "पानांवर पिवळे चट्टे; अशी रोपे लवकर काढा."], 7),
      t("sb-irr1", 45, "irrigation", ["Protective irrigation if dry", "कोरडे असल्यास संरक्षित पाणी"], ["Only if there has been no rain for 10–15 days and the soil is dry.", "10–15 दिवस पाऊस नसेल व जमीन कोरडी असेल तरच."]),
    ], [["Yellow mosaic", "पिवळा मोझॅक"]]),
    stage("pod", ["Pod formation & filling", "शेंगा लागणे व भरणे"], 60, 95, ["Pods form and seeds fill.", "शेंगा लागतात व दाणे भरतात."], [
      t("sb-obs3", 62, "observation", ["Check pods", "शेंगा तपासा"], ["Look for pod borers and pod blight.", "शेंगा पोखरणारी अळी व शेंगा करपा पाहा."], 7),
      t("sb-irr2", 70, "irrigation", ["Protective irrigation if dry", "कोरडे असल्यास संरक्षित पाणी"], ["Seed filling needs moisture during a long dry spell.", "पावसाच्या मोठ्या खंडात दाणे भरण्यासाठी ओलावा लागतो."]),
    ], [["Pod borer", "शेंगा पोखरणारी अळी"]]),
    stage("maturity", ["Maturity", "पक्वता"], 95, 103, ["Leaves turn yellow and drop; pods turn brown.", "पाने पिवळी होऊन गळतात; शेंगा तपकिरी होतात."], [
      t("sb-mat", 95, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Most pods brown and dry → plan the harvest.", "बहुतेक शेंगा तपकिरी व कोरड्या → काढणीचे नियोजन करा."]),
    ], [["Pods shattering if harvest is late", "उशिरा काढणी केल्यास शेंगा तडकणे"]]),
    stage("harvest", ["Harvest", "काढणी"], 103, 110, ["The crop is cut, dried and threshed.", "पीक कापून, वाळवून मळणी केली जाते."], [
      t("sb-harv", 103, "harvest", ["Harvest", "काढणी करा"], ["Cut, dry in the sun, thresh gently and store dry seed.", "कापा, उन्हात वाळवा, हळू मळणी करा व कोरडे दाणे साठवा."]),
    ], [["Rain at harvest spoils seed", "काढणीच्या वेळी पावसाने दाणे खराब होतात"]]),
  ],
  commonProblems: [
    { name: b("Girdle beetle", "चक्रभुंगा"), signs: b("Two ring cuts on the stem; top of plant wilts.", "खोडावर दोन कड्या; शेंडा मलूल होतो."), prevention: prevent("Remove and destroy affected plants early.", "बाधित रोपे लवकर काढून नष्ट करा.") },
    { name: b("Yellow mosaic", "पिवळा मोझॅक"), signs: b("Bright yellow patches on leaves; spread by whitefly.", "पानांवर पिवळे चट्टे; पांढऱ्या माशीमुळे पसरतो."), prevention: prevent("Use tolerant varieties and remove sick plants.", "सहनशील वाण वापरा व आजारी रोपे काढा.") },
  ],
  harvestSigns: b("Most pods turn brown and leaves fall.", "बहुतेक शेंगा तपकिरी होतात व पाने गळतात."),
  postHarvest: b("Dry seed well in the sun before storing in clean bags.", "स्वच्छ पोत्यांत साठवण्यापूर्वी दाणे उन्हात चांगले वाळवा."),
  marketTips: b("Clean, dry soybean gets a better rate. Check the support price before selling.", "स्वच्छ, कोरड्या सोयाबीनला चांगला दर मिळतो. विक्रीपूर्वी हमीभाव तपासा."),
  source: "General practices from ICAR-IISR and VNMKV Parbhani soybean guidance",
  lastVerified: null,
};

// ---- Cotton -----------------------------------------------------------------------------------

const cotton: CropInfo = {
  id: "cotton",
  emoji: "☁️",
  name: b("Cotton", "कापूस"),
  aliases: ["cotton", "kapus", "kapas", "कापूस", "कपास"],
  category: "fibre",
  seasons: [{ season: "kharif", sowingWindow: b("May–June (irrigated), June–July (rainfed)", "मे–जून (बागायती), जून–जुलै (कोरडवाहू)"), sowingMonths: [5, 6, 7], durationDays: [150, 180] }],
  method: "direct",
  soil: b("Deep black soil that holds water, with good drainage.", "पाणी धरून ठेवणारी, निचरा होणारी खोल काळी जमीन."),
  climate: b("Warm season with enough rain; dry weather at boll opening.", "पुरेसा पाऊस असलेला उबदार हंगाम; बोंडे फुटताना कोरडे हवामान."),
  seedRate: b("As written on the seed packet — hybrids usually 2 packets per acre.", "बियाण्याच्या पाकिटावर लिहिल्याप्रमाणे — संकरित वाणाला सहसा एकरी 2 पाकिटे."),
  spacing: b("90–120 cm between rows, 45–60 cm between plants, as per variety.", "वाणानुसार ओळींत 90–120 सेंमी, रोपांत 45–60 सेंमी."),
  irrigation: b("Rainfed in most areas. If irrigated, water at flowering and boll development when soil is dry.", "बहुतेक भागात कोरडवाहू. बागायती असल्यास फुलोरा व बोंडे वाढताना जमीन कोरडी झाल्यावर पाणी द्या."),
  nutrientGuide: b("Use a soil test. Add farmyard manure before sowing. Give nitrogen in parts. Ask your agriculture officer for amounts.", "माती परीक्षण करा. पेरणीपूर्वी शेणखत मिसळा. नत्र विभागून द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 15, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("ct-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow after good rain on ridges or beds.", "चांगल्या पावसानंतर सरीवर किंवा वाफ्यावर पेरा."]),
      t("ct-gap", 10, "other", ["Fill gaps and thin", "खाडे भरा व विरळणी करा"], ["Resow missing spots; keep one healthy plant per spot.", "उगवण न झालेल्या जागी पुन्हा पेरा; प्रत्येक जागी एक निरोगी रोप ठेवा."]),
    ], [["Poor germination", "कमी उगवण"]]),
    stage("vegetative", ["Plant growth & squares", "वाढ व पात्या"], 15, 55, ["Plants grow and form flower buds (squares).", "रोपे वाढतात आणि पात्या (फुलांच्या कळ्या) येतात."], [
      t("ct-obs1", 18, "observation", ["Check under leaves", "पानांखाली तपासा"], ["Look for sucking pests: aphids, jassids, whitefly.", "रसशोषक किडी पाहा: मावा, तुडतुडे, पांढरी माशी."], 7),
      t("ct-weed", 20, "weeding", ["Weeding", "खुरपणी"], ["Weed or hoe between rows.", "ओळींमध्ये खुरपणी किंवा कोळपणी करा."], 20),
      t("ct-irr1", 25, "irrigation", ["Irrigate if dry", "कोरडे असल्यास पाणी द्या"], ["Only if there is no rain and soil is dry.", "पाऊस नसेल व जमीन कोरडी असेल तरच."], 12),
      t("ct-fert", 30, "fertiliser", ["Top dressing", "वरखत"], ["Next nutrient part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार पुढचा खत हप्ता. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Sucking pests", "रसशोषक किडी"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 55, 90, ["Flowers open and small bolls form.", "फुले उमलतात व लहान बोंडे लागतात."], [
      t("ct-trap", 56, "observation", ["Set pheromone traps", "कामगंध सापळे लावा"], ["Traps show when pink bollworm arrives. Ask your KVK for the right trap.", "गुलाबी बोंडअळी कधी आली ते सापळ्यांमुळे कळते. योग्य सापळ्यासाठी कृषी विज्ञान केंद्राला विचारा."]),
      t("ct-obs2", 57, "observation", ["Check flowers", "फुले तपासा"], ["Flowers that stay closed like a rose (rosette) can hide pink bollworm.", "गुलाबासारखी बंद राहिलेली फुले (डोमकळी) गुलाबी बोंडअळीची असू शकतात."], 7),
      t("ct-irr2", 60, "irrigation", ["Irrigate if dry", "कोरडे असल्यास पाणी द्या"], ["Water stress drops flowers and small bolls.", "पाण्याच्या ताणाने फुले व लहान बोंडे गळतात."], 12),
    ], [["Pink bollworm", "गुलाबी बोंडअळी"], ["Flower and boll drop", "फुले व बोंडे गळणे"]]),
    stage("boll", ["Boll development", "बोंडांची वाढ"], 90, 140, ["Bolls grow and fill with cotton.", "बोंडे वाढतात व कापसाने भरतात."], [
      t("ct-obs3", 91, "observation", ["Check bolls", "बोंडे तपासा"], ["Open a few green bolls and look for larvae inside.", "काही हिरवी बोंडे फोडून आत अळ्या आहेत का पाहा."], 7),
      t("ct-irr3", 95, "irrigation", ["Irrigate if dry", "कोरडे असल्यास पाणी द्या"], ["Light water helps bolls fill in a dry spell.", "पावसाच्या खंडात हलके पाणी बोंडे भरायला मदत करते."], 14),
    ], [["Bollworms", "बोंडअळ्या"]]),
    stage("picking", ["Boll opening & picking", "बोंडे फुटणे व वेचणी"], 140, 180, ["Bolls open and cotton is picked in rounds.", "बोंडे फुटतात आणि फेऱ्यांमध्ये कापूस वेचला जातो."], [
      t("ct-pick", 140, "harvest", ["Pick cotton", "कापूस वेचा"], ["Pick fully opened bolls in dry hours. Keep clean cotton separate from dirty cotton.", "पूर्ण फुटलेली बोंडे कोरड्या वेळेत वेचा. स्वच्छ कापूस खराब कापसापासून वेगळा ठेवा."], 15),
      t("ct-clean", 175, "other", ["Destroy old plants", "जुनी झाडे नष्ट करा"], ["After the last picking, uproot and destroy stalks. This reduces pink bollworm next year.", "शेवटच्या वेचणीनंतर पऱ्हाट्या उपटून नष्ट करा. पुढच्या वर्षी गुलाबी बोंडअळी कमी होते."]),
    ], [["Keeping the crop too long feeds pink bollworm", "पीक जास्त दिवस ठेवल्यास गुलाबी बोंडअळी वाढते"]]),
  ],
  commonProblems: [
    { name: b("Pink bollworm", "गुलाबी बोंडअळी"), signs: b("Rosette flowers, holes in bolls, stained lint.", "डोमकळी, बोंडांना छिद्रे, डागाळलेला कापूस."), prevention: prevent("Use pheromone traps, remove rosette flowers, and destroy stalks after the season.", "कामगंध सापळे वापरा, डोमकळ्या काढा आणि हंगामानंतर पऱ्हाट्या नष्ट करा.") },
    { name: b("Sucking pests", "रसशोषक किडी"), signs: b("Leaves curl and turn yellow or reddish at edges.", "पाने आकसतात व कडांना पिवळी किंवा लालसर होतात."), prevention: prevent("Check under leaves weekly; keep the field weed-free.", "दर आठवड्याला पानांखाली तपासा; शेत तणमुक्त ठेवा.") },
  ],
  harvestSigns: b("Bolls have fully opened and cotton is fluffy and dry.", "बोंडे पूर्ण फुटली आहेत आणि कापूस फुललेला व कोरडा आहे."),
  postHarvest: b("Dry picked cotton in shade, keep it clean and store away from dust and moisture.", "वेचलेला कापूस सावलीत वाळवा, स्वच्छ ठेवा आणि धूळ व ओलाव्यापासून दूर साठवा."),
  marketTips: b("Clean, dry cotton without trash gets a better rate. Check the support price.", "कचरा नसलेल्या स्वच्छ, कोरड्या कापसाला चांगला दर मिळतो. हमीभाव तपासा."),
  source: "General practices from ICAR-CICR Nagpur and Dr. PDKV Akola cotton guidance",
  lastVerified: null,
};

// ---- Tur (pigeon pea) -----------------------------------------------------------------------------

const tur: CropInfo = {
  id: "tur",
  emoji: "🌿",
  name: b("Tur (pigeon pea)", "तूर"),
  aliases: ["tur", "toor", "arhar", "pigeon pea", "pigeonpea", "तूर", "तुर", "अरहर"],
  category: "pulse",
  seasons: [{ season: "kharif", sowingWindow: b("June–July", "जून–जुलै"), sowingMonths: [6, 7], durationDays: [150, 180] }],
  method: "direct",
  soil: b("Well-drained medium to deep soil. Does not like standing water.", "पाण्याचा निचरा होणारी मध्यम ते भारी जमीन. साचलेले पाणी चालत नाही."),
  climate: b("Kharif rains for growth, dry weather at pod maturity.", "वाढीसाठी खरीप पाऊस, शेंगा पक्व होताना कोरडे हवामान."),
  seedRate: b("5–6 kg seed per acre (less when grown as an intercrop).", "एकरी 5–6 किलो बियाणे (आंतरपिकात कमी)."),
  spacing: b("90–120 cm between rows, about 20 cm between plants.", "ओळींत 90–120 सेंमी, रोपांत साधारण 20 सेंमी."),
  irrigation: b("Mostly rainfed. One irrigation at flowering and one at pod filling helps if the soil is dry.", "मुख्यतः पावसावर. जमीन कोरडी असल्यास फुलोऱ्यात व शेंगा भरताना एकेक पाणी उपयोगी."),
  nutrientGuide: b("Use a soil test. A pulse needs little nitrogen; bio-fertiliser seed treatment helps — ask your KVK.", "माती परीक्षण करा. कडधान्याला कमी नत्र लागते; जैविक खताची बीजप्रक्रिया उपयोगी — कृषी विज्ञान केंद्राला विचारा."),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 15, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("tu-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow in rows; tur is often grown between soybean or cotton rows.", "ओळीत पेरा; तूर अनेकदा सोयाबीन किंवा कापसाच्या ओळींमध्ये घेतात."]),
      t("tu-gap", 10, "other", ["Fill gaps", "खाडे भरा"], ["Resow missing spots.", "उगवण न झालेल्या जागी पुन्हा पेरा."]),
    ], [["Poor germination", "कमी उगवण"]]),
    stage("vegetative", ["Plant growth", "रोपांची वाढ"], 15, 75, ["Plants grow tall and branch out.", "रोपे उंच वाढतात व फांद्या फुटतात."], [
      t("tu-weed", 20, "weeding", ["Weeding", "खुरपणी"], ["Keep the field weed-free while plants are young.", "रोपे लहान असताना शेत तणमुक्त ठेवा."], 20),
      t("tu-obs1", 21, "observation", ["Check plants", "रोपे तपासा"], ["Look for wilting plants (wilt) and webbed leaves.", "मलूल होणारी रोपे (मर) व जाळी लागलेली पाने पाहा."], 10),
      t("tu-nip", 45, "other", ["Nip the tops", "शेंडे खुडा"], ["Nipping the top bud gives more branches — do it if advised locally.", "शेंडा खुडल्याने जास्त फांद्या येतात — स्थानिक सल्ला असल्यास करा."]),
    ], [["Wilt", "मर रोग"], ["Leaf webber", "पाने गुंडाळणारी अळी"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 75, 110, ["Yellow flowers appear and first pods form.", "पिवळी फुले येतात व पहिल्या शेंगा लागतात."], [
      t("tu-obs2", 76, "observation", ["Check flowers and pods", "फुले व शेंगा तपासा"], ["Look for pod borer caterpillars and pod fly.", "शेंगा पोखरणारी अळी व शेंगमाशी पाहा."], 7),
      t("tu-irr1", 80, "irrigation", ["Irrigate if dry", "कोरडे असल्यास पाणी द्या"], ["One irrigation at flowering helps if water is available.", "पाणी उपलब्ध असल्यास फुलोऱ्यात एक पाणी उपयोगी."]),
    ], [["Pod borer", "शेंगा पोखरणारी अळी"]]),
    stage("pod", ["Pod filling", "शेंगा भरणे"], 110, 150, ["Seeds fill inside the pods.", "शेंगांमध्ये दाणे भरतात."], [
      t("tu-obs3", 111, "observation", ["Check pods", "शेंगा तपासा"], ["Look for holes in pods.", "शेंगांना छिद्रे आहेत का पाहा."], 7),
      t("tu-irr2", 115, "irrigation", ["Light irrigation if dry", "कोरडे असल्यास हलके पाणी"], ["Helps seeds fill in a dry spell.", "पावसाच्या खंडात दाणे भरायला मदत."]),
    ], [["Pod fly", "शेंगमाशी"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 150, 180, ["Pods turn brown and dry.", "शेंगा तपकिरी होऊन वाळतात."], [
      t("tu-mat", 150, "observation", ["Check if ready", "तयार आहे का पाहा"], ["When 75–80% of pods are brown, plan the harvest.", "75–80% शेंगा तपकिरी झाल्या की काढणीचे नियोजन करा."]),
      t("tu-harv", 155, "harvest", ["Harvest", "काढणी करा"], ["Cut plants, dry in the sun and thresh.", "झाडे कापा, उन्हात वाळवा व मळणी करा."]),
    ], [["Storage pests (pulse beetle)", "साठवणीतील किडी (भुंगेरे)"]]),
  ],
  commonProblems: [
    { name: b("Pod borer", "शेंगा पोखरणारी अळी"), signs: b("Holes in pods; caterpillars eat seeds inside.", "शेंगांना छिद्रे; अळ्या आतील दाणे खातात."), prevention: prevent("Put T-shaped bird perches and check pods weekly.", "T आकाराचे पक्षी थांबे लावा व दर आठवड्याला शेंगा तपासा.") },
    { name: b("Wilt", "मर रोग"), signs: b("Plants dry suddenly while the soil is moist.", "जमीन ओलसर असूनही झाडे अचानक वाळतात."), prevention: b("Use resistant varieties and rotate crops; don't grow tur in the same field every year.", "प्रतिकारक वाण वापरा व फेरपालट करा; दरवर्षी त्याच शेतात तूर घेऊ नका.") },
  ],
  harvestSigns: b("Most pods are brown and dry; leaves fall.", "बहुतेक शेंगा तपकिरी व कोरड्या; पाने गळतात."),
  postHarvest: b("Dry grain well and store in clean, airtight containers to avoid beetles.", "धान्य चांगले वाळवा आणि भुंगेरे टाळण्यासाठी स्वच्छ, हवाबंद डब्यांत साठवा."),
  marketTips: b("Clean, graded tur gets a better rate. Check the support price.", "स्वच्छ, प्रतवारी केलेल्या तुरीला चांगला दर मिळतो. हमीभाव तपासा."),
  source: "General practices from ICAR-IIPR and VNMKV Parbhani pulse guidance",
  lastVerified: null,
};

// ---- Wheat ------------------------------------------------------------------------------------

const wheat: CropInfo = {
  id: "wheat",
  emoji: "🌾",
  name: b("Wheat", "गहू"),
  aliases: ["wheat", "gahu", "gehu", "gehun", "गहू", "गेहूं"],
  category: "cereal",
  seasons: [{ season: "rabi", sowingWindow: b("November (irrigated)", "नोव्हेंबर (बागायती)"), sowingMonths: [11], durationDays: [110, 125] }],
  method: "direct",
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
  ],
  harvestSigns: b("Grains are hard and the straw is golden and dry.", "दाणे टणक आहेत आणि काड सोनेरी व कोरडे आहे."),
  postHarvest: b("Dry grain well in the sun and store in clean, dry bags or bins.", "धान्य उन्हात चांगले वाळवा आणि स्वच्छ, कोरड्या पोत्यांत किंवा कोठीत साठवा."),
  marketTips: b("Clean, dry grain without stones gets a better rate. Check the support price.", "खडे नसलेल्या स्वच्छ, कोरड्या धान्याला चांगला दर मिळतो. हमीभाव तपासा."),
  source: "General practices from ICAR-IIWBR and MPKV Rahuri wheat guidance",
  lastVerified: null,
};

// ---- Chana (gram) -----------------------------------------------------------------------------

const chana: CropInfo = {
  id: "chana",
  emoji: "🟤",
  name: b("Chana (gram)", "हरभरा"),
  aliases: ["chana", "gram", "chickpea", "harbhara", "harbara", "हरभरा", "चना"],
  category: "pulse",
  seasons: [{ season: "rabi", sowingWindow: b("October–November", "ऑक्टोबर–नोव्हेंबर"), sowingMonths: [10, 11], durationDays: [95, 115] }],
  method: "direct",
  soil: b("Medium to deep black soil that holds moisture after the rains.", "पावसानंतर ओलावा धरून ठेवणारी मध्यम ते भारी काळी जमीन."),
  climate: b("Cool, dry winter. Heavy rain or cloudy weather at flowering harms the crop.", "थंड, कोरडा हिवाळा. फुलोऱ्यात जास्त पाऊस किंवा ढगाळ हवामान नुकसानकारक."),
  seedRate: b("25–35 kg seed per acre (more for bold-seeded varieties).", "एकरी 25–35 किलो बियाणे (टपोऱ्या दाण्याच्या वाणाला जास्त)."),
  spacing: b("30 cm between rows, about 10 cm between plants.", "ओळींत 30 सेंमी, रोपांत साधारण 10 सेंमी."),
  irrigation: b("Grows on stored soil moisture. If irrigated, give light water at branching and pod filling; avoid heavy water at flowering.", "जमिनीतील ओलाव्यावर येते. बागायती असल्यास फांद्या फुटताना व घाटे भरताना हलके पाणी; फुलोऱ्यात जास्त पाणी टाळा."),
  nutrientGuide: b("Use a soil test. A pulse needs little nitrogen; bio-fertiliser seed treatment helps — ask your KVK.", "माती परीक्षण करा. कडधान्याला कमी नत्र लागते; जैविक खताची बीजप्रक्रिया उपयोगी — कृषी विज्ञान केंद्राला विचारा."),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 15, ["Seeds sprout in moist soil.", "ओलसर जमिनीत बी रुजते."], [
      t("ch-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow in moist soil, 30 cm rows, 8–10 cm deep. Ask your KVK about seed treatment.", "ओलसर जमिनीत 30 सेंमी ओळीत, 8–10 सेंमी खोल पेरा. बीजप्रक्रियेबद्दल कृषी विज्ञान केंद्राला विचारा."]),
      t("ch-count", 10, "observation", ["Check germination", "उगवण तपासा"], ["Count plants and note big gaps.", "रोपे मोजा व मोठे खाडे नोंदवा."]),
    ], [["Poor germination in dry soil", "कोरड्या जमिनीत कमी उगवण"]]),
    stage("vegetative", ["Branching", "फांद्या फुटणे"], 15, 45, ["Plants branch out.", "रोपांना फांद्या फुटतात."], [
      t("ch-weed", 20, "weeding", ["Weeding", "खुरपणी"], ["Keep the field weed-free for the first 45 days.", "पहिले 45 दिवस शेत तणमुक्त ठेवा."], 15),
      t("ch-obs1", 21, "observation", ["Check plants", "रोपे तपासा"], ["Look for wilting yellow plants (wilt) and small caterpillars.", "पिवळी मलूल रोपे (मर) व लहान अळ्या पाहा."], 7),
      t("ch-nip", 30, "other", ["Nip the tops", "शेंडे खुडा"], ["Nipping tops (khudni) gives more branches and pods.", "शेंडे खुडल्याने (खुडणी) जास्त फांद्या व घाटे येतात."]),
      t("ch-irr1", 40, "irrigation", ["Light irrigation if dry", "कोरडे असल्यास हलके पाणी"], ["Only if irrigated and the soil is dry.", "बागायती असल्यास व जमीन कोरडी असल्यासच."]),
    ], [["Wilt", "मर रोग"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 45, 70, ["Flowers open and pods start.", "फुले उमलतात व घाटे लागू लागतात."], [
      t("ch-perch", 45, "other", ["Put up bird perches", "पक्षी थांबे लावा"], ["T-shaped sticks let birds sit and eat caterpillars.", "T आकाराच्या काठ्यांवर पक्षी बसून अळ्या खातात."]),
      t("ch-obs2", 46, "observation", ["Check for pod borer", "घाटेअळी तपासा"], ["Look for caterpillars and eaten leaves and pods.", "अळ्या व खाल्लेली पाने व घाटे पाहा."], 7),
    ], [["Pod borer (ghate ali)", "घाटेअळी"]]),
    stage("pod", ["Pod filling", "घाटे भरणे"], 70, 95, ["Seeds fill inside the pods.", "घाट्यांत दाणे भरतात."], [
      t("ch-obs3", 71, "observation", ["Check pods", "घाटे तपासा"], ["Look for holes in pods.", "घाट्यांना छिद्रे आहेत का पाहा."], 7),
      t("ch-irr3", 72, "irrigation", ["Light irrigation if dry", "कोरडे असल्यास हलके पाणी"], ["Light water helps pods fill.", "हलक्या पाण्याने घाटे भरतात."]),
    ], [["Pod borer", "घाटेअळी"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 95, 115, ["Leaves turn yellow and pods dry.", "पाने पिवळी होतात व घाटे वाळतात."], [
      t("ch-mat", 95, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Leaves yellow and pods dry → plan the harvest.", "पाने पिवळी व घाटे कोरडे → काढणीचे नियोजन करा."]),
      t("ch-harv", 100, "harvest", ["Harvest", "काढणी करा"], ["Cut or pull plants, dry and thresh.", "झाडे कापा किंवा उपटा, वाळवा व मळणी करा."]),
    ], [["Storage beetles", "साठवणीतील भुंगेरे"]]),
  ],
  commonProblems: [
    { name: b("Pod borer (ghate ali)", "घाटेअळी"), signs: b("Green caterpillars eat leaves and make holes in pods.", "हिरव्या अळ्या पाने खातात व घाट्यांना छिद्रे पाडतात."), prevention: prevent("Use bird perches and pheromone traps; check plants weekly.", "पक्षी थांबे व कामगंध सापळे वापरा; दर आठवड्याला तपासा.") },
    { name: b("Wilt", "मर रोग"), signs: b("Plants droop and dry in patches.", "रोपे गटागटाने मलूल होऊन वाळतात."), prevention: b("Use resistant varieties and rotate crops.", "प्रतिकारक वाण वापरा व पिकांची फेरपालट करा.") },
  ],
  harvestSigns: b("Leaves turn yellow-brown and pods are dry and rattle.", "पाने पिवळसर तपकिरी होतात आणि घाटे कोरडे होऊन खुळखुळतात."),
  postHarvest: b("Dry seed well and store in clean, airtight containers.", "दाणे चांगले वाळवा आणि स्वच्छ, हवाबंद डब्यांत साठवा."),
  marketTips: b("Clean, graded chana gets a better rate. Check the support price.", "स्वच्छ, प्रतवारी केलेल्या हरभऱ्याला चांगला दर मिळतो. हमीभाव तपासा."),
  source: "General practices from ICAR-IIPR and MPKV Rahuri gram guidance",
  lastVerified: null,
};

// ---- Jowar (sorghum) --------------------------------------------------------------------------

const jowar: CropInfo = {
  id: "jowar",
  emoji: "🌾",
  name: b("Jowar (sorghum)", "ज्वारी"),
  aliases: ["jowar", "jwari", "jvari", "sorghum", "ज्वारी", "जोवार", "ज्वार"],
  category: "cereal",
  seasons: [
    { season: "kharif", sowingWindow: b("June–July", "जून–जुलै"), sowingMonths: [6, 7], durationDays: [100, 115] },
    { season: "rabi", sowingWindow: b("September–October", "सप्टेंबर–ऑक्टोबर"), sowingMonths: [9, 10], durationDays: [110, 125] },
  ],
  method: "direct",
  soil: b("Medium to deep black soil; rabi jowar grows on stored moisture.", "मध्यम ते भारी काळी जमीन; रब्बी ज्वारी साठवलेल्या ओलाव्यावर येते."),
  climate: b("Kharif rains or rabi stored moisture; tolerates dry spells better than many crops.", "खरीप पाऊस किंवा रब्बीतील साठवलेला ओलावा; अनेक पिकांपेक्षा खंड जास्त सहन करते."),
  seedRate: b("About 4–5 kg seed per acre.", "एकरी साधारण 4–5 किलो बियाणे."),
  spacing: b("45 cm between rows, about 15 cm between plants.", "ओळींत 45 सेंमी, रोपांत साधारण 15 सेंमी."),
  irrigation: b("Rabi jowar benefits from irrigation at knee-high, flowering and grain filling stages if water is available.", "पाणी उपलब्ध असल्यास रब्बी ज्वारीला गुडघाभर उंची, फुलोरा व दाणे भरताना पाणी फायदेशीर."),
  nutrientGuide: b("Use a soil test. Add farmyard manure; give nitrogen in parts. Ask your agriculture officer for amounts.", "माती परीक्षण करा. शेणखत मिसळा; नत्र विभागून द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 12, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("jw-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow in 45 cm rows, 3–4 cm deep.", "45 सेंमी ओळीत, 3–4 सेंमी खोल पेरा."]),
      t("jw-thin", 10, "other", ["Thin the plants", "विरळणी करा"], ["Keep one healthy plant every 15 cm.", "दर 15 सेंमीवर एक निरोगी रोप ठेवा."]),
    ], [["Shoot fly in young plants", "कोवळ्या रोपांवर खोडमाशी"]]),
    stage("vegetative", ["Plant growth", "रोपांची वाढ"], 12, 50, ["Leaves and stem grow.", "पाने व खोड वाढते."], [
      t("jw-obs1", 13, "observation", ["Check young plants", "कोवळी रोपे तपासा"], ["Look for dead centre leaves (shoot fly) and holes in stems (stem borer).", "मधले पान वाळणे (खोडमाशी) व खोडाला छिद्रे (खोडकिडा) पाहा."], 7),
      t("jw-weed", 18, "weeding", ["Weeding", "खुरपणी"], ["Weed or hoe between rows.", "ओळींमध्ये खुरपणी किंवा कोळपणी करा."], 15),
      t("jw-fert", 30, "fertiliser", ["Top dressing", "वरखत"], ["Next nitrogen part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार नत्राचा पुढचा हप्ता. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
      t("jw-irr1", 35, "irrigation", ["Irrigation at knee-high stage", "गुडघाभर उंचीला पाणी"], ["Mainly for rabi jowar, if water is available.", "मुख्यतः रब्बी ज्वारीसाठी, पाणी उपलब्ध असल्यास."]),
    ], [["Stem borer", "खोडकिडा"]]),
    stage("flowering", ["Booting & flowering", "पोटरी व फुलोरा"], 50, 75, ["Earheads come out and flower.", "कणसे बाहेर येऊन फुलतात."], [
      t("jw-obs2", 51, "observation", ["Check earheads", "कणसे तपासा"], ["Look for midge and earhead bugs.", "मिज माशी व कणसावरील ढेकूण पाहा."], 7),
      t("jw-irr2", 55, "irrigation", ["Irrigation at flowering", "फुलोऱ्यात पाणी"], ["The most important irrigation, if water is available.", "पाणी उपलब्ध असल्यास सर्वात महत्त्वाचे पाणी."]),
    ], [["Earhead bugs", "कणसावरील ढेकूण"]]),
    stage("grain", ["Grain filling", "दाणे भरणे"], 75, 105, ["Grains fill and harden.", "दाणे भरतात व टणक होतात."], [
      t("jw-obs3", 78, "observation", ["Check grain", "दाणे तपासा"], ["Look at earheads for pests and mould.", "कणसांवर कीड व बुरशी पाहा."], 10),
      t("jw-irr3", 80, "irrigation", ["Irrigation at grain filling", "दाणे भरताना पाणी"], ["If water is available and soil is dry.", "पाणी उपलब्ध असल्यास व जमीन कोरडी असल्यास."]),
      t("jw-bird", 85, "other", ["Protect from birds", "पक्ष्यांपासून संरक्षण करा"], ["Guard earheads from birds in the mornings and evenings.", "सकाळ-संध्याकाळ कणसांचे पक्ष्यांपासून राखण करा."]),
    ], [["Bird damage", "पक्ष्यांचे नुकसान"], ["Grain mould in rain", "पावसात दाण्यांवर बुरशी"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 105, 125, ["Grains are hard and the crop is ready.", "दाणे टणक होऊन पीक तयार होते."], [
      t("jw-mat", 105, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Grain hard with a black spot at its base → ready.", "दाणा टणक व तळाशी काळा ठिपका → तयार."]),
      t("jw-harv", 110, "harvest", ["Harvest", "काढणी करा"], ["Cut earheads, dry well and thresh. Keep the fodder dry.", "कणसे कापा, चांगली वाळवा व मळणी करा. कडबा कोरडा ठेवा."]),
    ], [["Rain at harvest causes mould", "काढणीच्या वेळी पावसाने बुरशी"]]),
  ],
  commonProblems: [
    { name: b("Shoot fly", "खोडमाशी"), signs: b("The centre leaf of young plants dries (dead heart).", "कोवळ्या रोपांचे मधले पान वाळते."), prevention: prevent("Sow on time; late sowing gets more shoot fly.", "वेळेवर पेरणी करा; उशिरा पेरणीला खोडमाशी जास्त.") },
    { name: b("Stem borer", "खोडकिडा"), signs: b("Holes in stem, dead centre leaf in older plants.", "खोडाला छिद्रे, मोठ्या रोपांचे मधले पान वाळते."), prevention: prevent("Destroy stubble after harvest.", "काढणीनंतर धसकटे नष्ट करा.") },
  ],
  harvestSigns: b("Grains are hard and show a black spot where they join the earhead.", "दाणे टणक असून कणसाला जोडलेल्या ठिकाणी काळा ठिपका दिसतो."),
  postHarvest: b("Dry grain well and store in clean bags. Store fodder (kadba) dry — it is valuable.", "धान्य चांगले वाळवून स्वच्छ पोत्यांत साठवा. कडबा कोरडा साठवा — तो मौल्यवान आहे."),
  marketTips: b("Rabi jowar grain fetches good rates; fodder is a second income. Check the support price.", "रब्बी ज्वारीला चांगला दर मिळतो; कडबा हे दुसरे उत्पन्न आहे. हमीभाव तपासा."),
  source: "General practices from ICAR-IIMR and MPKV Rahuri sorghum guidance",
  lastVerified: null,
};

export const CROPS: CropInfo[] = [onion, tomato, soybean, cotton, tur, wheat, chana, jowar];

export const CATEGORIES: CropInfo["category"][] = ["vegetable", "cereal", "pulse", "oilseed", "fibre"];

export const CATEGORY_LABEL: Record<CropInfo["category"], { en: string; mr: string }> = {
  vegetable: b("Vegetables", "भाजीपाला"),
  cereal: b("Cereals", "तृणधान्ये"),
  pulse: b("Pulses", "कडधान्ये"),
  oilseed: b("Oilseeds", "तेलबिया"),
  fibre: b("Fibre", "धागा पिके"),
  fruit: b("Fruits", "फळपिके"),
  cash: b("Cash crops", "नगदी पिके"),
};

export const SEASON_LABEL: Record<Season, { en: string; mr: string }> = {
  kharif: b("Kharif", "खरीप"),
  rabi: b("Rabi", "रब्बी"),
  summer: b("Summer", "उन्हाळी"),
  perennial: b("Perennial", "बारमाही"),
};

/** Name of one season entry, e.g. "Late kharif (rangda)". */
export const seasonName = (crop: CropInfo, index: number) => crop.seasons[index]?.label ?? SEASON_LABEL[crop.seasons[index]?.season ?? "kharif"];

export const getCrop = (id: string) => CROPS.find((c) => c.id === id);

/** Case-insensitive, partial match on English name, Marathi name and aliases. */
export function searchCrops(query: string): CropInfo[] {
  const q = query.trim().toLowerCase();
  if (!q) return CROPS;
  const words = q.split(/\s+/);
  return CROPS.filter((c) => {
    const hay = [c.name.en, c.name.mr, ...c.aliases].map((x) => x.toLowerCase());
    return words.every((w) => hay.some((h) => h.includes(w) || (w.length >= 3 && w.includes(h))));
  });
}

/** The season (and its index) that suits sowing in `month`, else the next one to come. */
export function seasonFor(crop: CropInfo, month: number): { season: Season; index: number; fits: boolean } {
  const i = crop.seasons.findIndex((s) => s.sowingMonths.includes(month));
  if (i >= 0) return { season: crop.seasons[i].season, index: i, fits: true };
  // nearest upcoming sowing month
  let best = 0;
  let bestGap = 13;
  crop.seasons.forEach((s, idx) =>
    s.sowingMonths.forEach((m) => {
      const gap = (m - month + 12) % 12;
      if (gap < bestGap) {
        bestGap = gap;
        best = idx;
      }
    }),
  );
  return { season: crop.seasons[best].season, index: best, fits: false };
}

/** Dev check: stages continuous from day 0, last stage ends at the longest duration, tasks inside their stage. */
export function validateCrops(list: CropInfo[] = CROPS): string[] {
  const errors: string[] = [];
  for (const c of list) {
    const max = Math.max(...c.seasons.map((s) => s.durationDays[1]));
    if (c.stages[0]?.startDay !== 0) errors.push(`${c.id}: first stage must start on day 0`);
    c.stages.forEach((s, i) => {
      if (s.endDay <= s.startDay) errors.push(`${c.id}/${s.key}: endDay must be after startDay`);
      if (i > 0 && s.startDay !== c.stages[i - 1].endDay) errors.push(`${c.id}/${s.key}: starts on day ${s.startDay} but previous stage ends on ${c.stages[i - 1].endDay}`);
      for (const tk of s.tasks) if (tk.dayOffset < s.startDay || tk.dayOffset >= s.endDay) errors.push(`${c.id}/${tk.id}: day ${tk.dayOffset} is outside ${s.key} (${s.startDay}–${s.endDay})`);
    });
    const last = c.stages[c.stages.length - 1];
    if (last && last.endDay !== max) errors.push(`${c.id}: last stage ends on day ${last.endDay}, longest duration is ${max}`);
    const ids = c.stages.flatMap((s) => s.tasks.map((x) => x.id));
    if (new Set(ids).size !== ids.length) errors.push(`${c.id}: duplicate task ids`);
    for (const s of c.seasons) if (s.durationDays[0] > s.durationDays[1]) errors.push(`${c.id}: duration min > max`);
  }
  return errors;
}

if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
  for (const e of validateCrops()) console.warn(`[crops] ${e}`);
}
