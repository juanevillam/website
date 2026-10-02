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

  'shaper.problem':
    'I listened to my music on YouTube Music between too many ads, kept the same song in three or four versions — normal, slowed, sped up, ultra slow — and half the time I just wanted the 30 seconds I loved, on loop.',
  'shaper.solution':
    "An app where you add your MP3s and it works without internet: change the speed live, shape the equalizer and the effects — preserve pitch, echo, next room — and make clips of your favorite parts. It isn't another streaming app: no catalogue, no algorithm deciding for you. It's your music — the music you already have — sounding the way you want it.",
  'shaper.s1.p1':
    'Add your songs as MP3s and build your own library, each with its artwork and its info.',
  'shaper.s1.p2':
    "Everything lives on your phone and works fully offline, and it hooks into the system — Dynamic Island, widgets, the Lock Screen, the OS playback controls. Drag any cover to arrange the library your way; the one that's playing carries a quiet mark, so you never lose sight of it.",
  'shaper.s23.p1':
    "A player like the ones you already know — big artwork, clear controls, the screen tinted by the song's cover — with a bar underneath for what makes the app different: Shape, Clips and Edit.",
  'shaper.s23.p2':
    'Shape is the reason the app exists: pick a preset or set a five-band equalizer, change the speed while the song plays, and add effects like preserve pitch, echo and next room. Your settings carry over from one song to the next.',
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
  'topper.s23.p1':
    "Explore is where you find people worth following and everyone else's tops; search looks inside every item, so typing a game finds every top that ranks it.",
  'topper.s23.p2':
    'A top is a list you reorder by dragging, and the podium updates as you go. Other people can tap Agree or Could Be Better on your order, and the comments settle the rest.',
  'topper.s4.p1':
    'Your profile is every top you have made, with its top three in view.',
  'topper.s4.p2':
    'And trophies, PlayStation-style, that unlock as you use the app, all the way to the platinum.',

  // Space Explorer — the Platanus arcade entry, playable at the landing's foot.
  // The control keys are the cabinet's own; the action names are Apple-voice
  // labels. The game's own screens are the cabinet's, untranslated.
  'arcade.play': 'Play',
  'arcade.fullscreen': 'Full Screen',
  'arcade.resume': 'Click the game to keep playing.',
  'arcade.mobile':
    'Space Explorer needs a keyboard. Open this page on a computer to play.',
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
  'arcade.p2':
    "I'd wanted a game as this site's easter egg long before the challenge came along. The challenge gave me a deadline and a size limit; whether or not I win it, this is the game I set out to make.",

  // More Work — the secondary projects carousel, after the game. Job
  // titles and project names stay as they are in every locale.
  'work.title': 'More Work',
  'work.prev': 'Previous',
  'work.next': 'Next',
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
    'Too many ads, the same song in four versions, and all I wanted was 30 seconds on loop.',
  'shaper.solution.m':
    'So I made a player for your own MP3s: change the speed, shape the sound and keep the parts you love. Offline, no algorithm.',
  'shaper.s1.m':
    'Your MP3s, your library — offline, with widgets and Lock Screen controls.',
  'shaper.s23.m':
    'A familiar player, plus Shape: presets, a five-band equalizer, live speed and effects.',
  'shaper.s4.m':
    'Pick the seconds you love and save them as clips to loop anytime.',
  'topper.problem.m':
    'My rankings of games, movies and songs changed every week and got lost in group chats.',
  'topper.solution.m':
    'So I made an app for tops of anything: rank, follow people with taste and settle it in the comments.',
  'topper.s1.m': 'Your tops first, then the full order of everyone you follow.',
  'topper.s23.m':
    'Find people and tops in Explore; reorder yours with a drag and let others weigh in.',
  'topper.s4.m':
    'Your profile, your tops, and trophies all the way to the platinum.',
  'arcade.m.before': 'A 3D space shooter that fits in 50 KB, made for ',
  'arcade.m.after': ' — and the easter egg I always wanted for this site.',
  'work.crol.m.after':
    ', a cloud ERP for businesses in Mexico. I built it from scratch, design included.',
  'work.salvalo.m':
    "Shops sell surprise packs in their slow hours; you reserve and pick up. I built the app's interface, the landing and the panels.",
  'work.maktub.m':
    'A site for an art investment fund, built in a month and edited by its team without code.',
  'work.andreina.m': 'A WordPress site for a productivity coach.',
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

    'shaper.problem':
      'Escuchaba mi música en YouTube Music entre demasiados anuncios, guardaba la misma canción en tres o cuatro versiones — normal, slowed, sped up, ultra slow — y muchas veces solo quería los 30 segundos que me gustaban, en loop.',
    'shaper.solution':
      'Una app donde subes tus MP3 y funciona sin internet: cambias la velocidad en vivo, moldeas el ecualizador y los efectos — preservar el tono, eco, next room — y haces clips de tus partes favoritas. No es otra app de streaming: no hay catálogo ni algoritmo decidiendo por ti. Es tu música — la que ya tienes — sonando como tú quieres.',
    'shaper.s1.p1':
      'Subes tus canciones en MP3 y armas tu propia biblioteca, cada una con su ilustración y sus datos.',
    'shaper.s1.p2':
      'Todo vive en tu teléfono y funciona sin conexión, y se integra con el sistema: Dynamic Island, widgets, pantalla de bloqueo, los controles del OS. Arrastra cualquier portada para ordenar la biblioteca a tu manera; la que está sonando lleva una marca discreta, así nunca la pierdes de vista.',
    'shaper.s23.p1':
      'Un reproductor como los que ya conoces —portada grande, controles claros y la pantalla teñida con los colores de la portada— con una barra debajo para lo que hace distinta a la app: Moldear, Clips y Editar.',
    'shaper.s23.p2':
      'Moldear es la razón de ser de la app: eliges un preset o ajustas un ecualizador de cinco bandas, cambias la velocidad mientras suena la canción y sumas efectos como preservar el tono, eco y next room. Tus ajustes se mantienen de una canción a la siguiente.',
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
    'topper.s23.p1':
      'Explorar es donde encuentras gente que vale la pena seguir y los tops de todos los demás; la búsqueda mira dentro de cada elemento, así que escribes un juego y aparecen todos los tops que lo tienen.',
    'topper.s23.p2':
      'Un top es una lista que reordenas arrastrando, y el podio se actualiza al instante. Los demás pueden tocar De acuerdo o Podría mejorar en tu orden, y los comentarios deciden el resto.',
    'topper.s4.p1':
      'Tu perfil son todos los tops que has hecho, con sus tres primeros a la vista.',
    'topper.s4.p2':
      'Y trofeos, al estilo PlayStation, que se desbloquean mientras usas la app, hasta llegar al platino.',
    'arcade.play': 'Jugar',
    'arcade.fullscreen': 'Pantalla completa',
    'arcade.resume': 'Haz clic en el juego para seguir jugando.',
    'arcade.mobile':
      'Space Explorer necesita un teclado. Abre esta página en una computadora para jugar.',
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
    'arcade.p2':
      'Quería un juego como easter egg de esta página desde mucho antes del reto. El reto me dio una fecha límite y un límite de tamaño; gane o no, este es el juego que quería hacer.',

    // More Work — the secondary projects carousel.
    'work.title': 'Más proyectos',
    'work.prev': 'Anterior',
    'work.next': 'Siguiente',
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
      'Demasiados anuncios, la misma canción en cuatro versiones, y yo solo quería 30 segundos en loop.',
    'shaper.solution.m':
      'Así que hice un reproductor para tus MP3: cambia la velocidad, moldea el sonido y guarda tus partes favoritas. Sin internet y sin algoritmo.',
    'shaper.s1.m':
      'Tus MP3, tu biblioteca: sin internet, con widgets y controles en la pantalla bloqueada.',
    'shaper.s23.m':
      'Un reproductor conocido, más Moldear: presets, ecualizador de cinco bandas, velocidad en vivo y efectos.',
    'shaper.s4.m':
      'Elige los segundos que te encantan y guárdalos como clips para repetirlos cuando quieras.',
    'topper.problem.m':
      'Mis rankings de juegos, películas y canciones cambiaban cada semana y se perdían en chats de grupo.',
    'topper.solution.m':
      'Así que hice una app de tops de lo que sea: ordena, sigue a gente con buen gusto y discútelo en los comentarios.',
    'topper.s1.m':
      'Primero tus tops, luego el orden completo de quienes sigues.',
    'topper.s23.m':
      'Encuentra gente y tops en Explorar; reordena los tuyos arrastrando y deja que otros opinen.',
    'topper.s4.m': 'Tu perfil, tus tops y trofeos hasta llegar al platino.',
    'arcade.m.before':
      'Un shooter espacial en 3D que cabe en 50 KB, hecho para el ',
    'arcade.m.after': ' — y el easter egg que siempre quise para esta página.',
    'work.crol.m.after':
      ', un ERP en la nube para empresas en México. La construí desde cero, diseño incluido.',
    'work.salvalo.m':
      'Los comercios venden packs sorpresa en sus horas lentas; reservas y retiras. Hice la interfaz de la app, la landing y los paneles.',
    'work.maktub.m':
      'El sitio de un fondo de inversión en arte, hecho en un mes y editado por su equipo sin código.',
    'work.andreina.m': 'Un sitio en WordPress para una coach de productividad.',
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

    'shaper.problem':
      '我在 YouTube Music 听歌，广告太多；同一首歌存三四个版本——正常、slowed、sped up、ultra slow——而很多时候我只想循环最爱的那 30 秒。',
    'shaper.solution':
      '一个应用：加入你的 MP3，不用网络就能用——实时改变速度，亲手调均衡器和音效（保持原调、回声、Next Room），把最喜欢的部分做成片段。它不是又一个流媒体应用：没有曲库，也没有替你做决定的算法。它是你的音乐——你已经拥有的音乐——照你想要的样子响起。',
    'shaper.s1.p1':
      '把歌曲以 MP3 加入，建立你自己的资料库，每一首都带着插图和信息。',
    'shaper.s1.p2':
      '一切都存在你的手机里，完全离线可用，并且接入系统：灵动岛、小组件、锁定屏幕、系统播放控制。拖动任意封面，按你的方式排列资料库；正在播放的那首带着一个低调的标记，让你永远不会找不到它。',
    'shaper.s23.p1':
      '一个你早已熟悉的播放器：大封面、清晰的控制，整个屏幕染上歌曲封面的颜色；下方一条栏放着这个应用与众不同的地方——塑形、片段、编辑。',
    'shaper.s23.p2':
      '塑形是这个应用存在的理由：选一个预设，或亲手调五段均衡器；在歌曲播放时改变速度，再加上保持原调、回声、Next Room 这些音效。你的设置会从一首歌延续到下一首。',
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
    'topper.s23.p1':
      '“探索”里能找到值得关注的人和其他所有人的榜单；搜索也会查看每个条目：输入一款游戏，就能找到所有收录它的榜单。',
    'topper.s23.p2':
      '榜单就是一份拖动即可重新排序的清单，领奖台会随之更新。其他人可以对你的排序轻点“赞同”或“可以更好”，剩下的交给评论来定。',
    'topper.s4.p1': '你的个人资料就是你做过的所有榜单，前三名一目了然。',
    'topper.s4.p2':
      '还有 PlayStation 风格的奖杯，随着你使用应用逐一解锁，直到白金。',
    'arcade.play': '开始游戏',
    'arcade.fullscreen': '全屏',
    'arcade.resume': '点按游戏画面即可继续。',
    'arcade.mobile': 'Space Explorer 需要键盘。请在电脑上打开此页面游玩。',
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
    'arcade.p2':
      '早在这个挑战出现之前，我就想给这个网站做一个游戏彩蛋。挑战给了我截止日期和大小限制；不管能不能赢，这都是我想做的那个游戏。',

    // More Work — the secondary projects carousel.
    'work.title': '更多作品',
    'work.prev': '上一个',
    'work.next': '下一个',
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
      '广告太多，同一首歌存了四个版本，而我只想循环那 30 秒。',
    'shaper.solution.m':
      '于是我做了一个播放你自己 MP3 的播放器：调速度、塑造声音、留住你最爱的片段。离线可用，没有算法。',
    'shaper.s1.m': '你的 MP3，你的资料库：离线可用，支持小组件和锁定屏幕控制。',
    'shaper.s23.m':
      '熟悉的播放器，再加上塑形：预设、五段均衡器、实时变速和音效。',
    'shaper.s4.m': '选出你最爱的几秒，存成片段，随时循环。',
    'topper.problem.m':
      '我对游戏、电影和歌曲的排名每周都在变，却总是淹没在群聊里。',
    'topper.solution.m':
      '于是我做了一个什么都能排的榜单应用：排序、关注有品味的人，在评论里争个高下。',
    'topper.s1.m': '先是你的榜单，然后是你关注的人的完整排序。',
    'topper.s23.m': '在“探索”里找人和榜单；拖动排序你的榜单，让别人来评。',
    'topper.s4.m': '你的个人资料、你的榜单，还有一路解锁到白金的奖杯。',
    'arcade.m.before': '一款只有 50 KB 的 3D 太空射击游戏，为 ',
    'arcade.m.after': '而做——也是我一直想给这个网站的彩蛋。',
    'work.crol.m.after':
      ' 的移动应用，一款面向墨西哥企业的云端 ERP。我从零打造，包括设计。',
    'work.salvalo.m':
      '商家在冷清时段出售惊喜包，你预订后到店自取。我负责应用界面、落地页和后台。',
    'work.maktub.m':
      '一家艺术投资基金的网站，一个月完成，团队无需写代码即可编辑。',
    'work.andreina.m': '为一位效率教练打造的 WordPress 网站。',
  },
};
