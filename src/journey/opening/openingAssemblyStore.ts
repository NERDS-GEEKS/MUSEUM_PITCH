import { useSyncExternalStore } from "react";

type Listener = () => void;

let assembly = 0;
const listeners = new Set<Listener>();

export function getOpeningAssembly(): number {
  return assembly;
}

export function setOpeningAssembly(value: number): void {
  const next = Math.min(1, Math.max(0, value));
  if (Math.abs(next - assembly) < 0.001) return;
  assembly = next;
  for (const listener of listeners) listener();
}

export function subscribeOpeningAssembly(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOpeningAssembly(): number {
  return useSyncExternalStore(
    subscribeOpeningAssembly,
    getOpeningAssembly,
    getOpeningAssembly,
  );
}
