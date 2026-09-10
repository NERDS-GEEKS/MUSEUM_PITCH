import {
  getNextNode,
  getPrevNode,
  JOURNEY_NODES,
} from "@/journey/constants/nodes";
import { closeDestinationDetail } from "@/journey/overlays/destinationDetailStore";
import { useDestinationDetail } from "@/journey/overlays/useDestinationDetail";
import {
  useActiveNodeId,
  useJourneyProgress,
  useJourneyProgressApi,
} from "@/journey/scroll/useJourneyProgress";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const SHOW_MS = 7800;
const HIDE_AFTER_INTERACT_MS = 420;
/** Match Tailwind `lg` - desktop uses “Scroll …”; phone/tablet use “Swipe …”. */
const DESKTOP_MIN_PX = 1024;

const FIRST_POI = JOURNEY_NODES[0]?.id ?? "welcome";
const LAST_POI = JOURNEY_NODES[JOURNEY_NODES.length - 1]?.id ?? "complete";

function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= DESKTOP_MIN_PX : true,
  );

  useEffect(() => {
    const onResize = () => setDesktop(window.innerWidth >= DESKTOP_MIN_PX);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return desktop;
}

/**
 * Travel hint by stop:
 * - POI 1: Swipe/Scroll up only
 * - POI 2 → last before Connect: both up and down
 * - Connect mural: down control lives in the mural footer
 */
export function JourneyScrollGuide() {
  const activeId = useActiveNodeId();
  const progress = useJourneyProgress();
  const { setProgress } = useJourneyProgressApi();
  const { isOpen, close } = useDestinationDetail();
  const isDesktop = useIsDesktop();
  const [visible, setVisible] = useState(false);

  const isFirst = activeId === FIRST_POI;
  const isMural = activeId === LAST_POI;
  const showFloating = !isMural;
  const showDown = showFloating && !isFirst;

  const upLabel = isDesktop ? "Scroll up" : "Swipe up";
  const downLabel = isDesktop ? "Scroll down" : "Swipe down";
  const ariaLabel = showDown ? `${upLabel} · ${downLabel}` : upLabel;

  useEffect(() => {
    if (!showFloating) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [activeId, showFloating, upLabel, showDown]);

  useEffect(() => {
    if (!visible || !showFloating) return;

    let hideTimer = 0;
    const dismiss = () => {
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(
        () => setVisible(false),
        HIDE_AFTER_INTERACT_MS,
      );
    };

    window.addEventListener("wheel", dismiss, { passive: true });
    window.addEventListener("touchmove", dismiss, { passive: true });
    window.addEventListener("keydown", dismiss);
    return () => {
      window.clearTimeout(hideTimer);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchmove", dismiss);
      window.removeEventListener("keydown", dismiss);
    };
  }, [visible, showFloating]);

  const goNext = () => {
    if (isOpen) close();
    else closeDestinationDetail();
    setProgress(getNextNode(progress).dockT);
    setVisible(false);
  };

  const goPrev = () => {
    if (isOpen) close();
    else closeDestinationDetail();
    setProgress(getPrevNode(progress).dockT);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && showFloating ? (
        <motion.div
          key={`scroll-guide-${activeId}-${ariaLabel}`}
          className="pointer-events-none fixed inset-x-0 bottom-[max(1.1rem,env(safe-area-inset-bottom))] z-[55] flex justify-center px-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          role="navigation"
          aria-label={ariaLabel}
        >
          <div className="pointer-events-auto flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-full border border-white/14 bg-[rgba(10,18,36,0.78)] px-4 py-2.5 text-center shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:gap-x-5 sm:px-5 sm:py-3">
            {showDown ? (
              <button
                type="button"
                onClick={goPrev}
                className="flex items-center gap-1.5 text-sm font-semibold leading-none text-nm-text transition-colors hover:text-nm-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-highlight/70 sm:text-[15px]"
                aria-label={`${downLabel} · Previous stop`}
              >
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs text-nm-highlight"
                  aria-hidden
                >
                  ↓
                </span>
                {downLabel}
              </button>
            ) : null}
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-1.5 text-sm font-semibold leading-none text-nm-text transition-colors hover:text-nm-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nm-highlight/70 sm:text-[15px]"
              aria-label={`${upLabel} · Next stop`}
            >
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs text-nm-highlight"
                aria-hidden
              >
                ↑
              </span>
              {upLabel}
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
