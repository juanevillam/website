export const locales = ['en', 'es', 'zh'] as const;
export type Locale = (typeof locales)[number];

/** Native names, the way Apple lists languages — never translated. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
};

/**
 * en is the canonical tree; es/zh mirror its shape. Copy here is DRAFT —
 * every line ships as an option for Juan to react to, never final.
 * Sections carry no prose at all: the narration vids do the explaining.
 */
const en = {
  'meta.title': 'juanevillam',
  'meta.description': 'I build native mobile apps and web products.',
  visit: 'visit',
};

export type UIKey = keyof typeof en;

export const ui: Record<Locale, Record<UIKey, string>> = {
  en,
  es: {
    'meta.title': 'juanevillam',
    'meta.description': 'Hago apps móviles nativas y productos web.',
    visit: 'visitar',
  },
  zh: {
    'meta.title': 'juanevillam',
    'meta.description': '我做原生移动应用和网页产品。',
    visit: '访问',
  },
};
