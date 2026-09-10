import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  INSTAGRAM_URL,
  LINKEDIN_URL,
} from "@/constants/contact";

/**
 * Footer link.
 * - `href`: classic page anchors / mailto / external URLs (HTML footer).
 * - `journeyId`: mural footer jumps to that journey stop when set.
 */
export type FooterLink = {
  label: string;
  href: string;
  journeyId?: string;
};

export type FooterColumn = {
  title: string;
  links: readonly FooterLink[];
};

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Problem", href: "#why-gps", journeyId: "gps-fails" },
      { label: "Solution", href: "#how-it-works", journeyId: "vps" },
      { label: "Guide", href: "#features", journeyId: "mapping" },
      { label: "Insights", href: "#analytics", journeyId: "analytics" },
      { label: "Benefits", href: "#industries", journeyId: "industries" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: CONTACT_EMAIL, href: CONTACT_MAILTO },
      { label: "LinkedIn", href: LINKEDIN_URL },
      { label: "Instagram", href: INSTAGRAM_URL },
    ],
  },
];

export const FOOTER_SOCIAL = [
  {
    label: "LinkedIn",
    href: LINKEDIN_URL,
  },
  {
    label: "Instagram",
    href: INSTAGRAM_URL,
  },
] as const;

export const FOOTER_LEGAL_DOCS = {
  privacy: {
    title: "Privacy Policy",
    href: "/privacy",
    body: ["See the full Privacy Policy at /privacy."],
  },
  terms: {
    title: "Terms & Conditions",
    href: "/terms",
    body: ["See the full Terms & Conditions at /terms."],
  },
  cookies: {
    title: "Cookie Policy",
    href: "/privacy",
    body: [
      "Cookie practices are described in the Privacy Policy at /privacy.",
      "For privacy questions, contact info@navme.space.",
      "Last updated: 2026.",
    ],
  },
} as const;

export type FooterLegalDocId = keyof typeof FOOTER_LEGAL_DOCS;
