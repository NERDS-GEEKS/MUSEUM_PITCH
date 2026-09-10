# NavMe Immersive Scroll Journey - Design Spec

**Date:** 2026-08-04  
**Status:** Approved (design sections 1-3)  
**Approach:** Single R3F world + scroll-scrubbed camera (Approach A)  
**Relationship to V2:** Evolve - keep design system; replace section-stack homepage with journey

## 1. Goal

Turn the NavMe homepage into an immersive navigation journey. Scrolling advances a camera along an AI route through destinations. Visitors should feel they experienced indoor spatial navigation - not that they opened a marketing page.

## 2. Decisions Locked

| Decision | Choice |
|---|---|
| Relation to V2 site | Evolve: reuse tokens, UI primitives, contact stubs; replace scroll architecture |
| Mobile / reduced-motion | Hybrid: desktop & tablet landscape = 3D journey; mobile / narrow viewports & `prefers-reduced-motion` = 2D path + glass stations |
| Delivery scope | Core route first: peak polish on nodes 1-6 + 10-11; lighter stops on 7-9 |
| Scroll mechanic | Soft docks: continuous travel between nodes with sticky hold at each destination |
| World architecture | One persistent R3F scene; progress 0→1 drives camera along path |

## 3. Visual System (inherited + journey accents)

Retain V2 tokens:

- Background `#050505`, secondary `#101010`, glass / border, text / muted  
- Primary `#4F8BFF`, accent `#7C5CFF`, highlight `#3EF4FF` (route head, scan, active node)  
- Geist Sans, glass panels, magnetic buttons  

Journey-specific:

- Neon AI route (not a road): flowing particles, directional cues, pulse  
- Soft fog, spatial grid, abstract landmark extrusions - premium, not cartoon  
- Camera ~45° look-down, slight bank on curves, no hard cuts  

## 4. Architecture

```
src/journey/
  JourneyApp.tsx           # mounts canvas OR fallback; owns progress
  scroll/useJourneyProgress.ts
  camera/JourneyCamera.tsx
  world/World.tsx
  world/RoutePath.tsx
  world/NodeLandmark.tsx
  hud/JourneyHUD.tsx
  hud/MiniMap.tsx
  overlays/DestinationCard.tsx
  overlays/cards/*.tsx     # per-node card content
  fallback/JourneyFallback2D.tsx
  constants/nodes.ts       # 11 nodes: id, title, copy, pathT, polish
  path/routeCurve.ts       # Catmull-Rom (or equivalent) control points
```

Reuse unchanged where possible:

- `src/components/ui/*`, `src/hooks/usePrefersReducedMotion`, `useMagnetic`, `cn`  
- `src/utils/submitLead`, `validateContact`, `ContactForm` (Node 10)  
- Tokens / globals / logo  

`App.tsx` renders `JourneyApp` as the homepage. Traditional `src/sections/*` stack is no longer the primary experience; files may remain briefly for copy extraction then be removed or archived.

## 5. Journey Engine

### Progress rail
- Tall invisible scroll track (~1100-1400vh) exists only to produce scroll progress  
- Lenis smooths input; GSAP ScrollTrigger maps scroll → `progress ∈ [0, 1]`  

### Camera
- Follows a 3D path through 11 waypoints  
- Look-at slightly ahead on the path; elevation and FOV ease per node  
- Soft dock: each node has a progress band with higher damping / pin hold while the destination card reveals  

### Route visualization
- Glowing polyline; particle head at `progress`  
- Visited segments complete; active node glows; upcoming dim  

### Performance
- Lazy-load R3F journey chunk  
- Distance / frustum culling; pause when document hidden  
- Cap `dpr`; low mesh budget for landmarks  
- Desktop mid-tier ~60fps target; Lighthouse via static shell + deferred WebGL  

## 6. Nodes

| # | Id | Title | Polish |
|---|---|---|---|
| 1 | welcome | Welcome to NavMe | Peak |
| 2 | gps-fails | Why GPS Fails | Peak |
| 3 | vps | Visual Positioning | Peak |
| 4 | mapping | Indoor Mapping | Peak |
| 5 | ai-route | AI Route Engine | Peak |
| 6 | ar | Augmented Reality | Peak |
| 7 | industries | Industries | Lighter |
| 8 | analytics | Analytics | Lighter |
| 9 | developers | Developer APIs | Lighter |
| 10 | book-demo | Book Demo | Peak |
| 11 | complete | Destination Complete | Peak |

### Peak vs lighter
- **Peak:** richer landmark, full glass overlay, micro-interactions  
- **Lighter:** simpler mesh, shorter card, same dock pattern  

### Content sources (from V2)
- 1 ← Hero; 2 ← WhyGpsFails; 3 ← Vps; 4 ← HowItWorks/Features mapping; 5 ← AiTechnology; 6 ← AR features; 7 ← Industries; 8 ← Analytics; 9 ← Demo/Features condensed; 10 ← ContactForm; 11 ← new arrival copy  

FAQ / Testimonials / TrustedBy are not full stops in this v1. Brief anonymous signals may appear inside Nodes 7 or 11. Optional compact FAQ accordion on Node 10/11 without restoring a webpage section stack.

## 7. HUD (replaces classic navbar)

- NavMe brand mark  
- Mini-map of route + you-are-here  
- Journey percentage + progress line  
- Waypoint list (click eases progress to that dock)  
- No traditional Products/Solutions link bar as primary chrome  

## 8. Destination overlays

- Glass floating card: title, short explanation, optional illustration, CTAs  
- Node 10: full Book Demo form via existing `ContactForm` + `submitLead` stub  
- Node 11: arrival state + optional recap / replay control (ease progress to 0)  

## 9. Fallback (mobile + reduced-motion)

- No WebGL camera journey  
- Vertical 2D glowing path with 11 stations  
- Same copy and soft scroll docking metaphor  
- Simplified progress HUD  

## 10. Interactions

- Wheel/trackpad → progress along path  
- Waypoint / mini-map click → ease to node (no pop)  
- Keyboard: ArrowDown/Up or J/K nudge; focusable waypoint list  
- Magnetic CTAs on peak cards  
- Mouse spotlight on overlays only  

## 11. Out of Scope (this v1)

- Full equal polish on nodes 7-9  
- True volumetric lighting / Spline-authored megascenes  
- Wired CRM (stubs remain)  
- Parallel `/classic` marketing route (unless added later)  
- Candy-crush / cartoon aesthetics  

## 12. Success Criteria

- Desktop feel: walking a NavMe route, not scrolling a landing page  
- Soft docks intentional; camera never jumps  
- Hybrid fallback preserves story  
- Book Demo works end-to-end against stub  
- Peak nodes 1-6 + 10-11; lighter 7-9  
- Reduced-motion never loads the heavy journey chunk unnecessarily  
- Design tokens and contact utilities reused  

## 13. Implementation Notes

Greenfield journey layer on top of existing Vite app. Implement path + camera + HUD spine first, then peak destination cards, then lighter nodes, then fallback and polish.
