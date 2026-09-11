import { describe, expect, it } from "vitest";
import {
  galleryViewDistance,
  isPortraitAspect,
  journeyFovForAspect,
  PORTRAIT_STORY_BOARD,
  storyBoardForAspect,
} from "./galleryFrame";

describe("galleryFrame", () => {
  it("treats phone-like aspects as portrait", () => {
    expect(isPortraitAspect(9 / 19.5)).toBe(true);
    expect(isPortraitAspect(16 / 9)).toBe(false);
  });

  it("uses a narrower plaque on portrait so the full card fits", () => {
    const phone = storyBoardForAspect(9 / 19.5);
    expect(phone.worldW).toBe(PORTRAIT_STORY_BOARD.worldW);
    expect(phone.worldW).toBeLessThan(4);
  });

  it("keeps portrait stand-back near the desktop wall distance", () => {
    const dist = galleryViewDistance(9 / 19.5, 78);
    expect(dist).toBeGreaterThan(3.5);
    expect(dist).toBeLessThan(5.2);
  });

  it("widens FOV a little on phones only", () => {
    expect(journeyFovForAspect(9 / 19.5, 74)).toBe(78);
    expect(journeyFovForAspect(16 / 9, 74)).toBe(74);
  });
});
