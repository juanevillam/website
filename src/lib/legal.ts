import type { Locale } from '../i18n/ui';

/**
 * The apps whose legal pages are published, and the facts those pages
 * share. Only Sound Shaper ships for now (2026-10-16); Topper's and
 * Booker's entries wait in the portfolio's web-archive/legal.ts, and the page
 * templates keep their branches, so putting an entry back republishes it. The URL
 * shape (juanevillam.com/{slug}/{page}) is the one Sound Shaper's `legalUrl`
 * helper (src/ui/author.ts) already builds — don't change one
 * without the other.
 */
/** What the person's content is — it picks each page's app-specific branch. */
type LegalContent = 'sounds' | 'tops' | 'books';

export const LEGAL_APPS: {
  slug: string;
  name: string;
  content: LegalContent;
  contentEs: string;
  contentZh: string;
  /**
   * Who publishes the app on the App Store, when that is not me. The
   * store's "Seller" line names them, so every page says what they are —
   * a distributor, not the operator — before anyone has to ask.
   */
  publisher?: string;
}[] = [
  {
    slug: 'sound-shaper',
    name: 'Sound Shaper',
    /** What the person's content is, in that app's own noun. */
    content: 'sounds',
    contentEs: 'sonidos',
    contentZh: '音频',
    publisher: 'Grostify LLC',
  },
];

export type LegalApp = (typeof LEGAL_APPS)[number];

export const legalPaths = () =>
  LEGAL_APPS.map(app => ({ params: { app: app.slug }, props: { app } }));

export const CONTACT_EMAIL = 'juanesvillamendoza@gmail.com';
export const AUTHOR_FULL_NAME = 'Juan Esteban Villa Mendoza';
/** Apple's standard licence, which App Store apps ship under unless they set their own. */
export const APPLE_EULA_URL =
  'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
/** ISO date; each language formats it its own way (see `legalDate`). */
export const LEGAL_UPDATED = '2026-10-17';

export const legalDate = (locale: Locale) =>
  new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : locale, {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(LEGAL_UPDATED));
