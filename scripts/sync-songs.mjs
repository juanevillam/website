// Makes the Songs card's music (lib/likes, SongsPlayer) from Juan's own
// library: iCloud Drive's Life/music (SONGS_DIR points elsewhere), the
// same MP3s he loaded into Sound Shaper and ranks in /dev/ranker. EVERY
// song in it ships (Juan, 2026-10-28): first his ranked top
// (`src/data/likes-order.json` → `songs`, first to last), then the rest
// of the library from A to Z, shown apart as not part of his top.
//
//   npm run songs
//
// Every song ships as AAC in an .m4a at 96 kbps (the moov atom first, so
// it starts and seeks before it has all loaded) — the one format every
// browser plays, Safari included. Its cover ships twice, as WebP: the
// player's (720 px, loaded for the song showing) and the list's (96 px).
// Nothing of a song loads until it is played; the list's covers load when
// the card is in front. `src/data/songs.json` is the list the site reads:
// each song's id, title, artist, length and whether it is in the top.
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

const ranked = JSON.parse(
  readFileSync(join(root, 'src/data/likes-order.json'), 'utf8'),
).songs;

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

const library = readdirSync(from)
  .filter(f => /\.(mp3|m4a|aac|wav|flac)$/i.test(f))
  .map(file => {
    const info = probe(join(from, file));
    const tags = info.format.tags ?? {};
    const id = songId(file);
    return {
      id,
      file,
      info,
      title: tags.title ?? tags.TITLE ?? file.replace(/\.[^.]+$/, ''),
      artist: CREDITS[id] ?? tags.artist ?? tags.ARTIST ?? '',
    };
  });
const byTitle = (a, b) =>
  a.title.localeCompare(b.title, 'en', { sensitivity: 'base' });
const top = ranked.flatMap(id => library.filter(s => s.id === id));
const rest = library.filter(s => !ranked.includes(s.id)).sort(byTitle);

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const songs = [];
let audio = 0;
let art = 0;
for (const s of [...top, ...rest]) {
  const src = join(from, s.file);
  const to = join(out, `${s.id}.m4a`);
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
    '96k',
    '-movflags',
    '+faststart',
    to,
  ]);
  audio += statSync(to).size;
  const hasCover = s.info.streams.some(x => x.codec_type === 'video');
  if (hasCover) {
    const cover = execFileSync(
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
      { maxBuffer: 64 * 1024 * 1024 },
    );
    for (const [name, size, quality] of [
      [`${s.id}.webp`, 720, 78],
      [`${s.id}-thumb.webp`, 96, 72],
    ]) {
      await sharp(cover)
        .resize(size, size, { fit: 'cover' })
        .webp({ quality, effort: 5 })
        .toFile(join(out, name));
      art += statSync(join(out, name)).size;
    }
  }
  songs.push({
    id: s.id,
    title: s.title,
    artist: s.artist,
    seconds: Math.round(Number(s.info.format.duration)),
    cover: hasCover,
    top: ranked.includes(s.id),
  });
  console.log(`${s.id}.m4a`, (statSync(to).size / 1048576).toFixed(1), 'MB');
}

writeFileSync(list, `${JSON.stringify(songs, null, 2)}\n`);
console.log(
  `\n${songs.length} songs (${top.length} ranked): audio ${(audio / 1048576).toFixed(1)} MB, covers ${(art / 1048576).toFixed(1)} MB → public/media/likes/songs`,
);
