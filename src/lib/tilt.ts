/**
 * THE POINTER TILT — the page's pictures lean toward the mouse: a slight 3D
 * turn that follows the pointer across a whole panel and settles back when
 * it leaves (Juan, 2026-10-11) — a detail, so a few degrees at most: at
 * 7° / 5° it read as too strong. One recipe for every deck on the page — the
 * apps' phones, More Work's screens, the events' photos.
 *
 * It is drawn with the `rotate` PROPERTY, never `transform`: a deck card's
 * picture already moves by `transform` (its turn, `.deck-card` in
 * global.css), and the two compose instead of fighting. The parent carries
 * the `perspective`. The motion is eased here, frame by frame, rather than
 * by a CSS transition, which would replace the deck's own transition list.
 *
 * Pointer devices only — a touch screen has no hover to follow — and never
 * with reduced motion.
 */
export const followPointer = (
  root: HTMLElement,
  /** The picture to lean, asked fresh each frame (the deck turns). */
  target: () => HTMLElement | null | undefined,
  { x = 3.5, y = 2.5 }: { x?: number; y?: number } = {},
) => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const clamp = (v: number) => Math.max(-1, Math.min(1, v));
  // Where the lean is going, and where it is.
  let goal = { tx: 0, ty: 0 };
  let now = { tx: 0, ty: 0 };
  let el: HTMLElement | null = null;
  let frame = 0;

  const draw = (node: HTMLElement, tx: number, ty: number) => {
    const rx = -ty * y;
    const ry = tx * x;
    const angle = Math.hypot(rx, ry);
    node.style.setProperty(
      '--tilt-rot',
      angle < 0.01
        ? 'none'
        : `${rx.toFixed(3)} ${ry.toFixed(3)} 0 ${angle.toFixed(3)}deg`,
    );
  };

  const step = () => {
    now = {
      tx: now.tx + (goal.tx - now.tx) * 0.14,
      ty: now.ty + (goal.ty - now.ty) * 0.14,
    };
    if (el) draw(el, now.tx, now.ty);
    const moving =
      Math.abs(goal.tx - now.tx) > 0.002 || Math.abs(goal.ty - now.ty) > 0.002;
    frame = moving ? requestAnimationFrame(step) : 0;
  };
  const run = () => {
    if (!frame) frame = requestAnimationFrame(step);
  };

  root.addEventListener('pointermove', e => {
    const next = target() ?? null;
    // The deck turned under the pointer: the old picture straightens at
    // once, the new one starts from level.
    if (next !== el) {
      if (el) draw(el, 0, 0);
      el = next;
      now = { tx: 0, ty: 0 };
    }
    if (!el) return;
    const r = el.getBoundingClientRect();
    goal = {
      tx: clamp((e.clientX - (r.left + r.width / 2)) / (innerWidth / 2)),
      ty: clamp((e.clientY - (r.top + r.height / 2)) / (innerHeight / 2)),
    };
    run();
  });

  root.addEventListener('pointerleave', () => {
    goal = { tx: 0, ty: 0 };
    run();
  });
};
