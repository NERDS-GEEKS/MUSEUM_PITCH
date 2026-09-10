import type { LegalDocument } from "./types";

export const PRIVACY_POLICY: LegalDocument = {
  title: "Privacy Policy",
  effectiveDate: "January 2026",
  intro: [
    "We provide browser-based AR indoor navigation with no app install required. Scan a QR code, pick a destination, and follow AR directions using your phone's camera. This policy explains what we collect, how we use it, and your rights. It covers our website, web app, and admin dashboards.",
    "By using the Services, you agree to this policy. If you disagree with our practices, please do not use the Services.",
  ],
  blocks: [
    {
      type: "h2",
      text: "Who This Covers",
    },
    {
      type: "ul",
      items: [
        "Visitors using an in-venue AR session via QR code",
        "Website visitors",
        "Venue Customers (museums, cultural institutions, and similar organizations that deploy the Service)",
        "Admins managing venue dashboards",
      ],
    },
    {
      type: "p",
      text: "When we power navigation inside a venue, the Venue Customer controls the data and we process it on their behalf. Their own privacy notice governs how they use visitor data. This policy covers how we handle it technically.",
    },
    {
      type: "h2",
      text: "What We Collect",
    },
    {
      type: "p",
      text: "You provide directly: name, email, phone, job title, and organization when you request a demo, contact support, or manage an account.",
    },
    {
      type: "p",
      text: "Automatically: device and browser type, approximate IP-based location, session logs, timestamps, error and crash logs, and cookie identifiers.",
    },
    {
      type: "p",
      text: "Camera and sensors (for AR): live camera frames, motion sensor data (accelerometer, gyroscope, compass), and visual or spatial data used only to localize you and render AR directions.",
    },
    {
      type: "p",
      text: "We do not run facial recognition, identify or profile individuals from camera data, sell camera or sensor data, or use it for advertising. Camera frames are typically converted into anonymous spatial data and processed transiently, not stored as identifiable images, unless a Venue Customer has configured and disclosed extended retention for facility improvement.",
    },
    {
      type: "p",
      text: "QR codes only encode venue, floor, or kiosk identifiers and a session ID. They do not include personal data.",
    },
    {
      type: "p",
      text: "Analytics and heatmaps include session counts, popular destinations, aggregate movement patterns, and search terms, collected in aggregated or anonymized form by default. A Venue Customer may configure identifiable tracking for their own operational needs. If so, notifying their visitors is their responsibility.",
    },
    {
      type: "h2",
      text: "Cookies",
    },
    {
      type: "ul",
      items: [
        "Essential: needed for the navigation session to work. These cannot be disabled without breaking AR features.",
        "Analytics: aggregate usage patterns to improve accuracy.",
        "Performance: monitor load times and reliability.",
      ],
    },
    {
      type: "p",
      text: "You can manage cookies through your browser settings.",
    },
    {
      type: "h2",
      text: "How We Use Data",
    },
    {
      type: "p",
      text: "We use data to provide navigation and AR localization, run and secure the Services, support customers, improve accuracy, generate aggregated analytics for venues, prevent fraud and abuse, and send service or (opt-in only) marketing communications.",
    },
    {
      type: "h2",
      text: "Third Parties We Work With",
    },
    {
      type: "p",
      text: "We work with MultiSet AI (visual positioning), Mattercraft/Zapper (WebAR engine), cloud hosting providers, web analytics providers, payment processors, and authentication providers. Each operates under its own privacy policy. We are not responsible for their independent practices.",
    },
    {
      type: "h2",
      text: "Sharing",
    },
    {
      type: "p",
      text: "We share data with infrastructure and payment partners, support vendors, and Venue Customers (aggregated or anonymized analytics only). We disclose data when legally required or in a merger or acquisition, with standard confidentiality protections.",
    },
    {
      type: "p",
      text: "We never sell personal, camera, or sensor data.",
    },
    {
      type: "h2",
      text: "Retention",
    },
    {
      type: "ul",
      items: [
        "Account data: while your relationship with us or a Venue Customer is active, plus a reasonable period after for legal purposes.",
        "Camera and sensor data: processed transiently and not retained as identifiable imagery beyond the session, with short-term exceptions for technical processing.",
        "Logs: kept briefly for troubleshooting and security.",
        "Aggregated analytics: may be kept longer because it is no longer personal data.",
      ],
    },
    {
      type: "h2",
      text: "Security",
    },
    {
      type: "p",
      text: "We use encryption in transit (and at rest where applicable), secure cloud hosting, access controls, and continuous monitoring. No system is fully secure, and we cannot guarantee absolute protection.",
    },
    {
      type: "h2",
      text: "Your Rights",
    },
    {
      type: "p",
      text: "Depending on your location (including GDPR, India's DPDP Act, and others), you may be able to access, correct, delete, or port your data, withdraw consent, restrict or object to processing, or file a complaint with a data protection authority. Contact us to exercise these rights. If your data was collected on behalf of a Venue Customer, we may direct you to them as the controller.",
    },
    {
      type: "h2",
      text: "Children's Privacy",
    },
    {
      type: "p",
      text: "The Services are not directed at children under 13 (or your local minimum age). We delete any such data promptly if discovered. Contact us if you believe we have collected it.",
    },
    {
      type: "h2",
      text: "International Transfers",
    },
    {
      type: "p",
      text: "Data may be processed in countries outside your own. We use appropriate safeguards such as standard contractual clauses and data processing agreements, consistent with GDPR, the DPDP Act, and other frameworks.",
    },
    {
      type: "h2",
      text: "Venue Customer Responsibilities",
    },
    {
      type: "p",
      text: "Venues deploying the Service are responsible for on-site signage where required, configuring any identifiable tracking lawfully, and issuing their own visitor privacy notices.",
    },
    {
      type: "h2",
      text: "Changes to This Policy",
    },
    {
      type: "p",
      text: "We will update the effective date and, for material changes, provide additional notice where appropriate. Continued use means you accept the changes.",
    },
  ],
};
