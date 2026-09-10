import { AnalyticsViz } from "@/components/analytics/AnalyticsViz";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionReveal } from "@/components/ui/SectionReveal";

export function Analytics() {
  return (
    <section id="analytics" className="relative px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <SectionHeading
            eyebrow="Why NavMe"
            title="See How Visitors Experience Your Museum"
            description="Heatmaps, dwell time, popular paths, and visitor flow, built for museum directors. No GPS, no dedicated hardware, no app install."
          />
        </SectionReveal>

        <div className="mt-12 md:mt-16">
          <SectionReveal>
            <AnalyticsViz />
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
