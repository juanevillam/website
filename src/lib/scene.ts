import path from 'node:path';

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
 * lit green by its one switch. Among the hues that do, a capture or
 * photo is led by the hue covering the most of it; a DARK app screen by
 * the most colourful (summed chroma, saturation × brightness) — so a red
 * cover beats the dim brown around it, and two dark screens with warm and cool covers stop
 * landing on the same pair. The top hues, at least 40° apart, are the
 * scene, and each keeps part of its own saturation (a muted amber stays
 * quieter than a red), between SAT_LO and SAT_HI. Every screen with
 * colour lights the page at ONE strength — scaling it by how much of the
 * picture was colour left a dark app screen barely lit beside a bright
 * website, and the panels stopped reading as one system (Juan,
 * 2026-10-04).
 *
 * A GREY SCREEN STILL LIGHTS THE PAGE — in a neutral, near-white light
 * (Juan, 2026-10-11). It used to lend none, so turning from a coloured
 * slide to a grey one put the light out and the next one lit it again: the
 * room flickered on and off down a deck. Every picture lights its room;
 * one with no hue of its own lights it white, a step dimmer.
 */

const BINS = 18;
const MAX_COLOURS = 3;
const MIN_HUE_GAP = 2; // bins — 40°

/** A hue counts once it covers this share of the picture. */
const MIN_COVER = 0.01;
/** A picture less than this much colour is a dark screen (see `rank`). */
const DARK_SCREEN = 0.25;

export type Scene = { colours: string[]; strength: number };

/** The light of a picture with no hue of its own: near-white, dimmer. */
const NEUTRAL_LIGHT = '#d4d4d4';
const NEUTRAL_STRENGTH = 0.7;

const cache = new Map<string, Scene>();

/** Where the site's pictures are on disk, at build time — from the project
 *  root, not import.meta.url: the build runs this from a bundled chunk
 *  whose depth under dist/ is the bundler's to choose. */
const PUBLIC = path.join(process.cwd(), 'public');

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

/** The light's saturation range: a picture's dullest counted hue (0.2)
 *  maps to SAT_LO, a fully saturated one to SAT_HI. */
const SAT_LO = 0.45;
const SAT_HI = 0.85;
const LIGHT = 0.5;

/** A hue at the scene's one lightness and the given saturation, as hex. */
const rgbOf = (h: number, sat: number) => {
  const c = (1 - Math.abs(2 * LIGHT - 1)) * sat;
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

  const bins = Array.from({ length: BINS }, () => ({
    w: 0,
    s: 0,
    c: 0,
    r: 0,
    g: 0,
    b: 0,
  }));
  let pixels = 0;
  let chromatic = 0;
  for (const s of srcs) {
    const file = path.join(PUBLIC, s);
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
      chromatic++;
      const w = 1;
      const bin = bins[Math.floor(h / (360 / BINS)) % BINS];
      bin.w += w;
      bin.s += sat;
      bin.c += sat * v;
      bin.r += r * w;
      bin.g += g * w;
      bin.b += b * w;
    }
  }

  const ranked = bins
    .map((bin, i) => ({ ...bin, i }))
    .filter(bin => bin.w >= pixels * MIN_COVER);
  // How a hue earns its place depends on the picture. A dark app screen is
  // black chrome around a few small covers, and there the most COLOURFUL
  // hue is the one the eye takes from it — a red cover over the dim brown
  // around it. A capture or a photo is colour edge to edge, and there the
  // one that covers the most IS the picture (Salvalo's navy, not its orange
  // button).
  const dark = chromatic < pixels * DARK_SCREEN;
  const rank = (bin: (typeof ranked)[number]) => (dark ? bin.c : bin.w);
  ranked.sort((a, b) => rank(b) - rank(a));
  const top = ranked[0] ? rank(ranked[0]) : 0;
  const picked: typeof ranked = [];
  for (const bin of ranked) {
    if (picked.length === MAX_COLOURS || rank(bin) < top * 0.2) break;
    const far = picked.every(p => {
      const d = Math.abs(p.i - bin.i);
      return Math.min(d, BINS - d) >= MIN_HUE_GAP;
    });
    if (far) picked.push(bin);
  }

  // The HUE is the picture's, and part of its saturation. An average of a
  // bin's pixels comes out muted (a red cover and its dark shadows average
  // to brick), and muted hues washed together over the ground read as mud
  // — so each colour stands at one lightness, and at a saturation that
  // keeps its rank against the others without ever going dull.
  const colours = picked.map(bin => {
    const { h } = hsv(bin.r / bin.w, bin.g / bin.w, bin.b / bin.w);
    const t = Math.min(1, Math.max(0, (bin.s / bin.w - 0.2) / 0.6));
    return rgbOf(h, SAT_LO + (SAT_HI - SAT_LO) * t);
  });
  const scene = colours.length
    ? { colours, strength: 1 }
    : { colours: [NEUTRAL_LIGHT], strength: NEUTRAL_STRENGTH };
  cache.set(key, scene);
  return scene;
};

/** A scene as the `data-scene` attribute the page's light reads:
 *  `"#hex #hex|0.8"`. A screen with no colour still says so ("|0"), so
 *  turning to it puts the page back on its plain ground. */
export const sceneAttr = ({ colours, strength }: Scene) =>
  `${colours.join(' ')}|${strength.toFixed(2)}`;

/**
 * THE NAME'S LIGHT — the hero and the foot show no picture, only Juan's
 * name, and lit nothing: the page went dark at its first and last screen
 * while every section between glowed (Juan, 2026-10-16). They take the
 * light a grey screen gives, neutral and a step dimmer, standing on the
 * name itself (`data-scene-at`). Desk only, like every room light.
 */
export const NAME_SCENE = sceneAttr({
  colours: [NEUTRAL_LIGHT],
  strength: NEUTRAL_STRENGTH,
});

/** Whether a picture (site-relative, under public/) is wider than tall —
 *  so a frame can alternate upright and sideways (PanelDeck). */
export const isSideways = async (src: string) => {
  const { width = 0, height = 0 } = await sharp(path.join(PUBLIC, src)).metadata();
  return width > height;
};
