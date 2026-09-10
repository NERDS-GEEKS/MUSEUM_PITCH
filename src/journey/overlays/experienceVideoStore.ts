/** Served from `public/videos` so Render/GitHub never bundle the 174MB master file. */
export const MUSEUM_VIDEO_SRC = "/videos/navme-museums.mp4";

/** Autoplay helpers: browsers may reject, jsdom may return undefined. */
export function playMediaQuietly(media: HTMLMediaElement) {
  try {
    void Promise.resolve(media.play()).catch(() => {});
  } catch {
    /* Ignore autoplay / test-environment failures. */
  }
}

let open = false;
let player: HTMLVideoElement | null = null;
let openedAt = 0;
const listeners = new Set<() => void>();
const OPEN_CLICK_GUARD_MS = 350;

function emit() {
  listeners.forEach((listener) => listener());
}

export function bindExperienceVideoPlayer(el: HTMLVideoElement | null) {
  player = el;
  if (!el || open) return;
  stopPlayer();
}

function stopPlayer() {
  if (!player) return;
  try {
    player.pause();
  } catch {
    /* jsdom */
  }
  try {
    player.currentTime = 0;
  } catch {
    /* jsdom */
  }
}

function playPlayerWithSound() {
  if (!player) return;
  player.muted = false;
  player.defaultMuted = false;
  player.volume = 1;
  try {
    player.currentTime = 0;
  } catch {
    /* jsdom */
  }
  playMediaQuietly(player);
}

export function setExperienceVideoOpen(next: boolean) {
  if (open === next) return;
  open = next;
  if (next) {
    openedAt =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    playPlayerWithSound();
  } else {
    stopPlayer();
  }
  emit();
}

/** Backdrop close — ignore the click that just opened the player. */
export function requestExperienceVideoClose() {
  const now =
    typeof performance !== "undefined" ? performance.now() : Date.now();
  if (now - openedAt < OPEN_CLICK_GUARD_MS) return;
  setExperienceVideoOpen(false);
}

export function subscribeExperienceVideo(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getExperienceVideoOpen() {
  return open;
}
