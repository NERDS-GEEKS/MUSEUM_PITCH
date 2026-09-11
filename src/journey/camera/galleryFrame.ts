/** Phone screens are taller than they are wide. */
export function isPortraitAspect(aspect: number): boolean {
  return aspect > 0 && aspect < 0.86;
}

/**
 * Mid-size frames (foldables, tablets) that need their own plaque.
 * The band starts at 431 so the largest phones (e.g. 430 px Pro Max, and the
 * 420 px locked viewport narrow phones render at) keep the portrait plaque.
 */
export const TABLET_MIN_PX = 431;
export const TABLET_MAX_PX = 928;

export function isTabletFrame(width: number): boolean {
  return width >= TABLET_MIN_PX && width <= TABLET_MAX_PX;
}

export function isCompactFrame(width: number, aspect: number): boolean {
  if (width > 0) return width <= TABLET_MAX_PX;
  return isPortraitAspect(aspect);
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
 * Fallback phone plaque (used by tests / callers that need a static size).
 * Runtime phones use `storyBoardForAspect` which fills the live frustum.
 */
export const PORTRAIT_STORY_BOARD: StoryBoardSize = {
  worldW: 3.15,
  worldH: 4.05,
  cssW: 400,
  centerY: 2.08,
};

export const PHONE_STAND_BACK = 3.85;
export const TABLET_STAND_BACK = 4.15;

function frustumSize(
  standBack: number,
  fovDeg: number,
  aspect: number,
): { visibleW: number; visibleH: number } {
  const safeAspect = Math.max(aspect, 0.01);
  const vFov = (fovDeg * Math.PI) / 180;
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * safeAspect);
  return {
    visibleW: 2 * standBack * Math.tan(hFov / 2),
    visibleH: 2 * standBack * Math.tan(vFov / 2),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function fitBoard(options: {
  aspect: number;
  standBack: number;
  fov: number;
  fillW: number;
  fillH: number;
  minRatio: number;
  maxRatio: number;
  minW: number;
  maxW: number;
  minH: number;
  maxH: number;
  cssMin: number;
  cssMax: number;
  centerY: number;
}): StoryBoardSize {
  const { visibleW, visibleH } = frustumSize(
    options.standBack,
    options.fov,
    options.aspect,
  );

  let worldW = visibleW * options.fillW;
  let worldH = visibleH * options.fillH;
  const ratio = worldW / Math.max(worldH, 0.01);
  if (ratio > options.maxRatio) worldW = worldH * options.maxRatio;
  if (ratio < options.minRatio) worldH = worldW / options.minRatio;

  worldW = clamp(worldW, options.minW, options.maxW);
  worldH = clamp(worldH, options.minH, options.maxH);

  const cssW = Math.round(
    clamp(
      options.cssMin + (worldW - options.minW) * 36,
      options.cssMin,
      options.cssMax,
    ),
  );

  return {
    worldW,
    worldH,
    cssW,
    centerY: options.centerY,
  };
}

/** Wider FOV on compact frames so the plaque can sit near the screen edges. */
export function journeyFovForAspect(
  aspect: number,
  landscapeFov: number,
  width = 0,
): number {
  if (isTabletFrame(width)) return Math.max(landscapeFov, 78);
  if (isCompactFrame(width, aspect)) return Math.max(landscapeFov, 82);
  return landscapeFov;
}

/**
 * Plaque sized for the live viewport. Width 431–928 uses a tablet sheet
 * that stays inside the HUD-safe frame; phones stay portrait; desktop
 * keeps the wide salon board.
 */
export function storyBoardForAspect(
  aspect: number,
  width = 0,
): StoryBoardSize {
  if (isTabletFrame(width)) {
    const fov = journeyFovForAspect(aspect, 74, width);
    return fitBoard({
      aspect,
      standBack: TABLET_STAND_BACK,
      fov,
      // Leave room for the top HUD and bottom swipe chips.
      fillW: 0.9,
      fillH: 0.62,
      minRatio: 0.82,
      maxRatio: 1.42,
      minW: 3.35,
      maxW: 5.35,
      minH: 3.05,
      maxH: 3.85,
      cssMin: 500,
      cssMax: 600,
      centerY: 2.08,
    });
  }

  if (!isCompactFrame(width, aspect)) return LANDSCAPE_STORY_BOARD;

  const fov = journeyFovForAspect(aspect, 74, width);
  return fitBoard({
    aspect,
    standBack: PHONE_STAND_BACK,
    fov,
    fillW: 0.92,
    fillH: 0.7,
    minRatio: 0.64,
    maxRatio: 0.86,
    minW: 2.85,
    maxW: 4.15,
    minH: 3.35,
    maxH: 4.25,
    cssMin: 380,
    cssMax: 430,
    centerY: 2.08,
  });
}

/** Camera stand-back for the current frame. Compact uses a HUD-safe contain. */
export function galleryStandBackForAspect(
  aspect: number,
  landscapeStandBack: number,
  width = 0,
): number {
  if (!isCompactFrame(width, aspect)) return landscapeStandBack;
  const fov = journeyFovForAspect(aspect, 74, width);
  const board = storyBoardForAspect(aspect, width);
  const contain = galleryViewDistance(aspect, fov, board);
  if (isTabletFrame(width)) {
    return Math.max(TABLET_STAND_BACK, contain);
  }
  return Math.max(PHONE_STAND_BACK, contain);
}

/** Distance so the story plaque fully fits (contain) in the viewport. */
export function galleryViewDistance(
  aspect: number,
  fovDeg: number,
  board: StoryBoardSize,
): number {
  const safeAspect = Math.max(aspect, 0.01);
  const vFov = (fovDeg * Math.PI) / 180;
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * safeAspect);
  const distH = board.worldH / 2 / Math.tan(vFov / 2);
  const distW = board.worldW / 2 / Math.tan(hFov / 2);
  return Math.max(distH, distW) * 1.04;
}
