import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WelcomeCard } from "./WelcomeCard";

describe("WelcomeCard", () => {
  it("shows the welcome story without a video CTA", () => {
    render(<WelcomeCard />);

    expect(screen.getByText("NavMe")).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: /see in action/i }),
    ).toBeNull();
  });
});
