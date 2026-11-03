"use client";

/** Today's rates: pick a crop (same grid as "I want to sell"). */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { SpeakButton } from "@/components/speech";
import { CropPicker } from "@/components/mandi/rates";

export default function RatesPick() {
  const { l } = useStore();
  const router = useRouter();
  const title = l("Which crop's rates do you want to see?", "कोणत्या पिकाचे भाव पाहायचे?");
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Link href="/sell" aria-label={l("Back", "मागे")} className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-leaf-700">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="flex-1 text-[23px] font-bold leading-tight">{title}</h1>
        <SpeakButton id="rates-pick" text={title} />
      </div>
      <CropPicker label={title} onPick={(id) => router.push(`/mandi/rates/${id}`)} />
    </div>
  );
}
