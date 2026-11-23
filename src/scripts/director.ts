/**
 * THE PAGE'S DIRECTOR — the narration session, the narrator's glide between
 * anchors, and the hero's ride-out. Every part is driven by what the page
 * marks up — `data-narr-block`, `data-narr-panel`.
 */
import { type ReadMark, readTokens } from '../lib/readAlong';
import { dur } from '../lib/motion';
import { playingSound } from '../lib/listening';
import { meantToClose } from '../lib/dismiss';

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
// AT THE SPEED IT WAS RECORDED (Juan, 2026-10-17). It played at 1.1× with
// its pitch kept for a few hours, and the time-stretch made the voice sound
// robotic; a speed control beside the narrator went with it. Leave the
// rate alone.
// What the OS shows for the voice (Dynamic Island, Lock Screen). With no
// metadata Safari falls back to the favicon, whose rounded tile has
// transparent corners that the Lock Screen paints white. The artwork is
// the same mark, square and opaque, because the OS rounds it itself.
// Set again whenever the voice starts (`start`): the Songs card's player
// (SongsPlayer) takes the session over while a song plays.
const claimMetadata = () => {
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
};
claimMetadata();
// Dev only: lets a check drive the narrator SILENTLY — the analyser
// still hears the voice (bars, subtitles, field all run), the speakers
// do not. Never shipped.
let devSilent = false;
if (import.meta.env.DEV)
  Object.assign(window, {
    __narrVoice: voice,
    __narrSilence: () => {
      devSilent = true;
      voice.muted = true;
      if (output) output.gain.value = 0;
    },
  });

/** A narrated block: the hero's wordmark, or a PANEL — a full-height section
 *  marked `data-narr-panel`. */
type Narr = {
  el: HTMLElement;
  paras: HTMLElement[];
  anchor: HTMLElement | null;
  panel: boolean;
};

const isIOS =
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

// Every browser on iOS (Safari, Google Chrome CriOS, Firefox FxiOS, Edge
// EdgiOS, in-app WebViews) plus macOS Safari uses Apple's WebKit + AVPlayer.
// Routing `<audio>` through WebAudio's `createMediaElementSource` attaches
// `MTAudioProcessingTap`, which delays startup, stalls streaming buffers mid-
// clip, and drifts clock sync at 2× / 3× — so WebKit always plays straight
// on hardware AVPlayer.
const isWebKit =
  isIOS ||
  (/AppleWebKit\//.test(navigator.userAgent) &&
    !/Chrome|Chromium|Edg/.test(navigator.userAgent));

const narrator = document.querySelector<HTMLElement>('[data-narrator]');
const narVideo = document.querySelector<HTMLElement>('[data-narr-video]');
const narVideoLayers = narVideo
  ? [...narVideo.querySelectorAll<HTMLVideoElement>('[data-narr-video-layer]')]
  : [];
const narVideoClose =
  narVideo?.querySelector<HTMLButtonElement>('[data-narr-video-close]') ?? null;
const narVideoRates =
  narVideo?.querySelector<HTMLElement>('.nar-video-rates') ?? null;
const narRateBtns = narVideo
  ? [...narVideo.querySelectorAll<HTMLButtonElement>('[data-narr-rate]')]
  : [];
const RATE_KEY = 'jv:narr:rate';
let activeLayerIdx = 0;
let videoCollapsed = false;
let currentVideoSrc = '';
let playbackRate = 1;
try {
  const savedRate = Number(localStorage.getItem(RATE_KEY));
  if (savedRate === 1 || savedRate === 2 || savedRate === 3) {
    playbackRate = savedRate;
  }
} catch {}
let videoRateState: -2 | -1 | 0 | 1 | 2 = 0;
let videoSpinUpUntil = 0;
let videoLastSeekAt = 0;
let settleTimer: ReturnType<typeof setTimeout> | undefined;
let videoToken = 0;
let videoLaunched = false;
let voiceBuffering = false;
let sessionToken = 0;
let preloadedForToken = -1;
let autoScrollUntil = 0;
let autoScrollBlock: Narr | null = null;
let narrPlacementDirty = true;
let ctx: AudioContext | null = null;

const preloadAudio = new Audio();
preloadAudio.preload = 'auto';
let preloadedAudioSrc = '';

const warmAudio = (src: string | null | undefined) => {
  if (!src || preloadedAudioSrc === src) return;
  preloadedAudioSrc = src;
  preloadAudio.src = src;
  preloadAudio.load();
};

const activeVideoEl = (): HTMLVideoElement | null =>
  narVideoLayers[activeLayerIdx] ?? null;

const heardVoiceTime = () => Math.max(0, voice.currentTime || 0);

const clampVideoTime = (v: HTMLVideoElement, t: number) =>
  Number.isFinite(v.duration) && v.duration > 0
    ? Math.min(Math.max(0, t), Math.max(0, v.duration - 0.04))
    : Math.max(0, t);

const isTimeBuffered = (v: HTMLVideoElement, t: number) => {
  const b = v.buffered;
  for (let i = 0; i < b.length; i++) {
    if (t >= b.start(i) && t <= Math.max(b.start(i), b.end(i) - 0.05))
      return true;
  }
  return false;
};

const applyAudioRate = (el: HTMLAudioElement, rate: number) => {
  if (el.defaultPlaybackRate !== rate) el.defaultPlaybackRate = rate;
  if (el.playbackRate !== rate) el.playbackRate = rate;
  if ('preservesPitch' in el && el.preservesPitch !== true)
    el.preservesPitch = true;
  const legacy = el as HTMLAudioElement & {
    webkitPreservesPitch?: boolean;
    mozPreservesPitch?: boolean;
  };
  if ('webkitPreservesPitch' in legacy && legacy.webkitPreservesPitch !== true)
    legacy.webkitPreservesPitch = true;
  if ('mozPreservesPitch' in legacy && legacy.mozPreservesPitch !== true)
    legacy.mozPreservesPitch = true;
};

const effectiveVideoRate = () => {
  const factor =
    videoRateState === 2
      ? 1.14
      : videoRateState === 1
        ? 1.06
        : videoRateState === -1
          ? 0.94
          : videoRateState === -2
            ? 0.86
            : 1;
  return +(playbackRate * factor).toFixed(3);
};

// Video layers are muted and carry no audio stream (-an): never attach a pitch
// processor to their timebase.
const applyVideoRate = (el: HTMLVideoElement, rate: number) => {
  if (el.defaultPlaybackRate !== playbackRate)
    el.defaultPlaybackRate = playbackRate;
  if (Math.abs(el.playbackRate - rate) > 0.002) el.playbackRate = rate;
};

const setPlaybackRate = (rate: number) => {
  playbackRate = rate;
  try {
    localStorage.setItem(RATE_KEY, String(rate));
  } catch {}
  videoRateState = 0;
  applyAudioRate(voice, rate);
  for (const v of narVideoLayers) applyVideoRate(v, rate);
  const v = activeVideoEl();
  if (
    running &&
    v &&
    !v.paused &&
    !voice.paused &&
    v.readyState >= 2 &&
    !v.seeking &&
    Number.isFinite(voice.currentTime)
  ) {
    const targetTime = clampVideoTime(v, heardVoiceTime());
    if (
      Math.abs(v.currentTime - targetTime) > 0.12 * rate &&
      isTimeBuffered(v, targetTime)
    ) {
      try {
        v.currentTime = targetTime;
      } catch {}
    }
  }
  videoSpinUpUntil = performance.now() + 260;
  for (const btn of narRateBtns) {
    const active = Number(btn.dataset.narrRate) === rate;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  }
};
applyAudioRate(voice, playbackRate);
for (const v of narVideoLayers) applyVideoRate(v, playbackRate);
for (const btn of narRateBtns) {
  const active = Number(btn.dataset.narrRate) === playbackRate;
  btn.classList.toggle('is-active', active);
  btn.setAttribute('aria-pressed', String(active));
}
// Safari / iOS AVPlayer resets rate to 1.0 on -[AVPlayer play]; re-assert the
// chosen playbackRate immediately whenever audio or video enters play/playing.
voice.addEventListener('play', () => applyAudioRate(voice, playbackRate));
voice.addEventListener('playing', () => {
  voiceBuffering = false;
  applyAudioRate(voice, playbackRate);
  maybeLaunchVideo();
});
voice.addEventListener('waiting', () => {
  if (!running) return;
  voiceBuffering = true;
  const v = activeVideoEl();
  if (v && !v.paused) v.pause();
});
voice.addEventListener('stalled', () => {
  if (!running || voice.readyState >= 3) return;
  voiceBuffering = true;
  const v = activeVideoEl();
  if (v && !v.paused) v.pause();
});
voice.addEventListener('canplay', () => {
  if (running && !voice.paused) voiceBuffering = false;
});
voice.addEventListener('timeupdate', () => {
  if (
    !running ||
    !session ||
    preloadedForToken === sessionToken ||
    !Number.isFinite(voice.duration) ||
    voice.duration <= 0
  )
    return;
  const remRealSec = (voice.duration - voice.currentTime) / playbackRate;
  if (remRealSec <= 5.5) {
    preloadedForToken = sessionToken;
    preloadNext();
  }
});
for (const v of narVideoLayers) {
  v.addEventListener('play', () => applyVideoRate(v, effectiveVideoRate()));
  v.addEventListener('playing', () => applyVideoRate(v, effectiveVideoRate()));
}

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
let panels: Narr[] = [];

// Every paragraph's Spanish clip rides on it as `data-clip` / `data-video`,
// and its clip in another language, once recorded, as `data-clip-{lang}` /
// `data-video-{lang}` (lib/narration): the page's language plays its own when
// there is one, while Chinese falls back to English once recorded and to
// Spanish until then. Video never falls back to a different language's lips
// when the active language has its own audio clip.
const clipOf = (p: HTMLElement) => {
  const lang = document.documentElement.dataset.lang;
  if (lang === 'zh') {
    return (
      p.getAttribute('data-clip-zh') ||
      p.getAttribute('data-clip-en') ||
      p.dataset.clip
    );
  }
  return (
    (lang && lang !== 'es' && p.getAttribute(`data-clip-${lang}`)) ||
    p.dataset.clip
  );
};

const videoOf = (p: HTMLElement) => {
  const lang = document.documentElement.dataset.lang;
  if (lang === 'zh') {
    if (p.hasAttribute('data-clip-zh'))
      return p.getAttribute('data-video-zh') || undefined;
    if (p.hasAttribute('data-clip-en'))
      return p.getAttribute('data-video-en') || undefined;
    return p.dataset.video;
  }
  if (lang && lang !== 'es' && p.hasAttribute(`data-clip-${lang}`)) {
    return p.getAttribute(`data-video-${lang}`) || undefined;
  }
  return p.dataset.video;
};

const unloadVideoEl = (el: HTMLVideoElement) => {
  el.pause();
  if (el.hasAttribute('src')) {
    el.removeAttribute('src');
    el.load();
  }
};

const activeVideoPara = (): HTMLElement | null => {
  if (session) return session.block.paras[session.para] ?? null;
  const b = showing ?? narrs[0];
  if (!b) return null;
  const idx = startOf(b);
  return idx >= 0 ? (b.paras[idx] ?? null) : null;
};

/** Next paragraph in the narration flow after `(block, para)`, for standby preloading. */
const nextParaAfter = (
  block: Narr,
  para: number,
): { block: Narr; para: number } | null => {
  const inFocus = block.el.hasAttribute('data-focused');
  if (inFocus && block.el.hasAttribute('data-focus-lone')) return null;
  const next = firstVoiced(block, para + 1);
  if (next >= 0) return { block, para: next };
  if (inFocus) return null;
  const nextPanel = block.panel ? panels[panels.indexOf(block) + 1] : panels[0];
  if (!nextPanel) return null;
  const p = startOf(nextPanel);
  return p >= 0 ? { block: nextPanel, para: p } : null;
};

/** Pre-load the upcoming video on the hidden standby layer near the end of
 *  the current take. Mobile / iOS loads metadata only so two 20+ MB videos
 *  never compete for cellular bandwidth or hardware decoders. */
const preloadStandbyVideo = (src: string | null | undefined) => {
  if (!src || videoCollapsed || narVideoLayers.length < 2) return;
  const standbyIdx = (activeLayerIdx + 1) % narVideoLayers.length;
  const standbyEl = narVideoLayers[standbyIdx];
  if (!standbyEl || standbyEl === activeVideoEl()) return;
  if (standbyEl.classList.contains('is-active')) return;
  if (standbyEl.getAttribute('src') === src) return;
  standbyEl.pause();
  const mobileLight = phone || isIOS;
  standbyEl.preload = mobileLight ? 'metadata' : 'auto';
  standbyEl.src = src;
  standbyEl.load();
  if (mobileLight) return;
  const primeFrame = () => {
    if (
      standbyEl.getAttribute('src') !== src ||
      standbyEl === activeVideoEl() ||
      standbyEl.classList.contains('is-active')
    )
      return;
    try {
      standbyEl.currentTime = 0.001;
    } catch {}
  };
  if (standbyEl.readyState >= 1) primeFrame();
  else
    standbyEl.addEventListener('loadedmetadata', primeFrame, {
      once: true,
    });
};

const preloadNext = () => {
  if (!session) return;
  const next = nextParaAfter(session.block, session.para);
  if (!next) return;
  const p = next.block.paras[next.para];
  if (!p) return;
  warmAudio(clipOf(p));
  preloadStandbyVideo(videoOf(p));
};

/** Starts `activeVideoEl()` only AFTER `voice` is audibly playing (`!voiceBuffering`),
 *  preventing `v` from running ahead through the first second and rewinding to 0,
 *  and snaps `v` in RAM the moment `v` enters `playing` if `voice` advanced while
 *  `v` was still buffering over the network. */
const maybeLaunchVideo = () => {
  if (videoLaunched || !running || videoCollapsed || !currentVideoSrc) return;
  if (voice.paused || voiceBuffering) return;
  const v = activeVideoEl();
  if (!v) return;

  const myToken = videoToken;
  const desiredStart = heardVoiceTime();

  const commitLaunch = () => {
    if (
      videoLaunched ||
      myToken !== videoToken ||
      !running ||
      videoCollapsed ||
      v !== activeVideoEl()
    )
      return;
    videoLaunched = true;
    videoRateState = 0;
    v.preload = 'auto';
    applyVideoRate(v, playbackRate);
    videoSpinUpUntil = performance.now() + 360;
    videoLastSeekAt = performance.now();
    v.classList.add('is-active');
    for (const other of narVideoLayers) {
      if (other !== v) {
        if (!other.paused) other.pause();
        other.classList.remove('is-active');
        const stale = other;
        settleTimer = setTimeout(
          () => {
            if (stale !== activeVideoEl()) unloadVideoEl(stale);
          },
          dur('settle') + 40,
        );
      }
    }
    v.addEventListener(
      'playing',
      () => {
        if (
          myToken !== videoToken ||
          !running ||
          videoCollapsed ||
          v !== activeVideoEl() ||
          voice.paused ||
          voiceBuffering
        )
          return;
        applyVideoRate(v, effectiveVideoRate());
        const liveTarget = clampVideoTime(v, heardVoiceTime());
        if (
          Math.abs(v.currentTime - liveTarget) > 0.075 * playbackRate &&
          isTimeBuffered(v, liveTarget)
        ) {
          videoLastSeekAt = performance.now();
          videoSpinUpUntil = performance.now() + 260;
          try {
            v.currentTime = liveTarget;
          } catch {}
        } else {
          videoSpinUpUntil = performance.now() + 180;
        }
      },
      { once: true },
    );
    v.play().catch(() => {});
  };

  // Start near 0:00 — play straight from frame 0 with zero pre-seek; if `v`
  // buffers slower than `voice`, the `playing` listener above snaps it in RAM.
  if (desiredStart <= 0.12 * playbackRate && v.currentTime <= 0.12) {
    commitLaunch();
    return;
  }

  // Audio already advanced before video metadata arrived: seek once while paused.
  const seekAndLaunch = () => {
    if (myToken !== videoToken || videoLaunched) return;
    const target = clampVideoTime(v, heardVoiceTime());
    if (Math.abs(v.currentTime - target) > 0.08 * playbackRate) {
      try {
        v.currentTime = target;
      } catch {}
    }
    commitLaunch();
  };
  if (v.readyState >= 1) seekAndLaunch();
  else v.addEventListener('loadedmetadata', seekAndLaunch, { once: true });
};

const syncVideo = () => {
  if (!narVideo || !narVideoLayers.length) return;
  narrPlacementDirty = true;
  const p = activeVideoPara();
  const src = p ? videoOf(p) : undefined;
  const dismissed = !running || !src || videoCollapsed;
  if (dismissed) {
    narVideo.classList.add('is-dismissed');
    narVideo.classList.remove('is-playing');
    document.documentElement.classList.remove('has-narr-video');
    videoRateState = 0;
    for (const v of narVideoLayers) {
      if (!v.paused) v.pause();
      applyVideoRate(v, playbackRate);
    }
    return;
  }
  if (narVideo.hidden) {
    narVideo.classList.add('is-dismissed');
    narVideo.hidden = false;
    requestAnimationFrame(() => {
      if (running && !videoCollapsed && activeVideoPara()) {
        narVideo.classList.remove('is-dismissed');
      }
    });
  } else {
    narVideo.classList.remove('is-dismissed');
  }
  narVideo.classList.toggle('is-playing', running);
  document.documentElement.classList.add('has-narr-video');

  if (currentVideoSrc !== src) {
    clearTimeout(settleTimer);
    videoToken++;
    videoLaunched = false;
    videoRateState = 0;
    const matchingIdx = narVideoLayers.findIndex(
      v => v.getAttribute('src') === src,
    );
    const nextIdx =
      matchingIdx >= 0
        ? matchingIdx
        : currentVideoSrc
          ? (activeLayerIdx + 1) % narVideoLayers.length
          : activeLayerIdx;
    const prevEl =
      activeLayerIdx !== nextIdx ? narVideoLayers[activeLayerIdx] : null;
    if (prevEl && !prevEl.paused) prevEl.pause();
    const nextEl = narVideoLayers[nextIdx];
    if (!nextEl.paused) nextEl.pause();
    currentVideoSrc = src;
    activeLayerIdx = nextIdx;
    // Give `voice.m4a` exclusive network priority on mobile until `voice`
    // enters `playing`; `maybeLaunchVideo()` promotes preload to `'auto'`.
    if (nextEl.getAttribute('src') !== src) {
      nextEl.preload = phone || isIOS ? 'metadata' : 'auto';
      nextEl.src = src;
      nextEl.load();
    }
    applyVideoRate(nextEl, playbackRate);
    maybeLaunchVideo();
  } else {
    const v = activeVideoEl();
    if (!v) return;
    if (!running) {
      if (!v.paused) v.pause();
      return;
    }
    if (!videoLaunched) {
      maybeLaunchVideo();
      return;
    }
    applyVideoRate(v, effectiveVideoRate());
    if (v.readyState >= 2 && !v.seeking && Number.isFinite(voice.currentTime)) {
      const targetTime = clampVideoTime(v, heardVoiceTime());
      if (
        Math.abs(v.currentTime - targetTime) > 0.09 * playbackRate &&
        isTimeBuffered(v, targetTime)
      ) {
        try {
          v.currentTime = targetTime;
        } catch {}
      }
    }
    if (v.paused && !voiceBuffering) {
      videoSpinUpUntil = performance.now() + 240;
      v.play().catch(() => {});
    }
  }
};

const tickVideoSync = (now: number) => {
  if (!running || videoCollapsed) return;
  if (!videoLaunched) {
    maybeLaunchVideo();
    return;
  }
  if (voice.paused || voiceBuffering) return;
  const v = activeVideoEl();
  if (!v || !currentVideoSrc) return;
  if (now <= videoSpinUpUntil) return;
  if (v.paused) {
    if (
      v.readyState >= 2 &&
      !v.seeking &&
      (!Number.isFinite(v.duration) || v.currentTime < v.duration - 0.12)
    ) {
      videoRateState = 0;
      applyVideoRate(v, playbackRate);
      videoSpinUpUntil = now + 350;
      v.play().catch(() => {});
    }
    return;
  }
  if (v.seeking || v.readyState < 3) return;
  const targetTime = clampVideoTime(v, heardVoiceTime());
  const drift = targetTime - v.currentTime;
  const realDrift = drift / playbackRate;

  // Hard-seek in RAM when drift exceeds 0.45s wall-clock (e.g. decoder/tab
  // stall or audio route change) AND `targetTime` is already buffered — never
  // aborting an active mobile HTTP stream.
  if (
    Math.abs(realDrift) > 0.45 &&
    now - videoLastSeekAt > 1800 &&
    isTimeBuffered(v, targetTime)
  ) {
    videoLastSeekAt = now;
    videoSpinUpUntil = now + 280;
    videoRateState = 0;
    applyVideoRate(v, playbackRate);
    try {
      v.currentTime = targetTime;
    } catch {}
    return;
  }

  // Tight hysteresis rate nudge in wall-clock seconds (invariant across 1×/2×/3×):
  // engages at ±55ms (inside human lip-sync fusion threshold) and releases at
  // ±18ms (~half a 30fps frame), using ±6% gentle trim for small drift and ±14%
  // fast trim for larger unbuffered catch-up — updating AVPlayer.rate only on
  // state transitions.
  let nextState: -2 | -1 | 0 | 1 | 2 = videoRateState;
  const absDrift = Math.abs(realDrift);
  if (absDrift <= 0.018) {
    nextState = 0;
  } else if (realDrift > 0) {
    if (realDrift > 0.16) nextState = 2;
    else if (videoRateState === 2 && realDrift > 0.075) nextState = 2;
    else if (realDrift > 0.055 || videoRateState > 0) nextState = 1;
    else nextState = 0;
  } else {
    if (realDrift < -0.16) nextState = -2;
    else if (videoRateState === -2 && realDrift < -0.075) nextState = -2;
    else if (realDrift < -0.055 || videoRateState < 0) nextState = -1;
    else nextState = 0;
  }
  if (nextState !== videoRateState) {
    videoRateState = nextState;
    applyVideoRate(v, effectiveVideoRate());
  }
};

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
  narrPlacementDirty = true;
  for (const n of narrs) {
    const on = session?.block === n;
    n.el.classList.toggle('is-narrating', on);
    n.paras.forEach((p, i) =>
      p.classList.toggle('is-spoken', on && session?.para === i),
    );
  }
  narrator?.classList.toggle('is-playing', running);
  syncVideo();
};

// ----- listening: the voice, band by band -----
// A live analyser on the voice, read once a frame into log-spaced
// bands — the body of it first, the air last — plus where its energy
// sits. Nothing is drawn here: the field along the foot of the screen
// is what shows it (the pill is only play and pause).

let analyser: AnalyserNode | null = null;
let output: GainNode | null = null;
let freq: Uint8Array<ArrayBuffer> | null = null;

// The analyser needs an AudioContext, which a browser only lets a
// gesture create — so it is built on the first play. On Apple WebKit
// (macOS Safari + ALL iOS browsers including Chrome CriOS), routing
// `<audio>` through `createMediaElementSource` attaches WebKit's
// `MTAudioProcessingTap`, which stalls streaming buffers and breaks clock
// sync at 2× / 3×; so WebKit skips the WebAudio graph completely and
// plays straight on hardware AVPlayer while synthesizing the horizon wave.
const ensureGraph = () => {
  if (isWebKit || ctx) return;
  try {
    ctx = new AudioContext();
    analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.minDecibels = -85;
    analyser.maxDecibels = -25;
    analyser.smoothingTimeConstant = 0.72;
    output = ctx.createGain();
    output.gain.value = devSilent ? 0 : 1;
    analyser.connect(output).connect(ctx.destination);
    const source = ctx.createMediaElementSource(voice);
    source.connect(analyser);
    freq = new Uint8Array(analyser.frequencyBinCount);
  } catch {
    ctx = null;
    analyser = null;
  }
};

// How finely the voice/music spectrum is split — the studio horizon's resolution.
const BANDS = 24;
// Full speech + music range, low body (65 Hz) to air/hi-hats (10.5 kHz).
const LOW_HZ = 65;
const HIGH_HZ = 10500;

let peak = 0.35;

/** One level per band, centre first, from whichever analyser is heard —
 *  the voice's (and the demo's, routed into it), or another sound the
 *  page plays (lib/listening). */
const voiceBands = (half: number, from = analyser) => {
  const out = new Array(half).fill(0);
  if (
    isWebKit &&
    from === analyser &&
    ((running && !voice.paused) || demoPlaying())
  ) {
    const clock = demoPlaying()
      ? (demo?.video.currentTime ?? 0)
      : voice.currentTime;
    const t = clock * 6.2;
    const syllable = Math.max(
      0.14,
      0.55 + 0.32 * Math.sin(t * 0.78) + 0.22 * Math.cos(t * 1.47 + 0.8),
    );
    for (let k = 0; k < half; k++) {
      const u = k / Math.max(1, half - 1);
      const tilt = Math.exp(-u * 1.35) * 0.82 + 0.18;
      const formant =
        0.5 +
        0.28 * Math.sin(t * (1.05 + k * 0.14) + k * 0.85) +
        0.22 * Math.cos(t * (2.15 - k * 0.07) - k * 0.55);
      out[k] = Math.min(1, Math.max(0.03, formant * tilt * syllable)) ** 1.35;
    }
    brightness = 0.32 + 0.1 * Math.sin(t * 0.65);
    return out;
  }
  if (!from) return out;
  if (!freq || freq.length !== from.frequencyBinCount)
    freq = new Uint8Array(from.frequencyBinCount);
  from.getByteFrequencyData(freq);
  const binHz = from.context.sampleRate / from.fftSize;
  for (let k = 0; k < half; k++) {
    const lo = LOW_HZ * (HIGH_HZ / LOW_HZ) ** (k / half);
    const hi = LOW_HZ * (HIGH_HZ / LOW_HZ) ** ((k + 1) / half);
    const a = Math.max(1, Math.floor(lo / binHz));
    const b = Math.max(a + 1, Math.ceil(hi / binHz));
    let sum = 0;
    let hiBin = 0;
    for (let i = a; i < b; i++) {
      const v = freq[i];
      sum += v;
      if (v > hiBin) hiBin = v;
    }
    const mean = sum / (b - a);
    out[k] = (hiBin * 0.6 + mean * 0.4) / 255;
  }
  // Where the voice's energy sits, 0 (low) – 1 (high): the spectral
  // centroid across the same range.
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
  return out.map(v => Math.min(1, v / peak) ** 1.45);
};

/** Another sound the page plays (a song in the Songs card), when the
 *  voice and the demo are quiet. */
const otherSound = () =>
  (running && !voice.paused) || demoPlaying() ? undefined : playingSound();

const listen = () => {
  const other = otherSound();
  const talking = (running && !voice.paused) || demoPlaying() || !!other;
  const bands = talking ? voiceBands(BANDS, other?.analyser ?? analyser) : null;
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
const fieldHome = field?.parentElement ?? null;

/** OVER WHATEVER IS OPEN (Juan, 2026-10-29): a picture in the viewer, the
 *  full player or a shared address's modal stands over the page, so the
 *  field — drawn behind the page — went unseen while the sound played on.
 *  It moves into the open one, behind its content, and back when it
 *  closes. A modal <dialog> is in the top layer, where nothing from the
 *  page can reach; inside it the field's z-index -1 lays it over the
 *  dialog's own ground and under its content. */
const hostField = () => {
  if (!field || !fieldHome) return;
  const dialogs = document.querySelectorAll<HTMLDialogElement>('dialog[open]');
  const host =
    dialogs[dialogs.length - 1] ??
    document.querySelector<HTMLElement>('[data-focused]') ??
    fieldHome;
  if (field.parentElement !== host) host.prepend(field);
};
/** Mean band level this frame, 0–1 (set by listen). */
let loudness = 0;
/** The bars' bands this frame, centre first (set by listen). */
let spectrum: number[] = [];
/** Where the voice's energy sits, 0 low – 1 high (set by listen). */
let brightness = 0.3;
let heard: number[] = [];
let tone = 0.3;
let presence = 0;
let fieldGlow = 0;
let travel = 0;
let lastFrame = 0;
let fieldDirty = false;

// Where the horizon sits: low on the screen, clear of the content.
const HORIZON = 0.86;
// Three strands: wavelength, speed, how far along the spectrum each
// one reads (so each leans on different bands), weight and ink.
const STRANDS = [
  { k: 1, speed: 1, shift: 0, gain: 1, alpha: 1, width: 1.05 },
  { k: 1.6, speed: -0.75, shift: 0.22, gain: 0.72, alpha: 0.6, width: 0.9 },
  { k: 0.65, speed: 0.5, shift: -0.18, gain: 0.85, alpha: 0.45, width: 0.85 },
] as const;

const WAVE_NODES = 73;
const waveXs = new Float32Array(WAVE_NODES);
const waveYs = new Float32Array(WAVE_NODES);

// The field's ink: the page's own --ink, only ever at a whisper.
const INK_RGB = (() => {
  const hex = getComputedStyle(document.documentElement)
    .getPropertyValue('--ink')
    .trim()
    .replace('#', '');
  const n = parseInt(hex.length === 3 ? hex.replace(/./g, '$&$&') : hex, 16);
  return Number.isFinite(n)
    ? [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    : [245, 245, 245];
})();

/** Smooth 3-tap band lookup along `[0, 1]` (0 centre – 1 edge). */
const smoothLevelAt = (u: number) => {
  const n = heard.length;
  if (!n) return 0;
  const read = (pos: number) => {
    const f = Math.min(n - 1, Math.max(0, pos * (n - 1)));
    const i = Math.floor(f);
    const t = f - i;
    return (heard[i] ?? 0) * (1 - t) + (heard[i + 1] ?? heard[i] ?? 0) * t;
  };
  return read(u - 0.045) * 0.25 + read(u) * 0.5 + read(u + 0.045) * 0.25;
};

/** Draws a smooth Catmull-Rom cubic spline through `(xs[0..n-1], ys[0..n-1])`. */
const traceSpline = (
  g: CanvasRenderingContext2D,
  xs: Float32Array,
  ys: Float32Array,
  n: number,
) => {
  g.moveTo(xs[0], ys[0]);
  for (let i = 0; i < n - 1; i++) {
    const i0 = i > 0 ? i - 1 : 0;
    const i1 = i;
    const i2 = i + 1;
    const i3 = i + 2 < n ? i + 2 : n - 1;
    const cp1x = xs[i1] + (xs[i2] - xs[i0]) / 6;
    const cp1y = ys[i1] + (ys[i2] - ys[i0]) / 6;
    const cp2x = xs[i2] - (xs[i3] - xs[i1]) / 6;
    const cp2y = ys[i2] - (ys[i3] - ys[i1]) / 6;
    g.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, xs[i2], ys[i2]);
  }
};

const stepBallistic = (
  cur: number,
  goal: number,
  dtMs: number,
  attackMs: number,
  releaseMs: number,
) => {
  const tau = goal > cur ? attackMs : releaseMs;
  const alpha = 1 - Math.exp(-Math.max(1, dtMs) / tau);
  return cur + (goal - cur) * alpha;
};

const drawField = (now: number) => {
  if (!field || !narrator || narrator.hidden || reduceMotion) return;
  if (phone && lastFrame && now - lastFrame < 30) return;
  const dt = lastFrame ? Math.min(now - lastFrame, 64) : 16;
  lastFrame = now;
  const talking = (running && !voice.paused) || demoPlaying() || !!otherSound();
  hostField();

  const targetBands = spectrum.length || BANDS;
  if (heard.length !== targetBands) heard = new Array(targetBands).fill(0);

  let peakBand = 0;
  for (let i = 0; i < targetBands; i++) {
    const target = talking ? (spectrum[i] ?? 0) : 0;
    heard[i] = stepBallistic(heard[i], target, dt, 58, talking ? 185 : 150);
    if (heard[i] > peakBand) peakBand = heard[i];
  }

  tone = stepBallistic(tone, brightness, dt, 180, 260);
  const activeSession = Boolean((session && running) || demo || otherSound());
  presence = stepBallistic(presence, activeSession ? 1 : 0, dt, 220, 360);
  const glowGoal = talking ? Math.min(1, 0.3 + loudness * 1.25) : 0;
  fieldGlow = stepBallistic(fieldGlow, glowGoal, dt, 140, 340);
  // Advance wave phase smoothly while sounding, easing to a gentle glide on pause.
  travel += dt * 0.0024 * (talking ? 0.12 + loudness * 0.95 : 0.04 * presence);

  const g = field.getContext('2d');
  if (!g) return;
  if (presence < 0.004 && peakBand < 0.003) {
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

  // Subtle cold phosphor shift on the ink RGB while actively sounding,
  // while keeping alpha strictly at a background whisper (~4%..13% max,
  // Juan, 2026-10-05) so the waves never pull the eye off the words.
  const coolMix = 0.22 * fieldGlow;
  const rInk = Math.round(INK_RGB[0] * (1 - coolMix) + 204 * coolMix);
  const gInk = Math.round(INK_RGB[1] * (1 - coolMix) + 230 * coolMix);
  const bInk = Math.round(INK_RGB[2] * (1 - coolMix) + 255 * coolMix);

  g.lineCap = 'round';
  g.lineJoin = 'round';

  for (let sIdx = STRANDS.length - 1; sIdx >= 0; sIdx--) {
    const strand = STRANDS[sIdx];
    const isLead = sIdx === 0;
    const leadGlow = isLead ? presence * fieldGlow : 0;
    const alpha = presence * strand.alpha * (0.038 + 0.092 * loudness);

    for (let i = 0; i < WAVE_NODES; i++) {
      const u = i / (WAVE_NODES - 1);
      const x = u * w;
      const along = Math.min(
        1,
        Math.max(0, Math.abs(u - 0.5) * 2 + strand.shift),
      );
      const level = smoothLevelAt(along);
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
      waveXs[i] = x;
      waveYs[i] = y;
    }

    g.lineWidth = strand.width;
    g.strokeStyle = `rgba(${rInk}, ${gInk}, ${bInk}, ${alpha.toFixed(4)})`;
    if (leadGlow > 0.02) {
      g.shadowColor = `rgba(184, 220, 255, ${(0.12 * leadGlow).toFixed(4)})`;
      g.shadowBlur = 3 * ratio * leadGlow;
    }
    g.beginPath();
    traceSpline(g, waveXs, waveYs, WAVE_NODES);
    g.stroke();
    if (leadGlow > 0.02) {
      g.shadowBlur = 0;
      g.shadowColor = 'transparent';
    }
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
const readable = (p: HTMLElement) => !p.hidden;

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
  reading.p.classList.remove('is-reading', 'is-live');
  reading.box.classList.remove('is-read-along');
  for (const s of readCache.get(reading.root)?.spans ?? [])
    s.classList.remove('is-read');
  reading = null;
};

/** A box the visitor scrolls by hand is theirs: the voice stops pulling it
 *  back to the word being said (Juan, 2026-10-17 — following every word
 *  made a long text impossible to read ahead in). The hold ends when the
 *  word being said is back in view, or after a while with no scrolling.
 *  Kept on the box as `data-held-until` so Base.astro's paragraph scroll
 *  respects it too. */
const HOLD_MS = 8000;
const SCROLL_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  ' ',
]);
const scrollBoxOf = (t: EventTarget | null) =>
  t instanceof Element
    ? t.closest<HTMLElement>('[data-narr-caption], [data-cap]')
    : null;
const hold = (box: HTMLElement | null) => {
  if (box) box.dataset.heldUntil = String(Date.now() + HOLD_MS);
};
const held = (box: HTMLElement) => Number(box.dataset.heldUntil) > Date.now();
for (const type of ['wheel', 'touchmove'] as const)
  document.addEventListener(
    type,
    e => {
      autoScrollBlock = null;
      hold(scrollBoxOf(e.target));
    },
    {
      passive: true,
      capture: true,
    },
  );
document.addEventListener(
  'keydown',
  e => {
    if (SCROLL_KEYS.has(e.key)) {
      autoScrollBlock = null;
      hold(scrollBoxOf(e.target));
    }
  },
  { capture: true },
);
// A press on the box itself, not on its words, is its scrollbar.
document.addEventListener(
  'pointerdown',
  e => {
    const box = scrollBoxOf(e.target);
    if (box && e.target === box) hold(box);
  },
  { capture: true },
);

/** Keep the word being said in view inside its ten-line box — or, in a
 *  three-line caption, on its last line, so the caption rolls up a line
 *  at a time as the voice goes on. Not while the visitor holds the box —
 *  until the word comes back into view on its own. */
const keepInView = (span: HTMLElement) => {
  const own = span.closest<HTMLElement>('[data-narr-caption], [data-cap]');
  if (own && held(own)) {
    const b = own.getBoundingClientRect();
    const r = span.getBoundingClientRect();
    // Back where the follow would keep it anyway, so letting go moves
    // nothing.
    const floor = own === span.closest('[data-narr-caption]') ? 0 : 0.25;
    if (r.top < b.top || r.bottom > b.bottom - b.height * floor) return;
    delete own.dataset.heldUntil;
  }
  const caption = span.closest<HTMLElement>('[data-narr-caption]');
  if (caption) {
    const b = caption.getBoundingClientRect();
    const r = span.getBoundingClientRect();
    const by = r.top + r.height / 2 - (b.top + b.height / 2);
    if (Math.abs(by) > r.height * 0.4)
      caption.scrollTo({
        top: Math.max(0, caption.scrollTop + by),
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    return;
  }
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
  const para =
    session && (running || voice.currentTime > 0)
      ? session.block.paras[session.para]
      : null;
  // A clip with no paragraph on screen reads along in its block's caption.
  const p =
    para && !readable(para)
      ? session!.block.el.querySelector<HTMLElement>('[data-narr-caption]')
      : para;
  if (!p) {
    endReading();
    return;
  }
  const lang = document.documentElement.dataset.lang ?? 'en';
  const root = p.querySelector<HTMLElement>(`:scope > .t[lang="${lang}"]`) ?? p;
  if (reading && (reading.p !== p || reading.root !== root)) endReading();
  const words = wordsOf(p, root, lang);
  if (!reading) {
    const box = p.matches('[data-narr-caption]')
      ? p
      : (p.closest<HTMLElement>('[data-cap]') ?? p.parentElement ?? p);
    reading = { p, root, box, upTo: 0 };
    p.classList.add('is-reading');
    box.classList.add('is-read-along');
  }
  p.classList.toggle('is-live', running);
  const t = heardVoiceTime();
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

// The hero's and footer's anchors: on a phone the narrator parks under the
// wordmark there, as it does on a desk, instead of in its corner.
const heroBox = document.getElementById('top');
const heroAnchor =
  heroBox?.querySelector<HTMLElement>('[data-narr-anchor]') ?? null;
const footerBox = document.querySelector<HTMLElement>('.site-footer');
const footerAnchor =
  footerBox?.querySelector<HTMLElement>('[data-narr-anchor]') ?? null;
const heroInner = document.querySelector<HTMLElement>('[data-hero-inner]');

let lastVideoTx = '';
let lastMorphDx = '';
let lastMorphDy = '';
let lastVideoOwn = '';
let lastVideoPe = '';
let cachedRem =
  parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
window.addEventListener(
  'resize',
  () => {
    cachedRem =
      parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    narrPlacementDirty = true;
    wakeNarrator();
  },
  { passive: true },
);
window.visualViewport?.addEventListener(
  'resize',
  () => {
    narrPlacementDirty = true;
    wakeNarrator();
  },
  { passive: true },
);

const placeVideo = (
  nx: number,
  ny: number,
  nw: number,
  nh: number,
  centerShare = 0,
) => {
  if (!narVideo || narVideo.hidden) return;
  const rem = cachedRem;
  const vw = (phone ? 7 : 8.75) * rem;
  const vh = (phone ? 12.44 : 15.56) * rem;
  let vx = nx;
  let vy = ny;
  if (!phone) {
    vx = nx + centerShare * ((nw - vw) / 2);
    vy = ny - 1.75 * rem;
  } else if (narrator?.classList.contains('is-parked')) {
    vx = nx + centerShare * ((nw - vw) / 2);
    vy = ny;
  } else {
    vx = nx + nw - vw;
    vy = ny + nh - vh;
  }
  const tx = `translate3d(${vx.toFixed(1)}px, ${vy.toFixed(1)}px, 0)`;
  if (tx !== lastVideoTx) {
    lastVideoTx = tx;
    narVideo.style.transform = tx;
  }
  const dx = `${(nx - vx).toFixed(1)}px`;
  if (dx !== lastMorphDx) {
    lastMorphDx = dx;
    narVideo.style.setProperty('--morph-dx', dx);
  }
  const dy = `${(ny - vy).toFixed(1)}px`;
  if (dy !== lastMorphDy) {
    lastMorphDy = dy;
    narVideo.style.setProperty('--morph-dy', dy);
  }
  const own = narrator?.style.opacity || '1';
  if (own !== lastVideoOwn) {
    lastVideoOwn = own;
    narVideo.style.setProperty('--narr-own', own);
  }
  const pe = narrator?.style.pointerEvents ?? '';
  if (pe !== lastVideoPe) {
    lastVideoPe = pe;
    narVideo.style.pointerEvents = pe;
  }
};

let lastNarrTx = '';
let lastParkX = '';
let lastParkY = '';
let lastNarrOp = '__init__';
let lastNarrPe = '__init__';
let lastNarrParked = false;

const setNarrStyle = (op: string, pe: string) => {
  if (!narrator) return;
  if (op !== lastNarrOp) {
    lastNarrOp = op;
    narrator.style.opacity = op;
  }
  if (pe !== lastNarrPe) {
    lastNarrPe = pe;
    narrator.style.pointerEvents = pe;
  }
};

// Only when placement changes (scroll, resize, deck turn, language switch):
// avoids layout reads (offsetWidth / getBoundingClientRect) at 60–120fps
// while the page sits still.
const placeNarrator = () => {
  if (!narrator || narrator.hidden || !narrPlacementDirty) return;
  narrPlacementDirty = false;
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
      const px = r.left + r.width / 2 - narrator.offsetWidth / 2;
      const py = r.top;
      if (!lastNarrParked) {
        lastNarrParked = true;
        narrator.classList.add('is-parked');
      }
      const pxStr = `${px.toFixed(1)}px`;
      if (pxStr !== lastParkX) {
        lastParkX = pxStr;
        narrator.style.setProperty('--park-x', pxStr);
      }
      const pyStr = `${py.toFixed(1)}px`;
      if (pyStr !== lastParkY) {
        lastParkY = pyStr;
        narrator.style.setProperty('--park-y', pyStr);
      }
      const own = Math.min(
        1,
        (hero.bottom - innerHeight / 2) / (innerHeight / 4),
      );
      setNarrStyle(own < 0.999 ? own.toFixed(3) : '', own < 0.6 ? 'none' : '');
      placeVideo(px, py, narrator.offsetWidth, narrator.offsetHeight, 1);
      return;
    }
    const foot = footerBox?.getBoundingClientRect();
    if (footerAnchor && foot && foot.top < innerHeight / 2 && !focusOpen()) {
      const r = footerAnchor.getBoundingClientRect();
      const px = r.left;
      const py = r.top;
      if (!lastNarrParked) {
        lastNarrParked = true;
        narrator.classList.add('is-parked');
      }
      const pxStr = `${px.toFixed(1)}px`;
      if (pxStr !== lastParkX) {
        lastParkX = pxStr;
        narrator.style.setProperty('--park-x', pxStr);
      }
      const pyStr = `${py.toFixed(1)}px`;
      if (pyStr !== lastParkY) {
        lastParkY = pyStr;
        narrator.style.setProperty('--park-y', pyStr);
      }
      const own = Math.min(
        1,
        (innerHeight / 2 - foot.top) / (innerHeight / 4),
      );
      setNarrStyle(own < 0.999 ? own.toFixed(3) : '', own < 0.6 ? 'none' : '');
      placeVideo(px, py, narrator.offsetWidth, narrator.offsetHeight, 0);
      return;
    }
    if (lastNarrParked) {
      lastNarrParked = false;
      narrator.classList.remove('is-parked');
    }
    const has = !!showing && firstVoiced(showing) >= 0;
    let cornerOwn = has ? 1 : 0;
    if (cornerOwn > 0 && hero && heroAnchor) {
      cornerOwn = Math.min(
        cornerOwn,
        clamp((innerHeight / 2 - hero.bottom) / (innerHeight / 4), 0, 1),
      );
    }
    if (cornerOwn > 0 && foot) {
      cornerOwn = Math.min(
        cornerOwn,
        clamp((foot.top - innerHeight / 2) / (innerHeight / 4), 0, 1),
      );
    }
    setNarrStyle(
      cornerOwn < 0.999 ? cornerOwn.toFixed(3) : '',
      cornerOwn < 0.6 ? 'none' : '',
    );
    const nr = narrator.getBoundingClientRect();
    placeVideo(nr.left, nr.top, nr.width, nr.height, 0);
    return;
  }
  const width = narrator.offsetWidth;
  const height = narrator.offsetHeight;
  let sum = 0;
  let centerSum = 0;
  let x = 0;
  let y = 0;
  for (const { anchor, w } of parks) {
    const r = anchor.getBoundingClientRect();
    const isCenter = anchor.dataset.narrAlign === 'center';
    const left = isCenter ? r.left + r.width / 2 - width / 2 : r.left;
    sum += w;
    if (isCenter) centerSum += w;
    x += left * w;
    y += r.top * w;
  }
  const nx = sum > 0.0001 ? x / sum : 0;
  const ny = sum > 0.0001 ? y / sum : 0;
  const centerShare = sum > 0.0001 ? centerSum / sum : 0;
  if (sum > 0.0001) {
    const tx = `translate(${nx.toFixed(1)}px, ${ny.toFixed(1)}px)`;
    if (tx !== lastNarrTx) {
      lastNarrTx = tx;
      narrator.style.transform = tx;
    }
  }
  // Past the last narrated block (the page's foot) nothing owns the
  // narrator: it fades with the block that lets it go, instead of being
  // left standing wherever that block last put it.
  const own = Math.min(1, sum);
  setNarrStyle(own < 0.999 ? own.toFixed(3) : '', own < 0.05 ? 'none' : '');
  placeVideo(nx, ny, width, height, centerShare);
};

let narrLoopId = 0;
let narrGlideUntil = 0;

const animateNarrator = (now: number) => {
  narrLoopId = 0;
  if (document.hidden) return;
  if (now <= narrGlideUntil) narrPlacementDirty = true;
  updateRead();
  updateCues();
  tickVideoSync(now);
  placeNarrator();
  listen();
  drawField(now);
  const active =
    Boolean((session && running) || demo || otherSound()) ||
    presence >= 0.004 ||
    fieldDirty ||
    narrPlacementDirty ||
    now <= narrGlideUntil;
  if (active) {
    narrLoopId = requestAnimationFrame(animateNarrator);
  }
};

function wakeNarrator() {
  if (narrLoopId || document.hidden || !narrator || narrator.hidden) return;
  lastFrame = 0;
  narrLoopId = requestAnimationFrame(animateNarrator);
}

const markPlacementDirty = () => {
  narrPlacementDirty = true;
  // A deck turn moves `.narr-anchor` over `--dur-turn` (340ms) via CSS
  // transition, so keep sampling `anchor.getBoundingClientRect()` every
  // frame until the anchor's transition settles.
  narrGlideUntil = Math.max(
    narrGlideUntil,
    performance.now() + dur('turn') + 60,
  );
  wakeNarrator();
};

// ----- the session -----
const stop = () => {
  clearTimeout(settleTimer);
  sessionToken++;
  videoToken++;
  videoLaunched = false;
  voiceBuffering = false;
  autoScrollBlock = null;
  voice.pause();
  session = null;
  running = false;
  paint();
  wakeNarrator();
  setTimeout(() => {
    if (!session && !running) {
      currentVideoSrc = '';
      for (const v of narVideoLayers) unloadVideoEl(v);
    }
  }, dur('settle'));
};

const start = (block: Narr, para: number) => {
  const p = block.paras[para];
  const src = p && clipOf(p);
  if (!src) {
    stop();
    return;
  }
  sessionToken++;
  preloadedForToken = -1;
  // Cancel any unconsumed standby audio download for a different clip so
  // `voice` gets 100% network priority on mobile.
  if (preloadedAudioSrc && preloadedAudioSrc !== src) {
    preloadAudio.pause();
    preloadAudio.removeAttribute('src');
    preloadAudio.load();
    preloadedAudioSrc = '';
  }
  voiceBuffering = true;
  ensureGraph();
  ctx?.resume();
  voice.muted = devSilent;
  voice.src = src;
  applyAudioRate(voice, playbackRate);
  session = { block, para };
  running = true;
  relang = false;
  const mySessionToken = sessionToken;
  claimSession();
  paint();
  wakeNarrator();
  voice.play().catch(() => {
    if (mySessionToken === sessionToken) stop();
  });
  document.dispatchEvent(new CustomEvent('narr:voice'));
  // Whatever shows this paragraph can follow the voice to it (a deck
  // turns to the card being told).
  document.dispatchEvent(new CustomEvent('narr:para', { detail: p }));
};

const pause = () => {
  voiceBuffering = false;
  autoScrollBlock = null;
  running = false;
  voice.pause();
  paint();
  wakeNarrator();
};

// The language changes under a paragraph: when it has its own voice in
// the new language (or loses it), that paragraph starts over in it —
// playing on if it was playing, from its start when next resumed.
let relang = false;
new MutationObserver(() => {
  markPlacementDirty();
  if (!session) return;
  const p = session.block.paras[session.para];
  const src = p && clipOf(p);
  if (!src || voice.src.endsWith(src)) return;
  if (running) start(session.block, session.para);
  else relang = true;
}).observe(document.documentElement, { attributeFilter: ['data-lang'] });

const resume = () => {
  if (!session) return;
  if (relang || voice.currentTime === 0) {
    relang = false;
    start(session.block, session.para);
    return;
  }
  running = true;
  claimSession();
  ctx?.resume();
  voice.muted = devSilent;
  applyAudioRate(voice, playbackRate);
  paint();
  wakeNarrator();
  voice.play().catch(() => stop());
  document.dispatchEvent(new CustomEvent('narr:voice'));
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
const claimSession = () => {
  if (!('mediaSession' in navigator)) return;
  claimMetadata();
  navigator.mediaSession.setActionHandler('play', () => {
    if (session) resume();
  });
  navigator.mediaSession.setActionHandler('pause', () => pause());
  navigator.mediaSession.setActionHandler('previoustrack', null);
  navigator.mediaSession.setActionHandler('nexttrack', null);
};
claimSession();

// A song starts on the Songs card (SongsPlayer): the voice steps aside,
// one sound at a time — and the song pauses when the voice starts or
// resumes (`narr:voice`).
document.addEventListener('media:solo', () => {
  if (running) pause();
  wakeNarrator();
});

// A paragraph ends: the next one in the block, or the page turns and
// the render loop picks the voice up wherever it lands (`follow`).
const onParagraphEnded = () => {
  if (!session || !running) return;
  // The paragraph introduces a demo (its own song line): it plays now,
  // and the voice carries on past the paragraph once it ends.
  const p = session.block.paras[session.para];
  const song = cueOf(p)?.dataset.songKey;
  if (song) {
    running = false;
    paint();
    openDemo(song, () => {
      running = true;
      carryOn();
    });
    return;
  }
  carryOn();
};

voice.addEventListener('ended', onParagraphEnded);
for (const v of narVideoLayers) {
  v.addEventListener('ended', () => {
    if (v !== activeVideoEl() || !session || !running || videoCollapsed) return;
    if (
      Number.isFinite(voice.duration) &&
      voice.duration > 0 &&
      voice.duration - voice.currentTime <= 0.4 * playbackRate
    ) {
      voice.pause();
      onParagraphEnded();
    }
  });
}

const advanceToBlock = (nextBlock: Narr | undefined, scrollFn: () => void) => {
  if (!nextBlock) {
    stop();
    return;
  }
  const p = startOf(nextBlock);
  autoScrollBlock = nextBlock;
  autoScrollUntil = performance.now() + 900;
  scrollFn();
  if (p >= 0) start(nextBlock, p);
  else stop();
};

const carryOn = () => {
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
  const nextPanel = block.panel ? panels[panels.indexOf(block) + 1] : panels[0];
  if (nextPanel) advanceToBlock(nextPanel, () => scrollToPanel(nextPanel));
  else stop();
};

// The box a panel owns on the page.
const boxOf = (el: HTMLElement): HTMLElement =>
  el.closest<HTMLElement>('section') ?? el;

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
  markPlacementDirty();
  const p = (e as CustomEvent<HTMLElement>).detail;
  if (!session) return;
  const i = session.block.paras.indexOf(p);
  if (i < 0 || i === session.para) return;
  // Turned to the card already being told (the deck following the voice,
  // as a song's link makes it): the voice stays where it is.
  const card = p.closest('.deck-card');
  if (card && card === session.block.paras[session.para]?.closest('.deck-card'))
    return;
  if (running) start(session.block, i);
  else {
    session = { block: session.block, para: i };
    const src = clipOf(p);
    if (src) voice.src = src;
    paint();
  }
});

document.addEventListener('narr:para', () => {
  markPlacementDirty();
});

// The game has its own music: starting it quiets the voice, which
// resumes from the same sentence on the next press.
document.addEventListener('arcade:start', () => {
  if (running) pause();
});

// A language switch changes only which paragraph paints: the voice is the
// same Spanish take in every language, so it plays on (the read-along
// reads the page's language each frame).

// Pre-warm the active block's first take when a desktop mouse approaches the
// narrator button. Never run on touch (`touchstart`/`pointerdown`), where
// `click` follows ~60ms later and starting a duplicate `.load()` races `start()`.
const warmInitial = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse' || phone || isIOS || session) return;
  const p = activeVideoPara();
  if (!p) return;
  warmAudio(clipOf(p));
  const vSrc = videoOf(p);
  const el = narVideoLayers[activeLayerIdx];
  if (vSrc && el && el.getAttribute('src') !== vSrc) {
    el.preload = 'auto';
    el.src = vSrc;
    el.load();
    const prime = () => {
      if (!session && el.getAttribute('src') === vSrc) {
        try {
          el.currentTime = 0.001;
        } catch {}
      }
    };
    if (el.readyState >= 1) prime();
    else el.addEventListener('loadedmetadata', prime, { once: true });
  }
};
narrator?.addEventListener('pointerenter', warmInitial, { passive: true });

// One control. Pressed on the block being told, it pauses or resumes;
// anywhere else, it starts telling what the page is showing.
narrator?.addEventListener('click', () => {
  if (!running) videoCollapsed = false;
  if (session && session.block === showing) {
    if (running) pause();
    else resume();
    return;
  }
  const block = showing ?? narrs[0];
  if (block) start(block, Math.max(startOf(block), 0));
});

narVideoClose?.addEventListener('click', e => {
  e.stopPropagation();
  videoCollapsed = true;
  syncVideo();
  narrPlacementDirty = true;
  placeNarrator();
});

narVideoRates?.addEventListener('click', e => {
  e.stopPropagation();
});

for (const btn of narRateBtns) {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const rate = Number(btn.dataset.narrRate);
    if (rate) setPlaybackRate(rate);
  });
}

narVideo?.addEventListener('click', e => {
  if (
    (e.target as Element | null)?.closest(
      '[data-narr-video-close], .nar-video-rates',
    )
  )
    return;
  narrator?.click();
});

// ----- songs a take introduces (lib/narration SONGS, SongDemo.astro) -----
// A take that introduces a demo carries a line for the song under its
// paragraph. The demo is a screen recording that plays over the page —
// tapped from that line or from the app's welcome, or when the voice
// finishes the paragraph — and is heard through the same graph as the
// voice, so the waves along the foot draw it too.
const cues = [...document.querySelectorAll<HTMLElement>('[data-song-cue]')];
const paraOfCue = (cue: HTMLElement) =>
  cue.previousElementSibling as HTMLElement | null;

let demo: {
  key: string;
  el: HTMLElement;
  video: HTMLVideoElement;
  opener: HTMLElement | null;
  /** What the voice does once it ends: carry on past the paragraph that
   *  introduced it, pick up where it was paused, or nothing. */
  then: (() => void) | null;
} | null = null;
const routed = new WeakSet<HTMLVideoElement>();
let stilling: ReturnType<typeof setTimeout> | undefined;
const demoPlaying = () => !!demo && !demo.video.paused;

const closeDemo = () => {
  if (!demo) return;
  const { el, video, opener, then } = demo;
  demo = null;
  clearTimeout(stilling);
  video.pause();
  el.classList.remove('is-open', 'is-still');
  document.documentElement.classList.remove('is-demo', 'is-demo-still');
  wakeNarrator();
  if (opener && opener.isConnected) opener.focus({ preventScroll: true });
  setTimeout(
    () => {
      if (!demo || demo.el !== el) el.hidden = true;
      video.currentTime = 0;
    },
    reduceMotion ? 0 : dur('turn'),
  );
  then?.();
};

const openDemo = (key: string, then: (() => void) | null) => {
  const el = document.querySelector<HTMLElement>(`[data-song-demo="${key}"]`);
  const video = el?.querySelector('video');
  if (!el || !video) {
    then?.();
    return;
  }
  const opener =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
  if (video.dataset.poster) {
    video.poster = video.dataset.poster;
    video.removeAttribute('data-poster');
  }
  ensureGraph();
  ctx?.resume();
  if (ctx && analyser && !routed.has(video)) {
    try {
      ctx.createMediaElementSource(video).connect(analyser);
      routed.add(video);
    } catch {
      /* heard straight from the element, without the waves */
    }
  }
  demo = { key, el, video, opener, then };
  el.hidden = false;
  document.documentElement.classList.add('is-demo');
  el.querySelector<HTMLElement>('[data-song-demo-close]')?.focus({
    preventScroll: true,
  });
  wakeNarrator();
  // Once the frost has come in it goes solid, and once it is solid the
  // page under it stops being drawn (SongDemo.astro, `is-still`).
  const turn = reduceMotion ? 0 : dur('turn');
  clearTimeout(stilling);
  requestAnimationFrame(() => {
    if (demo?.el !== el) return;
    el.classList.add('is-open');
    stilling = setTimeout(() => {
      el.classList.add('is-still');
      stilling = setTimeout(
        () => document.documentElement.classList.add('is-demo-still'),
        turn,
      );
    }, turn);
  });
  video.currentTime = 0;
  video.play().catch(() => closeDemo());
};

/** Opened by hand: a running voice pauses for it and resumes after. */
const openDemoByHand = (key: string) => {
  const wasRunning = running;
  if (running) pause();
  openDemo(key, wasRunning ? resume : null);
};

for (const cue of cues)
  cue.addEventListener('click', () => {
    if (cue.dataset.songKey) openDemoByHand(cue.dataset.songKey);
  });

// The same demo offered from elsewhere (an app's welcome).
for (const link of document.querySelectorAll<HTMLElement>('[data-song-link]'))
  link.addEventListener('click', () => {
    if (link.dataset.songLink) openDemoByHand(link.dataset.songLink);
  });

for (const el of document.querySelectorAll<HTMLElement>('[data-song-demo]')) {
  el.querySelector('video')?.addEventListener('ended', closeDemo);
  el.querySelector('[data-song-demo-close]')?.addEventListener(
    'click',
    closeDemo,
  );
  // Around the phone is the page, out of focus: a click there closes it
  // — a mouse's, clear of the controls (lib/dismiss).
  const stage = el.querySelector('[data-song-demo-stage]');
  stage?.addEventListener('click', e => {
    if (e.target === stage && meantToClose(e as MouseEvent, el)) closeDemo();
  });
}
window.addEventListener(
  'keydown',
  e => {
    if (e.key === 'Escape' && demo) {
      e.stopImmediatePropagation();
      closeDemo();
    }
  },
  { capture: true },
);

/** The song's line, when the paragraph it belongs to is `p`. */
const cueOf = (p: HTMLElement) =>
  cues.find(cue => paraOfCue(cue) === p) ?? null;

const updateCues = () => {
  for (const cue of cues) {
    const on = !!demo && demo.key === cue.dataset.songKey;
    if (on !== cue.classList.contains('is-playing'))
      cue.classList.toggle('is-playing', on);
  }
};

const collect = (el: HTMLElement, panel = false) => {
  const n: Narr = {
    el,
    paras: [...el.querySelectorAll<HTMLElement>('[data-narr-para]')],
    anchor: el.querySelector<HTMLElement>('[data-narr-anchor]'),
    panel,
  };
  // While a block is being told, its other paragraphs can be tapped to
  // jump straight to them (a link inside one still navigates).
  n.paras.forEach((p, i) =>
    p.addEventListener('click', e => {
      if ((e.target as Element | null)?.closest('a[href]')) return;
      if (window.getSelection()?.toString()) return;
      if (session?.block === n && session.para !== i && clipOf(p)) start(n, i);
    }),
  );
  narrs.push(n);
  return n;
};

const heroEl = document.querySelector<HTMLElement>('[data-narr-block="hero"]');
const heroNarr = heroEl ? collect(heroEl) : undefined;

// Only the panels this layout draws.
panels = [...document.querySelectorAll<HTMLElement>('[data-narr-panel]')]
  .filter(el => el.getClientRects().length > 0)
  .map(el => collect(el, true));

// Nothing recorded anywhere → no narrator at all.
if (narrator && narrs.length) {
  narrator.hidden = false;
  if (narVideo) narVideo.hidden = false;
  wakeNarrator();
}

const docks = phone
  ? [...document.querySelectorAll<HTMLElement>('[data-dock]')]
  : [];

const render = () => {
  narrPlacementDirty = true;
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
    if (session && running && showing !== session.block) {
      if (
        autoScrollBlock &&
        performance.now() < autoScrollUntil &&
        session.block === autoScrollBlock
      ) {
        if (showing === autoScrollBlock) autoScrollBlock = null;
      } else {
        autoScrollBlock = null;
        follow(showing);
      }
    }
    placeNarrator();
    wakeNarrator();
    return;
  }
  const vh = window.innerHeight;
  // How far the page has come past its hero — every panel's share waits
  // on it. A page with no hero (More of Me) opens on a panel, which owns
  // the narrator from the first paint.
  const hp = heroNarr ? step(clamp(window.scrollY / vh, 0, 1)) : 1;

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
  // screen and owns the voice once it holds the middle of the screen.
  for (const n of panels) {
    const rect = boxOf(n.el).getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > vh) continue;
    // In by how far it has come up, out by how far it has gone — so two
    // panels in a row cross-fade it at their seam.
    const own =
      step(clamp(1 - rect.top / vh, 0, 1)) *
      step(clamp(rect.bottom / vh, 0, 1));
    if (n.anchor && own > 0) parks.push({ anchor: n.anchor, w: own * hp });
    if (!showing && rect.top < vh * 0.5 && rect.bottom > vh * 0.5) showing = n;
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

  if (session && running && showing !== session.block) {
    if (
      autoScrollBlock &&
      performance.now() < autoScrollUntil &&
      session.block === autoScrollBlock
    ) {
      if (showing === autoScrollBlock) autoScrollBlock = null;
    } else {
      autoScrollBlock = null;
      follow(showing);
    }
  }

  placeNarrator();
  wakeNarrator();
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
  if (!document.hidden) render();
});

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });

// Re-render when a `[data-reveal]` block or `[data-cap]` settles so anchor positions are exact.
document.addEventListener(
  'transitionend',
  event => {
    const target = event.target as HTMLElement;
    if (target?.hasAttribute?.('data-reveal')) render();
  },
  { passive: true },
);
document.addEventListener('caps:layout', () => render());

render();

// Closing the modal ends what it was telling — the page under it is at
// its top, and a voice running on would start the hero's — and the page
// takes the narrator back.
document.addEventListener('focus:close', stop);
document.addEventListener('focus:closed', () => render());

// Reveal the narrator only AFTER `[data-cap]`, fonts and first placement
// have settled so it appears cleanly in place without jumping over text;
// enable stepped transitions one frame later.
const revealNarrator = () => {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      render();
      narrator?.classList.remove('is-booting');
      if (stepped) {
        requestAnimationFrame(() =>
          document.documentElement.classList.add('is-stepped'),
        );
      }
    }),
  );
};
if (document.fonts?.ready) document.fonts.ready.then(revealNarrator);
else revealNarrator();
