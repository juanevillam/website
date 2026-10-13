/**
 * THE LADDER, for scripts — the duration tokens global.css defines
 * (`--dur-micro` … `--dur-settle`), read back in milliseconds, so a
 * Web Animation or a timer runs on the same clock as the CSS beside it
 * instead of a number copied out of it. The tokens are registered as
 * `<time>`, so the browser hands them over resolved ("0.45s").
 */
export type Dur = 'micro' | 'quick' | 'turn' | 'settle';

export const dur = (name: Dur): number => {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(`--dur-${name}`)
    .trim();
  const n = parseFloat(v);
  return v.endsWith('ms') ? n : n * 1000;
};

/** The one curve (`--ease`), for a Web Animation. */
export const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
