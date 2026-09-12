import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ASSET_PATHS } from "./asset-paths.mjs";
import { downloadCosmosMedia, elementIdFromUrl } from "./cosmos-fetch.mjs";
import { parseCommonArgs } from "./inspiration-media-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inspirationsPath = path.join(root, "src/content/creative-inspirations.ts");

function parseArgs(argv) {
  const urls = [];
  let force = false;
  let title = "";

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--force") {
      force = true;
      continue;
    }
    if (arg === "--title" && argv[i + 1]) {
      title = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg.startsWith("http")) {
      urls.push(arg);
    }
  }

  if (urls.length === 0) {
    console.error(
      'Uso: npm run inspiration:cosmos -- <url-cosmos> [más urls...] [--title "..."] [--force]',
    );
    process.exit(1);
  }

  return { urls, force, title };
}

function escapeTsString(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function appendInspirationEntry({ id, url, title, isCarousel }) {
  const source = fs.readFileSync(inspirationsPath, "utf8");
  if (source.includes(`id: "${id}"`)) {
    console.log("Ya existe en creative-inspirations.ts:", id);
    return false;
  }

  const label = isCarousel ? "Carrusel Cosmos" : "Imagen Cosmos";
  const note =
    "Referencia visual de Cosmos. Estética, composición y mood para adaptar en creativos Mercantis.";

  const entry = `  {
    id: "${id}",
    platform: "Cosmos",
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
  return true;
}

async function main() {
  const { urls, force, title: cliTitle } = parseArgs(process.argv);
  let added = 0;

  const failures = [];

  for (const url of urls) {
    const elementId = elementIdFromUrl(url);
    const id = `cosmos-${elementId}`;
    const outDir = path.join(ASSET_PATHS.inspirationMedia, id);

    console.log(`\n→ ${url}`);
    try {
      const result = await downloadCosmosMedia(url, outDir, { force });
      if (result.skipped) {
        console.log(
          `Media local ya existe (${path.relative(root, outDir)}). Omitiendo descarga.`,
        );
      } else {
        console.log(
          `OK ${result.files.length} imagen(es)${result.isCarousel ? " (carrusel)" : ""}`,
        );
      }

      const entryTitle =
        cliTitle ||
        result.title ||
        (result.isCarousel
          ? "Carrusel Cosmos — referencia creativa"
          : "Imagen Cosmos — referencia creativa");

      if (
        appendInspirationEntry({
          id,
          url: result.url,
          title: entryTitle,
          isCarousel: result.isCarousel,
        })
      ) {
        added += 1;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`ERROR ${url}: ${message}`);
      failures.push({ url, message });
    }
  }

  spawnSync("node", [path.join(root, "scripts/regenerate-inspiration-media.mjs")], {
    stdio: "inherit",
  });

  for (const url of urls) {
    spawnSync(
      "node",
      [
        path.join(root, "scripts/analyze-inspiration.mjs"),
        "--id",
        `cosmos-${elementIdFromUrl(url)}`,
      ],
      { stdio: "inherit" },
    );
  }

  console.log(`\nListo. ${added} entrada(s) nueva(s). Abrí Inspiración → Creativo.`);
  if (failures.length > 0) {
    console.error(`\n${failures.length} URL(s) fallaron:`);
    for (const failure of failures) {
      console.error(`- ${failure.url}: ${failure.message}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
