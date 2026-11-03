import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "kodo",
  emoji: "🌾",
  name: b("Kodo millet", "कोद्रा"),
  aliases: ["kodo", "kodra", "kodri", "kodo millet", "कोद्रा", "कोदो", "कोद्रे"],
  category: "millet",
  lifecycle: "seasonal",
  regions: ["konkan", "north"],
  tier: 2,
  seasons: [
    { season: "kharif", sowingWindow: b("June–July with the monsoon (rain-fed)", "जून–जुलै, पावसासोबत (कोरडवाहू)"), sowingMonths: [6, 7], durationDays: [100, 120] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b("Poor, gravelly or stony hill soils where few other crops grow. Must drain well.", "इतर पिके कमी येणारी मुरमाड किंवा खडकाळ डोंगरी जमीन. पाण्याचा निचरा हवा."),
  climate: b("Very hardy monsoon crop of tribal hill areas; tolerates drought and poor soil.", "आदिवासी डोंगरी भागाचे अतिशय काटक पावसाळी पीक; दुष्काळ व कमी कसाची जमीन सहन करते."),
  seedRate: b("About 4 kg seed per acre in lines.", "ओळीत पेरणीसाठी एकरी साधारण 4 किलो बियाणे."),
  spacing: b("25–30 cm between rows, 8–10 cm between plants after thinning.", "ओळींत 25–30 सेंमी, विरळणीनंतर रोपांत 8–10 सेंमी."),
  irrigation: b("Rain-fed; no irrigation is usually needed.", "पावसावर येते; सहसा पाणी द्यावे लागत नाही."),
  nutrientGuide: b("Mix farmyard manure or compost before sowing. A little nitrogen a month after sowing helps on poor soil. Ask your agriculture officer for amounts.", "पेरणीपूर्वी शेणखत किंवा कंपोस्ट मिसळा. कमी कसाच्या जमिनीत पेरणीनंतर महिन्याने थोडे नत्र फायदेशीर. प्रमाण कृषी अधिकाऱ्यांना विचारा."),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 15, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("kd-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow 3 cm deep in rows 25–30 cm apart after good rain.", "चांगल्या पावसानंतर 25–30 सेंमी ओळीत 3 सेंमी खोल पेरा."]),
      t("kd-obs0", 8, "observation", ["Check germination", "उगवण तपासा"], ["Re-sow gaps within a week.", "खाडे आठवड्याच्या आत पुन्हा पेरा."]),
    ], [["Seed washed away on slopes", "उतारावर बी वाहून जाणे"]]),
    stage("vegetative", ["Growth & tillering", "वाढ व फुटवे"], 15, 55, ["Plants grow and make many tillers.", "रोपे वाढतात व भरपूर फुटवे येतात."], [
      t("kd-thin", 18, "other", ["Thin plants", "विरळणी करा"], ["Keep one plant every 8–10 cm.", "दर 8–10 सेंमीवर एक रोप ठेवा."]),
      t("kd-weed", 20, "weeding", ["Weeding", "खुरपणी"], ["Weed once or twice in the first 45 days.", "पहिल्या 45 दिवसांत एक-दोनदा खुरपणी करा."], 15),
      t("kd-obs1", 25, "observation", ["Check young plants", "कोवळी रोपे तपासा"], ["Look for dead centre shoots (shoot fly).", "मधला पोंगा वाळणे (खोडमाशी) पाहा."], 10),
    ], [["Shoot fly", "खोडमाशी"]]),
    stage("flowering", ["Earhead & flowering", "कणीस व फुलोरा"], 55, 80, ["Earheads come out and flower.", "कणसे बाहेर येतात व फुलतात."], [
      t("kd-obs2", 57, "observation", ["Check earheads", "कणसे तपासा"], ["Look for earheads turning into black powder (head smut).", "काळ्या भुकटीत रूपांतर झालेली कणसे (काणी) पाहा."], 7),
      t("kd-rogue", 65, "other", ["Remove sick earheads", "रोगट कणसे काढा"], ["Cut smutted earheads into a bag and destroy them away from the field.", "काणी झालेली कणसे पिशवीत कापून शेतापासून दूर नष्ट करा."]),
    ], [["Head smut", "काणी"]]),
    stage("grain", ["Grain filling", "दाणे भरणे"], 80, 100, ["Grains fill and harden.", "दाणे भरतात व टणक होतात."], [
      t("kd-bird", 80, "other", ["Protect from birds", "पक्ष्यांपासून राखण"], ["Guard the crop in mornings and evenings.", "सकाळ-संध्याकाळ पिकाची राखण करा."]),
      t("kd-obs3", 88, "observation", ["Check grain for mould", "दाण्यांवर बुरशी तपासा"], ["In wet weather look for grey or black mould on earheads; keep such grain apart.", "दमट हवेत कणसांवर राखाडी किंवा काळी बुरशी पाहा; असे दाणे वेगळे ठेवा."]),
    ], [["Grain mould in long wet spells", "सततच्या पावसात दाण्यांवर बुरशी"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 100, 120, ["Earheads turn brown and grains are hard.", "कणसे तपकिरी होतात व दाणे टणक होतात."], [
      t("kd-mat", 100, "observation", ["Check if ready", "तयार आहे का पाहा"], ["Earheads brown, grains hard → ready.", "कणसे तपकिरी, दाणे टणक → तयार."]),
      t("kd-harv", 104, "harvest", ["Harvest", "काढणी करा"], ["Cut plants on a dry day, dry well in the sun and thresh.", "कोरड्या दिवशी झाडे कापा, उन्हात चांगली वाळवा व मळणी करा."]),
    ], [["Rain at harvest causing mould", "काढणीच्या वेळी पावसाने बुरशी"]]),
  ],
  commonProblems: [
    {
      name: b("Shoot fly", "खोडमाशी"),
      signs: b("The centre leaf of young plants dries (dead heart).", "कोवळ्या रोपांचे मधले पान वाळते."),
      prevention: prevent("Sow early with the monsoon and use a little extra seed, then thin.", "पावसासोबत लवकर पेरणी करा, थोडे जास्त बियाणे वापरून नंतर विरळणी करा."),
    },
    {
      name: b("Head smut", "काणी"),
      signs: b("The whole earhead turns into a mass of black powder.", "संपूर्ण कणसाचे काळ्या भुकटीत रूपांतर होते."),
      prevention: prevent("Use clean seed from a healthy crop and remove smutted earheads early.", "निरोगी पिकाचे स्वच्छ बियाणे वापरा व काणी झालेली कणसे लवकर काढा."),
    },
    {
      name: b("Mouldy grain (kodo poisoning)", "बुरशी आलेले दाणे (कोद्रा विषबाधा)"),
      signs: b("Grain from a crop caught in rain at maturity turns dark or mouldy. Eating it can make people and animals sick.", "पक्वतेला पावसात सापडलेल्या पिकाचे दाणे काळसर किंवा बुरशीचे होतात. ते खाल्ल्यास माणसे व जनावरे आजारी पडू शकतात."),
      prevention: b("Harvest on time on dry days, dry the grain fully and never eat or feed mouldy grain.", "कोरड्या दिवशी वेळेवर काढणी करा, दाणे पूर्ण वाळवा आणि बुरशी आलेले दाणे कधीही खाऊ नका किंवा जनावरांना देऊ नका."),
    },
  ],
  harvestSigns: b("Earheads are brown and grains are hard.", "कणसे तपकिरी व दाणे टणक झाले आहेत."),
  postHarvest: b("Dry the grain fully and store in dry bags. Kodo keeps for years with its husk on; dehusk only as needed.", "दाणे पूर्ण वाळवून कोरड्या पोत्यांत साठवा. सालासकट कोद्रा अनेक वर्षे टिकतो; गरजेनुसारच सडून घ्या."),
  marketTips: b("Clean, mould-free, dehusked kodo sells better to millet and health-food buyers.", "स्वच्छ, बुरशीविरहित सडलेल्या कोद्र्याला तृणधान्य व आरोग्यदायी अन्नाच्या खरेदीदारांकडून चांगला दर मिळतो."),
  varieties: [], // TODO: varieties — confirm with MPKV Rahuri / Dr. BSKKV Dapoli or ICAR-IIMR which kodo varieties suit Maharashtra
  source: "General practices from ICAR-IIMR (small millets), MPKV Rahuri and Dr. BSKKV Dapoli guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
