# NavMe V2 Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a production-ready single-page cinematic marketing site for NavMe with all 16 narrative sections, hybrid R3F hero, Lenis/GSAP/Framer motion, and stubbed lead submission.

**Architecture:** Vite + React + TypeScript SPA. `RootLayout` owns Lenis, atmosphere, and navbar. Each story beat is a section module under `src/sections/`. Shared glass/motion primitives live in `src/components/`. R3F loads only for the Hero via `React.lazy`. Contact/newsletter call `submitLead` / `submitNewsletter` stubs.

**Tech Stack:** React 19, Vite 6, TypeScript, Tailwind CSS 4, Framer Motion, GSAP + ScrollTrigger, @react-three/fiber, three, Lenis, Lucide, Vitest, Testing Library

## Global Constraints

- Colors: bg `#050505`, secondary `#101010`, glass `rgba(255,255,255,0.05)`, border `rgba(255,255,255,0.08)`, text `#FFFFFF`, muted `#B5B5B5`, primary `#4F8BFF`, secondary accent `#7C5CFF`, highlight `#3EF4FF`
- Font: Geist (fallback Inter Tight / system); headings 72-96px desktop; body 18-20px
- No fake company names or partner logos; anonymous social proof only
- Form providers deferred: implement `submitLead` / `submitNewsletter` stubs only
- Hero 3D metaphor: spatial globe + route network + AI nodes + scan sweep
- Industry visuals: CSS/gradient abstracts (no stock photo dependency)
- `prefers-reduced-motion: reduce` disables parallax, particles, pins, magnetic pull
- Pause/dispose WebGL when Hero off-screen; lazy-load R3F chunk
- Spec: `docs/superpowers/specs/2026-08-03-navme-v2-website-design.md`
- Repo is greenfield (only `NavMe_wb.png` + docs); initialize git in Task 1
- Do not commit secrets; do not invent Spline dependency

---

## File Structure (create)

```
package.json
vite.config.ts
tsconfig.json
tsconfig.app.json
tsconfig.node.json
index.html
vitest.config.ts
tailwind / CSS entry as scaffolded
public/favicon.svg
src/main.tsx
src/App.tsx
src/vite-env.d.ts
src/styles/globals.css
src/styles/tokens.css
src/assets/logo.png          (copy from NavMe_wb.png)
src/utils/cn.ts
src/utils/submitLead.ts
src/utils/submitNewsletter.ts
src/utils/validateContact.ts
src/hooks/usePrefersReducedMotion.ts
src/hooks/useScrollDirection.ts
src/hooks/useLenis.ts
src/hooks/useMagnetic.ts
src/constants/nav.ts
src/constants/industries.ts
src/constants/features.ts
src/constants/faq.ts
src/constants/caseStudies.ts
src/constants/testimonials.ts
src/constants/analytics.ts
src/constants/worksSteps.ts
src/components/ui/Button.tsx
src/components/ui/GlassPanel.tsx
src/components/ui/Magnetic.tsx
src/components/ui/SectionReveal.tsx
src/components/ui/SectionHeading.tsx
src/components/layout/Navbar.tsx
src/components/layout/Atmosphere.tsx
src/components/layout/SkipLink.tsx
src/components/layout/Footer.tsx
src/layouts/RootLayout.tsx
src/animations/hero/HeroScene.tsx
src/animations/hero/HeroCanvas.tsx
src/sections/Hero.tsx
src/sections/TrustedBy.tsx
src/sections/WhyGpsFails.tsx
src/sections/FutureSpatial.tsx
src/sections/HowItWorks.tsx
src/sections/ProductDemo.tsx
src/sections/Industries.tsx
src/sections/AiTechnology.tsx
src/sections/Vps.tsx
src/sections/Features.tsx
src/sections/Analytics.tsx
src/sections/CaseStudies.tsx
src/sections/Testimonials.tsx
src/sections/Faq.tsx
src/sections/Contact.tsx
src/components/contact/ContactForm.tsx
src/components/demo/RouteDemo.tsx
src/components/analytics/AnalyticsViz.tsx
src/components/gps/GpsComparison.tsx
src/test/setup.ts
src/utils/cn.test.ts
src/utils/submitLead.test.ts
src/utils/submitNewsletter.test.ts
src/utils/validateContact.test.ts
src/hooks/useScrollDirection.test.ts
src/hooks/usePrefersReducedMotion.test.ts
src/components/contact/ContactForm.test.tsx
```

---

### Task 1: Scaffold Vite app, Tailwind tokens, git

**Files:**
- Create: scaffold via Vite; `src/styles/tokens.css`; `src/styles/globals.css`; `src/assets/logo.png`; `index.html` meta
- Modify: `package.json` scripts for `test`, `build`

**Interfaces:**
- Produces: runnable Vite app; CSS variables matching Global Constraints

- [ ] **Step 1: Initialize git and scaffold**

```bash
cd "d:\Navme.space\navme"
git init
npm create vite@latest . -- --template react-ts
```

If create-vite refuses non-empty dir, scaffold into a temp folder and move files, keeping `docs/` and `NavMe_wb.png`.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install framer-motion gsap lenis three @react-three/fiber @react-three/drei lucide-react clsx tailwind-merge
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @types/three
```

Configure Tailwind v4 via `@tailwindcss/vite` in `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
});
```

Add path alias to `tsconfig.app.json`: `"paths": { "@/*": ["./src/*"] }`.

- [ ] **Step 3: Tokens + globals**

Create `src/styles/tokens.css`:

```css
:root {
  --nm-bg: #050505;
  --nm-secondary: #101010;
  --nm-glass: rgba(255, 255, 255, 0.05);
  --nm-border: rgba(255, 255, 255, 0.08);
  --nm-text: #ffffff;
  --nm-muted: #b5b5b5;
  --nm-primary: #4f8bff;
  --nm-accent: #7c5cff;
  --nm-highlight: #3ef4ff;
  --nm-radius: 9999px;
}
```

Create `src/styles/globals.css`:

```css
@import "tailwindcss";
@import "./tokens.css";

@theme {
  --color-nm-bg: var(--nm-bg);
  --color-nm-secondary: var(--nm-secondary);
  --color-nm-glass: var(--nm-glass);
  --color-nm-border: var(--nm-border);
  --color-nm-text: var(--nm-text);
  --color-nm-muted: var(--nm-muted);
  --color-nm-primary: var(--nm-primary);
  --color-nm-accent: var(--nm-accent);
  --color-nm-highlight: var(--nm-highlight);
  --font-sans: "Geist", "Inter Tight", ui-sans-serif, system-ui, sans-serif;
}

html,
body,
#root {
  min-height: 100%;
}

body {
  margin: 0;
  background: var(--nm-bg);
  color: var(--nm-text);
  font-family: var(--font-sans);
  font-size: 18px;
  line-height: 1.6;
  overflow-x: hidden;
}

::selection {
  background: color-mix(in srgb, var(--nm-primary) 40%, transparent);
}
```

Copy logo:

```bash
Copy-Item "NavMe_wb.png" "src\assets\logo.png"
```

Load Geist via `index.html` (jsDelivr geist font CSS or `@fontsource/geist-sans` if installed). Prefer:

```bash
npm install @fontsource/geist-sans
```

Import in `main.tsx`: `import "@fontsource/geist-sans/400.css"; import "@fontsource/geist-sans/600.css"; import "@fontsource/geist-sans/700.css";`

- [ ] **Step 4: Smoke run**

```bash
npm run dev
```

Expected: Vite serves blank React page without errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite React TS app with NavMe design tokens"
```

---

### Task 2: Core utils + Vitest (`cn`, leads, validation)

**Files:**
- Create: `src/utils/cn.ts`, `src/utils/submitLead.ts`, `src/utils/submitNewsletter.ts`, `src/utils/validateContact.ts`, matching `*.test.ts`, `src/test/setup.ts`
- Modify: `package.json` - `"test": "vitest run"`

**Interfaces:**
- Produces:
  - `cn(...inputs: ClassValue[]): string`
  - `submitLead(payload: LeadPayload): Promise<SubmitResult>`
  - `submitNewsletter(payload: NewsletterPayload): Promise<SubmitResult>`
  - `validateContact(payload: LeadPayload): ValidationResult`
  - Types: `LeadPayload`, `NewsletterPayload`, `SubmitResult`, `ValidationResult`

- [ ] **Step 1: Write failing tests**

`src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

`src/utils/cn.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("merges class names and resolves conflicts", () => {
    expect(cn("px-2", "px-4", false && "hidden")).toContain("px-4");
    expect(cn("px-2", "px-4")).not.toContain("px-2");
  });
});
```

`src/utils/submitLead.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { submitLead } from "./submitLead";

describe("submitLead", () => {
  it("resolves ok after stub delay", async () => {
    const result = await submitLead({
      name: "Alex",
      email: "alex@example.com",
      organization: "Campus Ops",
      message: "Book a demo",
    });
    expect(result).toEqual({ ok: true });
  });
});
```

`src/utils/submitNewsletter.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { submitNewsletter } from "./submitNewsletter";

describe("submitNewsletter", () => {
  it("resolves ok for valid email", async () => {
    await expect(submitNewsletter({ email: "ops@example.com" })).resolves.toEqual({
      ok: true,
    });
  });
});
```

`src/utils/validateContact.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { validateContact } from "./validateContact";

describe("validateContact", () => {
  it("rejects empty name and bad email", () => {
    const result = validateContact({
      name: "",
      email: "not-an-email",
      organization: "",
      message: "",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBeTruthy();
      expect(result.errors.email).toBeTruthy();
    }
  });

  it("accepts valid payload", () => {
    const result = validateContact({
      name: "Sam Rivera",
      email: "sam@example.com",
      organization: "Regional Medical Center",
      industry: "Hospitals",
      message: "Interested in a campus pilot.",
    });
    expect(result.ok).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests - expect fail**

```bash
npm test
```

Expected: FAIL - modules not found / not exported.

- [ ] **Step 3: Implement utils**

`src/utils/cn.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

`src/utils/submitLead.ts`:

```ts
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
```

`src/utils/submitNewsletter.ts`:

```ts
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
```

`src/utils/validateContact.ts`:

```ts
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
```

- [ ] **Step 4: Run tests - expect pass**

```bash
npm test
```

Expected: PASS all utils tests.

- [ ] **Step 5: Commit**

```bash
git add src/utils src/test package.json vite.config.ts
git commit -m "feat: add cn, lead stubs, and contact validation with tests"
```

---

### Task 3: Motion/a11y hooks

**Files:**
- Create: `src/hooks/usePrefersReducedMotion.ts`, `src/hooks/useScrollDirection.ts`, `src/hooks/useLenis.ts`, `src/hooks/useMagnetic.ts`, tests for reduced-motion + scroll direction

**Interfaces:**
- Produces:
  - `usePrefersReducedMotion(): boolean`
  - `useScrollDirection(): "up" | "down" | "top"`
  - `useLenis(enabled: boolean): void` - starts/stops Lenis on `html`, syncs with requestAnimationFrame
  - `useMagnetic(ref, { strength?: number }): { x: MotionValue; y: MotionValue }` or event handlers returning `{ x, y }` offsets - implement as:

```ts
export function useMagnetic(
  strength = 0.35,
): {
  onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
  style: { x: number; y: number };
};
```

- [ ] **Step 1: Write failing hook tests**

`src/hooks/usePrefersReducedMotion.test.ts`:

```ts
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

describe("usePrefersReducedMotion", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    }));
  });
  afterEach(() => vi.unstubAllGlobals());

  it("returns true when reduced motion matches", () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });
});
```

`src/hooks/useScrollDirection.test.ts`:

```ts
import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useScrollDirection } from "./useScrollDirection";

describe("useScrollDirection", () => {
  it("starts at top", () => {
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current).toBe("top");
  });
});
```

- [ ] **Step 2: Run tests - expect fail**

```bash
npm test
```

- [ ] **Step 3: Implement hooks**

`usePrefersReducedMotion.ts` - subscribe to `matchMedia("(prefers-reduced-motion: reduce)")`.

`useScrollDirection.ts` - listen to window scroll; if `scrollY < 24` → `"top"`; else compare to last Y for `"up"` | `"down"`.

`useLenis.ts` - if `enabled`, `new Lenis({ lerp: 0.08 })`, RAF loop, destroy on cleanup; no-op when reduced motion (caller passes `!reduced`).

`useMagnetic.ts` - track pointer relative to element center; expose pixel offsets clamped; zero on leave; caller skips when reduced motion.

- [ ] **Step 4: Run tests - expect pass**

```bash
npm test
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks
git commit -m "feat: add scroll, reduced-motion, Lenis, and magnetic hooks"
```

---

### Task 4: Design system primitives + constants

**Files:**
- Create: all `src/constants/*.ts`, `Button`, `GlassPanel`, `Magnetic`, `SectionReveal`, `SectionHeading`

**Interfaces:**
- Produces:
  - `NAV_LINKS: { label: string; href: string }[]`
  - `INDUSTRIES`, `FEATURES`, `FAQ_ITEMS`, `CASE_STUDIES`, `TESTIMONIALS`, `ANALYTICS_STATS`, `WORKS_STEPS` arrays
  - `<Button variant="primary" | "glass" | "ghost" size="md" | "lg" />`
  - `<GlassPanel className?>`
  - `<Magnetic disabled?>` wraps children
  - `<SectionReveal>` Framer whileInView fade/rise/blur
  - `<SectionHeading eyebrow? title description? />`

- [ ] **Step 1: Add constants (exact nav mapping)**

`src/constants/nav.ts`:

```ts
export const NAV_LINKS = [
  { label: "Products", href: "#features" },
  { label: "Solutions", href: "#how-it-works" },
  { label: "Industries", href: "#industries" },
  { label: "Technology", href: "#technology" },
  { label: "Developers", href: "#demo" },
  { label: "About", href: "#footer" },
  { label: "Contact", href: "#contact" },
] as const;
```

Populate industries (10), works steps (5), features (5), faq (≥6), case studies (3 anonymous), testimonials (3 role-based), analytics stats - no company names.

- [ ] **Step 2: Implement UI primitives**

`Button`: rounded-full, glass variants, light-sweep pseudo via CSS `::before` translate on hover, focus-visible ring using `--nm-primary`.

`Magnetic`: uses `useMagnetic` + `motion.div` unless `disabled` or reduced motion.

`SectionReveal`: 

```tsx
<motion.div
  initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(8px)" }}
  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
  viewport={{ once: true, margin: "-10%" }}
  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
/>
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc -b --noEmit
```

Expected: no errors in new files.

- [ ] **Step 4: Commit**

```bash
git add src/constants src/components/ui
git commit -m "feat: add glass UI primitives and marketing constants"
```

---

### Task 5: RootLayout, Atmosphere, Navbar shell

**Files:**
- Create: `Atmosphere.tsx`, `SkipLink.tsx`, `Navbar.tsx`, `RootLayout.tsx`
- Modify: `App.tsx`, `main.tsx`

**Interfaces:**
- Produces: page chrome with living background; sticky glass nav hide/show; Lenis when motion allowed
- Section placeholders may be empty `<section id="…" />` until later tasks

- [ ] **Step 1: Atmosphere**

Fixed inset-0 pointer-events-none layers: radial gradient mesh (primary/accent at low opacity), CSS noise (`background-image` SVG noise or `url` data URI), two slow CSS-animated orbs, faint perspective grid (`repeating-linear-gradient`), optional soft beam.

- [ ] **Step 2: Navbar**

Floating `top-4` centered max-width glass bar; logo + links + Magnetic Book Demo button → `#contact`. Hide translate when `useScrollDirection() === "down"` (not `"top"`). Mobile: hamburger with large tap targets.

- [ ] **Step 3: RootLayout**

```tsx
export function RootLayout({ children }: { children: React.ReactNode }) {
  const reduce = usePrefersReducedMotion();
  useLenis(!reduce);
  return (
    <>
      <SkipLink />
      <Atmosphere />
      <Navbar />
      <main id="main">{children}</main>
    </>
  );
}
```

`App.tsx` renders `RootLayout` wrapping ordered section stubs with correct `id`s: `hero`, `trusted`, `why-gps`, `future`, `how-it-works`, `demo`, `industries`, `technology`, `vps`, `features`, `analytics`, `case-studies`, `testimonials`, `faq`, `contact`, `footer`.

- [ ] **Step 4: Manual verify**

```bash
npm run dev
```

Expected: dark layered bg, floating nav, scroll hide/show works.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout src/layouts src/App.tsx src/main.tsx
git commit -m "feat: add atmosphere, navbar, and root layout shell"
```

---

### Task 6: Hero section + lazy R3F scene

**Files:**
- Create: `src/sections/Hero.tsx`, `src/animations/hero/HeroCanvas.tsx`, `src/animations/hero/HeroScene.tsx`

**Interfaces:**
- Consumes: `Button`, `Magnetic`, `usePrefersReducedMotion`
- Produces: Hero with copy + lazy 3D; CTAs scroll to `#contact` and `#how-it-works`

- [ ] **Step 1: HeroScene (R3F)**

Inside Canvas: dark fog, soft lights, `Sphere` wire/mesh globe, orbiting small node meshes, `Line`/tube dashed routes using highlight color at low intensity, slow auto-rotate, pointer parallax on group rotation, vertical scan plane opacity pulse. Use `@react-three/drei` `Float` sparingly. Keep draw calls low (~<50 meshes).

- [ ] **Step 2: HeroCanvas wrapper**

```tsx
const HeroScene = lazy(() =>
  import("./HeroScene").then((m) => ({ default: m.HeroScene })),
);

export function HeroCanvas() {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px" });
  if (reduce) return <div className="hero-fallback-grid" aria-hidden />;
  return (
    <div ref={ref} className="h-full w-full">
      {inView ? (
        <Suspense fallback={null}>
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4], fov: 45 }}>
            <HeroScene />
          </Canvas>
        </Suspense>
      ) : null}
    </div>
  );
}
```

Use Framer `useInView` or IntersectionObserver; unmount canvas when far off-screen.

- [ ] **Step 3: Hero.tsx layout**

Brand “NavMe” as hero-level signal; H1 “Navigate Beyond GPS”; support: “Experience AI-powered Spatial Intelligence”; body sentence from spec; glass CTAs. Desktop split; mobile stack copy then canvas (max-height ~40vh).

- [ ] **Step 4: Verify**

```bash
npm run build
npm run dev
```

Expected: Hero renders; 3D loads without blocking first paint; reduced-motion shows fallback.

- [ ] **Step 5: Commit**

```bash
git add src/sections/Hero.tsx src/animations/hero
git commit -m "feat: add cinematic Hero with lazy R3F spatial globe"
```

---

### Task 7: Trusted By + Why GPS Fails + Future Spatial

**Files:**
- Create: `TrustedBy.tsx`, `WhyGpsFails.tsx`, `GpsComparison.tsx`, `FutureSpatial.tsx`

**Interfaces:**
- Consumes: `SectionReveal`, GSAP ScrollTrigger, `usePrefersReducedMotion`
- Produces: industry marquee; scrubbed GPS comparison; pinned vision section

- [ ] **Step 1: TrustedBy**

Infinite CSS marquee of industry labels from constants; opacity ~0.7; pause on hover; `aria-label="Industries NavMe serves"`.

- [ ] **Step 2: GpsComparison + WhyGpsFails**

Pinned section (~200vh) when motion allowed. Scrub timeline: left “GPS” signal bars drop + path jitters/fades; right “NavMe” path stays locked with highlight stroke. Reduced motion: static side-by-side final state with explanatory text.

- [ ] **Step 3: FutureSpatial**

Pinned/sticky copy column + morphing abstract (CSS or Framer layout) suggesting spatial layers. One headline, one short paragraph.

- [ ] **Step 4: Verify scroll story in browser; commit**

```bash
git add src/sections/TrustedBy.tsx src/sections/WhyGpsFails.tsx src/sections/FutureSpatial.tsx src/components/gps
git commit -m "feat: add trusted strip, GPS failure story, and spatial vision"
```

---

### Task 8: How It Works + Product Demo

**Files:**
- Create: `HowItWorks.tsx`, `ProductDemo.tsx`, `RouteDemo.tsx`
- Modify: wire into `App.tsx` if not already

**Interfaces:**
- Consumes: `WORKS_STEPS`, `SectionReveal`
- Produces: 5-step timeline; interactive route demo with destination chips

- [ ] **Step 1: HowItWorks**

Vertical timeline; steps Scan → AI → VPS → Path → AR; connecting line animates via scroll progress; each step `SectionReveal`.

- [ ] **Step 2: RouteDemo**

SVG/canvas floor outline; chips e.g. Entrance, Clinic, Lab, Exit; on select, animate path `stroke-dashoffset`; end node pulse (highlight). Touch: chips as buttons. Reduced motion: show completed path immediately.

- [ ] **Step 3: Verify interaction + commit**

```bash
git add src/sections/HowItWorks.tsx src/sections/ProductDemo.tsx src/components/demo
git commit -m "feat: add How NavMe Works timeline and interactive route demo"
```

---

### Task 9: Industries + AI Technology + VPS

**Files:**
- Create: `Industries.tsx`, `AiTechnology.tsx`, `Vps.tsx` (+ optional small presentational children colocated)

**Interfaces:**
- Consumes: `INDUSTRIES` constant
- Produces: 10 cinematic gradient cards; AI layered reveal; VPS camera→features→lock sequence

- [ ] **Step 1: IndustryCard grid**

Each card: unique CSS gradient abstract, title, one-line use case, glass hover lift (`y: -6`, border brighten). No images files required.

- [ ] **Step 2: AiTechnology**

Three stacked glass layers labeled Perception / Planning / Guidance; stagger on view.

- [ ] **Step 3: Vps**

Horizontal or vertical three-phase visual; lock moment uses `--nm-highlight` ring pulse once.

- [ ] **Step 4: Commit**

```bash
git add src/sections/Industries.tsx src/sections/AiTechnology.tsx src/sections/Vps.tsx
git commit -m "feat: add industries, AI technology, and VPS sections"
```

---

### Task 10: Features + Analytics

**Files:**
- Create: `Features.tsx`, `Analytics.tsx`, `AnalyticsViz.tsx`

**Interfaces:**
- Consumes: `FEATURES`, `ANALYTICS_STATS`
- Produces: animated feature cards (SVG/Framer, not generic Lucide-only rows); scroll-driven counters + heatmap

- [ ] **Step 1: Features**

Five cards with custom motion SVG illustrations (camera aperture, neural nodes, map tiles, route polyline, AR chevron). Hover: illustration animates; card glass lifts.

- [ ] **Step 2: AnalyticsViz**

On `whileInView`, count-up stats; CSS grid heatmap cells opacity/color from muted → primary. Label as illustrative marketing metrics in tiny muted caption.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Features.tsx src/sections/Analytics.tsx src/components/analytics
git commit -m "feat: add feature illustrations and analytics visualization"
```

---

### Task 11: Case Studies + Testimonials + FAQ

**Files:**
- Create: `CaseStudies.tsx`, `Testimonials.tsx`, `Faq.tsx`

**Interfaces:**
- Consumes: case study / testimonial / faq constants
- Produces: anonymous outcomes; role quotes; accessible accordion

- [ ] **Step 1: Case studies & testimonials**

Glass cards; metrics large; roles only for quotes.

- [ ] **Step 2: FAQ accordion**

Use shadcn-style or lightweight headless accordion: `button` + `aria-expanded` + panel. Keyboard operable. Glass panels.

- [ ] **Step 3: Commit**

```bash
git add src/sections/CaseStudies.tsx src/sections/Testimonials.tsx src/sections/Faq.tsx
git commit -m "feat: add case studies, testimonials, and FAQ"
```

---

### Task 12: Contact form + Footer

**Files:**
- Create: `Contact.tsx`, `ContactForm.tsx`, `ContactForm.test.tsx`, `Footer.tsx`
- Modify: `App.tsx` to use real Footer section id=`footer`

**Interfaces:**
- Consumes: `validateContact`, `submitLead`, `submitNewsletter`, `NAV_LINKS` / footer link groups
- Produces: working stub form; premium footer with newsletter

- [ ] **Step 1: ContactForm tests**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ContactForm } from "./ContactForm";

vi.mock("@/utils/submitLead", () => ({
  submitLead: vi.fn(async () => ({ ok: true })),
}));

describe("ContactForm", () => {
  it("shows validation errors on empty submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /book demo/i }));
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement ContactForm + Contact section**

Controlled fields; disable while submitting; success message on `{ ok: true }`; error banner on `{ ok: false }`.

- [ ] **Step 3: Footer**

Large logo, gradient, columns Products/Industries/Resources/Developers/Contact, social `#` placeholders, newsletter email + `submitNewsletter`, animated grid background. `id="footer"`.

- [ ] **Step 4: Run tests + build**

```bash
npm test
npm run build
```

Expected: PASS; production build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/sections/Contact.tsx src/sections/Footer.tsx src/components/contact src/components/layout/Footer.tsx
git commit -m "feat: add contact form stub and premium footer"
```

Note: Prefer single Footer at `src/components/layout/Footer.tsx` imported by section wrapper or directly in App - do not duplicate.

---

### Task 13: SEO, a11y polish, performance pass

**Files:**
- Modify: `index.html`, `HeroCanvas`, GSAP sections, images/fonts as needed
- Create: `public/og.png` optional (or reuse logo); `src/components/seo/DocumentMeta.tsx` if needed

**Interfaces:**
- Produces: meta tags, skip link verified, reduced-motion audit, lazy sections optional

- [ ] **Step 1: SEO**

`index.html`:

```html
<title>NavMe - Navigate Beyond GPS</title>
<meta name="description" content="AI-powered indoor and spatial navigation using Visual Positioning, AI, and Augmented Reality." />
<meta property="og:title" content="NavMe - Navigate Beyond GPS" />
<meta property="og:description" content="The future of indoor navigation." />
<meta property="og:image" content="/og.png" />
```

- [ ] **Step 2: A11y checklist**

- Skip link visible on focus  
- All interactive controls keyboard reachable  
- Accordion ARIA correct  
- Color contrast muted text on `#050505` ≥ AA for body  
- Canvas `aria-hidden` with text alternative in Hero  

- [ ] **Step 3: Performance**

- Confirm R3F in separate chunk (`npm run build` inspect dist assets)  
- `dpr` capped  
- GSAP contexts killed on unmount (`gsap.context`)  
- No layout shift: logo width/height attributes  

- [ ] **Step 4: Final verify**

```bash
npm test
npm run build
npm run preview
```

Manual scroll through all 16 sections on desktop + narrow viewport.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: SEO, a11y, and performance polish for NavMe v2"
```

---

## Spec Coverage Checklist

| Spec requirement | Task |
|---|---|
| Design tokens / Geist / atmosphere | 1, 5 |
| Folder structure | 1-12 |
| Navbar glass + hide/show + links + Book Demo | 5 |
| Hero R3F globe + CTAs | 6 |
| Trusted By anonymous | 7 |
| Why GPS Fails comparison | 7 |
| Future of Spatial pinned | 7 |
| How NavMe Works 5 steps | 8 |
| Interactive Product Demo | 8 |
| Industries 10 cinematic cards | 9 |
| AI Technology | 9 |
| VPS | 9 |
| Features illustrated | 10 |
| Analytics dashboard viz | 10 |
| Case studies anonymous | 11 |
| Testimonials role-based | 11 |
| FAQ | 11 |
| Contact + submitLead stub | 2, 12 |
| Footer + newsletter stub | 2, 12 |
| Lenis / GSAP / Framer / reduced motion | 3, 5, 7-10, 13 |
| Lighthouse-oriented performance | 6, 13 |
| Lazy R3F | 6 |

## Plan Self-Review Notes

- No TBD placeholders remain in tasks.  
- Types `LeadPayload` / `SubmitResult` consistent across Tasks 2 and 12.  
- Nav hrefs locked in Task 4 match section ids in Task 5.  
- Footer path standardized to `src/components/layout/Footer.tsx`.  
- Lottie listed in original stack brief; Features use motion SVG first (lighter). Lottie may be added later without blocking v1.
