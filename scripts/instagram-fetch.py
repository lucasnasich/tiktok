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


def poster_for_video(video_path: Path) -> Path | None:
    poster = video_path.with_name(f"{video_path.stem}-poster.jpg")
    if poster.is_file():
        return poster
    if video_path.name == "video.mp4":
        legacy = video_path.parent / "poster.jpg"
        if legacy.is_file():
            return legacy
    return None


def existing_manifest(out_dir: Path) -> list[dict[str, str]]:
    manifest: list[dict[str, str]] = []
    video = out_dir / "video.mp4"
    if video.is_file():
        entry: dict[str, str] = {"kind": "video", "file": str(video)}
        poster = poster_for_video(video)
        if poster is not None:
            entry["poster"] = str(poster)
        manifest.append(entry)
        return manifest

    videos = sorted(
        [
            path
            for path in out_dir.iterdir()
            if path.is_file() and re.match(r"^\d+\.mp4$", path.name, re.I)
        ],
        key=lambda path: path.name,
    )
    images = sorted(
        [
            path
            for path in out_dir.iterdir()
            if path.is_file()
            and re.match(r"^\d+\.(jpg|jpeg|png|webp)$", path.name, re.I)
            and not re.match(r"^\d+-poster\.(jpg|jpeg|png|webp)$", path.name, re.I)
        ],
        key=lambda path: path.name,
    )

    for video_path in videos:
        entry = {"kind": "video", "file": str(video_path)}
        poster = poster_for_video(video_path)
        if poster is not None:
            entry["poster"] = str(poster)
        manifest.append(entry)

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
        return

    if backup.is_file():
        backup.unlink()


def download_video(video_url: str, video_path: Path, source_url: str, root: Path) -> None:
    try:
        download(video_url, video_path)
    except Exception:
        video_path.unlink(missing_ok=True)
        run_yt_dlp(source_url, video_path.parent / "video.%(ext)s", root)
        if not video_path.is_file():
            candidates = sorted(video_path.parent.glob("video.*"))
            if candidates:
                shutil.move(str(candidates[0]), video_path)
    ensure_video_has_audio(video_path, source_url, root)


def ensure_cover(shortcode: str, out_dir: Path) -> Path:
    cover_path = out_dir / "cover.jpg"
    if cover_path.is_file():
        return cover_path

    loader = instaloader.Instaloader()
    post = instaloader.Post.from_shortcode(loader.context, shortcode)
    download(post.url, cover_path)

    video_path = out_dir / "video.mp4"
    poster_path = out_dir / "poster.jpg"
    if video_path.is_file() and not poster_path.is_file():
        download(post.url, poster_path)

    return cover_path


def fetch_cover_only(url: str, out_dir: Path) -> dict:
    shortcode = shortcode_from_url(url)
    post_id = f"ig-{shortcode.lower()}"
    source_url = canonical_url(shortcode)
    cover_path = ensure_cover(shortcode, out_dir)

    return {
        "shortcode": shortcode,
        "id": post_id,
        "url": source_url,
        "cover": str(cover_path),
        "files": existing_manifest(out_dir),
        "skipped": cover_path.is_file(),
    }


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
            cover_path = out_dir / "cover.jpg"
            if not cover_path.is_file():
                ensure_cover(shortcode, out_dir)
            return {
                "shortcode": shortcode,
                "id": post_id,
                "url": source_url,
                "cover": str(cover_path),
                "files": existing_manifest(out_dir),
                "skipped": True,
            }

    loader = instaloader.Instaloader()
    post = instaloader.Post.from_shortcode(loader.context, shortcode)

    cover_path = out_dir / "cover.jpg"
    download(post.url, cover_path)

    files: list[dict[str, str]] = []

    if post.typename == "GraphSidecar":
        for index, node in enumerate(post.get_sidecar_nodes(), start=1):
            prefix = f"{index:02d}"
            if node.is_video:
                path = out_dir / f"{prefix}.mp4"
                poster_path = out_dir / f"{prefix}-poster.jpg"
                download(node.display_url, poster_path)
                try:
                    download(node.video_url, path)
                    ensure_video_has_audio(path, source_url, root)
                except Exception:
                    path.unlink(missing_ok=True)
                files.append(
                    {
                        "kind": "video",
                        "file": str(path),
                        "poster": str(poster_path),
                    }
                )
                continue

            ext = extension_for_image(node.display_url)
            path = out_dir / f"{prefix}.{ext}"
            download(node.display_url, path)
            files.append({"kind": "image", "file": str(path)})
    elif post.is_video:
        video_path = out_dir / "video.mp4"
        poster_path = out_dir / "poster.jpg"
        download(post.url, poster_path)
        download_video(post.video_url, video_path, source_url, root)
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

    caption = (post.caption or "").replace("\n", " ").strip()
    if len(caption) > 180:
        caption = f"{caption[:179].rstrip()}…"

    return {
        "shortcode": shortcode,
        "id": f"ig-{shortcode.lower()}",
        "url": source_url,
        "title": caption,
        "cover": str(cover_path),
        "files": files,
    }


def main() -> None:
    if len(sys.argv) < 3:
        raise SystemExit(
            "Uso: python3 scripts/instagram-fetch.py <url> <carpeta-salida> [--force|--cover-only]",
        )

    url = sys.argv[1]
    out_dir = Path(sys.argv[2])
    flags = set(sys.argv[3:])
    if "--cover-only" in flags:
        result = fetch_cover_only(url, out_dir)
    else:
        result = fetch_post(url, out_dir, force="--force" in flags)
    print(json.dumps(result))


if __name__ == "__main__":
    main()
