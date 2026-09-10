/** Phone screens are taller than they are wide. */
export function isPortraitAspect(aspect: number): boolean {
  return aspect > 0 && aspect < 0.86;
}

export type StoryBoardSize = {
  worldW: number;
  worldH: number;
  cssW: number;
  centerY: number;
};

/** Desktop / landscape: wide salon plaque. */
export const LANDSCAPE_STORY_BOARD: StoryBoardSize = {
  worldW: 6.4,
  worldH: 3.55,
  cssW: 640,
  centerY: 2.12,
};

/**
 * Phone / portrait: taller plaque that fits in the camera frustum
 * when looking at the story wall from room center.
 */
export const PORTRAIT_STORY_BOARD: StoryBoardSize = {
  worldW: 2.7,
  worldH: 3.18,
  cssW: 400,
  centerY: 2.02,
};

/** Step back from the story wall on phones so the plaque sits in the HUD-safe frame. */
export const PORTRAIT_CAMERA_PULLBACK = 0.95;

export function storyBoardForAspect(aspect: number): StoryBoardSize {
  return isPortraitAspect(aspect) ? PORTRAIT_STORY_BOARD : LANDSCAPE_STORY_BOARD;
}

/** Slightly wider view on phones so the plaque has breathing room. */
export function journeyFovForAspect(aspect: number, landscapeFov: number): number {
  return isPortraitAspect(aspect) ? Math.max(landscapeFov, 80) : landscapeFov;
}
