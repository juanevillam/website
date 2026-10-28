import WALK from '../data/tridi-walk.json';
import { fit, holdable, release, run } from './eggs';

/**
 * TRIDI'S ROBOT (RobotEgg): on top of Platanus Hack 26 Caracas's photo
 * frame, where Tridi is told, and across the foot of the page. Tridi
 * turns a video of a person into movement for a robot; this is that, one
 * walk long, from Tridi's own data (`npm run tridi` → data/tridi-walk.json):
 * the person's tracking points as MediaPipe found them in the video walk
 * in, in Tridi's lime, square joints and all; then each point flies to
 * its joint on the Unitree G1 Tridi retargeted them to — the robot's own
 * joint angles for the same frames, drawn in profile from the G1's real
 * link lengths — and the robot walks on.
 */

const LIME = '#c8ff2e';
// The G1: light shells over dark motors. Near side lit, far side in shade.
const SHELL = { near: ['#c9c9c9', '#f5f5f5'], far: ['#4a4a4a', '#6b6b6b'] };
const MOTOR = '#2a2a2a';
const MOTOR_RIM = '#5c5c5c';
const DARK = '#1c1c1c';

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

/** Where the person's points land on the robot, in the same order as
 *  the points (scripts/sync-tridi): nose, near side, far side. */
const jointsOf = (r: ReturnType<typeof robotAt>): P[] => [
  r.head,
  r.shoulder, r.near.arm[0], r.near.arm[1], r.hip, ...r.near.leg,
  r.shoulder, r.far.arm[0], r.far.arm[1], r.hip, ...r.far.leg,
];

const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

/** The figure's painter on `band`: `paint(x, t, k)` draws it with its
 *  hips at x px, `t` s into the walk, `k` of the way from the person to
 *  the robot; `fade` dims it near the band's ends. */
const stage = (band: HTMLCanvasElement) => {
  const { ctx, width: W, height: H } = fit(band);
  const ground = H - 4;
  // Pixels per metre: the robot (1.32 m) about 70 px on a desk, 55 on a
  // phone.
  const m = W < 600 ? 42 : 54;
  let x = 0;

  const screen = ([px, pz]: P): P => [x + px * m, ground - pz * m];
  const line = (a: P, b: P, w: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(...screen(a));
    ctx.lineTo(...screen(b));
    ctx.stroke();
  };
  /** A shell: a rounded limb, its lit face a little narrower and nudged
   *  up toward the light, so it reads round. */
  const shell = (a: P, b: P, w: number, [shade, lit]: string[]) => {
    line(a, b, w * m, shade);
    const up: P = [-0.012, 0.012];
    line([a[0] + up[0], a[1] + up[1]], [b[0] + up[0], b[1] + up[1]], w * m * 0.55, lit);
  };
  const disc = (p: P, r: number, fill: string, rim?: string) => {
    const [sx, sy] = screen(p);
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(sx, sy, r * m, 0, Math.PI * 2);
    ctx.fill();
    if (rim) {
      ctx.strokeStyle = rim;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };
  /** A box along `angle`, centred on `c` (metres). */
  const box = (c: P, w: number, h: number, angle: number, r: number, fill: string) => {
    const [sx, sy] = screen(c);
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(angle);
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.roundRect((-w / 2) * m, (-h / 2) * m, w * m, h * m, r * m);
    ctx.fill();
    ctx.restore();
  };

  const drawPoints = (pts: P[], alpha: number, size: number) => {
    ctx.lineCap = 'round';
    for (const [bones, a] of [[FAR_BONES, 0.35], [NEAR_BONES, 1]] as const) {
      ctx.globalAlpha = alpha * a;
      for (const [i, j] of bones) line(pts[i], pts[j], 1.2, LIME);
    }
    ctx.globalAlpha = alpha;
    const head: P = [pts[0][0] - 0.07, pts[0][1] - 0.02];
    line(pts[1], [head[0], head[1] - 0.09], 1.2, LIME);
    const [hx, hy] = screen(head);
    ctx.beginPath();
    ctx.arc(hx, hy, 0.09 * m, 0, Math.PI * 2);
    ctx.stroke();
    // Square joints, the way Tridi draws its keypoints.
    ctx.fillStyle = LIME;
    pts.forEach((p, i) => {
      ctx.globalAlpha = alpha * (i >= 9 ? 0.35 : 1);
      const [sx, sy] = screen(p);
      ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
    });
    ctx.globalAlpha = 1;
  };

  const drawRobot = (r: ReturnType<typeof robotAt>, alpha: number) => {
    ctx.globalAlpha = alpha;
    ctx.lineCap = 'round';
    const side = (s: typeof r.near, tone: string[], near: boolean) => {
      const [knee, ankle, heel, toe] = s.leg;
      // Thigh, shin, then the foot: a dark sole under a shell.
      shell(r.hip, knee, 0.1, tone);
      shell(knee, ankle, 0.075, tone);
      line(heel, toe, 0.035 * m, DARK);
      line([heel[0] + 0.02, heel[1] + 0.02], [ankle[0] + 0.03, ankle[1] - 0.01], 0.04 * m, tone[0]);
      disc(knee, 0.035, MOTOR, near ? MOTOR_RIM : undefined);
      disc(ankle, 0.022, MOTOR);
      // The arm: upper, fore, a dark hand.
      const [elbow, hand] = s.arm;
      shell(r.shoulder, elbow, 0.065, tone);
      shell(elbow, hand, 0.055, tone);
      disc(hand, 0.03, DARK);
      disc(elbow, 0.028, MOTOR, near ? MOTOR_RIM : undefined);
    };
    side(r.far, SHELL.far, false);
    // Pelvis: the dark waist motor block; the torso a shell, broader at
    // the chest, with its dark front panel; the shoulder motor.
    disc(r.hip, 0.07, MOTOR);
    const mid: P = [(r.waist[0] + r.shoulder[0]) / 2, (r.waist[1] + r.shoulder[1]) / 2];
    box(r.waist, 0.15, 0.12, r.body, 0.04, DARK);
    box([mid[0] + 0.005, mid[1] + 0.02], 0.2, 0.3, r.body, 0.06, SHELL.near[0]);
    box([mid[0] - 0.01, mid[1] + 0.03], 0.15, 0.26, r.body, 0.05, SHELL.near[1]);
    box([mid[0] + 0.075, mid[1] + 0.03], 0.04, 0.18, r.body, 0.02, DARK);
    // Neck, then the head: a rounded shell with a dark face and its
    // camera's glint.
    line(r.shoulder, [r.head[0], r.head[1] - 0.06], 0.05 * m, DARK);
    box(r.head, 0.14, 0.16, r.body, 0.06, SHELL.near[1]);
    box([r.head[0] + 0.045, r.head[1] + 0.005], 0.06, 0.1, r.body, 0.025, DARK);
    disc([r.head[0] + 0.058, r.head[1] + 0.025], 0.009, '#d9d9d9');
    side(r.near, SHELL.near, true);
    disc(r.shoulder, 0.045, MOTOR, MOTOR_RIM);
    ctx.globalAlpha = 1;
  };

  return {
    W,
    m,
    /** `fade`: how much of it shows (the band's ends). */
    paint(nx: number, t: number, k: number, fade = 1) {
      x = nx;
      ctx.clearRect(0, 0, W, H);
      if (fade <= 0) return;
      const human = humanAt(t);
      const r = robotAt(t);
      if (k <= 0) return drawPoints(human, fade, 3);
      // The handover: each point flies to its joint on the robot, the
      // robot fills in under them, and the points go out.
      const e = ease(k / 0.7);
      const target = jointsOf(r);
      const pts = human.map((p, i): P => [p[0] + (target[i][0] - p[0]) * e, p[1] + (target[i][1] - p[1]) * e]);
      const shown = ease((k - 0.3) / 0.6);
      if (shown > 0) drawRobot(r, shown * fade);
      const left = 1 - ease((k - 0.65) / 0.35);
      if (left > 0) drawPoints(pts, left * fade, 3 + 2 * Math.sin(Math.min(1, k / 0.7) * Math.PI));
    },
  };
};

export type WalkOptions = {
  /** Where the person becomes the robot, as a share of the band. */
  handover?: number;
  /** Where it comes in and where it leaves, as shares of the band (it
   *  fades in and out there). */
  from?: number;
  to?: number;
  /** Still wanted? Checked every frame; false ends the walk. */
  alive?: () => boolean;
};

/** One walk across `band`, the link riding with the figure. Resolves
 *  when it is gone. */
export const walk = async (band: HTMLCanvasElement, link: HTMLAnchorElement, opts: WalkOptions = {}) => {
  band.hidden = false;
  link.hidden = false;
  const { W, m, paint } = stage(band);
  const rate = holdable(link);
  const MORPH = 1.3;
  const from = (opts.from ?? 0) * W;
  const handover = W * (opts.handover ?? (W < 600 ? 0.3 : 0.34));
  const edge = 0.5 * m;
  const end = (opts.to ?? 1) * W;
  let x = from > 0 ? from : -edge;
  let t = 0;
  let morph = -1;
  let cut = false;

  const ended = await run(dt => {
    if (opts.alive && !opts.alive()) return !(cut = true);
    dt *= rate(dt);
    t += dt;
    if (morph < 0 && x >= handover) morph = 0;
    if (morph >= 0) morph = Math.min(1, morph + dt / MORPH);
    const k = Math.max(0, morph);
    x += (HUMAN_PACE + (ROBOT_PACE - HUMAN_PACE) * ease(k)) * m * dt;
    // In from the dark where it starts mid-band, out at the band's end.
    const fade = Math.min(from > 0 ? ease((x - from) / edge) : 1, ease((end - x) / edge));
    paint(x, t, k, fade);
    link.style.transform = `translate(${(x - 0.4 * m).toFixed(1)}px, 0)`;
    return x < end + (end < W ? 0 : edge);
  });

  if (!ended || cut) {
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
  const x = W * 0.4;
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

/** One still frame at `t`, `k` of the way to the robot (for checking the
 *  drawing). */
export const still = (band: HTMLCanvasElement, t: number, k: number, xShare = 0.5) => {
  band.hidden = false;
  const { W, paint } = stage(band);
  paint(W * xShare, t, k);
};
