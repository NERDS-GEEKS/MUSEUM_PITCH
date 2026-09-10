import { ContactForm } from "@/components/contact/ContactForm";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionReveal } from "@/components/ui/SectionReveal";

export function Contact() {
  return (
    <section id="contact" className="relative px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl">
        <SectionReveal>
          <SectionHeading
            eyebrow="Contact"
            title="Ready to Transform Your Museum?"
            description="Bring Digital Twins, AR exhibits, and visitor analytics to your museum. Address: 5214F Diamond Heights Blvd #3378 · Phone: (704) 966-7158 · Email: info@metadigilabs.ai"
          />
        </SectionReveal>

        <SectionReveal>
          <GlassPanel className="mt-12 p-6 md:mt-16 md:p-8">
            <ContactForm />
          </GlassPanel>
        </SectionReveal>
      </div>
    </section>
  );
}
