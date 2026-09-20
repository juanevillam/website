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
 * One merged description per section; the deep story belongs to the vids.
 */
const en = {
  'meta.title': 'juanevillam',
  'meta.description': 'I build native mobile apps and web products.',
  'shaper.desc':
    'A personal audio player: upload the sounds you already have, shape their speed and pitch — my own phase-vocoder patch keeps Preserve Pitch clean on real music — and mark the best seconds as clips.',
  'topper.desc':
    'A social app of ranked lists — tops — of anything you rate: crown a winner, fight back with crowns and comments, earn trophies along the way. Built completely solo, rendering the real native UI on both platforms.',
  'salvalo.desc':
    'Surprise packs from your favorite shops — the usual, at closing price. Reserve it in the app and rescue it. I build the product end to end.',
  'crol.desc':
    'The cloud ERP with artificial intelligence — ask your company anything over WhatsApp, or connect it to Claude, ChatGPT or Copilot. The day job: lead frontend, with ContoPay among its products.',
  visit: 'visit',
};

export type UIKey = keyof typeof en;

export const ui: Record<Locale, Record<UIKey, string>> = {
  en,
  es: {
    'meta.title': 'juanevillam',
    'meta.description': 'Hago apps móviles nativas y productos web.',
    'shaper.desc':
      'Un reproductor de audio personal: sube los sonidos que ya tienes, dales forma en velocidad y tono — mi propio parche de phase vocoder mantiene limpio Preservar tono con música de verdad — y marca los mejores segundos como clips.',
    'topper.desc':
      'Una app social de listas rankeadas — tops — de lo que califiques: coronas al ganador, contraatacas con coronas y comentarios, ganas trofeos en el camino. Hecha completamente en solitario, renderizando la UI nativa real en ambas plataformas.',
    'salvalo.desc':
      'Packs sorpresa de tus comercios favoritos — lo de siempre, a precio de cierre. Resérvalo en la app y rescátalo. El producto lo hago de punta a punta.',
    'crol.desc':
      'El ERP en la nube con inteligencia artificial — pregúntale a tu empresa por WhatsApp, o conéctalo a Claude, ChatGPT o Copilot. El trabajo de verdad: lead frontend, con ContoPay entre sus productos.',
    visit: 'visitar',
  },
  zh: {
    'meta.title': 'juanevillam',
    'meta.description': '我做原生移动应用和网页产品。',
    'shaper.desc':
      '一个个人音频播放器：上传你已有的声音，随意调整速度和音调 — 我自己写的 phase vocoder 补丁让"保持音调"在真正的音乐上也干净利落 — 再把最精彩的几秒标记为 clip。',
    'topper.desc':
      '一个排名列表社交应用 — 给任何你想评价的东西建立 tops：为第一名加冕，用皇冠和评论反击，一路赢取奖杯。完全独立完成，在两个平台上渲染真正的原生 UI。',
    'salvalo.desc':
      '你喜欢的商家的惊喜包 — 还是熟悉的美味，以打烊价出售。在应用里预订，把它救回来。产品由我从头到尾负责。',
    'crol.desc':
      '带人工智能的云端 ERP — 在 WhatsApp 上直接询问你的公司经营，或把它连接到 Claude、ChatGPT 或 Copilot。正职工作：前端负责人，旗下产品包括 ContoPay。',
    visit: '访问',
  },
};
