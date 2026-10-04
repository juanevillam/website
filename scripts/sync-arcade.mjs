// Copies Space Explorer's SHIPPED build into the site: the game.js the
// Platanus cabinet runs, and its cover. The game lives in its own repo
// (games/platanus-hack-26-venezuela-arcade), which a Cloudflare build never
// sees — so the copies are committed, and this script is how they are
// refreshed after a new game release. Run from apps/web: npm run arcade
//
// Since v2 the release is the READABLE, commented source — the cabinet
// minifies it on Platanus's side. The site has no such step, so it
// minifies here (esbuild, the same family of minifier the release is
// measured with) and serves the same code at its shipped size.
//
// Phaser is vendored once beside it (public/arcade/phaser.min.js, 3.87.0 —
// the version the cabinet loads from its CDN). Bump it only together with
// the game.
import { copyFileSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { transform } from 'esbuild';

const game = new URL(
  '../../../games/platanus-hack-26-venezuela-arcade/',
  import.meta.url
);
const pub = new URL('../public/', import.meta.url);

const source = readFileSync(new URL('game.js', game), 'utf8');
const { code } = await transform(source, { minify: true, legalComments: 'none' });
writeFileSync(new URL('arcade/game.js', pub), code);

copyFileSync(new URL('cover.png', game), new URL('media/arcade/cover.png', pub));

for (const to of ['arcade/game.js', 'media/arcade/cover.png'])
  console.log(to, statSync(new URL(to, pub)).size, 'bytes');
