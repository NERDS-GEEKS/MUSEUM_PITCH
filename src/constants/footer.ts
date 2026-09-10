import { BLOG_PATH } from "@/constants/blog/types";
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
      { label: "Home", href: "#hero", journeyId: "welcome" },
      { label: "Digital Twin", href: "#how-it-works", journeyId: "vps" },
      { label: "How NavMe Converts", href: "#industries", journeyId: "industries" },
      { label: "Blog", href: BLOG_PATH },
      { label: "Navigate", href: "#features", journeyId: "mapping" },
      { label: "Contact", href: "#contact", journeyId: "complete" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Museums", href: "#industries", journeyId: "industries" },
      { label: "Science Museums", href: "#industries", journeyId: "industries" },
      { label: "Government Museums", href: "#industries", journeyId: "industries" },
      { label: "Cultural Institutions", href: "#industries", journeyId: "industries" },
      { label: "Art Museums", href: "#industries", journeyId: "industries" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Museum Exploration", href: "#features", journeyId: "mapping" },
      { label: "Digital Twin", href: "#vps", journeyId: "vps" },
      { label: "Insights", href: "#analytics", journeyId: "analytics" },
      { label: "Visitor Analytics", href: "#analytics", journeyId: "analytics" },
      {
        label: "Convert to AR Museum",
        href: "#industries",
        journeyId: "industries",
      },
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
