"""Utilidades compartidas para bajar video con audio muxeado (sin depender de ffmpeg)."""

from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

# Formatos genéricos: solo muxed (video+audio en un archivo). Nunca bestvideo+bestaudio.
MUXED_FORMAT_CANDIDATES = (
    "best*[vcodec=h264][acodec!=none]",
    "best*[vcodec^=avc][acodec!=none]",
    "best*[vcodec!=none][acodec!=none]",
    "best[vcodec!=none][acodec!=none]",
    "download",
)

# TikTok expone "download" como H.264+AAC. Es el más compatible en navegadores.
TIKTOK_FORMAT_CANDIDATES = (
    "download",
    "best*[vcodec=h264][acodec!=none]",
    "best*[vcodec^=avc][acodec!=none]",
    "best*[vcodec!=none][acodec!=none]",
)


def repo_root_from_script() -> Path:
    return Path(__file__).resolve().parent.parent


def yt_dlp_bin(root: Path | None = None) -> Path:
    base = root or repo_root_from_script()
    bundled = base / "scripts/bin/yt-dlp"
    if bundled.is_file():
        return bundled
    which = shutil.which("yt-dlp")
    if which:
        return Path(which)
    raise SystemExit("Falta yt-dlp para descargar videos.")


def _sample(path: Path) -> bytes:
    return path.read_bytes()[:4_000_000]


def file_has_audio(path: Path) -> bool:
    if not path.is_file():
        return False
    sample = _sample(path)
    return b"mp4a" in sample or b"soun" in sample


def file_has_video(path: Path) -> bool:
    if not path.is_file():
        return False
    sample = _sample(path)
    return any(marker in sample for marker in (b"avc1", b"hvc1", b"hev1", b"vide"))


def file_is_h264(path: Path) -> bool:
    if not path.is_file():
        return False
    sample = _sample(path)
    return b"avc1" in sample or b"avc3" in sample


def file_is_hevc(path: Path) -> bool:
    if not path.is_file():
        return False
    sample = _sample(path)
    return b"hvc1" in sample or b"hev1" in sample


def run_yt_dlp(
    url: str,
    output_template: Path,
    root: Path,
    formats: tuple[str, ...] | None = None,
) -> list[Path]:
    out_dir = output_template.parent
    out_dir.mkdir(parents=True, exist_ok=True)
    candidates = formats or MUXED_FORMAT_CANDIDATES

    for index, format_selector in enumerate(candidates):
        for child in out_dir.iterdir():
            if child.is_file() and child.name.startswith("video."):
                child.unlink()

        command = [
            str(yt_dlp_bin(root)),
            "--no-playlist",
            "-f",
            format_selector,
            "--merge-output-format",
            "mp4",
            "-o",
            str(output_template),
            url,
        ]
        result = subprocess.run(command, capture_output=True, text=True)
        if result.returncode != 0:
            if index == len(candidates) - 1:
                raise SystemExit(result.stderr or result.stdout or "yt-dlp falló")
            continue

        video_files = [
            path
            for path in out_dir.iterdir()
            if path.is_file() and path.suffix.lower() in {".mp4", ".webm", ".mov"}
        ]
        if not video_files:
            continue

        video = video_files[0]
        if file_has_audio(video) and file_has_video(video):
            if video.name != "video.mp4":
                dest = out_dir / "video.mp4"
                if dest.exists():
                    dest.unlink()
                video.rename(dest)
                return [dest]
            return [video]

    raise SystemExit("No se pudo bajar un video con pista de audio.")
