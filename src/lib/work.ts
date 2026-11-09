import type { DeckItem } from './deck-items';

/**
 * More Work — the projects that are not the three stars, after the game.
 * SECONDARY on purpose: a panel deck (PanelDeck), smaller type than the
 * stories. Every screen is the project's site, a silent recording of it
 * being scrolled (2026-10-17: the stills read as the one slow panel on the
 * page). Crol's starts and ends on its section on the mobile app Juan
 * built, since the card is about the app and not the site (2026-10-02).
 *
 * Job titles and project names stay as they are in every locale; roles
 * are keys. A screen opens the site it shows when clicked (`visit`).
 */

// Order is weight: the startup, the job, the game, then client work,
// oldest last.
export const PROJECTS: DeckItem[] = [
  {
    id: 'space-explorer',
    slug: 'space-explorer',
    name: 'Space Explorer',
    meta: [['Platanus Hack'], ['2026']],
    body: {
      k: 'arcade.p1',
      links: {
        platanus: 'https://hack.platan.us/26-ve',
        arcade: 'https://hack.platan.us/26/arcade/space-explorer',
      },
    },
    clip: 'arcade.p1',
    image: { slot: 'arcade' },
    scene: '/media/arcade/cover.webp',
    links: [],
  },
  {
    id: 'salvalo',
    slug: 'salvalo',
    name: 'Salvalo',
    meta: [[{ k: 'work.cofounder' }], ['2024', { k: 'work.present' }]],
    body: { k: 'work.salvalo.body', links: { salvalo: 'https://salvalo.app' } },
    clip: 'work.salvalo.body',
    image: '/media/work/salvalo.mp4',
    visit: 'https://salvalo.app',
    links: [],
  },
  {
    id: 'crol',
    slug: 'crol-erp-movil',
    name: 'Crol ERP Móvil',
    meta: [['Lead Frontend Developer'], ['2022', { k: 'work.present' }]],
    body: { k: 'work.crol.body', links: { crol: 'https://www.crol.mx' } },
    clip: 'work.crol.body',
    image: '/media/work/crol.mp4',
    visit: 'https://www.crol.mx',
    links: [],
  },
  {
    id: 'maktub',
    slug: 'maktub-art-fund',
    name: 'Maktub Art Fund',
    meta: [[{ k: 'work.freelance' }], ['2026']],
    body: {
      k: 'work.maktub.body',
      links: { maktub: 'https://maktubartfund.com' },
    },
    clip: 'work.maktub.body',
    image: '/media/work/maktub.mp4',
    visit: 'https://maktubartfund.com',
    links: [],
  },
];
