import fs from 'node:fs';
import path from 'node:path';

/**
 * Juan's narration — ONE VOICE, SUBTITLED IN THE PAGE'S LANGUAGE.
 *
 * Every paragraph has one clip, in Spanish, found by convention rather
 * than listed anywhere:
 *
 *   public/media/narration/es/{paragraph key}.m4a
 *   e.g. public/media/narration/es/shaper.s1.p1.m4a
 *
 * The hero's personal intro has no paragraph on screen; its clip is
 * simply `hero.m4a`.
 *
 * SPANISH ONLY, BY DECISION (Juan, 2026-10-17): recording the whole page
 * again in English and in Chinese would cost the time the apps need, so
 * a visitor reading in English or Chinese hears the same Spanish voice
 * with subtitles in their language, the way a subtitled film works. The
 * English and Chinese takes recorded before that decision were dropped.
 *
 * Per paragraph so a bad take costs one sentence, not a whole slide, and
 * so the page always knows WHICH paragraph is being spoken.
 */
export const SUBTITLE_LANGS = ['es', 'en', 'zh'] as const;
export type SubtitleLang = (typeof SUBTITLE_LANGS)[number];

// Astro runs with the app as its working directory, in dev and in build.
const PUBLIC = path.join(process.cwd(), 'public');
const DIR = 'media/narration/es';

/** The clip recorded for one paragraph, or null when there is none. */
export const clipFor = (key: string): string | null => {
  const url = `/${DIR}/${key}.m4a`;
  return fs.existsSync(path.join(PUBLIC, url)) ? url : null;
};

/**
 * SUBTITLES — what Juan actually SAYS, which is looser than the paragraph
 * on screen, beside each clip:
 *
 *   {key}.vtt     the take's own transcript, in Spanish
 *   {key}.en.vtt  the same cues' words in English, on the same clock
 *   {key}.zh.vtt  and in Chinese
 *
 * A translation keeps the Spanish timings: it is the subtitle of the same
 * voice. Resolved at build time and embedded, so the page never fetches
 * them.
 */
export type Subs = {
  phrases: string[];
  /** Start of each phrase in seconds. */
  times: number[];
};

const seconds = (stamp: string) =>
  stamp
    .trim()
    .split(':')
    .reduce((sum, part) => sum * 60 + parseFloat(part), 0);

const parseVtt = (vtt: string): Subs => {
  const phrases: string[] = [];
  const times: number[] = [];
  for (const cue of vtt.split(/\r?\n\r?\n/)) {
    const lines = cue.split(/\r?\n/);
    const at = lines.findIndex(l => l.includes('-->'));
    if (at < 0) continue;
    const text = lines
      .slice(at + 1)
      .join(' ')
      .trim();
    if (!text) continue;
    times.push(seconds(lines[at].split('-->')[0]));
    phrases.push(text);
  }
  return { phrases, times };
};

const readSubs = (lang: SubtitleLang, key: string): Subs | undefined => {
  const file = path.join(
    PUBLIC,
    DIR,
    lang === 'es' ? `${key}.vtt` : `${key}.${lang}.vtt`,
  );
  return fs.existsSync(file)
    ? parseVtt(fs.readFileSync(file, 'utf8'))
    : undefined;
};

/** A narrated paragraph's data attributes — its clip, and its subtitles
 *  in every language, for the director (scripts/director.ts). */
export const voiceAttrs = (key: string) => {
  const attrs: Record<string, string | undefined> = {
    'data-clip': clipFor(key) ?? undefined,
  };
  for (const lang of SUBTITLE_LANGS) {
    const subs = readSubs(lang, key);
    attrs[`data-subs-${lang}`] = subs?.phrases.length
      ? JSON.stringify(subs)
      : undefined;
  }
  return attrs;
};
