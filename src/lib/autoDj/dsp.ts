// The app's shapeDsp names the planner needs (sound-shaper
// src/lib/shapeDsp.ts), taken from this site's port of the same numbers.
import { EQ_MAX_DB, EQ_MIN_DB, PRESETS, type Level } from '../shaper';

export { EQ_MAX_DB, EQ_MIN_DB };
export type EffectLevel = Level;
export const EQ_PRESETS: { i18nKey: string; gains: number[] }[] = PRESETS.map(p => ({
  i18nKey: p.id,
  gains: [...p.gains],
}));
