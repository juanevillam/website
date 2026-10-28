// Makes the Songs card's music (lib/likes, SongsPlayer) from Juan's own
// library: iCloud Drive's Life/music (SONGS_DIR points elsewhere), the
// same MP3s he loaded into Sound Shaper and ranks in /dev/ranker. Only
// the RANKED ones ship — `src/data/likes-order.json` → `songs`, first to
// last — so the other ~170 MB never enter the repo:
//
//   npm run songs                  the ranked order
//   npm run songs -- dakiti team   these ids instead (a trial; not saved
//                                  as the order)
//
// Every song ships as AAC in an .m4a (128 kbps, the moov atom first so it
// starts and seeks before it has all loaded) — the one format every
// browser plays, Safari included — with its cover as a small square WebP
// beside it. The player loads nothing until play is pressed; the covers
// are lazy. `src/data/songs.json` is the list the site reads: each song's
// id, title, artist and length, in the ranked order.
import { execFileSync } from 'node:child_process';
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { songId } from './likes-ranker.mjs';

const from =
  process.env.SONGS_DIR ??
  join(homedir(), 'Library/Mobile Documents/com~apple~CloudDocs/Life/music');
const root = new URL('..', import.meta.url).pathname;
const out = join(root, 'public/media/likes/songs');
const list = join(root, 'src/data/songs.json');

// A tag's artist is sometimes the whole writing credit; the card shows
// who sings it.
const CREDITS = {
  dakiti: 'Bad Bunny, Jhayco',
  solo: 'Amenazzy, Lary Over',
  suave: 'El Alfa, Chael Produciendo',
};

const order = process.argv.slice(2).length
  ? process.argv.slice(2)
  : JSON.parse(readFileSync(join(root, 'src/data/likes-order.json'), 'utf8'))
      .songs;
if (!order.length) {
  console.log(
    'No songs ranked yet: rank them in /dev/ranker, then run this again.',
  );
  process.exit(0);
}

const files = new Map(
  readdirSync(from)
    .filter(f => /\.(mp3|m4a|aac|wav|flac)$/i.test(f))
    .map(f => [songId(f), f]),
);

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const probe = file =>
  JSON.parse(
    execFileSync('ffprobe', [
      '-v',
      'quiet',
      '-print_format',
      'json',
      '-show_format',
      '-show_streams',
      file,
    ]),
  );

const songs = [];
let total = 0;
for (const id of order) {
  const file = files.get(id);
  if (!file) {
    console.warn(`${id}: not in ${from}, skipped`);
    continue;
  }
  const src = join(from, file);
  const info = probe(src);
  const tags = info.format.tags ?? {};
  const to = join(out, `${id}.m4a`);
  execFileSync('ffmpeg', [
    '-v',
    'error',
    '-y',
    '-i',
    src,
    '-map',
    '0:a:0',
    '-map_metadata',
    '-1',
    '-c:a',
    'aac_at',
    '-b:a',
    '128k',
    '-movflags',
    '+faststart',
    to,
  ]);
  // The cover, square, at twice the size the player draws it.
  const cover = info.streams.some(s => s.codec_type === 'video')
    ? execFileSync(
        'ffmpeg',
        [
          '-v',
          'error',
          '-i',
          src,
          '-map',
          '0:v:0',
          '-frames:v',
          '1',
          '-f',
          'image2pipe',
          '-c:v',
          'png',
          '-',
        ],
        {
          maxBuffer: 64 * 1024 * 1024,
        },
      )
    : null;
  let art = 0;
  if (cover) {
    await sharp(cover)
      .resize(480, 480, { fit: 'cover' })
      .webp({ quality: 78, effort: 5 })
      .toFile(join(out, `${id}.webp`));
    art = statSync(join(out, `${id}.webp`)).size;
  }
  const size = statSync(to).size;
  total += size + art;
  songs.push({
    id,
    title: tags.title ?? tags.TITLE ?? file.replace(/\.[^.]+$/, ''),
    artist: CREDITS[id] ?? tags.artist ?? tags.ARTIST ?? '',
    seconds: Math.round(Number(info.format.duration)),
    cover: !!cover,
  });
  console.log(
    `${id}.m4a`,
    (size / 1048576).toFixed(1),
    'MB',
    cover ? `· cover ${Math.round(art / 1024)} KB` : '· no cover',
  );
}

writeFileSync(list, `${JSON.stringify(songs, null, 2)}\n`);
console.log(
  `\n${songs.length} songs, ${(total / 1048576).toFixed(1)} MB → public/media/likes/songs`,
);
