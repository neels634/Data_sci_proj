"use client";

import { useCallback, useMemo, useState } from "react";
import type L from "leaflet";
import { changeColor, type DrynessResult } from "@/lib/dryness";
import type { SampleFeature } from "@/lib/satellite";
import HeatmapLayer from "./HeatmapLayer";
import MapView from "./MapView";

const NO_TIP = { start: "", next: "", finish: "" };
const ignore = () => {};

/** The field with its heat map. With `compared`, colours show each spot against its own past years; otherwise, moisture as it is now. */
export default function DrynessMap({ result, compared }: { result: DrynessResult; compared: boolean }) {
  const [map, setMap] = useState<L.Map | null>(null);

  // the map sits inside a scrolling page, so a finger drag has to keep scrolling the page
  const onMapReady = useCallback((m: L.Map | null) => {
    m?.dragging.disable();
    m?.scrollWheelZoom.disable();
    setMap(m);
  }, []);

  const features = useMemo(
    () =>
      result.features.flatMap((f): SampleFeature[] => {
        const value = compared ? f.properties.change : f.properties.ndmi;
        return typeof value === "number" ? [{ type: "Feature", geometry: f.geometry, properties: { ndmi: value } }] : [];
      }),
    [result.features, compared],
  );

  return (
    <div className="relative isolate z-0 h-64 overflow-hidden rounded-2xl bg-slate-900">
      <MapView embedded boundary={result.boundary} bottomInset={0} drawTip={NO_TIP} onMapReady={onMapReady} onDrawn={ignore} onDrawPoints={ignore} />
      {map && <HeatmapLayer map={map} features={features} boundary={result.boundary} index="ndmi" scaleM={result.sample_scale_m} color={compared ? changeColor : undefined} />}
    </div>
  );
}
