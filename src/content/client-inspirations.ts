export type ClienteInspirationType =
  | "dolor"
  | "objecion"
  | "error"
  | "pregunta-frecuente"
  | "comentario"
  | "ventas-soporte";

export type ClienteInspiration = {
  id: string;
  type: ClienteInspirationType;
  text: string;
  context?: string;
};

export const CLIENTE_INSPIRATION_TYPE_LABELS: Record<ClienteInspirationType, string> = {
  dolor: "Dolor",
  objecion: "Objeción",
  error: "Error",
  "pregunta-frecuente": "Pregunta frecuente",
  comentario: "Comentario",
  "ventas-soporte": "Ventas y soporte",
};

export const clientInspirations: ClienteInspiration[] = [
  {
    id: "dolor-whatsapp",
    type: "dolor",
    text: "Pierdo dos horas por día respondiendo lo mismo por WhatsApp.",
    context: "Dueño de ferretería, demo de ventas.",
  },
  {
    id: "dolor-stock",
    type: "dolor",
    text: "No sé si tengo stock hasta que abro la planilla y reviso celda por celda.",
  },
  {
    id: "dolor-crecimiento",
    type: "dolor",
    text: "Vendimos más este mes y estamos más cansados que antes.",
    context: "Conversación post-venta.",
  },
  {
    id: "objecion-complejidad",
    type: "objecion",
    text: "Ya probé un sistema y era demasiado complicado para mi equipo.",
  },
  {
    id: "objecion-tiempo",
    type: "objecion",
    text: "No tengo tiempo de aprender otra herramienta ahora.",
    context: "Objeción en llamada de cierre.",
  },
  {
    id: "objecion-precio",
    type: "objecion",
    text: "Con Excel me alcanza, ¿por qué pagaría otra cosa?",
  },
  {
    id: "error-doble-registro",
    type: "error",
    text: "Toman el pedido por WhatsApp y después lo cargan manual en la planilla.",
  },
  {
    id: "error-planillas",
    type: "error",
    text: "Tienen stock en una planilla y pedidos en otra que no se hablan.",
  },
  {
    id: "error-sin-seguimiento",
    type: "error",
    text: "Pierden pedidos porque nadie sabe cuál fue el último mensaje atendido.",
  },
  {
    id: "faq-whatsapp",
    type: "pregunta-frecuente",
    text: "¿Puedo seguir atendiendo por WhatsApp?",
  },
  {
    id: "faq-implementacion",
    type: "pregunta-frecuente",
    text: "¿Cuánto tarda en quedar andando?",
  },
  {
    id: "faq-equipo",
    type: "pregunta-frecuente",
    text: "¿Mi empleada lo va a poder usar sin ser técnica?",
  },
  {
    id: "comentario-excel",
    type: "comentario",
    text: "Llevamos años con Excel, no sé si vale la pena cambiar.",
    context: "Comentario en encuesta NPS.",
  },
  {
    id: "comentario-sistema-unico",
    type: "comentario",
    text: "Necesito algo que una pedidos y stock, no otra app suelta más.",
    context: "Review en Google.",
  },
  {
    id: "ventas-pain-close",
    type: "ventas-soporte",
    text: "Si me mostrás cómo ordenar los pedidos sin complicarme, lo pruebo.",
    context: "Cierre de demo.",
  },
  {
    id: "soporte-onboarding",
    type: "ventas-soporte",
    text: "Mi mayor miedo es que el equipo no lo use y sigamos en el caos.",
    context: "Soporte, primera semana.",
  },
];
