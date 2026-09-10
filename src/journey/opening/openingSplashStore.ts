import { useSyncExternalStore } from "react";

type Listener = () => void;

/** True while the 2D logo assemble splash is on screen (freeze WebGL). */
let splashBusy = false;
const listeners = new Set<Listener>();

export function getOpeningSplashBusy(): boolean {
  return splashBusy;
}

export function setOpeningSplashBusy(value: boolean): void {
  if (splashBusy === value) return;
  splashBusy = value;
  for (const listener of listeners) listener();
}

export function subscribeOpeningSplashBusy(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOpeningSplashBusy(): boolean {
  return useSyncExternalStore(
    subscribeOpeningSplashBusy,
    getOpeningSplashBusy,
    () => false,
  );
}
