export type IdeaSourceTab = {
  id: string;
  label: string;
  items: string[];
};

export const IDEA_SOURCE_TABS: IdeaSourceTab[] = [
  {
    id: "cliente",
    label: "Cliente",
    items: [
      "dolores",
      "objeciones",
      "errores",
      "preguntas frecuentes",
      "conversaciones de ventas/soporte",
      "comentarios de usuarios",
    ],
  },
  {
    id: "organico",
    label: "Orgánico",
    items: [
      "TikTok",
      "Instagram",
      "YouTube",
      "posts que explotan",
      "hooks que repiten",
      "comentarios debajo de esos posts",
    ],
  },
  {
    id: "publicidad",
    label: "Publicidad",
    items: [
      "Meta Ad Library",
      "TikTok Creative Center",
      "qué están empujando con plata",
      "ofertas, promesas, hooks y creativos",
    ],
  },
  {
    id: "creativo",
    label: "Creativo",
    items: [
      "Cosmos",
      "Pinterest",
      "cuentas de diseño",
      "marcas de otras industrias",
      "formatos visuales/storytelling que puedas trasladar a Mercantis",
    ],
  },
  {
    id: "tendencias",
    label: "Tendencias",
    items: [
      "búsquedas TikTok",
      "audios/memes",
      "formatos emergentes",
      "temas que aparecen repetidamente",
      "noticias relacionadas con negocios/emprendedores",
    ],
  },
  {
    id: "datos",
    label: "Datos",
    items: [
      "posts anteriores",
      "mejores hooks",
      "mejores retenciones",
      "comentarios",
      "leads",
      "funcionalidades de Mercantis que generan interés",
    ],
  },
  {
    id: "ideacion",
    label: "Ideación",
    items: [
      "agarrar un problema",
      "cuestionar una creencia",
      "hacer una comparación",
      "contar una historia",
      "llevar algo al extremo",
      "plantear una contradicción",
      "buscar un enfoque que nadie esté usando",
    ],
  },
];
