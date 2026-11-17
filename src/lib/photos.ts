import type { Locale } from '../i18n/ui';

/**
 * PHOTOS (More of Me → /more-of-me/photos) — Juan's personal Instagram feed,
 * hosted directly on juanevillam.com so he never has to post to Instagram
 * again.
 *
 * Each post supports one or more media items (`.jpg`/`.webp` photos or `.mp4`
 * videos with audio), a location, a date (`YYYY-MM-DD`), and a caption per
 * locale (`en`, `es`, `zh`).
 *
 * Likes, comments, and the Name + Email unlock gate are served by `/api/photos`
 * (Cloudflare Pages Function + D1 in production; `scripts/photos-api.mjs` +
 * `src/data/photos-store.json` in local `astro dev`).
 */
export type PhotoComment = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

export type PhotoPost = {
  id: string;
  date: string;
  location: string;
  /** First item is the grid cover; `.mp4` items play with audio. */
  media: string[];
  caption: Record<Locale, string>;
  initialLikes: number;
  initialComments: PhotoComment[];
};

export const PHOTO_POSTS: PhotoPost[] = [
  {
    id: 'madrid',
    date: '2024-02-23',
    location: 'Madrid, Spain',
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
    initialComments: [],
  },
  {
    id: 'berlin',
    date: '2024-03-18',
    location: 'Berlin, Germany',
    media: [
      '/media/likes/photos/berlin/3.webp',
      '/media/likes/photos/berlin/2.webp',
      '/media/likes/photos/berlin/1.webp',
      '/media/likes/photos/berlin/4.webp',
    ],
    caption: {
      en: 'berlin',
      es: 'berlin',
      zh: 'berlin',
    },
    initialLikes: 0,
    initialComments: [],
  },
  {
    id: 'aragon',
    date: '2024-03-29',
    location: 'Aragon, Spain',
    media: [
      '/media/likes/photos/aragon/1.webp',
      '/media/likes/photos/aragon/2.webp',
      '/media/likes/photos/aragon/3.webp',
    ],
    caption: {
      en: 'aragon',
      es: 'aragon',
      zh: 'aragon',
    },
    initialLikes: 0,
    initialComments: [],
  },
  {
    id: 'andalusia',
    date: '2024-04-21',
    location: 'Andalusia, Spain',
    media: [
      '/media/likes/photos/andalusia/1.webp',
      '/media/likes/photos/andalusia/2.webp',
      '/media/likes/photos/andalusia/3.webp',
    ],
    caption: {
      en: 'andalusia',
      es: 'andalusia',
      zh: 'andalusia',
    },
    initialLikes: 0,
    initialComments: [],
  },
];

export const posterOf = (src: string) =>
  src.endsWith('.mp4') ? src.replace(/\.mp4$/, '.jpg') : src;
