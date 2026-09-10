import fs from "node:fs";
import path from "node:path";

const imagePattern = /^\d+\.(jpg|jpeg|png|webp)$/i;

export function readPostMeta(dir) {
  const postPath = path.join(dir, "post.json");
  if (!fs.existsSync(postPath)) return null;

  try {
    return JSON.parse(fs.readFileSync(postPath, "utf8"));
  } catch {
    return null;
  }
}

export function listImageFileNames(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => imagePattern.test(name))
    .sort((a, b) => a.localeCompare(b, "en"));
}

export function ensureSlideSourceMeta(dir, meta) {
  if (!meta?.url) return meta;
  if (Array.isArray(meta.slides) && meta.slides.length > 0) return meta;

  const files = listImageFileNames(dir);
  if (files.length === 0) return meta;

  const nextMeta = {
    ...meta,
    slides: files.map((file, index) => ({
      file,
      sourceUrl: meta.url,
      remoteUrl: meta.imageUrls?.[index],
    })),
  };

  fs.writeFileSync(
    path.join(dir, "post.json"),
    `${JSON.stringify(nextMeta, null, 2)}\n`,
  );

  return nextMeta;
}

export function sourceUrlForFile(meta, fileName, fallbackUrl) {
  if (meta?.slides) {
    const slide = meta.slides.find((entry) => entry.file === fileName);
    if (slide?.sourceUrl) return slide.sourceUrl;
  }

  if (meta?.url) return meta.url;
  return fallbackUrl;
}

export function loadInspirationUrlsFromContent(root) {
  const urls = {};

  for (const file of ["creative-inspirations.ts", "organic-inspirations.ts"]) {
    const content = fs.readFileSync(path.join(root, "src/content", file), "utf8");
    const idMatches = [...content.matchAll(/id:\s*"([^"]+)"/g)];

    for (const idMatch of idMatches) {
      const id = idMatch[1];
      const start = idMatch.index ?? 0;
      const block = content.slice(start, start + 800);
      const urlMatch = block.match(/url:\s*"([^"]+)"/);
      if (urlMatch) urls[id] = urlMatch[1];
    }
  }

  return urls;
}
