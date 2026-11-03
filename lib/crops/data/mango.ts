import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Mango: establishment years, then one yearly crop (flowering in winter, harvest in summer). */
const crop: PerennialCrop = {
  id: "mango",
  emoji: "🥭",
  name: b("Mango", "आंबा"),
  aliases: ["mango", "amba", "aamba", "aam", "aamb", "आंबा", "आंबे", "आम", "hapus", "हापूस", "alphonso", "alfonso", "kesar", "keshar", "केशर", "केसर"],
  category: "fruit",
  lifecycle: "perennial",
  regions: ["konkan", "marathwada"],
  majorDistricts: b(
    "Ratnagiri, Sindhudurg, Raigad (Konkan); Chhatrapati Sambhajinagar, Jalna, Beed (Marathwada)",
    "रत्नागिरी, सिंधुदुर्ग, रायगड (कोकण); छत्रपती संभाजीनगर, जालना, बीड (मराठवाडा)",
  ),
  tier: 1,
  plantingWindow: b("June–August, at the start of the monsoon", "जून–ऑगस्ट, पावसाळ्याच्या सुरुवातीला"),
  plantingMonths: [6, 7, 8],
  plantingMaterial: b("Grafts (softwood or stone grafts) of a known variety from a registered nursery", "नोंदणीकृत रोपवाटिकेतील खात्रीच्या वाणाची कलमे (मृदुकाष्ठ किंवा कोय कलम)"),
  spacing: b(
    "10 m × 10 m in traditional orchards; closer spacing (5 m × 5 m) only in managed high-density orchards with regular pruning",
    "पारंपरिक बागेत 10 मीटर × 10 मीटर; नियमित छाटणी करणाऱ्या घन लागवडीतच कमी अंतर (5 मीटर × 5 मीटर)",
  ),
  plantsPerAcre: [40, 160],
  yearsToFirstHarvest: [4, 5],
  economicLifeYears: [40, 60],
  soil: b(
    "Deep, well-drained soil. In Konkan it grows well on red laterite soil on slopes. Avoid soil where water stands in the monsoon.",
    "खोल, पाण्याचा चांगला निचरा होणारी जमीन. कोकणात उताराच्या जांभ्या (लाल) जमिनीत चांगला येतो. पावसाळ्यात पाणी साचणारी जमीन टाळा.",
  ),
  climate: b(
    "Needs a dry, cool winter for good flowering and a hot summer for ripening. Cloudy weather, dew and unseasonal rain at flowering bring hoppers and powdery mildew.",
    "चांगल्या मोहोरासाठी कोरडा, थंड हिवाळा व फळे पिकण्यासाठी उष्ण उन्हाळा लागतो. मोहोराच्या वेळी ढगाळ हवा, दव व अवकाळी पावसामुळे तुडतुडे व भुरी वाढते.",
  ),
  irrigation: b(
    "Young plants need regular water in the dry months for the first 3–4 years. In bearing trees, stop water after the monsoon until flowering. After fruit set, give a few light irrigations (or drip) every 2–3 weeks until harvest — this cuts fruit drop.",
    "पहिली 3–4 वर्षे कोरड्या महिन्यांत लहान झाडांना नियमित पाणी द्या. फळधारणा करणाऱ्या झाडांना पावसाळ्यानंतर मोहोर येईपर्यंत पाणी देऊ नका. फळधारणेनंतर काढणीपर्यंत दर 2–3 आठवड्यांनी हलके पाणी (किंवा ठिबक) द्या — त्यामुळे फळगळ कमी होते.",
  ),
  nutrientGuide: b(
    "Base it on a soil test. Give well-rotted farmyard manure every year in a ring trench around the tree at the start of the monsoon, and increase the amount with the age of the tree. Fertiliser is given in the monsoon while the soil is moist. Ask your agriculture officer for amounts. Some Konkan farmers use a growth regulator for regular flowering — use it only on the advice of Dr. BSKKV Dapoli or your KVK.",
    "माती परीक्षणावर आधारित खत द्या. दरवर्षी पावसाळ्याच्या सुरुवातीला झाडाभोवती चर काढून चांगले कुजलेले शेणखत द्या आणि झाडाच्या वयानुसार प्रमाण वाढवा. जमिनीत ओलावा असताना पावसाळ्यात रासायनिक खत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा. नियमित मोहोरासाठी काही कोकणातील शेतकरी संजीवक वापरतात — ते फक्त डॉ. बाळासाहेब सावंत कोकण कृषी विद्यापीठ किंवा कृषी विज्ञान केंद्राच्या सल्ल्यानेच वापरा.",
  ),
  varieties: [
    { name: "Alphonso (Hapus)", note: b("The famous Konkan mango; grown mainly in Ratnagiri, Sindhudurg and Raigad", "कोकणातील प्रसिद्ध आंबा; मुख्यतः रत्नागिरी, सिंधुदुर्ग व रायगडमध्ये") },
    { name: "Kesar", note: b("Widely planted in Marathwada; sweet, saffron-coloured pulp", "मराठवाड्यात मोठ्या प्रमाणावर लागवड; गोड, केशरी गराचा आंबा") },
    { name: "Ratna", note: b("Hybrid released by Dr. BSKKV Dapoli; free from spongy tissue", "डॉ. बाळासाहेब सावंत कोकण कृषी विद्यापीठ, दापोलीचा संकरित वाण; साका होत नाही") },
    { name: "Sindhu", note: b("Released by Dr. BSKKV Dapoli; very thin stone, no spongy tissue", "डॉ. बाळासाहेब सावंत कोकण कृषी विद्यापीठ, दापोलीचा वाण; अतिशय पातळ कोय, साका होत नाही") },
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Grafts are planted in pits at the start of the monsoon and take root.", "पावसाळ्याच्या सुरुवातीला कलमे खड्ड्यांत लावली जातात व मूळ धरतात."], [
      t("mg-pit", 0, "other", ["Plant the graft in a filled pit", "भरलेल्या खड्ड्यात कलम लावा"], ["Fill the pit with topsoil and well-rotted manure. Keep the graft joint well above the soil and tie the plant to a stake.", "खड्डा वरची माती व कुजलेल्या शेणखताने भरा. कलमाचा जोड मातीच्या बराच वर ठेवा आणि रोप काठीला बांधा."]),
      t("mg-drain", 5, "other", ["Make sure water drains away", "पाणी निघून जाईल याची खात्री करा"], ["Shape the soil so rainwater does not stand around the young plant.", "लहान रोपाभोवती पावसाचे पाणी साचणार नाही अशी माती लावा."]),
      t("mg-gap0", 25, "other", ["Replace dead grafts", "मेलेली कलमे बदला"], ["Fill gaps in the same monsoon so the orchard grows evenly.", "बाग एकसारखी वाढावी म्हणून त्याच पावसाळ्यात खाडे भरा."]),
    ], [["Termites at the roots", "मुळांना वाळवी"], ["Rootstock shoots growing below the graft joint", "कलम जोडाच्या खालून खुंटाची फूट येणे"]]),
    stage("young-plant", ["Young plant care", "लहान झाडाची निगा"], 30, 365, ["The graft grows its first branches. Protect it from sun, dry weather and grazing animals.", "कलमाला पहिल्या फांद्या फुटतात. ऊन, कोरडेपणा व जनावरांपासून संरक्षण करा."], [
      t("mg-sucker", 45, "other", ["Remove shoots below the graft joint", "जोडाखालची फूट काढा"], ["Shoots from the rootstock steal food from the variety. Cut them off as soon as you see them.", "खुंटाची फूट वाणाचे अन्न घेते. दिसताच काढून टाका."], 45),
      t("mg-mulch", 150, "other", ["Mulch the basin", "आळ्यात आच्छादन करा"], ["After the rains, cover the basin with dry grass or leaves to keep moisture.", "पाऊस संपल्यावर ओलावा टिकवण्यासाठी आळ्यात वाळलेले गवत किंवा पाला टाका."]),
      t("mg-irr1", 160, "irrigation", ["Water in the dry months", "कोरड्या महिन्यांत पाणी द्या"], ["Give water every 1–2 weeks in winter and summer so the young plant does not dry.", "हिवाळ्यात व उन्हाळ्यात दर 1–2 आठवड्यांनी पाणी द्या, म्हणजे लहान झाड सुकणार नाही."], 10),
      t("mg-obs1", 60, "observation", ["Check new leaves", "नवी पालवी तपासा"], ["Look for leaf-eating caterpillars, leaf webbers and stem borer holes.", "पाने खाणाऱ्या अळ्या, पाने गुंडाळणाऱ्या अळ्या व खोडावर छिद्रे आहेत का पाहा."], 30),
    ], [["Leaf webber on new growth", "नव्या पालवीवर पाने गुंडाळणारी अळी"], ["Drying in summer heat", "उन्हाळ्यात झाड सुकणे"]]),
    stage("training", ["Shaping the tree", "झाडाला आकार देणे"], 365, 1095, ["The tree builds a strong, open frame. Flowers that come now are removed so the tree grows.", "झाडाचा मजबूत, मोकळा सांगाडा तयार होतो. आता येणारा मोहोर काढला जातो, म्हणजे झाड वाढते."], [
      t("mg-train", 400, "other", ["Train the main branches", "मुख्य फांद्यांना आकार द्या"], ["Keep 3–4 well-spaced main branches; remove crowded, crossing and low branches.", "चांगल्या अंतरावरील 3–4 मुख्य फांद्या ठेवा; दाट, एकमेकांत घुसणाऱ्या व खालच्या फांद्या काढा."], 365),
      t("mg-deflower", 540, "other", ["Remove early flowers", "लवकरचा मोहोर काढा"], ["Break off flowers in the first 3 years so the tree puts its strength into growth.", "पहिल्या 3 वर्षांत मोहोर खुडून टाका, म्हणजे झाड वाढीकडे जोर देते."], 365),
      t("mg-fym1", 700, "fertiliser", ["Give manure in the monsoon", "पावसाळ्यात शेणखत द्या"], ["Apply well-rotted manure in a ring around the tree each monsoon; ask your agriculture officer for fertiliser amounts by age.", "दर पावसाळ्यात झाडाभोवती गोलाकार कुजलेले शेणखत द्या; वयानुसार खताचे प्रमाण कृषी अधिकाऱ्यांना विचारा."], 365),
      t("mg-irr2", 370, "irrigation", ["Water in the dry season", "कोरड्या हंगामात पाणी द्या"], ["Keep watering young trees in winter and summer; reduce as the tree grows deeper roots.", "हिवाळ्यात व उन्हाळ्यात लहान झाडांना पाणी देत राहा; मुळे खोल गेल्यावर कमी करा."], 14),
    ], [["Stem borer: holes and sawdust on the trunk", "खोडकिडा: खोडावर छिद्रे व भुसा"], ["Powdery mildew on new leaves", "नव्या पानांवर भुरी"]]),
    stage("first-crop", ["Preparing for the first crop", "पहिल्या पिकाची तयारी"], 1095, 1460, ["The tree is ready to carry its first real crop.", "झाड पहिले खरे पीक घेण्यास तयार होते."], [
      t("mg-plan", 1095, "observation", ["Plan the first crop", "पहिल्या पिकाचे नियोजन करा"], ["Let the tree flower this winter if it is healthy and well-sized; keep only a light crop the first year.", "झाड निरोगी व पुरेसे मोठे असल्यास या हिवाळ्यात मोहोर ठेवा; पहिल्या वर्षी हलकेच पीक ठेवा."]),
      t("mg-clean", 1100, "other", ["Clean the orchard", "बाग स्वच्छ करा"], ["Remove dry and diseased branches and weeds so pests have fewer hiding places.", "किडींना लपायला जागा राहू नये म्हणून वाळलेल्या, रोगट फांद्या व तण काढा."]),
    ], [["Mango hopper at first flowering", "पहिल्या मोहोरावर तुडतुडे"]]),
  ],
  cycles: [
    {
      key: "yearly",
      name: b("Yearly crop", "वार्षिक हंगाम"),
      startMonths: [10, 11],
      startEvent: b("After the monsoon: clean the orchard, stop irrigation and let the tree rest before flowering", "पावसाळ्यानंतर: बाग स्वच्छ करा, पाणी बंद करा आणि मोहोरापूर्वी झाडाला विश्रांती द्या"),
      harvestMonths: [4, 5, 6],
      note: b(
        "Flowering comes in December–February. Alphonso in Konkan is picked mainly in April–May; Kesar in Marathwada mainly in May–June.",
        "मोहोर डिसेंबर–फेब्रुवारीत येतो. कोकणातील हापूसची काढणी मुख्यतः एप्रिल–मे मध्ये; मराठवाड्यातील केशरची मुख्यतः मे–जूनमध्ये.",
      ),
      stages: [
        stage("rest", ["Post-monsoon rest", "पावसाळ्यानंतरची विश्रांती"], 0, 60, ["Shoots harden and the tree gets ready to flower. Dry weather helps.", "फांद्या पक्क्या होतात आणि झाड मोहोरासाठी तयार होते. कोरडे हवामान मदत करते."], [
          t("mgy-clean", 0, "other", ["Clean and prune lightly", "स्वच्छता व हलकी छाटणी"], ["Cut dry, diseased and crossing branches and remove weeds and climbers from the tree.", "वाळलेल्या, रोगट व एकमेकांत घुसणाऱ्या फांद्या छाटा; झाडावरील वेली व तण काढा."]),
          t("mgy-nowater", 5, "other", ["Do not irrigate", "पाणी देऊ नका"], ["Water now brings new leaves instead of flowers. Wait until flowering.", "आता पाणी दिल्यास मोहोराऐवजी नवी पालवी येते. मोहोर येईपर्यंत थांबा."]),
          t("mgy-obs1", 20, "observation", ["Check for hoppers on the trunk", "खोडावर तुडतुडे तपासा"], ["Hoppers hide on the bark before flowering. Note how many you see.", "मोहोरापूर्वी तुडतुडे खोडाच्या सालीवर लपतात. किती दिसतात त्याची नोंद ठेवा."], 15),
        ], [["Hoppers resting on the bark", "सालीवर बसलेले तुडतुडे"]]),
        stage("flowering", ["Flowering (mohor)", "मोहोर"], 60, 120, ["Flower panicles come out and open. This is the most delicate time of the year.", "मोहोर फुटतो व उमलतो. वर्षातील हा सर्वात नाजूक काळ आहे."], [
          t("mgy-obs2", 60, "observation", ["Check the flowers every week", "दर आठवड्याला मोहोर तपासा"], ["Look for hoppers jumping from the flowers, sticky honeydew, black sooty mould and white powder on flowers.", "मोहोरातून उडणारे तुडतुडे, चिकट गोड स्राव, काळी बुरशी व मोहोरावर पांढरी पावडर आहे का पाहा."], 7),
          t("mgy-bees", 65, "observation", ["Protect pollinators", "परागीभवन करणाऱ्या कीटकांचे संरक्षण करा"], ["Bees and flies set the fruit. Do not spray when flowers are fully open unless your KVK advises it.", "मधमाश्या व माश्या फळधारणा करतात. कृषी विज्ञान केंद्राचा सल्ला नसल्यास पूर्ण उमललेल्या मोहोरावर फवारणी करू नका."]),
          t("mgy-weather", 70, "observation", ["Watch the weather", "हवामानावर लक्ष ठेवा"], ["Cloudy days, dew or unseasonal rain raise the risk of powdery mildew and hoppers. Ask your KVK what to do.", "ढगाळ दिवस, दव किंवा अवकाळी पावसामुळे भुरी व तुडतुड्यांचा धोका वाढतो. काय करावे ते कृषी विज्ञान केंद्राला विचारा."]),
        ], [["Mango hopper", "तुडतुडे"], ["Powdery mildew on flowers", "मोहोरावर भुरी"], ["Thrips on flowers", "मोहोरावर फुलकिडे"]]),
        stage("fruit-set", ["Fruit set (pea to marble size)", "फळधारणा (वाटाणा ते गोटी आकार)"], 120, 150, ["Small fruits form. Many drop naturally; the tree keeps what it can carry.", "लहान फळे लागतात. बरीच नैसर्गिकरीत्या गळतात; झाड पेलेल एवढीच फळे राहतात."], [
          t("mgy-irr1", 120, "irrigation", ["Start light irrigation", "हलके पाणी सुरू करा"], ["Once fruits are pea-sized, give light water every 2–3 weeks. This reduces fruit drop.", "फळे वाटाण्याएवढी झाली की दर 2–3 आठवड्यांनी हलके पाणी द्या. त्यामुळे फळगळ कमी होते."], 15),
          t("mgy-obs3", 125, "observation", ["Check young fruits", "कोवळी फळे तपासा"], ["Look for hoppers, thrips scars and black spots on young fruits.", "कोवळ्या फळांवर तुडतुडे, फुलकिड्यांचे व्रण व काळे डाग पाहा."], 10),
        ], [["Heavy fruit drop in hot, dry wind", "उष्ण कोरड्या वाऱ्याने जास्त फळगळ"]]),
        stage("fruit-growth", ["Fruit growth", "फळांची वाढ"], 150, 200, ["Fruits grow to full size and the stone hardens.", "फळे पूर्ण आकाराची होतात आणि कोय कडक होते."], [
          t("mgy-irr2", 150, "irrigation", ["Keep giving light water", "हलके पाणी देत राहा"], ["Regular light water helps fruit size. Do not flood the basin.", "नियमित हलक्या पाण्याने फळांचा आकार वाढतो. आळ्यात पाणी तुंबवू नका."], 15),
          t("mgy-ff", 160, "observation", ["Set up fruit fly watch", "फळमाशीवर लक्ष ठेवा"], ["Hang fruit fly traps advised by your KVK and pick up fallen fruit every few days.", "कृषी विज्ञान केंद्राने सुचवलेले फळमाशी सापळे लावा आणि दर काही दिवसांनी गळलेली फळे गोळा करा."], 7),
          t("mgy-bag", 170, "other", ["Bag fruits where practical", "शक्य असल्यास फळांना पिशव्या घाला"], ["Paper bags on fruits protect them from fruit fly and spots and give a cleaner skin.", "फळांना कागदी पिशव्या घातल्यास फळमाशी व डागांपासून संरक्षण होते आणि साल स्वच्छ राहते."]),
        ], [["Fruit fly", "फळमाशी"], ["Anthracnose: black spots on fruit", "करपा: फळांवर काळे डाग"]]),
        stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 200, 270, ["Fruits mature and are picked in rounds over several weeks.", "फळे तयार होतात आणि काही आठवड्यांत फेऱ्यांमध्ये काढली जातात."], [
          t("mgy-mat", 200, "observation", ["Check maturity", "पक्वता तपासा"], ["Mature fruits have filled shoulders, a lighter green colour and sink in water. Do not pick early.", "तयार फळाचे खांदे भरलेले, रंग फिकट हिरवा असतो आणि ते पाण्यात बुडते. लवकर काढू नका."]),
          t("mgy-pick", 205, "harvest", ["Pick mature fruit with a picker", "झेल्याने तयार फळे काढा"], ["Pick in the cool morning with a net picker (zela) and keep a short stalk. Do not let fruits fall to the ground.", "सकाळच्या थंड वेळी झेल्याने काढा आणि थोडा देठ ठेवा. फळे जमिनीवर पडू देऊ नका."], 5),
          t("mgy-shade", 206, "other", ["Keep picked fruit in shade", "काढलेली फळे सावलीत ठेवा"], ["Fruit left in the sun after picking is more likely to get spongy tissue. Move it to shade at once.", "काढल्यानंतर उन्हात ठेवलेल्या फळांत साका होण्याची शक्यता वाढते. ताबडतोब सावलीत न्या."]),
        ], [["Spongy tissue in Alphonso", "हापूसमध्ये साका"], ["Fruit fly in ripening fruit", "पिकणाऱ्या फळांत फळमाशी"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Mango hopper", "तुडतुडे"),
      signs: b("Small wedge-shaped insects jump out of the flowers. Flowers dry and drop; a sticky honeydew turns leaves black with sooty mould.", "मोहोरातून लहान पाचरीच्या आकाराचे कीटक उडतात. मोहोर सुकतो व गळतो; चिकट गोड स्रावामुळे पानांवर काळी बुरशी येते."),
      prevention: prevent("Keep the orchard open with pruning so air and sun reach inside, and check the bark and flowers weekly from November.", "छाटणी करून बाग मोकळी ठेवा म्हणजे आत हवा व ऊन पोहोचेल; नोव्हेंबरपासून दर आठवड्याला साल व मोहोर तपासा."),
    },
    {
      name: b("Powdery mildew", "भुरी"),
      signs: b("White powder on flowers, flower stalks and young fruits; flowers turn brown and drop.", "मोहोर, देठ व कोवळ्या फळांवर पांढरी पावडर; मोहोर तपकिरी होऊन गळतो."),
      prevention: prevent("Watch closely in cloudy, cool weather at flowering; remove infected panicles and keep the canopy open.", "मोहोराच्या वेळी ढगाळ, थंड हवामानात बारीक लक्ष ठेवा; रोगट मोहोर काढा आणि झाड मोकळे ठेवा."),
    },
    {
      name: b("Fruit fly", "फळमाशी"),
      signs: b("Small holes and soft brown patches on ripening fruit; maggots inside, fruit rots and drops.", "पिकणाऱ्या फळांवर लहान छिद्रे व मऊ तपकिरी डाग; आत अळ्या, फळ सडून गळते."),
      prevention: prevent("Collect and destroy fallen fruit every few days (bury deep), use fruit fly traps advised by your KVK, bag fruits, and pick at the mature-green stage.", "गळलेली फळे दर काही दिवसांनी गोळा करून खोल पुरा, कृषी विज्ञान केंद्राने सुचवलेले फळमाशी सापळे लावा, फळांना पिशव्या घाला आणि फळे पक्व-हिरवी असताना काढा."),
    },
    {
      name: b("Spongy tissue (saka) in Alphonso", "हापूसमधील साका"),
      signs: b("The fruit looks normal outside, but part of the pulp inside stays white, spongy and sour after ripening.", "फळ बाहेरून चांगले दिसते, पण पिकल्यानंतर आतला काही गर पांढरा, स्पंजसारखा व आंबट राहतो."),
      prevention: b(
        "Pick at the right maturity (not fully ripe on the tree), keep picked fruit out of the sun, and cover the ground under trees with grass mulch to keep the soil cool. Ratna and Sindhu are free of this problem.",
        "योग्य पक्वतेला काढणी करा (झाडावर पूर्ण पिकू देऊ नका), काढलेली फळे उन्हात ठेवू नका, आणि जमीन थंड राहण्यासाठी झाडाखाली गवताचे आच्छादन करा. रत्ना व सिंधू वाणांत साका होत नाही.",
      ),
    },
    {
      name: b("Anthracnose (black spots)", "करपा (काळे डाग)"),
      signs: b("Black spots on leaves, flowers and fruits; spots on ripe fruit spread and rot it.", "पाने, मोहोर व फळांवर काळे डाग; पिकलेल्या फळावरील डाग पसरून फळ सडते."),
      prevention: prevent("Remove and burn dry twigs and diseased leaves, keep the canopy open, and handle fruit gently at harvest.", "वाळलेल्या फांद्या व रोगट पाने काढून जाळा, झाड मोकळे ठेवा आणि काढणीत फळे काळजीपूर्वक हाताळा."),
    },
  ],
  harvestSigns: b(
    "Shoulders are full and raised above the stalk, the skin turns a lighter green, and a mature fruit sinks in water. Usually 3–4 months after fruit set.",
    "फळाचे खांदे भरून देठाच्या वर येतात, सालीचा रंग फिकट हिरवा होतो आणि तयार फळ पाण्यात बुडते. साधारण फळधारणेनंतर 3–4 महिन्यांनी.",
  ),
  postHarvest: b(
    "Keep fruit in shade, let the sap drain from the stalk end, then wash and dry. Grade by size and remove spotted fruit. Ripen in layers of dry straw (adhi) or in a ripening chamber; never use banned chemical powders to ripen. Pack in ventilated boxes with soft padding.",
    "फळे सावलीत ठेवा, देठाकडील चीक निथळू द्या, मग धुऊन कोरडी करा. आकारानुसार प्रतवारी करा व डाग असलेली फळे वेगळी करा. वाळलेल्या गवताच्या आढीत किंवा पिकवणी कक्षात पिकवा; बंदी असलेली रासायनिक पावडर कधीही वापरू नका. मऊ आच्छादन घालून हवेशीर खोक्यांत भरा.",
  ),
  marketTips: b(
    "Early-season fruit gets the highest price. Konkan Alphonso is GI-registered — register as an authorised user to sell under that name. Graded, spot-free fruit in good boxes sells better; selling together through your Mandi Mitra or a farmer group lowers transport cost to Mumbai and Pune markets.",
    "हंगामाच्या सुरुवातीच्या फळांना सर्वाधिक दर मिळतो. कोकणातील हापूसला भौगोलिक मानांकन (GI) आहे — त्या नावाने विकण्यासाठी अधिकृत वापरकर्ता म्हणून नोंदणी करा. प्रतवारी केलेली, डागरहित फळे चांगल्या खोक्यांत जास्त दराने विकली जातात; मंडी मित्र किंवा शेतकरी गटामार्फत एकत्र विकल्यास मुंबई-पुण्याच्या बाजारापर्यंत वाहतूक खर्च कमी होतो.",
  ),
  source: "General practices from Dr. BSKKV Dapoli mango guidance and VNMKV Parbhani",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
