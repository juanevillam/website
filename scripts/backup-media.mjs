// Backs up everything the site is made of that is NOT code — the code is on
// GitHub — to iCloud Drive's Life folder (Juan, 2026-10-27), so the media is
// kept safe the way the code is: npm run backup.
//
//   <to>/
//     media/          every picture, video and narration clip the site serves
//                     (public/media), at the quality it ships
//     narration/
//       takes/        Juan's raw takes as recorded, and the clips they
//                     replaced (narration-takes/, never in git)
//       transcripts/  each clip's subtitles (.vtt) and word timings (.json)
//     texts/          every line of the site in each language (en.md, es.md,
//                     zh.md) and the narration scripts (scripts.md)
//     masters/        the originals at full quality — the 4K videos, the
//                     HEICs, the screenshots — from this repo's `masters/`
//                     folder (gitignored: far too big for git), by event
//
// It MIRRORS: a file changed on the site is copied again, one removed from
// the site is removed from the backup — except `masters/`, which only ever
// gains files: an original is never deleted from the backup. BACKUP_DIR
// points elsewhere. (The space photos, paintings and game screenshots'
// originals already live in iCloud Drive's Life folder, where `npm run
// likes` reads them; they are not copied twice.)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { build } from 'esbuild';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const TO =
  process.env.BACKUP_DIR ??
  path.join(os.homedir(), 'Library/Mobile Documents/com~apple~CloudDocs/Life/juanevillam-website');

const mirror = (from, to, { keep = false } = {}) => {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  // rsync: only what changed; --delete keeps the copy an exact mirror,
  // except where it must keep everything (`keep`, the originals).
  const flags = ['-a', '--exclude', '.DS_Store', ...(keep ? [] : ['--delete'])];
  execFileSync('rsync', [...flags, `${from}/`, `${to}/`], { stdio: 'inherit' });
};

// ---------- media and narration ----------
mirror(path.join(ROOT, 'public/media'), path.join(TO, 'media'));
mirror(path.join(ROOT, 'narration-takes'), path.join(TO, 'narration/takes'));
const transcripts = path.join(TO, 'narration/transcripts');
fs.rmSync(transcripts, { recursive: true, force: true });
fs.mkdirSync(transcripts, { recursive: true });
for (const dir of ['public/media/narration/es', 'src/data/narration'])
  for (const f of fs.readdirSync(path.join(ROOT, dir)))
    if (/\.(vtt|json)$/.test(f)) fs.copyFileSync(path.join(ROOT, dir, f), path.join(transcripts, f));

// ---------- texts ----------
// The strings and scripts are TypeScript: bundled for Node on the fly.
const load = async file => {
  const out = path.join(os.tmpdir(), `backup-${path.basename(file)}.mjs`);
  await build({ entryPoints: [path.join(ROOT, file)], bundle: true, platform: 'node', format: 'esm', outfile: out, logLevel: 'error' });
  return import(`file://${out}?${Date.now()}`);
};
const { ui, locales } = await load('src/i18n/ui.ts');
const { SCRIPTS_ES } = await load('src/lib/scripts.ts');

const texts = path.join(TO, 'texts');
fs.mkdirSync(texts, { recursive: true });
for (const l of locales) {
  // Grouped by the key's first part — hero, shaper, work, events, likes…
  const groups = {};
  for (const [key, value] of Object.entries(ui[l])) (groups[key.split('.')[0]] ??= []).push([key, value]);
  const md = [`# juanevillam.com — ${l}`, ''];
  for (const [group, entries] of Object.entries(groups)) {
    md.push(`## ${group}`, '');
    for (const [key, value] of entries) md.push(`**${key}**`, '', value, '');
  }
  fs.writeFileSync(path.join(texts, `${l}.md`), md.join('\n'));
}
const scripts = ['# Narration scripts — the ideas each clip covers', ''];
for (const clip of SCRIPTS_ES) {
  scripts.push(`## ${clip.where}`, '', `\`${clip.key}\``, '');
  for (const idea of clip.ideas) scripts.push(`- ${idea}`);
  scripts.push('');
}
fs.writeFileSync(path.join(texts, 'scripts.md'), scripts.join('\n'));

mirror(path.join(ROOT, 'masters'), path.join(TO, 'masters'), { keep: true });
const size = execFileSync('du', ['-sh', TO]).toString().split('\t')[0];
console.log(`Backed up to ${TO} (${size})`);
