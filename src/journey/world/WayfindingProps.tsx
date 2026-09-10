import wayfindingRef from "@/assets/wayfinding-reference.png";
import { JOURNEY_NODES } from "@/journey/constants/nodes";
import { MUSEUM } from "@/journey/theme/museumPalette";
import { useJourneyProgress } from "@/journey/scroll/useJourneyProgress";
import { useTexture } from "@react-three/drei";
import { useMemo } from "react";

const HIGHLIGHT = MUSEUM.highlight;
const PRIMARY = MUSEUM.primary;

function findNode(id: string) {
  return JOURNEY_NODES.find((n) => n.id === id)!;
}

/** Simple wall directory board near mapping node. */
function WallDirectory({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0.4, 0]}>
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[2.4, 1.8, 0.12]} />
        <meshStandardMaterial
          color="#1a1610"
          emissive={PRIMARY}
          emissiveIntensity={0.12}
          metalness={0.35}
          roughness={0.5}
        />
      </mesh>
      {[0.4, 0, -0.4].map((y, i) => (
        <mesh key={i} position={[-0.55, 1.85 + y, 0.08]}>
          <boxGeometry args={[0.9, 0.12, 0.02]} />
          <meshStandardMaterial
            color={HIGHLIGHT}
            emissive={HIGHLIGHT}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Props from the wayfinding concept sketch: AR phone plane and directory.
 */
export function WayfindingProps() {
  const progress = useJourneyProgress();
  const texture = useTexture(wayfindingRef);
  const mappingNode = useMemo(() => findNode("mapping"), []);
  const twinNode = useMemo(() => findNode("vps"), []);

  const showPhone = progress > twinNode.dockT - 0.08;

  return (
    <group>
      <WallDirectory
        position={[
          mappingNode.position[0] + 4,
          mappingNode.position[1],
          mappingNode.position[2] - 2,
        ]}
      />

      {showPhone ? (
        <group
          position={[
            twinNode.position[0] + 2.2,
            twinNode.position[1] + 1.8,
            twinNode.position[2],
          ]}
          rotation={[0, -0.6, 0]}
        >
          <mesh>
            <planeGeometry args={[2.4, 3.2]} />
            <meshStandardMaterial
              map={texture}
              transparent
              opacity={0.92}
              roughness={0.6}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[0, 0, -0.04]}>
            <planeGeometry args={[2.55, 3.35]} />
            <meshStandardMaterial
              color="#0a1018"
              emissive={PRIMARY}
              emissiveIntensity={0.2}
            />
          </mesh>
          <mesh position={[0.55, 0.9, 0.05]}>
            <planeGeometry args={[0.7, 0.28]} />
            <meshBasicMaterial color={HIGHLIGHT} transparent opacity={0.85} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}
