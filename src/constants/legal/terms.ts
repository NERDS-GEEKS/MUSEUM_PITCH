import type { LegalDocument } from "./types";

export const TERMS_AND_CONDITIONS: LegalDocument = {
  title: "Terms and Conditions",
  effectiveDate: "January 2026",
  intro: [
    "These Terms apply to everyone who uses our browser-based AR indoor navigation platform (\"Service\"): visitors navigating a venue, and Venue Customers (museums, science museums, cultural institutions, and similar organizations) that deploy the Service on Free and Paid plans.",
    "Free plans are provided as-is, with no SLA and community-level support. Paid plans may include additional commitments only where expressly stated in an Order/Subscription and/or SLA Addendum. Do not configure the Service to process sensitive personal data unless a signed Data Processing Agreement (DPA) is in place. We may change or end Free-plan features at any time. Paid commitments are governed by your Order/SLA.",
  ],
  blocks: [
    { type: "h2", text: "1. Agreement; Who You Are" },
    {
      type: "h3",
      text: "Binding agreement",
    },
    {
      type: "p",
      text: "These Terms and Conditions (the \"Terms\") form a binding contract between MetaDigi Labs (\"Company,\" \"we,\" \"us,\" \"our\") and the organization or person accepting them (\"Customer,\" \"you\"). By creating an account, deploying the Service at a venue, using the Service as a visitor, or clicking accept, you agree to these Terms.",
    },
    {
      type: "h3",
      text: "Business use for Venue Customers",
    },
    {
      type: "p",
      text: "Venue deployment of the Service is intended for business and organizational use. Individual visitors using an in-venue AR navigation session are not required to create an account or accept a separate agreement. Their use is governed by these Terms and our Privacy Policy.",
    },
    {
      type: "h3",
      text: "Authority",
    },
    {
      type: "p",
      text: "If you accept these Terms on behalf of an organization, you represent that you have authority to bind that organization, and \"Customer\" means that organization.",
    },
    {
      type: "h3",
      text: "Order of precedence",
    },
    {
      type: "p",
      text: "If you and the Company have an executed Order/Subscription (including a plan selection in the dashboard), SLA Addendum, DPA, or a separate Cloud Services Agreement (CSA) (each a \"Paid Addendum\"), those documents supplement these Terms for the Paid Services identified in them. In case of conflict: Order/Subscription > SLA/DPA/CSA > these Terms > Documentation.",
    },
    {
      type: "h3",
      text: "Updates to these Terms",
    },
    {
      type: "p",
      text: "We may update these Terms for Free plans at any time by posting a revised version with an updated Effective Date. For Paid plans, material changes to these Terms become effective only at the next renewal term or as otherwise agreed in an applicable Order/Subscription. This does not restrict the Company from making non-material or administrative updates at any time.",
    },

    { type: "h2", text: "2. The Service" },
    {
      type: "h3",
      text: "Scope",
    },
    {
      type: "p",
      text: "We provide browser-based AR indoor navigation: visitors scan a QR code, select a destination, and follow AR-guided directions rendered using their device's camera, with no app install required. For Venue Customers, this includes venue map creation and configuration, localization processing, an administrative dashboard, and aggregated wayfinding analytics (collectively, the \"Service\"). Plan-specific features, quotas, and limits are stated on our site, in your dashboard, or in an Order/Subscription, and may change as described below.",
    },
    { type: "h3", text: "Service levels and support" },
    {
      type: "ul",
      items: [
        "Free plans: target 99.5% Monthly Uptime; scheduled maintenance communicated in advance via our status page or dashboard; support is community/best-effort.",
        "Paid plans: target 99.9% Monthly Uptime, with scheduled maintenance communicated in advance through our status page and dashboard.",
        "P1 (Critical, navigation down venue-wide, no workaround): 2 hour response, business hours.",
        "P2 (High, major degradation, no acceptable workaround): 4 business hours response.",
        "P3 (Medium, minor degradation, workaround available): 1 business day response.",
        "P4 (Low, question or low-impact issue): 2 business days response.",
      ],
    },
    {
      type: "p",
      text: "Enterprise customers may negotiate enhanced response targets, extended coverage, and a dedicated support contact through the applicable Order/Subscription or SLA Addendum. Service credits, where applicable, are governed by the SLA Addendum. If no SLA Addendum is in effect, Free-plan targets apply without service credits.",
    },
    {
      type: "h3",
      text: "Beta and experimental features",
    },
    {
      type: "p",
      text: "We may offer Beta or experimental features. Betas are provided as-is, may be disabled at any time, and are excluded from any SLA or availability commitment unless expressly stated.",
    },
    {
      type: "h3",
      text: "Third-party services and technologies",
    },
    {
      type: "p",
      text: "The Service relies on third-party technologies, including MultiSet AI (visual positioning) and Mattercraft/Zapper (WebAR rendering), as well as cloud hosting, analytics, payment, and authentication providers. Your use of the Service in a browser is also subject to your device OS and browser vendor's own terms. We are not responsible for third-party services.",
    },
    {
      type: "h3",
      text: "SLA is sole remedy (Paid)",
    },
    {
      type: "p",
      text: "For any failure to meet an SLA expressly stated in an SLA Addendum or Order/Subscription, Customer's sole and exclusive remedy is the service credit specified there. Service credits are not cumulative, may not exceed total fees paid for the affected Service during the applicable billing period, are applied to future invoices, and are not refundable in cash.",
    },
    {
      type: "h3",
      text: "Feature deprecation",
    },
    {
      type: "p",
      text: "For Paid plans, we will provide at least 90 days' advance notice before materially deprecating or discontinuing a core feature of the Service, except where deprecation is necessary for security, legal, or regulatory reasons, required to address a third-party dependency change, or needed to prevent service instability.",
    },

    { type: "h2", text: "3. Accounts; Access; Acceptable Use" },
    {
      type: "h3",
      text: "Accounts and credentials",
    },
    {
      type: "p",
      text: "Venue Customers and Administrators are responsible for their users' dashboard accounts, credentials, and actions, and must maintain appropriate access controls.",
    },
    {
      type: "h3",
      text: "Acceptable use",
    },
    {
      type: "p",
      text: "You and your users will not reverse engineer or create derivative works of the Service (except where prohibited by law); resell or provide the Service as a service bureau without written consent; interfere with or disrupt the Service; generate counterfeit QR codes; use the Service for High-Risk Activities without independent safety measures; upload content you do not have rights to; or use the Service to build a competing indoor-navigation product without prior written consent.",
    },
    {
      type: "h3",
      text: "Use limits",
    },
    {
      type: "p",
      text: "You will comply with usage limits, rate limits, venue/map quotas, seat caps, and our documentation. We may enforce Use Limits technically and suspend excessive or abusive use.",
    },
    {
      type: "h3",
      text: "Safety and situational awareness",
    },
    {
      type: "p",
      text: "AR overlays can obscure real-world hazards. Venue Customers are responsible for safe deployment within their facility. Visitors are responsible for situational awareness. Do not rely on the Service in emergency situations. Always follow physical signage, staff instructions, and posted emergency procedures.",
    },

    { type: "h2", text: "4. Customer Content; Data; Privacy" },
    {
      type: "h3",
      text: "Customer Content",
    },
    {
      type: "p",
      text: "Venue Customers retain all rights to Customer Content (venue maps, floor plans, point-of-interest data, scans, images, and other content). You grant the Company a worldwide, non-exclusive license to host, process, transmit, display, and create limited technical copies of Customer Content solely to provide and maintain the Service and to address service, security, or support issues.",
    },
    {
      type: "h3",
      text: "Usage Data and telemetry",
    },
    {
      type: "p",
      text: "We may collect Usage Data and use it to maintain, secure, improve, and market the Service. We will not disclose Usage Data in a way that identifies a Venue Customer or its visitors, except to provide the Service, as required by law, or with consent.",
    },
    {
      type: "h3",
      text: "Camera and sensor data",
    },
    {
      type: "p",
      text: "As described in our Privacy Policy, AR localization requires temporary processing of camera frames and motion sensor data. This data is used exclusively for positioning and route rendering, is not used for facial recognition or individual identification, and is not sold or used for advertising.",
    },
    {
      type: "h3",
      text: "ML/AI improvement",
    },
    {
      type: "p",
      text: "We may use de-identified and aggregated portions of Customer Content and Usage Data solely to develop, train, validate, and improve our visual-positioning, localization, and related machine-learning models.",
    },
    {
      type: "h3",
      text: "Subprocessors and data location",
    },
    {
      type: "p",
      text: "Customer authorizes the Company to engage subprocessors necessary to deliver the Service. Unless expressly stated in an Order/Subscription or DPA, data residency is not guaranteed.",
    },
    {
      type: "h3",
      text: "Privacy and DPA",
    },
    {
      type: "p",
      text: "Our Privacy Policy describes how we collect and use personal data. The Service is not GDPR/DPDP-compliant by default for Free plans, and no DPA is offered unless specifically executed in writing for Paid plans. Free plans must not be used to process personal data subject to GDPR, India's DPDP Act, or similar laws beyond what is needed for basic wayfinding.",
    },
    {
      type: "h3",
      text: "Prohibited Data",
    },
    {
      type: "p",
      text: "Do not submit special category data, health or medical records, financial (PCI) data, government-classified information, biometric identifiers, personal data of children under 13, or any data you are not lawfully permitted to process, unless expressly permitted in an Order/Subscription and a DPA is in place.",
    },
    {
      type: "h3",
      text: "Data retention and deletion",
    },
    {
      type: "p",
      text: "We may delete Free-plan Customer Content that is inactive or exceeds quotas, after reasonable notice where practicable. Paid-plan retention is as stated in the Order/Subscription or DPA. Following termination, we may retain backups and logs for a limited time for security, compliance, and audit purposes.",
    },
    {
      type: "h3",
      text: "Aggregated and derived data",
    },
    {
      type: "p",
      text: "We may generate and use Aggregated Data and Derived Data to operate, secure, and improve the Service. We will not disclose Aggregated or Derived Data in a form that identifies a Customer or visitor.",
    },

    { type: "h2", text: "5. Security" },
    {
      type: "p",
      text: "We maintain administrative, technical, and physical security measures for the Service, including encryption in transit (and at rest where applicable), access controls, continuous logging and monitoring, and a documented incident response process.",
    },
    {
      type: "p",
      text: "You are responsible for securing your own environment (dashboard credentials, staff devices, kiosk hardware) and for backing up Customer Content you need to retain.",
    },
    {
      type: "h3",
      text: "Breach notification",
    },
    {
      type: "p",
      text: "We will notify an affected Customer of a confirmed security incident affecting Customer Content without undue delay, and in any event within 72 hours of becoming aware, consistent with applicable law.",
    },

    { type: "h2", text: "6. Intellectual Property; Feedback; Fees" },
    {
      type: "p",
      text: "The Company and its licensors own all rights in the Service, its software, design, and underlying technology. No rights are granted except as expressly stated. Certain components may be provided under separate open-source or third-party licenses.",
    },
    {
      type: "h3",
      text: "Feedback",
    },
    {
      type: "p",
      text: "You may provide ideas, suggestions, or feedback. We may use Feedback freely, without restriction or compensation to you.",
    },
    {
      type: "h3",
      text: "Confidentiality",
    },
    {
      type: "p",
      text: "Each party will protect the other party's Confidential Information with reasonable care and use it only to perform under these Terms. Confidentiality obligations survive 3 years; trade secret protections survive as long as the information remains a trade secret.",
    },
    {
      type: "h3",
      text: "Fees, payment, taxes, and overages",
    },
    {
      type: "p",
      text: "Customer will pay fees specified in the dashboard and any Order/Subscription. Usage beyond plan quotas may incur overage charges. Fees are non-cancelable and non-refundable except as expressly stated. Invoices are due net 30. Fees are exclusive of taxes.",
    },

    { type: "h2", text: "7. Changes; Suspension; Termination" },
    {
      type: "p",
      text: "We may change, discontinue, or deprecate features, quotas, or limits. Changes to Free plans may occur at any time. For Paid plans, we will not materially reduce core functionality during the subscription term without providing substantially equivalent functionality or a pro-rata credit, as described in your SLA or Order (if applicable).",
    },
    {
      type: "p",
      text: "We may suspend or limit access immediately if we reasonably believe you breached these Terms, your use risks the security, availability, or integrity of the Service, or suspension is needed to comply with law.",
    },
    {
      type: "p",
      text: "Either party may terminate a Free plan at any time. Paid plans may be terminated as stated in the Order/Subscription or CSA. Upon termination of a Paid plan, Customer has 30 days to export its Customer Content using available self-service tools, unless export is prohibited by law or security restrictions.",
    },

    { type: "h2", text: "8. Compliance; Export; Anti-Corruption" },
    {
      type: "p",
      text: "You will comply with applicable export and sanctions laws, anti-bribery and anti-corruption laws, and applicable government end-user requirements. The Service is commercial software.",
    },

    { type: "h2", text: "9. Disclaimers; Limitation of Liability; Indemnity" },
    {
      type: "p",
      text: "THE SERVICE, BETAS, AND ALL RELATED MATERIALS ARE PROVIDED \"AS IS\" AND \"AS AVAILABLE,\" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT CONTINUOUS, UNINTERRUPTED, OR ERROR-FREE OPERATION. AR NAVIGATION IS A WAYFINDING AID, NOT A SAFETY OR EMERGENCY SYSTEM.",
    },
    {
      type: "p",
      text: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOSS OF PROFITS, REVENUE, BUSINESS, DATA, OR GOODWILL. FOR FREE PLANS, OUR TOTAL AGGREGATE LIABILITY WILL NOT EXCEED US $100. FOR PAID PLANS, OUR TOTAL AGGREGATE LIABILITY WILL NOT EXCEED THE AMOUNTS PAID BY CUSTOMER FOR THE SERVICE IN THE 12 MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY (OR SUCH OTHER AMOUNT EXPRESSLY STATED IN THE ORDER/SUBSCRIPTION).",
    },
    {
      type: "p",
      text: "You will defend and indemnify the Company against third-party claims arising from your venue content's infringement or illegality, your breach of Acceptable Use, Prohibited Data, or Compliance sections, or your misuse of the Service, including failure to provide required venue-level signage or visitor privacy notices.",
    },

    { type: "h2", text: "10. Dispute Resolution; Governing Law" },
    {
      type: "p",
      text: "Before filing a claim, a party must send a detailed notice to the other and work in good faith to resolve the dispute for 60 days.",
    },
    {
      type: "p",
      text: "These Terms are governed by applicable law without regard to conflict-of-law principles. Except for claims for injunctive or equitable relief or small-claims matters, disputes will be resolved by binding arbitration in English under the rules of a recognized arbitration institution. No class or representative actions without written consent. Claims must be filed within 1 year after they accrue.",
    },

    { type: "h2", text: "11. DMCA / Abuse Process" },
    {
      type: "p",
      text: "Notices of alleged copyright infringement should be sent to legal@navme.space with the elements required under applicable law. We may remove or disable access to content and terminate repeat infringers.",
    },

    { type: "h2", text: "12. Miscellaneous" },
    {
      type: "p",
      text: "These Terms, together with any applicable Order/Subscription, Privacy Policy, and Paid Addenda (SLA, DPA, CSA), are the entire agreement for the Service. We may provide notices by email, dashboard message, or posting on our site. Legal notices to us must be sent to legal@navme.space.",
    },
    {
      type: "h3",
      text: "Publicity",
    },
    {
      type: "p",
      text: "By using the Free plan, Customer permits the Company to identify Customer by name and logo on our website, product interfaces, sales materials, and public customer lists, without separate written consent. Customer may opt out anytime by emailing privacy@navme.space. For Paid plans, marketing use of name or logo requires prior written consent.",
    },
    {
      type: "p",
      text: "Either party may assign these Terms in connection with a merger, reorganization, or sale of substantially all assets, with notice. Customer may not assign to a direct competitor of the Company without consent.",
    },

    { type: "h2", text: "13. Venue-Specific Terms" },
    {
      type: "ul",
      items: [
        "Venue Customers are responsible for the accuracy of venue maps, floor plans, and points of interest they configure.",
        "Venue Customers are responsible for physical QR code placement, associated signage, and any required notices at the point of scan.",
        "Venue Customers should provide reasonable physical fallback signage if AR localization fails or is temporarily unavailable.",
        "Where a Venue Customer configures identifiable tracking, that Venue Customer is solely responsible for lawful basis, visitor notice, and any required DPA with the Company.",
      ],
    },

    { type: "h2", text: "14. Definitions" },
    {
      type: "ul",
      items: [
        "Customer Content: venue maps, floor plans, POI data, and other content Customer or its users submit to the Service.",
        "High-Risk Activities: uses where a failure could lead to death, personal injury, or severe harm.",
        "Personal Data: has the meaning given by applicable data protection law.",
        "Service: our hosted browser-based AR navigation platform (Free and Paid), administrative dashboard, and related hosted features.",
        "Usage Data: operational metrics, telemetry, logs, and similar data generated by or about use of the Service.",
      ],
    },
  ],
};
