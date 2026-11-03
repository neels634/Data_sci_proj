"use client";

import { Mic, Phone, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { CURRENT_MITRA } from "@/lib/data";
import { bi } from "@/lib/i18n";
import { ROLE_HOME } from "@/components/AppShell";
import { Button, Card, PageHeader, SectionTitle } from "@/components/ui";
import { VoiceCheck } from "@/components/speech";

const TERMS = [
  [
    bi("Mandi Mitra", "मंडी मित्र"),
    bi(
      "A trained person from your village who helps you find buyers, pool produce and arrange transport, for a fee shown upfront.",
      "तुमच्या गावातील प्रशिक्षित व्यक्ती, जी आधी सांगितलेल्या शुल्कात खरेदीदार शोधणे, माल एकत्र करणे व वाहतूक व्यवस्था करण्यास मदत करते.",
    ),
  ],
  [
    bi("Aggregation", "एकत्रीकरण"),
    bi(
      "Combining small quantities from several farmers into one lot, so buyers and transport cost less per quintal.",
      "अनेक शेतकऱ्यांचा थोडा माल एका लॉटमध्ये एकत्र करणे, ज्यामुळे क्विंटलमागे खर्च कमी होतो.",
    ),
  ],
  [bi("Grade", "श्रेणी"), bi("Quality class of produce (A, B, C) based on size, colour and damage. Checked at weighing.", "आकार, रंग व खराबीवरून ठरणारा मालाचा दर्जा (अ, ब, क). वजनाच्या वेळी तपासला जातो.")],
  [bi("Commission / service fee", "कमिशन / सेवा शुल्क"), bi("What the Mitra charges per quintal. Always shown before you accept an offer.", "मित्र प्रति क्विंटल घेत असलेले शुल्क. ऑफर स्वीकारण्यापूर्वी नेहमी दाखवले जाते.")],
  [bi("Indicative price", "अंदाजे किंमत"), bi("A guide price, not a promise. The final amount depends on weight, grade and the buyer.", "मार्गदर्शक किंमत, हमी नाही. अंतिम रक्कम वजन, श्रेणी व खरेदीदारावर अवलंबून असते.")],
  [bi("Value addition", "मूल्यवर्धन"), bi("Turning a raw crop into a product worth more — for example mango into pickle.", "कच्च्या पिकापासून जास्त किमतीचे उत्पादन बनवणे — उदा. आंब्यापासून लोणचे.")],
  [bi("SHG", "बचत गट"), bi("Self-Help Group — a group of 10–20 women who save together, take loans and can run a business.", "स्वयं-सहाय्यता गट — एकत्र बचत करणाऱ्या, कर्ज घेणाऱ्या व व्यवसाय चालवू शकणाऱ्या 10–20 महिलांचा गट.")],
];

export default function Help() {
  const { state, l, tx, toast } = useStore();
  return (
    <div>
      <PageHeader back={ROLE_HOME[state.role]} title={l("Help", "मदत")} sub={l("Ask your Mandi Mitra or field coordinator any time.", "तुमच्या मंडी मित्राला किंवा क्षेत्र समन्वयकाला कधीही विचारा.")} />
      <Card className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-full bg-leaf-700 font-bold text-white">{l("GS", "गशि")}</span>
        <div className="flex-1">
          <p className="font-bold">{tx(CURRENT_MITRA)}</p>
          <p className="text-sm text-muted">{l("Mandi Mitra · can fill forms for you", "मंडी मित्र · तुमचे फॉर्म भरून देऊ शकतात")}</p>
        </div>
        <Button className="min-h-11 px-3" onClick={() => toast({ en: "This will call your Mitra in the full app", mr: "पूर्ण ॲपमध्ये यातून तुमच्या मित्राला फोन लागेल" })}>
          <Phone size={18} /> {l("Call", "फोन")}
        </Button>
      </Card>

      <div className="mt-4 flex gap-3 rounded-2xl bg-leaf-50 p-4 text-leaf-900">
        <Mic className="shrink-0" />
        <div className="text-[15px]">
          <p className="font-bold">{l("Speak instead of typing", "टाइप करण्याऐवजी बोला")}</p>
          <p>
            {l(
              "Tap the green mic in any box, speak, and your words are written for you. It listens in the language you chose (Marathi or English). Allow the microphone when your phone asks. Works best in Chrome with internet.",
              "कोणत्याही चौकटीतील हिरवा माइक दाबा आणि बोला — तुमचे शब्द आपोआप लिहिले जातील. तुम्ही निवडलेल्या भाषेत (मराठी किंवा इंग्रजी) ऐकते. फोनने विचारल्यास मायक्रोफोनला परवानगी द्या. Chrome मध्ये इंटरनेटसह उत्तम चालते.",
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-3 rounded-2xl bg-soil-100 p-4 text-[#7a3519]">
        <ShieldCheck className="shrink-0" />
        <p className="text-[15px]">
          <b>{l("Stay safe.", "सावध राहा.")}</b>{" "}
          {l(
            "Shet Samruddhi and your Mitra will never ask for your OTP, password, bank PIN or an advance payment to “approve” a scheme.",
            "शेत समृद्धी किंवा तुमचा मित्र योजना ‘मंजूर’ करण्यासाठी कधीही OTP, पासवर्ड, बँक PIN किंवा आगाऊ पैसे मागणार नाही.",
          )}
        </p>
      </div>

      <SectionTitle>{l("Read aloud", "वाचून दाखवणे")}</SectionTitle>
      <Card>
        <VoiceCheck />
      </Card>

      <SectionTitle>{l("Words explained", "शब्दांचे अर्थ")}</SectionTitle>
      <div className="space-y-2">
        {TERMS.map(([w, m]) => (
          <details key={w.en} className="rounded-2xl border border-line bg-white p-4">
            <summary className="cursor-pointer list-none font-bold">{tx(w)}</summary>
            <p className="mt-2 text-[15px] text-muted">{tx(m)}</p>
          </details>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted">
        {l(
          "Shet Samruddhi is not a government service. Scheme information links to official sources; always confirm details there.",
          "शेत समृद्धी ही शासकीय सेवा नाही. योजनांची माहिती अधिकृत स्रोतांशी जोडलेली आहे; तपशील तिथे नक्की तपासा.",
        )}
      </p>
    </div>
  );
}
