import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { INDUSTRIES } from "@/constants/industries";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

type Industry = (typeof INDUSTRIES)[number];

function IndustryCard({ industry }: { industry: Industry }) {
  const reduce = usePrefersReducedMotion();

  return (
    <motion.article
      className="group h-full"
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
    >
      <GlassPanel
        className={cn(
          "relative h-full overflow-hidden p-5 transition-colors duration-300 md:p-6",
          "group-hover:border-white/25",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90",
            industry.gradient,
          )}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl transition-opacity duration-300 group-hover:opacity-80"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 left-1/4 h-28 w-40 rotate-12 bg-gradient-to-r from-nm-primary/25 to-transparent blur-xl"
          aria-hidden
        />
        <div className="relative z-10 flex h-full min-h-[11rem] flex-col justify-end md:min-h-[12.5rem]">
          <h3 className="text-xl font-semibold tracking-tight text-nm-text md:text-2xl">
            {industry.label}
          </h3>
          <p className="mt-2 text-sm text-nm-muted md:text-base">
            {industry.description}
          </p>
        </div>
      </GlassPanel>
    </motion.article>
  );
}

export function Industries() {
  return (
    <section id="industries" className="relative px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <SectionHeading
            eyebrow="Museums"
            title="Built for Museums and Cultural Institutions"
            description="Science museums, technology museums, government museums, and cultural institutions. NavMe converts traditional galleries into AR experiences."
          />
        </SectionReveal>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:mt-16 md:gap-5">
          {INDUSTRIES.map((industry) => (
            <li key={industry.id}>
              <SectionReveal>
                <IndustryCard industry={industry} />
              </SectionReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
