// Refresh the Tridi robot's motions (the easter egg on the Platanus card,
// lib/eggs) from the Tridi repository, next to the portfolio:
// `npm run tridi`.
//
// ONE CYCLE OF A MOTION per file, from clips Tridi retargeted: the
// person's tracking points, as MediaPipe found them in the video, and the
// Unitree G1's joint angles for the same frames, as Tridi retargeted them
// (physics/motions/clip_*.json). The robot is drawn from its angles at
// runtime; the person is drawn from their points. The egg plays the walk,
// then the jacks (RobotEgg).
//
// - WALK (`caminar`): the points from the clip Tridi ships on its landing
//   (web/public/media/caminar.pose2d.json), in the video's own frame.
// - JACKS (jumping jacks, 2026-11-03): seen from the FRONT, so the robot
//   is not drawn from its angles at runtime like the two profiles: its
//   pose is worked out here, through the G1's own joint chain
//   (g1_mjx.xml: every link's offset, axis and rest turn), and written as
//   the same points the person's are, as the camera faces them.
//
// Out: src/data/tridi-{walk,jacks}.json — centimetres, whole numbers, so
// each file stays a couple of kilobytes.
import fs from 'node:fs';

const TRIDI = process.env.TRIDI_DIR ?? new URL('../../../tridi/', import.meta.url).pathname;
const read = path => JSON.parse(fs.readFileSync(`${TRIDI}${path}`, 'utf8'));

// MediaPipe landmarks kept, in this order: nose, then the side facing the
// camera, then the far one — shoulder, elbow, wrist, hip, knee, ankle,
// heel, toe.
const RIGHT = [12, 14, 16, 24, 26, 28, 30, 32];
const LEFT = [11, 13, 15, 23, 25, 27, 29, 31];
// Leg length of an adult, hip to ankle, to set the person's scale.
const LEG_M = 0.86;
// Frames kept of each cycle; the egg interpolates between them.
const KEEP = 24;

const at = (frames, t) => {
  const i = Math.floor(t);
  const k = t - i;
  const a = frames[i];
  const b = frames[Math.min(i + 1, frames.length - 1)];
  return a.map((v, j) => (Array.isArray(v) ? v.map((x, n) => x + (b[j][n] - x) * k) : v + (b[j] - v) * k));
};

const cm = v => Math.round(v * 100);

/**
 * One cycle, FROM to TO (frames where the clip comes back closest to
 * itself, person and robot), as the egg reads it. `point(f, i)` is
 * landmark `i` of frame `f` as [x forward, y up] in any unit; it is
 * scaled to a LEG_M leg.
 */
const cycle = ({ frames, qpos, fps, from, to, near, point, out }) => {
  const order = [0, ...(near === 'right' ? RIGHT : LEFT), ...(near === 'right' ? LEFT : RIGHT)];
  const legOf = f => {
    const [hx, hy] = point(f, 24);
    const [ax, ay] = point(f, 28);
    return Math.hypot(ax - hx, ay - hy);
  };
  let leg = 0;
  for (let i = from; i < to; i++) leg += legOf(frames[i]);
  const scale = LEG_M / (leg / (to - from));

  // The loop's seam: what the cycle's end misses its start by is spread
  // over the whole cycle, so it closes on itself with no jump (the run's
  // end landed 2.7x a normal step from its start, and it showed).
  const human = [];
  const robot = [];
  const personAt = t => {
    const f = at(frames, t);
    const hx = (point(f, 23)[0] + point(f, 24)[0]) / 2;
    const ground = Math.min(...[29, 30, 31, 32].map(p => point(f, p)[1]));
    return order.flatMap(p => [(point(f, p)[0] - hx) * scale, (point(f, p)[1] - ground) * scale]);
  };
  const g1At = t => {
    const q = at(qpos, t);
    return [q[2], q[7], q[10], q[11], q[13], q[16], q[17], q[21], q[22], q[25], q[29], q[32]];
  };
  // Hips' middle at x = 0; the ground (the lowest heel or toe) at y = 0;
  // y up, metres. G1: root height, then the pitch joints the profile
  // shows — left hip, knee, ankle; right hip, knee, ankle; waist; left
  // shoulder, elbow; right shoulder, elbow (qpos: 7 root, 6 + 6 legs, 3
  // waist, 7 + 7 arms). KEEP frames and the cycle's end.
  const times = Array.from({ length: KEEP + 1 }, (_, n) => from + ((to - from) * n) / KEEP);
  const people = times.map(personAt);
  const g1s = times.map(g1At);
  const missH = people[0].map((v, j) => v - people[KEEP][j]);
  const missR = g1s[0].map((v, j) => v - g1s[KEEP][j]);
  for (let n = 0; n < KEEP; n++) {
    const k = n / KEEP;
    human.push(people[n].map((v, j) => cm(v + missH[j] * k)));
    robot.push(g1s[n].map((v, j) => cm(v + missR[j] * k)));
  }

  fs.writeFileSync(
    new URL(`../src/data/${out}`, import.meta.url),
    `${JSON.stringify({ fps: fps * (KEEP / (to - from)), near, human, robot })}\n`,
  );
  console.log(`${out}: ${KEEP} frames, person scale ${scale.toFixed(2)}`);
};

// The walk: the video is 960 x 540, and MediaPipe's x is a share of its
// width, y of its height (down).
{
  const pose = read('web/public/media/caminar.pose2d.json');
  const idx = Object.fromEntries(pose.points.map((p, i) => [p, i]));
  const ASPECT = 960 / 540;
  cycle({
    frames: pose.frames,
    qpos: read('physics/motions/clip_2026-10-23_caminar-perfil_01.json').qpos,
    fps: pose.fps,
    from: 284,
    to: 316,
    near: 'right',
    point: (f, i) => [f[idx[i]][0] * ASPECT, -f[idx[i]][1]],
    out: 'tridi-walk.json',
  });
}

// ----- the jumping jacks, from the front -----

// 3 x 3 rotations and their use; quaternions are [w, x, y, z].
const mul = (A, B) => A.map(r => [0, 1, 2].map(j => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j]));
const apply = (R, v) => R.map(r => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
const plus = (a, b) => a.map((v, i) => v + b[i]);
const axis = (a, t) => {
  const c = Math.cos(t);
  const s = Math.sin(t);
  if (a === 'x') return [[1, 0, 0], [0, c, -s], [0, s, c]];
  if (a === 'y') return [[c, 0, s], [0, 1, 0], [-s, 0, c]];
  return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
};
const quat = ([w, x, y, z]) => [
  [1 - 2 * (y * y + z * z), 2 * (x * y - w * z), 2 * (x * z + w * y)],
  [2 * (x * y + w * z), 1 - 2 * (x * x + z * z), 2 * (y * z - w * x)],
  [2 * (x * z - w * y), 2 * (y * z + w * x), 1 - 2 * (x * x + y * y)],
];
const I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

/** The G1's points at one qpos, x forward, y to its left, z up: head;
 *  left shoulder, elbow, hand, hip, knee, ankle, heel, toe; the same
 *  right (the person's order); then pelvis and chest. Root turned to face
 *  +x, its tilt kept. */
const g1 = q => {
  const root = quat(q.slice(3, 7));
  const heading = Math.atan2(root[1][0], root[0][0]);
  const P = { R: mul(axis('z', -heading), root), p: [0, 0, q[2]] };
  // A link: offset in its parent, rest turn, then its joint.
  const link = (T, pos, rest, ax, angle) => {
    const R = mul(mul(T.R, rest ? quat(rest) : I), ax ? axis(ax, angle) : I);
    return { R, p: plus(T.p, apply(T.R, pos)) };
  };
  const at = (T, v) => plus(T.p, apply(T.R, v));
  const side = s => {
    const o = s === 'left' ? 7 : 13;
    const a = s === 'left' ? 22 : 29;
    const y = s === 'left' ? 1 : -1;
    const hp = link(P, [0, 0.064452 * y, -0.1027], null, 'y', q[o]);
    const hr = link(hp, [0, 0.052 * y, -0.030465], [0.996179, 0, -0.0873386, 0], 'x', q[o + 1]);
    const hy = link(hr, [0.025001, 0, -0.12412], null, 'z', q[o + 2]);
    const kn = link(hy, [-0.078273, 0.0021489 * y, -0.17734], [0.996179, 0, 0.0873386, 0], 'y', q[o + 3]);
    const ap = link(kn, [0, 0, -0.30001], null, 'y', q[o + 4]);
    const ar = link(ap, [0, 0, -0.017558], null, 'x', q[o + 5]);
    const wy = link(P, [0, 0, 0], null, 'z', q[19]);
    const wr = link(wy, [-0.0039635, 0, 0.044], null, 'x', q[20]);
    const torso = link(wr, [0, 0, 0], null, 'y', q[21]);
    const sp = link(torso, [0.0039563, 0.10022 * y, 0.24778], [0.990264, 0.139201 * y, 0, 0], 'y', q[a]);
    const sr = link(sp, [0, 0.038 * y, -0.013831], [0.990268, -0.139172 * y, 0, 0], 'x', q[a + 1]);
    const sy = link(sr, [0, 0.00624 * y, -0.1032], null, 'z', q[a + 2]);
    const el = link(sy, [0.015783, 0, -0.080518], null, 'y', q[a + 3]);
    return {
      torso,
      pts: [sp.p, el.p, at(el, [0.22, 0, -0.01]), hp.p, kn.p, ar.p, at(ar, [-0.05, 0, -0.03]), at(ar, [0.12, 0, -0.03])],
    };
  };
  const L = side('left');
  const R = side('right');
  return [at(L.torso, [0.01, 0, 0.43]), ...L.pts, ...R.pts, P.p, at(L.torso, [0, 0, 0.16])];
};

{
  const clip = read('data/clips/clip_2026-10-24_jumping-jacks-nasm_01.json');
  const frames = clip.frames.map(f => f.joints);
  const qpos = read('physics/motions/clip_2026-10-24_jumping-jacks-nasm_01.json').qpos;
  // The cycle where the clip comes back closest to itself, person and
  // robot together (25 frames, one jack).
  const from = 63;
  const to = 88;
  const ORDER = [0, ...LEFT, ...RIGHT];
  // The camera faces the person: MediaPipe's x is to its right as seen,
  // the person's left. The robot's left (its y) is put there too.
  const personAt = t => {
    const f = at(frames, t);
    const hx = (f[23][0] + f[24][0]) / 2;
    return ORDER.map(p => [f[p][0] - hx, f[p][1]]);
  };
  const g1At = t => {
    const pts = g1(at(qpos, t));
    const cx = pts[17][1];
    return pts.map(p => [p[1] - cx, p[2]]);
  };
  // One ground for the whole cycle, so the jump lifts them off it.
  const range = (fn, scale = 1) => {
    let legs = 0;
    let ground = Infinity;
    for (let n = 0; n < KEEP; n++) {
      const p = fn(from + ((to - from) * n) / KEEP);
      legs += Math.hypot(p[5][0] - p[4][0], p[5][1] - p[4][1]) + Math.hypot(p[6][0] - p[5][0], p[6][1] - p[5][1]);
      ground = Math.min(ground, ...[7, 8, 15, 16].map(i => p[i][1]));
    }
    return { leg: legs / KEEP, ground, scale };
  };
  const H = range(personAt);
  const scale = LEG_M / H.leg;
  const Rg = range(g1At);
  const flat = (fn, ground, k) => t => fn(t).flatMap(([x, y]) => [x * k, (y - ground) * k]);
  const person = flat(personAt, H.ground, scale);
  const robotPts = flat(g1At, Rg.ground, 1);
  const missH = person(from).map((v, j) => v - person(to)[j]);
  const missR = robotPts(from).map((v, j) => v - robotPts(to)[j]);
  const human = [];
  const robot = [];
  for (let n = 0; n < KEEP; n++) {
    const t = from + ((to - from) * n) / KEEP;
    const k = n / KEEP;
    human.push(person(t).map((v, j) => cm(v + missH[j] * k)));
    robot.push(robotPts(t).map((v, j) => cm(v + missR[j] * k)));
  }
  fs.writeFileSync(
    new URL('../src/data/tridi-jacks.json', import.meta.url),
    `${JSON.stringify({ fps: clip.fps * (KEEP / (to - from)), near: 'front', human, robot })}\n`,
  );
  console.log(`tridi-jacks.json: ${KEEP} frames, person scale ${scale.toFixed(2)}`);
}
