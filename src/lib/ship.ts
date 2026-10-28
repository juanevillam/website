import { fit, holdable, release, run } from './eggs';

/**
 * SPACE EXPLORER'S SHIP, in three short scenes (ShipEgg) — THE HUNT behind
 * the hero's name, THE ESCAPE over the game's card in More Work, and THE
 * DESTROYER across the foot — that PLAY the game rather than imitate it.
 *
 * Each scene runs a small copy of the game's own simulation
 * (../games/platanus-hack-26-venezuela-arcade/game.js), with its numbers
 * and rules: the player's ship flies at the game's cruise speed, turns
 * with its eased yaw and pitch rates on a locked horizon, banks only as a
 * visual of its turn, and makes the game's own moves (the dash's
 * straight kick, the shield's bubble, nitro); its cannon fires the
 * game's bolts at the game's cadence and speed, nudged only within the
 * game's narrow auto-aim cone, and its missiles home at the game's turn
 * rate. The aces run the game's AI — always forward at their speed,
 * steering toward you, breaking away when you are close or have them in
 * your sights — and fire the game's slow, leading embers. Hits, damage,
 * deaths, and the destroyer's entrance, salvo, turrets, domes and bridge
 * are the game's. What a scene adds is only the stick — when to turn,
 * fire, dash or raise the shield — and a camera framing it for the page.
 */

type V3 = [number, number, number];
type Model = [V3[], [number, number][]];
type Basis = { F: V3; U: V3; R: V3 };
/** A projected point: screen x, y and pixels per world unit there. */
type Pt = [number, number, number];

const mdl = (flat: number[], es: string): Model => {
  const V: V3[] = [];
  for (let i = 0; i < flat.length; i += 3) V.push([flat[i], flat[i + 1], flat[i + 2]]);
  const E: [number, number][] = [];
  for (let i = 0; i < es.length; i += 2) E.push([es.charCodeAt(i) - 48, es.charCodeAt(i + 1) - 48]);
  return [V, E];
};

// ----- the game's models (vertices and edges as the game ships them) -----
const SHIP = mdl(
  [0, 0, 26, 0, -3.5, 14, 0, -5.5, 2, 0, -4, -8, 0, -11, -17, 0, 0, -16, -5, -1, 8, 5, -1, 8, -22, 1, -13, 22, 1, -13, -22, -4, -15, 22, -4, -15, 0, 3, -6, -9, 1, -2, 9, 1, -2, -11, 1, -15, 11, 1, -15, -3, -1.5, 19, 3, -1.5, 19],
  '0112233445350607687985958:9;0<<56<7<6==?7>>@?5@50AA60BB72627',
);
const MISSILE = mdl(
  [0, 0, 16, 0, 0, -12, -3, 0, 8, 3, 0, 8, 0, -3, 8, 0, 3, 8, -8, 0, -14, 8, 0, -14, 0, -8, -14, 0, 8, -14, -3, 0, -6, 3, 0, -6, 0, -3, -6, 0, 3, -6],
  '020304052:3;4<5=:6;7<8=961718191',
);
const SENTRY = mdl([-22, 14, -22, 22, 14, -22, 22, 14, 22, -22, 14, 22, 0, -26, 0], '01122330041424340213');
const DESTROYER = mdl(
  [0, 0, 560, -300, 0, -400, 300, 0, -400, 0, -80, -400, 0, 70, -400, -280, 24, -400, 280, 24, -400, 0, -45, 80, -80, -70, -250, 80, -70, -250, 80, -70, -400, -80, -70, -400, -60, -150, -290, 60, -150, -290, 60, -150, -400, -60, -150, -400, -130, -165, -340, 130, -165, -340, -150, -40, -400, 150, -40, -400, -36, -30, 420, 36, -30, 420, -56, -56, -250, 56, -56, -250, -60, 38, 60, 60, 38, 60, -60, 44, -120, 60, 44, -120, -110, -180, -340, 110, -180, -340, -150, -6, 180, 150, -6, 180, -95, -142, -338, 95, -142, -338, -70, -110, -272, 70, -110, -272, 70, -110, -400, -70, -110, -400],
  '010207730413231526546405060B0C899::;;8<==>>??<8<9=:>;?@A<@=ADFEGDEHIIKKJJH<L=M0NN10OO2PQRSSTTUUR',
);

// ----- the game's numbers -----
const CRUISE = 220; // the ship's cruise speed (me.cu)
const SPEED_EASE = 3; // 1/s back to cruise
const YAW_RATE = 2.4; // rad/s at full stick
const PITCH_RATE = 2.5;
const STICK_EASE = 13; // 1/s: the turn answers at once
const BANK = 0.34; // visual roll per rad/s of yaw
const DASH_KICK = 260;
const DASH_GHOSTS = 0.45; // s untouchable, with its ghost copies
const NITRO_MAX = 760;
const NITRO_ACCEL = 260;
const FIRE_MS = 0.16;
const FIRE_OD_MS = 0.07; // under Overdrive
const BOLT_SPEED = 980; // plus the ship's own speed
const BOLT_LIFE = 3.2;
const AIM_CONE = 0.985; // the cannon's auto-aim: only what you already point at
const WEAK_CONE = 0.93; // against the destroyer's weak points
const MISSILE_SPEED = 560;
const MISSILE_TURN = 3.4;
const MISSILE_DMG = 4;
const MISSILE_LIFE = 7;
const SHIELD_R = 52;
const SHIELD_S = 2.6; // B4: the shield's bubble eats what reaches you this long…
const SHIELD_COOL = 4; // …and comes back after this
const ACE_SPEED = 320;
const ACE_TURN = 2.3;
const ACE_BREAK_TURN = 3.6;
const ACE_SCALE = 2.2;
const ACE_R = 66; // 22 × HUNTER_SCALE
const ACE_HP = 4;
const ACE_FIRE = 2.2; // s between shots
const ACE_RANGE = 1300;
// The kamikaze: a hunter that goes flat out, never breaks off and never
// fires — it means to ram you.
const KZ_SPEED = 470;
const KZ_TURN = 1.5;
const KZ_R = 48; // 16 × HUNTER_SCALE
const SHOT_SPEED = 250; // the aces' embers: slow, so you see them come
const SHOT_LIFE = 6;
const SD_SCALE = 1.6;

// The game's palette.
const INK = '#f5f5f5';
const INK_HI = '#eef2f7';
const RUST = '#a65240';
const RUST_HI = '#c97b5a';
const AMB = '#f6c98a';
const CRM = '#fff1d6';
const BLU = '#b8dbe4';
const BLD = '#8fb0c4';

const UP: V3 = [0, -1, 0]; // the game's world: y points down
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const norm = (a: V3): V3 => mul(a, 1 / (len(a) || 1));
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
/** `v` turned `th` about the axis `a` (Rodrigues). */
const rotAxis = (v: V3, a: V3, th: number): V3 => {
  const c = Math.cos(th);
  const s = Math.sin(th);
  return add(add(mul(v, c), cross(a, v), s), a, dot(a, v) * (1 - c));
};
/** The game's orthoBasis: F kept, U squared to it, R = F × U. */
const ortho = (F: V3, U: V3): Basis => {
  const f = norm(F);
  const R = norm(cross(f, U));
  return { F: f, R, U: cross(R, f) };
};
/** A level basis heading along yaw `E` (the game draws enemies so). */
const yawBasis = (E: number): Basis => ortho([Math.sin(E), 0, Math.cos(E)], UP);
/** A repeatable random, for sparks: the same scene every time. */
const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

/** Something that can be hit. */
type Target = { pos: () => V3; vel: () => V3; r: number; alive: () => boolean; hit: (dmg: number) => void };

/**
 * THE STAGE: the camera and the game's world on one canvas — the bolts,
 * embers, missiles, explosions and sparks, and how each is drawn.
 */
const stage = (band: HTMLCanvasElement) => {
  const { ctx, width: W, height: H } = fit(band);
  const rand = rng(7);
  // The camera: a point, a basis and a focal length, like the game's own
  // (Q), aimed where the scene says.
  let E: V3 = [0, 0, -1000];
  let C: Basis = ortho([0, 0, 1], UP);
  let f = W;
  let cx = W / 2;
  let cy = H / 2;
  const NEAR = 14;
  const aim = (eye: V3, at: V3, focal: number, x: number, y: number) => {
    E = eye;
    C = ortho(sub(at, eye), UP);
    f = focal;
    cx = x;
    cy = y;
  };
  const project = (p: V3): Pt | null => {
    const d = sub(p, E);
    const cz = dot(d, C.F);
    if (cz < NEAR) return null;
    return [cx + (dot(d, C.R) * f) / cz, cy - (dot(d, C.U) * f) / cz, f / cz];
  };
  const off = (p: Pt | null, m = 80) => !p || p[0] < -m || p[0] > W + m || p[1] < -m || p[1] > H + m;
  // The game's line widths are for its 800-pixel screen.
  const px = clamp(W / 800, 0.6, 1.4);

  const placed = ([V]: Model, P: V3, B: Basis, s: number, bank = 0) => {
    const cb = Math.cos(bank);
    const sb = Math.sin(bank);
    return V.map(([mx0, my0, mz]) => {
      const mx = (mx0 * cb - my0 * sb) * s;
      const my = (mx0 * sb + my0 * cb) * s;
      return project(add(add(add(P, B.R, mx), B.U, -my), B.F, mz * s));
    });
  };
  /** The game's stroke (sg): a wide faint pass under the line. */
  const stroke = (pts: (Pt | null)[], edges: [number, number][], color: string, alpha: number, k = 1) => {
    if (alpha <= 0) return;
    ctx.beginPath();
    for (const [a, b] of edges) {
      const p = pts[a];
      const q = pts[b];
      if (!p || !q) continue;
      ctx.moveTo(p[0], p[1]);
      ctx.lineTo(q[0], q[1]);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 4.5 * px * k;
    ctx.globalAlpha = alpha * 0.18;
    ctx.stroke();
    ctx.lineWidth = 1.5 * px * k;
    ctx.globalAlpha = alpha;
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  const dot2 = (p: Pt | null, r: number, color: string, alpha: number) => {
    if (!p || alpha <= 0) return;
    ctx.globalAlpha = Math.min(1, alpha);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p[0], p[1], Math.max(0.6, r), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };
  const ring = (p: Pt | null, r: number, w: number, color: string, alpha: number) => {
    if (!p || alpha <= 0) return;
    ctx.globalAlpha = Math.min(1, alpha);
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(p[0], p[1], Math.max(0.5, r), 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  const line = (a: V3, b: V3, w: number, color: string, alpha: number) => {
    const p = project(a);
    const q = project(b);
    if (!p || !q || alpha <= 0) return;
    ctx.globalAlpha = Math.min(1, alpha);
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(q[0], q[1]);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  // ----- the game's effects -----
  type Bolt = { p: V3; v: V3; life: number };
  type Shot = { p: V3; v: V3; life: number; big: boolean };
  type Missile = { p: V3; v: V3; trail: V3[]; life: number; aim: Target | null; spin: number };
  /** XB: an explosion, a flash or a muzzle flare (t starts where it says). */
  type Boom = { p: V3; t: number; h?: boolean; r?: number; q1?: boolean };
  type Spark = { p: V3; v: V3; n: number };
  const bolts: Bolt[] = [];
  const shots: Shot[] = [];
  const missiles: Missile[] = [];
  const booms: Boom[] = [];
  const sparks: Spark[] = [];
  let targets: Target[] = [];

  /** sy: the spray of white streaks. */
  const spray = (p: V3, n: number) => {
    for (let i = 0; i < n; i++) {
      const a1 = rand() * Math.PI * 2;
      const a2 = (rand() - 0.5) * Math.PI;
      const sp = 120 + rand() * 240;
      sparks.push({ p, v: [Math.sin(a1) * Math.cos(a2) * sp, Math.sin(a2) * sp, Math.cos(a1) * Math.cos(a2) * sp], n: 0.5 + rand() * 0.3 });
    }
  };
  const boom = (p: V3, t = 0, o: Partial<Boom> = {}) => booms.push({ p, t, ...o });

  /** sa: an enemy shot at where the player is GOING to be. */
  const enemyShot = (from: V3, player: Player, speed: number, big = false) => {
    boom(from, 0.28, { q1: true });
    const t = len(sub(player.P, from)) / speed;
    const to = add(player.P, player.F, player.H * t * 0.7);
    shots.push({ p: from, v: mul(norm(sub(to, from)), speed), life: big ? 12 : SHOT_LIFE, big });
  };

  /** Moves the fire; `player` takes the embers (or its shield does). */
  const update = (dt: number, player: Player | null, now: number) => {
    for (const b of bolts) {
      b.p = add(b.p, b.v, dt);
      b.life -= dt;
      for (const t of targets)
        if (b.life > 0 && t.alive() && len(sub(b.p, t.pos())) < t.r) {
          b.life = 0;
          t.hit(1);
        }
    }
    for (const s of shots) {
      s.p = add(s.p, s.v, dt);
      s.life -= dt;
      if (player && s.life > 0) {
        const d = len(sub(s.p, player.P));
        if (now < player.su && d < SHIELD_R) {
          s.life = 0;
          player.ht = 0.3;
        } else if (d < (s.big ? 40 : 18) && now >= player.du) {
          s.life = 0;
          boom(s.p, 0.25);
        }
      }
    }
    for (const m of missiles) {
      if (m.life <= 0) continue;
      m.spin += dt * 9;
      if (m.aim && m.aim.alive()) {
        const d = sub(m.aim.pos(), m.p);
        const dd = len(d);
        const k = Math.min(1, MISSILE_TURN * dt);
        m.v = add(m.v, sub(mul(d, MISSILE_SPEED / dd), m.v), k);
        if (dd < m.aim.r + 16) {
          // dn: the missile bursts — the big ring and its amber flash
          m.life = 0;
          boom(m.p, 0, { h: true, r: 150 });
          m.aim.hit(MISSILE_DMG);
          continue;
        }
      }
      m.trail.push(m.p);
      if (m.trail.length > 14) m.trail.shift();
      m.p = add(m.p, m.v, dt);
      m.life -= dt;
    }
    for (const b of booms) b.t += dt;
    for (const s of sparks) {
      s.p = add(s.p, s.v, dt);
      s.n -= dt;
    }
    if (player) player.ht -= dt;
  };

  /** Nothing left to see go (the cannon's bolts too, unless `bolts` is
   *  false: a stream fired into the distance can end with the scene). */
  const settled = (withBolts = true) =>
    (!withBolts || bolts.every(b => b.life <= 0 || off(project(b.p), 40))) &&
    missiles.every(m => m.life <= 0) &&
    booms.every(b => b.t > 0.5) &&
    sparks.every(s => s.n <= 0);

  const paintFire = () => {
    // embers: rust with a white-hot core and their streak
    for (const s of shots) {
      if (s.life <= 0) continue;
      const p = project(s.p);
      if (!p) continue;
      const r = clamp((s.big ? 48 : 7) * p[2], s.big ? 6 : 2.5, s.big ? 70 : 14);
      line(s.p, add(s.p, s.v, -0.35), r * 0.9, RUST, 0.45);
      dot2(p, r * 1.8, RUST, 0.4);
      dot2(p, r, RUST_HI, 0.95);
      dot2(p, r * 0.45, CRM, 0.9);
    }
    for (const b of booms) {
      if (b.t < 0 || b.t > 0.5) continue;
      const p = project(b.p);
      if (!p) continue;
      if (b.q1) {
        dot2(p, Math.max(4, 30 * p[2]), RUST_HI, (0.5 - b.t) * 3.5);
        continue;
      }
      const r = (4 + b.t * (b.r ? b.r * 2.4 : b.h ? 260 : 150)) * p[2];
      // (the amber heat is a missile's; the destroyer's arrival is a ring)
      if (b.r && b.r < 500) dot2(p, r * 0.8, AMB, 0.35 * (1 - b.t / 0.5));
      ring(p, r, b.r ? 3 : 1.5, b.h ? INK_HI : RUST, 1 - b.t / 0.5);
    }
    for (const s of sparks) if (s.n > 0) line(s.p, add(s.p, s.v, -0.05), 1, INK, s.n * 1.6);
    // the cannon: bright strokes
    for (const b of bolts) if (b.life > 0) line(b.p, add(b.p, b.v, -0.03), 2 * px, INK_HI, 0.9);
    // missiles: trail, the model, its flame
    for (const m of missiles) {
      if (m.life <= 0) continue;
      for (let i = 1; i < m.trail.length; i++) line(m.trail[i - 1], m.trail[i], 1 + i * 0.3, INK_HI, (i / m.trail.length) * 0.45);
      const F = norm(m.v);
      const B = ortho(F, UP);
      const p = project(m.p);
      stroke(placed(MISSILE, m.p, B, 1.5, m.spin), MISSILE[1], INK_HI, 1);
      dot2(project(add(m.p, F, -20)), p ? Math.max(2.5, 14 * p[2]) : 0, AMB, 0.9);
    }
  };

  return {
    ctx, W, H, px, project, off, aim, placed, stroke, dot: dot2, ring, line, spray, boom, enemyShot, update, settled, paintFire,
    bolts, shots, missiles,
    setTargets: (t: Target[]) => (targets = t),
    clear: () => ctx.clearRect(0, 0, W, H),
  };
};
type Stage = ReturnType<typeof stage>;

// ----- the player's ship: the game's flight model -----
type Player = {
  P: V3; F: V3; U: V3; R: V3; H: number; yv: number; pv: number; ql: number;
  du: number; fy: number; jj: number;
  su: number; ou: number; ht: number;
};
type Stick = { turn?: number; pitch?: number; fire?: boolean; nitro?: boolean };

const newPlayer = (P: V3, F: V3): Player => {
  const B = ortho(F, UP);
  return { P, ...B, H: CRUISE, yv: 0, pv: 0, ql: 0, du: -9, fy: 0, jj: 0, su: -9, ou: -9, ht: 0 };
};

/** One step of the game's `up` for the player's ship. */
const fly = (p: Player, dt: number, s: Stick) => {
  p.yv += ((s.turn ?? 0) * YAW_RATE - p.yv) * Math.min(1, STICK_EASE * dt);
  p.pv += ((s.pitch ?? 0) * PITCH_RATE - p.pv) * Math.min(1, STICK_EASE * dt);
  const pa = p.pv * dt;
  const ya = p.yv * dt;
  // Pitch over the wing; yaw about the map's vertical, the horizon locked.
  let F = add(mul(p.F, Math.cos(pa)), p.U, Math.sin(pa));
  let U = add(mul(p.U, Math.cos(pa)), p.F, -Math.sin(pa));
  const hz = (f: V3) => sub(UP, mul(f, dot(UP, f)));
  const c = hz(F);
  if (len(c) > 1e-4) {
    const sg = dot(U, c) < 0 ? -1 : 1;
    F = rotAxis(F, [0, -sg, 0], -ya);
    U = mul(norm(hz(F)), sg);
  } else F = rotAxis(F, U, -ya);
  Object.assign(p, ortho(F, U));
  if (s.nitro) p.H = Math.min(NITRO_MAX, p.H + NITRO_ACCEL * dt);
  else p.H += (CRUISE - p.H) * Math.min(1, SPEED_EASE * dt);
  p.P = add(p.P, p.F, p.H * dt);
  p.ql += (p.yv * BANK - p.ql) * Math.min(1, 8 * dt);
  p.jj -= dt;
};

/** B2: the dash — a kick forward, untouchable a moment. */
const dash = (p: Player, now: number) => {
  p.H = Math.max(p.H, CRUISE) + DASH_KICK;
  p.du = now + DASH_GHOSTS;
};

/** B1: the cannon, held. Leaves the nose along the heading, inherits the
 *  ship's speed, and bends toward a target only within the auto-aim cone
 *  (leading it). Two bolts, four under Overdrive. */
const cannon = (s: Stage, p: Player, now: number, targets: Target[], weak = false) => {
  if (now < p.fy) return;
  const od = now < p.ou;
  p.fy = now + (od ? FIRE_OD_MS : FIRE_MS);
  p.jj = 0.05;
  const sp = BOLT_SPEED + p.H;
  let aim = p.F;
  let best = weak ? WEAK_CONE : AIM_CONE;
  for (const t of targets) {
    if (!t.alive()) continue;
    const lead = len(sub(t.pos(), p.P)) / sp;
    const to = norm(sub(add(t.pos(), t.vel(), lead), p.P));
    const d = dot(to, p.F);
    if (d > best) {
      best = d;
      aim = to;
    }
  }
  for (const o of od ? [-20, -7, 7, 20] : [-9, 9]) {
    const from = add(add(p.P, p.F, 24), p.R, o);
    s.bolts.push({ p: from, v: mul(aim, sp), life: BOLT_LIFE });
  }
};

/** B4: the shield — a bubble that eats every shot and rocket that
 *  reaches it for SHIELD_S; not again until it has cooled. */
const shield = (p: Player, now: number) => {
  if (now < p.su + SHIELD_COOL) return false;
  p.su = now + SHIELD_S;
  return true;
};

/** B3, released: a missile from under the nose, homing on `aim`. */
const missile = (s: Stage, p: Player, aim: Target | null) =>
  s.missiles.push({ p: add(add(p.P, p.F, 26), p.U, -6), v: mul(p.F, MISSILE_SPEED), trail: [], life: MISSILE_LIFE, aim, spin: 0 });

/** The player's ship as the game draws it (dj): the dash's ghosts, the
 *  ship banked by its turn, the muzzle flare, the engine's streak, the
 *  shield. */
const drawPlayer = (s: Stage, p: Player, now: number) => {
  if (now < p.du)
    for (let i = 1; i <= 3; i++) s.stroke(s.placed(SHIP, add(p.P, p.F, -22 * i), p, 1, p.ql), SHIP[1], INK_HI, 0.4 / i);
  const level = p.H / 470;
  s.line(add(p.P, p.F, -14), add(p.P, p.F, -(20 + 26 * level)), 2 * s.px, INK_HI, 0.3 + 0.5 * level);
  s.stroke(s.placed(SHIP, p.P, p, 1, p.ql), SHIP[1], INK, 1);
  const c = s.project(p.P);
  if (p.jj > 0) {
    const m = s.project(add(add(p.P, p.F, 26), p.U, 2));
    s.dot(m, m ? Math.max(2, 1.2 * m[2] * 14) : 0, INK_HI, 0.9);
  }
  if (now < p.su && c) {
    const left = (p.su - now) / SHIELD_S;
    const r = SHIELD_R * 0.85 * c[2];
    if (!(left < 0.22 && Math.floor(now * 11) % 2 === 0)) {
      s.dot(c, r, BLD, 0.1);
      s.ring(c, r, 1.5, BLU, 0.85);
      s.ring(c, r * 1.1, 3.5, BLD, 0.2);
      for (let i = 0; i < 3; i++) {
        const a0 = now * 4 + (i * Math.PI * 2) / 3;
        s.ctx.globalAlpha = 0.9;
        s.ctx.strokeStyle = INK_HI;
        s.ctx.lineWidth = 2.5;
        s.ctx.beginPath();
        s.ctx.arc(c[0], c[1], r, a0, a0 + 0.7);
        s.ctx.stroke();
        s.ctx.globalAlpha = 1;
      }
    }
    if (p.ht > 0) s.ring(c, r * (1 + (1 - p.ht / 0.3) * 0.55), 2.5, INK_HI, 0.9 * (p.ht / 0.3));
  }
};

// ----- an ace: the game's AI for the hunters (k = 1) -----
type Ace = {
  P: V3; v: V3; E: number; qo: number; M: number; g: number; fl: number; m: number; cd: number;
  alive: boolean; target: Target; Y: V3[]; tt: number; kz: boolean; t: number;
};
const newAce = (s: Stage, P: V3, v: V3, side: number, cd: number, kz = false): Ace => {
  const a: Ace = {
    P, v, E: Math.atan2(v[0], v[2]), qo: 0, M: kz ? 1 : ACE_HP, g: 0, fl: 0, m: side, cd, alive: true, Y: [], tt: 0, kz, t: 0,
    target: undefined as unknown as Target,
  };
  a.target = {
    pos: () => a.P,
    vel: () => a.v,
    r: kz ? KZ_R : ACE_R,
    alive: () => a.alive,
    // Qf: damage, the white flash, a small late ring; at nothing left, the
    // game's death — the ring and the spray.
    hit: (n: number) => {
      if (!a.alive) return;
      a.M -= n;
      a.g = 0.08;
      if (a.M > 0) return void s.boom(a.P, 0.3);
      a.alive = false;
      s.boom(a.P);
      s.spray(a.P, 6);
    },
  };
  return a;
};
const steerAce = (s: Stage, a: Ace, dt: number, p: Player) => {
  if (!a.alive) return;
  const d = sub(p.P, a.P);
  const dist = len(d) || 1;
  let goal = p.P;
  if (a.fl > 0) {
    a.fl -= dt;
    // breaking away: off from you, with a sideways turn
    goal = [a.P[0] - (d[0] / dist) * 1500 + (d[2] / dist) * 500 * a.m, a.P[1] - (d[1] / dist) * 600, a.P[2] - (d[2] / dist) * 1500 - (d[0] / dist) * 500 * a.m];
  } else if (!a.kz && (dist < 650 || (dist < 1000 && dot(p.F, d) / dist < -0.93))) a.fl = 1.6;
  const k = Math.min(1, (a.kz ? KZ_TURN : a.fl > 0 ? ACE_BREAK_TURN : ACE_TURN) * dt);
  const n = norm(add(norm(a.v), sub(norm(sub(goal, a.P)), norm(a.v)), k));
  a.v = mul(n, a.kz ? KZ_SPEED : ACE_SPEED);
  a.t += dt;
  a.P = add(a.P, a.v, dt);
  // what moves leaves a trail, so you read where it goes
  if ((a.tt += dt) > 0.05) {
    a.tt = 0;
    a.Y.push(a.P);
    if (a.Y.length > 12) a.Y.shift();
  }
  const E = Math.atan2(a.v[0], a.v[2]);
  // its visual roll comes from its own turn
  a.qo += (clamp((wrap(E - a.E) / dt) * (14 / 60), -0.9, 0.9) - a.qo) * Math.min(1, 6 * dt);
  a.E = E;
  a.g -= dt;
  a.cd -= dt;
  // contact: it bursts against you
  if (a.kz && dist < a.target.r + 16) {
    a.alive = false;
    s.boom(a.P);
    s.spray(a.P, 6);
    return;
  }
  if (!a.kz && a.cd <= 0 && dist < ACE_RANGE) {
    a.cd = ACE_FIRE;
    s.enemyShot(a.P, p, SHOT_SPEED);
  }
};
const drawAce = (s: Stage, a: Ace) => {
  if (!a.alive) return;
  for (let i = 1; i < a.Y.length; i++) s.line(a.Y[i - 1], i === a.Y.length - 1 ? a.P : a.Y[i], 2 * s.px, RUST_HI, (i / a.Y.length) * 0.5);
  // the kamikaze pulses in light rust: you see it coming
  const c = a.kz ? s.project(a.P) : null;
  if (c) s.ring(c, Math.max(8, 60 * c[2]) * (1 + 0.2 * Math.sin(a.t * 14)), 2 * s.px, RUST_HI, 0.6);
  s.stroke(s.placed(SHIP, a.P, yawBasis(a.E), ACE_SCALE, a.qo), SHIP[1], a.g > 0 ? INK_HI : RUST, 1);
};

/** A scene: `frame(dt)` advances and paints it, false once it is over;
 *  `at()` is where the player's ship is on screen. */
export type Battle = { frame: (dt: number) => boolean; at: () => Pt };

/** Turn and pitch toward `to`, at full stick when far off the nose. */
const steerAt = (p: Player, to: V3): Stick => {
  const d = norm(sub(to, p.P));
  const side = dot(d, p.R);
  const up = dot(d, p.U);
  return { turn: clamp(side * 4, -1, 1), pitch: clamp(up * 4, -1, 1) };
};
const inCone = (p: Player, t: Target, cone = AIM_CONE) => t.alive() && dot(norm(sub(t.pos(), p.P)), p.F) > cone;

/** How wide the frame must be to hold every ship (with a margin), never
 *  narrower than `base`; eased, so the zoom breathes rather than jumps. */
const zoom = (base: number) => {
  let v = base;
  return (pts: V3[], across: V3, dt: number) => {
    let lo = Infinity;
    let hi = -Infinity;
    for (const q of pts) {
      const x = dot(q, across);
      lo = Math.min(lo, x);
      hi = Math.max(hi, x);
    }
    const want = Math.max(base, (hi - lo) * 1.3);
    v += (want - v) * Math.min(1, 1.5 * dt);
    return v;
  };
};

/** A camera that follows the action: `pull` (1/s) of the way a second. */
const follow = (pull: number) => {
  let at: V3 | null = null;
  return (want: V3, dt: number) => {
    at = at ? add(at, sub(want, at), Math.min(1, pull * dt)) : want;
    return at;
  };
};

/**
 * THE HERO: THE HUNT, left to right above the name. The ace comes at you
 * head-on, embers first — the shield goes up and eats them — and breaks
 * off as you pass; you come round onto it, it breaks again with you in
 * its tail, and the cannon finds it. Then nitro, and away.
 */
export const heroFight = (band: HTMLCanvasElement): Battle => {
  const s = stage(band);
  const { W, H } = s;
  const phone = W < 600;
  const p = newPlayer([-1050, 0, 0], [1, 0, 0]);
  const ace = newAce(s, [950, -20, 250], [-ACE_SPEED, 0, -60], 1, 0.9);
  s.setTargets([ace.target]);
  const cam = follow(0.9);
  // How much of the world the frame takes in, across, at the action.
  const view = zoom(phone ? 760 : 1250);
  let t = 0;
  let volleys = 0;
  const frame = (dt: number) => {
    t += dt;
    let stick: Stick = {};
    if (ace.alive) {
      stick = steerAt(p, ace.P);
      // head-on, one volley; then, once it has broken away with you on
      // its tail, the cannon held
      const fy = p.fy;
      if (inCone(p, ace.target) && len(sub(ace.P, p.P)) < 1300 && (t > 3 || volleys < 1)) cannon(s, p, t, [ace.target]);
      if (p.fy !== fy) volleys++;
    } else stick = { nitro: true };
    // an ember coming: up with the shield, the game's answer to fire you
    // see coming, and into it — the bubble eats what it touches
    const ember = s.shots.find(e => e.life > 0 && len(sub(e.p, p.P)) < 420 && dot(sub(e.p, p.P), p.F) > 0);
    if (ember) {
      shield(p, t);
      if (t < p.su) stick = { ...steerAt(p, ember.p), nitro: stick.nitro };
    }
    fly(p, dt, stick);
    steerAce(s, ace, dt, p);
    s.update(dt, p, t);
    // the camera: above and in front, looking down onto the fight; it
    // follows until the kill, then holds while the ship leaves
    const at = ace.alive ? cam(mul(add(p.P, ace.P), 0.5), dt) : cam(p.P, 0);
    const D = 2400;
    const VIEW = view(ace.alive ? [p.P, ace.P] : [], [1, 0, 0], ace.alive ? dt : 0);
    s.aim(add(at, [0, -D * 0.42, -D * 0.9]), at, (W * D) / VIEW, W / 2, H * (phone ? 0.32 : 0.3));
    s.clear();
    drawAce(s, ace);
    s.paintFire();
    drawPlayer(s, p, t);
    const out = !ace.alive && s.off(s.project(p.P), 60);
    return t < 16 && !(out && s.settled());
  };
  return { frame, at: () => s.project(p.P) ?? [-99, -99, 1] };
};

/**
 * MORE WORK: THE ESCAPE, over the game's card. You run right to left,
 * jinking, the game's dust streaking past you. Two kamikazes come in on
 * your tail from off the right edge — the game's hunters that go flat
 * out (470 to your 220), never break off and never fire: they mean to
 * ram you — and an ace behind them fires its slow embers after you. When
 * the nearer is about to touch you, you dash (the game's straight kick
 * forward, with its ghosts) and hold the nitro: it lunges through where
 * you were, and you pull away from them, out of the frame to the left;
 * they stream after you and out. Nothing turns, nothing flips.
 */
export const chase = (band: HTMLCanvasElement): Battle => {
  const s = stage(band);
  const { W, H } = s;
  const phone = W < 600;
  const rand = rng(5);
  // How much of the world the frame takes in, across; you ride a fifth of
  // the way in from the left, so the frame holds them closing in.
  const VIEW = phone ? 950 : 1150;
  const RIDE = VIEW * 0.3; // the frame's middle, this far behind you
  const p = newPlayer([0, 0, 0], [-1, 0, 0]);
  // Just past the right edge, one a little above your line, one below.
  const edge = VIEW / 2 + RIDE + 70;
  const alt = phone ? 30 : 50;
  const aces = [
    newAce(s, [edge, -alt, alt], [-KZ_SPEED, 0, 0], 1, 9, true),
    newAce(s, [edge + 260, alt * 0.6, -alt], [-KZ_SPEED, 0, 0], -1, 9, true),
    newAce(s, [edge + 120, -alt * 0.3, -2 * alt], [-ACE_SPEED, 0, 0], 1, 0.4),
  ];
  s.setTargets(aces.map(a => a.target));
  // The game's dust: near motes, wrapped round you, that turn your speed
  // into streaks — what says you are flying.
  const L = 560;
  const motes: V3[] = Array.from({ length: 96 }, () => [(rand() - 0.5) * L, (rand() - 0.5) * L, (rand() - 0.5) * L]);
  const wrapL = (x: number) => x - L * Math.floor(x / L + 0.5);
  let t = 0;
  let run = -1;
  // The camera dollies a little slower than you cruise, so you gain on
  // it; once you are gone it eases to a stop and lets them cross.
  let camX = RIDE;
  let camV = -CRUISE * 0.92;
  const frame = (dt: number) => {
    t += dt;
    const close = Math.min(...aces.filter(a => a.kz && a.alive).map(a => len(sub(a.P, p.P))));
    // the nearer kamikaze about to touch you: the dash, and the nitro held
    if (run < 0 && close < 170) {
      run = t;
      dash(p, t);
    }
    // until then, jinking on the stick, so they are never quite on you
    // (the stick swings both ways, so your heading weaves about your line)
    const stick: Stick = run < 0 ? { turn: 0.3 * Math.cos(t * 2.1), pitch: 0.05 * Math.cos(t * 1.4) } : { nitro: true };
    fly(p, dt, stick);
    for (const a of aces) steerAce(s, a, dt, p);
    s.update(dt, p, t);
    const gone = run >= 0 && s.off(s.project(p.P), 40);
    if (gone) camV += (0 - camV) * Math.min(1, 2.2 * dt);
    camX += camV * dt;
    const at: V3 = [camX, 0, 0];
    const D = 2400;
    s.aim(add(at, [0, -D * 0.42, -D * 0.9]), at, (W * D) / VIEW, W / 2, H * (phone ? 0.24 : 0.3));
    s.clear();
    // the dust, as the game streaks it
    const trail = 0.016 + (p.H / 470) * 0.065;
    for (const m of motes) {
      const w: V3 = [p.P[0] + wrapL(m[0] - p.P[0]), p.P[1] + wrapL(m[1] - p.P[1]), p.P[2] + wrapL(m[2] - p.P[2])];
      const a = clamp(1 - len(sub(w, p.P)) / 420, 0, 1) * 0.5 * (p.H / 470 + 0.3);
      if (a > 0.02) s.line(w, add(w, p.F, p.H * trail), 1, INK, a);
    }
    for (const a of aces) drawAce(s, a);
    s.paintFire();
    drawPlayer(s, p, t);
    const out = gone && aces.every(a => !a.alive || s.off(s.project(a.P), 60));
    return t < 14 && !(out && s.settled());
  };
  return { frame, at: () => s.project(p.P) ?? [-99, -99, 1] };
};

/**
 * THE FOOT: THE DESTROYER, as the game brings it in, seen from behind
 * your ship. The sector goes dark; the destroyer comes out of hyperspace
 * far ahead of you, at your height, its bow toward you, in a flash, and
 * looses its salvo — rockets in mirrored pairs that climb slowly, open
 * out and then curve down at you as the light comes back. The shield eats
 * them. Then the fight, as you round it: its deck turrets' bursts, a
 * missile pair on each shield dome, and Overdrive's four bolts on the
 * bared bridge (its bow cannon first charges 12 s in — past the scene). It goes down in the
 * game's chain of blasts as you climb away.
 */
export const destroyer = (band: HTMLCanvasElement): Battle => {
  const s = stage(band);
  const { ctx, W, H } = s;
  const phone = W < 600;
  const rand = rng(11);
  const RH = () => rand() - 0.5;
  const p = newPlayer([0, 0, 0], [0, 0, 1]);
  // Ze: far ahead of you, at your height, the bow toward you.
  const sd = { P: [0, 0, 2600] as V3, E: Math.PI, t: 0 };
  let B = yawBasis(sd.E);
  const hull = (o: V3) => add(add(add(sd.P, B.R, o[0] * SD_SCALE), B.U, -o[1] * SD_SCALE), B.F, o[2] * SD_SCALE);
  type Part = { o: V3; M: number; g: number; burst: number; cd: number; target: Target };
  let down = -1;
  const part = (o: V3, M: number, cd = 9): Part => {
    const q: Part = { o, M, g: 0, burst: 0, cd, target: undefined as unknown as Target };
    q.target = {
      pos: () => hull(o),
      vel: () => [0, 0, 0],
      r: 50 * SD_SCALE,
      alive: () => q.M > 0 && down < 0,
      hit: (n: number) => {
        if (q.M <= 0) return;
        q.M -= n;
        q.g = 0.1;
        s.boom(hull(o), 0.3);
        if (q.M <= 0) {
          s.boom(hull(o), 0, { h: true });
          s.spray(hull(o), 6);
        }
      },
    };
    return q;
  };
  // SD_PARTS: six deck turrets, the two shield domes, the bridge (which
  // only takes damage once the domes are down).
  const turrets = [[90, -14, 150], [-90, -14, 150], [140, -20, -80], [-140, -20, -80], [190, -25, -300], [-190, -25, -300]].map(o =>
    part(o as V3, 2, 1 + rand() * 3),
  );
  const domes = [part([110, -185, -340], 6), part([-110, -185, -340], 6)];
  const bridge = part([0, -150, -345], 14);
  const bridgeHit = bridge.target.hit;
  bridge.target.hit = n => domes.every(d => d.M <= 0) && bridgeHit(n);
  const parts = [...turrets, ...domes, bridge];

  // The salvo's rockets (k = 3): they climb (Qr), go to their point
  // between the destroyer and you, and from there come at you — slow to
  // turn; the shield or the cannon takes them.
  type Rocket = { P: V3; v: V3; Qr: number; fast: boolean; mid: boolean; goal: V3; life: number; Y: V3[]; dead: boolean; target: Target };
  const rockets: Rocket[] = [];
  const rocket = (P: V3, v: V3, Qr: number, fast: boolean, goal: V3) => {
    const r: Rocket = { P, v, Qr, fast, mid: !fast, goal, life: 12, Y: [], dead: false, target: undefined as unknown as Target };
    r.target = {
      pos: () => r.P,
      vel: () => r.v,
      r: 22,
      alive: () => !r.dead,
      hit: () => {
        if (r.dead) return;
        r.dead = true;
        s.boom(r.P);
        s.spray(r.P, 6);
      },
    };
    rockets.push(r);
  };
  const aims = () => [...rockets.map(r => r.target), ...parts.map(q => q.target)];

  let t = 0;
  let salvo = 0;
  let salvoCd = 0;
  let fight = -1;
  let fired = 0;
  let dying = -1;
  let flash = -1;
  let shake = 0;
  let seen = 0; // Fa: it materializes, and fades as it goes down
  // The camera: the game's, behind your ship and a little above, with its
  // basis following the ship's — set further back, so the ship stays a
  // ship and the destroyer fills the far end. It holds when it is over.
  const ORBIT = 1300;
  const BACK = phone ? 760 : 640;
  const UP_ = phone ? 200 : 180;
  const focal = W * (phone ? 1.6 : 1.05);
  const cam = follow(1.2);
  let eye: V3 = [0, 0, 0];
  let at: V3 = [0, 0, 0];
  const frame = (dt: number) => {
    t += dt;
    sd.t += dt;
    B = yawBasis(sd.E);
    const live = rockets.filter(r => !r.dead);
    // ub: the entrance — dark, the flash, the salvo — as the game times it
    const dark = t < 1.2 ? t / 1.2 : t < 4.4 ? 1 : Math.max(0, 1 - (t - 4.4) / 1.8);
    if (flash < 0 && t >= 1.2) {
      flash = t;
      shake = 12;
      s.boom(sd.P, 0, { h: true, r: 1100 });
    }
    if (flash >= 0) seen = down < 0 ? Math.min(1, (t - flash) / 1.2) : Math.max(0, 1 - (t - down) / 1.6);
    if (flash >= 0 && t > 1.5 && t < 4.1 && (salvoCd -= dt) <= 0 && live.length < 11) {
      salvoCd = 0.45;
      const n = ++salvo;
      const ang = n * 2.4;
      const fast = n % 4 === 3;
      const sp = 160 + rand() * 190;
      for (const side of [-1, 1]) {
        const from = hull([side * 110, -175, -330]);
        const to = hull([side * (110 + Math.abs(Math.cos(ang)) * sp), -175, Math.sin(ang) * sp - 330]);
        const mk = 0.45 + rand() * 0.3;
        const goal: V3 = [sd.P[0] + (p.P[0] - sd.P[0]) * mk + RH() * 700, p.P[1] + RH() * 300, sd.P[2] + (p.P[2] - sd.P[2]) * mk + RH() * 700];
        rocket(from, [to[0] - from[0], -(fast ? 260 : 300 + rand() * 180), to[2] - from[2]], fast ? 0.6 : 2.2 + rand() * 1.2, fast, goal);
      }
    }
    if (fight < 0 && t > 6.4) fight = t;

    // the destroyer: once the entrance is over it turns slowly to keep its
    // bow on you, closing only while you are far
    const d = sub(p.P, sd.P);
    const dist = len(d);
    if (fight > 0 && down < 0) {
      sd.E += wrap(Math.atan2(d[0], d[2]) - sd.E) * Math.min(1, 0.11 * dt);
      const move = dist > 1900 ? 90 : 0;
      sd.P = add(sd.P, [Math.sin(sd.E) * move * dt, Math.sin(sd.t * 0.4) * 6 * dt, Math.cos(sd.E) * move * dt]);
    }

    // the rockets
    for (const r of rockets) {
      if (r.dead) continue;
      if (r.Qr > 0) r.Qr -= dt;
      else {
        let to = sub(p.P, r.P);
        if (r.mid) {
          to = sub(r.goal, r.P);
          if (len(to) < 180) r.mid = false;
        }
        const k = Math.min(1, (r.fast ? 0.55 : 0.9) * dt);
        r.v = add(r.v, sub(mul(norm(to), r.fast ? 640 : 300), r.v), k);
      }
      r.P = add(r.P, r.v, dt);
      r.Y.push(r.P);
      if (r.Y.length > 26) r.Y.shift();
      if ((r.life -= dt) <= 0) r.target.hit(1);
      // against you: the shield eats it; without it, it hits
      else if (len(sub(r.P, p.P)) < r.target.r + 16) {
        r.target.hit(1);
        if (t < p.su) p.ht = 0.3;
      }
    }

    // YOU
    let stick: Stick = {};
    if (down < 0) {
      // round it, standing off: always toward a point a little ahead on
      // a circle about it; once the domes are down, straight at the bridge
      const bare = domes.every(q => q.M <= 0);
      const a0 = Math.atan2(p.P[0] - sd.P[0], p.P[2] - sd.P[2]) - 0.55;
      stick = steerAt(p, bare ? bridge.target.pos() : add(sd.P, [Math.sin(a0) * ORBIT, -170, Math.cos(a0) * ORBIT]));
      // what is about to reach you: the shield
      if ([...live.map(r => r.P), ...s.shots.filter(e => e.life > 0).map(e => e.p)].some(q => len(sub(q, p.P)) < 260)) shield(p, t);
      // the cannon on a rocket in your sights
      if (live.some(r => inCone(p, r.target) && len(sub(r.P, p.P)) < 1400)) cannon(s, p, t, live.map(r => r.target));
      // as the light comes back: two missiles on each dome
      if (t > 4.4 && fired < 4 && t - 4.4 > 0.18 * fired) {
        missile(s, p, domes[fired >> 1].target);
        fired++;
      }
      // Overdrive, and the cannon on the bridge as soon as it is bare
      if (bare) {
        if (p.ou < 0) p.ou = t + 6;
        if (inCone(p, bridge.target, WEAK_CONE)) cannon(s, p, t, [bridge.target], true);
      }
      if (bridge.M <= 0) {
        down = t;
        // kb: nine blasts along the hull, the spray
        for (let i = 0; i < 9; i++) s.boom(hull([RH() * 400, (rand() - 0.7) * 150, -400 + rand() * 900]), -i * 0.12, { h: true, r: 150 });
        s.spray(sd.P, 24);
        shake = 16;
        // its death is a wave: it takes its own rockets with it
        for (const r of rockets) r.target.hit(1);
      }
      for (const q of turrets) {
        if (fight < 0 || q.M <= 0 || dist > 2600) continue;
        // bursts of two, slow and dodgeable — but there are six
        q.cd -= dt;
        if (q.burst > 0 && q.cd <= 0) {
          q.burst--;
          q.cd = q.burst ? 0.2 : 4.6 + rand() * 1.8;
          s.enemyShot(hull([q.o[0], q.o[1] - 30, q.o[2]]), p, SHOT_SPEED);
        } else if (q.burst === 0 && q.cd <= 0) q.burst = 2;
      }
    } else {
      // climb away: the nose up a moment, then nitro
      if (dying < 0) dying = t;
      stick = { pitch: t - dying < 0.55 ? 1 : 0, nitro: true };
    }
    for (const q of parts) q.g -= dt;
    fly(p, dt, stick);
    s.setTargets(aims());
    s.update(dt, p, t);

    if (down < 0) {
      // behind your ship on its line to the destroyer, looking past you
      // at it: it stays in the middle, its bow on you, wherever you fly
      const to = sub(sd.P, p.P);
      const lo = norm([to[0], 0, to[2]]);
      eye = cam(add(add(p.P, lo, -BACK), [0, -UP_, 0]), dt);
      at = add(mul(sd.P, 0.8), p.P, 0.2);
    }
    shake = Math.max(0, shake - 34 * dt);
    const jx = shake ? RH() * shake * s.px : 0;
    const jy = shake ? RH() * shake * s.px : 0;
    s.aim(eye, at, focal, W / 2 + jx, H * (phone ? 0.5 : 0.56) + jy);
    s.clear();
    // the dark: everything but the destroyer and its rockets goes under it
    if (dark > 0) {
      ctx.globalAlpha = 0.5 * dark;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    }
    if (seen > 0) {
      const sink: V3 = down < 0 ? [0, 0, 0] : [0, (t - down) * 60, 0];
      s.stroke(s.placed(DESTROYER, add(sd.P, sink), B, SD_SCALE), DESTROYER[1], RUST, seen * 0.95);
      // its position lights blinking along the hull
      [[0, -6, 560], [-300, -4, -400], [300, -4, -400], [-130, -168, -340], [130, -168, -340], [0, -48, 80]].forEach(([lx, ly, lz], i) => {
        if (Math.floor(sd.t * 1.6 + i * 0.7) % 3 === 0) return;
        const l = s.project(add(hull([lx, ly, lz]), sink));
        if (l) s.dot(l, Math.max(1.5, 2.6 * l[2]), i < 3 ? RUST_HI : BLU, 0.9 * seen);
      });
      for (const ox of [-130, 0, 130]) {
        const e = s.project(add(hull([ox, 18, -406]), sink));
        if (!e) continue;
        const r = 34 * SD_SCALE * e[2];
        s.dot(e, r * 1.6, AMB, 0.25 * seen);
        s.dot(e, r * 0.7, CRM, 0.85 * seen);
      }
      for (const q of turrets)
        if (q.M > 0) s.stroke(s.placed(SENTRY, add(q.target.pos(), B.U, 12 * SD_SCALE), B, 1.1 * SD_SCALE), SENTRY[1], q.g > 0 ? INK_HI : RUST, seen);
      for (const q of domes) {
        if (q.M <= 0) continue;
        const c = s.project(q.target.pos());
        if (!c) continue;
        const r = 36 * SD_SCALE * c[2];
        s.dot(c, r, BLD, (0.12 + 0.08 * Math.sin(sd.t * 4)) * seen);
        s.ring(c, r, 1.5, q.g > 0 ? INK_HI : BLD, 0.9 * seen);
      }
      const b = s.project(bridge.target.pos());
      if (b && bridge.M > 0) {
        const shielded = domes.some(q => q.M > 0);
        const pulse = 0.5 + 0.5 * Math.sin(sd.t * (shielded ? 2 : 7));
        if (shielded) s.ring(b, 90 * SD_SCALE * b[2], 1.5, BLD, (0.25 + 0.2 * pulse) * seen);
        else {
          s.dot(b, 30 * SD_SCALE * b[2], bridge.g > 0 ? INK_HI : RUST_HI, (0.45 + 0.45 * pulse) * seen);
          s.ring(b, (50 + pulse * 20) * SD_SCALE * b[2], 2, RUST_HI, 0.6 * pulse * seen);
        }
      }
    }
    // the rockets: a long rust trail, the missile's model, a hot pulse
    for (const r of rockets) {
      if (r.dead) continue;
      for (let i = 1; i < r.Y.length; i++) s.line(r.Y[i - 1], r.Y[i], 3 * s.px, RUST_HI, (i / r.Y.length) * 0.5);
      s.stroke(s.placed(MISSILE, r.P, ortho(norm(r.v), UP), 1.6, t * 8), MISSILE[1], RUST_HI, 1);
      const q = s.project(r.P);
      if (q) s.dot(q, clamp(16 * q[2], 2, 10 * s.px), RUST_HI, 0.5 + 0.4 * Math.sin(t * 20));
    }
    s.paintFire();
    drawPlayer(s, p, t);
    // the flash as it comes out of hyperspace
    if (flash >= 0 && t - flash < 0.7) {
      ctx.globalAlpha = 0.15 * (1 - (t - flash) / 0.7);
      ctx.fillStyle = INK_HI;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    }
    const out = down >= 0 && s.off(s.project(p.P), 60);
    return t < 20 && !(out && s.settled(false) && seen <= 0);
  };
  return { frame, at: () => s.project(p.P) ?? [-99, -99, 1] };
};

/** One scene on `band`, the link (when there is one) riding on the ship.
 *  Resolves when it is over. `alive`: still wanted? */
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
  // Over, or the page got busy: it fades rather than cut.
  band.style.opacity = '0';
  await new Promise(r => setTimeout(r, ended && !cut ? 450 : 300));
  band.style.opacity = '';
  if (link) link.hidden = true;
  band.hidden = true;
  release(band);
};

/** Reduced motion: one moment of a scene stands still a while, then
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
