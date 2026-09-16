import { resolveSlotTopicId } from "@/content/role-topics";

export const TOPIC_SIGNAL_PRESETS: Record<
  string,
  Array<{ id: string; label: string; signal: string }>
> = {
  ventas_atencion: [
    { id: "dolor", label: "Dolor", signal: "El negocio vive en WhatsApp y las consultas se escapan." },
    { id: "comparacion", label: "Comparación", signal: "Chat suelto vs. un sistema que no pierde consultas." },
  ],
  inventario_stock: [
    { id: "dolor", label: "Dolor", signal: "El stock está en la cabeza, en Excel y en el local." },
    { id: "comparacion", label: "Comparación", signal: "Adivinar faltantes vs. ver el inventario en un solo lugar." },
  ],
  operacion_gestion: [
    { id: "dolor", label: "Dolor", signal: "El día se va en planillas, copiar y pegar, y apagar incendios." },
    { id: "storytelling", label: "Storytelling", signal: "La escena de todos los días operando el negocio a mano." },
  ],
  digitalizacion_sistemas: [
    { id: "dolor", label: "Dolor", signal: "WhatsApp + Excel + memoria todavía son el sistema." },
    { id: "comparacion", label: "Comparación", signal: "Herramientas sueltas vs. una operación más estructurada." },
  ],
  onboarding_tienda: [
    { id: "dolor", label: "Dolor", signal: "Arrancar una tienda no debería sentirse como un proyecto de software." },
    { id: "comparacion", label: "Comparación", signal: "Configurar todo a mano vs. poner una tienda en marcha." },
  ],
  stock_variantes: [
    { id: "dolor", label: "Dolor", signal: "Las variantes se desordenan y el stock deja de coincidir." },
    { id: "comparacion", label: "Comparación", signal: "Adivinar disponibilidad vs. ver stock por variante." },
  ],
  ia_catalogo: [
    { id: "dolor", label: "Dolor", signal: "Cargar el catálogo a mano se come el día." },
    { id: "comparacion", label: "Comparación", signal: "Títulos a mano vs. IA que sugiere y el humano confirma." },
  ],
  casos_clientes: [
    { id: "evidencia", label: "Evidencia", signal: "Un negocio real usando Mercantis, sin inventar resultados." },
    { id: "storytelling", label: "Storytelling", signal: "La historia concreta de cómo opera ese comercio." },
  ],
  dolores_operativos: [
    { id: "pregunta", label: "Pregunta", signal: "Preguntar qué parte de operar el negocio se come más tiempo." },
    { id: "dolor", label: "Dolor", signal: "Stock, pedidos o WhatsApp como conversación, no como tutorial." },
  ],
  sistema_operativo_negocio: [
    { id: "postura", label: "Postura", signal: "Mercantis es más que una tienda online: es el sistema del negocio." },
    { id: "comparacion", label: "Comparación", signal: "Otra app más vs. un sistema para operar." },
  ],
};

const DEFAULT_PRESETS = [
  {
    id: "dolor",
    label: "Dolor",
    signal: "El dueño opera el negocio a mano.",
  },
  {
    id: "comparacion",
    label: "Comparación",
    signal: "Trabajar fragmentado vs. un solo sistema.",
  },
];

export function signalPresetsForTopic(slot: {
  roleId: string;
  topicId?: string;
  pillarId?: string;
}) {
  const topicId = resolveSlotTopicId(slot);
  return TOPIC_SIGNAL_PRESETS[topicId] ?? DEFAULT_PRESETS;
}

/** @deprecated Usar signalPresetsForTopic */
export function signalPresetsForPillar(pillarId: string) {
  return signalPresetsForTopic({ roleId: "educacion", pillarId });
}
