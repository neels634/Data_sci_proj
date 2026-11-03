import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Banana: a 12–15 month crop from planting to bunch harvest, with a ratoon (khodwa) crop after. */
const crop: SeasonalCrop = {
  id: "banana",
  emoji: "🍌",
  name: b("Banana", "केळी"),
  aliases: ["banana", "bananas", "keli", "kelee", "kela", "kele", "केळी", "केळ", "केळे", "केला"],
  category: "fruit",
  lifecycle: "seasonal",
  regions: ["north", "western", "marathwada"],
  majorDistricts: b("Jalgaon (main), Dhule, Nandurbar, Nanded, Solapur", "जळगाव (मुख्य), धुळे, नंदुरबार, नांदेड, सोलापूर"),
  tier: 1,
  seasons: [
    {
      season: "kharif",
      label: b("Mrig bahar", "मृग बाग"),
      sowingWindow: b("Planting in June–July", "लागवड जून–जुलै"),
      sowingMonths: [6, 7],
      durationDays: [360, 420],
    },
    {
      season: "rabi",
      label: b("Kande bahar", "कांदे बाग"),
      sowingWindow: b("Planting in October–November", "लागवड ऑक्टोबर–नोव्हेंबर"),
      sowingMonths: [10, 11],
      durationDays: [390, 450],
    },
  ],
  method: "vegetative",
  plantingMaterial: b(
    "Tissue-culture plants from a certified lab, or healthy sword suckers (narrow leaves) from a disease-free garden",
    "प्रमाणित प्रयोगशाळेतील उती संवर्धित (टिश्यू कल्चर) रोपे, किंवा रोगमुक्त बागेतील निरोगी तलवारीसारखी (अरुंद पानांची) पिल्ले",
  ),
  seedRate: b("About 1,450–1,800 plants per acre, depending on spacing", "अंतरानुसार एकरी साधारण 1,450–1,800 रोपे"),
  spacing: b("1.5 m × 1.5 m, or 1.8 m × 1.5 m; paired rows are used with drip", "1.5 मीटर × 1.5 मीटर किंवा 1.8 मीटर × 1.5 मीटर; ठिबकसाठी जोड ओळ पद्धत वापरतात"),
  soil: b(
    "Deep, fertile, well-drained medium black or loamy soil rich in organic matter. Avoid saline soil and fields where water stands.",
    "खोल, सुपीक, पाण्याचा चांगला निचरा होणारी, सेंद्रिय पदार्थ भरपूर असलेली मध्यम काळी किंवा पोयट्याची जमीन. क्षारयुक्त व पाणी साचणारी जमीन टाळा.",
  ),
  climate: b(
    "Warm and humid weather suits it. Strong summer heat and hot winds scorch leaves; cold below about 12 °C in winter slows growth and can choke the bunch.",
    "उबदार व दमट हवामान योग्य. कडक उन्हाळा व उष्ण वाऱ्याने पाने करपतात; हिवाळ्यात साधारण 12 °C पेक्षा कमी थंडीने वाढ मंदावते आणि घड अडकू शकतो.",
  ),
  irrigation: b(
    "Banana needs a lot of water, regularly. Drip irrigation is best and saves water. Water more often in summer, less in winter and none during heavy rain. Never let the soil dry out at bunch emergence and filling.",
    "केळीला नियमित भरपूर पाणी लागते. ठिबक सिंचन उत्तम व पाण्याची बचत करते. उन्हाळ्यात जास्त वेळा, हिवाळ्यात कमी आणि जोरदार पावसात पाणी देऊ नका. घड निसवताना व भरताना जमीन कधीही कोरडी पडू देऊ नका.",
  ),
  nutrientGuide: b(
    "Base it on a soil test. Mix plenty of well-rotted farmyard manure before planting. Banana needs a lot of nitrogen and potash, given in many small parts — best through drip (fertigation). Stop nitrogen once the bunch has come out. Ask your agriculture officer for amounts.",
    "माती परीक्षणावर आधारित खत द्या. लागवडीपूर्वी भरपूर कुजलेले शेणखत मिसळा. केळीला नत्र व पालाश जास्त लागते; ते अनेक लहान हप्त्यांत द्या — ठिबकमधून (फर्टिगेशन) उत्तम. घड निसवल्यानंतर नत्र बंद करा. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Plants are set in pits or furrows and start new roots.", "रोपे खड्ड्यांत किंवा सरीत लावली जातात व नवी मुळे फुटतात."], [
      t("bn-plant", 0, "transplanting", ["Plant tissue-culture plants or suckers", "उती संवर्धित रोपे किंवा पिल्ले लावा"], ["Mix well-rotted manure in the pit, plant at the same depth as in the bag, and press the soil firmly.", "खड्ड्यात कुजलेले शेणखत मिसळा, पिशवीतील खोलीवरच रोप लावा आणि माती घट्ट दाबा."]),
      t("bn-irr0", 1, "irrigation", ["Water right after planting", "लागवडीनंतर लगेच पाणी द्या"], ["Give water on the day of planting, then keep the soil moist but not soggy.", "लागवडीच्या दिवशी पाणी द्या, नंतर माती ओलसर ठेवा पण चिखल करू नका."], 3),
      t("bn-gap", 20, "other", ["Fill gaps", "खाडे भरा"], ["Replace dead or weak plants within a month so the whole garden bunches together.", "संपूर्ण बाग एकाच वेळी घड देईल म्हणून मेलेली किंवा कमकुवत रोपे महिनाभरात बदला."]),
    ], [["Young plants drying in heat", "उन्हामुळे लहान रोपे सुकणे"], ["Rotting where water stands", "पाणी साचलेल्या जागी रोपे कुजणे"]]),
    stage("establishment", ["Establishment", "रोपे स्थिरावणे"], 30, 90, ["Roots spread and new leaves come quickly.", "मुळे पसरतात आणि नवी पाने झपाट्याने येतात."], [
      t("bn-irr1", 30, "irrigation", ["Irrigate regularly", "नियमित पाणी द्या"], ["Give water every few days by drip; adjust for rain and heat.", "ठिबकने दर काही दिवसांनी पाणी द्या; पाऊस व उन्हानुसार बदल करा."], 4),
      t("bn-weed1", 35, "weeding", ["Weed the field", "खुरपणी करा"], ["Keep the field weed-free in the first months; weeds compete strongly with young plants.", "पहिल्या महिन्यांत शेत तणमुक्त ठेवा; तण लहान रोपांशी जोरदार स्पर्धा करतात."], 30),
      t("bn-fert1", 45, "fertiliser", ["Start fertiliser in parts", "खत हप्त्यांत सुरू करा"], ["Begin split doses as per soil test, through drip if possible. Ask your agriculture officer for amounts.", "माती परीक्षणानुसार विभागून खत सुरू करा, शक्य असल्यास ठिबकमधून. प्रमाण कृषी अधिकाऱ्यांना विचारा."], 15),
      t("bn-obs1", 40, "observation", ["Check leaves", "पाने तपासा"], ["Look for bunched, narrow leaves with dark green streaks (bunchy top) and yellow mottled leaves (mosaic). Remove such plants at once.", "गुच्छासारखी, अरुंद, गडद हिरव्या रेषांची पाने (पर्णगुच्छ) व पिवळसर चट्टे असलेली पाने (मोझॅक) पाहा. अशी झाडे ताबडतोब उपटून नष्ट करा."], 10),
    ], [["Bunchy top virus", "पर्णगुच्छ (बंची टॉप)"], ["Cucumber mosaic virus", "मोझॅक (CMV)"]]),
    stage("vegetative", ["Vegetative growth", "शाकीय वाढ"], 90, 210, ["The plant grows tall and puts out many leaves. Good leaves now mean a heavy bunch later.", "झाड उंच वाढते व अनेक पाने येतात. आता चांगली पाने म्हणजे नंतर भरीव घड."], [
      t("bn-irr2", 90, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep moisture steady; water more often in hot months.", "ओलावा सारखा ठेवा; उन्हाळ्यात जास्त वेळा पाणी द्या."], 4),
      t("bn-desucker", 95, "other", ["Remove side suckers", "बाजूची पिल्ले काढा"], ["Cut side suckers at ground level every month. If you plan a ratoon, keep one strong sucker later.", "दर महिन्याला बाजूची पिल्ले जमिनीलगत कापा. खोडवा घ्यायचा असल्यास नंतर एक जोमदार पिल्लू ठेवा."], 30),
      t("bn-earth", 120, "other", ["Earth up the plants", "झाडांना भर द्या"], ["Pull soil to the base so the plant stands firmly and roots stay covered.", "झाड घट्ट उभे राहावे व मुळे झाकलेली राहावीत म्हणून बुंध्याला माती लावा."]),
      t("bn-leaf", 150, "other", ["Remove dry and spotted leaves", "वाळलेली व डाग असलेली पाने काढा"], ["Cut old dry leaves and those with leaf-spot streaks, and take them out of the field.", "जुनी वाळलेली पाने व करपा डाग असलेली पाने कापा आणि शेताबाहेर न्या."], 30),
      t("bn-obs2", 100, "observation", ["Walk the garden", "बागेत फेरी मारा"], ["Look for leaf spots (Sigatoka), yellowing old leaves with a split stem base (wilt) and holes at the base (weevil).", "पानांवरील करपा (सिगाटोका), खोड फुटून जुनी पाने पिवळी पडणे (मर) आणि बुंध्यात छिद्रे (सोंडे) पाहा."], 15),
    ], [["Sigatoka leaf spot (karpa)", "करपा (सिगाटोका)"], ["Panama wilt", "पनामा मर"], ["Rhizome weevil", "कंद पोखरणारे सोंडे"]]),
    stage("shooting", ["Bunch emergence (shooting)", "घड निसवणे"], 210, 300, ["The flower stalk comes out of the top and hands of fruit open one by one.", "शेंड्यातून केळफूल बाहेर येते आणि फण्या एकेक करून उघडतात."], [
      t("bn-irr3", 210, "irrigation", ["Never let the soil dry", "जमीन कोरडी पडू देऊ नका"], ["Water stress now makes small, poorly filled bunches.", "आता पाण्याचा ताण पडल्यास घड लहान व कमी भरतो."], 3),
      t("bn-prop", 215, "other", ["Prop the plants", "झाडांना आधार द्या"], ["Support plants with bamboo or rope so the heavy bunch does not bring them down in wind.", "वाऱ्यात जड घडामुळे झाड पडू नये म्हणून बांबू किंवा दोरीने आधार द्या."]),
      t("bn-bell", 230, "other", ["Remove the male bud", "केळफूल कापा"], ["After the last hand opens, cut the male bud (bell) about 15 cm below it. Remove the last small hands if they are weak.", "शेवटची फणी उघडल्यावर तिच्या साधारण 15 सेंमी खाली केळफूल कापा. शेवटच्या लहान, कमकुवत फण्या काढा."]),
      t("bn-cover", 235, "other", ["Cover the bunch", "घडाला पिशवी घाला"], ["Cover the bunch with a clean, perforated bag to protect it from sun, dust and insects; this gives better colour.", "ऊन, धूळ व किडींपासून संरक्षणासाठी घडाला स्वच्छ, छिद्रे असलेली पिशवी घाला; त्यामुळे रंग चांगला येतो."]),
    ], [["Choke-throat in cold weather (bunch stuck in the stem)", "थंडीत घड अडकणे"], ["Thrips scarring fruit skin", "फुलकिड्यांमुळे फळांच्या सालीवर व्रण"]]),
    stage("bunch-filling", ["Bunch filling", "घड भरणे"], 300, 390, ["Fingers fill out and become round.", "केळी भरून गोलसर होतात."], [
      t("bn-irr4", 300, "irrigation", ["Irrigate regularly", "नियमित पाणी द्या"], ["Even water fills the bunch. Avoid waterlogging.", "सारख्या पाण्याने घड भरतो. पाणी साचू देऊ नका."], 4),
      t("bn-obs3", 305, "observation", ["Check bunches and props", "घड व आधार तपासा"], ["Tighten loose props, check bags, and look for leaf spot spreading to top leaves.", "सैल आधार घट्ट करा, पिशव्या तपासा आणि करपा वरच्या पानांपर्यंत पसरला आहे का पाहा."], 10),
      t("bn-sucker2", 320, "other", ["Choose the ratoon sucker", "खोडव्यासाठी पिल्लू निवडा"], ["If you plan a ratoon, keep one healthy sword sucker near the mother plant and remove the rest.", "खोडवा घ्यायचा असल्यास मुख्य झाडाजवळ एक निरोगी तलवार पिल्लू ठेवा आणि बाकीची काढा."]),
    ], [["Sigatoka on upper leaves", "वरच्या पानांवर करपा"], ["Sunburn on exposed bunches", "उघड्या घडांना ऊन लागणे"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 390, 450, ["Fingers lose their angles and the bunch is cut.", "केळींच्या कडा गोलसर होतात आणि घड कापला जातो."], [
      t("bn-mat", 390, "observation", ["Check maturity", "पक्वता तपासा"], ["Ready when ridges on the fingers become round and top leaves start drying. Decide the stage with your buyer — distant markets need slightly less mature bunches.", "केळींच्या कडा गोलसर होऊन वरची पाने सुकू लागली की घड तयार. बाजार लांब असल्यास थोडा कमी पक्व घड लागतो — खरेदीदाराशी ठरवा."]),
      t("bn-cut", 395, "harvest", ["Cut the bunches", "घड कापा"], ["Cut with a sharp knife, keeping a long stalk. Carry on padded shoulders or trays — do not drop or bruise.", "धारदार कोयत्याने लांब दांडा ठेवून घड कापा. आधार देऊन वाहून न्या — घड आपटू किंवा दाबू देऊ नका."], 7),
      t("bn-clean", 400, "other", ["Cut down harvested stems", "काढणी झालेली खोडे कापा"], ["After harvest, cut the mother stem in stages so the ratoon sucker gets its food; clear trash from the field.", "काढणीनंतर मुख्य खोड टप्प्याटप्प्याने कापा म्हणजे खोडव्याच्या पिल्लाला अन्न मिळेल; शेतातील कचरा साफ करा."]),
    ], [["Bruising and latex stains at harvest", "काढणीत केळी दबणे व चिकाचे डाग"]]),
  ],
  ratoon: {
    allowed: true,
    cycles: 1,
    durationDays: [300, 360],
    note: b(
      "A ratoon (khodwa) crop grows from a sucker kept beside the mother plant. It saves planting cost and is ready sooner, but keep it only if the garden is free of bunchy top, wilt and weevil. Most farmers take one ratoon.",
      "मुख्य झाडाजवळ ठेवलेल्या पिल्लापासून खोडवा पीक येते. त्यात लागवड खर्च वाचतो व पीक लवकर तयार होते, पण बाग पर्णगुच्छ, मर व सोंडे यांपासून मुक्त असेल तरच खोडवा ठेवा. बहुतेक शेतकरी एकच खोडवा घेतात.",
    ),
  },
  commonProblems: [
    {
      name: b("Sigatoka leaf spot (karpa)", "करपा (सिगाटोका)"),
      signs: b("Yellow streaks on leaves turn into brown-black spots with grey centres; leaves dry early and bunches stay small.", "पानांवरील पिवळ्या रेषांचे राखाडी मध्य असलेल्या तपकिरी-काळ्या डागांत रूपांतर होते; पाने लवकर सुकतात व घड लहान राहतो."),
      prevention: prevent("Remove and destroy spotted leaves regularly, keep proper spacing, remove extra suckers, and drain standing water.", "डाग असलेली पाने नियमित काढून नष्ट करा, योग्य अंतर ठेवा, जास्तीची पिल्ले काढा आणि साचलेले पाणी काढून टाका."),
    },
    {
      name: b("Panama wilt", "पनामा मर"),
      signs: b("Older leaves turn yellow from the edges and hang down around the stem; the stem base splits; inside the stem shows brown streaks.", "जुनी पाने कडांपासून पिवळी पडून खोडाभोवती लोंबतात; बुंधा फुटतो; खोडाच्या आत तपकिरी रेषा दिसतात."),
      prevention: prevent("Plant tissue-culture plants, do not take suckers from wilt-affected gardens, avoid waterlogging, and rotate with another crop after a badly affected crop.", "उती संवर्धित रोपे लावा, मर असलेल्या बागेतील पिल्ले घेऊ नका, पाणी साचू देऊ नका आणि जास्त प्रादुर्भाव झाल्यावर दुसरे पीक घेऊन फेरपालट करा."),
    },
    {
      name: b("Bunchy top virus", "पर्णगुच्छ (बंची टॉप)"),
      signs: b("New leaves are short, narrow, upright and bunched at the top, with dark green streaks; the plant gives no proper bunch.", "नवी पाने लहान, अरुंद, ताठ व शेंड्याला गुच्छासारखी, त्यावर गडद हिरव्या रेषा; झाडाला योग्य घड येत नाही."),
      prevention: prevent("Use virus-tested tissue-culture plants, uproot and destroy affected plants at once, and control aphids that spread the virus.", "विषाणू तपासलेली उती संवर्धित रोपे वापरा, बाधित झाडे ताबडतोब उपटून नष्ट करा आणि विषाणू पसरवणाऱ्या माव्याचे नियंत्रण करा."),
    },
    {
      name: b("Cucumber mosaic virus (CMV)", "काकडी मोझॅक (CMV)"),
      signs: b("Yellow and green patchy streaks on leaves; leaves become narrow and the heart leaf may rot.", "पानांवर पिवळे-हिरवे चट्टे व रेषा; पाने अरुंद होतात व शेंड्याचे पान कुजू शकते."),
      prevention: prevent("Do not grow cucurbits or other host crops in or next to the banana field, keep weeds down, and pull out affected plants early.", "केळीच्या शेतात किंवा शेजारी वेलवर्गीय व इतर यजमान पिके घेऊ नका, तण नियंत्रण करा आणि बाधित झाडे लवकर उपटा."),
    },
    {
      name: b("Rhizome weevil", "कंद पोखरणारे सोंडे"),
      signs: b("Holes and tunnels in the corm at the base; plants grow weakly, leaves yellow and plants topple.", "बुंध्याच्या कंदात छिद्रे व बोगदे; झाडांची वाढ खुंटते, पाने पिवळी पडतात व झाडे कोलमडतात."),
      prevention: prevent("Use clean planting material, keep the field free of old stems and trash, and use stem traps as advised by your KVK.", "स्वच्छ लागवड साहित्य वापरा, जुनी खोडे व कचरा शेतातून काढा आणि कृषी विज्ञान केंद्राच्या सल्ल्याने खोडाचे सापळे वापरा."),
    },
  ],
  harvestSigns: b(
    "The angles on the fingers become rounded, the fingers turn a lighter green, and the top leaves start to dry. Usually 3–4 months after the bunch comes out.",
    "केळींच्या कडा गोलसर होतात, रंग फिकट हिरवा होतो आणि वरची पाने सुकू लागतात. साधारण घड निसवल्यानंतर 3–4 महिन्यांनी.",
  ),
  postHarvest: b(
    "Keep bunches in shade, handle without bruising, and cut hands from the stalk if the buyer needs them. Wash off latex, grade and pack in padded boxes or crates. Ripen only in a proper ripening chamber.",
    "घड सावलीत ठेवा, न दाबता हाताळा आणि खरेदीदाराला हवे असल्यास फण्या वेगळ्या कापा. चीक धुऊन काढा, प्रतवारी करून आच्छादन असलेल्या खोक्यांत किंवा क्रेटमध्ये भरा. केळी फक्त योग्य पिकवणी कक्षातच पिकवा.",
  ),
  marketTips: b(
    "Clean, spot-free, well-filled bunches from covered bunches fetch more, and export buyers in Jalgaon pay a premium for graded hands in boxes. Plan planting so harvest does not fall in the months when everyone harvests. Selling together through your Mandi Mitra helps get better rates from traders.",
    "पिशवी घातलेल्या, स्वच्छ, डागरहित व चांगल्या भरलेल्या घडांना जास्त दर मिळतो आणि जळगावातील निर्यातदार खोक्यांत भरलेल्या प्रतवारीच्या फण्यांना जादा दर देतात. सगळ्यांची काढणी एकाच वेळी येणार नाही अशा पद्धतीने लागवडीचे नियोजन करा. मंडी मित्रामार्फत एकत्र विकल्यास व्यापाऱ्यांकडून चांगला दर मिळतो.",
  ),
  varieties: [
    { name: "Grand Naine (G-9)", note: b("Most widely planted, mostly as tissue-culture plants; suits export", "सर्वाधिक लागवड, मुख्यतः उती संवर्धित रोपे; निर्यातीस योग्य") },
    { name: "Basrai", note: b("Traditional dwarf variety of Jalgaon", "जळगावचा पारंपरिक बुटका वाण") },
    // TODO: varieties — confirm Shrimanti and other MPKV (Banana Research Station, Jalgaon) selections
  ],
  source: "General practices from MPKV Rahuri (Banana Research Station, Jalgaon) and ICAR-NRC for Banana guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
