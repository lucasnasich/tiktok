import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { studioStorePlugin } from "./plugins/vite-studio-store.mjs";
import { inspirationIntelligencePlugin } from "./plugins/vite-inspiration-intelligence.mjs";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      tailwindcss(),
      studioStorePlugin(),
      inspirationIntelligencePlugin(env),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
