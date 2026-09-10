import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { FEATURES } from "@/constants/features";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useState } from "react";

type Feature = (typeof FEATURES)[number];
type Accent = Feature["accent"];

function CameraAperture({ hovered, reduce }: { hovered: boolean; reduce: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16 text-nm-primary" aria-hidden>
      <circle
        cx="40"
        cy="40"
        r="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.35"
      />
      <motion.g
        style={{ originX: "40px", originY: "40px" }}
        animate={
          reduce
            ? undefined
            : hovered
              ? { rotate: 42, scale: 1.06 }
              : { rotate: 0, scale: 1 }
        }
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <path
            key={angle}
            d="M40 18 L48 34 L40 40 L32 34 Z"
            fill="currentColor"
            opacity="0.75"
            transform={`rotate(${angle} 40 40)`}
          />
        ))}
      </motion.g>
      <motion.circle
        cx="40"
        cy="40"
        r="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        animate={
          reduce
            ? undefined
            : hovered
              ? { r: 9, opacity: 1 }
              : { r: 7, opacity: 0.9 }
        }
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </svg>
  );
}

function NeuralNodes({ hovered, reduce }: { hovered: boolean; reduce: boolean }) {
  const nodes = [
    { x: 22, y: 28 },
    { x: 40, y: 18 },
    { x: 58, y: 30 },
    { x: 28, y: 52 },
    { x: 52, y: 54 },
    { x: 40, y: 40 },
  ] as const;

  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16 text-nm-accent" aria-hidden>
      <motion.path
        d="M22 28 L40 40 L58 30 M40 18 L40 40 M28 52 L40 40 L52 54"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        initial={false}
        animate={
          reduce
            ? undefined
            : hovered
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0.85, opacity: 0.55 }
        }
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
      {nodes.map((node, i) => (
        <motion.circle
          key={`${node.x}-${node.y}`}
          cx={node.x}
          cy={node.y}
          r={i === 5 ? 4 : 3}
          fill="currentColor"
          animate={
            reduce
              ? undefined
              : hovered
                ? { scale: [1, 1.35, 1], opacity: [0.75, 1, 0.85] }
                : { scale: 1, opacity: 0.85 }
          }
          transition={
            reduce
              ? undefined
              : hovered
                ? { duration: 0.9, delay: i * 0.05, repeat: Infinity }
                : { duration: 0.25 }
          }
        />
      ))}
    </svg>
  );
}

function MapTiles({ hovered, reduce }: { hovered: boolean; reduce: boolean }) {
  const tiles = [
    { x: 14, y: 18, delay: 0 },
    { x: 34, y: 18, delay: 0.04 },
    { x: 54, y: 18, delay: 0.08 },
    { x: 14, y: 38, delay: 0.06 },
    { x: 34, y: 38, delay: 0.1 },
    { x: 54, y: 38, delay: 0.14 },
  ] as const;

  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16 text-nm-highlight" aria-hidden>
      {tiles.map((tile) => (
        <motion.rect
          key={`${tile.x}-${tile.y}`}
          x={tile.x}
          y={tile.y}
          width="16"
          height="16"
          rx="2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={
            reduce
              ? undefined
              : hovered
                ? { y: tile.y - 3, opacity: 1 }
                : { y: tile.y, opacity: 0.7 }
          }
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 22,
            delay: reduce ? 0 : tile.delay,
          }}
        />
      ))}
      <path
        d="M22 62 H58"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

function RoutePolyline({ hovered, reduce }: { hovered: boolean; reduce: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16 text-nm-primary" aria-hidden>
      <motion.path
        d="M16 58 L28 40 L42 48 L54 24 L66 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={
          reduce
            ? undefined
            : hovered
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0.55, opacity: 0.65 }
        }
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cx="16"
        cy="58"
        r="3.5"
        fill="currentColor"
        animate={reduce ? undefined : hovered ? { scale: 1.2 } : { scale: 1 }}
      />
      <motion.circle
        cx="66"
        cy="32"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        animate={
          reduce
            ? undefined
            : hovered
              ? { scale: [1, 1.35, 1], opacity: [0.7, 1, 0.8] }
              : { scale: 1, opacity: 0.9 }
        }
        transition={
          reduce
            ? undefined
            : hovered
              ? { duration: 1, repeat: Infinity }
              : { duration: 0.2 }
        }
      />
    </svg>
  );
}

function ArChevron({ hovered, reduce }: { hovered: boolean; reduce: boolean }) {
  const chevrons = [
    { y: 46, opacity: 0.35 },
    { y: 34, opacity: 0.6 },
    { y: 22, opacity: 0.95 },
  ] as const;

  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16 text-nm-accent" aria-hidden>
      {chevrons.map((chevron, i) => (
        <motion.path
          key={chevron.y}
          d={`M28 ${chevron.y} L40 ${chevron.y - 10} L52 ${chevron.y}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={chevron.opacity}
          animate={
            reduce
              ? undefined
              : hovered
                ? { y: [-4, 2, -4], opacity: [chevron.opacity, 1, chevron.opacity] }
                : { y: 0, opacity: chevron.opacity }
          }
          transition={
            reduce
              ? undefined
              : hovered
                ? {
                    duration: 1.1,
                    delay: i * 0.08,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : { duration: 0.25 }
          }
        />
      ))}
      <motion.circle
        cx="40"
        cy="58"
        r="3"
        fill="currentColor"
        animate={reduce ? undefined : hovered ? { scale: 1.25 } : { scale: 1 }}
      />
    </svg>
  );
}

function FeatureIllustration({
  accent,
  hovered,
  reduce,
}: {
  accent: Accent;
  hovered: boolean;
  reduce: boolean;
}) {
  switch (accent) {
    case "camera":
      return <CameraAperture hovered={hovered} reduce={reduce} />;
    case "ai":
      return <NeuralNodes hovered={hovered} reduce={reduce} />;
    case "mapping":
      return <MapTiles hovered={hovered} reduce={reduce} />;
    case "routing":
      return <RoutePolyline hovered={hovered} reduce={reduce} />;
    case "ar":
      return <ArChevron hovered={hovered} reduce={reduce} />;
    default: {
      const _exhaustive: never = accent;
      return _exhaustive;
    }
  }
}

function FeatureCard({ feature }: { feature: Feature }) {
  const reduce = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      className="group h-full"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={reduce ? undefined : { y: -8 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
    >
      <GlassPanel
        className={cn(
          "relative h-full overflow-hidden p-5 transition-[border-color,box-shadow,background-color] duration-300 md:p-6",
          "group-hover:border-white/25 group-hover:bg-white/[0.07]",
          "group-hover:shadow-[0_18px_40px_-24px_rgba(79,139,255,0.55)]",
        )}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-nm-primary/15 blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
        <div className="relative z-10 mb-5 inline-flex">
          <FeatureIllustration
            accent={feature.accent}
            hovered={hovered && !reduce}
            reduce={reduce}
          />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-semibold tracking-tight text-nm-text md:text-2xl">
            {feature.title}
          </h3>
          <p className="mt-2 text-sm text-nm-muted md:text-base">{feature.description}</p>
        </div>
      </GlassPanel>
    </motion.article>
  );
}

export function Features() {
  return (
    <section id="features" className="relative px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <SectionHeading
            eyebrow="Platform Overview"
            title="One Platform. An AR Museum."
            description="Instead of disconnected tools, NavMe provides a single platform for Digital Twins, indoor navigation, AR exhibits, curator CMS, and visitor analytics."
          />
        </SectionReveal>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:mt-16 md:gap-5">
          {FEATURES.map((feature) => (
            <li key={feature.id}>
              <SectionReveal>
                <FeatureCard feature={feature} />
              </SectionReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
