import { useSyncExternalStore } from "react";

type Listener = () => void;

/**
 * 0 = logo at hero size (opening / journey).
 * 1 = logo shrunk upward + end-wall footer visible (finish).
 */
let credits = 0;
let creditsTarget = 0;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener();
}

export function getFinishCredits(): number {
  return credits;
}

export function getFinishCreditsTarget(): number {
  return creditsTarget;
}

export function setFinishCredits(value: number): void {
  const next = Math.min(1, Math.max(0, value));
  if (Math.abs(next - credits) < 0.0005) return;
  credits = next;
  emit();
}

export function setFinishCreditsTarget(value: number): void {
  const next = Math.min(1, Math.max(0, value));
  if (Math.abs(next - creditsTarget) < 0.0005) return;
  creditsTarget = next;
  emit();
}

export function subscribeFinishCredits(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useFinishCredits(): number {
  return useSyncExternalStore(
    subscribeFinishCredits,
    getFinishCredits,
    getFinishCredits,
  );
}

export function useFinishCreditsTarget(): number {
  return useSyncExternalStore(
    subscribeFinishCredits,
    getFinishCreditsTarget,
    getFinishCreditsTarget,
  );
}
