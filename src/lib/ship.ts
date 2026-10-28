import { fit, holdable, release, run } from './eggs';

/**
 * SPACE EXPLORER'S SHIP, in three short scripted scenes (ShipEgg), each
 * its own: THE HUNT behind the hero's name, THE ESCAPE over the game's
 * card in More Work, and THE JUMP across the foot. Slow on purpose —
 * deliberate shots, a few well-timed bolts and missiles, eased rolls and
 * turns, each with a build-up, a climax and a graceful exit.
 *
 * Everything drawn is the game's own (../games/platanus-hack-26-
 * venezuela-arcade/game.js): the ship's and the missile's wireframe
 * models, copied as they are; how a model is placed (`db`: model x on R,
 * -y on U, z on F) and stroked (`sg`: a wide faint pass under a thin
 * one); the palette; and the arsenal as the game draws it — the cannon's
 * white bolts in pairs (four under Overdrive), homing missiles with their
 * trail and amber flame, the blue shield bubble, the dash's ghost copies,
 * the aces' rust embers, and the explosion's ring, amber flash and spray.
 * Seen from a little above and behind, the game's chase camera, in
 * perspective: far things are smaller and higher, and fade into the fog.
 */

type V3 = [number, number, number];
type Model = [V3[], [number, number][]];
type Basis = { F: V3; U: V3; R: V3 };
type Pt = [number, number, number];

const mdl = (flat: number[], es: string): Model => {
  const V: V3[] = [];
  for (let i = 0; i < flat.length; i += 3) V.push([flat[i], flat[i + 1], flat[i + 2]]);
  const E: [number, number][] = [];
  for (let i = 0; i < es.length; i += 2) E.push([es.charCodeAt(i) - 48, es.charCodeAt(i + 1) - 48]);
  return [V, E];
};

const SHIP = mdl(
  [0, 0, 26, 0, -3.5, 14, 0, -5.5, 2, 0, -4, -8, 0, -11, -17, 0, 0, -16, -5, -1, 8, 5, -1, 8, -22, 1, -13, 22, 1, -13, -22, -4, -15, 22, -4, -15, 0, 3, -6, -9, 1, -2, 9, 1, -2, -11, 1, -15, 11, 1, -15, -3, -1.5, 19, 3, -1.5, 19],
  '0112233445350607687985958:9;0<<56<7<6==?7>>@?5@50AA60BB72627',
);
const MISSILE = mdl(
  [0, 0, 16, 0, 0, -12, -3, 0, 8, 3, 0, 8, 0, -3, 8, 0, 3, 8, -8, 0, -14, 8, 0, -14, 0, -8, -14, 0, 8, -14, -3, 0, -6, 3, 0, -6, 0, -3, -6, 0, 3, -6],
  '020304052:3;4<5=:6;7<8=961718191',
);

// The game's palette.
const INK = '#f5f5f5';
const INK_HI = '#eef2f7';
const RUST = '#a65240';
const RUST_HI = '#c97b5a';
const AMB = '#f6c98a';
const CRM = '#fff1d6';
const BLU = '#b8dbe4';
const BLD = '#8fb0c4';

const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const norm = (a: V3): V3 => mul(a, 1 / (len(a) || 1));
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
/** How far into [a, b] `t` is (0 → 1, unclamped). */
const within = (t: number, a: number, b: number) => (t - a) / (b - a);

/** A ship, a missile: where it is over time, and how it rolls. */
type Path = (t: number) => V3;

/** THE STAGE: the camera, the game's drawing and its effects, on one
 *  canvas. A script moves the ships; this draws them and runs the fire. */
const stage = (band: HTMLCanvasElement, cyShare: number) => {
  const { ctx, width: W, height: H } = fit(band);
  // World units are px at the page's depth. The camera stands above and
  // looks down ~17°, the game's own chase camera (CAM_UP 32 over
  // CAM_BACK 104).
  const EYE = 900;
  const cp = Math.cos(0.3);
  const sp = Math.sin(0.3);
  const cx = W / 2;
  const cy = H * cyShare;
  const sc = Math.min(2, Math.max(1.15, (W / 1440) * 2));
  const project = ([x, y, z]: V3): Pt => {
    const yc = y * cp - z * sp;
    const zc = Math.max(-EYE * 0.7, y * sp + z * cp);
    const k = EYE / (EYE + zc);
    return [cx + x * k, cy + yc * k, k];
  };
  // The game's fog: far things fade into the dark.
  const fog = (P: V3) => Math.max(0, Math.min(1, 1 - (P[2] - 1400) / 600));
  const off = ([x, y]: Pt, m = 60) => x < -m || x > W + m || y < -m || y > H + m;

  /** A ship's basis from its path: nose along the way it goes, banked
   *  into its turn as a plane is, plus `roll` (a barrel roll). */
  const orient = (path: Path, t: number, roll = 0): Basis => {
    const a = path(t - 0.03);
    const b = path(t + 0.03);
    const c = path(t + 0.09);
    const F = norm(sub(b, a));
    const F2 = norm(sub(c, b));
    const turn = (F[0] * F2[2] - F[2] * F2[0]) / 0.06;
    const r = Math.max(-1.1, Math.min(1.1, -turn * 0.5)) + roll;
    let U = norm(add([0, -1, 0], F, F[1]));
    let R = cross(F, U);
    const cr = Math.cos(r);
    const sr = Math.sin(r);
    [U, R] = [norm(add(mul(U, cr), R, sr)), norm(add(mul(R, cr), U, -sr))];
    return { F, U, R };
  };
  const placed = ([V]: Model, P: V3, { F, U, R }: Basis, s: number) =>
    V.map(([mx, my, mz]) =>
      project([
        P[0] + (R[0] * mx - U[0] * my + F[0] * mz) * s,
        P[1] + (R[1] * mx - U[1] * my + F[1] * mz) * s,
        P[2] + (R[2] * mx - U[2] * my + F[2] * mz) * s,
      ]),
    );
  const at = (P: V3, { F, U, R }: Basis, s: number, [mx, my, mz]: V3): V3 =>
    add(P, [R[0] * mx - U[0] * my + F[0] * mz, R[1] * mx - U[1] * my + F[1] * mz, R[2] * mx - U[2] * my + F[2] * mz], s);

  // ----- the game's strokes -----
  const stroke = (pts: Pt[], edges: [number, number][], color: string, alpha: number, k: number) => {
    if (alpha <= 0) return;
    ctx.beginPath();
    for (const [a, b] of edges) {
      ctx.moveTo(pts[a][0], pts[a][1]);
      ctx.lineTo(pts[b][0], pts[b][1]);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 4.5 * k;
    ctx.globalAlpha = alpha * 0.18;
    ctx.stroke();
    ctx.lineWidth = Math.max(0.8, 1.5 * k);
    ctx.globalAlpha = alpha;
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  const dot = (p: Pt, r: number, color: string, alpha: number) => {
    if (alpha <= 0) return;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p[0], p[1], Math.max(0.6, r), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };
  const ring = (p: Pt, r: number, w: number, color: string, alpha: number) => {
    if (alpha <= 0) return;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(p[0], p[1], Math.max(0.5, r), 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  const seg = (a: V3, b: V3, w: number, color: string, alpha: number) => {
    if (alpha <= 0) return;
    const p = project(a);
    const q = project(b);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(0.6, w * p[2]);
    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(q[0], q[1]);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  // ----- what flies between them -----
  type Bolt = { p: V3; v: V3; hits: Target | null; gone: boolean };
  type Ember = { p: V3; v: V3; gone: boolean };
  type Missile = { p: V3; v: V3; trail: V3[]; spin: number; aim: Target; gone: boolean };
  type Spark = { p: V3; v: V3; life: number; max: number; color: string };
  type Boom = { p: V3; t: number; big: boolean };
  type Shard = { a: V3; b: V3; v: V3; t: number };
  /** Something that can be hit: where it is now, and what a hit does. */
  type Target = { pos: () => V3; r: number; hit: (big: boolean) => void };
  const bolts: Bolt[] = [];
  const embers: Ember[] = [];
  const missiles: Missile[] = [];
  const sparks: Spark[] = [];
  const booms: Boom[] = [];
  const shards: Shard[] = [];
  let shieldHit = 0;
  let muzzle = 0;

  const spray = (P: V3, n: number, speed: number, color: string) => {
    for (let i = 0; i < n; i++) {
      const a1 = Math.random() * Math.PI * 2;
      const a2 = (Math.random() - 0.5) * Math.PI;
      const v = (0.5 + Math.random()) * speed;
      sparks.push({ p: P, v: [Math.sin(a1) * Math.cos(a2) * v, Math.sin(a2) * v, Math.cos(a1) * Math.cos(a2) * v], life: 0, max: 0.35 + Math.random() * 0.4, color });
    }
  };

  const fx = {
    /** The cannon: pairs from beside the nose, four under Overdrive. The
     *  bolts fly on until they leave the screen or the fog takes them. */
    fire(P: V3, B: Basis, s: number, aim: V3, quad: boolean, hits: Target | null) {
      muzzle = 0.06;
      for (const o of quad ? [-20, -7, 7, 20] : [-9, 9]) {
        const from = at(P, B, s, [o, 0, 24]);
        bolts.push({ p: from, v: mul(norm(sub(aim, from)), 1150), hits, gone: false });
      }
    },
    /** An ace's ember, at `aim`. */
    ember(from: V3, aim: V3) {
      embers.push({ p: from, v: mul(norm(sub(aim, from)), 460), gone: false });
    },
    /** A missile off a wing, homing on `aim`. */
    missile(P: V3, B: Basis, s: number, side: number, aim: Target, spread = 170) {
      missiles.push({ p: at(P, B, s, [side * 14, 0, 0]), v: add(mul(B.F, 300), B.R, side * spread), trail: [], spin: 0, aim, gone: false });
    },
    /** A hit that does not kill: a spark and a small rust ring. */
    spark(P: V3) {
      booms.push({ p: P, t: 0, big: false });
      spray(P, 6, 160 * (sc / 1.6), RUST_HI);
    },
    /** The game's kill: the big ring and amber flash, the spray, and the
     *  ship coming apart along its own edges. */
    explode(P: V3, B: Basis, s: number) {
      booms.push({ p: P, t: 0, big: true });
      spray(P, 26, 240 * (sc / 1.6), INK);
      for (const [a, b] of SHIP[1]) {
        const A = at(P, B, s, SHIP[0][a]);
        const Bp = at(P, B, s, SHIP[0][b]);
        const out = norm(sub(add(A, Bp), mul(P, 2)));
        shards.push({ a: A, b: Bp, v: add(mul(out, 60 + Math.random() * 110), [0, -20, 0]), t: 0 });
      }
    },
  };

  /** Moves everything that flies; `shield` is the ship that blocks embers
   *  (its centre and radius), when its shield is up. */
  const update = (dt: number, shield: { P: V3; r: number } | null) => {
    for (const b of bolts) {
      if (b.gone) continue;
      b.p = add(b.p, b.v, dt);
      if (b.hits && len(sub(b.p, b.hits.pos())) < b.hits.r) {
        b.gone = true;
        b.hits.hit(false);
      } else if (off(project(b.p), 40) || fog(b.p) <= 0) b.gone = true;
    }
    for (const e of embers) {
      if (e.gone) continue;
      e.p = add(e.p, e.v, dt);
      if (shield && len(sub(e.p, shield.P)) < shield.r) {
        e.gone = true;
        shieldHit = 0.3;
      } else if (off(project(e.p), 40) || fog(e.p) <= 0) e.gone = true;
    }
    for (const m of missiles) {
      if (m.gone) continue;
      m.spin += dt * 5;
      const want = norm(sub(m.aim.pos(), m.p));
      const speed = Math.min(820, len(m.v) + 500 * dt);
      m.v = mul(norm(add(norm(m.v), want, Math.min(1, dt * 4.5))), speed);
      m.p = add(m.p, m.v, dt);
      m.trail.push(m.p);
      if (m.trail.length > 22) m.trail.shift();
      if (len(sub(m.p, m.aim.pos())) < m.aim.r) {
        m.gone = true;
        m.aim.hit(true);
      } else if (off(project(m.p), 200)) m.gone = true;
    }
    for (const s of sparks) {
      s.p = add(s.p, s.v, dt);
      s.life += dt;
    }
    for (const s of shards) {
      s.a = add(s.a, s.v, dt);
      s.b = add(s.b, s.v, dt);
      s.t += dt;
    }
    for (const b of booms) b.t += dt;
    shieldHit -= dt;
    muzzle -= dt;
  };

  /** Everything in flight, and still settling. */
  const busy = () =>
    bolts.some(b => !b.gone) ||
    embers.some(e => !e.gone) ||
    missiles.some(m => !m.gone) ||
    sparks.some(s => s.life < s.max) ||
    shards.some(s => s.t < 0.9) ||
    booms.some(b => b.t < 0.5);

  const paintFire = () => {
    for (const e of embers) {
      if (e.gone) continue;
      const p = project(e.p);
      const r = Math.max(2, 4.5 * p[2] * (sc / 1.6));
      const a = fog(e.p);
      seg(e.p, add(e.p, e.v, -0.06), r * 0.9, RUST, 0.45 * a);
      dot(p, r * 1.8, RUST, 0.4 * a);
      dot(p, r, RUST_HI, 0.95 * a);
      dot(p, r * 0.45, CRM, 0.9 * a);
    }
    for (const b of booms) {
      if (b.t > 0.5) continue;
      const p = project(b.p);
      const r = (4 + b.t * (b.big ? 260 : 110)) * p[2] * (sc / 1.6);
      if (b.big) dot(p, r * 0.8, AMB, 0.35 * (1 - b.t / 0.5));
      ring(p, r, b.big ? 3 : 1.5, b.big ? INK_HI : RUST, 1 - b.t / 0.5);
    }
    for (const s of sparks) if (s.life < s.max) seg(s.p, add(s.p, s.v, -0.05), 1, s.color, (s.max - s.life) * 1.6);
    for (const s of shards) {
      if (s.t > 0.9) continue;
      const a = project(s.a);
      const b = project(s.b);
      ctx.globalAlpha = 1 - s.t / 0.9;
      ctx.strokeStyle = s.t < 0.08 ? INK_HI : RUST_HI;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    for (const b of bolts) if (!b.gone) seg(b.p, add(b.p, b.v, -0.03), 2, INK_HI, 0.9 * fog(b.p));
    for (const m of missiles) {
      if (m.gone) continue;
      for (let i = 1; i < m.trail.length; i++) seg(m.trail[i - 1], m.trail[i], 1 + i * 0.3, INK_HI, (i / m.trail.length) * 0.45);
      const F = norm(m.v);
      const U0 = norm(add([0, -1, 0], F, F[1]));
      const R0 = cross(F, U0);
      const c = Math.cos(m.spin);
      const s = Math.sin(m.spin);
      const B = { F, U: norm(add(mul(U0, c), R0, s)), R: norm(add(mul(R0, c), U0, -s)) };
      const k = project(m.p)[2];
      stroke(placed(MISSILE, m.p, B, 0.75 * sc), MISSILE[1], INK_HI, 1, k);
      dot(project(add(m.p, F, -15 * sc)), Math.max(2, 3.2 * k * (sc / 1.6)), AMB, 0.9);
    }
  };

  /** A ship as the game draws it: the dash's ghosts, the engine's streak,
   *  the model, the flash at the nose when it fires. */
  const paintShip = (P: V3, B: Basis, s: number, color: string, opts: { dash?: boolean; engine?: boolean; alpha?: number } = {}) => {
    const k = project(P)[2];
    const a = (opts.alpha ?? 1) * fog(P);
    if (opts.dash) for (let i = 1; i <= 3; i++) stroke(placed(SHIP, add(P, B.F, -22 * i * s), B, s), SHIP[1], INK_HI, (0.4 / i) * a, k);
    if (opts.engine !== false) seg(add(P, B.F, -14 * s), add(P, B.F, -(opts.dash ? 46 : 32) * s), 2, INK_HI, 0.55 * a);
    stroke(placed(SHIP, P, B, s), SHIP[1], color, a, k);
    if (color === INK && muzzle > 0) dot(project(add(P, B.F, 26 * s)), Math.max(2, 3 * k * (sc / 1.6)), INK_HI, 0.9 * a);
  };

  /** The shield: a blue bubble, its meridians turning and three white
   *  arcs spinning; it swells up, and its last moments fade. */
  const paintShield = (P: V3, t: number, from: number, to: number, r0: number) => {
    if (t < from || t > to) return;
    const p = project(P);
    const r = r0 * p[2] * ease((t - from) / 0.15);
    const a = Math.min(1, (to - t) / 0.35);
    dot(p, r, BLD, 0.1 * a);
    ring(p, r, 1.5, BLU, 0.85 * a);
    ring(p, r * 1.1, 3.5, BLD, 0.2 * a);
    ctx.globalAlpha = 0.4 * a;
    ctx.strokeStyle = BLU;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(p[0], p[1], r * Math.abs(Math.cos(t * 2.1)), r, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(p[0], p[1], r, r * Math.abs(Math.cos(t * 1.7 + 1.2)), 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.9 * a;
    ctx.strokeStyle = INK_HI;
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 3; i++) {
      const a0 = t * 4 + (i * Math.PI * 2) / 3;
      ctx.beginPath();
      ctx.arc(p[0], p[1], r, a0, a0 + 0.7);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    if (shieldHit > 0) ring(p, r * (1 + (1 - shieldHit / 0.3) * 0.55), 2.5, INK_HI, 0.9 * (shieldHit / 0.3) * a);
  };

  /** A gate, as the game draws one: two rings that breathe, in the
   *  player's ink, standing across the way through (`F`) and turned
   *  toward the eye, as the game turns a gate toward you so it can
   *  always be crossed. `lit` (0–1) is the flare as the ship passes. */
  const paintGate = (C: V3, F: V3, r: number, t: number, alpha: number, lit: number) => {
    if (alpha <= 0) return;
    const n = norm(add(F, [0, -sp, -cp], 1.6));
    const R = norm(cross(n, [0, -1, 0]));
    const B = { F: n, R, U: cross(n, R) };
    ctx.strokeStyle = INK_HI;
    for (const rr of [r, r * 0.83]) {
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const a = (i / 40) * Math.PI * 2;
        const p = project(add(add(C, B.R, Math.cos(a) * rr), B.U, Math.sin(a) * rr));
        if (i) ctx.lineTo(p[0], p[1]);
        else ctx.moveTo(p[0], p[1]);
      }
      const k = project(C)[2];
      ctx.lineWidth = (3 + 3 * lit) * k;
      ctx.globalAlpha = alpha * (0.55 + 0.35 * Math.sin(t * 8) * (1 - lit) + 0.4 * lit);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  /** The jump: streaks of light pouring past the ship as it goes. */
  const paintWarp = (P: V3, B: Basis, amount: number, seed: number) => {
    if (amount <= 0) return;
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2 + seed;
      const d = (40 + ((i * 37) % 60)) * sc;
      const from = add(add(add(P, B.R, Math.cos(a) * d), B.U, Math.sin(a) * d * 0.6), B.F, -((i * 53) % 90) * sc);
      seg(from, add(from, B.F, -amount * (80 + ((i * 29) % 70)) * sc), 1.2, INK_HI, 0.5 * Math.min(1, amount));
    }
  };

  return { ctx, W, H, sc, project, fog, off, orient, fx, update, busy, paintFire, paintShip, paintShield, paintGate, paintWarp, ring, dot, clear: () => ctx.clearRect(0, 0, W, H) };
};

/** A battle: `frame(dt)` advances and paints it and says false once it
 *  is over; `at()` is where the ship is on screen. */
export type Battle = { frame: (dt: number) => boolean; at: () => Pt };

/** A gentle swell: 0 → 1 → 0 over [a, b], eased at both ends. */
const swell = (t: number, a: number, b: number) => Math.sin(Math.PI * ease(within(t, a, b)));

/**
 * THE HERO: THE HUNT, ~12 s, left to right across the top of the
 * screen, behind the name.
 *
 * Build-up: the ace glides in from the left edge; a beat later the ship
 * slides in on its tail. Two short volleys miss as the ace banks away;
 * the ace answers over its shoulder and the shield takes it. The ship
 * dashes in close. Climax: a missile pair rocks the ace through its
 * barrel roll, and two Overdrive volleys bring it down over the name.
 * Exit: the ship sails through the debris and swoops out past the
 * camera at the right.
 */
export const heroFight = (band: HTMLCanvasElement): Battle => {
  const s = stage(band, 0.5);
  const { W, H, sc } = s;
  const ACE = 1.25 * sc; // the game's aces are bigger than you

  const VOLLEYS = [3.0, 3.45]; // the misses
  const EMBERS = [4.3, 4.85];
  const SHIELD: [number, number] = [4.2, 6.0];
  const DASH = 6.4;
  const SALVO = 7.4;
  const ROLL: [number, number] = [7.7, 8.9];
  const FINISH = [9.3, 9.7]; // Overdrive, four bolts a volley

  // The ace's line: in at the left edge, a slow arc over the top of the
  // screen, farther as it goes; the kill a little right of centre, over
  // the name.
  const aceAt: Path = t => [
    W * (-0.62 + 0.072 * t) + W * 0.03 * Math.sin(0.9 * t),
    -H * (0.25 + 0.05 * Math.sin(0.7 * t + 0.6)),
    140 + 48 * t - 1.6 * t * t,
  ];
  const aceRoll = (t: number) => Math.PI * 2 * ease(within(t, ...ROLL));
  // The chase gap, closed by the dash over most of a second.
  const lag = (t: number) => 1.5 - 0.65 * ease(within(t, DASH, DASH + 0.9));
  let killedAt = -1;
  let exit: { P: V3; V: V3 } | null = null;
  // The ship: on the ace's line, behind, below and nearer; after the
  // kill it keeps its speed and curves toward the camera, out at the
  // right.
  const shipAt: Path = t => {
    const chase = (u: number) => add(aceAt(u - lag(u)), [-W * 0.03, H * 0.07, -70]);
    if (!exit || t <= killedAt) return chase(t);
    const u = t - killedAt;
    return add(add(exit.P, exit.V, u), [W * 0.16, -H * 0.04, -260], u * u * 0.5);
  };

  let t = 0;
  let alive = true;
  const ace = {
    pos: () => aceAt(t),
    r: 26 * ACE,
    hit: (big: boolean) => {
      if (!alive) return;
      s.fx.spark(aceAt(t));
      if (big) {
        alive = false;
        killedAt = t;
        exit = { P: shipAt(t), V: mul(sub(shipAt(t + 0.02), shipAt(t - 0.02)), 25) };
        s.fx.explode(aceAt(t), s.orient(aceAt, t, aceRoll(t)), ACE);
      }
    },
  };
  // The missiles only rock it; the Overdrive bolts bring it down.
  const rocked = { ...ace, hit: () => ace.hit(false) };
  let finishing = 0;
  const finisher = { ...ace, hit: () => ++finishing >= 5 && ace.hit(true) };
  const once = (at: number, dt: number) => t >= at && t - dt < at;

  const frame = (dt: number) => {
    t += dt;
    const P = shipAt(t);
    const pb = s.orient(shipAt, t);
    const E = aceAt(t);
    const eb = s.orient(aceAt, t, aceRoll(t));

    // Missing, it shoots where the ace was a moment ago.
    for (const v of VOLLEYS) if (once(v, dt)) s.fx.fire(P, pb, sc, add(aceAt(t - 0.5), [0, -H * 0.06, 0]), false, null);
    for (const e of EMBERS) if (alive && once(e, dt)) s.fx.ember(add(E, eb.F, -10 * ACE), P);
    if (once(SALVO, dt)) for (const side of [-1, 1]) s.fx.missile(P, pb, sc, side, rocked);
    for (const f of FINISH) if (alive && once(f, dt)) s.fx.fire(P, pb, sc, E, true, finisher);
    if (alive && t >= FINISH[1] + 0.6) ace.hit(true);

    s.update(dt, t >= SHIELD[0] && t < SHIELD[1] ? { P, r: 27 * sc } : null);
    s.clear();
    if (alive) s.paintShip(E, eb, ACE, RUST, { engine: false });
    s.paintFire();
    s.paintShip(P, pb, sc, INK, { dash: t >= DASH && t < DASH + 0.7 });
    s.paintShield(P, t, SHIELD[0], SHIELD[1], 27 * sc);

    const gone = !alive && s.off(s.project(P), 150);
    return !gone || s.busy();
  };
  return { frame, at: () => s.project(shipAt(t)) };
};

/**
 * MORE WORK: THE ESCAPE, ~11 s, in the strip over the game's own card,
 * right to left.
 *
 * Build-up: the ship sweeps in with two aces on its tail; their embers
 * come, a few at a time, and it rolls out of each. A dash buys it room,
 * a long weave keeps it there. Climax: it brakes hard, the aces
 * overshoot, and with them in front a missile pair takes both. Exit: it
 * eases back to speed and away off the left edge.
 */
export const chase = (band: HTMLCanvasElement): Battle => {
  const s = stage(band, 0.72);
  const { W, H } = s;
  // A phone's strip is short: the ships a size smaller there.
  const sc = s.sc * (W < 600 ? 0.7 : 1);
  const ACE = 1.1 * sc;
  const ROLLS: [number, number][] = [[1.6, 2.6], [4.6, 5.5]];
  const EMBERS = [1.3, 1.5, 4.3, 4.5];
  const DASH = 3.2;
  const BRAKE: [number, number] = [6.0, 7.8];
  const SALVO = 8.2;

  // The ship's speed (share of the strip's width a second): a calm
  // cruise, a swell on the dash, nearly nothing on the brake, then away.
  const speed = (t: number) =>
    0.1 +
    0.07 * swell(t, DASH, DASH + 1.0) -
    0.085 * Math.min(ease(within(t, BRAKE[0], BRAKE[0] + 0.6)), 1 - ease(within(t, BRAKE[1], BRAKE[1] + 1.2))) +
    0.03 * ease(within(t, BRAKE[1] + 1.5, BRAKE[1] + 3));
  // Its distance along, integrated in small steps from the start.
  const xs: number[] = [0];
  const STEP = 1 / 120;
  const along = (t: number) => {
    const i = Math.max(0, Math.floor(t / STEP));
    while (xs.length <= i + 1) xs.push(xs[xs.length - 1] + speed(xs.length * STEP) * STEP);
    return xs[i] + (xs[i + 1] - xs[i]) * (t / STEP - i);
  };
  // Right to left, a long weave in height and depth.
  const shipAt: Path = t => [
    W * (0.6 - along(t)),
    -H * (0.12 + 0.13 * Math.sin(1.05 * t)),
    140 + 60 * Math.sin(0.6 * t + 0.4),
  ];
  // Each roll the way the weave turns, eased all through.
  const shipRoll = (t: number) => ROLLS.reduce((r, [a, b], i) => r + (i % 2 ? -1 : 1) * Math.PI * 2 * ease(within(t, a, b)), 0);
  // The aces: steady, a touch faster than the cruise — they close in,
  // lose ground on the dash, and sail past on the brake. One higher and
  // farther, one lower and nearer; each follows the weave a beat late.
  const aceAt = (i: number): Path => t => {
    const w = shipAt(Math.max(0, t - 0.6 - i * 0.4));
    // Past the ship on the brake, they keep pulling away, easing up to
    // speed: a clear overshoot.
    const past = Math.max(0, t - BRAKE[0]);
    const ahead = W * 0.07 * past * ease(past / 1.5);
    return [W * (0.6 + 0.13 + i * 0.08) - W * 0.108 * t - ahead, w[1] + (i ? H * 0.1 : -H * 0.08), w[2] + (i ? -40 : 50)];
  };
  let t = 0;
  const aces = [0, 1].map(i => {
    const path = aceAt(i);
    const a = { path, alive: true, target: { pos: () => path(t), r: 30 * ACE, hit: () => kill(a) } };
    return a;
  });
  const kill = (a: (typeof aces)[number]) => {
    if (!a.alive) return;
    a.alive = false;
    s.fx.explode(a.path(t), s.orient(a.path, t), ACE);
  };
  const once = (at: number, dt: number) => t >= at && t - dt < at;

  const frame = (dt: number) => {
    t += dt;
    const P = shipAt(t);
    const pb = s.orient(shipAt, t, shipRoll(t));
    // They fire at where the ship is going to be — and it rolls out of
    // the way.
    EMBERS.forEach((at, j) => {
      const a = aces[j % 2];
      if (a.alive && once(at, dt))
        s.fx.ember(add(a.path(t), s.orient(a.path, t).F, 22 * ACE), add(shipAt(t + 0.6), [0, (j % 2 ? 1 : -1) * H * 0.2, 0]));
    });
    if (once(SALVO, dt)) {
      s.fx.missile(P, pb, sc, -1, aces[0].target, 60);
      s.fx.missile(P, pb, sc, 1, aces[1].target, 60);
    }
    if (t >= SALVO + 1.8) aces.forEach(kill);
    s.update(dt, null);
    s.clear();
    for (const a of aces) if (a.alive) s.paintShip(a.path(t), s.orient(a.path, t), ACE, RUST, { engine: false });
    s.paintFire();
    s.paintShip(P, pb, sc, INK, { dash: t >= DASH && t < DASH + 0.8 });
    const gone = aces.every(a => !a.alive) && s.off(s.project(P), 150);
    return t < 20 && (!gone || s.busy());
  };
  return { frame, at: () => s.project(shipAt(t)) };
};

/**
 * THE FOOT: THE JUMP, ~8 s, a goodbye with no enemy in it — the game's
 * other half, flying. The ship cruises in from the left, threads two of
 * the game's gates (each flares as it passes), rolls once, slow, for the
 * fun of it, then turns into the distance, the light pours past it, and
 * it jumps away in a flash.
 */
export const farewell = (band: HTMLCanvasElement): Battle => {
  const s = stage(band, 0.6);
  const { W, H, sc } = s;
  const GATES = [2.0, 3.8];
  const ROLL: [number, number] = [4.5, 5.9];
  const JUMP = 6.3;

  // In from the left, level and calm; from the jump on, away into the
  // depth with a long, eased acceleration.
  const shipAt: Path = t => {
    const u = Math.max(0, t - JUMP);
    return [
      W * (-0.55 + 0.1 * t) - W * 0.05 * u * u,
      -H * (0.02 + 0.06 * Math.sin(0.8 * t)) - H * 0.1 * u * u,
      -40 + 75 * t + 900 * u * u * u,
    ];
  };
  const roll = (t: number) => Math.PI * 2 * ease(within(t, ...ROLL));
  const gates = GATES.map(at => ({ at, C: shipAt(at), F: s.orient(shipAt, at).F }));
  const GATE_R = 62 * sc;

  let t = 0;
  let flash = -1;
  const frame = (dt: number) => {
    t += dt;
    const P = shipAt(t);
    const pb = s.orient(shipAt, t, roll(t));
    const seen = s.fog(P);
    if (flash < 0 && seen <= 0.35) flash = t;
    s.update(dt, null);
    s.clear();
    // Gates come up out of the dark ahead of it and stay a moment after.
    for (const g of gates) {
      const a = ease(within(t, g.at - 1.8, g.at - 0.9)) * (1 - ease(within(t, g.at + 0.6, g.at + 1.6)));
      s.paintGate(g.C, g.F, GATE_R, t, a, swell(t, g.at - 0.15, g.at + 0.5));
    }
    s.paintWarp(P, pb, ease(within(t, JUMP - 0.3, JUMP + 0.8)) * 1.6, t * 0.3);
    s.paintShip(P, pb, sc, INK, { dash: t > JUMP + 0.2 && seen > 0.4 });
    // The jump's flash, where it went.
    if (flash >= 0) {
      const p = s.project(P);
      const u = t - flash;
      s.ring(p, (6 + u * 160) * p[2] * (sc / 1.6) * 3, 2, INK_HI, 1 - u / 0.7);
      s.dot(p, 6 * (1 - u / 0.4) * (sc / 1.6) * 3, INK_HI, 1 - u / 0.4);
    }
    return flash < 0 || t < flash + 0.8;
  };
  return { frame, at: () => s.project(shipAt(t)) };
};

/** One battle on `band`, the link (when there is one) riding on the
 *  ship. Resolves when it is over. `alive`: still wanted? */
export const play = async (
  band: HTMLCanvasElement,
  link: HTMLAnchorElement | null,
  make: (band: HTMLCanvasElement) => Battle,
  alive: () => boolean = () => true,
) => {
  band.hidden = false;
  if (link) link.hidden = false;
  const battle = make(band);
  const rate = link ? holdable(link) : () => 1;
  let cut = false;
  const ended = await run(dt => {
    if (!alive()) return !(cut = true);
    const going = battle.frame(dt * rate(dt));
    if (link) {
      const [x, y] = battle.at();
      link.style.transform = `translate(${(x - 40).toFixed(1)}px, ${(y - 28).toFixed(1)}px)`;
    }
    return going;
  });
  if (!ended || cut) {
    // The page got busy: it leaves at once, without a cut.
    band.style.opacity = '0';
    await new Promise(r => setTimeout(r, 300));
    band.style.opacity = '';
  }
  if (link) link.hidden = true;
  band.hidden = true;
  release(band);
};

/** Reduced motion: one moment of a battle stands still a while, then
 *  fades. */
export const stand = async (
  band: HTMLCanvasElement,
  link: HTMLAnchorElement | null,
  make: (band: HTMLCanvasElement) => Battle,
  moment: number,
) => {
  band.hidden = false;
  if (link) link.hidden = false;
  const battle = make(band);
  for (let i = 0; i < moment * 60; i++) battle.frame(1 / 60);
  if (link) {
    const [x, y] = battle.at();
    link.style.transform = `translate(${x - 40}px, ${y - 28}px)`;
  }
  band.classList.add('is-still');
  await new Promise(r => setTimeout(r, 8000));
  band.classList.remove('is-still');
  await new Promise(r => setTimeout(r, 600));
  if (link) link.hidden = true;
  band.hidden = true;
  release(band);
};
