/**
 * Indoor room-to-room walk - snake through story rooms connected by short halls.
 * Path always passes through doorways (never through solid walls).
 */

export type RoomSide = "left" | "right" | "center";
/** Ground = 0, first = 1, second = 2. */
export type MuseumFloor = 0 | 1 | 2;

export type StoryRoom = {
  id: string;
  /** Floor center */
  center: [number, number, number];
  /** Room floor size [widthX, depthZ] */
  size: [number, number];
  side: RoomSide;
  floor: MuseumFloor;
};

export const DOOR_WIDTH = 2.8;
/** Inner corridor width matches the doorway so hall faces and jambs share an edge. */
export const HALL_WIDTH = DOOR_WIDTH;
export const CORRIDOR_HALF_WIDTH = HALL_WIDTH / 2;
export const ROOM_WALL_H = 4.2;
export const HALL_WALL_T = 0.28;

/** Rise between museum floors (clears a 4.2m gallery + slab). */
export const FLOOR_RISE = 4.8;
/** Two side-by-side flights; landing at the far end of the well. */
export const STEPS_PER_LEG = 10;
export const STEP_RISE = FLOOR_RISE / (STEPS_PER_LEG * 2);
export const STEP_RUN = 0.44;
export const STAIR_WIDTH = 1.62;
export const STAIR_GAP = 0.32;
export const BOTTOM_PAD = 0.7;
export const LANDING_SIZE = 2.2;
export const STAIR_FLIGHT_LENGTH = STEPS_PER_LEG * STEP_RUN;
export const STAIR_WELL_DEPTH =
  BOTTOM_PAD + STAIR_FLIGHT_LENGTH + LANDING_SIZE;
export const STAIR_HALL_DEPTH = STAIR_WELL_DEPTH;

export function floorFromY(y: number): MuseumFloor {
  const level = Math.round(y / FLOOR_RISE);
  if (level <= 0) return 0;
  if (level === 1) return 1;
  return 2;
}

/** True while the path is between storeys (on treads or the mid landing). */
export function isStairClimbY(y: number): boolean {
  const nearest = Math.round(y / FLOOR_RISE) * FLOOR_RISE;
  return Math.abs(y - nearest) > 0.14;
}

/** Keep the robot on each tread instead of sliding up the riser. */
export function snapStairY(y: number): number {
  const base = Math.floor((y + 0.02) / FLOOR_RISE) * FLOOR_RISE;
  const local = y - base;
  if (local < 0.1 || local > FLOOR_RISE - 0.1) return y;
  return base + Math.round(local / STEP_RISE) * STEP_RISE;
}

const SIDE_X = 11;
const ROOM_W = 10;
const ROOM_D = 10;

/** Story stop order - matches JOURNEY_NODES ids. */
const ROOM_IDS = [
  "welcome",
  "gps-fails",
  "vps",
  "mapping",
  "analytics",
  "industries",
  "complete",
] as const;

/** Slides 1–2 ground, 3–5 first floor, 6–7 second floor. */
export function floorForIndex(index: number): MuseumFloor {
  if (index <= 1) return 0;
  if (index <= 4) return 1;
  return 2;
}

const FLOOR_SLOTS = [6, 22, 38] as const;

function sideX(side: RoomSide): number {
  if (side === "center") return 0;
  return side === "left" ? -SIDE_X : SIDE_X;
}

/**
 * Same footprint on every storey — first floor sits above ground,
 * second above first — like a real museum building.
 * Ground ends at the north (right) gallery so the stair stacks cleanly.
 */
function buildStoryRooms(): StoryRoom[] {
  return ROOM_IDS.map((id, index) => {
    const floor = floorForIndex(index);
    let side: RoomSide;
    let z: number;
    if (floor === 0) {
      // Mirror of first-floor 3→4, walking north: left@22 → right@38.
      side = index === 0 ? "left" : "right";
      z = index === 0 ? FLOOR_SLOTS[1] : FLOOR_SLOTS[2];
    } else if (floor === 1) {
      const local = index - 2;
      side = local === 0 ? "right" : local === 1 ? "left" : "center";
      z = FLOOR_SLOTS[2 - local];
    } else {
      const local = index - 5;
      side = local === 0 ? "center" : "left";
      z = local === 0 ? FLOOR_SLOTS[0] : FLOOR_SLOTS[1];
    }
    return {
      id,
      center: [sideX(side), floor * FLOOR_RISE, z],
      size: [ROOM_W, ROOM_D],
      side,
      floor,
    };
  });
}

export const STORY_ROOMS: readonly StoryRoom[] = buildStoryRooms();

export type StairHallSpec = {
  fromFloor: MuseumFloor;
  toFloor: MuseumFloor;
  bottomY: number;
  midY: number;
  topY: number;
  /** Door X shared by the lower exit and the upper entry. */
  anchorX: number;
  /** +1 = well goes north of the building, -1 = south. */
  zDir: 1 | -1;
  doorZ: number;
  hallZ0: number;
  hallZ1: number;
  flight1X: number;
  flight2X: number;
  flightStartZ: number;
  flightEndZ: number;
  landingZ: number;
  label: string;
};

const FLOOR_LABELS = ["Ground Floor", "First Floor", "Second Floor"] as const;

function buildStairHall(
  from: StoryRoom,
  to: StoryRoom,
  zDir: 1 | -1,
): StairHallSpec {
  const doorZ =
    zDir === 1
      ? from.center[2] + from.size[1] / 2
      : from.center[2] - from.size[1] / 2;
  const flightStartZ = doorZ + zDir * BOTTOM_PAD;
  const flightEndZ = flightStartZ + zDir * STAIR_FLIGHT_LENGTH;
  const landingZ = flightEndZ + zDir * (LANDING_SIZE / 2);
  const farZ = doorZ + zDir * STAIR_WELL_DEPTH;
  const offset = STAIR_WIDTH / 2 + STAIR_GAP / 2;
  return {
    fromFloor: from.floor,
    toFloor: to.floor,
    bottomY: from.center[1],
    midY: (from.center[1] + to.center[1]) / 2,
    topY: to.center[1],
    anchorX: from.center[0],
    zDir,
    doorZ,
    hallZ0: Math.min(doorZ, farZ),
    hallZ1: Math.max(doorZ, farZ),
    flight1X: from.center[0] - offset,
    flight2X: from.center[0] + offset,
    flightStartZ,
    flightEndZ,
    landingZ,
    label: `${FLOOR_LABELS[from.floor]} → ${FLOOR_LABELS[to.floor]}`,
  };
}

export const STAIR_HALLS: readonly StairHallSpec[] = [
  buildStairHall(STORY_ROOMS[1], STORY_ROOMS[2], 1),
  buildStairHall(STORY_ROOMS[4], STORY_ROOMS[5], -1),
];

export function isStairHallVisibleOnFloor(
  hall: StairHallSpec,
  floor: MuseumFloor,
): boolean {
  return hall.fromFloor === floor || hall.toFloor === floor;
}

export const CORRIDOR_STOPS = STORY_ROOMS.map(
  (r) => r.center[2],
) as unknown as readonly number[];

export const CORRIDOR_LENGTH =
  STORY_ROOMS[STORY_ROOMS.length - 1].center[2] +
  STORY_ROOMS[STORY_ROOMS.length - 1].size[1] / 2 +
  4;

function pushUnique(
  pts: [number, number, number][],
  p: [number, number, number],
  eps = 0.08,
) {
  const last = pts[pts.length - 1];
  if (
    last &&
    Math.hypot(last[0] - p[0], last[1] - p[1], last[2] - p[2]) < eps
  ) {
    return;
  }
  pts.push(p);
}

/** Door threshold just inside the room on the -Z (entry) face. */
function entryDoor(room: StoryRoom): [number, number, number] {
  return [
    room.center[0],
    room.center[1],
    room.center[2] - room.size[1] / 2 + 0.55,
  ];
}

/** Door threshold just inside the room on the +Z (exit) face. */
function exitDoor(room: StoryRoom): [number, number, number] {
  return [
    room.center[0],
    room.center[1],
    room.center[2] + room.size[1] / 2 - 0.55,
  ];
}

/** Door threshold just inside the room on the +X (east) face. */
function eastDoor(room: StoryRoom): [number, number, number] {
  return [
    room.center[0] + room.size[0] / 2 - 0.55,
    room.center[1],
    room.center[2],
  ];
}

/** Door threshold just inside the room on the -X (west) face. */
function westDoor(room: StoryRoom): [number, number, number] {
  return [
    room.center[0] - room.size[0] / 2 + 0.55,
    room.center[1],
    room.center[2],
  ];
}

function leaveDoor(from: StoryRoom, to: StoryRoom): [number, number, number] {
  const dx = to.center[0] - from.center[0];
  const dz = to.center[2] - from.center[2];
  if (Math.abs(dz) < 1 && Math.abs(dx) > 0.2) {
    return dx > 0 ? eastDoor(from) : westDoor(from);
  }
  return dz >= 0 ? exitDoor(from) : entryDoor(from);
}

function arriveDoor(from: StoryRoom, to: StoryRoom): [number, number, number] {
  const dx = to.center[0] - from.center[0];
  const dz = to.center[2] - from.center[2];
  if (Math.abs(dz) < 1 && Math.abs(dx) > 0.2) {
    return dx > 0 ? westDoor(to) : eastDoor(to);
  }
  return dz >= 0 ? entryDoor(to) : exitDoor(to);
}

/** Door that actually opens onto this stairwell (north or south face). */
function stairDoor(room: StoryRoom, hall: StairHallSpec): [number, number, number] {
  return hall.zDir === 1 ? exitDoor(room) : entryDoor(room);
}

/**
 * Dock camera facing: +1 looks north (+Z), -1 looks south (-Z).
 * First-floor galleries walk south; ground and second floor walk north.
 */
export function roomLookSign(index: number): 1 | -1 {
  const room = STORY_ROOMS[index];
  const next = STORY_ROOMS[index + 1];
  if (!room || !next) return 1;
  if (next.floor !== room.floor) {
    const stair = STAIR_HALLS.find(
      (hall) => hall.fromFloor === room.floor && hall.toFloor === next.floor,
    );
    return stair?.zDir === -1 ? -1 : 1;
  }
  return next.center[2] >= room.center[2] ? 1 : -1;
}

function pushUStairClimb(
  pts: [number, number, number][],
  hall: StairHallSpec,
) {
  const dir = hall.zDir;
  pushUnique(pts, [hall.flight1X, hall.bottomY, hall.flightStartZ]);
  for (let step = 1; step <= STEPS_PER_LEG; step++) {
    pushUnique(pts, [
      hall.flight1X,
      hall.bottomY + step * STEP_RISE,
      hall.flightStartZ + dir * step * STEP_RUN,
    ]);
  }
  pushUnique(pts, [hall.flight1X, hall.midY, hall.landingZ]);
  pushUnique(pts, [hall.flight2X, hall.midY, hall.landingZ]);
  for (let step = 1; step <= STEPS_PER_LEG; step++) {
    pushUnique(pts, [
      hall.flight2X,
      hall.midY + step * STEP_RISE,
      hall.flightEndZ - dir * step * STEP_RUN,
    ]);
  }
}

/**
 * Orthogonal polyline: enter south door → room center → exit north door →
 * hall junction → next room. Every segment is axis-aligned so turns are clean.
 */
function buildWalkWaypoints(): [number, number, number][] {
  const pts: [number, number, number][] = [];
  pushUnique(pts, [0, 0, -3]);

  STORY_ROOMS.forEach((room, i) => {
    const [cx, cy, cz] = room.center;
    const enter = entryDoor(room);

    if (i > 0) {
      const prev = STORY_ROOMS[i - 1];
      const stair = STAIR_HALLS.find(
        (hall) =>
          hall.fromFloor === prev.floor && hall.toFloor === room.floor,
      );

      if (stair) {
        pushUnique(pts, stairDoor(prev, stair));
        pushUnique(pts, [stair.anchorX, stair.bottomY, stair.doorZ]);
        pushUnique(pts, [stair.flight1X, stair.bottomY, stair.doorZ + stair.zDir * 0.25]);
        pushUStairClimb(pts, stair);
        pushUnique(pts, [
          stair.flight2X,
          stair.topY,
          stair.doorZ + stair.zDir * 0.25,
        ]);
        pushUnique(pts, [stair.anchorX, stair.topY, stair.doorZ]);
        pushUnique(pts, stairDoor(room, stair));
      } else {
        const prevLeave = leaveDoor(prev, room);
        const nextEnter = arriveDoor(prev, room);
        pushUnique(pts, prevLeave);
        const y = cy;
        const alignedX = Math.abs(prev.center[0] - cx) < 0.2;
        const alignedZ = Math.abs(prev.center[2] - cz) < 0.2;
        if (alignedX || alignedZ) {
          pushUnique(pts, nextEnter);
        } else {
          const midZ = (prevLeave[2] + nextEnter[2]) / 2;
          pushUnique(pts, [prev.center[0], y, midZ]);
          pushUnique(pts, [cx, y, midZ]);
          pushUnique(pts, nextEnter);
        }
      }
    } else {
      pushUnique(pts, [0, 0, enter[2]]);
      pushUnique(pts, enter);
    }

    pushUnique(pts, [cx, cy, cz]);
  });

  const last = STORY_ROOMS[STORY_ROOMS.length - 1];
  pushUnique(pts, [
    last.center[0],
    last.center[1],
    last.center[2] + 0.8,
  ]);

  return pts;
}

export const WALK_WAYPOINTS: readonly [number, number, number][] =
  buildWalkWaypoints();

function polylineLength(points: readonly [number, number, number][]): number {
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    total += Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  }
  return total;
}

export const ROUTE_LENGTH_M = polylineLength(WALK_WAYPOINTS);

/** Arc-length fraction of each room-center stop along WALK_WAYPOINTS. */
export function dockTForPoint(
  point: readonly [number, number, number],
  points: readonly [number, number, number][] = WALK_WAYPOINTS,
): number {
  const total = polylineLength(points);
  if (total <= 0) return 0;

  let bestDist = Infinity;
  let bestAlong = 0;
  let along = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const abx = b[0] - a[0];
    const aby = b[1] - a[1];
    const abz = b[2] - a[2];
    const abLenSq = abx * abx + aby * aby + abz * abz;
    const abLen = Math.sqrt(abLenSq) || 1;
    const apx = point[0] - a[0];
    const apy = point[1] - a[1];
    const apz = point[2] - a[2];
    const t = Math.min(
      1,
      Math.max(0, (apx * abx + apy * aby + apz * abz) / abLenSq),
    );
    const cx = a[0] + abx * t;
    const cy = a[1] + aby * t;
    const cz = a[2] + abz * t;
    const d = Math.hypot(point[0] - cx, point[1] - cy, point[2] - cz);
    const at = along + abLen * t;
    if (d < bestDist) {
      bestDist = d;
      bestAlong = at;
    }
    along += abLen;
  }

  return bestAlong / total;
}

export const ROOM_DOCK_T: readonly number[] = STORY_ROOMS.map((room) =>
  dockTForPoint(room.center),
);

/**
 * Keep the next stairwell out of sight until the visitor is in the last
 * gallery on this floor (or already on the floor above).
 */
export function isStairHallRevealed(
  hall: StairHallSpec,
  floor: MuseumFloor,
  progress: number,
): boolean {
  if (hall.toFloor === floor) return true;
  if (hall.fromFloor !== floor) return false;
  const lastIdx = STORY_ROOMS.findLastIndex((room) => room.floor === hall.fromFloor);
  if (lastIdx < 0) return false;
  return progress >= ROOM_DOCK_T[lastIdx] - 0.05;
}

/** Opening hero: stand back from the finish-wall logo so it fits the frame. */
export const FINISH_FLOOR_Y =
  STORY_ROOMS[STORY_ROOMS.length - 1]?.center[1] ?? 0;

export const INTRO_LOGO_FRAME = (() => {
  const room = STORY_ROOMS[STORY_ROOMS.length - 1];
  const [cx, cy, cz] = room.center;
  const halfD = room.size[1] / 2;
  const halfW = room.size[0] / 2;
  const logoZ = cz + halfD - 0.22;
  const logoY = cy + 2.2;
  const viewDistance = 7.4;
  return {
    size: 2.9,
    position: [cx, logoY, logoZ] as [number, number, number],
    cameraPos: [cx, cy + 1.62, logoZ - viewDistance] as [
      number,
      number,
      number,
    ],
    lookAt: [cx, logoY, logoZ] as [number, number, number],
    roomCenterX: cx,
    wallZ: logoZ,
    halfW,
    floorY: cy,
  };
})();

/**
 * Finish framing - camera covers the end wall so its edges match the screen
 * (wall fills the viewport on the limiting axis).
 */
export const FINISH_WALL_MURAL = {
  /** Inner face of the complete-room north wall. */
  width: ROOM_W - 0.08,
  height: ROOM_WALL_H,
  get centerY() {
    return FINISH_FLOOR_Y + this.height / 2;
  },
} as const;

export const FINISH_WALL_FRAME = (() => {
  const { roomCenterX: cx, wallZ, halfW } = INTRO_LOGO_FRAME;
  const mural = FINISH_WALL_MURAL;
  const lookY = mural.centerY;
  /** Default 16:9 cover distance - refined per-frame from aspect. */
  const viewDistance = finishViewDistance(16 / 9, 50, "cover");
  return {
    cameraPos: [cx, lookY, wallZ - viewDistance] as [number, number, number],
    lookAt: [cx, lookY, wallZ] as [number, number, number],
    fov: 50,
    muralWidth: mural.width,
    muralHeight: mural.height,
    /** Robot sticks lower-left of the wall face (inset, not flush). */
    robotStick: [cx + halfW - mural.width * 0.22, 0, wallZ - 0.55] as [
      number,
      number,
      number,
    ],
    /**
     * Phone: float at mural center (above the bottom headline block).
     */
    robotStickMobile: [cx, mural.centerY - 0.35, wallZ - 0.7] as [
      number,
      number,
      number,
    ],
    /**
     * Fallback park - prefer `finishLogoParkForAspect` for responsive align.
     */
    logoPark: [
      cx + halfW - 1.2 - mural.width * 0.06,
      mural.height - 0.72,
      wallZ,
    ] as [number, number, number],
    logoParkMobile: [
      cx + halfW - 0.65 - mural.width * 0.05,
      mural.height - 0.42,
      wallZ,
    ] as [number, number, number],
  };
})();

/**
 * WallMuralHtml header - keep in sync with EndWallFooter classes.
 * Extra padTop clears the fixed JourneyHUD (nav stays up on the mural).
 * Wall logo flies into the HUD mark (no in-mural logo slot).
 */
export const MURAL_HEADER_LAYOUT = {
  desktop: {
    padX: 0.045,
    /** Clears JourneyHUD nav (~logo + pill). */
    padTop: 0.095,
    padBottom: 0.035,
    /** Extra space below header content before border (pb). */
    headerPb: 0.01,
    /**
     * Full header text block height as a fraction of mural height
     * (Navigate Smarter + Experience Better + body).
     */
    headerContent: 0.145,
    /** Legacy logo size fraction - used for robot inset / fallbacks. */
    logoW: 0.062,
    logoTitleGap: 0,
  },
  compact: {
    padX: 0.035,
    padTop: 0.085,
    padBottom: 0.025,
    headerPb: 0.008,
    headerContent: 0.1,
    logoW: 0.075,
    logoTitleGap: 0,
  },
} as const;

/** Shared compact check - keep EndWallFooter / EndWallLogos / robot in sync. */
export function isMuralCompactViewport(width: number, height: number): boolean {
  if (width <= 0 || height <= 0) return false;
  return width < 900 || height / width > 1.05;
}

/** Parked finish logo fallback (header-left). Prefer HUD merge in EndWallLogos. */
export function finishLogoParkForAspect(
  aspect: number,
  mode: "desktop" | "compact",
): {
  position: [number, number, number];
  scale: number;
  borderY: number;
  muralWidth: number;
  muralHeight: number;
  logoWorld: number;
} {
  const { roomCenterX: cx, wallZ } = INTRO_LOGO_FRAME;
  const fov = FINISH_WALL_FRAME.fov;
  const dist = finishViewDistance(aspect, fov, "cover");
  const vFov = (fov * Math.PI) / 180;
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
  const muralH = 2 * dist * Math.tan(vFov / 2);
  const muralW = 2 * dist * Math.tan(hFov / 2);
  const muralY = FINISH_WALL_MURAL.centerY;
  const layout = MURAL_HEADER_LAYOUT[mode];

  const logoWorld = muralW * layout.logoW;
  const introSize = INTRO_LOGO_FRAME.size * 1.4;
  const scale = Math.max(0.04, logoWorld / introSize);

  const topY = muralY + muralH / 2;
  const headerInner = Math.max(logoWorld, layout.headerContent * muralH);
  const contentTop = topY - layout.padTop * muralH;
  const borderY =
    contentTop - headerInner - layout.headerPb * muralH;
  const logoY = contentTop - headerInner * 0.5;

  const fromLeft = muralW * layout.padX;
  const logoX = cx + muralW / 2 - fromLeft - logoWorld / 2;

  return {
    position: [logoX, logoY, wallZ],
    scale,
    borderY,
    muralWidth: muralW,
    muralHeight: muralH,
    logoWorld,
  };
}

/**
 * Finish-wall robot stick:
 * - phone: center of the mural
 * - desktop/compact: lower-left gutter (clear of footer columns)
 */
export function finishRobotStickForAspect(
  aspect: number,
  mode: "desktop" | "compact" | "phone",
): [number, number, number] {
  const { roomCenterX: cx, wallZ } = INTRO_LOGO_FRAME;

  if (mode === "phone") {
    // Sit above the compact DOM footer dock so text stays readable.
    return [cx, FINISH_WALL_MURAL.centerY + 0.08, wallZ - 0.7];
  }

  const park = finishLogoParkForAspect(aspect, mode);
  // Screen-left is world +X. Keep robot fully visible in the left gutter.
  const fromLeft = park.muralWidth * (mode === "compact" ? 0.13 : 0.14);
  const robotX = cx + park.muralWidth / 2 - fromLeft;
  const robotY = FINISH_FLOOR_Y + (mode === "compact" ? 0.02 : 0.05);
  return [robotX, robotY, wallZ - 0.55];
}

/** Distance so the mural wall fits (contain) or fills (cover) the viewport. */
export function finishViewDistance(
  aspect: number,
  fovDeg: number,
  fill: "contain" | "cover" = "contain",
): number {
  const { width, height } = FINISH_WALL_MURAL;
  const vFov = (fovDeg * Math.PI) / 180;
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
  const distH = height / 2 / Math.tan(vFov / 2);
  const distW = width / 2 / Math.tan(hFov / 2);
  // Farther = entire wall visible (contain). Closer = wall fills the screen (cover).
  const dist =
    fill === "cover" ? Math.min(distH, distW) : Math.max(distH, distW);
  return dist * (fill === "cover" ? 0.988 : 0.992);
}

/** Camera + look for finish wall-fill at the current viewport aspect. */
export function finishWallCamera(
  aspect: number,
): {
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
} {
  const { roomCenterX: cx, wallZ } = INTRO_LOGO_FRAME;
  const fov = FINISH_WALL_FRAME.fov;
  const lookY = FINISH_WALL_MURAL.centerY;
  // Wall fills the viewport (cover) so mural edges sit on the screen.
  const dist = finishViewDistance(aspect, fov, "cover");
  return {
    cameraPos: [cx, lookY, wallZ - dist],
    lookAt: [cx, lookY, wallZ],
    fov,
  };
}

/** Connecting hall floors between rooms (for World mesh). */
export type HallSegment = {
  center: [number, number, number];
  size: [number, number];
  /** Open gallery floor. Unused; every floor is walled. */
  open?: boolean;
};

export type HallWallBox = {
  position: [number, number, number];
  size: [number, number, number];
};

type HallSpine = {
  ax: number;
  az: number;
  bx: number;
  bz: number;
  y: number;
};

type Cardinal = "n" | "s" | "e" | "w";

/** Every storey uses enclosed rooms with doorways, including slides 6–7. */
export function isOpenGalleryFloor(_floor: MuseumFloor): boolean {
  return false;
}

function nearHall(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.25;
}

function spineAlongZ(spine: HallSpine): boolean {
  return Math.abs(spine.bz - spine.az) >= Math.abs(spine.bx - spine.ax);
}

function pushSpine(
  spines: HallSpine[],
  ax: number,
  az: number,
  bx: number,
  bz: number,
  y: number,
): void {
  if (Math.hypot(bx - ax, bz - az) < 0.35) return;
  spines.push({ ax, az, bx, bz, y });
}

function spineToSegment(spine: HallSpine): HallSegment {
  const dx = spine.bx - spine.ax;
  const dz = spine.bz - spine.az;
  const alongZ = Math.abs(dz) >= Math.abs(dx);
  return {
    center: [(spine.ax + spine.bx) / 2, spine.y, (spine.az + spine.bz) / 2],
    size: alongZ
      ? [HALL_WIDTH, Math.max(HALL_WIDTH, Math.abs(dz))]
      : [Math.max(HALL_WIDTH, Math.abs(dx)), HALL_WIDTH],
  };
}

function buildHallSpines(): HallSpine[] {
  const spines: HallSpine[] = [];
  const first = STORY_ROOMS[0];
  const firstDoorZ = first.center[2] - first.size[1] / 2;
  pushSpine(spines, 0, -3, 0, firstDoorZ, 0);
  pushSpine(spines, 0, firstDoorZ, first.center[0], firstDoorZ, 0);

  for (let i = 1; i < STORY_ROOMS.length; i++) {
    const prev = STORY_ROOMS[i - 1];
    const curr = STORY_ROOMS[i];
    if (prev.floor !== curr.floor) continue;

    const y = curr.center[1];
    const dx = curr.center[0] - prev.center[0];
    const dz = curr.center[2] - prev.center[2];

    if (Math.abs(dz) < 1 && Math.abs(dx) > 0.2) {
      const fromX =
        dx > 0
          ? prev.center[0] + prev.size[0] / 2
          : prev.center[0] - prev.size[0] / 2;
      const toX =
        dx > 0
          ? curr.center[0] - curr.size[0] / 2
          : curr.center[0] + curr.size[0] / 2;
      const z = (prev.center[2] + curr.center[2]) / 2;
      pushSpine(spines, fromX, z, toX, z, y);
      continue;
    }

    const goingNorth = dz >= 0;
    const prevDoorZ = goingNorth
      ? prev.center[2] + prev.size[1] / 2
      : prev.center[2] - prev.size[1] / 2;
    const currDoorZ = goingNorth
      ? curr.center[2] - curr.size[1] / 2
      : curr.center[2] + curr.size[1] / 2;
    const midZ = (prevDoorZ + currDoorZ) / 2;
    const sameX = Math.abs(dx) < 0.4;

    if (sameX) {
      pushSpine(
        spines,
        prev.center[0],
        prevDoorZ,
        curr.center[0],
        currDoorZ,
        y,
      );
      continue;
    }

    pushSpine(spines, prev.center[0], prevDoorZ, prev.center[0], midZ, y);
    pushSpine(spines, prev.center[0], midZ, curr.center[0], midZ, y);
    pushSpine(spines, curr.center[0], midZ, curr.center[0], currDoorZ, y);
  }

  return spines;
}

export function buildHallSegments(): HallSegment[] {
  return buildHallSpines().map(spineToSegment);
}

function isInsideStoryRoom(x: number, z: number, y: number): boolean {
  return STORY_ROOMS.some((room) => {
    if (Math.abs(room.center[1] - y) > 0.25) return false;
    const [rw, rd] = room.size;
    return (
      Math.abs(x - room.center[0]) < rw / 2 - 0.08 &&
      Math.abs(z - room.center[2]) < rd / 2 - 0.08
    );
  });
}

function endJoinsPerpendicular(
  spine: HallSpine,
  x: number,
  z: number,
  spines: HallSpine[],
): boolean {
  const alongZ = spineAlongZ(spine);
  return spines.some((other) => {
    if (other === spine || Math.abs(other.y - spine.y) > 0.2) return false;
    if (spineAlongZ(other) === alongZ) return false;
    return (
      (nearHall(other.ax, x) && nearHall(other.az, z)) ||
      (nearHall(other.bx, x) && nearHall(other.bz, z))
    );
  });
}

function markOccupiedFromSpine(
  spine: HallSpine,
  jx: number,
  jz: number,
  occupied: Record<Cardinal, boolean>,
): void {
  const atA = nearHall(spine.ax, jx) && nearHall(spine.az, jz);
  const ox = atA ? spine.bx : spine.ax;
  const oz = atA ? spine.bz : spine.az;
  const dx = ox - jx;
  const dz = oz - jz;
  if (Math.abs(dz) >= Math.abs(dx)) {
    if (dz >= 0) occupied.n = true;
    else occupied.s = true;
    return;
  }
  if (dx >= 0) occupied.e = true;
  else occupied.w = true;
}

function elbowOccupied(
  a: HallSpine,
  b: HallSpine,
): { x: number; z: number; y: number; occupied: Record<Cardinal, boolean> } | null {
  if (Math.abs(a.y - b.y) > 0.2) return null;
  if (spineAlongZ(a) === spineAlongZ(b)) return null;
  const aEnds: Array<[number, number]> = [
    [a.ax, a.az],
    [a.bx, a.bz],
  ];
  const bEnds: Array<[number, number]> = [
    [b.ax, b.az],
    [b.bx, b.bz],
  ];
  for (const [ax, az] of aEnds) {
    for (const [bx, bz] of bEnds) {
      if (!nearHall(ax, bx) || !nearHall(az, bz)) continue;
      const occupied: Record<Cardinal, boolean> = {
        n: false,
        s: false,
        e: false,
        w: false,
      };
      markOccupiedFromSpine(a, ax, az, occupied);
      markOccupiedFromSpine(b, ax, az, occupied);
      return { x: ax, z: az, y: a.y, occupied };
    }
  }
  return null;
}

/**
 * Side walls sit just outside the floor so inner faces are flush with the
 * corridor edge. Open L-ends are trimmed so a crossing hall is not blocked;
 * the outer two sides of each landing close the corner.
 */
export function buildHallWalls(wallT = HALL_WALL_T): HallWallBox[] {
  const spines = buildHallSpines();
  const walls: HallWallBox[] = [];
  const seen = new Set<string>();
  const half = HALL_WIDTH / 2;
  const wallH = ROOM_WALL_H;

  const pushWall = (position: [number, number, number], size: [number, number, number]) => {
    const floorY = position[1] - wallH / 2;
    if (isInsideStoryRoom(position[0], position[2], floorY)) return;
    const key = [...position, ...size].map((n) => n.toFixed(3)).join(",");
    if (seen.has(key)) return;
    seen.add(key);
    walls.push({ position, size });
  };

  const addNsWalls = (spine: HallSpine) => {
    const trimA = endJoinsPerpendicular(spine, spine.ax, spine.az, spines);
    const trimB = endJoinsPerpendicular(spine, spine.bx, spine.bz, spines);
    let z0 = Math.min(spine.az, spine.bz);
    let z1 = Math.max(spine.az, spine.bz);
    const minIsA = spine.az <= spine.bz;
    const trimMin = minIsA ? trimA : trimB;
    const trimMax = minIsA ? trimB : trimA;
    if (trimMin) z0 += half;
    else z0 -= wallT;
    if (trimMax) z1 -= half;
    else z1 += wallT;
    if (z1 - z0 < 0.2) return;
    const cz = (z0 + z1) / 2;
    const len = z1 - z0;
    const y = spine.y + wallH / 2;
    pushWall([spine.ax - half - wallT / 2, y, cz], [wallT, wallH, len]);
    pushWall([spine.ax + half + wallT / 2, y, cz], [wallT, wallH, len]);
  };

  const addEwWalls = (spine: HallSpine) => {
    const trimA = endJoinsPerpendicular(spine, spine.ax, spine.az, spines);
    const trimB = endJoinsPerpendicular(spine, spine.bx, spine.bz, spines);
    let x0 = Math.min(spine.ax, spine.bx);
    let x1 = Math.max(spine.ax, spine.bx);
    const minIsA = spine.ax <= spine.bx;
    const trimMin = minIsA ? trimA : trimB;
    const trimMax = minIsA ? trimB : trimA;
    if (trimMin) x0 += half;
    else x0 -= wallT;
    if (trimMax) x1 -= half;
    else x1 += wallT;
    if (x1 - x0 < 0.2) return;
    const cx = (x0 + x1) / 2;
    const len = x1 - x0;
    const y = spine.y + wallH / 2;
    pushWall([cx, y, spine.az - half - wallT / 2], [len, wallH, wallT]);
    pushWall([cx, y, spine.az + half + wallT / 2], [len, wallH, wallT]);
  };

  for (const spine of spines) {
    if (spineAlongZ(spine)) addNsWalls(spine);
    else addEwWalls(spine);
  }

  const joints = new Set<string>();
  for (let i = 0; i < spines.length; i++) {
    for (let j = i + 1; j < spines.length; j++) {
      const elbow = elbowOccupied(spines[i], spines[j]);
      if (!elbow) continue;
      const id = `${elbow.y.toFixed(2)}:${elbow.x.toFixed(2)}:${elbow.z.toFixed(2)}`;
      if (joints.has(id)) continue;
      joints.add(id);
      const y = elbow.y + wallH / 2;
      const span = HALL_WIDTH + wallT;
      if (!elbow.occupied.n) {
        pushWall([elbow.x, y, elbow.z + half + wallT / 2], [span, wallH, wallT]);
      }
      if (!elbow.occupied.s) {
        pushWall([elbow.x, y, elbow.z - half - wallT / 2], [span, wallH, wallT]);
      }
      if (!elbow.occupied.e) {
        pushWall([elbow.x + half + wallT / 2, y, elbow.z], [wallT, wallH, span]);
      }
      if (!elbow.occupied.w) {
        pushWall([elbow.x - half - wallT / 2, y, elbow.z], [wallT, wallH, span]);
      }
    }
  }

  return walls;
}

export type RoomOpenings = {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
};

/** Full-width openings between the two galleries on a 2-stop floor. */
export function roomOpenings(room: StoryRoom): RoomOpenings {
  const open: RoomOpenings = {
    north: false,
    south: false,
    east: false,
    west: false,
  };
  if (!isOpenGalleryFloor(room.floor)) return open;

  const idx = STORY_ROOMS.findIndex((item) => item.id === room.id);
  const neighbors = [STORY_ROOMS[idx - 1], STORY_ROOMS[idx + 1]].filter(
    (other): other is StoryRoom =>
      other !== undefined && other.floor === room.floor,
  );

  for (const other of neighbors) {
    const dx = other.center[0] - room.center[0];
    const dz = other.center[2] - room.center[2];
    if (Math.abs(dz) >= Math.abs(dx)) {
      if (dz > 0) open.north = true;
      else open.south = true;
    } else if (dx > 0) {
      open.east = true;
    } else {
      open.west = true;
    }
  }

  return open;
}
