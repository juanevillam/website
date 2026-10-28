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
  // The hero's greeting over the wordmark — the one word that shows at a
  // glance which language the page is in (as the GitHub profile's
  // "Hi · Hola · 你好").
  'hero.hi': 'Hi',
  // The store tag's status while an app has no listing (StoreBadges).
  'store.soon': 'Coming Soon',
  'hero.caption':
    "Hi, I'm Juan Villa, a software developer. I build software the way I like to play video games: going for the platinum. Since 2022 I've worked remotely for companies in Mexico, and with clients in Spain and Argentina. I started out studying electronic engineering, then computer science at a technical college, but what taught me the most was building things. On this site you'll see apps made by me, for me, that are in the app stores too; my work; my startup, which right now is Salvalo; and the startup and developer events I've been to. The site is in Spanish, English and Chinese; you can switch it at the top right. The whole page is narrated and subtitles appear as the audio plays, so to read it you listen to it, though you can turn the volume down. And yes, this is my real voice, not AI. Welcome.",
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
    'I listened to music on YouTube Music, but ads kept popping up all the time. And often, if I liked a song, I liked to hear it slow, fast, ultra slow, ultra fast. And many other times I only wanted the 30 seconds in the middle, the first 20 seconds, or the best part, at the end. And of course, I played it again and again.',
  'shaper.solution':
    "That's why I made Sound Shaper, a personal MP3 player that works without internet. You add your song once and you can make it slow or fast, put on any effects you want, use the equalizer and make clips of your favorite parts. On YouTube Music a song sounds the way it was uploaded, but here you add the song, you change it, and you choose how you hear it.",
  'shaper.s1.p1':
    "This is your library. The app doesn't download music: you add your own MP3s for your personal use, and here you can drag them into whatever order you like.",
  'shaper.s1.p2':
    "It works with widgets, the Lock Screen and the Dynamic Island. From here you also open Settings, where you can change your account details, the app's language and its appearance. And it has a little extra: trophies like PlayStation's. The more you use the app, the more trophies you unlock, until you earn the coveted platinum.",
  'shaper.s2.p1':
    'This is the player screen, a normal one, like YouTube Music or Apple Music. Here you can play, pause and change songs.',
  'shaper.s2.p2':
    'What matters is the bar at the bottom, where you open Shape and Clips. Those two parts are the reason the app exists.',
  'shaper.s3.p1':
    "This is where the name Sound Shaper comes from, from Shape: the app shapes sound. You have ready-made presets, a manual equalizer if you know more about music, and you can change the song's speed, slow or fast, however you like.",
  'shaper.s3.p2':
    "Preserving the pitch was the most interesting thing to build. On YouTube, if you slow a song down, the voice sounds like slow motion. Here you can choose to keep it sounding the same, at the same pace as the beat. There are also effects like echo and next room, which you can combine so the music sounds like you're at a concert, in a concert's parking lot, or hearing the party your neighbor is throwing next door. And if you put on headphones and close your eyes, it really takes you there. Here's a quick example of how DÁKITI sounds playing with the app's effects.",
  'shaper.s4.p1':
    "For Clips I took inspiration from Apple's Voice Memos app, the same app I used to record the ideas for this app and this page. You just pick the part of the song you like most, and that's it.",
  'shaper.s4.p2':
    "You save it as a clip and play it again and again. From here you can also open Shape so the clip you're making or editing sounds your way.",

  // Space Explorer — the Platanus arcade entry, playable at the landing's foot.
  // The control keys are the cabinet's own; the action names are Apple-voice
  // labels. The game's own screens are the cabinet's, untranslated.
  'arcade.play': 'Play Game',
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
  'arcade.p1':
    "Space Explorer started as an easter egg for my apps, in this case Sound Shaper: you'd go to a specific part of the app, tap a certain combination, and Space Explorer would open as a game. It was going to have several levels, in the sea, in space, a space war, but I took it out to keep Sound Shaper simple. Months later we applied to a [Platanus](platanus) hackathon that had an arcade challenge: make a video game. I already had the idea ready, so I used it to apply. It's a 3D space shooter that fits in 50 kilobytes, not megabytes, and honestly it came out pretty cool. You can play it right here on this page and on Platanus's official site. I don't know if it was the best game technically; by popular vote it wasn't, but it's still a super cool game.",

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
    "Since 2022 I've worked at [Crol](crol), a cloud ERP for companies in Mexico. I also started on Conto Pay, a much simpler, easier version of Crol: its website, its landing page and its mobile app. And that same app was the base for Crol ERP Móvil, which I built and designed from scratch.",
  'work.salvalo.body':
    "I'm a cofounder of Salvalo, my startup. Every day, shops close with products that can still be sold, and Salvalo turns them into packs with a price and a pickup time. The customer finds one nearby on the app's map, reserves it, pays the shop directly and picks it up with a verification code. The example I always give: a bakery has 10 cachitos in the morning, by 5 in the afternoon it has 3 left and 2 loaves of French bread, and it makes a pack out of them at a reduced closing price. The shop wins, because it moves that product instead of losing it, and it gains customers, because Salvalo is an extra sales channel. And the customer gets the same morning cachitos, in the afternoon, at a discount, in a really easy way. I'm the technical cofounder: I redesigned the app and the website, and I handle all the frontend development. I'm also Salvalo's representative here in Venezuela, so I go out to pitch shops and show up at every event on Salvalo's behalf.",
  'work.maktub.body':
    'Maktub Art Fund is a client from Mexico. It was a landing page, and those rarely caught my attention, but the design was great, very modern, very fashion, so I liked the idea and built it. It came out pretty cool too.',

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
    "This one has more of a story. One day [Pastor](pastor), who went to primary and secondary school with me, wrote to me and introduced me to [Cesar](cesar) and [Ale](ale) to apply to a hackathon: they were one short, and he asked if I'd join them. The old Juan would have said no, maybe out of shyness or laziness, but this time I thought the worst that could happen was not getting in, and at the very least we'd learn a lot. We came up with several ideas, but the one that won was [Tripealo](tripealo), a marketplace for travel experiences in Venezuela, and out of a thousand people who applied we were among the hundred who went to [Yummy](yummy)'s offices in Caracas. We didn't win, but I heard many founders who now compete in Silicon Valley against the top companies in the United States, and we left with the push to keep going. They carried on with Tripealo, and I left to continue with my cofounder at [Salvalo](salvalo). Today Tripealo and Salvalo are both running, and I'm all in on Salvalo in founder mode. They're my founder bros now: together, but not mixed up. It was the turning point between the old Juan, just a programmer, and the Juan of today, almost an entrepreneur. I'm really grateful for this experience: I learned a lot from a lot of people, and a lot about myself.",
  'events.alegria.m':
    "Three days at Venezuela's first vibe-coding hackathon, in Caracas. No prize, but new friends and lessons from the founders of [Yummy](yummy), [Cashea](cashea) and [Slash](slash). It was the push we needed to get going with [Tripealo](tripealo) and [Salvalo](salvalo).",
  'events.talk': 'Talk',
  'events.ilc.when': 'Sep 2026',
  'events.ilc.body':
    "At the AlegrIA hackathon, organized by [Cashea](cashea) and [Yummy](yummy), we had an online talk with [Pedro Vallenilla](pedro), Cashea's cofounder. Months later he came to Barquisimeto in person to give an improved, much fuller talk, with [Father Elías Sayegh](elias). We were literally in the second row of the [theater](juares), right in front. He told how several of his startups failed before the huge success that was Cashea, and how he kept going and going until he built Cashea. What stayed with me most was how he talks about Venezuela: after everything it has been through, it's a greenfield for building anything, because here there are no tech-driven solutions that other countries already have. That's why Venezuela is at the best moment to start a company, and not in theory, in practice.",
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
    "[El Panal](panal) is a movement [Manuel Sira](manuel) started here in Barquisimeto: lots of people building all kinds of things. There are people in marketing, fashion, CRM, inventory, psychology and health apps, and there were talks on artificial intelligence, on growing your company by measuring its data correctly, and on standing out now that we're in the age of AI and you need taste to make things. Every startup at the event had exactly 30 seconds to pitch, and I, nervous, gave [Salvalo](salvalo)'s. It wasn't the best one I've given, but it was Salvalo's first official pitch at an event of that caliber. I went with my friends from [Tripealo](tripealo) and left with new friends from other apps, new contacts and the odd lead for Salvalo. It's like a preview of Startup Summit Caracas: as I record this we haven't gone yet, but we are going, and this was the practice for the practice.",
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
    "Right after the Startup Venezuela Summit, we went straight to [Platanus Hack 26 Caracas](platanus). This year Platanus ran its hackathon as a tour of Latin America, and my team and I got into the Caracas edition. We applied with our developer profiles, the same team as last year's AlegrIA hackathon, and not as [Tripealo](tripealo) or [Salvalo](salvalo), but each with our own profile. It was funny: literally a year after the AlegrIA 2025 hackathon, we were back in [Yummy](yummy)'s offices for another hackathon, only this time much tougher on the technical side. We built [Tridi](tridi), which turns an ordinary video of a person into movement data for robots: a simulated robot learns to move on its own by imitating you. It works like this: you take any video, the movement is tracked and brought into a physics simulation, the robot learns to move by itself across different terrains and conditions, and the simulation data and the trained model are exported in formats ready for hardware. We built it on the premise that robotics and AI is the new sexy. We slept little, but what I learned at AlegrIA and all the mental work I'd put in helped me a lot at this hackathon. And not just me: the rest of the team, who are honestly really good, we were all very locked in. There were unlimited snacks, so I kept myself awake eating and drinking water. Our mentor was [Sebastián Alcalá](sebastian), a product engineer at Yummy and a cofounder of [Wink](wink). We didn't win, but the level was impressive: I had watched the videos of the past editions in Buenos Aires, Mexico and Bogotá, and Caracas truly lived up to them. The winner had a really cool 3D product, and although we lost, we learned a ton. A fun fact: our workspace was right next to Platanus Hack's arcade, the one I made the game Space Explorer for. Several times, while we were focused, we saw other participants walk by and play the games, and I'll always remember it, because you could see the wonder and joy on their faces, that 'hey, look, this game is cool'. I didn't want to interrupt them, so I'd stay out of it and let them form their own opinion of the game without me in the middle. I loved seeing that. We also made a lot of new friends and connections: honestly, the technical talent in Venezuela is strong. It was great to share a hackathon again with people we'd already shared AlegrIA with last year, and to meet so many new people. That's two in a row now: let's see if next year we apply again and this time we win, because third time's the charm.",
  'events.platanus.m':
    "Straight from the summit to Platanus Hack 26 Caracas, back in [Yummy](yummy)'s offices with the AlegrIA team: we built [Tridi](tridi), video turned into movement data for robots. No prize, but a much tougher hackathon, and people playing Space Explorer next door.",
  'likes.paintings.meta': 'My Collection',
  'likes.paintings.body':
    "After I started looking at the photos of space, I also went looking for paintings made by people that matched my style. Someday I'd like to have screens, wherever my home ends up being, showing both the photos of the cosmos and these paintings. I like paintings with a contrast like space's, with so much happening in them that from a single one you could build a film, or a series of films: they're paintings that are poems at the same time. Most are by similar painters, which is why they look so alike, but honestly they're really cool. There's also one by the Spanish painter Velázquez, and others whose painter I don't know, or I do and prefer not to name. These aren't ranked either, because I like them all and they show in random order.",
  'likes.title': 'More of Me',
  'likes.cosmos.name': 'Cosmos',
  'likes.paintings.name': 'Paintings',
  'likes.games.name': 'Video Games',
  'likes.games.body':
    "[Ghost of Yōtei](yotei) and [Elden Ring](elden) are among my top games, and I got the platinum in both, as I always say. When I finished Ghost of Yōtei I took photos of the outfits I finished it in, because there are several and I wanted to remember the ones I liked most. I always kept the same setup, but I ordered the outfits carefully so I could change them however I wanted. Elden Ring is a mega cinematic game: Ghost of Yōtei is good, but Elden Ring is something else, there's no word for it. My brother had already played it, so from the start I had mapped out the photos I wanted to take once I got the platinum, with my setup and the armor I chose. Since I roughly knew how it went, from start to finish I had mapped everything I'd do and everything I had to get, and anyone who has played Elden Ring knows how hard it is to plan that from the very beginning. My brother is a pro and helped me a lot. It took me 78 hours, and in that armor, which I think is called the armor of the night, it looks so, so tough.",
  'likes.cosmos.body':
    "Space has always fascinated me. I identify a lot with optimistic nihilism: when you see how vast space is, the universe, the cosmos, a lot of what worries you in life stops making sense, at least in my case. There are things out there so immense, beyond this planet and this galaxy, and we are a mind this complex in a body this weak and mortal: a contrast on another scale. Right now there may be people buying houses and people selling them, someone celebrating a birth and someone grieving, and you realize nobody is special, even if we feel we are, and that what happens is nothing to the universe. Instead of rejecting that feeling, heavy and crazy as it is, I decided to admire it and love it: the very existence of a universe so complex, and us, a body so fragile with a mind so complex. That's why I fell for space, the books and the photos of space, and I started looking at photos from the [James Webb](webb) and the [Hubble](hubble) telescope for hours and hours. The ones you're seeing are the ones I like most, and they show in random order: they're all so good I can't find a way to rank them.",
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
    'hero.hi': 'Hola',
    'store.soon': 'Próximamente',
    'hero.caption':
      'Hola, soy Juan Villa, desarrollador de software. Hago software como me gusta jugar videojuegos: yendo por el platino. Desde 2022 trabajo remoto para empresas en México y con clientes en España y Argentina. Empecé estudiando Ingeniería Electrónica, luego Técnico en Informática, pero lo que más me enseñó fue construir cosas. En esta página vas a ver aplicaciones hechas por mí, para mí, que también están en las tiendas; mi trabajo; mi startup, que en este momento es Salvalo, y los eventos de emprendimiento y desarrollo a los que he ido. La página está en español, inglés y chino; puedes cambiarla arriba a la derecha. Toda la página está narrada y los subtítulos aparecen mientras suena el audio, así que para leerla tienes que escucharla, aunque puedes bajarle el volumen. Y sí, esta es mi voz real, no es inteligencia artificial. Bienvenido.',
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
      'Yo escuchaba música en YouTube Music, pero me salían anuncios a cada rato. Y muchas veces, si una canción me gustaba, me gustaba escucharla lenta, rápida, ultra lenta, ultra rápida. Y otras muchas veces me gustaba escuchar solo los 30 segundos de en medio, los 20 segundos del principio o la mejor parte, que está al final. Y claro, la repetía y la repetía.',
    'shaper.solution':
      'Por eso hice Sound Shaper, un reproductor MP3 personal que funciona sin internet. Subes tu canción una vez y la puedes poner lenta, rápida, le pones los efectos que quieras, tiene ecualizador y puedes hacer clips de tus partes favoritas. En YouTube Music la canción suena como la subieron, pero aquí tú subes la canción, la modificas y tú escoges cómo la escuchas.',
    'shaper.s1.p1':
      'Esta es tu biblioteca. La app no descarga música: tú mismo subes tus propios MP3 para tu uso personal, y aquí las puedes ordenar arrastrándolas en el orden que tú quieras.',
    'shaper.s1.p2':
      'Funciona con widgets, pantalla de bloqueo y Dynamic Island. Desde aquí también entras a ajustes, donde puedes cambiar los detalles de tu cuenta, el idioma de la aplicación y la apariencia. Y tiene un detallito: trofeos como los de PlayStation. Mientras más utilizas la aplicación, más trofeos vas desbloqueando, hasta conseguir el preciado platino.',
    'shaper.s2.p1':
      'Esta es la pantalla del reproductor, normal, como si fuese YouTube Music o Apple Music. Aquí le puedes dar play, pausa y cambiar de canción.',
    'shaper.s2.p2':
      'Lo importante está en la barra de abajo, desde donde abres Shape y Clips. Esas dos partes son la razón por la que existe la aplicación.',
    'shaper.s3.p1':
      'De aquí viene el nombre de Sound Shaper, de Shape: la aplicación es un moldeador de sonidos. Tienes presets listos, ecualizador manual si sabes más de música, y puedes cambiar la velocidad de la canción, lenta o rápida, como tú quieras.',
    'shaper.s3.p2':
      'Preservar el tono fue lo más curioso de construir. En YouTube, si pones una canción lenta, la voz suena en cámara lenta. Aquí puedes escoger que suene igual, al mismo pace que va el ritmo. También hay efectos como echo y next room, que puedes combinar para que la música suene como si estuvieses en un concierto, en el estacionamiento de un concierto o escuchando la fiesta que tiene tu vecino al lado de tu casa. Y si te pones audífonos y cierras los ojos, de verdad te teletransporta a ese momento. Aquí te dejo un ejemplo rápido de cómo suena DÁKITI jugando con los efectos de la aplicación.',
    'shaper.s4.p1':
      'Para Clips me inspiré en la aplicación de Notas de Voz de Apple, la misma app con la que grabé las ideas para crear esta aplicación y esta página. Simplemente escoges el pedazo de la canción que más te gusta y listo.',
    'shaper.s4.p2':
      'Lo guardas como clip y lo escuchas una y otra vez. Desde aquí también puedes abrir Shape para que el clip que estás creando o editando suene a tu manera.',
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
    'arcade.p1':
      'Space Explorer empezó como un easter egg para mis aplicaciones, en este caso Sound Shaper: ibas a una parte específica de la aplicación, hacías una combinación de taps y se abría Space Explorer en modo juego. Iba a tener varios niveles, en el mar, en el espacio, una guerra espacial, pero lo quité para no complicar Sound Shaper. Meses después aplicamos a una hackathon de [Platanus](platanus) que tenía un reto arcade: crear un videojuego. Ya tenía la idea lista, así que la usé para aplicar. Es un shooter espacial 3D que cabe en 50 kilobytes, no megabytes, y la verdad quedó bastante cool. Lo puedes jugar aquí en esta página y también en la página oficial de Platanus. No sé si fue el mejor juego a nivel técnico; por voto popular no fue, pero igual es un juego mega chulo.',

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
      'Desde 2022 trabajo en [Crol](crol), un ERP en la nube para empresas de México. Además empecé con Conto Pay, una versión mucho más simple y fácil de usar de Crol: su web, su landing y su aplicación móvil. Y esa misma aplicación fue la base para Crol ERP Móvil, que construí y diseñé desde cero.',
    'work.salvalo.body':
      'Soy cofundador de Salvalo, mi startup. Los comercios cierran cada día con productos que todavía se pueden vender, y en Salvalo los conviertes en packs con precio y horario de recogida. El cliente lo encuentra cerca en el mapa de la aplicación, lo aparta, le paga directo al comercio y lo recoge con un código de verificación. El ejemplo que siempre pongo: una panadería tiene 10 cachitos en la mañana, a las 5 de la tarde le quedan 3 y 2 panes franceses, y arma un pack con eso a un precio de cierre reducido. Gana el comercio, porque mueve ese producto y no lo pierde, y gana más clientes, porque Salvalo es un canal de ventas extra. Y el cliente se lleva los mismos cachitos de la mañana, en la tarde, a precio de oferta y de manera súper cómoda. Yo soy el cofundador técnico: rediseñé la aplicación y la página web, y me encargo de todo el desarrollo frontend. Además soy el representante de Salvalo aquí en Venezuela, así que salgo a hacerle pitch a comercios y a estar en todos los eventos en nombre de Salvalo.',
    'work.maktub.body':
      'Maktub Art Fund es un cliente de México. Era una landing page, y casi nunca me llamaban la atención, pero el diseño estaba chulo, muy moderno, muy fashion, así que me gustó la idea y la hice. Quedó bastante cool también.',

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
      'Esta tiene más historia. Un día [Pastor](pastor), que estudió conmigo primaria y secundaria, me escribe y me presenta a [Cesar](cesar) y [Ale](ale) para aplicar a una hackathon: les faltaba uno, y me preguntó si quería animarme a aplicar con ellos. El Juan de antes habría dicho que no, tal vez por pena o por flojera, pero esta vez pensé que lo peor es que no nos aceptaran, y como mínimo nos íbamos a llevar muchos aprendizajes. Armamos varias ideas, pero la que ganó fue [Tripealo](tripealo), un marketplace de experiencias de viaje en Venezuela, y de entre mil personas que aplicaron quedamos entre las cien que fueron a las oficinas de [Yummy](yummy) en Caracas. No ganamos, pero escuché a muchos fundadores que hoy compiten en Silicon Valley contra las empresas top de Estados Unidos, y salimos con el impulso de seguir. Ellos siguieron con Tripealo, y yo salí para continuar con mi cofundador en [Salvalo](salvalo). Hoy Tripealo y Salvalo están operando, y yo estoy de lleno con Salvalo en modo founder. Ellos ahora son mis founder bros: andamos juntos, pero no revueltos. Fue el punto de inflexión entre el Juan de antes, solo programador, y el Juan de ahora, cuasi emprendedor. Estoy súper agradecido por esta experiencia: aprendí mucho de muchas personas, y mucho de mí mismo.',
    'events.alegria.m':
      'Tres días en el primer hackathon de vibe coding de Venezuela, en Caracas. Sin premio, pero con amigos nuevos y lecciones de los fundadores de [Yummy](yummy), [Cashea](cashea) y [Slash](slash). Fue el empujón que necesitábamos para arrancar con [Tripealo](tripealo) y con [Salvalo](salvalo).',
    'events.talk': 'Charla',
    'events.ilc.when': 'sept 2026',
    'events.ilc.body':
      'En la hackathon de AlegrIA, organizada por [Cashea](cashea) y [Yummy](yummy), tuvimos una charla online con [Pedro Vallenilla](pedro), el cofundador de Cashea. Meses después vino a dar una charla mejorada, mucho más completa, a Barquisimeto en persona, con el [Padre Elías Sayegh](elias). Quedamos literalmente en la segunda fila del [teatro](juares), al frente de la charla. Contó cómo fallaron varias de sus startups antes del mega éxito que fue Cashea, y aun así siguió y siguió hasta hacer Cashea. Lo que más me quedó fue cómo habla de Venezuela: al pasar por lo que ha pasado, es un greenfield para construir de todo, porque aquí no hay soluciones a través de la tecnología que en otros países ya están. Por eso Venezuela está en el mejor momento para emprender, y no en teoría, en práctica.',
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
      '[El Panal](panal) es un movimiento que creó [Manuel Sira](manuel) aquí en Barquisimeto: muchas personas construyendo de todo. Hay gente de marketing, de moda, CRM, inventario, aplicaciones de psicología y de salud, y hubo charlas de inteligencia artificial, de cómo crecer tu empresa midiendo sus datos correctamente y de cómo diferenciarte ahora que estamos en la era de la inteligencia artificial y tienes que tener gusto para hacer las cosas. Cada startup que fue al evento tenía 30 segundos exactos de pitch, y yo, nervioso, di el de [Salvalo](salvalo). No fue el mejor que he dado, pero sí fue el primer pitch oficial de Salvalo en un evento de alto calibre. Fui con mis amigos de [Tripealo](tripealo) y salí con amigos nuevos de otras aplicaciones, nuevos contactos y uno que otro lead para Salvalo. Esto es como un adelanto del Startup Summit Caracas: al momento de grabar esto no hemos ido, pero sí vamos, y esta fue la práctica de la práctica.',
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
      'Justo saliendo del Startup Venezuela Summit, fuimos directo a [Platanus Hack 26 Caracas](platanus). Este año Platanus hizo su hackathon en modo gira por Latinoamérica, y mi equipo y yo quedamos en la edición de Caracas. Aplicamos con nuestros perfiles de desarrollador, el mismo equipo de la hackathon de AlegrIA del año pasado, y no como [Tripealo](tripealo) ni como [Salvalo](salvalo), sino cada uno con su perfil. Fue gracioso: literalmente un año después de la hackathon de AlegrIA 2025, volvimos a las oficinas de [Yummy](yummy) a otra hackathon, pero esta vez más fuerte a nivel técnico. Construimos [Tridi](tridi), que convierte un video normal de una persona en data de movimiento para robots: un robot simulado aprende a moverse solo imitándote. Funciona así: tomas cualquier video, se rastrea el movimiento y se integra en una simulación física, el robot aprende a moverse por sí solo en distintos terrenos y condiciones, y se exportan los datos de la simulación y el modelo entrenado en formatos listos para hardware. Lo hicimos bajo la premisa de que la robótica y la IA is the new sexy. Dormimos poco, pero lo que aprendí en AlegrIA y todo ese mental que me trabajé me sirvió mucho para esta hackathon. Y no solo yo: el resto del equipo, que la verdad son muy duros, estuvimos todos muy locked in. Había snacks ilimitados, así que me mantenía despierto comiendo y tomando agua. Nuestro mentor fue [Sebastián Alcalá](sebastian), product engineer en Yummy y cofundador de [Wink](wink). No ganamos, pero el nivel fue impresionante: había visto los videos de las ediciones pasadas en Buenos Aires, México y Bogotá, y Caracas de verdad estuvo a la altura. El ganador tuvo un producto bien cool en 3D, y aunque perdimos, aprendimos muchísimo. Como dato curioso, nuestro espacio de trabajo estaba justo al lado del arcade de Platanus Hack, para el que hice el juego Space Explorer. Varias veces, mientras estábamos concentrados, veíamos a otros participantes pasar y jugar los juegos, y siempre lo voy a recordar, porque se les veía la cara de asombro y de felicidad, de «epa, mira, este juego está chulo». No los quise interrumpir, para no meterme en el proceso y dejar que se formaran su propia opinión del juego sin estar yo en medio. Me encantó ver eso. También hicimos muchos amigos nuevos y muchas conexiones: la verdad, el perfil técnico en Venezuela es duro. Fue genial volver a compartir una hackathon con personas con las que ya habíamos compartido la de AlegrIA el año pasado, y conocer a muchas personas nuevas. Ya llevamos dos seguidas: a ver si el próximo año aplicamos de nuevo y esta vez sí ganamos, porque la tercera es la vencida.',
    'events.platanus.m':
      'Del Summit directo a Platanus Hack 26 Caracas, de vuelta en las oficinas de [Yummy](yummy) con el equipo de AlegrIA: construimos [Tridi](tridi), video convertido en data de movimiento para robots. Sin premio, pero una hackathon mucho más fuerte, y gente jugando Space Explorer al lado.',
    'likes.paintings.meta': 'Mi colección',
    'likes.paintings.body':
      'Después de que empecé a ver las fotos del espacio, busqué también pinturas hechas por humanos que hicieran match con mi estilo. En el futuro me gustaría tener, donde sea que sea mi casa, pantallas que muestren tanto las fotos del cosmos como estas pinturas. Me gustan las pinturas con un contraste parecido al del espacio, con tanto pasando en ellas que con una sola podrías armar una película, o una serie de películas: son pinturas que son poemas al mismo tiempo. La mayoría son de pintores parecidos, por eso se parecen tanto, pero la verdad es que están muy cool. También hay una del pintor español Velázquez, y otras de las que no sé el pintor, o sí lo sé pero prefiero no ponerlo. Estas tampoco tienen ranking, porque me gustan todas y salen aleatoriamente.',
    'likes.title': 'Más de mí',
    'likes.cosmos.name': 'Cosmos',
    'likes.paintings.name': 'Pinturas',
    'likes.games.name': 'Videojuegos',
    'likes.games.body':
      '[Ghost of Yōtei](yotei) y [Elden Ring](elden) son de mis juegos top, y a los dos les saqué el platino, como siempre digo. Al terminar Ghost of Yōtei tomé fotos de los outfits con los que lo terminé, porque hay varios y quería recordar cuáles me gustaron más. Siempre tenía la misma configuración, pero ordené muy bien los outfits para cambiarlos como quisiera. Elden Ring es un juego mega cinematográfico: Ghost of Yōtei es bueno, pero Elden Ring es otra cosa, no tiene nombre. Mi hermano ya se lo había jugado, así que desde el principio tenía mapeadas las fotos que quería tomar cuando lo platinara, con mi configuración y la armadura que escogí. Como ya sabía más o menos cómo era, desde el principio hasta el final tenía mapeado todo lo que iba a hacer y lo que tenía que conseguir, y quienes hayan jugado Elden Ring saben lo difícil que es planear eso desde el principio. Mi hermano es un pro y me ayudó mucho. Me tomó 78 horas, y con esa armadura, que creo que se llama la armadura de la noche, se ve demasiado, demasiado duro.',
    'likes.cosmos.body':
      'El espacio siempre me ha fascinado. Me identifico mucho con el nihilismo optimista: al ver lo vasto que es el espacio, el universo, el cosmos, mucho de lo que te preocupa en la vida deja de tener sentido, al menos en mi caso. Hay cosas tan imponentes allá afuera, fuera de este planeta y de esta galaxia, y nosotros somos una mente tan compleja en un cuerpo tan débil y mortal: un contraste de otra escala. Ahorita mismo puede haber gente comprando casas y gente vendiéndolas, alguien que celebra un nacimiento y alguien que llora una pena, y te das cuenta de que nadie es especial, aunque nos sintamos especiales, y de que al universo lo que pasa le es indiferente. En vez de rechazar ese sentimiento, por lo heavy y lo loco que es, decidí admirarlo y amarlo: la existencia misma de un universo tan complejo, y nosotros, un cuerpo tan frágil con una mente tan compleja. Por eso me gustó tanto el espacio, los libros y las fotos del espacio, y empecé a ver fotos del [James Webb](webb) y del telescopio [Hubble](hubble) durante horas y horas. Estas que están viendo son las que más me gustan, y salen aleatoriamente: son tan buenas todas que no encuentro manera de rankearlas.',
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
    'hero.hi': '你好',
    'store.soon': '即将推出',
    'hero.caption':
      '你好，我是 Juan Villa，一名软件开发者。我做软件，就像我玩电子游戏一样：目标是白金奖杯。从 2022 年起，我远程为墨西哥的公司工作，也有西班牙和阿根廷的客户。我先学了电子工程，后来又学了计算机技术，但教会我最多的，是动手做东西。在这个网站上，你会看到我为自己做的应用，它们也上架了应用商店；还有我的工作、我的创业公司 Salvalo，以及我参加过的创业和开发活动。这个网站有西班牙语、英语和中文，可以在右上角切换。整个页面都有旁白，声音播放时会出现字幕；想读内容就要听，不过你也可以把音量调低。没错，这是我真实的声音，不是人工智能。欢迎。',
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
      '我以前在 YouTube Music 听歌，但广告一直弹出来。很多时候，如果我喜欢一首歌，我喜欢听它慢的、快的、超慢的、超快的版本。还有很多时候，我只想听中间的 30 秒、开头的 20 秒，或者结尾最好听的部分。当然，我会一遍又一遍地重复播放。',
    'shaper.solution':
      '所以我做了 Sound Shaper，一个不用网络也能用的个人 MP3 播放器。歌曲只要加入一次，就能调慢、调快，加上你想要的音效，还有均衡器，也能把最喜欢的部分做成片段。在 YouTube Music 上，歌曲上传时是什么样就是什么样；在这里，你加入歌曲、调整它，由你决定怎么听。',
    'shaper.s1.p1':
      '这是你的资料库。这个应用不下载音乐：你自己加入自己的 MP3，仅供个人使用，在这里拖动它们，按你喜欢的顺序排列。',
    'shaper.s1.p2':
      '它支持小组件、锁定屏幕和灵动岛。从这里也能进入设置，修改账户信息、应用语言和外观。还有一个小细节：像 PlayStation 那样的奖杯。你用得越多，解锁的奖杯就越多，直到拿到珍贵的白金奖杯。',
    'shaper.s2.p1':
      '这是播放器界面，很普通，就像 YouTube Music 或 Apple Music。在这里你可以播放、暂停和切换歌曲。',
    'shaper.s2.p2':
      '重点在下方的栏里，从那里打开 Shape 和 Clips。这两部分就是这个应用存在的理由。',
    'shaper.s3.p1':
      'Sound Shaper 这个名字就来自这里，来自 Shape：这个应用是一个声音塑形器。有现成的预设，懂音乐的话可以手动调均衡器，还能改变歌曲的速度，慢或快，随你喜欢。',
    'shaper.s3.p2':
      '保持原调是做起来最有意思的部分。在 YouTube 上，把歌曲放慢，人声听起来就像慢动作。在这里，你可以选择让它听起来一样，跟着节奏的速度。还有回声和 next room 这样的音效，可以组合起来，让音乐听起来像在演唱会现场、在演唱会的停车场，或者在听隔壁邻居家的派对。戴上耳机、闭上眼睛，它真的会把你带到那个时刻。这里给你一个简短的例子，听听 DÁKITI 配上应用里的音效是什么效果。',
    'shaper.s4.p1':
      'Clips 的灵感来自 Apple 的语音备忘录，我正是用它录下了做这个应用和这个页面的想法。你只要选出歌曲里最喜欢的那一段，就好了。',
    'shaper.s4.p2':
      '把它存储为片段，一遍又一遍地听。在这里也可以打开 Shape，让你正在制作或编辑的片段照你的方式响起。',
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
    'arcade.p1':
      'Space Explorer 最初是我为自己的应用做的彩蛋，这次是 Sound Shaper：进入应用里的某个地方，按特定的组合轻点，Space Explorer 就会以游戏模式打开。它本来有好几个关卡，海里、太空、一场太空大战，但我把它拿掉了，免得 Sound Shaper 变复杂。几个月后，我们报名了 [Platanus](platanus) 的黑客松，里面有一个街机挑战：做一款电子游戏。我早就有现成的想法，所以就用它来报名。这是一款只有 50 KB 的 3D 太空射击游戏，不是 MB，说实话做得挺酷的。你可以在这个页面上玩，也可以在 Platanus 的官方网站上玩。我不知道它在技术上是不是最好的游戏；按人气投票不是，但它依然是一款超酷的游戏。',

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
      '从 2022 年起，我在 [Crol](crol) 工作，这是一款面向墨西哥企业的云端 ERP。我还开始做 Conto Pay，它是 Crol 更简单、更好用的版本：包括它的网站、落地页和移动应用。而这个应用正是 Crol ERP Móvil 的基础，我从零开始设计并开发了它。',
    'work.salvalo.body':
      '我是 Salvalo 的联合创始人，这是我的创业公司。商家每天打烊时都有还能卖的商品，在 Salvalo 上把它们变成带价格和取货时间的组合包。顾客在应用的地图上找到附近的组合包，预订，直接付款给商家，再凭验证码取货。我常举的例子：一家面包店早上有 10 个 cachito，到下午 5 点还剩 3 个和 2 个法式面包，就把它们打包，用打烊折扣价出售。商家赢了，因为商品卖出去而不是浪费，还多了顾客，因为 Salvalo 是额外的销售渠道。顾客则在下午以优惠价、非常方便地买到早上那些 cachito。我是技术联合创始人：我重新设计了应用和网站，负责全部前端开发。我也是 Salvalo 在委内瑞拉的代表，所以会去向商家介绍，也代表 Salvalo 参加各种活动。',
    'work.maktub.body':
      'Maktub Art Fund 是一位来自墨西哥的客户。那是一个落地页，这类页面我很少感兴趣，但设计很漂亮，非常现代、非常时尚，所以我喜欢这个想法，就做了。成品也挺酷的。',

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
      '这一段故事更多。有一天，和我一起读小学和中学的 [Pastor](pastor) 给我发消息，介绍我认识 [Cesar](cesar) 和 [Ale](ale)，一起报名一场黑客松：他们还差一个人，问我愿不愿意加入。以前的 Juan 会说不，也许是因为害羞或懒，但这次我想，最坏不过是没被录取，至少我们能学到很多。我们想了好几个点子，最后胜出的是 [Tripealo](tripealo)，一个委内瑞拉旅行体验的交易平台；在一千个报名的人里，我们成为去加拉加斯 [Yummy](yummy) 办公室的一百人之一。我们没有获奖，但我听了很多如今在硅谷和美国顶尖公司竞争的创始人分享，带着继续前进的动力离开。他们继续做 Tripealo，而我离开去和我的联合创始人继续做 [Salvalo](salvalo)。如今 Tripealo 和 Salvalo 都在运营，我也以创始人的身份全力投入 Salvalo。他们现在是我的创始人兄弟：一起，但各做各的。这是一个转折点，从以前只是程序员的 Juan，到现在几乎是创业者的 Juan。我非常感谢这段经历：我从很多人身上学到很多，也更了解了自己。',
    'events.alegria.m':
      '在加拉加斯参加委内瑞拉第一场 vibe coding 黑客松的三天。没有拿奖，却交到新朋友，也从 [Yummy](yummy)、[Cashea](cashea) 和 [Slash](slash) 的创始人那里学到很多。它正是让 [Tripealo](tripealo) 和 [Salvalo](salvalo) 起步的那一推。',
    'events.talk': '讲座',
    'events.ilc.when': '2026 年 9 月',
    'events.ilc.body':
      '在由 [Cashea](cashea) 和 [Yummy](yummy) 主办的 AlegrIA 黑客松上，我们和 Cashea 的联合创始人 [Pedro Vallenilla](pedro) 有过一场线上交流。几个月后，他亲自来到巴基西梅托，和 [Elías Sayegh 神父](elias) 一起做了一场更完整的升级版演讲。我们就坐在[剧院](juares)第二排，正对着讲台。他讲了自己好几个创业项目如何失败，直到 Cashea 的巨大成功，他一直坚持，直到做出了 Cashea。我印象最深的是他怎么谈委内瑞拉：经历了这一切之后，它是一片可以建造任何东西的绿地，因为这里还没有其他国家早已有的科技解决方案。所以委内瑞拉正处在创业的最好时机，不是理论上，而是实践中。',
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
      '[El Panal](panal) 是 [Manuel Sira](manuel) 在巴基西梅托发起的一个运动：很多人在这里做各种各样的东西。有做营销、时尚、CRM、库存，以及心理和健康应用的人，还有关于人工智能、如何正确衡量数据来发展公司、以及在人工智能时代如何靠品味脱颖而出的演讲。每个到场的初创公司都有整整 30 秒的路演时间，我很紧张，但讲了 [Salvalo](salvalo) 的。那不是我讲得最好的一次，却是 Salvalo 在这种级别活动上的第一次正式路演。我和 [Tripealo](tripealo) 的朋友们一起去，离开时多了来自其他应用的新朋友、新联系人，还有几个 Salvalo 的潜在客户。这算是加拉加斯 Startup Summit 的预演：录这段话时我们还没去，但一定会去，而这次是练习的练习。',
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
      '刚离开 Startup Venezuela Summit，我们就直接去了 [Platanus Hack 26 Caracas](platanus)。今年 Platanus 把黑客松办成了拉美巡回，我和我的团队入选了加拉加斯站。我们以开发者身份报名，还是去年 AlegrIA 黑客松的同一支队伍，不是以 [Tripealo](tripealo) 或 [Salvalo](salvalo) 的名义，而是各自以个人背景报名。很有意思：在 2025 年 AlegrIA 黑客松整整一年后，我们又回到 [Yummy](yummy) 的办公室参加另一场黑客松，只是这次技术难度高得多。我们做了 [Tridi](tridi)，它把一段普通的人物视频变成机器人的动作数据：一个模拟机器人通过模仿你自己学会移动。它的流程是这样的：拿任意一段视频，追踪其中的动作并导入物理模拟，机器人在不同地形和条件下自己学会移动，然后把模拟数据和训练好的模型导出为可直接用于硬件的格式。我们的出发点是：机器人和 AI 就是新的潮流。我们睡得很少，但在 AlegrIA 学到的东西和我磨炼出的心态，在这场黑客松里帮了我很多。不只是我：团队其他成员说实话都非常强，我们所有人都非常投入。零食无限量供应，所以我靠吃东西和喝水保持清醒。我们的导师是 [Sebastián Alcalá](sebastian)，Yummy 的产品工程师，也是 [Wink](wink) 的联合创始人。我们没有赢，但整体水平令人惊叹：我看过布宜诺斯艾利斯、墨西哥和波哥大往届的视频，加拉加斯真的毫不逊色。冠军做了一个很酷的 3D 产品，虽然我们输了，但学到了非常多。一个有趣的细节：我们的工作区就在 Platanus Hack 的街机旁边，我就是为它做了 Space Explorer 这款游戏。好几次我们正专注的时候，看到其他参赛者走过来玩这些游戏，我会一直记得，因为能从他们脸上看到惊叹和开心，那种“哇，你看，这游戏真酷”的表情。我不想打扰他们，没有参与进去，让他们在没有我在场的情况下形成自己对游戏的看法。我很喜欢看到这一幕。我们还交了很多新朋友，建立了很多联系：说实话，委内瑞拉的技术人才很强。能再次和去年一起参加 AlegrIA 的人共度一场黑客松，还认识了很多新朋友，真的很棒。我们已经连续参加两届了：看看明年会不会再报名，这次能不能赢，因为事不过三。',
    'events.platanus.m':
      '从峰会直接去了 Platanus Hack 26 Caracas，和 AlegrIA 的队友回到 [Yummy](yummy) 的办公室：我们做了 [Tridi](tridi)，把视频变成机器人的动作数据。没有拿奖，但这是一场难得多的黑客松，旁边还有人在玩 Space Explorer。',
    'likes.paintings.meta': '我的收藏',
    'likes.paintings.body':
      '开始看太空照片之后，我也去寻找和我风格契合的、由人画出来的画作。将来不管我的家在哪里，我都希望有几块屏幕，同时展示宇宙的照片和这些画作。我喜欢和太空有类似反差的画，里面发生的事情多到仅凭一幅就能拍成一部电影，甚至一个系列：这些画同时也是诗。大多数出自风格相近的画家，所以看起来很像，但说实话真的很酷。还有一幅是西班牙画家委拉斯开兹的，另外几幅我不知道作者，或者知道但宁愿不写。它们同样没有排名，因为我全都喜欢，顺序是随机的。',
    'likes.title': '更多关于我',
    'likes.cosmos.name': '宇宙',
    'likes.paintings.name': '画作',
    'likes.games.name': '电子游戏',
    'likes.games.body':
      '[《对马岛之魂：羊蹄山》](yotei)和[《艾尔登法环》](elden)都是我的最爱游戏，两款我都拿到了白金，我总是这么说。打通《羊蹄山》时，我给最后穿过的装束拍了照，因为有好几套，我想记住最喜欢的是哪些。我的配置一直不变，但我把装束整理得很好，想怎么换就怎么换。《艾尔登法环》是一款超级有电影感的游戏：《羊蹄山》很好，但《艾尔登法环》是另一回事，简直无法形容。我哥哥已经玩过，所以我从一开始就规划好了拿白金时要拍哪些照片，用我的配置和我选的盔甲。因为我大概知道游戏的走向，从头到尾我都规划好了要做的每件事和要拿到的东西，玩过《艾尔登法环》的人都知道从一开始就这样规划有多难。我哥哥是高手，帮了我很多。我花了 78 个小时，穿着那套盔甲，我记得叫夜之盔甲，看起来超级超级帅。',
    'likes.cosmos.body':
      '太空一直让我着迷。我很认同乐观虚无主义：当你看到太空、宇宙有多么浩瀚，生活中很多让你担心的事就不再有意义，至少对我来说是这样。外面有那么宏伟的东西，在这颗星球和这个星系之外，而我们是一个如此复杂的头脑，住在如此脆弱、终有一死的身体里：这是另一种尺度的反差。此刻可能有人在买房，有人在卖房，有人在庆祝新生，有人在悲伤，你会意识到没有人是特别的，即使我们觉得自己特别，而发生的一切对宇宙来说都无关紧要。我没有排斥这种感觉，尽管它沉重又疯狂，而是决定欣赏它、热爱它：一个如此复杂的宇宙本身的存在，以及我们，脆弱的身体里装着如此复杂的头脑。所以我爱上了太空，关于太空的书和照片，我开始一连几个小时地看[詹姆斯·韦伯](webb)和[哈勃](hubble)望远镜的照片。你们看到的是我最喜欢的，顺序是随机的：它们都太好了，我找不到给它们排名的办法。',
  },
};
