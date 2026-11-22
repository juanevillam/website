import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ui } from '../src/i18n/ui.ts';
import { SCRIPTS_ES } from '../src/lib/scripts.ts';

/**
 * THE RECORDING CHECKLIST — `npm run narration`.
 *
 * Every clip key the site narrates: its Spanish and English voice + 9:16
 * video + word timings, plus English and Chinese copy in `src/i18n/ui.ts`.
 * Also flags any narrated key on the page missing from `lib/scripts`.
 */
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const NARRATION_ES = path.join(ROOT, 'public/media/narration/es');
const NARRATION_EN = path.join(ROOT, 'public/media/narration/en');
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
const counts = { es: 0, esVid: 0, en: 0, enVid: 0, enCopy: 0, zhCopy: 0 };
const cell = (ok, label) => `${ok ? '[x]' : '[ ]'} ${label}`.padEnd(14);

console.log(
  `key${' '.repeat(18)}${'es voice'.padEnd(14)}${'es 9:16'.padEnd(14)}${'en voice'.padEnd(14)}${'en 9:16'.padEnd(14)}${'en copy'.padEnd(14)}zh copy`,
);
for (const c of SCRIPTS_ES) {
  const tk = textKey(c.key);
  const esVoice =
    fs.existsSync(path.join(NARRATION_ES, `${c.key}.m4a`)) &&
    fs.existsSync(path.join(DATA_NARRATION, `${c.key}.words.json`));
  const esVideo = fs.existsSync(path.join(NARRATION_ES, `${c.key}.mp4`));
  const enVoice =
    fs.existsSync(path.join(NARRATION_EN, `${c.key}.m4a`)) &&
    fs.existsSync(path.join(DATA_NARRATION, `${c.key}.en.words.json`));
  const enVideo = fs.existsSync(path.join(NARRATION_EN, `${c.key}.mp4`));
  const enCopy = Boolean(ui.en[tk]?.trim());
  const zhCopy = Boolean(ui.zh[tk]?.trim());
  counts.es += Number(esVoice);
  counts.esVid += Number(esVideo);
  counts.en += Number(enVoice);
  counts.enVid += Number(enVideo);
  counts.enCopy += Number(enCopy);
  counts.zhCopy += Number(zhCopy);
  console.log(
    `${c.key.padEnd(21)}${cell(esVoice, c.draft ? 're-record' : esVoice ? 'recorded' : 'missing')}${cell(esVideo, esVideo ? 'done' : 'missing')}${cell(enVoice, enVoice ? 'recorded' : 'missing')}${cell(enVideo, enVideo ? 'done' : 'missing')}${cell(enCopy, enCopy ? 'ready' : 'missing')}${cell(zhCopy, zhCopy ? 'ready' : 'missing')}` +
      (used.has(c.key) ? '' : '  (not on the page)'),
  );
}
console.log(
  `\nes voice ${counts.es}/${keys.length} · es 9:16 ${counts.esVid}/${keys.length} · en voice ${counts.en}/${keys.length} · en 9:16 ${counts.enVid}/${keys.length} · en copy ${counts.enCopy}/${keys.length} · zh copy ${counts.zhCopy}/${keys.length}`,
);
const unscripted = [...used].filter(k => !keys.includes(k));
if (unscripted.length) {
  console.log(`\nOn the page with NO script: ${unscripted.join(', ')}`);
  process.exitCode = 1;
}
if (
  counts.es < keys.length ||
  counts.enCopy < keys.length ||
  counts.zhCopy < keys.length
) {
  process.exitCode = 1;
}
