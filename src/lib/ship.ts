import { fit, holdable, release, run } from './eggs';

/**
 * SPACE EXPLORER'S SHIP, in three short scripted scenes (ShipEgg), each
 * its own: THE HUNT behind the hero's name, THE KULBIT over the game's
 * card in More Work, and THE DESTROYER across the foot. Deliberate:
 * a few well-timed bolts and missiles, eased rolls and turns, each with
 * a build-up, a climax and a graceful exit.
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

// The game's destroyer: a wedge of nearly a thousand units with its
// command tower aft. Local x right, y down, z toward the bow.
const DESTROYER = mdl(
  [0, 0, 560, -300, 0, -400, 300, 0, -400, 0, -80, -400, 0, 70, -400, -280, 24, -400, 280, 24, -400, 0, -45, 80, -80, -70, -250, 80, -70, -250, 80, -70, -400, -80, -70, -400, -60, -150, -290, 60, -150, -290, 60, -150, -400, -60, -150, -400, -130, -165, -340, 130, -165, -340, -150, -40, -400, 150, -40, -400, -36, -30, 420, 36, -30, 420, -56, -56, -250, 56, -56, -250, -60, 38, 60, 60, 38, 60, -60, 44, -120, 60, 44, -120, -110, -180, -340, 110, -180, -340, -150, -6, 180, 150, -6, 180, -95, -142, -338, 95, -142, -338, -70, -110, -272, 70, -110, -272, 70, -110, -400, -70, -110, -400],
  '010207730413231526546405060B0C899::;;8<==>>??<8<9=:>;?@A<@=ADFEGDEHIIKKJJH<L=M0NN10OO2PQRSSTTUUR',
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
const stage = (band: HTMLCanvasElement, cyShare: number, fogFrom = 1400) => {
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
  // What flies between the ships flies at the page's size: on a phone
  // it crosses the same share of the screen in the same time.
  const pace = Math.min(1, W / 1100);
  const project = ([x, y, z]: V3): Pt => {
    const yc = y * cp - z * sp;
    const zc = Math.max(-EYE * 0.7, y * sp + z * cp);
    const k = EYE / (EYE + zc);
    return [cx + x * k, cy + yc * k, k];
  };
  // The game's fog: far things fade into the dark.
  const fog = (P: V3) => Math.max(0, Math.min(1, 1 - (P[2] - fogFrom) / 600));
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
  type Ember = { p: V3; v: V3; size: number; gone: boolean };
  type Missile = { p: V3; v: V3; trail: V3[]; spin: number; aim: Target; life: number; gone: boolean };
  type Spark = { p: V3; v: V3; life: number; max: number; color: string };
  type Boom = { p: V3; t: number; big: boolean; size?: number };
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
        bolts.push({ p: from, v: mul(norm(sub(aim, from)), 1150 * pace), hits, gone: false });
      }
    },
    /** An ace's ember, at `aim`. */
    ember(from: V3, aim: V3, size = 1) {
      embers.push({ p: from, v: mul(norm(sub(aim, from)), (size > 1 ? 620 : 460) * pace), size, gone: false });
    },
    /** A missile off a wing, homing on `aim`. */
    missile(P: V3, B: Basis, s: number, side: number, aim: Target, spread = 170) {
      missiles.push({ p: at(P, B, s, [side * 14, 0, 0]), v: mul(add(mul(B.F, 300), B.R, side * spread), pace), trail: [], spin: 0, aim, life: 0, gone: false });
    },
    /** A big blast at `P`, `size` times the game's (the destroyer's). */
    blast(P: V3, size: number) {
      booms.push({ p: P, t: 0, big: true, size });
      spray(P, 18, 260 * (sc / 1.6) * size, RUST_HI);
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
      m.life += dt;
      const speed = Math.min(820 * pace, len(m.v) + 500 * pace * dt);
      m.v = mul(norm(add(norm(m.v), want, Math.min(1, dt * 4.5))), speed);
      m.p = add(m.p, m.v, dt);
      m.trail.push(m.p);
      if (m.trail.length > 22) m.trail.shift();
      if (len(sub(m.p, m.aim.pos())) < m.aim.r) {
        m.gone = true;
        m.aim.hit(true);
      } else if (off(project(m.p), 200)) m.gone = true;
      else if (m.life > 2.2) {
        // Spent: it bursts where it is, as the game's do.
        m.gone = true;
        fx.spark(m.p);
      }
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
      const r = Math.max(2, 4.5 * e.size * p[2] * (sc / 1.6));
      const a = fog(e.p);
      seg(e.p, add(e.p, e.v, -0.06), r * 0.9, RUST, 0.45 * a);
      dot(p, r * 1.8, RUST, 0.4 * a);
      dot(p, r, RUST_HI, 0.95 * a);
      dot(p, r * 0.45, CRM, 0.9 * a);
    }
    for (const b of booms) {
      if (b.t > 0.5) continue;
      const p = project(b.p);
      const r = (4 + b.t * (b.big ? 260 : 110)) * p[2] * (sc / 1.6) * (b.size ?? 1);
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

  /** Any of the game's models, stroked its way. */
  const paintModel = (M: Model, P: V3, B: Basis, scale: number, color: string, alpha: number) =>
    stroke(placed(M, P, B, scale), M[1], color, alpha, project(P)[2]);

  return { ctx, W, H, sc, project, fog, off, orient, at, fx, update, busy, paintFire, paintShip, paintShield, paintModel, ring, dot, clear: () => ctx.clearRect(0, 0, W, H) };
};

/** A battle: `frame(dt)` advances and paints it and says false once it
 *  is over; `at()` is where the ship is on screen. */
export type Battle = { frame: (dt: number) => boolean; at: () => Pt };

/**
 * THE HERO: THE HUNT, ~8 s, left to right across the top of the
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
    // Written slow, played a third faster: the same beats, tighter.
    dt *= 1.5;
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
 * MORE WORK: THE KULBIT, ~5.5 s, over the game's own card, right to left.
 *
 * Build-up: the ship sweeps in with two aces on its tail; their embers
 * slip past it. Climax: the post-stall Kulbit — the nose pitches up past
 * vertical, the ship all but stops and somersaults backward in place,
 * and the aces, too fast to follow, shoot through underneath it. It
 * comes out of the flip on their tails: one volley each, and both go.
 * Exit: it eases back to speed and away off the left edge.
 */
export const chase = (band: HTMLCanvasElement): Battle => {
  // A phone's band is short: the line a little lower there, the ships a
  // size smaller and the loop tighter.
  const phone = band.clientWidth < 600;
  const s = stage(band, phone ? 0.36 : 0.42);
  const { W, H } = s;
  const sc = s.sc * (phone ? 0.75 : 1);
  const ACE = 1.1 * sc;
  const EMBERS = [0.7, 1.05];
  const KULBIT: [number, number] = [1.6, 2.9];
  const VOLLEYS = [3.15, 3.55];

  // The ship's speed (share of the width a second): a cruise, almost
  // nothing through the flip, then away harder.
  const speed = (t: number) =>
    0.24 - 0.22 * Math.min(ease(within(t, KULBIT[0] - 0.25, KULBIT[0] + 0.2)), 1 - ease(within(t, KULBIT[1] - 0.2, KULBIT[1] + 0.5))) + 0.08 * ease(within(t, KULBIT[1], KULBIT[1] + 1.2));
  const xs: number[] = [0];
  const STEP = 1 / 120;
  const along = (t: number) => {
    const i = Math.max(0, Math.floor(t / STEP));
    while (xs.length <= i + 1) xs.push(xs[xs.length - 1] + speed(xs.length * STEP) * STEP);
    return xs[i] + (xs[i + 1] - xs[i]) * (t / STEP - i);
  };
  // The flip: the nose up and over, all the way round, eased in and out.
  const pitch = (t: number) => Math.PI * 2 * ease(within(t, ...KULBIT));
  const LOOP = phone ? 26 : 34; // the somersault's radius, in model units
  // Right to left, a gentle weave; through the flip, a tight loop.
  const cruise: Path = t => [W * (0.66 - along(t)), -H * 0.04 * Math.sin(1.4 * t), 160 + 30 * Math.sin(0.8 * t)];
  const shipAt: Path = t => {
    const c = cruise(t);
    const th = pitch(t);
    // F0 is -x (it flies left), U0 is up: the loop rises and comes back.
    return [c[0] - Math.sin(th) * LOOP * sc * 0.6, c[1] - (1 - Math.cos(th)) * LOOP * sc, c[2]];
  };
  const shipBasis = (t: number): Basis => {
    const th = pitch(t);
    if (th <= 0 || th >= Math.PI * 2) return s.orient(cruise, t);
    // Through the flip the basis turns about the wings: nose up, over,
    // and down again.
    const F0: V3 = [-1, 0, 0];
    const U0: V3 = [0, -1, 0];
    const F = add(mul(F0, Math.cos(th)), U0, Math.sin(th));
    const U = add(mul(U0, Math.cos(th)), F0, -Math.sin(th));
    return { F, U, R: cross(F, U) };
  };
  // The aces: faster than the cruise, so they close in; through the
  // flip they shoot by underneath, and carry on ahead. One a little
  // higher and farther, one lower and nearer.
  const aceAt = (i: number): Path => t => {
    const c = cruise(Math.max(0, t - 0.3));
    return [W * (0.66 + 0.16 + i * 0.09) - W * 0.3 * t, c[1] + H * (i ? 0.16 : 0.1), c[2] + (i ? -30 : 40)];
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
    const pb = shipBasis(t);
    EMBERS.forEach((at, j) => {
      const a = aces[j % 2];
      if (once(at, dt)) s.fx.ember(add(a.path(t), s.orient(a.path, t).F, 22 * ACE), add(shipAt(t + 0.4), [0, (j % 2 ? 1 : -1) * H * 0.12, 0]));
    });
    VOLLEYS.forEach((at, i) => {
      if (once(at, dt) && aces[i].alive) s.fx.fire(P, pb, sc, aces[i].path(t + 0.15), false, aces[i].target);
    });
    aces.forEach((a, i) => t >= VOLLEYS[i] + 0.6 && kill(a));
    s.update(dt, null);
    s.clear();
    for (const a of aces) if (a.alive) s.paintShip(a.path(t), s.orient(a.path, t), ACE, RUST, { engine: false });
    s.paintFire();
    s.paintShip(P, pb, sc, INK);
    const gone = aces.every(a => !a.alive) && s.off(s.project(P), 120);
    return t < 12 && (!gone || s.busy());
  };
  return { frame, at: () => s.project(shipAt(t)) };
};

/**
 * THE FOOT: THE DESTROYER, ~5.5 s. The game's destroyer — its wedge of a
 * hull, three engines burning at the stern, position lights, the two blue
 * shield domes over the bridge — materialises in the distance as it does
 * in the game. The ship comes in from below left, straight at it; the
 * bow cannon charges and fires, and a roll takes the ship out of the
 * way. A missile pair breaks the domes, one Overdrive volley hits the
 * exposed bridge, and the destroyer goes down in a chain of blasts as the
 * ship climbs away past it, off the top of the screen.
 */
export const destroyer = (band: HTMLCanvasElement): Battle => {
  const s = stage(band, 0.6, 2600);
  const { W, H, sc } = s;
  const SD = 1.6 * (sc / 2) * 0.62; // the game's SD_SCALE, at this page's size
  const CHARGE: [number, number] = [0.9, 1.6];
  const ROLL: [number, number] = [1.45, 2.15];
  const SALVO = 2.05;
  const VOLLEY = 2.85;

  // The destroyer: far off, drifting slowly to the right, bow toward the
  // ship's side, a little turned toward us.
  const sdAt: Path = t => [W * (0.1 + 0.012 * t), H * 0.42, 1000];
  // Tipped toward the eye, so its wedge reads from above, as the game
  // shows it from its chase camera.
  const sdB = (() => {
    const F = norm([1, 0, -0.45]);
    const U = norm([0, -1, -0.9]);
    const R = norm(cross(F, U));
    return { F: cross(U, R), U, R };
  })();
  /** A point on its hull (the game's local units). */
  const onHull = (t: number, p: V3) => s.at(sdAt(t), sdB, SD, p);
  const BRIDGE: V3 = [0, -150, -345];
  const DOMES: V3[] = [[110, -185, -340], [-110, -185, -340]];
  const NOSE: V3 = [0, 10, 560];

  // The ship: a curve in from the near bottom left, toward the bridge,
  // then up and away past it, off the top.
  const P0: V3 = [-W * 0.72, H * 0.5, -120];
  const P1: V3 = [-W * 0.3, H * 0.42, 380];
  const P2: V3 = [W * 0.08, H * 0.1, 720];
  const P3: V3 = [W * 0.6, -H * 1.1, 700];
  const shipAt: Path = t => {
    const u = Math.max(0, Math.min(1.25, (t - 0.25) / 4.4));
    const v = 1 - u;
    return add(add(add(mul(P0, v * v * v), P1, 3 * v * v * u), P2, 3 * v * u * u), P3, u * u * u);
  };
  const roll = (t: number) => Math.PI * 2 * ease(within(t, ...ROLL));

  let t = 0;
  let domes = 2;
  let sunkAt = -1;
  const blasts: [number, V3, number][] = [];
  const dome = { pos: () => onHull(t, DOMES[0]), r: 70 * SD, hit: () => breakDome() };
  const breakDome = () => {
    if (domes <= 0) return;
    domes = 0;
    for (const d of DOMES) s.fx.blast(onHull(t, d), 0.6);
  };
  const bridge = {
    pos: () => onHull(t, BRIDGE),
    r: 90 * SD,
    hit: () => {
      if (sunkAt >= 0) return;
      sunkAt = t;
      // A chain along the hull: the bridge, amidships, the bow, the stern.
      [[0, BRIDGE, 1.4], [0.25, [0, -45, 80] as V3, 1], [0.5, NOSE, 0.9], [0.7, [-130, 18, -400] as V3, 1.1], [0.85, [130, 18, -400] as V3, 1]].forEach(
        ([d, p, z]) => blasts.push([sunkAt + (d as number), p as V3, z as number]),
      );
    },
  };
  const once = (at: number, dt: number) => t >= at && t - dt < at;

  const frame = (dt: number) => {
    t += dt;
    const P = shipAt(t);
    const pb = s.orient(shipAt, t, roll(t));
    if (once(CHARGE[1], dt)) s.fx.ember(onHull(t, NOSE), shipAt(t + 0.55), 3.2);
    if (once(SALVO, dt)) for (const side of [-1, 1]) s.fx.missile(P, pb, sc, side, dome, 90);
    if (once(VOLLEY, dt)) s.fx.fire(P, pb, sc, bridge.pos(), true, bridge);
    if (domes > 0 && t > SALVO + 1.1) breakDome();
    if (sunkAt < 0 && t > VOLLEY + 0.6) bridge.hit();
    for (const b of blasts) if (once(b[0], dt)) s.fx.blast(onHull(t, b[1]), b[2]);

    s.update(dt, null);
    s.clear();
    // It materialises over a second, and after the bridge goes it fades
    // away slowly, sinking, as the game's destroyer falls.
    const sink = sunkAt < 0 ? 0 : ease((t - sunkAt) / 1.6);
    const seen = ease(t / 1.1) * (1 - sink);
    if (seen > 0) {
      const at = add(sdAt(t), [0, sink * H * 0.12, 0]);
      const hull = (p: V3) => s.at(at, sdB, SD, p);
      s.paintModel(DESTROYER, at, sdB, SD, RUST, seen * 0.95);
      // Three engines burning at the stern.
      for (const ox of [-130, 0, 130]) {
        const e = s.project(hull([ox, 18, -406]));
        const r = 16 * SD * e[2];
        s.dot(e, r * 1.6, AMB, 0.25 * seen);
        s.dot(e, r * 0.7, CRM, 0.85 * seen);
      }
      // Position lights, breathing rather than blinking.
      ([[0, -6, 560], [-300, -4, -400], [300, -4, -400], [-130, -168, -340], [130, -168, -340], [0, -48, 80]] as V3[]).forEach((l, i) =>
        s.dot(s.project(hull(l)), Math.max(1.5, 3 * SD * 2), i < 3 ? RUST_HI : BLU, seen * (0.5 + 0.4 * Math.sin(t * 2.4 + i))),
      );
      // The shield domes over the bridge, while they stand.
      if (domes > 0)
        for (const d of DOMES) {
          const p = s.project(hull(d));
          const r = 36 * SD * p[2];
          s.dot(p, r, BLD, (0.12 + 0.08 * Math.sin(t * 4)) * seen);
          s.ring(p, r, 1.5, BLD, 0.9 * seen);
        }
      // The bow cannon charging: the warning.
      if (t > CHARGE[0] && t < CHARGE[1]) {
        const c = (t - CHARGE[0]) / (CHARGE[1] - CHARGE[0]);
        const p = s.project(hull(NOSE));
        const k = SD * p[2];
        s.dot(p, (10 + 40 * c) * k, RUST_HI, (0.3 + 0.5 * c) * seen);
        s.ring(p, (60 - 40 * c) * k, 2, CRM, c * seen);
      }
    }
    s.paintFire();
    s.paintShip(P, pb, sc, INK, { dash: t > VOLLEY + 0.2 && t < VOLLEY + 0.8 });
    const gone = sunkAt >= 0 && s.off(s.project(P), 120);
    return t < 12 && (!gone || s.busy() || seen > 0);
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
