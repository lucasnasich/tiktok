#!/usr/bin/env python3
"""Genera cover.jpg para referencias locales que aún no tienen portada."""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from media_fetch_utils import repo_root_from_script, yt_dlp_bin

IMAGE_PATTERN = re.compile(r"^\d+\.(jpg|jpeg|png|webp)$", re.I)


def load_inspiration_urls(root: Path) -> dict[str, str]:
    urls: dict[str, str] = {}

    for file_name in ("creative-inspirations.ts", "organic-inspirations.ts"):
        content = (root / "src/content" / file_name).read_text(encoding="utf-8")
        for id_match in re.finditer(r'id:\s*"([^"]+)"', content):
            item_id = id_match.group(1)
            block = content[id_match.start() : id_match.start() + 800]
            url_match = re.search(r'url:\s*"([^"]+)"', block)
            if url_match:
                urls[item_id] = url_match.group(1)

    return urls


def read_post_url(out_dir: Path) -> str | None:
    post_path = out_dir / "post.json"
    if not post_path.is_file():
        return None
    try:
        data = json.loads(post_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None
    url = data.get("url")
    return url if isinstance(url, str) and url.strip() else None


def first_slide_image(out_dir: Path) -> Path | None:
    images = sorted(
        [
            path
            for path in out_dir.iterdir()
            if path.is_file() and IMAGE_PATTERN.match(path.name)
        ],
        key=lambda path: path.name,
    )
    return images[0] if images else None


def copy_as_cover(source: Path, out_dir: Path) -> Path:
    cover_path = out_dir / "cover.jpg"
    shutil.copy2(source, cover_path)
    return cover_path


def local_cover_candidate(out_dir: Path) -> Path | None:
    poster = out_dir / "poster.jpg"
    if poster.is_file():
        return copy_as_cover(poster, out_dir)

    slide = first_slide_image(out_dir)
    if slide is not None:
        return copy_as_cover(slide, out_dir)

    return None


def fetch_instagram_cover(url: str, out_dir: Path, root: Path) -> bool:
    script = root / "scripts/instagram-fetch.py"
    result = subprocess.run(
        ["python3", str(script), url, str(out_dir), "--cover-only"],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        return False
    return (out_dir / "cover.jpg").is_file()


def download_tiktok_thumbnail(url: str, out_dir: Path, root: Path) -> bool:
    cover_path = out_dir / "cover.jpg"
    tmp_base = out_dir / "_cover_tmp"
    for candidate in out_dir.glob("_cover_tmp.*"):
        candidate.unlink()

    command = [
        str(yt_dlp_bin(root)),
        "--no-playlist",
        "--write-thumbnail",
        "--skip-download",
        "-o",
        str(tmp_base),
        url,
    ]
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        return False

    thumbnails = sorted(out_dir.glob("_cover_tmp.*"))
    if not thumbnails:
        return False

    shutil.copy2(thumbnails[0], cover_path)
    for candidate in thumbnails:
        candidate.unlink(missing_ok=True)

    return cover_path.is_file()


def has_media_files(out_dir: Path) -> bool:
    for path in out_dir.iterdir():
        if not path.is_file() or path.name.startswith("."):
            continue
        if path.name == "post.json":
            continue
        if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".mp4", ".webm", ".mov"}:
            return True
    return False


def backfill_cover(
    item_id: str,
    out_dir: Path,
    urls: dict[str, str],
    root: Path,
) -> str:
    if (out_dir / "cover.jpg").is_file():
        return "skip"

    if not has_media_files(out_dir):
        return "empty"

    if local_cover_candidate(out_dir) is not None:
        return "local"

    url = urls.get(item_id) or read_post_url(out_dir)
    if not url:
        return "missing-url"

    if item_id.startswith("ig-") and fetch_instagram_cover(url, out_dir, root):
        return "instagram"

    if item_id.startswith("tt-") and (out_dir / "video.mp4").is_file():
        if download_tiktok_thumbnail(url, out_dir, root):
            return "tiktok-thumb"
        return "failed"

    return "failed"


def main() -> None:
    root = repo_root_from_script()
    assets_root = root / "assets" / "inspiracion" / "media"
    urls = load_inspiration_urls(root)

    counts: dict[str, int] = {}
    failures: list[str] = []

    for item_id in sorted(path.name for path in assets_root.iterdir() if path.is_dir()):
        if item_id.startswith(".") or item_id == "_tmp":
            continue

        out_dir = assets_root / item_id
        result = backfill_cover(item_id, out_dir, urls, root)
        counts[result] = counts.get(result, 0) + 1
        if result in {"failed", "missing-url"}:
            failures.append(f"{item_id} ({result})")
        elif result == "empty":
            failures.append(f"{item_id} (sin media local)")

    print(json.dumps({"counts": counts, "failures": failures}, indent=2, ensure_ascii=False))

    hard_failures = [entry for entry in failures if "(failed)" in entry or "(missing-url)" in entry]
    if hard_failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
