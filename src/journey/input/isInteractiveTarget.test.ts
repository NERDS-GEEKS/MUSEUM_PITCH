import { describe, expect, it } from "vitest";
import { isInteractiveTarget } from "./isInteractiveTarget";

describe("isInteractiveTarget", () => {
  it("treats buttons and links as interactive", () => {
    const button = document.createElement("button");
    const link = document.createElement("a");
    expect(isInteractiveTarget(button)).toBe(true);
    expect(isInteractiveTarget(link)).toBe(true);
  });

  it("lets gallery canvas / empty space start a look drag", () => {
    const canvas = document.createElement("canvas");
    const div = document.createElement("div");
    expect(isInteractiveTarget(canvas)).toBe(false);
    expect(isInteractiveTarget(div)).toBe(false);
    expect(isInteractiveTarget(null)).toBe(false);
  });
});
