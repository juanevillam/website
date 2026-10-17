import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCRIPT_LANGS, scriptsFor } from '../src/lib/scripts.ts';

/**
 * THE RECORDING CHECKLIST — `npm run narration --workspace web`.
 *
 * Every clip key the landing narrates, by language: recorded with its
 * script (a `.vtt` beside the `.m4a`), an old recording from before the
 * scripts, or missing. Read from disk each run, so it is never stale.
 * It also names any key the page plays that has no script, and any
 * script the page no longer plays.
 */
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const NARRATION = path.join(ROOT, 'public/media/narration');

// The keys the page plays, found where they are named: a deck item's
// `clip: '…'` (lib/work, lib/events), a `clipFor('…')`, and the apps manifest's paragraphs.
const used = new Set();
const walk = dir => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const at = path.join(dir, f.name);
    if (f.isDirectory()) walk(at);
    else if (/\.(astro|ts)$/.test(f.name)) {
      const text = fs.readFileSync(at, 'utf8');
      for (const m of text.matchAll(/\bclip: '([a-z0-9.]+)'/g)) used.add(m[1]);
      for (const m of text.matchAll(/\b(?:clipFor|voiceAttrs)\('([a-z0-9.]+)'\)/g)) used.add(m[1]);
    }
  }
};
walk(path.join(SRC, 'components'));
walk(path.join(SRC, 'lib'));
const apps = fs.readFileSync(path.join(SRC, 'lib/apps.ts'), 'utf8');
for (const m of apps.slice(apps.indexOf('export const APPS')).matchAll(/'([a-z]+\.(?:problem|solution|s\d\.p\d))'/g))
  used.add(m[1]);

const state = (lang, key) => {
  const has = ext => fs.existsSync(path.join(NARRATION, lang, `${key}.${ext}`));
  return has('vtt') ? 'recorded' : has('m4a') ? 'old take' : 'missing';
};
const MARK = { recorded: '[x]', 'old take': '[~]', missing: '[ ]' };

const scripts = Object.fromEntries(SCRIPT_LANGS.map(l => [l, scriptsFor(l)]));
const keys = scripts.es.map(c => c.key);
const counts = Object.fromEntries(SCRIPT_LANGS.map(l => [l, 0]));

console.log(`key${' '.repeat(18)}${SCRIPT_LANGS.map(l => l.padEnd(15)).join('')}`);
for (const key of keys) {
  const cells = SCRIPT_LANGS.map(lang => {
    const s = state(lang, key);
    if (s === 'recorded') counts[lang]++;
    const draft = scripts[lang].find(c => c.key === key).draft ? '*' : ' ';
    return `${MARK[s]}${draft}${s}`.padEnd(15);
  });
  console.log(`${key.padEnd(21)}${cells.join('')}${used.has(key) ? '' : '  (not on the page)'}`);
}
console.log(
  `\n${SCRIPT_LANGS.map(l => `${l} ${counts[l]}/${keys.length}`).join(' · ')} recorded with a script` +
    '\n[x] recorded  [~] old take, no script timing  [ ] missing  * script is a draft',
);
const unscripted = [...used].filter(k => !keys.includes(k));
if (unscripted.length) {
  console.log(`\nOn the page with NO script: ${unscripted.join(', ')}`);
  process.exitCode = 1;
}
