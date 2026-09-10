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
import { isInteractiveTarget } from "@/journey/input/isInteractiveTarget";
import {
  beginGalleryGesture,
  endGalleryGesture,
  getGalleryGesture,
  lookPitchFromPointerDy,
  lookYawFromPointerDx,
  resolveGalleryGesture,
} from "@/journey/input/lookDragStore";
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
const _lookDir = new Vector3();
const _up = new Vector3(0, 1, 0);

const LOOK_YAW_SENS = 0.0044;
const LOOK_PITCH_SENS = 0.0034;
const LOOK_YAW_SENS_TOUCH = 0.0036;
const LOOK_YAW_MAX = 0.95;
const LOOK_PITCH_MIN = -0.62;
const LOOK_PITCH_MAX = 0.7;
/** Damp look offsets toward the finger/mouse target. */
const LOOK_SMOOTH = 18;

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
  const lookYawRef = useRef(0);
  const lookPitchRef = useRef(0);
  const lookYawTargetRef = useRef(0);
  const lookPitchTargetRef = useRef(0);
  const draggingRef = useRef(false);
  const pendingLookRef = useRef(false);
  const lookEnabledRef = useRef(false);
  const dockIdRef = useRef("");
  const lastPtrRef = useRef({ x: 0, y: 0 });
  const activePointerRef = useRef<number | null>(null);

  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = "none";
    el.style.cursor = "default";

    const endLook = (event?: PointerEvent) => {
      if (
        event &&
        activePointerRef.current != null &&
        event.pointerId !== activePointerRef.current
      ) {
        return;
      }
      pendingLookRef.current = false;
      draggingRef.current = false;
      if (getGalleryGesture() !== "travel") {
        endGalleryGesture();
      }
      if (
        event &&
        activePointerRef.current === event.pointerId &&
        el.hasPointerCapture(event.pointerId)
      ) {
        el.releasePointerCapture(event.pointerId);
      }
      activePointerRef.current = null;
      el.style.cursor = lookEnabledRef.current ? "grab" : "default";
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if (!lookEnabledRef.current) return;
      if (isInteractiveTarget(event.target)) return;
      pendingLookRef.current = true;
      draggingRef.current = false;
      activePointerRef.current = event.pointerId;
      lastPtrRef.current.x = event.clientX;
      lastPtrRef.current.y = event.clientY;
      beginGalleryGesture(event.clientX, event.clientY);
    };
    const onMove = (event: PointerEvent) => {
      if (activePointerRef.current !== event.pointerId) return;
      if (!pendingLookRef.current && !draggingRef.current) return;
      const dx = event.clientX - lastPtrRef.current.x;
      const dy = event.clientY - lastPtrRef.current.y;
      const gesture = resolveGalleryGesture(
        event.clientX,
        event.clientY,
        event.pointerType,
      );
      switch (gesture) {
        case "idle":
          return;
        case "travel":
          return;
        case "look":
          break;
        default: {
          const _exhaustive: never = gesture;
          return _exhaustive;
        }
      }
      if (!draggingRef.current) {
        draggingRef.current = true;
        try {
          el.setPointerCapture(event.pointerId);
        } catch {
          /* capture is optional on some WebViews */
        }
        el.style.cursor = "grabbing";
      }
      lastPtrRef.current.x = event.clientX;
      lastPtrRef.current.y = event.clientY;
      const touch = event.pointerType !== "mouse";
      const yawSens = touch ? LOOK_YAW_SENS_TOUCH : LOOK_YAW_SENS;
      lookYawTargetRef.current = MathUtils.clamp(
        lookYawTargetRef.current + lookYawFromPointerDx(dx, yawSens),
        -LOOK_YAW_MAX,
        LOOK_YAW_MAX,
      );
      if (touch) return;
      lookPitchTargetRef.current = MathUtils.clamp(
        lookPitchTargetRef.current +
          lookPitchFromPointerDy(dy, LOOK_PITCH_SENS),
        LOOK_PITCH_MIN,
        LOOK_PITCH_MAX,
      );
    };

    window.addEventListener("pointerdown", onDown, { capture: true });
    window.addEventListener("pointermove", onMove, { capture: true });
    window.addEventListener("pointerup", endLook, { capture: true });
    window.addEventListener("pointercancel", endLook, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", onDown, { capture: true });
      window.removeEventListener("pointermove", onMove, { capture: true });
      window.removeEventListener("pointerup", endLook, { capture: true });
      window.removeEventListener("pointercancel", endLook, { capture: true });
      endGalleryGesture();
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

    const active = getActiveNode(progress);
    if (dockIdRef.current !== active.id) {
      dockIdRef.current = active.id;
      lookYawRef.current = 0;
      lookPitchRef.current = 0;
      lookYawTargetRef.current = 0;
      lookPitchTargetRef.current = 0;
    }

    const hopSeg = getTravelSegment();
    const hopping = hopSeg?.mode === "straight" && intent !== 0;
    const finishLocked = credits > 0.08 && active.id === "complete";
    const lookEnabled =
      !tight &&
      intent === 0 &&
      !hopping &&
      !finishLocked &&
      active.id !== "complete";
    lookEnabledRef.current = lookEnabled;
    if (!draggingRef.current) {
      gl.domElement.style.cursor = lookEnabled ? "grab" : "default";
    }

    if (!lookEnabled) {
      lookYawTargetRef.current = MathUtils.damp(
        lookYawTargetRef.current,
        0,
        9,
        delta,
      );
      lookPitchTargetRef.current = MathUtils.damp(
        lookPitchTargetRef.current,
        0,
        9,
        delta,
      );
    }

    lookYawRef.current = MathUtils.damp(
      lookYawRef.current,
      lookYawTargetRef.current,
      LOOK_SMOOTH,
      delta,
    );
    lookPitchRef.current = MathUtils.damp(
      lookPitchRef.current,
      lookPitchTargetRef.current,
      LOOK_SMOOTH,
      delta,
    );

    const yawOff = lookYawRef.current;
    const pitchOff = lookPitchRef.current;
    if (Math.abs(yawOff) > 1e-4 || Math.abs(pitchOff) > 1e-4) {
      _lookDir.copy(_lookAt).sub(_targetPos);
      const dist = Math.max(2.8, _lookDir.length());
      const baseYaw = Math.atan2(_lookDir.x, _lookDir.z);
      const horiz = Math.hypot(_lookDir.x, _lookDir.z);
      const basePitch = Math.atan2(_lookDir.y, Math.max(1e-5, horiz));
      const yaw = baseYaw + yawOff;
      const pitch = MathUtils.clamp(
        basePitch + pitchOff,
        LOOK_PITCH_MIN,
        LOOK_PITCH_MAX,
      );
      const cp = Math.cos(pitch);
      _lookAt.set(
        _targetPos.x + Math.sin(yaw) * cp * dist,
        _targetPos.y + Math.sin(pitch) * dist,
        _targetPos.z + Math.cos(yaw) * cp * dist,
      );
      if (lookEnabled) {
        lookDamp = draggingRef.current ? 18 : 11;
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
