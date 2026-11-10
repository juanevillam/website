import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);

/**
 * DEV ONLY — the teleprompter's studio & save middleware (pages/dev/[tool].astro).
 * Exists only under `astro dev` and never in the static build.
 *
 * Supports Juan's 2-stage studio workflow (2026-11-10):
 *   1. Full Take (`mode=full`, with camera): records 9:16 video (`.mp4`) +
 *      reference audio (`.m4a`), transcribes verbatim words + timestamps, and
 *      snapshots ground-truth mouth timings (`{key}.video-ref.json`) + guide
 *      audio (`{key}.video-guide.m4a`) in `narration-takes/{lang}/`.
 *   2. Lip-Sync ADR (`mode=lipsync`, audio-only over existing `.mp4`):
 *      NEVER touches or moves `{key}.mp4` or `{key}.video-ref.json`. Aligns
 *      the close-mic recording to millisecond `x-sync-offset` (supporting both
 *      full-take and punch-in/punch-out splices with 30ms click-free
 *      crossfades), matches `{key}.mp4`'s exact duration, and updates
 *      `{key}.m4a`, `{key}.vtt`, and `{key}.words.json`.
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

// Names the transcriber would otherwise spell its own way.
const GLOSSARY =
  'Juan Villa, Sound Shaper, Salvalo, Tripealo, Crol, Conto Pay, Maktub Art Fund, ' +
  'Space Explorer, Platanus Hack, Tridi, El Panal, Manuel Sira, Resty, ' +
  'Cheo Noguera, OK 101.5, Pedro Vallenilla, Cashea, Elías Sayegh, AlegrIA, Yummy, Abrahan, ' +
  'Barquisimeto, Caracas, YouTube Music, Apple Music, PlayStation, Dynamic Island, Horrocrux.';

/** Strip trailing Whisper silence hallucinations (stacked final timestamp or YouTube-outro phantoms). */
const cleanHallucinations = (list, totalDur) => {
  const out = [...list];
  // Drop >= 5 tokens piled onto the exact same timestamp near the end of the file.
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
  // Drop classic trailing silence hallucinations in last 2.5s.
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

/** Every word of the take with when it is said, in seconds. */
const words = async (file, lang, ideas, totalDur = 0) => {
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
        lang,
        '-f',
        wav,
        '-np',
        // One word per segment: the phrases are ours to make.
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

/** Words into subtitle phrases short enough for the narrator's pill:
 *  a sentence's end closes one, a pause or the length limit does too, and
 *  a comma does once the phrase is long enough to stand alone. */
const phrases = (list, lang) => {
  const max = lang === 'zh' ? 22 : 56;
  const join = ws => ws.map(w => w.text).join(lang === 'zh' ? '' : ' ');
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

const timedPathOf = (lang, key) =>
  path.join(
    ROOT,
    'src/data/narration',
    lang === 'es' ? `${key}.words.json` : `${key}.${lang}.words.json`,
  );

const serveAudioFile = (req, res, filePath) => {
  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    return res.end('not found');
  }
  const stat = fs.statSync(filePath);
  const total = stat.size;
  const range = req.headers.range;
  res.setHeader('Content-Type', 'audio/mp4');
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Cache-Control', 'no-store');
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (m) {
      const start = m[1] ? parseInt(m[1], 10) : 0;
      const end = m[2] ? Math.min(total - 1, parseInt(m[2], 10)) : total - 1;
      if (start <= end && start < total) {
        res.statusCode = 206;
        res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
        res.setHeader('Content-Length', String(end - start + 1));
        return fs.createReadStream(filePath, { start, end }).pipe(res);
      }
    }
  }
  res.statusCode = 200;
  res.setHeader('Content-Length', String(total));
  fs.createReadStream(filePath).pipe(res);
};

const readRefInfo = async (lang, key) => {
  const ownMp4 = path.join(PUBLIC, lang, `${key}.mp4`);
  const esMp4 = path.join(PUBLIC, 'es', `${key}.mp4`);
  const hasOwnVideo = fs.existsSync(ownMp4);
  const videoPath = hasOwnVideo ? ownMp4 : fs.existsSync(esMp4) ? esMp4 : null;
  const videoLang = hasOwnVideo ? lang : 'es';
  const hasVideo = Boolean(videoPath);
  const takesDir = path.join(TAKES, lang);
  const refJson = path.join(takesDir, `${key}.video-ref.json`);
  const timed = timedPathOf(lang, key);
  const hasLangAudio = fs.existsSync(path.join(PUBLIC, lang, `${key}.m4a`));
  const lipsyncMeta = path.join(takesDir, `${key}.lipsync.json`);
  let refWords = [];
  const srcJson = fs.existsSync(refJson)
    ? refJson
    : (lang === 'es' || hasLangAudio) && fs.existsSync(timed)
      ? timed
      : null;
  if (srcJson) {
    try {
      refWords = JSON.parse(fs.readFileSync(srcJson, 'utf8'));
    } catch {}
  }
  const videoDuration = videoPath
    ? await duration(videoPath).catch(() => 0)
    : 0;
  return {
    hasVideo,
    hasOwnVideo,
    videoUrl: hasVideo ? `/media/narration/${videoLang}/${key}.mp4` : null,
    guideAudioUrl: `/__narration/guide?lang=${lang}&key=${encodeURIComponent(key)}`,
    videoDuration,
    lipsynced: fs.existsSync(lipsyncMeta),
    words: refWords,
  };
};

const save = async (req, res, url) => {
  const lang = url.searchParams.get('lang') ?? '';
  const key = url.searchParams.get('key') ?? '';
  const reqMode =
    url.searchParams.get('mode') === 'lipsync' ? 'lipsync' : 'full';
  if (!LANGS.has(lang) || !KEY.test(key)) throw new Error('bad lang or key');

  // The take is on disk before anything can fail: a bad header or a
  // transcriber error must never cost a recording.
  const when = new Date().toISOString().replace(/[:.]/g, '-');
  const takes = path.join(TAKES, lang);
  fs.mkdirSync(path.join(takes, 'replaced'), { recursive: true });
  const suffix = reqMode === 'lipsync' ? '--lipsync' : '';
  const raw = path.join(takes, `${key}--${when}${suffix}.webm`);
  fs.writeFileSync(raw, await body(req));

  let ideas = [];
  try {
    ideas = JSON.parse(
      decodeURIComponent(String(req.headers['x-ideas'] ?? '%5B%5D')),
    );
  } catch {}
  if (!Array.isArray(ideas)) ideas = [];

  const syncOffsetHeader = parseFloat(
    String(req.headers['x-sync-offset'] ?? ''),
  );
  const punchIn = Math.max(
    0,
    parseFloat(String(req.headers['x-punch-in'] ?? '0')) || 0,
  );
  const manualStop = req.headers['x-manual-stop'] === '1';

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
  const hasVideoStream = Boolean(vStreams.trim()) && reqMode !== 'lipsync';
  const isLipsync = reqMode === 'lipsync' || !hasVideoStream;

  const out = path.join(PUBLIC, lang, `${key}.m4a`);
  const outMp4 = path.join(PUBLIC, lang, `${key}.mp4`);
  const subs = path.join(PUBLIC, lang, `${key}.vtt`);
  const timed = timedPathOf(lang, key);
  const refJson = path.join(takes, `${key}.video-ref.json`);
  const guideM4a = path.join(takes, `${key}.video-guide.m4a`);
  const lipsyncMeta = path.join(takes, `${key}.lipsync.json`);

  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.mkdirSync(path.dirname(timed), { recursive: true });

  // Snapshot the original video's mouth-timing transcript & guide audio BEFORE
  // any lip-sync pass modifies `.m4a` or `.words.json`, so repeating a lip-sync
  // take 10 times still cues against the video's true lip movements.
  if (isLipsync && fs.existsSync(outMp4)) {
    if (!fs.existsSync(refJson) && fs.existsSync(timed)) {
      fs.copyFileSync(timed, refJson);
    }
    if (!fs.existsSync(guideM4a) && fs.existsSync(out)) {
      fs.copyFileSync(out, guideM4a);
    }
  }

  // Backup replaced files. CRITICAL: NEVER touch `outMp4` unless `hasVideoStream`
  // is true (a full camera + audio take)!
  const prevOutBackup = path.join(
    takes,
    'replaced',
    `${when}--${path.basename(out)}`,
  );
  if (fs.existsSync(out)) fs.renameSync(out, prevOutBackup);
  if (fs.existsSync(subs))
    fs.renameSync(
      subs,
      path.join(takes, 'replaced', `${when}--${path.basename(subs)}`),
    );
  if (fs.existsSync(timed))
    fs.copyFileSync(
      timed,
      path.join(takes, 'replaced', `${when}--${path.basename(timed)}`),
    );
  if (hasVideoStream && fs.existsSync(outMp4)) {
    fs.renameSync(
      outMp4,
      path.join(takes, 'replaced', `${when}--${path.basename(outMp4)}`),
    );
  }

  const rawDur = await duration(raw).catch(() => 0);

  if (isLipsync) {
    const vidDur = fs.existsSync(outMp4)
      ? await duration(outMp4).catch(() => 0)
      : 0;
    const cutFrom = Math.max(
      0,
      Number.isFinite(syncOffsetHeader) ? syncOffsetHeader : 0,
    );
    // Drop the last 70ms when stopped manually so a spacebar click never lands in the take.
    const availDur = Math.max(0, rawDur - cutFrom - (manualStop ? 0.07 : 0));
    const hasPrev = fs.existsSync(prevOutBackup);
    const prevDur = hasPrev ? await duration(prevOutBackup).catch(() => 0) : 0;
    const spliceDur = vidDur > 1 ? vidDur : prevDur;
    const cf = 0.03;

    if (
      hasPrev &&
      spliceDur > 1 &&
      availDur > 0.25 &&
      punchIn + availDur < spliceDur - 1.0
    ) {
      // Punch-in + Punch-out (or early-stop splice): seamlessly crossfade the
      // newly dubbed segment into the existing `.m4a` with 0.000ms timeline shift.
      const pOut = punchIn + availDur;
      if (punchIn > 0.05) {
        const filter =
          `[0:a]atrim=0:${(punchIn + cf).toFixed(4)},asetpts=PTS-STARTPTS[a0];` +
          `[1:a]atrim=start=${cutFrom.toFixed(4)}:end=${(cutFrom + availDur + cf).toFixed(4)},asetpts=PTS-STARTPTS[a1];` +
          `[0:a]atrim=start=${pOut.toFixed(4)}:end=${spliceDur.toFixed(4)},asetpts=PTS-STARTPTS[a2];` +
          `[a0][a1]acrossfade=d=${cf}:c1=tri:c2=tri[a01];` +
          `[a01][a2]acrossfade=d=${cf}:c1=tri:c2=tri,apad,atrim=0:${spliceDur.toFixed(4)},asetpts=PTS-STARTPTS[outa]`;
        await ffmpeg(
          '-i',
          prevOutBackup,
          '-i',
          raw,
          '-filter_complex',
          filter,
          '-map',
          '[outa]',
          '-c:a',
          'aac',
          '-b:a',
          '256k',
          '-ar',
          '48000',
          '-ac',
          '1',
          '-movflags',
          '+faststart',
          out,
        );
      } else {
        const filter =
          `[0:a]atrim=start=${cutFrom.toFixed(4)}:end=${(cutFrom + availDur + cf).toFixed(4)},asetpts=PTS-STARTPTS[a0];` +
          `[1:a]atrim=start=${pOut.toFixed(4)}:end=${spliceDur.toFixed(4)},asetpts=PTS-STARTPTS[a1];` +
          `[a0][a1]acrossfade=d=${cf}:c1=tri:c2=tri,apad,atrim=0:${spliceDur.toFixed(4)},asetpts=PTS-STARTPTS[outa]`;
        await ffmpeg(
          '-i',
          raw,
          '-i',
          prevOutBackup,
          '-filter_complex',
          filter,
          '-map',
          '[outa]',
          '-c:a',
          'aac',
          '-b:a',
          '256k',
          '-ar',
          '48000',
          '-ac',
          '1',
          '-movflags',
          '+faststart',
          out,
        );
      }
    } else if (hasPrev && punchIn > 0.05) {
      // Punch-in through the end of the clip.
      const tailPad =
        vidDur > punchIn + 0.1
          ? `,apad,atrim=0:${vidDur.toFixed(4)},asetpts=PTS-STARTPTS`
          : '';
      const filter =
        `[0:a]atrim=0:${(punchIn + cf).toFixed(4)},asetpts=PTS-STARTPTS[a0];` +
        `[1:a]atrim=start=${cutFrom.toFixed(4)},asetpts=PTS-STARTPTS[a1];` +
        `[a0][a1]acrossfade=d=${cf}:c1=tri:c2=tri${tailPad}[outa]`;
      await ffmpeg(
        '-i',
        prevOutBackup,
        '-i',
        raw,
        '-filter_complex',
        filter,
        '-map',
        '[outa]',
        '-c:a',
        'aac',
        '-b:a',
        '256k',
        '-ar',
        '48000',
        '-ac',
        '1',
        '-movflags',
        '+faststart',
        out,
      );
    } else {
      // Full start-to-finish Lip-Sync pass, locked to exact `vidDur`.
      const trimEnd =
        manualStop && rawDur - cutFrom > 0.25
          ? `:end=${(rawDur - 0.07).toFixed(4)}`
          : '';
      const lockVid =
        vidDur > 0.5
          ? `,apad,atrim=0:${vidDur.toFixed(4)},asetpts=PTS-STARTPTS`
          : '';
      const af = `atrim=start=${cutFrom.toFixed(4)}${trimEnd},asetpts=PTS-STARTPTS${lockVid}`;
      await ffmpeg(
        '-i',
        raw,
        '-vn',
        '-af',
        af,
        '-c:a',
        'aac',
        '-b:a',
        '256k',
        '-ar',
        '48000',
        '-ac',
        '1',
        '-movflags',
        '+faststart',
        out,
      );
    }
  } else {
    // Full camera + audio take (Stage 1).
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
      '256k',
      '-ar',
      '48000',
      '-ac',
      '1',
      '-movflags',
      '+faststart',
      out,
    );

    const estDur = Math.max(
      10,
      Number.isFinite(endTrim - startTrim) && endTrim > startTrim
        ? endTrim - startTrim
        : Number.isFinite(rawDur) && rawDur > 0
          ? rawDur
          : 60,
    );
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
  const heard = await words(out, lang, ideas, length);
  if (!heard.length) throw new Error('no words heard in the take');

  const said = phrases(heard, lang);
  const cues = said.map((p, i) => (i === 0 ? 0 : p.from));
  fs.writeFileSync(
    subs,
    vtt(
      said.map(p => p.text),
      cues,
      length,
    ),
  );

  const timedData = heard.map(w => ({
    w: w.text,
    t: Math.round(w.from * 100) / 100,
  }));
  fs.writeFileSync(timed, JSON.stringify(timedData));

  if (hasVideoStream) {
    // Stage 1 fresh video take: refresh the ground-truth mouth reference & guide audio.
    fs.writeFileSync(refJson, JSON.stringify(timedData));
    fs.copyFileSync(out, guideM4a);
    fs.rmSync(lipsyncMeta, { force: true });
  } else if (reqMode === 'lipsync') {
    fs.writeFileSync(
      lipsyncMeta,
      JSON.stringify(
        {
          updatedAt: when,
          syncOffset: Number.isFinite(syncOffsetHeader) ? syncOffsetHeader : 0,
          punchIn,
          length,
        },
        null,
        2,
      ),
    );
  }

  const esText = said.map(p => p.text).join(' ');
  let enText = '';
  const latestPath = path.join(takes, `${key}.latest.json`);
  if (lang === 'es' && esText && (!isLipsync || !fs.existsSync(latestPath))) {
    try {
      const trUrl =
        'https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=' +
        encodeURIComponent(esText);
      const trRes = await fetch(trUrl);
      const trJson = await trRes.json();
      if (Array.isArray(trJson?.[0])) {
        enText = trJson[0]
          .map(seg => seg?.[0] ?? '')
          .join('')
          .trim();
      }
    } catch {}
    if (enText) {
      fs.writeFileSync(
        latestPath,
        JSON.stringify({ es: esText, en: enText, updatedAt: when }, null, 2),
      );
    }
  }

  return {
    m4a: `/media/narration/${lang}/${key}.m4a`,
    length,
    cues,
    lines: said.map(p => p.text),
    esText,
    enText,
    lipsynced: reqMode === 'lipsync',
  };
};

export const narrationRecorder = () => ({
  name: 'narration-recorder',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/__narration', async (req, res, next) => {
      const url = new URL(req.url ?? '', 'http://dev');
      const sub = url.pathname.replace(/^\/+/, '');

      if (sub === 'guide' && req.method === 'GET') {
        const lang = url.searchParams.get('lang') ?? '';
        const key = url.searchParams.get('key') ?? '';
        if (!LANGS.has(lang) || !KEY.test(key)) {
          res.statusCode = 400;
          return res.end('bad lang or key');
        }
        const guide = path.join(TAKES, lang, `${key}.video-guide.m4a`);
        const pub = path.join(PUBLIC, lang, `${key}.m4a`);
        const esGuide = path.join(TAKES, 'es', `${key}.video-guide.m4a`);
        const esPub = path.join(PUBLIC, 'es', `${key}.m4a`);
        const resolved = [guide, pub, esGuide, esPub].find(p =>
          fs.existsSync(p),
        );
        return serveAudioFile(req, res, resolved ?? pub);
      }

      if (sub === 'ref' && req.method === 'GET') {
        res.setHeader('content-type', 'application/json');
        const lang = url.searchParams.get('lang') ?? '';
        const key = url.searchParams.get('key') ?? '';
        if (!LANGS.has(lang) || !KEY.test(key)) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'bad lang or key' }));
        }
        try {
          return res.end(JSON.stringify(await readRefInfo(lang, key)));
        } catch (e) {
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: String(e?.message ?? e) }));
        }
      }

      if (sub === 'save') {
        res.setHeader('content-type', 'application/json');
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end('{}');
        }
        try {
          return res.end(JSON.stringify(await save(req, res, url)));
        } catch (e) {
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: String(e?.message ?? e) }));
        }
      }

      next();
    });
  },
});
