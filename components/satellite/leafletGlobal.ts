/** leaflet-draw looks for a global `L`, so this must be imported before it. */
import L from "leaflet";

(window as unknown as { L: typeof L }).L = L;
