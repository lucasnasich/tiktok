import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { ASSET_PATHS } from "./asset-paths.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const competitorId = argv[2];
  const sourcePath = argv[3];

  if (!competitorId || !sourcePath) {
    console.error(
      "Uso: node scripts/add-competitor-logo.mjs <competitor-id> <ruta-imagen>\n" +
        "Ej: npm run competitor:logo -- minificando-ai ~/Downloads/logo.webp",
    );
    process.exit(1);
  }

  return { competitorId, sourcePath };
}

const { competitorId, sourcePath } = parseArgs(process.argv);
const absSource = path.resolve(sourcePath);

if (!fs.existsSync(absSource)) {
  console.error("No existe el archivo:", absSource);
  process.exit(1);
}

const ext = path.extname(absSource).toLowerCase();
if (![".webp", ".jpg", ".jpeg", ".png", ".svg"].includes(ext)) {
  console.error("Formato no soportado. Usá webp, jpg, png o svg.");
  process.exit(1);
}

fs.mkdirSync(ASSET_PATHS.competitorLogos, { recursive: true });
const destFile = path.join(ASSET_PATHS.competitorLogos, `${competitorId}${ext}`);
fs.copyFileSync(absSource, destFile);

spawnSync(
  "node",
  [path.join(root, "scripts/regenerate-competitor-logos.mjs")],
  { stdio: "inherit" },
);

console.log(`\nLogo guardado → ${path.relative(root, destFile)}`);
