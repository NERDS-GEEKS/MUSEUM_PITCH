import { describe, expect, it } from "vitest";
import {
  JOURNEY_NODES,
  getActiveNode,
  getGuidanceStatus,
  getNodeProgress,
  isArrivedAtDock,
} from "./nodes";

describe("JOURNEY_NODES", () => {
  it("has 7 pitch slides with required ids", () => {
    expect(JOURNEY_NODES).toHaveLength(7);
    expect(JOURNEY_NODES.map((n) => n.id)).toEqual([
      "welcome",
      "gps-fails",
      "vps",
      "mapping",
      "analytics",
      "industries",
      "complete",
    ]);
    expect(JOURNEY_NODES.filter((n) => n.polish === "peak")).toHaveLength(6);
  });

  it("getActiveNode returns nearest dock center", () => {
    const mid = JOURNEY_NODES[0].dockT;
    expect(getActiveNode(mid).id).toBe("welcome");
  });

  it("hides page content while walking between docks", () => {
    const welcome = JOURNEY_NODES[0];
    const next = JOURNEY_NODES[1];
    expect(isArrivedAtDock(welcome.dockT, 0)).toBe(true);
    expect(isArrivedAtDock(welcome.dockT, 1)).toBe(false);
    const midWalk = (welcome.dockT + next.dockT) / 2;
    expect(isArrivedAtDock(midWalk, 1)).toBe(false);
    expect(isArrivedAtDock(midWalk, 0)).toBe(false);
  });

  it("getNodeProgress returns 0 when progress is past dock band", () => {
    const welcome = JOURNEY_NODES[0];
    const pastBand = welcome.dockT + welcome.dockRadius + 0.01;
    expect(getNodeProgress(pastBand, welcome)).toBe(0);
  });
});

describe("getGuidanceStatus", () => {
  it("points toward the next destination with remaining meters", () => {
    const fromWelcome = JOURNEY_NODES[0].dockT + 0.01;
    const status = getGuidanceStatus(fromWelcome);
    expect(status.next.id).toBe("gps-fails");
    expect(status.metersRemaining).toBeGreaterThan(0);
    expect(status.label.toLowerCase()).toMatch(
      /museum|problem|approaching|next|arriving|google/,
    );
  });
});
