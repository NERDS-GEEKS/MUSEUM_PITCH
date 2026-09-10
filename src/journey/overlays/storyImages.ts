import fallbackImg from "@/assets/wayfinding-reference.png";
import logoImg from "@/assets/logo.png";

const welcomeImg = logoImg;
const gpsFailsImg = fallbackImg;
const vpsImg = fallbackImg;
const mappingImg = fallbackImg;
const industriesImg = fallbackImg;
const analyticsImg = logoImg;
const completeImg = logoImg;
const capabilityOpsImg = fallbackImg;
const capabilitySmartSearchImg = fallbackImg;
const capabilityInteractiveMapsImg = fallbackImg;
const capabilityRouteOptimizationImg = fallbackImg;
const industryMuseumsImg = fallbackImg;
const arImg = logoImg;

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
    title: "Step 1: Find",
    description:
      '"Take me to the Modern Art Gallery." An animated AR navigation path lights across the museum floor.',
    src: capabilityRouteOptimizationImg,
  },
  {
    id: "discover",
    title: "Step 2: Discover",
    description: "Nearby exhibits illuminate automatically.",
    src: capabilityInteractiveMapsImg,
  },
  {
    id: "learn",
    title: "Step 3: Learn",
    description: "Reveal stories, artists, history, audio and multimedia.",
    src: capabilitySmartSearchImg,
  },
  {
    id: "engage",
    title: "Step 4: Engage",
    description: "Interactive AR trails, quizzes and themed journeys.",
    src: capabilityOpsImg,
  },
  {
    id: "continue",
    title: "Step 5: Continue",
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
