import {
  galleryStandBackForAspect,
  storyBoardForAspect,
} from "@/journey/camera/galleryFrame";
import {
  getGalleryWallForRoom,
} from "@/journey/camera/galleryWallStore";
import { createLinearRouteCurve } from "@/journey/path/routeCurve";
import {
  FINISH_WALL_FRAME,
  ROOM_DOCK_T,
  STORY_ROOMS,
  finishWallCamera,
  INTRO_LOGO_FRAME,
  WALK_WAYPOINTS,
  isStairClimbY,
  roomLookSign,
  type StoryRoom,
} from "@/journey/path/walkPath";
import { MathUtils, Vector3 } from "three";

/** Standing adult eye height - always inside the building. */
export const EYE_HEIGHT = 1.62;
/** Stand this many meters behind the progress point along the route. */
export const BEHIND_METERS = 2.45;
export const JOURNEY_FOV = 74;
export const INTRO_FOV = 52;
/** Finish: fully blend into the wall-filling frame. */
export const FINISH_ZOOM_BLEND = 1;
export const FINISH_FOV = FINISH_WALL_FRAME.fov;

let cachedCurve: ReturnType<typeof createLinearRouteCurve> | null = null;
let cachedRouteLen = 0;
let cachedWaypointKey = "";

function waypointKey(): string {
  const last = WALK_WAYPOINTS[WALK_WAYPOINTS.length - 1];
  return `${WALK_WAYPOINTS.length}:${last?.[0]}:${last?.[1]}:${last?.[2]}`;
}

function getCurve() {
  const key = waypointKey();
  if (!cachedCurve || cachedWaypointKey !== key) {
    cachedCurve = createLinearRouteCurve(WALK_WAYPOINTS);
    let total = 0;
    for (let i = 0; i < WALK_WAYPOINTS.length - 1; i++) {
      const a = WALK_WAYPOINTS[i];
      const b = WALK_WAYPOINTS[i + 1];
      total += Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    }
    cachedRouteLen = Math.max(total, 1);
    cachedWaypointKey = key;
  }
  return { curve: cachedCurve, routeLen: cachedRouteLen };
}

const _forward = new Vector3();
const _tangent = new Vector3();
const LOOK_AHEAD_METERS = 5.0;

function roomAtDockT(dockT: number): StoryRoom | undefined {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < ROOM_DOCK_T.length; i++) {
    const dist = Math.abs(ROOM_DOCK_T[i] - dockT);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return STORY_ROOMS[best];
}

/** Match CorridorExhibits wall-board placement (landscape default). */
export const GALLERY_BOARD_CENTER_Y = 2.12;
export const GALLERY_BOARD_INSET = 0.2;
/** Stand this far back from the exhibit wall (robot / first-person view). */
const WALL_STAND_BACK = 4.35;

function galleryWallSign(
  index: number,
  wall: "left" | "right",
): number {
  const look = roomLookSign(index);
  return wall === "left" ? look : -look;
}

function galleryStandBack(aspect: number, width = 0): number {
  return galleryStandBackForAspect(aspect, WALL_STAND_BACK, width);
}

/**
 * Centered first-person framing at the exhibit wall
 * (camera stands where Nav would look — no side offset).
 */
function galleryWallFraming(
  room: StoryRoom,
  aspect = 16 / 9,
  width = 0,
): {
  camX: number;
  camY: number;
  camZ: number;
  lookX: number;
  lookY: number;
  lookZ: number;
  wallSign: number;
} {
  const index = STORY_ROOMS.findIndex((item) => item.id === room.id);
  const wall = getGalleryWallForRoom(room.id);
  const wallSign = galleryWallSign(index, wall);
  const [cx, cy, cz] = room.center;
  const board = storyBoardForAspect(aspect, width);
  const wallX = cx + wallSign * (room.size[0] / 2 - GALLERY_BOARD_INSET);
  const standBack = galleryStandBack(aspect, width);
  const lookY = cy + board.centerY;
  // Robot first-person: stand at plaque height and look straight at center.
  return {
    camX: wallX - wallSign * standBack,
    camY: lookY,
    camZ: cz,
    lookX: wallX,
    lookY,
    lookZ: cz,
    wallSign,
  };
}

/** Stand at the wall and look straight at the board (Nav's view). */
export function poseAtDock(
  dockT: number,
  outPos: Vector3,
  outLook: Vector3,
  aspect = 16 / 9,
  width = 0,
): void {
  const room = roomAtDockT(dockT);
  if (!room || room.id === "complete") {
    poseAlongRoute(dockT, outPos, outLook);
    return;
  }
  const frame = galleryWallFraming(room, aspect, width);
  outPos.set(frame.camX, frame.camY, frame.camZ);
  outLook.set(frame.lookX, frame.lookY, frame.lookZ);
}

/**
 * Path-locked framing at any progress along the walk route
 * (used for adjacent POI corridor travel).
 */
export function poseAlongRoute(
  progress: number,
  outPos: Vector3,
  outLook: Vector3,
): void {
  const { curve, routeLen } = getCurve();
  const t = MathUtils.clamp(progress, 0, 1);
  const focus = curve.getPointAt(t);
  const onStair = isStairClimbY(focus.y);
  const behindT = (onStair ? 1.55 : BEHIND_METERS) / routeLen;
  const aheadT = (onStair ? 2.4 : LOOK_AHEAD_METERS) / routeLen;
  const camT = Math.max(0, t - behindT);
  const lookT = Math.min(1, t + aheadT * 0.35);

  const point = curve.getPointAt(camT);
  const ahead = curve.getPointAt(lookT);
  const tangent = curve.getTangentAt(Math.max(camT, 0.0001));

  outPos.set(
    point.x,
    point.y + (onStair ? 1.22 : EYE_HEIGHT),
    point.z,
  );

  if (onStair) {
    _forward.set(
      focus.x - point.x,
      focus.y - point.y,
      focus.z - point.z,
    );
    if (_forward.lengthSq() < 1e-5) {
      _forward.set(tangent.x, tangent.y, tangent.z);
    }
    if (_forward.lengthSq() < 1e-5) {
      _forward.set(0, 0.35, 1);
    }
    _forward.normalize();
    outLook.set(
      point.x + _forward.x * 3.4,
      point.y + 1.05 + _forward.y * 2.2,
      point.z + _forward.z * 3.4,
    );
    return;
  }

  _forward.set(focus.x - point.x, 0, focus.z - point.z);
  if (_forward.lengthSq() < 1e-5) {
    _forward.set(ahead.x - point.x, 0, ahead.z - point.z);
  }
  if (_forward.lengthSq() < 1e-5) {
    _tangent.set(tangent.x, 0, tangent.z);
    if (_tangent.lengthSq() > 1e-5) {
      _forward.copy(_tangent);
    } else {
      _forward.set(0, 0, 1);
    }
  }
  _forward.normalize();

  outLook.set(
    point.x + _forward.x * 5.0,
    ahead.y + EYE_HEIGHT * 0.92,
    point.z + _forward.z * 5.0,
  );
}

export function poseAtIntro(outPos: Vector3, outLook: Vector3): void {
  outPos.fromArray(INTRO_LOGO_FRAME.cameraPos);
  outLook.fromArray(INTRO_LOGO_FRAME.lookAt);
}

const _wallPosTmp = new Vector3();
const _wallLookTmp = new Vector3();

/** Zoom from a dock pose into the wall-filling finish frame. */
export function poseAtFinishZoom(
  dockPos: Vector3,
  dockLook: Vector3,
  outPos: Vector3,
  outLook: Vector3,
  blend = FINISH_ZOOM_BLEND,
  aspect = 16 / 9,
): void {
  const frame = finishWallCamera(aspect);
  _wallPosTmp.fromArray(frame.cameraPos);
  _wallLookTmp.fromArray(frame.lookAt);
  outPos.lerpVectors(dockPos, _wallPosTmp, blend);
  outLook.lerpVectors(dockLook, _wallLookTmp, blend);
}

export function smoothstep01(u: number): number {
  const x = MathUtils.clamp(u, 0, 1);
  return x * x * (3 - 2 * x);
}

/** World XZ at a progress point (for companion straight hops). */
export function pointAtProgress(
  progress: number,
): { x: number; y: number; z: number } {
  const { curve } = getCurve();
  return curve.getPointAt(MathUtils.clamp(progress, 0, 1));
}
