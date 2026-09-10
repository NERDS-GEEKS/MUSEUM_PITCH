import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { lazy, Suspense } from "react";

const HeroCanvas = lazy(() =>
  import("@/animations/hero/HeroCanvas").then((m) => ({
    default: m.HeroCanvas,
  })),
);

export function Hero() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center px-4 pb-16 pt-28 md:px-8 md:pb-24 md:pt-32"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
        <div className="relative z-10 max-w-xl">
          <p className="font-sans text-5xl font-semibold tracking-[-0.04em] text-nm-text sm:text-6xl md:text-7xl">
            NavMe
          </p>
          <p className="mt-4 text-sm font-medium tracking-wide text-nm-primary sm:text-base">
            Digital Twin · AR Exhibits · Visitor Analytics
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-nm-text sm:text-4xl md:text-[2.75rem] md:leading-tight">
            Transform Your Museum into an AR Museum
          </h1>
          <p className="mt-4 max-w-md text-base text-nm-muted sm:text-lg">
            NavMe converts a traditional museum into an AR museum with digital
            twins, indoor navigation, interactive exhibits, AI guidance, and
            visitor analytics.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button variant="primary" size="lg" href="#contact">
                Schedule a Demo
              </Button>
            </Magnetic>
            <Magnetic>
              <Button variant="glass" size="lg" href="#how-it-works">
                Explore the Experience
              </Button>
            </Magnetic>
          </div>
        </div>

        <p className="sr-only">
          Decorative 3D visualization of AI-powered spatial navigation through
          indoor environments.
        </p>
        <div
          className="relative h-[40vh] min-h-[14rem] w-full overflow-hidden lg:h-[min(70vh,36rem)] lg:min-h-[22rem]"
          aria-hidden="true"
        >
          {reduceMotion ? (
            <div className="hero-fallback-grid" aria-hidden="true" />
          ) : (
            <Suspense fallback={null}>
              <HeroCanvas />
            </Suspense>
          )}
        </div>
      </div>
    </section>
  );
}
