import { describe, expect, it } from "vitest";
import { validateContact } from "./validateContact";

describe("validateContact", () => {
  it("rejects empty name and bad email", () => {
    const result = validateContact({
      name: "",
      email: "not-an-email",
      organization: "",
      message: "",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBeTruthy();
      expect(result.errors.email).toBeTruthy();
    }
  });

  it("accepts valid payload", () => {
    const result = validateContact({
      name: "Sam Rivera",
      email: "sam@example.com",
      organization: "Regional Medical Center",
      industry: "Hospitals",
      message: "Interested in a campus pilot.",
    });
    expect(result.ok).toBe(true);
  });
});
