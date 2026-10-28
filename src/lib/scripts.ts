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
 * SPANISH ONLY (Juan, 2026-10-17): the page has one voice, subtitled in
 * English and Chinese (lib/narration), so nothing else is recorded. The
 * ideas follow what Juan actually said in the takes, so a re-recording
 * needs little change.
 */
export type ScriptLang = 'es';
export const SCRIPT_LANGS: ScriptLang[] = ['es'];

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

const shot = (app: string, name: string) => `/media/${app}/${name}.webp`;

export const SCRIPTS_ES: ScriptClip[] = [
  {
    key: 'hero',
    where: 'Inicio',
    draft:
      'Regrabar: cambió lo que dice de los idiomas (voz en español, subtítulos en tu idioma).',
    ideas: [
      'Hola, soy Juan Villa, desarrollador de software.',
      'Hago software como me gusta jugar videojuegos: yendo por el platino.',
      'Desde 2022 trabajo remoto para empresas en México, y clientes en España y Argentina.',
      'Empecé ingeniería electrónica, luego técnico en informática; lo que más me enseñó fue construir cosas.',
      'Aquí vas a ver apps hechas por mí, para mí, que igual están en las tiendas; mi trabajo; mi startup, Salvalo; y los eventos de emprendimiento y desarrollo en los que he estado.',
      'La página está en español, inglés y chino: cámbiala arriba a la derecha.',
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

  // Events
  {
    key: 'events.platanus.body',
    where: 'Eventos · Platanus Hack 26 Caracas',
    ideas: [
      'Saliendo del Summit el viernes, directo a Platanus Hack 26 Caracas: este año Platanus hizo su hackathon como gira por Latinoamérica.',
      'Aplicamos cada uno con su perfil de desarrollador: el mismo equipo de AlegrIA, Pastor, César, Ale y yo.',
      'Casi un año después, de vuelta en las oficinas de Yummy, pero en una hackathon mucho más fuerte técnicamente.',
      'Construimos Tridi: convierte un video normal de una persona en data de movimiento para robots; un robot simulado en MuJoCo aprende a moverse solo imitándola.',
      'Dormimos poco, pero lo que aprendí en AlegrIA me sirvió para manejar mi mente y mi foco.',
      'Yummy nos daba de comer en su comedor; una noche, pabellón criollo, el plato típico de Venezuela: arroz, carne mechada, caraotas y tajadas.',
      'Nuestro mentor: Sebastián Alcalá, product engineer en Yummy y cofundador de Wink. Pastor dio el pitch y yo estuve con él en el escenario.',
      'No ganamos, pero el nivel fue impresionante: había visto los videos de Buenos Aires, México y Bogotá, y Caracas estuvo a la altura. Ganó Museo 3D, en nuestro track.',
      'Nuestro puesto estaba al lado del arcade: vi a dos grupos jugando Space Explorer sin que yo dijera nada.',
      'También conocimos a Adirson Martínez, CTO de Rial, que fue muy pana con nosotros.',
    ],
  },
  {
    key: 'events.summit.body',
    where: 'Eventos · Startup Venezuela Summit',
    ideas: [
      'Fui al Startup Venezuela Summit en el Caracas Campus con mis amigos de Tripealo, el jueves y el viernes.',
      'Nunca había ido a un evento así: charlas todo el día, extranjeros hablando inglés, gente de otros países haciendo conexiones y construyendo todo tipo de productos.',
      'Escuchamos a Víctor Cárdenas de Slash y a Pedro Vallenilla de Cashea.',
      'Por nuestras chaquetas de Salvalo y Tripealo, alguien de SquareOne Capital nos dijo que eran de founders y nos invitó a un workshop privado con Enrique Rivas de Fina e Innoven.',
      'En el stand de Innoven postulamos a Salvalo y pegamos nuestra foto en la pared de founders venezolanos: dejar la huella.',
      'Conocimos a founders como los de Rial.',
      'Me llevé: hacer una startup es difícil pero vale la pena; con ambición y ganas lo logras; no importa tu edad, tu país ni de dónde vienes.',
      'Como dijo Steve Jobs: los que están lo suficientemente locos como para creer que pueden cambiar el mundo son los que lo hacen.',
      'Llegué a mi casa emocionadísimo, y todavía lo estoy procesando.',
    ],
  },
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

  // More of Me (pages/things-i-like)
  {
    key: 'likes.cosmos.body',
    where: 'Más de mí · Cosmos',
    draft:
      'Regrabar: más animado y con la voz más alta, para que suene como el resto (la grabé cansado).',
    ideas: [
      'El espacio siempre me ha fascinado.',
      'Me identifico con el nihilismo optimista: al ver lo vasto que es el espacio, mucho de lo que te preocupa deja de tener sentido.',
      'Hay cosas tan imponentes allá afuera, y nosotros: una mente tan compleja en un cuerpo tan débil y mortal.',
      'Ahora mismo alguien compra una casa y alguien la vende; alguien celebra un nacimiento y alguien llora una muerte. Nadie es especial, aunque nos sintamos especiales.',
      'En vez de rechazar ese sentimiento, decidí admirarlo y amarlo, como la existencia misma.',
      'Por eso empecé a ver las fotos del James Webb y del Hubble: duraba una hora viéndolas con música.',
      'Estas son las que me encantan, en un orden distinto cada vez.',
    ],
  },
  {
    key: 'likes.paintings.body',
    where: 'Más de mí · Pinturas',
    draft:
      'Regrabar: más animado y con la voz más alta, para que suene como el resto (la grabé cansado).',
    ideas: [
      'Después de que empecé a ver el espacio, busqué pinturas que también hicieran match conmigo; tuve una época en la que quise coleccionarlas.',
      'Terminé con el mismo contraste del espacio: cielos inmensos, tormentas y luz, ciudades e imperios cayendo, y la gente diminuta en medio.',
      'La mayoría son de John Martin y Thomas Cole, pintores del siglo XIX que pintaban el fin del mundo como si lo hubieran visto.',
      'También el Sermón del Monte de Carl Bloch, Las hilanderas de Velázquez y algunas recientes de las que todavía no sé el pintor.',
      'No tienen ranking, porque me gustan todas: salen en un orden distinto cada vez.',
    ],
  },
  {
    key: 'likes.games.body',
    where: 'Más de mí · Videojuegos',
    draft:
      'Regrabar: más animado y con la voz más alta, para que suene como el resto (la grabé cansado).',
    ideas: [
      'Ghost of Yōtei y Elden Ring están en mi top, y a los dos les saqué el platino.',
      'Al terminar Ghost of Yōtei le tomé captura a los outfits con los que lo acabé, en el orden que más me gustaban: siempre los mismos charms, el outfit como yo quisiera.',
      'Elden Ring es muy cinematográfico. Mi hermano ya lo había jugado, así que desde el principio tenía mapeadas las fotos que quería tomar al platinarlo.',
      'Me tomó 78 horas, y con esa armadura me hice todos los finales.',
    ],
  },

  // Footer
  {
    key: 'footer',
    where: 'Despedida',
    draft:
      'Regrabar: cambió lo que dice de los idiomas (voz en español, subtítulos en tu idioma).',
    ideas: [
      'Gracias por escucharme.',
      'Si tienes algún comentario, escríbeme por LinkedIn o Instagram.',
      'Sigo construyendo, y sigo yendo por el platino.',
    ],
  },
];

/** Every clip's script in one language — Spanish is the only one. */
export const scriptsFor = (_lang: ScriptLang): ScriptClip[] => SCRIPTS_ES;
