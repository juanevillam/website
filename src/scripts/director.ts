/**
 * THE PAGE'S DIRECTOR — the narration session, the narrator's glide between
 * anchors, the hero's ride-out, and the scroll-driven walk of any
 * StoryShowcase on the page. It lived inside StoryShowcase until the apps
 * moved to one deck (AppsShowcase, 2026-10-11) and a page could have no
 * story at all; it is the narrator's, so NarrationPlayer loads it. Every
 * part is driven by what the page marks up — `data-narr-block`,
 * `data-narr-panel`, `[data-story]` — so a page without stories simply has
 * none to walk.
 */
import { createDeck, watchSlots, type Deck } from '../lib/deck';
import { type ReadMark, readTokens } from '../lib/readAlong';

// ---------- the controller ----------
// The walk from the opener to the deck is a pure function of the scroll
// position p (0 = the opener, 1 = the deck): the opener fades, the phone
// walks in from its peek, the words come up, the lockup FLIPs between
// its anchors. The deck itself turns sideways, by its own controls.

const reduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

// STEPPED on a touch screen. iOS scrolls on its own compositor and hands
// the page its scroll position a frame or more late, so anything this
// script moves pixel-by-pixel with the scroll trails behind the finger
// and reads as heavy — however cheap the frame is (measured: ~52fps in a
// throttled phone emulation, yet it still drags on a real iPhone 15).
// So on touch the controller works in WHOLE STEPS: every scroll-coupled
// value is rounded to the step the page is on, and the change between
// two states is a CSS transition the GPU runs by itself (html.is-stepped
// in global.css). A mouse or trackpad keeps the continuous scrub.
const stepped = window.matchMedia(
  '(hover: none) and (pointer: coarse)',
).matches;
const step = (v: number) => (stepped ? Math.round(v) : v);

// PHONE: the stories are drawn as plain snapped panels (.m-story) and
// the pinned stage is not drawn at all, so the controller drives no
// stage and the narrator sits still in its corner (NarrationPlayer).
// The layout is chosen once per load; crossing the line reloads.
const phoneQuery = window.matchMedia('(max-width: 48rem)');
const phone = phoneQuery.matches;
// ...but never while the phone's game cabinet is open: turning the phone
// sideways to play crosses this line, and the reload would close the
// game. The cabinet reloads on its way out instead (`arcade:close`).
let relayout = false;
phoneQuery.addEventListener('change', () => {
  if (document.documentElement.dataset.arcade === 'open') relayout = true;
  else location.reload();
});
document.addEventListener('arcade:close', () => {
  if (relayout && phoneQuery.matches !== phone) location.reload();
  relayout = false;
});

const smooth = (v: number) => v * v * (3 - 2 * v);

// ---------- narration ----------
// Juan's voice tells the page as a pitch. One clip per paragraph and
// ONE session across the whole page — the hero's intro, then each
// story's opener and slides: paragraph to paragraph inside a block,
// then the page itself turns and the voice follows it. The last slide
// hands the scroll back to the opener, so the pitch closes on the store
// row. Scroll by hand and the voice follows you; tap a paragraph that
// is being told and it jumps there.

const voice = new Audio();
voice.preload = 'auto';
// A LITTLE QUICKER THAN RECORDED (Juan, 2026-10-17). The takes stay
// exactly as recorded — the speed is the player's, never the file's — and
// the pitch is kept, so it is still Juan's voice, only less unhurried.
// The read-along runs on the media clock, so its timings follow.
const NARRATION_RATE = 1.1;
voice.defaultPlaybackRate = NARRATION_RATE;
voice.playbackRate = NARRATION_RATE;
voice.preservesPitch = true;
// What the OS shows for the voice (Dynamic Island, Lock Screen). With no
// metadata Safari falls back to the favicon, whose rounded tile has
// transparent corners that the Lock Screen paints white. The artwork is
// the same mark, square and opaque, because the OS rounds it itself.
if ('mediaSession' in navigator)
  navigator.mediaSession.metadata = new MediaMetadata({
    title: document.title,
    artwork: [
      {
        src: '/media/brand/now-playing.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  });
// Dev only: lets a check drive the narrator SILENTLY — the analyser
// still hears the voice (bars, subtitles, field all run), the speakers
// do not. Never shipped.
let devSilent = false;
if (import.meta.env.DEV)
  Object.assign(window, {
    __narrVoice: voice,
    __narrSilence: () => {
      devSilent = true;
      if (output) output.gain.value = 0;
    },
  });

/** A narrated block: the hero's wordmark, a story's opener pitch, one
 *  slide's caption, or a PANEL — a plain full-height section after the
 *  stories (the game), marked `data-narr-panel`. */
type Narr = {
  el: HTMLElement;
  paras: HTMLElement[];
  anchor: HTMLElement | null;
  /** The story it belongs to, and its step there; null = the hero or a
   *  panel. */
  story: Story | null;
  step: number;
  panel: boolean;
};

type Story = {
  root: HTMLElement;
  steps: HTMLElement[];
  stage: HTMLElement | null;
  intro: HTMLElement | null;
  float: HTMLElement | null;
  deck: Deck | null;
  lockup: HTMLElement | null;
  anchorBig: HTMLElement | null;
  anchorSmall: HTMLElement | null;
  actions: HTMLElement | null;
  actionsBig: HTMLElement | null;
  actionsSmall: HTMLElement | null;
  /** Narrated blocks by step: the opener's pitch is 0, the deck 1. */
  blocks: (Narr | undefined)[];
};

const narrator = document.querySelector<HTMLElement>('[data-narrator]');

/** A shared address's modal is open over the page (lib/links). */
const focusOpen = () => !!document.querySelector('[data-focused]');

/** Where the voice is — kept while paused, so play resumes in place. */
let session: { block: Narr; para: number } | null = null;
/** The person's intent: running, or paused by them. Not the element's
 *  own paused flag, which flips on its own at the end of every clip. */
let running = false;
/** The block the page is showing right now (set by the render loop). */
let showing: Narr | undefined;

const narrs: Narr[] = [];

// One voice, Spanish (lib/narration): every paragraph's clip rides on it
// as data-clip.

const clipOf = (p: HTMLElement) => p.dataset.clip;

const firstVoiced = (block: Narr | undefined, from = 0) => {
  if (!block) return -1;
  for (let i = from; i < block.paras.length; i++)
    if (clipOf(block.paras[i])) return i;
  return -1;
};

// Where a block's telling starts: its first recorded paragraph — unless
// the block names its own start (`data-narr-start`), as a carousel does
// for the card in front.
const startOf = (block: Narr) => {
  const named = Number(block.el.dataset.narrStart);
  if (
    Number.isInteger(named) &&
    block.paras[named] &&
    clipOf(block.paras[named])
  )
    return named;
  return firstVoiced(block);
};

const paint = () => {
  for (const n of narrs) {
    const on = session?.block === n;
    n.el.classList.toggle('is-narrating', on);
    n.paras.forEach((p, i) =>
      p.classList.toggle('is-spoken', on && session?.para === i),
    );
  }
  narrator?.classList.toggle('is-playing', running);
};

// ----- listening: the voice, band by band -----
// A live analyser on the voice, read once a frame into log-spaced
// bands — the body of it first, the air last — plus where its energy
// sits. Nothing is drawn here: the field along the foot of the screen
// is what shows it (the pill is only play and pause).

let ctx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let output: GainNode | null = null;
let freq: Uint8Array<ArrayBuffer> | null = null;

// The analyser needs an AudioContext, which a browser only lets a
// gesture create — so it is built on the first play. Routing the voice
// through it is also what makes it audible from then on.
const ensureGraph = () => {
  if (ctx) return;
  try {
    ctx = new AudioContext();
    const source = ctx.createMediaElementSource(voice);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.minDecibels = -85;
    analyser.maxDecibels = -25;
    analyser.smoothingTimeConstant = 0.72;
    output = ctx.createGain();
    output.gain.value = devSilent ? 0 : 1;
    source.connect(analyser).connect(output).connect(ctx.destination);
    freq = new Uint8Array(analyser.frequencyBinCount);
  } catch {
    ctx = null;
    analyser = null;
  }
};

// How finely the voice is split — the horizon's resolution.
const BANDS = 16;
// The voice's range, first band to last.
const LOW_HZ = 90;
const HIGH_HZ = 5000;

let peak = 0.35;

/** One level per band, centre first; zeros when nothing is speaking. */
const voiceBands = (half: number) => {
  const out = new Array(half).fill(0);
  if (!analyser || !freq || !ctx) return out;
  analyser.getByteFrequencyData(freq);
  const binHz = ctx.sampleRate / analyser.fftSize;
  for (let k = 0; k < half; k++) {
    const lo = LOW_HZ * (HIGH_HZ / LOW_HZ) ** (k / half);
    const hi = LOW_HZ * (HIGH_HZ / LOW_HZ) ** ((k + 1) / half);
    const a = Math.max(1, Math.floor(lo / binHz));
    const b = Math.max(a + 1, Math.ceil(hi / binHz));
    let sum = 0;
    for (let i = a; i < b; i++) sum += freq[i];
    out[k] = sum / (b - a) / 255;
  }
  // Where the voice's energy sits, 0 (low) – 1 (high): the spectral
  // centroid across the same range, for the field's wavelength.
  let wsum = 0;
  let msum = 0;
  const lowBin = Math.floor(LOW_HZ / binHz);
  const highBin = Math.ceil(HIGH_HZ / binHz);
  for (let i = lowBin; i < highBin; i++) {
    wsum += i * freq[i];
    msum += freq[i];
  }
  if (msum > 0)
    brightness = Math.log(wsum / msum / lowBin) / Math.log(highBin / lowBin);
  // A slow automatic gain so a quiet take still moves the field —
  // floored, so the room's hiss never passes for a voice.
  peak = Math.max(peak * 0.998, ...out, 0.35);
  return out.map(v => Math.min(1, v / peak) ** 1.6);
};

const listen = () => {
  const talking = running && !voice.paused;
  const bands = talking ? voiceBands(BANDS) : null;
  loudness = bands ? bands.reduce((a, b) => a + b, 0) / bands.length : 0;
  spectrum = bands ?? [];
};

// ----- the field: the page listens -----
// Three hairline sound waves along the FOOT of the screen — a horizon
// under the page, and the one place the voice is drawn (the pill is
// only play and pause). Each stretch of each line answers its own band
// of the voice (the body of it at the centre, the air towards the
// sides, mirrored), and each strand reads the bands a little
// differently, so they move apart rather than in lockstep. Silence
// lays them flat; they travel only while there is voice to carry them.

const field = document.querySelector<HTMLCanvasElement>('.nar-field');
/** Mean band level this frame, 0–1 (set by listen). */
let loudness = 0;
/** The bars' bands this frame, centre first (set by listen). */
let spectrum: number[] = [];
/** Where the voice's energy sits, 0 low – 1 high (set by listen). */
let brightness = 0.3;
let heard: number[] = [];
let tone = 0.3;
let presence = 0;
let travel = 0;
let lastFrame = 0;
let fieldDirty = false;
// Where the horizon sits: low on the screen, clear of the content.
const HORIZON = 0.86;
// Three strands: wavelength, speed, how far along the spectrum each
// one reads (so each leans on different bands), weight and ink.
const STRANDS = [
  { k: 1, speed: 1, shift: 0, gain: 1, alpha: 1 },
  { k: 1.6, speed: -0.75, shift: 0.22, gain: 0.7, alpha: 0.6 },
  { k: 0.65, speed: 0.5, shift: -0.18, gain: 0.85, alpha: 0.45 },
];
// The field's ink: the page's own --ink, only ever at a whisper.
const INK = (() => {
  const hex = getComputedStyle(document.documentElement)
    .getPropertyValue('--ink')
    .trim()
    .replace('#', '');
  const n = parseInt(hex.length === 3 ? hex.replace(/./g, '$&$&') : hex, 16);
  return Number.isFinite(n)
    ? `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
    : '245, 245, 245';
})();

/** The heard level at a point along the spectrum, 0 centre – 1 edge. */
const levelAt = (u: number) => {
  const n = heard.length;
  if (!n) return 0;
  const f = Math.min(n - 1, Math.max(0, u * (n - 1)));
  const i = Math.floor(f);
  const t = f - i;
  return (heard[i] ?? 0) * (1 - t) + (heard[i + 1] ?? heard[i] ?? 0) * t;
};

const drawField = (now: number) => {
  if (!field || !narrator || narrator.hidden || reduceMotion) return;
  const dt = lastFrame ? Math.min(now - lastFrame, 64) : 16;
  lastFrame = now;
  const talking = running && !voice.paused;

  // Quick enough to follow the voice, eased enough not to twitch.
  if (heard.length !== spectrum.length && spectrum.length)
    heard = new Array(spectrum.length).fill(0);
  for (let i = 0; i < heard.length; i++) {
    const target = talking ? (spectrum[i] ?? 0) : 0;
    const d = target - heard[i];
    heard[i] += d * (d > 0 ? 0.3 : 0.12);
  }
  tone += (brightness - tone) * 0.08;
  presence += ((session && running ? 1 : 0) - presence) * 0.04;
  // They travel only on voice — a pause holds them where they are.
  travel += dt * 0.0024 * (0.1 + loudness);

  const g = field.getContext('2d');
  if (!g) return;
  if (presence < 0.004) {
    if (fieldDirty) {
      g.clearRect(0, 0, field.width, field.height);
      fieldDirty = false;
    }
    return;
  }
  fieldDirty = true;

  const w = window.innerWidth;
  const h = window.innerHeight;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  // Height too: a phone browser's bars collapse on scroll and the
  // viewport grows taller with the width unchanged — a canvas that kept
  // its old height was stretched, and the horizon drew far down the page.
  if (
    field.width !== Math.round(w * ratio) ||
    field.height !== Math.round(h * ratio)
  ) {
    field.width = Math.round(w * ratio);
    field.height = Math.round(h * ratio);
  }
  g.setTransform(ratio, 0, 0, ratio, 0, 0);
  g.clearRect(0, 0, w, h);

  const base = h * HORIZON;
  // Low voice → long, lazy waves; bright voice → tighter ones.
  const wavelength = 480 - 330 * Math.min(1, Math.max(0, tone));
  const reach = Math.min(h * 0.16, 140);

  g.lineWidth = 1;
  for (const strand of STRANDS) {
    // Secondary to the words on screen: at full voice it peaked at 23%
    // of the ink and pulled the eye off the page (Juan, 2026-10-05) —
    // it now peaks at 13%, still plainly moving with the voice.
    g.strokeStyle = `rgba(${INK}, ${(presence * strand.alpha * (0.04 + 0.09 * loudness)).toFixed(4)})`;
    g.beginPath();
    for (let x = 0; x <= w; x += 5) {
      const u = x / w;
      // Mirrored from the centre: body in the middle,
      // air towards both sides — read at this strand's own shift.
      const along = Math.min(
        1,
        Math.max(0, Math.abs(u - 0.5) * 2 + strand.shift),
      );
      const level = levelAt(along);
      // Flat at the screen's very edges, so the lines fade out rather
      // than being cut off.
      const edge = Math.sin(Math.PI * u);
      const y =
        base +
        Math.sin(
          ((x - w / 2) / wavelength) * Math.PI * 2 * strand.k +
            travel * strand.speed * Math.PI * 2,
        ) *
          reach *
          level *
          strand.gain *
          edge;
      if (x) g.lineTo(x, y);
      else g.moveTo(x, y);
    }
    g.stroke();
  }
};

// ----- read-along: the paragraph on screen paints in as it is said -----
// The paragraph Juan narrates is his take's own transcript, tidied (Juan,
// 2026-10-17), so it dims while its clip plays and each word lights up as
// he says it. When each word starts is worked out at build time
// (lib/narration: Spanish word by word, English and Chinese sentence by
// sentence on the Spanish clock) and rides on the paragraph as
// data-read-{lang}: [character offset, seconds] per word, joined here to
// the words this wraps by their offset (lib/readAlong cuts both). A clip
// with no paragraph on screen (the hero's intro, the footer's) is simply
// heard: the pill never carries words and never changes size.
const readable = (p: HTMLElement) => p.tagName === 'P';

type ReadWords = { spans: HTMLElement[]; times: number[] };
const readCache = new WeakMap<HTMLElement, ReadWords>();

/** The words of one language's text, wrapped once, each with its start. */
const wordsOf = (
  p: HTMLElement,
  root: HTMLElement,
  lang: string,
): ReadWords => {
  const cached = readCache.get(root);
  if (cached) return cached;
  const texts: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode())
    texts.push(n as Text);
  const spans: HTMLElement[] = [];
  const offsets: number[] = [];
  let at = 0;
  for (const node of texts) {
    const data = node.data;
    const tokens = readTokens(data);
    if (tokens.length) {
      const frag = document.createDocumentFragment();
      let last = 0;
      for (const tk of tokens) {
        if (tk.at > last) frag.append(data.slice(last, tk.at));
        const span = document.createElement('span');
        span.className = 'rw';
        span.textContent = tk.text;
        frag.append(span);
        spans.push(span);
        offsets.push(at + tk.at);
        last = tk.at + tk.text.length;
      }
      if (last < data.length) frag.append(data.slice(last));
      node.replaceWith(frag);
    }
    at += data.length;
  }
  const raw = p.dataset[`read${lang[0].toUpperCase()}${lang.slice(1)}`];
  const marks: ReadMark[] = raw ? JSON.parse(raw) : [];
  const byAt = new Map(marks.map(([o, t]) => [o, t]));
  // A word the build did not time (a mismatch) starts with the one before.
  const times: number[] = [];
  offsets.forEach((o, i) => {
    times.push(byAt.get(o) ?? (i ? times[i - 1] : 0));
  });
  const words = { spans, times };
  readCache.set(root, words);
  return words;
};

let reading: {
  p: HTMLElement;
  root: HTMLElement;
  /** The box the paragraph reads in: all of it dims, so the page shows
   *  two inks only — what is still to come, and what has been said. */
  box: HTMLElement;
  upTo: number;
} | null = null;

const endReading = () => {
  if (!reading) return;
  reading.p.classList.remove('is-reading');
  reading.box.classList.remove('is-read-along');
  for (const s of readCache.get(reading.root)?.spans ?? [])
    s.classList.remove('is-read');
  reading = null;
};

/** Keep the word being said in view inside its ten-line box. */
const keepInView = (span: HTMLElement) => {
  const box = span.closest<HTMLElement>('[data-cap]');
  if (!box || box.scrollHeight <= box.clientHeight + 2) return;
  const b = box.getBoundingClientRect();
  const r = span.getBoundingClientRect();
  if (r.bottom <= b.bottom - b.height * 0.25 && r.top >= b.top) return;
  box.scrollTo({
    top: box.scrollTop + (r.top - b.top) - b.height / 3,
    behavior: reduceMotion ? 'auto' : 'smooth',
  });
};

const updateRead = () => {
  // Kept while paused, so the page holds its place; cleared when the
  // session ends or moves to the next paragraph.
  const p =
    session && (running || voice.currentTime > 0)
      ? session.block.paras[session.para]
      : null;
  if (!p || !readable(p)) {
    endReading();
    return;
  }
  const lang = document.documentElement.dataset.lang ?? 'en';
  const root = p.querySelector<HTMLElement>(`:scope > .t[lang="${lang}"]`) ?? p;
  if (reading && (reading.p !== p || reading.root !== root)) endReading();
  const words = wordsOf(p, root, lang);
  if (!reading) {
    const box = p.closest<HTMLElement>('[data-cap]') ?? p.parentElement ?? p;
    reading = { p, root, box, upTo: 0 };
    p.classList.add('is-reading');
    box.classList.add('is-read-along');
  }
  const t = voice.currentTime || 0;
  let upTo = 0;
  while (upTo < words.times.length && words.times[upTo] <= t) upTo++;
  if (upTo === reading.upTo) return;
  // Paint forward, and back after a seek or a replay from the start.
  const lo = Math.min(upTo, reading.upTo);
  const hi = Math.max(upTo, reading.upTo);
  for (let i = lo; i < hi; i++)
    words.spans[i].classList.toggle('is-read', i < upTo);
  reading.upTo = upTo;
  if (upTo > 0) keepInView(words.spans[upTo - 1]);
};

// ----- placement: the narrator glides between its anchors -----
/** The anchors in play and how much of the page each one owns. */
let parks: { anchor: HTMLElement; w: number }[] = [];

// The hero's anchor: on a phone the narrator parks under the wordmark
// there, as it does on a desk, instead of in its corner (Juan, 2026-10-13).
const heroBox = document.getElementById('top');
const heroAnchor =
  heroBox?.querySelector<HTMLElement>('[data-narr-anchor]') ?? null;

// Every frame, not only on scroll: the anchors themselves move with the
// page's scroll-coupled motion.
const placeNarrator = () => {
  if (!narrator || narrator.hidden) return;
  // A phone's narrator never travels: it stays in its corner, shown
  // only while the screen holds a block it can tell — except on the
  // hero, where it stands centred under the name and fades as the hero
  // gives up the screen's middle, to come back in its corner. (A glide
  // from the one place to the other was tried, 2026-10-13, and read as
  // odd on a phone.)
  if (phone) {
    const hero = heroBox?.getBoundingClientRect();
    if (heroAnchor && hero && hero.bottom > innerHeight / 2 && !focusOpen()) {
      const r = heroAnchor.getBoundingClientRect();
      narrator.classList.add('is-parked');
      narrator.style.setProperty(
        '--park-x',
        `${(r.left + r.width / 2 - narrator.offsetWidth / 2).toFixed(1)}px`,
      );
      narrator.style.setProperty('--park-y', `${r.top.toFixed(1)}px`);
      const own = Math.min(
        1,
        (hero.bottom - innerHeight / 2) / (innerHeight / 4),
      );
      narrator.style.opacity = own < 0.999 ? own.toFixed(3) : '';
      narrator.style.pointerEvents = own < 0.6 ? 'none' : '';
      return;
    }
    narrator.classList.remove('is-parked');
    const has = !!showing && firstVoiced(showing) >= 0;
    narrator.style.opacity = has ? '' : '0';
    narrator.style.pointerEvents = has ? '' : 'none';
    return;
  }
  const width = narrator.offsetWidth;
  let sum = 0;
  let x = 0;
  let y = 0;
  for (const { anchor, w } of parks) {
    const r = anchor.getBoundingClientRect();
    const left =
      anchor.dataset.narrAlign === 'center'
        ? r.left + r.width / 2 - width / 2
        : r.left;
    sum += w;
    x += left * w;
    y += r.top * w;
  }
  if (sum > 0.0001)
    narrator.style.transform = `translate(${(x / sum).toFixed(1)}px, ${(y / sum).toFixed(1)}px)`;
  // Past the last narrated block (the page's foot) nothing owns the
  // narrator: it fades with the block that lets it go, instead of being
  // left standing wherever that block last put it.
  const own = Math.min(1, sum);
  narrator.style.opacity = own < 0.999 ? own.toFixed(3) : '';
  narrator.style.pointerEvents = own < 0.05 ? 'none' : '';
};

// ----- the narrator's tools: five seconds back, forward, and speed -----
const tools = document.querySelector<HTMLElement>('[data-nar-tools]');
const rateLabel = tools?.querySelector<HTMLElement>('[data-nar-rate]');
const speedButton = tools?.querySelector<HTMLElement>('[data-nar-speed]');
// Sound Shaper's speeds, as multiples of the voice's usual pace.
const SPEEDS = [1, 1.5, 2];
let speed = 0;

const applySpeed = () => {
  const rate = NARRATION_RATE * SPEEDS[speed];
  voice.defaultPlaybackRate = rate;
  voice.playbackRate = rate;
  if (rateLabel) rateLabel.textContent = `${SPEEDS[speed]}×`;
  speedButton?.classList.toggle('is-on', speed > 0);
};

speedButton?.addEventListener('click', () => {
  speed = (speed + 1) % SPEEDS.length;
  applySpeed();
});

tools?.querySelectorAll<HTMLElement>('[data-nar-skip]').forEach(button =>
  button.addEventListener('click', () => {
    if (!session) return;
    const d = voice.duration;
    const to = (voice.currentTime || 0) + Number(button.dataset.narSkip);
    // Past the end is the end: the clip finishes and the voice moves on.
    voice.currentTime = Math.max(
      0,
      Number.isFinite(d) ? Math.min(to, d - 0.05) : to,
    );
  }),
);

const toolButtons = [
  ...(tools?.querySelectorAll<HTMLElement>('.nar-tool') ?? []),
];

/** Out of the narrator while a clip is in play, at its opacity: the speed
 *  beside it and the two skips under it — an inverted L, mirrored in a
 *  phone's corner (speed to its left, skips above), where below and to
 *  the right is the screen's edge. Closed, each folds into its centre. */
const placeTools = () => {
  if (!tools || !narrator) return;
  const open = !!session && !narrator.hidden;
  if (tools.classList.contains('is-open') !== open) {
    tools.classList.toggle('is-open', open);
    for (const b of toolButtons) b.tabIndex = open ? 0 : -1;
  }
  const r = narrator.getBoundingClientRect();
  tools.style.transform = `translate(${r.left.toFixed(1)}px, ${r.top.toFixed(1)}px)`;
  const own = narrator.style.opacity;
  tools.style.opacity = own;
  tools.style.pointerEvents = 'none';
  const [speedTool, back, forward] = toolButtons;
  if (!speedTool) return;
  const size = speedTool.offsetWidth;
  const gap = 8;
  const mirrored = phone && !narrator.classList.contains('is-parked');
  const cx = r.width / 2 - size / 2;
  const cy = r.height / 2 - size / 2;
  const slots: [HTMLElement, number, number][] = mirrored
    ? [
        [speedTool, -gap - size, cy],
        [back, cx, -gap - size],
        [forward, cx, -2 * (gap + size)],
      ]
    : [
        [speedTool, r.width + gap, cy],
        [back, cx, r.height + gap],
        [forward, cx, r.height + gap + size + gap],
      ];
  for (const [el, x, y] of slots) {
    if (!el) continue;
    el.style.setProperty('--dx', `${x.toFixed(1)}px`);
    el.style.setProperty('--dy', `${y.toFixed(1)}px`);
    el.style.setProperty('--hx', `${cx.toFixed(1)}px`);
    el.style.setProperty('--hy', `${cy.toFixed(1)}px`);
  }
};

const animateNarrator = (now: number) => {
  updateRead();
  placeNarrator();
  placeTools();
  listen();
  drawField(now);
  requestAnimationFrame(animateNarrator);
};

// ----- the session -----
const stop = () => {
  voice.pause();
  session = null;
  running = false;
  paint();
};

const start = (block: Narr, para: number) => {
  const p = block.paras[para];
  const src = p && clipOf(p);
  if (!src) {
    stop();
    return;
  }
  ensureGraph();
  ctx?.resume();
  session = { block, para };
  running = true;
  voice.src = src;
  applySpeed();
  voice.play().catch(() => stop());
  paint();
  // Whatever shows this paragraph can follow the voice to it (a deck
  // turns to the card being told).
  document.dispatchEvent(new CustomEvent('narr:para', { detail: p }));
};

const pause = () => {
  running = false;
  voice.pause();
  paint();
};

const resume = () => {
  running = true;
  ctx?.resume();
  voice.play().catch(() => stop());
  paint();
};

// The voice is heard THROUGH the AudioContext, and iOS suspends that the
// moment the page goes to the background while the <audio> element keeps
// running — so the Dynamic Island showed a clip advancing in silence. The
// narration follows the page's scroll anyway, so it pauses with the page.
document.addEventListener('visibilitychange', () => {
  if (document.hidden && running) pause();
});

// The system's own controls (Lock Screen, Dynamic Island) go through the
// session, never straight to the element, so the pill and the graph stay
// in step with them.
if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('play', () => {
    if (session) resume();
  });
  navigator.mediaSession.setActionHandler('pause', () => pause());
}

const scrollToStep = (story: Story, index: number) => {
  const top =
    story.root.getBoundingClientRect().top +
    window.scrollY +
    index * window.innerHeight;
  window.scrollTo({
    top,
    behavior: reduceMotion ? 'auto' : 'smooth',
  });
};

// A paragraph ends: the next one in the block, or the page turns and
// the render loop picks the voice up wherever it lands (`follow`).
voice.addEventListener('ended', () => {
  if (!session || !running) return;
  const { block, para } = session;
  // A shared address's modal tells its own thing and nothing past it: a
  // card opened alone ends with its clip, an app with its last card.
  const inFocus = block.el.hasAttribute('data-focused');
  if (inFocus && block.el.hasAttribute('data-focus-lone')) {
    stop();
    return;
  }
  const next = firstVoiced(block, para + 1);
  if (next >= 0) {
    start(block, next);
    return;
  }
  if (inFocus) {
    stop();
    return;
  }
  const story = block.story;
  if (block.panel) {
    // A panel hands over to the next panel, if there is one.
    const next = panels[panels.indexOf(block) + 1];
    if (next) scrollToPanel(next);
    else stop();
  } else if (!story) {
    // The hero hands over to the first story's opener.
    if (stories[0]) scrollToStep(stories[0], 0);
    else if (panels[0]) scrollToPanel(panels[0]);
    else stop();
  } else if (block.step + 1 < story.steps.length) {
    scrollToStep(story, block.step + 1);
  } else {
    // A story's last slide hands over to the next story's opener, and
    // the last story to the first panel — the pitch runs to the foot.
    const next = stories[stories.indexOf(story) + 1];
    if (next) scrollToStep(next, 0);
    else if (panels[0]) scrollToPanel(panels[0]);
    else stop();
  }
});

// The box a panel owns on the page. Usually its section; a phone
// story's two stops share one stuck screen, so each owns its STEP — the
// screen of scroll its walk takes — while the scroll timeline runs.
const boxOf = (el: HTMLElement): HTMLElement => {
  const holder = el.closest<HTMLElement>('[data-m-step]');
  if (holder) {
    const step = holder
      .closest('.m-story')
      ?.querySelectorAll<HTMLElement>('.m-step')[Number(holder.dataset.mStep)];
    if (step && step.getClientRects().length) return step;
    // No scroll timeline: the stops are plain panels, each its own box.
    return (
      holder
        .closest('.m-story')
        ?.querySelector<HTMLElement>(
          `.m-panel[data-m-step="${holder.dataset.mStep}"]`,
        ) ?? holder
    );
  }
  return el.closest<HTMLElement>('section') ?? el;
};

const scrollToPanel = (panel: Narr) =>
  window.scrollTo({
    top: boxOf(panel.el).getBoundingClientRect().top + window.scrollY,
    behavior: reduceMotion ? 'auto' : 'smooth',
  });

// The page moved under a running voice — by hand or by the voice's own
// page turn. The voice goes where the page went; a block with nothing
// recorded ends the pitch.
const follow = (block: Narr | undefined) => {
  const para = block ? startOf(block) : -1;
  if (block && para >= 0) start(block, para);
  else stop();
};

// A block turned to another paragraph by hand (a deck): a running voice
// switches to it; a paused one will start there.
document.addEventListener('narr:select', e => {
  const p = (e as CustomEvent<HTMLElement>).detail;
  if (!session) return;
  const i = session.block.paras.indexOf(p);
  if (i < 0 || i === session.para) return;
  if (running) start(session.block, i);
  else {
    session = { block: session.block, para: i };
    const src = clipOf(p);
    if (src) voice.src = src;
    paint();
  }
});

// The game has its own music: starting it quiets the voice, which
// resumes from the same sentence on the next press.
document.addEventListener('arcade:start', () => {
  if (running) pause();
});

// A language switch changes only which paragraph paints: the voice is the
// same Spanish take in every language, so it plays on (the read-along
// reads the page's language each frame).

// One control. Pressed on the block being told, it pauses or resumes;
// anywhere else, it starts telling what the page is showing.
narrator?.addEventListener('click', () => {
  if (session && session.block === showing) {
    if (running) pause();
    else resume();
    return;
  }
  const block = showing ?? narrs[0];
  if (block) start(block, Math.max(startOf(block), 0));
});

const collect = (
  el: HTMLElement,
  story: Story | null,
  step: number,
  panel = false,
) => {
  const n: Narr = {
    el,
    paras: [...el.querySelectorAll<HTMLElement>('[data-narr-para]')],
    // A block's anchor is inside it — unless the story placed it
    // elsewhere by name, as the opener does (in its foot).
    anchor:
      story?.root.querySelector<HTMLElement>(`[data-narr-anchor="${step}"]`) ??
      el.querySelector<HTMLElement>('[data-narr-anchor]'),
    story,
    step,
    panel,
  };
  // While a block is being told, its paragraphs are tappable too.
  n.paras.forEach((p, i) =>
    p.addEventListener('click', () => {
      if (session?.block === n && clipOf(p)) start(n, i);
    }),
  );
  narrs.push(n);
  return n;
};

const heroEl = document.querySelector<HTMLElement>('[data-narr-block="hero"]');
const heroNarr = heroEl ? collect(heroEl, null, -1) : undefined;

const stories: Story[] = (
  phone ? [] : [...document.querySelectorAll<HTMLElement>('[data-story]')]
).map(root => {
  const story: Story = {
    root,
    steps: [...root.querySelectorAll<HTMLElement>('.step')],
    stage: root.querySelector<HTMLElement>('.stage'),
    intro: root.querySelector<HTMLElement>('.intro-scene'),
    float: root.querySelector<HTMLElement>('.float'),
    deck: null,
    lockup: root.querySelector<HTMLElement>('.lockup'),
    anchorBig: root.querySelector<HTMLElement>('.lockup-anchor-big'),
    anchorSmall: root.querySelector<HTMLElement>('.lockup-anchor-small'),
    actions: root.querySelector<HTMLElement>('.actions'),
    actionsBig: root.querySelector<HTMLElement>('.actions-anchor-big'),
    actionsSmall: root.querySelector<HTMLElement>('.actions-anchor-small'),
    blocks: [],
  };
  for (const el of root.querySelectorAll<HTMLElement>('[data-narr-block]')) {
    const step = Number(el.dataset.narrBlock);
    story.blocks[step] = collect(el, story, step);
  }

  // THE DECK. Its block is every card's paragraphs in order; it starts
  // on the card in front, a running voice switches to it, and a clip
  // that moves to another card's paragraph turns the deck there.
  const deckEl = root.querySelector<HTMLElement>('.deck');
  if (deckEl) {
    const cards = [...deckEl.querySelectorAll<HTMLElement>('.card')];
    const paras = [...deckEl.querySelectorAll<HTMLElement>('[data-narr-para]')];
    const still = deckEl.querySelector<HTMLElement>(
      '.narr-static .narr-anchor',
    );
    // Stand the still anchor on the current card's slot. Only the slot's
    // HEIGHT is read: the card's sideways slide never moves it.
    const standAnchor = () => {
      const slot = cards[story.deck?.current ?? 0].querySelector('.narr-slot');
      if (!still || !slot) return;
      const y =
        slot.getBoundingClientRect().top - deckEl.getBoundingClientRect().top;
      still.style.setProperty('--slot-y', `${y.toFixed(1)}px`);
    };
    story.deck = createDeck({
      cards,
      controls: deckEl.querySelector('[data-deck-controls]'),
      keys: deckEl,
      // A tablet's finger turns it too.
      swipe: deckEl.querySelector<HTMLElement>('.deck-stage'),
      onChange: current => {
        // A frame later: the first call comes while the deck is still
        // being made.
        requestAnimationFrame(standAnchor);
        const first = paras.find(p => p.dataset.card === String(current));
        if (!first) return;
        deckEl.dataset.narrStart = String(paras.indexOf(first));
        document.dispatchEvent(
          new CustomEvent('narr:select', { detail: first }),
        );
      },
    });
    document.addEventListener('narr:para', e => {
      const p = (e as CustomEvent<HTMLElement>).detail;
      if (!deckEl.contains(p)) return;
      const i = Number(p.dataset.card);
      if (story.deck && i !== story.deck.current) story.deck.go(i);
    });
    window.addEventListener('resize', standAnchor, { passive: true });
    // Late fonts, a language switch: whatever reflows the words.
    watchSlots(cards, standAnchor);
  }
  return story;
});

// Only the panels this layout draws: the phone's story panels are not
// drawn on desktop, and must not join its hand-over chain.
const panels = [...document.querySelectorAll<HTMLElement>('[data-narr-panel]')]
  .filter(el => el.getClientRects().length > 0)
  .map(el => collect(el, null, -1, true));

// Nothing recorded anywhere → no narrator at all.
if (narrator && narrs.length) {
  narrator.hidden = false;
  requestAnimationFrame(animateNarrator);
}

const docks = phone
  ? [...document.querySelectorAll<HTMLElement>('[data-dock]')]
  : [];

// The hero rides out as the first story rides in.
const heroInner = document.querySelector<HTMLElement>('[data-hero-inner]');

const render = (force = false) => {
  // A shared address's modal (lib/links) owns the narrator outright: it
  // covers the page, so nothing under it is showing.
  const focused = focusOpen()
    ? panels.find(n => n.el.hasAttribute('data-focused'))
    : undefined;
  if (focused) {
    parks = focused.anchor ? [{ anchor: focused.anchor, w: 1 }] : [];
    showing = focused;
    for (const dock of docks) {
      const mine = focused.el.contains(dock);
      dock.style.opacity = mine ? '1' : '0';
      dock.style.visibility = mine ? 'visible' : 'hidden';
      dock.style.pointerEvents = mine ? '' : 'none';
    }
    if (session && running && showing !== session.block) follow(showing);
    placeNarrator();
    return;
  }
  const vh = window.innerHeight;
  const hp = step(clamp(window.scrollY / vh, 0, 1));

  // Where the narrator stands: a weighted blend of every anchor, each
  // weighted by how much of the page its block owns right now — so it
  // glides between blocks as the page scrolls, never jumps.
  parks = [];
  if (heroNarr?.anchor) parks.push({ anchor: heroNarr.anchor, w: 1 - hp });
  showing = heroNarr && window.scrollY < vh * 0.5 ? heroNarr : undefined;

  if (heroInner) {
    heroInner.style.opacity = String(clamp(1 - hp * 1.1, 0, 1));
    heroInner.style.transform = reduceMotion
      ? ''
      : `scale(${1 - hp * 0.08}) translateY(${(-hp * 0.06 * vh).toFixed(1)}px)`;
  }

  // A panel owns the narrator in proportion to how much of it is on
  // screen — the same glide a story hands over with — and owns the
  // voice once it holds the middle of the screen.
  for (const n of panels) {
    const rect = boxOf(n.el).getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > vh) continue;
    // In by how far it has come up, out by how far it has gone — the
    // story rule, so two panels in a row cross-fade it at their seam.
    const own =
      step(clamp(1 - rect.top / vh, 0, 1)) *
      step(clamp(rect.bottom / vh, 0, 1));
    if (n.anchor && own > 0) parks.push({ anchor: n.anchor, w: own * hp });
    if (!showing && rect.top < vh * 0.5 && rect.bottom > vh * 0.5) showing = n;
  }

  for (const s of stories) {
    const rect = s.root.getBoundingClientRect();
    // The forced pass places every layer once at load, so nothing is
    // ever seen unstyled when a story first scrolls in.
    if (!force && (rect.bottom < 0 || rect.top > vh)) continue;

    const p = step(clamp(-rect.top / vh, 0, 1));
    const active = Math.round(p);

    // Each stop owns the narrator in a tent around its position. A story
    // lets go as it scrolls off, so whatever comes up under it — the
    // next story, the game — takes the narrator over smoothly; and a
    // story coming up takes it by how far it has come in, so two meeting
    // cross-fade it (out + in = 1 at the seam), the same glide the hero
    // hands over with.
    const out = step(clamp(rect.bottom / vh, 0, 1));
    const enter = step(clamp(1 - rect.top / vh, 0, 1));
    for (let k = 0; k < 2; k++) {
      const own = Math.max(0, 1 - Math.abs(p - k));
      const block = s.blocks[k];
      if (own > 0 && block?.anchor)
        parks.push({ anchor: block.anchor, w: own * enter * out });
    }
    if (!showing) showing = s.blocks[active];

    // The opener fades as the deck arrives.
    if (s.intro) {
      s.intro.style.opacity = String(clamp(1 - p * 2.2, 0, 1));
      s.intro.style.pointerEvents = p < 0.5 ? 'auto' : 'none';
    }

    // The words arrive once the opener is mostly gone; the phone walks
    // in from its peek across the whole step; the neighbours are dealt
    // once the deck is the page.
    if (s.float) {
      s.float.style.setProperty(
        '--float-in',
        reduceMotion
          ? p >= 0.5
            ? '1'
            : '0'
          : String(clamp((p - 0.35) * 2.4, 0, 1)),
      );
      const peek = reduceMotion ? (p < 0.5 ? 1 : 0) : 1 - smooth(p);
      s.float.style.setProperty('--peek', peek.toFixed(4));
      s.float.classList.toggle('is-dealt', p > 0.6);
    }

    // The lockup FLIPs from the opener header to the deck's corner and
    // parks there — one element, never redrawn.
    const q = reduceMotion ? (p >= 0.5 ? 1 : 0) : smooth(p);
    if (s.lockup && s.stage && s.anchorBig && s.anchorSmall) {
      const stageRect = s.stage.getBoundingClientRect();
      const big = s.anchorBig.getBoundingClientRect();
      const small = s.anchorSmall.getBoundingClientRect();
      const scale = 1 + (small.height / big.height - 1) * q;
      const x = big.left - stageRect.left + (small.left - big.left) * q;
      const y = big.top - stageRect.top + (small.top - big.top) * q;
      s.lockup.style.transform =
        `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) ` +
        `scale(${scale.toFixed(4)})`;
    }

    // The action row makes the same trip, toward the deck's foot. It
    // never scales: both store programs set a minimum badge height, so
    // the badges keep the size they were measured at. It belongs to the
    // OPENER and leaves with it.
    if (s.actions && s.stage && s.actionsBig && s.actionsSmall) {
      const stageRect = s.stage.getBoundingClientRect();
      const big = s.actionsBig.getBoundingClientRect();
      const small = s.actionsSmall.getBoundingClientRect();
      const x = big.left - stageRect.left + (small.left - big.left) * q;
      const y = big.top - stageRect.top + (small.top - big.top) * q;
      s.actions.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      const rowVis = reduceMotion
        ? p < 0.5
          ? 1
          : 0
        : clamp(1 - p * 2.2, 0, 1);
      s.actions.style.opacity = String(rowVis);
      s.actions.style.pointerEvents = rowVis > 0.5 ? 'auto' : 'none';
    }
  }

  // A phone deck's controls dock beside the corner narrator, and fade
  // WITH the scroll — in as their deck comes onto the screen, out as it
  // leaves. A class flipped at mid-screen cut them in and out.
  for (const dock of docks) {
    const r = boxOf(dock).getBoundingClientRect();
    const shown = (Math.min(r.bottom, vh) - Math.max(r.top, 0)) / vh;
    const o = clamp((shown - 0.45) / 0.4, 0, 1);
    dock.style.opacity = o.toFixed(3);
    dock.style.visibility = o < 0.02 ? 'hidden' : 'visible';
    dock.style.pointerEvents = o < 0.6 ? 'none' : '';
  }

  if (session && running && showing !== session.block) follow(showing);

  placeNarrator();
};

// A boolean "already scheduled" guard DEADLOCKS: if the frame it is
// waiting on never runs — a hidden tab, a backgrounded window — the
// flag stays set and the scene never renders again, even once the
// page is visible. Replacing the pending frame instead can't get
// stuck, and the visibility handler catches up whatever was missed.
let frame = 0;
const onScroll = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => render());
};

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) render(true);
});

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });

// The FLIP anchors sit inside `[data-reveal]` blocks, which enter 20px
// low — measure during that and the row parks 20px off its anchor for
// good, since nothing re-measures until the next scroll. Re-render
// when a reveal settles.
document.addEventListener(
  'transitionend',
  event => {
    const target = event.target as HTMLElement;
    if (target?.hasAttribute?.('data-reveal')) render(true);
  },
  { passive: true },
);

render(true);

// Closing the modal ends what it was telling — the page under it is at
// its top, and a voice running on would start the hero's — and the page
// takes the narrator back.
document.addEventListener('focus:close', stop);
document.addEventListener('focus:closed', () => render(true));

// Transitions switch on only AFTER the first placement, so nothing
// animates in from nowhere on load.
// ---------- the phone's decks ----------
// The same deck as the desktop's, welcome first. The narrator starts the
// panel on the card in front (data-narr-start = that card's first
// paragraph), a running voice switches to it, and a clip that moves on
// to another card's paragraph turns the deck there.
if (phone)
  for (const panel of document.querySelectorAll<HTMLElement>('.m-deck')) {
    const stage = panel.querySelector<HTMLElement>('.m-stage');
    const paras = [...panel.querySelectorAll<HTMLElement>('[data-narr-para]')];
    const deck = createDeck({
      cards: [...panel.querySelectorAll<HTMLElement>('.m-card')],
      controls:
        panel
          .closest('.m-story')
          ?.querySelector<HTMLElement>('[data-deck-controls]') ?? null,
      keys: null,
      swipe: stage,
      onChange: current => {
        const first = paras.find(p => p.dataset.card === String(current));
        if (!first) return;
        panel.dataset.narrStart = String(paras.indexOf(first));
        document.dispatchEvent(
          new CustomEvent('narr:select', { detail: first }),
        );
      },
    });
    document.addEventListener('narr:para', e => {
      const p = (e as CustomEvent<HTMLElement>).detail;
      if (!panel.contains(p)) return;
      const i = Number(p.dataset.card);
      if (i !== deck.current) deck.go(i);
    });
  }

if (stepped)
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      document.documentElement.classList.add('is-stepped'),
    ),
  );
