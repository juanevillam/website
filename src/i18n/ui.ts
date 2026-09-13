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
 * Section descs are placeholders until Juan dictates the real ones.
 */
const en = {
  'meta.title': 'juanevillam — developer',
  'meta.description': 'Developer. I build native mobile apps and web products.',
  'hero.eyebrow': 'developer',
  'shaper.desc':
    "My personal audio player. Upload the sounds you already have and shape them — slow them down, speed them up, bend the pitch — with my own phase-vocoder patch in the audio engine. Mark a sound's best seconds as clips and jump right back to them.",
  'topper.desc':
    'My flagship app. Ranked lists — tops — of anything you rate: you crown a winner, people fight back with crowns and comments, and you earn PlayStation-style trophies along the way. Built solo: design, code and backend.',
  'salvalo.desc':
    'Reserve surprise packs from your favorite shops: the usual, at closing price. Reserve it in the app and rescue it.',
  'crol.desc':
    'The cloud ERP with artificial intelligence. Ask your company anything over WhatsApp — sales, collections, inventory, banks — or connect it to Claude, ChatGPT or Copilot. Financial statements and taxes in seconds.',
  visit: 'visit',
};

export type UIKey = keyof typeof en;

export const ui: Record<Locale, Record<UIKey, string>> = {
  en,
  es: {
    'meta.title': 'juanevillam — desarrollador',
    'meta.description':
      'Desarrollador. Hago apps móviles nativas y productos web.',
    'hero.eyebrow': 'desarrollador',
    'shaper.desc':
      'Mi reproductor de audio personal. Sube los sonidos que ya tienes y dales forma — bájales la velocidad, acelérala, dobla el tono — con mi propio parche de phase vocoder en el motor de audio. Marca los mejores segundos de un sonido como clips y vuelve a ellos al instante.',
    'topper.desc':
      'Mi app insignia. Listas rankeadas — tops — de lo que califiques: coronas al ganador, la gente contraataca con coronas y comentarios, y vas ganando trofeos estilo PlayStation en el camino. Hecha en solitario: diseño, código y backend.',
    'salvalo.desc':
      'Reserva packs sorpresa de tus comercios favoritos: lo de siempre, a precio de cierre. Resérvalo en la app y rescátalo.',
    'crol.desc':
      'El ERP en la nube con inteligencia artificial. Pregúntale a tu empresa por WhatsApp — ventas, cobranza, inventarios, bancos — o conéctalo a Claude, ChatGPT o Copilot. Estados financieros e impuestos en segundos.',
    visit: 'visitar',
  },
  zh: {
    'meta.title': 'juanevillam — 开发者',
    'meta.description': '开发者。我做原生移动应用和网页产品。',
    'hero.eyebrow': '开发者',
    'shaper.desc':
      '我的个人音频播放器。上传你已有的声音，随意塑形 — 放慢、加速、弯曲音调 — 音频引擎里带着我自己写的 phase vocoder 补丁。把一段声音最精彩的几秒标记为 clip，随时一键跳回。',
    'topper.desc':
      '我的旗舰应用。给任何你想评价的东西排名 — 建立你的 tops：你为第一名加冕，别人用皇冠和评论反击，一路赢取 PlayStation 风格的奖杯。独立完成：设计、代码、后端。',
    'salvalo.desc':
      '在你喜欢的商家预订惊喜包：还是熟悉的美味，以打烊价出售。在应用里预订，把它救回来。',
    'crol.desc':
      '带人工智能的云端 ERP。在 WhatsApp 上直接询问你的公司经营 — 销售、收款、库存、银行 — 或把它连接到 Claude、ChatGPT 或 Copilot。几秒生成财务报表和税务。',
    visit: '访问',
  },
};
