/**
 * THE NARRATION SCRIPTS — what Juan reads, word for word, one entry per
 * clip key (see lib/narration). Read only by the dev teleprompter
 * (pages/dev); nothing on the public page imports this file.
 *
 * Every LINE is one subtitle phrase: the teleprompter shows them one at a
 * time, and the cue Juan taps at each line becomes that phrase's start in
 * the clip's `.vtt`. Keep a line short enough for the narrator's pill
 * (about 60 characters).
 *
 * Written the way Juan TALKS, not the way he writes (Juan, 2026-10-12):
 * his own fillers stay where they sound like him — "pues", "o sea",
 * "fíjate", "mira", "¿verdad?" — a few per clip, never one per line.
 *
 * Spanish first. English and Chinese are written from the Spanish once
 * it has been recorded and heard.
 */
export type ScriptClip = {
  key: string;
  /** Where it plays on the page, as the teleprompter's heading. */
  where: string;
  /** What a visitor sees while it plays, when that is a screenshot. */
  shot?: string;
  lines: string[];
};

const shot = (app: string, name: string) => `/media/${app}/${name}.png`;

export const SCRIPTS_ES: ScriptClip[] = [
  {
    key: 'hero',
    where: 'Inicio',
    lines: [
      'Hola, soy Juan Villa, desarrollador de software.',
      'Me gusta hacer software igual que me gusta jugar videojuegos:',
      'yendo por el platino.',
      'Desde 2022 trabajo de forma remota en Crol,',
      'un ERP para empresas en México,',
      'donde construí su app móvil desde cero.',
      'Empecé a estudiar ingeniería electrónica,',
      'y después técnico en informática,',
      'pero lo que más me enseñó fue construir cosas.',
      'Aquí te cuento en todo lo que he trabajado',
      'y lo que me parece interesante resaltar:',
      'las apps que hice para mí, que van a salir en las tiendas,',
      'mi trabajo, mi startup',
      'y los eventos de emprendimiento y desarrollo',
      'en los que he estado.',
      'Ah, y la página está en español, inglés y chino.',
      'Si la quieres escuchar en otro idioma,',
      'cámbialo arriba, en la barra de navegación.',
      'Toda la página está narrada.',
      'Casi no hay textos, porque más que leer lo que escribí,',
      'quería que me escucharan.',
      'Y sí, esta es mi voz real, no es inteligencia artificial.',
    ],
  },

  // Sound Shaper
  {
    key: 'shaper.problem',
    where: 'Sound Shaper · el problema',
    lines: [
      'Yo escuchaba mucha música en YouTube Music,',
      'con anuncios a cada rato.',
      'Y cuando una canción me gustaba,',
      'la quería en todas sus versiones:',
      'normal, slowed, sped up, ultra slowed.',
      'Y muchas veces ni siquiera la quería entera, o sea,',
      'quería los treinta segundos que más me gustaban,',
      'y los repetía, y los repetía, y los repetía.',
    ],
  },
  {
    key: 'shaper.solution',
    where: 'Sound Shaper · la idea',
    lines: [
      'Entonces se me ocurrió hacer Sound Shaper:',
      'un reproductor de MP3 que funciona sin internet.',
      'Tengo la canción original una sola vez,',
      'y desde la app la pongo lenta, rápida,',
      'le pongo los efectos que yo quiera',
      'y corto clips de mis partes favoritas.',
      'En YouTube la canción es un video, y suena como está.',
      'Aquí, pues, yo escojo cómo la escucho.',
    ],
  },
  {
    key: 'shaper.s1.p1',
    where: 'Sound Shaper · Library',
    shot: shot('shaper', 'ios-dark-home'),
    lines: [
      'Esta es tu biblioteca.',
      'Ojo, la app no descarga música:',
      'subes tus propios MP3, para tu uso personal,',
      'y los ordenas a mano, arrastrándolos,',
      'en el orden que más te guste.',
    ],
  },
  {
    key: 'shaper.s1.p2',
    where: 'Sound Shaper · Library',
    shot: shot('shaper', 'ios-dark-home'),
    lines: [
      'Funciona con lo que ya conoces del teléfono:',
      'la Dynamic Island, la pantalla de bloqueo, los widgets.',
      'Y desde aquí entras a Ajustes,',
      'como en el resto de mis apps:',
      'tu cuenta, el idioma, la apariencia',
      'y los trofeos, tipo los trofeos de PlayStation.',
    ],
  },
  {
    key: 'shaper.s2.p1',
    where: 'Sound Shaper · Player',
    shot: shot('shaper', 'ios-dark-player'),
    lines: [
      'El reproductor lo inspiré mucho en YouTube Music',
      'y en Apple Music.',
      'Como tal, es un reproductor normal, y está bien así:',
      'das play, pausas y cambias de canción sin pensarlo.',
    ],
  },
  {
    key: 'shaper.s2.p2',
    where: 'Sound Shaper · Player',
    shot: shot('shaper', 'ios-dark-player'),
    lines: [
      'Lo distinto está abajo:',
      'desde aquí mismito abres Shape y Clips,',
      'que son, pues, las razones por las que hice la app.',
    ],
  },
  {
    key: 'shaper.s3.p1',
    where: 'Sound Shaper · Shape',
    shot: shot('shaper', 'ios-dark-shape'),
    lines: [
      'Shape es la razón principal de que exista la app.',
      'De hecho, de ahí viene el nombre:',
      'Sound Shaper, moldeador de sonidos.',
      'Tienes presets listos, o un ecualizador manual',
      'si sabes más de esa configuración.',
      'Y la velocidad: ya no busco la versión slowed,',
      'la pongo slowed al nivel que yo quiera.',
    ],
  },
  {
    key: 'shaper.s3.p2',
    where: 'Sound Shaper · Shape',
    shot: shot('shaper', 'ios-dark-shape'),
    lines: [
      'Preservar el tono fue lo más curioso de construir.',
      'En YouTube, si la pones lenta, cambia el tono,',
      'y la voz suena como en cámara lenta.',
      'Aquí la pones lenta y la voz se queda igual.',
      'Y dos efectos que me encantan:',
      'eco, como si estuvieras en un concierto,',
      'y next room, como una fiesta en el cuarto de al lado.',
      'Con audífonos y los ojos cerrados, de verdad te transporta.',
    ],
  },
  {
    key: 'shaper.s4.p1',
    where: 'Sound Shaper · Clips',
    shot: shot('shaper', 'ios-dark-clip'),
    lines: [
      'Clips lo inspiré en Notas de Voz de Apple,',
      'la misma app con la que grabé las ideas de esta página.',
      'Escoges el pedazo exacto de la canción',
      'que más te gusta.',
    ],
  },
  {
    key: 'shaper.s4.p2',
    where: 'Sound Shaper · Clips',
    shot: shot('shaper', 'ios-dark-clip'),
    lines: [
      'Lo guardas como un clip',
      'y lo escuchas una y otra vez.',
      'Y desde aquí también abres Shape,',
      'para que ese clip suene a tu manera.',
    ],
  },

  // Topper
  {
    key: 'topper.problem',
    where: 'Topper · el problema',
    lines: [
      'Hace un tiempo empecé a hacer tops de mis cosas:',
      'películas, videojuegos, series, música.',
      'Se los pasaba a la inteligencia artificial',
      'para que me recomendara cosas nuevas a mi gusto.',
      'Los tenía en Google Keep, escritos a mano:',
      'top uno, top dos, top tres.',
      'Y si algo cambiaba de puesto, pues, a cortar y pegar.',
    ],
  },
  {
    key: 'topper.solution',
    where: 'Topper · la idea',
    lines: [
      'También quería ver los tops de otros.',
      'Mi hermano me pasaba su top de juegos por WhatsApp,',
      'todo escrito, y a veces no sabía cuál era cuál,',
      'pero con la portada lo reconocía al instante.',
      'Y de ahí sale Topper: tus tops, con imágenes,',
      'fáciles de reordenar y de compartir.',
      'Y no solo de películas, o sea, el top de lo que quieras.',
    ],
  },
  {
    key: 'topper.s1.p1',
    where: 'Topper · Home',
    shot: shot('topper', 'ios-dark-home'),
    lines: [
      'Al abrir la app ves tus tops',
      'y los de la gente que sigues,',
      'para recordar de un vistazo qué hay en cada uno.',
    ],
  },
  {
    key: 'topper.s1.p2',
    where: 'Topper · Home',
    shot: shot('topper', 'ios-dark-home'),
    lines: [
      'Topper es social: tu usuario es público,',
      'como si fuera un Instagram de tops.',
      'Por eso Ajustes aquí tiene más:',
      'tu usuario, tu cuenta y tu privacidad.',
    ],
  },
  {
    key: 'topper.s2.p1',
    where: 'Topper · Explore',
    shot: shot('topper', 'ios-dark-explore'),
    lines: [
      'En Explorar conoces gente nueva y ves sus tops.',
      'Buscas por nombre, por usuario,',
      'por el nombre de un top o de lo que tiene dentro.',
    ],
  },
  {
    key: 'topper.s2.p2',
    where: 'Topper · Explore',
    shot: shot('topper', 'ios-dark-explore'),
    lines: [
      'Fíjate en la cuadrícula, es lo que más me gusta.',
      'Cada tarjeta se arma según lo que tiene el top:',
      'uno, dos o tres elementos, cada uno con sus variantes.',
      'Me inspiré en Instagram,',
      'que mezcla piezas grandes y pequeñas.',
    ],
  },
  {
    key: 'topper.s3.p1',
    where: 'Topper · Top',
    shot: shot('topper', 'ios-dark-top-detail'),
    lines: [
      'Esta es la pantalla más importante: tu top.',
      'Agregas, eliminas y reordenas arrastrando,',
      'sin volver a escribir los números a mano.',
    ],
  },
  {
    key: 'topper.s3.p2',
    where: 'Topper · Top',
    shot: shot('topper', 'ios-dark-top-detail'),
    lines: [
      'Los demás pueden votar tu top y comentarlo;',
      'tú no puedes votar el tuyo, obvio.',
      'Y un easter egg: lo exportas como texto,',
      'con el mismo formato que tenía en Google Keep,',
      'para mandarlo por WhatsApp a quien no usa Topper.',
    ],
  },
  {
    key: 'topper.s4.p1',
    where: 'Topper · Profile',
    shot: shot('topper', 'ios-dark-profile'),
    lines: [
      'En tu perfil están todos tus tops,',
      'la gente que te sigue y la que sigues.',
    ],
  },
  {
    key: 'topper.s4.p2',
    where: 'Topper · Profile',
    shot: shot('topper', 'ios-dark-profile'),
    lines: [
      'Y los trofeos, que están en todas mis apps:',
      'tipo PlayStation, hasta llegar al platino.',
    ],
  },

  // Booker
  {
    key: 'booker.problem',
    where: 'Booker · el problema',
    lines: [
      'Yo leo en Kindle y resalto mucho.',
      'Porque a veces, entre diez páginas aburridas,',
      'aparece un párrafo que vale la pena recordar.',
      'Al terminar, releo el libro más ligero',
      'y quito los resaltados que ya no me dicen tanto.',
      'Pero releerlos en Kindle es muy incómodo,',
      'así que los pasaba a PDF y los guardaba en mi Drive.',
    ],
  },
  {
    key: 'booker.solution',
    where: 'Booker · la idea',
    lines: [
      'Hasta que dije: mira, ya hice Sound Shaper y Topper,',
      'sobre un monorepo con componentes compartidos.',
      'Con esa base, Booker en iOS me tomó unas seis horas.',
      'Una app nativa para leer mis resaltados',
      'y mis resúmenes, como en un Kindle,',
      'pero hecha solo para eso.',
    ],
  },
  {
    key: 'booker.s1.p1',
    where: 'Booker · Library',
    shot: shot('booker', 'ios-dark-home'),
    lines: [
      'Ojo, Booker no es para subir libros completos:',
      'es para lo que te quedó de cada uno.',
      'Esta es tu estantería, con las portadas',
      'como las de Kindle.',
    ],
  },
  {
    key: 'booker.s1.p2',
    where: 'Booker · Library',
    shot: shot('booker', 'ios-dark-home'),
    lines: [
      'Para agregar un libro le pones su portada,',
      'su nombre y sus géneros, pues, para que quede fino.',
    ],
  },
  {
    key: 'booker.s2.p1',
    where: 'Booker · Book',
    shot: shot('booker', 'ios-dark-book'),
    lines: [
      'Cada libro tiene su página,',
      'y antes de los resaltados va un resumen:',
      'los puntos clave, por si se te olvidó de qué trataba.',
      'Lo escribes tú, o lo generas con IA.',
    ],
  },
  {
    key: 'booker.s2.p2',
    where: 'Booker · Book',
    shot: shot('booker', 'ios-dark-book'),
    lines: [
      'Y desde aquí lo exportas en PDF:',
      'en modo oscuro para ti,',
      'o en modo claro para mandárselo a alguien,',
      'sin rehacer el PDF a mano.',
    ],
  },
  {
    key: 'booker.s3.p1',
    where: 'Booker · Reader',
    shot: shot('booker', 'ios-dark-reader'),
    lines: [
      'El lector se parece al de Kindle:',
      'cambias el tamaño de la letra y el tema de la página.',
    ],
  },
  {
    key: 'booker.s3.p2',
    where: 'Booker · Reader',
    shot: shot('booker', 'ios-dark-reader'),
    lines: [
      'Y cómo pasas de página:',
      'doblándola como un libro, deslizándola o con scroll.',
    ],
  },
  {
    key: 'booker.s4.p1',
    where: 'Booker · Chapter',
    shot: shot('booker', 'ios-dark-chapter'),
    lines: [
      'Los capítulos los armas tú:',
      'los del autor, o solo principio, medio y final.',
    ],
  },
  {
    key: 'booker.s4.p2',
    where: 'Booker · Chapter',
    shot: shot('booker', 'ios-dark-chapter'),
    lines: [
      'Y dentro de cada uno, tus resaltados',
      'en el orden que quieras,',
      'o tus propias notas, como una libreta.',
    ],
  },

  // More Work
  {
    key: 'work.salvalo.body',
    where: 'Más proyectos · Salvalo',
    lines: [
      'Salvalo es mi startup.',
      'Los comercios de tu zona publican packs',
      'con productos del día a precio de cierre;',
      'tú lo reservas en la app y lo retiras en tienda.',
      'Hice la interfaz de la app, la landing y los paneles,',
      'y salgo a visitar comercios para el piloto',
      'en Barquisimeto.',
    ],
  },
  {
    key: 'work.crol.body',
    where: 'Más proyectos · Crol ERP Móvil',
    lines: [
      'Desde 2022 trabajo en Crol,',
      'un ERP en la nube para empresas en México.',
      'Empecé en Conto Pay, una versión más simple de Crol,',
      'con su web, su landing y su app móvil.',
      'Esa app fue la base de Crol ERP Móvil,',
      'que construí desde cero, diseño incluido,',
      'para usar Crol cómodo desde el teléfono.',
    ],
  },
  {
    key: 'arcade.p1',
    where: 'Más proyectos · Space Explorer',
    lines: [
      'Space Explorer empezó como un easter egg para mis apps,',
      'como el de Android, ¿verdad?',
      'Tocas varias veces la versión y aparece un juego.',
      'Iba a tener tres niveles, uno por app:',
      'el mar, el espacio y una guerra espacial.',
      'Al final lo quité para no complicar las apps.',
      'Y meses después llegó el reto arcade de Platanus Hack,',
      'y como ya tenía la idea, dije: listo, lo hago.',
      'Un shooter en 3D que cabe en 50 KB.',
    ],
  },
  {
    key: 'work.maktub.body',
    where: 'Más proyectos · Maktub Art Fund',
    lines: [
      'Maktub Art Fund es un cliente de México',
      'que conocí gracias a Crol.',
      'Era una landing, y las landings así de simples',
      'casi nunca me llaman la atención,',
      'pero el diseño de esta me gustó, y dije: va, la hago.',
    ],
  },
  {
    key: 'work.andreina.body',
    where: 'Más proyectos · Andreina Aular',
    lines: [
      'La página de Andreina Aular fue la primera que hice,',
      'al terminar mis primeros cursos de Udemy.',
      'La diseñé yo en Figma, la publiqué,',
      'le hice actualizaciones',
      'y después la rehicimos completa en WordPress.',
    ],
  },

  // Events
  {
    key: 'events.radio.body',
    where: 'Eventos · Entrevista en OK 101.5',
    lines: [
      'La primera entrevista de Salvalo fue en la radio,',
      'en el programa de Cheo Noguera en OK 101.5.',
      'Yo fui al estudio y mi cofundador',
      'se conectó desde Madrid.',
      'Lo expliqué con una panadería:',
      'hace diez cachitos, a las cuatro le quedan tres,',
      'y arma un pack con esos tres y dos panes.',
      'En el live preguntaron cómo descargarla,',
      'y Cheo la descargó ahí mismo, al aire.',
    ],
  },
  {
    key: 'events.ilc.body',
    where: 'Eventos · Charla con Pedro Vallenilla',
    lines: [
      'En la hackathon vi a Pedro Vallenilla,',
      'fundador de Cashea, a través de una pantalla.',
      'Meses después vino a Barquisimeto',
      'a una charla con el padre Elías Sayegh,',
      'y quedamos en la segunda fila del teatro.',
      'Contó cómo fallaron varias de sus startups,',
      'con familia y endeudado, y aun así siguió.',
      'Y me quedé con cómo habla de Venezuela:',
      'aquí queda muchísimo por construir.',
    ],
  },
  {
    key: 'events.alegria.body',
    where: 'Eventos · Hackathon de AlegrIA',
    lines: [
      'Pastor estudió conmigo primaria y secundaria.',
      'Un día me escribe: mira, Juan, estoy con Ale y César',
      'en una hackathon, y nos falta uno.',
      'El Juan de antes habría dicho que no, por pena.',
      'Esta vez pensé: lo peor que puede pasar',
      'es que no nos acepten.',
      'Armamos Tripealo, un marketplace',
      'de experiencias de viaje en Venezuela.',
      'De mil personas, quedamos entre las cien',
      'que fueron a las oficinas de Yummy en Caracas.',
      'No ganamos, pero escuché a fundadores',
      'que hoy compiten en Silicon Valley,',
      'y salí con el impulso para seguir.',
      'Hoy Tripealo y Salvalo están operando,',
      'y yo estoy de lleno con Salvalo, en modo founder.',
    ],
  },

  // Footer
  {
    key: 'footer',
    where: 'Despedida',
    lines: [
      'Bueno, gracias por llegar hasta aquí.',
      'Si algo de esto te dio curiosidad,',
      'escríbeme por LinkedIn o por Instagram.',
      'Yo sigo construyendo,',
      'y sigo yendo por el platino.',
    ],
  },
];
