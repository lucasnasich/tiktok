import fs from "node:fs";
import path from "node:path";

import {
  hasLocalMedia,
  listLocalManifest,
} from "./inspiration-media-utils.mjs";

function cleanCdnUrl(src) {
  const match = String(src).match(/https:\/\/cdn\.cosmos\.so\/([a-f0-9-]{36})/i);
  return match ? `https://cdn.cosmos.so/${match[1]}` : null;
}

export function elementIdFromUrl(url) {
  const match = url.match(/cosmos\.so\/e\/(\d+)/i);
  if (!match) {
    throw new Error(`URL de Cosmos no válida: ${url}`);
  }
  return match[1];
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; MercantisStudio/1.0)" },
    redirect: "follow",
  });
  if (!response.ok) {
    throw new Error(`No se pudo leer ${url}: HTTP ${response.status}`);
  }
  return response.text();
}

function scrapeFromHtml(html) {
  const title =
    html.match(/property="og:title" content="([^"]+)"/)?.[1]
      ?.replace(/\s*\/\s*Cosmos\s*$/i, "")
      .trim() ?? null;
  const description =
    html.match(/property="og:description" content="([^"]+)"/)?.[1] ?? "";
  const imageUrl = cleanCdnUrl(
    html.match(/property="og:image" content="([^"]+)"/)?.[1] ?? "",
  );
  const isCarousel = /carousel/i.test(description);

  return { title, description, imageUrl, isCarousel };
}

async function scrapeWithPlaywright(url) {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    throw new Error(
      "Falta playwright. Corré:\n  npm install\n  npx playwright install chromium",
    );
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForSelector('[data-testid="element-view-content"]', {
      timeout: 45000,
    });
    await page
      .waitForSelector(
        '[data-carousel-thumb] img, [data-testid="element-image-img"]',
        { timeout: 15000 },
      )
      .catch(() => undefined);

    const data = await page.evaluate(() => {
      const clean = (src) => {
        const match = String(src).match(
          /https:\/\/cdn\.cosmos\.so\/([a-f0-9-]{36})/i,
        );
        return match ? `https://cdn.cosmos.so/${match[1]}` : null;
      };

      const title =
        document
          .querySelector('meta[property="og:title"]')
          ?.getAttribute("content")
          ?.replace(/\s*\/\s*Cosmos\s*$/i, "")
          .trim() ?? document.title;

      const thumbUrls = [...document.querySelectorAll("[data-carousel-thumb] img")]
        .map((img) => clean(img.src))
        .filter(Boolean);

      if (thumbUrls.length > 0) {
        const seen = new Set();
        const imageUrls = [];
        for (const imageUrl of thumbUrls) {
          if (seen.has(imageUrl)) continue;
          seen.add(imageUrl);
          imageUrls.push(imageUrl);
        }
        return { title, imageUrls, isCarousel: true };
      }

      const main = document.querySelector('[data-testid="element-image-img"]');
      const mainUrl = main ? clean(main.src) : null;
      return {
        title,
        imageUrls: mainUrl ? [mainUrl] : [],
        isCarousel: false,
      };
    });

    return data;
  } finally {
    await browser.close();
  }
}

export async function scrapeCosmosElement(url) {
  const html = await fetchHtml(url);
  const staticData = scrapeFromHtml(html);

  if (!staticData.isCarousel && staticData.imageUrl) {
    return {
      title: staticData.title ?? "Referencia Cosmos",
      imageUrls: [staticData.imageUrl],
      isCarousel: false,
      description: staticData.description,
    };
  }

  const rendered = await scrapeWithPlaywright(url);
  const imageUrls =
    rendered.imageUrls.length > 0
      ? rendered.imageUrls
      : staticData.imageUrl
        ? [staticData.imageUrl]
        : [];

  return {
    title: rendered.title || staticData.title || "Referencia Cosmos",
    imageUrls,
    isCarousel: rendered.isCarousel || staticData.isCarousel,
    description: staticData.description,
  };
}

async function downloadImage(imageUrl, destPathWithoutExt) {
  const response = await fetch(imageUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; MercantisStudio/1.0)" },
  });
  if (!response.ok) {
    throw new Error(`No se pudo bajar ${imageUrl}: HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const ext = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
      ? "webp"
      : "jpg";
  const destPath = `${destPathWithoutExt}.${ext}`;
  fs.writeFileSync(destPath, Buffer.from(await response.arrayBuffer()));
  return destPath;
}

export async function downloadCosmosMedia(url, outDir, { force = false } = {}) {
  const elementId = elementIdFromUrl(url);
  const id = `cosmos-${elementId}`;
  const canonicalUrl = `https://www.cosmos.so/e/${elementId}`;

  if (!force && hasLocalMedia(outDir)) {
    return {
      id,
      url: canonicalUrl,
      title: null,
      isCarousel: null,
      files: listLocalManifest(outDir),
      skipped: true,
    };
  }

  const scraped = await scrapeCosmosElement(url);
  if (scraped.imageUrls.length === 0) {
    throw new Error(`Sin imágenes detectadas para ${url}`);
  }

  fs.mkdirSync(outDir, { recursive: true });

  const files = [];
  const slideMeta = [];

  for (let index = 0; index < scraped.imageUrls.length; index += 1) {
    const imageUrl = scraped.imageUrls[index];
    const fileName = `${String(index + 1).padStart(2, "0")}`;
    const filePath = await downloadImage(imageUrl, path.join(outDir, fileName));
    const savedFileName = path.basename(filePath);

    files.push({
      kind: "image",
      file: filePath,
      sourceUrl: canonicalUrl,
    });
    slideMeta.push({
      file: savedFileName,
      sourceUrl: canonicalUrl,
      remoteUrl: imageUrl,
    });
  }

  fs.writeFileSync(
    path.join(outDir, "post.json"),
    `${JSON.stringify(
      {
        url: canonicalUrl,
        title: scraped.title,
        isCarousel: scraped.isCarousel,
        description: scraped.description,
        imageUrls: scraped.imageUrls,
        slides: slideMeta,
      },
      null,
      2,
    )}\n`,
  );

  return {
    id,
    url: canonicalUrl,
    title: scraped.title,
    isCarousel: scraped.isCarousel,
    files,
    skipped: false,
  };
}
