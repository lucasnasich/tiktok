/** Menú de ejecución formato × cámara para preparar SlotSpec con Gemini.
 * Los ejemplos describen el MECANISMO del formato, no un demo de producto.
 * Adaptar al pilar del slot; no copiar literal. */

const CAMERAS = new Set(["off-camera", "on-camera", "needs-guest"]);

function pack(structural, visual) {
  return { structural, visual };
}

const EXAMPLES = {
  "x-razones": {
    mechanism:
      "Lista numerada: el hook promete N razones y cada beat suma un argumento escaneable.",
    avoid:
      "No convertir la lista en un walkthrough de interfaz ni en un pitch de features.",
    "off-camera": pack(
      [
        "Hook con número + N placas que avanzan una razón por corte.",
        "Carrusel o motion tipográfico: cada razón entra, se lee, sale.",
        "Voz en off enumerando mientras el número grande cambia en pantalla.",
      ],
      [
        "Tipografía grande con contador 1/N, sin talking head.",
        "Animación tipo Remotion: número, título corto, ícono o sticker.",
        "Carrusel de placas limpias, una razón por slide.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador anuncia N razones y las cuenta a cámara, una por beat.",
        "Hook a cámara + cortes a placas numeradas que refuerzan cada punto.",
      ],
      [
        "Talking head con lower-third numerado.",
        "Presentador + insertos de texto grande al ritmo de cada razón.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado lista N razones desde su experiencia; el host solo encuadra.",
        "Host lanza el número; el invitado entrega cada razón.",
      ],
      [
        "Entrevista corta con placas numeradas superpuestas.",
        "Split: invitado a cámara + lista que se va tildando.",
      ],
    ),
  },
  "historia-instagram": {
    mechanism:
      "Pieza nativa de story: texto corto, sticker o CTA, vive 24 h, micro-compromiso.",
    avoid: "No armar un reel de feed disfrazado de story.",
    "off-camera": pack(
      [
        "Una pantalla, un sticker, un pedido mínimo (pregunta, poll, link).",
        "Repurpose de un slide con CTA de story, no narrativa larga.",
      ],
      [
        "Frame 9:16 tipo story: tipografía nativa, sticker, poco texto.",
        "Fondo plano o recorte de un slide, UI de Instagram story.",
      ],
    ),
    "on-camera": pack(
      [
        "Cara a cámara 3–5 s + sticker de pregunta.",
        "Saludo corto y un CTA de story, sin desarrollo largo.",
      ],
      [
        "Selfie story con texto nativo y sticker.",
        "Presentador en el tercio inferior, sticker arriba.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado responde un sticker o deja un saludo de 5 s.",
        "Repost de story del invitado con overlay de la cuenta.",
      ],
      [
        "Story colaborativa: cara del invitado + sticker de la marca.",
      ],
    ),
  },
  "nosotros-vs-ellos": {
    mechanism:
      "Contraste en dos columnas: tu enfoque vs. la alternativa obvia, sin pitch largo.",
    avoid:
      "No nombrar competidores reales ni convertirlo en tabla de features del producto.",
    "off-camera": pack(
      [
        "Split problema de un lado, método del otro; un giro al final.",
        "Dos caminos visuales que se eligen: caos vs. orden, no marca vs. marca.",
      ],
      [
        "Dos columnas tipográficas o dos layouts lado a lado.",
        "Motion: el lado viejo se apaga, el nuevo queda encendido.",
        "Placas espejo con paleta opuesta, sin UI de producto.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador señala izquierda/derecha o usa un objeto para el contraste.",
        "A cámara: “esto vs. esto”, y corta a dos placas.",
      ],
      [
        "Talking head centrado con dos labels a los costados.",
        "Presentador + green-screen de las dos columnas detrás.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado cuenta cómo era “ellos” (su método viejo) vs. cómo opera ahora.",
        "Host plantea el contraste; el invitado elige un lado con anécdota.",
      ],
      [
        "Entrevista con gráfico de dos columnas superpuesto.",
        "Invitado a un lado, placa de contraste al otro.",
      ],
    ),
  },
  "diagrama-venn": {
    mechanism:
      "Dos mundos que se cruzan; el centro es el sweet spot de la propuesta.",
    avoid: "No usar el Venn para listar módulos del software.",
    "off-camera": pack(
      [
        "Tres beats: círculo A, círculo B, intersección como payoff.",
        "Pregunta “¿hay que elegir?” y el cruce responde que no.",
      ],
      [
        "Diagrama animado (Remotion/motion): dos círculos que se solapan.",
        "Infografía limpia, labels cortos, centro destacado.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador dibuja o señala el Venn mientras nombra los dos mundos.",
        "A cámara plantea la falsa dicotomía; corta al diagrama.",
      ],
      [
        "Talking head + Venn animado de fondo o al costado.",
        "Pizarra o tablet con el diagrama a mano.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado ubica su negocio en el cruce: no tuvo que elegir A o B.",
        "Host dibuja; invitado nombra qué hay en cada círculo.",
      ],
      [
        "Invitado + Venn superpuesto que se completa al hablar.",
      ],
    ),
  },
  "no-compres-esto": {
    mechanism:
      "Hook negativo que filtra (“no hagas X hasta…”) y gira a criterio.",
    avoid: "No sonar a scam ni a descuento; el giro tiene que ser criterio, no pitch.",
    "off-camera": pack(
      [
        "Apertura de rechazo + tres condiciones + giro de autoridad.",
        "Filtro de audiencia: “si todavía no ordenaste Y, no hagas X”.",
      ],
      [
        "Tipografía de advertencia, una frase por corte.",
        "Motion de “NO” que se tacha y deja el criterio.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador mira a cámara y suelta el no; después el giro.",
        "Hook negativo a cámara + placas con las condiciones.",
      ],
      [
        "Cara seria a cámara, texto de rechazo overlay.",
        "Presentador + cartel de “no compres / no hagas” en mano o overlay.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado cuenta qué no volvería a comprar/hacer y por qué.",
        "Host lanza el no; el invitado pone la condición real.",
      ],
      [
        "Invitado a cámara con el hook negativo como lower-third.",
      ],
    ),
  },
  "nota-iphone": {
    mechanism:
      "Recreación de Notas: texto confesional o lista corta, se siente pensamiento privado.",
    avoid: "No disfrazar un brochure; si se siente fake, no sirve.",
    "off-camera": pack(
      [
        "Una nota que se escribe en vivo: título, 3–6 líneas, cierre.",
        "Lista en notas que se va tildando o tachando.",
      ],
      [
        "UI de Notas (fondo amarillo, San Francisco), teclado opcional.",
        "Screen recording o recreación motion de la app Notas.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador lee o escribe la nota en voz alta, como si pensara.",
        "Over-shoulder: mira el teléfono y comenta una línea.",
      ],
      [
        "Insert del teléfono en Notas + cara reaccionando.",
        "Presentador con el note UI ocupando la mayor parte del frame.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado dicta una nota con lo que aprendió; se ve escribirse.",
        "Nota “enviada” por el invitado que el host abre en cámara.",
      ],
      [
        "UI de Notas + cameo del invitado en un corner.",
      ],
    ),
  },
  "captura-chat": {
    mechanism:
      "Conversación que dramatiza el dolor u objeción; escena, no bullets.",
    avoid:
      "No usar el chat para mostrar el producto; el chat es el conflicto.",
    "off-camera": pack(
      [
        "Hilo de 4–8 burbujas: tensión, malentendido, corte en el climax.",
        "Dos chats en paralelo: el caótico vs. el que sí se resuelve.",
      ],
      [
        "Recreación de WhatsApp/DM, burbujas que aparecen con timing.",
        "Motion tipo iMessage, sin caras, solo UI de chat.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador reacciona al chat que se ve en pantalla.",
        "Lee el hilo en voz alta y marca el momento en que se rompe.",
      ],
      [
        "Green screen o overlay del chat detrás del presentador.",
        "Split: cara + captura de conversación.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado recrea un chat real (anonimizado) de su negocio.",
        "Host y invitado leen el hilo a dos voces.",
      ],
      [
        "Invitado + chat superpuesto; nombres tapados.",
      ],
    ),
  },
  pizarra: {
    mechanism:
      "Explicación a mano alzada, paso a paso, autoridad pedagógica.",
    avoid: "No reemplazar la pizarra por un tour de la app.",
    "off-camera": pack(
      [
        "Diagrama que se dibuja en tiempo real: cajas, flechas, un flujo.",
        "Tres pasos en pizarra digital, un concepto por beat.",
      ],
      [
        "Whiteboard digital o animación de trazo (Remotion/handwriting).",
        "Fondo negro o pizarra, tiza/marker, sin UI de producto.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador explica en pizarra física o tablet.",
        "A cámara introduce el mapa y se da vuelta a dibujar.",
      ],
      [
        "Plano medio con pizarra atrás, trazos legibles.",
        "Over-shoulder del dibujo + cortes al presentador.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado dibuja cómo le funciona el día a día; host anota.",
        "Dos personas en pizarra: problema vs. flujo ordenado.",
      ],
      [
        "Dos cuerpos frente a pizarra, foco en el diagrama.",
      ],
    ),
  },
  "cupos-limitados": {
    mechanism:
      "Escasez de cupos/plazas reales, no stock de producto.",
    avoid: "No inventar urgencia ni hablar de unidades de catálogo.",
    "off-camera": pack(
      [
        "Placa de cupos + condición + cierre de acción si el cupo es real.",
        "Contador o “quedan N lugares” como único gancho.",
      ],
      [
        "Ticket, pass o placa de escasez tipográfica.",
        "Motion de asientos/cupos que se van ocupando.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador anuncia el cupo y la condición, sin dramatizar de más.",
        "A cámara + placa de “quedan N”.",
      ],
      [
        "Talking head con contador overlay.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado que ya ocupó un cupo cuenta por qué importaba el límite.",
      ],
      [
        "Invitado + badge de “cupo” o entrada.",
      ],
    ),
  },
  "pedimos-disculpas": {
    mechanism:
      "Apertura contrarian tipo disculpa irónica que gira a una postura.",
    avoid: "No disculparse de verdad por el producto; el giro tiene que enseñar.",
    "off-camera": pack(
      [
        "“Pedimos disculpas por…” + giro educativo en 3 beats.",
        "Comunicado falso que se corrige a sí mismo.",
      ],
      [
        "Placa institucional que se rompe con humor controlado.",
        "Tipografía de comunicado + un tachado o sticker.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador suelta la disculpa a cámara y hace el giro.",
        "Tono serio → sonrisa al dar el criterio.",
      ],
      [
        "Talking head estilo vocero, overlay de “comunicado”.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado “se disculpa” por haber operado mal; host cierra el giro.",
      ],
      [
        "Invitado a cámara con look de comunicado, no de sketch.",
      ],
    ),
  },
  "testimonio-cliente": {
    mechanism:
      "Prueba social: voz, quote, reseña o resultado narrado por quien usa o se parece al cliente. Credibilidad de par, no de vendedor.",
    avoid:
      "No convertir esto en demo de producto, capturas de backoffice ni tour de IA/catálogo. El protagonista es la evidencia del cliente.",
    "off-camera": pack(
      [
        "Arco testimonial: quién es + qué le pasaba + qué cambió, en quotes.",
        "Compilado de opiniones cortas que se apilan hasta un payoff.",
        "Antes/después operativo contado con palabras del cliente, no con UI.",
      ],
      [
        "Layout de reseña: quote grande, nombre/rubro, estrellas.",
        "Motion/Remotion: tarjetas de testimonio que entran, 5 estrellas, avatar o inicial.",
        "Captura de review real (Google, landing, chat) recortada y tipografiada, no la app.",
        "Carrusel de quotes + rating; B-roll genérico de comercio, nunca un walkthrough.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador lee o encuadra un testimonio y le da contexto, sin demo.",
        "Host presenta al cliente y cede; si no hay invitado, cita en overlay.",
      ],
      [
        "Talking head + quote card / estrellas al costado.",
        "Presentador sostiene teléfono con la reseña, no el panel del producto.",
      ],
    ),
    "needs-guest": pack(
      [
        "El cliente habla: problema, uso cotidiano, resultado; host casi no interrumpe.",
        "Mini entrevista: 3 preguntas, la última es el payoff.",
      ],
      [
        "Cliente a cámara, nombre y rubro en lower-third.",
        "Plano del invitado + quote destacado de lo que acaba de decir.",
      ],
    ),
  },
  "lo-nuevo-vs-lo-viejo": {
    mechanism:
      "Contraste temporal: método viejo vs. método nuevo, con empatía.",
    avoid: "No ridiculizar al que sigue en lo viejo ni hacer un feature dump de lo nuevo.",
    "off-camera": pack(
      [
        "Izquierda “antes”, derecha “ahora”; un beat de reconocimiento.",
        "Secuencia: gesto viejo → corte → gesto nuevo, mismo oficio.",
      ],
      [
        "Split screen o wipe temporal, tipografía de época vs. limpia.",
        "Motion de una planilla/papel que se transforma en un flujo abstracto, no en un tour.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador actúa el método viejo y corta al nuevo.",
        "A cámara: “yo también hice esto” + contraste.",
      ],
      [
        "Un mismo presentador, dos looks o dos lados del frame.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado cuenta su versión vieja y su versión nueva, en ese orden.",
      ],
      [
        "Invitado + placas Antes / Ahora detrás.",
      ],
    ),
  },
  "ultima-hora": {
    mechanism:
      "Apertura tipo breaking: urgencia editorial con sustancia detrás.",
    avoid: "No inventar noticias ni usar breaking para un feature menor.",
    "off-camera": pack(
      [
        "Titular urgente + 2 hechos + cierre de por qué importa al oficio.",
        "Alerta que se des mentira a sí misma y deja el dato real.",
      ],
      [
        "Placa breaking news, lower-third, ticker.",
        "Motion de noticiero, sin presentador.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador en modo vocero: titular, contexto, cierre.",
      ],
      [
        "Talking head con gráfico de noticias detrás.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado “testigo” del cambio; host pone el titular.",
      ],
      [
        "Invitado en set de noticia, nombre en placa.",
      ],
    ),
  },
  transformacion: {
    mechanism:
      "Antes → después visible, emocional y operativo, no lista de features.",
    avoid: "No mostrar solo pantallas del producto como si eso fuera la transformación.",
    "off-camera": pack(
      [
        "Caos → orden en 4 beats, payoff en el último corte.",
        "Un objeto o escena que muta: mesa, chat, caja, no un dashboard tour.",
      ],
      [
        "Morph, split antes/después, motion de desorden a grilla.",
        "Fotograma sucio vs. layout limpio, tipografía de resultado.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador en el “antes” y reaparece en el “después”.",
        "Narra la transformación mientras el fondo cambia.",
      ],
      [
        "Cambio de vestuario/set o de iluminación como metáfora.",
      ],
    ),
    "needs-guest": pack(
      [
        "Cliente muestra su antes y su después con una anécdota.",
      ],
      [
        "Invitado + foto/placa de su operación vieja vs. actual (sin UI confidencial).",
      ],
    ),
  },
  "estilo-reddit": {
    mechanism:
      "Post de foro: título, votos, comentarios que cuentan la historia.",
    avoid: "En cuenta oficial, no forzar slang; el mecanismo es el hilo, no el meme.",
    "off-camera": pack(
      [
        "Título del post + 3 comentarios que avanzan el relato.",
        "OP pregunta, el thread responde, un comment es el payoff.",
      ],
      [
        "UI de Reddit/foro recreada, upvotes, threads anidados.",
        "Scroll animado del post, sin cara.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador lee el post y reacciona a los comments.",
      ],
      [
        "Green screen del thread detrás del presentador.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado es el OP: cuenta el post como si lo hubiera escrito.",
      ],
      [
        "Invitado + UI de foro al costado.",
      ],
    ),
  },
  "en-caso-de-emergencia": {
    mechanism:
      "Pattern interrupt de emergencia: el mensaje merece pausa.",
    avoid: "No usarlo para un tip menor; si no hay riesgo operativo, no es este formato.",
    "off-camera": pack(
      [
        "Romper vidrio → mensaje crítico → una acción concreta.",
        "Alarma, pausa, instrucción.",
      ],
      [
        "Placa de emergencia, vidrio, sello rompable, tipografía de alerta.",
        "Motion de alarma, sin persona.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador en tono de alerta breve, después la instrucción.",
      ],
      [
        "Cara a cámara con overlay de emergencia.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado relata el momento de crisis operativa; host cierra la instrucción.",
      ],
      [
        "Invitado + sello de emergencia.",
      ],
    ),
  },
  "busqueda-google": {
    mechanism:
      "Query + resultados que validan que el dolor ya está en la cabeza de la audiencia.",
    avoid: "No usar Google para buscar el producto; la query es el dolor.",
    "off-camera": pack(
      [
        "Se escribe la query, aparecen resultados, uno se destaca.",
        "Autocomplete que completa el dolor; el resultado es el criterio.",
      ],
      [
        "UI de buscador, teclado, resultados en lista.",
        "Motion de typing + SERP, sin cara.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador dice lo que la gente googla y muestra la query.",
      ],
      [
        "Talking head + barra de Google overlay.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado dice qué googlearía a las 11 de la noche; aparece la query.",
      ],
      [
        "Invitado + SERP al lado.",
      ],
    ),
  },
  "problema-vs-solucion": {
    mechanism:
      "Split claro: dolor / salida. Nombrar tensión y alivio, sin magia.",
    avoid: "La solución no es un recorte de toda la plataforma; es el alivio del formato.",
    "off-camera": pack(
      [
        "Arriba problema, abajo solución, un corte seco.",
        "Dos beats y un payoff de “así se siente el alivio”.",
      ],
      [
        "Split horizontal o dos placas, paletas opuestas.",
        "Motion: el problema se comprime, la solución ocupa el frame.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador nombra el problema a un lado y gira al otro para la salida.",
      ],
      [
        "Cuerpo que se corre de un label al otro, o dos tomas.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado pone el problema; host o el mismo invitado nombra la salida.",
      ],
      [
        "Invitado bajo el label Problema, después Solución.",
      ],
    ),
  },
  "efecto-secundario": {
    mechanism:
      "Parodia de prospecto: “efectos” positivos o irónicos.",
    avoid: "En cuenta oficial, humor controlado; no farmacia fake ni claims médicos.",
    "off-camera": pack(
      [
        "Prospecto: indicaciones, efectos, precaución, en 4 beats.",
        "Lista de efectos secundarios que son beneficios del oficio.",
      ],
      [
        "Layout de receta/prospecto, tipografía densa, iconos de píldora.",
        "Motion de bula que se scrollea.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador lee el prospecto como locutor de farmacia.",
      ],
      [
        "Vocero + caja o overlay de medicamento paródico.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado “relata los efectos” que le pasaron al ordenar el negocio.",
      ],
      [
        "Invitado estilo testimonio de anuncio, con disclaimer irónico.",
      ],
    ),
  },
  "oferta-combo": {
    mechanism:
      "Valor como menú/bundle: todo lo que incluye, tangible.",
    avoid: "No listar roadmap ni features no live; no es una tabla de pricing.",
    "off-camera": pack(
      [
        "Menú de 4–6 ítems de valor, un cierre de “esto viene junto”.",
        "Combo que se arma plato por plato.",
      ],
      [
        "Menú, ticket, bandeja, layout de combo.",
        "Motion de ítems que caen en una bandeja, no screenshots de settings.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador “anuncia el combo” como mozo o locutor.",
      ],
      [
        "Talking head + menú overlay.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado elige qué parte del combo le cambió el día a día.",
      ],
      [
        "Invitado señalando ítems del menú.",
      ],
    ),
  },
  "titular-con-dato": {
    mechanism:
      "Un número grande ancla; el resto justifica por qué importa.",
    avoid: "No inventar métricas; si no hay dato en el Brain, no lo fabriques.",
    "off-camera": pack(
      [
        "Número hero + una frase de contexto + implicancia para el oficio.",
        "El dato entra, se sostiene, se aclara la fuente o el matiz.",
      ],
      [
        "Tipografía enorme, un número, fondo limpio.",
        "Contador animado, sin cara.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador suelta el número a cámara y lo sostiene.",
      ],
      [
        "Cara + número overlay gigante.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado pone su número (horas, pedidos, caos) si es real y atribuible.",
      ],
      [
        "Invitado + dato como lower-third.",
      ],
    ),
  },
  garabato: {
    mechanism:
      "Trazos y flechas que dirigen la mirada sobre una imagen en segundos.",
    avoid:
      "El garabato señala un momento, no un tour completo del producto. Si hay captura, es un recorte, no el backoffice entero.",
    "off-camera": pack(
      [
        "Una imagen, tres trazos, un label; se acaba.",
        "Garabato que tacha lo que está mal y circula lo que importa.",
      ],
      [
        "Screenshot, foto o placa con doodle rojo/negro, timing rápido.",
        "Motion de trazo sobre una sola captura o still.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador señala con el dedo o con un iPad mientras garabatea overlay.",
      ],
      [
        "Cara en un corner + garabato a fullscreen.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado señala “acá se me perdía esto” sobre una imagen anonimizada.",
      ],
      [
        "Invitado + doodle sobre su ejemplo, datos tapados.",
      ],
    ),
  },
  "captura-email": {
    mechanism:
      "Inbox o mail como prueba de proceso, no de feature list.",
    avoid: "No usar un mail de marketing como si fuera evidencia de producto live inventada.",
    "off-camera": pack(
      [
        "Se abre un mail, se lee el asunto y 3 líneas, cierre.",
        "Inbox con un hilo que cuenta el hito.",
      ],
      [
        "UI de mail, asunto grande, preview.",
        "Motion de inbox, sin cara.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador lee el mail en voz alta.",
      ],
      [
        "Over-shoulder del inbox + cara.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado muestra (anonimizado) el mail que le cambió el flujo.",
      ],
      [
        "Invitado + captura de mail tapando datos.",
      ],
    ),
  },
  "no-seas-ese-que": {
    mechanism:
      "Call-out al comportamiento que la audiencia no quiere ser.",
    avoid: "No humillar; el respeto se mantiene, el error se nombra.",
    "off-camera": pack(
      [
        "Retrato del “ese que…” en 3 hábitos + salida de respeto.",
        "Lista de gestos reconocibles, payoff de “mejor así”.",
      ],
      [
        "Placas de call-out, stickers, siluetas, no doxxing.",
        "Motion de personaje genérico que comete el error.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador actúa el gesto y lo corta: “no seas ese”.",
      ],
      [
        "Talking head con tono directo, overlay del hábito.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado admite haber sido “ese” y cuenta el corte.",
      ],
      [
        "Invitado a cámara, tono de confesión corta.",
      ],
    ),
  },
  resenas: {
    mechanism:
      "Estrellas, quotes o screenshots de reviews como prueba social escaneable.",
    avoid: "Solo reseñas auténticas; no inventar scores ni clientes.",
    "off-camera": pack(
      [
        "Una reseña hero + 2 de apoyo, o un carrusel de ratings.",
        "Agregado de opiniones: el patrón se lee en 5 s.",
      ],
      [
        "Estrellas, cards de review, layout tipo Google/App Store.",
        "Remotion: 5 estrellas que se llenan, quote, nombre/rubro.",
        "Mosaico de reseñas, no capturas del producto.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador lee una reseña y la sostiene en pantalla.",
      ],
      [
        "Cara + card de review overlay.",
      ],
    ),
    "needs-guest": pack(
      [
        "El reseñador (cliente) está en cámara y confirma la quote.",
      ],
      [
        "Invitado + sus estrellas y quote.",
      ],
    ),
  },
  "texto-sobre-la-piel": {
    mechanism:
      "Pocas palabras, tipografía grande, textura humana o premium.",
    avoid: "No llenar de copy; si hay más de una frase, no es este formato.",
    "off-camera": pack(
      [
        "Una frase, un hold largo, fade.",
        "Manifiesto de 3–6 palabras, sin desarrollo.",
      ],
      [
        "Tipo sobre piel, tela, grano; o textura abstracta si no hay cuerpo.",
        "Motion sutil de tipografía sobre still.",
      ],
    ),
    "on-camera": pack(
      [
        "La frase aparece sobre el presentador; casi no habla, o dice solo eso.",
      ],
      [
        "Tipografía sobre hombro, cuello, cara parcial.",
      ],
    ),
    "needs-guest": pack(
      [
        "La frase se superpone al invitado; una sola línea suya.",
      ],
      [
        "Invitado + tipo over skin, plano íntimo y cuidado.",
      ],
    ),
  },
  "podcast-ia": {
    mechanism:
      "Diálogo de dos voces que baja un tema denso; ritmo de charla.",
    avoid: "No es un monólogo de producto; son dos voces, un tema.",
    "off-camera": pack(
      [
        "Pregunta / respuesta entre dos voces, 4–6 intercambios.",
        "Una objeción y una aclaración, como si fuera un corte de podcast.",
      ],
      [
        "Waveform, dos avatars o iniciales, VU meters, sin caras reales.",
        "Layout de podcast (mic icon, nombres, barras de audio).",
      ],
    ),
    "on-camera": pack(
      [
        "Dos personas o una que interpreta el diálogo frente a mics.",
      ],
      [
        "Set de podcast, dos planos, mics a la vista.",
      ],
    ),
    "needs-guest": pack(
      [
        "Host + invitado en formato entrevista de 45–60 s.",
      ],
      [
        "Dos mics, dos nombres, plano conversación.",
      ],
    ),
  },
  "tier-list": {
    mechanism:
      "Ranking S/A/B/C con criterio explícito; invita al debate.",
    avoid: "No rankear features del producto; rankear prácticas, errores o canales.",
    "off-camera": pack(
      [
        "Se revelan los tiers de peor a mejor, o al revés, con un criterio dicho.",
        "Un ítem polémico en B que pide comentario.",
      ],
      [
        "Grilla S/A/B/C, cards que caen en cada fila, motion tipo Smash.",
        "Layout de ranking, sin talking head.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador arma la lista en vivo y justifica un solo ítem.",
      ],
      [
        "Cara + board de tiers detrás o overlay.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado pelea un ranking; host sostiene el criterio.",
      ],
      [
        "Dos personas frente al board, ítems móviles.",
      ],
    ),
  },
  "cero-estrellas": {
    mechanism:
      "Review negativa irónica a la vieja forma de trabajar, no a un competidor nombrado.",
    avoid: "No fingir una review contra una marca real.",
    "off-camera": pack(
      [
        "Ficha de review 0★ al caos: título, 3 quejas, giro.",
        "La “app” reseñada es un hábito (Excel, mil chats), no un rival.",
      ],
      [
        "UI de review (estrellas vacías, texto de queja), layout de store.",
        "Motion de rating que se queda en cero.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador lee la review 0★ en tono de locutor ofendido.",
      ],
      [
        "Cara + card de 0 estrellas.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado “reseña” su método viejo con 0 estrellas.",
      ],
      [
        "Invitado + score 0 overlay.",
      ],
    ),
  },
  "green-screen": {
    mechanism:
      "Rostro + fondo dinámico (tweet, captura, dato). El humano ancla, el fondo evidencia.",
    avoid:
      "Sin cámara no hay presentador: no fuerces talking head. El fondo puede vivir solo con voz en off.",
    "off-camera": pack(
      [
        "El “fondo” es la pieza: captura o dato que se comenta en voz en off, sin cara.",
        "Montaje del material de detrás (tweet, gráfica) con timing de locución.",
      ],
      [
        "Pantalla completa del material, ken burns, overlays; sin presentador.",
        "Motion del documento/captura como si fuera green screen vacío.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador comenta lo que pasa detrás: un beat, un señalamiento, un cierre.",
      ],
      [
        "Talking head recortado sobre tweet, dashboard o placa, producción cuidada.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado reacciona al fondo (su chat, su reseña, su dato).",
      ],
      [
        "Invitado en green screen sobre su evidencia, datos sensibles tapados.",
      ],
    ),
  },
  "x-senales": {
    mechanism:
      "Red flags: el espectador se autoevalúa con una lista específica.",
    avoid: "Cada señal tiene que ser concreta; no “señales de que necesitás Mercantis”.",
    "off-camera": pack(
      [
        "Hook con N señales + cada una es un síntoma del oficio.",
        "Checklist que se va marcando; al final “si te sonó más de una”.",
      ],
      [
        "Lista con iconos de alerta, numeración, motion de check.",
        "Placas de red flag, una por corte.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador cuenta las señales con los dedos o con placas.",
      ],
      [
        "Talking head + ticks de alerta overlay.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado reconoce cuáles le aplicaban.",
      ],
      [
        "Invitado + lista que se tilda según habla.",
      ],
    ),
  },
  "mito-vs-realidad": {
    mechanism:
      "Creencia común vs. corrección; dos columnas o dos slides.",
    avoid: "El mito tiene que ser uno que la audiencia cree; no un strawman.",
    "off-camera": pack(
      [
        "Mito en un beat, realidad en el siguiente, un matiz al final.",
        "Tres mitos rápidos, el último es el más doloroso.",
      ],
      [
        "Dos columnas, sello MITO/REALIDAD, paletas opuestas.",
        "Motion de tarjeta que se da vuelta.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador enuncia el mito y lo corta con la realidad.",
      ],
      [
        "Cara + labels Mito / Realidad a los costados.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado cuenta el mito que creía; host o él mismo da la realidad.",
      ],
      [
        "Invitado bajo Mito, después Realidad.",
      ],
    ),
  },
  "problemas-tachados": {
    mechanism:
      "Lista de dolores que se tachan al resolverse; ritmo de alivio.",
    avoid: "No tachar features; tachar fricciones del día a día.",
    "off-camera": pack(
      [
        "Lista de 4–6 fricciones; cada una se tacha en un corte.",
        "Un dolor queda sin tachar a propósito y se resuelve al final.",
      ],
      [
        "Checklist con strikethrough animado.",
        "Tipografía de lista, trazo que tacha, sin UI de app.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador nombra el dolor y lo tacha en un pizarrón o overlay.",
      ],
      [
        "Cara + lista que se tacha al hablar.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado dice lo que ya no sufre; se tacha en vivo.",
      ],
      [
        "Invitado + checklist a su lado.",
      ],
    ),
  },
  "lo-que-podes-evitar": {
    mechanism:
      "Beneficio por alivio: lo que dejás de sufrir, no lo que “ganás”.",
    avoid: "No convertirlo en lista de módulos del producto.",
    "off-camera": pack(
      [
        "3–5 evitaciónes concretas del oficio, payoff emocional corto.",
        "“Evitá X” como estribillo, cada X es una escena.",
      ],
      [
        "Placas de evitación, iconos de “no más”, motion simple.",
        "Escenas o stills de fricción que se cruzan con un NO.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador lista lo que se puede dejar de hacer, a cámara.",
      ],
      [
        "Talking head + overlay de cada evitación.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado nombra qué evitó de verdad en su semana.",
      ],
      [
        "Invitado a cámara, lista de alivios.",
      ],
    ),
  },
  advertencia: {
    mechanism:
      "Placa WARNING con sustancia: error común o riesgo, no clickbait vacío.",
    avoid: "Si abusás de la alerta, pierde fuerza; un riesgo por pieza.",
    "off-camera": pack(
      [
        "Sello de advertencia + el riesgo + qué no hacer.",
        "Alerta, ejemplo, cierre de cuidado.",
      ],
      [
        "Placa amarilla/negra, stripes, tipografía de warning.",
        "Motion de alerta, sin cara.",
      ],
    ),
    "on-camera": pack(
      [
        "Presentador en tono de alerta breve, después el contenido.",
      ],
      [
        "Cara + overlay WARNING.",
      ],
    ),
    "needs-guest": pack(
      [
        "Invitado cuenta el riesgo que le pasó; la placa lo encuadra.",
      ],
      [
        "Invitado + sello de advertencia.",
      ],
    ),
  },
};

const FALLBACK = {
  mechanism:
    "El formato asignado define el mecanismo creativo. Los briefs tienen que sonar a ESE formato.",
  avoid:
    "No reemplazar el formato por un demo de producto, capturas de backoffice ni tour de features.",
  "off-camera": pack(
    [
      "Estructura del formato en placas, motion o layout, sin nadie a cámara.",
    ],
    [
      "Tipografía, motion (incluida animación tipo Remotion), stills o UI del formato — no un walkthrough de producto salvo que el formato lo pida.",
    ],
  ),
  "on-camera": pack(
    [
      "Presentador sostiene el mecanismo del formato a cámara.",
    ],
    [
      "Talking head + overlays propios del formato.",
    ],
  ),
  "needs-guest": pack(
    [
      "Invitado aporta la evidencia o la anécdota; el formato no cambia.",
    ],
    [
      "Invitado a cámara con los gráficos del formato.",
    ],
  ),
};

export function normalizeCameraPresence(value) {
  if (CAMERAS.has(value)) return value;
  return "off-camera";
}

export function getFormatProductionExamples(formatId, cameraPresence) {
  const entry = EXAMPLES[String(formatId || "").trim()] || FALLBACK;
  const camera = normalizeCameraPresence(cameraPresence);
  const packForCamera = entry[camera] || FALLBACK[camera];
  return {
    formatId: String(formatId || "").trim() || "unknown",
    camera,
    mechanism: entry.mechanism || FALLBACK.mechanism,
    avoid: entry.avoid || FALLBACK.avoid,
    structural: packForCamera.structural,
    visual: packForCamera.visual,
  };
}

export function buildFormatProductionPromptSection({
  formatId,
  formatLabel,
  formatSummary,
  cameraPresence,
  cameraPresenceLabel,
}) {
  const examples = getFormatProductionExamples(formatId, cameraPresence);
  const cameraLabel =
    cameraPresenceLabel ||
    (examples.camera === "on-camera"
      ? "En cámara"
      : examples.camera === "needs-guest"
        ? "Con invitado"
        : "Sin cámara");

  const structural = examples.structural.map((item) => `- ${item}`).join("\n");
  const visual = examples.visual.map((item) => `- ${item}`).join("\n");

  return [
    "## Formato creativo (referencia de producción)",
    `Referencia de producción: ${formatLabel || formatId || "—"}${
      formatSummary ? ` — ${formatSummary}` : ""
    }`,
    `Producción: ${cameraLabel}.`,
    `Mecanismo: ${examples.mechanism}`,
    `Qué no hacer: ${examples.avoid}`,
    "",
    "Los search briefs tienen que describir ESTE mecanismo, no un demo de producto ni el contenido del pilar.",
    "El pilar da de qué hablar; el formato da cómo está armada la pieza.",
    "Elegí un camino de la familia de abajo. No copies literal. Adaptá al pilar sin abandonar el formato ni la cámara.",
    "Si la producción es sin cámara, nadie a cuadro: motion, placas, layouts, quotes, ratings, UI del formato (chat, notas, reseñas), B-roll. Animación tipo Remotion es válida.",
    "",
    `### Ejemplos estructurales · ${cameraLabel}`,
    structural,
    "",
    `### Ejemplos visuales · ${cameraLabel}`,
    visual,
  ].join("\n");
}

export { EXAMPLES };
