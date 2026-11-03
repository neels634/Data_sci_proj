import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Coconut: bunches open every month, so nuts are harvested through the year. One yearly care cycle. */
const crop: PerennialCrop = {
  id: "coconut",
  emoji: "🥥",
  name: b("Coconut", "नारळ"),
  aliases: ["coconut", "coconut palm", "naral", "naaral", "nariyal", "nariyel", "नारळ", "नारियल", "माड"],
  category: "plantation",
  lifecycle: "perennial",
  regions: ["konkan"],
  majorDistricts: b("Sindhudurg, Ratnagiri, Raigad, Palghar, Thane", "सिंधुदुर्ग, रत्नागिरी, रायगड, पालघर, ठाणे"),
  tier: 1,
  plantingWindow: b("May–June, just before or with the first monsoon rains; any time with assured irrigation", "मे–जून, पहिल्या पावसाच्या आधी किंवा सोबत; खात्रीचे पाणी असल्यास कधीही"),
  plantingMonths: [5, 6, 7],
  plantingMaterial: b("Healthy 9–12 month old seedlings with 5–6 leaves and an early-splitting leaf, from a university or registered nursery", "विद्यापीठ किंवा नोंदणीकृत रोपवाटिकेतील 9–12 महिन्यांची, 5–6 पाने असलेली निरोगी रोपे"),
  spacing: b("7.5 m × 7.5 m in a square; along bunds and field edges at about 7–8 m", "7.5 मीटर × 7.5 मीटर चौरस पद्धतीने; बांधावर साधारण 7–8 मीटर अंतराने"),
  plantsPerAcre: [64, 72],
  yearsToFirstHarvest: [4, 7],
  economicLifeYears: [50, 60],
  soil: b(
    "Sandy coastal soils, laterite and alluvial soils with good drainage and at least 1 m depth. Avoid hard rock just below the surface and waterlogged land.",
    "किनाऱ्यावरील रेताड, जांभी व गाळाची, निचरा होणारी व किमान 1 मीटर खोल जमीन. खाली लगेच कठीण खडक असलेली व पाणी साचणारी जमीन टाळा.",
  ),
  climate: b(
    "Warm, humid coastal climate with well-spread rain. Long dry spells in summer reduce the number of nuts the following year.",
    "उष्ण, दमट किनारी हवामान व सर्वत्र पसरलेला पाऊस. उन्हाळ्यात दीर्घ कोरडा काळ पडल्यास पुढच्या वर्षी नारळांची संख्या घटते.",
  ),
  irrigation: b(
    "Rainfed in the monsoon. From November to May give water every 4–8 days in basins or by drip; summer watering decides next year's crop. Young palms need regular water.",
    "पावसाळ्यात पावसावर. नोव्हेंबर ते मे दर 4–8 दिवसांनी आळ्यात किंवा ठिबकने पाणी द्या; उन्हाळ्यातील पाण्यावर पुढच्या वर्षीचे उत्पादन ठरते. लहान माडांना नियमित पाणी लागते.",
  ),
  nutrientGuide: b(
    "Give well-rotted farmyard manure or compost and green leaf manure every year in a ring basin about 1.5–2 m from the trunk. Split fertiliser into 2–3 parts during and after the monsoon. Common salt is traditionally given on Konkan laterite soils — ask your agriculture officer whether it suits your soil and for all amounts.",
    "दरवर्षी चांगले कुजलेले शेणखत किंवा कंपोस्ट व हिरवळीचे खत खोडापासून साधारण 1.5–2 मीटरवर बांगडी आळ्यात द्या. खते पावसाळ्यात व नंतर 2–3 हप्त्यांत द्या. कोकणातील जांभ्या जमिनीत पारंपरिकपणे मीठ दिले जाते — ते आपल्या जमिनीला योग्य आहे का व सर्व प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Banawali (West Coast Tall)", note: b("The local tall coconut of Konkan; long-lived, good copra", "कोकणातील स्थानिक उंच जात; दीर्घायुषी, चांगले खोबरे") },
    { name: "Pratap", note: b("Tall variety released by Dr. BSKKV (Regional Coconut Research Station, Bhatye, Ratnagiri)", "डॉ. बाळासाहेब सावंत कोकण कृषी विद्यापीठ (प्रादेशिक नारळ संशोधन केंद्र, भाट्ये, रत्नागिरी) चा उंच वाण") },
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 90, ["Seedlings are set in large pits and take root through the monsoon.", "रोपे मोठ्या खड्ड्यांत लावली जातात व पावसाळ्यात मूळ धरतात."], [
      t("co-pit", 0, "other", ["Plant the seedling", "रोप लावा"], ["Use a pit about 1 m × 1 m × 1 m filled to half with topsoil, manure and husk. Plant the nut in the centre and press soil firmly around it.", "साधारण 1 मीटर × 1 मीटर × 1 मीटर खड्डा अर्धा वरची माती, शेणखत व सोडणाने भरा. मध्यभागी रोप लावून भोवती माती घट्ट दाबा."]),
      t("co-shade", 2, "other", ["Shade the young seedling", "रोपाला सावली करा"], ["Give shade with coconut leaves until the seedling settles.", "रोप स्थिरावेपर्यंत झावळ्यांनी सावली करा."]),
      t("co-drain", 20, "observation", ["Check for standing water", "पाणी साचले का पाहा"], ["Water must not stand in the pit; open a drain if it does.", "खड्ड्यात पाणी साचू नये; साचत असल्यास चर काढा."], 15),
    ], [["Seedling rot from standing water", "पाणी साचल्याने रोप कुजणे"], ["Termites", "वाळवी"]]),
    stage("young-palm", ["Young palm care", "लहान माडाची निगा"], 90, 1095, ["The palm builds its stem base and leaves. Regular water and manure decide how early it bears.", "माडाचा बुंधा व पाने तयार होतात. नियमित पाणी व खतावर तो किती लवकर फळावर येईल ते ठरते."], [
      t("co-irr1", 120, "irrigation", ["Water in the dry months", "कोरड्या महिन्यांत पाणी द्या"], ["Water young palms every 3–4 days in summer.", "उन्हाळ्यात लहान माडांना दर 3–4 दिवसांनी पाणी द्या."], 4),
      t("co-fym1", 365, "fertiliser", ["Yearly manure", "वार्षिक शेणखत"], ["Give well-rotted manure in the basin every monsoon, increasing with age.", "दर पावसाळ्यात आळ्यात कुजलेले शेणखत द्या; वयानुसार प्रमाण वाढवा."], 365),
      t("co-inter", 100, "other", ["Grow intercrops", "आंतरपिके घ्या"], ["Vegetables, pulses or banana can be grown between young palms; keep them away from the basin.", "लहान माडांमध्ये भाजीपाला, कडधान्ये किंवा केळी घेता येतात; ती आळ्यापासून दूर ठेवा."]),
      t("co-obs1", 150, "observation", ["Check the crown", "माडाचा शेंडा तपासा"], ["Look for V-shaped cuts on leaves and holes at the crown (rhinoceros beetle).", "पानांवर V आकाराचे काप व शेंड्याजवळ छिद्रे (गेंड्या भुंगा) पाहा."], 30),
    ], [["Rhinoceros beetle", "गेंड्या भुंगा"], ["Drying of young palms in summer", "उन्हाळ्यात लहान माड सुकणे"]]),
    stage("pre-bearing", ["Before first bunches", "पहिले घड येण्यापूर्वी"], 1095, 1825, ["The palm reaches full leaf size and starts producing flower bunches.", "माडाला पूर्ण आकाराची पाने येतात व पोय (फुलोरा) येऊ लागतो."], [
      t("co-irr2", 1095, "irrigation", ["Summer irrigation", "उन्हाळी पाणी"], ["Water every 4–6 days from November to May.", "नोव्हेंबर ते मे दर 4–6 दिवसांनी पाणी द्या."], 6),
      t("co-clean1", 1100, "other", ["Clean the crown", "शेंडा स्वच्छ करा"], ["Remove dry leaves and old spathes so beetles have fewer hiding places.", "भुंग्यांना लपायला जागा राहू नये म्हणून वाळलेली पाने व जुनी पोयी काढा."], 180),
      t("co-obs2", 1110, "observation", ["Check the trunk and crown", "खोड व शेंडा तपासा"], ["Look for holes with brown fluid on the trunk (red palm weevil) and rotting at the bud.", "खोडावर तपकिरी द्रव गळणारी छिद्रे (लाल सोंड्या भुंगा) व शेंडा कुजणे पाहा."], 30),
    ], [["Red palm weevil", "लाल सोंड्या भुंगा"], ["Bud rot in heavy rain", "जोरदार पावसात शेंडा कुजणे"]]),
  ],
  cycles: [
    {
      key: "yearly",
      name: b("Yearly care (harvest round the year)", "वार्षिक निगा (वर्षभर काढणी)"),
      startMonths: [6],
      startEvent: b("Monsoon manuring and basin cleaning in June", "जूनमध्ये पावसाळी खत व आळे साफ करणे"),
      harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      note: b("A bearing palm opens a new bunch almost every month and each bunch ripens in about 12 months, so nuts are picked every 45–60 days all year. Tender nuts are cut at 6–7 months.", "उत्पादनक्षम माडाला जवळजवळ दर महिन्याला नवा घड येतो व तो साधारण 12 महिन्यांत पिकतो, त्यामुळे वर्षभर दर 45–60 दिवसांनी नारळ उतरवले जातात. शहाळी 6–7 महिन्यांची असताना काढतात."),
      stages: [
        stage("monsoon", ["Monsoon care", "पावसाळी निगा"], 0, 120, ["Rain supports growth; manure is given and basins are opened.", "पावसामुळे वाढ होते; खत दिले जाते व आळी उघडली जातात."], [
          t("co-fym", 0, "fertiliser", ["Give manure and first fertiliser part", "शेणखत व पहिला खत हप्ता द्या"], ["Open the ring basin, add manure and green leaves, and give the first fertiliser part as per soil test.", "बांगडी आळे उघडून शेणखत व हिरवा पाला घाला आणि माती परीक्षणानुसार पहिला खत हप्ता द्या."]),
          t("co-pick1", 5, "harvest", ["Harvest mature nuts", "तयार नारळ उतरवा"], ["Pick bunches that are 11–12 months old, every 45–60 days.", "11–12 महिन्यांचे घड दर 45–60 दिवसांनी उतरवा."], 45),
          t("co-obs3", 15, "observation", ["Check for bud rot", "शेंडा कूज तपासा"], ["In continuous rain, check that the central leaf is not yellowing or rotting.", "सततच्या पावसात मधले पान पिवळे पडत नाही किंवा कुजत नाही ना ते तपासा."], 15),
        ], [["Bud rot", "शेंडा कूज"], ["Nut fall in heavy rain", "जोरदार पावसात नारळ गळणे"]]),
        stage("post-monsoon", ["After-monsoon care", "पावसाळ्यानंतरची निगा"], 120, 180, ["Soil moisture is still good; the second fertiliser part and crown cleaning are done.", "जमिनीत अजून ओल असते; दुसरा खत हप्ता व शेंडा साफसफाई केली जाते."], [
          t("co-fert2", 120, "fertiliser", ["Second fertiliser part", "दुसरा खत हप्ता"], ["Give the second part while the soil is moist; ask your agriculture officer for the amount.", "जमिनीत ओल असतानाच दुसरा हप्ता द्या; प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
          t("co-clean", 125, "other", ["Clean the crown", "शेंडा स्वच्छ करा"], ["Remove dry leaves, spathes and debris from the crown; keep the leaf bases clean.", "शेंड्यातील वाळलेली पाने, पोयी व कचरा काढा; पानांच्या बेचक्या स्वच्छ ठेवा."]),
          t("co-pick2", 130, "harvest", ["Harvest mature nuts", "तयार नारळ उतरवा"], ["Continue picking ripe bunches every 45–60 days.", "दर 45–60 दिवसांनी तयार घड उतरवत राहा."], 45),
        ], [["Rhinoceros beetle", "गेंड्या भुंगा"], ["Eriophyid mite scars on young nuts", "कोळीमुळे लहान नारळांवर चट्टे"]]),
        stage("dry-season", ["Dry-season care", "कोरड्या हंगामातील निगा"], 180, 365, ["No rain; regular irrigation keeps bunches setting for next year.", "पाऊस नसतो; नियमित पाण्यामुळे पुढच्या वर्षासाठी घड धरत राहतात."], [
          t("co-irr", 180, "irrigation", ["Irrigate", "पाणी द्या"], ["Water every 4–8 days in basins or by drip; more often in April–May.", "दर 4–8 दिवसांनी आळ्यात किंवा ठिबकने पाणी द्या; एप्रिल–मे मध्ये जास्त वेळा."], 6),
          t("co-mulch", 182, "other", ["Mulch the basin", "आळ्यात आच्छादन करा"], ["Cover basins with husk or dry leaves to save water; husk buried in trenches holds moisture.", "पाणी वाचवण्यासाठी आळ्यात सोडण किंवा वाळलेली पाने पसरा; चरात पुरलेले सोडण ओल धरून ठेवते."]),
          t("co-pick3", 185, "harvest", ["Harvest mature nuts", "तयार नारळ उतरवा"], ["Keep picking ripe bunches every 45–60 days.", "दर 45–60 दिवसांनी तयार घड उतरवा."], 45),
          t("co-obs4", 190, "observation", ["Check trunk and crown", "खोड व शेंडा तपासा"], ["Look for holes with brown oozing (red palm weevil) and V-shaped leaf cuts (rhinoceros beetle).", "तपकिरी द्रव गळणारी छिद्रे (लाल सोंड्या भुंगा) व V आकाराचे पानांचे काप (गेंड्या भुंगा) पाहा."], 30),
        ], [["Button and nut drop from water stress", "पाण्याच्या ताणाने लहान नारळ गळणे"], ["Red palm weevil", "लाल सोंड्या भुंगा"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Rhinoceros beetle", "गेंड्या भुंगा"),
      signs: b("V-shaped cuts on opened leaves, holes at the crown with chewed fibre coming out.", "उघडलेल्या पानांवर V आकाराचे काप, शेंड्याजवळ छिद्रे व त्यातून चावलेला भुसा बाहेर."),
      prevention: prevent("Keep the crown clean, remove and destroy manure pits and rotting logs where grubs breed, and hook out beetles from holes.", "शेंडा स्वच्छ ठेवा, अळ्या वाढतात असे उघडे शेणखत खड्डे व कुजके ओंडके नष्ट करा आणि छिद्रांतून भुंगे आकड्याने काढा."),
    },
    {
      name: b("Red palm weevil", "लाल सोंड्या भुंगा"),
      signs: b("Holes on the trunk with brown, bad-smelling fluid and chewed fibre; the central leaves wilt.", "खोडावर छिद्रे व त्यांतून दुर्गंधीयुक्त तपकिरी द्रव व भुसा; मधली पाने मलूल होतात."),
      prevention: prevent("Avoid wounds on the trunk, do not cut green leaves close to the stem, and destroy badly infested palms.", "खोडाला जखमा होऊ देऊ नका, हिरवी पाने खोडालगत कापू नका आणि जास्त बाधित माड नष्ट करा."),
    },
    {
      name: b("Eriophyid mite", "कोळी (इरिओफाइड माइट)"),
      signs: b("Yellow triangles near the cap of young nuts that turn brown and cracked; nuts stay small.", "लहान नारळांच्या देठाजवळ पिवळे त्रिकोण, नंतर तपकिरी व तडकलेले; नारळ लहान राहतात."),
      prevention: prevent("Give balanced manure and summer water to keep palms vigorous, and remove fallen affected nuts.", "माड जोमदार राहावा म्हणून संतुलित खत व उन्हाळी पाणी द्या आणि गळलेले बाधित नारळ काढा."),
    },
    {
      name: b("Bud rot", "शेंडा कूज"),
      signs: b("The central spindle leaf turns yellow, then rots with a foul smell and can be pulled out easily.", "मधले गुंडाळलेले पान पिवळे पडते, मग दुर्गंधीसह कुजते व सहज ओढून निघते."),
      prevention: prevent("Clean crowns before the monsoon, remove and burn rotten tissue, and keep good drainage.", "पावसाळ्यापूर्वी शेंडे स्वच्छ करा, कुजलेला भाग काढून जाळा आणि पाण्याचा निचरा चांगला ठेवा."),
    },
  ],
  harvestSigns: b(
    "Mature nuts are about 11–12 months old: the husk turns from green to brown, and a shaken nut gives a sloshing sound. Tender nuts for drinking are cut at 6–7 months while still green.",
    "तयार नारळ साधारण 11–12 महिन्यांचा असतो: सोडण हिरव्यावरून तपकिरी होते व हलवल्यावर पाण्याचा आवाज येतो. शहाळी 6–7 महिन्यांची, हिरवी असतानाच काढतात.",
  ),
  postHarvest: b(
    "Store mature nuts in a dry, shaded place for 1–2 months to season before dehusking. For copra, dry the kernel well in sun or a drier until it is hard and does not bend.",
    "सोलण्यापूर्वी तयार नारळ 1–2 महिने कोरड्या, सावलीच्या जागी ठेवा. खोबऱ्यासाठी गर उन्हात किंवा ड्रायरमध्ये कडक होईपर्यंत चांगला वाळवा.",
  ),
  marketTips: b(
    "Tender nuts sell well in towns and on tourist routes in summer. Large mature nuts get better prices during festivals. Selling as a group or making copra and coconut oil can add value.",
    "उन्हाळ्यात शहरांत व पर्यटन मार्गांवर शहाळ्यांना चांगली मागणी असते. सणांच्या काळात मोठ्या नारळांना चांगला दर मिळतो. गटाने विक्री किंवा खोबरे व खोबरेल तेल तयार केल्यास जास्त फायदा होतो.",
  ),
  source: "General practices from Dr. BSKKV Dapoli (Regional Coconut Research Station, Bhatye) coconut guidance and ICAR-Central Plantation Crops Research Institute",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
