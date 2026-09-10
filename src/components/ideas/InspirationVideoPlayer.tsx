import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowsOutIcon,
  PauseIcon,
  PlayIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
} from "@phosphor-icons/react";

import {
  inspirationMediaOverlayButtonClass,
  inspirationMediaOverlayButtonHiddenClass,
} from "@/components/ideas/inspiration-layout";
import {
  onVideoPause,
  onVideoPlay,
  type VideoPlaybackHandoff,
} from "@/lib/exclusive-video-playback";
import { cn } from "@/lib/utils";

type InspirationVideoPlayerProps = {
  src: string;
  poster?: string;
  className?: string;
  onExpand?: (playback?: VideoPlaybackHandoff) => void;
  initialPlayback?: VideoPlaybackHandoff;
  fit?: "cover" | "contain";
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function InspirationVideoPlayer({
  src,
  poster,
  className,
  onExpand,
  initialPlayback,
  fit = "cover",
}: InspirationVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const appliedHandoffRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      video.pause();
      return;
    }

    video.muted = false;
    video.volume = 1;
    setIsMuted(false);

    try {
      await video.play();
    } catch {
      video.muted = true;
      setIsMuted(true);
      try {
        await video.play();
      } catch {
        // El navegador bloqueó la reproducción.
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const seek = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setCurrentTime(value);
  }, []);

  const showControls = isHovered;

  useLayoutEffect(() => {
    if (!initialPlayback) return;

    const video = videoRef.current;
    if (!video || appliedHandoffRef.current) return;

    const applyPlayback = () => {
      appliedHandoffRef.current = true;
      if (initialPlayback.currentTime > 0) {
        video.currentTime = initialPlayback.currentTime;
      }
      video.muted = initialPlayback.muted;
      setIsMuted(initialPlayback.muted);
      if (!initialPlayback.wasPlaying) return;

      void video.play().then(() => setIsPlaying(true)).catch(() => {
        video.muted = true;
        setIsMuted(true);
        void video.play().then(() => setIsPlaying(true)).catch(() => {
          // El navegador bloqueó la reproducción.
        });
      });
    };

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      applyPlayback();
      return;
    }

    video.addEventListener("loadedmetadata", applyPlayback, { once: true });
    return () => video.removeEventListener("loadedmetadata", applyPlayback);
  }, [initialPlayback, src]);

  return (
    <div
      className={cn("group/video relative size-full bg-black", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        ref={videoRef}
        className={cn(
          "size-full",
          fit === "contain" ? "object-contain" : "object-cover",
        )}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        muted={isMuted}
        onClick={() => void togglePlay()}
        onPlay={(event) => {
          onVideoPlay(event.currentTarget);
          setIsPlaying(true);
        }}
        onPause={(event) => {
          onVideoPause(event.currentTarget);
          setIsPlaying(false);
        }}
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        onLoadedMetadata={(event) =>
          setDuration(event.currentTarget.duration)
        }
        onEnded={() => setIsPlaying(false)}
      />

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-[5] bg-black/25 transition-opacity",
          showControls ? "opacity-100" : "opacity-0",
        )}
      />

      <button
        type="button"
        aria-label={isPlaying ? "Pausar" : "Reproducir"}
        onClick={(event) => {
          event.stopPropagation();
          togglePlay();
        }}
        className={cn(
          "absolute inset-0 z-10 flex items-center justify-center transition-opacity",
          showControls ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <span
          className={cn(
            "flex size-14 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-transform",
            isPlaying && isHovered && "scale-90",
          )}
        >
          {isPlaying ? (
            <PauseIcon className="size-6" weight="fill" />
          ) : (
            <PlayIcon className="ml-0.5 size-6" weight="fill" />
          )}
        </span>
      </button>

      {onExpand ? (
        <button
          type="button"
          aria-label="Ver en grande"
          onClick={(event) => {
            event.stopPropagation();
            const video = videoRef.current;
            if (!video) {
              onExpand();
              return;
            }

            const playback: VideoPlaybackHandoff = {
              currentTime: video.currentTime,
              wasPlaying: !video.paused,
              muted: video.muted,
            };

            if (!video.paused) {
              video.pause();
            }

            onExpand(playback);
          }}
          className={cn(
            inspirationMediaOverlayButtonClass,
            inspirationMediaOverlayButtonHiddenClass,
            "top-2.5 left-2.5",
            showControls && "pointer-events-auto opacity-100",
          )}
        >
          <ArrowsOutIcon className="size-3.5" />
        </button>
      ) : null}

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pt-10 pb-3 transition-opacity",
          showControls ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            aria-label={isPlaying ? "Pausar" : "Reproducir"}
            onClick={(event) => {
              event.stopPropagation();
              togglePlay();
            }}
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-white hover:bg-white/15"
          >
            {isPlaying ? (
              <PauseIcon className="size-3.5" weight="fill" />
            ) : (
              <PlayIcon className="size-3.5" weight="fill" />
            )}
          </button>

          <span className="w-9 shrink-0 text-[11px] tabular-nums text-white/85">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={(event) => seek(Number(event.target.value))}
            onClick={(event) => event.stopPropagation()}
            aria-label="Posición del video"
            className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-white/25 accent-white [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />

          <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-white/60">
            {formatTime(duration)}
          </span>

          <button
            type="button"
            aria-label={isMuted ? "Activar sonido" : "Silenciar"}
            onClick={(event) => {
              event.stopPropagation();
              toggleMute();
            }}
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-white hover:bg-white/15"
          >
            {isMuted ? (
              <SpeakerSlashIcon className="size-3.5" />
            ) : (
              <SpeakerHighIcon className="size-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
