import { JOURNEY_NODES } from "@/journey/constants/nodes";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import { useJourneyProgressStore } from "./useJourneyProgress";

const DOCK_BIAS_ALPHA = 0.55;

/**
 * Soft-dock bias slows wheel zoom near destination centers.
 * Wheel delta is applied then remapped so stations feel intentional.
 *
 * For dock center `c` with radius `r`, band `[c−r, c+r]`:
 *   u = (t − lo) / span
 *   w(u) = u + (α / 2π) * sin(2π u)
 *   biased = lo + w(u) * span
 */
export function applyDockBias(raw: number): number {
  const t = Math.min(1, Math.max(0, raw));

  for (const node of JOURNEY_NODES) {
    const c = node.dockT;
    const r = node.dockRadius;
    const lo = Math.max(0, c - r);
    const hi = Math.min(1, c + r);
    if (t < lo || t > hi) continue;

    const span = hi - lo;
    if (span <= 0) return t;
    const u = (t - lo) / span;
    const w =
      u + (DOCK_BIAS_ALPHA / (2 * Math.PI)) * Math.sin(2 * Math.PI * u);
    return lo + w * span;
  }

  return t;
}

/** Inverse of applyDockBias for mapping HUD progress → scroll position. */
export function invertDockBias(biased: number): number {
  const target = Math.min(1, Math.max(0, biased));

  for (const node of JOURNEY_NODES) {
    const c = node.dockT;
    const r = node.dockRadius;
    const lo = Math.max(0, c - r);
    const hi = Math.min(1, c + r);
    if (target < lo || target > hi) continue;

    const span = hi - lo;
    if (span <= 0) return target;
    const v = (target - lo) / span;

    // Newton solve w(u) = v
    let u = v;
    for (let i = 0; i < 8; i++) {
      const w =
        u + (DOCK_BIAS_ALPHA / (2 * Math.PI)) * Math.sin(2 * Math.PI * u);
      const dw = 1 + DOCK_BIAS_ALPHA * Math.cos(2 * Math.PI * u);
      if (Math.abs(dw) < 1e-9) break;
      u -= (w - v) / dw;
      u = Math.min(1, Math.max(0, u));
    }
    return lo + u * span;
  }

  return target;
}

function scrollProgressToY(progress: number, rail: HTMLElement): number {
  const maxScroll = Math.max(0, rail.offsetHeight - window.innerHeight);
  return rail.offsetTop + invertDockBias(progress) * maxScroll;
}

export function JourneyScrollRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const store = useJourneyProgressStore();

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: rail,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          store.setProgress(applyDockBias(self.progress), { immediate: true });
        },
      });
    }, rail);

    const animateTo = (t: number) => {
      const y = scrollProgressToY(t, rail);
      window.scrollTo({ top: y, behavior: "smooth" });
    };

    store.bindScrollAnimator(animateTo);

    return () => {
      store.bindScrollAnimator(null);
      ctx.revert();
    };
  }, [store]);

  return (
    <div
      ref={railRef}
      data-journey-rail
      aria-hidden
      style={{ height: "1200vh", width: "1px", pointerEvents: "none" }}
    />
  );
}
