import logo from "@/assets/logo.png";
import {
  getFinishCredits,
  useFinishCredits,
} from "@/journey/opening/finishCreditsStore";
import {
  getIntroLogoReveal,
  useIntroLogoReveal,
} from "@/journey/opening/introLogoStore";
import { INTRO_LOGO_FRAME } from "@/journey/path/walkPath";
import { useTexture } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  DynamicDrawUsage,
  Euler,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  MathUtils,
  Matrix4,
  MeshBasicMaterial,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  PointLight,
  Quaternion,
  Raycaster,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  type Mesh,
} from "three";

useLoader.preload(TextureLoader, logo);

import { MUSEUM } from "@/journey/theme/museumPalette";

const PRIMARY = MUSEUM.primary;
/** Desktop shatter grid. Phones use a lighter grid for FPS. */
const GRID_DESKTOP = 64;
const GRID_MOBILE = 32;
const LOGO_SCALE = 1.4;

const _ndc = new Vector2();
const _hit = new Vector3();
const _wallNormal = new Vector3(0, 0, 1);
const _wallPlane = new Plane();
const _raycaster = new Raycaster();

/** Map JourneyHUD #journey-hud-logo into wall-plane world space. */
function hudLogoWorldTarget(
  camera: PerspectiveCamera,
  canvas: HTMLCanvasElement,
  introSize: number,
  wallZ: number,
): { x: number; y: number; z: number; scale: number } | null {
  const el = document.getElementById("journey-hud-logo");
  if (!el) return null;
  const canvasRect = canvas.getBoundingClientRect();
  if (canvasRect.width < 1 || canvasRect.height < 1) return null;
  const logoRect = el.getBoundingClientRect();
  const cx = logoRect.left + logoRect.width / 2;
  const cy = logoRect.top + logoRect.height / 2;
  _ndc.set(
    ((cx - canvasRect.left) / canvasRect.width) * 2 - 1,
    -((cy - canvasRect.top) / canvasRect.height) * 2 + 1,
  );
  _raycaster.setFromCamera(_ndc, camera);
  _wallPlane.set(_wallNormal, -wallZ);
  if (!_raycaster.ray.intersectPlane(_wallPlane, _hit)) return null;

  const dist = Math.abs(camera.position.z - wallZ);
  const vFov = (camera.fov * Math.PI) / 180;
  const frustumH = 2 * dist * Math.tan(vFov / 2);
  const worldPerPx = frustumH / canvasRect.height;
  const targetWorld = Math.max(logoRect.height, logoRect.width) * worldPerPx;
  const scale = Math.max(0.02, targetWorld / introSize);
  return { x: _hit.x, y: _hit.y, z: wallZ, scale };
}

type TileData = {
  homeX: number;
  homeY: number;
  ox: number;
  oy: number;
  oz: number;
  rot: number;
  /** 0 at center → 1 at corner - delays outer pieces for liquid flow. */
  delay: number;
};

function buildTiles(
  logoSize: number,
  tileSize: number,
  grid: number,
): TileData[] {
  const count = grid * grid;
  const out: TileData[] = new Array(count);
  const maxR = Math.hypot(logoSize, logoSize) * 0.5;
  const burst = logoSize * 1.35;
  for (let i = 0; i < count; i++) {
    const col = i % grid;
    const row = (i / grid) | 0;
    const homeX = (col + 0.5) * tileSize - logoSize / 2;
    const homeY = logoSize / 2 - (row + 0.5) * tileSize;
    const len = Math.hypot(homeX, homeY) || 1;
    const nx = homeX / len;
    const ny = homeY / len;
    const strength = burst * (0.85 + ((i * 17) % 11) * 0.03);
    out[i] = {
      homeX,
      homeY,
      ox: nx * strength * (1.05 + ((i * 13) % 7) * 0.05),
      oy: ny * strength * (1.05 + ((i * 19) % 5) * 0.06),
      oz: (((i * 23) % 9) - 4) * 0.035 * (strength / burst),
      rot: ((((i * 47) % 50) - 25) * Math.PI) / 180,
      delay: MathUtils.clamp(len / maxR, 0, 1),
    };
  }
  return out;
}

/** Soft liquid ease - slow start, fluid middle, firm settle. */
function liquidEase(t: number): number {
  const x = MathUtils.clamp(t, 0, 1);
  // smootherstep
  const s = x * x * x * (x * (x * 6 - 15) + 10);
  return s;
}

/**
 * End-wall NavMe logo - 64×64 pieces burst outward then flow back in a
 * liquid join (no circular orbit). Finish credits fly it into the JourneyHUD
 * mark and fade it out so only the HUD logo remains.
 */
export function EndWallLogos() {
  const reveal = useIntroLogoReveal();
  const credits = useFinishCredits();
  const { size: viewSize, camera, gl } = useThree();
  const groupRef = useRef<Group>(null);
  const instancedRef = useRef<InstancedMesh>(null);
  const solidRef = useRef<Mesh>(null);
  const solidMatRef = useRef<MeshBasicMaterial>(null);
  const lightRef = useRef<PointLight>(null);
  const texture = useTexture(logo);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  texture.premultiplyAlpha = false;

  const grid =
    viewSize.width > 0 && viewSize.width < 900 ? GRID_MOBILE : GRID_DESKTOP;
  const tileCount = grid * grid;
  const invGrid = 1 / grid;

  const size = INTRO_LOGO_FRAME.size * LOGO_SCALE;
  const tileSize = size / grid;
  const [baseX, baseY, baseZ] = INTRO_LOGO_FRAME.position;
  const wallZ = INTRO_LOGO_FRAME.wallZ;

  const tiles = useMemo(
    () => buildTiles(size, tileSize, grid),
    [size, tileSize, grid],
  );

  const { geometry, material, uvAttr } = useMemo(() => {
    const geo = new PlaneGeometry(tileSize, tileSize);
    const uvOffsets = new Float32Array(tileCount * 2);
    for (let i = 0; i < tileCount; i++) {
      const col = i % grid;
      const row = (i / grid) | 0;
      uvOffsets[i * 2] = col * invGrid;
      uvOffsets[i * 2 + 1] = 1 - (row + 1) * invGrid;
    }
    const attr = new InstancedBufferAttribute(uvOffsets, 2);
    attr.setUsage(DynamicDrawUsage);
    geo.setAttribute("instanceUv", attr);

    const mat = new ShaderMaterial({
      uniforms: {
        map: { value: texture },
        opacity: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      vertexShader: /* glsl */ `
        attribute vec2 instanceUv;
        varying vec2 vLogoUv;
        void main() {
          vLogoUv = instanceUv + uv * ${invGrid.toFixed(8)};
          vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D map;
        uniform float opacity;
        varying vec2 vLogoUv;
        void main() {
          vec4 color = texture2D(map, vLogoUv);
          if (color.a < 0.06) discard;
          gl_FragColor = vec4(color.rgb, color.a * opacity);
        }
      `,
    });

    return { geometry: geo, material: mat, uvAttr: attr };
  }, [texture, tileSize, tileCount, grid, invGrid]);

  const scratch = useMemo(
    () => ({
      mat: new Matrix4(),
      pos: new Vector3(),
      quat: new Quaternion(),
      scale: new Vector3(1, 1, 1),
      euler: new Euler(),
    }),
    [],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      uvAttr.dispose?.();
    };
  }, [geometry, material, uvAttr]);

  useFrame((_, delta) => {
    const g = groupRef.current;
    const mesh = instancedRef.current;
    if (!g) return;

    const raw = MathUtils.clamp(getIntroLogoReveal(), 0, 1);
    const c = getFinishCredits();

    const hud =
      camera instanceof PerspectiveCamera
        ? hudLogoWorldTarget(camera, gl.domElement, size, wallZ)
        : null;
    const parkX = hud?.x ?? baseX;
    const parkY = hud?.y ?? baseY + 1.2;
    const parkZ = hud?.z ?? wallZ;
    const finishS = hud?.scale ?? 0.06;

    // Ease toward HUD: settle late so it lands on the mark, then fade out.
    const fly = liquidEase(c);
    const targetScale = MathUtils.lerp(1, finishS, fly);
    const scaleRate = c > 0.85 ? 16 : 9;
    const s = MathUtils.damp(
      g.scale.x,
      Math.max(0.001, targetScale),
      scaleRate,
      delta,
    );
    g.scale.setScalar(s);

    const targetX = MathUtils.lerp(baseX, parkX, fly);
    const targetY = MathUtils.lerp(baseY, parkY, fly);
    const targetZ = MathUtils.lerp(baseZ, parkZ, fly);
    const posRate = c > 0.85 ? 14 : 7;
    g.position.x = MathUtils.damp(g.position.x, targetX, posRate, delta);
    g.position.y = MathUtils.damp(g.position.y, targetY, posRate, delta);
    g.position.z = MathUtils.damp(g.position.z, targetZ, posRate, delta);

    // Hand off to JourneyHUD logo: fade in the last stretch, then hide.
    const fade =
      c < 0.72 ? 1 : MathUtils.clamp(1 - (c - 0.72) / 0.28, 0, 1);
    const show = (raw > 0.002 || c > 0.02) && fade > 0.03;
    g.visible = show;

    const solidCut = raw >= 0.94 || c > 0.02;
    if (mesh) {
      mesh.visible = !solidCut && c < 0.05;
      if (mesh.visible) {
        const { mat, pos, quat, scale, euler } = scratch;
        const stagger = 0.52;
        for (let i = 0; i < tileCount; i++) {
          const tile = tiles[i];
          const local = MathUtils.clamp(
            (raw - tile.delay * stagger) / (1 - stagger * 0.92),
            0,
            1,
          );
          const t = liquidEase(local);
          const lock = t >= 0.97 ? 1 : t;
          const inv = 1 - lock;

          pos.set(
            tile.homeX + tile.ox * inv,
            tile.homeY + tile.oy * inv,
            0.02 + tile.oz * inv,
          );
          euler.set(0, 0, lock >= 1 ? 0 : tile.rot * inv * (1 - lock * 0.5));
          quat.setFromEuler(euler);
          const pop = lock >= 1 ? 1 : 0.35 + 0.65 * lock;
          scale.set(pop, pop, 1);
          mat.compose(pos, quat, scale);
          mesh.setMatrixAt(i, mat);
        }
        mesh.instanceMatrix.needsUpdate = true;
      }
    }

    if (solidRef.current) {
      solidRef.current.visible = solidCut && show;
      if (solidMatRef.current) {
        const want = solidCut ? fade : 0;
        solidMatRef.current.opacity = MathUtils.damp(
          solidMatRef.current.opacity,
          want,
          18,
          delta,
        );
      }
    }

    if (lightRef.current) {
      lightRef.current.intensity = MathUtils.damp(
        lightRef.current.intensity,
        show
          ? 0.25 + liquidEase(raw) * 1.4 * (1 - c * 0.85) * fade
          : 0,
        10,
        delta,
      );
    }
  });

  void reveal;
  void credits;

  return (
    <group
      ref={groupRef}
      position={[baseX, baseY, baseZ]}
      rotation={[0, Math.PI, 0]}
      scale={0.001}
    >
      <instancedMesh
        key={`logo-grid-${grid}`}
        ref={instancedRef}
        args={[geometry, material, tileCount]}
        frustumCulled={false}
        renderOrder={4}
      />

      <mesh ref={solidRef} position={[0, 0, 0.02]} renderOrder={5} visible={false}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          ref={solidMatRef}
          map={texture}
          transparent
          opacity={0}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        ref={lightRef}
        position={[0, 0, 1.4]}
        intensity={0.2}
        distance={8}
        decay={2}
        color={PRIMARY}
      />
    </group>
  );
}
