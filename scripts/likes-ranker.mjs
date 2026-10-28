import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * DEV ONLY — the ranker's save button (pages/dev/ranker). A Vite
 * middleware, so it exists only under `astro dev` and never in the static
 * build.
 *
 *   POST /__likes/save
 *   body: { "set": "songs", "order": ["dakiti", ...] }
 *
 * Writes that set's order, first to last, into `src/data/likes-order.json`
 * — the file lib/likes reads to show each set as Juan ranked it. Only a
 * set already in the file is taken, and only its own ids.
 */
const FILE = path.join(process.cwd(), 'src/data/likes-order.json');
const ID = /^[a-z0-9-]+$/;

/**
 * THE SONGS — Juan's own library, the one he loaded into Sound Shaper
 * (iCloud Drive's Life/music; SONGS_DIR points elsewhere), played to him
 * in the ranker straight from that folder and never copied:
 *
 *   GET /__songs/list        [{ id, file, title, artist }]
 *   GET /__songs/file/{file} the song itself, with Range for seeking
 *
 * A song's id is its file's name as a slug ("DÁKITI.mp3" → dakiti), the
 * id `src/data/likes-order.json` keeps.
 */
const SONGS =
  process.env.SONGS_DIR ??
  path.join(
    os.homedir(),
    'Library/Mobile Documents/com~apple~CloudDocs/Life/music',
  );
export const songId = file =>
  file
    .replace(/\.[^.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// The tags, read once a file: ffprobe is the tool the media scripts use.
const tags = new Map();
const tagsOf = file => {
  if (!tags.has(file)) {
    let t = {};
    try {
      const out = execFileSync('ffprobe', [
        '-v',
        'quiet',
        '-print_format',
        'json',
        '-show_format',
        path.join(SONGS, file),
      ]);
      t = JSON.parse(out.toString()).format?.tags ?? {};
    } catch {}
    tags.set(file, t);
  }
  return tags.get(file);
};
const songs = () =>
  fs
    .readdirSync(SONGS)
    .filter(f => /\.(mp3|m4a|aac|wav|flac)$/i.test(f))
    .sort((a, b) => a.localeCompare(b))
    .map(file => {
      const t = tagsOf(file);
      return {
        id: songId(file),
        file,
        title: t.title ?? t.TITLE ?? file.replace(/\.[^.]+$/, ''),
        artist: t.artist ?? t.ARTIST ?? '',
      };
    });

const body = req =>
  new Promise((resolve, reject) => {
    const parts = [];
    req.on('data', c => parts.push(c));
    req.on('end', () => resolve(Buffer.concat(parts).toString('utf8')));
    req.on('error', reject);
  });

export const likesRanker = () => ({
  name: 'likes-ranker',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/__songs/list', (req, res) => {
      res.setHeader('content-type', 'application/json');
      try {
        res.end(JSON.stringify(songs()));
      } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: String(e?.message ?? e) }));
      }
    });
    server.middlewares.use('/__songs/file/', (req, res) => {
      const file = decodeURIComponent(
        (req.url ?? '').replace(/^\//, '').split('?')[0],
      );
      // Only a song of the folder, by its own name: no path in it.
      if (!songs().some(s => s.file === file)) {
        res.statusCode = 404;
        return res.end();
      }
      const full = path.join(SONGS, file);
      const size = fs.statSync(full).size;
      const type = /\.m4a$/i.test(file)
        ? 'audio/mp4'
        : /\.wav$/i.test(file)
          ? 'audio/wav'
          : 'audio/mpeg';
      res.setHeader('content-type', type);
      res.setHeader('accept-ranges', 'bytes');
      const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? '');
      if (range) {
        const start = range[1] ? Number(range[1]) : 0;
        const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
        res.statusCode = 206;
        res.setHeader('content-range', `bytes ${start}-${end}/${size}`);
        res.setHeader('content-length', end - start + 1);
        return fs.createReadStream(full, { start, end }).pipe(res);
      }
      res.setHeader('content-length', size);
      fs.createReadStream(full).pipe(res);
    });
    server.middlewares.use('/__likes/save', async (req, res) => {
      res.setHeader('content-type', 'application/json');
      if (req.method !== 'POST') {
        res.statusCode = 405;
        return res.end('{}');
      }
      try {
        const { set, order } = JSON.parse(await body(req));
        const saved = JSON.parse(fs.readFileSync(FILE, 'utf8'));
        if (!(set in saved)) throw new Error(`unknown set: ${set}`);
        if (!Array.isArray(order) || !order.every(id => ID.test(id)))
          throw new Error('order must be a list of ids');
        saved[set] = order;
        fs.writeFileSync(FILE, `${JSON.stringify(saved, null, 2)}\n`);
        res.end(JSON.stringify({ ok: true, set, count: order.length }));
      } catch (e) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: String(e?.message ?? e) }));
      }
    });
  },
});
