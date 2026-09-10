type Listener = () => void;

let index = 0;
const listeners = new Set<Listener>();

export function getIndustryGalleryIndex(): number {
  return index;
}

export function setIndustryGalleryIndex(next: number): void {
  const clamped = Math.max(0, Math.floor(next));
  if (clamped === index) return;
  index = clamped;
  for (const listener of listeners) listener();
}

export function subscribeIndustryGalleryIndex(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetIndustryGalleryIndex(): void {
  if (index === 0) return;
  index = 0;
  for (const listener of listeners) listener();
}
