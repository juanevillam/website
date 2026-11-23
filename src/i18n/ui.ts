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
  'focus.close': 'Close',
  'share.copy': 'Copy Link',
  'share.copied': 'Copied',
  visit: 'visit',
  listen: 'Listen',
  pause: 'Pause',
  'soon.close': 'Dismiss',
  // The hero's greeting over the wordmark — the one word that shows at a
  // glance which language the page is in (as the GitHub profile's
  // "Hi · Hola · 你好").
  'hero.hi': 'Hi',
  // The store tag's status while an app has no listing (StoreBadges).
  'store.soon': 'Coming Soon',
  // The launch banner over the hero (LaunchBanner), while an app is new.
  'launch.new': 'New',
  'launch.shaper': 'Sound Shaper is now on the web.',
  'launch.get': 'Open It',
  'store.web': 'Open on the',
  'store.github': 'Source on',
  'hero.caption':
    "Hi, I am Juan Esteban Villa Mendoza and I love making software. I like to do it the way I like to play video games, and that is going for the platinum. I also think it is the closest thing you have to magic because if you can imagine something and find a way to create it, you can create literally anything. And if you combine that software with any hardware, you can create even cooler things. This is my website, and I hope you like it. I only set one challenge for myself while making it, and that was not to follow any references, zero, because I wanted to make it my own. The best way I found for that was to literally record myself and narrate every section. Here you will find projects, events I have been to, the things I like, and more things that I would like to share with you in the future. I hope you like it. Welcome.",
  'footer.social': 'Social',
  'footer.caption':
    "Thank you very much for visiting my website. I was really happy to build it. I hope you find it really fun to hear me, to see me, to experience this whole website. I will continue building things and trying to get the beloved platinum. I also forgot to say I am really sorry for my English. I think my pronunciation is okay sometimes, but my grammar has many errors, that's just the way I speak English right now. I am pretty sure I will improve, since I am a Spanish speaker and English is the second language I want to bring to a native level. So right now, the way you hear me is the worst you will ever hear me speaking English, because in the future it will be way better. Thank you, and that's it.",
  'song.listen': 'Watch the Demo',
  'song.teaser': 'Hear DÁKITI in Sound Shaper',
  'legal.terms': 'Terms and Conditions',
  'legal.privacy': 'Privacy Policy',
  'legal.support': 'Support',
  'legal.delete': 'Delete Account',
  'links.legal': 'Legal',
  'links.help': 'Help',
  'legal.updated': 'Updated',
  // A document's table of contents (Prose) — Apple's word for it.
  'legal.contents': 'Contents',
  // The 404 page — a title that names what happened, a body that says
  // what to do, and the way home.
  'notFound.title': 'Page Not Found',
  'notFound.body': "This page doesn't exist or has moved.",
  'notFound.home': 'Go to Home',

  'shaper.problem':
    'Look, I listened to a lot of music on YouTube Music, but ads kept popping up all the time. I would play a song in four versions: slow, really slow, fast, ultra fast, and I also liked listening only to the 20 seconds at the start of the song or the last 30 seconds at the end, and I would loop them, loop them, loop them with all those combinations.',
  'shaper.solution':
    "And that is why I made [Sound Shaper](github). It's an MP3 player that allows you to clip your songs, create clips of the best parts of the songs you like and loop them, not only the clips of one song, but all of your songs, so you can listen to the best parts of every song in your library and loop the clips. It also has Shape, that is why I named it Sound Shaper, because it lets you shape your sounds with full access to an equalizer and presets. It also has really cool filters like Echo and Next Room that make you feel like the song in your headphones is being played at a party, at a concert, or in a concert parking lot. It solved all the problems I had: when you lock your phone, the song keeps playing, it's free, there are no ads, and it is even open source. It is a way to express myself via software because this app is very personal to me. I made it for myself, and then I said, let's make it public and share it with everyone, like a painting you could keep at home, or share with others because it's a little piece of you that may be helpful for other people. I love Sound Shaper. I almost forgot: it has DJ Juan, which is me, literally as if I were your DJ shuffling or mixing your songs or a single song. I'm not only giving you an app to play your songs, I am also the DJ shuffling your set. I love it. Thank you.",
  'shaper.s1.p1':
    "This is your library. The app doesn't download music: you upload your MP3 files yourself, and here you can drag the sound tiles into the order you like to make it feel more your own.",
  'shaper.s1.p2':
    'It even has widgets, and from here you can navigate to the Settings screen to change the theme of the app and the language. It even has trophies like PlayStation trophies: the more you use the app, the more trophies it gives you until you reach the best trophy of them all, the beloved platinum.',
  'shaper.s2.p1':
    'This is the player, just like Apple Music or YouTube Music, and here you can play or pause the song, or go to the next or previous song.',
  'shaper.s2.p2':
    'But the most important part is in the bar below, from where you can access Shape and Clips.',
  'shaper.s3.p1':
    "This is where the name Sound Shaper comes from: you shape sound. As I mentioned, from here you can change the equalizer, the presets, the Echo and Next Room filters, and DJ Juan. And I almost forgot: from here you can also access the playback speed selector to make the sound fast, ultra fast, slow, or really slow, and preserve the pitch of the original song so it doesn't sound distorted like on YouTube Music at 0.5x. That is what it solves here. The Shape screen is the reason why Sound Shaper exists.",
  'shaper.s3.p2':
    "Building this screen was the most fun part of Sound Shaper. Here is an example of how DÁKITI by Bad Bunny sounds in Sound Shaper in DJ Juan mode, slowly changing the pace, the bass, and adding filters, though you can make even better sets with Sound Shaper. The parts of DÁKITI I like most in Sound Shaper are those hooks, and sorry for my whistling attempt. As I record all these videos, you get to see yourself getting more confident, and I can make this video longer simply because this is my first personal website, mine.",
  'shaper.s4.p1':
    "For Clips, I was very inspired by Apple's Voice Memos app, which is the app I use to record ideas for my website and for Sound Shaper instead of sending myself WhatsApp messages, I just record and transcribe them. From here it is really easy to create clips of the songs you like.",
  'shaper.s4.p2':
    "You save it as a clip and listen to it over and over again. Additionally, from here you can access Shape so you can mold the clips you're making and try them with different filters or presets. Thank you.",

  // Space Explorer — the Platanus arcade entry, featured alongside Sound Shaper.
  // The control keys are the cabinet's own; the action names are Apple-voice
  // labels. The game's own screens are the cabinet's, untranslated.
  'arcade.play': 'Play Game',
  'arcade.fullscreen': 'Full Screen',
  'arcade.resume': 'Click the game to play.',
  'arcade.rotate': 'Turn your phone sideways to continue.',
  'arcade.close': 'Close',
  // The easter eggs (lib/eggs): what a screen reader says for each link.
  'egg.ship': 'The ship from Space Explorer. Go to the game.',
  'egg.robot.tridi': "Tridi's robot, walking like a person. Open Tridi.",
  'arcade.c.fly': 'Fly',
  'arcade.c.fire': 'Fire',
  'arcade.c.dash': 'Dash',
  'arcade.c.missile': 'Missile',
  'arcade.c.shield': 'Shield',
  'arcade.c.overdrive': 'Overdrive',
  'arcade.c.start': 'Start and pause',
  // One sentence around a link: before it, the link's words, after it.
  'arcade.p1':
    "[Space Explorer](github) started as an easter egg for my apps: you would enter a specific place in Sound Shaper, tap a secret pattern, and it would open Space Explorer. The original idea was to have three main products, Sound Shaper and two others, each unlocking a level of Space Explorer so you would jump across my apps to complete it and earn the platinum trophy. Without leaving clues, though, very few people would have found it, so to keep Sound Shaper simple I put the game on standby. Right around that same time, we applied to [Platanus Hack](platanus) here in Caracas, at Yummy's headquarters, and they had a side quest to build an arcade game that fit in 50 kilobytes or less minified. I saw it as the best opportunity to finish Space Explorer and make it a real game. I studied the other editions of the hackathon and saw that most entries used pixel art because of the 50 KB limit. Since I don't do pixel art, I decided to go technical and push 50 KB as far as I could: I built a 3D space shooter with a huge infinite world, multiple enemies and levels, and even a black hole, following the cosmos theme I love, you can see more about that in More of Me. I probably spent more time and tokens crafting the original space-adventure melody, since I couldn't use copyrighted Star Wars music, than on some core game features. I also changed my setup for this video so it wouldn't get boring: behind me are the cap of the Venezuelan flag (real Venezuelans will know why this version is different) and the cap of Cardenales de Lara, the baseball team from Barquisimeto, my city. Space Explorer is a 50 KB 3D arcade space shooter with multiple levels, enemies, ship powers, and a black hole. You can play it right here on this page or on the official [Platanus Hack Arcade](arcade) page. I hope you like it.",

  // Deck controls & photo viewer labels.
  'deck.prev': 'Previous',
  'deck.next': 'Next',
  'photo.open': 'View Full Size',

  // Short summary copy (`….m`) used by social preview cards (`lib/links.ts`).
  'shaper.solution.m':
    'So I built [Sound Shaper](github): add your own MP3s, change the speed live, shape the sound with an equalizer and effects, and save the parts you love as clips. All of it works offline.',
  'events.title': 'Highlights',
  'events.arcade': 'Arcade Game',
  'events.arcade.when': 'Jul 2026',
  'events.hackathon': 'Hackathon',
  'events.alegria.when': 'Oct 2025',
  'events.alegria.body':
    "One afternoon, [Pastor](pastor), a friend of mine since elementary and high school, texted me after a while without talking to invite me as the fourth member of the team he was building with his college friends [César](cesar) and [Alejandro](ale) for the AlegrIA Hackathon 2025 in Caracas, at [Yummy](yummy)'s headquarters. The Juan from six months earlier probably would have said no out of laziness or fear of not even getting accepted, but this time I said yes because at the very least I would learn a lot and grow. Out of more than a thousand applicants, we made it into the 100 selected to go to Caracas. It was organized by Yummy, [Cashea](cashea), [Slash](slash), and AlegrIA Labs. We didn't win and didn't even make the top 10, but it was my first hackathon ever and I learned a ton, not only about how a hackathon works, since this one was focused on building a real startup in 36 to 48 hours, but also about myself and how I handle intense pressure and little sleep. We had online talks with Vicente Zavarce from Yummy and [Pedro Vallenilla](pedro) from Cashea, and Víctor Cárdenas from Slash was there live coaching us on our idea. Our Airbnb was right across from the Cubo Negro where Yummy's headquarters are, and I wouldn't change a single thing about that experience or my team. They gave us shirts, tote bags, caps, and keychains, but what I always keep most is the lanyard ID: ours says Tech Bros and Juan Villa, AlegrIA Labs. That hackathon accelerated my shift from being purely a technical employee to focusing on startups: in tech you can build products, but learning to sell them, market them, and build a company on top of them is another level. I'm really glad it happened, that was AlegrIA Hackathon 2025 in Caracas.",
  'events.alegria.m':
    "My first hackathon, in Caracas at [Yummy](yummy)'s headquarters with [Pastor](pastor), [César](cesar), and [Alejandro](ale). No prize, but talks from Yummy, [Cashea](cashea), and [Slash](slash) that pushed me into the startup world.",
  'events.summit': 'Summit',
  'events.platanus.when': 'Oct 2026',
  'events.platanus.body':
    "We were at the [Startup Venezuela Summit](summit) 2026 in Caracas, and right after it ended we went straight to [Platanus Hack](platanus) 2026, my second hackathon, and once again at [Yummy](yummy)'s headquarters. It was a full, exhausting week, yet compared to any normal week in 2026, that week in October was on a completely different scale. At the Startup Venezuela Summit you learn a ton from people building cool things, and right after it we jumped into Platanus Hack, where the technical level was much higher. We didn't win again, but the product we built was on another scale too, and the growth since my first hackathon a year earlier was clear: across those 36 hours I stayed calm and focused, and our team communication, again with [Pastor](pastor), [César](cesar), and [Alejandro](ale), was way better. We met so many new people and made great friends at both the Summit and the hackathon. Platanus Ventures runs these hackathons to spot strong technical talent, and in 2026 they did a Latin America tour across Argentina, Mexico, Colombia, and Caracas, and the technical level in Caracas was amazing. One takeaway that really stuck with me from that week is that everyone has the same 24 hours a day: building a startup takes 12 to 16 hours a day either way, and while some people solve regional problems, which is great, others aim for global scale. I think of life like a baseball game when it's your turn at bat and you only get one shot: would you aim for first base or swing for a home run? You should aim for the home run. Why build something small when you can try to change the world? From those two events I also kept both lanyards: the Startup Venezuela Summit one, and the Platanus Hack card that fits in your wallet with an NFC chip I customized to open juanevillam.com. I'm collecting them like Infinity Stones. I wouldn't change a single second of that week.",
  'events.platanus.m':
    "One packed week in Caracas: [Startup Venezuela Summit](summit) followed straight by [Platanus Hack](platanus) at [Yummy](yummy)'s headquarters, higher technical level, new friends, and swinging for the home run.",
  'likes.title': 'More of Me',
  'likes.cosmos.name': 'Cosmos',
  'likes.cosmos.body':
    "Space has always fascinated me: when you look at it or try to understand it, the scale is amazing. Everything that has happened in human history happened on planet Earth, one of the planets in the solar system, which is one of many systems in the Milky Way galaxy, which is one of many galaxies in our cluster, inside a megacluster and superclusters beyond. Thinking about that puts you in your place, not even as a human, just as a living being, because out there all of that is happening while here people are happy, sad, healthy, sick, being born, dying, graduating, or getting married. I believe that ever since humanity discovered fire, we were destined to create beings more advanced than us, AI, and there is no nobler mission for humanity than becoming multi-planetary, multi-galactic, and eventually spanning sectors of the universe like Star Wars. I always say I would have loved to be born in the year 10,000 or 1,000,000 instead of the 2000s. Unless something catastrophic happens, there is no limit in the stars. To truly achieve that, though, humanity has to pursue immortality because we are a complex mind inside a very fragile body, you can die just from falling down the stairs. The closest star beyond the Sun is four light-years away, eight round-trip, and there are countless stars in the observable universe. Rather than medicine, the path to immortality might be extracting your consciousness into a replicated supercomputer so if your physical robot avatar is destroyed in an accident, your mind simply loads into another one and you can truly explore the cosmos. Here are the [James Webb](webb) and [Hubble](hubble) photos I love: when I first got into space I could stare at them for hours listening to music, one by one. For me there is nothing more real than these images. You can get to know me more by understanding these photos than from any social media post. Becoming a universal species is the greatest mission humanity can have, with immortality as a fun side quest. I hope you love these photos as much as I do.",
  // More of Me's Songs card and its player (SongsPlayer): the Shape
  // sheet's words are Sound Shaper's own (its i18n/translations.ts).
  'likes.songs.name': 'Songs',
  'likes.songs.meta': 'My Ranking',
  'likes.songs.body':
    "Here I share some of my favorite songs, my top songs, since I always love making top lists, plus extra tracks I keep in my personal library just for fun. The genre is something like techno, or what I like to call a cybernetic style, and the fewer lyrics a song has, the more I like it: I love when there are no vocals at all, just music. From here you can preview [Sound Shaper](shaper) the same way you can play Space Explorer on this site. You can download the app or use it on the web, and right here you can try playing and shaping all these songs, including DJ Juan. You can't create clips or earn trophies here, but it's still really fun. I hope you like it.",
  'songs.top': 'My Top',
  'songs.more': 'More Songs',
  'songs.library': 'Songs',
  'shape.none': 'None',
  'shape.pitchOff': 'Pitch Off',
  'songs.expand': 'Open Player',
  'songs.fullScreen': 'Full Screen',
  'songs.powered': 'Powered by Sound Shaper',
  'songs.with': 'Made with',
  'songs.list': 'My Top Songs',
  'songs.play': 'Play',
  'songs.pause': 'Pause',
  'songs.prev': 'Previous Song',
  'songs.next': 'Next Song',
  'songs.seek': 'Position',
  'shape.title': 'Shape',
  'shape.done': 'Done',
  'shape.presets': 'Presets',
  'shape.custom': 'Custom',
  'shape.levels.off': 'Off',
  'shape.levels.low': 'Low',
  'shape.levels.medium': 'Medium',
  'shape.levels.high': 'High',
  'eq.title': 'Equalizer',
  'eq.hint': 'Bass on the left, treble on the right.',
  'eq.presets.flat': 'Flat',
  'eq.presets.bass': 'Bass',
  'eq.presets.vocal': 'Vocal',
  'eq.presets.treble': 'Treble',
  'eq.presets.warm': 'Warm',
  'eq.presets.bright': 'Bright',
  'shape.speed': 'Playback Speed',
  'shape.keepPitch': 'Preserve Pitch',
  'shape.keepPitchDescription': 'Keeps the original pitch at any speed.',
  'shape.echo': 'Echo',
  'shape.echoDescription': 'Adds a short repeat, so the sound arrives twice.',
  'shape.nextRoom': 'Next Room',
  'shape.nextRoomDescription':
    'Plays the sound as if it were coming from another room, muffled through a wall.',
  // Sound Shaper's own words (src/i18n/translations.ts there), with "your
  // library" made these songs: the set here is mixed from mine.
  'shape.autoDj': 'DJ Juan',
  'shape.autoDjDescription':
    'Mixes this song or all of these songs on the beat, differently every time.',
  'shape.autoDjPreparing': 'Reading Songs',
  'shape.autoDjProgress': '{ready} of {total}',
  'shape.autoDjMode.off': 'Off',
  'shape.autoDjMode.sound': 'This Song',
  'shape.autoDjMode.all': 'All Songs',
  'likes.photos.name': 'Photos',
  'likes.photos.meta': 'Life',
  'likes.photos.meta2': 'Travels',
  'likes.photos.body':
    'I basically stopped posting my photos and stories on social media to start sharing them here, because I want to centralize everything on this platform I built. So if you want to see my Instagram, here are my photos.',
  'photos.posts': 'posts',
  'photos.likes': 'likes',
  'photos.grid': 'Grid',
  'photos.feed': 'Feed',
  'photos.back': 'Grid',
  'photos.like': 'Like',
  'photos.doubleTap': 'Double-tap to like',
  'photos.gateTitle': 'Photos',
  'photos.gateBody':
    'Sign in with Google to see my photos.',
  'photos.gateName': 'Your name',
  'photos.gateEmail': 'your@email.com',
  'photos.gateContinue': 'Continue with Google',
  'photos.gateError': 'Could not verify your Google account. Try again.',
  'photos.lock': 'Sign out',
  'photos.mute': 'Mute or unmute video',
  'lang.zhNotice': 'Narration audio is in English, with Chinese subtitles.',
};

export type UIKey = keyof typeof en;

export const ui: Record<Locale, Record<UIKey, string>> = {
  en,
  es: {
    'meta.title': 'juanevillam',
    'meta.description': 'Hago apps móviles nativas y productos web.',
    'focus.close': 'Cerrar',
    'share.copy': 'Copiar enlace',
    'share.copied': 'Copiado',
    visit: 'visitar',
    listen: 'Escuchar',
    pause: 'Pausar',
    'soon.close': 'Cerrar',
    'hero.hi': 'Hola',
    'store.soon': 'Próximamente',
    'launch.new': 'Nuevo',
    'launch.shaper': 'Sound Shaper ya está en la web.',
    'launch.get': 'Ábrela',
    'store.web': 'Ábrela en la',
    'store.github': 'Código en',
    'hero.caption':
      'Hola, yo soy Juan Esteban Villa Mendoza y me encanta hacer software. Me gusta hacerlo como me gusta jugar videojuegos, y eso es yendo por el platino. Además, creo que es de las cosas más cercanas que hay a la magia, porque si te imaginas algo y encuentras la manera de hacerlo, puedes crear cosas muy cool. Y si ese software lo unes incluso con un hardware que hayas creado, puedes lograr cosas aún más geniales. Como dato curioso de esta página, la tenía pensada hacer desde hace mucho tiempo y solo tenía un reto: que fuese muy mía, muy personal, y la mejor manera de hacer eso es literalmente grabarla. Además, no vi ni una sola referencia porque quería hacerla muy mía. Tiene un estilo muy mío, todo está grabado y todas las secciones están narradas por mí. Aquí les voy a mostrar proyectos, eventos a los que he ido, mis gustos y otras cosas que seguramente quiera compartirles en el futuro. Espero que les guste. Bienvenidos.',
    'footer.social': 'Social',
    'footer.caption':
      'Bueno, muchas gracias por llegar hasta acá. La verdad estuvo bastante fino construir esta página. Espero que también haya sido fino para ustedes verla y experimentarla. Yo seguiré construyendo y tratando de llegar al platino.',
    'song.listen': 'Ver el demo',
    'song.teaser': 'Así suena DÁKITI en Sound Shaper',
    'legal.terms': 'Términos y condiciones',
    'legal.privacy': 'Política de privacidad',
    'legal.support': 'Soporte',
    'legal.delete': 'Eliminar cuenta',
    'links.legal': 'Legal',
    'links.help': 'Ayuda',
    'legal.updated': 'Actualizado',
    'legal.contents': 'Contenido',
    'notFound.title': 'Página no encontrada',
    'notFound.body': 'Esta página no existe o se movió.',
    'notFound.home': 'Ir al inicio',

    'shaper.problem':
      'Mira, yo escuchaba mucha música en YouTube Music, pero me salían anuncios a cada rato. Además, una misma canción la escuchaba en cuatro versiones: lenta, muy lenta, rápida y muy rápida. Y de paso, me gustaba poner en loop los 20 segundos de en medio porque eran los mejores, o los 30 segundos del final porque era lo único que me gustaba de la canción, y la repetía, la repetía y la repetía.',
    'shaper.solution':
      'Y por eso hice [Sound Shaper](github). Es un reproductor MP3 que te permite hacer clips de tus canciones y ponerlos en loop, tanto los clips de una canción como los de toda tu librería. Te permite moldear la manera en que escuchas tu música con presets preestablecidos, ecualizador manual y filtros de sonido bastante cool como Echo y Next Room, que hacen que la canción en tus audífonos suene como en una fiesta, un concierto o el estacionamiento de un concierto. Además tiene DJ Juan, literalmente como si yo fuera tu DJ haciendo mezclas aleatorias en la canción que escuchas o en shuffle con toda tu librería. Me soluciona todos los problemas que tenía: cuando apagas el celular la canción sigue sonando, no tiene anuncios, es gratis y de código abierto. Es una manera muy personal de expresar cómo hago software: esta aplicación la hice para mí, pero ya que estamos la hice pública para todos. Está muy cool, la verdad.',
    'shaper.s1.p1':
      'Esta es tu librería. La app no descarga música: tú subes tus archivos MP3 y por acá puedes arrastrarlos para ordenarlos de la manera que más te guste.',
    'shaper.s1.p2':
      'Tiene incluso widgets, y desde aquí puedes navegar a la pantalla de Settings para cambiar el tema de la aplicación y el idioma. Incluso tiene trofeos como los de PlayStation: mientras más utilizas la aplicación, más te recompensa hasta conseguir el mejor trofeo, el preciado platino.',
    'shaper.s2.p1':
      'Esta es la pantalla del reproductor, tal cual como YouTube Music o Apple Music: puedes dar pausa, play, canción anterior y canción siguiente.',
    'shaper.s2.p2':
      'Pero lo más importante está en la barra de abajo, desde donde accedes a Shape, moldear, y Clips.',
    'shaper.s3.p1':
      'De aquí viene el nombre de la aplicación, Sound Shaper, moldeador de sonidos en español, aunque en español suena muy mal. Como comenté antes, desde acá puedes cambiar los presets, el ecualizador, los filtros y DJ Juan. Y algo de lo más importante: desde aquí cambias el playback speed, la velocidad de reproducción, para poner la canción lenta, muy lenta, rápida o muy rápida preservando el tono original, así que está bastante fino.',
    'shaper.s3.p2':
      'Construir esta pantalla fue lo más divertido porque en YouTube, si pones una canción en 0.5x, se siente como en cámara lenta distorsionada y no me gustaba, y desde aquí se soluciona ese problema. Les dejo un ejemplo de cómo suena DÁKITI de Bad Bunny en Sound Shaper con el modo DJ Juan, que va tranquilo haciendo mezclas chulas, y de las mejores partes es la que dice "y de nosotros quién va a hablar si no nos dejamos ver". Desde aquí lo pueden escuchar.',
    'shaper.s4.p1':
      'Para Clips me inspiré mucho en Apple Voice Memos, la app con la que guardé las ideas para Sound Shaper y para este website: en vez de mandarme mensajes largos por WhatsApp, me grabo y después lo transcribo. Es muy parecida y muy cómoda para clipear las partes favoritas de tus canciones.',
    'shaper.s4.p2':
      'Lo guardas como clip y lo puedes escuchar una y otra vez. Además, desde aquí también accedes a Shape para moldear los clips que estás haciendo y probar cómo suenan con cada preset o filtro.',

    'arcade.play': 'Jugar',
    'arcade.fullscreen': 'Pantalla completa',
    'arcade.resume': 'Haz clic en el juego para jugar.',
    'arcade.rotate': 'Gira tu teléfono para continuar.',
    'arcade.close': 'Cerrar',
    'egg.ship': 'La nave de Space Explorer. Ir al juego.',
    'egg.robot.tridi':
      'El robot de Tridi, caminando como una persona. Abrir Tridi.',
    'arcade.c.fly': 'Volar',
    'arcade.c.fire': 'Disparar',
    'arcade.c.dash': 'Impulso',
    'arcade.c.missile': 'Misil',
    'arcade.c.shield': 'Escudo',
    'arcade.c.overdrive': 'Overdrive',
    'arcade.c.start': 'Empezar y pausar',
    // One sentence around a link: before it, the link's words, after it.
    'arcade.p1':
      '[Space Explorer](github) inició como un easter egg para mis aplicaciones: entrabas a una parte específica de Sound Shaper, dabas una combinación secreta de taps y se abría el modo juego. Iba a tener tres niveles repartidos entre tres proyectos principales, pero lo removí porque sin dejar pistas nadie lo iba a encontrar y sobrecomplicaba el proyecto. Justo en ese mismo tiempo aplicamos a [Platanus Hack](platanus) en Caracas, en las oficinas de Yummy, y como reto paralelo había que hacer un juego para su máquina de arcade física que pesara máximo 50 kilobytes en su versión minificada. Vi los juegos de otras ediciones del tour en Argentina, Colombia y México: casi todos usaban pixel art por el límite de 50 KB. Como nunca había hecho pixel art, me fui por lo técnico e hice un shooter 3D espacial con un mapa grande, distintos enemigos, varios niveles y hasta un agujero negro, siguiendo la temática del espacio que me encanta y que pueden ver en Más de mí. Lo puedes jugar aquí mismo, incluso en celular, o en la [página oficial de Platanus Hack Arcade](arcade). La musiquita fue un chiste: quería algo estilo Star Wars, así que adapté una melodía espacial movida y capaz pasé más tiempo en la música que en funciones core porque un juego de arcade tiene que tener buena música sí o sí. Si se fijan, cambié de setup para no aburrir: atrás tengo la gorra de la bandera de Venezuela (los venezolanos sabrán por qué esta versión es distinta) y la de Cardenales de Lara, de Barquisimeto, mi ciudad. En fin, Space Explorer es un shooter espacial 3D de arcade en 50 KB, infinito, con muchos enemigos y niveles. Espero que les guste.',

    // Deck controls & photo viewer labels.
    'deck.prev': 'Anterior',
    'deck.next': 'Siguiente',
    'photo.open': 'Ver en tamaño completo',

    // Short summary copy (see en).
    'shaper.solution.m':
      'Así que hice [Sound Shaper](github): subes tus propios MP3, cambias la velocidad en vivo, moldeas el sonido con ecualizador y efectos, y guardas tus partes favoritas como clips. Todo funciona sin internet.',
    'events.title': 'Destacados',
    'events.arcade': 'Juego arcade',
    'events.arcade.when': 'jul 2026',
    'events.hackathon': 'Hackathon',
    'events.alegria.when': 'oct 2025',
    'events.alegria.body':
      'Una tarde, [Pastor](pastor), un amigo mío de primaria y secundaria con quien tenía tiempo sin hablar, me escribió para proponerme ser el cuarto integrante de su equipo junto a [César](cesar) y [Alejandro](ale), amigos suyos de la universidad, para la AlegrIA Hackathon 2025 en Caracas. Organizada por [Yummy](yummy), [Cashea](cashea), [Slash](slash) y AlegrIA Labs, era de las primeras hackathons de ese calibre en Venezuela. Tal vez el Juan de seis meses antes habría dicho que no por pena, flojera o miedo a aplicar y no quedar, pero dije que sí porque como mínimo me llevaría muchos aprendizajes. Aplicaron más de mil personas y quedamos entre las 100 seleccionadas para ir a las oficinas de Yummy en Caracas. Era mi primera hackathon. No ganamos ni quedamos en el top 10, pero aprendí demasiado: era una hackathon muy enfocada en construir una startup real, un negocio coherente que se venda, y además aprendí muchísimo sobre mí mismo y cómo me desenvuelvo bajo presión constante y poco sueño. El equipo hizo match enseguida, nuestro Airbnb estaba justo frente al Cubo Negro y no cambiaría nada. Tuvimos ponencias de Vicente Zavarce y [Pedro Vallenilla](pedro) por videollamada, y a Víctor Cárdenas de Slash en vivo dándonos coaching. De la merch que nos dieron, gorras, llaveros, camisa, tote bag, lo que siempre guardo es el lanyard identificador: dice Juan Villa y Tech Bros, el nombre de nuestro equipo, y verlo me teletransporta a esos momentos. Fue un punto de adelanto hacia el Juan que quiere montar startups en vez de trabajar solo como empleado: si sabes de tecnología puedes crear productos digitales, pero tienes que salir a aprender cómo vender tus ideas. Eso fue la AlegrIA Hackathon 2025 en Caracas.',
    'events.alegria.m':
      'Mi primera hackathon, en las oficinas de [Yummy](yummy) en Caracas junto a [Pastor](pastor), [César](cesar) y [Alejandro](ale). Sin premio, pero con charlas de Yummy, [Cashea](cashea) y [Slash](slash) que me empujaron al mundo startup.',
    'events.summit': 'Summit',
    'events.platanus.when': 'oct 2026',
    'events.platanus.body':
      'Estuvimos en el [Startup Venezuela Summit](summit) 2026 en Caracas y, justo saliendo de ese evento, fuimos directo a la [Platanus Hack](platanus), mi segunda hackathon, y me dio risa porque las dos que he hecho han sido en las oficinas de [Yummy](yummy) en Caracas. Esta segunda tampoco la ganamos, con el mismo team 1%, pero aprendí aún más que en la anterior. Fue mucho más técnica: Platanus Ventures tiene su rama de hackathons y este 2026 hicieron un tour por Latinoamérica pasando por Argentina, Ciudad de México, Bogotá y Caracas, y el nivel técnico acá estuvo muy fino. Todo lo que aprendí en la anterior lo apliqué en esta: dominé el arte de pasar horas sin dormir manteniendo la mente calmada y enfocada en construir algo mucho más ambicioso. La organización estuvo increíble, hasta nos quedamos a dormir una noche en los headquarters de Yummy, con [Cashea](cashea) patrocinando de nuevo. Fue una semana súper cansada pero en otra escala: en el Startup Summit tuvimos charlas de [Pedro Vallenilla](pedro), Víctor Cárdenas de [Slash](slash) y muchísimas ponencias brutales, y salir directo a la hackathon la hizo inolvidable. Lo que más se me quedó grabado de esa semana es que todos tenemos las mismas 24 horas al día: hay startups que dedican 16 horas a resolver algo de una escala y otras que con esas mismas horas apuntan a algo global. La vida es como un partido de béisbol: cuando te toca batear y tienes una sola oportunidad, es mejor intentar botarla de home run que asegurar primera base. Vamos a ver si en una tercera hackathon se da porque la tercera es la vencida. De la merch me guardé los dos lanyards: el del Startup Venezuela Summit y la tarjeta de Platanus Hack con chip NFC, que personalicé para abrir juanevillam.com al acercarla a un teléfono. Ya llevo tres identificadores en mi guantelete del infinito y no cambiaría ni un solo segundo de esa experiencia.',
    'events.platanus.m':
      'Una semana intensa en Caracas: [Startup Venezuela Summit](summit) seguido directo por [Platanus Hack](platanus) en las oficinas de [Yummy](yummy), mayor nivel técnico, nuevos amigos y apuntar al home run.',
    'likes.title': 'Más de mí',
    'likes.cosmos.name': 'Cosmos',
    'likes.cosmos.body':
      'El planeta Tierra es uno de los planetas del sistema solar, que es uno de los múltiples sistemas de la Vía Láctea, que forma parte de un cúmulo, un supercúmulo y megaclústers con tantas galaxias, estrellas y planetas que te pone en tu lugar como ser vivo: todo lo que ha pasado y pasa ahora mismo, gente feliz, triste, enferma, sana, naciendo, muriendo, casándose, ocurre en este planetica, que es nada frente a un universo indiferente. Estas fotos del [James Webb](webb) y del [Hubble](hubble) me fascinan, no tengo manera de rankearlas porque para mí no hay nada más real que ellas. Creo que desde que el humano descubrió el fuego estaba destinado a crear a los seres que lo reemplazarían, como la inteligencia artificial, y si nada nos extingue estamos destinados a dominar las estrellas. Siempre digo que me habría gustado nacer en el año 10.000, 100.000 o un millón, en un mundo como Star Wars que abarque galaxias enteras y sectores del universo observable. Para lograr esa exploración espacial, cuando la estrella más cercana aparte del Sol está a cuatro años luz de ida y cuatro de vuelta, hace falta alcanzar la inmortalidad, porque somos una mente compleja en un cuerpo físico muy frágil. No con medicina, sino quizás extrayendo tu conciencia a una supercomputadora replicada en múltiples puntos del universo: si tu cuerpo robótico sufre un accidente, cargas tu conciencia en otro robot y puedes vivir hasta que se consuma la última estrella. Ser inmortal encerrado en la Tierra aburriría, pero en el universo entero sería increíble. Comparto estas fotos aquí porque si las miras desde este punto de vista me conoces mucho más que por cualquier cantidad de posts en redes sociales. Si con algo te quedas de esta sección, que sea con el amor por el espacio y el sueño de convertirnos en una especie universal. Gracias por escucharme.',
    'likes.songs.name': 'Canciones',
    'likes.songs.meta': 'Mi ranking',
    'likes.songs.body':
      'Aquí les comparto algunas de mis canciones favoritas para que las prueben en [Sound Shaper](shaper). Es una preview, pero casi todo lo que puedes hacer en Shape lo puedes hacer acá, incluso el modo DJ Juan. Arriba están mis preferidas y otras que tengo en mi librería personal más para probar y jugar. Mi gusto musical es algo entre techno y lo que me gusta llamar electrónico cibernético: mientras menos letra tenga una canción, más me gusta, me gusta más escuchar música pura que canciones con letra. Así como pueden jugar Space Explorer aquí mismo, pueden probar Sound Shaper con mi librería personal, y si les gusta descargan la app o la usan en la web.',
    'songs.top': 'Mi top',
    'songs.more': 'Más canciones',
    'songs.library': 'Canciones',
    'shape.none': 'Ninguno',
    'shape.pitchOff': 'Tono libre',
    'songs.expand': 'Abrir reproductor',
    'songs.fullScreen': 'Pantalla completa',
    'songs.powered': 'Con la tecnología de Sound Shaper',
    'songs.with': 'Hecho con',
    'songs.list': 'Mis canciones favoritas',
    'songs.play': 'Reproducir',
    'songs.pause': 'Pausar',
    'songs.prev': 'Canción anterior',
    'songs.next': 'Canción siguiente',
    'songs.seek': 'Posición',
    'shape.title': 'Moldear',
    'shape.done': 'OK',
    'shape.presets': 'Ajustes preestablecidos',
    'shape.custom': 'Personalizado',
    'shape.levels.off': 'No',
    'shape.levels.low': 'Bajo',
    'shape.levels.medium': 'Medio',
    'shape.levels.high': 'Alto',
    'eq.title': 'Ecualizador',
    'eq.hint': 'Graves a la izquierda, agudos a la derecha.',
    'eq.presets.flat': 'Plano',
    'eq.presets.bass': 'Graves',
    'eq.presets.vocal': 'Voz',
    'eq.presets.treble': 'Agudos',
    'eq.presets.warm': 'Cálido',
    'eq.presets.bright': 'Brillante',
    'shape.speed': 'Velocidad de reproducción',
    'shape.keepPitch': 'Conservar el tono',
    'shape.keepPitchDescription':
      'Conserva el tono original a cualquier velocidad.',
    'shape.echo': 'Eco',
    'shape.echoDescription':
      'Añade una repetición corta, para que el sonido llegue dos veces.',
    'shape.nextRoom': 'Habitación contigua',
    'shape.nextRoomDescription':
      'Reproduce el sonido como si viniera de otra habitación, amortiguado por una pared.',
    'shape.autoDj': 'DJ Juan',
    'shape.autoDjDescription':
      'Mezcla esta canción o todas estas canciones al ritmo, distinto cada vez.',
    'shape.autoDjPreparing': 'Leyendo canciones',
    'shape.autoDjProgress': '{ready} de {total}',
    'shape.autoDjMode.off': 'No',
    'shape.autoDjMode.sound': 'Esta canción',
    'shape.autoDjMode.all': 'Todas',
    'likes.photos.name': 'Fotos',
    'likes.photos.meta': 'Vida',
    'likes.photos.meta2': 'Viajes',
    'likes.photos.body':
      'Dejé de publicar fotos en redes sociales y armé esta sección en mi página para centralizarlo todo aquí y tener más control de quién las ve. Poco a poco todo lo social mío va a vivir en mi página web, ya solo faltaría hacer mi propia app de chat para hablar conmigo, mentira, eso ya es mucho. Aquí están mis fotos.',
    'photos.posts': 'publicaciones',
    'photos.likes': 'me gusta',
    'photos.grid': 'Cuadrícula',
    'photos.feed': 'Feed',
    'photos.back': 'Cuadrícula',
    'photos.like': 'Me gusta',
    'photos.doubleTap': 'Doble toque para dar me gusta',
    'photos.gateTitle': 'Fotos',
    'photos.gateBody':
      'Inicia sesión con Google para ver mis fotos.',
    'photos.gateName': 'Tu nombre',
    'photos.gateEmail': 'tu@correo.com',
    'photos.gateContinue': 'Continuar con Google',
    'photos.gateError': 'No se pudo verificar tu cuenta de Google. Intenta de nuevo.',
    'photos.lock': 'Cerrar sesión',
    'photos.mute': 'Silenciar o activar audio',
    'lang.zhNotice': 'El audio de narración está en inglés con subtítulos en chino.',
  },
  zh: {
    'meta.title': 'juanevillam',
    'meta.description': '我做原生移动应用和网页产品。',
    'focus.close': '关闭',
    'share.copy': '拷贝链接',
    'share.copied': '已拷贝',
    visit: '访问',
    listen: '收听',
    pause: '暂停',
    'soon.close': '关闭',
    'hero.hi': '你好',
    'store.soon': '即将推出',
    'launch.new': '新',
    'launch.shaper': 'Sound Shaper 现已推出网页版。',
    'launch.get': '打开',
    'store.web': '打开',
    'store.github': '查看源码',
    'hero.caption':
      '嗨，我是 Juan Esteban Villa Mendoza，我热爱做软件。我喜欢像打电子游戏那样做软件，也就是冲着白金奖杯去。我觉得软件是最接近魔法的东西，因为只要你能想象出来并找到实现的方法，就能创造出几乎任何东西。如果再把软件和硬件结合起来，还能创造出更酷的东西。这是我的网站，希望你们喜欢。做这个网站时我只给自己定了一个挑战：不看任何参考，零参考，因为我想把它做成完全属于我自己的作品。为此我找到的最好方式就是亲自出镜，为每一个板块录制旁白。在这里你会看到我的项目、参加过的活动、喜欢的事物，以及未来想和你们分享的更多内容。希望你们喜欢。欢迎。',
    'footer.social': '社交',
    'footer.caption':
      '非常感谢你访问我的网站。做出这个网站我真的非常开心。希望你在这里听我讲、看我的视频、体验整个网站的过程中玩得开心。我会继续创造，继续向着心爱的白金奖杯前进。差点忘了说，非常抱歉我的英语不太好。我觉得我的发音有时还行，但语法有很多错误，这就是我现在说英语的真实水平。我肯定会不断进步的，因为我的母语是西班牙语，而英语是我想练到母语水平的第二语言。所以现在你听到的，会是我这辈子说英语最差的样子，因为以后只会越来越好。谢谢，就这样啦。',
    'song.listen': '观看示例',
    'song.teaser': '听听 DÁKITI 在 Sound Shaper 里的效果',
    'legal.terms': '条款与条件',
    'legal.privacy': '隐私政策',
    'legal.support': '支持',
    'legal.delete': '删除账户',
    'links.legal': '法律',
    'links.help': '帮助',
    'legal.updated': '更新于',
    'legal.contents': '目录',
    'notFound.title': '找不到页面',
    'notFound.body': '此页面不存在或已移动。',
    'notFound.home': '前往首页',

    'shaper.problem':
      '我以前经常在 YouTube Music 听歌，但广告总是接连不断地弹出来。同一首歌我会听四个版本：慢速、超慢、快速、极快，而且我常常只想听开头那 20 秒或者结尾那 30 秒，把这些组合一遍又一遍地循环。',
    'shaper.solution':
      '这就是我做 [Sound Shaper](github) 的原因。它是一款 MP3 播放器，可以让你把喜欢歌曲里最精彩的部分截成片段并循环播放，不只是单首歌的片段，而是整个曲库里所有歌的最佳片段连播。它还有 Shape 功能，这也是它叫 Sound Shaper 的原因，提供完整的均衡器和预设来塑造声音。还有 Echo 和 Next Room 这样超酷的滤镜，让你戴着耳机听歌就像置身派对、演唱会，或者演唱会外的停车场。它解决了我遇到的所有问题：锁屏后继续播放、免费、无广告，而且还是开源的。这是我通过软件表达自我的方式，因为这款应用对我来说非常私人。我最初是为自己做的，后来心想干脆公开分享给大家，就像一幅画，挂在家里固然好，分享出去成为帮助别人的那一份心意则更酷。我超爱 Sound Shaper。差点忘了说：它还有 DJ Juan，也就是我本人，就像我亲自当你的 DJ，帮你随机混音整座曲库或单首歌曲。我给你的不只是一个播放器，还是帮你打碟的 DJ。我爱它，谢谢。',
    'shaper.s1.p1':
      '这是你的资料库。应用本身不下载音乐：你自己上传 MP3 文件，并可以在这里拖动音频卡片按自己喜欢的顺序排列。',
    'shaper.s1.p2':
      '它甚至支持小组件，从这里也能进入设置页面切换应用主题和语言。它还有像 PlayStation 一样的奖杯系统：用得越多，解锁的奖杯越多，直到拿到最棒的那一座，心爱的白金奖杯。',
    'shaper.s2.p1':
      '这是播放器界面，就像 Apple Music 或 YouTube Music 一样，可以在这里播放、暂停、切下一首或上一首。',
    'shaper.s2.p2':
      '但最重要的部分在底部的工具栏，从那里可以进入 Shape 和 Clips。',
    'shaper.s3.p1':
      'Sound Shaper 这个名字就来自这里：塑造声音。就像我前面说的，这里可以调均衡器、预设、Echo 和 Next Room 滤镜，还有 DJ Juan。差点忘了：这里还能调播放速度，把声音调快、极快、调慢或极慢，同时保持原曲音调，不会像在 YouTube Music 开 0.5 倍速那样失真。这就是它解决的问题，Shape 界面正是 Sound Shaper 存在的理由。',
    'shaper.s3.p2':
      '做这个界面是开发 Sound Shaper 时最有趣的部分。这里给你听一段 Bad Bunny 的 DÁKITI 在 Sound Shaper 的 DJ Juan 模式下的效果，慢慢变化节奏、低音并叠加滤镜，当然你还能用它做出更棒的混音。DÁKITI 里我最喜欢的片段就是那几句副歌，顺便抱歉我吹口哨没吹好。录着录着这些视频，人也越来越自信，我之所以能录这么长，只是因为这是我人生第一个真正属于我自己的个人网站。',
    'shaper.s4.p1':
      '做 Clips 时我深受 Apple 语音备忘录的启发，我平时就是用它记录这个网站和 Sound Shaper 的灵感，而不是给自己发 WhatsApp，直接录音再转文字。在这里可以非常轻松地把喜欢的歌曲截成片段。',
    'shaper.s4.p2':
      '保存成片段后就能一遍又一遍循环听。此外在这里还能直接打开 Shape，为你正在做的片段塑形，试试各种滤镜和预设。谢谢。',

    'arcade.play': '开始游戏',
    'arcade.fullscreen': '全屏',
    'arcade.resume': '点击游戏即可游玩。',
    'arcade.rotate': '横置手机以继续。',
    'arcade.close': '关闭',
    'egg.ship': 'Space Explorer 的飞船。前往游戏。',
    'egg.robot.tridi': 'Tridi 的机器人，像人一样走路。打开 Tridi。',
    'arcade.c.fly': '飞行',
    'arcade.c.fire': '射击',
    'arcade.c.dash': '冲刺',
    'arcade.c.missile': '导弹',
    'arcade.c.shield': '护盾',
    'arcade.c.overdrive': '超载',
    'arcade.c.start': '开始与暂停',
    // One sentence around a link: before it, the link's words, after it.
    'arcade.p1':
      '[Space Explorer](github) 最初是为我的应用准备的彩蛋：进入 Sound Shaper 的某个特定位置，按秘密节奏连点几下，就会打开 Space Explorer。最初的想法是用三个核心产品，Sound Shaper 和另外两个，分别解锁一关，让你在我的应用之间穿梭通关并拿到白金奖杯。但不留线索的话几乎没人能找到，而且为了让 Sound Shaper 保持纯粹，我先把它搁置了。就在同一时间，我们报名了在加拉加斯 Yummy 总部举办的 [Platanus Hack](platanus)，附加挑战是做一款压缩后不超过 50 KB 的街机游戏。我觉得这是把 Space Explorer 做成真正游戏的最佳机会。我研究了这届黑客松在其他城市的作品，因为 50 KB 限制大多数人都做了像素风。我不会画像素画，所以决定走技术路线，把 50 KB 推向极限：做了一款拥有庞大无限宇宙、多种敌人、多关卡甚至黑洞的 3D 太空射击游戏，延续我热爱的宇宙主题，你可以在“更多关于我”里看到更多。因为不能用有版权的《星球大战》配乐，我花在打造这首原创太空冒险旋律上的时间和精力，甚至可能比某些核心功能还多。拍这段视频时我还换了布景以免无聊：身后是委内瑞拉国旗帽（真正的委内瑞拉人一看就知道这版为何不同）和我家乡巴基西梅托棒球队 Cardenales de Lara 的帽子。Space Explorer 是一款 50 KB 的 3D 街机太空射击游戏，有多关卡、多敌人、飞船技能和一个黑洞。你可以直接在这个页面玩，也可以在 [Platanus Hack Arcade](arcade) 官方页面体验。希望你们喜欢。',

    // Deck controls & photo viewer labels.
    'deck.prev': '上一个',
    'deck.next': '下一个',
    'photo.open': '查看原图',

    // Short summary copy (see en).
    'shaper.solution.m':
      '于是我做了 [Sound Shaper](github)：导入你自己的 MP3，实时调速，用均衡器和音效塑造声音，再把最爱的部分存成片段。全部离线可用。',
    'events.title': '精选',
    'events.arcade': '街机游戏',
    'events.arcade.when': '2026 年 7 月',
    'events.hackathon': '黑客松',
    'events.alegria.when': '2025 年 10 月',
    'events.alegria.body':
      '一天下午，我从小学到高中的老朋友 [Pastor](pastor) 在久未联系后给我发消息，邀请我作为第四名成员，和他的大学朋友 [César](cesar)、[Alejandro](ale) 一起参加在加拉加斯 [Yummy](yummy) 总部举办的 AlegrIA Hackathon 2025。半年前的我多半会因为犯懒或害怕连报名都选不上而拒绝，但这一次我答应了，心想哪怕什么都没拿到，至少也能学到很多并获得成长。上千名报名者中，我们入选了前 100 名去到加拉加斯。这场活动由 Yummy、[Cashea](cashea)、[Slash](slash) 和 AlegrIA Labs 联合举办。我们没能拿奖、也没进前十，但这是我人生第一次黑客松，收获巨大，不仅了解了 36 到 48 小时打造一家真正创业产品的节奏，也更看清了自己在高压和缺觉下的状态。我们线上听了 Yummy 的 Vicente Zavarce 和 Cashea 的 [Pedro Vallenilla](pedro) 分享，Slash 的 Víctor Cárdenas 也在现场亲自辅导我们的点子。我们住的 Airbnb 就在 Yummy 总部所在的 Cubo Negro 对面，这段经历和队友我一分一秒都不想改变。现场发了 T 恤、帆布包、帽子和钥匙扣，但我最爱珍藏的还是活动胸牌，上面写着 Tech Bros 和 Juan Villa、AlegrIA Labs。那场黑客松加速了我从纯技术打工者向创业心态的转变：懂技术可以做出产品，但学会销售、推广并在其上建立公司是完全不同的层次。我非常庆幸参加了那场加拉加斯 AlegrIA Hackathon 2025。',
    'events.alegria.m':
      '我的人生第一场黑客松，在加拉加斯 [Yummy](yummy) 总部与 [Pastor](pastor)、[César](cesar) 和 [Alejandro](ale) 组队。没有拿奖，但 Yummy、[Cashea](cashea) 和 [Slash](slash) 的分享把我推向了创业世界。',
    'events.summit': '峰会',
    'events.platanus.when': '2026 年 10 月',
    'events.platanus.body':
      '我们参加了在加拉加斯举办的 2026 [Startup Venezuela Summit](summit)，峰会刚一结束就马不停蹄去了 [Platanus Hack](platanus) 2026，这是我的第二场黑客松，而且又是在 [Yummy](yummy) 总部。那一整周非常累，但比起 2026 年任何普通的一周，十月的那一周完全不在一个量级。在 Startup Venezuela Summit 上向无数做着酷产品的创业者学到了很多，紧接着冲进技术门槛更高的 Platanus Hack。我们依然没有拿奖，但做出的产品同样上了新台阶，相比一年前第一场黑客松进步显而易见：那 36 小时里我始终冷静专注，再次与 [Pastor](pastor)、[César](cesar) 和 [Alejandro](ale) 组队的沟通也顺畅得多。峰会和黑客松上我们都认识了超多新朋友。Platanus Ventures 通过黑客松发掘硬核技术人才，2026 年他们把赛事做成了拉美巡回赛，走过阿根廷、墨西哥、哥伦比亚来到加拉加斯，现场的技术水准令人惊艳。那一周最深印在我脑海里的体会是：每个人每天都只有 24 小时，做创业项目同样要每天投入 12 到 16 小时，有人解决区域问题这很好，也有人把目光投向全球规模。我常把人生比作棒球赛，轮到你上场击球且只有一次机会时，你是稳妥跑向一垒，还是全力挥棒冲击本垒打？应该瞄准本垒打。既然同样全力以赴，为什么不试着改变世界？这两场活动的胸牌我都珍藏着：Startup Venezuela Summit 的吊牌，还有能塞进钱包的 Platanus Hack 卡片，我把里面的 NFC 芯片设成了靠近手机就打开 juanevillam.com。我正像收集无限宝石一样把它们收进我的无限手套。那一周的每一秒我都绝不愿改变。',
    'events.platanus.m':
      '加拉加斯充实的一周：[Startup Venezuela Summit](summit) 紧接 [Yummy](yummy) 总部的 [Platanus Hack](platanus)，更高的技术水准、新朋友，以及全力冲击本垒打。',
    'likes.title': '更多关于我',
    'likes.cosmos.name': '宇宙',
    'likes.cosmos.body':
      '太空一直让我着迷：当你仰望并试着理解它时，那种尺度令人震撼。人类历史上发生过的一切都在地球上，太阳系众多行星之一，而太阳系只是银河系无数恒星系之一，银河系又只是星系团、超星系团乃至巨型结构中的沧海一粟。想到这里，你就会认清自己的位置，不只是作为人类，而是作为生命，外面宇宙浩瀚运转，而这里有人欢喜、有人悲伤、有人健康、有人生病、有人降生、有人离去、有人毕业、有人结婚。我相信自从人类发现火的那一刻起，就注定要创造出比我们更高级的存在，人工智能，而且全人类最崇高的使命莫过于成为跨行星、跨星系，甚至像《星球大战》那样跨越宇宙扇区的物种。我常说真希望自己出生在公元一万年或一百万年，而不是 2000 年代。只要不发生毁灭性灾难，星辰大海就没有尽头。但要真正做到这一点，人类必须追求永生，因为我们拥有复杂的大脑，却住在极其脆弱的躯壳里，甚至下楼摔一跤都可能丧命。除太阳外最近的恒星距离我们四光年、往返八光年，而可观测宇宙中有数不清的恒星。比起药物，永生之路或许是将意识提取到多点备份的超级计算机中，就算物理世界里的机器人化身遇险损毁，你的意识也能加载到另一台机器里，真正去探索宇宙。这些就是我深爱的[詹姆斯·韦伯](webb)与[哈勃](hubble)照片：刚迷上宇宙时，我能戴着耳机听歌一张张看上几个小时。对我来说没有什么比这些照片更真实，看懂这些照片，比看我所有的社交媒体动态都更能了解我。成为宇宙物种是人类最伟大的使命，永生则是顺带解开的有趣支线任务。希望你也和我一样喜欢这些照片。',
    'likes.songs.name': '歌曲',
    'likes.songs.meta': '我的排行',
    'likes.songs.body':
      '这里分享一些我最爱的歌，我的个人榜单，我一向喜欢给各种事物排榜单，外加一些留在个人曲库里图一乐的曲目。风格类似 techno，或者我喜欢称之为赛博风格，歌词越少我越喜欢：我最爱没有人声、只有纯粹音乐的曲子。在这里你可以直接体验 [Sound Shaper](shaper)，就像在这个网站上直接玩 Space Explorer 一样，你可以下载应用或使用网页版，而在这里就能试玩播放和塑形功能，包括 DJ Juan。这里不能剪辑片段也没有奖杯，但依然非常有趣。希望你喜欢。',
    'songs.top': '我的最爱',
    'songs.more': '更多歌曲',
    'songs.library': '歌曲',
    'shape.none': '无',
    'shape.pitchOff': '不保持音高',
    'songs.expand': '打开播放器',
    'songs.fullScreen': '全屏',
    'songs.powered': '由 Sound Shaper 提供支持',
    'songs.with': '使用',
    'songs.list': '我最爱的歌曲',
    'songs.play': '播放',
    'songs.pause': '暂停',
    'songs.prev': '上一首',
    'songs.next': '下一首',
    'songs.seek': '播放位置',
    'shape.title': '塑形',
    'shape.done': '完成',
    'shape.presets': '预置',
    'shape.custom': '自定',
    'shape.levels.off': '关闭',
    'shape.levels.low': '低',
    'shape.levels.medium': '中',
    'shape.levels.high': '高',
    'eq.title': '均衡器',
    'eq.hint': '左侧低音，右侧高音。',
    'eq.presets.flat': '平坦',
    'eq.presets.bass': '低音',
    'eq.presets.vocal': '人声',
    'eq.presets.treble': '高音',
    'eq.presets.warm': '温暖',
    'eq.presets.bright': '明亮',
    'shape.speed': '播放速度',
    'shape.keepPitch': '保持音高',
    'shape.keepPitchDescription': '在任何速度下都保持原始音高。',
    'shape.echo': '回声',
    'shape.echoDescription': '添加一次短暂的重复，让声音响两次。',
    'shape.nextRoom': '隔壁房间',
    'shape.nextRoomDescription': '让声音听起来像从隔壁房间传来，隔着一堵墙。',
    'shape.autoDj': 'DJ Juan',
    'shape.autoDjDescription':
      '跟随节拍混音当前歌曲或这里的所有歌曲，每次都不同。',
    'shape.autoDjPreparing': '正在读取歌曲',
    'shape.autoDjProgress': '{ready}/{total}',
    'shape.autoDjMode.off': '关闭',
    'shape.autoDjMode.sound': '当前歌曲',
    'shape.autoDjMode.all': '所有歌曲',
    'likes.photos.name': '照片',
    'likes.photos.meta': '生活',
    'likes.photos.meta2': '旅行',
    'likes.photos.body':
      '我不再在社交媒体上发照片和动态，而是改在这里分享，因为我想把自己的一切都集中在我亲手搭建的这个平台上。所以如果你想看我的 Instagram，这里就是我的照片。',
    'photos.posts': '帖子',
    'photos.likes': '赞',
    'photos.grid': '网格',
    'photos.feed': '动态',
    'photos.back': '网格',
    'photos.like': '赞',
    'photos.doubleTap': '双击点赞',
    'photos.gateTitle': '照片',
    'photos.gateBody': '使用 Google 登录以查看我的照片。',
    'photos.gateName': '你的姓名',
    'photos.gateEmail': 'your@email.com',
    'photos.gateContinue': '使用 Google 继续',
    'photos.gateError': '无法验证你的 Google 账号，请重试。',
    'photos.lock': '退出登录',
    'photos.mute': '静音或取消静音',
    'lang.zhNotice': '旁白音频为英语原声，配中文字幕。',
  },
};
