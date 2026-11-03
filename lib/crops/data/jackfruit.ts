import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Jackfruit: large Konkan tree; flowers in winter, fruits ripen in summer before heavy rain. */
const crop: PerennialCrop = {
  id: "jackfruit",
  emoji: "🌳",
  name: b("Jackfruit", "फणस"),
  aliases: ["jackfruit", "jack fruit", "fanas", "phanas", "kathal", "kathhal", "फणस", "फणसं", "कटहल"],
  category: "fruit",
  lifecycle: "perennial",
  regions: ["konkan"],
  majorDistricts: b("Sindhudurg, Ratnagiri, Raigad", "सिंधुदुर्ग, रत्नागिरी, रायगड"),
  tier: 2,
  plantingWindow: b("June–July, with the monsoon", "जून–जुलै, पावसाळ्यात"),
  plantingMonths: [6, 7],
  plantingMaterial: b("Soft-wood or epicotyl grafts of a known variety from a registered nursery", "नोंदणीकृत रोपवाटिकेतील खात्रीच्या वाणाची मृदुकाष्ठ किंवा कोय कलमे"),
  spacing: b("8–10 m between rows and 8–10 m between plants", "दोन ओळींत 8–10 मीटर व दोन झाडांत 8–10 मीटर"),
  plantsPerAcre: [40, 63],
  yearsToFirstHarvest: [4, 6],
  economicLifeYears: [50, 80],
  soil: b(
    "Deep, well-drained lateritic or loamy soil. The tree does not tolerate standing water at the roots.",
    "खोल, पाण्याचा चांगला निचरा होणारी जांभ्या दगडाची किंवा पोयट्याची जमीन. मुळांजवळ साचलेले पाणी झाड सहन करत नाही.",
  ),
  climate: b(
    "Warm, humid coastal climate with good rainfall. Grows well on Konkan slopes.",
    "भरपूर पावसाचे उबदार, दमट किनारी हवामान. कोकणातील उतारांवर चांगले येते.",
  ),
  irrigation: b(
    "Water young trees every 7–10 days from November to May for the first 3–4 years. Bearing trees in the Konkan are mostly rainfed; a few irrigations from fruit set to fruit growth improve size.",
    "पहिली 3–4 वर्षे नोव्हेंबर ते मे लहान झाडांना दर 7–10 दिवसांनी पाणी द्या. कोकणात फळे देणारी झाडे बहुतेक पावसावर; फळधारणेपासून फळवाढीपर्यंत काही पाणी दिल्यास फळांचा आकार वाढतो.",
  ),
  nutrientGuide: b(
    "Give well-rotted farmyard manure or compost in the basin each year at the start of the rains and fertiliser as per soil test. Ask your agriculture officer for amounts.",
    "दरवर्षी पावसाच्या सुरुवातीला आळ्यात चांगले कुजलेले शेणखत किंवा कंपोस्ट द्या आणि माती परीक्षणानुसार खत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Konkan Prolific", note: b("High-yielding variety released by Dr. BSKKV Dapoli", "डॉ. बाळासाहेब सावंत कोकण कृषी विद्यापीठ, दापोलीचा जास्त उत्पादनाचा वाण") },
  ], // TODO: varieties — confirm other recommended Konkan varieties with Dr. BSKKV Dapoli
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Grafts are planted in pits and take root.", "कलमे खड्ड्यांत लावली जातात व मूळ धरतात."], [
      t("jf-pit", 0, "other", ["Plant grafts in prepared pits", "तयार खड्ड्यांत कलमे लावा"], ["Fill pits with topsoil, well-rotted manure and leaf litter; plant with the graft joint above soil and tie to a stick.", "खड्डे वरची माती, कुजलेले शेणखत व पालापाचोळ्याने भरा; कलमाचा जोड जमिनीच्या वर ठेवून लावा व काठीला बांधा."]),
      t("jf-drain", 5, "other", ["Make sure water drains", "पाण्याचा निचरा होतो का पाहा"], ["Make a small channel so rainwater does not stand around the graft.", "कलमाभोवती पावसाचे पाणी साचू नये म्हणून लहान चर काढा."]),
      t("jf-gap", 25, "other", ["Replace dead grafts", "मेलेली कलमे बदला"], ["Fill gaps while the rains last.", "पाऊस असतानाच खाडे भरा."]),
    ], [["Graft rot in waterlogged pits", "पाणी साचलेल्या खड्ड्यात कलम कुजणे"]]),
    stage("training", ["Training the young tree", "झाडाला आकार देणे"], 30, 730, ["The young tree is protected and shaped to a strong single stem.", "लहान झाडाचे संरक्षण करून मजबूत एका खोडाचा आकार दिला जातो."], [
      t("jf-sprout", 45, "other", ["Remove rootstock shoots", "खुंटावरील फुटवे काढा"], ["Rub off shoots from below the graft joint.", "कलमाच्या जोडाखालचे फुटवे काढा."], 45),
      t("jf-irr1", 150, "irrigation", ["Water in the dry months", "कोरड्या महिन्यांत पाणी द्या"], ["Water young trees every 7–10 days from November to May.", "नोव्हेंबर ते मे लहान झाडांना दर 7–10 दिवसांनी पाणी द्या."], 8),
      t("jf-shade", 240, "other", ["Shade young plants in summer", "उन्हाळ्यात लहान झाडांना सावली द्या"], ["Give light shade with dry leaves or a screen in the first summer.", "पहिल्या उन्हाळ्यात वाळलेल्या झावळ्या किंवा पडद्याने हलकी सावली द्या."]),
      t("jf-weed1", 60, "weeding", ["Weed and mulch the basin", "आळे खुरपून आच्छादन करा"], ["Keep basins clean and mulched with leaves.", "आळी स्वच्छ ठेवा व पालापाचोळ्याचे आच्छादन करा."], 60),
    ], [["Sunscald on young stems", "लहान खोडांना उन्हाचा चटका"]]),
    stage("frame", ["Building the frame", "झाडाचा विस्तार"], 730, 1460, ["The tree grows tall; grafts begin to bear in year 4–6.", "झाड उंच वाढते; कलमे 4–6 व्या वर्षी फळावर येतात."], [
      t("jf-fym2", 1060, "fertiliser", ["Give manure", "शेणखत द्या"], ["Apply well-rotted farmyard manure at the start of the rains.", "पावसाच्या सुरुवातीला कुजलेले शेणखत द्या."]),
      t("jf-obs2", 735, "observation", ["Check the trees", "झाडे तपासा"], ["Look for borer holes on the trunk and shoot damage.", "खोडावर छिद्रे व फुटीचे नुकसान पाहा."], 30),
      t("jf-irr2", 880, "irrigation", ["Water in the dry months", "कोरड्या महिन्यांत पाणी द्या"], ["Continue dry-season water until the tree bears.", "झाड फळावर येईपर्यंत कोरड्या हंगामात पाणी चालू ठेवा."], 10),
    ], [["Trunk borer", "खोडकिडा"]]),
  ],
  cycles: [
    {
      key: "yearly",
      name: b("Yearly crop", "वार्षिक बहार"),
      startMonths: [12, 1],
      startEvent: b("Male and female flower spikes appear on the trunk and branches in December–January", "डिसेंबर–जानेवारीत खोड व फांद्यांवर नर व मादी फुलांचे दांडे येतात"),
      harvestMonths: [4, 5, 6, 7],
      note: b("Fruits take about 4–5 months from flowering. Pick before heavy monsoon rain where you can — rain spoils ripening fruit.", "फुलोऱ्यापासून फळांना साधारण 4–5 महिने लागतात. शक्य तिथे जोरदार पावसापूर्वी काढणी करा — पावसाने पिकणारी फळे खराब होतात."),
      stages: [
        stage("flowering", ["Flowering", "फुलोरा"], 0, 40, ["Flower spikes form on the trunk and thick branches.", "खोड व जाड फांद्यांवर फुलांचे दांडे येतात."], [
          t("jfy-clean", 0, "other", ["Clean the trunk", "खोड स्वच्छ करा"], ["Remove dead twigs and old fruit stalks from the trunk and branches.", "खोड व फांद्यांवरचे वाळलेले काटके व जुने देठ काढा."]),
          t("jfy-obs1", 5, "observation", ["Check flower spikes", "फुलांचे दांडे तपासा"], ["Look for black rot on young spikes and caterpillars boring into them.", "कोवळ्या दांड्यांवर काळी सड व आत घुसणाऱ्या अळ्या पाहा."], 7),
        ], [["Spike rot in damp weather", "दमट हवेत दांडे कुजणे"]]),
        stage("fruit-set", ["Fruit set", "फळधारणा"], 40, 75, ["Female spikes swell into young fruits; extra fruits may drop.", "मादी दांडे फुगून कोवळी फळे बनतात; जादा फळे गळू शकतात."], [
          t("jfy-irr1", 40, "irrigation", ["Give water if possible", "शक्य असल्यास पाणी द्या"], ["Water every 10–15 days in dry weather to reduce fruit drop.", "कोरड्या हवेत फळगळ कमी करण्यासाठी दर 10–15 दिवसांनी पाणी द्या."], 12),
          t("jfy-thin", 60, "other", ["Thin crowded fruit", "दाटीची फळे विरळ करा"], ["Remove deformed and very crowded young fruits so the rest grow big.", "वेडीवाकडी व खूप दाटीची कोवळी फळे काढा, म्हणजे उरलेली मोठी होतात."]),
        ], [["Young fruit rot", "कोवळी फळे कुजणे"]]),
        stage("fruit-growth", ["Fruit growth", "फळांची वाढ"], 75, 130, ["Fruits grow large and heavy.", "फळे मोठी व जड होतात."], [
          t("jfy-irr2", 75, "irrigation", ["Give water if possible", "शक्य असल्यास पाणी द्या"], ["A few irrigations improve fruit size.", "काही पाणी दिल्यास फळांचा आकार वाढतो."], 12),
          t("jfy-obs2", 78, "observation", ["Check fruit", "फळे तपासा"], ["Look for borer holes and rot; remove affected fruit.", "छिद्रे व सड पाहा; बाधित फळे काढा."], 10),
          t("jfy-support", 100, "other", ["Support heavy fruit", "जड फळांना आधार द्या"], ["Tie very heavy fruits on thin branches with a cloth sling.", "बारीक फांद्यांवरील खूप जड फळांना कापडाच्या झोळीने आधार द्या."]),
        ], [["Shoot and fruit borer", "फुटी व फळ पोखरणारी अळी"]]),
        stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 130, 170, ["Fruits mature and are cut down carefully.", "फळे तयार होऊन काळजीपूर्वक उतरवली जातात."], [
          t("jfy-mat", 130, "observation", ["Check maturity", "पक्वता तपासा"], ["Spines flatten and spread apart, the fruit gives a dull hollow sound on tapping, and the nearest leaf turns yellow.", "काटे सपाट होऊन विरळ होतात, ठोकल्यावर बद्द पोकळ आवाज येतो आणि जवळचे पान पिवळे पडते."]),
          t("jfy-pick", 132, "harvest", ["Harvest mature fruit", "तयार फळे उतरवा"], ["Cut with the stalk and lower with a rope; do not let fruits fall and crack.", "देठासह कापा व दोरीने खाली उतरवा; फळे पडून फुटू देऊ नका."], 7),
        ], [["Fruit rot after early rain", "लवकरच्या पावसानंतर फळकूज"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Fruit and spike rot", "फळकूज व दांडे कुजणे"),
      signs: b("Young spikes and fruits get soft, brown patches covered with grey-black fungal growth and fall.", "कोवळे दांडे व फळांवर मऊ तपकिरी डाग, त्यावर राखाडी-काळी बुरशी; ती गळतात."),
      prevention: prevent("Collect and destroy fallen spikes and fruits, keep the area under the tree clean and prune for air flow.", "गळलेले दांडे व फळे गोळा करून नष्ट करा, झाडाखाली स्वच्छता ठेवा आणि हवा खेळती राहील अशी छाटणी करा."),
    },
    {
      name: b("Shoot and fruit borer", "फुटी व फळ पोखरणारी अळी"),
      signs: b("Holes in tender shoots, spikes and young fruits with droppings; shoots wilt.", "कोवळ्या फुटी, दांडे व कोवळ्या फळांना छिद्रे व विष्ठा; फुटी मलूल होतात."),
      prevention: prevent("Cut and destroy affected shoots and fruits early.", "बाधित फुटी व फळे लवकर कापून नष्ट करा."),
    },
    {
      name: b("Trunk and bark borer", "खोड व साल पोखरणारी कीड"),
      signs: b("Holes in the trunk with sawdust-like waste; branches dry.", "खोडावर छिद्रे व भुशासारखी विष्ठा; फांद्या वाळतात."),
      prevention: prevent("Keep the trunk clean, clear holes with a wire and remove dead branches.", "खोड स्वच्छ ठेवा, तारेने छिद्रे साफ करा आणि वाळलेल्या फांद्या काढा."),
    },
  ],
  harvestSigns: b(
    "Spines flatten and spread apart, the skin turns from dark green to light green or yellowish, tapping gives a dull hollow sound and the last leaf on the fruit stalk turns yellow.",
    "काटे सपाट होऊन विरळ होतात, साल गडद हिरव्यावरून फिकट हिरवी किंवा पिवळसर होते, ठोकल्यावर बद्द पोकळ आवाज येतो आणि फळाच्या देठावरचे शेवटचे पान पिवळे पडते.",
  ),
  postHarvest: b(
    "Keep fruits in shade on a bed of leaves. Whole fruit ripens in 3–7 days. Cut bulbs, jackfruit chips, papad and dried bulbs fetch more than whole fruit.",
    "फळे सावलीत पालापाचोळ्यावर ठेवा. अख्खे फळ 3–7 दिवसांत पिकते. काढलेले गरे, फणसाचे चिप्स, पापड व सुकवलेले गरे यांना अख्ख्या फळापेक्षा जास्त किंमत मिळते.",
  ),
  marketTips: b(
    "Tender green jackfruit sells as a vegetable in cities, ripe fruit and cleaned bulbs in Mumbai and Pune markets. Processing (chips, papad) through a women's group adds value and avoids gluts.",
    "कोवळा हिरवा फणस शहरात भाजी म्हणून विकला जातो, पिकलेले फळ व काढलेले गरे मुंबई-पुणे बाजारात. महिला बचत गटामार्फत प्रक्रिया (चिप्स, पापड) केल्यास मूल्यवर्धन होते व आवक जास्त असतानाचा तोटा टळतो.",
  ),
  source: "General practices from Dr. BSKKV Dapoli jackfruit guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
