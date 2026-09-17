export type SignalSourceType = "inspiration" | "mercantis" | "manual";

export type ProposalStatus = "candidate" | "selected";

export type ProposalContentBlock = {
  order: number;
  type?: string;
  copy: string;
  visualDirection?: string;
};

export type Proposal = {
  id: string;
  planSlotId: string;
  signalSourceType: SignalSourceType;
  sourceRef?: string;
  structuralSourceRef?: string;
  visualSourceRef?: string;
  signal?: string;
  angleId?: string;
  concept: string;
  hook: string;
  narrative?: string;
  contentBlocks?: ProposalContentBlock[];
  cta?: string;
  caption?: string;
  visualDirection?: string;
  /** Relación liviana a assets de galería; no es un DAM. */
  assetIds?: string[];
  brainRefs?: string[];
  status: ProposalStatus;
  createdAt?: string;
};

export const SIGNAL_SOURCE_TYPE_LABELS: Record<SignalSourceType, string> = {
  inspiration: "Inspiración",
  mercantis: "Mercantis",
  manual: "Manual",
};

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  candidate: "Candidata",
  selected: "Seleccionada",
};

const SLOT_VISION_ROADMAP_CAROUSEL =
  "gen-generation:1789598588433-account:1789142522146--tiktok+account:1789142522146--instagram-2026-09-18-1600";

const BRAIN_REFS = [
  "contenido-comunicacion.md",
  "roadmap.md",
  "posicionamiento.md",
  "filosofia.md",
  "empresa.md",
  "historia.md",
  "fundadores.md",
  "funcionalidades.md",
  "claims.md",
];

const VISUAL_REF = "creativo:x-2096956445959082244";

const BLUEPRINT_VISUAL =
  "Carrusel de 5 placas 9:16. Estética de plano arquitectónico editorial, cercana a un hero de producto: mucho aire, tipografía grande, una estructura dominante por slide, sin personas ni cámara. Papel de calco digital sobre fondo oscuro (tinta clara, líneas finas, cotas, alas punteadas). Paleta Mercantis. Cada módulo lleva una etiqueta de estado visible: Hoy / En desarrollo / Próximo / Visión. No imitar el contenido de la referencia de X; sólo el lenguaje de composición (hero, jerarquía, profundidad).";

export const proposals: Proposal[] = [
  {
    id: "proposal-blueprint-plano-abierto",
    planSlotId: SLOT_VISION_ROADMAP_CAROUSEL,
    signalSourceType: "inspiration",
    sourceRef: VISUAL_REF,
    visualSourceRef: VISUAL_REF,
    signal:
      "Plano arquitectónico en expansión: la tienda es la fundación, el resto del edificio se está dibujando.",
    angleId: "storytelling",
    concept:
      "Carrusel-plano. Mercantis se cuenta como un edificio que ya tiene fundación (tienda, catálogo, stock) y se expande en público: caja/POS en obra, sucursales y facturación próximas, y una visión más grande que no se vende como disponible. La IA aparece como el ADN de esa arquitectura, no como un agente ya entregado.",
    hook: "No estamos armando una tienda. Estamos dibujando el sistema operativo del negocio.",
    narrative:
      "Arranca en lo que ya está parado. Después muestra las alas en obra, con estados honestos. Cierra en la visión y en el rol de la IA: hoy trabaja el catálogo; mañana debería entender el negocio. El dueño sigue decidiendo.",
    contentBlocks: [
      {
        order: 1,
        type: "slide",
        copy: "Esto ya está parado.\nTienda online + catálogo + stock.\nLa fundación.",
        visualDirection:
          "Slide 1. Plano cenital del bloque central, tinta sobre calco. Título chico arriba: MERCANTIS. El volumen principal está lleno, sólido, con tres recintos etiquetados: Tienda online · Catálogo · Stock. Alrededor, líneas punteadas que todavía no cierran alas. Abajo a la izquierda, pastilla HOY. Sin UI de producto. Sin personas.",
      },
      {
        order: 2,
        type: "slide",
        copy: "Ahora agrandamos el edificio.\nEn desarrollo: Caja / POS.\nPróximo: sucursales, facturación, API, webhooks.\nTodavía no está. Lo estamos construyendo.",
        visualDirection:
          "Slide 2. El mismo plano, más ancho. Del bloque central salen dos alas en línea punteada: Caja / POS (etiqueta EN DESARROLLO) y Sucursales + Facturación (PRÓXIMO). Dos conductos finos salen del núcleo con etiquetas API pública y Webhooks, también PRÓXIMO. Nada de esto se ve como módulo terminado. El centro sólido sigue siendo la fundación live.",
      },
      {
        order: 3,
        type: "slide",
        copy: "La visión no es un módulo más.\nEs el resto del plano.\nAgente IA · storefronts generativos · contabilidad básica.\nNo está disponible. Es hacia dónde va.",
        visualDirection:
          "Slide 3. Zoom out. Una zona más grande, apenas esbozada, titulada VISIÓN. Tres recintos fantasma: Agente IA (Argo), Storefronts generativos, Contabilidad básica. Líneas de luz muy finas los conectan al núcleo, como instalaciones que todavía no se tendieron. La pastilla dice VISIÓN. Cero screenshot. Cero promesa de fecha.",
      },
      {
        order: 4,
        type: "slide",
        copy: "La IA no es un extra. Es el ADN.\nHoy: importar, títulos, categorías, imágenes.\nDespués: entender el negocio y sugerir.\nEl dueño confirma. Siempre.",
        visualDirection:
          "Slide 4. Zoom al núcleo. Sobre el plano, una red neuronal / circuito discreto etiquetado IA. Íconos chicos de automatización flotan sobre el bloque de catálogo (eso es lo live). Una nota al margen: Argo todavía no está. No dibujar un robot, un chat ni un asistente antropomorfo.",
      },
      {
        order: 5,
        type: "slide",
        copy: "El futuro de tu negocio se construye acá.\nUn sistema que se expande sin volverse un ERP pesado.",
        visualDirection:
          "Slide 5. Vista aérea estilizada, tipo hero: el edificio Mercantis en un paisaje urbano digital, moderno, minimalista, con alas vacías que dejan ver que puede seguir creciendo. Headline grande. Firma Mercantis discreta. Sin personas, sin local real, sin equipo trabajando.",
      },
    ],
    cta: "Empezá por la fundación. El resto del plano se está dibujando.",
    caption:
      "No estamos armando una tienda.\nEstamos dibujando el sistema operativo del negocio.\n\nHoy ya está la fundación: tienda online, catálogo y stock.\nCaja/POS está en desarrollo.\nSucursales, facturación, API y webhooks son próximos.\nArgo, storefronts generativos y más gestión son visión: no están disponibles.\n\nLa IA ya trabaja el catálogo. La dirección es que se vuelva el ADN de todo el sistema, con el dueño confirmando cada acción.\n\nUn sistema que se expande. Sin volverse un ERP pesado.",
    visualDirection: BLUEPRINT_VISUAL,
    brainRefs: BRAIN_REFS,
    status: "candidate",
    createdAt: "2026-09-16T23:25:00.000Z",
  },
  {
    id: "proposal-blueprint-lineas-punteadas",
    planSlotId: SLOT_VISION_ROADMAP_CAROUSEL,
    signalSourceType: "inspiration",
    sourceRef: VISUAL_REF,
    visualSourceRef: VISUAL_REF,
    signal:
      "El contraste del plano: volumen sólido vs línea punteada. Build in public sin vender roadmap como producto.",
    angleId: "comparacion",
    concept:
      "Misma metáfora del plano, más tensa. Cada slide pregunta qué está construido y qué todavía es calco. Sirve para que un comerciante entienda la ambición (sistema operativo) sin confundirla con lo que puede usar hoy.",
    hook: "Lo que ya está construido. Lo que todavía es una línea punteada.",
    narrative:
      "El carrusel enseña a leer el plano. Sólido = hoy. Punteado = lo que estamos levantando. Fantasma = visión. La pieza admite que caja, sucursales y facturación deberían haber llegado antes: por eso están en el dibujo, no en el producto.",
    contentBlocks: [
      {
        order: 1,
        type: "slide",
        copy: "Sólido = ya lo podés usar.\nTienda online.\nCatálogo.\nStock.",
        visualDirection:
          "Slide 1. Plano con leyenda en el margen, como un sello de obra: SÓLIDO / PUNTEADO / FANTASMA. Sólo el núcleo está relleno. Tres recintos: Tienda online, Catálogo, Stock. El resto del pliego está en blanco con una grilla apenas visible. Pastilla HOY.",
      },
      {
        order: 2,
        type: "slide",
        copy: "Punteado = lo estamos levantando.\nCaja / POS, en desarrollo.\nSucursales y facturación, próximo.\nAPI y webhooks, próximo.",
        visualDirection:
          "Slide 2. Las alas nuevas aparecen sólo como trazo discontinuo y andamio gráfico (no personas, no obra real). Etiquetas EN DESARROLLO y PRÓXIMO grandes, imposibles de pasar por alto. El núcleo sólido no se mueve. Una nota chica: no hay fecha.",
      },
      {
        order: 3,
        type: "slide",
        copy: "Fantasma = visión.\nUn agente de IA.\nStorefronts que se pidan en conversación.\nMás gestión, sin volverse SAP.",
        visualDirection:
          "Slide 3. Recintos en trazo muy suave, casi ausentes. Títulos: Agente IA (Argo) · Storefronts generativos · Contabilidad básica. Una línea al pie: No está. Es el norte. No usar isotipo de SAP ni logo de competidores.",
      },
      {
        order: 4,
        type: "slide",
        copy: "La IA ya está en la fundación.\nImportar. Titular. Categorizar. Mejorar fotos.\nEl agente general, todavía no.",
        visualDirection:
          "Slide 4. El circuito de IA nace en el recinto de Catálogo (live) y se proyecta en líneas punteadas hacia el resto del edificio. Dos llamadas: Hoy, sobre el catálogo. Todavía no, sobre Argo. Cero chat bubble. Cero cara.",
      },
      {
        order: 5,
        type: "slide",
        copy: "Leé el plano antes de pedirnos el edificio entero.\nEstamos construyendo el sistema operativo.\nAla por ala.",
        visualDirection:
          "Slide 5. El plano completo a vista de héroe, con la leyenda Sólido / Punteado / Fantasma repetida como cierre. El edificio se siente expandible, no terminado. CTA tipográfico abajo. Firma Mercantis.",
      },
    ],
    cta: "Si tu negocio todavía es chat + planilla, empecemos por lo sólido.",
    caption:
      "Lo que ya está construido. Lo que todavía es una línea punteada.\n\nHoy: tienda, catálogo, stock.\nEn desarrollo: caja / POS.\nPróximo: sucursales, facturación, API, webhooks.\nVisión: un agente de IA, storefronts generativos, más gestión — sin volvernos un ERP corporativo.\n\nLa IA ya ayuda a digitalizar el catálogo. El agente general no está.\n\nEstamos construyendo el sistema operativo del negocio. Ala por ala.",
    visualDirection: BLUEPRINT_VISUAL,
    brainRefs: BRAIN_REFS,
    status: "candidate",
    createdAt: "2026-09-16T23:25:01.000Z",
  },
  {
    id: "proposal-blueprint-ciudad-digital",
    planSlotId: SLOT_VISION_ROADMAP_CAROUSEL,
    signalSourceType: "inspiration",
    sourceRef: VISUAL_REF,
    visualSourceRef: VISUAL_REF,
    signal:
      "Misma arquitectura, ejecución más hero: el edificio en un paisaje digital, como una sección de producto editorial.",
    angleId: "aspiracional",
    concept:
      "La misma tesis del plano, pero cada slide se siente más como un hero de producto que como un expediente de obra. Sirve si se quiere una pieza más pulida para la cuenta oficial, sin esconder los estados de roadmap.",
    hook: "Un sistema operativo no se lanza. Se levanta, ala por ala.",
    narrative:
      "Tono institucional, voseo contenido. La ambición (sistema operativo AI-native, no SAP para PyMEs) se ve. Los estados se leen en etiquetas, no en letra chica escondida. La IA es capa del sistema, no mascota.",
    contentBlocks: [
      {
        order: 1,
        type: "slide",
        copy: "La fundación ya está.\nUna tienda conectada a catálogo y stock.",
        visualDirection:
          "Slide 1. Composición tipo hero: headline arriba, el bloque arquitectónico abajo-centro, mucho vacío. El volumen de la fundación es un prisma limpio, no un wireframe recargado. Etiquetas laterales: Tienda online · Catálogo · Stock. Pastilla HOY. Referencia de composición (no de contenido) a hero sections recientes: un objeto, una frase, aire.",
      },
      {
        order: 2,
        type: "slide",
        copy: "El siguiente tramo es gestión.\nCaja, sucursales, facturación.\nTodavía no. Prioridad.",
        visualDirection:
          "Slide 2. El prisma gana dos volúmenes laterales en wireframe. Callouts: Caja / POS — en desarrollo. Sucursales — próximo. Facturación — próximo. Debajo, dos etiquetas técnicas chicas: API pública · Webhooks (próximo). No se ve una caja registradora real ni un local.",
      },
      {
        order: 3,
        type: "slide",
        copy: "La visión: que el software se adapte al negocio.\nNo al revés.",
        visualDirection:
          "Slide 3. El conjunto se vuelve una planta casi urbana, todavía dibujada. Recintos VISIÓN: Agente IA (Argo) · Storefronts generativos · Contabilidad básica. Luz muy contenida en las conexiones. El copy no nombra fechas. El edificio no se ve terminado.",
      },
      {
        order: 4,
        type: "slide",
        copy: "IA como capa, no como show.\nHoy ordena el catálogo.\nMañana debería leer el negocio y sugerir.\nNada se ejecuta sin vos.",
        visualDirection:
          "Slide 4. Corte editorial al núcleo: una red de líneas (no un cerebro anatómico) etiquetada El ADN del sistema. Microetiquetas live: importar · textos · categorías · imágenes. Una microetiqueta visión: Argo. Estética de diagrama de producto, no de sci-fi barato.",
      },
      {
        order: 5,
        type: "slide",
        copy: "El futuro de tu negocio se construye acá.",
        visualDirection:
          "Slide 5. Vista aérea hero del edificio Mercantis en un paisaje urbano digital, simétrico, expandible, minimalista. Headline único, grande. Subtítulo opcional: Sistema operativo en construcción. Logo chico. Cero lifestyle, cero oficina, cero equipo.",
      },
    ],
    cta: "Empezá por lo que ya está parado. El plano sigue abierto.",
    caption:
      "Un sistema operativo no se lanza. Se levanta, ala por ala.\n\nHoy: tienda, catálogo y stock, conectados.\nEn desarrollo: caja / POS.\nPróximo: sucursales, facturación, API, webhooks.\nVisión: un agente de IA, storefronts generativos, más gestión — sin convertirnos en un ERP pesado.\n\nLa IA ya trabaja el catálogo. El agente general no está. Cuando llegue, sugiere; el dueño confirma.\n\nEl futuro de tu negocio se construye acá.",
    visualDirection: BLUEPRINT_VISUAL,
    brainRefs: BRAIN_REFS,
    status: "candidate",
    createdAt: "2026-09-16T23:25:02.000Z",
  },
];
