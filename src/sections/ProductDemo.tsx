import { RouteDemo } from "@/components/demo/RouteDemo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionReveal } from "@/components/ui/SectionReveal";

export function ProductDemo() {
  return (
    <section id="demo" className="relative px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <SectionHeading
            eyebrow="Interactive demo"
            title="Search Space Gallery. Watch the route lock in."
            description="A stylized museum floor plan shows how NavMe draws a clear path from where visitors are to the exhibit they want."
          />
        </SectionReveal>
        <div className="mx-auto mt-12 max-w-3xl md:mt-16">
          <RouteDemo />
        </div>
      </div>
    </section>
  );
}
