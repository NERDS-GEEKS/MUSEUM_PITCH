import { pointAtProgress } from "@/journey/camera/dockPose";
import {
  STAIR_HALLS,
  floorFromY,
  isStairHallRevealed,
  type MuseumFloor,
  type StairHallSpec,
} from "@/journey/path/walkPath";
import { useJourneyProgressStore } from "@/journey/scroll/useJourneyProgress";
import { useSyncExternalStore } from "react";

function floorSnapshot(progress: number): MuseumFloor {
  return floorFromY(pointAtProgress(progress).y);
}

function revealedStairKey(progress: number): string {
  const floor = floorSnapshot(progress);
  return STAIR_HALLS.filter((hall) =>
    isStairHallRevealed(hall, floor, progress),
  )
    .map((hall) => `${hall.fromFloor}-${hall.toFloor}`)
    .join(",");
}

/** Floor the visitor is standing on. Re-renders only when the floor changes. */
export function useVisibleMuseumFloor(): MuseumFloor {
  const store = useJourneyProgressStore();
  return useSyncExternalStore(
    (onStoreChange) => store.subscribe(() => onStoreChange()),
    () => floorSnapshot(store.progress),
    () => floorSnapshot(store.progress),
  );
}

/** Stairwells that should exist in the current view. */
export function useRevealedStairHalls(): StairHallSpec[] {
  const store = useJourneyProgressStore();
  const key = useSyncExternalStore(
    (onStoreChange) => store.subscribe(() => onStoreChange()),
    () => revealedStairKey(store.progress),
    () => revealedStairKey(store.progress),
  );
  if (!key) return [];
  return STAIR_HALLS.filter(
    (hall) => key.split(",").includes(`${hall.fromFloor}-${hall.toFloor}`),
  );
}
