"use client";

import { useEffect } from "react";
import L from "leaflet";
import { colorFor, type IndexId, type PolygonGeometry, type SampleFeature } from "@/lib/satellite";

const PANE = "satelliteHeatmap";
const MIN_SIDE_PX = 512;
const MAX_SIDE_PX = 1400;
const PX_PER_SAMPLE = 8;

/** Each pass draws every sample as a soft disc: a wide one blends the field, a narrower one keeps detail. */
const PASSES = [
  { radius: 2.6, alpha: 0.32 },
  { radius: 1.5, alpha: 0.55 },
];

/** Same order on every render, but not row by row, so no direction of the field looks smeared. */
function spreadOrder<T>(items: T[]): T[] {
  return items
    .map((item, i) => ({ item, key: (i * 2654435761) % 4294967296 }))
    .sort((a, b) => a.key - b.key)
    .map((x) => x.item);
}

type Rgb = [number, number, number];

function renderHeatmap(features: SampleFeature[], boundary: PolygonGeometry, index: IndexId, scaleM: number, color: (value: number) => Rgb) {
  const project = ([lng, lat]: number[]) => L.CRS.EPSG3857.project(L.latLng(lat, lng));
  const outer = boundary.coordinates[0].map(project);
  const minX = Math.min(...outer.map((p) => p.x));
  const maxX = Math.max(...outer.map((p) => p.x));
  const minY = Math.min(...outer.map((p) => p.y));
  const maxY = Math.max(...outer.map((p) => p.y));
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);

  // web map metres are stretched away from the equator; samples are true metres apart
  const centerLat = L.CRS.EPSG3857.unproject(L.point((minX + maxX) / 2, (minY + maxY) / 2)).lat;
  const sampleSpacing = scaleM / Math.cos((centerLat * Math.PI) / 180);

  const longSide = Math.max(spanX, spanY);
  const sidePx = Math.min(MAX_SIDE_PX, Math.max(MIN_SIDE_PX, (longSide / sampleSpacing) * PX_PER_SAMPLE));
  const pxPerUnit = sidePx / longSide;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(spanX * pxPerUnit));
  canvas.height = Math.max(1, Math.round(spanY * pxPerUnit));
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const toX = (x: number) => (x - minX) * pxPerUnit;
  const toY = (y: number) => (maxY - y) * pxPerUnit;

  // colours must stop exactly at the field edge (even-odd keeps any holes in the boundary empty)
  ctx.beginPath();
  for (const ring of boundary.coordinates) {
    ring.map(project).forEach((p, i) => (i === 0 ? ctx.moveTo(toX(p.x), toY(p.y)) : ctx.lineTo(toX(p.x), toY(p.y))));
    ctx.closePath();
  }
  ctx.clip("evenodd");

  const spacingPx = sampleSpacing * pxPerUnit;
  const points = spreadOrder(features.filter((f) => typeof f.properties[index] === "number"));
  for (const pass of PASSES) {
    const radius = spacingPx * pass.radius;
    for (const f of points) {
      const p = project(f.geometry.coordinates);
      const x = toX(p.x);
      const y = toY(p.y);
      const [r, g, b] = color(f.properties[index] as number);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(${r},${g},${b},${pass.alpha})`);
      gradient.addColorStop(0.55, `rgba(${r},${g},${b},${pass.alpha * 0.6})`);
      gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
  }

  const southWest = L.CRS.EPSG3857.unproject(L.point(minX, minY));
  const northEast = L.CRS.EPSG3857.unproject(L.point(maxX, maxY));
  return { url: canvas.toDataURL("image/png"), bounds: L.latLngBounds(southWest, northEast) };
}

type Props = {
  map: L.Map;
  features: SampleFeature[];
  boundary: PolygonGeometry;
  index: IndexId;
  scaleM: number;
  /** replaces the index's own colour scale; keep it stable between renders (useMemo) */
  color?: (value: number) => Rgb;
};

/** Smooth vegetation heatmap, clipped to the field, drawn beneath the white boundary line. */
export default function HeatmapLayer({ map, features, boundary, index, scaleM, color }: Props) {
  useEffect(() => {
    if (!map.getPane(PANE)) {
      const pane = map.createPane(PANE);
      pane.style.zIndex = "350";
      pane.style.pointerEvents = "none";
    }
    const rendered = renderHeatmap(features, boundary, index, scaleM, color ?? ((value) => colorFor(index, value)));
    if (!rendered) return;
    const overlay = L.imageOverlay(rendered.url, rendered.bounds, { pane: PANE, opacity: 0.95, interactive: false }).addTo(map);
    return () => {
      overlay.remove();
    };
  }, [map, features, boundary, index, scaleM, color]);

  return null;
}
