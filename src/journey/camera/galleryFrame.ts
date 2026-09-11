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
 * Phone / portrait: narrower plaque that fits the first-person wall
 * frustum at the same stand-back as desktop (no cropped left/right).
 */
export const PORTRAIT_STORY_BOARD: StoryBoardSize = {
  worldW: 2.55,
  worldH: 3.35,
  cssW: 390,
  centerY: 2.08,
};

export function storyBoardForAspect(aspect: number): StoryBoardSize {
  return isPortraitAspect(aspect) ? PORTRAIT_STORY_BOARD : LANDSCAPE_STORY_BOARD;
}

/** Slightly wider FOV on phones so the plaque has edge breathing room. */
export function journeyFovForAspect(
  aspect: number,
  landscapeFov: number,
): number {
  return isPortraitAspect(aspect) ? Math.max(landscapeFov, 78) : landscapeFov;
}

/** Distance so the story plaque fully fits (contain) in the viewport. */
export function galleryViewDistance(
  aspect: number,
  fovDeg: number,
  board: StoryBoardSize = storyBoardForAspect(aspect),
): number {
  const safeAspect = Math.max(aspect, 0.01);
  const vFov = (fovDeg * Math.PI) / 180;
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * safeAspect);
  const distH = board.worldH / 2 / Math.tan(vFov / 2);
  const distW = board.worldW / 2 / Math.tan(hFov / 2);
  return Math.max(distH, distW) * 1.05;
}
