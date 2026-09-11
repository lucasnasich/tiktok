import { getFormatById, normalizeFormatId } from "@/content/formats";

export type FormatGuide = {
  formatId: string;
  paragraph: string;
  mercantisIdeas: string[];
};

const FORMAT_GUIDES: Record<string, FormatGuide> = {
  "x-razones": {
    formatId: "x-razones",
    paragraph:
      "Lista numerada en carrusel o reel: el hook promete N razones y cada slide suma un argumento. Busca educar con claridad y sostener el swipe porque la estructura es predecible y fácil de escanear. Psicológicamente, el número activa una promesa concreta y baja la fricción cognitiva — el cerebro sabe cuánto falta y premia el progreso.",
    mercantisIdeas: [
      "3 razones por las que tu stock en Excel te está costando ventas.",
      "5 señales de que tu negocio ya necesita un sistema, no más planillas.",
      "4 razones por las que cobrar por WhatsApp sin orden te genera dolores de cabeza.",
    ],
  },
  "historia-instagram": {
    formatId: "historia-instagram",
    paragraph:
      "Pieza nativa de story — sticker, texto corto, link — que vive 24 h y se siente más cercana que un carrusel de feed. Busca interacción rápida o refuerzo del mensaje del día sin repetir la pieza principal. Funciona porque las stories se perciben como canal semi-privado: menor resistencia a mensajes directos y más facilidad para el micro-compromiso.",
    mercantisIdeas: [
      "Sticker de pregunta: “¿Qué te traba más: stock o cobros?”",
      "Countdown a un webinar o novedad del producto (solo si es real).",
      "Repurpose de un slide del carrusel con CTA “ver post completo”.",
    ],
  },
  "nosotros-vs-ellos": {
    formatId: "nosotros-vs-ellos",
    paragraph:
      "Comparación en dos columnas: tu enfoque frente a la alternativa obvia (Excel, WhatsApp suelto, mil apps). Busca aclarar posicionamiento sin un pitch largo — mostrar por qué tu propuesta ordena lo fragmentado. El contraste reduce ambigüedad: decidimos mejor entre dos caminos que entre diez opciones difusas.",
    mercantisIdeas: [
      "Planilla + WhatsApp + banco vs. catálogo + pedidos + cobros en un solo lugar.",
      "“Armás la tienda en días” vs. semanas de desarrollo o agencia.",
      "Operación diaria centralizada vs. perseguir info en cinco chats.",
    ],
  },
  "diagrama-venn": {
    formatId: "diagrama-venn",
    paragraph:
      "Dos círculos que se cruzan; cada lado es un mundo y el centro es el sweet spot donde conviven ambos beneficios. Busca comunicar un posicionamiento híbrido que suena contradictorio hasta que se ve. Resuelve tensión mental: la audiencia cree que hay que elegir A o B, y el Venn muestra un tercer espacio legítimo.",
    mercantisIdeas: [
      "Fácil de usar ∩ Potente para crecer = Mercantis.",
      "Tienda online ∩ Gestión del día a día = un solo sistema.",
      "Para emprendedores ∩ Para negocios que ya venden = misma herramienta, distinto momento.",
    ],
  },
  "no-compres-esto": {
    formatId: "no-compres-esto",
    paragraph:
      "Hook negativo o de filtro (“no compres X hasta…”) que abre con rechazo y gira hacia criterio o solución. Busca detener el scroll y calificar audiencia: solo sigue quien se siente interpelado. La negación rompe el patrón de promesas del feed y genera curiosidad por el giro; posiciona autoridad si no suena a scam.",
    mercantisIdeas: [
      "“No contrates una agencia para tu tienda si todavía no ordenaste tu catálogo.”",
      "“No sumes otra app de cobros si tus pedidos siguen en el aire.”",
    ],
  },
  "nota-iphone": {
    formatId: "nota-iphone",
    paragraph:
      "Screenshot o recreación de Notas: tipografía de sistema, fondo amarillo, texto confesional o lista corta. Busca humanizar el mensaje — pensamiento espontáneo que alguien “apostó” en el teléfono. Lo familiar baja la barrera publicitaria: no parece campaña sino insight real, siempre que no se sienta obviamente fake.",
    mercantisIdeas: [
      "Nota: “Cosas que aprendí vendiendo por Instagram sin sistema.”",
      "Lista: “Errores que veo en comercios que recién digitalizan.”",
      "Reflexión sobre emprender sin jerga técnica.",
    ],
  },
  "captura-chat": {
    formatId: "captura-chat",
    paragraph:
      "Conversación simulada o real (WhatsApp, DM) que dramatiza un dolor u objeción del comercio. Busca hacer tangible lo abstracto mediante diálogo reconocible al instante. La identificación social engancha: vemos una escena, no bullets; la tensión del hilo sostiene atención.",
    mercantisIdeas: [
      "Cliente pide precio por WA y el dueño no encuentra el stock.",
      "“¿Me pasás el CBU?” + tres comprobantes sin orden.",
      "Pedido perdido entre mensajes vs. pedido en el panel.",
    ],
  },
  pizarra: {
    formatId: "pizarra",
    paragraph:
      "Explicación a mano alzada en pizarra física o digital: flechas, cajas, proceso paso a paso. Busca enseñar con autoridad pedagógica sin depender de UI pulida. El gesto de “explicar en la pizarra” activa confianza de maestro; lo visual secuencial ayuda a retener.",
    mercantisIdeas: [
      "Cómo fluye un pedido desde el catálogo hasta el cobro.",
      "Mapa simple: producto → stock → venta → entrega.",
      "“Qué mirar en tu negocio antes de escalar publicidad.”",
    ],
  },
  "cupos-limitados": {
    formatId: "cupos-limitados",
    paragraph:
      "Placa o UI de escasez por cupos — lugares en un programa, plazas de onboarding, acceso anticipado — no stock de producto. Busca empujar acción cuando el límite es real y verificable. La escasez activa aversión a la pérdida; solo funciona con credibilidad, nunca con urgencia inventada.",
    mercantisIdeas: [
      "“Quedan X lugares” para un taller de digitalización o demo en vivo.",
      "Cupo limitado de migración asistida u onboarding grupal (si es real).",
      "Acceso anticipado a una novedad con plazas verificables.",
    ],
  },
  "pedimos-disculpas": {
    formatId: "pedimos-disculpas",
    paragraph:
      "Apertura contrarian: “Pedimos disculpas por…” para introducir postura fuerte o humor controlado. Busca romper el comunicado corporativo típico y captar atención con voz que no suena a plantilla. La disculpa (aunque irónica) interrumpe el script mental de “otro anuncio”; el giro debe aportar sustancia.",
    mercantisIdeas: [
      "“Pedimos disculpas por decir que alcanza con un Excel.” (giro educativo).",
      "“Perdón por insistir con que tu negocio necesita orden, no más hacks.”",
    ],
  },
  "testimonio-cliente": {
    formatId: "testimonio-cliente",
    paragraph:
      "Voz del cliente: quote, video, captura o antes/después narrado por quien usa el producto. Busca credibilidad desde un par igual, no solo desde la marca. Prueba social reduce riesgo percibido — confiamos más en pares que en vendedores.",
    mercantisIdeas: [
      "Comercio local: “pasé de WA caótico a pedidos ordenados”.",
      "Screenshot de review + contexto del rubro.",
      "Antes/después operativo narrado por el cliente.",
    ],
  },
  "lo-nuevo-vs-lo-viejo": {
    formatId: "lo-nuevo-vs-lo-viejo",
    paragraph:
      "Contraste temporal: forma vieja de trabajar vs. forma nueva, sin necesariamente nombrar un competidor. Busca mostrar evolución sin ridiculizar al que todavía está en lo viejo. Apela al deseo de progreso con empatía: no estás mal, pero hay una versión mejor de tu operación.",
    mercantisIdeas: [
      "Anotar pedidos en papel vs. panel con estados.",
      "Precio por mensaje vs. catálogo actualizado.",
      "Cobrar “a mano” vs. link de pago integrado.",
    ],
  },
  "ultima-hora": {
    formatId: "ultima-hora",
    paragraph:
      "Placa de breaking news o titular de urgencia editorial para abrir la pieza. Busca captar atención con relevancia temporal — cambio del sector, tendencia o novedad real. El cerebro prioriza lo novedoso y lo urgente; sin sustancia detrás, genera desconfianza.",
    mercantisIdeas: [
      "Cambio en hábitos de compra en Argentina (con fuente).",
      "Novedad del producto presentada como “acaba de salir” (si es verdad).",
    ],
  },
  transformacion: {
    formatId: "transformacion",
    paragraph:
      "Secuencia antes/después: caos → orden, manual → sistematizado. Busca hacer visible el resultado emocional y operativo de cambiar método, no solo listar features. Las narrativas de transformación activan esperanza y autoeficacia si el “después” es creíble.",
    mercantisIdeas: [
      "Mesa llena de papeles → dashboard limpio.",
      "DMs sin leer → cola de pedidos atendida.",
      "Fin de mes sin números → métricas básicas visibles.",
    ],
  },
  "estilo-reddit": {
    formatId: "estilo-reddit",
    paragraph:
      "Post de foro recreado: título, upvotes, comentarios que cuentan la historia. Busca storytelling con voz de comunidad, no comunicado de marca. Autenticidad percibida y pertenencia tribal — si se fuerza en cuenta oficial, se lee como marketing disfrazado.",
    mercantisIdeas: [
      "r/emprendedores: “¿Cómo organizan pedidos por Instagram?” + respuestas.",
      "Hilo sobre errores comunes al abrir tienda online.",
    ],
  },
  "en-caso-de-emergencia": {
    formatId: "en-caso-de-emergencia",
    paragraph:
      "Placa “en caso de emergencia romper vidrio” que interrumpe el patrón visual del feed. Busca pattern interrupt para un mensaje que merece pausa: error crítico, riesgo operativo. La anomalía visual capta atención evolutiva; en dosis bajas.",
    mercantisIdeas: [
      "“En caso de emergencia: dejá de perder pedidos en WhatsApp.”",
      "Alerta visual sobre error crítico de operación.",
    ],
  },
  "busqueda-google": {
    formatId: "busqueda-google",
    paragraph:
      "Barra de búsqueda + resultados que reflejan una pregunta real de tu audiencia. Busca mostrar que el dolor ya está en su cabeza (lo googlean) y que vos respondés esa query. Valida el problema como legítimo y compartido; reduce vergüenza del espectador.",
    mercantisIdeas: [
      "“cómo organizar pedidos whatsapp negocio”.",
      "“tienda online argentina sin saber programar”.",
      "“controlar stock emprendimiento”.",
    ],
  },
  "problema-vs-solucion": {
    formatId: "problema-vs-solucion",
    paragraph:
      "Split claro: dolor arriba / salida abajo, o dos columnas. Busca comunicar valor directo y operativo — marca clara y confiable. Estructura problema-solución en versión visual: nombrás tensión y ofrecés alivio, sin prometer magia.",
    mercantisIdeas: [
      "Problema: no sabés qué tenés en stock → Solución: inventario actualizado.",
      "Problema: cobros dispersos → Solución: medios de pago en el flujo.",
      "Problema: catálogo desactualizado → Solución: un solo lugar para editar.",
    ],
  },
  "efecto-secundario": {
    formatId: "efecto-secundario",
    paragraph:
      "Parodia de prospecto de fármaco con “efectos secundarios” positivos o irónicos. Busca viralidad y memorabilidad por humor; comunica beneficios en formato inesperado. El marco médico es reconocible al instante y disarma defensas — mejor en satélites que en oficial.",
    mercantisIdeas: [
      "“Efectos secundarios de ordenar tu negocio: dormir mejor, menos chats.”",
    ],
  },
  "oferta-combo": {
    formatId: "oferta-combo",
    paragraph:
      "Beneficios o features como menú, bundle o combo — “todo lo que incluye”. Busca hacer tangible el valor sin pricing sheet aburrido. Ver muchos ítems juntos infla percepción de oferta completa; cuidado con prometer lo que no está live.",
    mercantisIdeas: [
      "“Todo lo que incluye armar tu tienda” como menú (catálogo, pedidos, cobros…).",
      "Trial o plan explicado como combo de valor, no descuento falso.",
    ],
  },
  "titular-con-dato": {
    formatId: "titular-con-dato",
    paragraph:
      "Número o estadística grande como hero del slide. Busca anclar credibilidad: el dato justifica por qué importa el resto. Los números activan sensación de evidencia; sin fuente o calificación honesta, el efecto se invierte.",
    mercantisIdeas: [
      "Horas por semana que un comercio pierde persiguiendo pedidos (con fuente o hipótesis marcada).",
      "Dato de adopción digital en PyMEs Argentina.",
    ],
  },
  garabato: {
    formatId: "garabato",
    paragraph:
      "Doodles y flechas sobre screenshot o video para señalar lo importante en segundos. Busca guiar la mirada en walkthroughs sin regrabar todo. Atención dirigida: color y trazo concentran foco y bajan carga cognitiva — pocos trazos, legibles.",
    mercantisIdeas: [
      "Garabato sobre panel de pedidos señalando estados.",
      "Flechas en catálogo → carrito → cobro.",
      "Marcar en rojo el caos de una planilla.",
    ],
  },
  "captura-email": {
    formatId: "captura-email",
    paragraph:
      "Inbox, newsletter o mail de hito, onboarding o novedad. Busca profesionalismo y legitimidad institucional — hay proceso detrás, no solo redes. El email refuerza confianza B2B y sensación de operación seria.",
    mercantisIdeas: [
      "Mail de bienvenida al crear la tienda.",
      "Notificación de nuevo pedido (demo).",
      "Newsletter educativa sobre operación comercial.",
    ],
  },
  "no-seas-ese-que": {
    formatId: "no-seas-ese-que",
    paragraph:
      "Call-out al comportamiento que la audiencia quiere evitar: “no seas el que…”. Busca identificación por rechazo — no querés ser el personaje del error. Aversión social al estigma; alto alcance pero riesgo de sonar condescendiente si no hay respeto.",
    mercantisIdeas: [
      "“No seas el que responde ‘ahí te fijo’ y nunca fija el precio.”",
      "“No seas el que vende sin saber si hay stock.”",
    ],
  },
  resenas: {
    formatId: "resenas",
    paragraph:
      "Estrellas, quotes o screenshots de reseñas en carrusel o slide único. Busca prueba social escaneable sin testimonial en video. Agregación de opiniones reduce incertidumbre — otros ya evaluaron; solo funciona con reseñas auténticas.",
    mercantisIdeas: [
      "Carrusel de reviews reales (con permiso).",
      "Quote destacada + contexto del comercio.",
    ],
  },
  "texto-sobre-la-piel": {
    formatId: "texto-sobre-la-piel",
    paragraph:
      "Tipografía grande sobre textura humana o visual premium; pocas palabras, mucho aire. Busca manifiesto de marca — posicionamiento sin explicación larga. Minimalismo eleva percepción de calidad; la frase se asocia a identidad si la ejecución es impecable.",
    mercantisIdeas: [
      "“Clara. Confiable. Operativa.” sobre visual minimal.",
      "Frase sobre la odisea del emprendedor (metáfora de marca).",
      "Claim defendible sobre simplificar la operación.",
    ],
  },
  "podcast-ia": {
    formatId: "podcast-ia",
    paragraph:
      "Clip estilo podcast o diálogo entre voces que explica un tema. Busca bajar densidad de temas complejos con ritmo de charla. La conversación simula compañía y dos voces sostienen dinámica — exige audio y script de calidad.",
    mercantisIdeas: [
      "Lucas + Carla: por qué unificar catálogo y operación.",
      "“Pregunta de comerciante” / “respuesta de producto” en 45 segundos.",
    ],
  },
  "tier-list": {
    formatId: "tier-list",
    paragraph:
      "Ranking S/A/B/C de opciones, herramientas, errores o prácticas. Busca debate, criterio y comentarios (“¿por qué X en B?”). Gamificación ligera más opinión fuerte; requiere criterios explícitos, no hot takes vacíos.",
    mercantisIdeas: [
      "Tier list de canales de venta para una PyME.",
      "Errores al lanzar tienda online (S = evitar siempre).",
      "Formas de organizar stock (de peor a mejor).",
    ],
  },
  "cero-estrellas": {
    formatId: "cero-estrellas",
    paragraph:
      "Review negativa irónica sobre la “vieja forma” de trabajar, no sobre competidor nombrado. Busca humor y contraste por exageración memorable. Ironía rompe expectativa; riesgo si parece review falsa contra marca real.",
    mercantisIdeas: [
      "0 estrellas a “llevar todo en la cabeza”.",
      "Review ficcional al caos de mil chats.",
    ],
  },
  "green-screen": {
    formatId: "green-screen",
    paragraph:
      "Talking head con fondo dinámico: demo, tweet, dashboard, captura. Busca combinar autoridad humana con evidencia visual detrás. Rostro aumenta confianza; fondo contextual ancla el claim — en cuenta oficial, producción cuidada.",
    mercantisIdeas: [
      "Lucas explicando un flujo con el panel de fondo.",
      "Reacción a un dolor común con captura de chat detrás.",
      "Novedad de producto con UI real.",
    ],
  },
  "x-senales": {
    formatId: "x-senales",
    paragraph:
      "Lista de red flags: “X señales de que…”. Busca alcance por autodiagnóstico — el espectador chequea cuántas le aplican. Nos gusta evaluarnos en listas; número impar en el hook ayuda; cada señal debe ser específica.",
    mercantisIdeas: [
      "5 señales de que tu negocio creció más que tu sistema.",
      "Señales de que WhatsApp ya no alcanza como “ERP”.",
      "Red flags al elegir cómo vender online.",
    ],
  },
  "mito-vs-realidad": {
    formatId: "mito-vs-realidad",
    paragraph:
      "Dos columnas o slides: creencia común vs. corrección con criterio. Busca educar desmontando ideas falsas del rubro y posicionar autoridad. Corregir sesgos genera satisfacción cognitiva — excelente en cuenta institucional si el mito es uno que la audiencia realmente cree.",
    mercantisIdeas: [
      "Mito: “primero vendo, después ordeno” / Realidad: el desorden frena ventas.",
      "Mito: “tienda online = solo catálogo bonito” / Realidad: operación incluye cobros y stock.",
      "Mito: “digitalizar es caro y lento” / Realidad: self-service existe.",
    ],
  },
  "problemas-tachados": {
    formatId: "problemas-tachados",
    paragraph:
      "Lista de dolores con strikethrough al “resolver” cada uno. Busca mostrar alivio operativo — qué deja de doler al cambiar método. Cada tachado cierra un loop abierto; ritmo de logro sin esfuerzo del espectador.",
    mercantisIdeas: [
      "Tachar: “¿Cuánto queda?” “¿Ya pagó?” “¿Dónde anoté eso?”",
      "Lista de fricciones diarias del dueño de negocio.",
    ],
  },
  "lo-que-podes-evitar": {
    formatId: "lo-que-podes-evitar",
    paragraph:
      "Enumerás fricciones que dejás de sufrir al cambiar método. Busca beneficio emocional desde el alivio, no desde la feature. A veces es más motivador “dejar de perder Y” que “ganar X”; habla del día a día del comerciante.",
    mercantisIdeas: [
      "Evitá perseguir comprobantes por todos lados.",
      "Evitá vender algo que no tenés en stock.",
      "Evitá reescribir precios en cinco lugares.",
    ],
  },
  advertencia: {
    formatId: "advertencia",
    paragraph:
      "Placa WARNING o alerta amarilla/negra que interrumpe el scroll. Busca pattern interrupt con sustancia: error común, riesgo reputacional, mala práctica. Señales de peligro captan atención prioritaria; si abusás, pierde credibilidad.",
    mercantisIdeas: [
      "WARNING: vender sin control de stock puede costarte reputación.",
      "Alerta: mezclar plata personal y del negocio en transferencias.",
      "Cuidado con prometer envíos sin logística clara.",
    ],
  },
};

export function getFormatGuide(formatId: string): FormatGuide | undefined {
  return FORMAT_GUIDES[normalizeFormatId(formatId)];
}

export function getFormatGuideOrFallback(formatId: string): FormatGuide {
  const normalizedId = normalizeFormatId(formatId);
  const guide = FORMAT_GUIDES[normalizedId];
  const format = getFormatById(normalizedId);
  if (guide) return guide;
  return {
    formatId: normalizedId,
    paragraph:
      format?.summary ??
      "Formato creativo del estudio. Elegir cuando la estructura visual encaje con el mensaje, el rol del slot y el tono de la cuenta.",
    mercantisIdeas: ["Definir con Cursor según slot, pilar y rol."],
  };
}
