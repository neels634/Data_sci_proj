import type { SeasonalCrop } from "../../types.ts";
import { b, t, stage, prevent } from "../helpers.ts";

const crop: SeasonalCrop = {
  id: "chavli",
  emoji: "🫘",
  name: b("Chavli (cowpea, grain)", "चवळी"),
  aliases: ["chavli", "chawli", "chavali", "chauli", "cowpea", "cow pea", "lobia", "lobiya", "चवळी", "चवळि", "लोबिया"],
  category: "pulse",
  lifecycle: "seasonal",
  regions: ["western", "konkan", "marathwada", "north"],
  tier: 2,
  seasons: [
    { season: "kharif", sowingWindow: b("June–July, after good rain (rainfed)", "जून–जुलै, चांगला पाऊस झाल्यावर (कोरडवाहू)"), sowingMonths: [6, 7], durationDays: [80, 95] },
    { season: "summer", sowingWindow: b("February–March, with irrigation", "फेब्रुवारी–मार्च, पाण्याची सोय असल्यास"), sowingMonths: [2, 3], durationDays: [75, 90] },
  ],
  method: "direct",
  plantingMaterial: b("Seed", "बियाणे"),
  soil: b(
    "Light to medium soil with good drainage. Water logging kills the plants.",
    "पाण्याचा चांगला निचरा होणारी हलकी ते मध्यम जमीन. पाणी साचल्यास झाडे मरतात.",
  ),
  climate: b(
    "Warm weather; tolerates dry spells well. Also grown as a summer crop with irrigation.",
    "उबदार हवामान; पावसाचा खंड चांगला सहन करते. पाण्याची सोय असल्यास उन्हाळ्यातही घेतात.",
  ),
  seedRate: b("8–10 kg seed per acre.", "एकरी 8–10 किलो बियाणे."),
  spacing: b("30–45 cm between rows, 10–15 cm between plants.", "दोन ओळींत 30–45 सेंमी, दोन रोपांत 10–15 सेंमी."),
  irrigation: b(
    "Kharif crop is rainfed; drain extra water. Summer crop needs water every 8–10 days, especially at flowering and pod filling.",
    "खरीप पीक पावसावर येते; जास्तीचे पाणी काढून टाका. उन्हाळी पिकाला दर 8–10 दिवसांनी, विशेषतः फुलोरा व शेंगा भरताना पाणी लागते.",
  ),
  nutrientGuide: b(
    "Use a soil test. Needs little nitrogen; give farmyard manure and a basal dose at sowing. Bio-fertiliser seed treatment helps. Ask your agriculture officer for amounts.",
    "माती परीक्षण करा. नत्र कमी लागते; शेणखत व पेरणीवेळी खताचा पहिला हप्ता द्या. जैविक खताची बीजप्रक्रिया उपयोगी. प्रमाण कृषी अधिकाऱ्यांना विचारा.",
  ),
  stages: [
    stage("germination", ["Germination", "उगवण"], 0, 10, ["Seeds sprout and seedlings come up.", "बी रुजते व रोपे वर येतात."], [
      t("cv-sow", 0, "sowing", ["Sow", "पेरणी करा"], ["Sow in moist soil, 4–5 cm deep, in rows. Treat seed with bio-fertiliser — ask your KVK.", "ओलसर जमिनीत 4–5 सेंमी खोल ओळीत पेरा. जैविक खताची बीजप्रक्रिया करा — कृषी विज्ञान केंद्राला विचारा."]),
      t("cv-count", 7, "observation", ["Check germination", "उगवण तपासा"], ["Look for gaps and fill them early.", "खाडे पाहा व लवकर भरा."]),
    ], [["Seedlings rotting in wet soil", "ओल्या जमिनीत रोपे कुजणे"]]),
    stage("vegetative", ["Leaf growth & branching", "पानांची वाढ व फांद्या"], 10, 40, ["Plants make leaves and branches.", "रोपांना पाने व फांद्या येतात."], [
      t("cv-weed", 15, "weeding", ["Weeding and hoeing", "खुरपणी व कोळपणी"], ["Keep the field weed-free for the first 30–35 days.", "पहिले 30–35 दिवस शेत तणमुक्त ठेवा."], 15),
      t("cv-obs1", 14, "observation", ["Check shoots and leaves", "शेंडे व पाने तपासा"], ["Look for black aphid colonies on tender shoots and yellow mosaic patches.", "कोवळ्या शेंड्यांवर काळ्या माव्याच्या वसाहती व पिवळ्या केवड्याचे चट्टे पाहा."], 7),
      t("cv-irr1", 20, "irrigation", ["Irrigate summer crop", "उन्हाळी पिकाला पाणी द्या"], ["Summer crop: water every 8–10 days. Kharif: drain standing water.", "उन्हाळी पीक: दर 8–10 दिवसांनी पाणी. खरीप: साचलेले पाणी काढा."], 9),
    ], [["Aphids (black mava)", "काळा मावा"], ["Yellow mosaic", "पिवळा केवडा"]]),
    stage("flowering", ["Flowering", "फुलोरा"], 40, 55, ["Flowers open and long pods start to form.", "फुले उमलतात व लांब शेंगा लागू लागतात."], [
      t("cv-obs2", 41, "observation", ["Check flowers", "फुले तपासा"], ["Look for caterpillars in flowers and aphids on flower stalks.", "फुलांत अळ्या व फुलांच्या दांड्यांवर मावा पाहा."], 6),
      t("cv-irr2", 44, "irrigation", ["Water at flowering", "फुलोऱ्यात पाणी द्या"], ["Do not let the crop go dry now; give water if available.", "आता ताण पडू देऊ नका; पाणी उपलब्ध असल्यास द्या."]),
    ], [["Flower drop from water stress", "पाण्याच्या ताणाने फुलगळ"]]),
    stage("pod", ["Pod filling", "शेंगा भरणे"], 55, 75, ["Seeds fill inside the pods; pods start drying from the bottom.", "शेंगांत दाणे भरतात; खालच्या शेंगा वाळू लागतात."], [
      t("cv-obs3", 56, "observation", ["Check pods", "शेंगा तपासा"], ["Look for holes in pods and sucking bugs on pods.", "शेंगांना छिद्रे व शेंगांवर रस शोषणारे ढेकूण पाहा."], 7),
      t("cv-pick1", 70, "harvest", ["First picking of dry pods", "वाळलेल्या शेंगांची पहिली तोडणी"], ["Pick pods that have turned dry and straw-coloured.", "वाळून पिवळसर पांढऱ्या झालेल्या शेंगा तोडा."]),
    ], [["Pod borer", "शेंगा पोखरणारी अळी"]]),
    stage("harvest", ["Maturity & harvest", "पक्वता व काढणी"], 75, 95, ["Most pods dry; harvest in 1–2 more pickings or cut the plants.", "बहुतेक शेंगा वाळतात; आणखी 1–2 तोडण्या करा किंवा झाडे कापा."], [
      t("cv-pick", 75, "harvest", ["Pick dry pods", "वाळलेल्या शेंगा तोडा"], ["Pick dry pods every week until the crop is done.", "पीक संपेपर्यंत दर आठवड्याला वाळलेल्या शेंगा तोडा."], 7),
      t("cv-thresh", 85, "other", ["Dry and thresh", "वाळवून मळणी करा"], ["Dry pods in the sun, thresh and clean the grain.", "शेंगा उन्हात वाळवा, मळणी करून दाणे स्वच्छ करा."]),
    ], [["Rain on dry pods: seeds sprout or go mouldy", "वाळलेल्या शेंगांवर पाऊस: दाण्यांना मोड किंवा बुरशी"]]),
  ],
  commonProblems: [
    {
      name: b("Aphids (black mava)", "काळा मावा"),
      signs: b("Black insects cluster on tender shoots, flowers and pods; shoots curl and weaken.", "कोवळे शेंडे, फुले व शेंगांवर काळ्या किडींचे थवे; शेंडे आकसतात व कमजोर होतात."),
      prevention: prevent("Check shoots weekly, remove the first heavily infested tips, and protect ladybird beetles that eat aphids.", "दर आठवड्याला शेंडे तपासा, सुरुवातीचे जास्त बाधित शेंडे खुडून टाका आणि मावा खाणाऱ्या ढालकिड्यांचे संरक्षण करा."),
    },
    {
      name: b("Yellow mosaic", "पिवळा केवडा"),
      signs: b("Yellow and green patches on leaves; plants stunted.", "पानांवर पिवळे-हिरवे चट्टे; झाडांची वाढ खुंटते."),
      prevention: prevent("Uproot sick plants early and keep whitefly in check.", "रोगट झाडे लवकर उपटा आणि पांढरी माशी आटोक्यात ठेवा."),
    },
    {
      name: b("Pod borer", "शेंगा पोखरणारी अळी"),
      signs: b("Holes in pods; seeds eaten inside.", "शेंगांना छिद्रे; आतील दाणे खाल्लेले."),
      prevention: prevent("Check pods weekly and put up bird perches and pheromone traps.", "दर आठवड्याला शेंगा तपासा, पक्षी थांबे व कामगंध सापळे लावा."),
    },
  ],
  harvestSigns: b("Pods are dry, straw-coloured and the seeds rattle inside.", "शेंगा वाळलेल्या, पिवळसर पांढऱ्या असून आत दाणे खुळखुळतात."),
  postHarvest: b(
    "Dry the grain well and store in airtight bags or bins; cowpea is easily attacked by pulse beetles in storage.",
    "दाणे चांगले वाळवा आणि हवाबंद पोत्यांत किंवा कोठीत साठवा; साठवणीत चवळीला भुंगेरे लवकर लागतात.",
  ),
  marketTips: b(
    "Clean, uniform-coloured seed sells best. Many farmers also sell some green pods as a vegetable for early cash.",
    "स्वच्छ, एकसारख्या रंगाच्या दाण्यांना चांगला दर मिळतो. अनेक शेतकरी लवकर पैसे मिळण्यासाठी काही हिरव्या शेंगा भाजी म्हणूनही विकतात.",
  ),
  varieties: [], // TODO: varieties — confirm grain cowpea varieties with MPKV Rahuri
  source: "General practices from MPKV Rahuri, Dr. BSKKV Dapoli and ICAR-IIPR cowpea guidance",
  lastVerified: null,
  reviewStatus: "draft",
};

export default crop;
