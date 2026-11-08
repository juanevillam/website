/**
 * AUTO DJ ON THE SONGS CARD — Sound Shaper's web director (sound-shaper:
 * web/src/autoDj.ts and web/src/djFx.ts) over the app's own planner, copied
 * beside this file. Where it can be, it is that director line for line; it
 * differs only where the card does:
 *
 * - The library is the card's songs, in their order; a song's id is its file.
 * - There is no player store to subscribe to: one 40 ms clock reads the
 *   <audio> while Auto DJ is on, and a change of song it did not ask for is
 *   one the listener made — it joins that one, as the app does.
 * - The shape is the card's (lib/shaper); `apply` sets it and repaints the
 *   Shape sheet.
 *
 * Nothing is saved but each song's map — small JSON, in localStorage — so a
 * second visit reads nothing twice.
 */
import { ANALYSIS_SAMPLE_RATE, analyzeSamples, type SongMap } from './analysis';
import { synthFx, type FxName } from './fx';
import {
  AUTO_DJ_STYLES,
  nextMoveIndex,
  rng,
  stateAt,
  type AutoDjStyle,
  type DjMove,
} from './plan';
import {
  firstPeakBar,
  joinSegment,
  planOrder,
  planSegment,
  transitionFx,
  type Part,
  type PoolSound,
  type Segment,
  type TransitionFx,
} from './set';
import type { Shape } from '../shaper';

export type DjStatus = { on: boolean; ready: number; total: number };

export type DjHost = {
  /** The songs, in the card's order. */
  songs: { src: string }[];
  current(): number;
  position(): number;
  playing(): boolean;
  shape(): Shape;
  /** Set part of the shape and show it in the Shape sheet. */
  apply(move: Partial<Shape>): void;
  /** Bring song `i` in at `startS` and play it. */
  cue(i: number, startS: number): void;
  fadeIn(seconds: number): void;
  context(): AudioContext | null;
  /** On, off, or more of the songs read. */
  changed(status: DjStatus): void;
};

// ── The flourishes (the app's djFx, on the card's context) ─────────────────

const TAKES = 3;
const fxCache = new Map<string, AudioBuffer>();
const live = new Set<AudioBufferSourceNode>();

const bufferFor = (
  ctx: AudioContext,
  name: FxName,
  lengthS?: number,
): AudioBuffer => {
  const take = Math.floor(Math.random() * TAKES);
  const key = `${name}:${take}:${lengthS?.toFixed(2) ?? ''}:${ctx.sampleRate}`;
  const hit = fxCache.get(key);
  if (hit) return hit;
  const sound = synthFx(name, ctx.sampleRate, take + 1, lengthS);
  const buffer = ctx.createBuffer(2, sound.left.length, ctx.sampleRate);
  buffer.copyToChannel(sound.left, 0);
  buffer.copyToChannel(sound.right, 1);
  fxCache.set(key, buffer);
  if (fxCache.size > 40) fxCache.delete(fxCache.keys().next().value as string);
  return buffer;
};

const playFx = (
  ctx: AudioContext | null,
  name: FxName,
  cutInS: number,
  lengthS?: number,
) => {
  if (!ctx) return;
  try {
    const buffer = bufferFor(ctx, name, lengthS);
    const align =
      name === 'riser' || name === 'reverseCymbal' ? buffer.duration : 0;
    const startIn = cutInS - align;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => {
      live.delete(source);
      source.disconnect();
    };
    if (startIn >= 0) source.start(ctx.currentTime + startIn);
    else if (-startIn < buffer.duration)
      source.start(ctx.currentTime, -startIn);
    else return;
    live.add(source);
  } catch {
    // A missing flourish is never worth an error in the music.
  }
};

const stopFx = () => {
  for (const source of live) {
    try {
      source.stop();
      source.disconnect();
    } catch {
      // Already finished.
    }
  }
  live.clear();
};

// ── The song maps: decode once, keep the JSON ──────────────────────────────

const MAP_KEY = 'songs.songmap.v2.';
const memory = new Map<string, Promise<SongMap | null>>();

const readCached = (id: string): SongMap | null => {
  try {
    const raw = localStorage.getItem(MAP_KEY + id);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SongMap;
    return parsed.version === 2 &&
      Array.isArray(parsed.bars) &&
      Array.isArray(parsed.bass) &&
      Array.isArray(parsed.bright)
      ? parsed
      : null;
  } catch {
    return null;
  }
};

const compute = async (src: string): Promise<SongMap | null> => {
  const cached = readCached(src);
  if (cached) return cached;
  const bytes = await (await fetch(src)).arrayBuffer();
  const buffer = await new OfflineAudioContext(
    1,
    1,
    ANALYSIS_SAMPLE_RATE,
  ).decodeAudioData(bytes);
  const map = analyzeSamples(buffer.getChannelData(0), buffer.sampleRate);
  try {
    localStorage.setItem(MAP_KEY + src, JSON.stringify(map));
  } catch {
    // Full or private: the map lives for this visit.
  }
  return map;
};

const getSongMap = (src: string): Promise<SongMap | null> => {
  const inFlight = memory.get(src);
  if (inFlight) return inFlight;
  const promise = compute(src).catch(() => null);
  void promise.then(map => {
    if (!map) memory.delete(src);
  });
  memory.set(src, promise);
  return promise;
};

// ── The director ───────────────────────────────────────────────────────────

const LOOKAHEAD_S = 0.35;
const JUMP_S = 1;
const CUE_LEAD_S = 0.12;

type Snapshot = Pick<
  Shape,
  'gains' | 'nextRoom' | 'echo' | 'rate' | 'keepPitch'
>;

export const createAutoDj = (host: DjHost) => {
  let on = false;
  let snapshot: Snapshot | null = null;
  let stopDirecting: (() => void) | null = null;
  let status: DjStatus = { on: false, ready: 0, total: 0 };
  const publish = (patch: Partial<DjStatus>) => {
    status = { ...status, ...patch };
    host.changed(status);
  };

  const applyMove = (move: Partial<DjMove>) => {
    const now = host.shape();
    const patch: Partial<Shape> = {};
    if (move.gains && move.gains.some((g, i) => g !== now.gains[i]))
      patch.gains = [...move.gains];
    if (move.nextRoom !== undefined && move.nextRoom !== now.nextRoom)
      patch.nextRoom = move.nextRoom;
    if (move.echo !== undefined && move.echo !== now.echo)
      patch.echo = move.echo;
    if (move.rate !== undefined && move.rate !== now.rate)
      patch.rate = move.rate;
    if (move.keepPitch !== undefined && move.keepPitch !== now.keepPitch)
      patch.keepPitch = move.keepPitch;
    if (Object.keys(patch).length) host.apply(patch);
  };

  const direct = (): (() => void) => {
    let cancelled = false;
    const ids = host.songs.map(s => s.src);
    const indexOf = (id: string) => ids.indexOf(id);
    const maps = new Map<string, SongMap>();
    const failed = new Set<string>();
    const played = new Set<string>();
    const random = rng(Math.floor(Math.random() * 2 ** 31));
    let setTempo = 0;

    // The set's mood is the DJ's: Club, Slowed or Hyper, one to three
    // segments at a time, Club the home it comes back to most.
    let mood: AutoDjStyle = 'club';
    let moodLeft = 1;
    const nextStyle = (): AutoDjStyle => {
      if (moodLeft <= 0) {
        const r = random();
        const options = AUTO_DJ_STYLES.filter(m => m !== mood);
        mood =
          r < 0.5 && mood !== 'club'
            ? 'club'
            : options[Math.floor(random() * options.length)];
        moodLeft = 1 + Math.floor(random() * 3);
      }
      moodLeft -= 1;
      return mood;
    };

    let segment: Segment | null = null;
    let landed = false;
    let upNext: Segment | null = null;
    let order: string[] = [];
    const returns = new Map<string, { bar: number; at: number }>();
    const returned = new Set<string>();
    let cuts = 0;
    let lastReturnCut = -10;
    let fx: TransitionFx | null = null;
    let rose = false;
    // Kept from the app's shape; the card adopts a cut at once (see `cue`).
    let cued: Segment | null = null;
    let next = 0;
    let lastPosition = 0;
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const clearTimers = () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };

    const publishProgress = () => {
      const done = ids.filter(id => maps.has(id) || failed.has(id));
      publish({ ready: done.length, total: ids.length });
    };

    const pool = (): PoolSound[] =>
      ids.flatMap(id => {
        const map = maps.get(id);
        return map ? [{ soundId: id, map }] : [];
      });

    const foldTo = (position: number) => {
      if (!segment) return;
      clearTimers();
      const at = Math.max(position, segment.startS);
      applyMove(stateAt(segment.mix, at));
      next = nextMoveIndex(segment.mix, at);
      lastPosition = position;
    };

    const allRead = () => ids.every(id => maps.has(id) || failed.has(id));

    const planRun = (fromId: string | null) => {
      const all = pool();
      const fresh = all.filter(p => !played.has(p.soundId));
      if (fresh.filter(p => p.soundId !== fromId).length === 0) {
        played.clear();
        returned.clear();
      }
      const base = fresh.filter(p => p.soundId !== fromId).length ? fresh : all;
      order = planOrder(base, fromId, setTempo, random);
    };

    const barOf = (seg: Segment): number => {
      const map = maps.get(seg.soundId);
      if (!map) return 2;
      return map.bpm > 0 ? map.beatS * 4 : map.blockS;
    };

    const setUpNext = (seg: Segment | null) => {
      upNext = seg;
      rose = false;
      fx =
        seg && segment
          ? transitionFx(segment, seg, random, barOf(segment))
          : null;
    };

    const chooseUpNext = () => {
      if (!segment || upNext || cued) return;
      const all = pool();
      if (all.length < 2) return;
      const plan = (
        nextId: string | undefined,
        part: Part,
        fromBar = 0,
        finale = false,
      ) => {
        const nextSound = all.find(p => p.soundId === nextId);
        if (!nextSound || !segment) return;
        setUpNext(
          planSegment({
            next: nextSound,
            style: nextStyle(),
            seed: Math.floor(random() * 2 ** 31),
            setTempo,
            after: segment.endsOn,
            part,
            fromBar,
            finale,
          }),
        );
      };

      if (allRead()) {
        order = order.filter(
          id => id !== segment?.soundId && maps.has(id) && !played.has(id),
        );
        // A return: a song the set left at least 3 cuts ago, picked up on a
        // later part for a shorter second turn — and at most once every 5
        // cuts (1–2 times in 10 songs; Juan, 2026-11-07).
        const waiting = [...returns.entries()].filter(
          ([id, r]) =>
            id !== segment?.soundId &&
            maps.has(id) &&
            !returned.has(id) &&
            cuts - r.at >= 3,
        );
        if (
          waiting.length &&
          cuts - lastReturnCut >= 5 &&
          (!order.length || random() < 0.22)
        ) {
          const [id, r] = waiting.sort((x, y) => x[1].at - y[1].at)[0];
          returns.delete(id);
          returned.add(id);
          lastReturnCut = cuts;
          plan(id, 'later', r.bar, !order.length && returns.size === 0);
          return;
        }
        if (!order.length) planRun(segment.soundId);
        const nextId = order.shift();
        const map = nextId ? maps.get(nextId) : undefined;
        // A new song: in on its opening a quarter of the time, when it has
        // one worth playing; otherwise on its best part.
        const opening = !!map && firstPeakBar(map) >= 16 && random() < 0.25;
        plan(
          nextId,
          opening ? 'opening' : 'peak',
          0,
          !order.length && returns.size === 0,
        );
      } else {
        // Still reading: the best of what is read, without a plan to keep.
        const fresh = all.filter(
          p => p.soundId !== segment?.soundId && !played.has(p.soundId),
        );
        const nextId = planOrder(
          fresh.length ? fresh : all,
          segment.soundId,
          setTempo,
          random,
        )[0];
        plan(nextId, 'peak');
      }
    };

    const begin = (seg: Segment, position: number) => {
      segment = seg;
      landed = true;
      setTempo = seg.tempo;
      played.add(seg.soundId);
      foldTo(position);
      chooseUpNext();
    };

    /** Make the playing song the set's segment, from where it is. */
    const join = () => {
      const id = ids[host.current()];
      const map = maps.get(id);
      if (!map) return; // read first; `pump` joins when it lands
      const position = host.position();
      begin(
        joinSegment({
          sound: { soundId: id, map },
          style: nextStyle(),
          seed: Math.floor(random() * 2 ** 31),
          atS: position,
          setTempo,
        }),
        position,
      );
    };

    /** Cut to `upNext`. */
    const cue = () => {
      if (!upNext) return;
      const target = upNext;
      upNext = null;
      const i = indexOf(target.soundId);
      if (i < 0) {
        chooseUpNext();
        return;
      }
      clearTimers();
      const leaving = segment;
      if (
        leaving?.resumeBar !== undefined &&
        leaving.part !== 'later' &&
        !returned.has(leaving.soundId) &&
        (leaving.part === 'opening' || random() < 0.15)
      ) {
        returns.set(leaving.soundId, { bar: leaving.resumeBar, at: cuts });
        if (returns.size > 2) returns.delete(returns.keys().next().value!);
      }
      returns.delete(target.soundId);
      cuts += 1;
      cued = target;
      segment = null;
      // The hit lands on the cut and the next song eases in under it.
      const { rate } = host.shape();
      if (fx?.on) playFx(host.context(), fx.on, CUE_LEAD_S / rate);
      host.fadeIn(fx?.fadeInS ?? 0.03);
      fx = null;
      applyMove(stateAt(target.mix, target.startS));
      seen = i;
      host.cue(i, target.startS);
      // The card has no load to wait for: the segment is the set's now, and
      // it lands once the playhead reaches its start (a jump within the
      // same song changes no song, so nothing else would tell).
      cued = null;
      segment = target;
      landed = false;
      setTempo = target.tempo;
      played.add(target.soundId);
      next = nextMoveIndex(target.mix, target.startS);
      lastPosition = target.startS;
      chooseUpNext();
    };

    /** Read the songs, the playing one first, one at a time. */
    let pumping = false;
    const pump = async () => {
      if (pumping) return;
      pumping = true;
      try {
        while (!cancelled) {
          const todo = [ids[host.current()], ...ids].find(
            id => !maps.has(id) && !failed.has(id),
          );
          if (!todo) break;
          const map = await getSongMap(todo);
          if (cancelled) return;
          if (map) maps.set(todo, map);
          else failed.add(todo);
          publishProgress();
          if (!segment && !cued) join();
          else if (allRead() && !order.length) {
            planRun(segment?.soundId ?? null);
            if (!cued) setUpNext(null);
            chooseUpNext();
          } else chooseUpNext();
        }
      } finally {
        pumping = false;
      }
    };

    const onPosition = (position: number, playing: boolean) => {
      if (!segment) return;
      if (!landed) {
        if (position < segment.startS - 0.3) return;
        landed = true;
        foldTo(position);
        return;
      }
      const jumped =
        position < lastPosition - 0.05 || position - lastPosition > JUMP_S;
      if (jumped) {
        stopFx();
        rose = false;
        foldTo(position);
      }
      lastPosition = position;
      if (!playing) return;

      if (upNext && position >= segment.endS - CUE_LEAD_S) {
        cue();
        return;
      }

      const { rate } = host.shape();
      // The rise into the cut, started so it ends exactly on it.
      if (upNext && fx?.before && fx.beforeS && !rose) {
        const toCut = (segment.endS - position) / rate;
        const lengthS = Math.round((fx.beforeS / rate) * 20) / 20;
        if (toCut <= lengthS + 0.2 && toCut > 0.05) {
          rose = true;
          playFx(host.context(), fx.before, toCut, lengthS);
        }
      }
      const { moves } = segment.mix;
      while (next < moves.length) {
        const move = moves[next];
        const ahead = move.atS - position;
        if (ahead > LOOKAHEAD_S) break;
        next += 1;
        const delayMs = Math.max(0, (ahead / rate) * 1000);
        const timer = setTimeout(() => {
          timers.delete(timer);
          if (!cancelled) applyMove(move);
        }, delayMs);
        timers.add(timer);
      }
    };

    // THE CLOCK: the <audio> read every 40 ms while Auto DJ is on — its
    // timeupdate comes four times a second, too coarse to land a cut. A
    // timer, not a frame loop: frames stop in a hidden tab, and the music
    // (and so the set) goes on there.
    let seen = host.current();
    let wasPlaying = host.playing();
    const tick = () => {
      const current = host.current();
      const playing = host.playing();
      if (current !== seen) {
        // A song the listener chose: join it, and plan from there.
        seen = current;
        clearTimers();
        segment = null;
        setUpNext(null);
        stopFx();
        order = [];
        if (maps.has(ids[current])) join();
        else void pump();
        wasPlaying = playing;
        return;
      }
      onPosition(host.position(), playing);
      // A pause stops the clock; whatever was on a timer would land late.
      if (!playing && wasPlaying) {
        clearTimers();
        stopFx();
        rose = false;
        if (segment) next = nextMoveIndex(segment.mix, host.position());
      }
      wasPlaying = playing;
    };
    const clock = setInterval(tick, 40);

    publishProgress();
    void pump();

    return () => {
      cancelled = true;
      clearInterval(clock);
      clearTimers();
      stopFx();
      publish({ ready: 0, total: 0 });
    };
  };

  /** Off. From its own switch the shape goes back; from any other control
   *  the listener has taken over, and the sound stays where it is. */
  const stop = ({ restore }: { restore: boolean }) => {
    if (!on) return;
    on = false;
    stopDirecting?.();
    stopDirecting = null;
    publish({ on: false });
    if (restore && snapshot)
      host.apply({ ...snapshot, gains: [...snapshot.gains] });
    snapshot = null;
  };

  return {
    isOn: () => on,
    /** On: the listener's shape is kept, to be given back from the switch. */
    start() {
      if (on) return;
      const { gains, nextRoom, echo, rate, keepPitch } = host.shape();
      snapshot = { gains: [...gains], nextRoom, echo, rate, keepPitch };
      on = true;
      publish({ on: true });
      stopDirecting = direct();
    },
    stop,
    /** A control moved by hand: the DJ lets go, the move stands. */
    byHand() {
      stop({ restore: false });
    },
  };
};
