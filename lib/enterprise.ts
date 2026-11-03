/**
 * Gaon Tithe Udyojak: turns a village's resources into business ideas worth checking, and works out
 * each idea's money. Everything here is plain arithmetic so it can be tested and explained.
 *
 * The rupee figures in ENTERPRISES are starting guesses for the farmer to replace with real quotes,
 * not market data. A good score means "worth checking", never "will make money".
 */
import { bi, type Bi } from "./i18n.ts";

// ---- the village

export type YesNo = "yes" | "no" | null;

export interface VillageProfile {
  name: string;
  taluka: string;
  households: number | null;
  dairyHouseholds: number | null;
  crops: string[];
  residues: string[];
  skills: string[];
  capital: number | null;
  power: YesNo;
  water: YesNo;
  space: YesNo;
  marketKm: number | null;
  buyersSpokenTo: number | null;
  /** an example village must never be read as a survey */
  source: "example" | "entered";
}

export const CROP_OPTIONS: { id: string; name: Bi }[] = [
  { id: "sugarcane", name: bi("Sugarcane", "ऊस") },
  { id: "onion", name: bi("Onion", "कांदा") },
  { id: "pomegranate", name: bi("Pomegranate", "डाळिंब") },
  { id: "groundnut", name: bi("Groundnut", "भुईमूग") },
  { id: "turmeric", name: bi("Turmeric", "हळद") },
  { id: "chilli", name: bi("Chilli", "मिरची") },
  { id: "millet", name: bi("Jowar / bajra", "ज्वारी / बाजरी") },
  { id: "wheat", name: bi("Wheat", "गहू") },
  { id: "vegetables", name: bi("Vegetables", "भाजीपाला") },
];

export const RESIDUE_OPTIONS: { id: string; name: Bi }[] = [
  { id: "cane-trash", name: bi("Sugarcane trash / bagasse", "उसाचे पाचट / चिपाड") },
  { id: "crop-stalks", name: bi("Crop stalks and straw", "पिकांचे धसकट व कडबा") },
  { id: "groundnut-shell", name: bi("Groundnut shells", "भुईमुगाची टरफले") },
  { id: "vegetable-waste", name: bi("Onion and vegetable waste", "कांदा व भाजीपाला कचरा") },
  { id: "dung", name: bi("Cattle dung", "शेण") },
];

export const SKILL_OPTIONS: { id: string; name: Bi }[] = [
  { id: "machinery", name: bi("Machinery repair", "यंत्र दुरुस्ती") },
  { id: "food", name: bi("Food preparation", "अन्न प्रक्रिया") },
  { id: "tailoring", name: bi("Tailoring", "शिवणकाम") },
  { id: "dairy", name: bi("Dairy work", "दुग्ध व्यवसाय") },
  { id: "driving", name: bi("Tractor driving", "ट्रॅक्टर चालवणे") },
  { id: "accounts", name: bi("Accounts and records", "हिशोब व नोंदी") },
];

export const EMPTY_VILLAGE: VillageProfile = { name: "", taluka: "", households: null, dairyHouseholds: null, crops: [], residues: [], skills: [], capital: null, power: null, water: null, space: null, marketKm: null, buyersSpokenTo: null, source: "entered" };

/** Inspired by Western Maharashtra, but not a real place or a survey. */
export const EXAMPLE_VILLAGE: VillageProfile = {
  ...EMPTY_VILLAGE,
  name: "Example village",
  households: 300,
  dairyHouseholds: 85,
  crops: ["sugarcane", "onion"],
  residues: ["cane-trash", "vegetable-waste"],
  skills: ["machinery", "food", "tailoring"],
  capital: 500000,
  source: "example",
};

// ---- the money

export interface ScenarioInputs {
  /** units made in an active month */
  production: number;
  price: number;
  /** raw material and packing for one unit made */
  rawCost: number;
  wastagePct: number;
  labour: number;
  electricity: number;
  transport: number;
  other: number;
  setupCost: number;
  /** days buyers take to pay */
  creditDays: number;
  /** months in a year with no work */
  idleMonths: number;
}

export interface ScenarioResult {
  sold: number;
  /** money coming in; never to be read as profit */
  revenue: number;
  directCost: number;
  grossProfit: number;
  fixedCosts: number;
  /** left after all monthly costs, before loan payments and tax */
  surplus: number;
  contribution: number;
  /** units to sell each month to cover monthly costs; null if each unit loses money */
  breakEven: number | null;
  workingCapital: number;
  yearlySurplus: number;
  /** months to earn back the setup cost, as a scenario; null if the year doesn't earn */
  paybackMonths: number | null;
}

export function calcScenario(i: ScenarioInputs): ScenarioResult {
  const keep = 1 - Math.min(Math.max(i.wastagePct, 0), 99) / 100;
  const sold = i.production * keep;
  const revenue = sold * i.price;
  const directCost = i.production * i.rawCost;
  const grossProfit = revenue - directCost;
  const fixedCosts = i.labour + i.electricity + i.transport + i.other;
  const surplus = grossProfit - fixedCosts;
  const contribution = i.price - i.rawCost / keep;
  // what is still owed by buyers, plus 15 days of raw material and one month of running costs
  const workingCapital = (revenue * i.creditDays) / 30 + directCost / 2 + fixedCosts;
  const idle = Math.min(Math.max(i.idleMonths, 0), 12);
  // in idle months only the "other" costs such as rent and maintenance carry on
  const yearlySurplus = surplus * (12 - idle) - i.other * idle;
  return {
    sold,
    revenue,
    directCost,
    grossProfit,
    fixedCosts,
    surplus,
    contribution,
    breakEven: contribution > 0 ? Math.ceil(fixedCosts / contribution) : null,
    workingCapital,
    yearlySurplus,
    paybackMonths: yearlySurplus > 0 ? Math.ceil(i.setupCost / (yearlySurplus / 12)) : null,
  };
}

export type ScenarioName = "conservative" | "base" | "optimistic";

/** The farmer's own numbers are the base; the other two move sales, price and raw material together. */
export function scenarioSet(base: ScenarioInputs): Record<ScenarioName, ScenarioResult> {
  const move = (production: number, price: number, raw: number): ScenarioInputs => ({ ...base, production: base.production * production, price: base.price * price, rawCost: base.rawCost * raw });
  return {
    conservative: calcScenario(move(0.7, 0.95, 1.08)),
    base: calcScenario(base),
    optimistic: calcScenario(move(1.2, 1.05, 0.97)),
  };
}

// ---- the ideas

export interface Enterprise {
  id: string;
  emoji: string;
  name: Bi;
  summary: Bi;
  need: Bi;
  unit: Bi;
  investment: [number, number];
  skills: string[];
  needs: { power: boolean; water: boolean; space: boolean };
  /** 0 to 1, how much local paid work it could make */
  employment: number;
  rawFit: (v: VillageProfile) => number;
  rawReason: (v: VillageProfile) => Bi | null;
  rawMaterials: Bi[];
  equipment: Bi[];
  space: Bi;
  customers: Bi[];
  licences: Bi[];
  risks: Bi[];
  validation: Bi[];
  firstMonth: Bi[];
  /** schemes in this app worth reading; never a promise of support */
  schemes: string[];
  guess: ScenarioInputs;
}

const UDYAM = bi("Udyam registration, where it applies", "लागू असल्यास उद्यम नोंदणी");
const GST = bi("Whether GST applies at your turnover", "तुमच्या उलाढालीला GST लागू होतो का");
const LOCAL = bi("Gram Panchayat or local trade permission", "ग्रामपंचायत किंवा स्थानिक व्यवसाय परवानगी");
const FSSAI = bi("FSSAI registration or licence, and labelling rules", "FSSAI नोंदणी किंवा परवाना, व लेबलिंग नियम");
const ask = bi("Ask 5 possible buyers: would you buy, how much, at what price?", "५ संभाव्य खरेदीदारांना विचारा: घ्याल का, किती, कोणत्या किमतीला?");
const quotes = bi("Get written quotes from at least 2 equipment sellers", "किमान २ यंत्र विक्रेत्यांकडून लेखी दरपत्रक घ्या");

const named = (ids: string[], options: { id: string; name: Bi }[]) => {
  const names = ids.flatMap((id) => options.find((o) => o.id === id)?.name ?? []);
  return bi(names.map((n) => n.en).join(", "), names.map((n) => n.mr).join(", "));
};

export const ENTERPRISES: Enterprise[] = [
  {
    id: "dairy",
    emoji: "🥛",
    name: bi("Dairy value-addition unit", "दुग्ध मूल्यवर्धन केंद्र"),
    summary: bi("Make paneer, curd or ghee from local milk instead of selling only milk.", "फक्त दूध विकण्याऐवजी स्थानिक दुधापासून पनीर, दही किंवा तूप बनवा."),
    need: bi("Shops, hotels and homes nearby may want fresh dairy products made close to them.", "जवळची दुकाने, हॉटेल व घरांना जवळच बनवलेले ताजे दुग्धपदार्थ हवे असू शकतात."),
    unit: bi("kg", "किलो"),
    investment: [200000, 600000],
    skills: ["dairy", "food"],
    needs: { power: true, water: true, space: true },
    employment: 0.6,
    rawFit: (v) => Math.min(1, (v.dairyHouseholds ?? 0) / 50),
    rawReason: (v) => (v.dairyHouseholds ? bi(`${v.dairyHouseholds} dairy households could supply milk.`, `${v.dairyHouseholds} दुग्ध उत्पादक कुटुंबे दूध पुरवू शकतात.`) : null),
    rawMaterials: [bi("Fresh milk, tested daily for fat and SNF", "रोज फॅट व SNF तपासलेले ताजे दूध"), bi("Food-grade packing", "अन्नासाठी योग्य पॅकिंग")],
    equipment: [bi("Milk testing machine", "दूध तपासणी यंत्र"), bi("Steel vats and press", "स्टीलची भांडी व प्रेस"), bi("Deep freezer or cold room", "डीप फ्रीझर किंवा शीतगृह")],
    space: bi("A clean, washable room with steady water and electricity.", "स्थिर पाणी व वीज असलेली स्वच्छ, धुता येणारी खोली."),
    customers: [bi("Sweet shops", "मिठाईची दुकाने"), bi("Hotels and restaurants", "हॉटेल व उपाहारगृहे"), bi("Retail shops", "किरकोळ दुकाने"), bi("Households", "घरगुती ग्राहक")],
    licences: [FSSAI, UDYAM, GST, LOCAL],
    risks: [bi("Milk supply falling in some seasons", "काही हंगामात दूध पुरवठा कमी होणे"), bi("Spoilage if cooling fails", "शीतकरण बंद पडल्यास माल खराब होणे"), bi("Competition from known dairies", "नामांकित डेअरींशी स्पर्धा"), bi("Buyers paying late", "खरेदीदारांकडून उशिरा पैसे")],
    validation: [bi("Count how many litres of milk you can get every day, in each season", "प्रत्येक हंगामात रोज किती लिटर दूध मिळेल ते मोजा"), bi("Find out what milk buyers pay now", "सध्या दूध खरेदीदार किती दर देतात ते शोधा"), ask, quotes, bi("Make one small test batch and sell it", "एक लहान चाचणी बॅच बनवून विका")],
    firstMonth: [bi("Week 1: count milk supply and current prices", "आठवडा १: दूध पुरवठा व सध्याचे दर मोजा"), bi("Week 2: talk to shops and hotels", "आठवडा २: दुकाने व हॉटेलशी बोला"), bi("Week 3: get equipment quotes and check FSSAI", "आठवडा ३: यंत्रांचे दरपत्रक घ्या व FSSAI तपासा"), bi("Week 4: redo the numbers and decide", "आठवडा ४: आकडे पुन्हा तपासा व निर्णय घ्या")],
    schemes: ["pmfme", "kcc"],
    guess: { production: 600, price: 320, rawCost: 230, wastagePct: 3, labour: 18000, electricity: 7000, transport: 6000, other: 4000, setupCost: 350000, creditDays: 7, idleMonths: 0 },
  },
  {
    id: "residue",
    emoji: "🌾",
    name: bi("Crop residue collection service", "पीक अवशेष संकलन सेवा"),
    summary: bi("Collect, bale and store crop residue for buyers who can use it.", "वापरू शकणाऱ्या खरेदीदारांसाठी पीक अवशेष गोळा करा, गठ्ठे बांधा व साठवा."),
    need: bi("Residue is often burnt or underused, but it only has value if a buyer will pay for the whole chain.", "अवशेष अनेकदा जाळले जातात, पण खरेदीदार संपूर्ण खर्च भरून पैसे देईल तरच त्याला किंमत आहे."),
    unit: bi("tonne", "टन"),
    investment: [150000, 500000],
    skills: ["driving", "machinery"],
    needs: { power: false, water: false, space: true },
    employment: 0.7,
    // the quantity is never known until surveyed, so this can't score as a sure thing
    rawFit: (v) => (v.residues.length ? 0.6 : 0),
    rawReason: (v) => (v.residues.length ? bi(`Your profile lists ${named(v.residues, RESIDUE_OPTIONS).en}.`, `तुमच्या नोंदीत ${named(v.residues, RESIDUE_OPTIONS).mr} आहे.`) : null),
    rawMaterials: [bi("Dry, clean crop residue from local farms", "स्थानिक शेतांतील कोरडे, स्वच्छ पीक अवशेष")],
    equipment: [bi("Baler", "गठ्ठा यंत्र"), bi("Tractor and trolley, owned or hired", "ट्रॅक्टर व ट्रॉली, स्वतःची किंवा भाड्याची"), bi("Moisture meter", "ओलावा मापक")],
    space: bi("Covered, fire-safe storage away from homes.", "घरांपासून दूर, झाकलेली व आगीपासून सुरक्षित साठवण जागा."),
    customers: [bi("Industrial biomass users", "औद्योगिक बायोमास वापरकर्ते"), bi("Mushroom growers", "अळिंबी उत्पादक"), bi("Compost makers", "कंपोस्ट उत्पादक")],
    licences: [bi("Pollution-control and fire safety permissions", "प्रदूषण नियंत्रण व अग्निसुरक्षा परवानग्या"), UDYAM, GST, LOCAL],
    risks: [bi("No buyer willing to pay enough", "पुरेसे पैसे देणारा खरेदीदार न मिळणे"), bi("Fire in storage", "साठवणीत आग लागणे"), bi("Available only a few months a year", "वर्षातील काही महिनेच उपलब्धता"), bi("Transport cost eating the margin", "वाहतूक खर्चात नफा जाणे")],
    validation: [bi("Measure how many tonnes are really available, and when", "प्रत्यक्ष किती टन व केव्हा उपलब्ध आहे ते मोजा"), bi("Find one named buyer and get their quality needs and price in writing", "एक खरेदीदार शोधा व गुणवत्ता अटी आणि दर लेखी घ्या"), bi("Work out the cost to collect and move one tonne", "एक टन गोळा करून वाहून नेण्याचा खर्च काढा"), quotes],
    firstMonth: [bi("Week 1: ask farmers about quantity and season", "आठवडा १: शेतकऱ्यांना प्रमाण व हंगाम विचारा"), bi("Week 2: find buyers within transport distance", "आठवडा २: वाहतूक अंतरातील खरेदीदार शोधा"), bi("Week 3: test collecting one small load", "आठवडा ३: एक लहान खेप गोळा करून पाहा"), bi("Week 4: redo the numbers and decide", "आठवडा ४: आकडे पुन्हा तपासा व निर्णय घ्या")],
    schemes: ["kcc"],
    guess: { production: 60, price: 3000, rawCost: 1200, wastagePct: 8, labour: 30000, electricity: 2000, transport: 35000, other: 5000, setupCost: 300000, creditDays: 30, idleMonths: 5 },
  },
  {
    id: "machinery",
    emoji: "🚜",
    name: bi("Farm machinery rental and repair", "शेती यंत्र भाडे व दुरुस्ती सेवा"),
    summary: bi("Rent out farm machines by the acre and repair machines for nearby farmers.", "शेती यंत्रे एकरी भाड्याने द्या व जवळच्या शेतकऱ्यांची यंत्रे दुरुस्त करा."),
    need: bi("Small farmers may not be able to own machines but still need them at the right time.", "लहान शेतकऱ्यांना यंत्र घेणे परवडत नाही, पण योग्य वेळी ते लागते."),
    unit: bi("acre", "एकर"),
    investment: [300000, 900000],
    skills: ["machinery", "driving"],
    needs: { power: false, water: false, space: true },
    employment: 0.4,
    rawFit: (v) => ((v.households ?? 0) >= 100 && v.crops.length ? 1 : v.crops.length ? 0.5 : 0),
    rawReason: (v) => (v.crops.length ? bi(`${v.households ?? "Some"} households growing ${named(v.crops, CROP_OPTIONS).en} may need machine work.`, `${named(v.crops, CROP_OPTIONS).mr} पिकवणाऱ्या ${v.households ?? "काही"} कुटुंबांना यंत्र काम लागू शकते.`) : null),
    rawMaterials: [bi("Diesel, spare parts and lubricants", "डिझेल, सुटे भाग व वंगण")],
    equipment: [bi("Rotavator or seed drill", "रोटाव्हेटर किंवा पेरणी यंत्र"), bi("Tractor, owned or shared", "ट्रॅक्टर, स्वतःचा किंवा सामायिक"), bi("Repair tools", "दुरुस्तीची साधने")],
    space: bi("A safe covered shed for machines and a small workshop.", "यंत्रांसाठी सुरक्षित झाकलेली शेड व लहान कार्यशाळा."),
    customers: [bi("Small and marginal farmers", "लहान व अल्पभूधारक शेतकरी"), bi("Farmer groups", "शेतकरी गट")],
    licences: [bi("Vehicle and equipment insurance", "वाहन व यंत्र विमा"), UDYAM, GST, LOCAL],
    risks: [bi("Machines sitting idle out of season", "हंगामाबाहेर यंत्रे रिकामी राहणे"), bi("Breakdowns in peak season", "ऐन हंगामात बिघाड"), bi("Operator not available", "चालक न मिळणे"), bi("Loan payments continuing in idle months", "रिकाम्या महिन्यांतही कर्जाचे हप्ते")],
    validation: [bi("Count who already owns machines nearby", "जवळपास कोणाकडे आधीच यंत्रे आहेत ते मोजा"), bi("Find current rental rates per acre", "सध्याचे एकरी भाडे दर शोधा"), bi("Ask 20 farmers how many acres they would book, and when", "२० शेतकऱ्यांना विचारा: किती एकर व केव्हा बुक कराल"), quotes],
    firstMonth: [bi("Week 1: list existing machines and rates", "आठवडा १: असलेली यंत्रे व दर यांची यादी करा"), bi("Week 2: collect acres farmers would book", "आठवडा २: शेतकरी किती एकर बुक करतील ते गोळा करा"), bi("Week 3: try hiring a machine before buying one", "आठवडा ३: विकत घेण्याआधी भाड्याने घेऊन पाहा"), bi("Week 4: redo the numbers and decide", "आठवडा ४: आकडे पुन्हा तपासा व निर्णय घ्या")],
    schemes: ["kcc"],
    guess: { production: 100, price: 1200, rawCost: 450, wastagePct: 0, labour: 18000, electricity: 0, transport: 3000, other: 12000, setupCost: 450000, creditDays: 15, idleMonths: 5 },
  },
  {
    id: "food",
    emoji: "🌶️",
    name: bi("Spice and flour processing unit", "मसाला व पीठ प्रक्रिया केंद्र"),
    summary: bi("Grind, pack and sell local spices and flour under a village name.", "स्थानिक मसाले व पीठ दळून, पॅक करून गावाच्या नावाने विका."),
    need: bi("Shops and hotels may prefer clean, consistent packs made nearby.", "दुकाने व हॉटेलना जवळच बनवलेले स्वच्छ, एकसारखे पॅक आवडू शकतात."),
    unit: bi("kg", "किलो"),
    investment: [75000, 300000],
    skills: ["food"],
    needs: { power: true, water: false, space: true },
    employment: 0.7,
    rawFit: (v) => (v.crops.some((c) => ["turmeric", "chilli", "millet", "wheat"].includes(c)) ? 1 : 0.35),
    rawReason: (v) => {
      const local = v.crops.filter((c) => ["turmeric", "chilli", "millet", "wheat"].includes(c));
      return local.length ? bi(`${named(local, CROP_OPTIONS).en} is grown locally.`, `${named(local, CROP_OPTIONS).mr} गावातच पिकते.`) : null;
    },
    rawMaterials: [bi("Clean, dry spices or grain", "स्वच्छ, कोरडे मसाले किंवा धान्य"), bi("Food-grade pouches and labels", "अन्नासाठी योग्य पिशव्या व लेबले")],
    equipment: [bi("Grinder", "दळण यंत्र"), bi("Sealing machine", "सीलिंग यंत्र"), bi("Weighing scale", "वजन काटा")],
    space: bi("A clean, dry, pest-free room with steady electricity.", "स्थिर वीज असलेली स्वच्छ, कोरडी, कीडमुक्त खोली."),
    customers: [bi("Local retailers", "स्थानिक दुकानदार"), bi("Hotels and institutional kitchens", "हॉटेल व संस्थांची स्वयंपाकघरे"), bi("Direct customers", "थेट ग्राहक")],
    licences: [FSSAI, bi("Weights and measures rules for packs", "पॅकसाठी वजन व माप नियम"), UDYAM, GST],
    risks: [bi("Big brands selling cheaper", "मोठे ब्रँड स्वस्तात विकणे"), bi("Quality changing batch to batch", "बॅचनुसार गुणवत्ता बदलणे"), bi("Shops wanting long credit", "दुकानदारांना दीर्घ उधारी हवी असणे")],
    validation: [ask, bi("Compare prices of packs already on local shelves", "दुकानात असलेल्या पॅकच्या किमतींची तुलना करा"), bi("Check FSSAI needs at the official website", "FSSAI च्या अधिकृत संकेतस्थळावर अटी तपासा"), bi("Sell a small test batch and note repeat orders", "लहान चाचणी बॅच विकून पुन्हा मागणी नोंदवा")],
    firstMonth: [bi("Week 1: visit 10 shops and note prices", "आठवडा १: १० दुकानांना भेट देऊन दर नोंदवा"), bi("Week 2: make a small batch with hired grinding", "आठवडा २: भाड्याच्या दळणातून लहान बॅच बनवा"), bi("Week 3: sell it and ask for feedback", "आठवडा ३: विकून अभिप्राय घ्या"), bi("Week 4: redo the numbers and decide", "आठवडा ४: आकडे पुन्हा तपासा व निर्णय घ्या")],
    schemes: ["pmfme", "umed"],
    guess: { production: 800, price: 180, rawCost: 125, wastagePct: 3, labour: 15000, electricity: 4000, transport: 3000, other: 5000, setupCost: 150000, creditDays: 15, idleMonths: 0 },
  },
  {
    id: "tailoring",
    emoji: "🧵",
    name: bi("Tailoring and packing work centre", "शिवणकाम व पॅकिंग केंद्र"),
    summary: bi("A shared centre taking stitching and packing orders, which a women's group can own and run.", "शिलाई व पॅकिंगची कामे घेणारे सामायिक केंद्र, जे महिला गट चालवू शकतो."),
    need: bi("Schools, shops and small makers nearby may need stitching and packing done reliably.", "जवळच्या शाळा, दुकाने व लहान उत्पादकांना शिलाई व पॅकिंग खात्रीने हवे असू शकते."),
    unit: bi("piece", "नग"),
    investment: [40000, 200000],
    skills: ["tailoring"],
    needs: { power: true, water: false, space: true },
    employment: 0.9,
    rawFit: () => 0.5,
    rawReason: () => null,
    rawMaterials: [bi("Thread and trims; cloth is usually supplied by the customer", "दोरा व साहित्य; कापड सहसा ग्राहक देतो")],
    equipment: [bi("Sewing machines", "शिलाई मशीन"), bi("Cutting table", "कटिंग टेबल"), bi("Sealing machine for packing work", "पॅकिंगसाठी सीलिंग यंत्र")],
    space: bi("A well-lit room for 5 to 10 people.", "५ ते १० लोकांसाठी उजेडाची खोली."),
    customers: [bi("Schools and uniform sellers", "शाळा व गणवेश विक्रेते"), bi("Village food businesses needing packing", "पॅकिंग लागणारे गावातील अन्न व्यवसाय"), bi("Local shops", "स्थानिक दुकाने")],
    licences: [UDYAM, GST, LOCAL, bi("Labour rules if you hire workers", "कामगार घेतल्यास कामगार नियम")],
    risks: [bi("Orders stopping between seasons", "हंगामांमध्ये कामे बंद पडणे"), bi("Low rates from large buyers", "मोठ्या खरेदीदारांकडून कमी दर"), bi("Group members leaving", "गटातील सदस्य सोडून जाणे")],
    validation: [bi("Get one real order in writing before buying machines", "मशीन घेण्याआधी एक प्रत्यक्ष ऑर्डर लेखी मिळवा"), bi("Time how long one piece really takes", "एका नगाला प्रत्यक्ष किती वेळ लागतो ते मोजा"), ask, bi("Agree in writing who owns and earns what", "मालकी व कमाई कोणाची हे लेखी ठरवा")],
    firstMonth: [bi("Week 1: list members and their skills", "आठवडा १: सदस्य व त्यांची कौशल्ये लिहा"), bi("Week 2: talk to schools and shops", "आठवडा २: शाळा व दुकानांशी बोला"), bi("Week 3: finish one small order on existing machines", "आठवडा ३: असलेल्या मशीनवर एक लहान ऑर्डर पूर्ण करा"), bi("Week 4: redo the numbers and decide", "आठवडा ४: आकडे पुन्हा तपासा व निर्णय घ्या")],
    schemes: ["umed"],
    guess: { production: 400, price: 120, rawCost: 35, wastagePct: 2, labour: 20000, electricity: 1500, transport: 1500, other: 2500, setupCost: 80000, creditDays: 15, idleMonths: 1 },
  },
];

export const enterpriseById = (id: string) => ENTERPRISES.find((e) => e.id === id);

// ---- the discovery engine

/** The weights proposed in the project document; to be tuned with field experience. */
const WEIGHTS = { raw: 20, demand: 25, capital: 15, skill: 10, infrastructure: 10, logistics: 10, employment: 10 };

export type Fit = "worth_checking" | "possible" | "weak";
export type Confidence = "low" | "medium";

export interface Recommendation {
  enterprise: Enterprise;
  score: number;
  fit: Fit;
  confidence: Confidence;
  reasons: Bi[];
  missing: Bi[];
  /** reasons this idea can't go ahead as things stand */
  blockers: Bi[];
}

function assess(e: Enterprise, v: VillageProfile): Recommendation {
  const reasons: Bi[] = [];
  const missing: Bi[] = [];
  const blockers: Bi[] = [];

  const raw = e.rawFit(v);
  const rawReason = e.rawReason(v);
  if (rawReason) reasons.push(rawReason);
  if (raw === 0) blockers.push(bi("No local source of raw material in your profile.", "तुमच्या नोंदीत कच्च्या मालाचा स्थानिक स्रोत नाही."));
  if (e.id === "residue" && v.residues.length) missing.push(bi("How many tonnes are really available, and in which months", "प्रत्यक्ष किती टन व कोणत्या महिन्यांत उपलब्ध आहे"));

  const buyers = v.buyersSpokenTo ?? 0;
  const demand = buyers >= 5 ? 1 : buyers >= 3 ? 0.8 : buyers >= 1 ? 0.5 : 0.2;
  if (buyers > 0) reasons.push(bi(`You have spoken to ${buyers} possible buyers.`, `तुम्ही ${buyers} संभाव्य खरेदीदारांशी बोललात.`));
  else missing.push(bi("No buyer has been asked yet, so demand is unproven", "अजून कोणत्याही खरेदीदाराला विचारलेले नाही, त्यामुळे मागणी सिद्ध नाही"));

  const [low, high] = e.investment;
  let capital = 0.4;
  if (v.capital === null) missing.push(bi("How much money you can invest", "तुम्ही किती पैसे गुंतवू शकता"));
  else if (v.capital < low) {
    capital = 0;
    blockers.push(bi(`Needs at least about ₹${low.toLocaleString("en-IN")}, more than your ₹${v.capital.toLocaleString("en-IN")}.`, `किमान सुमारे ₹${low.toLocaleString("en-IN")} लागतील, तुमच्याकडे ₹${v.capital.toLocaleString("en-IN")} आहेत.`));
  } else {
    capital = v.capital >= high ? 1 : 0.7;
    reasons.push(bi("It fits within your money available, on our rough estimate.", "आमच्या ढोबळ अंदाजानुसार हे तुमच्या उपलब्ध पैशांत बसते."));
  }

  const matched = e.skills.filter((s) => v.skills.includes(s));
  const skill = matched.length ? 1 : 0.2;
  if (matched.length) reasons.push(bi(`Local skill available: ${named(matched, SKILL_OPTIONS).en}.`, `स्थानिक कौशल्य उपलब्ध: ${named(matched, SKILL_OPTIONS).mr}.`));
  else missing.push(bi(`Training or a skilled person for ${named(e.skills, SKILL_OPTIONS).en}`, `${named(e.skills, SKILL_OPTIONS).mr} यासाठी प्रशिक्षण किंवा कुशल व्यक्ती`));

  const required = (["power", "water", "space"] as const).filter((k) => e.needs[k]);
  const NEED_NAMES = { power: bi("electricity", "वीज"), water: bi("water", "पाणी"), space: bi("a suitable place", "योग्य जागा") };
  const infraScores = required.map((k) => {
    if (v[k] === "no") blockers.push(bi(`Needs ${NEED_NAMES[k].en}, which your profile says is not available.`, `${NEED_NAMES[k].mr} लागते, पण तुमच्या नोंदीनुसार ते उपलब्ध नाही.`));
    if (v[k] === null) missing.push(bi(`Whether ${NEED_NAMES[k].en} is available`, `${NEED_NAMES[k].mr} उपलब्ध आहे का`));
    return v[k] === "yes" ? 1 : v[k] === "no" ? 0 : 0.5;
  });
  const infrastructure = infraScores.length ? infraScores.reduce<number>((a, b) => a + b, 0) / infraScores.length : 1;

  let logistics = 0.4;
  if (v.marketKm === null) missing.push(bi("How far the nearest market or buyer is", "जवळची बाजारपेठ किंवा खरेदीदार किती दूर आहे"));
  else logistics = v.marketKm <= 15 ? 1 : v.marketKm <= 40 ? 0.6 : 0.3;

  const score = Math.round(raw * WEIGHTS.raw + demand * WEIGHTS.demand + capital * WEIGHTS.capital + skill * WEIGHTS.skill + infrastructure * WEIGHTS.infrastructure + logistics * WEIGHTS.logistics + e.employment * WEIGHTS.employment);

  return {
    enterprise: e,
    score,
    fit: score >= 65 ? "worth_checking" : score >= 45 ? "possible" : "weak",
    // only a field survey and real buyers could ever make this high, so the app never says so by itself
    confidence: v.source === "entered" && buyers >= 3 && missing.length <= 1 ? "medium" : "low",
    reasons,
    missing,
    blockers,
  };
}

/** The best three ideas that can go ahead, and the rest with what stops them. */
export function discover(village: VillageProfile): { top: Recommendation[]; others: Recommendation[] } {
  const all = ENTERPRISES.map((e) => assess(e, village)).sort((a, b) => b.score - a.score);
  const open = all.filter((r) => r.blockers.length === 0);
  const top = open.slice(0, 3);
  return { top, others: all.filter((r) => !top.includes(r)) };
}

// ---- what the farmer keeps

export interface EntrepreneurProfile {
  skills: string[];
  experience: string;
  investment: string;
  training: string;
  working: "" | "alone" | "family" | "shg" | "fpo";
}

export interface SavedIdea {
  inputs: ScenarioInputs;
  /** indexes of the validation steps already done */
  checked: number[];
}

export interface EnterpriseRecord {
  village: VillageProfile | null;
  entrepreneur: EntrepreneurProfile | null;
  ideas: Record<string, SavedIdea>;
}

export const EMPTY_RECORD: EnterpriseRecord = { village: null, entrepreneur: null, ideas: {} };
