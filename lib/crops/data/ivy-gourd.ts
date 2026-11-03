import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Perennial vine from stem cuttings: first crop in the planting year, then a yearly pruning and picking season for 3–4 years. */
const crop: PerennialCrop = {
  id: "ivy-gourd",
  emoji: "🥒",
  name: b("Ivy gourd", "तोंडली"),
  aliases: ["ivy gourd", "tondli", "tondali", "tondle", "tendli", "tindli", "तोंडली", "तोंडले", "kundru", "kundri", "कुंदरू", "tindora", "टिंडोरा"],
  category: "vegetable",
  lifecycle: "perennial",
  regions: ["konkan", "western", "north"],
  tier: 2,
  plantingWindow: b("June–July (monsoon); February–March where irrigation is assured", "जून–जुलै (पावसाळा); खात्रीचे पाणी असल्यास फेब्रुवारी–मार्च"),
  plantingMonths: [6, 7, 2, 3],
  plantingMaterial: b(
    "Stem cuttings (about 30 cm, 4–5 nodes) from healthy female vines that bear well. Plant about 1 male vine for every 10 female vines for fruit set.",
    "चांगली फळे देणाऱ्या निरोगी मादी वेलांचे फाटे (साधारण 30 सेंमी, 4–5 डोळे). फळधारणेसाठी दर 10 मादी वेलांमागे साधारण 1 नर वेल लावा.",
  ),
  spacing: b("On a trellis (mandav): 2 m between rows and 1.5–2 m between pits.", "मांडवावर: ओळींत 2 मीटर व खड्ड्यांत 1.5–2 मीटर."),
  plantsPerAcre: [1000, 1350],
  yearsToFirstHarvest: [1, 1],
  economicLifeYears: [3, 4],
  soil: b("Well-drained loamy or medium soil rich in organic matter. Avoid waterlogged fields.", "सेंद्रिय पदार्थ भरपूर असलेली, पाण्याचा निचरा होणारी पोयट्याची किंवा मध्यम जमीन. पाणी साचणारे शेत टाळा."),
  climate: b("Warm, humid weather. Growth slows in the cool winter months and picks up again with warm weather.", "उबदार, दमट हवामान. हिवाळ्यातील थंडीत वाढ मंदावते आणि उबदार हवामानात पुन्हा जोर धरते."),
  irrigation: b(
    "Monsoon planting needs water only in dry spells. In summer give water every 4–6 days, ideally by drip. Do not let water stand at the base.",
    "पावसाळी लागवडीला फक्त पावसाच्या खंडात पाणी. उन्हाळ्यात दर 4–6 दिवसांनी, शक्यतो ठिबकने पाणी द्या. बुंध्याजवळ पाणी साचू देऊ नका.",
  ),
  nutrientGuide: b(
    "Fill pits with topsoil and well-rotted farmyard manure. Give manure again after every pruning and fertiliser as per soil test, split into parts through the picking season. Ask your agriculture officer for amounts.",
    "खड्डे वरची माती व चांगले कुजलेले शेणखत यांनी भरा. प्रत्येक छाटणीनंतर पुन्हा शेणखत द्या आणि माती परीक्षणानुसार खत तोडणीच्या हंगामात हप्त्यांत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [], // TODO: varieties — farmers mostly use local selections; confirm released varieties with Dr. BSKKV Dapoli / ICAR-IIHR
  establishment: [
    stage("planting", ["Planting cuttings", "फाट्यांची लागवड"], 0, 30, ["Cuttings root and send out new shoots.", "फाट्यांना मुळे फुटतात व नवीन फूट येते."], [
      t("ig-plant", 0, "other", ["Plant cuttings in pits", "खड्ड्यांत फाटे लावा"], ["Plant 2 cuttings per pit at a slant with 2–3 nodes under the soil. Mark the male vines.", "एका खड्ड्यात 2 फाटे तिरके लावा, 2–3 डोळे मातीत. नर वेलांची खूण करून ठेवा."]),
      t("ig-irr0", 1, "irrigation", ["Keep soil moist", "माती ओलसर ठेवा"], ["Light water so the soil stays moist, not wet, until shoots come.", "फूट येईपर्यंत माती ओलसर राहील एवढे हलके पाणी द्या, चिखल नको."], 4),
      t("ig-gap", 25, "other", ["Replace failed cuttings", "न फुटलेले फाटे बदला"], ["Replant pits where cuttings did not sprout.", "जेथे फाटे फुटले नाहीत तेथे पुन्हा लावा."]),
    ], [["Cuttings rotting in wet soil", "ओल्या मातीत फाटे सडणे"]]),
    stage("vine-growth", ["Vine growth & trellis", "वेल वाढ व मांडव"], 30, 75, ["Vines grow and are trained onto the mandav.", "वेल वाढतात व मांडवावर चढवले जातात."], [
      t("ig-trellis", 30, "other", ["Train vines on the trellis", "वेल मांडवावर चढवा"], ["Guide vines up with string to a mandav about 1.5–2 m high.", "दोरीने वेल साधारण 1.5–2 मीटर उंच मांडवावर चढवा."]),
      t("ig-irr1", 31, "irrigation", ["Irrigate", "पाणी द्या"], ["Water when the top soil dries.", "वरची माती कोरडी झाल्यावर पाणी द्या."], 6),
      t("ig-weed", 40, "weeding", ["Weeding", "खुरपणी"], ["Keep pits and rows weed-free.", "खड्डे व ओळी तणमुक्त ठेवा."], 30),
      t("ig-fert1", 45, "fertiliser", ["Top dressing", "वरखत द्या"], ["Give fertiliser as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार खत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Downy mildew in humid weather", "दमट हवामानात केवडा"]]),
    stage("first-crop", ["First picking season", "पहिला तोडणी हंगाम"], 75, 270, ["Flowers and fruits come; tender fruits are picked every 3–4 days.", "फुले व फळे येतात; दर 3–4 दिवसांनी कोवळी फळे तोडली जातात."], [
      t("ig-pick0", 80, "harvest", ["Pick tender fruits", "कोवळी फळे तोडा"], ["Pick green, firm, tender fruits before they turn red inside.", "आतून लाल होण्यापूर्वी हिरवी, टणक, कोवळी फळे तोडा."], 3),
      t("ig-irr2", 76, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water keeps the vines bearing.", "नियमित पाण्याने वेल फळे देत राहतात."], 6),
      t("ig-obs0", 78, "observation", ["Check vines and fruits", "वेल व फळे तपासा"], ["Look for fruit fly stings, galls on stems and yellow leaf patches.", "फळमाशीचे डंख, खोडावरील गाठी व पानांवरील पिवळे चट्टे पाहा."], 7),
      t("ig-fert2", 120, "fertiliser", ["Feed during picking", "तोडणीदरम्यान खत"], ["Give the next fertiliser part as per your plan.", "नियोजनानुसार पुढचा खत हप्ता द्या."], 60),
    ], [["Fruit fly", "फळमाशी"], ["Gall fly: swellings on stems", "गाठमाशी: खोडावर गाठी"]]),
  ],
  cycles: [
    {
      key: "yearly-pruning",
      name: b("Yearly pruning and picking", "वार्षिक छाटणी व तोडणी"),
      startMonths: [12, 1, 2],
      startEvent: b("Prune the vines back after the cool season and give manure", "थंडीचा हंगाम संपल्यावर वेलांची छाटणी करून शेणखत द्या"),
      harvestMonths: [3, 4, 5, 6, 7, 8, 9, 10, 11],
      note: b("Most farmers keep a planting for 3–4 years, pruning once a year; replant when yield falls.", "बहुतेक शेतकरी एक लागवड 3–4 वर्षे ठेवतात, वर्षातून एकदा छाटणी करतात; उत्पादन घटल्यावर नवीन लागवड करा."),
      stages: [
        stage("pruning", ["Pruning", "छाटणी"], 0, 15, ["Old vines are cut back so fresh shoots can grow.", "नवी फूट यावी म्हणून जुने वेल कापले जातात."], [
          t("igc-prune", 0, "other", ["Prune old vines", "जुने वेल छाटा"], ["Cut vines back, keeping the main stem and a few strong branches. Remove dry and diseased parts and galls; burn them.", "मुख्य खोड व काही मजबूत फांद्या ठेवून वेल छाटा. वाळलेले, रोगट भाग व गाठी काढून जाळा."]),
          t("igc-fym", 3, "fertiliser", ["Give manure", "शेणखत द्या"], ["Put well-rotted farmyard manure around the base and mix lightly.", "बुंध्याभोवती कुजलेले शेणखत टाकून हलके मिसळा."]),
          t("igc-irr0", 5, "irrigation", ["Irrigate after pruning", "छाटणीनंतर पाणी द्या"], ["Give a good watering, then light regular water.", "भरपूर पाणी द्या, मग हलके नियमित पाणी."], 5),
        ], [["Galls on old stems — remove them now", "जुन्या खोडांवर गाठी — आत्ताच काढा"]]),
        stage("regrowth", ["New growth", "नवी फूट"], 15, 45, ["New shoots spread over the trellis.", "नवी फूट मांडवावर पसरते."], [
          t("igc-irr1", 15, "irrigation", ["Irrigate", "पाणी द्या"], ["Water when the top soil dries.", "वरची माती कोरडी झाल्यावर पाणी द्या."], 5),
          t("igc-train", 18, "other", ["Spread shoots on the trellis", "फूट मांडवावर पसरवा"], ["Guide new shoots evenly over the mandav.", "नवी फूट मांडवावर सारखी पसरवा."]),
          t("igc-weed", 20, "weeding", ["Weeding", "खुरपणी"], ["Keep the base weed-free.", "बुंध्याजवळ तण ठेवू नका."]),
        ], [["Sucking pests on new shoots", "नव्या फुटीवर रसशोषक किडी"]]),
        stage("flowering", ["Flowering", "फुलोरा"], 45, 60, ["White flowers open; male vines supply pollen.", "पांढरी फुले उमलतात; नर वेलांतून परागकण मिळतात."], [
          t("igc-irr2", 45, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even moisture helps fruit set.", "सारख्या ओलाव्याने फळधारणा चांगली होते."], 5),
          t("igc-trap", 46, "observation", ["Set fruit fly traps", "फळमाशीसाठी सापळे लावा"], ["Hang traps before fruits form. Ask your KVK which trap to use.", "फळे लागण्यापूर्वी सापळे लावा. कोणता सापळा ते कृषी विज्ञान केंद्राला विचारा."]),
        ], [["Fruit fly", "फळमाशी"]]),
        stage("picking", ["Picking season", "तोडणी हंगाम"], 60, 300, ["Tender fruits are picked every 3–4 days for several months.", "अनेक महिने दर 3–4 दिवसांनी कोवळी फळे तोडली जातात."], [
          t("igc-pick", 60, "harvest", ["Pick tender fruits", "कोवळी फळे तोडा"], ["Pick green, firm fruits before they turn red inside.", "आतून लाल होण्यापूर्वी हिरवी, टणक फळे तोडा."], 3),
          t("igc-irr3", 61, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep watering regularly; less in the rainy season.", "नियमित पाणी द्या; पावसाळ्यात कमी."], 6),
          t("igc-obs", 63, "observation", ["Check vines and fruits", "वेल व फळे तपासा"], ["Remove fly-stung fruits and stem galls; look for yellow patches on leaves.", "फळमाशीचे डंख असलेली फळे व खोडावरील गाठी काढा; पानांवर पिवळे चट्टे पाहा."], 7),
          t("igc-fert", 75, "fertiliser", ["Feed during picking", "तोडणीदरम्यान खत"], ["Give fertiliser in parts as per your plan.", "नियोजनानुसार खत हप्त्यांत द्या."], 60),
          t("igc-phi", 62, "observation", ["Check spray waiting periods", "फवारणीचा प्रतीक्षा कालावधी तपासा"], ["Do not pick before the waiting period on the label of any product you sprayed.", "फवारलेल्या औषधाच्या लेबलवरील प्रतीक्षा कालावधीपूर्वी तोडणी करू नका."]),
        ], [["Fruit fly", "फळमाशी"], ["Downy mildew in the rains", "पावसाळ्यात केवडा"]]),
      ],
    },
  ],
  commonProblems: [
    { name: b("Fruit fly", "फळमाशी"), signs: b("Stings on fruit; fruit turns soft, yellow and rots.", "फळांवर डंख; फळ मऊ, पिवळे होऊन सडते."), prevention: prevent("Use fruit fly traps, pick regularly and bury damaged fruits.", "फळमाशीचे सापळे लावा, नियमित तोडणी करा व खराब फळे पुरा.") },
    { name: b("Gall fly (stem galls)", "गाठमाशी (खोडावर गाठी)"), signs: b("Round swellings on young stems; growth beyond the gall becomes weak.", "कोवळ्या खोडांवर गोल गाठी; गाठीपुढील वाढ कमजोर होते."), prevention: prevent("Cut and burn stems with galls regularly, especially at pruning.", "गाठी असलेले फाटे नियमित, विशेषतः छाटणीवेळी, कापून जाळा.") },
    { name: b("Downy mildew", "केवडा"), signs: b("Yellow patches on top of leaves in humid weather; leaves dry.", "दमट हवामानात पानांवर वरून पिवळे चट्टे; पाने सुकतात."), prevention: prevent("Keep the trellis open for air and remove affected leaves.", "हवा खेळती राहील असा मांडव ठेवा व बाधित पाने काढा.") },
  ],
  harvestSigns: b("Fruits are green, firm and tender, about 5–7 cm long, and still white inside.", "फळे हिरवी, टणक व कोवळी, साधारण 5–7 सेंमी लांब आणि आतून पांढरी."),
  postHarvest: b("Pick in cool hours, keep in shade, remove reddening or damaged fruits, and pack in ventilated bags or crates.", "थंड वेळेत तोडा, सावलीत ठेवा, लाल होऊ लागलेली व खराब फळे काढा आणि हवेशीर पिशव्या किंवा क्रेटमध्ये भरा."),
  marketTips: b("Small, uniform, tender fruits get the best price. Regular supply to the same trader or market builds steady demand.", "लहान, एकसारख्या, कोवळ्या फळांना चांगला दर. एकाच व्यापाऱ्याला किंवा बाजारात नियमित माल दिल्यास स्थिर मागणी तयार होते."),
  source: "General practices from Dr. BSKKV Dapoli, MPKV Rahuri and ICAR-IIHR vegetable guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
