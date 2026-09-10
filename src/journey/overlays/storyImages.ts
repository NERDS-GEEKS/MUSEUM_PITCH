import welcomeImg from "@/assets/billboard/billboard-welcome.png";
import gpsFailsImg from "@/assets/billboard/billboard-gps-fails.png";
import vpsImg from "@/assets/billboard/billboard-vps.png";
import mappingImg from "@/assets/billboard/billboard-mapping.png";
import industriesImg from "@/assets/billboard/billboard-industries.png";
import analyticsImg from "@/assets/billboard/billboard-analytics.png";
import completeImg from "@/assets/billboard/billboard-complete.png";
import capabilityOpsImg from "@/assets/billboard/billboard-capability-ops.png";
import capabilitySmartSearchImg from "@/assets/billboard/billboard-capability-smart-search.jpg";
import capabilityInteractiveMapsImg from "@/assets/billboard/billboard-capability-interactive-maps.jpg";
import capabilityRouteOptimizationImg from "@/assets/billboard/billboard-capability-route-optimization.jpg";
import industryMuseumsImg from "@/assets/billboard/billboard-industry-museums.png";
import arImg from "@/assets/billboard/billboard-ar.png";

/** Shared story imagery for 2D billboards and 3D corridor screens. */
export const STORY_IMAGES: Record<string, string> = {
  welcome: welcomeImg,
  "gps-fails": gpsFailsImg,
  vps: vpsImg,
  mapping: mappingImg,
  analytics: analyticsImg,
  industries: industriesImg,
  complete: completeImg,
};

export type StoryGalleryItem = {
  id: string;
  title: string;
  description: string;
  src: string;
};

/** Navigate stop: Find → Discover → Learn → Engage → Continue. */
export const CAPABILITY_IMAGES: readonly StoryGalleryItem[] = [
  {
    id: "find",
    title: "Step 1 — Find",
    description:
      '"Take me to the Modern Art Gallery." An animated AR navigation path lights across the museum floor.',
    src: capabilityRouteOptimizationImg,
  },
  {
    id: "discover",
    title: "Step 2 — Discover",
    description: "Nearby exhibits illuminate automatically.",
    src: capabilityInteractiveMapsImg,
  },
  {
    id: "learn",
    title: "Step 3 — Learn",
    description: "Reveal stories, artists, history, audio and multimedia.",
    src: capabilitySmartSearchImg,
  },
  {
    id: "engage",
    title: "Step 4 — Engage",
    description: "Interactive AR trails, quizzes and themed journeys.",
    src: capabilityOpsImg,
  },
  {
    id: "continue",
    title: "Step 5 — Continue",
    description:
      "Recommend the next exhibit based on the visitor's journey.",
    src: mappingImg,
  },
];

/** @deprecated Use CAPABILITY_IMAGES. Tags are now full roll frames. */
export const PLATFORM_FEATURE_TAGS = [
  "Find",
  "Discover",
  "Learn",
  "Engage",
  "Continue",
] as const;

/** Convert stop: Physical → Twin → AR Layer → Intelligent Museum. */
export const INDUSTRY_IMAGES: readonly StoryGalleryItem[] = [
  {
    id: "physical-museum",
    title: "Physical Museum",
    description:
      "Galleries, collections and architecture as visitors walk them today.",
    src: gpsFailsImg,
  },
  {
    id: "digital-twin",
    title: "Digital Twin",
    description:
      "The same museum, digitally recreated as a navigable spatial layer.",
    src: vpsImg,
  },
  {
    id: "ar-experience",
    title: "AR Experience Layer",
    description:
      "Navigation paths, living exhibits and stories overlaid in the browser.",
    src: arImg,
  },
  {
    id: "intelligent-museum",
    title: "Intelligent Museum",
    description:
      "A measurable destination with engagement, accessibility and insight.",
    src: industryMuseumsImg,
  },
];
