import { ROOM_DOCK_T, STORY_ROOMS } from "@/journey/path/walkPath";

export type NodePolish = "peak" | "lighter";

export type JourneyNode = {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  body: string;
  polish: NodePolish;
  /** Center of soft-dock band on progress 0..1 */
  dockT: number;
  /** Half-width of soft-dock band */
  dockRadius: number;
  /** 3D waypoint at room center */
  position: [number, number, number];
};

const PEAK_DOCK_RADIUS = 0.042;
const LIGHTER_DOCK_RADIUS = 0.036;

function node(
  id: string,
  index: number,
  title: string,
  subtitle: string,
  body: string,
  polish: NodePolish,
): JourneyNode {
  const room = STORY_ROOMS[index - 1];
  const dockT = ROOM_DOCK_T[index - 1] ?? 0;
  return {
    id,
    index,
    title,
    subtitle,
    body,
    polish,
    dockT,
    dockRadius: polish === "peak" ? PEAK_DOCK_RADIUS : LIGHTER_DOCK_RADIUS,
    position: room?.center ?? [0, 0, 0],
  };
}

/**
 * Stops at each story room center along the indoor walk path.
 * dockT is arc-length fraction on WALK_WAYPOINTS.
 */
export const JOURNEY_NODES: readonly JourneyNode[] = [
  node(
    "welcome",
    1,
    "NavMe",
    "Welcome",
    "NavMe connects physical museums with a digital experience layer, helping visitors navigate, discover, learn and engage, while enabling museums to understand how their spaces are explored and experienced.",
    "peak",
  ),
  node(
    "gps-fails",
    2,
    "The Museum Starts Where Google Maps Stops.",
    "Problem",
    "Visitors can reach the museum. But once inside, the experience becomes physical, fragmented and often difficult to navigate.",
    "peak",
  ),
  node(
    "vps",
    3,
    "Turn Your Museum Into a Guided Experience",
    "Solution",
    "NavMe adds a digital layer to your physical museum directly through the visitor's smartphone browser. No App. No Download. No Additional Hardware.",
    "peak",
  ),
  node(
    "mapping",
    4,
    "Don't Just Show Visitors the Way. Give Them a Reason to Explore.",
    "Guide",
    'From "Where do I go?" to "What can I discover next?": Find, Discover, Learn, Engage, and Continue through every gallery.',
    "peak",
  ),
  node(
    "analytics",
    5,
    "Every Visitor Journey Becomes an Insight",
    "Insights",
    "NavMe isn't only visitor-facing. Museum teams gain meaningful spatial intelligence about how their physical spaces are explored.",
    "lighter",
  ),
  node(
    "industries",
    6,
    "Transform Traditional Museums into AR Museums",
    "Benefits",
    "Physical Museum → Digital Twin → AR Experience Layer → Intelligent Museum: the complete museum transformation.",
    "peak",
  ),
  node(
    "complete",
    7,
    "The Future Museum Is Phygital",
    "Connect",
    "Turn a static physical space into a living, interactive and measurable destination.",
    "peak",
  ),
] as const;

export function getActiveNode(progress: number): JourneyNode {
  const clamped = Math.min(1, Math.max(0, progress));

  for (const journeyNode of JOURNEY_NODES) {
    const distance = Math.abs(clamped - journeyNode.dockT);
    if (distance <= journeyNode.dockRadius) {
      return journeyNode;
    }
  }

  let nearest = JOURNEY_NODES[0];
  let nearestDistance = Math.abs(clamped - nearest.dockT);

  for (const journeyNode of JOURNEY_NODES) {
    const distance = Math.abs(clamped - journeyNode.dockT);
    if (distance < nearestDistance) {
      nearest = journeyNode;
      nearestDistance = distance;
    }
  }

  return nearest;
}

/** Close enough to a dock, and not mid-walk, to reveal that room's page. */
export const ARRIVE_EPS = 0.005;

export function isArrivedAtDock(
  progress: number,
  travelIntent: -1 | 0 | 1,
): boolean {
  if (travelIntent !== 0) return false;
  const node = getActiveNode(progress);
  return Math.abs(progress - node.dockT) <= ARRIVE_EPS;
}

export function getNodeProgress(progress: number, node: JourneyNode): number {
  const clamped = Math.min(1, Math.max(0, progress));
  if (Math.abs(clamped - node.dockT) > node.dockRadius) {
    return 0;
  }
  const local =
    (clamped - (node.dockT - node.dockRadius)) / (2 * node.dockRadius);
  return Math.min(1, Math.max(0, local));
}

/** Next destination ahead of progress (or last node when complete). */
export function getNextNode(progress: number): JourneyNode {
  const clamped = Math.min(1, Math.max(0, progress));
  for (const journeyNode of JOURNEY_NODES) {
    if (journeyNode.dockT > clamped + 0.002) {
      return journeyNode;
    }
  }
  return JOURNEY_NODES[JOURNEY_NODES.length - 1];
}

/** Previous destination behind progress (or first node at start). */
export function getPrevNode(progress: number): JourneyNode {
  const clamped = Math.min(1, Math.max(0, progress));
  for (let i = JOURNEY_NODES.length - 1; i >= 0; i--) {
    const journeyNode = JOURNEY_NODES[i];
    if (journeyNode.dockT < clamped - 0.002) {
      return journeyNode;
    }
  }
  return JOURNEY_NODES[0];
}

export type GuidanceStatus = {
  next: JourneyNode;
  /** Approximate remaining “meters” along remaining dock span (illustrative). */
  metersRemaining: number;
  approaching: boolean;
  label: string;
};

const ROUTE_METERS = 420;

export function getGuidanceStatus(progress: number): GuidanceStatus {
  const clamped = Math.min(1, Math.max(0, progress));
  const next = getNextNode(clamped);
  const active = getActiveNode(clamped);
  const approaching =
    Math.abs(clamped - next.dockT) <= next.dockRadius * 1.35 ||
    active.id === next.id;
  const metersRemaining = Math.max(
    0,
    Math.round((next.dockT - clamped) * ROUTE_METERS),
  );

  let label: string;
  if (clamped >= 0.97) {
    label = "Destination reached";
  } else if (approaching) {
    label =
      metersRemaining <= 8
        ? `Arriving · ${next.title}`
        : `Approaching ${next.title} · ${metersRemaining}m`;
  } else {
    label = `Next · ${next.title} · ${metersRemaining}m`;
  }

  return { next, metersRemaining, approaching, label };
}
