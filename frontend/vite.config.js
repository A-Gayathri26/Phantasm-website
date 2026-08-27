import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Backend API base used only for the local dev proxy. In production the
// frontend calls the same-origin `/api/*` path, or VITE_API_BASE_URL if set
// (see src/lib/api.js), so this proxy target has no effect on prod builds.
const API_PROXY_TARGET = process.env.VITE_DEV_API_PROXY_TARGET || "http://localhost:4000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: API_PROXY_TARGET,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
