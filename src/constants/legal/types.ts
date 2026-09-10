export const PRIVACY_PATH = "/privacy";
export const TERMS_PATH = "/terms";

/** Directory URLs that work on static hosts without SPA rewrite. */
export const PRIVACY_URL = "/privacy/";
export const TERMS_URL = "/terms/";

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "note"; text: string };

export type LegalDocument = {
  title: string;
  effectiveDate: string;
  intro: string[];
  blocks: LegalBlock[];
};
