import { describe, expect, it } from "vitest";
import {
  galleryStandBackForAspect,
  galleryViewDistance,
  isPortraitAspect,
  isTabletFrame,
  journeyFovForAspect,
  PHONE_STAND_BACK,
  storyBoardForAspect,
  TABLET_STAND_BACK,
} from "./galleryFrame";

describe("galleryFrame", () => {
  it("treats phone-like aspects as portrait", () => {
    expect(isPortraitAspect(9 / 19.5)).toBe(true);
    expect(isPortraitAspect(9 / 16)).toBe(true);
    expect(isPortraitAspect(16 / 9)).toBe(false);
  });

  it("treats 421–928 as the tablet frame band", () => {
    expect(isTabletFrame(420)).toBe(false);
    expect(isTabletFrame(421)).toBe(true);
    expect(isTabletFrame(768)).toBe(true);
    expect(isTabletFrame(928)).toBe(true);
    expect(isTabletFrame(929)).toBe(false);
  });

  it("sizes the phone plaque to fill most of the frustum width", () => {
    const iphone = storyBoardForAspect(9 / 19.5, 390);
    expect(iphone.worldW).toBeGreaterThanOrEqual(2.85);
    expect(iphone.worldW / iphone.worldH).toBeLessThan(0.9);
  });

  it("uses a shorter tablet plaque so 421–928 stays aligned", () => {
    const tabletPortrait = storyBoardForAspect(768 / 1024, 768);
    const tabletLandscape = storyBoardForAspect(928 / 600, 928);
    expect(tabletPortrait.worldH).toBeLessThan(4);
    expect(tabletLandscape.worldW).toBeGreaterThan(tabletPortrait.worldW);
    expect(tabletPortrait.cssW).toBeGreaterThanOrEqual(500);
  });

  it("uses a closer stand-back on phones so the card fills the screen", () => {
    expect(galleryStandBackForAspect(9 / 19.5, 4.35, 390)).toBeGreaterThanOrEqual(
      PHONE_STAND_BACK,
    );
    expect(galleryStandBackForAspect(16 / 9, 4.35, 1280)).toBe(4.35);
    expect(galleryStandBackForAspect(768 / 1024, 4.35, 768)).toBeGreaterThanOrEqual(
      TABLET_STAND_BACK,
    );
  });

  it("keeps contain distance near the phone stand-back", () => {
    const board = storyBoardForAspect(9 / 19.5, 390);
    const dist = galleryViewDistance(9 / 19.5, 82, board);
    expect(dist).toBeGreaterThan(2.8);
    expect(dist).toBeLessThan(5.2);
  });

  it("widens FOV a little on compact frames only", () => {
    expect(journeyFovForAspect(9 / 19.5, 74, 390)).toBe(82);
    expect(journeyFovForAspect(768 / 1024, 74, 768)).toBe(78);
    expect(journeyFovForAspect(16 / 9, 74, 1280)).toBe(74);
  });
});
