import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ASSET_PATHS } from "./asset-paths.mjs";
import {
  ensureSlideSourceMeta,
  loadInspirationUrlsFromContent,
  readPostMeta,
  sourceUrlForFile,
} from "./inspiration-source-meta.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsRoot = ASSET_PATHS.inspirationMedia;
const mediaTsPath = path.join(root, "src/content/inspiration-media.ts");

const imageExt = new Set([".webp", ".jpg", ".jpeg", ".png"]);
const videoExt = new Set([".mp4", ".webm", ".mov"]);

function listMediaFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  const entries = fs
    .readdirSync(dir)
    .filter((name) => !name.startsWith("."))
    .map((name) => ({
      name,
      abs: path.join(dir, name),
      ext: path.extname(name).toLowerCase(),
    }));

  const video = entries.find((entry) => entry.name === "video.mp4");
  if (video) {
    const poster = entries.find((entry) => entry.name === "poster.jpg");
    return [
      {
        kind: "video",
        file: path.relative(root, video.abs).replaceAll("\\", "/"),
        poster: poster
          ? path.relative(root, poster.abs).replaceAll("\\", "/")
          : undefined,
      },
    ];
  }

  return entries
    .filter((entry) => imageExt.has(entry.ext) || videoExt.has(entry.ext))
    .sort((a, b) => a.name.localeCompare(b.name, "en"))
    .map((entry) => ({
      kind: videoExt.has(entry.ext) ? "video" : "image",
      file: path.relative(root, entry.abs).replaceAll("\\", "/"),
    }));
}

function escapeTsString(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function buildMediaTs(mediaById) {
  const importLines = [];
  const importMap = new Map();
  let importIndex = 0;

  function addImport(file) {
    if (importMap.has(file)) return importMap.get(file);
    const name = `inspirationAsset${importIndex++}`;
    importLines.push(`import ${name} from "../../${file}";`);
    importMap.set(file, name);
    return name;
  }

  const entries = Object.entries(mediaById).map(([id, slides]) => {
    const mappedSlides = slides.map((slide) => {
      const sourceUrlField = slide.sourceUrl
        ? `, sourceUrl: "${escapeTsString(slide.sourceUrl)}"`
        : "";

      if (slide.kind === "image") {
        const ref = addImport(slide.file);
        return `{ kind: "image", url: ${ref}${sourceUrlField} }`;
      }

      const videoRef = addImport(slide.file);
      if (slide.poster) {
        const posterRef = addImport(slide.poster);
        return `{ kind: "video", url: ${videoRef}, poster: ${posterRef}${sourceUrlField} }`;
      }

      return `{ kind: "video", url: ${videoRef}${sourceUrlField} }`;
    });

    return `  "${id}": [\n    ${mappedSlides.join(",\n    ")}\n  ]`;
  });

  const importsBlock =
    importLines.length > 0 ? `${importLines.join("\n")}\n\n` : "";

  return `import type { InspirationMediaSlide } from "@/content/inspiration-links";

${importsBlock}/** Generado localmente desde assets/inspiracion/media/ (no commitear). */
export const inspirationMedia: Record<string, InspirationMediaSlide[]> = {
${entries.join(",\n")}
};
`;
}

if (!fs.existsSync(assetsRoot)) {
  fs.mkdirSync(assetsRoot, { recursive: true });
}

const inspirationUrls = loadInspirationUrlsFromContent(root);
const mediaById = {};

for (const id of fs.readdirSync(assetsRoot)) {
  if (id.startsWith(".")) continue;
  const dir = path.join(assetsRoot, id);
  if (!fs.statSync(dir).isDirectory()) continue;
  if (id === "_tmp") continue;

  const meta = ensureSlideSourceMeta(dir, readPostMeta(dir));
  const fallbackUrl = inspirationUrls[id];
  const slides = listMediaFiles(dir).map((slide) => ({
    ...slide,
    sourceUrl: sourceUrlForFile(
      meta,
      path.basename(slide.file),
      fallbackUrl,
    ),
  }));

  if (slides.length > 0) mediaById[id] = slides;
}

fs.writeFileSync(mediaTsPath, buildMediaTs(mediaById));
console.log(
  "Actualizado",
  path.relative(root, mediaTsPath),
  `(${Object.keys(mediaById).length} items)`,
);
