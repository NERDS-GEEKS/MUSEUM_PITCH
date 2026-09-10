import {
  getActiveNode,
  JOURNEY_NODES,
} from "@/journey/constants/nodes";
import { setFinishCreditsTarget } from "@/journey/opening/finishCreditsStore";
import { BillboardArt } from "@/journey/overlays/BillboardArt";
import { DESTINATION_CARDS } from "@/journey/overlays/cards";
import {
  getNodeScreenAnchor,
  subscribeNodeScreenAnchor,
} from "@/journey/overlays/nodeScreenAnchor";
import { useDestinationDetail } from "@/journey/overlays/useDestinationDetail";
import {
  useDockBandKey,
  useJourneyProgressStore,
} from "@/journey/scroll/useJourneyProgress";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";

/** Progress must be this close to dockT - only after the walk lands. */
const ARRIVE_EPS = 0.005;
/** Brief beat after landing before glass UI appears. */
const REVEAL_DELAY_MS = 320;
/** Extra beat before finish wall credits (zoom + footer). */
const FINISH_CREDITS_DELAY_MS = 420;

/** True when travel has settled on the active dock (no per-frame React thrash). */
function useArrivedAtDock(): boolean {
  const store = useJourneyProgressStore();
  return useSyncExternalStore(
    (onStoreChange) => store.subscribe(() => onStoreChange()),
    () => {
      if (store.travelIntent !== 0) return false;
      const node = getActiveNode(store.progress);
      return Math.abs(store.progress - node.dockT) <= ARRIVE_EPS;
    },
    () => false,
  );
}

function useNodeScreenAnchor() {
  return useSyncExternalStore(
    subscribeNodeScreenAnchor,
    getNodeScreenAnchor,
    getNodeScreenAnchor,
  );
}

/** Lower-center fallback when the robot is off-screen. */
function fallbackOrigin() {
  const vw = typeof window === "undefined" ? 1200 : window.innerWidth;
  const vh = typeof window === "undefined" ? 800 : window.innerHeight;
  return { x: vw * 0.58, y: vh * 0.62 };
}

function clampOrigin(x: number, y: number) {
  const vw = typeof window === "undefined" ? 1200 : window.innerWidth;
  const vh = typeof window === "undefined" ? 800 : window.innerHeight;
  return {
    x: Math.min(vw - 24, Math.max(24, x)),
    y: Math.min(vh - 48, Math.max(vh * 0.28, y)),
  };
}

/**
 * Billboard callout: robot head → elbow → into the glass panel.
 * Keeps measuring while open so the line stays locked to Nav.
 */
function BillboardCallout({
  originX,
  originY,
  boardRef,
}: {
  originX: number;
  originY: number;
  boardRef: RefObject<HTMLDivElement | null>;
}) {
  const [attach, setAttach] = useState<{ x: number; y: number } | null>(null);
  const origin = clampOrigin(originX, originY);

  useLayoutEffect(() => {
    let raf = 0;
    let alive = true;
    let lastX = Number.NaN;
    let lastY = Number.NaN;

    const measure = () => {
      if (!alive) return;
      const el = boardRef.current;
      if (!el) {
        if (lastX === lastX) {
          lastX = Number.NaN;
          lastY = Number.NaN;
          setAttach(null);
        }
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) {
        if (lastX === lastX) {
          lastX = Number.NaN;
          lastY = Number.NaN;
          setAttach(null);
        }
        return;
      }

      const vw = window.innerWidth;
      const fullBleed = rect.width > vw * 0.72;
      // Desktop / side panel: dock into the left edge.
      // Mobile full-width: dock into the bottom center above the robot.
      const nextX = fullBleed ? rect.left + rect.width * 0.5 : rect.left;
      const nextY = fullBleed
        ? rect.bottom
        : rect.top + Math.min(52, rect.height * 0.16);

      if (
        Math.abs(nextX - lastX) < 0.5 &&
        Math.abs(nextY - lastY) < 0.5
      ) {
        return;
      }
      lastX = nextX;
      lastY = nextY;
      setAttach({ x: nextX, y: nextY });
    };

    const tick = () => {
      measure();
      raf = requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener("resize", measure);
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    if (boardRef.current) ro?.observe(boardRef.current);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, [boardRef, origin.x, origin.y]);

  if (!attach) return null;

  const attachX = attach.x;
  const attachY = attach.y;
  const fromBelow = attachY >= origin.y - 8;
  const elbowX = fromBelow
    ? origin.x
    : Math.min(Math.max(origin.x + 36, attachX - 48), attachX - 14);
  const elbowY = fromBelow
    ? Math.min(origin.y + (attachY - origin.y) * 0.45, attachY - 12)
    : attachY;
  const d = fromBelow
    ? `M ${origin.x} ${origin.y} L ${elbowX} ${elbowY} L ${attachX} ${attachY}`
    : `M ${origin.x} ${origin.y} L ${elbowX} ${origin.y} L ${elbowX} ${elbowY} L ${attachX} ${attachY}`;

  return (
    <svg
      className="pointer-events-none fixed inset-0 z-[20] h-full w-full overflow-visible"
      aria-hidden
    >
      <defs>
        <linearGradient id="nm-callout-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c4a574" stopOpacity="1" />
          <stop offset="100%" stopColor="#6ecfc8" stopOpacity="1" />
        </linearGradient>
        <filter id="nm-callout-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Soft under-stroke for contrast on lit corridor */}
      <path
        d={d}
        fill="none"
        stroke="rgba(8,16,36,0.55)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={d}
        fill="none"
        stroke="url(#nm-callout-stroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        filter="url(#nm-callout-glow)"
      />
      <circle
        cx={origin.x}
        cy={origin.y}
        r="6"
        fill="#c4a574"
        stroke="#6ecfc8"
        strokeWidth="2.5"
      />
      <circle
        cx={origin.x}
        cy={origin.y}
        r="13"
        fill="none"
        stroke="#c4a574"
        strokeOpacity="0.45"
        strokeWidth="1.75"
      />
      <circle cx={attachX} cy={attachY} r="4" fill="#6ecfc8" />
    </svg>
  );
}

/**
 * Docked section details open as a top-right billboard with a callout line
 * from the landmark - only after the walk has fully arrived at the stop.
 */

/** Match Tailwind `md` - below this, panels are full-width and capped above the robot. */
const PANEL_DESKTOP_MIN_PX = 768;
/** Clearance between panel bottom and robot head. */
const PANEL_ABOVE_HEAD_GAP_PX = 12;
const PANEL_MIN_HEIGHT_PX = 140;
/** Matches `top-[max(4.25rem,…)]` band start for destination panels. */
const PANEL_BAND_TOP_DEFAULT_PX = 68;
const PANEL_BAND_TOP_DEMO_PX = 60;

type PanelMobileFrame = {
  top: number;
  height: number;
};

function readSafeAreaTop(): number {
  if (typeof window === "undefined") return 0;
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;top:0;left:0;visibility:hidden;padding-top:env(safe-area-inset-top)";
  document.body.appendChild(probe);
  const pad = Number.parseFloat(getComputedStyle(probe).paddingTop) || 0;
  probe.remove();
  return pad;
}

/**
 * Mobile panel band: HUD → above robot head.
 * Height is locked after the first solid reading so robot bob does not
 * resize the shell and flicker the scrollbar (especially Book Demo).
 */
function usePanelMobileFrame(
  active: boolean,
  headY: number,
  headVisible: boolean,
  isDemo: boolean,
): PanelMobileFrame | null {
  const [frame, setFrame] = useState<PanelMobileFrame | null>(null);
  const lockedRef = useRef(false);

  useLayoutEffect(() => {
    if (!active) {
      lockedRef.current = false;
      setFrame(null);
      return;
    }

    const measure = (allowLock: boolean) => {
      if (window.innerWidth >= PANEL_DESKTOP_MIN_PX) {
        lockedRef.current = false;
        setFrame(null);
        return;
      }
      if (lockedRef.current) return;

      const safeTop = readSafeAreaTop();
      const top = Math.max(
        isDemo ? PANEL_BAND_TOP_DEMO_PX : PANEL_BAND_TOP_DEFAULT_PX,
        safeTop + (isDemo ? 45.6 : 53.6),
      );
      const bandBottom = headVisible
        ? headY
        : window.innerHeight * 0.52;
      const height = Math.max(
        PANEL_MIN_HEIGHT_PX,
        bandBottom - PANEL_ABOVE_HEAD_GAP_PX - top,
      );
      setFrame({ top, height });
      if (allowLock && headVisible) lockedRef.current = true;
    };

    measure(true);

    const onResize = () => {
      lockedRef.current = false;
      measure(true);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [active, isDemo]);

  // One catch-up when the robot first becomes visible after the panel opens.
  useLayoutEffect(() => {
    if (!active || !headVisible || lockedRef.current) return;
    if (window.innerWidth >= PANEL_DESKTOP_MIN_PX) return;

    const safeTop = readSafeAreaTop();
    const top = Math.max(
      isDemo ? PANEL_BAND_TOP_DEMO_PX : PANEL_BAND_TOP_DEFAULT_PX,
      safeTop + (isDemo ? 45.6 : 53.6),
    );
    const height = Math.max(
      PANEL_MIN_HEIGHT_PX,
      headY - PANEL_ABOVE_HEAD_GAP_PX - top,
    );
    setFrame({ top, height });
    lockedRef.current = true;
  }, [active, headVisible, headY, isDemo]);

  return frame;
}

export function DestinationStage() {
  const dockKey = useDockBandKey();
  const arrived = useArrivedAtDock();
  const anchor = useNodeScreenAnchor();
  const { openId, open, close, isOpen } = useDestinationDetail();
  const boardRef = useRef<HTMLDivElement>(null);
  const [reveal, setReveal] = useState(false);

  const { node } = useMemo(() => {
    const [id] = dockKey.split(":");
    const found =
      JOURNEY_NODES.find((n) => n.id === id) ?? getActiveNode(0);
    return { node: found };
  }, [dockKey]);

  const isFinish = node.id === "complete";

  useEffect(() => {
    if (!arrived) {
      setReveal(false);
      return;
    }
    const timer = window.setTimeout(() => setReveal(true), REVEAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [arrived, node.id]);

  // Finish: zoom-in + logo shrink + wall footer (no destination card / image)
  useEffect(() => {
    if (!reveal || !arrived || !isFinish) {
      if (!isFinish) setFinishCreditsTarget(0);
      return;
    }
    const timer = window.setTimeout(() => {
      setFinishCreditsTarget(1);
    }, FINISH_CREDITS_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [reveal, arrived, isFinish]);

  const detailNode =
    openId != null
      ? (JOURNEY_NODES.find((n) => n.id === openId) ?? null)
      : null;
  const DetailCard =
    openId && openId !== "complete" ? DESTINATION_CARDS[openId] : null;

  /** Glass panel + art + callout only after arrival reveal (not on finish). */
  const sectionOpen =
    reveal &&
    arrived &&
    isOpen &&
    openId === node.id &&
    DetailCard != null &&
    !isFinish;

  const mobileFrame = usePanelMobileFrame(
    sectionOpen,
    anchor.y,
    anchor.visible && anchor.nodeId === node.id,
    node.id === "welcome",
  );

  const calloutOrigin = useMemo(() => {
    if (
      anchor.visible &&
      anchor.nodeId === node.id &&
      Number.isFinite(anchor.x) &&
      Number.isFinite(anchor.y)
    ) {
      return clampOrigin(anchor.x, anchor.y);
    }
    return fallbackOrigin();
  }, [anchor.visible, anchor.nodeId, anchor.x, anchor.y, node.id]);

  useEffect(() => {
    if (!reveal || !arrived) return;
    if (isFinish) {
      close();
      return;
    }
    open(node.id);
  }, [reveal, arrived, node.id, open, close, isFinish]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  useEffect(() => {
    if ((!arrived || !reveal) && isOpen) close();
  }, [arrived, reveal, isOpen, close]);

  return (
    <>
      {/* Callout behind the WebGL canvas so the robot sits in front of the line. */}
      {sectionOpen && DetailCard ? (
        <BillboardCallout
          originX={calloutOrigin.x}
          originY={calloutOrigin.y}
          boardRef={boardRef}
        />
      ) : null}

      <div className="pointer-events-none fixed inset-0 z-[70]">
        {/* Left thematic art - only after landing */}
        <AnimatePresence>
          {sectionOpen ? (
            <motion.div
              key={`billboard-art-${node.id}`}
              className="pointer-events-none absolute bottom-16 left-0 top-16 z-[71] hidden w-[min(32vw,16rem)] origin-left scale-[0.78] md:block md:w-[min(34vw,20rem)] md:scale-[0.86] lg:bottom-20 lg:top-20 lg:w-[min(36vw,24rem)] lg:scale-95 xl:bottom-24 xl:top-24 xl:w-[min(42vw,32rem)] xl:scale-100 2xl:w-[min(42vw,34rem)] [@media(max-height:760px)]:scale-[0.8] xl:[@media(max-height:760px)]:scale-[0.9]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <BillboardArt nodeId={node.id} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Top-right glass panel - only after landing */}
        <AnimatePresence>
          {sectionOpen && DetailCard ? (
            <motion.div
              key={`detail-panel-${node.id}`}
              className="pointer-events-none absolute inset-0 z-[72]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-label={detailNode?.title ?? node.title}
            >
              <motion.div
                className={cn(
                  "pointer-events-auto absolute z-[74]",
                  mobileFrame
                    ? "left-2 right-2 flex w-auto items-center"
                    : node.id === "welcome"
                        ? "left-2 right-2 top-[max(4.25rem,calc(env(safe-area-inset-top)+3.35rem))] w-auto origin-top-left sm:top-16 md:left-auto md:right-4 md:w-[min(48vw,36rem)] md:origin-top-right lg:right-5 lg:top-[4.5rem] lg:w-[min(46vw,40rem)] xl:w-[min(44vw,42rem)]"
                        : "left-2 right-2 top-[max(4.25rem,calc(env(safe-area-inset-top)+3.35rem))] w-auto origin-top-left sm:top-16 md:left-auto md:right-4 md:w-[min(42vw,28rem)] md:origin-top-right lg:right-5 lg:top-[4.5rem] lg:w-[min(40vw,32rem)] xl:w-[min(38vw,36rem)]",
                )}
                style={
                  mobileFrame
                    ? { top: mobileFrame.top, height: mobileFrame.height }
                    : undefined
                }
                initial={{
                  opacity: 0,
                  x: node.id === "welcome" ? 0 : -28,
                  y: node.id === "welcome" ? 0 : -8,
                }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{
                  opacity: 0,
                  x: node.id === "welcome" ? 0 : -16,
                  y: node.id === "welcome" ? 0 : -4,
                }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  ref={boardRef}
                  className={cn(
                    "relative w-full min-w-0 overflow-x-hidden",
                    node.id === "welcome"
                      ? "overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                      : cn(
                          "overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                          mobileFrame
                            ? "max-h-full overflow-y-auto"
                            : "overflow-y-auto",
                        ),
                    // Short phones: shrink the whole panel so it fits above the robot.
                    "origin-top [@media(max-height:720px)]:scale-[0.92] [@media(max-height:640px)]:scale-[0.86]",
                    node.id === "welcome"
                        ? "md:ml-auto md:mr-0 md:origin-top-right"
                        : "md:ml-auto md:mr-0 md:origin-top-right md:scale-[0.82] lg:scale-[0.92] xl:scale-100 md:[@media(max-height:680px)]:scale-[0.72]",
                  )}
                  style={
                    node.id === "welcome"
                      ? { overflow: "hidden", maxHeight: "none" }
                      : undefined
                  }
                >
                  <div
                    className={cn(
                      "absolute top-8 h-8 w-1 rounded-full bg-gradient-to-b from-nm-primary to-nm-highlight md:top-10 md:h-10",
                      "-right-px md:-left-px md:right-auto",
                    )}
                    aria-hidden
                  />
                  <DetailCard />
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}
