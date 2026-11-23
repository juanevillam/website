import type { DeckItem } from './deck-items';
import { applyOrder, savedEventOrder, savedEventRemoved } from './mediaOrder';
import { eventShown } from './release';

/**
 * Events — where Juan has been, building and learning with other people:
 * hackathons, talks, the events Salvalo takes him to. The site is the
 * GitHub profile and the LinkedIn profile in one place, and this is the
 * LinkedIn half's moments told in his own voice — paraphrased for the
 * narrator, never the post pasted in.
 *
 * A panel deck (PanelDeck) like More Work, newest first. Its screens are
 * the event's PHOTOS — a phone's, upright — in upright 3:4 frames, two at
 * most, each cycling through its share when there are more, every one
 * whole; three or fewer take one frame, one at a time. A VIDEO (silent,
 * its poster beside it as .jpg) comes BEFORE the photos in one frame, and
 * leads the right frame in two — videos in the order listed here — with
 * the photos filling the left frame first, to an even split. A new event
 * is one more entry here, at the top. The companies a card names link
 * out (`[Cashea](cashea)` in the copy, TL).
 */

const LINKS = {
  github: 'https://github.com/juanevillam/space-explorer',
  arcade: 'https://hack.platan.us/26/arcade/space-explorer',
  yummy: 'https://www.yummysuperapp.com/',
  cashea: 'https://www.cashea.app/',
  slash: 'https://www.slash.com/',
  salvalo: 'https://salvalo.app',
  tripealo: 'https://www.tripealo.app/',
  pedro: 'https://www.linkedin.com/in/pedrovallenilla/',
  cesar: 'https://www.linkedin.com/in/cesarmartinez-dev',
  pastor: 'https://www.linkedin.com/in/pastor-jimenez/',
  ale: 'https://www.linkedin.com/in/alehernandezt/',
  squareone: 'https://www.linkedin.com/company/squareonecap',
  enrique: 'https://www.linkedin.com/in/enriquerivasz',
  sebastian: 'https://www.linkedin.com/in/sebastianalcala/',
  tridi: 'https://trytridi.com/',
  summit: 'https://www.startupvenezuelasummit.com/',
  platanus: 'https://hack.platan.us/26-ve',
  fina: 'https://www.finapartner.com/',
  rial: 'https://www.somosrial.com/',
  adirson: 'https://www.linkedin.com/in/martinezadirson/',
  innoven: 'https://squareonecap.com/innoven',
  wink: 'https://usawink.com/',
};

const PLATANUS_MEDIA: string[] = [
  '/media/events/platanus-hack-caracas/team-desks.jpg',
  '/media/events/platanus-hack-caracas/team-audience.jpg',
  '/media/events/platanus-hack-caracas/team-selfie.jpg',
  '/media/events/platanus-hack-caracas/hackathon-floor.mp4',
  '/media/events/platanus-hack-caracas/space-explorer.mp4',
  '/media/events/platanus-hack-caracas/night-lounge.mp4',
];

// Highlights — Space Explorer first, then the Caracas hackathon moments,
// newest first.
const ALL_EVENTS: DeckItem[] = [
  {
    id: 'space-explorer',
    slug: 'space-explorer',
    name: 'Space Explorer',
    meta: [[{ k: 'events.arcade' }], [{ k: 'events.arcade.when' }]],
    body: { k: 'arcade.p1', links: LINKS },
    clip: 'arcade.p1',
    image: { slot: 'arcade' },
    scene: '/media/arcade/cover.webp',
    links: [],
  },
  {
    id: 'platanus',
    slug: 'platanus-hack-caracas',
    date: '2026-10',
    name: 'Platanus Hack',
    meta: [
      [{ k: 'events.hackathon' }],
      ['Caracas'],
      [{ k: 'events.platanus.when' }],
    ],
    body: { k: 'events.platanus.body', links: LINKS },
    clip: 'events.platanus.body',
    image: PLATANUS_MEDIA,
    links: [],
  },
  {
    id: 'alegria',
    slug: 'alegria-hackathon',
    date: '2025-10',
    name: 'AlegrIA Hackathon',
    meta: [
      [{ k: 'events.hackathon' }],
      ['Caracas'],
      [{ k: 'events.alegria.when' }],
    ],
    body: { k: 'events.alegria.body', links: LINKS },
    clip: 'events.alegria.body',
    image: [
      '/media/events/alegria-hackathon/yummy-hq.jpg',
      '/media/events/alegria-hackathon/team-record.mp4',
      '/media/events/alegria-hackathon/team-selfie.jpg',
      '/media/events/alegria-hackathon/team-coding.jpg',
      '/media/events/alegria-hackathon/talk.jpg',
      '/media/events/alegria-hackathon/founder-call.mp4',
    ],
    links: [],
  },
];

/** The events on the site: every one but those not released yet
 *  (lib/release), which only `astro dev` shows. */
export const EVENTS = ALL_EVENTS.filter(e => eventShown(e.id)).map(e =>
  Array.isArray(e.image)
    ? {
        ...e,
        image: applyOrder(e.image, savedEventOrder(e.id), m => m, savedEventRemoved(e.id)),
      }
    : e,
);
