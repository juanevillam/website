/**
 * SPACE EXPLORER ON A PHONE — the site's layer over the cabinet build.
 *
 * The game is the Platanus cabinet's, byte for byte: it hears a stick and
 * six buttons as KEYS on its window (CABINET_KEYS in the game). So a phone
 * plays it by sending those same keys into its frame — nothing in game.js
 * knows a phone exists, and a new cabinet release lands here unchanged.
 *
 * The stick is a VIRTUAL JOYSTICK, LOCKED in its corner: the thumb takes
 * it anywhere on or near its base, the base never moves, and dragging
 * from its centre holds W/A/S/D — two at once on a diagonal, the way a
 * keyboard lets you turn while climbing. (A floating base that came to
 * the thumb was tried first and felt loose.) A cross of
 * four buttons was tried first and could not. The buttons are held exactly
 * as long as a finger is on them, so the game's taps, double taps and
 * holds all still work. (Steering by the phone's own motion was built and
 * dropped, 2026-10-02.)
 */

type GameWindow = Window &
  typeof globalThis & {
    __arcadeGame?: { scene: { isActive: (key: string) => boolean } };
    __arcadeAudio?: AudioContext;
  };

/** How far the knob travels from the centre of its base (px). */
const REACH = 52;
/** Past this share of the reach, an axis holds its key. Half the reach:
 *  at 0.38 a thumb resting off-centre already steered (Juan: "too
 *  sensitive"), and a diagonal fired on a mostly straight push. */
const ENGAGE = 0.55;

/** Wired once; `frame` says which game the keys go to (none while closed). */
export const createArcadeTouch = (frame: () => HTMLIFrameElement | null) => {
  const win = () => (frame()?.contentWindow ?? null) as GameWindow | null;

  // ---------- keys ----------
  // Several sources can hold one key: it goes down with the first and up
  // with the last.
  const holders = new Map<string, Set<string>>();
  const send = (type: 'keydown' | 'keyup', key: string) => {
    const w = win();
    if (!w) return;
    w.dispatchEvent(new w.KeyboardEvent(type, { key, bubbles: true }));
  };
  const hold = (key: string, by: string, on: boolean) => {
    let set = holders.get(key);
    if (!set) holders.set(key, (set = new Set()));
    const was = set.size > 0;
    if (on) set.add(by);
    else set.delete(by);
    if (!was && set.size) send('keydown', key);
    if (was && !set.size) send('keyup', key);
  };

  // iOS starts a frame's sound only inside a real tap, which lands out
  // here: every lift of a finger nudges the game's audio awake.
  const wakeAudio = () => {
    const audio = win()?.__arcadeAudio;
    if (audio?.state === 'suspended') audio.resume();
  };

  const capture = (el: HTMLElement, id: number) => {
    // A pointer the browser cannot capture must not cost the key.
    try {
      el.setPointerCapture(id);
    } catch {
      /* held without capture */
    }
  };

  /** Wire one on-screen button: held while a finger is on it. */
  const button = (el: HTMLElement, key: string, onPress?: () => void) => {
    const id = `btn:${key}`;
    const up = () => {
      el.classList.remove('is-held');
      hold(key, id, false);
    };
    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      capture(el, e.pointerId);
      el.classList.add('is-held');
      hold(key, id, true);
      onPress?.();
      navigator.vibrate?.(8);
    });
    el.addEventListener('pointerup', () => {
      up();
      wakeAudio();
    });
    el.addEventListener('pointercancel', up);
    el.addEventListener('lostpointercapture', up);
  };

  /** Wire the joystick: a zone that takes the thumb, a base, a knob. */
  const joystick = (
    zone: HTMLElement,
    base: HTMLElement,
    knob: HTMLElement,
  ) => {
    let finger: number | null = null;
    let cx = 0;
    let cy = 0;
    const axes = { a: false, d: false, w: false, s: false };

    const set = (key: keyof typeof axes, on: boolean) => {
      if (axes[key] === on) return;
      axes[key] = on;
      hold(key, 'stick', on);
    };

    const move = (x: number, y: number) => {
      let dx = x - cx;
      let dy = y - cy;
      const d = Math.hypot(dx, dy);
      if (d > REACH) {
        dx = (dx / d) * REACH;
        dy = (dy / d) * REACH;
      }
      knob.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      const nx = dx / REACH;
      const ny = dy / REACH;
      set('a', nx < -ENGAGE);
      set('d', nx > ENGAGE);
      set('w', ny < -ENGAGE); // up the screen = nose up
      set('s', ny > ENGAGE);
    };

    const release = () => {
      finger = null;
      zone.classList.remove('is-active');
      knob.style.transform = '';
      (Object.keys(axes) as (keyof typeof axes)[]).forEach(k => set(k, false));
      wakeAudio();
    };

    zone.addEventListener('pointerdown', e => {
      if (finger !== null) return;
      e.preventDefault();
      finger = e.pointerId;
      capture(zone, e.pointerId);
      // The centre is the base's own, wherever the thumb landed.
      const b = base.getBoundingClientRect();
      cx = b.left + b.width / 2;
      cy = b.top + b.height / 2;
      zone.classList.add('is-active');
      move(e.clientX, e.clientY);
    });
    zone.addEventListener('pointermove', e => {
      if (e.pointerId === finger) move(e.clientX, e.clientY);
    });
    zone.addEventListener('pointerup', e => {
      if (e.pointerId === finger) release();
    });
    zone.addEventListener('pointercancel', e => {
      if (e.pointerId === finger) release();
    });
  };

  /** Is the game in flight (scene G) — not the title, over or initials? */
  const inFlight = () => !!win()?.__arcadeGame?.scene.isActive('G');

  const stop = () => {
    for (const [key, set] of holders) if (set.size) send('keyup', key);
    holders.clear();
  };

  return { button, joystick, inFlight, stop };
};
