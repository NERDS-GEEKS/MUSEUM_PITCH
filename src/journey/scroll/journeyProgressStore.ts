import { getActiveNode } from "@/journey/constants/nodes";

export type JourneyProgressApi = {
  progress: number;
  setProgress: (
    t: number,
    opts?: { immediate?: boolean; silent?: boolean },
  ) => void;
  subscribe: (fn: (t: number) => void) => () => void;
};

export type JourneyProgressStore = JourneyProgressApi & {
  /** Wire scroll animation for non-immediate setProgress (HUD jumps). */
  bindScrollAnimator: (fn: ((t: number) => void) | null) => void;
  /**
   * Travel intent along the route: +1 forward, −1 reverse, 0 idle.
   * Used so the companion can face the camera while returning.
   */
  travelIntent: -1 | 0 | 1;
  setTravelIntent: (dir: -1 | 0 | 1) => void;
  /** Mute React subscribers (opening pan) - 3D still reads progress live. */
  setUiMuted: (muted: boolean) => void;
};

function clamp01(t: number): number {
  if (Number.isNaN(t)) return 0;
  return Math.min(1, Math.max(0, t));
}

export function createJourneyProgressStore(): JourneyProgressStore {
  let progress = 0;
  let travelIntent: -1 | 0 | 1 = 0;
  let lastNotifiedNodeId = getActiveNode(0).id;
  let uiMuted = false;
  const listeners = new Set<(t: number) => void>();
  let scrollAnimator: ((t: number) => void) | null = null;

  const notify = () => {
    if (uiMuted) return;
    for (const fn of listeners) {
      fn(progress);
    }
  };

  const setImmediate = (t: number, silent: boolean) => {
    const next = clamp01(t);
    if (next === progress) return;
    progress = next;
    if (uiMuted) return;
    if (silent) {
      const nodeId = getActiveNode(next).id;
      if (nodeId !== lastNotifiedNodeId) {
        lastNotifiedNodeId = nodeId;
        notify();
      }
      return;
    }
    lastNotifiedNodeId = getActiveNode(next).id;
    notify();
  };

  const api: JourneyProgressStore = {
    get progress() {
      return progress;
    },
    get travelIntent() {
      return travelIntent;
    },
    setTravelIntent(dir) {
      if (travelIntent === dir) return;
      travelIntent = dir;
      notify();
    },
    setUiMuted(muted) {
      uiMuted = muted;
      if (!muted) {
        lastNotifiedNodeId = getActiveNode(progress).id;
        notify();
      }
    },
    setProgress(t, opts) {
      const next = clamp01(t);
      if (opts?.immediate || !scrollAnimator) {
        setImmediate(next, Boolean(opts?.silent));
        return;
      }
      scrollAnimator(next);
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    bindScrollAnimator(fn) {
      scrollAnimator = fn;
    },
  };

  return api;
}
