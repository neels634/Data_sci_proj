"use client";

import dynamic from "next/dynamic";

// Leaflet needs the browser, so the map can't be rendered on the server.
const SatelliteAnalysis = dynamic(() => import("@/components/satellite/SatelliteAnalysis"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-40 bg-slate-900" aria-busy="true" />,
});

export default function SatellitePage() {
  return <SatelliteAnalysis />;
}
