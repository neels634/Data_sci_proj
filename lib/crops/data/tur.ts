import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "tur",
  emoji: "🌿",
  name: b("Tur (pigeon pea)", "तूर"),
  aliases: ["tur", "toor", "arhar", "pigeon pea", "pigeonpea", "तूर", "तुर", "अरहर"],
  category: "pulse",
  lifecycle: "seasonal",
  regions: ["marathwada", "vidarbha", "western"],
  majorDistricts: b("Latur, Beed, Amravati, Yavatmal, Solapur", "लातूर, बीड, अमरावती, यवतमाळ, सोलापूर"),
  tier: 1,
  seasons: [{ season: "kharif", sowingWindow: b("June–July", "जून–जुलै"), sowingMonths: [6, 7], durationDays: [150, 180] }],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b("Well-drained medium to deep soil. Does not like standing water.", "पाण्याचा निचरा होणारी मध्यम ते भारी जमीन. साचलेले पाणी चालत नाही."),
  climate: b("Kharif rains for growth, dry weather at pod maturity.", "वाढीसाठी खरीप पाऊस, शेंगा पक्व होताना कोरडे हवामान."),
  seedRate: b("5–6 kg seed per acre (less when grown as an intercrop).", "एकरी 5–6 किलो बियाणे (आंतरपिकात कमी)."),
  spacing: b("90–120 cm between rows, about 20 cm between plants.", "ओळींत 90–120 सेंमी, रोपांत साधारण 20 सेंमी."),
  irrigation: b("Mostly rainfed. One irrigation at flowering and one at pod filling helps if the soil is dry.", "मुख्यतः पावसावर. जमीन कोरडी असल्यास फुलोऱ्यात व शेंगा भरताना एकेक पाणी उपयोगी."),
  nutrientGuide: b("Use a soil test. A pulse needs little nitrogen; bio-fertiliser seed treatment helps — ask your KVK.", "माती परीक्षण करा. कडधान्याला कमी नत्र लागते; जैविक खताची बीजप्रक्रिया उपयोगी — कृषी विज्ञान केंद्राला विचारा."),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 15, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("tu-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow in rows; tur is often grown between soybean or cotton rows.", "ओळीत पेरा; तूर अनेकदा सोयाबीन किंवा कापसाच्या ओळींमध्ये घेतात."]),
      t("tu-gap", 10, "other", ["Fill gaps", "खाडे भरा"], ["Resow missing spots.", "उगवण न झालेल्या जागी पुन्हा पेरा."]),
    ], [["Poor germination", "कमी उगवण"]]),
    stage("vegetative", ["Plant growth", "रोपांची वाढ"], 15, 75, ["Plants grow tall and branch out.", "रोपे उंच वाढतात व फांद्या फुटतात."], [
      t("tu-weed", 20, "weeding", ["Weeding", "खुरपणी"], ["Keep the field weed-free while plants are young.", "रोपे लहान असताना शेत तणमुक्त ठेवा."], 20),
      t("tu-obs1", 21, "observation", ["Check plants", "रोपे तपासा"], ["Look for wilting plants (wilt) and webbed leaves.", "मलूल होणारी रोपे (मर) व जाळी लागलेली पाने पाहा."], 10),
      t("tu-nip", 45, "other", ["Nip the tops", "शेंडे खुडा"], ["Nipping the top bud gives more branches — do it if advised locally.", "शेंडा खुडल्याने जास्त फांद्या येतात — स्थानिक सल्ला असल्यास करा."]),
    ], [["Wilt", "मर रोग"], ["Leaf webber", "पाने गुंडाळणारी अळी"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 75, 110, ["Yellow flowers appear and first pods form.", "पिवळी फुले येतात व पहिल्या शेंगा लागतात."], [
      t("tu-obs2", 76, "observation", ["Check flowers and pods", "फुले व शेंगा तपासा"], ["Look for pod borer caterpillars and pod fly.", "शेंगा पोखरणारी अळी व शेंगमाशी पाहा."], 7),
      t("tu-irr1", 80, "irrigation", ["Irrigate if dry", "कोरडे असल्यास पाणी द्या"], ["One irrigation at flowering helps if water is available.", "पाणी उपलब्ध असल्यास फुलोऱ्यात एक पाणी उपयोगी."]),
    ], [["Pod borer", "शेंगा पोखरणारी अळी"]]),
    stage("pod", ["Pod filling", "शेंगा भरणे"], 110, 150, ["Seeds fill inside the pods.", "शेंगांमध्ये दाणे भरतात."], [
      t("tu-obs3", 111, "observation", ["Check pods", "शेंगा तपासा"], ["Look for holes in pods.", "शेंगांना छिद्रे आहेत का पाहा."], 7),
      t("tu-irr2", 115, "irrigation", ["Light irrigation if dry", "कोरडे असल्यास हलके पाणी"], ["Helps seeds fill in a dry spell.", "पावसाच्या खंडात दाणे भरायला मदत."]),
    ], [["Pod fly", "शेंगमाशी"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 150, 180, ["Pods turn brown and dry.", "शेंगा तपकिरी होऊन वाळतात."], [
      t("tu-mat", 150, "observation", ["Check if ready", "तयार आहे का पाहा"], ["When 75–80% of pods are brown, plan the harvest.", "75–80% शेंगा तपकिरी झाल्या की काढणीचे नियोजन करा."]),
      t("tu-harv", 155, "harvest", ["Harvest", "काढणी करा"], ["Cut plants, dry in the sun and thresh.", "झाडे कापा, उन्हात वाळवा व मळणी करा."]),
    ], [["Storage pests (pulse beetle)", "साठवणीतील किडी (भुंगेरे)"]]),
  ],
  commonProblems: [
    { name: b("Pod borer", "शेंगा पोखरणारी अळी"), signs: b("Holes in pods; caterpillars eat seeds inside.", "शेंगांना छिद्रे; अळ्या आतील दाणे खातात."), prevention: prevent("Put T-shaped bird perches and check pods weekly.", "T आकाराचे पक्षी थांबे लावा व दर आठवड्याला शेंगा तपासा.") },
    { name: b("Wilt", "मर रोग"), signs: b("Plants dry suddenly while the soil is moist.", "जमीन ओलसर असूनही झाडे अचानक वाळतात."), prevention: b("Use resistant varieties and rotate crops; don't grow tur in the same field every year.", "प्रतिकारक वाण वापरा व फेरपालट करा; दरवर्षी त्याच शेतात तूर घेऊ नका.") },
  ],
  harvestSigns: b("Most pods are brown and dry; leaves fall.", "बहुतेक शेंगा तपकिरी व कोरड्या; पाने गळतात."),
  postHarvest: b("Dry grain well and store in clean, airtight containers to avoid beetles.", "धान्य चांगले वाळवा आणि भुंगेरे टाळण्यासाठी स्वच्छ, हवाबंद डब्यांत साठवा."),
  marketTips: b("Clean, graded tur gets a better rate. Check the support price.", "स्वच्छ, प्रतवारी केलेल्या तुरीला चांगला दर मिळतो. हमीभाव तपासा."),
  varieties: [
    { name: "BSMR-736", note: b("Released by VNMKV Parbhani", "वनामकृवि परभणीचा वाण") },
    { name: "BSMR-853", note: b("Released by VNMKV Parbhani", "वनामकृवि परभणीचा वाण") },
    { name: "Vipula", note: b("Released by MPKV Rahuri", "मफुकृवि राहुरीचा वाण") },
    { name: "ICPL 87119 (Asha)", note: b("Wilt-tolerant, widely grown", "मर रोगास सहनशील, मोठ्या प्रमाणावर घेतला जातो") },
  ],
  source: "General practices from ICAR-IIPR and VNMKV Parbhani pulse guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
