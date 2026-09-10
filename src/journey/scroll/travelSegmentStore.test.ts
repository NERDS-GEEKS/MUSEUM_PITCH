import { describe, expect, it } from "vitest";
import { JOURNEY_NODES } from "@/journey/constants/nodes";
import {
  clearTravelSegment,
  getTravelSegment,
  setTravelSegment,
} from "./travelSegmentStore";

describe("setTravelSegment", () => {
  it("follows the corridor for adjacent docks", () => {
    setTravelSegment(JOURNEY_NODES[0].dockT, JOURNEY_NODES[1].dockT);
    expect(getTravelSegment()?.mode).toBe("route");
    clearTravelSegment();
  });

  it("follows the stair route when a hop changes floors", () => {
    setTravelSegment(JOURNEY_NODES[0].dockT, JOURNEY_NODES[4].dockT);
    expect(getTravelSegment()?.mode).toBe("route");
    clearTravelSegment();
  });

  it("keeps same-floor skip hops as a straight pan", () => {
    setTravelSegment(JOURNEY_NODES[2].dockT, JOURNEY_NODES[4].dockT);
    expect(getTravelSegment()?.mode).toBe("straight");
    clearTravelSegment();
  });
});
