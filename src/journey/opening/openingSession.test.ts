import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import {
  clearIntroSeen,
  hasSeenIntro,
  INTRO_SEEN_KEY,
  markIntroSeen,
} from "./openingSession";

describe("openingSession", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("starts unseen", () => {
    expect(hasSeenIntro()).toBe(false);
  });

  it("marks and clears intro seen", () => {
    markIntroSeen();
    expect(sessionStorage.getItem(INTRO_SEEN_KEY)).toBe("1");
    expect(hasSeenIntro()).toBe(true);
    clearIntroSeen();
    expect(hasSeenIntro()).toBe(false);
  });

  it("survives sessionStorage throws on get", () => {
    const spy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("blocked");
      });
    expect(hasSeenIntro()).toBe(false);
    spy.mockRestore();
  });
});
