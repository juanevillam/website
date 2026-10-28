import { fit, holdable, release, run } from './eggs';

/**
 * SPACE EXPLORER'S SHIP, over the hero (ShipEgg). It is the game's own
 * ship: the same wireframe model (`SHIP_MODEL` in the game's source,
 * ../games/platanus-hack-26-venezuela-arcade/game.js — vertices and edges
 * copied as they are), drawn the way the game draws it, a faint wide
 * stroke under a thin one, in the game's colours: the ship in ink, a
 * hunter (the same model, the game's enemy ace) in rust, the cannon's
 * bolts in white. Seen in 3D, from a little above, with the game's own
 * perspective; it drifts across like a paper plane and, now and then,
 * meets a hunter and shoots it down.
 */

// The game's compressed model: vertices flat, three at a time; edges as
// a string, each char an index + 48. +z is the nose; -y is up.
const SHIP_V = [0, 0, 26, 0, -3.5, 14, 0, -5.5, 2, 0, -4, -8, 0, -11, -17, 0, 0, -16, -5, -1, 8, 5, -1, 8, -22, 1, -13, 22, 1, -13, -22, -4, -15, 22, -4, -15, 0, 3, -6, -9, 1, -2, 9, 1, -2, -11, 1, -15, 11, 1, -15, -3, -1.5, 19, 3, -1.5, 19];
const SHIP_E = '0112233445350607687985958:9;0<<56<7<6==?7>>@?5@50AA60BB72627';

const VERTS: V[] = [];
for (let i = 0; i < SHIP_V.length; i += 3) VERTS.push([SHIP_V[i], SHIP_V[i + 1], SHIP_V[i + 2]]);
const EDGES: [number, number][] = [];
for (let i = 0; i < SHIP_E.length; i += 2)
  EDGES.push([SHIP_E.charCodeAt(i) - 48, SHIP_E.charCodeAt(i + 1) - 48]);

// The game's palette: INK, INK_HI, RUST, RUST_HI.
const INK = '#f5f5f5';
const INK_HI = '#eef2f7';
const RUST = '#a65240';
const RUST_HI = '#c97b5a';

type V = [number, number, number];
type P = [number, number];

const cross = (a: V, b: V): V => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

// The camera: how far the eye stands, in screen pixels, for perspective.
const EYE = 320;
// How far the ship's top turns toward us: enough to read the wings.
const TILT = 0.85;

/** The model on screen: nose along `heading` (radians, in the screen's
 *  plane), rolled `roll` toward us, at (x, y) and `depth` px behind the
 *  page, `scale` px per model unit. The game's own basis (`db`): model x
 *  on R, -y on U, z on F. */
const place = (x: number, y: number, depth: number, heading: number, roll: number, scale: number): P[] => {
  const F: V = [Math.cos(heading), Math.sin(heading), 0];
  // Up is the screen's up, square to the nose, turned toward the eye.
  const up: V = [Math.sin(heading) * Math.sign(Math.cos(heading) || 1), -Math.abs(Math.cos(heading)), 0];
  const U: V = [up[0] * Math.cos(roll), up[1] * Math.cos(roll), -Math.sin(roll)];
  const R = cross(F, U);
  return VERTS.map(([mx, my, mz]) => {
    const wx = (R[0] * mx - U[0] * my + F[0] * mz) * scale;
    const wy = (R[1] * mx - U[1] * my + F[1] * mz) * scale;
    const wz = (R[2] * mx - U[2] * my + F[2] * mz) * scale + depth;
    const k = EYE / (EYE + wz);
    return [x + wx * k, y + wy * k];
  });
};

/** The game's stroke (`sg`): a wide faint pass, then the line. */
const stroke = (ctx: CanvasRenderingContext2D, pts: P[], color: string, alpha: number, k: number) => {
  ctx.beginPath();
  for (const [a, b] of EDGES) {
    ctx.moveTo(pts[a][0], pts[a][1]);
    ctx.lineTo(pts[b][0], pts[b][1]);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.4 * k;
  ctx.globalAlpha = alpha * 0.18;
  ctx.stroke();
  ctx.lineWidth = 1.15 * k;
  ctx.globalAlpha = alpha;
  ctx.stroke();
  ctx.globalAlpha = 1;
};

type Shard = { a: P; b: P; vx: number; vy: number; spin: number };

/**
 * One pass across `band` (the canvas over the hero's upper part), the
 * link riding on the ship. `fight`: a hunter waits ahead and is shot
 * down. Resolves when the ship is gone.
 */
export const fly = async (band: HTMLCanvasElement, link: HTMLAnchorElement, fight: boolean) => {
  band.hidden = false;
  link.hidden = false;
  const { ctx, width: W, height: H } = fit(band);
  const rate = holdable(link);
  const dir = Math.random() < 0.5 ? 1 : -1;
  const scale = Math.min(1.5, Math.max(1, W / 960));
  const speed = Math.min(190, Math.max(110, W / 7));
  const margin = 60 * scale;
  const swing = H * 0.16;
  const period = 4.2;
  const phase = Math.random() * Math.PI * 2;

  // The hunter: two-thirds of the way along, coming in from far off.
  const ex = dir > 0 ? W * 0.68 : W * 0.32;
  const ey = H * (0.38 + Math.random() * 0.2);
  let hp = fight ? 2 : 0;
  let flash = 0;
  let enemyIn = 0;
  let boom = -1;
  let shards: Shard[] = [];
  const bolts: { x: number; y: number; vx: number; vy: number }[] = [];
  let nextVolley = 0;

  let t = 0;
  let x = dir > 0 ? -margin : W + margin;

  const ended = await run(dt => {
    dt *= rate(dt);
    t += dt;
    x += dir * speed * dt;
    const w = (Math.PI * 2) / period;
    const y = H * 0.5 + swing * Math.sin(w * t + phase);
    const vy = swing * w * Math.cos(w * t + phase);
    const heading = Math.atan2(vy, dir * speed);
    // A paper plane banks into its own drift.
    const roll = TILT + 0.45 * (vy / speed) * dir;

    ctx.clearRect(0, 0, W, H);

    // The hunter: it fades up from depth as the ship nears, faces it,
    // flashes white when hit (the game's `flash`), and comes apart.
    if (fight) {
      const ahead = (ex - x) * dir;
      if (hp > 0) {
        enemyIn = Math.min(1, Math.max(enemyIn, 1 - (ahead - 260) / 360));
        if (enemyIn > 0) {
          const depth = 260 * (1 - enemyIn);
          const bob = Math.sin(t * 2.1) * 4;
          const pts = place(ex, ey + bob, depth, dir > 0 ? Math.PI : 0, TILT, scale * 0.9);
          stroke(ctx, pts, flash > 0 ? INK_HI : RUST, enemyIn, scale);
          // The cannon: two bolts a volley, from either side of the nose.
          if (enemyIn >= 1 && ahead > 40 && ahead < 300 && t >= nextVolley) {
            nextVolley = t + 0.22;
            const aim = Math.atan2(ey - y, ex - x);
            for (const off of [-9, 9]) {
              const ox = -Math.sin(heading) * off * scale;
              const oy = Math.cos(heading) * off * scale;
              bolts.push({ x: x + Math.cos(heading) * 24 * scale + ox, y: y + Math.sin(heading) * 24 * scale + oy, vx: Math.cos(aim) * 760, vy: Math.sin(aim) * 760 });
            }
          }
          flash -= dt;
        }
      }
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        ctx.strokeStyle = INK_HI;
        ctx.lineWidth = 1.6;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x - b.vx * 0.03, b.y - b.vy * 0.03);
        ctx.stroke();
        ctx.globalAlpha = 1;
        if (hp > 0 && (b.x - ex) * dir >= 0) {
          bolts.splice(i, 1);
          flash = 0.08;
          if (--hp === 0) {
            // It comes apart along its own edges.
            boom = t;
            const pts = place(ex, ey, 0, dir > 0 ? Math.PI : 0, TILT, scale * 0.9);
            shards = EDGES.map(([a, c]) => {
              const mx = (pts[a][0] + pts[c][0]) / 2 - ex;
              const my = (pts[a][1] + pts[c][1]) / 2 - ey;
              const n = Math.hypot(mx, my) || 1;
              const v = 40 + Math.random() * 90;
              return { a: pts[a], b: pts[c], vx: (mx / n) * v, vy: (my / n) * v, spin: (Math.random() - 0.5) * 6 };
            });
          }
        } else if (b.x < -20 || b.x > W + 20) bolts.splice(i, 1);
      }
      if (boom >= 0) {
        const age = t - boom;
        const fade = Math.max(0, 1 - age / 0.9);
        if (fade > 0) {
          ctx.lineWidth = 1.15;
          for (const s of shards) {
            const cx = (s.a[0] + s.b[0]) / 2 + s.vx * age;
            const cy = (s.a[1] + s.b[1]) / 2 + s.vy * age;
            const hx = (s.b[0] - s.a[0]) / 2;
            const hy = (s.b[1] - s.a[1]) / 2;
            const c = Math.cos(s.spin * age);
            const sn = Math.sin(s.spin * age);
            ctx.strokeStyle = age < 0.1 ? INK_HI : RUST_HI;
            ctx.globalAlpha = fade;
            ctx.beginPath();
            ctx.moveTo(cx - (hx * c - hy * sn), cy - (hx * sn + hy * c));
            ctx.lineTo(cx + (hx * c - hy * sn), cy + (hx * sn + hy * c));
            ctx.stroke();
          }
          // The flash: a ring that opens and fades.
          ctx.strokeStyle = RUST_HI;
          ctx.globalAlpha = fade * 0.6;
          ctx.beginPath();
          ctx.arc(ex, ey, 6 + age * 70 * scale, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    stroke(ctx, place(x, y, 0, heading, roll, scale), INK, 1, scale);
    link.style.transform = `translate(${(x - 32).toFixed(1)}px, ${(y - 24).toFixed(1)}px)`;

    return dir > 0 ? x < W + margin : x > -margin;
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

/** Reduced motion: the ship stands still for a moment, then fades. */
export const stand = async (band: HTMLCanvasElement, link: HTMLAnchorElement) => {
  band.hidden = false;
  link.hidden = false;
  const { ctx, width: W, height: H } = fit(band);
  const scale = Math.min(1.5, Math.max(1, W / 960));
  const x = W * 0.2;
  const y = H * 0.5;
  stroke(ctx, place(x, y, 0, -0.12, TILT, scale), INK, 1, scale);
  link.style.transform = `translate(${x - 32}px, ${y - 24}px)`;
  band.classList.add('is-still');
  await new Promise(r => setTimeout(r, 8000));
  band.classList.remove('is-still');
  await new Promise(r => setTimeout(r, 600));
  link.hidden = true;
  band.hidden = true;
  release(band);
};
