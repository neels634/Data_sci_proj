"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import "./leafletGlobal";
import "leaflet-draw";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { PolygonGeometry } from "@/lib/satellite";

/** Starting view: the Phaltan area. */
const DEFAULT_CENTER: L.LatLngTuple = [17.99, 74.43];
const DEFAULT_ZOOM = 14;
const TILE_RETRIES = 3;

export type MapHandle = {
  startDrawing: () => void;
  finishDrawing: () => void;
  undoPoint: () => void;
  cancelDrawing: () => void;
};

type DrawHandler = L.Draw.Polygon & { completeShape: () => void; deleteLastVertex: () => void };

type Props = {
  boundary: PolygonGeometry | null;
  /** space kept clear at the bottom of the map when fitting to a field, in pixels */
  bottomInset: number;
  drawTip: { start: string; next: string; finish: string };
  onMapReady: (map: L.Map | null) => void;
  onDrawn: (polygon: PolygonGeometry) => void;
  onDrawPoints: (points: number | null) => void;
  /** a small map inside a page, with no back button or heading laid over it */
  embedded?: boolean;
};

/** Leaflet map with Google hybrid imagery, polygon drawing, and the field's white boundary. */
const MapView = forwardRef<MapHandle, Props>(function MapView({ boundary, bottomInset, drawTip, onMapReady, onDrawn, onDrawPoints, embedded }, ref) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const drawer = useRef<DrawHandler | null>(null);
  const points = useRef(0);
  const callbacks = useRef({ onMapReady, onDrawn, onDrawPoints });
  callbacks.current = { onMapReady, onDrawn, onDrawPoints };

  useEffect(() => {
    if (!container.current) return;
    const map = L.map(container.current, { zoomControl: false, attributionControl: true }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    const imagery = L.tileLayer("https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      maxZoom: 20,
      attribution: "Imagery © Google",
    }).addTo(map);
    // tiles sometimes fail briefly, especially on weak connections; retry instead of leaving grey squares
    imagery.on("tileerror", (e) => {
      const { tile, coords } = e as L.TileErrorEvent;
      const tries = Number(tile.dataset.retries ?? 0);
      if (tries >= TILE_RETRIES) return;
      tile.dataset.retries = String(tries + 1);
      setTimeout(() => {
        tile.src = `${imagery.getTileUrl(coords)}&retry=${tries + 1}`;
      }, 800 * (tries + 1));
    });
    const zoom = L.control.zoom({ position: "topleft" }).addTo(map);
    if (!embedded) zoom.getContainer()!.style.marginTop = "64px"; // below the back button

    const setPoints = (n: number | null) => {
      points.current = n ?? 0;
      callbacks.current.onDrawPoints(n);
    };
    map.on(L.Draw.Event.CREATED, (e) => {
      const layer = (e as L.DrawEvents.Created).layer as L.Polygon;
      const shape = layer.toGeoJSON().geometry as GeoJSON.Polygon;
      setPoints(null);
      callbacks.current.onDrawn({ type: "Polygon", coordinates: shape.coordinates as number[][][] });
    });
    map.on(L.Draw.Event.DRAWVERTEX, (e) => setPoints((e as L.DrawEvents.DrawVertex).layers.getLayers().length));
    map.on(L.Draw.Event.DRAWSTOP, () => setPoints(null));

    mapRef.current = map;
    callbacks.current.onMapReady(map);
    return () => {
      drawer.current?.disable();
      drawer.current = null;
      callbacks.current.onMapReady(null);
      map.remove();
      mapRef.current = null;
    };
    // the mount-time look of the map never changes for one instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    startDrawing() {
      const map = mapRef.current;
      if (!map) return;
      drawer.current?.disable();
      L.drawLocal.draw.handlers.polygon.tooltip = { start: drawTip.start, cont: drawTip.next, end: drawTip.finish };
      // showArea stays off: leaflet-draw 1.0.4 throws when it measures area in strict mode
      drawer.current = new L.Draw.Polygon(map as L.DrawMap, {
        allowIntersection: false,
        showArea: false,
        shapeOptions: { color: "#ffffff", weight: 4, fillOpacity: 0.05 },
      }) as DrawHandler;
      drawer.current.enable();
      points.current = 0;
      callbacks.current.onDrawPoints(0);
    },
    finishDrawing() {
      if (points.current >= 3) drawer.current?.completeShape();
    },
    undoPoint() {
      if (points.current > 0) drawer.current?.deleteLastVertex();
    },
    cancelDrawing() {
      drawer.current?.disable();
    },
  }));

  // the field outline sits in the default overlay pane, above the heatmap pane
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !boundary) return;
    const shape = L.geoJSON(boundary as GeoJSON.Polygon, {
      style: { color: "#ffffff", weight: 4, opacity: 1, fillOpacity: 0.05 },
      interactive: false,
    }).addTo(map);
    // not animated: Leaflet ignores a new zoom while one is running, and this refits as the panel resizes
    map.fitBounds(shape.getBounds(), { paddingTopLeft: embedded ? [20, 20] : [24, 116], paddingBottomRight: [20, bottomInset + 12], maxZoom: 18, animate: false });
    return () => {
      shape.remove();
    };
  }, [boundary, bottomInset, embedded]);

  return <div ref={container} className="absolute inset-0 bg-slate-900" aria-label="Satellite map" />;
});

export default MapView;
