import { Button } from "@/components/ui/Button";
import { CALENDLY_DEMO_URL } from "@/constants/contact";
import { DestinationCard } from "@/journey/overlays/DestinationCard";

const CMS_FEATURES = [
  "Add New Exhibits",
  "Upload Audio Guides",
  "Add Videos",
  "Create School Tours",
  "Temporary Exhibitions",
  "Multi-language Content",
] as const;

export function BookDemoCard({ onClose }: { onClose?: () => void }) {
  return (
    <DestinationCard
      className="max-w-none p-2.5 text-left sm:p-4 md:p-6 lg:p-8 [@media(max-height:720px)]:p-2"
      title="Update Stories Without Rebuilding the Museum."
      subtitle="Curator CMS"
      body="Curators add exhibits, audio, video, school tours, and temporary exhibitions without rebuilding the Digital Twin."
      onClose={onClose}
      showCtas={false}
    >
      <ul
        className="mb-3 grid grid-cols-2 gap-1.5 sm:mb-4 sm:grid-cols-3 sm:gap-2"
        aria-label="Curator CMS features"
      >
        {CMS_FEATURES.map((feature) => (
          <li
            key={feature}
            className="rounded-lg border border-nm-border/60 bg-nm-secondary/40 px-2 py-1.5 text-[10px] font-medium leading-snug text-nm-text sm:rounded-xl sm:px-2.5 sm:text-xs"
          >
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-3 sm:mt-4">
        <Button
          href={CALENDLY_DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="md"
        >
          Schedule a Demo
        </Button>
      </div>
    </DestinationCard>
  );
}
