import galleryPlaqueFontUrl from "@/assets/fonts/Outfit-Black.ttf?url";
import { useVisibleMuseumFloor } from "@/journey/hooks/useVisibleMuseumFloor";
import { roomLookSign, roomOpenings, STORY_ROOMS } from "@/journey/path/walkPath";
import {
  getGalleryTheme,
  type GalleryTheme,
} from "@/journey/world/galleryThemes";
import { GalleryFurnishings } from "@/journey/world/GalleryFurnishings";
import { Text } from "@react-three/drei";

/** Stay below the 4.2 m ceiling slab so two-line names are not clipped. */
const PLAQUE_TOP_Y = 3.92;

type PlaqueLayout = {
  text: string;
  width: number;
  height: number;
  fontSize: number;
};

function getPlaqueLayout(label: string): PlaqueLayout {
  const words = label.trim().toUpperCase().split(/\s+/).filter(Boolean);
  const single = words.join(" ");
  if (single.length <= 18 || words.length < 2) {
    return { text: single, width: 2.55, height: 0.44, fontSize: 0.17 };
  }

  let splitAt = 1;
  let best = Number.POSITIVE_INFINITY;
  for (let i = 1; i < words.length; i++) {
    const left = words.slice(0, i).join(" ").length;
    const right = words.slice(i).join(" ").length;
    const awkward = words[i] === "&" || words[i] === "AND";
    const score = Math.abs(left - right) + (awkward ? 8 : 0);
    if (score < best) {
      best = score;
      splitAt = i;
    }
  }

  return {
    text: `${words.slice(0, splitAt).join(" ")}\n${words.slice(splitAt).join(" ")}`,
    width: 2.78,
    height: 0.72,
    fontSize: 0.135,
  };
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
  const layout = getPlaqueLayout(theme.label);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh>
        <boxGeometry args={[layout.width, layout.height, 0.08]} />
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
        fontSize={layout.fontSize}
        color="#FFF8F0"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        letterSpacing={0.02}
        lineHeight={1.15}
        outlineWidth={0.01}
        outlineColor="#1A1410"
        maxWidth={layout.width - 0.18}
      >
        {layout.text}
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

/** Gallery nameplates. Story content lives on the walls in CorridorExhibits. */
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
        const plaqueH = getPlaqueLayout(theme.label).height;
        const plaquePos: [number, number, number] = lookFaceOpen
          ? [cx - halfW + 0.22, PLAQUE_TOP_Y - plaqueH / 2, cz]
          : [cx, PLAQUE_TOP_Y - plaqueH / 2, doorZ];
        const plaqueRot = lookFaceOpen ? Math.PI / 2 : faceCamera;

        return (
          <group key={`decor-${room.id}`} position={[0, cy, 0]}>
            <GalleryPlaque
              position={plaquePos}
              rotationY={plaqueRot}
              theme={theme}
            />
            {theme.kind === "space" ? (
              <SpaceStars origin={[cx, 0, cz]} />
            ) : null}
          </group>
        );
      })}
      <GalleryFurnishings />
    </group>
  );
}
