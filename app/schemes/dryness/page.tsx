"use client";

import FieldDryness from "@/components/satellite/FieldDryness";
import { useFarm } from "@/components/myfarm/ui";

export default function DrynessPage() {
  const { hydrated } = useFarm();
  return hydrated ? <FieldDryness /> : null;
}
