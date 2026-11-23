import type { Locale } from '../i18n/ui';
import { applyOrder, savedPhotoOrder, savedPhotoRemoved } from './mediaOrder';

/**
 * PHOTOS (More of Me → /more-of-me/photos) — Juan's personal photo feed,
 * hosted directly on juanevillam.com so he never has to post to Instagram
 * again.
 *
 * Each post supports one or more media items (`.jpg`/`.webp` photos or `.mp4`
 * videos with audio), a date (`YYYY-MM-DD`), and a caption per locale
 * (`en`, `es`, `zh`).
 *
 * Likes and the Name + Email unlock gate are served by `/api/photos`
 * (Cloudflare Pages Function + D1 in production; `scripts/photos-api.mjs` +
 * `.astro/photos-store.json` in local `astro dev`).
 */
export type PhotoPost = {
  id: string;
  date: string;
  /** First item is the grid cover; `.mp4` items play with audio. */
  media: string[];
  caption: Record<Locale, string>;
  initialLikes: number;
};

const RAW_PHOTO_POSTS: PhotoPost[] = [
  {
    id: 'tachira',
    date: '2026-11-17',
    media: [
      '/media/likes/photos/tachira/1.webp',
      '/media/likes/photos/tachira/2.webp',
      '/media/likes/photos/tachira/3.webp',
      '/media/likes/photos/tachira/4.webp',
    ],
    caption: {
      en: 'táchira',
      es: 'táchira',
      zh: 'táchira',
    },
    initialLikes: 0,
  },
  {
    id: 'caracas',
    date: '2026-10-23',
    media: [
      '/media/likes/photos/caracas/1.webp',
      '/media/likes/photos/caracas/5.webp',
      '/media/likes/photos/caracas/6.webp',
      '/media/likes/photos/caracas/4.webp',
      '/media/events/startup-venezuela-summit/tripealo-team.jpg',
      '/media/likes/photos/caracas/3.webp',
      '/media/events/startup-venezuela-summit/victor-cardenas.jpg',
      '/media/events/startup-venezuela-summit/innoven-workshop.mp4',
      '/media/events/platanus-hack-caracas/team-talk.jpg',
      '/media/events/platanus-hack-caracas/mentor-session.mp4',
      '/media/events/platanus-hack-caracas/tridi-sketch.jpg',
      '/media/events/platanus-hack-caracas/pitch.jpg',
      '/media/events/platanus-hack-caracas/tridi-presentation.jpg',
      '/media/events/platanus-hack-caracas/group-photo.jpg',
    ],
    caption: {
      en: 'caracas',
      es: 'caracas',
      zh: 'caracas',
    },
    initialLikes: 0,
  },
  {
    id: 'andalusia',
    date: '2024-04-21',
    media: [
      '/media/likes/photos/andalusia/1.webp',
      '/media/likes/photos/andalusia/2.webp',
      '/media/likes/photos/andalusia/3.webp',
      '/media/likes/photos/andalusia/4.webp',
      '/media/likes/photos/andalusia/5.webp',
    ],
    caption: {
      en: 'andalusia',
      es: 'andalusia',
      zh: 'andalusia',
    },
    initialLikes: 0,
  },
  {
    id: 'aragon',
    date: '2024-03-29',
    media: [
      '/media/likes/photos/aragon/1.webp',
      '/media/likes/photos/aragon/2.webp',
      '/media/likes/photos/aragon/3.webp',
      '/media/likes/photos/aragon/4.webp',
    ],
    caption: {
      en: 'aragon',
      es: 'aragon',
      zh: 'aragon',
    },
    initialLikes: 0,
  },
  {
    id: 'prague',
    date: '2024-03-21',
    media: [
      '/media/likes/photos/prague/1.webp',
      '/media/likes/photos/prague/2.webp',
      '/media/likes/photos/prague/3.webp',
      '/media/likes/photos/prague/4.webp',
    ],
    caption: {
      en: 'prague',
      es: 'prague',
      zh: 'prague',
    },
    initialLikes: 0,
  },
  {
    id: 'berlin',
    date: '2024-03-18',
    media: [
      '/media/likes/photos/berlin/1.webp',
      '/media/likes/photos/berlin/2.webp',
      '/media/likes/photos/berlin/3.webp',
      '/media/likes/photos/berlin/4.webp',
    ],
    caption: {
      en: 'berlin',
      es: 'berlin',
      zh: 'berlin',
    },
    initialLikes: 0,
  },
  {
    id: 'madrid',
    date: '2024-02-23',
    media: [
      '/media/likes/photos/madrid/1.webp',
      '/media/likes/photos/madrid/2.webp',
      '/media/likes/photos/madrid/3.webp',
      '/media/likes/photos/madrid/4.webp',
    ],
    caption: {
      en: 'madrid',
      es: 'madrid',
      zh: 'madrid',
    },
    initialLikes: 0,
  },
];

export const PHOTO_POSTS: PhotoPost[] = RAW_PHOTO_POSTS.map(post => ({
  ...post,
  media: applyOrder(post.media, savedPhotoOrder(post.id), m => m, savedPhotoRemoved(post.id)),
}));

export const posterOf = (src: string) =>
  /\.mp4(\?|$)/.test(src) ? src.replace(/\.mp4(?=\?|$)/, '.jpg') : src;
