/**
 * READ-ALONG — the words of a narrated paragraph, cut the same way at build
 * time (lib/narration, which times them) and in the browser (the director,
 * which paints them). One tokenizer for both, so a word's character offset
 * is the key that joins the two sides; `Intl.Segmenter` was the obvious
 * choice and is not safe here, because Node's ICU and a phone's can cut
 * Chinese differently.
 *
 * A token is a run of non-space characters, except that every CJK
 * character stands alone — Chinese has no spaces, and a character is the
 * unit a reader's eye moves by.
 */
const CJK = '\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff';
const TOKEN = new RegExp(`[${CJK}]|[^\\s${CJK}]+`, 'g');

/** Each token of `text` with where it starts. */
export const readTokens = (text: string) =>
  [...text.matchAll(TOKEN)].map(m => ({ text: m[0], at: m.index ?? 0 }));

/** A paragraph's text as the page shows it: `[Crol](crol)` → `Crol`. */
export const plainText = (text: string) =>
  text.replace(/\[([^\]]+)\]\([a-z0-9-]+\)/g, '$1');

/** One timed token: its offset in the plain text, and its start (s). */
export type ReadMark = [at: number, t: number];
