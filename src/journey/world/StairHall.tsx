import galleryPlaqueFontUrl from "@/assets/fonts/Outfit-Black.ttf?url";
import {
  LANDING_SIZE,
  ROOM_WALL_H,
  STAIR_GAP,
  STAIR_WELL_DEPTH,
  STAIR_WIDTH,
  STEP_RISE,
  STEP_RUN,
  STEPS_PER_LEG,
  type StairHallSpec,
} from "@/journey/path/walkPath";
import { MUSEUM } from "@/journey/theme/museumPalette";
import { Text } from "@react-three/drei";
import { Suspense } from "react";

const TREAD_A = "#4A3E32";
const TREAD_B = "#3A3228";
const RISER = "#2A241E";
const NOSING = "#6A5A48";
const RAIL = "#6B5A48";

const WELL_W = STAIR_WIDTH * 2 + STAIR_GAP + 1.15;

function StairFlight({
  x,
  startZ,
  startY,
  zDir,
}: {
  x: number;
  startZ: number;
  startY: number;
  zDir: 1 | -1;
}) {
  const flightLen = STEPS_PER_LEG * STEP_RUN;
  const midZ = startZ + zDir * flightLen * 0.5;
  const midY = startY + (STEPS_PER_LEG * STEP_RISE) / 2;
  const slope = Math.atan2(STEPS_PER_LEG * STEP_RISE, flightLen);
  const handLen = Math.hypot(flightLen, STEPS_PER_LEG * STEP_RISE);

  return (
    <group>
      {Array.from({ length: STEPS_PER_LEG }, (_, i) => {
        const y = startY + (i + 0.5) * STEP_RISE;
        const z = startZ + zDir * (i + 0.5) * STEP_RUN;
        const tread = i % 2 === 0 ? TREAD_A : TREAD_B;
        return (
          <group key={`step-${i}`}>
            <mesh position={[x, y, z]} receiveShadow>
              <boxGeometry args={[STAIR_WIDTH, STEP_RISE, STEP_RUN]} />
              <meshStandardMaterial
                color={tread}
                roughness={0.72}
                metalness={0.04}
              />
            </mesh>
            <mesh position={[x, y, z + zDir * STEP_RUN * 0.46]}>
              <boxGeometry args={[STAIR_WIDTH, STEP_RISE, 0.05]} />
              <meshStandardMaterial color={RISER} roughness={0.64} />
            </mesh>
            <mesh
              position={[x, y + STEP_RISE * 0.5, z - zDir * STEP_RUN * 0.34]}
            >
              <boxGeometry args={[STAIR_WIDTH + 0.04, 0.05, 0.08]} />
              <meshStandardMaterial color={NOSING} roughness={0.32} />
            </mesh>
          </group>
        );
      })}
      {([-1, 1] as const).map((side) => (
        <group key={`rail-${side}`}>
          <mesh
            position={[x + side * (STAIR_WIDTH / 2 + 0.05), midY + 0.85, midZ]}
          >
            <boxGeometry args={[0.07, STEPS_PER_LEG * STEP_RISE + 0.35, flightLen]} />
            <meshStandardMaterial
              color={RAIL}
              roughness={0.4}
              metalness={0.24}
            />
          </mesh>
          <mesh
            position={[x + side * (STAIR_WIDTH / 2 + 0.05), midY + 1.08, midZ]}
            rotation={[-zDir * slope, 0, 0]}
          >
            <boxGeometry args={[0.06, 0.06, handLen]} />
            <meshStandardMaterial
              color={RAIL}
              roughness={0.3}
              metalness={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function StairHall({ hall }: { hall: StairHallSpec }) {
  const midZ = (hall.hallZ0 + hall.hallZ1) / 2;
  const wellH = hall.topY - hall.bottomY + ROOM_WALL_H;
  const wellCenterY = hall.bottomY + wellH / 2;
  const wellBackZ = hall.landingZ + hall.zDir * (LANDING_SIZE / 2 + 0.1);

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[hall.anchorX, hall.bottomY + 0.02, hall.doorZ + hall.zDir * 0.35]}
        receiveShadow
      >
        <planeGeometry args={[WELL_W, 0.9]} />
        <meshStandardMaterial color={MUSEUM.floor} roughness={0.9} />
      </mesh>

      <mesh position={[hall.anchorX, hall.midY + 0.07, hall.landingZ]} receiveShadow>
        <boxGeometry args={[WELL_W - 0.35, 0.14, LANDING_SIZE]} />
        <meshStandardMaterial color="#D8C4A4" roughness={0.82} />
      </mesh>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[hall.anchorX, hall.topY + 0.03, hall.doorZ + hall.zDir * 0.35]}
        receiveShadow
      >
        <planeGeometry args={[WELL_W, 0.95]} />
        <meshStandardMaterial color={MUSEUM.floor} roughness={0.88} />
      </mesh>

      <StairFlight
        x={hall.flight1X}
        startZ={hall.flightStartZ}
        startY={hall.bottomY}
        zDir={hall.zDir}
      />
      <StairFlight
        x={hall.flight2X}
        startZ={hall.flightEndZ}
        startY={hall.midY}
        zDir={hall.zDir === 1 ? -1 : 1}
      />

      <mesh position={[hall.anchorX - WELL_W / 2, wellCenterY, midZ]}>
        <boxGeometry args={[0.22, wellH, STAIR_WELL_DEPTH]} />
        <meshLambertMaterial
          color={MUSEUM.wall}
          emissive={MUSEUM.wallEmissive}
          emissiveIntensity={0.16}
        />
      </mesh>
      <mesh position={[hall.anchorX + WELL_W / 2, wellCenterY, midZ]}>
        <boxGeometry args={[0.22, wellH, STAIR_WELL_DEPTH]} />
        <meshLambertMaterial
          color={MUSEUM.wall}
          emissive={MUSEUM.wallEmissive}
          emissiveIntensity={0.16}
        />
      </mesh>
      <mesh position={[hall.anchorX, wellCenterY, wellBackZ]}>
        <boxGeometry args={[WELL_W, wellH, 0.22]} />
        <meshLambertMaterial
          color={MUSEUM.wall}
          emissive={MUSEUM.wallEmissive}
          emissiveIntensity={0.14}
        />
      </mesh>
      <mesh position={[hall.anchorX, hall.topY + ROOM_WALL_H, midZ]}>
        <boxGeometry args={[WELL_W + 0.2, 0.14, STAIR_WELL_DEPTH + 0.2]} />
        <meshStandardMaterial
          color={MUSEUM.ceiling}
          roughness={0.8}
          emissive={MUSEUM.ceilingEmissive}
          emissiveIntensity={0.2}
        />
      </mesh>

      <pointLight
        position={[hall.anchorX, hall.midY + 2.15, hall.landingZ]}
        intensity={6.2}
        distance={11}
        color={MUSEUM.light}
      />

      <mesh
        position={[
          hall.anchorX,
          hall.midY + 1.25,
          hall.landingZ + hall.zDir * 0.7,
        ]}
      >
        <boxGeometry args={[2.4, 0.36, 0.08]} />
        <meshStandardMaterial
          color={MUSEUM.trim}
          metalness={0.35}
          roughness={0.4}
          emissive={MUSEUM.primary}
          emissiveIntensity={0.28}
        />
      </mesh>
      <Suspense fallback={null}>
        <Text
          font={galleryPlaqueFontUrl}
          position={[
            hall.anchorX,
            hall.midY + 1.25,
            hall.landingZ + hall.zDir * 0.76,
          ]}
          fontSize={0.12}
          color="#FFF8F0"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.035}
        >
          {hall.label.toUpperCase()}
        </Text>
      </Suspense>
    </group>
  );
}
