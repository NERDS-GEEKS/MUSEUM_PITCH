import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { CASE_STUDIES } from "@/constants/caseStudies";

export function CaseStudies() {
  return (
    <section id="case-studies" className="relative px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <SectionHeading
            eyebrow="Get started"
            title="Ready to Transform Your Museum?"
            description="Bring NavMe's Digital Twin, AR exhibits, and visitor analytics to your science museum, government museum, or cultural institution."
          />
        </SectionReveal>

        <ul className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
          {CASE_STUDIES.map((study) => (
            <li key={study.id}>
              <SectionReveal>
                <GlassPanel className="flex h-full flex-col p-6 md:p-8">
                  <p className="text-4xl font-semibold tracking-tight text-nm-highlight md:text-5xl">
                    {study.metric}
                  </p>
                  <p className="mt-2 text-sm font-medium text-nm-primary md:text-base">
                    {study.metricLabel}
                  </p>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-nm-text md:text-xl">
                    {study.title}
                  </h3>
                  <p className="mt-2 text-sm text-nm-muted md:text-base">
                    {study.outcome}
                  </p>
                </GlassPanel>
              </SectionReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
