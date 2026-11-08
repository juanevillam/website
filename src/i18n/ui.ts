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
  'soon.narration':
    "My narration in English is coming soon. For now you'll hear me in Spanish and read along in English.",
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
  'hero.caption':
    "Hi, I'm Juan Villa and I love making software. I always say I like making software the way I like playing video games, and that's going for the platinum. I also think it's the closest thing to magic in this simulation, because if you can imagine something and figure out how to build it, you can create some really cool things. And once you pair that software with hardware, you can create things that are even cooler. A fun fact about this page: I built it with a single challenge — to make it as personal as possible, without looking at a single reference. Beyond giving it my own branding, I decided to record myself, so the page plays like a movie in video, audio and subtitles, like a little Horcrux of mine living here. It's designed to be as timeless as possible as the years go by. Here I'll show you what I'm up to and the things I like. Welcome.",
  'footer.caption':
    "Well, thanks for listening. If you have any comments, you can message me on LinkedIn or Instagram. And I'm still building, and still going for the platinum.",
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
    'I used to listen to a lot of music on YouTube Music, but ads kept popping up all the time. Often I liked hearing a song in five versions: slow, very slow, normal, fast and very fast. And many other times all I wanted was to hear the 30 seconds in the middle, the best part of the song. And I played it again, and again, and again.',
  'shaper.solution':
    "That's why I built Sound Shaper, a personal MP3 player that's free, ad-free and open source, packed with cool features: sound presets, a manual equalizer if you know music and want to dial it in, live playback speed, and audio filters. It also has Auto DJ — DJ Juan, that's me as the DJ — and works just the way I wanted. You can create clips of your favorite parts, loop those clips with any shape you want — like playing every clip of a song sped up — and the music keeps playing when your phone is locked.",
  'shaper.s1.p1':
    "This is your library. The app doesn't download music: you upload your own MP3s, and here you can drag them around to organize your library however you like.",
  'shaper.s1.p2':
    "It comes with widgets, and from this screen you can also change the app's theme — dark mode or light mode — and its language. It also has trophies just like PlayStation's: the more you use the app, the more it rewards you with better trophies until you earn the coveted platinum.",
  'shaper.s2.p1':
    'This is the player screen, just like YouTube Music or Apple Music. From here you can hit play, pause, next song or previous song.',
  'shaper.s2.p2':
    'What matters most is the bottom bar, which holds the two reasons this app exists: Shape and Clips.',
  'shaper.s3.p1':
    "This is where the name Sound Shaper comes from: the app is a sound shaper. Here you can change the playback speed, presets, equalizer and filters, or turn on Auto DJ mode.",
  'shaper.s3.p2':
    "Preserving the pitch was one of the most interesting parts to build. On YouTube or YouTube Music, if you put a song or video at 2x or 0.75x, the voice goes super fast or super slow, like fast-forward or slow motion. Here in Sound Shaper you can keep the voice at its natural pitch while the rhythm speeds up or slows down. There are also filters like echo and next room: when you combine them, it feels like being transported to a concert, standing in a concert parking lot, hearing your neighbor throwing a loud party next door, or stepping into the bathroom at a party with that nostalgic muffled sound. Here's a quick example of how DÁKITI by Bad Bunny sounds in Sound Shaper with Auto DJ.",
  'shaper.s4.p1':
    "For Clips I took a lot of inspiration from Apple's Voice Memos app, the same app I used to record all the ideas for both this page and Sound Shaper. You simply pick the section you like best and save it — and you can create as many clips as you want.",
  'shaper.s4.p2':
    "You save it as a clip and listen to it again and again. From here you can also open Shape to mold the clips you're making and hear how each one sounds with its own specific shape.",

  // Space Explorer — the Platanus arcade entry, playable at the landing's foot.
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
    "Space Explorer started as an easter egg for my apps, in this case Sound Shaper: you'd tap a secret sequence in a specific spot and a level or two would unfold with a story connecting all my apps. It overcomplicated the product and was so hidden only I knew where it was, so I took it out to keep Sound Shaper simple. Right around that time we applied to a [Platanus](platanus) hackathon in Caracas that had a side challenge to build an arcade game in at most 50 kilobytes. Since I already had the concept, I turned Space Explorer into a 3D space shooter under 50 KB — complete with a black hole and tight ship controls, leaning into technical 3D craft rather than pixel art. You can play it right here on this page or on Platanus Hack's official site. Very few entries at the hackathon were 3D, and I'm leaving it exactly as it shipped for the hackathon.",

  // More Work — the secondary projects carousel, after the game. Job
  // titles and project names stay as they are in every locale.
  'work.title': 'More Work',
  'deck.prev': 'Previous',
  'deck.next': 'Next',
  'photo.open': 'View Full Size',
  'work.present': 'Present',
  'work.cofounder': 'Co-founder',
  'work.freelance': 'Freelance',
  // One paragraph around a link to Crol; its clip is `work.crol.body`.
  'work.crol.body':
    '[Crol](crol) is a cloud ERP for SMBs in Mexico. There I started with Conto Pay, a much simpler, easier-to-use product from Crol where I led the development of the web app, the mobile app and the landing page. That mobile app then became the foundation for Crol ERP Móvil, which I also designed and built from scratch.',
  'work.salvalo.body':
    "I'm a cofounder of Salvalo, my startup. Every day, shops close with products that can still be sold, and Salvalo turns them into packs with a price and a pickup time. The customer finds one nearby on the app's map, reserves it, pays the shop directly and picks it up with a verification code. The example I always give: a bakery has 10 cachitos in the morning, by 5 in the afternoon it has 3 left and 2 loaves of French bread, and it makes a pack out of them at a reduced closing price. The shop wins, because it moves that product instead of losing it, and it gains customers, because Salvalo is an extra sales channel. And the customer gets the same morning cachitos, in the afternoon, at a discount, in a really easy way. I'm the technical cofounder: I redesigned the app and the website, and I handle all the frontend development. I'm also Salvalo's representative here in Venezuela, so I go out to pitch shops and show up at every event on Salvalo's behalf.",
  'work.maktub.body':
    "Maktub Art Fund is a client from Mexico. It's a standalone landing page — which normally wouldn't catch my eye on its own — but it had a really interesting, modern, fashion-forward design I hadn't built before, and I really liked how the final result turned out.",

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
  'arcade.m.before': 'A 3D space shooter that fits in 50 KB, made for ',
  'arcade.m.after': ' — and the easter egg I always wanted for this site.',
  'work.crol.m.after':
    ', a cloud ERP for businesses in Mexico. I built it from scratch, design included.',
  'work.salvalo.m':
    "Shops turn what they didn't sell into packs; you reserve one nearby and pick it up in store. I redesigned the app and built its website and panels.",
  'work.maktub.m':
    'The website of a fund that invests in art across Latin America, live in a month; its team edits everything without code.',
  'events.title': 'Events',
  'events.hackathon': 'Hackathon',
  'events.alegria.when': 'Oct 2025',
  'events.alegria.body':
    "This one has more of a story. [Pastor](pastor), who went to primary and secondary school with me, suddenly texted me and introduced me to [Ale](ale) and [Cesar](cesar) to apply to a hackathon organized by [Yummy](yummy), [Cashea](cashea), [Slash](slash) and AlegrIA Labs at Yummy's offices in Caracas. The old Juan probably would have said no out of shyness, fear or laziness, but I said: at the very least we're going to learn a ton, let's go for it. After several meetings we pitched [Tripealo](tripealo), a travel-experiences marketplace for Venezuela, made our application video, and out of more than a thousand applicants we were selected among the top 100 to build for 36 hours in Caracas. We didn't win or make the top 10, but it taught me so much about startups and about myself. They kept going with Tripealo while I stepped out to start [Salvalo](salvalo), though we still stick together in the startup world. I keep the event badges from every event I attend like Infinity Stones — looking at them takes me right back to the talks, the founders we met, and that 10/10 experience. It was a real turning point from the Juan who only worked as a programmer to the Juan who builds products for people — a complete mindset shift before and after that October in Caracas.",
  'events.alegria.m':
    "Three days at Venezuela's first vibe-coding hackathon, in Caracas. No prize, but new friends and lessons from the founders of [Yummy](yummy), [Cashea](cashea) and [Slash](slash). It was the push we needed to get going with [Tripealo](tripealo) and [Salvalo](salvalo).",
  'events.talk': 'Talk',
  'events.ilc.when': 'Sep 2026',
  'events.ilc.body':
    "At the AlegrIA Labs hackathon [Pedro Vallenilla](pedro) spoke over video call, and a year later he came in person to Barquisimeto, my city in Lara, Venezuela, to give a leadership talk alongside [Father Elías Sayegh](elias). We went with the team and sat right in the second row of the [theater](juares). Before going I had watched all his interviews, and live in person he shared really specific stories I had never heard. What stayed with me most was his view of Venezuela as a greenfield: after everything the country has been through, there is huge room to build tech products that already exist across Latin America. Look at [Cashea](cashea) — credit without being a bank, launched against all odds when they had to walk door to door from shop to shop being told they were crazy. That drive to keep pushing through the ventures that didn't work until hitting Cashea — which now moves a noticeable share of Venezuela's GDP — was incredible to hear in person.",
  'events.ilc.m':
    "[Pedro Vallenilla](pedro) of [Cashea](cashea), in person this time and in my city: one startup that worked, several that didn't, then Cashea, and why Venezuela is the place to build.",
  'events.interview': 'Interview',
  'events.radio.when': 'Oct 2026',
  'events.radio.body':
    "This was [Salvalo](salvalo)'s first radio interview, on [Cheo Noguera](cheo)'s show on [OK 101.5 FM](ok101) in Barquisimeto. I was in the studio and my cofounder joined from Madrid. I gave the usual example: you make 10 cachitos, by 4 you have 3 left, and you make a pack out of them. On the live stream people were asking us how to download it, and we explained what Salvalo is right there to every listener.",
  'events.radio.m':
    "[Salvalo](salvalo)'s first interview, live on [OK 101.5 FM](ok101) in Barquisimeto: the host downloaded the app on air while I walked his listeners through it.",
  'events.meetup': 'Meetup',
  'events.panal.when': 'Oct 2026',
  'events.panal.body':
    "[El Panal](panal) is a movement [Manuel Sira](manuel) started here in Barquisimeto: lots of people building all kinds of things. There are people in marketing, fashion, CRM, inventory, psychology and health apps, and there were talks on artificial intelligence, on growing your company by measuring its data well, and on standing out in the age of AI by having real taste in what you build. Every startup at the event had 30 seconds to pitch, and I, nervous, gave [Salvalo](salvalo)'s. It wasn't the best pitch I've ever given, but it was Salvalo's first official one at an event of that caliber. I went with my friends from [Tripealo](tripealo) and left with new friends from other apps, new contacts and a few leads for Salvalo. It was the warm-up right before heading to the Startup Summit in Caracas: the practice before the practice.",
  'events.panal.m':
    'A night of [El Panal](panal) in Barquisimeto: talks on AI, data and taste, and 30 seconds to pitch [Salvalo](salvalo). Nervous, but I gave it, and left with new friends and a lead or two.',
  'events.summit': 'Summit',
  'events.summit.when': 'Oct 2026',
  'events.summit.body':
    "I was at the [Startup Venezuela Summit](summit), at Caracas Campus. Honestly, I had never been to an event like it. There were talks all day, people from other countries making connections, and everyone was building every kind of product. We heard [Víctor Cárdenas](slash) of Slash again, and [Pedro Vallenilla](pedro) of [Cashea](cashea). We were also at a workshop with [Enrique Rivas](enrique), of [Fina](fina) and [Innoven](innoven). I applied with [Salvalo](salvalo) at Innoven's stand and stuck our photo on the wall of Venezuelan founders to leave our mark. I also met a lot of people, like one of the cofounders of [Rial](rial). What I took most from those two days is that building a startup is hard, but it's worth it: with ambition, drive and passion you can make it. It doesn't matter your age, your country or where you come from: if you're willing to do it, it can be done. And the other thing is what Steve Jobs said: the people crazy enough to think they can change the world are the ones who actually do. I got home super excited, still processing all the talks and everything I lived through in those two days.",
  'events.summit.m':
    "Two days at the Startup Venezuela Summit with [Tripealo](tripealo): talks by [Slash](slash) and [Cashea](cashea), a private workshop with Fina and Innoven we were invited to for our founders' jackets, and [Salvalo](salvalo) on the wall of Venezuelan founders.",
  'events.platanus.when': 'Oct 2026',
  'events.platanus.body':
    "Right after the Startup Venezuela Summit, we went straight to [Platanus Hack 26 Caracas](platanus). Platanus ran its hackathon as a tour across Latin America, and my team and I got into the Caracas edition. We applied with our developer profiles, the same team from the AlegrIA hackathon, not as [Tripealo](tripealo) or [Salvalo](salvalo), but each with our own background. It was funny: literally a year after AlegrIA 2025, we were back in [Yummy](yummy)'s offices for another hackathon, only this time much tougher on the technical side. We built [Tridi](tridi), which turns an ordinary video of a person into movement data for robots: a simulated robot learns to move on its own by imitating you. You take any video, the movement is tracked and brought into a physics simulation, the robot learns to move across different terrains and conditions, and the simulation data and trained policy are exported ready for hardware. We built it on the idea that robotics and AI is the new sexy. We slept little, but what I learned at AlegrIA and all the mental work I'd put in helped me a lot. And not just me: the whole team was super locked in. Our mentor was [Sebastián Alcalá](sebastian), a product engineer at Yummy and a cofounder of [Wink](wink). We didn't win, but the level was impressive, right up there with Buenos Aires, Mexico and Bogotá. A fun detail: our table was right next to Platanus Hack's arcade, the one I made Space Explorer for. Several times, while we were working, we watched other participants walk by and play it, and I'll always remember the look on their faces, that 'hey, this game is really cool'. I didn't say anything so they could enjoy it on their own without me in the middle. We also made great friends and connections: the technical talent in Venezuela is strong. That was our second hackathon in a row together, and as they say, third time's the charm.",
  'events.platanus.m':
    "Straight from the summit to Platanus Hack 26 Caracas, back in [Yummy](yummy)'s offices with the AlegrIA team: we built [Tridi](tridi), video turned into movement data for robots. No prize, but a much tougher hackathon, and people playing Space Explorer next door.",
  'likes.title': 'More of Me',
  'likes.cosmos.name': 'Cosmos',
  'likes.cosmos.body':
    "Space has always fascinated me. When you see how vast it is, how infinite its scales are, just at the level of galaxies, a lot of what worries me or what I think about life, what I want and what I don't, stops making sense. There are things out there so immense, like a black hole or a supernova, and we are a mind this complex in a body this fragile, weak and mortal: a contrast on another scale. Everything that has happened and will happen in human history, so far, has happened on this planet, one of many in the solar system, which is one of many systems in the Milky Way, which is one of many galaxies in a cluster, in a supercluster, and so on. The nearest star is four light-years away: scales so big you just say 'wow'. Right now someone is happy about something that happened to them and someone is sad, people are being born and people are dying, people are building and people are destroying. It's such a crazy contrast it feels like a simulation: each of us believes we're special, but we're a character who can have an effect on the world, not at the scale of the universe. The universe is indifferent to humans. And instead of rejecting that feeling, I learned to admire it and to love existence itself: it's incredible that we are the universe experiencing itself, in all its greatness. That's why I started looking at lots of space photos from the [James Webb](webb) and the [Hubble](hubble), and I'd spend hours on a single photo without listening to anything, immersed, absorbed by those images. You wonder whether they're real or a montage, and yes, they're real. These are my favorites, and I have no way to rank them: I don't know which is better than another. Some are at the scale of stars and others at the scale of galaxies, where you say 'this is a whole galaxy', with who knows how many solar systems, and we haven't even explored our whole planet. And since I love them so much, I wanted to share them here.",
  // More of Me's Songs card and its player (SongsPlayer): the Shape
  // sheet's words are Sound Shaper's own (its i18n/translations.ts).
  'likes.songs.name': 'Songs',
  'likes.songs.meta': 'My Ranking',
  'likes.songs.body':
    "Here are some of my favorite songs. If you notice, they share an electronic style that I call cybernetic, futuristic: I don't know if it's called techno or what. The fewer lyrics a song has, the more I like it: to me they're more music than songs, and those are my top. It would be cool if you tried to guess my favorite parts, the clips I keep of each song in my personal [Sound Shaper](shaper) library, as a way to get to know me better. The rest are songs of every kind, so you can play with all the filters and the live DJ mode right here on the page.",
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
    'Mixes parts of every song here into a set, differently every time.',
  'shape.autoDjPreparing': 'Reading Songs',
  'shape.autoDjProgress': '{ready} of {total}',
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
    'soon.narration':
      'Muy pronto, mi narración en otros idiomas. Por ahora me escuchas en español.',
    'soon.close': 'Cerrar',
    'hero.hi': 'Hola',
    'store.soon': 'Próximamente',
    'launch.new': 'Nuevo',
    'launch.shaper': 'Sound Shaper ya está en la web.',
    'launch.get': 'Ábrela',
    'store.web': 'Ábrela en la',
    'hero.caption':
      'Hola, yo soy Juan Villa y me encanta hacer software. Siempre digo que me gusta hacer software como me gusta jugar videojuegos, y eso es yendo por el platino. Además creo que es de las cosas más cercanas que hay a la magia en esta simulación, porque si te imaginas algo y encuentras la manera de hacerlo, puedes crear cosas bastante cool. Y si después ese software que hiciste lo unes con hardware, puedes crear cosas incluso más cool. Como dato curioso de esta página, la hice con un solo reto: que fuese lo más personal posible, sin ver ni una sola referencia. Aparte de que tenía que tener un branding muy mío, dije: me grabo y listo, así que la página está como si fuese una película, en video, en audio y subtitulada, como un mini Horrocrux mío viviendo aquí. Está diseñada para ser lo más timeless posible a medida que pasan los años. En esta página les voy a mostrar en qué ando metido y cosas que me gustan. Bienvenidos.',
    'footer.caption':
      'Bueno, gracias por escucharme. Si tienes algún comentario, me puedes escribir por LinkedIn o por Instagram. Y yo sigo construyendo, y sigo yendo por el platino.',
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
      'Mira, yo escuchaba mucha música en YouTube Music, pero me salían anuncios a cada rato. Muchas veces me gustaba escuchar una canción en cinco versiones: lenta, muy lenta, normal, rápida y muy rápida. Y muchas otras veces lo que me gustaba era escuchar los 30 segundos de en medio, los mejores de la canción. Y la repetía, la repetía y la repetía.',
    'shaper.solution':
      'Y por eso hice Sound Shaper, un reproductor MP3 personal que es gratis, sin anuncios, de código abierto y tiene muchas funcionalidades interesantes: presets de sonido, ecualizador manual por si sabes más de música y quieres personalizarla al punto, playback speed en vivo y filtros bastante cool. Tiene auto DJ — DJ Juan, soy yo el DJ — y funciona tal cual como yo quería. Puedes crear clips de las partes específicas que más te gustan, poner en loop esos clips con el shape que tú quieras — como escuchar todos los clips de una canción en speed up — y la canción sigue cuando el teléfono está bloqueado también.',
    'shaper.s1.p1':
      'Esta es tu librería. La app no descarga la música: tú mismo subes tus MP3 y por acá puedes arrastrarlos para ordenar la biblioteca de la manera en que más te guste.',
    'shaper.s1.p2':
      'Tiene widgets, y desde esta pantalla también puedes cambiar el theme de la aplicación — modo oscuro o modo claro — y el idioma. También tiene trofeos como los de PlayStation: mientras más utilizas la aplicación, más te recompensa y mejores trofeos te da hasta conseguir el preciado platino.',
    'shaper.s2.p1':
      'Esta es la pantalla del reproductor, tal cual como si fuese YouTube Music o Apple Music. Desde acá puedes darle play, pause, siguiente canción o canción anterior.',
    'shaper.s2.p2':
      'Pero lo más importante es la barra de abajo, que son básicamente las razones por las que existe esta aplicación: Shape y Clips.',
    'shaper.s3.p1':
      'De aquí viene el nombre de la aplicación, Sound Shaper: la aplicación es un moldeador de sonidos. Aquí puedes cambiar el playback speed, los presets, el ecualizador, los filtros o ponerlo en modo auto DJ.',
    'shaper.s3.p2':
      'Preservar el tono fue de lo más curioso de construir. En YouTube o en YouTube Music, si colocas una canción o un video en 2x o en 0.75, la voz va muy rápida o muy lenta, como si estuviese en cámara rápida o en cámara lenta. Aquí en Sound Shaper puedes configurarle para que la voz mantenga su tono al mismo ritmo de la canción. Además hay filtros como echo y next room, que si empiezas a jugar y los combinas es como si te transportaras a un concierto, estuvieses en el estacionamiento de un concierto, tu vecino estuviese tirando una fiesta a todo volumen al lado de tu casa, o estuvieses en el baño de una fiesta lavándote la cara y se escucha ese ambiente nostálgico. Aquí te dejo un ejemplo rápido de cómo se escucha DÁKITI de Bad Bunny en Sound Shaper con el modo auto DJ.',
    'shaper.s4.p1':
      'Para Clips me inspiré mucho en la aplicación de Notas de Voz de Apple, que es la aplicación con la que grabé todas las ideas tanto para esta página como para Sound Shaper. Básicamente escoges la sección que más te gusta para el clip y la guardas — puedes crear todos los clips que quieras, infinitos.',
    'shaper.s4.p2':
      'Lo guardas como clip y lo escuchas una y otra vez. Desde aquí también puedes abrir Shape para moldear los clips que estás haciendo y escuchar cómo suena con ese Shape específico.',
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
      'Space Explorer inició como un easter egg para mis aplicaciones, en este caso Sound Shaper: ibas a entrar a una parte específica de la aplicación, darle unos taps secretos y se desplegaba un nivel o dos con una historia que se unía con el resto de mis aplicaciones. Pero eso sobrecomplicaba el producto y estaba tan oculto que solo lo sabía yo, así que para simplificar Sound Shaper lo removí. Justo en esos días aplicamos a una hackathon de [Platanus](platanus) en Caracas que tenía como reto secundario hacer un juego de arcade de máximo 50 kilobytes. Como ya tenía la idea trabajada, hice Space Explorer como un shooter 3D espacial en 50 KB — con un agujero negro y controles de nave bien trabajados, apostando por algo más técnico que pixel art. Lo puedes jugar aquí en esta página o en la web oficial de Platanus Hack. En la hackathon había muy pocos juegos en 3D, y así como quedó para la hackathon se queda para siempre.',

    // More Work — the secondary projects carousel.
    'work.title': 'Más proyectos',
    'deck.prev': 'Anterior',
    'deck.next': 'Siguiente',
    'photo.open': 'Ver en tamaño completo',
    'work.present': 'Actualidad',
    'work.cofounder': 'Cofundador',
    'work.freelance': 'Freelance',
    // One paragraph around a link to Crol; its clip is `work.crol.body`.
    'work.crol.body':
      '[Crol](crol) es un ERP para PyMEs en México. En Crol empecé con Conto Pay, un producto mucho más simple y fácil de usar de Crol en el que lideré el desarrollo del sistema web, la aplicación móvil y la landing page. Esa aplicación móvil fue después la base para Crol ERP Móvil, que también construí y diseñé desde cero.',
    'work.salvalo.body':
      'Soy cofundador de Salvalo, mi startup. Los comercios cierran cada día con productos que todavía se pueden vender, y en Salvalo los conviertes en packs con precio y horario de recogida. El cliente lo encuentra cerca en el mapa de la aplicación, lo aparta, le paga directo al comercio y lo recoge con un código de verificación. El ejemplo que siempre pongo: una panadería tiene 10 cachitos en la mañana, a las 5 de la tarde le quedan 3 y 2 panes franceses, y arma un pack con eso a un precio de cierre reducido. Gana el comercio, porque mueve ese producto y no lo pierde, y gana más clientes, porque Salvalo es un canal de ventas extra. Y el cliente se lleva los mismos cachitos de la mañana, en la tarde, a precio de oferta y de manera súper cómoda. Yo soy el cofundador técnico: rediseñé la aplicación y la página web, y me encargo de todo el desarrollo frontend. Además soy el representante de Salvalo aquí en Venezuela, así que salgo a hacerle pitch a comercios y a estar en todos los eventos en nombre de Salvalo.',
    'work.maktub.body':
      'Maktub Art Fund es un cliente de México. Es una landing page — que por sí sola normalmente no me llama tanto la atención —, pero tenía un diseño bastante interesante, muy moderno y muy fashion que no había hecho antes, y me gustó mucho el resultado final.',

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
    'arcade.m.before':
      'Un shooter espacial en 3D que cabe en 50 KB, hecho para el ',
    'arcade.m.after': ' — y el easter egg que siempre quise para esta página.',
    'work.crol.m.after':
      ', un ERP en la nube para empresas en México. La construí desde cero, diseño incluido.',
    'work.salvalo.m':
      'Los comercios convierten lo que no vendieron en packs; tú apartas uno cerca y lo recoges en el local. Rediseñé la app e hice su web y sus paneles.',
    'work.maktub.m':
      'El sitio de un fondo que invierte en arte en Latinoamérica, en línea en un mes; su equipo lo edita todo sin código.',
    'events.title': 'Eventos',
    'events.hackathon': 'Hackathon',
    'events.alegria.when': 'oct 2025',
    'events.alegria.body':
      'Esta tiene más historia. [Pastor](pastor), que estudió conmigo en primaria y secundaria, un día de repente me escribe y me presenta a [Ale](ale) y a [Cesar](cesar) para aplicar a una hackathon organizada por [Yummy](yummy), [Cashea](cashea), [Slash](slash) y AlegrIA Labs en las oficinas de Yummy en Caracas. Seguramente el Juan de antes habría dicho que no por pena, por miedo o por flojera, pero en ese momento dije: como mínimo vamos a aprender muchísimo y vamos a darle. Tuvimos varias reuniones, decidimos que la idea iba a ser [Tripealo](tripealo), un marketplace de experiencias de viaje para Venezuela, hicimos el video de aplicación y, de entre más de mil personas, quedamos entre los 100 seleccionados para construir durante 36 horas en Caracas. No ganamos ni quedamos en el top 10, pero me enseñó muchísimo de cómo funciona el mundo de las startups y de mí mismo. Ellos continuaron con Tripealo y yo salí para empezar [Salvalo](salvalo), pero siempre andamos juntos en el mundo de las startups. De todos los eventos a los que voy guardo los identificadores como si fuesen gemas del infinito, porque al verlos me teletransporto a ese momento, a las charlas y a los founders que conocimos. Fue el turning point entre el Juan que solo trabaja programando y el Juan que quiere hacer productos que use la gente: un cambio de chip total el antes y el después de ese octubre en Caracas.',
    'events.alegria.m':
      'Tres días en el primer hackathon de vibe coding de Venezuela, en Caracas. Sin premio, pero con amigos nuevos y lecciones de los fundadores de [Yummy](yummy), [Cashea](cashea) y [Slash](slash). Fue el empujón que necesitábamos para arrancar con [Tripealo](tripealo) y con [Salvalo](salvalo).',
    'events.talk': 'Charla',
    'events.ilc.when': 'sept 2026',
    'events.ilc.body':
      'En la hackathon de AlegrIA Labs habló [Pedro Vallenilla](pedro) por videollamada, y un año después vino a Barquisimeto, mi ciudad en el estado Lara, Venezuela, a dar una charla de liderazgo junto al [Padre Elías Sayegh](elias). Fuimos de nuevo con el team y quedamos literalmente en la segunda fila del [teatro](juares), súper cerca. Para prepararme me había visto todas sus entrevistas, y en ese evento contó historias bastante específicas que no había escuchado antes. Me quedó mucho que para él Venezuela es un greenfield: después de todo lo que ha pasado, hay muchísimo espacio para crear productos tecnológicos que en otros países de Latinoamérica ya existen. Fíjate en [Cashea](cashea): crédito sin ser un banco, contra todos los odds, cuando al principio tenían que ir de negocio en negocio y les decían que estaban locos. Ese ímpetu de echar pa’lante cuando otros proyectos no funcionaron hasta dar con Cashea — que hoy mueve porcentajes del PIB de Venezuela — fue súper cool verlo en persona.',
    'events.ilc.m':
      '[Pedro Vallenilla](pedro) de [Cashea](cashea), esta vez en persona y en mi ciudad: una startup que funcionó, varias que no, luego Cashea, y por qué Venezuela es el lugar para construir.',
    'events.interview': 'Entrevista',
    'events.radio.when': 'oct 2026',
    'events.radio.body':
      'Esta fue la primera entrevista de [Salvalo](salvalo) en la radio, en el programa de [Cheo Noguera](cheo) en [OK 101.5 FM](ok101) de Barquisimeto. Yo estaba en el estudio y mi cofundador estaba conectado desde Madrid. Expliqué el ejemplo de siempre: haces 10 cachitos, a las 4 te quedan 3 y armas un pack con eso. En el live había personas preguntándonos cómo descargarla, y explicamos directamente qué es Salvalo a todos los oyentes.',
    'events.radio.m':
      'La primera entrevista de [Salvalo](salvalo), en vivo en [OK 101.5 FM](ok101) de Barquisimeto: el locutor descargó la app al aire mientras se la explicaba a sus oyentes.',
    'events.meetup': 'Encuentro',
    'events.panal.when': 'oct 2026',
    'events.panal.body':
      '[El Panal](panal) es un movimiento que creó [Manuel Sira](manuel) aquí en Barquisimeto: muchas personas construyendo de todo. Hay gente de marketing, de moda, CRM, inventario, aplicaciones de psicología y de salud, y hubo charlas de inteligencia artificial, de cómo hacer crecer tu empresa midiendo bien sus datos y de cómo diferenciarte en la era de la IA teniendo buen gusto al crear. Cada startup que fue al evento tenía 30 segundos para hacer su pitch, y yo, nervioso, di el de [Salvalo](salvalo). No fue el mejor que he dado, pero sí el primer pitch oficial de Salvalo en un evento de ese calibre. Fui con mis amigos de [Tripealo](tripealo) y salí con amigos nuevos de otras aplicaciones, contactos y uno que otro lead para Salvalo. Fue el calentamiento justo antes de irnos al Startup Summit en Caracas: la práctica antes de la práctica.',
    'events.panal.m':
      'Una noche de [El Panal](panal) en Barquisimeto: charlas de IA, datos y gusto, y 30 segundos para el pitch de [Salvalo](salvalo). Nervioso, pero lo di, y me fui con amigos nuevos y uno que otro lead.',
    'events.summit': 'Summit',
    'events.summit.when': 'oct 2026',
    'events.summit.body':
      'Estuve en el [Startup Venezuela Summit](summit), en el Caracas Campus. La verdad es que nunca había ido a un evento así. Hubo charlas todo el día, gente de otros países haciendo conexiones, y todo el mundo estaba construyendo todo tipo de productos. Escuchamos de nuevo a [Víctor Cárdenas](slash), de Slash, y a [Pedro Vallenilla](pedro), de [Cashea](cashea). También estuvimos en un workshop con [Enrique Rivas](enrique), de [Fina](fina) e [Innoven](innoven). Postulé a [Salvalo](salvalo) en el stand de Innoven y pegué nuestra foto en la pared de founders venezolanos para dejar la huella. También conocí a muchas personas, como a uno de los cofundadores de [Rial](rial). Lo que más me llevé de los dos días es que hacer una startup es difícil, pero vale la pena: con ambición, ganas y pasión lo puedes lograr. No importa tu edad, tu país ni de dónde vienes: si estás dispuesto a hacerlo, se puede lograr. Y lo otro es lo que dijo Steve Jobs: los que están lo suficientemente locos como para creer que pueden cambiar el mundo son los que realmente lo hacen. Llegué a mi casa súper emocionado, terminando de procesar todas las charlas y experiencias que viví en esos dos días.',
    'events.summit.m':
      'Dos días en el Startup Venezuela Summit con [Tripealo](tripealo): charlas de [Slash](slash) y [Cashea](cashea), un workshop privado con Fina e Innoven al que nos invitaron por nuestras chaquetas de founders, y [Salvalo](salvalo) en la pared de founders venezolanos.',
    'events.platanus.when': 'oct 2026',
    'events.platanus.body':
      'Justo saliendo del Startup Venezuela Summit, fuimos directo a [Platanus Hack 26 Caracas](platanus). Platanus hizo su hackathon en modo gira por Latinoamérica, y mi equipo y yo quedamos en la edición de Caracas. Aplicamos con nuestros perfiles de desarrollador, el mismo equipo de la hackathon de AlegrIA, no como [Tripealo](tripealo) ni como [Salvalo](salvalo), sino cada uno con su perfil. Fue gracioso: literalmente un año después de AlegrIA 2025, volvimos a las oficinas de [Yummy](yummy) a otra hackathon, pero esta vez mucho más fuerte a nivel técnico. Construimos [Tridi](tridi), que convierte un video normal de una persona en data de movimiento para robots: un robot simulado aprende a moverse solo imitándote. Tomas cualquier video, se rastrea el movimiento y se lleva a una simulación física, el robot aprende a moverse en distintos terrenos y condiciones, y se exportan los datos y el modelo entrenado listos para hardware. Lo hicimos bajo la premisa de que la robótica y la IA is the new sexy. Dormimos poco, pero lo que aprendí en AlegrIA y todo ese trabajo mental me sirvió muchísimo. Y no solo a mí: todo el equipo estuvo muy locked in. Nuestro mentor fue [Sebastián Alcalá](sebastian), product engineer en Yummy y cofundador de [Wink](wink). No ganamos, pero el nivel estuvo brutal, a la par de Buenos Aires, México y Bogotá. Como dato curioso, nuestra mesa estaba justo al lado del arcade de Platanus Hack, para el que hice Space Explorer. Varias veces, mientras trabajábamos, veíamos a otros participantes pasar y jugarlo, y siempre me voy a acordar de sus caras de «epa, mira, este juego está chulo». No les dije nada para que lo disfrutaran a su manera sin estar yo en medio. También hicimos grandes amigos y conexiones: el talento técnico en Venezuela es duro. Ya llevábamos dos hackathons seguidos juntos, y como dicen, la tercera es la vencida.',
    'events.platanus.m':
      'Del Summit directo a Platanus Hack 26 Caracas, de vuelta en las oficinas de [Yummy](yummy) con el equipo de AlegrIA: construimos [Tridi](tridi), video convertido en data de movimiento para robots. Sin premio, pero una hackathon mucho más fuerte, y gente jugando Space Explorer al lado.',
    'likes.title': 'Más de mí',
    'likes.cosmos.name': 'Cosmos',
    'likes.cosmos.body':
      'El espacio siempre me ha fascinado. Al ver lo vasto que es, lo infinitas que son sus escalas, tan solo a nivel galáctico, mucho de lo que me preocupa o pienso de la vida, de lo que quiero y de lo que no quiero, deja de tener sentido. Hay cosas tan imponentes allá afuera, como un agujero negro o una supernova, y nosotros somos una mente tan compleja en un cuerpo tan frágil, débil y mortal: un contraste de otra escala. Todo lo que ha pasado y pasará en la historia de la humanidad, hasta ahora, ha pasado en este planeta, uno de los muchos del sistema solar, que es uno de los muchos sistemas de la Vía Láctea, que es una de las muchas galaxias de un cúmulo, de un supercúmulo, y así sucesivamente. La estrella más cercana está a cuatro años luz de distancia: escalas tan grandes que dices «wow». Ahorita mismo hay alguien feliz por algo que le pasó y alguien triste, gente naciendo y gente muriendo, gente construyendo y gente destruyendo. Es un contraste tan loco que parece una simulación: cada uno cree que es especial, pero somos un personaje que puede tener efecto en el mundo, no a nivel universal. El universo es indiferente hacia el humano. Y en vez de rechazar ese sentimiento, aprendí a admirarlo y a amar la existencia misma: es increíble que seamos el universo experimentándose a sí mismo, en toda su grandeza. Por eso empecé a ver muchas fotos del espacio del [James Webb](webb) y del [Hubble](hubble), y duraba horas viendo una sola foto sin escuchar nada, inmerso, absorbido por esas imágenes. Uno se pregunta si son reales o un montaje, y sí, son de verdad. Estas son mis favoritas, y no tengo manera de rankearlas: no sé cuál es mejor que otra. Unas son a nivel de estrellas y otras a nivel de galaxias, donde dices «esto es una galaxia entera», con quién sabe cuántos sistemas solares, y nosotros ni siquiera hemos explorado nuestro planeta completo. Así como me encantan, las quería compartir acá.',
    'likes.songs.name': 'Canciones',
    'likes.songs.meta': 'Mi ranking',
    'likes.songs.body':
      'Aquí les comparto algunas de mis canciones favoritas. Si se fijan, tienen un estilo electrónico, que yo llamo cibernético, futurista: no sé si se llama techno o qué. Mientras menos letra tenga una canción, más me gusta: para mí son más música que canciones, y esas sí son mi top. Sería chulo que intentaran adivinar mis partes favoritas, los clips que tengo de cada canción en mi librería personal de [Sound Shaper](shaper), como un ejercicio para conocerme más. Las demás son canciones de todo tipo, para que puedan probar todos los filtros y el modo DJ en vivo aquí mismo en la página.',
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
    'shape.levels.off': 'Desactivado',
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
      'Mezcla partes de todas estas canciones en un set, distinto cada vez.',
    'shape.autoDjPreparing': 'Leyendo canciones',
    'shape.autoDjProgress': '{ready} de {total}',
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
    'soon.narration': '在中文模式下，你会听到我的英语原声，并可以跟着中文文字阅读。',
    'soon.close': '关闭',
    'hero.hi': '你好',
    'store.soon': '即将推出',
    'launch.new': '新',
    'launch.shaper': 'Sound Shaper 现已推出网页版。',
    'launch.get': '打开',
    'store.web': '打开',
    'hero.caption':
      '嗨，我是 Juan Villa，我热爱做软件。我常说我喜欢用打电子游戏的方式来做软件，那就是冲着白金奖杯去。我觉得软件是人类创造的最美好的事物之一，因为它最接近魔法。只要你能想象出来并找到实现的方法，它就能让你无中生有。如果之后再把它和硬件结合起来，就能做出非常非常酷的东西。在这个页面上，我会展示我目前正在忙什么，以及我喜欢的事物，而且全部由我亲自讲述。我对自己说：我们要做一个没有任何参考模板的网站，这里的一切都是我不参考任何人的作品独立搭建的。我又想，怎样才能让它尽可能真实、真诚？那就是把自己录进视频里——这就是我本人，不是 AI——当然还有我的声音。这里记录了我刚才提到的一切，希望你们喜欢。',
    'footer.caption':
      '好了，谢谢你听我说。如果你有什么想法，可以在 LinkedIn 或 Instagram 上给我发消息。我还在继续做东西，也还在继续冲白金。',
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
      '我以前常在 YouTube Music 听歌，但广告总是弹出来。很多时候，如果我喜欢一首歌，我就喜欢听它的慢速版、加速版、超慢版或超快版。而且大多数时候，我其实只想听歌里我真正喜欢的那 20 或 30 秒，一遍又一遍地循环播放。',
    'shaper.solution':
      '所以我做了 Sound Shaper，一个甚至不需要网络就能用的个人 MP3 播放器。每首歌只要导入一次，就能调慢、调快，加上你想要的音效，调节均衡器，还能把最喜欢的部分做成片段。在 YouTube Music 上，别人上传的歌是什么样就是什么样，想听别的版本只能祈祷有人上传过；而在这里，你把歌加进来、自己动手调，由你决定怎么听，全凭你的喜好。它原本只是我做给自己用的工具，但实在太好用了，而且做出来的效果我很满意，所以我决定把它发布出来与大家分享。',
    'shaper.s1.p1':
      '这是你的资料库。这个应用本身不下载音乐：你自己导入自己的 MP3，仅供个人使用，在这里按住拖动就能按你喜欢的顺序排列。',
    'shaper.s1.p2':
      '它支持小组件、锁定屏幕和灵动岛。从这里也能进入设置，修改账户信息、应用语言和外观。还有一个小细节：像 PlayStation 那样的奖杯。你用得越多，解锁的奖杯就越多，直到拿到珍贵的白金奖杯。',
    'shaper.s2.p1':
      '这是播放器界面，很常规，就像 YouTube Music、Spotify 或 Apple Music 一样。在这里你可以播放、暂停和切换歌曲。',
    'shaper.s2.p2':
      '真正的重点在下方的工具栏，从那里可以打开 Shape 和 Clips。这两个功能就是这个应用存在的理由。',
    'shaper.s3.p1':
      'Sound Shaper 这个名字就来自这里，来自 Shape：因为这个应用就是一个声音塑形器。里面有现成的预设，懂一点音乐的话也可以手动调均衡器，还能把歌曲的速度调慢或调快，随你喜欢。',
    'shaper.s3.p2':
      '保持原调是做起来最有意思的部分。在 YouTube 上，把歌曲放慢后，人声听起来就像慢动作一样失真；而在这里，你可以选择在放慢节奏的同时让音色保持正常，反过来加速也一样，不会变成花栗鼠般尖锐的声音，而是保留原本的声线。里面还有回声和隔壁房间（next room）这样的音效，可以组合起来，让音乐听起来像在演唱会现场、在演唱会外面的停车场，或者像在听隔壁邻居家的派对。有时戴上耳机、闭上眼睛，它真的能把你带到那个场景里，非常有意思。这里给你一个简短的例子，听听 Bad Bunny 和 Jhay Cortez 的 DÁKITI 配上应用里的音效是什么效果——在下面的歌曲板块你还可以试听更多歌曲并实时体验这些音效。',
    'shaper.s4.p1':
      'Clips 的灵感来自 Apple 的语音备忘录，我正是用那个应用录下了做这个软件和这个网站的想法。你只要选出歌曲里最喜欢的那一段，再给它起个名字就好了。',
    'shaper.s4.p2':
      '把它保存为片段，就能一遍又一遍地循环听。在这里也可以打开 Shape，让你正在制作或编辑的片段完全照你的方式响起。',
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
      'Space Explorer 最初是我为自己的应用做的彩蛋。每次做应用，我都喜欢在里面藏个小彩蛋；在 Sound Shaper 里，只要进入某个特定界面、按特定组合连点几下，Space Explorer 就会作为隐藏游戏打开。它原本有好几个关卡——海底、太空、以及一场大型太空战——但最后我没有放进正式版里，免得让应用变得太复杂、体积变大或显得累赘。几个月后，我们报名了 [Platanus](platanus) 黑客松，发现有一个可选的街机挑战，可以为他们办公室的街机做一款游戏。我想到自己手头正好有现成的原型，而且报名还能增加入选黑客松的机会，就决定把它改造成街机版提交上去。这是一款只有 50 KB 的 3D 太空射击游戏——注意是 KB，不是 MB，文件极小，挑战的难点就在于把所有内容塞进 50 KB 里，说实话成品相当酷。你可以在这个页面上直接玩，也可以在 Platanus 的官方网站上玩。虽然它没有拿奖，但依然是一款超酷的游戏，也是我对自己作品精益求精的一个缩影。',

    // More Work — the secondary projects carousel.
    'work.title': '更多作品',
    'deck.prev': '上一个',
    'deck.next': '下一个',
    'photo.open': '查看原图',
    'work.present': '至今',
    'work.cofounder': '联合创始人',
    'work.freelance': '自由职业',
    // One paragraph around a link to Crol; its clip is `work.crol.body`.
    'work.crol.body':
      '在面向墨西哥企业的云端 ERP [Crol](crol)，我最初打造了 Conto Pay，它是 Crol 更简单、更好用的版本：包括它的主站、落地页和移动应用。而这个应用后来成为了 Crol ERP Móvil 的基础——我也从零开始设计并独立开发了这款移动应用。',
    'work.salvalo.body':
      '我是 Salvalo 的联合创始人，这是我的创业公司。商家每天打烊时都有还能卖的商品，在 Salvalo 上把它们变成带价格和取货时间的组合包。顾客在应用的地图上找到附近的组合包，预订，直接付款给商家，再凭验证码取货。我常举的例子：一家面包店早上有 10 个 cachito，到下午 5 点还剩 3 个和 2 个法式面包，就把它们打包，用打烊折扣价出售。商家赢了，因为商品卖出去而不是浪费，还多了顾客，因为 Salvalo 是额外的销售渠道。顾客则在下午以优惠价、非常方便地买到早上那些 cachito。我是技术联合创始人：我重新设计了应用和网站，负责全部前端开发。我也是 Salvalo 在委内瑞拉的代表，所以会去向商家介绍，也代表 Salvalo 参加各种活动。',
    'work.maktub.body':
      'Maktub Art Fund 是一位来自墨西哥的客户。那是一个落地页，这类项目我平时很少接，因为常规网站的开发往往大同小异，但这个项目的视觉设计非常漂亮、现代又时尚，一下吸引了我，所以我接手把它做了出来，最终成品也相当酷。',

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
    'arcade.m.before': '一款只有 50 KB 的 3D 太空射击游戏，为 ',
    'arcade.m.after': '而做——也是我一直想给这个网站的彩蛋。',
    'work.crol.m.after':
      ' 的移动应用，一款面向墨西哥企业的云端 ERP。我从零打造，包括设计。',
    'work.salvalo.m':
      '商家把没卖完的商品做成套餐，你预订附近的一份、到店自取。我重新设计了应用，并打造了它的网站和后台。',
    'work.maktub.m':
      '一家投资拉丁美洲艺术的基金的网站，一个月上线；团队无需代码即可编辑全部内容。',
    'events.title': '活动',
    'events.hackathon': '黑客松',
    'events.alegria.when': '2025 年 10 月',
    'events.alegria.body':
      '这一段故事更多。有一天，和我一起读小学和中学的 [Pastor](pastor) 给我发消息，介绍我认识 [Cesar](cesar) 和 [Ale](ale)，一起报名一场黑客松：他们还差一个人，问我愿不愿意加入。以前的 Juan 会因为害羞或嫌麻烦而拒绝，但这次我想，最坏不过是没被录取，至少我们能学到很多。我们头脑风暴了好几个点子，最后胜出的是 [Tripealo](tripealo)，一个委内瑞拉旅游体验的交易平台。在一千多名报名者中，我们入选了前一百名，去加拉加斯 [Yummy](yummy) 总部参赛。虽然最后没有获奖，但我现场听了许多在硅谷与美国顶尖公司同台竞技的创始人分享，带着满满的动力离开。之后他们继续深耕 Tripealo，而我则和我的联合创始人全力投入了 [Salvalo](salvalo)。如今他们就像我的创始人兄弟：大家并肩作战，各自打磨各自的产品。这成了我人生的一个转折点——从以前单纯写代码的程序员 Juan，蜕变成真正开始打造自己产品的创业者 Juan。我非常感谢那段经历，它让我从许多人身上学到了很多，也让我更了解自己。',
    'events.alegria.m':
      '在加拉加斯参加委内瑞拉第一场 vibe coding 黑客松的三天。没有拿奖，却交到新朋友，也从 [Yummy](yummy)、[Cashea](cashea) 和 [Slash](slash) 的创始人那里学到很多。它正是让 [Tripealo](tripealo) 和 [Salvalo](salvalo) 起步的那一推。',
    'events.talk': '讲座',
    'events.ilc.when': '2026 年 9 月',
    'events.ilc.body':
      '此前在由 [Cashea](cashea) 和 [Yummy](yummy) 主办的 AlegrIA 黑客松上，我们曾与 Cashea 的联合创始人 [Pedro Vallenilla](pedro) 进行过一次线上交流。几个月后，他亲自来到我的家乡巴基西梅托，与 [Elías Sayegh 神父](elias) 一起带来了一场更深入、更完整的升级版分享。我们就坐在[胡亚雷斯剧院](juares)的正前方第二排。他讲述了自己在做出现象级产品 Cashea 之前，曾连续经历过好几次创业失败，但他一直坚持到了最后。最让我触动的是他对委内瑞拉的看法：在经历了这一切之后，这里反而成了一片可以建造任何事物的旷野，因为许多在其他国家早已普及的科技方案在这里依然空白。因此，无论从哪个角度看，现在的委内瑞拉正处于创业的黄金时代——这不仅是理论，更是正在发生的现实。',
    'events.ilc.m':
      '这次在我的城市亲耳听 [Cashea](cashea) 的 [Pedro Vallenilla](pedro) 讲：一次成功的创业，接连几次失败，然后是 Cashea，以及为什么委内瑞拉是创造的好地方。',
    'events.interview': '采访',
    'events.radio.when': '2026 年 10 月',
    'events.radio.body':
      '这是 [Salvalo](salvalo) 的第一次电台采访，在巴基西梅托 [OK 101.5 FM](ok101) 的 [Cheo Noguera](cheo) 节目里。我在录音室，我的联合创始人从马德里连线。我讲了那个老例子：你做了 10 个 cachito，到 4 点还剩 3 个，就把它们做成一个组合包。直播里有人问我们怎么下载，我们就当场向所有听众解释了 Salvalo 是什么。',
    'events.radio.m':
      '[Salvalo](salvalo) 的第一次采访，在巴基西梅托 [OK 101.5 FM](ok101) 直播：主持人在节目中下载了 App，我向听众讲解它的用法。',
    'events.meetup': '交流会',
    'events.panal.when': '2026 年 10 月',
    'events.panal.body':
      '[El Panal](panal) 是 [Manuel Sira](manuel) 在巴基西梅托发起的一个运动：很多人在这里做各种各样的东西。有做营销、时尚、CRM、库存，以及心理和健康应用的人，还有关于人工智能、如何衡量数据来发展公司、以及在 AI 时代如何靠品味脱颖而出的演讲。每个到场的初创公司都有 30 秒的路演时间，我很紧张，但讲了 [Salvalo](salvalo) 的。那不是我讲得最好的一次，却是 Salvalo 在这种级别活动上的第一次正式路演。我和 [Tripealo](tripealo) 的朋友们一起去，离开时多了来自其他应用的新朋友、新联系人，还有几个 Salvalo 的潜在客户。那正是我们去加拉加斯参加 Startup Summit 之前的热身：练习之前的练习。',
    'events.panal.m':
      '在巴基西梅托参加 [El Panal](panal) 的一个夜晚：关于 AI、数据和品味的讲座，还有 30 秒为 [Salvalo](salvalo) 路演。很紧张，但我讲完了，带走了新朋友和几条潜在客户线索。',
    'events.summit': '峰会',
    'events.summit.when': '2026 年 10 月',
    'events.summit.body':
      '我参加了在 Caracas Campus 举办的 [Startup Venezuela Summit](summit)。说实话，我从没去过这样的活动。一整天都有讲座，来自其他国家的人在建立联系，每个人都在做各种各样的产品。我们再次听了 Slash 的 [Víctor Cárdenas](slash)，还有 [Cashea](cashea) 的 [Pedro Vallenilla](pedro)。我们还参加了 [Fina](fina) 和 [Innoven](innoven) 的 [Enrique Rivas](enrique) 主持的工作坊。我在 Innoven 的展位为 [Salvalo](salvalo) 报了名，还把我们的照片贴在委内瑞拉创始人墙上留下印记。我也认识了很多人，比如 [Rial](rial) 的一位联合创始人。这两天我最大的收获是：创业很难，但值得；只要有野心、动力和热情，你就能做到。无论你多大、来自哪个国家、出身如何：只要你愿意去做，就能做到。还有一点是史蒂夫·乔布斯说的：那些疯狂到以为自己能改变世界的人，才是真正改变世界的人。回到家时我非常兴奋，还在消化这两天经历的所有讲座和体验。',
    'events.summit.m':
      '和 [Tripealo](tripealo) 在 Startup Venezuela Summit 的两天：[Slash](slash) 和 [Cashea](cashea) 的分享，因为创始人夹克被邀请参加的 Fina 与 Innoven 私人工作坊，还有贴上委内瑞拉创始人墙的 [Salvalo](salvalo)。',
    'events.platanus.when': '2026 年 10 月',
    'events.platanus.body':
      '刚离开 Startup Venezuela Summit，我们就直接去了 [Platanus Hack 26 Caracas](platanus)。Platanus 把黑客松办成了拉美巡回，我和我的团队入选了加拉加斯站。我们以开发者身份报名，还是 AlegrIA 黑客松的同一支队伍，不是以 [Tripealo](tripealo) 或 [Salvalo](salvalo) 的名义，而是各自以个人背景报名。很有意思：在 2025 年 AlegrIA 黑客松整整一年后，我们又回到 [Yummy](yummy) 的办公室参加另一场黑客松，只是这次技术难度高得多。我们做了 [Tridi](tridi)，它把一段普通的人物视频变成机器人的动作数据：一个模拟机器人通过模仿你自己学会移动。拿任意一段视频，追踪其中的动作并导入物理模拟，机器人在不同地形和条件下学会移动，然后把模拟数据和训练好的策略导出为可用于硬件的格式。我们的出发点是：机器人和 AI 就是新的潮流。我们睡得很少，但在 AlegrIA 学到的东西和磨炼出的心态帮了我很多，整个团队都非常投入。我们的导师是 [Sebastián Alcalá](sebastian)，Yummy 的产品工程师，也是 [Wink](wink) 的联合创始人。我们没有赢，但整体水平令人惊叹，丝毫不逊于布宜诺斯艾利斯、墨西哥和波哥大。一个有趣的细节：我们的桌子就在 Platanus Hack 街机旁边，我就是为它做了 Space Explorer。好几次我们工作时看到其他参赛者走过来玩，我会一直记得他们脸上那种“哇，这游戏真酷”的表情。我没有出声打扰，让他们自己享受游戏。我们还交了很多朋友：委内瑞拉的技术人才真的很强。那已经是我们一起连续参加的第二场黑客松了，正所谓事不过三。',
    'events.platanus.m':
      '从峰会直接去了 Platanus Hack 26 Caracas，和 AlegrIA 的队友回到 [Yummy](yummy) 的办公室：我们做了 [Tridi](tridi)，把视频变成机器人的动作数据。没有拿奖，但这是一场难得多的黑客松，旁边还有人在玩 Space Explorer。',
    'likes.title': '更多关于我',
    'likes.cosmos.name': '宇宙',
    'likes.cosmos.body':
      '太空一直让我着迷。当你看到它有多浩瀚、它的尺度有多无限，哪怕只是在星系的层面，很多让我担心的事、我对人生的想法、我想要和不想要的东西，都不再有意义。外面有那么宏伟的东西，比如黑洞或超新星，而我们是装在如此脆弱、虚弱又会死去的身体里的如此复杂的心智：这是另一个尺度上的反差。人类历史上发生过和将要发生的一切，到目前为止，都发生在这颗星球上，它是太阳系众多行星之一，太阳系是银河系众多星系之一，银河系又是一个星系团、一个超星系团中的众多星系之一，如此类推。离我们最近的恒星在四光年之外：尺度大到你只能说“哇”。此时此刻，有人因为发生在自己身上的事而开心，有人在难过，有人出生，有人死去，有人在建造，有人在毁灭。这种反差疯狂到像一场模拟：每个人都以为自己很特别，但我们只是一个能对世界产生影响的角色，在宇宙的尺度上却不是。宇宙对人类漠不关心。我没有排斥这种感觉，而是学会了欣赏它，去爱存在本身：我们就是宇宙在体验它自己的伟大，这太不可思议了。所以我开始看很多[詹姆斯·韦伯](webb)和[哈勃](hubble)拍的太空照片，常常对着一张照片看上好几个小时，什么也不听，沉浸其中，被这些画面吸引。你会怀疑它们是真的还是合成的，而它们确实是真的。这些是我最喜欢的，我没办法给它们排名：我不知道哪张比哪张更好。有些是恒星尺度的，有些是星系尺度的，你会说“这是一整个星系”，里面不知道有多少个太阳系，而我们连自己的星球都还没有完全探索过。正因为我这么喜欢它们，所以想在这里分享。',
    'likes.songs.name': '歌曲',
    'likes.songs.meta': '我的排行',
    'likes.songs.body':
      '这里和大家分享一些我最喜欢的歌。仔细听，它们都有一种电子风格，我称之为赛博、未来感：我也不知道它是不是叫 techno。一首歌的歌词越少，我越喜欢：对我来说它们更像是音乐而不是歌曲，这些才是我的最爱。如果你们能猜猜我最喜欢的部分，也就是我在自己的 [Sound Shaper](shaper) 曲库里为每首歌保存的片段，会很有意思，也算是更了解我的一种方式。其余的是各种类型的歌，方便你们直接在这个页面上试试所有的滤镜和实时 DJ 模式。',
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
    'shape.autoDjDescription': '将这里所有歌曲的片段混成一套，每次都不同。',
    'shape.autoDjPreparing': '正在读取歌曲',
    'shape.autoDjProgress': '{ready}/{total}',
  },
};
