/**
 * SOUND SHAPER'S SHAPE SHEET, ON THE WEB — the numbers and the graph of
 * the app's own engine (sound-shaper: src/lib/shapeDsp.ts, audioEngine.ts,
 * eqResponse.ts, store/shaper.ts, lib/player.ts), rebuilt with the Web
 * Audio API for the Songs card (SongsPlayer). The app's engine IS Web
 * Audio (react-native-audio-api), so this is a port, not an imitation:
 * the same presets, the same five bands and ranges, the same speeds, the
 * same Echo and Next Room with their measured levels and trims. When one
 * changes in the app, it changes here.
 *
 *   media → trim → 5 bands → 3 walls → wallTrim → [echo] → echoTrim → out
 *
 * Read-only: nothing is saved, and nothing leaves the page.
 */

// ---------- the numbers (shapeDsp.ts, store/shaper.ts, lib/player.ts) ----------

export type Level = 'off' | 'low' | 'medium' | 'high';
export const LEVELS: Level[] = ['off', 'low', 'medium', 'high'];

/** The five bands: shelves at the ends, peaks between (Q 1). */
export const BANDS = [
  { hz: 80, label: '80', type: 'lowshelf' },
  { hz: 250, label: '250', type: 'peaking', q: 1 },
  { hz: 1000, label: '1k', type: 'peaking', q: 1 },
  { hz: 4000, label: '4k', type: 'peaking', q: 1 },
  { hz: 12000, label: '12k', type: 'highshelf' },
] as const;
export const EQ_MIN_DB = -12;
export const EQ_MAX_DB = 12;

/** Loudness-matched tilts, whole dB, in the bands' order. */
export const PRESETS = [
  { id: 'flat', gains: [0, 0, 0, 0, 0] },
  { id: 'bass', gains: [3, 2, 0, -1, -2] },
  { id: 'vocal', gains: [-4, -2, 2, 3, -2] },
  { id: 'treble', gains: [-2, -2, 0, 1, 4] },
  { id: 'warm', gains: [2, 2, -1, -3, -5] },
  { id: 'bright', gains: [-3, -2, 2, 4, 2] },
] as const;
export type PresetId = (typeof PRESETS)[number]['id'];

/** The preset these gains are, or null: a hand-shaped curve (Custom). */
export const presetOf = (gains: number[]): PresetId | null =>
  PRESETS.find(p => p.gains.every((g, i) => g === gains[i]))?.id ?? null;

export const RATE_MIN = 0.75;
export const RATE_MAX = 1.25;
export const RATE_STEP = 0.05;
export const RATE_LAST_STOP = Math.round((RATE_MAX - RATE_MIN) / RATE_STEP);
export const stopToRate = (stop: number) =>
  Number(
    Math.min(
      RATE_MAX,
      Math.max(RATE_MIN, RATE_MIN + Math.round(stop) * RATE_STEP),
    ).toFixed(2),
  );
export const rateToStop = (rate: number) =>
  Math.round((rate - RATE_MIN) / RATE_STEP);

/** Next Room: three high shelves whose stacked cuts make a wall's tilt. */
const WALL_HZ = [500, 1500, 4000];
const WALL: Record<
  Exclude<Level, 'off'>,
  { depthDb: number; trimDb: number }
> = {
  low: { depthDb: -8, trimDb: -0.75 },
  medium: { depthDb: -11, trimDb: -1.0 },
  high: { depthDb: -14, trimDb: -1.25 },
};
const WALL_SWEEP = 0.2;

/** Echo: repeats 28 ms apart, under the ear's fusion threshold. */
const ECHO_DELAY = 0.028;
const ECHO: Record<
  Exclude<Level, 'off'>,
  { feedback: number; trimDb: number }
> = {
  low: { feedback: 0.3, trimDb: -3.0 },
  medium: { feedback: 0.4, trimDb: -4.5 },
  high: { feedback: 0.45, trimDb: -5.5 },
};
const ECHO_FLOOR = 0.03;
const ECHO_FADE = 0.08;
const ECHO_REWIRE_GAP_MS = 120;

/** A one-pole slide, so no move clicks or zippers. */
const RAMP = 0.012;

// ---------- the headroom trim (eqResponse.ts) ----------
// The curve's own peak, swept 20 Hz–20 kHz through the same RBJ biquads
// the browser runs, plus 1.5 dB: a boost never clips.

type C = { b0: number; b1: number; b2: number; a1: number; a2: number };
const norm = (
  b0: number,
  b1: number,
  b2: number,
  a0: number,
  a1: number,
  a2: number,
): C => ({
  b0: b0 / a0,
  b1: b1 / a0,
  b2: b2 / a0,
  a1: a1 / a0,
  a2: a2 / a0,
});
const coefficients = (type: string, f: number, gain: number, q = 1): C => {
  const a = Math.pow(10, gain / 40);
  const w0 = Math.PI * f;
  const cos = Math.cos(w0);
  if (type === 'peaking') {
    const alpha = Math.sin(w0) / (2 * q);
    return norm(
      1 + alpha * a,
      -2 * cos,
      1 - alpha * a,
      1 + alpha / a,
      -2 * cos,
      1 - alpha / a,
    );
  }
  const g = 2 * Math.sqrt(a) * 0.5 * Math.sin(w0) * Math.SQRT2;
  return type === 'lowshelf'
    ? norm(
        a * (a + 1 - (a - 1) * cos + g),
        2 * a * (a - 1 - (a + 1) * cos),
        a * (a + 1 - (a - 1) * cos - g),
        a + 1 + (a - 1) * cos + g,
        -2 * (a - 1 + (a + 1) * cos),
        a + 1 + (a - 1) * cos - g,
      )
    : norm(
        a * (a + 1 + (a - 1) * cos + g),
        -2 * a * (a - 1 + (a + 1) * cos),
        a * (a + 1 + (a - 1) * cos - g),
        a + 1 - (a - 1) * cos + g,
        2 * (a - 1 - (a + 1) * cos),
        a + 1 - (a - 1) * cos - g,
      );
};
const magnitude = (c: C, f: number) => {
  const w = -Math.PI * f;
  const zr = Math.cos(w);
  const zi = Math.sin(w);
  const nr = c.b1 + c.b2 * zr;
  const ni = c.b2 * zi;
  const dr = c.a1 + c.a2 * zr;
  const di = c.a2 * zi;
  return (
    Math.hypot(c.b0 + nr * zr - ni * zi, nr * zi + ni * zr) /
    Math.hypot(1 + dr * zr - di * zi, dr * zi + di * zr)
  );
};
export const headroomTrimDb = (gains: number[], sampleRate: number) => {
  if (gains.every(g => g === 0)) return 0;
  const nyquist = sampleRate / 2;
  const cs = BANDS.map((b, i) =>
    coefficients(b.type, b.hz / nyquist, gains[i] ?? 0, 'q' in b ? b.q : 1),
  );
  let peak = 0;
  for (let p = 0; p <= 128; p++) {
    const hz = 20 * Math.pow(1000, p / 128);
    if (hz >= nyquist) break;
    peak = Math.max(
      peak,
      cs.reduce((m, c) => m * magnitude(c, hz / nyquist), 1),
    );
  }
  return -(Math.max(0, 20 * Math.log10(peak)) + 1.5);
};

// ---------- the engine (audioEngine.ts) ----------

export type Shape = {
  gains: number[];
  rate: number;
  keepPitch: boolean;
  echo: Level;
  nextRoom: Level;
};
export const flatShape = (): Shape => ({
  gains: [0, 0, 0, 0, 0],
  rate: 1,
  keepPitch: true,
  echo: 'off',
  nextRoom: 'off',
});

const dbToLinear = (db: number) => Math.pow(10, db / 20);

/** The echo as an impulse: the dry spike, then the decaying repeats. */
const echoImpulse = (ctx: AudioContext, feedback: number) => {
  const taps = [{ at: 0, gain: 1 }];
  for (let g = feedback, n = 1; g > ECHO_FLOOR; g *= feedback, n++)
    taps.push({ at: Math.round(ECHO_DELAY * n * ctx.sampleRate), gain: g });
  const length = taps[taps.length - 1].at + 1;
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (const t of taps) data[t.at] = t.gain;
  }
  return buffer;
};

/**
 * One <audio> heard through the Shape graph. Built on the first play (a
 * browser opens an AudioContext only from a gesture); the shape set before
 * then is applied as it is built.
 */
export const createShaper = (audio: HTMLAudioElement) => {
  const shape = flatShape();
  let g: {
    ctx: AudioContext;
    trim: GainNode;
    bands: BiquadFilterNode[];
    walls: BiquadFilterNode[];
    wallTrim: GainNode;
    echo: ConvolverNode | null;
    echoTrim: GainNode;
    echoLevel: Level;
  } | null = null;
  let echoTimer = 0;

  const write = (param: AudioParam, value: number, now: number) =>
    param.setTargetAtTime(value, now, RAMP);
  const ramp = (
    param: AudioParam,
    value: number,
    now: number,
    seconds: number,
  ) => {
    param.cancelScheduledValues(now);
    param.setValueAtTime(param.value, now);
    param.linearRampToValueAtTime(value, now + seconds);
  };

  const applyEcho = () => {
    if (!g) return;
    const { ctx, wallTrim, echoTrim } = g;
    const level = shape.echo;
    const target = level === 'off' ? 1 : dbToLinear(ECHO[level].trimDb);
    clearTimeout(echoTimer);
    if (g.echoLevel === level) {
      ramp(echoTrim.gain, target, ctx.currentTime, ECHO_FADE);
      return;
    }
    // A new level is a new impulse: rewired under a mute, as the app does.
    ramp(echoTrim.gain, 0, ctx.currentTime, ECHO_FADE);
    echoTimer = window.setTimeout(
      () => {
        if (!g) return;
        wallTrim.disconnect();
        g.echo?.disconnect();
        g.echo = null;
        if (level !== 'off') {
          const echo = ctx.createConvolver();
          echo.normalize = false;
          echo.buffer = echoImpulse(ctx, ECHO[level].feedback);
          wallTrim.connect(echo).connect(echoTrim);
          g.echo = echo;
        } else wallTrim.connect(echoTrim);
        g.echoLevel = level;
        const now = ctx.currentTime;
        echoTrim.gain.cancelScheduledValues(now);
        echoTrim.gain.setValueAtTime(0, now);
        echoTrim.gain.linearRampToValueAtTime(target, now + ECHO_FADE);
      },
      ECHO_FADE * 1000 + ECHO_REWIRE_GAP_MS,
    );
  };

  const push = () => {
    audio.playbackRate = shape.rate;
    audio.preservesPitch = shape.keepPitch;
    (
      audio as HTMLAudioElement & { webkitPreservesPitch?: boolean }
    ).webkitPreservesPitch = shape.keepPitch;
    if (!g) return;
    const now = g.ctx.currentTime;
    shape.gains.forEach((db, i) => write(g!.bands[i].gain, db, now));
    write(
      g.trim.gain,
      dbToLinear(headroomTrimDb(shape.gains, g.ctx.sampleRate)),
      now,
    );
    const depth = shape.nextRoom === 'off' ? 0 : WALL[shape.nextRoom].depthDb;
    for (const wall of g.walls) ramp(wall.gain, depth, now, WALL_SWEEP);
    ramp(
      g.wallTrim.gain,
      shape.nextRoom === 'off' ? 1 : dbToLinear(WALL[shape.nextRoom].trimDb),
      now,
      WALL_SWEEP,
    );
    applyEcho();
  };

  const build = () => {
    const ctx = new AudioContext();
    let node: AudioNode = ctx.createMediaElementSource(audio);
    const trim = ctx.createGain();
    node = node.connect(trim);
    const bands = BANDS.map(b => {
      const f = ctx.createBiquadFilter();
      f.type = b.type;
      f.frequency.value = b.hz;
      if ('q' in b) f.Q.value = b.q;
      f.gain.value = 0;
      return f;
    });
    const walls = WALL_HZ.map(hz => {
      const f = ctx.createBiquadFilter();
      f.type = 'highshelf';
      f.frequency.value = hz;
      f.gain.value = 0;
      return f;
    });
    for (const f of [...bands, ...walls]) node = node.connect(f);
    const wallTrim = ctx.createGain();
    const echoTrim = ctx.createGain();
    node.connect(wallTrim).connect(echoTrim).connect(ctx.destination);
    g = {
      ctx,
      trim,
      bands,
      walls,
      wallTrim,
      echo: null,
      echoTrim,
      echoLevel: 'off',
    };
    push();
  };

  return {
    shape,
    /** Call from the gesture that plays: builds the graph, wakes it. */
    wake() {
      if (!g) build();
      if (g!.ctx.state !== 'running') void g!.ctx.resume();
    },
    set(next: Partial<Shape>) {
      Object.assign(shape, next);
      push();
    },
    /** The speed and pitch again: a new source resets them in some browsers. */
    reapplyRate() {
      audio.playbackRate = shape.rate;
      audio.preservesPitch = shape.keepPitch;
    },
  };
};
