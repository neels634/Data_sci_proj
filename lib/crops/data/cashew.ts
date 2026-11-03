import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Cashew: grafts planted in the monsoon, one crop a year — flowering in winter, nuts picked February–May. */
const crop: PerennialCrop = {
  id: "cashew",
  emoji: "🌰",
  name: b("Cashew", "काजू"),
  aliases: ["cashew", "cashew nut", "cashewnut", "kaju", "kaaju", "काजू", "काजु", "काजू बी"],
  category: "plantation",
  lifecycle: "perennial",
  regions: ["konkan", "western"],
  majorDistricts: b("Sindhudurg, Ratnagiri, Raigad, Kolhapur (Ajra, Chandgad)", "सिंधुदुर्ग, रत्नागिरी, रायगड, कोल्हापूर (आजरा, चंदगड)"),
  tier: 1,
  plantingWindow: b("June–August, after the monsoon has set in", "जून–ऑगस्ट, पाऊस स्थिरावल्यानंतर"),
  plantingMonths: [6, 7, 8],
  plantingMaterial: b("Softwood grafts of a released variety from a university or registered nursery", "विद्यापीठ किंवा नोंदणीकृत रोपवाटिकेतील सुधारित वाणाची मृदुकाष्ठ कलमे"),
  spacing: b("7 m × 7 m, or 8 m × 8 m on good soil; closer planting (5 m × 5 m) only with regular pruning", "7 मीटर × 7 मीटर, चांगल्या जमिनीत 8 मीटर × 8 मीटर; नियमित छाटणी करणार असाल तरच जवळची लागवड (5 मीटर × 5 मीटर)"),
  plantsPerAcre: [64, 160],
  yearsToFirstHarvest: [3, 4],
  economicLifeYears: [25, 35],
  soil: b(
    "Grows well on red laterite soils and hill slopes of Konkan with good drainage. Avoid heavy clay and fields where water stands.",
    "कोकणातील तांबड्या जांभ्या जमिनीत व डोंगरउतारावर चांगला वाढतो. पाण्याचा निचरा हवा. भारी चिकण माती व पाणी साचणारी जमीन टाळा.",
  ),
  climate: b(
    "Warm, humid coastal climate with a clear dry season. Cloudy weather, fog or unseasonal rain during flowering cause flower and nut drop.",
    "उष्ण, दमट किनारी हवामान व स्पष्ट कोरडा हंगाम लागतो. फुलोऱ्यात ढगाळ हवा, धुके किंवा अवकाळी पाऊस आल्यास फुले व बिया गळतात.",
  ),
  irrigation: b(
    "Mostly grown rainfed. Water young grafts in the first 2–3 summers. In bearing trees, a few protective irrigations from flowering to nut set help where water is available.",
    "बहुतेक कोरडवाहू पीक. लहान कलमांना पहिले 2–3 उन्हाळे पाणी द्या. उत्पादनक्षम झाडांना पाणी उपलब्ध असल्यास फुलोऱ्यापासून बी धरेपर्यंत संरक्षित पाणी फायदेशीर ठरते.",
  ),
  nutrientGuide: b(
    "Give well-rotted farmyard manure or compost every year. Apply fertiliser in the monsoon (June–July and again in September) in a ring around the tree, increasing with age. Base it on a soil test; ask your agriculture officer for amounts.",
    "दरवर्षी चांगले कुजलेले शेणखत किंवा कंपोस्ट द्या. खते पावसाळ्यात (जून–जुलै व पुन्हा सप्टेंबर) झाडाभोवती बांगडी पद्धतीने द्या; झाडाच्या वयानुसार प्रमाण वाढवा. माती परीक्षणावर आधारित खत द्या; प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Vengurla-4", note: b("Released by Dr. BSKKV (Regional Fruit Research Station, Vengurla); widely planted in Konkan", "डॉ. बाळासाहेब सावंत कोकण कृषी विद्यापीठ (प्रादेशिक फळ संशोधन केंद्र, वेंगुर्ला) चा वाण; कोकणात मोठी लागवड") },
    { name: "Vengurla-7", note: b("Released by Dr. BSKKV, Vengurla; bold nuts", "डॉ. बाळासाहेब सावंत कोकण कृषी विद्यापीठ, वेंगुर्ला चा वाण; मोठ्या आकाराच्या बिया") },
    { name: "Vengurla-8", note: b("Released by Dr. BSKKV, Vengurla; very bold nuts", "डॉ. बाळासाहेब सावंत कोकण कृषी विद्यापीठ, वेंगुर्ला चा वाण; खूप मोठ्या बिया") },
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 60, ["Grafts are planted in pits at the start of the monsoon and take root.", "पावसाळ्याच्या सुरुवातीला कलमे खड्ड्यांत लावली जातात व मूळ धरतात."], [
      t("cs-pit", 0, "other", ["Plant grafts in filled pits", "भरलेल्या खड्ड्यांत कलमे लावा"], ["Use pits about 60 cm deep filled with topsoil and well-rotted manure. Keep the graft joint above soil and tie the plant to a stake.", "साधारण 60 सेंमी खोल खड्डे वरची माती व कुजलेल्या शेणखताने भरा. कलमाचा जोड मातीच्या वर ठेवा व रोपाला काठीचा आधार द्या."]),
      t("cs-drain", 10, "other", ["Make sure water drains", "पाण्याचा निचरा पाहा"], ["Shape the soil so rainwater does not stand around the graft.", "कलमाभोवती पावसाचे पाणी साचणार नाही अशी माती लावा."]),
      t("cs-gap0", 45, "other", ["Replace dead grafts", "मेलेली कलमे बदला"], ["Replant gaps while the rains continue.", "पाऊस असतानाच खाडे भरा."]),
    ], [["Root rot from water standing in the pit", "खड्ड्यात पाणी साचल्याने मुळकूज"], ["Termites at the roots", "मुळांना वाळवी"]]),
    stage("young-plant", ["Young plant care", "लहान झाडांची निगा"], 60, 730, ["The graft grows its first branches. Shoots from below the graft joint must be removed.", "कलमाला पहिल्या फांद्या येतात. जोडाखालून येणारी फूट काढावी लागते."], [
      t("cs-sprout", 70, "other", ["Remove rootstock shoots", "खुंटावरील फूट काढा"], ["Pinch off any shoot that comes from below the graft joint.", "कलमाच्या जोडाखालून येणारी कोणतीही फूट खुडून टाका."], 30),
      t("cs-mulch", 120, "other", ["Mulch the basin", "आळ्यात आच्छादन करा"], ["Cover the basin with dry leaves or grass after the rains to keep moisture.", "पावसानंतर ओलावा टिकवण्यासाठी आळ्यात वाळलेली पाने किंवा गवत पसरा."]),
      t("cs-irr1", 180, "irrigation", ["Water in summer", "उन्हाळ्यात पाणी द्या"], ["Give water to young grafts every 8–10 days in the dry months, by pot or drip.", "कोरड्या महिन्यांत लहान कलमांना दर 8–10 दिवसांनी घागरीने किंवा ठिबकने पाणी द्या."], 10),
      t("cs-fire", 200, "other", ["Make a fire line", "आगपट्टा करा"], ["Clear dry grass around the plot in summer to protect young plants from fire.", "उन्हाळ्यात लहान झाडांचे आगीपासून संरक्षण व्हावे म्हणून बागेभोवती वाळलेले गवत काढा."]),
      t("cs-obs1", 90, "observation", ["Check new shoots", "नवीन फूट तपासा"], ["Look for drying tender shoots (tea mosquito bug) and leaf miner damage.", "कोवळी फूट सुकणे (ढेकण्या) व पाने पोखरणारी अळी आहे का पाहा."], 30),
    ], [["Tea mosquito bug drying new shoots", "ढेकण्यामुळे नवी फूट सुकणे"], ["Fire in dry grass", "वाळलेल्या गवताला आग"]]),
    stage("training", ["Training the frame", "झाडाला आकार देणे"], 730, 1095, ["Low branches and crowded shoots are cut so the tree forms an open frame. Early flowers are removed.", "खालच्या व दाटीच्या फांद्या छाटून झाडाला मोकळा आकार दिला जातो. लवकर आलेली फुले काढली जातात."], [
      t("cs-train", 760, "other", ["Shape the tree", "झाडाला आकार द्या"], ["Keep a clean trunk up to about 1 m. Remove low, dry and crossing branches after the monsoon.", "साधारण 1 मीटरपर्यंत खोड मोकळे ठेवा. पावसाळ्यानंतर खालच्या, वाळलेल्या व एकमेकांत घुसणाऱ्या फांद्या काढा."]),
      t("cs-flrm", 830, "other", ["Remove early flower bunches", "लवकरचे मोहोर काढा"], ["In the second winter, remove flowers so the tree grows a stronger frame.", "दुसऱ्या हिवाळ्यात मोहोर काढा, म्हणजे झाडाचा सांगाडा मजबूत होईल."]),
      t("cs-obs2", 740, "observation", ["Check the trunk base", "खोडाचा बुंधा तपासा"], ["Look for gum, powdery waste and holes at the base — signs of stem and root borer.", "बुंध्याजवळ डिंक, भुसा व छिद्रे — खोड व मूळ पोखरणाऱ्या किडीची लक्षणे — आहेत का पाहा."], 30),
    ], [["Stem and root borer", "खोड व मूळ पोखरणारी कीड"]]),
  ],
  cycles: [
    {
      key: "yearly",
      name: b("Yearly crop", "वार्षिक हंगाम"),
      startMonths: [10],
      startEvent: b("Cleaning and light pruning after the monsoon, in October", "पावसाळ्यानंतर ऑक्टोबरमध्ये बागेची स्वच्छता व हलकी छाटणी"),
      harvestMonths: [2, 3, 4, 5],
      note: b("Flowering runs December–February; nuts are picked February–May. Unseasonal rain or fog at flowering lowers the crop.", "मोहोर डिसेंबर–फेब्रुवारी; बिया फेब्रुवारी–मे मध्ये वेचल्या जातात. मोहोरात अवकाळी पाऊस किंवा धुके आल्यास उत्पादन घटते."),
      stages: [
        stage("post-monsoon", ["After-monsoon care", "पावसाळ्यानंतरची निगा"], 0, 40, ["The orchard is cleaned and the tree gets ready for new shoots.", "बाग स्वच्छ केली जाते व झाड नवीन फुटीसाठी तयार होते."], [
          t("cs-clean", 0, "other", ["Clean the orchard", "बाग स्वच्छ करा"], ["Cut grass and weeds, remove dry and diseased branches, and clear the basins.", "गवत व तण कापा, वाळलेल्या व रोगट फांद्या काढा व आळी स्वच्छ करा."]),
          t("cs-fym", 10, "fertiliser", ["Check manure plan", "खत नियोजन तपासा"], ["If the September fertiliser part was missed, give it now while the soil is moist.", "सप्टेंबरचा खत हप्ता राहिला असल्यास जमिनीत ओल असतानाच आता द्या."]),
          t("cs-borer", 20, "observation", ["Check for stem borer", "खोडकिडा तपासा"], ["Look at the trunk base for gum and powder. Clean out and treat affected trees early.", "बुंध्याजवळ डिंक व भुसा पाहा. बाधित झाडांची लवकर साफसफाई व उपाय करा."]),
        ], [["Stem and root borer", "खोड व मूळ पोखरणारी कीड"]]),
        stage("flush", ["New flush", "नवीन पालवी"], 40, 70, ["New shoots come out; flower bunches form at their tips.", "नवीन फूट येते; तिच्या टोकाला मोहोर तयार होतो."], [
          t("cs-obs3", 40, "observation", ["Check new shoots", "नवीन पालवी तपासा"], ["Tea mosquito bug causes black streaks and drying of tender shoots. Check every week.", "ढेकण्यामुळे कोवळ्या फुटीवर काळे चट्टे पडून ती सुकते. दर आठवड्याला तपासा."], 7),
          t("cs-weed", 45, "weeding", ["Keep basins clean", "आळी स्वच्छ ठेवा"], ["Remove weeds and keep dry leaves as mulch.", "तण काढा व वाळलेली पाने आच्छादन म्हणून ठेवा."]),
        ], [["Tea mosquito bug", "ढेकण्या (टी मॉस्किटो बग)"], ["Leaf miner on tender leaves", "कोवळ्या पानांत पाने पोखरणारी अळी"]]),
        stage("flowering", ["Flowering and fruit set", "मोहोर व फळधारणा"], 70, 130, ["Flower bunches open and small nuts set. This is the most sensitive stage.", "मोहोर फुलतो व लहान बिया धरतात. हा सर्वात नाजूक टप्पा आहे."], [
          t("cs-obs4", 70, "observation", ["Check flower bunches", "मोहोर तपासा"], ["Look for drying, blackened flower bunches (tea mosquito bug, thrips) and spots after foggy weather.", "मोहोर सुकणे, काळा पडणे (ढेकण्या, फुलकिडे) व धुक्यानंतरचे ठिपके पाहा."], 7),
          t("cs-bees", 75, "observation", ["Protect pollinators", "परागीभवन करणाऱ्या कीटकांचे संरक्षण"], ["Bees and other insects help nut set. Avoid spraying in the morning when flowers are open.", "मधमाश्या व इतर कीटक बी धरण्यास मदत करतात. सकाळी फुले उमललेली असताना फवारणी टाळा."]),
          t("cs-irr2", 80, "irrigation", ["Protective water if available", "शक्य असल्यास संरक्षित पाणी"], ["Where water is available, light watering every 15–20 days helps nut set.", "पाणी उपलब्ध असल्यास दर 15–20 दिवसांनी हलके पाणी दिल्यास बी चांगली धरते."], 20),
        ], [["Tea mosquito bug drying flowers", "ढेकण्यामुळे मोहोर सुकणे"], ["Flower drop after fog or rain", "धुके किंवा पावसानंतर मोहोर गळणे"]]),
        stage("nut-growth", ["Nut and apple growth", "बी व बोंडू वाढ"], 130, 160, ["The nut grows first, then the fleshy apple swells and colours.", "आधी बी वाढते, मग रसाळ बोंडू फुगून रंग धरतो."], [
          t("cs-obs5", 130, "observation", ["Check young nuts", "कोवळ्या बिया तपासा"], ["Look for shrivelled nuts and black spots on apples.", "सुरकुतलेल्या बिया व बोंडूवर काळे ठिपके आहेत का पाहा."], 10),
          t("cs-floor", 145, "other", ["Clean the ground under trees", "झाडाखालची जमीन साफ करा"], ["Clear the ground so fallen nuts are easy to collect.", "गळलेल्या बिया सहज गोळा करता याव्यात म्हणून झाडाखाली साफसफाई करा."]),
        ], [["Nut drop", "बिया गळणे"]]),
        stage("harvest", ["Harvest", "काढणी"], 160, 230, ["Ripe apples fall with the nut; nuts are collected in rounds.", "पिकलेले बोंडू बीसह गळून पडतात; बिया फेऱ्यांनी गोळा केल्या जातात."], [
          t("cs-pick", 160, "harvest", ["Collect fallen nuts", "गळलेल्या बिया गोळा करा"], ["Collect nuts every 2–3 days. Twist the nut off the apple.", "दर 2–3 दिवसांनी बिया गोळा करा. बोंडूपासून बी पिळून वेगळी करा."], 3),
          t("cs-dry", 162, "other", ["Sun-dry the nuts", "बिया उन्हात वाळवा"], ["Dry nuts in the sun for 2–3 days before storing in gunny bags.", "पोत्यांत साठवण्यापूर्वी बिया 2–3 दिवस उन्हात वाळवा."], 7),
          t("cs-apple", 165, "other", ["Use the cashew apples", "बोंडूचा वापर करा"], ["Apples spoil within a day; sell them to processors for juice or other products if a buyer is nearby.", "बोंडू एका दिवसात खराब होतात; जवळ प्रक्रिया उद्योग असल्यास रस किंवा इतर पदार्थांसाठी विका."]),
        ], [["Nuts spoiling if stored wet", "ओल्या बिया साठवल्याने खराब होणे"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Tea mosquito bug", "ढेकण्या (टी मॉस्किटो बग)"),
      signs: b("Black streaks and patches on tender shoots, flower bunches and young nuts; they dry up.", "कोवळी फूट, मोहोर व लहान बियांवर काळे चट्टे व डाग; ती सुकतात."),
      prevention: prevent("Check shoots and flowers weekly from the new flush onwards. Keep the orchard clean and act early when damage starts.", "नवीन पालवीपासून दर आठवड्याला फूट व मोहोर तपासा. बाग स्वच्छ ठेवा आणि नुकसान दिसू लागताच लवकर उपाय करा."),
    },
    {
      name: b("Stem and root borer", "खोड व मूळ पोखरणारी कीड"),
      signs: b("Gum and powdery waste at the trunk base, holes in the bark, yellowing leaves; the tree may die.", "बुंध्याजवळ डिंक व भुसा, सालीला छिद्रे, पाने पिवळी; झाड मरू शकते."),
      prevention: prevent("Check trunks after the monsoon and again in spring. Clean out the grubs from early damage, and remove and burn dead trees.", "पावसाळ्यानंतर व पुन्हा वसंतात खोडे तपासा. सुरुवातीच्या नुकसानीतून अळ्या काढून टाका आणि मेलेली झाडे काढून जाळा."),
    },
    {
      name: b("Thrips", "फुलकिडे"),
      signs: b("Scabby, brown scars on flowers, nuts and apples; leaves turn pale.", "फुले, बिया व बोंडूवर खरबडीत तपकिरी व्रण; पाने फिकट पडतात."),
      prevention: prevent("Inspect flower bunches weekly in dry weather and keep weeds down.", "कोरड्या हवामानात दर आठवड्याला मोहोर तपासा व तण नियंत्रणात ठेवा."),
    },
    {
      name: b("Anthracnose (flower and nut blight)", "करपा (मोहोर व बी करपणे)"),
      signs: b("Dark spots on flowers, nuts and apples after fog or unseasonal rain; flowers dry and drop.", "धुके किंवा अवकाळी पावसानंतर मोहोर, बिया व बोंडूवर काळपट ठिपके; मोहोर सुकून गळतो."),
      prevention: prevent("Remove dry twigs and diseased parts, keep the canopy open for air, and watch closely after cloudy or foggy days.", "वाळलेल्या फांद्या व रोगट भाग काढा, हवा खेळती राहील अशी छाटणी करा आणि ढगाळ किंवा धुक्याच्या दिवसांनंतर बारकाईने पाहणी करा."),
    },
  ],
  harvestSigns: b(
    "The cashew apple turns fully yellow or red and the nut turns grey and hard; ripe apples drop with the nut about 2 months after flowering.",
    "बोंडू पूर्ण पिवळा किंवा लाल होतो व बी करडी आणि कडक होते; फुलोऱ्यानंतर साधारण 2 महिन्यांनी पिकलेले बोंडू बीसह गळतात.",
  ),
  postHarvest: b(
    "Separate nuts from apples on the same day. Sun-dry nuts for 2–3 days until they rattle, remove immature and damaged nuts, and store in dry gunny bags on a raised platform.",
    "त्याच दिवशी बोंडूपासून बिया वेगळ्या करा. बिया खुळखुळेपर्यंत 2–3 दिवस उन्हात वाळवा, अपरिपक्व व खराब बिया काढा आणि कोरड्या पोत्यांत उंच फळीवर साठवा.",
  ),
  marketTips: b(
    "Well-dried, bold nuts fetch a better rate from processing units. Early-season nuts (February–March) often sell higher. Selling together through a group or Mandi Mitra helps get a fair price from processors.",
    "चांगल्या वाळवलेल्या, मोठ्या बियांना प्रक्रिया उद्योगांकडून चांगला दर मिळतो. हंगामाच्या सुरुवातीच्या (फेब्रुवारी–मार्च) बियांना अनेकदा जास्त दर मिळतो. गट किंवा मंडी मित्रामार्फत एकत्र विकल्यास प्रक्रियादारांकडून योग्य दर मिळण्यास मदत होते.",
  ),
  source: "General practices from Dr. BSKKV Dapoli (Regional Fruit Research Station, Vengurla) cashew guidance and ICAR-Directorate of Cashew Research",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
