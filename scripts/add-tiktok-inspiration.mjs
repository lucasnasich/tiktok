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
const inspirationsPath = path.join(root, "src/content/organic-inspirations.ts");
const assetsRoot = ASSET_PATHS.inspirationMedia;

function parseArgs(argv) {
  const url = argv[2];
  if (!url) {
    console.error(
      'Uso: node scripts/add-tiktok-inspiration.mjs <url-tiktok> [--title "..."] [--force]',
    );
    process.exit(1);
  }

  const { force, title } = parseCommonArgs(argv);
  return { url, title, force };
}

function postIdFromUrl(url) {
  const match = url.match(/\/(?:photo|video)\/(\d+)/);
  if (!match) {
    console.error("URL de TikTok no válida:", url);
    process.exit(1);
  }
  return match[1];
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

function fetchTikTok(url, force) {
  const args = [
    path.join(root, "scripts/tiktok-fetch.py"),
    url,
    assetsRoot,
    root,
  ];
  if (force) args.push("--force");

  const result = spawnSync("python3", args, { encoding: "utf8" });

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }

  return JSON.parse(result.stdout.trim());
}

function upsertOrganicPost({ id, url, title, isCarousel }) {
  const source = fs.readFileSync(inspirationsPath, "utf8");
  const label = isCarousel ? "Carrusel TikTok" : "TikTok";
  const defaultTitle = `${label} — referencia orgánica`;
  const note = "Guardado para revisar hook, ritmo y formato.";
  const entry = `  {
    id: "${id}",
    kind: "post",
    platform: "TikTok",
    url: "${url}",
    title: "${title || defaultTitle}",
    media: inspirationMedia["${id}"],
    note: "${note}",
  },`;

  if (source.includes(`id: "${id}"`)) {
    console.log("Ya existe en organic-inspirations.ts:", id);
    return;
  }

  const updated = source.replace(
    /export const organicInspirations: OrganicInspiration\[] = \[\n/,
    `export const organicInspirations: OrganicInspiration[] = [\n${entry}\n`,
  );

  fs.writeFileSync(inspirationsPath, updated);
  console.log("Agregado a organic-inspirations.ts:", id);
}

const { url, title, force } = parseArgs(process.argv);
const postId = postIdFromUrl(url);
const id = `tt-${postId}`;
const outDir = path.join(assetsRoot, id);

let fetched;
if (hasLocalMedia(outDir) && !force) {
  console.log(
    `Media local ya existe (${path.relative(root, outDir)}). Omitiendo descarga.`,
  );
  console.log("Usá --force si querés volver a bajar desde TikTok.");
  fetched = {
    id,
    url,
    files: listLocalManifest(outDir),
  };
} else {
  ensureGalleryDl();
  console.log("Descargando", url);
  fetched = fetchTikTok(url, force);
  console.log(
    `OK ${fetched.files.length} archivo(s) → assets/inspiracion/media/${fetched.id}`,
  );
}

spawnSync(
  "node",
  [path.join(root, "scripts/regenerate-inspiration-media.mjs")],
  { stdio: "inherit" },
);

const isCarousel =
  fetched.files.filter((file) => file.kind === "image").length > 1;
upsertOrganicPost({
  id: fetched.id,
  url: fetched.url,
  title,
  isCarousel,
});

console.log("\nListo. Abrí Inspiración → Orgánico para ver el preview.");
