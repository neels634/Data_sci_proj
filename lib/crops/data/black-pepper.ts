import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: PerennialCrop = {
  id: "black-pepper",
  emoji: "⚫",
  name: b("Black pepper", "काळी मिरी"),
  aliases: ["black pepper", "pepper", "kali miri", "kaali miri", "miri", "काळी मिरी", "मिरी", "kali mirch", "काली मिर्च", "mire", "peper"],
  category: "spice",
  lifecycle: "perennial",
  regions: ["konkan"],
  majorDistricts: b("Sindhudurg, Ratnagiri", "सिंधुदुर्ग, रत्नागिरी"),
  tier: 2,
  plantingWindow: b("June–July, after the monsoon sets in", "जून–जुलै, पाऊस सुरू झाल्यावर"),
  plantingMonths: [6, 7],
  plantingMaterial: b("Rooted cuttings from runner shoots, from a reliable nursery or university", "धावत्या फांद्यांपासून तयार केलेली मुळे फुटलेली कलमे; विश्वसनीय रोपवाटिका किंवा विद्यापीठातून"),
  spacing: b("One or two vines at the base of each support tree — arecanut, coconut, or live supports like glyricidia or silver oak. On open land, supports about 3 m × 3 m.", "प्रत्येक आधार झाडाच्या बुंध्याशी एक-दोन वेली — सुपारी, नारळ, किंवा गिरीपुष्प, सिल्व्हर ओकसारखे जिवंत आधार. मोकळ्या जमिनीत आधार साधारण 3 मीटर × 3 मीटर."),
  plantsPerAcre: [400, 550],
  yearsToFirstHarvest: [3, 4],
  economicLifeYears: [20, 25],
  soil: b(
    "Well-drained red laterite or loamy soil rich in organic matter. Standing water at the root kills vines — avoid low, waterlogged spots.",
    "सेंद्रिय पदार्थ भरपूर असलेली, पाण्याचा चांगला निचरा होणारी लाल जांभी किंवा पोयट्याची जमीन. मुळाशी पाणी साचल्यास वेल मरतात — सखल, पाणथळ जागा टाळा.",
  ),
  climate: b(
    "Warm, humid climate with good rain and partial shade, as in Konkan. Needs protection from strong summer sun.",
    "कोकणाप्रमाणे भरपूर पाऊस, उबदार दमट हवा व अंशतः सावली. उन्हाळ्यातील कडक उन्हापासून संरक्षण लागते.",
  ),
  irrigation: b(
    "Rainfed during the monsoon. From December–January to May, water every 7–10 days in the basin; young vines need summer water most. Never let water stand at the base.",
    "पावसाळ्यात पावसावर. डिसेंबर–जानेवारी ते मे दर 7–10 दिवसांनी आळ्यात पाणी द्या; लहान वेलींना उन्हाळ्यात पाणी सर्वात जास्त गरजेचे. बुंध्याशी पाणी कधीही साचू देऊ नका.",
  ),
  nutrientGuide: b(
    "Give well-rotted farmyard manure or compost and leaf mulch in the basin each year at the start of the monsoon. Base fertiliser on a soil test and split it into two parts — early monsoon and late monsoon. Ask your agriculture officer for amounts.",
    "दरवर्षी पावसाच्या सुरुवातीला आळ्यात चांगले कुजलेले शेणखत किंवा कंपोस्ट व पालापाचोळ्याचे आच्छादन द्या. खत माती परीक्षणावर आधारित द्या आणि दोन हप्त्यांत — पावसाच्या सुरुवातीला व शेवटी — द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Panniyur-1", note: b("High-yielding hybrid from Kerala Agricultural University; grown in Konkan", "केरळ कृषी विद्यापीठाचा जास्त उत्पादन देणारा संकरित वाण; कोकणात लागवड") },
    { name: "IISR Sreekara", note: b("Released by ICAR-IISR, Kozhikode", "ICAR-IISR, कोझिकोडचा वाण") },
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 60, ["Rooted cuttings are planted near the support and start climbing.", "मुळे फुटलेली कलमे आधाराजवळ लावली जातात व चढू लागतात."], [
      t("bp-pit", 0, "other", ["Plant near the support", "आधाराजवळ लागवड करा"], ["Plant 2 cuttings in a pit filled with topsoil and manure, about 30 cm from the north side of the support tree.", "वरची माती व शेणखताने भरलेल्या खड्ड्यात आधार झाडाच्या उत्तरेकडे साधारण 30 सेंमी अंतरावर 2 कलमे लावा."]),
      t("bp-tie0", 15, "other", ["Tie the vine to the support", "वेल आधाराला बांधा"], ["Tie the new shoots loosely to the support so they cling and climb.", "नवीन फूट आधाराला सैल बांधा, म्हणजे ती चिकटून चढते."], 15),
      t("bp-drain0", 20, "other", ["Make sure water drains", "पाण्याचा निचरा पाहा"], ["Raise the soil around the base so rain water flows away.", "पावसाचे पाणी वाहून जावे म्हणून बुंध्याभोवती माती उंच करा."]),
    ], [["Cuttings rotting in waterlogged pits", "पाणी साचलेल्या खड्ड्यांत कलमे कुजणे"]]),
    stage("first-year", ["First year", "पहिले वर्ष"], 60, 365, ["Young vines grow up the support; the first summer is the riskiest.", "लहान वेली आधारावर चढतात; पहिला उन्हाळा सर्वात धोक्याचा."], [
      t("bp-tie1", 60, "other", ["Keep tying shoots", "फूट बांधत राहा"], ["Tie new growth every month so it doesn't hang loose.", "नवी वाढ लोंबकळू नये म्हणून दर महिन्याला बांधा."], 30),
      t("bp-obs0", 75, "observation", ["Check vines", "वेली तपासा"], ["Look for yellowing, wilting or dark patches at the base.", "पिवळेपणा, मलूलपणा किंवा बुंध्याशी काळे चट्टे आहेत का पाहा."], 30),
      t("bp-shade0", 180, "other", ["Shade young vines in summer", "उन्हाळ्यात लहान वेलींना सावली करा"], ["Cover young vines with palm leaves or grass from December to May.", "डिसेंबर ते मे लहान वेलींना झावळ्या किंवा गवताने झाका."]),
      t("bp-irr0", 190, "irrigation", ["Summer irrigation", "उन्हाळी पाणी"], ["Water the basin every 7–10 days until the monsoon.", "पाऊस येईपर्यंत दर 7–10 दिवसांनी आळ्यात पाणी द्या."], 8),
    ], [["Vines drying in the first summer", "पहिल्या उन्हाळ्यात वेली सुकणे"], ["Foot rot (quick wilt)", "मर रोग (झटपट मर)"]]),
    stage("training", ["Training to bearing", "उत्पादनापर्यंत वाढ"], 365, 1095, ["Vines cover the support; the first spikes come in year 3–4.", "वेली आधार झाकतात; तिसऱ्या-चौथ्या वर्षी पहिले घोस येतात."], [
      t("bp-fym1", 365, "fertiliser", ["Manure and mulch at monsoon start", "पावसाच्या सुरुवातीला शेणखत व आच्छादन"], ["Give well-rotted manure and leaf mulch in the basin each June.", "दर जूनमध्ये आळ्यात कुजलेले शेणखत व पालापाचोळ्याचे आच्छादन द्या."], 365),
      t("bp-tie2", 370, "other", ["Tie and guide vines", "वेली बांधा व वळण द्या"], ["Keep vines tied up to about 6 m; remove runner shoots trailing on the ground.", "साधारण 6 मीटरपर्यंत वेली बांधत राहा; जमिनीवर धावणाऱ्या फांद्या काढा."], 60),
      t("bp-irr1", 540, "irrigation", ["Summer irrigation", "उन्हाळी पाणी"], ["Water every 7–10 days from January to May.", "जानेवारी ते मे दर 7–10 दिवसांनी पाणी द्या."], 8),
      t("bp-obs1", 380, "observation", ["Check the base and leaves", "बुंधा व पाने तपासा"], ["Look for dark rotting at the collar, yellowing leaves and leaf drop after rains.", "बुंध्याशी काळी कुज, पिवळी पाने व पावसानंतर पानगळ आहे का पाहा."], 30),
    ], [["Foot rot (quick wilt)", "मर रोग (झटपट मर)"], ["Slow decline: yellowing and slow drying", "हळू मर: पिवळेपणा व हळूहळू सुकणे"]]),
  ],
  cycles: [
    {
      key: "annual",
      name: b("Yearly crop", "वार्षिक पीक"),
      startMonths: [5, 6],
      startEvent: b("Pre-monsoon showers (or summer irrigation) bring new shoots and spikes", "मान्सूनपूर्व सरी (किंवा उन्हाळी पाणी) मुळे नवी फूट व घोस येतात"),
      harvestMonths: [12, 1, 2],
      note: b("Spikes form with the monsoon and ripen in winter. Pick when one or two berries on a spike turn red.", "पावसासोबत घोस येतात व हिवाळ्यात तयार होतात. घोसातील एक-दोन मणी लाल झाले की तोडणी करा."),
      stages: [
        stage("pre-monsoon", ["Pre-monsoon care", "पावसाळ्यापूर्वीची काळजी"], 0, 30, ["Vines are fed and basins cleaned before the rains.", "पावसापूर्वी वेलींना खत दिले जाते व आळी स्वच्छ केली जातात."], [
          t("yr-fym", 0, "fertiliser", ["Manure and mulch", "शेणखत व आच्छादन"], ["Clean the basin, give well-rotted manure and cover with leaf mulch.", "आळे स्वच्छ करा, कुजलेले शेणखत द्या व पालापाचोळ्याने झाका."]),
          t("yr-drain", 10, "other", ["Open drains", "चर मोकळे करा"], ["Clear drains so monsoon water doesn't stand at the base.", "पावसाचे पाणी बुंध्याशी साचू नये म्हणून चर मोकळे करा."]),
          t("yr-shade", 15, "other", ["Regulate shade", "सावली नियंत्रित करा"], ["Lop extra branches of live supports so vines get filtered light.", "वेलींना मंद प्रकाश मिळावा म्हणून जिवंत आधारांच्या जास्तीच्या फांद्या छाटा."]),
        ], [["Collar rot starting with the first rains", "पहिल्या पावसासोबत बुंध्याशी कुज सुरू होणे"]]),
        stage("spiking", ["Spike emergence & flowering", "घोस येणे व फुलोरा"], 30, 90, ["Flower spikes come out on new shoots with the monsoon.", "पावसासोबत नव्या फुटीवर फुलांचे घोस येतात."], [
          t("yr-obs1", 30, "observation", ["Check vines in the rains", "पावसात वेली तपासा"], ["Look for dark spots on leaves, sudden leaf drop and wilting — signs of foot rot.", "पानांवर काळे डाग, अचानक पानगळ व मलूलपणा — मर रोगाची लक्षणे — पाहा."], 15),
          t("yr-fert2", 60, "fertiliser", ["Second feeding", "दुसरा खत हप्ता"], ["Give the second fertiliser part as per your plan. Ask your agriculture officer for amounts.", "नियोजनानुसार दुसरा खत हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
          t("yr-runner", 45, "other", ["Remove ground runners", "जमिनीवरील धावत्या फांद्या काढा"], ["Cut runners on the ground; they spread foot rot and waste energy.", "जमिनीवर धावणाऱ्या फांद्या कापा; त्यांच्यामुळे मर पसरतो व ताकद वाया जाते."]),
        ], [["Foot rot (quick wilt)", "मर रोग (झटपट मर)"], ["Pollu beetle on young berries", "कोवळ्या मण्यांवर पोळू भुंगा"]]),
        stage("berry-growth", ["Berry development", "मणी पोसणे"], 90, 210, ["Berries grow and fill on the spikes.", "घोसांवर मणी वाढतात व भरतात."], [
          t("yr-obs2", 90, "observation", ["Check spikes", "घोस तपासा"], ["Hollow, dark berries mean pollu beetle; spotted berries mean anthracnose.", "पोकळ, काळे मणी म्हणजे पोळू भुंगा; डागाळलेले मणी म्हणजे करपा."], 15),
          t("yr-mulch", 150, "other", ["Mulch after the rains", "पाऊस संपल्यावर आच्छादन"], ["Mulch the basin with dry leaves to keep moisture.", "ओलावा टिकवण्यासाठी आळ्यात सुक्या पानांचे आच्छादन करा."]),
          t("yr-irr", 160, "irrigation", ["Start irrigation", "पाणी सुरू करा"], ["Once the soil dries after the rains, water every 7–10 days.", "पावसानंतर जमीन कोरडी झाली की दर 7–10 दिवसांनी पाणी द्या."], 8),
        ], [["Pollu beetle", "पोळू भुंगा"], ["Anthracnose on berries", "मण्यांवर करपा"]]),
        stage("harvest", ["Harvest", "तोडणी"], 210, 270, ["Spikes are picked in rounds as berries mature.", "मणी तयार होतील तसे घोस फेऱ्यांमध्ये तोडले जातात."], [
          t("yr-mat", 210, "observation", ["Check maturity", "पक्वता तपासा"], ["Ready when one or two berries on a spike turn orange-red.", "घोसातील एक-दोन मणी नारिंगी-लाल झाले की तयार."]),
          t("yr-pick", 212, "harvest", ["Pick spikes", "घोस तोडा"], ["Pick whole spikes by hand, using a safe ladder; collect in clean bags.", "सुरक्षित शिडी वापरून घोस हाताने तोडा; स्वच्छ पिशव्यांत गोळा करा."], 10),
          t("yr-dry", 214, "other", ["Separate and dry berries", "मणी वेगळे करून वाळवा"], ["Separate berries from spikes, dip them in hot water for about a minute if you can, then sun-dry on a clean mat or tarpaulin for 7–10 days until black and crisp.", "घोसांपासून मणी वेगळे करा, शक्य असल्यास साधारण एक मिनिट गरम पाण्यात बुडवा, मग स्वच्छ चटईवर किंवा ताडपत्रीवर 7–10 दिवस काळे व कुरकुरीत होईपर्यंत उन्हात वाळवा."], 10),
        ], [["Mould on berries dried on bare ground or in damp weather", "उघड्या जमिनीवर किंवा दमट हवेत वाळवलेल्या मण्यांना बुरशी"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Foot rot (quick wilt)", "मर रोग (झटपट मर)"),
      signs: b("Dark spots on leaves, heavy leaf and spike drop, then the whole vine wilts and dries within days; the base is dark and rotten.", "पानांवर काळे डाग, मोठ्या प्रमाणात पाने व घोस गळतात, मग काही दिवसांत संपूर्ण वेल मलूल होऊन सुकतो; बुंधा काळा व कुजलेला असतो."),
      prevention: prevent("Keep good drainage, avoid injuring roots while digging, remove ground runners, and take out and destroy dead vines with their roots.", "पाण्याचा चांगला निचरा ठेवा, खोदताना मुळांना इजा करू नका, जमिनीवरील धावत्या फांद्या काढा आणि मेलेले वेल मुळांसकट काढून नष्ट करा."),
    },
    {
      name: b("Pollu beetle", "पोळू भुंगा"),
      signs: b("Small black beetles; berries become hollow, dark and crumble.", "लहान काळे भुंगे; मणी पोकळ, काळे होऊन भुगा होतो."),
      prevention: prevent("Keep shade moderate (too much shade favours it) and collect and destroy fallen hollow berries.", "सावली मध्यम ठेवा (जास्त सावलीत वाढ होते) आणि गळलेले पोकळ मणी गोळा करून नष्ट करा."),
    },
    {
      name: b("Slow decline", "हळू मर"),
      signs: b("Leaves yellow and drop slowly over months; vines lose vigour. Roots show knots or rot.", "महिनोन्महिने पाने हळूहळू पिवळी पडून गळतात; वेलींचा जोम कमी होतो. मुळांवर गाठी किंवा कुज दिसते."),
      prevention: prevent("Use healthy rooted cuttings, add plenty of organic manure, and avoid waterlogging.", "निरोगी कलमे वापरा, भरपूर सेंद्रिय खत द्या आणि पाणी साचू देऊ नका."),
    },
    {
      name: b("Anthracnose", "करपा (अँथ्रॅक्नोज)"),
      signs: b("Brown spots with yellow edges on leaves; berries crack and turn dark.", "पानांवर पिवळ्या कडांचे तपकिरी डाग; मणी तडकून काळे होतात."),
      prevention: prevent("Remove and destroy affected leaves and spikes, and regulate shade for air flow.", "बाधित पाने व घोस काढून नष्ट करा आणि हवा खेळती राहावी म्हणून सावली नियंत्रित करा."),
    },
  ],
  harvestSigns: b("One or two berries on a spike turn orange-red while the rest are still green and hard (December–February in Konkan).", "घोसातील एक-दोन मणी नारिंगी-लाल होतात व बाकी अजून हिरवे व टणक असतात (कोकणात डिसेंबर–फेब्रुवारी)."),
  postHarvest: b(
    "Separate berries from spikes, dip in hot water for about a minute (optional, gives a better black colour), and sun-dry on a clean mat or tarpaulin for 7–10 days until black and crisp. Never dry on bare ground. Winnow, remove light and broken berries, and store in clean, dry bags.",
    "घोसांपासून मणी वेगळे करा, साधारण एक मिनिट गरम पाण्यात बुडवा (ऐच्छिक; काळा रंग चांगला येतो), आणि स्वच्छ चटईवर किंवा ताडपत्रीवर 7–10 दिवस काळे व कुरकुरीत होईपर्यंत उन्हात वाळवा. उघड्या जमिनीवर कधीही वाळवू नका. उफणणी करून हलके व तुटके मणी काढा आणि स्वच्छ, कोरड्या पिशव्यांत साठवा.",
  ),
  marketTips: b(
    "Bold, heavy, well-dried, clean black pepper gets a better price. Dry pepper stores well, so you can sell in parts when rates are good. Pepper on arecanut or coconut gives extra income from the same land.",
    "टपोऱ्या, जड, चांगल्या वाळलेल्या व स्वच्छ काळ्या मिरीला जास्त दर मिळतो. वाळलेली मिरी चांगली टिकते, त्यामुळे दर चांगला असताना टप्प्याटप्प्याने विकता येते. सुपारी किंवा नारळावर मिरी घेतल्यास त्याच जमिनीतून जास्तीचे उत्पन्न मिळते.",
  ),
  source: "General practices from Dr. BSKKV Dapoli and ICAR-IISR black pepper guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
