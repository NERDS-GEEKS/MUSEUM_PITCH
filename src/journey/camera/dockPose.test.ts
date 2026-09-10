import { Vector3 } from "three";
import { describe, expect, it } from "vitest";
import { poseAtDock } from "./dockPose";
import { ROOM_DOCK_T, STORY_ROOMS } from "@/journey/path/walkPath";

function lookDeltaZ(dockT: number): number {
  const pos = new Vector3();
  const look = new Vector3();
  poseAtDock(dockT, pos, look);
  return look.z - pos.z;
}

describe("poseAtDock facing", () => {
  it("looks north through ground-floor and second-floor galleries", () => {
    for (const idx of [0, 1, 5]) {
      expect(lookDeltaZ(ROOM_DOCK_T[idx])).toBeGreaterThan(2);
      const pos = new Vector3();
      const look = new Vector3();
      poseAtDock(ROOM_DOCK_T[idx], pos, look);
      expect(pos.z).toBeLessThan(STORY_ROOMS[idx].center[2]);
    }
  });

  it("looks south through first-floor galleries so the next room is ahead", () => {
    for (const idx of [2, 3, 4]) {
      expect(lookDeltaZ(ROOM_DOCK_T[idx])).toBeLessThan(-2);
      const pos = new Vector3();
      const look = new Vector3();
      poseAtDock(ROOM_DOCK_T[idx], pos, look);
      expect(pos.z).toBeGreaterThan(STORY_ROOMS[idx].center[2]);
    }
  });

  it("keeps the finish room looking along the route", () => {
    expect(lookDeltaZ(ROOM_DOCK_T[6])).toBeGreaterThan(2);
  });
});
