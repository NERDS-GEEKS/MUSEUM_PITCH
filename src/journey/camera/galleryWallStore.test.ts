import { JOURNEY_NODES } from "@/journey/constants/nodes";
import { afterEach, describe, expect, it } from "vitest";
import {
  getGalleryWallForRoom,
  getWelcomeBeat,
  resolveGalleryStep,
  setWelcomeBeat,
} from "./galleryWallStore";

afterEach(() => {
  setWelcomeBeat("video");
});

describe("resolveGalleryStep", () => {
  it("keeps Welcome on the video wall until the next swipe", () => {
    setWelcomeBeat("video");
    expect(resolveGalleryStep(1, 0)).toEqual({
      stopIndex: 0,
      welcomeBeat: "story",
    });
    expect(resolveGalleryStep(-1, 0)).toBeNull();
  });

  it("swipes from the Welcome story wall into room 2", () => {
    setWelcomeBeat("story");
    expect(resolveGalleryStep(1, 0)).toEqual({
      stopIndex: 1,
      welcomeBeat: "story",
    });
    expect(resolveGalleryStep(-1, 0)).toEqual({
      stopIndex: 0,
      welcomeBeat: "video",
    });
  });

  it("returns to Welcome's story wall from room 2", () => {
    expect(JOURNEY_NODES[1]?.id).toBe("gps-fails");
    expect(resolveGalleryStep(-1, 1)).toEqual({
      stopIndex: 0,
      welcomeBeat: "story",
    });
  });
});

describe("getGalleryWallForRoom", () => {
  it("uses the left video wall only on Welcome's first beat", () => {
    setWelcomeBeat("video");
    expect(getGalleryWallForRoom("welcome")).toBe("left");
    setWelcomeBeat("story");
    expect(getGalleryWallForRoom("welcome")).toBe("right");
    expect(getGalleryWallForRoom("gps-fails")).toBe("right");
    expect(getWelcomeBeat()).toBe("story");
  });
});
