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
  'soon.narration.zhAfterEn': "I'm currently recording the Chinese videos.",
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
    "Hi, I'm Juan Villa and I love making software. I always say I like making software the way I like playing video games, and that's going for the platinum. I also think it's one of the closest things to magic in this simulation, because basically if you can imagine something and figure out how to build it, you can create some really, really cool things. And if you then pair that software you built with hardware, you can create things that are even cooler. As a fun fact about this page, I built it with a single challenge, and that was to make it as personal as possible. I didn't look at a single reference and, beyond giving it my own branding, I said: look, I'll record myself and that's it. So the page is like a movie: it's in video, it's in audio and it's subtitled too. And it makes me laugh because it's like a mini Horcrux of mine living here. It's designed to be as timeless as possible as the months and years go by, and whenever I see it I laugh thinking back to when I recorded it, because I'm not going to keep re-recording it all the time. On this page I'll show you what I'm up to, the things I like and that's it. Welcome.",
  'footer.caption':
    "Well, thank you very much for listening to me, for watching me, for hearing me and for reading me. If you have any comments, you can send them to me through the different channels available. As for me, I'll keep building and I'll keep going for the platinum. There are also quite a few sections, so if you made it to this point and watched everything, at least on the main page, I congratulate you because some of them were really, really long. And as a fun fact, I didn't record all of these videos in a single session because I would have completely lost my voice, since I do many takes and pick the worst one—no, just kidding, the one that feels as natural as possible. And that's why in some of them I might look a bit different, or the framing looks different, or you can hear rain: it's for that very reason. Anyway, I'm super happy to have built this page, let's see what I keep building next, and thanks for stopping by.",
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
    'Look, I used to listen to a lot of music on YouTube Music, but ads kept popping up all the time. And many times I liked listening to a song in four versions—slow, very slow, normal, fast and very fast—well, five versions. And many other times what I really wanted was to listen to the 30 seconds right in the middle, the best part of the song. And I played it again, and again, and again.',
  'shaper.solution':
    "And that's why I built Sound Shaper: it's a personal MP3 player that's free, ad-free, open source and packed with interesting features, like sound presets, a manual equalizer if you know more about music and want to dial it in to the exact point, live playback speed control and other really cool filters. It has Auto DJ—DJ Juan, that's me as the DJ—and it works just the way I wanted. You can create clips of the specific parts you like best and loop those specific clips with any shape you want, so if you want to hear all the clips of a song sped up, you can do right that. The song keeps playing when your phone is locked too, and well, that's it.",
  'shaper.s1.p1':
    "This is your library. The app doesn't download music: you upload your own MP3s, and here you can drag them around to organize your library however you like.",
  'shaper.s1.p2':
    "It comes with widgets, and from this screen you can also change the app's theme — dark mode or light mode — and its language. It also has trophies just like PlayStation's: the more you use the app, the more it rewards you with better trophies until you earn the coveted platinum.",
  'shaper.s2.p1':
    'This is the player screen, just like YouTube Music or Apple Music. From here you can hit play, pause, next song or previous song.',
  'shaper.s2.p2':
    'What matters most is the bottom bar, which holds the two reasons this app exists: Shape and Clips.',
  'shaper.s3.p1':
    'This is where the name of the app comes from, Sound Shaper: basically the app is a sound shaper. You can change, as I mentioned earlier, the playback speed, the presets, the equalizer, there are filters, the playback speed and you can turn on Auto DJ mode.',
  'shaper.s3.p2':
    "Preserving the pitch was one of the most interesting parts to build. Basically on YouTube or YouTube Music, if you put a song or a video at 2x or 0.75x, the voice goes either super fast or super slow, as if it were in fast-forward or slow motion. Here in Sound Shaper you can set it so the voice keeps its natural pitch at the pace of the song's rhythm, in this case the voice of the person speaking or singing. On top of that there are filters like echo and next room: when you start playing around and combine them, it feels as if you were transported to a concert, or standing in a concert parking lot, or as if your neighbor were throwing a party at full volume next door while you hear that effect from home, or as if you were at a party but stepped into a room—say, washing your face in the bathroom—hearing that nostalgic muffled atmosphere, and it's so fun to recreate that without being at a party or a concert. So here's a quick example of how Bad Bunny's song DÁKITI sounds in Sound Shaper with Auto DJ mode in this version, because Auto DJ keeps getting better.",
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
    "Space Explorer started as an easter egg for my apps, in this case Sound Shaper: you were going to enter a specific part of the app, tap a few secret spots there and it would switch into game mode, unfolding a level or two of Sound Shaper with a full narrative story that would connect with the rest of the apps I released. But that overcomplicated the product way too much and was really hard for anyone to find because it was super hidden and literally only I knew about it, so to simplify things and let Sound Shaper just be Sound Shaper, I removed it. Right around that time, by a twist of fate, we applied to a [Platanus](platanus) hackathon here in Venezuela, in Caracas, and one of the side challenges was to build an arcade game. Since I already had the concept worked out, I said: look, let's build Space Explorer, but as an arcade game. It was a really interesting challenge because the game had to weigh at most 50 kilobytes—50 KB—and I managed to make it a 3D space shooter with a really cool map and a clean minimalist style because, rather than pixel art, I preferred building something more technical that looked even cooler. In fact it even has a black hole and runs super well, with lots of features in how the ship handles. You can play it right here on this page or on [Platanus Hack's official website](arcade), and I hope you like it. At the hackathon there were very few 3D games—obviously there were many cool entries—and it turned out great. As it shipped, so it stays: I'm not going to add anything else to it because the idea is that how it stayed for the hackathon is how it stays forever, and if I make another game it'll be a different game, no longer Space Explorer.",

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
    '[Crol](crol) is a cloud ERP for SMBs in Mexico, and at Crol I started with Conto Pay. It is a much simpler, much easier-to-use product from Crol where I led the development of the web system, the mobile app and the landing page. In this case, that mobile app later served as the foundation for Crol ERP Móvil, which I also built and designed from scratch.',
  'work.salvalo.body':
    "I'm a cofounder of [Salvalo](salvalo), it's my startup, and with it I'm a first-time founder—though there are earlier stories too, with this one you could say I'm a first-time founder—and Salvalo is a food-offers marketplace. Basically, every day in Venezuela there are businesses that close the day with food or products that could have been sold, and Salvalo solves that problem. How? Imagine a bakery that makes 10 cachitos in the morning and in the afternoon has 3 left along with 2 French breads: with those products it puts together a pack and sells them through the app, customers buy them at an offer price, a closing price, and obviously both sides win. Why? Because the business doesn't lose that product and doesn't lose the cost of that product: it doesn't earn as much as selling at full price, but it doesn't lose, and it gets a new customer and a new sale because Salvalo works as an external sales channel. On the customer's side, it's the exact same morning cachitos, in the afternoon, at an offer price and in a very convenient way. How the app and the system work is a pretty simple process; the hard part is onboarding businesses and finding customers. Salvalo is really interesting and I like it a lot: I'm a cofounder and I'm specializing more on the marketing and sales side—especially sales—because as Salvalo's current representative here in Venezuela, I'm the one pitching businesses. And that helps me a lot because I've practiced not only how to sell, but also how to get over the shyness of approaching a real business and knowing what to say, something you always keep practicing, especially for me. Before, I had a profile that wasn't necessarily shy, but definitely introverted, thinking: look, why am I going to approach this person about this?, and now I have to do it no matter what because otherwise there are no shops on Salvalo. Obviously, having a technical background, I've also worked on the website, the landing page, the web system, the web app and the mobile app too, and honestly Salvalo is coming along great. I've learned a ton: I think that experience of a real startup that's serious—or wants to be serious—needs to happen as early as possible in your life, because you learn so much and it puts you in a mindset and an environment that pushes you to improve not only as a startup founder, but as a person in general. In fact, most of the events I went to this year were representing Salvalo—you can see them in the events section, whether it's above or below since I keep moving it, no, just kidding, I don't change it all the time, but up or down in the events section—at El Panal and the Startup Venezuela Summit I went as Salvalo and it was super cool. Building something for Venezuela is always meaningful too, since it's the country where I was born and where I currently live. Anyway, that's it: that's Salvalo, so go save your packs.",
  'work.maktub.body':
    "[Maktub Art Fund](maktub) is a client from Mexico and, well, it's just a landing page, which normally doesn't catch my eye that much—just building a standalone landing page—but this one had a really interesting design I hadn't built before, and it turned out super modern, very fashion-forward, and I really liked the final result.",

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
    "This one has more of a story. [Pastor](pastor), who went to primary and secondary school with me, suddenly texted me one day and introduced me to [Ale](ale)—Alejandro—and [Cesar](cesar) to apply to a hackathon organized by [Yummy](yummy), [Cashea](cashea), [Slash](slash) and AlegrIA Labs at Yummy's offices in Caracas. The old Juan back then probably would have said no out of shyness, fear or laziness, but in that moment I said: well, at the very least we're going to learn a ton, let's go for it. So we held lots of meetings, decided the idea would be [Tripealo](tripealo), a travel-experiences marketplace for Venezuela, applied, made an application video and everything, and out of more than a thousand people we were selected among the top 100 to go to Yummy's offices in Caracas for the hackathon. It was 36 hours of building the product: we didn't win, we didn't even make the top 10, but it taught me so much about how the startup world works. It taught me a lot about myself and honestly the team was amazing, the 1% team: they kept going with Tripealo while I stepped out to start [Salvalo](salvalo), though we always stick together in this world of entrepreneurship or startups—I like the word startup better than entrepreneurship. It's an experience I always remember: our team was Tech Bros, and from every event I go to what I keep most are these badges, these IDs, because I'm collecting them like Infinity Stones and it cracks me up, since every time I look at them I teleport right back to that moment, everything my team and I learned, and all the people we met. There were super interesting talks both over video call with all those founders and with many others in person: truly a 10 out of 10 experience and one of the first hackathons of that caliber held in Venezuela—it was the second one organized by Yummy, and the first at that scale. I'm super grateful for this experience: it was the turning point between the Juan who only works in programming versus the Juan who wants to build products people use and maybe change the world through software or hardware; a turning point that probably would have come eventually, but this accelerated it a lot, because it was a total mindset shift before and after that October in Caracas.",
  'events.alegria.m':
    "Three days at Venezuela's first vibe-coding hackathon, in Caracas. No prize, but new friends and lessons from the founders of [Yummy](yummy), [Cashea](cashea) and [Slash](slash). It was the push we needed to get going with [Tripealo](tripealo) and [Salvalo](salvalo).",
  'events.talk': 'Talk',
  'events.ilc.when': 'Sep 2026',
  'events.ilc.body':
    "At the AlegrIA Labs hackathon [Pedro Vallenilla](pedro) also spoke over video call, and a year later, around the third or fourth quarter of the year, Pedro Vallenilla came to Barquisimeto, my city in Lara state, Venezuela, to give a leadership talk alongside [Father Elías](elias), who is also very well known here in Barquisimeto. So we went again with the team, sat literally in the second row of the [theater](juares), right there up close, and it was amazing to watch the person who built [Cashea](cashea) tell his story. To prepare, I had watched all the interviews he had done, at least the most famous ones, and at that event he shared some really specific stories I hadn't heard before. What stayed with me most is that for him Venezuela is like a greenfield—at least that's what I took away from what he said: you can build so many things because, after everything the country has been through, there is huge room to create tech products that already exist across Latin America and are foundational. Just look at Cashea: who would have imagined something like Cashea would take off here—credit without being a bank, done in a very specific way because they don't issue credit like a traditional bank. It's such a crazy idea where you think: no way, is that really going to work in Venezuela?, and on top of that when Cashea launched they went through the COVID boom and everything, truly against all odds. I actually remember once seeing someone from Cashea's sales team promoting it at the Sambil mall in Barquisimeto, and looking back I think: wow, they literally had to go door to door from shop to shop, which he talks about a lot in that talk—going from business to business while people told them: you're crazy, how are you going to do that, get out of here. And that drive to keep going and push forward—one venture works, then the next ones don't work, and don't work, and don't work—until finally hitting Cashea, which right now in 2026 is moving percentages of Venezuela's entire GDP, is an insane scale, so it was super, super cool to see him in person.",
  'events.ilc.m':
    "[Pedro Vallenilla](pedro) of [Cashea](cashea), in person this time and in my city: one startup that worked, several that didn't, then Cashea, and why Venezuela is the place to build.",
  'events.interview': 'Interview',
  'events.radio.when': 'Oct 2026',
  'events.radio.body':
    "This was [Salvalo](salvalo)'s first radio interview, on [OK 101.5 FM](ok101), on [Cheo Noguera](cheo)'s show here in Barquisimeto. It was my first time on the radio—I had been on TV when I was much younger, though that's another story—and my cofounder Abrahan also joined online since he's in Spain. Honestly it was a super interesting experience and I learned a lot: I thought I would be nervous, yet instead I just wanted to talk and keep sharing about Salvalo. We talked about what Salvalo is, our story and how we started it; radio listeners called in with questions, we answered them right on the spot, several installed the app right there and told us: hey man, that's awesome, keep pushing forward. And I gave the example I always use with Salvalo: imagine you're a bakery, in the morning you make 10 cachitos and in the afternoon—say at 6 p.m.—you have 3 left, so with those 3 cachitos and 2 French breads you put together a pack that you sell at a closing offer price through the app. Since Salvalo works as an extra sales channel, you sell that pack, you don't lose the product, you land that sale and possibly gain a new customer who didn't know you or wasn't a regular at your physical shop, but discovered you through Salvalo and said: oh look, they post great offers these days, let's buy packs from them. And on the customer's side, it's the exact same cachitos and French bread baked in the morning, bought in the afternoon at an offer price, so everyone wins. I also like keeping and remembering these kinds of events and situations where I represent Salvalo, because while going to the radio with Salvalo was great and I loved it, it also serves as startup founder training for the next projects ahead: learning how to approach different situations and communicate a startup to any kind of profile rather than speaking as a developer, because explaining Salvalo to someone who has owned a bakery for 20 years is completely different. So I always see it as training: it was my first radio training and honestly it was really cool, I hope it happens again soon so I can keep practicing my radio host skills.",
  'events.radio.m':
    "[Salvalo](salvalo)'s first interview, live on [OK 101.5 FM](ok101) in Barquisimeto: the host downloaded the app on air while I walked his listeners through it.",
  'events.meetup': 'Meetup',
  'events.panal.when': 'Oct 2026',
  'events.panal.body':
    '[El Panal](panal) is a movement [Manuel Sira](manuel) created here in Barquisimeto to bring together all kinds of tech profiles in Lara state so everything isn’t always only in Caracas. I went with my friends from [Tripealo](tripealo), and the event was really cool because you had to pitch whatever your project was in 30 seconds, and I gave the first official pitch for [Salvalo](salvalo). I gave the exact example I always use, the bakery one—you have 3 cachitos left in the afternoon and sell them as a pack on Salvalo—and there I really was nervous because there were around 140 people at the Galión restaurant in the Jirajara Hotel, and not everyone got to go up and pitch. There were only about 3 or 4 rounds where maybe 7 or 5 people pitched per round, and I didn’t make it into the first round, then made it into the second one, going second. I was nervous because of the mental pressure building up knowing it was 30 seconds and they cut you off: the moment you started they said “go,” you had a 30-second countdown screen right behind you, and when it hit zero the buzzer sounded and they stopped you wherever you were. Everyone who gave a pitch managed to finish what they wanted to say and I also managed to say everything I wanted: I was nervous and could tell I sounded nervous, yet I took it as great practice. On top of that, the event and the movement are really great because they bring together lots of people who aren’t just building apps: there were people building psychology apps, a team with a bathroom-finder app called [Resty](resty)—a super wild idea—alongside people in marketing, fashion and classic tech systems like CRMs, plus really interesting talks on growing your business by measuring data and tracking internal stats. And there was another talk on something I already had very much in mind: that in the age of artificial intelligence, what sets you apart isn’t so much the technical side—because AI can do almost anything you tell it to, and grows more capable over time—since being a machine or a robot, it lacks human taste, the artistic side of making things, which matters more and more in this era of AI. That human taste you bring on top of the machine’s work has existed ever since humans and machines started interacting to create things: for example, an armchair handcrafted by a master carpenter or artisan is obviously not the same as a factory armchair, and that translates directly into the world of AI and technology right now in 2026 and will only become more obvious. So it was a really cool event: it’s called El Panal because each person is a cell in the honeycomb interconnecting with others. In fact, I landed a few leads for Salvalo and got to share my idea: as a first-time founder—which I was when I went with Salvalo—you practice getting over that shyness I still keep working on, walking up to say “look, I build this, this is Salvalo, what do you do?”, losing the fear of selling your idea and talking to people about something you built. It was excellent, honestly super cool, and once again this is the second lanyard badge I’m keeping in my collection: let’s see how many I end up with.',
  'events.panal.m':
    'A night of [El Panal](panal) in Barquisimeto: talks on AI, data and taste, and 30 seconds to pitch [Salvalo](salvalo). Nervous, but I gave it, and left with new friends and a lead or two.',
  'events.summit': 'Summit',
  'events.summit.when': 'Oct 2026',
  'events.summit.body':
    "I attended the [Startup Venezuela Summit](summit), and honestly I had never been to an event like it: it was way, way too cool. We went to lots of talks: we saw [Pedro Vallenilla](pedro) from [Cashea](cashea) again in one talk, [Víctor Cárdenas](slash) from Slash in another, and there were many talks with profiles I never imagined hearing and many I didn't even know existed or built this exact kind of product. Honestly it was amazing: I met one of the cofounders of [Rial](rial) and all kinds of people from abroad building projects or looking to invest here, with cool stories of US companies that have one or two Venezuelan founders, run a venture capital fund and were early investors in Anthropic; I thought I would see mostly regional profiles, yet it was one of the most globalized tech and entrepreneurship events I've ever attended. Beyond the private workshop we attended, the event was super cool because there were talks happening constantly across different stages and auditoriums at Caracas Campus, and they updated the schedule in real time in the app with secret sessions—well, not secret since they showed up in the app—hosted in the commercial wing of Caracas Campus, not in the public summit halls, right inside the offices of companies headquartered there. One of the most interesting sessions was a reverse investor pitch: instead of founders pitching venture capital funds, the VCs were pitching the founders saying “look, come work with us, here's what we do,” sharing stories like “we don't invest in startups that aren't projected to make at least a billion dollars a year,” which makes you realize: wow, this is serious, this isn't a game. We were also in a private workshop hosted by [Fina](fina) with the people from [Innoven](innoven), the accelerator of [Square One Capital](squareone), and I put up the sticker—well, not a sticker, the photo they took of me with [Salvalo](salvalo)—applying to Innoven with Salvalo right there and walking away with the photo and an Innoven cap, which was super cool. I think one of the biggest takeaways I left with is that if you want to build a startup and feel willing to do what it takes to pull it off, do it, because it doesn't matter your age, where you come from or your background: if you put your heart and drive into it you can achieve it, and the farther you aim, the better. In a way it almost worked in reverse on me, because now I think: look, I'm building something for Venezuela, and maybe instead of spending my time only here I should be going all-in on something in the global big leagues—let's see what we can do. Being in that environment wraps around you and kept reminding me of Steve Jobs's quote that the people crazy enough to think they can change the world are the ones who actually do. And once again, this lanyard badge is one of the best so far: it has my name, Juan Villa, and on the back the C-level title I hold at Salvalo—they gave us this sticker and I stuck it right on—so I'm growing my collection not just physically in badges, but mentally in startup experience and knowledge I put into practice; once again I went with my friends from [Tripealo](tripealo) and it was amazing.",
  'events.summit.m':
    "Two days at the Startup Venezuela Summit with [Tripealo](tripealo): talks by [Slash](slash) and [Cashea](cashea), a private workshop with Fina and Innoven we were invited to for our founders' jackets, and [Salvalo](salvalo) on the wall of Venezuelan founders.",
  'events.platanus.when': 'Oct 2026',
  'events.platanus.body':
    "Right after leaving the Startup Venezuela Summit we went straight to [Platanus Hack 26 Caracas](platanus), again in Caracas, and it was funny because we had planned our trip for the Startup Venezuela Summit and right after, on the very day it ended, there was a hackathon organized by Platanus Ventures—which has a branch, so to speak, where they run hackathons across Latin America, and this was their first Latam tour—and guess where the hackathon headquarters were once again: right back at [Yummy](yummy)'s offices. That made it even funnier because literally one year after the AlegrIA hackathon we went back to the Platanus hackathon at Yummy's offices, with even more people repeating both hackathons. Honestly it was a 10 out of 10, that hackathon was amazing: we slept very little across 36 hours, and the Platanus team, the Yummy team and all the sponsors organized everything so well, there was food after food and I kept getting up every so often to drink water so I wouldn't fall asleep. Everything not only I but the rest of my team had learned from past hackathons we applied in this one, and it was literally build and build and build. The project and the track we got or wanted was all about Physical AI, because we were going to build something under the premise that Physical AI is the new sexy, so we chose the 3D track—3D as is—and built [Tridi](tridi), which basically lets you take video of people, either with your camera or a pre-loaded video, and transforms it into training data for humanoid robots. Suppose you run a robotics company and build robots, yet those robots have no way of knowing how to behave in this physical, real world: even if you have an LLM and when Anthropic eventually creates its own robot models in the future—maybe they create Claude 8.0 for Robots—there are still so many things a human can do in the physical world that a robot needs a massive amount of data. LLMs were trained on data from the entire internet, all human knowledge and every book, whereas robots don't have this kind of physical training, because think of how many actions a human can perform in an environment as basic as a kitchen—not only cooking, but washing the dishes, putting the dishes away and so many things—and in the physical environment there are so many external factors a humanoid robot has to interact with. That's what Tridi helps with: we take a video, say of someone walking, and we teach the robot how to walk, not only walking itself, but taking into account all those external factors I mentioned inside a simulation that is also created by us. That way, once you build the physical robot and ask how to train it, with Tridi we upload a video, with the idea that it will scale with multiple videos at multiple angles across many different kinds of situations, creating a shared branch of foundational knowledge distributed across all humanoid robots where you can teach a robot to walk before it even reaches the real world, and what you load into the robot's program is that policy—say `walk_v1`, for walking—and that's how Tridi works. Honestly it was perhaps a very ambitious project for that hackathon—I say that because we didn't win—yet the technical level was really great: my team and I studied the hackathons they held on this Latam tour in Buenos Aires, Mexico City and Bogotá, wondering “will Caracas have projects at that level?”, and yes, there were plenty of super cool projects, lots of sharp, deeply technical people, and truly an incredible experience. I'm very proud of Tridi and of the rest of the team too: I think we built something really cool that tries to solve a very recent problem that is going to play out over the next ten years, because literally Physical AI is the new sexy and robotics with artificial intelligence is going to be the total domain of the rest of the 21st century. It's a super interesting shift from everyday software or how we currently see and interact with a world where there are almost no robots: in the past in movies people asked “will there be robots in the future?”, and I believe there will be robots, lots and lots of robots, you just have to give it a chance—look how fast artificial intelligence advanced in such a short time, and that's how I think robotics will advance—and we want to be one of the cutting-edge technologies helping push that transition to happen as fast as possible. And in Tridi you can train more than just humanoid robots: if you go to Tridi's page, you can train any type of robot that has behavior in the physical world, it doesn't have to be humanoid, it can be an explorer robot like NASA's rover exploring Mars. From this hackathon I was super grateful once again to the Platanus and Yummy teams; our mentor was [Sebastián Alcalá](sebastian), product engineer at Yummy and cofounder of [Wink](wink): those were such great experiences, we laughed a lot and learned a lot too, so we're now two for two and let's see if next year they hold another hackathon and we win that one, because third time's the charm. And here they also gave us a lanyard badge that they made even more interesting: I have it right here and it's designed to fit in your wallet; as you can see, it has all my info because it works with NFC and lets you customize the website URL the NFC tag opens, and I obviously redirected it to this website you're on right now: juanevillam.com, J-U-A-N-E-V for Venezuela-I-L-L-A-M dot com. So I carry it in my wallet because it's literally the size of a card, and if I need to show someone my website I show them this and, if their phone has NFC—which most phones do right now—it opens my website for them. So this is a badge that isn't meant to be worn around your neck—though you can if you want—it's meant to be kept in your wallet, and it works so well because you can point it to any URL you want, it's super convenient, very useful and I love it. All the other badges are bigger and flashier, whereas this one is very much my style—that's what I mean by things that fit my style; it would have looked even better if it were black with white details, though no big deal. Honestly this event was super cool and it was a very packed week in Caracas: it feels like in October we always make our tech year, since it's always the biggest month—both this year in 2026 and last year in 2025—so let's see if it keeps going in the years ahead and happens not just in October, but across more months and more often; and well, this one is clearly much longer because it has a lot more story behind it.",
  'events.platanus.m':
    "Straight from the summit to Platanus Hack 26 Caracas, back in [Yummy](yummy)'s offices with the AlegrIA team: we built [Tridi](tridi), video turned into movement data for robots. No prize, but a much tougher hackathon, and people playing Space Explorer next door.",
  'likes.title': 'More of Me',
  'likes.cosmos.name': 'Cosmos',
  'likes.cosmos.body':
    "Space has always fascinated me: when you see how vast and infinite it is and try to understand that, it's a scale that has no word, no literal word, and puts everything in contrast. For example, everything that has happened and is happening right now has happened on planet Earth—in specific parts of planet Earth, because we haven't even explored the entire ocean—it has happened on this planet, and this planet is one of multiple planets in the solar system. The solar system is one of multiple systems in the Milky Way; the Milky Way is one of many galaxies in our galaxy cluster, which in turn is part of a supercluster and another megacluster and so on, where you say: man, there is no end. The Sun is a star, yet there are much larger stars, and the idea of a black hole is insane: supernovas, when one black hole collides with another, or when one galaxy swallows another or three merge together, happen on a scale so wild it shows you the universe is indifferent to human beings. All those things are happening out there while all our problems—whether someone is sad, happy, sick or healthy, whether something happened to them or not—and all our worries about the past, the present and the future happen on this tiny dot that is nothing compared to the universe. It puts you in your place: you are nothing more than a simple ant in a giant, incomprehensible universe, and instead of rejecting or disliking that feeling, I started loving it more and more and I adore it. I believe there is nothing more real than the universe and these [James Webb](webb) and [Hubble](hubble) photos you are looking at right now: there is nothing more real, that's the only thing that truly matters. As for these photos, I'm always making top lists, yet with these I have no way of making a top list or ranking them all: it's incredible, some are on the scale of stars and others of galaxies, to the point where I have no way to express it; and all the wild ideas about whether we're in a simulation, I love all of that. I believe humanity really has no more than two problems and they come down to one: space exploration—in fact that's where the exact name of my first game for the Platanus Hack, Space Explorer, comes from—because as I've always said, I would have loved to be born much further in the future, in a literal Star Wars future where you don't live your life on a single planet or even a single galaxy, but across multiple galaxies, which I think will happen even if right now in 2026 we're way too early, maybe in the year 10,000 or 100,000, who knows. And to achieve true space exploration, the nearest star beyond the Sun is four light-years there and four light-years back if you plan to return, and eight light-years on a human scale means you're toast. So obviously to achieve space exploration on that scale you have to be immortal: for me, the only two problems all of us humans should be focusing on—children from every country, whatever language they speak, old people, everyone, which is obviously hard, yet if you stop to think about it those would be the two—are space exploration and the search for immortality. On a realistic level, the way I see it, everything is linked: without immortality, how are you going to make a journey that long and dangerous in a body this mortal and fragile?, because we are a complex mind inside a body that breaks so easily. Imagine also being able to see not just the colonization of Mars or the Moon, but of galaxies upon galaxies, where life isn't merely multiplanetary but on the scale of at least the galaxy and then multiple galaxies and sectors of the observable universe: that will be super wild and so cool. I think that's a future worth aspiring to live in, and there is no future more interesting than that: one thing is going to the beach here on Earth—which is a very beautiful planet—yet when you think about the scale of going to another galaxy, getting as close as you can to a black hole or a star and seeing all kinds of crazy planets just like Star Wars, and being immortal on top of that, imagine how many things you would see across time. So yes, I wanted to make a section on my page for this passion I have for the cosmos, because how could I not, and it's so cool: whenever I look at these photos I say there is nothing beyond them, and every time I see them I remind myself, “look Juan, you're stressed over these worries, and if you build paradise in your mind that's fine, because the universe is indifferent to what happens to you.” I think so often we believe we're special—part of that comes from religion, which I won't get into, the idea that we were created for a specific purpose and a grand plan by an almighty, benevolent God—whereas these photos show you that you are nothing more than the product of a very human act between a man and a woman, and just as you were born as what you call “yourself,” you might not have been born and someone else could have been born instead. It always fascinates me how a child forms their sense of self when it could have been someone else, and the correlation between how complex the universe and human life are versus how simple each one is in its most primitive form, with everything in constant transformation: even in the universe itself the stars die, so how could we not die? I could keep talking about this in circles and coming right back to the same point, because it's one of my greatest passions. And I've always thought that if a way to become immortal is found, the most viable path would be extracting your consciousness into a computer: you would keep your backup across multiple computers, not only on multiple planets but across multiple solar systems, and whenever you want to load in, you load into a super advanced robot like Tron; and if something happens to that robot—because in the physical world if a meteorite hits you the robot gets damaged since it's physical—when that happens you preload your primary consciousness into another robot and that's how you achieve immortality. My point is that at the moment I die—if I die—I would love to be working not just near, but directly on one of these two things: space exploration or immortality, which ultimately come together in space exploration, because being immortal on this planet alone would get really boring—what would you do?—whereas being immortal across the universe, what wouldn't you do?, there's no way to describe it. I think as more of us look out at the universe, more and more people will work on those two problems that I consider fundamental for humanity. And artificial intelligence is also super interesting, because I think ever since humans discovered fire we were already destined to create the being that would replace us, which is obviously artificial intelligence: it's almost poetic, and if you ask me whether we're in a simulation and whether I'd bet money on it, I would bet more money that we're in a simulation than that heaven exists or anything like that, because the more you think about it, the more a simulation makes sense. Anyway, as a fun fact, when I saw these photos for the first time I used to put on headphones with nothing playing and stare at them for hours and hours: out of all the ones I've seen, these were the best, I have no way to pick just one because all of them are breathtaking and, for me, there is nothing more real than these photos.",
  // More of Me's Songs card and its player (SongsPlayer): the Shape
  // sheet's words are Sound Shaper's own (its i18n/translations.ts).
  'likes.songs.name': 'Songs',
  'likes.songs.meta': 'My Ranking',
  'likes.songs.body':
    "Here I share some of my favorite songs: if you notice, they have a style I call cybernetic or futuristic, though in reality I think it's techno or something like that. The fewer lyrics a song has, the more I like it: maybe I don't listen to many songs with vocals, but I do listen to a lot of music, because when a track can express so much without saying a single word I like it way more—I think there's something special about that in the best sense. And here they are: I also think it would be fun if, having made it this far and watched the rest of the videos—some of which are pretty long—you tried to guess which clips I keep of these songs in [Sound Shaper](shaper), in my personal Sound Shaper, to see if you can figure out how my personality works. This is built as a preview—well, not even a preview, it's literally what you can do in Sound Shaper, loaded with my own library: many tracks are from my top list and others are there just to play around with and have fun. So feel free to put on any track and start playing with Sound Shaper's filters, it's really interesting; you can even turn on the DJ Juan feature, where I, Juan, literally get a notification the moment you turn it on, log in and go into DJ mode to mix the songs for you live—no, just kidding, I don't do that, DJ Juan does it automatically, trained by me to my own taste, the way I would make those mixes if I had more skill in the art of music and urban song crafting, no, just kidding, I don't even know what I just said there. Anyway, this section is less serious than the earlier ones because it's meant to be more about me: the idea is that if the rest of the site was already personal, this part would be even more personal so I can gesture freely making moves like this that I might not do on the main landing, you know? And since I built this page myself, I can leave the videos as long as I want: if I want them longer I can do it because this is my page, and doing things like that makes me laugh too. And I told myself: look, I have to put a Sound Shaper preview on my landing page no matter what so anyone who wants to use it can try it right here without needing to log in or anything since the songs are already loaded; and what's the way I can do that?, well, I record a section of my favorite songs.",
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
    'soon.narration.zhAfterEn': 'Ahorita estoy grabando los videos en chino.',
    'soon.close': 'Cerrar',
    'hero.hi': 'Hola',
    'store.soon': 'Próximamente',
    'launch.new': 'Nuevo',
    'launch.shaper': 'Sound Shaper ya está en la web.',
    'launch.get': 'Ábrela',
    'store.web': 'Ábrela en la',
    'hero.caption':
      'Hola, yo soy Juan Villa y me encanta hacer software. Siempre digo que me gusta hacer software como me gusta jugar videojuegos, y eso es yendo por el platino. Además yo creo que es de las cosas más cercanas que hay a la magia en esta simulación, porque básicamente si te imaginas algo y encuentras la manera de hacerlo, puedes crear cosas bastante, bastante cool. Y si después ese software que hiciste lo unes con un hardware, puedes crear cosas incluso más cool. Y bueno, como dato curioso de esta página, la hice con un solo reto, y era que fuese lo más personal posible. No me vi ni una sola referencia y, aparte de que tenía que tener un branding muy mío, dije: mira, me grabo y listo. Entonces la página está como si fuese una película: está en video, está en audio y está subtitulada también. Y me da mucha risa porque es como si fuese un mini Horrocrux mío viviendo aquí. Entonces está diseñada para que sea lo más timeless posible a medida que pasan los meses y pasan los años, y cuando la veo me da risa de cuando la grabé, porque no la voy a estar grabando a cada rato. Y bueno, en esta página les voy a mostrar en qué ando metido, cosas que me gustan y listo. Entonces, bienvenidos.',
    'footer.caption':
      'Bueno, muchas gracias por escucharme, por verme, por oírme y por leerme. Si tienes algún comentario, me lo puedes hacer llegar por los diferentes medios disponibles. Y bueno, yo como tal seguiré construyendo y seguiré yendo a por el platino. Como tal, también hay muchas secciones, entonces si llegaste hasta este punto y viste todo, al menos lo de la página principal, te felicito porque hay unos que fueron largos, largos. Y como dato curioso, estos videos no todos los grabé en una sola sesión porque na’guará, me quedaría sin voz básicamente, porque se hacen muchas takes y la que peor queda es la que escojo —no, mentira, sino la que quede lo más natural posible—. Y por eso hay unas en las que tal vez me veo distinto, o el encuadre se ve distinto, o se escucha lluvia: es por esa misma razón. Pero bueno, súper contento de haber hecho esta página, vamos a ver qué sigo haciendo y gracias por pasearse por aquí.',
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
      'Mira, yo escuchaba mucha música en YouTube Music, pero me salían anuncios a cada rato. Y muchas veces a mí me gustaba escuchar una canción en cuatro versiones —que si lenta, muy lenta, normal, rápida y muy rápida—, bueno, cinco versiones. Y muchas otras veces lo que me gustaba era escuchar tipo los 30 segundos de en medio, los mejores de la canción. Y bueno, la repetía, la repetía y la repetía.',
    'shaper.solution':
      'Y por eso hice Sound Shaper: es un reproductor MP3 personal que es gratis, sin anuncios, de código abierto y tiene muchas funcionalidades interesantes, básicamente como presets de sonido, ecualizador manual por si sabes más de música y quieres personalizarla muy al punto, te permite cambiar el playback speed de la canción y agregarle otros filtros bastante cool. Tiene auto DJ —DJ Juan, soy yo pues el DJ—, además de que funciona tal cual como yo quería. Puedes crear clips de las partes específicas que más te gustan y puedes poner en loop esos clips específicos con el shape que tú quieras, entonces si quieres escuchar todos los clips de esta canción en speed up, pues lo puedes hacer. La canción sigue cuando el teléfono está bloqueado también, y bueno, eso sería.',
    'shaper.s1.p1':
      'Esta es tu librería. La app no descarga la música: tú mismo subes tus MP3 y por acá puedes arrastrarlos para ordenar la biblioteca de la manera en que más te guste.',
    'shaper.s1.p2':
      'Tiene widgets, y desde esta pantalla también puedes cambiar el theme de la aplicación — modo oscuro o modo claro — y el idioma. También tiene trofeos como los de PlayStation: mientras más utilizas la aplicación, más te recompensa y mejores trofeos te da hasta conseguir el preciado platino.',
    'shaper.s2.p1':
      'Esta es la pantalla del reproductor, tal cual como si fuese YouTube Music o Apple Music. Desde acá puedes darle play, pause, siguiente canción o canción anterior.',
    'shaper.s2.p2':
      'Pero lo más importante es la barra de abajo, que son básicamente las razones por las que existe esta aplicación: Shape y Clips.',
    'shaper.s3.p1':
      'De aquí viene el nombre de la aplicación, Sound Shaper: básicamente la aplicación es un moldeador de sonidos. Puedes cambiar, como había comentado antes, el playback speed, los presets, el ecualizador, hay filtros, el playback speed y puedes ponerlo en modo auto DJ.',
    'shaper.s3.p2':
      'Preservar el tono fue de lo más curioso de construir. Básicamente en YouTube o en YouTube Music, si tú colocas una canción o un video en 2x o en 0.75, la voz o va muy rápida o va muy lenta, como si estuviese en cámara rápida o en cámara lenta. Aquí en Sound Shaper tú puedes configurarle para que se mantenga al mismo pace que el ritmo de la canción, en este caso la voz de la persona que está hablando o cantando. Además de que hay filtros como echo y next room, que si empiezas a jugar y los combinas es como si te transportaras a un concierto, o estuvieses en el estacionamiento de un concierto, o como que tu vecino estuviese tirando una fiesta con el sonido a todo volumen y tú estás en tu casa y se escucha con ese efecto, o como si tú estuvieses en una fiesta pero estuvieses en un cuarto —qué sé yo, en el baño lavándote la cara— y se escucha como si fuese un ambiente todo nostálgico, y pues da mucha risa recrear eso no estando en una fiesta ni estando en un concierto. Entonces, bueno, aquí te dejo un ejemplo rápido de cómo se escucha en Sound Shaper el ejemplo de DÁKITI, la canción de Bad Bunny, con el modo auto DJ en esta versión, porque el auto DJ siempre va mejorando.',
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
      'Space Explorer inició como un easter egg para mis aplicaciones, en este caso Sound Shaper: ibas a entrar a una parte específica de la aplicación, darle unos taps ahí secretos en ciertos lugares e iba a entrar como en modo juego, desplegando un nivel o dos niveles de Sound Shaper con una historia narrativa completa que se iba a unir con el resto de aplicaciones que fuese a sacar. Pero eso sobrecomplicaba mucho el producto y era muy difícil que lo encontraran porque estaba súper oculto y literalmente solo lo sabía yo, entonces para simplificarlo y dejar Sound Shaper como Sound Shaper, pues lo removí. Pero justo por obras del destino, en tiempos muy cercanos, aplicamos a una hackathon de [Platanus](platanus) aquí en Venezuela, en Caracas, y uno de los retos que había como minijuego o actividad secundaria era hacer un juego de arcade. Como ya yo tenía la idea trabajada, dije: mira, vamos a hacer Space Explorer, pero como si fuese un juego de arcade. Era un reto bastante interesante porque el juego tenía que pesar máximo 50 kilobytes —o sea, 50 KB— y logré hacer que fuese un shooter 3D espacial donde el mapa está bastante cool y el estilo es muy simple porque, más que hacerlo artístico o de pixel art, prefería hacer algo más técnico que quedara más chulo incluso. De hecho tiene un agujero negro también y funciona bastante, bastante cool, con muchas funcionalidades en cómo se maneja la nave, muy interesante. Lo puedes jugar aquí en esta página o en la [página web oficial de Platanus Hack](arcade), y bueno, espero les guste. Como tal, en la hackathon había muy pocos juegos que eran 3D —obvio había muchos que eran muy chulos—, pero quedó bastante cool. Este sí, como ya quedó, quedó: ya no le voy a meter más porque la idea es que como quedó para la hackathon se queda para siempre, y si hago otro juego pues es otro juego, ya no es Space Explorer.',

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
      '[Crol](crol) es un ERP para PyMEs en México, y en Crol empecé con Conto Pay. Es un producto mucho más simple de Crol, mucho más fácil de usar, en el que lideré el desarrollo del sistema web, la aplicación móvil y la landing page. En este caso, la aplicación móvil después serviría mucho y es la base como tal para Crol ERP Móvil, que también construí y diseñé desde cero.',
    'work.salvalo.body':
      'Soy cofundador de [Salvalo](salvalo), es mi startup, y con ella soy first-time founder —aunque también hay otras historias anteriores, con esta se podría decir que soy first-time founder—, y Salvalo es un marketplace de ofertas de comida. Básicamente, todos los días en Venezuela hay negocios que cierran el día con comida o productos que se pudieron vender, y Salvalo soluciona ese problema. ¿Cómo? Imagínate una panadería que hace 10 cachitos en la mañana y en la tarde le quedan 3 y 2 panes franceses: con esos productos arma un pack y los vende por la aplicación, los clientes los compran a precio de oferta, precio de cierre, y obviamente ganan ambos lados. ¿Por qué? Porque el comercio ese producto no lo pierde y no pierde el precio de ese producto porque como tal el comercio no pierde: no gana tanto como si lo vendiera a full precio, pero no pierde, y consigue un nuevo cliente y una nueva venta porque Salvalo funciona como un canal de ventas externo. Del lado del cliente son los mismos cachitos de la mañana, en la tarde, a precio de oferta y de una manera muy cómoda. Es un proceso bastante sencillo cómo funciona la aplicación y el sistema; lo difícil es agregar comercios y buscar clientes. Pero sí, Salvalo es bastante interesante, me gusta mucho: soy cofundador y me estoy especializando más en el lado de marketing y ventas —más en ventas—, porque como soy el representante de momento en Salvalo aquí en Venezuela, soy el que hace los pitches a los comercios. Y eso me ayuda mucho porque he practicado mucho no solo cómo vender, sino también cómo perder la pena ante un negocio real y qué es lo que le tengo que decir, que creo que siempre se practica, en especial para mí. Yo tal vez tenía un perfil antes no penoso, pero sí introvertido de pensar: mira, ¿para qué le voy a estar abordando a esta persona para esto?, y ahora tengo que hacerlo sí o sí porque si no, no hay comercios en Salvalo. Obviamente al ser perfil técnico también le he dado a la página web, a la landing page, al sistema web, a la aplicación web y a la aplicación móvil también, y la verdad que está bastante fino Salvalo. Como tal he aprendido mucho: yo creo que esa experiencia de una startup real que vaya seria o que quiera ser seria tiene que pasar lo antes posible en tu vida, porque aprendes muchas cosas y te pone en un mood y en un entorno que te empuja a mejorar no solo como startup founder, sino como persona en general. De hecho, la mayoría de los eventos a los que fui este año fue como Salvalo —pueden verlo en la sección de eventos, no sé si está arriba o abajo porque me la mantengo cambiándola, no, mentira, no la cambio a cada rato, pero bueno, arriba o abajo en la sección de eventos—: en El Panal y en el Startup Venezuela Summit ahí yo fui como Salvalo y estuvo muy, muy fino. Hacer algo para Venezuela también es interesante siempre, que es el país en el que nací y en el que vivo actualmente. Pero bueno, sería eso: eso es Salvalo y, bueno, salven sus packs.',
    'work.maktub.body':
      '[Maktub Art Fund](maktub) es un cliente de México y, bueno, es una landing page nada más, que normalmente no me llama mucho la atención —o sea, solo hacer la landing page—, pero esta tenía un diseño bastante interesante que no había hecho así en específico, y quedó bastante moderno, bastante fashion, y me gustó mucho el resultado final.',

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
      'Esta tiene más historia. [Pastor](pastor), que estudió conmigo en primaria y secundaria, un día de repente me escribe y me presenta a [Ale](ale) —Alejandro— y a [Cesar](cesar) para aplicar a una hackathon organizada por [Yummy](yummy), por [Cashea](cashea), por [Slash](slash) y por AlegrIA Labs que iba a ser en las oficinas de Yummy en Caracas. Seguramente el Juan de antes, de ese momento, habría dicho que no por pena, por miedo o por flojera, pero en ese momento dije: bueno, como mínimo vamos a aprender mucho, mucho, mucho, y vamos a darle. Entonces tuvimos muchas reuniones, decidimos que la idea iba a ser [Tripealo](tripealo), un marketplace de experiencias de viaje para Venezuela, aplicamos, hicimos un video de aplicación y todo, y de entre más de mil personas quedamos entre los 100 seleccionados para ir a las oficinas de Yummy en Caracas a la hackathon. Fueron 36 horas también de creación del producto: como tal no ganamos, no quedamos ni siquiera en el top 10, pero me enseñó mucho de cómo funciona el mundo de las startups. Me enseñó mucho de mí mismo y la verdad que el equipo genial, el team 1%: ellos como tal continuaron con Tripealo y yo me salí para empezar [Salvalo](salvalo), pero siempre andamos juntos en esto del emprendimiento o de las startups —me gusta más la palabra startup que emprendimiento—. Y bueno, es una experiencia que siempre recuerdo: nuestro equipo era Tech Bros, y de todos los eventos a los que voy lo que más guardo son estos identificadores, estos IDs, porque ya los voy coleccionando como si fuesen gemas del infinito y me da mucha risa, porque siempre que los veo me teletransporto a ese momento, a todo lo que aprendimos el equipo y yo y a todas las personas que conocimos. Hubo charlas súper interesantes tanto en videollamadas con todos esos founders como otros muchos en persona: la verdad que una experiencia 10 de 10 y de paso de las primeras hackathons de ese calibre que se hacen en Venezuela —era la segunda organizada por Yummy, pero la primera tal vez a esa escala—. Súper agradecido con esta experiencia: fue el turning point entre el Juan que solo trabaja de programación versus el Juan que quiere hacer productos que use la gente y que tal vez cambien el mundo mediante software o hardware; un turning point que seguramente siempre hubiese llegado, pero esto lo adelantó mucho, porque fue un cambio de chip el antes y el después de ese octubre en Caracas.',
    'events.alegria.m':
      'Tres días en el primer hackathon de vibe coding de Venezuela, en Caracas. Sin premio, pero con amigos nuevos y lecciones de los fundadores de [Yummy](yummy), [Cashea](cashea) y [Slash](slash). Fue el empujón que necesitábamos para arrancar con [Tripealo](tripealo) y con [Salvalo](salvalo).',
    'events.talk': 'Charla',
    'events.ilc.when': 'sept 2026',
    'events.ilc.body':
      'En la hackathon de AlegrIA Labs habló también [Pedro Vallenilla](pedro) por videollamada, y después de un año, de nuevo por estas fechas del tercer o cuarto trimestre del año, viene Pedro Vallenilla a Barquisimeto, mi ciudad en el estado Lara, en Venezuela, a dar una charla de liderar con el [Padre Elías](elias), muy famoso también aquí en Barquisimeto. Entonces fuimos de nuevo con el team, quedamos literalmente en la segunda fila del [teatro](juares), ahí mismito, súper cerca, y estuvo genial ver a la persona que hizo [Cashea](cashea) contar su historia. Para prepararme me fui viendo todas las entrevistas que él había hecho, por lo menos las más famosas, y en ese evento contó unas historias bastante específicas que no había escuchado antes. Me quedó mucho que para él Venezuela es como un greenfield —o bueno, lo que a mí me quedó de lo que él habló—: puedes hacer muchas cosas porque, al pasar por todo lo que ha pasado, hay mucho espacio para crear muchos productos tecnológicos que en otros países incluso de Latinoamérica ya existen y son muy básicos. Entonces fíjate en Cashea: ¿quién se iba a imaginar que algo como Cashea iba a pegar aquí?, crédito sin ser un banco, pero de una manera muy específica porque ellos no dan crédito como si fuese un banco. Es como una idea súper loca que tú dices: na’guará, ¿eso va a funcionar en Venezuela?, y de paso en ese momento en el que salió Cashea ellos vivieron el boom del COVID y todo eso, tal cual contra todos los odds. Creo haber visto de verdad en el Sambil de Barquisimeto una vez a alguien del equipo de ventas haciendo publicidad de Cashea, y cuando me acuerdo digo: epa, mira lo de Cashea, literal tenían que ir de negocio en negocio, y eso él lo cuenta mucho en esa charla, que iban de negocio en negocio y les decían: no, pero tú estás loco, ¿cómo vas a hacer eso?, salte, salte. Y ese ímpetu de continuar y echar pa’lante —un emprendimiento funciona, pero los otros no funcionaron, y no funcionaron, y no funcionaron— hasta después dar con Cashea, que ahorita en 2026 está moviendo porcentajes del PIB completo de Venezuela, es una escala muy loca, entonces fue súper, súper cool verlo ahorita en persona.',
    'events.ilc.m':
      '[Pedro Vallenilla](pedro) de [Cashea](cashea), esta vez en persona y en mi ciudad: una startup que funcionó, varias que no, luego Cashea, y por qué Venezuela es el lugar para construir.',
    'events.interview': 'Entrevista',
    'events.radio.when': 'oct 2026',
    'events.radio.body':
      'Esta fue la primera entrevista de [Salvalo](salvalo) en la radio, en [OK 101.5 FM](ok101), en el programa de [Cheo Noguera](cheo) acá en Barquisimeto. Como tal fue mi primera vez en la radio —ya yo había ido a la televisión mucho más pequeño, pero bueno, esa es otra historia— y estuvo también mi cofundador Abrahan vía online porque él está en España. La verdad que fue una experiencia súper interesante, aprendí mucho: pensé que iba a estar nervioso, pero no, más bien tenía ganas de hablar y seguir contando de Salvalo. Contamos qué es Salvalo, nuestra historia y cómo la empezamos; habían oyentes en la radio que nos preguntaban, les respondíamos ahí mismito, uno que otro se instaló la aplicación y nos decían: epa, mira chamo, qué fino, échenle pichón y cosas así. Y yo di el ejemplo que siempre doy con Salvalo: imagina que eres una panadería, en la mañana tienes 10 cachitos y en la tarde —supongamos a las 6 de la tarde— te quedan 3, entonces con esos 3 cachitos y 2 panes franceses armas un pack que vendes a precio de cierre, a precio de oferta por la aplicación. Como Salvalo funciona como un canal extra de ventas, vas a vender ese pack, no vas a perder el producto, vas a conseguir esa venta y posiblemente un nuevo cliente que no te conocía o que tal vez no era muy fiel a tu comercio en el mundo físico, pero a través de Salvalo te conoció y dijo: ah, mira, publica ofertas finas estos días, vamos a comprarle packs. Y del lado del cliente son los mismos cachitos y el mismo pan francés que hicieron en la mañana, en la tarde a precio de oferta, entonces no hay pierde por ahí. También me gusta guardar y recordar este tipo de eventos y situaciones a las que voy representando a Salvalo, porque lo veo como que ahorita fui a la radio con Salvalo —eso está muy bien y me gustó—, pero me sirve como entrenamiento de startup founder para los siguientes proyectos a los que voy a ir: cómo abordar cierto tipo de situaciones y cómo comunicarme con personas no desde mi perfil de Juan, sino explicándole una startup a cualquier tipo de perfil, porque no es lo mismo explicarle Salvalo a un dueño de panadería de 20 años de experiencia. Entonces siempre lo veo como un entrenamiento: fue el primer entrenamiento de radio para mí y la verdad que estuvo bastante cool, espero se repita pronto y pueda practicar mis habilidades locutoras.',
    'events.radio.m':
      'La primera entrevista de [Salvalo](salvalo), en vivo en [OK 101.5 FM](ok101) de Barquisimeto: el locutor descargó la app al aire mientras se la explicaba a sus oyentes.',
    'events.meetup': 'Encuentro',
    'events.panal.when': 'oct 2026',
    'events.panal.body':
      '[El Panal](panal) es un movimiento que creó [Manuel Sira](manuel) acá en Barquisimeto para juntar a todo tipo de perfiles que tengan que ver con tecnología en el estado Lara y que no sea todo siempre en Caracas. Fui con mis amigos de [Tripealo](tripealo), y el evento estuvo chulo porque había que dar un pitch de lo que fuese tu proyecto en 30 segundos, y yo di el primer pitch oficial de [Salvalo](salvalo). Di tal cual de nuevo el ejemplo que siempre doy, el de la panadería —te quedan 3 cachitos en la tarde y los vendes como pack en Salvalo—, y ahí sí estaba nervioso porque la historia es que habían tal vez 140 personas en el restaurante Galión, en el Hotel Jirajara, y no todas pasaron a pitchear. Hubo nada más como 3 o 4 rondas en las que pitcheaban tal vez 7 o 5 personas cada ronda, y yo a la primera no logré pasar y a la segunda sí, de segundo. Estaba nervioso porque me construía el nervio mental de que eran 30 segundos y te cortaban: tal cual cuando empezabas te decían “ya”, tenías atrás en una pantalla un contador de 30 segundos y, cuando llegaba a cero, sonaba y te paraban donde hubieses quedado. Todas las personas que dieron el pitch lograron hablar completo lo que querían decir y yo también logré decir lo que quería decir: sí estaba nervioso y me noté nervioso, pero lo tomé como una muy buena práctica. Además el evento y el movimiento están bastante finos porque se juntan un montón de personas que no simplemente hacen puras aplicaciones: había gente haciendo aplicaciones de psicología, unos que tienen una aplicación de baños llamada [Resty](resty) —una idea bien loca—, pero también había personas haciendo marketing, moda y sistemas típicos de tecnología como CRM, y hubo charlas bastante interesantes de cómo crecer tu negocio midiendo los datos y teniendo estadísticas internas. Y hubo otra charla sobre algo que ya yo venía teniendo muy en mente: que en la época de la inteligencia artificial tal vez lo que te diferencia no es tanto lo técnico —porque la inteligencia artificial hace absolutamente todo si se lo dices, y mientras más pasa el tiempo más capaz es—, pero al ser una máquina o un robot no tiene ese gusto humano, que es el lado artístico de hacer las cosas, y eso es lo que está importando cada vez más en estos tiempos de inteligencia artificial. Ese gusto que le das tú como humano por encima del trabajo de la máquina creo que siempre ha existido desde que existe la interacción humano-máquina para crear cualquier cosa: por ejemplo, no es lo mismo un sillón hecho a mano por un carpintero maestro o un artesano que un sillón de fábrica, obviamente, y eso se transpila al mundo de la inteligencia artificial y de la tecnología ahorita en pleno 2026 y cada vez será más evidente. Entonces fue un evento bastante cool: El Panal se llama así porque cada persona es un panal y se interconecta con otras. De hecho conseguí uno que otro lead para Salvalo y das a conocer tu idea también: practicas mucho para los first-time founders —que en este caso al momento de ir yo era first-time founder con Salvalo— esa pena que te da y que yo tengo que seguir practicando de decir “mira, yo hago esto, esto es Salvalo, ¿qué haces tú?”, perderle el miedo a vender tu idea y hablar con personas sobre algo que tú hiciste. Estuvo excelente, la verdad que estuvo muy fino, y de nuevo este es el segundo lanyard que guardo en mi colección: vamos a ver hasta cuántos llego al final.',
    'events.panal.m':
      'Una noche de [El Panal](panal) en Barquisimeto: charlas de IA, datos y gusto, y 30 segundos para el pitch de [Salvalo](salvalo). Nervioso, pero lo di, y me fui con amigos nuevos y uno que otro lead.',
    'events.summit': 'Summit',
    'events.summit.when': 'oct 2026',
    'events.summit.body':
      'Estuve en el [Startup Venezuela Summit](summit), y la verdad es que nunca había ido a un evento así: estuvo demasiado, demasiado fino. Estuvimos en muchas charlas: vimos de nuevo a [Pedro Vallenilla](pedro) de [Cashea](cashea) en una charla, a [Víctor Cárdenas](slash) de Slash en otra charla, y hubo muchas charlas con perfiles que nunca me imaginé escuchar y muchos que ni conocía que existían o que hacían exactamente este tipo de producto. La verdad que estuvo genial: conocí a uno de los cofundadores de [Rial](rial) y a mucho tipo de personas del extranjero haciendo proyectos o queriendo invertir acá, con historias chulas de empresas americanas que tienen uno o dos founders venezolanos, tienen un venture capital y fueron early investors en Anthropic; yo pensé que iba a ver perfiles más regionales, pero no, fue uno de los eventos más globalizados a los que he ido a nivel tecnológico y de emprendimiento. Además de que estuvimos en un workshop privado, ese evento era muy chulo porque había charlas a cada rato en diferentes escenarios y auditorios del Caracas Campus, pero actualizaban en tiempo real el cronograma y de repente había una charla secreta —bueno, no era secreta porque aparecía en la aplicación—, pero en el Caracas Campus en la parte comercial, o sea no en la parte pública del Startup Venezuela Summit, sino ya para las oficinas de empresas que tienen sus sedes ahí. Y estuvo una muy interesante que era un investor pitch —o sea, un pitch inverso—: en vez de founders haciendo sus pitches para venture capital, eran los de venture capital haciendo sus pitches para los founders diciendo “mira, vente con nosotros, nosotros hacemos esto”, con historias de “nosotros no invertimos en startups que no tengan proyectado hacer como mínimo un billón de dólares al año en esto”, entonces tú dices: ah, mira, esto es en serio, esto no es un juego. Estuvimos en un workshop privado también de [Fina](fina) con la gente de [Innoven](innoven), que es la aceleradora de [Square One Capital](squareone), y pegué también el sticker —bueno, no el sticker, la foto que me tomaron con [Salvalo](salvalo)—: postulé a Innoven con Salvalo estando ahí y me llevé la fotico y una gorra también de Innoven, y estuvo demasiado cool. Yo creo que uno de los aprendizajes más importantes que me llevé es que si quieres hacer una startup y sientes que estás dispuesto a hacer muchas cosas para lograrla, hazla, porque no importa tu edad, de dónde vengas ni tu perfil: si le metes ganas y corazón lo puedes lograr, y mientras más lejos apuntes, mejor. O sea, tal vez me jugó a la inversa, porque ahora digo: mira, estoy haciendo algo para Venezuela y tal vez no debería estar invirtiendo el tiempo en algo así, sino estar full, full con algo que sea las grandes ligas a nivel global, pero bueno, vamos a ver qué se puede hacer. Me recordó de nuevo que estar en ese ambiente te envuelve y me resonaba mucho la frase de Steve Jobs de que los suficientemente locos como para cambiar el mundo son los que realmente lo hacen. Y de nuevo, este lanyard es de los mejorcitos hasta ahora: dice el nombre de Juan Villa y atrás el título del C-level que tengo en Salvalo —nos dieron esta pegatina y se la pegué aquí de una vez—, entonces ya voy aumentando mi colección no solo física de lanyards, sino mental de experiencias de startups y conocimiento que pongo en práctica; de nuevo fui con mis amigos de [Tripealo](tripealo) y estuvo genial.',
    'events.summit.m':
      'Dos días en el Startup Venezuela Summit con [Tripealo](tripealo): charlas de [Slash](slash) y [Cashea](cashea), un workshop privado con Fina e Innoven al que nos invitaron por nuestras chaquetas de founders, y [Salvalo](salvalo) en la pared de founders venezolanos.',
    'events.platanus.when': 'oct 2026',
    'events.platanus.body':
      'Justo saliendo del Startup Venezuela Summit fuimos directo al [Platanus Hack 26 Caracas](platanus), de nuevo en Caracas, y fue gracioso porque nosotros planeamos ir al Startup Venezuela Summit y justo después, el mismo día que terminaba, había una hackathon organizada por Platanus Ventures —que tiene una sucursal, por así decirlo, en la que hacen hackathons en Latinoamérica y esta era la primera vez que hacían un tour por Latam— y adivinen en dónde fueron de nuevo los headquarters de la hackathon: de nuevo en las oficinas de [Yummy](yummy). Entonces dio aún más risa porque literalmente un año después de la hackathon de AlegrIA fuimos de nuevo a la hackathon de Platanus, pero en las oficinas de Yummy, y fueron más personas que repitieron en las dos hackathons. La verdad que estuvo 10 de 10, esa hackathon estuvo genial: dormimos poco, fueron 36 horas, pero el equipo de Platanus, los de Yummy y todos los patrocinadores organizaron eso demasiado bien, había comida y comida y yo me levantaba a cada rato a tomar agua para no dormirme. Todo lo que aprendimos no solo yo sino el resto de mi equipo si habían ido a hackathons pasadas lo aplicamos en esta, y literalmente era construir y construir y construir. El proyecto y el track que nos tocó o que queríamos tenía que ver con Physical AI, porque íbamos a construir algo bajo la premisa de que Physical AI is the new sexy, y escogimos el track de 3D —o sea, 3D tal cual— e hicimos [Tridi](tridi), que básicamente te permite tomar video de personas, sea con tu cámara o un video ya precargado, y lo transforma a data de entrenamiento para robots humanoides. Supongamos que tú tienes una empresa de robótica y haces robots, pero esos robots no tienen manera de saber cómo comportarse en este mundo físico y en este mundo real: aun cuando tengas un LLM y cuando Anthropic cree en el futuro sus propios modelos de robots —tal vez crean Claude 8.0 for Robots—, hay tantas cosas que en el mundo físico un humano puede hacer que un robot necesita demasiada data. Los LLMs fueron entrenados con la data de todo el internet, de todo el conocimiento humano y de todos los libros, pero los robots no tienen este tipo de entrenamiento físico, porque cuántas acciones puede hacer un humano en un entorno tan básico como una cocina —no solo cocinar, sino lavar los corotos, guardar los corotos y tantas cosas— y en el entorno físico hay muchos factores externos con los que tiene que interactuar un robot humanoide. En eso ayuda Tridi: nosotros tomamos un video, suponte de alguien caminando, y le enseñamos al robot cómo caminar, pero no solo a caminar, sino a tener en cuenta todos esos factores externos que comenté en una simulación que también es creada por nosotros. Así, cuando creas el robot físico y preguntas cómo lo entrenas, con Tridi le subimos un video, con la idea de que va a escalar con múltiples videos en múltiples ángulos y muchos tipos de situaciones distintas, y va a haber una rama de conocimientos básica que se va a repartir entre todos los robots humanoides en la que vas a poder enseñar a un robot a caminar incluso antes de que llegue al mundo real, y lo que le cargas al programa del robot es esa política —suponte `walk_v1`, de caminar por así decirlo—, y así funciona Tridi. La verdad que fue un proyecto tal vez muy ambicioso para esa hackathon —lo digo porque no ganamos—, pero la verdad que el nivel técnico estuvo bastante fino: mi equipo y yo estudiamos las hackathons que hicieron en este tour por Latam en Buenos Aires, en Ciudad de México y en Bogotá, y dijimos “¿será que en Caracas habrá proyectos a ese nivel?”, y sí, hubo bastantes proyectos muy cool, mucha gente muy dura y muy técnica, y la verdad que fue una experiencia increíble. Estoy muy orgulloso de Tridi y del resto del equipo también: creo que construimos algo bastante cool que está tratando de resolver un problema muy reciente que va a pasar en los próximos diez años, porque literalmente Physical AI is the new sexy y la robótica con la inteligencia artificial va a ser el dominio total del resto que queda del siglo XXI. Es un shift súper interesante al software común o a cómo nosotros vemos e interactuamos ahorita con este mundo de que casi no hay robots: en el pasado en las películas decían “¿será que en el futuro va a haber robots?”, y yo creo que sí va a haber muchos robots, solo hay que darle chance —fíjate cómo avanzó la inteligencia artificial tan rápido en tan poco tiempo, y así creo que va a avanzar la robótica— y nosotros queremos ser una de las cutting-edge technologies para ayudar a impulsar que esa transición pase lo más rápido posible. Y en Tridi no solo puedes entrenar robots humanoides: si van a la página de Tridi, se puede entrenar cualquier tipo de robot que tenga algún comportamiento en el mundo físico, no tiene que ser humanoide, puede ser un robot explorador como el que está explorando Marte de la NASA. De esta hackathon quedé súper agradecido de nuevo con el equipo de Platanus y de Yummy; nuestro mentor fue [Sebastián Alcalá](sebastian), product engineer en Yummy y cofundador de [Wink](wink): fueron unas experiencias demasiado finas, nos reímos mucho y aprendimos mucho también, entonces ya llevamos dos de dos y vamos a ver si el siguiente año hacen de nuevo una hackathon y esta sí la ganamos, porque la tercera es la vencida. Y aquí también nos dieron un lanyard que hicieron más interesante: lo tengo por acá y es para que lo puedas cargar en tu cartera; si se fijan, ahí tiene toda la información mía porque funciona con NFC y te permiten customizar la URL de la página web a la que lleva este NFC, y yo obviamente lo redirigí a esta página web en la que están ustedes ahorita: juanevillam.com, J-U-A-N-E-V de Venezuela y L-L-A-M.com. Entonces lo cargo en la cartera porque es literalmente del tamaño de una tarjeta, y si necesito a alguien mostrarle mi página web le muestro esto y, si el teléfono tiene NFC —que la mayoría ahorita tiene—, les abre mi página web. Este es un lanyard que no es para cargarlo colgado —bueno, si lo quieres lo cargas—, sino para que lo tengas en tu cartera, y funciona demasiado bien porque puedes poner cualquier URL que tú quieras, es muy conveniente, es muy útil y a mí me encanta. Todos los lanyards son más grandes y más bonitos, pero este es muy mi estilo —a esto me refiero con cosas de mi estilo; hubiese quedado mejor si hubiese sido negro y con los detalles en blanco, pero bueno, no pasa nada—. La verdad que estuvo muy fino este evento y fue una semana muy cargada en Caracas: es como que en octubre siempre hacemos el año en tecnología en el hecho de que es el mes más importante siempre —me refiero a este año 2026 y al año pasado 2025—, vamos a ver si sigue siendo así el resto de los años y no solo en octubre sino en más meses y más seguido; y bueno, esta es claramente mucho más larga porque tiene bastante más historia.',
    'events.platanus.m':
      'Del Summit directo a Platanus Hack 26 Caracas, de vuelta en las oficinas de [Yummy](yummy) con el equipo de AlegrIA: construimos [Tridi](tridi), video convertido en data de movimiento para robots. Sin premio, pero una hackathon mucho más fuerte, y gente jugando Space Explorer al lado.',
    'likes.title': 'Más de mí',
    'likes.cosmos.name': 'Cosmos',
    'likes.cosmos.body':
      'El espacio siempre me ha fascinado: al ver lo vasto e infinito que es y tratar de comprender eso, es como una escala que no tiene palabra, no tiene palabra literal, y te pone en contraste. Por ejemplo, todo lo que ha pasado y al menos está pasando ahorita mismo ha pasado en el planeta Tierra —en partes específicas del planeta Tierra, porque de paso ni siquiera se ha explorado todo el mar—, ha pasado en este planeta y este planeta es uno de los múltiples planetas del sistema solar. El sistema solar es uno de los múltiples sistemas de la Vía Láctea, de la Milky Way; la Vía Láctea es una de las muchas galaxias en el cúmulo de galaxias en el que estamos, que a su vez forma parte de un supercúmulo y a su vez también de otro megaclúster y cosas así, que tú dices: no, na’guará, pero es que no hay fin. El Sol es una estrella, pero como tal hay estrellas aún más grandes, y la idea de un agujero negro es demencial: las supernovas, cuando tal vez choca un agujero negro con otro, o cuando una galaxia se come a otra o lo hacen entre tres, es una locura y una escala que te muestra que el universo es como si fuese indiferente al ser humano. Allá están pasando todas esas cosas mientras todo lo que son nuestros problemas —que si uno está triste, que si está feliz, que está enfermo, que está con salud, que le pasó algo o que no le pasó— y todas nuestras preocupaciones por el pasado, en el presente y por el futuro pasan en este punto ínfimo que es nada en comparación al universo. Es como que te pone en tu lugar de decir: no eres más que una simple hormiga en un mundo —poniéndolo como el universo— que es gigante e incomprensible, y yo ese sentimiento, en vez de rechazarlo o disgustarme por él, lo empecé a amar cada vez aún más y me encanta. Yo creo que no hay nada más real que el universo y que estas fotos del [James Webb](webb) y del [Hubble](hubble) que están viendo ustedes ahí ahorita: no hay nada más real, eso es lo único que importa, no hay nada más que importe de verdad. Y estas fotos como tal, yo me la mantengo siempre haciendo tops, pero con estas no tengo manera de hacer tops ni de rankearlas todas: es increíble, hay unas que están a escala de estrellas y otras de galaxias, y llega un punto en el que no tengo manera de expresarlo porque no hay manera; y todas las locuras de que si estamos en una simulación y todo eso me encantan. Yo creo que como tal la humanidad no tiene más que dos problemas nada más y se resumen en uno: la exploración espacial —de hecho de ahí viene el nombre exacto de mi primer juego que hice para la Platanus Hack, Space Explorer—, porque siempre lo he dicho: a mí me habría gustado haber nacido mucho más en el futuro, como en un futuro literalmente de Star Wars en el que no hagas tu vida en un solo planeta ni en una sola galaxia, sino que fuesen múltiples galaxias y toda esa locura, algo que creo que sí va a pasar aunque ahorita en el 2026 estamos muy pronto, inclusive tal vez en el año 10.000 o en el 100.000, quién sabe, pero siempre lo he dicho. Y para lograr la verdadera exploración espacial, la estrella más cercana aparte del Sol está a cuatro años luz de ida y cuatro años luz de vuelta si piensas volver, y ocho años luz para escala humana es estar frito. Entonces obviamente para lograr ese tipo de exploración espacial a esa escala tienes que ser inmortal: para mí los únicos dos problemas en los que deberíamos estar centrándonos todos los humanos —niños de cualquier país, hablen el idioma que hablen, viejitos, todo el mundo, que obvio es muy difícil pero si uno se pusiera a pensar serían esos dos— son la exploración espacial y la búsqueda de la inmortalidad. A nivel más realista, como lo pienso yo, todo está linkeado: sin la inmortalidad, ¿cómo vas a hacer un viaje que es tan largo y tan peligroso en este cuerpo tan mortal y tan débil?, porque somos una mente compleja pero en un cuerpo que con nada se daña. Imagínate también el hecho de poder ver no solo la colonización de Marte ni de la Luna, sino de galaxias y galaxias, que la vida no sea multiplanetaria sino a escala como mínimo de la galaxia y después de múltiples galaxias y sectores del universo observable: estará súper loco y demasiado chulo. Yo creo que ese es un futuro al que puedes aspirar a vivir y no hay futuro más interesante que eso: una cosa es ir a la playa aquí en el planeta —que este planeta es muy bonito—, pero tú sabes la escala de ir a otra galaxia: cuando tú lo piensas y dices “verdale, ir a otra galaxia estaría demasiado loco”, o estar lo más cerca que puedas de un agujero negro o de una estrella y ver todo tipo de planetas súper locos tal cual como Star Wars, y encima siendo inmortal, imagínate cuántas cosas verías en cuánto tiempo. Entonces sí, básicamente quería hacer una sección de esta pasión que tengo por el cosmos en mi página, porque obviamente cómo no, y está demasiado cool: siempre que veo estas fotos digo que después de estas fotos no hay nada más, y siempre que las veo me recuerda a mí mismo “mira Juan, estás aquí con estas preocupaciones estresado sobre esto, y si tú te haces el paraíso en tu mente está bien, porque el universo es indiferente a lo que te pase a ti”. Creo que muchas veces creemos que somos especiales —hay cosas que también vienen por el tema de la religión, en lo que no me voy a meter, de que fuimos creados para un propósito específico, que tenemos un plan y un Dios todopoderoso y benevolente—, pero estas fotos te demuestran que no eres más que el producto de un acto muy humano entre un hombre y una mujer, y que así como naciste tú y lo que llamas “yo”, pudiste no haber nacido y pudo haber nacido otra persona. Siempre me llama la atención ese concepto de que al final un niño forma su yo y pudo haber sido otro, y la correlación que tiene lo complejo que es el universo y lo complejo que es la vida humana con lo simple que es cada uno en su forma más primitiva, y cómo todo está en transformación: hasta en el propio universo las mismas estrellas se mueren, ¿no se va a morir uno? De esto podría seguir hablando y dando vueltas y volvería al mismo punto, porque es de mis más grandes pasiones. Y siempre he pensado que si se encuentra la forma de volverte inmortal, la más viable sería encontrar la manera de extraer tu conciencia a una computadora: tendrías tu backup ahí en múltiples computadoras, no solo en múltiples planetas sino en múltiples sistemas solares, y cuando te quieras cargar te cargas en un robot súper avanzado como si fueses un Tron; y si a ese robot le pasa algo —porque el mundo físico tiene el problema de que si te atraviesa un meteorito el robot se daña porque es físico—, cuando pasa eso puedas precargar tu conciencia primaria en otro robot y ya, así alcanzarías la inmortalidad. A lo que iba es que al momento de morirme —si es que me muero— me gustaría estar trabajando en algo que vaya no cerca, sino directamente a una de estas dos cosas: la exploración espacial o la inmortalidad, que en el fondo se unen en la exploración espacial, porque ser inmortal en este planeta sería muy aburrido —¿qué harías?—, pero ser inmortal en el universo, ¿qué no harías?, no hay manera de describirlo. Creo que si muchas personas nos ponemos a ver el universo, cada vez más personas estaremos trabajando en esos dos problemas que creo que son los primordiales para la humanidad. Y también la inteligencia artificial es súper interesante, porque creo que desde que el humano descubrió el fuego estaba destinado ya a crear al ser que lo iba a reemplazar, que en este caso obviamente es la inteligencia artificial: es como poético, a nivel de poético que yo digo que muy posiblemente —bueno, no muy posiblemente—, pero si a mí me preguntan si estamos en una simulación y si apostaría plata, yo le apostaría más plata a que estamos en una simulación que a que el cielo existe o cosas así, porque mientras más lo piensas más cuadra que estamos en una simulación. Pero bueno, anyways, como dato curioso, cuando vi estas fotos por primera vez lo que hacía era ponerme unos audífonos, no escuchaba nada y las veía horas y horas y horas: de todas las que he visto fueron las mejores, no tengo manera de cómo escoger una porque todas son breathtaking y, para mí, no hay nada más real que estas fotos.',
    'likes.songs.name': 'Canciones',
    'likes.songs.meta': 'Mi ranking',
    'likes.songs.body':
      'Aquí les comparto algunas de mis canciones favoritas: si se fijan, tienen como un estilo que yo llamo cibernético o futurista, pero en realidad creo que es techno o algo así. Mientras menos letra tenga la canción, más me gusta: tal vez yo no escucho muchas canciones, pero sí mucha música, porque si una canción puede expresar mucho sin decir una sola palabra me gusta mucho más, creo que hay algo distinto en ello en el buen sentido. Y bueno, aquí están: además creo que sería interesante que, si llegaron a este punto y vieron el resto de videos —hay unos bastante largos—, trataran de adivinar cuáles son los clips que yo tengo en [Sound Shaper](shaper), en mi Sound Shaper personal, de estas canciones, a ver si le logran atinar a cómo funciona mi personalidad y cosas así. Esto está construido como si fuese un preview —bueno, no es un preview, es tal cual lo que puedes hacer tú en Sound Shaper, pero con mi librería—: hay muchas canciones que son de mi top y otras que están ahí para jugar y hacer el chiste también. Entonces siéntanse libres de poner cualquier canción y empezar a jugar con los filtros de Sound Shaper, está bastante interesante; pueden poner incluso la funcionalidad de DJ Juan, en la que yo, Juan, literalmente cuando me llega una notificación de que ustedes lo colocaron me conecto y me pongo en modo DJ a mezclarles las canciones —no, mentira, no hago eso, eso lo hace automáticamente DJ Juan, entrenado por mí a mi gusto, como yo haría ese tipo de mezclas si tuviese más habilidad en el arte de la música y el desarrollo urbano de canciones, no, mentira, no sé ni qué dije ahí—. Pero bueno, esta sección es menos seria que las anteriores porque se supone que es más de mí: la idea es que, si lo otro ya era personal, este fuese aún más personal y pueda gesticular haciendo este tipo de movimiento que tal vez no pueda hacer en la landing, ¿me entienden? Y como yo hice esta página, puedo dejar los videos exactamente como yo quiera de largos: si los quiero más largos pues puedo hacerlo porque esta es mi página, entonces me da risa también hacer cosas así. Y dije: mira, tengo que meterle a mi landing una preview de Sound Shaper sí o sí para que quien quiera usarla la pueda usar desde aquí y no necesitas ni iniciar sesión ni nada porque ya las canciones están cargadas; ¿cuál es la manera en la que lo puedo hacer?, pues grabo una sección de mis canciones favoritas.',
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
      '嗨，我是 Juan Villa，我热爱做软件。我常说我喜欢像打电子游戏那样做软件，也就是冲着白金奖杯去。而且我觉得它是这个模拟世界里最接近魔法的东西，因为只要你能想象出来并找到实现的方法，就能创造出非常酷的事物。要是之后再把做出来的软件和硬件结合起来，还能创造出更酷的东西。关于这个网页有个有趣的小细节，我做它时只给自己定了一个挑战，就是尽可能做出最真实的个人风格。我一眼参考模板都没看，除了赋予它完全属于我的品牌风格之外，我对自己说：干脆把自己录下来吧。所以整个页面就像一部电影：有视频、有音频，还配了字幕。每次想到这都觉得很好笑，因为它就像我留在这里生活的一个小小魂器。它的设计尽可能经得起岁月考验，随着岁月流逝，每次看到它我都会想起录制时的有趣场景，毕竟我不会隔三差五重新录一遍。在这个页面里，我会向大家展示我正在忙什么、我喜欢的事物，仅此而已。欢迎你。',
    'footer.caption':
      '非常感谢你倾听我、看我的视频、听我的声音、读我的文字。如果你有任何想法或建议，可以通过页面上的各种方式发给我。至于我，我会继续创造，继续向着白金奖杯前进。页面上有很多板块，所以如果你一路看到这里、把至少主页上的内容都看完了，我要恭喜你，因为有些视频真的非常长。说个有趣的小细节，这些视频并不是在一次录制里全部录完的，不然我的嗓子早就哑了，因为每段都会录很多遍，然后我挑最差的一条——开玩笑的，其实是挑最自然的一条。也正因为这个原因，有些视频里我的样子或取景框看起来不太一样，或者能听到雨声。总之，我真的非常开心做出了这个网页，看看接下来我还会做些什么吧，谢谢你来这里逛逛。',
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
      '我以前经常在 YouTube Music 听歌，但广告总是接连不断地弹出来。很多时候我喜欢把一首歌听四个版本——慢速、超慢、原速、快速和超快——好吧，是五个版本。还有很多时候，我真正想听的只是歌曲中间最精彩的那 30 秒。然后我就一遍、一遍又一遍地循环听。',
    'shaper.solution':
      '所以我做了 Sound Shaper：它是一个免费、无广告且开源的个人 MP3 播放器，有很多有趣的功能，比如声音预设、适合懂音乐的你精细调节的手动均衡器、调节歌曲播放速度，还能加上其他很酷的滤镜。它还有自动 DJ——DJ Juan，也就是我本人当 DJ——而且完全按照我想要的方式运行。你可以把自己最喜欢的特定部分做成片段，并用任意塑形效果循环播放这些片段，所以如果你想把这首歌的所有片段加速连播，完全可以做到。手机锁屏时歌曲也会继续播放，大概就是这样。',
    'shaper.s1.p1':
      '这是你的资料库。这个应用本身不下载音乐：你自己上传自己的 MP3，在这里按住拖动就能按你最喜欢的方式整理曲库。',
    'shaper.s1.p2':
      '它支持小组件，在这个界面你还可以切换应用的主题——深色模式或浅色模式——以及语言。它还有像 PlayStation 一样的奖杯系统：你用得越多，应用给你的奖励就越多、奖杯等级越高，直到拿到梦寐以求的白金奖杯。',
    'shaper.s2.p1':
      '这是播放器界面，就跟 YouTube Music 或 Apple Music 一样。在这里你可以点击播放、暂停、下一首或上一首。',
    'shaper.s2.p2':
      '但最重要的是底部的工具栏，那基本上就是这个应用存在的两个核心理由：Shape 和 Clips。',
    'shaper.s3.p1':
      'Sound Shaper 这个名字就源于这里：它基本上就是一个声音塑形器。就像我前面提到的，你可以调节播放速度、预设、均衡器，还有各种滤镜、实时播放速度，也可以开启自动 DJ 模式。',
    'shaper.s3.p2':
      '保持音调是开发过程中最有趣的部分之一。在 YouTube 或 YouTube Music 上，如果你把一首歌或视频调成 2 倍速或 0.75 倍速，人声就会变得极快或极慢，就像快进或慢动作一样。而在 Sound Shaper 里，你可以让正在说话或唱歌的人声在跟随歌曲节奏变化的同时保持原本自然的音调。此外还有回声和隔壁房间（next room）这样的滤镜，当你把它们组合起来玩时，感觉就像瞬间穿越到了演唱会现场、站在演唱会外的停车场，或者像邻居家正开着最大音量办派对而你在自己家里听到那种音效，又或者像你在派对中途走进一个房间——比如在洗手间洗脸时——听到那种充满怀旧感的氛围，人不在派对或演唱会现场却能重现这种感觉真的特别有意思。这里给你快速展示一下 Bad Bunny 的歌曲 DÁKITI 在当前版本 Sound Shaper 的自动 DJ 模式下听起来是什么效果，因为自动 DJ 还在不断进化。',
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
      'Space Explorer 最初是为我的应用准备的彩蛋，具体来说就是 Sound Shaper：你进入应用里的某个特定位置，在几个秘密地方连点几下就会进入游戏模式，展开一两个 Sound Shaper 关卡，并用一段完整的故事线与我未来发布的其他应用串联起来。但这会让产品变得过于复杂，而且藏得太深、只有我自己知道，别人根本很难发现，所以为了精简产品、让 Sound Shaper 纯粹做 Sound Shaper，我就把它移除了。结果巧合的是，几乎同一时间我们报名了在委内瑞拉加拉加斯举办的 [Platanus](platanus) 黑客松，其中一个附加小游戏挑战就是做一款街机游戏。因为我已经把这个点子打磨过了，我就说：干脆把 Space Explorer 做成街机游戏吧。这个挑战很有意思，因为游戏体积上限是 50 千字节——也就是 50 KB——而我成功把它做成了一款 3D 太空射击游戏，地图很酷，风格非常简洁，因为比起像素美术，我更想做出技术含量更高、效果也更酷的东西。实际上它里面甚至还有一个黑洞，运行起来非常流畅，飞船的操控也有很多有趣的功能。你可以直接在这个页面上玩，也可以在 [Platanus Hack 的官方网站](arcade)上玩，希望你们喜欢。那场黑客松里 3D 游戏很少——当然有很多很棒的作品——最终效果非常酷。这款游戏提交时是什么样就保持什么样：我不会再往里面加新东西了，因为我的想法就是让它永远保持黑客松结束时的样子，如果以后再做新游戏，那就会是另一款游戏，而不是 Space Explorer 了。',

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
      '[Crol](crol) 是面向墨西哥中小企业的云端 ERP，在 Crol 我从 Conto Pay 起步。它是 Crol 旗下一款更简单、更易用的产品，我主导开发了它的网页系统、移动应用和落地页。而那款移动应用后来也发挥了很大作用，成为了 Crol ERP Móvil 的基础，同样由我从零开始构建并设计。',
    'work.salvalo.body':
      '我是 [Salvalo](salvalo) 的联合创始人，这是我的创业公司，严格来说也是我作为首次创业者（first-time founder）的项目——虽然以前也有过其他尝试，但这一家才真正算我的首次创业——Salvalo 是一个美食特惠交易平台。在委内瑞拉，每天都有商家在打烊时剩下本可以卖出去的食物或商品，而 Salvalo 解决了这个问题。怎么做呢？想象一家面包店早上做了 10 个 cachito，到了下午还剩 3 个外加 2 根法棍：商家把这些商品组合成一个特惠包在应用上出售，顾客以特惠价、打烊价买走，显然双方都是赢家。为什么呢？因为商家不会白白浪费掉那份商品，也不会亏掉商品的成本：虽然赚得不如全价卖出那么多，但不会亏损，而且还能获得一位新客户和一笔新订单，因为 Salvalo 就像一个外部销售渠道。对顾客来说，下午能用特惠的价格、非常方便的方式买到早上新鲜出炉的 cachito。应用和系统的运作流程其实很简单；真正难的是拓展商家和寻找用户。不过 Salvalo 真的很有意思，我非常喜欢：作为联合创始人，我目前更专注于市场和销售——尤其是销售——因为我是 Salvalo 目前在委内瑞拉当地的代表，负责亲自上门向商家做路演推广。这给了我很大帮助，因为我不仅练习了如何销售，还锻炼了如何克服面对实体商家时的羞怯、知道该怎么开口，我觉得这是需要一直练习的事，尤其对我而言。以前的我虽然不算害羞，但性格偏内向，常会想：我干嘛要去主动找人家聊这个呢，而现在我必须硬着头皮去做，因为不去谈就没有商家入驻 Salvalo。当然，作为技术出身的人，我也投入到了网站、落地页、网页系统、Web 应用以及移动应用的开发中，老实说 Salvalo 整体做得非常棒。我在这个过程中学到了很多：我觉得真正投身一家认真的创业公司的经历，在人生中越早经历越好，因为你会学到太多东西，它会把你放进一种氛围和环境里，推着你不仅作为创业者、更作为一个完整的人去不断进步。事实上，今年我参加的大多数活动都是代表 Salvalo 去的——你们可以在活动板块里看到，我也不确定它在上面还是下面，因为我老是改位置，开玩笑的，也没老改，反正就在活动板块里——像 El Panal 和 Startup Venezuela Summit 我都是代表 Salvalo 参加的，体验非常棒。为委内瑞拉做点事情也总是很有意义，毕竟这是我出生、也是我现在生活的国家。总之就是这样：这就是 Salvalo，大家快去拯救你们的美食包吧。',
    'work.maktub.body':
      '[Maktub Art Fund](maktub) 是一位来自墨西哥的客户，它只是一个独立的落地页，通常来说单纯做落地页不会太吸引我，但这个项目的设计非常独特，是我以前没做过的风格，成品非常现代、很有时尚感，我非常喜欢最终的效果。',

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
      '这一段有更多的故事。和我一起读小学和中学的 [Pastor](pastor) 有一天突然给我发消息，把 [Ale](ale)（Alejandro）和 [Cesar](cesar) 介绍给我，一起报名参加由 [Yummy](yummy)、[Cashea](cashea)、[Slash](slash) 和 AlegrIA Labs 在加拉加斯 Yummy 办公室举办的黑客松。换作以前的那个 Juan，多半会因为害羞、害怕或犯懒而拒绝，但那一刻我对自己说：哪怕什么都没拿到，至少我们能学到超级多东西，干就完了。于是我们开了好几次会，决定做 [Tripealo](tripealo)——一个面向委内瑞拉的旅行体验交易平台，提交了申请还拍了报名视频，最终从上千名报名者中入选前 100 名，去加拉加斯 Yummy 办公室参加黑客松。那也是连续 36 个小时打磨产品：虽然我们没有赢，甚至没进前十，但它让我对创业世界是如何运转的有了极深的认识。它也让我更了解自己，而且我们的团队真的太棒了，绝对是 1% 战队：后来他们继续推进 Tripealo，我则退出来开始做 [Salvalo](salvalo)，不过在创业这条路上我们始终并肩同行——相比“传统创业”，我更喜欢“startup”这个词。那是一段我总会想起的经历：我们的队名叫 Tech Bros，我参加的每一场活动最爱收藏的就是这些胸牌、这些 ID 卡，因为我像收集无限宝石一样把它们攒起来，每次看到都觉得很有意思，仿佛瞬间穿越回那个时刻、想起我和团队学到的一切以及认识的所有人。现场有许多非常精彩的分享，既有和创始人们的视频连线，也有很多面对面的交流：真的是满分 10 分的体验，也是委内瑞拉举办的头几场这种级别的黑客松——这是 Yummy 办的第二届，但可能是这种规模的第一场。我非常感激这段经历：它是只把写代码当工作的 Juan，蜕变为想要打造人们真正使用的产品、甚至用软件或硬件改变世界的 Juan 的转折点；也许那个 Juan 迟早会出现，但这场活动大大加速了这一切，因为那年十月在加拉加斯的前后，我的思维方式彻底改变了。',
    'events.alegria.m':
      '在加拉加斯参加委内瑞拉第一场 vibe coding 黑客松的三天。没有拿奖，却交到新朋友，也从 [Yummy](yummy)、[Cashea](cashea) 和 [Slash](slash) 的创始人那里学到很多。它正是让 [Tripealo](tripealo) 和 [Salvalo](salvalo) 起步的那一推。',
    'events.talk': '讲座',
    'events.ilc.when': '2026 年 9 月',
    'events.ilc.body':
      '在 AlegrIA Labs 黑客松上，[Pedro Vallenilla](pedro) 也曾通过视频连线分享；一年后，差不多又是第三、第四季度的时候，Pedro Vallenilla 亲自来到我在委内瑞拉拉腊州的家乡巴基西梅托，和在巴基西梅托非常著名的 [Elías 神父](elias) 一起做了一场关于领导力的演讲。于是我们又和团队一起去听，就坐在[剧院](juares)的第二排，离舞台超级近，能亲眼看着打造出 [Cashea](cashea) 的人讲述他自己的故事真的太棒了。去之前为了做功课，我把他的所有采访——至少是最出名的那些——都看了一遍，而在现场他讲了许多我以前从没听过的具体故事。最让我印象深刻的是，在他看来委内瑞拉就像一片旷野（greenfield）——这也是我从他分享中最大的收获——在这里你可以做太多事情，因为在经历了这一切之后，这里有巨大的空间去打造那些在拉美其他国家已经普及的基础科技产品。你看 Cashea 就知道了：谁能想到像 Cashea 这样的模式能在这里火起来——不做银行却做信用分期，而且方式非常独特，完全不同于传统银行放贷。这是一个听起来超级疯狂的点子，你会想：天哪，这在委内瑞拉真的行得通吗，更何况 Cashea 刚推出时还赶上了疫情等重重考验，完全是逆流而上。我甚至清楚地记得有一次在巴基西梅托的 Sambil 商场里，亲眼看到有人穿着 Cashea 销售团队的衣服在做宣传，现在回想起来都会感叹：哇，他们当初真的是挨家挨户去跑商家，他在演讲里也多次提到，一家店一家店上门推销时别人直说“你疯了吧，这怎么可能，快走快走”。正是那种跌倒了再往前冲的韧劲——一个创业项目成了，接着好几个项目接连失败、再失败——直到最终做出 Cashea，在 2026 年的今天撬动了委内瑞拉整个 GDP 的可观比例，这种规模真的太震撼了，所以能在现场见到他本人真的超级酷。',
    'events.ilc.m':
      '这次在我的城市亲耳听 [Cashea](cashea) 的 [Pedro Vallenilla](pedro) 讲：一次成功的创业，接连几次失败，然后是 Cashea，以及为什么委内瑞拉是创造的好地方。',
    'events.interview': '采访',
    'events.radio.when': '2026 年 10 月',
    'events.radio.body':
      '这是 [Salvalo](salvalo) 的第一次电台采访，在巴基西梅托 [OK 101.5 FM](ok101) 的 [Cheo Noguera](cheo) 节目里。这也是我人生第一次上电台——我很小的时候上过电视，不过那是另一段故事了——我的联合创始人 Abrahan 因为人在西班牙，也通过网络连线参与了节目。说实话这是一次非常棒的经历，我学到了很多：原本以为自己会紧张，结果反而特别想聊、想继续分享 Salvalo 的点点滴滴。我们讲了 Salvalo 是什么、我们的故事以及当初是怎么起步的；电台听众现场提问，我们当场解答，有好几个人当场安装了应用并对我们说：嘿兄弟，太酷了，继续加油！我还在节目里讲了我每次都会举的 Salvalo 例子：假设你是一家面包店，早上做了 10 个 cachito，到了下午——比如下午 6 点——还剩 3 个，那么你就可以把这 3 个 cachito 加 2 根法棍组合成一个特惠包，在应用上以打烊特惠价卖出去。因为 Salvalo 相当于一个额外的销售渠道，你能卖出这个特惠包、不会浪费产品、拿到这笔收入，还可能收获一位以前不认识你、或者平时很少光顾你实体店的新顾客，通过 Salvalo 认识你之后觉得“这家店最近发的特惠包很棒，去买几份吧”。而对顾客来说，下午能用特惠价买到早上新鲜出炉的 cachito 和法棍，完全是双赢。我也很喜欢记录并铭记这些我代表 Salvalo 参加的活动和场合，因为带着 Salvalo 上电台固然很棒、我也很喜欢，但它同时也是我作为创业者面向未来项目的实战训练：学会如何应对不同场合、如何跳出我个人的视角，向任何背景的人讲清楚一家创业公司，毕竟向开了 20 年面包店的老板解释 Salvalo 是完全不同的沟通方式。所以我一直把它当作一种训练：这是我的第一次电台实战训练，体验真的非常酷，希望很快还能再去，继续锻炼我的电台主持功力。',
    'events.radio.m':
      '[Salvalo](salvalo) 的第一次采访，在巴基西梅托 [OK 101.5 FM](ok101) 直播：主持人在节目中下载了 App，我向听众讲解它的用法。',
    'events.meetup': '交流会',
    'events.panal.when': '2026 年 10 月',
    'events.panal.body':
      '[El Panal](panal) 是 [Manuel Sira](manuel) 在巴基西梅托发起的一个社群运动，旨在把拉腊州各种与科技相关的从业者聚集在一起，让科技活动不再永远只集中在加拉加斯。我和 [Tripealo](tripealo) 的朋友们一起去参加，活动非常棒，因为现场要用 30 秒时间路演你的项目，而我也在那里完成了 [Salvalo](salvalo) 的第一次正式路演。我依然讲了我最常举的那个面包店例子——下午店里还剩 3 个 cachito，就把它们做成特惠包放到 Salvalo 上卖——当时我确实挺紧张的，因为在 Jirajara 酒店的 Galión 餐厅里大概有 140 个人，而且并不是每个人都能上台路演。现场一共只有三四轮，每轮大概只有五到七个人上台，我第一轮没挤上去，第二轮成功排在第二个上台。我之所以紧张，是因为心里一直在给自己施压：只有 30 秒，时间一到就会被打断；你一开口他们就喊“开始”，身后大屏幕上就是 30 秒倒计时，一到零就会响铃，不管你讲到哪里都会被叫停。结果所有上台路演的人都完整讲完了自己想说的话，我也把想讲的内容全部讲完了：虽然我当时很紧张、自己也能听出紧张感，但我把它当作了一次非常好的锻炼。此外，这场活动和这个社群本身也非常棒，因为聚在一起的不只是做纯应用开发的人：现场有做心理学应用的，有做一款叫 [Resty](resty) 的找洗手间应用的——一个非常疯狂的点子——同时也有做市场营销、时尚以及传统 CRM 技术系统的人，还有关于如何通过衡量数据与内部统计指标来壮大业务的精彩分享。另一场分享也正好呼应了我脑海里一直在想的一件事：在人工智能时代，真正拉开差距的也许不再是单纯的技术——因为只要你下达指令，人工智能几乎什么都能做，而且随着时间推移只会越来越强——但作为机器或机器人，它没有人类的审美与品味，也就是创造事物时的艺术感，而在如今的人工智能时代，这一点正变得越来越重要。自从人类开始借助机器创造事物以来，人类赋予在机器产出之上的那份品味就一直存在：比方说，木匠大师或手艺人亲手打造的扶手椅，显然和工厂流水线出来的扶手椅完全不同，而这一点完美映射到 2026 年今天的人工智能与科技世界中，未来也会越来越明显。所以那真是一场非常酷的活动：之所以叫 El Panal（蜂巢），就是因为每个人都像一个蜂格，彼此连接在一起。事实上我在现场还为 Salvalo 拿到了几条潜在客户线索，也让更多人知道了我的项目：对于首次创业者来说——当时我正是带着 Salvalo 的首次创业者——这是极好的练习，去克服那种我至今仍在锻炼克服的羞怯感，主动走过去说“嘿，我在做这个，这是 Salvalo，你是做什么的？”，不再害怕推销自己的想法，大方地和别人聊自己亲手做出来的东西。活动真的太棒了，而这枚胸牌挂绳也是我收藏里的第二枚：看看我最后能攒下多少枚吧。',
    'events.panal.m':
      '在巴基西梅托参加 [El Panal](panal) 的一个夜晚：关于 AI、数据和品味的讲座，还有 30 秒为 [Salvalo](salvalo) 路演。很紧张，但我讲完了，带走了新朋友和几条潜在客户线索。',
    'events.summit': '峰会',
    'events.summit.when': '2026 年 10 月',
    'events.summit.body':
      '我参加了 [Startup Venezuela Summit](summit)，说实话我以前从没去过这样的活动，真的太棒了。我们听了很多场分享：在一场讲座里再次见到了 [Cashea](cashea) 的 [Pedro Vallenilla](pedro)，在另一场见到了 Slash 的 [Víctor Cárdenas](slash)，还有许多我从没想过能亲耳听到的嘉宾，甚至有很多我以前都不知道存在、没想到也在做这类产品的团队。体验真的太赞了：我认识了 [Rial](rial) 的一位联合创始人，以及许多来自海外、在这里做项目或寻找投资机会的人，听到了不少很酷的故事——比如由一两位委内瑞拉创始人参与创立的美国公司，旗下运营着风险投资基金，而且还是 Anthropic 的早期投资人；我原本以为见到的会偏本土背景，结果这是我参加过的在科技与创业层面最国际化的一场盛会。除了参加私人工作坊之外，这场活动最酷的地方在于 Caracas Campus 的各个舞台和礼堂随时都有讲座，而且官方应用会实时更新日程，突然就会冒出一场“秘密分享”——其实也不算秘密，因为它会显示在应用里——地点不在公开峰会区，而是在 Caracas Campus 商业办公区入驻企业的办公室里。其中非常有趣的一场是“反向路演”（investor pitch）：不是创始人向风投路演，而是风投机构反过来向创始人路演，说“来和我们合作吧，我们能提供这些支持”，还会讲到“如果一家创业公司没有计划在这个领域做到年营收十亿美元以上，我们是不会投的”，让你深刻意识到：哇，这是动真格的，可不是闹着玩的。我们还参加了 [Fina](fina) 和 [Square One Capital](squareone) 旗下加速器 [Innoven](innoven) 举办的私人工作坊，我也把贴纸——准确说是现场给我和 [Salvalo](salvalo) 拍的拍立得照片——贴上了墙，当场带着 Salvalo 报名了 Innoven，还带走了一张纪念照和一顶 Innoven 的帽子，真的太酷了。我觉得这次最大的收获之一就是：如果你想做一家创业公司，并且愿意全力以赴去实现它，那就去做吧，因为你的年龄、出身或背景都不重要——只要倾注热情与真心就能做到，而且目标定得越远越好。甚至它还让我产生了一点反向思考：我现在做的是面向委内瑞拉的产品，也许我不该只把时间花在本地，而是应该全力以赴去冲击全球顶级舞台——看看接下来能怎么做吧。身处那样的氛围中会被深深感染，我脑海里也一直回响着史蒂夫·乔布斯的那句话：那些疯狂到以为自己能够改变世界的人，才能真正改变世界。再一次，这枚胸牌挂绳也是目前最棒的之一：正面写着我的名字 Juan Villa，背面贴上了我在 Salvalo 的 C-level 头衔贴纸——他们一发给我我就贴上去了——所以我的收藏不仅在实体胸牌上增加了，在创业阅历和付诸实践的认知上也更丰富了；这次依然是和 [Tripealo](tripealo) 的朋友们一起去的，体验棒极了。',
    'events.summit.m':
      '和 [Tripealo](tripealo) 在 Startup Venezuela Summit 的两天：[Slash](slash) 和 [Cashea](cashea) 的分享，因为创始人夹克被邀请参加的 Fina 与 Innoven 私人工作坊，还有贴上委内瑞拉创始人墙的 [Salvalo](salvalo)。',
    'events.platanus.when': '2026 年 10 月',
    'events.platanus.body':
      '刚离开 Startup Venezuela Summit，我们就直接去了同样在加拉加斯举办的 [Platanus Hack 26 Caracas](platanus)；说来也巧，我们原本计划去参加 Startup Venezuela Summit，结果就在峰会结束当天，紧接着就是 Platanus Ventures 举办的黑客松——他们有一个专门在拉美办黑客松的分支机构，这也是他们第一次举办拉美巡回赛——而且你们猜这次黑客松的大本营又设在哪里：又是在 [Yummy](yummy) 的办公室。这下就更好笑了，因为在 AlegrIA 黑客松整整一年之后，我们又回到了 Yummy 办公室参加 Platanus 黑客松，而且有更多人两场黑客松都参加了。说实话这场黑客松绝对是满分 10 分，体验太棒了：36 个小时里我们睡得很少，但 Platanus 团队、Yummy 团队以及所有赞助商把活动组织得极其出色，美食源源不断，我为了不犯困每隔一会儿就起来喝水。不仅是我，还有我团队里参加过往届黑客松的队友们，把过去学到的一切经验都用在了这一场，彻头彻尾就是在不停地构建、构建、再构建。我们抽到或者说选择的项目赛道与具身智能（Physical AI）有关，因为我们要在“Physical AI is the new sexy”的前提下去打造产品，于是选了 3D 赛道——彻彻底底的 3D——做出了 [Tridi](tridi)，它能把相机拍摄或预先录入的人物视频转化为人形机器人的训练数据。假设你开了一家机器人公司，造出了机器人，但这些机器人并不知道该如何在这个真实的物理世界里行动：哪怕你有了大语言模型（LLM），甚至未来 Anthropic 做出了他们自己的机器人模型——比如做出 Claude 8.0 机器人版——人类在物理世界里能做的事情依然太多了，机器人需要海量的物理数据。大语言模型是用整个互联网、全人类知识和所有书籍的数据训练出来的，但机器人却没有这种物理世界的训练，因为想想看，在一个像厨房这样最基础的环境里，一个人能做出多少种动作——不只是做饭，还要洗碗、收拾厨具等等无数事情——而且在物理环境中有太多外部因素需要人形机器人去交互。这正是 Tridi 发挥作用的地方：我们拍一段视频，比如有人走路的视频，教机器人如何走路，而且不只是走路本身，还会把刚才提到的所有外部因素都纳入我们自己构建的物理模拟环境中。这样一来，当你造好实体机器人、思考该怎么训练它时，通过 Tridi 上传一段视频——未来还会扩展到多角度、多场景的海量视频，建立起分发给所有人形机器人的基础知识分支——你就能在机器人真正进入现实世界之前教会它走路，而你加载到机器人程序里的就是那套策略（比如代表走路的 `walk_v1`），这就是 Tridi 的运作方式。老实说，对于那场黑客松而言这或许是一个很有野心的项目——我这么说是因为我们没拿奖——但现场的技术水准真的非常高：我和队友们研究了这次拉美巡回赛在布宜诺斯艾利斯、墨西哥城和波哥大站的黑客松，心里还在想“加拉加斯站也会有那种水准的项目吗？”，结果真的有好多非常酷的项目、无数技术过硬的高手，真是一段不可思议的经历。我为 Tridi 感到非常自豪，也为整个团队感到自豪：我觉得我们做出了一个非常酷的产品，去解决一个刚刚浮现、并将在未来十年持续上演的问题，因为“Physical AI is the new sexy”千真万确，结合人工智能的机器人技术将全面主导 21 世纪剩下的时光。相比传统软件，或者相比我们目前所处的这个几乎看不到机器人的世界，这是一次超级有趣的范式转移：过去的电影里总在问“未来真的会有机器人吗？”，我相信未来一定会有无数机器人，只是需要给它一点时间——看看人工智能在这么短的时间里发展得有多快，我相信机器人也会以同样的方式突飞猛进——而我们希望成为前沿技术（cutting-edge technologies）之一，推动这一转变尽可能快地到来。而且在 Tridi 里不仅能训练人形机器人：如果你去 Tridi 的页面看，任何在物理世界里有动作行为的机器人都可以训练，不一定是人形的，也可以是像 NASA 正在探索火星的那种火星探测车。参加完这场黑客松，我再次由衷感谢 Platanus 和 Yummy 团队；我们的导师是 Yummy 产品工程师兼 [Wink](wink) 联合创始人 [Sebastián Alcalá](sebastian)：那几天的体验实在太棒了，我们欢笑不断，也学到了很多，现在我们已经两战两败了，看看明年他们会不会再办一场黑客松，到时把冠军拿下来，毕竟事不过三嘛。而且这次他们还发给我们一枚设计得更有趣的胸牌：我手头正好拿着，它是专门做成可以塞进钱包的尺寸；你们看，上面有我的全部信息，因为它内置了 NFC 芯片，允许你自定义 NFC 跳转的网页链接，我自然直接把它指向了你们现在所在的这个网站：juanevillam.com，J-U-A-N-E-代表委内瑞拉的 V-I-L-L-A-M 点 com。所以我把它放在钱包里，因为它就是一张标准卡片的大小，每当我需要给别人看我的网站时，就拿出它往对方带 NFC 的手机上一靠——现在大多数手机都有 NFC——就能直接帮他们打开我的网站。所以这枚胸牌不是用来挂在脖子上的——当然你想挂也可以——而是让你收在钱包里的，由于可以自定义任何链接，它用起来极其顺手、非常实用，我特别喜欢。以往所有的胸牌都做得更大更华丽，但这张卡完完全全是我的风格——我说的“符合我风格的东西”就是指这种设计；要是做成黑底白字就更完美了，不过这样也完全没问题。说实话这场活动真的太赞了，也是在加拉加斯极其充实的一周：感觉每逢十月都是我们一年中最重要的科技月——无论是今年 2026 年还是去年 2025 年——看看未来几年会不会继续保持下去，而且希望不止在十月，而是在更多月份、更频繁地举办；这一段明显长了很多，因为它背后的故事确实丰富得多。',
    'events.platanus.m':
      '从峰会直接去了 Platanus Hack 26 Caracas，和 AlegrIA 的队友回到 [Yummy](yummy) 的办公室：我们做了 [Tridi](tridi)，把视频变成机器人的动作数据。没有拿奖，但这是一场难得多的黑客松，旁边还有人在玩 Space Explorer。',
    'likes.title': '更多关于我',
    'likes.cosmos.name': '宇宙',
    'likes.cosmos.body':
      '太空一直让我着迷：当你看到它是如此浩瀚无垠、并试图去理解它时，那种尺度根本无法用任何词语去形容，瞬间把一切都放在了强烈的对比之下。比方说，人类历史上发生过以及此时此刻正在发生的一切，全都发生在地球上——而且只是地球的某些角落，因为我们甚至连整片海洋都还没探索完——全都发生在这颗星球上，而地球只是太阳系众多行星中的一颗。太阳系又是银河系无数恒星系中的一个；银河系也只是本星系群众多星系中的一员，外面还有超星系团以及无边无际的巨型结构，让你忍不住感叹：天哪，这根本没有尽头。太阳只是一颗恒星，宇宙中还有大得多的恒星，而黑洞的概念更是疯狂：超新星爆发、两个黑洞相撞，或者一个星系吞噬另一个星系、三个星系融为一体，那种疯狂的尺度清楚地表明，宇宙对人类完全是漠不关心的。外面的宇宙正在发生着那样惊天动地的事，而我们所有的人类烦恼——谁伤心、谁快乐、谁生病、谁健康、遭遇了什么又错过了什么——以及我们对过去、现在和未来的所有担忧，全都发生在这个与宇宙相比微不足道的小点上。它让你认清自己的位置：在一个巨大得无法理解的宇宙面前，你不过是一只小小的蚂蚁，而我没有排斥或厌恶这种感觉，反而越来越热爱它。我觉得没有什么比宇宙本身、比你们现在看到的这些[詹姆斯·韦伯](webb)和[哈勃](hubble)望远镜拍下的照片更真实了：没有什么比这更真实，这才是唯一真正重要的事。至于这些照片，我平时什么都爱排个榜单，唯独面对它们我根本没法排名：每一张都太不可思议了，有的展现恒星尺度，有的展现星系尺度，美到让我找不到任何语言来表达；还有关于我们是否活在模拟世界里的种种奇妙设想，我也全都着迷不已。在我看来，全人类归根结底只有两个问题，浓缩成一件事就是太空探索——我为 Platanus Hack 做的第一款游戏 Space Explorer 的名字正源于此——因为我一直说，我真希望自己能出生在更遥远的未来，一个像《星球大战》那样不在单一星球或单一星系度过一生、而是跨越多个星系的未来，我相信那一天终会到来，只是 2026 年的今天还太早，也许要到公元一万年甚至十万年，谁知道呢。而要实现真正的星际探索，除太阳外最近的恒星单程就要四光年、往返八光年，以人类的尺度来看基本没戏。所以显然要想实现那种尺度的太空探索，你必须拥有永生：对我来说，全人类——无论哪个国家的孩子、说什么语言、老人还是年轻人，虽然这很难，但静下心来想——唯一应该集中精力攻克的两个问题就是太空探索与寻找永生。从更现实的角度来看，这两件事是完全绑定的：如果没有永生，你怎么可能用这具如此脆弱、必死的肉体去完成那么漫长而危险的星际旅程呢，毕竟我们拥有复杂的大脑，身体却脆弱得不堪一击。再想象一下，如果不仅能亲眼见证火星或月球的殖民，还能见证一个个星系、甚至可观测宇宙各个扇区的开拓，让生命不再只是跨行星、而是至少达到星系乃至多星系的尺度，那该有多疯狂、多酷啊。我觉得那才是一个值得向往的未来，没有什么未来比这更迷人了：在地球这颗美丽的星球上去海边度个假固然很好，但当你想到去往另一个星系的尺度、尽可能靠近黑洞或恒星、亲眼目睹《星球大战》里那样千奇百怪的星球，而且还是带着永生之躯去见证漫长岁月里的万千奇景，那真是难以想象。所以我才想在自己的网页上专门做一个板块来安放我对宇宙的这份热爱，这真的太酷了：每次看到这些照片我都会说，在这些照片之外再没有什么更真实的东西了；每次看到它们我也会提醒自己“看啊 Juan，你正为眼前的烦恼焦虑，如果你能在自己心里构建出天堂那很好，因为宇宙对你遭遇的一切毫不在意”。很多时候我们总以为自己很特别——这有一部分来自宗教观念，我就不展开了，比如认为我们是为了某个特定目的被创造出来的、有一套既定的安排和一位全能仁慈的上帝——但这些照片却清楚地证明，你不过是男人与女人之间一次人类行为的产物，正如你作为你所谓的“自我”降生一样，当初完全可能你没有出生、而是另一个人诞生。我总是对“一个孩子最终形成了自我，但当初完全可能是另一个人”这个概念着迷，也惊叹于浩瀚宇宙与人类生命在极致复杂的同时，在最原始的形态上却又如此简单，而且万物都在不断演化：连宇宙中的恒星本身都会消亡，人又怎么会不死呢？关于这个话题我可以一直聊下去、兜兜转转又回到原点，因为这是我最大的热爱之一。而且我一直觉得，如果未来真的找到了实现永生的方法，最可行的路径就是把你的意识提取到计算机里：把备份存放在多台计算机上，不仅分布在多个星球，更分布在多个恒星系中，每当你想要进入实体时，就把自己加载到像《创：战纪》（Tron）那样超级先进的机器人身上；就算那台实体机器人出了意外——因为在物理世界里如果被陨石击中，机器人作为物理实体也会损坏——发生意外时你只需把主意识重新加载到另一台机器人身上就行了，这样就能实现真正的永生。我想说的是，到我死去的那一刻——如果我真的会死的话——我希望自己正在从事的不只是擦边、而是直接投身于这两件事之一：太空探索或永生，而归根结底就是太空探索，因为只在这颗星球上永生未免太无聊了——你能干什么呢？——可如果是在整个宇宙中永生，你还有什么不能做的呢——简直无法用语言形容。我相信只要有越来越多人抬头仰望宇宙，就会有越来越多人投身于这两个我认为对全人类最根本的问题。与此同时，人工智能也超级有趣，因为我觉得自从人类发现火的那一刻起，就注定要创造出替代自己的存在，而现在看来那显然就是人工智能：这甚至带着一种诗意，如果有人问我我们是否活在模拟世界里、愿不愿意拿钱打赌，我押“我们活在模拟世界里”的钱绝对会比押“天堂存在”之类的多得多，因为你越深入思考，就越觉得模拟世界说得通。总之，说个有趣的小细节，我第一次看到这些照片时，总是戴上耳机什么也不放，就这样盯着看上好几个小时：在我见过的所有照片里这些是最震撼的，我根本没法从中挑出一张，因为每一张都美得令人窒息，对我来说没有什么比这些照片更真实了。',
    'likes.songs.name': '歌曲',
    'likes.songs.meta': '我的排行',
    'likes.songs.body':
      '这里和大家分享一些我最喜欢的歌：如果你留意听，会发现它们带有一种我称之为赛博或未来感的风格，不过实际上我觉得应该算是 techno 之类的电子乐。一首歌的歌词越少，我就越喜欢：也许我听的“有人声的歌”不算多，但我听大量的纯音乐，因为如果一首曲子不靠一个字就能表达出丰富的情感，我会喜欢得多——我觉得这里面有一种很棒的独特韵味。它们就在这里：而且我觉得如果你一路看完了前面的视频来到这里——有些视频确实挺长的——不妨猜猜这些歌里我保存在自己的个人 [Sound Shaper](shaper) 曲库里的最爱片段是哪几段，看看能不能猜中我的性格特点。这个板块做成了预览的形式——其实也不算预览，它就是你真正在 Sound Shaper 里能用到的完整功能，只是预装了我的曲库：里面很多歌来自我的最爱榜单，还有一些是放进来给大家试玩、图个乐子的。所以尽管随便点开任何一首歌，开始把玩 Sound Shaper 的各种滤镜吧，非常有意思；你甚至可以打开 DJ Juan 功能，只要你一点开，我（Juan 本人）就会立刻收到通知、上线进入 DJ 模式现场为你混音——开玩笑的，我可没那样做，这一切都是由我按自己品味训练出来的 DJ Juan 自动完成的，就像如果我精通音乐艺术与都市歌曲创作时会做出的那种混音一样，哈哈开玩笑的，我都不知道自己刚胡说了些什么。总之，这一节比前面的板块更轻松随性，因为它是“更多关于我”：既然前面的内容已经很个人化了，那这一块就更放飞自我一点，我可以在视频里自在地比划这种在主页正经介绍里可能不会做的动作，你懂吧？而且既然这个网站是我自己做的，我想把视频留多长就能留多长：想录长一点就录长一点，因为这是我的网页，做这种事也让我觉得特别好玩。我当时就想：无论如何我都得在主页上放一个可以直接试玩的 Sound Shaper 预览，让任何想用的人都能直接在这里上手，连登录账号都不用，因为歌曲已经全部加载好了；那我该怎么实现呢——干脆录一个我最爱的歌曲板块吧。',
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
  },
};
