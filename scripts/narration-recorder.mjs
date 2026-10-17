import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);

/**
 * DEV ONLY — the teleprompter's save button (pages/dev/[tool].astro).
 * A Vite middleware, so it exists only under `astro dev` and never in the
 * static build.
 *
 *   POST /__narration/save?lang=es&key=shaper.s1.p1
 *   body: the raw browser recording (webm/opus)
 *   header x-ideas: encodeURIComponent(JSON string[]) — the clip's ideas
 *
 * Writes `public/media/narration/{lang}/{key}.m4a` (mono AAC, loudness
 * normalised, leading and trailing silence trimmed) and `{key}.vtt`: the
 * take TRANSCRIBED (whisper.cpp, local), its words grouped into subtitle
 * phrases, each timed from when its first word is said. Juan speaks from
 * ideas, not a script (lib/scripts), so what he said is only known from
 * the take itself. The ideas prime the transcriber with the clip's names
 * and spelling. A word it hears wrong is fixed by hand in the .vtt.
 * The raw take, and whatever clip it replaced, are kept in
 * `narration-takes/` (gitignored), never deleted.
 */
const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, 'public/media/narration');
const TAKES = path.join(ROOT, 'narration-takes');

const KEY = /^[a-z0-9.]+$/;
const LANGS = new Set(['es', 'en', 'zh']);

const body = req =>
  new Promise((resolve, reject) => {
    const parts = [];
    req.on('data', c => parts.push(c));
    req.on('end', () => resolve(Buffer.concat(parts)));
    req.on('error', reject);
  });

const ffmpeg = (...args) =>
  run('ffmpeg', ['-hide_banner', '-y', ...args], { maxBuffer: 1 << 26 });

const duration = async file => {
  const { stdout } = await run('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file,
  ]);
  return parseFloat(stdout);
};

/** Where the voice starts and ends inside a take, from ffmpeg's own
 *  silence detector — the dead air before the first word and after the
 *  last one is trimmed, and the cues move with it. */
const voiceSpan = async (file, total) => {
  const { stderr } = await ffmpeg(
    '-i', file, '-af', 'silencedetect=noise=-42dB:d=0.35', '-f', 'null', '-',
  );
  const starts = [...stderr.matchAll(/silence_start: ([\d.]+)/g)].map(m => +m[1]);
  const ends = [...stderr.matchAll(/silence_end: ([\d.]+)/g)].map(m => +m[1]);
  let from = 0;
  let to = total;
  if (starts.length && starts[0] < 0.05 && ends.length) from = ends[0];
  // The closing silence may or may not get an end stamp at EOF.
  const last = starts.at(-1);
  const lastEnd = ends.length === starts.length ? ends.at(-1) : total;
  if (last !== undefined && last > from && lastEnd >= total - 0.1) to = last;
  return { from: Math.max(0, from - 0.25), to: Math.min(total, to + 0.45) };
};

const stamp = s => {
  const ms = Math.max(0, Math.round(s * 1000));
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor(ms / 60000) % 60).padStart(2, '0');
  const sec = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
  return `${h}:${m}:${sec}.${String(ms % 1000).padStart(3, '0')}`;
};

// ---------- transcription ----------
const WHISPER = process.env.WHISPER_BIN ?? 'whisper-cli';
const MODEL =
  process.env.WHISPER_MODEL ??
  path.join(process.env.HOME ?? '', '.local/share/whisper-models/ggml-large-v3-turbo-q5_0.bin');

// Names the transcriber would otherwise spell its own way.
const GLOSSARY =
  'Juan Villa, Sound Shaper, Salvalo, Tripealo, Crol, Conto Pay, Maktub Art Fund, ' +
  'Andreina Aular, Space Explorer, Platanus Hack, El Panal, Manuel Sira, Resty, ' +
  'Cheo Noguera, OK 101.5, Pedro Vallenilla, Cashea, Elías Sayegh, AlegrIA, Yummy, ' +
  'Barquisimeto, Caracas, YouTube Music, Apple Music, PlayStation, Dynamic Island.';

/** Every word of the take with when it is said, in seconds. */
const words = async (file, lang, ideas) => {
  const wav = file.replace(/\.m4a$/, '.16k.wav');
  const base = file.replace(/\.m4a$/, '.words');
  await ffmpeg('-i', file, '-ar', '16000', '-ac', '1', wav);
  try {
    await run(
      WHISPER,
      [
        '-m', MODEL, '-l', lang, '-f', wav, '-np',
        // One word per segment: the phrases are ours to make.
        '-ml', '1', '-sow',
        '--prompt', `${GLOSSARY} ${ideas.join(' ')}`.slice(0, 800),
        '-oj', '-of', base,
      ],
      { maxBuffer: 1 << 26 },
    );
    const { transcription } = JSON.parse(fs.readFileSync(`${base}.json`, 'utf8'));
    return transcription
      .map(s => ({ text: s.text.trim(), from: s.offsets.from / 1000, to: s.offsets.to / 1000 }))
      .filter(w => w.text);
  } finally {
    fs.rmSync(wav, { force: true });
    fs.rmSync(`${base}.json`, { force: true });
  }
};

/** Words into subtitle phrases short enough for the narrator's pill:
 *  a sentence's end closes one, a pause or the length limit does too, and
 *  a comma does once the phrase is long enough to stand alone. */
const phrases = (list, lang) => {
  const max = lang === 'zh' ? 22 : 56;
  const join = ws => ws.map(w => w.text).join(lang === 'zh' ? '' : ' ');
  const out = [];
  let cur = [];
  const flush = () => {
    if (cur.length) out.push({ text: join(cur), from: cur[0].from, to: cur.at(-1).to });
    cur = [];
  };
  for (const w of list) {
    const last = cur.at(-1);
    if (last && (w.from - last.to > 0.6 || join([...cur, w]).length > max)) flush();
    cur.push(w);
    const text = join(cur);
    if (/[.?!…。？！]$/.test(w.text)) flush();
    else if (/[,;:，；：]$/.test(w.text) && text.length >= max * 0.55) flush();
  }
  flush();
  return out;
};

const vtt = (lines, cues, end) =>
  'WEBVTT\n\n' +
  lines
    .map((line, i) => {
      const from = cues[i];
      const to = i + 1 < lines.length ? cues[i + 1] : end;
      return `${i + 1}\n${stamp(from)} --> ${stamp(Math.max(from + 0.2, to))}\n${line}\n`;
    })
    .join('\n');

const save = async (req, res, url) => {
  const lang = url.searchParams.get('lang') ?? '';
  const key = url.searchParams.get('key') ?? '';
  if (!LANGS.has(lang) || !KEY.test(key)) throw new Error('bad lang or key');
  const ideas = JSON.parse(decodeURIComponent(String(req.headers['x-ideas'] ?? '%5B%5D')));
  if (!Array.isArray(ideas)) throw new Error('ideas must be a list');

  const when = new Date().toISOString().replace(/[:.]/g, '-');
  const takes = path.join(TAKES, lang);
  fs.mkdirSync(path.join(takes, 'replaced'), { recursive: true });
  const raw = path.join(takes, `${key}--${when}.webm`);
  fs.writeFileSync(raw, await body(req));

  // The clip being replaced is kept, not lost.
  const out = path.join(PUBLIC, lang, `${key}.m4a`);
  const subs = path.join(PUBLIC, lang, `${key}.vtt`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  for (const f of [out, subs])
    if (fs.existsSync(f))
      fs.renameSync(f, path.join(takes, 'replaced', `${when}--${path.basename(f)}`));

  // Browser webm has no reliable duration header; decode once to wav.
  const wav = raw.replace(/\.webm$/, '.wav');
  await ffmpeg('-i', raw, '-ac', '1', '-ar', '48000', wav);
  const total = await duration(wav);
  const { from, to } = await voiceSpan(wav, total);
  await ffmpeg(
    '-ss', String(from), '-to', String(to), '-i', wav,
    '-af', 'highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:d=0.08',
    '-ac', '1', '-ar', '48000', '-c:a', 'aac', '-b:a', '96k',
    '-movflags', '+faststart', out,
  );
  fs.rmSync(wav);

  const length = await duration(out);
  const said = phrases(await words(out, lang, ideas), lang);
  if (!said.length) throw new Error('no words heard in the take');
  // The first phrase starts the clip; the rest start on their first word.
  const cues = said.map((p, i) => (i === 0 ? 0 : p.from));
  fs.writeFileSync(subs, vtt(said.map(p => p.text), cues, length));
  return {
    m4a: `/media/narration/${lang}/${key}.m4a`,
    length,
    cues,
    lines: said.map(p => p.text),
  };
};

export const narrationRecorder = () => ({
  name: 'narration-recorder',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/__narration/save', async (req, res) => {
      res.setHeader('content-type', 'application/json');
      if (req.method !== 'POST') {
        res.statusCode = 405;
        return res.end('{}');
      }
      try {
        const url = new URL(req.url ?? '', 'http://dev');
        res.end(JSON.stringify(await save(req, res, url)));
      } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: String(e?.message ?? e) }));
      }
    });
  },
});
