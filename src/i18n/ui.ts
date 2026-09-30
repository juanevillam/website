export const locales = ['en', 'es', 'zh'] as const;
export type Locale = (typeof locales)[number];

/** Native names, the way Apple lists languages — never translated. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
};

/** What the header shows at rest: the ISO code, as a label. */
export const localeCodes: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
  zh: 'ZH',
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

  'shaper.problem':
    'I listened to my music on YouTube Music between too many ads, kept the same song in three or four versions — normal, slowed, sped up, ultra slow — and half the time I just wanted the 30 seconds I loved, on loop.',
  'shaper.solution':
    "An app where you add your MP3s and it works without internet: change the speed live, shape the equalizer and the effects — preserve pitch, echo, next room — and make clips of your favorite parts. It isn't another streaming app: no catalogue, no algorithm deciding for you. It's your music — the music you already have — sounding the way you want it.",
  'shaper.s1.p1':
    'Add your songs as MP3s and build your own library, each with its artwork and its info.',
  'shaper.s1.p2':
    "Everything lives on your phone and works fully offline, and it hooks into the system — Dynamic Island, widgets, the Lock Screen, the OS playback controls. Drag any cover to arrange the library your way; the one that's playing carries a quiet mark, so you never lose sight of it.",
  'shaper.s2.p1':
    'A player like the one you already know: big artwork, clear controls, and the cover turned into the light of the screen.',
  'shaper.s2.p2':
    'Underneath, one bar with what makes the app special — Shape, Clips and Edit, one tap away. Whatever you set stays set: it carries from song to song, so the whole queue sounds the way you left it.',
  'shaper.s3.p1':
    'This screen is why the app exists: ready-made presets, or a five-band equalizer set your way.',
  'shaper.s3.p2':
    "Playback speed changed live — slowed, sped up, whatever you're feeling — and effects like preserve pitch, echo and next room. The presets are matched in loudness, so comparing them compares their tone — not which one is louder — and none of them clips.",
  'shaper.s4.p1':
    'Pick the exact seconds you love — the whole track below, the zoom above.',
  'shaper.s4.p2':
    'Save them as clips: your favorite parts, documented and ready to loop whenever you want. Every clip stays with its song: edit it, delete it or play it again whenever you want.',
  'topper.problem':
    'My favorite games, movies and anime lived in my head as rankings I changed every week, and the only place to share them was a group chat, where they scrolled away within the hour.',
  'topper.solution':
    'An app for tops of anything: rank what you love, follow people whose taste you trust, and settle the order in the comments. Like Letterboxd, but for every list you would make.',
  'topper.s1.p1':
    'Your tops open the app, each with its number one as the cover.',
  'topper.s1.p2':
    'Below, the tops of the people you follow — their whole order, not just a like, so you see exactly where their taste and yours part ways.',
  'topper.s2.p1':
    'Explore is where you find people worth following, and the tops of everyone else.',
  'topper.s2.p2':
    'Search looks inside every item too, so typing a game finds every top that ranks it.',
  'topper.s3.p1':
    'A top is a list you reorder with a drag; the podium moves with you.',
  'topper.s3.p2':
    'Others tap Agree or Could Be Better, and the comments take care of the rest.',
  'topper.s4.p1':
    'Your profile is every top you have made, with its top three in view.',
  'topper.s4.p2':
    'And trophies, PlayStation-style, that unlock as you use the app, all the way to the platinum.',
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

    'shaper.problem':
      'Escuchaba mi música en YouTube Music entre demasiados anuncios, guardaba la misma canción en tres o cuatro versiones — normal, slowed, sped up, ultra slow — y muchas veces solo quería los 30 segundos que me gustaban, en loop.',
    'shaper.solution':
      'Una app donde subes tus MP3 y funciona sin internet: cambias la velocidad en vivo, moldeas el ecualizador y los efectos — preservar el tono, eco, next room — y haces clips de tus partes favoritas. No es otra app de streaming: no hay catálogo ni algoritmo decidiendo por ti. Es tu música — la que ya tienes — sonando como tú quieres.',
    'shaper.s1.p1':
      'Subes tus canciones en MP3 y armas tu propia biblioteca, cada una con su ilustración y sus datos.',
    'shaper.s1.p2':
      'Todo vive en tu teléfono y funciona sin conexión, y se integra con el sistema: Dynamic Island, widgets, pantalla de bloqueo, los controles del OS. Arrastra cualquier portada para ordenar la biblioteca a tu manera; la que está sonando lleva una marca discreta, así nunca la pierdes de vista.',
    'shaper.s2.p1':
      'Un reproductor como el que ya conoces: portada grande, controles claros y la ilustración convertida en la luz de la pantalla.',
    'shaper.s2.p2':
      'Debajo, una barra con lo que hace especial a la app — Moldear, Clips y Editar, a un toque. Lo que ajustas se queda puesto: pasa de canción en canción, así que toda la cola suena como la dejaste.',
    'shaper.s3.p1':
      'Esta pantalla es la razón de que exista la app: presets listos, o un ecualizador de cinco bandas a tu manera.',
    'shaper.s3.p2':
      'Velocidad de reproducción en vivo — slowed, sped up, lo que quieras — y efectos como preservar el tono, eco y next room. Los presets están igualados en volumen: al compararlos escuchas su tono, no cuál suena más fuerte, y ninguno satura.',
    'shaper.s4.p1':
      'Elige los segundos exactos que te encantan — la canción entera abajo, el zoom arriba.',
    'shaper.s4.p2':
      'Guárdalos como clips: tus partes favoritas, documentadas y listas para repetir en loop cuando quieras. Cada clip se queda con su canción: lo editas, lo eliminas o lo vuelves a escuchar cuando quieras.',
    'topper.problem':
      'Mis juegos, películas y anime favoritos vivían en mi cabeza como rankings que cambiaba cada semana, y el único lugar para compartirlos era un chat de grupo, donde se perdían en una hora.',
    'topper.solution':
      'Una app de tops de lo que sea: ordenas lo que te encanta, sigues a gente con buen gusto y el orden se discute en los comentarios. Como Letterboxd, pero para cualquier lista que harías.',
    'topper.s1.p1':
      'Tus tops abren la app, cada uno con su número uno de portada.',
    'topper.s1.p2':
      'Debajo, los tops de las personas que sigues — su orden completo, no solo un like, así ves exactamente dónde su gusto y el tuyo se separan.',
    'topper.s2.p1':
      'Explorar es donde encuentras gente que vale la pena seguir, y los tops de todos los demás.',
    'topper.s2.p2':
      'La búsqueda también mira dentro de cada elemento: escribes un juego y aparecen todos los tops que lo tienen.',
    'topper.s3.p1':
      'Un top es una lista que reordenas arrastrando; el podio se mueve contigo.',
    'topper.s3.p2':
      'Los demás tocan De acuerdo o Podría mejorar, y los comentarios hacen el resto.',
    'topper.s4.p1':
      'Tu perfil son todos los tops que has hecho, con sus tres primeros a la vista.',
    'topper.s4.p2':
      'Y trofeos, al estilo PlayStation, que se desbloquean mientras usas la app, hasta llegar al platino.',
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

    'shaper.problem':
      '我在 YouTube Music 听歌，广告太多；同一首歌存三四个版本——正常、slowed、sped up、ultra slow——而很多时候我只想循环最爱的那 30 秒。',
    'shaper.solution':
      '一个应用：加入你的 MP3，不用网络就能用——实时改变速度，亲手调均衡器和音效（保持原调、回声、Next Room），把最喜欢的部分做成片段。它不是又一个流媒体应用：没有曲库，也没有替你做决定的算法。它是你的音乐——你已经拥有的音乐——照你想要的样子响起。',
    'shaper.s1.p1':
      '把歌曲以 MP3 加入，建立你自己的资料库，每一首都带着插图和信息。',
    'shaper.s1.p2':
      '一切都存在你的手机里，完全离线可用，并且接入系统：灵动岛、小组件、锁定屏幕、系统播放控制。拖动任意封面，按你的方式排列资料库；正在播放的那首带着一个低调的标记，让你永远不会找不到它。',
    'shaper.s2.p1':
      '一个你早已熟悉的播放器：大封面、清晰的控制，插图化作整个屏幕的光。',
    'shaper.s2.p2':
      '下方一条栏，放着这个应用的特别之处——塑形、片段、编辑，一点即达。你调好的设置会一直保留：从一首歌延续到下一首，整个播放队列都照你留下的样子播放。',
    'shaper.s3.p1':
      '这个屏幕就是这个应用存在的理由：现成的预设，或亲手调的五段均衡器。',
    'shaper.s3.p2':
      '实时改变播放速度——slowed、sped up，随你心情——还有保持原调、回声、Next Room 这些音效。预设的响度彼此匹配：比较它们时，你听到的是音色，而不是哪个更响，而且没有一个会削波。',
    'shaper.s4.p1': '选出你最爱的那几秒——整首歌在下面，放大在上面。',
    'shaper.s4.p2':
      '存成片段：你最喜欢的部分，被记录下来，想循环就循环。每个片段都跟着它的歌曲：随时编辑、删除，或者再听一遍。',
    'topper.problem':
      '我最爱的游戏、电影和动漫，一直以排名的形式留在脑子里，每周都在变；唯一能分享的地方是群聊，不到一小时就被刷走了。',
    'topper.solution':
      '一个什么都能排的榜单应用：给你喜欢的东西排序，关注品味值得信赖的人，在评论里争论谁该排第一。就像 Letterboxd，但适用于你会列的每一份清单。',
    'topper.s1.p1': '打开应用先看到你的榜单，每个都以第一名作为封面。',
    'topper.s1.p2':
      '下面是你关注的人的榜单——完整的排序，而不只是一个赞，让你清楚看到他们的品味和你在哪里分道扬镳。',
    'topper.s2.p1': '“探索”里能找到值得关注的人，以及其他所有人的榜单。',
    'topper.s2.p2':
      '搜索也会查看每个条目：输入一款游戏，就能找到所有收录它的榜单。',
    'topper.s3.p1': '榜单就是一份拖动即可重新排序的清单；领奖台随你而动。',
    'topper.s3.p2': '其他人可以轻点“赞同”或“可以更好”，剩下的交给评论。',
    'topper.s4.p1': '你的个人资料就是你做过的所有榜单，前三名一目了然。',
    'topper.s4.p2':
      '还有 PlayStation 风格的奖杯，随着你使用应用逐一解锁，直到白金。',
  },
};
