/**
 * EASTER EGGS — Juan's own work passing through the page, once a visit:
 * Space Explorer's ship flies across the hero (ShipEgg, lib/ship), and
 * Tridi's robot walks across the foot (RobotEgg, lib/robot). Each is a
 * link to its card. They are rare and quiet on purpose: only on a panel
 * that holds the screen, never starting while the voice reads or anything
 * is open over the page, and with reduced motion they stand still. One
 * already passing plays on when the voice starts or stops (Juan,
 * 2026-10-28): it goes only when something covers it.
 *
 * This file is what every visit loads (a few hundred bytes): the clock
 * that decides when. The drawing is fetched the first time one shows.
 */
const root = document.documentElement;

export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

/** Something is over the page: a modal, a demo, the game, a picture in
 *  the viewer — or the tab is not on screen. An egg passing stops. */
export const covered = () =>
  document.hidden ||
  root.classList.contains('is-focus') ||
  root.classList.contains('is-demo') ||
  !!root.dataset.arcade ||
  !!document.querySelector('dialog[open]');

/** Something else has the page — covered, or the voice reading: no egg
 *  starts. */
export const busy = () =>
  covered() || !!document.querySelector('[data-narrator].is-playing');

/** Calls `show` ONCE A VISIT (Juan, 2026-10-29): `first` ms (a range)
 *  after `panel` comes to hold the screen while the page is free (and
 *  `ready`, when given, says yes). It played again every time the panel
 *  came back and every half minute while it stayed, which read as
 *  repetitive; a reload brings it back. `then` is kept for callers. */
export const nowAndThen = (
  panel: HTMLElement,
  first: [number, number],
  _then: [number, number],
  show: () => Promise<void>,
  ready: () => boolean = () => true,
) => {
  const wait = ([a, b]: [number, number]) => a + Math.random() * (b - a);
  let held = false;
  let showing = false;
  let shown = false;
  let timer = 0;
  const arm = (ms: number) => {
    clearTimeout(timer);
    timer = window.setTimeout(tick, ms);
  };
  const tick = async () => {
    if (!held || showing || shown) return;
    if (busy() || !ready()) return arm(1000);
    showing = true;
    shown = true;
    try {
      await show();
    } finally {
      showing = false;
    }
  };
  new IntersectionObserver(
    ([entry]) => {
      held = entry.intersectionRatio >= 0.6;
      if (held && !showing && !shown) arm(wait(first));
      else clearTimeout(timer);
    },
    { threshold: [0, 0.6] },
  ).observe(panel);
};

/** A frame loop: `frame(dt)` until it returns false or something covers
 *  the page. Resolves true when it ran to its end (or `frame` ended it). */
export const run = (frame: (dt: number) => boolean) =>
  new Promise<boolean>(done => {
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (covered()) return done(false);
      if (!frame(dt)) return done(true);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

/** A canvas sized to its box at the screen's density (two at most). */
export const fit = (canvas: HTMLCanvasElement) => {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
};

/** Back to nothing: no pixels kept while it is not showing. */
export const release = (canvas: HTMLCanvasElement) => {
  canvas.width = 0;
  canvas.height = 0;
};

/** An egg's link, on the landing: turn the deck to its card and go there
 *  — the page, not the card's own address (which is where the link goes
 *  with no script, or opened in a new tab). */
export const toCard = (link: HTMLAnchorElement, deck: string, card: string) =>
  link.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    const section = document.getElementById(deck);
    if (!section) return;
    e.preventDefault();
    document.dispatchEvent(new CustomEvent('deck:show', { detail: { deck, card } }));
    section.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    section.querySelector<HTMLElement>('[data-panel-deck]')?.focus({ preventScroll: true });
  });

/** Hovered or focused, the egg holds still so it can be clicked: the
 *  rate its clock runs at, easing to 0 and back. */
export const holdable = (link: HTMLElement) => {
  let held = false;
  let rate = 1;
  const on = () => (held = true);
  const off = () => (held = false);
  link.addEventListener('pointerenter', on);
  link.addEventListener('pointerleave', off);
  link.addEventListener('focus', on);
  link.addEventListener('blur', off);
  return (dt: number) => {
    rate += ((held ? 0 : 1) - rate) * Math.min(1, dt * 8);
    return rate;
  };
};
