import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { studioStorePlugin } from "./plugins/vite-studio-store.mjs";

export default defineConfig({
  plugins: [react(), tailwindcss(), studioStorePlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
