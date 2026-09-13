export const locales = ['en', 'es', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
  zh: '中文',
};

/** Native names, the way Apple lists languages — never translated. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
};

/**
 * en is the canonical tree; es/zh mirror its shape. Copy here is DRAFT —
 * every line ships as an option for Juan to react to, never final.
 */
const en = {
  'meta.title': 'juanevillam — developer',
  'meta.title.salvalo': 'juanevillam — Sálvalo',
  'meta.title.work': 'juanevillam — work',
  'meta.description': 'Developer. I build native mobile apps and web products.',
  'nav.home': 'Portfolio',
  'nav.salvalo': 'Salvalo',
  'nav.work': 'Work',
  'hero.eyebrow': 'developer',
  'settings.label': 'Settings',
  'settings.appearance': 'Appearance',
  'settings.language': 'Language',
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.system': 'Automatic',
  'projects.label': 'projects',
  'projects.heading': 'Three apps, one monorepo.',
  'projects.topper.status': 'social',
  'projects.topper.desc':
    'My flagship app. Ranked lists — tops — of anything: movies, food, games, whatever you rate. You crown a winner, people fight back with crowns and comments, you follow them and earn PlayStation-style trophies along the way. Built solo: design, code and backend.',
  'projects.topper.d1':
    "One React Native codebase that renders each platform's real UI — Jetpack Compose on Android, SwiftUI on iOS. Not lookalike components; the actual native ones.",
  'projects.topper.d2':
    'Everything feels instant: counters update optimistically, images upload in the background while you keep moving, and skeletons match the final layout so nothing jumps.',
  'projects.topper.d3':
    'A trophy engine drives PlayStation-style achievements from plain config — idempotent, so progress never double-counts. One trophy is secret.',
  'projects.topper.d4':
    'English, Spanish and Chinese. Pick one in Settings and the whole app re-renders on the spot.',
  'projects.topper.k0': 'the app',
  'projects.topper.k1': 'native ui',
  'projects.topper.k2': 'speed',
  'projects.topper.k3': 'trophies',
  'projects.topper.k4': 'languages',
  'projects.shaper.status': 'audio',
  'projects.shaper.desc':
    "My personal audio player. Upload the sounds you already have — music, ringtones, voice memos — and shape them: slow them down, speed them up, bend the pitch. The audio engine carries my own phase-vocoder patch, so Preserve Pitch holds up on real music. Mark a sound's best seconds as clips and jump right back to them.",
  'projects.starter.status': 'showcase',
  'projects.starter.desc':
    'Every @expo/ui component running native on both platforms — Jetpack Compose on Android, SwiftUI on iOS. 47 showcase screens covering the whole catalog: pickers, sheets, menus, navigation, the lot. This is where I prove UI before it ships in Topper.',
  'projects.store.play': 'Google Play',
  'projects.store.ios': 'App Store',
  'projects.media.soon': 'media soon',
  'experience.label': 'experience',
  'experience.heading': 'The day job.',
  'experience.lede':
    "I've been shipping real products since I turned 18 — for two companies, in production, used every day.",
  'experience.contopay.role': 'payments',
  'experience.contopay.heading':
    'Sell, charge and invoice instantly from your phone.',
  'experience.contopay.body':
    'Take card payments, track your income and invoice, all from your phone. ContoPay brings your whole operation into one platform built to run your business with clarity.',
  'experience.crol.role': 'erp',
  'experience.crol.heading': 'AI is already part of your ERP.',
  'experience.crol.body':
    'The cloud ERP with artificial intelligence: ask your company anything over WhatsApp — sales, collections, inventory, banks — or connect Crol ERP to Claude, ChatGPT or Copilot and generate financial statements and taxes in seconds.',
  'experience.visit': 'visit',
  'salvalo.label': 'startup',
  'salvalo.heading': 'Reserve surprise packs from your favorite shops.',
  'salvalo.body':
    'The usual, at closing price. Reserve it in the app and rescue it.',
};

export type UIKey = keyof typeof en;

export const ui: Record<Locale, Record<UIKey, string>> = {
  en,
  es: {
    'meta.title': 'juanevillam — desarrollador',
    'meta.title.salvalo': 'juanevillam — Sálvalo',
    'meta.title.work': 'juanevillam — trabajo',
    'meta.description':
      'Desarrollador. Hago apps móviles nativas y productos web.',
    'nav.home': 'Portafolio',
    'nav.salvalo': 'Salvalo',
    'nav.work': 'Trabajo',
    'hero.eyebrow': 'desarrollador',
    'settings.label': 'Ajustes',
    'settings.appearance': 'Apariencia',
    'settings.language': 'Idioma',
    'theme.light': 'Claro',
    'theme.dark': 'Oscuro',
    'theme.system': 'Automático',
    'projects.label': 'proyectos',
    'projects.heading': 'Tres apps, un monorepo.',
    'projects.topper.status': 'social',
    'projects.topper.desc':
      'Mi app insignia. Listas rankeadas — tops — de lo que sea: películas, comida, juegos, lo que califiques. Coronas al ganador, la gente contraataca con coronas y comentarios, los sigues y vas ganando trofeos estilo PlayStation en el camino. Hecha en solitario: diseño, código y backend.',
    'projects.topper.d1':
      'Un solo código React Native que renderiza la UI real de cada plataforma: Jetpack Compose en Android, SwiftUI en iOS. No son imitaciones; son los componentes nativos de verdad.',
    'projects.topper.d2':
      'Todo se siente instantáneo: contadores optimistas, imágenes que suben en segundo plano mientras sigues usando la app, y skeletons que calcan el layout final para que nada salte.',
    'projects.topper.d3':
      'Un motor de trofeos genera logros estilo PlayStation desde pura configuración — idempotente, el progreso nunca se cuenta doble. Hay un trofeo secreto.',
    'projects.topper.d4':
      'Inglés, español y chino. Eliges uno en Ajustes y toda la app se re-renderiza al instante.',
    'projects.topper.k0': 'la app',
    'projects.topper.k1': 'ui nativa',
    'projects.topper.k2': 'velocidad',
    'projects.topper.k3': 'trofeos',
    'projects.topper.k4': 'idiomas',
    'projects.shaper.status': 'audio',
    'projects.shaper.desc':
      'Mi reproductor de audio personal. Sube los sonidos que ya tienes — música, tonos, notas de voz — y dales forma: bájales la velocidad, acelérala, dobla el tono. El motor de audio lleva mi propio parche de phase vocoder, así que Preservar tono aguanta con música de verdad. Marca los mejores segundos de un sonido como clips y vuelve a ellos al instante.',
    'projects.starter.status': 'vitrina',
    'projects.starter.desc':
      'Cada componente de @expo/ui corriendo nativo en ambas plataformas: Jetpack Compose en Android, SwiftUI en iOS. 47 pantallas que cubren todo el catálogo: pickers, sheets, menús, navegación, todo. Aquí pruebo la UI antes de que llegue a Topper.',
    'projects.store.play': 'Google Play',
    'projects.store.ios': 'App Store',
    'projects.media.soon': 'media pronto',
    'experience.label': 'experiencia',
    'experience.heading': 'El trabajo de verdad.',
    'experience.lede':
      'Llevo lanzando productos reales desde que cumplí 18 — para dos empresas, en producción, usados todos los días.',
    'experience.contopay.role': 'pagos',
    'experience.contopay.heading':
      'Vende, cobra y factura al instante desde tu celular.',
    'experience.contopay.body':
      'Cobra con tarjeta, controla tus ingresos y factura, todo desde el celular. ContoPay integra tu operación completa en una sola plataforma diseñada para que administres tu negocio con claridad.',
    'experience.crol.role': 'erp',
    'experience.crol.heading': 'La IA ya forma parte de tu ERP.',
    'experience.crol.body':
      'El ERP en la nube con inteligencia artificial: pregúntale a tu empresa por WhatsApp — ventas, cobranza, inventarios, bancos — o conecta Crol ERP a Claude, ChatGPT o Copilot y genera estados financieros e impuestos en segundos.',
    'experience.visit': 'visitar',
    'salvalo.label': 'startup',
    'salvalo.heading': 'Reserva packs sorpresa de tus comercios favoritos.',
    'salvalo.body':
      'Lo de siempre, a precio de cierre. Resérvalo en la app y rescátalo.',
  },
  zh: {
    'meta.title': 'juanevillam — 开发者',
    'meta.title.salvalo': 'juanevillam — Sálvalo',
    'meta.title.work': 'juanevillam — 工作',
    'meta.description': '开发者。我做原生移动应用和网页产品。',
    'nav.home': '作品集',
    'nav.salvalo': 'Salvalo',
    'nav.work': '工作',
    'hero.eyebrow': '开发者',
    'settings.label': '设置',
    'settings.appearance': '外观',
    'settings.language': '语言',
    'theme.light': '浅色',
    'theme.dark': '深色',
    'theme.system': '自动',
    'projects.label': '项目',
    'projects.heading': '三个应用，一个 monorepo。',
    'projects.topper.status': '社交',
    'projects.topper.desc':
      '我的旗舰应用。给任何东西排名 — 电影、美食、游戏，凡是你想评价的 — 建立你的 tops。你为第一名加冕，别人用皇冠和评论来反击，你关注他们，一路赢取 PlayStation 风格的奖杯。独立完成：设计、代码、后端。',
    'projects.topper.d1':
      '一套 React Native 代码，渲染每个平台真正的 UI：Android 上是 Jetpack Compose，iOS 上是 SwiftUI。不是仿制组件，是真正的原生组件。',
    'projects.topper.d2':
      '一切都即时响应：计数乐观更新，图片在后台上传、操作不被打断，骨架屏与最终布局完全一致，界面不会跳动。',
    'projects.topper.d3':
      '奖杯引擎用纯配置驱动 PlayStation 风格的成就 — 幂等设计，进度绝不重复计算。其中一个奖杯是隐藏的。',
    'projects.topper.d4':
      '英语、西班牙语、中文。在设置里选一个，整个应用即刻重新渲染。',
    'projects.topper.k0': '应用',
    'projects.topper.k1': '原生 UI',
    'projects.topper.k2': '速度',
    'projects.topper.k3': '奖杯',
    'projects.topper.k4': '语言',
    'projects.shaper.status': '音频',
    'projects.shaper.desc':
      '我的个人音频播放器。上传你已有的声音 — 音乐、铃声、语音备忘录 — 然后随意塑形：放慢、加速、弯曲音调。音频引擎里带着我自己写的 phase vocoder 补丁，"保持音调"在真正的音乐上也站得住。把一段声音最精彩的几秒标记为 clip，随时一键跳回。',
    'projects.starter.status': '展示',
    'projects.starter.desc':
      '@expo/ui 的每个组件都在双平台原生运行：Android 上是 Jetpack Compose，iOS 上是 SwiftUI。47 个展示页覆盖完整目录：选择器、底部面板、菜单、导航，全都有。UI 先在这里验证，再进入 Topper。',
    'projects.store.play': 'Google Play',
    'projects.store.ios': 'App Store',
    'projects.media.soon': '媒体即将上线',
    'experience.label': '经历',
    'experience.heading': '正职工作。',
    'experience.lede':
      '从满 18 岁起，我就在做真正上线的产品 — 服务两家公司，在生产环境里，每天都有人用。',
    'experience.contopay.role': '支付',
    'experience.contopay.heading': '用手机即刻销售、收款、开票。',
    'experience.contopay.body':
      '刷卡收款、掌握收入、随时开票，全在手机上完成。ContoPay 把你的整个经营装进一个平台，让你清清楚楚地管理生意。',
    'experience.crol.role': 'ERP',
    'experience.crol.heading': 'AI 已经是你 ERP 的一部分。',
    'experience.crol.body':
      '带人工智能的云端 ERP：在 WhatsApp 上直接询问你的公司经营 — 销售、收款、库存、银行 — 或把 Crol ERP 连接到 Claude、ChatGPT 或 Copilot，几秒生成财务报表和税务。',
    'experience.visit': '访问',
    'salvalo.label': '创业项目',
    'salvalo.heading': '在你喜欢的商家预订惊喜包。',
    'salvalo.body': '还是熟悉的美味，以打烊价出售。在应用里预订，把它救回来。',
  },
};

export const useTranslations = (locale: Locale) => (key: UIKey) =>
  ui[locale][key] ?? ui.en[key];
