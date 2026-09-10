import { describe, expect, it } from "vitest";
import { createRouteCurve } from "./routeCurve";

describe("createRouteCurve", () => {
  it("interpolates between endpoints", () => {
    const curve = createRouteCurve([
      [0, 0, 0],
      [0, 0, 10],
      [10, 0, 20],
    ]);
    const a = curve.getPointAt(0);
    const b = curve.getPointAt(1);
    expect(a.z).toBeCloseTo(0, 1);
    expect(b.z).toBeCloseTo(20, 1);
    const mid = curve.getPointAt(0.5);
    expect(Number.isFinite(mid.x)).toBe(true);
  });
});
