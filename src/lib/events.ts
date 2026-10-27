import type { DeckItem } from './deck-items';

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
  yummy: 'https://www.yummysuperapp.com/',
  cashea: 'https://www.cashea.app/',
  slash: 'https://www.slash.com/',
  salvalo: 'https://salvalo.app',
  ok101: 'https://ok101fm.net/',
  tripealo: 'https://www.tripealo.app/',
  juares: 'https://www.instagram.com/teatrojuares',
  elias: 'https://www.instagram.com/padreeliaslc/',
  pedro: 'https://www.linkedin.com/in/pedrovallenilla/',
  cheo: 'https://www.instagram.com/cheonoguera/',
  cesar: 'https://www.linkedin.com/in/cesarmartinez-dev',
  pastor: 'https://www.linkedin.com/in/pastor-jimenez/',
  ale: 'https://www.linkedin.com/in/alehernandezt/',
  panal: 'https://www.instagram.com/panal.ve/',
  manuel: 'https://www.instagram.com/manuelsirac/',
  resty: 'https://www.instagram.com/restyapps/',
  squareone: 'https://www.linkedin.com/company/squareonecap',
  enrique: 'https://www.linkedin.com/in/enriquerivasz',
  sebastian: 'https://www.linkedin.com/in/sebastianalcala/',
  tridi: 'https://tridi-alpha.vercel.app/',
  summit: 'https://www.startupvenezuelasummit.com/',
  platanus: 'https://hack.platan.us/26-ve',
  fina: 'https://www.finapartner.com/',
  rial: 'https://www.somosrial.com/',
  adirson: 'https://www.linkedin.com/in/martinezadirson/',
  innoven: 'https://squareonecap.com/innoven',
  wink: 'https://usawink.com/',
};

// Newest first, as a feed reads (Juan, 2026-10-13) — More Work and the
// apps are ordered by weight, but events are a timeline. A new event goes
// at the TOP.
export const EVENTS: DeckItem[] = [
  {
    id: 'platanus',
    slug: 'platanus-hack-caracas',
    date: '2026-10',
    name: 'Platanus Hack 26 Caracas',
    meta: [
      [{ k: 'events.hackathon' }],
      ['Caracas'],
      [{ k: 'events.platanus.when' }],
    ],
    body: { k: 'events.platanus.body', links: LINKS },
    clip: 'events.platanus.body',
    // Ordered by what matters most (Juan, 2026-10-27): the videos Juan is
    // in longest, then the photos he is in, dealt across the two frames
    // (PanelDeck `columns`). Six photos and six videos, as every twelve.
    image: [
      // The team with Sebastián, the mentor, Juan among them.
      '/media/events/platanus-hack-caracas/mentor-session.mp4',
      // The floor: the team talking, the other teams at work.
      '/media/events/platanus-hack-caracas/hackathon-floor.mp4',
      '/media/events/platanus-hack-caracas/team-vibing.mp4',
      // Tridi running on the laptop: a scene of its flow.
      '/media/events/platanus-hack-caracas/tridi-demo.mp4',
      // People playing Space Explorer, next to the team's desk.
      '/media/events/platanus-hack-caracas/space-explorer.mp4',
      // Late at night: Tridi's landing on the laptop, the team resting.
      '/media/events/platanus-hack-caracas/night-lounge.mp4',
      // Pastor's pitch on the event's stream, Juan beside him.
      '/media/events/platanus-hack-caracas/pitch.jpg',
      // With Adirson Martínez, Rial's CTO, and his team.
      '/media/events/platanus-hack-caracas/team-with-rial.jpg',
      '/media/events/platanus-hack-caracas/team-mentor.jpg',
      // The team: it opens the left frame, ahead of the dinner (Juan,
      // 2026-10-27).
      '/media/events/platanus-hack-caracas/team-selfie-2.jpg',
      // Saturday's dinner in Yummy's dining room: pabellón criollo.
      '/media/events/platanus-hack-caracas/dinner.jpg',
      '/media/events/platanus-hack-caracas/tridi-sketch.jpg',
    ],
    links: [],
  },
  {
    id: 'summit',
    slug: 'startup-venezuela-summit',
    date: '2026-10',
    name: 'Startup Venezuela Summit',
    meta: [
      [{ k: 'events.summit' }],
      ['Caracas'],
      [{ k: 'events.summit.when' }],
    ],
    body: { k: 'events.summit.body', links: LINKS },
    clip: 'events.summit.body',
    // Ordered by what matters most (Juan, 2026-10-27): the videos Juan is
    // in longest, then the photos he is in, dealt across the two frames
    // (PanelDeck `columns`). Six photos and six videos, as every twelve;
    // the Cashea panel as a video, not a photo of it too.
    image: [
      // Juan introducing himself on camera, badge in hand.
      '/media/events/startup-venezuela-summit/introduction.mp4',
      // Salvalo's photo going up on Innoven's wall of Venezuelan founders.
      '/media/events/startup-venezuela-summit/founders-wall.mp4',
      // The private workshop with Fina and Innoven.
      '/media/events/startup-venezuela-summit/innoven-workshop.mp4',
      // Thursday afternoon's pitch session, the room full.
      '/media/events/startup-venezuela-summit/pitch-session.mp4',
      // The main hall full for Cashea's panel.
      '/media/events/startup-venezuela-summit/auditorium.mp4',
      // The lights projected behind the meetings.
      '/media/events/startup-venezuela-summit/meeting-lights.mp4',
      '/media/events/startup-venezuela-summit/tripealo-team.jpg',
      // With someone Juan met between the talks.
      '/media/events/startup-venezuela-summit/new-friend.jpg',
      '/media/events/startup-venezuela-summit/summit-logo.jpg',
      '/media/events/startup-venezuela-summit/opening-remarks.jpg',
      '/media/events/startup-venezuela-summit/victor-cardenas.jpg',
      '/media/events/startup-venezuela-summit/caracas-campus.jpg',
    ],
    links: [],
  },
  {
    id: 'panal',
    slug: 'el-panal',
    date: '2026-10',
    name: 'El Panal',
    meta: [
      [{ k: 'events.meetup' }],
      ['Barquisimeto'],
      [{ k: 'events.panal.when' }],
    ],
    body: { k: 'events.panal.body', links: LINKS },
    clip: 'events.panal.body',
    // Ordered by what matters most (Juan, 2026-10-27): the videos Juan is
    // in longest — his 30-second pitch, then El Panal's own clip of the
    // networking — then the photos, dealt across the two frames.
    image: [
      // Juan's 30-second Salvalo pitch.
      '/media/events/el-panal/pitch.mp4',
      // El Panal's story of the networking, Juan in it.
      '/media/events/el-panal/networking.mp4',
      '/media/events/el-panal/manuel-sira.jpg',
      '/media/events/el-panal/tripealo.jpg',
      '/media/events/el-panal/resty.jpg',
      // The night's last photo, by the pool with the Tripealo founders.
      '/media/events/el-panal/friends-selfie.jpg',
    ],
    links: [],
  },
  {
    id: 'radio',
    slug: 'ok-101-5-fm',
    date: '2026-10',
    name: 'OK 101.5 FM',
    meta: [
      [{ k: 'events.interview' }],
      ['Barquisimeto'],
      [{ k: 'events.radio.when' }],
    ],
    body: { k: 'events.radio.body', links: LINKS },
    clip: 'events.radio.body',
    // The interview on air first, then the goodbye photo.
    image: [
      '/media/events/ok101-radio/on-air.mp4',
      '/media/events/ok101-radio/good-bye.jpg',
    ],
    links: [],
  },
  {
    id: 'ilc',
    slug: 'ilc-talks',
    date: '2026-09',
    name: 'ILC Talks: Liderar para Servir',
    meta: [
      [{ k: 'events.talk' }],
      ['Barquisimeto'],
      [{ k: 'events.ilc.when' }],
    ],
    body: { k: 'events.ilc.body', links: LINKS },
    clip: 'events.ilc.body',
    // Three pictures or fewer: one frame, the talk first, then the photo.
    image: [
      '/media/events/ilc-talks/talk.mp4',
      '/media/events/ilc-talks/stage.jpg',
    ],
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
    // Ordered by what matters most (Juan, 2026-10-27): the videos first —
    // the team on film, then the founder call with Pedro Vallenilla — then
    // the photos with Juan in them, dealt across the two frames.
    image: [
      // Juan filming the team.
      '/media/events/vibe-coding-hackathon/team-record.mp4',
      // The founder call with Pedro Vallenilla (Cashea).
      '/media/events/vibe-coding-hackathon/founder-call.mp4',
      // Juan at the photo stand in Yummy's offices, the purple motorcycle.
      '/media/events/vibe-coding-hackathon/yummy-hq.jpg',
      '/media/events/vibe-coding-hackathon/team-selfie.jpg',
      '/media/events/vibe-coding-hackathon/team-coding.jpg',
      // Víctor Cárdenas's founder talk (Slash).
      '/media/events/vibe-coding-hackathon/talk.jpg',
    ],
    links: [],
  },
];
