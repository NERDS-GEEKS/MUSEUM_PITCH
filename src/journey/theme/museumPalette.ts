/**
 * Shared museum-vertical palette for UI + 3D corridor.
 * Dim professional gallery stone / bronze; soft teal kept for AR wayfinding.
 */
export const MUSEUM = {
  /** UI / brand primary (bronze) */
  primary: "#C4A574",
  /** Secondary warm accent */
  accent: "#8B6F4E",
  /** AR wayfinding highlight (soft teal) */
  highlight: "#6ECFC8",
  /** Corridor walls (taupe plaster) */
  wall: "#534C45",
  wallEmissive: "#6A5E52",
  /** Dark oak floor */
  floor: "#2A241E",
  /** Dim gallery ceiling */
  ceiling: "#2C2722",
  ceilingEmissive: "#5A5048",
  /** Fog / clear color */
  fog: "#1E1A16",
  /** Bronze door trim */
  trim: "#7A6A58",
  /** Warm gallery light */
  light: "#E8D8BC",
  lightPanel: "#DCC8A4",
  /** Carpet runner */
  runner: "#4A2E2C",
  /** Picture frame */
  frame: "#3A322C",
  frameInner: "#2A2420",
  /** Marble statue */
  marble: "#D8D2CA",
  marbleShade: "#A89F94",
  /** Pedestal */
  pedestal: "#3E3832",
} as const;
