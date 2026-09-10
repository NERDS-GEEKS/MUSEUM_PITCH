import { getActiveNode } from "@/journey/constants/nodes";
import { MUSEUM } from "@/journey/theme/museumPalette";
import { useJourneyProgress } from "@/journey/scroll/useJourneyProgress";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";

const HIGHLIGHT = MUSEUM.highlight;
const SCAN_NODES = new Set(["vps", "mapping", "analytics"]);

/** Subtle scan reticle near Twin / Navigate / Insights docks. */
export function ScanReticle() {
  const progress = useJourneyProgress();
  const groupRef = useRef<Group>(null);
  const active = useMemo(() => getActiveNode(progress), [progress]);
  const visible = SCAN_NODES.has(active.id);

  useFrame(({ clock }) => {
    if (!groupRef.current || !visible) return;
    const t = clock.elapsedTime;
    groupRef.current.rotation.z = t * 0.6;
    const s = 1 + Math.sin(t * 2.2) * 0.06;
    groupRef.current.scale.setScalar(s);
  });

  if (!visible) return null;

  const [x, y, z] = active.position;

  return (
    <group ref={groupRef} position={[x, y + 2.2, z]}>
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[0.9, 1.05, 48]} />
        <meshBasicMaterial
          color={HIGHLIGHT}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <ringGeometry args={[0.55, 0.62, 32]} />
        <meshBasicMaterial
          color={HIGHLIGHT}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
      {/* Corner brackets */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]} position={[0, 0, 0]}>
          <mesh position={[0.7, 0.7, 0]}>
            <boxGeometry args={[0.28, 0.04, 0.02]} />
            <meshBasicMaterial color={HIGHLIGHT} transparent opacity={0.7} />
          </mesh>
          <mesh position={[0.7, 0.7, 0]}>
            <boxGeometry args={[0.04, 0.28, 0.02]} />
            <meshBasicMaterial color={HIGHLIGHT} transparent opacity={0.7} />
          </mesh>
        </mesh>
      ))}
    </group>
  );
}
