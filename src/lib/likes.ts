import type { DeckItem } from './deck-items';
import { songsShown } from './release';
import ENCODED from '../data/songs.json';

/**
 * THINGS I LIKE — what Juan loves outside of work, so a visitor knows him
 * a little more: the space photos he loves and the paintings he
 * collected. A gallery on a page of its own (pages/things-i-like),
 * reached from the footer, so the landing never loads a picture of it.
 *
 * The pictures are made from Juan's own folders by `npm run likes`
 * (scripts/sync-likes.mjs): WebP, 2000 px on the long side. A new space
 * photo or painting is a file in his folder, then the script.
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
  {
    id: 'belshazzars-feast',
    name: "Belshazzar's Feast",
    by: 'John Martin',
    year: '1820',
  },
  {
    id: 'destruction',
    name: 'The Course of Empire: Destruction',
    by: 'Thomas Cole',
    year: '1836',
  },
  {
    id: 'joshua-sun',
    name: 'Joshua Commanding the Sun to Stand Still',
    by: 'John Martin',
    year: '1816',
  },
  { id: 'morning-solace', name: 'Morning Solace' },
  { id: 'peace-be-still', name: 'Peace, Be Still' },
  { id: 'peace-is-coming', name: 'Peace Is Coming' },
  {
    id: 'ruins-of-an-ancient-city',
    name: 'Ruins of an Ancient City',
    by: 'John Martin',
    year: '1810',
  },
  {
    id: 'sermon-on-the-mount',
    name: 'The Sermon on the Mount',
    by: 'Carl Bloch',
    year: '1877',
  },
  {
    id: 'the-fall-of-babylon',
    name: 'The Fall of Babylon',
    by: 'John Martin',
    year: '1819',
  },
  {
    id: 'the-great-day-of-his-wrath',
    name: 'The Great Day of His Wrath',
    by: 'John Martin',
    year: '1853',
  },
  {
    id: 'the-seventh-plague',
    name: 'The Seventh Plague of Egypt',
    by: 'John Martin',
    year: '1823',
  },
  {
    id: 'the-spinners',
    name: 'The Spinners',
    by: 'Diego Velázquez',
    year: '1657',
  },
];

const paintingSrc = (p: Painting) => `/media/likes/paintings/${p.id}.webp`;

export const cosmosSrc = (p: SpacePhoto) => `/media/likes/cosmos/${p.id}.webp`;

export const COSMOS = SPACE;

export const PAINTINGS = CANVASES;

const thumbOf = (src: string) => src.replace(/\.webp$/, '-thumb.webp');

/**
 * JUAN'S SONGS — his whole Sound Shaper library: first his top, ranked
 * by him in /dev/ranker (`likes-order.json` → `songs`), then the rest
 * from A to Z, shown apart as not part of it (Juan, 2026-10-28). Made
 * into the site's music by `npm run songs` (scripts/sync-songs.mjs),
 * which writes `songs.json` in that order. Played on the card with Sound
 * Shaper's own Shape controls (SongsPlayer). A title and an artist are
 * proper names, the same in every language.
 */
export type Song = {
  id: string;
  title: string;
  artist: string;
  /** Its length, for the list before it has loaded. */
  seconds: number;
  cover: boolean;
  /** One of his ranked top, in its place; the rest are not ranked. */
  top: boolean;
};

export const SONGS = ENCODED as Song[];

export const songSrc = (s: Song) => `/media/likes/songs/${s.id}.m4a`;
export const thumbSrc = (s: Song) =>
  s.cover ? `/media/likes/songs/${s.id}-thumb.webp` : undefined;
export const coverSrc = (s: Song) =>
  s.cover ? `/media/likes/songs/${s.id}.webp` : undefined;

/**
 * THE GALLERY'S CARDS — a panel deck like More Work and Events
 * (PanelDeck), on a page of its own (pages/things-i-like). Cosmos and the
 * paintings are ONE frame each that turns through its pictures, in a new
 * random order every visit — THUMBNAILS (~80 KB, 1000 px), only the one
 * showing and the next loaded — with arrows to go through them by hand;
 * a click opens the full picture (PhotoViewer).
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
      links: {
        webb: 'https://esawebb.org/images/',
        hubble: 'https://esahubble.org/images/',
      },
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
    captions: PAINTINGS.map(p =>
      p.by ? `${p.name} · ${p.by}, ${p.year}` : p.name,
    ),
    wide: true,
    shuffle: true,
    links: [],
  },
  // A screen of its own: the player (SongsPlayer, the `songs` slot in
  // ThingsILike). Not on the site till Juan records it (lib/release), and
  // never with no songs made.
  ...(songsShown && SONGS.length
    ? [
        {
          id: 'songs',
          slug: 'songs',
          name: { k: 'likes.songs.name' },
          meta: [[{ k: 'likes.songs.meta' }], ['Sound Shaper']],
          // The app's name takes you to it: someone who lands here first
          // can reach Sound Shaper's own section of the landing.
          body: { k: 'likes.songs.body', links: { shaper: '/sound-shaper' } },
          clip: 'likes.songs.body',
          image: { slot: 'songs' },
          scene: SONGS.map(coverSrc).find(Boolean),
          links: [],
        } satisfies DeckItem,
      ]
    : []),
];
