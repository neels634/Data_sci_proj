import type { SeasonalCrop } from "../../types.ts";
import { b, prevent, stage, t } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "strawberry",
  emoji: "🍓",
  name: b("Strawberry", "स्ट्रॉबेरी"),
  aliases: ["strawberry", "strawberries", "strawbery", "stroberry", "स्ट्रॉबेरी", "स्ट्रोबेरी", "स्ट्रॉबेरि"],
  category: "fruit",
  lifecycle: "seasonal",
  regions: ["western"],
  majorDistricts: b("Satara (Mahabaleshwar, Panchgani, Wai)", "सातारा (महाबळेश्वर, पाचगणी, वाई)"),
  tier: 2,
  seasons: [
    { season: "rabi", label: b("Main season (hill)", "मुख्य हंगाम (डोंगरी)"), sowingWindow: b("Plant runners in September–October; pick December–April", "सप्टेंबर–ऑक्टोबरमध्ये रोपे लावा; डिसेंबर–एप्रिल तोडणी"), sowingMonths: [9, 10], durationDays: [180, 210] },
  ],
  method: "vegetative",
  plantingMaterial: b("Runner plants from healthy, disease-free mother plants", "निरोगी, रोगमुक्त मातृ रोपांपासून तयार झालेली धावेची रोपे (रनर)"),
  soil: b(
    "Light, well-drained, slightly acidic soil rich in organic matter. Grown on raised beds so roots never sit in water.",
    "हलकी, पाण्याचा चांगला निचरा होणारी, थोडी आम्लधर्मी व सेंद्रिय पदार्थ भरपूर असलेली जमीन. मुळांजवळ पाणी साचू नये म्हणून गादीवाफ्यावर लागवड.",
  ),
  climate: b(
    "Cool days and cold nights, as on the Mahabaleshwar–Panchgani plateau. Fruits ripen best in the dry winter; rain or high humidity at fruiting causes rot.",
    "महाबळेश्वर–पाचगणी पठारासारखे थंड दिवस व गार रात्री. कोरड्या हिवाळ्यात फळे उत्तम पिकतात; फळधारणेत पाऊस किंवा जास्त दमटपणा असल्यास फळे सडतात.",
  ),
  seedRate: b("One runner plant per spot; work out the number for your bed layout with the nursery.", "एका जागी एक रनर रोप; तुमच्या वाफ्यांच्या मांडणीनुसार लागणाऱ्या रोपांची संख्या रोपवाटिकेसोबत ठरवा."),
  spacing: b("Raised beds about 90–120 cm wide with 2–4 rows; about 30 cm between rows and 25–30 cm between plants.", "साधारण 90–120 सेंमी रुंद गादीवाफे, त्यावर 2–4 ओळी; दोन ओळींत साधारण 30 सेंमी व दोन रोपांत 25–30 सेंमी."),
  irrigation: b(
    "Drip under mulch is best. Give light water often — every 2–4 days — keeping the bed moist but never soggy. Avoid wetting fruit and leaves.",
    "आच्छादनाखाली ठिबक उत्तम. हलके व वारंवार पाणी — दर 2–4 दिवसांनी — वाफा ओलसर ठेवा पण चिखल नको. फळे व पाने ओली करणे टाळा.",
  ),
  nutrientGuide: b(
    "Mix plenty of well-rotted farmyard manure or compost into the beds before planting. Give fertiliser in small, frequent parts through drip as per soil test. Ask your agriculture officer for amounts.",
    "लागवडीपूर्वी वाफ्यात भरपूर चांगले कुजलेले शेणखत किंवा कंपोस्ट मिसळा. माती परीक्षणानुसार ठिबकमधून थोडे थोडे व वारंवार खत द्या. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  varieties: [
    { name: "Sweet Charlie", note: b("Early, sweet; widely grown around Mahabaleshwar", "लवकर येणारा, गोड; महाबळेश्वर परिसरात मोठी लागवड") },
    { name: "Winter Dawn", note: b("Early variety, widely grown in the area", "लवकर येणारा वाण; परिसरात मोठी लागवड") },
    { name: "Camarosa", note: b("Large, firm fruit; travels well", "मोठी, घट्ट फळे; वाहतुकीत टिकतात") },
  ],
  stages: [
    stage("planting", ["Bed making & planting", "वाफे तयार करणे व लागवड"], 0, 15, ["Runner plants are set on raised beds and start to root.", "रनर रोपे गादीवाफ्यावर लावली जातात व मूळ धरू लागतात."], [
      t("sb-bed", 0, "transplanting", ["Make beds and plant runners", "वाफे करून रनर लावा"], ["Make raised beds with compost, lay drip lines and plant runners with the crown just at soil level — not buried.", "कंपोस्ट मिसळून गादीवाफे करा, ठिबक नळ्या टाका आणि रोपाचा मुकुट नेमका जमिनीच्या पातळीवर ठेवून लावा — गाडू नका."]),
      t("sb-irr0", 1, "irrigation", ["Water daily at first", "सुरुवातीला रोज पाणी द्या"], ["Light daily water until plants stand up and new leaves come.", "रोपे उभी राहून नवी पाने येईपर्यंत रोज हलके पाणी द्या."], 2),
      t("sb-gap", 10, "other", ["Replace dead plants", "मेलेली रोपे बदला"], ["Fill gaps quickly with spare runners.", "उरलेल्या रोपांनी खाडे लवकर भरा."]),
    ], [["Plants wilting after planting", "लागवडीनंतर रोपे मलूल होणे"]]),
    stage("establishment", ["Establishment", "रोपे स्थिरावणे"], 15, 45, ["Plants root well and grow new leaves.", "रोपे चांगली मुळे धरतात व नवी पाने येतात."], [
      t("sb-irr1", 15, "irrigation", ["Irrigate", "पाणी द्या"], ["Light drip water every 2–3 days.", "दर 2–3 दिवसांनी हलके ठिबक पाणी."], 3),
      t("sb-runner", 25, "other", ["Remove runners and old leaves", "धावा व जुनी पाने काढा"], ["Cut off runners and dry leaves so the plant builds a strong crown.", "रोपाचा मुकुट मजबूत व्हावा म्हणून धावा व वाळलेली पाने कापा."], 10),
      t("sb-weed", 20, "weeding", ["Weed the beds", "वाफे खुरपा"], ["Pull weeds by hand before mulching.", "आच्छादनापूर्वी हाताने तण काढा."]),
    ], [["Leaf spots", "पानांवरील ठिपके"], ["Crown rot in wet soil", "ओल्या जमिनीत मुकुट कुजणे"]]),
    stage("vegetative", ["Growth & mulching", "वाढ व आच्छादन"], 45, 70, ["Plants fill out; mulch is laid to keep fruit clean.", "रोपे भरतात; फळे स्वच्छ राहावीत म्हणून आच्छादन केले जाते."], [
      t("sb-mulch", 45, "other", ["Mulch the beds", "वाफ्यांवर आच्छादन करा"], ["Cover beds with plastic mulch or dry straw so fruits do not touch soil.", "फळे मातीला लागू नयेत म्हणून वाफ्यांवर प्लास्टिक आच्छादन किंवा वाळलेले गवत पसरा."]),
      t("sb-fert1", 50, "fertiliser", ["Feed through drip", "ठिबकमधून खत द्या"], ["Give small fertiliser parts as per your plan.", "नियोजनानुसार थोडे थोडे खत द्या."], 10),
      t("sb-obs1", 46, "observation", ["Check leaves", "पाने तपासा"], ["Look for white powder, spots and mites under leaves.", "पानांवर पांढरी भुकटी, ठिपके व पानांखाली कोळी पाहा."], 7),
      t("sb-irr2", 45, "irrigation", ["Irrigate", "पाणी द्या"], ["Light, regular drip water.", "हलके, नियमित ठिबक पाणी."], 3),
    ], [["Powdery mildew", "भुरी"], ["Red spider mites", "लाल कोळी"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 70, 90, ["White flowers open and set the first fruits.", "पांढरी फुले उमलून पहिली फळे लागतात."], [
      t("sb-irr3", 70, "irrigation", ["Irrigate evenly", "सारखे पाणी द्या"], ["Even moisture gives well-shaped fruit.", "सारख्या ओलाव्याने फळांना चांगला आकार येतो."], 3),
      t("sb-obs2", 72, "observation", ["Check flowers", "फुले तपासा"], ["Look for grey mould on flowers and thrips.", "फुलांवर राखाडी बुरशी व फुलकिडे पाहा."], 5),
      t("sb-bees", 74, "observation", ["Keep bees safe", "मधमाश्यांचे संरक्षण करा"], ["Bees improve fruit shape. Avoid spraying when flowers are open.", "मधमाश्यांमुळे फळांचा आकार चांगला येतो. फुले उमललेली असताना फवारणी टाळा."]),
    ], [["Grey mould on flowers", "फुलांवर राखाडी बुरशी"]]),
    stage("picking", ["Fruiting & picking", "फळधारणा व तोडणी"], 90, 210, ["Fruits ripen continuously and are picked every 2–3 days.", "फळे सतत पिकतात व दर 2–3 दिवसांनी तोडली जातात."], [
      t("sb-pick", 90, "harvest", ["Pick ripe fruit", "पिकलेली फळे तोडा"], ["Pick in the cool morning when three-quarters of the fruit is red; hold by the stalk and keep the cap on.", "फळ तीन चतुर्थांश लाल झाल्यावर थंड सकाळी तोडा; देठाला धरा व देठाची टोपी ठेवा."], 3),
      t("sb-rot", 92, "observation", ["Remove rotten fruit", "सडलेली फळे काढा"], ["Remove rotten and damaged fruit from beds at every picking.", "प्रत्येक तोडणीला वाफ्यातील सडलेली व खराब फळे काढा."], 3),
      t("sb-fert2", 95, "fertiliser", ["Keep feeding", "खत देत राहा"], ["Continue small fertiliser parts through drip.", "ठिबकमधून थोडे थोडे खत चालू ठेवा."], 10),
      t("sb-irr4", 90, "irrigation", ["Irrigate", "पाणी द्या"], ["Light, regular drip; do not wet the fruit.", "हलके, नियमित ठिबक; फळे ओली करू नका."], 3),
      t("sb-phi", 91, "observation", ["Check spray waiting periods", "फवारणीचा प्रतीक्षा कालावधी तपासा"], ["Do not pick before the waiting period on the label of any product you sprayed.", "फवारलेल्या औषधाच्या लेबलवरील प्रतीक्षा कालावधीपूर्वी तोडणी करू नका."]),
    ], [["Fruit rot (grey mould)", "फळकूज (राखाडी बुरशी)"], ["Birds and slugs", "पक्षी व गोगलगायी"]]),
  ],
  flushes: { everyDays: 3, count: 40, note: b("Pick every 2–3 days from December to April.", "डिसेंबर ते एप्रिल दर 2–3 दिवसांनी तोडणी करा.") },
  commonProblems: [
    {
      name: b("Grey mould (fruit rot)", "राखाडी बुरशी (फळकूज)"),
      signs: b("Soft brown patches on fruit covered with grey fuzz, worse in damp weather.", "फळांवर मऊ तपकिरी डाग व त्यावर राखाडी बुरशी; दमट हवेत जास्त."),
      prevention: prevent("Mulch so fruit does not touch soil, use drip instead of overhead water, keep plants not too crowded and remove rotten fruit at every picking.", "फळे मातीला लागू नयेत म्हणून आच्छादन करा, वरून पाण्याऐवजी ठिबक वापरा, रोपे दाट ठेवू नका आणि प्रत्येक तोडणीला सडलेली फळे काढा."),
    },
    {
      name: b("Powdery mildew", "भुरी"),
      signs: b("White powder on leaves; leaf edges curl upward and turn purplish.", "पानांवर पांढरी भुकटी; पानांच्या कडा वर वळून जांभळट होतात."),
      prevention: prevent("Keep good air flow, remove badly affected leaves and check plants weekly.", "हवा खेळती ठेवा, जास्त बाधित पाने काढा आणि दर आठवड्याला रोपे तपासा."),
    },
    {
      name: b("Red spider mites", "लाल कोळी"),
      signs: b("Tiny yellow specks on leaves, fine webs underneath; leaves turn bronze and dry in dry weather.", "पानांवर बारीक पिवळे ठिपके, खाली बारीक जाळे; कोरड्या हवेत पाने तांबूस होऊन सुकतात."),
      prevention: prevent("Check under leaves weekly, remove old leaves and keep beds free of weeds.", "दर आठवड्याला पानांखाली तपासा, जुनी पाने काढा आणि वाफे तणमुक्त ठेवा."),
    },
  ],
  harvestSigns: b(
    "Fruit is three-quarters to fully red and shiny. For distant markets pick at three-quarters red; for local sale pick fully red.",
    "फळ तीन चतुर्थांश ते पूर्ण लाल व चमकदार. लांबच्या बाजारासाठी तीन चतुर्थांश लाल असताना, स्थानिक विक्रीसाठी पूर्ण लाल झाल्यावर तोडा.",
  ),
  postHarvest: b(
    "Pick straight into small punnets or trays to avoid handling twice. Keep in shade and cool as soon as possible. Strawberries last only 2–3 days without cooling.",
    "दोनदा हाताळावे लागू नये म्हणून थेट लहान पनेट किंवा ट्रेमध्ये तोडा. सावलीत ठेवा व शक्य तितक्या लवकर थंड करा. थंड न केल्यास स्ट्रॉबेरी फक्त 2–3 दिवस टिकते.",
  ),
  marketTips: b(
    "Sell graded punnets to tourists and city markets in Pune and Mumbai. Small or soft fruit can go to jam, crush and pulp makers in the area.",
    "प्रतवारी केलेले पनेट पर्यटक व पुणे-मुंबईच्या बाजारात विका. लहान किंवा मऊ फळे परिसरातील जॅम, क्रश व पल्प उद्योगांना देता येतात.",
  ),
  source: "General practices from MPKV Rahuri strawberry guidance for the Mahabaleshwar plateau",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
