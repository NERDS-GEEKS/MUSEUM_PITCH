let dragging = false;

/** True while the visitor is dragging to look around the gallery. */
export function setLookDragging(next: boolean) {
  dragging = next;
}

export function isLookDragging(): boolean {
  return dragging;
}
