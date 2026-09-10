import { afterEach, describe, expect, it } from "vitest";
import {
  beginGalleryGesture,
  endGalleryGesture,
  getGalleryGesture,
  isLookDragging,
  lookPitchFromPointerDy,
  lookYawFromPointerDx,
  resolveGalleryGesture,
  travelDirFromTouchDy,
  travelDirFromWheelDelta,
} from "./lookDragStore";

afterEach(() => {
  endGalleryGesture();
});

describe("gallery gesture lock", () => {
  it("locks a horizontal touch swipe to look-around", () => {
    beginGalleryGesture(100, 100);
    expect(resolveGalleryGesture(108, 101, "touch")).toBe("idle");
    expect(resolveGalleryGesture(140, 104, "touch")).toBe("look");
    expect(isLookDragging()).toBe(true);
    expect(resolveGalleryGesture(140, 180, "touch")).toBe("look");
  });

  it("locks a vertical touch swipe to gallery travel", () => {
    beginGalleryGesture(100, 200);
    expect(resolveGalleryGesture(102, 160, "touch")).toBe("travel");
    expect(isLookDragging()).toBe(false);
    expect(getGalleryGesture()).toBe("travel");
  });

  it("treats mouse drags as look-around even when mostly vertical", () => {
    beginGalleryGesture(50, 50);
    expect(resolveGalleryGesture(52, 80, "mouse")).toBe("look");
  });
});

describe("look and travel directions", () => {
  it("looks right when the pointer moves right", () => {
    expect(lookYawFromPointerDx(20, 0.01)).toBeLessThan(0);
  });

  it("looks up when the pointer moves up", () => {
    expect(lookPitchFromPointerDy(-20, 0.01)).toBeGreaterThan(0);
  });

  it("treats scroll up as next gallery", () => {
    expect(travelDirFromWheelDelta(-40)).toBe(1);
    expect(travelDirFromWheelDelta(40)).toBe(-1);
  });

  it("treats swipe up as next gallery", () => {
    expect(travelDirFromTouchDy(30)).toBe(1);
    expect(travelDirFromTouchDy(-30)).toBe(-1);
  });
});
