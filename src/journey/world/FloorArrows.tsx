import { createLinearRouteCurve } from "@/journey/path/routeCurve";
import { WALK_WAYPOINTS } from "@/journey/path/walkPath";
import { MUSEUM } from "@/journey/theme/museumPalette";
import { useJourneyProgress } from "@/journey/scroll/useJourneyProgress";
import { useMemo } from "react";

const HIGHLIGHT = MUSEUM.highlight;
const PRIMARY = MUSEUM.primary;
const ARROW_COUNT = 28;

/**
 * Floor AR arrows along the route - inspired by indoor wayfinding sketches
 * (chevron trail on the corridor floor).
 */
export function FloorArrows() {
  const progress = useJourneyProgress();

  const curve = useMemo(() => createLinearRouteCurve(WALK_WAYPOINTS), []);

  const arrows = useMemo(() => {
    const items: Array<{
      key: number;
      position: [number, number, number];
      rotationY: number;
      t: number;
    }> = [];

    for (let i = 0; i < ARROW_COUNT; i += 1) {
      const t = (i + 1) / (ARROW_COUNT + 1);
      const p = curve.getPointAt(t);
      const tan = curve.getTangentAt(t);
      const rotationY = Math.atan2(tan.x, tan.z);
      items.push({
        key: i,
        position: [p.x, p.y + 0.08, p.z],
        rotationY,
        t,
      });
    }
    return items;
  }, [curve]);

  return (
    <group>
      {arrows.map((arrow) => {
        const ahead = arrow.t > progress - 0.02;
        const near =
          Math.abs(arrow.t - progress) < 0.08 ||
          (arrow.t > progress && arrow.t < progress + 0.12);
        const opacity = ahead ? (near ? 0.95 : 0.45) : 0.12;
        const color = near ? HIGHLIGHT : PRIMARY;
        const scale = near ? 1.25 : 0.9;

        return (
          <mesh
            key={arrow.key}
            position={arrow.position}
            rotation={[-Math.PI / 2, 0, arrow.rotationY]}
            scale={scale}
          >
            <coneGeometry args={[0.32, 0.7, 3]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={near ? 1.4 : 0.35}
              transparent
              opacity={opacity}
              roughness={0.35}
              metalness={0.2}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
