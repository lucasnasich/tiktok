import path from "node:path";
import { pathToFileURL } from "node:url";

import { ASSET_PATHS } from "./asset-paths.mjs";
import {
  buildInspirationIndex,
  writeInspirationIndex,
} from "./inspiration-intelligence-lib.mjs";

export function rebuildInspirationIndex(mediaRoot = ASSET_PATHS.inspirationMedia) {
  const index = buildInspirationIndex(mediaRoot);
  const file = writeInspirationIndex(index);
  return { file, count: index.entries.length };
}

const invokedDirectly =
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (invokedDirectly) {
  const { file, count } = rebuildInspirationIndex();
  console.log(`Índice regenerado (${count} referencias) → ${file}`);
}
