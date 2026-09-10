import { JourneyCamera } from "@/journey/camera/JourneyCamera";
import { JOURNEY_NODES } from "@/journey/constants/nodes";
import { useVisibleMuseumFloor } from "@/journey/hooks/useVisibleMuseumFloor";
import { OpeningWorldExtras } from "@/journey/opening/OpeningWorldExtras";
import { LandmarkScreenBridge } from "@/journey/overlays/LandmarkScreenBridge";
import { floorForIndex } from "@/journey/path/walkPath";
import { CorridorExhibits } from "@/journey/world/CorridorExhibits";
import { EndWallFooter } from "@/journey/world/EndWallFooter";
import { EndWallLogos } from "@/journey/world/EndWallLogos";
import { MuseumDecor } from "@/journey/world/MuseumDecor";
import { NavCompanionBot } from "@/journey/world/NavCompanionBot";
import { NodeLandmark } from "@/journey/world/NodeLandmark";
import { RoutePath } from "@/journey/world/RoutePath";
import { World } from "@/journey/world/World";
import { Suspense } from "react";

export function JourneyScene({
  openingActive = false,
}: {
  openingActive?: boolean;
}) {
  const visibleFloor = useVisibleMuseumFloor();
  const floorNodes = JOURNEY_NODES.filter(
    (node) => floorForIndex(node.index - 1) === visibleFloor,
  );

  return (
    <>
      <Suspense fallback={null}>
        <World />
        <MuseumDecor />
      </Suspense>
      <OpeningWorldExtras active={false} />
      <RoutePath showArrow={!openingActive} />
      <Suspense fallback={null}>
        <CorridorExhibits />
        {visibleFloor === 2 ? (
          <>
            <EndWallLogos />
            <EndWallFooter />
          </>
        ) : null}
      </Suspense>
      {/* Hidden during intro pan-out; joins after Welcome */}
      <NavCompanionBot active={!openingActive} />
      {floorNodes.map((node) => (
        <NodeLandmark key={node.id} node={node} />
      ))}
      <LandmarkScreenBridge />
      <JourneyCamera followTight={openingActive} />
    </>
  );
}
