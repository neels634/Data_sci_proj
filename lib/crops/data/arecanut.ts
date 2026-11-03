import type { PerennialCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

/** Arecanut: shade-loving palm of Konkan valleys; ripe nuts picked October–February. */
const crop: PerennialCrop = {
  id: "arecanut",
  emoji: "🌴",
  name: b("Arecanut", "सुपारी"),
  aliases: ["arecanut", "areca", "areca nut", "areca palm", "betel nut", "supari", "supaari", "सुपारी", "pophali", "पोफळी", "पोफळ"],
  category: "plantation",
  lifecycle: "perennial",
  regions: ["konkan"],
  majorDistricts: b("Raigad (Shrivardhan), Ratnagiri, Sindhudurg", "रायगड (श्रीवर्धन), रत्नागिरी, सिंधुदुर्ग"),
  tier: 2,
  plantingWindow: b("May–June with the first rains; later in the monsoon in low-lying fields that flood", "मे–जून पहिल्या पावसासोबत; पाणी साचणाऱ्या सखल भागात पावसाळ्याच्या उत्तरार्धात"),
  plantingMonths: [5, 6, 8, 9],
  plantingMaterial: b("12–18 month old seedlings with 5 or more leaves, raised from selected mother palms", "निवडलेल्या मातृ माडांपासून तयार केलेली, 5 किंवा अधिक पाने असलेली 12–18 महिन्यांची रोपे"),
  spacing: b("2.7 m × 2.7 m (about 9 feet apart)", "2.7 मीटर × 2.7 मीटर (साधारण 9 फूट अंतर)"),
  plantsPerAcre: [500, 550],
  yearsToFirstHarvest: [5, 7],
  economicLifeYears: [40, 60],
  soil: b(
    "Deep, well-drained laterite or alluvial soils in valleys with assured water. It cannot stand waterlogging or long drought.",
    "खात्रीचे पाणी असलेल्या खोऱ्यांतील खोल, निचरा होणारी जांभी किंवा गाळाची जमीन. पाणी साचणे किंवा दीर्घ कोरडा काळ सहन होत नाही.",
  ),
  climate: b(
    "Warm, humid climate of Konkan. Young palms need shade from the hot afternoon sun; bananas are often planted for shade.",
    "कोकणातील उष्ण, दमट हवामान. लहान रोपांना दुपारच्या कडक उन्हापासून सावली लागते; सावलीसाठी अनेकदा केळी लावली जातात.",
  ),
  irrigation: b(
    "Needs regular water from November to May — every 4–7 days by channel, sprinkler or drip. Water stress in summer causes heavy nut drop and poor crop next year.",
    "नोव्हेंबर ते मे नियमित पाणी लागते — पाटाने, तुषारने किंवा ठिबकने दर 4–7 दिवसांनी. उन्हाळ्यात पाण्याचा ताण पडल्यास सुपारी मोठ्या प्रमाणात गळते व पुढचे उत्पादन घटते.",
  ),
  nutrientGuide: b(
    "Give well-rotted farmyard manure or compost and green leaves every year at the start of the monsoon. Split fertiliser into two parts, in June and September. Base it on a soil test; ask your agriculture officer for amounts.",
    "दरवर्षी पावसाळ्याच्या सुरुवातीला चांगले कुजलेले शेणखत किंवा कंपोस्ट व हिरवा पाला द्या. खते जून व सप्टेंबर अशा दोन हप्त्यांत द्या. माती परीक्षणावर आधारित खत द्या; प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Shrivardhani", note: b("Famous local type of Shrivardhan, Raigad; bold, high-quality nuts", "रायगडमधील श्रीवर्धनची प्रसिद्ध स्थानिक जात; मोठी, दर्जेदार सुपारी") },
    { name: "Mangala", note: b("Semi-tall variety from ICAR-CPCRI, Kasaragod", "ICAR-केंद्रीय रोपवनस्पती पीक संशोधन संस्था, कासारगोडचा मध्यम उंचीचा वाण") },
  ],
  establishment: [
    stage("planting", ["Planting", "लागवड"], 0, 90, ["Seedlings are planted in pits and take root in the monsoon.", "रोपे खड्ड्यांत लावली जातात व पावसाळ्यात मूळ धरतात."], [
      t("ar-pit", 0, "other", ["Plant seedlings in pits", "खड्ड्यांत रोपे लावा"], ["Use pits about 90 cm deep filled with topsoil and manure. Plant with the ball of earth and press soil firmly.", "साधारण 90 सेंमी खोल खड्डे वरची माती व शेणखताने भरा. रोप मातीच्या गोळ्यासह लावून माती घट्ट दाबा."]),
      t("ar-shade", 3, "other", ["Give shade", "सावली करा"], ["Shade young seedlings from the west sun; plant banana between rows for shade.", "लहान रोपांना पश्चिमेकडील उन्हापासून सावली करा; सावलीसाठी ओळींमध्ये केळी लावा."]),
      t("ar-drain", 20, "observation", ["Check drainage", "निचरा तपासा"], ["Clear drains so rainwater does not stand in the garden.", "बागेत पावसाचे पाणी साचू नये म्हणून चर मोकळे करा."], 20),
    ], [["Seedling rot from waterlogging", "पाणी साचल्याने रोप कुजणे"]]),
    stage("young-palm", ["Young palm care", "लहान माडांची निगा"], 90, 1460, ["Palms build their stem. They need shade, water and manure every year.", "माडांचे खोड तयार होते. दरवर्षी सावली, पाणी व खत लागते."], [
      t("ar-irr1", 150, "irrigation", ["Water in the dry months", "कोरड्या महिन्यांत पाणी द्या"], ["Water every 4–5 days from November to May.", "नोव्हेंबर ते मे दर 4–5 दिवसांनी पाणी द्या."], 5),
      t("ar-fym1", 365, "fertiliser", ["Yearly manure", "वार्षिक शेणखत"], ["Give manure and green leaves in the basin every June.", "दर जूनमध्ये आळ्यात शेणखत व हिरवा पाला द्या."], 365),
      t("ar-mulch1", 160, "other", ["Mulch the basins", "आळ्यांत आच्छादन करा"], ["Cover basins with dry leaves to keep moisture and cool the soil.", "ओल टिकवण्यासाठी व माती थंड राहण्यासाठी आळ्यात वाळलेली पाने पसरा."], 365),
      t("ar-obs1", 120, "observation", ["Check leaves and stem", "पाने व खोड तपासा"], ["Look for yellowing leaves, rotting at the bud and stem cracks from sun scorch.", "पाने पिवळी पडणे, शेंडा कुजणे व उन्हाने खोडाला तडे जाणे पाहा."], 30),
    ], [["Sun scorch on the stem", "उन्हामुळे खोड करपणे"], ["Bud rot", "शेंडा कूज"]]),
    stage("pre-bearing", ["Before first bunches", "पहिले घड येण्यापूर्वी"], 1460, 2190, ["Palms reach bearing size and start flowering.", "माड उत्पादनक्षम आकाराचे होऊन फुलोरा येऊ लागतो."], [
      t("ar-irr2", 1460, "irrigation", ["Summer irrigation", "उन्हाळी पाणी"], ["Water every 5–7 days in the dry months.", "कोरड्या महिन्यांत दर 5–7 दिवसांनी पाणी द्या."], 7),
      t("ar-obs2", 1470, "observation", ["Check new flower bunches", "नवा फुलोरा तपासा"], ["Look for drying of young bunches and small nuts falling.", "कोवळे घड सुकणे व लहान सुपाऱ्या गळणे पाहा."], 30),
    ], [["Young nut drop", "कोवळी सुपारी गळणे"]]),
  ],
  cycles: [
    {
      key: "yearly",
      name: b("Yearly crop", "वार्षिक हंगाम"),
      startMonths: [6],
      startEvent: b("Monsoon manuring and drain cleaning in June", "जूनमध्ये पावसाळी खत व चर साफ करणे"),
      harvestMonths: [10, 11, 12, 1, 2],
      note: b("Bunches flower mostly in the dry season and ripen in about 9–10 months; ripe nuts are picked in 3–4 rounds from October to February.", "घड मुख्यतः कोरड्या हंगामात फुलतात व साधारण 9–10 महिन्यांत पिकतात; पिकलेली सुपारी ऑक्टोबर ते फेब्रुवारी 3–4 फेऱ्यांत काढली जाते."),
      stages: [
        stage("monsoon", ["Monsoon care", "पावसाळी निगा"], 0, 120, ["Nuts grow on the palm. Fruit rot is the main danger in continuous rain.", "माडावर सुपारी वाढते. सततच्या पावसात फळकूज हा मुख्य धोका असतो."], [
          t("ar-fym", 0, "fertiliser", ["Manure and first fertiliser part", "शेणखत व पहिला खत हप्ता"], ["Give manure and green leaves in basins and the first fertiliser part as per soil test.", "आळ्यात शेणखत व हिरवा पाला आणि माती परीक्षणानुसार पहिला खत हप्ता द्या."]),
          t("ar-drain2", 5, "other", ["Clean drains", "चर साफ करा"], ["Keep drains open so water does not stand in the garden.", "बागेत पाणी साचू नये म्हणून चर मोकळे ठेवा."]),
          t("ar-obs3", 30, "observation", ["Check bunches for fruit rot", "घडांवर फळकूज तपासा"], ["Look for water-soaked patches on nuts and nuts falling in heaps under palms.", "सुपारीवर पाणथळ डाग व माडाखाली ढिगाने गळलेली सुपारी पाहा."], 10),
        ], [["Fruit rot (koleroga, mahali)", "फळकूज (कोळे रोग, महाळी)"], ["Bud rot", "शेंडा कूज"]]),
        stage("harvest", ["Harvest", "काढणी"], 120, 245, ["Ripe nuts turn orange-yellow and are picked in rounds.", "पिकलेली सुपारी नारिंगी-पिवळी होते व फेऱ्यांनी काढली जाते."], [
          t("ar-fert2", 120, "fertiliser", ["Second fertiliser part", "दुसरा खत हप्ता"], ["Give the second part while soil is moist; ask your agriculture officer for the amount.", "जमिनीत ओल असतानाच दुसरा हप्ता द्या; प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
          t("ar-pick", 125, "harvest", ["Pick ripe bunches", "पिकलेले घड काढा"], ["Pick bunches with orange-yellow nuts; collect fallen nuts too.", "नारिंगी-पिवळी सुपारी असलेले घड काढा; गळलेली सुपारीही गोळा करा."], 30),
          t("ar-dry", 127, "other", ["Dry the nuts", "सुपारी वाळवा"], ["Spread ripe nuts in the sun and turn them daily until the kernel rattles inside.", "पिकलेली सुपारी उन्हात पसरा व आतली बी खुळखुळेपर्यंत रोज उलटा."], 15),
          t("ar-irr", 150, "irrigation", ["Start irrigation", "पाणी सुरू करा"], ["Once the rains stop, water every 4–7 days.", "पाऊस थांबल्यावर दर 4–7 दिवसांनी पाणी द्या."], 6),
        ], [["Nuts getting mouldy if dried slowly", "हळू वाळवल्यास सुपारीला बुरशी"]]),
        stage("summer", ["Summer care", "उन्हाळी निगा"], 245, 365, ["New bunches flower and set nuts; water decides how many stay.", "नवे घड फुलतात व सुपारी धरते; किती टिकतील ते पाण्यावर ठरते."], [
          t("ar-irr3", 245, "irrigation", ["Irrigate regularly", "नियमित पाणी द्या"], ["Water every 4–5 days; do not let the basins dry out in April–May.", "दर 4–5 दिवसांनी पाणी द्या; एप्रिल–मे मध्ये आळी कोरडी पडू देऊ नका."], 5),
          t("ar-mulch", 246, "other", ["Mulch basins", "आळ्यांत आच्छादन करा"], ["Spread dry leaves or areca husk to save moisture.", "ओल टिकवण्यासाठी वाळलेली पाने किंवा सुपारीची साल पसरा."]),
          t("ar-obs4", 260, "observation", ["Check flower bunches", "फुलोरा तपासा"], ["Look for drying bunches and heavy young-nut drop; check that water reaches all palms.", "सुकणारे घड व कोवळी सुपारी जास्त गळणे पाहा; सर्व माडांना पाणी पोहोचते ना ते तपासा."], 20),
        ], [["Young nut drop from water stress", "पाण्याच्या ताणाने कोवळी सुपारी गळणे"], ["Mites on leaves in hot dry weather", "उष्ण कोरड्या हवेत पानांवर कोळी"]]),
      ],
    },
  ],
  commonProblems: [
    {
      name: b("Fruit rot (koleroga, mahali)", "फळकूज (कोळे रोग, महाळी)"),
      signs: b("In heavy monsoon rain, nuts get water-soaked patches, rot and fall in large numbers; white fungal growth may show.", "जोरदार पावसात सुपारीवर पाणथळ डाग पडतात, ती कुजते व मोठ्या प्रमाणात गळते; पांढरी बुरशी दिसू शकते."),
      prevention: prevent("Collect and destroy fallen rotten nuts, keep drains open, and plan protection before the heavy rains start.", "गळलेली कुजकी सुपारी गोळा करून नष्ट करा, चर मोकळे ठेवा आणि जोरदार पाऊस सुरू होण्यापूर्वीच संरक्षणाचे नियोजन करा."),
    },
    {
      name: b("Bud rot", "शेंडा कूज"),
      signs: b("The central leaf turns yellow, then rots with a bad smell; the palm may die.", "मधले पान पिवळे पडते, मग दुर्गंधीसह कुजते; माड मरू शकतो."),
      prevention: prevent("Remove and burn rotten crowns, clean crowns before the monsoon, and avoid waterlogging.", "कुजलेले शेंडे काढून जाळा, पावसाळ्यापूर्वी शेंडे स्वच्छ करा आणि पाणी साचू देऊ नका."),
    },
    {
      name: b("Nut drop from water stress", "पाण्याच्या ताणाने सुपारी गळणे"),
      signs: b("Young nuts drop heavily in April–May and leaves droop when irrigation is short.", "पाणी कमी पडल्यास एप्रिल–मे मध्ये कोवळी सुपारी मोठ्या प्रमाणात गळते व पाने मलूल होतात."),
      prevention: b("Give regular summer water, mulch basins and keep shade trees or banana to cool the garden.", "उन्हाळ्यात नियमित पाणी द्या, आळ्यात आच्छादन करा आणि बाग थंड राहण्यासाठी सावलीची झाडे किंवा केळी ठेवा."),
    },
  ],
  harvestSigns: b(
    "Nuts turn orange-yellow and the bunch starts dropping ripe nuts, about 9–10 months after flowering. Tender green nuts are picked earlier only for the tender-nut trade.",
    "फुलोऱ्यानंतर साधारण 9–10 महिन्यांनी सुपारी नारिंगी-पिवळी होते व घडातून पिकलेली सुपारी गळू लागते. कच्ची हिरवी सुपारी फक्त त्या बाजारासाठीच आधी काढतात.",
  ),
  postHarvest: b(
    "Dry ripe nuts whole in the sun for 5–8 weeks, turning them often, until the kernel rattles. Dehusk, grade by size and soundness, and store in dry bags away from damp floors.",
    "पिकलेली सुपारी 5–8 आठवडे उन्हात, वारंवार उलटत, आतली बी खुळखुळेपर्यंत वाळवा. साल काढा, आकार व दर्जानुसार प्रतवारी करा आणि ओलसर जमिनीपासून दूर कोरड्या पोत्यांत साठवा.",
  ),
  marketTips: b(
    "Well-dried, clean, bold nuts get the best rate. Shrivardhani supari has a name in the market — sell it graded. Group selling to traders or cooperatives gives better bargaining power.",
    "चांगली वाळलेली, स्वच्छ व मोठी सुपारीला सर्वाधिक दर मिळतो. श्रीवर्धनी सुपारीला बाजारात नाव आहे — प्रतवारी करून विका. व्यापारी किंवा सहकारी संस्थांना गटाने विकल्यास दराची घासाघीस करणे सोपे जाते.",
  ),
  source: "General practices from Dr. BSKKV Dapoli arecanut guidance and ICAR-Central Plantation Crops Research Institute",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
