import fs from "node:fs";
import path from "node:path";

const imagePattern = /^\d+\.(jpg|jpeg|png|webp)$/i;

export function parseCommonArgs(argv) {
  let force = false;
  let title = "";

  for (let i = 3; i < argv.length; i++) {
    if (argv[i] === "--force") {
      force = true;
      continue;
    }
    if (argv[i] === "--title" && argv[i + 1]) {
      title = argv[i + 1];
      i += 1;
    }
  }

  return { force, title };
}

export function hasLocalMedia(dir) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return false;

  const names = fs
    .readdirSync(dir)
    .filter((name) => !name.startsWith(".") && name !== "_tmp");

  if (names.includes("video.mp4")) return true;
  return names.some((name) => imagePattern.test(name));
}

export function listLocalManifest(dir) {
  if (!hasLocalMedia(dir)) return [];

  const names = fs
    .readdirSync(dir)
    .filter((name) => !name.startsWith(".") && name !== "_tmp")
    .sort((a, b) => a.localeCompare(b, "en"));

  const coverPath = names.includes("cover.jpg")
    ? path.join(dir, "cover.jpg")
    : null;

  if (names.includes("video.mp4")) {
    const files = [{ kind: "video", file: path.join(dir, "video.mp4") }];
    if (names.includes("poster.jpg")) {
      files[0].poster = path.join(dir, "poster.jpg");
    } else if (coverPath) {
      files[0].poster = coverPath;
    }
    return files;
  }

  return names
    .filter(
      (name) =>
        (imagePattern.test(name) || /\.(mp4|webm|mov)$/i.test(name)) &&
        name !== "cover.jpg" &&
        !/-poster\.(jpg|jpeg|png|webp)$/i.test(name),
    )
    .sort((a, b) => a.localeCompare(b, "en"))
    .map((name) => {
      const isVideo = /\.(mp4|webm|mov)$/i.test(name);
      const entry = {
        kind: isVideo ? "video" : "image",
        file: path.join(dir, name),
      };
      if (isVideo) {
        const stem = path.basename(name, path.extname(name));
        const posterName = `${stem}-poster.jpg`;
        if (names.includes(posterName)) {
          entry.poster = path.join(dir, posterName);
        } else if (coverPath) {
          entry.poster = coverPath;
        }
      }
      return entry;
    });
}
