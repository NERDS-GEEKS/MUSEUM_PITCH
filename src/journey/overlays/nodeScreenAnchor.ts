export type NodeScreenAnchor = {
  nodeId: string;
  /** CSS px from viewport left */
  x: number;
  /** CSS px from viewport top */
  y: number;
  /** Landmark is in dock band and in front of the camera */
  visible: boolean;
};

const DEFAULT_ANCHOR: NodeScreenAnchor = {
  nodeId: "",
  x: 0,
  y: 0,
  visible: false,
};

type Listener = () => void;

let anchor: NodeScreenAnchor = DEFAULT_ANCHOR;
const listeners = new Set<Listener>();

export function getNodeScreenAnchor(): NodeScreenAnchor {
  return anchor;
}

export function setNodeScreenAnchor(next: NodeScreenAnchor): void {
  const prev = anchor;
  if (
    prev.nodeId === next.nodeId &&
    prev.visible === next.visible &&
    Math.abs(prev.x - next.x) < 0.5 &&
    Math.abs(prev.y - next.y) < 0.5
  ) {
    return;
  }
  anchor = next;
  for (const listener of listeners) listener();
}

export function subscribeNodeScreenAnchor(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
