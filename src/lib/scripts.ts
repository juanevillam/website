/**
 * THE NARRATION SCRIPTS — what each clip has to SAY, one entry per clip
 * key (see lib/narration). Read only by the dev teleprompter (pages/dev);
 * nothing on the public page imports this file.
 *
 * IDEAS, NOT LINES (Juan, 2026-10-17): read word for word, a script never
 * sounded like him, so each clip is the points to cover, in order, and he
 * says them his own way. A name, a number or a place in an idea is one he
 * has to say; everything else is his. The subtitles come from what he
 * actually said: the dev server's recorder transcribes the take (whisper,
 * scripts/narration-recorder.mjs) and times every phrase from it.
 *
 * Spanish is the source. English and Chinese (SCRIPT_EN, SCRIPT_ZH) are
 * still the 2026-10-16 line-for-line translations of the OLD Spanish
 * lines; each is rewritten as ideas, from the Spanish ideas, before its
 * own recording block — the teleprompter marks them as drafts.
 */
export type ScriptLang = 'es' | 'en' | 'zh';
export const SCRIPT_LANGS: ScriptLang[] = ['es', 'en', 'zh'];

export type ScriptClip = {
  key: string;
  /** Where it plays on the page, as the teleprompter's heading. */
  where: string;
  /** What a visitor sees while it plays, when that is a screenshot. */
  shot?: string;
  /** The points to cover, in order. */
  ideas: string[];
  /** Why this script is not ready to record from yet, when it is not. */
  draft?: string;
};

const shot = (app: string, name: string) => `/media/${app}/${name}.png`;

export const SCRIPTS_ES: ScriptClip[] = [
  {
    key: 'hero',
    where: 'Inicio',
    ideas: [
      'Saludo: Juan Villa, desarrollador de software.',
      'Hago software como juego videojuegos: yendo por el platino.',
      'Desde 2022 trabajo remoto para empresas en México; antes, clientes en España y Argentina. (Sin nombrar a Crol.)',
      'Empecé ingeniería electrónica, luego técnico en informática, pero lo que más me enseñó fue construir cosas.',
      'Qué vas a ver aquí: Sound Shaper, la app que hice para mí; mi trabajo; mi startup; los eventos de emprendimiento y desarrollo en los que he estado.',
      'La página está en español, inglés y chino: cámbialo arriba, en la barra.',
      'Toda la página está narrada, casi no hay texto: quería que me escucharan. Es mi voz real, no IA.',
    ],
  },

  // Sound Shaper
  {
    key: 'shaper.problem',
    where: 'Sound Shaper · el problema',
    ideas: [
      'Escuchaba mucha música en YouTube Music, con anuncios a cada rato.',
      'Si una canción me gustaba, la quería en todas sus versiones: normal, slowed, sped up, ultra slowed.',
      'Y muchas veces solo quería los treinta segundos que más me gustaban, en repetición.',
    ],
  },
  {
    key: 'shaper.solution',
    where: 'Sound Shaper · la idea',
    ideas: [
      'Por eso hice Sound Shaper: un reproductor de MP3 que funciona sin internet.',
      'Tengo la canción original una vez y desde la app la pongo lenta o rápida, le pongo efectos y corto clips de mis partes favoritas.',
      'En YouTube la canción suena como está; aquí yo escojo cómo la escucho.',
    ],
  },
  {
    key: 'shaper.s1.p1',
    where: 'Sound Shaper · Library',
    shot: shot('shaper', 'ios-dark-home'),
    ideas: [
      'Esta es tu biblioteca.',
      'La app no descarga música: subes tus propios MP3, para uso personal.',
      'Los ordenas a mano, arrastrándolos, en el orden que quieras.',
    ],
  },
  {
    key: 'shaper.s1.p2',
    where: 'Sound Shaper · Library',
    shot: shot('shaper', 'ios-dark-home'),
    ideas: [
      'Funciona con lo que ya conoces del teléfono: Dynamic Island, pantalla de bloqueo, widgets.',
      'Desde aquí entras a Ajustes, como en mis otras apps: cuenta, idioma, apariencia.',
      'Y trofeos, tipo los de PlayStation.',
    ],
  },
  {
    key: 'shaper.s2.p1',
    where: 'Sound Shaper · Player',
    shot: shot('shaper', 'ios-dark-player'),
    ideas: [
      'El reproductor lo inspiré en YouTube Music y Apple Music.',
      'Es un reproductor normal, y está bien así: play, pausa, cambiar de canción sin pensarlo.',
    ],
  },
  {
    key: 'shaper.s2.p2',
    where: 'Sound Shaper · Player',
    shot: shot('shaper', 'ios-dark-player'),
    ideas: [
      'Lo distinto está abajo: desde aquí abres Shape y Clips.',
      'Son las razones por las que hice la app.',
    ],
  },
  {
    key: 'shaper.s3.p1',
    where: 'Sound Shaper · Shape',
    shot: shot('shaper', 'ios-dark-shape'),
    ideas: [
      'Shape es la razón principal de la app; de ahí el nombre: Sound Shaper, moldeador de sonidos.',
      'Presets listos, o ecualizador manual si sabes más de eso.',
      'Velocidad: ya no busco la versión slowed, la pongo slowed al nivel que quiera.',
    ],
  },
  {
    key: 'shaper.s3.p2',
    where: 'Sound Shaper · Shape',
    shot: shot('shaper', 'ios-dark-shape'),
    ideas: [
      'Preservar el tono fue lo más curioso de construir.',
      'En YouTube, si la pones lenta, la voz suena en cámara lenta; aquí la voz se queda igual.',
      'Dos efectos favoritos: eco, como en un concierto, y next room, como una fiesta en el cuarto de al lado.',
      'Con audífonos y los ojos cerrados, te transporta.',
    ],
  },
  {
    key: 'shaper.s4.p1',
    where: 'Sound Shaper · Clips',
    shot: shot('shaper', 'ios-dark-clip'),
    ideas: [
      'Clips lo inspiré en Notas de Voz de Apple, la misma app con la que grabé las ideas de esta página.',
      'Escoges el pedazo exacto de la canción que más te gusta.',
    ],
  },
  {
    key: 'shaper.s4.p2',
    where: 'Sound Shaper · Clips',
    shot: shot('shaper', 'ios-dark-clip'),
    ideas: [
      'Lo guardas como clip y lo escuchas una y otra vez.',
      'Desde aquí también abres Shape, para que el clip suene a tu manera.',
    ],
  },

  // More Work
  {
    key: 'work.salvalo.body',
    where: 'Más proyectos · Salvalo',
    ideas: [
      'Salvalo es mi startup.',
      'Los comercios cierran cada día con productos que todavía se pueden vender; en Salvalo los convierten en packs con precio y hora de recogida.',
      'Encuentras uno cerca en el mapa, lo apartas, le pagas directo al comercio y lo recoges con un código.',
      'Mi parte: rediseñé toda la app, cliente y comercio, e hice la nueva web, que el equipo edita sin código.',
      'Y salgo a visitar comercios para el piloto en Barquisimeto.',
    ],
  },
  {
    key: 'work.crol.body',
    where: 'Más proyectos · Crol ERP Móvil',
    ideas: [
      'Desde 2022 trabajo en Crol, un ERP en la nube para empresas en México.',
      'Empecé en Conto Pay, una versión más simple de Crol: su web, su landing y su app móvil.',
      'Esa app fue la base de Crol ERP Móvil, que construí desde cero, diseño incluido, para usar Crol desde el teléfono.',
    ],
  },
  {
    key: 'arcade.p1',
    where: 'Más proyectos · Space Explorer',
    ideas: [
      'Empezó como un easter egg para mis apps, como el de Android: tocas varias veces la versión y aparece un juego.',
      'Iba a tener tres niveles, uno por app: el mar, el espacio y una guerra espacial. Lo quité para no complicar las apps.',
      'Meses después llegó el reto arcade de Platanus Hack, y como ya tenía la idea, lo hice.',
      'Un shooter en 3D que cabe en 50 KB.',
    ],
  },
  {
    key: 'work.maktub.body',
    where: 'Más proyectos · Maktub Art Fund',
    ideas: [
      'Maktub Art Fund: un cliente de México que conocí gracias a Crol.',
      'Era una landing; casi nunca me llaman la atención, pero el diseño de esta me gustó y la hice.',
    ],
  },
  {
    key: 'work.andreina.body',
    where: 'Más proyectos · Andreina Aular',
    ideas: [
      'La página de Andreina Aular fue la primera que hice, al terminar mis primeros cursos de Udemy.',
      'La diseñé en Figma, la publiqué y le hice actualizaciones.',
      'Después la rehicimos completa en WordPress.',
    ],
  },

  // Events
  {
    key: 'events.panal.body',
    where: 'Eventos · El Panal',
    ideas: [
      'El Panal, el movimiento que creó Manuel Sira: fui a una de sus noches en Barquisimeto.',
      'Gente construyendo de todo: marketing, moda, CRM, inventarios, apps de psicología y de salud.',
      'Charlas: inteligencia artificial, medir los datos de tu empresa para crecer, y diferenciarte ahora que cualquiera programa: lo que hace falta es gusto.',
      'Cada startup tenía treinta segundos exactos de pitch; nervioso, di el de Salvalo.',
      'Me fui con amigos nuevos, contactos y uno que otro lead; conocí al equipo de Resty, una app de salud.',
      'Y me junté con mis founder bros de Tripealo: juntos, pero no revueltos. Quizás un adelanto del Startup Summit Caracas.',
    ],
  },
  {
    key: 'events.radio.body',
    where: 'Eventos · Entrevista en OK 101.5',
    ideas: [
      'La primera entrevista de Salvalo fue en la radio: el programa de Cheo Noguera en OK 101.5.',
      'Yo en el estudio; mi cofundador conectado desde Madrid.',
      'Lo expliqué con una panadería: hace diez cachitos, a las cuatro le quedan tres, y arma un pack con esos tres y dos panes.',
      'En el live preguntaron cómo descargarla, y Cheo la descargó ahí mismo, al aire.',
    ],
  },
  {
    key: 'events.ilc.body',
    where: 'Eventos · Charla con Pedro Vallenilla',
    ideas: [
      'En la hackathon vi a Pedro Vallenilla, fundador de Cashea, a través de una pantalla.',
      'Meses después vino a Barquisimeto, a una charla con el padre Elías Sayegh; quedamos en la segunda fila del teatro.',
      'Contó cómo fallaron varias de sus startups, con familia y endeudado, y aun así siguió.',
      'Me quedé con cómo habla de Venezuela: aquí queda muchísimo por construir.',
    ],
  },
  {
    key: 'events.alegria.body',
    where: 'Eventos · Hackathon de AlegrIA',
    ideas: [
      'Pastor, que estudió conmigo primaria y secundaria, me escribe: está con Ale y César en una hackathon y les falta uno.',
      'El Juan de antes habría dicho que no, por pena; esta vez pensé: lo peor es que no nos acepten.',
      'Armamos Tripealo, un marketplace de experiencias de viaje en Venezuela.',
      'De mil personas quedamos entre las cien que fueron a las oficinas de Yummy en Caracas.',
      'No ganamos, pero escuché a fundadores que hoy compiten en Silicon Valley y salí con el impulso para seguir.',
      'Hoy Tripealo y Salvalo están operando, y yo estoy de lleno con Salvalo, en modo founder.',
    ],
  },

  // Footer
  {
    key: 'footer',
    where: 'Despedida',
    ideas: [
      'Gracias por llegar hasta aquí.',
      'Si algo te dio curiosidad, escríbeme por LinkedIn o Instagram.',
      'Sigo construyendo, y sigo yendo por el platino.',
    ],
  },
];

/**
 * ENGLISH — a draft from the Spanish, line for line, in the same register:
 * spoken, with a filler where Juan's Spanish has one ("I mean", "well",
 * "right?"), never more.
 */
const SCRIPT_EN: Record<string, string[]> = {
  hero: [
    "Hi, I'm Juan Villa, a software developer.",
    'I like building software the way I like playing video games:',
    'going for the platinum.',
    "Since 2022 I've worked remotely at Crol,",
    'an ERP for businesses in Mexico,',
    'where I built their mobile app from scratch.',
    'I started out studying electronic engineering,',
    'and then a computer technician degree,',
    'but what taught me the most was building things.',
    "Here I'll tell you about everything I've worked on",
    'and what I think is worth highlighting:',
    'Sound Shaper, the app I made for myself',
    "that's coming to the App Store,",
    'my work, my startup,',
    'and the startup and developer events',
    "I've been to.",
    'Oh, and the site is in Spanish, English and Chinese.',
    'If you want to hear it in another language,',
    'switch it up top, in the navigation bar.',
    'The whole page is narrated.',
    "There's barely any text, because more than reading what I wrote,",
    'I wanted you to hear me.',
    'And yes, this is my real voice, not AI.',
  ],
  'shaper.problem': [
    'I used to listen to a lot of music on YouTube Music,',
    'with ads every few minutes.',
    'And when I liked a song,',
    'I wanted it in every version:',
    'normal, slowed, sped up, ultra slowed.',
    "And a lot of times I didn't even want the whole song, I mean,",
    'I wanted the thirty seconds I liked the most,',
    "and I'd play them again, and again, and again.",
  ],
  'shaper.solution': [
    'So I came up with Sound Shaper:',
    'an MP3 player that works without internet.',
    'I keep the original song just once,',
    'and from the app I make it slow, fast,',
    'add whatever effects I want',
    'and cut clips of my favorite parts.',
    'On YouTube a song is a video, and it sounds the way it is.',
    'Here, well, I choose how I hear it.',
  ],
  'shaper.s1.p1': [
    'This is your library.',
    "Heads up, the app doesn't download music:",
    'you upload your own MP3s, for your personal use,',
    'and you arrange them by hand, dragging them,',
    'in whatever order you like best.',
  ],
  'shaper.s1.p2': [
    'It works with what you already know from your phone:',
    'the Dynamic Island, the Lock Screen, widgets.',
    'And from here you get to Settings,',
    'like in the rest of my apps:',
    'your account, the language, the appearance',
    'and trophies, like PlayStation trophies.',
  ],
  'shaper.s2.p1': [
    'I based the player a lot on YouTube Music',
    'and Apple Music.',
    "It's a normal player, really, and that's fine:",
    'you play, pause and skip songs without thinking about it.',
  ],
  'shaper.s2.p2': [
    "What's different is down below:",
    'right from here you open Shape and Clips,',
    'which are, well, the reasons I made the app.',
  ],
  'shaper.s3.p1': [
    'Shape is the main reason the app exists.',
    "In fact, that's where the name comes from:",
    'Sound Shaper, the one that shapes sound.',
    'You get ready-made presets, or a manual equalizer',
    'if you know more about that kind of setting.',
    "And speed: I don't look for the slowed version anymore,",
    'I slow it down to exactly the level I want.',
  ],
  'shaper.s3.p2': [
    'Preserving the pitch was the most interesting part to build.',
    'On YouTube, if you slow a song down, the pitch changes,',
    'and the voice sounds like slow motion.',
    'Here you slow it down and the voice stays the same.',
    'And two effects I love:',
    "echo, like you're at a concert,",
    'and Next Room, like a party in the room next door.',
    'With headphones and your eyes closed, it really takes you there.',
  ],
  'shaper.s4.p1': [
    "I based Clips on Apple's Voice Memos,",
    'the same app I recorded the ideas for this site with.',
    'You pick the exact piece of the song',
    'that you like the most.',
  ],
  'shaper.s4.p2': [
    'You save it as a clip',
    'and listen to it again and again.',
    'And from here you can also open Shape,',
    'so that clip sounds your way.',
  ],
  'work.salvalo.body': [
    'Salvalo is my startup.',
    'Every day, shops close with products',
    'that could still have been sold.',
    'On Salvalo they turn them into packs,',
    'with a price and a pickup time.',
    'You find one nearby on the map, reserve it,',
    'pay the shop directly and pick it up with a code.',
    'I redesigned the whole app, for customers and for shops,',
    'and built the new website, which the team edits without code.',
    'And, well, I go out visiting shops',
    'for the pilot in Barquisimeto.',
  ],
  'work.crol.body': [
    "Since 2022 I've worked at Crol,",
    'a cloud ERP for businesses in Mexico.',
    'I started on Conto Pay, a simpler version of Crol,',
    'with its web app, its landing page and its mobile app.',
    'That app was the base for Crol ERP Móvil,',
    'which I built from scratch, design included,',
    'so you can use Crol comfortably from your phone.',
  ],
  'arcade.p1': [
    'Space Explorer started as an easter egg for my apps,',
    'like the one on Android, right?',
    'You tap the version a few times and a game shows up.',
    'It was going to have three levels, one per app:',
    'the sea, space and a space war.',
    'In the end I took it out to keep the apps simple.',
    "Months later came Platanus Hack's arcade challenge,",
    "and since I already had the idea, I said: okay, let's do it.",
    'A 3D shooter that fits in 50 KB.',
  ],
  'work.maktub.body': [
    'Maktub Art Fund is a client from Mexico',
    'I met through Crol.',
    'It was a landing page, and simple landings like that',
    'almost never catch my attention,',
    "but I liked this one's design, so I said: sure, I'll do it.",
  ],
  'work.andreina.body': [
    "Andreina Aular's website was the first one I made,",
    'right after finishing my first Udemy courses.',
    'I designed it myself in Figma, published it,',
    'kept updating it,',
    'and later we rebuilt it completely in WordPress.',
  ],
  'events.panal.body': [
    'El Panal is the movement Manuel Sira started,',
    'and I went to one of its nights in Barquisimeto.',
    'There were people building all kinds of things:',
    'marketing, fashion, CRMs, inventory systems,',
    'mental health and healthcare apps.',
    'The talks were about AI,',
    "about measuring your company's data so you can grow,",
    'and about standing out now that anyone can code:',
    "what's missing is taste.",
    'And look, every startup had exactly thirty seconds',
    'to pitch.',
    'I was nervous, but I pitched Salvalo,',
    'and left with new friends, contacts and a lead or two.',
    'There I met the team behind Resty, a healthcare app,',
    'and hung out with my founder bros from Tripealo:',
    'side by side, each on our own startup.',
    'Maybe a preview',
    "of what's coming at Startup Summit Caracas.",
  ],
  'events.radio.body': [
    "Salvalo's first interview was on the radio,",
    "on Cheo Noguera's show on OK 101.5.",
    'I went to the studio and my co-founder',
    'joined from Madrid.',
    'I explained it with a bakery:',
    'it bakes ten cachitos, at four it has three left,',
    'and it makes a pack with those three and two loaves.',
    'On the livestream people asked how to download it,',
    'and Cheo downloaded it right there, on air.',
  ],
  'events.ilc.body': [
    'At the hackathon I saw Pedro Vallenilla,',
    'the founder of Cashea, through a screen.',
    'Months later he came to Barquisimeto',
    'for a talk with Father Elías Sayegh,',
    'and we ended up in the second row of the theater.',
    'He told how several of his startups failed,',
    'with a family and in debt, and he still kept going.',
    'And what stayed with me is how he talks about Venezuela:',
    "there's so much left to build here.",
  ],
  'events.alegria.body': [
    'Pastor went to primary and high school with me.',
    "One day he texts me: look, Juan, I'm with Ale and César",
    'at a hackathon, and we need one more.',
    'The old Juan would have said no, out of shyness.',
    'This time I thought: the worst that can happen',
    "is that they don't accept us.",
    'We built Tripealo, a marketplace',
    'for travel experiences in Venezuela.',
    'Out of a thousand people, we made the hundred',
    "who went to Yummy's offices in Caracas.",
    "We didn't win, but I heard founders",
    'who compete in Silicon Valley today,',
    'and I came out with the push to keep going.',
    'Today Tripealo and Salvalo are both running,',
    "and I'm all in on Salvalo, in founder mode.",
  ],
  footer: [
    'Well, thanks for making it this far.',
    'If any of this made you curious,',
    'message me on LinkedIn or Instagram.',
    "I'm still building,",
    'and still going for the platinum.',
  ],
};

/**
 * CHINESE — a draft from the Spanish, in plain spoken Mandarin, with the
 * app's own Chinese names (塑形 for Shape, 片段 for Clips, 保持音高, 隔壁房间).
 * Brand and people's names stay in Latin letters. The teleprompter shows
 * each line's pinyin under it.
 */
const SCRIPT_ZH: Record<string, string[]> = {
  hero: [
    '你好，我是 Juan Villa，一名软件开发者。',
    '我做软件，就像我玩电子游戏一样：',
    '目标是白金奖杯。',
    '从 2022 年起，我远程在 Crol 工作，',
    '那是一套给墨西哥企业用的 ERP，',
    '我从零开始做了它的手机应用。',
    '我先学了电子工程，',
    '后来又学了计算机技术，',
    '但教会我最多的，是动手做东西。',
    '在这里，我会讲讲我做过的一切，',
    '还有我觉得值得一提的事：',
    '我给自己做的应用 Sound Shaper，',
    '它会上架 App Store，',
    '我的工作，我的创业公司，',
    '还有我参加过的',
    '创业和开发活动。',
    '对了，这个网站有西班牙语、英语和中文。',
    '如果你想换一种语言听，',
    '在上面的导航栏里切换就行。',
    '整个页面都有旁白。',
    '几乎没有文字，因为比起读我写的东西，',
    '我更想让你听我说。',
    '没错，这是我真实的声音，不是人工智能。',
  ],
  'shaper.problem': [
    '以前我常在 YouTube Music 上听歌，',
    '隔一会儿就有广告。',
    '我喜欢上一首歌的时候，',
    '就想要它的所有版本：',
    '原版、slowed、sped up、ultra slowed。',
    '而且很多时候，我其实不想听整首，',
    '我只想要最喜欢的那三十秒，',
    '然后一遍，一遍，又一遍地重复。',
  ],
  'shaper.solution': [
    '所以我想到了做 Sound Shaper：',
    '一个不用网络也能用的 MP3 播放器。',
    '原版的歌我只存一次，',
    '然后在应用里把它调慢、调快，',
    '加上我想要的音效，',
    '再把最喜欢的部分剪成片段。',
    '在 YouTube 上，歌是一个视频，原样播放。',
    '在这里，是我来决定怎么听。',
  ],
  'shaper.s1.p1': [
    '这是你的资料库。',
    '注意，这个应用不下载音乐：',
    '你上传自己的 MP3，自己使用，',
    '然后用手拖动来排列，',
    '排成你最喜欢的顺序。',
  ],
  'shaper.s1.p2': [
    '它用的是你在手机上早就熟悉的东西：',
    '灵动岛、锁定屏幕、小组件。',
    '从这里还能进入设置，',
    '跟我其他的应用一样：',
    '你的账户、语言、外观，',
    '还有奖杯，就像 PlayStation 的奖杯。',
  ],
  'shaper.s2.p1': [
    '播放器我参考了很多 YouTube Music',
    '和 Apple Music。',
    '说到底，它就是一个普通的播放器，这样就好：',
    '播放、暂停、切歌，都不用多想。',
  ],
  'shaper.s2.p2': [
    '不一样的地方在下面：',
    '就在这里，你可以打开塑形和片段，',
    '它们就是我做这个应用的原因。',
  ],
  'shaper.s3.p1': [
    '塑形是这个应用存在的最主要原因。',
    '其实，名字就是从这里来的：',
    'Sound Shaper，塑造声音。',
    '你可以用现成的预置，',
    '如果你更懂这些设置，也可以手动调均衡器。',
    '还有速度：我不再去找 slowed 版本了，',
    '我想慢到什么程度，就调到什么程度。',
  ],
  'shaper.s3.p2': [
    '保持音高是做起来最有意思的部分。',
    '在 YouTube 上，把歌放慢，音调就变了，',
    '人声听起来像慢动作。',
    '在这里，你把它放慢，人声还是原来的样子。',
    '还有两个我特别喜欢的音效：',
    '回声，就像你在听演唱会，',
    '还有隔壁房间，就像隔壁正在开派对。',
    '戴上耳机，闭上眼睛，真的会把你带过去。',
  ],
  'shaper.s4.p1': [
    '片段的灵感来自苹果的语音备忘录，',
    '这个网站的想法，我就是用它录下来的。',
    '你选出歌里',
    '你最喜欢的那一段。',
  ],
  'shaper.s4.p2': [
    '把它存成一个片段，',
    '然后一遍又一遍地听。',
    '在这里你也可以打开塑形，',
    '让这个片段照你的方式响起。',
  ],
  'work.salvalo.body': [
    'Salvalo 是我的创业公司。',
    '每天，商家打烊的时候，',
    '总有一些还能卖的商品。',
    '在 Salvalo 上，他们把这些商品做成套餐，',
    '定好价格和取货时间。',
    '你在地图上找到附近的一份，先预订，',
    '直接付款给商家，再凭取货码去领。',
    '我重新设计了整个应用，顾客端和商家端都有，',
    '还做了新的网站，团队不用写代码就能编辑。',
    '我也会出去拜访商家，',
    '为巴基西梅托的试点做准备。',
  ],
  'work.crol.body': [
    '从 2022 年起，我在 Crol 工作，',
    '那是一套给墨西哥企业用的云端 ERP。',
    '我一开始做的是 Conto Pay，一个更简单的 Crol，',
    '包括它的网页、落地页和手机应用。',
    '那个应用成了 Crol ERP Móvil 的基础，',
    '我从零开始做了它，设计也是我做的，',
    '让人在手机上也能轻松使用 Crol。',
  ],
  'arcade.p1': [
    'Space Explorer 一开始是给我的应用做的彩蛋，',
    '就像安卓的那个，对吧？',
    '你连续点几下版本号，就会出现一个游戏。',
    '本来要有三个关卡，一个应用一个：',
    '大海、太空，还有一场太空大战。',
    '最后我把它拿掉了，免得应用太复杂。',
    '几个月后，Platanus Hack 的街机挑战来了，',
    '我早就有这个想法，就说：好，做吧。',
    '一款只有 50 KB 的 3D 射击游戏。',
  ],
  'work.maktub.body': [
    'Maktub Art Fund 是墨西哥的一个客户，',
    '我是通过 Crol 认识他们的。',
    '那是一个落地页，这么简单的落地页，',
    '我一般不太感兴趣，',
    '但这个的设计我很喜欢，我就说：好，我来做。',
  ],
  'work.andreina.body': [
    'Andreina Aular 的网站是我做的第一个网站，',
    '那时我刚学完第一批 Udemy 课程。',
    '我自己在 Figma 里设计，把它上线，',
    '后来又做了几次更新，',
    '再后来我们用 WordPress 把它完全重做了。',
  ],
  'events.panal.body': [
    'El Panal 是 Manuel Sira 发起的一个运动，',
    '我去了他们在巴基西梅托的一个晚上。',
    '那里的人在做各种各样的东西：',
    '市场营销、时尚、CRM、库存系统，',
    '还有心理健康和医疗类的应用。',
    '讲座谈到了人工智能，',
    '谈到怎么衡量公司的数据来成长，',
    '也谈到现在人人都能写代码，',
    '怎么脱颖而出：缺的是品味。',
    '你看，每个创业公司只有整整三十秒',
    '来路演。',
    '我很紧张，但还是讲了 Salvalo，',
    '带走了新朋友、人脉，还有一两个潜在客户。',
    '在那里我认识了 Resty 的团队，一个医疗应用，',
    '还和 Tripealo 的创始人兄弟们待在一起：',
    '并肩站着，各做各的创业公司。',
    '也许这就是',
    'Startup Summit Caracas 的预告。',
  ],
  'events.radio.body': [
    'Salvalo 的第一次采访是在电台，',
    '在 OK 101.5 上 Cheo Noguera 的节目里。',
    '我去了录音室，我的联合创始人',
    '从马德里连线。',
    '我用一家面包店来解释：',
    '它做了十个 cachito，到四点还剩三个，',
    '就把这三个和两个面包配成一份套餐。',
    '直播里有人问怎么下载，',
    'Cheo 就在节目里当场下载了。',
  ],
  'events.ilc.body': [
    '在黑客松上，我是隔着屏幕',
    '看到 Cashea 的创始人 Pedro Vallenilla 的。',
    '几个月后，他来到巴基西梅托，',
    '和 Elías Sayegh 神父做了一场对谈，',
    '我们坐在剧院的第二排。',
    '他讲了自己好几家创业公司是怎么失败的，',
    '那时他有家庭，还欠着债，但还是坚持了下来。',
    '让我印象最深的，是他谈委内瑞拉的方式：',
    '这里还有太多东西可以去建造。',
  ],
  'events.alegria.body': [
    'Pastor 是我的小学和中学同学。',
    '有一天他给我发消息：Juan，我和 Ale、César',
    '在参加一个黑客松，我们还差一个人。',
    '以前的 Juan 会因为害羞说不。',
    '这一次我想：最坏的结果，',
    '也就是我们没被录取。',
    '我们做了 Tripealo，一个委内瑞拉',
    '旅行体验的交易平台。',
    '一千个人里，我们进了前一百，',
    '去了加拉加斯 Yummy 的办公室。',
    '我们没有赢，但我听到了',
    '如今在硅谷竞争的创始人的分享，',
    '也带着继续前进的动力回来了。',
    '现在 Tripealo 和 Salvalo 都在运营，',
    '我全身心投入 Salvalo，进入创始人模式。',
  ],
  footer: [
    '好了，谢谢你看到这里。',
    '如果这些让你有点好奇，',
    '可以在 LinkedIn 或 Instagram 上给我发消息。',
    '我还在继续做东西，',
    '也还在继续冲白金。',
  ],
};

const DRAFT =
  'Traducción vieja, línea por línea: falta pasarla a ideas antes de grabar.';

/** Every clip's script in one language, in the Spanish order and with
 *  its headings; a clip with no translation yet comes with no ideas. */
export const scriptsFor = (lang: ScriptLang): ScriptClip[] =>
  lang === 'es'
    ? SCRIPTS_ES
    : SCRIPTS_ES.map(c => ({
        ...c,
        ideas: (lang === 'en' ? SCRIPT_EN : SCRIPT_ZH)[c.key] ?? [],
        draft: DRAFT,
      }));
