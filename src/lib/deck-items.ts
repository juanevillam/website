import type { UIKey } from '../i18n/ui';

/**
 * WHAT A PANEL DECK CARD IS (PanelDeck) — More Work's projects and the
 * Events, kept here rather than in the components so the pages that link
 * to ONE card (pages/work, pages/events) read the same list the page
 * draws.
 */
/** A piece of a card's line of facts: written as is, or a key. */
export type Segment = string | { k: UIKey };
/** A paragraph — one built around a link (the name in the sentence takes
 *  you to it), or one whose copy marks several (`[Cashea](cashea)`, TL). */
export type Linked = { before: UIKey; link: UIKey; after: UIKey; href: string };
export type Marked = { k: UIKey; links: Record<string, string> };
export type Rich = UIKey | Linked | Marked;

export type DeckItem = {
  id: string;
  /** The end of the card's own address (lib/links): its name, lowercase
   *  and hyphenated — an event's month follows it there. */
  slug: string;
  /** An event's month, `YYYY-MM`: the last part of its address, so two
   *  nights at the same place never share one. */
  date?: string;
  /** A proper name as is; a word that is translated, as a key. */
  name: string | { k: UIKey };
  /** The line of facts under the name: groups joined by " · ", the parts
   *  of a group by " – " (a role; a span of years; a place; a date). */
  meta: Segment[][];
  body: Rich;
  /** The body's narration clip, by convention (lib/narration). */
  clip: string;
  /** One 3:2 capture, 1440 x 960 (a string: a screenshot, or a silent
   *  `.mp4` with its first frame beside it as `.jpg`); upright media (one, two
   *  or more — two frames, each cycling through its share); or a screen
   *  of its own, passed in as the named slot `{ slot }`. */
  image: string | Media[] | { slot: string };
  /** Sideways or mixed pictures (a gallery's): ONE frame however many
   *  there are, and the screen keeps its 3:2 on a phone too. */
  wide?: boolean;
  /** Where two frames split, when a card chooses its own: the first
   *  `split` of `image` run the left frame, in order, and the rest the
   *  right — a video may stand in either. Without it, the photos fill the
   *  left and the videos lead the right (PanelDeck `columns`). */
  split?: number;
  /** Each picture's caption, in the order of `image`: on the frame and
   *  in the viewer (a ranking's place and name). */
  captions?: string[];
  /** Show the pictures in a new random order on every visit: a set that
   *  is loved whole, not ranked (Juan, 2026-10-27). */
  shuffle?: boolean;
  links: { label: Segment; href: string }[];
  /** Where the picture itself goes when clicked: the site it shows. A
   *  mouse shortcut only — the same place is a link in the words. */
  visit?: string;
  /** The picture whose colours light the page (lib/scene), for a screen
   *  of its own — a capture or photos light it by themselves. */
  scene?: string;
};

/** An event's photo, or its silent video (`.mp4`, with its poster frame
 *  beside it as `.jpg`). */
export type Media = string;
