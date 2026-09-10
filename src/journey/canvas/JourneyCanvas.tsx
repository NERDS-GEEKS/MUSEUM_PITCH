import { JourneyScene } from "@/journey/world/JourneyScene";
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
 * Caps pixel ratio on phones for FPS, but keeps enough DPR that the
 * companion and route arrow stay sharp on retina screens.
 */
export function JourneyCanvas({
  openingActive = false,
}: {
  openingActive?: boolean;
}) {
  const [pageVisible, setPageVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 900px)").matches
      : false,
  );

  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 900px)");
    const onChange = () => setIsCompact(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const frozen = !pageVisible;
  const introPan = openingActive && pageVisible;
  // Opening: lighter load. Mobile: up to 1.75× (was 1× - caused blurry robot/arrow).
  const dpr = openingActive
    ? 1
    : isCompact
      ? ([1, 1.75] as [number, number])
      : ([1, 1.5] as [number, number]);

  return (
    <Canvas
      className="pointer-events-auto fixed inset-0 z-30 h-svh w-screen touch-none"
      dpr={dpr}
      camera={{ fov: isCompact ? 72 : 68, near: 0.08, far: 180, position: [0, 1.62, 0] }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: isCompact ? "low-power" : "high-performance",
        stencil: false,
        depth: true,
      }}
      frameloop={frozen ? "never" : introPan ? "demand" : "always"}
      onCreated={({ gl }) => {
        gl.setClearColor("#1a1612", 1);
      }}
      style={{
        background: "#1a1612",
        visibility: "visible",
      }}
    >
      {introPan ? <OpeningInvalidate active /> : null}
      <JourneyScene openingActive={openingActive} />
    </Canvas>
  );
}

export default JourneyCanvas;
