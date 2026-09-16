import {
  contentRoles,
  normalizeRoleId,
  type ContentRoleId,
} from "./content-roles.ts";

/**
 * Tema = de qué área concreta hablamos DENTRO de un rol.
 * No es un pilar global. La compatibilidad se define por rol.
 */
export type TopicPriority = "alta" | "media" | "baja" | "no";

export type RoleTopic = {
  id: string;
  roleId: ContentRoleId;
  label: string;
  summary: string;
  brainRefs: string[];
  /** Límite editorial extra (firewall de Brain). */
  constraint?: string;
};

export type RoleTopicPreferences = Record<
  ContentRoleId,
  Record<string, TopicPriority>
>;

export const TOPIC_PRIORITY_WEIGHT: Record<TopicPriority, number> = {
  alta: 30,
  media: 15,
  baja: 5,
  no: 0,
};

const ALWAYS_BRAIN = ["contenido-comunicacion.md"] as const;

function topic(
  roleId: ContentRoleId,
  id: string,
  label: string,
  summary: string,
  brainRefs: string[],
  constraint?: string,
): RoleTopic {
  return { id, roleId, label, summary, brainRefs, constraint };
}

const CLAIMS = "claims.md";
const FUN = "funcionalidades.md";
const PROD = "producto.md";
const IA = "inteligencia-artificial.md";
const DOLORES = "dolores-jtbd.md";
const POS = "posicionamiento.md";
const FIL = "filosofia.md";
const MARCA = "marca.md";
const HIST = "historia.md";
const FUND = "fundadores.md";
const GROWTH = "growth-distribucion.md";
const CLIENTES = "clientes-casos.md";
const USUARIOS = "usuarios-clientes.md";
const MERCADOS = "mercados-internacionalizacion.md";
const PRICING = "pricing-modelo-negocio.md";
const TECH = "tecnologia.md";
const ROADMAP = "roadmap.md";
const LIMITES = "aprendizajes-limitaciones.md";
const VERTICALES = "verticales.md";
const EMPRESA = "empresa.md";

const METRICS_CONSTRAINT =
  "Sólo métricas públicas y verificadas. No usar cifras orales, internas ni aproximadas. Consultar claims.md.";
const ROADMAP_CONSTRAINT =
  "Distinguir live / in-development / planned / vision. Nunca presentar roadmap como disponible.";
const INTERNAL_CONSTRAINT =
  "No promover información internal, personal, financiera, de seguridad o deuda técnica a copy público.";
const LIVE_ONLY =
  "Sólo funcionalidades live. No mostrar caja/POS, sucursales, facturación, API, MCP, webhooks, Meta Pixel ni Argo como disponibles.";
const NO_LOCALISM =
  "Mantenerlo universal para LATAM. Evitar regulaciones, impuestos y métodos de un solo país salvo que el slot esté segmentado a ese mercado.";
const NO_INVENT_EVIDENCE =
  "No inventar clientes, citas, resultados ni ahorro de tiempo. No convertir un caso en estadística.";

export const ROLE_TOPICS: Record<ContentRoleId, RoleTopic[]> = {
  build_in_public: [
    topic(
      "build_in_public",
      "producto_en_construccion",
      "Producto en construcción",
      "Features que estamos construyendo, iteraciones, lanzamientos y mejoras recién terminadas.",
      [FUN, PROD, ROADMAP, CLAIMS],
      ROADMAP_CONSTRAINT,
    ),
    topic(
      "build_in_public",
      "feedback_clientes",
      "Feedback de clientes",
      "Conversaciones, pedidos, problemas encontrados y lo que aprendemos hablando con clientes.",
      [CLIENTES, USUARIOS, DOLORES, LIMITES],
    ),
    topic(
      "build_in_public",
      "decisiones_priorizacion",
      "Decisiones y priorización",
      "Por qué hacemos una cosa antes que otra, features que no construimos y trade-offs de producto.",
      [FIL, PROD, ROADMAP, LIMITES],
      ROADMAP_CONSTRAINT,
    ),
    topic(
      "build_in_public",
      "errores_aprendizajes",
      "Errores y aprendizajes",
      "Errores, experimentos fallidos, timing equivocado y aprendizajes como founders.",
      [LIMITES, HIST, FUND, FIL],
      INTERNAL_CONSTRAINT,
    ),
    topic(
      "build_in_public",
      "crecimiento_distribucion",
      "Crecimiento y distribución",
      "Contenido, TikTok, Instagram, SEO, ventas, inbound, outbound y experimentos de adquisición.",
      [GROWTH, POS],
    ),
    topic(
      "build_in_public",
      "metricas_traccion",
      "Métricas y tracción",
      "Registros, tiendas, clientes, conversiones, hitos y evolución del negocio.",
      [CLAIMS, GROWTH, CLIENTES],
      METRICS_CONSTRAINT,
    ),
    topic(
      "build_in_public",
      "expansion_latam",
      "Expansión LATAM",
      "Llevar Mercantis a mercados, monedas, locales y proveedores. No confundir soporte técnico con tracción.",
      [MERCADOS, GROWTH, FUN],
    ),
    topic(
      "build_in_public",
      "tecnologia_construccion",
      "Tecnología y construcción",
      "Cómo se construye Mercantis: arquitectura, IA, performance y perspectiva de ingeniería.",
      [TECH, IA, FUND, LIMITES],
      INTERNAL_CONSTRAINT,
    ),
    topic(
      "build_in_public",
      "fundadores_equipo",
      "Fundadores y equipo",
      "Lucas, Carla, cómo trabajan juntos, división de roles y el día a día de construir la empresa.",
      [FUND, HIST, FIL],
      INTERNAL_CONSTRAINT,
    ),
    topic(
      "build_in_public",
      "historia_hitos",
      "Historia e hitos",
      "Origen, Curbal, primer cliente, primeras ventas y el paso de tienda online a sistema operativo.",
      [HIST, EMPRESA, FUND, CLIENTES],
    ),
    topic(
      "build_in_public",
      "modelo_negocio_pricing",
      "Modelo de negocio y pricing",
      "Suscripción, cero comisión, anual, planes y cómo pensamos el modelo económico.",
      [PRICING, POS, CLAIMS, FIL],
    ),
    topic(
      "build_in_public",
      "vision_roadmap",
      "Visión y roadmap",
      "Hacia dónde va Mercantis y cómo cambia la visión. Nunca como producto ya disponible.",
      [ROADMAP, POS, FIL, EMPRESA],
      ROADMAP_CONSTRAINT,
    ),
  ],
  educacion: [
    topic(
      "educacion",
      "ventas_atencion",
      "Ventas y atención",
      "Ventas, consultas, seguimiento, cierre y WhatsApp como canal comercial.",
      [DOLORES, USUARIOS],
    ),
    topic(
      "educacion",
      "inventario_stock",
      "Inventario y stock",
      "Control de stock, faltantes, variantes, reposición, errores y organización.",
      [DOLORES, USUARIOS],
    ),
    topic(
      "educacion",
      "pedidos_logistica",
      "Pedidos y logística",
      "Organización de pedidos, preparación, entregas, retiro y procesos. Sin localismos.",
      [DOLORES],
      NO_LOCALISM,
    ),
    topic(
      "educacion",
      "catalogo_ecommerce",
      "Catálogo y ecommerce",
      "Fichas, organización, presentación, ecommerce y calidad de información del catálogo.",
      [DOLORES, POS],
    ),
    topic(
      "educacion",
      "conversion_trafico",
      "Conversión y tráfico",
      "Cómo mejorar conversión, experiencia de compra, tráfico y fricciones de una tienda.",
      [DOLORES, GROWTH],
    ),
    topic(
      "educacion",
      "operacion_gestion",
      "Operación y gestión",
      "Procesos, organización, sistemas, productividad y menos trabajo manual.",
      [DOLORES, FIL],
    ),
    topic(
      "educacion",
      "automatizacion_ia",
      "Automatización e IA",
      "Automatizar tareas reales de un negocio. No convertirlo en un anuncio de Mercantis.",
      [IA, DOLORES, FIL],
    ),
    topic(
      "educacion",
      "equipo_delegacion",
      "Equipo y delegación",
      "Delegar, permisos, procesos internos y responsabilidades en un comercio.",
      [DOLORES, USUARIOS],
    ),
    topic(
      "educacion",
      "clientes_fidelizacion",
      "Clientes y fidelización",
      "Experiencia, postventa, recompra y relaciones con clientes.",
      [USUARIOS, DOLORES],
    ),
    topic(
      "educacion",
      "numeros_negocio",
      "Números del negocio",
      "Métricas, ventas, pedidos, clientes y lectura básica. Sin consejos fiscales de un país.",
      [DOLORES, POS],
      NO_LOCALISM,
    ),
    topic(
      "educacion",
      "pagos_cobros",
      "Pagos y cobros",
      "Principios universales de fricción al cobrar. No un tour de proveedores locales.",
      [DOLORES, MERCADOS],
      NO_LOCALISM,
    ),
    topic(
      "educacion",
      "digitalizacion_sistemas",
      "Digitalización y sistemas",
      "Pasar de WhatsApp + Excel + memoria a una operación más estructurada.",
      [DOLORES, POS, EMPRESA],
    ),
  ],
  producto: [
    topic(
      "producto",
      "onboarding_tienda",
      "Onboarding de tienda",
      "Creación, configuración y puesta en marcha de una tienda en Mercantis.",
      [FUN, PROD, CLAIMS],
      LIVE_ONLY,
    ),
    topic(
      "producto",
      "catalogo_importaciones",
      "Catálogo e importaciones",
      "Productos, servicios, categorías e importaciones desde planillas, WhatsApp Business o asistidas.",
      [FUN, IA, CLAIMS],
      LIVE_ONLY,
    ),
    topic(
      "producto",
      "ia_catalogo",
      "IA de catálogo",
      "IA live: importación, títulos, descripciones, categorización y mejora de imágenes.",
      [IA, FUN, CLAIMS],
      "Sólo IA live. No mostrar Argo ni features futuras como si estuvieran disponibles.",
    ),
    topic(
      "producto",
      "stock_variantes",
      "Stock y variantes",
      "Stock, variantes, SKU, disponibilidad y operación de inventario en Mercantis.",
      [FUN, PROD, CLAIMS],
      LIVE_ONLY,
    ),
    topic(
      "producto",
      "pedidos",
      "Pedidos",
      "Gestión y creación de pedidos en Mercantis.",
      [FUN, PROD, CLAIMS],
      LIVE_ONLY,
    ),
    topic(
      "producto",
      "whatsapp",
      "WhatsApp",
      "Cómo Mercantis convive con WhatsApp y estructura la operación alrededor del canal.",
      [FUN, POS, DOLORES],
      LIVE_ONLY,
    ),
    topic(
      "producto",
      "clientes_crm",
      "Clientes / CRM",
      "Gestión de clientes en Mercantis.",
      [FUN, USUARIOS, CLAIMS],
      LIVE_ONLY,
    ),
    topic(
      "producto",
      "pagos_cobros",
      "Pagos y cobros",
      "Efectivo, transferencia, medios personalizados y proveedores según país.",
      [FUN, MERCADOS, CLAIMS],
      "Respetar disponibilidad regional. GoCuotas sólo en Argentina.",
    ),
    topic(
      "producto",
      "entrega_retiro",
      "Entrega y retiro",
      "Entrega, retiro y reglas básicas live. No prometer logística avanzada.",
      [FUN, CLAIMS],
      LIVE_ONLY,
    ),
    topic(
      "producto",
      "equipo_permisos",
      "Equipo y permisos",
      "Miembros, roles, permisos y delegación en el producto.",
      [FUN, CLAIMS],
      LIVE_ONLY,
    ),
    topic(
      "producto",
      "metricas",
      "Métricas del producto",
      "Ingresos, pedidos, clientes nuevos, visitas y métricas que estén realmente live.",
      [FUN, CLAIMS],
      `${LIVE_ONLY} ${METRICS_CONSTRAINT}`,
    ),
    topic(
      "producto",
      "storefront_personalizacion",
      "Storefront y personalización",
      "Tienda pública, identidad, diseño y personalización actualmente disponible.",
      [FUN, MARCA, CLAIMS],
      LIVE_ONLY,
    ),
    topic(
      "producto",
      "mercados_monedas",
      "Mercados y monedas",
      "País, moneda, locale y configuración regional. No confundir soporte con tracción.",
      [MERCADOS, FUN, CLAIMS],
      LIVE_ONLY,
    ),
    topic(
      "producto",
      "mayoristas",
      "Mayoristas",
      "Capacidades mayoristas actualmente disponibles.",
      [FUN, VERTICALES, CLAIMS],
      LIVE_ONLY,
    ),
    topic(
      "producto",
      "multiples_tiendas",
      "Múltiples tiendas",
      "Uso de varias tiendas por un mismo usuario.",
      [FUN, CLAIMS],
      LIVE_ONLY,
    ),
  ],
  marca: [
    topic(
      "marca",
      "sistema_operativo_negocio",
      "Sistema operativo del negocio",
      "Mercantis como algo más amplio que una tienda online.",
      [EMPRESA, POS, FIL],
    ),
    topic(
      "marca",
      "simplicidad_vs_complejidad",
      "Simplicidad vs. complejidad",
      "Software potente sin convertir la operación en un sistema corporativo pesado.",
      [FIL, POS, MARCA],
    ),
    topic(
      "marca",
      "software_se_adapta_al_negocio",
      "El software se adapta al negocio",
      "La tecnología debe adaptarse al comerciante, no al revés.",
      [FIL, POS, USUARIOS],
    ),
    topic(
      "marca",
      "ia_operativa_control_humano",
      "IA operativa con control humano",
      "IA proactiva para sugerir, con confirmación humana para ejecutar.",
      [IA, FIL, LIMITES],
    ),
    topic(
      "marca",
      "orden_vs_fragmentacion",
      "Orden vs. fragmentación",
      "Centralizar información frente al stack de WhatsApp + planillas + herramientas sueltas.",
      [POS, DOLORES, EMPRESA],
    ),
    topic(
      "marca",
      "whatsapp_como_canal",
      "WhatsApp como canal",
      "Gran canal de conversación y venta, no toda la infraestructura operacional.",
      [POS, DOLORES, FIL],
    ),
    topic(
      "marca",
      "futuro_ecommerce",
      "Futuro del ecommerce",
      "Cómo creemos que evolucionan ecommerce, software de negocios, IA e interfaces.",
      [POS, IA, ROADMAP],
      ROADMAP_CONSTRAINT,
    ),
    topic(
      "marca",
      "backoffice_vs_templates",
      "Backoffice vs. templates",
      "El valor está cada vez más debajo del storefront, no en competir por cantidad de plantillas.",
      [POS, FIL, PROD],
    ),
    topic(
      "marca",
      "sin_comision",
      "Sin comisión",
      "Cobrar por el software, no apropiarse de un porcentaje de cada venta.",
      [PRICING, FIL, POS, CLAIMS],
    ),
    topic(
      "marca",
      "vanguardia_ai_native",
      "Vanguardia AI-native",
      "Qué significa operar un negocio preparado para una era de IA.",
      [IA, FIL, POS],
    ),
    topic(
      "marca",
      "filosofia_producto_ux",
      "Filosofía de producto y UX",
      "Menos clics, defaults, claridad, progressive disclosure y placer de uso.",
      [FIL, MARCA, PROD],
    ),
    topic(
      "marca",
      "odisea_emprender",
      "Odisea de emprender",
      "Comerciante como navegante, negocio como viaje, Mercantis como herramienta. Sin forzar la metáfora.",
      [MARCA, FIL, HIST],
    ),
    topic(
      "marca",
      "identidad_latam",
      "Identidad LATAM",
      "Herramienta regional con identidad propia, no español corporativo genérico.",
      [MARCA, MERCADOS, "contenido-comunicacion.md"],
    ),
    topic(
      "marca",
      "marca_comunidad_distribucion",
      "Marca, comunidad y distribución",
      "Las features se copian; marca, audiencia y criterio son parte de la defensibilidad.",
      [GROWTH, POS, MARCA],
    ),
  ],
  evidencia: [
    topic(
      "evidencia",
      "testimonios_citas",
      "Testimonios y citas",
      "Citas reales y autorizadas de clientes.",
      [CLIENTES, CLAIMS],
      NO_INVENT_EVIDENCE,
    ),
    topic(
      "evidencia",
      "casos_clientes",
      "Casos de clientes",
      "Historias concretas de negocios usando Mercantis.",
      [CLIENTES, VERTICALES, CLAIMS],
      NO_INVENT_EVIDENCE,
    ),
    topic(
      "evidencia",
      "migraciones",
      "Migraciones",
      "Clientes que vienen de otras plataformas o sistemas. Un caso no es una estadística.",
      [CLIENTES, POS, CLAIMS],
      NO_INVENT_EVIDENCE,
    ),
    topic(
      "evidencia",
      "feedback_producto",
      "Feedback de producto",
      "Comentarios reales sobre facilidad, velocidad u otras características.",
      [CLIENTES, LIMITES],
      NO_INVENT_EVIDENCE,
    ),
    topic(
      "evidencia",
      "feedback_implementado",
      "Feedback implementado",
      "Una necesidad real de cliente que terminó en una mejora del producto.",
      [CLIENTES, FUN, HIST],
      NO_INVENT_EVIDENCE,
    ),
    topic(
      "evidencia",
      "uso_real",
      "Uso real",
      "Cómo negocios reales usan catálogo, stock, pedidos, tienda u otras funciones live.",
      [CLIENTES, FUN, USUARIOS],
      NO_INVENT_EVIDENCE,
    ),
    topic(
      "evidencia",
      "antes_despues",
      "Antes / después",
      "Cambios demostrables en workflow o experiencia. Sin inventar resultados financieros.",
      [CLIENTES, CLAIMS],
      NO_INVENT_EVIDENCE,
    ),
    topic(
      "evidencia",
      "metricas_verificadas",
      "Métricas verificadas",
      "Datos reales extraídos y verificables. Nunca cifras orales como claim público.",
      [CLAIMS, CLIENTES],
      METRICS_CONSTRAINT,
    ),
    topic(
      "evidencia",
      "historias_por_rubro",
      "Historias por rubro",
      "Casos reales de indumentaria, mates, packaging, cosmética, bazar y otros verticales.",
      [CLIENTES, VERTICALES],
      NO_INVENT_EVIDENCE,
    ),
    topic(
      "evidencia",
      "primeros_clientes_hitos",
      "Primeros clientes e hitos",
      "Primer cliente, primeras ventas y validaciones iniciales cuando haya autorización.",
      [HIST, CLIENTES, FUND],
      NO_INVENT_EVIDENCE,
    ),
  ],
  comunidad: [
    topic(
      "comunidad",
      "dolores_operativos",
      "Dolores operativos",
      "Preguntar y conversar sobre stock, pedidos, WhatsApp, carga de productos y organización.",
      [DOLORES, USUARIOS],
    ),
    topic(
      "comunidad",
      "rutinas_negocio",
      "Rutinas de negocio",
      "Cómo trabajan realmente los comerciantes en su día a día.",
      [USUARIOS, DOLORES],
    ),
    topic(
      "comunidad",
      "decisiones_dilemas",
      "Decisiones y dilemas",
      "Qué priorizar, qué automatizar, qué delegar, cuándo digitalizar. Sin una sola respuesta.",
      [DOLORES, FIL],
    ),
    topic(
      "comunidad",
      "opiniones_industria",
      "Opiniones de industria",
      "Debates sobre ecommerce, software y negocio.",
      [POS, "contenido-comunicacion.md"],
    ),
    topic(
      "comunidad",
      "preguntas_producto",
      "Preguntas de producto",
      "Preguntas de la audiencia sobre Mercantis que pueden volverse contenido.",
      [FUN, USUARIOS, CLAIMS],
    ),
    topic(
      "comunidad",
      "co_creacion_features",
      "Co-creación de features",
      "Preguntar qué mejorarían. Es feedback, no compromiso de desarrollo.",
      [USUARIOS, ROADMAP, LIMITES],
      "No comprometer roadmap. Distinguir pedido de feature de producto live.",
    ),
    topic(
      "comunidad",
      "experiencias_comerciantes",
      "Experiencias de comerciantes",
      "Historias y experiencias compartidas por la comunidad.",
      [USUARIOS, CLIENTES, VERTICALES],
    ),
    topic(
      "comunidad",
      "logros_fracasos",
      "Logros y fracasos",
      "Hitos, errores y experiencias del camino de tener un negocio.",
      [USUARIOS, DOLORES],
    ),
    topic(
      "comunidad",
      "futuro_comercio_ia",
      "Futuro del comercio e IA",
      "Debates sobre IA, automatización y cómo va a cambiar operar un negocio.",
      [IA, FIL, POS],
    ),
    topic(
      "comunidad",
      "rubros",
      "Rubros",
      "Conversaciones específicas entre dueños de distintos tipos de comercios.",
      [VERTICALES, USUARIOS],
    ),
    topic(
      "comunidad",
      "preguntas_fundadores",
      "Preguntas a fundadores",
      "Preguntas para Lucas o Carla sobre empresa, producto, construcción, decisiones y visión.",
      [FUND, HIST, FIL],
      INTERNAL_CONSTRAINT,
    ),
  ],
};

export const ROLE_TOPIC_FALLBACKS: Record<ContentRoleId, string> = {
  build_in_public: "producto_en_construccion",
  educacion: "inventario_stock",
  producto: "catalogo_importaciones",
  marca: "sistema_operativo_negocio",
  evidencia: "casos_clientes",
  comunidad: "dolores_operativos",
};

const DEFAULT_PRIORITY: Record<ContentRoleId, Record<string, TopicPriority>> = {
  build_in_public: {
    producto_en_construccion: "alta",
    feedback_clientes: "alta",
    decisiones_priorizacion: "alta",
    errores_aprendizajes: "alta",
    crecimiento_distribucion: "alta",
    metricas_traccion: "media",
    tecnologia_construccion: "media",
    fundadores_equipo: "media",
    historia_hitos: "media",
    modelo_negocio_pricing: "media",
    expansion_latam: "baja",
    vision_roadmap: "baja",
  },
  educacion: {
    ventas_atencion: "alta",
    inventario_stock: "alta",
    catalogo_ecommerce: "alta",
    operacion_gestion: "alta",
    digitalizacion_sistemas: "alta",
    pedidos_logistica: "media",
    conversion_trafico: "media",
    automatizacion_ia: "media",
    clientes_fidelizacion: "media",
    numeros_negocio: "media",
    equipo_delegacion: "baja",
    pagos_cobros: "baja",
  },
  producto: {
    onboarding_tienda: "alta",
    catalogo_importaciones: "alta",
    ia_catalogo: "alta",
    stock_variantes: "alta",
    pedidos: "alta",
    whatsapp: "alta",
    clientes_crm: "media",
    pagos_cobros: "media",
    entrega_retiro: "media",
    metricas: "media",
    storefront_personalizacion: "media",
    equipo_permisos: "baja",
    mercados_monedas: "baja",
    mayoristas: "baja",
    multiples_tiendas: "baja",
  },
  marca: {
    sistema_operativo_negocio: "alta",
    simplicidad_vs_complejidad: "alta",
    software_se_adapta_al_negocio: "alta",
    orden_vs_fragmentacion: "alta",
    sin_comision: "alta",
    filosofia_producto_ux: "alta",
    ia_operativa_control_humano: "media",
    whatsapp_como_canal: "media",
    backoffice_vs_templates: "media",
    vanguardia_ai_native: "media",
    identidad_latam: "media",
    futuro_ecommerce: "baja",
    odisea_emprender: "baja",
    marca_comunidad_distribucion: "baja",
  },
  evidencia: {
    testimonios_citas: "alta",
    casos_clientes: "alta",
    uso_real: "alta",
    feedback_producto: "alta",
    migraciones: "media",
    feedback_implementado: "media",
    historias_por_rubro: "media",
    antes_despues: "media",
    metricas_verificadas: "baja",
    primeros_clientes_hitos: "baja",
  },
  comunidad: {
    dolores_operativos: "alta",
    rutinas_negocio: "alta",
    decisiones_dilemas: "alta",
    experiencias_comerciantes: "alta",
    opiniones_industria: "media",
    preguntas_producto: "media",
    logros_fracasos: "media",
    futuro_comercio_ia: "media",
    preguntas_fundadores: "media",
    co_creacion_features: "baja",
    rubros: "baja",
  },
};

type LegacyTopicMap = { roleId: ContentRoleId; topicId: string };

/** Pilar global → temas por rol. No conservamos catch-alls. */
export const LEGACY_PILLAR_TO_TOPICS: Record<string, LegacyTopicMap[]> = {
  "ventas-atencion": [
    { roleId: "educacion", topicId: "ventas_atencion" },
    { roleId: "producto", topicId: "whatsapp" },
    { roleId: "comunidad", topicId: "dolores_operativos" },
  ],
  "inventario-stock": [
    { roleId: "educacion", topicId: "inventario_stock" },
    { roleId: "producto", topicId: "stock_variantes" },
    { roleId: "comunidad", topicId: "dolores_operativos" },
  ],
  "pedidos-logistica": [
    { roleId: "educacion", topicId: "pedidos_logistica" },
    { roleId: "producto", topicId: "pedidos" },
  ],
  "pagos-cobros": [
    { roleId: "educacion", topicId: "pagos_cobros" },
    { roleId: "producto", topicId: "pagos_cobros" },
  ],
  "catalogo-ecommerce": [
    { roleId: "educacion", topicId: "catalogo_ecommerce" },
    { roleId: "producto", topicId: "catalogo_importaciones" },
    { roleId: "producto", topicId: "storefront_personalizacion" },
  ],
  "operacion-gestion": [
    { roleId: "educacion", topicId: "operacion_gestion" },
    { roleId: "educacion", topicId: "digitalizacion_sistemas" },
    { roleId: "marca", topicId: "orden_vs_fragmentacion" },
  ],
  "marketing-crecimiento": [
    { roleId: "educacion", topicId: "conversion_trafico" },
    { roleId: "build_in_public", topicId: "crecimiento_distribucion" },
  ],
  "automatizacion-ia": [
    { roleId: "educacion", topicId: "automatizacion_ia" },
    { roleId: "producto", topicId: "ia_catalogo" },
    { roleId: "marca", topicId: "ia_operativa_control_humano" },
    { roleId: "comunidad", topicId: "futuro_comercio_ia" },
  ],
  "equipo-sucursales": [
    { roleId: "educacion", topicId: "equipo_delegacion" },
    { roleId: "producto", topicId: "equipo_permisos" },
  ],
  "clientes-fidelizacion": [
    { roleId: "educacion", topicId: "clientes_fidelizacion" },
    { roleId: "evidencia", topicId: "casos_clientes" },
  ],
  "numeros-negocio": [
    { roleId: "educacion", topicId: "numeros_negocio" },
    { roleId: "producto", topicId: "metricas" },
    { roleId: "build_in_public", topicId: "metricas_traccion" },
  ],
  "producto-mercantis": [
    { roleId: "producto", topicId: "onboarding_tienda" },
    { roleId: "producto", topicId: "catalogo_importaciones" },
    { roleId: "producto", topicId: "stock_variantes" },
    { roleId: "producto", topicId: "pedidos" },
    { roleId: "producto", topicId: "ia_catalogo" },
  ],
  emprendimiento: [
    { roleId: "build_in_public", topicId: "fundadores_equipo" },
    { roleId: "marca", topicId: "odisea_emprender" },
    { roleId: "comunidad", topicId: "rutinas_negocio" },
    { roleId: "comunidad", topicId: "logros_fracasos" },
  ],
  "mercado-tendencias": [
    { roleId: "marca", topicId: "futuro_ecommerce" },
    { roleId: "educacion", topicId: "conversion_trafico" },
    { roleId: "comunidad", topicId: "opiniones_industria" },
  ],
  estudiantes: [{ roleId: "comunidad", topicId: "rubros" }],
  whatsapp: [
    { roleId: "producto", topicId: "whatsapp" },
    { roleId: "educacion", topicId: "ventas_atencion" },
  ],
};

export function getTopicsForRole(roleId: string): RoleTopic[] {
  return ROLE_TOPICS[normalizeRoleId(roleId)] ?? [];
}

export function getRoleTopic(
  roleId: string,
  topicId: string | undefined,
): RoleTopic | undefined {
  if (!topicId) return undefined;
  return getTopicsForRole(roleId).find((topic) => topic.id === topicId);
}

export function isTopicCompatibleWithRole(
  roleId: string,
  topicId: string | undefined,
): boolean {
  return Boolean(getRoleTopic(roleId, topicId));
}

export function getRoleTopicLabel(roleId: string, topicId?: string): string {
  return getRoleTopic(roleId, topicId)?.label ?? topicId ?? "Tema";
}

export function getRoleTopicSummary(roleId: string, topicId?: string): string {
  return getRoleTopic(roleId, topicId)?.summary ?? "";
}

export function getRoleTopicLabelLoose(topicId?: string): string {
  if (!topicId) return "Tema";
  for (const role of contentRoles) {
    const match = getRoleTopic(role.id, topicId);
    if (match) return match.label;
  }
  return topicId;
}

export function cloneDefaultRoleTopicPreferences(): RoleTopicPreferences {
  const result = {} as RoleTopicPreferences;
  for (const role of contentRoles) {
    result[role.id] = { ...DEFAULT_PRIORITY[role.id] };
  }
  return result;
}

const LEGACY_PILLAR_ID: Record<string, string> = {
  whatsapp: "ventas-atencion",
  inventario: "inventario-stock",
  pagos: "pagos-cobros",
  producto: "producto-mercantis",
  operacion: "operacion-gestion",
  emprendimiento: "emprendimiento",
  tendencias: "mercado-tendencias",
};

function normalizeLegacyPillarId(id: string): string {
  return LEGACY_PILLAR_ID[id] ?? id;
}

function weightToPriority(weight: number): TopicPriority {
  if (weight <= 0) return "no";
  if (weight <= 8) return "baja";
  if (weight <= 20) return "media";
  return "alta";
}

function hasIncomingTopicPrefs(
  incoming?: Partial<RoleTopicPreferences>,
): boolean {
  if (!incoming) return false;
  return Object.values(incoming).some((roleMap) =>
    Object.values(roleMap ?? {}).some(Boolean),
  );
}

function applyLegacyPillarTargets(
  prefs: RoleTopicPreferences,
  pillarTargets: Record<string, number>,
) {
  for (const [rawId, weight] of Object.entries(pillarTargets)) {
    const pillarId = normalizeLegacyPillarId(rawId);
    const mapped = LEGACY_PILLAR_TO_TOPICS[pillarId] ?? [];
    const priority = weightToPriority(weight ?? 0);
    for (const item of mapped) {
      if (!getRoleTopic(item.roleId, item.topicId)) continue;
      prefs[item.roleId][item.topicId] = priority;
    }
  }
}

export function normalizeRoleTopicPreferences(
  incoming?: Partial<RoleTopicPreferences>,
  pillarTargets?: Record<string, number>,
): RoleTopicPreferences {
  const result = cloneDefaultRoleTopicPreferences();

  if (hasIncomingTopicPrefs(incoming)) {
    for (const role of contentRoles) {
      const incomingRole = incoming?.[role.id] ?? {};
      for (const topic of getTopicsForRole(role.id)) {
        const value = incomingRole[topic.id];
        if (
          value === "alta" ||
          value === "media" ||
          value === "baja" ||
          value === "no"
        ) {
          result[role.id][topic.id] = value;
        }
      }
    }
    return result;
  }

  if (
    pillarTargets &&
    Object.values(pillarTargets).some((value) => (value ?? 0) > 0)
  ) {
    applyLegacyPillarTargets(result, pillarTargets);
  }

  return result;
}

export function topicTargetsForRole(
  prefs: RoleTopicPreferences | undefined,
  roleId: ContentRoleId | string,
): Record<string, number> {
  const normalized = normalizeRoleId(roleId);
  const resolved = normalizeRoleTopicPreferences(prefs);
  const targets: Record<string, number> = {};
  for (const topic of getTopicsForRole(normalized)) {
    const priority = resolved[normalized][topic.id] ?? "media";
    const weight = TOPIC_PRIORITY_WEIGHT[priority];
    if (weight > 0) targets[topic.id] = weight;
  }
  return targets;
}

export function roleHasEnabledTopic(
  prefs: RoleTopicPreferences | undefined,
  roleId: ContentRoleId | string,
): boolean {
  return Object.values(topicTargetsForRole(prefs, roleId)).some(
    (value) => value > 0,
  );
}

export function activeRolesHaveTopics(
  roleTargets: Partial<Record<string, number>> | undefined,
  prefs: RoleTopicPreferences | undefined,
): boolean {
  const entries = Object.entries(roleTargets ?? {}).filter(
    ([, value]) => (value ?? 0) > 0,
  );
  if (entries.length === 0) return false;
  return entries.every(([roleId]) => roleHasEnabledTopic(prefs, roleId));
}

export function resolveSlotTopicId(slot: {
  roleId: string;
  topicId?: string;
  pillarId?: string;
}): string {
  if (isTopicCompatibleWithRole(slot.roleId, slot.topicId) && slot.topicId) {
    return slot.topicId;
  }
  const mapped = mapLegacyPillarToTopic(slot.roleId, slot.pillarId);
  if (mapped) return mapped;
  return ROLE_TOPIC_FALLBACKS[normalizeRoleId(slot.roleId)];
}

export function getSlotTopicLabel(slot: {
  roleId: string;
  topicId?: string;
  pillarId?: string;
}): string {
  return getRoleTopicLabel(slot.roleId, resolveSlotTopicId(slot));
}

export function getSlotTopicSummary(slot: {
  roleId: string;
  topicId?: string;
  pillarId?: string;
}): string {
  return getRoleTopicSummary(slot.roleId, resolveSlotTopicId(slot));
}

export function mapLegacyPillarToTopic(
  roleId: string,
  pillarId: string | undefined,
): string | undefined {
  if (!pillarId) return undefined;
  const normalizedRole = normalizeRoleId(roleId);
  const mapped = LEGACY_PILLAR_TO_TOPICS[normalizeLegacyPillarId(pillarId)] ?? [];
  const forRole = mapped.find((item) => item.roleId === normalizedRole);
  return forRole?.topicId;
}

export function brainRefsForTopic(
  roleId: string,
  topicId: string | undefined,
): string[] {
  const topic = getRoleTopic(roleId, topicId);
  return [...ALWAYS_BRAIN, ...(topic?.brainRefs ?? [])];
}

export function topicPrioritySummary(
  prefs: RoleTopicPreferences | undefined,
  roleId: ContentRoleId,
): string {
  const resolved = normalizeRoleTopicPreferences(prefs)[roleId];
  const counts = { alta: 0, media: 0, baja: 0, no: 0 };
  for (const topic of getTopicsForRole(roleId)) {
    counts[resolved[topic.id] ?? "media"] += 1;
  }
  const parts = [
    counts.alta ? `${counts.alta} alta` : null,
    counts.media ? `${counts.media} media` : null,
    counts.baja ? `${counts.baja} baja` : null,
    counts.no ? `${counts.no} no` : null,
  ].filter(Boolean);
  return parts.join(" · ") || "Sin temas";
}

export { ALWAYS_BRAIN };
