import { GpsComparison } from "@/components/gps/GpsComparison";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionReveal } from "@/components/ui/SectionReveal";

export function WhyGpsFails() {
  return (
    <section id="why-gps" className="relative px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <SectionHeading
            eyebrow="Why NavMe"
            title="The Future of Museums Is Interactive"
            description="Traditional museums rely on paper maps and printed labels. NavMe replaces them with a Digital Twin, AR exhibits, and visitor analytics, without rebuilding the museum."
          />
        </SectionReveal>
        <div className="mt-12 md:mt-16">
          <GpsComparison />
        </div>
      </div>
    </section>
  );
}
