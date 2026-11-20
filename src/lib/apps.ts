import type { ReleasedApp } from './releases';
import type { UIKey } from '../i18n/ui';
import { versionedMedia } from './mediaVersion';
import { appShown } from './release';

/**
 * THE APPS THE LANDING TELLS — one manifest for every app section on the
 * landing (AppsShowcase), in vertical scroll order:
 *
 *   1. Sound Shaper     — iOS + Web (`830 × 1800` phone frame)
 *   2. Book Highlighter — Web PWA (`830 × 1800` phone frame)
 *
 * Each app is a WELCOME (its pitch: the problem, then the answer) and four
 * cards, in the order the story is told. Slide titles are English in every
 * locale — brand nouns. Every paragraph is also the transcript of its
 * narration clip (lib/narration); its phone version is found by convention
 * (`….sN.m`, `….problem.m`).
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
  slug: string;
  name: string;
  pitch: UIKey[];
  slides: AppSlide[];
  github?: string;
};

const shots = (
  app: string,
  width: number,
  height: number,
  entries: [name: string, title: string, paras: UIKey[]][],
): AppSlide[] =>
  entries.map(([name, title, paras]) => ({
    src: versionedMedia(`/media/${app}/${name}.webp`),
    width,
    height,
    title,
    paras,
  }));

export const APPS: AppStory[] = (
  [
    {
      id: 'shaper',
      slug: 'sound-shaper',
      name: 'Sound Shaper',
      pitch: ['shaper.problem', 'shaper.solution'],
      github: 'https://github.com/juanevillam/sound-shaper',
      slides: shots('shaper', 830, 1800, [
        ['ios-dark-home', 'Library', ['shaper.s1.p1', 'shaper.s1.p2']],
        ['ios-dark-player', 'Player', ['shaper.s2.p1', 'shaper.s2.p2']],
        ['ios-dark-shape', 'Shape', ['shaper.s3.p1', 'shaper.s3.p2']],
        ['ios-dark-clip', 'Clips', ['shaper.s4.p1', 'shaper.s4.p2']],
      ]),
    },
    {
      id: 'highlighter',
      slug: 'book-highlighter',
      name: 'Book Highlighter',
      pitch: ['highlighter.problem', 'highlighter.solution'],
      github: 'https://github.com/juanevillam/book-highlighter',
      slides: shots('highlighter', 830, 1800, [
        [
          'desktop-dark-shelf',
          'Shelf',
          ['highlighter.s1.p1', 'highlighter.s1.p2'],
        ],
        [
          'desktop-dark-chapters',
          'Chapters',
          ['highlighter.s2.p1', 'highlighter.s2.p2'],
        ],
        [
          'desktop-dark-scanner',
          'Scanner',
          ['highlighter.s3.p1', 'highlighter.s3.p2'],
        ],
        [
          'desktop-dark-reader',
          'Reader',
          ['highlighter.s4.p1', 'highlighter.s4.p2'],
        ],
      ]),
    },
  ] satisfies AppStory[]
).filter(a => appShown(a.id));
