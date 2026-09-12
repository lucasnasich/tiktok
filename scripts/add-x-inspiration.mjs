import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ASSET_PATHS } from "./asset-paths.mjs";
import {
  hasLocalMedia,
  listLocalManifest,
  parseCommonArgs,
} from "./inspiration-media-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inspirationsPath = path.join(root, "src/content/creative-inspirations.ts");
const assetsRoot = ASSET_PATHS.inspirationMedia;

function parseArgs(argv) {
  const url = argv[2];
  if (!url) {
    console.error(
      'Uso: node scripts/add-x-inspiration.mjs <url-x> [--title "..."] [--force]',
    );
    process.exit(1);
  }

  const { force, title } = parseCommonArgs(argv);
  return { url, title, force };
}

function postIdFromUrl(url) {
  const match = url.match(/\/status\/(\d+)/);
  if (!match) {
    console.error("URL de X no válida:", url);
    process.exit(1);
  }
  return match[1];
}

function escapeTsString(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, "\\n");
}

function ensureGalleryDl() {
  const check = spawnSync("python3", ["-c", "import gallery_dl"], {
    encoding: "utf8",
  });
  if (check.status !== 0) {
    console.error(
      "Falta gallery-dl. Instalá una vez (gratis):\n  pip3 install gallery-dl --break-system-packages",
    );
    process.exit(1);
  }
}

function fetchX(url, force) {
  const args = [path.join(root, "scripts/x-fetch.py"), url, assetsRoot];
  if (force) args.push("--force");

  const result = spawnSync("python3", args, { encoding: "utf8" });

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }

  return JSON.parse(result.stdout.trim());
}

function authorLabel({ authorName, authorHandle }) {
  if (authorName && authorHandle && authorName !== authorHandle) {
    return `${authorName} @${authorHandle}`;
  }
  if (authorHandle) return `@${authorHandle}`;
  if (authorName) return authorName;
  return "";
}

function appendInspirationEntry(fetched, titleOverride) {
  const source = fs.readFileSync(inspirationsPath, "utf8");
  if (source.includes(`id: "${fetched.id}"`)) {
    console.log("Ya existe en creative-inspirations.ts:", fetched.id);
    return;
  }

  const title = titleOverride || fetched.title || "Post de X — referencia creativa";
  const postText = escapeTsString(fetched.text || "");
  const author = escapeTsString(authorLabel(fetched));
  const note =
    "Guardado desde X. Texto del post + imágenes descargadas en local.";

  const entry = `  {
    id: "${fetched.id}",
    platform: "X",
    url: "${fetched.url}",
    title: "${escapeTsString(title)}",
    postText: "${postText}",
    author: "${author}",
    media: inspirationMedia["${fetched.id}"],
    note: "${note}",
  },`;

  const updated = source.replace(
    /export const creativeInspirations: InspirationLinkItem\[] = \[\n/,
    `export const creativeInspirations: InspirationLinkItem[] = [\n${entry}\n`,
  );

  fs.writeFileSync(inspirationsPath, updated);
  console.log("Agregado a creative-inspirations.ts:", fetched.id);
}

const { url, title, force } = parseArgs(process.argv);
const postId = postIdFromUrl(url);
const id = `x-${postId}`;
const outDir = path.join(assetsRoot, id);

let fetched;
if (hasLocalMedia(outDir) && !force) {
  console.log(
    `Media local ya existe (${path.relative(root, outDir)}). Omitiendo descarga.`,
  );
  console.log("Usá --force si querés volver a bajar desde X.");

  const metaPath = path.join(outDir, "post.json");
  const meta = fs.existsSync(metaPath)
    ? JSON.parse(fs.readFileSync(metaPath, "utf8"))
    : {};

  fetched = {
    id,
    url: meta.url || url,
    text: meta.text || "",
    authorName: meta.authorName || "",
    authorHandle: meta.authorHandle || "",
    title: meta.text?.split("\n")[0]?.slice(0, 120) || "Post de X",
    files: listLocalManifest(outDir),
  };
} else {
  ensureGalleryDl();
  console.log("Descargando", url);
  fetched = fetchX(url, force);
  console.log(
    `OK ${fetched.files.length} imagen(es) → assets/inspiracion/media/${fetched.id}`,
  );
}

spawnSync("node", [path.join(root, "scripts/regenerate-inspiration-media.mjs")], {
  stdio: "inherit",
});

appendInspirationEntry(fetched, title);

spawnSync("node", [path.join(root, "scripts/analyze-inspiration.mjs"), "--id", fetched.id], {
  stdio: "inherit",
});

console.log("\nListo. Abrí Inspiración → Creativo para ver el preview.");
