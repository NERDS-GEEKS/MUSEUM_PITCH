import { useVisibleMuseumFloor } from "@/journey/hooks/useVisibleMuseumFloor";
import { MUSEUM } from "@/journey/theme/museumPalette";
import {
  getGalleryTheme,
  type GalleryKind,
  type GalleryTheme,
} from "@/journey/world/galleryThemes";
import { roomLookSign, STORY_ROOMS, type StoryRoom } from "@/journey/path/walkPath";
import { useMemo } from "react";
import { CatmullRomCurve3, Vector2, Vector3 } from "three";

const POT_PROFILE = [
  new Vector2(0.03, 0),
  new Vector2(0.165, 0.018),
  new Vector2(0.178, 0.055),
  new Vector2(0.142, 0.34),
  new Vector2(0.158, 0.365),
  new Vector2(0.172, 0.41),
];

const VITRINE_POSTS: [number, number][] = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

function Pedestal({
  position,
  height = 0.92,
}: {
  position: [number, number, number];
  height?: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.045, 0]}>
        <boxGeometry args={[0.62, 0.09, 0.62]} />
        <meshStandardMaterial
          color={MUSEUM.pedestal}
          roughness={0.58}
          metalness={0.06}
        />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[0.54, 0.05, 0.54]} />
        <meshStandardMaterial
          color="#4A433C"
          roughness={0.5}
          metalness={0.08}
        />
      </mesh>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[0.4, height, 0.4]} />
        <meshStandardMaterial
          color={MUSEUM.pedestal}
          roughness={0.46}
          metalness={0.08}
        />
      </mesh>
      <mesh position={[0, height + 0.02, 0]}>
        <boxGeometry args={[0.5, 0.055, 0.5]} />
        <meshStandardMaterial
          color="#4A433C"
          roughness={0.4}
          metalness={0.12}
        />
      </mesh>
      <mesh position={[0, height + 0.052, 0]}>
        <boxGeometry args={[0.52, 0.012, 0.52]} />
        <meshStandardMaterial
          color={MUSEUM.trim}
          metalness={0.62}
          roughness={0.24}
        />
      </mesh>
      <mesh position={[0, 0.28, 0.205]}>
        <boxGeometry args={[0.16, 0.035, 0.012]} />
        <meshStandardMaterial
          color={MUSEUM.primary}
          metalness={0.55}
          roughness={0.32}
        />
      </mesh>
    </group>
  );
}

function MarbleBust({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Pedestal position={[0, 0, 0]} height={0.82} />
      <mesh position={[0, 0.94, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.08, 16]} />
        <meshStandardMaterial color="#8A8078" roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.08, 0.02]} scale={[1.05, 0.55, 0.62]}>
        <sphereGeometry args={[0.26, 18, 14]} />
        <meshStandardMaterial color={MUSEUM.marbleShade} roughness={0.36} />
      </mesh>
      <mesh position={[0, 1.18, 0]}>
        <cylinderGeometry args={[0.07, 0.11, 0.16, 14]} />
        <meshStandardMaterial color={MUSEUM.marble} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.36, 0.015]}>
        <sphereGeometry args={[0.145, 20, 16]} />
        <meshStandardMaterial color={MUSEUM.marble} roughness={0.26} />
      </mesh>
      <mesh position={[0, 1.48, -0.02]} scale={[0.95, 0.42, 0.9]}>
        <sphereGeometry args={[0.13, 14, 10]} />
        <meshStandardMaterial color={MUSEUM.marbleShade} roughness={0.38} />
      </mesh>
      <mesh position={[0, 1.34, 0.14]} scale={[0.45, 0.55, 0.7]}>
        <sphereGeometry args={[0.05, 10, 8]} />
        <meshStandardMaterial color={MUSEUM.marble} roughness={0.28} />
      </mesh>
    </group>
  );
}

function Statue({
  position,
  accent,
}: {
  position: [number, number, number];
  accent: string;
}) {
  return (
    <group position={position}>
      <Pedestal position={[0, 0, 0]} height={0.62} />
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.08, 14]} />
        <meshStandardMaterial color={MUSEUM.marbleShade} roughness={0.4} />
      </mesh>
      <mesh position={[-0.05, 0.98, 0]} rotation={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.045, 0.055, 0.38, 10]} />
        <meshStandardMaterial color={MUSEUM.marble} roughness={0.32} />
      </mesh>
      <mesh position={[0.06, 0.96, 0]} rotation={[0, 0, -0.12]}>
        <cylinderGeometry args={[0.042, 0.05, 0.36, 10]} />
        <meshStandardMaterial color={MUSEUM.marble} roughness={0.32} />
      </mesh>
      <mesh position={[0, 1.28, 0.02]} scale={[0.82, 1, 0.5]}>
        <cylinderGeometry args={[0.13, 0.16, 0.42, 12]} />
        <meshStandardMaterial color={MUSEUM.marble} roughness={0.28} />
      </mesh>
      <mesh position={[0, 1.22, 0.02]} rotation={[1.2, 0.3, 0]}>
        <torusGeometry args={[0.15, 0.028, 8, 18]} />
        <meshStandardMaterial color={MUSEUM.marbleShade} roughness={0.36} />
      </mesh>
      <mesh position={[-0.22, 1.32, 0]} rotation={[0.15, 0, 0.7]}>
        <cylinderGeometry args={[0.028, 0.038, 0.36, 10]} />
        <meshStandardMaterial color={MUSEUM.marble} roughness={0.3} />
      </mesh>
      <mesh position={[0.2, 1.38, 0.04]} rotation={[0.35, 0, -0.85]}>
        <cylinderGeometry args={[0.026, 0.036, 0.32, 10]} />
        <meshStandardMaterial color={MUSEUM.marble} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.58, 0.02]}>
        <sphereGeometry args={[0.11, 16, 14]} />
        <meshStandardMaterial color={MUSEUM.marble} roughness={0.24} />
      </mesh>
      <mesh position={[0, 1.7, 0.02]}>
        <cylinderGeometry args={[0.045, 0.055, 0.035, 12]} />
        <meshStandardMaterial
          color={accent}
          metalness={0.5}
          roughness={0.28}
          emissive={accent}
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}

function ColumnFragment({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Pedestal position={[0, 0, 0]} height={0.48} />
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.08, 16]} />
        <meshStandardMaterial color={MUSEUM.marbleShade} roughness={0.42} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 0.78, 16]} />
        <meshStandardMaterial color={MUSEUM.marble} roughness={0.34} />
      </mesh>
      <mesh position={[0, 1.46, 0]}>
        <torusGeometry args={[0.155, 0.03, 8, 18]} />
        <meshStandardMaterial color={MUSEUM.marbleShade} roughness={0.38} />
      </mesh>
      <mesh position={[0.02, 1.52, 0.01]} rotation={[0.12, 0.2, 0.08]}>
        <cylinderGeometry args={[0.16, 0.14, 0.1, 14]} />
        <meshStandardMaterial color={MUSEUM.marble} roughness={0.36} />
      </mesh>
    </group>
  );
}

function Globe({ position }: { position: [number, number, number] }) {
  const gy = 1.2;
  return (
    <group position={position}>
      <Pedestal position={[0, 0, 0]} height={0.74} />
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.04, 0.07, 0.14, 12]} />
        <meshStandardMaterial
          color={MUSEUM.trim}
          metalness={0.68}
          roughness={0.22}
        />
      </mesh>
      <mesh position={[0, gy, 0]}>
        <sphereGeometry args={[0.27, 32, 24]} />
        <meshStandardMaterial
          color="#1E5A6A"
          roughness={0.42}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0.1, gy + 0.08, 0.16]} scale={[0.55, 0.28, 0.42]}>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial color="#3A7A4A" roughness={0.55} />
      </mesh>
      <mesh position={[-0.14, gy - 0.04, -0.12]} scale={[0.42, 0.22, 0.35]}>
        <sphereGeometry args={[0.2, 12, 10]} />
        <meshStandardMaterial color="#4A6A38" roughness={0.55} />
      </mesh>
      <mesh position={[0.02, gy + 0.16, -0.18]} scale={[0.32, 0.18, 0.28]}>
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshStandardMaterial color="#2E6A40" roughness={0.52} />
      </mesh>
      <mesh position={[0, gy, 0]} rotation={[0.12, 0, 0.18]}>
        <torusGeometry args={[0.278, 0.006, 8, 36]} />
        <meshStandardMaterial color="#8FBFB0" roughness={0.4} />
      </mesh>
      <mesh position={[0, gy, 0]} rotation={[1.12, 0.35, 0]}>
        <torusGeometry args={[0.31, 0.012, 8, 32]} />
        <meshStandardMaterial
          color={MUSEUM.trim}
          metalness={0.72}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function Planet({
  position,
  color,
  size = 0.26,
  ring = false,
  bands = false,
  moon = false,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
  ring?: boolean;
  bands?: boolean;
  moon?: boolean;
}) {
  const py = 1.16;
  return (
    <group position={position}>
      <Pedestal position={[0, 0, 0]} height={0.68} />
      <mesh position={[0, 0.86, 0]}>
        <cylinderGeometry args={[0.016, 0.028, 0.22, 10]} />
        <meshStandardMaterial
          color={MUSEUM.trim}
          metalness={0.7}
          roughness={0.22}
        />
      </mesh>
      <mesh position={[0, py, 0]}>
        <sphereGeometry args={[size, 28, 22]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.28}
          roughness={0.36}
        />
      </mesh>
      <mesh position={[0, py, 0]}>
        <sphereGeometry args={[size * 1.06, 22, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.1}
          roughness={0.12}
          metalness={0.05}
        />
      </mesh>
      {bands ? (
        <group>
          <mesh
            position={[0, py - size * 0.04, 0]}
            scale={[1, 0.22, 1]}
          >
            <sphereGeometry args={[size * 0.98, 20, 12]} />
            <meshStandardMaterial
              color="#D8B090"
              roughness={0.48}
              transparent
              opacity={0.35}
            />
          </mesh>
          <mesh
            position={[0, py + size * 0.12, 0]}
            scale={[1, 0.16, 1]}
          >
            <sphereGeometry args={[size * 0.92, 18, 10]} />
            <meshStandardMaterial
              color="#8A6048"
              roughness={0.5}
              transparent
              opacity={0.28}
            />
          </mesh>
        </group>
      ) : null}
      {ring ? (
        <group position={[0, py, 0]} rotation={[1.08, 0.18, 0]}>
          <mesh>
            <torusGeometry args={[size * 1.55, 0.022, 8, 40]} />
            <meshStandardMaterial
              color="#D4C4A0"
              metalness={0.22}
              roughness={0.38}
            />
          </mesh>
          <mesh>
            <torusGeometry args={[size * 1.28, 0.014, 6, 36]} />
            <meshStandardMaterial
              color="#B8A078"
              metalness={0.2}
              roughness={0.42}
            />
          </mesh>
        </group>
      ) : null}
      {moon ? (
        <mesh position={[size * 1.7, py + size * 0.22, size * 0.2]}>
          <sphereGeometry args={[size * 0.2, 12, 10]} />
          <meshStandardMaterial color="#C8C2B4" roughness={0.55} />
        </mesh>
      ) : null}
    </group>
  );
}

function Vitrine({
  position,
  theme,
}: {
  position: [number, number, number];
  theme: GalleryTheme;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.02, 0.6, 0.76]} />
        <meshStandardMaterial color={theme.frame} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.08, 0.39]}>
        <boxGeometry args={[0.72, 0.08, 0.02]} />
        <meshStandardMaterial
          color={theme.trim}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[1.06, 0.05, 0.8]} />
        <meshStandardMaterial
          color={theme.trim}
          metalness={0.48}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0.68, 0]}>
        <boxGeometry args={[0.78, 0.02, 0.54]} />
        <meshStandardMaterial color="#2A1C18" roughness={0.85} />
      </mesh>
      {VITRINE_POSTS.map(([sx, sz]) => (
        <mesh key={`${sx}-${sz}`} position={[sx * 0.42, 1.08, sz * 0.3]}>
          <cylinderGeometry args={[0.016, 0.016, 0.8, 10]} />
          <meshStandardMaterial
            color={theme.trim}
            metalness={0.7}
            roughness={0.18}
          />
        </mesh>
      ))}
      <mesh position={[0, 1.08, 0]}>
        <boxGeometry args={[0.84, 0.78, 0.6]} />
        <meshStandardMaterial
          color="#C8DCE8"
          transparent
          opacity={0.13}
          roughness={0.05}
          metalness={0.12}
        />
      </mesh>
      <mesh position={[0, 1.08, 0.31]}>
        <boxGeometry args={[0.86, 0.8, 0.012]} />
        <meshStandardMaterial
          color="#D0E4F0"
          transparent
          opacity={0.1}
          roughness={0.04}
        />
      </mesh>
      <mesh position={[0, 0.86, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.06, 12]} />
        <meshStandardMaterial color={theme.trim} metalness={0.45} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <dodecahedronGeometry args={[0.11, 0]} />
        <meshStandardMaterial
          color={theme.accent}
          emissive={theme.accent}
          emissiveIntensity={0.32}
          metalness={0.4}
          roughness={0.22}
        />
      </mesh>
      <mesh position={[0, 1.46, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial
          color={theme.light}
          emissive={theme.light}
          emissiveIntensity={0.7}
        />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.9, 0.04, 0.66]} />
        <meshStandardMaterial
          color={theme.trim}
          metalness={0.55}
          roughness={0.28}
        />
      </mesh>
    </group>
  );
}

function Plant({
  position,
  tall = false,
}: {
  position: [number, number, number];
  tall?: boolean;
}) {
  const leafY = tall ? 1.05 : 0.72;
  return (
    <group position={position}>
      <mesh position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
        <meshStandardMaterial color="#6A5040" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <latheGeometry args={[POT_PROFILE, 18]} />
        <meshStandardMaterial color="#8A4A32" roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.04, 14]} />
        <meshStandardMaterial color="#3A2A1C" roughness={0.9} />
      </mesh>
      {tall ? (
        <mesh position={[0, 0.68, 0]}>
          <cylinderGeometry args={[0.035, 0.05, 0.52, 10]} />
          <meshStandardMaterial color="#4A3428" roughness={0.7} />
        </mesh>
      ) : null}
      <mesh position={[0, leafY, 0]}>
        <icosahedronGeometry args={[tall ? 0.28 : 0.26, 0]} />
        <meshStandardMaterial color="#245A32" roughness={0.78} />
      </mesh>
      <mesh position={[0.12, leafY + 0.16, 0.08]}>
        <icosahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial color="#347844" roughness={0.74} />
      </mesh>
      <mesh position={[-0.12, leafY + 0.12, -0.1]}>
        <icosahedronGeometry args={[0.14, 0]} />
        <meshStandardMaterial color="#1C4A28" roughness={0.8} />
      </mesh>
      <mesh position={[0.04, leafY + 0.22, -0.12]}>
        <icosahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color="#2E6A38" roughness={0.76} />
      </mesh>
      {[0, 1.05, 2.1, 3.2].map((angle) => (
        <mesh
          key={angle}
          position={[
            Math.sin(angle) * 0.14,
            leafY + 0.08,
            Math.cos(angle) * 0.14,
          ]}
          rotation={[0.85, angle, 0.15]}
        >
          <coneGeometry args={[0.07, 0.26, 8]} />
          <meshStandardMaterial color="#2A6840" roughness={0.72} />
        </mesh>
      ))}
    </group>
  );
}

function Bench({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[-0.58, 0.16, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.32, 10]} />
        <meshStandardMaterial
          color={MUSEUM.trim}
          metalness={0.45}
          roughness={0.32}
        />
      </mesh>
      <mesh position={[0.58, 0.16, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.32, 10]} />
        <meshStandardMaterial
          color={MUSEUM.trim}
          metalness={0.45}
          roughness={0.32}
        />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.38, 0.05, 0.42]} />
        <meshStandardMaterial
          color="#3A322C"
          roughness={0.48}
          metalness={0.08}
        />
      </mesh>
      {[-0.16, 0, 0.16].map((z) => (
        <mesh key={z} position={[0, 0.35, z]}>
          <boxGeometry args={[1.32, 0.032, 0.1]} />
          <meshStandardMaterial color="#5A4A3E" roughness={0.58} />
        </mesh>
      ))}
    </group>
  );
}

function Stanchion({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 0.08, 16]} />
        <meshStandardMaterial
          color={MUSEUM.pedestal}
          metalness={0.42}
          roughness={0.32}
        />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.05, 12]} />
        <meshStandardMaterial
          color={MUSEUM.trim}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.022, 0.03, 0.82, 12]} />
        <meshStandardMaterial
          color={MUSEUM.primary}
          metalness={0.72}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.04, 12]} />
        <meshStandardMaterial
          color={MUSEUM.trim}
          metalness={0.68}
          roughness={0.22}
        />
      </mesh>
      <mesh position={[0, 0.96, 0]}>
        <sphereGeometry args={[0.052, 16, 14]} />
        <meshStandardMaterial
          color={MUSEUM.primary}
          metalness={0.75}
          roughness={0.16}
        />
      </mesh>
    </group>
  );
}

function VelvetRope({
  x1,
  y,
  z1,
  x2,
  z2,
}: {
  x1: number;
  y: number;
  z1: number;
  x2: number;
  z2: number;
}) {
  const curve = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(x1, y, z1),
        new Vector3(
          x1 + (x2 - x1) * 0.28,
          y - 0.12,
          z1 + (z2 - z1) * 0.28,
        ),
        new Vector3((x1 + x2) / 2, y - 0.18, (z1 + z2) / 2),
        new Vector3(
          x1 + (x2 - x1) * 0.72,
          y - 0.12,
          z1 + (z2 - z1) * 0.72,
        ),
        new Vector3(x2, y, z2),
      ]),
    [x1, y, z1, x2, z2],
  );
  return (
    <mesh>
      <tubeGeometry args={[curve, 28, 0.02, 8, false]} />
      <meshStandardMaterial color="#4A121C" roughness={0.74} />
    </mesh>
  );
}

function SideRope({
  x,
  y,
  z,
  look,
}: {
  x: number;
  y: number;
  z: number;
  look: 1 | -1;
}) {
  const z1 = z - look * 2.15;
  const z2 = z + look * 2.15;
  const ropeY = y + 0.92;
  return (
    <group>
      <Stanchion position={[x, y, z1]} />
      <Stanchion position={[x, y, z2]} />
      <VelvetRope x1={x} y={ropeY} z1={z1} x2={x} z2={z2} />
    </group>
  );
}

function InfoDesk({
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
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[1.68, 0.84, 0.58]} />
        <meshStandardMaterial color={theme.frame} roughness={0.48} />
      </mesh>
      <mesh position={[0, 0.08, 0.3]}>
        <boxGeometry args={[1.5, 0.12, 0.02]} />
        <meshStandardMaterial color="#1A1612" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.86, 0.04]}>
        <boxGeometry args={[1.78, 0.06, 0.7]} />
        <meshStandardMaterial
          color={theme.trim}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[-0.4, 1.02, 0.08]}>
        <cylinderGeometry args={[0.018, 0.03, 0.16, 8]} />
        <meshStandardMaterial color="#2A3036" metalness={0.5} />
      </mesh>
      <mesh position={[-0.4, 1.22, 0.04]} rotation={[-0.38, 0, 0]}>
        <boxGeometry args={[0.46, 0.3, 0.03]} />
        <meshStandardMaterial
          color="#12181E"
          emissive={theme.accent}
          emissiveIntensity={0.22}
        />
      </mesh>
      <mesh position={[-0.4, 1.28, 0.055]} rotation={[-0.38, 0, 0]}>
        <boxGeometry args={[0.32, 0.035, 0.008]} />
        <meshStandardMaterial
          color={theme.light}
          emissive={theme.light}
          emissiveIntensity={0.45}
        />
      </mesh>
      <mesh position={[0.46, 0.94, 0.12]}>
        <boxGeometry args={[0.26, 0.03, 0.18]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.72} />
      </mesh>
      <mesh position={[0.46, 0.98, 0.12]}>
        <boxGeometry args={[0.22, 0.04, 0.14]} />
        <meshStandardMaterial color="#F4E8D4" roughness={0.68} />
      </mesh>
    </group>
  );
}

function Telescope({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Pedestal position={[0, 0, 0]} height={0.55} />
      <mesh position={[0, 0.68, 0]}>
        <boxGeometry args={[0.28, 0.08, 0.22]} />
        <meshStandardMaterial color="#4A3428" roughness={0.55} />
      </mesh>
      {[-0.1, 0.1].map((x) => (
        <mesh
          key={x}
          position={[x, 0.88, 0.02]}
          rotation={[0.12, 0, x > 0 ? -0.28 : 0.28]}
        >
          <cylinderGeometry args={[0.016, 0.02, 0.38, 10]} />
          <meshStandardMaterial
            color="#8A6A48"
            metalness={0.35}
            roughness={0.4}
          />
        </mesh>
      ))}
      <mesh position={[0, 1.02, 0.04]}>
        <sphereGeometry args={[0.055, 14, 12]} />
        <meshStandardMaterial
          color="#C4A574"
          metalness={0.7}
          roughness={0.22}
        />
      </mesh>
      <group position={[0, 1.08, 0.12]} rotation={[0.52, 0.1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.092, 0.82, 16]} />
          <meshStandardMaterial
            color="#B8C0C8"
            metalness={0.62}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.068, 0.068, 0.04, 16]} />
          <meshStandardMaterial
            color="#C4A574"
            metalness={0.72}
            roughness={0.18}
          />
        </mesh>
        <mesh position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.082, 0.082, 0.04, 16]} />
          <meshStandardMaterial
            color="#C4A574"
            metalness={0.72}
            roughness={0.18}
          />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.1, 0.096, 0.12, 16]} />
          <meshStandardMaterial
            color="#9AA4AC"
            metalness={0.55}
            roughness={0.24}
          />
        </mesh>
        <mesh position={[0, 0.46, 0]}>
          <cylinderGeometry args={[0.078, 0.078, 0.014, 16]} />
          <meshStandardMaterial
            color="#152028"
            metalness={0.88}
            roughness={0.08}
          />
        </mesh>
        <mesh position={[0, -0.46, 0]}>
          <cylinderGeometry args={[0.026, 0.034, 0.14, 12]} />
          <meshStandardMaterial
            color="#6A7078"
            metalness={0.6}
            roughness={0.26}
          />
        </mesh>
        <mesh position={[0.07, 0.08, 0]} rotation={[0.08, 0, 0.35]}>
          <cylinderGeometry args={[0.016, 0.02, 0.22, 10]} />
          <meshStandardMaterial
            color="#8A9098"
            metalness={0.58}
            roughness={0.28}
          />
        </mesh>
      </group>
    </group>
  );
}

function AbstractStack({
  position,
  theme,
}: {
  position: [number, number, number];
  theme: GalleryTheme;
}) {
  return (
    <group position={position}>
      <Pedestal position={[0, 0, 0]} height={0.52} />
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.1, 16]} />
        <meshStandardMaterial
          color={MUSEUM.marbleShade}
          roughness={0.38}
        />
      </mesh>
      <mesh position={[0, 0.92, 0]} rotation={[0, 0.35, 0]}>
        <boxGeometry args={[0.28, 0.28, 0.28]} />
        <meshStandardMaterial
          color={theme.frame}
          metalness={0.18}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, 1.18, 0]} rotation={[0.2, 0.55, 0.1]}>
        <torusGeometry args={[0.14, 0.04, 10, 24]} />
        <meshStandardMaterial
          color={theme.accent}
          metalness={0.48}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[0, 1.42, 0]} rotation={[0.15, 0.4, 0]}>
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color={theme.light}
          metalness={0.28}
          roughness={0.32}
        />
      </mesh>
    </group>
  );
}

function Molecule({
  position,
  accent,
}: {
  position: [number, number, number];
  accent: string;
}) {
  return (
    <group position={position}>
      <Pedestal position={[0, 0, 0]} height={0.66} />
      <mesh position={[0, 0.86, 0]}>
        <cylinderGeometry args={[0.014, 0.022, 0.16, 8]} />
        <meshStandardMaterial color="#C8D0D8" metalness={0.5} />
      </mesh>
      <mesh position={[0, 1.14, 0]}>
        <sphereGeometry args={[0.13, 16, 14]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.24}
          metalness={0.22}
        />
      </mesh>
      <mesh position={[0.11, 1.26, 0.04]} rotation={[0.4, 0, -0.72]}>
        <cylinderGeometry args={[0.016, 0.016, 0.28, 8]} />
        <meshStandardMaterial color="#C8D0D8" metalness={0.45} />
      </mesh>
      <mesh position={[0.24, 1.38, 0.08]}>
        <sphereGeometry args={[0.085, 14, 12]} />
        <meshStandardMaterial
          color="#E8F4FF"
          roughness={0.26}
          metalness={0.18}
        />
      </mesh>
      <mesh position={[-0.1, 1.24, -0.06]} rotation={[-0.32, 0, 0.68]}>
        <cylinderGeometry args={[0.014, 0.014, 0.24, 8]} />
        <meshStandardMaterial color="#C8D0D8" metalness={0.45} />
      </mesh>
      <mesh position={[-0.2, 1.34, -0.1]}>
        <sphereGeometry args={[0.07, 14, 12]} />
        <meshStandardMaterial color="#E0B848" roughness={0.28} />
      </mesh>
      <mesh position={[0.02, 1.02, 0.12]} rotation={[1.05, 0, 0.15]}>
        <cylinderGeometry args={[0.012, 0.012, 0.2, 8]} />
        <meshStandardMaterial color="#C8D0D8" metalness={0.45} />
      </mesh>
      <mesh position={[0.04, 0.94, 0.22]}>
        <sphereGeometry args={[0.055, 12, 10]} />
        <meshStandardMaterial color="#88C8E0" roughness={0.3} />
      </mesh>
    </group>
  );
}

function Kiosk({
  position,
  theme,
}: {
  position: [number, number, number];
  theme: GalleryTheme;
}) {
  return (
    <group position={position}>
      <Pedestal position={[0, 0, 0]} height={0.7} />
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.28, 10]} />
        <meshStandardMaterial
          color="#2A3038"
          metalness={0.55}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 1.22, 0.02]} rotation={[-0.28, 0, 0]}>
        <boxGeometry args={[0.42, 0.32, 0.04]} />
        <meshStandardMaterial
          color="#121820"
          emissive={theme.accent}
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, 1.28, 0.04]} rotation={[-0.28, 0, 0]}>
        <boxGeometry args={[0.28, 0.04, 0.008]} />
        <meshStandardMaterial
          color={theme.light}
          emissive={theme.light}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

function Crystal({
  position,
  theme,
}: {
  position: [number, number, number];
  theme: GalleryTheme;
}) {
  return (
    <group position={position}>
      <Pedestal position={[0, 0, 0]} height={0.58} />
      <mesh position={[0, 0.92, 0]} rotation={[0, 0.4, 0.12]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color={theme.accent}
          emissive={theme.accent}
          emissiveIntensity={0.4}
          metalness={0.35}
          roughness={0.18}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[0, 1.14, 0]} rotation={[0.2, 0.8, 0]}>
        <octahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial
          color={theme.light}
          emissive={theme.light}
          emissiveIntensity={0.35}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

function wallRotation(sign: number): number {
  return sign < 0 ? Math.PI / 2 : -Math.PI / 2;
}

/** Keep floor props clear of the center runner and the doorway. */
const FLOOR_OFF = 2.72;
const CORNER_OFF = 3.35;
/**
 * Wall cards are 6.4m along Z and centered on the room.
 * Anything on the content wall must sit past this so it does not cover the frame.
 */
const END_OFF = 4.22;

function FarDoorFlank({
  cx,
  cy,
  cz,
  look,
  halfD,
}: {
  cx: number;
  cy: number;
  cz: number;
  look: 1 | -1;
  halfD: number;
}) {
  const plantZ = cz + look * (halfD - 0.36);
  const leftSign = look;
  return (
    <group>
      <Plant position={[cx + leftSign * CORNER_OFF, cy, plantZ]} tall />
    </group>
  );
}

function RoomShell({
  cx,
  cy,
  cz,
  look,
  halfD,
  clearLeft = false,
}: {
  cx: number;
  cy: number;
  cz: number;
  look: 1 | -1;
  halfD: number;
  clearLeft?: boolean;
}) {
  const leftSign = look;
  const rightSign = -look;
  const leftRot = wallRotation(leftSign);
  const endBack = cz - look * END_OFF;
  return (
    <group>
      <FarDoorFlank cx={cx} cy={cy} cz={cz} look={look} halfD={halfD} />
      {clearLeft ? null : (
        <SideRope x={cx + leftSign * 2.18} y={cy} z={cz} look={look} />
      )}
      <Plant
        position={[cx + rightSign * 3.72, cy, endBack]}
        tall
      />
      {clearLeft ? null : (
        <Bench
          position={[cx + leftSign * FLOOR_OFF, cy, cz + look * 0.35]}
          rotationY={leftRot}
        />
      )}
    </group>
  );
}

function RoomExhibits({
  room,
  theme,
  look,
}: {
  room: StoryRoom;
  theme: GalleryTheme;
  look: 1 | -1;
}) {
  const [cx, cy, cz] = room.center;
  const halfD = room.size[1] / 2;
  const leftSign = look;
  const sideX = cx + leftSign * FLOOR_OFF;
  const kind: GalleryKind = theme.kind;
  const shell = (
    <RoomShell
      cx={cx}
      cy={cy}
      cz={cz}
      look={look}
      halfD={halfD}
      clearLeft={kind === "lobby"}
    />
  );

  switch (kind) {
    case "lobby":
      return (
        <group>
          {shell}
          <InfoDesk
            position={[cx + leftSign * 2.4, cy, cz + look * END_OFF]}
            rotationY={look === 1 ? Math.PI : 0}
            theme={theme}
          />
          <MarbleBust
            position={[cx + leftSign * 2.4, cy, cz - look * END_OFF]}
          />
        </group>
      );
    case "history":
      return (
        <group>
          {shell}
          <MarbleBust position={[sideX, cy, cz + look * 1.55]} />
          <Vitrine position={[sideX, cy, cz - look * 1.45]} theme={theme} />
          <Vitrine position={[sideX, cy, cz + look * 2.85]} theme={theme} />
          <ColumnFragment
            position={[cx + leftSign * CORNER_OFF, cy, cz + look * 0.2]}
          />
        </group>
      );
    case "science":
      return (
        <group>
          {shell}
          <Globe position={[sideX, cy, cz + look * 1.45]} />
          <Molecule
            position={[sideX, cy, cz - look * 1.55]}
            accent={theme.accent}
          />
          <Vitrine position={[sideX, cy, cz + look * 2.85]} theme={theme} />
          <Globe position={[cx + leftSign * CORNER_OFF, cy, cz + look * 0.15]} />
        </group>
      );
    case "space":
      return (
        <group>
          {shell}
          <Planet
            position={[sideX, cy, cz + look * 0.15]}
            color="#C47848"
            size={0.3}
            ring
            bands
          />
          <Planet
            position={[sideX, cy, cz + look * 1.7]}
            color="#7A9AD8"
            size={0.22}
            moon
          />
          <Planet
            position={[sideX, cy, cz - look * 1.35]}
            color="#E0C070"
            size={0.2}
            bands
          />
          <Telescope
            position={[cx + leftSign * CORNER_OFF, cy, cz + look * 0.4]}
          />
        </group>
      );
    case "art":
      return (
        <group>
          {shell}
          <Kiosk position={[sideX, cy, cz + look * 1.4]} theme={theme} />
          <AbstractStack
            position={[cx + leftSign * CORNER_OFF, cy, cz - look * 0.2]}
            theme={theme}
          />
          <Vitrine position={[sideX, cy, cz - look * 1.5]} theme={theme} />
        </group>
      );
    case "technology":
      return (
        <group>
          {shell}
          <Statue position={[sideX, cy, cz + look * 1.35]} accent={theme.accent} />
          <Statue
            position={[cx + leftSign * CORNER_OFF, cy, cz - look * 0.15]}
            accent={theme.trim}
          />
          <Vitrine position={[sideX, cy, cz - look * 1.55]} theme={theme} />
          <Vitrine position={[sideX, cy, cz + look * 2.8]} theme={theme} />
        </group>
      );
    case "future":
      return (
        <group>
          <AbstractStack
            position={[cx + 2.8, cy, cz + look * 1.6]}
            theme={theme}
          />
          <Crystal
            position={[cx - 2.8, cy, cz + look * 1.6]}
            theme={theme}
          />
          <Plant position={[cx + 3.2, cy, cz - look * 1.8]} tall />
          <Plant position={[cx - 3.2, cy, cz - look * 1.8]} tall />
        </group>
      );
    default: {
      const _never: never = kind;
      return _never;
    }
  }
}

/** Real-gallery dressing: pedestals, art, cases — not the pitch storyboard. */
export function GalleryFurnishings() {
  const visibleFloor = useVisibleMuseumFloor();
  return (
    <group>
      {STORY_ROOMS.map((room, index) => {
        if (room.id === "complete") return null;
        if (room.floor !== visibleFloor) return null;
        const theme = getGalleryTheme(room.id);
        const look = roomLookSign(index);
        return (
          <RoomExhibits
            key={`exhibits-${room.id}`}
            room={room}
            theme={theme}
            look={look}
          />
        );
      })}
    </group>
  );
}
