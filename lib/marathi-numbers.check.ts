// Assertion checks for lib/marathi-numbers.ts. No test runner or extra dependency needed:
//   npm run check:marathi
import assert from "node:assert/strict";
import { fmtNum, numberToMarathiWords, ordinalMr, spokenNumber, toAsciiDigits, toDevanagariDigits, toSpokenMarathi } from "./marathi-numbers.ts";

const NOW = new Date(2026, 10, 2); // 2 Nov 2026, so 2026 is "this year"
let n = 0;
const eq = (actual: string, expected: string, label = expected) => {
  assert.equal(actual, expected, label);
  n++;
};

// words: integers
eq(numberToMarathiWords(0), "शून्य");
eq(numberToMarathiWords(7), "सात");
eq(numberToMarathiWords(19), "एकोणीस");
eq(numberToMarathiWords(45), "पंचेचाळीस");
eq(numberToMarathiWords(99), "नव्व्याण्णव");
eq(numberToMarathiWords(100), "शंभर");
eq(numberToMarathiWords(101), "एकशे एक");
eq(numberToMarathiWords(105), "एकशे पाच");
eq(numberToMarathiWords(150), "एकशे पन्नास");
eq(numberToMarathiWords(200), "दोनशे");
eq(numberToMarathiWords(900), "नऊशे");
eq(numberToMarathiWords(999), "नऊशे नव्व्याण्णव");
eq(numberToMarathiWords(1000), "एक हजार");
eq(numberToMarathiWords(1551), "एक हजार पाचशे एक्कावन्न");
eq(numberToMarathiWords(2500), "दोन हजार पाचशे");
eq(numberToMarathiWords(25000), "पंचवीस हजार");
eq(numberToMarathiWords(125000), "एक लाख पंचवीस हजार");
eq(numberToMarathiWords(12500000), "एक कोटी पंचवीस लाख");
eq(numberToMarathiWords(2026), "दोन हजार सव्वीस");

// words: fractions and decimals
eq(spokenNumber("0.25"), "पाव");
eq(spokenNumber("0.5"), "अर्धा");
eq(spokenNumber("0.75"), "पाऊण");
eq(spokenNumber("1.25"), "सव्वा");
eq(spokenNumber("1.5"), "दीड");
eq(spokenNumber("2.5"), "अडीच");
eq(spokenNumber("3.5"), "साडेतीन");
eq(spokenNumber("2.25"), "सव्वा दोन");
eq(spokenNumber("2.75"), "पावणेतीन");
eq(spokenNumber("12.37"), "बारा पूर्णांक तीन सात");
eq(spokenNumber("1,25,000"), "एक लाख पंचवीस हजार");

// ordinals
eq(ordinalMr(1), "पहिला");
eq(ordinalMr(12), "बारावा");
eq(ordinalMr(20), "विसावा");
eq(ordinalMr(45), "पंचेचाळिसावा");
eq(ordinalMr(50), "पन्नासावा");
eq(ordinalMr(90), "नव्वदावा");

// display digits
eq(toDevanagariDigits("12.5"), "१२.५");
eq(toAsciiDigits("४५"), "45");
eq(fmtNum("mr", 125000), "१,२५,०००");
eq(fmtNum("en", 125000), "1,25,000");

// sentences: the acceptance examples
const sp = (s: string) => toSpokenMarathi(s, NOW);
eq(sp("45 दिवस"), "पंचेचाळीस दिवस");
eq(sp("४५ दिवस"), "पंचेचाळीस दिवस", "Devanagari input");
eq(sp("₹30/क्विंटल"), "तीस रुपये प्रति क्विंटल");
eq(sp("₹30/qtl"), "तीस रुपये प्रति क्विंटल");
eq(sp("₹2,500"), "दोन हजार पाचशे रुपये");
eq(sp("Rs 2500"), "दोन हजार पाचशे रुपये");
eq(sp("1.5 एकर"), "दीड एकर");
eq(sp("1.5 acre"), "दीड एकर");
eq(sp("12–25 मार्च"), "बारा ते पंचवीस मार्च");
eq(sp("12-25 days"), "बारा ते पंचवीस दिवस");
eq(sp("१२ ते २५ दिवस"), "बारा ते पंचवीस दिवस");
eq(sp("86%"), "शहाऐंशी टक्के");
eq(sp("3 kg"), "तीन किलो");
eq(sp("500 ml"), "पाचशे मिली");
eq(sp("200 L"), "दोनशे लिटर");
eq(sp("15 cm"), "पंधरा सेंटिमीटर");
eq(sp("75 mm"), "पंच्याहत्तर मिलिमीटर");
eq(sp("2 ha"), "दोन हेक्टर");
eq(sp("30°C"), "तीस अंश सेल्सिअस");
eq(sp("24 hours"), "चोवीस तास");
eq(sp("2026-03-12"), "बारा मार्च", "ISO date, current year dropped");
eq(sp("2027-03-12"), "बारा मार्च दोन हजार सत्तावीस", "ISO date, other year kept");
eq(sp("12 Mar 2026"), "बारा मार्च");
eq(sp("१२ मार्च, २०२६"), "बारा मार्च", "Intl Marathi date");
eq(sp("८ नोव्हें"), "आठ नोव्हेंबर", "short Marathi month");
eq(sp("1800-180-1551"), "एक आठ शून्य शून्य एक आठ शून्य एक पाच पाच एक", "helpline digit by digit");
eq(sp("9876500001"), "नऊ आठ सात सहा पाच शून्य शून्य शून्य शून्य एक", "phone digit by digit");
eq(sp("KVK ला विचारा"), "कृषी विज्ञान केंद्र ला विचारा");
eq(sp("N-2-4-1 वाण"), "N-दोन-चार-एक वाण", "variety code is not a range");
eq(sp("- पाणी द्या\n- तण काढा"), "पाणी द्या। तण काढा", "list → sentences");
eq(sp("दिवस 90 · पानांची वाढ"), "दिवस नव्वद · पानांची वाढ");

eq(sp("पेरणी ऑक्टोबर–नोव्हेंबर"), "पेरणी ऑक्टोबर ते नोव्हेंबर", "month range in words");
eq(sp("ओळींत 15 सेंमी"), "ओळींत पंधरा सेंटिमीटर", "Marathi cm abbreviation");
eq(sp("₹30/क्विं."), "तीस रुपये प्रति क्विंटल", "short quintal");
eq(sp("जमीन — मध्यम"), "जमीन, मध्यम", "spaced dash is a pause");
eq(sp("एकरी 3–4 किलो"), "एकरी तीन ते चार किलो");
eq(sp("2027-01-01 ते 2027-01-21"), "एक जानेवारी ते एकवीस जानेवारी दोन हजार सत्तावीस", "shared year said once");

console.log(`✓ ${n} Marathi number checks passed`);
