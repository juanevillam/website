import WALK from '../data/tridi-walk.json';
import { fit, holdable, release, run } from './eggs';

/**
 * TRIDI'S ROBOT, across the foot of the page (RobotEgg). Tridi turns a
 * video of a person into movement for a robot; this is that, one walk
 * long, from Tridi's own data (`npm run tridi` → data/tridi-walk.json):
 * the person's tracking points as MediaPipe found them in the video,
 * walking in, in Tridi's lime, square joints and all; halfway across they
 * become the Unitree G1 that Tridi retargeted them to — its own joint
 * angles for the same frames, drawn in profile from the G1's real link
 * lengths — and the robot walks on.
 */

const LIME = '#c8ff2e';
const NEAR = '#f5f5f5';
const FAR = '#737373';
const JOINT = '#222222';

type P = [number, number];
const N = WALK.human.length;

/** One walk frame at any time: the two nearest, blended. */
const at = (frames: number[][], t: number) => {
  const f = (((t * WALK.fps) % N) + N) % N;
  const i = Math.floor(f);
  const k = f - i;
  const a = frames[i];
  const b = frames[(i + 1) % N];
  return a.map((v, j) => (v + (b[j] - v) * k) / 100);
};

// ----- the robot: the G1's pitch chain, in metres, x forward, z up -----
const rot = ([x, z]: P, t: number): P => [x * Math.cos(t) + z * Math.sin(t), -x * Math.sin(t) + z * Math.cos(t)];
const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];

/** A leg from the hip: knee, ankle, heel, toe (g1.xml's offsets). */
const leg = (hip: P, h: number, k: number, a: number): P[] => {
  const knee = add(hip, rot([-0.053, -0.332], h));
  const ankle = add(knee, rot([0, -0.3], h + k));
  return [knee, ankle, add(ankle, rot([-0.05, -0.048], h + k + a)), add(ankle, rot([0.12, -0.048], h + k + a))];
};

/** An arm from the shoulder: elbow, hand. */
const arm = (sh: P, body: number, s: number, e: number): P[] => {
  const elbow = add(sh, rot([0.016, -0.198], body + s));
  return [elbow, add(elbow, rot([0.21, -0.01], body + s + e))];
};

const robotAt = (t: number) => {
  // root height; left hip, knee, ankle; right hip, knee, ankle; waist;
  // left shoulder, elbow; right shoulder, elbow
  const [, lh, lk, la, rh, rk, ra, w, ls, le, rs, re] = at(WALK.robot, t);
  const hip: P = [0, 0];
  const left = leg(hip, lh, lk, la);
  const right = leg(hip, rh, rk, ra);
  const waist = rot([0, 0.147], 0);
  const shoulder = add(waist, rot([0, 0.248], w));
  // Standing on the lower foot: the floor is where its sole is.
  const floor = Math.min(left[2][1], left[3][1], right[2][1], right[3][1]) - 0.005;
  const lift = (p: P): P => [p[0], p[1] - floor];
  return {
    hip: lift(hip),
    waist: lift(waist),
    shoulder: lift(shoulder),
    head: lift(add(shoulder, rot([0.01, 0.15], w))),
    body: w,
    // The person faces the camera with their right side; so does the
    // robot: right is near, left is far.
    near: { leg: right.map(lift), arm: arm(shoulder, w, rs, re).map(lift) },
    far: { leg: left.map(lift), arm: arm(shoulder, w, ls, le).map(lift) },
  };
};

// ----- the person: MediaPipe's points, already in metres -----
// Order (scripts/sync-tridi): nose; near shoulder, elbow, wrist, hip,
// knee, ankle, heel, toe; the same far.
const FAR_BONES = [[9, 10], [10, 11], [12, 13], [13, 14], [14, 15], [15, 16], [14, 16], [9, 12]];
const NEAR_BONES = [[1, 9], [4, 12], [1, 4], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [7, 8], [6, 8]];

/** How fast a figure walks, so its planted foot stays planted: the
 *  backward speed of whichever foot is lowest, over the cycle. */
const pace = (feet: (t: number) => P[]) => {
  const speeds: number[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / WALK.fps;
    const a = feet(t);
    const b = feet(t + 1 / WALK.fps);
    let low = 0;
    a.forEach((p, j) => p[1] < a[low][1] && (low = j));
    speeds.push(-(b[low][0] - a[low][0]) * WALK.fps);
  }
  return speeds.sort((x, y) => x - y)[N >> 1];
};

const humanAt = (t: number) => {
  const v = at(WALK.human, t);
  const pts: P[] = [];
  for (let i = 0; i < v.length; i += 2) pts.push([v[i], v[i + 1]]);
  return pts;
};

const HUMAN_PACE = pace(t => [7, 8, 15, 16].map(i => humanAt(t)[i]));
const ROBOT_PACE = pace(t => {
  const r = robotAt(t);
  return [...r.near.leg.slice(2), ...r.far.leg.slice(2)];
});

/** The figure's painter on `band` (the canvas over the foot's empty
 *  middle): `paint(x, t, k)` draws it with its hips at x px, `t` s into
 *  the walk, `k` of the way from the person to the robot. */
const stage = (band: HTMLCanvasElement) => {
  const { ctx, width: W, height: H } = fit(band);
  const ground = H - 6;
  // Pixels per metre: the robot (1.32 m) about 70 px on a desk, 56 on a
  // phone.
  const m = W < 768 ? 42 : 54;
  let x = 0;
  let t = 0;

  const screen = ([px, pz]: P): P => [x + px * m, ground - pz * m];
  const line = (a: P, b: P, w: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(...screen(a));
    ctx.lineTo(...screen(b));
    ctx.stroke();
  };
  const drawHuman = (alpha: number) => {
    const pts = humanAt(t);
    ctx.lineCap = 'round';
    for (const [bones, a] of [[FAR_BONES, 0.35], [NEAR_BONES, 1]] as const) {
      ctx.globalAlpha = alpha * a;
      for (const [i, j] of bones) line(pts[i], pts[j], 1.2, LIME);
    }
    // The head where Tridi draws it: a ring behind the nose.
    ctx.globalAlpha = alpha;
    const head: P = [pts[0][0] - 0.07, pts[0][1] - 0.02];
    line(pts[1], [head[0], head[1] - 0.09], 1.2, LIME);
    const [hx, hy] = screen(head);
    ctx.beginPath();
    ctx.arc(hx, hy, 0.09 * m, 0, Math.PI * 2);
    ctx.stroke();
    // Square joints, the way Tridi's keypoints are drawn.
    ctx.fillStyle = LIME;
    pts.forEach((p, i) => {
      ctx.globalAlpha = alpha * (i >= 9 ? 0.35 : 1);
      const [sx, sy] = screen(p);
      ctx.fillRect(sx - 1.5, sy - 1.5, 3, 3);
    });
    ctx.globalAlpha = 1;
  };

  const drawRobot = (alpha: number) => {
    const r = robotAt(t);
    ctx.globalAlpha = alpha;
    ctx.lineCap = 'round';
    const limb = (side: typeof r.near, color: string) => {
      const [knee, ankle, heel, toe] = side.leg;
      line(r.hip, knee, 0.085 * m, color);
      line(knee, ankle, 0.07 * m, color);
      line(heel, toe, 0.04 * m, color);
      line(ankle, [(heel[0] + toe[0]) / 2, (heel[1] + toe[1]) / 2], 0.05 * m, color);
      const [elbow, hand] = side.arm;
      line(r.shoulder, elbow, 0.06 * m, color);
      line(elbow, hand, 0.05 * m, color);
      // The motors at knee and elbow, dark, as on the G1.
      for (const j of [knee, elbow]) {
        const [jx, jy] = screen(j);
        ctx.fillStyle = JOINT;
        ctx.beginPath();
        ctx.arc(jx, jy, 0.022 * m, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    limb(r.far, FAR);
    // Pelvis and torso, then the head with its dark face.
    line(r.hip, r.waist, 0.14 * m, NEAR);
    line(r.waist, r.shoulder, 0.17 * m, NEAR);
    const [hx, hy] = screen(r.head);
    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(r.body);
    ctx.fillStyle = NEAR;
    ctx.beginPath();
    ctx.roundRect(-0.065 * m, -0.08 * m, 0.13 * m, 0.16 * m, 0.05 * m);
    ctx.fill();
    ctx.fillStyle = JOINT;
    ctx.beginPath();
    ctx.roundRect(0.015 * m, -0.045 * m, 0.05 * m, 0.07 * m, 0.02 * m);
    ctx.fill();
    ctx.restore();
    limb(r.near, NEAR);
    ctx.globalAlpha = 1;
  };

  return {
    W,
    m,
    paint(nx: number, nt: number, k: number) {
      x = nx;
      t = nt;
      ctx.clearRect(0, 0, W, H);
      if (k < 1) drawHuman(1 - k);
      if (k > 0) drawRobot(k);
    },
  };
};

/** One walk across `band`, the link riding with the figure. Resolves
 *  when it is gone. */
export const walk = async (band: HTMLCanvasElement, link: HTMLAnchorElement) => {
  band.hidden = false;
  link.hidden = false;
  const { W, m, paint } = stage(band);
  const rate = holdable(link);
  // Where the person becomes the robot, and how long it takes.
  const handover = W * (W < 768 ? 0.3 : 0.34);
  const MORPH = 0.8;
  let x = -0.6 * m;
  let t = 0;
  let morph = -1;

  const ended = await run(dt => {
    dt *= rate(dt);
    t += dt;
    if (morph < 0 && x >= handover) morph = 0;
    if (morph >= 0) morph = Math.min(1, morph + dt / MORPH);
    const k = Math.max(0, morph);
    x += (HUMAN_PACE + (ROBOT_PACE - HUMAN_PACE) * k) * m * dt;
    paint(x, t, k);
    link.style.transform = `translate(${(x - 0.4 * m).toFixed(1)}px, 0)`;
    return x < W + 0.6 * m;
  });

  if (!ended) {
    band.style.opacity = '0';
    await new Promise(r => setTimeout(r, 300));
    band.style.opacity = '';
  }
  link.hidden = true;
  band.hidden = true;
  release(band);
};

/** Reduced motion: the robot stands still for a moment, then fades. */
export const stand = async (band: HTMLCanvasElement, link: HTMLAnchorElement) => {
  band.hidden = false;
  link.hidden = false;
  const { W, m, paint } = stage(band);
  const x = W * 0.3;
  paint(x, 0.45, 1);
  link.style.transform = `translate(${x - 0.4 * m}px, 0)`;
  band.classList.add('is-still');
  await new Promise(res => setTimeout(res, 8000));
  band.classList.remove('is-still');
  await new Promise(res => setTimeout(res, 600));
  link.hidden = true;
  band.hidden = true;
  release(band);
};
