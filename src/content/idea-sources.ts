export type InspirationTopic = {
  id: string;
  label: string;
  summary: string;
};

export type IdeaSource = {
  id: string;
  label: string;
  summary: string;
  topics: InspirationTopic[];
};

export const IDEA_SOURCES: IdeaSource[] = [
  {
    id: "cliente",
    label: "Cliente",
    summary:
      "Ejemplos reales de clientes: dolores, objeciones, errores y frases de ventas o soporte.",
    topics: [],
  },
  {
    id: "organico",
    label: "Orgánico",
    summary:
      "Piezas orgánicas guardadas: posts con vista previa y comentarios con link al post.",
    topics: [],
  },
  {
    id: "publicidad",
    label: "Publicidad",
    summary:
      "Qué están empujando con plata en Meta y TikTok: ofertas, promesas y creativos pagos.",
    topics: [
      {
        id: "meta-ad-library",
        label: "Meta Ad Library",
        summary: "Anuncios activos de competidores: ángulos, ofertas y creativos.",
      },
      {
        id: "tiktok-creative-center",
        label: "TikTok Creative Center",
        summary: "Ads y tendencias que TikTok destaca para tu categoría.",
      },
      {
        id: "pushes-pauta",
        label: "Qué empujan con plata",
        summary: "En qué invierten fuerte: producto, dolor o promesa principal.",
      },
      {
        id: "ofertas-promesas",
        label: "Ofertas y hooks",
        summary: "Promesas, CTAs y estructura de los creativos pagos.",
      },
    ],
  },
  {
    id: "creativo",
    label: "Creativo",
    summary:
      "Referencias creativas guardadas: links con vista previa (Cosmos, Pinterest, Instagram, etc.).",
    topics: [],
  },
  {
    id: "tendencias",
    label: "Tendencias",
    summary:
      "Lo que está ganando tracción ahora: búsquedas, audios, formatos y temas recurrentes.",
    topics: [
      {
        id: "busquedas-tiktok",
        label: "Búsquedas TikTok",
        summary: "Términos en alza relacionados con negocios y emprendedores.",
      },
      {
        id: "audios-memes",
        label: "Audios y memes",
        summary: "Sonidos y formatos virales que podés usar con criterio.",
      },
      {
        id: "formatos-emergentes",
        label: "Formatos emergentes",
        summary: "Tipos de post nuevos que empiezan a repetirse en el feed.",
      },
      {
        id: "temas-recurrentes",
        label: "Temas recurrentes",
        summary: "Conversaciones que aparecen en varias cuentas a la vez.",
      },
      {
        id: "noticias-negocios",
        label: "Noticias del rubro",
        summary: "Novedades de negocios y emprendedores con ángulo de contenido.",
      },
    ],
  },
  {
    id: "datos",
    label: "Datos",
    summary:
      "Lo que ya publicaste vos: métricas, hooks, retención y señales de interés en el producto.",
    topics: [
      {
        id: "posts-anteriores",
        label: "Posts anteriores",
        summary: "Qué publicaste, cómo performó y qué aprendiste.",
      },
      {
        id: "mejores-hooks",
        label: "Mejores hooks",
        summary: "Aperturas que más retuvieron o generaron interacción.",
      },
      {
        id: "mejores-retenciones",
        label: "Mejores retenciones",
        summary: "En qué slide o segundo se quedó la gente mirando.",
      },
      {
        id: "comentarios-propios",
        label: "Comentarios",
        summary: "Qué preguntaron, qué criticaron y qué pidieron en tus posts.",
      },
      {
        id: "leads",
        label: "Leads",
        summary: "De dónde llegaron y qué les interesó antes de contactar.",
      },
      {
        id: "funcionalidades-interes",
        label: "Interés en el producto",
        summary: "Features de Mercantis que más preguntan o activan en demos.",
      },
    ],
  },
  {
    id: "ideacion",
    label: "Ideación",
    summary:
      "Armar desde cero sin input externo: problemas, creencias, comparaciones y enfoques nuevos.",
    topics: [
      {
        id: "agarrar-problema",
        label: "Agarrar un problema",
        summary: "Elegir un dolor concreto y llevarlo al centro del post.",
      },
      {
        id: "cuestionar-creencia",
        label: "Cuestionar una creencia",
        summary: "Desafiar algo que el mercado da por sentado.",
      },
      {
        id: "comparacion",
        label: "Hacer una comparación",
        summary: "Contraponer dos formas de operar o dos resultados.",
      },
      {
        id: "contar-historia",
        label: "Contar una historia",
        summary: "Situación real con inicio, tensión y giro.",
      },
      {
        id: "llevar-extremo",
        label: "Llevar al extremo",
        summary: "Exagerar el caos o el alivio para que se note el contraste.",
      },
      {
        id: "contradiccion",
        label: "Plantear una contradicción",
        summary: "Dos verdades que chocan y obligan a pensar distinto.",
      },
      {
        id: "enfoque-nuevo",
        label: "Enfoque que nadie usa",
        summary: "Ángulo que no está saturado en tu categoría todavía.",
      },
    ],
  },
];

export const INSPIRATION_ALL_SOURCE_ID = "todos";

export const INSPIRATION_ALL_SOURCE = {
  id: INSPIRATION_ALL_SOURCE_ID,
  label: "Todos",
  summary: "Todas las referencias guardadas, de cualquier fuente.",
};

export function getSourceById(id: string) {
  if (id === INSPIRATION_ALL_SOURCE.id) return INSPIRATION_ALL_SOURCE;
  return IDEA_SOURCES.find((source) => source.id === id);
}

export function getSourceLabel(id: string) {
  return getSourceById(id)?.label ?? id;
}
