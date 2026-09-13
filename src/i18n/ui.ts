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
 * Section bodies are placeholders until Juan dictates the real ones.
 */
const en = {
  'meta.title': 'juanevillam — developer',
  'meta.description': 'Developer. I build native mobile apps and web products.',
  'hero.eyebrow': 'developer',
  'label.what': 'what',
  'label.why': 'why',
  'label.how': 'how',
  'shaper.what':
    "A personal audio player. Upload the sounds you already have — music, ringtones, voice memos — and mark a sound's best seconds as clips you can jump right back to.",
  'shaper.why':
    'I wanted my own library, played my way: slowed down, sped up, pitch bent — and stock players butcher music the moment you touch its speed.',
  'shaper.how':
    "React Native rendering each platform's real UI, with my own phase-vocoder patch inside the audio engine so Preserve Pitch holds up on real music.",
  'topper.what':
    'A social app of ranked lists — tops — of anything you rate: you crown a winner, people fight back with crowns and comments, and trophies land along the way.',
  'topper.why':
    'I wanted one product built completely solo, to a product-grade bar: design, code and backend, nothing outsourced.',
  'topper.how':
    'One codebase rendering SwiftUI on iOS and Jetpack Compose on Android — the actual native components — with optimistic counters everywhere and a trophy engine driven from plain config.',
  'salvalo.what':
    'Surprise packs from your favorite shops: the usual, at closing price. Reserve it in the app and rescue it.',
  'salvalo.why':
    'Food that would go to waste gets sold instead — shops recover money, people save it, meals get saved.',
  'salvalo.how':
    'I build the product end to end — the web platform, the mobile app and the landing.',
  'crol.what':
    'The cloud ERP with artificial intelligence: ask your company anything over WhatsApp, or connect it to Claude, ChatGPT or Copilot.',
  'crol.why':
    "The day job — I've been shipping production software there since I turned 18, used every day by real businesses.",
  'crol.how':
    'Lead frontend: moving legacy apps onto modern stacks and building new products — ContoPay, its payments product, among them.',
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
    'label.what': 'qué',
    'label.why': 'por qué',
    'label.how': 'cómo',
    'shaper.what':
      'Un reproductor de audio personal. Sube los sonidos que ya tienes — música, tonos, notas de voz — y marca los mejores segundos de un sonido como clips a los que vuelves al instante.',
    'shaper.why':
      'Quería mi propia biblioteca, reproducida a mi manera: más lenta, más rápida, con el tono doblado — y los reproductores comunes destrozan la música apenas tocas su velocidad.',
    'shaper.how':
      'React Native renderizando la UI real de cada plataforma, con mi propio parche de phase vocoder dentro del motor de audio para que Preservar tono aguante con música de verdad.',
    'topper.what':
      'Una app social de listas rankeadas — tops — de lo que sea que califiques: coronas al ganador, la gente contraataca con coronas y comentarios, y vas ganando trofeos en el camino.',
    'topper.why':
      'Quería un producto construido completamente en solitario, con vara de producto real: diseño, código y backend, nada tercerizado.',
    'topper.how':
      'Un solo código renderizando SwiftUI en iOS y Jetpack Compose en Android — los componentes nativos de verdad — con contadores optimistas en todas partes y un motor de trofeos manejado por pura configuración.',
    'salvalo.what':
      'Packs sorpresa de tus comercios favoritos: lo de siempre, a precio de cierre. Resérvalo en la app y rescátalo.',
    'salvalo.why':
      'La comida que iba a desperdiciarse se vende — los comercios recuperan dinero, la gente ahorra y la comida se salva.',
    'salvalo.how':
      'Construyo el producto de punta a punta — la plataforma web, la app móvil y el landing.',
    'crol.what':
      'El ERP en la nube con inteligencia artificial: pregúntale a tu empresa por WhatsApp, o conéctalo a Claude, ChatGPT o Copilot.',
    'crol.why':
      'El trabajo de verdad — ahí llevo lanzando software en producción desde que cumplí 18, usado todos los días por negocios reales.',
    'crol.how':
      'Lead frontend: migrando apps legadas a stacks modernos y construyendo productos nuevos — entre ellos ContoPay, su producto de pagos.',
    visit: 'visitar',
  },
  zh: {
    'meta.title': 'juanevillam — 开发者',
    'meta.description': '开发者。我做原生移动应用和网页产品。',
    'hero.eyebrow': '开发者',
    'label.what': '是什么',
    'label.why': '为什么',
    'label.how': '怎么做',
    'shaper.what':
      '一个个人音频播放器。上传你已有的声音 — 音乐、铃声、语音备忘录 — 把一段声音最精彩的几秒标记为 clip，随时一键跳回。',
    'shaper.why':
      '我想要自己的曲库，按我的方式播放：放慢、加速、弯曲音调 — 而普通播放器只要一动速度就把音乐毁了。',
    'shaper.how':
      'React Native 渲染每个平台真正的 UI，音频引擎里带着我自己写的 phase vocoder 补丁，让"保持音调"在真正的音乐上也站得住。',
    'topper.what':
      '一个排名列表社交应用 — 给任何你想评价的东西建立 tops：你为第一名加冕，别人用皇冠和评论反击，一路赢取奖杯。',
    'topper.why':
      '我想要一个完全独立完成、达到真正产品水准的作品：设计、代码、后端，没有一样外包。',
    'topper.how':
      '一套代码在 iOS 上渲染 SwiftUI、在 Android 上渲染 Jetpack Compose — 真正的原生组件 — 处处乐观更新，奖杯引擎由纯配置驱动。',
    'salvalo.what':
      '你喜欢的商家的惊喜包：还是熟悉的美味，以打烊价出售。在应用里预订，把它救回来。',
    'salvalo.why':
      '本要被浪费的食物卖了出去 — 商家收回成本，人们省了钱，食物免于浪费。',
    'salvalo.how': '产品由我从头到尾负责 — 网页平台、移动应用和落地页。',
    'crol.what':
      '带人工智能的云端 ERP：在 WhatsApp 上直接询问你的公司经营，或把它连接到 Claude、ChatGPT 或 Copilot。',
    'crol.why':
      '正职工作 — 从满 18 岁起我就在那里做生产环境的软件，每天都有真实的企业在用。',
    'crol.how':
      '前端负责人：把遗留应用迁移到现代技术栈，并构建新产品 — 其中包括它的支付产品 ContoPay。',
    visit: '访问',
  },
};
