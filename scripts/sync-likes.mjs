// Makes the pictures of "Things I Like" (lib/likes) from Juan's own folders:
// the space photos he ranked (Webb's and Hubble's, TIFFs of up to 520 MB and
// 10,000 px a side), the paintings he collected, and his screenshots of the
// games he loves most (4K
// JPEGs). The masters never enter the repo — a Cloudflare build never sees
// them — so the copies are committed, and this script is how they are
// refreshed: npm run likes (LIKES_DIR points elsewhere; ~/Downloads by
// default, where each set is a folder of its own).
//
// Every picture ships twice, as WebP: a THUMBNAIL (`{id}-thumb.webp`,
// 1000 px on its long side) for the gallery's grid, lazy, and the full
// picture (2000 px, a desk's screen at 2x) that loads only when it is
// opened. The landing loads none of them: the gallery is a page of its
// own (pages/things-i-like).
import { mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

const from = process.env.LIKES_DIR ?? join(homedir(), 'Downloads');
const pub = new URL('../public/media/likes/', import.meta.url).pathname;

sharp.cache(false);
const THUMB = 1000;
const SETS = [
  // The file's name, less its folder's prefix, is the picture's id in
  // lib/likes ("cosmos-the-crab-nebula.tif" → the-crab-nebula).
  {
    dir: 'cosmos',
    name: f => f.replace(/^cosmos-/, '').replace(/\.tiff?$/, ''),
  },
  {
    dir: 'paintings',
    name: f => f.replace(/^paintings-/, '').replace(/\.(jpe?g|png|webp)$/i, ''),
  },
  // A screenshot is named by its order: the console names them by time.
  { dir: 'ghost-of-yotei', name: (f, i) => String(i + 1) },
  { dir: 'elden-ring', name: (f, i) => String(i + 1) },
];

for (const set of SETS) {
  const src = join(from, set.dir);
  const out = join(pub, set.dir);
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  const files = readdirSync(src)
    .filter(f => /\.(tiff?|jpe?g|png|webp)$/i.test(f))
    .sort();
  let total = 0;
  let thumbs = 0;
  for (const [i, f] of files.entries()) {
    const to = join(out, `${set.name(f, i)}.webp`);
    const thumb = join(out, `${set.name(f, i)}-thumb.webp`);
    // A TIFF this size is past sharp's default pixel limit (268 MP).
    const master = sharp(join(src, f), { limitInputPixels: false })
      .rotate()
      .toColourspace('srgb');
    await master
      .clone()
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(to);
    await master
      .clone()
      .resize(THUMB, THUMB, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 72, effort: 5 })
      .toFile(thumb);
    const size = statSync(to).size;
    thumbs += statSync(thumb).size;
    total += size;
    console.log(
      `${set.dir}/${set.name(f, i)}.webp`,
      Math.round(size / 1024),
      'KB',
    );
  }
  console.log(
    `${set.dir}: ${files.length} pictures, ${(total / 1048576).toFixed(1)} MB; thumbnails ${(thumbs / 1048576).toFixed(1)} MB\n`,
  );
}
