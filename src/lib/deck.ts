/**
 * THE DECK — the page's one sideways slider: More Work and both stories'
 * slides turn through it, so the three of them move, wrap and answer the
 * same controls the same way.
 *
 * ONE CARD ON STAGE. Every card stands in one grid cell; only the current
 * one shows. Neighbours peeking at the page's edges were the first take,
 * and in the stories all they showed was the next card's title cut off at
 * the edge — noise, not a hint: the dots already say there is more
 * (Juan, 2026-10-02).
 *
 * A TURN IS LAYERED, AND IT HAS A DIRECTION. The card leaving drifts out
 * the way the deck is turning and fades; the card arriving comes in from
 * the other side PART BY PART — every `[data-deck-part]` carries its place
 * in the order as `--i`, so the picture lands first and the words follow
 * it in. The CSS (`.deck-card`, global.css) owns the motion; this file
 * only says which card is current, which is leaving, and which way.
 *
 * The deck is ENDLESS: past the last card the first one is simply next
 * again, still turning forwards. It turns by its controls — the arrows, the
 * dots, the arrow keys while it has focus — and on a touch screen by a
 * sideways SWIPE. A mouse drag and the trackpad's sideways scroll were
 * tried on More Work and removed: they fought the page's own scrolling. A
 * finger's swipe does not, as long as the deck gives the browser only the
 * vertical pan (`touch-action: pan-y` on the swiped element).
 */
export type Deck = {
  go: (i: number, dir?: 1 | -1) => void;
  readonly current: number;
};

import { dur } from './motion';

/** How long a leaving card stays drawn — its cross-fade (the ladder's
 *  `quick`), and a margin. */
const leaveMs = () => dur('quick') + 100;

export const createDeck = ({
  cards,
  controls,
  keys,
  swipe,
  onChange,
}: {
  cards: HTMLElement[];
  /** The `DeckControls` block. */
  controls: HTMLElement | null;
  /** What listens for the arrow keys — the focusable carousel. */
  keys: HTMLElement | null;
  /** What a finger swipes sideways to turn the deck. */
  swipe?: HTMLElement | null;
  onChange?: (current: number) => void;
}): Deck => {
  const n = cards.length;
  const dots = [
    ...(controls?.querySelectorAll<HTMLElement>('[data-deck-dot]') ?? []),
  ];
  let current = 0;
  const leaving = new Map<HTMLElement, ReturnType<typeof setTimeout>>();

  const mark = () => {
    cards.forEach((card, i) => {
      card.classList.toggle('is-current', i === current);
      card.setAttribute('aria-hidden', i === current ? 'false' : 'true');
    });
    dots.forEach((dot, i) => dot.classList.toggle('is-current', i === current));
    onChange?.(current);
  };

  const go = (i: number, dir?: 1 | -1) => {
    const next = ((i % n) + n) % n;
    if (next === current) return;
    // Forwards unless told otherwise: an arrow says its own way, a dot
    // reads it off the order, and a wrap past either end keeps going.
    const way = dir ?? (next > current ? 1 : -1);
    const from = cards[current];
    const to = cards[next];

    // The card leaving drifts out the way the deck turns.
    from.style.setProperty('--dir', String(way));
    from.classList.add('is-leaving');
    clearTimeout(leaving.get(from));
    leaving.set(
      from,
      setTimeout(() => {
        from.classList.remove('is-leaving');
        leaving.delete(from);
      }, leaveMs()),
    );

    // The card arriving is stood on its far side with no transition,
    // then released: its parts come in from there, one after another.
    clearTimeout(leaving.get(to));
    leaving.delete(to);
    to.classList.remove('is-leaving');
    to.style.setProperty('--dir', String(way));
    to.classList.add('is-arriving');
    void to.offsetWidth;
    to.classList.remove('is-arriving');

    current = next;
    mark();
  };

  controls
    ?.querySelector('[data-deck-prev]')
    ?.addEventListener('click', () => go(current - 1, -1));
  controls
    ?.querySelector('[data-deck-next]')
    ?.addEventListener('click', () => go(current + 1, 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));

  keys?.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') go(current - 1, -1);
    else if (e.key === 'ArrowRight') go(current + 1, 1);
    else return;
    e.preventDefault();
  });

  // A swipe is a mostly-sideways move of a finger's width or more; a
  // vertical one is the page's.
  let from: { x: number; y: number } | null = null;
  swipe?.addEventListener(
    'touchstart',
    e => {
      const t = e.touches[0];
      from = e.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null;
    },
    { passive: true },
  );
  swipe?.addEventListener(
    'touchend',
    e => {
      if (!from) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - from.x;
      const dy = t.clientY - from.y;
      from = null;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      const way = dx < 0 ? 1 : -1;
      go(current + way, way);
    },
    { passive: true },
  );

  mark();
  return {
    go,
    get current() {
      return current;
    },
  };
};

/**
 * Calls `fn` (once a frame at most) whenever the words above any card's
 * narrator slot change size. The still anchor stands on the slot's
 * HEIGHT, and that height moves on more than a turn or a resize: a
 * language switch re-sets every paragraph (Spanish runs longer, Chinese
 * shorter), and late fonts reflow them too. Watching the words catches
 * all of it — a `data-lang` listener would catch only one.
 */
export const watchSlots = (cards: HTMLElement[], fn: () => void) => {
  let queued = false;
  const ro = new ResizeObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fn();
    });
  });
  for (const card of cards) {
    const slot = card.querySelector<HTMLElement>('.narr-slot');
    for (const el of slot?.parentElement?.children ?? [])
      if (el !== slot) ro.observe(el);
  }
};
