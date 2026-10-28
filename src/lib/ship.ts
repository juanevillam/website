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

// The cannon's bolts' speed (the game's are faster; on a page they read
// better a little slower).
const BOLT = 1150;

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
  /** Something that can be hit: where it is now, and what a hit does
   *  (`dir`: the way the shot was going). */
  type Target = { pos: () => V3; r: number; hit: (big: boolean, dir: V3) => void };
  const bolts: Bolt[] = [];
  const embers: Ember[] = [];
  const missiles: Missile[] = [];
  const sparks: Spark[] = [];
  const booms: Boom[] = [];
  let shieldHit = 0;
  // The stage's own clock: every script advances it once a frame.
  let now = 0;
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
    /** The cannon: pairs from beside the nose, four under Overdrive,
     *  fired along the ship's heading — bent toward `aim` only within the
     *  game's narrow auto-aim cone, as the game does — in world space, so
     *  they share the ship's depth and perspective. They fly on until they
     *  leave the screen or the fog takes them. */
    fire(P: V3, B: Basis, s: number, aim: V3 | null, quad: boolean, hits: Target | null) {
      muzzle = 0.06;
      for (const o of quad ? [-20, -7, 7, 20] : [-9, 9]) {
        const from = at(P, B, s, [o, 0, 24]);
        let dir = B.F;
        if (aim) {
          const want = norm(sub(aim, from));
          const cos = want[0] * B.F[0] + want[1] * B.F[1] + want[2] * B.F[2];
          const CONE = Math.cos(0.3);
          dir = cos >= CONE ? want : norm(add(B.F, norm(sub(want, mul(B.F, cos))), Math.tan(0.3)));
        }
        bolts.push({ p: from, v: mul(dir, BOLT * pace), hits, gone: false });
      }
    },
    /** Where to aim at something on `path` from `from`, leading it by the
     *  bolts' flight time. */
    lead(from: V3, path: (t: number) => V3) {
      let target = path(now);
      for (let i = 0; i < 3; i++) target = path(now + len(sub(target, from)) / (BOLT * pace));
      return target;
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
    /** A spent missile: a small rust ring and a few sparks. */
    spark(P: V3) {
      booms.push({ p: P, t: 0, big: false });
      spray(P, 6, 160 * (sc / 1.6), RUST_HI);
    },
    /** The game's kill (`bm` and `sy`): a rust ring that opens and the
     *  spray of white streaks. */
    explode(P: V3) {
      booms.push({ p: P, t: 0, big: false, size: 1.5 });
      spray(P, 8, 260 * (sc / 1.6), INK);
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
        b.hits.hit(false, norm(b.v));
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
        m.aim.hit(true, norm(m.v));
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
    for (const b of booms) b.t += dt;
    now += dt;
    shieldHit -= dt;
    muzzle -= dt;
  };

  /** Everything in flight, and still settling. */
  const busy = () =>
    bolts.some(b => !b.gone) ||
    embers.some(e => !e.gone) ||
    missiles.some(m => !m.gone) ||
    sparks.some(s => s.life < s.max) ||
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
      const r = (4 + b.t * (b.big ? 260 : 150)) * p[2] * (sc / 1.6) * (b.size ?? 1);
      if (b.big) dot(p, r * 0.8, AMB, 0.35 * (1 - b.t / 0.5));
      ring(p, r, b.big ? 3 : 1.5, b.big ? INK_HI : RUST, 1 - b.t / 0.5);
    }
    for (const s of sparks) if (s.life < s.max) seg(s.p, add(s.p, s.v, -0.05), 1, s.color, (s.max - s.life) * 1.6);
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

  /**
   * An enemy ship on `path`, with the game's answer to a hit — a white
   * flash for a moment (its `g`) and a small late ring (`XB(e, 0.3)`) —
   * and a jolt as well: knocked along the shot and rolled by it, settling
   * back. Hurt, it trails sparks; at the end, the game's death. A missile
   * hits for two.
   */
  const enemy = (path: Path, scale: number, hp: number, roll: (t: number) => number = () => 0) => {
    let hitAt = -9;
    let kick: V3 = [0, 0, 0];
    let side = 1;
    let smoke = 0;
    const full = hp;
    const knock = () => {
      const u = now - hitAt;
      return u >= 0 && u < 0.9 ? Math.sin(Math.min(1, u * 10) * Math.PI * 0.5) * Math.exp(-5 * u) : 0;
    };
    const e = {
      alive: true,
      path,
      pos: (): V3 => add(path(now), kick, knock()),
      basis: (): Basis => {
        const u = now - hitAt;
        const jolt = u >= 0 && u < 1 ? side * 0.8 * Math.exp(-4 * u) * Math.sin(11 * u) : 0;
        return orient(path, now, roll(now) + jolt);
      },
      hit(dir: V3, heavy: boolean) {
        if (!e.alive) return;
        hp -= heavy ? 2 : 1;
        hitAt = now;
        kick = mul(dir, (heavy ? 30 : 16) * scale);
        side = -side;
        booms.push({ p: e.pos(), t: 0.3, big: false });
        if (hp <= 0) {
          e.alive = false;
          fx.explode(e.pos());
        }
      },
      /** Downed whatever is left (the script's last word). */
      down() {
        if (!e.alive) return;
        e.alive = false;
        fx.explode(e.pos());
      },
      paint() {
        if (!e.alive) return;
        if (hp < full && now - smoke > 0.09) {
          smoke = now;
          spray(e.pos(), 1, 50 * (sc / 1.6), RUST_HI);
        }
        paintShip(e.pos(), e.basis(), scale, now - hitAt < 0.08 ? INK_HI : RUST, { engine: false });
      },
      target: { pos: () => e.pos(), r: 26 * scale, hit: (big: boolean, dir: V3) => e.hit(dir, big) } as Target,
    };
    return e;
  };

  /** Any of the game's models, stroked its way. */
  const paintModel = (M: Model, P: V3, B: Basis, scale: number, color: string, alpha: number) =>
    stroke(placed(M, P, B, scale), M[1], color, alpha, project(P)[2]);

  return { ctx, W, H, sc, project, fog, off, orient, at, fx, enemy, update, busy, paintFire, paintShip, paintShield, paintModel, ring, dot, clear: () => ctx.clearRect(0, 0, W, H) };
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

  // The ace's line: in at the left edge, one steady, gentle arc over the
  // top of the screen, farther as it goes — no weaving, so it banks only
  // as much as the arc turns; its one evasive move is the barrel roll
  // from the missiles. The kill a little right of centre, over the name.
  const aceAt: Path = t => [
    W * (-0.62 + 0.072 * t),
    -H * (0.24 + 0.015 * Math.sin(0.35 * t)),
    140 + 48 * t - 1.6 * t * t,
  ];
  // The chase gap, closed by the dash over most of a second.
  const lag = (t: number) => 1.5 - 0.65 * ease(within(t, DASH, DASH + 0.9));
  let killedAt = -1;
  let exit: { P: V3; V: V3 } | null = null;
  // The ship: on the ace's line, behind, below and nearer; after the
  // kill it keeps its speed and curves toward the camera, out at the
  // right.
  const shipAt: Path = t => {
    // Below the ace by a share of the screen's width, not its height: on
    // a tall phone it stays in line to fire on it.
    const chase = (u: number) => add(aceAt(u - lag(u)), [-W * 0.03, Math.min(H * 0.07, W * 0.045), -70]);
    if (!exit || t <= killedAt) return chase(t);
    const u = t - killedAt;
    return add(add(exit.P, exit.V, u), [W * 0.16, -H * 0.04, -260], u * u * 0.5);
  };

  let t = 0;
  // Two missiles (two each) and a handful of Overdrive bolts.
  const ace = s.enemy(aceAt, ACE, 8, t => Math.PI * 2 * ease(within(t, ...ROLL)));
  const once = (at: number, dt: number) => t >= at && t - dt < at;

  const frame = (dt: number) => {
    // Written slow, played a third faster: the same beats, tighter.
    dt *= 1.5;
    t += dt;
    if (!ace.alive && killedAt < 0) {
      killedAt = t;
      exit = { P: shipAt(t), V: mul(sub(shipAt(t + 0.02), shipAt(t - 0.02)), 25) };
    }
    const P = shipAt(t);
    const pb = s.orient(shipAt, t);
    const E = ace.pos();
    const eb = ace.basis();

    // The misses go where the ship points, a beat behind the ace's jinks;
    // the Overdrive volleys lead it.
    for (const v of VOLLEYS) if (once(v, dt)) s.fx.fire(P, pb, sc, null, false, null);
    for (const e of EMBERS) if (ace.alive && once(e, dt)) s.fx.ember(add(E, eb.F, -10 * ACE), P);
    if (once(SALVO, dt)) for (const side of [-1, 1]) s.fx.missile(P, pb, sc, side, ace.target);
    for (const f of FINISH) if (ace.alive && once(f, dt)) s.fx.fire(P, pb, sc, s.fx.lead(P, aceAt), true, ace.target);
    if (t >= FINISH[1] + 0.7) ace.down();

    s.update(dt, t >= SHIELD[0] && t < SHIELD[1] ? { P, r: 27 * sc } : null);
    s.clear();
    ace.paint();
    s.paintFire();
    s.paintShip(P, pb, sc, INK, { dash: t >= DASH && t < DASH + 0.7 });
    s.paintShield(P, t, SHIELD[0], SHIELD[1], 27 * sc);

    const gone = !ace.alive && s.off(s.project(P), 150);
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
  // A volley each: the first bolt rocks it, the second brings it down.
  const aces = [0, 1].map(i => s.enemy(aceAt(i), ACE, 2));
  const once = (at: number, dt: number) => t >= at && t - dt < at;

  const frame = (dt: number) => {
    t += dt;
    const P = shipAt(t);
    const pb = shipBasis(t);
    EMBERS.forEach((at, j) => {
      const a = aces[j % 2];
      if (once(at, dt)) s.fx.ember(add(a.pos(), a.basis().F, 22 * ACE), add(shipAt(t + 0.4), [0, (j % 2 ? 1 : -1) * H * 0.12, 0]));
    });
    VOLLEYS.forEach((at, i) => {
      if (once(at, dt) && aces[i].alive) s.fx.fire(P, pb, sc, s.fx.lead(P, aces[i].path), false, aces[i].target);
    });
    aces.forEach((a, i) => t >= VOLLEYS[i] + 0.7 && a.down());
    s.update(dt, null);
    s.clear();
    for (const a of aces) a.paint();
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
  // Each shot while the ship's nose is on its mark: the domes on the
  // run in, the bridge as it closes.
  const CHARGE: [number, number] = [0.55, 1.15];
  const ROLL: [number, number] = [1.0, 1.65];
  const SALVO = 1.7;
  const VOLLEY = 2.2;

  // The destroyer: level, as every ship is, in the same camera as the
  // ship — below the eye line, so the camera looks down onto its deck,
  // its bow angled away to the right, into the depth, its stern and
  // command tower nearer. It drifts slowly ahead.
  const sdB = (() => {
    const F = norm([0.8, 0, 0.6]);
    const U: V3 = [0, -1, 0];
    return { F, U, R: cross(F, U) };
  })();
  // On a phone the foot's open space is higher, between the profiles and
  // the apps' pages: the whole scene rises into it.
  const lift = W < 600 ? -H * 0.45 : 0;
  const sdAt: Path = t => add([W * 0.06, H * 0.55 + lift, 700], sdB.F, 14 * t);
  /** A point on its hull (the game's local units). */
  const onHull = (t: number, p: V3) => s.at(sdAt(t), sdB, SD, p);
  const BRIDGE: V3 = [0, -150, -345];
  const DOMES: V3[] = [[110, -185, -340], [-110, -185, -340]];
  const NOSE: V3 = [0, 10, 560];

  // The ship: a curve in from the near left, low, toward the bridge,
  // then over it and up and away, off the top.
  const P0: V3 = [-W * 0.75, H * 0.62 + lift, -60];
  const P1: V3 = [-W * 0.42, H * 0.5 + lift, 240];
  const P2: V3 = [-W * 0.05, H * 0.28 + lift, 470];
  const P3: V3 = [W * 0.45, -H * 1.1, 640];
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
      breakDome();
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
    if (once(VOLLEY, dt) || once(VOLLEY + 0.2, dt)) s.fx.fire(P, pb, sc, bridge.pos(), true, bridge);
    if (domes > 0 && t > SALVO + 0.7) breakDome();
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
