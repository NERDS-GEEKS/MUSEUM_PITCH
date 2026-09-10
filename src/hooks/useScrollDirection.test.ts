import { renderHook } from "@testing-library/react";
import { describe, expect, it, afterEach } from "vitest";
import { useScrollDirection } from "./useScrollDirection";

describe("useScrollDirection", () => {
  afterEach(() => {
    Object.defineProperty(window, "scrollY", {
      value: 0,
      configurable: true,
      writable: true,
    });
  });

  it("starts at top when scrollY is below threshold", () => {
    Object.defineProperty(window, "scrollY", {
      value: 0,
      configurable: true,
      writable: true,
    });
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current).toBe("top");
  });

  it("is not top when scrollY is at or above threshold on mount", () => {
    Object.defineProperty(window, "scrollY", {
      value: 100,
      configurable: true,
      writable: true,
    });
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current).not.toBe("top");
    expect(result.current).toBe("down");
  });
});
