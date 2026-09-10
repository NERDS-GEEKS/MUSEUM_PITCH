import { describe, expect, it } from "vitest";
import { submitNewsletter } from "./submitNewsletter";

describe("submitNewsletter", () => {
  it("resolves ok for valid email", async () => {
    await expect(submitNewsletter({ email: "ops@example.com" })).resolves.toEqual({
      ok: true,
    });
  });
});
