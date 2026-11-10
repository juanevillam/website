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
    "I'm currently recording the English videos. For now you'll see and hear me in Spanish with English subtitles.",
  'soon.narration.zhAfterEn':
    "I'm currently recording the Chinese videos.",
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
    "Thank you so much for listening to me, watching me and reading me. If you have any comments, you can reach me through the different channels available, while I keep building and going for the platinum. If you made it all the way here and watched everything on the main page, congratulations, because some of these takes were really long. As a fun fact, I didn't record all these videos in a single session—or I would have lost my voice—and out of many takes I always picked the one that felt most natural, which is why my framing changes or you might hear rain in the background. I'm super happy to have built this page; let's see what I build next, and thanks for stopping by.",
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
    "Space Explorer started as an easter egg for my apps, in this case Sound Shaper: you'd tap a secret sequence in a specific spot and a level or two would unfold with a story connecting all my apps. It overcomplicated the product and was so hidden only I knew where it was, so I took it out to keep Sound Shaper simple. Right around that time we applied to a [Platanus](platanus) hackathon in Caracas that had a side challenge to build an arcade game in at most 50 kilobytes. Since I already had the concept, I turned Space Explorer into a 3D space shooter under 50 KB — complete with a black hole and tight ship controls, leaning into technical 3D craft rather than pixel art. You can play it right here on this page or on [Platanus Hack's official site](arcade). Very few entries at the hackathon were 3D, and I'm leaving it exactly as it shipped for the hackathon.",

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
    "I'm a cofounder of [Salvalo](salvalo), my startup as a first-time founder, and it's a food-offers marketplace. Every day in Venezuela businesses close the day with food or products that could have been sold, and Salvalo solves that problem: imagine a bakery that makes 10 cachitos in the morning and by the afternoon has 3 left along with 2 French breads, puts together a pack and sells it through the app at a closing offer price. Both sides win because the shop doesn't lose the product, lands a sale and gains a new customer through Salvalo as an external sales channel, while the customer gets the morning's fresh cachitos in the afternoon at a bargain price in a super convenient way. The app flow is simple—the hard part is onboarding shops and bringing in customers—and as Salvalo's representative here in Venezuela I've been focusing heavily on sales, pitching businesses in person and overcoming my old introverted side, while as a technical founder I also worked on the web system, landing page and mobile app. A real startup experience pushes you to grow both as a founder and as a person, and most of the events I attended this year—like El Panal and the Startup Venezuela Summit—were representing Salvalo here in the country where I was born and live; that's Salvalo, so go save your packs.",
  'work.maktub.body':
    "[Maktub Art Fund](maktub) is a client from Mexico. It's a standalone landing page — which normally wouldn't catch my eye on its own — but it had a really interesting, modern, fashion-forward design I hadn't built before, and I really liked how the final result turned out.",

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
    "This was [Salvalo](salvalo)'s first radio interview on [OK 101.5 FM](ok101) on [Cheo Noguera](cheo)'s show here in Barquisimeto. It was my first time on the radio—I had been on TV much younger—and my cofounder Abrahan joined online from Spain. I thought I would be nervous, and instead I just wanted to keep talking: we shared our story and how we started, answered listeners right there as people installed the app, and I gave the example I always use—imagine a bakery makes 10 cachitos in the morning and by 6 in the afternoon 3 are left, so with those 3 cachitos and 2 French breads you build a pack at a closing offer price in the app as an extra sales channel that saves the product, lands the sale and brings in a new customer, while the customer gets the morning's fresh cachitos and French bread at an offer price. I also value every event I go to representing Salvalo as startup founder training for the projects ahead—learning how to explain a startup to any profile, like a bakery owner of 20 years—and I hope to be back on the mic soon.",
  'events.radio.m':
    "[Salvalo](salvalo)'s first interview, live on [OK 101.5 FM](ok101) in Barquisimeto: the host downloaded the app on air while I walked his listeners through it.",
  'events.meetup': 'Meetup',
  'events.panal.when': 'Oct 2026',
  'events.panal.body':
    "[El Panal](panal) is a movement [Manuel Sira](manuel) created here in Barquisimeto to bring together every kind of tech profile in Lara state so it isn't always only in Caracas. I went with my friends from [Tripealo](tripealo), and out of around 140 people at the Jirajara Hotel, a few rounds of founders got 30 seconds on the big countdown screen to pitch; I passed in the second round and gave [Salvalo](salvalo)'s first official pitch with my classic bakery example. I was nervous with the 30-second buzzer behind me, yet I finished the whole pitch and took it as great practice alongside people building psychology apps, a bathroom-finder app called [Resty](resty), marketing, fashion and CRMs. There were talks on growing your business by measuring internal data and on how, in the era of AI, what sets you apart isn't just technical execution—since machines can build anything—but human taste, like a master carpenter's handcrafted armchair versus a factory one. Each person is a cell in the honeycomb connecting with others: I landed leads for Salvalo, practiced losing the fear of pitching as a first-time founder, and added the second event badge to my collection.",
  'events.panal.m':
    'A night of [El Panal](panal) in Barquisimeto: talks on AI, data and taste, and 30 seconds to pitch [Salvalo](salvalo). Nervous, but I gave it, and left with new friends and a lead or two.',
  'events.summit': 'Summit',
  'events.summit.when': 'Oct 2026',
  'events.summit.body':
    "I attended the [Startup Venezuela Summit](summit) at Caracas Campus, and I had never been to an event like it. We saw [Pedro Vallenilla](pedro) of [Cashea](cashea) and [Víctor Cárdenas](slash) of Slash again, met one of the cofounders of [Rial](rial) and people from abroad—including Venezuelan-founded US venture funds that were early investors in Anthropic—making it the most global tech event I've experienced. Beyond the main stages, the app updated in real time with sessions inside the corporate offices at Caracas Campus, including a reverse pitch where VCs pitched founders and shared how they look for startups aiming for a billion dollars a year. We also joined a private workshop with [Fina](fina) and [Innoven](innoven), where I applied with [Salvalo](salvalo), put my photo on the wall and got an Innoven cap. My biggest takeaway—echoing Steve Jobs on those crazy enough to change the world, and adding another badge to my collection alongside my friends from [Tripealo](tripealo)—is that no matter your age or background, if you put your heart into building a startup and aim for the global big leagues, you can make it happen.",
  'events.summit.m':
    "Two days at the Startup Venezuela Summit with [Tripealo](tripealo): talks by [Slash](slash) and [Cashea](cashea), a private workshop with Fina and Innoven we were invited to for our founders' jackets, and [Salvalo](salvalo) on the wall of Venezuelan founders.",
  'events.platanus.when': 'Oct 2026',
  'events.platanus.body':
    "Right after leaving the Startup Venezuela Summit we went straight to [Platanus Hack 26 Caracas](platanus), Platanus Ventures' first Latin America hackathon tour, held once again at [Yummy](yummy)'s offices a full year after the AlegrIA hackathon. We built non-stop for 36 hours on very little sleep, applying everything my team and I had learned in past hackathons under the premise that Physical AI is the new sexy. We chose the 3D track and created [Tridi](tridi), which takes ordinary video of people—from a camera or pre-recorded—and turns it into training data and policies for humanoid robots, or even a Mars rover, inside a physics simulation we built so robots can learn everyday actions before touching the real world. We didn't win, though the technical level in Caracas was right up there with Buenos Aires, Mexico City and Bogotá, and we were grateful to the Platanus and Yummy teams and our mentor [Sebastián Alcalá](sebastian), product engineer at Yummy and cofounder of [Wink](wink), as we aim for third time's the charm next year. The badge they gave us is a card-sized NFC tag I carry in my wallet pointed straight to juanevillam.com, closing out an intense October week in Caracas.",
  'events.platanus.m':
    "Straight from the summit to Platanus Hack 26 Caracas, back in [Yummy](yummy)'s offices with the AlegrIA team: we built [Tridi](tridi), video turned into movement data for robots. No prize, but a much tougher hackathon, and people playing Space Explorer next door.",
  'likes.title': 'More of Me',
  'likes.cosmos.name': 'Cosmos',
  'likes.cosmos.body':
    "Space has always fascinated me: when you try to grasp how vast and infinite it is, there's no word for the contrast that everything in human history has happened on Earth—one planet in the solar system, in the Milky Way, inside a galaxy cluster, supercluster and megacluster without end. Stars, supernovas, colliding black holes and galaxies merging make you realize the universe is indifferent to our human worries—whether someone is sad, happy, sick or healthy—putting us in our place as a tiny ant in an incomprehensible cosmos, a feeling I came to love because nothing is more real than these [James Webb](webb) and [Hubble](hubble) photos. For me, humanity really has only two fundamental problems that are linked into one: space exploration—which inspired the name of my first game, Space Explorer, wishing I had been born in a Star Wars future across multiple galaxies—and immortality, because with the nearest star four light-years away, exploring the universe takes a body far less fragile than ours, perhaps backing up consciousness across solar systems and loading into advanced robots. When I die—if I die—I want to be working directly on space exploration or immortality, and I also find AI poetic because ever since humans discovered fire we were destined to create the intelligence that succeeds us, to the point I'd bet money we're in a simulation. The first time I saw these photos I put on headphones with nothing playing and stared at them for hours: I have no way to rank them, because all of them are breathtaking and for me nothing is more real than these photos.",
  // More of Me's Songs card and its player (SongsPlayer): the Shape
  // sheet's words are Sound Shaper's own (its i18n/translations.ts).
  'likes.songs.name': 'Songs',
  'likes.songs.meta': 'My Ranking',
  'likes.songs.body':
    "Here I share some of my favorite songs: they have a style I call cybernetic and futuristic—probably techno—and the fewer lyrics a song has, the more I like it, because when music expresses so much without saying a word it hits differently. If you've made it this far through the videos, try guessing which clips I keep of these tracks in my personal [Sound Shaper](shaper) library to see how my personality works. This card is built as a live Sound Shaper experience preloaded with my top tracks and a few fun ones—no login needed—so you can play with the filters or turn on DJ Juan, which mixes the songs automatically the way I would. This section is more relaxed and personal so I could gesture freely, leave the videos as long as I want on my own site, and give my landing page a live Sound Shaper preview through my favorite songs.",
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
      'Muy pronto, mis videos en inglés y en chino. Por ahora me ves y me escuchas en español.',
    'soon.narration.zhAfterEn':
      'Ahorita estoy grabando los videos en chino.',
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
      'Muchas gracias por escucharme, por verme y por leerme. Si tienes algún comentario, me lo puedes hacer llegar por los diferentes medios disponibles, mientras yo sigo construyendo y sigo yendo por el platino. Si llegaste hasta este punto y viste todo lo de la página principal, te felicito porque hay unos videos que fueron bien largos. Como dato curioso, estos videos no los grabé todos en una sola sesión —porque me habría quedado sin voz— y de muchas tomas siempre escogí la que quedara lo más natural posible, por eso en unas cambia el encuadre o se escucha lluvia de fondo. Súper contento de haber hecho esta página; vamos a ver qué sigo haciendo, y gracias por pasearse por aquí.',
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
      'Space Explorer inició como un easter egg para mis aplicaciones, en este caso Sound Shaper: ibas a entrar a una parte específica de la aplicación, darle unos taps secretos y se desplegaba un nivel o dos con una historia que se unía con el resto de mis aplicaciones. Pero eso sobrecomplicaba el producto y estaba tan oculto que solo lo sabía yo, así que para simplificar Sound Shaper lo removí. Justo en esos días aplicamos a una hackathon de [Platanus](platanus) en Caracas que tenía como reto secundario hacer un juego de arcade de máximo 50 kilobytes. Como ya tenía la idea trabajada, hice Space Explorer como un shooter 3D espacial en 50 KB — con un agujero negro y controles de nave bien trabajados, apostando por algo más técnico que pixel art. Lo puedes jugar aquí en esta página o en la [web oficial de Platanus Hack](arcade). En la hackathon había muy pocos juegos en 3D, y así como quedó para la hackathon se queda para siempre.',

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
      'Soy cofundador de [Salvalo](salvalo), mi startup como first-time founder, y es un marketplace de ofertas de comida. Todos los días en Venezuela hay negocios que cierran el día con comida o productos que se pudieron vender, y Salvalo soluciona ese problema: imagínate una panadería que hace 10 cachitos en la mañana y en la tarde le quedan 3 y 2 panes franceses, arma un pack con esos productos y los vende por la aplicación a precio de oferta y de cierre. Ambos lados ganan porque el comercio no pierde ese producto, consigue una nueva venta y un nuevo cliente con Salvalo como canal de ventas externo, mientras del lado del cliente son los mismos cachitos de la mañana en la tarde a precio de oferta y de una manera muy cómoda. El proceso de la aplicación es sencillo —lo difícil es agregar comercios y buscar clientes— y como representante de Salvalo aquí en Venezuela me estoy especializando en ventas, haciéndole pitch a los negocios y perdiendo la pena que tenía antes como perfil introvertido, además de trabajar como perfil técnico en el sistema web, la landing page y la aplicación móvil. Esa experiencia de una startup real te empuja a mejorar como founder y como persona, y la mayoría de los eventos a los que fui este año —como El Panal y el Startup Venezuela Summit— fueron como Salvalo aquí en el país en el que nací y vivo actualmente; eso es Salvalo, y bueno, salven sus packs.',
    'work.maktub.body':
      '[Maktub Art Fund](maktub) es un cliente de México. Es una landing page — que por sí sola normalmente no me llama tanto la atención —, pero tenía un diseño bastante interesante, muy moderno y muy fashion que no había hecho antes, y me gustó mucho el resultado final.',

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
      'Esta fue la primera entrevista de [Salvalo](salvalo) en la radio en [OK 101.5 FM](ok101) en el programa de [Cheo Noguera](cheo) acá en Barquisimeto. Fue mi primera vez en la radio —ya había ido a televisión mucho más pequeño— y estuvo también mi cofundador Abrahan vía online desde España. Pensé que iba a estar nervioso, pero más bien tenía ganas de seguir contando qué es Salvalo, nuestra historia y cómo empezamos; habían oyentes preguntándonos que se instalaron la aplicación ahí mismo, y di el ejemplo que siempre doy: imagina que eres una panadería, en la mañana tienes 10 cachitos y a las 6 de la tarde te quedan 3, entonces con esos 3 cachitos y 2 panes franceses armas un pack a precio de cierre por la aplicación como un canal extra de ventas para no perder el producto, conseguir la venta y ganar un nuevo cliente, mientras el cliente lleva los mismos cachitos y pan francés de la mañana a precio de oferta. Cada evento al que voy representando a Salvalo me sirve como entrenamiento de startup founder para los siguientes proyectos —comunicar una startup a cualquier perfil, como un dueño de panadería de 20 años— y espero repetir pronto para seguir practicando mis habilidades locutoras.',
    'events.radio.m':
      'La primera entrevista de [Salvalo](salvalo), en vivo en [OK 101.5 FM](ok101) de Barquisimeto: el locutor descargó la app al aire mientras se la explicaba a sus oyentes.',
    'events.meetup': 'Encuentro',
    'events.panal.when': 'oct 2026',
    'events.panal.body':
      '[El Panal](panal) es un movimiento que creó [Manuel Sira](manuel) acá en Barquisimeto para juntar a todo tipo de perfiles de tecnología en el estado Lara y que no sea todo siempre en Caracas. Fui con mis amigos de [Tripealo](tripealo) y, entre unas 140 personas en el Hotel Jirajara, hubo varias rondas para dar un pitch de 30 segundos; pasé en la segunda ronda y di el primer pitch oficial de [Salvalo](salvalo) con el ejemplo que siempre doy de la panadería. Estaba nervioso porque tenías atrás una pantalla con el contador de 30 segundos que te cortaba al llegar a cero, pero logré decir todo completo y lo tomé como una muy buena práctica junto a gente haciendo aplicaciones de psicología, una app de baños llamada [Resty](resty), marketing, moda y sistemas CRM. Hubo charlas sobre cómo crecer tu negocio midiendo datos y estadísticas internas y sobre cómo, en plena época de la inteligencia artificial, lo que te diferencia ya no es tanto lo técnico —porque la máquina hace todo— sino el gusto humano y artístico, como un sillón hecho a mano por un artesano frente a uno de fábrica. Cada persona es un panal que se interconecta con otros: conseguí leads para Salvalo, practiqué perder el miedo a vender tu idea como first-time founder y guardé el segundo identificador en mi colección.',
    'events.panal.m':
      'Una noche de [El Panal](panal) en Barquisimeto: charlas de IA, datos y gusto, y 30 segundos para el pitch de [Salvalo](salvalo). Nervioso, pero lo di, y me fui con amigos nuevos y uno que otro lead.',
    'events.summit': 'Summit',
    'events.summit.when': 'oct 2026',
    'events.summit.body':
      'Estuve en el [Startup Venezuela Summit](summit) en el Caracas Campus, y la verdad nunca había ido a un evento así. Vimos de nuevo a [Pedro Vallenilla](pedro) de [Cashea](cashea) y a [Víctor Cárdenas](slash) de Slash, conocí a uno de los cofundadores de [Rial](rial) y a personas del extranjero —incluyendo fondos americanos con founders venezolanos que fueron early investors en Anthropic—, siendo el evento más globalizado al que he ido. Además de los auditorios, el cronograma se actualizaba en tiempo real con charlas en las oficinas de empresas del Caracas Campus, como un pitch inverso donde los fondos de venture capital hacían pitch a los founders contando que buscan startups proyectadas a un billón de dólares al año. También estuvimos en un workshop privado de [Fina](fina) con la gente de [Innoven](innoven), donde postulé a [Salvalo](salvalo), pegué mi foto en la pared y me llevé una gorra de Innoven. El aprendizaje más grande que me llevé —recordando la frase de Steve Jobs sobre los suficientemente locos como para cambiar el mundo y sumando otro identificador a mi colección junto a mis amigos de [Tripealo](tripealo)— es que sin importar tu edad ni de dónde vengas, si le metes corazón y apuntas a las grandes ligas globales, lo puedes lograr.',
    'events.summit.m':
      'Dos días en el Startup Venezuela Summit con [Tripealo](tripealo): charlas de [Slash](slash) y [Cashea](cashea), un workshop privado con Fina e Innoven al que nos invitaron por nuestras chaquetas de founders, y [Salvalo](salvalo) en la pared de founders venezolanos.',
    'events.platanus.when': 'oct 2026',
    'events.platanus.body':
      'Justo saliendo del Startup Venezuela Summit fuimos directo al [Platanus Hack 26 Caracas](platanus), la primera gira de hackathons por Latinoamérica de Platanus Ventures, y adivinen dónde fue: de nuevo en las oficinas de [Yummy](yummy), literalmente un año después de la hackathon de AlegrIA. Fueron 36 horas construyendo sin parar y durmiendo poco, aplicando todo lo que mi equipo y yo aprendimos en hackathons pasadas bajo la premisa de que Physical AI is the new sexy. Escogimos el track de 3D e hicimos [Tridi](tridi), que toma video de personas —con tu cámara o pregrabado— y lo transforma en data de entrenamiento y políticas para robots humanoides, o incluso un robot explorador de Marte, dentro de una simulación física creada por nosotros para enseñarles acciones del mundo real. No ganamos, pero el nivel técnico en Caracas estuvo a la par de Buenos Aires, Ciudad de México y Bogotá, y quedamos súper agradecidos con el equipo de Platanus, de Yummy y nuestro mentor [Sebastián Alcalá](sebastian), product engineer en Yummy y cofundador de [Wink](wink), esperando que el próximo año la tercera sea la vencida. El identificador que nos dieron es una tarjeta con NFC para llevar en la cartera que redirigí directo a juanevillam.com, cerrando una semana en Caracas súper cargada de tecnología.',
    'events.platanus.m':
      'Del Summit directo a Platanus Hack 26 Caracas, de vuelta en las oficinas de [Yummy](yummy) con el equipo de AlegrIA: construimos [Tridi](tridi), video convertido en data de movimiento para robots. Sin premio, pero una hackathon mucho más fuerte, y gente jugando Space Explorer al lado.',
    'likes.title': 'Más de mí',
    'likes.cosmos.name': 'Cosmos',
    'likes.cosmos.body':
      'El espacio siempre me ha fascinado: al ver lo vasto e infinito que es, no hay palabra para el contraste de que todo lo que ha pasado en la historia humana ha ocurrido en la Tierra, un planeta del sistema solar, en la Vía Láctea, dentro de un cúmulo, un supercúmulo y un megaclúster sin fin. Las estrellas, las supernovas, los agujeros negros chocando y las galaxias fusionándose te muestran que el universo es indiferente a nuestras preocupaciones —que si alguien está triste, feliz, enfermo o con salud— y te ponen en tu lugar como una simple hormiga en un universo incomprensible, un sentimiento que empecé a amar porque no hay nada más real que estas fotos del [James Webb](webb) y del [Hubble](hubble). Para mí la humanidad tiene dos problemas primordiales que se unen en uno: la exploración espacial —de ahí viene el nombre de mi primer juego, Space Explorer, porque me habría gustado nacer en un futuro tipo Star Wars entre múltiples galaxias— y la búsqueda de la inmortalidad, ya que con la estrella más cercana a cuatro años luz necesitas superar este cuerpo tan frágil, tal vez extrayendo tu conciencia con backups en múltiples sistemas solares para cargarla en robots avanzados. Al momento de morir —si es que muero— me gustaría estar trabajando directamente en exploración espacial o inmortalidad, y también me parece poética la inteligencia artificial porque desde que el humano descubrió el fuego estaba destinado a crear al ser que lo reemplazaría, al punto de que apostaría plata a que estamos en una simulación. Como dato curioso, cuando vi estas fotos por primera vez me puse audífonos sin escuchar nada y las vi durante horas: no tengo manera de rankearlas porque todas son breathtaking y para mí no hay nada más real que estas fotos.',
    'likes.songs.name': 'Canciones',
    'likes.songs.meta': 'Mi ranking',
    'likes.songs.body':
      'Aquí les comparto algunas de mis canciones favoritas: tienen un estilo que llamo cibernético y futurista —en realidad creo que es techno— y mientras menos letra tenga la canción más me gusta, porque cuando expresa mucho sin decir una sola palabra tiene algo distinto. Si llegaron hasta este punto viendo los videos, traten de adivinar cuáles son los clips que tengo en mi [Sound Shaper](shaper) personal de estas canciones para ver cómo funciona mi personalidad. Esto está construido como el propio Sound Shaper cargado con canciones de mi top y otras para jugar —sin necesidad de iniciar sesión— para que prueben los filtros o activen la funcionalidad de DJ Juan, entrenado por mí para mezclar automáticamente a mi gusto. Esta sección es menos seria y más personal para poder gesticular libremente, dejar los videos tan largos como quiera porque es mi página y meterle a mi landing un preview en vivo de Sound Shaper con mis canciones favoritas.',
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
    'soon.narration':
      '我需要先录完英文视频，之后再录中文视频。目前你会看到并听到我的西班牙语视频，并配有中文字幕。',
    'soon.narration.zhAfterEn':
      '我正在录制中文视频。目前你会看到并听到我的英语视频，并配有中文字幕。',
    'soon.close': '关闭',
    'hero.hi': '你好',
    'store.soon': '即将推出',
    'launch.new': '新',
    'launch.shaper': 'Sound Shaper 现已推出网页版。',
    'launch.get': '打开',
    'store.web': '打开',
    'hero.caption':
      '嗨，我是 Juan Villa，我热爱做软件。我常说我喜欢像打电子游戏那样做软件，也就是冲着白金奖杯去。而且我觉得它是这个模拟世界里最接近魔法的东西，因为只要你能想象出来并找到实现的方法，就能创造出非常酷的事物。要是之后再把做出来的软件和硬件结合起来，还能创造出更酷的东西。关于这个网页有个有趣的小细节，我做它时只给自己定了一个挑战：不看任何参考模板，尽可能做出最真实的个人风格。除了赋予它完全属于我的品牌风格之外，我还决定把自己录下来，让整个页面像一部有画面、有声音、带字幕的电影，就像我留在这里生活的一个小小魂器。它的设计也尽可能经得起岁月考验，不会随时间过时。在这个页面里，我会向大家展示我正在忙什么以及我喜欢的事物。欢迎你。',
    'footer.caption':
      '非常感谢你听我讲、看我的视频、读我的文字。如果你有任何想法或建议，可以通过页面上的各种方式联系我，而我也会继续创造、继续冲白金。如果你一路看到了这里，把主页上的内容都看完了，那我要恭喜你，因为有些视频真的挺长的。说个有趣的小细节，这些视频并不是一次录完的——不然嗓子早就哑了——每次录很多遍后我都会挑选最自然的一条，所以有些视频里的取景会不太一样，或者能听到背景里的雨声。真的很开心做出了这个网页；看看接下来我还会做些什么吧，谢谢你来这里逛逛。',
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
      '我以前经常在 YouTube Music 听歌，但广告总是接连不断地弹出来。很多时候我喜欢把一首歌听五个版本：慢速、超慢、原速、快速和超快。还有很多时候，我只想听歌曲中间最精彩的那 30 秒。然后一遍又一遍、一遍又一遍地循环听。',
    'shaper.solution':
      '所以我做了 Sound Shaper，一个免费、无广告且开源的个人 MP3 播放器，里面有很多有趣的功能：声音预设、适合懂音乐的你精细调节的手动均衡器、实时播放变速以及很酷的音频滤镜。它还有自动 DJ——DJ Juan，也就是我本人当 DJ——完全按照我想要的方式运行。你可以把自己最喜欢的部分做成片段，给这些片段加上任意塑形效果循环播放——比如把一首歌的所有片段加速连播——而且手机锁屏后音乐依然会继续播放。',
    'shaper.s1.p1':
      '这是你的资料库。这个应用本身不下载音乐：你自己上传自己的 MP3，在这里按住拖动就能按你最喜欢的方式整理曲库。',
    'shaper.s1.p2':
      '它支持小组件，在这个界面你还可以切换应用的主题——深色模式或浅色模式——以及语言。它还有像 PlayStation 一样的奖杯系统：你用得越多，应用给你的奖励就越多、奖杯等级越高，直到拿到梦寐以求的白金奖杯。',
    'shaper.s2.p1':
      '这是播放器界面，就跟 YouTube Music 或 Apple Music 一样。在这里你可以点击播放、暂停、下一首或上一首。',
    'shaper.s2.p2':
      '但最重要的是底部的工具栏，那基本上就是这个应用存在的两个核心理由：Shape 和 Clips。',
    'shaper.s3.p1':
      'Sound Shaper 这个名字就源于这里：它是一个声音塑形器。在这里你可以调节播放速度、预设、均衡器和滤镜，或者开启自动 DJ 模式。',
    'shaper.s3.p2':
      '保持音调是开发过程中最有趣的部分之一。在 YouTube 或 YouTube Music 上，如果你把歌曲或视频调成 2 倍速或 0.75 倍速，人声就会变得极快或极慢，就像快进或慢动作一样。而在 Sound Shaper 里，你可以让节奏变快或变慢的同时保留人声原本自然的音调。此外还有回声和隔壁房间（next room）这样的滤镜，把它们组合起来玩，感觉就像瞬间穿越到了演唱会现场、站在演唱会外的停车场、听着隔壁邻居家震耳欲聋的派对，或者在派对中途走进洗手间洗脸时听到那种带着怀旧感的闷响。这里给你快速展示一下 Bad Bunny 的 DÁKITI 在 Sound Shaper 自动 DJ 模式下听起来是什么效果。',
    'shaper.s4.p1':
      '做 Clips 时我从 Apple 的语音备忘录汲取了很多灵感，我正是用那个应用录下了做这个网页和 Sound Shaper 的所有点子。你只需挑出自己最喜欢的那一段保存成片段——想建多少个片段都可以，没有上限。',
    'shaper.s4.p2':
      '把它保存为片段后，就能一遍又一遍地循环听。在这里你也可以直接打开 Shape，为你正在制作的片段塑形，听听它在特定塑形效果下的声音。',
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
      'Space Explorer 最初是为我的应用准备的彩蛋，具体来说就是 Sound Shaper：你进入应用里的某个特定位置，按特定暗号连点几下，就会展开一两个关卡，用一段故事把我的所有应用串联起来。但这会让产品变得过于复杂，而且藏得太深只有我自己知道，所以为了保持 Sound Shaper 简洁我就把它移除了。正好那几天我们报名了在加拉加斯举办的 [Platanus](platanus) 黑客松，里面有个附加挑战是做一个不超过 50 KB 的街机游戏。因为点子已经打磨好了，我就把 Space Explorer 做成了一款 50 KB 以内的 3D 太空射击游戏——有黑洞和精心调校的飞船操控，走的是比像素风更有技术含量的 3D 路线。你可以直接在这个页面上玩，也可以去 [Platanus Hack 的官方网站](arcade)上玩。那场黑客松里很少有 3D 游戏，它当时提交时是什么样，就永远保留什么样。',

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
      '[Crol](crol) 是面向墨西哥中小企业的云端 ERP。在 Crol 我从 Conto Pay 起步，它是 Crol 旗下一款更简单易用的产品，我主导开发了它的网页系统、移动应用和落地页。而那款移动应用后来也成为了 Crol ERP Móvil 的基础，同样由我从零开始设计并构建。',
    'work.salvalo.body':
      '我是 [Salvalo](salvalo) 的联合创始人，这是我作为首次创业者创立的美食特惠交易平台。在委内瑞拉，每天都有商家在打烊时剩下本可以卖出的食物或商品，而 Salvalo 解决了这个问题：想象一家面包店早上做了 10 个 cachito，到了下午还剩 3 个加 2 根法棍，商家把它们组合成特惠包，在应用上以打烊折扣价售出。双方都能受益，因为商家不会白白浪费商品，通过 Salvalo 这个外部销售渠道促成了交易并获得新客户，而顾客也能在下午以优惠的价格、极其方便的方式买到早上新鲜出炉的 cachito。应用的使用流程很简单——真正的难点在于拓展商家和吸引用户——作为 Salvalo 目前在委内瑞拉的代表，我把重心放在了销售上，亲自上门向商家路演，克服了自己以前偏内向的性格，同时作为技术出身的联合创始人，我也负责了网页系统、落地页和移动应用的开发。真正做一家认真的创业公司会推动你作为创始人和个人快速成长，今年我参加的大多数活动——比如 El Panal 和 Startup Venezuela Summit——都是代表 Salvalo 在我出生和生活的这个国家参加的；这就是 Salvalo，快来拯救你们的美食包吧。',
    'work.maktub.body':
      '[Maktub Art Fund](maktub) 是一位来自墨西哥的客户。它是一个独立的落地页——单看类型的话平时可能不会太吸引我——但它的设计非常有趣、现代且很有时尚感，是我以前没做过的风格，最终呈现出来的效果我非常喜欢。',

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
      '这一段有更多故事。和我一起读小学和中学的 [Pastor](pastor) 有一天突然给我发消息，把 [Ale](ale) 和 [Cesar](cesar) 介绍给我，一起报名参加由 [Yummy](yummy)、[Cashea](cashea)、[Slash](slash) 和 AlegrIA Labs 在加拉加斯 Yummy 办公室举办的黑客松。以前的 Juan 多半会因为害羞、害怕或犯懒而拒绝，但那一刻我对自己说：至少我们能学到很多东西，干就完了。开了几次会后，我们决定做 [Tripealo](tripealo)——一个面向委内瑞拉的旅行体验平台，拍了报名视频，从上千名报名者中入选前 100 名，去加拉加斯连续开发了 36 个小时。虽然没有获奖也没进前十，但它让我对创业世界和自己都有了极深的认识。后来他们继续推进 Tripealo，我则退出来创办了 [Salvalo](salvalo)，不过在创业路上我们依然并肩同行。我把参加过的每场活动的胸牌都像无限宝石一样珍藏着，因为一看到它们就能瞬间回到当时的场景、那些讲座和认识的创始人们。那是只埋头写代码的程序员 Juan 蜕变为打造人们真正使用的产品的 Juan 的转折点：那年十月在加拉加斯的前后，我的思维方式彻底改变了。',
    'events.alegria.m':
      '在加拉加斯参加委内瑞拉第一场 vibe coding 黑客松的三天。没有拿奖，却交到新朋友，也从 [Yummy](yummy)、[Cashea](cashea) 和 [Slash](slash) 的创始人那里学到很多。它正是让 [Tripealo](tripealo) 和 [Salvalo](salvalo) 起步的那一推。',
    'events.talk': '讲座',
    'events.ilc.when': '2026 年 9 月',
    'events.ilc.body':
      '在 AlegrIA Labs 黑客松上，[Pedro Vallenilla](pedro) 曾通过视频连线分享；一年后，他亲自来到我在委内瑞拉拉腊州的家乡巴基西梅托，与 [Elías Sayegh 神父](elias) 一起做了一场领导力演讲。我们和团队一起去听，就坐在[剧院](juares)的第二排，离舞台非常近。去之前我把他的所有采访都看了一遍，而在现场他讲了许多我以前从没听过的细节故事。最让我印象深刻的是他把委内瑞拉看作一片旷野（greenfield）：在经历了这一切之后，这里有巨大的空间去打造那些在拉美其他国家已经存在的技术产品。看看 [Cashea](cashea) 就知道了——不做银行却做分期信用，顶着所有人的质疑起步，最初一家店一家店上门推广时还被人当成疯子。在其他项目没跑通时依然咬牙往前冲、直到做出如今撬动委内瑞拉相当一部分 GDP 的 Cashea，能在现场亲眼见证这种冲劲真的太酷了。',
    'events.ilc.m':
      '这次在我的城市亲耳听 [Cashea](cashea) 的 [Pedro Vallenilla](pedro) 讲：一次成功的创业，接连几次失败，然后是 Cashea，以及为什么委内瑞拉是创造的好地方。',
    'events.interview': '采访',
    'events.radio.when': '2026 年 10 月',
    'events.radio.body':
      '这是 [Salvalo](salvalo) 的第一次电台采访，在巴基西梅托 [OK 101.5 FM](ok101) 的 [Cheo Noguera](cheo) 节目里。这是我第一次上电台——更小的时候上过电视——我的联合创始人 Abrahan 从西班牙在线连线。我原以为会紧张，结果反而特别想继续讲 Salvalo 的故事和起步；现场有听众提问并当场安装了应用，我也讲了我常举的例子：假设你是一家面包店，早上做了 10 个 cachito，下午 6 点还剩 3 个，你就用这 3 个 cachito 加 2 个法棍组合成打烊特惠包发到应用上，作为额外的销售渠道避免浪费、促成交易并带来新客户，而顾客也能以特惠价买到早上做的新鲜 cachito 和法棍。代表 Salvalo 参加的每一次活动都是我作为创业者的训练，学会向开了 20 年面包店的老板等不同人群讲清楚一家创业公司，希望很快能再次上麦练习主持。',
    'events.radio.m':
      '[Salvalo](salvalo) 的第一次采访，在巴基西梅托 [OK 101.5 FM](ok101) 直播：主持人在节目中下载了 App，我向听众讲解它的用法。',
    'events.meetup': '交流会',
    'events.panal.when': '2026 年 10 月',
    'events.panal.body':
      '[El Panal](panal) 是 [Manuel Sira](manuel) 在巴基西梅托发起的一个运动，旨在把拉腊州各种与科技相关的从业者聚集在一起，让科技活动不再只集中于加拉加斯。我和 [Tripealo](tripealo) 的朋友们一起去参加，在 Jirajara 酒店的大约 140 人里，分了几轮进行 30 秒限时路演；我在第二轮上台，用我常举的面包店例子完成了 [Salvalo](salvalo) 的第一次正式路演。当时我挺紧张的，因为身后大屏幕上就是 30 秒倒计时，一到零就会响铃打断，不过我还是完整讲完了全部内容，并把它当作一次极好的练习；现场还有做心理应用的、做一款叫 [Resty](resty) 的找洗手间应用的，以及做营销、时尚和 CRM 系统的伙伴。活动上还有关于通过衡量内部数据来发展业务、以及在人工智能时代如何脱颖而出的分享——因为机器什么技术都能做，真正拉开差距的是人的审美与艺术品味，就像工匠亲手打造的扶手椅与工厂流水线产品的区别。每个人都像蜂巢里的一个蜂格彼此连接：我为 Salvalo 拿到了潜在客户线索，作为首次创业者练习了克服推销想法的羞怯，也在我的收藏里收入了第二枚活动胸牌。',
    'events.panal.m':
      '在巴基西梅托参加 [El Panal](panal) 的一个夜晚：关于 AI、数据和品味的讲座，还有 30 秒为 [Salvalo](salvalo) 路演。很紧张，但我讲完了，带走了新朋友和几条潜在客户线索。',
    'events.summit': '峰会',
    'events.summit.when': '2026 年 10 月',
    'events.summit.body':
      '我参加了在 Caracas Campus 举办的 [Startup Venezuela Summit](summit)，说实话我以前从没去过这样的活动。我们再次听到了 [Cashea](cashea) 的 [Pedro Vallenilla](pedro) 和 Slash 的 [Víctor Cárdenas](slash) 的分享，认识了 [Rial](rial) 的一位联合创始人以及许多来自海外的人——包括由委内瑞拉创始人参与创立、早期投资了 Anthropic 的美国风投基金——这也是我参加过的最国际化的一场科技创业盛会。除了主会场之外，活动应用还会实时更新在 Caracas Campus 企业办公区举办的闭门分享，比如一场反向路演，不是创始人向风投路演，而是风投向创始人路演，讲述他们如何寻找有望做到年营收十亿美元的创业公司。我们还参加了 [Fina](fina) 与 [Innoven](innoven) 的私人工作坊，我在现场为 [Salvalo](salvalo) 报名投递了 Innoven，把照片贴上了创始人墙，还拿到了一顶 Innoven 的帽子。这两天带给我最大的启发——就像史蒂夫·乔布斯那句“那些疯狂到以为自己能改变世界的人，才是真正改变世界的人”，以及我和 [Tripealo](tripealo) 朋友们一起收入收藏的又一枚胸牌——就是无论你的年龄、出身或背景如何，只要全心投入并瞄准全球顶级舞台，你就一定能做到。',
    'events.summit.m':
      '和 [Tripealo](tripealo) 在 Startup Venezuela Summit 的两天：[Slash](slash) 和 [Cashea](cashea) 的分享，因为创始人夹克被邀请参加的 Fina 与 Innoven 私人工作坊，还有贴上委内瑞拉创始人墙的 [Salvalo](salvalo)。',
    'events.platanus.when': '2026 年 10 月',
    'events.platanus.body':
      '刚离开 Startup Venezuela Summit，我们就直接去了 [Platanus Hack 26 Caracas](platanus)，这是 Platanus Ventures 首次举办的拉美巡回黑客松，而且猜猜是在哪里办的：整整一年之后，我们又回到了 AlegrIA 黑客松所在的 [Yummy](yummy) 办公室。那 36 个小时里我们几乎没怎么睡，不停地构建，把我和团队在历次黑客松中学到的一切都用上了，核心理念就是具身智能（Physical AI）是新的潮流。我们选择了 3D 赛道并做出了 [Tridi](tridi)，它可以把相机拍摄或预先录制的普通人物视频转化为人形机器人——甚至是火星探测车——的训练数据与行动策略，放进我们自己构建的物理模拟环境中，让机器人在进入现实世界之前就能学会各种日常动作。虽然我们没有赢，但加拉加斯站的技术水准完全不输布宜诺斯艾利斯、墨西哥城和波哥大；我们非常感谢 Platanus 和 Yummy 团队，以及我们的导师、Yummy 产品工程师兼 [Wink](wink) 联合创始人 [Sebastián Alcalá](sebastian)，希望明年再战能够事不过三。这次发给我们的胸牌是一张可以放进钱包的 NFC 卡片，我把它的链接直接指向了 juanevillam.com，为在加拉加斯这充实的科技周画上了句号。',
    'events.platanus.m':
      '从峰会直接去了 Platanus Hack 26 Caracas，和 AlegrIA 的队友回到 [Yummy](yummy) 的办公室：我们做了 [Tridi](tridi)，把视频变成机器人的动作数据。没有拿奖，但这是一场难得多的黑客松，旁边还有人在玩 Space Explorer。',
    'likes.title': '更多关于我',
    'likes.cosmos.name': '宇宙',
    'likes.cosmos.body':
      '太空一直让我着迷：当你试着去理解它有多浩瀚、多无限时，根本找不到词来形容那种反差——人类历史上发生过的一切都发生在地球上，而地球只是太阳系的一颗行星，太阳系只是银河系的一部分，外面还有星系团、超星系团和无边无际的巨型结构。恒星、超新星、相撞的黑洞以及彼此吞并的星系让你意识到，宇宙对人类的烦恼——无论谁开心、难过、生病还是健康——都毫不在意，把你放回一个在不可思议的宇宙面前如同小小蚂蚁的位置，而我没有排斥这种感觉，反而越来越热爱它，因为没有什么比这些[詹姆斯·韦伯](webb)和[哈勃](hubble)拍下的太空照片更真实了。对我来说，全人类归根结底只有两个紧密相连的根本问题：一是太空探索——我为 Platanus Hack 做的第一款游戏 Space Explorer 的名字就源于此，因为我一直希望能出生在像《星球大战》那样跨越多个星系的未来——二是寻找永生，因为离太阳最近的恒星也有四光年远，想要实现那种尺度的星际探索就必须超越这具脆弱的肉体，比如把意识提取并备份到多个恒星系的计算机里，再加载到先进的机器人身上。到我死去的那一刻——如果我会死的话——我希望自己正在直接从事太空探索或永生相关的事业，而且我也觉得人工智能极具诗意，因为人类自从发现火的那一刻起，就注定要创造出替代自己的存在，甚至如果让我打赌，我更愿意赌我们活在一场模拟之中。说个有趣的小细节，我第一次看到这些照片时戴着耳机什么也没放，就这样着迷地看了好几个小时：我根本没办法给它们排名，因为每一张都美得令人窒息，对我来说没有什么比这些照片更真实了。',
    'likes.songs.name': '歌曲',
    'likes.songs.meta': '我的排行',
    'likes.songs.body':
      '这里和大家分享一些我最喜欢的歌：它们都有一种我称之为赛博、未来感的风格——其实应该算是 techno——而且歌词越少的歌我越喜欢，因为当一首曲子不靠一个字就能表达出丰富的情感时，会有一种很特别的感觉。如果你一路看视频来到了这里，不妨猜猜这些歌里我保存在自己个人 [Sound Shaper](shaper) 曲库里的最爱片段是哪几段，看看能不能猜中我的性格。这个板块就是直接把 Sound Shaper 搬了过来，预装了我最爱的歌和几首拿来玩的歌——不用登录就能直接用——你可以尽情试玩各种滤镜，或者打开由我亲自按自己品味训练的 DJ Juan 功能来自动混音。这一节比前面的板块更轻松、更私人，所以我可以自在地比划手势，在自己的网站上想把视频留多长就留多长，顺便通过我最爱的歌在主页上放一个可以直接试玩的 Sound Shaper 预览。',
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
    'shape.autoDjDescription': '跟随节拍混音当前歌曲或这里的所有歌曲，每次都不同。',
    'shape.autoDjPreparing': '正在读取歌曲',
    'shape.autoDjProgress': '{ready}/{total}',
    'shape.autoDjMode.off': '关闭',
    'shape.autoDjMode.sound': '当前歌曲',
    'shape.autoDjMode.all': '所有歌曲',
  },
};
