import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    port: 3001,
    proxy: {
      // ── PLUG: Change this URL to your real backend ──
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
