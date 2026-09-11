import { Vector3 } from "three";
import { afterEach, describe, expect, it } from "vitest";
import { poseAtDock } from "./dockPose";
import { setWelcomeBeat } from "./galleryWallStore";
import {
  ROOM_DOCK_T,
  STORY_ROOMS,
  roomLookSign,
} from "@/journey/path/walkPath";

function pose(dockT: number): { pos: Vector3; look: Vector3 } {
  const pos = new Vector3();
  const look = new Vector3();
  poseAtDock(dockT, pos, look);
  return { pos, look };
}

afterEach(() => {
  setWelcomeBeat("video");
});

describe("poseAtDock facing", () => {
  it("looks straight at Welcome's left video wall (centered robot view)", () => {
    setWelcomeBeat("video");
    const room = STORY_ROOMS[0];
    const { pos, look } = pose(ROOM_DOCK_T[0]);
    const lookSign = roomLookSign(0);
    expect(look.x - pos.x).toBeGreaterThan(lookSign * 2);
    expect(Math.abs(look.z - pos.z)).toBeLessThan(0.05);
    expect(Math.abs(look.y - pos.y)).toBeLessThan(0.05);
    expect(pos.y).toBeGreaterThan(room.center[1] + 1);
  });

  it("looks straight at Welcome's right story wall on the second beat", () => {
    setWelcomeBeat("story");
    const { pos, look } = pose(ROOM_DOCK_T[0]);
    const lookSign = roomLookSign(0);
    expect(look.x - pos.x).toBeLessThan(-lookSign * 2);
    expect(Math.abs(look.z - pos.z)).toBeLessThan(0.05);
  });

  it("looks straight at the right content wall in later galleries", () => {
    for (const idx of [1, 2, 3, 4, 5]) {
      const { pos, look } = pose(ROOM_DOCK_T[idx]);
      const lookSign = roomLookSign(idx);
      const wallSign = -lookSign;
      expect((look.x - pos.x) * wallSign).toBeGreaterThan(2);
      expect(Math.abs(look.z - pos.z)).toBeLessThan(0.05);
    }
  });

  it("keeps the finish room looking along the route", () => {
    const { pos, look } = pose(ROOM_DOCK_T[6]);
    expect(look.z - pos.z).toBeGreaterThan(2);
  });

  it("on a phone still faces the story plaque head-on", () => {
    const pos = new Vector3();
    const look = new Vector3();
    poseAtDock(ROOM_DOCK_T[0], pos, look, 9 / 19.5, 390);
    expect(Math.abs(look.x - pos.x)).toBeGreaterThan(3);
    expect(Math.abs(look.z - pos.z)).toBeLessThan(0.05);
    expect(Math.abs(look.y - pos.y)).toBeLessThan(0.05);
  });

  it("on a tablet frame looks at the plaque center", () => {
    const pos = new Vector3();
    const look = new Vector3();
    poseAtDock(ROOM_DOCK_T[1], pos, look, 768 / 1024, 768);
    expect(Math.abs(look.y - pos.y)).toBeLessThan(0.05);
    expect(Math.abs(look.z - pos.z)).toBeLessThan(0.05);
  });
});
