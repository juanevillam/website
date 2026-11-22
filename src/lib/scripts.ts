/**
 * THE NARRATION SCRIPTS — what each clip covers, one entry per clip key
 * (see lib/narration). Read only by the dev teleprompter (pages/dev),
 * `/dev/todos`, `scripts/narration-status.mjs`, and `scripts/backup-media.mjs`;
 * nothing on the public page imports this file.
 *
 * SPANISH + ENGLISH (Juan, 2026-11-22): audio and 9:16 video are recorded in
 * Spanish (`public/media/narration/es/`) and English (`public/media/narration/en/`).
 * Recording a Spanish take in `/dev/teleprompter` translates it immediately so
 * Juan can record the matching English take right after.
 */
import { ui } from '../i18n/ui.ts';

export type ScriptClip = {
  key: string;
  /** Where it plays on the page, as the teleprompter's heading. */
  where: string;
  /** What a visitor sees while it plays, when that is a screenshot. */
  shot?: string;
  /** The full paragraph/idea prompt to narrate in Spanish. */
  ideas: string[];
  /** Why this script is pending recording or re-recording, when it is. */
  draft?: string;
};

const shot = (app: string, name: string) => `/media/${app}/${name}.webp`;

/** Strip inline markdown link tags `[label](id)` so the teleprompter reads cleanly. */
const clean = (text: string) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

/** A clip's paragraph key in i18n/ui: the hero and the footer have no
 *  paragraph on screen, only their captions. */
const textKey = (key: string) =>
  (key === 'hero' || key === 'footer'
    ? `${key}.caption`
    : key) as keyof typeof ui.es;

const CLIPS: Array<{
  key: string;
  where: string;
  shot?: string;
  draft?: string;
}> = [
  { key: 'hero', where: 'Inicio' },

  // Sound Shaper
  { key: 'shaper.problem', where: 'Sound Shaper · el problema' },
  { key: 'shaper.solution', where: 'Sound Shaper · la idea' },
  {
    key: 'shaper.s1.p1',
    where: 'Sound Shaper · Library (1)',
    shot: shot('shaper', 'ios-dark-home'),
  },
  {
    key: 'shaper.s1.p2',
    where: 'Sound Shaper · Library (2)',
    shot: shot('shaper', 'ios-dark-home'),
  },
  {
    key: 'shaper.s2.p1',
    where: 'Sound Shaper · Player (1)',
    shot: shot('shaper', 'ios-dark-player'),
  },
  {
    key: 'shaper.s2.p2',
    where: 'Sound Shaper · Player (2)',
    shot: shot('shaper', 'ios-dark-player'),
  },
  {
    key: 'shaper.s3.p1',
    where: 'Sound Shaper · Shape (1)',
    shot: shot('shaper', 'ios-dark-shape'),
  },
  {
    key: 'shaper.s3.p2',
    where: 'Sound Shaper · Shape (2)',
    shot: shot('shaper', 'ios-dark-shape'),
  },
  {
    key: 'shaper.s4.p1',
    where: 'Sound Shaper · Clips (1)',
    shot: shot('shaper', 'ios-dark-clip'),
  },
  {
    key: 'shaper.s4.p2',
    where: 'Sound Shaper · Clips (2)',
    shot: shot('shaper', 'ios-dark-clip'),
  },

  // Highlights (Space Explorer + Events)
  { key: 'arcade.p1', where: 'Destacados · Space Explorer' },
  {
    key: 'events.platanus.body',
    where: 'Destacados · Startup Summit & Platanus Hack',
  },
  { key: 'events.alegria.body', where: 'Destacados · AlegrIA Hackathon' },

  // More of Me (pages/more-of-me)
  { key: 'likes.cosmos.body', where: 'Más de mí · Cosmos' },
  { key: 'likes.songs.body', where: 'Más de mí · Canciones' },
  { key: 'likes.photos.body', where: 'Más de mí · Fotos' },

  // Footer
  { key: 'footer', where: 'Despedida' },
];

const buildScripts = (lang: 'es' | 'en'): ScriptClip[] =>
  CLIPS.map(({ key, where, shot, draft }) => ({
    key,
    where,
    shot,
    draft,
    ideas: [clean(ui[lang][textKey(key)] ?? '')].filter(Boolean),
  }));

export const SCRIPTS_ES: ScriptClip[] = buildScripts('es');
export const SCRIPTS_EN: ScriptClip[] = buildScripts('en');

export const scriptsFor = (lang: 'es' | 'en' = 'es'): ScriptClip[] =>
  lang === 'en' ? SCRIPTS_EN : SCRIPTS_ES;
