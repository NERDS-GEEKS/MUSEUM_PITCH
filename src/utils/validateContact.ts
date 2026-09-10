import type { LeadPayload } from "./submitLead";

export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: Partial<Record<keyof LeadPayload, string>> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(payload: LeadPayload): ValidationResult {
  const errors: Partial<Record<keyof LeadPayload, string>> = {};

  if (!payload.name.trim()) errors.name = "Name is required";
  if (!payload.email.trim()) errors.email = "Email is required";
  else if (!EMAIL_RE.test(payload.email)) errors.email = "Enter a valid email";
  if (!payload.organization.trim())
    errors.organization = "Organization is required";
  if (!payload.message.trim()) errors.message = "Message is required";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true };
}
