export type DestinationDetailState = {
  openId: string | null;
};

type Listener = () => void;

let state: DestinationDetailState = { openId: null };
const listeners = new Set<Listener>();
let closeTimer: ReturnType<typeof setTimeout> | null = null;

function notify() {
  for (const listener of listeners) listener();
}

export function getDestinationDetail(): DestinationDetailState {
  return state;
}

/** Cancel a pending hover-leave dismiss. */
export function cancelScheduledCloseDestinationDetail(): void {
  if (closeTimer == null) return;
  clearTimeout(closeTimer);
  closeTimer = null;
}

/**
 * Dismiss hover previews shortly after the pointer leaves mark / 3D landmark.
 */
export function scheduleCloseDestinationDetail(delayMs = 180): void {
  cancelScheduledCloseDestinationDetail();
  closeTimer = setTimeout(() => {
    closeTimer = null;
    if (state.openId == null) return;
    state = { openId: null };
    notify();
  }, delayMs);
}

export function openDestinationDetail(id: string): void {
  cancelScheduledCloseDestinationDetail();
  if (state.openId === id) return;
  state = { openId: id };
  notify();
}

export function closeDestinationDetail(): void {
  cancelScheduledCloseDestinationDetail();
  if (state.openId == null) return;
  state = { openId: null };
  notify();
}

export function subscribeDestinationDetail(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isDestinationDetailOpen(): boolean {
  return state.openId != null;
}

/** Book demo is a normal auto panel - does not block scroll / keyboard travel. */
export function isBookDemoDetailOpen(): boolean {
  return false;
}
