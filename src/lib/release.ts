import UNRELEASED from '../data/unreleased.json';

/**
 * NOT YET RELEASED (Juan, 2026-10-27) — what is built and kept but not
 * published: src/data/unreleased.json names it. Under `astro dev` it all
 * shows, so it can be worked on; a production build leaves it out — no
 * card, no page, no link to it — and drops its media from the deploy
 * (astro.config.mjs), so nothing of it can be reached. Releasing it is
 * taking it out of that file.
 */
const preview = import.meta.env.DEV;

/** Whether an event card (lib/events, by its id) is on the site. */
export const eventShown = (id: string) =>
  preview || !(UNRELEASED.events as string[]).includes(id);

/** Whether More of Me (pages/things-i-like) is on the site. */
export const likesShown = preview || !UNRELEASED.likes;

/** Whether More of Me's Songs card (lib/likes) is on the site: held back
 *  till Juan records its take, its music with it (`media`). */
export const songsShown = preview || !UNRELEASED.songs;
