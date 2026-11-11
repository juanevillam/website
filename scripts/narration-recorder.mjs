import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);

/**
 * DEV ONLY — the teleprompter's save middleware (pages/dev/[tool].astro).
 * Exists only under `astro dev` and never in the static build.
 *
 *   POST /__narration/save?key=shaper.s1.p1
 *   body: raw browser recording (webm/mp4, audio + optional 9:16 camera video)
 *   header x-ideas: encodeURIComponent(JSON string[]) — prompt names/ideas
 *
 * Writes `public/media/narration/es/{key}.m4a`, `{key}.mp4` (when recorded
 * with camera), `{key}.vtt`, and `src/data/narration/{key}.words.json`
 * (transcribed locally via `whisper-cli`). Raw takes and replaced files are
 * preserved in `narration-takes/es/` (gitignored), never deleted.
 */
const ROOT = process.cwd();
const PUBLIC_ES = path.join(ROOT, 'public/media/narration/es');
const TAKES_ES = path.join(ROOT, 'narration-takes/es');

const KEY = /^[a-z0-9.]+$/;

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
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'csv=p=0',
    file,
  ]).catch(() => ({ stdout: '' }));
  const d = parseFloat(stdout);
  if (Number.isFinite(d) && d > 0) return d;
  const { stderr } = await run('ffmpeg', [
    '-hide_banner',
    '-i',
    file,
    '-vn',
    '-f',
    'null',
    '-',
  ]).catch(e => ({ stderr: String(e?.stderr ?? '') }));
  const m = [...stderr.matchAll(/time=(\d+):(\d+):([\d.]+)/g)].at(-1);
  return m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + parseFloat(m[3]) : 0;
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
  path.join(
    process.env.HOME ?? '',
    '.local/share/whisper-models/ggml-large-v3-turbo-q5_0.bin',
  );

const GLOSSARY =
  'Juan Villa, Sound Shaper, Salvalo, Tripealo, Crol, Conto Pay, Maktub Art Fund, ' +
  'Space Explorer, Platanus Hack, Tridi, El Panal, Manuel Sira, Resty, ' +
  'Cheo Noguera, OK 101.5, Pedro Vallenilla, Cashea, Elías Sayegh, AlegrIA, Yummy, Abrahan, ' +
  'Barquisimeto, Caracas, YouTube Music, Apple Music, PlayStation, Dynamic Island, Horrocrux.';

/** Strip trailing Whisper silence hallucinations. */
const cleanHallucinations = (list, totalDur) => {
  const out = [...list];
  while (out.length >= 5) {
    const lastT = out.at(-1).from;
    if (totalDur > 0 && lastT < totalDur - 1.5) break;
    let same = 0;
    for (
      let i = out.length - 1;
      i >= 0 && Math.abs(out[i].from - lastT) < 0.005;
      i--
    )
      same++;
    if (same >= 5) out.splice(out.length - same, same);
    else break;
  }
  const tailText = out
    .slice(-6)
    .map(w => w.text)
    .join(' ');
  const phantom =
    /(gracias por ver( el video)?|subt[íi]tulos realizados|suscr[íi]bete al canal)\.?$/i;
  if (phantom.test(tailText)) {
    const m = tailText.match(phantom);
    const dropWords = m ? m[0].trim().split(/\s+/).length : 0;
    if (dropWords > 0 && out.at(-dropWords)?.from > totalDur - 3.0) {
      out.splice(out.length - dropWords, dropWords);
    }
  }
  return out;
};

const words = async (file, ideas, totalDur = 0) => {
  const wav = file.replace(/\.[a-z0-9]+$/, '.16k.wav');
  const base = file.replace(/\.[a-z0-9]+$/, '.words');
  await ffmpeg('-i', file, '-ar', '16000', '-ac', '1', wav);
  try {
    await run(
      WHISPER,
      [
        '-m',
        MODEL,
        '-l',
        'es',
        '-f',
        wav,
        '-np',
        '-ml',
        '1',
        '-sow',
        '--prompt',
        `${GLOSSARY} ${ideas.join(' ')}`.slice(0, 800),
        '-oj',
        '-of',
        base,
      ],
      { maxBuffer: 1 << 26 },
    );
    const { transcription } = JSON.parse(
      fs.readFileSync(`${base}.json`, 'utf8'),
    );
    const rawList = transcription
      .map(s => ({
        text: s.text.trim(),
        from: s.offsets.from / 1000,
        to: s.offsets.to / 1000,
      }))
      .filter(w => w.text);
    return cleanHallucinations(rawList, totalDur);
  } finally {
    fs.rmSync(wav, { force: true });
    fs.rmSync(`${base}.json`, { force: true });
  }
};

const phrases = list => {
  const max = 56;
  const join = ws => ws.map(w => w.text).join(' ');
  const out = [];
  let cur = [];
  const flush = () => {
    if (cur.length)
      out.push({ text: join(cur), from: cur[0].from, to: cur.at(-1).to });
    cur = [];
  };
  for (const w of list) {
    const last = cur.at(-1);
    if (last && (w.from - last.to > 0.6 || join([...cur, w]).length > max))
      flush();
    cur.push(w);
    const text = join(cur);
    if (/[.?!]$/.test(w.text)) flush();
    else if (/[,;:]$/.test(w.text) && text.length >= max * 0.55) flush();
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

const save = async (req, url) => {
  const key = url.searchParams.get('key') ?? '';
  if (!KEY.test(key)) throw new Error('bad key');

  const when = new Date().toISOString().replace(/[:.]/g, '-');
  fs.mkdirSync(path.join(TAKES_ES, 'replaced'), { recursive: true });
  const raw = path.join(TAKES_ES, `${key}--${when}.webm`);
  fs.writeFileSync(raw, await body(req));

  let ideas = [];
  try {
    ideas = JSON.parse(
      decodeURIComponent(String(req.headers['x-ideas'] ?? '%5B%5D')),
    );
  } catch {}
  if (!Array.isArray(ideas)) ideas = [];

  const out = path.join(PUBLIC_ES, `${key}.m4a`);
  const outMp4 = path.join(PUBLIC_ES, `${key}.mp4`);
  const subs = path.join(PUBLIC_ES, `${key}.vtt`);
  const timed = path.join(ROOT, 'src/data/narration', `${key}.words.json`);

  fs.mkdirSync(PUBLIC_ES, { recursive: true });
  fs.mkdirSync(path.dirname(timed), { recursive: true });

  const { stdout: vStreams } = await run('ffprobe', [
    '-v',
    'error',
    '-select_streams',
    'v:0',
    '-show_entries',
    'stream=width,height',
    '-of',
    'csv=p=0',
    raw,
  ]).catch(() => ({ stdout: '' }));
  const hasVideo = Boolean(vStreams.trim());

  for (const f of [out, subs, ...(hasVideo ? [outMp4] : [])]) {
    if (fs.existsSync(f)) {
      fs.renameSync(
        f,
        path.join(TAKES_ES, 'replaced', `${when}--${path.basename(f)}`),
      );
    }
  }
  if (fs.existsSync(timed)) {
    fs.copyFileSync(
      timed,
      path.join(TAKES_ES, 'replaced', `${when}--${path.basename(timed)}`),
    );
  }

  const rawDur = await duration(raw).catch(() => 0);
  let startTrim = rawDur > 2 ? 0.28 : 0;
  let endTrim = rawDur;
  if (rawDur > 3) {
    const { stderr: silLog } = await run('ffmpeg', [
      '-hide_banner',
      '-i',
      raw,
      '-vn',
      '-af',
      'silencedetect=n=-45dB:d=0.45',
      '-f',
      'null',
      '-',
    ]).catch(e => ({ stderr: String(e?.stderr ?? '') }));
    const starts = [...silLog.matchAll(/silence_start:\s*([\d.]+)/g)].map(m =>
      parseFloat(m[1]),
    );
    const ends = [...silLog.matchAll(/silence_end:\s*([\d.]+)/g)].map(m =>
      parseFloat(m[1]),
    );
    const lastStart = starts.at(-1);
    const lastEnd = ends.at(-1) ?? 0;
    if (
      lastStart !== undefined &&
      lastStart > 1.5 &&
      (lastEnd < lastStart || rawDur - lastEnd < 0.35) &&
      rawDur - lastStart > 1.0
    ) {
      endTrim = Math.min(rawDur, +(lastStart + 0.85).toFixed(2));
    }
  }

  const trimArgs =
    Number.isFinite(endTrim) && endTrim > startTrim
      ? ['-ss', String(startTrim), '-to', String(endTrim)]
      : startTrim > 0
        ? ['-ss', String(startTrim)]
        : [];

  await ffmpeg(
    ...trimArgs,
    '-i',
    raw,
    '-vn',
    '-c:a',
    'aac',
    '-b:a',
    '192k',
    '-movflags',
    '+faststart',
    out,
  );

  if (hasVideo) {
    const estDur = Math.max(
      10,
      Number.isFinite(endTrim - startTrim) && endTrim > startTrim
        ? endTrim - startTrim
        : Number.isFinite(rawDur) && rawDur > 0
          ? rawDur
          : 60,
    );
    // Keep every clip safely under Cloudflare Pages' 25 MiB static file limit.
    const maxKbps = Math.min(1800, Math.floor((23.5 * 8192) / estDur));
    const scale = estDur <= 160 ? '720:1280' : '540:960';
    await ffmpeg(
      ...trimArgs,
      '-i',
      raw,
      '-vf',
      `crop=min(iw\\,ih*9/16):min(ih\\,iw*16/9),scale=${scale}:flags=lanczos`,
      '-r',
      '30',
      '-c:v',
      'libx264',
      '-preset',
      'slow',
      '-profile:v',
      'high',
      '-crf',
      '19',
      '-g',
      '120',
      '-bf',
      '3',
      '-aq-mode',
      '2',
      '-maxrate',
      `${maxKbps}k`,
      '-bufsize',
      `${maxKbps * 2}k`,
      '-pix_fmt',
      'yuv420p',
      '-an',
      '-movflags',
      '+faststart',
      outMp4,
    );
  }

  const length = await duration(out);
  const heard = await words(out, ideas, length);
  if (!heard.length) throw new Error('no words heard in the take');

  const said = phrases(heard);
  const cues = said.map((p, i) => (i === 0 ? 0 : p.from));
  fs.writeFileSync(
    subs,
    vtt(
      said.map(p => p.text),
      cues,
      length,
    ),
  );

  fs.writeFileSync(
    timed,
    JSON.stringify(
      heard.map(w => ({ w: w.text, t: Math.round(w.from * 100) / 100 })),
    ),
  );

  return {
    m4a: `/media/narration/es/${key}.m4a`,
    hasVideo: fs.existsSync(outMp4),
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
        res.end(JSON.stringify(await save(req, url)));
      } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: String(e?.message ?? e) }));
      }
    });
  },
});
