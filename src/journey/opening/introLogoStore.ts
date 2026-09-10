import { useSyncExternalStore } from "react";

type Listener = () => void;

/** 0 = shattered on the wall, 1 = fully assembled hero mark. */
let logoReveal = 0;
const listeners = new Set<Listener>();

export function getIntroLogoReveal(): number {
  return logoReveal;
}

export function setIntroLogoReveal(value: number): void {
  const next = Math.min(1.2, Math.max(0, value));
  if (Math.abs(next - logoReveal) < 0.0005) return;
  logoReveal = next;
  for (const listener of listeners) listener();
}

export function subscribeIntroLogoReveal(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useIntroLogoReveal(): number {
  return useSyncExternalStore(
    subscribeIntroLogoReveal,
    getIntroLogoReveal,
    getIntroLogoReveal,
  );
}
