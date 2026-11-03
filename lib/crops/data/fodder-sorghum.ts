import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "fodder-sorghum",
  emoji: "🌾",
  name: b("Fodder sorghum", "चारा ज्वारी (कडवळ)"),
  aliases: ["fodder sorghum", "sorghum fodder", "chara jowar", "chara jwari", "kadval", "kadwal", "chari", "multicut sorghum", "चारा ज्वारी", "कडवळ", "चरी"],
  category: "fodder",
  lifecycle: "seasonal",
  regions: ["western", "north", "marathwada", "vidarbha"],
  tier: 2,
  seasons: [
    { season: "kharif", sowingWindow: b("June–July, after good rain", "जून–जुलै, चांगला पाऊस झाल्यावर"), sowingMonths: [6, 7], durationDays: [70, 80] },
    { season: "summer", sowingWindow: b("February–March, with irrigation", "फेब्रुवारी–मार्च, पाण्याची सोय असल्यास"), sowingMonths: [2, 3], durationDays: [60, 75] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b(
    "Most soils with fair drainage; medium black soil is best. Tolerates dry spells better than maize.",
    "बऱ्यापैकी निचरा होणारी बहुतेक जमीन; मध्यम काळी जमीन उत्तम. मक्यापेक्षा पावसाचा खंड जास्त सहन करते.",
  ),
  climate: b(
    "Warm weather. Multi-cut types regrow well in summer with irrigation.",
    "उबदार हवामान. अनेक कापण्यांचे वाण उन्हाळ्यात पाण्यावर चांगले पुन्हा फुटतात.",
  ),
  seedRate: b("16–20 kg seed per acre (sown thick for fine stems).", "एकरी 16–20 किलो बियाणे (बारीक खोडासाठी दाट पेरणी)."),
  spacing: b("25–30 cm between rows; seed drilled in a continuous line.", "दोन ओळींत 25–30 सेंमी; ओळीत सलग बी पेरा."),
  irrigation: b(
    "Kharif crop on rain. Summer crop every 8–10 days, and right after each cut. Never cut a drought-stressed crop for feeding without watering it first.",
    "खरीप पीक पावसावर. उन्हाळी पिकाला दर 8–10 दिवसांनी व प्रत्येक कापणीनंतर लगेच पाणी. पाण्याचा ताण पडलेले पीक आधी पाणी दिल्याशिवाय खाऊ घालण्यासाठी कापू नका.",
  ),
  nutrientGuide: b(
    "Use a soil test. Mix farmyard manure before sowing. Give nitrogen at sowing and, for multi-cut types, a small part after each cut. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. पेरणीपूर्वी शेणखत मिसळा. पेरणीवेळी नत्र द्या आणि अनेक कापण्यांच्या वाणाला प्रत्येक कापणीनंतर थोडा हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 10, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("fs-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Drill seed thickly in 25–30 cm rows, 3–4 cm deep.", "25–30 सेंमी ओळीत 3–4 सेंमी खोल दाट पेरा."]),
      t("fs-count", 7, "observation", ["Check germination", "उगवण तपासा"], ["Look for gaps and dead centre shoots (shoot fly).", "खाडे व मधला कोंब वाळलेली रोपे (खोडमाशी) पाहा."]),
    ], [["Shoot fly", "खोडमाशी"]]),
    stage("vegetative", ["Leaf growth", "पानांची वाढ"], 10, 45, ["Plants grow tall and leafy. Young sorghum is NOT safe to feed yet.", "झाडे उंच व पालेदार होतात. कोवळी ज्वारी अजून खाऊ घालण्यास सुरक्षित नाही."], [
      t("fs-weed", 15, "weeding", ["Weeding", "खुरपणी"], ["One weeding or hoeing at 2–3 weeks.", "2–3 आठवड्यांनी एक खुरपणी किंवा कोळपणी."]),
      t("fs-obs1", 12, "observation", ["Check young plants", "कोवळी रोपे तपासा"], ["Look for dead centre shoots and stem borer holes.", "वाळलेला मधला कोंब व खोडकिड्याची छिद्रे पाहा."], 7),
      t("fs-irr1", 18, "irrigation", ["Irrigate summer crop", "उन्हाळी पिकाला पाणी"], ["Summer crop: every 8–10 days. Kharif: only in a dry spell.", "उन्हाळी पीक: दर 8–10 दिवसांनी. खरीप: फक्त पावसाच्या खंडात."], 9),
      t("fs-fert", 30, "fertiliser", ["Nitrogen top dressing", "नत्राचा वरखत"], ["Give the second nitrogen part as per soil test. Ask your agriculture officer for the amount.", "माती परीक्षणानुसार नत्राचा दुसरा हप्ता द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा."]),
    ], [["Young plants are poisonous to cattle (prussic acid)", "कोवळी ज्वारी जनावरांना विषारी (हायड्रोसायनिक आम्ल)"], ["Stem borer", "खोडकिडा"]]),
    stage("boot", ["Booting", "पोटरी"], 45, 60, ["The head forms inside the top leaf. Multi-cut types can take the first cut now (55–60 days).", "वरच्या पानात कणीस तयार होते. अनेक कापण्यांच्या वाणाची पहिली कापणी आता (55–60 दिवस) करता येते."], [
      t("fs-cut1", 55, "harvest", ["First cut (multi-cut types)", "पहिली कापणी (अनेक कापण्यांचे वाण)"], ["Cut 10–15 cm above the ground so new shoots can come.", "नवे फुटवे यावेत म्हणून जमिनीपासून 10–15 सेंमी वर कापा."]),
      t("fs-obs2", 46, "observation", ["Check leaves", "पाने तपासा"], ["Look for red leaf spots and sucking pests.", "पानांवर लाल ठिपके व रसशोषक किडी पाहा."], 7),
    ], [["Leaf spots", "पानांवरील ठिपके"]]),
    stage("harvest", ["50% flowering & harvest", "50% फुलोरा व कापणी"], 60, 80, ["Best and safest fodder at 50% flowering.", "50% फुलोऱ्यात सर्वोत्तम व सुरक्षित चारा."], [
      t("fs-cut", 62, "harvest", ["Cut fodder", "चारा कापा"], ["Single-cut types: cut at 50% flowering, close to the ground. Wilt a few hours before feeding.", "एक कापणीचे वाण: 50% फुलोऱ्यात जमिनीलगत कापा. खाऊ घालण्यापूर्वी काही तास सुकवा."]),
      t("fs-irr2", 64, "irrigation", ["Water after cutting (multi-cut)", "कापणीनंतर पाणी (अनेक कापण्या)"], ["For regrowth, irrigate within 2–3 days and give a small nitrogen part.", "पुनर्वाढीसाठी 2–3 दिवसांत पाणी द्या व नत्राचा थोडा हप्ता द्या."]),
      t("fs-store", 70, "other", ["Store extra as dry fodder or silage", "जास्तीचा चारा सुका किंवा मुरघास करा"], ["Dry extra fodder in bundles (kadba) or make silage for summer.", "जास्तीचा चारा पेंढ्या बांधून वाळवा (कडबा) किंवा उन्हाळ्यासाठी मुरघास करा."]),
    ], [["Hard stems if cut late", "उशिरा कापल्यास कडक खोड"]]),
  ],
  ratoon: {
    allowed: true,
    cycles: 2,
    durationDays: [40, 50],
    note: b(
      "Only multi-cut varieties regrow well. Cut 10–15 cm above the ground, water and feed right after, and take the next cut every 40–50 days. Never feed regrowth that is less than about 45 days old or stressed by drought.",
      "फक्त अनेक कापण्यांचे वाणच चांगले पुन्हा फुटतात. जमिनीपासून 10–15 सेंमी वर कापा, लगेच पाणी व खत द्या आणि पुढील कापणी दर 40–50 दिवसांनी करा. साधारण 45 दिवसांपेक्षा कोवळा किंवा पाण्याच्या ताणाखालचा फुटवा कधीही खाऊ घालू नका.",
    ),
  },
  commonProblems: [
    {
      name: b("Prussic acid (HCN) poisoning in cattle", "जनावरांना विषबाधा (हायड्रोसायनिक आम्ल)"),
      signs: b("Animals that eat young, drought-stressed or frost-hit sorghum breathe hard, shake and may die suddenly.", "कोवळी, पाण्याचा ताण पडलेली किंवा थंडीने करपलेली ज्वारी खाल्लेली जनावरे जोरात श्वास घेतात, थरथरतात व अचानक दगावू शकतात."),
      prevention: b("Feed only after 50% flowering (or regrowth older than about 45 days). Do not feed a drought-stressed crop; irrigate and wait. Wilt cut fodder a few hours before feeding. Call a veterinarian at once if an animal shows signs.", "50% फुलोऱ्यानंतरच (किंवा साधारण 45 दिवसांपेक्षा जुना फुटवा) खाऊ घाला. पाण्याचा ताण पडलेले पीक देऊ नका; पाणी देऊन थांबा. कापलेला चारा काही तास सुकवून द्या. लक्षणे दिसल्यास लगेच पशुवैद्यकाला बोलवा."),
    },
    {
      name: b("Shoot fly", "खोडमाशी"),
      signs: b("The centre leaf of young plants dries (dead heart).", "कोवळ्या रोपांचे मधले पान वाळते."),
      prevention: prevent("Sow on time with a slightly higher seed rate, and pull out dead-heart plants.", "थोडे जास्त बियाणे वापरून वेळेवर पेरणी करा आणि मधला कोंब वाळलेली रोपे उपटा."),
    },
    {
      name: b("Stem borer", "खोडकिडा"),
      signs: b("Holes in stems and leaves; dead centre shoot in older plants.", "खोड व पानांना छिद्रे; मोठ्या रोपांचा मधला कोंब वाळतो."),
      prevention: prevent("Destroy stubble after the last cut. Feed fodder only after any spray's waiting period on the label.", "शेवटच्या कापणीनंतर धसकटे नष्ट करा. फवारणी केल्यास लेबलवरील प्रतीक्षा कालावधीनंतरच चारा जनावरांना द्या."),
    },
  ],
  harvestSigns: b("About half the plants are flowering (single-cut), or plants are 55–60 days old / 40–50 days after the last cut (multi-cut).", "साधारण निम्मी झाडे फुलोऱ्यात (एक कापणी), किंवा झाडे 55–60 दिवसांची / मागील कापणीनंतर 40–50 दिवस (अनेक कापण्या)."),
  postHarvest: b(
    "Wilt for a few hours, chop and feed with legume fodder. Extra fodder can be dried as kadba or made into silage.",
    "काही तास सुकवा, कुट्टी करून शेंगवर्गीय चाऱ्यासोबत द्या. जास्तीचा चारा कडबा म्हणून वाळवा किंवा मुरघास करा.",
  ),
  marketTips: b(
    "Green kadval and dry kadba both sell locally to dairy farmers, best in summer when fodder is short.",
    "हिरवे कडवळ व सुका कडबा दोन्ही स्थानिक दूध उत्पादकांना विकले जातात; उन्हाळ्यात चारा टंचाईच्या वेळी सर्वाधिक दर.",
  ),
  varieties: [], // TODO: varieties — confirm single-cut and multi-cut fodder sorghum varieties with MPKV Rahuri / ICAR-IIMR
  source: "General practices from MPKV Rahuri forage guidance, ICAR-IIMR (Hyderabad) and ICAR-IGFRI (Jhansi)",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
