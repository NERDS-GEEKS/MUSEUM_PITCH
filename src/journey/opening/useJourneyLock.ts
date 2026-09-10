import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type JourneyLockApi = {
  locked: boolean;
  unlock: () => void;
  lock: () => void;
};

const JourneyLockContext = createContext<JourneyLockApi | null>(null);

export function JourneyLockProvider({
  children,
  initiallyLocked,
}: {
  children: ReactNode;
  initiallyLocked: boolean;
}) {
  const [locked, setLocked] = useState(initiallyLocked);

  const unlock = useCallback(() => setLocked(false), []);
  const lock = useCallback(() => setLocked(true), []);

  const api = useMemo(
    () => ({ locked, unlock, lock }),
    [locked, unlock, lock],
  );

  return createElement(
    JourneyLockContext.Provider,
    { value: api },
    children,
  );
}

export function useJourneyLock(): JourneyLockApi {
  const ctx = useContext(JourneyLockContext);
  if (!ctx) {
    throw new Error("useJourneyLock requires JourneyLockProvider");
  }
  return ctx;
}

/** Safe when lock provider may be absent (defaults unlocked). */
export function useJourneyLocked(): boolean {
  const ctx = useContext(JourneyLockContext);
  return ctx?.locked ?? false;
}
