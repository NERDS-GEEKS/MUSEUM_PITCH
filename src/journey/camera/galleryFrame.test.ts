import { describe, expect, it } from "vitest";
import {
  isPortraitAspect,
  journeyFovForAspect,
  PORTRAIT_STORY_BOARD,
  storyBoardForAspect,
} from "./galleryFrame";

describe("galleryFrame", () => {
  it("treats a phone viewport as portrait", () => {
    expect(isPortraitAspect(9 / 19.5)).toBe(true);
    expect(isPortraitAspect(16 / 9)).toBe(false);
  });

  it("uses a taller plaque on phones so the full card can fit", () => {
    const phone = storyBoardForAspect(9 / 19.5);
    expect(phone.worldH / phone.worldW).toBeGreaterThan(1);
    expect(phone.worldW).toBeLessThan(4);
    expect(phone).toEqual(PORTRAIT_STORY_BOARD);
  });

  it("widens FOV on portrait", () => {
    expect(journeyFovForAspect(9 / 19.5, 74)).toBe(80);
    expect(journeyFovForAspect(16 / 9, 74)).toBe(74);
  });
});
