import fs from 'node:fs';
import path from 'node:path';

/**
 * Juan's narration — ONE CLIP PER PARAGRAPH, per language, found by
 * convention rather than listed anywhere:
 *
 *   public/media/narration/{en,es}/{paragraph key}.m4a
 *   e.g. public/media/narration/es/shaper.s1.p1.m4a
 *
 * The hero's personal intro has no paragraph on screen; its clip is
 * simply `hero.m4a`.
 *
 * Per paragraph so a bad take costs one sentence, not a whole slide, and
 * so the page always knows WHICH paragraph is being spoken. Drop a file
 * in and rebuild — the player appears for any block that has a clip.
 *
 * Chinese has no recording of its own; zh readers hear the English clip
 * under the Chinese transcript.
 */
export const NARRATION_LANGS = ['en', 'es'] as const;
export type NarrationLang = (typeof NARRATION_LANGS)[number];
export type Clip = Partial<Record<NarrationLang, string>>;

// Astro runs with the app as its working directory, in dev and in build.
const PUBLIC = path.join(process.cwd(), 'public');

const find = (lang: NarrationLang, key: string) => {
  const url = `/media/narration/${lang}/${key}.m4a`;
  return fs.existsSync(path.join(PUBLIC, url)) ? url : undefined;
};

/** The clips recorded for one paragraph, or null when there are none. */
export const clipFor = (key: string): Clip | null => {
  const clip: Clip = {};
  for (const lang of NARRATION_LANGS) {
    const url = find(lang, key);
    if (url) clip[lang] = url;
  }
  return Object.keys(clip).length ? clip : null;
};
