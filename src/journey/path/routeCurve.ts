type Vec3 = { x: number; y: number; z: number };

const SAMPLE_STEPS = 32;

function toVec3(point: readonly [number, number, number]): Vec3 {
  return { x: point[0], y: point[1], z: point[2] };
}

function cloneVec3(point: Vec3): Vec3 {
  return { x: point.x, y: point.y, z: point.z };
}

function distance(a: Vec3, b: Vec3): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  return Math.hypot(dx, dy, dz);
}

function catmullRomPoint(
  p0: Vec3,
  p1: Vec3,
  p2: Vec3,
  p3: Vec3,
  t: number,
): Vec3 {
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
    z:
      0.5 *
      (2 * p1.z +
        (-p0.z + p2.z) * t +
        (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 +
        (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3),
  };
}

function catmullRomTangent(
  p0: Vec3,
  p1: Vec3,
  p2: Vec3,
  p3: Vec3,
  t: number,
): Vec3 {
  const t2 = t * t;

  return {
    x:
      0.5 *
      (-p0.x +
        p2.x +
        2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t +
        3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t2),
    y:
      0.5 *
      (-p0.y +
        p2.y +
        2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t +
        3 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t2),
    z:
      0.5 *
      (-p0.z +
        p2.z +
        2 * (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t +
        3 * (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t2),
  };
}

function normalize(vector: Vec3): Vec3 {
  const length = Math.hypot(vector.x, vector.y, vector.z);
  if (length === 0) {
    return { x: 0, y: 0, z: 1 };
  }
  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length,
  };
}

type CurveSample = {
  point: Vec3;
  tangent: Vec3;
  u: number;
};

function buildSamples(points: readonly [number, number, number][]): CurveSample[] {
  if (points.length < 2) {
    throw new Error("createRouteCurve requires at least two points");
  }

  const controlPoints = points.map(toVec3);
  const samples: CurveSample[] = [];
  let cumulativeLength = 0;

  for (let segmentIndex = 0; segmentIndex < controlPoints.length - 1; segmentIndex += 1) {
    const p0 = controlPoints[Math.max(0, segmentIndex - 1)];
    const p1 = controlPoints[segmentIndex];
    const p2 = controlPoints[segmentIndex + 1];
    const p3 = controlPoints[Math.min(controlPoints.length - 1, segmentIndex + 2)];

    for (let step = 0; step <= SAMPLE_STEPS; step += 1) {
      if (segmentIndex > 0 && step === 0) {
        continue;
      }

      const localT = step / SAMPLE_STEPS;
      const point = catmullRomPoint(p0, p1, p2, p3, localT);
      const tangent = normalize(catmullRomTangent(p0, p1, p2, p3, localT));

      if (samples.length > 0) {
        cumulativeLength += distance(samples[samples.length - 1].point, point);
      }

      samples.push({
        point: cloneVec3(point),
        tangent,
        u: cumulativeLength,
      });
    }
  }

  const totalLength = samples[samples.length - 1]?.u ?? 0;
  if (totalLength > 0) {
    for (const sample of samples) {
      sample.u /= totalLength;
    }
  }

  return samples;
}

function sampleAt(samples: CurveSample[], t: number): CurveSample {
  const clamped = Math.min(1, Math.max(0, t));

  if (samples.length === 1) {
    return samples[0];
  }

  let low = 0;
  let high = samples.length - 1;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (samples[mid].u < clamped) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  const index = low;
  const previous = samples[Math.max(0, index - 1)];
  const current = samples[index];
  const span = current.u - previous.u;
  const local = span === 0 ? 0 : (clamped - previous.u) / span;
  const blend = Math.min(1, Math.max(0, local));

  return {
    point: {
      x: previous.point.x + (current.point.x - previous.point.x) * blend,
      y: previous.point.y + (current.point.y - previous.point.y) * blend,
      z: previous.point.z + (current.point.z - previous.point.z) * blend,
    },
    tangent: normalize({
      x: previous.tangent.x + (current.tangent.x - previous.tangent.x) * blend,
      y: previous.tangent.y + (current.tangent.y - previous.tangent.y) * blend,
      z: previous.tangent.z + (current.tangent.z - previous.tangent.z) * blend,
    }),
    u: clamped,
  };
}

export function createRouteCurve(points: readonly [number, number, number][]): {
  getPointAt: (t: number) => { x: number; y: number; z: number };
  getTangentAt: (t: number) => { x: number; y: number; z: number };
} {
  const samples = buildSamples(points);

  return {
    getPointAt(t: number) {
      return sampleAt(samples, t).point;
    },
    getTangentAt(t: number) {
      return sampleAt(samples, t).tangent;
    },
  };
}

/**
 * Straight-line polyline by arc length - no Catmull overshoot through walls.
 */
export function createLinearRouteCurve(
  points: readonly [number, number, number][],
): {
  getPointAt: (t: number) => { x: number; y: number; z: number };
  getTangentAt: (t: number) => { x: number; y: number; z: number };
} {
  if (points.length < 2) {
    throw new Error("createLinearRouteCurve requires at least two points");
  }

  const verts = points.map(toVec3);
  const segLens: number[] = [];
  let total = 0;
  for (let i = 0; i < verts.length - 1; i += 1) {
    const len = distance(verts[i], verts[i + 1]);
    segLens.push(len);
    total += len;
  }

  function at(t: number): CurveSample {
    const clamped = Math.min(1, Math.max(0, t));
    if (total <= 0) {
      return {
        point: cloneVec3(verts[0]),
        tangent: { x: 0, y: 0, z: 1 },
        u: clamped,
      };
    }

    let target = clamped * total;
    for (let i = 0; i < segLens.length; i += 1) {
      const len = segLens[i];
      if (target <= len || i === segLens.length - 1) {
        const local = len === 0 ? 0 : Math.min(1, target / len);
        const a = verts[i];
        const b = verts[i + 1];
        return {
          point: {
            x: a.x + (b.x - a.x) * local,
            y: a.y + (b.y - a.y) * local,
            z: a.z + (b.z - a.z) * local,
          },
          tangent: normalize({
            x: b.x - a.x,
            y: b.y - a.y,
            z: b.z - a.z,
          }),
          u: clamped,
        };
      }
      target -= len;
    }

    const last = verts[verts.length - 1];
    const prev = verts[verts.length - 2];
    return {
      point: cloneVec3(last),
      tangent: normalize({
        x: last.x - prev.x,
        y: last.y - prev.y,
        z: last.z - prev.z,
      }),
      u: 1,
    };
  }

  return {
    getPointAt(t: number) {
      return at(t).point;
    },
    getTangentAt(t: number) {
      return at(t).tangent;
    },
  };
}
