import { JourneyScene } from "@/journey/world/JourneyScene";
import { JOURNEY_FOV } from "@/journey/camera/dockPose";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";

function OpeningInvalidate({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!active) return;
    let id = 0;
    const tick = () => {
      invalidate();
      id = window.requestAnimationFrame(tick);
    };
    id = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(id);
  }, [active, invalidate]);
  return null;
}

/**
 * Full-viewport WebGL stage.
 * Canvas props stay stable across rotate/resize so the renderer does not
 * remount (that flash is the orientation flicker).
 */
export function JourneyCanvas({
  openingActive = false,
}: {
  openingActive?: boolean;
}) {
  const [pageVisible, setPageVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );

  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const frozen = !pageVisible;
  const introPan = openingActive && pageVisible;

  return (
    <Canvas
      className="pointer-events-auto fixed inset-0 z-30 h-svh w-screen touch-none"
      dpr={[1, 1.75]}
      camera={{
        fov: JOURNEY_FOV,
        near: 0.08,
        far: 180,
        position: [0, 1.62, 0],
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      resize={{ debounce: 50 }}
      frameloop={frozen ? "never" : introPan ? "demand" : "always"}
      onCreated={({ gl }) => {
        gl.setClearColor("#1E1A16", 1);
      }}
      style={{
        background: "#1E1A16",
        visibility: "visible",
      }}
    >
      {introPan ? <OpeningInvalidate active /> : null}
      <JourneyScene openingActive={openingActive} />
    </Canvas>
  );
}

export default JourneyCanvas;
