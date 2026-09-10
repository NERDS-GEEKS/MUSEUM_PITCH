import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const LAYERS = [
  {
    id: "perception",
    label: "Gallery Directory",
    description:
      "Help visitors locate galleries, exhibits, and museum facilities.",
    accent: "border-nm-primary/45 bg-nm-primary/10",
    offset: "lg:translate-y-0",
  },
  {
    id: "planning",
    label: "AR Exhibits",
    description:
      "Exploded views, working animations, and audio narration on every artifact.",
    accent: "border-nm-accent/45 bg-nm-accent/10",
    offset: "lg:translate-y-6",
  },
  {
    id: "guidance",
    label: "Inclusive Navigation",
    description:
      "Accessible routes and family trails through the same Digital Twin.",
    accent: "border-nm-highlight/50 bg-nm-highlight/10",
    offset: "lg:translate-y-12",
  },
] as const;

export function AiTechnology() {
  const reduce = usePrefersReducedMotion();

  return (
    <section id="technology" className="relative px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <SectionHeading
            eyebrow="Use Cases"
            title="Real-World Museum Experiences"
            description="NavMe adapts to science museums, technology museums, and cultural institutions—helping visitors, students, and directors."
          />
        </SectionReveal>

        <div className="relative mx-auto mt-14 max-w-3xl md:mt-20">
          <div className="flex flex-col gap-4 md:gap-5" aria-label="AI technology layers">
            {LAYERS.map((layer, index) => (
              <motion.div
                key={layer.id}
                className={cn("relative z-[1]", layer.offset)}
                style={{ zIndex: index + 1 }}
                initial={reduce ? false : { opacity: 0, y: 36, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{
                  duration: 0.65,
                  delay: reduce ? 0 : index * 0.16,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <GlassPanel
                  className={cn(
                    "border backdrop-blur-xl px-6 py-6 md:px-8 md:py-7",
                    layer.accent,
                  )}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-nm-muted">
                    Layer {index + 1}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-nm-text md:text-3xl">
                    {layer.label}
                  </h3>
                  <p className="mt-2 max-w-xl text-base text-nm-muted md:text-lg">
                    {layer.description}
                  </p>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
