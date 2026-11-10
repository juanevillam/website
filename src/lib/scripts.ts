/**
 * THE NARRATION SCRIPTS — what each clip has to SAY, one entry per clip
 * key (see lib/narration). Read only by the dev teleprompter (pages/dev);
 * nothing on the public page imports this file.
 *
 * ONE CONTINUOUS PARAGRAPH PER TAKE (Juan, 2026-11-06): each clip shows
 * as a single complete paragraph in the teleprompter so Juan can narrate
 * at his own natural pace from start to finish without clicking through
 * "next idea" buttons.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ui } from '../i18n/ui.ts';

const latestTranslatedEn = (key: string): string | null => {
  try {
    const p = path.join(
      process.cwd(),
      'narration-takes/es',
      `${key}.latest.json`,
    );
    if (!fs.existsSync(p)) return null;
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    return typeof data?.en === 'string' && data.en.trim()
      ? data.en.trim()
      : null;
  } catch {
    return null;
  }
};

export type ScriptLang = 'es' | 'en' | 'zh';
export const SCRIPT_LANGS: ScriptLang[] = ['es', 'en', 'zh'];

export type ScriptClip = {
  key: string;
  /** Where it plays on the page, as the teleprompter's heading. */
  where: string;
  /** What a visitor sees while it plays, when that is a screenshot. */
  shot?: string;
  /** The full paragraph to narrate (single element array for recorder compatibility). */
  ideas: string[];
  /** Why this script is not ready to record from yet, when it is not. */
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
    : key) as keyof typeof ui.en;

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

  // Events
  { key: 'events.platanus.body', where: 'Eventos · Platanus Hack 26 Caracas' },
  { key: 'events.summit.body', where: 'Eventos · Startup Venezuela Summit' },
  { key: 'events.panal.body', where: 'Eventos · El Panal' },
  { key: 'events.radio.body', where: 'Eventos · Entrevista en OK 101.5' },
  { key: 'events.ilc.body', where: 'Eventos · Charla con Pedro Vallenilla' },
  { key: 'events.alegria.body', where: 'Eventos · Hackathon de AlegrIA' },

  // More Work
  { key: 'arcade.p1', where: 'Más proyectos · Space Explorer' },
  { key: 'work.salvalo.body', where: 'Más proyectos · Salvalo' },
  { key: 'work.crol.body', where: 'Más proyectos · Crol ERP Móvil' },
  { key: 'work.maktub.body', where: 'Más proyectos · Maktub Art Fund' },

  // More of Me (pages/things-i-like)
  { key: 'likes.cosmos.body', where: 'Más de mí · Cosmos' },
  { key: 'likes.songs.body', where: 'Más de mí · Canciones' },

  // Footer
  { key: 'footer', where: 'Despedida' },
];

export const SCRIPTS_ES: ScriptClip[] = CLIPS.map(
  ({ key, where, shot, draft }) => ({
    key,
    where,
    shot,
    draft,
    ideas: [clean(ui.es[textKey(key)])],
  }),
);

export const SCRIPTS_EN: ScriptClip[] = CLIPS.map(
  ({ key, where, shot, draft }) => ({
    key,
    where,
    shot,
    draft,
    ideas: [latestTranslatedEn(key) ?? clean(ui.en[textKey(key)])],
  }),
);

export const SCRIPTS_ZH: ScriptClip[] = CLIPS.map(
  ({ key, where, shot, draft }) => ({
    key,
    where,
    shot,
    draft,
    ideas: [clean(ui.zh[textKey(key)])],
  }),
);

/** Every clip's script in one language. */
export const scriptsFor = (lang: ScriptLang): ScriptClip[] =>
  lang === 'en' ? SCRIPTS_EN : lang === 'zh' ? SCRIPTS_ZH : SCRIPTS_ES;
