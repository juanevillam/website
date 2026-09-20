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
  listen: 'Listen',
  pause: 'Pause',
  'legal.terms': 'Terms and Conditions',
  'legal.privacy': 'Privacy Policy',
  'legal.support': 'Support',
  'legal.delete': 'Delete Account',
  'links.legal': 'Legal',
  'links.help': 'Help',
  'pitch.problem': 'The Problem',
  'pitch.solution': 'The Solution',

  'hero.tagline': "This is my work. I'll tell you the story myself.",

  'shaper.problem':
    'I listened to my music on YouTube Music between too many ads, kept the same song in three or four versions — normal, slowed, sped up, ultra slow — and half the time I just wanted the 30 seconds I loved, on loop.',
  'shaper.solution':
    'A free app where you add your MP3s and it works without internet: change the speed live, shape the equalizer and the effects — preserve pitch, echo, next room — and make clips of your favorite parts.',
  'shaper.s1.p1':
    'Add your songs as MP3s and build your own library, each with its artwork and its info.',
  'shaper.s1.p2':
    'Everything lives on your phone and works fully offline, and it hooks into the system — Dynamic Island, widgets, the Lock Screen, the OS playback controls.',
  'shaper.s2.p1':
    'A player like the one you already know: big artwork, clear controls, and the cover turned into the light of the screen.',
  'shaper.s2.p2':
    'Underneath, one bar with what makes the app special — Shape, Clips and Edit, one tap away.',
  'shaper.s3.p1':
    'This screen is why the app exists: ready-made presets, or a five-band equalizer set your way.',
  'shaper.s3.p2':
    "Playback speed changed live — slowed, sped up, whatever you're feeling — and effects like preserve pitch, echo and next room.",
  'shaper.s4.p1':
    'Pick the exact seconds you love — the whole track below, the zoom above.',
  'shaper.s4.p2':
    'Save them as clips: your favorite parts, documented and ready to loop whenever you want.',
};

export type UIKey = keyof typeof en;

export const ui: Record<Locale, Record<UIKey, string>> = {
  en,
  es: {
    'meta.title': 'juanevillam',
    'meta.description': 'Hago apps móviles nativas y productos web.',
    visit: 'visitar',
    listen: 'Escuchar',
    pause: 'Pausar',
    'legal.terms': 'Términos y condiciones',
    'legal.privacy': 'Política de privacidad',
    'legal.support': 'Soporte',
    'legal.delete': 'Eliminar cuenta',
    'links.legal': 'Legal',
    'links.help': 'Ayuda',
    'pitch.problem': 'El problema',
    'pitch.solution': 'La solución',

    'hero.tagline': 'Esta es mi obra. Te la cuento yo mismo.',

    'shaper.problem':
      'Escuchaba mi música en YouTube Music entre demasiados anuncios, guardaba la misma canción en tres o cuatro versiones — normal, slowed, sped up, ultra slow — y muchas veces solo quería los 30 segundos que me gustaban, en loop.',
    'shaper.solution':
      'Una app gratis donde subes tus MP3 y funciona sin internet: cambias la velocidad en vivo, moldeas el ecualizador y los efectos — preservar el tono, eco, next room — y haces clips de tus partes favoritas.',
    'shaper.s1.p1':
      'Subes tus canciones en MP3 y armas tu propia biblioteca, cada una con su ilustración y sus datos.',
    'shaper.s1.p2':
      'Todo vive en tu teléfono y funciona sin conexión, y se integra con el sistema: Dynamic Island, widgets, pantalla de bloqueo, los controles del OS.',
    'shaper.s2.p1':
      'Un reproductor como el que ya conoces: portada grande, controles claros y la ilustración convertida en la luz de la pantalla.',
    'shaper.s2.p2':
      'Debajo, una barra con lo que hace especial a la app — Moldear, Clips y Editar, a un toque.',
    'shaper.s3.p1':
      'Esta pantalla es la razón de que exista la app: presets listos, o un ecualizador de cinco bandas a tu manera.',
    'shaper.s3.p2':
      'Velocidad de reproducción en vivo — slowed, sped up, lo que quieras — y efectos como preservar el tono, eco y next room.',
    'shaper.s4.p1':
      'Elige los segundos exactos que te encantan — la canción entera abajo, el zoom arriba.',
    'shaper.s4.p2':
      'Guárdalos como clips: tus partes favoritas, documentadas y listas para repetir en loop cuando quieras.',
  },
  zh: {
    'meta.title': 'juanevillam',
    'meta.description': '我做原生移动应用和网页产品。',
    visit: '访问',
    listen: '收听',
    pause: '暂停',
    'legal.terms': '条款与条件',
    'legal.privacy': '隐私政策',
    'legal.support': '支持',
    'legal.delete': '删除账户',
    'links.legal': '法律',
    'links.help': '帮助',
    'pitch.problem': '问题',
    'pitch.solution': '解决方案',

    'hero.tagline': '这是我的作品。我亲自讲给你听。',

    'shaper.problem':
      '我在 YouTube Music 听歌，广告太多；同一首歌存三四个版本——正常、slowed、sped up、ultra slow——而很多时候我只想循环最爱的那 30 秒。',
    'shaper.solution':
      '一个免费的应用：加入你的 MP3，不用网络就能用——实时改变速度，亲手调均衡器和音效（保持原调、回声、Next Room），把最喜欢的部分做成片段。',
    'shaper.s1.p1':
      '把歌曲以 MP3 加入，建立你自己的资料库，每一首都带着插图和信息。',
    'shaper.s1.p2':
      '一切都存在你的手机里，完全离线可用，并且接入系统：灵动岛、小组件、锁定屏幕、系统播放控制。',
    'shaper.s2.p1':
      '一个你早已熟悉的播放器：大封面、清晰的控制，插图化作整个屏幕的光。',
    'shaper.s2.p2':
      '下方一条栏，放着这个应用的特别之处——塑形、片段、编辑，一点即达。',
    'shaper.s3.p1':
      '这个屏幕就是这个应用存在的理由：现成的预设，或亲手调的五段均衡器。',
    'shaper.s3.p2':
      '实时改变播放速度——slowed、sped up，随你心情——还有保持原调、回声、Next Room 这些音效。',
    'shaper.s4.p1': '选出你最爱的那几秒——整首歌在下面，放大在上面。',
    'shaper.s4.p2': '存成片段：你最喜欢的部分，被记录下来，想循环就循环。',
  },
};
