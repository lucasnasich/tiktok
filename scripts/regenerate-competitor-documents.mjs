import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ASSET_PATHS } from "./asset-paths.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsRoot = ASSET_PATHS.competitorDocuments;
const outPath = path.join(root, "src/content/competitor-documents.ts");

function findPdf(dir) {
  if (!fs.existsSync(dir)) return null;
  const preferred = path.join(dir, "documento.pdf");
  if (fs.existsSync(preferred)) return preferred;

  const pdf = fs
    .readdirSync(dir)
    .filter((name) => name.toLowerCase().endsWith(".pdf"))
    .sort()[0];

  return pdf ? path.join(dir, pdf) : null;
}

if (!fs.existsSync(docsRoot)) {
  fs.mkdirSync(docsRoot, { recursive: true });
}

const documents = {};
const importLines = [];
let importIndex = 0;

for (const id of fs.readdirSync(docsRoot)) {
  if (id.startsWith(".")) continue;
  const dir = path.join(docsRoot, id);
  if (!fs.statSync(dir).isDirectory()) continue;

  const pdf = findPdf(dir);
  if (!pdf) continue;

  const rel = path.relative(root, pdf).replaceAll("\\", "/");
  const name = `competitorDoc${importIndex++}`;
  importLines.push(`import ${name} from "../../${rel}";`);
  documents[id] = name;
}

const importsBlock = importLines.length > 0 ? `${importLines.join("\n")}\n\n` : "";
const entries = Object.entries(documents)
  .map(([id, ref]) => `  "${id}": ${ref},`)
  .join("\n");

const source = `/** Generado desde assets/competidores/documentos/ (no commitear). */
${importsBlock}export const competitorDocuments: Record<string, string> = {
${entries}
};
`;

fs.writeFileSync(outPath, source);
console.log(
  "Actualizado",
  path.relative(root, outPath),
  `(${Object.keys(documents).length} PDFs)`,
);
