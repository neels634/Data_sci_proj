import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Dryland fruit tree: leaves fall in winter, new growth and flowers with summer water or the first rains. */
const crop: PerennialCrop = {
  id: "custard-apple",
  emoji: "🍏",
  name: b("Custard apple", "सीताफळ"),
  aliases: ["custard apple", "custard-apple", "sitaphal", "seetaphal", "sitafal", "sharifa", "shareefa", "सीताफळ", "सिताफळ", "सीताफल", "शरीफा"],
  category: "fruit",
  lifecycle: "perennial",
  regions: ["western", "marathwada"],
  majorDistricts: b("Beed, Pune, Ahilyanagar", "बीड, पुणे, अहिल्यानगर"),
  tier: 2,
  plantingWindow: b("June–August, with the monsoon", "जून–ऑगस्ट, पावसाळ्यात"),
  plantingMonths: [6, 7, 8],
  plantingMaterial: b("Grafts of a known variety from a registered nursery", "नोंदणीकृत रोपवाटिकेतील खात्रीच्या वाणाची कलमे"),
  spacing: b("4–5 m between rows and 4–5 m between plants", "दोन ओळींत 4–5 मीटर व दोन झाडांत 4–5 मीटर"),
  plantsPerAcre: [160, 250],
  yearsToFirstHarvest: [3, 4],
  economicLifeYears: [20, 30],
  soil: b(
    "Grows on light, stony and medium soils with good drainage. It does well on poor dryland soils but not where water stands.",
    "हलकी, मुरमाड व मध्यम, पाण्याचा चांगला निचरा होणारी जमीन चालते. कोरडवाहू कमी कसाच्या जमिनीतही चांगले येते, पण पाणी साचणारी जमीन टाळा.",
  ),
  climate: b(
    "Hot, dry climate with a dry winter. The tree sheds leaves in winter and rests. Humid weather at flowering helps fruit set; very dry hot wind makes flowers drop.",
    "उष्ण, कोरडे हवामान व कोरडा हिवाळा. हिवाळ्यात झाडाची पानगळ होऊन ते विश्रांती घेते. फुलोऱ्यात दमट हवा फळधारणेस मदत करते; कोरड्या उष्ण वाऱ्याने फुले गळतात.",
  ),
  irrigation: b(
    "Mostly grown rainfed. Where water is available, give protective irrigation through drip from flowering until fruits fill, especially if the rains are late or there is a long dry spell. Give no water during the winter rest.",
    "बहुतेक कोरडवाहू लागवड. पाणी असल्यास फुलोऱ्यापासून फळे भरेपर्यंत ठिबकने संरक्षित पाणी द्या, विशेषतः पाऊस उशिरा आला किंवा मोठा खंड पडला तर. हिवाळ्यातील विश्रांतीत पाणी देऊ नका.",
  ),
  nutrientGuide: b(
    "Give well-rotted farmyard manure in the basin every year at the start of the season. Add fertiliser as per soil test, split into 2 parts during the rainy season. Ask your agriculture officer for amounts.",
    "दरवर्षी हंगामाच्या सुरुवातीला आळ्यात चांगले कुजलेले शेणखत द्या. माती परीक्षणानुसार खत पावसाळ्यात 2 हप्त्यांत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Balanagar", note: b("Old, widely grown variety with good-sized fruit", "मोठ्या फळांचा जुना, सर्वाधिक लागवडीचा वाण") },
    { name: "Phule Purandar", note: b("Released by MPKV Rahuri; large fruit with more pulp", "मफुकृवि राहुरीचा वाण; मोठी फळे, गर जास्त") },
    { name: "Arka Sahan", note: b("Hybrid from ICAR-IIHR Bengaluru; sweet, few seeds, keeps longer", "ICAR-IIHR बंगळुरूचा संकरित वाण; गोड, कमी बिया, जास्त टिकतो") },
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Grafts are planted in pits and take root.", "कलमे खड्ड्यांत लावली जातात व मूळ धरतात."], [
      t("ca-pit", 0, "other", ["Plant grafts in prepared pits", "तयार खड्ड्यांत कलमे लावा"], ["Fill pits with topsoil and well-rotted manure, plant with the graft joint above soil, and tie to a stick.", "खड्डे वरची माती व कुजलेल्या शेणखताने भरा, कलमाचा जोड जमिनीच्या वर ठेवून लावा व काठीला बांधा."]),
      t("ca-irr0", 2, "irrigation", ["Water if rain stops", "पाऊस थांबल्यास पाणी द्या"], ["Keep the soil around the graft moist in dry spells.", "पावसाच्या खंडात कलमाभोवती माती ओलसर ठेवा."], 7),
      t("ca-gap", 25, "other", ["Replace dead grafts", "मेलेली कलमे बदला"], ["Fill gaps while the rains last.", "पाऊस असतानाच खाडे भरा."]),
    ], [["Grafts drying in a long dry spell", "पावसाच्या खंडात कलमे सुकणे"], ["Termites at the roots", "मुळांना वाळवी"]]),
    stage("training", ["Training the young tree", "झाडाला आकार देणे"], 30, 365, ["The tree is shaped with 3–4 main branches on a clean stem.", "स्वच्छ खोडावर 3–4 मुख्य फांद्या ठेवून झाडाला आकार दिला जातो."], [
      t("ca-sprout", 45, "other", ["Remove shoots below the graft", "जोडाखालील फुटवे काढा"], ["Shoots from the rootstock steal food; rub them off.", "खुंटावरील फुटवे अन्न खातात; ते काढून टाका."], 45),
      t("ca-train", 120, "other", ["Shape the tree", "झाडाला आकार द्या"], ["Keep the stem clean up to about 60 cm and keep 3–4 well-spaced branches.", "खोड साधारण 60 सेंमीपर्यंत स्वच्छ ठेवा व 3–4 सारख्या अंतरावरच्या फांद्या ठेवा."]),
      t("ca-irr1", 150, "irrigation", ["Water young trees in summer", "उन्हाळ्यात लहान झाडांना पाणी द्या"], ["Young trees need light water in the dry months to survive.", "कोरड्या महिन्यांत लहान झाडे जगण्यासाठी हलके पाणी लागते."], 10),
      t("ca-weed1", 60, "weeding", ["Weed and mulch the basin", "आळे खुरपून आच्छादन करा"], ["Keep basins clean and cover with dry grass to save moisture.", "आळी स्वच्छ ठेवा व ओलावा टिकवण्यासाठी वाळलेल्या गवताचे आच्छादन करा."], 60),
    ], [["Mealybugs on young shoots", "कोवळ्या फुटीवर पिठ्या ढेकूण"]]),
    stage("canopy", ["Building the frame", "झाडाचा विस्तार"], 365, 1095, ["The tree grows its frame. Remove the first flowers so it does not bear too early.", "झाडाचा सांगाडा तयार होतो. फार लवकर फळे येऊ नयेत म्हणून सुरुवातीची फुले काढा."], [
      t("ca-flowerrm", 400, "other", ["Remove early flowers", "लवकरची फुले काढा"], ["Pick off flowers in the first two years so the tree grows strong.", "पहिल्या दोन वर्षांत फुले खुडा, म्हणजे झाड मजबूत वाढते."], 90),
      t("ca-fym2", 700, "fertiliser", ["Give manure", "शेणखत द्या"], ["Apply well-rotted farmyard manure in the basin before the rains.", "पावसापूर्वी आळ्यात कुजलेले शेणखत द्या."]),
      t("ca-obs2", 370, "observation", ["Check the trees", "झाडे तपासा"], ["Look for white mealybugs on shoots and dead branches.", "फुटीवर पांढरे पिठ्या ढेकूण व वाळलेल्या फांद्या पाहा."], 30),
    ], [["Mealybugs", "पिठ्या ढेकूण"]]),
  ],
  cycles: [
    {
      key: "monsoon",
      name: b("Monsoon crop (main season)", "पावसाळी बहार (मुख्य हंगाम)"),
      startMonths: [4, 5, 6],
      startEvent: b("Light pruning after the winter rest, then summer irrigation or the first rains", "हिवाळ्यातील विश्रांतीनंतर हलकी छाटणी, मग उन्हाळी पाणी किंवा पहिला पाऊस"),
      harvestMonths: [8, 9, 10, 11],
      note: b("The usual crop. Where summer water is available, starting in April–May gives earlier fruit; rainfed orchards start with the rains.", "हाच नेहमीचा बहार. उन्हाळ्यात पाणी असल्यास एप्रिल–मेमध्ये सुरुवात केल्याने फळे लवकर येतात; कोरडवाहू बागा पावसाबरोबर सुरू होतात."),
      stages: [
        stage("new-growth", ["Pruning & new leaves", "छाटणी व नवी पालवी"], 0, 30, ["After the leaf-fall rest, new leaves come out with water or rain.", "पानगळीनंतरच्या विश्रांतीनंतर पाणी किंवा पावसाने नवी पालवी फुटते."], [
          t("ca-prune", 0, "other", ["Light pruning and cleaning", "हलकी छाटणी व स्वच्छता"], ["Cut dry, diseased and crowded branches; burn the cuttings.", "वाळलेल्या, रोगट व दाटीच्या फांद्या छाटा; छाटलेले जाळा."]),
          t("ca-fym", 5, "fertiliser", ["Give manure and fertiliser", "शेणखत व खत द्या"], ["Apply well-rotted farmyard manure in the basin and the first fertiliser part as per soil test.", "आळ्यात कुजलेले शेणखत व माती परीक्षणानुसार खताचा पहिला हप्ता द्या."]),
          t("ca-m-irr1", 7, "irrigation", ["First water", "पहिले पाणी"], ["If you have water, start light drip irrigation; otherwise wait for the rains.", "पाणी असल्यास हलके ठिबक पाणी सुरू करा; नाहीतर पावसाची वाट पाहा."], 7),
        ], [["Mealybug eggs under the bark", "सालीखाली पिठ्या ढेकणाची अंडी"]]),
        stage("flowering", ["Flowering & fruit set", "फुलोरा व फळधारणा"], 30, 75, ["Flowers come on new shoots. Fruit sets better in humid weather.", "नव्या फुटीवर फुले येतात. दमट हवेत फळधारणा चांगली होते."], [
          t("ca-irr2", 30, "irrigation", ["Keep soil moist", "माती ओलसर ठेवा"], ["Dry soil and hot wind make flowers drop. Give protective water in dry spells.", "कोरडी जमीन व उष्ण वाऱ्याने फुले गळतात. खंडात संरक्षित पाणी द्या."], 7),
          t("ca-obs1", 35, "observation", ["Check flowers and shoots", "फुले व फुटी तपासा"], ["Look for mealybugs and leaf spots.", "पिठ्या ढेकूण व पानांवरील ठिपके पाहा."], 7),
        ], [["Flower drop in dry heat", "कोरड्या उष्णतेत फुलगळ"]]),
        stage("fruit-growth", ["Fruit growth", "फळांची वाढ"], 75, 150, ["Fruits grow and fill through the rainy season.", "पावसाळ्यात फळे वाढतात व भरतात."], [
          t("ca-fert2", 80, "fertiliser", ["Second fertiliser part", "खताचा दुसरा हप्ता"], ["Give the second part as per your plan while soil is moist.", "जमिनीत ओल असताना नियोजनानुसार दुसरा हप्ता द्या."]),
          t("ca-m-obs2", 80, "observation", ["Check fruit", "फळे तपासा"], ["Look for white mealybugs on fruit and black spots; remove badly affected fruit.", "फळांवर पांढरे पिठ्या ढेकूण व काळे डाग पाहा; जास्त बाधित फळे काढा."], 7),
          t("ca-weed", 90, "weeding", ["Weed the basins", "आळी खुरपा"], ["Keep basins weed-free and mulched.", "आळी तणमुक्त ठेवा व आच्छादन करा."], 30),
        ], [["Mealybugs on fruit", "फळांवर पिठ्या ढेकूण"], ["Black spots on fruit in wet weather", "ओल्या हवामानात फळांवर काळे डाग"]]),
        stage("harvest", ["Maturity & harvest", "पक्वता व तोडणी"], 150, 190, ["Fruits mature in rounds and are picked while still firm.", "फळे टप्प्याटप्प्याने तयार होतात व घट्ट असतानाच तोडली जातात."], [
          t("ca-mat", 150, "observation", ["Check maturity", "पक्वता तपासा"], ["Ready when the gaps between the segments widen and turn creamy-yellow.", "डोळ्यांमधील फट रुंद होऊन पिवळसर-पांढरी झाली की फळ तयार."]),
          t("ca-pick", 152, "harvest", ["Pick mature fruit", "तयार फळे तोडा"], ["Pick firm, mature fruit every few days and keep in shade.", "दर काही दिवसांनी घट्ट, तयार फळे तोडा व सावलीत ठेवा."], 4),
        ], [["Birds and bats on ripening fruit", "पिकणाऱ्या फळांवर पक्षी व वटवाघळे"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Mealybug", "पिठ्या ढेकूण"),
      signs: b("White, cottony insects on shoots and fruit; sticky honeydew and black sooty mould.", "फुटी व फळांवर पांढरे, कापसासारखे किडे; चिकट स्राव व काळी बुरशी."),
      prevention: prevent("Keep basins clean, scrape loose bark, band the trunk to stop ants and crawlers, and remove badly affected fruit.", "आळी स्वच्छ ठेवा, सैल साल खरवडा, मुंग्या व पिल्ले वर चढू नयेत म्हणून खोडाला पट्टा बांधा आणि जास्त बाधित फळे काढा."),
    },
    {
      name: b("Leaf and fruit spot (anthracnose)", "पाने व फळांवरील काळे डाग (करपा)"),
      signs: b("Dark spots on leaves and fruit in wet weather; affected fruit turns black and hard.", "ओल्या हवामानात पाने व फळांवर काळपट डाग; बाधित फळे काळी व कडक होतात."),
      prevention: prevent("Prune for air flow, remove fallen and diseased fruit, and keep the orchard clean.", "हवा खेळती राहील अशी छाटणी करा, गळलेली व रोगट फळे काढा आणि बाग स्वच्छ ठेवा."),
    },
    {
      name: b("Hard, stony fruit and fruit drop", "दगडी फळे व फळगळ"),
      signs: b("Fruits stay small and hard or fall early, often after a long dry spell.", "फळे लहान व कडक राहतात किंवा लवकर गळतात, बहुतेक वेळा पावसाच्या मोठ्या खंडानंतर."),
      prevention: b("Give protective irrigation in dry spells, mulch the basins, and do not let the tree carry too many fruits.", "खंडात संरक्षित पाणी द्या, आळ्यांत आच्छादन करा आणि झाडावर फार जास्त फळे ठेवू नका."),
    },
  ],
  harvestSigns: b(
    "The gaps between the bumps (eyes) widen and turn creamy-yellow, and the skin colour turns lighter. Pick firm; fruit softens in 2–4 days.",
    "डोळ्यांमधील फट रुंद होऊन पिवळसर-पांढरी होते आणि सालीचा रंग फिका होतो. घट्ट असतानाच तोडा; 2–4 दिवसांत फळ मऊ होते.",
  ),
  postHarvest: b(
    "Handle gently, keep in shade, grade by size and pack in a single layer in boxes or crates with soft lining. Fruit is soft once ripe and does not keep long, so sell quickly.",
    "हळुवार हाताळा, सावलीत ठेवा, आकारानुसार प्रतवारी करा आणि मऊ अस्तर असलेल्या खोक्यांत किंवा क्रेटमध्ये एका थरात भरा. पिकलेले फळ मऊ होते व जास्त टिकत नाही, त्यामुळे लवकर विका.",
  ),
  marketTips: b(
    "Large, clean fruit gets the best price in city markets. Pulp makers buy ripe fruit for ice-cream and sweets — ask about selling to them through your Mandi Mitra.",
    "मोठ्या, स्वच्छ फळांना शहरातील बाजारात सर्वाधिक दर मिळतो. आईस्क्रीम व मिठाईसाठी गर काढणारे उद्योग पिकलेली फळे घेतात — मंडी मित्रामार्फत त्यांना विक्रीची चौकशी करा.",
  ),
  source: "General practices from MPKV Rahuri custard apple guidance and ICAR-IIHR",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
