import fs from "node:fs";
import path from "node:path";

import { ASSET_PATHS } from "./asset-paths.mjs";

const MAX_BRAIN_REFS = 12;
const BRAIN_REF_PATTERN = /^[a-z0-9][a-z0-9._-]*\.md$/i;

export function sanitizeBrainRef(ref) {
  if (typeof ref !== "string") return null;
  const name = path.basename(ref.replace(/\\/g, "/").trim());
  if (!BRAIN_REF_PATTERN.test(name)) return null;
  return name;
}

export function uniqueBrainRefs(refs) {
  const seen = new Set();
  const result = [];
  for (const ref of Array.isArray(refs) ? refs : []) {
    const name = sanitizeBrainRef(ref);
    if (!name || seen.has(name)) continue;
    seen.add(name);
    result.push(name);
    if (result.length >= MAX_BRAIN_REFS) break;
  }
  return result;
}

function isInsideBrainDir(resolvedPath, brainDir) {
  return path.dirname(resolvedPath) === brainDir;
}

export function loadBrainDocuments(
  refs,
  brainDir = ASSET_PATHS.mercantisBrain,
) {
  const root = fs.realpathSync(brainDir);
  const documents = [];
  const missing = [];

  for (const name of uniqueBrainRefs(refs)) {
    const candidate = path.join(root, name);
    if (!fs.existsSync(candidate)) {
      missing.push(name);
      continue;
    }
    const resolved = fs.realpathSync(candidate);
    if (!isInsideBrainDir(resolved, root)) {
      missing.push(name);
      continue;
    }
    documents.push({
      file: name,
      content: fs.readFileSync(resolved, "utf8"),
    });
  }

  return { documents, missing };
}
