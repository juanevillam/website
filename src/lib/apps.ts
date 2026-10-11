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
 * disk: it reserves the slot before the image lands. All three are shot on
 * the same iPhone (393x852pt at 3x) today.
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
    src: `/media/${app}/${name}.png`,
    width: 1179,
    height: 2556,
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
  {
    id: 'topper',
    name: 'Topper',
    pitch: ['topper.problem', 'topper.solution'],
    slides: shots('topper', [
      ['ios-dark-home', 'Home', ['topper.s1.p1', 'topper.s1.p2']],
      ['ios-dark-explore', 'Explore', ['topper.s2.p1', 'topper.s2.p2']],
      ['ios-dark-top-detail', 'Top', ['topper.s3.p1', 'topper.s3.p2']],
      ['ios-dark-profile', 'Profile', ['topper.s4.p1', 'topper.s4.p2']],
    ]),
  },
  {
    // STAND-IN SHOTS (2026-10-11): Topper's screenshots until Juan takes
    // Booker's. Replace with `shots('booker', …)` once they are in
    // public/media/booker/.
    id: 'booker',
    name: 'Booker',
    pitch: ['booker.problem', 'booker.solution'],
    slides: shots('topper', [
      ['ios-dark-home', 'Library', ['booker.s1.p1', 'booker.s1.p2']],
      ['ios-dark-top-detail', 'Book', ['booker.s2.p1', 'booker.s2.p2']],
      ['ios-dark-explore', 'Reader', ['booker.s3.p1', 'booker.s3.p2']],
      ['ios-dark-profile', 'Export', ['booker.s4.p1', 'booker.s4.p2']],
    ]),
  },
];
