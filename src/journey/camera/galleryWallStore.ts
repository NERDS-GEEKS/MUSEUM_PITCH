import { JOURNEY_NODES } from "@/journey/constants/nodes";
import { useSyncExternalStore } from "react";

/**
 * Welcome has two in-room beats: the left video wall, then the right story wall.
 * Other galleries only use the right (content) wall.
 */
export type WelcomeBeat = "video" | "story";

type Listener = () => void;

let welcomeBeat: WelcomeBeat = "video";
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener();
}

export function getWelcomeBeat(): WelcomeBeat {
  return welcomeBeat;
}

export function setWelcomeBeat(next: WelcomeBeat): void {
  if (next === welcomeBeat) return;
  welcomeBeat = next;
  emit();
}

export function subscribeWelcomeBeat(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useWelcomeBeat(): WelcomeBeat {
  return useSyncExternalStore(
    subscribeWelcomeBeat,
    getWelcomeBeat,
    getWelcomeBeat,
  );
}

export function getGalleryWallForRoom(roomId: string): "left" | "right" {
  if (roomId === "welcome") {
    return welcomeBeat === "video" ? "left" : "right";
  }
  return "right";
}

export type GalleryStep = {
  stopIndex: number;
  welcomeBeat: WelcomeBeat;
};

/**
 * Next / previous stop, including Welcome's extra in-room wall beat.
 * `null` means the journey is already at that end.
 */
export function resolveGalleryStep(
  dir: 1 | -1,
  index: number,
): GalleryStep | null {
  const node = JOURNEY_NODES[index];
  if (!node) return null;

  if (node.id === "complete") {
    if (dir === -1) {
      return { stopIndex: index - 1, welcomeBeat };
    }
    return null;
  }

  if (node.id === "welcome") {
    switch (welcomeBeat) {
      case "video":
        if (dir === 1) return { stopIndex: index, welcomeBeat: "story" };
        return null;
      case "story":
        if (dir === 1) {
          return { stopIndex: index + 1, welcomeBeat: "story" };
        }
        return { stopIndex: index, welcomeBeat: "video" };
      default: {
        const _exhaustive: never = welcomeBeat;
        return _exhaustive;
      }
    }
  }

  const nextIndex = index + dir;
  if (nextIndex < 0 || nextIndex >= JOURNEY_NODES.length) return null;
  if (nextIndex === 0 && dir === -1) {
    return { stopIndex: 0, welcomeBeat: "story" };
  }
  return {
    stopIndex: nextIndex,
    welcomeBeat: nextIndex === 0 ? "video" : welcomeBeat,
  };
}
