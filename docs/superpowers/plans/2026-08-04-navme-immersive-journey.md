# NavMe Immersive Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the V2 section-stack homepage with a scroll-driven 3D navigation journey (soft docks, HUD, peak nodes 1-6 + 10-11, lighter 7-9) plus a 2D fallback for mobile / reduced-motion.

**Architecture:** One persistent R3F world. A tall progress rail + Lenis + ScrollTrigger map scroll to `progress ∈ [0,1]`. Camera follows a Catmull-Rom path at ~45°. HTML glass destination cards and HUD overlay the canvas. `JourneyApp` chooses WebGL vs `JourneyFallback2D`.

**Tech Stack:** React, Vite, TypeScript, Tailwind, Framer Motion, GSAP ScrollTrigger, R3F, Drei, Lenis (existing), Vitest

## Global Constraints

- Evolve existing app - reuse tokens, `Button`/`GlassPanel`/`Magnetic`, `ContactForm`, `submitLead`, `usePrefersReducedMotion`
- Colors: bg `#050505`, primary `#4F8BFF`, accent `#7C5CFF`, highlight `#3EF4FF`
- Soft docks; camera never hard-cuts
- Peak polish: nodes 1-6, 10-11; lighter: 7-9
- Mobile / narrow / `prefers-reduced-motion` → 2D fallback; do not load heavy journey chunk
- Anonymous social proof only; no fake company names
- Contact remains stubbed via `submitLead`
- Spec: `docs/superpowers/specs/2026-08-04-navme-immersive-journey-design.md`
- Prefer PowerShell-safe commands (`;` not `&&`); never update git config

---

## File Structure

```
src/journey/
  constants/nodes.ts
  constants/nodes.test.ts
  path/routeCurve.ts
  path/routeCurve.test.ts
  scroll/useJourneyProgress.ts
  scroll/JourneyScrollRail.tsx
  scroll/journeyProgressStore.ts
  camera/JourneyCamera.tsx
  world/World.tsx
  world/RoutePath.tsx
  world/NodeLandmark.tsx
  world/JourneyScene.tsx
  canvas/JourneyCanvas.tsx
  hud/JourneyHUD.tsx
  hud/MiniMap.tsx
  overlays/DestinationStage.tsx
  overlays/DestinationCard.tsx
  overlays/cards/WelcomeCard.tsx
  overlays/cards/GpsFailsCard.tsx
  overlays/cards/VpsCard.tsx
  overlays/cards/MappingCard.tsx
  overlays/cards/AiRouteCard.tsx
  overlays/cards/ArCard.tsx
  overlays/cards/IndustriesCard.tsx
  overlays/cards/AnalyticsCard.tsx
  overlays/cards/DevelopersCard.tsx
  overlays/cards/BookDemoCard.tsx
  overlays/cards/CompleteCard.tsx
  overlays/cards/index.ts
  fallback/JourneyFallback2D.tsx
  JourneyApp.tsx
  hooks/useJourneyMode.ts
Modify:
  src/App.tsx
  src/layouts/RootLayout.tsx (simplify chrome for journey - remove old Navbar or gate it)
  src/App.test.tsx
```

---

### Task 1: Node catalog + route curve math

**Files:**
- Create: `src/journey/constants/nodes.ts`, `src/journey/constants/nodes.test.ts`, `src/journey/path/routeCurve.ts`, `src/journey/path/routeCurve.test.ts`

**Interfaces:**
- Produces:
```ts
export type NodePolish = "peak" | "lighter";
export type JourneyNode = {
  id: string;
  index: number; // 1..11
  title: string;
  subtitle: string;
  body: string;
  polish: NodePolish;
  /** Center of soft-dock band on progress 0..1 */
  dockT: number;
  /** Half-width of soft-dock band */
  dockRadius: number;
  /** 3D waypoint */
  position: [number, number, number];
};
export const JOURNEY_NODES: readonly JourneyNode[];
export function getActiveNode(progress: number): JourneyNode;
export function getNodeProgress(progress: number, node: JourneyNode): number; // 0..1 within dock

export function createRouteCurve(points: readonly [number, number, number][]): {
  getPointAt: (t: number) => { x: number; y: number; z: number };
  getTangentAt: (t: number) => { x: number; y: number; z: number };
};
```

- [ ] **Step 1: Write failing tests**

`nodes.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { JOURNEY_NODES, getActiveNode } from "./nodes";

describe("JOURNEY_NODES", () => {
  it("has 11 nodes with required peak ids", () => {
    expect(JOURNEY_NODES).toHaveLength(11);
    expect(JOURNEY_NODES.map((n) => n.id)).toEqual([
      "welcome",
      "gps-fails",
      "vps",
      "mapping",
      "ai-route",
      "ar",
      "industries",
      "analytics",
      "developers",
      "book-demo",
      "complete",
    ]);
    expect(JOURNEY_NODES.filter((n) => n.polish === "peak")).toHaveLength(8);
  });

  it("getActiveNode returns nearest dock center", () => {
    const mid = JOURNEY_NODES[0].dockT;
    expect(getActiveNode(mid).id).toBe("welcome");
  });
});
```

`routeCurve.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createRouteCurve } from "./routeCurve";

describe("createRouteCurve", () => {
  it("interpolates between endpoints", () => {
    const curve = createRouteCurve([
      [0, 0, 0],
      [0, 0, 10],
      [10, 0, 20],
    ]);
    const a = curve.getPointAt(0);
    const b = curve.getPointAt(1);
    expect(a.z).toBeCloseTo(0, 1);
    expect(b.z).toBeCloseTo(20, 1);
    const mid = curve.getPointAt(0.5);
    expect(Number.isFinite(mid.x)).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests - expect fail**

```bash
npm test -- src/journey
```

Expected: FAIL module not found.

- [ ] **Step 3: Implement nodes + curve**

Define 11 nodes with `dockT` spaced ~0.05..0.95, `dockRadius` ~0.035 for peak / ~0.028 for lighter. Positions form a gentle S-curve on XZ plane, Y slight elevation variance.

Implement `createRouteCurve` with three.js `CatmullRomCurve3` (three already installed) OR a minimal Centripetal Catmull-Rom in pure TS to keep tests free of WebGL - prefer pure TS for testability:

```ts
// Pure Catmull-Rom sample: build cumulative chord lengths; lerp segments
```

`getActiveNode(progress)`: choose node minimizing `|progress - dockT|` (or first whose band contains progress).

- [ ] **Step 4: Run tests - expect pass**

```bash
npm test -- src/journey
```

- [ ] **Step 5: Commit**

```bash
git add src/journey/constants src/journey/path
git commit -m "feat(journey): add node catalog and route curve math"
```

---

### Task 2: Journey progress store + scroll rail

**Files:**
- Create: `src/journey/scroll/journeyProgressStore.ts`, `src/journey/scroll/useJourneyProgress.ts`, `src/journey/scroll/JourneyScrollRail.tsx`, `src/journey/scroll/journeyProgressStore.test.ts`
- Modify: none yet

**Interfaces:**
- Produces:
```ts
export type JourneyProgressApi = {
  progress: number; // 0..1
  setProgress: (t: number, opts?: { immediate?: boolean }) => void;
  subscribe: (fn: (t: number) => void) => () => void;
};
export function createJourneyProgressStore(): JourneyProgressApi;
export function useJourneyProgress(): number;
export function useJourneyProgressApi(): JourneyProgressApi;
```

- `JourneyScrollRail`: renders `div` with `height: 1200vh`, attaches ScrollTrigger scrub → store; exposes `data-journey-rail`

- [ ] **Step 1: Failing store test**

```ts
import { describe, expect, it } from "vitest";
import { createJourneyProgressStore } from "./journeyProgressStore";

describe("createJourneyProgressStore", () => {
  it("clamps progress and notifies subscribers", () => {
    const store = createJourneyProgressStore();
    const seen: number[] = [];
    store.subscribe((t) => seen.push(t));
    store.setProgress(0.5, { immediate: true });
    store.setProgress(2, { immediate: true });
    expect(store.progress).toBe(1);
    expect(seen.at(-1)).toBe(1);
  });
});
```

- [ ] **Step 2: Implement store + hook + rail**

Store: module-level React context provider inside `JourneyApp` later; for now export factory + `JourneyProgressProvider`.

`JourneyScrollRail`:
- `useLayoutEffect` → `gsap.registerPlugin(ScrollTrigger)`  
- Scrub timeline `onUpdate: (self) => api.setProgress(self.progress, { immediate: true })`  
- Soft docks: optional `ease` via custom progress remapping function `applyDockBias(raw)` that slows near each `dockT` (implement as piecewise scale - document formula in comment)  
- Cleanup `ctx.revert()`  
- When `setProgress` called from HUD (non-immediate), animate scroll position with `lenis.scrollTo` or `window.scrollTo` mapped from progress  

- [ ] **Step 3: Tests pass; commit**

```bash
git commit -m "feat(journey): add progress store and scroll rail"
```

---

### Task 3: Journey scene spine (camera, world, route, canvas)

**Files:**
- Create: `JourneyCamera.tsx`, `World.tsx`, `RoutePath.tsx`, `NodeLandmark.tsx`, `JourneyScene.tsx`, `JourneyCanvas.tsx`

**Interfaces:**
- Consumes: `useJourneyProgress`, `JOURNEY_NODES`, `createRouteCurve`
- Produces: lazy-friendly `JourneyCanvas` default export

- [ ] **Step 1: Implement RoutePath + World**

`World`: fog (`#050505`), ambient + directional + point highlight, faint grid (`Grid` from drei or custom), 3-6 abstract box landmarks far from path.

`RoutePath`: tube/line along curve; shader or dashed `Line` with highlight head at `progress`; low particle count (`<80` points).

`NodeLandmark`: sphere/beacon at node.position; scale/emissive boost when active.

`JourneyCamera`: each frame sample curve at `progress`, place camera behind/above point along tangent, lookAt ahead `progress+0.02`; pitch ~45°.

`JourneyScene`: compose World + Route + landmarks + camera.

`JourneyCanvas`:

```tsx
export function JourneyCanvas() {
  return (
    <Canvas
      className="fixed inset-0 -z-10"
      dpr={[1, 1.5]}
      camera={{ fov: 42, near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <JourneyScene />
    </Canvas>
  );
}
```

- [ ] **Step 2: Manual verify with temporary mount in App (or Story wrapper)** - prefer next task for App wire; for this task add `JourneyApp` shell that only shows canvas + rail for desktop.

Create minimal `JourneyApp.tsx` that:
- Provides progress context
- Renders rail + canvas
- Skip overlays

- [ ] **Step 3: `npm run build` must pass**

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(journey): add R3F world, route path, and path camera"
```

---

### Task 4: HUD (mini-map, progress, waypoints)

**Files:**
- Create: `hud/MiniMap.tsx`, `hud/JourneyHUD.tsx`

**Interfaces:**
- Consumes: `JOURNEY_NODES`, `useJourneyProgress`, `useJourneyProgressApi`
- Produces: fixed HUD overlay `pointer-events-auto` on controls only

- [ ] **Step 1: Implement MiniMap**

SVG path of projected node XZ positions; marker at progress; clickable nodes call `setProgress(node.dockT)`.

- [ ] **Step 2: Implement JourneyHUD**

- Brand logo (`src/assets/logo.png`)  
- Progress % (`Math.round(progress*100)`) + bar using highlight  
- Waypoint list (`nav` + buttons, keyboard focusable)  
- `aria-label="Journey progress"`  

- [ ] **Step 3: Mount HUD in JourneyApp**

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(journey): add journey HUD with minimap and waypoints"
```

---

### Task 5: Destination overlay stage + card shell

**Files:**
- Create: `overlays/DestinationCard.tsx`, `overlays/DestinationStage.tsx`, `overlays/cards/index.ts` (stub map)

**Interfaces:**
```ts
export function DestinationStage(): JSX.Element;
// Renders active node's card with Framer presence when within dock band
```

- [ ] **Step 1: DestinationCard shell**

Glass panel, title, subtitle, body, children slot. Uses `GlassPanel`, `SectionHeading`-like typography.

- [ ] **Step 2: DestinationStage**

```tsx
const node = getActiveNode(progress);
const local = getNodeProgress(progress, node);
const visible = local > 0; // inside band
```

Animate opacity/y with Framer; `AnimatePresence`.

- [ ] **Step 3: Wire placeholder cards for all 11 ids (title/body from constants only)**

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(journey): add destination overlay stage and card shell"
```

---

### Task 6: Peak destination cards (nodes 1-6)

**Files:**
- Create/replace: `WelcomeCard`, `GpsFailsCard`, `VpsCard`, `MappingCard`, `AiRouteCard`, `ArCard`
- Modify: `overlays/cards/index.ts`

**Interfaces:**
- Each card: `export function XxxCard(): JSX.Element`
- Reuse copy themes from V2 sections (read `src/sections/*` and `src/constants/*` for wording)

- [ ] **Step 1: Implement six peak cards** with short copy, optional SVG micro-illustration, CTA where relevant (e.g. Welcome → scroll hint)

- [ ] **Step 2: Visual check via `npm run dev`** - docks show cards

- [ ] **Step 3: Commit**

```bash
git commit -m "feat(journey): add peak destination cards for nodes 1-6"
```

---

### Task 7: Lighter cards (7-9) + Book Demo + Complete (10-11)

**Files:**
- Create: `IndustriesCard`, `AnalyticsCard`, `DevelopersCard`, `BookDemoCard`, `CompleteCard`
- Modify: card index

**Interfaces:**
- `BookDemoCard` embeds existing `ContactForm` from `@/components/contact/ContactForm`
- `CompleteCard` includes “Replay journey” button → `setProgress(0)`

- [ ] **Step 1: Implement lighter cards** - compact industry chips from `INDUSTRIES`, mini stats from `ANALYTICS_STATS`, short developer blurb

- [ ] **Step 2: BookDemoCard + CompleteCard**

- [ ] **Step 3: Ensure ContactForm test still passes**

```bash
npm test
```

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(journey): add lighter nodes and book-demo/complete cards"
```

---

### Task 8: Journey mode hook + 2D fallback

**Files:**
- Create: `hooks/useJourneyMode.ts`, `hooks/useJourneyMode.test.ts`, `fallback/JourneyFallback2D.tsx`
- Modify: `JourneyApp.tsx`

**Interfaces:**
```ts
export type JourneyMode = "world" | "fallback";
export function useJourneyMode(): JourneyMode;
// world when !reduced && matchMedia min-width 900px (or 1024px) && landscape-friendly
```

- [ ] **Step 1: Failing test for mode**

```ts
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { useJourneyMode } from "./useJourneyMode";

describe("useJourneyMode", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns fallback when reduced motion matches", () => {
    vi.stubGlobal("matchMedia", (q: string) => ({
      matches: q.includes("prefers-reduced-motion") || q.includes("max-width"),
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    }));
    const { result } = renderHook(() => useJourneyMode());
    expect(result.current).toBe("fallback");
  });
});
```

(Adjust stub so width query does not force fallback if testing reduced only - implement hook to check reduced first.)

- [ ] **Step 2: Implement fallback UI**

Vertical glowing SVG path + 11 glass stations; scroll-linked active station; simplified progress bar; reuse same cards via `DestinationCard` content components.

- [ ] **Step 3: JourneyApp branches**

```tsx
const mode = useJourneyMode();
return (
  <JourneyProgressProvider>
    {mode === "world" ? (
      <>
        <JourneyScrollRail />
        <Suspense fallback={null}>
          <LazyJourneyCanvas />
        </Suspense>
        <JourneyHUD />
        <DestinationStage />
      </>
    ) : (
      <JourneyFallback2D />
    )}
  </JourneyProgressProvider>
);
```

Lazy: `const LazyJourneyCanvas = lazy(() => import("../canvas/JourneyCanvas"))` - only when mode === world (gate dynamic import like Hero reduced-motion fix).

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(journey): add hybrid 2D fallback and mode switching"
```

---

### Task 9: Wire App - replace section stack

**Files:**
- Modify: `src/App.tsx`, `src/layouts/RootLayout.tsx`, `src/App.test.tsx`
- Optionally stop rendering `Navbar` / old `Footer` or slim Footer into Complete card only (spec: HUD replaces navbar; footer optional - keep minimal legal/footer links inside Complete card or a slim fixed footer)

**Interfaces:**
- `App` renders `<JourneyApp />` only (plus optional slim chrome)

- [ ] **Step 1: Update RootLayout**

Remove or conditionally disable old `Navbar` and heavy `Atmosphere` if it fights the 3D world. Keep `SkipLink`. For world mode, Atmosphere can be omitted (world has its own fog/grid). For fallback, keep a light atmosphere.

Simplest approved approach: `RootLayout` becomes thin - `SkipLink` + `main`; `JourneyApp` owns visuals.

- [ ] **Step 2: Replace App body**

```tsx
import { JourneyApp } from "@/journey/JourneyApp";

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
      <main id="main">
        <JourneyApp />
      </main>
    </>
  );
}
```

Or keep `RootLayout` if skip link lives there - update tests accordingly.

- [ ] **Step 3: Fix App.test.tsx** for journey landmarks (e.g. journey progress label / Welcome text)

- [ ] **Step 4: `npm test` + `npm run build`**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(journey): make immersive journey the homepage"
```

---

### Task 10: Polish - a11y, SEO, performance, archive note

**Files:**
- Modify: `index.html` meta description (journey framing), `JourneyCanvas` visibility pause, card focus traps for Book Demo
- Create: `docs/superpowers/specs/2026-08-04-navme-sections-archive-note.md` listing retired section components (do not delete binary assets)

- [ ] **Step 1: SEO copy update** for immersive experience

- [ ] **Step 2: Pause R3F when `document.hidden`; ensure fallback path never imports canvas**

- [ ] **Step 3: Keyboard: document ArrowDown/Up handlers on journey when not typing in inputs**

- [ ] **Step 4: Final `npm test` + `npm run build`**

- [ ] **Step 5: Commit**

```bash
git commit -m "chore(journey): a11y, SEO, and performance polish"
```

---

## Spec Coverage

| Spec item | Task |
|---|---|
| Evolve / reuse design system | 6-9 |
| Progress rail + soft docks | 2 |
| R3F path camera ~45° | 3 |
| Route glow + nodes | 3 |
| HUD / minimap / waypoints | 4 |
| Destination glass cards | 5-7 |
| Peak 1-6 | 6 |
| Lighter 7-9 | 7 |
| Book Demo + Complete | 7 |
| Hybrid fallback | 8 |
| Homepage swap | 9 |
| Perf / reduced-motion chunk skip | 8, 10 |

## Self-Review Notes

- Types `JourneyNode`, `dockT`, `createRouteCurve`, progress store are consistent across tasks  
- No Spline dependency  
- Section files left in repo until Task 9/10; not required for runtime after homepage swap  
- Soft-dock bias algorithm specified as custom remapping in Task 2 (implementer must document formula in code comment)
