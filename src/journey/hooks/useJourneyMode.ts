import { useState } from "react";

export type JourneyMode = "world" | "fallback";

/**
 * Immersive 3D journey for all devices.
 * Reduced motion no longer forces the 2D fallback - OpeningPrelude and
 * Framer/GSAP still respect prefers-reduced-motion for lighter animation.
 * Fallback mode remains available for explicit opt-in / future WebGL failure.
 */
export function useJourneyMode(): JourneyMode {
  const [mode] = useState<JourneyMode>("world");
  return mode;
}
