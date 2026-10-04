import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

/**
 * THE SCENE — the colours a picture lends the page around it.
 *
 * Every screen the landing shows (a story's slide, a project's capture, an
 * event's photos) carries its own light into the panel it stands in: the
 * page's ground takes a dark, slow wash of the picture's own hues, so
 * Sound Shaper's player feels like a different room from its library, and
 * every project in More Work like its own place — the media adjusting to
 * the site instead of being dropped onto it.
 *
 * THIS IS NOT THE PICTURE BLURRED. Two earlier passes put the screenshot
 * itself behind the page — full-viewport (a muddy wash) and blown up past
 * the phone (rings, and too big an effect) — and both read as a picture
 * behind a picture. Here the picture is reduced to COLOURS at build time,
 * and the page draws clean light from them (global.css `.scene`), so
 * there is no shape, no edge and no blur to band.
 *
 * Extraction: the picture's chromatic pixels are binned by hue and
 * counted by AREA — the near-black chrome of a dark screenshot and its
 * white text say nothing about it, and are dropped. A hue has to cover a
 * real share of the picture to count, so a dark settings screen is not
 * lit green by its one switch: weighting by saturation did exactly that.
 * The largest hues, at least 40° apart, are the scene. Every screen with
 * colour lights the page at ONE strength — scaling it by how much of the
 * picture was colour left a dark app screen barely lit beside a bright
 * website, and the panels stopped reading as one system (Juan,
 * 2026-10-04). A grey screen lends no light at all.
 */

const BINS = 18;
const MAX_COLOURS = 3;
const MIN_HUE_GAP = 2; // bins — 40°

/** A hue counts once it covers this share of the picture. */
const MIN_COVER = 0.01;

export type Scene = { colours: string[]; strength: number };

const cache = new Map<string, Scene>();

const hsv = (r: number, g: number, b: number) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s: max ? d / max : 0, v: max / 255 };
};

const hex = (n: number) => Math.round(n).toString(16).padStart(2, '0');

const SAT = 0.7;
const LIGHT = 0.5;

/** A hue at the scene's one saturation and lightness, as hex. */
const rgbOfHue = (h: number) => {
  const c = (1 - Math.abs(2 * LIGHT - 1)) * SAT;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = LIGHT - c / 2;
  const [r, g, b] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][Math.floor(h / 60) % 6];
  return `#${hex((r + m) * 255)}${hex((g + m) * 255)}${hex((b + m) * 255)}`;
};

/** The scene of one or more pictures (paths under `public/`): its hues,
 *  largest first, and how strongly they light the page (0–1). */
export const sceneOf = async (src: string | string[]): Promise<Scene> => {
  const srcs = Array.isArray(src) ? src : [src];
  const key = srcs.join('|');
  const hit = cache.get(key);
  if (hit) return hit;

  const bins = Array.from({ length: BINS }, () => ({ w: 0, r: 0, g: 0, b: 0 }));
  let pixels = 0;
  for (const s of srcs) {
    const file = fileURLToPath(new URL(`../../public${s}`, import.meta.url));
    const { data, info } = await sharp(file)
      .resize(64, 64, { fit: 'inside' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    pixels += data.length / info.channels;
    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const { h, s: sat, v } = hsv(r, g, b);
      if (v < 0.15 || sat < 0.2) continue;
      const w = 1;
      const bin = bins[Math.floor(h / (360 / BINS)) % BINS];
      bin.w += w;
      bin.r += r * w;
      bin.g += g * w;
      bin.b += b * w;
    }
  }

  const ranked = bins
    .map((bin, i) => ({ ...bin, i }))
    .filter(bin => bin.w > 0)
    .sort((a, b) => b.w - a.w);
  const top = ranked[0]?.w ?? 0;
  const picked: typeof ranked = [];
  for (const bin of ranked) {
    if (
      picked.length === MAX_COLOURS ||
      bin.w < pixels * MIN_COVER ||
      bin.w < top * 0.2
    )
      break;
    const far = picked.every(p => {
      const d = Math.abs(p.i - bin.i);
      return Math.min(d, BINS - d) >= MIN_HUE_GAP;
    });
    if (far) picked.push(bin);
  }

  // Only the HUE is the picture's. An average of a bin's pixels comes out
  // muted (a red cover and its dark shadows average to brick), and two
  // muted hues washed together over the ground read as mud — so every
  // colour is stood at one saturation and one lightness, and the page's
  // light is a set of clean hues at one strength.
  const colours = picked.map(bin => {
    const { h } = hsv(bin.r / bin.w, bin.g / bin.w, bin.b / bin.w);
    return rgbOfHue(h);
  });
  const strength = colours.length ? 1 : 0;
  const scene = { colours, strength };
  cache.set(key, scene);
  return scene;
};

/** A scene as the `data-scene` attribute the page's light reads:
 *  `"#hex #hex|0.8"`. A screen with no colour still says so ("|0"), so
 *  turning to it puts the page back on its plain ground. */
export const sceneAttr = ({ colours, strength }: Scene) =>
  `${colours.join(' ')}|${strength.toFixed(2)}`;
