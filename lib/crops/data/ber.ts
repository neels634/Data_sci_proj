import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Ber: hard dryland tree; heavy pruning in summer, new growth with the rains, fruit in winter. */
const crop: PerennialCrop = {
  id: "ber",
  emoji: "🍒",
  name: b("Ber (Indian jujube)", "बोर"),
  aliases: ["ber", "bor", "bore", "jujube", "indian jujube", "बोर", "बोरं", "बेर"],
  category: "fruit",
  lifecycle: "perennial",
  regions: ["western", "north", "marathwada", "vidarbha"],
  tier: 2,
  plantingWindow: b("June–August, with the monsoon", "जून–ऑगस्ट, पावसाळ्यात"),
  plantingMonths: [6, 7, 8],
  plantingMaterial: b("Budded plants of a known variety, or local rootstock planted in the field and budded there", "खात्रीच्या वाणाची डोळे भरलेली रोपे, किंवा शेतात लावलेल्या गावठी खुंटावर तिथेच डोळा भरणे"),
  spacing: b("6–7 m between rows and 6–7 m between plants", "दोन ओळींत 6–7 मीटर व दोन झाडांत 6–7 मीटर"),
  plantsPerAcre: [80, 110],
  yearsToFirstHarvest: [2, 3],
  economicLifeYears: [20, 30],
  soil: b(
    "Grows on almost any soil, including light, stony and slightly salty soils. Best on deep, well-drained medium soil.",
    "हलकी, मुरमाड व थोडी खारवट जमिनीसह जवळपास कोणत्याही जमिनीत येते. खोल, चांगला निचरा होणारी मध्यम जमीन उत्तम.",
  ),
  climate: b(
    "Hot, dry climate with low rainfall. The tree tolerates drought well and sheds leaves in summer.",
    "कमी पावसाचे उष्ण, कोरडे हवामान. झाड दुष्काळ चांगला सहन करते व उन्हाळ्यात पानगळ होते.",
  ),
  irrigation: b(
    "Mostly rainfed. Give 2–3 protective irrigations from fruit set to fruit growth (October–December) if available; this gives bigger fruit. Do not water during the summer rest.",
    "बहुतेक कोरडवाहू. पाणी असल्यास फळधारणेपासून फळवाढीपर्यंत (ऑक्टोबर–डिसेंबर) 2–3 संरक्षित पाणी द्या; त्याने फळे मोठी होतात. उन्हाळ्यातील विश्रांतीत पाणी देऊ नका.",
  ),
  nutrientGuide: b(
    "Give well-rotted farmyard manure after pruning and fertiliser as per soil test in two parts during the rains. Ask your agriculture officer for amounts.",
    "छाटणीनंतर चांगले कुजलेले शेणखत द्या आणि माती परीक्षणानुसार खत पावसाळ्यात दोन हप्त्यांत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Umran", note: b("Widely grown late variety with large fruit", "मोठ्या फळांचा, सर्वाधिक लागवडीचा उशिरा वाण") },
    { name: "Gola", note: b("Early variety with round fruit", "गोल फळांचा लवकर येणारा वाण") },
    { name: "Kadaka", note: b("Grown in western Maharashtra; firm fruit", "पश्चिम महाराष्ट्रात लागवड; घट्ट फळे") },
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Budded plants are set in pits and take root.", "डोळे भरलेली रोपे खड्ड्यांत लावली जातात व मूळ धरतात."], [
      t("br-pit", 0, "other", ["Plant in prepared pits", "तयार खड्ड्यांत लागवड करा"], ["Fill pits with topsoil and well-rotted manure, plant with the bud joint above soil.", "खड्डे वरची माती व कुजलेल्या शेणखताने भरा, डोळ्याचा जोड जमिनीच्या वर ठेवून लावा."]),
      t("br-irr0", 2, "irrigation", ["Water if rain stops", "पाऊस थांबल्यास पाणी द्या"], ["Keep soil moist in long dry spells.", "पावसाच्या मोठ्या खंडात माती ओलसर ठेवा."], 7),
      t("br-gap", 25, "other", ["Replace dead plants", "मेलेली रोपे बदला"], ["Fill gaps while the rains last.", "पाऊस असतानाच खाडे भरा."]),
    ], [["Termites at the roots", "मुळांना वाळवी"]]),
    stage("training", ["Training the young tree", "झाडाला आकार देणे"], 30, 365, ["The tree is shaped to a clean stem with 4–5 main branches.", "स्वच्छ खोड व 4–5 मुख्य फांद्यांचा आकार दिला जातो."], [
      t("br-sprout", 40, "other", ["Remove rootstock shoots", "खुंटावरील फुटवे काढा"], ["Rub off shoots coming from below the bud joint.", "डोळ्याच्या जोडाखालून येणारे फुटवे काढा."], 30),
      t("br-train", 150, "other", ["Shape the tree", "झाडाला आकार द्या"], ["Keep the stem clean up to about 75 cm and keep 4–5 well-spaced branches.", "खोड साधारण 75 सेंमीपर्यंत स्वच्छ ठेवा व 4–5 सारख्या अंतरावरच्या फांद्या ठेवा."]),
      t("br-irr1", 180, "irrigation", ["Water young trees in summer", "उन्हाळ्यात लहान झाडांना पाणी द्या"], ["Light water helps young trees survive the first summer.", "हलक्या पाण्याने लहान झाडे पहिला उन्हाळा तग धरतात."], 10),
    ], [["Leaf-eating caterpillars on new growth", "नव्या फुटीवर पाने खाणाऱ्या अळ्या"]]),
    stage("frame", ["Building the frame", "झाडाचा विस्तार"], 365, 730, ["The tree builds its frame and may give a small first crop.", "झाडाचा सांगाडा तयार होतो व थोडे पहिले उत्पादन मिळू शकते."], [
      t("br-prune1", 640, "other", ["First summer pruning", "पहिली उन्हाळी छाटणी"], ["In April–May, shorten last year's shoots so new fruiting shoots come with the rains.", "एप्रिल–मेमध्ये मागील वर्षीच्या फांद्या कमी करा, म्हणजे पावसाबरोबर नव्या फळफांद्या येतात."]),
      t("br-obs2", 370, "observation", ["Check the trees", "झाडे तपासा"], ["Look for powdery growth on leaves and dry branches.", "पानांवर भुरी व वाळलेल्या फांद्या पाहा."], 30),
    ], [["Powdery mildew", "भुरी"]]),
  ],
  cycles: [
    {
      key: "yearly",
      name: b("Yearly crop after summer pruning", "उन्हाळी छाटणीनंतरचा वार्षिक बहार"),
      startMonths: [4, 5],
      startEvent: b("Pruning in April–May after harvest, while the tree rests", "काढणीनंतर एप्रिल–मेमध्ये झाड विश्रांतीत असताना छाटणी"),
      harvestMonths: [11, 12, 1, 2, 3],
      note: b("Ber fruits on the current season's shoots, so yearly pruning is needed. Early varieties ripen from November, late ones like Umran from January.", "बोराला चालू हंगामाच्या फांद्यांवर फळे येतात, त्यामुळे दरवर्षी छाटणी लागते. लवकर वाण नोव्हेंबरपासून, उमरानसारखे उशिरा वाण जानेवारीपासून पिकतात."),
      stages: [
        stage("pruning", ["Pruning & rest", "छाटणी व विश्रांती"], 0, 50, ["The tree is pruned and rests through the hot summer.", "छाटणी करून झाड कडक उन्हाळ्यात विश्रांती घेते."], [
          t("bry-prune", 0, "other", ["Prune the tree", "झाडाची छाटणी करा"], ["Cut back last season's shoots, remove dry, diseased and crossing branches; burn the cuttings.", "मागील हंगामातील फांद्या मागे छाटा, वाळलेल्या, रोगट व एकमेकांत घुसणाऱ्या फांद्या काढा; छाटलेले जाळा."]),
          t("bry-clean", 10, "other", ["Clean the basin", "आळे स्वच्छ करा"], ["Remove fallen fruit and leaves that carry fruit fly and disease.", "फळमाशी व रोग वाढवणारी गळलेली फळे व पाने काढा."]),
          t("bry-fym", 40, "fertiliser", ["Give manure before the rains", "पावसापूर्वी शेणखत द्या"], ["Apply well-rotted farmyard manure in the basin.", "आळ्यात कुजलेले शेणखत द्या."]),
        ], [["Fallen fruit hiding fruit fly pupae", "गळलेल्या फळांत फळमाशीचे कोष"]]),
        stage("new-growth", ["New growth with the rains", "पावसाबरोबर नवी फूट"], 50, 110, ["New shoots and leaves come with the monsoon.", "पावसाळ्यात नवी फूट व पाने येतात."], [
          t("bry-fert1", 55, "fertiliser", ["First fertiliser part", "खताचा पहिला हप्ता"], ["Give as per soil test while the soil is moist.", "जमिनीत ओल असताना माती परीक्षणानुसार द्या."]),
          t("bry-weed", 60, "weeding", ["Weed the basin", "आळे खुरपा"], ["Keep basins weed-free.", "आळी तणमुक्त ठेवा."], 30),
          t("bry-obs1", 60, "observation", ["Check new leaves", "नवी पाने तपासा"], ["Look for leaf-eating caterpillars and powdery growth.", "पाने खाणाऱ्या अळ्या व भुरी पाहा."], 10),
        ], [["Leaf-eating caterpillars", "पाने खाणाऱ्या अळ्या"]]),
        stage("flowering", ["Flowering & fruit set", "फुलोरा व फळधारणा"], 110, 160, ["Small flowers come at leaf joints and set fruit.", "पानांच्या बेचक्यात लहान फुले येऊन फळे लागतात."], [
          t("bry-fert2", 115, "fertiliser", ["Second fertiliser part", "खताचा दुसरा हप्ता"], ["Give the second part as per your plan.", "नियोजनानुसार दुसरा हप्ता द्या."]),
          t("bry-obs2", 112, "observation", ["Watch for powdery mildew", "भुरी तपासा"], ["White powder on flowers and young fruit makes them drop.", "फुले व कोवळ्या फळांवर पांढरी भुकटी आल्यास ती गळतात."], 7),
        ], [["Powdery mildew", "भुरी"]]),
        stage("fruit-growth", ["Fruit growth", "फळांची वाढ"], 160, 240, ["Fruits grow and fill in the cool season.", "थंडीत फळे वाढतात व भरतात."], [
          t("bry-irr1", 160, "irrigation", ["Protective irrigation", "संरक्षित पाणी"], ["If you have water, irrigate every 2–3 weeks for bigger fruit.", "पाणी असल्यास मोठ्या फळांसाठी दर 2–3 आठवड्यांनी पाणी द्या."], 18),
          t("bry-obs3", 165, "observation", ["Check fruit", "फळे तपासा"], ["Look for fruit fly stings and rotting fruit; collect and destroy fallen fruit.", "फळमाशीचे डंख व सडणारी फळे पाहा; गळलेली फळे गोळा करून नष्ट करा."], 7),
        ], [["Fruit fly", "फळमाशी"]]),
        stage("harvest", ["Harvest", "काढणी"], 240, 300, ["Fruits change colour and are picked in several rounds.", "फळांचा रंग बदलतो व अनेक फेऱ्यांत तोडणी होते."], [
          t("bry-pick", 240, "harvest", ["Pick mature fruit", "तयार फळे तोडा"], ["Pick by hand when fruits turn from green to light yellow or golden.", "फळे हिरव्यावरून फिकट पिवळी किंवा सोनेरी झाल्यावर हाताने तोडा."], 7),
          t("bry-grade", 242, "other", ["Grade the fruit", "फळांची प्रतवारी करा"], ["Separate large, clean fruit from small and damaged ones.", "मोठी, स्वच्छ फळे लहान व खराब फळांपासून वेगळी करा."], 7),
        ], [["Birds", "पक्षी"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Fruit fly", "फळमाशी"),
      signs: b("Small sting marks on fruit; maggots inside; fruit rots and drops.", "फळांवर लहान डंखांचे ठिपके; आत अळ्या; फळे सडून गळतात."),
      prevention: prevent("Collect and destroy fallen fruit regularly, dig the basin in summer to expose pupae, and use fruit fly traps.", "गळलेली फळे नियमित गोळा करून नष्ट करा, उन्हाळ्यात आळे खोदून कोष उघडे करा आणि फळमाशी सापळे लावा."),
    },
    {
      name: b("Powdery mildew", "भुरी"),
      signs: b("White powder on leaves, flowers and young fruit; fruit drops or gets brown, rough skin.", "पाने, फुले व कोवळ्या फळांवर पांढरी भुकटी; फळे गळतात किंवा साल तपकिरी, खडबडीत होते."),
      prevention: prevent("Prune for air flow, remove infected shoots and check the orchard weekly from flowering.", "हवा खेळती राहील अशी छाटणी करा, रोगट फांद्या काढा आणि फुलोऱ्यापासून दर आठवड्याला बाग तपासा."),
    },
    {
      name: b("Leaf-eating caterpillars", "पाने खाणाऱ्या अळ्या"),
      signs: b("Leaves eaten and webbed together on new growth.", "नव्या फुटीची पाने खाल्लेली व जाळ्याने एकत्र गुंडाळलेली."),
      prevention: prevent("Pick off and destroy webbed leaves and caterpillars early.", "जाळे केलेली पाने व अळ्या लवकर वेचून नष्ट करा."),
    },
  ],
  harvestSigns: b(
    "Fruit turns from green to light yellow or golden (red-brown in some varieties) and becomes sweet. Pick in rounds as they ripen.",
    "फळ हिरव्यावरून फिकट पिवळे किंवा सोनेरी (काही वाणांत लालसर-तपकिरी) होते व गोड लागते. पिकतील तशी फेऱ्यांमध्ये तोडणी करा.",
  ),
  postHarvest: b(
    "Grade by size, remove damaged fruit, and pack in gunny bags or crates. Fresh ber keeps only a few days; extra fruit can be dried.",
    "आकारानुसार प्रतवारी करा, खराब फळे काढा आणि गोणी किंवा क्रेटमध्ये भरा. ताजी बोरे काही दिवसच टिकतात; जादा फळे सुकवता येतात.",
  ),
  marketTips: b(
    "Large, clean fruit of good varieties fetches a much better price than small local ber. Sell in rounds as they ripen rather than all at once.",
    "चांगल्या वाणाच्या मोठ्या, स्वच्छ बोरांना लहान गावठी बोरांपेक्षा खूप चांगला दर मिळतो. एकदम न विकता पिकतील तशी टप्प्याटप्प्याने विका.",
  ),
  source: "General practices from MPKV Rahuri and Dr. PDKV Akola dryland fruit guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
