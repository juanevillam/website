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

/**
 * SUBTITLES — what Juan actually SAYS, which is looser than the paragraph
 * on screen. Beside each clip, per language:
 *
 *   {key}.vtt  WebVTT, exact timings — wins when present
 *   {key}.txt  plain text; one phrase per line, or unbroken prose that is
 *              split into phrases here and timed by length on the page
 *
 * Resolved at build time and embedded, so the page never fetches them.
 */
export type Subs = {
  phrases: string[];
  /** Start of each phrase in seconds (VTT only); absent → timed by length. */
  times?: number[];
};

/** Longest phrase the pill shows before it is split. */
const PHRASE_MAX = 64;

const splitPhrases = (text: string): string[] => {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);
  if (lines.length > 1) return lines;
  const out: string[] = [];
  for (const sentence of text.match(/[^.!?…]+[.!?…]*/g) ?? [text]) {
    let rest = sentence.trim();
    while (rest.length > PHRASE_MAX) {
      // Break at a clause first, a word second, never mid-word.
      let cut = Math.max(
        rest.lastIndexOf(', ', PHRASE_MAX),
        rest.lastIndexOf(' — ', PHRASE_MAX),
        rest.lastIndexOf('; ', PHRASE_MAX),
      );
      if (cut < PHRASE_MAX * 0.4) cut = rest.lastIndexOf(' ', PHRASE_MAX);
      if (cut <= 0) cut = PHRASE_MAX;
      out.push(rest.slice(0, cut + 1).trim());
      rest = rest.slice(cut + 1).trim();
    }
    if (rest) out.push(rest);
  }
  return out;
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

const readSubs = (lang: NarrationLang, key: string): Subs | undefined => {
  const base = path.join(PUBLIC, 'media/narration', lang, key);
  if (fs.existsSync(`${base}.vtt`))
    return parseVtt(fs.readFileSync(`${base}.vtt`, 'utf8'));
  if (fs.existsSync(`${base}.txt`))
    return { phrases: splitPhrases(fs.readFileSync(`${base}.txt`, 'utf8')) };
  return undefined;
};

/** Subtitles per language for one clip, as data attributes' JSON. */
export const subsFor = (key: string) => {
  const subs: Partial<Record<NarrationLang, string>> = {};
  for (const lang of NARRATION_LANGS) {
    const found = readSubs(lang, key);
    if (found?.phrases.length) subs[lang] = JSON.stringify(found);
  }
  return subs;
};
