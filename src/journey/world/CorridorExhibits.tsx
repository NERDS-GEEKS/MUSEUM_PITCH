import { DESTINATION_CARDS } from "@/journey/overlays/cards";
import { WelcomeVideoPreview } from "@/journey/overlays/cards/WelcomeVideoPreview";
import { setExperienceVideoOpen } from "@/journey/overlays/experienceVideoStore";
import {
  roomLookSign,
  STORY_ROOMS,
  type StoryRoom,
} from "@/journey/path/walkPath";
import {
  getGalleryTheme,
  type GalleryTheme,
} from "@/journey/world/galleryThemes";
import { useViewportSettled } from "@/hooks/useViewportSettled";
import {
  useActiveNodeId,
  useArrivedAtDock,
} from "@/journey/scroll/useJourneyProgress";
import { Html } from "@react-three/drei";
import { type ReactNode } from "react";

const BOARD_CSS_W = 640;
const BOARD_W = 6.4;
const BOARD_H = 3.55;

function wallDistanceFactor(worldWidth: number, cssW = BOARD_CSS_W): number {
  return (400 * worldWidth) / cssW;
}

function WallHtmlBoard({
  position,
  rotationY,
  theme,
  htmlLive,
  onBoardClick,
  children,
}: {
  position: [number, number, number];
  rotationY: number;
  theme: GalleryTheme;
  htmlLive: boolean;
  onBoardClick?: () => void;
  children: ReactNode;
}) {
  const cssW = BOARD_CSS_W;
  const cssH = Math.max(1, Math.round(cssW * (BOARD_H / BOARD_W)));
  const distanceFactor = wallDistanceFactor(BOARD_W, cssW);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[BOARD_W + 0.22, BOARD_H + 0.22, 0.12]} />
        <meshStandardMaterial
          color={theme.frame}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>
      <mesh
        position={[0, 0, -0.01]}
        onClick={
          onBoardClick
            ? (event) => {
                event.stopPropagation();
                onBoardClick();
              }
            : undefined
        }
      >
        <planeGeometry args={[BOARD_W, BOARD_H]} />
        <meshStandardMaterial color="#1c1916" roughness={0.8} />
      </mesh>
      <mesh position={[0, BOARD_H / 2 + 0.1, 0.04]}>
        <boxGeometry args={[BOARD_W * 0.42, 0.045, 0.05]} />
        <meshStandardMaterial
          color={theme.light}
          emissive={theme.light}
          emissiveIntensity={0.75}
          roughness={0.35}
        />
      </mesh>
      <Html
        transform
        occlude={false}
        center
        distanceFactor={distanceFactor}
        position={[0, 0, 0.03]}
        style={{
          pointerEvents: htmlLive ? "auto" : "none",
          opacity: htmlLive ? 1 : 0,
          visibility: htmlLive ? "visible" : "hidden",
        }}
        zIndexRange={[20, 0]}
      >
        <div
          style={{
            width: cssW,
            height: cssH,
            overflow: "hidden",
            pointerEvents: htmlLive ? "auto" : "none",
            scrollbarWidth: "none",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </div>
      </Html>
    </group>
  );
}

function RoomStoryboards({
  room,
  htmlLive,
}: {
  room: StoryRoom;
  htmlLive: boolean;
}) {
  const theme = getGalleryTheme(room.id);
  const Card = DESTINATION_CARDS[room.id];
  const [cx, cy, cz] = room.center;
  const halfW = room.size[0] / 2;
  const index = STORY_ROOMS.findIndex((item) => item.id === room.id);
  const look = roomLookSign(index);
  // Screen-right wall when looking down the gallery (matches the dock camera).
  const rightSign = -look;
  const boardX = cx + rightSign * (halfW - 0.2);
  const boardRotY = rightSign < 0 ? Math.PI / 2 : -Math.PI / 2;
  const leftSign = look;
  const videoX = cx + leftSign * (halfW - 0.2);
  const videoRotY = leftSign < 0 ? Math.PI / 2 : -Math.PI / 2;

  if (!Card) return null;

  return (
    <>
      <WallHtmlBoard
        position={[boardX, cy + 2.12, cz]}
        rotationY={boardRotY}
        theme={theme}
        htmlLive={htmlLive}
      >
        <Card />
      </WallHtmlBoard>
      {room.id === "welcome" ? (
        <WallHtmlBoard
          position={[videoX, cy + 2.12, cz]}
          rotationY={videoRotY}
          theme={theme}
          htmlLive={htmlLive}
          onBoardClick={() => setExperienceVideoOpen(true)}
        >
          <WelcomeVideoPreview />
        </WallHtmlBoard>
      ) : null}
    </>
  );
}

/** Page content for the stop you are in — neighboring rooms stay empty. */
export function CorridorExhibits() {
  const activeId = useActiveNodeId();
  const arrived = useArrivedAtDock();
  const htmlLive = useViewportSettled(220);
  const room = STORY_ROOMS.find((item) => item.id === activeId);

  if (!arrived || !room || room.id === "complete") return null;

  return <RoomStoryboards room={room} htmlLive={htmlLive} />;
}
