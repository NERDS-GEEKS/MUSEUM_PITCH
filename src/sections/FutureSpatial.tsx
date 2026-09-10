import { SectionReveal } from "@/components/ui/SectionReveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

const LAYERS = [
  {
    label: "Perception",
    className: "border-nm-primary/40 bg-nm-primary/10",
    size: "inset-[18%]",
  },
  {
    label: "Position",
    className: "border-nm-accent/45 bg-nm-accent/10",
    size: "inset-[28%]",
  },
  {
    label: "Guidance",
    className: "border-nm-highlight/50 bg-nm-highlight/10",
    size: "inset-[38%]",
  },
] as const;

export function FutureSpatial() {
  const reduce = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;

    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "+=120%",
        pin,
        scrub: true,
        anticipatePin: 1,
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, [reduce]);

  return (
    <section
      ref={rootRef}
      id="future"
      className={cn("relative px-4 md:px-8", reduce ? "py-16 md:py-24" : "h-[220vh]")}
    >
      <div
        ref={pinRef}
        className={cn(
          "mx-auto flex max-w-6xl flex-col justify-center gap-12 lg:flex-row lg:items-center lg:gap-16",
          !reduce && "min-h-[100svh] py-16",
        )}
      >
        <SectionReveal className="max-w-xl lg:sticky lg:top-1/3 lg:w-[42%]">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-nm-primary">
            Vision
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-nm-text md:text-4xl">
            Building the Future of AR Museums
          </h2>
          <p className="mt-4 text-base text-nm-muted md:text-lg">
            NavMe does not replace museums. We transform them into AR museums.
            Digital Twins, interactive exhibits, and learning journeys that make
            every collection discoverable, measurable, and unforgettable.
          </p>
        </SectionReveal>

        <div
          className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg"
          aria-hidden
        >
          <div className="absolute inset-0 rounded-full border border-nm-border/80 bg-nm-secondary/60" />
          {LAYERS.map((layer, index) => (
            <motion.div
              key={layer.label}
              className={cn(
                "absolute rounded-full border backdrop-blur-sm",
                layer.size,
                layer.className,
              )}
              animate={
                reduce
                  ? undefined
                  : {
                      scale: [1, 1.04 + index * 0.02, 1],
                      rotate: [0, index % 2 === 0 ? 6 : -6, 0],
                      borderRadius: ["50%", "42%", "50%"],
                    }
              }
              transition={
                reduce
                  ? undefined
                  : {
                      duration: 8 + index * 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            />
          ))}
          <div className="absolute inset-[46%] rounded-full bg-nm-highlight/80 shadow-[0_0_28px_rgba(62,244,255,0.45)]" />
        </div>
      </div>
    </section>
  );
}
