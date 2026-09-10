import { useOpeningAssembly } from "@/journey/opening/openingAssemblyStore";
import { MUSEUM } from "@/journey/theme/museumPalette";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { MathUtils, type Group, type Mesh } from "three";

const PRIMARY = MUSEUM.primary;
const HIGHLIGHT = MUSEUM.highlight;
const ACCENT = MUSEUM.accent;

type FragmentSpec = {
  id: string;
  kind: "pin" | "tile" | "ring" | "tower" | "route";
  start: [number, number, number];
  end: [number, number, number];
  scale: number;
  color: string;
};

/** Shared spawn near the welcome lobby - every piece flies from one place. */
const ORIGIN: [number, number, number] = [0, 1.6, 4];

const FRAGMENTS: FragmentSpec[] = [
  { id: "f1", kind: "pin", start: ORIGIN, end: [0, 1.2, 4], scale: 1, color: HIGHLIGHT },
  { id: "f2", kind: "tile", start: ORIGIN, end: [-3.5, 0.05, 18], scale: 1.2, color: PRIMARY },
  { id: "f3", kind: "tower", start: ORIGIN, end: [3.5, 1.8, 32], scale: 0.9, color: ACCENT },
  { id: "f4", kind: "ring", start: ORIGIN, end: [-3.5, 0.4, 46], scale: 1.1, color: HIGHLIGHT },
  { id: "f5", kind: "route", start: ORIGIN, end: [0, 0.2, 12], scale: 1, color: PRIMARY },
  { id: "f6", kind: "tile", start: ORIGIN, end: [3.5, 0.05, 74], scale: 1.4, color: PRIMARY },
  { id: "f7", kind: "tower", start: ORIGIN, end: [-3.5, 1.6, 88], scale: 1, color: ACCENT },
  { id: "f8", kind: "pin", start: ORIGIN, end: [0, 1.1, 130], scale: 0.95, color: HIGHLIGHT },
  { id: "f9", kind: "ring", start: ORIGIN, end: [0, 0.5, 144], scale: 1, color: PRIMARY },
  { id: "f10", kind: "route", start: ORIGIN, end: [0, 0.25, 60], scale: 1.1, color: HIGHLIGHT },
];

function FragmentMesh({
  spec,
  assembly,
}: {
  spec: FragmentSpec;
  assembly: number;
}) {
  const ref = useRef<Group>(null);
  const spin = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const t = MathUtils.clamp(assembly, 0, 1);
    const ease = t * t * (3 - 2 * t);
    const x = MathUtils.lerp(spec.start[0], spec.end[0], ease);
    const y = MathUtils.lerp(spec.start[1], spec.end[1], ease);
    const z = MathUtils.lerp(spec.start[2], spec.end[2], ease);
    ref.current.position.set(x, y, z);

    if (t < 0.85) {
      spin.current += delta * (0.35 + (1 - t) * 0.6);
      ref.current.rotation.y = spin.current;
      ref.current.rotation.x = Math.sin(spin.current * 0.7) * 0.25 * (1 - t);
    } else {
      ref.current.rotation.x = MathUtils.lerp(ref.current.rotation.x, 0, 0.08);
      ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, 0, 0.08);
    }

    const fade = t < 0.2 ? 0.35 + t * 2 : t > 0.9 ? 1 - (t - 0.9) * 6 : 0.85;
    ref.current.visible = fade > 0.05;
    ref.current.scale.setScalar(spec.scale * (0.75 + ease * 0.35));
  });

  return (
    <group ref={ref}>
      {spec.kind === "pin" ? (
        <>
          <mesh position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshStandardMaterial
              color={spec.color}
              emissive={spec.color}
              emissiveIntensity={0.8}
              transparent
              opacity={0.9}
            />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 0.45, 6]} />
            <meshStandardMaterial color={spec.color} emissive={spec.color} emissiveIntensity={0.4} />
          </mesh>
        </>
      ) : null}
      {spec.kind === "tile" ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.4, 1.6]} />
          <meshStandardMaterial
            color={spec.color}
            emissive={spec.color}
            emissiveIntensity={0.25}
            transparent
            opacity={0.35}
            wireframe
          />
        </mesh>
      ) : null}
      {spec.kind === "tower" ? (
        <mesh>
          <boxGeometry args={[0.9, 2.2, 0.9]} />
          <meshStandardMaterial
            color={spec.color}
            emissive={spec.color}
            emissiveIntensity={0.2}
            transparent
            opacity={0.45}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
      ) : null}
      {spec.kind === "ring" ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.75, 28]} />
          <meshBasicMaterial color={spec.color} transparent opacity={0.55} depthWrite={false} />
        </mesh>
      ) : null}
      {spec.kind === "route" ? (
        <mesh>
          <boxGeometry args={[0.08, 0.08, 3.2]} />
          <meshStandardMaterial
            color={spec.color}
            emissive={spec.color}
            emissiveIntensity={1}
            transparent
            opacity={0.7}
          />
        </mesh>
      ) : null}
    </group>
  );
}

function AmbientDust() {
  const points = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 48; i += 1) {
      arr.push([
        (Math.random() - 0.5) * 40,
        Math.random() * 10,
        Math.random() * 140,
      ]);
    }
    return arr;
  }, []);
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = clock.elapsedTime * 0.02;
  });

  return (
    <group ref={group}>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial color={HIGHLIGHT} transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Scattered spatial fragments that assemble as opening assembly progress rises.
 * Hidden once journey is fully unlocked (assembly stays at 1 and fades via opacity).
 */
export function OpeningWorldExtras({ active }: { active: boolean }) {
  const assembly = useOpeningAssembly();
  const veil = useRef<Mesh>(null);

  useFrame(() => {
    if (!veil.current) return;
    const mat = veil.current.material;
    if (!Array.isArray(mat) && "opacity" in mat) {
      mat.opacity = active ? MathUtils.lerp(0.55, 0.08, assembly) : 0;
    }
    veil.current.visible = active && assembly < 0.98;
  });

  if (!active) return null;

  return (
    <group>
      <mesh ref={veil} position={[0, 1.6, 8]} rotation={[0, 0, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshBasicMaterial color="#05080e" transparent opacity={0.45} depthWrite={false} />
      </mesh>
      <AmbientDust />
      {FRAGMENTS.map((spec) => (
        <FragmentMesh key={spec.id} spec={spec} assembly={assembly} />
      ))}
    </group>
  );
}
