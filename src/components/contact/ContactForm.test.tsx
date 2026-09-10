import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ContactForm } from "./ContactForm";

vi.mock("@/utils/submitLead", () => ({
  submitLead: vi.fn(async () => ({ ok: true })),
}));

describe("ContactForm", () => {
  it("shows validation errors on empty submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /schedule a demo/i }));
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });
});
