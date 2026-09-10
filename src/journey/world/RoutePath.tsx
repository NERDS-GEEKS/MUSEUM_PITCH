import navmeArrow from "@/assets/NavMe_blue_arrow.png";
import { getActiveNode } from "@/journey/constants/nodes";
import { createLinearRouteCurve } from "@/journey/path/routeCurve";
import { WALK_WAYPOINTS } from "@/journey/path/walkPath";
import { MUSEUM } from "@/journey/theme/museumPalette";
import { useJourneyProgressStore } from "@/journey/scroll/useJourneyProgress";
import {
  getTravelSegment,
  isStraightSkipHop,
} from "@/journey/scroll/travelSegmentStore";
import { getFinishCredits } from "@/journey/opening/finishCreditsStore";
import { Line } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef, type RefObject } from "react";
import {
  Group,
  LinearFilter,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  type Mesh,
} from "three";

const PRIMARY = MUSEUM.primary;
const HIGHLIGHT = MUSEUM.highlight;
const PATH_SAMPLES = 48;
const ARROW_SCALE_DESKTOP = 1.35;
const ARROW_SCALE_MOBILE = 0.95;
const ARROW_BEHIND_STOP = 0;

function ProgressArrowHead({
  meshRef,
  baseScale,
}: {
  meshRef: RefObject<Mesh | null>;
  baseScale: number;
}) {
  const texture = useLoader(TextureLoader, navmeArrow);
  texture.colorSpace = SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, Math.PI]}
      scale={[baseScale, baseScale, 1]}
      renderOrder={30}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/**
 * Route arrow:
 * - Adjacent hops: visible with Nav beside it on the path
 * - Skip hops / finish mural / reading a wall: hidden
 */
export function RoutePath({
  showArrow = true,
}: {
  showArrow?: boolean;
}) {
  const store = useJourneyProgressStore();
  const { size } = useThree();
  const headRef = useRef<Mesh>(null);
  const pulseRef = useRef<Mesh>(null);
  const lineRef = useRef<Group>(null);
  const curve = useMemo(() => createLinearRouteCurve(WALK_WAYPOINTS), []);

  const compactView =
    size.width > 0 &&
    (size.width < 900 || size.height / Math.max(size.width, 1) > 1.05);
  const arrowScale = compactView ? ARROW_SCALE_MOBILE : ARROW_SCALE_DESKTOP;
  const pulseScale = compactView ? 0.62 : 1;

  const allPoints = useMemo(() => {
    const points: Vector3[] = [];
    for (let i = 0; i <= PATH_SAMPLES; i += 1) {
      const p = curve.getPointAt(i / PATH_SAMPLES);
      points.push(new Vector3(p.x, p.y + 0.06, p.z));
    }
    return points;
  }, [curve]);

  useFrame(({ clock }) => {
    if (!showArrow) return;
    const progress = store.progress;
    const seg = getTravelSegment();
    const skip = isStraightSkipHop();
    const finishWall = getFinishCredits() > 0.08;
    const onRoute = seg?.mode === "route" || store.travelIntent !== 0;
    const t = clock.elapsedTime;

    const hideMarkers =
      skip ||
      finishWall ||
      (!onRoute && getActiveNode(progress).id !== "complete");
    if (headRef.current) headRef.current.visible = !hideMarkers;
    if (pulseRef.current) pulseRef.current.visible = !hideMarkers;
    if (lineRef.current) lineRef.current.visible = !hideMarkers && onRoute;

    if (hideMarkers) return;

    const arrowT =
      seg?.mode === "route" || store.travelIntent !== 0
        ? Math.max(0, progress - ARROW_BEHIND_STOP)
        : Math.max(0, getActiveNode(progress).dockT - ARROW_BEHIND_STOP);

    const head = curve.getPointAt(arrowT);
    const tangent = curve.getTangentAt(Math.max(arrowT, 0.0001));
    const yaw = Math.atan2(tangent.x, tangent.z);
    const traveling = store.travelIntent !== 0;

    if (headRef.current) {
      headRef.current.position.set(head.x, head.y + 0.1, head.z);
      headRef.current.rotation.set(-Math.PI / 2, 0, Math.PI + yaw);
      const pulse = traveling ? 1 + Math.sin(t * 2.8) * 0.04 : 1;
      headRef.current.scale.set(
        arrowScale * pulse,
        arrowScale * pulse,
        1,
      );
    }

    if (pulseRef.current) {
      pulseRef.current.position.set(head.x, head.y + 0.04, head.z);
      const s =
        (traveling ? 1.05 + Math.sin(t * 2.4) * 0.2 : 1.05) * pulseScale;
      pulseRef.current.scale.setScalar(s);
    }
  });

  if (!showArrow) return null;

  return (
    <group>
      <group ref={lineRef} visible={false}>
        <Line
          points={allPoints}
          color={PRIMARY}
          lineWidth={compactView ? 1.1 : 1.6}
          transparent
          opacity={0.28}
        />
      </group>

      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]} renderOrder={5}>
        <ringGeometry
          args={
            compactView ? [0.22, 0.34, 24] : [0.35, 0.55, 24]
          }
        />
        <meshBasicMaterial
          color={HIGHLIGHT}
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>

      <Suspense fallback={null}>
        <ProgressArrowHead meshRef={headRef} baseScale={arrowScale} />
      </Suspense>
    </group>
  );
}
