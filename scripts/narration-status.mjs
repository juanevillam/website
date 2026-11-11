import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ui } from '../src/i18n/ui.ts';
import { SCRIPTS_ES } from '../src/lib/scripts.ts';

/**
 * THE RECORDING CHECKLIST — `npm run narration`.
 *
 * Every clip key the site narrates: its Spanish voice + 9:16 video + word
 * timings (the one voice), and its English and Chinese translations in
 * `src/i18n/ui.ts` (which read along sentence by sentence on the Spanish
 * clock). Also flags any narrated key on the page missing from `lib/scripts`.
 */
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const NARRATION_ES = path.join(ROOT, 'public/media/narration/es');
const DATA_NARRATION = path.join(SRC, 'data/narration');

const used = new Set();
const walk = dir => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const at = path.join(dir, f.name);
    if (f.isDirectory()) walk(at);
    else if (/\.(astro|ts)$/.test(f.name)) {
      const text = fs.readFileSync(at, 'utf8');
      for (const m of text.matchAll(/\bclip: '([a-z0-9.]+)'/g)) used.add(m[1]);
      for (const m of text.matchAll(
        /\b(?:clipFor|voiceAttrs|captionAttrs)\('([a-z0-9.]+)'/g,
      ))
        used.add(m[1]);
    }
  }
};
walk(path.join(SRC, 'components'));
walk(path.join(SRC, 'lib'));
const apps = fs.readFileSync(path.join(SRC, 'lib/apps.ts'), 'utf8');
for (const m of apps
  .slice(apps.indexOf('export const APPS'))
  .matchAll(/'([a-z]+\.(?:problem|solution|s\d\.p\d))'/g))
  used.add(m[1]);

const textKey = key =>
  key === 'hero' || key === 'footer' ? `${key}.caption` : key;

const keys = SCRIPTS_ES.map(c => c.key);
const counts = { es: 0, video: 0, en: 0, zh: 0 };
const cell = (ok, label) => `${ok ? '[x]' : '[ ]'} ${label}`.padEnd(16);

console.log(
  `key${' '.repeat(18)}${'es voice'.padEnd(16)}${'9:16 video'.padEnd(16)}${'en copy'.padEnd(16)}zh copy`,
);
for (const c of SCRIPTS_ES) {
  const tk = textKey(c.key);
  const voice =
    fs.existsSync(path.join(NARRATION_ES, `${c.key}.m4a`)) &&
    fs.existsSync(path.join(DATA_NARRATION, `${c.key}.words.json`));
  const video = fs.existsSync(path.join(NARRATION_ES, `${c.key}.mp4`));
  const en = Boolean(ui.en[tk]?.trim());
  const zh = Boolean(ui.zh[tk]?.trim());
  counts.es += Number(voice);
  counts.video += Number(video);
  counts.en += Number(en);
  counts.zh += Number(zh);
  console.log(
    `${c.key.padEnd(21)}${cell(voice, c.draft ? 're-record' : voice ? 'recorded' : 'missing')}${cell(video, video ? 'done' : 'missing')}${cell(en, en ? 'translated' : 'missing')}${cell(zh, zh ? 'translated' : 'missing')}` +
      (used.has(c.key) ? '' : '  (not on the page)'),
  );
}
console.log(
  `\nes voice ${counts.es}/${keys.length} · 9:16 video ${counts.video}/${keys.length} · en copy ${counts.en}/${keys.length} · zh copy ${counts.zh}/${keys.length}`,
);
const unscripted = [...used].filter(k => !keys.includes(k));
if (unscripted.length) {
  console.log(`\nOn the page with NO script: ${unscripted.join(', ')}`);
  process.exitCode = 1;
}
if (
  counts.es < keys.length ||
  counts.en < keys.length ||
  counts.zh < keys.length
) {
  process.exitCode = 1;
}
