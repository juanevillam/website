import { fit, holdable, release, run } from './eggs';

/**
 * SPACE EXPLORER'S SHIP, in a dogfight behind the hero's name (ShipEgg).
 *
 * Everything here is the game's own (../games/platanus-hack-26-venezuela-
 * arcade/game.js): the ship's and the missile's wireframe models, copied
 * as they are; the way a model is placed (`db`: model x on R, -y on U, z
 * on F) and stroked (`sg`: a wide faint pass under a thin one); the
 * palette; and the arsenal as the game draws it — the cannon's white
 * bolts in pairs (four under Overdrive), the homing missiles with their
 * trail and amber flame, the blue shield bubble with its meridians and
 * spinning arcs, the dash's ghost copies, the hunter's rust embers, and
 * the explosion's rust ring, amber flash and spray. The enemy is the
 * game's ace: the same ship, in rust, bigger.
 *
 * One scripted pass, ~9 s: the ace crosses with the ship on its tail;
 * the cannon misses, the ace fires back into the shield, the ship dashes
 * in, a missile salvo hits through a barrel roll, and Overdrive finishes
 * it. Seen from a little above and behind, in perspective — a battle in
 * the distance, not in your face.
 */

const mdl = (flat: number[], es: string): Model => {
  const V: V3[] = [];
  for (let i = 0; i < flat.length; i += 3) V.push([flat[i], flat[i + 1], flat[i + 2]]);
  const E: [number, number][] = [];
  for (let i = 0; i < es.length; i += 2) E.push([es.charCodeAt(i) - 48, es.charCodeAt(i + 1) - 48]);
  return [V, E];
};

type V3 = [number, number, number];
type Model = [V3[], [number, number][]];

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
const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const norm = (a: V3): V3 => {
  const n = len(a) || 1;
  return [a[0] / n, a[1] / n, a[2] / n];
};
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

type Basis = { F: V3; U: V3; R: V3 };

/** The whole fight, drawn on `band`: `frame(dt)` advances and paints it,
 *  and says false once it is over. `at` is where the ship is on screen.
 *  `dir`: which way it crosses (random by default). */
export const battle = (band: HTMLCanvasElement, dir = Math.random() < 0.5 ? 1 : -1) => {
  const { ctx, width: W, height: H } = fit(band);
  // World units: px at the page's depth. The camera stands above and
  // looks down a little; far things are smaller and higher.
  const EYE = 900;
  // ~17°, the game's own chase camera (CAM_UP 32 over CAM_BACK 104).
  const PITCH = 0.3;
  const cx = W / 2;
  const cy = H * 0.58;
  const sc = Math.min(2, Math.max(1.15, (W / 1440) * 2));
  const cp = Math.cos(PITCH);
  const sp = Math.sin(PITCH);
  const project = ([x, y, z]: V3): [number, number, number] => {
    const yc = y * cp - z * sp;
    const zc = y * sp + z * cp;
    const k = EYE / (EYE + zc);
    return [cx + x * k, cy + yc * k, k];
  };

  // The ace's line: from near the eye, across and away into the
  // distance, weaving; the ship flies the same line, behind — so both are
  // seen from behind and a little above, as the game's chase camera sees
  // its ship.
  const course = (s: number): V3 => [
    dir * W * (-0.32 + 0.075 * s + 0.08 * Math.sin(1.5 * s)),
    -H * 0.08 * Math.sin(1.3 * s + 0.4),
    -150 + 190 * s + 40 * Math.sin(1.1 * s),
  ];
  // The game's fog: far things fade into the dark.
  const fog = (P: V3) => Math.max(0, Math.min(1, 1 - (P[2] - 1350) / 450));
  const basisAt = (s: number, roll: number): Basis => {
    const a = course(s - 0.03);
    const b = course(s + 0.03);
    const c = course(s + 0.09);
    const F = norm(sub(b, a));
    // Banked into the turn, as a plane is: the sideways turn of its
    // heading, read off the course ahead.
    const F2 = norm(sub(c, b));
    const turn = (F[0] * F2[2] - F[2] * F2[0]) / 0.06;
    const r = Math.max(-1.1, Math.min(1.1, -turn * 0.5)) + roll;
    let U = norm(add([0, -1, 0], F, F[1]));
    let R = cross(F, U);
    const cr = Math.cos(r);
    const sr = Math.sin(r);
    [U, R] = [norm(add(U.map(v => v * cr) as V3, R, sr)), norm(add(R.map(v => v * cr) as V3, U, -sr))];
    return { F, U, R };
  };

  const placeModel = ([V]: Model, P: V3, { F, U, R }: Basis, s: number) =>
    V.map(([mx, my, mz]) =>
      project([
        P[0] + (R[0] * mx - U[0] * my + F[0] * mz) * s,
        P[1] + (R[1] * mx - U[1] * my + F[1] * mz) * s,
        P[2] + (R[2] * mx - U[2] * my + F[2] * mz) * s,
      ]),
    );

  const stroke = (pts: [number, number, number][], edges: [number, number][], color: string, alpha: number, k: number) => {
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
  const dot = (p: [number, number, number], r: number, color: string, alpha: number) => {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p[0], p[1], Math.max(0.6, r), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };
  const ring = (p: [number, number, number], r: number, w: number, color: string, alpha: number) => {
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(p[0], p[1], Math.max(0.5, r), 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  const seg = (a: V3, b: V3, w: number, color: string, alpha: number) => {
    const p = project(a);
    const q = project(b);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = w * p[2];
    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(q[0], q[1]);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  // ----- the script (seconds) -----
  const MISS = [0.9, 1.9]; // the cannon, a beat behind the ace's jinks
  const EMBERS = [1.9, 3.1]; // the ace fires back
  const SHIELD = [2.0, 3.5];
  const DASH = 3.35;
  const SALVO = 3.95;
  const ROLL = [4.15, 4.75]; // the ace rolls away from the missiles
  const OVERDRIVE = [5.0, 6.0];
  const KILL_BY = 6.0;

  const ACE = 1.25 * sc; // the game's aces are bigger than you
  let t = 0;
  let lastShot = 0;
  let lastEmber = 0;
  let aceHp = 1;
  let flash = 0;
  let killedAt = -1;
  let killPos: V3 = [0, 0, 0];
  let killBasis: Basis | null = null;
  let impact = 0;
  let muzzle = 0;
  type Bolt = { p: V3; v: V3; life: number; hits: boolean };
  type Ember = { p: V3; v: V3; life: number };
  type Missile = { p: V3; v: V3; trail: V3[]; spin: number; dead: boolean };
  type Spark = { p: V3; v: V3; life: number; max: number };
  type Boom = { p: V3; t: number; big: boolean };
  const bolts: Bolt[] = [];
  const embers: Ember[] = [];
  const missiles: Missile[] = [];
  const sparks: Spark[] = [];
  const booms: Boom[] = [];
  let shards: { a: V3; b: V3; v: V3 }[] = [];

  const lag = (time: number) => 1.25 - 0.5 * ease((time - DASH) / 0.35);
  const ship = (time: number): V3 => add(course(time - lag(time)), [-dir * W * 0.05, H * 0.05, -30]);
  const aceRoll = (time: number) => Math.PI * 2 * ease((time - ROLL[0]) / (ROLL[1] - ROLL[0]));

  const hitAce = (big: boolean) => {
    const E = course(t);
    flash = 0.1;
    booms.push({ p: E, t: 0, big: false });
    if (big || (t >= OVERDRIVE[0] + 0.45 && aceHp > 0)) kill();
  };
  const kill = () => {
    if (killedAt >= 0) return;
    aceHp = 0;
    killedAt = t;
    killPos = course(t);
    killBasis = basisAt(t, aceRoll(t));
    booms.push({ p: killPos, t: 0, big: true });
    // The game's spray, and the ace coming apart along its own edges.
    for (let i = 0; i < 26; i++) {
      const a1 = Math.random() * Math.PI * 2;
      const a2 = (Math.random() - 0.5) * Math.PI;
      const v = (120 + Math.random() * 240) * (sc / 1.6);
      sparks.push({ p: killPos, v: [Math.sin(a1) * Math.cos(a2) * v, Math.sin(a2) * v, Math.cos(a1) * Math.cos(a2) * v], life: 0, max: 0.5 + Math.random() * 0.4 });
    }
    const { F, U, R } = killBasis;
    shards = SHIP[1].map(([a, b]) => {
      const at = (i: number): V3 => {
        const [mx, my, mz] = SHIP[0][i];
        return add(killPos, [R[0] * mx - U[0] * my + F[0] * mz, R[1] * mx - U[1] * my + F[1] * mz, R[2] * mx - U[2] * my + F[2] * mz], ACE);
      };
      const A = at(a);
      const B = at(b);
      const mid = norm(sub(add(A, B), add(killPos, killPos)));
      const v = 60 + Math.random() * 110;
      return { a: A, b: B, v: [mid[0] * v, mid[1] * v - 20, mid[2] * v] };
    });
  };

  const frame = (dt: number) => {
    t += dt;
    const P = ship(t);
    const pb = basisAt(t - lag(t), 0);
    const E = course(t);
    const eb = basisAt(t, aceRoll(t));
    const alive = killedAt < 0;

    // The cannon: pairs from beside the nose; four at once under
    // Overdrive. Missing, it shoots where the ace was a moment ago.
    const firing = (t >= MISS[0] && t < MISS[1]) || (t >= OVERDRIVE[0] && t < OVERDRIVE[1] && alive);
    const overdrive = t >= OVERDRIVE[0] && t < OVERDRIVE[1];
    if (firing && t - lastShot >= (overdrive ? 0.08 : 0.15)) {
      lastShot = t;
      muzzle = 0.06;
      const hits = overdrive;
      const aim = norm(sub(hits ? E : add(E, [0, -H * 0.12, 60]), P));
      for (const off of overdrive ? [-20, -7, 7, 20] : [-9, 9]) {
        const from = add(add(P, pb.F, 24 * sc), pb.R, off * sc);
        bolts.push({ p: from, v: aim.map(c => c * 1500) as V3, life: 1.2, hits });
      }
    }
    // The ace's embers, back at the ship — into the shield.
    if (alive && t >= EMBERS[0] && t < EMBERS[1] && t - lastEmber >= 0.3) {
      lastEmber = t;
      const from = add(E, eb.F, 20 * ACE);
      embers.push({ p: from, v: norm(sub(P, from)).map(c => c * 620) as V3, life: 1.6 });
    }
    // The salvo: two missiles off the wings, homing.
    if (t >= SALVO && missiles.length === 0) {
      for (const side of [-1, 1]) {
        const from = add(P, pb.R, side * 14 * sc);
        missiles.push({ p: from, v: add(pb.F.map(c => c * 380) as V3, pb.R, side * 260), trail: [], spin: 0, dead: false });
      }
    }

    // ----- move -----
    for (const b of bolts) {
      b.p = add(b.p, b.v, dt);
      b.life -= dt;
      if (b.hits && alive && len(sub(b.p, course(t))) < 26 * ACE) {
        b.life = 0;
        hitAce(false);
      }
    }
    for (const e of embers) {
      e.p = add(e.p, e.v, dt);
      e.life -= dt;
      if (len(sub(e.p, P)) < 27 * sc) {
        e.life = 0;
        impact = 0.3;
      }
    }
    for (const m of missiles) {
      if (m.dead) continue;
      m.spin += dt * 9;
      const target = alive ? course(t) : add(m.p, m.v, 1);
      const want = norm(sub(target, m.p));
      const speed = Math.min(1100, len(m.v) + 900 * dt);
      const v = norm(add(norm(m.v), want, Math.min(1, dt * 5)));
      m.v = v.map(c => c * speed) as V3;
      m.p = add(m.p, m.v, dt);
      m.trail.push(m.p);
      if (m.trail.length > 14) m.trail.shift();
      if (alive && len(sub(m.p, course(t))) < 28 * ACE) {
        m.dead = true;
        hitAce(false);
        booms.push({ p: m.p, t: 0, big: false });
      }
      if (Math.abs(project(m.p)[0] - cx) > W) m.dead = true;
    }
    if (alive && t >= KILL_BY) kill();
    for (const s of sparks) {
      s.p = add(s.p, s.v, dt);
      s.life += dt;
    }
    for (const s of shards) {
      s.a = add(s.a, s.v, dt);
      s.b = add(s.b, s.v, dt);
    }
    for (const b of booms) b.t += dt;
    flash -= dt;
    impact -= dt;
    muzzle -= dt;

    // ----- paint, far to near -----
    ctx.clearRect(0, 0, W, H);
    // They come in out of the dark, as they leave into it.
    band.style.opacity = String(ease(t / 0.6));
    const pk = project(P)[2];

    // The ace.
    if (alive) {
      stroke(placeModel(SHIP, E, eb, ACE), SHIP[1], flash > 0 ? INK_HI : RUST, fog(E), project(E)[2]);
    } else {
      const age = t - killedAt;
      const fade = Math.max(0, 1 - age / 0.9);
      if (fade > 0) {
        ctx.lineWidth = 1.2;
        for (const s of shards) {
          const a = project(s.a);
          const b = project(s.b);
          ctx.globalAlpha = fade;
          ctx.strokeStyle = age < 0.08 ? INK_HI : RUST_HI;
          ctx.beginPath();
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
    }

    // The ace's embers: rust with a cream core, and their streak.
    for (const e of embers) {
      if (e.life <= 0) continue;
      const p = project(e.p);
      const r = Math.max(2, 4.5 * p[2] * (sc / 1.6));
      seg(e.p, add(e.p, e.v, -0.06), r * 0.9, RUST, 0.45);
      dot(p, r * 1.8, RUST, 0.4);
      dot(p, r, RUST_HI, 0.95);
      dot(p, r * 0.45, CRM, 0.9);
    }

    // Explosions: rings that open (the big one with its amber flash).
    for (const b of booms) {
      if (b.t > 0.5) continue;
      const p = project(b.p);
      const r = (4 + b.t * (b.big ? 260 : 120)) * p[2] * (sc / 1.6);
      if (b.big) dot(p, r * 0.8, AMB, 0.35 * (1 - b.t / 0.5));
      ring(p, r, b.big ? 3 : 1.5, b.big ? INK_HI : RUST, 1 - b.t / 0.5);
    }
    for (const s of sparks) {
      if (s.life > s.max) continue;
      seg(s.p, add(s.p, s.v, -0.05), 1, INK, (s.max - s.life) * 1.6);
    }

    // The cannon's bolts.
    for (const b of bolts) if (b.life > 0) seg(b.p, add(b.p, b.v, -0.03), 2, INK_HI, 0.9);

    // Missiles: trail, flame, the model rolling.
    for (const m of missiles) {
      if (m.dead) continue;
      for (let i = 1; i < m.trail.length; i++)
        seg(m.trail[i - 1], m.trail[i], 1 + i * 0.3, INK_HI, (i / m.trail.length) * 0.45);
      const F = norm(m.v);
      const U = norm(add([0, -1, 0], F, F[1]));
      const R = cross(F, U);
      const c = Math.cos(m.spin);
      const s = Math.sin(m.spin);
      const basis = { F, U: norm(add(U.map(v => v * c) as V3, R, s)), R: norm(add(R.map(v => v * c) as V3, U, -s)) };
      const k = project(m.p)[2];
      stroke(placeModel(MISSILE, m.p, basis, 0.75 * sc), MISSILE[1], INK_HI, 1, k);
      dot(project(add(m.p, F, -20 * 0.75 * sc)), Math.max(2, 3.2 * k * sc / 1.6), AMB, 0.9);
    }

    // The ship: the dash's ghosts, the engine's streak, the ship, the
    // flash at the nose, and the shield around it all.
    const dashing = t >= DASH && t < DASH + 0.5;
    if (dashing)
      for (let i = 1; i <= 3; i++)
        stroke(placeModel(SHIP, add(P, pb.F, -22 * i * sc), pb, sc), SHIP[1], INK_HI, 0.4 / i, pk);
    const seen = fog(P);
    seg(add(P, pb.F, -14 * sc), add(P, pb.F, -(dashing ? 46 : 32) * sc), 2, INK_HI, 0.55 * seen);
    stroke(placeModel(SHIP, P, pb, sc), SHIP[1], INK, seen, pk);
    if (muzzle > 0) dot(project(add(P, pb.F, 26 * sc)), Math.max(2, 3 * pk * sc / 1.6), INK_HI, 0.9);
    if (t >= SHIELD[0] && t < SHIELD[1]) {
      const p = project(P);
      const left = SHIELD[1] - t;
      const up = ease((t - SHIELD[0]) / 0.15);
      const r = 27 * sc * pk * up;
      const dying = left < 0.3 && Math.floor(t * 11) % 2 === 0;
      if (!dying) {
        dot(p, r, BLD, 0.1);
        ring(p, r, 1.5, BLU, 0.85);
        ring(p, r * 1.1, 3.5, BLD, 0.2);
        const spin = t * 2.1;
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = BLU;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(p[0], p[1], r * Math.abs(Math.cos(spin)), r, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(p[0], p[1], r, r * Math.abs(Math.cos(spin * 0.8 + 1.2)), 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = INK_HI;
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 3; i++) {
          const a0 = t * 4 + (i * Math.PI * 2) / 3;
          ctx.beginPath();
          ctx.arc(p[0], p[1], r, a0, a0 + 0.7);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      if (impact > 0) ring(p, r * (1 + (1 - impact / 0.3) * 0.55), 2.5, INK_HI, 0.9 * (impact / 0.3));
    }

    // Over when the ship has gone into the distance and the debris
    // settled.
    return seen > 0 || t < killedAt + 1;
  };

  return {
    frame,
    at: () => project(ship(t)),
  };
};

/** One fight across `band` (a canvas behind the hero's name), the link
 *  riding on the ship. Resolves when it is over. */
export const fly = async (band: HTMLCanvasElement, link: HTMLAnchorElement) => {
  band.hidden = false;
  link.hidden = false;
  const fight = battle(band);
  const rate = holdable(link);
  const follow = () => {
    const [x, y] = fight.at();
    link.style.transform = `translate(${(x - 40).toFixed(1)}px, ${(y - 28).toFixed(1)}px)`;
  };
  const ended = await run(dt => {
    const going = fight.frame(dt * rate(dt));
    follow();
    return going;
  });
  if (!ended) {
    // The page got busy: it leaves at once, without a cut.
    band.style.opacity = '0';
    await new Promise(r => setTimeout(r, 300));
    band.style.opacity = '';
  }
  link.hidden = true;
  band.hidden = true;
  release(band);
};

/** Reduced motion: one moment of the fight — the ship on the ace's tail,
 *  shield up — stands still a while, then fades. */
export const stand = async (band: HTMLCanvasElement, link: HTMLAnchorElement) => {
  band.hidden = false;
  link.hidden = false;
  const fight = battle(band);
  for (let i = 0; i < 160; i++) fight.frame(1 / 60);
  // The fight sets its own fade-in; here the CSS fades it.
  band.style.opacity = '';
  const [x, y] = fight.at();
  link.style.transform = `translate(${x - 40}px, ${y - 28}px)`;
  band.classList.add('is-still');
  await new Promise(r => setTimeout(r, 8000));
  band.classList.remove('is-still');
  await new Promise(r => setTimeout(r, 600));
  link.hidden = true;
  band.hidden = true;
  release(band);
};
