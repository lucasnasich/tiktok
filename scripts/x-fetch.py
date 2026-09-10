#!/usr/bin/env python3
"""Descarga imágenes y texto de un post de X/Twitter."""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
from pathlib import Path


def gallery_dl_cmd() -> list[str]:
    return [sys.executable, "-m", "gallery_dl"]


def post_id_from_url(url: str) -> str:
    match = re.search(r"/status/(\d+)", url)
    if not match:
        raise SystemExit(f"URL de X no válida: {url}")
    return match.group(1)


def slide_index(path: Path) -> int:
    match = re.search(r"_(\d+)(?:\.|$)", path.name)
    return int(match.group(1)) if match else 0


def has_local_media(out_dir: Path) -> bool:
    if not out_dir.is_dir():
        return False
    if (out_dir / "post.json").is_file():
        return True
    return any(
        path.is_file() and re.match(r"^\d+\.(jpg|jpeg|png|webp)$", path.name, re.I)
        for path in out_dir.iterdir()
        if not path.name.startswith(".") and path.name != "_tmp"
    )


def load_post_meta(out_dir: Path) -> dict:
    meta_path = out_dir / "post.json"
    if meta_path.is_file():
        return json.loads(meta_path.read_text(encoding="utf-8"))
    return {}


def save_post_meta(out_dir: Path, meta: dict) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "post.json").write_text(
        json.dumps(meta, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def download_with_gallery_dl(url: str, tmp_dir: Path) -> tuple[list[Path], dict]:
    tmp_dir.mkdir(parents=True, exist_ok=True)
    command = [
        *gallery_dl_cmd(),
        "-D",
        str(tmp_dir),
        "--write-info-json",
        url,
    ]
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        raise SystemExit(result.stderr or result.stdout or "gallery-dl falló")

    info_path = tmp_dir / "info.json"
    meta: dict = {}
    if info_path.is_file():
        info = json.loads(info_path.read_text(encoding="utf-8"))
        author = info.get("author") or {}
        meta = {
            "text": (info.get("content") or "").strip(),
            "authorName": author.get("nick") or author.get("name") or "",
            "authorHandle": author.get("name") or "",
            "url": url,
        }

    files = [path for path in tmp_dir.iterdir() if path.is_file()]
    return files, meta


def normalize_files(raw_files: list[Path], out_dir: Path) -> list[dict[str, str]]:
    out_dir.mkdir(parents=True, exist_ok=True)

    images = sorted(
        [
            path
            for path in raw_files
            if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
            and path.name != "info.json"
        ],
        key=slide_index,
    )

    manifest: list[dict[str, str]] = []
    if not images:
        return manifest

    for index, image in enumerate(images, start=1):
        ext = image.suffix.lower()
        dest = out_dir / f"{index:02d}{ext}"
        shutil.move(str(image), dest)
        manifest.append({"kind": "image", "file": str(dest)})

    return manifest


def existing_manifest(out_dir: Path) -> list[dict[str, str]]:
    images = sorted(
        [
            path
            for path in out_dir.iterdir()
            if path.is_file()
            and re.match(r"^\d+\.(jpg|jpeg|png|webp)$", path.name, re.I)
        ],
        key=lambda path: path.name,
    )
    return [{"kind": "image", "file": str(image)} for image in images]


def title_from_text(text: str) -> str:
    first_line = text.strip().splitlines()[0] if text.strip() else "Post de X"
    return first_line[:120]


def fetch_post(url: str, out_dir: Path, force: bool = False) -> dict:
    post_id = post_id_from_url(url)
    post_key = f"x-{post_id}"

    if not force and has_local_media(out_dir):
        meta = load_post_meta(out_dir)
        return {
            "id": post_key,
            "url": meta.get("url") or url,
            "text": meta.get("text") or "",
            "authorName": meta.get("authorName") or "",
            "authorHandle": meta.get("authorHandle") or "",
            "title": title_from_text(meta.get("text") or ""),
            "files": existing_manifest(out_dir),
            "skipped": True,
        }

    if out_dir.exists():
        shutil.rmtree(out_dir)

    tmp_dir = out_dir / "_tmp"
    raw_files, meta = download_with_gallery_dl(url, tmp_dir)
    manifest = normalize_files(raw_files, out_dir)
    meta["url"] = url
    save_post_meta(out_dir, meta)
    shutil.rmtree(tmp_dir, ignore_errors=True)

    return {
        "id": post_key,
        "url": url,
        "text": meta.get("text") or "",
        "authorName": meta.get("authorName") or "",
        "authorHandle": meta.get("authorHandle") or "",
        "title": title_from_text(meta.get("text") or ""),
        "files": manifest,
    }


def main() -> None:
    if len(sys.argv) < 3:
        raise SystemExit(
            "Uso: python3 scripts/x-fetch.py <url-x> <carpeta-inspiracion> [--force]",
        )

    url = sys.argv[1]
    assets_root = Path(sys.argv[2])
    force = "--force" in sys.argv[3:]
    post_id = post_id_from_url(url)
    out_dir = assets_root / f"x-{post_id}"
    result = fetch_post(url, out_dir, force=force)
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
