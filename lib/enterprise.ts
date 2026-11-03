/**
 * Gaon Tithe Udyojak: small businesses a farming family can start at home with little money. Works
 * out which ones fit what the family already has, and what each could leave in hand each month.
 * Everything here is plain arithmetic so it can be tested and explained.
 *
 * The rupee figures in ENTERPRISES are starting guesses for the farmer to replace with real prices,
 * not market data. A good score means "worth trying small", never "will make money".
 */
import { bi, type Bi } from "./i18n.ts";

// ---- what the family has

export type YesNo = "yes" | "no" | null;

export interface FarmerAssets {
  animals: string[];
  crops: string[];
  skills: string[];
  /** rupees the family can spend to start; null when not known */
  capital: number | null;
  space: YesNo;
  buyersSpokenTo: number | null;
  /** an example family must never be read as the farmer's own answers */
  source: "example" | "entered";
}

export const ANIMAL_OPTIONS: { id: string; name: Bi }[] = [
  { id: "cattle", name: bi("Cow or buffalo", "गाय किंवा म्हैस") },
  { id: "goat", name: bi("Goats", "शेळ्या") },
  { id: "hens", name: bi("Hens", "कोंबड्या") },
];

export const CROP_OPTIONS: { id: string; name: Bi }[] = [
  { id: "wheat", name: bi("Wheat", "गहू") },
  { id: "millet", name: bi("Jowar / bajra", "ज्वारी / बाजरी") },
  { id: "sugarcane", name: bi("Sugarcane", "ऊस") },
  { id: "onion", name: bi("Onion", "कांदा") },
  { id: "chilli", name: bi("Chilli", "मिरची") },
  { id: "mango", name: bi("Mango", "आंबा") },
  { id: "vegetables", name: bi("Vegetables", "भाजीपाला") },
  { id: "groundnut", name: bi("Groundnut", "भुईमूग") },
];

export const SKILL_OPTIONS: { id: string; name: Bi }[] = [
  { id: "food", name: bi("Cooking, pickles, papad", "स्वयंपाक, लोणची, पापड") },
  { id: "tailoring", name: bi("Stitching", "शिवणकाम") },
  { id: "animals", name: bi("Looking after animals", "जनावरांची काळजी") },
  { id: "tools", name: bi("Using farm tools", "शेती साधने वापरणे") },
];

export const CAPITAL_OPTIONS: { amount: number; name: Bi }[] = [
  { amount: 5000, name: bi("Up to ₹5,000", "₹५,००० पर्यंत") },
  { amount: 15000, name: bi("Up to ₹15,000", "₹१५,००० पर्यंत") },
  { amount: 30000, name: bi("Up to ₹30,000", "₹३०,००० पर्यंत") },
  { amount: 50000, name: bi("Up to ₹50,000", "₹५०,००० पर्यंत") },
];

export const EMPTY_ASSETS: FarmerAssets = { animals: [], crops: [], skills: [], capital: null, space: null, buyersSpokenTo: null, source: "entered" };

/** Made up to show how the screens work; not a real family or a survey. */
export const EXAMPLE_ASSETS: FarmerAssets = { ...EMPTY_ASSETS, animals: ["cattle"], crops: ["wheat", "onion"], skills: ["food"], capital: 15000, space: "yes", source: "example" };

// ---- the money

export interface ScenarioInputs {
  /** how many are made in a working month */
  production: number;
  price: number;
  /** what one costs to make */
  rawCost: number;
  /** share that spoils or can't be sold */
  wastagePct: number;
  /** other monthly costs such as packing, electricity or travel */
  other: number;
  /** money needed to start */
  setupCost: number;
  /** months in a year with no work */
  idleMonths: number;
}

export interface ScenarioResult {
  /** money coming in; never to be read as what the family keeps */
  revenue: number;
  /** left in hand in a working month, with the family's own work not paid for */
  left: number;
  /** how many to sell each month to cover its costs; null if each one loses money */
  breakEven: number | null;
  /** months to earn back the starting money, if all goes to plan; null if the year doesn't earn */
  paybackMonths: number | null;
}

export function calcScenario(i: ScenarioInputs): ScenarioResult {
  const keep = 1 - Math.min(Math.max(i.wastagePct, 0), 99) / 100;
  const revenue = i.production * keep * i.price;
  const left = revenue - i.production * i.rawCost - i.other;
  const perPiece = i.price - i.rawCost / keep;
  const working = 12 - Math.min(Math.max(i.idleMonths, 0), 12);
  const yearly = left * working;
  return {
    revenue,
    left,
    breakEven: perPiece > 0 ? Math.ceil(i.other / perPiece) : null,
    paybackMonths: yearly > 0 ? Math.ceil(i.setupCost / (yearly / 12)) : null,
  };
}

/** The family's own numbers, and the same month if only half gets made and sold. */
export function withSlowSales(base: ScenarioInputs) {
  return { planned: calcScenario(base), slow: calcScenario({ ...base, production: base.production / 2 }) };
}

// ---- the ideas

export interface Enterprise {
  id: string;
  emoji: string;
  name: Bi;
  summary: Bi;
  unit: Bi;
  /** rough range of the money needed to start */
  investment: [number, number];
  skills: string[];
  needsSpace: boolean;
  /** 0 to 1: how much of what this needs the family already has; 0 means it can't start */
  rawFit: (a: FarmerAssets) => number;
  rawReason: (a: FarmerAssets) => Bi | null;
  rawBlocker?: Bi;
  needed: Bi[];
  buyers: Bi[];
  steps: Bi[];
  careful: Bi[];
  permissions: Bi[];
  /** schemes in this app worth reading; never a promise of support */
  schemes: string[];
  guess: ScenarioInputs;
}

const STRAW_CROPS = ["wheat", "millet", "sugarcane", "groundnut"];
const FOOD_CROPS = ["mango", "chilli", "onion", "vegetables", "groundnut"];
const FSSAI = bi("Food for sale needs FSSAI registration. Small sellers can usually register for a low fee: check fssai.gov.in or ask your Mitra.", "विक्रीसाठीच्या अन्नाला FSSAI नोंदणी लागते. लहान विक्रेते सहसा कमी शुल्कात नोंदणी करू शकतात: fssai.gov.in पाहा किंवा मित्राला विचारा.");
const LOCAL = bi("Ask your Gram Panchayat if any local permission is needed.", "स्थानिक परवानगी लागते का ते ग्रामपंचायतीत विचारा.");

export const ENTERPRISES: Enterprise[] = [
  {
    id: "vermicompost",
    emoji: "🪱",
    name: bi("Vermicompost (gandul khat)", "गांडूळ खत"),
    summary: bi("Turn dung and farm waste into compost for your own farm and to sell to neighbours.", "शेण व शेतातील कचऱ्यापासून खत बनवा, स्वतःच्या शेतासाठी वापरा व शेजाऱ्यांना विका."),
    unit: bi("kg", "किलो"),
    investment: [5000, 20000],
    skills: ["animals", "tools"],
    needsSpace: true,
    rawFit: (a) => (a.animals.includes("cattle") ? 1 : a.crops.length ? 0.4 : 0.2),
    rawReason: (a) => (a.animals.includes("cattle") ? bi("You have cow or buffalo dung at home.", "तुमच्याकडे घरचे शेण आहे.") : null),
    needed: [bi("A shaded spot and a compost bed or pit", "सावलीची जागा व खत बेड किंवा खड्डा"), bi("Earthworms to begin with", "सुरुवातीसाठी गांडूळ"), bi("Dung, dry leaves and water", "शेण, वाळलेली पाने व पाणी")],
    buyers: [bi("Nearby farmers", "जवळचे शेतकरी"), bi("Vegetable and fruit growers", "भाजीपाला व फळ उत्पादक"), bi("Plant nurseries", "रोपवाटिका")],
    steps: [bi("Make one small bed and use the first batch on your own farm", "एक लहान बेड करा व पहिली खेप स्वतःच्या शेतात वापरा"), bi("Ask 5 neighbours if they would buy, and at what price", "५ शेजाऱ्यांना विचारा: घ्याल का, कोणत्या किमतीला"), bi("Sell the next batch in small bags", "पुढची खेप लहान पिशव्यांत विका"), bi("Add a bed only when buyers ask for more", "खरेदीदार जास्त मागतील तेव्हाच बेड वाढवा")],
    careful: [bi("Worms die in too much heat or too little water", "जास्त उष्णता किंवा कमी पाण्याने गांडूळ मरतात"), bi("A batch takes about 2 to 3 months to be ready", "एक खेप तयार व्हायला साधारण २ ते ३ महिने लागतात")],
    permissions: [LOCAL],
    schemes: ["kcc"],
    guess: { production: 400, price: 10, rawCost: 3, wastagePct: 5, other: 300, setupCost: 10000, idleMonths: 0 },
  },
  {
    id: "home-food",
    emoji: "🫙",
    name: bi("Pickles, papad and chutney from home", "घरगुती लोणची, पापड व चटणी"),
    summary: bi("Make what your family already makes well, and sell small packs nearby.", "तुमच्या घरी जे चांगले बनते ते बनवा व जवळपास लहान पॅकमध्ये विका."),
    unit: bi("pack", "पॅक"),
    investment: [3000, 15000],
    skills: ["food"],
    needsSpace: false,
    rawFit: (a) => (a.crops.some((c) => FOOD_CROPS.includes(c)) ? 1 : 0.6),
    rawReason: (a) => (a.crops.some((c) => FOOD_CROPS.includes(c)) ? bi("You grow something you can use as the main ingredient.", "मुख्य घटक म्हणून वापरता येईल असे पीक तुम्ही घेता.") : null),
    needed: [bi("Clean vessels from your kitchen", "स्वयंपाकघरातील स्वच्छ भांडी"), bi("Jars or pouches and labels", "बरण्या किंवा पिशव्या व लेबल"), bi("A weighing scale", "वजन काटा")],
    buyers: [bi("Neighbours and relatives", "शेजारी व नातेवाईक"), bi("Village shops", "गावातील दुकाने"), bi("Weekly market", "आठवडी बाजार")],
    steps: [bi("Make 20 packs of the one thing you make best", "जे सर्वात चांगले बनते त्याचे २० पॅक बनवा"), bi("Sell to people you know and ask what they think", "ओळखीच्या लोकांना विकून मत विचारा"), bi("Check the FSSAI registration before selling to shops", "दुकानांना विकण्याआधी FSSAI नोंदणी तपासा"), bi("Make more only of what sold out", "जे संपले तेच जास्त बनवा")],
    careful: [bi("Keep everything clean and dry so food doesn’t spoil", "अन्न खराब होऊ नये म्हणून सर्व स्वच्छ व कोरडे ठेवा"), bi("Shops may pay you late", "दुकानदार उशिरा पैसे देऊ शकतात")],
    permissions: [FSSAI],
    schemes: ["pmfme", "umed"],
    guess: { production: 150, price: 60, rawCost: 35, wastagePct: 3, other: 300, setupCost: 6000, idleMonths: 0 },
  },
  {
    id: "home-dairy",
    emoji: "🧈",
    name: bi("Ghee and paneer from your own milk", "घरच्या दुधाचे तूप व पनीर"),
    summary: bi("Keep some of your milk back and make ghee or paneer to sell nearby.", "थोडे दूध बाजूला ठेवून तूप किंवा पनीर बनवा व जवळपास विका."),
    unit: bi("kg", "किलो"),
    investment: [3000, 15000],
    skills: ["food", "animals"],
    needsSpace: false,
    rawFit: (a) => (a.animals.includes("cattle") ? 1 : 0),
    rawReason: (a) => (a.animals.includes("cattle") ? bi("You have your own milk.", "तुमच्याकडे घरचे दूध आहे.") : null),
    rawBlocker: bi("Needs your own cow or buffalo.", "त्यासाठी स्वतःची गाय किंवा म्हैस लागते."),
    needed: [bi("Your own milk", "घरचे दूध"), bi("Clean steel vessels", "स्वच्छ स्टीलची भांडी"), bi("A fridge helps for paneer", "पनीरसाठी फ्रीज उपयोगी")],
    buyers: [bi("Neighbours", "शेजारी"), bi("Sweet shops", "मिठाईची दुकाने"), bi("Small hotels", "लहान हॉटेल")],
    steps: [bi("Find out what your milk buyer pays you now", "सध्या दूध खरेदीदार किती दर देतो ते पाहा"), bi("Make a small batch and sell it to neighbours", "लहान खेप बनवून शेजाऱ्यांना विका"), bi("Compare: did you earn more than selling the milk?", "तुलना करा: दूध विकण्यापेक्षा जास्त मिळाले का?"), bi("Grow only if the answer is yes", "उत्तर हो असेल तरच वाढवा")],
    careful: [bi("Paneer spoils quickly in heat", "उष्णतेत पनीर लवकर खराब होते"), bi("Check you still have enough milk for home", "घरासाठी पुरेसे दूध राहते ना ते पाहा")],
    permissions: [FSSAI],
    schemes: ["pmfme"],
    guess: { production: 30, price: 320, rawCost: 240, wastagePct: 3, other: 300, setupCost: 6000, idleMonths: 0 },
  },
  {
    id: "mushroom",
    emoji: "🍄",
    name: bi("Oyster mushrooms in a small room", "लहान खोलीत धिंगरी अळिंबी"),
    summary: bi("Grow mushrooms on your own crop straw in a shaded room. Good to learn first with a few bags.", "स्वतःच्या पिकाच्या काडावर सावलीच्या खोलीत अळिंबी घ्या. आधी काही पिशव्यांवर शिकणे चांगले."),
    unit: bi("kg", "किलो"),
    investment: [5000, 25000],
    skills: ["food"],
    needsSpace: true,
    rawFit: (a) => (a.crops.some((c) => STRAW_CROPS.includes(c)) ? 0.9 : 0.4),
    rawReason: (a) => (a.crops.some((c) => STRAW_CROPS.includes(c)) ? bi("Your crops give straw you can grow on.", "तुमच्या पिकांचे काड यासाठी वापरता येते.") : null),
    needed: [bi("A clean, shaded room", "स्वच्छ, सावलीची खोली"), bi("Clean dry straw", "स्वच्छ कोरडे काड"), bi("Mushroom seed (spawn) and plastic bags", "अळिंबीचे बियाणे (स्पॉन) व प्लास्टिक पिशव्या")],
    buyers: [bi("Hotels and restaurants", "हॉटेल व उपाहारगृहे"), bi("Vegetable sellers", "भाजी विक्रेते"), bi("Town markets", "शहरातील बाजार")],
    steps: [bi("Learn first: ask your Krishi Vigyan Kendra about training", "आधी शिका: प्रशिक्षणाबद्दल कृषी विज्ञान केंद्रात विचारा"), bi("Find a buyer before you grow", "उत्पादनाआधी खरेदीदार शोधा"), bi("Start with 10 bags", "१० पिशव्यांपासून सुरू करा"), bi("Sell fresh the same day", "त्याच दिवशी ताजे विका")],
    careful: [bi("Fresh mushrooms spoil in a day or two", "ताजी अळिंबी एक-दोन दिवसांत खराब होते"), bi("Many people locally may not buy them, so check first", "स्थानिक लोक घेतीलच असे नाही, आधी तपासा")],
    permissions: [FSSAI],
    schemes: ["pmfme"],
    guess: { production: 40, price: 150, rawCost: 50, wastagePct: 10, other: 500, setupCost: 12000, idleMonths: 2 },
  },
  {
    id: "hens",
    emoji: "🐔",
    name: bi("A few desi hens for eggs", "अंड्यांसाठी काही देशी कोंबड्या"),
    summary: bi("Keep 15 to 20 desi hens in your yard and sell eggs and birds nearby.", "अंगणात १५ ते २० देशी कोंबड्या पाळा व अंडी आणि पक्षी जवळपास विका."),
    unit: bi("egg", "अंडे"),
    investment: [5000, 25000],
    skills: ["animals"],
    needsSpace: true,
    rawFit: (a) => (a.animals.includes("hens") ? 1 : 0.6),
    rawReason: (a) => (a.animals.includes("hens") ? bi("You already keep hens.", "तुमच्याकडे आधीच कोंबड्या आहेत.") : null),
    needed: [bi("A small safe coop", "लहान सुरक्षित खुराडे"), bi("Young birds", "पिल्ले किंवा तरुण पक्षी"), bi("Grain and clean water", "धान्य व स्वच्छ पाणी")],
    buyers: [bi("Neighbours", "शेजारी"), bi("Village shops", "गावातील दुकाने"), bi("Weekly market", "आठवडी बाजार")],
    steps: [bi("Ask a local keeper or vet which birds do well here", "येथे कोणते पक्षी चांगले राहतात ते स्थानिक पालक किंवा पशुवैद्यांना विचारा"), bi("Build a coop safe from dogs and wild cats", "कुत्रे व रानमांजरांपासून सुरक्षित खुराडे बनवा"), bi("Start with 10 birds and get them vaccinated", "१० पक्ष्यांपासून सुरू करा व लसीकरण करा"), bi("Add birds only after you have sold eggs for a while", "काही काळ अंडी विकल्यानंतरच पक्षी वाढवा")],
    careful: [bi("Disease can spread fast, so vaccination matters", "रोग लवकर पसरतो, त्यामुळे लसीकरण महत्त्वाचे"), bi("Hens take months to start laying", "कोंबड्या अंडी द्यायला काही महिने लागतात")],
    permissions: [LOCAL],
    schemes: ["kcc"],
    guess: { production: 300, price: 10, rawCost: 5, wastagePct: 5, other: 200, setupCost: 12000, idleMonths: 0 },
  },
  {
    id: "home-stitching",
    emoji: "🧵",
    name: bi("Stitching from home", "घरून शिवणकाम"),
    summary: bi("Take blouse, uniform and repair orders from your village on one machine.", "एका मशीनवर गावातील ब्लाउज, गणवेश व दुरुस्तीची कामे घ्या."),
    unit: bi("piece", "नग"),
    investment: [5000, 20000],
    skills: ["tailoring"],
    needsSpace: false,
    rawFit: () => 0.8,
    rawReason: () => null,
    needed: [bi("A sewing machine; a used one is fine", "शिलाई मशीन; जुने चालेल"), bi("Thread, scissors and tape", "दोरा, कात्री व टेप")],
    buyers: [bi("Women in the village", "गावातील महिला"), bi("School uniform families", "शाळेच्या गणवेशासाठी कुटुंबे"), bi("Local shops", "स्थानिक दुकाने")],
    steps: [bi("Tell neighbours and show them your work", "शेजाऱ्यांना सांगा व तुमचे काम दाखवा"), bi("Ask around what others in the village charge", "गावात इतर किती दर घेतात ते विचारा"), bi("Borrow or rent a machine before buying one if you can", "शक्य असल्यास विकत घेण्याआधी मशीन उसने किंवा भाड्याने घ्या"), bi("Keep a list of every order and payment", "प्रत्येक काम व पैशाची नोंद ठेवा")],
    careful: [bi("Work may be slow outside school and wedding seasons", "शाळा व लग्न हंगामाबाहेर काम कमी असू शकते")],
    permissions: [LOCAL],
    schemes: ["umed"],
    guess: { production: 60, price: 120, rawCost: 15, wastagePct: 0, other: 200, setupCost: 10000, idleMonths: 1 },
  },
  {
    id: "spray-service",
    emoji: "🎒",
    name: bi("Spraying service with a battery sprayer", "बॅटरी पंपाने फवारणी सेवा"),
    summary: bi("Buy one battery sprayer and spray neighbours’ fields by the acre in the season.", "एक बॅटरी पंप घेऊन हंगामात शेजाऱ्यांच्या शेतात एकरी दराने फवारणी करा."),
    unit: bi("acre", "एकर"),
    investment: [5000, 15000],
    skills: ["tools"],
    needsSpace: false,
    rawFit: (a) => (a.crops.length ? 1 : 0.4),
    rawReason: (a) => (a.crops.length ? bi("Farms around you need spraying in the season.", "तुमच्या आसपासच्या शेतांना हंगामात फवारणी लागते.") : null),
    needed: [bi("A battery sprayer", "बॅटरी पंप"), bi("Gloves, mask and full sleeves", "हातमोजे, मास्क व पूर्ण बाह्यांचे कपडे")],
    buyers: [bi("Nearby farmers, who buy their own medicine", "जवळचे शेतकरी, औषध ते स्वतः घेतात"), bi("Older farmers who can’t carry a pump", "पंप उचलू न शकणारे वयस्कर शेतकरी")],
    steps: [bi("Ask what spraying costs per acre here", "येथे एकरी फवारणीचा दर विचारून घ्या"), bi("Ask 10 farmers if they would book you", "१० शेतकऱ्यांना विचारा: बोलवाल का"), bi("Learn safe spraying from your Krishi Sahayak", "सुरक्षित फवारणी कृषी सहाय्यकाकडून शिका"), bi("Buy the pump only after you have bookings", "काम मिळाल्यावरच पंप घ्या")],
    careful: [bi("Spray can harm you: always wear protection", "फवारणीचे औषध हानिकारक असते: नेहमी सुरक्षा साधने वापरा"), bi("Work comes only in the crop season", "काम फक्त पीक हंगामात असते")],
    permissions: [LOCAL],
    schemes: ["kcc"],
    guess: { production: 40, price: 250, rawCost: 30, wastagePct: 0, other: 200, setupCost: 8000, idleMonths: 6 },
  },
];

export const enterpriseById = (id: string) => ENTERPRISES.find((e) => e.id === id);

// ---- matching ideas to the family

const WEIGHTS = { raw: 25, buyers: 25, money: 25, skill: 15, space: 10 };

export type Fit = "good" | "possible";

export interface Recommendation {
  enterprise: Enterprise;
  score: number;
  fit: Fit;
  reasons: Bi[];
  /** what the family should ask or find out next */
  toFind: Bi[];
  /** reasons this idea can't start as things stand */
  blockers: Bi[];
}

function assess(e: Enterprise, a: FarmerAssets): Recommendation {
  const reasons: Bi[] = [];
  const toFind: Bi[] = [];
  const blockers: Bi[] = [];

  const raw = e.rawFit(a);
  const rawReason = e.rawReason(a);
  if (rawReason) reasons.push(rawReason);
  if (raw === 0 && e.rawBlocker) blockers.push(e.rawBlocker);

  const asked = a.buyersSpokenTo ?? 0;
  const buyers = asked >= 5 ? 1 : asked >= 1 ? 0.6 : 0.2;
  if (asked > 0) reasons.push(bi(`You have already spoken to ${asked} possible buyers.`, `तुम्ही ${asked} संभाव्य खरेदीदारांशी आधीच बोललात.`));
  else toFind.push(bi("Ask a few people if they would buy this", "हे घ्याल का ते काही लोकांना विचारा"));

  const [low, high] = e.investment;
  let money = 0.5;
  if (a.capital !== null) {
    if (a.capital < low) {
      money = 0;
      blockers.push(bi(`Needs about ₹${low.toLocaleString("en-IN")} to start.`, `सुरू करायला साधारण ₹${low.toLocaleString("en-IN")} लागतील.`));
    } else {
      money = a.capital >= high ? 1 : 0.7;
      reasons.push(bi("You can start this with the money you have.", "तुमच्याकडील पैशांत हे सुरू करता येते."));
    }
  }

  const known = e.skills.some((s) => a.skills.includes(s));
  if (known) reasons.push(bi("You already know this kind of work.", "या प्रकारचे काम तुम्हाला आधीच येते."));
  else toFind.push(bi("Learn this work from someone first", "आधी कोणाकडून तरी हे काम शिका"));

  if (e.needsSpace && a.space === "no") blockers.push(bi("Needs a small place at home.", "त्यासाठी घरी थोडी जागा लागते."));
  const space = !e.needsSpace || a.space === "yes" ? 1 : a.space === "no" ? 0 : 0.5;

  const score = Math.round(raw * WEIGHTS.raw + buyers * WEIGHTS.buyers + money * WEIGHTS.money + (known ? 1 : 0.2) * WEIGHTS.skill + space * WEIGHTS.space);
  return { enterprise: e, score, fit: score >= 60 ? "good" : "possible", reasons, toFind, blockers };
}

/** The best three ideas the family could start, and the rest with what stops them. */
export function discover(assets: FarmerAssets): { top: Recommendation[]; others: Recommendation[] } {
  const all = ENTERPRISES.map((e) => assess(e, assets)).sort((a, b) => b.score - a.score);
  const top = all.filter((r) => r.blockers.length === 0).slice(0, 3);
  return { top, others: all.filter((r) => !top.includes(r)) };
}

// ---- what the farmer keeps

export interface EnterpriseRecord {
  assets: FarmerAssets | null;
  /** the farmer's own numbers for each idea */
  ideas: Record<string, ScenarioInputs>;
}

export const EMPTY_RECORD: EnterpriseRecord = { assets: null, ideas: {} };
