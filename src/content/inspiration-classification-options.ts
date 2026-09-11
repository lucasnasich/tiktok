export type InspirationClassificationOption = {
  id: string;
  label: string;
  summary: string;
};

/** Qué transmite o enseña la referencia — reemplaza texto libre de señal. */
export const inspirationSignalTags: InspirationClassificationOption[] = [
  {
    id: "dolor-identificable",
    label: "Dolor identificable",
    summary: "El público se reconoce en el problema antes de ver la solución.",
  },
  {
    id: "contraste-solucion",
    label: "Contraste / solución",
    summary: "Antes vs después, manual vs sistema, caos vs orden.",
  },
  {
    id: "tip-educativo",
    label: "Tip educativo",
    summary: "Enseña algo aplicable sin vender de entrada.",
  },
  {
    id: "lista-razones",
    label: "Lista de razones",
    summary: "Enumeración que escanea rápido y frena el scroll.",
  },
  {
    id: "caso-prueba",
    label: "Caso o prueba",
    summary: "Resultado, testimonio, demo o evidencia concreta.",
  },
  {
    id: "humor-relatable",
    label: "Humor relatable",
    summary: "Situación cotidiana exagerada que genera identificación.",
  },
  {
    id: "opinion-polemica",
    label: "Opinión polémica",
    summary: "Cuestiona una creencia o práctica común del rubro.",
  },
  {
    id: "estetica-mood",
    label: "Estética / mood",
    summary: "Referencia visual: color, composición, ritmo, look & feel.",
  },
  {
    id: "hook-curiosidad",
    label: "Hook de curiosidad",
    summary: "Abre con pregunta, dato raro o promesa que obliga a seguir.",
  },
  {
    id: "tendencia-adaptable",
    label: "Tendencia adaptable",
    summary: "Formato o meme del momento que se puede adaptar a Mercantis.",
  },
  {
    id: "conversacion-comunidad",
    label: "Conversación / comunidad",
    summary: "Invita a opinar, comentar o tomar postura.",
  },
  {
    id: "cta-directo",
    label: "CTA directo",
    summary: "Lleva a acción clara: probar, registrarse, escribir, etc.",
  },
  {
    id: "storytelling-escena",
    label: "Storytelling / escena",
    summary: "Mini historia con personaje, tensión y giro.",
  },
  {
    id: "dato-impacto",
    label: "Dato de impacto",
    summary: "Número, estadística o titular que ancla credibilidad.",
  },
];

/** Recursos creativos que usa la pieza — reemplaza texto libre de mecanismo. */
export const inspirationCreativeMechanisms: InspirationClassificationOption[] = [
  {
    id: "hook-primer-segundo",
    label: "Hook en el primer segundo",
    summary: "El gancho visual o verbal aparece antes de los 2 s.",
  },
  {
    id: "texto-overlay",
    label: "Texto en pantalla",
    summary: "Títulos, subtítulos o bullets superpuestos al video/imagen.",
  },
  {
    id: "voz-en-off",
    label: "Voz en off",
    summary: "Narración sin cara a cámara o mezclada con B-roll.",
  },
  {
    id: "cara-a-camara",
    label: "Cara a cámara",
    summary: "Talking head como ancla humana del contenido.",
  },
  {
    id: "pantalla-grabada",
    label: "Pantalla grabada",
    summary: "Screen recording de app, dashboard, WhatsApp o planilla.",
  },
  {
    id: "split-screen",
    label: "Split screen",
    summary: "Dos mundos en paralelo en la misma toma o slide.",
  },
  {
    id: "transicion-match",
    label: "Transición match-cut",
    summary: "Corte o transición que conecta dos escenas por movimiento o forma.",
  },
  {
    id: "carousel-slides",
    label: "Carrusel / slides",
    summary: "Secuencia de placas estáticas con ritmo de swipe.",
  },
  {
    id: "comentario-gancho",
    label: "Comentario como gancho",
    summary: "El texto del comentario o reply es el hook principal.",
  },
  {
    id: "musica-trend",
    label: "Música / audio trend",
    summary: "El audio trending estructura el ritmo o el chiste.",
  },
  {
    id: "subtitulos-dinamicos",
    label: "Subtítulos dinámicos",
    summary: "Captions animados que guían la lectura palabra a palabra.",
  },
  {
    id: "zoom-crop",
    label: "Zoom / crop dramático",
    summary: "Acercamiento o recorte para enfatizar detalle o reacción.",
  },
  {
    id: "b-roll-producto",
    label: "B-roll de producto",
    summary: "Planos de apoyo que muestran el objeto, local o resultado.",
  },
  {
    id: "plantilla-repetible",
    label: "Plantilla repetible",
    summary: "Estructura fija que podés replicar semana a semana.",
  },
  {
    id: "garabato-anotacion",
    label: "Garabato / anotación",
    summary: "Doodles, flechas o subrayados sobre la imagen o video.",
  },
  {
    id: "green-screen",
    label: "Green screen",
    summary: "Fondo reemplazable detrás del presentador.",
  },
];

const signalTagById = new Map(
  inspirationSignalTags.map((entry) => [entry.id, entry]),
);
const mechanismById = new Map(
  inspirationCreativeMechanisms.map((entry) => [entry.id, entry]),
);

export function getInspirationSignalTagLabel(id: string): string {
  return signalTagById.get(id)?.label ?? id;
}

export function getInspirationCreativeMechanismLabel(id: string): string {
  return mechanismById.get(id)?.label ?? id;
}

export function labelsFromIds(
  ids: string[] | undefined,
  lookup: (id: string) => string,
): string {
  return (ids ?? []).map(lookup).filter(Boolean).join(" · ");
}
