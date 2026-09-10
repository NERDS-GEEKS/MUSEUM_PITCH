import {
  bindExperienceVideoPlayer,
  getExperienceVideoOpen,
  MUSEUM_VIDEO_SRC,
  requestExperienceVideoClose,
  setExperienceVideoOpen,
  subscribeExperienceVideo,
} from "@/journey/overlays/experienceVideoStore";
import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

export function ExperienceVideoModal() {
  const open = useSyncExternalStore(
    subscribeExperienceVideo,
    getExperienceVideoOpen,
    getExperienceVideoOpen,
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    bindExperienceVideoPlayer(videoRef.current);
    return () => bindExperienceVideoPlayer(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExperienceVideoOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={
        open
          ? "fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8"
          : "pointer-events-none invisible fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8"
      }
      aria-hidden={!open}
      inert={!open}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close video"
        onClick={() => requestExperienceVideoClose()}
      />
      <div
        className="relative z-10 w-[min(52rem,92vw)] overflow-hidden rounded-2xl border border-white/18 bg-[rgba(18,16,14,0.96)] shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
        aria-label="See NavMe in action"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5 sm:px-5">
          <p className="truncate text-sm font-medium text-nm-text">
            See in Action
          </p>
          <button
            type="button"
            onClick={() => setExperienceVideoOpen(false)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-nm-text transition-colors hover:border-nm-primary/50 hover:bg-white/10"
            aria-label="Close video dialog"
          >
            <span className="text-lg leading-none" aria-hidden>
              ×
            </span>
          </button>
        </div>
        <video
          ref={videoRef}
          className="block aspect-video max-h-[min(70vh,36rem)] w-full bg-black"
          src={MUSEUM_VIDEO_SRC}
          controls
          controlsList="nofullscreen nodownload noremoteplayback"
          playsInline
          preload="metadata"
        />
      </div>
    </div>,
    document.body,
  );
}
