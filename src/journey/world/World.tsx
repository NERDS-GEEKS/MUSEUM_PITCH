import { MUSEUM } from "@/journey/theme/museumPalette";
import {
  getGalleryTheme,
  type GalleryTheme,
} from "@/journey/world/galleryThemes";
import {
  useRevealedStairHalls,
  useVisibleMuseumFloor,
} from "@/journey/hooks/useVisibleMuseumFloor";
import {
  DOOR_WIDTH,
  FLOOR_RISE,
  HALL_WALL_T,
  HALL_WIDTH,
  ROOM_WALL_H,
  STORY_ROOMS,
  buildHallSegments,
  buildHallWalls,
  floorFromY,
  roomOpenings,
  type StoryRoom,
} from "@/journey/path/walkPath";
import { StairHall } from "@/journey/world/StairHall";
import { Suspense } from "react";

const PRIMARY = MUSEUM.primary;
const HIGHLIGHT = MUSEUM.highlight;
const WALL = MUSEUM.wall;
const TRIM = MUSEUM.trim;
const FLOOR = MUSEUM.floor;
const CEILING = MUSEUM.ceiling;
const FOG = MUSEUM.fog;

const WALL_H = ROOM_WALL_H;
const WALL_T = HALL_WALL_T;

function WallBox({
  position,
  size,
  wall = WALL,
  emissive = MUSEUM.wallEmissive,
}: {
  position: [number, number, number];
  size: [number, number, number];
  wall?: string;
  emissive?: string;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshLambertMaterial
        color={wall}
        emissive={emissive}
        emissiveIntensity={0.12}
        polygonOffset
        polygonOffsetFactor={1}
        polygonOffsetUnits={1}
      />
    </mesh>
  );
}

/** Wall with a centered doorway gap along its long axis (local X). */
function DoorWall({
  position,
  rotationY,
  length,
  door = DOOR_WIDTH,
  theme,
}: {
  position: [number, number, number];
  rotationY: number;
  length: number;
  door?: number;
  theme: GalleryTheme;
}) {
  const side = Math.max(0.4, (length - door) / 2);
  const mid = length / 2;
  const leftCenter = -mid + side / 2;
  const rightCenter = mid - side / 2;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <WallBox
        position={[leftCenter, WALL_H / 2, 0]}
        size={[side, WALL_H, WALL_T]}
        wall={theme.wall}
        emissive={theme.wallEmissive}
      />
      <WallBox
        position={[rightCenter, WALL_H / 2, 0]}
        size={[side, WALL_H, WALL_T]}
        wall={theme.wall}
        emissive={theme.wallEmissive}
      />
      <mesh position={[0, WALL_H - 0.18, 0]}>
        <boxGeometry args={[door + 0.2, 0.22, WALL_T + 0.04]} />
        <meshStandardMaterial
          color={theme.trim}
          emissive={theme.accent}
          emissiveIntensity={0.32}
          roughness={0.45}
          metalness={0.35}
        />
      </mesh>
      <mesh position={[-door / 2, 1.45, 0]}>
        <boxGeometry args={[0.12, 2.9, WALL_T + 0.06]} />
        <meshStandardMaterial color={theme.trim} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[door / 2, 1.45, 0]}>
        <boxGeometry args={[0.12, 2.9, WALL_T + 0.06]} />
        <meshStandardMaterial color={theme.trim} roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
}

function SolidWall({
  position,
  rotationY,
  length,
  theme,
}: {
  position: [number, number, number];
  rotationY: number;
  length: number;
  theme: GalleryTheme;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <WallBox
        position={[0, WALL_H / 2, 0]}
        size={[length, WALL_H, WALL_T]}
        wall={theme.wall}
        emissive={theme.wallEmissive}
      />
      <mesh position={[0, WALL_H * 0.78, 0.02]}>
        <boxGeometry args={[length * 0.92, 0.1, 0.08]} />
        <meshStandardMaterial
          color={theme.light}
          emissive={theme.light}
          emissiveIntensity={0.85}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}

function OpenSpan({
  position,
  rotationY,
  length,
  theme,
}: {
  position: [number, number, number];
  rotationY: number;
  length: number;
  theme: GalleryTheme;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, WALL_H - 0.12, 0]}>
        <boxGeometry args={[length * 0.96, 0.18, WALL_T + 0.04]} />
        <meshStandardMaterial
          color={theme.trim}
          emissive={theme.accent}
          emissiveIntensity={0.28}
          roughness={0.45}
          metalness={0.35}
        />
      </mesh>
    </group>
  );
}

function RoomShell({
  room,
  solidExit = false,
}: {
  room: StoryRoom;
  /** Final room: solid north wall so the opening logo has a clean backdrop. */
  solidExit?: boolean;
}) {
  const theme = getGalleryTheme(room.id);
  const openings = roomOpenings(room);
  const [cx, cy, cz] = room.center;
  const [w, d] = room.size;
  const halfW = w / 2;
  const halfD = d / 2;

  return (
    <group position={[0, cy, 0]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[cx, 0.01, cz]}
        receiveShadow
      >
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={theme.floor} roughness={0.92} metalness={0.02} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[cx, 0.018, cz]}
        receiveShadow
      >
        <planeGeometry args={[Math.min(1.1, w * 0.22), d * 0.72]} />
        <meshStandardMaterial
          color={theme.runner}
          roughness={0.85}
          metalness={0.04}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.025, cz]}>
        <circleGeometry args={[0.16, 24]} />
        <meshStandardMaterial
          color={HIGHLIGHT}
          emissive={HIGHLIGHT}
          emissiveIntensity={0.7}
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[cx, WALL_H, cz]}>
        <boxGeometry args={[w + 0.2, 0.14, d + 0.2]} />
        <meshStandardMaterial
          color={theme.ceiling}
          roughness={0.8}
          emissive={theme.wallEmissive}
          emissiveIntensity={0.22}
        />
      </mesh>
      <mesh position={[cx, WALL_H - 0.08, cz]}>
        <boxGeometry args={[2.6, 0.06, 1.2]} />
        <meshBasicMaterial color={theme.light} toneMapped={false} />
      </mesh>
      {solidExit ? (
        <SolidWall
          position={[cx, 0, cz + halfD]}
          rotationY={0}
          length={w}
          theme={theme}
        />
      ) : openings.north ? (
        <OpenSpan
          position={[cx, 0, cz + halfD]}
          rotationY={0}
          length={w}
          theme={theme}
        />
      ) : (
        <DoorWall
          position={[cx, 0, cz + halfD]}
          rotationY={0}
          length={w}
          theme={theme}
        />
      )}
      {openings.south ? (
        <OpenSpan
          position={[cx, 0, cz - halfD]}
          rotationY={0}
          length={w}
          theme={theme}
        />
      ) : (
        <DoorWall
          position={[cx, 0, cz - halfD]}
          rotationY={0}
          length={w}
          theme={theme}
        />
      )}
      {openings.west ? (
        <OpenSpan
          position={[cx - halfW, 0, cz]}
          rotationY={Math.PI / 2}
          length={d}
          theme={theme}
        />
      ) : (
        <SolidWall
          position={[cx - halfW, 0, cz]}
          rotationY={Math.PI / 2}
          length={d}
          theme={theme}
        />
      )}
      {openings.east ? (
        <OpenSpan
          position={[cx + halfW, 0, cz]}
          rotationY={Math.PI / 2}
          length={d}
          theme={theme}
        />
      ) : (
        <SolidWall
          position={[cx + halfW, 0, cz]}
          rotationY={Math.PI / 2}
          length={d}
          theme={theme}
        />
      )}
    </group>
  );
}

function HallShell({
  center,
  size,
}: {
  center: [number, number, number];
  size: [number, number];
}) {
  const [cx, cy, cz] = center;
  const [w, d] = size;
  if (w < 0.5 || d < 0.5) return null;
  const alongZ = d >= w;

  return (
    <group position={[0, cy, 0]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[cx, 0.008, cz]}
        receiveShadow
      >
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={FLOOR} roughness={0.92} metalness={0.02} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[cx, 0.018, cz]}
        receiveShadow
      >
        <planeGeometry
          args={
            alongZ
              ? [Math.min(0.38, w * 0.35), d * 0.92]
              : [w * 0.92, Math.min(0.38, d * 0.35)]
          }
        />
        <meshStandardMaterial
          color={MUSEUM.runner}
          roughness={0.85}
          metalness={0.04}
        />
      </mesh>
      <mesh position={[cx, WALL_H, cz]}>
        <boxGeometry args={[w, 0.12, d]} />
        <meshStandardMaterial
          color={CEILING}
          roughness={0.8}
          emissive={MUSEUM.ceilingEmissive}
          emissiveIntensity={0.18}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
    </group>
  );
}

/** Indoor rooms linked by short halls - room-to-room indoor navigation. */
export function World() {
  const visibleFloor = useVisibleMuseumFloor();
  const stairs = useRevealedStairHalls();
  const halls = buildHallSegments().filter(
    (h) => floorFromY(h.center[1]) === visibleFloor,
  );
  const hallWalls = buildHallWalls().filter(
    (wall) => floorFromY(wall.position[1] - WALL_H / 2) === visibleFloor,
  );
  const rooms = STORY_ROOMS.filter((room) => room.floor === visibleFloor);
  const midZ =
    rooms[Math.floor(rooms.length / 2)]?.center[2] ??
    STORY_ROOMS[Math.floor(STORY_ROOMS.length / 2)]?.center[2] ??
    80;

  return (
    <>
      <fog attach="fog" args={[FOG, 18, 56]} />
      <color attach="background" args={[FOG]} />

      <ambientLight intensity={0.92} />
      <hemisphereLight args={[MUSEUM.light, "#3a342e", 0.72]} />
      <directionalLight
        position={[6, 22 + FLOOR_RISE * 2, midZ]}
        intensity={0.68}
        color={MUSEUM.light}
      />
      <directionalLight
        position={[-8, 10 + FLOOR_RISE, midZ + 20]}
        intensity={0.28}
        color="#d4c4a4"
      />

      {halls.map((h, i) => (
        <HallShell
          key={`hall-${i}`}
          center={h.center}
          size={h.size}
        />
      ))}
      {hallWalls.map((wall, i) => (
        <WallBox
          key={`hall-wall-${i}`}
          position={wall.position}
          size={wall.size}
        />
      ))}

      <Suspense fallback={null}>
        {stairs.map((hall) => (
          <StairHall
            key={`stairs-${hall.fromFloor}-${hall.toFloor}`}
            hall={hall}
          />
        ))}
      </Suspense>

      {rooms.map((room) => (
        <RoomShell
          key={room.id}
          room={room}
          solidExit={room.id === "complete"}
        />
      ))}

      {visibleFloor === 0 ? (
        <>
          <mesh position={[-DOOR_WIDTH / 2 - 0.15, 1.5, -2.4]}>
            <boxGeometry args={[0.18, 3, 0.18]} />
            <meshStandardMaterial color={TRIM} roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[DOOR_WIDTH / 2 + 0.15, 1.5, -2.4]}>
            <boxGeometry args={[0.18, 3, 0.18]} />
            <meshStandardMaterial color={TRIM} roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[0, 3.05, -2.4]}>
            <boxGeometry args={[DOOR_WIDTH + 0.6, 0.18, 0.18]} />
            <meshStandardMaterial
              color={TRIM}
              emissive={PRIMARY}
              emissiveIntensity={0.35}
            />
          </mesh>
          <WallBox
            position={[-HALL_WIDTH / 2 - 1.2, WALL_H / 2, -2.4]}
            size={[2.4, WALL_H, WALL_T]}
          />
          <WallBox
            position={[HALL_WIDTH / 2 + 1.2, WALL_H / 2, -2.4]}
            size={[2.4, WALL_H, WALL_T]}
          />
        </>
      ) : null}
    </>
  );
}
