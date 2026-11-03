import WALK from '../data/tridi-walk.json';
import JACKS from '../data/tridi-jacks.json';
import { fit, holdable, release, run } from './eggs';

/**
 * TRIDI'S ROBOT (RobotEgg): on top of Platanus Hack 26 Caracas's photo
 * frame, where Tridi is told. Tridi
 * turns a video of a person into movement for a robot; this is that, one
 * walk long, from Tridi's own data (`npm run tridi` → data/tridi-walk.json):
 * the person's tracking points as MediaPipe found them in the video walk
 * in, in Tridi's lime, square joints and all; then each point flies to
 * its joint on the Unitree G1 Tridi retargeted them to — the robot's own
 * joint angles for the same frames, drawn in profile from the G1's real
 * link lengths — and the robot walks on.
 *
 * Two scenes, one after the other on the same visit (Juan, 2026-11-03;
 * RobotEgg): the walk, then THE MIRROR — the person's points doing
 * jumping jacks at the left, facing you, and the G1 at the right doing
 * them with them, a beat behind (data/tridi-jacks.json). The walk's file
 * says which side of the person faces the camera; the robot turns the
 * same. The mirror's robot comes already posed from the G1's joint
 * chain, as the same points the person's are, so it is drawn without
 * angles. Both are drawn at ONE SCALE, the one that fits the tallest
 * pose either has in the band, so nothing is ever cut off and the
 * person is the same size in both.
 */

const LIME = '#c8ff2e';
// The G1: light shells over dark motors. Near side lit, far side in shade.
const SHELL = { near: ['#c9c9c9', '#f5f5f5'], far: ['#4a4a4a', '#6b6b6b'] };
const MOTOR = '#2a2a2a';
const MOTOR_RIM = '#5c5c5c';
const DARK = '#1c1c1c';

type P = [number, number];
type Data = { fps: number; near: string; human: number[][]; robot: number[][] };
export type MotionName = 'walk' | 'jacks';
const DATA: Record<MotionName, Data> = { walk: WALK, jacks: JACKS };
// The tallest anything stands in either scene, in metres: a raised hand,
// or the head's circle over the nose, with the joints' squares (a
// profile's robot is angles, and stands under its person).
const TALL =
  Math.max(
    ...Object.values(DATA).flatMap(d => [...d.human, ...(d.near === 'front' ? d.robot : [])].flatMap(f => f.filter((_, i) => i % 2))),
  ) /
    100 +
  0.12;

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

// The person's bones. Order (scripts/sync-tridi): nose; near shoulder,
// elbow, wrist, hip, knee, ankle, heel, toe; the same far.
const FAR_BONES = [[9, 10], [10, 11], [12, 13], [13, 14], [14, 15], [15, 16], [14, 16], [9, 12]];
const NEAR_BONES = [[1, 9], [4, 12], [1, 4], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [7, 8], [6, 8]];

/** One frame of `data` at any time: the two nearest, blended. */
const frameAt = (data: Data, frames: number[][], t: number) => {
  const N = frames.length;
  const f = (((t * data.fps) % N) + N) % N;
  const i = Math.floor(f);
  const k = f - i;
  const a = frames[i];
  const b = frames[(i + 1) % N];
  return a.map((v, j) => (v + (b[j] - v) * k) / 100);
};
const pointsOf = (v: number[]) => {
  const pts: P[] = [];
  for (let i = 0; i < v.length; i += 2) pts.push([v[i], v[i + 1]]);
  return pts;
};

/** A profile motion's figures and paces, from its data. */
const prepare = (data: Data) => {
  const N = data.human.length;
  const nearRight = data.near === 'right';
  const at = (frames: number[][], t: number) => frameAt(data, frames, t);

  const robotAt = (t: number) => {
    // root height; left hip, knee, ankle; right hip, knee, ankle; waist;
    // left shoulder, elbow; right shoulder, elbow
    const [, lh, lk, la, rh, rk, ra, w, ls, le, rs, re] = at(data.robot, t);
    const hip: P = [0, 0];
    const left = leg(hip, lh, lk, la);
    const right = leg(hip, rh, rk, ra);
    const waist = rot([0, 0.147], 0);
    const shoulder = add(waist, rot([0, 0.248], w));
    // Standing on the lower foot: the floor is where its sole is.
    const floor = Math.min(left[2][1], left[3][1], right[2][1], right[3][1]) - 0.005;
    const lift = (p: P): P => [p[0], p[1] - floor];
    const rightSide = { leg: right.map(lift), arm: arm(shoulder, w, rs, re).map(lift) };
    const leftSide = { leg: left.map(lift), arm: arm(shoulder, w, ls, le).map(lift) };
    return {
      hip: lift(hip),
      waist: lift(waist),
      shoulder: lift(shoulder),
      head: lift(add(shoulder, rot([0.01, 0.15], w))),
      body: w,
      // The robot turns to the camera the side the person does.
      near: nearRight ? rightSide : leftSide,
      far: nearRight ? leftSide : rightSide,
    };
  };

  // ----- the person: MediaPipe's points, already in metres -----

  /** How fast a figure goes AT EACH MOMENT of its cycle, so its planted
   *  foot stays planted: the backward speed of whichever foot is lowest,
   *  smoothed over a 24th of the cycle (the hand-over between feet: the
   *  robot's foot slid 36 cm a walk cycle under one pace, 28 with this;
   *  wider windows gave that back) and never near a stop. A single pace for the whole cycle let the foot
   *  slide forward and back under it, and the robot, slower than the
   *  person, braked as it took over — it read as lag (Juan, 2026-11-03). */
  const gait = (feet: (t: number) => P[]) => {
    const S = N * 4;
    const dt = 1 / data.fps / 4;
    const raw: number[] = [];
    for (let i = 0; i < S; i++) {
      const a = feet(i * dt);
      const b = feet((i + 1) * dt);
      let low = 0;
      a.forEach((p, j) => p[1] < a[low][1] && (low = j));
      raw.push(-(b[low][0] - a[low][0]) / dt);
    }
    const pace = [...raw].sort((x, y) => x - y)[S >> 1];
    const w = Math.round(S / 24);
    const speed = raw.map((_, i) => {
      let sum = 0;
      for (let j = -w; j <= w; j++) sum += raw[(i + j + S) % S];
      return Math.max(0.5 * pace, sum / (2 * w + 1));
    });
    const at = (t: number) => {
      const f = ((((t / dt) % S) + S) % S);
      const i = Math.floor(f);
      return speed[i] + (speed[(i + 1) % S] - speed[i]) * (f - i);
    };
    return { pace, at };
  };

  const humanAt = (t: number) => pointsOf(at(data.human, t));

  const HUMAN = gait(t => [7, 8, 15, 16].map(i => humanAt(t)[i]));
  const ROBOT = gait(t => {
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

  return { front: false as const, robotAt, humanAt, jointsOf, HUMAN, ROBOT };
};
type Profile = ReturnType<typeof prepare>;
type Robot = ReturnType<Profile['robotAt']>;

/** A frontal motion: both figures are points, in the same order — nose
 *  (the robot's head); left shoulder, elbow, wrist, hip, knee, ankle,
 *  heel, toe; the same right — and the robot's pelvis and chest after. */
const prepareFront = (data: Data) => ({
  front: true as const,
  humanAt: (t: number) => pointsOf(frameAt(data, data.human, t)),
  robotAt: (t: number) => pointsOf(frameAt(data, data.robot, t)),
  /** One cycle, in seconds. */
  cycle: data.human.length / data.fps,
});
type Front = ReturnType<typeof prepareFront>;
type Motion = Profile | Front;

const prepared: Partial<Record<MotionName, Motion>> = {};
const motionOf = (name: MotionName): Motion =>
  (prepared[name] ??= DATA[name].near === 'front' ? prepareFront(DATA[name]) : prepare(DATA[name]));

const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

/** The figure's painter on `band`: `paint(x, t, k)` draws it with its
 *  hips at x px, `t` s into the walk, `k` of the way from the person to
 *  the robot; `fade` dims it near the band's ends. */
const stage = (band: HTMLCanvasElement, mo: Motion) => {
  const { ctx, width: W, height: H } = fit(band);
  const ground = H - 4;
  // Pixels per metre: the tallest pose fills the band less a margin at
  // its head (the robot, 1.32 m, about 70 px on a desk).
  const m = Math.min(54, (H - 10) / TALL);
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

  // From the front: both sides of the person in full, as the camera sees
  // them (sync-tridi's order).
  const FRONT_BONES = [
    [1, 9], [4, 12], [1, 4], [9, 12],
    [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [7, 8], [6, 8],
    [9, 10], [10, 11], [12, 13], [13, 14], [14, 15], [15, 16], [14, 16],
  ];
  const drawPointsFront = (pts: P[], alpha: number, size: number) => {
    ctx.lineCap = 'round';
    ctx.globalAlpha = alpha;
    for (const [i, j] of FRONT_BONES) line(pts[i], pts[j], 1.2, LIME);
    const neck: P = [(pts[1][0] + pts[9][0]) / 2, (pts[1][1] + pts[9][1]) / 2];
    const head: P = [pts[0][0], pts[0][1] + 0.01];
    line(neck, [head[0], head[1] - 0.09], 1.2, LIME);
    const [hx, hy] = screen(head);
    ctx.beginPath();
    ctx.arc(hx, hy, 0.09 * m, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = LIME;
    for (const p of pts) {
      const [sx, sy] = screen(p);
      ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
  };

  /** The G1 from the front, from its posed points. */
  const drawRobotFront = (r: P[], alpha: number) => {
    ctx.globalAlpha = alpha;
    ctx.lineCap = 'round';
    const [head, , , , , , , , , , , , , , , , , pelvis, chest] = r;
    const tilt = Math.atan2(chest[0] - pelvis[0], chest[1] - pelvis[1]);
    const legOf = (o: number, tone: string[]) => {
      const [hip, knee, ankle, heel, toe] = r.slice(o + 3, o + 8);
      shell(hip, knee, 0.1, tone);
      shell(knee, ankle, 0.075, tone);
      disc(knee, 0.035, MOTOR, MOTOR_RIM);
      const sole: P = [(heel[0] + toe[0]) / 2, Math.min(heel[1], toe[1]) + 0.015];
      line([sole[0] - 0.035, sole[1]], [sole[0] + 0.035, sole[1]], 0.035 * m, DARK);
      disc(ankle, 0.022, MOTOR);
    };
    const armOf = (o: number, tone: string[]) => {
      const [shoulder, elbow, hand] = r.slice(o, o + 3);
      shell(shoulder, elbow, 0.065, tone);
      shell(elbow, hand, 0.055, tone);
      disc(hand, 0.03, DARK);
      disc(elbow, 0.028, MOTOR, MOTOR_RIM);
      disc(shoulder, 0.045, MOTOR, MOTOR_RIM);
    };
    legOf(1, SHELL.near);
    legOf(9, SHELL.near);
    // Pelvis, the torso's shell with its dark chest panel, the neck and
    // the head with its dark face.
    box(pelvis, 0.2, 0.1, tilt, 0.04, DARK);
    box(chest, 0.26, 0.3, tilt, 0.07, SHELL.near[0]);
    box([chest[0] - 0.01, chest[1] + 0.01], 0.2, 0.26, tilt, 0.06, SHELL.near[1]);
    box([chest[0], chest[1] + 0.02], 0.1, 0.12, tilt, 0.03, DARK);
    line(chest, [head[0], head[1] - 0.06], 0.05 * m, DARK);
    box(head, 0.13, 0.16, tilt, 0.06, SHELL.near[1]);
    box([head[0], head[1] + 0.005], 0.09, 0.07, tilt, 0.03, DARK);
    disc([head[0] + 0.02, head[1] + 0.015], 0.009, '#d9d9d9');
    armOf(1, SHELL.near);
    armOf(9, SHELL.near);
    ctx.globalAlpha = 1;
  };

  const drawRobot = (r: Robot, alpha: number) => {
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
    /** The mirror: the person's points at `xh`, at `t`; the robot at
     *  `xr`, at its own `tr`. */
    pair(xh: number, xr: number, t: number, tr: number, fade: number) {
      ctx.clearRect(0, 0, W, H);
      if (fade <= 0 || !mo.front) return;
      x = xh;
      drawPointsFront(mo.humanAt(t), fade, 3);
      x = xr;
      drawRobotFront(mo.robotAt(tr), fade);
    },
    /** `fade`: how much of it shows (the band's ends). */
    /** `tr`: the robot's own clock (`t` unless it steps quicker). */
    paint(nx: number, t: number, k: number, fade = 1, tr = t) {
      x = nx;
      ctx.clearRect(0, 0, W, H);
      if (fade <= 0) return;
      const human = mo.humanAt(t);
      const points = mo.front ? drawPointsFront : drawPoints;
      if (k <= 0) return points(human, fade, 3);
      // The handover: each point flies to its joint on the robot, the
      // robot fills in under them, and the points go out.
      const e = ease(k / 0.7);
      const shown = ease((k - 0.3) / 0.6);
      let target: P[];
      let robot: () => void;
      if (mo.front) {
        const r = mo.robotAt(tr);
        target = r;
        robot = () => drawRobotFront(r, shown * fade);
      } else {
        const r = mo.robotAt(tr);
        target = mo.jointsOf(r);
        robot = () => drawRobot(r, shown * fade);
      }
      const pts = human.map((p, i): P => [p[0] + (target[i][0] - p[0]) * e, p[1] + (target[i][1] - p[1]) * e]);
      if (shown > 0) robot();
      const left = 1 - ease((k - 0.65) / 0.35);
      if (left > 0) points(pts, left * fade, 3 + 2 * Math.sin(Math.min(1, k / 0.7) * Math.PI));
    },
  };
};

export type WalkOptions = {
  /** Where the person becomes the robot, as a share of the band. */
  handover?: number;
  /** Where it comes in and where it leaves, as shares of the band: it
   *  fades in at `from`, and fades out slowly toward `to`. */
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
  const mo = motionOf('walk') as Profile;
  const { HUMAN, ROBOT } = mo;
  const { W, m, paint } = stage(band, mo);
  const rate = holdable(link);
  const MORPH = 1.3;
  const from = (opts.from ?? 0) * W;
  const handover = W * (opts.handover ?? (W < 600 ? 0.3 : 0.34));
  const edge = 0.5 * m;
  // It leaves before the band's end, over a long, gentle fade: about two
  // seconds of its walk.
  const end = (opts.to ?? 0.9) * W;
  // The robot's clock. The G1 is smaller than the person, so at its own
  // cadence it goes 40% slower and braked as it took over (Juan,
  // 2026-11-03: it read as lag); it steps up to a third quicker instead,
  // eased in with the hand-over.
  const QUICK = Math.min(1.35, HUMAN.pace / ROBOT.pace);
  const away = 2 * ROBOT.pace * QUICK * m;
  let x = from > 0 ? from : -edge;
  let t = 0;
  let tr = 0;
  let morph = -1;
  let cut = false;

  const ended = await run(dt => {
    if (opts.alive && !opts.alive()) return !(cut = true);
    dt *= rate(dt);
    t += dt;
    if (morph < 0 && x >= handover) morph = 0;
    if (morph >= 0) morph = Math.min(1, morph + dt / MORPH);
    const k = Math.max(0, morph);
    const quick = 1 + (QUICK - 1) * ease(k);
    tr += dt * quick;
    const hv = HUMAN.at(t);
    x += (hv + (ROBOT.at(tr) * quick - hv) * ease(k)) * m * dt;
    // In from the dark where it starts mid-band, out at the band's end.
    const fade = Math.min(from > 0 ? ease((x - from) / edge) : 1, ease((end - x) / away));
    paint(x, t, k, fade, tr);
    link.style.transform = `translate(${(x - 0.4 * m).toFixed(1)}px, 0)`;
    return x < end;
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

export type MirrorOptions = {
  /** Where the person and the robot stand, as shares of the band. */
  at?: [number, number];
  /** Still wanted? Checked every frame; false ends it. */
  alive?: () => boolean;
};

/** THE MIRROR on `band`: the person's points and the G1 side by side,
 *  facing you, the robot doing the person's jumping jacks a beat behind
 *  them — Tridi following a person. They fade in, do four, and fade; the
 *  link rides on the robot. */
export const mirror = async (band: HTMLCanvasElement, link: HTMLAnchorElement, opts: MirrorOptions = {}) => {
  band.hidden = false;
  link.hidden = false;
  const mo = motionOf('jacks') as Front;
  const { W, m, pair } = stage(band, mo);
  const rate = holdable(link);
  const [h, r] = opts.at ?? [0.32, 0.68];
  const IN = 0.6;
  const OUT = 0.8;
  const LAG = 0.12;
  const end = IN + 4 * mo.cycle + OUT;
  link.style.transform = `translate(${(W * r - 0.4 * m).toFixed(1)}px, 0)`;
  let t = 0;
  let cut = false;

  const ended = await run(dt => {
    if (opts.alive && !opts.alive()) return !(cut = true);
    t += dt * rate(dt);
    pair(W * h, W * r, t, t - LAG, Math.min(ease(t / IN), ease((end - t) / OUT)));
    return t < end;
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
export const stand = async (band: HTMLCanvasElement, link: HTMLAnchorElement, motion: MotionName = 'walk') => {
  band.hidden = false;
  link.hidden = false;
  const { W, m, paint, pair } = stage(band, motionOf(motion));
  const x = W * (motion === 'jacks' ? 0.68 : 0.4);
  if (motion === 'jacks') pair(W * 0.32, x, 0.45, 0.45, 1);
  else paint(x, 0.45, 1);
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
export const still = (band: HTMLCanvasElement, t: number, k: number, xShare = 0.5, motion: MotionName = 'walk') => {
  band.hidden = false;
  const { W, paint } = stage(band, motionOf(motion));
  paint(W * xShare, t, k);
};
