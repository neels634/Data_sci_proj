"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Lock, Store } from "lucide-react";
import { buyerById, useStore } from "@/lib/store";
import { CURRENT_BUYER_ID } from "@/lib/data";
import { Button, Card, Empty, Field, PageHeader, cx, inputCls, rupees } from "@/components/ui";
import { Input, TextArea } from "@/components/voice";

export default function EnterpriseDetail() {
  const { id } = useParams<{ id: string }>();
  const { state, l, tx, sendEnquiry, isMine } = useStore();
  const e = state.enterprises.find((x) => x.id === id);
  const buyerName = state.role === "buyer" ? buyerById(CURRENT_BUYER_ID)?.name : undefined;
  const [from, setFrom] = useState<string | null>(null); // null = use the signed-in buyer's name
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);

  if (!e) return <Empty icon={<Store size={32} />} title={l("Enterprise not found", "उद्योग सापडला नाही")} body={l("It may have been removed.", "तो काढून टाकला असू शकतो.")} />;

  const shownFrom = from ?? tx(buyerName);
  const submit = () => {
    if (!shownFrom.trim() || msg.trim().length < 10)
      return setErr(l("Add your business name and a message of at least 10 characters.", "तुमच्या व्यवसायाचे नाव व किमान 10 अक्षरांचा संदेश लिहा."));
    setErr("");
    sendEnquiry(e.id, from === null && buyerName ? buyerName : shownFrom.trim(), msg.trim());
    setMsg("");
    setSent(true);
  };

  return (
    <div>
      <PageHeader back="/women" title={tx(e.name)} sub={`${tx(e.group)} · ${l(`${e.members} members`, `${e.members} सदस्या`)} · ${tx(e.village)}`} />
      <Card className="bg-leaf-50 text-[15px]">{tx(e.story)}</Card>

      <h2 className="mb-2 mt-5 text-lg font-bold">{l("Products", "उत्पादने")}</h2>
      <div className="grid grid-cols-2 gap-2">
        {e.products.map((p, i) => (
          <Card key={i}>
            <p className="font-bold">{tx(p.name)}</p>
            <p className="text-sm text-muted">{tx(p.unit)}</p>
            <p className="mt-1 text-lg font-bold text-leaf-900">{rupees(p.price)}</p>
          </Card>
        ))}
      </div>
      <p className="mt-1 text-xs text-muted">{l("Prices set by the group.", "किमती गटाने ठरवल्या आहेत.")}</p>

      {!isMine(e) && (
        <Card className="mt-5">
          <p className="font-bold">{l("Send an enquiry", "चौकशी पाठवा")}</p>
          <p className="mb-3 flex items-center gap-1.5 text-sm text-muted">
            <Lock size={14} /> {l("The group’s phone number is never shown. They reply through Shet Samruddhi.", "गटाचा फोन नंबर कधीही दाखवला जात नाही. ते शेत समृद्धीमार्फत उत्तर देतात.")}
          </p>
          {sent ? (
            <div className="rounded-xl bg-leaf-100 p-3 text-leaf-900">
              <p className="font-semibold">{l("Enquiry sent.", "चौकशी पाठवली.")}</p>
              <p className="text-sm">{l("The group will see it in their enquiries list.", "गटाला ती त्यांच्या चौकशी यादीत दिसेल.")}</p>
              <Button variant="ghost" className="mt-1 min-h-10 px-0" onClick={() => setSent(false)}>
                {l("Send another", "आणखी एक पाठवा")}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Field label={l("Your business name", "तुमच्या व्यवसायाचे नाव")}>
                <Input className={inputCls} value={shownFrom} onChange={(ev) => setFrom(ev.target.value)} />
              </Field>
              <Field label={l("Message", "संदेश")} hint={l("Quantity, how often, and delivery location.", "प्रमाण, किती वेळा आणि कुठे पोहोचवायचे.")}>
                <TextArea
                  className={cx(inputCls, "min-h-24 py-2")}
                  value={msg}
                  onChange={(ev) => setMsg(ev.target.value)}
                  placeholder={l("e.g. 50 jars per month, delivered to Pune", "उदा. दरमहा 50 बरण्या, पुण्यात पोहोच")}
                />
              </Field>
              {err && <p className="text-sm font-semibold text-soil">{err}</p>}
              <Button full onClick={submit}>
                {l("Send enquiry", "चौकशी पाठवा")}
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
