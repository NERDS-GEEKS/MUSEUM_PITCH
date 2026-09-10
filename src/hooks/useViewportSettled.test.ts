import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useViewportSettled } from "./useViewportSettled";

describe("useViewportSettled", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("goes unsettled on orientation change, then settles", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useViewportSettled(200));
    expect(result.current).toBe(true);

    act(() => {
      window.dispatchEvent(new Event("orientationchange"));
    });
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe(true);
  });
});
