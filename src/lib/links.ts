import { APPS } from './apps';
import type { DeckItem, Rich } from './deck-items';
import { EVENTS } from './events';
import { LEGAL_APPS } from './legal';
import { PROJECTS } from './work';
import { ui, type UIKey } from '../i18n/ui';

/**
 * SHAREABLE ADDRESSES — one per thing the landing tells, so a post
 * elsewhere (LinkedIn, Instagram) can stop halfway and send people here
 * for the rest (Juan, 2026-10-17). Each address is the WHOLE landing with
 * that one thing open over it, detached, as a modal (`data-focused`,
 * global.css); closing it leaves the landing at its top, at `/`.
 *
 *   /sound-shaper                  an app — the same name its legal pages use
 *   /work/salvalo                  a More Work card
 *   /events/el-panal-2026-10       an event: its name, then its month
 *
 * The event's month is part of its name on purpose: two nights at the
 * same place never share an address, and the address says when it was.
 * A link may carry `?lang=es` (or en, zh) to open in the post's language.
 *
 * Every address is a static page (pages/[app], pages/work, pages/events),
 * with its own title, description and picture for the preview a social
 * network draws from it — in English, the site's own default, since a
 * crawler runs no script.
 */
export type Focus =
  | { section: 'apps'; app: string }
  | { section: 'work' | 'events'; card: string };

export type FocusPage = {
  path: string;
  focus: Focus;
  title: string;
  description: string;
  /** Site-relative; made absolute in the page head. */
  image: string;
};

export const eventPath = (item: DeckItem) =>
  `/events/${item.slug}${item.date ? `-${item.date}` : ''}`;
export const workPath = (item: DeckItem) => `/work/${item.slug}`;

const en = ui.en;

/** A card's copy as one plain sentence: links lose their marks. */
const plain = (body: Rich): string => {
  if (typeof body === 'string') return en[body];
  if ('k' in body) return en[body.k];
  return en[body.before] + en[body.link] + en[body.after];
};

const unmark = (text: string) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

/** The short version a phone shows (`….m`) when there is one: a preview
 *  card has room for a couple of lines, not a paragraph. */
const summary = (item: DeckItem) => {
  const key =
    typeof item.body === 'string'
      ? item.body
      : 'k' in item.body
        ? item.body.k
        : null;
  const short = key && (key.replace(/\.body$/, '.m') as UIKey);
  const text = unmark(short && short in en ? en[short] : plain(item.body));
  return text.length > 200 ? `${text.slice(0, 197).trimEnd()}…` : text;
};

/** The picture a preview shows: a capture or an event's first photo (a
 *  video by its poster), or a screen of its own by its scene picture. */
const pictureOf = (item: DeckItem) =>
  typeof item.image === 'string'
    ? item.image.replace(/\.mp4$/, '.jpg')
    : Array.isArray(item.image)
      ? item.image[0].replace(/\.mp4$/, '.jpg')
      : (item.scene ?? '');

const deckPage = (item: DeckItem, section: 'work' | 'events'): FocusPage => ({
  path: section === 'work' ? workPath(item) : eventPath(item),
  focus: { section, card: item.id },
  title: `${item.name} — juanevillam`,
  description: summary(item),
  image: pictureOf(item),
});

export const FOCUS_PAGES: FocusPage[] = [
  ...APPS.map(app => {
    const slug = LEGAL_APPS.find(l => l.name === app.name)?.slug ?? app.id;
    return {
      path: `/${slug}`,
      focus: { section: 'apps', app: app.id },
      title: `${app.name} — juanevillam`,
      description: unmark(en[app.pitch[0]]),
      image: app.slides[0].src,
    } satisfies FocusPage;
  }),
  ...PROJECTS.map(p => deckPage(p, 'work')),
  ...EVENTS.map(e => deckPage(e, 'events')),
];

/** The pages under one prefix, as `getStaticPaths` wants them, the
 *  last part of the path under `param`. */
export const focusPaths = (prefix: '' | '/work' | '/events', param: string) =>
  FOCUS_PAGES.filter(
    p => p.path.slice(0, p.path.lastIndexOf('/')) === prefix,
  ).map(page => ({
    params: { [param]: page.path.slice(page.path.lastIndexOf('/') + 1) },
    props: { page },
  }));
