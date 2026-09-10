import { JOURNEY_NODES } from "@/journey/constants/nodes";
import { STORY_IMAGES } from "@/journey/overlays/storyImages";
import { useVisibleMuseumFloor } from "@/journey/hooks/useVisibleMuseumFloor";
import { STORY_ROOMS, type StoryRoom } from "@/journey/path/walkPath";
import { MUSEUM } from "@/journey/theme/museumPalette";
import { getGalleryTheme } from "@/journey/world/galleryThemes";
import { useActiveNodeId } from "@/journey/scroll/useJourneyProgress";
import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import { SRGBColorSpace } from "three";

const HIGHLIGHT = MUSEUM.highlight;

function ExhibitionScreen({
  nodeId,
  title,
  subtitle,
  room,
  active,
}: {
  nodeId: string;
  title: string;
  subtitle: string;
  room: StoryRoom;
  active: boolean;
}) {
  const src = STORY_IMAGES[nodeId] ?? STORY_IMAGES.welcome;
  const texture = useTexture(src);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  const theme = getGalleryTheme(room.id);

  const [cx, cy, cz] = room.center;
  const halfW = room.size[0] / 2;
  const onLeft = room.side !== "right";
  const x = cx + (onLeft ? -(halfW - 0.42) : halfW - 0.42);
  const z = cz;
  const rotY = onLeft ? Math.PI / 2 : -Math.PI / 2;
  const w = 2.4;
  const h = 3.2;
  const glow = active ? 1.05 : 0.4;

  return (
    <group position={[x, cy + h / 2 + 0.15, z]} rotation={[0, rotY, 0]}>
      <mesh position={[0, -h / 2 - 0.05, 0]}>
        <boxGeometry args={[w * 0.55, 0.12, 0.45]} />
        <meshStandardMaterial color={theme.frame} roughness={0.45} metalness={0.3} />
      </mesh>

      <mesh>
        <boxGeometry args={[w + 0.14, h + 0.14, 0.1]} />
        <meshStandardMaterial
          color={theme.frame}
          roughness={0.4}
          metalness={0.35}
          emissive={theme.accent}
          emissiveIntensity={active ? 0.28 : 0.08}
        />
      </mesh>

      <mesh position={[0, 0.15, 0.06]} renderOrder={2}>
        <planeGeometry args={[w * 0.92, h * 0.72]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      <mesh position={[0, -h * 0.38, 0.07]}>
        <planeGeometry args={[w * 0.92, 0.55]} />
        <meshStandardMaterial
          color={MUSEUM.frameInner}
          emissive={theme.accent}
          emissiveIntensity={active ? 0.15 : 0.05}
          roughness={0.55}
        />
      </mesh>

      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[w + 0.28, h + 0.28, 0.04]} />
        <meshStandardMaterial
          color={HIGHLIGHT}
          emissive={HIGHLIGHT}
          emissiveIntensity={glow * 0.28}
          transparent
          opacity={active ? 0.3 : 0.1}
          depthWrite={false}
        />
      </mesh>

      <group userData={{ title, subtitle }} />
    </group>
  );
}

/** Story boards on each room's outer wall (doors stay on north/south). */
export function CorridorExhibits() {
  const activeId = useActiveNodeId();
  const visibleFloor = useVisibleMuseumFloor();

  const exhibits = useMemo(
    () =>
      JOURNEY_NODES.map((node, index) => ({
        node,
        room: STORY_ROOMS[index],
      })),
    [],
  );

  return (
    <group>
      {exhibits.map(({ node, room }) =>
        room && node.id !== "complete" && room.floor === visibleFloor ? (
          <ExhibitionScreen
            key={node.id}
            nodeId={node.id}
            title={node.title}
            subtitle={node.subtitle}
            room={room}
            active={node.id === activeId}
          />
        ) : null,
      )}
    </group>
  );
}
