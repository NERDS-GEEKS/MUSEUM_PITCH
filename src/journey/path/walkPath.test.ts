import { describe, expect, it } from "vitest";
import {
  FLOOR_RISE,
  ROOM_DOCK_T,
  STAIR_HALLS,
  STORY_ROOMS,
  STEP_RISE,
  WALK_WAYPOINTS,
  floorForIndex,
  floorFromY,
  isStairClimbY,
  isStairHallRevealed,
  roomLookSign,
  snapStairY,
} from "./walkPath";

describe("museum floors", () => {
  it("places slides 1–2 on ground, 3–5 on first, 6–7 on second", () => {
    expect(STORY_ROOMS.map((room) => room.floor)).toEqual([
      0, 0, 1, 1, 1, 2, 2,
    ]);
    expect(floorForIndex(1)).toBe(0);
    expect(floorForIndex(2)).toBe(1);
    expect(floorForIndex(5)).toBe(2);
  });

  it("stacks the first-floor arrival over the ground stair gallery", () => {
    const problem = STORY_ROOMS[1];
    const twin = STORY_ROOMS[2];
    expect(twin.center[0]).toBeCloseTo(problem.center[0], 5);
    expect(twin.center[2]).toBeCloseTo(problem.center[2], 5);
    expect(twin.center[1]).toBeCloseTo(problem.center[1] + FLOOR_RISE, 5);

    const insights = STORY_ROOMS[4];
    const convert = STORY_ROOMS[5];
    expect(convert.center[0]).toBeCloseTo(insights.center[0], 5);
    expect(convert.center[2]).toBeCloseTo(insights.center[2], 5);
    expect(convert.center[1]).toBeCloseTo(insights.center[1] + FLOOR_RISE, 5);
  });

  it("uses the same gallery step as first-floor 3→4", () => {
    const welcome = STORY_ROOMS[0];
    const problem = STORY_ROOMS[1];
    const twin = STORY_ROOMS[2];
    const navigate = STORY_ROOMS[3];
    expect(Math.abs(problem.center[2] - welcome.center[2])).toBeCloseTo(
      Math.abs(navigate.center[2] - twin.center[2]),
      5,
    );
    expect(Math.abs(problem.center[0] - welcome.center[0])).toBeCloseTo(
      Math.abs(navigate.center[0] - twin.center[0]),
      5,
    );
    expect(welcome.side).toBe("left");
    expect(problem.side).toBe("right");
  });

  it("reads the standing floor from path height", () => {
    expect(floorFromY(0)).toBe(0);
    expect(floorFromY(FLOOR_RISE)).toBe(1);
    expect(floorFromY(FLOOR_RISE * 2)).toBe(2);
    expect(isStairClimbY(0)).toBe(false);
    expect(isStairClimbY(FLOOR_RISE / 2)).toBe(true);
    expect(snapStairY(STEP_RISE * 3.2)).toBeCloseTo(STEP_RISE * 3, 5);
  });
});

describe("building stairwells", () => {
  it("builds two wells (ground→first at the north, first→second at the south)", () => {
    expect(STAIR_HALLS).toHaveLength(2);
    expect(STAIR_HALLS[0]?.fromFloor).toBe(0);
    expect(STAIR_HALLS[0]?.toFloor).toBe(1);
    expect(STAIR_HALLS[0]?.zDir).toBe(1);
    expect(STAIR_HALLS[1]?.fromFloor).toBe(1);
    expect(STAIR_HALLS[1]?.toFloor).toBe(2);
    expect(STAIR_HALLS[1]?.zDir).toBe(-1);
  });

  it("does not add a long first-floor approach hall", () => {
    const twin = STORY_ROOMS[2];
    const stair = STAIR_HALLS[0];
    expect(Math.abs(twin.center[0] - stair.anchorX)).toBeLessThan(0.2);
    expect(Math.abs(twin.center[2] - stair.doorZ)).toBeLessThan(twin.size[1]);
  });

  it("climbs 10 steps, turns on the landing, then 10 steps back up to the floor above", () => {
    const hall = STAIR_HALLS[0];
    const climb = WALK_WAYPOINTS.filter(
      (point) =>
        point[2] >= hall.hallZ0 &&
        point[2] <= hall.hallZ1 &&
        point[1] >= hall.bottomY - 0.05 &&
        point[1] <= hall.topY + 0.05,
    );

    const firstFlight = climb.filter(
      (point) =>
        Math.abs(point[0] - hall.flight1X) < 0.12 &&
        point[1] < hall.midY - 0.05,
    );
    const landing = climb.filter(
      (point) => Math.abs(point[1] - hall.midY) < 0.08,
    );
    const secondFlight = climb.filter(
      (point) =>
        Math.abs(point[0] - hall.flight2X) < 0.12 &&
        point[1] > hall.midY + 0.05 &&
        point[1] < hall.topY - 0.05,
    );

    expect(firstFlight.length).toBeGreaterThanOrEqual(8);
    expect(secondFlight.length).toBeGreaterThanOrEqual(8);
    expect(landing.some((point) => point[0] <= hall.flight1X + 0.2)).toBe(true);
    expect(landing.some((point) => point[0] >= hall.flight2X - 0.2)).toBe(true);

    const firstZ0 = firstFlight[0]?.[2] ?? 0;
    const firstZ1 = firstFlight[firstFlight.length - 1]?.[2] ?? 0;
    const secondZ0 = secondFlight[0]?.[2] ?? 0;
    const secondZ1 = secondFlight[secondFlight.length - 1]?.[2] ?? 0;
    expect(firstZ1).toBeGreaterThan(firstZ0);
    expect(secondZ1).toBeLessThan(secondZ0);
  });

  it("hides the next stairwell until the last gallery on that floor", () => {
    const hall = STAIR_HALLS[0];
    expect(isStairHallRevealed(hall, 0, ROOM_DOCK_T[0])).toBe(false);
    expect(isStairHallRevealed(hall, 0, ROOM_DOCK_T[1])).toBe(true);
    expect(isStairHallRevealed(hall, 1, ROOM_DOCK_T[2])).toBe(true);
  });

  it("never teleports between floors", () => {
    for (let i = 1; i < WALK_WAYPOINTS.length; i++) {
      const prev = WALK_WAYPOINTS[i - 1];
      const curr = WALK_WAYPOINTS[i];
      const rise = Math.abs(curr[1] - prev[1]);
      expect(rise).toBeLessThanOrEqual(STEP_RISE * 2.2);
    }
  });

  it("walks south out of first-floor rooms, including the south stair", () => {
    for (const idx of [2, 3, 4]) {
      const room = STORY_ROOMS[idx];
      let best = 0;
      let bestDist = Infinity;
      WALK_WAYPOINTS.forEach((point, i) => {
        const dist = Math.hypot(
          point[0] - room.center[0],
          point[1] - room.center[1],
          point[2] - room.center[2],
        );
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      const next = WALK_WAYPOINTS[best + 1];
      expect(next).toBeDefined();
      expect(next[2]).toBeLessThan(room.center[2]);
    }

    const insights = STORY_ROOMS[4];
    const hall = STAIR_HALLS[1];
    expect(hall.zDir).toBe(-1);
    expect(hall.doorZ).toBeLessThan(insights.center[2]);
  });
});

describe("room look direction", () => {
  it("faces south on the first floor and north on the other floors", () => {
    expect(STORY_ROOMS.map((_, index) => roomLookSign(index))).toEqual([
      1, 1, -1, -1, -1, 1, 1,
    ]);
  });
});
