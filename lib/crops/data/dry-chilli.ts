import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "dry-chilli",
  emoji: "🌶️",
  name: b("Dry red chilli", "लाल मिरची"),
  aliases: ["dry chilli", "dry chili", "red chilli", "red chili", "lal mirchi", "lal mirchi sukhi", "लाल मिरची", "sukhi mirchi", "सुकी मिरची", "sukki mirchi", "सूखी लाल मिर्च"],
  category: "spice",
  lifecycle: "seasonal",
  regions: ["north", "vidarbha"],
  majorDistricts: b("Nandurbar, Nagpur (Bhiwapur)", "नंदुरबार, नागपूर (भिवापूर)"),
  tier: 2,
  seasons: [
    { season: "kharif", label: b("Kharif", "खरीप"), sowingWindow: b("Nursery in June–July; transplant after 5–6 weeks", "रोपवाटिका जून–जुलै; 5–6 आठवड्यांनी पुनर्लागवड"), sowingMonths: [6, 7], durationDays: [180, 210] },
  ],
  method: "transplant",
  plantingMaterial: b("Seed, raised as seedlings in a nursery", "बियाणे; रोपवाटिकेत रोपे तयार करून"),
  nurseryDays: 40,
  seedRate: b("About 400–500 g seed per acre, sown in a nursery.", "एकरी साधारण 400–500 ग्रॅम बियाणे, रोपवाटिकेत पेरणी."),
  spacing: b("60 cm between rows and 45 cm between plants (wider, 75 × 60 cm, on rich soils).", "दोन ओळींत 60 सेंमी व दोन रोपांत 45 सेंमी (सुपीक जमिनीत जास्त, 75 × 60 सेंमी)."),
  soil: b(
    "Well-drained medium black or loamy soil. Chilli cannot stand waterlogging — water standing for a day can kill plants.",
    "पाण्याचा चांगला निचरा होणारी मध्यम काळी किंवा पोयट्याची जमीन. मिरचीला साचलेले पाणी सहन होत नाही — एक दिवस पाणी साचले तरी झाडे मरू शकतात.",
  ),
  climate: b(
    "Warm weather during growth and dry, sunny weather while pods ripen and dry. Heavy rain at flowering causes flower drop and fruit rot.",
    "वाढीच्या काळात उबदार हवा आणि शेंगा पिकताना व वाळताना कोरडी, उन्हाची हवा. फुलोऱ्यात जोराच्या पावसाने फुलगळ व फळकूज होते.",
  ),
  irrigation: b(
    "Mostly rainfed in kharif, with protective water in dry spells. After the rains, water every 8–12 days. Drip works well. Keep moisture even during flowering and fruit set; never let water stand.",
    "खरिपात बहुधा पावसावर, खंड पडल्यास संरक्षित पाणी. पाऊस संपल्यावर दर 8–12 दिवसांनी पाणी. ठिबक चांगले. फुलोऱ्यात व फळधारणेत ओलावा सारखा ठेवा; पाणी कधीही साचू देऊ नका.",
  ),
  nutrientGuide: b(
    "Mix well-rotted farmyard manure before transplanting. Base fertiliser on a soil test and split nitrogen into 2–3 doses up to flowering. Ask your agriculture officer for amounts.",
    "पुनर्लागवडीपूर्वी चांगले कुजलेले शेणखत मिसळा. खत माती परीक्षणावर आधारित द्या आणि नत्र फुलोऱ्यापर्यंत 2–3 हप्त्यांत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("nursery", ["Nursery", "रोपवाटिका"], 0, 40, ["Seeds sprout in raised beds and grow into seedlings.", "गादीवाफ्यावर बी उगवते व रोपे तयार होतात."], [
      t("dc-bed", 0, "sowing", ["Prepare nursery beds and sow", "रोपवाटिका तयार करून पेरणी करा"], ["Make raised beds about 1 m wide, mix compost, sow thinly in lines and cover lightly. Protect beds with fine net from insects if possible.", "साधारण 1 मीटर रुंद गादीवाफे करा, कंपोस्ट मिसळा, ओळीत विरळ पेरा व हलके झाका. शक्य असल्यास बारीक जाळीने किडींपासून संरक्षण करा."]),
      t("dc-nirr", 1, "irrigation", ["Water the nursery lightly", "रोपवाटिकेला हलके पाणी द्या"], ["Use a can. Don't keep beds soggy — seedlings rot at the base.", "झारीने पाणी द्या. वाफे सतत ओले ठेवू नका — रोपे बुंध्याशी कुजतात."], 3),
      t("dc-nobs", 20, "observation", ["Check seedlings", "रोपे तपासा"], ["Look for curled leaves (thrips, mites) and seedlings falling over.", "मुरगळलेली पाने (फुलकिडे, कोळी) व कोलमडणारी रोपे पाहा."], 7),
    ], [["Damping off", "रोपे कोलमडणे"], ["Leaf curl starting in the nursery", "रोपवाटिकेतच चुरडा-मुरडा सुरू होणे"]]),
    stage("transplanting", ["Transplanting", "पुनर्लागवड"], 40, 50, ["Seedlings are planted in the main field and take root.", "रोपे मुख्य शेतात लावली जातात व मूळ धरतात."], [
      t("dc-field", 40, "other", ["Prepare the main field", "मुख्य शेत तयार करा"], ["Plough, add manure, and make ridges and furrows so rain water drains away.", "नांगरट करा, शेणखत मिसळा आणि पावसाचे पाणी निघून जाईल अशा सरी-वरंबे करा."]),
      t("dc-tp", 41, "transplanting", ["Transplant seedlings", "रोपांची पुनर्लागवड करा"], ["Plant healthy 5–6 week seedlings in the evening; water right after.", "5–6 आठवड्यांची निरोगी रोपे संध्याकाळी लावा; लगेच पाणी द्या."]),
      t("dc-gap", 47, "other", ["Fill gaps", "खाडे भरा"], ["Replace dead seedlings within a week.", "आठवडाभरात मेलेली रोपे बदला."]),
    ], [["Seedlings drying in hot sun", "उन्हात रोपे सुकणे"]]),
    stage("vegetative", ["Vegetative growth", "शाखीय वाढ"], 50, 95, ["Plants branch out and build a strong frame.", "झाडांना फांद्या फुटतात व मजबूत सांगाडा तयार होतो."], [
      t("dc-irr1", 50, "irrigation", ["Irrigate in dry spells", "पावसाच्या खंडात पाणी द्या"], ["Light water when the top soil dries; drain any standing water at once.", "वरची माती सुकल्यावर हलके पाणी; साचलेले पाणी लगेच काढून द्या."], 8),
      t("dc-weed", 60, "weeding", ["Weeding and hoeing", "खुरपणी व कोळपणी"], ["Weed and hoe 2–3 times; earth up lightly around stems.", "2–3 वेळा खुरपणी व कोळपणी करा; खोडाभोवती हलकी माती चढवा."], 20),
      t("dc-fert1", 65, "fertiliser", ["Top dressing", "वरखत हप्ता"], ["Give a nitrogen part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार नत्राचा हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
      t("dc-obs1", 52, "observation", ["Check leaves", "पाने तपासा"], ["Leaves curling up (thrips) or down (mites), and whitefly under leaves.", "पाने वर मुरगळणे (फुलकिडे) किंवा खाली वळणे (कोळी), आणि पानांखाली पांढरी माशी पाहा."], 7),
    ], [["Leaf curl (churda-murda)", "चुरडा-मुरडा"], ["Whitefly spreading virus", "विषाणू पसरवणारी पांढरी माशी"]]),
    stage("flowering", ["Flowering & fruit set", "फुलोरा व फळधारणा"], 95, 125, ["White flowers open and small green pods form.", "पांढरी फुले उमलतात व लहान हिरव्या मिरच्या लागतात."], [
      t("dc-irr2", 95, "irrigation", ["Keep moisture even", "ओलावा सारखा ठेवा"], ["Dry, then wet soil makes flowers drop.", "आधी कोरडी व मग ओली जमीन झाल्यास फुलगळ होते."], 8),
      t("dc-fert2", 96, "fertiliser", ["Last top dressing", "शेवटचा वरखत हप्ता"], ["Give the last nitrogen part as per your plan.", "नियोजनानुसार नत्राचा शेवटचा हप्ता द्या."]),
      t("dc-obs2", 97, "observation", ["Check flowers and pods", "फुले व मिरच्या तपासा"], ["Look for flower drop, bored pods and leaf curl.", "फुलगळ, पोखरलेल्या मिरच्या व चुरडा-मुरडा पाहा."], 7),
    ], [["Flower drop", "फुलगळ"], ["Fruit borer", "फळ पोखरणारी अळी"]]),
    stage("ripening", ["Pod growth & ripening", "मिरची पोसणे व पिकणे"], 125, 165, ["Pods reach full size and turn from green to red.", "मिरच्या पूर्ण वाढतात व हिरव्यापासून लाल होतात."], [
      t("dc-irr3", 125, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 10–12 days; reduce as pods ripen.", "दर 10–12 दिवसांनी पाणी; मिरच्या पिकताना कमी करा."], 10),
      t("dc-obs3", 127, "observation", ["Check pods", "मिरच्या तपासा"], ["Look for dark sunken spots and twigs drying from the tip (die back).", "काळे खोलगट डाग आणि शेंड्यांकडून फांद्या सुकणे (फळकूज, डायबॅक) पाहा."], 7),
    ], [["Fruit rot and die back", "फळकूज व फांद्या सुकणे"]]),
    stage("red-picking", ["Red pod picking", "लाल मिरची तोडणी"], 165, 210, ["Fully red pods are picked in rounds and dried.", "पूर्ण लाल मिरच्या फेऱ्यांमध्ये तोडून वाळवल्या जातात."], [
      t("dc-pick", 165, "harvest", ["Pick red pods", "लाल मिरच्या तोडा"], ["Pick fully red, slightly wrinkled pods every 10–15 days. Don't pick half-red pods.", "पूर्ण लाल, थोड्या सुरकुतलेल्या मिरच्या दर 10–15 दिवसांनी तोडा. अर्धवट लाल मिरच्या तोडू नका."], 12),
      t("dc-dry", 166, "other", ["Dry the pods", "मिरच्या वाळवा"], ["Spread on a clean tarpaulin or cement floor in sun, turning daily, until pods rattle. Never dry on bare soil.", "स्वच्छ ताडपत्रीवर किंवा सिमेंटच्या खळ्यावर उन्हात पसरा, रोज उलटा, मिरच्या खुळखुळेपर्यंत वाळवा. उघड्या मातीवर कधीही वाळवू नका."], 12),
    ], [["Mould on pods dried in damp weather", "दमट हवेत वाळवलेल्या मिरच्यांना बुरशी"]]),
  ],
  flushes: { everyDays: 12, count: 4, note: b("Red pods are picked in 4–6 rounds, 10–15 days apart.", "लाल मिरच्यांची 10–15 दिवसांच्या अंतराने 4–6 फेऱ्यांत तोडणी.") },
  commonProblems: [
    {
      name: b("Leaf curl (churda-murda)", "चुरडा-मुरडा"),
      signs: b("Leaves curl up or down, become small and crinkled; plants stunt and flower poorly. Caused by thrips, mites and virus spread by whitefly.", "पाने वर किंवा खाली मुरगळतात, लहान व सुरकुतलेली होतात; झाडे खुरटी राहतात व फुले कमी येतात. फुलकिडे, कोळी आणि पांढऱ्या माशीने पसरणाऱ्या विषाणूमुळे होते."),
      prevention: prevent("Raise seedlings under net, pull out virus-affected plants early, keep the field and bunds weed-free, and use yellow and blue sticky traps.", "जाळीखाली रोपे तयार करा, विषाणूग्रस्त झाडे लवकर उपटा, शेत व बांध तणमुक्त ठेवा आणि पिवळे व निळे चिकट सापळे लावा."),
    },
    {
      name: b("Fruit rot and die back", "फळकूज व फांद्या सुकणे (डायबॅक)"),
      signs: b("Dark, sunken spots on ripening pods; twigs dry from the tip downwards.", "पिकणाऱ्या मिरच्यांवर काळे खोलगट डाग; फांद्या शेंड्याकडून खाली सुकतात."),
      prevention: prevent("Use healthy seed, remove and destroy affected pods and twigs, and avoid waterlogging.", "निरोगी बियाणे वापरा, बाधित मिरच्या व फांद्या काढून नष्ट करा आणि पाणी साचू देऊ नका."),
    },
    {
      name: b("Fruit borer", "फळ पोखरणारी अळी"),
      signs: b("Holes in pods; pods drop or rot inside.", "मिरच्यांना छिद्रे; मिरच्या गळतात किंवा आतून कुजतात."),
      prevention: prevent("Collect and destroy bored pods, and use pheromone traps to watch moth numbers.", "पोखरलेल्या मिरच्या गोळा करून नष्ट करा आणि पतंगांच्या संख्येवर लक्ष ठेवण्यासाठी कामगंध सापळे लावा."),
    },
    {
      name: b("Damping off in the nursery", "रोपवाटिकेत रोपे कोलमडणे"),
      signs: b("Seedlings fall over at the soil line and dry.", "रोपे मातीलगत कोलमडून सुकतात."),
      prevention: prevent("Use raised beds, sow thinly and avoid over-watering.", "गादीवाफे वापरा, विरळ पेरणी करा आणि जास्त पाणी देऊ नका."),
    },
  ],
  harvestSigns: b("Pods are fully red and start to wrinkle on the plant.", "मिरच्या झाडावरच पूर्ण लाल होऊन सुरकुतू लागतात."),
  postHarvest: b(
    "Dry pods in sun on a clean tarpaulin or cement floor (or a solar dryer) for 7–10 days, turning daily, until they rattle. Keep them off bare soil and away from rain, which bring mould. Remove white, spotted and broken pods, grade by colour and size, and store in clean, dry gunny bags in a dry room.",
    "मिरच्या स्वच्छ ताडपत्रीवर किंवा सिमेंटच्या खळ्यावर (किंवा सौर ड्रायरमध्ये) 7–10 दिवस उन्हात, रोज उलटून, खुळखुळेपर्यंत वाळवा. उघडी माती व पावसापासून दूर ठेवा, नाहीतर बुरशी लागते. पांढऱ्या, डागाळलेल्या व तुटक्या मिरच्या वेगळ्या करा, रंग व आकारानुसार प्रतवारी करा आणि कोरड्या खोलीत स्वच्छ, कोरड्या पोत्यांत साठवा.",
  ),
  marketTips: b(
    "Deep red, glossy, mould-free pods with stalks get the best price. Nandurbar has a big dry chilli market. Dry chillies keep well when stored dry, so you can wait for a better rate.",
    "गडद लाल, चमकदार, बुरशीरहित व देठासह मिरचीला सर्वाधिक दर मिळतो. नंदुरबार येथे सुक्या मिरचीची मोठी बाजारपेठ आहे. कोरड्या जागी साठवल्यास सुकी मिरची चांगली टिकते, त्यामुळे चांगल्या दरासाठी थांबता येते.",
  ),
  varieties: [], // TODO: varieties — confirm dry-chilli varieties with MPKV Rahuri / Dr. PDKV Akola
  source: "General practices from MPKV Rahuri and Dr. PDKV Akola chilli guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
