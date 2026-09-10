import { MUSEUM } from "@/journey/theme/museumPalette";
import {
  getActiveNode,
  type JourneyNode,
} from "@/journey/constants/nodes";
import { openDestinationDetail } from "@/journey/overlays/destinationDetailStore";
import {
  useActiveNodeId,
  useJourneyProgressStore,
} from "@/journey/scroll/useJourneyProgress";
import { useCursor } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh, MeshStandardMaterial } from "three";

const PRIMARY = MUSEUM.primary;
const HIGHLIGHT = MUSEUM.highlight;

type NodeLandmarkProps = {
  node: JourneyNode;
};

/** Flat glowing point on the route - no pin stem / popping marker. */
export function NodeLandmark({ node }: NodeLandmarkProps) {
  const store = useJourneyProgressStore();
  const activeId = useActiveNodeId();
  const pointRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const active = activeId === node.id;
  useCursor(hovered && node.id === "industries");

  useFrame(({ clock }) => {
    if (!pointRef.current) return;
    const progress = store.progress;
    const isActive = getActiveNode(progress).id === node.id;
    const visited = progress > node.dockT + node.dockRadius;
    const color =
      isActive || hovered ? HIGHLIGHT : visited ? "#7A6A52" : PRIMARY;

    const mat = pointRef.current.material as MeshStandardMaterial;
    mat.color.set(color);
    mat.emissive.set(color);
    mat.emissiveIntensity = isActive || hovered ? 1.2 : 0.55;

    if (!isActive) {
      pointRef.current.scale.setScalar(1);
      return;
    }
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.6) * 0.12;
    pointRef.current.scale.setScalar(pulse);
  });

  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (node.id === "industries") openDestinationDetail(node.id);
  };

  const r = active ? 0.18 : 0.12;

  return (
    <group
      position={node.position}
      onClick={onClick}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.55, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh
        ref={pointRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.04, 0]}
      >
        <circleGeometry args={[r, 16]} />
        <meshStandardMaterial
          color={PRIMARY}
          emissive={PRIMARY}
          emissiveIntensity={0.55}
          roughness={0.25}
          metalness={0.35}
          transparent
          opacity={0.95}
        />
      </mesh>

      {active ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
          <ringGeometry args={[r * 1.35, r * 2.1, 20]} />
          <meshBasicMaterial
            color={HIGHLIGHT}
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>
      ) : null}
    </group>
  );
}
