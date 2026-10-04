import type { Locale } from '../i18n/ui';

/**
 * The two published apps and the facts their legal pages share. The URL
 * shape (juanevillam.com/{slug}/{page}) is the one the apps' `legalUrl`
 * helper in @portfolio/mobile-ui already builds — don't change one
 * without the other.
 */
export const LEGAL_APPS = [
  {
    slug: 'sound-shaper',
    name: 'Sound Shaper',
    /** What the person's content is, in that app's own noun. */
    content: 'sounds' as const,
    contentEs: 'sonidos',
    contentZh: '音频',
  },
  {
    slug: 'topper',
    name: 'Topper',
    content: 'tops' as const,
    contentEs: 'tops',
    contentZh: '榜单',
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
