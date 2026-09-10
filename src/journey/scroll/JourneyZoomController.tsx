import { getActiveNode, JOURNEY_NODES } from "@/journey/constants/nodes";
import { isInteractiveTarget } from "@/journey/input/isInteractiveTarget";
import {
  beginGalleryGesture,
  endGalleryGesture,
  getGalleryGesture,
  isLookDragging,
  resolveGalleryGesture,
  travelDirFromTouchDy,
  travelDirFromWheelDelta,
} from "@/journey/input/lookDragStore";
import { floorForIndex } from "@/journey/path/walkPath";
import {
  getFinishCredits,
  setFinishCreditsTarget,
} from "@/journey/opening/finishCreditsStore";
import { isBookDemoDetailOpen } from "@/journey/overlays/destinationDetailStore";
import { useJourneyProgressStore } from "@/journey/scroll/useJourneyProgress";
import {
  clearTravelSegment,
  getTravelSegment,
  nearestDockIndex,
  nearestDockT,
  setTravelSegment,
} from "@/journey/scroll/travelSegmentStore";
import { useEffect, useRef } from "react";

/** One clear wheel flick / notch → next stop (slightly easier). */
const WHEEL_STEP_THRESHOLD = 22;
/** Touch swipe distance (px) to change stop. */
const TOUCH_STEP_THRESHOLD = 28;
/** Prevent trackpad inertia from skipping many stops. */
const STEP_COOLDOWN_MS = 480;
/** Short hop (adjacent stop) travel time. */
const MIN_TRAVEL_S = 0.85;
/** Long jump (e.g. Intro → Finish via nav) travel time cap. */
const MAX_TRAVEL_S = 2.8;
const SETTLE_EPS = 0.00008;
const PHONE_MAX_PX = 767;

/** Phone finish mural uses a DOM overlay — do not steal its taps/scroll. */
function isPhoneFinishOverlayActive(): boolean {
  if (typeof window === "undefined") return false;
  if (window.innerWidth > PHONE_MAX_PX) return false;
  return getFinishCredits() > 0.28;
}

function stopIndexForProgress(progress: number): number {
  const active = getActiveNode(progress);
  return Math.max(
    0,
    JOURNEY_NODES.findIndex((n) => n.id === active.id),
  );
}

function clampStopIndex(index: number): number {
  return Math.min(JOURNEY_NODES.length - 1, Math.max(0, index));
}

/** Duration - adjacent corridor walks a bit longer; skip pans stay snappy. */
function travelDuration(from: number, to: number, routeMode: boolean): number {
  const dist = Math.abs(to - from);
  if (dist < 1e-6) return MIN_TRAVEL_S;
  const crossesFloor =
    floorForIndex(nearestDockIndex(from)) !==
    floorForIndex(nearestDockIndex(to));
  if (routeMode && crossesFloor) {
    return Math.min(4.8, Math.max(2.6, dist * 24));
  }
  const raw = routeMode ? dist * 14 : dist * 10.5;
  return Math.min(MAX_TRAVEL_S, Math.max(MIN_TRAVEL_S, raw));
}

/**
 * Free-flow stop navigation: wheel / swipe / HUD travel as straight-line
 * pans between docks (same language as the opening splash), not room snakes.
 */
export function JourneyZoomController({
  enabled = true,
}: {
  enabled?: boolean;
}) {
  const store = useJourneyProgressStore();
  const targetRef = useRef(store.progress);
  const speedRef = useRef(0.25);
  const wheelAccRef = useRef(0);
  const touchYRef = useRef<number | null>(null);
  const touchAccRef = useRef(0);
  const ignoreGestureRef = useRef(false);
  const lastStepAtRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    targetRef.current = store.progress;

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const tick = (ts: number) => {
      rafRef.current = null;
      const prev = lastTsRef.current || ts;
      lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0.001, (ts - prev) / 1000));

      const current = store.progress;
      const target = targetRef.current;
      const remaining = target - current;
      const dist = Math.abs(remaining);

      if (dist < SETTLE_EPS) {
        store.setProgress(target, { immediate: true });
        store.setTravelIntent(0);
        clearTravelSegment();
        lastTsRef.current = 0;
        speedRef.current = 0;
        return;
      }

      const step = Math.min(dist, speedRef.current * dt);
      const next = current + Math.sign(remaining) * step;
      store.setTravelIntent(remaining < 0 ? -1 : 1);
      store.setProgress(next, { immediate: true, silent: true });
      rafRef.current = window.requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (rafRef.current == null) {
        lastTsRef.current = 0;
        rafRef.current = window.requestAnimationFrame(tick);
      }
    };

    const beginTravel = (to: number) => {
      // Always hop dock→dock (snap), never start from a mid-corridor progress.
      const fromDock = nearestDockT(store.progress);
      const toDock = nearestDockT(to);
      if (Math.abs(store.progress - fromDock) > 0.0005) {
        store.setProgress(fromDock, { immediate: true, silent: true });
      }
      targetRef.current = toDock;
      setTravelSegment(fromDock, toDock);
      const seg = getTravelSegment();
      const routeMode = seg?.mode === "route";
      const dur = travelDuration(fromDock, toDock, Boolean(routeMode));
      const dist = Math.abs(toDock - fromDock);
      speedRef.current = dist < 1e-6 ? 0.25 : dist / dur;
      store.setTravelIntent(
        toDock < fromDock - 1e-6 ? -1 : toDock > fromDock + 1e-6 ? 1 : 0,
      );
      const completeT =
        JOURNEY_NODES.find((n) => n.id === "complete")?.dockT ?? 1;
      if (toDock < completeT - 0.02) {
        setFinishCreditsTarget(0);
      }
      wheelAccRef.current = 0;
      touchAccRef.current = 0;
      schedule();
    };

    const goToStop = (index: number) => {
      const i = clampStopIndex(index);
      beginTravel(JOURNEY_NODES[i].dockT);
    };

    const canStep = () =>
      performance.now() - lastStepAtRef.current >= STEP_COOLDOWN_MS;

    const step = (dir: 1 | -1) => {
      if (!canStep()) return;
      lastStepAtRef.current = performance.now();
      const current = store.progress;
      const busy = Math.abs(targetRef.current - current) > 0.003;
      const baseProgress = busy ? targetRef.current : current;
      const idx = stopIndexForProgress(baseProgress);
      const node = JOURNEY_NODES[idx];

      // First POI: swipe / scroll up only (no previous stop).
      if (idx === 0 && dir === -1) return;

      // Connect mural: swipe / scroll down leaves; up does nothing (end of journey).
      if (node?.id === "complete") {
        if (dir === -1) goToStop(idx - 1);
        return;
      }

      goToStop(idx + dir);
    };

    const animateTo = (t: number) => {
      beginTravel(t);
    };

    store.bindScrollAnimator(animateTo);

    const onWheel = (event: WheelEvent) => {
      if (isPhoneFinishOverlayActive()) return;
      if (isInteractiveTarget(event.target)) return;
      event.preventDefault();
      if (!enabledRef.current) return;
      if (isBookDemoDetailOpen()) return;

      const delta =
        Math.sign(event.deltaY) * Math.min(Math.abs(event.deltaY), 100);
      wheelAccRef.current += delta;

      if (Math.abs(wheelAccRef.current) >= WHEEL_STEP_THRESHOLD) {
        const dir = travelDirFromWheelDelta(wheelAccRef.current);
        wheelAccRef.current = 0;
        step(dir);
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      if (!enabledRef.current) return;
      if (isBookDemoDetailOpen()) return;
      if (
        isPhoneFinishOverlayActive() ||
        isInteractiveTarget(event.target)
      ) {
        ignoreGestureRef.current = true;
        touchYRef.current = null;
        touchAccRef.current = 0;
        return;
      }
      ignoreGestureRef.current = false;
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      touchYRef.current = touch.clientY;
      touchAccRef.current = 0;
      beginGalleryGesture(touch.clientX, touch.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!enabledRef.current) return;
      if (isBookDemoDetailOpen()) return;
      if (ignoreGestureRef.current || isPhoneFinishOverlayActive()) return;
      if (touchYRef.current == null) return;
      if (event.touches.length !== 1) return;
      if (isLookDragging()) return;

      const touch = event.touches[0];
      const gesture = resolveGalleryGesture(
        touch.clientX,
        touch.clientY,
        "touch",
      );
      switch (gesture) {
        case "idle":
          return;
        case "look":
          return;
        case "travel":
          break;
        default: {
          const _exhaustive: never = gesture;
          return _exhaustive;
        }
      }

      event.preventDefault();
      const y = touch.clientY;
      const dy = touchYRef.current - y;
      touchYRef.current = y;
      touchAccRef.current += dy;

      if (Math.abs(touchAccRef.current) >= TOUCH_STEP_THRESHOLD) {
        const dir = travelDirFromTouchDy(touchAccRef.current);
        touchAccRef.current = 0;
        step(dir);
      }
    };

    const onTouchEnd = () => {
      ignoreGestureRef.current = false;
      touchYRef.current = null;
      touchAccRef.current = 0;
      if (getGalleryGesture() !== "look") {
        endGalleryGesture();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      store.bindScrollAnimator(null);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [store]);

  useEffect(() => {
    if (!enabled) return;
    targetRef.current = store.progress;
    wheelAccRef.current = 0;
    touchAccRef.current = 0;
    ignoreGestureRef.current = false;
  }, [enabled, store]);

  return null;
}
