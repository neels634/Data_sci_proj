/**
 * Seed data for the prototype. People, buyers, prices, listings and crops are fictional.
 *
 * Scheme entries name real programmes but are short summaries. They start with
 * `lastVerified: null` so the app shows them as "not yet verified" until an admin
 * checks each one against the official source.
 */
import { bi } from "./i18n";
import { emptyAccount, type Account } from "./account";
import { addDays } from "./lifecycle";
import type { MitraRate } from "./mandi/prices";
import type { Buyer, FarmLocation, FarmActivity, FarmCrop, FarmerProfile, TaskState, Guide, Listing, Lot, Offer, Report, Scheme } from "./types";

/** Mandi Mitra fee schedule, shown to farmers before they accept an offer. */
export const MITRA_FEE_PER_QUINTAL = 30;
export const TRANSPORT_SHARE_PER_QUINTAL = 25;

export const CURRENT_BUYER_ID = "b1";
export const CURRENT_MITRA = bi("Ganesh Shinde", "गणेश शिंदे");
/** the demo Mitra's number, for "Call Mitra" */
export const MITRA_PHONE = "9876500002";
export const VILLAGE = bi("Navgaon", "नवगाव");
export const DISTRICT = bi("Satara", "सातारा");

export const CROPS = ["Onion", "Tomato", "Soybean", "Pomegranate", "Jowar", "Groundnut", "Mango"];

export const seedProfile: FarmerProfile = {
  name: bi("Sunita Pawar", "सुनीता पवार"),
  village: VILLAGE,
  district: DISTRICT,
  crops: ["Onion", "Tomato"],
  landholding: "1-2ha",
  womenLed: true,
  consent: true,
};

export const seedSchemes: Scheme[] = [
  {
    id: "pm-kisan",
    name: bi("PM-KISAN", "पीएम-किसान सन्मान निधी"),
    department: bi("Dept. of Agriculture & Farmers Welfare, Govt. of India", "कृषी व शेतकरी कल्याण विभाग, भारत सरकार"),
    level: "Central",
    category: "Income support",
    summary: bi(
      "Direct income support paid into the bank accounts of eligible landholding farmer families, in instalments through the year.",
      "पात्र जमीनधारक शेतकरी कुटुंबांच्या बँक खात्यात वर्षभरात हप्त्यांनी थेट उत्पन्न सहाय्य जमा केले जाते.",
    ),
    benefits: [bi("₹6,000 per year, paid in three instalments of ₹2,000 by direct benefit transfer", "दरवर्षी ₹6,000 — ₹2,000 चे तीन हप्ते थेट बँक खात्यात (DBT)")],
    eligibility: [
      bi("Landholding farmer family with cultivable land in their name", "स्वतःच्या नावावर लागवडीयोग्य जमीन असलेले शेतकरी कुटुंब"),
      bi(
        "Exclusions apply (e.g. income-tax payers, certain pensioners and professionals) — check the official list",
        "काही अपवाद लागू (उदा. आयकर भरणारे, काही निवृत्तीवेतनधारक व व्यावसायिक) — अधिकृत यादी पहा",
      ),
    ],
    documents: [
      bi("Land record (7/12 extract)", "जमिनीचा उतारा (7/12)"),
      bi("Bank account linked for DBT", "DBT साठी जोडलेले बँक खाते"),
      bi("Identity proof and e-KYC", "ओळखपत्र व ई-केवायसी"),
    ],
    steps: [
      bi(
        "Register on the official portal, at a Common Service Centre, or through the local agriculture office",
        "अधिकृत पोर्टलवर, आपले सरकार / CSC केंद्रात किंवा स्थानिक कृषी कार्यालयात नोंदणी करा",
      ),
      bi("Complete e-KYC", "ई-केवायसी पूर्ण करा"),
      bi("Track payment status on the official portal", "अधिकृत पोर्टलवर हप्त्याची स्थिती तपासा"),
    ],
    officialUrl: "https://pmkisan.gov.in",
    source: "pmkisan.gov.in",
    lastVerified: null,
    status: "active",
    tags: ["all-farmers", "landholding"],
  },
  {
    id: "namo-shetkari",
    name: bi("Namo Shetkari Mahasanman Nidhi", "नमो शेतकरी महासन्मान निधी"),
    department: bi("Agriculture Dept., Govt. of Maharashtra", "कृषी विभाग, महाराष्ट्र शासन"),
    level: "Maharashtra",
    category: "Income support",
    summary: bi(
      "State top-up income support for Maharashtra farmers who are PM-KISAN beneficiaries.",
      "पीएम-किसानचे लाभार्थी असलेल्या महाराष्ट्रातील शेतकऱ्यांना राज्याकडून अतिरिक्त उत्पन्न सहाय्य.",
    ),
    benefits: [bi("Additional annual support paid by the state to eligible PM-KISAN beneficiaries", "पात्र पीएम-किसान लाभार्थ्यांना राज्याकडून अतिरिक्त वार्षिक सहाय्य")],
    eligibility: [bi("Maharashtra farmer enrolled and eligible under PM-KISAN", "पीएम-किसानमध्ये नोंदणीकृत व पात्र असलेले महाराष्ट्रातील शेतकरी")],
    documents: [bi("PM-KISAN registration details", "पीएम-किसान नोंदणी तपशील"), bi("Bank account linked for DBT", "DBT साठी जोडलेले बँक खाते")],
    steps: [
      bi("Keep PM-KISAN registration and e-KYC up to date", "पीएम-किसान नोंदणी व ई-केवायसी अद्ययावत ठेवा"),
      bi("Confirm eligibility with the taluka agriculture office", "तालुका कृषी कार्यालयात पात्रता खात्री करा"),
    ],
    officialUrl: "https://krishi.maharashtra.gov.in",
    source: "krishi.maharashtra.gov.in",
    lastVerified: null,
    status: "active",
    tags: ["all-farmers", "landholding"],
  },
  {
    id: "pmfby",
    name: bi("Pradhan Mantri Fasal Bima Yojana", "प्रधानमंत्री पीक विमा योजना"),
    department: bi("Dept. of Agriculture & Farmers Welfare, Govt. of India", "कृषी व शेतकरी कल्याण विभाग, भारत सरकार"),
    level: "Central",
    category: "Crop insurance",
    summary: bi(
      "Crop insurance against yield loss from natural risks such as drought, flood, pests and disease.",
      "दुष्काळ, पूर, कीड व रोग अशा नैसर्गिक धोक्यांमुळे होणाऱ्या पीक नुकसानीसाठी विमा संरक्षण.",
    ),
    benefits: [
      bi("Low farmer premium share for notified crops; the rest is paid by government", "अधिसूचित पिकांसाठी शेतकऱ्याचा हप्ता कमी; उर्वरित हप्ता शासन भरते"),
      bi("Claim settlement for notified losses", "अधिसूचित नुकसानीसाठी भरपाई"),
    ],
    eligibility: [bi("Farmers growing notified crops in notified areas, including tenant farmers", "अधिसूचित क्षेत्रात अधिसूचित पिके घेणारे शेतकरी, कुळ शेतकऱ्यांसह")],
    documents: [
      bi("Land record or tenancy document", "जमिनीचा उतारा किंवा कुळ करार"),
      bi("Sowing declaration", "पेरणी घोषणापत्र"),
      bi("Bank account details", "बँक खात्याचा तपशील"),
    ],
    steps: [
      bi("Enrol before the season's cut-off date via bank, CSC or the official portal", "हंगामाच्या अंतिम तारखेपूर्वी बँक, CSC किंवा अधिकृत पोर्टलवरून नोंदणी करा"),
      bi("Report crop loss within the notified time window", "पीक नुकसान ठरलेल्या मुदतीत कळवा"),
    ],
    officialUrl: "https://pmfby.gov.in",
    source: "pmfby.gov.in",
    lastVerified: null,
    status: "active",
    tags: ["all-farmers"],
  },
  {
    id: "kcc",
    name: bi("Kisan Credit Card", "किसान क्रेडिट कार्ड"),
    department: bi("Dept. of Financial Services / banks", "वित्तीय सेवा विभाग / बँका"),
    level: "Central",
    category: "Credit",
    summary: bi(
      "Short-term crop and allied-activity credit from banks, with interest subvention for prompt repayment.",
      "पीक व संलग्न व्यवसायांसाठी बँकेकडून अल्पमुदतीचे कर्ज; वेळेवर परतफेड केल्यास व्याज सवलत.",
    ),
    benefits: [
      bi("Revolving credit limit for cultivation and allied needs", "शेती व संलग्न गरजांसाठी फिरती कर्ज मर्यादा"),
      bi("Interest subvention on eligible loans", "पात्र कर्जावर व्याज सवलत"),
    ],
    eligibility: [bi("Farmers, tenant farmers, sharecroppers, SHGs and joint liability groups", "शेतकरी, कुळ शेतकरी, वाटेकरी, बचत गट व संयुक्त जबाबदारी गट")],
    documents: [
      bi("Land record or cultivation proof", "जमिनीचा उतारा किंवा लागवडीचा पुरावा"),
      bi("Identity and address proof", "ओळख व पत्त्याचा पुरावा"),
      bi("Passport-size photo", "पासपोर्ट आकाराचा फोटो"),
    ],
    steps: [bi("Apply at your bank branch", "आपल्या बँक शाखेत अर्ज करा"), bi("Bank assesses credit limit and issues the card", "बँक कर्ज मर्यादा ठरवून कार्ड देते")],
    officialUrl: "https://www.myscheme.gov.in",
    source: "myscheme.gov.in",
    lastVerified: null,
    status: "active",
    tags: ["all-farmers", "credit"],
  },
  {
    id: "pmksy-pdmc",
    name: bi("PMKSY — Per Drop More Crop (micro-irrigation)", "प्रति थेंब अधिक पीक (सूक्ष्म सिंचन)"),
    department: bi("Agriculture Dept. (applied via MahaDBT)", "कृषी विभाग (महाडीबीटी मार्फत अर्ज)"),
    level: "Central",
    category: "Irrigation",
    summary: bi(
      "Subsidy towards drip and sprinkler irrigation systems, applied for in Maharashtra through MahaDBT.",
      "ठिबक व तुषार सिंचन संचासाठी अनुदान; महाराष्ट्रात अर्ज महाडीबीटी पोर्टलवर.",
    ),
    benefits: [bi("Part of the cost of drip or sprinkler systems, with higher support for small and marginal farmers", "ठिबक / तुषार संचाच्या खर्चाचा काही भाग; अल्प व अत्यल्प भूधारकांना जास्त अनुदान")],
    eligibility: [
      bi("Farmers with land and a water source", "जमीन व पाण्याचा स्रोत असलेले शेतकरी"),
      bi("Category-wise subsidy rates — check MahaDBT", "प्रवर्गानुसार अनुदान दर — महाडीबीटीवर तपासा"),
    ],
    documents: [
      bi("7/12 and 8-A extracts", "7/12 व 8-अ उतारे"),
      bi("Quotation from an empanelled supplier", "मान्यताप्राप्त पुरवठादाराचे दरपत्रक"),
      bi("Bank account details", "बँक खात्याचा तपशील"),
    ],
    steps: [
      bi("Register on MahaDBT", "महाडीबीटीवर नोंदणी करा"),
      bi("Apply under the micro-irrigation component", "सूक्ष्म सिंचन घटकाखाली अर्ज करा"),
      bi("Install after pre-sanction, then claim", "पूर्वसंमतीनंतर संच बसवा, मग अनुदानाची मागणी करा"),
    ],
    officialUrl: "https://mahadbt.maharashtra.gov.in",
    source: "mahadbt.maharashtra.gov.in",
    lastVerified: null,
    status: "active",
    tags: ["irrigation", "landholding"],
  },
  {
    id: "pmfme",
    name: bi("PM Formalisation of Micro Food Processing Enterprises (PMFME)", "पीएम सूक्ष्म अन्न प्रक्रिया उद्योग योजना (PMFME)"),
    department: bi("Ministry of Food Processing Industries", "अन्न प्रक्रिया उद्योग मंत्रालय"),
    level: "Central",
    category: "Food processing",
    summary: bi(
      "Support for individual micro food units, SHGs, FPOs and cooperatives to start or upgrade food processing.",
      "वैयक्तिक सूक्ष्म अन्न उद्योग, बचत गट, शेतकरी उत्पादक कंपन्या व सहकारी संस्थांना अन्न प्रक्रिया सुरू किंवा विस्तार करण्यासाठी सहाय्य.",
    ),
    benefits: [
      bi("Credit-linked capital subsidy for eligible project cost (individual units)", "पात्र प्रकल्प खर्चावर कर्जाशी जोडलेले भांडवली अनुदान (वैयक्तिक उद्योग)"),
      bi("Seed capital for SHG members for working capital and small tools", "बचत गट सदस्यांना खेळते भांडवल व लहान अवजारांसाठी बीज भांडवल"),
      bi("Training, branding and marketing support", "प्रशिक्षण, ब्रँडिंग व विपणन सहाय्य"),
    ],
    eligibility: [bi("Existing or new micro food processing units, SHGs, FPOs, cooperatives", "सध्याचे किंवा नवीन सूक्ष्म अन्न प्रक्रिया उद्योग, बचत गट, FPO, सहकारी संस्था")],
    documents: [
      bi("Project report", "प्रकल्प अहवाल"),
      bi("Identity and address proof", "ओळख व पत्त्याचा पुरावा"),
      bi("Bank details", "बँक तपशील"),
      bi("FSSAI registration (or plan to obtain)", "FSSAI नोंदणी (किंवा घेण्याची तयारी)"),
    ],
    steps: [
      bi("Apply on the official PMFME portal", "अधिकृत PMFME पोर्टलवर अर्ज करा"),
      bi("District Resource Person helps prepare the project report", "जिल्हा संसाधन व्यक्ती प्रकल्प अहवाल तयार करण्यास मदत करते"),
      bi("Bank sanctions loan; subsidy follows", "बँक कर्ज मंजूर करते; त्यानंतर अनुदान मिळते"),
    ],
    officialUrl: "https://pmfme.mofpi.gov.in",
    source: "pmfme.mofpi.gov.in",
    lastVerified: null,
    status: "active",
    tags: ["processing", "women"],
  },
  {
    id: "umed",
    name: bi("UMED — Maharashtra State Rural Livelihoods Mission (DAY-NRLM)", "उमेद — महाराष्ट्र राज्य ग्रामीण जीवनोन्नती अभियान"),
    department: bi("Rural Development Dept., Govt. of Maharashtra", "ग्रामविकास विभाग, महाराष्ट्र शासन"),
    level: "Maharashtra",
    category: "Women & SHG",
    summary: bi(
      "Helps rural women form Self-Help Groups, access revolving funds and bank credit, and build livelihoods.",
      "ग्रामीण महिलांना बचत गट स्थापन करणे, फिरता निधी व बँक कर्ज मिळवणे आणि उपजीविका उभारण्यास मदत.",
    ),
    benefits: [
      bi("SHG formation and training", "बचत गट स्थापना व प्रशिक्षण"),
      bi("Revolving fund and community investment support", "फिरता निधी व समुदाय गुंतवणूक सहाय्य"),
      bi("Bank linkage for SHG loans", "बचत गट कर्जासाठी बँक जोडणी"),
    ],
    eligibility: [bi("Rural women from eligible households joining or forming an SHG", "बचत गटात सामील होणाऱ्या किंवा गट स्थापन करणाऱ्या पात्र कुटुंबांतील ग्रामीण महिला")],
    documents: [
      bi("SHG records (meetings, savings)", "बचत गटाच्या नोंदी (बैठका, बचत)"),
      bi("Member identity proofs", "सदस्यांची ओळखपत्रे"),
      bi("SHG bank account", "बचत गटाचे बँक खाते"),
    ],
    steps: [
      bi("Contact the block UMED office or village Community Resource Person", "तालुका उमेद कार्यालय किंवा गावातील समुदाय संसाधन व्यक्तीशी संपर्क करा"),
      bi("Form or join an SHG and start regular savings", "बचत गट स्थापन करा किंवा त्यात सामील व्हा आणि नियमित बचत सुरू करा"),
    ],
    officialUrl: "https://umed.in",
    source: "umed.in",
    lastVerified: null,
    status: "active",
    tags: ["women"],
  },
];

export const seedBuyers: Buyer[] = [
  { id: "b1", name: bi("Krushna Agro Traders", "कृष्णा ॲग्रो ट्रेडर्स"), type: "Trader", location: bi("Pune", "पुणे"), commodities: ["Onion", "Tomato", "Soybean"], verified: false },
  { id: "b2", name: bi("Deccan Pulp Processors", "डेक्कन पल्प प्रोसेसर्स"), type: "Processor", location: bi("Satara", "सातारा"), commodities: ["Tomato", "Mango"], verified: false },
  { id: "b3", name: bi("Pune Fresh Mart", "पुणे फ्रेश मार्ट"), type: "Retailer", location: bi("Pune", "पुणे"), commodities: ["Tomato", "Pomegranate", "Onion"], verified: false },
];

const F = {
  sunita: seedProfile.name,
  ramesh: bi("Ramesh Jadhav", "रमेश जाधव"),
  vitthal: bi("Vitthal Kale", "विठ्ठल काळे"),
  anita: bi("Anita More", "अनिता मोरे"),
  dattatray: bi("Dattatray Gaikwad", "दत्तात्रय गायकवाड"),
  shobha: bi("Shobha Kadam", "शोभा कदम"),
};

const OTHER_VILLAGE = bi("Wadgaon", "वडगाव");

/**
 * Mandi Mitra demo: listings at every step, one pooled onion lot with a buyer offer.
 * Quantities are in each crop's sale unit (onion: 10 kg, quintal for grains). Dates are relative to today.
 */
/** the demo farmer is near Phaltan (Satara); the location stays on the phone */
export const SEED_FARMER_LOCATION: FarmLocation = { lat: 17.99, lng: 74.43, source: "district", districtId: "satara" };

export function seedMandi(today: string): { listings: Listing[]; lots: Lot[]; offers: Offer[]; mitraRates: MitraRate[] } {
  const d = (n: number) => addDays(today, n);
  const base = { village: VILLAGE, availableFrom: today, lotId: null, gradeConfirmedByMitra: false, farmerAccepted: false, checkHistory: [] };
  const checked = (gradeCode: string, at: string, result: Listing["status"], moisture?: number) => ({
    mitraGradeCode: gradeCode,
    gradeConfirmedByMitra: true,
    mitraMoisture: moisture,
    checkHistory: [{ at, by: CURRENT_MITRA, gradeCode, moisture, result }],
  });
  const listings: Listing[] = [
    // Sunita: one onion grade checked and accepted, the small onions still waiting
    { ...base, id: "p1", farmer: F.sunita, owner: SEED_FARMER_ACCOUNT, crop: "onion", gradeCode: "onion.super_gole", quantity: 80, unit: "10kg", status: "ready", createdAt: d(-4), ...checked("onion.super_gole", d(-3), "ready"), farmerAccepted: true },
    { ...base, id: "p2", farmer: F.sunita, owner: SEED_FARMER_ACCOUNT, crop: "onion", gradeCode: "onion.golti", quantity: 30, unit: "10kg", status: "waiting_check", createdAt: d(-1) },
    // Sunita's soybean: she didn't know grade or dryness; the meter read 14% → dry and recheck today
    { ...base, id: "p3", farmer: F.sunita, owner: SEED_FARMER_ACCOUNT, crop: "soybean", gradeCode: "unsure", dryness: "unsure", quantity: 15, unit: "quintal", status: "needs_drying", recheckOn: today, createdAt: d(-4), ...checked("soybean.faq", d(-3), "needs_drying", 14) },
    // neighbours: the pooled onion lot
    { ...base, id: "p4", farmer: F.ramesh, owner: null, crop: "onion", gradeCode: "onion.super_gole", quantity: 60, unit: "10kg", status: "pooled", lotId: "l1", createdAt: d(-9), ...checked("onion.super_gole", d(-8), "ready"), farmerAccepted: true },
    { ...base, id: "p5", farmer: F.vitthal, owner: null, crop: "onion", gradeCode: "onion.super_gole", quantity: 100, unit: "10kg", status: "pooled", lotId: "l1", createdAt: d(-8), ...checked("onion.super_gole", d(-8), "ready"), farmerAccepted: true },
    // neighbours: other crops at different steps
    { ...base, id: "p6", farmer: F.shobha, owner: null, crop: "cotton", gradeCode: "cotton.faq", dryness: "dry", quantity: 12, unit: "quintal", village: OTHER_VILLAGE, status: "waiting_check", createdAt: d(-2) },
    { ...base, id: "p7", farmer: F.anita, owner: null, crop: "pomegranate", gradeCode: "pomegranate.no1", quantity: 900, unit: "kg", status: "ready", createdAt: d(-3), ...checked("pomegranate.no1", d(-2), "ready"), farmerAccepted: true },
    { ...base, id: "p8", farmer: F.dattatray, owner: null, crop: "turmeric", typeCode: "turmeric.rajapuri", gradeCode: "turmeric.lagdi", dryness: "dry", quantity: 18, unit: "quintal", village: OTHER_VILLAGE, status: "ready", createdAt: d(-5), ...checked("turmeric.lagdi", d(-4), "ready", 9), farmerAccepted: true },
    { ...base, id: "p9", farmer: F.ramesh, owner: null, crop: "chana", typeCode: "chana.chafa", gradeCode: "chana.faq", dryness: "dry", quantity: 10, unit: "quintal", status: "ready", createdAt: d(-6), ...checked("chana.faq", d(-5), "ready", 11), farmerAccepted: true },
    { ...base, id: "p10", farmer: F.anita, owner: null, crop: "marigold", typeCode: "marigold.keshri", gradeCode: "marigold.no1", quantity: 250, unit: "kg", village: OTHER_VILLAGE, status: "waiting_check", createdAt: d(0) },
  ];
  const lots: Lot[] = [
    { id: "l1", crop: "onion", gradeCode: "onion.super_gole", unit: "10kg", listingIds: ["p4", "p5"], village: VILLAGE, availableFrom: d(2), mitra: CURRENT_MITRA, status: "Open for offers", createdAt: d(-7) },
  ];
  const offers: Offer[] = [
    {
      id: "o1",
      lotId: "l1",
      buyerId: "b1",
      pricePerUnit: 205,
      unit: "10kg",
      quantity: 160,
      terms: bi("Pickup at village collection point; payment within 3 days of weighing", "गावातील संकलन केंद्रावरून उचल; वजनानंतर 3 दिवसांत पेमेंट"),
      status: "Submitted",
      createdAt: d(-2),
    },
  ];
  // a Mitra-entered onion rate at Phaltan today, so the "Mitra rate" chip shows
  const mitraRates: MitraRate[] = [{ id: "mr1", marketId: "phaltan", cropId: "onion", gradeCode: "onion.golti", perQtl: 1750, date: today, by: "acc-mitra" }];
  return { listings, lots, offers, mitraRates };
}

const FSSAI = bi(
  "Check FSSAI registration and labelling rules before selling packaged food.",
  "पॅकबंद अन्न विकण्यापूर्वी FSSAI नोंदणी व लेबलिंग नियम तपासा.",
);

export const seedGuides: Guide[] = [
  {
    id: "mango-pickle",
    title: bi("Mango pickle (lonche)", "आंब्याचे लोणचे"),
    crop: "Mango",
    summary: bi(
      "A low-equipment product many households already make. Good for SHGs selling in nearby towns.",
      "कमी साधनसामग्रीत होणारे, अनेक घरी आधीच बनवले जाणारे उत्पादन. जवळच्या शहरांत विक्रीसाठी बचत गटांना योग्य.",
    ),
    steps: [
      { heading: bi("Choose the product", "उत्पादन निवडा"), body: bi("Start with one recipe and one jar size. Test it with 20–30 local customers before scaling.", "एक पाककृती व एका बरणीच्या आकाराने सुरुवात करा. वाढवण्यापूर्वी 20–30 स्थानिक ग्राहकांकडून चाचणी घ्या.") },
      { heading: bi("Process overview", "प्रक्रिया"), body: bi("Wash and dry raw mangoes, cut, mix with salt and spices, cure, then fill in clean, dry jars with oil cover.", "कैऱ्या धुऊन कोरड्या करा, फोडी करा, मीठ-मसाला मिसळा, मुरू द्या, मग स्वच्छ कोरड्या बरण्यांत तेलाचा थर देऊन भरा.") },
      { heading: bi("Packaging", "पॅकिंग"), body: bi("Food-grade glass or PET jars with tight lids. Label with name, ingredients, net weight, date and batch.", "घट्ट झाकणाच्या फूड-ग्रेड काचेच्या किंवा PET बरण्या. लेबलवर नाव, घटक, निव्वळ वजन, तारीख व बॅच लिहा.") },
      { heading: bi("Costing & pricing", "खर्च व किंमत"), body: bi("Add up raw mango, spices, oil, jars, labels, labour and transport per batch. Use the calculator below.", "प्रत्येक बॅचचा कैरी, मसाले, तेल, बरण्या, लेबल, मजुरी व वाहतूक खर्च जोडा. खालील गणक वापरा.") },
      { heading: bi("Selling", "विक्री"), body: bi("Start with local shops, weekly markets and SHG fairs. Ask buyers what jar size and price they prefer.", "स्थानिक दुकाने, आठवडी बाजार व बचत गट प्रदर्शनांपासून सुरुवात करा. ग्राहकांना कोणता आकार व किंमत हवी ते विचारा.") },
    ],
    equipment: [bi("Stainless-steel vessels and knives", "स्टीलची भांडी व सुऱ्या"), bi("Clean drying space", "स्वच्छ वाळवण्याची जागा"), bi("Weighing scale", "वजनकाटा"), bi("Jars and labels", "बरण्या व लेबल")],
    compliance: bi(
      "Food products need FSSAI registration or licence depending on scale. Check fssai.gov.in or ask your coordinator before selling.",
      "अन्न उत्पादनांसाठी व्यवसायाच्या आकारानुसार FSSAI नोंदणी किंवा परवाना लागतो. विक्रीपूर्वी fssai.gov.in पहा किंवा समन्वयकाला विचारा.",
    ),
    defaults: { units: 100, rawMaterial: 1500, processing: 3000, packaging: 1500, labour: 2000, transport: 500, other: 500, sellingPrice: 150 },
  },
  {
    id: "nachni-papad",
    title: bi("Nachni (ragi) flour & papad", "नाचणी पीठ व पापड"),
    crop: "Nachni",
    summary: bi(
      "Millet products with growing urban demand. Flour needs a mill; papad needs drying space and time.",
      "शहरात मागणी वाढत असलेली भरडधान्य उत्पादने. पिठासाठी गिरणी लागते; पापडासाठी वाळवण्याची जागा व वेळ.",
    ),
    steps: [
      { heading: bi("Choose the product", "उत्पादन निवडा"), body: bi("Flour is simpler; papad gives higher value per kg but needs more labour.", "पीठ सोपे आहे; पापडाला किलोमागे जास्त किंमत मिळते पण मेहनत जास्त लागते.") },
      { heading: bi("Process overview", "प्रक्रिया"), body: bi("Clean, sort and dry grain; mill into flour. For papad: make dough, roll, sun- or shade-dry, pack.", "धान्य स्वच्छ करा, निवडा व वाळवा; दळून पीठ करा. पापडासाठी: पीठ मळा, लाटा, उन्हात किंवा सावलीत वाळवा, पॅक करा.") },
      { heading: bi("Packaging", "पॅकिंग"), body: bi("Moisture-proof pouches. Note the best-before date clearly.", "ओलावा न लागणाऱ्या पिशव्या. वापराची अंतिम तारीख स्पष्ट लिहा.") },
      { heading: bi("Costing & pricing", "खर्च व किंमत"), body: bi("Count grain loss during cleaning and milling — it changes your cost per kg.", "स्वच्छता व दळणात होणारी घट मोजा — त्याने किलोमागचा खर्च बदलतो.") },
      { heading: bi("Selling", "विक्री"), body: bi("Health stores, organic markets, hostels and online resellers in nearby cities.", "जवळच्या शहरांतील आरोग्य दुकाने, सेंद्रिय बाजार, वसतिगृहे व ऑनलाइन विक्रेते.") },
    ],
    equipment: [bi("Access to a flour mill", "पिठाची गिरणी"), bi("Drying racks and clean cloth", "वाळवण्याच्या जाळ्या व स्वच्छ कापड"), bi("Pouch sealer", "पिशवी सीलर"), bi("Weighing scale", "वजनकाटा")],
    compliance: FSSAI,
    defaults: { units: 200, rawMaterial: 6000, processing: 1200, packaging: 1600, labour: 3000, transport: 600, other: 400, sellingPrice: 90 },
  },
  {
    id: "groundnut-chikki",
    title: bi("Groundnut chikki", "शेंगदाणा चिक्की"),
    crop: "Groundnut",
    summary: bi(
      "Uses local groundnut and jaggery. Popular with schools, shops and tourist spots.",
      "स्थानिक शेंगदाणे व गुळापासून बनते. शाळा, दुकाने व पर्यटन स्थळी लोकप्रिय.",
    ),
    steps: [
      { heading: bi("Choose the product", "उत्पादन निवडा"), body: bi("Decide bar or piece size and whether to add sesame or dry fruit.", "वडी किंवा तुकड्याचा आकार ठरवा; तीळ किंवा सुका मेवा घालायचा का ते ठरवा.") },
      { heading: bi("Process overview", "प्रक्रिया"), body: bi("Roast and de-skin groundnuts, melt jaggery to the right stage, mix, spread, cut and cool.", "शेंगदाणे भाजून साले काढा, गूळ योग्य पाकात वितळवा, मिसळा, पसरवा, कापा व थंड करा.") },
      { heading: bi("Packaging", "पॅकिंग"), body: bi("Air-tight wrappers; chikki absorbs moisture quickly.", "हवाबंद आवरण वापरा; चिक्की लवकर ओलसर होते.") },
      { heading: bi("Costing & pricing", "खर्च व किंमत"), body: bi("Jaggery price changes by season — recheck costs each batch.", "गुळाचा भाव हंगामानुसार बदलतो — प्रत्येक बॅचला खर्च पुन्हा तपासा.") },
      { heading: bi("Selling", "विक्री"), body: bi("Local shops, school canteens, highway stalls and fairs.", "स्थानिक दुकाने, शाळेची कॅन्टीन, महामार्गावरील स्टॉल व जत्रा.") },
    ],
    equipment: [bi("Roaster or heavy pan", "भाजण्याचे यंत्र किंवा जाड कढई"), bi("Flat steel tray and cutter", "सपाट स्टील ट्रे व कटर"), bi("Sealer", "सीलर"), bi("Scale", "वजनकाटा")],
    compliance: FSSAI,
    defaults: { units: 300, rawMaterial: 4500, processing: 800, packaging: 900, labour: 2400, transport: 400, other: 300, sellingPrice: 40 },
  },
  {
    id: "onion-flakes",
    title: bi("Dried onion flakes", "सुकवलेले कांदा काप"),
    crop: "Onion",
    summary: bi(
      "Turns surplus or lower-grade onion into a longer-shelf-life product. Needs a solar or electric dryer.",
      "जास्तीचा किंवा कमी श्रेणीचा कांदा जास्त काळ टिकणाऱ्या उत्पादनात बदलतो. सौर किंवा विजेचा ड्रायर लागतो.",
    ),
    steps: [
      { heading: bi("Choose the product", "उत्पादन निवडा"), body: bi("Flakes or powder. Talk to a processor or restaurant supplier first to confirm demand.", "काप किंवा पावडर. आधी प्रक्रिया उद्योग किंवा हॉटेल पुरवठादाराशी बोलून मागणी खात्री करा.") },
      { heading: bi("Process overview", "प्रक्रिया"), body: bi("Peel, slice evenly, dry to low moisture, cool and pack immediately.", "सोलून एकसारखे काप करा, ओलावा कमी होईपर्यंत वाळवा, थंड करून लगेच पॅक करा.") },
      { heading: bi("Packaging", "पॅकिंग"), body: bi("Moisture-barrier pouches or bulk bags lined with food-grade plastic.", "ओलावा रोखणाऱ्या पिशव्या किंवा फूड-ग्रेड प्लास्टिकचे अस्तर असलेली मोठी पोती.") },
      { heading: bi("Costing & pricing", "खर्च व किंमत"), body: bi("About 8–10 kg fresh onion makes 1 kg dried — enter your own yield.", "साधारण 8–10 किलो ताज्या कांद्यापासून 1 किलो सुका कांदा मिळतो — तुमचे स्वतःचे उत्पादन टाका.") },
      { heading: bi("Selling", "विक्री"), body: bi("Food processors, hotels, spice makers and wholesalers.", "अन्न प्रक्रिया उद्योग, हॉटेल, मसाला उत्पादक व घाऊक व्यापारी.") },
    ],
    equipment: [bi("Slicer", "काप करण्याचे यंत्र"), bi("Solar or electric dryer", "सौर किंवा विजेचा ड्रायर"), bi("Sealer", "सीलर"), bi("Moisture meter (recommended)", "ओलावा मापक (शिफारस)")],
    compliance: bi(
      "Check FSSAI registration, labelling and any buyer quality specifications.",
      "FSSAI नोंदणी, लेबलिंग व खरेदीदाराच्या गुणवत्ता अटी तपासा.",
    ),
    defaults: { units: 50, rawMaterial: 8000, processing: 2500, packaging: 600, labour: 2500, transport: 700, other: 500, sellingPrice: 380 },
  },
];

export const seedReports: Report[] = [
  {
    id: "r1",
    about: bi("Buyer: unknown caller asking for advance payment", "खरेदीदार: अनोळखी व्यक्ती आगाऊ पैसे मागत आहे"),
    reason: bi("Suspicious buyer", "संशयास्पद खरेदीदार"),
    status: "Open",
    createdAt: "2026-10-26",
  },
  {
    id: "r2",
    about: bi("Scheme: PMFBY cut-off date", "योजना: पीक विमा अंतिम तारीख"),
    reason: bi("Information may be outdated", "माहिती जुनी असू शकते"),
    status: "Open",
    createdAt: "2026-10-28",
  },
];

/** Sample accounts, one per role. Every sample PIN is 1234 (stored only as a hash). */
export const SEED_FARMER_ACCOUNT = "acc-farmer";
export const seedAccounts: Account[] = [
  {
    ...emptyAccount(),
    id: SEED_FARMER_ACCOUNT,
    mobile: "9876500001",
    pinHash: "efae020f919fc05161ed04e90751ed85f963888871ffb55a29f38cb9f2b8e3e0",
    createdAt: "2026-10-15",
    role: "farmer",
    name: "Sunita Pawar",
    gender: "female",
    ageGroup: "36-45",
    education: "10th",
    district: "Satara",
    taluka: "Phaltan",
    village: "Navgaon",
    pincode: "415523",
    landOwnedAcres: "3",
    landLeasedAcres: "1",
    irrigation: ["well", "drip"],
    crops: ["Onion", "Tomato"],
    livestock: ["cow", "goat"],
    shgMember: true,
    shgName: "Savitri Mahila Bachat Gat",
    sellsVia: ["apmc", "trader"],
    interests: ["schemes", "selling", "business"],
    phoneAccess: "own",
    languages: ["mr", "hi"],
    contactVia: ["call", "whatsapp"],
    bestTime: "evening",
    consentData: true,
    consentContact: true,
  },
  {
    ...emptyAccount(),
    id: "acc-mitra",
    mobile: "9876500002",
    pinHash: "6112b02dbfaeb23378930f539aa7c6cc6851c0b1a3cd325b47fe7c0e5f602914",
    createdAt: "2026-10-10",
    role: "mitra",
    name: "Ganesh Shinde",
    gender: "male",
    ageGroup: "26-35",
    education: "12th",
    district: "Pune",
    taluka: "Junnar",
    village: "Navgaon",
    pincode: "410502",
    experienceYears: "4",
    villagesServed: "3",
    vehicle: ["bike", "hire"],
    mitraTrained: true,
    languages: ["mr", "hi"],
    contactVia: ["call", "whatsapp"],
    bestTime: "morning",
    consentData: true,
    consentContact: true,
  },
  {
    ...emptyAccount(),
    id: "acc-buyer",
    mobile: "9876500003",
    pinHash: "636cbf41e23ea64e63003071fb422478da6b6bd7094a272d8ab19866902439f4",
    createdAt: "2026-10-12",
    role: "buyer",
    name: "Prakash Joshi",
    gender: "male",
    ageGroup: "46-60",
    education: "graduate",
    district: "Pune",
    taluka: "Haveli",
    village: "Pune",
    pincode: "411037",
    businessName: "Krushna Agro Traders",
    businessType: "Trader",
    commodities: ["Onion", "Tomato", "Soybean"],
    monthlyVolumeQtl: "200",
    languages: ["mr", "hi", "en"],
    contactVia: ["call", "sms"],
    bestTime: "afternoon",
    consentData: true,
    consentContact: true,
  },
  {
    ...emptyAccount(),
    id: "acc-admin",
    mobile: "9876500004",
    pinHash: "8f58cd053d1503a66f6787a97dc9adcda7f7450ff46f7cabe82fda21f958f603",
    createdAt: "2026-10-01",
    role: "admin",
    name: "Meera Kulkarni",
    gender: "female",
    ageGroup: "26-35",
    education: "graduate",
    district: "Pune",
    taluka: "Junnar",
    village: "Junnar",
    pincode: "410502",
    organisation: "Shet Samruddhi field team",
    designation: "Field coordinator",
    languages: ["mr", "en"],
    contactVia: ["call", "whatsapp"],
    bestTime: "morning",
    consentData: true,
    consentContact: true,
  },
];

/**
 * Sunita's demo farm. Dates are relative to today so the demo always looks live:
 * onion transplanted 45 days ago (irrigation due today, weeding overdue, last spray 6 days ago)
 * and chana planned to be sown in 5 days.
 */
export function seedFarm(today: string): { crops: FarmCrop[]; activities: FarmActivity[]; taskStates: TaskState[] } {
  const d = (n: number) => addDays(today, n);
  const onion = "fc-onion-demo";
  const crops: FarmCrop[] = [
    {
      id: onion,
      owner: SEED_FARMER_ACCOUNT,
      cropId: "onion",
      kind: "seasonal",
      season: "rabi",
      seasonIndex: 2,
      variety: "N-2-4-1",
      plotName: bi("Field near the well", "विहिरीजवळचे शेत"),
      areaAcres: 1.5,
      method: "transplant",
      status: "growing",
      plannedSowingDate: null,
      sowingDate: d(-90), // nursery sown 45 days before transplanting
      transplantDate: d(-45),
      durationDays: [150, 170],
      harvestedOn: null,
      notes: "",
      createdAt: d(-90),
    },
    {
      id: "fc-chana-demo",
      owner: SEED_FARMER_ACCOUNT,
      cropId: "chana",
      kind: "seasonal",
      season: "rabi",
      seasonIndex: 0,
      variety: "Vijay",
      plotName: bi("Back field", "मागचे शेत"),
      areaAcres: 1,
      method: "direct",
      status: "planned",
      plannedSowingDate: d(5),
      sowingDate: null,
      transplantDate: null,
      durationDays: [95, 115],
      harvestedOn: null,
      notes: "",
      createdAt: d(-2),
    },
    {
      // orchard: planted 3 years ago, mrig bahar started 60 days ago (flowering now)
      id: "fc-pomegranate-demo",
      owner: SEED_FARMER_ACCOUNT,
      cropId: "pomegranate",
      kind: "perennial",
      season: "perennial",
      seasonIndex: 0,
      variety: "Bhagwa",
      plotName: bi("Orchard on the slope", "उताराची बाग"),
      areaAcres: 1,
      method: "transplant",
      status: "growing",
      plannedSowingDate: null,
      sowingDate: null,
      transplantDate: null,
      durationDays: [240, 240],
      harvestedOn: null,
      notes: "",
      createdAt: d(-3 * 365),
      plantedOn: d(-3 * 365),
      plantCount: 280,
      cycleKey: "mrig",
      cycleStart: d(-60),
    },
  ];
  const act = (id: string, type: FarmActivity["type"], day: number, extra: Partial<FarmActivity> = {}): FarmActivity => ({
    id,
    farmCropId: onion,
    type,
    date: d(day),
    notes: "",
    createdAt: `${d(day)}T10:00:00`,
    ...extra,
  });
  const pom = "fc-pomegranate-demo";
  const activities: FarmActivity[] = [
    act("fa-tp", "transplanting", -45, { notes: "Seedlings from own nursery" }),
    act("fa-i1", "irrigation", -24, { linkedTaskId: `on-irr2:${d(-24)}` }),
    act("fa-i2", "irrigation", -16, { linkedTaskId: `on-irr2:${d(-16)}` }),
    act("fa-f1", "fertiliser", -15, { productName: "Nitrogen top dose (as per soil card)", linkedTaskId: `on-fert:${d(-15)}` }),
    act("fa-i3", "irrigation", -8, { linkedTaskId: `on-irr2:${d(-8)}` }),
    act("fa-p1", "pesticide", -6, { productName: "Thrips spray advised by KVK", preHarvestIntervalDays: 10, reEntryHours: 24, notes: "Silvery streaks seen on leaves" }),
    act("fa-o1", "observation", -2, { linkedTaskId: `on-obs2:${d(-2)}`, notes: "Leaves look healthy after spray" }),
    { ...act("fa-pm1", "other", -60, { notes: "Mrig bahar: rest period started" }), farmCropId: pom },
    { ...act("fa-pm2", "fertiliser", -30, { productName: "Farmyard manure", notes: "Bahar start", linkedTaskId: `mr-fym:${d(-30)}` }), farmCropId: pom },
    { ...act("fa-pm3", "irrigation", -29, { linkedTaskId: `mr-irr1:${d(-29)}` }), farmCropId: pom },
  ];
  const done = (key: string, day: number): TaskState => ({ farmCropId: onion, taskKey: key, status: "done", at: d(day) });
  const taskStates: TaskState[] = [
    done(`on-irr2:${d(-24)}`, -24),
    done(`on-irr2:${d(-16)}`, -16),
    done(`on-fert:${d(-15)}`, -15),
    done(`on-irr2:${d(-8)}`, -8),
    done(`on-weed:${d(-20)}`, -20),
    done(`on-obs2:${d(-2)}`, -2),
    // demo orchard: day 60 of mrig bahar — recent irrigation and flower check done
    { farmCropId: "fc-pomegranate-demo", taskKey: `mr-irr2:${d(-3)}`, status: "done", at: d(-3) },
    { farmCropId: "fc-pomegranate-demo", taskKey: `mr-obs1:${d(-6)}`, status: "done", at: d(-6) },
  ];
  return { crops, activities, taskStates };
}
