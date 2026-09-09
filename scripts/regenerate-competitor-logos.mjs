import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ASSET_PATHS } from "./asset-paths.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logosRoot = ASSET_PATHS.competitorLogos;
const outPath = path.join(root, "src/content/competitor-logos.ts");

const imageExt = new Set([".webp", ".jpg", ".jpeg", ".png", ".svg", ".ico"]);

if (!fs.existsSync(logosRoot)) {
  fs.mkdirSync(logosRoot, { recursive: true });
}

const logos = {};
const importLines = [];
let importIndex = 0;

for (const name of fs.readdirSync(logosRoot)) {
  if (name.startsWith(".")) continue;
  const ext = path.extname(name).toLowerCase();
  if (!imageExt.has(ext)) continue;

  const id = path.basename(name, ext);
  const rel = path.relative(root, path.join(logosRoot, name)).replaceAll("\\", "/");
  const ref = `competitorLogo${importIndex++}`;
  importLines.push(`import ${ref} from "../../${rel}";`);
  logos[id] = ref;
}

const importsBlock = importLines.length > 0 ? `${importLines.join("\n")}\n\n` : "";
const entries = Object.entries(logos)
  .map(([id, ref]) => `  "${id}": ${ref},`)
  .join("\n");

const source = `/** Generado desde assets/competidores/logos/ (no commitear). */
${importsBlock}export const competitorLogos: Record<string, string> = {
${entries}
};
`;

fs.writeFileSync(outPath, source);
console.log(
  "Actualizado",
  path.relative(root, outPath),
  `(${Object.keys(logos).length} logos)`,
);
