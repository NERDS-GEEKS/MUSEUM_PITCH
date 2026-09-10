import { JOURNEY_NODES } from "@/journey/constants/nodes";
import { floorForIndex } from "@/journey/path/walkPath";

type Listener = () => void;

export type TravelMode = "route" | "straight";

/**
 * Active hop between docks.
 * - route: adjacent POIs (1↔2) - follow the navigation corridor
 * - straight: skip hops (1→3, etc.) - splash-style straight pan
 */
type TravelSegment = {
  fromT: number;
  toT: number;
  fromIndex: number;
  toIndex: number;
  mode: TravelMode;
};

let segment: TravelSegment | null = null;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener();
}

export function nearestDockIndex(progress: number): number {
  const t = Math.min(1, Math.max(0, progress));
  let best = 0;
  let bestDist = Math.abs(JOURNEY_NODES[0].dockT - t);
  for (let i = 1; i < JOURNEY_NODES.length; i++) {
    const dist = Math.abs(JOURNEY_NODES[i].dockT - t);
    if (dist < bestDist) {
      best = i;
      bestDist = dist;
    }
  }
  return best;
}

/** Snap any progress value to the nearest journey dockT. */
export function nearestDockT(progress: number): number {
  return JOURNEY_NODES[nearestDockIndex(progress)].dockT;
}

export function getTravelSegment(): TravelSegment | null {
  return segment;
}

export function setTravelSegment(fromT: number, toT: number): void {
  const fromIndex = nearestDockIndex(fromT);
  const toIndex = nearestDockIndex(toT);
  const from = JOURNEY_NODES[fromIndex].dockT;
  const to = JOURNEY_NODES[toIndex].dockT;
  const crossesFloor =
    floorForIndex(fromIndex) !== floorForIndex(toIndex);
  const mode: TravelMode =
    Math.abs(toIndex - fromIndex) <= 1 || crossesFloor ? "route" : "straight";
  segment = { fromT: from, toT: to, fromIndex, toIndex, mode };
  emit();
}

export function clearTravelSegment(): void {
  if (!segment) return;
  segment = null;
  emit();
}

export function subscribeTravelSegment(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Blend 0..1 along the active segment.
 * Uses absolute progress mapping so reverse hops work the same as forward.
 */
export function travelBlend(progress: number): number | null {
  if (!segment) return null;
  const span = segment.toT - segment.fromT;
  if (Math.abs(span) < 1e-6) return 1;
  return Math.min(1, Math.max(0, (progress - segment.fromT) / span));
}

/** Skip hop (non-adjacent): hide robot/arrow, straight camera pan. */
export function isStraightSkipHop(): boolean {
  return segment?.mode === "straight";
}

/** Adjacent hop: camera + robot + arrow follow the navigation route. */
export function isRouteHop(): boolean {
  return segment?.mode === "route";
}
