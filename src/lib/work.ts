import type { DeckItem } from './deck-items';

/**
 * More Work — the projects that are not the three stars, after the game.
 * SECONDARY on purpose: a panel deck (PanelDeck), smaller type than the
 * stories. Every screen is a plain screenshot of the project's site — for
 * Crol, scrolled to its section on the mobile app Juan built, since the
 * card is about the app and not the site (2026-10-02).
 *
 * Job titles and project names stay as they are in every locale; roles
 * are keys. A screen opens the site it shows when clicked (`visit`).
 */

// Order is weight: the startup, the job, the game, then client work,
// oldest last.
export const PROJECTS: DeckItem[] = [
  {
    id: 'salvalo',
    slug: 'salvalo',
    name: 'Salvalo',
    meta: [[{ k: 'work.cofounder' }], ['2024', { k: 'work.present' }]],
    body: 'work.salvalo.body',
    clip: 'work.salvalo.body',
    image: '/media/work/salvalo.jpg',
    visit: 'https://salvalo.app',
    links: [
      { label: 'salvalo.app', href: 'https://salvalo.app' },
      {
        label: 'App Store',
        href: 'https://apps.apple.com/es/app/salvalo/id6759407790',
      },
      {
        label: 'Google Play',
        href: 'https://play.google.com/store/apps/details?id=com.grostify.salvalo',
      },
    ],
  },
  {
    id: 'crol',
    slug: 'crol-erp-movil',
    name: 'Crol ERP Móvil',
    meta: [['Lead Frontend Developer'], ['2022', { k: 'work.present' }]],
    body: { k: 'work.crol.body', links: { crol: 'https://www.crol.mx' } },
    clip: 'work.crol.body',
    image: '/media/work/crol.jpg',
    visit: 'https://www.crol.mx',
    links: [
      {
        label: 'App Store',
        href: 'https://apps.apple.com/mx/app/crol-erp-m%C3%B3vil/id6743251171',
      },
      {
        label: 'Google Play',
        href: 'https://play.google.com/store/apps/details?id=com.crolapp',
      },
    ],
  },
  // The easter egg, third (Juan, 2026-10-13): the Platanus arcade entry,
  // playable from its card (ArcadeCabinet). It was a panel of its own
  // until 2026-10-02, and More Work's last card until it moved up.
  {
    id: 'space-explorer',
    slug: 'space-explorer',
    name: 'Space Explorer',
    meta: [['Platanus Hack'], ['2026']],
    body: {
      k: 'arcade.p1',
      links: { platanus: 'https://hack.platan.us/26-ve' },
    },
    clip: 'arcade.p1',
    image: { slot: 'arcade' },
    scene: '/media/arcade/cover.png',
    // The submitted entry, on the challenge's own arcade page.
    links: [
      {
        label: 'hack.platan.us',
        href: 'https://hack.platan.us/26/arcade/space-explorer',
      },
    ],
  },
  {
    id: 'maktub',
    slug: 'maktub-art-fund',
    name: 'Maktub Art Fund',
    meta: [[{ k: 'work.freelance' }], ['2026']],
    body: 'work.maktub.body',
    clip: 'work.maktub.body',
    image: '/media/work/maktub.jpg',
    visit: 'https://maktubartfund.com',
    links: [{ label: 'maktubartfund.com', href: 'https://maktubartfund.com' }],
  },
  {
    id: 'andreina',
    slug: 'andreina-aular',
    name: 'Andreina Aular',
    meta: [[{ k: 'work.freelance' }], ['2021']],
    body: 'work.andreina.body',
    clip: 'work.andreina.body',
    image: '/media/work/andreina.jpg',
    visit: 'https://andreinaaular.com',
    links: [{ label: 'andreinaaular.com', href: 'https://andreinaaular.com' }],
  },
];
