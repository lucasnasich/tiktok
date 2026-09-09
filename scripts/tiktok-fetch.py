#!/usr/bin/env python3
"""Descarga media de TikTok (video o carrusel de fotos). Gratis, sin API de pago."""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path


def gallery_dl_bin() -> str:
    candidates = [
        "gallery-dl",
        str(Path.home() / "Library/Python/3.13/bin/gallery-dl"),
        str(Path.home() / "Library/Python/3.12/bin/gallery-dl"),
        str(Path.home() / ".local/bin/gallery-dl"),
    ]
    for candidate in candidates:
        if shutil.which(candidate) or Path(candidate).is_file():
            return candidate
    raise SystemExit(
        "Falta gallery-dl. Instalá una vez (gratis):\n"
        "  pip3 install gallery-dl --break-system-packages\n"
        "  # o: pip3 install -r scripts/requirements.txt --break-system-packages",
    )


def yt_dlp_bin(root: Path) -> Path:
    bundled = root / "scripts/bin/yt-dlp"
    if bundled.is_file():
        return bundled
    which = shutil.which("yt-dlp")
    if which:
        return Path(which)
    raise SystemExit("Falta yt-dlp para videos de TikTok.")


def resolve_url(url: str) -> str:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (compatible; MercantisStudio/1.0)"},
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.geturl()


def post_id_from_url(url: str) -> str:
    match = re.search(r"/(?:photo|video)/(\d+)", url)
    if not match:
        raise SystemExit(f"URL de TikTok no válida: {url}")
    return match.group(1)


def is_video_post(url: str) -> bool:
    return "/video/" in url


def slide_index(path: Path) -> int:
    match = re.search(r"_(\d+)\s", path.name)
    if match:
        return int(match.group(1))
    match = re.search(r"_(\d+)\.", path.name)
    return int(match.group(1)) if match else 0


def download_with_gallery_dl(url: str, tmp_dir: Path) -> list[Path]:
    tmp_dir.mkdir(parents=True, exist_ok=True)
    command = [gallery_dl_bin(), "-D", str(tmp_dir), url]
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        raise SystemExit(result.stderr or result.stdout or "gallery-dl falló")

    return [path for path in tmp_dir.iterdir() if path.is_file()]


def download_with_yt_dlp(url: str, out_dir: Path, root: Path) -> list[Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    output = out_dir / "video.%(ext)s"
    command = [
        str(yt_dlp_bin(root)),
        "--no-playlist",
        "-f",
        "best[acodec!=none]/bestvideo*+bestaudio/best",
        "--merge-output-format",
        "mp4",
        "-o",
        str(output),
        url,
    ]
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        raise SystemExit(result.stderr or result.stdout or "yt-dlp falló")
    return [path for path in out_dir.iterdir() if path.is_file()]


def has_local_media(out_dir: Path) -> bool:
    if not out_dir.is_dir():
        return False
    if (out_dir / "video.mp4").is_file():
        return True
    return any(
        path.is_file() and re.match(r"^\d+\.(jpg|jpeg|png|webp)$", path.name, re.I)
        for path in out_dir.iterdir()
        if not path.name.startswith(".") and path.name != "_tmp"
    )


def normalize_files(raw_files: list[Path], out_dir: Path) -> list[dict[str, str]]:
    out_dir.mkdir(parents=True, exist_ok=True)

    images = sorted(
        [path for path in raw_files if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}],
        key=slide_index,
    )
    videos = [path for path in raw_files if path.suffix.lower() in {".mp4", ".webm", ".mov"}]

    manifest: list[dict[str, str]] = []

    if videos:
        video_dest = out_dir / "video.mp4"
        shutil.move(str(videos[0]), video_dest)
        manifest.append({"kind": "video", "file": str(video_dest)})

        if images:
            poster_dest = out_dir / "poster.jpg"
            shutil.move(str(images[0]), poster_dest)
            manifest[-1]["poster"] = str(poster_dest)
        return manifest

    if not images:
        raise SystemExit("No se encontraron imágenes ni video en el post de TikTok.")

    for index, image in enumerate(images, start=1):
        ext = image.suffix.lower()
        dest = out_dir / f"{index:02d}{ext}"
        shutil.move(str(image), dest)
        manifest.append({"kind": "image", "file": str(dest)})

    return manifest


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


def fetch_post(url: str, out_dir: Path, root: Path, force: bool = False) -> dict:
    post_id = post_id_from_url(url)

    if not force and has_local_media(out_dir):
        return {
            "id": f"tt-{post_id}",
            "url": url,
            "files": existing_manifest(out_dir),
            "skipped": True,
        }

    if is_video_post(url):
        if out_dir.exists():
            shutil.rmtree(out_dir)
        raw_files = download_with_yt_dlp(url, out_dir, root)
        manifest = normalize_files(raw_files, out_dir)
        return {
            "id": f"tt-{post_id}",
            "url": url,
            "files": manifest,
        }

    tmp_dir = out_dir / "_tmp"
    if tmp_dir.exists():
        shutil.rmtree(tmp_dir)

    raw_files = download_with_gallery_dl(url, tmp_dir)
    has_media = any(
        path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".mp4", ".webm", ".mov"}
        for path in raw_files
    )

    if has_media:
        manifest = normalize_files(raw_files, out_dir)
        shutil.rmtree(tmp_dir, ignore_errors=True)
    else:
        shutil.rmtree(tmp_dir, ignore_errors=True)
        if out_dir.exists():
            shutil.rmtree(out_dir)
        raw_files = download_with_yt_dlp(url, out_dir, root)
        manifest = normalize_files(raw_files, out_dir)

    return {
        "id": f"tt-{post_id}",
        "url": url,
        "files": manifest,
    }


def main() -> None:
    if len(sys.argv) < 4:
        raise SystemExit(
            "Uso: python3 scripts/tiktok-fetch.py <url> <carpeta-inspiracion> <repo-root> [--force]",
        )

    url = sys.argv[1]
    assets_root = Path(sys.argv[2])
    root = Path(sys.argv[3])
    force = "--force" in sys.argv[4:]
    canonical_url = resolve_url(url)
    post_id = post_id_from_url(canonical_url)
    out_dir = assets_root / f"tt-{post_id}"
    result = fetch_post(canonical_url, out_dir, root, force=force)
    print(json.dumps(result))


if __name__ == "__main__":
    main()
