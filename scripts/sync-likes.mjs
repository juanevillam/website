// Makes the pictures of "More of Me" (lib/likes) from Juan's own folders:
// the space photos he loves (Webb's and Hubble's, TIFFs of up to 520 MB and
// 10,000 px a side). The masters never
// enter the repo — a Cloudflare build never sees them — so the copies are
// committed, and this script is how they are refreshed: npm run likes
// (LIKES_DIR points elsewhere; iCloud Drive's Life folder by default,
// where each set is a folder of its own).
//
// Every picture ships twice, as WebP: a THUMBNAIL (`{id}-thumb.webp`,
// 1000 px on its long side) for the gallery's grid, lazy, and the full
// picture (2000 px, a desk's screen at 2x) that loads only when it is
// opened. The landing loads none of them: the gallery is a page of its
// own (pages/more-of-me).
import { mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

const from =
  process.env.LIKES_DIR ??
  join(homedir(), 'Library/Mobile Documents/com~apple~CloudDocs/Life');
const pub = new URL('../public/media/likes/', import.meta.url).pathname;

sharp.cache(false);
const THUMB = 1000;
const COSMOS_SLUGS = {
  'a-poster-size-image-of-the-beautiful-barred-spiral-galaxy-ngc-1300':
    'ngc-1300',
  'abell-1703-': 'abell-1703',
  'carina-nebula-jets-nir-cam-narrowband-filters': 'carina-nebula-jets',
  'cas-a-nir-cam-image': 'cassiopeia-a',
  'ceers-crop-nir-cam-image': 'ceers',
  'extreme-star-cluster-bursts-into-life-in-new-hubble-image': 'ngc-3603',
  'galactic-wreckage-in-stephans-quintet': 'stephans-quintet',
  'hubble-sees-galaxies-galore': 'galaxies-galore',
  'largest-ever-galaxy-portrait-stunning-hd-image-of-pinwheel-galaxy':
    'pinwheel-galaxy',
  'nir-cams-view-of-ngc-6822': 'ngc-6822',
  'out-of-this-whirl-the-whirlpool-galaxy-m51-and-companion-galaxy':
    'whirlpool-galaxy',
  'pillars-of-creation-nir-cam-and-miri-composite-image': 'pillars-of-creation',
  'quasar-j0100-2802-nir-cam-image': 'quasar-j0100-2802',
  'revisiting-the-veil-nebula': 'veil-nebula',
  'rho-ophiuchi-cloud-complex': 'rho-ophiuchi',
  'spectacular-hubble-view-of-centaurus-a': 'centaurus-a',
  'the-crab-nebula': 'crab-nebula',
  'the-exotic-stellar-population-of-westerlund-1': 'westerlund-1',
  'webb-takes-a-stunning-star-filled-portrait-of-the-pillars-of-creation-full-view':
    'pillars-of-creation-full-view',
  'westerlund-2-hubbles-25th-anniversary-image': 'westerlund-2',
  'young-stars-sculpt-gas-with-powerful-outflows': 'young-stars-sculpt-gas',
  'zs7-environment-nic-cam-image': 'zs7',
};

const SETS = [
  // The file's name, mapped to its canonical kebab-case slug in lib/likes.
  {
    dir: 'cosmos',
    name: f => {
      const raw = f.replace(/^cosmos-/, '').replace(/\.tiff?$/, '');
      return COSMOS_SLUGS[raw] ?? raw;
    },
  },
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
