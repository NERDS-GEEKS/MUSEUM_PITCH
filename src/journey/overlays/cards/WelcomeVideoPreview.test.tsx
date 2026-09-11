import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WelcomeVideoPreview } from "./WelcomeVideoPreview";
import { ExperienceVideoModal } from "@/journey/overlays/ExperienceVideoModal";
import {
  getExperienceVideoOpen,
  MUSEUM_VIDEO_SRC,
  setExperienceVideoOpen,
} from "@/journey/overlays/experienceVideoStore";

beforeEach(() => {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  }));
});

afterEach(() => {
  setExperienceVideoOpen(false);
  vi.unstubAllGlobals();
});

describe("WelcomeVideoPreview", () => {
  it("plays a muted preview", () => {
    const { container } = render(<WelcomeVideoPreview />);
    const preview = container.querySelector("video");
    expect(preview).toBeTruthy();
    expect(preview).toHaveAttribute("src", MUSEUM_VIDEO_SRC);
    expect(preview?.muted).toBe(true);
    expect(preview).toHaveAttribute("loop");
  });

  it("opens the soundtrack player when the preview is clicked", async () => {
    const user = userEvent.setup();
    render(
      <>
        <WelcomeVideoPreview />
        <ExperienceVideoModal />
      </>,
    );

    await user.click(
      screen.getByRole("button", { name: /play video with sound/i }),
    );

    expect(getExperienceVideoOpen()).toBe(true);
    const dialog = screen.getByRole("dialog", { name: /see navme in action/i });
    const modalVideo = dialog.querySelector("video");
    expect(modalVideo).toBeTruthy();
    expect(modalVideo?.muted).toBe(false);
  });
});
