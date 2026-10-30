"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { keepText } from "@/lib/i18n";
import { Button, Field, PageHeader, cx, inputCls } from "@/components/ui";

type ProductRow = { name: string; unit: string; price: number };

export default function EnterpriseProfile() {
  const { state, l, tx, saveEnterprise, isMine } = useStore();
  const router = useRouter();
  const existing = state.enterprises.find(isMine);
  const [f, setF] = useState({
    name: tx(existing?.name),
    group: tx(existing?.group),
    members: existing ? String(existing.members) : "",
    village: tx(existing?.village ?? state.profile.village),
    story: tx(existing?.story),
    consentToShowcase: existing?.consentToShowcase ?? false,
  });
  const [products, setProducts] = useState<ProductRow[]>(
    existing?.products.map((p) => ({ name: tx(p.name), unit: tx(p.unit), price: p.price })) ?? [{ name: "", unit: "", price: 0 }],
  );
  const [err, setErr] = useState("");

  const setP = (i: number, patch: Partial<ProductRow>) => setProducts(products.map((p, j) => (j === i ? { ...p, ...patch } : p)));

  const save = () => {
    const valid = products.filter((p) => p.name.trim() && p.price > 0);
    if (!f.name.trim() || !f.group.trim()) return setErr(l("Enter the enterprise name and group name.", "उद्योगाचे व गटाचे नाव लिहा."));
    if (!valid.length) return setErr(l("Add at least one product with a price.", "किमान एक उत्पादन किमतीसह जोडा."));
    saveEnterprise({
      name: f.name.trim(),
      group: f.group.trim(),
      members: Number(f.members) || 1,
      village: keepText(f.village, state.profile.village),
      story: f.story.trim(),
      products: valid,
      consentToShowcase: f.consentToShowcase,
    });
    router.push("/women");
  };

  return (
    <div>
      <PageHeader
        back="/women"
        title={existing ? l("Edit enterprise profile", "उद्योग प्रोफाइल बदला") : l("Create enterprise profile", "उद्योग प्रोफाइल तयार करा")}
        sub={l("Buyers see this profile. Your phone number is never shown.", "हे प्रोफाइल खरेदीदारांना दिसते. तुमचा फोन नंबर कधीही दाखवला जात नाही.")}
      />
      <div className="space-y-4">
        <Field label={l("Enterprise / brand name", "उद्योग / ब्रँडचे नाव")}>
          <input className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder={l("e.g. Sunita Foods", "उदा. सुनीता फूड्स")} />
        </Field>
        <Field label={l("SHG or group name", "बचत गट / गटाचे नाव")}>
          <input className={inputCls} value={f.group} onChange={(e) => setF({ ...f, group: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={l("Members", "सदस्य संख्या")}>
            <input inputMode="numeric" className={inputCls} value={f.members} onChange={(e) => setF({ ...f, members: e.target.value })} />
          </Field>
          <Field label={l("Village", "गाव")}>
            <input className={inputCls} value={f.village} onChange={(e) => setF({ ...f, village: e.target.value })} />
          </Field>
        </div>
        <Field label={l("About your enterprise", "तुमच्या उद्योगाबद्दल")} hint={l("What you make and what kind of buyers you want.", "तुम्ही काय बनवता आणि कोणते खरेदीदार हवे आहेत.")}>
          <textarea className={cx(inputCls, "min-h-24 py-2")} value={f.story} onChange={(e) => setF({ ...f, story: e.target.value })} />
        </Field>

        <fieldset>
          <legend className="mb-2 text-[15px] font-semibold">{l("Products", "उत्पादने")}</legend>
          <div className="space-y-2">
            {products.map((p, i) => (
              <div key={i} className="rounded-xl border border-line bg-white p-3">
                <div className="flex gap-2">
                  <input aria-label={l("Product name", "उत्पादनाचे नाव")} className={cx(inputCls, "flex-1")} placeholder={l("Product", "उत्पादन")} value={p.name} onChange={(e) => setP(i, { name: e.target.value })} />
                  {products.length > 1 && (
                    <button onClick={() => setProducts(products.filter((_, j) => j !== i))} className="grid size-12 place-items-center text-soil" aria-label={l("Remove product", "उत्पादन काढा")}>
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input aria-label={l("Pack size", "पॅकचा आकार")} className={inputCls} placeholder={l("Pack, e.g. 500 g jar", "पॅक, उदा. 500 ग्रॅम बरणी")} value={p.unit} onChange={(e) => setP(i, { unit: e.target.value })} />
                  <input aria-label={l("Price", "किंमत")} inputMode="numeric" className={inputCls} placeholder={l("Price ₹", "किंमत ₹")} value={p.price || ""} onChange={(e) => setP(i, { price: Number(e.target.value) || 0 })} />
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="mt-1" onClick={() => setProducts([...products, { name: "", unit: "", price: 0 }])}>
            <Plus size={18} /> {l("Add product", "उत्पादन जोडा")}
          </Button>
        </fieldset>

        <label className="flex items-start gap-3 rounded-xl bg-leaf-50 p-3 text-sm">
          <input type="checkbox" className="mt-0.5 size-5 accent-leaf-700" checked={f.consentToShowcase} onChange={(e) => setF({ ...f, consentToShowcase: e.target.checked })} />
          <span>{l("All members agree to show this profile and our story to buyers and other users on Shet Samruddhi.", "हे प्रोफाइल व आमची माहिती शेत समृद्धीवरील खरेदीदार व इतरांना दाखवण्यास सर्व सदस्यांची संमती आहे.")}</span>
        </label>

        {err && <p className="text-sm font-semibold text-soil">{err}</p>}
        <Button full onClick={save}>
          {existing ? l("Save changes", "बदल जतन करा") : l("Publish profile", "प्रोफाइल प्रसिद्ध करा")}
        </Button>
      </div>
    </div>
  );
}
