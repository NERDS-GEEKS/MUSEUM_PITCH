import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const PHASES = [
  {
    id: "camera",
    label: "Artificial Intelligence",
    description: "Deliver intelligent positioning using advanced AI.",
  },
  {
    id: "features",
    label: "Computer Vision",
    description: "Recognize indoor environments through image understanding.",
  },
  {
    id: "lock",
    label: "Visual Positioning System",
    description: "Accurate positioning without GPS.",
  },
] as const;

function PhaseVisual({ phaseId }: { phaseId: (typeof PHASES)[number]["id"] }) {
  switch (phaseId) {
    case "camera":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16 text-nm-primary" aria-hidden>
          <rect
            x="14"
            y="22"
            width="52"
            height="36"
            rx="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <circle cx="40" cy="40" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="40" cy="40" r="3" fill="currentColor" />
          <path d="M28 22 V18 H36" fill="none" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      );
    case "features":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16 text-nm-accent" aria-hidden>
          <circle cx="24" cy="28" r="3" fill="currentColor" />
          <circle cx="52" cy="22" r="3" fill="currentColor" />
          <circle cx="58" cy="48" r="3" fill="currentColor" />
          <circle cx="30" cy="56" r="3" fill="currentColor" />
          <circle cx="44" cy="40" r="3" fill="currentColor" />
          <path
            d="M24 28 L44 40 L52 22 M44 40 L58 48 M44 40 L30 56"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            opacity="0.7"
          />
        </svg>
      );
    case "lock":
      return (
        <svg viewBox="0 0 80 80" className="h-16 w-16 text-nm-highlight" aria-hidden>
          <circle cx="40" cy="40" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="40" cy="40" r="5" fill="currentColor" />
          <path
            d="M40 18 V28 M40 52 V62 M18 40 H28 M52 40 H62"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );
    default: {
      const _exhaustive: never = phaseId;
      return _exhaustive;
    }
  }
}

export function Vps() {
  const reduce = usePrefersReducedMotion();

  return (
    <section id="vps" className="relative px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <SectionHeading
            eyebrow="Platform Technology"
            title="Your Museum. Digitally Recreated."
            description="NavMe captures the complete museum as a navigable Digital Twin—the foundation for AR experiences, indoor navigation, and visitor analytics."
          />
        </SectionReveal>

        <ol className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-3 md:gap-6">
          {PHASES.map((phase, index) => {
            const isLock = phase.id === "lock";

            return (
              <li key={phase.id}>
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{
                    duration: 0.55,
                    delay: reduce ? 0 : index * 0.18,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <GlassPanel
                    className={cn(
                      "relative flex h-full flex-col items-start gap-4 overflow-hidden p-6 md:p-7",
                      isLock && "border-nm-highlight/50",
                    )}
                  >
                    {isLock ? (
                      <motion.div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-2xl border-2"
                        style={{ borderColor: "var(--nm-highlight)" }}
                        initial={
                          reduce
                            ? false
                            : {
                                boxShadow:
                                  "0 0 0 0 color-mix(in srgb, var(--nm-highlight) 0%, transparent)",
                                opacity: 0.55,
                              }
                        }
                        whileInView={
                          reduce
                            ? undefined
                            : {
                                boxShadow: [
                                  "0 0 0 0 color-mix(in srgb, var(--nm-highlight) 0%, transparent)",
                                  "0 0 0 16px color-mix(in srgb, var(--nm-highlight) 40%, transparent)",
                                  "0 0 0 0 color-mix(in srgb, var(--nm-highlight) 0%, transparent)",
                                ],
                                opacity: [0.55, 1, 0.7],
                              }
                        }
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.05, ease: "easeOut", delay: 0.45 }}
                      />
                    ) : null}

                    <div className="relative z-10 flex w-full items-center justify-between">
                      <PhaseVisual phaseId={phase.id} />
                      <span className="text-sm font-medium text-nm-muted">
                        0{index + 1}
                      </span>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-semibold tracking-tight text-nm-text md:text-2xl">
                        {phase.label}
                      </h3>
                      <p className="mt-2 text-base text-nm-muted">{phase.description}</p>
                    </div>
                  </GlassPanel>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
