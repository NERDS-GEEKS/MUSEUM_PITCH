import { describe, expect, it } from "vitest";
import { createJourneyProgressStore } from "./journeyProgressStore";

describe("createJourneyProgressStore", () => {
  it("clamps progress and notifies subscribers", () => {
    const store = createJourneyProgressStore();
    const seen: number[] = [];
    store.subscribe((t) => seen.push(t));
    store.setProgress(0.5, { immediate: true });
    store.setProgress(2, { immediate: true });
    expect(store.progress).toBe(1);
    expect(seen.at(-1)).toBe(1);
  });
});
