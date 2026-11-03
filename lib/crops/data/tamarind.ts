import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Tamarind: long-lived dryland tree; flowers in early monsoon, pods ripen the next winter–summer. */
const crop: PerennialCrop = {
  id: "tamarind",
  emoji: "🫘",
  name: b("Tamarind", "चिंच"),
  aliases: ["tamarind", "chinch", "chinchi", "imli", "imlee", "चिंच", "चिंचा", "इमली"],
  category: "fruit",
  lifecycle: "perennial",
  regions: ["marathwada", "western", "vidarbha"],
  tier: 2,
  plantingWindow: b("June–August, with the monsoon", "जून–ऑगस्ट, पावसाळ्यात"),
  plantingMonths: [6, 7, 8],
  plantingMaterial: b("Grafts of a known high-yielding, sweet or red-pulp type; seedlings take 8–10 years or more to bear", "खात्रीच्या जास्त उत्पादनाच्या, गोड किंवा लाल गराच्या प्रकाराची कलमे; बियांच्या रोपांना फळावर यायला 8–10 वर्षे किंवा जास्त लागतात"),
  spacing: b("10 m between rows and 10 m between plants (8 m × 8 m for grafts on light soil)", "दोन ओळींत 10 मीटर व दोन झाडांत 10 मीटर (हलक्या जमिनीत कलमांसाठी 8 × 8 मीटर)"),
  plantsPerAcre: [40, 63],
  yearsToFirstHarvest: [5, 7],
  economicLifeYears: [50, 80],
  soil: b(
    "Grows on poor, light, stony and slightly salty soils. Best on deep, well-drained soil.",
    "कमी कसाची, हलकी, मुरमाड व थोडी खारवट जमिनीतही येते. खोल, चांगला निचरा होणारी जमीन उत्तम.",
  ),
  climate: b(
    "Hot, dry climate. Very drought-hardy once established. Dry weather at pod ripening gives good-quality pulp.",
    "उष्ण, कोरडे हवामान. एकदा स्थिरावल्यावर दुष्काळ खूप चांगला सहन करते. शेंगा पिकताना कोरडी हवा असल्यास गर चांगल्या प्रतीचा मिळतो.",
  ),
  irrigation: b(
    "Rainfed. Water young grafts in the dry months for the first 2–3 years. Bearing trees need no regular irrigation.",
    "कोरडवाहू. पहिली 2–3 वर्षे कोरड्या महिन्यांत लहान कलमांना पाणी द्या. फळे देणाऱ्या झाडांना नियमित पाण्याची गरज नसते.",
  ),
  nutrientGuide: b(
    "Give well-rotted farmyard manure in the basin each year at the start of the rains. Add fertiliser only as per soil test; ask your agriculture officer for amounts.",
    "दरवर्षी पावसाच्या सुरुवातीला आळ्यात चांगले कुजलेले शेणखत द्या. खत फक्त माती परीक्षणानुसार द्या; प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Pratishthan", note: b("Released by VNMKV Parbhani", "वनामकृवि परभणीचा वाण") },
    { name: "PKM 1", note: b("High-yielding variety from TNAU, Periyakulam", "TNAU पेरियाकुलमचा जास्त उत्पादनाचा वाण") },
  ], // TODO: varieties — confirm Pratishthan and other Marathwada selections with VNMKV Parbhani
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Grafts are planted in pits and take root.", "कलमे खड्ड्यांत लावली जातात व मूळ धरतात."], [
      t("tm-pit", 0, "other", ["Plant grafts in prepared pits", "तयार खड्ड्यांत कलमे लावा"], ["Fill pits with topsoil and well-rotted manure; plant with the graft joint above soil and tie to a stick.", "खड्डे वरची माती व कुजलेल्या शेणखताने भरा; कलमाचा जोड जमिनीच्या वर ठेवून लावा व काठीला बांधा."]),
      t("tm-irr0", 2, "irrigation", ["Water if rain stops", "पाऊस थांबल्यास पाणी द्या"], ["Keep soil moist in dry spells.", "पावसाच्या खंडात माती ओलसर ठेवा."], 7),
      t("tm-gap", 25, "other", ["Replace dead grafts", "मेलेली कलमे बदला"], ["Fill gaps while the rains last.", "पाऊस असतानाच खाडे भरा."]),
    ], [["Termites", "वाळवी"], ["Grazing animals", "जनावरांनी खाणे"]]),
    stage("training", ["Training the young tree", "झाडाला आकार देणे"], 30, 1095, ["The slow-growing young tree is protected and shaped.", "हळू वाढणाऱ्या लहान झाडाचे संरक्षण करून आकार दिला जातो."], [
      t("tm-sprout", 45, "other", ["Remove rootstock shoots", "खुंटावरील फुटवे काढा"], ["Rub off shoots from below the graft joint.", "कलमाच्या जोडाखालचे फुटवे काढा."], 60),
      t("tm-irr1", 150, "irrigation", ["Water in the dry months", "कोरड्या महिन्यांत पाणी द्या"], ["Water young trees every 10–15 days from November to May.", "नोव्हेंबर ते मे लहान झाडांना दर 10–15 दिवसांनी पाणी द्या."], 12),
      t("tm-train", 365, "other", ["Shape the tree", "झाडाला आकार द्या"], ["Keep the stem clean up to about 1 m and keep 4–5 well-spaced branches.", "खोड साधारण 1 मीटरपर्यंत स्वच्छ ठेवा व 4–5 सारख्या अंतरावरच्या फांद्या ठेवा."]),
      t("tm-fence", 60, "other", ["Protect from animals", "जनावरांपासून संरक्षण करा"], ["Put thorny fencing or a tree guard around young plants.", "लहान झाडांभोवती काटेरी कुंपण किंवा ट्री-गार्ड लावा."]),
    ], [["Termites", "वाळवी"]]),
    stage("frame", ["Building the frame", "झाडाचा विस्तार"], 1095, 1825, ["The tree builds a wide crown; grafts start bearing in year 5–7.", "झाडाचा मोठा घेर तयार होतो; कलमे 5–7 व्या वर्षी फळावर येतात."], [
      t("tm-fym2", 1100, "fertiliser", ["Give manure each year", "दरवर्षी शेणखत द्या"], ["Apply well-rotted farmyard manure at the start of the rains.", "पावसाच्या सुरुवातीला कुजलेले शेणखत द्या."], 365),
      t("tm-obs2", 1100, "observation", ["Check the trees", "झाडे तपासा"], ["Look for scale insects and mealybugs on twigs and dead branches.", "फांद्यांवर खवले किडे, पिठ्या ढेकूण व वाळलेल्या फांद्या पाहा."], 60),
    ], [["Scale insects and mealybugs", "खवले किडे व पिठ्या ढेकूण"]]),
  ],
  cycles: [
    {
      key: "yearly",
      name: b("Yearly crop", "वार्षिक बहार"),
      startMonths: [5, 6],
      startEvent: b("Flowering with new leaves at the start of the monsoon", "पावसाळ्याच्या सुरुवातीला नवी पालवी व फुलोरा"),
      harvestMonths: [1, 2, 3, 4],
      note: b("Pods take about 8–10 months from flowering to ripen. Many trees bear heavily one year and lightly the next.", "फुलोऱ्यापासून शेंगा पिकायला साधारण 8–10 महिने लागतात. बरीच झाडे एका वर्षी भरपूर व पुढच्या वर्षी कमी फळे देतात."),
      stages: [
        stage("flowering", ["Flowering", "फुलोरा"], 0, 45, ["Small yellow-red flowers open in clusters.", "लहान पिवळसर-लाल फुलांचे घोस उमलतात."], [
          t("tmy-fym", 0, "fertiliser", ["Give manure", "शेणखत द्या"], ["Apply well-rotted farmyard manure in the basin at the start of the rains.", "पावसाच्या सुरुवातीला आळ्यात कुजलेले शेणखत द्या."]),
          t("tmy-obs1", 5, "observation", ["Check flowers and shoots", "फुले व फुटी तपासा"], ["Look for caterpillars and mealybugs on new growth.", "नव्या फुटीवर अळ्या व पिठ्या ढेकूण पाहा."], 10),
        ], [["Flower drop in long dry spells", "पावसाच्या मोठ्या खंडात फुलगळ"]]),
        stage("pod-set", ["Pod set", "शेंगा लागणे"], 45, 120, ["Small green pods form and slowly lengthen.", "लहान हिरव्या शेंगा लागतात व हळूहळू लांब होतात."], [
          t("tmy-weed", 50, "weeding", ["Clean the basin", "आळे स्वच्छ करा"], ["Remove weeds and bushes under the tree.", "झाडाखालचे तण व झुडपे काढा."], 45),
          t("tmy-obs2", 50, "observation", ["Check young pods", "कोवळ्या शेंगा तपासा"], ["Look for borer holes in pods.", "शेंगांना छिद्रे आहेत का पाहा."], 15),
        ], [["Pod borer", "शेंग पोखरणारी अळी"]]),
        stage("pod-growth", ["Pod filling", "शेंगा भरणे"], 120, 240, ["Pods fill with pulp and seeds through the winter.", "हिवाळ्यात शेंगांमध्ये गर व बिया भरतात."], [
          t("tmy-obs3", 125, "observation", ["Check pods and twigs", "शेंगा व फांद्या तपासा"], ["Look for scale insects, mealybugs and pod borer.", "खवले किडे, पिठ्या ढेकूण व शेंग पोखरणारी अळी पाहा."], 20),
          t("tmy-guard", 200, "other", ["Guard the crop", "पिकाची राखण करा"], ["Keep watch against theft and grazing as pods grow.", "शेंगा वाढताना चोरी व जनावरांपासून राखण करा."]),
        ], [["Scale insects", "खवले किडे"]]),
        stage("harvest", ["Ripening & harvest", "पिकणे व काढणी"], 240, 320, ["Pod shells turn brown and brittle; the pulp turns sticky and brown or red.", "शेंगांची साल तपकिरी व ठिसूळ होते; गर चिकट व तपकिरी किंवा लाल होतो."], [
          t("tmy-mat", 240, "observation", ["Check pod ripeness", "शेंगा पिकल्या का पाहा"], ["Ripe pods sound hollow when pressed and the shell cracks easily.", "पिकलेल्या शेंगा दाबल्यावर पोकळ आवाज येतो व साल सहज तडकते."]),
          t("tmy-pick", 245, "harvest", ["Harvest ripe pods", "पिकलेल्या शेंगा काढा"], ["Shake branches or pick by hand over a sheet; collect only ripe pods.", "कापड पसरून फांद्या हलवा किंवा हाताने काढा; फक्त पिकलेल्या शेंगा गोळा करा."], 15),
          t("tmy-dry", 250, "other", ["Dry and de-shell", "वाळवून टरफल काढा"], ["Dry pods in the sun, remove shell, fibre and seeds, and store the pulp clean.", "शेंगा उन्हात वाळवा, टरफल, धागे व चिंचोके काढा आणि गर स्वच्छ साठवा."], 15),
        ], [["Storage beetles in pulp", "गरात साठवणीतील भुंगे"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Pod borer", "शेंग पोखरणारी अळी"),
      signs: b("Holes in pods with droppings; pulp eaten and spoiled.", "शेंगांना छिद्रे व विष्ठा; गर खाल्लेला व खराब."),
      prevention: prevent("Collect and destroy fallen and damaged pods, and harvest on time.", "गळलेल्या व खराब शेंगा गोळा करून नष्ट करा आणि वेळेवर काढणी करा."),
    },
    {
      name: b("Scale insects and mealybugs", "खवले किडे व पिठ्या ढेकूण"),
      signs: b("Small crusts or white cottony insects on twigs; twigs dry and sooty mould appears.", "फांद्यांवर लहान खवले किंवा पांढरे कापसासारखे किडे; फांद्या वाळतात व काळी बुरशी येते."),
      prevention: prevent("Cut and burn badly affected twigs and keep ants off the trunk.", "जास्त बाधित फांद्या कापून जाळा आणि खोडावर मुंग्या चढू देऊ नका."),
    },
    {
      name: b("Storage pests in pulp", "साठवणीत गराला कीड"),
      signs: b("Beetles and grubs in stored pulp; it turns powdery or mouldy.", "साठवलेल्या गरात भुंगे व अळ्या; गर भुकटीसारखा किंवा बुरशीयुक्त होतो."),
      prevention: b("Dry pulp well, remove seeds, pack tightly with a little salt as is local practice, and store in a cool, dry place.", "गर चांगला वाळवा, चिंचोके काढा, स्थानिक पद्धतीप्रमाणे थोडे मीठ लावून घट्ट भरा आणि थंड, कोरड्या जागी साठवा."),
    },
  ],
  harvestSigns: b(
    "Shell turns brown and brittle, the pod sounds hollow when pressed and the pulp inside is sticky and dark.",
    "साल तपकिरी व ठिसूळ होते, दाबल्यावर शेंग पोकळ वाजते आणि आतील गर चिकट व गडद होतो.",
  ),
  postHarvest: b(
    "Dry pods in the sun, remove the shell, fibres and seeds, and pack the clean pulp in bags or blocks. Seeds can also be sold separately.",
    "शेंगा उन्हात वाळवा, टरफल, धागे व चिंचोके काढा आणि स्वच्छ गर पिशव्यांत किंवा गठ्ठ्यांत भरा. चिंचोकेही वेगळे विकता येतात.",
  ),
  marketTips: b(
    "Clean, seedless pulp fetches far more than whole pods. Red-pulp and sweet types get a premium. Women's groups can add value by making blocks, paste or sauce.",
    "बिया काढलेल्या स्वच्छ गराला अख्ख्या शेंगांपेक्षा खूप जास्त दर मिळतो. लाल गराच्या व गोड प्रकारांना जादा दर मिळतो. महिला बचत गट गठ्ठे, पेस्ट किंवा सॉस बनवून मूल्यवर्धन करू शकतात.",
  ),
  source: "General practices from VNMKV Parbhani and MPKV Rahuri dryland fruit guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
