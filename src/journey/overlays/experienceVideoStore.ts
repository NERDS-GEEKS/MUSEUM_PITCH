let open = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function setExperienceVideoOpen(next: boolean) {
  if (open === next) return;
  open = next;
  emit();
}

export function subscribeExperienceVideo(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getExperienceVideoOpen() {
  return open;
}
