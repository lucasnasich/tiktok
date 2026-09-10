export type VideoPlaybackHandoff = {
  currentTime: number;
  wasPlaying: boolean;
  muted: boolean;
};

let activeVideo: HTMLVideoElement | null = null;

export function onVideoPlay(video: HTMLVideoElement) {
  if (activeVideo && activeVideo !== video && !activeVideo.paused) {
    activeVideo.pause();
  }
  activeVideo = video;
}

export function onVideoPause(video: HTMLVideoElement) {
  if (activeVideo === video) {
    activeVideo = null;
  }
}
