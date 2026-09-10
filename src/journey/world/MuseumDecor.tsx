import galleryPlaqueFontUrl from "@/assets/fonts/Outfit-Black.ttf?url";
import industryMuseumsImg from "@/assets/billboard/billboard-industry-museums.png";
import arImg from "@/assets/billboard/billboard-ar.png";
import mappingImg from "@/assets/billboard/billboard-mapping.png";
import vpsImg from "@/assets/billboard/billboard-vps.png";
import analyticsImg from "@/assets/billboard/billboard-analytics.png";
import gpsFailsImg from "@/assets/billboard/billboard-gps-fails.png";
import { useVisibleMuseumFloor } from "@/journey/hooks/useVisibleMuseumFloor";
import { roomLookSign, roomOpenings, STORY_ROOMS } from "@/journey/path/walkPath";
import { MUSEUM } from "@/journey/theme/museumPalette";
import {
  getGalleryTheme,
  type GalleryKind,
  type GalleryTheme,
} from "@/journey/world/galleryThemes";
import { Text, useTexture } from "@react-three/drei";
import { SRGBColorSpace } from "three";

const PAINTING_SRCS = [
  gpsFailsImg,
  vpsImg,
  mappingImg,
  arImg,
  analyticsImg,
  industryMuseumsImg,
] as const;

function Pedestal({
  position,
  color,
  height = 0.72,
}: {
  position: [number, number, number];
  color: string;
  height?: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[0.58, 0.32, 0.58]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.08} />
      </mesh>
      <mesh position={[0, height * 0.55, 0]}>
        <boxGeometry args={[0.44, height * 0.45, 0.44]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
    </group>
  );
}

function HistoryExhibit({
  position,
  theme,
}: {
  position: [number, number, number];
  theme: GalleryTheme;
}) {
  return (
    <group position={position}>
      <Pedestal position={[0, 0, 0]} color={theme.trim} />
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.13, 0.18, 0.5, 12]} />
        <meshStandardMaterial color={MUSEUM.marble} roughness={0.32} />
      </mesh>
      <mesh position={[0, 1.32, 0]}>
        <sphereGeometry args={[0.16, 14, 14]} />
        <meshStandardMaterial color={MUSEUM.marble} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.2, -0.55]}>
        <cylinderGeometry args={[0.12, 0.14, 1.1, 10]} />
        <meshStandardMaterial color="#D8C8B0" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.78, -0.55]}>
        <cylinderGeometry args={[0.2, 0.16, 0.12, 12]} />
        <meshStandardMaterial color="#D8C8B0" roughness={0.5} />
      </mesh>
    </group>
  );
}

function ScienceExhibit({
  position,
  theme,
}: {
  position: [number, number, number];
  theme: GalleryTheme;
}) {
  return (
    <group position={position}>
      <Pedestal position={[0, 0, 0]} color="#2A3A40" />
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color={theme.accent}
          emissive={theme.accent}
          emissiveIntensity={0.45}
        />
      </mesh>
      <mesh position={[0.28, 1.05, 0.08]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#8EE4DC" emissive="#3DB8B0" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.24, 1.22, -0.1]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color="#B8F0EA" />
      </mesh>
      <mesh position={[0.14, 1.1, 0.04]} rotation={[0.4, 0.2, 0.6]}>
        <cylinderGeometry args={[0.015, 0.015, 0.42, 6]} />
        <meshStandardMaterial color="#C8F0EA" metalness={0.4} />
      </mesh>
      <mesh position={[-0.4, 0.95, 0.15]} rotation={[0.15, 0, 0.2]}>
        <coneGeometry args={[0.09, 0.28, 8]} />
        <meshStandardMaterial
          color="#8EC8C4"
          transparent
          opacity={0.45}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

function SpaceExhibit({
  position,
  theme,
}: {
  position: [number, number, number];
  theme: GalleryTheme;
}) {
  return (
    <group position={position}>
      <Pedestal position={[0, 0, 0]} color="#1A2038" />
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.22, 18, 18]} />
        <meshStandardMaterial
          color="#6A82C8"
          emissive={theme.accent}
          emissiveIntensity={0.25}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, 1.2, 0]} rotation={[0.7, 0.2, 0]}>
        <torusGeometry args={[0.32, 0.025, 8, 32]} />
        <meshStandardMaterial
          color="#C8D4FF"
          emissive={theme.accent}
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh position={[0.45, 1.05, 0.1]} rotation={[0, 0, -0.7]}>
        <cylinderGeometry args={[0.04, 0.055, 0.7, 8]} />
        <meshStandardMaterial color="#8A9AB8" metalness={0.55} roughness={0.3} />
      </mesh>
    </group>
  );
}

function TechnologyExhibit({
  position,
  theme,
}: {
  position: [number, number, number];
  theme: GalleryTheme;
}) {
  return (
    <group position={position}>
      <Pedestal position={[0, 0, 0]} color="#3A3028" />
      <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.08, 16]} />
        <meshStandardMaterial
          color={theme.accent}
          metalness={0.65}
          roughness={0.25}
          emissive={theme.accent}
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0.4]}>
        <cylinderGeometry args={[0.32, 0.32, 0.05, 8]} />
        <meshStandardMaterial color="#C47838" metalness={0.55} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[0.28, 0.22, 0.22]} />
        <meshStandardMaterial color="#5A4A3A" metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
}

function ArtExhibit({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.85, 0]} rotation={[0.12, 0.2, 0]}>
        <boxGeometry args={[0.08, 1.55, 0.08]} />
        <meshStandardMaterial color="#2A2A28" />
      </mesh>
      <mesh position={[0, 0.12, 0.18]} rotation={[0.9, 0, 0]}>
        <boxGeometry args={[0.55, 0.06, 0.18]} />
        <meshStandardMaterial color="#2A2A28" />
      </mesh>
      <mesh position={[0.02, 1.35, 0.08]} rotation={[0, 0.15, 0.08]}>
        <boxGeometry args={[0.55, 0.7, 0.04]} />
        <meshStandardMaterial color="#1A1A18" />
      </mesh>
      <mesh position={[0.02, 1.35, 0.11]} rotation={[0, 0.15, 0.08]}>
        <planeGeometry args={[0.46, 0.58]} />
        <meshStandardMaterial color="#C45C6A" roughness={0.7} />
      </mesh>
    </group>
  );
}

function LobbyExhibit({
  position,
  theme,
}: {
  position: [number, number, number];
  theme: GalleryTheme;
}) {
  return (
    <group position={position}>
      <Pedestal position={[0, 0, 0]} color={theme.trim} />
      <mesh position={[0, 1.05, 0]}>
        <torusGeometry args={[0.12, 0.035, 8, 16]} />
        <meshStandardMaterial
          color={theme.accent}
          emissive={theme.accent}
          emissiveIntensity={0.25}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}

function GalleryExhibit({
  kind,
  position,
  theme,
}: {
  kind: GalleryKind;
  position: [number, number, number];
  theme: GalleryTheme;
}) {
  switch (kind) {
    case "history":
      return <HistoryExhibit position={position} theme={theme} />;
    case "science":
      return <ScienceExhibit position={position} theme={theme} />;
    case "space":
      return <SpaceExhibit position={position} theme={theme} />;
    case "technology":
      return <TechnologyExhibit position={position} theme={theme} />;
    case "art":
      return <ArtExhibit position={position} />;
    case "lobby":
      return <LobbyExhibit position={position} theme={theme} />;
    case "future":
      return <LobbyExhibit position={position} theme={theme} />;
    default: {
      const _never: never = kind;
      return _never;
    }
  }
}

function FramedPainting({
  position,
  rotationY,
  src,
  width = 1.35,
  height = 1.7,
  frame,
  light,
}: {
  position: [number, number, number];
  rotationY: number;
  src: string;
  width?: number;
  height?: number;
  frame: string;
  light: string;
}) {
  const texture = useTexture(src);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[width + 0.16, height + 0.16, 0.08]} />
        <meshStandardMaterial color={frame} roughness={0.45} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[width + 0.04, height + 0.04, 0.03]} />
        <meshStandardMaterial color="#2A2118" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.04]} renderOrder={2}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh position={[0, height / 2 + 0.12, 0.08]}>
        <boxGeometry args={[width * 0.55, 0.04, 0.06]} />
        <meshStandardMaterial
          color={light}
          emissive={light}
          emissiveIntensity={0.7}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

function ColorCanvas({
  position,
  rotationY,
  color,
  frame,
  width,
  height,
}: {
  position: [number, number, number];
  rotationY: number;
  color: string;
  frame: string;
  width: number;
  height: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[width + 0.12, height + 0.12, 0.07]} />
        <meshStandardMaterial color={frame} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={color} roughness={0.65} />
      </mesh>
    </group>
  );
}

function GalleryPlaque({
  position,
  rotationY,
  theme,
}: {
  position: [number, number, number];
  rotationY: number;
  theme: GalleryTheme;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh>
        <boxGeometry args={[2.55, 0.44, 0.08]} />
        <meshStandardMaterial
          color={theme.trim}
          metalness={0.4}
          roughness={0.4}
          emissive={theme.accent}
          emissiveIntensity={0.35}
        />
      </mesh>
      <Text
        font={galleryPlaqueFontUrl}
        position={[0, 0, 0.05]}
        fontSize={0.17}
        color="#FFF8F0"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.03}
        outlineWidth={0.012}
        outlineColor="#1A1410"
        maxWidth={2.4}
      >
        {theme.label.toUpperCase()}
      </Text>
    </group>
  );
}

function SpaceStars({
  origin,
}: {
  origin: [number, number, number];
}) {
  const [ox, oy, oz] = origin;
  const dots = [
    [ox - 1.8, oy + 3.4, oz - 1.2],
    [ox + 1.4, oy + 3.55, oz + 0.4],
    [ox - 0.6, oy + 3.7, oz + 1.6],
    [ox + 2.1, oy + 3.35, oz - 1.8],
    [ox - 2.2, oy + 3.6, oz + 0.8],
  ] as const;
  return (
    <group>
      {dots.map((p) => (
        <mesh key={`${p[0]}-${p[2]}`} position={[p[0], p[1], p[2]]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#D8E4FF" />
        </mesh>
      ))}
    </group>
  );
}

function WallArt({
  kind,
  leftPos,
  rightPos,
  rotationY,
  srcA,
  srcB,
  theme,
}: {
  kind: GalleryKind;
  leftPos: [number, number, number];
  rightPos: [number, number, number];
  rotationY: number;
  srcA: string;
  srcB: string;
  theme: GalleryTheme;
}) {
  switch (kind) {
    case "art":
      return (
        <>
          <ColorCanvas
            position={leftPos}
            rotationY={rotationY}
            color="#E04A62"
            frame={theme.frame}
            width={1.25}
            height={1.7}
          />
          <ColorCanvas
            position={rightPos}
            rotationY={rotationY}
            color="#3A6A8A"
            frame={theme.frame}
            width={1.25}
            height={1.7}
          />
        </>
      );
    case "space":
    case "history":
    case "science":
    case "technology":
    case "lobby":
    case "future":
      return (
        <>
          <FramedPainting
            position={leftPos}
            rotationY={rotationY}
            src={srcA}
            width={1.35}
            height={1.75}
            frame={theme.frame}
            light={theme.light}
          />
          <FramedPainting
            position={rightPos}
            rotationY={rotationY}
            src={srcB}
            width={1.35}
            height={1.75}
            frame={theme.frame}
            light={theme.light}
          />
        </>
      );
    default: {
      const _never: never = kind;
      return _never;
    }
  }
}

/**
 * Distinct gallery rooms: history, science, space, literature, and more.
 * Props sit on the walk path and on the far wall so they read from the dock camera.
 */
export function MuseumDecor() {
  const visibleFloor = useVisibleMuseumFloor();
  return (
    <group>
      {STORY_ROOMS.map((room, index) => {
        if (room.id === "complete") return null;
        if (room.floor !== visibleFloor) return null;
        const theme = getGalleryTheme(room.id);
        const openings = roomOpenings(room);
        const [cx, cy, cz] = room.center;
        const [w, d] = room.size;
        const halfW = w / 2;
        const halfD = d / 2;
        const look = roomLookSign(index);
        const faceCamera = look === 1 ? Math.PI : 0;
        const lookFaceOpen = look === 1 ? openings.north : openings.south;
        const doorZ = cz + look * (halfD - 0.22);
        const srcA = PAINTING_SRCS[index % PAINTING_SRCS.length];
        const srcB = PAINTING_SRCS[(index + 2) % PAINTING_SRCS.length];
        const exhibitX = cx + (room.side === "right" ? -1.15 : 1.15);
        const plaquePos: [number, number, number] = lookFaceOpen
          ? [cx - halfW + 0.22, 3.55, cz]
          : [cx, 4.05, doorZ];
        const plaqueRot = lookFaceOpen ? Math.PI / 2 : faceCamera;

        return (
          <group key={`decor-${room.id}`} position={[0, cy, 0]}>
            <GalleryPlaque
              position={plaquePos}
              rotationY={plaqueRot}
              theme={theme}
            />
            {lookFaceOpen ? (
              <WallArt
                kind={theme.kind}
                leftPos={[cx - halfW + 0.22, 1.95, cz - 2.2]}
                rightPos={[cx - halfW + 0.22, 1.95, cz + 2.2]}
                rotationY={Math.PI / 2}
                srcA={srcA}
                srcB={srcB}
                theme={theme}
              />
            ) : (
              <WallArt
                kind={theme.kind}
                leftPos={[cx - 2.45, 1.95, doorZ]}
                rightPos={[cx + 2.45, 1.95, doorZ]}
                rotationY={faceCamera}
                srcA={srcA}
                srcB={srcB}
                theme={theme}
              />
            )}
            <group
              position={[exhibitX, 0, cz + look * 1.05]}
              rotation={[0, faceCamera, 0]}
              scale={[1.4, 1.4, 1.4]}
            >
              <GalleryExhibit
                kind={theme.kind}
                position={[0, 0, 0]}
                theme={theme}
              />
            </group>
            {theme.kind === "space" ? (
              <SpaceStars origin={[cx, 0, cz]} />
            ) : null}
          </group>
        );
      })}
    </group>
  );
}
