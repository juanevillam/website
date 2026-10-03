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
  // The store tag's status while an app has no listing (StoreBadges).
  'store.soon': 'Coming Soon',
  'legal.terms': 'Terms and Conditions',
  'legal.privacy': 'Privacy Policy',
  'legal.support': 'Support',
  'legal.delete': 'Delete Account',
  'links.legal': 'Legal',
  'links.help': 'Help',
  'legal.updated': 'Updated',
  // The 404 page — a title that names what happened, a body that says
  // what to do, and the way home.
  'notFound.title': 'Page Not Found',
  'notFound.body': "This page doesn't exist or has moved.",
  'notFound.home': 'Go to Home',

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
    'Pick the exact seconds you love: the whole song runs along the bottom, and a zoomed-in view on top lets you place the cut precisely.',
  'shaper.s4.p2':
    'Save them as clips you can loop anytime. Each clip stays attached to its song, and you can edit it, delete it or play it again whenever you want.',
  'topper.problem':
    'My favorite games, movies and songs lived in my head as rankings I changed every week, and the only place to share them was a group chat, where they scrolled away within the hour.',
  'topper.solution':
    'An app for tops of anything: rank what you love, follow people whose taste you trust, and settle the order in the comments. Like Letterboxd, but for every list you would make.',
  'topper.s1.p1':
    'The app opens on your tops, each one showing its number one as the cover.',
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

  // Space Explorer — the Platanus arcade entry, playable at the landing's foot.
  // The control keys are the cabinet's own; the action names are Apple-voice
  // labels. The game's own screens are the cabinet's, untranslated.
  'arcade.play': 'Play',
  'arcade.fullscreen': 'Full Screen',
  'arcade.resume': 'Click the game to play.',
  'arcade.rotate': 'Turn your phone sideways to continue.',
  'arcade.close': 'Close',
  'arcade.c.fly': 'Fly',
  'arcade.c.fire': 'Fire',
  'arcade.c.dash': 'Dash',
  'arcade.c.missile': 'Missile',
  'arcade.c.shield': 'Shield',
  'arcade.c.overdrive': 'Overdrive',
  'arcade.c.start': 'Start and pause',
  // One sentence around a link: before it, the link's words, after it.
  'arcade.p1.before': 'A 3D space shooter that fits in 50 KB, built for ',
  'arcade.p1.link': "Platanus Hack's arcade challenge",
  'arcade.p1.after':
    ': the best games get played on a real arcade cabinet at the hackathon in Caracas.',

  // More Work — the secondary projects carousel, after the game. Job
  // titles and project names stay as they are in every locale.
  'work.title': 'More Work',
  'deck.prev': 'Previous',
  'deck.next': 'Next',
  'work.present': 'Present',
  'work.cofounder': 'Co-founder',
  'work.freelance': 'Freelance',
  // One paragraph around a link to Crol; its clip is `work.crol.body`.
  'work.crol.before': 'The mobile app of ',
  'work.crol.link': 'Crol',
  'work.crol.after':
    ', a cloud ERP for small and mid-sized businesses in Mexico: sales, electronic invoicing, inventory and live financial reports. I built it from scratch, design included, and major clients across Mexico run on it.',
  'work.salvalo.body':
    "Local shops sell discounted surprise packs in their slow hours; you reserve in the app and pick it up in store. I rebuilt the app's interface, built the landing page and the shop and admin panels, and I'm out visiting the shops for the pilot in Barquisimeto.",
  'work.maktub.body':
    "The website of a fund that connects investors with art and cultural projects in Mexico and Latin America. I took it from zero to live in a month, and their team edits every text, image and video without code; they've published dozens of updates on their own.",
  'work.andreina.body':
    'A WordPress site for a productivity coach who helps people organize their week and grow their income.',

  // PHONE copy — the short version each block shows below 48rem. The
  // full paragraphs (and their narration) are desktop's.
  'shaper.problem.m':
    'I listened to music on YouTube Music between ads, kept each song in three versions — normal, slowed, sped up — and mostly wanted just my favorite 30 seconds, on loop.',
  'shaper.solution.m':
    'So I built Sound Shaper: add your own MP3s, change the speed live, shape the sound with an equalizer and effects, and save the parts you love as clips. All of it works offline.',
  'shaper.s1.m':
    'Add your MP3s and build your own library. It works offline, with widgets and Lock Screen controls.',
  'shaper.s2.m':
    'A player you already know, with Shape, Clips and Edit one tap away. Your settings carry over from song to song.',
  'shaper.s3.m':
    'The reason the app exists: presets or a five-band equalizer, live speed, and effects like preserve pitch and echo.',
  'shaper.s4.m':
    'Pick the exact seconds you love and save them as a clip you can loop anytime.',
  'topper.problem.m':
    'My favorite games, movies and songs lived in my head as rankings that changed every week, and in a group chat they were gone within the hour.',
  'topper.solution.m':
    'So I built Topper: rank anything you love, follow people whose taste you trust, and settle the order in the comments. Like Letterboxd, for any list.',
  'topper.s1.m':
    'The app opens on your tops. Below them, the full rankings of the people you follow.',
  'topper.s2.m':
    'Explore finds people worth following, and search finds every top that ranks a game, movie or song.',
  'topper.s3.m':
    'Reorder a top by dragging, and others can tap Agree or Could Be Better.',
  'topper.s4.m':
    "Your profile holds every top you've made, and PlayStation-style trophies up to the platinum.",
  'arcade.m.before': 'A 3D space shooter that fits in 50 KB, made for ',
  'arcade.m.after': ' — and the easter egg I always wanted for this site.',
  'work.crol.m.after':
    ', a cloud ERP for businesses in Mexico. I built it from scratch, design included.',
  'work.salvalo.m':
    "Local shops sell discounted surprise packs in their slow hours; you reserve in the app and pick up in store. I rebuilt the app's interface and built its landing and panels.",
  'work.maktub.m':
    'The website of a fund that invests in art across Latin America, live in a month; its team edits everything without code.',
  'work.andreina.m': 'A WordPress site for a productivity coach.',
  'events.title': 'Events',
  'events.hackathon': 'Hackathon',
  'events.alegria.when': 'October 2025',
  'events.alegria.body':
    "Venezuela's first vibe-coding hackathon: three days at Yummy's offices in Caracas, organized by AlegrIA. Between building with Cesar, Pastor and Ale, we heard the founders of [Yummy](yummy), [Cashea](cashea) and [Slash](slash) tell how they started. We didn't take a prize home. We took new friends, lessons from people who have done it, and a reminder of why I love building things with others.",
  'events.alegria.m':
    "Three days at Venezuela's first vibe-coding hackathon, in Caracas. No prize, but new friends and lessons from the founders of [Yummy](yummy), [Cashea](cashea) and [Slash](slash).",
  'events.talk': 'Talk',
  'events.ilc.when': 'September 2026',
  'events.ilc.body':
    "A conversation at Teatro Juares in Barquisimeto between Father Elías Sayegh and Pedro Vallenilla, co-founder of [Cashea](cashea). At the AlegrIA hackathon I'd heard his story through a screen; this time it was in the same room, and it landed differently. His first startup worked, the next ones didn't, one after another, and then came Cashea. His case for Venezuela stayed with me too: there may be no better place right now to build a tech product, because there is so much left to build.",
  'events.ilc.m':
    "Pedro Vallenilla of [Cashea](cashea), in person this time and in my city: one startup that worked, several that didn't, then Cashea, and why Venezuela is the place to build.",
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
    'store.soon': 'Próximamente',
    'legal.terms': 'Términos y condiciones',
    'legal.privacy': 'Política de privacidad',
    'legal.support': 'Soporte',
    'legal.delete': 'Eliminar cuenta',
    'links.legal': 'Legal',
    'links.help': 'Ayuda',
    'legal.updated': 'Actualizado',
    'notFound.title': 'Página no encontrada',
    'notFound.body': 'Esta página no existe o se movió.',
    'notFound.home': 'Ir al inicio',

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
      'Elige los segundos exactos que te encantan: abajo ves la canción entera y arriba un zoom para marcar el corte con precisión.',
    'shaper.s4.p2':
      'Guárdalos como clips para repetir en loop cuando quieras. Cada clip queda guardado con su canción, y puedes editarlo, eliminarlo o volver a escucharlo en cualquier momento.',
    'topper.problem':
      'Mis juegos, películas y canciones favoritas vivían en mi cabeza como rankings que cambiaba cada semana, y el único lugar para compartirlos era un chat de grupo, donde se perdían en una hora.',
    'topper.solution':
      'Una app de tops de lo que sea: ordenas lo que te encanta, sigues a gente con buen gusto y el orden se discute en los comentarios. Como Letterboxd, pero para cualquier lista que harías.',
    'topper.s1.p1':
      'La app abre en tus tops, cada uno con su número uno como portada.',
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
    'arcade.play': 'Jugar',
    'arcade.fullscreen': 'Pantalla completa',
    'arcade.resume': 'Haz clic en el juego para jugar.',
    'arcade.rotate': 'Gira tu teléfono para continuar.',
    'arcade.close': 'Cerrar',
    'arcade.c.fly': 'Volar',
    'arcade.c.fire': 'Disparar',
    'arcade.c.dash': 'Impulso',
    'arcade.c.missile': 'Misil',
    'arcade.c.shield': 'Escudo',
    'arcade.c.overdrive': 'Overdrive',
    'arcade.c.start': 'Empezar y pausar',
    // One sentence around a link: before it, the link's words, after it.
    'arcade.p1.before':
      'Un shooter espacial en 3D que cabe en 50 KB, hecho para el ',
    'arcade.p1.link': 'reto arcade de Platanus Hack',
    'arcade.p1.after':
      ': los mejores juegos se juegan en una máquina arcade real durante la hackathon en Caracas.',

    // More Work — the secondary projects carousel.
    'work.title': 'Más proyectos',
    'deck.prev': 'Anterior',
    'deck.next': 'Siguiente',
    'work.present': 'Actualidad',
    'work.cofounder': 'Cofundador',
    'work.freelance': 'Freelance',
    // One paragraph around a link to Crol; its clip is `work.crol.body`.
    'work.crol.before': 'La app móvil de ',
    'work.crol.link': 'Crol',
    'work.crol.after':
      ', un ERP en la nube para pymes en México: ventas, facturación electrónica, inventario y reportes financieros en tiempo real. La construí desde cero, diseño incluido, y hoy la usan clientes importantes en todo México.',
    'work.salvalo.body':
      'Los comercios locales venden packs sorpresa con descuento en sus horas lentas; reservas en la app y lo retiras en tienda. Rehice la interfaz de la app, hice la landing y los paneles de comercios y administración, y salgo a visitar comercios para el piloto en Barquisimeto.',
    'work.maktub.body':
      'El sitio de un fondo que conecta inversionistas con proyectos de arte y cultura en México y Latinoamérica. Lo llevé de cero a publicado en un mes, y su equipo edita cada texto, imagen y video sin código: ya han publicado decenas de actualizaciones por su cuenta.',
    'work.andreina.body':
      'Un sitio en WordPress para una coach de productividad que ayuda a organizar la semana y aumentar los ingresos.',

    // Phone copy (see en).
    'shaper.problem.m':
      'Escuchaba música en YouTube Music entre anuncios, guardaba cada canción en tres versiones — normal, slowed, sped up — y casi siempre solo quería mis 30 segundos favoritos, en loop.',
    'shaper.solution.m':
      'Así que hice Sound Shaper: subes tus propios MP3, cambias la velocidad en vivo, moldeas el sonido con ecualizador y efectos, y guardas tus partes favoritas como clips. Todo funciona sin internet.',
    'shaper.s1.m':
      'Sube tus MP3 y arma tu propia biblioteca. Funciona sin conexión, con widgets y controles en la pantalla de bloqueo.',
    'shaper.s2.m':
      'Un reproductor que ya conoces, con Moldear, Clips y Editar a un toque. Tus ajustes pasan de canción en canción.',
    'shaper.s3.m':
      'La razón de ser de la app: presets o un ecualizador de cinco bandas, velocidad en vivo y efectos como preservar el tono y eco.',
    'shaper.s4.m':
      'Elige los segundos exactos que te encantan y guárdalos como un clip para repetir cuando quieras.',
    'topper.problem.m':
      'Mis juegos, películas y canciones favoritas vivían en mi cabeza como rankings que cambiaban cada semana, y en el chat de grupo se perdían en una hora.',
    'topper.solution.m':
      'Así que hice Topper: ordenas lo que te encanta, sigues a gente con buen gusto y el orden se discute en los comentarios. Como Letterboxd, para cualquier lista.',
    'topper.s1.m':
      'La app abre en tus tops. Debajo, los rankings completos de la gente que sigues.',
    'topper.s2.m':
      'En Explorar encuentras gente que vale la pena seguir, y la búsqueda halla cada top con un juego, película o canción.',
    'topper.s3.m':
      'Reordena un top arrastrando, y los demás pueden tocar De acuerdo o Podría mejorar.',
    'topper.s4.m':
      'Tu perfil guarda todos tus tops, y trofeos estilo PlayStation hasta el platino.',
    'arcade.m.before':
      'Un shooter espacial en 3D que cabe en 50 KB, hecho para el ',
    'arcade.m.after': ' — y el easter egg que siempre quise para esta página.',
    'work.crol.m.after':
      ', un ERP en la nube para empresas en México. La construí desde cero, diseño incluido.',
    'work.salvalo.m':
      'Los comercios venden packs sorpresa con descuento en sus horas lentas; reservas en la app y retiras en tienda. Rehice la interfaz de la app y construí su landing y paneles.',
    'work.maktub.m':
      'El sitio de un fondo que invierte en arte en Latinoamérica, en línea en un mes; su equipo lo edita todo sin código.',
    'work.andreina.m': 'Un sitio en WordPress para una coach de productividad.',
    'events.title': 'Eventos',
    'events.hackathon': 'Hackathon',
    'events.alegria.when': 'Octubre de 2025',
    'events.alegria.body':
      'El primer hackathon de vibe coding de Venezuela: tres días en las oficinas de Yummy en Caracas, organizado por AlegrIA. Entre construir junto a Cesar, Pastor y Ale, escuchamos a los fundadores de [Yummy](yummy), [Cashea](cashea) y [Slash](slash) contar cómo empezaron. No nos llevamos un premio. Nos llevamos amigos nuevos, lecciones de gente que ya lo hizo y un recordatorio de por qué me encanta construir con otros.',
    'events.alegria.m':
      'Tres días en el primer hackathon de vibe coding de Venezuela, en Caracas. Sin premio, pero con amigos nuevos y lecciones de los fundadores de [Yummy](yummy), [Cashea](cashea) y [Slash](slash).',
    'events.talk': 'Charla',
    'events.ilc.when': 'Septiembre de 2026',
    'events.ilc.body':
      'Una conversación en el Teatro Juares de Barquisimeto entre el Padre Elías Sayegh y Pedro Vallenilla, cofundador de [Cashea](cashea). En la hackathon de AlegrIA había escuchado su historia a través de una pantalla; esta vez fue en la misma sala, y se sintió distinto. Su primera startup funcionó, las siguientes no, una tras otra, y entonces llegó Cashea. También me quedé con su visión de Venezuela: quizás no hay mejor lugar ahora mismo para construir un producto tecnológico, porque queda muchísimo por construir.',
    'events.ilc.m':
      'Pedro Vallenilla de [Cashea](cashea), esta vez en persona y en mi ciudad: una startup que funcionó, varias que no, luego Cashea, y por qué Venezuela es el lugar para construir.',
  },
  zh: {
    'meta.title': 'juanevillam',
    'meta.description': '我做原生移动应用和网页产品。',
    visit: '访问',
    listen: '收听',
    pause: '暂停',
    'store.soon': '即将推出',
    'legal.terms': '条款与条件',
    'legal.privacy': '隐私政策',
    'legal.support': '支持',
    'legal.delete': '删除账户',
    'links.legal': '法律',
    'links.help': '帮助',
    'legal.updated': '更新于',
    'notFound.title': '找不到页面',
    'notFound.body': '此页面不存在或已移动。',
    'notFound.home': '前往首页',

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
    'shaper.s4.p1':
      '选出你最爱的那几秒：下方是整首歌，上方是放大视图，让你精准地截取。',
    'shaper.s4.p2':
      '把它们存成片段，随时循环播放。每个片段都跟着它的歌曲保存，你可以随时编辑、删除或再次播放。',
    'topper.problem':
      '我最爱的游戏、电影和歌曲，一直以排名的形式留在脑子里，每周都在变；唯一能分享的地方是群聊，不到一小时就被刷走了。',
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
    'arcade.play': '开始游戏',
    'arcade.fullscreen': '全屏',
    'arcade.resume': '点击游戏即可游玩。',
    'arcade.rotate': '横置手机以继续。',
    'arcade.close': '关闭',
    'arcade.c.fly': '飞行',
    'arcade.c.fire': '射击',
    'arcade.c.dash': '冲刺',
    'arcade.c.missile': '导弹',
    'arcade.c.shield': '护盾',
    'arcade.c.overdrive': '超载',
    'arcade.c.start': '开始与暂停',
    // One sentence around a link: before it, the link's words, after it.
    'arcade.p1.before': '一款只有 50 KB 的 3D 太空射击游戏，为 ',
    'arcade.p1.link': 'Platanus Hack 街机挑战',
    'arcade.p1.after':
      '而做：最好的作品会在加拉加斯的黑客松现场，放进一台真正的街机里供人游玩。',

    // More Work — the secondary projects carousel.
    'work.title': '更多作品',
    'deck.prev': '上一个',
    'deck.next': '下一个',
    'work.present': '至今',
    'work.cofounder': '联合创始人',
    'work.freelance': '自由职业',
    // One paragraph around a link to Crol; its clip is `work.crol.body`.
    'work.crol.before': '',
    'work.crol.link': 'Crol',
    'work.crol.after':
      ' 的移动应用。Crol 是一款面向墨西哥中小企业的云端 ERP：销售、电子发票、库存和实时财务报表。我从零开始打造了它，包括设计，如今墨西哥各地的大客户都在使用。',
    'work.salvalo.body':
      '本地商家在客流少的时段出售折扣惊喜包：你在应用里预订，再到店自取。我重做了应用界面，搭建了落地页以及商家和管理后台，还亲自走访商家，推进在巴基西梅托的试点。',
    'work.maktub.body':
      '一家基金的网站，连接投资者与墨西哥和拉丁美洲的艺术与文化项目。我在一个月内把它从零做到上线；他们的团队无需写代码就能编辑每段文字、图片和视频，上线后已自行发布了数十次更新。',
    'work.andreina.body':
      '为一位效率教练打造的 WordPress 网站，她帮助人们规划每周、提升收入。',

    // Phone copy (see en).
    'shaper.problem.m':
      '我在 YouTube Music 听歌总被广告打断，每首歌都存了三个版本——原速、slowed、sped up——而大多数时候我只想循环最爱的那 30 秒。',
    'shaper.solution.m':
      '于是我做了 Sound Shaper：导入你自己的 MP3，实时调速，用均衡器和音效塑造声音，再把最爱的部分存成片段。全部离线可用。',
    'shaper.s1.m':
      '导入你的 MP3，建立自己的资料库。离线可用，支持小组件和锁定屏幕控制。',
    'shaper.s2.m':
      '一个你早已熟悉的播放器，塑形、片段、编辑一点即达。你的设置会延续到下一首歌。',
    'shaper.s3.m':
      '这个应用存在的理由：预设或五段均衡器、实时变速，以及保持原调、回声等音效。',
    'shaper.s4.m': '选出你最爱的那几秒，存成片段，随时循环。',
    'topper.problem.m':
      '我最爱的游戏、电影和歌曲在我脑中排成每周都在变的榜单，发到群聊里，一小时就被刷没了。',
    'topper.solution.m':
      '于是我做了 Topper：给你喜爱的任何东西排名，关注品味可信的人，在评论里决出顺序。就像 Letterboxd，但适用于任何榜单。',
    'topper.s1.m': '应用一打开就是你的榜单，下面是你关注的人的完整排名。',
    'topper.s2.m':
      '在“探索”里找到值得关注的人；搜索能找出收录某款游戏、电影或歌曲的每个榜单。',
    'topper.s3.m': '拖动即可为榜单重新排序，其他人可以轻点“赞同”或“可以更好”。',
    'topper.s4.m':
      '你的个人资料收录你做过的所有榜单，还有一路解锁到白金的 PlayStation 风格奖杯。',
    'arcade.m.before': '一款只有 50 KB 的 3D 太空射击游戏，为 ',
    'arcade.m.after': '而做——也是我一直想给这个网站的彩蛋。',
    'work.crol.m.after':
      ' 的移动应用，一款面向墨西哥企业的云端 ERP。我从零打造，包括设计。',
    'work.salvalo.m':
      '本地商家在冷清时段以折扣出售惊喜包，你在应用里预订、到店自取。我重做了应用界面，并打造了落地页和后台。',
    'work.maktub.m':
      '一家投资拉丁美洲艺术的基金的网站，一个月上线；团队无需代码即可编辑全部内容。',
    'work.andreina.m': '为一位效率教练打造的 WordPress 网站。',
    'events.title': '活动',
    'events.hackathon': '黑客松',
    'events.alegria.when': '2025 年 10 月',
    'events.alegria.body':
      '委内瑞拉第一场 vibe coding 黑客松：由 AlegrIA 主办，在加拉加斯 Yummy 的办公室里度过三天。我和 Cesar、Pastor、Ale 一起开发，也听 [Yummy](yummy)、[Cashea](cashea) 和 [Slash](slash) 的创始人讲述他们如何起步。我们没有拿奖，却带走了新朋友、过来人的经验，也再次想起我为什么喜欢和别人一起创造。',
    'events.alegria.m':
      '在加拉加斯参加委内瑞拉第一场 vibe coding 黑客松的三天。没有拿奖，却交到新朋友，也从 [Yummy](yummy)、[Cashea](cashea) 和 [Slash](slash) 的创始人那里学到很多。',
    'events.talk': '讲座',
    'events.ilc.when': '2026 年 9 月',
    'events.ilc.body':
      '在巴基西梅托的 Juares 剧院，Elías Sayegh 神父与 [Cashea](cashea) 联合创始人 Pedro Vallenilla 的一场对谈。在 AlegrIA 黑客松上，我是隔着屏幕听他的故事；这一次同处一室，感受完全不同。他的第一家创业公司成功了，之后的却接连失败，然后才有了 Cashea。他对委内瑞拉的看法也让我难忘：此刻也许没有比这里更适合打造科技产品的地方，因为还有太多东西等着被建造。',
    'events.ilc.m':
      '这次在我的城市亲耳听 [Cashea](cashea) 的 Pedro Vallenilla 讲：一次成功的创业，接连几次失败，然后是 Cashea，以及为什么委内瑞拉是创造的好地方。',
  },
};
