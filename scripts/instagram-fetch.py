#!/usr/bin/env python3
"""Descarga media de un post/reel de Instagram. Gratis, sin API de pago."""

from __future__ import annotations

import json
import re
import shutil
import sys
import urllib.request
from pathlib import Path

import instaloader

sys.path.insert(0, str(Path(__file__).resolve().parent))

from media_fetch_utils import file_has_audio, run_yt_dlp


def shortcode_from_url(url: str) -> str:
    match = re.search(r"instagram\.com/(?:p|reel|reels|tv)/([^/?#]+)", url, re.I)
    if not match:
        raise SystemExit(f"URL de Instagram no válida: {url}")
    return match.group(1)


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (compatible; MercantisStudio/1.0)"},
    )
    with urllib.request.urlopen(request, timeout=120) as response:
        dest.write_bytes(response.read())


def extension_for_image(url: str) -> str:
    lowered = url.lower()
    if ".webp" in lowered:
        return "webp"
    if ".png" in lowered:
        return "png"
    return "jpg"


def has_local_media(out_dir: Path) -> bool:
    if not out_dir.is_dir():
        return False
    if (out_dir / "video.mp4").is_file():
        return True
    return any(
        path.is_file() and re.match(r"^\d+\.(jpg|jpeg|png|webp)$", path.name, re.I)
        for path in out_dir.iterdir()
        if not path.name.startswith(".")
    )


def existing_manifest(out_dir: Path) -> list[dict[str, str]]:
    manifest: list[dict[str, str]] = []
    video = out_dir / "video.mp4"
    if video.is_file():
        entry: dict[str, str] = {"kind": "video", "file": str(video)}
        poster = out_dir / "poster.jpg"
        if poster.is_file():
            entry["poster"] = str(poster)
        manifest.append(entry)
        return manifest

    images = sorted(
        [
            path
            for path in out_dir.iterdir()
            if path.is_file()
            and re.match(r"^\d+\.(jpg|jpeg|png|webp)$", path.name, re.I)
        ],
        key=lambda path: path.name,
    )
    for image in images:
        manifest.append({"kind": "image", "file": str(image)})
    return manifest


def canonical_url(shortcode: str) -> str:
    return f"https://www.instagram.com/p/{shortcode}/"


def ensure_video_has_audio(video_path: Path, source_url: str, root: Path) -> None:
    if file_has_audio(video_path):
        return

    out_dir = video_path.parent
    backup = out_dir / "_video_no_audio.bak"
    if video_path.exists():
        shutil.move(str(video_path), backup)

    try:
        run_yt_dlp(source_url, out_dir / "video.%(ext)s", root)
    except SystemExit:
        if backup.is_file() and not video_path.is_file():
            shutil.move(str(backup), video_path)
        raise

    if backup.is_file():
        backup.unlink()

    if not file_has_audio(video_path):
        raise SystemExit(f"El video de Instagram no tiene audio: {video_path.name}")


def fetch_post(url: str, out_dir: Path, force: bool = False) -> dict:
    shortcode = shortcode_from_url(url)
    post_id = f"ig-{shortcode.lower()}"
    root = Path(__file__).resolve().parent.parent
    source_url = canonical_url(shortcode)

    if not force and has_local_media(out_dir):
        video_path = out_dir / "video.mp4"
        if video_path.is_file() and not file_has_audio(video_path):
            force = True
        else:
            return {
                "shortcode": shortcode,
                "id": post_id,
                "url": source_url,
                "files": existing_manifest(out_dir),
                "skipped": True,
            }

    loader = instaloader.Instaloader()
    post = instaloader.Post.from_shortcode(loader.context, shortcode)

    files: list[dict[str, str]] = []

    if post.typename == "GraphSidecar":
        for index, node in enumerate(post.get_sidecar_nodes(), start=1):
            prefix = f"{index:02d}"
            if node.is_video:
                path = out_dir / f"{prefix}.mp4"
                download(node.video_url, path)
                ensure_video_has_audio(path, source_url, root)
                files.append({"kind": "video", "file": str(path)})
                continue

            ext = extension_for_image(node.display_url)
            path = out_dir / f"{prefix}.{ext}"
            download(node.display_url, path)
            files.append({"kind": "image", "file": str(path)})
    elif post.is_video:
        video_path = out_dir / "video.mp4"
        download(post.video_url, video_path)
        ensure_video_has_audio(video_path, source_url, root)
        poster_path = out_dir / "poster.jpg"
        download(post.url, poster_path)
        files.append(
            {
                "kind": "video",
                "file": str(video_path),
                "poster": str(poster_path),
            }
        )
    else:
        ext = extension_for_image(post.url)
        path = out_dir / f"01.{ext}"
        download(post.url, path)
        files.append({"kind": "image", "file": str(path)})

    return {
        "shortcode": shortcode,
        "id": f"ig-{shortcode.lower()}",
        "url": source_url,
        "files": files,
    }


def main() -> None:
    if len(sys.argv) < 3:
        raise SystemExit(
            "Uso: python3 scripts/instagram-fetch.py <url> <carpeta-salida> [--force]",
        )

    url = sys.argv[1]
    out_dir = Path(sys.argv[2])
    force = "--force" in sys.argv[3:]
    result = fetch_post(url, out_dir, force=force)
    print(json.dumps(result))


if __name__ == "__main__":
    main()
