// Copies Space Explorer's SHIPPED build into the site: the same pre-minified
// game.js the Platanus cabinet runs, and its cover. The game lives in its own
// repo (games/platanus-hack-26-venezuela-arcade), which a Cloudflare build
// never sees — so the copies are committed, and this script is how they are
// refreshed after a new game release. Run from apps/web: npm run arcade
//
// Phaser is vendored once beside it (public/arcade/phaser.min.js, 3.87.0 —
// the version the cabinet loads from its CDN). Bump it only together with
// the game.
import { copyFileSync, statSync } from 'node:fs';

const game = new URL(
  '../../../games/platanus-hack-26-venezuela-arcade/',
  import.meta.url
);
const pub = new URL('../public/', import.meta.url);

for (const [from, to] of [
  ['game.js', 'arcade/game.js'],
  ['cover.png', 'media/arcade/cover.png'],
]) {
  copyFileSync(new URL(from, game), new URL(to, pub));
  console.log(to, statSync(new URL(to, pub)).size, 'bytes');
}
