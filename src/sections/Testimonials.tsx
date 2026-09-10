import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { TESTIMONIALS } from "@/constants/testimonials";

export function Testimonials() {
  return (
    <section id="testimonials" className="relative px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <SectionHeading
            eyebrow="Testimonials"
            title="Voices from museum directors and curators."
            description="Role-based quotes from the people who run galleries, collections, and visitor experience."
          />
        </SectionReveal>

        <ul className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
          {TESTIMONIALS.map((item) => (
            <li key={item.id}>
              <SectionReveal>
                <GlassPanel className="flex h-full flex-col justify-between p-6 md:p-8">
                  <blockquote className="flex h-full flex-col justify-between">
                    <p className="text-base leading-relaxed text-nm-text md:text-lg">
                      “{item.quote}”
                    </p>
                    <footer className="mt-6">
                      <cite className="not-italic text-sm font-medium text-nm-muted md:text-base">
                        {item.role}
                      </cite>
                    </footer>
                  </blockquote>
                </GlassPanel>
              </SectionReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
