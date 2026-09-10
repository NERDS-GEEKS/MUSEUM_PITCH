export type GalleryGesture = "idle" | "look" | "travel";

/** Pixels before a drag locks to look-around or gallery travel. */
export const GESTURE_LOCK_PX = 10;

let active = false;
let mode: GalleryGesture = "idle";
let originX = 0;
let originY = 0;

export function beginGalleryGesture(x: number, y: number): void {
  if (active) return;
  active = true;
  mode = "idle";
  originX = x;
  originY = y;
}

export function resolveGalleryGesture(
  x: number,
  y: number,
  pointerType: string,
): GalleryGesture {
  if (!active) return "idle";
  if (mode !== "idle") return mode;

  const dx = x - originX;
  const dy = y - originY;
  if (Math.hypot(dx, dy) < GESTURE_LOCK_PX) return "idle";

  // Mouse drag looks around; wheel / keys change galleries.
  // Touch / pen lock to the dominant axis so swipe-up can travel.
  if (pointerType === "mouse") {
    mode = "look";
    return mode;
  }

  mode = Math.abs(dx) >= Math.abs(dy) ? "look" : "travel";
  return mode;
}

export function endGalleryGesture(): void {
  active = false;
  mode = "idle";
}

export function getGalleryGesture(): GalleryGesture {
  return mode;
}

/** True while the visitor is dragging to look around the gallery. */
export function isLookDragging(): boolean {
  return mode === "look";
}

export function setLookDragging(next: boolean): void {
  if (next) {
    active = true;
    mode = "look";
    return;
  }
  if (mode === "look") {
    endGalleryGesture();
  }
}

/** Keep yaw in -π…π so a full spin does not accumulate huge values. */
export function wrapAngle(radians: number): number {
  return Math.atan2(Math.sin(radians), Math.cos(radians));
}

/** Drag / swipe right looks toward the right-hand wall. */
export function lookYawFromPointerDx(dx: number, sensitivity: number): number {
  return -dx * sensitivity;
}

/** Drag up should look up. */
export function lookPitchFromPointerDy(dy: number, sensitivity: number): number {
  return -dy * sensitivity;
}

/** Scroll up / wheel away from you → next gallery. */
export function travelDirFromWheelDelta(deltaY: number): 1 | -1 {
  return deltaY < 0 ? 1 : -1;
}

/** Finger swipe up (startY − currentY) → next gallery. */
export function travelDirFromTouchDy(startMinusCurrentY: number): 1 | -1 {
  return startMinusCurrentY > 0 ? 1 : -1;
}
