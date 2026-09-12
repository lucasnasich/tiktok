import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Carga `.env` / `.env.local` sin prefijo VITE_ (secretos server-side). */
export function loadStudioEnv(mode = process.env.NODE_ENV || "development") {
  const fromVite = loadEnv(mode, root, "");
  return { ...fromVite, ...process.env };
}

export function resolveGeminiApiKey(env = loadStudioEnv()) {
  const key =
    String(env.GOOGLE_GENERATIVE_AI_API_KEY ?? "").trim() ||
    String(env.GEMINI_API_KEY ?? "").trim();
  return key || "";
}

export function missingGeminiKeyWarning() {
  return "Referencia guardada, pero no analizada: falta GOOGLE_GENERATIVE_AI_API_KEY. Podés analizarla después con npm run inspiration:analyze.";
}

export { root as STUDIO_ROOT };
