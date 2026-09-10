import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { WelcomeCard } from "./WelcomeCard";
import { ExperienceVideoModal } from "@/journey/overlays/ExperienceVideoModal";
import {
  getExperienceVideoOpen,
  setExperienceVideoOpen,
} from "@/journey/overlays/experienceVideoStore";

afterEach(() => {
  setExperienceVideoOpen(false);
});

describe("WelcomeCard", () => {
  it("opens the soundtrack player from See in Action", async () => {
    const user = userEvent.setup();
    render(
      <>
        <WelcomeCard />
        <ExperienceVideoModal />
      </>,
    );

    await user.click(screen.getByRole("button", { name: /see in action/i }));

    expect(getExperienceVideoOpen()).toBe(true);
    expect(
      screen.getByRole("dialog", { name: /see navme in action/i }),
    ).toBeTruthy();
  });
});
