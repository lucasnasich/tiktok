export type Format = {
  id: string;
  label: string;
  summary: string;
};

export const INSPIRATION_ALL_FORMATS_ID = "all";

export const formats: Format[] = [
  {
    id: "x-razones",
    label: "X razones por las que",
    summary: "Lista numerada con argumentos. Hook directo y fácil de escanear.",
  },
  {
    id: "historia-instagram",
    label: "Historia de Instagram",
    summary: "Pantalla tipo story: sticker, texto corto y CTA swipe up.",
  },
  {
    id: "nosotros-vs-ellos",
    label: "Nosotros vs. ellos",
    summary: "Contraste de marca o producto frente a la alternativa obvia.",
  },
  {
    id: "diagrama-venn",
    label: "Diagrama de Venn",
    summary: "Dos mundos que se cruzan en el sweet spot de tu propuesta.",
  },
  {
    id: "no-compres-esto",
    label: "No compres esto",
    summary: "Hook negativo que filtra y genera curiosidad antes del giro.",
  },
  {
    id: "nota-iphone",
    label: "Nota del iPhone",
    summary: "Screenshot de notas: confesional, crudo y muy compartible.",
  },
  {
    id: "captura-chat",
    label: "Captura de chat",
    summary: "Conversación simulada que dramatiza el problema o la objeción.",
  },
  {
    id: "pizarra",
    label: "Pizarra",
    summary: "Explicación a mano alzada. Educativo y humano.",
  },
  {
    id: "alerta-poco-stock",
    label: "Alerta de poco stock",
    summary: "Escasez visual. Empuja acción sin sonar a promo genérica.",
  },
  {
    id: "pedimos-disculpas",
    label: "Pedimos disculpas",
    summary: "Tono contrarian: admitís algo para introducir el cambio.",
  },
  {
    id: "testimonio-cliente",
    label: "Testimonio de cliente",
    summary: "Prueba social con quote, resultado o antes/después real.",
  },
  {
    id: "lo-nuevo-vs-lo-viejo",
    label: "Lo nuevo vs. lo viejo",
    summary: "Comparás método actual vs. la forma que proponés.",
  },
  {
    id: "ultima-hora",
    label: "Última hora",
    summary: "Breaking news falso o real para abrir con urgencia editorial.",
  },
  {
    id: "transformacion",
    label: "Transformación",
    summary: "Antes y después en un solo slide o secuencia visual.",
  },
  {
    id: "estilo-reddit",
    label: "Estilo Reddit",
    summary: "Post de foro: título + upvotes + comentarios como narrativa.",
  },
  {
    id: "en-caso-de-emergencia",
    label: "En caso de emergencia",
    summary: "Placa o sticker de emergencia que rompe el patrón del feed.",
  },
  {
    id: "busqueda-google",
    label: "Búsqueda de Google",
    summary: "Query + resultados que validan el dolor o la solución.",
  },
  {
    id: "problema-vs-solucion",
    label: "Problema vs. solución",
    summary: "Split claro: dolor arriba, salida abajo (o lado a lado).",
  },
  {
    id: "efecto-secundario",
    label: "Efecto secundario",
    summary: "Parodia de fármaco: listás “efectos” positivos con humor.",
  },
  {
    id: "oferta-combo",
    label: "Oferta combo",
    summary: "Paquete de beneficios presentado como menú o bundle.",
  },
  {
    id: "titular-con-dato",
    label: "Titular con dato",
    summary: "Número o estadística grande que ancla credibilidad.",
  },
  {
    id: "garabato",
    label: "Garabato",
    summary: "Doodle sobre foto o video. Explicás en 5 segundos.",
  },
  {
    id: "captura-email",
    label: "Captura de email",
    summary: "Inbox o newsletter como prueba de valor o autoridad.",
  },
  {
    id: "no-seas-ese-que",
    label: "No seas ese que…",
    summary: "Call-out al comportamiento que tu audiencia quiere evitar.",
  },
  {
    id: "resenas",
    label: "Reseñas",
    summary: "Estrellas, quotes o screenshots de reviews reales.",
  },
  {
    id: "texto-sobre-la-piel",
    label: "Texto sobre la piel",
    summary: "Tipografía sobre textura humana. Íntimo y premium.",
  },
  {
    id: "podcast-ia",
    label: "Podcast con IA",
    summary: "Clip estilo podcast o diálogo generado para explicar un tema.",
  },
  {
    id: "tier-list",
    label: "Tier list",
    summary: "Ranking visual S/A/B/C. Engancha por debate y comparación.",
  },
  {
    id: "cero-estrellas",
    label: "Cero estrellas",
    summary: "Review negativa invertida o ironía sobre la competencia.",
  },
  {
    id: "green-screen",
    label: "Green screen",
    summary: "Talking head sobre fondo dinámico (demo, tweet, dashboard).",
  },
  {
    id: "x-senales",
    label: "X señales",
    summary: "Lista de red flags o señales de alerta. Muy identificable.",
  },
  {
    id: "mito-vs-realidad",
    label: "Mito vs. realidad",
    summary: "Desmontás una creencia común en dos columnas o slides.",
  },
  {
    id: "problemas-tachados",
    label: "Problemas tachados",
    summary: "Lista de dolores con strikethrough al resolver cada uno.",
  },
  {
    id: "lo-que-podes-evitar",
    label: "Lo que podés evitar",
    summary: "Enfoque en aliviar fricción: qué dejás de sufrir.",
  },
  {
    id: "advertencia",
    label: "Advertencia",
    summary: "Placa WARNING o alerta visual. Urgencia y patrón interrupt.",
  },
];

const formatById = new Map(formats.map((format) => [format.id, format]));

export function getFormatById(id: string): Format | undefined {
  return formatById.get(id);
}

export function getFormatLabel(id: string): string {
  return formatById.get(id)?.label ?? id;
}

export function getFormatLabels(ids: string[]): string[] {
  return ids.map((id) => getFormatLabel(id));
}

export function matchesFormatFilter(
  formatIds: string[] | undefined,
  activeFormatId: string,
): boolean {
  if (activeFormatId === INSPIRATION_ALL_FORMATS_ID) return true;
  return formatIds?.includes(activeFormatId) ?? false;
}
