import { describe, expect, it } from "vitest";
import { submitLead } from "./submitLead";

describe("submitLead", () => {
  it("resolves ok after stub delay", async () => {
    const result = await submitLead({
      name: "Alex",
      email: "alex@example.com",
      organization: "Campus Ops",
      message: "Book a demo",
    });
    expect(result).toEqual({ ok: true });
  });
});
