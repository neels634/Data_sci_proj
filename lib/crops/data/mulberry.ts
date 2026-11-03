import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Mulberry grown for silkworm leaf: establishment, then repeated leaf crops after each pruning or shoot harvest. */
const crop: PerennialCrop = {
  id: "mulberry",
  emoji: "🌿",
  name: b("Mulberry (for silkworms)", "तुती"),
  aliases: ["mulberry", "tuti", "tooti", "toot", "shahtoot", "mulberry leaf", "तुती", "तूती", "शहतूत"],
  category: "cash",
  lifecycle: "perennial",
  regions: ["marathwada", "western"],
  majorDistricts: b("Beed, Jalna", "बीड, जालना"),
  tier: 2,
  plantingWindow: b("June–August (monsoon); with assured irrigation it can be planted at other times except peak summer", "जून–ऑगस्ट (पावसाळा); खात्रीचे पाणी असल्यास कडक उन्हाळा सोडून इतर वेळीही लागवड करता येते"),
  plantingMonths: [6, 7, 8],
  plantingMaterial: b(
    "Cuttings 15–20 cm long with 3–4 buds from healthy 6–8 month old shoots, or 3–4 month old saplings raised in a nursery",
    "निरोगी 6–8 महिन्यांच्या फांद्यांपासून 3–4 डोळ्यांच्या 15–20 सेंमी लांब कांड्या, किंवा रोपवाटिकेत तयार केलेली 3–4 महिन्यांची रोपे",
  ),
  spacing: b("Paired rows (90 cm within the pair, 150 cm between pairs) with 60 cm between plants, or 90 cm × 90 cm", "जोड ओळ पद्धत (जोडीत 90 सेंमी, दोन जोड्यांत 150 सेंमी) व रोपांत 60 सेंमी, किंवा 90 × 90 सेंमी"),
  plantsPerAcre: [4900, 5600],
  yearsToFirstHarvest: [1, 1],
  economicLifeYears: [10, 15],
  soil: b("Deep, well-drained loamy or medium black soil. Avoid saline soil and fields where water stands.", "खोल, पाण्याचा निचरा होणारी पोयट्याची किंवा मध्यम काळी जमीन. क्षारपड व पाणी साचणारी जमीन टाळा."),
  climate: b("Warm climate with irrigation. Leaves grow slowly in cold winter and in very hot, dry summer.", "पाण्याची सोय असलेले उबदार हवामान. कडक थंडीत व अतिशय उष्ण, कोरड्या उन्हाळ्यात पाने हळू वाढतात."),
  irrigation: b(
    "Needs regular water for tender leaves. Drip irrigation is best; with furrows, water every 7–10 days depending on soil and season. Water stress gives hard, poor leaves that silkworms do not eat well.",
    "कोवळ्या पानांसाठी नियमित पाणी लागते. ठिबक सिंचन उत्तम; पाटपाण्याने जमीन व हंगामानुसार 7–10 दिवसांनी पाणी द्या. पाण्याचा ताण पडल्यास पाने कडक व निकृष्ट होतात आणि अळ्या नीट खात नाहीत.",
  ),
  nutrientGuide: b(
    "Leaf is harvested again and again, so feed the garden after every pruning: well-rotted farmyard manure or compost, and fertiliser in parts as per soil test. Ask the sericulture office or your agriculture officer for amounts.",
    "पाला पुन्हा पुन्हा काढला जातो, म्हणून प्रत्येक छाटणीनंतर बागेला खत द्या: कुजलेले शेणखत किंवा कंपोस्ट, आणि माती परीक्षणानुसार खत हप्त्यांत. प्रमाण रेशीम कार्यालय किंवा कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "V-1 (Victory 1)", note: b("High-leaf-yield irrigated variety from CSRTI Mysuru (Central Silk Board)", "केंद्रीय रेशीम मंडळाच्या CSRTI म्हैसूरचा, बागायतीसाठी जास्त पाला देणारा वाण") },
    { name: "S-36", note: b("Irrigated variety from CSRTI Mysuru, soft leaves good for young worms", "CSRTI म्हैसूरचा बागायती वाण; कोवळ्या अळ्यांसाठी मऊ पाने") },
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 30, ["Cuttings or saplings are planted and take root.", "कांड्या किंवा रोपे लावली जातात व मूळ धरतात."], [
      t("mb-plant", 0, "transplanting", ["Plant cuttings or saplings", "कांड्या किंवा रोपे लावा"], ["Mix well-rotted manure in the field, then plant at the chosen spacing with 1–2 buds above the soil.", "शेतात कुजलेले शेणखत मिसळा, मग ठरवलेल्या अंतरावर 1–2 डोळे जमिनीवर राहतील अशी लागवड करा."]),
      t("mb-irr0", 1, "irrigation", ["Water the new plants", "नवीन रोपांना पाणी द्या"], ["Keep the soil moist until new leaves come.", "नवीन पाने येईपर्यंत जमीन ओलसर ठेवा."], 5),
    ], [["Cuttings drying in hot, dry spells", "कोरड्या, उष्ण हवेत कांड्या सुकणे"], ["Termites", "वाळवी"]]),
    stage("growth", ["Establishment growth", "रोपांची वाढ"], 30, 150, ["Plants grow roots and shoots and form a bush.", "रोपांना मुळे व फांद्या येऊन झुडूप तयार होते."], [
      t("mb-gap", 35, "other", ["Fill gaps", "नांग्या भरा"], ["Replant where cuttings failed so the garden is even.", "जेथे कांड्या मेल्या तेथे पुन्हा लावा, म्हणजे बाग एकसारखी होते."]),
      t("mb-weed", 40, "weeding", ["Weeding and hoeing", "खुरपणी व कोळपणी"], ["Keep rows weed-free; loosen the soil lightly.", "ओळी तणमुक्त ठेवा; माती हलकी मोकळी करा."], 30),
      t("mb-fert0", 60, "fertiliser", ["First feeding", "पहिले खत"], ["Give manure and a fertiliser part as per soil test.", "माती परीक्षणानुसार शेणखत व खताचा हप्ता द्या."]),
      t("mb-irr1", 31, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water every 7–10 days; more often in summer.", "दर 7–10 दिवसांनी नियमित पाणी; उन्हाळ्यात लवकर."], 8),
    ], [["Leaf roller", "पाने गुंडाळणारी अळी"]]),
    stage("first-crop", ["Shaping & first leaf crop", "छाटणी व पहिला पाला"], 150, 210, ["The bush is cut to shape and the first leaf crop is taken for rearing.", "झुडपाला छाटणी करून आकार दिला जातो व पहिला पाला संगोपनासाठी घेतला जातो."], [
      t("mb-shape", 150, "other", ["Shape the bush", "झुडपाला आकार द्या"], ["Cut the plants at about 30–45 cm above ground so many shoots come from a low frame.", "जमिनीपासून साधारण 30–45 सेंमीवर छाटा, म्हणजे खुंटावरून अनेक फांद्या फुटतात."]),
      t("mb-irr2", 151, "irrigation", ["Irrigate", "पाणी द्या"], ["Keep regular water for new shoots.", "नवीन फुटीसाठी नियमित पाणी ठेवा."], 8),
      t("mb-shed", 160, "observation", ["Get the rearing house ready", "संगोपनगृह तयार करा"], ["Clean and disinfect the rearing house and trays as advised by the sericulture office before the first rearing.", "पहिल्या संगोपनापूर्वी रेशीम कार्यालयाच्या सल्ल्याने संगोपनगृह व ट्रे स्वच्छ व निर्जंतुक करा."]),
    ], [["Tukra (mealybug) on shoot tips", "शेंड्यांवर टुकरा (पिठ्या ढेकूण)"]]),
  ],
  cycles: [
    {
      key: "leaf-crop",
      name: b("Leaf crop after pruning", "छाटणीनंतरचा पाला"),
      startMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      startEvent: b("Pruning or shoot harvest, followed by manure and irrigation", "छाटणी किंवा फांद्यांची काढणी, त्यानंतर खत व पाणी"),
      harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      note: b(
        "Repeat about 5 times a year. Plan each pruning so leaves are ready when your silkworm batch needs them; do a low (bottom) pruning once a year, usually at the start of the monsoon. Never spray anything near harvest — silkworms are very sensitive.",
        "वर्षात साधारण 5 वेळा घ्या. अळ्यांच्या बॅचला पाला लागेल त्या वेळेनुसार छाटणीचे नियोजन करा; वर्षातून एकदा, सहसा पावसाळ्याच्या सुरुवातीला, खालची (जमिनीलगत) छाटणी करा. काढणीजवळ कोणतीही फवारणी करू नका — रेशीम अळ्या खूप संवेदनशील असतात.",
      ),
      stages: [
        stage("sprouting", ["Pruning & sprouting", "छाटणी व फूट"], 0, 15, ["New shoots sprout from the pruned stumps.", "छाटलेल्या खुंटांवरून नवीन फूट येते."], [
          t("lc-prune", 0, "other", ["Prune or harvest shoots", "छाटणी किंवा फांद्यांची काढणी"], ["Cut shoots cleanly with a sharp sickle or pruner; remove dead and weak branches.", "धारदार विळा किंवा कात्रीने फांद्या स्वच्छ कापा; वाळलेल्या व कमजोर फांद्या काढा."]),
          t("lc-fert", 2, "fertiliser", ["Manure and fertiliser", "शेणखत व खत"], ["Give manure and the fertiliser part for this crop as per soil test.", "माती परीक्षणानुसार या पिकासाठी शेणखत व खताचा हप्ता द्या."]),
          t("lc-irr0", 3, "irrigation", ["Irrigate", "पाणी द्या"], ["Water soon after feeding to start new growth.", "खत दिल्यानंतर लगेच पाणी द्या, म्हणजे नवीन वाढ सुरू होते."], 7),
        ], [["Stumps drying in hot weather", "उष्ण हवेत खुंट सुकणे"]]),
        stage("shoot-growth", ["Shoot & leaf growth", "फांद्या व पानांची वाढ"], 15, 45, ["Shoots grow fast and leaves increase.", "फांद्या झपाट्याने वाढतात व पाने वाढतात."], [
          t("lc-weed", 15, "weeding", ["Weeding and hoeing", "खुरपणी व कोळपणी"], ["Weed and loosen the soil once in each crop.", "प्रत्येक पिकात एकदा खुरपणी करून माती मोकळी करा."]),
          t("lc-obs1", 16, "observation", ["Check shoots and leaves", "फांद्या व पाने तपासा"], ["Look for bunched, twisted tips (tukra), rolled leaves and leaf spots; cut and destroy affected tips.", "गुच्छ झालेले, वाकडे शेंडे (टुकरा), गुंडाळलेली पाने व पानांवरील ठिपके पाहा; बाधित शेंडे खुडून नष्ट करा."], 7),
          t("lc-irr1", 17, "irrigation", ["Irrigate", "पाणी द्या"], ["Regular water every 7–10 days.", "दर 7–10 दिवसांनी नियमित पाणी."], 8),
          t("lc-tender", 25, "harvest", ["Pick tender leaves for young worms", "कोवळ्या अळ्यांसाठी कोवळी पाने खुडा"], ["If a batch of young (chawki) worms is running, pick soft top leaves.", "कोवळ्या (चॉकी) अळ्यांची बॅच चालू असल्यास वरची मऊ पाने खुडा."]),
        ], [["Tukra (mealybug)", "टुकरा (पिठ्या ढेकूण)"], ["Leaf roller", "पाने गुंडाळणारी अळी"]]),
        stage("leaf-harvest", ["Leaf harvest for rearing", "संगोपनासाठी पाला काढणी"], 45, 75, ["Leaves are mature; shoots are cut and fed to grown silkworms.", "पाने पक्व होतात; फांद्या कापून मोठ्या अळ्यांना खाऊ घातल्या जातात."], [
          t("lc-harv", 50, "harvest", ["Harvest shoots", "फांद्या कापा"], ["Cut shoots in the cool morning or evening, carry them in shade and store in a cool, moist place until feeding.", "थंड वेळेत सकाळी किंवा संध्याकाळी फांद्या कापा, सावलीतून न्या आणि खाऊ घालेपर्यंत थंड, ओलसर जागी ठेवा."], 3),
          t("lc-nospray", 45, "observation", ["Keep leaves free of sprays", "पाला फवारणीमुक्त ठेवा"], ["Do not spray the garden now and make sure spray from neighbouring fields does not drift onto it.", "आता बागेवर फवारणी करू नका आणि शेजारच्या शेतातील फवारणी बागेवर उडणार नाही याची काळजी घ्या."]),
        ], [["Powdery mildew and leaf spot in humid weather", "दमट हवेत भुरी व पानांवरील ठिपके"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Tukra (mealybug)", "टुकरा (पिठ्या ढेकूण)"),
      signs: b("Shoot tips become bunched, curled and dark green; white mealy insects at the tip.", "शेंडे गुच्छासारखे, आकसलेले व गडद हिरवे होतात; शेंड्यावर पांढरे पिठासारखे किडे."),
      prevention: prevent("Cut and burn affected tips early, keep the garden clean, and use only methods safe for silkworms with a long gap before leaf harvest.", "बाधित शेंडे लवकर खुडून जाळा, बाग स्वच्छ ठेवा आणि रेशीम अळ्यांना सुरक्षित, पाला काढणीपूर्वी पुरेसे अंतर असलेल्या उपायांचाच वापर करा."),
    },
    {
      name: b("Leaf roller", "पाने गुंडाळणारी अळी"),
      signs: b("Top leaves rolled and webbed together with a caterpillar inside.", "शेंड्याची पाने गुंडाळलेली व जाळ्याने बांधलेली; आत अळी."),
      prevention: prevent("Pick and destroy rolled leaves, and prune on time.", "गुंडाळलेली पाने खुडून नष्ट करा व वेळेवर छाटणी करा."),
    },
    {
      name: b("Powdery mildew and leaf spot", "भुरी व पानांवरील ठिपके"),
      signs: b("White powder under leaves or brown spots; leaves yellow and fall.", "पानांखाली पांढरी भुकटी किंवा तपकिरी ठिपके; पाने पिवळी पडून गळतात."),
      prevention: prevent("Good spacing for air, harvest leaves on time and remove fallen leaves.", "हवा खेळती राहील असे अंतर, वेळेवर पाला काढणी व गळलेली पाने काढणे."),
    },
    {
      name: b("Root rot", "मूळकूज"),
      signs: b("Plants wilt and dry suddenly; roots are rotten.", "झाडे अचानक मलूल होऊन वाळतात; मुळे कुजलेली."),
      prevention: prevent("Avoid waterlogging, add organic manure and remove dead plants with roots.", "पाणी साचू देऊ नका, सेंद्रिय खत द्या व मेलेली झाडे मुळांसकट काढा."),
    },
  ],
  harvestSigns: b(
    "Leaves are dark green, glossy and fully grown, about 45–70 days after pruning, depending on the age of the worms they will feed.",
    "छाटणीनंतर साधारण 45–70 दिवसांत पाने गडद हिरवी, चमकदार व पूर्ण वाढलेली होतात; कोणत्या वयाच्या अळ्यांना द्यायची त्यानुसार.",
  ),
  postHarvest: b(
    "Harvest in cool hours, carry leaves in shade and keep them under a wet cloth in a cool room so they stay fresh. Do not feed wet, dusty or wilted leaves.",
    "थंड वेळेत पाला काढा, सावलीतून न्या आणि ताजा राहण्यासाठी थंड खोलीत ओल्या कापडाखाली ठेवा. ओला, धुळीचा किंवा कोमेजलेला पाला खाऊ घालू नका.",
  ),
  marketTips: b(
    "Income comes from selling cocoons, not leaves. Register with the district sericulture office for training, disease-free eggs or chawki worms and support schemes, and sell cocoons at a government cocoon market for a fair price.",
    "उत्पन्न पाल्यातून नव्हे तर कोष विक्रीतून मिळते. प्रशिक्षण, रोगमुक्त अंडीपुंज किंवा चॉकी अळ्या व योजनांसाठी जिल्हा रेशीम कार्यालयात नोंदणी करा, आणि योग्य दरासाठी शासकीय कोष बाजारात कोष विका.",
  ),
  source: "General practices from Central Sericultural Research and Training Institute (Central Silk Board), Mysuru and Maharashtra Directorate of Sericulture mulberry guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
