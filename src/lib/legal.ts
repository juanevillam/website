import type { Locale } from '../i18n/ui';

/**
 * The apps whose legal pages are published, and the facts those pages
 * share. Only Sound Shaper ships for now (2026-10-16); Topper's and
 * Booker's entries wait in apps/web/archive/legal.ts, and the page
 * templates keep their branches, so putting an entry back republishes it. The URL
 * shape (juanevillam.com/{slug}/{page}) is the one the apps' `legalUrl`
 * helper in @portfolio/mobile-ui already builds — don't change one
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
}[] = [
  {
    slug: 'sound-shaper',
    name: 'Sound Shaper',
    /** What the person's content is, in that app's own noun. */
    content: 'sounds',
    contentEs: 'sonidos',
    contentZh: '音频',
  },
];

export type LegalApp = (typeof LEGAL_APPS)[number];

export const legalPaths = () =>
  LEGAL_APPS.map(app => ({ params: { app: app.slug }, props: { app } }));

export const CONTACT_EMAIL = 'juanesvillamendoza@gmail.com';
export const AUTHOR_FULL_NAME = 'Juan Esteban Villa Mendoza';
/** ISO date; each language formats it its own way (see `legalDate`). */
export const LEGAL_UPDATED = '2026-10-03';

export const legalDate = (locale: Locale) =>
  new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : locale, {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(LEGAL_UPDATED));
