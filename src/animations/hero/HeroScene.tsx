import { Float, Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import {
  DoubleSide,
  MathUtils,
  MeshBasicMaterial,
  Vector3,
} from "three";

const HIGHLIGHT = "#6ecfc8";
const PRIMARY = "#c4a574";

function latLngToVec(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function arcPoints(
  a: [number, number, number],
  b: [number, number, number],
  segments = 16,
): Vector3[] {
  const start = new Vector3(...a);
  const end = new Vector3(...b);
  const points: Vector3[] = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const point = new Vector3().lerpVectors(start, end, t).normalize().multiplyScalar(1.22);
    points.push(point);
  }
  return points;
}

export function HeroScene() {
  const root = useRef<Group>(null);
  const scan = useRef<Mesh>(null);
  const { pointer } = useThree();

  const nodes = useMemo(
    () =>
      [
        [28, -40],
        [12, 20],
        [-18, 55],
        [45, 90],
        [-32, -70],
        [8, -120],
        [-10, 140],
        [35, -160],
        [-40, 10],
        [20, 70],
      ].map(([lat, lng]) => latLngToVec(lat, lng, 1.28)),
    [],
  );

  const routes = useMemo(() => {
    const pairs: Array<[number, number]> = [
      [0, 1],
      [1, 2],
      [2, 3],
      [0, 4],
      [5, 6],
      [7, 8],
    ];
    return pairs.map(([i, j]) => arcPoints(nodes[i], nodes[j]));
  }, [nodes]);

  useFrame((state, delta) => {
    if (!root.current) return;

    root.current.rotation.y += delta * 0.1;
    root.current.rotation.x = MathUtils.lerp(
      root.current.rotation.x,
      pointer.y * 0.18,
      0.06,
    );
    root.current.rotation.z = MathUtils.lerp(
      root.current.rotation.z,
      -pointer.x * 0.12,
      0.06,
    );

    if (scan.current) {
      const material = scan.current.material as MeshBasicMaterial;
      material.opacity = 0.06 + (Math.sin(state.clock.elapsedTime * 1.6) + 1) * 0.05;
      scan.current.position.x = Math.sin(state.clock.elapsedTime * 0.45) * 1.15;
    }
  });

  return (
    <>
      <fog attach="fog" args={["#050505", 3.2, 7.5]} />
      <ambientLight intensity={0.32} />
      <directionalLight position={[3.5, 2.5, 2]} intensity={0.75} color={PRIMARY} />
      <pointLight position={[-2.2, 1.2, 2.8]} intensity={0.35} color={HIGHLIGHT} />

      <group ref={root}>
        <mesh>
          <sphereGeometry args={[1.12, 28, 28]} />
          <meshStandardMaterial
            color="#0a1524"
            transparent
            opacity={0.72}
            roughness={0.9}
            metalness={0.15}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.15, 20, 20]} />
          <meshBasicMaterial color={PRIMARY} wireframe transparent opacity={0.28} />
        </mesh>

        {routes.map((points, index) => (
          <Line
            key={`route-${index}`}
            points={points}
            color={HIGHLIGHT}
            lineWidth={1}
            dashed
            dashSize={0.07}
            gapSize={0.05}
            transparent
            opacity={0.38}
          />
        ))}

        {nodes.map((position, index) => {
          const highlight = index % 4 === 0;
          const mesh = (
            <mesh position={position}>
              <icosahedronGeometry args={[0.045, 0]} />
              <meshStandardMaterial
                color={highlight ? HIGHLIGHT : PRIMARY}
                emissive={highlight ? HIGHLIGHT : PRIMARY}
                emissiveIntensity={highlight ? 0.55 : 0.28}
                roughness={0.35}
                metalness={0.4}
              />
            </mesh>
          );

          if (highlight) {
            return (
              <Float
                key={`node-${index}`}
                speed={1.1}
                floatIntensity={0.25}
                rotationIntensity={0.15}
              >
                {mesh}
              </Float>
            );
          }

          return <group key={`node-${index}`}>{mesh}</group>;
        })}

        <mesh ref={scan} position={[0, 0, 0]}>
          <planeGeometry args={[0.03, 2.5]} />
          <meshBasicMaterial
            color={HIGHLIGHT}
            transparent
            opacity={0.1}
            side={DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </>
  );
}
