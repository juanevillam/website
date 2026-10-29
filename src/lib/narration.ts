import fs from 'node:fs';
import path from 'node:path';

import { locales, type Locale, ui, type UIKey } from '../i18n/ui';
import { plainText, type ReadMark, readTokens } from './readAlong';

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
// Astro runs with the app as its working directory, in dev and in build.
const PUBLIC = path.join(process.cwd(), 'public');

/**
 * HIS OWN VOICE IN EACH LANGUAGE, AS IT ARRIVES (Juan, 2026-10-29): he
 * records English, read from the page's own English (lib/scripts), and
 * may record Chinese. A paragraph with a clip in the page's language plays
 * it, read along word by word on its own clock; one without plays the
 * Spanish, read along on the Spanish clock as before. So a language's
 * voice can arrive a paragraph at a time.
 */
export const clipFor = (key: string, lang: Locale = 'es'): string | null => {
  const url = `/media/narration/${lang}/${key}.m4a`;
  return fs.existsSync(path.join(PUBLIC, url)) ? url : null;
};

/**
 * READ-ALONG TIMINGS (Juan, 2026-10-17) — the paragraph on screen IS the
 * take's transcript, tidied (repeats and filler taken out), so each of its
 * words can light up as it is said. Beside each clip, the words of the take
 * with when each one starts, from whisper.cpp:
 *
 *   src/data/narration/{key}.words.json   [{ "w": "Escuchaba", "t": 0.42 }, …]
 *
 * Spanish is timed word by word: the paragraph's words are aligned to the
 * spoken ones (a longest common subsequence over normalised words), and a
 * word the take never says exactly takes the time between its neighbours.
 * English and Chinese are translations, so they are timed SENTENCE by
 * sentence on the Spanish clock — written with the same sentences in the
 * same order — and a sentence's words share its span by length. A
 * translation whose sentences don't line up falls back to the whole clip.
 *
 * Emitted as data-read-{lang}: [character offset, start] per word, which
 * the director joins to the words it wraps (lib/readAlong).
 */
const DATA = path.join(process.cwd(), 'src/data/narration');

type Spoken = { w: string; t: number };

/** Spanish keeps its original name; another language's take is
 *  `{key}.{lang}.words.json` (scripts/narration-recorder). */
const spokenWords = (key: string, lang: Locale = 'es'): Spoken[] | undefined => {
  const file = path.join(DATA, lang === 'es' ? `${key}.words.json` : `${key}.${lang}.words.json`);
  return fs.existsSync(file)
    ? (JSON.parse(fs.readFileSync(file, 'utf8')) as Spoken[])
    : undefined;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^\p{L}\p{N}]/gu, '');

/** Each shown word's start, aligned to the spoken words. */
const alignTimes = (shown: string[], spoken: Spoken[]): number[] => {
  const a = shown.map(norm);
  const b = spoken.map(s => norm(s.w));
  const n = a.length;
  const m = b.length;
  // Longest common subsequence, then walked back for the pairs.
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] =
        a[i] && a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const times: (number | undefined)[] = new Array(n).fill(undefined);
  for (let i = 0, j = 0; i < n && j < m; ) {
    if (a[i] && a[i] === b[j]) {
      times[i] = spoken[j].t;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  // A word never said exactly (or punctuation on its own) takes the time
  // between the matched words around it.
  const end = spoken.at(-1)?.t ?? 0;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    if (times[i] !== undefined) {
      out.push(times[i]!);
      continue;
    }
    let prev = i - 1;
    while (prev >= 0 && times[prev] === undefined) prev--;
    let next = i + 1;
    while (next < n && times[next] === undefined) next++;
    const from = prev >= 0 ? times[prev]! : 0;
    const to = next < n ? times[next]! : end;
    out.push(from + ((to - from) * (i - prev)) / (next - prev));
  }
  return out;
};

const ENDS = /[.?!…。？！]$/;

/** Token indices where each sentence starts. */
const sentenceStarts = (tokens: { text: string }[]) => {
  const starts = [0];
  tokens.forEach((tk, i) => {
    if (ENDS.test(tk.text) && i + 1 < tokens.length) starts.push(i + 1);
  });
  return starts;
};

const round = (t: number) => Math.round(t * 100) / 100;

export const readTimings = (
  key: string,
  /** The text read along, when it is not the clip's own key — a caption
   *  under a block whose clip has no paragraph (the hero's, the footer's). */
  textKey: string = key,
): Record<Locale, ReadMark[]> | undefined => {
  const spoken = spokenWords(key);
  if (!spoken?.length || !(textKey in ui.es)) return undefined;
  const end = spoken.at(-1)!.t + 0.4;
  const text = (l: Locale) => plainText(ui[l][textKey as UIKey]);

  const esTokens = readTokens(text('es'));
  const esTimes = alignTimes(
    esTokens.map(t => t.text),
    spoken,
  );
  const esStarts = sentenceStarts(esTokens);
  const spans = esStarts.map((s, i) => [
    esTimes[s],
    i + 1 < esStarts.length ? esTimes[esStarts[i + 1]] : end,
  ]);

  const out = {
    es: esTokens.map((t, i) => [t.at, round(esTimes[i])]),
  } as Record<Locale, ReadMark[]>;
  for (const l of locales) {
    if (l === 'es') continue;
    const tokens = readTokens(text(l));
    // Its own voice: its words on its own clock, like Spanish.
    const own = clipFor(key, l) ? spokenWords(key, l) : undefined;
    if (own?.length) {
      const times = alignTimes(
        tokens.map(t => t.text),
        own,
      );
      out[l] = tokens.map((t, i) => [t.at, round(times[i])]);
      continue;
    }
    const starts = sentenceStarts(tokens);
    const groups =
      starts.length === spans.length
        ? starts.map((s, i) => ({
            from: s,
            to: i + 1 < starts.length ? starts[i + 1] : tokens.length,
            span: spans[i],
          }))
        : [{ from: 0, to: tokens.length, span: [esTimes[0] ?? 0, end] }];
    out[l] = [];
    for (const g of groups) {
      const words = tokens.slice(g.from, g.to);
      const total = words.reduce((sum, w) => sum + w.text.length, 0) || 1;
      let before = 0;
      for (const w of words) {
        const [from, to] = g.span;
        out[l].push([w.at, round(from + ((to - from) * before) / total)]);
        before += w.text.length;
      }
    }
  }
  return out;
};

/** A narrated paragraph's data attributes — its clip, and when each of its
 *  words is said in every language, for the director (scripts/director.ts). */
export const voiceAttrs = (key: string) => {
  const attrs: Record<string, string | undefined> = {
    'data-clip': clipFor(key) ?? undefined,
  };
  for (const l of locales)
    if (l !== 'es') attrs[`data-clip-${l}`] = clipFor(key, l) ?? undefined;
  const timings = readTimings(key);
  for (const l of locales)
    attrs[`data-read-${l}`] = timings ? JSON.stringify(timings[l]) : undefined;
  return attrs;
};

/**
 * A CAPTION'S timings (Juan, 2026-10-17): the hero and the footer carry a
 * clip with no paragraph on screen, so their words stand in a caption under
 * the narrator instead — three lines at most, shown only while the voice
 * plays. Same read-along as a paragraph, timed on the block's own clip.
 */
export const captionAttrs = (clipKey: string, textKey: string) => {
  const timings = readTimings(clipKey, textKey);
  const attrs: Record<string, string | undefined> = {};
  for (const l of locales)
    attrs[`data-read-${l}`] = timings ? JSON.stringify(timings[l]) : undefined;
  return attrs;
};

/**
 * Songs a take introduces — a demo of Sound Shaper playing one while Juan
 * shapes it. The demo is a SCREEN RECORDING with the app's own sound
 * (2026-10-17; it used to be the song played through the microphone at
 * the end of the take, cut off since). The paragraph shows the song as a
 * line of its own (a note, the title, who it is by); tapped, or when the
 * voice finishes the paragraph, the recording plays over the page
 * (SongDemo.astro).
 */
export const SONGS: Record<
  string,
  {
    title: string;
    by: string;
    video: string;
    poster: string;
    width: number;
    height: number;
  }
> = {
  'shaper.s3.p2': {
    title: 'DÁKITI',
    by: 'Bad Bunny, Jhayco',
    video: '/media/shaper/demo.mp4',
    poster: '/media/shaper/demo-poster.jpg',
    width: 590,
    height: 1278,
  },
};
