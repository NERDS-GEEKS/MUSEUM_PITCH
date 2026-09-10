import { getActiveNode } from "@/journey/constants/nodes";
import {
  createContext,
  createElement,
  useContext,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  createJourneyProgressStore,
  type JourneyProgressApi,
  type JourneyProgressStore,
} from "./journeyProgressStore";

const JourneyProgressContext = createContext<JourneyProgressStore | null>(null);

export function JourneyProgressProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<JourneyProgressStore | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createJourneyProgressStore();
  }

  return createElement(
    JourneyProgressContext.Provider,
    { value: storeRef.current },
    children,
  );
}

function useStore(): JourneyProgressStore {
  const store = useContext(JourneyProgressContext);
  if (!store) {
    throw new Error(
      "useJourneyProgress hooks require JourneyProgressProvider",
    );
  }
  return store;
}

export function useJourneyProgressApi(): JourneyProgressApi {
  return useStore();
}

export function useJourneyProgressStore(): JourneyProgressStore {
  return useStore();
}

export function useJourneyProgress(): number {
  const store = useStore();
  return useSyncExternalStore(
    (onStoreChange) => store.subscribe(() => onStoreChange()),
    () => store.progress,
    () => store.progress,
  );
}

/** Only re-renders when the active stop id changes (not every lerp frame). */
export function useActiveNodeId(): string {
  const store = useStore();
  return useSyncExternalStore(
    (onStoreChange) => store.subscribe(() => onStoreChange()),
    () => getActiveNode(store.progress).id,
    () => getActiveNode(store.progress).id,
  );
}

/**
 * Stable key for dock UI: `${nodeId}:${inBand}`.
 * Avoids overlay re-renders on every progress tick while traveling.
 */
export function useDockBandKey(): string {
  const store = useStore();
  return useSyncExternalStore(
    (onStoreChange) => store.subscribe(() => onStoreChange()),
    () => {
      const progress = store.progress;
      const node = getActiveNode(progress);
      const inBand = Math.abs(progress - node.dockT) <= node.dockRadius;
      return `${node.id}:${inBand ? 1 : 0}`;
    },
    () => {
      const progress = store.progress;
      const node = getActiveNode(progress);
      const inBand = Math.abs(progress - node.dockT) <= node.dockRadius;
      return `${node.id}:${inBand ? 1 : 0}`;
    },
  );
}
