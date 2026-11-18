/**
 * STUDIO PARAMETER SCOPES — Sound Shaper Web's `Scopes.tsx` & `analyser.ts`,
 * ported 1:1 to vanilla DOM for `SongsPlayer.astro`.
 *
 * Geometry & craft rules:
 * - Single compact height (`SCOPE_HEIGHT = 38`) standardized across Equalizer,
 *   Echo, and Next Room.
 * - Every `.scope-line` stays within `[LINE_PAD_Y, SCOPE_HEIGHT - LINE_PAD_Y]`
 *   (`6.5 px` clear of both top and `border-bottom`) so the stroke and its
 *   glow never touch or blend into `var(--separator)`, while area washes and
 *   live spectrum traces anchor flush edge-to-edge.
 * - One-shot ink/wash entrance (`data-ink-state`), critically damped spring
 *   posture (`SPRING_OMEGA = 19`), and smooth spectrum melt on Pause.
 */
import {
  BANDS,
  coefficients,
  ECHO,
  EQ_MAX_DB,
  magnitude,
  WALL,
  WALL_HZ,
  type BiquadCoeffs,
  type Level,
  type Shape,
} from './shaper';

export const SCOPE_HEIGHT = 38;
const LINE_PAD_Y = 6.5;

const NYQUIST = 24000;
const F_LO = 40;
const F_HI = 16000;
const SPEC_LO = 45;
const SPEC_HI = 13500;
const NODE_R = 2;
const SPRING_OMEGA = 19;
const INK_SETTLE_MS = 680;
const EDIT_WAKE_MS = 650;

const FFT_SIZE = 2048;
const BIN_COUNT = FFT_SIZE / 2;
const MIN_DB = -84;
const MAX_DB = -10;
const DB_SPAN = MAX_DB - MIN_DB;

const SVG_NS = 'http://www.w3.org/2000/svg';

const freqScratch = new Float32Array(BIN_COUNT);
const waveScratch = new Float32Array(FFT_SIZE);

const prefersReducedMotion = (): boolean =>
  typeof matchMedia === 'function' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

const isTabHidden = (): boolean =>
  typeof document !== 'undefined' && document.hidden;

const stepEnvelope = (
  current: number,
  target: number,
  dtSeconds: number,
  attackS = 0.12,
  releaseS = 0.42,
): number => {
  const tau = target > current ? attackS : releaseS;
  const alpha = 1 - Math.exp(-Math.max(0, dtSeconds) / tau);
  return current + (target - current) * alpha;
};

type AudioSample = {
  active: boolean;
  rms: number;
};

function sampleAnalyser(
  analyser: AnalyserNode | null,
  spectrumOut?: Float32Array,
  fLo = 20,
  fHi = 20000,
): AudioSample {
  if (!analyser || analyser.context.state !== 'running') {
    spectrumOut?.fill(0);
    return { active: false, rms: 0 };
  }

  analyser.getFloatTimeDomainData(waveScratch);
  let sumSq = 0;
  for (let i = 0; i < FFT_SIZE; i += 1) {
    const s = waveScratch[i];
    sumSq += s * s;
  }
  const rms = Math.sqrt(sumSq / FFT_SIZE);

  if (spectrumOut && spectrumOut.length > 0) {
    analyser.getFloatFrequencyData(freqScratch);
    const sr = analyser.context.sampleRate || 48000;
    const nyquist = sr / 2;
    const hi = Math.min(fHi, nyquist * 0.98);
    const ratio = hi / fLo;
    const n = spectrumOut.length;
    const hzToBin = FFT_SIZE / sr;

    for (let i = 0; i < n; i += 1) {
      const f0 = fLo * Math.pow(ratio, i / n);
      const f1 = fLo * Math.pow(ratio, (i + 1) / n);
      const b0 = f0 * hzToBin;
      const b1 = f1 * hzToBin;

      let magDb = MIN_DB;
      if (b1 - b0 < 1.25) {
        const bc = Math.sqrt(f0 * f1) * hzToBin;
        const lo = Math.max(1, Math.min(BIN_COUNT - 2, Math.floor(bc)));
        const frac = bc - lo;
        magDb = freqScratch[lo] * (1 - frac) + freqScratch[lo + 1] * frac;
      } else {
        const start = Math.max(1, Math.floor(b0));
        const end = Math.min(BIN_COUNT - 1, Math.ceil(b1));
        let peak = -160;
        let mean = 0;
        let count = 0;
        for (let b = start; b <= end; b += 1) {
          const v = freqScratch[b];
          if (v > peak) peak = v;
          mean += v;
          count += 1;
        }
        magDb = count > 0 ? peak * 0.65 + (mean / count) * 0.35 : MIN_DB;
      }

      const norm = Number.isFinite(magDb) ? (magDb - MIN_DB) / DB_SPAN : 0;
      spectrumOut[i] = Math.max(0, Math.min(1, norm));
    }
  }

  return { active: rms > 0.0002, rms };
}

// ── Shared DSP & SVG curve math ────────────────────────────────────────────

export const formatSignedDb = (
  value: number,
  locale: string,
  digits = 1,
): string =>
  `${new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    signDisplay: 'exceptZero',
  })
    .format(Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value)
    .replace('-', '\u2212')} dB`;

const polylinePath = (points: readonly { x: number; y: number }[]): string => {
  if (!points.length) return '';
  let d = `M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 1; i < points.length; i += 1) {
    d += `L${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)}`;
  }
  return d;
};

const smoothSvgPath = (points: readonly { x: number; y: number }[]): string => {
  if (points.length < 2) return polylinePath(points);
  let d = `M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += `C${cp1x.toFixed(2)} ${cp1y.toFixed(2)},${cp2x.toFixed(2)} ${cp2y.toFixed(2)},${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
};

const freqX = (hz: number, width: number): number =>
  (Math.log(hz / F_LO) / Math.log(F_HI / F_LO)) * Math.max(1, width);

const hzAtX = (x: number, width: number): number =>
  F_LO * Math.pow(F_HI / F_LO, x / Math.max(1, width));

const responseDb = (cs: readonly BiquadCoeffs[], hz: number): number => {
  let linear = 1;
  for (const c of cs) linear *= magnitude(c, hz / NYQUIST);
  return 20 * Math.log10(Math.max(linear, 1e-6));
};

const bandCoeffs = (gains: readonly number[]): BiquadCoeffs[] =>
  BANDS.map((band, i) =>
    coefficients(
      band.type,
      band.hz / NYQUIST,
      gains[i] ?? 0,
      'q' in band ? band.q : 1,
    ),
  );

export function eqExtremeDb(gains: readonly number[]): number {
  if (gains.every(g => g === 0)) return 0;
  const cs = bandCoeffs(gains);
  let extreme = 0;
  const steps = 80;
  for (let s = 0; s <= steps; s += 1) {
    const hz = F_LO * Math.pow(F_HI / F_LO, s / steps);
    const db = responseDb(cs, hz);
    if (Math.abs(db) > Math.abs(extreme)) extreme = db;
  }
  return extreme;
}

export function nextRoom1kDb(level: Level): number {
  if (level === 'off') return 0;
  const cs = WALL_HZ.map(hz =>
    coefficients('highshelf', hz / NYQUIST, WALL[level].depthDb),
  );
  return responseDb(cs, 1000);
}

export function echoTapDb(level: Level): number {
  if (level === 'off') return 0;
  return 20 * Math.log10(ECHO[level].feedback);
}

const echoDecayRate = (fb: number, rippleAmt: number): number => {
  const norm = Math.max(0, Math.min(1, (fb - 0.22) / 0.26));
  const activeDecay = 3.2 - norm * 1.95;
  return 5.4 * (1 - rippleAmt) + activeDecay * rippleAmt;
};

// ── Critically damped spring vector ────────────────────────────────────────

class SpringGlide {
  values: number[];
  private goal: number[];
  private vel: number[];
  private spans: readonly number[];
  moving = false;

  constructor(initial: readonly number[], spans: readonly number[]) {
    this.values = [...initial];
    this.goal = [...initial];
    this.vel = initial.map(() => 0);
    this.spans = spans;
  }

  setTarget(next: readonly number[], immediate: boolean): void {
    let diff = false;
    for (let i = 0; i < next.length; i += 1) {
      this.goal[i] = next[i];
      const span = this.spans[i] || 1;
      if (
        Math.abs((this.values[i] ?? next[i]) - next[i]) > span * 0.0008 ||
        Math.abs(this.vel[i] ?? 0) > span * 0.01
      ) {
        diff = true;
      }
    }
    if (!diff || immediate) {
      for (let i = 0; i < next.length; i += 1) {
        this.values[i] = next[i];
        this.vel[i] = 0;
      }
      this.moving = false;
      return;
    }
    this.moving = true;
  }

  step(dt: number): boolean {
    if (!this.moving) return false;
    const exp = Math.exp(-SPRING_OMEGA * dt);
    let settled = true;
    for (let i = 0; i < this.goal.length; i += 1) {
      const g = this.goal[i];
      const span = this.spans[i] || 1;
      const d = this.values[i] - g;
      const v0 = this.vel[i];
      const c = v0 + SPRING_OMEGA * d;
      const nx = g + (d + c * dt) * exp;
      const nv = (v0 - c * SPRING_OMEGA * dt) * exp;
      this.values[i] = nx;
      this.vel[i] = nv;
      if (Math.abs(nx - g) > span * 0.0008 || Math.abs(nv) > span * 0.01) {
        settled = false;
      }
    }
    if (settled) {
      for (let i = 0; i < this.goal.length; i += 1) {
        this.values[i] = this.goal[i];
        this.vel[i] = 0;
      }
      this.moving = false;
    }
    return this.moving;
  }

  snap(): void {
    for (let i = 0; i < this.goal.length; i += 1) {
      this.values[i] = this.goal[i];
      this.vel[i] = 0;
    }
    this.moving = false;
  }
}

// ── DOM Scope Controller ───────────────────────────────────────────────────

let uidCounter = 0;

const svgEl = <K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>,
): SVGElementTagNameMap[K] => {
  const el = document.createElementNS(SVG_NS, tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  }
  return el;
};

const EQ_DB_SPAN = 15;
const EQ_SPANS = BANDS.map(() => EQ_MAX_DB * 2);
const ECHO_WAVES = 5.5;
const ECHO_SPANS = [0.5, 1, 1] as const;
const ROOM_TOP_LIVE = LINE_PAD_Y + 1;
const ROOM_TOP_STANDBY = LINE_PAD_Y + 4;
const ROOM_FLOOR_DB = -44;
const ROOM_SPANS = [14, 1] as const;

export function mountShapeScopes({
  eqHost,
  echoHost,
  roomHost,
  getAnalyser,
  isPlaying,
  isVisible,
}: {
  eqHost: HTMLElement;
  echoHost: HTMLElement;
  roomHost: HTMLElement;
  getAnalyser: () => AnalyserNode | null;
  isPlaying: () => boolean;
  isVisible: () => boolean;
}) {
  uidCounter += 1;
  const uid = uidCounter;

  const buildGradient = (id: string, threeStop: boolean): SVGDefsElement => {
    const defs = svgEl('defs');
    const grad = svgEl('linearGradient', {
      id,
      x1: '0',
      y1: '0',
      x2: '0',
      y2: '1',
    });
    if (threeStop) {
      grad.append(
        svgEl('stop', { offset: '0%', class: 'scope-fill-edge' }),
        svgEl('stop', { offset: '50%', class: 'scope-fill-mid' }),
        svgEl('stop', { offset: '100%', class: 'scope-fill-edge' }),
      );
    } else {
      grad.append(
        svgEl('stop', { offset: '0%', class: 'scope-fill-edge' }),
        svgEl('stop', { offset: '100%', class: 'scope-fill-mid' }),
      );
    }
    defs.append(grad);
    return defs;
  };

  // 1. Equalizer SVG tree
  const eqFillId = `songs-eq-fill-${uid}`;
  const eqSvg = svgEl('svg', { preserveAspectRatio: 'none' });
  const eqSpec = svgEl('path', { class: 'scope-spectrum' });
  const eqGrids = BANDS.map(() =>
    svgEl('line', {
      class: 'scope-grid',
      y1: '0',
      y2: String(SCOPE_HEIGHT),
    }),
  );
  const eqZero = svgEl('line', {
    class: 'scope-zero',
    y1: String(SCOPE_HEIGHT / 2),
    y2: String(SCOPE_HEIGHT / 2),
  });
  const eqArea = svgEl('path', {
    class: 'scope-area',
    fill: `url(#${eqFillId})`,
  });
  const eqLine = svgEl('path', { class: 'scope-line', pathLength: '1' });
  const eqNodes = BANDS.map((_, i) => {
    const c = svgEl('circle', { class: 'scope-node', r: String(NODE_R) });
    c.style.setProperty('--node-i', String(i));
    return c;
  });
  eqSvg.append(
    buildGradient(eqFillId, true),
    eqSpec,
    ...eqGrids,
    eqZero,
    eqArea,
    eqLine,
    ...eqNodes,
  );
  eqHost.append(eqSvg);

  // 2. Echo SVG tree
  const echoFillId = `songs-echo-fill-${uid}`;
  const echoSvg = svgEl('svg', { preserveAspectRatio: 'none' });
  const echoTrail = svgEl('path', { class: 'scope-spectrum' });
  const echoArea = svgEl('path', {
    class: 'scope-area',
    fill: `url(#${echoFillId})`,
  });
  const echoLine = svgEl('path', { class: 'scope-line', pathLength: '1' });
  echoSvg.append(
    buildGradient(echoFillId, false),
    echoTrail,
    echoArea,
    echoLine,
  );
  echoHost.append(echoSvg);

  // 3. Next Room SVG tree
  const roomFillId = `songs-room-fill-${uid}`;
  const roomSvg = svgEl('svg', { preserveAspectRatio: 'none' });
  const roomSpec = svgEl('path', { class: 'scope-spectrum' });
  const roomArea = svgEl('path', {
    class: 'scope-area',
    fill: `url(#${roomFillId})`,
  });
  const roomLine = svgEl('path', { class: 'scope-line', pathLength: '1' });
  roomSvg.append(
    buildGradient(roomFillId, false),
    roomSpec,
    roomArea,
    roomLine,
  );
  roomHost.append(roomSvg);

  const hosts = [eqHost, echoHost, roomHost];

  // Width measurements
  let eqW = 0;
  let echoW = 0;
  let roomW = 0;

  // Parameter state & edit wake timers
  let gains: number[] = [0, 0, 0, 0, 0];
  let echoLevel: Level = 'off';
  let roomLevel: Level = 'off';
  let lastGainsSig = gains.join(',');
  let lastEchoSig: Level = echoLevel;
  let lastRoomSig: Level = roomLevel;

  let eqAwake = false;
  let echoAwake = false;
  let roomAwake = false;
  let eqWakeTimer = 0;
  let echoWakeTimer = 0;
  let roomWakeTimer = 0;

  const eqGlide = new SpringGlide([0, 0, 0, 0, 0], EQ_SPANS);
  const echoGlide = new SpringGlide([0.22, 0, 0.74], ECHO_SPANS);
  const roomGlide = new SpringGlide([0, 0], ROOM_SPANS);

  // Acoustic spectrum & echo trail state
  const SPEC_BINS = 42;
  const specRaw = new Float32Array(SPEC_BINS);
  const specSmooth = new Float32Array(SPEC_BINS);
  let specGate = 0;

  const TRAIL_SLOTS = 48;
  const trailHistory = new Float32Array(TRAIL_SLOTS);
  let trailGate = 0;
  let trailHeadEnv = 0;
  let trailAccum = 0;

  // One-shot Book Highlighter ink/wash entrance when Shape first opens
  let entrancePlayed = false;
  let entranceTimer = 0;

  const triggerEntranceIfNeeded = () => {
    if (entrancePlayed || !isVisible()) return;
    entrancePlayed = true;
    if (prefersReducedMotion()) {
      for (const h of hosts) h.dataset.inkState = 'done';
      return;
    }
    for (const h of hosts) h.dataset.inkState = 'drawing';
    clearTimeout(entranceTimer);
    entranceTimer = window.setTimeout(() => {
      for (const h of hosts) h.dataset.inkState = 'done';
    }, INK_SETTLE_MS);
  };

  const syncTargets = () => {
    const playing = isPlaying();
    const immediate = prefersReducedMotion() || isTabHidden() || !isVisible();

    const eqEngaged = playing || eqAwake ? 1 : 0.58;
    eqGlide.setTarget(
      gains.map(g => g * eqEngaged),
      immediate,
    );

    const echoActive = echoLevel !== 'off';
    const echoEngaged = playing || echoAwake ? 1 : 0.74;
    const targetFb = echoLevel !== 'off' ? ECHO[echoLevel].feedback : 0.22;
    echoGlide.setTarget([targetFb, echoActive ? 1 : 0, echoEngaged], immediate);

    const roomEngaged = playing || roomAwake ? 1 : 0;
    const targetDepth = roomLevel !== 'off' ? WALL[roomLevel].depthDb : 0;
    roomGlide.setTarget([targetDepth, roomEngaged], immediate);
  };

  const renderStaticCurves = () => {
    const playing = isPlaying();

    // 1. Equalizer
    const eqActive = gains.some(g => g !== 0);
    const eqLive = eqActive && (playing || eqGlide.moving || eqAwake);
    eqHost.classList.toggle('is-active', eqActive);
    eqHost.classList.toggle('is-playing', playing);
    eqHost.classList.toggle('is-live', eqLive);

    if (eqW > 0) {
      eqSvg.setAttribute('viewBox', `0 0 ${eqW} ${SCOPE_HEIGHT}`);
      const mid = SCOPE_HEIGHT / 2;
      const swing = mid - LINE_PAD_Y;
      const y = (db: number) =>
        mid -
        (Math.max(-EQ_DB_SPAN, Math.min(EQ_DB_SPAN, db)) / EQ_DB_SPAN) * swing;

      const cs = bandCoeffs(eqGlide.values);
      const count = Math.max(48, Math.round(eqW / 2.5));
      const xStart = -1.5;
      const xEnd = eqW + 1.5;
      const pts: { x: number; y: number }[] = [];
      for (let p = 0; p <= count; p += 1) {
        const x = xStart + (p / count) * (xEnd - xStart);
        const hz = hzAtX(Math.max(0, Math.min(eqW, x)), eqW);
        pts.push({ x, y: y(responseDb(cs, hz)) });
      }
      const line = polylinePath(pts);
      eqLine.setAttribute('d', line);
      eqArea.setAttribute(
        'd',
        `${line}L${xEnd.toFixed(1)} ${mid.toFixed(1)}L${xStart.toFixed(1)} ${mid.toFixed(1)}Z`,
      );
      eqZero.setAttribute('x1', '-1');
      eqZero.setAttribute('x2', String(eqW + 1));

      BANDS.forEach((band, i) => {
        const bx = freqX(band.hz, eqW).toFixed(2);
        eqGrids[i].setAttribute('x1', bx);
        eqGrids[i].setAttribute('x2', bx);
        const node = eqNodes[i];
        node.setAttribute('cx', bx);
        node.setAttribute('cy', y(responseDb(cs, band.hz)).toFixed(2));
        node.classList.toggle('is-active', gains[i] !== 0);
      });
    }

    // 2. Echo
    const echoActive = echoLevel !== 'off';
    const echoLive = echoActive && (playing || echoGlide.moving || echoAwake);
    echoHost.classList.toggle('is-active', echoActive);
    echoHost.classList.toggle('is-playing', playing);
    echoHost.classList.toggle('is-live', echoLive);

    const [fb, rippleAmt, posture] = echoGlide.values;
    const decay = echoDecayRate(fb, rippleAmt);

    if (echoW > 0) {
      echoSvg.setAttribute('viewBox', `0 0 ${echoW} ${SCOPE_HEIGHT}`);
      const lineFloor = SCOPE_HEIGHT - LINE_PAD_Y;
      const lineSpan = lineFloor - LINE_PAD_Y;
      const maxRise = lineSpan * (0.68 + 0.32 * rippleAmt) * posture;
      const xStart = -1.5;
      const xEnd = echoW + 1.5;
      const count = Math.max(56, Math.round(echoW / 2));
      const pts: { x: number; y: number }[] = [];
      for (let p = 0; p <= count; p += 1) {
        const x = xStart + (p / count) * (xEnd - xStart);
        const u = Math.max(0, Math.min(1, x / Math.max(1, echoW)));
        const env = Math.exp(-decay * u);
        const mod =
          1 - rippleAmt * 0.44 * (1 - Math.cos(2 * Math.PI * ECHO_WAVES * u));
        pts.push({ x, y: lineFloor - maxRise * env * mod });
      }
      const line = polylinePath(pts);
      const bottom = (SCOPE_HEIGHT + 1).toFixed(1);
      echoLine.setAttribute('d', line);
      echoArea.setAttribute(
        'd',
        `${line}L${xEnd.toFixed(1)} ${bottom}L${xStart.toFixed(1)} ${bottom}Z`,
      );
    }

    // 3. Next Room
    const roomActive = roomLevel !== 'off';
    const roomLive = roomActive && (playing || roomGlide.moving || roomAwake);
    roomHost.classList.toggle('is-active', roomActive);
    roomHost.classList.toggle('is-playing', playing);
    roomHost.classList.toggle('is-live', roomLive);

    if (roomW > 0) {
      roomSvg.setAttribute('viewBox', `0 0 ${roomW} ${SCOPE_HEIGHT}`);
      const [d, awake] = roomGlide.values;
      const cs = WALL_HZ.map(hz =>
        coefficients('highshelf', hz / NYQUIST, d * (0.65 + 0.35 * awake)),
      );
      const topY =
        ROOM_TOP_STANDBY + (ROOM_TOP_LIVE - ROOM_TOP_STANDBY) * awake;
      const lineFloor = SCOPE_HEIGHT - LINE_PAD_Y;
      const y = (db: number) =>
        topY +
        (Math.min(0, Math.max(ROOM_FLOOR_DB, db)) / ROOM_FLOOR_DB) *
          (lineFloor - topY);

      const count = Math.max(48, Math.round(roomW / 2.5));
      const xStart = -1.5;
      const xEnd = roomW + 1.5;
      const pts: { x: number; y: number }[] = [];
      for (let p = 0; p <= count; p += 1) {
        const x = xStart + (p / count) * (xEnd - xStart);
        const hz = hzAtX(Math.max(0, Math.min(roomW, x)), roomW);
        pts.push({ x, y: y(responseDb(cs, hz)) });
      }
      const line = polylinePath(pts);
      const bottom = (SCOPE_HEIGHT + 1).toFixed(1);
      roomLine.setAttribute('d', line);
      roomArea.setAttribute(
        'd',
        `${line}L${xEnd.toFixed(1)} ${bottom}L${xStart.toFixed(1)} ${bottom}Z`,
      );
    }

    return decay;
  };

  const renderAcoustic = (dt: number, decay: number): boolean => {
    if (prefersReducedMotion()) {
      eqSpec.setAttribute('d', '');
      roomSpec.setAttribute('d', '');
      echoTrail.setAttribute('d', '');
      return false;
    }

    const playing = isPlaying();
    const sample = playing
      ? sampleAnalyser(getAnalyser(), specRaw, SPEC_LO, SPEC_HI)
      : { active: false, rms: 0 };

    // 1. Frequency spectrum (Equalizer & Next Room)
    specGate = stepEnvelope(specGate, playing ? 1 : 0, dt, 0.15, 0.18);
    let specPeak = 0;
    for (let i = 0; i < SPEC_BINS; i += 1) {
      const target = sample.active ? specRaw[i] * specGate : 0;
      specSmooth[i] = stepEnvelope(
        specSmooth[i],
        target,
        dt,
        0.06,
        playing ? 0.2 : 0.13,
      );
      if (specSmooth[i] > specPeak) specPeak = specSmooth[i];
    }

    const maxRise = SCOPE_HEIGHT * 0.76;
    const bottom = (SCOPE_HEIGHT + 1).toFixed(1);

    if (specPeak > 0.003) {
      const writeSpec = (pathEl: SVGPathElement, w: number) => {
        if (w <= 4) {
          pathEl.setAttribute('d', '');
          return;
        }
        const span = w + 2;
        const pts: { x: number; y: number }[] = [];
        for (let i = 0; i < SPEC_BINS; i += 1) {
          pts.push({
            x: -1 + (i / (SPEC_BINS - 1)) * span,
            y: SCOPE_HEIGHT - specSmooth[i] * maxRise,
          });
        }
        pathEl.setAttribute(
          'd',
          `${smoothSvgPath(pts)}L${(w + 1).toFixed(1)} ${bottom}L-1 ${bottom}Z`,
        );
      };
      writeSpec(eqSpec, eqW);
      writeSpec(roomSpec, roomW);
    } else {
      eqSpec.setAttribute('d', '');
      roomSpec.setAttribute('d', '');
      if (!playing) {
        specSmooth.fill(0);
        specGate = 0;
      }
    }

    // 2. Propagating reflection trail (Echo)
    trailGate = stepEnvelope(trailGate, playing ? 1 : 0, dt, 0.15, 0.16);
    const rawLevel = sample.active
      ? Math.min(1, Math.pow(sample.rms * 2.6, 0.8))
      : 0;
    trailHeadEnv = stepEnvelope(
      trailHeadEnv,
      rawLevel,
      dt,
      0.035,
      playing ? 0.14 : 0.1,
    );

    trailAccum += dt * 46;
    while (trailAccum >= 1) {
      trailAccum -= 1;
      for (let i = TRAIL_SLOTS - 1; i > 0; i -= 1) {
        trailHistory[i] = trailHistory[i - 1] * (playing ? 1 : 0.94);
      }
      trailHistory[0] = trailHeadEnv;
    }

    if (!playing) {
      const damp = Math.exp(-dt / 0.14);
      for (let i = 0; i < TRAIL_SLOTS; i += 1) trailHistory[i] *= damp;
    }

    let trailPeak = 0;
    if (echoW > 4) {
      const span = echoW + 2;
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < TRAIL_SLOTS; i += 1) {
        const u = i / (TRAIL_SLOTS - 1);
        const atten = Math.exp(-decay * 0.72 * u);
        const val = trailHistory[i] * atten * (playing ? 1 : trailGate);
        if (val > trailPeak) trailPeak = val;
        pts.push({
          x: -1 + u * span,
          y: SCOPE_HEIGHT - val * maxRise,
        });
      }
      if (trailPeak > 0.003) {
        echoTrail.setAttribute(
          'd',
          `${smoothSvgPath(pts)}L${(echoW + 1).toFixed(1)} ${bottom}L-1 ${bottom}Z`,
        );
      } else {
        echoTrail.setAttribute('d', '');
      }
    } else {
      echoTrail.setAttribute('d', '');
    }

    if (trailPeak <= 0.003 && !playing) {
      trailHistory.fill(0);
      trailGate = 0;
    }

    return playing || specPeak > 0.003 || trailPeak > 0.003;
  };

  let raf = 0;
  let last = 0;

  const tick = (now: number) => {
    raf = 0;
    if (isTabHidden() || !isVisible()) {
      eqGlide.snap();
      echoGlide.snap();
      roomGlide.snap();
      renderStaticCurves();
      return;
    }

    const dt = last
      ? Math.max(0.001, Math.min(0.1, (now - last) / 1000))
      : 1 / 60;
    last = now;

    const eqMoving = eqGlide.step(dt);
    const echoMoving = echoGlide.step(dt);
    const roomMoving = roomGlide.step(dt);
    const decay = renderStaticCurves();
    const acousticAlive = renderAcoustic(dt, decay);

    if (eqMoving || echoMoving || roomMoving || acousticAlive) {
      raf = requestAnimationFrame(tick);
    } else {
      last = 0;
    }
  };

  const ensureLoop = () => {
    if (raf || isTabHidden() || !isVisible()) {
      if (!isVisible() || isTabHidden()) renderStaticCurves();
      return;
    }
    const needLoop =
      eqGlide.moving ||
      echoGlide.moving ||
      roomGlide.moving ||
      (!prefersReducedMotion() &&
        (isPlaying() || specGate > 0.003 || trailGate > 0.003));
    renderStaticCurves();
    if (needLoop) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  };

  const measureAll = () => {
    const nwEq = eqHost.getBoundingClientRect().width;
    const nwEcho = echoHost.getBoundingClientRect().width;
    const nwRoom = roomHost.getBoundingClientRect().width;
    if (nwEq > 0) eqW = nwEq;
    if (nwEcho > 0) echoW = nwEcho;
    if (nwRoom > 0) roomW = nwRoom;
    renderStaticCurves();
  };

  const ro = new ResizeObserver(entries => {
    let changed = false;
    for (const entry of entries) {
      const w = entry.contentRect.width;
      if (w <= 0) continue;
      if (entry.target === eqHost && w !== eqW) {
        eqW = w;
        changed = true;
      } else if (entry.target === echoHost && w !== echoW) {
        echoW = w;
        changed = true;
      } else if (entry.target === roomHost && w !== roomW) {
        roomW = w;
        changed = true;
      }
    }
    if (changed) {
      triggerEntranceIfNeeded();
      ensureLoop();
    }
  });
  for (const h of hosts) ro.observe(h);

  document.addEventListener('visibilitychange', () => {
    if (isTabHidden()) {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      last = 0;
      eqGlide.snap();
      echoGlide.snap();
      roomGlide.snap();
      renderStaticCurves();
    } else {
      syncTargets();
      ensureLoop();
    }
  });

  return {
    update(next: Shape) {
      const gainsSig = next.gains.join(',');
      if (gainsSig !== lastGainsSig) {
        lastGainsSig = gainsSig;
        gains = [...next.gains];
        eqAwake = true;
        clearTimeout(eqWakeTimer);
        eqWakeTimer = window.setTimeout(() => {
          eqAwake = false;
          syncTargets();
          ensureLoop();
        }, EDIT_WAKE_MS);
      }

      if (next.echo !== lastEchoSig) {
        lastEchoSig = next.echo;
        echoLevel = next.echo;
        echoAwake = true;
        clearTimeout(echoWakeTimer);
        echoWakeTimer = window.setTimeout(() => {
          echoAwake = false;
          syncTargets();
          ensureLoop();
        }, EDIT_WAKE_MS);
      }

      if (next.nextRoom !== lastRoomSig) {
        lastRoomSig = next.nextRoom;
        roomLevel = next.nextRoom;
        roomAwake = true;
        clearTimeout(roomWakeTimer);
        roomWakeTimer = window.setTimeout(() => {
          roomAwake = false;
          syncTargets();
          ensureLoop();
        }, EDIT_WAKE_MS);
      }

      syncTargets();
      ensureLoop();
    },

    notifyPlayback() {
      syncTargets();
      ensureLoop();
    },

    notifyVisibility() {
      if (isVisible()) {
        measureAll();
        triggerEntranceIfNeeded();
        syncTargets();
        ensureLoop();
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      }
    },
  };
}
