import logoUrl from "@/assets/logo.png";
import { getActiveNode } from "@/journey/constants/nodes";
import { Html } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { createLinearRouteCurve } from "@/journey/path/routeCurve";
import {
  finishRobotStickForAspect,
  isMuralCompactViewport,
  isStairClimbY,
  ROUTE_LENGTH_M,
  snapStairY,
  STEP_RISE,
  WALK_WAYPOINTS,
} from "@/journey/path/walkPath";
import { setNodeScreenAnchor } from "@/journey/overlays/nodeScreenAnchor";
import {
  getFinishCredits,
} from "@/journey/opening/finishCreditsStore";
import {
  useActiveNodeId,
  useJourneyProgressStore,
} from "@/journey/scroll/useJourneyProgress";
import {
  getTravelSegment,
  isStraightSkipHop,
} from "@/journey/scroll/travelSegmentStore";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  FrontSide,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  type Material,
  type Object3D,
  type Texture,
} from "three";

useLoader.preload(TextureLoader, logoUrl);

/** Matches AR NavCompanion brand + shell tones. */
const NAVME_NAVY = 0x0a1a3f;
const NAVME_CYAN = 0x4dd8ff;
const SHELL_WHITE = 0xf7f9fc;
const SHELL_GREY = 0xc9cfdb;
const JOINT_GREY = 0x8d95a6;
const SCREEN_BLACK = 0x080b11;
const GRILLE_COPPER = 0xb5772e;
const JET_HOT = 0xffb454;
const JET_COOL = 0xff4400;
const JET_CORE_HOT = 0xfff0c0;
const JET_CORE_COOL = 0xff9020;

const BODY_Y = 0.58;
const BODY_R = 0.14;
const BODY_SY = 1.14;
const BODY_SZ = 0.94;
const HEAD_R = 0.205;
const HEAD_SY = 0.94;
const HEAD_SZ = 0.9;
const VISOR_PHI = 2.0;
const VISOR_THETA_START = 0.92;
const VISOR_THETA = 1.24;
const LIGHT_X = -0.32;
const LIGHT_Y = 0.87;
const LIGHT_Z = 0.38;
const HOVER_BOB = 0.025;
const HOVER_RATE = 0.55;

const EYE_BITS = [
  "01111110",
  "11111111",
  "11000011",
  "11011011",
  "11011011",
  "11000011",
  "11111111",
  "01111110",
];
const SMILE_LIFT = [2.6, 1.6, 0.85, 0.3, 0, 0, 0, 0.3, 0.85, 1.6, 2.6];

/** Exact AR companion tagline - shown on the robot's back. */
const COMPANION_TAGLINE = "AR Museum Companion";

const INTRO_CLOUD_TEXT = "Hey! I'm Nav, your AR museum guide.";

const INTRO_SHOW_DELAY_MS = 480;
const INTRO_VISIBLE_MS = 5000;

/** Speech cloud beside the robot head - left on mobile, right on desktop. */
function CompanionIntroCloud({
  visible,
  botScale,
  side,
}: {
  visible: boolean;
  botScale: number;
  side: "left" | "right";
}) {
  if (!visible) return null;
  const s = Math.max(0.4, botScale);
  const headY = (BODY_Y + 0.34) * s;
  const headOffset = (0.22 + 0.28) * s + 0.06;
  const x = side === "left" ? -headOffset : headOffset;
  return (
    <Html
      position={[x, headY, 0.2 * s]}
      center
      distanceFactor={Math.max(2.85, 3.35 * s)}
      style={{ pointerEvents: "none" }}
      zIndexRange={[160, 0]}
    >
      <div
        className={`nav-intro-cloud nav-intro-cloud--${side}`}
        role="status"
        aria-live="polite"
        aria-label={INTRO_CLOUD_TEXT}
      >
        <p className="nav-intro-cloud__text">{INTRO_CLOUD_TEXT}</p>
        <span className="nav-intro-cloud__tail" aria-hidden />
      </div>
    </Html>
  );
}

function shade(geo: BufferGeometry, color: number, amount = 0.36): BufferGeometry {
  const pos = geo.getAttribute("position") as BufferAttribute | undefined;
  const nrm = geo.getAttribute("normal") as BufferAttribute | undefined;
  if (!pos || !nrm) return geo;
  const base = new Color(color);
  const rgb = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const d =
      nrm.getX(i) * LIGHT_X + nrm.getY(i) * LIGHT_Y + nrm.getZ(i) * LIGHT_Z;
    const k = 1 - amount * (1 - (d * 0.5 + 0.5));
    rgb[i * 3] = base.r * k;
    rgb[i * 3 + 1] = base.g * k;
    rgb[i * 3 + 2] = base.b * k;
  }
  geo.setAttribute("color", new BufferAttribute(rgb, 3));
  return geo;
}

function makeFaceTexture(): CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const w = 512;
  const h = 340;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const roundRect = (x: number, y: number, rw: number, rh: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + rw - r, y);
    ctx.quadraticCurveTo(x + rw, y, x + rw, y + r);
    ctx.lineTo(x + rw, y + rh - r);
    ctx.quadraticCurveTo(x + rw, y + rh, x + rw - r, y + rh);
    ctx.lineTo(x + r, y + rh);
    ctx.quadraticCurveTo(x, y + rh, x, y + rh - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  ctx.clearRect(0, 0, w, h);
  roundRect(6, 6, w - 12, h - 12, 74);
  ctx.fillStyle = "#080b11";
  ctx.fill();
  ctx.lineWidth = 9;
  ctx.strokeStyle = "#232b3a";
  ctx.stroke();

  const cell = 15;
  const eyeW = EYE_BITS[0].length * cell;
  const eyeH = EYE_BITS.length * cell;
  ctx.save();
  ctx.shadowColor = "rgba(77, 216, 255, 0.9)";
  ctx.shadowBlur = 16;
  ctx.fillStyle = "#8aeaff";
  for (const cx of [161, 351]) {
    const ox = cx - eyeW / 2;
    const oy = 143 - eyeH / 2;
    for (let r = 0; r < EYE_BITS.length; r++) {
      for (let c = 0; c < EYE_BITS[r].length; c++) {
        if (EYE_BITS[r][c] !== "1") continue;
        roundRect(ox + c * cell, oy + r * cell, cell - 2.5, cell - 2.5, 3);
        ctx.fill();
      }
    }
  }
  ctx.restore();

  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

function makeNameplateTexture(tagline: string): CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const w = 512;
  const h = 288;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const roundRect = (x: number, y: number, rw: number, rh: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + rw - r, y);
    ctx.quadraticCurveTo(x + rw, y, x + rw, y + r);
    ctx.lineTo(x + rw, y + rh - r);
    ctx.quadraticCurveTo(x + rw, y + rh, x + rw - r, y + rh);
    ctx.lineTo(x + r, y + rh);
    ctx.quadraticCurveTo(x, y + rh, x, y + rh - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  ctx.clearRect(0, 0, w, h);
  roundRect(10, 10, w - 20, h - 20, 36);
  ctx.fillStyle = "#0a1a3f";
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#4dd8ff";
  ctx.stroke();
  roundRect(28, 28, w - 56, h - 56, 26);
  ctx.fillStyle = "#12264f";
  ctx.fill();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#8aeaff";
  ctx.font = "800 36px Outfit, ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(tagline, w / 2, h / 2, w - 90);

  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

type RobotParts = {
  group: Group;
  torso: Group;
  head: Group;
  armL: Group;
  armR: Group;
  mouth: Group;
  flame: Group;
  coreMat: MeshBasicMaterial;
  geoms: BufferGeometry[];
  mats: Material[];
  textures: CanvasTexture[];
};

function createRobot(logoMap: Texture): RobotParts {
  const geoms: BufferGeometry[] = [];
  const mats: Material[] = [];
  const textures: CanvasTexture[] = [];

  const shellMat = new MeshBasicMaterial({
    vertexColors: true,
    side: FrontSide,
    fog: false,
    depthTest: false,
    depthWrite: true,
  });
  const coreMat = new MeshBasicMaterial({
    color: NAVME_CYAN,
    side: FrontSide,
    fog: false,
    depthTest: false,
    depthWrite: true,
  });
  mats.push(shellMat, coreMat);

  const jetMat = new MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    side: DoubleSide,
    depthTest: false,
    depthWrite: false,
    fog: false,
  });
  mats.push(jetMat);

  const keep = <T extends BufferGeometry>(g: T): T => {
    geoms.push(g);
    return g;
  };
  const box = (w: number, h: number, d: number, color: number) =>
    keep(shade(new BoxGeometry(w, h, d), color));
  const cyl = (rt: number, rb: number, h: number, seg: number, color: number) =>
    keep(shade(new CylinderGeometry(rt, rb, h, seg), color));
  const sph = (r: number, w: number, h: number, color: number) =>
    keep(shade(new SphereGeometry(r, w, h), color));

  const meshOf = (geo: BufferGeometry, mat: Material) => {
    const m = new Mesh(geo, mat);
    m.castShadow = false;
    m.receiveShadow = false;
    m.renderOrder = 200;
    return m;
  };

  const jet = (
    radius: number,
    len: number,
    hot: number,
    cool: number,
    alpha: number,
  ) => {
    const g = keep(new ConeGeometry(radius, len, 12, 1, true));
    const pos = g.getAttribute("position") as BufferAttribute;
    const hotColor = new Color(hot);
    const coolColor = new Color(cool);
    const rgba = new Float32Array(pos.count * 4);
    for (let i = 0; i < pos.count; i++) {
      const k = Math.min(1, Math.max(0, pos.getY(i) / len + 0.5));
      rgba[i * 4] = hotColor.r + (coolColor.r - hotColor.r) * k;
      rgba[i * 4 + 1] = hotColor.g + (coolColor.g - hotColor.g) * k;
      rgba[i * 4 + 2] = hotColor.b + (coolColor.b - hotColor.b) * k;
      rgba[i * 4 + 3] = alpha * (1 - k);
    }
    g.setAttribute("color", new BufferAttribute(rgba, 4));
    const m = meshOf(g, jetMat);
    m.rotation.x = Math.PI;
    m.position.y = -len / 2;
    return m;
  };

  const group = new Group();
  group.name = "NavMeGuideBot";
  group.renderOrder = 200;

  const torso = new Group();
  torso.position.y = BODY_Y;
  group.add(torso);

  const pod = meshOf(sph(BODY_R, 20, 16, SHELL_WHITE), shellMat);
  pod.scale.set(1, BODY_SY, BODY_SZ);
  torso.add(pod);

  const yoke = meshOf(cyl(0.1, 0.115, 0.045, 14, SHELL_GREY), shellMat);
  yoke.position.y = 0.075;
  torso.add(yoke);
  const collar = meshOf(cyl(0.055, 0.07, 0.05, 12, JOINT_GREY), shellMat);
  collar.position.y = 0.145;
  torso.add(collar);

  const skirt = meshOf(cyl(0.095, 0.072, 0.05, 16, NAVME_NAVY), shellMat);
  skirt.position.y = -0.155;
  torso.add(skirt);
  const grille = meshOf(cyl(0.062, 0.05, 0.03, 14, GRILLE_COPPER), shellMat);
  grille.position.y = -0.192;
  torso.add(grille);

  const hatch = meshOf(
    keep(
      shade(
        new SphereGeometry(
          BODY_R + 0.003,
          18,
          14,
          -Math.PI / 2 - 0.6,
          1.2,
          1.05,
          1.0,
        ),
        NAVME_NAVY,
      ),
    ),
    shellMat,
  );
  hatch.scale.set(1, BODY_SY, BODY_SZ);
  torso.add(hatch);

  // Chest: NavMe logo only (facing the user)
  logoMap.colorSpace = SRGBColorSpace;
  const logoMat = new MeshBasicMaterial({
    map: logoMap,
    transparent: true,
    side: FrontSide,
    fog: false,
    toneMapped: false,
    depthTest: false,
    depthWrite: true,
  });
  mats.push(logoMat);
  const logoBadge = meshOf(keep(new PlaneGeometry(0.16, 0.16)), logoMat);
  logoBadge.position.set(0, 0.025, BODY_R * BODY_SZ + 0.016);
  logoBadge.renderOrder = 6;
  torso.add(logoBadge);

  // Back: "Smart Navigation Companion" nameplate
  const plateTex = makeNameplateTexture(COMPANION_TAGLINE);
  if (plateTex) {
    textures.push(plateTex);
    const plateMat = new MeshBasicMaterial({
      map: plateTex,
      transparent: true,
      side: FrontSide,
      fog: false,
      depthWrite: false,
    });
    mats.push(plateMat);
    const plate = meshOf(keep(new PlaneGeometry(0.145, 0.082)), plateMat);
    plate.position.set(0, 0.01, -(BODY_R * BODY_SZ + 0.012));
    plate.rotation.y = Math.PI;
    torso.add(plate);
  }

  const flame = new Group();
  flame.position.y = -0.205;
  torso.add(flame);
  flame.add(jet(0.05, 0.15, JET_HOT, JET_COOL, 0.7));
  flame.add(jet(0.022, 0.075, JET_CORE_HOT, JET_CORE_COOL, 0.9));

  const head = new Group();
  head.position.y = 0.325;
  torso.add(head);

  const skull = meshOf(sph(HEAD_R, 22, 18, SHELL_WHITE), shellMat);
  skull.scale.set(1, HEAD_SY, HEAD_SZ);
  head.add(skull);

  const faceTex = makeFaceTexture();
  let visorMat: Material;
  if (faceTex) {
    textures.push(faceTex);
    visorMat = new MeshBasicMaterial({
      map: faceTex,
      transparent: true,
      alphaTest: 0.02,
      side: FrontSide,
      fog: false,
      depthTest: false,
      depthWrite: true,
    });
    mats.push(visorMat);
  } else {
    visorMat = new MeshBasicMaterial({
      color: SCREEN_BLACK,
      fog: false,
      depthTest: false,
      depthWrite: true,
    });
    mats.push(visorMat);
  }
  const visor = meshOf(
    keep(
      new SphereGeometry(
        HEAD_R + 0.004,
        28,
        20,
        Math.PI / 2 - VISOR_PHI / 2,
        VISOR_PHI,
        VISOR_THETA_START,
        VISOR_THETA,
      ),
    ),
    visorMat,
  );
  visor.scale.set(1, HEAD_SY, HEAD_SZ);
  head.add(visor);

  const earGeo = cyl(0.058, 0.058, 0.03, 14, SHELL_GREY);
  const earL = meshOf(earGeo, shellMat);
  earL.position.set(-0.206, -0.02, -0.032);
  earL.rotation.z = Math.PI / 2;
  head.add(earL);
  const earR = meshOf(earGeo, shellMat);
  earR.position.set(0.206, -0.02, -0.032);
  earR.rotation.z = Math.PI / 2;
  head.add(earR);

  const antenna = meshOf(cyl(0.0035, 0.0045, 0.3, 6, JOINT_GREY), shellMat);
  antenna.position.set(0.112, 0.31, -0.045);
  antenna.rotation.z = -0.05;
  head.add(antenna);
  const bead = meshOf(keep(new SphereGeometry(0.011, 8, 6)), coreMat);
  bead.position.set(0.104, 0.462, -0.045);
  head.add(bead);

  const mouth = new Group();
  head.add(mouth);
  const cellGeo = keep(new BoxGeometry(0.017, 0.015, 0.006));
  const mouthR = HEAD_R + 0.012;
  const mid = (SMILE_LIFT.length - 1) / 2;
  const cellPos: Vector3[] = [];
  for (let i = 0; i < SMILE_LIFT.length; i++) {
    const yaw = (i - mid) * 0.1;
    const pitch = -0.36 + SMILE_LIFT[i] * 0.062;
    cellPos.push(
      new Vector3(
        mouthR * Math.sin(yaw) * Math.cos(pitch),
        mouthR * Math.sin(pitch) * HEAD_SY,
        mouthR * Math.cos(yaw) * Math.cos(pitch) * HEAD_SZ,
      ),
    );
  }
  mouth.position.copy(cellPos[mid]);
  const outward = new Vector3(0, 0, 1);
  for (const p of cellPos) {
    const cellMesh = meshOf(cellGeo, coreMat);
    cellMesh.position.copy(p).sub(mouth.position);
    cellMesh.quaternion.setFromUnitVectors(outward, p.clone().normalize());
    mouth.add(cellMesh);
  }

  const shoulderGeo = sph(0.035, 10, 8, JOINT_GREY);
  const upperArmGeo = cyl(0.026, 0.023, 0.115, 10, SHELL_WHITE);
  const elbowGeo = sph(0.028, 10, 8, JOINT_GREY);
  const foreArmGeo = cyl(0.023, 0.021, 0.1, 10, SHELL_WHITE);
  const wristGeo = cyl(0.024, 0.024, 0.018, 10, JOINT_GREY);
  const palmGeo = box(0.046, 0.05, 0.032, SHELL_WHITE);
  const fingerGeo = box(0.013, 0.032, 0.018, SHELL_GREY);

  const makeArm = (x: number, side: 1 | -1) => {
    const pivot = new Group();
    pivot.position.set(x, 0.075, 0);
    pivot.add(meshOf(shoulderGeo, shellMat));
    const upper = meshOf(upperArmGeo, shellMat);
    upper.position.y = -0.075;
    pivot.add(upper);

    const lowerPivot = new Group();
    lowerPivot.position.y = -0.135;
    lowerPivot.add(meshOf(elbowGeo, shellMat));
    const fore = meshOf(foreArmGeo, shellMat);
    fore.position.y = -0.06;
    lowerPivot.add(fore);
    const wrist = meshOf(wristGeo, shellMat);
    wrist.position.y = -0.115;
    lowerPivot.add(wrist);
    const palm = meshOf(palmGeo, shellMat);
    palm.position.y = -0.148;
    lowerPivot.add(palm);
    const fingerL = meshOf(fingerGeo, shellMat);
    fingerL.position.set(-0.014, -0.184, 0.004);
    lowerPivot.add(fingerL);
    const fingerR = meshOf(fingerGeo, shellMat);
    fingerR.position.set(0.014, -0.184, 0.004);
    lowerPivot.add(fingerR);
    pivot.add(lowerPivot);

    pivot.rotation.z = side * 0.16;
    torso.add(pivot);
    return pivot;
  };

  const armL = makeArm(-0.148, 1);
  const armR = makeArm(0.148, -1);

  return {
    group,
    torso,
    head,
    armL,
    armR,
    mouth,
    flame,
    coreMat,
    geoms,
    mats,
    textures,
  };
}

/**
 * AR NavMe guide droid - hidden during intro pan-out.
 * Stays beside the floor arrow (slight right bias), near center view.
 */
export function NavCompanionBot({
  active = true,
  scale = 1.05,
  /** Small shift to the right of the floor arrow - stay near center view. */
  pathOffsetX = 0.48,
}: {
  active?: boolean;
  scale?: number;
  pathOffsetX?: number;
  /** @deprecated Unused - hops are dock→dock straight pans. */
  lookAhead?: number;
}) {
  const store = useJourneyProgressStore();
  const { camera, gl, size } = useThree();
  const logoMap = useLoader(TextureLoader, logoUrl);
  const activeNodeId = useActiveNodeId();
  const rootRef = useRef<Object3D>(null);
  const phaseRef = useRef(0);
  const yawRef = useRef(0);
  const lastProgressRef = useRef(0);
  const speedRef = useRef(0);
  /** Seconds remaining to keep "face the user" pose after reverse is detected. */
  const reverseHoldRef = useRef(0);
  const wasReverseRef = useRef(false);
  const initializedRef = useRef(false);
  const greetedRef = useRef(false);
  const [introCloud, setIntroCloud] = useState(false);
  const _calloutWorld = useMemo(() => new Vector3(), []);

  const compactView =
    size.width > 0 &&
    (size.width < 900 || size.height / Math.max(size.width, 1) > 1.05);
  const effectiveScale = compactView ? scale * 0.72 : scale;
  const effectiveOffsetX = compactView ? pathOffsetX * 0.7 : pathOffsetX;

  const curve = useMemo(
    () => createLinearRouteCurve(WALK_WAYPOINTS),
    [ROUTE_LENGTH_M],
  );
  const pitchRef = useRef(0);
  const robot = useMemo(() => createRobot(logoMap), [logoMap]);

  useLayoutEffect(() => {
    const parent = rootRef.current;
    if (!parent) return;
    parent.add(robot.group);
    robot.group.scale.setScalar(effectiveScale);
    return () => {
      parent.remove(robot.group);
      for (const g of robot.geoms) g.dispose();
      for (const m of robot.mats) m.dispose();
      for (const t of robot.textures) t.dispose();
    };
  }, [robot, effectiveScale]);

  useLayoutEffect(() => {
    if (!active) {
      initializedRef.current = false;
      if (rootRef.current) rootRef.current.visible = false;
      setNodeScreenAnchor({
        nodeId: "",
        x: 0,
        y: 0,
        visible: false,
      });
      return;
    }
    if (rootRef.current) rootRef.current.visible = true;
  }, [active]);

  // Speech cloud from the robot head once Nav appears at Welcome.
  useEffect(() => {
    if (!active) {
      greetedRef.current = false;
      setIntroCloud(false);
      return;
    }
    if (greetedRef.current) return;
    greetedRef.current = true;
    const showTimer = window.setTimeout(() => {
      setIntroCloud(true);
    }, INTRO_SHOW_DELAY_MS);
    const hideTimer = window.setTimeout(() => {
      setIntroCloud(false);
    }, INTRO_SHOW_DELAY_MS + INTRO_VISIBLE_MS);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
      setIntroCloud(false);
    };
  }, [active]);

  useEffect(() => {
    if (activeNodeId !== "welcome") setIntroCloud(false);
  }, [activeNodeId]);

  useFrame((_, delta) => {
    const root = rootRef.current;
    if (!root || !active) return;

    const progress = store.progress;
    const intent = store.travelIntent;
    // Skip hops (1→3…): hide like splash. Adjacent route hops: stay visible.
    if (isStraightSkipHop()) {
      root.visible = false;
      initializedRef.current = false;
      setNodeScreenAnchor({
        nodeId: "",
        x: 0,
        y: 0,
        visible: false,
      });
      lastProgressRef.current = progress;
      return;
    }

    const dProgress = progress - lastProgressRef.current;
    const rawSpeed = Math.abs(dProgress) / Math.max(delta, 0.001);
    lastProgressRef.current = progress;
    speedRef.current = speedRef.current * 0.78 + rawSpeed * 0.22;

    // Scroll-up / previous-stop: face the user the whole way back
    const reversingNow = intent < 0 || dProgress < -1e-7;
    if (reversingNow) {
      reverseHoldRef.current = 0.45;
    } else {
      reverseHoldRef.current = Math.max(0, reverseHoldRef.current - delta);
    }
    const goingBack = reverseHoldRef.current > 0;
    const traveling = intent !== 0 || speedRef.current > 0.012 || goingBack;
    const activeNode = getActiveNode(progress);
    const credits = getFinishCredits();
    const onFinishStick =
      MathUtils.smoothstep(credits, 0.02, 0.62) > 0.001 &&
      (activeNode.id === "complete" || credits > 0.04) &&
      !isStraightSkipHop();

    // At a gallery wall the camera IS Nav's view — hide the body.
    // Nav only appears beside the floor arrow while traveling (or on Connect).
    const readingWall =
      !traveling && !onFinishStick && activeNode.id !== "complete";
    if (readingWall) {
      root.visible = false;
      setIntroCloud(false);
      setNodeScreenAnchor({
        nodeId: activeNode.id,
        x: 0,
        y: 0,
        visible: false,
      });
      return;
    }
    root.visible = true;

    // Stay next to the floor arrow (same path point), slight camera-right bias
    const e = camera.matrixWorld.elements;
    let rx = e[0];
    let rz = e[2];
    const rLen = Math.hypot(rx, rz) || 1;
    rx /= rLen;
    rz /= rLen;

    const lookAhead = traveling && !goingBack ? 0.004 : 0;
    const companionT = Math.min(1, Math.max(0, progress + lookAhead));
    // Travel with the floor arrow along the navigation route.
    const routeT =
      getTravelSegment()?.mode === "route" || traveling
        ? companionT
        : activeNode.dockT;
    const point = curve.getPointAt(routeT);
    const onStair = isStairClimbY(point.y);
    const faceMeters = onStair ? 0.42 : 1.15;
    const facePt = curve.getPointAt(
      Math.min(1, Math.max(0, routeT + faceMeters / Math.max(ROUTE_LENGTH_M, 1))),
    );
    const routeYaw = Math.atan2(facePt.x - point.x, facePt.z - point.z);
    const climbTan = curve.getTangentAt(Math.max(routeT, 0.0001));
    const climbPitch = onStair
      ? -Math.atan2(climbTan.y, Math.hypot(climbTan.x, climbTan.z)) * 0.62
      : 0;

    // Finish wall: blend onto mural stick by credits (keeps easing when leaving).
    const aspect =
      size.width > 0 && size.height > 0 ? size.width / size.height : 16 / 9;
    const isPhone = size.width > 0 && size.width < 768;
    const stickMode = isPhone
      ? "phone"
      : isMuralCompactViewport(size.width, size.height)
        ? "compact"
        : "desktop";
    const [stickX, stickY, stickZ] = finishRobotStickForAspect(
      aspect,
      stickMode,
    );

    const side = onStair ? 0 : effectiveOffsetX;
    const pathX = point.x + rx * side;
    const pathZ = point.z + rz * side;
    const pathY = onStair ? snapStairY(point.y) : point.y;
    const stickBlend = MathUtils.smoothstep(credits, 0.02, 0.62);

    let targetX = pathX;
    let targetZ = pathZ;
    let targetY = pathY;
    if (onFinishStick) {
      targetX = MathUtils.lerp(pathX, stickX, stickBlend);
      targetY = MathUtils.lerp(pathY, stickY, stickBlend);
      targetZ = MathUtils.lerp(pathZ, stickZ, stickBlend);
    }

    let targetYaw: number;
    if (onFinishStick && stickBlend > 0.35) {
      // Face the user / camera while stuck on the wall
      const dx = camera.position.x - targetX;
      const dz = camera.position.z - targetZ;
      targetYaw = Math.atan2(dx, dz);
      robot.head.rotation.y = Math.sin(phaseRef.current * 0.35) * 0.05;
      robot.armL.rotation.x += (0.1 - robot.armL.rotation.x) * 0.1;
      robot.armR.rotation.x += (-1.05 - robot.armR.rotation.x) * 0.1;
    } else if (goingBack) {
      // Coming back to previous stop: face opposite the route (= toward the user)
      // Forward walk uses routeYaw (shows the back); reverse must flip 180°.
      targetYaw = routeYaw + Math.PI;
      robot.head.rotation.y = Math.sin(phaseRef.current * 0.35) * 0.06;
      robot.armL.rotation.x = Math.sin(phaseRef.current * 1.4) * 0.1;
      robot.armR.rotation.x = Math.sin(phaseRef.current * 1.4 + Math.PI) * 0.1;
    } else if (traveling) {
      // Forward: face along the navigation route
      targetYaw = routeYaw;
      robot.head.rotation.y = Math.sin(phaseRef.current * 0.35) * 0.04;
      robot.armL.rotation.x = Math.sin(phaseRef.current * 1.4) * 0.14;
      robot.armR.rotation.x = Math.sin(phaseRef.current * 1.4 + Math.PI) * 0.14;
    } else {
      // Stopped at a dock: face the user
      const dx = camera.position.x - targetX;
      const dz = camera.position.z - targetZ;
      targetYaw = Math.atan2(dx, dz);
      robot.head.rotation.y = Math.sin(phaseRef.current * 0.35) * 0.06;
      robot.armL.rotation.x += (0.1 - robot.armL.rotation.x) * 0.08;
      robot.armR.rotation.x += (-1.15 - robot.armR.rotation.x) * 0.08;
    }

    const posRate = onFinishStick
      ? stickBlend > 0.5
        ? 4.2
        : 3.1
      : onStair
        ? 16
        : traveling
          ? 5.5
          : 8.2;
    const posLambda = initializedRef.current
      ? 1 - Math.exp(-delta * posRate)
      : 1;
    root.position.x += (targetX - root.position.x) * posLambda;
    root.position.y += (targetY - root.position.y) * posLambda;
    root.position.z += (targetZ - root.position.z) * posLambda;
    initializedRef.current = true;

    let dy = targetYaw - yawRef.current;
    while (dy > Math.PI) dy -= Math.PI * 2;
    while (dy < -Math.PI) dy += Math.PI * 2;

    // Instant turn when reverse starts so the back never flashes toward the user
    if (goingBack && !wasReverseRef.current && stickBlend < 0.2) {
      yawRef.current = targetYaw;
    } else if (goingBack) {
      yawRef.current += dy * Math.min(1, 1 - Math.exp(-delta * 22));
    } else {
      const yawRate = traveling ? 7.5 : 6.5;
      yawRef.current += dy * (1 - Math.exp(-delta * yawRate));
    }
    wasReverseRef.current = goingBack;
    root.rotation.y = yawRef.current;
    const pitchLambda = 1 - Math.exp(-delta * (onStair ? 10 : 8));
    pitchRef.current += (climbPitch - pitchRef.current) * pitchLambda;
    root.rotation.x = pitchRef.current;

    // Grow on the finish mural; shrink back smoothly when leaving.
    const finishScaleMul = 1 + stickBlend * ((isPhone ? 1.48 : 1.28) - 1);
    const targetScale = effectiveScale * finishScaleMul;
    const scaleLambda = 1 - Math.exp(-delta * (onFinishStick ? 3.2 : 5.2));
    const nextScale =
      robot.group.scale.x + (targetScale - robot.group.scale.x) * scaleLambda;
    robot.group.scale.setScalar(nextScale);

    phaseRef.current += delta * HOVER_RATE * Math.PI * 2;
    const stepBob = onStair
      ? Math.abs(Math.sin((pathY / STEP_RISE) * Math.PI)) * 0.045
      : Math.sin(phaseRef.current) * HOVER_BOB;
    robot.torso.position.y = BODY_Y + stepBob;

    const ts = performance.now() / 1000;
    const coreMix = 0.5 + 0.5 * Math.sin(ts * 2.4);
    robot.coreMat.color.setRGB(
      (0x4d + (0x21 - 0x4d) * coreMix * 0.35) / 255,
      (0xd8 + (0x67 - 0xd8) * coreMix * 0.35) / 255,
      (0xff + (0xf2 - 0xff) * coreMix * 0.35) / 255,
    );

    robot.flame.visible = !onStair;
    robot.flame.scale.set(
      1 + Math.sin(ts * 17.3) * 0.07,
      (1 + Math.sin(ts * 23.7) * 0.13) * (traveling ? 1.15 : 1),
      1 + Math.sin(ts * 19.1) * 0.07,
    );

    // Callout line origin = robot head (screen space for panel connectors).
    const node = getActiveNode(progress);
    const arrived = !traveling && Math.abs(progress - node.dockT) <= 0.005;
    if (!arrived) {
      setNodeScreenAnchor({
        nodeId: node.id,
        x: 0,
        y: 0,
        visible: false,
      });
    } else {
      robot.head.getWorldPosition(_calloutWorld);
      _calloutWorld.project(camera);
      const behind = _calloutWorld.z > 1;
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((_calloutWorld.x + 1) / 2) * rect.width + rect.left;
      const y = ((1 - _calloutWorld.y) / 2) * rect.height + rect.top;
      const onScreen =
        !behind &&
        x > rect.left - 40 &&
        x < rect.right + 40 &&
        y > rect.top - 40 &&
        y < rect.bottom + 40;
      setNodeScreenAnchor({
        nodeId: node.id,
        x,
        y,
        visible: onScreen,
      });
    }
  });

  return (
    <group ref={rootRef} visible={active}>
      <CompanionIntroCloud
        visible={active && introCloud}
        botScale={effectiveScale}
        side={compactView ? "left" : "right"}
      />
    </group>
  );
}
