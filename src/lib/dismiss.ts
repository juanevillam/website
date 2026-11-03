/**
 * WHEN A CLICK ON THE DARK AROUND A MODAL MAY CLOSE IT (Juan, 2026-11-03:
 * a finger going for the viewer's small arrows landed on the dark beside
 * them and shut it). Every modal here closes by its ✕ and by Esc; the dark
 * closes it only for a mouse, and only well clear of every control in it —
 * so a near miss is just a miss. A finger never closes one from the dark:
 * on a phone the dark is mostly where the controls are.
 */
const mouse = matchMedia('(hover: hover) and (pointer: fine)');

/** How far around a control a click still counts as going for it (px). */
const SLOP = 32;

export const meantToClose = (e: MouseEvent, modal: Element) => {
  if (!mouse.matches) return false;
  for (const c of modal.querySelectorAll('button, a[href], [role="button"]')) {
    const r = c.getBoundingClientRect();
    if (!r.width) continue;
    if (
      e.clientX > r.left - SLOP &&
      e.clientX < r.right + SLOP &&
      e.clientY > r.top - SLOP &&
      e.clientY < r.bottom + SLOP
    )
      return false;
  }
  return true;
};
