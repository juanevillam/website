export const locales = ['en', 'es', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
  zh: '中文',
};

/**
 * en is the canonical tree; es/zh mirror its shape. Copy here is DRAFT —
 * every line ships as an option for Juan to react to, never final.
 */
const en = {
  'meta.title': 'juanevillam — software developer',
  'meta.description':
    'Software developer. I build native mobile apps and web products.',
  'hero.eyebrow': 'software developer',
  'hero.thesis':
    'I build software the way I play games: going for the platinum.',
  'theme.light': 'light',
  'theme.dark': 'dark',
  'theme.system': 'system',
  'projects.label': 'projects',
  'projects.heading': 'Two apps, one monorepo.',
  'projects.topper.status': 'social · ranked lists',
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
  'projects.starter.status': '@expo/ui showcase',
  'projects.starter.desc':
    'Every @expo/ui component running native on both platforms — Jetpack Compose on Android, SwiftUI on iOS. 47 showcase screens covering the whole catalog: pickers, sheets, menus, navigation, the lot. This is where I prove UI before it ships in Topper.',
  'projects.store.play': 'Google Play',
  'projects.store.ios': 'App Store',
  'projects.media.soon': 'media soon',
  'experience.label': 'experience',
  'experience.heading': 'The day job.',
  'experience.lede':
    "I've been shipping real products since I turned 18 — for two companies, in production, used every day.",
  'experience.contopay.role': 'design · architecture · front-end',
  'experience.contopay.when': 'since 2022 · payments',
  'experience.contopay.body':
    "I lead design and architecture on ContoPay's three products — web, mobile, and the landing — and I built most of them myself. A teammate owns the backend and the AI features; the rest is me.",
  'experience.crol.role': 'migrations · new builds',
  'experience.crol.when': 'parent company · ERP',
  'experience.crol.body':
    "Crol is ContoPay's parent — bigger, older, more products. There I work with a larger team: moving legacy apps onto modern stacks, and building new ones from scratch.",
  'experience.visit': 'visit',
};

export type UIKey = keyof typeof en;

export const ui: Record<Locale, Record<UIKey, string>> = {
  en,
  es: {
    'meta.title': 'juanevillam — desarrollador de software',
    'meta.description':
      'Desarrollador de software. Hago apps móviles nativas y productos web.',
    'hero.eyebrow': 'desarrollador de software',
    'hero.thesis':
      'Hago software igual que juego videojuegos: voy por el platino.',
    'theme.light': 'claro',
    'theme.dark': 'oscuro',
    'theme.system': 'sistema',
    'projects.label': 'proyectos',
    'projects.heading': 'Dos apps, un monorepo.',
    'projects.topper.status': 'social · listas rankeadas',
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
    'projects.starter.status': 'vitrina de @expo/ui',
    'projects.starter.desc':
      'Cada componente de @expo/ui corriendo nativo en ambas plataformas: Jetpack Compose en Android, SwiftUI en iOS. 47 pantallas que cubren todo el catálogo: pickers, sheets, menús, navegación, todo. Aquí pruebo la UI antes de que llegue a Topper.',
    'projects.store.play': 'Google Play',
    'projects.store.ios': 'App Store',
    'projects.media.soon': 'media pronto',
    'experience.label': 'experiencia',
    'experience.heading': 'El trabajo de verdad.',
    'experience.lede':
      'Llevo lanzando productos reales desde que cumplí 18 — para dos empresas, en producción, usados todos los días.',
    'experience.contopay.role': 'diseño · arquitectura · front-end',
    'experience.contopay.when': 'desde 2022 · pagos',
    'experience.contopay.body':
      'Lidero el diseño y la arquitectura de los tres productos de ContoPay — web, móvil y el landing — y construí la mayoría yo mismo. Un compañero lleva el backend y las funciones de IA; el resto soy yo.',
    'experience.crol.role': 'migraciones · productos nuevos',
    'experience.crol.when': 'empresa matriz · ERP',
    'experience.crol.body':
      'Crol es la matriz de ContoPay — más grande, más antigua, más productos. Ahí trabajo con un equipo más amplio: migrando apps legadas a stacks modernos y construyendo nuevas desde cero.',
    'experience.visit': 'visitar',
  },
  zh: {
    'meta.title': 'juanevillam — 软件开发者',
    'meta.description': '软件开发者。我做原生移动应用和网页产品。',
    'hero.eyebrow': '软件开发者',
    'hero.thesis': '我做软件就像打游戏：奔着白金去。',
    'theme.light': '浅色',
    'theme.dark': '深色',
    'theme.system': '跟随系统',
    'projects.label': '项目',
    'projects.heading': '两个应用，一个 monorepo。',
    'projects.topper.status': '社交 · 排名列表',
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
    'projects.starter.status': '@expo/ui 展示',
    'projects.starter.desc':
      '@expo/ui 的每个组件都在双平台原生运行：Android 上是 Jetpack Compose，iOS 上是 SwiftUI。47 个展示页覆盖完整目录：选择器、底部面板、菜单、导航，全都有。UI 先在这里验证，再进入 Topper。',
    'projects.store.play': 'Google Play',
    'projects.store.ios': 'App Store',
    'projects.media.soon': '媒体即将上线',
    'experience.label': '经历',
    'experience.heading': '正职工作。',
    'experience.lede':
      '从满 18 岁起，我就在做真正上线的产品 — 服务两家公司，在生产环境里，每天都有人用。',
    'experience.contopay.role': '设计 · 架构 · 前端',
    'experience.contopay.when': '自 2022 · 支付',
    'experience.contopay.body':
      'ContoPay 的三个产品 — 网页、移动端和落地页 — 由我主导设计与架构，大部分是我亲手做的。一位同事负责后端和 AI 功能；其余都是我。',
    'experience.crol.role': '迁移 · 新产品',
    'experience.crol.when': '母公司 · ERP',
    'experience.crol.body':
      'Crol 是 ContoPay 的母公司 — 更大、更老、产品更多。在那里我和更大的团队协作：把遗留应用迁移到现代技术栈，并从零构建新产品。',
    'experience.visit': '访问',
  },
};

export const useTranslations = (locale: Locale) => (key: UIKey) =>
  ui[locale][key] ?? ui.en[key];
