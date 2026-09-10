# NavMe V2 Website - Design Spec

**Date:** 2026-08-03  
**Status:** Approved (design sections 1-3)  
**Approach:** Single-page cinematic scroll (Approach A)

## 1. Goal

Build a production-ready, premium marketing website for NavMe - an AI-powered indoor/spatial navigation platform (VPS + AI + AR). The site must feel like a spatial operating system (Apple Vision Pro × Stripe × Linear × Arc × Vercel), not a generic SaaS landing page. It tells one continuous visual story through scroll.

## 2. Decisions Locked

| Decision | Choice |
|---|---|
| Delivery | Full cinematic v1 - all 16 sections |
| Social proof | Anonymous / generic (no fake company names or logos) |
| Contact / Book Demo | Form UI + typed `submitLead()` abstraction; provider wired later |
| 3D strategy | Hybrid - R3F signature hero; CSS/canvas/Lottie for secondary motion |
| Architecture | Single-page cinematic scroll with Lenis + GSAP ScrollTrigger + Framer Motion |

## 3. Brand & Visual System

### 3.1 Identity

- **Name:** NavMe  
- **Tagline:** Navigate Beyond GPS  
- **Logo:** existing asset `NavMe_wb.png` (nav + footer)  
- **Positioning:** Not Google Maps - future of indoor navigation via VPS, AI, and AR

### 3.2 Color tokens

| Token | Value | Use |
|---|---|---|
| Background | `#050505` | Page base (never flat-only; always layered) |
| Secondary | `#101010` | Panels / depth |
| Glass | `rgba(255,255,255,0.05)` | Surfaces |
| Border | `rgba(255,255,255,0.08)` | Hairlines |
| Text | `#FFFFFF` | Primary copy |
| Muted | `#B5B5B5` | Secondary copy |
| Primary accent | `#4F8BFF` | CTAs, links |
| Secondary accent | `#7C5CFF` | Soft gradients |
| Highlight | `#3EF4FF` | Path / scan moments only |

Avoid bright neon. Prefer subtle gradients and soft lighting.

### 3.3 Typography

- **Primary font:** Geist (fallback: Inter Tight, then system sans)  
- **Headings:** 72-96px desktop, bold, negative letter-spacing  
- **Body:** 18-20px, comfortable line-height  
- Huge whitespace; one job per section

### 3.4 Atmosphere (always on)

Layered background system (not plain black):

- Gradient mesh  
- Subtle noise texture  
- Slow-moving orbs  
- Soft light beams  
- Faint spatial grid  
- Occasional particles / glass reflections  

Idle motion should make the site feel like it is breathing.

## 4. Tech Stack

- React + Vite + TypeScript  
- Tailwind CSS  
- Framer Motion (UI micro-interactions)  
- GSAP + ScrollTrigger (pinned / scrubbed story sections)  
- React Three Fiber + Three.js (Hero 3D; lazy-loaded)  
- Lenis (smooth scroll)  
- Lottie (feature illustrations)  
- Lucide Icons  
- shadcn/ui primitives where useful (accordion, form controls)

**Explicitly out of v1:** Spline dependency (optional later); real form provider; real partner logos.

## 5. Folder Structure

```
src/
  components/     # Button, Navbar, GlassPanel, Magnetic, SectionReveal, …
  sections/       # One module per story beat
  layouts/        # RootLayout (Lenis, chrome, atmosphere)
  hooks/          # useLenis, useScrollDirection, useMagnetic, usePrefersReducedMotion
  utils/          # cn, motion helpers, submitLead
  constants/      # nav, industries, faq, features, case studies, testimonials
  animations/     # GSAP timelines, R3F scene pieces
  assets/         # logo, textures, lottie
  styles/         # tokens, noise/grid utilities
```

Reusable components over one-off section markup. Constants hold all marketing copy.

## 6. Information Architecture (section order)

1. Hero  
2. Trusted By  
3. Why GPS Fails Indoors  
4. The Future of Spatial Navigation  
5. How NavMe Works  
6. Interactive Product Demo  
7. Industries  
8. AI Technology  
9. Visual Positioning System  
10. Features  
11. Analytics Dashboard  
12. Case Studies  
13. Testimonials  
14. FAQ  
15. Contact  
16. Premium Footer  

### Navbar

- Floating, rounded, glass, blur, sticky  
- Hide on scroll down / show on scroll up  
- Links: Products, Solutions, Industries, Technology, Developers, About, Contact  
- CTA: Book Demo → Contact section  

Nav anchors map to section ids (e.g. `#industries`, `#technology`, `#contact`). “Products / Solutions / Developers / About” scroll to the closest narrative sections (Features / How It Works / Demo / Footer about block) until dedicated pages exist.

## 7. Section Specs

### 7.1 Hero

- Left: brand-level NavMe presence, large “Navigate Beyond GPS”, one support sentence, glass CTAs (*Book Demo*, *Explore Platform*).  
- Right / full-bleed stage: R3F visualization - primary metaphor is a spatial globe with a glowing route network, floating AI nodes, dashed navigation paths, light rays, and a camera-scan sweep. Not screenshots; not inset cards.  
- Mouse parallax on the 3D stage; idle breathing when idle.  
- Background atmosphere continuous behind copy + stage.  
- Supporting copy: helping people move through complex indoor spaces using AI, Visual Positioning, and Augmented Reality.

### 7.2 Trusted By

- Quiet credibility strip - industry labels only (Airports, Hospitals, Campuses, Malls, Museums, Factories, Offices, Warehouses, Events, Hotels).  
- Soft marquee; no fake logos.

### 7.3 Why GPS Fails Indoors

- Storytelling comparison, GSAP scrubbed / pinned.  
- Left: GPS signal degrades indoors.  
- Right: NavMe path remains accurate.  
- Visual metaphor preferred over long paragraphs.

### 7.4 Future of Spatial Navigation

- Pinned section; morphing spatial metaphors beside concise vision copy.  
- Communicates indoor navigation as spatial intelligence, not map pins.

### 7.5 How NavMe Works

- Animated vertical timeline:  
  1. Environment Scan → 2. AI Recognition → 3. Visual Positioning → 4. Path Planning → 5. AR Navigation  
- Steps reveal on scroll with connecting line / path animation.

### 7.6 Interactive Product Demo

- Stylized floor-plan / route canvas (2D + light depth).  
- Destination chips; animated path draw; AR-style end cue.  
- Touch-friendly; reduced-motion → static path illustration.

### 7.7 Industries

- Cinematic cards for: Hospitals, Universities, Shopping Malls, Airports, Museums, Factories, Corporate Offices, Warehouses, Events, Hotels.  
- Image + gradient overlay + glass; hover scale/lift.  
- Visuals: generated CSS/gradient atmospheric abstracts per vertical (no stock photo dependency in v1); no fake client branding.

### 7.8 AI Technology

- Layered reveal: perception → planning → guidance.  
- Minimal copy; motion carries hierarchy.

### 7.9 Visual Positioning System

- Sequence: camera → feature extraction → pose lock.  
- Highlight accent reserved for “lock” moment.

### 7.10 Features

- Animated illustration cards (Lottie or motion SVG): Camera → AI → Mapping → Routing → AR.  
- Hover animation required; avoid generic icon rows.

### 7.11 Analytics Dashboard

- Scroll-driven animated dashboard: sessions, users, POIs, accuracy, heatmap glow.  
- Decorative / illustrative metrics (clearly marketing visualization, not live product data).

### 7.12 Case Studies

- Anonymous outcome cards, e.g. “Major airport · reduced wayfinding time” with metric-style figures.  
- No company names.

### 7.13 Testimonials

- Role-based quotes (Facilities Director, CIO, Campus Ops Lead, etc.).  
- No fake company attribution.

### 7.14 FAQ

- Glass accordion. Content in `constants/faq.ts`. Cover: what NavMe is, GPS vs VPS, industries, deployment, privacy/camera at high level, demo CTA.

### 7.15 Contact

- Book Demo form fields: name, email, organization, industry (optional select), message.  
- Client validation; success / error UI states.  
- Submit via `submitLead(payload): Promise<SubmitLeadResult>` in `utils/submitLead.ts` - v1 stub resolves successfully after simulated delay; real provider plugged later without UI rewrite.

### 7.16 Footer

- Large logo, gradient atmosphere, columns: Products, Industries, Resources, Developers, Contact.  
- Social link placeholders (href `#` until URLs provided), newsletter UI via `submitNewsletter()` stub (mirrors `submitLead`), animated grid.

## 8. Motion System

| Layer | Tool | Responsibility |
|---|---|---|
| Smooth scroll | Lenis | Global inertia scrolling |
| Story scroll | GSAP ScrollTrigger | Pin, scrub, timeline sections |
| UI micro | Framer Motion | Reveals, hover, presence |
| 3D | R3F / Three | Hero scene only (v1) |
| Illustrations | Lottie / motion SVG | Feature cards |

### Principles

- Nothing appears instantly; fade + slight rise + blur-clear.  
- Magnetic glass buttons with light-sweep.  
- Site breathes via subtle idle motion.  
- `prefers-reduced-motion: reduce` → disable parallax, particles, pins, magnetic; keep simple fades.  
- Pause / dispose WebGL when Hero leaves viewport; lazy-load R3F chunk.

## 9. Component Boundaries

| Unit | Does | Depends on |
|---|---|---|
| `RootLayout` | Atmosphere, Lenis, nav, section composition | hooks, sections |
| `Navbar` | Floating glass nav + scroll hide/show | `useScrollDirection` |
| `GlassPanel` / `Button` / `Magnetic` | Shared interaction primitives | Framer, tokens |
| `SectionReveal` | Standard enter animation wrapper | Framer + reduced-motion |
| `HeroScene` | R3F canvas contents | Three, lazy boundary |
| `GpsComparison` | Scrubbed GPS vs NavMe visual | GSAP |
| `WorksTimeline` | 5-step process | GSAP / Framer |
| `RouteDemo` | Interactive path demo | canvas/CSS |
| `IndustryCard` | Cinematic industry tile | constants |
| `AnalyticsViz` | Counters + heatmap | Framer / GSAP |
| `ContactForm` | Form + validation | `submitLead` |
| `submitLead` | Lead submission port | env/provider later |

## 10. Data Flow - Contact

```
ContactForm → validate → submitLead(payload)
                              ↓
                     stub (v1): delay + { ok: true }
                     later: Formspree | Resend | Supabase
                              ↓
                     UI success | error state
```

No secrets in the client beyond publishable endpoint IDs when wired.

## 11. Performance, A11y, SEO

- Code-split R3F and heavy section chunks  
- Lazy images; responsive sizes  
- Semantic landmarks, skip link, focus-visible, keyboard FAQ/accordion  
- Meta title/description for NavMe; Open Graph using logo/atmosphere still  
- Target Lighthouse Performance ≥ 95 on desktop mid-tier; mobile may reduce 3D density to stay healthy  
- No layout shift from fonts (font-display / preload strategy) or late images (explicit dimensions / aspect ratio)

## 12. Responsive

- Desktop-first composition  
- Tablet: tighten type scale; keep two-column where readable  
- Mobile: stack Hero (copy then simplified scene or static fallback); large touch targets; Lenis + lighter GSAP  

## 13. Out of Scope (v1)

- Real auth, dashboards, or product app  
- Live analytics data  
- Spline-authored scenes  
- Multi-route marketing pages  
- Wired email/CRM provider (interface only)  
- Invented partner logos / named customers  

## 14. Success Criteria

- All 16 sections shipped in one cinematic page  
- Premium dark spatial aesthetic matching locked tokens  
- Hero 3D interactive and intentional; secondary motion lighter  
- Anonymous social proof only  
- Contact form works end-to-end against stub  
- Reduced-motion path usable  
- Architecture matches folder structure above; TypeScript throughout  

## 15. Implementation Notes

Greenfield repo (only `NavMe_wb.png` present at design time). Scaffold Vite React-TS + Tailwind, then build shared primitives before sections, then wire scroll/3D, then polish motion and responsive.
