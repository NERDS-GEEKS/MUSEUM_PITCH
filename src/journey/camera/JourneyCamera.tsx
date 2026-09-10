import {
  EYE_HEIGHT,
  FINISH_FOV,
  INTRO_FOV,
  JOURNEY_FOV,
  poseAlongRoute,
  poseAtDock,
  poseAtFinishZoom,
  poseAtIntro,
  smoothstep01,
} from "@/journey/camera/dockPose";
import { getActiveNode, JOURNEY_NODES } from "@/journey/constants/nodes";
import {
  getFinishCredits,
  getFinishCreditsTarget,
  setFinishCredits,
} from "@/journey/opening/finishCreditsStore";
import { useJourneyProgressStore } from "@/journey/scroll/useJourneyProgress";
import {
  clearTravelSegment,
  getTravelSegment,
  travelBlend,
} from "@/journey/scroll/travelSegmentStore";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";

const WELCOME_T = JOURNEY_NODES[0].dockT;
const COMPLETE_T =
  JOURNEY_NODES.find((n) => n.id === "complete")?.dockT ?? 0.92;

const _targetPos = new Vector3();
const _lookAt = new Vector3();
const _fromPos = new Vector3();
const _fromLook = new Vector3();
const _toPos = new Vector3();
const _toLook = new Vector3();
const _dockPos = new Vector3();
const _dockLook = new Vector3();
const _zoomPos = new Vector3();
const _zoomLook = new Vector3();
const _introPos = new Vector3();
const _introLook = new Vector3();
const _welcomePos = new Vector3();
const _welcomeLook = new Vector3();
const _currentLook = new Vector3();
const _up = new Vector3(0, 1, 0);

function applyStraightHop(
  fromT: number,
  toT: number,
  blend: number,
  aspect: number,
): { fov: number } {
  const toFinish =
    Math.abs(toT - COMPLETE_T) < 0.02 || toT >= COMPLETE_T - 0.01;
  const fromFinish =
    Math.abs(fromT - COMPLETE_T) < 0.02 || fromT >= COMPLETE_T - 0.01;

  if (fromFinish) {
    poseAtDock(COMPLETE_T, _dockPos, _dockLook);
    poseAtFinishZoom(_dockPos, _dockLook, _fromPos, _fromLook, 1, aspect);
  } else {
    poseAtDock(fromT, _fromPos, _fromLook);
  }

  if (toFinish) {
    poseAtDock(COMPLETE_T, _dockPos, _dockLook);
    poseAtFinishZoom(_dockPos, _dockLook, _toPos, _toLook, 1, aspect);
  } else {
    poseAtDock(toT, _toPos, _toLook);
  }

  const e = smoothstep01(blend);
  _targetPos.lerpVectors(_fromPos, _toPos, e);
  _lookAt.lerpVectors(_fromLook, _toLook, e);

  const fromFov = fromFinish ? FINISH_FOV : JOURNEY_FOV;
  const toFov = toFinish ? FINISH_FOV : JOURNEY_FOV;
  return {
    fov: MathUtils.lerp(fromFov, toFov, e),
  };
}

/**
 * Opening: straight-line pan logo wall → Welcome.
 * Adjacent POIs (1↔2): track the navigation corridor.
 * Skip hops (1→3…): splash-style straight pan.
 * Finish: slight zoom-in toward the end wall as credits open.
 */
export function JourneyCamera({
  followTight = false,
}: {
  followTight?: boolean;
}) {
  const store = useJourneyProgressStore();
  const { camera, gl, size } = useThree();
  const lookRef = useRef(new Vector3(0, EYE_HEIGHT, 4));
  const initialized = useRef(false);
  const followTightRef = useRef(followTight);
  followTightRef.current = followTight;

  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = "none";
    el.style.cursor = "default";
    return () => {
      el.style.cursor = "";
      el.style.touchAction = "";
    };
  }, [gl]);

  useFrame((_, delta) => {
    const progress = store.progress;
    const tight = followTightRef.current;
    const intent = store.travelIntent;
    const aspect =
      size.width > 0 && size.height > 0 ? size.width / size.height : 16 / 9;

    poseAtDock(WELCOME_T, _welcomePos, _welcomeLook);
    poseAtIntro(_introPos, _introLook);

    const creditsTarget = getFinishCreditsTarget();
    // Ease out of the mural slower than zoom-in so leaving isn't a snap.
    const creditsDamp = creditsTarget < getFinishCredits() - 0.01 ? 1.85 : 3.2;
    const credits = MathUtils.damp(
      getFinishCredits(),
      creditsTarget,
      creditsDamp,
      delta,
    );
    setFinishCredits(credits);

    let targetFov = JOURNEY_FOV;
    let posDamp = 5.2;
    let lookDamp = 5.6;

    if (tight) {
      const span = Math.max(1e-4, 1 - WELCOME_T);
      const u = MathUtils.clamp((progress - WELCOME_T) / span, 0, 1);
      const e = smoothstep01(u);
      _targetPos.lerpVectors(_welcomePos, _introPos, e);
      _lookAt.lerpVectors(_welcomeLook, _introLook, e);
      targetFov = MathUtils.lerp(JOURNEY_FOV, INTRO_FOV, e);
      posDamp = 22;
      lookDamp = 20;
    } else {
      const seg = getTravelSegment();
      const mode = seg?.mode;

      if (mode === "straight" && seg) {
        const blend = travelBlend(progress) ?? (intent !== 0 ? 0 : 1);
        const hop = applyStraightHop(seg.fromT, seg.toT, blend, aspect);
        targetFov = hop.fov;
        posDamp = 14;
        lookDamp = 12;
      } else if (mode === "route" || intent !== 0) {
        // Adjacent POI: pan along the navigation route
        poseAlongRoute(progress, _targetPos, _lookAt);
        targetFov = JOURNEY_FOV;
        posDamp = 5.2;
        lookDamp = 5.6;
        // Leaving Connect: keep blending from wall-fill zoom → route (no snap).
        if (credits > 0.001) {
          poseAtDock(COMPLETE_T, _dockPos, _dockLook);
          poseAtFinishZoom(
            _dockPos,
            _dockLook,
            _zoomPos,
            _zoomLook,
            1,
            aspect,
          );
          _targetPos.lerp(_zoomPos, credits);
          _lookAt.lerp(_zoomLook, credits);
          targetFov = MathUtils.lerp(JOURNEY_FOV, FINISH_FOV, credits);
          posDamp = 7;
          lookDamp = 7;
        }
      } else {
        // Settled at a POI - wall-fill zoom when finish credits are open
        const dockT = getActiveNode(progress).dockT;
        poseAtDock(dockT, _dockPos, _dockLook);
        if (credits > 0.001 && dockT >= COMPLETE_T - 0.04) {
          poseAtFinishZoom(
            _dockPos,
            _dockLook,
            _zoomPos,
            _zoomLook,
            credits,
            aspect,
          );
          _targetPos.copy(_zoomPos);
          _lookAt.copy(_zoomLook);
          targetFov = MathUtils.lerp(JOURNEY_FOV, FINISH_FOV, credits);
          posDamp = 8;
          lookDamp = 8;
        } else {
          _targetPos.copy(_dockPos);
          _lookAt.copy(_dockLook);
        }
      }
    }

    if (camera instanceof PerspectiveCamera) {
      camera.fov = MathUtils.damp(camera.fov, targetFov, tight ? 14 : 8, delta);
      camera.near = 0.08;
      camera.far = 180;
      camera.updateProjectionMatrix();
    }

    if (!initialized.current) {
      camera.position.copy(_targetPos);
      lookRef.current.copy(_lookAt);
      camera.up.copy(_up);
      camera.lookAt(_lookAt);
      initialized.current = true;
      return;
    }

    camera.position.x = MathUtils.damp(
      camera.position.x,
      _targetPos.x,
      posDamp,
      delta,
    );
    camera.position.y = MathUtils.damp(
      camera.position.y,
      _targetPos.y,
      posDamp,
      delta,
    );
    camera.position.z = MathUtils.damp(
      camera.position.z,
      _targetPos.z,
      posDamp,
      delta,
    );

    _currentLook.copy(lookRef.current);
    _currentLook.x = MathUtils.damp(_currentLook.x, _lookAt.x, lookDamp, delta);
    _currentLook.y = MathUtils.damp(_currentLook.y, _lookAt.y, lookDamp, delta);
    _currentLook.z = MathUtils.damp(_currentLook.z, _lookAt.z, lookDamp, delta);
    lookRef.current.copy(_currentLook);
    camera.up.copy(_up);
    camera.lookAt(_currentLook);

    if (!tight && intent === 0 && getTravelSegment()) {
      const to = getTravelSegment()?.toT ?? progress;
      if (Math.abs(to - progress) < 0.0002) clearTravelSegment();
    }
  });

  return null;
}
