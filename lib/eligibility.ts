import type { Account } from "./account";
import { bi, type Bi } from "./i18n";

export type EligibilityStatus = "eligible" | "check_needed" | "ineligible";

export interface EligibilityQuestion {
  id: string;
  question: Bi;
  hint: Bi;
  positiveAnswer: boolean; // answer that makes them eligible
}

export interface SchemeEligibilityResult {
  status: EligibilityStatus;
  label: Bi;
  matchedCriteria: Bi[];
  unmatchedCriteria: Bi[];
  questions: EligibilityQuestion[];
  applyUrl: string;
  applyPortalName: Bi;
}

export const SCHEME_QUESTIONS: Record<string, EligibilityQuestion[]> = {
  "pm-kisan": [
    {
      id: "pmkisan_712",
      question: bi("Do you have 7/12 land extract in your name with e-KYC done?", "तुमच्या नावावर 7/12 उतारा असून ई-केवायसी पूर्ण आहे का?"),
      hint: bi("Required for direct bank transfer into farmer's account", "थेट बँक खात्यात अनुदान जमा होण्यासाठी आवश्यक"),
      positiveAnswer: true,
    },
    {
      id: "pmkisan_tax",
      question: bi("Do you or your spouse pay income tax?", "तुम्ही किंवा तुमचे जोडीदार आयकर भरता का?"),
      hint: bi("Income tax payers are excluded under PM-KISAN guidelines", "आयकर भरणारे शेतकरी नियमानुसार अपात्र ठरतात"),
      positiveAnswer: false, // No means eligible!
    },
  ],
  "namo-shetkari": [
    {
      id: "namo_pmkisan_beneficiary",
      question: bi("Are you an approved beneficiary of PM-KISAN?", "तुम्ही पीएम-किसानचे मंजूर लाभार्थी आहात का?"),
      hint: bi("Maharashtra's ₹6,000 top-up is credited to approved PM-KISAN farmers", "महाराष्ट्राचे अतिरिक्त ₹6,000 फक्त पीएम-किसान पात्र शेतकऱ्यांना मिळतात"),
      positiveAnswer: true,
    },
  ],
  "pmfby": [
    {
      id: "pmfby_sowing",
      question: bi("Have you sown or plan to sow notified crops (Onion, Tomato, Soybean, Cotton)?", "तुम्ही चालू हंगामात अधिसूचित पिके (कांदा, टोमॅटो, सोयाबीन, कापूस) पेरली आहेत का?"),
      hint: bi("Insurance covers notified food grains, oilseeds and commercial/horticultural crops", "अधिसूचित अन्नधान्य, तेलबिया व नगदी पिकांना विमा संरक्षण मिळते"),
      positiveAnswer: true,
    },
  ],
  "pmksy-pdmc": [
    {
      id: "pmksy_water_source",
      question: bi("Do you have a functional water source (well, borewell, canal, or farm pond)?", "शेतजमिनीत विहीर, बोअरवेल, कालवा किंवा शेततळे असा पाण्याचा स्रोत आहे का?"),
      hint: bi("Micro-irrigation subsidy requires an assured water supply", "ठिबक किंवा तुषार सिंचनासाठी पाण्याची उपलब्धता आवश्यक असते"),
      positiveAnswer: true,
    },
    {
      id: "pmksy_electricity",
      question: bi("Do you have an electric or solar pump connection for irrigation?", "सिंचनासाठी वीज पंप किंवा सौर कृषी पंप जोडणी आहे का?"),
      hint: bi("Needed to connect and operate drip/sprinkler pressure systems", "ठिबक संच चालवण्यासाठी दाबाने पाणी देणारी यंत्रणा हवी"),
      positiveAnswer: true,
    },
  ],
  "kcc": [
    {
      id: "kcc_bank_account",
      question: bi("Do you have an active savings bank account in a local bank branch?", "स्थानिक बँकेत तुमचे नियमित चालू किंवा बचत खाते आहे का?"),
      hint: bi("KCC credit limit is sanctioned by the bank branch serving your village", "गावाला सेवा देणाऱ्या बँक शाखेकडून किसान क्रेडिट कार्ड दिले जाते"),
      positiveAnswer: true,
    },
  ],
  "pmfme": [
    {
      id: "pmfme_processing_intent",
      question: bi("Do you plan to start or expand food processing (e.g. Tomato puree, dehydrated onion, flour, pickle)?", "तुम्ही शेतमालावर प्रक्रिया (उदा. टोमॅटो पल्प, सुका कांदा, पीठ, लोणचे) सुरू करू इच्छिता का?"),
      hint: bi("Scheme provides 35% credit-linked capital subsidy up to ₹10 Lakh", "प्रकल्प खर्चावर ३५% (जास्तीत जास्त १० लाख रुपये) अनुदान मिळते"),
      positiveAnswer: true,
    },
  ],
  "umed": [
    {
      id: "umed_shg_member",
      question: bi("Are you an active member of a women's Self Help Group (Bachat Gat)?", "तुम्ही महिला बचत गटाच्या सक्रिय सदस्य आहात का?"),
      hint: bi("UMED provides revolving funds and low-interest credit through SHGs", "उमेद योजनेतून बचत गटांमार्फत फिरता निधी व सुलभ कर्ज मिळते"),
      positiveAnswer: true,
    },
  ],
};

export const SCHEME_APPLY_INFO: Record<string, { url: string; portal: Bi }> = {
  "pm-kisan": {
    url: "https://pmkisan.gov.in",
    portal: bi("PM-KISAN Official Portal", "पीएम-किसान अधिकृत पोर्टल"),
  },
  "namo-shetkari": {
    url: "https://krishi.maharashtra.gov.in",
    portal: bi("MahaDBT Agriculture Portal", "महाडीबीटी कृषी पोर्टल"),
  },
  "pmfby": {
    url: "https://pmfby.gov.in",
    portal: bi("Pradhan Mantri Fasal Bima Portal", "राष्ट्रीय पीक विमा पोर्टल"),
  },
  "pmksy-pdmc": {
    url: "https://mahadbt.maharashtra.gov.in",
    portal: bi("MahaDBT Micro-Irrigation", "महाडीबीटी ठिबक सिंचन अर्ज"),
  },
  "kcc": {
    url: "https://www.myscheme.gov.in/schemes/kcc",
    portal: bi("MyScheme Kisan Credit Card", "मायस्कीम केसीसी पोर्टल"),
  },
  "pmfme": {
    url: "https://pmfme.mofpi.gov.in",
    portal: bi("PMFME National Portal", "पीएमएफएमई अधिकृत पोर्टल"),
  },
  "umed": {
    url: "https://umed.in",
    portal: bi("UMED Maharashtra Portal", "उमेद महाराष्ट्र पोर्टल"),
  },
};

export function evaluateSchemeEligibility(
  schemeId: string,
  account: Account | null,
  userAnswers: Record<string, boolean> = {}
): SchemeEligibilityResult {
  const applyInfo = SCHEME_APPLY_INFO[schemeId] || {
    url: "https://mahadbt.maharashtra.gov.in",
    portal: bi("MahaDBT Maharashtra", "महाडीबीटी महाराष्ट्र"),
  };

  const matchedCriteria: Bi[] = [];
  const unmatchedCriteria: Bi[] = [];
  const questions = SCHEME_QUESTIONS[schemeId] || [];

  const acres = (Number(account?.landOwnedAcres) || 0) + (Number(account?.landLeasedAcres) || 0);
  const isWomanOrSHG = account?.gender === "female" || account?.shgMember === true;
  const hasIrrigation = (account?.irrigation || []).length > 0;
  const hasCrops = (account?.crops || []).length > 0;

  // 1. Hard ineligibility checks based on login/signup data
  if (schemeId === "umed" && account && account.gender === "male" && !account.shgMember) {
    unmatchedCriteria.push(
      bi("Scheme exclusively for rural women farmers and SHG members", "ही योजना केवळ ग्रामीण महिला शेतकरी व बचत गट सदस्यांसाठी आहे")
    );
    return {
      status: "ineligible",
      label: bi("Not Eligible", "अपात्र"),
      matchedCriteria,
      unmatchedCriteria,
      questions: [],
      applyUrl: applyInfo.url,
      applyPortalName: applyInfo.portal,
    };
  }

  // 2. Base criteria matches from registration
  if (account) {
    if (acres > 0) {
      matchedCriteria.push(
        bi(`Registered landholder (${acres} acres land recorded)`, `नोंदणीकृत जमीनधारक (एकूण ${acres} एकर जमीन)`)
      );
    }
    if (account.district) {
      matchedCriteria.push(
        bi(`Resident of Maharashtra (${account.district} district)`, `महाराष्ट्राचे रहिवासी (${account.district} जिल्हा)`)
      );
    }
    if (hasCrops) {
      matchedCriteria.push(
        bi(`Cultivating notified crops (${account.crops.slice(0, 3).join(", ")})`, `अधिसूचित पिके घेणारे शेतकरी (${account.crops.slice(0, 3).join(", ")})`)
      );
    }
    if (hasIrrigation) {
      matchedCriteria.push(
        bi(`Assured irrigation source (${account.irrigation.join(", ")})`, `सिंचन सुविधा उपलब्ध (${account.irrigation.join(", ")})`)
      );
    }
    if (isWomanOrSHG) {
      matchedCriteria.push(
        bi("Woman farmer / SHG representative preference", "महिला शेतकरी / बचत गट प्राधान्य")
      );
    }
  }

  // 3. Check extra interactive questions
  const unanswered = questions.filter((q) => userAnswers[q.id] === undefined);
  const failedQuestions = questions.filter(
    (q) => userAnswers[q.id] !== undefined && userAnswers[q.id] !== q.positiveAnswer
  );

  if (failedQuestions.length > 0) {
    failedQuestions.forEach((q) => {
      unmatchedCriteria.push(q.hint);
    });
    return {
      status: "ineligible",
      label: bi("Not Eligible", "अपात्र"),
      matchedCriteria,
      unmatchedCriteria,
      questions,
      applyUrl: applyInfo.url,
      applyPortalName: applyInfo.portal,
    };
  }

  if (unanswered.length > 0) {
    return {
      status: "check_needed",
      label: bi("Check For Me", "माझ्यासाठी तपासा"),
      matchedCriteria,
      unmatchedCriteria,
      questions: unanswered,
      applyUrl: applyInfo.url,
      applyPortalName: applyInfo.portal,
    };
  }

  // All criteria and answers matched!
  return {
    status: "eligible",
    label: bi("Eligible — Apply Here", "पात्र — येथे अर्ज करा"),
    matchedCriteria,
    unmatchedCriteria: [],
    questions: [],
    applyUrl: applyInfo.url,
    applyPortalName: applyInfo.portal,
  };
}
