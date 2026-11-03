import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Grapes: two prunings a year — April foundation pruning (canes) and October fruit pruning (crop). */
const crop: PerennialCrop = {
  id: "grapes",
  emoji: "🍇",
  name: b("Grapes", "द्राक्षे"),
  aliases: ["grapes", "grape", "draksh", "draksha", "drakshe", "angoor", "angur", "द्राक्ष", "द्राक्षे", "अंगूर"],
  category: "fruit",
  lifecycle: "perennial",
  regions: ["north", "western"],
  majorDistricts: b("Nashik, Sangli, Pune, Solapur", "नाशिक, सांगली, पुणे, सोलापूर"),
  tier: 1,
  plantingWindow: b(
    "Rootstock planted in February–March (or June–July); the chosen variety is grafted on it later in the season",
    "खुंट (रूटस्टॉक) फेब्रुवारी–मार्च (किंवा जून–जुलै) मध्ये लावा; त्याच हंगामात नंतर त्यावर निवडलेल्या वाणाचे कलम करा",
  ),
  plantingMonths: [2, 3, 6, 7],
  plantingMaterial: b(
    "Rooted rootstock cuttings (Dogridge is widely used) from a reliable nursery, grafted with healthy sticks of the chosen variety",
    "खात्रीच्या रोपवाटिकेतील मुळे फुटलेल्या खुंटाच्या काड्या (डॉगरिज मोठ्या प्रमाणावर वापरतात), त्यावर निवडलेल्या वाणाच्या निरोगी काडीचे कलम",
  ),
  spacing: b("About 2.7–3 m between rows and 1.5–1.8 m between vines, on a Y-trellis or overhead bower", "दोन ओळींत साधारण 2.7–3 मीटर व दोन वेलींत 1.5–1.8 मीटर; वाय (Y) मांडव किंवा सपाट मांडवावर"),
  plantsPerAcre: [750, 1000],
  yearsToFirstHarvest: [1.5, 2],
  economicLifeYears: [15, 25],
  soil: b(
    "Medium, well-drained soil with good depth. Avoid saline soil and soil where water stands; heavy black soil needs good drainage.",
    "मध्यम, चांगल्या खोलीची व पाण्याचा चांगला निचरा होणारी जमीन. क्षारयुक्त व पाणी साचणारी जमीन टाळा; भारी काळ्या जमिनीत निचऱ्याची चांगली सोय हवी.",
  ),
  climate: b(
    "Dry, warm weather with a mild winter suits it. Rain and cloudy weather after fruit pruning bring downy mildew; very cold nights in December–January can slow berry growth.",
    "कोरडे, उबदार हवामान व सौम्य हिवाळा योग्य. फळछाटणीनंतर पाऊस व ढगाळ हवामानात केवडा (डाऊनी) वाढतो; डिसेंबर–जानेवारीत खूप थंड रात्रींमुळे मण्यांची वाढ मंदावू शकते.",
  ),
  irrigation: b(
    "Drip irrigation is a must. Water need changes with each stage: less just after pruning, more during shoot growth and berry growth, and less again as berries soften and ripen. Uneven water cracks berries.",
    "ठिबक सिंचन आवश्यक. प्रत्येक अवस्थेत पाण्याची गरज बदलते: छाटणीनंतर लगेच कमी, फूट व मण्यांच्या वाढीत जास्त, आणि मणी मऊ होऊन पिकताना पुन्हा कमी. अनियमित पाण्याने मणी तडकतात.",
  ),
  nutrientGuide: b(
    "Base it on soil and petiole (leaf-stalk) tests, as advised by ICAR-NRC for Grapes. Give well-rotted farmyard manure after each pruning. Fertiliser is given in parts through drip, with different needs after foundation pruning (cane growth) and fruit pruning (bunch growth). Ask your agriculture officer for amounts.",
    "ICAR-राष्ट्रीय द्राक्ष संशोधन केंद्राच्या सल्ल्यानुसार माती व देठ (पानाच्या देठाचे) परीक्षणावर आधारित खत द्या. प्रत्येक छाटणीनंतर चांगले कुजलेले शेणखत द्या. खत ठिबकमधून हप्त्यांत द्या; खरड छाटणीनंतर (काडी वाढ) व फळछाटणीनंतर (घड वाढ) गरज वेगळी असते. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Thompson Seedless", note: b("Main white seedless table grape of Maharashtra; also used for raisins", "महाराष्ट्रातील मुख्य पांढरा बिनबियांचा खाण्याचा द्राक्ष वाण; बेदाण्यासाठीही वापर") },
    { name: "Tas-A-Ganesh", note: b("Selection from Thompson Seedless, widely grown in Sangli and Nashik", "थॉम्पसन सीडलेसमधून निवड; सांगली व नाशिकमध्ये मोठी लागवड") },
    { name: "Sonaka", note: b("Long-berried selection from Thompson Seedless; popular in Sangli and Solapur", "लांब मण्यांचा, थॉम्पसन सीडलेसमधून निवडलेला वाण; सांगली व सोलापूरमध्ये लोकप्रिय") },
    { name: "Sharad Seedless", note: b("Black seedless grape, widely grown", "काळा बिनबियांचा द्राक्ष वाण; मोठी लागवड") },
    { name: "Manjari Naveen", note: b("White seedless variety released by ICAR-NRC for Grapes, Pune", "ICAR-राष्ट्रीय द्राक्ष संशोधन केंद्र, पुणे यांचा पांढरा बिनबियांचा वाण") },
  ],
  establishment: [
    stage("rootstock", ["Rootstock planting", "खुंट लागवड"], 0, 60, ["Rootstock cuttings are planted and grow roots and shoots.", "खुंटाच्या काड्या लावल्या जातात व त्यांना मुळे व फूट येते."], [
      t("gr-plant", 0, "other", ["Plant rootstock in prepared trenches", "तयार चरीत खुंट लावा"], ["Fill trenches with topsoil and well-rotted manure, set the rootstock and lay drip lines.", "चर वरची माती व कुजलेल्या शेणखताने भरा, खुंट लावा आणि ठिबकच्या नळ्या टाका."]),
      t("gr-irr0", 1, "irrigation", ["Water the young rootstock", "लहान खुंटांना पाणी द्या"], ["Keep the soil moist through drip; do not let it dry.", "ठिबकने माती ओलसर ठेवा; कोरडी पडू देऊ नका."], 3),
      t("gr-gap0", 40, "other", ["Replace failed rootstock", "न रुजलेले खुंट बदला"], ["Replant gaps quickly so all vines are ready for grafting together.", "सर्व वेली एकाच वेळी कलमासाठी तयार व्हाव्यात म्हणून खाडे लवकर भरा."]),
    ], [["Termites and root rot in wet soil", "ओल्या जमिनीत वाळवी व मूळकूज"]]),
    stage("grafting", ["Grafting the variety", "वाणाचे कलम करणे"], 60, 210, ["The rootstock grows strong, then the chosen variety is grafted on it.", "खुंट जोमदार वाढतो, मग त्यावर निवडलेल्या वाणाचे कलम केले जाते."], [
      t("gr-stake", 60, "other", ["Stake and train one shoot", "काठी लावून एक फूट वाढवा"], ["Keep one strong shoot per rootstock, tie it to a stake, and remove the rest.", "प्रत्येक खुंटावर एक जोमदार फूट ठेवा, काठीला बांधा आणि बाकीची काढा."]),
      t("gr-graft", 150, "other", ["Graft the variety", "वाणाचे कलम करा"], ["Graft healthy sticks of the chosen variety when the rootstock is pencil-thick or more. Get trained grafters if you are new.", "खुंट पेन्सिलएवढा किंवा जास्त जाड झाल्यावर निवडलेल्या वाणाच्या निरोगी काडीचे कलम करा. नवीन असल्यास प्रशिक्षित कलम करणारे बोलवा."]),
      t("gr-irr1", 61, "irrigation", ["Irrigate by drip", "ठिबकने पाणी द्या"], ["Regular water keeps the rootstock growing.", "नियमित पाण्याने खुंटाची वाढ चालू राहते."], 4),
      t("gr-obs0", 165, "observation", ["Check graft success", "कलम यशस्वी झाले का पाहा"], ["Remove shoots from the rootstock below the graft; re-graft vines where it failed.", "कलमाखालील खुंटाची फूट काढा; कलम न जमलेल्या वेलींवर पुन्हा कलम करा."], 10),
    ], [["Downy mildew on young leaves in rain", "पावसात कोवळ्या पानांवर केवडा"]]),
    stage("training", ["Training trunk and arms", "खोड व ओलांडे तयार करणे"], 210, 420, ["The grafted shoot is trained up to the wire to form the trunk and the two arms (cordons).", "कलमाची फूट तारेपर्यंत वाढवून खोड व दोन ओलांडे (कॉर्डन) तयार केले जातात."], [
      t("gr-trellis", 210, "other", ["Build the trellis", "मांडव उभारा"], ["Put up the Y-trellis or bower with strong posts and wires before the vine reaches the top.", "वेल वर पोहोचण्यापूर्वी मजबूत खांब व तारांनी वाय मांडव किंवा सपाट मांडव उभारा."]),
      t("gr-train", 230, "other", ["Train the trunk to the wire", "खोड तारेपर्यंत वाढवा"], ["Tie the main shoot straight up; pinch it at the wire and grow two arms along the wire.", "मुख्य फूट सरळ बांधत न्या; तारेजवळ शेंडा खुडा आणि तारेवर दोन ओलांडे वाढवा."], 30),
      t("gr-irr2", 211, "irrigation", ["Irrigate by drip", "ठिबकने पाणी द्या"], ["Give regular water; more in summer.", "नियमित पाणी द्या; उन्हाळ्यात जास्त."], 4),
      t("gr-obs1", 215, "observation", ["Check leaves", "पाने तपासा"], ["Look for downy and powdery mildew, flea beetle and thrips on new growth.", "नव्या फुटीवर केवडा, भुरी, उडद्या भुंगेरे व फुलकिडे पाहा."], 10),
    ], [["Downy mildew", "केवडा (डाऊनी मिल्ड्यू)"], ["Powdery mildew", "भुरी"]]),
    stage("first-pruning", ["Ready for the first pruning", "पहिल्या छाटणीची तयारी"], 420, 540, ["Arms are complete. The vine now enters the yearly cycle of foundation and fruit pruning.", "ओलांडे पूर्ण होतात. वेल आता खरड व फळछाटणीच्या वार्षिक चक्रात येते."], [
      t("gr-plan", 420, "observation", ["Plan the first foundation pruning", "पहिल्या खरड छाटणीचे नियोजन करा"], ["Do the first foundation pruning in April; the first crop comes after the October fruit pruning that follows.", "पहिली खरड छाटणी एप्रिलमध्ये करा; त्यानंतरच्या ऑक्टोबरच्या फळछाटणीनंतर पहिले पीक येते."]),
      t("gr-irr3", 421, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep vines healthy until pruning.", "छाटणीपर्यंत वेली निरोगी ठेवा."], 5),
    ], [["Mealybug on the trunk", "खोडावर पिठ्या ढेकूण"]]),
  ],
  cycles: [
    {
      key: "foundation",
      name: b("Foundation (back) pruning", "खरड छाटणी"),
      startMonths: [4],
      startEvent: b("Back pruning of last season's canes in April", "एप्रिलमध्ये मागील हंगामाच्या काड्यांची खरड छाटणी"),
      harvestMonths: [9], // no fruit from this pruning: month the new canes are ripe and ready
      note: b(
        "No fruit is taken from this pruning. It builds strong, well-ripened canes that carry next season's fruit buds. A good foundation pruning decides the October crop.",
        "या छाटणीनंतर फळ घेतले जात नाही. यातून पुढील हंगामाचे फळधारक डोळे असलेल्या जोमदार, पक्क्या काड्या तयार होतात. चांगली खरड छाटणी ऑक्टोबरचे पीक ठरवते.",
      ),
      stages: [
        stage("pruning", ["Foundation pruning", "खरड छाटणी"], 0, 15, ["Last season's canes are cut back to 1–2 buds.", "मागील हंगामाच्या काड्या 1–2 डोळ्यांवर छाटल्या जातात."], [
          t("grf-prune", 0, "other", ["Prune back the canes", "काड्या खरड छाटा"], ["Cut canes back to 1–2 buds; remove dead wood and burn the cuttings.", "काड्या 1–2 डोळ्यांवर छाटा; वाळलेले लाकूड काढा आणि छाटलेले जाळा."]),
          t("grf-fym", 2, "fertiliser", ["Give manure and start feeding", "शेणखत द्या व खत सुरू करा"], ["Apply well-rotted farmyard manure and plan fertiliser by soil and petiole test.", "कुजलेले शेणखत द्या आणि माती व देठ परीक्षणानुसार खताचे नियोजन करा."]),
          t("grf-irr0", 3, "irrigation", ["Irrigate after pruning", "छाटणीनंतर पाणी द्या"], ["Give water to start sprouting; summer heat needs frequent drip.", "फूट येण्यासाठी पाणी द्या; उन्हाळ्यात ठिबक वारंवार चालवा."], 2),
        ], [["Uneven sprouting in summer heat", "उन्हाळ्यात असमान फूट"]]),
        stage("shoot-growth", ["Shoot growth and thinning", "फूट वाढ व विरळणी"], 15, 60, ["New shoots grow. Extra shoots are removed so each cane gets space and light.", "नवी फूट वाढते. प्रत्येक काडीला जागा व प्रकाश मिळावा म्हणून जास्तीची फूट काढली जाते."], [
          t("grf-thin", 20, "other", ["Thin the shoots", "फुटींची विरळणी करा"], ["Keep the right number of healthy shoots spaced along the arm; remove weak and crowded ones.", "ओलांड्यावर योग्य अंतरावर योग्य संख्येने निरोगी फुटी ठेवा; कमकुवत व दाट फुटी काढा."]),
          t("grf-irr1", 15, "irrigation", ["Irrigate", "पाणी द्या"], ["Shoots grow fast; keep regular drip water.", "फूट झपाट्याने वाढते; ठिबकने नियमित पाणी द्या."], 2),
          t("grf-obs1", 16, "observation", ["Check new shoots", "नवी फूट तपासा"], ["Look for flea beetle damage on buds, thrips, and mealybug coming up from the trunk.", "डोळ्यांवर उडद्या भुंगेऱ्यांचे नुकसान, फुलकिडे व खोडातून वर येणारे पिठ्या ढेकूण पाहा."], 7),
        ], [["Flea beetle on swelling buds", "फुगणाऱ्या डोळ्यांवर उडद्या भुंगेरे"], ["Thrips", "फुलकिडे"]]),
        stage("cane-development", ["Cane development", "काडी तयार होणे"], 60, 120, ["Shoots are stopped at the right length and grow thick; fruit buds form inside the canes.", "फुटींचा शेंडा योग्य लांबीवर खुडला जातो व काड्या जाड होतात; काड्यांत फळधारक डोळे तयार होतात."], [
          t("grf-stop", 60, "other", ["Pinch and stop the shoots", "शेंडे खुडा"], ["Pinch shoot tips and side shoots as advised so canes become thick and fruit buds form.", "सल्ल्यानुसार शेंडे व बगलफूट खुडा, म्हणजे काड्या जाड होतात व फळधारक डोळे तयार होतात."], 15),
          t("grf-irr2", 61, "irrigation", ["Irrigate carefully", "जपून पाणी द्या"], ["Avoid excess water in the monsoon; heavy growth gives fewer fruit buds.", "पावसाळ्यात जास्त पाणी टाळा; जास्त वाढ झाल्यास फळधारक डोळे कमी होतात."], 5),
          t("grf-obs2", 62, "observation", ["Check for downy mildew", "केवडा तपासा"], ["In rainy, cloudy weather look under leaves for white growth and yellow oily patches above.", "पावसाळी, ढगाळ हवामानात पानांखाली पांढरी वाढ व वर पिवळे तेलकट चट्टे पाहा."], 5),
        ], [["Downy mildew in the monsoon", "पावसाळ्यात केवडा"], ["Anthracnose on young canes", "कोवळ्या काड्यांवर करपा"]]),
        stage("cane-maturity", ["Cane maturity and rest", "काडी पक्व होणे व विश्रांती"], 120, 180, ["Canes turn brown and hard. The vine stores food for the fruit pruning.", "काड्या तपकिरी व कडक होतात. वेल फळछाटणीसाठी अन्नसाठा करते."], [
          t("grf-mature", 120, "observation", ["Check cane ripening", "काडी पक्व झाली का पाहा"], ["Well-ripened canes are brown up to the needed bud. Ask your KVK about a bud test before fruit pruning.", "पक्व काडी हव्या डोळ्यापर्यंत तपकिरी होते. फळछाटणीपूर्वी डोळा परीक्षणाबद्दल कृषी विज्ञान केंद्राला विचारा."]),
          t("grf-irr3", 121, "irrigation", ["Reduce water", "पाणी कमी करा"], ["Give only enough water to keep leaves healthy so canes ripen.", "काड्या पक्व होण्यासाठी पाने निरोगी राहतील एवढेच पाणी द्या."], 7),
          t("grf-obs3", 125, "observation", ["Keep leaves healthy", "पाने निरोगी ठेवा"], ["Leaves feed the canes until fruit pruning. Watch for mildew and leaf drop.", "फळछाटणीपर्यंत पाने काड्यांना अन्न पुरवतात. केवडा व पानगळीवर लक्ष ठेवा."], 10),
        ], [["Early leaf drop from disease", "रोगामुळे लवकर पानगळ"]]),
      ],
    },
    {
      key: "fruit",
      name: b("Fruit (forward) pruning", "फळछाटणी (ऑक्टोबर छाटणी)"),
      startMonths: [9, 10, 11],
      startEvent: b("Forward pruning of the ripened canes, mostly in October", "पक्व काड्यांची फळछाटणी, बहुधा ऑक्टोबरमध्ये"),
      harvestMonths: [2, 3, 4],
      note: b(
        "This is the cropping pruning. Bunches come on the new shoots and are harvested about 4–5 months later. Early pruning gets early market rates but faces more rain and disease risk.",
        "ही पीक देणारी छाटणी आहे. नव्या फुटीवर घड येतात आणि साधारण 4–5 महिन्यांनी काढणी होते. लवकर छाटणी केल्यास लवकरचा बाजारभाव मिळतो, पण पाऊस व रोगांचा धोका जास्त असतो.",
      ),
      stages: [
        stage("pruning", ["Fruit pruning", "फळछाटणी"], 0, 15, ["Ripened canes are cut at the fruit-bud position and start to sprout.", "पक्व काड्या फळधारक डोळ्याच्या जागी छाटल्या जातात व फुटू लागतात."], [
          t("grp-prune", 0, "other", ["Prune the canes", "काड्यांची छाटणी करा"], ["Cut each cane at the bud length suited to your variety and bud test. Remove leaves and burn the trash.", "वाण व डोळा परीक्षणानुसार योग्य डोळ्यावर काडी छाटा. पाने काढा आणि कचरा जाळा."]),
          t("grp-break", 1, "other", ["Even bud break", "डोळे एकसारखे फुटण्यासाठी"], ["Farmers apply a bud-breaking treatment for even sprouting — ask ICAR-NRC for Grapes or your KVK what to use and how.", "डोळे एकसारखे फुटावेत म्हणून शेतकरी उपचार करतात — काय व कसे वापरावे ते ICAR-राष्ट्रीय द्राक्ष संशोधन केंद्र किंवा कृषी विज्ञान केंद्राला विचारा."]),
          t("grp-irr0", 2, "irrigation", ["Irrigate after pruning", "छाटणीनंतर पाणी द्या"], ["Light, regular water to start sprouting.", "फूट सुरू होण्यासाठी हलके, नियमित पाणी."], 3),
        ], [["Uneven sprouting", "असमान फूट"], ["Flea beetle on buds", "डोळ्यांवर उडद्या भुंगेरे"]]),
        stage("shoot-growth", ["Shoot growth and bunch emergence", "फूट वाढ व घड दिसणे"], 15, 40, ["Shoots grow and small bunches appear on them.", "फूट वाढते आणि त्यावर लहान घड दिसू लागतात."], [
          t("grp-thin", 18, "other", ["Thin shoots and keep bunches", "फुटी विरळ करा व घड ठेवा"], ["Keep shoots that carry good bunches; remove extra and barren shoots.", "चांगले घड असलेल्या फुटी ठेवा; जास्तीच्या व वांझ फुटी काढा."]),
          t("grp-irr1", 15, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular drip water as shoots grow.", "फूट वाढताना ठिबकने नियमित पाणी."], 3),
          t("grp-obs1", 16, "observation", ["Check for downy mildew", "केवडा तपासा"], ["This is the riskiest stage. After any rain or cloudy days, check leaves and young bunches every day.", "ही सर्वात धोक्याची अवस्था. पाऊस किंवा ढगाळ दिवसांनंतर पाने व कोवळे घड रोज तपासा."], 3),
        ], [["Downy mildew on leaves and bunches", "पाने व घडांवर केवडा"], ["Thrips", "फुलकिडे"]]),
        stage("flowering", ["Flowering", "फुलोरा"], 40, 55, ["Bunches flower and berries set.", "घडांना फुलोरा येतो व मणी धरतात."], [
          t("grp-obs2", 40, "observation", ["Check bunches", "घड तपासा"], ["Look for downy mildew, thrips and flower drop.", "केवडा, फुलकिडे व फुलगळ पाहा."], 3),
          t("grp-irr2", 41, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Avoid water stress and excess at flowering — both cause poor set.", "फुलोऱ्यात पाण्याचा ताण व जास्त पाणी दोन्ही टाळा — दोन्हीने मणी कमी धरतात."], 3),
        ], [["Flower and berry drop", "फुल व मणीगळ"]]),
        stage("berry-set", ["Berry set and thinning", "मणी धरणे व विरळणी"], 55, 75, ["Small berries form. Bunches and berries are thinned for size and shape.", "लहान मणी तयार होतात. आकार व घडणीसाठी घड व मण्यांची विरळणी केली जाते."], [
          t("grp-bthin", 58, "other", ["Thin bunches and berries", "घड व मणी विरळणी करा"], ["Keep the number of bunches the vine can carry and thin berries for loose, even bunches. Growth regulators are used for berry size — ask your KVK; never guess.", "वेल पेलू शकेल एवढेच घड ठेवा आणि मोकळ्या, एकसारख्या घडासाठी मणी विरळ करा. मण्यांच्या आकारासाठी संजीवक वापरतात — कृषी विज्ञान केंद्राला विचारा; अंदाजाने वापरू नका."]),
          t("grp-irr3", 55, "irrigation", ["Irrigate", "पाणी द्या"], ["Berries now grow fast; increase water as needed.", "आता मणी झपाट्याने वाढतात; गरजेनुसार पाणी वाढवा."], 3),
          t("grp-obs3", 60, "observation", ["Check for powdery mildew", "भुरी तपासा"], ["Look for white powder on berries and leaves in dry, cool weather.", "कोरड्या, थंड हवामानात मणी व पानांवर पांढरी पावडर पाहा."], 5),
        ], [["Powdery mildew on berries", "मण्यांवर भुरी"]]),
        stage("berry-growth", ["Berry growth", "मण्यांची वाढ"], 75, 110, ["Berries swell to full size.", "मणी फुगून पूर्ण आकाराचे होतात."], [
          t("grp-irr4", 75, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Steady water gives size and prevents cracking.", "सारख्या पाण्याने आकार येतो व मणी तडकत नाहीत."], 3),
          t("grp-obs4", 77, "observation", ["Check bunches", "घड तपासा"], ["Look for mealybug in bunches, powdery mildew and berry cracking.", "घडांत पिठ्या ढेकूण, भुरी व तडकलेले मणी पाहा."], 5),
          t("grp-cover", 90, "other", ["Cover bunches if needed", "गरज असल्यास घडांना कागद लावा"], ["Paper covers or shade on the trellis protect white grapes from sunburn.", "कागदी आवरण किंवा मांडवावर सावलीमुळे पांढऱ्या द्राक्षांचे उन्हापासून संरक्षण होते."]),
        ], [["Mealybug in bunches", "घडांत पिठ्या ढेकूण"], ["Berry cracking after rain", "पावसानंतर मणी तडकणे"]]),
        stage("ripening", ["Softening and ripening", "मणी मऊ होणे व पिकणे"], 110, 135, ["Berries soften, sugar rises and colour develops.", "मणी मऊ होतात, गोडी वाढते व रंग येतो."], [
          t("grp-irr5", 110, "irrigation", ["Reduce water", "पाणी कमी करा"], ["Less water helps sugar build up; do not let vines wilt.", "कमी पाण्याने गोडी वाढते; वेली मलूल होऊ देऊ नका."], 4),
          t("grp-sugar", 120, "observation", ["Check sweetness", "गोडी तपासा"], ["Check sugar (TSS) with a refractometer or ask your buyer; check spray waiting periods on every label.", "रिफ्रॅक्टोमीटरने गोडी (TSS) तपासा किंवा खरेदीदाराला विचारा; प्रत्येक लेबलवरील फवारणीचा प्रतीक्षा कालावधी तपासा."], 5),
        ], [["Berry cracking and rot", "मणी तडकणे व सडणे"], ["Pink berry in white grapes", "पांढऱ्या द्राक्षांत गुलाबी मणी"]]),
        stage("harvest", ["Harvest", "काढणी"], 135, 160, ["Ripe bunches are cut, graded and packed.", "पिकलेले घड कापून प्रतवारी करून भरले जातात."], [
          t("grp-cut", 135, "harvest", ["Cut ripe bunches", "पिकलेले घड कापा"], ["Cut in cool morning hours with scissors, holding the bunch by its stalk; keep in shade.", "सकाळच्या थंड वेळी कात्रीने, घड देठाने धरून कापा; सावलीत ठेवा."], 4),
          t("grp-grade", 136, "other", ["Clean and grade bunches", "घड साफ करून प्रतवारी करा"], ["Remove cracked, rotten and small berries; grade bunches by size and pack gently.", "तडकलेले, सडलेले व लहान मणी काढा; आकारानुसार घडांची प्रतवारी करून हळुवार भरा."]),
        ], [["Berry drop and rot in transit", "वाहतुकीत मणीगळ व सडणे"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Downy mildew (kevda)", "केवडा (डाऊनी मिल्ड्यू)"),
      signs: b("Yellow oily patches on top of leaves with white downy growth underneath; young bunches turn brown and dry.", "पानांच्या वरच्या बाजूला पिवळे तेलकट चट्टे व खाली पांढरी केसाळ वाढ; कोवळे घड तपकिरी होऊन सुकतात."),
      prevention: prevent("Keep the canopy open by shoot thinning, drain water well, remove infected parts, and check daily after rain in the first 40 days after fruit pruning.", "फुटींची विरळणी करून वेल मोकळी ठेवा, पाण्याचा चांगला निचरा करा, रोगट भाग काढा आणि फळछाटणीनंतरच्या पहिल्या 40 दिवसांत पावसानंतर रोज तपासा."),
    },
    {
      name: b("Powdery mildew (bhuri)", "भुरी (पावडरी मिल्ड्यू)"),
      signs: b("White-grey powder on leaves, shoots and berries; berries get scarred and crack.", "पाने, फुटी व मण्यांवर पांढरट-राखाडी पावडर; मण्यांवर व्रण येऊन ते तडकतात."),
      prevention: prevent("Keep good air flow and sunlight into the canopy and watch closely in dry, cool weather after berry set.", "वेलीत हवा व सूर्यप्रकाश खेळता ठेवा आणि मणी धरल्यानंतर कोरड्या, थंड हवामानात बारीक लक्ष ठेवा."),
    },
    {
      name: b("Anthracnose (karpa)", "करपा (अँथ्रॅकनोज)"),
      signs: b("Small dark sunken spots with grey centres on young leaves, shoots and berries.", "कोवळी पाने, फुटी व मण्यांवर राखाडी मध्य असलेले लहान, खोलगट, काळपट डाग."),
      prevention: prevent("Remove and burn infected shoots and pruning trash, and keep the canopy open in the rainy season.", "रोगट फुटी व छाटणीचा कचरा काढून जाळा आणि पावसाळ्यात वेल मोकळी ठेवा."),
    },
    {
      name: b("Mealybug", "पिठ्या ढेकूण"),
      signs: b("White cottony insects under the bark and inside bunches; sticky honeydew and black sooty mould spoil the bunches.", "सालीखाली व घडांत पांढरे कापसासारखे कीटक; चिकट गोड स्राव व काळ्या बुरशीमुळे घड खराब होतात."),
      prevention: prevent("Remove loose bark from the trunk and arms after pruning, keep ants away, remove weeds, and check bunches often.", "छाटणीनंतर खोड व ओलांड्यावरील सैल साल काढा, मुंग्यांचा बंदोबस्त करा, तण काढा आणि घड वारंवार तपासा."),
    },
    {
      name: b("Flea beetle", "उडद्या भुंगेरे"),
      signs: b("Small shiny beetles eat swelling buds after pruning, so buds fail to sprout.", "छाटणीनंतर लहान चमकदार भुंगेरे फुगणारे डोळे खातात, त्यामुळे डोळे फुटत नाहीत."),
      prevention: prevent("Check buds daily for the first two weeks after pruning and remove loose bark where beetles hide.", "छाटणीनंतर पहिले दोन आठवडे डोळे रोज तपासा आणि भुंगेरे लपतात ती सैल साल काढा."),
    },
    {
      name: b("Berry cracking", "मणी तडकणे"),
      signs: b("Ripe berries split, often after rain or a sudden heavy irrigation; cracked berries rot.", "पाऊस किंवा अचानक जास्त पाण्यानंतर पिकलेले मणी तडकतात; तडकलेले मणी सडतात."),
      prevention: b("Keep water even through drip, avoid heavy irrigation near ripening, and harvest promptly.", "ठिबकने सारखे पाणी द्या, पिकण्याच्या वेळी जास्त पाणी टाळा आणि वेळेवर काढणी करा."),
    },
  ],
  harvestSigns: b(
    "Berries are soft, sweet and have the full colour of the variety, the bunch stalk starts turning brown, and sugar reaches the level your buyer wants. Usually 4–5 months after fruit pruning.",
    "मणी मऊ, गोड व वाणाच्या पूर्ण रंगाचे होतात, घडाचा देठ तपकिरी होऊ लागतो आणि खरेदीदाराला हवी तेवढी गोडी येते. साधारण फळछाटणीनंतर 4–5 महिन्यांनी.",
  ),
  postHarvest: b(
    "Keep bunches in shade, remove damaged berries, grade by size and colour, and pack in ventilated boxes. Pre-cool quickly for export or distant markets. Lower grades can be dried into raisins (bedana) on drying sheds.",
    "घड सावलीत ठेवा, खराब मणी काढा, आकार व रंगानुसार प्रतवारी करा आणि हवेशीर खोक्यांत भरा. निर्यात किंवा लांबच्या बाजारासाठी लवकर पूर्वशीतकरण करा. कमी दर्जाची द्राक्षे शेडवर सुकवून बेदाणा करता येतो.",
  ),
  marketTips: b(
    "Export needs a registered vineyard, spray records and fruit within residue limits — talk to your agriculture officer early. Uniform, well-coloured bunches with large berries get the best price. Raisin making is an option when table grape prices fall.",
    "निर्यातीसाठी बागेची नोंदणी, फवारणीच्या नोंदी व अवशेषमुक्त फळे आवश्यक — कृषी अधिकाऱ्यांशी लवकर बोला. एकसारखे, चांगल्या रंगाचे, मोठ्या मण्यांचे घड सर्वाधिक दराने विकले जातात. खाण्याच्या द्राक्षांचे दर पडल्यास बेदाणा करणे हा पर्याय आहे.",
  ),
  source: "General practices from ICAR-National Research Centre for Grapes, Pune and MPKV Rahuri",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
