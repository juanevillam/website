// Refresh the Tridi robot's walk (the easter egg in the footer, lib/eggs)
// from the Tridi repository, next to the portfolio: `npm run tridi`.
//
// ONE STEP OF A REAL WALK, from the clip Tridi ships on its landing
// (`caminar`): the person's tracking points, as MediaPipe found them in
// the video (web/public/media/caminar.pose2d.json), and the Unitree G1's
// joint angles for the same frames, as Tridi retargeted them
// (physics/motions/clip_..._caminar-perfil_01.json). The robot is drawn
// from its angles at runtime; the person is drawn from their points.
//
// Out: src/data/tridi-walk.json — centimetres, whole numbers, so the file
// stays a couple of kilobytes.
import fs from 'node:fs';

const TRIDI = process.env.TRIDI_DIR ?? new URL('../../../tridi/', import.meta.url).pathname;
const pose = JSON.parse(fs.readFileSync(`${TRIDI}web/public/media/caminar.pose2d.json`, 'utf8'));
const { qpos } = JSON.parse(
  fs.readFileSync(`${TRIDI}physics/motions/clip_2026-10-23_caminar-perfil_01.json`, 'utf8'),
);

// The video is 960 x 540: MediaPipe's x is a share of the width, y of the
// height.
const ASPECT = 960 / 540;
// One gait cycle, where the clip comes back closest to itself (person and robot), and
// how many frames of it are kept; the egg interpolates between them.
const FROM = 284;
const TO = 316;
const KEEP = 24;

// MediaPipe landmarks kept, in this order: nose, then near side (the
// person's right faces the camera), then far side.
const POINTS = [0, 12, 14, 16, 24, 26, 28, 30, 32, 11, 13, 15, 23, 25, 27, 29, 31];
// Leg length of an adult, hip to ankle, to set the person's scale.
const LEG_M = 0.86;

const at = (frames, t) => {
  const i = Math.floor(t);
  const k = t - i;
  const a = frames[i];
  const b = frames[Math.min(i + 1, frames.length - 1)];
  return a.map((v, j) => (Array.isArray(v) ? v.map((x, n) => x + (b[j][n] - x) * k) : v + (b[j] - v) * k));
};

const idx = Object.fromEntries(pose.points.map((p, i) => [p, i]));
const legOf = f => {
  const [hx, hy] = f[idx[24]];
  const [ax, ay] = f[idx[28]];
  return Math.hypot((ax - hx) * ASPECT, ay - hy);
};
const leg =
  pose.frames.slice(FROM, TO).reduce((s, f) => s + legOf(f), 0) / (TO - FROM);
const scale = LEG_M / leg;

const cm = v => Math.round(v * 100);
const human = [];
const robot = [];
for (let n = 0; n < KEEP; n++) {
  const t = FROM + ((TO - FROM) * n) / KEEP;
  const f = at(pose.frames, t);
  // Hips' middle at x = 0; the ground (the lowest heel or toe) at y = 0;
  // y up, metres.
  const hx = (f[idx[23]][0] + f[idx[24]][0]) / 2;
  const ground = Math.max(...[29, 30, 31, 32].map(p => f[idx[p]][1]));
  human.push(
    POINTS.flatMap(p => [cm((f[idx[p]][0] - hx) * ASPECT * scale), cm((ground - f[idx[p]][1]) * scale)]),
  );
  // G1: root height, then the pitch joints the profile shows — left hip,
  // knee, ankle; right hip, knee, ankle; waist; left shoulder, elbow;
  // right shoulder, elbow (qpos: 7 root, 6 + 6 legs, 3 waist, 7 + 7 arms).
  const q = at(qpos, t);
  robot.push([q[2], q[7], q[10], q[11], q[13], q[16], q[17], q[21], q[22], q[25], q[29], q[32]].map(cm));
}

fs.writeFileSync(
  new URL('../src/data/tridi-walk.json', import.meta.url),
  `${JSON.stringify({ fps: pose.fps * (KEEP / (TO - FROM)), human, robot })}\n`,
);
console.log(`tridi-walk.json: ${KEEP} frames, person scale ${scale.toFixed(2)} m`);
