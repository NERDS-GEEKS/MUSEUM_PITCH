import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Canvas } from "@react-three/fiber";
import { useInView } from "framer-motion";
import { lazy, Suspense, useRef } from "react";

const HeroScene = lazy(() =>
  import("./HeroScene").then((m) => ({ default: m.HeroScene })),
);

export function HeroCanvas() {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px" });

  if (reduce) {
    return <div className="hero-fallback-grid" aria-hidden="true" />;
  }

  return (
    <div ref={ref} className="h-full w-full">
      {inView ? (
        <Suspense fallback={null}>
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 4], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
          >
            <HeroScene />
          </Canvas>
        </Suspense>
      ) : null}
    </div>
  );
}
