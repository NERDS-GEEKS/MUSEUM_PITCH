export type LeadPayload = {
  name: string;
  email: string;
  organization: string;
  industry?: string;
  message: string;
};

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string };

const STUB_DELAY_MS = 600;

export async function submitLead(payload: LeadPayload): Promise<SubmitResult> {
  void payload;
  await new Promise((r) => setTimeout(r, STUB_DELAY_MS));
  return { ok: true };
}
