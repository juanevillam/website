import type { ReleasedApp } from './releases';
import type { UIKey } from '../i18n/ui';

/**
 * THE APPS THE LANDING TELLS — one manifest for every layout of the apps
 * section (AppsShowcase), so the story of an app is written once.
 *
 * Each app is a WELCOME (its pitch: the problem, then the answer) and four
 * cards, in the order the story is told. Slide titles are English in every
 * locale — brand nouns. Every paragraph is also the transcript of its
 * narration clip (lib/narration); its phone version is found by convention
 * (`….sN.m`, `….problem.m`).
 *
 * Each manifest states its own pixel size, and it must match the files on
 * disk: it reserves the slot before the image lands. Every app is shot on
 * the same iPhone (393x852pt at 3x).
 *
 * ONLY SOUND SHAPER IS TOLD (2026-10-16): it is the one app shipping.
 * Topper's and Booker's stories wait in apps/web/archive/ with their
 * screenshots and copy; with one app the panel draws no switcher.
 */
export type AppSlide = {
  src: string;
  width: number;
  height: number;
  title: string;
  paras: UIKey[];
};

export type AppStory = {
  id: ReleasedApp;
  name: string;
  pitch: UIKey[];
  slides: AppSlide[];
};

const shots = (
  app: string,
  entries: [name: string, title: string, paras: UIKey[]][],
): AppSlide[] =>
  entries.map(([name, title, paras]) => ({
    // WebP at the size the page ever draws (2026-10-17): the 1179 x 2556
    // PNGs weighed 1.4 MB each and were most of the page's first load.
    src: `/media/${app}/${name}.webp`,
    width: 830,
    height: 1800,
    title,
    paras,
  }));

export const APPS: AppStory[] = [
  {
    id: 'shaper',
    name: 'Sound Shaper',
    pitch: ['shaper.problem', 'shaper.solution'],
    slides: shots('shaper', [
      ['ios-dark-home', 'Library', ['shaper.s1.p1', 'shaper.s1.p2']],
      ['ios-dark-player', 'Player', ['shaper.s2.p1', 'shaper.s2.p2']],
      ['ios-dark-shape', 'Shape', ['shaper.s3.p1', 'shaper.s3.p2']],
      ['ios-dark-clip', 'Clips', ['shaper.s4.p1', 'shaper.s4.p2']],
    ]),
  },
];
