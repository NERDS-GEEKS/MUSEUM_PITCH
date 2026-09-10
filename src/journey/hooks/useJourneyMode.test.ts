import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useJourneyMode } from "./useJourneyMode";

describe("useJourneyMode", () => {
  it("returns world even when reduced motion would match", () => {
    const { result } = renderHook(() => useJourneyMode());
    expect(result.current).toBe("world");
  });
});
