import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const ASSET_PATHS = {
  inspirationMedia: path.join(root, "assets/inspiracion/media"),
  inspirationIndex: path.join(root, "assets/inspiracion/inspiration-index.json"),
  competitorLogos: path.join(root, "assets/competidores/logos"),
  competitorDocuments: path.join(root, "assets/competidores/documentos"),
  mercantisCreatives: path.join(root, "assets/creativos/mercantis"),
  mercantisBrain: path.join(root, "knowledge/mercantis"),
};
