import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Dragon fruit: climbing cactus grown on concrete poles with a top ring; fruits in flushes through the rainy season. */
const crop: PerennialCrop = {
  id: "dragon-fruit",
  emoji: "🐉",
  name: b("Dragon fruit", "ड्रॅगन फ्रूट"),
  aliases: ["dragon fruit", "dragonfruit", "pitaya", "pitahaya", "kamalam", "ड्रॅगन फ्रूट", "ड्रॅगनफ्रूट", "ड्रॅगन फळ", "कमलम"],
  category: "fruit",
  lifecycle: "perennial",
  regions: ["western", "marathwada"],
  tier: 2,
  plantingWindow: b("June–July, or February–March where irrigation is assured", "जून–जुलै, किंवा खात्रीचे पाणी असल्यास फेब्रुवारी–मार्च"),
  plantingMonths: [6, 7, 2, 3],
  plantingMaterial: b("Rooted stem cuttings (30–50 cm) from healthy, fruiting plants", "निरोगी, फळे देणाऱ्या झाडांच्या मुळे फुटलेल्या खोडाच्या फाटे (30–50 सेंमी)"),
  spacing: b("Concrete poles about 3 m apart each way (or 3 m × 2.5 m), with 4 cuttings around each pole", "सिमेंटचे खांब दोन्ही बाजूंनी साधारण 3 मीटर अंतरावर (किंवा 3 × 2.5 मीटर), प्रत्येक खांबाभोवती 4 फाटे"),
  plantsPerAcre: [1600, 2200],
  yearsToFirstHarvest: [1, 2],
  economicLifeYears: [15, 20],
  soil: b(
    "Light to medium, well-drained soil. Murmad soil suits it. Roots and stems rot where water stands, so plant on raised beds in heavy soil.",
    "हलकी ते मध्यम, पाण्याचा चांगला निचरा होणारी जमीन. मुरमाड जमीन योग्य. पाणी साचल्यास मुळे व खोड कुजतात, म्हणून भारी जमिनीत गादीवाफ्यावर लागवड करा.",
  ),
  climate: b(
    "Warm, dry climate; a cactus that needs little water. Very hot sun in April–May scorches stems — shade net helps in young plantations.",
    "उबदार, कोरडे हवामान; कमी पाण्यात येणारे निवडुंग वर्गीय पीक. एप्रिल–मेमधील कडक उन्हात खोड करपतात — लहान बागेत शेडनेट उपयोगी.",
  ),
  irrigation: b(
    "Drip irrigation, light and infrequent. Give a little water every 4–7 days in summer and less in winter; stop in the rains unless there is a long dry spell. Never let water stand at the pole.",
    "ठिबकने हलके व कमी वेळा पाणी. उन्हाळ्यात दर 4–7 दिवसांनी थोडे पाणी, हिवाळ्यात कमी; मोठा खंड नसेल तर पावसाळ्यात बंद. खांबाजवळ पाणी साचू देऊ नका.",
  ),
  nutrientGuide: b(
    "Give well-rotted farmyard manure or compost around each pole twice a year. Add fertiliser in small parts as per soil test during growth and fruiting. Ask your agriculture officer for amounts.",
    "प्रत्येक खांबाभोवती वर्षातून दोनदा चांगले कुजलेले शेणखत किंवा कंपोस्ट द्या. वाढ व फळांच्या काळात माती परीक्षणानुसार थोडे थोडे खत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [], // TODO: varieties — farmers grow red-skin white-flesh, red-flesh and yellow types; confirm named varieties with ICAR-NIASM Baramati or MPKV Rahuri
  establishment: [
    stage("planting", ["Planting on poles", "खांबाजवळ लागवड"], 0, 45, ["Cuttings are planted around concrete poles and form roots.", "सिमेंटच्या खांबाभोवती फाटे लावले जातात व मुळे फुटतात."], [
      t("df-pole", 0, "other", ["Set poles and plant cuttings", "खांब उभे करून फाटे लावा"], ["Fix 1.5–2 m concrete poles with a ring or frame on top. Plant 4 cuttings around each pole, 3–5 cm deep, and tie them to the pole.", "वर कडी किंवा चौकट असलेले 1.5–2 मीटरचे सिमेंट खांब उभे करा. प्रत्येक खांबाभोवती 4 फाटे 3–5 सेंमी खोल लावा व खांबाला बांधा."]),
      t("df-irr0", 3, "irrigation", ["Water lightly", "हलके पाणी द्या"], ["Keep the soil just moist; too much water rots cuttings.", "माती फक्त ओलसर ठेवा; जास्त पाण्याने फाटे कुजतात."], 5),
      t("df-gap", 35, "other", ["Replace rotted cuttings", "कुजलेले फाटे बदला"], ["Replace cuttings that turned yellow or soft.", "पिवळे किंवा मऊ पडलेले फाटे बदला."]),
    ], [["Cuttings rotting at the base", "फाटे बुडाशी कुजणे"]]),
    stage("climbing", ["Climbing the pole", "खांबावर चढणे"], 45, 240, ["One or two main stems climb the pole; side shoots are removed.", "एक-दोन मुख्य फांद्या खांबावर चढतात; बाजूच्या फुटी काढल्या जातात."], [
      t("df-tie", 60, "other", ["Tie stems and remove side shoots", "फांद्या बांधा व बाजूच्या फुटी काढा"], ["Keep 1–2 strong stems per cutting going straight up; tie loosely every 30 cm.", "प्रत्येक फाट्याची 1–2 मजबूत फांदी सरळ वर जाऊ द्या; दर 30 सेंमीवर सैल बांधा."], 30),
      t("df-irr1", 45, "irrigation", ["Irrigate", "पाणी द्या"], ["Light drip water; less in the rains.", "हलके ठिबक पाणी; पावसाळ्यात कमी."], 6),
      t("df-weed1", 60, "weeding", ["Weed around poles", "खांबाभोवती खुरपणी करा"], ["Keep the base clean and mulch with straw.", "बुडाजवळ स्वच्छता ठेवा व पाचटाचे आच्छादन करा."], 30),
    ], [["Ants and mealybugs on young stems", "कोवळ्या फांद्यांवर मुंग्या व पिठ्या ढेकूण"]]),
    stage("canopy", ["Forming the umbrella", "छत्री तयार करणे"], 240, 450, ["Stems reach the top ring and hang down like an umbrella; hanging stems carry the fruit.", "फांद्या वरच्या कडीपर्यंत पोहोचून छत्रीसारख्या खाली लोंबतात; लोंबणाऱ्या फांद्यांवर फळे येतात."], [
      t("df-top", 250, "other", ["Pinch at the top", "वर शेंडा खुडा"], ["When stems cross the ring, pinch the tip so many branches hang down around it.", "फांद्या कडी ओलांडल्यावर शेंडा खुडा, म्हणजे भोवती अनेक फांद्या खाली लोंबतात."]),
      t("df-fym1", 260, "fertiliser", ["Give manure", "शेणखत द्या"], ["Apply well-rotted manure around each pole.", "प्रत्येक खांबाभोवती कुजलेले शेणखत द्या."]),
      t("df-irr2", 240, "irrigation", ["Irrigate", "पाणी द्या"], ["Light drip water as per season.", "हंगामानुसार हलके ठिबक पाणी."], 6),
      t("df-obs1", 245, "observation", ["Check stems", "फांद्या तपासा"], ["Look for soft, rotting or sun-scorched patches on stems.", "फांद्यांवर मऊ, कुजलेले किंवा उन्हाने करपलेले भाग पाहा."], 15),
    ], [["Stem rot", "खोड कुजणे"], ["Sunscald", "उन्हाने करपणे"]]),
  ],
  cycles: [
    {
      key: "rainy",
      name: b("Main season (summer to rains)", "मुख्य हंगाम (उन्हाळा ते पावसाळा)"),
      startMonths: [3, 4],
      startEvent: b("Light pruning and the first feeding and summer irrigation in March–April", "मार्च–एप्रिलमध्ये हलकी छाटणी, पहिला खत हप्ता व उन्हाळी पाणी"),
      harvestMonths: [6, 7, 8, 9, 10, 11],
      note: b("Plants flower in several waves; each flower becomes a fruit in about 30–40 days, so picking goes on for months.", "झाडांना अनेक टप्प्यांत फुले येतात; प्रत्येक फुलाचे साधारण 30–40 दिवसांत फळ होते, त्यामुळे तोडणी महिनोन्महिने चालते."),
      stages: [
        stage("pruning", ["Pruning & new shoots", "छाटणी व नवी फूट"], 0, 45, ["Old and weak stems are removed; new shoots and buds come with feeding and water.", "जुन्या व कमजोर फांद्या काढल्या जातात; खत व पाण्याने नवी फूट व कळ्या येतात."], [
          t("dfr-prune", 0, "other", ["Prune old stems", "जुन्या फांद्या छाटा"], ["Remove stems that have fruited 2–3 times, weak, diseased and tangled stems; burn diseased cuttings.", "2–3 वेळा फळे दिलेल्या, कमजोर, रोगट व गुंतलेल्या फांद्या काढा; रोगट भाग जाळा."]),
          t("dfr-fym", 3, "fertiliser", ["Give manure and fertiliser", "शेणखत व खत द्या"], ["Apply well-rotted manure and the first fertiliser part as per soil test.", "कुजलेले शेणखत व माती परीक्षणानुसार खताचा पहिला हप्ता द्या."]),
          t("dfr-irr1", 5, "irrigation", ["Irrigate", "पाणी द्या"], ["Light water every 4–7 days in summer.", "उन्हाळ्यात दर 4–7 दिवसांनी हलके पाणी."], 5),
        ], [["Sunscald on stems in April–May", "एप्रिल–मेमध्ये फांद्या उन्हाने करपणे"]]),
        stage("flowering", ["Flowering waves", "फुलोऱ्याचे टप्पे"], 45, 90, ["Large white flowers open at night on hanging stems.", "लोंबणाऱ्या फांद्यांवर रात्री मोठी पांढरी फुले उमलतात."], [
          t("dfr-obs1", 45, "observation", ["Check buds and flowers", "कळ्या व फुले तपासा"], ["Look for ants, mealybugs and rotting buds.", "मुंग्या, पिठ्या ढेकूण व कुजणाऱ्या कळ्या पाहा."], 7),
          t("dfr-irr2", 45, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep light, even water during flowering.", "फुलोऱ्यात हलके, सारखे पाणी द्या."], 5),
          t("dfr-fert2", 60, "fertiliser", ["Next fertiliser part", "खताचा पुढचा हप्ता"], ["Give the next part as per your plan.", "नियोजनानुसार पुढचा हप्ता द्या."], 45),
        ], [["Flower bud drop", "कळ्यांची गळ"]]),
        stage("fruiting", ["Fruit growth & picking", "फळवाढ व तोडणी"], 90, 240, ["New flowers keep coming while earlier fruits ripen and are picked.", "आधीची फळे पिकून तोडली जात असताना नवी फुले येत राहतात."], [
          t("dfr-pick", 100, "harvest", ["Pick ripe fruit", "पिकलेली फळे तोडा"], ["Pick 3–5 days after the skin turns fully red or yellow; cut with secateurs.", "साल पूर्ण लाल किंवा पिवळी झाल्यानंतर 3–5 दिवसांनी सिकेटरने तोडा."], 4),
          t("dfr-obs2", 92, "observation", ["Check fruit and stems", "फळे व फांद्या तपासा"], ["Look for fruit spots, birds and stem rot.", "फळांवरील डाग, पक्षी व खोड कुजणे पाहा."], 7),
          t("dfr-drain", 95, "other", ["Keep drainage open in the rains", "पावसाळ्यात निचरा मोकळा ठेवा"], ["Clear channels so water does not stand around poles.", "खांबाभोवती पाणी साचू नये म्हणून चर मोकळे ठेवा."], 30),
        ], [["Stem rot in heavy rain", "जोरदार पावसात खोड कुजणे"], ["Birds pecking ripe fruit", "पिकलेल्या फळांना पक्षी टोचणे"]]),
        stage("rest", ["Winter rest", "हिवाळी विश्रांती"], 240, 300, ["Fruiting stops in the cool months; plants rest.", "थंडीच्या महिन्यांत फळे थांबतात; झाडे विश्रांती घेतात."], [
          t("dfr-clean", 240, "other", ["Clean the plantation", "बाग स्वच्छ करा"], ["Remove rotten fruit, dead stems and weeds.", "सडलेली फळे, वाळलेल्या फांद्या व तण काढा."]),
          t("dfr-irr3", 245, "irrigation", ["Light water", "हलके पाणी"], ["Give only enough water to keep stems firm.", "फांद्या टणक राहतील एवढेच पाणी द्या."], 10),
        ], [["Stem spots in cold, damp weather", "थंड दमट हवेत फांद्यांवर डाग"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Stem rot", "खोड कुजणे"),
      signs: b("Soft, yellow, water-soaked patches on stems that turn brown and rot, mostly in rain or waterlogging.", "फांद्यांवर मऊ, पिवळे, पाणथळ भाग जे तपकिरी होऊन कुजतात; बहुतेक पावसात किंवा पाणी साचल्यावर."),
      prevention: prevent("Plant on raised beds, keep drainage clear, cut out rotting parts with clean tools and burn them.", "गादीवाफ्यावर लागवड करा, निचरा मोकळा ठेवा, कुजलेले भाग स्वच्छ अवजाराने कापून जाळा."),
    },
    {
      name: b("Stem canker and spots", "फांद्यांवरील डाग (कँकर)"),
      signs: b("Small orange-brown spots on stems and fruit that become rough, sunken scabs.", "फांद्या व फळांवर लहान नारिंगी-तपकिरी ठिपके जे खडबडीत, खोलगट खपल्या बनतात."),
      prevention: prevent("Remove and burn spotted stems, prune for air flow and avoid overhead watering.", "डाग असलेल्या फांद्या काढून जाळा, हवा खेळती राहील अशी छाटणी करा आणि वरून पाणी देणे टाळा."),
    },
    {
      name: b("Sunscald", "उन्हाने करपणे"),
      signs: b("Stems on the sunny side turn yellow-white and dry in April–May.", "एप्रिल–मेमध्ये उन्हाच्या बाजूच्या फांद्या पिवळसर-पांढऱ्या होऊन सुकतात."),
      prevention: b("Use shade net over young plantations in peak summer and keep enough stems to shade each other.", "कडक उन्हाळ्यात लहान बागेवर शेडनेट वापरा आणि एकमेकांना सावली देतील एवढ्या फांद्या ठेवा."),
    },
  ],
  harvestSigns: b(
    "Skin turns fully red, pink or yellow (by type) and shiny, and the green flaps on the fruit start to dry at the tips — about 30–40 days after flowering.",
    "साल पूर्ण लाल, गुलाबी किंवा पिवळी (प्रकारानुसार) व चमकदार होते आणि फळावरच्या हिरव्या पाकळ्यांची टोके सुकू लागतात — फुलोऱ्यानंतर साधारण 30–40 दिवसांनी.",
  ),
  postHarvest: b(
    "Cut with secateurs, keep in shade, grade by size and colour and pack in boxes with padding. Fruits keep about a week at room temperature.",
    "सिकेटरने तोडा, सावलीत ठेवा, आकार व रंगानुसार प्रतवारी करा आणि गादी घातलेल्या खोक्यांत भरा. खोलीच्या तापमानात फळे साधारण आठवडाभर टिकतात.",
  ),
  marketTips: b(
    "Large, bright, unblemished fruit (300 g and above) sells best to city supermarkets and fruit shops. Plan sales with buyers before peak picking, as local markets can get flooded.",
    "मोठ्या (300 ग्रॅम व जास्त), चमकदार, डागरहित फळांना शहरातील सुपरमार्केट व फळ दुकानांत चांगला दर मिळतो. स्थानिक बाजारात आवक वाढू शकते, म्हणून मुख्य तोडणीपूर्वीच खरेदीदारांशी विक्रीचे नियोजन करा.",
  ),
  source: "General practices from ICAR-NIASM Baramati and MPKV Rahuri dragon fruit guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
