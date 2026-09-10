#!/usr/bin/env python3
"""Verifica audio y compatibilidad web de los videos de inspiración."""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from media_fetch_utils import (
    file_has_audio,
    file_has_video,
    file_is_h264,
    file_is_hevc,
)


def repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def inspiration_urls(root: Path) -> dict[str, str]:
    urls: dict[str, str] = {}
    content_dir = root / "src/content"
    pattern = re.compile(r'id:\s*"([^"]+)"[\s\S]*?url:\s*"([^"]+)"', re.M)

    for path in content_dir.glob("*inspirations*.ts"):
        source = path.read_text(encoding="utf-8")
        for item_id, url in pattern.findall(source):
            urls[item_id] = url

    return urls


def list_video_files(media_root: Path) -> list[Path]:
    files: list[Path] = []
    if not media_root.is_dir():
        return files

    for folder in sorted(media_root.iterdir()):
        if not folder.is_dir():
            continue
        video = folder / "video.mp4"
        if video.is_file():
            files.append(video)
            continue
        for child in sorted(folder.iterdir()):
            if child.is_file() and re.match(r"^\d+\.mp4$", child.name, re.I):
                files.append(child)
    return files


def describe_video(video: Path) -> tuple[str, bool]:
    has_audio = file_has_audio(video)
    has_video = file_has_video(video)
    if not has_audio:
        return "sin audio", True
    if not has_video:
        return "sin video", True
    if file_is_hevc(video) and not file_is_h264(video):
        return "hevc (puede fallar audio en el navegador)", True
    if file_is_h264(video):
        return "ok (h264+aac)", False
    return "ok", False


def refetch_tiktok(url: str, root: Path) -> None:
    subprocess.run(
        [
            "python3",
            str(root / "scripts/tiktok-fetch.py"),
            url,
            str(root / "assets/inspiracion/media"),
            str(root),
            "--force",
        ],
        check=True,
    )


def refetch_instagram(url: str, folder: Path, root: Path) -> None:
    subprocess.run(
        [
            "python3",
            str(root / "scripts/instagram-fetch.py"),
            url,
            str(folder),
            "--force",
        ],
        check=True,
    )


def main() -> None:
    root = repo_root()
    media_root = root / "assets/inspiracion/media"
    fix = "--fix" in sys.argv[1:]

    urls = inspiration_urls(root)
    needs_fix: list[Path] = []

    for video in list_video_files(media_root):
        status, should_fix = describe_video(video)
        rel = video.relative_to(root)
        print(f"{rel}: {status}")
        if should_fix:
            needs_fix.append(video)

    if not needs_fix:
        print("\nTodos los videos están listos para reproducir en el navegador.")
        return

    print(f"\n{len(needs_fix)} video(s) para reparar.")

    if not fix:
        print("Corré con --fix para volver a bajarlos en H.264+AAC.")
        sys.exit(1)

    for video in needs_fix:
        folder = video.parent
        item_id = folder.name
        url = urls.get(item_id)
        if not url:
            print(f"Sin URL para {item_id}, omitiendo.")
            continue

        print(f"\nRe-descargando {item_id} …")
        if item_id.startswith("tt-"):
            refetch_tiktok(url, root)
        elif item_id.startswith("ig-"):
            refetch_instagram(url, folder, root)
        else:
            print(f"Plataforma no soportada para {item_id}")
            continue

        target = folder / "video.mp4"
        status, _ = describe_video(target if target.exists() else video)
        print(f"  → {status}")

    subprocess.run(
        ["node", str(root / "scripts/regenerate-inspiration-media.mjs")],
        check=True,
    )
    print("\nListo.")


if __name__ == "__main__":
    main()
