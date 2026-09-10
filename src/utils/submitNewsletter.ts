import type { SubmitResult } from "./submitLead";

export type NewsletterPayload = { email: string };

const STUB_DELAY_MS = 400;

export async function submitNewsletter(
  payload: NewsletterPayload,
): Promise<SubmitResult> {
  void payload;
  await new Promise((r) => setTimeout(r, STUB_DELAY_MS));
  return { ok: true };
}
