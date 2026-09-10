import { JOURNEY_NODES } from "@/journey/constants/nodes";
import { DestinationCard } from "@/journey/overlays/DestinationCard";

function nodeById(id: string) {
  const node = JOURNEY_NODES.find((entry) => entry.id === id);
  if (!node) {
    throw new Error(`Unknown journey node id: ${id}`);
  }
  return node;
}

/** Shared placeholder shell - title/body from JOURNEY_NODES only. */
export function PlaceholderDestinationCard({ id }: { id: string }) {
  const node = nodeById(id);
  return (
    <DestinationCard
      title={node.title}
      subtitle={node.subtitle}
      body={node.body}
    />
  );
}
