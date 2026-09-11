import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  getExperienceVideoOpen,
  MUSEUM_VIDEO_SRC,
  playMediaQuietly,
  setExperienceVideoOpen,
  subscribeExperienceVideo,
} from "@/journey/overlays/experienceVideoStore";
import { useEffect, useRef, useSyncExternalStore } from "react";

/** Muted looping preview — click opens the soundtrack player. */
export function WelcomeVideoPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const modalOpen = useSyncExternalStore(
    subscribeExperienceVideo,
    getExperienceVideoOpen,
    getExperienceVideoOpen,
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    if (modalOpen || reducedMotion) {
      video.pause();
      return;
    }
    playMediaQuietly(video);
  }, [modalOpen, reducedMotion]);

  return (
    <button
      type="button"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={() => setExperienceVideoOpen(true)}
      className="group relative block h-full w-full overflow-hidden bg-black text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-highlight/80"
      aria-label="Play video with sound"
    >
      <video
        ref={videoRef}
        className="pointer-events-none h-full w-full object-cover"
        src={MUSEUM_VIDEO_SRC}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-hidden
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/35 bg-black/55 text-white shadow-lg backdrop-blur-sm transition-transform group-hover:scale-105">
          <svg viewBox="0 0 20 20" className="ml-0.5 h-6 w-6" aria-hidden>
            <path fill="currentColor" d="M6.5 4.8v10.4L16 10 6.5 4.8Z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
