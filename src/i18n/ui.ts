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
 *
 * The slide bodies double as NARRATION SCRIPTS: each one is the transcript
 * of the voice clip Juan records for that slide, so a muted phone reads
 * exactly what an unmuted one hears. Keep them to ~3 lines.
 */
const en = {
  'meta.title': 'juanevillam',
  'meta.description': 'I build native mobile apps and web products.',
  visit: 'visit',
  soon: 'Coming Soon',
  listen: 'Listen',
  pause: 'Pause',
  'legal.terms': 'Terms and Conditions',
  'legal.privacy': 'Privacy Policy',
  'legal.support': 'Support',

  'hero.tagline': "This is my work. I'll tell you the story myself.",

  'shaper.intro':
    "I used to listen to my music on YouTube Music, between too many ads. And I'd keep the same song in three or four versions — normal, slowed, sped up, ultra slow — which to me are the same song, just slower or faster. Sometimes not even that: I just wanted the 30 seconds I loved, on loop. So I built my own app, free: you add your MP3s, it works without internet, you change the speed live, you shape the equalizer and the effects — preserve pitch, echo, next room — and you make clips of your favorite parts to play with however you want. I built it for me, like all my apps. If it helps someone else, great.",
  'shaper.s1.body':
    'Add your MP3s and you have your own library to listen to, shape, or clip. It works fully offline and hooks into the system — Dynamic Island, widgets, the Lock Screen.',
  'shaper.s2.body':
    'Play your music the way you already know how, in a beautiful, clean interface.',
  'shaper.s3.body':
    'Shape your sound the way you want: the presets, or a five-band equalizer set your way, playback speed, and the original pitch kept at any speed.',
  'shaper.s4.body':
    'Make clips of your favorite parts and play them whenever you want.',
};

export type UIKey = keyof typeof en;

export const ui: Record<Locale, Record<UIKey, string>> = {
  en,
  es: {
    'meta.title': 'juanevillam',
    'meta.description': 'Hago apps móviles nativas y productos web.',
    visit: 'visitar',
    soon: 'Próximamente',
    listen: 'Escuchar',
    pause: 'Pausar',
    'legal.terms': 'Términos y condiciones',
    'legal.privacy': 'Política de privacidad',
    'legal.support': 'Soporte',

    'hero.tagline': 'Esta es mi obra. Te la cuento yo mismo.',

    'shaper.intro':
      'Yo escuchaba mi música en YouTube Music, entre demasiados anuncios. Y una misma canción la escuchaba en tres o cuatro versiones — normal, slowed, sped up, ultra slow — que para mí son la misma canción, solo que más lenta o más rápida. A veces ni eso: solo quería los 30 segundos que me gustaban, en loop. Así que hice mi propia app, gratis: subes tus MP3, funciona sin internet, cambias la velocidad en vivo, moldeas el ecualizador y los efectos — preservar el tono, eco, next room — y haces clips de tus partes favoritas para jugar con ellas como quieras. La hice para mí, como todas mis apps. Si a alguien más le sirve, genial.',
    'shaper.s1.body':
      'Subes tus MP3 y ya tienes tu propia biblioteca para escuchar, moldear o hacer clips. Funciona sin conexión y se integra con el sistema: Dynamic Island, widgets, pantalla de bloqueo.',
    'shaper.s2.body':
      'Reproduce tu música como ya sabes hacerlo, en una interfaz bonita y limpia.',
    'shaper.s3.body':
      'Dale la forma que quieras a tu sonido: con los presets, o ajustando tú mismo el ecualizador de cinco bandas, la velocidad de reproducción y el tono original a cualquier velocidad.',
    'shaper.s4.body':
      'Crea clips de tus partes favoritas y reprodúcelos cuando quieras.',
  },
  zh: {
    'meta.title': 'juanevillam',
    'meta.description': '我做原生移动应用和网页产品。',
    visit: '访问',
    soon: '即将推出',
    listen: '收听',
    pause: '暂停',
    'legal.terms': '条款与条件',
    'legal.privacy': '隐私政策',
    'legal.support': '支持',

    'hero.tagline': '这是我的作品。我亲自讲给你听。',

    'shaper.intro':
      '我以前用 YouTube Music 听歌，广告太多。而且同一首歌我会存三四个版本——正常、slowed、sped up、ultra slow——对我来说那是同一首歌，只是快一点慢一点。有时甚至只想循环我最爱的那 30 秒。所以我做了自己的应用，免费：加入你的 MP3，不用网络，实时改变速度，亲手调均衡器和音效——保持原调、回声、Next Room——还能把最喜欢的部分做成片段，随心去玩。我做它是为了自己，我所有的应用都是。如果对别人也有用，那就太好了。',
    'shaper.s1.body':
      '加入你的 MP3，就有了自己的资料库，可以听、可以塑形、可以做片段。完全离线可用，还接入系统：灵动岛、小组件、锁定屏幕。',
    'shaper.s2.body': '用你早已熟悉的方式播放音乐，界面漂亮而干净。',
    'shaper.s3.body':
      '随心塑造你的声音：用预设，或亲手调五段均衡器、播放速度，任何速度下都保持原调。',
    'shaper.s4.body': '把最喜欢的部分做成片段，想什么时候听就什么时候听。',
  },
};
