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
 * Spanish is the source, and its ideas follow what Juan actually said in
 * the recorded takes (2026-10-17), so a re-recording needs little change.
 * English (SCRIPT_EN) is the exception: READ word for word, translated
 * from those takes. Chinese (SCRIPT_ZH) is still the 2026-10-16 draft of
 * the old Spanish lines, and is redone from the takes before its block —
 * the teleprompter marks it as a draft.
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
      'Hola, soy Juan Villa, desarrollador de software.',
      'Hago software como me gusta jugar videojuegos: yendo por el platino.',
      'Desde 2022 trabajo remoto para empresas en México, y clientes en España y Argentina.',
      'Empecé ingeniería electrónica, luego técnico en informática; lo que más me enseñó fue construir cosas.',
      'Aquí vas a ver apps hechas por mí, para mí, que igual están en las tiendas; mi trabajo; mi startup, Salvalo; y los eventos de emprendimiento y desarrollo en los que he estado.',
      'La página está en español, inglés y chino: cámbiala arriba a la derecha. (Grabar el chino fue súper difícil.)',
      'Toda está narrada y los subtítulos salen mientras suena: para leerla, escúchala; si quieres, bájale el volumen.',
      'Esta es mi voz real, no inteligencia artificial. Bienvenido.',
    ],
  },

  // Sound Shaper
  {
    key: 'shaper.problem',
    where: 'Sound Shaper · el problema',
    ideas: [
      'Escuchaba música en YouTube Music, con anuncios a cada rato: anuncios, anuncios, anuncios.',
      'Si una canción me gustaba, la quería lenta, rápida, ultralenta, ultrarrápida.',
      'Y muchas veces solo quería treinta segundos: los del medio, los del principio, la mejor parte del final. Y la repetía, la repetía, la repetía.',
    ],
  },
  {
    key: 'shaper.solution',
    where: 'Sound Shaper · la idea',
    ideas: [
      'Por eso hice Sound Shaper: un reproductor de MP3 personal que funciona sin internet.',
      'Subes tu canción una vez y la pones lenta o rápida, con los efectos que quieras, con ecualizador, y haces clips de tus partes favoritas.',
      'En YouTube la canción suena como la subieron; aquí la subes, la modificas y tú escoges cómo la escuchas.',
    ],
  },
  {
    key: 'shaper.s1.p1',
    where: 'Sound Shaper · Library',
    shot: shot('shaper', 'ios-dark-home'),
    ideas: [
      'Esta es tu biblioteca.',
      'La app no descarga música: subes tus propios MP3, para tu uso personal.',
      'Los ordenas arrastrándolos, en el orden que quieras.',
    ],
  },
  {
    key: 'shaper.s1.p2',
    where: 'Sound Shaper · Library',
    shot: shot('shaper', 'ios-dark-home'),
    ideas: [
      'Funciona con widgets, pantalla de bloqueo y Dynamic Island.',
      'Desde aquí entras a Ajustes: tu cuenta, el idioma, la apariencia.',
      'Y un detallito: trofeos como los de PlayStation; mientras más la usas, más desbloqueas, hasta el preciado platino.',
    ],
  },
  {
    key: 'shaper.s2.p1',
    where: 'Sound Shaper · Player',
    shot: shot('shaper', 'ios-dark-player'),
    ideas: [
      'El reproductor, normal, como YouTube Music o Apple Music.',
      'Play, pausa y cambiar de canción.',
    ],
  },
  {
    key: 'shaper.s2.p2',
    where: 'Sound Shaper · Player',
    shot: shot('shaper', 'ios-dark-player'),
    ideas: [
      'Lo importante está en la barra de abajo: desde ahí abres Shape y Clips.',
      'Esas dos partes son la razón por la que existe la app.',
    ],
  },
  {
    key: 'shaper.s3.p1',
    where: 'Sound Shaper · Shape',
    shot: shot('shaper', 'ios-dark-shape'),
    ideas: [
      'De Shape viene el nombre: Sound Shaper, moldeador de sonidos (la app, no tú).',
      'Presets listos, o ecualizador manual si sabes más de música.',
      'Cambias la velocidad: lenta, rápida, como quieras.',
    ],
  },
  {
    key: 'shaper.s3.p2',
    where: 'Sound Shaper · Shape',
    shot: shot('shaper', 'ios-dark-shape'),
    ideas: [
      'Preservar el tono fue lo más curioso de construir: en YouTube, lenta, la voz suena en cámara lenta; aquí escoges que suene igual, al ritmo.',
      'Efectos como eco y next room, que se combinan: como si estuvieras en un concierto, en el estacionamiento del concierto, o oyendo la fiesta del vecino.',
      'Con audífonos y los ojos cerrados, te teletransporta.',
      'Ejemplo rápido: una canción jugando con los efectos (suena la música hasta el final).',
    ],
  },
  {
    key: 'shaper.s4.p1',
    where: 'Sound Shaper · Clips',
    shot: shot('shaper', 'ios-dark-clip'),
    ideas: [
      'Clips lo inspiré en Notas de Voz de Apple, la misma app con la que grabé las ideas de esta página.',
      'Escoges el pedazo de la canción que más te gusta, y listo.',
    ],
  },
  {
    key: 'shaper.s4.p2',
    where: 'Sound Shaper · Clips',
    shot: shot('shaper', 'ios-dark-clip'),
    ideas: [
      'Lo guardas como clip y lo escuchas una y otra y otra vez.',
      'Desde aquí también abres Shape, para que el clip suene a tu manera.',
    ],
  },

  // More Work
  {
    key: 'work.salvalo.body',
    where: 'Más proyectos · Salvalo',
    ideas: [
      'Soy cofundador de Salvalo, mi startup.',
      'Los comercios cierran cada día con productos que todavía se pueden vender; en Salvalo los vuelven packs con precio y horario de recogida.',
      'El cliente lo encuentra cerca en el mapa, lo aparta, le paga directo al comercio y lo recoge con un código.',
      'El ejemplo de siempre: una panadería con 10 cachitos en la mañana; a las 5 le quedan 3, y 2 panes franceses; arma un pack a precio de cierre.',
      'Gana el comercio (no pierde el producto, Salvalo es un canal de ventas extra) y gana el cliente (los mismos cachitos, en oferta, súper cómodo).',
      'Mi parte: cofundador técnico; rediseñé la app y la web, todo el frontend.',
      'Y soy quien representa a Salvalo en Venezuela: le hago pitch a los comercios y voy a los eventos.',
    ],
  },
  {
    key: 'work.crol.body',
    where: 'Más proyectos · Crol ERP Móvil',
    ideas: [
      'Desde 2022 trabajo en Crol, un ERP en la nube para empresas de México.',
      'Empecé con Conto Pay, una versión más simple de Crol: su web, su landing y su app móvil.',
      'Esa app fue la base de Crol ERP Móvil, que construí y diseñé desde cero.',
    ],
  },
  {
    key: 'arcade.p1',
    where: 'Más proyectos · Space Explorer',
    ideas: [
      'Space Explorer empezó como un easter egg para Sound Shaper: una combinación de taps en un sitio y se abría el juego.',
      'Iba a tener niveles: el mar, el espacio, una guerra espacial. Lo quité para no complicar la app.',
      'Meses después aplicamos a la hackathon de Platanus, que tenía un reto arcade: crear un videojuego. Ya tenía la idea.',
      'Un shooter espacial en 3D que cabe en 50 KB: no megas, 50 KB.',
      'Se juega aquí en la página y en la de Platanus. Por voto popular no ganó, pero a nivel técnico… igual quedó mega chulo.',
    ],
  },
  {
    key: 'work.maktub.body',
    where: 'Más proyectos · Maktub Art Fund',
    ideas: [
      'Maktub Art Fund: un cliente de México.',
      'Una landing; casi nunca me llaman la atención, pero el diseño era muy moderno, muy fashion, y la hice.',
      'Quedó bastante cool.',
    ],
  },
  {
    key: 'work.andreina.body',
    where: 'Más proyectos · Andreina Aular',
    ideas: [
      'La página de Andreina Aular fue la primera que hice, al terminar mis primeros cursos de programación, por allá en 2020.',
      'La diseñé completa yo en Figma, desde cero; la publiqué y le hice actualizaciones.',
      'Después se rehízo completa en WordPress y quedó mucho mejor, pero el esqueleto lo hice yo.',
    ],
  },

  // Events
  {
    key: 'events.panal.body',
    where: 'Eventos · El Panal',
    ideas: [
      'El Panal, el movimiento que creó Manuel Sira aquí en Barquisimeto: mucha gente construyendo de todo.',
      'Marketing, moda, CRM, inventarios, apps de psicología y de salud.',
      'Charlas: inteligencia artificial, crecer midiendo bien tus datos, y diferenciarte en la era de la IA: hace falta gusto.',
      'Cada startup tenía 30 segundos exactos de pitch; nervioso, di el de Salvalo. No el mejor, pero el primero oficial en un evento de ese calibre.',
      'Fui con mis amigos de Tripealo; salí con amigos nuevos, contactos y uno que otro lead.',
      'Quizás un adelanto del Startup Summit Caracas: vamos, aún no sabemos si con pitch. Esto fue la práctica de la práctica.',
    ],
  },
  {
    key: 'events.radio.body',
    where: 'Eventos · Entrevista en OK 101.5',
    ideas: [
      'La primera entrevista de Salvalo, en la radio: el programa de Cheo Noguera en OK 101.5 FM, Barquisimeto.',
      'Yo en el estudio; Abrahan, mi cofundador, conectado desde Madrid.',
      'El ejemplo de siempre: haces diez cachitos, a las cuatro te quedan tres, armas un pack.',
      'En el live preguntaban cómo descargarla, y explicamos qué es Salvalo para los oyentes.',
    ],
  },
  {
    key: 'events.ilc.body',
    where: 'Eventos · Charla con Pedro Vallenilla',
    ideas: [
      'En la hackathon de AlegrIA, organizada con Cashea y Yummy, vimos online una charla de Pedro Vallenilla, cofundador de Cashea.',
      'Meses después vino en persona a Barquisimeto, con el padre Elías Sayegh, con una charla más completa; quedamos en la segunda fila.',
      'Contó cómo fallaron varias de sus startups antes de Cashea, con familia y endeudado, y aun así siguió.',
      'Lo que más me quedó: Venezuela, por lo que ha pasado, es un greenfield; aquí faltan soluciones que en otros países ya existen.',
      'Por eso es el mejor momento para emprender. No en teoría: en la práctica.',
    ],
  },
  {
    key: 'events.alegria.body',
    where: 'Eventos · Hackathon de AlegrIA',
    ideas: [
      'Esta tiene más historia: Pastor, que estudió conmigo primaria y secundaria, me presenta a César y Ale; les faltaba uno para la hackathon.',
      'El Juan de antes habría dicho que no, por pena o flojera; esta vez pensé: lo peor es que no nos acepten, y mínimo aprendemos.',
      'De varias ideas ganó Tripealo, un marketplace de experiencias de viaje en Venezuela.',
      'De mil que aplicaron, quedamos entre los 100 que fueron a las oficinas de Yummy en Caracas.',
      'No ganamos, pero escuché a fundadores que hoy compiten en Silicon Valley, y salimos con el impulso de seguir.',
      'Ellos siguieron con Tripealo; yo con Abrahan, mi cofundador en Salvalo. Hoy las dos operan: mis founder bros, juntos pero no revueltos.',
      'Fue el punto de inflexión entre el Juan solo programador y el Juan cuasi emprendedor. Súper agradecido.',
    ],
  },

  // Footer
  {
    key: 'footer',
    where: 'Despedida',
    ideas: [
      'Gracias por escucharme.',
      'Si tienes algún comentario, escríbeme por LinkedIn o Instagram.',
      'Sigo construyendo, y sigo yendo por el platino.',
      '(Después del español toca inglés, y después chino: deséenme suerte.)',
    ],
  },
];

/**
 * ENGLISH — READ ALOUD, word for word (Juan, 2026-10-17): unlike the
 * Spanish ideas, these are lines, because free English runs long. They
 * are what Juan SAID in Spanish (the recorded takes' transcripts), put
 * into plain spoken English — read as if made up on the spot.
 */
const SCRIPT_EN: Record<string, string[]> = {
  hero: [
    "Hi, I'm Juan Villa, a software developer.",
    'I build software the way I like to play video games:',
    'going for the platinum.',
    "Since 2022 I've worked remotely for companies in Mexico,",
    'and with clients in Spain and Argentina.',
    'I started out studying electronic engineering,',
    'then computer science at a technical college,',
    'but what taught me the most was building things.',
    "Here you'll find apps I made by me, for me,",
    'that are in the app stores too; my work;',
    'my startup, which right now is Salvalo;',
    "and the startup and developer events I've been to.",
    'The site is in Spanish, English and Chinese —',
    'you can switch it at the top right.',
    'And honestly, recording the Chinese one was really hard.',
    'The whole page is narrated,',
    'and the subtitles appear as the audio plays,',
    'so to read it, you listen to it.',
    'You can always turn the volume down.',
    'And yes, this is my real voice, not AI.',
    'Welcome.',
  ],
  'shaper.problem': [
    'I used to listen to music on YouTube Music,',
    'and ads kept popping up all the time —',
    'ads, ads, ads.',
    'And a lot of times, when I liked a song,',
    'I wanted it slow, fast, ultra slow, ultra fast.',
    'And plenty of other times I only wanted thirty seconds:',
    'the middle, or the beginning, or the best part at the end.',
    'And of course I played it again, and again, and again.',
  ],
  'shaper.solution': [
    "That's why I made Sound Shaper:",
    'a personal MP3 player that works without internet.',
    'You upload your song once, and you can make it slow or fast,',
    'add any effects you want, use the equalizer,',
    'and make clips of your favorite parts.',
    'On YouTube, a song sounds the way it was uploaded.',
    'Here you upload it, you shape it,',
    'and you choose how you hear it.',
  ],
  'shaper.s1.p1': [
    'This is your library.',
    "The app doesn't download music:",
    'you upload your own MP3s, for your personal use,',
    'and you can drag them into whatever order you want.',
  ],
  'shaper.s1.p2': [
    'It works with widgets, the Lock Screen and the Dynamic Island.',
    'From here you also get to Settings,',
    'where you change your account, the language, the appearance.',
    "And there's a little extra: trophies, like PlayStation's.",
    'The more you use the app, the more you unlock,',
    'all the way to the precious platinum.',
  ],
  'shaper.s2.p1': [
    'This is the player — a normal one,',
    'like YouTube Music or Apple Music.',
    'You play, pause and change songs.',
  ],
  'shaper.s2.p2': [
    'What matters is in the bar at the bottom,',
    'where you open Shape and Clips.',
    'Those two are the whole reason the app exists.',
  ],
  'shaper.s3.p1': [
    'This is where the name comes from: Shape.',
    "You're a sound shaper —",
    'well, not you, the app.',
    'There are ready-made presets, and a manual equalizer',
    'if you know more about music.',
    'And you can change the speed:',
    'slow, fast, however you like.',
  ],
  'shaper.s3.p2': [
    'Preserving the pitch was the most interesting part to build.',
    'On YouTube, if you slow a song down,',
    'the voice sounds like slow motion.',
    'Here you can keep it sounding the same,',
    'at the pace of the beat.',
    'There are effects too, like Echo and Next Room,',
    'and you can combine them for some strange feelings:',
    "like you're at a concert, or in the concert's parking lot,",
    "or hearing the party your neighbor's throwing next door.",
    'Put on headphones, close your eyes,',
    'and it really takes you there.',
    "Here's a quick example of a song playing with the app's effects.",
  ],
  'shaper.s4.p1': [
    "For Clips I took inspiration from Apple's Voice Memos —",
    'the same app I recorded the ideas for this site with.',
    'You just pick the part of the song you like the most,',
    "and that's it.",
  ],
  'shaper.s4.p2': [
    'You save it as a clip and play it over and over again.',
    'From here you can open Shape too,',
    "so the clip you're making sounds your way,",
    'with your own shape.',
  ],
  'work.salvalo.body': [
    "I'm a co-founder of Salvalo — it's my startup.",
    'Every day, shops close with products they could still sell,',
    'and on Salvalo they turn them into packs,',
    'with a price and a pickup time.',
    'Customers find one nearby on the map, reserve it,',
    'pay the shop directly and pick it up with a code.',
    'The example I always use:',
    'a bakery bakes ten cachitos in the morning,',
    'and at five in the afternoon it has three left,',
    'plus two loaves of French bread.',
    'It makes a pack with them at a closing price.',
    'The shop wins: it sells what it would have lost,',
    'and Salvalo is one more sales channel.',
    'And the customer gets the same morning cachitos,',
    'in the afternoon, on sale, super easily.',
    "My part: I'm the technical co-founder.",
    'I redesigned the app and the website — all the frontend.',
    'And I represent Salvalo here in Venezuela,',
    'so I pitch to shops and go to every event in its name.',
  ],
  'work.crol.body': [
    "Since 2022 I've worked at Crol,",
    'a cloud ERP for businesses in Mexico.',
    'I started on Conto Pay, a much simpler version of Crol:',
    'its web app, its landing page and its mobile app.',
    'That same app became the base for Crol ERP Móvil,',
    'which I designed and built from scratch.',
  ],
  'arcade.p1': [
    'Space Explorer started as an easter egg for Sound Shaper:',
    'you tap a certain spot a certain way,',
    'and it opens as a game.',
    'It was going to have levels: the sea, space, a space war.',
    'I took it out to keep the app simple.',
    'Months later we applied to Platanus Hack,',
    'which had an arcade challenge: make a video game.',
    'I already had the idea, so I went for it.',
    "It's a 3D space shooter that fits in 50 KB —",
    'not megabytes: 50 KB.',
    'You can play it right here on this page,',
    "and on Platanus's official site.",
    "It didn't win the popular vote,",
    "but technically… it's still a super cool game.",
  ],
  'work.maktub.body': [
    'Maktub Art Fund is a client from Mexico.',
    'It was a landing page — those almost never catch my eye —',
    'but the design was really modern, really fashion,',
    'so I liked the idea and built it.',
    'It came out pretty cool.',
  ],
  'work.andreina.body': [
    "Andreina Aular's website was the first one I ever made,",
    'right after my first programming courses, back in 2020.',
    'I designed the whole thing myself in Figma, from scratch,',
    'published it and kept updating it.',
    'Later it was rebuilt in WordPress and got much better,',
    'but the skeleton was mine.',
  ],
  'events.panal.body': [
    'El Panal is a movement Manuel Sira started here in Barquisimeto:',
    'a lot of people building all kinds of things —',
    'marketing, fashion, CRMs, inventory,',
    'mental health and healthcare apps.',
    'The talks were about AI,',
    'growing your company by measuring your data right,',
    'and standing out in the age of AI,',
    'where what you need is taste.',
    'Every startup had exactly 30 seconds to pitch.',
    'I was nervous, but I pitched Salvalo.',
    "It wasn't my best pitch,",
    'but it was our first official one at an event of that level.',
    'I went with my friends from Tripealo,',
    'and left with new friends, new contacts and a lead or two.',
    'Maybe this is a preview of Startup Summit Caracas:',
    "we're going, we just don't know yet if we'll pitch.",
    'So this was the practice for the practice.',
  ],
  'events.radio.body': [
    "This was Salvalo's first interview, on the radio:",
    "Cheo Noguera's show on OK 101.5 FM in Barquisimeto.",
    'I was in the studio,',
    'and Abrahan, my co-founder, joined from Madrid.',
    'I used the usual example:',
    'you bake ten cachitos, at four you have three left,',
    'and you make a pack out of them.',
    'People on the livestream asked how to download it,',
    'and we explained what Salvalo is to everyone listening.',
  ],
  'events.ilc.body': [
    'At the AlegrIA hackathon, with Cashea and Yummy,',
    'we heard a talk online from Pedro Vallenilla,',
    'the co-founder of Cashea.',
    'Months later he came to Barquisimeto in person,',
    'with Father Elías Sayegh, with a fuller version of that talk,',
    'and we were literally in the second row.',
    'He told how several of his startups failed',
    'before the huge success of Cashea —',
    'with a family, in debt — and he still kept going.',
    'What stayed with me most is how he talks about Venezuela:',
    "after everything it's been through, it's a greenfield.",
    "Solutions other countries already have just aren't here yet.",
    'So this is the best moment to build a company here —',
    'not in theory: in practice.',
  ],
  'events.alegria.body': [
    'Okay, this one has more of a story.',
    'One day Pastor, who went to school with me since primary,',
    'texts me and introduces me to César and Ale:',
    'they were applying to a hackathon and needed one more.',
    'The old Juan would have said no —',
    "out of shyness, or laziness, I wouldn't have gone.",
    "But this time I thought: the worst that happens is they don't take us,",
    "and at the very least we'll learn a lot.",
    'We came up with a few ideas, and Tripealo won:',
    'a marketplace for travel experiences in Venezuela.',
    'Out of a thousand people who applied,',
    "we made the hundred who went to Yummy's offices in Caracas.",
    "We didn't win,",
    'but I heard founders who now compete in Silicon Valley',
    'against the top companies in the US,',
    'and we came out with the drive to keep going.',
    'They kept going with Tripealo,',
    'and I went on with Abrahan, my co-founder at Salvalo.',
    'Today Tripealo and Salvalo are both running,',
    "and I'm all in on Salvalo, in founder mode.",
    "They're my founder bros now: together, but each on our own.",
    'It was the turning point',
    'between the old Juan, just a programmer,',
    'and the Juan of now, almost a founder.',
    "I'm really grateful for it:",
    'I learned a lot from a lot of people, and about myself.',
  ],
  footer: [
    'Well, thanks for listening.',
    'If you have any thoughts, message me on LinkedIn or Instagram.',
    "I'm still building,",
    'and still going for the platinum.',
    'Spanish first, English now, Chinese next —',
    'wish me luck.',
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
  'Traducción vieja del guion anterior: falta rehacerla desde las tomas en español.';

/** Every clip's script in one language, in the Spanish order and with
 *  its headings; a clip with no translation yet comes with no ideas. */
export const scriptsFor = (lang: ScriptLang): ScriptClip[] =>
  lang === 'es'
    ? SCRIPTS_ES
    : SCRIPTS_ES.map(c => ({
        ...c,
        ideas: (lang === 'en' ? SCRIPT_EN : SCRIPT_ZH)[c.key] ?? [],
        draft: lang === 'zh' ? DRAFT : undefined,
      }));
