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

  'hero.tagline': "This is my work. I'll tell you the story myself.",

  'shaper.intro':
    'I wanted to hear my music my way — slower, warmer, cut down to the seconds I love. No app did all of it, so I built Sound Shaper.',
  'shaper.s1.title': 'Library',
  'shaper.s1.body':
    'Every MP3 you add becomes a tile with its artwork. One tap and it plays.',
  'shaper.s2.title': 'Player',
  'shaper.s2.body':
    "The artwork becomes the room's light. Everything on this screen comes from the cover itself.",
  'shaper.s3.title': 'Shape',
  'shaper.s3.body':
    'A five-band equalizer, playback speed, and a switch that keeps the original pitch at any speed. This screen is why the app exists.',
  'shaper.s4.title': 'Clips',
  'shaper.s4.body':
    'Cut the exact seconds you care about. The whole track below, the zoom above, two handles, done.',
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

    'hero.tagline': 'Esta es mi obra. Te la cuento yo mismo.',

    'shaper.intro':
      'Quería escuchar mi música a mi manera: más lenta, más cálida, cortada a los segundos que me encantan. Ninguna app lo hacía todo, así que hice Sound Shaper.',
    'shaper.s1.title': 'Biblioteca',
    'shaper.s1.body':
      'Cada MP3 que agregas se convierte en un mosaico con su ilustración. Un toque y suena.',
    'shaper.s2.title': 'Reproductor',
    'shaper.s2.body':
      'La ilustración se convierte en la luz del cuarto. Todo lo que ves en esta pantalla sale de la propia portada.',
    'shaper.s3.title': 'Shape',
    'shaper.s3.body':
      'Ecualizador de cinco bandas, velocidad de reproducción y un ajuste que conserva el tono a cualquier velocidad. Esta pantalla es la razón de que exista la app.',
    'shaper.s4.title': 'Clips',
    'shaper.s4.body':
      'Corta los segundos exactos que te importan. La canción entera abajo, el zoom arriba, dos bordes y listo.',
  },
  zh: {
    'meta.title': 'juanevillam',
    'meta.description': '我做原生移动应用和网页产品。',
    visit: '访问',
    soon: '即将推出',
    listen: '收听',
    pause: '暂停',

    'hero.tagline': '这是我的作品。我亲自讲给你听。',

    'shaper.intro':
      '我想按自己的方式听音乐：慢一点，暖一点，只留下我爱的那几秒。没有一个应用能做到全部，所以我做了 Sound Shaper。',
    'shaper.s1.title': '资料库',
    'shaper.s1.body': '每一首加入的 MP3 都会带着插图出现。轻点一下就能播放。',
    'shaper.s2.title': '播放器',
    'shaper.s2.body':
      '插图变成了整个房间的光。这个屏幕上的一切都来自封面本身。',
    'shaper.s3.title': 'Shape',
    'shaper.s3.body':
      '五段均衡器、播放速度，以及在任何速度下都保持原调的开关。这个屏幕就是这个应用存在的理由。',
    'shaper.s4.title': 'Clips',
    'shaper.s4.body':
      '剪出你在乎的那几秒。整首歌在下面，放大在上面，两个手柄，完成。',
  },
};
