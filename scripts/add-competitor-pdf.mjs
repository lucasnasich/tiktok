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
      "Uso: node scripts/add-competitor-pdf.mjs <competitor-id> <ruta-al-pdf>\n" +
        "Ej: npm run competitor:pdf -- minificando-ai ~/Downloads/estrategia-minificando.pdf",
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

if (!absSource.toLowerCase().endsWith(".pdf")) {
  console.error("El archivo tiene que ser un PDF.");
  process.exit(1);
}

const destDir = path.join(ASSET_PATHS.competitorDocuments, competitorId);
const destFile = path.join(destDir, "documento.pdf");

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(absSource, destFile);

spawnSync(
  "node",
  [path.join(root, "scripts/regenerate-competitor-documents.mjs")],
  { stdio: "inherit" },
);

console.log(`\nPDF guardado → ${path.relative(root, destFile)}`);
console.log("Abrí Inspiración → Competidores para verlo.");
