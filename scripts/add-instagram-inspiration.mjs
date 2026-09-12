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

function parseArgs(argv) {
  const url = argv[2];
  if (!url) {
    console.error(
      'Uso: node scripts/add-instagram-inspiration.mjs <url-instagram> [--title "..."] [--force]',
    );
    process.exit(1);
  }

  const { force, title: parsedTitle } = parseCommonArgs(argv);
  const title = parsedTitle || "Referencia Instagram";
  return { url, title, force };
}

function shortcodeFromUrl(url) {
  const match = url.match(/instagram\.com\/(?:p|reel|reels|tv)\/([^/?#]+)/i);
  if (!match) {
    console.error("URL de Instagram no válida:", url);
    process.exit(1);
  }
  return match[1];
}

function ensureInstaloader() {
  const check = spawnSync("python3", ["-c", "import instaloader"], {
    encoding: "utf8",
  });
  if (check.status !== 0) {
    console.error(
      "Falta instaloader. Instalá una vez (gratis):\n  pip3 install instaloader --break-system-packages\n  # o: pip3 install -r scripts/requirements.txt --break-system-packages",
    );
    process.exit(1);
  }
}

function fetchInstagram(url, outDir, force) {
  const args = [path.join(root, "scripts/instagram-fetch.py"), url, outDir];
  if (force) args.push("--force");

  const result = spawnSync("python3", args, { encoding: "utf8" });

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }

  return JSON.parse(result.stdout.trim());
}

function escapeTsString(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function appendInspirationEntry({ id, url, title, isReel }) {
  const source = fs.readFileSync(inspirationsPath, "utf8");
  if (source.includes(`id: "${id}"`)) {
    console.log("Ya existe en creative-inspirations.ts:", id);
    return;
  }

  const label = isReel ? "Reel Instagram" : "Carrusel Instagram";
  const note = isReel
    ? "Formato y ritmo visual para inspirar un creativo de Mercantis."
    : "Guardado desde inspiración creativa. Estética y composición para adaptar.";

  const entry = `  {
    id: "${id}",
    platform: "Instagram",
    url: "${url}",
    title: "${escapeTsString(title || `${label} — referencia creativa`)}",
    media: inspirationMedia["${id}"],
    note: "${note}",
  },`;

  const updated = source.replace(
    /export const creativeInspirations: InspirationLinkItem\[] = \[\n/,
    `export const creativeInspirations: InspirationLinkItem[] = [\n${entry}\n`,
  );

  fs.writeFileSync(inspirationsPath, updated);
  console.log("Agregado a creative-inspirations.ts:", id);
}

const { url, title, force } = parseArgs(process.argv);
const shortcode = shortcodeFromUrl(url);
const id = `ig-${shortcode.toLowerCase()}`;
const outDir = path.join(ASSET_PATHS.inspirationMedia, id);
const isReel = /\/reels?\//i.test(url);

let fetched;
if (hasLocalMedia(outDir) && !force) {
  console.log(
    `Media local ya existe (${path.relative(root, outDir)}). Omitiendo descarga.`,
  );
  console.log("Usá --force si querés volver a bajar desde Instagram.");
  fetched = {
    id,
    url: `https://www.instagram.com/p/${shortcode}/`,
    files: listLocalManifest(outDir),
  };
} else {
  ensureInstaloader();
  console.log("Descargando", url, "→", path.relative(root, outDir));
  fetched = fetchInstagram(url, outDir, force);
  console.log(`OK ${fetched.files.length} archivo(s)`);
}

spawnSync("node", [path.join(root, "scripts/regenerate-inspiration-media.mjs")], {
  stdio: "inherit",
});

appendInspirationEntry({
  id: fetched.id,
  url: fetched.url,
  title: title || fetched.title || "",
  isReel,
});

spawnSync("node", [path.join(root, "scripts/analyze-inspiration.mjs"), "--id", fetched.id], {
  stdio: "inherit",
});

console.log("\nListo. Abrí Inspiración → Creativo para ver el preview.");
