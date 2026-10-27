import type { DeckItem } from './deck-items';
import RANKED from '../data/likes-order.json';

/**
 * THINGS I LIKE — what Juan loves outside of work, so a visitor knows him
 * a little more: the space photos he ranked, the paintings he collected,
 * and memories of the games he loved. A gallery on a page of its own
 * (pages/things-i-like), reached from the footer, so the landing never
 * loads a picture of it.
 *
 * The pictures are made from Juan's own folders by `npm run likes`
 * (scripts/sync-likes.mjs): WebP, 2000 px on the long side. A new game
 * screenshot or a new space photo is a file in his folder, then the script.
 */

/** One of the space photos, by its file (public/media/likes/cosmos) and
 *  the name it is known by — a proper name, the same in every language. */
export type SpacePhoto = { id: string; name: string };

/** Every space photo, in the order of the files. */
const SPACE: SpacePhoto[] = [
  {
    id: 'a-poster-size-image-of-the-beautiful-barred-spiral-galaxy-ngc-1300',
    name: 'NGC 1300',
  },
  { id: 'abell-1703-', name: 'Abell 1703' },
  {
    id: 'carina-nebula-jets-nir-cam-narrowband-filters',
    name: 'Carina Nebula Jets',
  },
  { id: 'cas-a-nir-cam-image', name: 'Cassiopeia A' },
  { id: 'ceers-crop-nir-cam-image', name: 'CEERS' },
  { id: 'cosmic-seahorse', name: 'Cosmic Seahorse' },
  { id: 'different-generations', name: 'Different Generations' },
  {
    id: 'extreme-star-cluster-bursts-into-life-in-new-hubble-image',
    name: 'NGC 3603',
  },
  { id: 'galactic-gathering', name: 'Galactic Gathering' },
  { id: 'galactic-wreckage-in-stephans-quintet', name: "Stephan's Quintet" },
  { id: 'hubble-sees-galaxies-galore', name: 'Galaxies Galore' },
  {
    id: 'largest-ever-galaxy-portrait-stunning-hd-image-of-pinwheel-galaxy',
    name: 'Pinwheel Galaxy',
  },
  {
    id: 'new-stars-shed-light-on-the-past',
    name: 'New Stars Shed Light on the Past',
  },
  { id: 'ngc-1512-and-ngc-1510', name: 'NGC 1512 & NGC 1510' },
  { id: 'nir-cams-view-of-ngc-6822', name: 'NGC 6822' },
  {
    id: 'out-of-this-whirl-the-whirlpool-galaxy-m51-and-companion-galaxy',
    name: 'Whirlpool Galaxy',
  },
  {
    id: 'pillars-of-creation-nir-cam-and-miri-composite-image',
    name: 'Pillars of Creation',
  },
  { id: 'quasar-j0100-2802-nir-cam-image', name: 'Quasar J0100+2802' },
  { id: 'revisiting-the-veil-nebula', name: 'Veil Nebula' },
  { id: 'rho-ophiuchi-cloud-complex', name: 'Rho Ophiuchi' },
  { id: 'seeing-triple', name: 'Seeing Triple' },
  { id: 'spectacular-hubble-view-of-centaurus-a', name: 'Centaurus A' },
  { id: 'spiral-elliptical-irregular', name: 'Spiral, Elliptical, Irregular' },
  { id: 'star-studded-cluster', name: 'Star-Studded Cluster' },
  {
    id: 'tapestry-of-blazing-starbirth',
    name: 'Tapestry of Blazing Starbirth',
  },
  { id: 'the-crab-nebula', name: 'Crab Nebula' },
  { id: 'the-exotic-stellar-population-of-westerlund-1', name: 'Westerlund 1' },
  {
    id: 'webb-takes-a-stunning-star-filled-portrait-of-the-pillars-of-creation-full-view',
    name: 'Pillars of Creation, Full View',
  },
  { id: 'westerlund-2-hubbles-25th-anniversary-image', name: 'Westerlund 2' },
  {
    id: 'young-stars-sculpt-gas-with-powerful-outflows',
    name: 'Young Stars Sculpt Gas',
  },
  { id: 'zs7-environment-nic-cam-image', name: 'ZS7' },
];

/**
 * THE PAINTINGS JUAN COLLECTED, by their file (public/media/likes/paintings).
 * A painting with no `by` is a recent one whose artist is not known yet:
 * it shows with its title alone (Juan's call, 2026-10-27) — its artist's
 * name goes here once known.
 */
export type Painting = { id: string; name: string; by?: string; year?: string };

const CANVASES: Painting[] = [
  { id: 'belshazzars-feast', name: "Belshazzar's Feast", by: 'John Martin', year: '1820' },
  { id: 'destruction', name: 'The Course of Empire: Destruction', by: 'Thomas Cole', year: '1836' },
  {
    id: 'joshua-sun',
    name: 'Joshua Commanding the Sun to Stand Still',
    by: 'John Martin',
    year: '1816',
  },
  { id: 'morning-solace', name: 'Morning Solace' },
  { id: 'peace-be-still', name: 'Peace, Be Still' },
  { id: 'peace-is-coming', name: 'Peace Is Coming' },
  { id: 'ruins-of-an-ancient-city', name: 'Ruins of an Ancient City', by: 'John Martin', year: '1810' },
  { id: 'sermon-on-the-mount', name: 'The Sermon on the Mount', by: 'Carl Bloch', year: '1877' },
  { id: 'the-fall-of-babylon', name: 'The Fall of Babylon', by: 'John Martin', year: '1819' },
  {
    id: 'the-great-day-of-his-wrath',
    name: 'The Great Day of His Wrath',
    by: 'John Martin',
    year: '1853',
  },
  { id: 'the-seventh-plague', name: 'The Seventh Plague of Egypt', by: 'John Martin', year: '1823' },
  { id: 'the-spinners', name: 'The Spinners', by: 'Diego Velázquez', year: '1657' },
];

const paintingSrc = (p: Painting) => `/media/likes/paintings/${p.id}.webp`;

/**
 * WHAT JUAN RANKS — the games' screenshots, which he puts in order himself
 * in a tournament of pairs (`/dev/ranker`, dev only): of two pictures,
 * which he likes more — Ghost of Yōtei's loadouts in the order he liked
 * them. The ranker writes the result to `src/data/likes-order.json`
 * (scripts/likes-ranker.mjs), and the site shows each set in that order —
 * a picture not ranked yet goes last, in the order of its files. Cosmos
 * and the paintings are NOT ranked (Juan, 2026-10-27: he loves them all,
 * and choosing was too hard): they show in a new random order each visit.
 */
export type RankSet = {
  id: keyof typeof RANKED;
  name: string;
  items: { id: string; name: string; src: string }[];
};

const shotIds = (count: number) =>
  Array.from({ length: count }, (_, i) => String(i + 1));

const ranked = <T extends { id: string }>(set: keyof typeof RANKED, items: T[]) => {
  const order: string[] = RANKED[set];
  const at = (item: T) => {
    const i = order.indexOf(item.id);
    return i < 0 ? order.length + items.indexOf(item) : i;
  };
  return [...items].sort((a, b) => at(a) - at(b));
};

export const cosmosSrc = (p: SpacePhoto) => `/media/likes/cosmos/${p.id}.webp`;

export const COSMOS = SPACE;

export const PAINTINGS = CANVASES;

const shotSrc = (game: string, id: string) => `/media/likes/${game}/${id}.webp`;
const shots = (game: 'ghost-of-yotei' | 'elden-ring', count: number) =>
  ranked(game, shotIds(count).map(id => ({ id }))).map(s => shotSrc(game, s.id));

export const RANK_SETS: RankSet[] = [
  ...(
    [
      ['ghost-of-yotei', 'Ghost of Yōtei', 5],
      ['elden-ring', 'Elden Ring', 4],
    ] as const
  ).map(([id, name, count]) => ({
    id,
    name,
    items: shotIds(count).map(n => ({ id: n, name: `${name} ${n}`, src: shotSrc(id, n) })),
  })),
];

const thumbOf = (src: string) => src.replace(/\.webp$/, '-thumb.webp');

/** A game's screenshots, thumbnail and full picture, in Juan's order. */
export type Game = { name: string; pictures: { thumb: string; src: string }[] };

/** The two games of the Video Games card, each one collage (GamesCollage). */
export const GAMES: Game[] = (
  [
    ['ghost-of-yotei', 'Ghost of Yōtei', 5],
    ['elden-ring', 'Elden Ring', 4],
  ] as const
).map(([id, name, count]) => ({
  name,
  pictures: shots(id, count).map(src => ({ src, thumb: thumbOf(src) })),
}));

/**
 * THE GALLERY'S CARDS — a panel deck like More Work and Events
 * (PanelDeck), on a page of its own (pages/things-i-like). Cosmos and the
 * paintings are ONE frame each that turns through its pictures, in a new
 * random order every visit — THUMBNAILS (~80 KB, 1000 px), only the one
 * showing and the next loaded — with arrows to go through them by hand;
 * a click opens the full picture (PhotoViewer). The games are a collage
 * a game (GamesCollage): every screenshot of one game at once.
 */
export const LIKES: DeckItem[] = [
  {
    id: 'cosmos',
    slug: 'cosmos',
    name: 'Cosmos',
    meta: [['James Webb – Hubble']],
    // The photos are ESA's and NASA's: the telescopes' names take you to
    // their galleries, where every one of them is.
    body: {
      k: 'likes.cosmos.body',
      links: { webb: 'https://esawebb.org/images/', hubble: 'https://esahubble.org/images/' },
    },
    clip: 'likes.cosmos.body',
    image: COSMOS.map(p => thumbOf(cosmosSrc(p))),
    captions: COSMOS.map(p => p.name),
    wide: true,
    shuffle: true,
    links: [],
  },
  {
    id: 'paintings',
    slug: 'paintings',
    name: { k: 'likes.paintings.name' },
    meta: [[{ k: 'likes.paintings.meta' }]],
    body: 'likes.paintings.body',
    clip: 'likes.paintings.body',
    image: PAINTINGS.map(p => thumbOf(paintingSrc(p))),
    captions: PAINTINGS.map(p => (p.by ? `${p.name} · ${p.by}, ${p.year}` : p.name)),
    wide: true,
    shuffle: true,
    links: [],
  },
  {
    // Assassin's Creed Unity is the third favorite, and stays out: there
    // is no picture of it, and the gallery shows only what Juan has media
    // of (Juan, 2026-10-27).
    id: 'video-games',
    slug: 'video-games',
    name: { k: 'likes.games.name' },
    meta: [['Ghost of Yōtei'], ['Elden Ring']],
    body: {
      k: 'likes.games.body',
      links: {
        yotei: 'https://www.playstation.com/en-us/games/ghost-of-yotei/',
        elden: 'https://www.playstation.com/en-us/games/elden-ring/',
      },
    },
    clip: 'likes.games.body',
    image: { slot: 'games' },
    scene: GAMES[0].pictures[0].thumb,
    links: [],
  },
];
