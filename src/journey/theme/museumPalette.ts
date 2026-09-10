/**
 * Shared museum-vertical palette for UI + 3D corridor.
 * Warm gallery stone / bronze architecture; soft teal kept for AR wayfinding.
 */
export const MUSEUM = {
  /** UI / brand primary (bronze) */
  primary: "#C4A574",
  /** Secondary warm accent */
  accent: "#8B6F4E",
  /** AR wayfinding highlight (soft teal) */
  highlight: "#6ECFC8",
  /** Corridor walls (warm limestone) */
  wall: "#E4D9C8",
  wallEmissive: "#B8A88E",
  /** Oak floor */
  floor: "#8A7460",
  /** Soft gallery ceiling */
  ceiling: "#A0907C",
  ceilingEmissive: "#D4C4A8",
  /** Fog / clear color */
  fog: "#8A7E70",
  /** Bronze door trim */
  trim: "#8B7358",
  /** Warm gallery light */
  light: "#FFF6E4",
  lightPanel: "#FFF0D4",
  /** Carpet runner */
  runner: "#8A5A52",
  /** Picture frame */
  frame: "#6A5844",
  frameInner: "#4A3C30",
  /** Marble statue */
  marble: "#E8E2D8",
  marbleShade: "#C8C0B4",
  /** Pedestal */
  pedestal: "#5C5348",
} as const;
