# NavMe Sections Archive Note

**Date:** 2026-08-04  
**Status:** Retired from primary homepage (files retained in repo)

## Context

The marketing homepage now renders `JourneyApp` (`src/journey/`) instead of the traditional vertical section stack. The components under `src/sections/` are **no longer mounted** by `App.tsx`. They remain in the repository for copy extraction, design reference, and a possible future `/classic` route - they are not deleted.

Binary assets (images, logos, OG art) are intentionally untouched.

## Retired section components

Still present under `src/sections/`:

| File | Former role |
|---|---|
| `Hero.tsx` | Landing hero |
| `TrustedBy.tsx` | Logo / trust strip |
| `WhyGpsFails.tsx` | Problem framing |
| `HowItWorks.tsx` | Product steps |
| `Vps.tsx` | Visual Positioning |
| `AiTechnology.tsx` | AI / spatial tech |
| `Features.tsx` | Feature grid |
| `ProductDemo.tsx` | Demo / product surface |
| `Industries.tsx` | Industry use cases |
| `Analytics.tsx` | Analytics story |
| `CaseStudies.tsx` | Case studies |
| `Testimonials.tsx` | Social proof |
| `FutureSpatial.tsx` | Future / vision |
| `Faq.tsx` | FAQ accordion |
| `Contact.tsx` | Book-demo / lead form shell |

## Still active (not archived)

- Design tokens, globals, logo, and shared UI (`GlassPanel`, `Button`, etc.)
- `ContactForm` + `submitLead` / `validateContact` - reused by journey `BookDemoCard`
- `INDUSTRIES` and other constants consumed by live journey cards

## Guidance

- Prefer journey overlays (`src/journey/overlays/cards/`) for new homepage copy.
- Do not re-wire `src/sections/*` into `App.tsx` without an explicit product decision.
- Safe to delete these section files only after confirming no copy or assets still need harvesting.
